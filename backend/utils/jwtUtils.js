/**
 * JWT Utility Functions
 * Helper functions for token generation and verification
 */

import jwt from 'jsonwebtoken';

/**
 * Generate JWT Token
 * @param {Object} payload - Data to encode in token
 * @param {string} secret - Secret key
 * @param {string} expiresIn - Expiration time (e.g., '7d', '24h')
 * @returns {string} JWT token
 */
export const generateToken = (payload, secret = process.env.JWT_SECRET, expiresIn = process.env.JWT_EXPIRE) => {
  if (!secret) {
    throw new Error('JWT_SECRET is not defined');
  }

  return jwt.sign(payload, secret, { expiresIn });
};

/**
 * Verify JWT Token
 * @param {string} token - Token to verify
 * @param {string} secret - Secret key
 * @returns {Object} Decoded payload
 */
export const verifyToken = (token, secret = process.env.JWT_SECRET) => {
  if (!secret) {
    throw new Error('JWT_SECRET is not defined');
  }

  return jwt.verify(token, secret);
};

/**
 * Decode JWT Token (without verification)
 * @param {string} token - Token to decode
 * @returns {Object} Decoded payload
 */
export const decodeToken = (token) => {
  return jwt.decode(token);
};

/**
 * Check if token is expired
 * @param {string} token - Token to check
 * @returns {boolean}
 */
export const isTokenExpired = (token) => {
  try {
    const decoded = jwt.decode(token);
    if (!decoded || !decoded.exp) return true;
    
    return Date.now() >= decoded.exp * 1000;
  } catch {
    return true;
  }
};

/**
 * Get token expiration time
 * @param {string} token - Token
 * @returns {Date|null}
 */
export const getTokenExpirationDate = (token) => {
  try {
    const decoded = jwt.decode(token);
    if (!decoded || !decoded.exp) return null;
    
    return new Date(decoded.exp * 1000);
  } catch {
    return null;
  }
};

export default {
  generateToken,
  verifyToken,
  decodeToken,
  isTokenExpired,
  getTokenExpirationDate
};
