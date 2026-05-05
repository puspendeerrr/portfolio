import multer from 'multer';

/**
 * Multer storage configuration for memory storage
 * Files are stored in memory and processed directly
 */
const storage = multer.memoryStorage();

/**
 * File filter to accept only PDF and Word documents
 */
const fileFilter = (req, file, cb) => {
  const allowedMimes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF and Word documents are allowed'), false);
  }
};

/**
 * Multer upload middleware with size limits
 */
const documentUpload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max
  },
});

export default documentUpload;
