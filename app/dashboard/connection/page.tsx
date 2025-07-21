"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { Database, CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { useConnection } from "../layout"

export default function ConnectionPage() {
  const { isConnected, setIsConnected } = useConnection()
  const [isConnecting, setIsConnecting] = useState(false)
  const [connectionForm, setConnectionForm] = useState({
    host: "",
    clientId: "",
    clientSecret: "",
    port: "19999"
  })

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsConnecting(true)
    
    // Simulate connection process
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsConnected(true)
    setIsConnecting(false)
  }

  const handleDisconnect = () => {
    setIsConnected(false)
    setConnectionForm({
      host: "",
      clientId: "",
      clientSecret: "",
      port: "19999"
    })
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Looker Connection</h2>
        <p className="text-muted-foreground">
          Connect to your Looker instance to start managing models with Hetty.
        </p>
      </div>

      {isConnected ? (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <CardTitle className="text-green-800">Connected to Looker</CardTitle>
            </div>
            <CardDescription className="text-green-700">
              Your connection is active and ready for model management.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <Label className="text-green-700">Host</Label>
                <p className="font-mono bg-white p-2 rounded border">demo.looker.com</p>
              </div>
              <div>
                <Label className="text-green-700">Port</Label>
                <p className="font-mono bg-white p-2 rounded border">19999</p>
              </div>
            </div>
            <Button variant="outline" onClick={handleDisconnect} className="border-red-200 text-red-700 hover:bg-red-50">
              Disconnect
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Connect to Looker
            </CardTitle>
            <CardDescription>
              Enter your Looker instance details to establish a connection.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleConnect} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="host">Host</Label>
                  <Input
                    id="host"
                    placeholder="your-instance.looker.com"
                    value={connectionForm.host}
                    onChange={(e) => setConnectionForm(prev => ({ ...prev, host: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="port">Port</Label>
                  <Input
                    id="port"
                    placeholder="19999"
                    value={connectionForm.port}
                    onChange={(e) => setConnectionForm(prev => ({ ...prev, port: e.target.value }))}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="clientId">Client ID</Label>
                <Input
                  id="clientId"
                  placeholder="Enter your API client ID"
                  value={connectionForm.clientId}
                  onChange={(e) => setConnectionForm(prev => ({ ...prev, clientId: e.target.value }))}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="clientSecret">Client Secret</Label>
                <Input
                  id="clientSecret"
                  type="password"
                  placeholder="Enter your API client secret"
                  value={connectionForm.clientSecret}
                  onChange={(e) => setConnectionForm(prev => ({ ...prev, clientSecret: e.target.value }))}
                  required
                />
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isConnecting}
              >
                {isConnecting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <Database className="h-4 w-4 mr-2" />
                    Connect to Looker
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Connection Help</CardTitle>
          <CardDescription>
            Need help setting up your Looker connection? Here are some resources.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div>
              <h4 className="font-medium">API Credentials</h4>
              <p className="text-sm text-muted-foreground">
                You&apos;ll need to create API credentials in your Looker admin panel. Go to Admin → Users → API3 Keys to generate new credentials.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium">Required Permissions</h4>
              <p className="text-sm text-muted-foreground">
                Your API user needs the following permissions: see_lookml_dashboards, see_lookml, see_projects, develop, deploy.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium">Network Access</h4>
              <p className="text-sm text-muted-foreground">
                Ensure your Looker instance is accessible from your network and the API port (typically 19999) is open.
              </p>
            </div>
          </div>
          
          <div className="pt-4 border-t">
            <Badge variant="secondary" className="mb-2">💡 Tip</Badge>
            <p className="text-sm text-muted-foreground">
              For demo purposes, you can use any values in the form above - the connection will be simulated.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 