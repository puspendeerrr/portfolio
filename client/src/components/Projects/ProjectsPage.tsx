import React from "react";
import { motion } from "framer-motion";
import { ProjectsIntroSection } from "./Intro/ProjectsIntroSection";
import { ProjectsListSection } from "./List/ProjectsListSection";
import { Disclaimer } from "../Shared/Disclaimer/Disclaimer";
import "./ProjectsPage.css";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

export const ProjectsPage: React.FC = () => {
  return (
    <motion.div 
      className="projects-page"
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0 }}
      variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
    >
      <motion.div variants={fadeUp}>
        <ProjectsIntroSection />
      </motion.div>
      <motion.div variants={fadeUp}>
        <ProjectsListSection />
      </motion.div>
      <Disclaimer />
    </motion.div>
  );
};
