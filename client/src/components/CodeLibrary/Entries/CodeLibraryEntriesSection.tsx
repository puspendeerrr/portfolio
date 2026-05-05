import React, { useState } from "react";
import FileExplorer from "../FileExplorer";
import CodeViewer from "../CodeViewer";
import "./CodeLibraryEntriesSection.css";

/**
 * TypeScript Interfaces
 */
interface CodeFile {
  _id: string;
  fileName: string;
  folderPath: string;
  programmingLanguage: string;
  codeContent: string;
  description?: string;
  createdAt: string;
  [key: string]: any;
}

interface CodeLibraryEntriesSectionProps {
  files?: CodeFile[];
  loading?: boolean;
  error?: string;
}

/**
 * CodeLibraryEntriesSection Component
 * 2-column layout: FileExplorer (30%) + CodeViewer (70%)
 */
export const CodeLibraryEntriesSection: React.FC<CodeLibraryEntriesSectionProps> = ({
  files = [],
  loading = false,
  error = ""
}) => {
  // State for selected file
  const [selectedFile, setSelectedFile] = useState<CodeFile | null>(null);

  // Handle file selection
  const handleSelectFile = (file: CodeFile): void => {
    setSelectedFile(file);
  };

  // Get selected file ID for highlighting in explorer
  const selectedFileId = selectedFile?._id ?? null;

  // Loading state
  if (loading) {
    return (
      <div className="code-library-entries">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading files...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="code-library-entries">
        <div className="error-state">
          <div className="error-icon">⚠️</div>
          <p className="error-title">Error Loading Files</p>
          <p className="error-message">{error}</p>
        </div>
      </div>
    );
  }

  // Empty state
  if (files.length === 0) {
    return (
      <div className="code-library-entries">
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <p className="empty-title">No Files Available</p>
          <p className="empty-message">Upload a folder to view and explore code files</p>
        </div>
      </div>
    );
  }

  return (
    <div className="code-library-entries">
      {/* Left Panel: File Explorer (30%) */}
      <div className="entries-sidebar">
        <FileExplorer
          files={files}
          onSelectFile={handleSelectFile}
          selectedFileId={selectedFileId}
        />
      </div>

      {/* Right Panel: Code Viewer (70%) */}
      <div className="entries-viewer">
        <CodeViewer file={selectedFile} />
      </div>
    </div>
  );
};
