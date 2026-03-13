import { Link } from 'react-router-dom';
import { AnimatedSection } from '../AnimatedSection';

export function Offers() {
  return (
    <section className="offers-section" id="offers">
      <AnimatedSection className="offers-header" animation="fade-up">
        <h2>What MTRX Offers</h2>
        <div className="offers-underline"></div>
      </AnimatedSection>

      <div className="offers-grid">
        <AnimatedSection className="offer-card" animation="fade-up" delay={0}>
          <h3>Payment Orchestration</h3>
          <p>
            Dynamically route transactions across providers,
            currencies, and rails to maximize acceptance and
            uptime.
          </p>
          <div className="offer-visual">
            <div className="routing-diagram">
              <div className="routing-top">MTRX</div>
              <div className="routing-line"></div>
              <div className="routing-nodes">
                <span>Compliance</span>
                <span className="routing-dot"></span>
                <span>Rail type</span>
              </div>
              <div className="routing-bottom">
                <span>Bank</span>
                <span>Match</span>
                <span>Bank 2</span>
              </div>
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection className="offer-card" animation="fade-up" delay={0.15}>
          <h3>Risk-Aware by Design</h3>
          <p>
            Embedded KYB/KYC, transaction monitoring, and
            dispute tooling — aligned with your risk profile.
          </p>
          <div className="offer-visual">
            <div className="merchant-list">
              <div className="merchant-row">
                <span className="merchant-icon green"></span>
                <span>MerchantID</span>
                <span className="status-badge success">Active</span>
              </div>
              <div className="merchant-row">
                <span className="merchant-icon yellow"></span>
                <span>Acquirer 1</span>
                <span className="status-badge warning">SBA</span>
              </div>
              <div className="merchant-row">
                <span className="merchant-icon red"></span>
                <span>Bank 2</span>
                <span className="status-badge error">UVB</span>
              </div>
              <div className="merchant-dots">
                <span className="dot active"></span>
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </div>
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection className="offer-card" animation="fade-up" delay={0.3}>
          <h3>Global, Without Fragmentation</h3>
          <p>
            Multi-currency support, and intelligent routing across
            regions — without managing multiple integrations.
          </p>
          <div className="offer-visual">
            <div className="world-map">
              <svg viewBox="0 0 200 100" className="map-svg">
                <ellipse cx="100" cy="50" rx="90" ry="40" fill="none" stroke="var(--gold)" strokeWidth="0.5" opacity="0.3" />
                <ellipse cx="100" cy="50" rx="70" ry="30" fill="none" stroke="var(--gold)" strokeWidth="0.5" opacity="0.3" />
                <ellipse cx="100" cy="50" rx="50" ry="20" fill="none" stroke="var(--gold)" strokeWidth="0.5" opacity="0.3" />
                <circle cx="60" cy="40" r="3" fill="var(--gold)" opacity="0.6" />
                <circle cx="140" cy="35" r="3" fill="var(--gold)" opacity="0.6" />
                <circle cx="100" cy="60" r="3" fill="var(--gold)" opacity="0.6" />
                <circle cx="160" cy="55" r="4" fill="var(--gold)" />
                <text x="165" y="50" fontSize="6" fill="var(--gold)">UK</text>
              </svg>
            </div>
          </div>
        </AnimatedSection>
      </div>

      <AnimatedSection className="offers-cta" animation="fade-up" delay={0.4}>
        <Link to="/register" className="btn btn-primary btn-animated">
          View all Solutions
        </Link>
      </AnimatedSection>
    </section>
  );
}
