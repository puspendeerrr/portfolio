import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

const footerNavItems = [
  { path: "/", label: "Home" },
  { path: "/about", label: "About" },
  { path: "/skills", label: "Skills" },
  { path: "/projects", label: "Projects" },
  { path: "/code-library", label: "Code Library" },
  { path: "/learnings", label: "Learnings" },
  { path: "/resume", label: "Resume" },
  { path: "/experience", label: "Experience" },
  { path: "/contact", label: "Contact" }
];

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-inner">
        <nav className="footer-nav">
          {footerNavItems.map((item) => (
            <Link key={item.path} to={item.path} className="footer-nav-link">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="footer-meta">
          <div className="footer-brand">Personal Digital Platform</div>
          <div className="footer-year">&copy; {currentYear} • Fully self-hosted</div>
        </div>
      </div>
    </footer>
  );
};
