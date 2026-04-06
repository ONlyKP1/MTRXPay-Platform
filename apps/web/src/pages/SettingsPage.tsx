import { useState } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { StatusBadge } from '../components/common/StatusBadge';

type SettingsTab = 'profile' | 'bank' | 'security' | 'notifications' | 'api';

const tabs: { key: SettingsTab; label: string }[] = [
  { key: 'profile', label: 'Business Profile' },
  { key: 'bank', label: 'Bank Accounts' },
  { key: 'security', label: 'Security' },
  { key: 'notifications', label: 'Notifications' },
  { key: 'api', label: 'API Keys' },
];

const MOCK_KEYS = {
  publishable: 'pk_live_mtrx_a1b2c3d4e5f6g7h8',
  secret: 'sk_live_mtrx_x9y8z7w6v5u4t3s2',
  webhook: 'whsec_mtrx_q1w2e3r4t5y6u7i8',
};

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [saved, setSaved] = useState(false);
  const [showSecret, setShowSecret] = useState(false);
  const [showWebhookSecret, setShowWebhookSecret] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [showRollConfirm, setShowRollConfirm] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const copyKey = (key: string, label: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(label);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <DashboardLayout>
      <div className="hp-dash__page-header">
        <h1 className="hp-dash__page-title">Settings</h1>
      </div>

      {/* Tab Navigation */}
      <div className="hp-settings__tabs">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={`hp-settings__tab${activeTab === tab.key ? ' hp-settings__tab--active' : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="hp-settings__content">
        {activeTab === 'profile' && (
          <div className="hp-settings__section">
            <div className="hp-settings__card">
              <h3 className="hp-settings__card-title">Business Information</h3>
              <p className="hp-settings__card-desc">Update your business details. Changes may require re-verification.</p>
              <div className="hp-settings__form-grid">
                <div className="hp-settings__field">
                  <label>Business Name</label>
                  <input type="text" defaultValue="Acme Digital Ltd" />
                </div>
                <div className="hp-settings__field">
                  <label>Trading Name</label>
                  <input type="text" defaultValue="Acme Digital" />
                </div>
                <div className="hp-settings__field">
                  <label>Registration Number</label>
                  <input type="text" defaultValue="12345678" />
                </div>
                <div className="hp-settings__field">
                  <label>VAT Number</label>
                  <input type="text" defaultValue="GB123456789" />
                </div>
                <div className="hp-settings__field hp-settings__field--full">
                  <label>Business Address</label>
                  <input type="text" defaultValue="123 Commerce Street, London, EC2A 1NT" />
                </div>
                <div className="hp-settings__field">
                  <label>Website</label>
                  <input type="url" defaultValue="https://acmedigital.co.uk" />
                </div>
                <div className="hp-settings__field">
                  <label>Industry</label>
                  <input type="text" defaultValue="SaaS & Technology" disabled />
                </div>
              </div>
            </div>
            <div className="hp-settings__card">
              <h3 className="hp-settings__card-title">Primary Contact</h3>
              <div className="hp-settings__form-grid">
                <div className="hp-settings__field">
                  <label>Full Name</label>
                  <input type="text" defaultValue="Peter Watt" />
                </div>
                <div className="hp-settings__field">
                  <label>Email</label>
                  <input type="email" defaultValue="admin@mtrxpay.com" />
                </div>
                <div className="hp-settings__field">
                  <label>Phone</label>
                  <input type="tel" defaultValue="+44 7700 900000" />
                </div>
                <div className="hp-settings__field">
                  <label>Role</label>
                  <input type="text" defaultValue="Director" />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'bank' && (
          <div className="hp-settings__section">
            <div className="hp-settings__card">
              <h3 className="hp-settings__card-title">Bank Accounts</h3>
              <p className="hp-settings__card-desc">Manage your settlement bank accounts. Settlements are processed to verified accounts only.</p>
              <div className="hp-settings__bank-list">
                <div className="hp-settings__bank-item">
                  <div className="hp-settings__bank-info">
                    <span className="hp-settings__bank-name">Barclays Business</span>
                    <span className="hp-settings__bank-details">Sort: 20-45-78 | Acc: ****4821</span>
                    <span className="hp-settings__bank-currency">GBP</span>
                  </div>
                  <div className="hp-settings__bank-actions">
                    <StatusBadge status="approved" />
                    <span className="hp-settings__bank-primary">Primary</span>
                  </div>
                </div>
                <div className="hp-settings__bank-item">
                  <div className="hp-settings__bank-info">
                    <span className="hp-settings__bank-name">Deutsche Bank</span>
                    <span className="hp-settings__bank-details">IBAN: DE89 ****7733</span>
                    <span className="hp-settings__bank-currency">EUR</span>
                  </div>
                  <div className="hp-settings__bank-actions">
                    <StatusBadge status="approved" />
                  </div>
                </div>
              </div>
              <button className="hp-settings__add-btn">+ Add Bank Account</button>
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="hp-settings__section">
            <div className="hp-settings__card">
              <h3 className="hp-settings__card-title">Password</h3>
              <p className="hp-settings__card-desc">Change your account password. You will be required to sign in again.</p>
              <div className="hp-settings__form-grid">
                <div className="hp-settings__field">
                  <label>Current Password</label>
                  <input type="password" placeholder="Enter current password" />
                </div>
                <div className="hp-settings__field">
                  <label>New Password</label>
                  <input type="password" placeholder="Enter new password" />
                </div>
              </div>
            </div>
            <div className="hp-settings__card">
              <h3 className="hp-settings__card-title">Two-Factor Authentication</h3>
              <p className="hp-settings__card-desc">Add an extra layer of security to your account.</p>
              <div className="hp-settings__2fa-status">
                <StatusBadge status="approved" />
                <span>Enabled via Authenticator App</span>
              </div>
              <button className="hp-settings__btn-outline">Reconfigure 2FA</button>
            </div>
            <div className="hp-settings__card">
              <h3 className="hp-settings__card-title">Active Sessions</h3>
              <div className="hp-settings__session-list">
                <div className="hp-settings__session">
                  <div>
                    <span className="hp-settings__session-device">Chrome on macOS</span>
                    <span className="hp-settings__session-meta">London, UK &middot; Current session</span>
                  </div>
                  <StatusBadge status="active" size="sm" />
                </div>
                <div className="hp-settings__session">
                  <div>
                    <span className="hp-settings__session-device">Safari on iPhone</span>
                    <span className="hp-settings__session-meta">London, UK &middot; 2 hours ago</span>
                  </div>
                  <button className="hp-settings__btn-text-red">Revoke</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="hp-settings__section">
            <div className="hp-settings__card">
              <h3 className="hp-settings__card-title">Email Notifications</h3>
              <p className="hp-settings__card-desc">Choose which notifications you receive by email.</p>
              <div className="hp-settings__toggle-list">
                {[
                  { label: 'Successful payments', desc: 'Receive an email for each completed payment', defaultOn: true },
                  { label: 'Failed payments', desc: 'Get alerted when a payment fails', defaultOn: true },
                  { label: 'Payout settlements', desc: 'Notification when funds are settled to your bank', defaultOn: true },
                  { label: 'Chargeback alerts', desc: 'Immediate notification of new chargebacks', defaultOn: true },
                  { label: 'Weekly summary', desc: 'Weekly overview of revenue and performance', defaultOn: false },
                  { label: 'Marketing updates', desc: 'Product updates and new feature announcements', defaultOn: false },
                ].map((item) => (
                  <ToggleRow key={item.label} label={item.label} desc={item.desc} defaultOn={item.defaultOn} />
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'api' && (
          <div className="hp-settings__section">
            <div className="hp-settings__card">
              <h3 className="hp-settings__card-title">API Keys</h3>
              <p className="hp-settings__card-desc">Manage your API keys for integration. Never share your secret key.</p>
              <div className="hp-settings__api-keys">
                <div className="hp-settings__api-key">
                  <span className="hp-settings__api-key-label">Publishable Key</span>
                  <div className="hp-settings__api-key-value">
                    <code>{MOCK_KEYS.publishable}</code>
                    <button className="hp-settings__copy-btn" onClick={() => copyKey(MOCK_KEYS.publishable, 'pub')}>
                      {copiedKey === 'pub' ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>
                <div className="hp-settings__api-key">
                  <span className="hp-settings__api-key-label">Secret Key</span>
                  <div className="hp-settings__api-key-value">
                    <code>{showSecret ? MOCK_KEYS.secret : 'sk_live_mtrx_\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022'}</code>
                    <button className="hp-settings__copy-btn" onClick={() => showSecret ? copyKey(MOCK_KEYS.secret, 'sec') : setShowSecret(true)}>
                      {showSecret ? (copiedKey === 'sec' ? 'Copied!' : 'Copy') : 'Reveal'}
                    </button>
                    {showSecret && <button className="hp-settings__copy-btn" onClick={() => setShowSecret(false)}>Hide</button>}
                  </div>
                </div>
                <div className="hp-settings__api-key">
                  <span className="hp-settings__api-key-label">Webhook Secret</span>
                  <div className="hp-settings__api-key-value">
                    <code>{showWebhookSecret ? MOCK_KEYS.webhook : 'whsec_mtrx_\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022'}</code>
                    <button className="hp-settings__copy-btn" onClick={() => showWebhookSecret ? copyKey(MOCK_KEYS.webhook, 'wh') : setShowWebhookSecret(true)}>
                      {showWebhookSecret ? (copiedKey === 'wh' ? 'Copied!' : 'Copy') : 'Reveal'}
                    </button>
                    {showWebhookSecret && <button className="hp-settings__copy-btn" onClick={() => setShowWebhookSecret(false)}>Hide</button>}
                  </div>
                </div>
              </div>
              <button className="hp-settings__btn-outline hp-settings__btn-outline--danger" style={{ marginTop: 16 }} onClick={() => setShowRollConfirm(true)}>Roll API Keys</button>

              {showRollConfirm && (
                <div className="hp-dash__modal-overlay" onClick={() => setShowRollConfirm(false)}>
                  <div className="hp-dash__modal" onClick={(e) => e.stopPropagation()}>
                    <div className="hp-dash__modal-header">
                      <h3>Roll API Keys</h3>
                      <button className="hp-dash__modal-close" onClick={() => setShowRollConfirm(false)}>&times;</button>
                    </div>
                    <div className="hp-dash__modal-body">
                      <p style={{ color: '#ef4444', fontWeight: 600, marginBottom: 8 }}>This action is irreversible.</p>
                      <p style={{ color: 'var(--hp-text-muted)', fontSize: '0.85rem', lineHeight: 1.6 }}>
                        Rolling your API keys will immediately invalidate your current publishable and secret keys.
                        All integrations using the current keys will stop working. You will need to update your keys in all environments.
                      </p>
                    </div>
                    <div className="hp-dash__modal-footer">
                      <button className="hp-dash__modal-cancel" onClick={() => setShowRollConfirm(false)}>Cancel</button>
                      <button className="hp-dash__modal-send" style={{ background: '#ef4444' }} onClick={() => { alert('API keys rolled (mock)'); setShowRollConfirm(false); }}>Roll Keys</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="hp-settings__card">
              <h3 className="hp-settings__card-title">Webhook Endpoints</h3>
              <p className="hp-settings__card-desc">Configure where MTRX sends event notifications.</p>
              <div className="hp-settings__webhook-list">
                <div className="hp-settings__webhook">
                  <div>
                    <code>https://acmedigital.co.uk/webhooks/mtrx</code>
                    <span className="hp-settings__webhook-meta">Last delivery: 14 Mar 2026, 14:32 - 200 OK</span>
                  </div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <StatusBadge status="active" size="sm" />
                    <button className="hp-settings__copy-btn">Test</button>
                  </div>
                </div>
              </div>
              <button className="hp-settings__add-btn" style={{ marginTop: 12 }}>+ Add Endpoint</button>
            </div>
            <div className="hp-settings__card">
              <h3 className="hp-settings__card-title">Subscribed Events</h3>
              <p className="hp-settings__card-desc">Choose which events are sent to your webhook endpoints.</p>
              <div className="hp-settings__toggle-list">
                {[
                  { label: 'payment.completed', desc: 'Fired when a payment is successfully captured', defaultOn: true },
                  { label: 'payment.failed', desc: 'Fired when a payment attempt fails', defaultOn: true },
                  { label: 'refund.created', desc: 'Fired when a refund is issued', defaultOn: true },
                  { label: 'chargeback.opened', desc: 'Fired when a chargeback dispute is opened', defaultOn: true },
                  { label: 'payout.settled', desc: 'Fired when a payout is settled to your bank', defaultOn: false },
                  { label: 'subscription.updated', desc: 'Fired when a subscription status changes', defaultOn: false },
                ].map((item) => (
                  <ToggleRow key={item.label} label={item.label} desc={item.desc} defaultOn={item.defaultOn} />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Save Button */}
      <div className="hp-settings__save-bar">
        <button className="hp-settings__save-btn" onClick={handleSave}>
          {saved ? 'Saved' : 'Save Changes'}
        </button>
      </div>
    </DashboardLayout>
  );
}

/* Toggle Row Component */
function ToggleRow({ label, desc, defaultOn }: { label: string; desc: string; defaultOn: boolean }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <div className="hp-settings__toggle-row">
      <div>
        <span className="hp-settings__toggle-label">{label}</span>
        <span className="hp-settings__toggle-desc">{desc}</span>
      </div>
      <button className={`hp-settings__toggle${on ? ' hp-settings__toggle--on' : ''}`} onClick={() => setOn(!on)}>
        <span className="hp-settings__toggle-thumb" />
      </button>
    </div>
  );
}
