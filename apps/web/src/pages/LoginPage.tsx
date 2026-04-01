import { useState } from 'react';
import { Link } from 'react-router-dom';

export function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'error' | 'success'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, password: form.password })
      });

      const data = await response.json();

      if (data.success) {
        // Save token and user to localStorage
        localStorage.setItem('mtrx_token', data.data.token);
        localStorage.setItem('mtrx_user', JSON.stringify(data.data.user));
        setStatus('success');
        setTimeout(() => window.location.href = '/dashboard', 1200);
      } else {
        setStatus('error');
        setErrorMsg(data.error?.message || 'Invalid email or password. Please try again.');
      }
    } catch (error) {
      setStatus('error');
      setErrorMsg('Unable to connect to server. Please try again.');
    }
  };

  return (
    <div className="hp-auth">
      <div className="hp-auth__bg">
        <div className="hp-auth__glow hp-auth__glow--1" />
        <div className="hp-auth__glow hp-auth__glow--2" />
      </div>
      <div className="hp-auth__container">
        <div className="hp-auth__card">
          <Link to="/" className="hp-auth__logo-inner">
            <img src="/logo.png" alt="MTRX PAY" />
          </Link>
          <h1 className="hp-auth__title">Welcome <em>Back</em></h1>
          <p className="hp-auth__subtitle">Sign in to access your merchant dashboard</p>

          {status === 'error' && (
            <div className="hp-auth__alert hp-auth__alert--error">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
              {errorMsg}
            </div>
          )}

          {status === 'success' && (
            <div className="hp-auth__alert hp-auth__alert--success">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              Login successful. Redirecting...
            </div>
          )}

          <form className="hp-auth__form" onSubmit={handleSubmit}>
            <div className="hp-auth__field">
              <label htmlFor="login-email">Email Address</label>
              <input
                id="login-email"
                name="email"
                type="email"
                required
                value={form.email}
                onChange={handleChange}
                placeholder="you@company.com"
                disabled={status === 'loading' || status === 'success'}
              />
            </div>
            <div className="hp-auth__field">
              <label htmlFor="login-password">Password</label>
              <input
                id="login-password"
                name="password"
                type="password"
                required
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your password"
                disabled={status === 'loading' || status === 'success'}
              />
            </div>
            <div className="hp-auth__forgot">
              <Link to="/forgot-password">Forgot password?</Link>
            </div>
            <button
              type="submit"
              className="hp-btn hp-btn--primary hp-btn--full"
              disabled={status === 'loading' || status === 'success'}
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

          <p className="hp-auth__footer">
            Don't have an account? <Link to="/register">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
