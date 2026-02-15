# Backend API Testing Guide

Complete guide to test all backend endpoints with curl commands and expected responses.

## Setup

1. **Start the backend server**
   ```bash
   cd backend
   npm run dev
   ```
   You should see:
   ```
   ╔════════════════════════════════════════╗
   ║   Code Library Backend Server         ║
   ║   http://localhost:5000               ║
   ║   Environment: development            ║
   ╚════════════════════════════════════════╝
   ```

2. **Verify MongoDB Connection**
   - Check that you see connection logs in the console
   - If you see errors, verify your .env MONGODB_URI

## 1. Health Check Endpoint

**Purpose:** Verify the server is running

```bash
curl -X GET http://localhost:5000/api/health
```

**Expected Response:** (Status 200)
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-01-15T10:30:45.123Z",
  "uptime": 125.456,
  "environment": "development"
}
```

## 2. Authentication Endpoints

### 2.1 Register New User

**Purpose:** Create a new user account

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@example.com",
    "password": "SecurePassword123!"
  }'
```

**Expected Response:** (Status 201)
```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "email": "testuser@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Case - Duplicate Email:** (Status 400)
```bash
# Try registering with the same email again
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@example.com",
    "password": "AnotherPassword123!"
  }'
```

Expected Response:
```json
{
  "success": false,
  "message": "Email already in use"
}
```

**Error Case - Invalid Password:** (Status 400)
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "another@example.com",
    "password": "weak"
  }'
```

Expected Response:
```json
{
  "success": false,
  "message": "Password must be at least 8 characters"
}
```

### 2.2 Login User

**Purpose:** Authenticate and get JWT token

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@example.com",
    "password": "SecurePassword123!"
  }'
```

**Expected Response:** (Status 200)
```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "email": "testuser@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1MDdmMWY3N2JjZjg2Y2Q3OTk0MzkwMTEiLCJpYXQiOjE3MDUzMjg2NDUsImV4cCI6MTcwNTkzMzQ0NH0.abcd1234..."
}
```

**Note:** Save the token returned for use in authenticated API calls

**Error Case - Invalid Password:** (Status 401)
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@example.com",
    "password": "WrongPassword123!"
  }'
```

Expected Response:
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

## 3. File Management Endpoints

### Setup: Save Your Token

Replace `YOUR_TOKEN_HERE` with the actual token from login response:

```bash
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1MDdmMWY3N2JjZjg2Y2Q3OTk0MzkwMTEiLCJpYXQiOjE3MDUzMjg2NDUsImV4cCI6MTcwNTkzMzQ0NH0.abcd1234..."
```

### 3.1 Create Code File

**Purpose:** Upload a new code file to the library

```bash
curl -X POST http://localhost:5000/api/files \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "fileName": "utils.js",
    "folderPath": "helpers",
    "language": "javascript",
    "description": "Utility functions for string manipulation",
    "codeContent": "export function trim(str) {\n  return str.trim();\n}\n\nexport function capitalize(str) {\n  return str.charAt(0).toUpperCase() + str.slice(1);\n}",
    "tags": ["utility", "string", "helpers"]
  }'
```

**Expected Response:** (Status 201)
```json
{
  "success": true,
  "message": "Code file created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "fileName": "utils.js",
    "folderPath": "helpers",
    "language": "javascript",
    "description": "Utility functions for string manipulation",
    "codeContent": "export function trim(str) {\n  return str.trim();\n}\n\nexport function capitalize(str) {\n  return str.charAt(0).toUpperCase() + str.slice(1);\n}",
    "tags": ["utility", "string", "helpers"],
    "createdAt": "2024-01-15T10:30:45.123Z",
    "updatedAt": "2024-01-15T10:30:45.123Z"
  }
}
```

**Save the _id for later tests**

**Error Case - Missing Required Field:** (Status 400)
```bash
curl -X POST http://localhost:5000/api/files \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "folderPath": "helpers",
    "language": "javascript"
  }'
```

Expected Response:
```json
{
  "success": false,
  "message": "Validation failed: fileName is required, codeContent is required"
}
```

**Error Case - No Token (Unauthorized):** (Status 401)
```bash
curl -X POST http://localhost:5000/api/files \
  -H "Content-Type: application/json" \
  -d '{
    "fileName": "test.js",
    "language": "javascript",
    "codeContent": "console.log('test');"
  }'
```

