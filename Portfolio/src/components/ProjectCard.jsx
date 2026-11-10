import { useState } from 'react';
import { GitHubIcon, ExternalLinkIcon, CodeBracketIcon } from './Icons';
import '../styles/projects.css';

export default function ProjectCard({ project, index, variant = 'standard' }) {
  const [imageFailed, setImageFailed] = useState(false);
  const hasImage = Boolean(project.image) && !imageFailed;

  const formattedIndex = String(index + 1).padStart(2, '0');

  return (
    <article className={`project-card card-${variant}`}>
      {/* Card Visual / Thumbnail */}
      <div className="card-visual-wrapper">
        <div className="card-visual-inner">
          {hasImage ? (
            <img
              src={project.image}
              alt={`${project.title} preview`}
              className="project-thumbnail"
              loading="lazy"
              onError={() => setImageFailed(true)}
            />
          ) : (
            <div className="project-placeholder-preview" aria-hidden="true">
              <div className="placeholder-grid-pattern" />
              <div className="placeholder-glow" />
              <div className="placeholder-content">
                <div className="placeholder-icon-wrap">
                  <CodeBracketIcon size={28} />
                </div>
                <span className="placeholder-tag">PROJECT // {formattedIndex}</span>
                <span className="placeholder-title-hint">{project.title}</span>
              </div>
            </div>
          )}

          {/* Editorial overlay vignette */}
          <div className="card-visual-gradient" />

          {/* Index counter badge */}
          <div className="card-index-badge">
            <span>{formattedIndex}</span>
          </div>
        </div>
      </div>

      {/* Card Content & Metadata */}
      <div className="card-content">
        <div className="card-header">
          <div className="card-meta-top">
            <span className="card-category">Featured AI Work</span>
          </div>
          <h3 className="project-title">{project.title}</h3>
        </div>

        <p className="project-description">{project.description}</p>

        {/* Tech Stack Badges */}
        {Array.isArray(project.techStack) && project.techStack.length > 0 && (
          <ul className="tech-stack-list" aria-label="Technologies used">
            {project.techStack.map((tech) => (
              <li key={tech} className="tech-badge">
                {tech}
              </li>
            ))}
          </ul>
        )}

        {/* Action Links */}
        <div className="card-actions">
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="project-btn btn-secondary"
              aria-label={`View ${project.title} source code on GitHub`}
            >
              <GitHubIcon size={16} />
              <span>Source Code</span>
            </a>
          )}

          {project.liveDemo && (
            <a
              href={project.liveDemo}
              target="_blank"
              rel="noopener noreferrer"
              className="project-btn btn-primary"
              aria-label={`Open live demonstration for ${project.title}`}
            >
              <span>Live Demo</span>
              <ExternalLinkIcon size={15} />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

