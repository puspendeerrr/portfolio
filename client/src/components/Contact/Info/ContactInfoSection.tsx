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
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '16px' }}>
        <p className="contact-info-email" style={{ margin: 0 }}><strong>Email:</strong> <a href="mailto:puspendernarayan@gmail.com">puspendernarayan@gmail.com</a></p>
        <p className="contact-info-phone" style={{ margin: 0 }}><strong>Phone:</strong> <a href="tel:+919306690894">+91 9306690894</a></p>
      </div>
    </section>
  );
};



