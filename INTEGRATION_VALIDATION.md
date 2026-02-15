# Code Repository Integration & Validation Guide

## ✅ Pre-Integration Checklist

Before integrating CodeRepository into your portfolio, verify these components exist:

### Backend Files Check

**✓ Backend Routes** - `backend/routes/filesRoutes.js`
Should contain these endpoints:
- `GET /api/files` - List files with filtering
- `POST /api/files` - Create single file
- `PUT /api/files/:id` - Update file
- `DELETE /api/files/:id` - Delete file
- `GET /api/files/:id` - Get file by ID
- `POST /api/files/bulk-upload` - NEW: Bulk upload route
- `GET /api/files/stats/overview` - Get statistics

**✓ MongoDB Model** - `backend/models/CodeFile.js`
Should have schema field:
```javascript
programmingLanguage: { type: String, required: true, enum: [...] }
```

**✓ Auth Middleware** - `backend/middleware/authMiddleware.js`
Should validate JWT tokens on protected routes

### Frontend Files Check

**✓ API Utility** - `src/api/api.js`
Must export these functions:
```javascript
export const login = async (admin_password) => {...}
export const getFiles = async (token, params) => {...}
export const getFileById = async (token, fileId) => {...}
export const createFile = async (token, fileData) => {...}
export const updateFile = async (token, fileId, fileData) => {...}
export const deleteFile = async (token, fileId) => {...}
export const getFileStats = async (token) => {...}
export const bulkUploadFiles = async (token, files) => {...}
```

**✓ New Components** - `src/components/CodeLibrary/`
Should have:
- `CodeRepository.tsx` - Main container
- `CodeRepository.css` - Styling
- `UploadFolder.tsx` - Upload component
- `UploadFolder.css` - Upload styling
- `FileExplorer.tsx` - Tree explorer
- `FileExplorer.css` - Explorer styling
- `CodeViewer.tsx` - Code display
- `CodeViewer.css` - Viewer styling
- `Breadcrumb.tsx` - Navigation
- `Breadcrumb.css` - Breadcrumb styling

## 🔧 Integration Step-by-Step

### Step 1: Install Dependencies

```bash
cd e:\Portfolio
npm install react-syntax-highlighter
```

Verify installation:
```bash
npm list react-syntax-highlighter
```

### Step 2: Verify Backend Running

Before testing, ensure backend is running:

```bash
cd e:\Portfolio\backend
npm start
```

Should see:
```
✓ Server running on port 5000
✓ MongoDB connected to: mongodb://...
✓ Routes initialized
```

### Step 3: Update CodeLibraryPage

**File**: `src/components/CodeLibrary/CodeLibraryPage.tsx`

Find the existing component and update the import section:

```tsx
import React from "react";
import { CodeLibraryIntroSection } from "./Intro/CodeLibraryIntroSection";
import { CodeLibraryEntriesSection } from "./Entries/CodeLibraryEntriesSection";
import { Disclaimer } from "../Shared/Disclaimer/Disclaimer";
import CodeRepository from "./CodeRepository";  // ADD THIS LINE
import "./CodeLibraryPage.css";

export const CodeLibraryPage: React.FC = () => {
  return (
    <div className="code-library-page">
      {/* Existing sections */}
      <CodeLibraryIntroSection />
      
      {/* ADD NEW REPOSITORY SECTION */}
      <div className="repository-section">
        <CodeRepository />
      </div>
      
      {/* Keep existing sections */}
      <CodeLibraryEntriesSection />
      <Disclaimer />
    </div>
  );
};
```

### Step 4: Add CSS for Repository Section

**File**: `src/components/CodeLibrary/CodeLibraryPage.css`

Append this to the file:

```css
/* Code Repository Section */
.repository-section {
  width: 100%;
  margin: 40px auto;
  padding: 0 20px;
  max-width: 100%;
}

@media (max-width: 1024px) {
  .repository-section {
    padding: 0 15px;
  }
}

@media (max-width: 768px) {
  .repository-section {
    padding: 0 10px;
    margin: 20px auto;
  }
}

@media (max-width: 480px) {
  .repository-section {
    padding: 0 8px;
    margin: 15px auto;
  }
}
```

### Step 5: Test the Integration

1. Start your dev server:
```bash
npm run dev
```

2. In browser, go to: `http://localhost:5173/code-library`

3. You should see:
   - Code Library intro section
   - CODE REPOSITORY section with upload button
   - Existing Code Library entries
   - Disclaimer

4. Test upload:
   - Click "Upload Folder" button
   - Select any folder
   - See progress indicator
   - Files should appear in explorer

## 🧪 Testing Scenarios

### Test 1: Authentication
```
1. Browse to /code-library
2. No files showing? → Need to login first
3. Click upload → Should redirect to /login
4. Login with password: admin@123
5. Token stored in localStorage
6. Return to /code-library → Files load
```

### Test 2: Folder Upload
```
1. Create test folder:
   testfolder/
   ├── main.js (console.log('hello'))
   ├── styles.css (body { color: red; })
   └── README.md (# Test)

2. Click "Upload Folder"
3. Select testfolder
4. See progress: 0% → 50% → 75% → 100%
5. See success message: "Uploaded 3 files"
6. Each file appears in explorer
7. Click each file to view code
8. Syntax highlighting works
9. Copy button works
```

### Test 3: File Filtering
```
1. Upload multiple files
2. Filter dropdown shows: "All Languages", "JavaScript", "Python", etc.
3. Select "JavaScript"
4. Only .js files shown
5. Select "All" → All files shown
6. Statistics update correctly
```

