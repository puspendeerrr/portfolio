# API Testing Reference

Quick reference for testing API endpoints with curl or Postman.

---

## 🔐 Authentication

### POST /api/auth/login

**Login to get JWT token**

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "password": "MySecurePassword123!"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImFkbWluIiwicm9sZSI6ImFkbWluIiwiZW1haWwiOiJhZG1pbkBwb3J0Zm9saW8ubG9jYWwiLCJpYXQiOjE3MDUxNjAwMDAsImV4cCI6MTcwNTc2NDgwMH0.abc123...",
  "expiresIn": "7d"
}
```

**Save token for next requests:**
```bash
export TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

### GET /api/auth/verify

**Verify JWT token is valid**

```bash
curl http://localhost:5000/api/auth/verify \
  -H "Authorization: Bearer $TOKEN"
```

**Response:**
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

## 📁 File Operations

### POST /api/files

**Create a new code file**

```bash
curl -X POST http://localhost:5000/api/files \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "fileName": "App.tsx",
    "folderPath": "src/components/App",
    "language": "typescript",
    "description": "Main application component with routing",
    "codeContent": "import React from '\''react'\'';\nimport { BrowserRouter as Router } from '\''react-router-dom'\'';\n\nexport default function App() {\n  return (\n    <Router>\n      <div className=\"app\">\n        {/* App content */}\n      </div>\n    </Router>\n  );\n}",
    "tags": ["react", "typescript", "main"]
  }'
```

---

### GET /api/files

**Get all code files (with pagination and filtering)**

```bash
# Get all files
curl http://localhost:5000/api/files \
  -H "Authorization: Bearer $TOKEN"

# Filter by language
curl "http://localhost:5000/api/files?language=typescript" \
  -H "Authorization: Bearer $TOKEN"

# Pagination
curl "http://localhost:5000/api/files?page=1&limit=10" \
  -H "Authorization: Bearer $TOKEN"

# Sort and filter
curl "http://localhost:5000/api/files?language=python&sortBy=createdAt&order=desc&limit=20&page=1" \
  -H "Authorization: Bearer $TOKEN"
```

**Response:**
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
      "description": "Main application component with routing",
      "createdAt": "2024-01-20T10:30:00.000Z",
      "updatedAt": "2024-01-20T10:30:00.000Z"
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

### GET /api/files/:id

**Get a single file with full code content**

```bash
FILE_ID="507f1f77bcf86cd799439011"

curl http://localhost:5000/api/files/$FILE_ID \
  -H "Authorization: Bearer $TOKEN"
```

**Response:**
```json
{
  "success": true,
  "message": "File retrieved successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "fileName": "App.tsx",
    "folderPath": "src/components/App",
    "language": "typescript",
    "description": "Main application component with routing",
    "codeContent": "import React from 'react';\n...",
    "tags": ["react", "typescript", "main"],
    "createdAt": "2024-01-20T10:30:00.000Z",
    "updatedAt": "2024-01-20T10:30:00.000Z"
  }
}
```

---

### PUT /api/files/:id

**Update a code file**

```bash
FILE_ID="507f1f77bcf86cd799439011"

curl -X PUT http://localhost:5000/api/files/$FILE_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "description": "Updated description",
    "codeContent": "// Updated code",
    "tags": ["updated", "v2"]
  }'
```

---

### DELETE /api/files/:id

**Delete a code file**

```bash
FILE_ID="507f1f77bcf86cd799439011"

curl -X DELETE http://localhost:5000/api/files/$FILE_ID \
  -H "Authorization: Bearer $TOKEN"
```

**Response:**
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

### GET /api/files/stats/overview

**Get statistics about stored files**

```bash
curl http://localhost:5000/api/files/stats/overview \
  -H "Authorization: Bearer $TOKEN"
```

**Response:**
```json
{
  "success": true,
  "message": "Statistics retrieved successfully",
  "data": {
    "totalFiles": 45,
    "byLanguage": [
      {
        "_id": "typescript",
        "count": 18
      },
      {
        "_id": "javascript",
        "count": 12
      },
      {
        "_id": "python",
        "count": 8
      },
      {
        "_id": "cpp",
        "count": 7
      }
    ],
    "byFolder": [
      {
        "_id": "src/components",
        "count": 16
      },
      {
        "_id": "src/utils",
        "count": 9
      },
      {
        "_id": "src/hooks",
        "count": 8
      }
    ]
  }
}
```

---

## 📊 Postman Collection

