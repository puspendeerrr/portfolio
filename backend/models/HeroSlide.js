import mongoose from 'mongoose';

/**
 * HeroSlide Schema - Stores hero slideshow images
 *
 * Fields:
 * - imageUrl: URL of the image stored in Cloudinary
 * - order: Display order of the slide (sorted ascending)
 * - createdAt: Timestamp when slide was created
 * - updatedAt: Timestamp when slide was last updated
 */
const heroSlideSchema = new mongoose.Schema(
  {
    imageUrl: {
      type: String,
      required: [true, 'Image URL is required'],
      trim: true,
    },
    order: {
      type: Number,
      required: [true, 'Order is required'],
      min: [1, 'Order must be at least 1'],
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Index for faster sorting by order
 */
heroSlideSchema.index({ order: 1 });

const HeroSlide = mongoose.model('HeroSlide', heroSlideSchema);

export default HeroSlide;
