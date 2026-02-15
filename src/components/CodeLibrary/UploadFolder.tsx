import { useRef, useState } from 'react';
import { bulkUploadFiles } from '../../api/api';
import './UploadFolder.css';

/**
 * Language detection from file extension
 */
const detectLanguage = (fileName) => {
  const ext = fileName.split('.').pop()?.toLowerCase();
  const extensionMap = {
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
    'php': 'php',
    'sql': 'sql',
    'sh': 'bash',
    'bash': 'bash'
  };
  
  return extensionMap[ext] || 'markdown';
};

/**
 * Upload Folder Component
 * Allows uploading entire folders preserving structure
 */
const UploadFolder = ({ token, onUploadSuccess }) => {
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFolderClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFolderChange = async (event) => {
    const files = event.target.files;
    
    if (!files || files.length === 0) {
      return;
    }

    setError('');
    setSuccess('');
    setUploading(true);
    setUploadProgress(0);

    try {
      // Convert FileList to array and process files
      const filesToUpload = [];
      let processedCount = 0;

      Array.from(files).forEach((file) => {
        const webkitPath = file.webkitRelativePath || file.name;
        const pathParts = webkitPath.split('/');
        
        // Remove the filename (last element)
        pathParts.pop();
        
        // Folder path is everything except the filename
        // "Const Of India/file.js" → "Const Of India"
        // "Const Of India/subfolder/file.js" → "Const Of India/subfolder"
        const folderPath = pathParts.join('/').trim();

        filesToUpload.push({
          fileName: file.name,
          folderPath: folderPath || 'root',
          programmingLanguage: detectLanguage(file.name),
          description: `Uploaded from folder: ${folderPath || 'root'}`,
          codeContent: null, // Will be read in next step
          tags: ['bulk-upload']
        });

        processedCount++;
        setUploadProgress(Math.round((processedCount / files.length) * 50));
      });

      // Read file contents
      const readFilePromises = Array.from(files).map((file, idx) => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            filesToUpload[idx].codeContent = e.target?.result || '';
            resolve();
          };
          reader.onerror = () => {
            console.error(`Error reading file: ${file.name}`);
            filesToUpload[idx].codeContent = ''; // Set empty content on error
            resolve();
          };
          reader.readAsText(file);
        });
      });

      await Promise.all(readFilePromises);
      setUploadProgress(75);

      // Validate we have files to upload
      if (filesToUpload.length === 0) {
        throw new Error('No files to upload');
      }

      // Upload to backend
      const response = await bulkUploadFiles(token, filesToUpload);

      if (response.success) {
        setSuccess(`Successfully uploaded ${response.data.count} file(s)`);
        setUploadProgress(100);

        // Reset input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }

        // Callback to refresh file list
        setTimeout(() => {
          if (onUploadSuccess) {
            onUploadSuccess();
          }
        }, 1500);
      } else {
        throw new Error(response.message || 'Upload failed');
      }
    } catch (err) {
      setError(err.message || 'Failed to upload folder. Please try again.');
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="upload-folder-container">
      <button
        onClick={handleFolderClick}
        disabled={uploading}
        className="upload-folder-button"
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
        <div className="upload-progress">
          <div className="progress-info">
            <span>Uploading...</span>
            <span className="progress-percent">{uploadProgress}%</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {error && (
        <div className="upload-error">
          <span className="error-icon">⚠️</span>
          {error}
        </div>
      )}

      {success && (
        <div className="upload-success">
          <span className="success-icon">✓</span>
          {success}
        </div>
      )}
    </div>
  );
};

export default UploadFolder;
