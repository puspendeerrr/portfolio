import React from "react";
import "./ExperienceTimelineSection.css";

interface ExperienceItem {
  id: string;
  title: string;
  type: "project" | "certification" | "milestone";
  description: string;
}

const items: ExperienceItem[] = [
  {
    id: "platform",
    title: "Built personal digital platform",
    type: "project",
    description:
      "Designed and implemented this self-hosted platform to centralize projects, code, and learning."
  }
];

export const ExperienceTimelineSection: React.FC = () => {
  return (
    <section className="surface experience-timeline">
      <ul className="experience-timeline-list">
        {items.map((item) => (
          <li key={item.id} className="experience-timeline-item">
            <div className="experience-timeline-dot" />
            <div>
              <div className="experience-timeline-title">{item.title}</div>
              <div className="experience-timeline-type">{item.type}</div>
              <p className="experience-timeline-description">{item.description}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};



