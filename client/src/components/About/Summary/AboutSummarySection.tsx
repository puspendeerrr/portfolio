import React from "react";
import "./AboutSummarySection.css";

export const AboutSummarySection: React.FC = () => {
  return (
    <section className="surface about-summary">
      <div className="section-header">
        <h2 className="section-title">About</h2>
        <p className="section-caption">A factual overview of my profile and aspirations.</p>
      </div>
      <p className="about-summary-text">
        I am a motivated BCA student with a strong interest in Human Resources, people management, and communication. I have strong interpersonal skills, leadership experience, and a proactive, detail-oriented mindset. I am skilled in coordination, documentation, and tools like MS Excel and Google Sheets.
      </p>
    </section>
  );
};



