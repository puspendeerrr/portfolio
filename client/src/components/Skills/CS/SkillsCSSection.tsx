import React from "react";
import "./SkillsCSSection.css";

export const SkillsCSSection: React.FC = () => {
  return (
    <section className="surface skills-cs">
      <div className="section-header">
        <h3 className="section-title">Core CS concepts</h3>
      </div>
      <ul className="skills-cs-list">
        <li>Algorithms and data structures applied to real problems.</li>
        <li>Understanding complexity and trade-offs.</li>
        <li>Systems behavior: processes, IO, and resource limits.</li>
      </ul>
    </section>
  );
};



