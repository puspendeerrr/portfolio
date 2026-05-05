import React from "react";
import { Link } from "react-router-dom";
import type { ProjectCodeDefinition } from "../data/projectCodeData";
import "./ProjectCodeHeaderSection.css";

interface ProjectCodeHeaderSectionProps {
  project: ProjectCodeDefinition;
}

export const ProjectCodeHeaderSection: React.FC<ProjectCodeHeaderSectionProps> = ({ project }) => {
  return (
    <header className="project-code-header">
      <div>
        <div className="pill">
          <span className="pill-dot" />
          SELF-HOSTED SOURCE
        </div>
        <h2 className="project-code-title">{project.name}</h2>
        <p className="project-code-description">{project.description}</p>
      </div>
      <div className="project-code-header-meta">
        <span className="tag tag--accent">Code viewer</span>
        <Link to="/projects" className="accent-link">
          Back to projects <span className="accent-link-icon">→</span>
        </Link>
      </div>
    </header>
  );
};