### Test 4: Responsive Design
```
Desktop (1024px+):
- Explorer: 280px wide on left
- Viewer: Takes remaining space
- Side-by-side layout

Tablet (768px - 1024px):
- Explorer: 200px wide
- Responsive grid in explorer

Mobile (480px - 768px):
- Stacked layout (explorer above viewer)
- Full width

Phone (<480px):
- Stacked, further reduced fonts
- Touch-friendly buttons
```

### Test 5: Token Expiration
```
1. Open DevTools → Application → localStorage
2. Find "token" and manually delete it
3. Refresh page
4. Should see error: "No token found"
5. Should redirect to /login
```

### Test 6: Error Handling
```
Backend not running:
- Upload should show error
- Should NOT crash UI
- Error message should be readable

Network error during upload:
- Should show retry message
- Progress should reset
- Files should not partially upload

Invalid language detection:
- Unknown file extension → defaults to markdown
- No syntax highlighting but shows raw code
```

## 📊 Component Integration Diagram

```
CodeLibraryPage
├── CodeLibraryIntroSection (existing)
├── CodeRepository (NEW)
│   ├── CodeRepository.tsx (main container)
│   ├── UploadFolder.tsx (upload interface)
│   ├── FileExplorer.tsx (left panel - file tree)
│   ├── CodeViewer.tsx (right panel - code display)
│   └── Breadcrumb.tsx (navigation bar)
├── CodeLibraryEntriesSection (existing)
└── Disclaimer (existing)

Plus CSS files:
├── CodeRepository.css
├── UploadFolder.css
├── FileExplorer.css
├── CodeViewer.css
└── Breadcrumb.css
```

## 🔍 Debugging Tips

### Files not showing after upload
**Check:**
1. Backend running? `curl http://localhost:5000/api/files -H "Authorization: Bearer token"`
2. Token valid? Check localStorage
3. MongoDB connected? Check backend console
4. Any error in browser console? F12 → Console tab

### Code not highlighting
**Check:**
1. `react-syntax-highlighter` installed? `npm list react-syntax-highlighter`
2. File language detected? Check Breadcrumb language badge
3. Correct language string sent? Check browser network tab
4. Browser cache? Clear cache or hard refresh (Ctrl+Shift+R)

### Upload progress stuck
**Check:**
1. File size? Small test files first
2. Network connection? Check network tab
3. Backend timeout? Check backend logs
4. Browser console errors?

### Folder structure not correct
**Check:**
1. Files have folderPath? Check MongoDB
   ```
   db.codefiles.findOne({})  // Check folderPath field
   ```
2. Path format correct? Should be: `src/components/App`
3. FileExplorer algorithm? Can manually test buildFolderTree()

### Responsive not working
**Check:**
1. View source? Media queries present in CSS
2. Browser zoom at 100%
3. Clear browser cache
4. Resize browser slowly (watch for breakpoints)

## 📈 Performance Monitoring

Check performance with DevTools:

1. **Open DevTools** → Performance tab
2. **Record** → Upload folder → Stop
3. **Check key metrics:**
   - File upload: < 2s for 50 files
   - Tree rendering: < 500ms for 100 files
   - Code display: < 200ms for 10KB file
   - Syntax highlighting: < 300ms for large files

## 🎯 Success Criteria

You'll know everything is working when:

✅ Upload button visible on Code Library page
✅ Can select and upload a folder
✅ Files appear in tree explorer
✅ Clicking files shows code with syntax highlighting
✅ Filter dropdown works
✅ Statistics update after upload
✅ Breadcrumb shows file path
✅ Copy button works
✅ Layout responsive at different widths
✅ No console errors
✅ Token validation works
✅ Auto-logout on invalid token

## 🚀 Deployment Checklist

Before deploying to production:

- [ ] All components created and imported
- [ ] `react-syntax-highlighter` installed
- [ ] Backend running with no errors
- [ ] MongoDB connection string correct
- [ ] JWT token mechanism working
- [ ] Folder upload tested with large folder
- [ ] Mobile responsiveness verified
- [ ] All error states tested
- [ ] Copy button working
- [ ] Filter/search working
- [ ] Statistics displaying correctly
- [ ] Performance acceptable (< 3s for 100 files)

## 📝 Common File Paths

Reference these paths when debugging:

```
Backend:
- Routes: e:\Portfolio\backend\routes\filesRoutes.js
- Models: e:\Portfolio\backend\models\CodeFile.js
- Server: e:\Portfolio\backend\server.js
- Config: e:\Portfolio\backend\config\database.js

Frontend:
- API: e:\Portfolio\src\api\api.js
- Components: e:\Portfolio\src\components\CodeLibrary\
- Main Page: e:\Portfolio\src\components\CodeLibrary\CodeLibraryPage.tsx
- App Router: e:\Portfolio\src\components\App\App.tsx

Config:
- package.json: e:\Portfolio\package.json
- tsconfig.json: e:\Portfolio\tsconfig.json
- vite.config.ts: e:\Portfolio\vite.config.ts
```

## 💡 Pro Tips

1. **Large Folders**: Test upload with folder containing 50+ files first
2. **File Formats**: Mix different file types (js, ts, py, css, markup) to test language detection
3. **Nested Folders**: Use 3-4 level deep folder structure to test path handling
4. **Token Storage**: Token auto-expires after 24 hours (check backend JWT config)
5. **Bulk Operations**: Backend supports up to 1000 files per upload, use for max 500 for safety

---

**Status**: Ready for Integration
**Expected Time**: 15-20 minutes
**Difficulty**: Easy
**Backend Dependency**: ✓ Required
**Database Dependency**: ✓ Required
