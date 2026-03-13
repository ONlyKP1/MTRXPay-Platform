import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../context/AuthContext';
import { useKYC } from '../context/KYCContext';
import { Button, Input, Select, Alert, ProgressSteps } from '../components/common';
import { businessDetailsSchema } from '../utils/validation';
import type { BusinessDetailsFormData } from '../utils/validation';
import { BUSINESS_TYPES, COUNTRIES } from '../types/kyc';
import type { Director, Address } from '../types/kyc';

const STEPS = [
  { number: 1, label: 'Business Details' },
  { number: 2, label: 'Directors' },
  { number: 3, label: 'Verification' },
];

export function KYBPage() {
  const navigate = useNavigate();
  const { updateKYCStatus } = useAuth();
  const { data, saveCompanyDetails, addDirector, removeDirector } = useKYC();
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Step 1: Business Details Form
  const businessForm = useForm<BusinessDetailsFormData>({
    resolver: zodResolver(businessDetailsSchema),
    defaultValues: data.company || {
      name: '',
      registrationNumber: '',
      businessType: '',
      registeredAddress: { line1: '', line2: '', city: '', postcode: '', country: '' },
      tradingAddress: { line1: '', line2: '', city: '', postcode: '', country: '' },
      website: '',
    },
  });

  // Step 2: Director Form
  const [directorForm, setDirectorForm] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    nationality: '',
    ownershipPercentage: 0,
    address: { line1: '', line2: '', city: '', postcode: '', country: '' } as Address,
  });

  const handleBusinessSubmit = async (formData: BusinessDetailsFormData) => {
    setError('');
    setIsLoading(true);
    try {
      saveCompanyDetails(formData);
      setStep(2);
    } catch {
      setError('Failed to save business details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddDirector = () => {
    if (!directorForm.firstName || !directorForm.lastName) {
      setError('Please fill in required director fields');
      return;
    }

    const newDirector: Director = {
      id: crypto.randomUUID(),
      ...directorForm,
    };

    addDirector(newDirector);
    setDirectorForm({
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      nationality: '',
      ownershipPercentage: 0,
      address: { line1: '', line2: '', city: '', postcode: '', country: '' },
    });
    setError('');
  };

  const handleDirectorsNext = () => {
    if (data.directors.length === 0) {
      setError('Please add at least one director or UBO');
      return;
    }
    setStep(3);
  };

  const handleStartVerification = async () => {
    setIsLoading(true);
    // In a real app, this would initialize Sumsub WebSDK
    // For now, we'll simulate the process
    await new Promise((resolve) => setTimeout(resolve, 2000));
    updateKYCStatus('pending');
    navigate('/dashboard');
  };

  return (
    <div className="kyc-layout">
      <div className="kyc-container">
        <div className="kyc-header">
          <img src="/logo.png" alt="MTRX Pay" className="auth-logo-img" />
          <ProgressSteps steps={STEPS} currentStep={step} />
        </div>

        {error && <Alert type="error">{error}</Alert>}

        {step === 1 && (
          <div className="kyc-card">
            <h2 className="kyc-step-title">Business Verification (KYB)</h2>
            <p className="kyc-step-subtitle">
              Tell us about your company to complete business verification
            </p>

            <form className="kyc-form" onSubmit={businessForm.handleSubmit(handleBusinessSubmit)}>
              <Input
                label="Company Name"
                placeholder="Acme Ltd"
                error={businessForm.formState.errors.name?.message}
                {...businessForm.register('name')}
              />

              <div className="form-row">
                <Input
                  label="Registration Number"
                  placeholder="12345678"
                  error={businessForm.formState.errors.registrationNumber?.message}
                  {...businessForm.register('registrationNumber')}
                />
                <Select
                  label="Business Type"
                  options={BUSINESS_TYPES}
                  placeholder="Select type"
                  error={businessForm.formState.errors.businessType?.message}
                  {...businessForm.register('businessType')}
                />
              </div>

              <Input
                label="Website (optional)"
                placeholder="https://example.com"
                error={businessForm.formState.errors.website?.message}
                {...businessForm.register('website')}
              />

              <h3 style={{ color: 'var(--gold)', fontSize: '16px', marginTop: '16px' }}>
                Registered Address
              </h3>

              <Input
                label="Address Line 1"
                placeholder="123 Business Street"
                error={businessForm.formState.errors.registeredAddress?.line1?.message}
                {...businessForm.register('registeredAddress.line1')}
              />

              <Input
                label="Address Line 2 (optional)"
                placeholder="Suite 100"
                {...businessForm.register('registeredAddress.line2')}
              />

              <div className="form-row">
                <Input
                  label="City"
                  placeholder="London"
                  error={businessForm.formState.errors.registeredAddress?.city?.message}
                  {...businessForm.register('registeredAddress.city')}
                />
                <Input
                  label="Postcode"
                  placeholder="SW1A 1AA"
                  error={businessForm.formState.errors.registeredAddress?.postcode?.message}
                  {...businessForm.register('registeredAddress.postcode')}
                />
              </div>

              <Select
                label="Country"
                options={COUNTRIES}
                placeholder="Select country"
                error={businessForm.formState.errors.registeredAddress?.country?.message}
                {...businessForm.register('registeredAddress.country')}
              />

              <h3 style={{ color: 'var(--gold)', fontSize: '16px', marginTop: '16px' }}>
                Trading Address
              </h3>

              <Input
                label="Address Line 1"
                placeholder="123 Business Street"
                error={businessForm.formState.errors.tradingAddress?.line1?.message}
                {...businessForm.register('tradingAddress.line1')}
              />

              <Input
                label="Address Line 2 (optional)"
                placeholder="Suite 100"
                {...businessForm.register('tradingAddress.line2')}
              />

              <div className="form-row">
                <Input
                  label="City"
                  placeholder="London"
                  error={businessForm.formState.errors.tradingAddress?.city?.message}
                  {...businessForm.register('tradingAddress.city')}
                />
                <Input
                  label="Postcode"
                  placeholder="SW1A 1AA"
                  error={businessForm.formState.errors.tradingAddress?.postcode?.message}
                  {...businessForm.register('tradingAddress.postcode')}
                />
              </div>

              <Select
                label="Country"
                options={COUNTRIES}
                placeholder="Select country"
                error={businessForm.formState.errors.tradingAddress?.country?.message}
                {...businessForm.register('tradingAddress.country')}
              />

              <div className="kyc-actions">
                <Button variant="secondary" onClick={() => navigate('/account-type')}>
                  Back
                </Button>
                <Button type="submit" isLoading={isLoading}>
                  Continue
                </Button>
              </div>
            </form>
          </div>
        )}

        {step === 2 && (
          <div className="kyc-card">
            <h2 className="kyc-step-title">Directors & UBOs</h2>
            <p className="kyc-step-subtitle">
              Add all directors and ultimate beneficial owners (25%+ ownership)
            </p>

            {data.directors.length > 0 && (
              <div className="directors-list">
                {data.directors.map((director) => (
                  <div key={director.id} className="director-card">
                    <div className="director-info">
                      <h4>{director.firstName} {director.lastName}</h4>
                      <p>{director.ownershipPercentage}% ownership • {director.nationality}</p>
                    </div>
                    <button
                      className="director-remove"
                      onClick={() => removeDirector(director.id)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="kyc-form">
              <h3 style={{ color: 'var(--gold)', fontSize: '16px' }}>
                Add Director/UBO
              </h3>

              <div className="form-row">
                <Input
                  label="First Name"
                  placeholder="John"
                  value={directorForm.firstName}
                  onChange={(e) => setDirectorForm({ ...directorForm, firstName: e.target.value })}
                />
                <Input
                  label="Last Name"
                  placeholder="Smith"
                  value={directorForm.lastName}
                  onChange={(e) => setDirectorForm({ ...directorForm, lastName: e.target.value })}
                />
              </div>

              <div className="form-row">
                <Input
                  label="Date of Birth"
                  type="date"
                  value={directorForm.dateOfBirth}
                  onChange={(e) => setDirectorForm({ ...directorForm, dateOfBirth: e.target.value })}
                />
                <Select
                  label="Nationality"
                  options={COUNTRIES}
                  placeholder="Select nationality"
                  value={directorForm.nationality}
                  onChange={(e) => setDirectorForm({ ...directorForm, nationality: e.target.value })}
                />
              </div>

              <Input
                label="Ownership Percentage"
                type="number"
                min={0}
                max={100}
                placeholder="25"
                value={directorForm.ownershipPercentage || ''}
                onChange={(e) => setDirectorForm({ ...directorForm, ownershipPercentage: Number(e.target.value) })}
              />

              <h4 style={{ color: 'var(--text-light)', fontSize: '14px', marginTop: '8px' }}>
                Residential Address
              </h4>

              <Input
                label="Address Line 1"
                placeholder="123 Home Street"
                value={directorForm.address.line1}
                onChange={(e) => setDirectorForm({
                  ...directorForm,
                  address: { ...directorForm.address, line1: e.target.value }
                })}
              />

              <div className="form-row">
                <Input
                  label="City"
                  placeholder="London"
                  value={directorForm.address.city}
                  onChange={(e) => setDirectorForm({
                    ...directorForm,
                    address: { ...directorForm.address, city: e.target.value }
                  })}
                />
                <Input
                  label="Postcode"
                  placeholder="SW1A 1AA"
                  value={directorForm.address.postcode}
                  onChange={(e) => setDirectorForm({
                    ...directorForm,
                    address: { ...directorForm.address, postcode: e.target.value }
                  })}
                />
              </div>

              <Select
                label="Country"
                options={COUNTRIES}
                placeholder="Select country"
                value={directorForm.address.country}
                onChange={(e) => setDirectorForm({
                  ...directorForm,
                  address: { ...directorForm.address, country: e.target.value }
                })}
              />

              <Button variant="secondary" onClick={handleAddDirector} style={{ marginTop: '16px' }}>
                + Add Director
              </Button>
            </div>

            <div className="kyc-actions" style={{ marginTop: '32px' }}>
              <Button variant="secondary" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button onClick={handleDirectorsNext}>
                Continue
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="kyc-card">
            <h2 className="kyc-step-title">Identity Verification</h2>
            <p className="kyc-step-subtitle">
              Complete your verification with our secure identity check
            </p>

            <Alert type="info">
              You'll be asked to provide a valid ID document and take a selfie.
              This process is powered by Sumsub and takes about 5 minutes.
            </Alert>

            <div style={{ marginTop: '32px', textAlign: 'center' }}>
              <div style={{
                width: '120px',
                height: '120px',
                margin: '0 auto 24px',
                background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.2), rgba(184, 134, 11, 0.1))',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '48px',
              }}>
                🔐
              </div>
              <p style={{ color: 'var(--text-light)', marginBottom: '32px' }}>
                Your data is encrypted and securely processed.
              </p>
            </div>

            <div className="kyc-actions">
              <Button variant="secondary" onClick={() => setStep(2)}>
                Back
              </Button>
              <Button onClick={handleStartVerification} isLoading={isLoading}>
                Start Verification
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
