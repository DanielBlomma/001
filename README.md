# Modern Content Management System

A fully functional, modular Content Management System (CMS) with a beautiful, modern frontend and a secure admin interface.

## Features

- 🔐 **Secure Authentication** - JWT-based authentication with role-based access control
- 📝 **Rich Content Editor** - TipTap/Slate editor with full formatting capabilities
- 🎨 **Modular Components** - Reusable content blocks (Hero, Gallery, CTA, FAQ, etc.)
- 🖼️ **Media Library** - Complete media management with upload, organization, and optimization
- 📱 **Responsive Design** - Mobile-first design that works on all devices
- 🔍 **SEO Management** - Built-in SEO tools with meta tags, Open Graph, and sitemap generation
- 📋 **Draft/Publish Workflow** - Save drafts, schedule publishing, preview before going live
- 📜 **Revision History** - Track all changes with ability to restore previous versions
- 🎯 **Navigation Builder** - Drag-and-drop menu creation with nested items
- 👥 **User Management** - Multiple user roles (Admin, Editor, Viewer)
- 📊 **Dashboard Analytics** - Overview of content statistics and recent activity
- 🎨 **Modern UI/UX** - Built with Tailwind CSS and shadcn/ui components

## Technology Stack

### Frontend
- **Framework**: React with Vite
- **Styling**: Tailwind CSS + shadcn/ui components
- **Icons**: Lucide React
- **Routing**: React Router
- **Forms**: React Hook Form + Zod validation
- **Rich Text**: TipTap or Slate editor

### Backend
- **Runtime**: Node.js + Express
- **Database**: SQLite with better-sqlite3
- **Authentication**: JWT + bcrypt
- **File Upload**: Multer
- **Image Processing**: Sharp

## Quick Start

### Prerequisites

- Node.js 18 or higher
- npm or pnpm

### Installation

1. Clone the repository
2. Run the initialization script:
   ```bash
   ./init.sh
   ```

3. Start the backend server (in one terminal):
   ```bash
   cd server
   npm start
   ```

4. Start the frontend dev server (in another terminal):
   ```bash
   pnpm run dev
   ```

5. Access the application:
   - **Public Site**: http://localhost:5173
   - **Admin Panel**: http://localhost:5173/admin

### Default Admin Credentials

- **Email**: admin@example.com
- **Password**: admin123

⚠️ **Important**: Change the default admin password after first login!

## Project Structure

```
.
├── src/                    # Frontend source code
│   ├── components/         # React components
│   ├── pages/             # Page components
│   ├── lib/               # Utility functions
│   └── styles/            # CSS files
├── server/                # Backend source code
│   ├── routes/            # API routes
│   ├── models/            # Database models
│   ├── middleware/        # Express middleware
│   └── utils/             # Helper functions
├── uploads/               # Media file storage
├── feature_list.json      # Test cases and progress tracking
├── init.sh               # Environment setup script
└── README.md             # This file
```

## Development

### Testing Progress

The project includes a comprehensive test suite defined in `feature_list.json` with 200+ test cases covering:
- Functional requirements
- UI/UX styling
- Security features
- Performance criteria

### Database Schema

The application uses SQLite with the following main tables:
- `users` - User accounts and authentication
- `pages` - Page content and metadata
- `page_modules` - Modular content blocks
- `page_revisions` - Version history
- `media` - Uploaded files and images
- `media_folders` - Media organization
- `menus` - Navigation menus
- `menu_items` - Menu structure
- `site_settings` - Global site configuration
- `contact_submissions` - Contact form submissions

### API Endpoints

See `app_spec.txt` for complete API documentation. Main endpoints include:

- `/api/auth/*` - Authentication
- `/api/pages/*` - Page management
- `/api/media/*` - Media library
- `/api/menus/*` - Navigation menus
- `/api/users/*` - User management
- `/api/settings/*` - Site settings
- `/api/public/*` - Public-facing API

## Configuration

Edit `.env` file to configure:
- `JWT_SECRET` - Secret key for JWT tokens (required)
- `BACKEND_PORT` - Backend server port (default: 3001)
- `FRONTEND_PORT` - Frontend dev server port (default: 5173)
- `DATABASE_PATH` - SQLite database location
- `UPLOAD_DIR` - Media file storage location
- `SMTP_*` - Email configuration (optional)

## Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- Role-based access control
- SQL injection protection
- XSS protection
- CSRF protection
- Secure file upload validation

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

This is an autonomous coding project. All development is tracked through the feature list and git commits.

## License

[Add your license here]

## Support

For issues and questions, refer to the project specification in `app_spec.txt`.
