const STATUS_STYLES = {
  none: 'bg-base-card text-ink-muted border border-ink-muted/30',
  pending: 'bg-brand/20 text-brand-hover border border-brand/50',
  certified: 'bg-brand text-ink border border-brand',
};

const STATUS_LABELS = {
  none: 'Not Started',
  pending: 'Pending Review',
  certified: 'Certified',
};

export default function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_STYLES[status]}`}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
