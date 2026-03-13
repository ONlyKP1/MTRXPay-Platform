import { Link } from 'react-router-dom';
import { AnimatedSection } from '../AnimatedSection';

export function Footer() {
  return (
    <footer className="hp-footer">
      {/* Final CTA */}
      <div className="hp-cta">
        <div className="hp-cta__glow" />
        <AnimatedSection className="hp-cta__inner" animation="fade-up">
          <span className="hp-section-label">Get Started</span>
          <h2>Ready to accept payments<br /><em>without limits?</em></h2>
          <p>Create your account in minutes. No lengthy applications, no category restrictions — just compliant payment infrastructure built for your business.</p>
          <div className="hp-cta__actions">
            <Link to="/register" className="hp-btn hp-btn--primary">
              Sign Up Now
            </Link>
            <Link to="/register" className="hp-btn hp-btn--outline">
              Contact Sales
            </Link>
          </div>
        </AnimatedSection>
      </div>

      {/* Footer */}
      <div className="hp-footer__inner">
        <div className="hp-footer__grid">
          {/* Brand Column */}
          <div className="hp-footer__brand">
            <img src="/logo.png" alt="MTRX PAY" className="hp-footer__logo" />
            <p className="hp-footer__tagline">
              Compliant payment orchestration for specialist verticals. Built for merchants who need more than a standard processor.
            </p>
            <div className="hp-footer__social">
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
              <a href="https://x.com" target="_blank" rel="noopener noreferrer" aria-label="X">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
            </div>
          </div>

          {/* Product Column */}
          <div className="hp-footer__col">
            <h4 className="hp-footer__col-title">Product</h4>
            <nav className="hp-footer__col-links">
              <a href="/#verticals">Supported Verticals</a>
              <a href="/#pricing">Pricing</a>
              <Link to="/register">Merchant Onboarding</Link>
              <Link to="/register">API Documentation</Link>
            </nav>
          </div>

          {/* Company Column */}
          <div className="hp-footer__col">
            <h4 className="hp-footer__col-title">Company</h4>
            <nav className="hp-footer__col-links">
              <Link to="/register">About Us</Link>
              <Link to="/register">Careers</Link>
              <Link to="/register">Contact</Link>
              <Link to="/register">Partner Programme</Link>
            </nav>
          </div>

          {/* Legal Column */}
          <div className="hp-footer__col">
            <h4 className="hp-footer__col-title">Legal</h4>
            <nav className="hp-footer__col-links">
              <Link to="/register">Privacy Policy</Link>
              <Link to="/register">Terms of Service</Link>
              <Link to="/register">Cookie Policy</Link>
              <Link to="/register">AML Policy</Link>
            </nav>
          </div>
        </div>

        <div className="hp-footer__divider" />

        <div className="hp-footer__bottom">
          <span>&copy; {new Date().getFullYear()} MTRX PAY LIMITED · England &amp; Wales · Co. No. 16913646 · 71–75 Shelton Street, London WC2H 9JQ</span>
          <span>MIDAS TRANSACTION EXCHANGE FZCO · License No. 75905 · IFZA Business Park, DDP, Dubai</span>
        </div>
      </div>
    </footer>
  );
}
