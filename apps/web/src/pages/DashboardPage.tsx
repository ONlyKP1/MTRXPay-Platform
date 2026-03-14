import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { StatusBadge } from '../components/common/StatusBadge';
import { RevenueChart } from '../components/dashboard/RevenueChart';
import { useHealth, useMe, useOnboardingStatus } from '../hooks/useApiQueries';
import type { OnboardingStep } from '../services/api';

type Currency = 'GBP' | 'EUR' | 'USD' | 'AED';
type DateRange = '1d' | '7d' | '30d' | '90d';

const currencyLocales: Record<Currency, string> = { GBP: 'en-GB', EUR: 'de-DE', USD: 'en-US', AED: 'ar-AE' };

const mockBalances: Record<Currency, number> = { GBP: 31_842.75, EUR: 27_615.40, USD: 42_390.20, AED: 156_720.80 };
const mockEscrowTotal: Record<Currency, number> = { GBP: 4_275.30, EUR: 1_840.60, USD: 3_120.50, AED: 8_945.00 };

const mockMetrics = {
  totalProcessed: 284_610.45,
  nextScheduledPayment: 8_240.00,
  nextPaymentDate: '2026-03-18',
};

/* ── Generate 90 days of deterministic mock revenue ── */
function generateRevenueData(days: number) {
  const data: { label: string; amount: number; date: string }[] = [];
  const today = new Date('2026-03-14');
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    // Deterministic pseudo-random based on day-of-year
    const seed = d.getFullYear() * 1000 + d.getMonth() * 31 + d.getDate();
    const amount = 1200 + ((seed * 7919) % 5800);
    const dayName = d.toLocaleDateString('en-GB', { weekday: 'short' });
    const dateLabel = d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
    data.push({ label: days <= 7 ? dayName : dateLabel, amount, date: d.toISOString().slice(0, 10) });
  }
  return data;
}

const allRevenueData = generateRevenueData(90);
const todaysRevenue = allRevenueData[allRevenueData.length - 1].amount;

const dateRangeOptions: { value: DateRange; label: string }[] = [
  { value: '1d', label: 'Today' },
  { value: '7d', label: '7d' },
  { value: '30d', label: '30d' },
  { value: '90d', label: '90d' },
];

const mockKPIs = [
  { label: 'Success Rate', value: '97.3%', variant: 'green' as const },
  { label: 'Avg Transaction', value: '£708.60', variant: null },
  { label: 'Chargeback Rate', value: '0.4%', variant: 'green' as const },
  { label: 'Active Customers', value: '1,247', variant: null },
];

const mockAlerts = [
  { id: 1, type: 'error' as const, message: 'Chargeback CB-2026-014 requires response by 19 Mar 2026' },
  { id: 2, type: 'info' as const, message: 'Scheduled payout of £8,240.00 on 18 Mar 2026' },
  { id: 3, type: 'success' as const, message: 'KYC verification approved' },
];

const mockTransactions = [
  { id: 'TXN-4E8F21', date: '2026-03-14', amount: 1_475.00, currency: 'GBP' as Currency, status: 'completed' as const, customer: 'John Smith' },
  { id: 'TXN-7B3A94', date: '2026-03-13', amount: 642.80, currency: 'GBP' as Currency, status: 'completed' as const, customer: 'Emma Wilson' },
  { id: 'TXN-2C9D56', date: '2026-03-13', amount: 1_830.50, currency: 'EUR' as Currency, status: 'pending' as const, customer: 'Hans Mueller' },
  { id: 'TXN-1A6E83', date: '2026-03-12', amount: 385.20, currency: 'GBP' as Currency, status: 'completed' as const, customer: 'Sarah Brown' },
  { id: 'TXN-9F4B72', date: '2026-03-11', amount: 2_750.00, currency: 'USD' as Currency, status: 'failed' as const, customer: 'Mike Johnson' },
];

