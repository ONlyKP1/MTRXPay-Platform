import { Link } from 'react-router-dom';
import { AnimatedSection } from '../AnimatedSection';

export function CTA() {
  return (
    <section className="cta-section" id="contact">
      <AnimatedSection animation="fade-up">
        <h2>Ready to Transform Your Payment Infrastructure?</h2>
      </AnimatedSection>
      <AnimatedSection animation="fade-up" delay={0.15}>
        <p>
          Join the merchants who trust MTRX for their complex payment needs.
          Start your onboarding today.
        </p>
      </AnimatedSection>
      <AnimatedSection animation="fade-up" delay={0.3}>
        <Link to="/register" className="btn btn-primary btn-animated">Begin Application</Link>
      </AnimatedSection>
    </section>
  );
}
