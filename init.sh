#!/bin/bash

# Modern Content Management System - Initialization Script
# This script sets up and runs the development environment

set -e  # Exit on error

echo "================================================"
echo "🚀 Modern CMS - Environment Initialization"
echo "================================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${YELLOW}⚠️  Node.js is not installed. Please install Node.js 18+ first.${NC}"
    exit 1
fi

echo -e "${BLUE}📦 Node.js version: $(node --version)${NC}"
echo ""

# Check if pnpm is installed, install if not
if ! command -v pnpm &> /dev/null; then
    echo -e "${YELLOW}📦 pnpm not found. Installing pnpm...${NC}"
    npm install -g pnpm
    echo -e "${GREEN}✓ pnpm installed${NC}"
else
    echo -e "${GREEN}✓ pnpm found: $(pnpm --version)${NC}"
fi
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  Creating .env file with default configuration...${NC}"
    cat > .env << EOF
# JWT Secret (CHANGE THIS IN PRODUCTION!)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Server Configuration
BACKEND_PORT=3001
FRONTEND_PORT=5173

# Database
DATABASE_PATH=./cms.db

# File Upload
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760

# Email Configuration (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=

# Environment
NODE_ENV=development
EOF
    echo -e "${GREEN}✓ .env file created${NC}"
    echo -e "${YELLOW}⚠️  Please update JWT_SECRET in .env file for production!${NC}"
else
    echo -e "${GREEN}✓ .env file exists${NC}"
fi
echo ""

# Source .env to get ports
export $(grep -v '^#' .env | xargs)

# Install frontend dependencies
echo -e "${BLUE}📦 Installing frontend dependencies...${NC}"
if [ ! -d "node_modules" ]; then
    pnpm install
    echo -e "${GREEN}✓ Frontend dependencies installed${NC}"
else
    echo -e "${GREEN}✓ Frontend dependencies already installed${NC}"
fi
echo ""

# Create server directory if it doesn't exist
if [ ! -d "server" ]; then
    echo -e "${BLUE}📁 Creating server directory...${NC}"
    mkdir -p server
    echo -e "${GREEN}✓ Server directory created${NC}"
fi

# Install backend dependencies
echo -e "${BLUE}📦 Installing backend dependencies...${NC}"
if [ ! -f "server/package.json" ]; then
    echo -e "${YELLOW}⚠️  Backend not yet set up. Will need to install:${NC}"
    echo "   - express"
    echo "   - better-sqlite3"
    echo "   - bcrypt"
    echo "   - jsonwebtoken"
    echo "   - multer"
    echo "   - sharp"
    echo "   - cors"
    echo "   - dotenv"
else
    cd server
    if [ ! -d "node_modules" ]; then
        npm install
        echo -e "${GREEN}✓ Backend dependencies installed${NC}"
    else
        echo -e "${GREEN}✓ Backend dependencies already installed${NC}"
    fi
    cd ..
fi
echo ""

# Create uploads directory if it doesn't exist
if [ ! -d "uploads" ]; then
    echo -e "${BLUE}📁 Creating uploads directory...${NC}"
    mkdir -p uploads
    echo -e "${GREEN}✓ Uploads directory created${NC}"
else
    echo -e "${GREEN}✓ Uploads directory exists${NC}"
fi
echo ""

# Database initialization info
if [ ! -f "cms.db" ]; then
    echo -e "${YELLOW}ℹ️  Database will be initialized on first server start${NC}"
else
    echo -e "${GREEN}✓ Database exists${NC}"
fi
echo ""

echo "================================================"
echo -e "${GREEN}✅ Environment Setup Complete!${NC}"
echo "================================================"
echo ""
echo -e "${BLUE}🎯 Next Steps:${NC}"
echo ""
echo "1. Start the backend server (in one terminal):"
echo -e "   ${YELLOW}cd server && npm start${NC}"
echo ""
echo "2. Start the frontend dev server (in another terminal):"
echo -e "   ${YELLOW}pnpm run dev${NC}"
echo ""
echo "3. Access the application:"
echo -e "   ${GREEN}Public Site:${NC} http://localhost:${FRONTEND_PORT}"
echo -e "   ${GREEN}Admin Panel:${NC} http://localhost:${FRONTEND_PORT}/admin"
echo ""
echo -e "${BLUE}📚 Default Admin Credentials (will be created on first run):${NC}"
echo "   Email: admin@example.com"
echo "   Password: admin123"
echo ""
echo -e "${YELLOW}⚠️  Remember to change the default admin password after first login!${NC}"
echo ""
echo "================================================"
echo -e "${GREEN}🚀 Happy Coding!${NC}"
echo "================================================"
