import React, { useState, useEffect } from "react";
import { CodeLibraryIntroSection } from "./Intro/CodeLibraryIntroSection";
import { CodeLibraryEntriesSection } from "./Entries/CodeLibraryEntriesSection";
import { Disclaimer } from "../Shared/Disclaimer/Disclaimer";
import "./CodeLibraryPage.css";

interface CodeFile {
  _id: string;
  fileName: string;
  folderPath: string;
  programmingLanguage: string;
  description: string;
  codeContent: string;
  createdAt: string;
}

export const CodeLibraryPage: React.FC = () => {
  const [files, setFiles] = useState<CodeFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/files');
      
      if (!response.ok) {
        throw new Error('Failed to fetch files');
      }

      const data = await response.json();
      
      if (data.success && Array.isArray(data.data)) {
        setFiles(data.data);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load files');
      setFiles([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="code-library-page">
      <CodeLibraryIntroSection />
      <CodeLibraryEntriesSection 
        files={files} 
        loading={loading} 
        error={error} 
      />
      <Disclaimer />
    </div>
  );
};



