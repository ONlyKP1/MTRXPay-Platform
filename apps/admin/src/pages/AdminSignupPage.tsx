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
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => { const n = { ...prev }; delete n[name]; return n; });
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!form.firstName.trim()) errs.firstName = 'Required';
    if (!form.lastName.trim()) errs.lastName = 'Required';
    if (!form.email.trim()) errs.email = 'Required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Enter a valid email';
    if (!form.phone.trim()) errs.phone = 'Required';
    if (!form.companyName.trim()) errs.companyName = 'Required';
    if (!form.industry) errs.industry = 'Select an industry';
    if (!form.password) errs.password = 'Required';
    else if (form.password.length < 8) errs.password = 'Min. 8 characters';
    if (!form.confirmPassword) errs.confirmPassword = 'Required';
    else if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      setStatus('error');
      return;
    }
    setStatus('loading');

    await new Promise(r => setTimeout(r, 1500));
    setStatus('success');
    setTimeout(() => navigate('/onboarding'), 1500);
  };

  const disabled = status === 'loading' || status === 'success';

  const fieldError = (name: string) =>
    errors[name] ? <span className="hp-onboarding__field-error">{errors[name]}</span> : null;

  // ── Success confirmation ──
  if (status === 'success') {
    return (
      <div className="hp-auth">
        <div className="hp-auth__bg">
          <video src="/hero-bg.mp4" autoPlay muted loop playsInline aria-hidden="true" className="hp-auth__bg-video" />
          <div className="hp-auth__bg-overlay" />
          <div className="hp-auth__glow hp-auth__glow--1" />
          <div className="hp-auth__glow hp-auth__glow--2" />
        </div>
        <div className="hp-auth__container">
          <div className="hp-auth__card" style={{ textAlign: 'center' }}>
            <div className="hp-confirm__icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <h1 className="hp-confirm__title">Account <em>Created</em></h1>
            <p className="hp-confirm__subtitle">
              Welcome aboard, {form.firstName}! Your merchant account for <strong>{form.companyName}</strong> has been created.
            </p>
            <div className="hp-confirm__info">
              You'll now be redirected to complete your onboarding — this includes business verification, compliance documents, and payment configuration.
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, color: 'var(--hp-text-muted)', fontSize: '0.85rem' }}>
              <span className="hp-auth__spinner" />
              Redirecting to onboarding...
            </div>
          </div>
        </div>
      </div>
    );
  }

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

          {status === 'error' && Object.keys(errors).length > 0 && (
            <div className="hp-auth__alert hp-auth__alert--error">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
              Please fix the highlighted fields below.
            </div>
          )}

          <form className="hp-auth__form hp-auth__form--compact" onSubmit={handleSubmit} noValidate>
            <div className="hp-auth__row">
              <div className="hp-auth__field">
                <label htmlFor="signup-first">First Name <span className="hp-required">*</span></label>
                <input id="signup-first" name="firstName" type="text" value={form.firstName} onChange={handleChange} placeholder="John" disabled={disabled} className={errors.firstName ? 'hp-auth__input--error' : ''} />
                {fieldError('firstName')}
              </div>
              <div className="hp-auth__field">
                <label htmlFor="signup-last">Last Name <span className="hp-required">*</span></label>
                <input id="signup-last" name="lastName" type="text" value={form.lastName} onChange={handleChange} placeholder="Smith" disabled={disabled} className={errors.lastName ? 'hp-auth__input--error' : ''} />
                {fieldError('lastName')}
              </div>
            </div>

            <div className="hp-auth__field">
              <label htmlFor="signup-email">Business Email <span className="hp-required">*</span></label>
              <input id="signup-email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@yourcompany.com" disabled={disabled} autoComplete="email" className={errors.email ? 'hp-auth__input--error' : ''} />
              {fieldError('email')}
            </div>

            <div className="hp-auth__field">
              <label htmlFor="signup-phone">Phone Number <span className="hp-required">*</span></label>
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
                <input id="signup-phone" name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="7700 900000" disabled={disabled} className={errors.phone ? 'hp-auth__input--error' : ''} />
              </div>
              {fieldError('phone')}
            </div>

            <div className="hp-auth__field">
              <label htmlFor="signup-company">Company Name <span className="hp-required">*</span></label>
              <input id="signup-company" name="companyName" type="text" value={form.companyName} onChange={handleChange} placeholder="Your Company Ltd" disabled={disabled} className={errors.companyName ? 'hp-auth__input--error' : ''} />
              {fieldError('companyName')}
            </div>

            <div className="hp-auth__field">
              <label htmlFor="signup-industry">Industry <span className="hp-required">*</span></label>
              <select id="signup-industry" name="industry" value={form.industry} onChange={handleChange} disabled={disabled} className={`hp-auth__select ${errors.industry ? 'hp-auth__input--error' : ''}`}>
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
              {fieldError('industry')}
            </div>

            <div className="hp-auth__row">
              <div className="hp-auth__field">
                <label htmlFor="signup-pass">Password <span className="hp-required">*</span></label>
                <input id="signup-pass" name="password" type="password" value={form.password} onChange={handleChange} placeholder="Min. 8 characters" disabled={disabled} autoComplete="new-password" className={errors.password ? 'hp-auth__input--error' : ''} />
                {fieldError('password')}
              </div>
              <div className="hp-auth__field">
                <label htmlFor="signup-confirm">Confirm Password <span className="hp-required">*</span></label>
                <input id="signup-confirm" name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} placeholder="Re-enter password" disabled={disabled} autoComplete="new-password" className={errors.confirmPassword ? 'hp-auth__input--error' : ''} />
                {fieldError('confirmPassword')}
              </div>
            </div>

            <button type="submit" className="hp-auth__submit" disabled={disabled}>
              {status === 'loading' ? <span className="hp-auth__spinner" /> : 'Create Merchant Account'}
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
