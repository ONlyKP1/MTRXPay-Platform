import { useState, useEffect, useRef, useCallback, useMemo } from 'react';

interface SearchResult {
  id: string;
  type: 'transaction' | 'message' | 'compliance';
  title: string;
  subtitle: string;
  page: string;
}

const searchableItems: SearchResult[] = [
  { id: 's1', type: 'transaction', title: 'TXN-001 — John Smith', subtitle: '£1,475.00 · Completed', page: '/transactions' },
  { id: 's2', type: 'transaction', title: 'TXN-002 — Emma Wilson', subtitle: '£890.50 · Completed', page: '/transactions' },
  { id: 's3', type: 'transaction', title: 'TXN-003 — Hans Mueller', subtitle: '€2,100.00 · Pending', page: '/transactions' },
  { id: 's4', type: 'transaction', title: 'TXN-005 — Mike Johnson', subtitle: '$3,200.00 · Completed', page: '/transactions' },
  { id: 's5', type: 'transaction', title: 'TXN-006 — Payout', subtitle: '£15,420.00 · Payout', page: '/transactions' },
  { id: 's6', type: 'transaction', title: 'TXN-007 — Alice Cooper', subtitle: '£175.00 · Refunded', page: '/transactions' },
  { id: 's7', type: 'transaction', title: 'CB-2026-001 — Chargeback', subtitle: '£2,450.00 · Disputed', page: '/transactions' },
  { id: 's8', type: 'message', title: 'Welcome to MTRX Pay', subtitle: 'From MTRX Support · 14 Mar 2026', page: '/dashboard' },
  { id: 's9', type: 'message', title: 'Document Request', subtitle: 'From Compliance Team · 13 Mar 2026', page: '/dashboard' },
  { id: 's10', type: 'message', title: 'Payout Schedule Update', subtitle: 'From MTRX Support · 10 Mar 2026', page: '/dashboard' },
  { id: 's11', type: 'compliance', title: 'KYC Verification', subtitle: 'Status: Approved', page: '/compliance' },
  { id: 's12', type: 'compliance', title: 'AML Policy Document', subtitle: 'Uploaded · Verified', page: '/compliance' },
  { id: 's13', type: 'compliance', title: 'Business Registration', subtitle: 'Uploaded · Under Review', page: '/compliance' },
  { id: 's14', type: 'compliance', title: 'Bank Verification', subtitle: 'Step 4 of 6 · In Progress', page: '/compliance' },
];

const typeLabels: Record<SearchResult['type'], string> = {
  transaction: 'Transactions',
  message: 'Messages',
  compliance: 'Compliance',
};

const typeIconSvg: Record<SearchResult['type'], React.ReactNode> = {
  transaction: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" /><rect x="9" y="3" width="6" height="4" rx="1" />
    </svg>
  ),
  message: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
    </svg>
  ),
  compliance: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
};

const searchIcon = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
  </svg>
);

