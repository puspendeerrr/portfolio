# 📚 Architecture & File Explanations

Complete guide explaining every file in the Code Library Backend.

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    Client (React)                        │
│                                                          │
│  - Admin Dashboard (Login, Upload, Manage)             │
│  - Public Code Library (View, Search, Filter)          │
└────────────────────────┬────────────────────────────────┘
                         │
                    HTTP/REST API
                         │
┌────────────────────────▼────────────────────────────────┐
│               Express.js Server                         │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Middleware Layer                                 │  │
│  │ - CORS, Helmet, Body Parser                     │  │
│  │ - Auth Verification, Error Handler              │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Routes Layer                                     │  │
│  │ - /api/auth/login                               │  │
│  │ - /api/files (CRUD)                             │  │
│  │ - /api/files/stats/overview                     │  │
│  └──────────┬─────────────────────────────────────┬┘  │
│             │                                       │   │
│  ┌──────────▼──────────────┐  ┌──────────────────▼─┐  │
│  │ Controllers             │  │ Middleware        │  │
│  │ - Auth Logic            │  │ - JWT Verify      │  │
│  │ - CRUD Operations       │  │ - Validation      │  │
│  │ - Error Handling        │  │ - Error Handling  │  │
│  └──────────┬──────────────┘  └────────────────────┘  │
│             │                                        │  │
│  ┌──────────▼──────────────────────────────────────┐  │
│  │ Models (Mongoose Schemas)                      │  │
│  │ - CodeFile Schema with validation              │  │
│  │ - Indexes for performance                      │  │
│  └──────────┬──────────────────────────────────────┘  │
│             │                                        │  │
│             └────────┬─────────────────────────────────│
│                      │                                 │
└──────────────────────┼─────────────────────────────────┘
                       │
┌──────────────────────▼─────────────────────────────────┐
│               MongoDB Database                         │
│                                                        │
│  - code-library (Database)                           │
│  - codefiles (Collection)                            │
│  - Text Index, Language Index, CreatedAt Index       │
└────────────────────────────────────────────────────────┘
```

---

## 📁 File-by-File Explanation

### Root Files

#### `package.json`

**Purpose:** Node.js project configuration and dependencies

**Key Content:**
```json
{
  "name": "code-library-backend",
  "main": "server.js",
  "type": "module",  // Use ES6 imports/exports
  "scripts": {
    "start": "node server.js",      // Production
    "dev": "nodemon server.js"      // Development
  },
  "dependencies": {
    "express": "Web framework",
    "mongoose": "MongoDB ODM",
    "jsonwebtoken": "JWT auth",
    "bcryptjs": "Password hashing",
    "cors": "Cross-origin support",
    "helmet": "Security headers",
    "express-validator": "Input validation"
  }
}
```

**Why each package:**
- **express**: Main REST API framework
- **mongoose**: Database modeling and validation
- **jsonwebtoken**: Secure authentication tokens
- **bcryptjs**: One-way password hashing
- **cors**: Allow frontend requests
- **helmet**: Security headers (prevent XSS, etc.)
- **express-validator**: Validate API input before processing
- **dotenv**: Load environment variables from .env
- **nodemon**: Auto-restart server on file changes (dev)

#### `.env.example`

**Purpose:** Template showing all environment variables needed

**Content:**
```env
MONGODB_URI=...               # Database connection
JWT_SECRET=...                # Token encryption key
JWT_EXPIRE=7d                 # How long tokens last
ADMIN_PASSWORD=...            # Admin login password
PORT=5000                     # Server port
NODE_ENV=development          # Environment type
FRONTEND_URL=...              # For CORS
```

**Copy to .env:** `cp .env.example .env` (don't commit .env!)

#### `.gitignore`

**Purpose:** Tell Git which files not to commit

**Includes:**
- `.env` (secrets)
- `node_modules/` (huge, reinstalled with npm install)
- Logs and OS files

---

### Server Entry Point

#### `server.js`

**Purpose:** Main server file - starts Express app and connects database

**What it does:**
1. **Load environment variables** with dotenv
2. **Connect to MongoDB** using config/database.js
3. **Setup middleware:**
   - Helmet (security headers)
   - CORS (allow frontend requests)
   - Express.json (parse request bodies)
   - Request logging (dev only)
4. **Define routes:**
   - `/api/auth` → Authentication
   - `/api/files` → File management
   - `/api/health` → Health check
5. **Handle 404s** for non-existent routes
6. **Register error handler** (catches all errors)
7. **Start listening** on PORT

**Key Code:**
```javascript
// Start server
app.listen(PORT, () => console.log(`Server on port ${PORT}`));

