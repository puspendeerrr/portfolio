import React from "react";
import "./ProjectsIntroSection.css";

export const ProjectsIntroSection: React.FC = () => {
  return (
    <section className="surface projects-intro">
      <div className="section-header">
        <h2 className="section-title">Projects & work</h2>
        <p className="section-caption">
          A selection of practical projects with direct links to their source code.
        </p>
      </div>
      <p className="projects-intro-text">
        Each project is described in terms of the problem, the approach I took, and what I learned.
        The code you&apos;ll see is hosted directly in this platform, not on an external service.
      </p>
    </section>
  );
};



