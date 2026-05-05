import mongoose from 'mongoose';

/**
 * Documentation Schema - Stores research and documentation items
 * 
 * Fields:
 * - title: Documentation title
 * - date: Date string (e.g., "Jan 2026")
 * - points: Array of key points/learnings
 * - link: External link to the document
 */
const documentationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters']
    },
    date: {
      type: String,
      required: [true, 'Date string is required'],
      trim: true
    },
    points: {
      type: [String],
      default: [],
      validate: [
        (v) => v.length <= 15,
        'Maximum 15 points allowed'
      ]
    },
    fileUrl: {
      type: String,
      required: [true, 'File URL is required'],
      trim: true
    },
    fileName: {
      type: String,
      required: [true, 'File name is required'],
      trim: true
    },
    fileType: {
      type: String,
      required: [true, 'File type is required'],
      trim: true
    }
  },
  {
    timestamps: true,
    collection: 'documentations'
  }
);

const Documentation = mongoose.model('Documentation', documentationSchema);

export default Documentation;
