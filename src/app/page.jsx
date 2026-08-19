'use client';

import { useCallback, useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import TechnicianDashboard from '@/components/TechnicianDashboard';
import AdminDashboard from '@/components/AdminDashboard';

export default function Home() {
  const { data: session, status } = useSession();

  const [devices, setDevices] = useState([]);
  const [capabilities, setCapabilities] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  const isManager = session?.user?.role === 'manager';

  const loadData = useCallback(async () => {
    if (!session) return;
    setLoading(true);

    const requests = [fetch('/api/devices'), fetch('/api/capabilities')];
    if (isManager) requests.push(fetch('/api/employees'));

    const responses = await Promise.all(requests);
    const [devicesRes, capabilitiesRes, employeesRes] = responses;

    setDevices(await devicesRes.json());
    setCapabilities(await capabilitiesRes.json());
    if (isManager && employeesRes) setEmployees(await employeesRes.json());

    setLoading(false);
  }, [session, isManager]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleRequestVerification = async (deviceId) => {
    await fetch('/api/capabilities', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ deviceId }),
    });
    loadData();
  };

  const handleApprove = async (capabilityId) => {
    await fetch(`/api/capabilities/${capabilityId}/approve`, { method: 'PATCH' });
    loadData();
  };

  const handleAddEmployee = async (form) => {
    const res = await fetch('/api/employees', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      return { error: body.error || 'Failed to add employee.' };
    }
    loadData();
    return {};
  };

  const handleArchiveEmployee = async (employeeId, archived) => {
    await fetch(`/api/employees/${employeeId}/archive`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ archived }),
    });
    loadData();
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-base-bg flex items-center justify-center">
        <p className="text-ink-muted text-sm">Loading…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-bg">
      <nav className="border-b border-ink-muted/20 bg-base-card">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-brand" />
            <span className="text-ink font-semibold">Repair Capability Tracker</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-ink-muted text-sm">
              {session?.user?.name}
              <span className="ml-1 uppercase text-xs tracking-wide">({session?.user?.role})</span>
            </span>
            <button
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="text-sm text-ink-muted hover:text-ink transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      </nav>

      {isManager ? (
        <AdminDashboard
          employees={employees}
          devices={devices}
          capabilities={capabilities}
          onApprove={handleApprove}
          onAddEmployee={handleAddEmployee}
          onArchiveEmployee={handleArchiveEmployee}
        />
      ) : (
        <TechnicianDashboard
          user={session?.user}
          devices={devices}
          capabilities={capabilities}
          onRequestVerification={handleRequestVerification}
        />
      )}
    </div>
  );
}
