import { useMemo } from 'react';
import DeviceCard from './DeviceCard';

export default function TechnicianDashboard({ user, devices, capabilities, onRequestVerification }) {
  const grouped = useMemo(() => {
    return devices.reduce((acc, device) => {
      acc[device.manufacturer] = acc[device.manufacturer] || [];
      acc[device.manufacturer].push(device);
      return acc;
    }, {});
  }, [devices]);

  // These capabilities are already scoped to the current user by the API —
  // no client-side filtering by employee needed.
  const capMap = useMemo(() => {
    const map = new Map();
    capabilities.forEach((c) => map.set(c.device, c.status));
    return map;
  }, [capabilities]);

  const stats = useMemo(() => {
    const certified = [...capMap.values()].filter((s) => s === 'certified').length;
    const pending = [...capMap.values()].filter((s) => s === 'pending').length;
    return { certified, pending, total: devices.length };
  }, [capMap, devices.length]);

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <header className="mb-8">
        <p className="text-ink-muted text-sm">Welcome back</p>
        <h1 className="text-2xl font-bold text-ink">{user.name}</h1>
        <div className="flex gap-4 mt-4">
          <StatPill label="Certified" value={stats.certified} />
          <StatPill label="Pending" value={stats.pending} />
          <StatPill label="Total Devices" value={stats.total} />
        </div>
      </header>

      {Object.entries(grouped).map(([manufacturer, list]) => (
        <section key={manufacturer} className="mb-8">
          <h2 className="text-lg font-semibold text-ink mb-3 flex items-center gap-2">
            {manufacturer}
            <span className="text-ink-muted text-sm font-normal">({list.length})</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {list.map((device) => (
              <DeviceCard
                key={device._id}
                device={device}
                status={capMap.get(device._id) || 'none'}
                onRequestVerification={onRequestVerification}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function StatPill({ label, value }) {
  return (
    <div className="bg-base-card border border-ink-muted/20 rounded-lg px-4 py-2">
      <p className="text-xl font-bold text-ink">{value}</p>
      <p className="text-ink-muted text-xs">{label}</p>
    </div>
  );
}
