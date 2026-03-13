import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button, Alert } from '../components/common';

export function VerifySMSPage() {
  const navigate = useNavigate();
  const { user, verifySMS } = useAuth();
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value[0];
    }

    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newCode = [...code];
    for (let i = 0; i < pastedData.length; i++) {
      newCode[i] = pastedData[i];
    }
    setCode(newCode);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = code.join('');

    if (fullCode.length !== 6) {
      setError('Please enter the complete 6-digit code');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      const success = await verifySMS(fullCode);
      if (success) {
        navigate('/account-type');
      } else {
        setError('Invalid verification code. Please try again.');
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setResendCooldown(60);
    // Mock resend
  };

  const formatPhone = (phone: string) => {
    if (!phone) return '';
    return phone.slice(0, 4) + '****' + phone.slice(-3);
  };

  return (
    <div className="auth-layout">
      <div className="auth-container">
        <div className="auth-card">
          <img src="/logo.png" alt="MTRX Pay" className="auth-logo-img" />
          <h1 className="auth-title">Verify Your Phone</h1>
          <p className="auth-subtitle">
            We've sent a 6-digit code to{' '}
            <strong style={{ color: 'var(--gold)' }}>
              {formatPhone(user?.phone || '')}
            </strong>
          </p>

          {error && <Alert type="error">{error}</Alert>}

          <form onSubmit={handleSubmit}>
            <div className="code-input-group" onPaste={handlePaste}>
              {code.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {inputRefs.current[index] = el}}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="code-input"
                  autoFocus={index === 0}
                />
              ))}
            </div>

            <Button type="submit" fullWidth isLoading={isLoading}>
              Verify Phone
            </Button>
          </form>

          <p className="auth-footer">
            Didn't receive the code?{' '}
            {resendCooldown > 0 ? (
              <span style={{ color: 'var(--text-light)' }}>
                Resend in {resendCooldown}s
              </span>
            ) : (
              <button
                onClick={handleResend}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--gold)',
                  cursor: 'pointer',
                  fontWeight: 500,
                }}
              >
                Resend Code
              </button>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
