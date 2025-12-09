import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileText, Image, Users, Plus } from 'lucide-react'

export default function AdminDashboard() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Welcome back! Here's an overview of your content.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Pages"
          value="0"
          icon={FileText}
          description="Published and draft pages"
        />
        <StatCard
          title="Media Files"
          value="0"
          icon={Image}
          description="Images and documents"
        />
        <StatCard
          title="Users"
          value="1"
          icon={Users}
          description="Admin and editor accounts"
        />
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks to get you started</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Page
            </Button>
            <Button variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Upload Media
            </Button>
            <Button variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest changes to your content</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground text-center py-8">
            No recent activity yet. Start creating content to see updates here.
          </div>
        </CardContent>
      </Card>

      {/* Contact Submissions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Contact Submissions</CardTitle>
          <CardDescription>Messages from your contact form</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground text-center py-8">
            No contact submissions yet.
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function StatCard({ title, value, icon: Icon, description }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </CardContent>
    </Card>
  )
}
