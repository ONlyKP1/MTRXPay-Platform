import React, { useState } from 'react';

function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="nav">
      <div className="nav-container">
        <a href="/" className="logo">MTRX</a>
        <div className={`nav-links ${mobileMenuOpen ? 'active' : ''}`}>
          <a href="#features">Features</a>
          <a href="#merchants">For Merchants</a>
          <a href="#pricing">Pricing</a>
          <a href="#contact">Contact</a>
          <button className="nav-cta" onClick={() => window.location.href = '/onboarding'}>
            Get Started
          </button>
        </div>
        <div className="mobile-menu" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
