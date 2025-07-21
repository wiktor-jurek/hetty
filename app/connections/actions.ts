'use server';

import { z } from 'zod';
import { db } from '@/lib/db/drizzle';
import { lookerConnections, memberships, organisations, connections, joinRequests } from '@/lib/db/schema';
import { encrypt } from '@/lib/crypto';
import { auth } from '@/lib/auth';
import { eq, and } from 'drizzle-orm';
import { headers } from 'next/headers';

// Define the schema for input validation using Zod
const connectionSchema = z.object({
  lookerUrl: z.string().url('Please enter a valid URL.'),
  lookerPort: z.coerce.number().optional(),
  clientId: z.string().min(1, 'Client ID is required.'),
  clientSecret: z.string().min(1, 'Client Secret is required.'),
  organizationName: z.string().min(1, 'Organization name is required.').optional(),
});

// Define the shape of the state returned by the action
export type FormState = {
  message: string;
  success: boolean;
  requiresOrganization?: boolean;
  existingOrganization?: {
    id: number;
    name: string;
  };
  joinRequestSent?: boolean;
};

export async function createLookerConnection(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  console.log('createLookerConnection called with formData:', {
    lookerUrl: formData.get('lookerUrl'),
    lookerPort: formData.get('lookerPort'),
    clientId: formData.get('clientId'),
    clientSecret: formData.get('clientSecret') ? '[REDACTED]' : 'undefined',
    organizationName: formData.get('organizationName'),
  });
  
  try {
    // 1. Get current user
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return { success: false, message: 'Authentication required.' };
    }

    const userId = session.user.id;

    // 2. Validate form data
    const portValue = formData.get('lookerPort');
    const validatedFields = connectionSchema.safeParse({
      lookerUrl: formData.get('lookerUrl'),
      lookerPort: portValue === '' || portValue === null ? undefined : portValue,
      clientId: formData.get('clientId'),
      clientSecret: formData.get('clientSecret'),
      organizationName: formData.get('organizationName') || undefined,
    });

    if (!validatedFields.success) {
      const fieldErrors = validatedFields.error.flatten().fieldErrors;
      const errorMessage = 
        fieldErrors.lookerUrl?.[0] ||
        fieldErrors.clientId?.[0] ||
        fieldErrors.clientSecret?.[0] ||
        fieldErrors.organizationName?.[0] ||
        fieldErrors.lookerPort?.[0] ||
        `Validation failed: ${Object.entries(fieldErrors).map(([field, errors]) => `${field}: ${errors?.[0]}`).join(', ')}` ||
        'Invalid input.';
      
      console.error('Validation failed:', fieldErrors);
      return {
        success: false,
        message: errorMessage,
      };
    }
    
    const { lookerUrl, lookerPort, clientId, clientSecret, organizationName } = validatedFields.data;

    // 3. Check if user already belongs to an organization
    const userMembership = await db.select({
      organisationId: memberships.organisationId,
      role: memberships.role
    }).from(memberships).where(eq(memberships.userId, userId)).limit(1);

    // 4. Check if this connection already exists (using lookerUrl as unique identifier)
    const existingConnection = await db
      .select({
        id: connections.id,
        organisationId: connections.organisationId,
        organisationName: organisations.name,
        createdBy: connections.createdBy,
      })
      .from(connections)
      .leftJoin(organisations, eq(connections.organisationId, organisations.id))
      .where(eq(connections.uniqueIdentifier, lookerUrl))
      .limit(1);

    if (existingConnection.length > 0) {
      // Connection already exists
      const existingOrg = existingConnection[0];
      
      // Check if user is already a member of this organization
      if (userMembership.length > 0 && userMembership[0].organisationId === existingOrg.organisationId) {
        return { success: false, message: 'You are already a member of the organization that owns this connection.' };
      }

      // Check if there's already a pending join request
      const existingRequest = await db
        .select()
        .from(joinRequests)
        .where(
          and(
            eq(joinRequests.userId, userId),
            eq(joinRequests.organisationId, existingOrg.organisationId!),
            eq(joinRequests.status, "pending")
          )
        )
        .limit(1);

      if (existingRequest.length > 0) {
        return { 
          success: false, 
          message: 'You already have a pending request to join this organization.',
          joinRequestSent: true
        };
      }

      // Send join request
      await db.insert(joinRequests).values({
        userId: userId,
        organisationId: existingOrg.organisationId!,
        status: "pending",
      });

      return {
        success: true,
        message: `Join request sent to ${existingOrg.organisationName}. You'll be notified when an admin approves your request.`,
        joinRequestSent: true,
        existingOrganization: {
          id: existingOrg.organisationId!,
          name: existingOrg.organisationName!
        }
      };
    }

    // 5. Connection doesn't exist - need to create organization
    if (userMembership.length > 0) {
      // User already has an organization, add connection there
      const organisationId = userMembership[0].organisationId;
      
      // Encrypt the secret
      const encryptedSecret = encrypt(clientSecret);

      // Save to database
      await db.insert(lookerConnections).values({
        organisationId: organisationId,
        lookerUrl: lookerUrl,
        lookerPort: lookerPort,
        lookerClientId: clientId,
        encryptedLookerSecret: encryptedSecret,
      }).onConflictDoUpdate({
        target: lookerConnections.organisationId,
        set: {
          lookerUrl: lookerUrl,
          lookerPort: lookerPort,
          lookerClientId: clientId,
          encryptedLookerSecret: encryptedSecret,
        }
      });

      // Also add to the new connections table (handle conflicts)
      await db.insert(connections).values({
        organisationId: organisationId,
        uniqueIdentifier: lookerUrl,
        type: 'looker',
        name: `Looker - ${lookerUrl}`,
        createdBy: userId,
        encryptedCredentials: encrypt(JSON.stringify({
          lookerUrl,
          lookerPort,
          clientId,
          clientSecret
        })),
      }).onConflictDoUpdate({
        target: connections.uniqueIdentifier,
        set: {
          encryptedCredentials: encrypt(JSON.stringify({
            lookerUrl,
            lookerPort,
            clientId,
            clientSecret
          })),
          updatedAt: new Date(),
        }
      });

      return { success: true, message: 'Connection added to your organization successfully!' };
    }

    // 6. User has no organization - need to create one
    if (!organizationName) {
      return {
        success: false,
        message: 'Organization name required',
        requiresOrganization: true
      };
    }

    // Create organization and add user as admin
    const result = await db.transaction(async (tx) => {
      // Create organization
      const [organization] = await tx
        .insert(organisations)
        .values({
          name: organizationName,
        })
        .returning({ id: organisations.id });

      if (!organization) {
        throw new Error("Failed to create organization");
      }

      // Create membership (user becomes admin)
      await tx.insert(memberships).values({
        userId: userId,
        organisationId: organization.id,
        role: "admin",
      });

      // Encrypt the secret
      const encryptedSecret = encrypt(clientSecret);

      // Add to looker connections
      await tx.insert(lookerConnections).values({
        organisationId: organization.id,
        lookerUrl: lookerUrl,
        lookerPort: lookerPort,
        lookerClientId: clientId,
        encryptedLookerSecret: encryptedSecret,
      });

      // Add to general connections
      await tx.insert(connections).values({
        organisationId: organization.id,
        uniqueIdentifier: lookerUrl,
        type: 'looker',
        name: `Looker - ${lookerUrl}`,
        createdBy: userId,
        encryptedCredentials: encrypt(JSON.stringify({
          lookerUrl,
          lookerPort,
          clientId,
          clientSecret
        })),
      });

      return organization;
    });

    return { 
      success: true, 
      message: `Organization "${organizationName}" created successfully with your Looker connection!` 
    };

  } catch (error) {
    console.error('Failed to save connection:', error);
    return { 
      success: false, 
      message: `An internal error occurred: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.` 
    };
  }
} 