import React, { useState } from "react";
import "./TechShowcaseSection.css";

type KnowledgeCategory = "languages" | "engineering" | "cs" | "learning";

interface KnowledgeItem {
  id: string;
  name: string;
  category: KnowledgeCategory;
  depth: "working" | "intermediate" | "foundational" | "learning";
  shortSummary: string;
  howIUseIt: string;
  representativeWork: string;
  tags: string[];
}

const items: KnowledgeItem[] = [
  {
    id: "ts",
    name: "TypeScript",
    category: "languages",
    depth: "working",
    shortSummary: "Typed JavaScript as my default for reliable client and server code.",
    howIUseIt:
      "Designs domain models, enforces contracts at boundaries, and catches integration issues early across React frontends and Node/Edge runtimes.",
    representativeWork: "SPA architectures, design systems, strongly typed API layers.",
    tags: ["static typing", "domain modeling", "tooling"]
  },
  {
    id: "react",
    name: "React",
    category: "engineering",
    depth: "working",
    shortSummary: "Primary way of building interactive interfaces and stateful flows.",
    howIUseIt:
      "Builds component systems, data flows, and UX patterns that remain maintainable as products grow.",
    representativeWork: "Design systems, dashboards, data-heavy UIs.",
    tags: ["components", "state", "architecture"]
  },
  {
    id: "node",
    name: "Node.js",
    category: "engineering",
    depth: "intermediate",
    shortSummary: "JavaScript on the server for APIs, jobs, and tooling.",
    howIUseIt:
      "Implements HTTP APIs, CLI tools, and services that coordinate data between systems.",
    representativeWork: "API gateways, workers, internal tooling.",
    tags: ["apis", "cli", "services"]
  },
  {
    id: "algorithms",
    name: "Algorithms & Data Structures",
    category: "cs",
    depth: "foundational",
    shortSummary: "Understands trade-offs and applies the right structure for each problem.",
    howIUseIt:
      "Chooses representations that make operations cheap, and reasons about time/space at feature boundaries.",
    representativeWork: "Scheduling logic, search flows, data pipelines.",
    tags: ["complexity", "trade-offs", "reasoning"]
  },
  {
    id: "systems",
    name: "Systems & Runtime Behavior",
    category: "cs",
    depth: "intermediate",
    shortSummary:
      "Thinks in terms of processes, IO, and the cost of crossing boundaries (network, disk, CPU).",
    howIUseIt:
      "Designs APIs and flows that minimize unnecessary work and keep systems observable and operable.",
    representativeWork: "Service boundaries, logging & metrics, failure handling.",
    tags: ["observability", "latency", "resilience"]
  },
  {
    id: "lowlevel",
    name: "Lower-level & Performance",
    category: "learning",
    depth: "learning",
    shortSummary: "Going deeper into compilers, memory, and runtime behavior.",
    howIUseIt:
      "Translates low-level understanding into better high-level architectural decisions.",
    representativeWork: "Practice projects, reading internals, profiling experiments.",
    tags: ["profiling", "internals", "mental models"]
  }
];

const categoryLabels: Record<KnowledgeCategory, string> = {
  languages: "Languages & runtimes",
  engineering: "Engineering practice",
  cs: "Core CS concepts",
  learning: "Currently learning"
};

const depthLabel: Record<KnowledgeItem["depth"], string> = {
  working: "Used in production regularly",
  intermediate: "Confident for most day‑to‑day work",
  foundational: "Strong conceptual understanding",
  learning: "Deliberately deepening right now"
};

export const TechShowcaseSection: React.FC = () => {
  const [activeId, setActiveId] = useState<string>("ts");

  const activeItem = items.find((i) => i.id === activeId) ?? items[0];

  return (
    <section className="surface tech-showcase-section">
      <div className="section-header">
        <h2 className="section-title">Technical knowledge map</h2>
        <p className="section-caption">
          A snapshot of how I think about languages, engineering practice, and core CS ideas.
        </p>
      </div>

      <div className="tech-showcase-layout">
        <div className="tech-grid" role="list">
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveId(item.id)}
              onMouseEnter={() => setActiveId(item.id)}
              className={[
                "tech-tile",
                item.id === activeId ? "tech-tile--active" : "",
                `tech-tile--${item.category}`
              ]
                .filter(Boolean)
                .join(" ")}
              aria-pressed={item.id === activeId}
              role="listitem"
            >
              <div className="tech-tile-header">
                <span className="tech-tile-name">{item.name}</span>
                <span className="tech-tile-depth">{depthLabel[item.depth]}</span>
              </div>
              <p className="tech-tile-summary">{item.shortSummary}</p>
              <div className="tech-tile-tags">
                <span className="tag tag--accent">{categoryLabels[item.category]}</span>
                {item.tags.map((tag) => (
                  <span key={tag} className="tag">
                    {tag}
                  </span>
                ))}
              </div>
            </button>
          ))}
        </div>
        <aside className="tech-detail code-surface" aria-live="polite">
          <div className="tech-detail-header">
            <div>
              <div className="tech-detail-label">How I actually use this</div>
              <div className="tech-detail-name">{activeItem.name}</div>
            </div>
            <span className="tech-detail-chip">Perspective</span>
          </div>
          <div className="tech-detail-body">
            <p className="tech-detail-text">{activeItem.howIUseIt}</p>
            <div className="tech-detail-meta">
              <div>
                <div className="tech-detail-meta-label">Representative work</div>
                <div className="tech-detail-meta-value">{activeItem.representativeWork}</div>
              </div>
              <div>
                <div className="tech-detail-meta-label">Depth today</div>
                <div className="tech-detail-meta-value">{depthLabel[activeItem.depth]}</div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
};



