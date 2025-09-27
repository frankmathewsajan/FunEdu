# 🎓 FunEdu - Interactive Educational Platform

## 🌟 Features

### 🎯 **Core Functionality**
- **Full-Stack Application** with separate frontend and backend
- **Complete Authentication System** with JWT tokens and refresh tokens
- **Course Management** with lessons, enrollments, and progress tracking
- **Gaming System** with leaderboards and achievements
- **Dashboard Analytics** with user statistics and progress visualization
- **RESTful API** with comprehensive endpoints

### 🔐 **Authentication & Security**
- **JWT Authentication** with access and refresh tokens
- **Password Hashing** using bcrypt
- **Email Verification** system
- **Password Reset** functionality
- **Role-based Access Control** (Student, Teacher, Admin)
- **Security Middleware** (Helmet, Rate Limiting, CORS)

### 📚 **Educational Features**
- **Course Management** with categories and difficulty levels
- **Lesson System** with video content and attachments
- **Progress Tracking** with completion percentages
- **Points & Achievements** system
- **Gaming Integration** with educational games
- **Activity Logging** for user engagement

### 📊 **Dashboard & Analytics**
- **User Statistics** with levels and streaks
- **Course Progress** visualization
- **Achievement System** with unlockable badges
- **Activity Timeline** with recent actions
- **Leaderboards** for competitive learning

## 🚀 Complete Setup & Workflow Guide

### 📋 Prerequisites & System Requirements

Before you begin, ensure you have the following installed:

#### **Required Software**
- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
  - Includes npm package manager
  - Verify installation: `node --version` && `npm --version`
