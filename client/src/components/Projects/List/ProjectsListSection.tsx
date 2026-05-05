import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getProjects } from "../../../api/api";
import "./ProjectsListSection.css";

interface Project {
  _id: string;
  title: string;
  description: string;
  keyFeatures: string[];
  whatILearned: string;
  techStack: string[];
  codeLink: string;
  liveLink?: string;
  tag: string;
  createdAt: string;
  codeContent?: string;
  programmingLanguage?: string;
}

export const ProjectsListSection: React.FC = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await getProjects();
        
        if (response.success) {
          setProjects(response.data || []);
        } else {
          throw new Error(response.message || 'Failed to fetch projects');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch projects');
        console.error('Fetch projects error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleViewCode = (projectId: string) => {
    navigate(`/projects/${projectId}/code`);
  };

  if (loading) {
    return (
      <section className="surface projects-list">
        <div className="loading-state">
          <p>Loading projects...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="surface projects-list">
        <div className="error-state">
          <p>Error: {error}</p>
        </div>
      </section>
    );
  }

  if (projects.length === 0) {
    return (
      <section className="surface projects-list">
        <div className="empty-state">
          <p>No projects yet</p>
        </div>
      </section>
    );
  }

  return (
    <section className="surface projects-list">
      <div className="projects-cards">
        {projects.map((project) => (
          <article key={project._id} className="project-card">
            <header className="project-card-header">
              <h3 className="project-card-title">{project.title}</h3>
              <p className="project-card-summary">{project.description}</p>
            </header>
            <div className="project-card-body">
              {project.keyFeatures && project.keyFeatures.length > 0 && (
                <div className="project-card-section">
                  <div className="project-card-section-label">Key features</div>
                  <ul className="project-card-features">
                    {project.keyFeatures.map((feature) => (
                      <li key={feature}>{feature}</li>
                    ))}
                  </ul>
                </div>
              )}
              {project.whatILearned && (
                <div className="project-card-section">
                  <div className="project-card-section-label">What I learned</div>
                  <p className="project-card-learnings">{project.whatILearned}</p>
                </div>
              )}
            </div>
            <footer className="project-card-footer">
              <span className="tag">{project.tag}</span>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => handleViewCode(project._id)}
                  className="btn btn--primary project-card-btn"
                  type="button"
                >
                  View code
                </button>
                {project.liveLink && (
                  <a href={project.liveLink} target="_blank" rel="noopener noreferrer" className="btn btn--ghost project-card-btn">
                    Live demo
                  </a>
                )}
              </div>
            </footer>
          </article>
        ))}
      </div>
    </section>
  );
};



