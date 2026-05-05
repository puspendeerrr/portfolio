import { useState } from 'react';
import { createFile } from '../../api/api';
import './CreateFileForm.css';

/**
 * Create File Form Component
 * Form to create new code files
 * Fields: fileName, folderPath, programmingLanguage, description, codeContent, tags
 */
const CreateFileForm = ({ token, onFileCreated }) => {
  const [formData, setFormData] = useState({
    fileName: '',
    folderPath: '',
    programmingLanguage: 'javascript',
    description: '',
    codeContent: '',
    tags: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const languages = [
    'javascript', 'typescript', 'python', 'cpp', 'java', 'csharp',
    'php', 'ruby', 'go', 'rust', 'sql', 'html', 'css', 'json',
    'xml', 'yaml', 'markdown'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Validate required fields
      if (!formData.fileName.trim()) {
        throw new Error('File name is required');
      }
      if (!formData.folderPath.trim()) {
        throw new Error('Folder path is required');
      }
      if (!formData.description.trim()) {
        throw new Error('Description is required');
      }
      if (!formData.codeContent.trim()) {
        throw new Error('Code content is required');
      }

      // Prepare file data
      const fileData = {
        fileName: formData.fileName.trim(),
        folderPath: formData.folderPath.trim(),
        programmingLanguage: formData.programmingLanguage,
        description: formData.description.trim(),
        codeContent: formData.codeContent.trim(),
        tags: formData.tags
          .split(',')
          .map(tag => tag.trim())
          .filter(tag => tag.length > 0)
      };

      // Create file
      const response = await createFile(token, fileData);

      if (response.success) {
        setSuccess('File created successfully!');
        
        // Reset form
        setFormData({
          fileName: '',
          folderPath: '',
          programmingLanguage: 'javascript',
          description: '',
          codeContent: '',
          tags: ''
        });

        // Close form after success
        setTimeout(() => {
          setShowForm(false);
          if (onFileCreated) {
            onFileCreated();
          }
        }, 1500);
      } else {
        throw new Error(response.message || 'Failed to create file');
      }
    } catch (err) {
      setError(err.message || 'Failed to create file. Please try again.');
      console.error('Create file error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!showForm) {
    return (
      <button
        onClick={() => setShowForm(true)}
        className="create-file-button"
      >
        ➕ Create New File
      </button>
    );
  }

  return (
    <div className="create-file-form-container">
      <div className="create-file-modal">
        <div className="form-header">
          <h2>Create New Code File</h2>
          <button
            type="button"
            onClick={() => setShowForm(false)}
            className="close-button"
            aria-label="Close form"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="create-file-form">
          <div className="form-group">
            <label htmlFor="fileName">File Name *</label>
            <input
              id="fileName"
              type="text"
              name="fileName"
              value={formData.fileName}
              onChange={handleInputChange}
              placeholder="e.g., App.tsx"
              disabled={loading}
              maxLength={100}
            />
          </div>

          <div className="form-group">
            <label htmlFor="folderPath">Folder Path *</label>
            <input
              id="folderPath"
              type="text"
              name="folderPath"
              value={formData.folderPath}
              onChange={handleInputChange}
              placeholder="e.g., src/components/App"
              disabled={loading}
              maxLength={500}
            />
          </div>

          <div className="form-group">
            <label htmlFor="programmingLanguage">Programming Language *</label>
            <select
              id="programmingLanguage"
              name="programmingLanguage"
              value={formData.programmingLanguage}
              onChange={handleInputChange}
              disabled={loading}
            >
              {languages.map(lang => (
                <option key={lang} value={lang}>
                  {lang.charAt(0).toUpperCase() + lang.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe what this code does..."
              disabled={loading}
              rows={3}
              maxLength={1000}
            />
          </div>

          <div className="form-group">
            <label htmlFor="codeContent">Code Content *</label>
            <textarea
              id="codeContent"
              name="codeContent"
              value={formData.codeContent}
              onChange={handleInputChange}
              placeholder="Paste your code here..."
              disabled={loading}
              rows={8}
            />
          </div>

          <div className="form-group">
            <label htmlFor="tags">Tags (comma-separated, optional)</label>
            <input
              id="tags"
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleInputChange}
              placeholder="e.g., component, ui, reusable"
              disabled={loading}
            />
          </div>

          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          {success && (
            <div className="success-message">
              <span className="success-icon">✓</span>
              {success}
            </div>
          )}

          <div className="form-actions">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="cancel-button"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="submit-button"
            >
              {loading ? 'Creating...' : 'Create File'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateFileForm;
