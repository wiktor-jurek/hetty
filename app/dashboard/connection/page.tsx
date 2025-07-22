"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Database, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function ConnectionPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to the main connections page
    router.replace("/connections")
  }, [router])

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Redirecting...</h2>
        <p className="text-muted-foreground">
          Taking you to the connection setup page.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Connection Setup
          </CardTitle>
          <CardDescription>
            You&apos;re being redirected to the connection setup page where you can add your first connection.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild className="w-full">
                         <Link href="/dashboard/admin">
               <Database className="h-4 w-4 mr-2" />
               Go to Connection Setup
               <ArrowRight className="h-4 w-4 ml-2" />
             </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
} 