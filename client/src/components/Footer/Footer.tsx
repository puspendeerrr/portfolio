import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

const footerNavItems = [
  { path: "/", label: "Home" },
  { path: "/about", label: "About" },
  { path: "/experience", label: "Experience" },
  { path: "/activities", label: "Activities" },
  { path: "/skills", label: "Skills" },
  { path: "/projects", label: "Projects" },
  { path: "/documentations", label: "Documentations" },
  { path: "/contact", label: "Contact" }
];

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-top">
          <div className="footer-brand-section">
            <h2 className="footer-logo">Puspender Kumar</h2>
            <p className="footer-tagline">Bridging the gap between technology and people.</p>
          </div>
          <nav className="footer-nav">
            {footerNavItems.map((item) => (
              <Link key={item.path} to={item.path} className="footer-nav-link">
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="footer-bottom">
          <div className="footer-meta">
            <span>&copy; {currentYear} Puspender Kumar. All rights reserved.</span>
          </div>
          <div className="footer-socials">
            <a href="mailto:puspendernarayan@gmail.com" className="footer-social-link">Email</a>
            <a href="tel:+919306690894" className="footer-social-link">Phone</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
