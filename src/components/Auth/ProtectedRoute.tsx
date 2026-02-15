import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

/**
 * ProtectedRoute Component
 * Requires authentication token to access protected routes
 * Redirects to login if token is missing or invalid
 */
interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // Check if token exists in localStorage
    const token = localStorage.getItem('token');
    const isValid = !!token && token.trim().length > 0;
    setIsAuthenticated(isValid);
  }, []);

  // Still loading auth state
  if (isAuthenticated === null) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: '#1a1a2e'
      }}>
        <div style={{
          textAlign: 'center',
          color: '#e0e0e0'
        }}>
          <div style={{
            fontSize: '32px',
            marginBottom: '16px'
          }}>🔐</div>
          <p>Verifying access...</p>
        </div>
      </div>
    );
  }

  // Not authenticated - redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Authenticated - render children
  return <>{children}</>;
};

export default ProtectedRoute;
