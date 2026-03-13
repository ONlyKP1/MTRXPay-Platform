import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button, Alert } from '../components/common';

type PayoutSchedule = 'daily' | 'weekly' | 'biweekly' | 'monthly';
type Currency = 'GBP' | 'EUR' | 'USD' | 'AED';

const scheduleOptions: { value: PayoutSchedule; label: string; description: string }[] = [
  { value: 'daily', label: 'Daily', description: 'Receive payouts every business day' },
  { value: 'weekly', label: 'Weekly', description: 'Receive payouts every Monday' },
  { value: 'biweekly', label: 'Bi-Weekly', description: 'Receive payouts every other Monday' },
  { value: 'monthly', label: 'Monthly', description: 'Receive payouts on the 1st of each month' },
];

const mockSubscriptionData = {
  plan: 'Professional',
  currentSchedule: 'weekly' as PayoutSchedule,
  escrowPeriod: 72,
  feeRate: 2.9,
  monthlyFee: 49.99,
  currency: 'GBP' as Currency,
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
];

export function SubscriptionsPage() {
  const navigate = useNavigate();
  const { user: _user } = useAuth();
  const [selectedSchedule, setSelectedSchedule] = useState<PayoutSchedule>(mockSubscriptionData.currentSchedule);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const formatCurrency = (amount: number) => {
    return `£${amount.toLocaleString('en-GB', { minimumFractionDigits: 2 })}`;
  };

  const handleScheduleChange = (schedule: PayoutSchedule) => {
    setSelectedSchedule(schedule);
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSaving(false);
    setShowConfirmModal(false);
    alert('Payout schedule updated successfully!');
  };

  const hasChanges = selectedSchedule !== mockSubscriptionData.currentSchedule;

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

        <h1 className="page-title">Payout & Subscription Management</h1>

        {/* Current Plan Card */}
        <div className="subscription-card plan-card">
          <div className="plan-header">
            <div>
              <span className="plan-label">Current Plan</span>
              <h2 className="plan-name">{mockSubscriptionData.plan}</h2>
            </div>
            <div className="plan-badge">Active</div>
          </div>
          <div className="plan-details">
            <div className="plan-detail">
              <span className="detail-label">Transaction Fee</span>
              <span className="detail-value">{mockSubscriptionData.feeRate}%</span>
            </div>
            <div className="plan-detail">
              <span className="detail-label">Monthly Fee</span>
              <span className="detail-value">{formatCurrency(mockSubscriptionData.monthlyFee)}</span>
            </div>
            <div className="plan-detail">
              <span className="detail-label">Escrow Period</span>
              <span className="detail-value">{mockSubscriptionData.escrowPeriod} hours</span>
            </div>
          </div>
        </div>

        {/* Payout Schedule Selection */}
        <div className="subscription-section">
          <h3 className="section-title">Payout Schedule</h3>
          <p className="section-description">Choose how often you'd like to receive your payouts</p>

          <div className="schedule-options">
            {scheduleOptions.map((option) => (
              <div
                key={option.value}
                className={`schedule-option ${selectedSchedule === option.value ? 'selected' : ''}`}
                onClick={() => handleScheduleChange(option.value)}
              >
                <div className="schedule-radio">
                  <div className="radio-outer">
                    {selectedSchedule === option.value && <div className="radio-inner" />}
                  </div>
                </div>
                <div className="schedule-content">
                  <span className="schedule-label">{option.label}</span>
                  <span className="schedule-description">{option.description}</span>
                </div>
                {option.value === mockSubscriptionData.currentSchedule && (
                  <span className="current-badge">Current</span>
                )}
              </div>
            ))}
          </div>

          {hasChanges && (
            <div className="schedule-actions">
              <Alert type="info">
                Changing your payout schedule will take effect from the next payout cycle.
              </Alert>
              <Button onClick={() => setShowConfirmModal(true)}>
                Save Changes
              </Button>
            </div>
          )}
        </div>

        {/* Bank Account */}
        <div className="subscription-section">
          <div className="section-header">
            <h3 className="section-title">Payout Destination</h3>
            <button className="edit-btn">Edit</button>
          </div>
          <div className="bank-card">
            <div className="bank-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2"/>
                <line x1="3" y1="9" x2="21" y2="9"/>
              </svg>
            </div>
            <div className="bank-details">
              <span className="bank-name">{mockSubscriptionData.bankAccount.name}</span>
              <span className="bank-info">
                {mockSubscriptionData.bankAccount.bank} •••• {mockSubscriptionData.bankAccount.lastFour}
              </span>
              <span className="bank-sort">Sort Code: {mockSubscriptionData.bankAccount.sortCode}</span>
            </div>
            <div className="bank-verified">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
              Verified
            </div>
          </div>
        </div>

        {/* Upcoming Payouts */}
        <div className="subscription-section">
          <h3 className="section-title">Upcoming Payouts</h3>
          <div className="payouts-list">
            {mockUpcomingPayouts.map((payout) => (
              <div key={payout.id} className={`payout-item ${payout.status}`}>
                <div className="payout-info">
                  <span className="payout-id">{payout.id}</span>
                  <span className="payout-date">{payout.date}</span>
                </div>
                <div className="payout-amount">{formatCurrency(payout.amount)}</div>
                <span className={`payout-status ${payout.status}`}>
                  {payout.status === 'scheduled' && 'Scheduled'}
                  {payout.status === 'pending' && 'Pending'}
                  {payout.status === 'estimated' && 'Estimated'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Payout History */}
        <div className="subscription-section">
          <div className="section-header">
            <h3 className="section-title">Payout History</h3>
            <button className="view-all-btn" onClick={() => navigate('/transactions?type=payouts')}>
              View All
            </button>
          </div>
          <div className="payouts-list history">
            {mockPayoutHistory.map((payout) => (
              <div key={payout.id} className="payout-item completed">
                <div className="payout-info">
                  <span className="payout-id">{payout.id}</span>
                  <span className="payout-date">{payout.date}</span>
                </div>
                <div className="payout-amount">{formatCurrency(payout.amount)}</div>
                <span className="payout-status completed">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  Completed
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Confirm Modal */}
        {showConfirmModal && (
          <div className="modal-overlay" onClick={() => setShowConfirmModal(false)}>
            <div className="compose-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Confirm Schedule Change</h3>
                <button className="modal-close" onClick={() => setShowConfirmModal(false)}>×</button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to change your payout schedule from <strong>{mockSubscriptionData.currentSchedule}</strong> to <strong>{selectedSchedule}</strong>?</p>
                <Alert type="info">
                  This change will take effect from your next payout cycle. Your current scheduled payouts will not be affected.
                </Alert>
              </div>
              <div className="modal-footer">
                <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveChanges} disabled={isSaving}>
                  {isSaving ? 'Saving...' : 'Confirm Change'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
