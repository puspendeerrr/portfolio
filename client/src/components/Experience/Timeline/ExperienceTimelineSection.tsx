import React from "react";
import "./ExperienceTimelineSection.css";

interface ExperienceItem {
  id: string;
  title: string;
  type: "project" | "certification" | "milestone" | "leadership";
  description: string;
}

const items: ExperienceItem[] = [
  {
    id: "ec-head",
    title: "Head – Entrepreneurship Club",
    type: "leadership",
    description: "Led and coordinated club activities. Managed team members, task allocation, and organized events, workshops, and discussions. Handled communication, execution, and leadership decisions."
  },
  {
    id: "sih-lead",
    title: "Team Lead – Smart India Hackathon",
    type: "project",
    description: "Led a team, distributed tasks, and managed deadlines. Guided problem-solving and development, presented the project effectively, and received appreciation from the HOD."
  },
  {
    id: "anchor",
    title: "Event Host / Anchor",
    type: "milestone",
    description: "Hosted fresher’s and sports events. Managed stage presence, audience engagement, coordinated with teams, and handled live situations while building strong public speaking confidence."
  },
  {
    id: "intern",
    title: "Internship (CQST Panchkula)",
    type: "project",
    description: "Worked in a team environment (July-Aug 2025). Learned corporate workflow, communication, participated in discussions, and gained exposure to workplace dynamics."
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



