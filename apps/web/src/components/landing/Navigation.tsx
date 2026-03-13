import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useState } from 'react';
import { useNavbarScroll } from '../../hooks/useScrollAnimation';

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Pricing', to: '/pricing' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
];

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
        <Link to="/" className="hp-nav__brand">
          <img src="/logo.png" alt="MTRXPAY" className="hp-nav__logo" />
        </Link>

        <div className="hp-nav__links">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`hp-nav__link${location.pathname === link.to ? ' hp-nav__link--active' : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hp-nav__actions">
          <button className="hp-nav__login" onClick={() => navigate('/login')}>
            Log In
          </button>
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
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setIsMobileMenuOpen(false)}
              className={location.pathname === link.to ? 'hp-nav__link--active' : ''}
            >
              {link.label}
            </Link>
          ))}
          <div className="hp-nav__mobile-actions">
            <button onClick={() => { navigate('/login'); setIsMobileMenuOpen(false); }}>Log In</button>
            <button className="hp-nav__cta" onClick={() => { navigate('/register'); setIsMobileMenuOpen(false); }}>JOIN NOW</button>
          </div>
        </div>
      )}
    </nav>
  );
}
