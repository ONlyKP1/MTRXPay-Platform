import { useState } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';

type SubStatus = 'active' | 'paused' | 'cancelled' | 'past_due' | 'trialing';
type SubInterval = 'weekly' | 'monthly' | 'quarterly' | 'yearly';

interface Subscriber {
  id: string;
  customer: string;
  email: string;
  plan: string;
  amount: number;
  interval: SubInterval;
  status: SubStatus;
  startDate: string;
  nextBilling: string;
  totalPaid: number;
  paymentMethod: string;
}

const mockSubscribers: Subscriber[] = [
  { id: 'SUB-7A2E91', customer: 'Acme Corp', email: 'billing@acme.com', plan: 'Enterprise', amount: 499.00, interval: 'monthly', status: 'active', startDate: '2025-06-15', nextBilling: '2026-02-15', totalPaid: 3992.00, paymentMethod: 'Visa •••• 4242' },
  { id: 'SUB-3F8B24', customer: 'TechStart Ltd', email: 'accounts@techstart.io', plan: 'Professional', amount: 199.00, interval: 'monthly', status: 'active', startDate: '2025-09-01', nextBilling: '2026-02-01', totalPaid: 995.00, paymentMethod: 'Mastercard •••• 8891' },
  { id: 'SUB-5D1C67', customer: 'Nordic Digital', email: 'finance@nordicdigital.se', plan: 'Enterprise', amount: 1499.00, interval: 'quarterly', status: 'active', startDate: '2025-10-10', nextBilling: '2026-04-10', totalPaid: 2998.00, paymentMethod: 'SEPA Direct Debit' },
  { id: 'SUB-9E4F38', customer: 'Sarah Brown Consulting', email: 'sarah@sbconsulting.co.uk', plan: 'Starter', amount: 49.00, interval: 'monthly', status: 'past_due', startDate: '2025-11-20', nextBilling: '2026-01-20', totalPaid: 98.00, paymentMethod: 'Visa •••• 1234' },
  { id: 'SUB-2B7A45', customer: 'GreenLeaf Wellness', email: 'payments@greenleaf.com', plan: 'Professional', amount: 199.00, interval: 'monthly', status: 'paused', startDate: '2025-07-01', nextBilling: '-', totalPaid: 1194.00, paymentMethod: 'Mastercard •••• 5678' },
  { id: 'SUB-8C3D19', customer: 'Blue Ocean Media', email: 'admin@blueocean.media', plan: 'Professional', amount: 149.00, interval: 'monthly', status: 'active', startDate: '2025-12-01', nextBilling: '2026-02-01', totalPaid: 298.00, paymentMethod: 'Visa •••• 9012' },
  { id: 'SUB-6A9E72', customer: 'DataFlow Analytics', email: 'billing@dataflow.ai', plan: 'Enterprise', amount: 4999.00, interval: 'yearly', status: 'active', startDate: '2025-08-15', nextBilling: '2026-08-15', totalPaid: 4999.00, paymentMethod: 'Bank Transfer' },
  { id: 'SUB-1F5B83', customer: 'Mike Johnson', email: 'mike@example.com', plan: 'Starter', amount: 49.00, interval: 'monthly', status: 'cancelled', startDate: '2025-10-01', nextBilling: '-', totalPaid: 147.00, paymentMethod: 'Amex •••• 3782' },
  { id: 'SUB-4D2E96', customer: 'Luxe Retail Group', email: 'finance@luxeretail.com', plan: 'Enterprise', amount: 499.00, interval: 'monthly', status: 'trialing', startDate: '2026-01-10', nextBilling: '2026-02-10', totalPaid: 0, paymentMethod: 'Visa •••• 6543' },
];

const mockPlans = [
  { name: 'Starter', price: 49, interval: 'monthly' as SubInterval, subscribers: 2, features: ['Up to 100 transactions/mo', 'Basic analytics', 'Email support'] },
  { name: 'Professional', price: 199, interval: 'monthly' as SubInterval, subscribers: 3, features: ['Up to 1,000 transactions/mo', 'Advanced analytics', 'Priority support', 'API access'] },
  { name: 'Enterprise', price: 499, interval: 'monthly' as SubInterval, subscribers: 4, features: ['Unlimited transactions', 'Custom analytics', 'Dedicated account manager', 'SLA guarantee', 'Custom integrations'] },
];

