import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';
import {
  getHeroSlides,
  createHeroSlide,
  updateHeroSlide,
  deleteHeroSlide,
} from '../controllers/heroSlidesController.js';

const router = express.Router();

/**
 * GET /api/hero-slides
 * Fetch all hero slides sorted by order (PUBLIC)
 */
router.get('/', getHeroSlides);

/**
 * POST /api/hero-slides
 * Create a new hero slide with image upload (ADMIN PROTECTED)
 * Requires: image file, order number
 */
router.post('/', authMiddleware, upload.single('image'), createHeroSlide);

/**
 * PUT /api/hero-slides/:id
 * Update hero slide order or image (ADMIN PROTECTED)
 * Optionally replace image or update order
 */
router.put('/:id', authMiddleware, upload.single('image'), updateHeroSlide);

/**
 * DELETE /api/hero-slides/:id
 * Delete hero slide and its image from Cloudinary (ADMIN PROTECTED)
 */
router.delete('/:id', authMiddleware, deleteHeroSlide);

export default router;
