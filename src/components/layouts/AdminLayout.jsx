import { Outlet, Link, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  FileText,
  Image,
  Menu,
  Users,
  Settings,
  ExternalLink,
  LogOut
} from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function AdminLayout() {
  const navigate = useNavigate()

  const handleLogout = () => {
    // TODO: Clear auth token
    localStorage.removeItem('token')
    navigate('/admin/login')
  }

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-muted/30 flex flex-col">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold">Modern CMS</h2>
          <p className="text-xs text-muted-foreground mt-1">Admin Panel</p>
        </div>

        <nav className="flex-1 p-4">
          <div className="space-y-1">
            <SidebarLink to="/admin" icon={LayoutDashboard}>
              Dashboard
            </SidebarLink>
            <SidebarLink to="/admin/pages" icon={FileText}>
              Pages
            </SidebarLink>
            <SidebarLink to="/admin/media" icon={Image}>
              Media Library
            </SidebarLink>
            <SidebarLink to="/admin/menus" icon={Menu}>
              Menus
            </SidebarLink>
            <SidebarLink to="/admin/users" icon={Users}>
              Users
            </SidebarLink>
            <SidebarLink to="/admin/settings" icon={Settings}>
              Settings
            </SidebarLink>
          </div>

          <div className="mt-8 pt-4 border-t">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              View Site
            </a>
          </div>
        </nav>

        <div className="p-4 border-t">
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="border-b bg-background px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold">Admin Dashboard</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                admin@example.com
              </span>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto bg-muted/20">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

function SidebarLink({ to, icon: Icon, children }) {
  return (
    <Link
      to={to}
      className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent text-sm transition-colors"
    >
      <Icon className="h-4 w-4" />
      {children}
    </Link>
  )
}
