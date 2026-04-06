export type BadgeStatus =
  | 'draft'
  | 'submitted'
  | 'under_review'
  | 'approved'
  | 'rejected'
  | 'pending'
  | 'completed'
  | 'failed'
  | 'active'
  | 'suspended'
  | 'paused'
  | 'cancelled'
  | 'past_due'
  | 'trialing';

const labels: Record<BadgeStatus, string> = {
  draft: 'Draft',
  submitted: 'Submitted',
  under_review: 'Under Review',
  approved: 'Approved',
  rejected: 'Rejected',
  pending: 'Pending',
  completed: 'Completed',
  failed: 'Failed',
  active: 'Active',
  suspended: 'Suspended',
  paused: 'Paused',
  cancelled: 'Cancelled',
  past_due: 'Past Due',
  trialing: 'Trial',
};

const variants: Record<BadgeStatus, string> = {
  draft: 'muted',
  submitted: 'blue',
  under_review: 'gold',
  approved: 'green',
  rejected: 'red',
  pending: 'gold',
  completed: 'green',
  failed: 'red',
  active: 'green',
  suspended: 'red',
  paused: 'muted',
  cancelled: 'red',
  past_due: 'red',
  trialing: 'blue',
};

interface StatusBadgeProps {
  status: BadgeStatus;
  className?: string;
  size?: 'sm' | 'md';
  showDot?: boolean;
}

export function StatusBadge({ status, className = '', size = 'md', showDot = true }: StatusBadgeProps) {
  return (
    <span className={`status-badge status-badge--${variants[status]} ${size === 'sm' ? 'status-badge--sm' : ''} ${className}`}>
      {showDot && <span className="status-badge__dot" />}
      {labels[status]}
    </span>
  );
}
