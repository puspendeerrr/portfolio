import React from "react";
import type { ProjectCodeTreeNode } from "../data/projectCodeData";
import "./FileNode.css";

interface FileNodeProps {
  node: ProjectCodeTreeNode;
  isExpanded: boolean;
  isSelected: boolean;
  level: number;
  onToggleFolder: (path: string) => void;
  onSelectFile: (path: string) => void;
}

export const FileNode: React.FC<FileNodeProps> = ({
  node,
  isExpanded,
  isSelected,
  level,
  onToggleFolder,
  onSelectFile
}) => {
  const isFolder = node.type === "folder";

  const handleClick = () => {
    if (isFolder) {
      onToggleFolder(node.path);
    } else {
      onSelectFile(node.path);
    }
  };

  const hasChildren = isFolder && node.children && node.children.length > 0;

  return (
    <div className="file-node">
      <button
        type="button"
        className={`file-node-item ${isSelected ? "file-node-item--selected" : ""}`}
        style={{ paddingLeft: `${level * 16}px` }}
        onClick={handleClick}
      >
        {isFolder && (
          <span className={`file-node-icon file-node-icon--folder ${isExpanded ? "file-node-icon--expanded" : ""}`}>
            {isExpanded ? "▼" : "▶"}
          </span>
        )}
        {!isFolder && <span className="file-node-icon file-node-icon--file">📄</span>}
        <span className="file-node-name">{node.name}</span>
      </button>

      {isFolder && hasChildren && isExpanded && (
        <div className="file-node-children">
          {node.children!.map((child) => (
            <FileNodeWrapper
              key={child.path}
              node={child}
              level={level + 1}
              onToggleFolder={onToggleFolder}
              onSelectFile={onSelectFile}
              isSelected={isSelected && child.path === node.path}
            />
          ))}
        </div>
      )}
    </div>
  );
};

interface FileNodeWrapperProps {
  node: ProjectCodeTreeNode;
  level: number;
  onToggleFolder: (path: string) => void;
  onSelectFile: (path: string) => void;
  isSelected: boolean;
}

const FileNodeWrapper: React.FC<FileNodeWrapperProps> = ({
  node,
  level,
  onToggleFolder,
  onSelectFile,
  isSelected
}) => {
  const [isExpanded, setIsExpanded] = React.useState(true);

  const handleToggleFolder = (path: string) => {
    if (path === node.path) {
      setIsExpanded(!isExpanded);
    }
    onToggleFolder(path);
  };

  return (
    <FileNode
      node={node}
      isExpanded={isExpanded}
      isSelected={isSelected}
      level={level}
      onToggleFolder={handleToggleFolder}
      onSelectFile={onSelectFile}
    />
  );
};
