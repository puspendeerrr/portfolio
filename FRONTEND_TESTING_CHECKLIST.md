# Frontend Testing & Verification Checklist

Complete checklist to verify your MERN frontend integration is working correctly.

## ✅ Pre-Requisites

- [ ] Backend running on `http://localhost:5000`
- [ ] MongoDB connected
- [ ] Admin password set in `backend/.env`
- [ ] Frontend running on `http://localhost:5173`
- [ ] Node modules installed (`npm install`)

## 🧪 Testing Steps

### 1. Login Page Test
```
URL: http://localhost:5173/login
```

**Visual Check:**
- [ ] Gradient background visible (purple gradient)
- [ ] Login card centered on screen
- [ ] "Code Library" title visible
- [ ] "Admin Login" subtitle visible
- [ ] Password input field visible
- [ ] Login button visible

**Functionality Test:**
```bash
# Leave password empty
Click "Login"
Result: Should show error "Password is required"

# Enter wrong password
Type: "wrongpassword"
Click "Login"
Result: Should show error "Invalid password"

# Enter correct password
Type: <admin_password_from_backend_env>
Click "Login"
Result: Should redirect to /dashboard
Token should be in localStorage
```

### 2. Dashboard Page Test
```
URL: http://localhost:5173/dashboard
```

**Verify Auto-Redirect:**
```javascript
// In browser console
localStorage.clear()
// Refresh page
// Should redirect to /login
```

**Visual Check:**
- [ ] Header with "Code Library Dashboard" title
- [ ] Logout button visible (top right)
- [ ] "Create New File" button visible
- [ ] Filter dropdown for languages
- [ ] File count displayed
- [ ] Empty state message if no files

**Initial Load Test:**
- [ ] Files load from backend
- [ ] Loading spinner appears briefly
- [ ] Files display in grid
- [ ] Each file shows:
  - [ ] File name
  - [ ] Language badge
  - [ ] Folder path
  - [ ] Description
  - [ ] Tags (if any)
  - [ ] Creation date
  - [ ] Delete button

### 3. Create File Test
```
Click "Create New File" button
```

**Modal Verification:**
- [ ] Modal appears with overlay
- [ ] Form title visible
- [ ] Close button (X) in header
- [ ] All input fields visible:
  - [ ] File Name (text input)
  - [ ] Folder Path (text input)
  - [ ] Programming Language (dropdown)
  - [ ] Description (textarea)
  - [ ] Code Content (textarea)
  - [ ] Tags (text input)

**Form Validation Test:**
```javascript
// Leave fields empty and submit
Click "Create File"
Result: Show error "File name is required"

// Fill fileName only
Result: Show error "Folder path is required"

// Fill all required fields
Result: Success message appears

// Check file list updates
Result: New file appears in grid
```

**Form Data Test:**
```javascript
fileName: "TestComponent.tsx"
folderPath: "src/components/Test"
programmingLanguage: "typescript"
description: "Test component for verification"
codeContent: "export const Test = () => { return <div>Test</div>; }"
tags: "test, component, demo"

Click "Create File"
Result: File created successfully
         Modal closes
         File appears in dashboard grid
```

### 4. Filter Test
```
Create 2-3 files with different languages
```

**Filter Dropdown:**
```javascript
Select "Python" from filter
Result: Show only Python files
        Count updates

Select "JavaScript" from filter
Result: Show only JavaScript files

Select "All Languages" from filter
Result: Show all files
```

### 5. Delete Test
```javascript
Select any file
Click delete button (trash icon)
Result: Confirmation dialog appears
        "Are you sure you want to delete..."

Click "Cancel"
Result: Dialog closes, file still exists

Click delete again
Click "OK" in confirmation
Result: File deleted
        File disappears from list
        Updated count
```

### 6. Pagination Test
```javascript
// Create 15+ files
// Default limit is 10 per page

Expected: Pagination controls appear

Click "Next →"
Result: Show next 10 files

Click "← Previous"
Result: Show previous files

Buttons disabled appropriately:
- "← Previous" disabled on page 1
- "Next →" disabled on last page
```

### 7. Token Expiry Test
```javascript
// In browser DevTools
localStorage.getItem('token')
// Copy the token value

// Wait for significant time OR manually set
localStorage.setItem('token', 'invalid_token')

// Try any action (create, delete)
Result: "Unauthorized" error

// User redirected to /login
Result: localStorage cleared
```

### 8. Logout Test
```javascript
Click "Logout" button
Result: Token removed from localStorage
        Redirected to /login
```

## 🔍 Browser Console Checks

### Check Token Storage
```javascript
console.log(localStorage.getItem('token'))
// Should show JWT token string

console.log(localStorage.getItem('tokenExpiry'))
// Should show "7d" or similar
```

