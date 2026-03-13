import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useNavbarScroll } from '../../hooks/useScrollAnimation';

export function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isScrolled, isVisible } = useNavbarScroll();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navClasses = [
    'hp-nav',
    isScrolled ? 'hp-nav--scrolled' : '',
    !isVisible ? 'hp-nav--hidden' : '',
  ].filter(Boolean).join(' ');

  return (
    <nav className={navClasses}>
      <div className="hp-nav__inner">
        <a href="/" className="hp-nav__brand">
          <img src="/logo.png" alt="MTRXPAY" className="hp-nav__logo" />
        </a>

        <div className="hp-nav__links">
          <a href="/" className={`hp-nav__link ${location.pathname === '/' ? 'hp-nav__link--active' : ''}`}>Home</a>
        </div>

        <div className="hp-nav__actions">
          <button className="hp-nav__cta" onClick={() => navigate('/register')}>
            JOIN NOW
          </button>
        </div>

        <button
          className={`hp-nav__burger ${isMobileMenuOpen ? 'hp-nav__burger--open' : ''}`}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          <span /><span /><span />
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="hp-nav__mobile">
          <a href="/" onClick={() => setIsMobileMenuOpen(false)}>Home</a>
          <div className="hp-nav__mobile-actions">
            <button className="hp-nav__cta" onClick={() => { navigate('/register'); setIsMobileMenuOpen(false); }}>JOIN NOW</button>
          </div>
        </div>
      )}
    </nav>
  );
}
