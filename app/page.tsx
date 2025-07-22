"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Eye, Shield, Zap, Users, Building, CheckCircle } from "lucide-react"
import Link from "next/link"
import { useSession } from "@/lib/auth-client"

export default function HomePage() {
  const { data: session, isPending } = useSession()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="text-center space-y-6 max-w-4xl mx-auto">
          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Eye className="h-6 w-6 text-white" />
            </div>
            <span className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Hetty
            </span>
          </div>

          {/* Hero Content */}
          <div className="space-y-4">
            <Badge variant="secondary" className="mb-4">
              Connection-Driven Organizations
            </Badge>
            <h1 className="text-5xl font-bold text-slate-900 leading-tight">
              Connect Your Team Through
              <br />
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Shared Connections
              </span>
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Hetty creates organizations around your data connections. When you add a connection, 
              you either join an existing team or create your own organization.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {!isPending && (
              <Button asChild size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                <Link href={session?.user ? "/dashboard" : "/signin"}>
                  {session?.user ? "Go to Dashboard" : "Get Started"}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">How It Works</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Our connection-driven approach automatically organizes teams around shared data sources
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Card className="text-center">
            <CardHeader>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle>1. Sign Up & Connect</CardTitle>
              <CardDescription>
                Create your account and add your first data connection (Looker, Salesforce, etc.)
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Building className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle>2. Automatic Organization</CardTitle>
              <CardDescription>
                If the connection is new, create an organization. If it exists, join the existing team.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Zap className="h-6 w-6 text-purple-600" />
              </div>
              <CardTitle>3. Collaborate</CardTitle>
              <CardDescription>
                Work together with your team on shared data sources and analytics projects
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Why Choose Hetty?</h2>
              <p className="text-lg text-slate-600">
                Built for teams that want seamless collaboration around their data connections
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-slate-900">Connection-Driven Teams</h3>
                    <p className="text-slate-600">Organizations form naturally around shared data connections</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-slate-900">Secure & Encrypted</h3>
                    <p className="text-slate-600">All connection credentials are encrypted and securely stored</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-slate-900">Smart Organization</h3>
                    <p className="text-slate-600">Automatic team creation and join requests for existing connections</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-slate-900">Multiple Connections</h3>
                    <p className="text-slate-600">Support for Looker, Salesforce, and more data sources</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-slate-900">Role-Based Access</h3>
                    <p className="text-slate-600">Admin and member roles with appropriate permissions</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-slate-900">Easy Onboarding</h3>
                    <p className="text-slate-600">Streamlined signup process that gets you started quickly</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            Ready to Connect Your Team?
          </h2>
          <p className="text-lg text-slate-600 mb-8">
            Start by adding your first connection and see how Hetty organizes your team automatically
          </p>
          {!isPending && (
            <Button asChild size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
              <Link href={session?.user ? "/dashboard" : "/signin"}>
                {session?.user ? "Go to Dashboard" : "Start Your Free Account"}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
