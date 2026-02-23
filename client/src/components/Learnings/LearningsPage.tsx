import React from "react";
import { LearningsIntroSection } from "./Intro/LearningsIntroSection";
import { LearningsListSection } from "./List/LearningsListSection";
import { Disclaimer } from "../Shared/Disclaimer/Disclaimer";
import "./LearningsPage.css";

export const LearningsPage: React.FC = () => {
  return (
    <div className="learnings-page">
      <LearningsIntroSection />
      <LearningsListSection />
      <Disclaimer />
    </div>
  );
};



