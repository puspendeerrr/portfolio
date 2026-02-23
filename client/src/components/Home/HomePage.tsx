import React from "react";
import { HomeHeroSection } from "./Hero/HomeHeroSection";
import { TechShowcaseSection } from "./TechShowcase/TechShowcaseSection";
import { HomeExperiencesSection } from "./Experiences/HomeExperiencesSection";
import { Disclaimer } from "../Shared/Disclaimer/Disclaimer";
import "./HomePage.css";

export const HomePage: React.FC = () => {
  return (
    <div className="home-page-grid" aria-label="Home">
      <HomeHeroSection />
      <TechShowcaseSection />
      <HomeExperiencesSection />
      <Disclaimer />
    </div>
  );
};