Expected Response:
```json
{
  "success": false,
  "message": "No token provided. Please authenticate."
}
```

### 3.2 Get All Files

**Purpose:** Retrieve paginated list of files

```bash
curl -X GET "http://localhost:5000/api/files?page=1&limit=10" \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response:** (Status 200)
```json
{
  "success": true,
  "message": "Code files retrieved successfully",
  "data": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "fileName": "utils.js",
      "folderPath": "helpers",
      "language": "javascript",
      "description": "Utility functions for string manipulation",
      "tags": ["utility", "string", "helpers"],
      "createdAt": "2024-01-15T10:30:45.123Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 1,
    "totalItems": 1,
    "limit": 10,
    "hasNext": false,
    "hasPrev": false
  }
}
```

**Query Parameters:**
- `page` (default: 1) - Page number for pagination
- `limit` (default: 10) - Items per page
- `language` (optional) - Filter by programming language
- `search` (optional) - Search in fileName and folderPath

**Example with filters:**
```bash
curl -X GET "http://localhost:5000/api/files?language=javascript&search=utils" \
  -H "Authorization: Bearer $TOKEN"
```

### 3.3 Get Single File

**Purpose:** Retrieve detailed file content

```bash
# Replace with actual file ID from create response
FILE_ID="507f1f77bcf86cd799439012"

curl -X GET "http://localhost:5000/api/files/$FILE_ID" \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response:** (Status 200)
```json
{
  "success": true,
  "message": "Code file retrieved successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "fileName": "utils.js",
    "folderPath": "helpers",
    "language": "javascript",
    "description": "Utility functions for string manipulation",
    "codeContent": "export function trim(str) {\n  return str.trim();\n}\n\nexport function capitalize(str) {\n  return str.charAt(0).toUpperCase() + str.slice(1);\n}",
    "tags": ["utility", "string", "helpers"],
    "createdAt": "2024-01-15T10:30:45.123Z",
    "updatedAt": "2024-01-15T10:30:45.123Z"
  }
}
```

**Error Case - Invalid File ID:** (Status 404)
```bash
curl -X GET "http://localhost:5000/api/files/invalid-id" \
  -H "Authorization: Bearer $TOKEN"
```

Expected Response:
```json
{
  "success": false,
  "message": "Code file not found"
}
```

**Error Case - File Not Found:** (Status 404)
```bash
curl -X GET "http://localhost:5000/api/files/507f1f77bcf86cd799999999" \
  -H "Authorization: Bearer $TOKEN"
```

Expected Response:
```json
{
  "success": false,
  "message": "Code file not found"
}
```

### 3.4 Update File

**Purpose:** Modify existing code file

```bash
FILE_ID="507f1f77bcf86cd799439012"

curl -X PUT "http://localhost:5000/api/files/$FILE_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "fileName": "stringUtils.js",
    "description": "Enhanced utility functions for string manipulation",
    "codeContent": "export function trim(str) {\n  return str.trim();\n}\n\nexport function capitalize(str) {\n  return str.charAt(0).toUpperCase() + str.slice(1);\n}\n\nexport function reverse(str) {\n  return str.split(\"\").reverse().join(\"\");\n}"
  }'
```

**Expected Response:** (Status 200)
```json
{
  "success": true,
  "message": "Code file updated successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "fileName": "stringUtils.js",
    "folderPath": "helpers",
    "language": "javascript",
    "description": "Enhanced utility functions for string manipulation",
    "codeContent": "export function trim(str) {\n  return str.trim();\n}\n\nexport function capitalize(str) {\n  return str.charAt(0).toUpperCase() + str.slice(1);\n}\n\nexport function reverse(str) {\n  return str.split(\"\").reverse().join(\"\");\n}",
    "tags": ["utility", "string", "helpers"],
    "createdAt": "2024-01-15T10:30:45.123Z",
    "updatedAt": "2024-01-15T10:35:20.456Z"
  }
}
```

**Error Case - Invalid Language:** (Status 400)
```bash
curl -X PUT "http://localhost:5000/api/files/$FILE_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "language": "unknownLanguage"
  }'
```

Expected Response:
```json
{
  "success": false,
  "message": "Invalid language specified"
}
```

### 3.5 Delete File

**Purpose:** Remove a code file

