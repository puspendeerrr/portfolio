import React, { useMemo, useState } from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { nightOwl } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import './CodeViewer.css';

/**
 * TypeScript Interfaces
 */
interface CodeFile {
  _id: string;
  fileName: string;
  folderPath: string;
  programmingLanguage: string;
  codeContent: string;
  createdAt: string;
  description?: string;
  tags?: string[];
  [key: string]: any;
}

interface CodeViewerProps {
  file: CodeFile | null;
}

/**
 * Map programming language to highlight.js language
 */
const mapLanguageToHighlighter = (language?: string): string => {
  const languageMap: Record<string, string> = {
    javascript: 'javascript',
    typescript: 'typescript',
    python: 'python',
    java: 'java',
    cpp: 'cpp',
    csharp: 'csharp',
    php: 'php',
    ruby: 'ruby',
    go: 'go',
    rust: 'rust',
    html: 'html',
    css: 'css',
    json: 'json',
    markdown: 'markdown',
    xml: 'xml',
    yaml: 'yaml',
    bash: 'bash',
    sh: 'bash',
    sql: 'sql',
    dockerfile: 'dockerfile',
    vue: 'vue',
    react: 'jsx',
    jsx: 'jsx',
    tsx: 'typescript'
  };

  return languageMap[language?.toLowerCase() ?? ''] ?? 'plaintext';
};

/**
 * Code Viewer Component
 * Right panel showing syntax-highlighted code with metadata
 */
const CodeViewer: React.FC<CodeViewerProps> = ({ file }) => {
  const [copied, setCopied] = useState(false);

  // Memoized calculations
  const lineCount = useMemo(() => {
    if (!file?.codeContent) return 0;
    return file.codeContent.split('\n').length;
  }, [file?.codeContent]);

  const fileSize = useMemo(() => {
    if (!file?.codeContent) return '0B';
    const bytes = file.codeContent.length;
    return bytes > 1024 ? `${(bytes / 1024).toFixed(1)}KB` : `${bytes}B`;
  }, [file?.codeContent]);

  const highlighterLanguage = useMemo(() => {
    return mapLanguageToHighlighter(file?.programmingLanguage);
  }, [file?.programmingLanguage]);

  // Format date for display
  const formatDate = (dateString?: string): string => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Handle copy to clipboard
  const handleCopyCode = async (): Promise<void> => {
    if (!file?.codeContent) return;

    try {
      await navigator.clipboard.writeText(file.codeContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  // Empty state when no file is selected
  if (!file) {
    return (
      <div className="code-viewer">
        <div className="empty-viewer">
          <div className="empty-icon">📄</div>
          <h3>Select a file to view code</h3>
          <p>Choose a file from the explorer on the left to display its contents</p>
        </div>
      </div>
    );
  }

  return (
    <div className="code-viewer">
      {/* Header: File Info & Metadata */}
      <div className="viewer-header">
        <div className="file-info">
          <span className="file-icon">{highlighterLanguage === 'plaintext' ? '📄' : '💻'}</span>
          <div className="file-details">
            <span className="file-name" title={file.fileName}>{file.fileName}</span>
            <span className="file-path" title={file.folderPath}>
              {file.folderPath || 'root'}
            </span>
          </div>
        </div>

        <div className="metadata">
          <span className="metadata-item">
            <span className="label">Lines:</span>
            <span className="value">{lineCount}</span>
          </span>
          <span className="metadata-item">
            <span className="label">Size:</span>
            <span className="value">{fileSize}</span>
          </span>
          <span className="metadata-item">
            <span className="label">Type:</span>
            <span className="value language-badge">{file.programmingLanguage}</span>
          </span>
          <button
            className={`copy-button ${copied ? 'copied' : ''}`}
            onClick={handleCopyCode}
            title="Copy code to clipboard"
            disabled={copied}
          >
            {copied ? '✓ Copied!' : '📋 Copy'}
          </button>
        </div>
      </div>

      {/* Code Content */}
      <div className="code-content">
        {file.codeContent && file.codeContent.trim() ? (
          <SyntaxHighlighter
            language={highlighterLanguage}
            style={nightOwl}
            showLineNumbers={true}
            wrapLongLines={true}
            customStyle={{
              margin: 0,
              padding: '20px',
              fontSize: '13px',
              fontFamily: '"Fira Code", "Monaco", "Menlo", "Ubuntu Mono", "SF Mono", monospace',
              backgroundColor: '#011627',
              height: '100%',
              overflow: 'auto'
            }}
            lineNumberStyle={{
              color: '#5f7e97',
              paddingRight: '16px',
              minWidth: '50px',
              textAlign: 'right',
              userSelect: 'none'
            }}
          >
            {file.codeContent}
          </SyntaxHighlighter>
        ) : (
          <div className="empty-code">
            <p>📭 No code content available</p>
          </div>
        )}
      </div>

      {/* Footer: Description & Tags */}
      {(file.description || (file.tags && file.tags.length > 0)) && (
        <div className="viewer-footer">
          {file.description && (
            <div className="description-section">
              <strong>Description:</strong>
              <p>{file.description}</p>
            </div>
          )}
          {file.tags && file.tags.length > 0 && (
            <div className="tags-section">
              <strong>Tags:</strong>
              <div className="tags">
                {file.tags.map((tag, idx) => (
                  <span key={idx} className="tag">#{tag}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default React.memo(CodeViewer);
