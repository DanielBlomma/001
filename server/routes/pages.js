import express from 'express'
import db from '../models/database.js'
import { authenticateToken } from '../middleware/auth.js'

const router = express.Router()

// Get all pages (with optional filters)
router.get('/', authenticateToken, (req, res) => {
  try {
    const { status, template, search } = req.query

    let query = `
      SELECT
        p.*,
        u.name as author_name,
        u.email as author_email
      FROM pages p
      LEFT JOIN users u ON p.author_id = u.id
      WHERE 1=1
    `
    const params = []

    // Filter by status
    if (status) {
      query += ' AND p.status = ?'
      params.push(status)
    }

    // Filter by template
    if (template) {
      query += ' AND p.template = ?'
      params.push(template)
    }

    // Search by title or slug
    if (search) {
      query += ' AND (p.title LIKE ? OR p.slug LIKE ?)'
      params.push(`%${search}%`, `%${search}%`)
    }

    query += ' ORDER BY p.updated_at DESC'

    const pages = db.prepare(query).all(...params)

    res.json(pages)
  } catch (error) {
    console.error('Get pages error:', error)
    res.status(500).json({ error: 'An error occurred while fetching pages' })
  }
})

// Get single page by ID
router.get('/:id', authenticateToken, (req, res) => {
  try {
    const page = db.prepare(`
      SELECT
        p.*,
        u.name as author_name,
        u.email as author_email
      FROM pages p
      LEFT JOIN users u ON p.author_id = u.id
      WHERE p.id = ?
    `).get(req.params.id)

    if (!page) {
      return res.status(404).json({ error: 'Page not found' })
    }

    res.json(page)
  } catch (error) {
    console.error('Get page error:', error)
    res.status(500).json({ error: 'An error occurred while fetching the page' })
  }
})

// Create new page
router.post('/', authenticateToken, (req, res) => {
  const { title, slug, content, excerpt, template, status, parent_id } = req.body

  if (!title) {
    return res.status(400).json({ error: 'Title is required' })
  }

  try {
    // Generate slug from title if not provided
    let pageSlug = slug
    if (!pageSlug) {
      pageSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
    }

    // Check if slug already exists
    const existingPage = db.prepare('SELECT id FROM pages WHERE slug = ?').get(pageSlug)
    if (existingPage) {
      return res.status(400).json({ error: 'A page with this slug already exists' })
    }

    // Insert page
    const result = db.prepare(`
      INSERT INTO pages (
        title, slug, content, excerpt, template, status, parent_id, author_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      title,
      pageSlug,
      content || '',
      excerpt || '',
      template || 'standard',
      status || 'draft',
      parent_id || null,
      req.user.id
    )

    // Get the created page
    const page = db.prepare(`
      SELECT
        p.*,
        u.name as author_name,
        u.email as author_email
      FROM pages p
      LEFT JOIN users u ON p.author_id = u.id
      WHERE p.id = ?
    `).get(result.lastInsertRowid)

    res.status(201).json(page)
  } catch (error) {
    console.error('Create page error:', error)
    res.status(500).json({ error: 'An error occurred while creating the page' })
  }
})

// Update page
router.put('/:id', authenticateToken, (req, res) => {
  const { title, slug, content, excerpt, template, status, parent_id, featured_image_id } = req.body

  try {
    // Check if page exists
    const existingPage = db.prepare('SELECT * FROM pages WHERE id = ?').get(req.params.id)
    if (!existingPage) {
      return res.status(404).json({ error: 'Page not found' })
    }

    // Check if slug is being changed and if it's already taken
    if (slug && slug !== existingPage.slug) {
      const slugTaken = db.prepare('SELECT id FROM pages WHERE slug = ? AND id != ?').get(slug, req.params.id)
      if (slugTaken) {
        return res.status(400).json({ error: 'A page with this slug already exists' })
      }
    }

    // Update page
    db.prepare(`
      UPDATE pages
      SET title = COALESCE(?, title),
          slug = COALESCE(?, slug),
          content = COALESCE(?, content),
          excerpt = COALESCE(?, excerpt),
          template = COALESCE(?, template),
          status = COALESCE(?, status),
          parent_id = ?,
          featured_image_id = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(
      title,
      slug,
      content,
      excerpt,
      template,
      status,
      parent_id,
      featured_image_id,
      req.params.id
    )

    // Get updated page
    const page = db.prepare(`
      SELECT
        p.*,
        u.name as author_name,
        u.email as author_email
      FROM pages p
      LEFT JOIN users u ON p.author_id = u.id
      WHERE p.id = ?
    `).get(req.params.id)

    res.json(page)
  } catch (error) {
    console.error('Update page error:', error)
    res.status(500).json({ error: 'An error occurred while updating the page' })
  }
})

// Delete page
router.delete('/:id', authenticateToken, (req, res) => {
  try {
    const page = db.prepare('SELECT * FROM pages WHERE id = ?').get(req.params.id)

    if (!page) {
      return res.status(404).json({ error: 'Page not found' })
    }

    db.prepare('DELETE FROM pages WHERE id = ?').run(req.params.id)

    res.json({ message: 'Page deleted successfully' })
  } catch (error) {
    console.error('Delete page error:', error)
    res.status(500).json({ error: 'An error occurred while deleting the page' })
  }
})

// Publish page
router.put('/:id/publish', authenticateToken, (req, res) => {
  try {
    const page = db.prepare('SELECT * FROM pages WHERE id = ?').get(req.params.id)

    if (!page) {
      return res.status(404).json({ error: 'Page not found' })
    }

    db.prepare(`
      UPDATE pages
      SET status = 'published',
          published_at = COALESCE(published_at, CURRENT_TIMESTAMP),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(req.params.id)

    const updatedPage = db.prepare(`
      SELECT
        p.*,
        u.name as author_name,
        u.email as author_email
      FROM pages p
      LEFT JOIN users u ON p.author_id = u.id
      WHERE p.id = ?
    `).get(req.params.id)

    res.json(updatedPage)
  } catch (error) {
    console.error('Publish page error:', error)
    res.status(500).json({ error: 'An error occurred while publishing the page' })
  }
})

// Unpublish page
router.put('/:id/unpublish', authenticateToken, (req, res) => {
  try {
    const page = db.prepare('SELECT * FROM pages WHERE id = ?').get(req.params.id)

    if (!page) {
      return res.status(404).json({ error: 'Page not found' })
    }

    db.prepare(`
      UPDATE pages
      SET status = 'draft',
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(req.params.id)

    const updatedPage = db.prepare(`
      SELECT
        p.*,
        u.name as author_name,
        u.email as author_email
      FROM pages p
      LEFT JOIN users u ON p.author_id = u.id
      WHERE p.id = ?
    `).get(req.params.id)

    res.json(updatedPage)
  } catch (error) {
    console.error('Unpublish page error:', error)
    res.status(500).json({ error: 'An error occurred while unpublishing the page' })
  }
})

export default router
