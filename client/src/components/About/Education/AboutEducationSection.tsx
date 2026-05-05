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
          <div className="about-education-degree">BCA (AI)</div>
          <div className="about-education-meta">CodeQuotient School of Technology (2024–2027) • Score: 7.9</div>
          <div className="about-education-details" style={{ marginTop: '8px', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
            <strong>Foundation:</strong> MERN stack, C++, Python, DSA, OOP, OS, DBMS, Networking, AI/ML.<br/>
            <strong>Soft Skills:</strong> Teamwork through projects and presentations.
          </div>
        </li>
      </ul>
    </section>
  );
};



