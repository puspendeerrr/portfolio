import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "../Layout/Layout";
import { HomePage } from "../Home/HomePage";
import { AboutPage } from "../About/AboutPage";
import { SkillsPage } from "../Skills/SkillsPage";
import { ProjectsPage } from "../Projects/ProjectsPage";
import { ProjectCodePage } from "../ProjectCodeViewer/ProjectCodePage";
import { CodeLibraryPage } from "../CodeLibrary/CodeLibraryPage";
import { LearningsPage } from "../Learnings/LearningsPage";
import { ResumePage } from "../Resume/ResumePage";
import { ExperiencePage } from "../Experience/ExperiencePage";
import { ContactPage } from "../Contact/ContactPage";
import LoginPage from "../Auth/LoginPage";
import ProtectedRoute from "../Auth/ProtectedRoute";
import DashboardPage from "../Dashboard/DashboardPage";
import "./App.css";

export const App: React.FC = () => {
  // Clear auth on every app load - requires fresh login each session
  useEffect(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('tokenExpiry');
  }, []);
  return (
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
                  <Route path="/learnings" element={<LearningsPage />} />
                  <Route path="/resume" element={<ResumePage />} />
                  <Route path="/experience" element={<ExperiencePage />} />
                  {/* <Route path="/compiler" element={<CompilerPage />} />/     */}
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
            </Layout>
          </div>
        }
      />
    </Routes>
  );
};


