/**
 * Files/Code Library Service
 * Handles all file management API calls
 */

import BASE_URL from './config';
import { handleApiError } from './errorHandler';

export interface CodeFile {
  _id: string;
  fileName: string;
  folderPath: string;
  programmingLanguage: string;
  description: string;
  codeContent: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

interface PaginationInfo {
  total: number;
  limit: number;
  page: number;
  pages: number;
}

interface FilesResponse {
  success: boolean;
  data: CodeFile[];
  pagination?: PaginationInfo;
  message?: string;
}

interface FileResponse {
  success: boolean;
  data: CodeFile;
  message?: string;
}

interface StatsResponse {
  success: boolean;
  data: {
    totalFiles: number;
    byLanguage: Array<{ _id: string; count: number }>;
    byFolder: Array<{ _id: string; count: number }>;
  };
}

/**
 * File management operations
 */
export const filesService = {
  /**
   * Get all files (public endpoint)
   */
  async getAll(params?: Record<string, unknown>): Promise<FilesResponse> {
    try {
      const queryString = params ? new URLSearchParams(
        Object.entries(params).reduce((acc, [key, value]) => {
          if (value !== undefined && value !== null) {
            acc[key] = String(value);
          }
          return acc;
        }, {} as Record<string, string>)
      ).toString() : '';

      const url = queryString ? `${BASE_URL}/files?${queryString}` : `${BASE_URL}/files`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch files');
      }

      return await response.json();
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get all files with authentication (admin endpoint)
   */
  async getAllAdmin(token: string, params?: Record<string, unknown>): Promise<FilesResponse> {
    try {
      const queryString = params ? new URLSearchParams(
        Object.entries(params).reduce((acc, [key, value]) => {
          if (value !== undefined && value !== null) {
            acc[key] = String(value);
          }
          return acc;
        }, {} as Record<string, string>)
      ).toString() : '';

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
        throw new Error('Failed to fetch files');
      }

      return await response.json();
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get single file by ID (public)
   */
  async getById(fileId: string): Promise<FileResponse> {
    try {
      const response = await fetch(`${BASE_URL}/files/${fileId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('File not found');
        }
        throw new Error('Failed to fetch file');
      }

      return await response.json();
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Create new file (admin)
   */
  async create(token: string, fileData: Partial<CodeFile>): Promise<FileResponse> {
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
      throw handleApiError(error);
    }
  },

  /**
   * Update file (admin)
   */
  async update(
    token: string,
    fileId: string,
    fileData: Partial<CodeFile>
  ): Promise<FileResponse> {
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
      throw handleApiError(error);
    }
  },

  /**
   * Delete file (admin)
   */
  async delete(token: string, fileId: string): Promise<FileResponse> {
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
      throw handleApiError(error);
    }
  },

  /**
   * Delete all files (admin)
   */
  async deleteAll(token: string): Promise<{ success: boolean; deletedCount: number }> {
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
        throw new Error(error.message || 'Failed to delete files');
      }

      return await response.json();
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get file statistics (admin)
   */
  async getStats(token: string): Promise<StatsResponse> {
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
        throw new Error('Failed to fetch statistics');
      }

      return await response.json();
    } catch (error) {
      throw handleApiError(error);
    }
  }
};
