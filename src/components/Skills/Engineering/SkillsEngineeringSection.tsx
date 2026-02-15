import React from "react";
import "./SkillsEngineeringSection.css";

export const SkillsEngineeringSection: React.FC = () => {
  return (
    <section className="surface skills-engineering">
      <div className="section-header">
        <h3 className="section-title">Engineering practice</h3>
      </div>
      <ul className="skills-engineering-list">
        <li>Designing React component systems and state flows.</li>
        <li>Building and integrating HTTP APIs.</li>
        <li>Reasoning about observability, logging, and failure modes.</li>
      </ul>
    </section>
  );
};



