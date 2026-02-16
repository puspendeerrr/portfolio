import HeroSlide from '../models/HeroSlide.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../config/cloudinary.js';

/**
 * Get all hero slides sorted by order (PUBLIC)
 */
export const getHeroSlides = async (req, res) => {
  try {
    const slides = await HeroSlide.find().sort({ order: 1 });

    res.status(200).json({
      success: true,
      data: slides,
    });
  } catch (error) {
    console.error('Error fetching hero slides:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch hero slides',
      error: error.message,
    });
  }
};

/**
 * Create a new hero slide (ADMIN PROTECTED)
 */
export const createHeroSlide = async (req, res) => {
  try {
    // Validate request
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided',
      });
    }

    const { order } = req.body;

    if (!order) {
      return res.status(400).json({
        success: false,
        message: 'Order number is required',
      });
    }

    const orderNum = parseInt(order, 10);
    if (isNaN(orderNum) || orderNum < 1) {
      return res.status(400).json({
        success: false,
        message: 'Order must be a positive number',
      });
    }

    // Upload to Cloudinary
    const imageUrl = await uploadToCloudinary(
      req.file.buffer,
      req.file.originalname
    );

    // Create slide in database
    const slide = new HeroSlide({
      imageUrl,
      order: orderNum,
    });

    await slide.save();

    res.status(201).json({
      success: true,
      message: 'Hero slide created successfully',
      data: slide,
    });
  } catch (error) {
    console.error('Error creating hero slide:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create hero slide',
      error: error.message,
    });
  }
};

/**
 * Update hero slide (ADMIN PROTECTED)
 * Can update order and optionally replace the image
 */
export const updateHeroSlide = async (req, res) => {
  try {
    const { id } = req.params;
    const { order } = req.body;

    // Validate slide exists
    const slide = await HeroSlide.findById(id);
    if (!slide) {
      return res.status(404).json({
        success: false,
        message: 'Hero slide not found',
      });
    }

    // Update order if provided
    if (order) {
      const orderNum = parseInt(order, 10);
      if (isNaN(orderNum) || orderNum < 1) {
        return res.status(400).json({
          success: false,
          message: 'Order must be a positive number',
        });
      }
      slide.order = orderNum;
    }

    // Handle image replacement if file provided
    if (req.file) {
      // Delete old image from Cloudinary
      if (slide.imageUrl) {
        try {
          await deleteFromCloudinary(slide.imageUrl);
        } catch (err) {
          console.warn('Warning: Could not delete old image from Cloudinary:', err);
          // Continue anyway - image is updated in DB
        }
      }

      // Upload new image
      const newImageUrl = await uploadToCloudinary(
        req.file.buffer,
        req.file.originalname
      );
      slide.imageUrl = newImageUrl;
    }

    await slide.save();

    res.status(200).json({
      success: true,
      message: 'Hero slide updated successfully',
      data: slide,
    });
  } catch (error) {
    console.error('Error updating hero slide:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update hero slide',
      error: error.message,
    });
  }
};

/**
 * Delete hero slide (ADMIN PROTECTED)
 */
export const deleteHeroSlide = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate slide exists
    const slide = await HeroSlide.findById(id);
    if (!slide) {
      return res.status(404).json({
        success: false,
        message: 'Hero slide not found',
      });
    }

    // Delete image from Cloudinary
    if (slide.imageUrl) {
      try {
        await deleteFromCloudinary(slide.imageUrl);
      } catch (err) {
        console.warn('Warning: Could not delete image from Cloudinary:', err);
        // Continue anyway - delete from DB
      }
    }

    // Delete from database
    await HeroSlide.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Hero slide deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting hero slide:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete hero slide',
      error: error.message,
    });
  }
};
