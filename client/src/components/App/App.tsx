import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "../Layout/Layout";
import { HomePage } from "../Home/HomePage";
import { AboutPage } from "../About/AboutPage";
import { SkillsPage } from "../Skills/SkillsPage";
import { ProjectsPage } from "../Projects/ProjectsPage";
import { ProjectCodePage } from "../ProjectCodeViewer/ProjectCodePage";
import { CodeLibraryPage } from "../CodeLibrary/CodeLibraryPage";
import { ResumePage } from "../Resume/ResumePage";
import { ExperiencePage } from "../Experience/ExperiencePage";
import { ContactPage } from "../Contact/ContactPage";
import { ActivitiesPage } from "../Activities/ActivitiesPage";
import { DocumentationsPage } from "../Documentations/DocumentationsPage";
import { DocumentViewPage } from "../Documentations/DocumentViewPage";
import LoginPage from "../Auth/LoginPage";
import ProtectedRoute from "../Auth/ProtectedRoute";
import DashboardPage from "../Dashboard/DashboardPage";
// import CompilerPage from "../Compiler/CompilerPage";
import { ScrollToTop } from "./ScrollToTop";
import { CursorGlow } from "./CursorGlow";
import "./App.css";

export const App: React.FC = () => {
  // Clear auth on every app load - requires fresh login each session
  useEffect(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('tokenExpiry');
    
    // Initialize Lenis smooth scrolling
    import('@studio-freight/lenis').then(({ default: Lenis }) => {
      const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        smoothTouch: false,
        touchMultiplier: 2,
      });

      function raf(time: number) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }

      requestAnimationFrame(raf);
      
      return () => lenis.destroy();
    });
  }, []);
  return (
    <>
      <CursorGlow />
      <ScrollToTop />
      <Routes>
        {/* Auth Routes - No Layout */}
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />

      {/* Portfolio Routes - With Layout */}
      <Route
        path="/*"
        element={
          <div className="app-shell">
            <Layout>
              <main className="app-main">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/skills" element={<SkillsPage />} />
                  <Route path="/projects" element={<ProjectsPage />} />
                  <Route path="/projects/:projectId/code" element={<ProjectCodePage />} />
                  <Route path="/code-library" element={<CodeLibraryPage />} />
                  <Route path="/documentations" element={<DocumentationsPage />} />
                  <Route path="/documentations/:id" element={<DocumentViewPage />} />
                  <Route path="/resume" element={<ResumePage />} />
                  <Route path="/experience" element={<ExperiencePage />} />
                  <Route path="/activities" element={<ActivitiesPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
            </Layout>
          </div>
        }
      />
      </Routes>
    </>
  );
};