- **PostgreSQL** (v13 or higher) - [Download here](https://www.postgresql.org/download/)
  - Database server for data storage
  - Remember your postgres user password during installation
- **Git** - [Download here](https://git-scm.com/)
  - Version control system
  - Verify installation: `git --version`

#### **Optional but Recommended**
- **VS Code** - [Download here](https://code.visualstudio.com/)
  - Recommended IDE with TypeScript support
- **pgAdmin** - Usually included with PostgreSQL
  - GUI tool for database management
- **Postman** or **Thunder Client** - For API testing

### 📥 Complete Installation Process

#### **Step 1: Clone & Setup Project**
```bash
# Clone the repository
git clone https://github.com/frankmathewsajan/FunEdu.git
cd FunEdu

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
```

#### **Step 2: Verify Node.js Setup**
```bash
# Check Node.js version (should be 18+)
node --version

# Check npm version
npm --version

# Check if all dependencies installed correctly
npm list --depth=0
```

### 🗄️ Database Setup & Configuration

#### **Step 3: PostgreSQL Database Setup**

##### **Option A: Using pgAdmin (Recommended for beginners)**
1. **Open pgAdmin** (installed with PostgreSQL)
2. **Connect to PostgreSQL server** with your postgres user
3. **Create database**:
   - Right-click "Databases" → "Create" → "Database"
   - Name: `funedu_db`
   - Owner: `postgres`
   - Click "Save"

##### **Option B: Using Command Line**
```bash
# Connect to PostgreSQL (Windows)
psql -U postgres

# Create database and user
CREATE DATABASE funedu_db;
CREATE USER funedu_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE funedu_db TO funedu_user;
\q
```

##### **Option C: Using Docker (Advanced)**
```bash
# Run PostgreSQL in Docker container
docker run --name funedu-postgres \
  -e POSTGRES_DB=funedu_db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=your_password \
  -p 5432:5432 \
  -d postgres:15
```

#### **Step 4: Environment Configuration**
```bash
# Navigate to backend directory
cd backend

# Copy environment template
cp .env.example .env

# Edit .env file with your settings
```

##### **Complete .env Configuration:**
```env
# ================================
# DATABASE CONFIGURATION
# ================================
DATABase_URL="postgresql://postgres:your_password@localhost:5432/funedu_db"

# ================================
# SERVER CONFIGURATION
# ================================
PORT=5000
NODE_ENV=development

# ================================
# JWT AUTHENTICATION
# ================================
# Generate strong secrets (32+ characters)
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production-2024"
JWT_EXPIRES_IN="7d"
REFRESH_TOKEN_SECRET="your-refresh-token-secret-change-this-2024"
REFRESH_TOKEN_EXPIRES_IN="30d"

# ================================
# EMAIL CONFIGURATION (Optional)
# ================================
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# ================================
# CORS & SECURITY
# ================================
CORS_ORIGIN="http://localhost:5173"
ALLOWED_ORIGINS="http://localhost:5173,http://localhost:3000"
```

#### **Step 5: Database Schema & Sample Data**
```bash
# Generate Prisma client types
npx prisma generate

# Create database tables
npx prisma db push

# Add sample data (courses, games, demo user)
npm run db:seed

# Optional: Open database GUI
npx prisma studio
```

##### **Verify Database Setup:**
```bash
# Test database connection
node -e "const { PrismaClient } = require('@prisma/client'); const prisma = new PrismaClient(); prisma.\$connect().then(() => console.log('✅ Database connected!')).catch(e => console.log('❌ Error:', e.message)).finally(() => process.exit(0))"
```

### 🏃‍♂️ Running the Application

#### **Step 6: Start Development Servers**

##### **Terminal 1: Backend Server**
```bash
# Navigate to backend directory
cd backend

# Start backend development server
npm run dev

# You should see:
# 🚀 Server running on port 5000
# 📍 Environment: development
# 🌐 API URL: http://localhost:5000/api/v1
# Database connected successfully
```

##### **Terminal 2: Frontend Server** (Open new terminal)
```bash
# Navigate to project root
cd FunEdu

# Start frontend development server
npm run dev

# You should see:
# VITE v5.4.2 ready in XXX ms
# ➜ Local: http://localhost:5173/
# ➜ Network: use --host to expose
```

#### **Step 7: Verify Setup**

##### **Test Backend API:**
```bash
# Test API health endpoint
curl http://localhost:5000/api/v1/health

# Expected response:
# {"success":true,"message":"API is running","data":{...}}
```

##### **Access Application:**
- **Frontend UI**: http://localhost:5173
- **Backend API**: http://localhost:5000/api/v1
- **Database GUI**: http://localhost:5555 (if running `npx prisma studio`)
- **API Health**: http://localhost:5000/api/v1/health

##### **Demo Login Credentials:**
- **Email**: demo@funedu.com
- **Password**: Demo123!

### 🔄 Development Workflow

#### **Daily Development Process:**
1. **Start both servers** (backend + frontend)
2. **Make code changes** with hot reload
3. **Test features** using demo account
4. **Check database** changes in Prisma Studio
5. **Commit changes** to Git

#### **Common Development Commands:**
```bash
# Backend commands (from /backend directory)
npm run dev          # Start development server
npm run build        # Build for production
npm run db:studio    # Open database GUI
npm run db:seed      # Reset sample data

# Frontend commands (from root directory)
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Check code quality
```

## 📁 Project Structure

```
FunEdu/
├── backend/                    # Node.js backend application
│   ├── prisma/                 # Database schema and migrations
│   │   ├── schema.prisma       # Database schema definition
│   │   └── seed.ts             # Database seeding script
│   ├── src/                    # Backend source code
│   │   ├── config/             # Configuration files
│   │   │   ├── database.ts     # Prisma client setup
│   │   │   └── index.ts        # App configuration
│   │   ├── controllers/        # Request handlers
│   │   │   ├── auth.controller.ts
│   │   │   ├── course.controller.ts
│   │   │   ├── dashboard.controller.ts
│   │   │   └── game.controller.ts
│   │   ├── middleware/         # Custom middleware
│   │   │   ├── auth.ts         # JWT authentication
│   │   │   ├── security.ts     # Security headers
│   │   │   └── validation.ts   # Request validation
│   │   ├── routes/             # API routes
│   │   │   ├── auth.routes.ts
│   │   │   ├── course.routes.ts
│   │   │   ├── dashboard.routes.ts
│   │   │   ├── game.routes.ts
│   │   │   └── index.ts
│   │   ├── services/           # Business logic
│   │   │   ├── auth.service.ts
│   │   │   ├── course.service.ts
│   │   │   ├── dashboard.service.ts
│   │   │   └── game.service.ts
│   │   ├── types/              # TypeScript type definitions
│   │   │   ├── index.ts        # API types
│   │   │   └── prisma.ts       # Database types
│   │   ├── utils/              # Utility functions
│   │   │   ├── auth.ts         # Auth utilities
│   │   │   ├── helpers.ts      # Response helpers
│   │   │   └── logger.ts       # Winston logger
│   │   ├── app.ts              # Express app configuration
│   │   └── index.ts            # Application entry point
│   ├── .env.example            # Environment variables template
│   ├── package.json            # Backend dependencies
│   └── tsconfig.json           # TypeScript configuration
│
├── auth-frontend/              # Legacy auth components (reference)
├── src/                        # React frontend source code
│   ├── components/             # React components
│   │   ├── auth/               # Authentication components
│   │   ├── dashboard/          # Dashboard components
│   │   ├── layout/             # Layout components
│   │   └── sections/           # Landing page sections
│   ├── contexts/               # React contexts
│   │   └── AuthContext.tsx     # Authentication state
│   ├── App.tsx                 # Main React component
│   └── main.tsx                # React entry point
├── public/                     # Static assets
├── package.json                # Frontend dependencies
├── vite.config.ts              # Vite configuration
└── README.md                   # This file
```

## 🛠️ Complete Technology Stack & Tools

### **🖥️ Backend Technologies**
| Category | Technology | Version | Purpose |
|----------|------------|---------|----------|
| **Runtime** | Node.js | 18+ | JavaScript runtime environment |
| **Language** | TypeScript | 5.5.3 | Type-safe JavaScript development |
| **Framework** | Express.js | 4.19.2 | Web application framework |
| **Database** | PostgreSQL | 15+ | Relational database system |
| **ORM** | Prisma | 5.18.0 | Database toolkit and query builder |
| **Authentication** | JWT + bcryptjs | Latest | Secure token-based auth |
| **Validation** | Joi | 17.13.3 | Schema validation library |
| **Security** | Helmet + CORS | Latest | Security headers and cross-origin |
| **Logging** | Winston | 3.14.2 | Flexible logging library |
| **File Upload** | Multer | Latest | Multipart form data handling |
| **Email** | Nodemailer | 6.9.14 | Email sending capability |
| **Rate Limiting** | express-rate-limit | 7.4.0 | API rate limiting |

### **🎨 Frontend Technologies**
| Category | Technology | Version | Purpose |
|----------|------------|---------|----------|
| **Framework** | React | 18.3.1 | Component-based UI library |
| **Language** | TypeScript | 5.5.3 | Type-safe React development |
| **Build Tool** | Vite | 5.4.2 | Fast build tool and dev server |
| **Styling** | Bootstrap | 5.3.8 | CSS framework and components |
| **CSS Framework** | Tailwind CSS | 3.4.1 | Utility-first CSS framework |
| **Icons** | Lucide React | 0.344.0 | Beautiful SVG icon library |
| **Animations** | Framer Motion | 12.23.12 | Production-ready motion library |
| **Routing** | React Router | 7.9.1 | Client-side routing |
| **State Management** | React Context | Built-in | Global state management |
| **HTTP Client** | Fetch API | Built-in | API communication |

### **🗄️ Database & ORM**
| Component | Technology | Purpose |
|-----------|------------|----------|
| **Database** | PostgreSQL 15+ | Primary data storage |
| **ORM** | Prisma 5.18.0 | Database abstraction layer |
| **Migration Tool** | Prisma Migrate | Database schema versioning |
| **GUI Tool** | Prisma Studio | Database administration |
| **Seed Tool** | Custom TypeScript | Sample data generation |

### **🔧 Development Tools**
| Tool | Purpose | Configuration |
|------|---------|---------------|
| **TypeScript** | Static type checking | `tsconfig.json` |
| **ESLint** | Code linting and formatting | `eslint.config.js` |
| **Prettier** | Code formatting | `.prettierrc` |
| **Nodemon** | Development server auto-reload | `nodemon.json` |
| **Vite** | Frontend build tool | `vite.config.ts` |
| **PostCSS** | CSS processing | `postcss.config.js` |

### **🔐 Security Implementation**
| Security Layer | Implementation | Purpose |
|----------------|----------------|----------|
| **Authentication** | JWT Tokens | Stateless user authentication |
| **Password Security** | bcrypt Hashing | Secure password storage |
| **API Security** | Helmet Headers | Security headers |
| **Cross-Origin** | CORS Policy | Controlled resource sharing |
| **Rate Limiting** | Express Rate Limit | DDoS and abuse protection |
| **Input Validation** | Joi Schemas | Data validation and sanitization |
| **SQL Injection** | Prisma ORM | Parameterized queries |

### **📦 Package Management**
| Manager | Frontend | Backend | Purpose |
|---------|----------|---------|----------|
| **npm** | ✅ | ✅ | Primary package manager |
| **Dependencies** | 15+ packages | 20+ packages | Production dependencies |
| **Dev Dependencies** | 10+ packages | 15+ packages | Development tools |

### **Database Schema**
```sql
-- Main Tables
Users          -- User accounts and profiles
UserStats      -- User progress and statistics
Courses        -- Course catalog
Lessons        -- Individual lessons within courses
Enrollments    -- User course enrollments
Activities     -- User activity tracking
Achievements   -- User achievements and badges
Games          -- Educational games
GameScores     -- Game leaderboards and scores
```

## 🔧 Development Scripts

### Backend Scripts
```bash
cd backend

# Development
npm run dev          # Start development server with nodemon
npm run build        # Compile TypeScript to JavaScript
npm run start        # Run compiled production server

# Database
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema changes to database
npm run db:migrate   # Run database migrations
npm run db:studio    # Open Prisma Studio (database GUI)
npm run db:seed      # Seed database with sample data
```

### Frontend Scripts
```bash
# Development
npm run dev          # Start Vite development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## 🔒 API Endpoints

### Authentication Endpoints
```
POST /api/v1/auth/register      # User registration
POST /api/v1/auth/login         # User login
POST /api/v1/auth/refresh       # Refresh access token
GET  /api/v1/auth/profile       # Get user profile
PUT  /api/v1/auth/profile       # Update user profile
POST /api/v1/auth/logout        # Logout user
```

### Course Management
```
GET    /api/v1/courses          # Get all courses
POST   /api/v1/courses          # Create new course
GET    /api/v1/courses/:id      # Get course details
PUT    /api/v1/courses/:id      # Update course
DELETE /api/v1/courses/:id      # Delete course
POST   /api/v1/courses/:id/enroll # Enroll in course
```

### Dashboard & Analytics
```
GET /api/v1/dashboard           # Get dashboard overview
GET /api/v1/dashboard/stats     # Get user statistics
GET /api/v1/dashboard/activities # Get recent activities
GET /api/v1/dashboard/achievements # Get user achievements
```

### Gaming System
```
GET  /api/v1/games              # Get all games
POST /api/v1/games/:id/play     # Submit game score
GET  /api/v1/games/:id/leaderboard # Get game leaderboard
```

## 🎮 Sample Data

After running `npm run db:seed`, you'll have:

### Demo User Account
- **Email**: demo@funedu.com
- **Password**: Demo123!

### Sample Courses
- Introduction to Mathematics (3 lessons)
- Creative Writing Workshop (3 lessons)
- Basic Science Exploration (4 lessons)

### Sample Games
- Math Quiz Game (Easy)
- Word Puzzle (Medium)
- Science Challenge (Hard)

## 🌐 Production Deployment Guide

### **🚀 Deployment Options**

#### **Backend Deployment Platforms:**
| Platform | Difficulty | Cost | Database | Best For |
|----------|------------|------|----------|----------|
| **Railway** | Easy | Free tier | PostgreSQL included | Beginners |
| **Vercel** | Easy | Free tier | External DB needed | Full-stack |
| **Heroku** | Medium | Paid | PostgreSQL addon | Traditional |
| **DigitalOcean** | Advanced | $5/month | Managed database | Production |
| **AWS/Azure** | Expert | Variable | Cloud database | Enterprise |

#### **Frontend Deployment Platforms:**
| Platform | Difficulty | Cost | Features | Best For |
|----------|------------|------|----------|----------|
| **Netlify** | Easy | Free tier | Auto-deploy from Git | Static sites |
| **Vercel** | Easy | Free tier | Serverless functions | React apps |
| **GitHub Pages** | Easy | Free | Basic hosting | Open source |
| **Cloudflare Pages** | Easy | Free tier | Fast global CDN | Performance |

### **📋 Pre-Deployment Checklist**

#### **Code Preparation:**
- [ ] All TypeScript errors resolved
- [ ] Environment variables configured
- [ ] Database schema finalized
- [ ] API endpoints tested
- [ ] Frontend build successful
- [ ] Security configurations reviewed

#### **Database Preparation:**
- [ ] Production database created
- [ ] Database URL obtained
- [ ] Migration scripts tested
- [ ] Seed data prepared (optional)
- [ ] Backup strategy planned

### **🎯 Recommended Deployment (Railway + Netlify)**

#### **Step 1: Deploy Backend to Railway**
1. **Create Railway account** at [railway.app](https://railway.app)
2. **Connect GitHub repository**
3. **Configure environment variables:**
   ```env
   NODE_ENV=production
   DATABASE_URL=${RAILWAY_POSTGRES_URL}
   JWT_SECRET=your-production-jwt-secret-32-chars-minimum
   REFRESH_TOKEN_SECRET=your-refresh-secret-32-chars-minimum
   PORT=${PORT}
   ```
4. **Deploy automatically** from Git pushes

#### **Step 2: Deploy Frontend to Netlify**
1. **Create Netlify account** at [netlify.com](https://netlify.com)
2. **Connect GitHub repository**
3. **Configure build settings:**
   - Build command: `npm run build`
   - Publish directory: `dist`
4. **Set environment variables:**
   ```env
   VITE_API_URL=https://your-backend.railway.app/api/v1
   ```

### **🔧 Production Environment Setup**

#### **Backend Production .env:**
```env
# ================================
# PRODUCTION CONFIGURATION
# ================================
NODE_ENV=production
PORT=${PORT}

# ================================
# DATABASE (Railway Auto-provides)
# ================================
DATABASE_URL=${DATABASE_URL}

# ================================
# JWT SECRETS (Generate Strong Ones)
# ================================
JWT_SECRET=your-super-secure-production-jwt-secret-must-be-32-chars-minimum
REFRESH_TOKEN_SECRET=your-super-secure-refresh-secret-32-chars-minimum
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d

# ================================
# CORS & SECURITY
# ================================
CORS_ORIGIN=https://your-app.netlify.app
ALLOWED_ORIGINS=https://your-app.netlify.app,https://your-domain.com

# ================================
# EMAIL (Production)
# ================================
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-production-email@gmail.com
SMTP_PASS=your-app-specific-password
```

#### **Security Best Practices:**
- ✅ Use strong JWT secrets (32+ characters)
- ✅ Enable HTTPS only in production
- ✅ Configure proper CORS origins
- ✅ Use environment variables for secrets
- ✅ Enable rate limiting
- ✅ Regular security updates

### **📊 Monitoring & Maintenance**

#### **Application Monitoring:**
- **Logs**: Railway/Heroku built-in logging
- **Uptime**: UptimeRobot or Pingdom
- **Performance**: Railway metrics dashboard
- **Errors**: Application error logging

#### **Database Monitoring:**
- **Connection pooling**: Prisma built-in
- **Query performance**: Prisma metrics
- **Backup**: Platform-managed backups
- **Scaling**: Vertical scaling as needed

## 🧪 Testing the Application

### Manual Testing Checklist
1. **Authentication Flow**
   - [ ] Register new user account
   - [ ] Login with credentials
   - [ ] Access protected dashboard
   - [ ] Logout successfully

2. **Course Management**
   - [ ] Browse available courses
   - [ ] Enroll in a course
   - [ ] View course content
   - [ ] Track progress

3. **Gaming System**
   - [ ] Play educational games
   - [ ] Submit scores
   - [ ] View leaderboards

4. **Dashboard Features**
   - [ ] View user statistics
   - [ ] Check achievements
   - [ ] Review activity history

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes** and commit them
   ```bash
   git commit -m 'Add some amazing feature'
   ```
4. **Push to your branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Development Guidelines
- **Follow TypeScript best practices**
- **Use meaningful variable and function names**
- **Add proper error handling**
- **Write descriptive commit messages**
- **Test your changes thoroughly**
- **Update documentation when needed**

## 🐛 Troubleshooting

### Common Issues

**Database Connection Error**
```bash
Error: Can't reach database server at `localhost:5432`
```
**Solution**: Ensure PostgreSQL is running and credentials are correct in `.env`

**Port Already in Use**
```bash
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution**: Change PORT in `.env` or kill the process using the port

**Prisma Client Generation Issues**
```bash
Error: Cannot find module '@prisma/client'
```
**Solution**: Run `npx prisma generate` in the backend directory

**JWT Secret Error**
```bash
Error: JWT_SECRET must be at least 32 characters long
```
**Solution**: Update JWT_SECRET in `.env` with a longer secret key

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Frank Mathew Sajan**
- GitHub: [@frankmathewsajan](https://github.com/frankmathewsajan)
- Portfolio: [Your Portfolio URL]
- Email: [Your Email]

## 🙏 Acknowledgments

- **React Team** for the amazing framework
- **Node.js Community** for the runtime environment
- **Prisma Team** for the excellent ORM
- **PostgreSQL** for the robust database
- **TypeScript Team** for type safety
- **Express.js** for the web framework

## 📊 Project Statistics

- **Backend**: ~3,000+ lines of TypeScript
- **Frontend**: ~2,500+ lines of React/TypeScript
- **Database Models**: 8 main entities
- **API Endpoints**: 20+ RESTful endpoints
- **Components**: 15+ React components
- **Authentication**: JWT-based with refresh tokens
- **Security**: Multiple middleware layers

---

<div align="center">

**Made with ❤️ for educational excellence**

[⭐ Star this repository](https://github.com/frankmathewsajan/FunEdu) if you found it helpful!

**Happy Learning! 🎓**

</div>
