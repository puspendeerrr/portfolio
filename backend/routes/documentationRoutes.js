import express from 'express';
import {
  getDocumentations,
  createDocumentation,
  deleteDocumentation
} from '../controllers/documentationController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import documentUpload from '../middleware/documentUploadMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getDocumentations)
  .post(authMiddleware, documentUpload.single('file'), createDocumentation);

router.route('/:id')
  .delete(authMiddleware, deleteDocumentation);

export default router;
