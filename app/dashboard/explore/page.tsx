"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Lock, Search, GitBranch, Network, FileText, ArrowRight, Database, Building } from "lucide-react"
import Link from "next/link"
import { useDashboard } from "../layout"

const mockRelationships = [
  {
    from: "users",
    to: "orders",
    type: "one_to_many",
    field: "user_id"
  },
  {
    from: "orders",
    to: "order_items",
    type: "one_to_many", 
    field: "order_id"
  },
  {
    from: "order_items",
    to: "products",
    type: "many_to_one",
    field: "product_id"
  },
  {
    from: "users",
    to: "analytics_base",
    type: "extension",
    field: "base_view"
  }
]

const mockDependencies = [
  {
    model: "analytics_base",
    dependencies: ["users", "orders", "products"],
    dependents: ["user_analytics", "sales_report"]
  },
  {
    model: "orders",
    dependencies: ["users"],
    dependents: ["analytics_base", "order_items"]
  }
]

export default function ExplorePage() {
  const { selectedOrganization, selectedConnection, isConnected } = useDashboard()

  if (!isConnected) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">Explore</h2>
          <p className="text-muted-foreground">
            Discover model relationships and dependencies with interactive visualizations.
          </p>
        </div>

        <Card className="border-amber-200 bg-amber-50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-amber-600" />
              <CardTitle className="text-amber-800">Connection Required</CardTitle>
            </div>
            <CardDescription className="text-amber-700">
              You need to select an organization and connection to explore models.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!selectedOrganization && (
              <div className="flex items-center gap-2 text-sm text-amber-700">
                <Building className="h-4 w-4" />
                <span>First, select an organization from the sidebar</span>
              </div>
            )}
            {selectedOrganization && !selectedConnection && (
              <div className="flex items-center gap-2 text-sm text-amber-700">
                <Database className="h-4 w-4" />
                <span>Then, select a connection from the sidebar</span>
              </div>
            )}
            <Button asChild className="bg-amber-600 hover:bg-amber-700">
              <Link href="/dashboard/admin">
                <Database className="h-4 w-4 mr-2" />
                Manage Connections
              </Link>
            </Button>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="opacity-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Network className="h-5 w-5" />
                Relationship Graph
              </CardTitle>
              <CardDescription>
                Interactive visualization of model relationships.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Network className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">Connect to view graph</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="opacity-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GitBranch className="h-5 w-5" />
                Dependency Tree
              </CardTitle>
              <CardDescription>
                Hierarchical view of model dependencies.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <GitBranch className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">Connect to view tree</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Explore</h2>
        <p className="text-muted-foreground">
          Discover model relationships and dependencies with interactive visualizations.
        </p>
        {selectedOrganization && selectedConnection && (
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Building className="h-3 w-3" />
              <span>{selectedOrganization.organisationName}</span>
            </div>
            <div className="flex items-center gap-1">
              <Database className="h-3 w-3" />
              <span>{selectedConnection.name}</span>
            </div>
          </div>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Relationships</CardTitle>
            <Network className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockRelationships.length}</div>
            <p className="text-xs text-muted-foreground">Model connections</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dependencies</CardTitle>
            <GitBranch className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockDependencies.length}</div>
            <p className="text-xs text-muted-foreground">Dependency chains</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projects</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">Active projects</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Network className="h-5 w-5" />
              Relationship Graph
            </CardTitle>
            <CardDescription>
              Interactive visualization of model relationships.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="aspect-video bg-slate-50 rounded-lg border-2 border-dashed border-slate-200 flex items-center justify-center">
              <div className="text-center">
                <Network className="h-12 w-12 mx-auto text-slate-400 mb-2" />
                <p className="text-sm text-slate-500 mb-2">Interactive graph will appear here</p>
                <Badge variant="secondary">Coming Soon</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GitBranch className="h-5 w-5" />
              Dependency Tree
            </CardTitle>
            <CardDescription>
              Hierarchical view of model dependencies.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="aspect-video bg-slate-50 rounded-lg border-2 border-dashed border-slate-200 flex items-center justify-center">
              <div className="text-center">
                <GitBranch className="h-12 w-12 mx-auto text-slate-400 mb-2" />
                <p className="text-sm text-slate-500 mb-2">Dependency tree will appear here</p>
                <Badge variant="secondary">Coming Soon</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Model Relationships</CardTitle>
            <CardDescription>
              Current relationships between your models.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockRelationships.map((rel, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="font-medium">{rel.from}</span>
                  <ArrowRight className="h-3 w-3 text-muted-foreground" />
                  <span className="font-medium">{rel.to}</span>
                </div>
                <Badge variant="outline" className="text-xs">
                  {rel.type.replace('_', ' ')}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Dependency Overview</CardTitle>
            <CardDescription>
              Models and their dependencies.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockDependencies.map((dep, index) => (
              <div key={index} className="p-3 border rounded-lg space-y-2">
                <div className="font-medium">{dep.model}</div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">Depends on:</span>
                    <div className="flex gap-1">
                      {dep.dependencies.map((dep_name) => (
                        <Badge key={dep_name} variant="secondary" className="text-xs">
                          {dep_name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">Used by:</span>
                    <div className="flex gap-1">
                      {dep.dependents.map((dependent) => (
                        <Badge key={dependent} variant="outline" className="text-xs">
                          {dependent}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 