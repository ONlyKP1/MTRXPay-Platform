import SumsubWebSdk from '@sumsub/websdk-react';
import { useState, useEffect, useCallback } from 'react';

interface SumsubVerificationProps {
  userId: string;
  levelName?: string;
  onComplete?: (status: 'approved' | 'rejected' | 'pending') => void;
  onError?: (error: Error) => void;
}

export function SumsubVerification({ userId, levelName = 'id-and-liveness', onComplete, onError }: SumsubVerificationProps) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAccessToken = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/sumsub-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, levelName }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch access token');
      }

      const data = await response.json();
      setAccessToken(data.token);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      onError?.(err instanceof Error ? err : new Error(errorMessage));
    } finally {
      setLoading(false);
    }
  }, [userId, levelName, onError]);

  useEffect(() => {
    fetchAccessToken();
  }, [fetchAccessToken]);

  const handleMessage = (type: string, payload: Record<string, unknown>) => {
    console.log('Sumsub message:', type, payload);

    if (type === 'idCheck.onApplicantStatusChanged') {
      const reviewStatus = payload.reviewStatus as string;
      const reviewResult = payload.reviewResult as { reviewAnswer?: string } | undefined;

      if (reviewStatus === 'completed') {
        if (reviewResult?.reviewAnswer === 'GREEN') {
          onComplete?.('approved');
        } else if (reviewResult?.reviewAnswer === 'RED') {
          onComplete?.('rejected');
        }
      } else if (reviewStatus === 'pending') {
        onComplete?.('pending');
      }
    }
  };

  const handleError = (error: unknown) => {
    console.error('Sumsub error:', error);
    onError?.(error instanceof Error ? error : new Error('Sumsub verification error'));
  };

  if (loading) {
    return (
      <div className="sumsub-loading">
        <div className="sumsub-spinner"></div>
        <p>Loading verification...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="sumsub-error">
        <p>Failed to load verification: {error}</p>
        <button onClick={fetchAccessToken} className="btn-primary">
          Try Again
        </button>
      </div>
    );
  }

  if (!accessToken) {
    return null;
  }

  return (
    <div className="sumsub-container">
      <SumsubWebSdk
        accessToken={accessToken}
        expirationHandler={() => fetchAccessToken().then(() => accessToken)}
        config={{
          lang: 'en',
          theme: 'dark',
        }}
        options={{
          addViewportTag: false,
          adaptIframeHeight: true,
        }}
        onMessage={handleMessage}
        onError={handleError}
      />
    </div>
  );
}
