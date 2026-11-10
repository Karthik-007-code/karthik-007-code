import { ArrowDownIcon } from './Icons';
import '../styles/hero.css';

export default function Hero() {
  const scrollToProjects = (e) => {
    e.preventDefault();
    const target = document.getElementById('projects');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
      window.history.pushState(null, '', '#projects');
    }
  };

  return (
    <section id="hero" className="hero-section" aria-label="Introduction">
      <div className="hero-content">
        <div className="hero-eyebrow">
          <span className="hero-badge-dot"></span>
          <span className="hero-badge-text">AI Systems &amp; Engineering</span>
        </div>

        <h1 className="hero-name">
          Karthik<span className="hero-period">.</span>
        </h1>

        <p className="hero-title-tagline">
          AI Engineer <span className="hero-divider">|</span> Building real-world AI applications
        </p>

        <div className="hero-cta-wrapper">
          <a
            href="#projects"
            onClick={scrollToProjects}
            className="hero-cta-button"
            aria-label="Scroll to featured projects"
          >
            <span className="cta-label">Explore Selected Work</span>
            <span className="cta-icon-box">
              <ArrowDownIcon size={16} />
            </span>
          </a>
        </div>
      </div>

      <div className="hero-scroll-indicator" aria-hidden="true">
        <span className="scroll-track">
          <span className="scroll-thumb"></span>
        </span>
        <span className="scroll-text">SCROLL</span>
      </div>
    </section>
  );
}

