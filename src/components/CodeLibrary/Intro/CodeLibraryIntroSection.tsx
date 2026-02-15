import React from "react";
import "./CodeLibraryIntroSection.css";

export const CodeLibraryIntroSection: React.FC = () => {
  return (
    <section className="surface code-library-intro">
      <div className="section-header">
        <h2 className="section-title">Code library & practice</h2>
        <p className="section-caption">
          Small, focused pieces of code that explore algorithms, patterns, and ideas.
        </p>
      </div>
      <p className="code-library-intro-text">
        This library is where I keep standalone programs and algorithm implementations. Each entry
        includes the problem statement, a short explanation of the approach, and the full code.
      </p>
    </section>
  );
};



