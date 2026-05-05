import React from "react";
import { motion } from "framer-motion";
import { ContactInfoSection } from "./Info/ContactInfoSection";
import { ContactFormSection } from "./Form/ContactFormSection";
import { Disclaimer } from "../Shared/Disclaimer/Disclaimer";
import "./ContactPage.css";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

export const ContactPage: React.FC = () => {
  return (
    <motion.div 
      className="contact-page"
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0 }}
      variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
    >
      <motion.div variants={fadeUp}>
        <ContactInfoSection />
      </motion.div>
      <motion.div variants={fadeUp}>
        <ContactFormSection />
      </motion.div>
      <Disclaimer />
    </motion.div>
  );
};
