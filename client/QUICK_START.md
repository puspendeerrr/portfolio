# Quick Start Guide - Using the Refactored Structure

## For Developers: Getting Started

### 1. **Understanding the New Structure**

```
src/
├── components/        ← Reusable UI components (no page logic)
├── services/api/      ← Centralized API calls
├── hooks/             ← Custom React hooks (reusable logic)
├── utils/             ← Utility functions (string, validation, storage)
├── constants/         ← Application constants
├── pages/             ← Future: page-level components
├── types/             ← TypeScript type definitions
├── theme/             ← Theme configuration
└── main.tsx           ← Entry point
```

### 2. **Making API Calls (New Way)**

#### Before:
```typescript
import { getFiles, deleteFile } from '../../api/api';

const response = await getFiles(token, params);
```

#### After:
```typescript
import { filesService } from '../../services/api';

const response = await filesService.getAllAdmin(token, params);
```

**Available Services:**
- `authService.login(password)`
- `filesService.getAll()`, `filesService.getAllAdmin()`, `filesService.create()`, etc.
- `projectsService.getAll()`, `projectsService.create()`, etc.
- `heroSlidesService.getAll()`, `heroSlidesService.create()`, etc.

### 3. **Using Custom Hooks**

#### Authentication
```typescript
import { useAuth, useToken } from '../../hooks';

const MyComponent = () => {
  const { login, logout } = useAuth();
  const token = useToken(); // null or token string
  
  return (
    <button onClick={logout}>Logout</button>
  );
};
```

#### Async State Management
```typescript
import { useAsyncState } from '../../hooks';

const MyComponent = () => {
  const asyncState = useAsyncState();
  
  const fetchData = async () => {
    asyncState.setLoading(true);
    try {
      // Do something
    } catch (err) {
      asyncState.setError(err.message);
    } finally {
      asyncState.setLoading(false);
    }
  };
  
  return (
    <>
      {asyncState.loading && <span>Loading...</span>}
      {asyncState.error && <span>Error: {asyncState.error}</span>}
    </>
  );
};
```

#### File Operations
```typescript
import { useFiles } from '../../hooks';

const FileManager = () => {
  const { files, loading, error, fetchFiles, deleteFile } = useFiles();
  const token = useToken();
  
  useEffect(() => {
    if (token) {
      fetchFiles(token, { programmingLanguage: 'javascript' });
    }
  }, [token]);
  
  return (
    <>
      {files.map(file => (
        <div key={file._id}>
          {file.fileName}
          <button onClick={() => deleteFile(token, file._id, file.fileName)}>
            Delete
          </button>
        </div>
      ))}
    </>
  );
};
```

### 4. **Using Utilities**

#### String Utilities
```typescript
import { capitalize, truncate, formatDate, slugify, isEmpty } from '../../utils';

capitalize('hello') // "Hello"
truncate('Long text here', 10) // "Long te..."
formatDate(new Date()) // "February 18, 2026"
slugify('My New Page') // "my-new-page"
isEmpty([]) // true
```

#### Validation
```typescript
import { isValidEmail, isValidUrl, isStrongPassword, sanitizeHtml } from '../../utils';

isValidEmail('test@example.com') // true
isValidUrl('https://example.com') // true
isStrongPassword('Test1234') // true
sanitizeHtml('<script>alert("XSS")</script>') // Safe HTML
```

#### Storage
```typescript
import { StorageManager } from '../../utils';

// Set item
StorageManager.set('user', { name: 'John', age: 30 });

// Get item
const user = StorageManager.get('user', { name: '', age: 0 });

// Remove
StorageManager.remove('user');

// Clear all
StorageManager.clear();
```

### 5. **Using Constants**

```typescript
import { 
  AUTH_STORAGE_KEYS,
  PROGRAMMING_LANGUAGES,
  NAVIGATION_LINKS,
  ERROR_MESSAGES,
  DEFAULT_PAGE_SIZE
} from '../../constants';

// Authentication
localStorage.setItem(AUTH_STORAGE_KEYS.TOKEN, token);

// Language filter
PROGRAMMING_LANGUAGES.forEach(lang => console.log(lang));
// Output: 'javascript', 'typescript', 'python', ...

// Navigation
navigate(NAVIGATION_LINKS.DASHBOARD);

// Error messages
console.error(ERROR_MESSAGES.NETWORK);

// Pagination
const limit = DEFAULT_PAGE_SIZE; // 10
```

