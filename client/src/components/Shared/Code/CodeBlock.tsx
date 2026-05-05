import React from "react";
// @ts-expect-error - prismjs types are not available
import Prism from "prismjs";

import "prismjs/components/prism-javascript";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-tsx";
import "prismjs/components/prism-css";
import "prismjs/components/prism-markup";
import "./CodeBlock.css";

interface CodeBlockProps {
  language?: string;   // optional now (safer)
  code?: string;       // optional now (safer)
}

export const CodeBlock: React.FC<CodeBlockProps> = ({
  language = "javascript",
  code = "",
}) => {
  // Ensure code is always a string
  const safeCode = typeof code === "string" ? code : "";

  // Ensure language exists in Prism
  const safeLanguage =
    Prism.languages[language] != null
      ? (language as keyof typeof Prism.languages)
      : "javascript";

  // Highlight safely
  let highlighted = "";

  try {
    if (safeCode.length > 0) {
      highlighted = Prism.highlight(
        safeCode,
        Prism.languages[safeLanguage],
        safeLanguage
      );
    }
  } catch (error) {
    console.error("Prism highlight error:", error);
    highlighted = safeCode; // fallback to raw code
  }

  const lines = highlighted ? highlighted.split(/\r?\n/) : [];

  return (
    <div className="code-block" aria-label="Source code">
      <div className="code-block-scroll">
        <pre className={`code-block-pre language-${safeLanguage}`}>
          {lines.length > 0 ? (
            lines.map((lineHtml: string, index: number) => (
              <div key={index} className="code-block-line">
                <span className="code-block-line-number">
                  {index + 1}
                </span>
                <span
                  className="code-block-line-content"
                  dangerouslySetInnerHTML={{
                    __html: lineHtml || " ",
                  }}
                />
              </div>
            ))
          ) : (
            <div className="code-block-line">
              <span className="code-block-line-number">1</span>
              <span className="code-block-line-content"> </span>
            </div>
          )}
        </pre>
      </div>
    </div>
  );
};
