"use client"

import { 
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Database, 
  Boxes, 
  Search, 
  Settings,
  Lock,
  CheckCircle,
  LayoutDashboard,
  LogOut,
  User,
  Building,
  ChevronDown,
  Plus,
  Users,
  UserPlus,
  Shield,
  BarChart3
} from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime"
import { useState, createContext, useContext, useEffect, useCallback } from "react"
import { useSession, signOut } from "@/lib/auth-client"
import { Toaster } from "@/components/ui/toaster"

// Types for organization and connection data
interface Organization {
  organisationId: number
  organisationName: string
  role: string
}

interface Connection {
  id: number
  name: string
  type: string
  uniqueIdentifier: string
  createdAt: string
  createdBy: string
  organisationId: number
  organisationName: string
  creatorName: string
  creatorEmail: string
  addedBy: string
  addedAt: string
}

// Context for managing organization and connection state
const DashboardContext = createContext<{
  // Organization state
  organizations: Organization[]
  selectedOrganization: Organization | null
  setSelectedOrganization: (org: Organization | null) => void
  
  // Connection state
  connections: Connection[]
  selectedConnection: Connection | null
  setSelectedConnection: (conn: Connection | null) => void
  
  // Loading and connection status
  isLoading: boolean
  isConnected: boolean
  
  // Refresh function
  refreshData: () => Promise<void>
}>({
  organizations: [],
  selectedOrganization: null,
  setSelectedOrganization: () => {},
  connections: [],
  selectedConnection: null,
  setSelectedConnection: () => {},
  isLoading: false,
  isConnected: false,
  refreshData: async () => {},
})

export function useDashboard() {
  return useContext(DashboardContext)
}

const navItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
    description: "Overview and statistics"
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
  {
    title: "Henry Analytics",
    url: "/henry",
    icon: BarChart3,
    description: "Looker instance health analysis and maintenance insights"
  },
]

