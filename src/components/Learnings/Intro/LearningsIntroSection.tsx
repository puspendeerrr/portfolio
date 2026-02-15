import React from "react";
import "./LearningsIntroSection.css";

export const LearningsIntroSection: React.FC = () => {
  return (
    <section className="surface learnings-intro">
      <div className="section-header">
        <h2 className="section-title">Documentation & References</h2>
        <p className="section-caption">
          A collection of documentation, guides, and learning resources I've created while exploring AI, programming, systems, and engineering fundamentals.
        </p>
      </div>
      <p className="learnings-intro-text">
        These are reference materials organized by topic. They cover concepts I've studied and applied in real projects. Not a blog—a documentation hub.
      </p>
    </section>
  );
};



