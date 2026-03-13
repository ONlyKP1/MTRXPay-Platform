import { useState, useEffect } from 'react';

const SITE_PASSWORD = 'mtrx2025'; // Change this to your desired password

interface PasswordGateProps {
  children: React.ReactNode;
}

export function PasswordGate({ children }: PasswordGateProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const authenticated = sessionStorage.getItem('site_authenticated');
    if (authenticated === 'true') {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === SITE_PASSWORD) {
      sessionStorage.setItem('site_authenticated', 'true');
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Incorrect password');
    }
  };

  if (isLoading) {
    return (
      <div className="password-gate">
        <div className="password-gate-box">
          <img src="/logo.png" alt="MTRX Pay" className="password-gate-logo-img" />
          <p style={{ color: 'var(--text-light)' }}>Loading...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="password-gate">
      <div className="password-gate-box">
        <img src="/logo.png" alt="MTRX Pay" className="password-gate-logo-img" />
        <p className="password-gate-text">This site is password protected</p>
        <form onSubmit={handleSubmit} className="password-gate-form">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            className="password-gate-input"
            autoFocus
          />
          {error && <p className="password-gate-error">{error}</p>}
          <button type="submit" className="password-gate-button">
            Enter Site
          </button>
        </form>
      </div>
    </div>
  );
}
