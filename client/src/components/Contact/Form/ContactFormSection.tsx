import React from "react";
import "./ContactFormSection.css";

export const ContactFormSection: React.FC = () => {
  return (
    <section className="surface contact-form">
      <div className="google-form-container">
        <iframe
          src="https://docs.google.com/forms/d/e/1FAIpQLScCfRF9jNkTC6fKChOP1zWtyPZwa5dhSHcMloORKO69zT1IQg/viewform?embedded=true"
          width="100%"
          height="600"
          frameBorder="0"
          marginHeight={0}
          marginWidth={0}
          title="Contact Form"
        >
          Loading…
        </iframe>
      </div>
    </section>
  );
};



