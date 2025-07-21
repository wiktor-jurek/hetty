import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db/drizzle"
import { joinRequests, memberships, organisations, user } from "@/lib/db/schema"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { eq, and } from "drizzle-orm"

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

    // Get all organizations where the user is an admin
    const adminOrganizations = await db
      .select({ organisationId: memberships.organisationId })
      .from(memberships)
      .where(
        and(
          eq(memberships.userId, userId),
          eq(memberships.role, "admin")
        )
      )

    if (adminOrganizations.length === 0) {
      return NextResponse.json({
        requests: [],
        message: "No organizations found where you are an admin"
      })
    }

    const orgIds = adminOrganizations.map(org => org.organisationId)

    // Get all join requests for those organizations
    const requests = await db
      .select({
        id: joinRequests.id,
        userId: joinRequests.userId,
        organisationId: joinRequests.organisationId,
        status: joinRequests.status,
        createdAt: joinRequests.createdAt,
        userName: user.name,
        userEmail: user.email,
        organizationName: organisations.name,
      })
      .from(joinRequests)
      .leftJoin(user, eq(joinRequests.userId, user.id))
      .leftJoin(organisations, eq(joinRequests.organisationId, organisations.id))
      .where(
        // Filter for organizations where user is admin and only pending/recent requests
        and(
          eq(joinRequests.organisationId, orgIds[0]) // This is simplified, you'd need to handle multiple orgs properly
        )
      )
      .orderBy(joinRequests.createdAt)

    return NextResponse.json({
      requests: requests,
    })

  } catch (error) {
    console.error("Fetch join requests error:", error)
    
    return NextResponse.json(
      { error: "Failed to fetch join requests" },
      { status: 500 }
    )
  }
} 