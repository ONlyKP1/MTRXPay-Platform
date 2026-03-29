import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// ============================================
// ANIMATED COUNTER HOOK
// ============================================
function useCountUp(end: number, duration: number = 2000, delay: number = 0) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    if (!hasStarted) return;

    const timeout = setTimeout(() => {
      let startTime: number;
      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        setCount(Math.floor(easeOut * end));
        if (progress < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    }, delay);
    return () => clearTimeout(timeout);
  }, [end, duration, delay, hasStarted]);

  return { count, setHasStarted };
}

// ============================================
// NAVIGATION
// ============================================
function WelcomeNav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`welcome-nav ${isScrolled ? 'scrolled' : ''}`}>
      <div className="welcome-nav-container">
        <Link to="/" className="welcome-nav-logo">
          <img src="/logo.png" alt="MTRXPAY" className="welcome-logo-img" />
        </Link>

        <div className="welcome-nav-links">
          <a href="#hero">Home</a>
          <a href="#solution">About MTRXPAY</a>
          <a href="#pricing">Pricing</a>
          <a href="#footer">Contact Us</a>
        </div>

        <Link to="/register" className="welcome-nav-cta">
          Join Founders Programme
        </Link>

        <button
          className={`welcome-burger ${mobileMenuOpen ? 'open' : ''}`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      <div className={`welcome-mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
        <a href="#hero" onClick={() => setMobileMenuOpen(false)}>Home</a>
        <a href="#solution" onClick={() => setMobileMenuOpen(false)}>About MTRXPAY</a>
        <a href="#pricing" onClick={() => setMobileMenuOpen(false)}>Pricing</a>
        <a href="#footer" onClick={() => setMobileMenuOpen(false)}>Contact Us</a>
        <Link to="/register" className="welcome-nav-cta" onClick={() => setMobileMenuOpen(false)}>
          Join Founders Programme
        </Link>
      </div>
    </nav>
  );
}

// ============================================
// HERO SECTION
// ============================================
function HeroSection() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="welcome-hero" id="hero">
      {/* Animated background */}
      <div className="hero-bg-animation">
        <div className="hero-gradient-orb orb-1"></div>
        <div className="hero-gradient-orb orb-2"></div>
        <div className="hero-gradient-orb orb-3"></div>
      </div>

      {/* Floating particles */}
      <div className="hero-particles">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="hero-particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${15 + Math.random() * 10}s`,
            }}
          />
        ))}
      </div>

      <div className={`welcome-hero-container ${isLoaded ? 'loaded' : ''}`}>
        <div className="welcome-hero-content">
          <span className="hero-eyebrow animate-fade-up">Payment Platform Built for Creators Banks Block</span>
          <h1 className="animate-fade-up delay-1">Get Paid Without Getting Blocked</h1>
          <p className="hero-subheadline animate-fade-up delay-2">
            Traditional payment processors reject creators without explanation.
            MTRXPAY was built specifically for the businesses banks don't understand —
            so you can focus on growing, not fighting for your funds.
          </p>

          <div className="hero-buttons animate-fade-up delay-3">
            <Link to="/register" className="btn-primary btn-glow">Join Founders Programme</Link>
            <a href="#pricing" className="btn-secondary">Calculate Your Savings</a>
          </div>

          <div className="hero-trust-icons animate-fade-up delay-4">
            <span><svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg> Rates from 1.5%</span>
            <span><svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg> No frozen accounts</span>
            <span><svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg> Paid within 72 hours</span>
          </div>
        </div>

        <div className="welcome-hero-image animate-fade-up delay-2">
          <div className="welcome-dashboard-showcase">
            {/* Glow rings */}
            <div className="dashboard-glow-ring ring-1"></div>
            <div className="dashboard-glow-ring ring-2"></div>

            {/* Main dashboard frame */}
            <div className="dashboard-frame">
              <img src="/dashboard-green.jpg" alt="MTRX Payment Dashboard" className="dashboard-img" />

              {/* Scan line effect */}
              <div className="dashboard-scan-line"></div>

              {/* Shimmer overlay */}
              <div className="dashboard-shimmer"></div>

              {/* Live indicator */}
              <div className="dashboard-live-badge">
                <span className="live-dot"></span>
                <span>LIVE</span>
              </div>

              {/* Floating notification cards */}
              <div className="dashboard-notification notif-1">
                <div className="notif-icon success">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <div className="notif-content">
                  <span className="notif-title">Payment Approved</span>
                  <span className="notif-provider">Stripe</span>
                </div>
                <span className="notif-amount">+£4,250</span>
              </div>

              <div className="dashboard-notification notif-2">
                <div className="notif-icon routing">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                </div>
                <div className="notif-content">
                  <span className="notif-title">Route Optimized</span>
                  <span className="notif-provider">Smart Routing</span>
                </div>
                <span className="notif-amount">→ Adyen</span>
              </div>

              <div className="dashboard-notification notif-3">
                <div className="notif-icon alert">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                  </svg>
                </div>
                <div className="notif-content">
                  <span className="notif-title">Fraud Blocked</span>
                  <span className="notif-provider">Risk Engine</span>
                </div>
                <span className="notif-amount">Protected</span>
              </div>
            </div>

            {/* Corner accents */}
            <div className="dashboard-corner top-left"></div>
            <div className="dashboard-corner top-right"></div>
            <div className="dashboard-corner bottom-left"></div>
            <div className="dashboard-corner bottom-right"></div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================
