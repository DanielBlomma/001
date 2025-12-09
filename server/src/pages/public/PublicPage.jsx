import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

export default function PublicPage() {
  const { slug } = useParams()
  const [page, setPage] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchPage = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(`http://localhost:3001/api/public/pages/${slug}`)

        if (!response.ok) {
          if (response.status === 404) {
            setError('Page not found')
          } else {
            setError('Failed to load page')
          }
          setLoading(false)
          return
        }

        const data = await response.json()
        setPage(data)
      } catch (err) {
        console.error('Error fetching page:', err)
        setError('Failed to load page')
      } finally {
        setLoading(false)
      }
    }

    if (slug) {
      fetchPage()
    }
  }, [slug])

  if (loading) {
    return (
      <div className="container mx-auto py-12 text-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto py-12 text-center">
        <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
        <p className="text-muted-foreground">{error}</p>
      </div>
    )
  }

  if (!page) {
    return null
  }

  return (
    <div className="container mx-auto py-12">
      <article className="max-w-4xl mx-auto">
        {/* Page Header */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{page.title}</h1>

          {page.excerpt && (
            <p className="text-xl text-muted-foreground mb-4">{page.excerpt}</p>
          )}

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            {page.author_name && (
              <span>By {page.author_name}</span>
            )}
            {page.published_at && (
              <span>
                Published on {new Date(page.published_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            )}
          </div>
        </header>

        {/* Page Content */}
        <div
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: page.content }}
        />
      </article>
    </div>
  )
}
