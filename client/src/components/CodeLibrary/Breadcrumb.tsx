import './Breadcrumb.css';

/**
 * Breadcrumb Navigation Component
 * Shows file path hierarchy
 */
const Breadcrumb = ({ file }) => {
  if (!file) {
    return (
      <div className="breadcrumb-container">
        <div className="breadcrumb-path">
          <span className="breadcrumb-item">Select a file to view</span>
        </div>
      </div>
    );
  }

  const pathParts = file.folderPath ? file.folderPath.split('/').filter(p => p) : [];
  const allParts = [...pathParts, file.fileName];

  // Get language color
  const languageColors = {
    javascript: '#f7df1e',
    typescript: '#3178c6',
    python: '#3776ab',
    java: '#007396',
    cpp: '#00599c',
    csharp: '#239120',
    php: '#777bb4',
    ruby: '#cc342d',
    go: '#00add8',
    rust: '#ce422b',
    html: '#e34c26',
    css: '#563d7c',
    json: '#f7df1e',
    markdown: '#083fa1',
    xml: '#0078d4',
    yaml: '#cb171e',
    bash: '#4eaa25'
  };

  const bgColor = languageColors[file.programmingLanguage?.toLowerCase()] || '#666';

  return (
    <div className="breadcrumb-container">
      <div className="breadcrumb-path">
        {allParts.map((part, idx) => (
          <div key={idx} className="breadcrumb-segment">
            {idx > 0 && <span className="breadcrumb-separator">/</span>}
            <span className={idx === allParts.length - 1 ? 'breadcrumb-file' : 'breadcrumb-folder'}>
              {part}
            </span>
          </div>
        ))}
      </div>

      <div className="breadcrumb-meta">
        <span 
          className="language-badge"
          style={{ backgroundColor: bgColor }}
        >
          {file.programmingLanguage}
        </span>
        <span className="file-size">
          {(file.codeContent?.length || 0) > 1024
            ? `${(file.codeContent.length / 1024).toFixed(1)} KB`
            : `${file.codeContent?.length || 0} B`}
        </span>
      </div>
    </div>
  );
};

export default Breadcrumb;
