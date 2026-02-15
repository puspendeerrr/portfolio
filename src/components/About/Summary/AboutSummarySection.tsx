import React from "react";
import "./AboutSummarySection.css";

export const AboutSummarySection: React.FC = () => {
  return (
    <section className="surface about-summary">
      <div className="section-header">
        <h2 className="section-title">About</h2>
        <p className="section-caption">A factual overview of who I am as an engineer.</p>
      </div>
      <p className="about-summary-text">
        I'm <strong>Puspender Kumar</strong>, a software engineer based in Panipat, Haryana, India.
        I care about building systems that are understandable, observable, and useful for the people
        who rely on them. I work primarily with modern TypeScript, React, and Node, and I think in
        terms of data flows, constraints, and long-term maintainability rather than quick demos.
      </p>
    </section>
  );
};



