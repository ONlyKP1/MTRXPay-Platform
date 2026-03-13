import { useState } from 'react';
import { AnimatedSection } from '../AnimatedSection';

const painPoints = [
  {
    problem: 'Accounts terminated overnight',
    problemBody: 'Processors shut down merchants in specialist verticals without warning. Funds frozen, operations halted, no path to reinstatement.',
    solution: 'Dedicated rails. Contractual certainty.',
    solutionBody: 'MTRX operates isolated processing infrastructure per merchant. No shared risk pools. No guilt-by-association shutdowns.',
  },
  {
    problem: 'Cash locked in rolling reserves',
    problemBody: 'Up to 15% of monthly volume withheld for 90+ days as standard, regardless of actual performance, history, or dispute data.',
    solution: 'Performance based reserve logic.',
    solutionBody: 'Reserves calculated dynamically against your real chargeback and settlement data, not industry wide assumptions.',
  },
  {
    problem: 'Chargebacks left undefended',
    problemBody: 'Standard processors offer no dispute support. Evidence gathering, deadline tracking, and filing are left entirely to the merchant.',
    solution: 'Managed dispute resolution, automated and human led.',
    solutionBody: 'Evidence packaged from live transaction data and filed before every deadline. Where automation reaches its limits, our disputes team steps in directly.',
  },
  {
    problem: 'Declined on category alone',
    problemBody: 'Applications rejected based on business type before a single data point is reviewed. No appeal process. No explanation given.',
    solution: 'Underwriting on real merchant data.',
    solutionBody: 'MTRX assesses applications on actual performance, compliance posture, and processing history. Never industry stereotypes.',
  },
  {
    problem: 'Compliance that stalls onboarding',
    problemBody: 'Manual KYB/KYC processes, weeks of back and forth, and ongoing AML obligations that consume resources without adding value.',
    solution: 'End to end automated compliance.',
    solutionBody: 'KYB, KYC, AML monitoring, and PEP screening handled in a single automated flow. Onboarding in hours, not weeks.',
  },
  {
    problem: 'Customers who can\'t pay',
    problemBody: 'Narrow payment method support turns away international buyers, digital native customers, and anyone outside legacy banking rails.',
    solution: '50+ payment methods. Every customer.',
    solutionBody: 'Stablecoins, crypto, tokenised assets, open banking, card rails, and SWIFT/SEPA. All through one integration.',
  },
];

export function TrustBar() {
  const [activeSlide, setActiveSlide] = useState(0);

  const goNext = () => setActiveSlide((prev) => (prev + 1) % painPoints.length);
  const goPrev = () => setActiveSlide((prev) => (prev - 1 + painPoints.length) % painPoints.length);

  return (
    <section className="hp-pain">
      <div className="hp-pain__bg">
        <video src="/carousel-bg.mp4" autoPlay muted loop playsInline aria-hidden="true" className="hp-pain__video" />
        <div className="hp-pain__bg-overlay" />
      </div>

      <AnimatedSection className="hp-pain__header" animation="fade-up">
        <span className="hp-section-label">The Problem</span>
        <h2 className="hp-section-title">The problems we were<br /><em>built to solve.</em></h2>
        <p className="hp-pain__subtitle">
          Legacy payment infrastructure wasn't designed for every merchant. If you've been declined, terminated, or left without recourse, you already know the gap. MTRX closes it.
        </p>
      </AnimatedSection>

      <div className="hp-carousel">
        <div className="hp-carousel__wrap">
          {painPoints.map((pp, i) => (
            <div key={i} className={`hp-carousel__slide ${i === activeSlide ? 'hp-carousel__slide--active' : ''}`}>
              <div className="hp-carousel__content">
                <div className="hp-carousel__block">
                  <span className="hp-carousel__marker hp-carousel__marker--problem">THE PROBLEM</span>
                  <h3 className="hp-carousel__title hp-carousel__title--problem">{pp.problem}</h3>
                  <p className="hp-carousel__body hp-carousel__body--problem">{pp.problemBody}</p>
                </div>

                <div className="hp-carousel__sep" />

                <div className="hp-carousel__block">
                  <span className="hp-carousel__marker hp-carousel__marker--solution">MTRX ANSWER</span>
                  <h3 className="hp-carousel__title hp-carousel__title--solution">{pp.solution}</h3>
                  <p className="hp-carousel__body hp-carousel__body--solution">{pp.solutionBody}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="hp-carousel__controls">
          <button className="hp-carousel__arrow" onClick={goPrev} aria-label="Previous">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          </button>

          <div className="hp-carousel__dots">
            {painPoints.map((_, i) => (
              <button key={i} className={`hp-carousel__dot ${i === activeSlide ? 'hp-carousel__dot--active' : ''}`} onClick={() => setActiveSlide(i)} aria-label={`Go to slide ${i + 1}`} />
            ))}
          </div>

          <button className="hp-carousel__arrow" onClick={goNext} aria-label="Next">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>
      </div>
    </section>
  );
}
