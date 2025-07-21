import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { db } from "@/lib/db/drizzle"
import { joinRequests, organisations, memberships } from "@/lib/db/schema"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { eq, and } from "drizzle-orm"

const joinRequestSchema = z.object({
  organizationId: z.number(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = joinRequestSchema.parse(body)

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

    // Check if user is already a member of this organization
    const existingMembership = await db
      .select()
      .from(memberships)
      .where(
        and(
          eq(memberships.userId, userId),
          eq(memberships.organisationId, validatedData.organizationId)
        )
      )
      .limit(1)

    if (existingMembership.length > 0) {
      return NextResponse.json(
        { error: "You are already a member of this organization" },
        { status: 400 }
      )
    }

    // Check if there's already a pending request
    const existingRequest = await db
      .select()
      .from(joinRequests)
      .where(
        and(
          eq(joinRequests.userId, userId),
          eq(joinRequests.organisationId, validatedData.organizationId),
          eq(joinRequests.status, "pending")
        )
      )
      .limit(1)

    if (existingRequest.length > 0) {
      return NextResponse.json(
        { error: "You already have a pending request for this organization" },
        { status: 400 }
      )
    }

    // Create join request
    await db.insert(joinRequests).values({
      userId: userId,
      organisationId: validatedData.organizationId,
      status: "pending",
    })

    // TODO: Send notification to organization admins
    // This would typically involve sending an email or in-app notification

    return NextResponse.json({
      success: true,
      message: "Join request sent successfully",
    })

  } catch (error) {
    console.error("Join request error:", error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Failed to send join request" },
      { status: 500 }
    )
  }
} 