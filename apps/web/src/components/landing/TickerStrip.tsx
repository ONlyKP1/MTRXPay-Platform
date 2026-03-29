const chips = [
  'KYB Verified',
  'KYC Compliant',
  'AML Monitored',
  'PEP Screened',
  'Multiple Currencies',
  'Stablecoin Settlement',
  'Tokenised Assets',
  'Real Time Risk Scoring',
  'Dynamic Settlement',
];

export function TickerStrip() {
  return (
    <div className="hp-ticker-wrap">
      <div className="hp-ticker">
        {[...chips, ...chips].map((chip, i) => (
          <span key={i} className="hp-ticker__chip"><span className="hp-ticker__dot" />{chip}</span>
        ))}
      </div>
    </div>
  );
}
