import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../context/AuthContext';
import { Button, Input, Select, ProgressSteps, Alert } from '../components/common';
// import { SumsubVerification } from '../components/SumsubWebSdk';
import { COUNTRIES } from '../types/kyc';

const STEPS = [
  { number: 1, label: 'Personal Details' },
  { number: 2, label: 'Address' },
  { number: 3, label: 'Verification' },
];

const personalDetailsSchema = z.object({
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  nationality: z.string().min(1, 'Nationality is required'),
});

const addressSchema = z.object({
  line1: z.string().min(1, 'Address line 1 is required'),
  line2: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  postcode: z.string().min(1, 'Postcode is required'),
  country: z.string().min(1, 'Country is required'),
});

type PersonalDetailsForm = z.infer<typeof personalDetailsSchema>;
type AddressForm = z.infer<typeof addressSchema>;

export function KYCIndividualPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [verificationStarted, setVerificationStarted] = useState(false);

  const personalForm = useForm<PersonalDetailsForm>({
    resolver: zodResolver(personalDetailsSchema),
  });

  const addressForm = useForm<AddressForm>({
    resolver: zodResolver(addressSchema),
  });

  const handlePersonalSubmit = async (data: PersonalDetailsForm) => {
    localStorage.setItem('mtrx_kyc_personal', JSON.stringify(data));
    setStep(2);
  };

  const handleAddressSubmit = async (data: AddressForm) => {
    localStorage.setItem('mtrx_kyc_address', JSON.stringify(data));
    setStep(3);
  };

  const handleStartVerification = () => {
    setVerificationStarted(true);
  };


  return (
    <div className="kyc-layout">
      <div className="kyc-container">
        <div className="kyc-header">
          <img src="/logo.png" alt="MTRX Pay" className="auth-logo-img" />
          <ProgressSteps steps={STEPS} currentStep={step} />
        </div>

        {step === 1 && (
          <div className="kyc-card">
            <h2 className="kyc-step-title">Personal Details</h2>
            <p className="kyc-step-subtitle">
              Hi {user?.firstName}, please provide your personal information
            </p>

            <form className="kyc-form" onSubmit={personalForm.handleSubmit(handlePersonalSubmit)}>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">First Name</label>
                  <input
                    className="form-input"
                    value={user?.firstName || ''}
                    disabled
                    style={{ opacity: 0.7 }}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Last Name</label>
                  <input
                    className="form-input"
                    value={user?.lastName || ''}
                    disabled
                    style={{ opacity: 0.7 }}
                  />
                </div>
              </div>

              <Input
                label="Date of Birth"
                type="date"
                error={personalForm.formState.errors.dateOfBirth?.message}
                {...personalForm.register('dateOfBirth')}
              />

              <Select
                label="Nationality"
                options={COUNTRIES}
                placeholder="Select nationality"
                error={personalForm.formState.errors.nationality?.message}
                {...personalForm.register('nationality')}
              />

              <div className="kyc-actions">
                <Button variant="secondary" onClick={() => navigate('/account-type')}>
                  Back
                </Button>
                <Button type="submit">
                  Continue
                </Button>
              </div>
            </form>
          </div>
        )}

        {step === 2 && (
          <div className="kyc-card">
            <h2 className="kyc-step-title">Residential Address</h2>
            <p className="kyc-step-subtitle">
              Please provide your current residential address
            </p>

            <form className="kyc-form" onSubmit={addressForm.handleSubmit(handleAddressSubmit)}>
              <Input
                label="Address Line 1"
                placeholder="123 Main Street"
                error={addressForm.formState.errors.line1?.message}
                {...addressForm.register('line1')}
              />

              <Input
                label="Address Line 2 (optional)"
                placeholder="Flat 4B"
                {...addressForm.register('line2')}
              />

              <div className="form-row">
                <Input
                  label="City"
                  placeholder="London"
                  error={addressForm.formState.errors.city?.message}
                  {...addressForm.register('city')}
                />
                <Input
                  label="Postcode"
                  placeholder="SW1A 1AA"
                  error={addressForm.formState.errors.postcode?.message}
                  {...addressForm.register('postcode')}
                />
              </div>

              <Select
                label="Country"
                options={COUNTRIES}
                placeholder="Select country"
                error={addressForm.formState.errors.country?.message}
                {...addressForm.register('country')}
              />

              <div className="kyc-actions">
                <Button variant="secondary" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button type="submit">
                  Continue
                </Button>
              </div>
            </form>
          </div>
        )}

        {step === 3 && (
          <div className="kyc-card">
            <h2 className="kyc-step-title">Identity Verification</h2>
            <p className="kyc-step-subtitle">
              Complete your KYC verification with our secure identity check
            </p>

            {!verificationStarted ? (
              <>
                <Alert type="info">
                  You'll be asked to provide a valid ID document (passport, driving licence, or national ID) and take a selfie.
                  This process is powered by Sumsub and takes about 2-3 minutes.
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
                    🪪
                  </div>
                  <p style={{ color: 'var(--text-light)', marginBottom: '32px' }}>
                    Your data is encrypted and securely processed.
                  </p>
                </div>

                <div className="kyc-actions">
                  <Button variant="secondary" onClick={() => setStep(2)}>
                    Back
                  </Button>
                  <Button onClick={handleStartVerification}>
                    Start Verification
                  </Button>
                </div>
              </>
            ) : (
              <div className="sumsub-wrapper">
                <p style={{ color: 'var(--text-light)', textAlign: 'center', padding: '48px 0' }}>
                  Identity verification is not yet connected. This is a placeholder.
                </p>
                <div className="kyc-actions" style={{ marginTop: '24px' }}>
                  <Button variant="secondary" onClick={() => setVerificationStarted(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