const arrowIcon = (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

interface GlobalSearchProps {
  onNavigate: (path: string) => void;
}

export function GlobalSearch({ onNavigate }: GlobalSearchProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const flatResults = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return searchableItems
      .filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.subtitle.toLowerCase().includes(q)
      )
      .slice(0, 10);
  }, [query]);

  // Group results by type, preserving order
  const groupedResults = useMemo(() => {
    const groups: { type: SearchResult['type']; items: SearchResult[] }[] = [];
    const seen = new Set<SearchResult['type']>();
    for (const r of flatResults) {
      if (!seen.has(r.type)) {
        seen.add(r.type);
        groups.push({ type: r.type, items: [] });
      }
      groups.find((g) => g.type === r.type)!.items.push(r);
    }
    return groups;
  }, [flatResults]);

  const close = useCallback(() => {
    setOpen(false);
    setQuery('');
    setSelectedIndex(0);
  }, []);

  const selectResult = useCallback(
    (result: SearchResult) => {
      close();
      onNavigate(result.page);
    },
    [close, onNavigate]
  );

  // Cmd+K / Ctrl+K listener
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  // Keyboard navigation inside panel
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        close();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((i) => Math.min(i + 1, flatResults.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === 'Enter' && flatResults[selectedIndex]) {
        e.preventDefault();
        selectResult(flatResults[selectedIndex]);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, flatResults, selectedIndex, close, selectResult]);

  // Reset selection when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Scroll selected item into view
  useEffect(() => {
    if (!listRef.current) return;
    const el = listRef.current.querySelector('[data-active="true"]') as HTMLElement | null;
    el?.scrollIntoView({ block: 'nearest' });
  }, [selectedIndex]);

  const isMac = typeof navigator !== 'undefined' && navigator.platform.toUpperCase().includes('MAC');

  // Track flat index across grouped rendering
  let flatIndex = -1;

  return (
    <>
      {/* Trigger */}
      <button className="hp-dash__search-trigger" onClick={() => setOpen(true)}>
        {searchIcon}
        <span className="hp-dash__search-trigger-text">Search</span>
        <kbd className="hp-dash__search-kbd">{isMac ? '⌘' : 'Ctrl'}K</kbd>
      </button>

      {/* Overlay + Panel */}
      {open && (
        <div className="hp-dash__search-overlay" onClick={close}>
          <div className="hp-dash__search-panel" onClick={(e) => e.stopPropagation()}>
            {/* Input */}
            <div className="hp-dash__search-input-wrap">
              {searchIcon}
              <input
                ref={inputRef}
                type="text"
                className="hp-dash__search-panel-input"
                placeholder="Search transactions, messages, compliance..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <kbd className="hp-dash__search-kbd" onClick={close}>ESC</kbd>
            </div>

            {/* Results */}
            <div className="hp-dash__search-results" ref={listRef}>
              {!query.trim() ? (
                /* Initial state — suggestions */
                <div className="hp-dash__search-hints">
                  <span className="hp-dash__search-hint-label">Try searching for</span>
                  <div className="hp-dash__search-hint-tags">
                    {['TXN-001', 'Payout', 'KYC', 'Chargeback'].map((term) => (
                      <button
                        key={term}
                        className="hp-dash__search-hint-tag"
                        onClick={() => setQuery(term)}
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              ) : flatResults.length === 0 ? (
                <div className="hp-dash__search-empty">
                  No results for &ldquo;{query}&rdquo;
                </div>
              ) : (
                groupedResults.map((group) => (
                  <div key={group.type} className="hp-dash__search-group">
                    <div className="hp-dash__search-group-label">{typeLabels[group.type]}</div>
                    {group.items.map((r) => {
                      flatIndex++;
                      const isActive = flatIndex === selectedIndex;
                      const idx = flatIndex; // capture for event
                      return (
                        <button
                          key={r.id}
                          data-active={isActive}
                          className={`hp-dash__search-result${isActive ? ' hp-dash__search-result--active' : ''}`}
                          onClick={() => selectResult(r)}
                          onMouseEnter={() => setSelectedIndex(idx)}
                        >
                          <span className={`hp-dash__search-icon hp-dash__search-icon--${r.type}`}>
                            {typeIconSvg[r.type]}
                          </span>
                          <div className="hp-dash__search-result-text">
                            <span className="hp-dash__search-result-title">{r.title}</span>
                            <span className="hp-dash__search-result-sub">{r.subtitle}</span>
                          </div>
                          <span className="hp-dash__search-result-arrow">{arrowIcon}</span>
                        </button>
                      );
                    })}
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="hp-dash__search-footer">
              <span><kbd className="hp-dash__search-kbd">↑↓</kbd> navigate</span>
              <span><kbd className="hp-dash__search-kbd">↵</kbd> select</span>
              <span><kbd className="hp-dash__search-kbd">esc</kbd> close</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
