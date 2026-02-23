import React, { useState } from 'react';
import { deleteProject } from '../../api/api';

interface Project {
  _id: string;
  title: string;
  description: string;
  tag: string;
  codeLink: string;
  createdAt: string;
}

interface ProjectListProps {
  projects: Project[];
  token: string;
  onProjectDeleted: () => void;
}

const ProjectList: React.FC<ProjectListProps> = ({ projects, token, onProjectDeleted }) => {
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState('');

  const handleDelete = async (projectId: string, projectTitle: string) => {
    if (!window.confirm(`Are you sure you want to delete "${projectTitle}"?`)) {
      return;
    }

    setDeleting(projectId);
    setError('');

    try {
      const response = await deleteProject(token, projectId);

      if (response.success) {
        onProjectDeleted();
      } else {
        throw new Error(response.message || 'Failed to delete project');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete project');
      console.error('Delete project error:', err);
    } finally {
      setDeleting(null);
    }
  };

  if (projects.length === 0) {
    return (
      <div className="projects-list-container">
        <h2>Projects</h2>
        <p style={{ color: 'var(--color-text-muted)' }}>No projects yet. Create one above.</p>
      </div>
    );
  }

  return (
    <div className="projects-list-container">
      <h2>Existing Projects ({projects.length})</h2>
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="projects-table">
        <div className="table-header">
          <div className="col-title">Title</div>
          <div className="col-tag">Tag</div>
          <div className="col-date">Created</div>
          <div className="col-action">Action</div>
        </div>

        {projects.map(project => (
          <div key={project._id} className="table-row">
            <div className="col-title">
              <strong>{project.title}</strong>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', margin: '4px 0 0 0' }}>
                {project.description.substring(0, 60)}...
              </p>
            </div>
            <div className="col-tag">
              <span className="tag">{project.tag}</span>
            </div>
            <div className="col-date">
              {new Date(project.createdAt).toLocaleDateString()}
            </div>
            <div className="col-action">
              <button
                onClick={() => handleDelete(project._id, project.title)}
                disabled={deleting === project._id}
                className="btn-delete"
              >
                {deleting === project._id ? '🔄' : '🗑️'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectList;
