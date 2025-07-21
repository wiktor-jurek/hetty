"use client"

import { 
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { 
  Database, 
  Boxes, 
  Search, 
  Settings,
  Lock,
  CheckCircle
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, createContext, useContext } from "react"

// Simple connection state context for now
const ConnectionContext = createContext<{
  isConnected: boolean
  setIsConnected: (connected: boolean) => void
}>({
  isConnected: false,
  setIsConnected: () => {}
})

export function useConnection() {
  return useContext(ConnectionContext)
}

const navItems = [
  {
    title: "Connection",
    url: "/dashboard/connection",
    icon: Database,
    description: "Connect to your Looker instance"
  },
  {
    title: "Models",
    url: "/dashboard/models", 
    icon: Boxes,
    description: "Manage and clean up your models",
    requiresConnection: true
  },
  {
    title: "Explore",
    url: "/dashboard/explore",
    icon: Search,
    description: "Explore model relationships",
    requiresConnection: true
  },
]

function DashboardSidebar() {
  const pathname = usePathname()
  const { isConnected } = useConnection()

  return (
    <Sidebar variant="inset">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-2">
          <video 
            autoPlay 
            loop 
            muted 
            playsInline 
            className="w-6 h-6 rounded-md"
            style={{ objectFit: 'cover' }}
          >
            <source src="/hetty-animation.mp4" type="video/mp4" />
          </video>
          <span className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Hetty
          </span>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive = pathname === item.url
                const isLocked = item.requiresConnection && !isConnected
                
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild={!isLocked}
                      isActive={isActive}
                      disabled={isLocked}
                      className={isLocked ? "opacity-50 cursor-not-allowed" : ""}
                    >
                      {isLocked ? (
                        <div className="flex items-center gap-2">
                          <Lock className="h-4 w-4" />
                          <span>{item.title}</span>
                        </div>
                      ) : (
                        <Link href={item.url}>
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                          {item.title === "Connection" && isConnected && (
                            <CheckCircle className="h-3 w-3 text-green-500 ml-auto" />
                          )}
                        </Link>
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/">
                <Settings className="h-4 w-4" />
                <span>Back to Home</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      
      <SidebarRail />
    </Sidebar>
  )
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isConnected, setIsConnected] = useState(false)

  return (
    <ConnectionContext.Provider value={{ isConnected, setIsConnected }}>
      <SidebarProvider>
        <DashboardSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <div className="h-4 w-px bg-sidebar-border" />
              <h1 className="text-lg font-semibold">Dashboard</h1>
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </ConnectionContext.Provider>
  )
} 