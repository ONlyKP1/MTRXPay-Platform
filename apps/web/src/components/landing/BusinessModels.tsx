import { useState, useEffect } from 'react';
import { AnimatedSection } from '../AnimatedSection';

const verticals = [
  { tag: 'Digital Finance', title: 'Digital Asset Platforms', body: 'Crypto exchanges, Web3 applications, NFT marketplaces, and DeFi services operating at the intersection of technology and finance.', color: [59, 130, 246] },
  { tag: 'Financial Markets', title: 'FX & Trading Platforms', body: 'Forex brokers, prop trading firms, and investment platforms requiring high-volume, cross-border payment infrastructure.', color: [16, 185, 129] },
  { tag: 'Wellness', title: 'Botanical & Wellness Brands', body: 'Plant-based wellness, hemp, and functional health brands navigating a complex but rapidly legitimising regulatory landscape.', color: [52, 211, 153] },
  { tag: 'Health Sciences', title: 'Nutritional Sciences', body: 'Supplement, nutraceutical, and functional health brands with high repeat purchase volumes and global distribution.', color: [168, 85, 247] },
  { tag: 'Entertainment', title: 'Gaming & Entertainment', body: 'Online gaming operators, skill-based entertainment platforms, and interactive media businesses with international player bases.', color: [239, 68, 68] },
  { tag: 'Content', title: 'Premium Content Platforms', body: 'Subscription content platforms and creator-led businesses with recurring billing models and global audiences.', color: [244, 114, 182] },
  { tag: 'Travel', title: 'Travel & Hospitality', body: 'OTAs, tour operators, and travel services with high average order values, complex refund cycles, and multi-currency exposure.', color: [6, 182, 212] },
  { tag: 'Commerce', title: 'Subscription Commerce', body: 'SaaS, membership, and subscription businesses requiring reliable recurring billing across multiple currencies and jurisdictions.', color: [99, 102, 241] },
  { tag: 'Lifestyle', title: 'Companion & Social Platforms', body: 'Relationship-economy platforms and social connection services operating in the personal companionship and lifestyle space.', color: [251, 146, 60] },
  { tag: 'Education', title: 'Course Sellers & EdTech', body: 'Online educators, digital course creators, and learning platforms monetising through one-time purchases, cohorts, or subscriptions.', color: [234, 179, 8] },
  { tag: 'Creator Economy', title: 'Independent Content Creators', body: 'Influencers, digital publishers, and independent creators monetising through memberships, tips, and exclusive digital products.', color: [20, 184, 166] },
];

export function BusinessModels() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const total = verticals.length;

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % total);
    }, 4000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, total]);

  const goTo = (i: number) => {
    setActiveIndex(i);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goNext = () => goTo((activeIndex + 1) % total);
  const goPrev = () => goTo((activeIndex - 1 + total) % total);

  return (
    <section className="hp-verticals" id="verticals">
      <AnimatedSection className="hp-verticals__header" animation="fade-up">
        <span className="hp-section-label">Who We Serve</span>
        <h2 className="hp-section-title">Built for the verticals traditional<br /><em>banking ignores.</em></h2>
        <p className="hp-section-subtitle">
          MTRX specialises in sectors where conventional processors decline, restrict, or exit without notice. We call them specialist verticals, and we've built our entire infrastructure around them.
        </p>
      </AnimatedSection>

      <div className="hp-vert-carousel"
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={() => setIsAutoPlaying(true)}
      >
        <button className="hp-carousel__arrow hp-carousel__arrow--prev" onClick={goPrev}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
        </button>

        <div className="hp-vert-carousel__cards">
          {verticals.map((v, i) => {
            const offset = i - activeIndex;
            const isActive = i === activeIndex;
            const [r, g, b] = v.color;
            return (
              <div
                key={i}
                className={`hp-vert-card ${isActive ? 'hp-vert-card--active' : ''}`}
                style={{
                  transform: `translateX(${offset * 100}%)`,
                  opacity: Math.abs(offset) > 1 ? 0 : 1,
                  zIndex: isActive ? 2 : 1,
                  borderTop: `3px solid rgb(${r}, ${g}, ${b})`,
                  boxShadow: isActive ? `0 -8px 30px rgba(${r}, ${g}, ${b}, 0.15)` : 'none',
                }}
                onClick={() => goTo(i)}
              >
                <span className="hp-vert-card__tag" style={{ color: `rgb(${r}, ${g}, ${b})` }}>{v.tag}</span>
                <h3 className="hp-vert-card__title">{v.title}</h3>
                <p className="hp-vert-card__body">{v.body}</p>
              </div>
            );
          })}
        </div>

        <button className="hp-carousel__arrow hp-carousel__arrow--next" onClick={goNext}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
      </div>

      <div className="hp-carousel__controls">
        <button className="hp-carousel__arrow" onClick={goPrev} aria-label="Previous">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <div className="hp-carousel__dots">
          {verticals.map((_, i) => (
            <button key={i} className={`hp-carousel__dot ${i === activeIndex ? 'hp-carousel__dot--active' : ''}`} onClick={() => goTo(i)} aria-label={`Go to slide ${i + 1}`} />
          ))}
        </div>
        <button className="hp-carousel__arrow" onClick={goNext} aria-label="Next">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
      </div>
    </section>
  );
}
