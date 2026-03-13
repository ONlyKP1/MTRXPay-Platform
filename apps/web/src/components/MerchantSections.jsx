import React from 'react';

function MerchantSections() {
  return (
    <section className="image-split" id="merchants">
      <div className="split-container">
        <div className="split-content">
          <h2>For Business Merchants</h2>
          <p>
            Whether you're a registered company in luxury goods, high-value services, 
            or operating in de-risked verticals, MTRX provides the infrastructure you need.
          </p>
          <ul>
            <li>Full KYB verification and compliance</li>
            <li>Higher transaction limits</li>
            <li>Multi-user team accounts</li>
            <li>Dedicated account management</li>
            <li>Custom integration support</li>
          </ul>
          <a href="/onboarding" className="btn btn-primary">Apply as Business</a>
        </div>
        <div className="split-image">
          <div className="image-placeholder">
            <div>
              <strong>Business Merchant Image</strong><br />
              Suggested: Professional office setting, team collaboration,<br />
              or business dashboard interface
            </div>
          </div>
        </div>
      </div>

      <div className="split-container reverse">
        <div className="split-content">
          <h2>For Individual Merchants</h2>
          <p>
            Sole traders and individual merchants benefit from simplified onboarding 
            with the same premium infrastructure and compliance standards.
          </p>
          <ul>
            <li>Personal KYC verification</li>
            <li>Streamlined setup process</li>
            <li>Standard transaction limits</li>
            <li>Single-user dashboard</li>
            <li>Full platform access</li>
          </ul>
          <a href="/onboarding" className="btn btn-primary">Apply as Individual</a>
        </div>
        <div className="split-image">
          <div className="image-placeholder">
            <div>
              <strong>Individual Merchant Image</strong><br />
              Suggested: Solo entrepreneur, freelancer workspace,<br />
              or independent business owner
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default MerchantSections;
