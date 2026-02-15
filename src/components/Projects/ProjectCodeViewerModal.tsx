import React from 'react';
import CodeViewer from '../CodeLibrary/CodeViewer';
import './ProjectCodeViewerModal.css';

interface Project {
  _id: string;
  title: string;
  description: string;
  keyFeatures: string[];
  whatILearned: string;
  techStack: string[];
  codeLink: string;
  liveLink?: string;
  tag: string;
  createdAt: string;
  codeContent?: string;
  programmingLanguage?: string;
}

interface ProjectCodeViewerModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProjectCodeViewerModal: React.FC<ProjectCodeViewerModalProps> = ({ project, isOpen, onClose }) => {
  if (!isOpen || !project) {
    return null;
  }

  // Convert project to file format for CodeViewer
  const fileData = {
    _id: project._id,
    fileName: project.title,
    folderPath: project.tag,
    programmingLanguage: project.programmingLanguage || 'javascript',
    codeContent: project.codeContent || '// No code content available\n// Visit: ' + project.codeLink,
    createdAt: project.createdAt,
    description: project.description,
    tags: project.techStack
  };

  return (
    <div className={`project-code-viewer-modal ${isOpen ? 'open' : ''}`}>
      <div className="modal-overlay" onClick={onClose} />
      <div className="modal-content">
        <div className="modal-header">
          <h2>{project.title}</h2>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>
        <div className="modal-body">
          <CodeViewer file={fileData} />
        </div>
        <div className="modal-footer">
          <a
            href={project.codeLink}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn--primary"
          >
            View on GitHub
          </a>
          <button className="btn btn--secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectCodeViewerModal;
