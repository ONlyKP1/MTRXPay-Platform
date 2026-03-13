import { Hero, MetricsStrip, TickerStrip, TrustBar, BusinessModels, Pricing } from '../components/landing';
import { PublicLayout } from '../components/layout/PublicLayout';

export function LandingPage() {
  return (
    <PublicLayout>
      <Hero />
      <MetricsStrip />
      <TickerStrip />
      <TrustBar />
      <BusinessModels />
      <div className="hp-section-divider">
        <div className="hp-section-divider__line" />
        <div className="hp-section-divider__diamond" />
        <div className="hp-section-divider__line" />
      </div>
      <Pricing />
    </PublicLayout>
  );
}
