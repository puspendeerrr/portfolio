import React from "react";
import "./ExperienceSummarySection.css";

export const ExperienceSummarySection: React.FC = () => {
  return (
    <section className="surface experience-summary">
      <div className="section-header">
        <h2 className="section-title">Experience & achievements</h2>
        <p className="section-caption">A concise record of work, projects, and milestones.</p>
      </div>
      <p className="experience-summary-text">
        This section focuses on real work and learning: projects I&apos;ve built, responsibilities
        I&apos;ve taken on, and milestones that reflect honest progress rather than exaggerated
        claims.
      </p>
    </section>
  );
};



