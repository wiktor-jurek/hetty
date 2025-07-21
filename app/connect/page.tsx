"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, ArrowLeft, Loader2, CheckCircle, ExternalLink, Info } from "lucide-react"
import Link from "next/link"

export default function ConnectPage() {
  const [clientId, setClientId] = useState("")
  const [clientSecret, setClientSecret] = useState("")
  const [lookerUrl, setLookerUrl] = useState("")
  const [isConnecting, setIsConnecting] = useState(false)
  const [isConnected, setIsConnected] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsConnecting(true)

    // Simulate connection process
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsConnecting(false)
    setIsConnected(true)
  }

  if (isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-6">
          <Card className="border-green-200 bg-green-50">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <CardTitle className="text-green-800">Successfully Connected!</CardTitle>
              <CardDescription className="text-green-700">
                Hetty is now connected to your Looker instance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center space-y-2">
                <p className="text-sm text-green-700">You can now start cleaning up your old models</p>
              </div>
              <Button className="w-full bg-green-600 hover:bg-green-700">Start Model Cleanup</Button>
              <Button variant="outline" className="w-full bg-transparent" asChild>
                <Link href="/">Return to Home</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <Button
            variant="ghost"
            className="inline-flex items-center gap-2 mb-4"
            asChild
          >
            <Link href="/signin">
              <ArrowLeft className="w-4 h-4" />
              Back to sign in
            </Link>
          </Button>
          <div className="flex items-center justify-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Eye className="h-5 w-5 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Hetty
            </span>
          </div>
          <p className="text-slate-600">Connect to your Looker instance</p>
        </div>

        {/* Connection Form */}
        <Card>
          <CardHeader>
            <CardTitle>Looker Connection</CardTitle>
            <CardDescription>Enter your Looker API credentials to get started</CardDescription>
          </CardHeader>
          <CardContent>
            <Alert className="mb-6">
              <Info className="h-4 w-4" />
              <AlertDescription>
                You can find your API credentials in your Looker Admin settings under API.{" "}
                <Button variant="link" className="inline-flex items-center gap-1" asChild>
                  <Link href="#">
                    Learn more
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                </Button>
              </AlertDescription>
            </Alert>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="lookerUrl">Looker Instance URL</Label>
                <Input
                  id="lookerUrl"
                  type="url"
                  placeholder="https://your-company.looker.com"
                  value={lookerUrl}
                  onChange={(e) => setLookerUrl(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="clientId">Client ID</Label>
                <Input
                  id="clientId"
                  type="text"
                  placeholder="Enter your Looker API Client ID"
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="clientSecret">Client Secret</Label>
                <Input
                  id="clientSecret"
                  type="password"
                  placeholder="Enter your Looker API Client Secret"
                  value={clientSecret}
                  onChange={(e) => setClientSecret(e.target.value)}
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                disabled={isConnecting}
              >
                {isConnecting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Connecting to Looker...
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4 mr-2" />
                    Connect to Looker
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-xs text-slate-500">Your credentials are encrypted and stored securely</p>
            </div>
          </CardContent>
        </Card>

        {/* Demo Notice */}
        <div className="text-center">
          <p className="text-xs text-slate-500 bg-slate-100 rounded-lg p-3">
            <strong>Demo:</strong> Enter any valid-looking credentials to continue
          </p>
        </div>
      </div>
    </div>
  )
}
