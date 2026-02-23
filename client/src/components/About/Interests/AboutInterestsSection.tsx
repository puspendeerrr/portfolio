import React from "react";
import "./AboutInterestsSection.css";

export const AboutInterestsSection: React.FC = () => {
  return (
    <section className="surface about-interests">
      <div className="section-header">
        <h3 className="section-title">Technical interests</h3>
      </div>
      <ul className="about-interests-list">
        <li>Designing frontends that stay maintainable as products grow.</li>
        <li>Understanding how systems behave under load and failure.</li>
        <li>Explaining complex ideas in a way that other engineers can build on.</li>
      </ul>
    </section>
  );
};



