import React from "react";
import "./ProjectsIntroSection.css";

export const ProjectsIntroSection: React.FC = () => {
  return (
    <section className="surface projects-intro">
      <div className="section-header">
        <h2 className="section-title">Projects & Execution</h2>
        <p className="section-caption">
          A selection of projects demonstrating technical skills, teamwork, and effective communication.
        </p>
      </div>
      <p className="projects-intro-text">
        Every project represents not just code, but collaboration. I focus on understanding the problem, leading team efforts when applicable, and documenting the architecture clearly so others can build upon it.
      </p>
    </section>
  );
};



