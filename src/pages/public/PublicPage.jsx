import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

export default function PublicPage() {
  const { slug } = useParams()
  const [page, setPage] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchPage()
  }, [slug])

  async function fetchPage() {
    try {
      const response = await fetch(`http://localhost:3001/api/public/pages/${slug}`)

      if (response.ok) {
        const data = await response.json()
        setPage(data)
      } else {
        setError('Page not found')
      }
    } catch (error) {
      console.error('Error fetching page:', error)
      setError('Failed to load page')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">Loading...</div>
      </div>
    )
  }

  if (error || !page) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <article className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">{page.title}</h1>
        {page.excerpt && (
          <p className="text-xl text-gray-600 mb-8">{page.excerpt}</p>
        )}
        <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: page.content }} />
      </article>
    </div>
  )
}
