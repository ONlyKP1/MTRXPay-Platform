import { useState } from 'react';
import { useAdminAuth } from '../context/AdminAuthContext';

export function AdminLoginPage() {
  const { login } = useAdminAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'error' | 'success'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');

    const result = await login(email, password);

    if (result.success) {
      setStatus('success');
    } else {
      setStatus('error');
      setErrorMsg(result.error || 'Login failed.');
    }
  };

  const disabled = status === 'loading' || status === 'success';

  return (
    <div className="hp-auth">
      <div className="hp-auth__bg">
        <video
          src="/hero-bg.mp4"
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
          className="hp-auth__bg-video"
        />
        <div className="hp-auth__bg-overlay" />
        <div className="hp-auth__glow hp-auth__glow--1" />
        <div className="hp-auth__glow hp-auth__glow--2" />
      </div>

      <div className="hp-auth__container">
        <div className="hp-auth__card">
          <div className="hp-auth__logo-inner">
            <img src="/logo.png" alt="MTRX PAY" />
          </div>

          <h1 className="hp-auth__title">Admin <em>Portal</em></h1>
          <p className="hp-auth__subtitle">Sign in to access the administration dashboard</p>

          {status === 'error' && (
            <div className="hp-auth__alert hp-auth__alert--error">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
              {errorMsg}
            </div>
          )}

          {status === 'success' && (
            <div className="hp-auth__alert hp-auth__alert--success">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              Authentication successful. Loading dashboard...
            </div>
          )}

          <form className="hp-auth__form" onSubmit={handleSubmit}>
            <div className="hp-auth__field">
              <label htmlFor="admin-email">Email Address</label>
              <input
                id="admin-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@mtrxpay.com"
                disabled={disabled}
                autoComplete="email"
              />
            </div>
            <div className="hp-auth__field">
              <label htmlFor="admin-password">Password</label>
              <input
                id="admin-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                disabled={disabled}
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              className="hp-auth__submit"
              disabled={disabled}
            >
              {status === 'loading' ? (
                <span className="hp-auth__spinner" />
              ) : status === 'success' ? (
                'Redirecting...'
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="hp-auth__demo">
            <span>Demo credentials</span>
            <code>admin@mtrxpay.com / admin123</code>
          </div>
        </div>
      </div>
    </div>
  );
}
