import React from "react";
import { motion } from "framer-motion";
import { Disclaimer } from "../Shared/Disclaimer/Disclaimer";
import "./ActivitiesPage.css";

const activitiesData = [
  {
    id: "anchor",
    title: "Event Host / Anchor",
    subtitle: "Fresher’s and Sports Events",
    description: "Managed stage presence and audience engagement. Coordinated with teams and handled live situations, building strong public speaking confidence."
  },
  {
    id: "club-head",
    title: "Head",
    subtitle: "Entrepreneurship Club",
    description: "Organized events, workshops, and discussions. Handled communication and execution while taking leadership decisions."
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
};

export const ActivitiesPage: React.FC = () => {
  return (
    <motion.div 
      className="activities-page"
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0 }}
      variants={containerVariants}
    >
      <motion.section variants={cardVariants} className="activities-intro" style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h2 className="text-hero" style={{ fontSize: '3rem' }}>Public Speaking <span className="text-gradient-accent">&</span> Activities</h2>
        <p className="activities-intro-text" style={{ fontSize: '1.2rem', color: 'var(--color-text-muted)', marginTop: '20px', maxWidth: '700px', margin: '20px auto 0' }}>
          Effective communication is the bridge between a good idea and real-world impact. Here are some of the events and activities where I took the stage or coordinated from the front.
        </p>
      </motion.section>

      <motion.section variants={containerVariants} className="activities-list-section">
        <div className="activities-grid">
          {activitiesData.map((activity) => (
            <motion.article 
              key={activity.id} 
              variants={cardVariants}
              className="surface surface-hover activity-card"
            >
              <h3 className="activity-title">{activity.title}</h3>
              <div className="activity-subtitle text-gradient-accent">{activity.subtitle}</div>
              <p className="activity-description">{activity.description}</p>
            </motion.article>
          ))}
        </div>
      </motion.section>

      <Disclaimer />
    </motion.div>
  );
};
