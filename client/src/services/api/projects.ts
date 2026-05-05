/**
 * Projects Service
 * Handles all project-related API calls
 */

import BASE_URL from './config';
import { handleApiError } from './errorHandler';

export interface Project {
  _id: string;
  title: string;
  description: string;
  technologies: string[];
  codeFiles: string[];
  createdAt: string;
  updatedAt: string;
}

interface ProjectsResponse {
  success: boolean;
  data: Project[];
  message?: string;
}

interface ProjectResponse {
  success: boolean;
  data: Project;
  message?: string;
}

/**
 * Project management operations
 */
export const projectsService = {
  /**
   * Get all projects (public)
   */
  async getAll(): Promise<ProjectsResponse> {
    try {
      const response = await fetch(`${BASE_URL}/projects`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch projects');
      }

      return await response.json();
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get single project by ID (public)
   */
  async getById(projectId: string): Promise<ProjectResponse> {
    try {
      const response = await fetch(`${BASE_URL}/projects/${projectId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Project not found');
        }
        throw new Error('Failed to fetch project');
      }

      return await response.json();
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Create project (admin)
   */
  async create(token: string, projectData: Partial<Project>): Promise<ProjectResponse> {
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
      throw handleApiError(error);
    }
  },

  /**
   * Delete project (admin)
   */
  async delete(token: string, projectId: string): Promise<ProjectResponse> {
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
      throw handleApiError(error);
    }
  }
};
