import mongoose from 'mongoose';

/**
 * Project Schema - Stores portfolio projects
 * 
 * Fields:
 * - title: Project title
 * - description: Project description/summary
 * - keyFeatures: Array of key features
 * - whatILearned: What was learned from this project
 * - techStack: Array of technologies used
 * - codeLink: Link to source code (required)
 * - liveLink: Link to live demo (optional)
 * - tag: Project tag/category (e.g., "Self-hosted", "Production")
 * - createdAt: Timestamp
 * - updatedAt: Timestamp
 */
const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters']
    },
    description: {
      type: String,
      required: [true, 'Project description is required'],
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters']
    },
    keyFeatures: {
      type: [String],
      default: [],
      validate: [
        (v) => v.length <= 10,
        'Maximum 10 key features allowed'
      ]
    },
    whatILearned: {
      type: String,
      trim: true,
      maxlength: [1000, 'Learning notes cannot exceed 1000 characters']
    },
    techStack: {
      type: [String],
      default: [],
      validate: [
        (v) => v.length <= 20,
        'Maximum 20 tech stack items allowed'
      ]
    },
    codeLink: {
      type: String,
      required: [true, 'Code link is required'],
      trim: true,
      validate: {
        validator: function(v) {
          return /^https?:\/\/.+/.test(v);
        },
        message: 'Code link must be a valid URL'
      }
    },
    liveLink: {
      type: String,
      trim: true,
      validate: {
        validator: function(v) {
          if (v === '') return true; // Allow empty
          return /^https?:\/\/.+/.test(v);
        },
        message: 'Live link must be a valid URL'
      }
    },
    tag: {
      type: String,
      default: 'Project',
      trim: true,
      maxlength: [50, 'Tag cannot exceed 50 characters']
    },
    codeContent: {
      type: String,
      default: '',
      maxlength: [50000, 'Code content cannot exceed 50000 characters']
    },
    programmingLanguage: {
      type: String,
      default: 'javascript',
      enum: [
        'javascript', 'typescript', 'python', 'cpp', 'java', 'csharp',
        'php', 'ruby', 'go', 'rust', 'sql', 'html', 'css', 'json',
        'xml', 'yaml', 'markdown', 'bash', 'dockerfile', 'jsx', 'tsx'
      ]
    },
    files: {
      type: [
        {
          path: { type: String, required: true },
          language: { type: String, default: 'javascript' },
          content: { type: String, default: '' }
        }
      ],
      default: []
    }
  },
  {
    timestamps: true,
    collection: 'projects'
  }
);

// Indexes
projectSchema.index({ title: 'text', description: 'text' });
projectSchema.index({ createdAt: -1 });

const Project = mongoose.model('Project', projectSchema);

export default Project;
