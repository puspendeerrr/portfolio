import React from "react";
import "./Disclaimer.css";

export const Disclaimer: React.FC = () => {
  return (
    <section className="surface disclaimer">
      <h3 className="disclaimer-title"><b>Platform & Presence Disclaimer</b></h3>
      <div className="disclaimer-body">
        <p>
          I intentionally do not maintain a presence on social networking platforms such as LinkedIn, GitHub, or similar services.
        </p>
        <p>
          Over time, I've found that these platforms tend to be fragmented and cluttered — spreading a person's work, interests, updates, and history across multiple applications. For someone trying to evaluate real technical ability, this often means jumping between several platforms just to understand one individual's work, thinking, and consistency.
        </p>
        <p>I don't believe this approach is efficient or necessary.</p>
        <p>Instead, I commit my work here.</p>
        <p>
          This website is a self-hosted, intentionally designed space where everything related to my professional journey lives in one place. My portfolio, resume, projects, documentation, learning notes, and even ongoing work updates are all maintained here in a clear and structured format.
        </p>
        <p>
          I prefer depth over visibility and clarity over noise. Rather than maintaining activity across multiple platforms, I focus on building real software, documenting my understanding, and improving my craft continuously.
        </p>
        <p>
          If you are looking to understand how I think, how I approach problems, what I build, and how I grow as an engineer over time, everything relevant is available here.
        </p>
      </div>
    </section>
  );
};
