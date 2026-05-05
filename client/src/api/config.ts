/**
 * API Configuration
 * Centralizes API base URL configuration for both development and production
 *
 * Development: Uses http://localhost:5000/api (default)
 * Production: Uses VITE_API_URL environment variable
 */

const BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default BASE_URL;
