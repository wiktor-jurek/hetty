'use server';

import { z } from 'zod';
import { db } from '@/lib/db/drizzle';
import { memberships, organisations, connections, joinRequests, organisationConnections } from '@/lib/db/schema';
import { encrypt } from '@/lib/crypto';
import { auth } from '@/lib/auth';
import { eq, and, inArray } from 'drizzle-orm';
import { headers } from 'next/headers';

// Define the schema for input validation using Zod
const connectionSchema = z.object({
  lookerUrl: z.string()
    .url('Please enter a valid URL.')
    .transform((url) => {
      // Remove trailing slashes and ensure proper format
      const cleanedUrl = url.replace(/\/+$/, '');
      return cleanedUrl;
    })
    .refine((url) => {
      // Additional validation to ensure it's a proper Looker URL format
      try {
        const urlObj = new URL(url);
        return urlObj.protocol === 'https:' || urlObj.protocol === 'http:';
      } catch {
        return false;
      }
    }, 'URL must be a valid HTTP or HTTPS URL without trailing slashes.'),
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

// Helper function to extract domain from URL for connection naming
function extractDomainFromUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch {
    // Fallback if URL parsing fails
    return url.replace(/^https?:\/\//, '').replace(/\/$/, '').split('/')[0];
  }
}

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
    
    // Extract domain name for connection naming
    const connectionName = extractDomainFromUrl(lookerUrl);

    // 3. Check if user already belongs to an organization
    const userMembership = await db.select({
      organisationId: memberships.organisationId,
      role: memberships.role
    }).from(memberships).where(eq(memberships.userId, userId)).limit(1);

    // 4. Check if this connection already exists (using lookerUrl as unique identifier)
    const existingConnection = await db
      .select({
        id: connections.id,
        createdBy: connections.createdBy,
      })
      .from(connections)
      .where(eq(connections.uniqueIdentifier, lookerUrl))
      .limit(1);

    if (existingConnection.length > 0) {
      // Connection already exists, check which organizations it belongs to
      let connectionOrganizations: { organisationId: number | null; organisationName: string | null }[] = []
      try {
        connectionOrganizations = await db
          .select({
            organisationId: organisationConnections.organisationId,
            organisationName: organisations.name,
          })
          .from(organisationConnections)
          .leftJoin(organisations, eq(organisationConnections.organisationId, organisations.id))
          .where(eq(organisationConnections.connectionId, existingConnection[0].id))
      } catch (error) {
        console.error('Error fetching connection organizations:', error)
        connectionOrganizations = [] // Return empty array if there's an error
      };

      // Check if user is already a member of any organization that has this connection
      if (userMembership.length > 0) {
        const userOrgId = userMembership[0].organisationId;
        const hasAccess = connectionOrganizations.some(org => org.organisationId === userOrgId);
        
        if (hasAccess) {
          return { success: false, message: 'Your organization already has access to this connection.' };
        }
        
        // User has an organization but doesn't have access to this connection
        // Add the connection to their organization
        await db.insert(organisationConnections).values({
          organisationId: userOrgId,
          connectionId: existingConnection[0].id,
          addedBy: userId,
        });

        return {
          success: true,
          message: 'Connection added to your organization successfully!'
        };
      }

      // User has no organization, send join request to the first organization that has this connection
      if (connectionOrganizations.length > 0) {
        const targetOrg = connectionOrganizations[0];
        
        // Check if there's already a pending join request
        const existingRequest = await db
          .select()
          .from(joinRequests)
          .where(
            and(
              eq(joinRequests.userId, userId),
              eq(joinRequests.organisationId, targetOrg.organisationId!),
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
          organisationId: targetOrg.organisationId!,
          status: "pending",
        });

        return {
          success: true,
          message: `Join request sent to ${targetOrg.organisationName}. You'll be notified when an admin approves your request.`,
          joinRequestSent: true,
          existingOrganization: {
            id: targetOrg.organisationId!,
            name: targetOrg.organisationName!
          }
        };
      }
    }

    // 5. Connection doesn't exist or user needs organization - need to create/update
    if (userMembership.length > 0) {
      // User already has an organization, add connection there
      const organisationId = userMembership[0].organisationId;
      
      // Create or update the connection
      const result = await db.transaction(async (tx) => {
        let connectionId: number;

        if (existingConnection.length > 0) {
          // Check if user's organization has access to this existing connection
          const organizationHasAccess = await tx
            .select()
            .from(organisationConnections)
            .where(
              and(
                eq(organisationConnections.connectionId, existingConnection[0].id),
                eq(organisationConnections.organisationId, organisationId)
              )
            )
            .limit(1);

          connectionId = existingConnection[0].id;

          if (organizationHasAccess.length > 0) {
            // Organization has access - allow credential update
            await tx.update(connections)
              .set({
                encryptedCredentials: encrypt(JSON.stringify({
                  lookerUrl,
                  lookerPort,
                  clientId,
                  clientSecret
                })),
                updatedAt: new Date(),
              })
              .where(eq(connections.id, connectionId));
          } else {
            // Organization doesn't have access - just add connection to organization without updating credentials
            await tx.insert(organisationConnections).values({
              organisationId: organisationId,
              connectionId: connectionId,
              addedBy: userId,
            }).onConflictDoNothing();
          }
        } else {
          // Create new connection
          const [newConnection] = await tx.insert(connections).values({
            uniqueIdentifier: lookerUrl,
            type: 'looker',
            name: connectionName,
            createdBy: userId,
            encryptedCredentials: encrypt(JSON.stringify({
              lookerUrl,
              lookerPort,
              clientId,
              clientSecret
            })),
          }).returning({ id: connections.id });

          connectionId = newConnection.id;

          // Link connection to organization
          await tx.insert(organisationConnections).values({
            organisationId: organisationId,
            connectionId: connectionId,
            addedBy: userId,
          }).onConflictDoNothing();
        }

        return connectionId;
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

      let connectionId: number;

      if (existingConnection.length > 0) {
        // Check if any organization has access to this existing connection
        const existingOrganizationAccess = await tx
          .select()
          .from(organisationConnections)
          .where(eq(organisationConnections.connectionId, existingConnection[0].id))
          .limit(1);

        connectionId = existingConnection[0].id;

        if (existingOrganizationAccess.length === 0) {
          // No organization has access to this connection (orphaned) - allow credential update
          await tx.update(connections)
            .set({
              encryptedCredentials: encrypt(JSON.stringify({
                lookerUrl,
                lookerPort,
                clientId,
                clientSecret
              })),
              updatedAt: new Date(),
            })
            .where(eq(connections.id, connectionId));
        }
        // If other organizations have access, don't update credentials - just link to new organization
      } else {
        // Create new connection
        const [newConnection] = await tx.insert(connections).values({
          uniqueIdentifier: lookerUrl,
          type: 'looker',
          name: connectionName,
          createdBy: userId,
          encryptedCredentials: encrypt(JSON.stringify({
            lookerUrl,
            lookerPort,
            clientId,
            clientSecret
          })),
        }).returning({ id: connections.id });

        connectionId = newConnection.id;
      }

      // Link connection to organization
      await tx.insert(organisationConnections).values({
        organisationId: organization.id,
        connectionId: connectionId,
        addedBy: userId,
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