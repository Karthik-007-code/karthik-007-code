import { GitHubIcon, LinkedInIcon, InstagramIcon, ExternalLinkIcon } from './Icons';
import '../styles/about.css';

export default function About() {
  const socialLinks = [
    {
      name: 'GitHub',
      handle: 'Karthik-007-code',
      url: 'https://github.com/Karthik-007-code/',
      icon: GitHubIcon,
    },
    {
      name: 'LinkedIn',
      handle: 'karthik-ankipalli',
      url: 'https://www.linkedin.com/in/karthik-ankipalli-0790ba321',
      icon: LinkedInIcon,
    },
    {
      name: 'Instagram',
      handle: 'karthik_ankipalli',
      url: 'https://www.instagram.com/karthik_ankipalli/',
      icon: InstagramIcon,
    },
  ];

  return (
    <section id="about" className="about-section" aria-label="About Karthik">
      <div className="section-header">
        <div className="section-eyebrow">
          <span className="eyebrow-index">02</span>
          <span className="eyebrow-divider">//</span>
          <span className="eyebrow-label">PROFILE</span>
        </div>
        <h2 className="section-heading">About</h2>
      </div>

      <div className="about-editorial-card">
        <div className="about-grid">
          {/* Personal Info & Title */}
          <div className="about-info-pane">
            <span className="about-kicker">Professional Overview</span>
            <h3 className="about-name">Karthik</h3>
            <p className="about-title">AI Engineer</p>

            <div className="about-quote-box">
              <p className="about-intro">
                &ldquo;AI Engineer | Building real-world AI applications&rdquo;
              </p>
            </div>
          </div>

          {/* Connect & Social Profiles */}
          <div className="about-connect-pane">
            <span className="about-kicker">Connect &amp; Profiles</span>
            <p className="connect-subtext">
              Direct links to code repositories, professional networks, and social updates.
            </p>

            <ul className="social-links-list" aria-label="Social Profiles">
              {socialLinks.map((social) => {
                const IconComponent = social.icon;
                return (
                  <li key={social.name} className="social-link-item">
                    <a
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-link-card"
                      aria-label={`Visit Karthik's ${social.name} profile (opens in new tab)`}
                    >
                      <div className="social-icon-wrapper">
                        <IconComponent size={20} />
                      </div>
                      <div className="social-text-wrapper">
                        <span className="social-platform">{social.name}</span>
                        <span className="social-handle">{social.handle}</span>
                      </div>
                      <div className="social-arrow-icon" aria-hidden="true">
                        <ExternalLinkIcon size={16} />
                      </div>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

