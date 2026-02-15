# 🚀 Quick Start Guide - Code Library Backend

Get up and running with the Code Library Backend in 5 minutes.

## Prerequisites

- Node.js 14+
- MongoDB (MongoDB Atlas free tier works great)
- npm or yarn

## Step 1: Clone & Navigate

```bash
cd backend
```

## Step 2: Install Dependencies

```bash
npm install
```

**What gets installed:**
- `express`: Web framework
- `mongoose`: MongoDB ODM
- `jsonwebtoken`: JWT authentication
- `bcryptjs`: Password hashing
- `cors`: Cross-origin requests
- `helmet`: Security headers
- `express-validator`: Request validation
- `dotenv`: Environment variables
- `nodemon`: Auto-reload (dev only)

## Step 3: Setup MongoDB

### Option A: MongoDB Atlas (Cloud - Recommended)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create a cluster
4. In "Database Access" → Add user with password
5. In "Network Access" → Add your IP (or 0.0.0.0 for all)
6. Click "Connect" → Get connection string
7. Replace username and password in connection string

Connection string format:
```
mongodb+srv://username:password@cluster.mongodb.net/code-library?retryWrites=true&w=majority
```

### Option B: Local MongoDB

```bash
# On macOS
brew install mongodb-community
brew services start mongodb-community

# On Windows
# Download from https://www.mongodb.com/try/download/community
# Run installer and follow instructions
```

Local connection string:
```
mongodb://localhost:27017/code-library
```

## Step 4: Create .env File

```bash
cp .env.example .env
```

Edit `.env`:
```env
# Your MongoDB connection string
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/code-library

# Generate a strong secret (use: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
JWT_SECRET=your_generated_secret_here_at_least_32_chars

# How long tokens last
JWT_EXPIRE=7d

# Your admin password (use something secure)
ADMIN_PASSWORD=MySecurePassword123!

# Server port
PORT=5000

# Development mode
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

## Step 5: Start Server

```bash
# Development (auto-reload on file changes)
npm run dev

# Production
npm start
```

You should see:
```
╔════════════════════════════════════════╗
║   Code Library Backend Server         ║
║   http://localhost:5000               ║
║   Environment: development            ║
╚════════════════════════════════════════╝

✓ MongoDB connected successfully
```

## Step 6: Test It Works

### Test 1: Health Check

```bash
curl http://localhost:5000/api/health
```

Response:
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-01-20T10:30:00Z"
}
```

### Test 2: Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"password":"MySecurePassword123!"}'
```

Response:
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": "7d"
}
```

Copy the `token` value.

### Test 3: Create a File

```bash
curl -X POST http://localhost:5000/api/files \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <YOUR_TOKEN_HERE>" \
  -d '{
    "fileName": "App.tsx",
    "folderPath": "src/components",
    "language": "typescript",
    "description": "Main app component",
    "codeContent": "export default function App() { return <div>Hello</div>; }"
  }'
```

### Test 4: Get All Files

```bash
curl http://localhost:5000/api/files \
  -H "Authorization: Bearer <YOUR_TOKEN_HERE>"
```

## 🎯 Recommended Next Steps

1. ✅ Backend is running
2. 👉 Set up frontend integration (see FRONTEND_INTEGRATION_GUIDE.md)
3. 📊 Create admin dashboard UI
4. 🎨 Customize styling
5. 🚀 Deploy to production

## 🛠️ Common Issues

### "MongoDB connection failed"
- Check MONGODB_URI in .env
- Ensure IP is whitelisted in MongoDB Atlas
- Verify username/password

### "JWT_SECRET is not defined"
- Make sure .env file exists in `backend/` folder
- Restart server after creating .env

### "Port 5000 already in use"
- Change PORT in .env to 5001, 5002, etc.
- Or kill the process: `lsof -ti:5000 | xargs kill -9`

### "CORS error from frontend"
- Update FRONTEND_URL in .env with your frontend URL
- Default is `http://localhost:5173` (Vite)

## 📚 Project Structure

```
backend/
├── config/database.js      ← MongoDB connection
├── controllers/            ← Business logic
├── middleware/             ← JWT, errors, validation
├── models/CodeFile.js      ← MongoDB schema
├── routes/                 ← API endpoints
├── server.js               ← Main server file
├── .env                    ← Your secrets (don't commit!)
├── .env.example            ← Template
├── package.json            ← Dependencies
└── README.md               ← Full documentation
```

## 🔐 Security Checklist

- [x] JWT authentication
- [x] Password hashing ready (bcryptjs)
- [x] CORS configured
- [x] Helmet security headers
- [x] Input validation
- [x] Error messages (no sensitive data)
- [ ] Rate limiting (add if needed)
- [ ] HTTPS (production only)

## 📝 API Quick Reference

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| POST | `/api/auth/login` | ❌ | Admin login |
| GET | `/api/auth/verify` | ✅ | Check token |
| POST | `/api/files` | ✅ | Create file |
| GET | `/api/files` | ✅ | List files |
| GET | `/api/files/:id` | ✅ | Get one file |
| PUT | `/api/files/:id` | ✅ | Update file |
| DELETE | `/api/files/:id` | ✅ | Delete file |
| GET | `/api/files/stats/overview` | ✅ | Statistics |

## 🚀 Deploy to Production

### Using Heroku

```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create app
heroku create your-app-name

# Set environment variables
heroku config:set MONGODB_URI=your_mongodb_uri
heroku config:set JWT_SECRET=your_secret
heroku config:set ADMIN_PASSWORD=your_password
heroku config:set NODE_ENV=production

# Deploy
git push heroku main
```

### Using Railway / Render

1. Push code to GitHub
2. Connect GitHub to Railway/Render
3. Add environment variables in dashboard
4. Deploy (auto-deploys on git push)

### Using Docker

```dockerfile
FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

## ❓ Need Help?

Check the full [README.md](./README.md) for detailed documentation.

---

**Happy coding! 🎉**
