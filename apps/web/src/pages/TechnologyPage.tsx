import { AnimatedSection } from '../components/AnimatedSection';

const sections = [
  {
    label: 'Payment Orchestration',
    title: 'Multi-Rail Routing Engine',
    description:
      'Intelligent routing logic selects the optimal processor for every transaction, maximising acceptance rates and minimising processing cost automatically. No switching, no downtime, no re-integration.',
    bullets: [
      'Smart failover across redundant rails',
      'Cost optimisation per transaction',
      'Real-time processor health monitoring',
      'Automatic retry logic on decline',
    ],
  },
  {
    label: 'Risk Intelligence',
    title: 'Proprietary Risk Scoring',
    description:
      'Every transaction is scored in real time by our in-house risk engine. Scores surface directly to customers at the point of purchase, turning risk transparency into a measurable conversion advantage.',
    bullets: [
      'Sub-100ms scoring on every payment',
      'Merchant-specific risk calibration',
      'Customer-facing trust signal display',
      'Continuous model improvement from live data',
    ],
  },
  {
    label: 'Compliance Automation',
    title: 'KYB / KYC / AML / PEP',
    description:
      'Full compliance in one automated flow. Business verification, identity checks, sanctions screening, and PEP detection, all gated before a single transaction is processed.',
    bullets: [
      'Automated director and UBO verification',
      'Liveness checks and document scanning',
      'Continuous AML transaction monitoring',
      'Global PEP and sanctions screening',
    ],
  },
  {
    label: 'Wallet Infrastructure',
    title: 'Secured Merchant Wallet Layer',
    description:
      'We create dedicated, secured and insured wallets for every merchant we onboard. Each wallet supports multi-asset balances with real-time monitoring, configurable sweep rules, reserve thresholds, and automated settlement, all managed through a single API.',
    bullets: [
      'Dedicated merchant wallets, secured and insured',
      'Multi-asset balance monitoring in real time',
      'Configurable sweep and reserve logic',
      'Automated settlement triggers',
    ],
  },
  {
    label: 'Dispute Management',
    title: 'Dynamic Dispute Logic',
    description:
      'Evidence collection, configurable response rules, and real-time dashboards. Systematic protection of your dispute win rate at every stage, from first notification to final resolution.',
    bullets: [
      'Automated evidence packaging from live data',
      'Configurable win rules by industry and ticket size',
      'Deadline tracking with zero manual input',
      'Win rate analytics and trend alerts',
    ],
  },
  {
    label: 'Settlement',
    title: 'Payout Orchestration',
    description:
      'Flexible settlement to bank accounts, crypto wallets, or stablecoin addresses. Every payout is configurable, automated, and fully auditable with payout rules by merchant tier, geography, and volume.',
    bullets: [
      'Bank, crypto, and stablecoin settlement',
      'Payout rules by tier and geography',
      'Real-time payout status and audit trail',
      'Multi-currency conversion at settlement',
    ],
  },
];

const paymentTypes = [
  { icon: '₿', name: 'Cryptocurrency', desc: 'BTC, ETH and 50+ assets' },
  { icon: '$', name: 'Stablecoins', desc: 'USDC, USDT, EURC and more' },
  { icon: '◆', name: 'Tokenisation', desc: 'Real world asset settlement' },
  { icon: '▭', name: 'Card Rails', desc: 'Visa, Mastercard, UnionPay' },
  { icon: '⇄', name: 'Open Banking', desc: 'Direct account to account' },
  { icon: '△', name: 'SWIFT / SEPA', desc: 'Cross-border wire settlement' },
];

export function TechnologyPage() {
  return (
    <div className="hp-tech">
      {/* Hero header */}
      <section className="hp-tech__header">
        <div className="hp-tech__header-video-wrap">
          <video
            className="hp-tech__header-video"
            src="/tech-hero.mp4"
            autoPlay
            muted
            loop
            playsInline
          />
          <div className="hp-tech__header-overlay" />
        </div>
        <AnimatedSection animation="fade-up" style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <span className="hp-section-label">Technology</span>
          <h1 className="hp-section-title">
            Infrastructure built for <em>scale</em>
          </h1>
          <p className="hp-section-subtitle">
            Six core systems working together to process, protect, and settle every transaction.
          </p>
        </AnimatedSection>
      </section>

      {/* Feature sections */}
      {sections.map((section, i) => {
        const isReversed = i % 2 !== 0;
        return (
          <section
            key={section.label}
            className={`hp-tech__section ${isReversed ? 'hp-tech__section--reversed' : ''}`}
          >
            <AnimatedSection className="hp-tech__content" animation="fade-up">
              <span className="hp-section-label">{section.label}</span>
              <h2 className="hp-tech__title">{section.title}</h2>
              <p className="hp-tech__desc">{section.description}</p>
              <ul className="hp-tech__bullets">
                {section.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </AnimatedSection>
            <AnimatedSection
              className="hp-tech__card"
              animation="fade-up"
              delay={0.15}
            >
              <h3>{section.title}</h3>
              <div className="hp-tech__card-divider" />
              <ul>
                {section.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </AnimatedSection>
          </section>
        );
      })}

      {/* Divider */}
      <div className="hp-section-divider hp-section-divider--tight">
        <div className="hp-section-divider__line" />
        <div className="hp-section-divider__diamond" />
        <div className="hp-section-divider__line" />
      </div>

      {/* Payment types grid */}
      <section className="hp-tech__rails">
        <AnimatedSection animation="fade-up" style={{ textAlign: 'center', marginBottom: 56 }}>
          <h2 className="hp-tech__rails-title">
            Every payment type.<br />
            <em>One integration.</em>
          </h2>
          <p className="hp-tech__rails-subtitle">
            New rails are added centrally. Merchants never need to re-integrate.
          </p>
        </AnimatedSection>
        <AnimatedSection className="hp-tech__rails-grid" animation="fade-up" delay={0.15}>
          {paymentTypes.map((pt) => (
            <div className="hp-tech__rail-card" key={pt.name}>
              <span className="hp-tech__rail-icon">{pt.icon}</span>
              <h4>{pt.name}</h4>
              <p>{pt.desc}</p>
            </div>
          ))}
        </AnimatedSection>
      </section>
    </div>
  );
}