const mockMessages = [
  { id: 1, from: 'MTRX Support', subject: 'Welcome to MTRX Pay', preview: 'Thank you for joining MTRX Pay. Your account has been...', date: '2026-03-14', read: true },
  { id: 2, from: 'Compliance Team', subject: 'Document Request', preview: 'Please upload the following documents to complete your...', date: '2026-03-13', read: false },
  { id: 3, from: 'MTRX Support', subject: 'Payout Schedule Update', preview: 'Your payout schedule has been updated. Next payout...', date: '2026-03-10', read: true },
];

const formatDate = (iso: string) => {
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
};

/* ── Icons ── */
const icons = {
  chart: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  ),
  wallet: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h14a2 2 0 002-2v-5z" /><path d="M16 12a1 1 0 102 0 1 1 0 00-2 0z" />
    </svg>
  ),
  calendar: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  alertTriangle: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  bell: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 01-3.46 0" />
    </svg>
  ),
  shield: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  clipboard: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" /><rect x="9" y="3" width="6" height="4" rx="1" />
    </svg>
  ),
  creditCard: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="4" width="22" height="16" rx="2" /><line x1="1" y1="10" x2="23" y2="10" />
    </svg>
  ),
  star: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
  arrowUp: (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="6" y1="9" x2="6" y2="3" /><polyline points="3 5 6 2 9 5" />
    </svg>
  ),
  arrowDown: (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="6" y1="3" x2="6" y2="9" /><polyline points="3 7 6 10 9 7" />
    </svg>
  ),
};

