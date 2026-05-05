import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getDocumentations } from '../../api/api';
import './DocumentViewPage.css';

interface Documentation {
  _id: string;
  title: string;
  date: string;
  fileUrl: string;
  fileName: string;
  fileType: string;
  points: string[];
}

export const DocumentViewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [doc, setDoc] = useState<Documentation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDoc = async () => {
      try {
        const res = await getDocumentations();
        if (res.success) {
          const found = res.data.find((d: Documentation) => d._id === id);
          if (found) {
            setDoc(found);
          } else {
            setError('Document not found');
          }
        }
      } catch (err) {
        setError('Failed to load document');
      } finally {
        setLoading(false);
      }
    };
    fetchDoc();
  }, [id]);

  if (loading) {
    return (
      <div className="doc-view-loading">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error || !doc) {
    return (
      <div className="doc-view-error">
        <h2>{error || 'Document not found'}</h2>
        <Link to="/documentations" className="btn btn--primary">Back to Documentations</Link>
      </div>
    );
  }

  const isPdf = doc.fileType === 'application/pdf' || doc.fileName.toLowerCase().endsWith('.pdf');
  
  // Google Docs Viewer URL for Word files
  const googleDocsViewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(doc.fileUrl)}&embedded=true`;

  return (
    <motion.div 
      className="doc-view-page"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="doc-view-header">
        <Link to="/documentations" className="doc-view-back">
          ← Back
        </Link>
        <h1 className="doc-view-title">{doc.title}</h1>
        <div className="doc-view-meta">
          <span className="doc-view-date">{doc.date}</span>
          <span className="doc-view-filename">📄 {doc.fileName}</span>
        </div>
      </div>

      <div className="doc-view-content surface">
        {isPdf ? (
          <iframe 
            src={doc.fileUrl} 
            className="doc-iframe"
            title={doc.title}
            frameBorder="0"
          ></iframe>
        ) : (
          <iframe 
            src={googleDocsViewerUrl} 
            className="doc-iframe"
            title={doc.title}
            frameBorder="0"
          ></iframe>
        )}
      </div>
      
      {doc.points && doc.points.length > 0 && (
        <div className="doc-view-summary surface">
          <h3>Key Takeaways</h3>
          <ul>
            {doc.points.map((point, i) => (
              <li key={i}>{point}</li>
            ))}
          </ul>
        </div>
      )}
    </motion.div>
  );
};
