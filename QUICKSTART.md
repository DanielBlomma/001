# Modern CMS - Quick Start Guide

## 🚀 Get Started in 3 Steps

### 1. Initialize Environment
```bash
./init.sh
```

This will:
- Install all frontend dependencies (pnpm)
- Set up backend dependencies
- Create necessary directories
- Initialize database with admin user

### 2. Start Development Servers

**Terminal 1 - Backend:**
```bash
cd server
npm install  # First time only
npm start
```
Backend runs on: http://localhost:3001

**Terminal 2 - Frontend:**
```bash
pnpm install  # First time only
pnpm run dev
```
Frontend runs on: http://localhost:5173

### 3. Access the Application

- **Public Site**: http://localhost:5173
- **Admin Panel**: http://localhost:5173/admin
- **Admin Login**:
  - Email: `admin@example.com`
  - Password: `admin123`

## 📋 What's Included

✅ React + Vite frontend with Tailwind CSS
✅ Express.js backend with SQLite database
✅ JWT authentication system
✅ Admin panel with sidebar navigation
✅ Public website with modern design
✅ Database schema with all tables
✅ 200+ test cases in feature_list.json

## 🛠️ Development Workflow

1. Check `feature_list.json` for next features to implement
2. Work on one feature at a time
3. Test thoroughly
4. Mark feature as `"passes": true` when complete
5. Commit with descriptive message
6. Continue to next feature

## 📁 Project Structure

```
modern-cms/
├── src/              # Frontend React code
├── server/           # Backend Express API
├── uploads/          # Media file storage
├── feature_list.json # 200 test cases
├── init.sh          # Setup script
└── .env             # Configuration
```

## 🎯 Current Status

- **Foundation**: ✅ Complete
- **Features Passing**: 0/200
- **Next Priority**: Authentication integration

## 📚 Documentation

- Full specification: `app_spec.txt`
- Progress tracking: `claude-progress.txt`
- Complete README: `README.md`

## ⚡ Quick Commands

```bash
# Frontend
pnpm run dev      # Start dev server
pnpm run build    # Build for production
pnpm run lint     # Check code quality

# Backend
npm start         # Start server
npm run dev       # Start with auto-reload

# Git
git log --oneline # View commit history
git status        # Check current changes
```

## 🔑 Environment Variables

Edit `.env` to configure:
- `JWT_SECRET` - Authentication secret (change in production!)
- `FRONTEND_PORT` - Frontend port (default: 5173)
- `BACKEND_PORT` - Backend port (default: 3001)
- `DATABASE_PATH` - SQLite database location

## 🎨 Design System

The project uses Tailwind CSS with a custom design system:
- Primary color: Blue (`hsl(221.2 83.2% 53.3%)`)
- Components from shadcn/ui
- Responsive breakpoints: sm, md, lg, xl, 2xl
- Dark mode support ready

## 🔒 Security

- Passwords hashed with bcrypt
- JWT tokens for authentication
- Role-based access control
- SQL injection protection
- XSS protection ready

## 📞 Need Help?

- Check `app_spec.txt` for detailed requirements
- Review `feature_list.json` for test cases
- See `claude-progress.txt` for session history

---

**Ready to Code!** 🎉

Start with: `./init.sh`