export function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>('GBP');
  const [showCompose, setShowCompose] = useState(false);
  const [newMessage, setNewMessage] = useState({ to: 'support', subject: '', body: '' });
  const [dismissedAlerts, setDismissedAlerts] = useState<number[]>([]);
  const [dateRange, setDateRange] = useState<DateRange>('7d');

  /* ── React Query API calls ── */
  const { data: healthResult } = useHealth();
  const { data: meResult } = useMe();
  const { data: onboardingResult } = useOnboardingStatus();

  const health = healthResult?.data ?? null;
  const apiLive = healthResult?.live ?? false;
  const me = meResult?.data ?? null;
  const onboarding = onboardingResult?.data ?? null;

  const visibleAlerts = mockAlerts.filter(a => !dismissedAlerts.includes(a.id));

  /* ── Revenue data sliced by date range ── */
  const chartData = useMemo(() => {
    const daysMap: Record<DateRange, number> = { '1d': 1, '7d': 7, '30d': 30, '90d': 90 };
    const days = daysMap[dateRange];
    const sliced = allRevenueData.slice(-days);
    // For 7d, use day names; for 1d just show "Today"
    if (dateRange === '1d') return sliced.map(d => ({ ...d, label: 'Today' }));
    if (dateRange === '7d') return sliced;
    return sliced;
  }, [dateRange]);

  const formatCurrency = (amount: number, currency: Currency = selectedCurrency) => {
    return new Intl.NumberFormat(currencyLocales[currency], {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const handleSendMessage = () => {
    alert(`Message sent to ${newMessage.to}!`);
    setNewMessage({ to: 'support', subject: '', body: '' });
    setShowCompose(false);
  };

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const unreadCount = mockMessages.filter(m => !m.read).length;
  const now = new Date();
  const today = now.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const time = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

  return (
    <DashboardLayout unreadCount={unreadCount}>
      {/* Header */}
      <header className="hp-dash__header">
        <div>
          <h1 className="hp-dash__welcome">{getGreeting()}, {user?.firstName}</h1>
          <p className="hp-dash__date">{today} &middot; {time}</p>
        </div>
      </header>

      {/* Balance Card */}
      <section className="hp-dash__balance">
        <div className="hp-dash__balance-top">
          <span className="hp-dash__section-label">Available Balance</span>
          <div className="hp-dash__currency-selector">
            {(['GBP', 'EUR', 'USD', 'AED'] as Currency[]).map((c) => (
              <button
                key={c}
                className={`hp-dash__currency-btn${selectedCurrency === c ? ' hp-dash__currency-btn--active' : ''}`}
                onClick={() => setSelectedCurrency(c)}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
        <div className="hp-dash__balance-amount">
          {formatCurrency(mockBalances[selectedCurrency])}
        </div>
        <div className="hp-dash__balance-footer">
          <div className="hp-dash__balance-escrow">
            <span>In Escrow (72hr hold):</span>
            <span className="hp-dash__balance-escrow-val">{formatCurrency(mockEscrowTotal[selectedCurrency])}</span>
          </div>
          <div className="hp-dash__balance-processed">
            <span className="hp-dash__balance-processed-label">Total Processed</span>
            <span className="hp-dash__balance-processed-val">{formatCurrency(mockMetrics.totalProcessed, selectedCurrency)}</span>
          </div>
        </div>
      </section>

      {/* Status Row — Merchant, Onboarding, API Health */}
      <div className="hp-dash__status-row">
        <div className="hp-dash__status-card">
          <span className="hp-dash__status-card-label">Merchant Status</span>
          <div className="hp-dash__status-card-body">
            {me ? (
              <>
                <span className="hp-dash__status-card-value">{me.firstName} {me.lastName}</span>
                <span className="hp-dash__status-card-meta">{me.email}</span>
                <span className="hp-dash__status-card-meta">Role: {me.role}</span>
                <StatusBadge status={me.kycStatus === 'approved' ? 'approved' : 'pending'} />
              </>
            ) : (
              <span className="hp-dash__status-card-meta">Loading...</span>
            )}
          </div>
          {!apiLive && <span className="hp-dash__status-card-tag">Mock data</span>}
        </div>

        <div className="hp-dash__status-card">
          <span className="hp-dash__status-card-label">Onboarding Status</span>
          <div className="hp-dash__status-card-body">
            {onboarding ? (
              <>
                <StatusBadge status={onboarding.status as OnboardingStep} />
                <span className="hp-dash__status-card-meta">
                  Step {onboarding.completedSteps} of {onboarding.totalSteps}
                  {onboarding.currentStep && ` — ${onboarding.currentStep}`}
                </span>
                <div className="hp-dash__progress-bar-track" style={{ marginTop: 6 }}>
                  <div
                    className="hp-dash__progress-bar-fill"
                    style={{ width: `${(onboarding.completedSteps / onboarding.totalSteps) * 100}%` }}
                  />
                </div>
              </>
            ) : (
              <span className="hp-dash__status-card-meta">Loading...</span>
            )}
          </div>
          {!apiLive && <span className="hp-dash__status-card-tag">Mock data</span>}
        </div>

        <div className="hp-dash__status-card">
          <span className="hp-dash__status-card-label">API Health</span>
          <div className="hp-dash__status-card-body">
            {health ? (
              <>
                <span className={`hp-dash__health-dot hp-dash__health-dot--${health.status === 'ok' ? 'green' : health.status === 'degraded' ? 'gold' : 'red'}`} />
                <span className="hp-dash__status-card-value">
                  {apiLive ? 'Backend connected' : 'Using fallback data'}
                </span>
                <span className="hp-dash__status-card-meta">
                  {apiLive ? 'API online' : 'API offline — showing demo data'}
                </span>
                {health.version && (
                  <span className="hp-dash__status-card-meta">v{health.version}</span>
                )}
              </>
            ) : (
              <span className="hp-dash__status-card-meta">Checking...</span>
            )}
          </div>
        </div>
      </div>

      {/* Revenue Chart */}
      <section className="hp-dash__chart">
        <div className="hp-dash__chart-header">
          <span className="hp-dash__section-label">Revenue</span>
          <div className="hp-dash__range-selector">
            {dateRangeOptions.map((opt) => (
              <button
                key={opt.value}
                className={`hp-dash__range-btn${dateRange === opt.value ? ' hp-dash__range-btn--active' : ''}`}
                onClick={() => setDateRange(opt.value)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
        <RevenueChart
          data={chartData}
          formatCurrency={(amount) => formatCurrency(amount, 'GBP')}
        />
      </section>

      {/* Metrics Grid */}
      <section className="hp-dash__metrics">
        <div className="hp-dash__metric-card">
          <div className="hp-dash__metric-icon">{icons.wallet}</div>
          <span className="hp-dash__metric-label">Today's Revenue</span>
          <span className="hp-dash__metric-value">{formatCurrency(todaysRevenue, 'GBP')}</span>
          <span className="hp-dash__trend hp-dash__trend--up">{icons.arrowUp} 12%</span>
        </div>
        <div className="hp-dash__metric-card">
          <div className="hp-dash__metric-icon">{icons.calendar}</div>
          <span className="hp-dash__metric-label">Next Payout</span>
          <span className="hp-dash__metric-value">{formatCurrency(mockMetrics.nextScheduledPayment, selectedCurrency)}</span>
          <span className="hp-dash__metric-sub">{formatDate(mockMetrics.nextPaymentDate)}</span>
        </div>
        <div className="hp-dash__metric-card">
          <div className="hp-dash__metric-icon">{icons.wallet}</div>
          <span className="hp-dash__metric-label">In Escrow</span>
          <span className="hp-dash__metric-value">{formatCurrency(mockEscrowTotal[selectedCurrency])}</span>
          <span className="hp-dash__trend hp-dash__trend--down">{icons.arrowDown} 3%</span>
        </div>
        <div className="hp-dash__metric-card hp-dash__metric-card--action" onClick={() => navigate('/payouts')}>
          <div className="hp-dash__metric-icon">{icons.chart}</div>
          <span className="hp-dash__metric-label">Request Payout</span>
          <span className="hp-dash__metric-value">Withdraw</span>
          <span className="hp-dash__metric-sub">To your bank account</span>
        </div>
      </section>

      {/* KPI Row */}
      <div className="hp-dash__kpi-row">
        {mockKPIs.map((kpi) => (
          <div key={kpi.label} className="hp-dash__kpi-item">
            <span className="hp-dash__kpi-label">{kpi.label}</span>
            <span className={`hp-dash__kpi-value${kpi.variant ? ` hp-dash__kpi-value--${kpi.variant}` : ''}`}>
              {kpi.value}
            </span>
          </div>
        ))}
      </div>

      {/* Alerts */}
      <section className="hp-dash__alerts">
        <span className="hp-dash__section-label">
          Alerts
          {visibleAlerts.length > 0 && (
            <span className="hp-dash__alert-count">{visibleAlerts.length}</span>
          )}
        </span>
        <div className="hp-dash__alerts-list">
          {visibleAlerts.map((a) => (
            <div key={a.id} className={`hp-dash__alert hp-dash__alert--${a.type}`}>
              <span className="hp-dash__alert-icon">
                {a.type === 'error' && icons.alertTriangle}
                {a.type === 'info' && icons.bell}
                {a.type === 'success' && icons.shield}
              </span>
              <span>{a.message}</span>
              <button
                className="hp-dash__dismiss-btn"
                onClick={() => setDismissedAlerts(prev => [...prev, a.id])}
                aria-label="Dismiss alert"
              >
                &times;
              </button>
            </div>
          ))}
          {visibleAlerts.length === 0 && (
            <p style={{ color: 'var(--hp-text-muted)', fontSize: '0.85rem' }}>No active alerts.</p>
          )}
        </div>
      </section>

      {/* Quick Actions */}
      <section className="hp-dash__actions">
        <span className="hp-dash__section-label">Quick Actions</span>
        <div className="hp-dash__actions-grid">
          <div className="hp-dash__action-card" onClick={() => navigate('/transactions')}>
            <div className="hp-dash__action-icon">{icons.clipboard}</div>
            <h4 className="hp-dash__action-title">Transaction Data</h4>
            <p className="hp-dash__action-desc">View all transactions, search and export</p>
          </div>
          <div className="hp-dash__action-card" onClick={() => navigate('/compliance')}>
            <div className="hp-dash__action-icon">{icons.shield}</div>
            <h4 className="hp-dash__action-title">Compliance Centre</h4>
            <p className="hp-dash__action-desc">Manage compliance documents and status</p>
          </div>
          <div className="hp-dash__action-card" onClick={() => navigate('/payment-types')}>
            <div className="hp-dash__action-icon">{icons.creditCard}</div>
            <h4 className="hp-dash__action-title">Payment Types</h4>
            <p className="hp-dash__action-desc">Manage accepted payment methods</p>
          </div>
          <div className="hp-dash__action-card" onClick={() => navigate('/trust')}>
            <div className="hp-dash__action-icon">{icons.star}</div>
            <h4 className="hp-dash__action-title">Trust Score</h4>
            <p className="hp-dash__action-desc">Your current trust score and history</p>
            <div className="hp-dash__trust-bar">
              <div className="hp-dash__trust-fill" style={{ width: '85%' }} />
            </div>
            <span className="hp-dash__trust-label">85 / 100</span>
          </div>
        </div>
      </section>

      {/* Recent Transactions */}
      <section className="hp-dash__transactions">
        <div className="hp-dash__section-header">
          <span className="hp-dash__section-label">Recent Transactions</span>
          <button className="hp-dash__view-all" onClick={() => navigate('/transactions')}>View All &rarr;</button>
        </div>
        <div className="hp-dash__table-wrap">
          <table className="hp-dash__table">
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Date</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {mockTransactions.map((txn) => (
                <tr key={txn.id}>
                  <td className="hp-dash__txn-id">{txn.id}</td>
                  <td>{formatDate(txn.date)}</td>
                  <td>{txn.customer}</td>
                  <td>{formatCurrency(txn.amount, txn.currency)}</td>
                  <td><span className={`hp-dash__status hp-dash__status--${txn.status}`}>{txn.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Inbox */}
      <section className="hp-dash__inbox" id="dashboard-inbox">
        <div className="hp-dash__section-header">
          <span className="hp-dash__section-label">
            Inbox{unreadCount > 0 && <span className="hp-dash__unread-count">{unreadCount}</span>}
          </span>
          <button className="hp-dash__compose-btn" onClick={() => setShowCompose(true)}>+ Compose</button>
        </div>
        <div className="hp-dash__messages">
          {mockMessages.map((msg) => (
            <div key={msg.id} className={`hp-dash__msg${!msg.read ? ' hp-dash__msg--unread' : ''}`}>
              {!msg.read && <span className="hp-dash__msg-dot" />}
              <div className="hp-dash__msg-body">
                <div className="hp-dash__msg-top">
                  <span className="hp-dash__msg-from">{msg.from}</span>
                  <span className="hp-dash__msg-date">{formatDate(msg.date)}</span>
                </div>
                <div className="hp-dash__msg-subject">{msg.subject}</div>
                <div className="hp-dash__msg-preview">{msg.preview}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Compose Modal */}
      {showCompose && (
        <div className="hp-dash__modal-overlay" onClick={() => setShowCompose(false)}>
          <div className="hp-dash__modal" onClick={(e) => e.stopPropagation()}>
            <div className="hp-dash__modal-header">
              <h3>New Message</h3>
              <button className="hp-dash__modal-close" onClick={() => setShowCompose(false)}>&times;</button>
            </div>
            <div className="hp-dash__modal-body">
              <div className="hp-dash__field">
                <label>To</label>
                <select value={newMessage.to} onChange={(e) => setNewMessage({ ...newMessage, to: e.target.value })}>
                  <option value="support">MTRX Support</option>
                  <option value="compliance">Compliance Team</option>
                  <option value="finance">Finance Team</option>
                </select>
              </div>
              <div className="hp-dash__field">
                <label>Subject</label>
                <input type="text" value={newMessage.subject} onChange={(e) => setNewMessage({ ...newMessage, subject: e.target.value })} placeholder="Enter subject..." />
              </div>
              <div className="hp-dash__field">
                <label>Message</label>
                <textarea value={newMessage.body} onChange={(e) => setNewMessage({ ...newMessage, body: e.target.value })} placeholder="Write your message..." rows={6} />
              </div>
            </div>
            <div className="hp-dash__modal-footer">
              <button className="hp-dash__modal-cancel" onClick={() => setShowCompose(false)}>Cancel</button>
              <button className="hp-dash__modal-send" onClick={handleSendMessage}>Send Message</button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
