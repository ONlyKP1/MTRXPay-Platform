import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Alert } from '../components/common';

interface TrustFactor {
  name: string;
  score: number;
  maxScore: number;
  status: 'excellent' | 'good' | 'fair' | 'poor';
  description: string;
  tips?: string[];
}

const trustFactors: TrustFactor[] = [
  {
    name: 'Account Verification',
    score: 20,
    maxScore: 20,
    status: 'excellent',
    description: 'Full KYB verification completed',
  },
  {
    name: 'Transaction History',
    score: 18,
    maxScore: 20,
    status: 'good',
    description: 'Consistent payment processing with low refund rate',
    tips: ['Maintain refund rate below 2%', 'Process transactions regularly'],
  },
  {
    name: 'Chargeback Rate',
    score: 15,
    maxScore: 20,
    status: 'good',
    description: 'Current chargeback rate: 0.8%',
    tips: ['Keep chargeback rate below 0.5% for excellent rating', 'Respond to disputes within 24 hours'],
  },
  {
    name: 'Compliance Status',
    score: 17,
    maxScore: 20,
    status: 'good',
    description: 'Most compliance documents up to date',
    tips: ['Upload missing AML policy document', 'Ensure all documents remain current'],
  },
  {
    name: 'Account Age',
    score: 15,
    maxScore: 20,
    status: 'good',
    description: 'Account active for 3 months',
    tips: ['Trust score improves with account longevity'],
  },
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
  const navigate = useNavigate();
  const { user: _user } = useAuth();

  const totalScore = trustFactors.reduce((sum, f) => sum + f.score, 0);
  const maxTotalScore = trustFactors.reduce((sum, f) => sum + f.maxScore, 0);
  const trustPercentage = Math.round((totalScore / maxTotalScore) * 100);

  const getTrustLevel = (score: number) => {
    if (score >= 90) return { level: 'Excellent', color: 'var(--success)' };
    if (score >= 80) return { level: 'Good', color: 'var(--gold)' };
    if (score >= 70) return { level: 'Fair', color: 'var(--gold-dark)' };
    return { level: 'Needs Improvement', color: 'var(--error)' };
  };

  const trustLevel = getTrustLevel(trustPercentage);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'var(--success)';
      case 'good': return 'var(--gold)';
      case 'fair': return 'var(--gold-dark)';
      default: return 'var(--error)';
    }
  };

  return (
    <div className="dashboard-layout">
      <div className="dashboard-container">
        {/* Header */}
        <header className="dashboard-header">
          <div className="header-back" onClick={() => navigate('/dashboard')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            <span>Back to Dashboard</span>
          </div>
          <img src="/logo.png" alt="MTRX Pay" className="dashboard-logo-img" />
        </header>

        <h1 className="page-title">Merchant Trust Level</h1>

        {/* Main Trust Score */}
        <div className="trust-score-card">
          <div className="trust-score-visual">
            <div className="trust-circle">
              <svg viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="var(--border)"
                  strokeWidth="8"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke={trustLevel.color}
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${trustPercentage * 2.83} 283`}
                  transform="rotate(-90 50 50)"
                />
              </svg>
              <div className="trust-score-number">
                <span className="score-value">{trustPercentage}</span>
                <span className="score-max">/100</span>
              </div>
            </div>
          </div>
          <div className="trust-score-info">
            <span className="trust-level-label" style={{ color: trustLevel.color }}>
              {trustLevel.level}
            </span>
            <p className="trust-description">
              Your merchant trust level is calculated based on verification status, transaction history, chargeback rate, compliance, and account age.
            </p>
            <div className="trust-next-level">
              {trustPercentage < 90 && (
                <>
                  <span>Next milestone:</span>
                  <strong>{trustPercentage < 80 ? '80 points' : '90 points'}</strong>
                  <span>({(trustPercentage < 80 ? 80 : 90) - trustPercentage} points needed)</span>
                </>
              )}
              {trustPercentage >= 90 && (
                <span className="max-trust">You've achieved maximum trust level!</span>
              )}
            </div>
          </div>
        </div>

        {/* Trust Factors */}
        <div className="trust-section">
          <h3 className="section-title">Trust Factors</h3>
          <div className="trust-factors">
            {trustFactors.map((factor, index) => (
              <div key={index} className="trust-factor-card">
                <div className="factor-header">
                  <h4>{factor.name}</h4>
                  <span className="factor-score" style={{ color: getStatusColor(factor.status) }}>
                    {factor.score}/{factor.maxScore}
                  </span>
                </div>
                <div className="factor-bar">
                  <div
                    className="factor-fill"
                    style={{
                      width: `${(factor.score / factor.maxScore) * 100}%`,
                      background: getStatusColor(factor.status)
                    }}
                  />
                </div>
                <p className="factor-description">{factor.description}</p>
                {factor.tips && factor.tips.length > 0 && (
                  <div className="factor-tips">
                    <span className="tips-label">Tips to improve:</span>
                    <ul>
                      {factor.tips.map((tip, i) => (
                        <li key={i}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Benefits */}
        <div className="trust-section">
          <h3 className="section-title">Trust Benefits</h3>
          <div className="trust-benefits">
            {trustBenefits.map((benefit, index) => (
              <div key={index} className={`benefit-item ${benefit.unlocked ? 'unlocked' : 'locked'}`}>
                <div className="benefit-icon">
                  {benefit.unlocked ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                      <polyline points="22 4 12 14.01 9 11.01"/>
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                  )}
                </div>
                <div className="benefit-info">
                  <span className="benefit-name">{benefit.benefit}</span>
                  <span className="benefit-requirement">Requires {benefit.minScore}+ trust score</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* History */}
        <div className="trust-section">
          <h3 className="section-title">Score History</h3>
          <div className="trust-history">
            {trustHistory.map((entry, index) => (
              <div key={index} className="history-item">
                <span className="history-date">{entry.date}</span>
                <span className="history-score">{entry.score}</span>
                <span className={`history-change ${entry.change > 0 ? 'positive' : entry.change < 0 ? 'negative' : ''}`}>
                  {entry.change > 0 ? '+' : ''}{entry.change !== 0 ? entry.change : '-'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Tips Alert */}
        <Alert type="info">
          Maintain a high trust score to unlock premium benefits including reduced fees, faster payouts, and priority support.
        </Alert>
      </div>
    </div>
  );
}
