import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { db } from "@/lib/db/drizzle"
import { joinRequests, memberships } from "@/lib/db/schema"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { eq, and } from "drizzle-orm"

const approveRequestSchema = z.object({
  requestId: z.number(),
  action: z.enum(["approve", "deny"]),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = approveRequestSchema.parse(body)

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

    // Get the join request and verify the user is an admin of the organization
    const joinRequest = await db
      .select({
        id: joinRequests.id,
        userId: joinRequests.userId,
        organisationId: joinRequests.organisationId,
        status: joinRequests.status,
      })
      .from(joinRequests)
      .where(eq(joinRequests.id, validatedData.requestId))
      .limit(1)

    if (joinRequest.length === 0) {
      return NextResponse.json(
        { error: "Join request not found" },
        { status: 404 }
      )
    }

    const request_data = joinRequest[0]

    if (request_data.status !== "pending") {
      return NextResponse.json(
        { error: "Join request has already been processed" },
        { status: 400 }
      )
    }

    // Check if current user is an admin of the organization
    const adminMembership = await db
      .select()
      .from(memberships)
      .where(
        and(
          eq(memberships.userId, userId),
          eq(memberships.organisationId, request_data.organisationId),
          eq(memberships.role, "admin")
        )
      )
      .limit(1)

    if (adminMembership.length === 0) {
      return NextResponse.json(
        { error: "You do not have permission to approve requests for this organization" },
        { status: 403 }
      )
    }

    // Process the request
    if (validatedData.action === "approve") {
      // Start transaction
      await db.transaction(async (tx) => {
        // 1. Update join request status
        await tx
          .update(joinRequests)
          .set({ 
            status: "approved",
            updatedAt: new Date()
          })
          .where(eq(joinRequests.id, validatedData.requestId))

        // 2. Create membership
        await tx.insert(memberships).values({
          userId: request_data.userId,
          organisationId: request_data.organisationId,
          role: "member",
        })
      })

      return NextResponse.json({
        success: true,
        message: "Join request approved and user added to organization",
      })
    } else {
      // Deny request
      await db
        .update(joinRequests)
        .set({ 
          status: "denied",
          updatedAt: new Date()
        })
        .where(eq(joinRequests.id, validatedData.requestId))

      return NextResponse.json({
        success: true,
        message: "Join request denied",
      })
    }

  } catch (error) {
    console.error("Join request approval error:", error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Failed to process join request" },
      { status: 500 }
    )
  }
} 