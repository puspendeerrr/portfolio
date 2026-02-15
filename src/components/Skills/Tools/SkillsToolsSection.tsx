import React from "react";
import "./SkillsToolsSection.css";

export const SkillsToolsSection: React.FC = () => {
  return (
    <section className="surface skills-tools">
      <div className="section-header">
        <h3 className="section-title">Frameworks & tools</h3>
      </div>
      <div className="skills-tools-tags">
        <span className="tag tag--accent">React</span>
        <span className="tag">Node.js</span>
        <span className="tag">REST APIs</span>
        <span className="tag">Git</span>
      </div>
    </section>
  );
};



