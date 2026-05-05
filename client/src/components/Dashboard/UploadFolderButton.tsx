import { useRef, useState } from 'react';
import { bulkUploadFiles } from '../../api/api';

/**
 * Detect programming language from file extension
 */
const detectLanguage = (fileName: string): string => {
  const ext = fileName.split('.').pop()?.toLowerCase() || '';
  const extensionMap: Record<string, string> = {
    'js': 'javascript',
    'ts': 'typescript',
    'tsx': 'typescript',
    'jsx': 'javascript',
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
    'markdown': 'markdown',
    'xml': 'xml',
    'yaml': 'yaml',
    'yml': 'yaml',
    'rb': 'ruby',
    'go': 'go',
    'rs': 'rust',
    'sql': 'sql',
    'sh': 'bash',
    'bash': 'bash'
  };
  
  return extensionMap[ext] || 'markdown';
};

interface UploadFolderButtonProps {
  token: string;
  onUploadSuccess: () => void;
}

/**
 * Upload Folder Button Component
 * Integrates with Dashboard for bulk file uploads
 * Simplified version without modal - just button and progress
 */
const UploadFolderButton: React.FC<UploadFolderButtonProps> = ({ token, onUploadSuccess }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  const handleFolderClick = () => {
    fileInputRef.current?.click();
  };

  const handleFolderChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    
    if (!files || files.length === 0) {
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    setUploadStatus('uploading');
    setStatusMessage('');

    try {
      const filesToUpload: any[] = [];
      let processedCount = 0;

      // Convert FileList to array and process files
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const webkitPath = file.webkitRelativePath || file.name;
        const pathParts = webkitPath.split('/');
        
        // Remove file name to get folder path
        pathParts.pop();
        const folderPath = pathParts.length > 1 
          ? pathParts.slice(1).join('/')
          : pathParts[0] || '';

        // Read file content
        const content = await file.text();

        filesToUpload.push({
          fileName: file.name,
          folderPath: folderPath || 'root',
          programmingLanguage: detectLanguage(file.name),
          description: 'Uploaded via folder',
          codeContent: content,
          tags: []
        });

        processedCount++;
        setUploadProgress(Math.round((processedCount / files.length) * 50));
      }

      // Update progress to show we're uploading
      setUploadProgress(75);

      // Send to backend
      const response = await bulkUploadFiles(token, filesToUpload);

      if (response.success) {
        setUploadProgress(100);
        setUploadStatus('success');
        setStatusMessage(`✓ Uploaded ${response.data.count || filesToUpload.length} file(s)`);
        
        // Reset and refresh
        setTimeout(() => {
          setUploading(false);
          setUploadProgress(0);
          setUploadStatus('idle');
          setStatusMessage('');
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
          onUploadSuccess();
        }, 1500);
      } else {
        throw new Error(response.message || 'Upload failed');
      }

    } catch (err: any) {
      setUploadStatus('error');
      setStatusMessage(`❌ ${err.message || 'Upload failed'}`);
      setUploading(false);
      setUploadProgress(0);
      
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="upload-folder-wrapper">
      <button
        onClick={handleFolderClick}
        disabled={uploading}
        className="upload-folder-btn"
        title="Upload entire folder preserving structure"
      >
        📁 Upload Folder
      </button>

      <input
        ref={fileInputRef}
        type="file"
        webkitdirectory="true"
        multiple
        onChange={handleFolderChange}
        style={{ display: 'none' }}
        accept="*/*"
      />

      {uploading && (
        <div className="upload-progress-inline">
          <div className="progress-text">{uploadProgress}%</div>
          <div className="progress-bar-small">
            <div 
              className="progress-fill-small"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {uploadStatus === 'success' && (
        <div className="upload-status-message success">
          {statusMessage}
        </div>
      )}

      {uploadStatus === 'error' && (
        <div className="upload-status-message error">
          {statusMessage}
        </div>
      )}
    </div>
  );
};

export default UploadFolderButton;
