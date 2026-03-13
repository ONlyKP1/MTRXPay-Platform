import { Navigation, Hero, MetricsStrip, TickerStrip, TrustBar, BusinessModels, Pricing, Footer } from '../components/landing';

export function LandingPage() {
  return (
    <div className="hp-landing">
      <Navigation />
      <Hero />
      <MetricsStrip />
      <TickerStrip />
      <TrustBar />
      <BusinessModels />
      <Pricing />
      <Footer />
    </div>
  );
}
