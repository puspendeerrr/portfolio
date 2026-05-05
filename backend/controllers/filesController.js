import CodeFile from '../models/CodeFile.js';
import { asyncHandler } from '../middleware/errorHandler.js';

/**
 * Files Controller
 * Handles CRUD operations for code files
 */

/**
 * Create a new code file
 * POST /api/files
 * 
 * Body: {
 *   fileName: string,
 *   folderPath: string,
 *   language: string,
 *   description: string,
 *   codeContent: string,
 *   tags?: string[] (optional)
 * }
 */
const createFile = asyncHandler(async (req, res) => {
  const { fileName, folderPath, language, description, codeContent, tags } = req.body;

  // Validate required fields
  if (!fileName || !folderPath || !language || !description || !codeContent) {
    return res.status(400).json({
      success: false,
      message: 'All required fields must be provided'
    });
  }

  // Create new code file
  const codeFile = new CodeFile({
    fileName,
    folderPath,
    language: language.toLowerCase(),
    description,
    codeContent,
    tags: tags || []
  });

  // Save to database
  await codeFile.save();

  res.status(201).json({
    success: true,
    message: 'File created successfully',
    data: codeFile
  });
});

/**
 * Get all code files
 * GET /api/files
 * Query params: ?language=typescript&sortBy=createdAt&order=desc&limit=20&page=1
 */
const getAllFiles = asyncHandler(async (req, res) => {
  const { language, sortBy = 'createdAt', order = 'desc', limit = 20, page = 1 } = req.query;

  // Build filter
  const filter = {};
  if (language) {
    filter.language = language.toLowerCase();
  }

  // Calculate skip for pagination
  const skip = (parseInt(page) - 1) * parseInt(limit);

  // Build sort object
  const sortObj = {};
  sortObj[sortBy] = order === 'desc' ? -1 : 1;

  // Get total count for pagination
  const total = await CodeFile.countDocuments(filter);

  // Get files with pagination
  const files = await CodeFile.find(filter)
    .sort(sortObj)
    .limit(parseInt(limit))
    .skip(skip)
    .select('-codeContent'); // Exclude code content for list view (for performance)

  res.status(200).json({
    success: true,
    message: 'Files retrieved successfully',
    data: files,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(total / parseInt(limit))
    }
  });
});

/**
 * Get a single code file by ID
 * GET /api/files/:id
 */
const getFileById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const file = await CodeFile.findById(id);

  if (!file) {
    return res.status(404).json({
      success: false,
      message: 'File not found'
    });
  }

  res.status(200).json({
    success: true,
    message: 'File retrieved successfully',
    data: file
  });
});

/**
 * Update a code file
 * PUT /api/files/:id
 * 
 * Body: {
 *   fileName?: string,
 *   folderPath?: string,
 *   language?: string,
 *   description?: string,
 *   codeContent?: string,
 *   tags?: string[]
 * }
 */
const updateFile = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { fileName, folderPath, language, description, codeContent, tags } = req.body;

  // Build update object with only provided fields
  const updateData = {};
  if (fileName !== undefined) updateData.fileName = fileName;
  if (folderPath !== undefined) updateData.folderPath = folderPath;
  if (language !== undefined) updateData.language = language.toLowerCase();
  if (description !== undefined) updateData.description = description;
  if (codeContent !== undefined) updateData.codeContent = codeContent;
  if (tags !== undefined) updateData.tags = tags;

  // Update file
  const file = await CodeFile.findByIdAndUpdate(
    id,
    updateData,
    { new: true, runValidators: true } // Return updated doc, run schema validators
  );

  if (!file) {
    return res.status(404).json({
      success: false,
      message: 'File not found'
    });
  }

  res.status(200).json({
    success: true,
    message: 'File updated successfully',
    data: file
  });
});

/**
 * Delete a code file
 * DELETE /api/files/:id
 */
const deleteFile = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const file = await CodeFile.findByIdAndDelete(id);

  if (!file) {
    return res.status(404).json({
      success: false,
      message: 'File not found'
    });
  }

  res.status(200).json({
    success: true,
    message: 'File deleted successfully',
    data: { id: file._id }
  });
});

/**
 * Get file statistics
 * GET /api/files/stats/overview
 */
const getFileStats = asyncHandler(async (req, res) => {
  const totalFiles = await CodeFile.countDocuments();
  
  // Get count by language
  const byLanguage = await CodeFile.aggregate([
    {
      $group: {
        _id: '$language',
        count: { $sum: 1 }
      }
    },
    { $sort: { count: -1 } }
  ]);

  // Get count by folder
  const byFolder = await CodeFile.aggregate([
    {
      $group: {
        _id: '$folderPath',
        count: { $sum: 1 }
      }
    },
    { $sort: { count: -1 } },
    { $limit: 10 } // Top 10 folders
  ]);

  res.status(200).json({
    success: true,
    message: 'Statistics retrieved successfully',
    data: {
      totalFiles,
      byLanguage,
      byFolder
    }
  });
});

export {
  createFile,
  getAllFiles,
  getFileById,
  updateFile,
  deleteFile,
  getFileStats
};
