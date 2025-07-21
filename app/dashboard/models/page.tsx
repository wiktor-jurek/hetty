"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Lock, Boxes, Trash2, Eye, Calendar, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { useConnection } from "../layout"

const mockModels = [
  {
    id: 1,
    name: "users",
    project: "ecommerce",
    lastModified: "2024-01-15",
    status: "active",
    dependencies: 3,
    size: "2.1 MB"
  },
  {
    id: 2,
    name: "orders",
    project: "ecommerce", 
    lastModified: "2024-01-10",
    status: "unused",
    dependencies: 0,
    size: "1.8 MB"
  },
  {
    id: 3,
    name: "products",
    project: "ecommerce",
    lastModified: "2024-01-20",
    status: "deprecated",
    dependencies: 1,
    size: "3.2 MB"
  },
  {
    id: 4,
    name: "analytics_base",
    project: "analytics",
    lastModified: "2024-01-18",
    status: "active",
    dependencies: 5,
    size: "4.7 MB"
  }
]

export default function ModelsPage() {
  const { isConnected } = useConnection()

  if (!isConnected) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">Models</h2>
          <p className="text-muted-foreground">
            Manage and clean up your Looker models with visual insights.
          </p>
        </div>

        <Card className="border-amber-200 bg-amber-50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-amber-600" />
              <CardTitle className="text-amber-800">Connection Required</CardTitle>
            </div>
            <CardDescription className="text-amber-700">
              You need to connect to your Looker instance before you can view and manage models.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="bg-amber-600 hover:bg-amber-700">
              <Link href="/dashboard/connections">
                Connect to Looker
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="opacity-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Boxes className="h-5 w-5" />
              Model Overview
            </CardTitle>
            <CardDescription>
                             Once connected, you&apos;ll see your models here with cleanup suggestions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-muted-foreground">-</div>
                <div className="text-sm text-muted-foreground">Total Models</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-muted-foreground">-</div>
                <div className="text-sm text-muted-foreground">Unused Models</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-muted-foreground">-</div>
                <div className="text-sm text-muted-foreground">Deprecated Models</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Models</h2>
        <p className="text-muted-foreground">
          Manage and clean up your Looker models with visual insights.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Models</CardTitle>
            <Boxes className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockModels.length}</div>
            <p className="text-xs text-muted-foreground">Across all projects</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unused Models</CardTitle>
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">
              {mockModels.filter(m => m.status === 'unused').length}
            </div>
            <p className="text-xs text-muted-foreground">Ready for cleanup</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Deprecated</CardTitle>
            <Trash2 className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {mockModels.filter(m => m.status === 'deprecated').length}
            </div>
            <p className="text-xs text-muted-foreground">Marked for removal</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Models</CardTitle>
            <Eye className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {mockModels.filter(m => m.status === 'active').length}
            </div>
            <p className="text-xs text-muted-foreground">Currently in use</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Models</CardTitle>
          <CardDescription>
            A complete view of your Looker models with cleanup recommendations.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Model Name</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Dependencies</TableHead>
                <TableHead>Last Modified</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockModels.map((model) => (
                <TableRow key={model.id}>
                  <TableCell className="font-medium">{model.name}</TableCell>
                  <TableCell>{model.project}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        model.status === 'active' ? 'default' :
                        model.status === 'unused' ? 'secondary' :
                        'destructive'
                      }
                    >
                      {model.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{model.dependencies}</TableCell>
                  <TableCell className="flex items-center gap-2">
                    <Calendar className="h-3 w-3" />
                    {model.lastModified}
                  </TableCell>
                  <TableCell>{model.size}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-3 w-3" />
                      </Button>
                      {model.status !== 'active' && (
                        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Cleanup Recommendations</CardTitle>
          <CardDescription>
            Based on usage analysis, here are some cleanup suggestions.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-l-4 border-amber-500 pl-4 py-2">
            <h4 className="font-medium text-amber-800">Unused Models</h4>
            <p className="text-sm text-amber-700">
                             The &quot;orders&quot; model hasn&apos;t been used in the last 30 days and has no dependencies. Consider archiving or removing it.
            </p>
          </div>
          
          <div className="border-l-4 border-red-500 pl-4 py-2">
            <h4 className="font-medium text-red-800">Deprecated Models</h4>
            <p className="text-sm text-red-700">
                             The &quot;products&quot; model is marked as deprecated but still has 1 dependency. Review the dependency before removal.
            </p>
          </div>
          
          <div className="border-l-4 border-blue-500 pl-4 py-2">
            <h4 className="font-medium text-blue-800">Optimization Opportunity</h4>
            <p className="text-sm text-blue-700">
                             The &quot;analytics_base&quot; model is large (4.7 MB) and has many dependencies. Consider breaking it into smaller, more focused models.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 