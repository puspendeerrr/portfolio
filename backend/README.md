# Code Library Backend API

A secure, production-ready Node.js/Express backend for managing and storing code snippets with JWT authentication.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Environment Setup](#environment-setup)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Error Handling](#error-handling)
- [Security Features](#security-features)
- [Deployment](#deployment)

## ✨ Features

- **Admin Authentication**: Secure JWT-based login system
- **CRUD Operations**: Create, read, update, delete code files
- **Role-Based Access**: Admin-only access to all endpoints
- **Data Validation**: Request validation with express-validator
- **Pagination & Filtering**: Support for pagination, sorting, and filtering by language
- **File Statistics**: Get insights on stored files
- **Error Handling**: Comprehensive error handling with meaningful messages
- **Security**: CORS, helmet, bcryptjs password hashing
- **Scalable**: Proper folder structure for easy expansion

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB + Mongoose ODM
- **Authentication**: JWT (jsonwebtoken)
- **Security**: bcryptjs, helmet, CORS
- **Validation**: express-validator
- **Environment**: dotenv

## 📦 Installation

### Prerequisites

- Node.js (v14+)
- MongoDB (local or cloud like MongoDB Atlas)
- npm or yarn

### Steps

1. **Clone/Navigate to backend**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create .env file**
   ```bash
   cp .env.example .env
   ```

4. **Configure .env**
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/code-library
   JWT_SECRET=your_strong_random_secret_key_here
   JWT_EXPIRE=7d
   ADMIN_PASSWORD=your_secure_password
   PORT=5000
   NODE_ENV=development
   FRONTEND_URL=http://localhost:5173
   ```

5. **Start server**
   ```bash
   # Development (with auto-reload)
   npm run dev

   # Production
   npm start
   ```

   Server will start at `http://localhost:5000`

## 🗂️ Project Structure

```
backend/
├── config/
│   └── database.js          # MongoDB connection
├── controllers/
│   ├── authController.js    # JWT login logic
│   └── filesController.js   # CRUD operations for files
├── middleware/
│   ├── authMiddleware.js    # JWT verification
│   ├── errorHandler.js      # Error handling & async wrapper
│   └── validationHandler.js # Request validation errors
├── models/
│   └── CodeFile.js          # MongoDB schema for code files
├── routes/
│   ├── authRoutes.js        # Authentication endpoints
│   └── filesRoutes.js       # File CRUD endpoints
├── server.js                # Main server file
├── .env.example             # Environment template
├── .gitignore               # Git ignore rules
├── package.json             # Dependencies
└── README.md                # This file
```

### File Descriptions

| File | Purpose |
|------|---------|
| **config/database.js** | Establishes MongoDB connection using Mongoose |
| **controllers/authController.js** | Handles login, token generation, password verification |
| **controllers/filesController.js** | Implements all CRUD operations for code files |
| **middleware/authMiddleware.js** | Validates JWT tokens on protected routes |
| **middleware/errorHandler.js** | Catches and formats errors, async error wrapper |
| **middleware/validationHandler.js** | Handles express-validator validation errors |
| **models/CodeFile.js** | Mongoose schema with validation rules |
| **routes/authRoutes.js** | Defines authentication API routes |
| **routes/filesRoutes.js** | Defines file management API routes |
| **server.js** | Express app setup, middleware configuration, server startup |

## 🔐 API Documentation

### Authentication Endpoints

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "password": "your_password"
}
```

**Response (Success)**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "expiresIn": "7d"
}
```

**Response (Failure)**
```json
{
  "success": false,
  "message": "Invalid password"
}
```

#### Verify Token
```http
GET /api/auth/verify
Authorization: Bearer <token>
```

**Response**
```json
{
  "success": true,
  "message": "Token is valid",
  "user": {
    "id": "admin",
    "role": "admin",
    "email": "admin@portfolio.local"
  }
}
```

---

### File Management Endpoints

All file endpoints require authentication. Include header:
```
Authorization: Bearer <your_jwt_token>
```

#### Create File
```http
POST /api/files
Authorization: Bearer <token>
Content-Type: application/json

{
  "fileName": "App.tsx",
  "folderPath": "src/components/App",
  "language": "typescript",
  "description": "Main App component with routing",
  "codeContent": "import React from 'react'...",
  "tags": ["react", "typescript", "components"]
}
```

**Response**
```json
{
  "success": true,
  "message": "File created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "fileName": "App.tsx",
    "folderPath": "src/components/App",
    "language": "typescript",
    "description": "Main App component with routing",
    "codeContent": "import React from 'react'...",
    "tags": ["react", "typescript", "components"],
    "createdAt": "2024-01-20T10:30:00Z",
    "updatedAt": "2024-01-20T10:30:00Z"
  }
}
```

---

#### Get All Files (with Pagination)
```http
GET /api/files?language=typescript&sortBy=createdAt&order=desc&limit=20&page=1
Authorization: Bearer <token>
```

**Query Parameters**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| language | string | - | Filter by programming language |
| sortBy | string | createdAt | Field to sort by |
| order | string | desc | Sort order (asc/desc) |
| limit | number | 20 | Items per page |
| page | number | 1 | Page number |

**Response**
```json
{
  "success": true,
  "message": "Files retrieved successfully",
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "fileName": "App.tsx",
      "folderPath": "src/components/App",
      "language": "typescript",
      "description": "Main App component",
      "createdAt": "2024-01-20T10:30:00Z",
      "updatedAt": "2024-01-20T10:30:00Z"
    }
  ],
  "pagination": {
    "total": 45,
    "page": 1,
    "limit": 20,
    "pages": 3
  }
}
```

---

#### Get Single File
```http
GET /api/files/:id
Authorization: Bearer <token>
```

**Response**
```json
{
  "success": true,
  "message": "File retrieved successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "fileName": "App.tsx",
    "folderPath": "src/components/App",
    "language": "typescript",
    "description": "Main App component",
    "codeContent": "import React from 'react'...",
    "tags": ["react", "typescript"],
    "createdAt": "2024-01-20T10:30:00Z",
    "updatedAt": "2024-01-20T10:30:00Z"
  }
}
```

---

#### Update File
```http
PUT /api/files/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "description": "Updated description",
  "codeContent": "updated code content...",
  "tags": ["react", "typescript", "updated"]
}
```

**Response**
```json
{
  "success": true,
  "message": "File updated successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "fileName": "App.tsx",
    "folderPath": "src/components/App",
    "language": "typescript",
    "description": "Updated description",
    "codeContent": "updated code content...",
    "tags": ["react", "typescript", "updated"],
    "createdAt": "2024-01-20T10:30:00Z",
    "updatedAt": "2024-01-20T11:45:00Z"
  }
}
```

---

#### Delete File
```http
DELETE /api/files/:id
Authorization: Bearer <token>
```

**Response**
```json
{
  "success": true,
  "message": "File deleted successfully",
  "data": {
    "id": "507f1f77bcf86cd799439011"
  }
}
```

---

#### Get File Statistics
```http
GET /api/files/stats/overview
Authorization: Bearer <token>
```

**Response**
```json
{
  "success": true,
  "message": "Statistics retrieved successfully",
  "data": {
    "totalFiles": 45,
    "byLanguage": [
      { "_id": "typescript", "count": 18 },
      { "_id": "javascript", "count": 12 },
      { "_id": "python", "count": 8 },
      { "_id": "cpp", "count": 7 }
    ],
    "byFolder": [
      { "_id": "src/components", "count": 16 },
      { "_id": "src/utils", "count": 9 },
      { "_id": "src/hooks", "count": 8 }
    ]
  }
}
```

---

## 📊 Database Schema

### CodeFile Model

```javascript
{
  fileName: String,           // Max 100 chars, required
  folderPath: String,         // Max 500 chars, required
  language: String,           // Enum of supported languages
  description: String,        // Max 1000 chars, required
  codeContent: String,        // Max 1MB, required
  tags: [String],            // Optional, max 20 tags
  createdAt: Date,           // Auto-generated
  updatedAt: Date            // Auto-generated
}
```

**Supported Languages:**
- javascript, typescript
- python
- cpp (C++)
- java, csharp (C#)
- php, ruby, go, rust
- sql
- html, css
- json, xml, yaml, markdown

**Indexes:**
- Text index on: fileName, folderPath, description (for search)
- Index on: language
- Index on: createdAt (for sorting)

## ❌ Error Handling

The API returns standardized error responses:

```json
{
  "success": false,
  "message": "Error description",
  "statusCode": 400
}
```

### Common Error Codes

| Code | Message | Cause |
|------|---------|-------|
| 400 | Validation failed | Invalid request data |
| 401 | Invalid password | Wrong password during login |
| 401 | No token provided | Missing Authorization header |
| 401 | Token expired | JWT token has expired |
| 404 | File not found | File ID doesn't exist |
| 500 | Internal Server Error | Server-side error |

## 🔒 Security Features

1. **JWT Authentication**: Secure token-based authentication
2. **Password Hashing**: bcryptjs for password hashing (can be integrated)
3. **CORS**: Restricted to frontend domain
4. **Helmet**: Security headers protection
5. **Input Validation**: express-validator for all inputs
6. **Rate Limiting**: Can be added with express-rate-limit
7. **Error Masking**: Sensitive errors hidden from client

### Best Practices Implemented

- ✅ No sensitive data in logs
- ✅ Proper error handling
- ✅ Request validation
- ✅ Secure headers with helmet
- ✅ Graceful shutdown handling
- ✅ Environment-based configuration

## 🚀 Deployment

### MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster
3. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/code-library`
4. Update `.env` with MONGODB_URI

### Deployment Platforms

**Heroku**
```bash
heroku create your-app-name
heroku config:set JWT_SECRET=your_secret
heroku config:set MONGODB_URI=your_connection_string
git push heroku main
```

**Railway / Render / Vercel**
- Set environment variables in dashboard
- Deploy from git repository

### Environment Variables (Production)

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=generate_strong_random_key_here
JWT_EXPIRE=7d
ADMIN_PASSWORD=secure_password_hash
FRONTEND_URL=https://your-portfolio.com
```

## 📝 Usage Examples

### cURL

**Login**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"password":"your_password"}'
```

**Create File**
```bash
curl -X POST http://localhost:5000/api/files \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "fileName":"App.tsx",
    "folderPath":"src/components",
    "language":"typescript",
    "description":"App component",
    "codeContent":"..."
  }'
```

### Postman

1. Import `API_COLLECTION.json` (if available)
2. Set `{{baseUrl}}` to `http://localhost:5000`
3. Set `{{token}}` from login response
4. Run requests

## 🤝 Contributing

When adding new features:
1. Follow the existing folder structure
2. Add validation for all inputs
3. Use asyncHandler for routes
4. Document changes in README
5. Test with Postman/curl before committing

## 📄 License

MIT - Feel free to use for your portfolio

## 🆘 Troubleshooting

**MongoDB Connection Error**
- Check MONGODB_URI is correct
- Ensure IP is whitelisted in MongoDB Atlas
- Check network connectivity

**JWT Token Errors**
- Verify JWT_SECRET is set
- Check token format: `Bearer <token>`
- Token might be expired

**CORS Errors**
- Update FRONTEND_URL in .env
- Ensure frontend URL matches exactly

**Port Already in Use**
- Change PORT in .env
- Or kill process: `lsof -ti:5000 | xargs kill -9`

---

**Made with ❤️ for your portfolio**
