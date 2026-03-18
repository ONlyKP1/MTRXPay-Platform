import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export function AdminSignupPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'support',
    inviteCode: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'error' | 'success'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');

    await new Promise((r) => setTimeout(r, 1200));

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

    if (!form.inviteCode) {
      setStatus('error');
      setErrorMsg('A valid invite code is required to create an admin account.');
      return;
    }

    setStatus('success');
    setTimeout(() => navigate('/login'), 1500);
  };

  const disabled = status === 'loading' || status === 'success';

  return (
    <div className="hp-auth">
      <div className="hp-auth__bg">
        <video src="/hero-bg.mp4" autoPlay muted loop playsInline aria-hidden="true" className="hp-auth__bg-video" />
        <div className="hp-auth__bg-overlay" />
        <div className="hp-auth__glow hp-auth__glow--1" />
        <div className="hp-auth__glow hp-auth__glow--2" />
      </div>

      <div className="hp-auth__container">
        <div className="hp-auth__card">
          <Link to="/login" className="hp-auth__logo-inner">
            <img src="/logo.png" alt="MTRX PAY" />
          </Link>

          <h1 className="hp-auth__title">Create <em>Account</em></h1>
          <p className="hp-auth__subtitle">Register as an administrator on the MTRX platform</p>

          {status === 'error' && (
            <div className="hp-auth__alert hp-auth__alert--error">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
              {errorMsg}
            </div>
          )}

          {status === 'success' && (
            <div className="hp-auth__alert hp-auth__alert--success">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              Account created. Redirecting to login...
            </div>
          )}

          <form className="hp-auth__form" onSubmit={handleSubmit}>
            <div className="hp-auth__row">
              <div className="hp-auth__field">
                <label htmlFor="signup-first">First Name</label>
                <input id="signup-first" name="firstName" type="text" required value={form.firstName} onChange={handleChange} placeholder="James" disabled={disabled} />
              </div>
              <div className="hp-auth__field">
                <label htmlFor="signup-last">Last Name</label>
                <input id="signup-last" name="lastName" type="text" required value={form.lastName} onChange={handleChange} placeholder="Mitchell" disabled={disabled} />
              </div>
            </div>

            <div className="hp-auth__field">
              <label htmlFor="signup-email">Work Email</label>
              <input id="signup-email" name="email" type="email" required value={form.email} onChange={handleChange} placeholder="james@mtrxpay.com" disabled={disabled} autoComplete="email" />
            </div>

            <div className="hp-auth__field">
              <label htmlFor="signup-phone">Phone Number</label>
              <input id="signup-phone" name="phone" type="tel" required value={form.phone} onChange={handleChange} placeholder="+44 7700 900000" disabled={disabled} />
            </div>

            <div className="hp-auth__field">
              <label htmlFor="signup-role">Role</label>
              <select id="signup-role" name="role" value={form.role} onChange={handleChange} disabled={disabled} className="hp-auth__select">
                <option value="support">Support Agent</option>
                <option value="compliance_officer">Compliance Officer</option>
                <option value="finance">Finance</option>
                <option value="super_admin">Super Administrator</option>
              </select>
            </div>

            <div className="hp-auth__field">
              <label htmlFor="signup-invite">Invite Code</label>
              <input id="signup-invite" name="inviteCode" type="text" required value={form.inviteCode} onChange={handleChange} placeholder="Enter your organisation invite code" disabled={disabled} />
            </div>

            <div className="hp-auth__row">
              <div className="hp-auth__field">
                <label htmlFor="signup-pass">Password</label>
                <input id="signup-pass" name="password" type="password" required value={form.password} onChange={handleChange} placeholder="Min. 8 characters" disabled={disabled} autoComplete="new-password" />
              </div>
              <div className="hp-auth__field">
                <label htmlFor="signup-confirm">Confirm Password</label>
                <input id="signup-confirm" name="confirmPassword" type="password" required value={form.confirmPassword} onChange={handleChange} placeholder="Re-enter password" disabled={disabled} autoComplete="new-password" />
              </div>
            </div>

            <button type="submit" className="hp-auth__submit" disabled={disabled}>
              {status === 'loading' ? <span className="hp-auth__spinner" /> : status === 'success' ? 'Redirecting...' : 'Create Account'}
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
