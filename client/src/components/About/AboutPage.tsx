import React from "react";
import { AboutSummarySection } from "./Summary/AboutSummarySection";
import { AboutEducationSection } from "./Education/AboutEducationSection";
import { AboutInterestsSection } from "./Interests/AboutInterestsSection";
import { Disclaimer } from "../Shared/Disclaimer/Disclaimer";
import "./AboutPage.css";

export const AboutPage: React.FC = () => {
  return (
    <div className="about-page">
      <AboutSummarySection />
      <div className="about-page-grid">
        <AboutEducationSection />
        <AboutInterestsSection />
      </div>
      <Disclaimer />
    </div>
  );
};



