import Documentation from '../models/Documentation.js';
import { uploadDocumentToCloudinary, deleteFromCloudinary } from '../config/cloudinary.js';

/**
 * Get all documentations
 * @route GET /api/documentations
 * @access Public
 */
export const getDocumentations = async (req, res) => {
  try {
    const documentations = await Documentation.find().sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      data: documentations
    });
  } catch (error) {
    console.error('Get documentations error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Create a new documentation
 * @route POST /api/documentations
 * @access Private
 */
export const createDocumentation = async (req, res) => {
  try {
    const { title, date, points } = req.body;
    const file = req.file;

    if (!title || !date || !file) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, date, and a document file'
      });
    }

    // Process points if sent as a string from FormData
    let parsedPoints = [];
    if (typeof points === 'string') {
      try {
        parsedPoints = JSON.parse(points);
      } catch (e) {
        parsedPoints = points.split(',').map(p => p.trim()).filter(p => p);
      }
    } else if (Array.isArray(points)) {
      parsedPoints = points;
    }

    // Upload document to Cloudinary
    const fileUrl = await uploadDocumentToCloudinary(
      file.buffer,
      file.originalname,
      'portfolio/documents'
    );

    const documentation = await Documentation.create({
      title,
      date,
      points: parsedPoints,
      fileUrl,
      fileName: file.originalname,
      fileType: file.mimetype
    });

    res.status(201).json({
      success: true,
      data: documentation
    });
  } catch (error) {
    console.error('Create documentation error:', error);
    
    // Mongoose validation error
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }
    
    res.status(500).json({
      success: false,
      message: error.message || 'Server Error'
    });
  }
};

/**
 * Delete a documentation
 * @route DELETE /api/documentations/:id
 * @access Private
 */
export const deleteDocumentation = async (req, res) => {
  try {
    const documentation = await Documentation.findById(req.params.id);

    if (!documentation) {
      return res.status(404).json({
        success: false,
        message: 'Documentation not found'
      });
    }

    if (documentation.fileUrl) {
      try {
        await deleteFromCloudinary(documentation.fileUrl);
      } catch (err) {
        console.warn('Could not delete from Cloudinary:', err.message);
      }
    }

    await documentation.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error('Delete documentation error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};
