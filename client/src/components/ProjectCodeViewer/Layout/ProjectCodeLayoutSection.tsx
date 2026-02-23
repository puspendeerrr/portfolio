import React, { useState } from "react";
import type { ProjectCodeDefinition, ProjectCodeFile } from "../data/projectCodeData";
import { findFileInTree } from "../data/projectCodeData";
import { FileExplorer } from "../Explorer/FileExplorer";
import { CodeViewerBreadcrumbs } from "../Breadcrumbs/CodeViewerBreadcrumbs";
import { CodeBlock } from "../../Shared/Code/CodeBlock";
import "./ProjectCodeLayoutSection.css";

interface ProjectCodeLayoutSectionProps {
  project: ProjectCodeDefinition;
}

export const ProjectCodeLayoutSection: React.FC<ProjectCodeLayoutSectionProps> = ({ project }) => {
  const [activePath, setActivePath] = useState(project.files[0]?.path ?? "");
  const [copyFeedback, setCopyFeedback] = useState(false);

  const activeFile: ProjectCodeFile | undefined = findFileInTree(project.tree, activePath);

  const handleCopyFile = async () => {
    if (activeFile?.content) {
      try {
        await navigator.clipboard.writeText(activeFile.content);
        setCopyFeedback(true);
        setTimeout(() => setCopyFeedback(false), 2000);
      } catch (err) {
        console.error("Failed to copy file:", err);
      }
    }
  };

  return (
    <div className="project-code-layout">
      <FileExplorer
        tree={project.tree}
        selectedPath={activePath}
        onSelectFile={setActivePath}
      />
      <div className="project-code-viewer">
        {activeFile ? (
          <>
            <div className="project-code-viewer-toolbar">
              <CodeViewerBreadcrumbs filePath={activePath} />
              <button
                type="button"
                className={`project-code-copy-btn ${copyFeedback ? "project-code-copy-btn--copied" : ""}`}
                onClick={handleCopyFile}
                title="Copy file content"
              >
                {copyFeedback ? "Copied!" : "Copy"}
              </button>
            </div>
            <CodeBlock language={activeFile.language} code={activeFile.content} />
          </>
        ) : (
          <p>No file selected.</p>
        )}
      </div>
    </div>
  );
};



