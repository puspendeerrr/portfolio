import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';

/**
 * Authentication Controller
 * Handles admin login and JWT token generation
 */

/**
 * Admin Login
 * POST /api/auth/login
 * 
 * Body: { password: string }
 * Returns: { success: bool, token: string, expiresIn: string }
 */
const login = async (req, res, next) => {
  try {
    const { password } = req.body;

    // Validate input
    if (!password) {
      return res.status(400).json({
        success: false,
        message: 'Password is required'
      });
    }

    // Verify password
    // The admin password should be hashed and stored, but for this example,
    // we'll compare with environment variable (ensure it's hashed in production)
    const adminPassword = process.env.ADMIN_PASSWORD;
    
    if (!adminPassword) {
      console.error('ADMIN_PASSWORD is not set in .env');
      return res.status(500).json({
        success: false,
        message: 'Server configuration error'
      });
    }

    // Compare password with hashed password
    const isPasswordValid = await bcryptjs.compare(password, adminPassword);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid password'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: 'admin',
        role: 'admin',
        email: 'admin@portfolio.local'
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );

    // Calculate actual expiry timestamp
    const expiresInSeconds = parseInt(process.env.JWT_EXPIRE || '604800') || 604800; // 7 days in seconds
    const expiryTimestamp = new Date(Date.now() + expiresInSeconds * 1000).toISOString();

    // Success response
    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      expiresIn: expiryTimestamp
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Generate Hashed Password (for setup/admin reset)
 * Helper function to hash password using bcryptjs
 * This is exported for CLI use or admin setup script
 */
const hashPassword = async (plainPassword) => {
  try {
    const saltRounds = 10;
    const hashedPassword = await bcryptjs.hash(plainPassword, saltRounds);
    return hashedPassword;
  } catch (error) {
    console.error('Error hashing password:', error);
    throw error;
  }
};

/**
 * Verify Token (Optional endpoint to check token validity)
 * GET /api/auth/verify
 */
const verifyToken = async (req, res, next) => {
  try {
    // If request reaches here, authMiddleware has already verified the token
    res.status(200).json({
      success: true,
      message: 'Token is valid',
      user: req.user
    });
  } catch (error) {
    next(error);
  }
};

export { login, verifyToken, hashPassword };
