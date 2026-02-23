import React from "react";
import "./ResumeBodySection.css";

export const ResumeBodySection: React.FC = () => {
  return (
    <section className="surface resume-body">
      <div className="resume-columns">
        <div className="resume-column">
          <h3 className="resume-section-title">Education</h3>
          <ul className="resume-list">
            <li>
              <div className="resume-list-title">Bachelor of Computer Applications (BCA - AI)</div>
              <div className="resume-list-text">
                CodeQuotient School of Technology (First Batch)
                <br/>
                Strong foundation in computer science fundamentals, data structures, algorithms, OOP, and systems thinking.
              </div>
            </li>
          </ul>

          <h3 className="resume-section-title">Experience</h3>
          <ul className="resume-list">
            <li>
              <div className="resume-list-title">Software Development</div>
              <div className="resume-list-text">
                Building real-world applications and components. Experience with structured frontend systems, maintainable code, and performance-conscious design.
              </div>
            </li>
            <li>
              <div className="resume-list-title">Personal Digital Platform</div>
              <div className="resume-list-text">
                Self-hosted software platform combining portfolio, source-code hosting, and technical knowledge mapping. Built with focus on architecture, usability, and long-term maintainability.
              </div>
            </li>
          </ul>

          <h3 className="resume-section-title">Projects</h3>
          <ul className="resume-list">
            <li>
              <div className="resume-list-title">Personal Digital Platform (This Website)</div>
              <div className="resume-list-text">
                A complete self-hosted platform representing engineering work, source code, and continuous learning. Demonstrates full-stack thinking and commitment to clean architecture.
              </div>
            </li>
            <li>
              <div className="resume-list-title">DSA & Systems Programming</div>
              <div className="resume-list-text">
                C/C++ implementations of data structures and algorithms. Focus on understanding complexity, trade-offs, and practical problem-solving.
              </div>
            </li>
            <li>
              <div className="resume-list-title">Frontend Components</div>
              <div className="resume-list-text">
                React-based UI systems with emphasis on clarity, reusability, and maintainability. Building interfaces that scale and remain readable over time.
              </div>
            </li>
          </ul>
        </div>

        <div className="resume-column">
          <h3 className="resume-section-title">Technical Skills</h3>
          <ul className="resume-list">
            <li>
              <div className="resume-list-title">Programming Languages</div>
              <div className="resume-list-text">C, C++, JavaScript, Python</div>
            </li>
            <li>
              <div className="resume-list-title">Web Development</div>
              <div className="resume-list-text">HTML, CSS, React, Node.js APIs</div>
            </li>
            <li>
              <div className="resume-list-title">Computer Science</div>
              <div className="resume-list-text">
                Data Structures & Algorithms, OOP, Operating Systems, DBMS, Performance Analysis
              </div>
            </li>
            <li>
              <div className="resume-list-title">Systems Thinking</div>
              <div className="resume-list-text">
                Runtime behavior, IO operations, architectural boundaries, observability, reliability patterns
              </div>
            </li>
          </ul>

          <h3 className="resume-section-title">Core Competencies</h3>
          <ul className="resume-list">
            <li>
              <div className="resume-list-title">Problem Solving</div>
              <div className="resume-list-text">
                Breaking down complex systems, identifying trade-offs, choosing right data structures and algorithms
              </div>
            </li>
            <li>
              <div className="resume-list-title">Code Quality</div>
              <div className="resume-list-text">
                Writing maintainable, readable code with clear structure and long-term scalability in mind
              </div>
            </li>
            <li>
              <div className="resume-list-title">System Design</div>
              <div className="resume-list-text">
                Thinking in terms of boundaries, latency, observability, and operational concerns from the start
              </div>
            </li>
            <li>
              <div className="resume-list-title">Continuous Learning</div>
              <div className="resume-list-text">
                Actively deepening understanding of low-level concepts, performance optimization, and engineering practices
              </div>
            </li>
          </ul>

          <h3 className="resume-section-title">Career Focus</h3>
          <ul className="resume-list">
            <li>
              <div className="resume-list-title">Goal</div>
              <div className="resume-list-text">
                Build reliable, maintainable software that solves real problems. Work on systems that demonstrate systems thinking and performance awareness.
              </div>
            </li>
            <li>
              <div className="resume-list-title">Learning Path</div>
              <div className="resume-list-text">
                Strengthening problem-solving abilities, exploring runtime behavior and compilers, building production-oriented software.
              </div>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};



