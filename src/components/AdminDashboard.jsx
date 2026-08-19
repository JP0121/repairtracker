'use client';

import { useMemo, useState } from 'react';
import StatusBadge from './StatusBadge';

export default function AdminDashboard({
  employees,
  devices,
  capabilities,
  onApprove,
  onAddEmployee,
  onArchiveEmployee,
}) {
  const deviceMap = useMemo(() => new Map(devices.map((d) => [d._id, d])), [devices]);
  const employeeMap = useMemo(() => new Map(employees.map((e) => [e._id, e])), [employees]);

  const pending = capabilities.filter((c) => c.status === 'pending');

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <header className="mb-8">
        <p className="text-ink-muted text-sm">Manager Dashboard</p>
        <h1 className="text-2xl font-bold text-ink">Repair Capability Overview</h1>
      </header>

      {/* Pending approvals */}
      <section className="mb-10">
        <h2 className="text-lg font-semibold text-ink mb-3">
          Pending Verification
          {pending.length > 0 && (
            <span className="ml-2 text-xs font-medium bg-brand text-ink px-2 py-0.5 rounded-full align-middle">
              {pending.length}
            </span>
          )}
        </h2>

        {pending.length === 0 ? (
          <p className="text-ink-muted text-sm bg-base-card border border-ink-muted/20 rounded-xl p-4">
            No requests waiting on review.
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {pending.map((cap) => {
              const device = deviceMap.get(cap.device);
              const employee = employeeMap.get(cap.employee);
              return (
                <div
                  key={cap._id}
                  className="bg-base-card border border-ink-muted/20 rounded-xl p-4 flex items-center justify-between gap-4"
                >
                  <div>
                    <p className="text-ink font-medium">
                      {employee?.name ?? 'Unknown employee'}
                      <span className="text-ink-muted font-normal"> — {device?.name}, {device?.repairType}</span>
                    </p>
                    <p className="text-ink-muted text-xs mt-0.5">{device?.manufacturer}</p>
                  </div>
                  <button
                    onClick={() => onApprove(cap._id)}
                    className="text-sm font-medium px-4 py-1.5 rounded-lg bg-brand hover:bg-brand-hover active:bg-brand-active text-ink transition-colors shrink-0"
                  >
                    Approve
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Employee roster + add/archive */}
      <section className="mb-10">
        <h2 className="text-lg font-semibold text-ink mb-3">Employees</h2>
        <EmployeeManager
          employees={employees}
          onAddEmployee={onAddEmployee}
          onArchiveEmployee={onArchiveEmployee}
        />
      </section>

      {/* Full capability matrix */}
      <section>
        <h2 className="text-lg font-semibold text-ink mb-3">Certification Status</h2>
        <div className="bg-base-card border border-ink-muted/20 rounded-xl overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-ink-muted/20 text-left text-ink-muted">
                <th className="px-4 py-3 font-medium">Employee</th>
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Certified</th>
                <th className="px-4 py-3 font-medium">Pending</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => {
                const empCaps = capabilities.filter((c) => c.employee === emp._id);
                const certified = empCaps.filter((c) => c.status === 'certified');
                const empPending = empCaps.filter((c) => c.status === 'pending');
                return (
                  <tr key={emp._id} className="border-b border-ink-muted/10 last:border-0">
                    <td className="px-4 py-3 text-ink font-medium">{emp.name}</td>
                    <td className="px-4 py-3 text-ink-muted">{emp.title}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1.5">
                        {certified.length === 0 ? (
                          <span className="text-ink-muted">—</span>
                        ) : (
                          certified.map((c) => (
                            <StatusChip key={c._id} label={deviceMap.get(c.device)?.name} />
                          ))
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1.5">
                        {empPending.length === 0 ? (
                          <span className="text-ink-muted">—</span>
                        ) : (
                          empPending.map((c) => <StatusBadge key={c._id} status="pending" />)
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function StatusChip({ label }) {
  return (
    <span className="text-xs px-2 py-0.5 rounded-full bg-brand/20 text-ink border border-brand/30">
      {label}
    </span>
  );
}

function EmployeeManager({ employees, onAddEmployee, onArchiveEmployee }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'employee', title: 'Technician' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    const result = await onAddEmployee(form);
    setSubmitting(false);
    if (result?.error) {
      setError(result.error);
      return;
    }
    setForm({ name: '', email: '', password: '', role: 'employee', title: 'Technician' });
    setShowForm(false);
  };

  return (
    <div className="bg-base-card border border-ink-muted/20 rounded-xl p-4">
      <div className="flex flex-col gap-2">
        {employees.map((emp) => (
          <div
            key={emp._id}
            className="flex items-center justify-between gap-4 py-2 border-b border-ink-muted/10 last:border-0"
          >
            <div>
              <p className="text-ink text-sm font-medium">
                {emp.name}
                <span className="text-ink-muted font-normal text-xs ml-2 uppercase tracking-wide">{emp.role}</span>
              </p>
              <p className="text-ink-muted text-xs">{emp.email}</p>
            </div>
            <button
              onClick={() => onArchiveEmployee(emp._id, !emp.archived)}
              className="text-xs font-medium px-3 py-1.5 rounded-lg border border-ink-muted/30 text-ink-muted hover:text-ink hover:border-ink-muted/60 transition-colors shrink-0"
            >
              {emp.archived ? 'Unarchive' : 'Archive'}
            </button>
          </div>
        ))}
      </div>

      {showForm ? (
        <form onSubmit={handleSubmit} className="mt-4 pt-4 border-t border-ink-muted/20 flex flex-col gap-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              required
              placeholder="Full name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="bg-base-bg border border-ink-muted/30 rounded-lg px-3 py-2 text-sm text-ink focus:outline-none focus:border-brand"
            />
            <input
              required
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="bg-base-bg border border-ink-muted/30 rounded-lg px-3 py-2 text-sm text-ink focus:outline-none focus:border-brand"
            />
            <input
              required
              type="password"
              placeholder="Temporary password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="bg-base-bg border border-ink-muted/30 rounded-lg px-3 py-2 text-sm text-ink focus:outline-none focus:border-brand"
            />
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="bg-base-bg border border-ink-muted/30 rounded-lg px-3 py-2 text-sm text-ink focus:outline-none focus:border-brand"
            >
              <option value="employee">Employee</option>
              <option value="manager">Manager</option>
            </select>
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={submitting}
              className="text-sm font-medium px-4 py-1.5 rounded-lg bg-brand hover:bg-brand-hover active:bg-brand-active text-ink transition-colors disabled:opacity-60"
            >
              {submitting ? 'Adding…' : 'Add Employee'}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="text-sm font-medium px-4 py-1.5 rounded-lg text-ink-muted hover:text-ink transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setShowForm(true)}
          className="mt-4 text-sm font-medium px-4 py-1.5 rounded-lg bg-brand hover:bg-brand-hover active:bg-brand-active text-ink transition-colors"
        >
          + Add Employee
        </button>
      )}
    </div>
  );
}
