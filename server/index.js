import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { initDatabase } from './models/database.js'
import authRoutes from './routes/auth.js'
import pagesRoutes from './routes/pages.js'
import usersRoutes from './routes/users.js'

// Load environment variables
dotenv.config()

const app = express()
const PORT = process.env.BACKEND_PORT || 3001

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Serve uploaded files
app.use('/uploads', express.static('uploads'))

// Initialize database
initDatabase()

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/pages', pagesRoutes)
app.use('/api/users', usersRoutes)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Modern CMS API is running' })
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Something went wrong!' })
})

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`)
})