```bash
FILE_ID="507f1f77bcf86cd799439012"

curl -X DELETE "http://localhost:5000/api/files/$FILE_ID" \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response:** (Status 200)
```json
{
  "success": true,
  "message": "Code file deleted successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439012"
  }
}
```

**Error Case - Already Deleted:** (Status 404)
```bash
curl -X DELETE "http://localhost:5000/api/files/507f1f77bcf86cd799999999" \
  -H "Authorization: Bearer $TOKEN"
```

Expected Response:
```json
{
  "success": false,
  "message": "Code file not found"
}
```

### 3.6 Get Statistics/Overview

**Purpose:** Get summary statistics about code library

```bash
curl -X GET "http://localhost:5000/api/files/stats/overview" \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response:** (Status 200)
```json
{
  "success": true,
  "message": "Statistics retrieved successfully",
  "data": {
    "totalFiles": 5,
    "totalLanguages": 3,
    "filesByLanguage": {
      "javascript": 2,
      "python": 2,
      "typescript": 1
    },
    "filesByFolder": {
      "helpers": 2,
      "utils": 2,
      "data": 1
    },
    "recentFiles": [
      {
        "_id": "507f1f77bcf86cd799439012",
        "fileName": "stringUtils.js",
        "language": "javascript",
        "createdAt": "2024-01-15T10:35:20.456Z"
      }
    ]
  }
}
```

## 4. Performance Testing

### Measure Response Time

```bash
# Check response time for list endpoint
time curl -X GET "http://localhost:5000/api/files" \
  -H "Authorization: Bearer $TOKEN"
```

**Expected:** Response should be < 500ms (much faster than before refactor)

### Test with Large Code File

```bash
# Create file with 1MB code content
curl -X POST http://localhost:5000/api/files \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "fileName": "large.js",
    "language": "javascript",
    "codeContent": "'$(python3 -c "print(\"console.log(\"test\");\" * 10000)")'",
    "folderPath": "test"
  }'
```

**Expected:** Should complete in < 2 seconds without hanging

## 5. Error Handling Tests

### 5.1 Invalid JWT Token

```bash
curl -X GET http://localhost:5000/api/files \
  -H "Authorization: Bearer invalid-token-here"
```

**Expected Response:** (Status 401)
```json
{
  "success": false,
  "message": "Invalid token"
}
```

### 5.2 Expired Token

```bash
# Use a token that has been valid but expired
# (can't test easily without waiting, but response should be 401)
```

**Expected Response:** (Status 401)
```json
{
  "success": false,
  "message": "Token has expired"
}
```

### 5.3 Request Timeout

```bash
# This tests the timeout middleware - server will respond after 30 seconds
# (you probably don't want to run this in practice)
```

**Expected Response:** (Status 503)
```json
{
  "success": false,
  "message": "Request timeout - server took too long to respond"
}
```

### 5.4 Database Connection Error

*This would require temporarily disabling MongoDB to test. Response should be:*

**Expected Response:** (Status 500)
```json
{
  "success": false,
  "message": "Database operation failed"
}
```

## 6. Test Script (Bash)

Save this as `test-api.sh` for automated testing:

