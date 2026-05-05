import React from "react";
import { motion } from "framer-motion";
import { HomeHeroSection } from "./Hero/HomeHeroSection";
import { Disclaimer } from "../Shared/Disclaimer/Disclaimer";
import "./HomePage.css";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } }
};

const strengths = [
  {
    icon: "🎯",
    title: "Leadership & Management",
    desc: "Successfully led the Entrepreneurship Club and a Smart India Hackathon team. I excel at delegating tasks, managing deadlines, and ensuring everyone feels heard and valued.",
    accent: "linear-gradient(135deg, #7c3aed, #a855f7)",
    glow: "rgba(124, 58, 237, 0.25)",
    tag: "Core Skill",
    span: "large"
  },
  {
    icon: "⚡",
    title: "Technical Acumen",
    desc: "MERN stack, Python, C++. I bridge the gap between technical constraints and human-centric solutions.",
    accent: "linear-gradient(135deg, #ec4899, #f97316)",
    glow: "rgba(236, 72, 153, 0.25)",
    tag: "Tech",
    span: "tall"
  },
  {
    icon: "🎤",
    title: "Communication",
    desc: "Experienced event host and anchor. I know how to read a room, engage an audience, and mediate conflicts effectively.",
    accent: "linear-gradient(135deg, #06b6d4, #3b82f6)",
    glow: "rgba(6, 182, 212, 0.25)",
    tag: "Soft Skill",
    span: "wide"
  },
  {
    icon: "📋",
    title: "Documentation",
    desc: "Detail-oriented documentation, MS Excel & Google Sheets analytics.",
    accent: "linear-gradient(135deg, #10b981, #06b6d4)",
    glow: "rgba(16, 185, 129, 0.25)",
    tag: "Tools",
    span: "small"
  },
  {
    icon: "🤝",
    title: "Diplomacy",
    desc: "Strong interpersonal skills built through HR interest, conflict resolution, and cross-functional teamwork.",
    accent: "linear-gradient(135deg, #f59e0b, #ef4444)",
    glow: "rgba(245, 158, 11, 0.25)",
    tag: "People",
    span: "small"
  },
];

export const HomePage: React.FC = () => {
  return (
    <motion.div
      className="home-page-grid"
      aria-label="Home"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <HomeHeroSection />

      {/* Core Strengths Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        className="home-strengths"
      >
        <motion.div variants={fadeUp} className="home-section-label">
          <span className="pill hero-pill" style={{ background: 'rgba(124,58,237,0.12)', borderColor: 'rgba(124,58,237,0.2)', color: '#a78bfa' }}>
            <span className="pill-dot" style={{ background: '#a78bfa', boxShadow: '0 0 8px #7c3aed' }} />
            WHAT I BRING TO THE TABLE
          </span>
        </motion.div>
        <motion.h2 variants={fadeUp} className="home-strengths-title">
          Core <span className="text-gradient-accent">Strengths</span>
        </motion.h2>

        <div className="home-bento-grid">
          {strengths.map((s, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              className={`home-bento-card home-bento-card--${s.span}`}
              style={{ '--card-glow': s.glow } as React.CSSProperties}
            >
              <div className="home-bento-icon" style={{ background: s.accent }}>
                {s.icon}
              </div>
              <div className="home-bento-tag" style={{ background: s.accent }}>{s.tag}</div>
              <h3 className="home-bento-title">{s.title}</h3>
              <p className="home-bento-desc">{s.desc}</p>
              <div className="home-bento-glow" style={{ background: s.glow }} />
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Stats Strip */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        className="home-stats-strip surface"
      >
        {[
          { value: "7.9", label: "CGPA Score", color: "#a78bfa" },
          { value: "2024", label: "Started BCA (AI)", color: "#f472b6" },
          { value: "4+", label: "Roles Led", color: "#34d399" },
          { value: "3", label: "Years Program", color: "#60a5fa" },
        ].map((stat, i) => (
          <motion.div key={i} variants={fadeUp} className="home-stat">
            <div className="home-stat-value" style={{ color: stat.color }}>{stat.value}</div>
            <div className="home-stat-label">{stat.label}</div>
          </motion.div>
        ))}
      </motion.section>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
      >
        <Disclaimer />
      </motion.div>
    </motion.div>
  );
};
