# Code Library Frontend - Setup & Usage Guide

Complete frontend integration for your MERN stack code library management system.

## 📦 What Was Created

### 1. API Utility Module
**Location**: `src/api/api.js`

Centralized API client with all backend integration:
```javascript
import { login, getFiles, createFile, deleteFile, getFileStats } from './api/api.js';

// Login
const { token } = await login('password');
localStorage.setItem('token', token);

// Get files
const { data, pagination } = await getFiles(token);

// Create file
await createFile(token, {
  fileName: 'App.tsx',
  folderPath: 'src/components',
  programmingLanguage: 'typescript',
  description: 'Main app component',
  codeContent: '...',
  tags: ['component', 'main']
});

// Delete file
await deleteFile(token, fileId);
```

### 2. Login Component
**Location**: `src/components/Auth/LoginPage.tsx`

Features:
- Password input field
- JWT token storage
- Auto-redirect to dashboard
- Error notifications
- Production-ready styling

Usage:
```
Navigate to http://localhost:5173/login
Enter admin password from backend .env
Token automatically stored in localStorage
Redirect to /dashboard on success
```

### 3. Dashboard Component
**Location**: `src/components/Dashboard/DashboardPage.tsx`

Features:
- Display all code files in grid
- Filter by programming language
- Pagination support
- File deletion
- Token validation
- Auto-logout on token expiry
- Responsive grid layout

Files display:
- File name
- Programming language (badge)
- Folder path
- Description
- Tags
- Creation date
- Delete button

### 4. Create File Form
**Location**: `src/components/Dashboard/CreateFileForm.tsx`

Modal form with:
- Modal/popup interface
- Form validation
- All required fields
- Success/error messages
- Auto-refresh after creation
- Responsive design

Fields:
```javascript
{
  fileName: string (required),
  folderPath: string (required),
  programmingLanguage: string (dropdown),
  description: string (required),
  codeContent: string (required),
  tags: string (comma-separated, optional)
}
```

### 5. Styling
Beautiful, production-ready CSS:
- **LoginPage.css**: Gradient background, centered form
- **DashboardPage.css**: Grid layout, cards, responsive
- **CreateFileForm.css**: Modal styles, form inputs

## 🔐 Authentication & Authorization

### Token Flow
```
POST /api/auth/login
  ↓
Response: { token: "jwt...", expiresIn: "7d" }
  ↓
localStorage.setItem('token', token)
  ↓
Navigate to /dashboard
  ↓
All requests include: Authorization: Bearer <token>
```

### Protected Routes
- `/dashboard` - requires valid token in localStorage
- `/login` - public, no token required

### Token Management
- Stored in `localStorage.getItem('token')`
- Sent as `Authorization: Bearer <token>` header
- Auto-clears on 401 response
- User redirected to login if expired

## 📋 API Endpoints Used

| Method | Endpoint | Token Required | Purpose |
|--------|----------|----------------|---------|
| POST | /api/auth/login | ❌ | Admin login |
| GET | /api/files | ✅ | List files |
| GET | /api/files/:id | ✅ | Get single file |
| POST | /api/files | ✅ | Create file |
| PUT | /api/files/:id | ✅ | Update file |
| DELETE | /api/files/:id | ✅ | Delete file |
| GET | /api/files/stats/overview | ✅ | File statistics |

## 🎯 Routes Added to Frontend

Added to `src/components/App/App.tsx`:

```javascript
<Route path="/login" element={<LoginPage />} />
<Route path="/dashboard" element={<DashboardPage />} />
```

All existing portfolio routes remain unchanged.

## 🚀 Quick Start

### 1. Ensure Backend is Running
```bash
cd backend
npm install
npm start
```
Backend should run on `http://localhost:5000`

### 2. Start Frontend
```bash
npm run dev
```
Frontend runs on `http://localhost:5173`

### 3. Access Login
```
http://localhost:5173/login
```

### 4. Enter Admin Password
From `backend/.env` - `ADMIN_PASSWORD` value

### 5. You're In!
Dashboard will load and fetch files.

## 🎨 UI/UX Features

### Login Page
- Gradient background
- Centered login card
- Password input
- Error messages
- Loading state during submission

### Dashboard
- Top header with logout button
- Filter dropdown by language
- Total file count
- Create new file button
- Files displayed in responsive grid
- Pagination controls
- Delete buttons with confirmation

### File Cards
- Clean card design with hover effect
- Language badge
- File name, path, description
- Tags display
- Creation date
- Delete button

### Create File Modal
- Modal overlay
- Form validation
- All fields required
- Success/error notifications
- Cancel and submit buttons

## 📱 Responsive Design

**Desktop** (1200px+)
- 3-column grid

**Tablet** (768px - 1200px)
- 2-column grid

**Mobile** (<768px)
- 1-column grid
- Stacked buttons
- Full-width inputs

## ✅ Production Ready

✅ Error handling for all scenarios
✅ Loading states prevent duplicate submissions
✅ Token validation on all routes
✅ CORS properly configured
✅ Input validation on forms
✅ User-friendly error messages
✅ Responsive design tested
✅ Clean, maintainable code
✅ Functional components with hooks
✅ No deprecated patterns

## 🔧 Configuration

### Backend URL
Edit `src/api/api.js` if backend is on different URL:
```javascript
const BASE_URL = 'http://localhost:5000/api';
```

### Token Storage
Currently uses localStorage. To use sessionStorage instead:
```javascript
// Change in LoginPage.tsx
sessionStorage.setItem('token', response.token);

// Change in DashboardPage.tsx
const token = sessionStorage.getItem('token');
```

## 🐛 Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| "Cannot reach backend" | Verify backend runs on port 5000 |
| "Unauthorized error" | Re-login, token may have expired |
| "Form won't submit" | Check all required fields are filled |
| "Files not loading" | Check token is valid, backend is running |
| "Delete not working" | Token may be expired, try login again |

## 📚 File Locations Summary

```
src/
├── api/
│   └── api.js                         (API utility - 230+ lines)
├── components/
│   ├── Auth/
│   │   ├── LoginPage.tsx              (Login component - 80 lines)
│   │   └── LoginPage.css              (200+ lines styling)
│   ├── Dashboard/
│   │   ├── DashboardPage.tsx          (Dashboard - 240 lines)
│   │   ├── DashboardPage.css          (400+ lines styling)
│   │   ├── CreateFileForm.tsx         (Form component - 200 lines)
│   │   └── CreateFileForm.css         (250+ lines styling)
│   └── App/
│       └── App.tsx                    (UPDATED routing)
```

## 🔄 Data Flow

```
User visits /login
    ↓
Enters password & clicks Login
    ↓
POST /api/auth/login (fetch)
    ↓
Backend validates password
    ↓
Returns JWT token
    ↓
Token stored in localStorage
    ↓
Redirect to /dashboard
    ↓
useEffect fires, gets token from localStorage
    ↓
GET /api/files with token in header
    ↓
Files displayed in grid
    ↓
User clicks "Create New File"
    ↓
Modal form appears
    ↓
Fills form & submits
    ↓
POST /api/files with token & file data
    ↓
File created, list refreshes
```

## 🎓 Learning Resources

- React Hooks: useState, useEffect, useNavigate
- Fetch API: GET, POST, PUT, DELETE
- localStorage: persist data in browser
- React Router: routing & navigation
- CSS Grid: responsive layouts

---

**Status**: ✅ Complete & Production Ready
**Stack**: React 18 + Vite + React Router v6
**Test**: http://localhost:5173/login
