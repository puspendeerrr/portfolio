import express from 'express';
import { body } from 'express-validator';
import { login, verifyToken } from '../controllers/authController.js';
import handleValidationErrors from '../middleware/validationHandler.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * POST /api/auth/login
 * Admin login endpoint
 * Body: { password: string }
 * Returns: { token: string, expiresIn: string }
 */
router.post(
  '/login',
  [
    body('password')
      .trim()
      .notEmpty()
      .withMessage('Password is required')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters')
  ],
  handleValidationErrors,
  login
);

/**
 * GET /api/auth/verify
 * Verify JWT token validity
 * Requires: Authorization header with valid JWT
 */
router.get('/verify', authMiddleware, verifyToken);

export default router;
