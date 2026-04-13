import { useState } from 'react';
import type { ProviderOption, OrchestrationResponse } from '../types/orchestration';

interface RouteSelectorProps {
  response: OrchestrationResponse;
  amount: number;
  onSelect: (providerId: string) => void;
}

export function RouteSelector({ response, amount, onSelect }: RouteSelectorProps) {
  const [selectedId, setSelectedId] = useState<string | null>(
    response.recommended?.providerId || null
  );

  const handleSelect = (providerId: string) => {
    setSelectedId(providerId);
  };

  const handleConfirm = () => {
    if (selectedId) {
      onSelect(selectedId);
    }
  };

  if (response.options.length === 0) {
    return (
      <div className="route-selector route-selector--empty">
        <p>No payment routes available for this transaction.</p>
      </div>
    );
  }

  return (
    <div className="route-selector">
      <div className="route-selector__header">
        <h3>Select Payment Route</h3>
        <p className="route-selector__subtitle">
          We suggest a route based on fees, approval likelihood and speed. You may choose any available option.
        </p>
      </div>

      {response.recommended && (
        <div className="route-selector__recommended">
          <span className="route-selector__badge">Recommended</span>
          <span className="route-selector__reason">{response.recommended.reason}</span>
        </div>
      )}

      <div className="route-selector__options">
        {response.options.map((option) => (
          <ProviderCard
            key={option.providerId}
            option={option}
            amount={amount}
            isSelected={selectedId === option.providerId}
            onSelect={() => handleSelect(option.providerId)}
          />
        ))}
      </div>

      <button
        className="route-selector__confirm"
        onClick={handleConfirm}
        disabled={!selectedId}
      >
        Continue with {response.options.find(o => o.providerId === selectedId)?.name || 'selected provider'}
      </button>
    </div>
  );
}

interface ProviderCardProps {
  option: ProviderOption;
  amount: number;
  isSelected: boolean;
  onSelect: () => void;
}

function ProviderCard({ option, amount, isSelected, onSelect }: ProviderCardProps) {
  const feeAmount = ((option.fee / 100) * amount).toFixed(2);
  const netAmount = (amount - parseFloat(feeAmount)).toFixed(2);

  return (
    <div
      className={`provider-card ${isSelected ? 'provider-card--selected' : ''} ${option.recommended ? 'provider-card--recommended' : ''}`}
      onClick={onSelect}
    >
      <div className="provider-card__header">
        <div className="provider-card__name">
          {option.name}
          {option.recommended && <span className="provider-card__tag">Best Match</span>}
        </div>
        <div className="provider-card__score">
          <span className="provider-card__score-value">{option.score}</span>
          <span className="provider-card__score-label">score</span>
        </div>
      </div>

      <div className="provider-card__details">
        <div className="provider-card__detail">
          <span className="provider-card__detail-label">Fee</span>
          <span className="provider-card__detail-value">{option.fee}%</span>
        </div>
        <div className="provider-card__detail">
          <span className="provider-card__detail-label">Speed</span>
          <span className="provider-card__detail-value">{option.speedLabel}</span>
        </div>
        <div className="provider-card__detail">
          <span className="provider-card__detail-label">You receive</span>
          <span className="provider-card__detail-value">£{netAmount}</span>
        </div>
      </div>

      <div className="provider-card__select">
        <div className={`provider-card__radio ${isSelected ? 'provider-card__radio--checked' : ''}`} />
      </div>
    </div>
  );
}

export default RouteSelector;
