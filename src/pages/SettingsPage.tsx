import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useTheme } from '../context/ThemeContext';
import type { User } from '@supabase/supabase-js';

interface Props {
  user: User | null;
}

export default function SettingsPage({ user }: Props) {
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const bg = isDark ? 'bg-zinc-950 text-zinc-100' : 'bg-zinc-50 text-zinc-900';
  const card = isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200';
  const muted = isDark ? 'text-zinc-400' : 'text-zinc-500';

  async function handleSignOut() {
    await supabase.auth.signOut();
    navigate('/');
  }

  const deleteEmail = 'privacy@clinova.in';
  const deleteSubject = encodeURIComponent('Account deletion request');
  const deleteBody = encodeURIComponent(
    `Please delete my Clinova account and all associated data.\n\nEmail: ${user?.email ?? ''}\nUser ID: ${user?.id ?? ''}\n\nI confirm this is my account and I wish to exercise my right to erasure under the DPDP Act 2023.`
  );

  return (
    <div className={`min-h-screen px-4 py-12 ${bg}`}>
      <div className="max-w-sm mx-auto space-y-6">
        <button
          onClick={() => navigate(-1)}
          className={`text-xs ${muted} hover:underline`}
        >
          ← Back
        </button>

        <h1 className="text-2xl font-black tracking-tight">Settings</h1>

        {/* Account info */}
        <div className={`rounded-2xl border p-5 space-y-3 ${card}`}>
          <h2 className="text-sm font-bold">Account</h2>
          {user ? (
            <p className={`text-sm ${muted}`}>{user.email}</p>
          ) : (
            <p className={`text-sm ${muted}`}>Not signed in</p>
          )}
          {user && (
            <button
              onClick={handleSignOut}
              className={`w-full rounded-lg border py-2.5 text-sm font-semibold transition-colors ${
                isDark
                  ? 'border-zinc-700 text-zinc-300 hover:bg-zinc-800'
                  : 'border-zinc-300 text-zinc-700 hover:bg-zinc-100'
              }`}
            >
              Sign out
            </button>
          )}
          {!user && (
            <button
              onClick={() => navigate('/login')}
              className="w-full rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold py-2.5 transition-colors"
            >
              Sign in
            </button>
          )}
        </div>

        {/* Data & Privacy */}
        <div className={`rounded-2xl border p-5 space-y-3 ${card}`}>
          <h2 className="text-sm font-bold">Data & Privacy</h2>
          <p className={`text-xs leading-relaxed ${muted}`}>
            Under the DPDP Act 2023, you may request deletion of your account and all associated data. Send an email to initiate the erasure process.
          </p>
          <a
            href={`mailto:${deleteEmail}?subject=${deleteSubject}&body=${deleteBody}`}
            className="inline-block w-full text-center rounded-lg border border-red-500/40 text-red-500 py-2.5 text-sm font-semibold hover:bg-red-500/10 transition-colors"
          >
            Request account deletion
          </a>
          <button
            onClick={() => navigate('/privacy')}
            className={`w-full text-sm ${muted} hover:underline`}
          >
            Privacy Policy →
          </button>
        </div>
      </div>
    </div>
  );
}
