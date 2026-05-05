/**
 * Application Constants
 */

// Authentication
export const AUTH_STORAGE_KEYS = {
  TOKEN: 'token',
  TOKEN_EXPIRY: 'tokenExpiry'
} as const;

export const PASSWORD_MIN_LENGTH = 6;

// File Upload
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const ALLOWED_FILE_TYPES = [
  'text/plain',
  'application/json',
  'text/javascript',
  'text/typescript',
  'text/html',
  'text/css',
  'application/x-python',
  'text/x-csrc'
];

// Pagination
export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZES = [5, 10, 25, 50] as const;

// Timings
export const DEBOUNCE_DELAY = 300; // ms
export const API_TIMEOUT = 30000; // ms
export const TOAST_DURATION = 3000; // ms

// Programming Languages
export const PROGRAMMING_LANGUAGES = [
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
] as const;

// Application Links
export const NAVIGATION_LINKS = {
  HOME: '/',
  ABOUT: '/about',
  SKILLS: '/skills',
  PROJECTS: '/projects',
  CODE_LIBRARY: '/code-library',
  LEARNINGS: '/learnings',
  RESUME: '/resume',
  EXPERIENCE: '/experience',
  CONTACT: '/contact',
  LOGIN: '/login',
  DASHBOARD: '/dashboard'
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  GENERIC: 'An unexpected error occurred. Please try again.',
  NETWORK: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION: 'Please check your input and try again.',
  TIMEOUT: 'Request timed out. Please try again.'
} as const;
