import express from 'express'
import bcrypt from 'bcrypt'
import db from '../models/database.js'
import { authenticateToken, requireRole } from '../middleware/auth.js'

const router = express.Router()

// All user routes require authentication
router.use(authenticateToken)

// GET /api/users - List all users (admin only)
router.get('/', requireRole('admin'), (req, res) => {
  try {
    const users = db.prepare(`
      SELECT
        id,
        email,
        name,
        role,
        avatar_url,
        is_active,
        created_at,
        updated_at,
        last_login
      FROM users
      ORDER BY created_at DESC
    `).all()

    res.json(users)
  } catch (error) {
    console.error('Error fetching users:', error)
    res.status(500).json({ error: 'Failed to fetch users' })
  }
})

// GET /api/users/:id - Get single user (admin only)
router.get('/:id', requireRole('admin'), (req, res) => {
  try {
    const user = db.prepare(`
      SELECT
        id,
        email,
        name,
        role,
        avatar_url,
        is_active,
        created_at,
        updated_at,
        last_login
      FROM users
      WHERE id = ?
    `).get(req.params.id)

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    res.json(user)
  } catch (error) {
    console.error('Error fetching user:', error)
    res.status(500).json({ error: 'Failed to fetch user' })
  }
})

// POST /api/users - Create new user (admin only)
router.post('/', requireRole('admin'), async (req, res) => {
  try {
    const { email, password, name, role = 'editor' } = req.body

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }

    // Check if email already exists
    const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(email)
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' })
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10)

    // Insert user
    const result = db.prepare(`
      INSERT INTO users (email, password_hash, name, role)
      VALUES (?, ?, ?, ?)
    `).run(email, passwordHash, name, role)

    // Get the created user
    const newUser = db.prepare(`
      SELECT id, email, name, role, is_active, created_at
      FROM users
      WHERE id = ?
    `).get(result.lastInsertRowid)

    res.status(201).json(newUser)
  } catch (error) {
    console.error('Error creating user:', error)
    res.status(500).json({ error: 'Failed to create user' })
  }
})

// PUT /api/users/:id - Update user (admin only)
router.put('/:id', requireRole('admin'), async (req, res) => {
  try {
    const { email, name, role, is_active } = req.body

    // Check if user exists
    const user = db.prepare('SELECT id FROM users WHERE id = ?').get(req.params.id)
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    // Build update query dynamically
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
    values.push(req.params.id)

    db.prepare(`
      UPDATE users
      SET ${updates.join(', ')}
      WHERE id = ?
    `).run(...values)

    // Get updated user
    const updatedUser = db.prepare(`
      SELECT id, email, name, role, is_active, created_at, updated_at
      FROM users
      WHERE id = ?
    `).get(req.params.id)

    res.json(updatedUser)
  } catch (error) {
    console.error('Error updating user:', error)
    res.status(500).json({ error: 'Failed to update user' })
  }
})

// DELETE /api/users/:id - Deactivate user (admin only)
router.delete('/:id', requireRole('admin'), (req, res) => {
  try {
    const userId = parseInt(req.params.id)

    // Prevent deleting yourself
    if (userId === req.user.id) {
      return res.status(400).json({ error: 'Cannot delete your own account' })
    }

    // Check if user exists
    const user = db.prepare('SELECT id FROM users WHERE id = ?').get(userId)
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    // Deactivate instead of delete (soft delete)
    db.prepare(`
      UPDATE users
      SET is_active = 0, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(userId)

    res.json({ message: 'User deactivated successfully' })
  } catch (error) {
    console.error('Error deactivating user:', error)
    res.status(500).json({ error: 'Failed to deactivate user' })
  }
})

export default router
