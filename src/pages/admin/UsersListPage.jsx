import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card'
import { Users, Plus, Search, Edit, Trash2, UserCheck, UserX } from 'lucide-react'

export default function UsersListPage() {
  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchUsers()
  }, [])

  async function fetchUsers() {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:3001/api/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.status === 403) {
        setError('Access denied: You do not have permission to view users')
        setLoading(false)
        return
      }

      if (!response.ok) {
        throw new Error('Failed to fetch users')
      }

      const data = await response.json()
      setUsers(Array.isArray(data) ? data : (data.users || []))
      setError(null)
    } catch (error) {
      console.error('Error fetching users:', error)
      setError('Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  async function deleteUser(id) {
    if (!confirm('Are you sure you want to deactivate this user?')) return

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:3001/api/users/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        fetchUsers()
      } else {
        const data = await response.json()
        alert(data.error || 'Failed to deactivate user')
      }
    } catch (error) {
      console.error('Error deactivating user:', error)
      alert('Failed to deactivate user')
    }
  }

  const filteredUsers = users.filter(user => {
    if (!search) return true
    return user.name?.toLowerCase().includes(search.toLowerCase()) ||
           user.email.toLowerCase().includes(search.toLowerCase()) ||
           user.role.toLowerCase().includes(search.toLowerCase())
  })

  function getRoleBadgeClass(role) {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-800 px-2 py-1 rounded text-sm font-medium'
      case 'editor':
        return 'bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium'
      case 'viewer':
        return 'bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-medium'
      default:
        return 'bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-medium'
    }
  }

  function formatDate(dateString) {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center text-gray-500">Loading users...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Users</h1>
        </div>
        <Card>
          <CardContent>
            <div className="text-center py-12">
              <UserX className="w-16 h-16 text-red-400 mx-auto mb-4" />
              <p className="text-xl font-semibold text-red-600 mb-2">Access Denied</p>
              <p className="text-gray-600">{error}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Users</h1>
        <Button onClick={() => navigate('/admin/users/new')}>
          <Plus className="w-4 h-4 mr-2" />
          New User
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              All Users
            </CardTitle>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search users..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredUsers.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No users found</p>
              <Button
                variant="outline"
                onClick={() => navigate('/admin/users/new')}
                className="mt-4"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Your First User
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b">
                  <tr className="text-left">
                    <th className="pb-3 font-semibold text-sm text-gray-700">Name</th>
                    <th className="pb-3 font-semibold text-sm text-gray-700">Email</th>
                    <th className="pb-3 font-semibold text-sm text-gray-700">Role</th>
                    <th className="pb-3 font-semibold text-sm text-gray-700">Status</th>
                    <th className="pb-3 font-semibold text-sm text-gray-700">Last Login</th>
                    <th className="pb-3 font-semibold text-sm text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b last:border-0 hover:bg-gray-50">
                      <td className="py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                            {(user.name || user.email).charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium">{user.name || '-'}</span>
                        </div>
                      </td>
                      <td className="py-4 text-gray-600">{user.email}</td>
                      <td className="py-4">
                        <span className={getRoleBadgeClass(user.role)}>
                          {user.role}
                        </span>
                      </td>
                      <td className="py-4">
                        {user.is_active ? (
                          <span className="flex items-center gap-1 text-green-600">
                            <UserCheck className="w-4 h-4" />
                            Active
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-gray-400">
                            <UserX className="w-4 h-4" />
                            Inactive
                          </span>
                        )}
                      </td>
                      <td className="py-4 text-sm text-gray-500">
                        {formatDate(user.last_login)}
                      </td>
                      <td className="py-4">
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/admin/users/${user.id}/edit`)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteUser(user.id)}
                            className="text-red-600 hover:text-red-700 hover:border-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
