import { useState, useEffect } from 'react';
import '../styles/navbar.css';

export default function Navbar() {
  const [activeSection, setActiveSection] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);

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
  }, []);

  const handleLinkClick = (e, targetId) => {
    e.preventDefault();
    setMobileMenuOpen(false);
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
                className={`nav-link ${activeSection === 'projects' ? 'is-active' : ''}`}
              >
                Projects
                {activeSection === 'projects' && <span className="active-pill" />}
              </a>
            </li>
            <li className="nav-item">
              <a
                href="#about"
                onClick={(e) => handleLinkClick(e, 'about')}
                className={`nav-link ${activeSection === 'about' ? 'is-active' : ''}`}
              >
                About
                {activeSection === 'about' && <span className="active-pill" />}
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
                className={`mobile-nav-link ${activeSection === 'projects' ? 'is-active' : ''}`}
              >
                Projects
              </a>
            </li>
            <li>
              <a
                href="#about"
                onClick={(e) => handleLinkClick(e, 'about')}
                className={`mobile-nav-link ${activeSection === 'about' ? 'is-active' : ''}`}
              >
                About
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