### 6. **Creating a New Component with Refactored Pattern**

```typescript
import React, { useEffect } from 'react';
import { useAsyncState, useAuth } from '../../hooks';
import { filesService } from '../../services/api';
import { capitalize } from '../../utils';

interface MyComponentProps {
  title: string;
}

/**
 * MyComponent
 * Description of what this component does
 */
export const MyComponent: React.FC<MyComponentProps> = ({ title }) => {
  const asyncState = useAsyncState();
  const { logout } = useAuth();
  const token = localStorage.getItem('token');

  const handleFetchData = async () => {
    asyncState.setLoading(true);
    asyncState.setError(null);

    try {
      const response = await filesService.getAllAdmin(token!);
      if (response.success) {
        // Handle success
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      asyncState.setError(
        err instanceof Error ? err.message : 'An error occurred'
      );
    } finally {
      asyncState.setLoading(false);
    }
  };

  useEffect(() => {
    handleFetchData();
  }, [token]);

  return (
    <div>
      <h1>{capitalize(title)}</h1>
      
      {asyncState.loading && <p>Loading...</p>}
      {asyncState.error && <p>Error: {asyncState.error}</p>}
      
      <button onClick={logout}>Logout</button>
    </div>
  );
};
```

### 7. **Common Patterns**

#### Error Handling with Auth
```typescript
import { useAuthError } from '../../hooks';

const MyComponent = () => {
  const { handleAuthError } = useAuthError();
  
  const fetchData = async () => {
    try {
      // API call
    } catch (err) {
      // If it's an auth error, user is logged out automatically
      if (handleAuthError(err)) {
        return; // Already handled
      }
      // Handle other errors
    }
  };
};
```

#### Loading with Multiple States
```typescript
const MyComponent = () => {
  const asyncState = useAsyncState();
  
  return (
    <>
      {asyncState.loading && <LoadingSpinner />}
      {asyncState.error && <ErrorBanner message={asyncState.error} />}
      {!asyncState.loading && !asyncState.error && <Content />}
    </>
  );
};
```

### 8. **TypeScript Support**

All new services are fully typed:

```typescript
import { 
  filesService, 
  CodeFile, 
  FilesResponse 
} from '../../services/api';

const response: FilesResponse = await filesService.getAllAdmin(token);
const file: CodeFile = response.data[0];
// IDE provides autocomplete for: file.fileName, file.language, etc.
```

---

## Troubleshooting

### Issue: Can't find import
**Solution:** Check the file path and ensure the module is exported from index.ts

```typescript
// ✅ Correct
import { useAuth } from '../../hooks';

// ❌ Wrong
import { useAuth } from '../../hooks/useAuth';
```

### Issue: API call failing
**Solution:** Make sure to pass token for protected endpoints

```typescript
// For public endpoints
const public = await filesService.getAll();

// For admin endpoints (requires token)
const admin = await filesService.getAllAdmin(token!);
```

### Issue: Type errors
**Solution:** Ensure you're using the correct response type

```typescript
// Response type depends on which method you call
const response = await filesService.getAllAdmin(token); // FilesResponse
const single = await filesService.getById(id); // FileResponse
```

---

## Performance Tips

1. **Memoize components** - Use `React.memo()` for heavy components
2. **Use useCallback** - Prevent unnecessary function recreations
3. **Lazy load routes** - Use code splitting
4. **Cache data** - Use useCache or React Query (optional future addition)

---

## Adding a New API Endpoint

1. **Add to appropriate service file:**
```typescript
// In services/api/files.ts
async getNonPublic(token: string): Promise<SomeResponse> {
  // Implementation
}
```

2. **Use in component:**
```typescript
const response = await filesService.getNonPublic(token);
```

---

## Best Practices

✅ Use hooks for state management  
✅ Use services for API calls  
✅ Use constants instead of magic strings  
✅ Use utilities for common functions  
✅ Keep components focused and small  
✅ Add JSDoc comments to functions  
✅ Use TypeScript types  
✅ Handle errors properly  
✅ Avoid prop drilling (use context when needed)  
✅ Don't use console.log in production  

---

## Useful Commands

```bash
# Development
npm run dev

# Build
npm run build

# Preview production build
npm run preview

# Lint
npm run lint
```

---

**Happy Coding! 🚀**

Your refactored codebase is clean, professional, and ready for scaling!
