import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../components/layout/DashboardLayout';

type PayoutSchedule = 'daily' | 'weekly' | 'biweekly' | 'monthly';

const scheduleOptions: { value: PayoutSchedule; label: string; description: string }[] = [
  { value: 'daily', label: 'Daily', description: 'Receive payouts every business day' },
  { value: 'weekly', label: 'Weekly', description: 'Receive payouts every Monday' },
  { value: 'biweekly', label: 'Bi-Weekly', description: 'Receive payouts every other Monday' },
  { value: 'monthly', label: 'Monthly', description: 'Receive payouts on the 1st of each month' },
];

const mockPayoutConfig = {
  currentSchedule: 'weekly' as PayoutSchedule,
  escrowPeriod: 72,
  feeRate: 2.9,
  currency: 'GBP',
  bankAccount: {
    name: 'Business Account',
    bank: 'Barclays',
    lastFour: '4521',
    sortCode: '20-00-00',
  },
};

const mockUpcomingPayouts = [
  { id: 'PAY-001', date: '2026-01-24', amount: 15420.00, status: 'scheduled' },
  { id: 'PAY-002', date: '2026-01-31', amount: 12890.50, status: 'pending' },
  { id: 'PAY-003', date: '2026-02-07', amount: 18750.00, status: 'estimated' },
];

const mockPayoutHistory = [
  { id: 'PAY-H001', date: '2026-01-17', amount: 14250.00, status: 'completed' },
  { id: 'PAY-H002', date: '2026-01-10', amount: 11890.50, status: 'completed' },
  { id: 'PAY-H003', date: '2026-01-03', amount: 9420.00, status: 'completed' },
  { id: 'PAY-H004', date: '2025-12-27', amount: 16580.75, status: 'completed' },
  { id: 'PAY-H005', date: '2025-12-20', amount: 13200.00, status: 'completed' },
  { id: 'PAY-H006', date: '2025-12-13', amount: 10840.25, status: 'completed' },
];

export function PayoutsPage() {
  const navigate = useNavigate();
  const [selectedSchedule, setSelectedSchedule] = useState<PayoutSchedule>(mockPayoutConfig.currentSchedule);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const formatCurrency = (amount: number) => {
    return `\u00A3${amount.toLocaleString('en-GB', { minimumFractionDigits: 2 })}`;
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSaving(false);
    setShowConfirmModal(false);
    alert('Payout schedule updated successfully!');
  };

  const hasChanges = selectedSchedule !== mockPayoutConfig.currentSchedule;
  const totalPaid = mockPayoutHistory.reduce((sum, p) => sum + p.amount, 0);
  const totalUpcoming = mockUpcomingPayouts.reduce((sum, p) => sum + p.amount, 0);

  return (
    <DashboardLayout>
      <div className="hp-dash__page-header">
        <h1 className="hp-dash__page-title">Payouts</h1>
      </div>

      {/* Summary Metrics */}
      <div className="hp-dash__metrics">
        <div className="hp-dash__metric-card">
          <span className="hp-dash__metric-label">Next Payout</span>
          <span className="hp-dash__metric-value">{formatCurrency(mockUpcomingPayouts[0].amount)}</span>
          <span className="hp-dash__metric-sub">{mockUpcomingPayouts[0].date}</span>
        </div>
        <div className="hp-dash__metric-card">
          <span className="hp-dash__metric-label">Upcoming Total</span>
          <span className="hp-dash__metric-value">{formatCurrency(totalUpcoming)}</span>
          <span className="hp-dash__metric-sub">{mockUpcomingPayouts.length} scheduled</span>
        </div>
        <div className="hp-dash__metric-card">
          <span className="hp-dash__metric-label">Total Paid Out</span>
          <span className="hp-dash__metric-value">{formatCurrency(totalPaid)}</span>
          <span className="hp-dash__metric-sub">Last 6 payouts</span>
        </div>
        <div className="hp-dash__metric-card">
          <span className="hp-dash__metric-label">Escrow Period</span>
          <span className="hp-dash__metric-value">{mockPayoutConfig.escrowPeriod}hrs</span>
          <span className="hp-dash__metric-sub">Hold duration</span>
        </div>
      </div>

      {/* Payout Schedule */}
      <section className="hp-dash__card-section">
        <span className="hp-dash__section-label">Payout Schedule</span>
        <p className="hp-dash__text-muted" style={{ marginBottom: 16 }}>Choose how often you'd like to receive your payouts</p>
        <div className="hp-dash__schedule-grid">
          {scheduleOptions.map((option) => (
            <div
              key={option.value}
              className={`hp-dash__schedule-option${selectedSchedule === option.value ? ' hp-dash__schedule-option--active' : ''}`}
              onClick={() => setSelectedSchedule(option.value)}
            >
              <div className="hp-dash__radio">
                {selectedSchedule === option.value && <div className="hp-dash__radio-dot" />}
              </div>
              <div>
                <span className="hp-dash__schedule-label">{option.label}</span>
                <span className="hp-dash__text-muted">{option.description}</span>
              </div>
              {option.value === mockPayoutConfig.currentSchedule && (
                <span className="hp-dash__action-badge">Current</span>
              )}
            </div>
          ))}
        </div>
        {hasChanges && (
          <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div className="hp-dash__alert hp-dash__alert--info">
              <span className="hp-dash__alert-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 01-3.46 0" />
                </svg>
              </span>
              <span>Changing your payout schedule will take effect from the next payout cycle.</span>
            </div>
            <button className="hp-dash__btn-gold" onClick={() => setShowConfirmModal(true)}>Save Changes</button>
          </div>
        )}
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
            <span className="hp-dash__bank-name">{mockPayoutConfig.bankAccount.name}</span>
            <span className="hp-dash__text-muted">{mockPayoutConfig.bankAccount.bank} •••• {mockPayoutConfig.bankAccount.lastFour}</span>
            <span className="hp-dash__text-muted">Sort Code: {mockPayoutConfig.bankAccount.sortCode}</span>
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
              {mockUpcomingPayouts.map((p) => (
                <tr key={p.id}>
                  <td className="hp-dash__txn-id">{p.id}</td>
                  <td>{p.date}</td>
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
                  <td>{p.date}</td>
                  <td>{formatCurrency(p.amount)}</td>
                  <td><span className="hp-dash__status hp-dash__status--completed">Completed</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Confirm Modal */}
      {showConfirmModal && (
        <div className="hp-dash__modal-overlay" onClick={() => setShowConfirmModal(false)}>
          <div className="hp-dash__modal" onClick={(e) => e.stopPropagation()}>
            <div className="hp-dash__modal-header">
              <h3>Confirm Schedule Change</h3>
              <button className="hp-dash__modal-close" onClick={() => setShowConfirmModal(false)}>&times;</button>
            </div>
            <div className="hp-dash__modal-body">
              <p style={{ marginBottom: 16 }}>Are you sure you want to change your payout schedule from <strong>{mockPayoutConfig.currentSchedule}</strong> to <strong>{selectedSchedule}</strong>?</p>
              <div className="hp-dash__alert hp-dash__alert--info">
                <span className="hp-dash__alert-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 01-3.46 0" />
                  </svg>
                </span>
                <span>This change will take effect from your next payout cycle.</span>
              </div>
            </div>
            <div className="hp-dash__modal-footer">
              <button className="hp-dash__modal-cancel" onClick={() => setShowConfirmModal(false)}>Cancel</button>
              <button className="hp-dash__modal-send" onClick={handleSaveChanges} disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Confirm Change'}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
