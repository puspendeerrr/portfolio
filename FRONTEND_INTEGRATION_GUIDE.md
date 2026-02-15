# Frontend Integration Guide

Complete guide to integrate the Code Library backend with your React + Vite frontend.

## 📋 Table of Contents

- [Setup Steps](#setup-steps)
- [Axios Configuration](#axios-configuration)
- [Authentication Flow](#authentication-flow)
- [Protected Routes](#protected-routes)
- [Admin Components](#admin-components)
- [Code Viewer Components](#code-viewer-components)
- [Styling & UX](#styling--ux)
- [Best Practices](#best-practices)

## 🚀 Setup Steps

### 1. Install Required Dependencies

```bash
cd src
npm install axios prismjs react-icons
```

**What Each Package Does:**
- **axios**: HTTP client for API requests
- **prismjs**: Syntax highlighting for code
- **react-icons**: Icons for UI components

Optional (for advanced features):
```bash
npm install react-toastify react-modal zustand
```

### 2. Create API Service Layer

Create file: `src/services/api.js`

```javascript
import axios from 'axios';

// Base API instance
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle responses
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // Handle token expiration
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error.response?.data || error);
  }
);

export default api;
```

Create .env file in root:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### 3. Create Auth Service

Create file: `src/services/authService.js`

```javascript
import api from './api';

/**
 * Authentication service for login and token management
 */
const authService = {
  /**
   * Login with admin password
   * @param {string} password - Admin password
   * @returns {Promise} Token and user info
   */
  login: async (password) => {
    const response = await api.post('/auth/login', { password });
    if (response.data?.token) {
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('tokenExpires', response.data.expiresIn);
    }
    return response;
  },

  /**
   * Verify if token is still valid
   * @returns {Promise} User verification status
   */
  verifyToken: async () => {
    try {
      const response = await api.get('/auth/verify');
      return response;
    } catch (error) {
      localStorage.removeItem('authToken');
      throw error;
    }
  },

  /**
   * Logout - clear token
   */
  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('tokenExpires');
  },

  /**
   * Check if user is authenticated
   * @returns {boolean}
   */
  isAuthenticated: () => {
    return !!localStorage.getItem('authToken');
  }
};

export default authService;
```

### 4. Create Files Service

Create file: `src/services/filesService.js`

```javascript
import api from './api';

/**
 * File management service for CRUD operations
 */
const filesService = {
  /**
   * Get all code files with pagination and filtering
   * @param {Object} params - { language, sortBy, order, limit, page }
   */
  getFiles: async (params = {}) => {
    const response = await api.get('/files', { params });
    return response.data;
  },

  /**
   * Get single file by ID (includes code content)
   * @param {string} id - File ID
   */
  getFileById: async (id) => {
    const response = await api.get(`/files/${id}`);
    return response.data;
  },

  /**
   * Create new code file
   * @param {Object} fileData - File object with all required fields
   */
  createFile: async (fileData) => {
    const response = await api.post('/files', fileData);
    return response.data;
  },

  /**
   * Update existing code file
   * @param {string} id - File ID
   * @param {Object} updates - Fields to update
   */
  updateFile: async (id, updates) => {
    const response = await api.put(`/files/${id}`, updates);
    return response.data;
  },

  /**
   * Delete code file
   * @param {string} id - File ID
   */
  deleteFile: async (id) => {
    const response = await api.delete(`/files/${id}`);
    return response.data;
  },

  /**
   * Get file statistics
   */
  getStats: async () => {
    const response = await api.get('/files/stats/overview');
    return response.data;
  }
};

export default filesService;
```

## 🔐 Authentication Flow

### Login Component

Create file: `src/components/Admin/AdminLogin/AdminLoginPage.tsx`

```typescript
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../../services/authService';
import './AdminLoginPage.css';

const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await authService.login(password);
      navigate('/admin/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-container">
      <div className="login-card">
        <h1>Admin Login</h1>
        <p className="subtitle">Enter your password to access the code library</p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              disabled={loading}
            />
          </div>

          <button type="submit" disabled={loading} className="btn-login">
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginPage;
```

### CSS for Login

Create file: `src/components/Admin/AdminLogin/AdminLoginPage.css`

```css
.admin-login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.login-card {
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 400px;
}

.login-card h1 {
  margin: 0 0 10px 0;
  color: #333;
  font-size: 28px;
}

.login-card .subtitle {
  color: #666;
  margin-bottom: 30px;
  font-size: 14px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #333;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.3s;
}

.form-group input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-group input:disabled {
  background: #f5f5f5;
  cursor: not-allowed;
}

.btn-login {
  width: 100%;
  padding: 12px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-login:hover:not(:disabled) {
  background: #5568d3;
}

.btn-login:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error-message {
  background: #fee;
  color: #c33;
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 20px;
  font-size: 14px;
}
```

## 🛡️ Protected Routes

Create file: `src/components/Admin/ProtectedRoute.tsx`

```typescript
import React from 'react';
import { Navigate } from 'react-router-dom';
import authService from '../../services/authService';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  if (!authService.isAuthenticated()) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
```

Add to your routing (e.g., in App.tsx):

```typescript
import ProtectedRoute from './components/Admin/ProtectedRoute';
import AdminLoginPage from './components/Admin/AdminLogin/AdminLoginPage';
import AdminDashboard from './components/Admin/Dashboard/AdminDashboard';

// In your router:
<Routes>
  {/* Public routes */}
  <Route path="/admin/login" element={<AdminLoginPage />} />
  
  {/* Protected routes */}
  <Route
    path="/admin/dashboard"
    element={
      <ProtectedRoute>
        <AdminDashboard />
      </ProtectedRoute>
    }
  />
</Routes>
```

## 📊 Admin Dashboard Component

Create file: `src/components/Admin/Dashboard/AdminDashboard.tsx`

```typescript
import React, { useState, useEffect } from 'react';
import filesService from '../../../services/filesService';
import FileUploadForm from '../FileUpload/FileUploadForm';
import FileList from '../FileList/FileList';
import './AdminDashboard.css';

interface Stats {
  totalFiles: number;
  byLanguage: Array<{ _id: string; count: number }>;
  byFolder: Array<{ _id: string; count: number }>;
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [activeTab, setActiveTab] = useState<'upload' | 'files'>('upload');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await filesService.getStats();
      setStats(response.data);
    } catch (err: any) {
      setError(err.message || 'Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  const handleFileCreated = () => {
    loadStats(); // Refresh stats
    setActiveTab('files');
  };

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Code Library Admin Dashboard</h1>
        <p>Manage your code snippets and files</p>
      </div>

      {/* Statistics */}
      <div className="stats-container">
        {loading ? (
          <p>Loading statistics...</p>
        ) : stats ? (
          <>
            <div className="stat-card">
              <h3>{stats.totalFiles}</h3>
              <p>Total Files</p>
            </div>
            <div className="stat-card">
              <h3>{stats.byLanguage.length}</h3>
              <p>Languages Used</p>
            </div>
            <div className="stat-card">
              <h3>{stats.byFolder.length}</h3>
              <p>Folders</p>
            </div>
          </>
        ) : null}
        {error && <div className="stat-error">{error}</div>}
      </div>

      {/* Tabs */}
      <div className="dashboard-tabs">
        <button
          className={`tab ${activeTab === 'upload' ? 'active' : ''}`}
          onClick={() => setActiveTab('upload')}
        >
          Upload New File
        </button>
        <button
          className={`tab ${activeTab === 'files' ? 'active' : ''}`}
          onClick={() => setActiveTab('files')}
        >
          Manage Files
        </button>
      </div>

      {/* Content */}
      <div className="dashboard-content">
        {activeTab === 'upload' && <FileUploadForm onSuccess={handleFileCreated} />}
        {activeTab === 'files' && <FileList />}
      </div>
    </div>
  );
};

export default AdminDashboard;
```

## 📝 File Upload Form Component

Create file: `src/components/Admin/FileUpload/FileUploadForm.tsx`

```typescript
import React, { useState } from 'react';
import filesService from '../../../services/filesService';
import './FileUploadForm.css';

interface FileUploadFormProps {
  onSuccess: () => void;
}

const FileUploadForm: React.FC<FileUploadFormProps> = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    fileName: '',
    folderPath: '',
    language: 'typescript',
    description: '',
    codeContent: '',
    tags: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const languages = [
    'javascript',
    'typescript',
    'python',
    'cpp',
    'java',
    'csharp',
    'php',
    'ruby',
    'go',
    'rust',
    'sql',
    'html',
    'css',
    'json',
    'xml',
    'yaml',
    'markdown'
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const tags = formData.tags
        .split(',')
        .map(t => t.trim())
        .filter(t => t.length > 0);

      await filesService.createFile({
        ...formData,
        tags
      });

      setSuccess('File uploaded successfully!');
      setFormData({
        fileName: '',
        folderPath: '',
        language: 'typescript',
        description: '',
        codeContent: '',
        tags: ''
      });

      setTimeout(() => {
        onSuccess();
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Failed to upload file');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="upload-form" onSubmit={handleSubmit}>
      <h2>Upload New Code File</h2>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="form-row">
        <div className="form-group">
          <label>File Name *</label>
          <input
            type="text"
            name="fileName"
            value={formData.fileName}
            onChange={handleChange}
            placeholder="e.g., App.tsx"
            required
            maxLength={100}
          />
        </div>

        <div className="form-group">
          <label>Language *</label>
          <select
            name="language"
            value={formData.language}
            onChange={handleChange}
            required
          >
            {languages.map(lang => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-group">
        <label>Folder Path *</label>
        <input
          type="text"
          name="folderPath"
          value={formData.folderPath}
          onChange={handleChange}
          placeholder="e.g., src/components/App"
          required
          maxLength={500}
        />
      </div>

      <div className="form-group">
        <label>Description *</label>
        <input
          type="text"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe what this code does"
          required
          maxLength={1000}
        />
      </div>

      <div className="form-group">
        <label>Code Content *</label>
        <textarea
          name="codeContent"
          value={formData.codeContent}
          onChange={handleChange}
          placeholder="Paste your code here..."
          required
          rows={12}
        />
      </div>

      <div className="form-group">
        <label>Tags (comma-separated)</label>
        <input
          type="text"
          name="tags"
          value={formData.tags}
          onChange={handleChange}
          placeholder="e.g., react, hooks, components"
          maxLength={200}
        />
      </div>

      <button type="submit" disabled={loading} className="btn-submit">
        {loading ? 'Uploading...' : 'Upload File'}
      </button>
    </form>
  );
};

export default FileUploadForm;
```

## 🎨 Code Viewer Component with Syntax Highlighting

Create file: `src/components/CodeLibrary/CodeViewer/CodeViewer.tsx`

```typescript
import React, { useEffect } from 'react';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-json';
import './CodeViewer.css';

interface CodeViewerProps {
  code: string;
  language: string;
  fileName: string;
  folderPath: string;
  description: string;
  createdAt: string;
}

const CodeViewer: React.FC<CodeViewerProps> = ({
  code,
  language,
  fileName,
  folderPath,
  description,
  createdAt
}) => {
  useEffect(() => {
    Prism.highlightAll();
  }, [code, language]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    alert('Code copied to clipboard!');
  };

  return (
    <div className="code-viewer">
      <div className="code-header">
        <div>
          <h2>{fileName}</h2>
          <p className="folder-path">📁 {folderPath}</p>
          <p className="description">{description}</p>
          <p className="created-date">
            Created: {new Date(createdAt).toLocaleDateString()}
          </p>
        </div>
        <button onClick={copyToClipboard} className="btn-copy">
          📋 Copy Code
        </button>
      </div>

      <pre>
        <code className={`language-${language}`}>
          {code}
        </code>
      </pre>
    </div>
  );
};

export default CodeViewer;
```

### CSS for Code Viewer

Create file: `src/components/CodeLibrary/CodeViewer/CodeViewer.css`

```css
.code-viewer {
  background: #1e1e1e;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.code-header {
  background: #252526;
  padding: 20px;
  border-bottom: 1px solid #3e3e42;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
}

.code-header h2 {
  margin: 0 0 8px 0;
  color: #fff;
  font-size: 18px;
}

.folder-path {
  color: #858585;
  margin: 4px 0;
  font-size: 13px;
}

.description {
  color: #d7ba7d;
  margin: 8px 0 4px 0;
  font-size: 14px;
}

.created-date {
  color: #858585;
  margin: 4px 0;
  font-size: 12px;
}

.btn-copy {
  padding: 8px 16px;
  background: #0e639c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  white-space: nowrap;
  transition: background 0.3s;
}

.btn-copy:hover {
  background: #1177bb;
}

.code-viewer pre {
  margin: 0;
  padding: 20px;
  overflow-x: auto;
  background: #1e1e1e;
}

.code-viewer code {
  font-family: 'Cascadia Code', 'Courier New', monospace;
  font-size: 13px;
  line-height: 1.6;
  color: #d4d4d4;
}

/* Syntax highlighting colors */
.code-viewer .token.keyword {
  color: #569cd6;
}

.code-viewer .token.string {
  color: #ce9178;
}

.code-viewer .token.function {
  color: #dcdcaa;
}

.code-viewer .token.comment {
  color: #6a9955;
}

.code-viewer .token.number {
  color: #b5cea8;
}

.code-viewer .token.punctuation {
  color: #d4d4d4;
}
```

## 🗂️ Folder Tree Viewer Component

Create file: `src/components/CodeLibrary/FolderTree/FolderTree.tsx`

```typescript
import React, { useMemo } from 'react';
import './FolderTree.css';

interface CodeFile {
  _id: string;
  fileName: string;
  folderPath: string;
  language: string;
}

interface TreeNode {
  name: string;
  path: string;
  files: CodeFile[];
  children: Record<string, TreeNode>;
}

interface FolderTreeProps {
  files: CodeFile[];
  onSelectFile: (file: CodeFile) => void;
}

const FolderTree: React.FC<FolderTreeProps> = ({ files, onSelectFile }) => {
  const tree = useMemo(() => {
    const root: TreeNode = { name: 'root', path: '', files: [], children: {} };

    files.forEach(file => {
      const parts = file.folderPath.split('/').filter(p => p);
      let current = root;

      parts.forEach((part, index) => {
        if (!current.children[part]) {
          current.children[part] = {
            name: part,
            path: parts.slice(0, index + 1).join('/'),
            files: [],
            children: {}
          };
        }
        current = current.children[part];
      });

      current.files.push(file);
    });

    return root;
  }, [files]);

  const FolderIcon = () => <span>📁 </span>;
  const FileIcon = ({ language }: { language: string }) => {
    const icons: Record<string, string> = {
      typescript: '📘',
      javascript: '📙',
      python: '🐍',
      cpp: '⚙️',
      java: '☕',
      react: '⚛️'
    };
    return <span>{icons[language] || '📄'} </span>;
  };

  const renderNode = (node: TreeNode, expanded = true) => {
    return (
      <div key={node.path || 'root'} className="tree-node">
        {node.path && (
          <div className="tree-folder">
            <FolderIcon />
            {node.name}
          </div>
        )}

        <div className={`tree-children ${expanded ? 'expanded' : ''}`}>
          {/* Nested folders */}
          {Object.values(node.children).map(child => renderNode(child, false))}

          {/* Files in this folder */}
          {node.files.map(file => (
            <div
              key={file._id}
              className="tree-file"
              onClick={() => onSelectFile(file)}
            >
              <FileIcon language={file.language} />
              {file.fileName}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return <div className="folder-tree">{renderNode(tree)}</div>;
};

export default FolderTree;
```

### CSS for Folder Tree

Create file: `src/components/CodeLibrary/FolderTree/FolderTree.css`

```css
.folder-tree {
  background: white;
  border: 1px solid #e1e4e8;
  border-radius: 6px;
  padding: 12px;
  max-height: 600px;
  overflow-y: auto;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
  font-size: 12px;
}

.tree-node {
  margin-left: 0;
}

.tree-folder {
  padding: 6px 8px;
  cursor: pointer;
  user-select: none;
  border-radius: 4px;
  transition: background 0.2s;
  font-weight: 500;
  color: #24292e;
}

.tree-folder:hover {
  background: #f3f3f3;
}

.tree-children {
  margin-left: 12px;
  border-left: 1px solid #e1e4e8;
  padding-left: 0;
}

.tree-file {
  padding: 4px 8px;
  cursor: pointer;
  border-radius: 4px;
  transition: background 0.2s;
  color: #0366d6;
  display: flex;
  align-items: center;
  gap: 6px;
}

.tree-file:hover {
  background: #f3f3f3;
  color: #0278d7;
}

.tree-file span {
  display: inline;
}
```

## 🎯 Public Code Library Page

Create file: `src/components/CodeLibrary/CodeLibraryPage.tsx`

```typescript
import React, { useState, useEffect } from 'react';
import filesService from '../../services/filesService';
import CodeViewer from './CodeViewer/CodeViewer';
import FolderTree from './FolderTree/FolderTree';
import './CodeLibraryPage.css';

interface CodeFile {
  _id: string;
  fileName: string;
  folderPath: string;
  language: string;
  description: string;
  codeContent: string;
  createdAt: string;
}

const CodeLibraryPage: React.FC = () => {
  const [files, setFiles] = useState<CodeFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<CodeFile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterLanguage, setFilterLanguage] = useState('');

  useEffect(() => {
    loadFiles();
  }, [filterLanguage]);

  const loadFiles = async () => {
    setLoading(true);
    try {
      const params = filterLanguage ? { language: filterLanguage } : {};
      const response = await filesService.getFiles(params);
      setFiles(response.data);
      if (response.data.length > 0 && !selectedFile) {
        loadFileDetail(response.data[0]._id);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load files');
    } finally {
      setLoading(false);
    }
  };

  const loadFileDetail = async (id: string) => {
    try {
      const response = await filesService.getFileById(id);
      setSelectedFile(response.data);
    } catch (err: any) {
      setError(err.message || 'Failed to load file');
    }
  };

  const handleSelectFile = async (file: CodeFile) => {
    await loadFileDetail(file._id);
  };

  const languages = [...new Set(files.map(f => f.language))];

  return (
    <div className="code-library-page">
      <div className="library-header">
        <h1>Code Library</h1>
        <p>Browse and explore code snippets from my projects</p>
      </div>

      <div className="library-container">
        <div className="library-sidebar">
          <div className="filter-section">
            <label>Filter by Language</label>
            <select
              value={filterLanguage}
              onChange={(e) => setFilterLanguage(e.target.value)}
            >
              <option value="">All Languages</option>
              {languages.map(lang => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
          </div>

          {loading ? (
            <p>Loading files...</p>
          ) : error ? (
            <p className="error">{error}</p>
          ) : (
            <FolderTree files={files} onSelectFile={handleSelectFile} />
          )}
        </div>

        <div className="library-content">
          {selectedFile ? (
            <CodeViewer
              code={selectedFile.codeContent}
              language={selectedFile.language}
              fileName={selectedFile.fileName}
              folderPath={selectedFile.folderPath}
              description={selectedFile.description}
              createdAt={selectedFile.createdAt}
            />
          ) : (
            <div className="empty-state">
              <p>Select a file to view code</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CodeLibraryPage;
```

### CSS for Code Library Page

Create file: `src/components/CodeLibrary/CodeLibraryPage.css`

```css
.code-library-page {
  min-height: 100vh;
  background: #f5f5f5;
  padding: 40px 20px;
}

.library-header {
  text-align: center;
  margin-bottom: 40px;
}

.library-header h1 {
  font-size: 36px;
  font-weight: 700;
  margin: 0 0 10px 0;
  color: #333;
}

.library-header p {
  color: #666;
  font-size: 16px;
  margin: 0;
}

.library-container {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.library-sidebar {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  height: fit-content;
  position: sticky;
  top: 20px;
}

.filter-section {
  margin-bottom: 20px;
}

.filter-section label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #333;
  font-size: 13px;
}

.filter-section select {
  width: 100%;
  padding: 8px;
  border: 1px solid #e1e4e8;
  border-radius: 6px;
  font-size: 13px;
  color: #24292e;
}

.library-content {
  min-height: 400px;
}

.empty-state {
  background: white;
  padding: 60px 20px;
  border-radius: 8px;
  text-align: center;
  color: #666;
}

@media (max-width: 768px) {
  .library-container {
    grid-template-columns: 1fr;
  }

  .library-sidebar {
    position: static;
  }

  .library-header h1 {
    font-size: 28px;
  }
}
```

## 🎭 Best Practices

### 1. Error Handling

```typescript
// Always wrap API calls in try-catch
try {
  const files = await filesService.getFiles();
} catch (error: any) {
  console.error('Error:', error);
  setError(error.message || 'Something went wrong');
}
```

### 2. Token Management

```typescript
// Axios interceptor handles token automatically
// But check token expiration
const checkTokenExpiration = () => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    navigate('/admin/login');
  }
};
```

### 3. State Management

Consider using Zustand for global state:

```typescript
// store/authStore.ts
import create from 'zustand';

export const useAuthStore = create((set) => ({
  token: localStorage.getItem('authToken'),
  login: (token) => set({ token }),
  logout: () => {
    localStorage.removeItem('authToken');
    set({ token: null });
  }
}));
```

### 4. Loading States

Always show loading indicators:

```typescript
{loading ? (
  <Spinner />
) : error ? (
  <ErrorMessage message={error} />
) : (
  <Content />
)}
```

### 5. Performance

- Use `React.memo` for file list items
- Implement infinite scroll for large file lists
- Cache file details locally

## 🔗 Integration Checklist

- [ ] Install dependencies (axios, prismjs)
- [ ] Create .env with VITE_API_BASE_URL
- [ ] Create API service (api.js)
- [ ] Create auth service
- [ ] Create files service
- [ ] Create login page
- [ ] Create protected route wrapper
- [ ] Create admin dashboard
- [ ] Create file upload form
- [ ] Create code viewer
- [ ] Create folder tree
- [ ] Create public code library page
- [ ] Update app routing
- [ ] Test login flow
- [ ] Test file operations
- [ ] Test code syntax highlighting

## 📚 Additional Resources

- [Prism.js Documentation](https://prismjs.com/)
- [Axios Documentation](https://axios-http.com/)
- [React Router v6](https://reactrouter.com/)

---

**Your frontend is now ready to connect with the backend!**
