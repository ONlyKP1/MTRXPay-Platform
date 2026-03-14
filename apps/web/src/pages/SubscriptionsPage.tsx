import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../components/layout/DashboardLayout';

const INITIAL_BALANCE = 31_842.75;

interface Payout {
  id: string;
  date: string;
  amount: number;
  status: string;
}

const initialUpcomingPayouts: Payout[] = [
  { id: 'PAY-001', date: '2026-03-18', amount: 8_240.00, status: 'scheduled' },
  { id: 'PAY-002', date: '2026-03-25', amount: 6_715.30, status: 'pending' },
  { id: 'PAY-003', date: '2026-04-01', amount: 9_380.50, status: 'estimated' },
];

const mockPayoutHistory: Payout[] = [
  { id: 'PAY-H001', date: '2026-03-11', amount: 7_520.00, status: 'completed' },
  { id: 'PAY-H002', date: '2026-03-04', amount: 5_935.60, status: 'completed' },
  { id: 'PAY-H003', date: '2026-02-25', amount: 4_180.25, status: 'completed' },
  { id: 'PAY-H004', date: '2026-02-18', amount: 8_460.90, status: 'completed' },
  { id: 'PAY-H005', date: '2026-02-11', amount: 6_320.00, status: 'completed' },
  { id: 'PAY-H006', date: '2026-02-04', amount: 3_750.45, status: 'completed' },
];

const escrowPeriod = 72;
const bankAccount = {
  name: 'Business Account',
  bank: 'Barclays',
  lastFour: '4521',
  sortCode: '20-00-00',
};

const formatDate = (iso: string) => {
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
};

let payoutCounter = 4; // next ID after PAY-003

