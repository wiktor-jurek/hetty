"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Database, Boxes, Search, AlertCircle, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useConnection } from "./layout"

export default function DashboardPage() {
  const { isConnected } = useConnection()

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Welcome to Hetty Dashboard</h2>
        <p className="text-muted-foreground">
          Visual model management made simple. Get started by connecting to your Looker instance.
        </p>
      </div>

      {!isConnected && (
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
              <Link href="/dashboard/connection">
                <Database className="h-4 w-4 mr-2" />
                Connect to Looker
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className={isConnected ? "" : "opacity-50"}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Connection Status</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isConnected ? (
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  Connected
                </Badge>
              ) : (
                <Badge variant="secondary" className="bg-red-100 text-red-800">
                  Not Connected
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {isConnected ? "Ready to manage models" : "Connect to get started"}
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
              {isConnected ? "No models loaded yet" : "Connect first to see models"}
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
              {isConnected ? "Ready to explore" : "Connect first to explore"}
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
            <CardDescription>Follow these steps to start managing your models</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${isConnected ? 'bg-green-500 text-white' : 'bg-blue-500 text-white'}`}>
                1
              </div>
              <span className={isConnected ? 'line-through text-muted-foreground' : ''}>
                Connect to your Looker instance
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${isConnected ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-600'}`}>
                2
              </div>
              <span className={!isConnected ? 'text-muted-foreground' : ''}>
                Review your models in the Models tab
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${isConnected ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-600'}`}>
                3
              </div>
              <span className={!isConnected ? 'text-muted-foreground' : ''}>
                Explore model relationships and dependencies
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 