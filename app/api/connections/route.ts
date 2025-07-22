import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db/drizzle"
import { connections, organisations, memberships, user, organisationConnections } from "@/lib/db/schema"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { eq, inArray } from "drizzle-orm"

export async function GET(request: NextRequest) {
  try {
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

    // Get user's organization memberships
    const userMemberships = await db
      .select({
        organisationId: memberships.organisationId,
        organisationName: organisations.name,
        role: memberships.role,
      })
      .from(memberships)
      .leftJoin(organisations, eq(memberships.organisationId, organisations.id))
      .where(eq(memberships.userId, userId))

    if (userMemberships.length === 0) {
      return NextResponse.json({
        connections: [],
        organizations: [],
        message: "No organization memberships found"
      })
    }

    // Get all organization IDs for the user
    const orgIds = userMemberships.map(m => m.organisationId)
    
    // Get all connections for user's organizations via the junction table
    const connectionsData = await db
      .select({
        id: connections.id,
        name: connections.name,
        type: connections.type,
        uniqueIdentifier: connections.uniqueIdentifier,
        createdAt: connections.createdAt,
        createdBy: connections.createdBy,
        organisationId: organisationConnections.organisationId,
        organisationName: organisations.name,
        creatorName: user.name,
        creatorEmail: user.email,
        addedBy: organisationConnections.addedBy,
        addedAt: organisationConnections.createdAt,
      })
      .from(organisationConnections)
      .leftJoin(connections, eq(organisationConnections.connectionId, connections.id))
      .leftJoin(organisations, eq(organisationConnections.organisationId, organisations.id))
      .leftJoin(user, eq(connections.createdBy, user.id))
      .where(inArray(organisationConnections.organisationId, orgIds))

    return NextResponse.json({
      connections: connectionsData,
      organizations: userMemberships,
      userRole: userMemberships[0]?.role,
    })

  } catch (error) {
    console.error("Fetch connections error:", error)
    
    return NextResponse.json(
      { error: "Failed to fetch connections" },
      { status: 500 }
    )
  }
} 