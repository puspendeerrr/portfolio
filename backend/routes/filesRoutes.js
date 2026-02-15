import express from 'express';
import { body } from 'express-validator';
import authMiddleware from '../middleware/authMiddleware.js';
import handleValidationErrors from '../middleware/validationHandler.js';
import CodeFile from '../models/CodeFile.js';

const router = express.Router();

/**
 * GET /api/files
 * Get all code files WITH codeContent
 */
router.get('/', async (req, res) => {
  try {
    const {
      programmingLanguage,
      sortBy = 'createdAt',
      order = 'desc',
      limit = 20,
      page = 1
    } = req.query;

    const filter = {};

    if (programmingLanguage) {
      filter.programmingLanguage = programmingLanguage.toLowerCase();
    }

    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 20));
    const skip = (pageNum - 1) * limitNum;

    const validSortFields = [
      'fileName',
      'folderPath',
      'programmingLanguage',
      'createdAt',
      'updatedAt'
    ];

    const sortField = validSortFields.includes(sortBy)
      ? sortBy
      : 'createdAt';

    const sortObj = {};
    sortObj[sortField] = order === 'asc' ? 1 : -1;

    const [files, total] = await Promise.all([
      CodeFile.find(filter)
        .sort(sortObj)
        .limit(limitNum)
        .skip(skip)
        .lean()
        .exec(),
      CodeFile.countDocuments(filter).exec()
    ]);

    return res.status(200).json({
      success: true,
      message: 'Files retrieved successfully',
      data: files,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum),
        hasNext: pageNum < Math.ceil(total / limitNum),
        hasPrev: pageNum > 1
      }
    });

  } catch (error) {
    console.error('Error fetching files:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch files',
      error: error.message
    });
  }
});

/**
 * POST /api/files
 */
router.post('/', authMiddleware, async (req, res) => {
  try {
    const file = await CodeFile.create(req.body);

    return res.status(201).json({
      success: true,
      message: "File created successfully",
      data: file
    });

  } catch (error) {
    console.error("Error creating file:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create file",
      error: error.message
    });
  }
});

/**
 * GET /api/files/:id
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid file ID format'
      });
    }

    const file = await CodeFile.findById(id).exec();

    if (!file) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'File retrieved successfully',
      data: file
    });

  } catch (error) {
    console.error('Error fetching file:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch file',
      error: error.message
    });
  }
});

/**
 * PUT /api/files/:id
 */
router.put(
  '/:id',
  authMiddleware,
  [
    body('fileName').optional().trim().isLength({ max: 100 }),
    body('folderPath').optional().trim().isLength({ max: 500 }),
    body('programmingLanguage')
      .optional()
      .trim()
      .isIn([
        'javascript', 'typescript', 'python', 'cpp', 'java',
        'csharp', 'php', 'ruby', 'go', 'rust', 'sql',
        'html', 'css', 'json', 'xml', 'yaml', 'markdown'
      ]),
    body('description').optional().trim().isLength({ max: 1000 }),
    body('tags').optional().isArray()
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { id } = req.params;

      if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid file ID format'
        });
      }

      const file = await CodeFile.findByIdAndUpdate(
        id,
        req.body,
        { new: true, runValidators: true }
      ).exec();

      if (!file) {
        return res.status(404).json({
          success: false,
          message: 'File not found'
        });
      }

      return res.status(200).json({
        success: true,
        message: 'File updated successfully',
        data: file
      });

    } catch (error) {
      console.error('Error updating file:', error.message);
      return res.status(500).json({
        success: false,
        message: 'Failed to update file',
        error: error.message
      });
    }
  }
);

/**
 * DELETE /api/files
 * Delete all code files (protected route)
 */
router.delete('/', authMiddleware, async (req, res) => {
  try {
    const result = await CodeFile.deleteMany({});

    return res.status(200).json({
      success: true,
      message: 'All files deleted successfully',
      deletedCount: result.deletedCount
    });

  } catch (error) {
    console.error('Error deleting all files:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete all files',
      error: error.message
    });
  }
});

/**
 * DELETE /api/files/:id
 */
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid file ID format'
      });
    }

    const file = await CodeFile.findByIdAndDelete(id).exec();

    if (!file) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'File deleted successfully',
      data: { id: file._id }
    });

  } catch (error) {
    console.error('Error deleting file:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete file',
      error: error.message
    });
  }
});

/**
 * POST /api/files/bulk-upload
 */
router.post('/bulk-upload', async (req, res) => {
  try {
    const { files } = req.body;

    if (!Array.isArray(files) || files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Files must be a non-empty array'
      });
    }

    const insertedFiles = await CodeFile.insertMany(files);

    return res.status(201).json({
      success: true,
      message: `Successfully uploaded ${insertedFiles.length} file(s)`,
      data: insertedFiles
    });

  } catch (error) {
    console.error('Bulk upload error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Bulk upload failed',
      error: error.message
    });
  }
});

export default router;
