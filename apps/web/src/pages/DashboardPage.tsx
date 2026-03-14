import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { DashboardLayout } from '../components/layout/DashboardLayout';

type Currency = 'GBP' | 'EUR' | 'USD' | 'AED';

const currencySymbols: Record<Currency, string> = { GBP: '\u00A3', EUR: '\u20AC', USD: '$', AED: '\u062F.\u0625' };

const mockBalances: Record<Currency, number> = { GBP: 124580.50, EUR: 145230.75, USD: 158420.00, AED: 582150.25 };
const mockEscrowTotal: Record<Currency, number> = { GBP: 8700.50, EUR: 3200.00, USD: 5400.00, AED: 12500.00 };

const mockMetrics = {
  totalProcessed: 1245890.00,
  currentAccount: 124580.50,
  nextScheduledPayment: 15420.00,
  nextPaymentDate: '2026-01-20',
  openChargebacks: 3,
  chargebackAmount: 2450.00,
};

const mockAlerts = [
  { id: 1, type: 'error' as const, message: 'Chargeback CB-2024-001 requires response by Jan 18, 2026' },
  { id: 2, type: 'info' as const, message: 'Scheduled payout of \u00A315,420.00 on Jan 20, 2026' },
  { id: 3, type: 'success' as const, message: 'KYC verification approved' },
];

const mockTransactions = [
  { id: 'TXN-4E8F21', date: '2026-01-15', amount: 1250.00, currency: 'GBP' as Currency, status: 'completed' as const, customer: 'John Smith' },
  { id: 'TXN-7B3A94', date: '2026-01-15', amount: 890.50, currency: 'GBP' as Currency, status: 'completed' as const, customer: 'Emma Wilson' },
  { id: 'TXN-2C9D56', date: '2026-01-14', amount: 2100.00, currency: 'EUR' as Currency, status: 'pending' as const, customer: 'Hans Mueller' },
  { id: 'TXN-1A6E83', date: '2026-01-14', amount: 450.00, currency: 'GBP' as Currency, status: 'completed' as const, customer: 'Sarah Brown' },
  { id: 'TXN-9F4B72', date: '2026-01-13', amount: 3200.00, currency: 'USD' as Currency, status: 'failed' as const, customer: 'Mike Johnson' },
];

const mockMessages = [
  { id: 1, from: 'MTRX Support', subject: 'Welcome to MTRX Pay', preview: 'Thank you for joining MTRX Pay. Your account has been...', date: '2026-01-15', read: true },
  { id: 2, from: 'Compliance Team', subject: 'Document Request', preview: 'Please upload the following documents to complete your...', date: '2026-01-14', read: false },
  { id: 3, from: 'MTRX Support', subject: 'Payout Schedule Update', preview: 'Your payout schedule has been updated. Next payout...', date: '2026-01-12', read: true },
];

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
  book: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 016.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
    </svg>
  ),
  star: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
};

export function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>('GBP');
  const [showCompose, setShowCompose] = useState(false);
  const [newMessage, setNewMessage] = useState({ to: 'support', subject: '', body: '' });

  const formatCurrency = (amount: number, currency: Currency = selectedCurrency) => {
    return `${currencySymbols[currency]}${amount.toLocaleString('en-GB', { minimumFractionDigits: 2 })}`;
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
  const today = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <DashboardLayout>
      {/* Header */}
      <header className="hp-dash__header">
        <div>
          <h1 className="hp-dash__welcome">{getGreeting()}, {user?.firstName}</h1>
          <p className="hp-dash__date">{today}</p>
        </div>
        <button className="hp-dash__bell" aria-label="Notifications">
          {icons.bell}
          {unreadCount > 0 && <span className="hp-dash__bell-dot" />}
        </button>
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

      {/* Metrics Grid */}
      <section className="hp-dash__metrics">
        <div className="hp-dash__metric-card">
          <div className="hp-dash__metric-icon">{icons.wallet}</div>
          <span className="hp-dash__metric-label">Current Account</span>
          <span className="hp-dash__metric-value">{formatCurrency(mockMetrics.currentAccount, selectedCurrency)}</span>
        </div>
        <div className="hp-dash__metric-card">
          <div className="hp-dash__metric-icon">{icons.calendar}</div>
          <span className="hp-dash__metric-label">Next Payout</span>
          <span className="hp-dash__metric-value">{formatCurrency(mockMetrics.nextScheduledPayment, selectedCurrency)}</span>
          <span className="hp-dash__metric-sub">{mockMetrics.nextPaymentDate}</span>
        </div>
        <div className="hp-dash__metric-card">
          <div className="hp-dash__metric-icon">{icons.wallet}</div>
          <span className="hp-dash__metric-label">In Escrow</span>
          <span className="hp-dash__metric-value">{formatCurrency(mockEscrowTotal[selectedCurrency])}</span>
          <span className="hp-dash__metric-sub">72hr hold period</span>
        </div>
        <div className="hp-dash__metric-card hp-dash__metric-card--action" onClick={() => navigate('/payouts')}>
          <div className="hp-dash__metric-icon">{icons.chart}</div>
          <span className="hp-dash__metric-label">Request Payout</span>
          <span className="hp-dash__metric-value">Withdraw</span>
          <span className="hp-dash__metric-sub">To your bank account</span>
        </div>
      </section>

      {/* Alerts */}
      <section className="hp-dash__alerts">
        <span className="hp-dash__section-label">Alerts</span>
        <div className="hp-dash__alerts-list">
          {mockAlerts.map((a) => (
            <div key={a.id} className={`hp-dash__alert hp-dash__alert--${a.type}`}>
              <span className="hp-dash__alert-icon">
                {a.type === 'error' && icons.alertTriangle}
                {a.type === 'info' && icons.bell}
                {a.type === 'success' && icons.shield}
              </span>
              <span>{a.message}</span>
            </div>
          ))}
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
          <div className="hp-dash__action-card" onClick={() => navigate('/help')}>
            <div className="hp-dash__action-icon">{icons.book}</div>
            <h4 className="hp-dash__action-title">Help & API</h4>
            <p className="hp-dash__action-desc">Documentation and developer API</p>
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
                  <td>{txn.date}</td>
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
      <section className="hp-dash__inbox">
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
                  <span className="hp-dash__msg-date">{msg.date}</span>
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
