import bcrypt from 'bcrypt'
import Database from 'better-sqlite3'

const db = new Database('cms.db')

async function createEditor() {
  try {
    // Hash the password
    const password = 'editor123'
    const passwordHash = await bcrypt.hash(password, 10)

    // Insert editor user
    const stmt = db.prepare(`
      INSERT INTO users (email, password_hash, name, role, is_active)
      VALUES (?, ?, ?, ?, ?)
    `)

    const info = stmt.run('editor@example.com', passwordHash, 'Editor User', 'editor', 1)
    console.log('✓ Editor user created successfully')
    console.log('  Email: editor@example.com')
    console.log('  Password: editor123')
    console.log('  Role: editor')
    console.log('  ID:', info.lastInsertRowid)
  } catch (err) {
    if (err.message.includes('UNIQUE constraint failed')) {
      console.log('✓ Editor user already exists')
    } else {
      console.error('Error:', err.message)
    }
  } finally {
    db.close()
  }
}

createEditor()
