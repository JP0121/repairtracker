import StatusBadge from './StatusBadge';

export default function DeviceCard({ device, status, onRequestVerification }) {
  const isActionable = status === 'none';

  return (
    <div className="bg-base-card border border-ink-muted/20 rounded-xl p-4 flex flex-col justify-between gap-3 hover:border-brand/40 transition-colors">
      <div>
        <p className="text-ink font-semibold leading-tight">{device.name}</p>
        <p className="text-ink-muted text-sm mt-1">{device.repairType}</p>
      </div>

      <div className="flex items-center justify-between gap-2">
        <StatusBadge status={status} />

        {isActionable ? (
          <button
            onClick={() => onRequestVerification(device._id)}
            className="text-xs font-medium px-3 py-1.5 rounded-lg bg-brand hover:bg-brand-hover active:bg-brand-active text-ink transition-colors"
          >
            Mark Complete
          </button>
        ) : status === 'pending' ? (
          <span className="text-xs text-ink-muted">Awaiting approval</span>
        ) : null}
      </div>
    </div>
  );
}
