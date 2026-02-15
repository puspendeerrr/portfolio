# Production Checklist - Code Library Backend

This checklist ensures your backend is production-ready and secure before deployment.

## 1. Environment & Security Setup ✓

- [ ] **Create .env file** from .env.example (DO NOT commit to git)
  ```bash
  cp backend/.env.example backend/.env
  ```

- [ ] **MongoDB Atlas Setup**
  - [ ] Create MongoDB Atlas account: https://www.mongodb.com/cloud/atlas
  - [ ] Create free tier cluster
  - [ ] Create database user with strong password
  - [ ] Get connection string from "Connect" button
  - [ ] Add connection string to `MONGODB_URI` in .env
  - [ ] Whitelist your IP address in Atlas (or use 0.0.0.0 to allow all)
  - [ ] Test connection before deployment

- [ ] **JWT Secret Generation**
  ```bash
  # Run this command to generate a secure JWT secret
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```
  - [ ] Copy the output and paste into `JWT_SECRET` in .env
  - [ ] Ensure it's at least 32 characters
  - [ ] Store securely (use secrets manager for production)

- [ ] **FRONTEND_URL Configuration**
  - [ ] Update `FRONTEND_URL` in .env to match your deployed frontend URL
  - [ ] Example for production: `https://yourfrontend.vercel.app`
  - [ ] CORS will reject requests from other origins

## 2. Dependencies & Installation ✓

- [ ] **Node Version**
  - [ ] Verify Node.js version 18 or higher: `node --version`
  - [ ] Install if needed from: https://nodejs.org/

- [ ] **Install Dependencies**
  ```bash
  cd backend
  npm install
  ```

- [ ] **Verify Key Packages**
  - [ ] mongoose ^7.6.0 (MongoDB ORM)
  - [ ] jsonwebtoken ^9.0.2 (JWT authentication)
  - [ ] bcryptjs ^2.4.3 (password hashing)
  - [ ] express-validator ^7.0.0 (input validation)
  - [ ] helmet ^7.1.0 (security headers)
  - [ ] cors ^2.8.5 (cross-origin requests)

## 3. Database Configuration ✓

- [ ] **MongoDB Connection**
  - [ ] Connection string format verified: `mongodb+srv://user:pass@cluster.mongodb.net/db`
  - [ ] IPv4 mode enabled (family: 4) in database.js ✓
  - [ ] Timeout settings configured:
    - [ ] serverSelectionTimeoutMS: 5000 ✓
    - [ ] socketTimeoutMS: 45000 ✓
    - [ ] connectTimeoutMS: 10000 ✓
  - [ ] Connection pooling configured ✓
  - [ ] Retry logic enabled (retryWrites: true) ✓

- [ ] **Collections & Indexes**
  - [ ] CodeFile collection created with indexes
  - [ ] User collection created (for auth)
  - [ ] Verify indexes exist for performance

- [ ] **Initial Data (Optional)**
  - [ ] Consider running seed script to add sample code files
  - [ ] Or create admin user manually

## 4. Code & Configuration Review ✓

- [ ] **Error Handling**
  - [ ] Global error middleware in server.js ✓
  - [ ] All routes have try/catch blocks ✓
  - [ ] No unhandled promise rejections
  - [ ] Proper HTTP status codes returned

- [ ] **Request Timeouts**
  - [ ] Server timeout: 30 seconds ✓
  - [ ] Database timeout: 5 seconds (selection) ✓
  - [ ] Socket timeout: 45 seconds ✓
  - [ ] Response timeout middleware active ✓

- [ ] **Security Headers** (via Helmet)
  - [ ] X-Content-Type-Options set
  - [ ] X-Frame-Options set
  - [ ] Content Security Policy configured
  - [ ] SSL/HTTPS enforced in production

- [ ] **CORS Configuration**
  - [ ] Origin whitelist configured
  - [ ] Credentials enabled for secure cookies
  - [ ] Only necessary HTTP methods allowed

- [ ] **Input Validation**
  - [ ] All POST/PUT routes validate input
  - [ ] express-validator chains in place
  - [ ] File content size limits enforced
  - [ ] No SQL injection vectors

## 5. Authentication & Authorization ✓

- [ ] **JWT Configuration**
  - [ ] JWT_SECRET set to strong value
  - [ ] JWT_EXPIRATION set (default: 7d)
  - [ ] Token validation in authMiddleware

- [ ] **Password Security**
  - [ ] bcryptjs salt rounds: 10 or higher
  - [ ] Passwords never logged or exposed
  - [ ] Password reset flow implemented (if needed)

- [ ] **User Roles** (if implemented)
  - [ ] Admin role enforced
  - [ ] Users can only access their own code files
  - [ ] Proper authorization checks in routes

## 6. API Endpoints Testing

Before deployment, test all endpoints:

### Health Check
```bash
curl http://localhost:5000/api/health
```
Expected: 200 with `{"success": true}`

### Authentication
```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"Password123!"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"Password123!"}'
```

