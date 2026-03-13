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
            and opaque compliance decisions, we experienced it all. So we built the platform
            we wished existed: transparent, compliant, and built specifically for the industries
            traditional processors won't touch.
          </p>
        </AnimatedSection>
      </section>

      {/* Mission Quote */}
      <section className="hp-about__mission">
        <AnimatedSection animation="fade-up" style={{ textAlign: 'center' }}>
          <blockquote className="hp-about__quote">
            <span className="hp-about__quote-mark">&ldquo;</span>
            Powering the next economy with secure, intelligent payment infrastructure.
            <span className="hp-about__quote-mark">&rdquo;</span>
          </blockquote>
          <div className="hp-about__quote-attr">
            <span className="hp-about__quote-line" />
            <span>MTRX PAY COMPANY MISSION</span>
            <span className="hp-about__quote-line" />
          </div>
        </AnimatedSection>
      </section>

      {/* Founders */}
      <section className="hp-about__founders">
        <AnimatedSection animation="fade-up" style={{ textAlign: 'center', marginBottom: 64 }}>
          <span className="hp-section-label">From the Founders</span>
          <h2 className="hp-section-title">
            The team <em>behind MTRX</em>
          </h2>
        </AnimatedSection>

        {/* Peter */}
        <AnimatedSection className="hp-about__founder" animation="fade-up">
          <div className="hp-about__founder-header">
            <div className="hp-about__founder-avatar">PW</div>
            <div>
              <h3 className="hp-about__founder-name">Peter Watt</h3>
              <span className="hp-about__founder-role">Founder</span>
            </div>
          </div>
          <div className="hp-about__founder-body">
            <p>Over the years, I've built businesses in sectors that traditional banks and payment processors struggle to understand. I've seen accounts restricted without warning. Funds held during critical growth phases.</p>
            <p>It forces you to realise something quickly: <strong>if you don't control your infrastructure, you don't control your future.</strong></p>
            <p>When I began working in emerging digital markets, it became clear that the payment layer was the weakest point. The sectors moving fastest were being supported by rails built for yesterday's economy.</p>
            <p>So instead of looking for another workaround, I decided to build properly. I partnered with Keiran, a technical product specialist, and we began architecting our own backend from the ground up. Not a reseller model. Not a fragile overlay. But real infrastructure, designed with intelligent onboarding, structured risk controls, dynamic settlement logic, and long-term scalability built in from day one.</p>
            <p>Wayne believed in that vision early. His support and belief in the scale of what we were building helped shape MTRX's foundation.</p>
            <p>MTRX isn't a reaction. It's a deliberate move toward independence. Emerging markets aren't going away. They're expanding. And they require infrastructure that understands their velocity, complexity, and regulatory pressure, without collapsing under it.</p>
            <p className="hp-about__founder-closing">We're building MTRX because the next generation of commerce deserves stronger rails.<br /><strong>Built by operators. Engineered by specialists. Designed for scale.</strong></p>
          </div>
        </AnimatedSection>

        {/* Keiran */}
        <AnimatedSection className="hp-about__founder" animation="fade-up">
          <div className="hp-about__founder-header">
            <div className="hp-about__founder-avatar">KP</div>
            <div>
              <h3 className="hp-about__founder-name">Keiran Perkins</h3>
              <span className="hp-about__founder-role">Co-Founder</span>
            </div>
          </div>
          <div className="hp-about__founder-body">
            <p>I joined MTRX Pay because I saw the struggle up close. Peter's frustration with how high-risk merchants were sidelined sparked a fire in me. With a deep background in technology, I've spent years building solutions that bridge complexity and customer needs. This wasn't just another project, it was a mission.</p>
            <p>I've always believed that technology is at its best when it's invisible, working seamlessly behind the scenes so customers can thrive. That's exactly how we've shaped MTRX Pay. Every piece of the platform is engineered with both precision and empathy.</p>
            <p>Operationally, we stand alongside our merchants every step of the way. That means real people, real support, and 24/7 availability when it matters most. Payments don't sleep, and neither does responsibility, so our commitment goes beyond the platform itself.</p>
            <p>We combine human support with disciplined operational oversight to ensure our merchants always feel backed, protected, and understood.</p>
            <p className="hp-about__founder-closing">At the same time, we pledge to remain on the cutting edge of technology, continually innovating and evolving so our partners benefit from the most advanced, secure, and forward-thinking payment infrastructure available.</p>
          </div>
        </AnimatedSection>

        {/* Wayne */}
        <AnimatedSection className="hp-about__founder" animation="fade-up">
          <div className="hp-about__founder-header">
            <div className="hp-about__founder-avatar">WD</div>
            <div>
              <h3 className="hp-about__founder-name">Wayne Daniel</h3>
              <span className="hp-about__founder-role">Co-Founder</span>
            </div>
          </div>
          <div className="hp-about__founder-body">
            <p>I joined MTRX Pay because I believed in what Peter and Keiran were building from the beginning. I've spent years working in marketing and brand leadership, helping businesses communicate clearly, grow responsibly, and build trust in complex environments. When I saw the vision for MTRX, real infrastructure built properly, not another workaround, I knew it needed to be positioned with the same level of care and discipline as the technology behind it.</p>
            <p>My role is to ensure that how we present ourselves reflects who we are: measured, credible, and aligned with regulatory expectations. In markets where scrutiny is high and trust is everything, communication cannot be exaggerated or reactive, it must be accurate, responsible, and consistent.</p>
            <p>Working alongside Peter and Keiran, I focus on bringing cohesion to our message, ensuring that product, operations, and market presence move in step. Innovation is important, but so is restraint. Growth matters, but so does compliance.</p>
            <p className="hp-about__founder-closing"><strong>We're not here to create noise. We're here to build belief.</strong></p>
          </div>
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
