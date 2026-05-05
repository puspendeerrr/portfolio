/**
 * HERO SLIDES SERVICE
 * Handles all hero slide management API calls
 */

import BASE_URL from './config';
import { handleApiError } from './errorHandler';

export interface HeroSlide {
  _id: string;
  title: string;
  description: string;
  image: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

interface SlidesResponse {
  success: boolean;
  data: HeroSlide[];
  message?: string;
}

interface SlideResponse {
  success: boolean;
  data: HeroSlide;
  message?: string;
}

/**
 * Hero slides management
 */
export const heroSlidesService = {
  /**
   * Get all hero slides (public)
   */
  async getAll(): Promise<SlidesResponse> {
    try {
      const response = await fetch(`${BASE_URL}/hero-slides`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch slides');
      }

      return await response.json();
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Create hero slide (admin)
   */
  async create(token: string, slideData: Partial<HeroSlide>): Promise<SlideResponse> {
    try {
      const response = await fetch(`${BASE_URL}/hero-slides`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(slideData)
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized: Token expired or invalid');
        }
        const error = await response.json();
        throw new Error(error.message || 'Failed to create slide');
      }

      return await response.json();
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Update hero slide (admin)
   */
  async update(
    token: string,
    slideId: string,
    slideData: Partial<HeroSlide>
  ): Promise<SlideResponse> {
    try {
      const response = await fetch(`${BASE_URL}/hero-slides/${slideId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(slideData)
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized: Token expired or invalid');
        }
        if (response.status === 404) {
          throw new Error('Slide not found');
        }
        const error = await response.json();
        throw new Error(error.message || 'Failed to update slide');
      }

      return await response.json();
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Delete hero slide (admin)
   */
  async delete(token: string, slideId: string): Promise<SlideResponse> {
    try {
      const response = await fetch(`${BASE_URL}/hero-slides/${slideId}`, {
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
          throw new Error('Slide not found');
        }
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete slide');
      }

      return await response.json();
    } catch (error) {
      throw handleApiError(error);
    }
  }
};
