import mongoose from 'mongoose';

/**
 * CodeFile Schema - Stores code snippets/files for the code library
 * 
 * Fields:
 * - fileName: Name of the file (e.g., "App.tsx")
 * - folderPath: Folder structure path (e.g., "src/components/App")
 * - programmingLanguage: Programming language (e.g., "typescript", "python", "cpp")
 * - description: Description of what the code does
 * - codeContent: The actual code content
 * - createdAt: Auto-generated timestamp
 * - updatedAt: Auto-generated timestamp
 */
const codeFileSchema = new mongoose.Schema(
  {
    fileName: {
      type: String,
      required: [true, 'File name is required'],
      trim: true,
      maxlength: [100, 'File name cannot exceed 100 characters'],
      match: [/^[\w\-. ]+$/, 'File name contains invalid characters']
    },
    folderPath: {
      type: String,
      required: [true, 'Folder path is required'],
      trim: true,
      maxlength: [500, 'Folder path cannot exceed 500 characters']
    },
    programmingLanguage: {
      type: String,
      required: [true, 'Programming language is required'],
      enum: [
        'javascript',
        'typescript',
        'python',
        'cpp',
        'java',
        'csharp',
        'php',
        'ruby',
        'go',
        'rust',
        'sql',
        'html',
        'css',
        'json',
        'xml',
        'yaml',
        'markdown'
      ],
      lowercase: true
    },
    description: {
      type: String, 
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    codeContent: {
      type: String,
      required: [true, 'Code content is required'],
      maxlength: [1000000, 'Code content is too large (max 1MB)']
    },
    tags: {
      type: [String],
      default: [],
      validate: [
        (v) => v.length <= 20,
        'Maximum 20 tags allowed'
      ]
    }
  },
  {
    timestamps: true,
    collection: 'codefiles'  // Explicit collection name
  }
);

// Create indexes for better performance
codeFileSchema.index({ fileName: 'text', folderPath: 'text', description: 'text' });
codeFileSchema.index({ programmingLanguage: 1 });
codeFileSchema.index({ createdAt: -1 });
codeFileSchema.index({ fileName: 1 });

const CodeFile = mongoose.model('CodeFile', codeFileSchema);

export default CodeFile;
