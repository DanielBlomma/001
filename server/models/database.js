import Database from 'better-sqlite3'
import bcrypt from 'bcrypt'

const db = new Database(process.env.DATABASE_PATH || './cms.db')

// Enable foreign keys
db.pragma('foreign_keys = ON')

export function initDatabase() {
  console.log('🗄️  Initializing database...')

  // Users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name TEXT,
      role TEXT DEFAULT 'editor',
      avatar_url TEXT,
      is_active INTEGER DEFAULT 1,
      reset_token TEXT,
      reset_token_expires DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      last_login DATETIME
    )
  `)

  // Pages table
  db.exec(`
    CREATE TABLE IF NOT EXISTS pages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      content TEXT,
      excerpt TEXT,
      featured_image_id INTEGER,
      template TEXT DEFAULT 'standard',
      parent_id INTEGER,
      author_id INTEGER,
      status TEXT DEFAULT 'draft',
      published_at DATETIME,
      scheduled_at DATETIME,
      sort_order INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (featured_image_id) REFERENCES media(id),
      FOREIGN KEY (parent_id) REFERENCES pages(id),
      FOREIGN KEY (author_id) REFERENCES users(id)
    )
  `)

  // Page modules table
  db.exec(`
    CREATE TABLE IF NOT EXISTS page_modules (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      page_id INTEGER NOT NULL,
      module_type TEXT NOT NULL,
      content TEXT,
      settings TEXT,
      sort_order INTEGER DEFAULT 0,
      is_visible INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (page_id) REFERENCES pages(id) ON DELETE CASCADE
    )
  `)

  // Page revisions table
  db.exec(`
    CREATE TABLE IF NOT EXISTS page_revisions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      page_id INTEGER NOT NULL,
      content TEXT,
      modules TEXT,
      author_id INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (page_id) REFERENCES pages(id) ON DELETE CASCADE,
      FOREIGN KEY (author_id) REFERENCES users(id)
    )
  `)

  // Media folders table
  db.exec(`
    CREATE TABLE IF NOT EXISTS media_folders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      parent_id INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (parent_id) REFERENCES media_folders(id)
    )
  `)

  // Media table
  db.exec(`
    CREATE TABLE IF NOT EXISTS media (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      filename TEXT NOT NULL,
      original_filename TEXT,
      mime_type TEXT,
      file_size INTEGER,
      width INTEGER,
      height INTEGER,
      alt_text TEXT,
      caption TEXT,
      folder_id INTEGER,
      uploaded_by INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (folder_id) REFERENCES media_folders(id),
      FOREIGN KEY (uploaded_by) REFERENCES users(id)
    )
  `)

  // Menus table
  db.exec(`
    CREATE TABLE IF NOT EXISTS menus (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      location TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // Menu items table
  db.exec(`
    CREATE TABLE IF NOT EXISTS menu_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      menu_id INTEGER NOT NULL,
      label TEXT NOT NULL,
      url TEXT,
      page_id INTEGER,
      parent_id INTEGER,
      target TEXT DEFAULT '_self',
      sort_order INTEGER DEFAULT 0,
      is_visible INTEGER DEFAULT 1,
      FOREIGN KEY (menu_id) REFERENCES menus(id) ON DELETE CASCADE,
      FOREIGN KEY (page_id) REFERENCES pages(id),
      FOREIGN KEY (parent_id) REFERENCES menu_items(id)
    )
  `)

  // Site settings table
  db.exec(`
    CREATE TABLE IF NOT EXISTS site_settings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      key TEXT UNIQUE NOT NULL,
      value TEXT,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // Contact submissions table
  db.exec(`
    CREATE TABLE IF NOT EXISTS contact_submissions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT,
      subject TEXT,
      message TEXT,
      page_id INTEGER,
      is_read INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (page_id) REFERENCES pages(id)
    )
  `)

  // Seed admin user if no users exist
  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get()
  if (userCount.count === 0) {
    console.log('👤 Creating default admin user...')
    const passwordHash = bcrypt.hashSync('admin123', 10)
    db.prepare(`
      INSERT INTO users (email, password_hash, name, role)
      VALUES (?, ?, ?, ?)
    `).run('admin@example.com', passwordHash, 'Admin User', 'admin')
    console.log('✅ Default admin user created (email: admin@example.com, password: admin123)')
  }

  console.log('✅ Database initialized successfully')
}

export default db
