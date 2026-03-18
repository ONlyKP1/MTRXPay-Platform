import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProgressStepper, FormSection, FormRow, FormActions } from '@mtrx/ui';

const steps = [
  { number: 1, label: 'Business Info' },
  { number: 2, label: 'Compliance' },
  { number: 3, label: 'Processing' },
  { number: 4, label: 'Review' },
];

export function OnboardingPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [form, setForm] = useState({
    // Step 1 — Business Info
    legalName: '',
    tradingName: '',
    registrationNumber: '',
    incorporationCountry: 'GB',
    address: '',
    city: '',
    postcode: '',
    website: '',
    industry: '',
    // Step 2 — Compliance
    directorFirstName: '',
    directorLastName: '',
    directorDob: '',
    directorNationality: '',
    amlPolicy: false,
    termsAccepted: false,
    // Step 3 — Processing
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
  };

  const toggleArrayItem = (field: 'currencies' | 'paymentMethods', item: string) => {
    setForm(prev => ({
      ...prev,
      [field]: prev[field].includes(item)
        ? prev[field].filter(i => i !== item)
        : [...prev[field], item],
    }));
  };

  const next = () => setCurrentStep(s => Math.min(s + 1, 4));
  const prev = () => setCurrentStep(s => Math.max(s - 1, 1));

  const handleSubmit = async () => {
    await new Promise(r => setTimeout(r, 1000));
    navigate('/');
  };

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

        <div className="hp-onboarding__card">
          {currentStep === 1 && (
            <FormSection title="Business Information" description="Tell us about your business entity.">
              <FormRow>
                <div className="hp-auth__field">
                  <label>Legal Name</label>
                  <input name="legalName" value={form.legalName} onChange={handleChange} placeholder="MTRX PAY LIMITED" />
                </div>
                <div className="hp-auth__field">
                  <label>Trading Name</label>
                  <input name="tradingName" value={form.tradingName} onChange={handleChange} placeholder="MTRX Pay" />
                </div>
              </FormRow>
              <FormRow>
                <div className="hp-auth__field">
                  <label>Registration Number</label>
                  <input name="registrationNumber" value={form.registrationNumber} onChange={handleChange} placeholder="e.g. 16913646" />
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
                <label>Registered Address</label>
                <input name="address" value={form.address} onChange={handleChange} placeholder="71-75 Shelton Street" />
              </div>
              <FormRow>
                <div className="hp-auth__field">
                  <label>City</label>
                  <input name="city" value={form.city} onChange={handleChange} placeholder="London" />
                </div>
                <div className="hp-auth__field">
                  <label>Postcode</label>
                  <input name="postcode" value={form.postcode} onChange={handleChange} placeholder="WC2H 9JQ" />
                </div>
              </FormRow>
              <FormRow>
                <div className="hp-auth__field">
                  <label>Website</label>
                  <input name="website" value={form.website} onChange={handleChange} placeholder="https://yourcompany.com" />
                </div>
                <div className="hp-auth__field">
                  <label>Industry</label>
                  <select name="industry" value={form.industry} onChange={handleChange} className="hp-auth__select">
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
                </div>
              </FormRow>
            </FormSection>
          )}

          {currentStep === 2 && (
            <FormSection title="Compliance & Director" description="Provide director details for KYC/KYB verification.">
              <FormRow>
                <div className="hp-auth__field">
                  <label>Director First Name</label>
                  <input name="directorFirstName" value={form.directorFirstName} onChange={handleChange} placeholder="John" />
                </div>
                <div className="hp-auth__field">
                  <label>Director Last Name</label>
                  <input name="directorLastName" value={form.directorLastName} onChange={handleChange} placeholder="Smith" />
                </div>
              </FormRow>
              <FormRow>
                <div className="hp-auth__field">
                  <label>Date of Birth</label>
                  <input name="directorDob" type="date" value={form.directorDob} onChange={handleChange} />
                </div>
                <div className="hp-auth__field">
                  <label>Nationality</label>
                  <input name="directorNationality" value={form.directorNationality} onChange={handleChange} placeholder="e.g. British" list="nationality-list" />
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
                  <div className="hp-onboarding__upload-item">
                    <span>Certificate of Incorporation</span>
                    <button type="button" className="mtrx-btn mtrx-btn--secondary mtrx-btn--sm">Upload</button>
                  </div>
                  <div className="hp-onboarding__upload-item">
                    <span>Director ID (Passport / Driving Licence)</span>
                    <button type="button" className="mtrx-btn mtrx-btn--secondary mtrx-btn--sm">Upload</button>
                  </div>
                  <div className="hp-onboarding__upload-item">
                    <span>Proof of Address (Utility Bill / Bank Statement)</span>
                    <button type="button" className="mtrx-btn mtrx-btn--secondary mtrx-btn--sm">Upload</button>
                  </div>
                  <div className="hp-onboarding__upload-item">
                    <span>AML Policy Document</span>
                    <button type="button" className="mtrx-btn mtrx-btn--secondary mtrx-btn--sm">Upload</button>
                  </div>
                </div>
              </div>

              <div className="hp-onboarding__checks">
                <label className="hp-onboarding__checkbox">
                  <input type="checkbox" name="amlPolicy" checked={form.amlPolicy} onChange={handleChange} />
                  <span>I confirm this business has an AML/CFT policy in place</span>
                </label>
                <label className="hp-onboarding__checkbox">
                  <input type="checkbox" name="termsAccepted" checked={form.termsAccepted} onChange={handleChange} />
                  <span>I accept the MTRX Pay <a href="#terms">Terms of Service</a> and <a href="#privacy">Privacy Policy</a></span>
                </label>
              </div>
            </FormSection>
          )}

          {currentStep === 3 && (
            <FormSection title="Processing Configuration" description="Set up your payment processing and settlement preferences.">
              <FormRow>
                <div className="hp-auth__field">
                  <label>Expected Monthly Volume</label>
                  <select name="expectedMonthlyVolume" value={form.expectedMonthlyVolume} onChange={handleChange} className="hp-auth__select">
                    <option value="">Select range...</option>
                    <option value="0-50k">£0 — £50,000</option>
                    <option value="50k-250k">£50,000 — £250,000</option>
                    <option value="250k-1m">£250,000 — £1,000,000</option>
                    <option value="1m-5m">£1,000,000 — £5,000,000</option>
                    <option value="5m+">£5,000,000+</option>
                  </select>
                </div>
                <div className="hp-auth__field">
                  <label>Average Transaction Value</label>
                  <input name="averageTransactionValue" value={form.averageTransactionValue} onChange={handleChange} placeholder="e.g. £150" />
                </div>
              </FormRow>

              <div className="hp-onboarding__pill-group">
                <label>Currencies</label>
                <div className="hp-onboarding__pills">
                  {['GBP', 'EUR', 'USD', 'AED'].map(c => (
                    <button key={c} type="button" className={`hp-onboarding__pill${form.currencies.includes(c) ? ' hp-onboarding__pill--active' : ''}`} onClick={() => toggleArrayItem('currencies', c)}>{c}</button>
                  ))}
                </div>
              </div>

              <div className="hp-onboarding__pill-group">
                <label>Payment Methods</label>
                <div className="hp-onboarding__pills">
                  {['Visa', 'Mastercard', 'Amex', 'BACS', 'SEPA', 'Faster Payments', 'Wire Transfer'].map(m => (
                    <button key={m} type="button" className={`hp-onboarding__pill${form.paymentMethods.includes(m) ? ' hp-onboarding__pill--active' : ''}`} onClick={() => toggleArrayItem('paymentMethods', m)}>{m}</button>
                  ))}
                </div>
              </div>

              <FormSection title="Settlement Bank Account" description="Where should we send your funds?">
                <div className="hp-auth__field">
                  <label>Account Name</label>
                  <input name="bankAccountName" value={form.bankAccountName} onChange={handleChange} placeholder="Your Company Ltd" />
                </div>
                <FormRow>
                  <div className="hp-auth__field">
                    <label>Sort Code</label>
                    <input name="sortCode" value={form.sortCode} onChange={handleChange} placeholder="12-34-56" />
                  </div>
                  <div className="hp-auth__field">
                    <label>Account Number</label>
                    <input name="accountNumber" value={form.accountNumber} onChange={handleChange} placeholder="12345678" />
                  </div>
                </FormRow>
              </FormSection>
            </FormSection>
          )}

          {currentStep === 4 && (
            <FormSection title="Review & Submit" description="Please review your details before submitting your application.">
              <div className="hp-onboarding__review">
                <div className="hp-onboarding__review-section">
                  <h4>Business</h4>
                  <div className="hp-onboarding__review-row"><span>Legal Name</span><strong>{form.legalName || '—'}</strong></div>
                  <div className="hp-onboarding__review-row"><span>Trading Name</span><span>{form.tradingName || '—'}</span></div>
                  <div className="hp-onboarding__review-row"><span>Registration</span><span className="admin-mono">{form.registrationNumber || '—'}</span></div>
                  <div className="hp-onboarding__review-row"><span>Industry</span><span>{form.industry || '—'}</span></div>
                  <div className="hp-onboarding__review-row"><span>Website</span><span>{form.website || '—'}</span></div>
                  <div className="hp-onboarding__review-row"><span>Address</span><span>{form.address ? `${form.address}, ${form.city} ${form.postcode}` : '—'}</span></div>
                </div>
                <div className="hp-onboarding__review-section">
                  <h4>Director</h4>
                  <div className="hp-onboarding__review-row"><span>Name</span><span>{form.directorFirstName ? `${form.directorFirstName} ${form.directorLastName}` : '—'}</span></div>
                  <div className="hp-onboarding__review-row"><span>Date of Birth</span><span>{form.directorDob || '—'}</span></div>
                </div>
                <div className="hp-onboarding__review-section">
                  <h4>Processing</h4>
                  <div className="hp-onboarding__review-row"><span>Monthly Volume</span><span>{form.expectedMonthlyVolume || '—'}</span></div>
                  <div className="hp-onboarding__review-row"><span>Avg Transaction</span><span>{form.averageTransactionValue || '—'}</span></div>
                  <div className="hp-onboarding__review-row"><span>Currencies</span><span>{form.currencies.join(', ') || '—'}</span></div>
                  <div className="hp-onboarding__review-row"><span>Payment Methods</span><span>{form.paymentMethods.join(', ') || '—'}</span></div>
                </div>
                <div className="hp-onboarding__review-section">
                  <h4>Settlement</h4>
                  <div className="hp-onboarding__review-row"><span>Account Name</span><span>{form.bankAccountName || '—'}</span></div>
                  <div className="hp-onboarding__review-row"><span>Sort Code</span><span className="admin-mono">{form.sortCode || '—'}</span></div>
                  <div className="hp-onboarding__review-row"><span>Account Number</span><span className="admin-mono">{form.accountNumber || '—'}</span></div>
                </div>
              </div>
            </FormSection>
          )}

          <FormActions align="between">
            {currentStep > 1 ? (
              <button type="button" className="mtrx-btn mtrx-btn--secondary mtrx-btn--md" onClick={prev}>Back</button>
            ) : (
              <div />
            )}
            {currentStep < 4 ? (
              <button type="button" className="mtrx-btn mtrx-btn--primary mtrx-btn--md" onClick={next}>Continue</button>
            ) : (
              <button type="button" className="mtrx-btn mtrx-btn--primary mtrx-btn--md" onClick={handleSubmit}>Submit Application</button>
            )}
          </FormActions>
        </div>
      </div>
    </div>
  );
}
