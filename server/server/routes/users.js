import express from 'express'
import bcrypt from 'bcrypt'
import db from '../models/database.js'
import { authenticateToken, requireRole } from '../middleware/auth.js'

const router = express.Router()

// All routes require authentication
router.use(authenticateToken)

// GET /api/users - List all users (admin only)
router.get('/', requireRole('admin'), (req, res) => {
  try {
    const users = db.prepare(`
      SELECT id, email, name, role, avatar_url, is_active, created_at, updated_at, last_login
      FROM users
      ORDER BY created_at DESC
    `).all()

    res.json(users)
  } catch (err) {
    console.error('Error fetching users:', err)
    res.status(500).json({ error: 'Failed to fetch users' })
  }
})

// GET /api/users/:id - Get single user (admin only)
router.get('/:id', requireRole('admin'), (req, res) => {
  const { id } = req.params

  try {
    const user = db.prepare(`
      SELECT id, email, name, role, avatar_url, is_active, created_at, updated_at, last_login
      FROM users
      WHERE id = ?
    `).get(id)

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    res.json(user)
  } catch (err) {
    console.error('Error fetching user:', err)
    res.status(500).json({ error: 'Failed to fetch user' })
  }
})

// POST /api/users - Create new user (admin only)
router.post('/', requireRole('admin'), async (req, res) => {
  const { email, password, name, role } = req.body

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' })
  }

  if (!['admin', 'editor', 'viewer'].includes(role)) {
    return res.status(400).json({ error: 'Invalid role. Must be admin, editor, or viewer' })
  }

  try {
    // Check if user already exists
    const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(email)
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' })
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10)

    // Insert user
    const stmt = db.prepare(`
      INSERT INTO users (email, password_hash, name, role, is_active)
      VALUES (?, ?, ?, ?, 1)
    `)
    const result = stmt.run(email, passwordHash, name || null, role)

    // Get created user
    const newUser = db.prepare(`
      SELECT id, email, name, role, avatar_url, is_active, created_at, updated_at
      FROM users
      WHERE id = ?
    `).get(result.lastInsertRowid)

    res.status(201).json(newUser)
  } catch (err) {
    console.error('Error creating user:', err)
    res.status(500).json({ error: 'Failed to create user' })
  }
})

// PUT /api/users/:id - Update user (admin only)
router.put('/:id', requireRole('admin'), async (req, res) => {
  const { id } = req.params
  const { email, name, role, is_active } = req.body

  try {
    // Check if user exists
    const user = db.prepare('SELECT id FROM users WHERE id = ?').get(id)
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    if (role && !['admin', 'editor', 'viewer'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role. Must be admin, editor, or viewer' })
    }

    // Build dynamic update query
    const updates = []
    const values = []

    if (email !== undefined) {
      updates.push('email = ?')
      values.push(email)
    }
    if (name !== undefined) {
      updates.push('name = ?')
      values.push(name)
    }
    if (role !== undefined) {
      updates.push('role = ?')
      values.push(role)
    }
    if (is_active !== undefined) {
      updates.push('is_active = ?')
      values.push(is_active ? 1 : 0)
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' })
    }

    updates.push('updated_at = CURRENT_TIMESTAMP')
    values.push(id)

    const stmt = db.prepare(`
      UPDATE users
      SET ${updates.join(', ')}
      WHERE id = ?
    `)
    stmt.run(...values)

    // Get updated user
    const updatedUser = db.prepare(`
      SELECT id, email, name, role, avatar_url, is_active, created_at, updated_at
      FROM users
      WHERE id = ?
    `).get(id)

    res.json(updatedUser)
  } catch (err) {
    console.error('Error updating user:', err)
    res.status(500).json({ error: 'Failed to update user' })
  }
})

// DELETE /api/users/:id - Deactivate user (admin only)
router.delete('/:id', requireRole('admin'), (req, res) => {
  const { id } = req.params

  try {
    // Check if user exists
    const user = db.prepare('SELECT id FROM users WHERE id = ?').get(id)
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    // Prevent deleting yourself
    if (parseInt(id) === req.user.id) {
      return res.status(400).json({ error: 'Cannot deactivate yourself' })
    }

    // Deactivate user (soft delete)
    db.prepare('UPDATE users SET is_active = 0, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(id)

    res.json({ message: 'User deactivated successfully' })
  } catch (err) {
    console.error('Error deactivating user:', err)
    res.status(500).json({ error: 'Failed to deactivate user' })
  }
})

export default router
