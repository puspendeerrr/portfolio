import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import Project from '../models/Project.js';

const router = express.Router();

/**
 * GET /api/projects
 * Get all projects (public route)
 */
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find()
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    return res.status(200).json({
      success: true,
      message: 'Projects retrieved successfully',
      data: projects
    });
  } catch (error) {
    console.error('Error fetching projects:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch projects',
      error: error.message
    });
  }
});

/**
 * GET /api/projects/:id
 * Get single project by ID (public route)
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid project ID format'
      });
    }

    const project = await Project.findById(id).exec();

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Project retrieved successfully',
      data: project
    });
  } catch (error) {
    console.error('Error fetching project:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch project',
      error: error.message
    });
  }
});

/**
 * POST /api/projects
 * Create new project (protected route)
 * 
 * Body: {
 *   title: string (required),
 *   description: string (required),
 *   keyFeatures: string[] (optional),
 *   whatILearned: string (optional),
 *   techStack: string[] (optional),
 *   codeLink: string (required),
 *   liveLink: string (optional),
 *   tag: string (optional)
 * }
 */
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, description, keyFeatures, whatILearned, techStack, codeLink, liveLink, tag } = req.body;

    // Validate required fields
    if (!title || !description || !codeLink) {
      return res.status(400).json({
        success: false,
        message: 'Title, description, and code link are required'
      });
    }

    // Create new project
    const project = new Project({
      title: title.trim(),
      description: description.trim(),
      keyFeatures: Array.isArray(keyFeatures) ? keyFeatures : [],
      whatILearned: whatILearned ? whatILearned.trim() : '',
      techStack: Array.isArray(techStack) ? techStack : [],
      codeLink: codeLink.trim(),
      liveLink: liveLink ? liveLink.trim() : '',
      tag: tag ? tag.trim() : 'Project'
    });

    // Save to database
    await project.save();

    return res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: project
    });
  } catch (error) {
    console.error('Error creating project:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to create project',
      error: error.message
    });
  }
});

/**
 * PUT /api/projects/:id
 * Update project (protected route)
 */
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, keyFeatures, whatILearned, techStack, codeLink, liveLink, tag } = req.body;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid project ID format'
      });
    }

    // Build update object
    const updateData = {};
    if (title !== undefined) updateData.title = title.trim();
    if (description !== undefined) updateData.description = description.trim();
    if (keyFeatures !== undefined) updateData.keyFeatures = Array.isArray(keyFeatures) ? keyFeatures : [];
    if (whatILearned !== undefined) updateData.whatILearned = whatILearned ? whatILearned.trim() : '';
    if (techStack !== undefined) updateData.techStack = Array.isArray(techStack) ? techStack : [];
    if (codeLink !== undefined) updateData.codeLink = codeLink.trim();
    if (liveLink !== undefined) updateData.liveLink = liveLink ? liveLink.trim() : '';
    if (tag !== undefined) updateData.tag = tag ? tag.trim() : 'Project';

    const project = await Project.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).exec();

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Project updated successfully',
      data: project
    });
  } catch (error) {
    console.error('Error updating project:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to update project',
      error: error.message
    });
  }
});

/**
 * DELETE /api/projects/:id
 * Delete project (protected route)
 */
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid project ID format'
      });
    }

    const project = await Project.findByIdAndDelete(id).exec();

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Project deleted successfully',
      data: { id: project._id }
    });
  } catch (error) {
    console.error('Error deleting project:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete project',
      error: error.message
    });
  }
});

/**
 * POST /api/projects/:id/files
 * Upload multiple code files to a project (protected route)
 * Replaces existing files
 * 
 * Body: {
 *   files: Array<{
 *     path: string,
 *     language: string,
 *     content: string
 *   }>
 * }
 */
router.post('/:id/files', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { files } = req.body;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid project ID format'
      });
    }

    if (!Array.isArray(files)) {
      return res.status(400).json({
        success: false,
        message: 'Files must be an array'
      });
    }

    // Validate files array
    for (let file of files) {
      if (!file.path || !file.language || typeof file.content !== 'string') {
        return res.status(400).json({
          success: false,
          message: 'Each file must have path, language, and content'
        });
      }
    }

    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Replace files
    project.files = files;
    await project.save();

    return res.status(200).json({
      success: true,
      message: `Uploaded ${files.length} file(s)`,
      data: {
        projectId: project._id,
        fileCount: files.length
      }
    });
  } catch (error) {
    console.error('Error uploading files:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to upload files',
      error: error.message
    });
  }
});

export default router;
