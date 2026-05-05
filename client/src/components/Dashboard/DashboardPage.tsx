import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFiles, deleteFile, deleteAllFiles, getProjects } from '../../api/api';
import CreateFileForm from './CreateFileForm';
import UploadFolderButton from './UploadFolderButton';
import CreateProjectForm from './CreateProjectForm';
import UploadProjectFolder from './UploadProjectFolder';
import ProjectList from './ProjectList';
import HeroSlidesManager from './HeroSlidesManager';
import { DocumentationManagement } from './DocumentationManagement';
import './DashboardPage.css';
import './ProjectsManagement.css';

type TabId = 'code' | 'projects' | 'hero' | 'docs';

const DashboardPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabId>('docs');
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState<any>({});
  const [filter, setFilter] = useState({
    programmingLanguage: '',
    page: 1,
    limit: 10
  });
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [deleteAllLoading, setDeleteAllLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) { navigate('/login', { replace: true }); return; }
    fetchFiles();
  }, [token, navigate, filter]);

  useEffect(() => {
    if (!token) return;
    fetchProjects();
  }, [token]);

  const fetchFiles = async () => {
    setLoading(true); setError('');
    try {
      const params: any = { limit: filter.limit, page: filter.page };
      if (filter.programmingLanguage) params.programmingLanguage = filter.programmingLanguage;
      const response = await getFiles(token, params);
      if (response.success) {
        setFiles(response.data || []);
        setPagination(response.pagination || {});
      } else throw new Error(response.message || 'Failed to fetch files');
    } catch (err: any) {
      if (err.message.includes('Unauthorized')) {
        localStorage.removeItem('token'); localStorage.removeItem('tokenExpiry');
        navigate('/login', { replace: true });
      } else setError(err.message || 'Failed to fetch files');
    } finally { setLoading(false); }
  };

  const fetchProjects = async () => {
    setProjectsLoading(true);
    try {
      const response = await getProjects();
      if (response.success) setProjects(response.data || []);
    } catch (err) { console.error('Fetch projects error:', err); }
    finally { setProjectsLoading(false); }
  };

  const handleLogout = () => {
    localStorage.removeItem('token'); localStorage.removeItem('tokenExpiry');
    navigate('/login', { replace: true });
  };

  const handleFilterChange = (e: any) => {
    const { name, value } = e.target;
    setFilter(prev => ({ ...prev, [name]: value, page: 1 }));
  };

  const handleDeleteFile = async (fileId: string, fileName: string) => {
    if (!window.confirm(`Delete "${fileName}"?`)) return;
    setDeleteLoading(fileId);
    try {
      const response = await deleteFile(token, fileId);
      if (response.success) fetchFiles();
      else setError(response.message || 'Failed to delete file');
    } catch (err: any) { setError(err.message || 'Failed to delete file'); }
    finally { setDeleteLoading(null); }
  };

  const handleDeleteAllFiles = async () => {
    if (!window.confirm('Delete ALL files? This cannot be undone.')) return;
    setDeleteAllLoading(true); setError('');
    try {
      const response = await deleteAllFiles(token);
      if (response.success) { setFiles([]); setPagination({}); setFilter({ programmingLanguage: '', page: 1, limit: 10 }); }
      else setError(response.message || 'Failed to delete all files');
    } catch (err: any) {
      if (err.message.includes('Unauthorized')) {
        localStorage.removeItem('token'); localStorage.removeItem('tokenExpiry');
        navigate('/login', { replace: true });
      } else setError(err.message || 'Failed to delete all files');
    } finally { setDeleteAllLoading(false); }
  };

  const handlePaginationChange = (newPage: number) => setFilter(prev => ({ ...prev, page: newPage }));

  const handleFileCreated = () => setFilter({ programmingLanguage: '', page: 1, limit: 10 });

  const handleProjectCreated = () => fetchProjects();
  const handleProjectDeleted = () => fetchProjects();

  const languages = ['javascript','typescript','python','cpp','java','csharp','php','ruby','go','rust','sql','html','css','json','xml','yaml','markdown'];

  const tabs: { id: TabId; label: string; icon: string }[] = [
    { id: 'docs', label: 'Documentations', icon: '📚' },
    { id: 'projects', label: 'Projects', icon: '🚀' },
    { id: 'hero', label: 'Hero Slides', icon: '🖼️' },
    { id: 'code', label: 'Code Library', icon: '💾' },
  ];

  return (
    <div className="db-shell">
      {/* Sidebar */}
      <aside className="db-sidebar">
        <div className="db-brand">
          <div className="db-brand-mark">P</div>
          <div>
            <div className="db-brand-name">Puspender</div>
            <div className="db-brand-role">Admin Panel</div>
          </div>
        </div>

        <nav className="db-nav">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`db-nav-item ${activeTab === tab.id ? 'db-nav-item--active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="db-nav-icon">{tab.icon}</span>
              <span className="db-nav-label">{tab.label}</span>
            </button>
          ))}
        </nav>

        <div className="db-sidebar-footer">
          <a href="/" target="_blank" className="db-view-site">
            ↗ View Portfolio
          </a>
          <button onClick={handleLogout} className="db-logout">
            Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="db-main">
        {/* Top Bar */}
        <header className="db-topbar">
          <div>
            <h1 className="db-page-title">
              {tabs.find(t => t.id === activeTab)?.icon} {tabs.find(t => t.id === activeTab)?.label}
            </h1>
            <p className="db-page-subtitle">Manage your portfolio content</p>
          </div>
          <div className="db-topbar-actions">
            {activeTab === 'code' && (
              <button
                onClick={handleDeleteAllFiles}
                disabled={deleteAllLoading || files.length === 0}
                className="db-btn db-btn--danger"
              >
                {deleteAllLoading ? 'Deleting...' : 'Delete All Files'}
              </button>
            )}
          </div>
        </header>

        {/* Error Banner */}
        {error && (
          <div className="db-error-banner">
            <span>⚠️ {error}</span>
            <button onClick={() => setError('')}>✕</button>
          </div>
        )}

        {/* Tab Content */}
        <div className="db-content">

          {/* Documentation Tab */}
          {activeTab === 'docs' && token && (
            <DocumentationManagement token={token} />
          )}

          {/* Hero Slides Tab */}
          {activeTab === 'hero' && token && (
            <div className="db-card">
              <HeroSlidesManager token={token} />
            </div>
          )}

          {/* Projects Tab */}
          {activeTab === 'projects' && token && (
            <div className="db-two-col">
              <div className="db-card">
                <h2 className="db-card-title">Create Project</h2>
                <CreateProjectForm token={token} onProjectCreated={handleProjectCreated} />
                {projects.length > 0 && (
                  <div style={{ marginTop: '24px' }}>
                    <h3 className="db-card-subtitle">Upload Project Files</h3>
                    <select
                      value={selectedProjectId || ''}
                      onChange={(e) => setSelectedProjectId(e.target.value || null)}
                      className="db-select"
                    >
                      <option value="">Choose a project...</option>
                      {projects.map((project: any) => (
                        <option key={project._id} value={project._id}>{project.title}</option>
                      ))}
                    </select>
                    {selectedProjectId && (
                      <div style={{ marginTop: '16px' }}>
                        <UploadProjectFolder token={token} projectId={selectedProjectId} onUploadSuccess={handleProjectCreated} />
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="db-card">
                <h2 className="db-card-title">All Projects</h2>
                {projectsLoading ? (
                  <div className="db-loading">Loading projects...</div>
                ) : (
                  <ProjectList projects={projects} token={token} onProjectDeleted={handleProjectDeleted} />
                )}
              </div>
            </div>
          )}

          {/* Code Library Tab */}
          {activeTab === 'code' && (
            <>
              <div className="db-two-col">
                <div className="db-card">
                  <h2 className="db-card-title">Add Code File</h2>
                  <CreateFileForm token={token} onFileCreated={handleFileCreated} />
                </div>
                <div className="db-card">
                  <h2 className="db-card-title">Upload Folder</h2>
                  <UploadFolderButton token={token} onUploadSuccess={handleFileCreated} />
                </div>
              </div>

              {/* Filter */}
              <div className="db-card" style={{ marginTop: '24px' }}>
                <div className="db-filter-row">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <label style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Filter:</label>
                    <select
                      name="programmingLanguage"
                      value={filter.programmingLanguage}
                      onChange={handleFilterChange}
                      className="db-select"
                    >
                      <option value="">All Languages</option>
                      {languages.map(lang => (
                        <option key={lang} value={lang}>{lang.charAt(0).toUpperCase() + lang.slice(1)}</option>
                      ))}
                    </select>
                  </div>
                  {pagination.total !== undefined && (
                    <span className="db-stat-badge">{pagination.total} files</span>
                  )}
                </div>

                {loading ? (
                  <div className="db-loading" style={{ marginTop: '24px' }}>Loading files...</div>
                ) : files.length === 0 ? (
                  <div className="db-empty" style={{ marginTop: '24px' }}>
                    <div className="db-empty-icon">📭</div>
                    <p>{filter.programmingLanguage ? `No ${filter.programmingLanguage} files` : 'No files yet. Add your first code file!'}</p>
                  </div>
                ) : (
                  <>
                    <div className="db-files-grid">
                      {files.map((file: any) => (
                        <div key={file._id} className="db-file-card">
                          <div className="db-file-header">
                            <span className="db-file-name">{file.fileName}</span>
                            <span className="db-lang-badge">{file.programmingLanguage}</span>
                          </div>
                          {file.folderPath && <p className="db-file-path">📂 {file.folderPath}</p>}
                          {file.description && <p className="db-file-desc">{file.description}</p>}
                          {file.tags?.length > 0 && (
                            <div className="db-tags">
                              {file.tags.map((tag: string, idx: number) => (
                                <span key={idx} className="db-tag">#{tag}</span>
                              ))}
                            </div>
                          )}
                          <div className="db-file-footer">
                            <span className="db-file-date">{new Date(file.createdAt).toLocaleDateString()}</span>
                            <button
                              onClick={() => handleDeleteFile(file._id, file.fileName)}
                              disabled={deleteLoading === file._id}
                              className="db-btn db-btn--icon-danger"
                              title="Delete"
                            >
                              {deleteLoading === file._id ? '...' : '🗑️'}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {pagination.pages > 1 && (
                      <div className="db-pagination">
                        <button onClick={() => handlePaginationChange(pagination.page - 1)} disabled={pagination.page === 1} className="db-btn db-btn--ghost">← Prev</button>
                        <span className="db-page-info">Page {pagination.page} of {pagination.pages}</span>
                        <button onClick={() => handlePaginationChange(pagination.page + 1)} disabled={!pagination.hasNext} className="db-btn db-btn--ghost">Next →</button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
