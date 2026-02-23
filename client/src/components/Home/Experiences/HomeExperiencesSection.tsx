import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./HomeExperiencesSection.css";

interface ExperienceCard {
  id: string;
  title: string;
  description: string;
  label: "Academic" | "Project" | "Achievement";
}

const experiences: ExperienceCard[] = [
  {
    id: "bca-ai",
    title: "BCA in Artificial Intelligence",
    description: "Comprehensive computer science foundation at CodeQuotient School of Technology. First batch.",
    label: "Academic"
  },
  {
    id: "personal-platform",
    title: "Personal Digital Platform",
    description: "Self-hosted portfolio and knowledge mapping system. Built with focus on architecture and maintainability.",
    label: "Project"
  },
  {
    id: "dsa-systems",
    title: "DSA & Systems Programming",
    description: "Implementing data structures and algorithms in C/C++. Focus on efficiency and real-world problem-solving.",
    label: "Achievement"
  },
  {
    id: "frontend-systems",
    title: "Frontend Component Systems",
    description: "Building reusable React components and UI systems with emphasis on clarity and scalability.",
    label: "Project"
  },
  {
    id: "systems-thinking",
    title: "Systems & Performance Focus",
    description: "Deepening understanding of runtime behavior, IO operations, and performance-aware design.",
    label: "Achievement"
  }
];

export const HomeExperiencesSection: React.FC = () => {
  const [scrollPosition, setScrollPosition] = useState(0);

  const handleCardClick = () => {
    // Navigate to experience page
    window.location.href = "/experience";
  };

  const scroll = (direction: "left" | "right") => {
    const container = document.querySelector(".home-experiences-carousel");
    if (!container) return;

    const scrollAmount = 320;
    const newPosition = direction === "left" 
      ? Math.max(0, scrollPosition - scrollAmount)
      : scrollPosition + scrollAmount;

    container.scrollTo({ left: newPosition, behavior: "smooth" });
    setScrollPosition(newPosition);
  };

  return (
    <section className="surface home-experiences-section">
      <div className="section-header">
        <h2 className="section-title">Experiences & achievements</h2>
        <p className="section-caption">
          A selection of real-world work, learning, and achievements. Explore the full story on the Experience page.
        </p>
      </div>

      <div className="home-experiences-container">
        <button 
          type="button"
          className="home-experiences-nav home-experiences-nav--left"
          onClick={() => scroll("left")}
          aria-label="Scroll experiences left"
        >
          ‹
        </button>

        <div className="home-experiences-carousel">
          {experiences.map((exp) => (
            <button
              key={exp.id}
              type="button"
              onClick={handleCardClick}
              className="home-experience-card"
              aria-label={`View ${exp.title}`}
            >
              <div className="home-experience-card-label">{exp.label}</div>
              <h3 className="home-experience-card-title">{exp.title}</h3>
              <p className="home-experience-card-description">{exp.description}</p>
              <div className="home-experience-card-footer">View on Experience page →</div>
            </button>
          ))}
        </div>

        <button 
          type="button"
          className="home-experiences-nav home-experiences-nav--right"
          onClick={() => scroll("right")}
          aria-label="Scroll experiences right"
        >
          ›
        </button>
      </div>

      <div className="home-experiences-cta">
        <Link to="/experience" className="btn btn--primary">
          Explore all experiences
        </Link>
      </div>
    </section>
  );
};
