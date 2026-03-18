import { Card } from '@mtrx/ui';

const reportCategories = [
  {
    title: 'Financial Reports',
    reports: [
      { name: 'Revenue Summary', description: 'Total platform revenue, fees collected, and margin analysis', frequency: 'Daily / Weekly / Monthly', lastGenerated: '2026-03-18 08:00' },
      { name: 'Settlement Report', description: 'Merchant payouts, escrow releases, and hold summaries', frequency: 'Daily', lastGenerated: '2026-03-18 06:00' },
      { name: 'Currency Exposure', description: 'Multi-currency position report (GBP, EUR, USD, AED)', frequency: 'Real-time', lastGenerated: 'Live' },
      { name: 'Fee Analysis', description: 'Breakdown of processing fees by merchant tier and industry', frequency: 'Monthly', lastGenerated: '2026-03-01' },
    ],
  },
  {
    title: 'Risk & Compliance',
    reports: [
      { name: 'AML Suspicious Activity', description: 'Flagged transactions requiring SAR filing consideration', frequency: 'Real-time', lastGenerated: 'Live' },
      { name: 'Chargeback Analysis', description: 'Chargeback rates by merchant, industry, and payment method', frequency: 'Weekly', lastGenerated: '2026-03-15' },
      { name: 'KYC/KYB Completion', description: 'Onboarding funnel, pass/fail rates, and SLA compliance', frequency: 'Weekly', lastGenerated: '2026-03-15' },
      { name: 'PEP & Sanctions Screening', description: 'Results of ongoing monitoring against PEP and sanctions lists', frequency: 'Daily', lastGenerated: '2026-03-18' },
      { name: 'Regulatory Filing Pack', description: 'FCA-ready reporting pack for regulatory submissions', frequency: 'Quarterly', lastGenerated: '2026-01-15' },
    ],
  },
  {
    title: 'Operations & Performance',
    reports: [
      { name: 'Transaction Volume', description: 'Processing volumes by merchant, currency, and payment method', frequency: 'Daily', lastGenerated: '2026-03-18 08:00' },
      { name: 'System Uptime & SLA', description: 'Service availability, response times, and incident summary', frequency: 'Monthly', lastGenerated: '2026-03-01' },
      { name: 'Merchant Activity', description: 'Active merchants, dormant accounts, and churn risk analysis', frequency: 'Weekly', lastGenerated: '2026-03-15' },
      { name: 'API Usage', description: 'API call volumes, error rates, and integration health by merchant', frequency: 'Daily', lastGenerated: '2026-03-18' },
    ],
  },
];

export function ReportsPage() {
  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <div>
          <h1 className="admin-page__title">Reports</h1>
          <p className="admin-page__subtitle">Financial, compliance, and operational reporting suite</p>
        </div>
        <div className="admin-page__actions">
          <button className="mtrx-btn mtrx-btn--secondary mtrx-btn--sm">Schedule Report</button>
          <button className="mtrx-btn mtrx-btn--primary mtrx-btn--sm">Generate Custom</button>
        </div>
      </div>

      {reportCategories.map(cat => (
        <div key={cat.title} className="admin-report-section">
          <h2 className="admin-section-title">{cat.title}</h2>
          <div className="admin-report-grid">
            {cat.reports.map(r => (
              <Card key={r.name} className="admin-report-card">
                <h3 className="admin-report-card__name">{r.name}</h3>
                <p className="admin-report-card__desc">{r.description}</p>
                <div className="admin-report-card__meta">
                  <span className="admin-report-card__freq">{r.frequency}</span>
                  <span className="admin-report-card__last">Last: {r.lastGenerated}</span>
                </div>
                <div className="admin-report-card__actions">
                  <button className="mtrx-btn mtrx-btn--secondary mtrx-btn--sm">View</button>
                  <button className="mtrx-btn mtrx-btn--ghost mtrx-btn--sm">Download</button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
