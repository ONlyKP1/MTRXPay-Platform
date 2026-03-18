import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export function AdminSignupPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    countryCode: '+44',
    phone: '',
    companyName: '',
    industry: '',
    password: '',
    confirmPassword: '',
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

    setStatus('success');
    setTimeout(() => navigate('/onboarding'), 1500);
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

          <h1 className="hp-auth__title">Get <em>Started</em></h1>
          <p className="hp-auth__subtitle">Create your merchant account and start accepting payments</p>

          {status === 'error' && (
            <div className="hp-auth__alert hp-auth__alert--error">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
              {errorMsg}
            </div>
          )}

          {status === 'success' && (
            <div className="hp-auth__alert hp-auth__alert--success">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              Account created. Starting onboarding...
            </div>
          )}

          <form className="hp-auth__form hp-auth__form--compact" onSubmit={handleSubmit}>
            <div className="hp-auth__row">
              <div className="hp-auth__field">
                <label htmlFor="signup-first">First Name</label>
                <input id="signup-first" name="firstName" type="text" required value={form.firstName} onChange={handleChange} placeholder="John" disabled={disabled} />
              </div>
              <div className="hp-auth__field">
                <label htmlFor="signup-last">Last Name</label>
                <input id="signup-last" name="lastName" type="text" required value={form.lastName} onChange={handleChange} placeholder="Smith" disabled={disabled} />
              </div>
            </div>

            <div className="hp-auth__field">
              <label htmlFor="signup-email">Business Email</label>
              <input id="signup-email" name="email" type="email" required value={form.email} onChange={handleChange} placeholder="you@yourcompany.com" disabled={disabled} autoComplete="email" />
            </div>

            <div className="hp-auth__field">
              <label htmlFor="signup-phone">Phone Number</label>
              <div className="hp-auth__phone-row">
                <select name="countryCode" value={form.countryCode} onChange={handleChange} disabled={disabled} className="hp-auth__select hp-auth__country-code">
                  <option value="+44">UK +44</option>
                  <option value="+1">US +1</option>
                  <option value="+353">Ireland +353</option>
                  <option value="+49">Germany +49</option>
                  <option value="+33">France +33</option>
                  <option value="+34">Spain +34</option>
                  <option value="+39">Italy +39</option>
                  <option value="+31">Netherlands +31</option>
                  <option value="+351">Portugal +351</option>
                  <option value="+41">Switzerland +41</option>
                  <option value="+43">Austria +43</option>
                  <option value="+46">Sweden +46</option>
                  <option value="+47">Norway +47</option>
                  <option value="+45">Denmark +45</option>
                  <option value="+358">Finland +358</option>
                  <option value="+48">Poland +48</option>
                  <option value="+356">Malta +356</option>
                  <option value="+357">Cyprus +357</option>
                  <option value="+971">UAE +971</option>
                  <option value="+966">Saudi +966</option>
                  <option value="+91">India +91</option>
                  <option value="+61">Australia +61</option>
                  <option value="+64">New Zealand +64</option>
                  <option value="+27">South Africa +27</option>
                  <option value="+234">Nigeria +234</option>
                  <option value="+55">Brazil +55</option>
                  <option value="+52">Mexico +52</option>
                  <option value="+81">Japan +81</option>
                  <option value="+82">South Korea +82</option>
                  <option value="+65">Singapore +65</option>
                  <option value="+852">Hong Kong +852</option>
                </select>
                <input id="signup-phone" name="phone" type="tel" required value={form.phone} onChange={handleChange} placeholder="7700 900000" disabled={disabled} />
              </div>
            </div>

            <div className="hp-auth__field">
              <label htmlFor="signup-company">Company Name</label>
              <input id="signup-company" name="companyName" type="text" required value={form.companyName} onChange={handleChange} placeholder="Your Company Ltd" disabled={disabled} />
            </div>

            <div className="hp-auth__field">
              <label htmlFor="signup-industry">Industry</label>
              <select id="signup-industry" name="industry" value={form.industry} onChange={handleChange} disabled={disabled} className="hp-auth__select">
                <option value="">Select your industry...</option>
                <option value="crypto">Cryptocurrency & Web3</option>
                <option value="gaming">Gaming & iGaming</option>
                <option value="adult">Adult Entertainment</option>
                <option value="cbd">CBD & Cannabis</option>
                <option value="nutra">Nutraceuticals</option>
                <option value="forex">Forex & Trading</option>
                <option value="travel">Travel & Tourism</option>
                <option value="ecommerce">E-commerce & Retail</option>
                <option value="saas">SaaS & Technology</option>
                <option value="content">Content Creators</option>
                <option value="other">Other</option>
              </select>
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
              {status === 'loading' ? <span className="hp-auth__spinner" /> : status === 'success' ? 'Starting onboarding...' : 'Create Merchant Account'}
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
