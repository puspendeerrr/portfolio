import React, { useState } from "react";
import type { ProjectCodeTreeNode } from "../data/projectCodeData";
import { FileNode } from "./FileNode";
import "./FileExplorer.css";

interface FileExplorerProps {
  tree: ProjectCodeTreeNode | undefined;
  selectedPath: string;
  onSelectFile: (path: string) => void;
}

export const FileExplorer: React.FC<FileExplorerProps> = ({
  tree,
  selectedPath,
  onSelectFile
}) => {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());

  const handleToggleFolder = (path: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedFolders(newExpanded);
  };

  const handleSelectFile = (path: string) => {
    onSelectFile(path);
  };

  if (!tree || !tree.children) {
    return <div className="file-explorer">No files</div>;
  }

  return (
    <div className="file-explorer" aria-label="File explorer">
      <div className="file-explorer-header">FILES</div>
      <div className="file-explorer-content">
        {tree.children.map((node) => (
          <FileExplorerNode
            key={node.path}
            node={node}
            selectedPath={selectedPath}
            expandedFolders={expandedFolders}
            onToggleFolder={handleToggleFolder}
            onSelectFile={handleSelectFile}
            level={0}
          />
        ))}
      </div>
    </div>
  );
};

interface FileExplorerNodeProps {
  node: ProjectCodeTreeNode;
  selectedPath: string;
  expandedFolders: Set<string>;
  onToggleFolder: (path: string) => void;
  onSelectFile: (path: string) => void;
  level: number;
}

const FileExplorerNode: React.FC<FileExplorerNodeProps> = ({
  node,
  selectedPath,
  expandedFolders,
  onToggleFolder,
  onSelectFile,
  level
}) => {
  const isFolder = node.type === "folder";
  const isExpanded = expandedFolders.has(node.path);
  const isSelected = selectedPath === node.path;
  const hasChildren = isFolder && node.children && node.children.length > 0;

  const handleClick = () => {
    if (isFolder) {
      onToggleFolder(node.path);
    } else {
      onSelectFile(node.path);
    }
  };

  return (
    <div className="file-explorer-node">
      <button
        type="button"
        className={`file-explorer-item ${isSelected ? "file-explorer-item--selected" : ""}`}
        style={{ paddingLeft: `${level * 16}px` }}
        onClick={handleClick}
        title={node.path}
      >
        {isFolder && (
          <span className={`file-explorer-icon file-explorer-icon--folder ${isExpanded ? "file-explorer-icon--expanded" : ""}`}>
            {isExpanded ? "▼" : "▶"}
          </span>
        )}
        {!isFolder && <span className="file-explorer-icon file-explorer-icon--file">📄</span>}
        <span className="file-explorer-name">{node.name}</span>
      </button>

      {isFolder && hasChildren && isExpanded && (
        <div className="file-explorer-children">
          {node.children!.map((child) => (
            <FileExplorerNode
              key={child.path}
              node={child}
              selectedPath={selectedPath}
              expandedFolders={expandedFolders}
              onToggleFolder={onToggleFolder}
              onSelectFile={onSelectFile}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};
