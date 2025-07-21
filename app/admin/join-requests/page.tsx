"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Users, Clock, AlertCircle } from "lucide-react"
import { useSession } from "@/lib/auth-client"
import { useRouter } from "next/navigation"

interface JoinRequest {
  id: number
  userId: string
  organisationId: number
  status: string
  createdAt: string
  userName: string
  userEmail: string
  organizationName: string
}

export default function JoinRequestsPage() {
  const [requests, setRequests] = useState<JoinRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [processingId, setProcessingId] = useState<number | null>(null)
  
  const { data: session } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (!session?.user) {
      router.push("/signin")
      return
    }
    
    fetchJoinRequests()
  }, [session, router])

  const fetchJoinRequests = async () => {
    try {
      const response = await fetch("/api/admin/join-requests")
      if (!response.ok) {
        throw new Error("Failed to fetch join requests")
      }
      const data = await response.json()
      setRequests(data.requests || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load join requests")
    } finally {
      setIsLoading(false)
    }
  }

  const handleApproval = async (requestId: number, action: "approve" | "deny") => {
    setProcessingId(requestId)
    setError("")

    try {
      const response = await fetch("/api/join-requests/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId, action }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to process request")
      }

      // Refresh the list
      await fetchJoinRequests()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to process request")
    } finally {
      setProcessingId(null)
    }
  }

  if (!session?.user) {
    return null // Will redirect
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center">
          <div className="text-center">
            <Clock className="h-8 w-8 mx-auto mb-4 animate-spin" />
            <p>Loading join requests...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Join Requests</h1>
        <p className="text-slate-600">Manage pending requests to join your organizations</p>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {requests.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Users className="h-12 w-12 mx-auto mb-4 text-slate-400" />
            <h3 className="text-lg font-semibold mb-2">No pending requests</h3>
            <p className="text-slate-600">
              There are no join requests waiting for approval at this time.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <Card key={request.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{request.userName}</CardTitle>
                  <Badge variant={request.status === "pending" ? "secondary" : "outline"}>
                    {request.status}
                  </Badge>
                </div>
                <CardDescription>
                  {request.userEmail} wants to join {request.organizationName}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-slate-600">
                    Requested on {new Date(request.createdAt).toLocaleDateString()}
                  </div>
                  
                  {request.status === "pending" && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleApproval(request.id, "deny")}
                        disabled={processingId === request.id}
                        className="text-red-600 hover:text-red-700"
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Deny
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleApproval(request.id, "approve")}
                        disabled={processingId === request.id}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
} 