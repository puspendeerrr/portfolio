import React, { useState } from 'react';
import { createProject } from '../../api/api';

interface CreateProjectFormProps {
  token: string;
  onProjectCreated: () => void;
}

const CreateProjectForm: React.FC<CreateProjectFormProps> = ({ token, onProjectCreated }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    keyFeatures: '',
    whatILearned: '',
    techStack: '',
    codeLink: '',
    liveLink: '',
    tag: 'Project'
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Validate required fields
      if (!formData.title || !formData.description || !formData.codeLink) {
        throw new Error('Title, description, and code link are required');
      }

      // Convert comma-separated strings to arrays
      const projectData = {
        title: formData.title,
        description: formData.description,
        keyFeatures: formData.keyFeatures
          .split(',')
          .map(f => f.trim())
          .filter(f => f),
        whatILearned: formData.whatILearned,
        techStack: formData.techStack
          .split(',')
          .map(t => t.trim())
          .filter(t => t),
        codeLink: formData.codeLink,
        liveLink: formData.liveLink || undefined,
        tag: formData.tag
      };

      const response = await createProject(token, projectData);

      if (response.success) {
        setSuccess('Project created successfully!');
        setFormData({
          title: '',
          description: '',
          keyFeatures: '',
          whatILearned: '',
          techStack: '',
          codeLink: '',
          liveLink: '',
          tag: 'Project'
        });
        onProjectCreated();
      } else {
        throw new Error(response.message || 'Failed to create project');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create project');
      console.error('Create project error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-project-form">
      <h2 style={{ marginTop: 0 }}>Create New Project</h2>

      {success && (
        <div className="success-message">
          {success}
        </div>
      )}
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Project Title *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter project title"
            disabled={loading}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description *</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter project description"
            rows={3}
            disabled={loading}
            className="form-textarea"
          />
        </div>

        <div className="form-group">
          <label htmlFor="keyFeatures">Key Features (comma-separated)</label>
          <textarea
            id="keyFeatures"
            name="keyFeatures"
            value={formData.keyFeatures}
            onChange={handleChange}
            placeholder="e.g., Feature 1, Feature 2, Feature 3"
            rows={2}
            disabled={loading}
            className="form-textarea"
          />
        </div>

        <div className="form-group">
          <label htmlFor="whatILearned">What I Learned</label>
          <textarea
            id="whatILearned"
            name="whatILearned"
            value={formData.whatILearned}
            onChange={handleChange}
            placeholder="Enter learnings from this project"
            rows={2}
            disabled={loading}
            className="form-textarea"
          />
        </div>

        <div className="form-group">
          <label htmlFor="techStack">Tech Stack (comma-separated)</label>
          <input
            type="text"
            id="techStack"
            name="techStack"
            value={formData.techStack}
            onChange={handleChange}
            placeholder="e.g., React, Node.js, MongoDB"
            disabled={loading}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="codeLink">Code Link *</label>
          <input
            type="url"
            id="codeLink"
            name="codeLink"
            value={formData.codeLink}
            onChange={handleChange}
            placeholder="https://github.com/your/repo"
            disabled={loading}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="liveLink">Live Link (optional)</label>
          <input
            type="url"
            id="liveLink"
            name="liveLink"
            value={formData.liveLink}
            onChange={handleChange}
            placeholder="https://example.com"
            disabled={loading}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="tag">Tag</label>
          <input
            type="text"
            id="tag"
            name="tag"
            value={formData.tag}
            onChange={handleChange}
            placeholder="e.g., Self-hosted, Production"
            disabled={loading}
            className="form-input"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn btn--primary"
          style={{ width: '100%', marginTop: '12px' }}
        >
          {loading ? 'Creating...' : 'Create Project'}
        </button>
      </form>

      <div className="project-upload-hint">
        <p className="hint-title">📁 Add Project Files</p>
        <p className="hint-text">After creating your project, select it from the "Upload Project Files" section below to upload your entire project folder as a professional code explorer.</p>
      </div>
    </div>
  );
};

export default CreateProjectForm;