// 3D CAROUSEL SECTION
// ============================================
const businessTypes = [
  {
    image: '/hero-app.jpg',
    title: 'Creators &',
    subtitle: 'Digital Platforms',
  },
  {
    image: '/creators-1.png',
    title: 'Lifestyle Personal',
    subtitle: 'Services',
  },
  {
    image: '/creators-2.png',
    title: 'Digital Products',
    subtitle: '& Education',
  },
  {
    image: '/streamer.jpg',
    title: 'Platforms &',
    subtitle: 'Marketplaces',
  },
  {
    image: '/hero-app.jpg',
    title: 'Regulated',
    subtitle: 'Content',
  },
];

function CarouselSection() {
  const [activeIndex, setActiveIndex] = useState(2);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const totalCards = businessTypes.length;

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % totalCards);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, totalCards]);

  const goToSlide = (index: number) => {
    setActiveIndex(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goNext = () => {
    setActiveIndex((prev) => (prev + 1) % totalCards);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goPrev = () => {
    setActiveIndex((prev) => (prev - 1 + totalCards) % totalCards);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const getCardStyle = (index: number) => {
    const diff = index - activeIndex;
    const normalizedDiff = ((diff + totalCards + Math.floor(totalCards / 2)) % totalCards) - Math.floor(totalCards / 2);

    const baseTranslateX = normalizedDiff * 280;
    const baseTranslateZ = -Math.abs(normalizedDiff) * 150;
    const baseRotateY = normalizedDiff * -25;
    const baseScale = 1 - Math.abs(normalizedDiff) * 0.15;
    const baseOpacity = 1 - Math.abs(normalizedDiff) * 0.3;
    const baseZIndex = 10 - Math.abs(normalizedDiff);

    return {
      transform: `
        translateX(${baseTranslateX}px)
        translateZ(${baseTranslateZ}px)
        rotateY(${baseRotateY}deg)
        scale(${Math.max(baseScale, 0.7)})
      `,
      opacity: Math.max(baseOpacity, 0.4),
      zIndex: baseZIndex,
      filter: normalizedDiff !== 0 ? `brightness(${0.7 + (1 - Math.abs(normalizedDiff) * 0.15) * 0.3})` : 'none',
    };
  };

  return (
    <section className="welcome-carousel-section">
      <div className="welcome-carousel-header">
        <h2>Built for Complex Business Models</h2>
        <p>Serving creators and businesses that traditional processors won't support</p>
      </div>

      <div
        className="carousel-3d-container"
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={() => setIsAutoPlaying(true)}
      >
        <button className="carousel-3d-btn carousel-3d-prev" onClick={goPrev}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        <div className="carousel-3d-viewport">
          <div className="carousel-3d-track">
            {businessTypes.map((business, index) => (
              <div
                key={index}
                className={`carousel-3d-card ${index === activeIndex ? 'active' : ''}`}
                style={getCardStyle(index)}
                onClick={() => goToSlide(index)}
              >
                <div className="card-3d-inner">
                  <img src={business.image} alt={business.title} />
                  <div className="card-3d-shine"></div>
                  <div className="card-3d-content">
                    <span className="card-3d-title">{business.title}</span>
                    <span className="card-3d-subtitle">{business.subtitle}</span>
                  </div>
                  {index === activeIndex && <div className="card-3d-glow"></div>}
                </div>
                <div className="card-3d-reflection">
                  <img src={business.image} alt="" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <button className="carousel-3d-btn carousel-3d-next" onClick={goNext}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

      <div className="carousel-3d-dots">
        {businessTypes.map((_, index) => (
          <button
            key={index}
            className={`carousel-3d-dot ${index === activeIndex ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>
    </section>
  );
}

// ============================================
// SOCIAL PROOF STRIP
// ============================================
function SocialProofStrip() {
  const uptime = useCountUp(999, 2000, 500);
  const decisions = useCountUp(48, 1500, 800);
  const settlement = useCountUp(24, 1500, 1100);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          uptime.setHasStarted(true);
          decisions.setHasStarted(true);
          settlement.setHasStarted(true);
        }
      },
      { threshold: 0.5 }
    );

    const section = document.querySelector('.social-proof-strip');
    if (section) observer.observe(section);

    return () => observer.disconnect();
  }, []);

  const proofs = [
    {
      stat: `${(uptime.count / 10).toFixed(1)}%`,
      label: 'Uptime',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="3" width="20" height="14" rx="2"/>
          <path d="M8 21h8M12 17v4"/>
        </svg>
      ),
    },
    {
      stat: `${decisions.count}-Hour`,
      label: 'Decisions',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"/>
          <path d="M12 6v6l4 2"/>
        </svg>
      ),
    },
    {
      stat: `${settlement.count}-Hour`,
      label: 'Settlement',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
        </svg>
      ),
    },
  ];

  return (
    <section className="social-proof-strip">
      <div className="social-proof-boxes">
        {proofs.map((proof, index) => (
          <div key={index} className="proof-box" style={{ animationDelay: `${index * 0.1}s` }}>
            <div className="proof-icon">{proof.icon}</div>
            <div className="proof-content">
              <span className="proof-stat">{proof.stat}</span>
              <span className="proof-label">{proof.label}</span>
            </div>
          </div>
        ))}
      </div>
      <p className="social-proof-tagline">Launching 2026 — Founders Programme open</p>
    </section>
  );
}

// ============================================
// PROBLEM SECTION
// ============================================
function ProblemSection() {
  const problems = [
    'Your application gets rejected without explanation',
    'Funds get frozen for "review" that never ends',
    'You lose access to your money for weeks or months',
    'Support tickets go unanswered while bills pile up',
    'You switch processors only to face the same issues',
    'Traditional banks see your business model as "high risk"',
  ];

  return (
    <section className="problem-section" id="problem">
      <div className="problem-container">
        <h2>You Know This Story</h2>
        <ul className="problem-list">
          {problems.map((problem, index) => (
            <li key={index} style={{ animationDelay: `${index * 0.1}s` }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="x-icon">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
              {problem}
            </li>
          ))}
        </ul>
        <p className="problem-closing">
          Over <span className="highlight">£2.3 billion</span> in creator revenue is blocked or delayed
          every year by payment processors who don't understand your business.
        </p>
      </div>
    </section>
  );
}

// ============================================
// SOLUTION SECTION
// ============================================
function SolutionSection() {
  const solutions = [
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
      ),
      title: 'Human Underwriting',
      description: 'Real people review your application. We understand creator business models and approve accounts traditional banks reject.',
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="4" width="20" height="16" rx="2"/>
          <path d="M7 15h0M2 9h20"/>
        </svg>
      ),
      title: 'Reliable Payouts',
      description: 'Your money moves when you need it. No mysterious holds, no frozen accounts — just predictable 24-72 hour settlements.',
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
        </svg>
      ),
      title: 'Lower Rates',
      description: 'Rates starting at 1.5% + 15p. No hidden fees, no surprise charges. Early members lock in founding rates permanently.',
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="3"/>
          <circle cx="19" cy="5" r="2"/>
          <circle cx="5" cy="5" r="2"/>
          <circle cx="19" cy="19" r="2"/>
          <circle cx="5" cy="19" r="2"/>
          <path d="M12 9V5M12 19v-4M9 12H5M19 12h-4"/>
        </svg>
      ),
      title: 'Multi-Provider Routing',
      description: 'Intelligent routing across payment networks ensures maximum approval rates and minimal disruption to your revenue.',
    },
  ];

  return (
    <section className="solution-section" id="solution">
      {/* Background animation */}
      <div className="solution-bg-animation">
        <div className="solution-orb orb-1"></div>
        <div className="solution-orb orb-2"></div>
      </div>

      <div className="solution-container">
        <h2>Built Different. For a Reason.</h2>
        <div className="solution-grid">
          {solutions.map((solution, index) => (
            <div key={index} className="solution-card" style={{ animationDelay: `${index * 0.15}s` }}>
              <div className="solution-icon">{solution.icon}</div>
              <h3>{solution.title}</h3>
              <p>{solution.description}</p>
              <div className="solution-card-glow"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================
// FLIP CARDS SECTION
// ============================================
function FlipCardsSection() {
  const cards = [
    {
      image: '/card-1.jpg',
      title: 'Multi-Provider Routing',
      description: 'Intelligent payment routing across multiple providers ensures maximum approval rates and minimal disruption.',
    },
    {
      image: '/card-2.jpg',
      title: 'Embedded Compliance',
      description: 'KYC, AML, and regulatory compliance built into every transaction. Stay compliant without the complexity.',
    },
    {
      image: '/card-3.jpg',
      title: 'Risk Management',
      description: 'Advanced fraud detection and risk scoring protects your business while maximizing legitimate transactions.',
    },
    {
      image: '/card-4.jpg',
      title: 'Fast Settlement',
      description: '24-72 hour settlements mean your money moves when you need it. No mysterious holds or frozen funds.',
    },
    {
      image: '/card-5.jpg',
      title: 'Global Payments',
      description: 'Accept payments in multiple currencies from customers worldwide with competitive FX rates.',
    },
    {
      image: '/card-6.jpg',
      title: 'Real-Time Analytics',
      description: 'Monitor transactions, track revenue, and understand your business with comprehensive dashboards.',
    },
    {
      image: '/card-7.jpg',
      title: 'Dedicated Support',
      description: 'Real humans who understand your business. Get answers in hours, not days or weeks.',
    },
  ];

  return (
    <section className="flip-cards-section" id="features">
      <div className="flip-cards-container">
        <h2>How We're Different</h2>
        <p className="flip-cards-subtitle">Hover over each card to learn more</p>

        <div className="flip-cards-grid">
          {cards.map((card, index) => (
            <div key={index} className="flip-card" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="flip-card-inner">
                <div className="flip-card-front">
                  <img src={card.image} alt={card.title} />
                  <div className="flip-card-front-overlay">
                    <h3>{card.title}</h3>
                  </div>
                </div>
                <div className="flip-card-back">
                  <h3>{card.title}</h3>
                  <p>{card.description}</p>
                  <div className="flip-card-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                      <polyline points="22 4 12 14.01 9 11.01"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================
// WHO IT'S FOR
// ============================================
function WhoItsFor() {
  const audiences = [
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polygon points="23 7 16 12 23 17 23 7"/>
          <rect x="1" y="5" width="15" height="14" rx="2"/>
        </svg>
      ),
      title: 'Content Creators',
      description: 'YouTubers, streamers, influencers, and digital artists who monetize their audience through subscriptions, tips, and digital products.',
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
          <path d="M6 12v5c3 3 9 3 12 0v-5"/>
        </svg>
      ),
      title: 'Course Creators',
      description: 'Educators, coaches, and experts selling online courses, memberships, and digital knowledge products.',
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M23 6l-9.5 9.5-5-5L1 18"/>
          <path d="M17 6h6v6"/>
        </svg>
      ),
      title: 'Scaling Platforms',
      description: 'Marketplaces and platforms processing payments for creators who need reliable, compliant payment infrastructure.',
    },
  ];

  return (
    <section className="who-its-for" id="who">
      <div className="who-container">
        <h2>Built For You</h2>
        <div className="who-grid">
          {audiences.map((audience, index) => (
            <div key={index} className="who-card" style={{ animationDelay: `${index * 0.15}s` }}>
              <div className="who-icon">{audience.icon}</div>
              <h3>{audience.title}</h3>
              <p>{audience.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================
// TRUST/SECURITY
// ============================================
function TrustSecurity() {
  const trustItems = [
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="11" width="18" height="11" rx="2"/>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        </svg>
      ),
      title: 'Bank-Grade Security',
      description: 'PCI DSS Level 1 compliant. Your data encrypted at rest and in transit. SOC 2 Type II certified infrastructure.',
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          <path d="M9 12l2 2 4-4"/>
        </svg>
      ),
      title: 'FCA Registered',
      description: 'Operating under UK financial regulations. Fully licensed and authorised to handle your payments securely.',
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
        </svg>
      ),
      title: 'Always Available',
      description: '99.9% uptime SLA. Redundant systems across multiple regions. Your payments never stop processing.',
    },
  ];

  return (
    <section className="trust-security" id="trust">
      {/* Background animation */}
      <div className="trust-bg-animation">
        <div className="trust-orb orb-1"></div>
        <div className="trust-orb orb-2"></div>
      </div>

      <div className="trust-container">
        <h2>Security You Can Trust</h2>
        <div className="trust-grid">
          {trustItems.map((item, index) => (
            <div key={index} className="trust-item" style={{ animationDelay: `${index * 0.15}s` }}>
              <div className="trust-icon">{item.icon}</div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
        <p className="trust-compliance">
          <em>MTRXPAY operates in accordance with UK Money Laundering Regulations and maintains strict KYC/AML compliance protocols.</em>
        </p>
      </div>
    </section>
  );
}

// ============================================
// FINAL CTA
// ============================================
function FinalCTA() {
  return (
    <section className="final-cta">
      <div className="final-cta-bg">
        <div className="cta-particle p1"></div>
        <div className="cta-particle p2"></div>
        <div className="cta-particle p3"></div>
      </div>

      <div className="final-cta-container">
        <h1>Ready to Get Paid?</h1>
        <p>
          Stop losing revenue to payment processors who don't understand your business.
          <strong> Join the Founders Programme today</strong> and lock in rates that never increase.
        </p>
        <div className="final-cta-buttons">
          <Link to="/register" className="btn-gold btn-glow">Join Founders Programme</Link>
          <a href="mailto:founders@mtrxpay.io" className="btn-outline-white">Talk to Underwriting Team</a>
        </div>
        <p className="final-cta-note">Limited founding member spots. No commitment required to apply.</p>
      </div>
    </section>
  );
}

// ============================================
// FOOTER
// ============================================
function WelcomeFooter() {
  return (
    <footer className="welcome-footer" id="footer">
      <div className="footer-container">
        <div className="footer-column footer-brand">
          <img src="/logo.png" alt="MTRXPAY" className="footer-logo" />
          <p>Payment processing built for creators banks block.</p>
          <div className="footer-social">
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.953 4.57a10 10 0 0 1-2.825.775 4.958 4.958 0 0 0 2.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 0 0-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 0 0-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 0 1-2.228-.616v.06a4.923 4.923 0 0 0 3.946 4.827 4.996 4.996 0 0 1-2.212.085 4.936 4.936 0 0 0 4.604 3.417 9.867 9.867 0 0 1-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 0 0 7.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0 0 24 4.59z"/>
              </svg>
            </a>
          </div>
        </div>

        <div className="footer-column">
          <h4>Company</h4>
          <a href="#solution">About Us</a>
          <a href="#pricing">Pricing</a>
          <a href="mailto:hello@mtrxpay.io">Contact Us</a>
          <a href="mailto:support@mtrxpay.io">Support</a>
        </div>

        <div className="footer-column">
          <h4>Legal</h4>
          <a href="/terms">Terms of Service</a>
          <a href="/privacy">Privacy Policy</a>
          <a href="/cookies">Cookie Policy</a>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2026 MTRXPAY. A MIDAS Company. All rights reserved.</p>
      </div>
    </footer>
  );
}

// ============================================
// MAIN PAGE COMPONENT
// ============================================
export function MtrxWelcomePage() {
  return (
    <div className="mtrx-welcome-page">
      <WelcomeNav />
      <HeroSection />
      <CarouselSection />
      <SocialProofStrip />
      <ProblemSection />
      <SolutionSection />
      <FlipCardsSection />
      <WhoItsFor />
      <TrustSecurity />
      <FinalCTA />
      <WelcomeFooter />
    </div>
  );
}
