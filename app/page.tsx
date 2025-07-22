"use client"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ArrowRight, LogOut, User } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useSession, signOut } from "@/lib/auth-client"

function Navbar() {
  const { data: session, isPending } = useSession()
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push("/")
          },
        },
      })
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part.charAt(0).toUpperCase())
      .slice(0, 2)
      .join("")
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            Hetty
          </Link>

          {/* Auth Section */}
          <div className="flex items-center gap-4">
            {isPending ? (
              <div className="w-8 h-8 rounded-full bg-slate-100 animate-pulse" />
            ) : session?.user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 h-10">
                    <Avatar className="h-8 w-8">
                      <AvatarImage 
                        src={session.user.image || undefined} 
                        alt={session.user.name || "User"}
                      />
                      <AvatarFallback>
                        {session.user.name ? getUserInitials(session.user.name) : <User className="h-4 w-4" />}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium">
                      {session.user.name || "User"}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-56 bg-white border shadow-md"
                  side="bottom"
                  align="end"
                  sideOffset={4}
                >
                  <DropdownMenuLabel className="p-0 font-normal">
                    <div className="flex items-center gap-2 px-2 py-1.5 text-left text-sm">
                      <Avatar className="h-8 w-8">
                        <AvatarImage 
                          src={session.user.image || undefined} 
                          alt={session.user.name || "User"}
                        />
                        <AvatarFallback>
                          {session.user.name ? getUserInitials(session.user.name) : <User className="h-4 w-4" />}
                        </AvatarFallback>
                      </Avatar>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold">
                          {session.user.name || "User"}
                        </span>
                        <span className="truncate text-xs text-slate-500">
                          {session.user.email}
                        </span>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                    <LogOut className="h-4 w-4 mr-2" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild variant="outline">
                <Link href="/signin">
                  Sign In
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default function HomePage() {
  const { data: session, isPending } = useSession()

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="container mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-screen">
        <div className="text-center space-y-8 max-w-4xl mx-auto">
          {/* Animation */}
          <div className="flex justify-center mb-8">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-64 h-64 object-contain"
            >
              <source src="/hetty-animation.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>

          {/* Heading and Tagline */}
          <div className="space-y-6">
            <h1 className="text-5xl font-bold text-slate-900 leading-tight">
              Hetty
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Hetty helps clean your Looker instance, visually. It's an homage to the Looker CLI tool, Henry, 
              and has the same functionality, but visual, so you can track progress and it's all nice and managed.
            </p>
          </div>

          {/* CTA Button */}
          {!isPending && (
            <div className="pt-4">
              <Button asChild size="lg" className="bg-slate-900 hover:bg-slate-800 text-white">
                <Link href={session?.user ? "/dashboard" : "/signin"}>
                  {session?.user ? "Go to Dashboard" : "Get Started"}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
