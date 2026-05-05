import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

// Validate Cloudinary environment variables
const validateCloudinaryConfig = () => {
  const required = ['CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET'];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(`Missing Cloudinary configuration: ${missing.join(', ')}`);
  }
};

// Configure Cloudinary
try {
  validateCloudinaryConfig();
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
  console.log('✓ Cloudinary configured successfully');
} catch (error) {
  console.error('❌ Cloudinary configuration error:', error.message);
  process.exit(1);
}

/**
 * Upload image to Cloudinary
 * @param {Buffer} fileBuffer - File buffer from multer
 * @param {string} fileName - Original filename
 * @param {string} folder - Cloudinary folder path (default: portfolio/hero-slides)
 * @returns {Promise<string>} - secure_url from Cloudinary response
 */
export const uploadToCloudinary = async (fileBuffer, fileName, folder = 'portfolio/hero-slides') => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'auto',
        public_id: `${Date.now()}-${fileName.replace(/\.[^/.]+$/, '')}`,
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result.secure_url);
        }
      }
    );

    stream.end(fileBuffer);
  });
};

/**
 * Upload a raw document (PDF, Word) to Cloudinary
 * @param {Buffer} fileBuffer - File buffer from multer
 * @param {string} fileName - Original filename
 * @param {string} folder - Cloudinary folder path
 * @returns {Promise<string>} - secure_url from Cloudinary response
 */
export const uploadDocumentToCloudinary = async (fileBuffer, fileName, folder = 'portfolio/documents') => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'raw', // 'raw' is required for PDFs, Word docs, etc.
        public_id: `${Date.now()}-${fileName.replace(/\s+/g, '_')}`,
        use_filename: false,
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result.secure_url);
        }
      }
    );

    stream.end(fileBuffer);
  });
};

/**
 * Delete a file from Cloudinary (images or raw files)
 * @param {string} fileUrl - Full Cloudinary URL
 * @returns {Promise<void>}
 */
export const deleteFromCloudinary = async (fileUrl) => {
  try {
    // Extract public_id from URL
    // URL format: https://res.cloudinary.com/{cloud_name}/{resource_type}/upload/v.../folder/public_id.ext
    const urlParts = fileUrl.split('/');
    const uploadIndex = urlParts.findIndex(p => p === 'upload');
    
    if (uploadIndex === -1) {
      throw new Error('Invalid Cloudinary URL');
    }

    // Get everything after upload/v.../
    const afterUpload = urlParts.slice(uploadIndex + 2);
    const publicIdWithExt = afterUpload.join('/');
    const publicId = publicIdWithExt.replace(/\.[^/.]+$/, ''); // remove extension

    // Determine resource type from URL (image vs raw)
    const resourceType = urlParts[uploadIndex - 1] === 'image' ? 'image' : 'raw';

    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
  } catch (error) {
    console.error('Error deleting file from Cloudinary:', error);
    throw new Error('Failed to delete file from Cloudinary');
  }
};

export default cloudinary;
