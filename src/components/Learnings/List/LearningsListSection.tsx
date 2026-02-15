import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./LearningsListSection.css";

interface DocumentationEntry {
  id: string;
  title: string;
  description: string;
  category: "AI" | "Programming" | "DSA" | "Systems";
  path: string;
  status: "completed" | "in-progress";
}

const documentation: DocumentationEntry[] = [
  // AI & Machine Learning
  {
    id: "ai-intro",
    title: "Introduction to Artificial Intelligence",
    description: "Core AI concepts, agents, and real-world applications.",
    category: "AI",
    path: "/docs/ai/introduction",
    status: "completed"
  },
  {
    id: "ai-agents",
    title: "AI Agents and Intelligent Systems",
    description: "Reflex agents, goal-based agents, and rational agents.",
    category: "AI",
    path: "/docs/ai/agents",
    status: "completed"
  },
  {
    id: "ai-usecases",
    title: "Use Cases of AI in Real Software",
    description: "Practical understanding of how AI is used in real applications.",
    category: "AI",
    path: "/docs/ai/use-cases",
    status: "in-progress"
  },
  // Programming & Software Engineering
  {
    id: "prog-ccpp",
    title: "Basics of Programming with C/C++",
    description: "Core logic, control flow, and problem-solving fundamentals.",
    category: "Programming",
    path: "/docs/programming/c-cpp",
    status: "completed"
  },
  {
    id: "prog-js",
    title: "JavaScript Fundamentals",
    description: "Language basics and behavior used in real web applications.",
    category: "Programming",
    path: "/docs/programming/javascript",
    status: "completed"
  },
  {
    id: "prog-oop",
    title: "Object-Oriented Programming Concepts",
    description: "Abstraction, encapsulation, inheritance, and polymorphism.",
    category: "Programming",
    path: "/docs/programming/oop",
    status: "in-progress"
  },
  // Data Structures & Algorithms
  {
    id: "dsa-structures",
    title: "Data Structures Overview",
    description: "Arrays, linked lists, stacks, queues, and their trade-offs.",
    category: "DSA",
    path: "/docs/dsa/data-structures",
    status: "completed"
  },
  {
    id: "dsa-complexity",
    title: "Algorithmic Thinking & Complexity",
    description: "Understanding complexity beyond just Big-O notation.",
    category: "DSA",
    path: "/docs/dsa/complexity",
    status: "in-progress"
  },
  // Systems & Computer Fundamentals
  {
    id: "sys-os",
    title: "Operating System Basics",
    description: "Processes, memory, and scheduling fundamentals.",
    category: "Systems",
    path: "/docs/systems/os-basics",
    status: "completed"
  },
  {
    id: "sys-dbms",
    title: "DBMS Fundamentals",
    description: "Databases, queries, and data organization concepts.",
    category: "Systems",
    path: "/docs/systems/dbms",
    status: "in-progress"
  },
  {
    id: "sys-loc",
    title: "Logical Organization of Computer",
    description: "Understanding how computers work internally.",
    category: "Systems",
    path: "/docs/systems/loc",
    status: "in-progress"
  }
];

const categoryLabels: Record<string, string> = {
  AI: "AI & Machine Learning",
  Programming: "Programming & Software Engineering",
  DSA: "Data Structures & Algorithms",
  Systems: "Systems & Computer Fundamentals"
};

const groupedDocs = documentation.reduce((acc, doc) => {
  if (!acc[doc.category]) {
    acc[doc.category] = [];
  }
  acc[doc.category].push(doc);
  return acc;
}, {} as Record<string, DocumentationEntry[]>);

const categoryOrder = ["AI", "Programming", "DSA", "Systems"];

export const LearningsListSection: React.FC = () => {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(categoryOrder)
  );

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const getCompletionPercentage = (category: string) => {
    const docs = groupedDocs[category] || [];
    if (docs.length === 0) return 0;
    const completed = docs.filter(d => d.status === "completed").length;
    return Math.round((completed / docs.length) * 100);
  };

  return (
    <section className="surface learnings-list">
      <div className="learnings-tree">
        <div className="learnings-tree-root">
          <span className="learnings-tree-root-label">Documentation</span>
        </div>

        {categoryOrder.map((category) => {
          const docs = groupedDocs[category] || [];
          if (docs.length === 0) return null;

          const isExpanded = expandedCategories.has(category);
          const completionPercentage = getCompletionPercentage(category);

          return (
            <div key={category} className="learnings-tree-category">
              <button
                type="button"
                onClick={() => toggleCategory(category)}
                className="learnings-tree-category-toggle"
                aria-expanded={isExpanded}
                aria-label={`${isExpanded ? "Collapse" : "Expand"} ${categoryLabels[category]}`}
              >
                <span className="learnings-tree-toggle-icon">
                  {isExpanded ? "▼" : "▶"}
                </span>
                <span className="learnings-tree-category-title">
                  {categoryLabels[category]}
                </span>
                <span className="learnings-tree-category-progress">
                  {completionPercentage}%
                </span>
              </button>

              {isExpanded && (
                <div className="learnings-tree-entries">
                  {docs.map((doc) => (
                    <div key={doc.id} className="learnings-tree-entry">
                      <Link
                        to={doc.path}
                        className="learnings-tree-entry-link"
                      >
                        <span className="learnings-tree-entry-title">
                          {doc.title}
                        </span>
                        <span className={`learnings-tree-entry-status learnings-tree-entry-status--${doc.status}`}>
                          {doc.status === "completed" ? "Completed" : "In Progress"}
                        </span>
                      </Link>
                      <p className="learnings-tree-entry-description">
                        {doc.description}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};



