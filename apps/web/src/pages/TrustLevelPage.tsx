import { DashboardLayout } from '../components/layout/DashboardLayout';

interface TrustFactor {
  name: string;
  score: number;
  maxScore: number;
  status: 'excellent' | 'good' | 'fair' | 'poor';
  description: string;
  tips?: string[];
}

const trustFactors: TrustFactor[] = [
  { name: 'Account Verification', score: 20, maxScore: 20, status: 'excellent', description: 'Full KYB verification completed' },
  { name: 'Transaction History', score: 18, maxScore: 20, status: 'good', description: 'Consistent payment processing with low refund rate', tips: ['Maintain refund rate below 2%', 'Process transactions regularly'] },
  { name: 'Chargeback Rate', score: 15, maxScore: 20, status: 'good', description: 'Current chargeback rate: 0.8%', tips: ['Keep chargeback rate below 0.5% for excellent rating', 'Respond to disputes within 24 hours'] },
  { name: 'Compliance Status', score: 17, maxScore: 20, status: 'good', description: 'Most compliance documents up to date', tips: ['Upload missing AML policy document', 'Ensure all documents remain current'] },
  { name: 'Account Age', score: 15, maxScore: 20, status: 'good', description: 'Account active for 3 months', tips: ['Trust score improves with account longevity'] },
];

const trustHistory = [
  { date: '2026-01-15', score: 85, change: 0 },
  { date: '2026-01-08', score: 85, change: 2 },
  { date: '2026-01-01', score: 83, change: -2 },
  { date: '2025-12-25', score: 85, change: 5 },
  { date: '2025-12-18', score: 80, change: 3 },
  { date: '2025-12-11', score: 77, change: 7 },
  { date: '2025-12-04', score: 70, change: 0 },
];

const trustBenefits = [
  { minScore: 90, benefit: 'Priority support response', unlocked: false },
  { minScore: 85, benefit: 'Reduced escrow period (48 hours)', unlocked: true },
  { minScore: 80, benefit: 'Higher transaction limits', unlocked: true },
  { minScore: 75, benefit: 'Faster payout processing', unlocked: true },
  { minScore: 70, benefit: 'Basic merchant account', unlocked: true },
];

