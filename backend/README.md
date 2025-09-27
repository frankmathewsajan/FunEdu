# FunEdu Backend API

A comprehensive backend API for the FunEdu educational platform built with Node.js, Express, TypeScript, and PostgreSQL.

## 🚀 Features

### Authentication & User Management
- **JWT Authentication** with access and refresh tokens
- **User Registration** with 2-step process
- **Password Security** with bcrypt hashing
- **Profile Management** with customizable user data
- **Password Reset** functionality

### Course Management
- **Course Catalog** with categories and difficulty levels
- **Lesson Structure** with progress tracking
- **Enrollment System** with user progress
- **Interactive Content** support

### Progress Tracking
- **User Statistics** with points and levels
- **Activity Logging** for all user actions
- **Achievement System** with badges and rewards
- **Streak Tracking** for consistent learning

### Games & Gamification
- **Educational Games** with scoring system
- **Leaderboards** and competitions
- **Points & Rewards** system
- **Achievement Unlocks**

## 🛠️ Technology Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT
- **Security**: Helmet, CORS, Rate Limiting
- **Logging**: Winston
- **Validation**: Joi

## 📋 Prerequisites

- Node.js 18 or higher
- PostgreSQL 13 or higher
- npm or yarn package manager

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/frankmathewsajan/FunEdu.git
cd FunEdu/backend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Setup
```bash
# Copy environment file
cp .env.example .env

# Edit .env with your configuration
# Set your database URL, JWT secrets, etc.
```

### 4. Database Setup
```bash
# Generate Prisma client
npm run db:generate

# Push database schema
npm run db:push

# Seed the database with sample data
npm run db:seed
```

### 5. Start Development Server
```bash
npm run dev
```

The API will be available at `http://localhost:5000`

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api/v1
```

### Authentication Endpoints

| Method | Endpoint | Description | Body |
|--------|----------|-------------|------|
| POST | `/auth/register` | Register new user | `{ email, password, name, class?, contact?, organization? }` |
| POST | `/auth/login` | User login | `{ email, password }` |
| GET | `/auth/profile` | Get user profile | - |
| PUT | `/auth/profile` | Update profile | `{ name?, class?, contact?, organization? }` |
| PUT | `/auth/change-password` | Change password | `{ currentPassword, newPassword }` |
| POST | `/auth/forgot-password` | Request password reset | `{ email }` |
| POST | `/auth/reset-password` | Reset password | `{ token, newPassword }` |
| POST | `/auth/refresh-token` | Refresh access token | `{ refreshToken }` |
| POST | `/auth/logout` | Logout user | - |

### Course Endpoints

| Method | Endpoint | Description | Query Params |
|--------|----------|-------------|--------------|
| GET | `/courses` | Get all courses | `page?, limit?, category?, difficulty?, search?` |
| GET | `/courses/:id` | Get course by ID | - |
| GET | `/courses/categories` | Get course categories | - |
| POST | `/courses/enroll` | Enroll in course | `{ courseId }` |
| GET | `/courses/user/enrollments` | Get user enrollments | `page?, limit?` |
| PUT | `/courses/:courseId/lessons/:lessonId/complete` | Mark lesson complete | - |

### Response Format

All API responses follow this format:

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data
  },
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10
  }
}
```

Error responses:
```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error information"
}
```

## 🗄️ Database Schema

### Users
- Basic user information (email, name, class, contact, organization)
- Authentication data (password, verification tokens)
- Profile settings

### Courses & Lessons
- Course catalog with metadata
- Lesson content and structure
- Progress tracking per user

### User Progress
- Statistics (total lectures, completed, points, level)
- Activity logs
- Achievement tracking

### Games & Scores
- Game definitions
- User scores and records
- Leaderboards

## 🔒 Security Features

- **JWT Authentication** with secure token handling
- **Password Hashing** using bcryptjs
- **Rate Limiting** to prevent abuse
- **CORS Protection** with configured origins
- **Helmet Security Headers**
- **Input Validation** using Joi schemas
- **SQL Injection Protection** via Prisma ORM

## 🧪 Development

### Running Tests
```bash
npm run test
```

### Database Management
```bash
# View database in Prisma Studio
npm run db:studio

# Create new migration
npm run db:migrate

# Reset database
npx prisma migrate reset
```

### Building for Production
```bash
npm run build
npm start
```

## 📝 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment | `development` |
| `DATABASE_URL` | PostgreSQL connection string | Required |
| `JWT_SECRET` | JWT signing secret | Required |
| `JWT_EXPIRES_IN` | JWT token expiry | `7d` |
| `REFRESH_TOKEN_SECRET` | Refresh token secret | Required |
| `REFRESH_TOKEN_EXPIRES_IN` | Refresh token expiry | `30d` |
| `CORS_ORIGIN` | Allowed CORS origins | `http://localhost:5173` |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 🔗 Related Projects

- [FunEdu Frontend](../README.md) - React TypeScript frontend application

## 📞 Support

For support and questions, please open an issue in the GitHub repository.

---

Built with ❤️ for educational excellence