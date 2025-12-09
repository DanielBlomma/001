import { useState, useEffect } from 'react'
import { Dialog, DialogHeader, DialogTitle, DialogContent, DialogFooter } from './ui/Dialog'
import { Button } from './ui/Button'
import { Clock, User } from 'lucide-react'

export function RevisionHistory({ pageId, open, onClose }) {
  const [revisions, setRevisions] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [selectedRevision, setSelectedRevision] = useState(null)
  const [viewingRevision, setViewingRevision] = useState(false)

  useEffect(() => {
    if (open && pageId) {
      fetchRevisions()
    }
  }, [open, pageId])

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
        setError('Failed to load revision history')
      }
    } catch (error) {
      console.error('Error fetching revisions:', error)
      setError('An error occurred while loading revisions')
    } finally {
      setLoading(false)
    }
  }

  async function viewRevision(revision) {
    setSelectedRevision(revision)
    setViewingRevision(true)
  }

  function formatDate(dateString) {
    const date = new Date(dateString)
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (viewingRevision && selectedRevision) {
    return (
      <Dialog open={true} onClose={() => setViewingRevision(false)}>
        <DialogHeader onClose={() => setViewingRevision(false)}>
          <DialogTitle>View Revision</DialogTitle>
        </DialogHeader>
        <DialogContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{formatDate(selectedRevision.created_at)}</span>
              </div>
              <div className="flex items-center gap-1">
                <User className="w-4 h-4" />
                <span>{selectedRevision.author_name || 'Unknown'}</span>
              </div>
            </div>
            <div className="border rounded-lg p-4 bg-gray-50">
              <h3 className="font-semibold mb-2">Content:</h3>
              <div className="whitespace-pre-wrap text-sm">
                {selectedRevision.content || '(No content)'}
              </div>
            </div>
          </div>
        </DialogContent>
        <DialogFooter>
          <Button variant="outline" onClick={() => setViewingRevision(false)}>
            Close
          </Button>
        </DialogFooter>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogHeader onClose={onClose}>
        <DialogTitle>Revision History</DialogTitle>
      </DialogHeader>
      <DialogContent>
        {loading && (
          <div className="text-center py-8 text-gray-500">
            Loading revisions...
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {!loading && !error && revisions.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No revision history yet. Save changes to this page to create revisions.
          </div>
        )}

        {!loading && !error && revisions.length > 0 && (
          <div className="space-y-2">
            {revisions.map((revision) => (
              <div
                key={revision.id}
                className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="font-medium">
                        {formatDate(revision.created_at)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <User className="w-4 h-4" />
                      <span>{revision.author_name || 'Unknown'}</span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => viewRevision(revision)}
                  >
                    View
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
      </DialogFooter>
    </Dialog>
  )
}
