'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError('Incorrect email or password.');
      return;
    }
    router.push('/');
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-base-bg flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2 justify-center mb-8">
          <div className="w-2.5 h-2.5 rounded-full bg-brand" />
          <span className="text-ink font-semibold">Repair Capability Tracker</span>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-base-card border border-ink-muted/20 rounded-xl p-6 flex flex-col gap-4"
        >
          <div>
            <label className="block text-sm text-ink-muted mb-1.5" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-base-bg border border-ink-muted/30 rounded-lg px-3 py-2 text-ink focus:outline-none focus:border-brand"
              placeholder="you@ubreakifix.com"
            />
          </div>

          <div>
            <label className="block text-sm text-ink-muted mb-1.5" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-base-bg border border-ink-muted/30 rounded-lg px-3 py-2 text-ink focus:outline-none focus:border-brand"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 bg-brand hover:bg-brand-hover active:bg-brand-active text-ink font-medium rounded-lg py-2 transition-colors disabled:opacity-60"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}
