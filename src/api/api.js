/**
 * API Utility
 * Handles all backend API calls for authentication and file management
 * Base URL: http://localhost:5000/api
 */

const BASE_URL = 'http://localhost:5000/api';

/**
 * Login - POST /api/auth/login
 * @param {string} password - Admin password
 * @returns {Promise<{success: boolean, token: string, expiresIn: string}>}
 */
export const login = async (password) => {
  try {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ password })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};

/**
 * Get all files - GET /api/files
 * @param {string} token - JWT token
 * @param {Object} params - Query parameters (optional)
 *   - programmingLanguage: Filter by language
 *   - limit: Number of files per page
 *   - page: Page number
 *   - sortBy: Sort field
 *   - order: Sort order (asc/desc)
 * @returns {Promise<{success: boolean, data: Array, pagination: Object}>}
 */
export const getFiles = async (token, params = {}) => {
  try {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${BASE_URL}/files?${queryString}` : `${BASE_URL}/files`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Unauthorized: Token expired or invalid');
      }
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch files');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};

/**
 * Get single file - GET /api/files/:id
 * @param {string} token - JWT token
 * @param {string} fileId - File ID
 * @returns {Promise<{success: boolean, data: Object}>}
 */
export const getFileById = async (token, fileId) => {
  try {
    const response = await fetch(`${BASE_URL}/files/${fileId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Unauthorized: Token expired or invalid');
      }
      if (response.status === 404) {
        throw new Error('File not found');
      }
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch file');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};

/**
 * Create file - POST /api/files
 * @param {string} token - JWT token
 * @param {Object} fileData - File data object
 *   - fileName: string (required)
 *   - folderPath: string (required)
 *   - programmingLanguage: string (required)
 *   - description: string (required)
 *   - codeContent: string (required)
 *   - tags: Array<string> (optional)
 * @returns {Promise<{success: boolean, data: Object}>}
 */
export const createFile = async (token, fileData) => {
  try {
    const response = await fetch(`${BASE_URL}/files`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(fileData)
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Unauthorized: Token expired or invalid');
      }
      const error = await response.json();
      throw new Error(error.message || 'Failed to create file');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};

/**
 * Update file - PUT /api/files/:id
 * @param {string} token - JWT token
 * @param {string} fileId - File ID
 * @param {Object} fileData - File data to update
 * @returns {Promise<{success: boolean, data: Object}>}
 */
export const updateFile = async (token, fileId, fileData) => {
  try {
    const response = await fetch(`${BASE_URL}/files/${fileId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(fileData)
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Unauthorized: Token expired or invalid');
      }
      if (response.status === 404) {
        throw new Error('File not found');
      }
      const error = await response.json();
      throw new Error(error.message || 'Failed to update file');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};

/**
 * Delete file - DELETE /api/files/:id
 * @param {string} token - JWT token
 * @param {string} fileId - File ID
 * @returns {Promise<{success: boolean, data: Object}>}
 */
export const deleteFile = async (token, fileId) => {
  try {
    const response = await fetch(`${BASE_URL}/files/${fileId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Unauthorized: Token expired or invalid');
      }
      if (response.status === 404) {
        throw new Error('File not found');
      }
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete file');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};

/**
 * Delete all files - DELETE /api/files
 * @param {string} token - JWT token
 * @returns {Promise<{success: boolean, message: string, deletedCount: number}>}
 */
export const deleteAllFiles = async (token) => {
  try {
    const response = await fetch(`${BASE_URL}/files`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Unauthorized: Token expired or invalid');
      }
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete all files');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};


/**
 * Get file statistics - GET /api/files/stats/overview
 * @param {string} token - JWT token
 * @returns {Promise<{success: boolean, data: Object}>}
 */
export const getFileStats = async (token) => {
  try {
    const response = await fetch(`${BASE_URL}/files/stats/overview`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Unauthorized: Token expired or invalid');
      }
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch statistics');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};

/**
 * Bulk upload files - POST /api/files/bulk-upload
 * @param {string} token - JWT token
 * @param {Array} files - Array of file objects
 *   Each file object: {
 *     fileName: string,
 *     folderPath: string,
 *     programmingLanguage: string,
 *     description: string (optional),
 *     codeContent: string,
 *     tags: Array (optional)
 *   }
 * @returns {Promise<{success: boolean, data: {count: number, files: Array}}>}
 */
export const bulkUploadFiles = async (token, files) => {
  try {
    const response = await fetch(`${BASE_URL}/files/bulk-upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ files })
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Unauthorized: Token expired or invalid');
      }
      const error = await response.json();
      throw new Error(error.message || 'Failed to upload files');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};

/**
 * Get all projects - GET /api/projects
 * @returns {Promise<{success: boolean, data: Array}>}
 */
export const getProjects = async () => {
  try {
    const response = await fetch(`${BASE_URL}/projects`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch projects');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};

/**
 * Create project - POST /api/projects
 * @param {string} token - JWT token
 * @param {Object} projectData - Project data
 * @returns {Promise<{success: boolean, data: Object}>}
 */
export const createProject = async (token, projectData) => {
  try {
    const response = await fetch(`${BASE_URL}/projects`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(projectData)
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Unauthorized: Token expired or invalid');
      }
      const error = await response.json();
      throw new Error(error.message || 'Failed to create project');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};

/**
 * Delete project - DELETE /api/projects/:id
 * @param {string} token - JWT token
 * @param {string} projectId - Project ID
 * @returns {Promise<{success: boolean, data: Object}>}
 */
export const deleteProject = async (token, projectId) => {
  try {
    const response = await fetch(`${BASE_URL}/projects/${projectId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Unauthorized: Token expired or invalid');
      }
      if (response.status === 404) {
        throw new Error('Project not found');
      }
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete project');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};

/**
 * Upload project files - POST /api/projects/:id/files
 * @param {string} token - JWT token
 * @param {string} projectId - Project ID
 * @param {Array} files - Array of files with {path, language, content}
 * @returns {Promise<{success: boolean, data: Object}>}
 */
export const uploadProjectFiles = async (token, projectId, files) => {
  try {
    const response = await fetch(`${BASE_URL}/projects/${projectId}/files`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ files })
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Unauthorized: Token expired or invalid');
      }
      if (response.status === 404) {
        throw new Error('Project not found');
      }
      const error = await response.json();
      throw new Error(error.message || 'Failed to upload project files');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};

export default {
  login,
  getFiles,
  getFileById,
  createFile,
  updateFile,
  deleteFile,
  deleteAllFiles,
  getFileStats,
  bulkUploadFiles,
  getProjects,
  createProject,
  deleteProject,
  uploadProjectFiles
};
