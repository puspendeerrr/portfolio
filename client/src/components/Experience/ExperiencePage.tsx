import React from "react";
import { ExperienceSummarySection } from "./Summary/ExperienceSummarySection";
import { ExperienceTimelineSection } from "./Timeline/ExperienceTimelineSection";
import { Disclaimer } from "../Shared/Disclaimer/Disclaimer";
import "./ExperiencePage.css";

export const ExperiencePage: React.FC = () => {
  return (
    <div className="experience-page">
      <ExperienceSummarySection />
      <ExperienceTimelineSection />
      <Disclaimer />
    </div>
  );
};



