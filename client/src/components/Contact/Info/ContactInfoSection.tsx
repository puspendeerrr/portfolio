import React from "react";
import "./ContactInfoSection.css";

export const ContactInfoSection: React.FC = () => {
  return (
    <section className="surface contact-info">
      <div className="section-header">
        <h2 className="section-title">Contact</h2>
        <p className="section-caption">Direct ways to reach me.</p>
      </div>
      <p className="contact-info-text">
        Email is the most reliable way to reach me for opportunities, collaborations, or questions
        about my work.
      </p>
      <p className="contact-info-email">Email: puspendernarayan@gmail.com</p>
    </section>
  );
};



