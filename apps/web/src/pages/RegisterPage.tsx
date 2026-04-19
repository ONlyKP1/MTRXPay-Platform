import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'error' | 'success'>('idle');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (form.password.length < 8) {
      setStatus('error');
      setErrorMsg('Password must be at least 8 characters.');
      return;
    }

    if (form.password !== form.confirmPassword) {
      setStatus('error');
      setErrorMsg('Passwords do not match.');
      return;
    }

    setStatus('loading');

    // Simulate API call
    await new Promise((r) => setTimeout(r, 1500));

    setStatus('success');
    setTimeout(() => navigate('/login'), 1500);
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
          <h1 className="hp-auth__title">Create <em>Account</em></h1>
          <p className="hp-auth__subtitle">Start your merchant onboarding journey</p>

          {status === 'error' && (
            <div className="hp-auth__alert hp-auth__alert--error">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
              {errorMsg}
            </div>
          )}

          {status === 'success' && (
            <div className="hp-auth__alert hp-auth__alert--success">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              Account created successfully. Redirecting to login...
            </div>
          )}

          <form className="hp-auth__form" onSubmit={handleSubmit}>
            <div className="hp-auth__row">
              <div className="hp-auth__field">
                <label htmlFor="reg-first">First Name</label>
                <input
                  id="reg-first"
                  name="firstName"
                  type="text"
                  required
                  value={form.firstName}
                  onChange={handleChange}
                  placeholder="John"
                  disabled={status === 'loading' || status === 'success'}
                />
              </div>
              <div className="hp-auth__field">
                <label htmlFor="reg-last">Last Name</label>
                <input
                  id="reg-last"
                  name="lastName"
                  type="text"
                  required
                  value={form.lastName}
                  onChange={handleChange}
                  placeholder="Smith"
                  disabled={status === 'loading' || status === 'success'}
                />
              </div>
            </div>

            <div className="hp-auth__field">
              <label htmlFor="reg-phone">Phone Number</label>
              <input
                id="reg-phone"
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                placeholder="+44 7700 000000"
                disabled={status === 'loading' || status === 'success'}
              />
            </div>

            <div className="hp-auth__field">
              <label htmlFor="reg-email">Email Address</label>
              <input
                id="reg-email"
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
              <label htmlFor="reg-password">Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="reg-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Create a strong password"
                  disabled={status === 'loading' || status === 'success'}
                  style={{ paddingRight: '3rem' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--gold)', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase' }}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <div className="hp-auth__field">
              <label htmlFor="reg-confirm">Confirm Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="reg-confirm"
                  name="confirmPassword"
                  type={showConfirm ? 'text' : 'password'}
                  required
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  disabled={status === 'loading' || status === 'success'}
                  style={{ paddingRight: '3rem' }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  aria-label={showConfirm ? 'Hide password' : 'Show password'}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--gold)', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase' }}
                >
                  {showConfirm ? 'Hide' : 'Show'}
                </button>
              </div>
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
                'Create Account'
              )}
            </button>
          </form>

          <p className="hp-auth__footer">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
