import { useState, useEffect } from 'react'
import { X, Clock, User, RotateCcw, Eye } from 'lucide-react'
import { Button } from './ui/Button'

export default function RevisionHistoryModal({ pageId, isOpen, onClose, onRestore }) {
  const [revisions, setRevisions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedRevision, setSelectedRevision] = useState(null)
  const [previewContent, setPreviewContent] = useState('')
  const [restoring, setRestoring] = useState(false)

  useEffect(() => {
    if (isOpen && pageId) {
      fetchRevisions()
    }
  }, [isOpen, pageId])

  async function fetchRevisions() {
    setLoading(true)
    setError('')
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:3001/api/pages/${pageId}/revisions`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setRevisions(data)
      } else {
        setError('Failed to load revisions')
      }
    } catch (error) {
      console.error('Error fetching revisions:', error)
      setError('An error occurred while loading revisions')
    } finally {
      setLoading(false)
    }
  }

  function handleViewRevision(revision) {
    setSelectedRevision(revision)
    setPreviewContent(revision.content || '')
  }

  function handleClosePreview() {
    setSelectedRevision(null)
    setPreviewContent('')
  }

  async function handleRestore(revisionId) {
    if (!confirm('Are you sure you want to restore this revision? This will replace the current content.')) {
      return
    }

    setRestoring(true)
    setError('')
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:3001/api/pages/${pageId}/revisions/${revisionId}/restore`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const updatedPage = await response.json()
        // Notify parent component
        if (onRestore) {
          onRestore(updatedPage)
        }
        // Close the modal
        onClose()
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to restore revision')
      }
    } catch (error) {
      console.error('Error restoring revision:', error)
      setError('An error occurred while restoring the revision')
    } finally {
      setRestoring(false)
    }
  }

  function formatDate(dateString) {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold">Revision History</h2>
            <p className="text-sm text-gray-500 mt-1">View and restore previous versions</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {loading ? (
            <div className="text-center py-12">
              <div className="text-gray-500">Loading revisions...</div>
            </div>
          ) : revisions.length === 0 ? (
            <div className="text-center py-12">
              <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No revisions yet</p>
              <p className="text-sm text-gray-400 mt-2">
                Revisions are created automatically when you save changes
              </p>
            </div>
          ) : selectedRevision ? (
            // Preview mode
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Button variant="ghost" onClick={handleClosePreview}>
                  ← Back to list
                </Button>
                <Button
                  onClick={() => handleRestore(selectedRevision.id)}
                  disabled={restoring}
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  {restoring ? 'Restoring...' : 'Restore This Version'}
                </Button>
              </div>

              <div className="bg-gray-50 p-4 rounded border">
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {formatDate(selectedRevision.created_at)}
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    {selectedRevision.author_name || 'Unknown'}
                  </div>
                </div>
                <div className="bg-white p-4 rounded border">
                  <h3 className="font-semibold mb-2">Content Preview:</h3>
                  <pre className="whitespace-pre-wrap text-sm font-mono bg-gray-50 p-3 rounded border overflow-auto max-h-96">
                    {previewContent}
                  </pre>
                </div>
              </div>
            </div>
          ) : (
            // List mode
            <div className="space-y-3">
              {revisions.map((revision, index) => (
                <div
                  key={revision.id}
                  className="border rounded-lg p-4 hover:border-blue-300 hover:bg-blue-50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-sm font-semibold text-blue-600">
                          #{revisions.length - index}
                        </span>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock className="w-4 h-4" />
                          {formatDate(revision.created_at)}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <User className="w-4 h-4" />
                          {revision.author_name || 'Unknown'}
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        Content length: {revision.content?.length || 0} characters
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewRevision(revision)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRestore(revision.id)}
                        disabled={restoring}
                      >
                        <RotateCcw className="w-4 h-4 mr-1" />
                        Restore
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {!selectedRevision && (
          <div className="flex items-center justify-end gap-3 p-6 border-t bg-gray-50">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
