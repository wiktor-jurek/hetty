import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { db } from "@/lib/db/drizzle"
import { connections, organisations, organisationConnections } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

const connectionValidationSchema = z.object({
  type: z.string().min(1),
  uniqueIdentifier: z.string().min(1),
  name: z.string().min(1),
  credentials: z.record(z.string()),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = connectionValidationSchema.parse(body)

    // Check if a connection with this unique identifier already exists
    const existingConnection = await db
      .select({
        id: connections.id,
      })
      .from(connections)
      .where(eq(connections.uniqueIdentifier, validatedData.uniqueIdentifier))
      .limit(1)

    if (existingConnection.length > 0) {
      // Connection exists, get all organizations linked to it
      const linkedOrganizations = await db
        .select({
          organisationId: organisationConnections.organisationId,
          organisationName: organisations.name,
        })
        .from(organisationConnections)
        .leftJoin(organisations, eq(organisationConnections.organisationId, organisations.id))
        .where(eq(organisationConnections.connectionId, existingConnection[0].id))

      if (linkedOrganizations.length > 0) {
        // Return the first organization (for compatibility)
        return NextResponse.json({
          exists: true,
          organizationId: linkedOrganizations[0].organisationId,
          organizationName: linkedOrganizations[0].organisationName,
          // Also include all linked organizations for future use
          linkedOrganizations: linkedOrganizations,
        })
      } else {
        // Connection exists but has no linked organizations (orphaned connection)
        return NextResponse.json({
          exists: true,
          orphaned: true,
          connectionId: existingConnection[0].id,
        })
      }
    }

    // Connection doesn't exist, it's available for new organization
    return NextResponse.json({
      exists: false,
      available: true,
    })

  } catch (error) {
    console.error("Connection validation error:", error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid connection data", details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Failed to validate connection" },
      { status: 500 }
    )
  }
} 