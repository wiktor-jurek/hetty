"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Lock, Search, GitBranch, Network, FileText, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useConnection } from "../layout"

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
  const { isConnected } = useConnection()

  if (!isConnected) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">Explore</h2>
          <p className="text-muted-foreground">
            Visualize model relationships and dependencies in your Looker instance.
          </p>
        </div>

        <Card className="border-amber-200 bg-amber-50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-amber-600" />
              <CardTitle className="text-amber-800">Connection Required</CardTitle>
            </div>
            <CardDescription className="text-amber-700">
              You need to connect to your Looker instance before you can explore model relationships.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="bg-amber-600 hover:bg-amber-700">
              <Link href="/dashboard/connection">
                Connect to Looker
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
          Visualize model relationships and dependencies in your Looker instance.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Relationships</CardTitle>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockRelationships.length}</div>
            <p className="text-xs text-muted-foreground">Across all models</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Complex Models</CardTitle>
            <Network className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">With 3+ dependencies</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Isolated Models</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">No dependencies</p>
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
              Direct relationships between your models.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockRelationships.map((rel, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="text-xs">
                      {rel.from}
                    </Badge>
                    <ArrowRight className="h-3 w-3 text-muted-foreground" />
                    <Badge variant="outline" className="text-xs">
                      {rel.to}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <Badge variant="secondary" className="text-xs">
                      {rel.type}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">
                      via {rel.field}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Dependency Analysis</CardTitle>
            <CardDescription>
              Models with the most complex dependency chains.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockDependencies.map((dep, index) => (
                <div key={index} className="p-3 border rounded-lg">
                  <div className="font-medium mb-2">{dep.model}</div>
                  
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Depends on:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {dep.dependencies.map((dependency, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {dependency}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <span className="text-muted-foreground">Used by:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {dep.dependents.map((dependent, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {dependent}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Impact Analysis</CardTitle>
          <CardDescription>
            Understanding the impact of changes to your models.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-l-4 border-blue-500 pl-4 py-2">
            <h4 className="font-medium text-blue-800">High Impact Models</h4>
            <p className="text-sm text-blue-700">
                             Changes to &quot;analytics_base&quot; would affect 2 downstream models. Consider careful testing before modifications.
            </p>
          </div>
          
          <div className="border-l-4 border-green-500 pl-4 py-2">
            <h4 className="font-medium text-green-800">Safe to Modify</h4>
            <p className="text-sm text-green-700">
                             The &quot;products&quot; model has minimal dependencies and can be safely modified or removed.
            </p>
          </div>
          
          <div className="border-l-4 border-amber-500 pl-4 py-2">
            <h4 className="font-medium text-amber-800">Circular Dependencies</h4>
            <p className="text-sm text-amber-700">
              No circular dependencies detected in your current model structure. Great work!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 