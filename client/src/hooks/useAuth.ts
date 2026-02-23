/**
 * Authentication Hook
 * Manages authentication state and token handling
 */

import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService, isUnauthorizedError } from '../services/api';

interface UseAuthReturn {
  login: (password: string) => Promise<{ token: string; expiresIn?: string }>;
  logout: () => void;
  isTokenValid: () => boolean;
}

export const useAuth = (): UseAuthReturn => {
  const navigate = useNavigate();

  const login = useCallback(async (password: string) => {
    try {
      const response = await authService.login(password);
      if (response.success) {
        localStorage.setItem('token', response.token);
        if (response.expiresIn) {
          localStorage.setItem('tokenExpiry', response.expiresIn);
        }
        return { token: response.token, expiresIn: response.expiresIn };
      }
      throw new Error(response.message || 'Login failed');
    } catch (error) {
      throw error;
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('tokenExpiry');
    navigate('/login', { replace: true });
  }, [navigate]);

  const isTokenValid = useCallback(() => {
    const token = localStorage.getItem('token');
    if (!token) return false;

    const tokenExpiry = localStorage.getItem('tokenExpiry');
    if (tokenExpiry) {
      const expiryTime = new Date(tokenExpiry).getTime();
      return Date.now() < expiryTime;
    }

    return true;
  }, []);

  return { login, logout, isTokenValid };
};

/**
 * Hook to get current token from localStorage
 */
export const useToken = (): string | null => {
  return localStorage.getItem('token');
};

/**
 * Hook to handle unauthorized/token expired scenarios
 */
export const useAuthError = () => {
  const { logout } = useAuth();

  const handleAuthError = useCallback((error: unknown) => {
    if (isUnauthorizedError(error)) {
      logout();
      return true;
    }
    return false;
  }, [logout]);

  return { handleAuthError };
};
