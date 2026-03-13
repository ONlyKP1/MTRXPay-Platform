import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

const CRYPTOS = new Set(['BTC', 'ETH', 'USDC', 'USDT', 'SOL', 'XRP']);

const transactions = [
  { route: ['GBP', 'USDC', 'GBP'], risk: 94, amount: '£12,400.00', status: 'Settled', time: '2s ago' },
  { route: ['USD', 'ETH', 'USD'], risk: 87, amount: '$8,200.00', status: 'Approved', time: '5s ago' },
  { route: ['EUR', 'USDT', 'EUR'], risk: 91, amount: '€45,000.00', status: 'Settled', time: '9s ago' },
  { route: ['GBP', 'BTC', 'GBP'], risk: 79, amount: '£2,100.00', status: 'Approved', time: '14s ago' },
  { route: ['BTC', '', 'GBP'], risk: 88, amount: '£31,750.00', status: 'Settled', time: '21s ago' },
];

export function Hero() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="hp-hero">
      {/* Video background */}
      <div className="hp-hero__video-wrap">
        <video
          src="/hero-bg.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="hp-hero__video"
        />
        <div className="hp-hero__overlay" />
        <div className="hp-hero__grid" />
        <div className="hp-hero__radial" />
      </div>

      <div className="hp-hero__inner">
        <div className={`hp-hero__content ${isLoaded ? 'hp-hero__content--visible' : ''}`}>
          <h1 className="hp-hero__title">
            Accept Payments.<br />
            Eliminate Chargebacks.<br />
            <span className="hp-hero__title-accent">Approved Where Others<br />Declined.</span>
          </h1>

          <p className="hp-hero__body">
            MTRX Pay is a compliant payment orchestration platform designed for
            merchants who need higher approval rates, structured onboarding,
            and controlled settlement.
          </p>
          <p className="hp-hero__body">
            Built with integrated KYC, AML monitoring, and intelligent risk controls
            from day one.
          </p>

          <div className="hp-hero__ctas">
            <Link to="/register" className="hp-btn hp-btn--primary">
              Get Started
            </Link>
            <Link to="/technology" className="hp-btn hp-btn--outline">
              Learn More &gt;
            </Link>
          </div>
        </div>

        {/* Transaction Feed */}
        <div className={`hp-hero__feed ${isLoaded ? 'hp-hero__feed--visible' : ''}`}>
          <div className="hp-feed">
            <div className="hp-feed__head">
              <div className="hp-feed__head-left">
                <span className="hp-feed__dot" />
                <span className="hp-feed__head-title">Typical Transactions</span>
              </div>
              <span className="hp-feed__head-rate">1,247/min</span>
            </div>

            <div className="hp-feed__rows">
              {transactions.map((tx, i) => (
                <div key={i} className="hp-feed__row">
                  <div className="hp-feed__row-left">
                    <span className="hp-feed__route">
                      {CRYPTOS.has(tx.route[0]) ? <span className="hp-feed__crypto">{tx.route[0]}</span> : tx.route[0]}
                      {' '}<span className="hp-feed__arrow">→</span>{' '}
                      {tx.route[1] && <><span className="hp-feed__crypto">{tx.route[1]}</span>{' '}<span className="hp-feed__arrow">→</span>{' '}</>}
                      {tx.route[2]}
                    </span>
                    <span className="hp-feed__risk">Risk {tx.risk}/100</span>
                  </div>
                  <div className="hp-feed__row-right">
                    <span className="hp-feed__amount">{tx.amount}</span>
                    <div className="hp-feed__status-row">
                      <span className={`hp-feed__badge hp-feed__badge--${tx.status.toLowerCase()}`}>{tx.status}</span>
                      <span className="hp-feed__time">{tx.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="hp-feed__foot">
              <span className="hp-feed__foot-left">↑ <span className="hp-feed__foot-accent">£48M</span> settled today</span>
              <span className="hp-feed__foot-right">99.98% success rate</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
