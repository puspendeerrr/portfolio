import React from "react";
import "./ResumeHeaderSection.css";

export const ResumeHeaderSection: React.FC = () => {
  return (
    <section className="surface resume-header">
      <div className="resume-header-main">
        <h2 className="resume-name">Puspender Kumar</h2>
        <p className="resume-role">Software Engineer · Panipat, Haryana, India</p>
      </div>
      <div className="resume-header-meta">
        <p className="resume-contact-line">Building real-world software solutions with clean architecture and long-term maintainability.</p>
        <button type="button" className="btn btn--ghost resume-download-btn">
          Download PDF
        </button>
      </div>
    </section>
  );
};



