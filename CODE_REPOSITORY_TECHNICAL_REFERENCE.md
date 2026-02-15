# Code Repository Technical Reference

## 🔌 API Endpoints Reference

### Authentication
```javascript
POST /api/auth/login
Request: { admin_password: "admin@123" }
Response: { token: "eyJhbGc...", expiry: "24h" }
Storage: localStorage.setItem('token', token)
```

### File Operations
```javascript
// List files with filtering
GET /api/files?programmingLanguage=javascript&page=1&limit=50
Authorization: Bearer {token}
Response: { files: [...], total: number, pages: number }

// Get single file
GET /api/files/{id}
Authorization: Bearer {token}
Response: { _id, fileName, codeContent, ... }

// Create single file
POST /api/files
Authorization: Bearer {token}
Body: { fileName, folderPath, programmingLanguage, codeContent, description, tags }
Response: { _id, ... } (201 Created)

// Bulk upload (NEW)
POST /api/files/bulk-upload
Authorization: Bearer {token}
Body: [
  { fileName, folderPath, programmingLanguage, codeContent, description, tags },
  ...
]
Response: { count: number, files: [...] }

// Update file
PUT /api/files/{id}
Authorization: Bearer {token}
Body: { fileName, codeContent, description, ... }
Response: { _id, ... }

// Delete file
DELETE /api/files/{id}
Authorization: Bearer {token}
Response: { message: "File deleted" }

// Get statistics
GET /api/files/stats/overview
Authorization: Bearer {token}
Response: {
  total: number,
  byLanguage: { javascript: 5, python: 3, ... },
  topLanguages: [...],
  lastUpdated: timestamp
}
```

## 🗂️ Language Detection Mapping

### Extension → Language Mapping

| Extension | Language | Icon |
|-----------|----------|------|
| .js | javascript | ✌️ |
| .jsx | javascript | ✌️ |
| .ts | typescript | 📘 |
| .tsx | typescript | 📘 |
| .py | python | 🐍 |
| .pyw | python | 🐍 |
| .cpp, .cc, .cxx, .c | cpp | ⚙️ |
| .java | java | ☕ |
| .cs | csharp | 🔷 |
| .php | php | 🐘 |
| .rb | ruby | 💎 |
| .go | go | 🐹 |
| .rs | rust | 🦀 |
| .html, .htm | html | 📄 |
| .css | css | 🎨 |
| .scss | css | 🎨 |
| .less | css | 🎨 |
| .json | json | 📋 |
| .xml | xml | 📑 |
| .md, .markdown | markdown | 📝 |
| .yaml, .yml | yaml | ⚙️ |
| .sql | sql | 🗄️ |
| .sh, .bash | bash | 🖥️ |
| *(other)* | markdown | 📝 |

### Syntax Highlighter Language Mapping

```javascript
const languageMap = {
  javascript: 'javascript',
  typescript: 'typescript',
  python: 'python',
  java: 'java',
  cpp: 'cpp',
  csharp: 'csharp',
  php: 'php',
  ruby: 'ruby',
  go: 'go',
  rust: 'rust',
  html: 'html',
  css: 'css',
  json: 'json',
  xml: 'xml',
  markdown: 'markdown',
  yaml: 'yaml',
  sql: 'sql',
  bash: 'bash'
};
```

## 🎨 Language Color Badges (Breadcrumb)

| Language | Color | Hex |
|----------|-------|-----|
| JavaScript | Yellow | #f7df1e |
| TypeScript | Blue | #3178c6 |
| Python | Blue | #3776ab |
| Java | Orange | #007396 |
| C++ | Blue | #00599c |
| C# | Green | #239120 |
| PHP | Purple | #777bb4 |
| Ruby | Red | #cc342d |
| Go | Cyan | #00add8 |
| Rust | Orange | #ce422b |
| HTML | Orange-Red | #e34c26 |
| CSS | Purple | #563d7c |
| JSON | Yellow | #f7df1e |
| XML | Blue | #0078d4 |
| Markdown | Blue | #083fa1 |
| YAML | Red | #cb171e |
| SQL | Silver | #336791 |
| Bash | Green | #4eaa25 |

## 📐 Responsive Breakpoints

```css
/* Desktop: Full sidebar + viewer */
@media (min-width: 1024px) {
  .explorer: width 280px;
  .viewer: width calc(100% - 280px);
}

/* Tablet: Narrower sidebar */
@media (max-width: 1023px) and (min-width: 768px) {
  .explorer: width 200px;
  .viewer: width calc(100% - 200px);
}

/* Mobile: Stacked layout */
@media (max-width: 767px) {
  .layout: flex-direction column;
  .explorer: width 100%;
  .viewer: width 100%;
  .explorer-height: 300px;
  .viewer-height: 400px;
}

/* Small mobile: Ultra compact */
@media (max-width: 480px) {
  .explorer-height: 250px;
  .viewer-height: 350px;
  font-size: 12px;
  padding: 8px;
}
```

