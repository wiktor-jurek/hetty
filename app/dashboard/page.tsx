"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Database, Boxes, Search, AlertCircle, ArrowRight, Building, Users } from "lucide-react"
import Link from "next/link"
import { useDashboard } from "./layout"

export default function DashboardPage() {
  const { 
    organizations, 
    selectedOrganization, 
    connections, 
    selectedConnection, 
    isConnected, 
    isLoading 
  } = useDashboard()

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">Welcome to Hetty Dashboard</h2>
          <p className="text-muted-foreground">Loading your data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold tracking-tight">Welcome to Hetty Dashboard</h2>
          {selectedOrganization && (
            <Button 
              variant="outline" 
              size="sm" 
              asChild
              className="text-blue-700 border-blue-200 bg-blue-50 hover:bg-blue-100"
            >
              <div className="flex items-center gap-2">
                <Building className="h-3 w-3" />
                {selectedOrganization.organisationName}
              </div>
            </Button>
          )}
          {selectedConnection && (
            <Button 
              variant="outline" 
              size="sm" 
              asChild
              className="text-green-700 border-green-200 bg-green-50 hover:bg-green-100"
            >
              <Link href="/dashboard/admin" className="flex items-center gap-2">
                <Database className="h-3 w-3" />
                {selectedConnection.name}
              </Link>
            </Button>
          )}
        </div>
        <p className="text-muted-foreground">
          Visual model management made simple. Connect to your data sources and organize your teams.
        </p>
      </div>

      {organizations.length === 0 && (
        <Card className="border-amber-200 bg-amber-50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-amber-600" />
              <CardTitle className="text-amber-800">Setup Required</CardTitle>
            </div>
            <CardDescription className="text-amber-700">
              You need to create or join an organization and connect to your data sources.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="bg-amber-600 hover:bg-amber-700">
              <Link href="/dashboard/admin">
                <Database className="h-4 w-4 mr-2" />
                Get Started
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {!isConnected && organizations.length > 0 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5 text-blue-600" />
              <CardTitle className="text-blue-800">Add Connections</CardTitle>
            </div>
            <CardDescription className="text-blue-700">
              Your organization is set up! Now connect to your data sources to start managing models.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="bg-blue-600 hover:bg-blue-700">
              <Link href="/dashboard/admin">
                <Database className="h-4 w-4 mr-2" />
                Add Connection
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Organizations</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {organizations.length > 0 ? (
                <div className="flex items-center gap-2">
                  <span>{organizations.length}</span>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
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
              {organizations.length > 0 
                ? `Member of ${organizations.length} organization${organizations.length === 1 ? '' : 's'}` 
                : "No organization memberships"}
            </p>
          </CardContent>
        </Card>

        <Card>
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
              {connections.length > 0 
                ? `${connections.length} connection${connections.length === 1 ? '' : 's'} available` 
                : "No connections found"}
            </p>
          </CardContent>
        </Card>

        <Card className={isConnected ? "" : "opacity-50"}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Models</CardTitle>
            <Boxes className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-</div>
            <p className="text-xs text-muted-foreground">
              {isConnected ? "No models loaded yet" : "Select connection to see models"}
            </p>
          </CardContent>
        </Card>

        <Card className={isConnected ? "" : "opacity-50"}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Explore</CardTitle>
            <Search className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-</div>
            <p className="text-xs text-muted-foreground">
              {isConnected ? "Ready to explore" : "Select connection to explore"}
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
              disabled={!isConnected}
              asChild={isConnected}
            >
              {isConnected ? (
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
              disabled={!isConnected}
              asChild={isConnected}
            >
              {isConnected ? (
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
            <Button 
              variant="outline" 
              className="w-full justify-start" 
              asChild
            >
              <Link href="/dashboard/admin">
                <Database className="h-4 w-4 mr-2" />
                Manage Connections
              </Link>
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
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${organizations.length > 0 ? 'bg-green-500 text-white' : 'bg-blue-500 text-white'}`}>
                1
              </div>
              <span className={organizations.length > 0 ? 'line-through text-muted-foreground' : ''}>
                Join or create an organization
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${connections.length > 0 ? 'bg-green-500 text-white' : organizations.length > 0 ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-600'}`}>
                2
              </div>
              <span className={connections.length === 0 ? 'text-muted-foreground' : connections.length > 0 ? 'line-through text-muted-foreground' : ''}>
                Connect to your data sources
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${isConnected ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-600'}`}>
                3
              </div>
              <span className={!isConnected ? 'text-muted-foreground' : ''}>
                Review models and explore relationships
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 