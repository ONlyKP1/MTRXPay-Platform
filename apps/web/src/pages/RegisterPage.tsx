import { useState } from 'react';
import { Link } from 'react-router-dom';

export function RegisterPage() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Register submitted:', form);
    alert('Registration is not yet connected. This is a placeholder.');
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
          <h1 className="hp-auth__title">Create <em>Account</em></h1>
          <p className="hp-auth__subtitle">Start your merchant onboarding journey</p>

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
                />
              </div>
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
              />
            </div>

            <div className="hp-auth__field">
              <label htmlFor="reg-phone">Phone Number</label>
              <input
                id="reg-phone"
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                placeholder="+44 7700 900000"
              />
            </div>

            <div className="hp-auth__field">
              <label htmlFor="reg-password">Password</label>
              <input
                id="reg-password"
                name="password"
                type="password"
                required
                value={form.password}
                onChange={handleChange}
                placeholder="Create a strong password"
              />
            </div>

            <div className="hp-auth__field">
              <label htmlFor="reg-confirm">Confirm Password</label>
              <input
                id="reg-confirm"
                name="confirmPassword"
                type="password"
                required
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
              />
            </div>

            <button type="submit" className="hp-btn hp-btn--primary hp-btn--full">
              Create Account
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