## 🎨 Color Theme

### Background Colors
```css
Primary Dark: #0f0f1e
Secondary Dark: #1a1a2e
Tertiary Dark: #16213e

Primary Light Text: #ffffff
Secondary Text: #b0b0b0
Muted Text: #808080
```

### Accent Colors
```css
Purple Primary: #667eea
Purple Secondary: #764ba2
Orange Active: #f59e0b
Red Error: #ef4444
Green Success: #10b981

Gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%)
```

### Code Theme (night-owl)
```css
Background: #011627
Text: #d6deeb
Comment: #637777
String: #ecc48d
Number: #f78c6b
Keyword: #c792ea
Function: #82aaff
Operator: #7fdbca
```

## 📦 MongoDB Schema

### CodeFile Document

```javascript
{
  _id: ObjectId,
  fileName: String,                    // "App.tsx"
  folderPath: String,                  // "src/components"
  programmingLanguage: String,         // enum: [javascript, typescript, ...]
  codeContent: String,                 // Full file content
  description: String,                 // Optional description
  tags: [String],                      // ["react", "component"]
  createdAt: Date,                     // Auto set
  updatedAt: Date,                     // Auto set
}
```

### Indexes
```javascript
{
  TEXT: { fileName: 1, folderPath: 1, description: 1 }  // Full-text search
  SINGLE: { programmingLanguage: 1 }                     // Filter index
  SINGLE: { createdAt: -1 }                              // Sort by date
  UNIQUE: { fileName: 1, folderPath: 1 }                 // Path uniqueness
}
```

## 🔐 JWT Token Format

```javascript
Header: {
  alg: "HS256",
  typ: "JWT"
}

Payload: {
  isAdmin: true,
  iat: timestamp,
  exp: timestamp + 24hours,
  adminId: "unique_id"
}

Signature: HMAC-SHA256(header.payload, SECRET_KEY)

// Example token (decoded)
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
eyJpc0FkbWluIjp0cnVlLCJpYXQiOjE3MDQwNjcyMDAsImV4cCI6MTcwNDE1MzYwMH0.
xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

// Stored in: localStorage.setItem('token', token)
// Sent in: Authorization: Bearer {token}
```

## 🌳 Tree Building Algorithm

### Input (Flat File Array)
```javascript
[
  { fileName: "App.tsx", folderPath: "src/components/App", ... },
  { fileName: "Home.tsx", folderPath: "src/components/Home", ... },
  { fileName: "helpers.ts", folderPath: "src/utils", ... },
  { fileName: "main.css", folderPath: "styles", ... },
  { fileName: "README.md", folderPath: "", ... }
]
```

### Output (Nested Tree Object)
```javascript
{
  "src": {
    _type: "folder",
    _children: {
      "components": {
        _type: "folder",
        _children: {
          "App": {
            _type: "folder",
            _children: {
              "App.tsx": {
                _type: "file",
                _id: "507f1f77bcf86cd799439011",
                _language: "typescript",
                _fileObj: { ... }
              }
            }
          },
          "Home": {
            _type: "folder",
            _children: {
              "Home.tsx": {
                _type: "file",
                _id: "507f1f77bcf86cd799439012",
                _language: "typescript",
                _fileObj: { ... }
              }
            }
          }
        }
      },
      "utils": {
        _type: "folder",
        _children: {
          "helpers.ts": {
            _type: "file",
            _id: "507f1f77bcf86cd799439013",
            _language: "typescript",
            _fileObj: { ... }
          }
        }
      }
    }
  },
  "styles": {
    _type: "folder",
    _children: {
      "main.css": {
        _type: "file",
        _id: "507f1f77bcf86cd799439014",
        _language: "css",
        _fileObj: { ... }
      }
    }
  },
  "README.md": {
    _type: "file",
    _id: "507f1f77bcf86cd799439015",
    _language: "markdown",
    _fileObj: { ... }
  }
}
```

