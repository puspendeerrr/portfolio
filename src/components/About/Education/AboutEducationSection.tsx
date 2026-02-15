import React from "react";
import "./AboutEducationSection.css";

export const AboutEducationSection: React.FC = () => {
  return (
    <section className="surface about-education">
      <div className="section-header">
        <h3 className="section-title">Education</h3>
      </div>
      <ul className="about-education-list">
        <li className="about-education-item">
          <div className="about-education-degree">Bachelors in Computer Science</div>
          <div className="about-education-meta">Core CS · Algorithms · Systems · Software design</div>
        </li>
      </ul>
    </section>
  );
};



