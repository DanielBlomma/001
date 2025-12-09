import express from 'express'
import db from '../models/database.js'

const router = express.Router()

// Get all published pages
router.get('/pages', (req, res) => {
  try {
    const pages = db.prepare(`
      SELECT
        p.id,
        p.title,
        p.slug,
        p.excerpt,
        p.template,
        p.published_at,
        u.name as author_name
      FROM pages p
      LEFT JOIN users u ON p.author_id = u.id
      WHERE p.status = 'published'
      ORDER BY p.published_at DESC
    `).all()

    res.json(pages)
  } catch (error) {
    console.error('Get public pages error:', error)
    res.status(500).json({ error: 'An error occurred while fetching pages' })
  }
})

// Get single published page by slug
router.get('/pages/:slug', (req, res) => {
  try {
    const page = db.prepare(`
      SELECT
        p.id,
        p.title,
        p.slug,
        p.content,
        p.excerpt,
        p.template,
        p.published_at,
        p.updated_at,
        u.name as author_name,
        u.email as author_email
      FROM pages p
      LEFT JOIN users u ON p.author_id = u.id
      WHERE p.slug = ? AND p.status = 'published'
    `).get(req.params.slug)

    if (!page) {
      return res.status(404).json({ error: 'Page not found' })
    }

    res.json(page)
  } catch (error) {
    console.error('Get public page error:', error)
    res.status(500).json({ error: 'An error occurred while fetching the page' })
  }
})

export default router
