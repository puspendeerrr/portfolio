import multer from 'multer';

/**
 * Multer storage configuration for memory storage
 * Files are stored in memory and processed directly
 */
const storage = multer.memoryStorage();

/**
 * File filter to accept only image files
 */
const fileFilter = (req, file, cb) => {
  const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed (JPEG, PNG, WebP)'), false);
  }
};

/**
 * Multer upload middleware with size limits
 */
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max
  },
});

export default upload;