### Check API Calls
```javascript
// Open DevTools → Network tab
// Perform any action (login, get files, create file)
// Verify:
// - Request shows correct URL
// - Headers include "Authorization: Bearer <token>"
// - Response status is 200 or 201
// - Response data matches expected format
```

### Check Console Errors
```javascript
// Open DevTools → Console tab
// Should be NO errors for:
// - Login action
// - Getting files
// - Creating files
// - Deleting files
```

## 📊 API Response Format Verification

### Login Success
```javascript
{
  success: true,
  message: "Login successful",
  token: "eyJ...",
  expiresIn: "7d"
}
```

### Get Files Success
```javascript
{
  success: true,
  message: "Files retrieved successfully",
  data: [
    {
      _id: "...",
      fileName: "App.tsx",
      folderPath: "src/components",
      programmingLanguage: "typescript",
      description: "...",
      codeContent: "...",
      tags: ["component"],
      createdAt: "2025-...",
      updatedAt: "2025-..."
    }
  ],
  pagination: {
    total: 15,
    page: 1,
    limit: 10,
    pages: 2,
    hasNext: true,
    hasPrev: false
  }
}
```

### Create File Success
```javascript
{
  success: true,
  message: "File created successfully",
  data: {
    _id: "...",
    fileName: "...",
    folderPath: "...",
    programmingLanguage: "...",
    description: "...",
    codeContent: "...",
    tags: [...],
    createdAt: "...",
    updatedAt: "..."
  }
}
```

## 🎯 Visual Verification

### Color Scheme
- [ ] Purple gradient background (login)
- [ ] White cards/containers
- [ ] Purple gradient buttons
- [ ] Red error messages
- [ ] Green success messages

### Responsiveness
```
Desktop (1200px+):
- [ ] 3-column grid for files
- [ ] Header side-by-side layout

Tablet (768px):
- [ ] 2-column grid for files
- [ ] Layout adjusts

Mobile (<768px):
- [ ] 1-column grid
- [ ] Stacked buttons
- [ ] Full-width inputs
```

## 🔐 Security Checks

- [ ] Password input is type="password" (not visible)
- [ ] Token only in localStorage (not in URL)
- [ ] Token sent only in Authorization header
- [ ] 401 responses trigger logout
- [ ] No sensitive data in console logs
- [ ] CORS errors don't expose backend details

## ⚡ Performance Checks

- [ ] Login takes <1 second
- [ ] Files load in <2 seconds
- [ ] File creation responds <1 second
- [ ] No console warnings
- [ ] No unused variables
- [ ] No memory leaks (check DevTools)

## 📋 Full End-to-End Flow

```
1. Clear localStorage
   localStorage.clear()

2. Visit login page
   http://localhost:5173/login

3. Enter admin password
   Type correct password

4. Click Login
   Verify redirect to /dashboard

5. Check token in localStorage
   localStorage.getItem('token')

6. Create test file
   Click "Create New File"
   Fill all required fields
   Click "Create File"

7. Verify file appears
   Check grid for new file
   Check file count updated

8. Test filter
   Select language from dropdown
   Verify only that language shows

9. Test pagination
   Create more files
   Navigate pages

10. Test delete
    Click delete button
    Confirm deletion
    Verify file removed

11. Test logout
    Click "Logout"
    Verify redirected to login
    Check localStorage cleared

12. Try accessing dashboard without token
    http://localhost:5173/dashboard
    Verify redirected to login
```

## 🐛 If Tests Fail

### Login Shows 500 Error
- [ ] Backend running on port 5000?
- [ ] ADMIN_PASSWORD set in backend/.env?
- [ ] Check backend console for errors

### Cannot Get Files
- [ ] Token valid in localStorage?
- [ ] Backend /api/files endpoint working?
- [ ] Check CORS is enabled in server.js

### Form Won't Submit
- [ ] All required fields filled?
- [ ] Code content not empty?
- [ ] Check browser console for validation errors

### Files Don't Load
- [ ] Token in Authorization header?
- [ ] Check Network tab in DevTools
- [ ] Check backend endpoint returns 200

### Redirect Loop to Login
- [ ] Token valid?
- [ ] Check backend /api/files response
- [ ] Try re-login

## ✅ Final Checklist

After all tests pass:

- [ ] Login works correctly
- [ ] Dashboard loads files
- [ ] Create file works
- [ ] Filter works
- [ ] Pagination works
- [ ] Delete works
- [ ] Logout works
- [ ] Token management works
- [ ] Error handling works
- [ ] Responsive design works
- [ ] No console errors
- [ ] All API calls successful

---

**Status**: Ready for testing ✅
**Expected Time**: 15-20 minutes for full verification
**Support**: Check backend logs if issues occur
