import express from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import db from '../models/database.js'
import { authenticateToken } from '../middleware/auth.js'

const router = express.Router()

// Login
router.post('/login', async (req, res) => {
  const { email, password, rememberMe } = req.body

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' })
  }

  try {
    // Find user
    const user = db.prepare('SELECT * FROM users WHERE email = ? AND is_active = 1').get(email)

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    // Verify password
    const validPassword = await bcrypt.compare(password, user.password_hash)
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    // Update last login
    db.prepare('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?').run(user.id)

    // Generate JWT token
    const expiresIn = rememberMe ? '30d' : '24h'
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn }
    )

    // Return user data (without password hash)
    const { password_hash, ...userData } = user

    res.json({
      token,
      user: userData
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ error: 'An error occurred during login' })
  }
})

// Get current user
router.get('/me', authenticateToken, (req, res) => {
  try {
    const user = db.prepare('SELECT id, email, name, role, avatar_url, created_at FROM users WHERE id = ?').get(req.user.id)

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    res.json(user)
  } catch (error) {
    console.error('Get user error:', error)
    res.status(500).json({ error: 'An error occurred' })
  }
})

// Update profile
router.put('/profile', authenticateToken, async (req, res) => {
  const { name, email } = req.body

  try {
    // Check if email is already taken by another user
    if (email) {
      const existingUser = db.prepare('SELECT id FROM users WHERE email = ? AND id != ?').get(email, req.user.id)
      if (existingUser) {
        return res.status(400).json({ error: 'Email already in use' })
      }
    }

    // Update user
    db.prepare(`
      UPDATE users
      SET name = COALESCE(?, name),
          email = COALESCE(?, email),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(name, email, req.user.id)

    // Get updated user
    const user = db.prepare('SELECT id, email, name, role, avatar_url FROM users WHERE id = ?').get(req.user.id)

    res.json(user)
  } catch (error) {
    console.error('Update profile error:', error)
    res.status(500).json({ error: 'An error occurred' })
  }
})

// Change password
router.post('/password', authenticateToken, async (req, res) => {
  const { currentPassword, newPassword } = req.body

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Current password and new password are required' })
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ error: 'New password must be at least 6 characters' })
  }

  try {
    // Get user
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id)

    // Verify current password
    const validPassword = await bcrypt.compare(currentPassword, user.password_hash)
    if (!validPassword) {
      return res.status(401).json({ error: 'Current password is incorrect' })
    }

    // Hash new password
    const newPasswordHash = await bcrypt.hash(newPassword, 10)

    // Update password
    db.prepare('UPDATE users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
      .run(newPasswordHash, req.user.id)

    res.json({ message: 'Password updated successfully' })
  } catch (error) {
    console.error('Change password error:', error)
    res.status(500).json({ error: 'An error occurred' })
  }
})

// Logout (client-side handles token removal, this is for any server-side cleanup)
router.post('/logout', authenticateToken, (req, res) => {
  // In a more complex system, you might invalidate the token here
  res.json({ message: 'Logged out successfully' })
})

// Forgot password - request reset token
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body

  if (!email) {
    return res.status(400).json({ error: 'Email is required' })
  }

  try {
    // Find user
    const user = db.prepare('SELECT id, email FROM users WHERE email = ? AND is_active = 1').get(email)

    // Always return success to prevent email enumeration
    // But only generate token if user exists
    if (user) {
      // Generate random token
      const resetToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
      const expiresAt = new Date(Date.now() + 3600000).toISOString() // 1 hour from now

      // Store token in database
      db.prepare('UPDATE users SET reset_token = ?, reset_token_expires = ? WHERE id = ?')
        .run(resetToken, expiresAt, user.id)

      // In a real app, send email here
      // For this demo, we'll just log it to console
      console.log('📧 Password reset requested for:', user.email)
      console.log('🔑 Reset token:', resetToken)
      console.log('🔗 Reset link: http://localhost:5173/admin/reset-password?token=' + resetToken)
      console.log('⏰ Expires at:', expiresAt)
    }

    // Always return success message (security best practice)
    res.json({
      message: 'If an account exists with that email, a password reset link has been sent.'
    })
  } catch (error) {
    console.error('Forgot password error:', error)
    res.status(500).json({ error: 'An error occurred' })
  }
})

// Reset password with token
router.post('/reset-password', async (req, res) => {
  const { token, newPassword } = req.body

  if (!token || !newPassword) {
    return res.status(400).json({ error: 'Token and new password are required' })
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' })
  }

  try {
    // Find user with valid token
    const user = db.prepare(`
      SELECT id, email, reset_token, reset_token_expires
      FROM users
      WHERE reset_token = ? AND is_active = 1
    `).get(token)

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired reset token' })
    }

    // Check if token is expired
    const now = new Date()
    const expiresAt = new Date(user.reset_token_expires)
    if (now > expiresAt) {
      return res.status(400).json({ error: 'Reset token has expired' })
    }

    // Hash new password
    const passwordHash = await bcrypt.hash(newPassword, 10)

    // Update password and clear reset token
    db.prepare(`
      UPDATE users
      SET password_hash = ?,
          reset_token = NULL,
          reset_token_expires = NULL,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(passwordHash, user.id)

    console.log('✅ Password reset successful for:', user.email)

    res.json({ message: 'Password has been reset successfully' })
  } catch (error) {
    console.error('Reset password error:', error)
    res.status(500).json({ error: 'An error occurred' })
  }
})

export default router
