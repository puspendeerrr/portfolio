import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FileExplorer from './FileExplorer';
import CodeViewer from './CodeViewer';
import Breadcrumb from './Breadcrumb';
import UploadFolder from './UploadFolder';
import { getFiles } from '../../api/api';
import './CodeRepository.css';

/**
 * Code Repository Component
 * VS Code-style interface for browsing and managing code files
 * Full production-ready implementation
 */
const CodeRepository = () => {
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterLanguage, setFilterLanguage] = useState('');
  const [stats, setStats] = useState({ total: 0, byLanguage: {} });

  const token = localStorage.getItem('token');

  // Fetch files on mount
  useEffect(() => {
    if (!token) {
      navigate('/login', { replace: true });
      return;
    }

    fetchFiles();
  }, [token, navigate, filterLanguage]);

  const fetchFiles = async () => {
    setLoading(true);
    setError('');

    try {
      const params = filterLanguage ? { programmingLanguage: filterLanguage } : {};
      const response = await getFiles(token, params);

      if (response.success) {
        setFiles(response.data || []);
        
        // Calculate stats
        const byLang = {};
        response.data.forEach(file => {
          byLang[file.programmingLanguage] = (byLang[file.programmingLanguage] || 0) + 1;
        });
        
        setStats({
          total: response.pagination?.total || 0,
          byLanguage: byLang
        });

        // Auto-select first file
        if (response.data.length > 0 && !selectedFile) {
          setSelectedFile(response.data[0]);
        }
      } else {
        throw new Error(response.message || 'Failed to fetch files');
      }
    } catch (err) {
      if (err.message.includes('Unauthorized')) {
        localStorage.removeItem('token');
        navigate('/login', { replace: true });
      } else {
        setError(err.message || 'Failed to fetch files');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUploadSuccess = () => {
    fetchFiles();
  };

  const handleLanguageFilter = (language) => {
    setFilterLanguage(language);
    setSelectedFile(null);
  };

  const languages = [
    'javascript', 'typescript', 'python', 'cpp', 'java', 'csharp',
    'php', 'ruby', 'go', 'rust', 'sql', 'html', 'css', 'json',
    'xml', 'yaml', 'markdown'
  ];

  const activeLanguageStats = Object.entries(stats.byLanguage)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  if (loading) {
    return (
      <div className="code-repository">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading code repository...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="code-repository">
      {/* Header Bar */}
      <div className="repository-header">
        <div className="header-left">
          <h2>💻 Code Repository</h2>
          <span className="file-count">
            {stats.total} file{stats.total !== 1 ? 's' : ''}
          </span>
        </div>
        <UploadFolder token={token} onUploadSuccess={handleUploadSuccess} />
      </div>

      {/* Stats Bar */}
      {stats.total > 0 && (
        <div className="stats-bar">
          <div className="stat-item">
            <span className="stat-label">Total Files:</span>
            <span className="stat-value">{stats.total}</span>
          </div>
          {activeLanguageStats.length > 0 && (
            <div className="language-stats">
              {activeLanguageStats.map(([lang, count]) => (
                <span key={lang} className="lang-stat">
                  {lang}: <strong>{count}</strong>
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="error-banner">
          <span>⚠️ {error}</span>
          <button onClick={() => setError('')} className="close-error">✕</button>
        </div>
      )}

      {/* Filter Bar */}
      {stats.total > 0 && (
        <div className="filter-bar">
          <label>Filter by Language:</label>
          <select 
            value={filterLanguage}
            onChange={(e) => handleLanguageFilter(e.target.value)}
          >
            <option value="">All Languages</option>
            {languages.filter(lang => stats.byLanguage[lang]).map(lang => (
              <option key={lang} value={lang}>
                {lang.charAt(0).toUpperCase() + lang.slice(1)} ({stats.byLanguage[lang]})
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Main Layout */}
      {files.length === 0 ? (
        <div className="empty-repository">
          <div className="empty-content">
            <div className="empty-icon">📁</div>
            <h3>No Code Files Yet</h3>
            <p>Upload a folder to get started with your code repository</p>
            <p className="empty-hint">Click "Upload Folder" to add files</p>
          </div>
        </div>
      ) : (
        <div className="repository-layout">
          {/* Left Panel: File Explorer */}
          <aside className="explorer-panel">
            <FileExplorer 
              files={files}
              onSelectFile={setSelectedFile}
              selectedFileId={selectedFile?._id}
            />
          </aside>

          {/* Right Panel: Code Viewer */}
          <main className="viewer-panel">
            <div className="viewer-container">
              <Breadcrumb file={selectedFile} />
              <CodeViewer file={selectedFile} />
            </div>
          </main>
        </div>
      )}
    </div>
  );
};

export default CodeRepository;
