import { useState } from 'react';
import { Link } from 'react-router-dom';

export function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login submitted:', form);
    alert('Login is not yet connected. This is a placeholder.');
  };

  return (
    <div className="hp-auth">
      <div className="hp-auth__bg">
        <div className="hp-auth__glow hp-auth__glow--1" />
        <div className="hp-auth__glow hp-auth__glow--2" />
      </div>
      <div className="hp-auth__container">
        <Link to="/" className="hp-auth__logo">
          <img src="/logo.png" alt="MTRX PAY" />
        </Link>
        <div className="hp-auth__card">
          <h1 className="hp-auth__title">Welcome <em>Back</em></h1>
          <p className="hp-auth__subtitle">Sign in to access your merchant dashboard</p>

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
              />
            </div>
            <div className="hp-auth__forgot">
              <Link to="/forgot-password">Forgot password?</Link>
            </div>
            <button type="submit" className="hp-btn hp-btn--primary hp-btn--full">
              Sign In
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
