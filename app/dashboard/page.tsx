"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Database, Boxes, Search, AlertCircle, ArrowRight, ExternalLink, User, Calendar } from "lucide-react"
import Link from "next/link"
import { useConnection } from "./layout"
import { useState, useEffect } from "react"

interface ConnectionData {
  id: number
  name: string
  type: string
  uniqueIdentifier: string
  createdAt: string
  createdBy: string
  organisationId: number
  organisationName: string
  creatorName: string
  creatorEmail: string
}

export default function DashboardPage() {
  const { isConnected, setIsConnected } = useConnection()
  const [connections, setConnections] = useState<ConnectionData[]>([])
  const [loading, setLoading] = useState(true)
  const [userRole, setUserRole] = useState<string>("")

  useEffect(() => {
    fetchConnections()
  }, [])

  const fetchConnections = async () => {
    try {
      const response = await fetch("/api/connections")
      if (response.ok) {
        const data = await response.json()
        setConnections(data.connections || [])
        setUserRole(data.userRole || "")
        setIsConnected(data.connections?.length > 0)
      }
    } catch (error) {
      console.error("Failed to fetch connections:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">Welcome to Hetty Dashboard</h2>
          <p className="text-muted-foreground">Loading your connections...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold tracking-tight">Welcome to Hetty Dashboard</h2>
          {connections.length > 0 && (
            <Button 
              variant="outline" 
              size="sm" 
              asChild
              className="text-green-700 border-green-200 bg-green-50 hover:bg-green-100"
            >
              <Link href="/dashboard/connections" className="flex items-center gap-2">
                <Database className="h-3 w-3" />
                Connected - {connections[0]?.organisationName}
              </Link>
            </Button>
          )}
        </div>
        <p className="text-muted-foreground">
          Visual model management made simple. Get started by connecting to your Looker instance.
        </p>
      </div>

      {connections.length === 0 && (
        <Card className="border-amber-200 bg-amber-50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-amber-600" />
              <CardTitle className="text-amber-800">Setup Required</CardTitle>
            </div>
            <CardDescription className="text-amber-700">
              You need to connect to your Looker instance before you can manage models and explore data.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="bg-amber-600 hover:bg-amber-700">
              <Link href="/dashboard/connections">
                <Database className="h-4 w-4 mr-2" />
                Connect to Looker
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className={connections.length > 0 ? "" : "opacity-50"}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Connections</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {connections.length > 0 ? (
                <div className="flex items-center gap-2">
                  <span>{connections.length}</span>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Active
                  </Badge>
                </div>
              ) : (
                <Badge variant="secondary" className="bg-red-100 text-red-800">
                  None
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {connections.length > 0 ? `${connections.length} connection${connections.length === 1 ? '' : 's'} configured` : "No connections found"}
            </p>
          </CardContent>
        </Card>

        <Card className={connections.length > 0 ? "" : "opacity-50"}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Models</CardTitle>
            <Boxes className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-</div>
            <p className="text-xs text-muted-foreground">
              {connections.length > 0 ? "No models loaded yet" : "Connect first to see models"}
            </p>
          </CardContent>
        </Card>

        <Card className={connections.length > 0 ? "" : "opacity-50"}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Explore</CardTitle>
            <Search className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-</div>
            <p className="text-xs text-muted-foreground">
              {connections.length > 0 ? "Ready to explore" : "Connect first to explore"}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks you can perform with Hetty</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button 
              variant="outline" 
              className="w-full justify-start" 
              disabled={connections.length === 0}
              asChild={connections.length > 0}
            >
              {connections.length > 0 ? (
                <Link href="/dashboard/models">
                  <Boxes className="h-4 w-4 mr-2" />
                  View All Models
                </Link>
              ) : (
                <>
                  <Boxes className="h-4 w-4 mr-2" />
                  View All Models
                </>
              )}
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start" 
              disabled={connections.length === 0}
              asChild={connections.length > 0}
            >
              {connections.length > 0 ? (
                <Link href="/dashboard/explore">
                  <Search className="h-4 w-4 mr-2" />
                  Explore Relationships
                </Link>
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Explore Relationships
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
            <CardDescription>Follow these steps to start managing your models</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${connections.length > 0 ? 'bg-green-500 text-white' : 'bg-blue-500 text-white'}`}>
                1
              </div>
              <span className={connections.length > 0 ? 'line-through text-muted-foreground' : ''}>
                Connect to your Looker instance
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${connections.length > 0 ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-600'}`}>
                2
              </div>
              <span className={connections.length === 0 ? 'text-muted-foreground' : ''}>
                Review your models in the Models tab
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${connections.length > 0 ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-600'}`}>
                3
              </div>
              <span className={connections.length === 0 ? 'text-muted-foreground' : ''}>
                Explore model relationships and dependencies
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 