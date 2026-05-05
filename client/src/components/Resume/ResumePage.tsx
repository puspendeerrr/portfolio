import React from "react";
import { ResumeHeaderSection } from "./Header/ResumeHeaderSection";
import { ResumeBodySection } from "./Body/ResumeBodySection";
import { Disclaimer } from "../Shared/Disclaimer/Disclaimer";
import "./ResumePage.css";

export const ResumePage: React.FC = () => {
  return (
    <div className="resume-page">
      <ResumeHeaderSection />
      <ResumeBodySection />
      <Disclaimer />
    </div>
  );
};



