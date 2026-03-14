import { useState } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';

/* ── Mock Data ── */
const mockPayLinks = [
  { id: 'PL-001', amount: '£250.00', status: 'active', created: '2026-03-10', url: 'https://pay.mtrxpay.com/pl/abc123' },
  { id: 'PL-002', amount: '£1,500.00', status: 'expired', created: '2026-02-28', url: 'https://pay.mtrxpay.com/pl/def456' },
  { id: 'PL-003', amount: '£75.00', status: 'active', created: '2026-03-12', url: 'https://pay.mtrxpay.com/pl/ghi789' },
];

const mockHostedPages = [
  { id: 'HP-001', name: 'Premium Checkout', url: 'https://pay.mtrxpay.com/hp/premium', status: 'active' },
  { id: 'HP-002', name: 'Event Tickets', url: 'https://pay.mtrxpay.com/hp/tickets', status: 'draft' },
];

const mockWidgets = [
  { id: 'WG-001', name: 'Main Site Widget', domain: 'example.com', status: 'active' },
  { id: 'WG-002', name: 'Blog Donation', domain: 'blog.example.com', status: 'active' },
];


/* ── Component ── */
export function PaymentTypesPage() {
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [showPageModal, setShowPageModal] = useState(false);
  const [showWidgetModal, setShowWidgetModal] = useState(false);
  const [widgetGenerated, setWidgetGenerated] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  /* Link form */
  const [linkForm, setLinkForm] = useState({ amount: '', currency: 'GBP', description: '', expiry: '' });
  /* Page form */
  const [pageForm, setPageForm] = useState({ name: '', redirect: '', colour: '#D4AF37' });
  /* Widget form */
  const [widgetForm, setWidgetForm] = useState({ name: '', domain: '' });

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCreateLink = () => {
    alert(`Pay link created: ${linkForm.currency} ${linkForm.amount}`);
    setLinkForm({ amount: '', currency: 'GBP', description: '', expiry: '' });
    setShowLinkModal(false);
  };

  const handleCreatePage = () => {
    alert(`Hosted page "${pageForm.name}" created`);
    setPageForm({ name: '', redirect: '', colour: '#D4AF37' });
    setShowPageModal(false);
  };

  const handleGenerateWidget = () => {
    setWidgetGenerated(true);
  };

  const closeWidgetModal = () => {
    setShowWidgetModal(false);
    setWidgetGenerated(false);
    setWidgetForm({ name: '', domain: '' });
  };

  const widgetSnippet = `<script src="https://js.mtrxpay.com/widget.js"></script>
<div id="mtrx-payment-widget"
  data-key="pk_live_xxxxxxxx"
  data-name="${widgetForm.name || 'My Widget'}"
  data-domain="${widgetForm.domain || 'example.com'}">
</div>
<script>
  MtrxPay.mount('#mtrx-payment-widget');
</script>`;

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="hp-dash__page-header">
        <h1 className="hp-dash__page-title">Payment Types</h1>
      </div>

      {/* Metric Cards */}
      <div className="hp-dash__metrics">
        <div className="hp-dash__metric-card">
          <span className="hp-dash__metric-label">Active Links</span>
          <span className="hp-dash__metric-value">12</span>
        </div>
        <div className="hp-dash__metric-card">
          <span className="hp-dash__metric-label">Hosted Pages</span>
          <span className="hp-dash__metric-value">3</span>
        </div>
        <div className="hp-dash__metric-card">
          <span className="hp-dash__metric-label">Widgets</span>
          <span className="hp-dash__metric-value">5</span>
        </div>
        <div className="hp-dash__metric-card">
          <span className="hp-dash__metric-label">Total Collected</span>
          <span className="hp-dash__metric-value">£48,250.00</span>
        </div>
      </div>

      {/* ── 1. Pay by Link ── */}
      <section className="hp-dash__card-section">
        <div className="hp-dash__section-header">
          <div>
            <span className="hp-dash__section-label">Pay by Link</span>
            <p className="hp-dash__section-desc">Generate shareable payment links to send to your customers via email, SMS, or social media.</p>
            <div className="hp-dash__feature-list">
              <span>Custom amounts</span>
              <span>Expiry dates</span>
              <span>Multi-currency</span>
              <span>Branded pages</span>
            </div>
          </div>
          <button className="hp-dash__btn-gold hp-dash__btn-sm" onClick={() => setShowLinkModal(true)}>Create Link</button>
        </div>
        <div className="hp-dash__table-wrap">
          <table className="hp-dash__table">
            <thead>
              <tr>
                <th>Link ID</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Created</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {mockPayLinks.map((link) => (
                <tr key={link.id}>
                  <td className="hp-dash__txn-id">{link.id}</td>
                  <td>{link.amount}</td>
                  <td><span className={`hp-dash__status hp-dash__status--${link.status === 'active' ? 'completed' : 'failed'}`}>{link.status}</span></td>
                  <td>{link.created}</td>
                  <td>
                    <button className="hp-dash__btn-outline hp-dash__btn-sm" onClick={() => handleCopy(link.url, link.id)}>
                      {copiedId === link.id ? 'Copied!' : 'Copy'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── 2. Hosted Checkout ── */}
      <section className="hp-dash__card-section">
        <div className="hp-dash__section-header">
          <div>
            <span className="hp-dash__section-label">Hosted Checkout</span>
            <p className="hp-dash__section-desc">Full-page branded checkout experience hosted by MTRX Pay. Redirect customers to a secure payment page.</p>
            <div className="hp-dash__feature-list">
              <span>Custom branding</span>
              <span>Multi-step flow</span>
              <span>Saved cards</span>
              <span>3D Secure</span>
            </div>
          </div>
          <button className="hp-dash__btn-gold hp-dash__btn-sm" onClick={() => setShowPageModal(true)}>Create Page</button>
        </div>
        <div className="hp-dash__table-wrap">
          <table className="hp-dash__table">
            <thead>
              <tr>
                <th>Page ID</th>
                <th>Name</th>
                <th>URL</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {mockHostedPages.map((page) => (
                <tr key={page.id}>
                  <td className="hp-dash__txn-id">{page.id}</td>
                  <td>{page.name}</td>
                  <td className="hp-dash__txn-id">{page.url}</td>
                  <td><span className={`hp-dash__status hp-dash__status--${page.status === 'active' ? 'completed' : 'pending'}`}>{page.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── 3. Payment Widget ── */}
      <section className="hp-dash__card-section">
        <div className="hp-dash__section-header">
          <div>
            <span className="hp-dash__section-label">Payment Widget</span>
            <p className="hp-dash__section-desc">Embeddable payment form you can drop into any website. Fully customisable and PCI compliant.</p>
            <div className="hp-dash__feature-list">
              <span>Drop-in component</span>
              <span>Custom styling</span>
              <span>PCI compliant</span>
              <span>Callbacks</span>
            </div>
          </div>
          <button className="hp-dash__btn-gold hp-dash__btn-sm" onClick={() => setShowWidgetModal(true)}>Generate Widget</button>
        </div>
        <div className="hp-dash__table-wrap">
          <table className="hp-dash__table">
            <thead>
              <tr>
                <th>Widget ID</th>
                <th>Name</th>
                <th>Domain</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {mockWidgets.map((w) => (
                <tr key={w.id}>
                  <td className="hp-dash__txn-id">{w.id}</td>
                  <td>{w.name}</td>
                  <td>{w.domain}</td>
                  <td><span className="hp-dash__status hp-dash__status--completed">{w.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Create Pay Link Modal ── */}
      {showLinkModal && (
        <div className="hp-dash__modal-overlay" onClick={() => setShowLinkModal(false)}>
          <div className="hp-dash__modal" onClick={(e) => e.stopPropagation()}>
            <div className="hp-dash__modal-header">
              <h3>Create Pay Link</h3>
              <button className="hp-dash__modal-close" onClick={() => setShowLinkModal(false)}>&times;</button>
            </div>
            <div className="hp-dash__modal-body">
              <div className="hp-dash__field">
                <label>Amount</label>
                <input type="number" placeholder="0.00" value={linkForm.amount} onChange={(e) => setLinkForm({ ...linkForm, amount: e.target.value })} />
              </div>
              <div className="hp-dash__field">
                <label>Currency</label>
                <select value={linkForm.currency} onChange={(e) => setLinkForm({ ...linkForm, currency: e.target.value })}>
                  <option value="GBP">GBP</option>
                  <option value="EUR">EUR</option>
                  <option value="USD">USD</option>
                  <option value="AED">AED</option>
                </select>
              </div>
              <div className="hp-dash__field">
                <label>Description</label>
                <input type="text" placeholder="Payment for..." value={linkForm.description} onChange={(e) => setLinkForm({ ...linkForm, description: e.target.value })} />
              </div>
              <div className="hp-dash__field">
                <label>Expiry Date</label>
                <input type="date" value={linkForm.expiry} onChange={(e) => setLinkForm({ ...linkForm, expiry: e.target.value })} />
              </div>
            </div>
            <div className="hp-dash__modal-footer">
              <button className="hp-dash__modal-cancel" onClick={() => setShowLinkModal(false)}>Cancel</button>
              <button className="hp-dash__modal-send" onClick={handleCreateLink}>Create Link</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Create Hosted Page Modal ── */}
      {showPageModal && (
        <div className="hp-dash__modal-overlay" onClick={() => setShowPageModal(false)}>
          <div className="hp-dash__modal" onClick={(e) => e.stopPropagation()}>
            <div className="hp-dash__modal-header">
              <h3>Create Hosted Page</h3>
              <button className="hp-dash__modal-close" onClick={() => setShowPageModal(false)}>&times;</button>
            </div>
            <div className="hp-dash__modal-body">
              <div className="hp-dash__field">
                <label>Page Name</label>
                <input type="text" placeholder="e.g. Premium Checkout" value={pageForm.name} onChange={(e) => setPageForm({ ...pageForm, name: e.target.value })} />
              </div>
              <div className="hp-dash__field">
                <label>Success Redirect URL</label>
                <input type="url" placeholder="https://yoursite.com/success" value={pageForm.redirect} onChange={(e) => setPageForm({ ...pageForm, redirect: e.target.value })} />
              </div>
              <div className="hp-dash__field">
                <label>Colour Theme</label>
                <input type="color" value={pageForm.colour} onChange={(e) => setPageForm({ ...pageForm, colour: e.target.value })} />
              </div>
            </div>
            <div className="hp-dash__modal-footer">
              <button className="hp-dash__modal-cancel" onClick={() => setShowPageModal(false)}>Cancel</button>
              <button className="hp-dash__modal-send" onClick={handleCreatePage}>Create Page</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Generate Widget Modal ── */}
      {showWidgetModal && (
        <div className="hp-dash__modal-overlay" onClick={closeWidgetModal}>
          <div className="hp-dash__modal" onClick={(e) => e.stopPropagation()}>
            <div className="hp-dash__modal-header">
              <h3>Generate Widget</h3>
              <button className="hp-dash__modal-close" onClick={closeWidgetModal}>&times;</button>
            </div>
            <div className="hp-dash__modal-body">
              {!widgetGenerated ? (
                <>
                  <div className="hp-dash__field">
                    <label>Widget Name</label>
                    <input type="text" placeholder="e.g. Main Site Widget" value={widgetForm.name} onChange={(e) => setWidgetForm({ ...widgetForm, name: e.target.value })} />
                  </div>
                  <div className="hp-dash__field">
                    <label>Allowed Domain</label>
                    <input type="text" placeholder="e.g. example.com" value={widgetForm.domain} onChange={(e) => setWidgetForm({ ...widgetForm, domain: e.target.value })} />
                  </div>
                </>
              ) : (
                <div className="hp-dash__code-snippet">
                  <div className="hp-dash__code-snippet-header">
                    <span>Embed Code</span>
                    <button className="hp-dash__btn-outline hp-dash__btn-sm" onClick={() => handleCopy(widgetSnippet, 'widget-snippet')}>
                      {copiedId === 'widget-snippet' ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                  <pre><code>{widgetSnippet}</code></pre>
                </div>
              )}
            </div>
            <div className="hp-dash__modal-footer">
              <button className="hp-dash__modal-cancel" onClick={closeWidgetModal}>{widgetGenerated ? 'Close' : 'Cancel'}</button>
              {!widgetGenerated && (
                <button className="hp-dash__modal-send" onClick={handleGenerateWidget}>Generate</button>
              )}
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