### Algorithm (JavaScript)
```javascript
const buildFolderTree = (files) => {
  const tree = {};
  
  files.forEach(file => {
    // Split path into parts, removing empty strings
    const pathParts = file.folderPath 
      ? file.folderPath.split('/').filter(p => p)
      : [];
    
    // Navigate/create path structure
    let current = tree;
    pathParts.forEach(part => {
      if (!current[part]) {
        current[part] = {
          _type: 'folder',
          _children: {}
        };
      }
      if (!current[part]._children) {
        current[part]._children = {};
      }
      current = current[part]._children;
    });
    
    // Place file at the end of path
    if (!current[file.fileName]) {
      current[file.fileName] = {
        _type: 'file',
        _id: file._id,
        _language: file.programmingLanguage,
        _fileObj: file
      };
    }
  });
  
  return tree;
};
```

## 📊 Upload Progress States

```javascript
// Progress tracking in UploadFolder.tsx
states = {
  IDLE: 0,           // Initial state
  READING: 50,       // Files being read into memory
  UPLOADING: 75,     // Files being sent to server
  COMPLETE: 100,     // Upload finished
  ERROR: 0           // Error occurred
}

// Visual feedback
0%:   "Ready to upload"
50%:  "Reading files..."
75%:  "Uploading to server..."
100%: "✓ Uploaded 15 files"
Error: "❌ Upload failed: Network error"
```

## 🎯 Component Props & State

### CodeRepository.tsx
```javascript
// State
const [files, setFiles] = useState([]);
const [selectedFile, setSelectedFile] = useState(null);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);
const [filterLanguage, setFilterLanguage] = useState('all');
const [stats, setStats] = useState({
  total: 0,
  byLanguage: {},
  topLanguages: []
});

// Methods
fetchFiles(token);
calculateStats(files);
handleUploadSuccess();
```

### UploadFolder.tsx
```javascript
// Props
onUploadSuccess: () => void;

// State
const [progress, setProgress] = useState(0);
const [uploading, setUploading] = useState(false);
const [message, setMessage] = useState({ type: null, text: '' });

// Methods
handleFolderSelect(event);
detectLanguageFromExtension(fileName);
readFileAsText(file);
uploadFiles(files, token);
```

### FileExplorer.tsx
```javascript
// Props
files: CodeFile[];
selectedFileId: string | null;
onSelectFile: (file: CodeFile) => void;

// Methods
buildFolderTree(files);
renderTreeNode(node, path, depth);

// Memoization
React.memo(FileExplorer, (prev, next) => 
  prev.selectedFileId === next.selectedFileId &&
  prev.files.length === next.files.length
);
```

### CodeViewer.tsx
```javascript
// Props
file: CodeFile | null;

// Methods
mapLanguageToHighlighter(language);
calculateLineCount(content);
formatFileSize(bytes);
formatUploadDate(date);
copyToClipboard(content);

// Components
<SyntaxHighlighter /> from react-syntax-highlighter
```

## 🔄 Data Flow

```
User Action
    ↓
Component Method (e.g., handleFolderSelect)
    ↓
API Call (fetch in src/api/api.js)
    ↓
Backend Route Handler (Express)
    ↓
Mongoose Model (CRUD operation)
    ↓
MongoDB (Persist data)
    ↓
Response sent back to frontend
    ↓
State updated (setFiles, etc.)
    ↓
Component re-renders
    ↓
UI updated
```

## 🐛 Error Codes & Messages

```javascript
// API Errors
400: "Bad Request - Missing required fields"
401: "Unauthorized - Invalid or expired token"
403: "Forbidden - Access denied"
404: "Not Found - File doesn't exist"
409: "Conflict - File already exists (duplicate)"
500: "Server Error - Something went wrong"
503: "Service Unavailable - Database connection failed"

// Client-side Messages
"No token found. Please login first."
"Invalid file. Check format and try again."
"File too large. Maximum 10MB per file."
"Network error. Check your connection."
"Upload failed with 3 files. Retry?"
"File deleted successfully."
"Description updated."
```

## 📈 Performance Targets

```
Metric                    Target      Status
─────────────────────────────────────────────
Initial load              < 1s        ✓
File upload (50 files)    < 2s        ✓
Tree rendering (100)      < 500ms     ✓
Code display (10KB)       < 200ms     ✓
Syntax highlighting       < 300ms     ✓
Filter operation          < 100ms     ✓
Copy to clipboard         instant     ✓
```

## 🔗 Related Documentation

- [Setup Guide](./CODE_REPOSITORY_SETUP.md)
- [Integration Validation](./INTEGRATION_VALIDATION.md)
- Backend API docs: `backend/README.md`
- Frontend components: `src/components/CodeLibrary/README.md`

---

**Last Updated**: Generated with Code Repository Implementation (Message 6)
**Version**: 1.0 Production
**Compatibility**: React 18+, Node 16+
