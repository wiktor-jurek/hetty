import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { db } from "@/lib/db/drizzle"
import { organisationConnections, memberships, connections } from "@/lib/db/schema"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { eq, and, count } from "drizzle-orm"

const deleteConnectionSchema = z.object({
  connectionId: z.number(),
  organisationId: z.number(),
})

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = deleteConnectionSchema.parse(body)

    // Get current user from session
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      )
    }

    const userId = session.user.id

    // Check if user is admin of the organization
    const adminMembership = await db
      .select()
      .from(memberships)
      .where(
        and(
          eq(memberships.userId, userId),
          eq(memberships.organisationId, validatedData.organisationId),
          eq(memberships.role, "admin")
        )
      )
      .limit(1)

    if (adminMembership.length === 0) {
      return NextResponse.json(
        { error: "You must be an admin of this organization to remove connections" },
        { status: 403 }
      )
    }

    // Check how many connections this organization has
    const connectionCount = await db
      .select({ count: count() })
      .from(organisationConnections)
      .where(eq(organisationConnections.organisationId, validatedData.organisationId))

    if (connectionCount[0]?.count <= 1) {
      return NextResponse.json(
        { error: "Cannot remove the last connection from an organization. Organizations must have at least one connection." },
        { status: 400 }
      )
    }

    // Check if the connection is actually associated with this organization
    const connectionExists = await db
      .select()
      .from(organisationConnections)
      .where(
        and(
          eq(organisationConnections.connectionId, validatedData.connectionId),
          eq(organisationConnections.organisationId, validatedData.organisationId)
        )
      )
      .limit(1)

    if (connectionExists.length === 0) {
      return NextResponse.json(
        { error: "Connection is not associated with this organization" },
        { status: 404 }
      )
    }

    // Remove the connection from the organization and delete the connection if it's no longer used
    await db.transaction(async (tx) => {
      // First remove the organization-connection relationship
      await tx
        .delete(organisationConnections)
        .where(
          and(
            eq(organisationConnections.connectionId, validatedData.connectionId),
            eq(organisationConnections.organisationId, validatedData.organisationId)
          )
        )

      // Check if any other organizations are still using this connection
      const remainingConnections = await tx
        .select({ count: count() })
        .from(organisationConnections)
        .where(eq(organisationConnections.connectionId, validatedData.connectionId))

      // If no other organizations are using this connection, delete it entirely
      if (remainingConnections[0]?.count === 0) {
        // Delete the main connection record
        await tx
          .delete(connections)
          .where(eq(connections.id, validatedData.connectionId))
      }
    })

    return NextResponse.json({
      success: true,
      message: "Connection removed successfully."
    })

  } catch (error) {
    console.error("Delete connection error:", error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Failed to remove connection from organization" },
      { status: 500 }
    )
  }
} 