// Graceful shutdown
process.on('SIGTERM', () => server.close());
```

---

### Config Directory

#### `config/database.js`

**Purpose:** MongoDB connection setup

**What it does:**
```javascript
const connectDB = async () => {
  // Get MongoDB URI from .env
  // Connect to MongoDB
  // Handle connection errors
  // Call process.exit(1) if it fails
};
```

**Why separate file:**
- Keeps server.js clean
- Reusable in other files
- Easy to modify connection logic
- Has its own error handling

**Called in:** server.js during startup

---

### Models Directory

#### `models/CodeFile.js`

**Purpose:** Define MongoDB schema for code files

**Schema Fields:**
```javascript
{
  fileName: String,         // Required, max 100 chars
  folderPath: String,       // Required, max 500 chars
  language: String,         // Required, enum of languages
  description: String,      // Required, max 1000 chars
  codeContent: String,      // Required, max 1MB
  tags: [String],          // Optional, max 20 tags
  createdAt: Date,         // Auto-generated
  updatedAt: Date          // Auto auto-generated
}
```

**Validation Rules:**
- Enforces required fields
- Limits text lengths
- Validates file names (no special chars)
- Restricted language choice
- Size limits prevent abuse

**Indexes:**
```javascript
// Text search index
codeFileSchema.index({ fileName: 'text', folderPath: 'text' });

// Speed up language filtering
codeFileSchema.index({ language: 1 });

// Speed up sorting by date
codeFileSchema.index({ createdAt: -1 });
```

**Benefits of Mongoose:**
- Schema validation (before saving)
- Type casting (string → number)
- Special methods (save, delete, find)
- Middleware hooks (pre-save, post-update)
- Indexes for performance

---

### Controllers Directory

#### `controllers/authController.js`

**Purpose:** Handle authentication logic (login, verify token)

**Functions:**

**1. `login()`**
```javascript
// POST /api/auth/login
// Body: { password }
// Returns: { token, expiresIn }

// Process:
// 1. Get password from request
// 2. Compare with ADMIN_PASSWORD
// 3. If match → Generate JWT token
// 4. Return token to client
// 5. If no match → Return 401 error
```

**JWT Token Content:**
```javascript
{
  id: 'admin',
  role: 'admin',
  email: 'admin@portfolio.local',
  iat: 1705160000,    // Issued at
  exp: 1705764800     // Expires at
}
```

**2. `verifyToken()`**
```javascript
// GET /api/auth/verify
// User sends token in Authorization header
// Middleware already verified JWT
// This endpoint just confirms it's valid
```

**3. `hashPassword()`**
```javascript
// Helper function to hash password with bcryptjs
// Usage: const hash = await hashPassword('password');
// Returns bcrypt hash (can be stored in DB)
// Import in CLI tools: node -e "import auth from './auth.js'"
```

**Why separate from routes:**
- Controllers have all business logic
- Easy to test (unit tests)
- Easy to reuse in other routes
- Routes stay clean and readable

---

#### `controllers/filesController.js`

**Purpose:** CRUD operations for code files

**Functions:**

**1. `createFile()`**
```javascript
// POST /api/files
// Create new file in database
// Validates all required fields
// Throws validation error if missing/invalid
// Returns: created file with _id
```

**2. `getAllFiles()`**
```javascript
// GET /api/files
// Returns: list of files with pagination

// Query params:
// - language: filter by language
// - sortBy: field to sort (default: createdAt)
// - order: asc or desc (default: desc)
// - limit: items per page (default: 20)
// - page: page number (default: 1)

// Note: excludes codeContent for list view (large!)
// Only includes it when client requests single file
```

**3. `getFileById()`**
```javascript
// GET /api/files/:id
// Returns: complete file with codeContent
// Throws 404 if not found
```

**4. `updateFile()`**
```javascript
// PUT /api/files/:id
// Update specific file
// Only updates provided fields
// Re-validates on save
// Returns: updated file
```

**5. `deleteFile()`**
```javascript
// DELETE /api/files/:id
// Delete file from database
// Throws 404 if not found
// Returns: deleted file id
```

**6. `getFileStats()`**
```javascript
// GET /api/files/stats/overview
// Returns statistics:
// - Total files count
// - Files per language (bar chart data)
// - Files per folder (top 10)
// Uses MongoDB aggregation for efficiency
```

**Why asyncHandler wrapper:**
```javascript
// Without asyncHandler:
router.get('/:id', async (req, res) => {
  try {
    // code that might throw
  } catch (err) {
    next(err);  // Must manually catch
  }
});