You can import these requests into Postman:

1. Copy the curl commands above
2. Open Postman
3. Click "Import" → "Raw text" 
4. Paste the curl command
5. Create a variable `{{token}}` and `{{baseUrl}}`

**Set variables in Postman:**
- `baseUrl`: `http://localhost:5000/api`
- `token`: (Copy from login response)

---

## 🧪 Batch Testing Script

Create file: `backend/scripts/test-api.sh`

```bash
#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

BASE_URL="http://localhost:5000/api"
PASSWORD="MySecurePassword123!"

echo "🧪 Testing Code Library API..."

# Test 1: Login
echo -e "\n${GREEN}[1] Testing Login...${NC}"
LOGIN_RESPONSE=$(curl -s -X POST $BASE_URL/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"password\":\"$PASSWORD\"}")

TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo -e "${RED}❌ Login failed${NC}"
  echo $LOGIN_RESPONSE
  exit 1
fi

echo -e "${GREEN}✅ Login successful${NC}"
echo "Token: ${TOKEN:0:50}..."

# Test 2: Verify token
echo -e "\n${GREEN}[2] Testing Token Verification...${NC}"
curl -s $BASE_URL/auth/verify \
  -H "Authorization: Bearer $TOKEN" | grep "success"

# Test 3: Create file
echo -e "\n${GREEN}[3] Testing File Creation...${NC}"
CREATE_RESPONSE=$(curl -s -X POST $BASE_URL/files \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "fileName": "test.ts",
    "folderPath": "src/test",
    "language": "typescript",
    "description": "Test file",
    "codeContent": "console.log('\''test'\'');"
  }')

FILE_ID=$(echo $CREATE_RESPONSE | grep -o '"_id":"[^"]*' | cut -d'"' -f4)
echo -e "${GREEN}✅ File created: $FILE_ID${NC}"

# Test 4: Get all files
echo -e "\n${GREEN}[4] Testing Get All Files...${NC}"
curl -s "$BASE_URL/files?limit=5" \
  -H "Authorization: Bearer $TOKEN" | grep "pagination"

# Test 5: Get single file
echo -e "\n${GREEN}[5] Testing Get File by ID...${NC}"
curl -s "$BASE_URL/files/$FILE_ID" \
  -H "Authorization: Bearer $TOKEN" | grep "codeContent"

# Test 6: Update file
echo -e "\n${GREEN}[6] Testing File Update...${NC}"
curl -s -X PUT "$BASE_URL/files/$FILE_ID" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"description": "Updated test file"}' | grep "success"

# Test 7: Get stats
echo -e "\n${GREEN}[7] Testing Statistics...${NC}"
curl -s "$BASE_URL/files/stats/overview" \
  -H "Authorization: Bearer $TOKEN" | grep "totalFiles"

# Test 8: Delete file
echo -e "\n${GREEN}[8] Testing File Deletion...${NC}"
curl -s -X DELETE "$BASE_URL/files/$FILE_ID" \
  -H "Authorization: Bearer $TOKEN" | grep "success"

echo -e "\n${GREEN}✅ All tests completed!${NC}\n"
```

Run it:
```bash
chmod +x scripts/test-api.sh
./scripts/test-api.sh
```

---

## 🚨 Error Responses

All errors follow this format:

```json
{
  "success": false,
  "message": "Error description",
  "statusCode": 400,
  "validationErrors": [] // Only for validation errors
}
```

### Common Errors

**400 - Validation Error:**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "fileName",
      "message": "File name is required"
    }
  ]
}
```

**401 - Unauthorized:**
```json
{
  "success": false,
  "message": "No token provided. Please login first."
}
```

**401 - Token Expired:**
```json
{
  "success": false,
  "message": "Token has expired. Please login again."
}
```

**404 - Not Found:**
```json
{
  "success": false,
  "message": "File not found"
}
```

**500 - Server Error:**
```json
{
  "success": false,
  "message": "Internal Server Error"
}
```

---

## 🔍 Debugging Tips

### Enable Request Logging
Change in `server.js`:
```javascript
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);
    next();
  });
}
```

### Check MongoDB
```bash
# Connect to MongoDB locally
mongosh

# Use database
use code-library

# View collections
db.getCollectionNames()

# View files
db.codefiles.find()
```

### Test Network Connectivity
```bash
# Ping server
curl -i http://localhost:5000/api/health

# Check CORS headers
curl -i -X OPTIONS http://localhost:5000/api/files
```

---

**Happy testing! 🚀**
