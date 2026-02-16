import React from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useTheme } from "../../theme/ThemeContext";
import { Footer } from "../Footer/Footer";
import "./Layout.css";

const navItems = [
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

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  return (
    <>
      <header className="layout-header">
        <div className="layout-header-inner">
          <Link to="/" className="brand">
            <div className="brand-mark">
              <span className="brand-mark-orbit" />
              <span className="brand-mark-core" />
            </div>
            <div className="brand-text">
              <span className="brand-title">Puspender Kumar</span>
              <span className="brand-subtitle">Software Engineer · Developer Identity</span>
            </div>
          </Link>
          <nav className="nav">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  [
                    "nav-link",
                    isActive ||
                    (item.path !== "/" &&
                      location.pathname.startsWith(item.path) &&
                      item.path !== "/")
                      ? "nav-link--active"
                      : ""
                  ]
                    .filter(Boolean)
                    .join(" ")
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          <button
            type="button"
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            <span className="theme-toggle-thumb" />
            <span className="theme-toggle-icon theme-toggle-icon--sun">☀</span>
            <span className="theme-toggle-icon theme-toggle-icon--moon">☾</span>
          </button>
        </div>
      </header>
      {children}
      <Footer />
    </>
  );
};


