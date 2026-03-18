import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ProgressStepper, FormSection, FormRow, FormActions } from '@mtrx/ui';

const steps = [
  { number: 1, label: 'Business Info' },
  { number: 2, label: 'Compliance' },
  { number: 3, label: 'Processing' },
  { number: 4, label: 'Review' },
];

const industryLabels: Record<string, string> = {
  crypto: 'Cryptocurrency & Web3',
  gaming: 'Gaming & iGaming',
  adult: 'Adult Entertainment',
  cbd: 'CBD & Cannabis',
  nutra: 'Nutraceuticals',
  forex: 'Forex & Trading',
  travel: 'Travel & Tourism',
  ecommerce: 'E-commerce & Retail',
  saas: 'SaaS & Technology',
};

const countryLabels: Record<string, string> = {
  GB: 'United Kingdom',
  MT: 'Malta',
  CY: 'Cyprus',
  AE: 'United Arab Emirates',
  CH: 'Switzerland',
  US: 'United States',
};

export function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'submitting' | 'submitted'>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [uploadedDocs, setUploadedDocs] = useState<Record<string, boolean>>({});
  const [form, setForm] = useState({
    legalName: '',
    tradingName: '',
    registrationNumber: '',
    incorporationCountry: 'GB',
    address: '',
    city: '',
    postcode: '',
    website: '',
    industry: '',
    directorFirstName: '',
    directorLastName: '',
    directorDob: '',
    directorNationality: '',
    amlPolicy: false,
    termsAccepted: false,
    expectedMonthlyVolume: '',
    averageTransactionValue: '',
    currencies: [] as string[],
    paymentMethods: [] as string[],
    settlementCurrency: 'GBP',
    bankAccountName: '',
    sortCode: '',
    accountNumber: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setForm(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
    if (errors[name]) setErrors(prev => { const n = { ...prev }; delete n[name]; return n; });
  };

  const toggleArrayItem = (field: 'currencies' | 'paymentMethods', item: string) => {
    setForm(prev => ({
      ...prev,
      [field]: prev[field].includes(item)
        ? prev[field].filter(i => i !== item)
        : [...prev[field], item],
    }));
  };

  const simulateUpload = (docName: string) => {
    setUploadedDocs(prev => ({ ...prev, [docName]: true }));
  };

  const validateStep = (step: number): boolean => {
    const errs: Record<string, string> = {};

    if (step === 1) {
      if (!form.legalName.trim()) errs.legalName = 'Required';
      if (!form.registrationNumber.trim()) errs.registrationNumber = 'Required';
      if (!form.address.trim()) errs.address = 'Required';
      if (!form.city.trim()) errs.city = 'Required';
      if (!form.postcode.trim()) errs.postcode = 'Required';
      if (!form.industry) errs.industry = 'Select an industry';
    }

    if (step === 2) {
      if (!form.directorFirstName.trim()) errs.directorFirstName = 'Required';
      if (!form.directorLastName.trim()) errs.directorLastName = 'Required';
      if (!form.directorDob) errs.directorDob = 'Required';
      if (!form.directorNationality.trim()) errs.directorNationality = 'Required';
      if (!form.termsAccepted) errs.termsAccepted = 'You must accept the terms';
    }

    if (step === 3) {
      if (!form.expectedMonthlyVolume) errs.expectedMonthlyVolume = 'Select a range';
      if (form.currencies.length === 0) errs.currencies = 'Select at least one';
      if (form.paymentMethods.length === 0) errs.paymentMethods = 'Select at least one';
      if (!form.bankAccountName.trim()) errs.bankAccountName = 'Required';
      if (!form.sortCode.trim()) errs.sortCode = 'Required';
      if (!form.accountNumber.trim()) errs.accountNumber = 'Required';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const next = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(s => Math.min(s + 1, 4));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prev = () => {
    setErrors({});
    setCurrentStep(s => Math.max(s - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToStep = (step: number) => {
    if (step < currentStep) {
      setErrors({});
      setCurrentStep(step);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = async () => {
    setSubmitStatus('submitting');
    await new Promise(r => setTimeout(r, 2000));
    setSubmitStatus('submitted');
  };

  const fieldError = (name: string) =>
    errors[name] ? <span className="hp-onboarding__field-error">{errors[name]}</span> : null;

  // ── Confirmation page ──
  if (submitStatus === 'submitted') {
    return (
      <div className="hp-auth hp-auth--onboarding">
        <div className="hp-auth__bg">
          <video src="/hero-bg.mp4" autoPlay muted loop playsInline aria-hidden="true" className="hp-auth__bg-video" />
          <div className="hp-auth__bg-overlay" />
        </div>

        <div className="hp-onboarding hp-onboarding--confirmation">
          <div className="hp-onboarding__card" style={{ textAlign: 'center' }}>
            <div className="hp-confirm__icon">
              <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>

            <h1 className="hp-confirm__title">Application <em>Submitted</em></h1>
            <p className="hp-confirm__subtitle">
              Your merchant application has been received and is now under review by our compliance team.
            </p>

            <div className="hp-confirm__timeline">
              <div className="hp-confirm__timeline-item hp-confirm__timeline-item--done">
                <div className="hp-confirm__timeline-dot" />
                <div>
                  <strong>Application received</strong>
                  <span>Just now</span>
                </div>
              </div>
              <div className="hp-confirm__timeline-item hp-confirm__timeline-item--active">
                <div className="hp-confirm__timeline-dot" />
                <div>
                  <strong>KYC/KYB verification</strong>
                  <span>In progress — typically 2-4 hours</span>
                </div>
              </div>
              <div className="hp-confirm__timeline-item">
                <div className="hp-confirm__timeline-dot" />
                <div>
                  <strong>Compliance review</strong>
                  <span>Pending</span>
                </div>
              </div>
              <div className="hp-confirm__timeline-item">
                <div className="hp-confirm__timeline-dot" />
                <div>
                  <strong>Account activation</strong>
                  <span>Go live within 24 hours</span>
                </div>
              </div>
            </div>

            <div className="hp-confirm__ref">
              <span>Application Reference</span>
              <code>APP-{Math.random().toString(36).substring(2, 8).toUpperCase()}</code>
            </div>

            <div className="hp-confirm__info">
              We'll send updates to <strong>{form.tradingName || form.legalName || 'your'}</strong>'s registered email.
              If we need additional documents, our team will reach out directly.
            </div>

            <div className="hp-confirm__actions">
              <Link to="/login" className="mtrx-btn mtrx-btn--primary mtrx-btn--md">Go to Dashboard</Link>
              <Link to="/" className="mtrx-btn mtrx-btn--secondary mtrx-btn--md">Back to Home</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="hp-auth hp-auth--onboarding">
      <div className="hp-auth__bg">
        <video src="/hero-bg.mp4" autoPlay muted loop playsInline aria-hidden="true" className="hp-auth__bg-video" />
        <div className="hp-auth__bg-overlay" />
      </div>

      <div className="hp-onboarding">
        <div className="hp-onboarding__header">
          <img src="/logo.png" alt="MTRX PAY" className="hp-onboarding__logo" />
          <h1 className="hp-onboarding__title">Merchant <em>Onboarding</em></h1>
          <p className="hp-onboarding__subtitle">Complete the steps below to activate your merchant account</p>
        </div>

        <ProgressStepper steps={steps} currentStep={currentStep} />

        {/* Step indicator text */}
        <div className="hp-onboarding__step-info">
          Step {currentStep} of 4 — {steps[currentStep - 1].label}
        </div>

        <div className="hp-onboarding__card">
          {currentStep === 1 && (
            <FormSection title="Business Information" description="Tell us about your business entity.">
              <FormRow>
                <div className="hp-auth__field">
                  <label>Legal Name <span className="hp-required">*</span></label>
                  <input name="legalName" value={form.legalName} onChange={handleChange} placeholder="MTRX PAY LIMITED" className={errors.legalName ? 'hp-auth__input--error' : ''} />
                  {fieldError('legalName')}
                </div>
                <div className="hp-auth__field">
                  <label>Trading Name</label>
                  <input name="tradingName" value={form.tradingName} onChange={handleChange} placeholder="MTRX Pay" />
                </div>
              </FormRow>
              <FormRow>
                <div className="hp-auth__field">
                  <label>Registration Number <span className="hp-required">*</span></label>
                  <input name="registrationNumber" value={form.registrationNumber} onChange={handleChange} placeholder="e.g. 16913646" className={errors.registrationNumber ? 'hp-auth__input--error' : ''} />
                  {fieldError('registrationNumber')}
                </div>
                <div className="hp-auth__field">
                  <label>Country of Incorporation</label>
                  <select name="incorporationCountry" value={form.incorporationCountry} onChange={handleChange} className="hp-auth__select">
                    <option value="GB">United Kingdom</option>
                    <option value="MT">Malta</option>
                    <option value="CY">Cyprus</option>
                    <option value="AE">United Arab Emirates</option>
                    <option value="CH">Switzerland</option>
                    <option value="US">United States</option>
                  </select>
                </div>
              </FormRow>
              <div className="hp-auth__field">
                <label>Registered Address <span className="hp-required">*</span></label>
                <input name="address" value={form.address} onChange={handleChange} placeholder="71-75 Shelton Street" className={errors.address ? 'hp-auth__input--error' : ''} />
                {fieldError('address')}
              </div>
              <FormRow>
                <div className="hp-auth__field">
                  <label>City <span className="hp-required">*</span></label>
                  <input name="city" value={form.city} onChange={handleChange} placeholder="London" className={errors.city ? 'hp-auth__input--error' : ''} />
                  {fieldError('city')}
                </div>
                <div className="hp-auth__field">
                  <label>Postcode <span className="hp-required">*</span></label>
                  <input name="postcode" value={form.postcode} onChange={handleChange} placeholder="WC2H 9JQ" className={errors.postcode ? 'hp-auth__input--error' : ''} />
                  {fieldError('postcode')}
                </div>
              </FormRow>
              <FormRow>
                <div className="hp-auth__field">
                  <label>Website</label>
                  <input name="website" value={form.website} onChange={handleChange} placeholder="https://yourcompany.com" />
                </div>
                <div className="hp-auth__field">
                  <label>Industry <span className="hp-required">*</span></label>
                  <select name="industry" value={form.industry} onChange={handleChange} className={`hp-auth__select ${errors.industry ? 'hp-auth__input--error' : ''}`}>
                    <option value="">Select industry...</option>
                    <option value="crypto">Cryptocurrency & Web3</option>
                    <option value="gaming">Gaming & iGaming</option>
                    <option value="adult">Adult Entertainment</option>
                    <option value="cbd">CBD & Cannabis</option>
                    <option value="nutra">Nutraceuticals</option>
                    <option value="forex">Forex & Trading</option>
                    <option value="travel">Travel & Tourism</option>
                    <option value="ecommerce">E-commerce & Retail</option>
                    <option value="saas">SaaS & Technology</option>
                  </select>
                  {fieldError('industry')}
                </div>
              </FormRow>
            </FormSection>
          )}

          {currentStep === 2 && (
            <FormSection title="Compliance & Director" description="Provide director details for KYC/KYB verification.">
              <FormRow>
                <div className="hp-auth__field">
                  <label>Director First Name <span className="hp-required">*</span></label>
                  <input name="directorFirstName" value={form.directorFirstName} onChange={handleChange} placeholder="John" className={errors.directorFirstName ? 'hp-auth__input--error' : ''} />
                  {fieldError('directorFirstName')}
                </div>
                <div className="hp-auth__field">
                  <label>Director Last Name <span className="hp-required">*</span></label>
                  <input name="directorLastName" value={form.directorLastName} onChange={handleChange} placeholder="Smith" className={errors.directorLastName ? 'hp-auth__input--error' : ''} />
                  {fieldError('directorLastName')}
                </div>
              </FormRow>
              <FormRow>
                <div className="hp-auth__field">
                  <label>Date of Birth <span className="hp-required">*</span></label>
                  <input name="directorDob" type="date" value={form.directorDob} onChange={handleChange} className={errors.directorDob ? 'hp-auth__input--error' : ''} />
                  {fieldError('directorDob')}
                </div>
                <div className="hp-auth__field">
                  <label>Nationality <span className="hp-required">*</span></label>
                  <input name="directorNationality" value={form.directorNationality} onChange={handleChange} placeholder="e.g. British" list="nationality-list" className={errors.directorNationality ? 'hp-auth__input--error' : ''} />
                  {fieldError('directorNationality')}
                  <datalist id="nationality-list">
                    <option value="British" /><option value="American" /><option value="Canadian" /><option value="Australian" />
                    <option value="Irish" /><option value="German" /><option value="French" /><option value="Spanish" />
                    <option value="Italian" /><option value="Dutch" /><option value="Portuguese" /><option value="Swiss" />
                    <option value="Austrian" /><option value="Swedish" /><option value="Norwegian" /><option value="Danish" />
                    <option value="Finnish" /><option value="Polish" /><option value="Maltese" /><option value="Cypriot" />
                    <option value="Emirati" /><option value="Saudi" /><option value="Indian" /><option value="South African" />
                    <option value="Nigerian" /><option value="Brazilian" /><option value="Mexican" /><option value="Japanese" />
                    <option value="South Korean" /><option value="Singaporean" /><option value="Chinese" /><option value="New Zealander" />
                  </datalist>
                </div>
              </FormRow>

              <div className="hp-onboarding__upload">
                <h4>Required Documents</h4>
                <div className="hp-onboarding__upload-list">
                  {[
                    'Certificate of Incorporation',
                    'Director ID (Passport / Driving Licence)',
                    'Proof of Address (Utility Bill / Bank Statement)',
                    'AML Policy Document',
                  ].map(doc => (
                    <div key={doc} className={`hp-onboarding__upload-item ${uploadedDocs[doc] ? 'hp-onboarding__upload-item--done' : ''}`}>
                      <div className="hp-onboarding__upload-info">
                        {uploadedDocs[doc] && (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="hp-onboarding__upload-check">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                        <span>{doc}</span>
                      </div>
                      <button
                        type="button"
                        className={`mtrx-btn mtrx-btn--sm ${uploadedDocs[doc] ? 'mtrx-btn--ghost' : 'mtrx-btn--secondary'}`}
                        onClick={() => simulateUpload(doc)}
                      >
                        {uploadedDocs[doc] ? 'Replace' : 'Upload'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="hp-onboarding__checks">
                <label className="hp-onboarding__checkbox">
                  <input type="checkbox" name="amlPolicy" checked={form.amlPolicy} onChange={handleChange} />
                  <span>I confirm this business has an AML/CFT policy in place</span>
                </label>
                <label className={`hp-onboarding__checkbox ${errors.termsAccepted ? 'hp-onboarding__checkbox--error' : ''}`}>
                  <input type="checkbox" name="termsAccepted" checked={form.termsAccepted} onChange={handleChange} />
                  <span>I accept the MTRX Pay <a href="#terms">Terms of Service</a> and <a href="#privacy">Privacy Policy</a> <span className="hp-required">*</span></span>
                </label>
                {fieldError('termsAccepted')}
              </div>
            </FormSection>
          )}

          {currentStep === 3 && (
            <FormSection title="Processing Configuration" description="Set up your payment processing and settlement preferences.">
              <FormRow>
                <div className="hp-auth__field">
                  <label>Expected Monthly Volume <span className="hp-required">*</span></label>
                  <select name="expectedMonthlyVolume" value={form.expectedMonthlyVolume} onChange={handleChange} className={`hp-auth__select ${errors.expectedMonthlyVolume ? 'hp-auth__input--error' : ''}`}>
                    <option value="">Select range...</option>
                    <option value="0-50k">£0 — £50,000</option>
                    <option value="50k-250k">£50,000 — £250,000</option>
                    <option value="250k-1m">£250,000 — £1,000,000</option>
                    <option value="1m-5m">£1,000,000 — £5,000,000</option>
                    <option value="5m+">£5,000,000+</option>
                  </select>
                  {fieldError('expectedMonthlyVolume')}
                </div>
                <div className="hp-auth__field">
                  <label>Average Transaction Value</label>
                  <input name="averageTransactionValue" value={form.averageTransactionValue} onChange={handleChange} placeholder="e.g. £150" />
                </div>
              </FormRow>

              <div className="hp-onboarding__pill-group">
                <label>Currencies <span className="hp-required">*</span></label>
                <div className="hp-onboarding__pills">
                  {['GBP', 'EUR', 'USD', 'AED'].map(c => (
                    <button key={c} type="button" className={`hp-onboarding__pill${form.currencies.includes(c) ? ' hp-onboarding__pill--active' : ''}`} onClick={() => toggleArrayItem('currencies', c)}>{c}</button>
                  ))}
                </div>
                {fieldError('currencies')}
              </div>

              <div className="hp-onboarding__pill-group">
                <label>Payment Methods <span className="hp-required">*</span></label>
                <div className="hp-onboarding__pills">
                  {['Visa', 'Mastercard', 'Amex', 'BACS', 'SEPA', 'Faster Payments', 'Wire Transfer'].map(m => (
                    <button key={m} type="button" className={`hp-onboarding__pill${form.paymentMethods.includes(m) ? ' hp-onboarding__pill--active' : ''}`} onClick={() => toggleArrayItem('paymentMethods', m)}>{m}</button>
                  ))}
                </div>
                {fieldError('paymentMethods')}
              </div>

              <FormSection title="Settlement Bank Account" description="Where should we send your funds?">
                <div className="hp-auth__field">
                  <label>Account Name <span className="hp-required">*</span></label>
                  <input name="bankAccountName" value={form.bankAccountName} onChange={handleChange} placeholder="Your Company Ltd" className={errors.bankAccountName ? 'hp-auth__input--error' : ''} />
                  {fieldError('bankAccountName')}
                </div>
                <FormRow>
                  <div className="hp-auth__field">
                    <label>Sort Code <span className="hp-required">*</span></label>
                    <input name="sortCode" value={form.sortCode} onChange={handleChange} placeholder="12-34-56" className={errors.sortCode ? 'hp-auth__input--error' : ''} />
                    {fieldError('sortCode')}
                  </div>
                  <div className="hp-auth__field">
                    <label>Account Number <span className="hp-required">*</span></label>
                    <input name="accountNumber" value={form.accountNumber} onChange={handleChange} placeholder="12345678" className={errors.accountNumber ? 'hp-auth__input--error' : ''} />
                    {fieldError('accountNumber')}
                  </div>
                </FormRow>
              </FormSection>
            </FormSection>
          )}

          {currentStep === 4 && (
            <FormSection title="Review & Submit" description="Please review your details before submitting.">
              <div className="hp-onboarding__review">
                <div className="hp-onboarding__review-section">
                  <div className="hp-onboarding__review-header">
                    <h4>Business</h4>
                    <button type="button" className="hp-onboarding__edit-link" onClick={() => goToStep(1)}>Edit</button>
                  </div>
                  <div className="hp-onboarding__review-row"><span>Legal Name</span><strong>{form.legalName || '—'}</strong></div>
                  <div className="hp-onboarding__review-row"><span>Trading Name</span><span>{form.tradingName || '—'}</span></div>
                  <div className="hp-onboarding__review-row"><span>Registration</span><span className="admin-mono">{form.registrationNumber || '—'}</span></div>
                  <div className="hp-onboarding__review-row"><span>Country</span><span>{countryLabels[form.incorporationCountry] || form.incorporationCountry}</span></div>
                  <div className="hp-onboarding__review-row"><span>Industry</span><span>{industryLabels[form.industry] || form.industry || '—'}</span></div>
                  <div className="hp-onboarding__review-row"><span>Website</span><span>{form.website || '—'}</span></div>
                  <div className="hp-onboarding__review-row"><span>Address</span><span>{form.address ? `${form.address}, ${form.city} ${form.postcode}` : '—'}</span></div>
                </div>
                <div className="hp-onboarding__review-section">
                  <div className="hp-onboarding__review-header">
                    <h4>Director & Compliance</h4>
                    <button type="button" className="hp-onboarding__edit-link" onClick={() => goToStep(2)}>Edit</button>
                  </div>
                  <div className="hp-onboarding__review-row"><span>Name</span><span>{form.directorFirstName} {form.directorLastName}</span></div>
                  <div className="hp-onboarding__review-row"><span>Date of Birth</span><span>{form.directorDob || '—'}</span></div>
                  <div className="hp-onboarding__review-row"><span>Nationality</span><span>{form.directorNationality || '—'}</span></div>
                  <div className="hp-onboarding__review-row"><span>Documents</span><span>{Object.keys(uploadedDocs).length}/4 uploaded</span></div>
                  <div className="hp-onboarding__review-row"><span>Terms Accepted</span><span>{form.termsAccepted ? 'Yes' : 'No'}</span></div>
                </div>
                <div className="hp-onboarding__review-section">
                  <div className="hp-onboarding__review-header">
                    <h4>Processing & Settlement</h4>
                    <button type="button" className="hp-onboarding__edit-link" onClick={() => goToStep(3)}>Edit</button>
                  </div>
                  <div className="hp-onboarding__review-row"><span>Monthly Volume</span><span>{form.expectedMonthlyVolume || '—'}</span></div>
                  <div className="hp-onboarding__review-row"><span>Avg Transaction</span><span>{form.averageTransactionValue || '—'}</span></div>
                  <div className="hp-onboarding__review-row"><span>Currencies</span><span>{form.currencies.join(', ') || '—'}</span></div>
                  <div className="hp-onboarding__review-row"><span>Payment Methods</span><span>{form.paymentMethods.join(', ') || '—'}</span></div>
                  <div className="hp-onboarding__review-row"><span>Bank Account</span><span>{form.bankAccountName || '—'}</span></div>
                  <div className="hp-onboarding__review-row"><span>Sort Code</span><span className="admin-mono">{form.sortCode || '—'}</span></div>
                  <div className="hp-onboarding__review-row"><span>Account Number</span><span className="admin-mono">{form.accountNumber || '—'}</span></div>
                </div>
              </div>
            </FormSection>
          )}

          <FormActions align="between">
            {currentStep > 1 ? (
              <button type="button" className="mtrx-btn mtrx-btn--secondary mtrx-btn--md" onClick={prev} disabled={submitStatus === 'submitting'}>Back</button>
            ) : (
              <div />
            )}
            {currentStep < 4 ? (
              <button type="button" className="mtrx-btn mtrx-btn--primary mtrx-btn--md" onClick={next}>Continue</button>
            ) : (
              <button type="button" className="mtrx-btn mtrx-btn--primary mtrx-btn--md" onClick={handleSubmit} disabled={submitStatus === 'submitting'}>
                {submitStatus === 'submitting' ? <><span className="hp-auth__spinner" /> Submitting...</> : 'Submit Application'}
              </button>
            )}
          </FormActions>
        </div>
      </div>
    </div>
  );
}
