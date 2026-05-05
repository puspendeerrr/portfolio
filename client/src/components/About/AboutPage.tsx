import React from "react";
import { motion } from "framer-motion";
import { Disclaimer } from "../Shared/Disclaimer/Disclaimer";
import "./AboutPage.css";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } }
};

const interests = [
  { icon: "🧠", label: "Human behavior & communication", color: "#a78bfa" },
  { icon: "⭐", label: "Customer experience", color: "#f472b6" },
  { icon: "🤝", label: "Relationship management", color: "#34d399" },
  { icon: "🎯", label: "Leadership & team coordination", color: "#60a5fa" },
  { icon: "⚖️", label: "Conflict resolution", color: "#fb923c" },
  { icon: "🏢", label: "Workplace dynamics", color: "#e879f9" },
];

const skills = [
  { name: "MERN Stack", level: 75, color: "#a78bfa" },
  { name: "Python", level: 70, color: "#f472b6" },
  { name: "C++", level: 65, color: "#34d399" },
  { name: "MS Excel / Sheets", level: 90, color: "#60a5fa" },
  { name: "Documentation", level: 95, color: "#fb923c" },
  { name: "Public Speaking", level: 85, color: "#e879f9" },
];

export const AboutPage: React.FC = () => {
  return (
    <motion.div
      className="about-page"
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0 }}
      variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
    >
      {/* Hero */}
      <motion.section variants={fadeUp} className="about-hero">
        <span className="pill about-pill">
          <span className="pill-dot" />
          PROFILE OVERVIEW
        </span>
        <h1 className="text-hero about-hero-title">
          About <span className="text-gradient-accent">Me</span>
        </h1>
        <p className="about-hero-desc">
          I am a motivated BCA (AI) student with a strong interest in{" "}
          <span className="about-highlight">Human Resources</span>,{" "}
          <span className="about-highlight">people management</span>, and{" "}
          <span className="about-highlight">communication</span>. I bring a proactive,
          detail-oriented mindset backed by real leadership experience.
        </p>
      </motion.section>

      {/* Bento Grid */}
      <div className="about-bento">

        {/* Education Card - Large */}
        <motion.div variants={fadeUp} className="about-card about-card--edu">
          <div className="about-card-icon" style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)' }}>🎓</div>
          <div className="about-card-tag" style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)' }}>Education</div>
          <h2 className="about-card-title">BCA (Artificial Intelligence)</h2>
          <div className="about-edu-school">CodeQuotient School of Technology</div>
          <div className="about-edu-row">
            <span className="about-edu-badge">2024 – 2027</span>
            <span className="about-edu-badge about-edu-badge--score">Score: 7.9 ⭐</span>
          </div>
          <div className="about-edu-tags">
            {["MERN Stack","Python","C++","DSA","OOP","AI/ML","DBMS","Networking"].map(t => (
              <span key={t} className="about-skill-chip">{t}</span>
            ))}
          </div>
          <div className="about-card-glow" style={{ background: 'rgba(124,58,237,0.3)' }} />
        </motion.div>

        {/* Skills Card */}
        <motion.div variants={fadeUp} className="about-card about-card--skills">
          <div className="about-card-icon" style={{ background: 'linear-gradient(135deg, #ec4899, #f97316)' }}>📊</div>
          <div className="about-card-tag" style={{ background: 'linear-gradient(135deg, #ec4899, #f97316)' }}>Skill Levels</div>
          <h2 className="about-card-title">Proficiency</h2>
          <div className="about-skills-list">
            {skills.map(s => (
              <div key={s.name} className="about-skill-row">
                <div className="about-skill-meta">
                  <span className="about-skill-name">{s.name}</span>
                  <span className="about-skill-pct" style={{ color: s.color }}>{s.level}%</span>
                </div>
                <div className="about-skill-bar">
                  <motion.div
                    className="about-skill-fill"
                    style={{ background: s.color }}
                    initial={{ width: 0 }}
                    whileInView={{ width: `${s.level}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="about-card-glow" style={{ background: 'rgba(236,72,153,0.3)' }} />
        </motion.div>

        {/* Interests Card */}
        <motion.div variants={fadeUp} className="about-card about-card--interests">
          <div className="about-card-icon" style={{ background: 'linear-gradient(135deg, #06b6d4, #3b82f6)' }}>💡</div>
          <div className="about-card-tag" style={{ background: 'linear-gradient(135deg, #06b6d4, #3b82f6)' }}>Focus Areas</div>
          <h2 className="about-card-title">Professional Interests</h2>
          <div className="about-interests-grid">
            {interests.map((item) => (
              <div key={item.label} className="about-interest-chip">
                <span className="about-interest-icon">{item.icon}</span>
                <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem' }}>{item.label}</span>
              </div>
            ))}
          </div>
          <div className="about-card-glow" style={{ background: 'rgba(6,182,212,0.3)' }} />
        </motion.div>

        {/* Quick Facts */}
        <motion.div variants={fadeUp} className="about-card about-card--facts">
          <div className="about-card-icon" style={{ background: 'linear-gradient(135deg, #10b981, #06b6d4)' }}>⚡</div>
          <div className="about-card-tag" style={{ background: 'linear-gradient(135deg, #10b981, #06b6d4)' }}>Quick Facts</div>
          <h2 className="about-card-title">At a Glance</h2>
          <div className="about-facts-list">
            {[
              { label: "Location", value: "India" },
              { label: "Email", value: "puspendernarayan@gmail.com" },
              { label: "Phone", value: "+91 9306690894" },
              { label: "Website", value: "puspender.in" },
            ].map(f => (
              <div key={f.label} className="about-fact-row">
                <span className="about-fact-label">{f.label}</span>
                <span className="about-fact-value">{f.value}</span>
              </div>
            ))}
          </div>
          <div className="about-card-glow" style={{ background: 'rgba(16,185,129,0.3)' }} />
        </motion.div>
      </div>

      <Disclaimer />
    </motion.div>
  );
};
