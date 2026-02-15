import React from "react";
import { SkillsLanguagesSection } from "./Languages/SkillsLanguagesSection";
import { SkillsEngineeringSection } from "./Engineering/SkillsEngineeringSection";
import { SkillsCSSection } from "./CS/SkillsCSSection";
import { SkillsToolsSection } from "./Tools/SkillsToolsSection";
import { Disclaimer } from "../Shared/Disclaimer/Disclaimer";
import "./SkillsPage.css";

export const SkillsPage: React.FC = () => {
  return (
    <div className="skills-page">
      <SkillsLanguagesSection />
      <div className="skills-page-grid">
        <SkillsEngineeringSection />
        <SkillsCSSection />
      </div>
      <SkillsToolsSection />
      <Disclaimer />
    </div>
  );
};



