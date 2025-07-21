import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { db } from "@/lib/db/drizzle"
import { connections, organisations } from "@/lib/db/schema"
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
        organisationId: connections.organisationId,
        organisationName: organisations.name,
      })
      .from(connections)
      .leftJoin(organisations, eq(connections.organisationId, organisations.id))
      .where(eq(connections.uniqueIdentifier, validatedData.uniqueIdentifier))
      .limit(1)

    if (existingConnection.length > 0) {
      // Connection exists, return organization info
      return NextResponse.json({
        exists: true,
        organizationId: existingConnection[0].organisationId,
        organizationName: existingConnection[0].organisationName,
      })
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