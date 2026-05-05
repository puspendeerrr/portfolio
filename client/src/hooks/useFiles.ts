/**
 * Files Hook
 * Manages file operations and state
 */

import { useState, useCallback, useEffect } from 'react';
import { filesService, CodeFile } from '../services/api/files';
import { useAsyncState } from './useAsyncState';
import { useAuthError } from './useAuth';

interface FilesState {
  files: CodeFile[];
  total: number;
  loading: boolean;
  error: string | null;
}

interface UseFilesReturn extends Omit<FilesState, 'total'> {
  fetchFiles: (token: string, params?: Record<string, unknown>) => Promise<void>;
  deleteFile: (token: string, fileId: string, fileName: string) => Promise<void>;
}

export const useFiles = (): UseFilesReturn => {
  const [files, setFiles] = useState<CodeFile[]>([]);
  const { loading, error, setLoading, setError } = useAsyncState();
  const { handleAuthError } = useAuthError();

  const fetchFiles = useCallback(async (
    token: string,
    params?: Record<string, unknown>
  ) => {
    setLoading(true);
    setError(null);

    try {
      const response = await filesService.getAllAdmin(token, params);
      if (response.success) {
        setFiles(response.data || []);
      } else {
        throw new Error(response.message || 'Failed to fetch files');
      }
    } catch (err) {
      if (!handleAuthError(err)) {
        const message = err instanceof Error ? err.message : 'Failed to fetch files';
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, handleAuthError]);

  const deleteFile = useCallback(async (
    token: string,
    fileId: string,
    fileName: string
  ) => {
    if (!window.confirm(`Are you sure you want to delete "${fileName}"?`)) {
      return;
    }

    try {
      const response = await filesService.delete(token, fileId);
      if (response.success) {
        setFiles(prev => prev.filter(f => f._id !== fileId));
      } else {
        throw new Error(response.message || 'Failed to delete file');
      }
    } catch (err) {
      if (!handleAuthError(err)) {
        const message = err instanceof Error ? err.message : 'Failed to delete file';
        setError(message);
      }
    }
  }, [setError, handleAuthError]);

  return {
    files,
    loading,
    error,
    fetchFiles,
    deleteFile
  };
};
