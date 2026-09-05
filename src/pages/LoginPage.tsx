import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useTheme } from '../context/ThemeContext';

export default function LoginPage() {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (err) { setError(err.message); return; }
    navigate('/node/thyroid');
  }

  const bg = isDark ? 'bg-zinc-950 text-zinc-100' : 'bg-zinc-50 text-zinc-900';
  const card = isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200';
  const input = isDark
    ? 'bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500 focus:border-blue-500'
    : 'bg-white border-zinc-300 text-zinc-900 placeholder:text-zinc-400 focus:border-blue-500';

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 ${bg}`}>
      <div className={`w-full max-w-sm rounded-2xl border p-8 ${card}`}>
        <button
          onClick={() => navigate('/')}
          className={`text-xs mb-6 ${isDark ? 'text-zinc-400 hover:text-zinc-200' : 'text-zinc-500 hover:text-zinc-900'}`}
        >
          ← Clinova
        </button>
        <h1 className="text-2xl font-black tracking-tight mb-1">Sign in</h1>
        <p className={`text-sm mb-6 ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
          NEET-PG · INI-CET · Clinova
        </p>

        {error && (
          <p className="text-sm text-red-500 mb-4 bg-red-500/10 rounded-lg px-3 py-2">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition-colors ${input}`}
          />
          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
            className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition-colors ${input}`}
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold py-2.5 text-sm transition-colors mt-1"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className={`text-xs text-center mt-5 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
          No account?{' '}
          <button
            onClick={() => navigate('/signup')}
            className="text-blue-500 hover:underline"
          >
            Create one
          </button>
        </p>
      </div>
    </div>
  );
}