// With asyncHandler:
router.get('/:id', asyncHandler(async (req, res) => {
  // code that might throw
  // error automatically goes to next(error)
}));
```

---

### Middleware Directory

#### `middleware/authMiddleware.js`

**Purpose:** Verify JWT token on protected routes

**Flow:**
```javascript
// 1. Check Authorization header exists
// 2. Extract token from "Bearer <token>"
// 3. Verify token signature with JWT_SECRET
// 4. If valid → attach user to req.user, continue
// 5. If invalid → return 401 with error

// Called BEFORE controller function
// Prevents unauthorized requests from reaching controllers
```

**Used on:**
- All `/api/files/*` routes
- Token verify endpoint

**Token verification checks:**
- Signature is valid (not tampered)
- Token hasn't expired
- Secret key matches

**Error handling:**
```javascript
// TokenExpiredError → 401 "Token has expired"
// JsonWebTokenError → 401 "Invalid token"
// No token → 401 "No token provided"
```

---

#### `middleware/errorHandler.js`

**Purpose:** Global error handling and async wrapper

**Two exports:**

**1. `asyncHandler()` wrapper**
```javascript
// Wraps async controllers to catch errors
// Without: controllers need try-catch
// With: automatic error catching

// Usage:
router.post('/', asyncHandler(createFile));
```

**2. `errorHandler()` middleware**
```javascript
// Catches ALL errors in app
// Formats them consistently
// Returns proper HTTP status codes

// Handles:
// - Mongoose validation errors → 400
// - Duplicate key errors → 400
// - Cast errors → 400
// - JWT errors → 401
// - Default errors → 500
```

**Error Response Format:**
```json
{
  "success": false,
  "message": "Error description",
  "statusCode": 400,
  "validationErrors": []  // Only for validation
}
```

**Must be last middleware:**
```javascript
// Correct order:
app.use(authMiddleware);        // Early
app.use(routes);                // Middle
app.use(errorHandler);          // LAST
```

---

#### `middleware/validationHandler.js`

**Purpose:** Process express-validator errors

**Used with:**
```javascript
// In routes:
router.post(
  '/login',
  [
    body('password').notEmpty().withMessage('Required'),
    body('password').isLength({ min: 6 })
  ],
  handleValidationErrors,  // Check for errors
  login                     // Controller
);
```

**Does:**
1. Receive validation results from express-validator
2. Format error messages
3. Return 400 response if errors found
4. Call next() if validation passes

**Error Format:**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    { "field": "password", "message": "Password is required" }
  ]
}
```

---

### Routes Directory

#### `routes/authRoutes.js`

**Purpose:** Define authentication API endpoints

**Endpoints:**

**1. POST /api/auth/login**
```javascript
// Public endpoint (no auth required)
// Validates password field
// Calls authController.login()
```

**2. GET /api/auth/verify**
```javascript
// Protected endpoint (requires JWT)
// Just confirms token is valid
// Calls authController.verifyToken()
```

**Validation Chain:**
```javascript
[
  body('password')
    .trim()              // Remove whitespace
    .notEmpty()          // Must have value
    .isLength({ min: 6 }) // At least 6 chars
],
handleValidationErrors,  // Check for errors
login                    // Call controller if valid
```

---

#### `routes/filesRoutes.js`

**Purpose:** Define file management API endpoints

**Key Pattern:**
```javascript
// All file routes require auth
router.use(authMiddleware);

// Then define routes
router.post('/', [validations], handleErrors, createFile);
router.get('/', getAllFiles);
// etc
```

**Endpoints:**

**1. POST /api/files** - Create file
- Validates: fileName, folderPath, language, description, codeContent
- Language must be from enum
- Tags optional

**2. GET /api/files** - List files
- No validation (query params)
- Supports: language, sortBy, order, limit, page
- Pagination metadata in response

**3. GET /api/files/stats/overview** - Stats
- Must come before /:id route (Express routing order)
- No parameters

**4. GET /api/files/:id** - Get single file
- Returns full codeContent
- 404 if not found

**5. PUT /api/files/:id** - Update file
- Partial updates (only update provided fields)
- Re-validates schema

**6. DELETE /api/files/:id** - Delete file
- 404 if not found
- Returns deleted ID

---

### Utilities

#### `utils/jwtUtils.js`

**Purpose:** Reusable JWT functions

**Functions:**

**1. `generateToken(payload, secret, expiresIn)`**
```javascript
const token = generateToken(
  { id: 'admin', role: 'admin' },
  process.env.JWT_SECRET,
  '7d'
);
```

**2. `verifyToken(token, secret)`**
```javascript
const decoded = verifyToken(token);  // Throws if invalid
```

**3. `decodeToken(token)`**
```javascript
const decoded = decodeToken(token);  // No verification
```

**4. `isTokenExpired(token)`**
```javascript
if (isTokenExpired(token)) {
  // Token is expired
}
```

**5. `getTokenExpirationDate(token)`**
```javascript
const expiresAt = getTokenExpirationDate(token);
```

**Use Cases:**
- Admin CLI tools
- Token refresh logic
- Test utilities
- Scheduled tasks

---

### Scripts

#### `scripts/generatePasswordHash.js`

**Purpose:** Generate bcrypt hash for admin password

**Usage:**
```bash
node scripts/generatePasswordHash.js "your_password"

# Output:
# ✅ Password Hash Generated Successfully
# 
# Hashed Password:
# $2a$10$abcdefg...
# 
# 📝 Add this to your .env file:
# ADMIN_PASSWORD=$2a$10$abcdefg...
```

**Why bcrypt?**
- One-way hashing (can't reverse)
- Slow (prevents brute-force attacks)
- Includes salt (random variation)
- Industry standard

**Setup Steps:**
1. Generate hash: `node scripts/generatePasswordHash.js "strong_password"`
2. Copy hash to .env as ADMIN_PASSWORD
3. Update authController.js to use bcryptjs.compare()
4. Deploy securely (don't commit plaintext passwords)

---

## 🔄 Request Flow Example

### Creating a Code File

```
1. Client: POST /api/files
   Body: { fileName, folderPath, language, description, codeContent }
   Header: Authorization: Bearer <token>
                ↓
2. Express receives request
                ↓
3. Middleware chain:
   - CORS: Check origin
   - helmet: Add security headers
   - express.json: Parse JSON body
   - Route matching: Match POST /api/files
   - authMiddleware: Verify JWT token
   - Validation: Check field requirements
   - handleValidationErrors: Process errors
                ↓
4. Controller: createFile()
   - Extract fields from req.body
   - Create new CodeFile instance
   - Call .save() to store in MongoDB
                ↓
5. MongoDB:
   - Run schema validations
   - Create indexes
   - Store document
   - Return created document
                ↓
6. Controller:
   - Return 201 success response
   - Include created file with _id
                ↓
7. Client:
   - Receives response
   - Uses _id for future updates
   - Updates UI to show new file
```

---

## 🔒 Security Layers

### Layer 1: Network Level
- CORS middleware: Only allow frontend domain
- Helmet: Set security headers

### Layer 2: Authentication
- JWT tokens: Secure ID verification
- Token expiration: Tokens expire after 7 days
- Bearer tokens: Standard HTTP auth

### Layer 3: Input Validation
- express-validator: Validate all input
- Type checking: Mongoose schema validation
- Length limits: Prevent large payloads
- Enum constraints: Only allow valid languages

### Layer 4: Error Handling
- Never expose stack traces to client
- Consistent error format
- Hide sensitive system details
- Log errors securely

### Layer 5: Database Level
- Mongoose validation: Enforce schema
- Type conversion: Auto-cast types
- Indexes: Prevent large scans

### Future Enhancements
- Rate limiting: Prevent brute-force
- HTTPS: Encrypt in transit
- Database encryption: Encrypt at rest
- Audit logging: Track admin actions
- IP whitelist: Only allow trusted IPs

---

## 📊 Database Design

### Collection: codefiles

```javascript
{
  _id: ObjectId,              // Auto-generated by MongoDB
  fileName: String,           // e.g., "App.tsx"
  folderPath: String,         // e.g., "src/components/App"
  language: String,           // e.g., "typescript"
  description: String,        // e.g., "Main app component"
  codeContent: String,        // Actual code (large)
  tags: [String],            // e.g., ["react", "hooks"]
  createdAt: Date,           // Auto-set on creation
  updatedAt: Date            // Auto-set on update
}
```

### Indexes

```javascript
// Index 1: Text search
{
  fileName: "text",
  folderPath: "text",
  description: "text"
}

// Index 2: Language filtering
{ language: 1 }

// Index 3: Creation date sorting
{ createdAt: -1 }
```

### Query Optimization

**Without index (slow):**
```javascript
// Scans ALL files
db.codefiles.find({ language: "typescript" })
```

**With index (fast):**
```javascript
// Uses index, returns instantly
db.codefiles.find({ language: "typescript" })
```

---

## 🚀 Deployment Checklist

- [ ] Generate strong JWT_SECRET
- [ ] Set NODE_ENV=production
- [ ] Configure MONGODB_URI for production
- [ ] Hash ADMIN_PASSWORD with bcrypt
- [ ] Set FRONTEND_URL correctly
- [ ] Enable HTTPS
- [ ] Setup rate limiting
- [ ] Enable request logging
- [ ] Test all endpoints
- [ ] Setup monitoring/alerts
- [ ] Backup MongoDB regularly
- [ ] Document admin procedures

---

**Now you understand every part of the backend! 🎉**
