import React from 'react';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div>
          <div className="footer-brand">MTRX</div>
          <p className="footer-tagline">
            Premium payment orchestration for complex transactions.
            Part of the MIDAS financial infrastructure group.
          </p>
        </div>
        <div className="footer-section">
          <h4>Platform</h4>
          <ul className="footer-links">
            <li><a href="#features">Features</a></li>
            <li><a href="#pricing">Pricing</a></li>
            <li><a href="#">Documentation</a></li>
            <li><a href="#">API Reference</a></li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>Company</h4>
          <ul className="footer-links">
            <li><a href="#">About Us</a></li>
            <li><a href="#">Careers</a></li>
            <li><a href="#">Partners</a></li>
            <li><a href="#">Contact</a></li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>Legal</h4>
          <ul className="footer-links">
            <li><a href="#">Terms of Service</a></li>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Compliance</a></li>
            <li><a href="#">Security</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2025 MTRX. All rights reserved. MTRX is a payment orchestration platform. 
        We work with licensed partners for regulated services.</p>
      </div>
    </footer>
  );
}

export default Footer;