export function TrustLevelPage() {
  const totalScore = trustFactors.reduce((sum, f) => sum + f.score, 0);
  const maxTotalScore = trustFactors.reduce((sum, f) => sum + f.maxScore, 0);
  const trustPercentage = Math.round((totalScore / maxTotalScore) * 100);

  const getTrustLevel = (score: number) => {
    if (score >= 90) return { level: 'Excellent', color: 'var(--hp-green)' };
    if (score >= 80) return { level: 'Good', color: 'var(--hp-gold)' };
    if (score >= 70) return { level: 'Fair', color: '#E0A030' };
    return { level: 'Needs Improvement', color: 'var(--hp-red)' };
  };

  const trustLevel = getTrustLevel(trustPercentage);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'var(--hp-green)';
      case 'good': return 'var(--hp-gold)';
      case 'fair': return '#E0A030';
      default: return 'var(--hp-red)';
    }
  };

  return (
    <DashboardLayout>
      <div className="hp-dash__page-header">
        <h1 className="hp-dash__page-title">Merchant Trust Level</h1>
      </div>

      {/* Main Trust Score */}
      <section className="hp-dash__trust-score-card">
        <div className="hp-dash__trust-visual">
          <svg viewBox="0 0 100 100" className="hp-dash__trust-circle">
            <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
            <circle
              cx="50" cy="50" r="45" fill="none"
              stroke={trustLevel.color}
              strokeWidth="8" strokeLinecap="round"
              strokeDasharray={`${trustPercentage * 2.83} 283`}
              transform="rotate(-90 50 50)"
            />
          </svg>
          <div className="hp-dash__trust-number">
            <span className="hp-dash__trust-score-val">{trustPercentage}</span>
            <span className="hp-dash__trust-score-max">/100</span>
          </div>
        </div>
        <div className="hp-dash__trust-info">
          <span className="hp-dash__trust-level-badge" style={{ color: trustLevel.color }}>{trustLevel.level}</span>
          <p className="hp-dash__text-muted">
            Your merchant trust level is calculated based on verification status, transaction history, chargeback rate, compliance, and account age.
          </p>
          {trustPercentage < 90 && (
            <p className="hp-dash__text-muted">
              Next milestone: <strong style={{ color: 'var(--hp-gold)' }}>{trustPercentage < 80 ? '80' : '90'} points</strong> ({(trustPercentage < 80 ? 80 : 90) - trustPercentage} points needed)
            </p>
          )}
          {trustPercentage >= 90 && <p style={{ color: 'var(--hp-green)' }}>You've achieved maximum trust level!</p>}
        </div>
      </section>

      {/* Trust Factors */}
      <section className="hp-dash__card-section">
        <span className="hp-dash__section-label">Trust Factors</span>
        <div className="hp-dash__factor-list">
          {trustFactors.map((factor, i) => (
            <div key={i} className="hp-dash__factor-card">
              <div className="hp-dash__factor-header">
                <h4>{factor.name}</h4>
                <span style={{ color: getStatusColor(factor.status), fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
                  {factor.score}/{factor.maxScore}
                </span>
              </div>
              <div className="hp-dash__factor-bar">
                <div className="hp-dash__factor-fill" style={{ width: `${(factor.score / factor.maxScore) * 100}%`, background: getStatusColor(factor.status) }} />
              </div>
              <p className="hp-dash__text-muted">{factor.description}</p>
              {factor.tips && factor.tips.length > 0 && (
                <div className="hp-dash__factor-tips">
                  <span className="hp-dash__text-gold" style={{ fontSize: 12, fontWeight: 600 }}>Tips to improve:</span>
                  <ul>
                    {factor.tips.map((tip, j) => <li key={j}>{tip}</li>)}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section className="hp-dash__card-section">
        <span className="hp-dash__section-label">Trust Benefits</span>
        <div className="hp-dash__benefit-list">
          {trustBenefits.map((b, i) => (
            <div key={i} className={`hp-dash__benefit-item${b.unlocked ? ' hp-dash__benefit-item--unlocked' : ''}`}>
              <span className="hp-dash__benefit-icon">
                {b.unlocked ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
                  </svg>
                )}
              </span>
              <div>
                <span className="hp-dash__benefit-name">{b.benefit}</span>
                <span className="hp-dash__text-muted" style={{ fontSize: 12 }}>Requires {b.minScore}+ trust score</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* History */}
      <section className="hp-dash__transactions">
        <span className="hp-dash__section-label" style={{ marginBottom: 16, display: 'inline-flex' }}>Score History</span>
        <div className="hp-dash__table-wrap">
          <table className="hp-dash__table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Score</th>
                <th>Change</th>
              </tr>
            </thead>
            <tbody>
              {trustHistory.map((entry, i) => (
                <tr key={i}>
                  <td>{entry.date}</td>
                  <td className="hp-dash__txn-id">{entry.score}</td>
                  <td>
                    <span className={entry.change > 0 ? 'hp-dash__text-green' : entry.change < 0 ? 'hp-dash__text-red' : 'hp-dash__text-muted'}>
                      {entry.change > 0 ? '+' : ''}{entry.change !== 0 ? entry.change : '-'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Tips Alert */}
      <div className="hp-dash__alert hp-dash__alert--info" style={{ marginTop: 8 }}>
        <span className="hp-dash__alert-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 01-3.46 0" />
          </svg>
        </span>
        <span>Maintain a high trust score to unlock premium benefits including reduced fees, faster payouts, and priority support.</span>
      </div>
    </DashboardLayout>
  );
}
