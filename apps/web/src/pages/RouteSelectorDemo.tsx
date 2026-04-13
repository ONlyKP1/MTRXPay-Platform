import { useState } from 'react';
import { RouteSelector } from '../components/RouteSelector';
import type { OrchestrationResponse, TransactionRequest } from '../types/orchestration';
import '../components/RouteSelector.css';

const defaultRequest: TransactionRequest = {
  amount: 250,
  currency: 'GBP',
  country: 'UK',
  merchantCategory: 'ticketing',
  type: 'onramp',
};

export default function RouteSelectorDemo() {
  const [request, setRequest] = useState<TransactionRequest>(defaultRequest);
  const [response, setResponse] = useState<OrchestrationResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);

  const fetchRoutes = async () => {
    setLoading(true);
    setSelectedProvider(null);

    try {
      const res = await fetch('/api/orchestrate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      });
      const data = await res.json();
      setResponse(data);
    } catch (error) {
      console.error('Failed to fetch routes:', error);
      // Use mock data as fallback
      setResponse({
        recommended: {
          providerId: 'banxa',
          reason: 'Best combination of fee, approval likelihood and speed',
        },
        options: [
          { providerId: 'banxa', name: 'Banxa', fee: 1.2, score: 76, speedLabel: 'Instant', recommended: true },
          { providerId: 'transak', name: 'Transak', fee: 1.5, score: 70, speedLabel: '5 mins', recommended: false },
        ],
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (providerId: string) => {
    setSelectedProvider(providerId);
    console.log('Selected provider:', providerId);
  };

  return (
    <div className="demo-page">
      <div className="demo-container">
        <h1>Route Selector Demo</h1>
        <p className="demo-subtitle">Day 7: Payment Orchestration</p>

        <div className="demo-controls">
          <h3>Transaction Request</h3>

          <div className="demo-form">
            <label>
              Amount (£)
              <input
                type="number"
                value={request.amount}
                onChange={(e) => setRequest({ ...request, amount: Number(e.target.value) })}
              />
            </label>

            <label>
              Currency
              <select
                value={request.currency}
                onChange={(e) => setRequest({ ...request, currency: e.target.value })}
              >
                <option value="GBP">GBP</option>
                <option value="EUR">EUR</option>
                <option value="USD">USD</option>
              </select>
            </label>

            <label>
              Country
              <select
                value={request.country}
                onChange={(e) => setRequest({ ...request, country: e.target.value })}
              >
                <option value="UK">UK</option>
                <option value="EU">EU</option>
                <option value="USA">USA</option>
                <option value="UAE">UAE</option>
              </select>
            </label>

            <label>
              Category
              <select
                value={request.merchantCategory}
                onChange={(e) => setRequest({ ...request, merchantCategory: e.target.value })}
              >
                <option value="ticketing">Ticketing</option>
                <option value="digital">Digital</option>
                <option value="wellness">Wellness</option>
              </select>
            </label>

            <label>
              Type
              <select
                value={request.type}
                onChange={(e) => setRequest({ ...request, type: e.target.value as 'onramp' | 'offramp' })}
              >
                <option value="onramp">Onramp</option>
                <option value="offramp">Offramp</option>
              </select>
            </label>
          </div>

          <button className="demo-button" onClick={fetchRoutes} disabled={loading}>
            {loading ? 'Loading...' : 'Get Routes'}
          </button>
        </div>

        <div className="demo-result">
          {response && (
            <RouteSelector
              response={response}
              amount={request.amount}
              onSelect={handleSelect}
            />
          )}

          {selectedProvider && (
            <div className="demo-selected">
              <h4>Selection Confirmed</h4>
              <p>Provider: <strong>{selectedProvider}</strong></p>
              <p>Ready to proceed with payment...</p>
            </div>
          )}
        </div>

        {response && (
          <div className="demo-json">
            <h4>API Response</h4>
            <pre>{JSON.stringify(response, null, 2)}</pre>
          </div>
        )}
      </div>

      <style>{`
        .demo-page {
          min-height: 100vh;
          background: var(--navy, #021B3A);
          padding: 40px 20px;
        }

        .demo-container {
          max-width: 900px;
          margin: 0 auto;
        }

        .demo-page h1 {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          font-size: 2.5rem;
          color: var(--gold, #D4AF37);
          margin: 0 0 8px 0;
        }

        .demo-subtitle {
          font-family: 'Work Sans', sans-serif;
          font-size: 1rem;
          color: #8899aa;
          margin: 0 0 32px 0;
        }

        .demo-controls {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 24px;
          margin-bottom: 32px;
        }

        .demo-controls h3 {
          font-family: 'Work Sans', sans-serif;
          font-size: 1rem;
          font-weight: 600;
          color: #fff;
          margin: 0 0 16px 0;
        }

        .demo-form {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
          gap: 16px;
          margin-bottom: 20px;
        }

        .demo-form label {
          display: flex;
          flex-direction: column;
          gap: 6px;
          font-family: 'Work Sans', sans-serif;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: #666;
        }

        .demo-form input,
        .demo-form select {
          padding: 10px 12px;
          font-family: 'Work Sans', sans-serif;
          font-size: 1rem;
          color: #fff;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 6px;
        }

        .demo-form input:focus,
        .demo-form select:focus {
          outline: none;
          border-color: var(--gold, #D4AF37);
        }

        .demo-button {
          padding: 12px 24px;
          font-family: 'Work Sans', sans-serif;
          font-size: 0.875rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: #021B3A;
          background: var(--gold, #D4AF37);
          border: none;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .demo-button:hover {
          background: #e5c349;
        }

        .demo-button:disabled {
          background: #444;
          color: #888;
          cursor: not-allowed;
        }

        .demo-result {
          display: flex;
          flex-direction: column;
          gap: 24px;
          margin-bottom: 32px;
        }

        .demo-selected {
          background: rgba(0, 200, 100, 0.1);
          border: 1px solid rgba(0, 200, 100, 0.3);
          border-radius: 12px;
          padding: 20px;
        }

        .demo-selected h4 {
          font-family: 'Work Sans', sans-serif;
          font-size: 1rem;
          font-weight: 600;
          color: #00c864;
          margin: 0 0 8px 0;
        }

        .demo-selected p {
          font-family: 'Work Sans', sans-serif;
          font-size: 0.875rem;
          color: #8899aa;
          margin: 4px 0;
        }

        .demo-selected strong {
          color: #fff;
        }

        .demo-json {
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          padding: 16px;
        }

        .demo-json h4 {
          font-family: 'Work Sans', sans-serif;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: #666;
          margin: 0 0 12px 0;
        }

        .demo-json pre {
          font-family: 'Monaco', 'Consolas', monospace;
          font-size: 0.75rem;
          color: #8899aa;
          margin: 0;
          overflow-x: auto;
        }
      `}</style>
    </div>
  );
}
