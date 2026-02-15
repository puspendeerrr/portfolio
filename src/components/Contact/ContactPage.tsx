import React from "react";
import { ContactInfoSection } from "./Info/ContactInfoSection";
import { ContactFormSection } from "./Form/ContactFormSection";
import { Disclaimer } from "../Shared/Disclaimer/Disclaimer";
import "./ContactPage.css";

export const ContactPage: React.FC = () => {
  return (
    <div className="contact-page">
      <ContactInfoSection />
      <Disclaimer />
      <ContactFormSection />
    </div>
  );
};



