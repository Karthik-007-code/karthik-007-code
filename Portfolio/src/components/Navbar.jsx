import { useState, useEffect } from 'react';
import { SparklesIcon } from './Icons';
import '../styles/navbar.css';

export default function Navbar({ activeView = 'portfolio', onNavigate }) {
  const [activeSection, setActiveSection] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);

      if (activeView === 'chat') {
        setActiveSection('chat');
        return;
      }

      const sections = ['about', 'projects'];
      const scrollPosition = window.scrollY + 200;

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            return;
          }
        }
      }

      if (window.scrollY < 300) {
        setActiveSection('');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeView]);

  const handleLinkClick = (e, targetId) => {
    e.preventDefault();
    setMobileMenuOpen(false);

    if (targetId === 'chat') {
      if (onNavigate) onNavigate('chat');
      window.history.pushState(null, '', '#ask-karthik');
      return;
    }

    // Navigating back to portfolio sections
    if (activeView === 'chat') {
      if (onNavigate) onNavigate('portfolio');
      // Delay scrolling until view renders
      setTimeout(() => {
        const target = document.getElementById(targetId);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        } else if (targetId === 'hero') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 50);
      window.history.pushState(null, '', targetId === 'hero' ? '#' : `#${targetId}`);
      return;
    }

    const target = document.getElementById(targetId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
      window.history.pushState(null, '', `#${targetId}`);
    } else if (targetId === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      window.history.pushState(null, '', '#');
    }
  };

  return (
    <header className={`navbar-header ${isScrolled ? 'is-scrolled' : ''}`}>
      <div className="navbar-container">
        <a
          href="#hero"
          onClick={(e) => handleLinkClick(e, 'hero')}
          className="navbar-brand"
          aria-label="Karthik - Home"
        >
          <span className="brand-name">Karthik</span>
          <span className="brand-dot">.</span>
        </a>

        {/* Desktop Navigation */}
        <nav className="navbar-nav desktop-nav" aria-label="Main Navigation">
          <ul className="nav-list">
            <li className="nav-item">
              <a
                href="#projects"
                onClick={(e) => handleLinkClick(e, 'projects')}
                className={`nav-link ${activeView === 'portfolio' && activeSection === 'projects' ? 'is-active' : ''}`}
              >
                Projects
                {activeView === 'portfolio' && activeSection === 'projects' && (
                  <span className="active-pill" />
                )}
              </a>
            </li>
            <li className="nav-item">
              <a
                href="#about"
                onClick={(e) => handleLinkClick(e, 'about')}
                className={`nav-link ${activeView === 'portfolio' && activeSection === 'about' ? 'is-active' : ''}`}
              >
                About
                {activeView === 'portfolio' && activeSection === 'about' && (
                  <span className="active-pill" />
                )}
              </a>
            </li>
            <li className="nav-item">
              <a
                href="#ask-karthik"
                onClick={(e) => handleLinkClick(e, 'chat')}
                className={`nav-link ${activeView === 'chat' ? 'is-active' : ''}`}
                style={{
                  color: activeView === 'chat' ? 'var(--text-primary)' : 'var(--accent-light)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                }}
              >
                <SparklesIcon size={14} />
                <span>Ask Karthik</span>
                {activeView === 'chat' && <span className="active-pill" />}
              </a>
            </li>
          </ul>
        </nav>

        {/* Mobile Hamburger Toggle */}
        <button
          type="button"
          className={`mobile-menu-toggle ${mobileMenuOpen ? 'is-open' : ''}`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={mobileMenuOpen}
        >
          <span className="menu-bar bar-1"></span>
          <span className="menu-bar bar-2"></span>
        </button>
      </div>

      {/* Mobile Drawer */}
      <div className={`mobile-drawer ${mobileMenuOpen ? 'is-open' : ''}`}>
        <nav className="mobile-nav" aria-label="Mobile Navigation">
          <ul className="mobile-nav-list">
            <li>
              <a
                href="#projects"
                onClick={(e) => handleLinkClick(e, 'projects')}
                className={`mobile-nav-link ${activeView === 'portfolio' && activeSection === 'projects' ? 'is-active' : ''}`}
              >
                Projects
              </a>
            </li>
            <li>
              <a
                href="#about"
                onClick={(e) => handleLinkClick(e, 'about')}
                className={`mobile-nav-link ${activeView === 'portfolio' && activeSection === 'about' ? 'is-active' : ''}`}
              >
                About
              </a>
            </li>
            <li>
              <a
                href="#ask-karthik"
                onClick={(e) => handleLinkClick(e, 'chat')}
                className={`mobile-nav-link ${activeView === 'chat' ? 'is-active' : ''}`}
                style={{
                  color: 'var(--accent-light)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                }}
              >
                <SparklesIcon size={16} />
                <span>Ask Karthik (AI)</span>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
