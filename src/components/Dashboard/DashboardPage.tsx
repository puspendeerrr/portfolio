import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFiles, deleteFile, deleteAllFiles, getProjects } from '../../api/api';
import CreateFileForm from './CreateFileForm';
import UploadFolderButton from './UploadFolderButton';
import CreateProjectForm from './CreateProjectForm';
import UploadProjectFolder from './UploadProjectFolder';
import ProjectList from './ProjectList';
import './DashboardPage.css';
import './ProjectsManagement.css';

/**
 * Dashboard Component
 * Displays list of code files with filtering and pagination
 * Allows creating, viewing, and managing files
 * 
 * IMPORTANT: Access is protected by ProtectedRoute component
 * Token is checked on every component mount and API call
 */
const DashboardPage = () => {
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({});
  const [filter, setFilter] = useState({
    programmingLanguage: '',
    page: 1,
    limit: 10
  });
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [deleteAllLoading, setDeleteAllLoading] = useState(false);

  // Projects management state
  const [projects, setProjects] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  // Get token from localStorage
  const token = localStorage.getItem('token');

  // Fetch files on mount and when filter changes
  useEffect(() => {
    // Verify token exists (ProtectedRoute already checks this, but double-check)
    if (!token) {
      navigate('/login', { replace: true });
      return;
    }

    fetchFiles();
  }, [token, navigate, filter]);

  // Fetch projects on mount
  useEffect(() => {
    if (!token) {
      return;
    }

    fetchProjects();
  }, [token]);

  const fetchFiles = async () => {
    setLoading(true);
    setError('');

    try {
      const params = {
        limit: filter.limit,
        page: filter.page
      };

      if (filter.programmingLanguage) {
        params.programmingLanguage = filter.programmingLanguage;
      }

      const response = await getFiles(token, params);

      if (response.success) {
        setFiles(response.data || []);
        setPagination(response.pagination || {});
      } else {
        throw new Error(response.message || 'Failed to fetch files');
      }
    } catch (err) {
      if (err.message.includes('Unauthorized')) {
        // Token expired, redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('tokenExpiry');
        navigate('/login', { replace: true });
      } else {
        setError(err.message || 'Failed to fetch files');
      }
      console.error('Fetch files error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProjects = async () => {
    setProjectsLoading(true);

    try {
      const response = await getProjects();

      if (response.success) {
        setProjects(response.data || []);
      } else {
        throw new Error(response.message || 'Failed to fetch projects');
      }
    } catch (err) {
      console.error('Fetch projects error:', err);
    } finally {
      setProjectsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('tokenExpiry');
    navigate('/login', { replace: true });
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter(prev => ({
      ...prev,
      [name]: value,
      page: 1 // Reset to first page when filtering
    }));
  };

  const handleDeleteFile = async (fileId, fileName) => {
    if (!window.confirm(`Are you sure you want to delete "${fileName}"?`)) {
      return;
    }

    setDeleteLoading(fileId);

    try {
      const response = await deleteFile(token, fileId);

      if (response.success) {
        // Refresh file list
        fetchFiles();
      } else {
        setError(response.message || 'Failed to delete file');
      }
    } catch (err) {
      setError(err.message || 'Failed to delete file');
      console.error('Delete file error:', err);
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleDeleteAllFiles = async () => {
    if (!window.confirm('Are you sure you want to delete ALL files? This cannot be undone.')) {
      return;
    }

    setDeleteAllLoading(true);
    setError('');

    try {
      const response = await deleteAllFiles(token);

      if (response.success) {
        // Clear files and reset pagination
        setFiles([]);
        setPagination({});
        setFilter({
          programmingLanguage: '',
          page: 1,
          limit: 10
        });
      } else {
        setError(response.message || 'Failed to delete all files');
      }
    } catch (err) {
      if (err.message.includes('Unauthorized')) {
        // Token expired, redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('tokenExpiry');
        navigate('/login', { replace: true });
      } else {
        setError(err.message || 'Failed to delete all files');
      }
      console.error('Delete all files error:', err);
    } finally {
      setDeleteAllLoading(false);
    }
  };

  const handlePaginationChange = (newPage) => {
    setFilter(prev => ({
      ...prev,
      page: newPage
    }));
  };

  const handleFileCreated = () => {
    // Reset filter and fetch files again
    setFilter({
      programmingLanguage: '',
      page: 1,
      limit: 10
    });
  };

  const handleProjectCreated = () => {
    // Refresh projects list
    fetchProjects();
  };

  const handleProjectDeleted = () => {
    // Refresh projects list
    fetchProjects();
  };

  const languages = [
    'javascript', 'typescript', 'python', 'cpp', 'java', 'csharp',
    'php', 'ruby', 'go', 'rust', 'sql', 'html', 'css', 'json',
    'xml', 'yaml', 'markdown'
  ];

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <h1>📁 Code Library Dashboard</h1>
        <div className="header-actions">
          <button
            onClick={handleDeleteAllFiles}
            disabled={deleteAllLoading || files.length === 0}
            className="delete-all-button"
            title="Delete all files"
          >
            {deleteAllLoading ? '🔄 Deleting...' : '�️ Delete All Files'}
          </button>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      </header>

      {/* Create File Form and Upload Folder */}
      <div className="dashboard-actions">
        <CreateFileForm token={token} onFileCreated={handleFileCreated} />
        <UploadFolderButton token={token} onUploadSuccess={handleFileCreated} />
      </div>

      {/* Filter Section */}
      <div className="filter-section">
        <div className="filter-group">
          <label htmlFor="language-filter">Filter by Language:</label>
          <select
            id="language-filter"
            name="programmingLanguage"
            value={filter.programmingLanguage}
            onChange={handleFilterChange}
          >
            <option value="">All Languages</option>
            {languages.map(lang => (
              <option key={lang} value={lang}>
                {lang.charAt(0).toUpperCase() + lang.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-info">
          {pagination.total !== undefined && (
            <span className="total-files">
              Total: {pagination.total} file{pagination.total !== 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="error-banner">
          <span className="error-icon">⚠️</span>
          {error}
          <button
            onClick={() => setError('')}
            className="close-error"
            aria-label="Close error"
          >
            ✕
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading files...</p>
        </div>
      ) : files.length === 0 ? (
        <div className="empty-state">
          <p>📭 No files found</p>
          <p className="empty-description">
            {filter.programmingLanguage
              ? `No files found for ${filter.programmingLanguage}`
              : 'Create your first code file to get started'}
          </p>
        </div>
      ) : (
        <>
          {/* Files Grid */}
          <div className="files-grid">
            {files.map(file => (
              <div key={file._id} className="file-card">
                <div className="card-header">
                  <h3 className="file-name">{file.fileName}</h3>
                  <span className="language-badge">
                    {file.programmingLanguage}
                  </span>
                </div>

                <p className="file-path">📂 {file.folderPath}</p>

                <p className="file-description">{file.description}</p>

                {file.tags && file.tags.length > 0 && (
                  <div className="tags">
                    {file.tags.map((tag, idx) => (
                      <span key={idx} className="tag">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="card-footer">
                  <span className="file-date">
                    {new Date(file.createdAt).toLocaleDateString()}
                  </span>
                  <button
                    onClick={() => handleDeleteFile(file._id, file.fileName)}
                    disabled={deleteLoading === file._id}
                    className="delete-button"
                    title="Delete file"
                  >
                    {deleteLoading === file._id ? '🔄' : '🗑️'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination.pages && pagination.pages > 1 && (
            <div className="pagination">
              <button
                onClick={() => handlePaginationChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="pagination-button"
              >
                ← Previous
              </button>

              <div className="pagination-info">
                Page {pagination.page} of {pagination.pages}
              </div>

              <button
                onClick={() => handlePaginationChange(pagination.page + 1)}
                disabled={!pagination.hasNext}
                className="pagination-button"
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}

      {/* Projects Management Section */}
      {token && (
        <div className="projects-management-section">
          <div className="projects-grid">
            <div className="create-project-form-container">
              <CreateProjectForm token={token} onProjectCreated={handleProjectCreated} />
              
              {projects.length > 0 && (
                <div className="project-upload-section">
                  <h3>Upload Project Files</h3>
                  <p className="upload-hint">Select a project to upload files to:</p>
                  <select 
                    className="project-select"
                    value={selectedProjectId || ''}
                    onChange={(e) => setSelectedProjectId(e.target.value || null)}
                  >
                    <option value="">Choose a project...</option>
                    {projects.map(project => (
                      <option key={project._id} value={project._id}>
                        {project.title}
                      </option>
                    ))}
                  </select>
                  
                  {selectedProjectId && (
                    <div style={{ marginTop: '16px' }}>
                      <UploadProjectFolder
                        token={token}
                        projectId={selectedProjectId}
                        onUploadSuccess={handleProjectCreated}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>

            <div>
              {projectsLoading ? (
                <div className="projects-list-container">
                  <h2>Projects</h2>
                  <div style={{ padding: '20px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                    Loading projects...
                  </div>
                </div>
              ) : (
                <ProjectList projects={projects} token={token} onProjectDeleted={handleProjectDeleted} />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
