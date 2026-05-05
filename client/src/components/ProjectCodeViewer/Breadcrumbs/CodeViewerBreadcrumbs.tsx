import React from "react";
import "./CodeViewerBreadcrumbs.css";

interface CodeViewerBreadcrumbsProps {
  filePath: string;
  onBreadcrumbClick?: (segment: string, index: number) => void;
}

export const CodeViewerBreadcrumbs: React.FC<CodeViewerBreadcrumbsProps> = ({
  filePath,
  onBreadcrumbClick
}) => {
  const segments = filePath.split("/").filter(Boolean);

  return (
    <div className="code-viewer-breadcrumbs" aria-label="File path">
      {segments.map((segment, index) => (
        <div key={index} className="code-viewer-breadcrumb-item">
          <button
            type="button"
            className="code-viewer-breadcrumb-segment"
            onClick={() => onBreadcrumbClick?.(segment, index)}
            title={segment}
          >
            {segment}
          </button>
          {index < segments.length - 1 && (
            <span className="code-viewer-breadcrumb-separator">/</span>
          )}
        </div>
      ))}
    </div>
  );
};
