/**
 * Local Storage Utility Functions
 * Provides type-safe localStorage operations
 */

class StorageManager {
  /**
   * Set item in localStorage
   */
  static set<T>(key: string, value: T): void {
    try {
      const serialized = typeof value === 'string' ? value : JSON.stringify(value);
      localStorage.setItem(key, serialized);
    } catch (error) {
      console.warn(`Failed to set localStorage key "${key}":`, error);
    }
  }

  /**
   * Get item from localStorage
   */
  static get<T>(key: string, defaultValue?: T): T | null {
    try {
      const item = localStorage.getItem(key);
      if (!item) return defaultValue ?? null;
      
      try {
        return JSON.parse(item) as T;
      } catch {
        return item as unknown as T;
      }
    } catch (error) {
      console.warn(`Failed to get localStorage key "${key}":`, error);
      return defaultValue ?? null;
    }
  }

  /**
   * Remove item from localStorage
   */
  static remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.warn(`Failed to remove localStorage key "${key}":`, error);
    }
  }

  /**
   * Clear all localStorage
   */
  static clear(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.warn('Failed to clear localStorage:', error);
    }
  }
}

export default StorageManager;
