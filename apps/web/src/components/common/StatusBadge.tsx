export type BadgeStatus =
  | 'draft'
  | 'submitted'
  | 'under_review'
  | 'approved'
  | 'rejected'
  | 'pending'
  | 'completed'
  | 'failed';

const labels: Record<BadgeStatus, string> = {
  draft: 'Draft',
  submitted: 'Submitted',
  under_review: 'Under Review',
  approved: 'Approved',
  rejected: 'Rejected',
  pending: 'Pending',
  completed: 'Completed',
  failed: 'Failed',
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
};

interface StatusBadgeProps {
  status: BadgeStatus;
  className?: string;
}

export function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  return (
    <span className={`status-badge status-badge--${variants[status]} ${className}`}>
      {labels[status]}
    </span>
  );
}
