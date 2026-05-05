import React from "react";
import { motion } from "framer-motion";
import { Disclaimer } from "../Shared/Disclaimer/Disclaimer";
import "./ExperiencePage.css";

const items = [
  {
    id: "ec-head",
    icon: "🏆",
    title: "Head – Entrepreneurship Club",
    type: "Leadership",
    period: "2024 – Present",
    description: "Led and coordinated club activities. Managed team members, task allocation, and organized events, workshops, and discussions. Handled communication, execution, and leadership decisions.",
    accent: "linear-gradient(135deg, #7c3aed, #a855f7)",
    glow: "rgba(124, 58, 237, 0.3)",
  },
  {
    id: "sih-lead",
    icon: "💡",
    title: "Team Lead – Smart India Hackathon",
    type: "Project",
    period: "2024",
    description: "Led a team, distributed tasks, and managed deadlines. Guided problem-solving and development, presented the project effectively, and received appreciation from the HOD.",
    accent: "linear-gradient(135deg, #ec4899, #f97316)",
    glow: "rgba(236, 72, 153, 0.3)",
  },
  {
    id: "anchor",
    icon: "🎤",
    title: "Event Host / Anchor",
    type: "Milestone",
    period: "2024 – Present",
    description: "Hosted fresher's and sports events. Managed stage presence, audience engagement, coordinated with teams, and handled live situations while building strong public speaking confidence.",
    accent: "linear-gradient(135deg, #06b6d4, #3b82f6)",
    glow: "rgba(6, 182, 212, 0.3)",
  },
  {
    id: "intern",
    icon: "🏢",
    title: "Internship – CQST Panchkula",
    type: "Professional",
    period: "Jul – Aug 2025",
    description: "Worked in a team environment. Learned corporate workflow, communication, participated in discussions, and gained exposure to workplace dynamics.",
    accent: "linear-gradient(135deg, #10b981, #06b6d4)",
    glow: "rgba(16, 185, 129, 0.3)",
  }
];

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } }
};

export const ExperiencePage: React.FC = () => {
  return (
    <motion.div
      className="experience-page"
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0 }}
      variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
    >
      {/* Hero Section */}
      <motion.section variants={fadeUp} className="exp-hero">
        <span className="pill exp-pill">
          <span className="pill-dot" />
          CAREER & LEADERSHIP JOURNEY
        </span>
        <h1 className="text-hero exp-hero-title">
          Leadership <span className="text-gradient-accent">&</span> Experience
        </h1>
        <p className="exp-hero-desc">
          My experience goes beyond writing code. I have a proven track record of taking initiative, leading teams, managing complex events, and ensuring smooth coordination.
        </p>
      </motion.section>

      {/* Cards Grid */}
      <motion.div
        className="experience-grid"
        variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
      >
        {items.map((item) => (
          <motion.div
            key={item.id}
            variants={fadeUp}
            className="exp-card"
            style={{ '--card-glow': item.glow } as React.CSSProperties}
          >
            {/* Icon */}
            <div className="exp-card-icon" style={{ background: item.accent }}>
              {item.icon}
            </div>

            {/* Type badge */}
            <div className="exp-card-badge" style={{ background: item.accent }}>
              {item.type}
            </div>

            <h3 className="exp-card-title">{item.title}</h3>
            <div className="exp-card-period">{item.period}</div>
            <p className="exp-card-description">{item.description}</p>

            {/* Ambient glow */}
            <div className="exp-card-glow" style={{ background: item.glow }} />
          </motion.div>
        ))}
      </motion.div>

      <Disclaimer />
    </motion.div>
  );
};