const statusConfig: Record<SubStatus, { label: string; class: string }> = {
  active: { label: 'Active', class: 'completed' },
  paused: { label: 'Paused', class: 'pending' },
  cancelled: { label: 'Cancelled', class: 'failed' },
  past_due: { label: 'Past Due', class: 'failed' },
  trialing: { label: 'Trial', class: 'processing' },
};

export function SubscriptionManagementPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<SubStatus | 'all'>('all');
  const [planFilter, setPlanFilter] = useState<string>('all');
  const [selectedSub, setSelectedSub] = useState<Subscriber | null>(null);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState<'pause' | 'resume' | 'cancel' | 'refund' | null>(null);

  const formatCurrency = (amount: number) => `\u00A3${amount.toLocaleString('en-GB', { minimumFractionDigits: 2 })}`;

  const filteredSubscribers = mockSubscribers.filter(sub => {
    const matchesSearch =
      sub.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || sub.status === statusFilter;
    const matchesPlan = planFilter === 'all' || sub.plan === planFilter;
    return matchesSearch && matchesStatus && matchesPlan;
  });

  const activeCount = mockSubscribers.filter(s => s.status === 'active').length;
  const mrr = mockSubscribers
    .filter(s => s.status === 'active' || s.status === 'trialing')
    .reduce((sum, s) => {
      if (s.interval === 'yearly') return sum + s.amount / 12;
      if (s.interval === 'quarterly') return sum + s.amount / 3;
      if (s.interval === 'weekly') return sum + s.amount * 4.33;
      return sum + s.amount;
    }, 0);
  const totalLifetimeRevenue = mockSubscribers.reduce((sum, s) => sum + s.totalPaid, 0);
  const churnCount = mockSubscribers.filter(s => s.status === 'cancelled').length;

  const openAction = (sub: Subscriber, action: 'pause' | 'resume' | 'cancel' | 'refund') => {
    setSelectedSub(sub);
    setActionType(action);
    setShowActionModal(true);
  };

  const handleConfirmAction = () => {
    alert(`${actionType?.charAt(0).toUpperCase()}${actionType?.slice(1)} action confirmed for ${selectedSub?.customer}`);
    setShowActionModal(false);
    setSelectedSub(null);
    setActionType(null);
  };

  const getActionLabel = () => {
    switch (actionType) {
      case 'pause': return 'Pause Subscription';
      case 'resume': return 'Resume Subscription';
      case 'cancel': return 'Cancel Subscription';
      case 'refund': return 'Issue Refund';
      default: return '';
    }
  };

  return (
    <DashboardLayout>
      <div className="hp-dash__page-header">
        <h1 className="hp-dash__page-title">Subscription Management</h1>
      </div>

      {/* Summary Metrics */}
      <div className="hp-dash__metrics">
        <div className="hp-dash__metric-card">
          <span className="hp-dash__metric-label">Active Subscribers</span>
          <span className="hp-dash__metric-value">{activeCount}</span>
          <span className="hp-dash__metric-sub">{mockSubscribers.length} total</span>
        </div>
        <div className="hp-dash__metric-card">
          <span className="hp-dash__metric-label">Monthly Recurring Revenue</span>
          <span className="hp-dash__metric-value">{formatCurrency(mrr)}</span>
          <span className="hp-dash__metric-sub">MRR</span>
        </div>
        <div className="hp-dash__metric-card">
          <span className="hp-dash__metric-label">Lifetime Revenue</span>
          <span className="hp-dash__metric-value">{formatCurrency(totalLifetimeRevenue)}</span>
          <span className="hp-dash__metric-sub">All subscribers</span>
        </div>
        <div className="hp-dash__metric-card hp-dash__metric-card--warn">
          <span className="hp-dash__metric-label">Churn</span>
          <span className="hp-dash__metric-value">{churnCount}</span>
          <span className="hp-dash__metric-sub">{mockSubscribers.filter(s => s.status === 'past_due').length} past due</span>
        </div>
      </div>

      {/* Plans Overview */}
      <section className="hp-dash__card-section">
        <span className="hp-dash__section-label">Your Plans</span>
        <div className="hp-dash__sub-plans-grid">
          {mockPlans.map((plan) => (
            <div key={plan.name} className="hp-dash__sub-plan-card">
              <div className="hp-dash__sub-plan-header">
                <h4 className="hp-dash__sub-plan-name">{plan.name}</h4>
                <span className="hp-dash__sub-plan-subs">{plan.subscribers} subscribers</span>
              </div>
              <div className="hp-dash__sub-plan-price">
                <span className="hp-dash__sub-plan-amount">{formatCurrency(plan.price)}</span>
                <span className="hp-dash__text-muted">/{plan.interval}</span>
              </div>
              <ul className="hp-dash__sub-plan-features">
                {plan.features.map((f, i) => (
                  <li key={i}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--hp-green)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                    {f}
                  </li>
                ))}
              </ul>
              <button className="hp-dash__btn-outline hp-dash__btn-sm" style={{ width: '100%', justifyContent: 'center' }}>Edit Plan</button>
            </div>
          ))}
        </div>
      </section>

      {/* Filters */}
      <section className="hp-dash__filters">
        <div className="hp-dash__search-box">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Search by name, email, or subscription ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="hp-dash__search-input"
          />
        </div>
        <div className="hp-dash__filter-row">
          <div className="hp-dash__field hp-dash__field--inline">
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as SubStatus | 'all')}>
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="past_due">Past Due</option>
              <option value="trialing">Trial</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div className="hp-dash__field hp-dash__field--inline">
            <select value={planFilter} onChange={(e) => setPlanFilter(e.target.value)}>
              <option value="all">All Plans</option>
              <option value="Starter">Starter</option>
              <option value="Professional">Professional</option>
              <option value="Enterprise">Enterprise</option>
            </select>
          </div>
          <button className="hp-dash__btn-outline hp-dash__btn-sm">Export CSV</button>
        </div>
      </section>

      {/* Subscribers Table */}
      <section className="hp-dash__transactions">
        <div className="hp-dash__section-header" style={{ marginBottom: 16 }}>
          <span className="hp-dash__section-label">Subscribers ({filteredSubscribers.length})</span>
        </div>
        <div className="hp-dash__table-wrap">
          <table className="hp-dash__table">
            <thead>
              <tr>
                <th>Subscriber</th>
                <th>Plan</th>
                <th>Amount</th>
                <th>Next Billing</th>
                <th>Total Paid</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSubscribers.map((sub) => {
                const sc = statusConfig[sub.status];
                return (
                  <tr key={sub.id}>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <span style={{ fontWeight: 600 }}>{sub.customer}</span>
                        <span className="hp-dash__text-muted" style={{ fontSize: '0.72rem' }}>{sub.email}</span>
                        <span className="hp-dash__txn-id" style={{ fontSize: '0.68rem' }}>{sub.id}</span>
                      </div>
                    </td>
                    <td>
                      <span className="hp-dash__sub-plan-badge">{sub.plan}</span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <span style={{ fontWeight: 600 }}>{formatCurrency(sub.amount)}</span>
                        <span className="hp-dash__text-muted" style={{ fontSize: '0.68rem' }}>/{sub.interval}</span>
                      </div>
                    </td>
                    <td>{sub.nextBilling}</td>
                    <td style={{ fontWeight: 600 }}>{formatCurrency(sub.totalPaid)}</td>
                    <td><span className={`hp-dash__status hp-dash__status--${sc.class}`}>{sc.label}</span></td>
                    <td>
                      <div className="hp-dash__sub-actions">
                        {sub.status === 'active' && (
                          <>
                            <button className="hp-dash__sub-action-btn" onClick={() => openAction(sub, 'pause')} title="Pause">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></svg>
                            </button>
                            <button className="hp-dash__sub-action-btn hp-dash__sub-action-btn--danger" onClick={() => openAction(sub, 'cancel')} title="Cancel">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                            </button>
                          </>
                        )}
                        {sub.status === 'paused' && (
                          <button className="hp-dash__sub-action-btn hp-dash__sub-action-btn--green" onClick={() => openAction(sub, 'resume')} title="Resume">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                          </button>
                        )}
                        {sub.status === 'past_due' && (
                          <button className="hp-dash__sub-action-btn" onClick={() => openAction(sub, 'cancel')} title="Cancel">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                          </button>
                        )}
                        {(sub.status === 'active' || sub.status === 'past_due') && sub.totalPaid > 0 && (
                          <button className="hp-dash__sub-action-btn" onClick={() => openAction(sub, 'refund')} title="Refund last payment">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 102.13-9.36L1 10" /></svg>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filteredSubscribers.length === 0 && (
          <div className="hp-dash__empty">
            <p>No subscribers found matching your filters.</p>
          </div>
        )}
      </section>

      {/* Action Modal */}
      {showActionModal && selectedSub && (
        <div className="hp-dash__modal-overlay" onClick={() => setShowActionModal(false)}>
          <div className="hp-dash__modal" onClick={(e) => e.stopPropagation()}>
            <div className="hp-dash__modal-header">
              <h3>{getActionLabel()}</h3>
              <button className="hp-dash__modal-close" onClick={() => setShowActionModal(false)}>&times;</button>
            </div>
            <div className="hp-dash__modal-body">
              <div className="hp-dash__sub-modal-detail">
                <div className="hp-dash__sub-modal-row">
                  <span className="hp-dash__metric-label">Subscriber</span>
                  <span>{selectedSub.customer}</span>
                </div>
                <div className="hp-dash__sub-modal-row">
                  <span className="hp-dash__metric-label">Email</span>
                  <span className="hp-dash__text-muted">{selectedSub.email}</span>
                </div>
                <div className="hp-dash__sub-modal-row">
                  <span className="hp-dash__metric-label">Plan</span>
                  <span>{selectedSub.plan} — {formatCurrency(selectedSub.amount)}/{selectedSub.interval}</span>
                </div>
                <div className="hp-dash__sub-modal-row">
                  <span className="hp-dash__metric-label">Total Paid</span>
                  <span>{formatCurrency(selectedSub.totalPaid)}</span>
                </div>
              </div>

              {actionType === 'cancel' && (
                <div className="hp-dash__alert hp-dash__alert--error" style={{ marginTop: 16 }}>
                  <span className="hp-dash__alert-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
                  </span>
                  <span>This will immediately cancel the subscription. The customer will lose access at the end of their current billing period.</span>
                </div>
              )}

              {actionType === 'pause' && (
                <div className="hp-dash__alert hp-dash__alert--info" style={{ marginTop: 16 }}>
                  <span className="hp-dash__alert-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                  </span>
                  <span>Billing will be paused. The customer retains access but will not be charged until resumed.</span>
                </div>
              )}

              {actionType === 'refund' && (
                <div className="hp-dash__alert hp-dash__alert--info" style={{ marginTop: 16 }}>
                  <span className="hp-dash__alert-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 102.13-9.36L1 10" /></svg>
                  </span>
                  <span>This will refund the most recent payment of {formatCurrency(selectedSub.amount)} to the customer's original payment method.</span>
                </div>
              )}

              {actionType === 'resume' && (
                <div className="hp-dash__alert hp-dash__alert--success" style={{ marginTop: 16 }}>
                  <span className="hp-dash__alert-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                  </span>
                  <span>Billing will resume immediately. The next charge will be on the original billing date.</span>
                </div>
              )}
            </div>
            <div className="hp-dash__modal-footer">
              <button className="hp-dash__modal-cancel" onClick={() => setShowActionModal(false)}>Cancel</button>
              <button
                className={`hp-dash__modal-send${actionType === 'cancel' ? ' hp-dash__modal-send--danger' : ''}`}
                onClick={handleConfirmAction}
              >
                {getActionLabel()}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
