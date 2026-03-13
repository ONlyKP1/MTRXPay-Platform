import { Link } from 'react-router-dom';
import { AnimatedSection, StaggeredAnimation } from '../components/AnimatedSection';

const values = [
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    title: 'Compliance First',
    description:
      'Every transaction flows through our proprietary compliance engine. We don\'t cut corners — we build trust through rigorous regulatory adherence.',
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </svg>
    ),
    title: 'Merchant Sovereignty',
    description:
      'Your funds, your control. We believe merchants deserve transparent settlement, fair terms, and the freedom to operate without arbitrary restrictions.',
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
    title: 'Specialist Expertise',
    description:
      'We don\'t serve everyone — we serve underserved industries exceptionally. Deep vertical knowledge means better risk models and better outcomes.',
  },
];

export function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="hp-about__hero">
        <div className="hp-about__hero-video-wrap">
          <video
            className="hp-about__hero-video"
            src="/about-hero.mp4"
            autoPlay
            muted
            loop
            playsInline
          />
          <div className="hp-about__hero-overlay" />
        </div>
        <AnimatedSection className="hp-about__hero-content" animation="fade-up">
          <span className="hp-section-label">About Us</span>
          <h1 className="hp-section-title">
            Built by merchants,&nbsp;<em>for merchants.</em>
          </h1>
          <p className="hp-section-subtitle">
            We started MTRX PAY because we lived the problem. Frozen funds, declined applications,
            and opaque compliance decisions — we experienced it all. So we built the platform
            we wished existed: transparent, compliant, and built specifically for the industries
            traditional processors won't touch.
          </p>
        </AnimatedSection>
      </section>

      {/* Values */}
      <section className="hp-about__values">
        <AnimatedSection animation="fade-up" style={{ textAlign: 'center', marginBottom: 56 }}>
          <span className="hp-section-label">Our Values</span>
          <h2 className="hp-section-title">
            What <em>drives us</em>
          </h2>
        </AnimatedSection>
        <StaggeredAnimation className="hp-about__values-grid" staggerDelay={0.15}>
          {values.map((v) => (
            <div className="hp-about__value-card" key={v.title}>
              <div className="hp-about__value-icon">{v.icon}</div>
              <h3>{v.title}</h3>
              <p>{v.description}</p>
            </div>
          ))}
        </StaggeredAnimation>
      </section>

      {/* Entities */}
      <section className="hp-about__entities">
        <AnimatedSection animation="fade-up" style={{ textAlign: 'center', marginBottom: 56 }}>
          <span className="hp-section-label">Our Entities</span>
          <h2 className="hp-section-title">
            Global <em>presence</em>
          </h2>
        </AnimatedSection>
        <div className="hp-about__entities-grid">
          <AnimatedSection className="hp-about__entity-card" animation="fade-up" delay={0}>
            <h3>United Kingdom</h3>
            <p className="hp-about__entity-name">MTRX PAY LIMITED</p>
            <p>Company No. 16913646</p>
            <p>71–75 Shelton Street, London WC2H 9JQ</p>
          </AnimatedSection>
          <AnimatedSection className="hp-about__entity-card" animation="fade-up" delay={0.15}>
            <h3>Dubai</h3>
            <p className="hp-about__entity-name">MIDAS TRANSACTION EXCHANGE FZCO</p>
            <p>License No. 75905</p>
            <p>IFZA Business Park, DDP, Dubai</p>
          </AnimatedSection>
        </div>
      </section>

      {/* CTA */}
      <section className="hp-about__cta">
        <AnimatedSection animation="fade-up" style={{ textAlign: 'center' }}>
          <h2 className="hp-section-title">
            Ready to <em>get started?</em>
          </h2>
          <p className="hp-section-subtitle" style={{ marginBottom: 32 }}>
            Join the merchants who chose a payment partner that actually understands their business.
          </p>
          <Link to="/register" className="hp-btn hp-btn--primary">
            Sign Up Now
          </Link>
        </AnimatedSection>
      </section>
    </>
  );
}
