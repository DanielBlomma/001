import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Label } from '../../components/ui/Label'
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card'
import { RevisionHistory } from '../../components/RevisionHistory'
import RichTextEditor from '../../components/RichTextEditor'
import { ArrowLeft, Save, Eye, History } from 'lucide-react'

export default function PageEditorPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEditMode = Boolean(id)

  const [loading, setLoading] = useState(isEditMode)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showRevisions, setShowRevisions] = useState(false)

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    template: 'standard',
    status: 'draft',
    scheduled_at: ''
  })

  useEffect(() => {
    if (isEditMode) {
      fetchPage()
    }
  }, [id])

  async function fetchPage() {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:3001/api/pages/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        // Format scheduled_at for datetime-local input (YYYY-MM-DDThh:mm)
        let scheduledAtValue = ''
        if (data.scheduled_at) {
          const date = new Date(data.scheduled_at)
          scheduledAtValue = date.toISOString().slice(0, 16)
        }
        setFormData({
          title: data.title || '',
          slug: data.slug || '',
          content: data.content || '',
          excerpt: data.excerpt || '',
          template: data.template || 'standard',
          status: data.status || 'draft',
          scheduled_at: scheduledAtValue
        })
      } else {
        setError('Failed to load page')
      }
    } catch (error) {
      console.error('Error fetching page:', error)
      setError('An error occurred while loading the page')
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccess('')
    setSaving(true)

    try {
      const token = localStorage.getItem('token')
      const url = isEditMode
        ? `http://localhost:3001/api/pages/${id}`
        : 'http://localhost:3001/api/pages'
      const method = isEditMode ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        const data = await response.json()
        setSuccess(`Page ${isEditMode ? 'updated' : 'created'} successfully!`)
        setTimeout(() => {
          navigate('/admin/pages')
        }, 1500)
      } else {
        const errorData = await response.json()
        setError(errorData.error || `Failed to ${isEditMode ? 'update' : 'create'} page`)
      }
    } catch (error) {
      console.error('Error saving page:', error)
      setError('An error occurred while saving the page')
    } finally {
      setSaving(false)
    }
  }

  function handleChange(e) {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    // Auto-generate slug from title if creating new page
    if (name === 'title' && !isEditMode && !formData.slug) {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
      setFormData(prev => ({
        ...prev,
        slug
      }))
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center py-12">Loading page...</div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/admin/pages')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold">
            {isEditMode ? 'Edit Page' : 'New Page'}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          {isEditMode && (
            <Button
              variant="outline"
              onClick={() => setShowRevisions(true)}
            >
              <History className="w-4 h-4 mr-2" />
              Revision History
            </Button>
          )}
          <Button
            variant="outline"
            onClick={() => alert('Preview feature coming soon!')}
          >
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={saving}
          >
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </div>

      {/* Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
          {success}
        </div>
      )}

      <div className="grid grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Page Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Title */}
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter page title"
                  required
                  className="text-2xl font-bold"
                />
              </div>

              {/* Slug */}
              <div>
                <Label htmlFor="slug">URL Slug *</Label>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">/</span>
                  <Input
                    id="slug"
                    name="slug"
                    value={formData.slug}
                    onChange={handleChange}
                    placeholder="page-slug"
                    required
                  />
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  The URL-friendly version of the title
                </p>
              </div>

              {/* Content */}
              <div>
                <Label htmlFor="content">Content</Label>
                <textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  rows={15}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                  placeholder="Enter page content (HTML or plain text)"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Rich text editor will be available soon
                </p>
              </div>

              {/* Excerpt */}
              <div>
                <Label htmlFor="excerpt">Excerpt</Label>
                <textarea
                  id="excerpt"
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Brief description of this page"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="col-span-1 space-y-6">
          {/* Status */}
          <Card>
            <CardHeader>
              <CardTitle>Publish</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="scheduled">Scheduled</option>
                </select>
              </div>

              {/* Show scheduled date/time input when status is 'scheduled' */}
              {formData.status === 'scheduled' && (
                <div>
                  <Label htmlFor="scheduled_at">Publish Date & Time</Label>
                  <input
                    type="datetime-local"
                    id="scheduled_at"
                    name="scheduled_at"
                    value={formData.scheduled_at}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Select when this page should be published
                  </p>
                </div>
              )}

              <div>
                <Label htmlFor="template">Template</Label>
                <select
                  id="template"
                  name="template"
                  value={formData.template}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="standard">Standard Page</option>
                  <option value="homepage">Homepage</option>
                  <option value="blog_post">Blog Post</option>
                  <option value="landing">Landing Page</option>
                </select>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Revision History Dialog */}
      {isEditMode && (
        <RevisionHistory
          pageId={id}
          open={showRevisions}
          onClose={() => setShowRevisions(false)}
        />
      )}
    </div>
  )
}
