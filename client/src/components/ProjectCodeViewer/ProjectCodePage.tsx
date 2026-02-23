import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getProjectCodeDefinition } from "./data/projectCodeData";
import type { ProjectCodeDefinition } from "./data/projectCodeData";
import { ProjectCodeHeaderSection } from "./Header/ProjectCodeHeaderSection";
import { ProjectCodeLayoutSection } from "./Layout/ProjectCodeLayoutSection";
import "./ProjectCodePage.css";

export const ProjectCodePage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [project, setProject] = useState<ProjectCodeDefinition | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProject = async () => {
      try {
        setLoading(true);
        if (projectId) {
          const loadedProject = await getProjectCodeDefinition(projectId);
          setProject(loadedProject);
          if (!loadedProject) {
            setError("Project not found");
          }
        }
      } catch (err) {
        setError("Error loading project");
        console.error("Error loading project:", err);
      } finally {
        setLoading(false);
      }
    };

    loadProject();
  }, [projectId]);

  if (loading) {
    return (
      <section className="surface project-code-page">
        <div className="project-code-page-inner">
          <p>Loading project...</p>
        </div>
      </section>
    );
  }

  if (error || !project) {
    return (
      <section className="surface project-code-page">
        <div className="project-code-page-inner">
          <p>{error || "Project not found."}</p>
          <Link to="/projects" className="btn btn--ghost">
            Back to projects
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="surface project-code-page">
      <div className="project-code-page-inner">
        <ProjectCodeHeaderSection project={project} />
        <ProjectCodeLayoutSection project={project} />
      </div>
    </section>
  );
};



