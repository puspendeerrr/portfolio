import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import "./HomeHeroSection.css";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

export const HomeHeroSection: React.FC = () => {
  return (
    <section className="home-hero-section">
      <motion.div 
        className="home-hero-content"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={fadeUp} className="pill hero-pill">
          <span className="pill-dot" />
          BCA (AI) STUDENT & FUTURE HR PROFESSIONAL
        </motion.div>
        
        <motion.h1 variants={fadeUp} className="text-hero home-hero-title">
          Bridging the gap between <br />
          <span className="text-gradient-accent">technology and people.</span>
        </motion.h1>
        
        <motion.p variants={fadeUp} className="home-hero-body">
          I am a motivated BCA student with a strong interest in Human Resources, people management, and communication. I combine a proactive, detail-oriented mindset with leadership experience to solve real-world problems.
        </motion.p>
        
        <motion.div variants={fadeUp} className="home-hero-actions">
          <Link to="/about" className="btn btn--primary">
            More about me
          </Link>
          <Link to="/experience" className="btn btn--ghost">
            View leadership experience
          </Link>
        </motion.div>
        
        <motion.div variants={fadeUp} className="home-hero-meta">
          <div className="surface home-meta-card">
            <div className="home-meta-label">Focus</div>
            <div className="home-meta-value text-gradient">HR · Leadership · Communication</div>
          </div>
          <div className="surface home-meta-card">
            <div className="home-meta-label">Tech Foundation</div>
            <div className="home-meta-value text-gradient">
              MERN Stack, Python, Documentation & Analytics
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};
