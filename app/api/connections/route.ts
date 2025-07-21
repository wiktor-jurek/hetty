import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db/drizzle"
import { connections, organisations, memberships, user } from "@/lib/db/schema"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { eq } from "drizzle-orm"

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
        role: memberships.role,
      })
      .from(memberships)
      .where(eq(memberships.userId, userId))

    if (userMemberships.length === 0) {
      return NextResponse.json({
        connections: [],
        message: "No organization memberships found"
      })
    }

    // Get all connections for user's organizations
    const orgIds = userMemberships.map(m => m.organisationId)
    
    const connectionsData = await db
      .select({
        id: connections.id,
        name: connections.name,
        type: connections.type,
        uniqueIdentifier: connections.uniqueIdentifier,
        createdAt: connections.createdAt,
        createdBy: connections.createdBy,
        organisationId: connections.organisationId,
        organisationName: organisations.name,
        creatorName: user.name,
        creatorEmail: user.email,
      })
      .from(connections)
      .leftJoin(organisations, eq(connections.organisationId, organisations.id))
      .leftJoin(user, eq(connections.createdBy, user.id))
      .where(eq(connections.organisationId, orgIds[0])) // For now, just get first org's connections

    return NextResponse.json({
      connections: connectionsData,
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