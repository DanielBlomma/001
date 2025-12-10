import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card'
import { Dialog, DialogHeader, DialogTitle, DialogContent, DialogFooter } from '../../components/ui/Dialog'
import { FileText, Plus, Search, Edit, Trash2, Eye, Copy, AlertTriangle, Upload, Download } from 'lucide-react'

export default function PagesListPage() {
  const navigate = useNavigate()
  const [pages, setPages] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [pageToDelete, setPageToDelete] = useState(null)
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    fetchPages()
  }, [statusFilter])

  async function fetchPages() {
    try {
      const token = localStorage.getItem('token')
      const url = new URL('http://localhost:3001/api/pages')
      if (statusFilter !== 'all') {
        url.searchParams.append('status', statusFilter)
      }

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setPages(data)
      }
    } catch (error) {
      console.error('Error fetching pages:', error)
    } finally {
      setLoading(false)
    }
  }

  function openDeleteModal(page) {
    setPageToDelete(page)
    setDeleteModalOpen(true)
  }

  function closeDeleteModal() {
    setDeleteModalOpen(false)
    setPageToDelete(null)
  }

  async function confirmDelete() {
    if (!pageToDelete) return

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:3001/api/pages/${pageToDelete.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        setSuccessMessage(`Page "${pageToDelete.title}" deleted successfully`)
        setTimeout(() => setSuccessMessage(''), 3000)
        closeDeleteModal()
        fetchPages()
      }
    } catch (error) {
      console.error('Error deleting page:', error)
    }
  }

  async function duplicatePage(id) {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:3001/api/pages/${id}/duplicate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const duplicatedPage = await response.json()
        alert(`Page duplicated successfully: "${duplicatedPage.title}"`)
        fetchPages()
      } else {
        const error = await response.json()
        alert(`Error duplicating page: ${error.error}`)
      }
    } catch (error) {
      console.error('Error duplicating page:', error)
      alert('An error occurred while duplicating the page')
    }
  }

  async function publishPage(page) {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:3001/api/pages/${page.id}/publish`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        setSuccessMessage(`Page "${page.title}" published successfully`)
        setTimeout(() => setSuccessMessage(''), 3000)
        fetchPages()
      } else {
        const error = await response.json()
        alert(`Error publishing page: ${error.error}`)
      }
    } catch (error) {
      console.error('Error publishing page:', error)
      alert('An error occurred while publishing the page')
    }
  }

  async function unpublishPage(page) {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:3001/api/pages/${page.id}/unpublish`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        setSuccessMessage(`Page "${page.title}" unpublished successfully`)
        setTimeout(() => setSuccessMessage(''), 3000)
        fetchPages()
      } else {
        const error = await response.json()
        alert(`Error unpublishing page: ${error.error}`)
      }
    } catch (error) {
      console.error('Error unpublishing page:', error)
      alert('An error occurred while unpublishing the page')
    }
  }

  const filteredPages = pages.filter(page => {
    if (!search) return true
    return page.title.toLowerCase().includes(search.toLowerCase()) ||
           page.slug.toLowerCase().includes(search.toLowerCase())
  })

  function getStatusBadgeClass(status) {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-medium'
      case 'draft':
        return 'bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-medium'
      case 'scheduled':
        return 'bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium'
      default:
        return 'bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-medium'
    }
  }

  function formatDate(dateString) {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="p-6 space-y-6">
      {/* Success Message */}
      {successMessage && (
        <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2">
          <span>{successMessage}</span>
        </div>
      )}

      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Pages</h1>
        <Button onClick={() => navigate('/admin/pages/new')}>
          <Plus className="w-4 h-4 mr-2" />
          New Page
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Pages</CardTitle>
            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search pages..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="scheduled">Scheduled</option>
              </select>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="text-center py-12 text-gray-500">
              Loading pages...
            </div>
          ) : filteredPages.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg mb-2">No pages found</p>
              <p className="text-gray-400 mb-4">
                {search ? 'Try a different search term' : 'Get started by creating your first page'}
              </p>
              <Button onClick={() => navigate('/admin/pages/new')}>
                <Plus className="w-4 h-4 mr-2" />
                Create Page
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Title</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Author</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Modified</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPages.map((page) => (
                    <tr key={page.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div>
                          <div className="font-medium text-gray-900">{page.title}</div>
                          <div className="text-sm text-gray-500">/{page.slug}</div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={getStatusBadgeClass(page.status)}>
                          {page.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-700">{page.author_name || 'Unknown'}</td>
                      <td className="py-3 px-4 text-gray-600">{formatDate(page.updated_at)}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-2">
                          {page.status === 'draft' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => publishPage(page)}
                              title="Publish"
                              className="text-green-600 hover:text-green-700 hover:bg-green-50"
                            >
                              <Upload className="w-4 h-4" />
                            </Button>
                          )}
                          {page.status === 'published' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => unpublishPage(page)}
                              title="Unpublish"
                              className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate(`/admin/pages/${page.id}/edit`)}
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(`/preview/${page.id}`, '_blank')}
                            title="Preview"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => duplicatePage(page.id)}
                            title="Duplicate"
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openDeleteModal(page)}
                            title="Delete"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
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

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteModalOpen} onClose={closeDeleteModal}>
        <DialogHeader onClose={closeDeleteModal}>
          <DialogTitle>Delete Page</DialogTitle>
        </DialogHeader>
        <DialogContent>
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <AlertTriangle className="w-12 h-12 text-red-600" />
            </div>
            <div>
              <p className="text-gray-900 font-medium mb-2">
                Are you sure you want to delete this page?
              </p>
              {pageToDelete && (
                <p className="text-gray-600 mb-4">
                  <strong>{pageToDelete.title}</strong>
                </p>
              )}
              <p className="text-gray-500 text-sm">
                This action cannot be undone. The page will be permanently removed from the database.
              </p>
            </div>
          </div>
        </DialogContent>
        <DialogFooter>
          <Button
            variant="ghost"
            onClick={closeDeleteModal}
          >
            Cancel
          </Button>
          <Button
            onClick={confirmDelete}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Delete Page
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  )
}