### File Operations (replace TOKEN with actual JWT)
```bash
# Get all files
curl http://localhost:5000/api/files \
  -H "Authorization: Bearer TOKEN"

# Create file
curl -X POST http://localhost:5000/api/files \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "fileName":"test.js",
    "folderPath":"utils",
    "language":"javascript",
    "codeContent":"console.log(\"hello\");"
  }'

# Get specific file
curl http://localhost:5000/api/files/FILE_ID \
  -H "Authorization: Bearer TOKEN"

# Update file
curl -X PUT http://localhost:5000/api/files/FILE_ID \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"fileName":"updated.js"}'

# Delete file
curl -X DELETE http://localhost:5000/api/files/FILE_ID \
  -H "Authorization: Bearer TOKEN"

# Get statistics
curl http://localhost:5000/api/files/stats/overview \
  -H "Authorization: Bearer TOKEN"
```

## 7. Performance Optimization ✓

- [ ] **Database Queries**
  - [ ] .lean() used for list queries ✓
  - [ ] Indexes created on frequently searched fields ✓
  - [ ] Pagination implemented for large datasets ✓
  - [ ] No N+1 queries

- [ ] **Response Compression**
  - [ ] Consider gzip compression for responses
  - [ ] Large responses should be paginated

- [ ] **Caching** (Future enhancement)
  - [ ] Redis caching for frequently accessed data
  - [ ] Cache invalidation strategy

## 8. Logging & Monitoring

- [ ] **Request Logging**
  - [ ] All requests logged with method, path, status, duration
  - [ ] Database errors logged
  - [ ] Sensitive data NOT logged

- [ ] **Error Logging**
  - [ ] Comprehensive error logging setup
  - [ ] Stack traces in development only
  - [ ] Errors aggregated for monitoring

- [ ] **Monitoring Services** (Production)
  - [ ] Set up error tracking (Sentry, Rollbar, etc.)
  - [ ] Set up performance monitoring (New Relic, Datadog, etc.)
  - [ ] Set up uptime monitoring (Pingdom, UptimeRobot, etc.)

## 9. Deployment Preparation

### Heroku Deployment (Recommended for Quick Start)

- [ ] **Heroku Setup**
  - [ ] Create Heroku account: https://www.heroku.com
  - [ ] Install Heroku CLI
  - [ ] Create new Heroku app

- [ ] **Environment Variables on Heroku**
  ```bash
  heroku config:set NODE_ENV=production
  heroku config:set MONGODB_URI=mongodb+srv://...
  heroku config:set JWT_SECRET=your-secret-key
  heroku config:set FRONTEND_URL=https://your-frontend.vercel.app
  heroku config:set PORT=5000
  ```

- [ ] **Deploy to Heroku**
  ```bash
  git push heroku main
  ```

### Other Deployment Options

- [ ] **Railway.app** - Simple deployment with database
- [ ] **Render** - Free tier available
- [ ] **AWS/Azure/Google Cloud** - For scale
- [ ] **Self-hosted** - VPS or dedicated server

## 10. Post-Deployment ✓

- [ ] **Smoke Tests**
  - [ ] Test health endpoint
  - [ ] Test login with real credentials
  - [ ] Test file CRUD operations
  - [ ] Verify response times are acceptable

- [ ] **Monitor Logs**
  - [ ] Check backend logs for errors
  - [ ] Monitor database connections
  - [ ] Track API response times

- [ ] **Security Verification**
  - [ ] Test with invalid tokens (should fail)
  - [ ] Test unauthorized access (should fail)
  - [ ] Test from different origins (should be blocked)
  - [ ] Run security scan

- [ ] **Frontend Integration**
  - [ ] Frontend can successfully authenticate
  - [ ] File upload works end-to-end
  - [ ] Code viewer displays correctly
  - [ ] No CORS errors

## 11. Ongoing Maintenance

- [ ] **Regular Updates**
  - [ ] Monthly: Review npm dependencies for updates
  - [ ] Monthly: Review security advisories
  - [ ] Check npm audit: `npm audit`

- [ ] **Backups**
  - [ ] MongoDB backups scheduled daily
  - [ ] Test backup restoration process
  - [ ] Have disaster recovery plan

- [ ] **Monitoring**
  - [ ] Monitor API response times
  - [ ] Monitor error rates
  - [ ] Monitor database performance
  - [ ] Monitor server resources (CPU, memory)

- [ ] **Security Updates**
  - [ ] Keep Node.js updated
  - [ ] Keep MongoDB updated
  - [ ] Review and update security headers
  - [ ] Regular security audits

## Quick Start Commands

```bash
# Development
cd backend
npm install
npm run dev

# Testing
npm run test

# Production
NODE_ENV=production npm start

# Check for vulnerabilities
npm audit

# Update dependencies
npm update
```

## Troubleshooting

### MongoDB Connection Falls
- [ ] Verify MONGODB_URI is correct
- [ ] Check MongoDB Atlas IP whitelist
- [ ] Verify database user credentials
- [ ] Check network connectivity

### SSL/TLS Errors
- [ ] IPv4 mode enabled in database.js ✓
- [ ] Connection string includes ?retryWrites=true&w=majority

### Slow API Responses
- [ ] Check .lean() optimization is used
- [ ] Verify database indexes exist
- [ ] Check MongoDB Atlas cluster size
- [ ] Monitor slow query logs

### CORS Errors
- [ ] Verify FRONTEND_URL is correct
- [ ] Clear browser cache
- [ ] Check CORS origin exactly matches

### Port Already in Use
```bash
# Windows
netstat -ano | findstr :5000
```
Kill the process or change PORT in .env

---

**Last Updated:** 2024
**Backend Version:** 1.0.0
**Status:** Production Ready ✓
