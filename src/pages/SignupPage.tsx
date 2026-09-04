import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useTheme } from '../context/ThemeContext';

export default function SignupPage() {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error: err } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    if (err) { setError(err.message); return; }
    setDone(true);
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

        {done ? (
          <div className="text-center py-4">
            <div className="text-3xl mb-3">📬</div>
            <h2 className="text-lg font-bold mb-2">Check your inbox</h2>
            <p className={`text-sm ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
              We sent a confirmation link to <strong>{email}</strong>.
              Click it to activate your account.
            </p>
            <button
              onClick={() => navigate('/login')}
              className="mt-5 text-sm text-blue-500 hover:underline"
            >
              Back to sign in
            </button>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-black tracking-tight mb-1">Create account</h1>
            <p className={`text-sm mb-6 ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
              Free · No card · Clinova
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
                placeholder="Password (min 6 chars)"
                required
                minLength={6}
                value={password}
                onChange={e => setPassword(e.target.value)}
                className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition-colors ${input}`}
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold py-2.5 text-sm transition-colors mt-1"
              >
                {loading ? 'Creating account…' : 'Create account'}
              </button>
            </form>

            <p className={`text-xs text-center mt-4 leading-relaxed ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
              By signing up you agree to our{' '}
              <button onClick={() => navigate('/privacy')} className="text-blue-500 hover:underline">
                Privacy Policy
              </button>.
            </p>

            <p className={`text-xs text-center mt-3 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
              Already have an account?{' '}
              <button onClick={() => navigate('/login')} className="text-blue-500 hover:underline">
                Sign in
              </button>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
