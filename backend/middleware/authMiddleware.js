import jwt from 'jsonwebtoken';

/**
 * Middleware to verify JWT token
 * Checks if the request has a valid JWT token in the Authorization header
 */
const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No token provided. Please login first.'
      });
    }

    // Extract token from "Bearer <token>"
    const token = authHeader.substring(7);

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user info to request object
    next();
  } catch (error) {
    let message = 'Invalid token';
    
    if (error.name === 'TokenExpiredError') {
      message = 'Token has expired. Please login again.';
      return res.status(401).json({ success: false, message });
    }
    
    if (error.name === 'JsonWebTokenError') {
      message = 'Invalid or malformed token.';
    }

    res.status(401).json({ success: false, message });
  }
};

export default authMiddleware;
