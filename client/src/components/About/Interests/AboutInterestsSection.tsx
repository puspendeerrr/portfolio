import React from "react";
import "./AboutInterestsSection.css";

export const AboutInterestsSection: React.FC = () => {
  return (
    <section className="surface about-interests">
      <div className="section-header">
        <h3 className="section-title">Professional Interests</h3>
      </div>
      <ul className="about-interests-list">
        <li>Human behavior and communication</li>
        <li>Customer experience and relationship management</li>
        <li>Leadership and team coordination</li>
        <li>Conflict resolution</li>
        <li>Workplace dynamics</li>
      </ul>
    </section>
  );
};