export function PayoutsPage() {
  const navigate = useNavigate();
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [balance, setBalance] = useState(INITIAL_BALANCE);
  const [upcomingPayouts, setUpcomingPayouts] = useState<Payout[]>(initialUpcomingPayouts);

  const formatCurrency = (amount: number) => {
    return `\u00A3${amount.toLocaleString('en-GB', { minimumFractionDigits: 2 })}`;
  };

  const handleRequestPayout = async () => {
    const amount = parseFloat(payoutAmount);
    if (!amount || amount <= 0 || amount > balance) return;

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Generate a payout date 7 days from now
    const payoutDate = new Date();
    payoutDate.setDate(payoutDate.getDate() + 7);
    const dateStr = payoutDate.toISOString().slice(0, 10);

    const newPayout: Payout = {
      id: `PAY-00${payoutCounter++}`,
      date: dateStr,
      amount,
      status: 'pending',
    };

    setBalance(prev => prev - amount);
    setUpcomingPayouts(prev => [newPayout, ...prev]);
    setIsSubmitting(false);
    setShowRequestModal(false);
    setPayoutAmount('');
    setSuccessToast(`Payout of ${formatCurrency(amount)} submitted`);
    setTimeout(() => setSuccessToast(null), 4000);
  };

  const totalPaid = mockPayoutHistory.reduce((sum, p) => sum + p.amount, 0);
  const totalUpcoming = upcomingPayouts.reduce((sum, p) => sum + p.amount, 0);

  const parsedAmount = parseFloat(payoutAmount);
  const isValidAmount = parsedAmount > 0 && parsedAmount <= balance;

  return (
    <DashboardLayout>
      <div className="hp-dash__page-header">
        <h1 className="hp-dash__page-title">Payouts</h1>
      </div>

      {/* Summary Metrics */}
      <div className="hp-dash__metrics">
        <div className="hp-dash__metric-card">
          <span className="hp-dash__metric-label">Available Balance</span>
          <span className="hp-dash__metric-value">{formatCurrency(balance)}</span>
          <span className="hp-dash__metric-sub">GBP</span>
        </div>
        <div className="hp-dash__metric-card">
          <span className="hp-dash__metric-label">Upcoming Total</span>
          <span className="hp-dash__metric-value">{formatCurrency(totalUpcoming)}</span>
          <span className="hp-dash__metric-sub">{upcomingPayouts.length} scheduled</span>
        </div>
        <div className="hp-dash__metric-card">
          <span className="hp-dash__metric-label">Total Paid Out</span>
          <span className="hp-dash__metric-value">{formatCurrency(totalPaid)}</span>
          <span className="hp-dash__metric-sub">Last {mockPayoutHistory.length} payouts</span>
        </div>
        <div className="hp-dash__metric-card">
          <span className="hp-dash__metric-label">Escrow Period</span>
          <span className="hp-dash__metric-value">{escrowPeriod}hrs</span>
          <span className="hp-dash__metric-sub">Hold duration</span>
        </div>
      </div>

      {/* Request Payout */}
      <section className="hp-dash__card-section">
        <div className="hp-dash__section-header">
          <div>
            <span className="hp-dash__section-label">Request Payout</span>
            <p className="hp-dash__text-muted" style={{ marginTop: 6 }}>Withdraw your available balance to your linked bank account</p>
          </div>
          <button className="hp-dash__btn-gold" onClick={() => setShowRequestModal(true)}>Request Payout</button>
        </div>
      </section>

      {/* Bank Account */}
      <section className="hp-dash__card-section">
        <div className="hp-dash__section-header">
          <span className="hp-dash__section-label">Payout Destination</span>
          <button className="hp-dash__btn-outline hp-dash__btn-sm">Edit</button>
        </div>
        <div className="hp-dash__bank-card">
          <div className="hp-dash__bank-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="1" y="4" width="22" height="16" rx="2" /><line x1="1" y1="10" x2="23" y2="10" />
            </svg>
          </div>
          <div className="hp-dash__bank-details">
            <span className="hp-dash__bank-name">{bankAccount.name}</span>
            <span className="hp-dash__text-muted">{bankAccount.bank} •••• {bankAccount.lastFour}</span>
            <span className="hp-dash__text-muted">Sort Code: {bankAccount.sortCode}</span>
          </div>
          <span className="hp-dash__status hp-dash__status--completed" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            Verified
          </span>
        </div>
      </section>

      {/* Upcoming Payouts */}
      <section className="hp-dash__transactions">
        <span className="hp-dash__section-label" style={{ marginBottom: 16, display: 'inline-flex' }}>Upcoming Payouts</span>
        <div className="hp-dash__table-wrap">
          <table className="hp-dash__table">
            <thead>
              <tr>
                <th>Payout ID</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {upcomingPayouts.map((p) => (
                <tr key={p.id}>
                  <td className="hp-dash__txn-id">{p.id}</td>
                  <td>{formatDate(p.date)}</td>
                  <td>{formatCurrency(p.amount)}</td>
                  <td><span className={`hp-dash__status hp-dash__status--${p.status}`}>{p.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Payout History */}
      <section className="hp-dash__transactions">
        <div className="hp-dash__section-header" style={{ marginBottom: 16 }}>
          <span className="hp-dash__section-label">Payout History</span>
          <button className="hp-dash__view-all" onClick={() => navigate('/transactions?type=payouts')}>View All</button>
        </div>
        <div className="hp-dash__table-wrap">
          <table className="hp-dash__table">
            <thead>
              <tr>
                <th>Payout ID</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {mockPayoutHistory.map((p) => (
                <tr key={p.id}>
                  <td className="hp-dash__txn-id">{p.id}</td>
                  <td>{formatDate(p.date)}</td>
                  <td>{formatCurrency(p.amount)}</td>
                  <td><span className="hp-dash__status hp-dash__status--completed">Completed</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Request Payout Modal */}
      {showRequestModal && (
        <div className="hp-dash__modal-overlay" onClick={() => setShowRequestModal(false)}>
          <div className="hp-dash__modal" onClick={(e) => e.stopPropagation()}>
            <div className="hp-dash__modal-header">
              <h3>Request Payout</h3>
              <button className="hp-dash__modal-close" onClick={() => setShowRequestModal(false)}>&times;</button>
            </div>
            <div className="hp-dash__modal-body">
              <p className="hp-dash__text-muted" style={{ marginBottom: 16 }}>Available balance: <strong style={{ color: 'var(--hp-gold)' }}>{formatCurrency(balance)}</strong></p>
              <div className="hp-dash__field">
                <label>Amount (GBP)</label>
                <input type="number" placeholder="0.00" value={payoutAmount} onChange={(e) => setPayoutAmount(e.target.value)} />
              </div>
              {parsedAmount > balance && (
                <p style={{ color: 'var(--hp-red)', fontSize: '0.8rem', marginTop: 8 }}>Amount exceeds available balance</p>
              )}
              <div className="hp-dash__alert hp-dash__alert--info" style={{ marginTop: 16 }}>
                <span className="hp-dash__alert-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 01-3.46 0" />
                  </svg>
                </span>
                <span>Payouts are subject to a {escrowPeriod}-hour escrow period.</span>
              </div>
            </div>
            <div className="hp-dash__modal-footer">
              <button className="hp-dash__modal-cancel" onClick={() => setShowRequestModal(false)}>Cancel</button>
              <button className="hp-dash__modal-send" onClick={handleRequestPayout} disabled={isSubmitting || !isValidAmount}>
                {isSubmitting ? 'Submitting...' : 'Submit Request'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Toast */}
      {successToast && (
        <div className="hp-dash__toast">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          <span>{successToast}</span>
          <button className="hp-dash__toast-close" onClick={() => setSuccessToast(null)}>&times;</button>
        </div>
      )}
    </DashboardLayout>
  );
}
