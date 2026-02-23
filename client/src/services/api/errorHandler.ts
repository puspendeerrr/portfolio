/**
 * API Error Handler Utility
 * Standardizes error handling across all API calls
 */

interface ApiError {
  message: string;
  status?: number;
  originalError?: unknown;
}

export const handleApiError = (error: unknown): ApiError => {
  if (error instanceof Error) {
    // Network error or JSON parsing error
    if (error.message === 'Network request failed' || 
        error.message.includes('JSON')) {
      return {
        message: 'Network error. Please check your connection.',
        originalError: error
      };
    }
    return {
      message: error.message,
      originalError: error
    };
  }

  return {
    message: 'An unexpected error occurred',
    originalError: error
  };
};

export const isUnauthorizedError = (error: unknown): boolean => {
  if (error instanceof Error) {
    return error.message.includes('Unauthorized') || 
           error.message.includes('Token expired') ||
           error.message.includes('401');
  }
  return false;
};