function OrganizationSelector({ 
  organizations, 
  selectedOrganization, 
  onSelectOrganization 
}: {
  organizations: Organization[]
  selectedOrganization: Organization | null
  onSelectOrganization: (org: Organization) => void
}) {
  return (
    <div className="px-2 py-2">
      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
        <Building className="h-3 w-3" />
        <span>Organization</span>
      </div>
      
      {organizations.length > 0 ? (
        <Select 
          value={selectedOrganization?.organisationId.toString() || ""} 
          onValueChange={(value) => {
            const org = organizations.find(o => o.organisationId.toString() === value)
            if (org) onSelectOrganization(org)
          }}
        >
          <SelectTrigger className="w-full h-8">
            <SelectValue placeholder="Select organization" />
          </SelectTrigger>
          <SelectContent className="bg-white border shadow-md">
            {organizations.map((org) => (
              <SelectItem key={org.organisationId} value={org.organisationId.toString()}>
                <div className="flex items-center gap-2">
                  <span>{org.organisationName}</span>
                  <span className="text-xs text-muted-foreground">({org.role})</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : (
        <div className="text-xs text-muted-foreground p-2 border rounded">
          No organizations
        </div>
      )}
    </div>
  )
}

function ConnectionSelector({ 
  connections, 
  selectedConnection, 
  onSelectConnection,
  selectedOrganization
}: {
  connections: Connection[]
  selectedConnection: Connection | null
  onSelectConnection: (conn: Connection) => void
  selectedOrganization: Organization | null
}) {
  // Filter connections to only show those belonging to the selected organization
  const filteredConnections = selectedOrganization 
    ? connections.filter((c: Connection) => c.organisationId === selectedOrganization.organisationId)
    : connections

  if (filteredConnections.length === 0) return null

  return (
    <div className="px-2 py-2">
      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
        <Database className="h-3 w-3" />
        <span>Connection</span>
      </div>
      <Select 
        value={selectedConnection?.id.toString() || ""} 
        onValueChange={(value) => {
          const conn = filteredConnections.find(c => c.id.toString() === value)
          if (conn) onSelectConnection(conn)
        }}
      >
        <SelectTrigger className="w-full h-8">
          <SelectValue placeholder="Select connection" />
        </SelectTrigger>
        <SelectContent className="bg-white border shadow-md">
          {filteredConnections.map((conn) => (
            <SelectItem key={conn.id} value={conn.id.toString()}>
              <div className="flex items-center gap-2">
                <span>{conn.name}</span>
                <span className="text-xs text-muted-foreground">({conn.type})</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

function AdminPanel({ 
  organizations,
  router,
  pathname 
}: {
  organizations: Organization[]
  router: AppRouterInstance
  pathname: string
}) {
  const isAdmin = organizations.some(org => org.role === 'admin');
  const hasOrganizations = organizations.length > 0;

  // Only show if user is admin OR has no organizations (needs to create one)
  if (!isAdmin && hasOrganizations) return null;

  const isActive = pathname.startsWith('/dashboard/admin');

  return (
    <div className="px-2 py-2">
      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
        <Shield className="h-3 w-3" />
        <span>{isAdmin ? 'Admin' : 'Getting Started'}</span>
      </div>
      
      <Button
        variant={isActive ? 'default' : 'ghost'}
        size="sm"
        onClick={() => router.push('/dashboard/admin')}
        className={`justify-start gap-2 h-8 text-xs w-full ${
          isActive 
            ? 'bg-primary text-primary-foreground' 
            : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        {isAdmin ? (
          <>
            <Shield className="h-3 w-3" />
            Admin Panel
          </>
        ) : (
          <>
            <Plus className="h-3 w-3" />
            Create Organization
          </>
        )}
      </Button>
    </div>
  );
}

function DashboardSidebar() {
  const pathname = usePathname()
  const { 
    organizations, 
    selectedOrganization, 
    setSelectedOrganization,
    connections, 
    selectedConnection, 
    setSelectedConnection,
    isConnected,
    refreshData
  } = useDashboard()
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
    <Sidebar variant="inset">
      <SidebarHeader>
        <SidebarMenuButton asChild className="px-2 py-2">
          <Link href="/" className="flex items-center gap-2">
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
          </Link>
        </SidebarMenuButton>
      </SidebarHeader>
      
      <SidebarContent>
        {/* Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
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
        {/* Admin Panel */}
        <SidebarGroup>
          <SidebarGroupContent>
            <AdminPanel 
              organizations={organizations}
              router={router}
              pathname={pathname}
            />
          </SidebarGroupContent>
        </SidebarGroup>
        
        {/* Organization and Connection Selectors */}
        <SidebarGroup>
          <SidebarGroupLabel>Context</SidebarGroupLabel>
          <SidebarGroupContent>
            <OrganizationSelector 
              organizations={organizations}
              selectedOrganization={selectedOrganization}
              onSelectOrganization={setSelectedOrganization}
            />
            <ConnectionSelector 
              connections={connections}
              selectedConnection={selectedConnection}
              onSelectConnection={setSelectedConnection}
              selectedOrganization={selectedOrganization}
            />
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarMenu>
          {session?.user && (
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage 
                        src={session.user.image || undefined} 
                        alt={session.user.name || "User"}
                      />
                      <AvatarFallback className="rounded-lg">
                        {session.user.name ? getUserInitials(session.user.name) : <User className="h-4 w-4" />}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        {session.user.name || "User"}
                      </span>
                      <span className="truncate text-xs">
                        {session.user.email}
                      </span>
                    </div>
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg bg-white border shadow-md"
                  side="bottom"
                  align="end"
                  sideOffset={4}
                >
                  <DropdownMenuLabel className="p-0 font-normal">
                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                      <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarImage 
                          src={session.user.image || undefined} 
                          alt={session.user.name || "User"}
                        />
                        <AvatarFallback className="rounded-lg">
                          {session.user.name ? getUserInitials(session.user.name) : <User className="h-4 w-4" />}
                        </AvatarFallback>
                      </Avatar>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold">
                          {session.user.name || "User"}
                        </span>
                        <span className="truncate text-xs">
                          {session.user.email}
                        </span>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          )}
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
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [selectedOrganization, setSelectedOrganization] = useState<Organization | null>(null)
  const [connections, setConnections] = useState<Connection[]>([])
  const [selectedConnection, setSelectedConnection] = useState<Connection | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const isConnected = connections.length > 0 && selectedConnection !== null

  const refreshData = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/connections")
      if (response.ok) {
        const data = await response.json()
        
        // Set organizations
        const orgs = data.organizations || []
        setOrganizations(orgs)
        
        // Set connections
        const conns = data.connections || []
        setConnections(conns)
        
        // Auto-select first organization if none selected
        if (orgs.length > 0 && !selectedOrganization) {
          setSelectedOrganization(orgs[0])
        }
        
        // Auto-select first connection if none selected and organization is selected
        if (conns.length > 0 && !selectedConnection && selectedOrganization) {
          const orgConnections = conns.filter((c: Connection) => c.organisationId === selectedOrganization.organisationId)
          if (orgConnections.length > 0) {
            setSelectedConnection(orgConnections[0])
          }
        }
      }
    } catch (error) {
      console.error("Failed to fetch data:", error)
    } finally {
      setIsLoading(false)
    }
  }, [selectedOrganization, selectedConnection])

  // Fetch data on mount
  useEffect(() => {
    refreshData()
  }, [])

  // Update selected connection when organization changes
  useEffect(() => {
    if (selectedOrganization && connections.length > 0) {
      const orgConnections = connections.filter((c: Connection) => c.organisationId === selectedOrganization.organisationId)
      if (orgConnections.length > 0) {
        // If current connection doesn't belong to selected org, switch to first available
        if (!selectedConnection || selectedConnection.organisationId !== selectedOrganization.organisationId) {
          setSelectedConnection(orgConnections[0])
        }
      } else {
        setSelectedConnection(null)
      }
    }
  }, [selectedOrganization, connections])

  return (
    <DashboardContext.Provider value={{
      organizations,
      selectedOrganization,
      setSelectedOrganization,
      connections,
      selectedConnection,
      setSelectedConnection,
      isLoading,
      isConnected,
      refreshData,
    }}>
      <SidebarProvider>
        <DashboardSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <div className="h-4 w-px bg-sidebar-border" />
              <h1 className="text-lg font-semibold">Dashboard</h1>
              {selectedOrganization && (
                <>
                  <div className="h-4 w-px bg-sidebar-border" />
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Building className="h-3 w-3" />
                    <span>{selectedOrganization.organisationName}</span>
                  </div>
                </>
              )}
              {selectedConnection && (
                <>
                  <div className="h-4 w-px bg-sidebar-border" />
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Database className="h-3 w-3" />
                    <span>{selectedConnection.name}</span>
                  </div>
                </>
              )}
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            {children}
          </div>
        </SidebarInset>
        <Toaster />
      </SidebarProvider>
    </DashboardContext.Provider>
  )
} 