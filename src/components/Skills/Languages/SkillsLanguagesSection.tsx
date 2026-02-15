import React from "react";
import "./SkillsLanguagesSection.css";

export const SkillsLanguagesSection: React.FC = () => {
  return (
    <section className="surface skills-languages">
      <div className="section-header">
        <h2 className="section-title">Languages & runtimes</h2>
        <p className="section-caption">Practical tools I use to build and ship software.</p>
      </div>
      <div className="skills-languages-grid">
        <div className="skills-languages-item">
          <div className="skills-languages-name">TypeScript</div>
          <p className="skills-languages-desc">
            Default for most work. Strong typing for React and Node, domain modeling, and safer
            refactors.
          </p>
        </div>
        <div className="skills-languages-item">
          <div className="skills-languages-name">JavaScript</div>
          <p className="skills-languages-desc">
            Core language understanding, including async behavior, prototypes, and runtime quirks.
          </p>
        </div>
      </div>
    </section>
  );
};



