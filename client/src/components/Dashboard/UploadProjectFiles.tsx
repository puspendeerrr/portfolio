import { useRef, useState } from 'react';
import './UploadProjectFiles.css';

/**
 * Detect programming language from file extension
 */
const detectLanguage = (fileName: string): string => {
  const ext = fileName.split('.').pop()?.toLowerCase() || '';
  const extensionMap: Record<string, string> = {
    'js': 'javascript',
    'ts': 'typescript',
    'tsx': 'tsx',
    'jsx': 'jsx',
    'py': 'python',
    'cpp': 'cpp',
    'cc': 'cpp',
    'cxx': 'cpp',
    'c': 'cpp',
    'java': 'java',
    'cs': 'csharp',
    'php': 'php',
    'html': 'html',
    'htm': 'html',
    'css': 'css',
    'scss': 'css',
    'less': 'css',
    'json': 'json',
    'md': 'markdown',
    'xml': 'xml',
    'yaml': 'yaml',
    'yml': 'yaml',
    'rb': 'ruby',
    'go': 'go',
    'rs': 'rust',
    'sql': 'sql',
    'sh': 'bash',
    'bash': 'bash',
    'dockerfile': 'dockerfile'
  };
  
  return extensionMap[ext] || 'javascript';
};

interface UploadProjectFilesProps {
  onFileSelected: (fileContent: string, language: string, fileName: string) => void;
}

/**
 * Upload Project Files Component
 * Allows users to select code files to use in project code viewer
 * Supports drag & drop
 */
const UploadProjectFiles: React.FC<UploadProjectFilesProps> = ({ onFileSelected }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragZoneRef = useRef<HTMLDivElement>(null);
  const [selectedFile, setSelectedFile] = useState<{ name: string; size: number } | null>(null);
  const [error, setError] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const processFile = async (file: File) => {
    setError('');

    // Check file size (max 1MB for code files)
    const maxSize = 1024 * 1024; // 1MB
    if (file.size > maxSize) {
      setError('File too large. Maximum size is 1MB.');
      return;
    }

    try {
      const content = await file.text();
      const language = detectLanguage(file.name);
      
      setSelectedFile({
        name: file.name,
        size: file.size
      });

      // Pass file content to parent component
      onFileSelected(content, language, file.name);

    } catch (err) {
      setError('Failed to read file. Please try again.');
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    
    if (!files || files.length === 0) {
      return;
    }

    await processFile(files[0]);

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      await processFile(files[0]);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="upload-project-files">
      <div
        ref={dragZoneRef}
        className={`upload-drop-zone ${isDragOver ? 'drag-over' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <button
          onClick={handleFileClick}
          className="upload-file-btn"
          title="Upload code file or drag and drop"
          type="button"
        >
          📄 Upload Code File
        </button>
        <span className="upload-hint">or drag & drop a file</span>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileChange}
        style={{ display: 'none' }}
        accept=".js,.ts,.tsx,.jsx,.py,.cpp,.java,.cs,.php,.html,.css,.json,.md,.xml,.sql,.go,.rs,.rb,.sh,.yaml,.dockerfile"
      />

      {selectedFile && (
        <div className="file-selected-info">
          <span className="file-name">✓ {selectedFile.name}</span>
          <span className="file-size">({formatFileSize(selectedFile.size)})</span>
        </div>
      )}

      {error && (
        <div className="upload-error-message">
          ❌ {error}
        </div>
      )}
    </div>
  );
};

export default UploadProjectFiles;
