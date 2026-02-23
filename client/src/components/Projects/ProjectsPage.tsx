import React from "react";
import { ProjectsIntroSection } from "./Intro/ProjectsIntroSection";
import { ProjectsListSection } from "./List/ProjectsListSection";
import { Disclaimer } from "../Shared/Disclaimer/Disclaimer";
import "./ProjectsPage.css";

export const ProjectsPage: React.FC = () => {
  return (
    <div className="projects-page">
      <ProjectsIntroSection />
      <ProjectsListSection />
      <Disclaimer />
    </div>
  );
};



