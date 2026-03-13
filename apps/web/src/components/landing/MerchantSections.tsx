import { AnimatedSection } from '../AnimatedSection';

export function MerchantSections() {
  return (
    <section className="image-split" id="merchants">
      <div className="split-container">
        <AnimatedSection className="split-content" animation="fade-right">
          <h2>For High-Value Merchants</h2>
          <p>
            Whether you're processing luxury goods, high-ticket services, or
            complex B2B transactions, MTRX provides the infrastructure you need.
          </p>
          <ul>
            <li>Elevated transaction limits with proper risk controls</li>
            <li>Chargeback prevention and dispute management</li>
            <li>Dedicated account management</li>
            <li>Custom integration support</li>
          </ul>
        </AnimatedSection>
        <AnimatedSection className="split-image" animation="fade-left" delay={0.2}>
          <img
            src="/streamer.jpg"
            alt="Content creator using MTRX Pay dashboard"
            className="section-img float-animation"
          />
        </AnimatedSection>
      </div>

      <div className="split-container reverse">
        <AnimatedSection className="split-content" animation="fade-left">
          <h2>For Underserved Industries</h2>
          <p>
            Operating in an industry that traditional processors consider
            "high-risk"? We specialize in finding solutions for legitimate
            businesses in challenging verticals.
          </p>
          <ul>
            <li>Nutraceuticals & supplements</li>
            <li>CBD & hemp products</li>
            <li>Travel & hospitality</li>
            <li>Digital goods & gaming</li>
          </ul>
        </AnimatedSection>
        <AnimatedSection className="split-image" animation="fade-right" delay={0.2}>
          <img
            src="/creators-2.png"
            alt="Content creator in streaming setup"
            className="section-img float-animation"
          />
        </AnimatedSection>
      </div>
    </section>
  );
}
