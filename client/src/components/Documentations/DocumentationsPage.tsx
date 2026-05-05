import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Disclaimer } from "../Shared/Disclaimer/Disclaimer";
import { getDocumentations } from "../../api/api";
import "./DocumentationsPage.css";

interface Documentation {
  _id: string;
  title: string;
  date: string;
  points: string[];
  fileUrl: string;
  fileName: string;
  fileType: string;
}

const CARD_ACCENTS = [
  { gradient: "linear-gradient(135deg, #7c3aed, #a855f7)", glow: "rgba(124,58,237,0.3)" },
  { gradient: "linear-gradient(135deg, #ec4899, #f97316)", glow: "rgba(236,72,153,0.3)" },
  { gradient: "linear-gradient(135deg, #06b6d4, #3b82f6)", glow: "rgba(6,182,212,0.3)" },
  { gradient: "linear-gradient(135deg, #10b981, #06b6d4)", glow: "rgba(16,185,129,0.3)" },
  { gradient: "linear-gradient(135deg, #f59e0b, #ef4444)", glow: "rgba(245,158,11,0.3)" },
  { gradient: "linear-gradient(135deg, #e879f9, #7c3aed)", glow: "rgba(232,121,249,0.3)" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } }
};

export const DocumentationsPage: React.FC = () => {
  const [docsData, setDocsData] = useState<Documentation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const res = await getDocumentations();
        if (res.success) setDocsData(res.data);
      } catch (error) {
        console.error("Failed to fetch documentations:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDocs();
  }, []);

  return (
    <motion.div
      className="docs-page"
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0 }}
      variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
    >
      {/* Hero */}
      <motion.section variants={fadeUp} className="docs-hero">
        <span className="pill docs-pill">
          <span className="pill-dot" />
          KNOWLEDGE BASE
        </span>
        <h1 className="text-hero docs-hero-title">
          Documentation <span className="text-gradient-accent">&</span> Writing
        </h1>
        <p className="docs-hero-desc">
          Clear documentation is essential for turning complex systems into accessible knowledge.
          Here is a collection of my research and analytical writing.
        </p>
      </motion.section>

      {/* Grid */}
      <motion.section
        variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        className="docs-list-section"
      >
        {loading ? (
          <div className="docs-loading">
            <div className="docs-spinner" />
            <p>Loading documents...</p>
          </div>
        ) : docsData.length === 0 ? (
          <div className="docs-empty">
            <div className="docs-empty-icon">📭</div>
            <h3>No documents yet</h3>
            <p>Upload your first document from the admin dashboard.</p>
          </div>
        ) : (
          <div className="docs-grid">
            {docsData.map((doc, i) => {
              const accent = CARD_ACCENTS[i % CARD_ACCENTS.length];
              return (
                <motion.article
                  key={doc._id}
                  variants={fadeUp}
                  className="doc-card"
                  style={{ '--card-glow': accent.glow } as React.CSSProperties}
                >
                  {/* Top strip */}
                  <div className="doc-card-strip" style={{ background: accent.gradient }} />

                  <div className="doc-card-inner">
                    <div className="doc-card-top">
                      <div className="doc-card-icon" style={{ background: accent.gradient }}>📄</div>
                      <span className="doc-card-badge" style={{ background: accent.gradient }}>{doc.date}</span>
                    </div>

                    <h3 className="doc-card-title">{doc.title}</h3>

                    {doc.points && doc.points.length > 0 && (
                      <ul className="doc-card-points">
                        {doc.points.slice(0, 3).map((point, index) => (
                          <li key={index}>{point}</li>
                        ))}
                        {doc.points.length > 3 && (
                          <li className="doc-card-more">+{doc.points.length - 3} more</li>
                        )}
                      </ul>
                    )}

                    <div className="doc-card-footer">
                      <span className="doc-card-filename">
                        📎 {doc.fileName || 'Document'}
                      </span>
                      <a
                        href={`/documentations/${doc._id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="doc-card-btn"
                        style={{ background: accent.gradient }}
                      >
                        Read ↗
                      </a>
                    </div>
                  </div>

                  {/* Ambient glow */}
                  <div className="doc-card-glow" style={{ background: accent.glow }} />
                </motion.article>
              );
            })}
          </div>
        )}
      </motion.section>

      <Disclaimer />
    </motion.div>
  );
};
