import { ArrowDownIcon } from './Icons';
import '../styles/footer.css';

export default function Footer() {
  const scrollToTop = (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    window.history.pushState(null, '', '#');
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer-container" aria-label="Page Footer">
      <div className="footer-content">
        <div className="footer-left">
          <span className="footer-brand">Karthik<span className="brand-dot">.</span></span>
          <span className="footer-tagline">AI Engineer | Building real-world AI applications</span>
        </div>

        <div className="footer-right">
          <button
            type="button"
            onClick={scrollToTop}
            className="back-to-top-btn"
            aria-label="Scroll back to top of page"
          >
            <span>Back to top</span>
            <span className="top-arrow-icon">
              <ArrowDownIcon size={14} />
            </span>
          </button>
        </div>
      </div>

      <div className="footer-bottom">
        <p className="copyright-text">
          &copy; {currentYear} Karthik. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

