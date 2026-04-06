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

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
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
                    <code>pk_live_mtrx_a1b2c3d4e5f6g7h8</code>
                    <button className="hp-settings__copy-btn">Copy</button>
                  </div>
                </div>
                <div className="hp-settings__api-key">
                  <span className="hp-settings__api-key-label">Secret Key</span>
                  <div className="hp-settings__api-key-value">
                    <code>sk_live_mtrx_••••••••••••••••</code>
                    <button className="hp-settings__copy-btn">Reveal</button>
                  </div>
                </div>
                <div className="hp-settings__api-key">
                  <span className="hp-settings__api-key-label">Webhook Secret</span>
                  <div className="hp-settings__api-key-value">
                    <code>whsec_mtrx_••••••••••••••••</code>
                    <button className="hp-settings__copy-btn">Reveal</button>
                  </div>
                </div>
              </div>
              <button className="hp-settings__btn-outline" style={{ marginTop: 16 }}>Roll API Keys</button>
            </div>
            <div className="hp-settings__card">
              <h3 className="hp-settings__card-title">Webhook Endpoints</h3>
              <p className="hp-settings__card-desc">Configure where MTRX sends event notifications.</p>
              <div className="hp-settings__webhook-list">
                <div className="hp-settings__webhook">
                  <code>https://acmedigital.co.uk/webhooks/mtrx</code>
                  <StatusBadge status="active" size="sm" />
                </div>
              </div>
              <button className="hp-settings__add-btn" style={{ marginTop: 12 }}>+ Add Endpoint</button>
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
