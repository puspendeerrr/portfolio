import React from "react";
import { Link } from "react-router-dom";
import { HeroSlideshow } from "./HeroSlideshow";
import "./HomeHeroSection.css";

export const HomeHeroSection: React.FC = () => {
  return (
    <section className="surface home-hero-section">
      <div className="home-hero-left">
        <div className="pill">
          <span className="pill-dot" />
          PERSONAL TECHNICAL IDENTITY
        </div>
        <h1 className="home-hero-title">
          A single place for{" "}
          <span className="home-hero-title-accent">everything I build and learn.</span>
        </h1>
        <p className="home-hero-body">
          This platform replaces scattered profiles. It shows my engineering work, the code behind
          it, and the concepts I&apos;m actively learning.
        </p>
        <div className="home-hero-meta">
          <div>
            <div className="home-meta-label">Focus</div>
            <div className="home-meta-value">Software engineering · Systems thinking</div>
          </div>
          <div>
            <div className="home-meta-label">This site</div>
            <div className="home-meta-value">
              Fully self-hosted representation of projects, code, and learning.
            </div>
          </div>
        </div>
        <div className="home-hero-actions">
          <Link to="/projects" className="btn btn--primary">
            View engineering work
          </Link>
          <Link to="/resume" className="btn btn--ghost">
            View resume
          </Link>
        </div>
        <div className="home-hero-footnote">
          <span className="tag tag--accent">Code-first</span>
          <span className="tag">Every project links to its code inside this platform.</span>
        </div>
      </div>
      <div className="home-hero-right">
        <HeroSlideshow />
      </div>
    </section>
  );
};



