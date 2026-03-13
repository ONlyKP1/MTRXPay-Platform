import { AnimatedSection, StaggeredAnimation } from '../AnimatedSection';

const modules = [
  {
    label: 'Onboarding',
    title: 'KYB / KYC / AML / PEP',
    copy: 'Full compliance in one automated flow. Business verification, identity checks, sanctions screening, and PEP detection, all gated before a single transaction is processed.',
    points: ['Automated director and UBO verification', 'Liveness checks and document scanning', 'Continuous AML transaction monitoring', 'Global PEP and sanctions screening'],
  },
  {
    label: 'Routing',
    title: 'Multi-Rail Routing Engine',
    copy: 'Intelligent routing logic selects the optimal processor for every transaction, maximising acceptance rates and minimising processing cost automatically. No switching, no downtime, no re-integration.',
    points: ['Cost optimisation per transaction', 'Automatic retry logic on decline', 'Real-time processor health monitoring', 'Smart failover across redundant rails'],
  },
  {
    label: 'Risk',
    title: 'Real Time Risk Scoring',
    copy: 'Every transaction is scored in real time by our in-house risk engine. Scores surface directly to customers at the point of purchase, turning risk transparency into a measurable conversion advantage.',
    points: ['Sub-100ms scoring on every payment', 'Merchant-specific risk calibration', 'Customer-facing trust signal display', 'Continuous model improvement from live data'],
  },
  {
    label: 'Disputes',
    title: 'Dynamic Dispute Logic',
    copy: 'Evidence collection, configurable response rules, and real-time dashboards. Systematic protection of your dispute win rate at every stage, from first notification to final resolution.',
    points: ['Automated evidence packaging from live data', 'Configurable win rules by industry and ticket size', 'Deadline tracking with zero manual input', 'Win rate analytics and trend alerts'],
  },
  {
    label: 'Settlement',
    title: 'Payout Orchestration',
    copy: 'Flexible settlement to bank accounts, crypto wallets, or stablecoin addresses. Every payout is configurable, automated, and fully auditable with payout rules by merchant tier, geography, and volume.',
    points: ['Bank, crypto, and stablecoin settlement', 'Configurable sweep and reserve logic', 'Payout rules by tier and geography', 'Real-time payout status and audit trail'],
  },
  {
    label: 'Wallet',
    title: 'Secured Merchant Wallet Layer',
    copy: 'Dedicated merchant wallets, secured and insured. Real-time balance visibility, automated sweep logic, and configurable reserve management across all settlement currencies.',
    points: ['Multi-asset balance monitoring in real time', 'Multi-currency conversion at settlement', 'Automated settlement triggers', 'Dedicated merchant wallets, secured and insured'],
  },
];

export function PlatformFeatures() {
  return (
    <section className="hp-platform" id="platform">
      <AnimatedSection className="hp-platform__header" animation="fade-up">
        <span className="hp-section-label">Platform Capabilities</span>
        <h2 className="hp-section-title">One Platform, Complete<br />Payment Infrastructure</h2>
        <p className="hp-section-subtitle">
          Six integrated modules. One API. Complete visibility from onboarding through settlement for every merchant we serve.
        </p>
      </AnimatedSection>

      <StaggeredAnimation className="hp-platform__grid" staggerDelay={0.08} animation="fade-up">
        {modules.map((mod, i) => (
          <div key={i} className="hp-module">
            <span className="hp-module__label">{mod.label}</span>
            <h3 className="hp-module__title">{mod.title}</h3>
            <p className="hp-module__copy">{mod.copy}</p>
            <div className="hp-module__divider" />
            <ul className="hp-module__points">
              {mod.points.map((pt, j) => (
                <li key={j}>
                  <span className="hp-module__dot" />
                  {pt}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </StaggeredAnimation>
    </section>
  );
}