```bash
#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

BASE_URL="http://localhost:5000"
TOKEN=""

echo -e "${YELLOW}Code Library API Test Script${NC}\n"

# Test 1: Health Check
echo -e "${YELLOW}1. Testing Health Check...${NC}"
HEALTH=$(curl -s $BASE_URL/api/health)
echo $HEALTH | jq '.' 2>/dev/null && echo -e "${GREEN}✓ Health check passed${NC}\n" || echo -e "${RED}✗ Health check failed${NC}\n"

# Test 2: Register
echo -e "${YELLOW}2. Testing User Registration...${NC}"
REGISTER=$(curl -s -X POST $BASE_URL/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"test$(date +%s)@example.com\",\"password\":\"TestPass123!\"}")
echo $REGISTER | jq '.' 2>/dev/null
TOKEN=$(echo $REGISTER | jq -r '.token' 2>/dev/null)
[ "$TOKEN" != "null" ] && echo -e "${GREEN}✓ Registration passed${NC}\n" || echo -e "${RED}✗ Registration failed${NC}\n"

# Test 3: Create File
echo -e "${YELLOW}3. Testing File Creation...${NC}"
FILE=$(curl -s -X POST $BASE_URL/api/files \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "fileName":"test.js",
    "language":"javascript",
    "codeContent":"console.log(\"test\");",
    "folderPath":"tests"
  }')
echo $FILE | jq '.' 2>/dev/null
FILE_ID=$(echo $FILE | jq -r '.data._id' 2>/dev/null)
[ "$FILE_ID" != "null" ] && echo -e "${GREEN}✓ File creation passed${NC}\n" || echo -e "${RED}✗ File creation failed${NC}\n"

# Test 4: Get Files
echo -e "${YELLOW}4. Testing Get All Files...${NC}"
FILES=$(curl -s $BASE_URL/api/files \
  -H "Authorization: Bearer $TOKEN")
echo $FILES | jq '.' 2>/dev/null
echo -e "${GREEN}✓ Get files passed${NC}\n"

# Test 5: Get Single File
echo -e "${YELLOW}5. Testing Get Single File...${NC}"
SINGLE=$(curl -s $BASE_URL/api/files/$FILE_ID \
  -H "Authorization: Bearer $TOKEN")
echo $SINGLE | jq '.' 2>/dev/null
echo -e "${GREEN}✓ Get single file passed${NC}\n"

# Test 6: Update File
echo -e "${YELLOW}6. Testing File Update...${NC}"
UPDATE=$(curl -s -X PUT $BASE_URL/api/files/$FILE_ID \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "fileName":"updated.js"
  }')
echo $UPDATE | jq '.' 2>/dev/null
echo -e "${GREEN}✓ File update passed${NC}\n"

# Test 7: Statistics
echo -e "${YELLOW}7. Testing Statistics...${NC}"
STATS=$(curl -s $BASE_URL/api/files/stats/overview \
  -H "Authorization: Bearer $TOKEN")
echo $STATS | jq '.' 2>/dev/null
echo -e "${GREEN}✓ Statistics passed${NC}\n"

# Test 8: Delete File
echo -e "${YELLOW}8. Testing File Deletion...${NC}"
DELETE=$(curl -s -X DELETE $BASE_URL/api/files/$FILE_ID \
  -H "Authorization: Bearer $TOKEN")
echo $DELETE | jq '.' 2>/dev/null
echo -e "${GREEN}✓ File deletion passed${NC}\n"

echo -e "${GREEN}All tests completed!${NC}"
```

Make it executable:
```bash
chmod +x test-api.sh
./test-api.sh
```

## 7. Debugging Tips

### Enable Verbose Logging
```bash
# Add -v to curl commands for detailed request/response info
curl -v http://localhost:5000/api/health
```

### Format JSON Response
```bash
# Pipe response through jq for pretty formatting
curl -s http://localhost:5000/api/health | jq '.'
```

### Check Headers
```bash
# View response headers with -i
curl -i http://localhost:5000/api/health
```

### Monitor Network Traffic
```bash
# On Linux/Mac, use tcpdump or nettop
# On Windows, use netstat or Wireshark
netstat -an | grep 5000
```

### View Server Logs
Check the terminal where you ran `npm run dev` for server logs

### Test MongoDB Connection
In server logs, you should see:
```
[Connection successful] MongoDB connected to: mongodb+srv://...
```

## Common Issues & Solutions

### Issue: CORS Error
```
Access to XMLHttpRequest at 'http://localhost:5000/api/files' from origin 'http://localhost:5173' has been blocked by CORS policy
```

**Solution:**
- Verify FRONTEND_URL in .env is correct
- Ensure it exactly matches your frontend origin

### Issue: 401 Unauthorized
```json
{
  "success": false,
  "message": "Invalid token"
}
```

**Solution:**
- Make sure you're including the Authorization header
- Format should be: `Authorization: Bearer <TOKEN>`
- Token hasn't expired (7 days default)

### Issue: SSL Certificate Error
```
unable to verify the first certificate
```

**Solution:**
- Already fixed in database.js with family: 4 (IPv4 only)
- No action needed

### Issue: 30-Second Timeout
Response takes 30+ seconds or hangs indefinitely

**Solution:**
- Already fixed in database.js with timeouts configured
- Verify MongoDB URI is correct
- Check network connectivity to MongoDB Atlas

---

**Updated:** 2024
**Backend Version:** 1.0.0 (Post-Refactor)
**Status:** Production Ready ✓
