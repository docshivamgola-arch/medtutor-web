import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useTheme } from '../context/ThemeContext';
import { sm2, defaultCardState, type CardState } from '../utils/sm2';
import { NODE_REGISTRY } from '../data/nodeRegistry';
import type { User } from '@supabase/supabase-js';
import type { NodePYQ } from '../hooks/useNodeData';

// Lazy-import all node JSONs (statically, Vite resolves at build time)
import thyroidJson from '../data/nodes/thyroid.json';
import liverJson from '../data/nodes/liver.json';

const NODE_JSONS: Record<string, { pyqs: NodePYQ[] }> = {
  thyroid: thyroidJson as unknown as { pyqs: NodePYQ[] },
  liver: liverJson as unknown as { pyqs: NodePYQ[] },
};

interface QueueCard extends NodePYQ {
  nodeId: string;
  nodeTitle: string;
  state: CardState;
}

interface Props {
  user: User | null;
}

export default function GlobalFlashcardsPage({ user }: Props) {
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const [queue, setQueue] = useState<QueueCard[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [sessionDone, setSessionDone] = useState(false);
  const [loading, setLoading] = useState(true);
  const [totalReviewed, setTotalReviewed] = useState(0);

  const bg = isDark ? 'bg-zinc-950 text-zinc-100' : 'bg-zinc-50 text-zinc-900';
  const card = isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm';
  const muted = isDark ? 'text-zinc-400' : 'text-zinc-500';

  useEffect(() => {
    if (!user) return;
    async function buildQueue() {
      setLoading(true);

      // Collect all question IDs across all nodes
      const allCards: Omit<QueueCard, 'state'>[] = [];
      for (const [nodeId, json] of Object.entries(NODE_JSONS)) {
        const nodeTitle = NODE_REGISTRY[nodeId]?.title ?? nodeId;
        for (const q of json.pyqs) {
          allCards.push({ ...q, nodeId, nodeTitle });
        }
      }

      const allIds = allCards.map(c => c.id);

      // Fetch existing card states from Supabase
      const { data } = await supabase
        .from('flashcard_progress')
        .select('*')
        .eq('user_id', user!.id)
        .in('question_id', allIds);

      const progressMap: Record<string, CardState> = {};
      (data ?? []).forEach((row: { question_id: string; ef: number; interval_days: number; reps: number; due_at: string }) => {
        progressMap[row.question_id] = {
          ef: row.ef,
          interval: row.interval_days,
          reps: row.reps,
          dueAt: row.due_at,
        };
      });

      // Only show cards that are due (or new cards with default state)
      const now = new Date();
      const due: QueueCard[] = allCards
        .map(c => ({ ...c, state: progressMap[c.id] ?? defaultCardState() }))
        .filter(c => new Date(c.state.dueAt) <= now || c.state.reps === 0);

      setQueue(due);
      setLoading(false);
    }
    buildQueue();
  }, [user]);

  const currentCard = queue[currentIdx];

  const handleRate = useCallback(async (quality: 0 | 1 | 2 | 3 | 4 | 5) => {
    if (!currentCard || !user) return;

    const newState = sm2(currentCard.state, quality);

    await supabase.from('flashcard_progress').upsert({
      user_id: user.id,
      question_id: currentCard.id,
      node_id: currentCard.nodeId,
      ef: newState.ef,
      interval_days: newState.interval,
      reps: newState.reps,
      due_at: newState.dueAt,
    }, { onConflict: 'user_id,question_id' });

    setTotalReviewed(r => r + 1);

    if (currentIdx + 1 >= queue.length) {
      setSessionDone(true);
    } else {
      setCurrentIdx(i => i + 1);
      setFlipped(false);
    }
  }, [currentCard, user, currentIdx, queue.length]);

  if (!user) {
    return (
      <div className={`min-h-screen flex items-center justify-center px-4 ${bg}`}>
        <div className={`w-full max-w-sm rounded-2xl border p-8 text-center ${card}`}>
          <div className="text-3xl mb-3">🔒</div>
          <h2 className="text-lg font-bold mb-2">Sign in to study</h2>
          <p className={`text-sm mb-5 ${muted}`}>Progress tracking requires an account.</p>
          <button
            onClick={() => navigate('/login')}
            className="w-full rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2.5 text-sm transition-colors"
          >
            Sign in
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${bg}`}>
        <p className={`text-sm ${muted}`}>Building your queue…</p>
      </div>
    );
  }

  if (sessionDone || queue.length === 0) {
    return (
      <div className={`min-h-screen flex items-center justify-center px-4 ${bg}`}>
        <div className={`w-full max-w-sm rounded-2xl border p-8 text-center ${card}`}>
          <div className="text-4xl mb-3">{queue.length === 0 ? '✅' : '🎉'}</div>
          <h2 className="text-xl font-black mb-2">
            {queue.length === 0 ? 'All caught up!' : 'Session complete!'}
          </h2>
          <p className={`text-sm mb-1 ${muted}`}>
            {queue.length === 0
              ? 'No cards are due today. Keep up the streak!'
              : `${totalReviewed} cards reviewed across ${Object.keys(NODE_REGISTRY).length} organs`}
          </p>
          <p className={`text-xs mb-6 ${muted}`}>Come back tomorrow for your next due batch.</p>
          <button
            onClick={() => navigate('/')}
            className="w-full rounded-lg py-2.5 text-sm font-semibold transition-colors"
            style={{ background: '#2BB8A8', color: '#fff' }}
          >
            Go to home
          </button>
        </div>
      </div>
    );
  }

  const correctIdx = currentCard.correctIndex ?? currentCard.correct ?? 0;

  return (
    <div className={`min-h-screen ${bg}`}>
      {/* Header */}
      <div className={`sticky top-0 z-30 border-b px-4 py-3 flex items-center justify-between backdrop-blur-md ${
        isDark ? 'bg-zinc-900/90 border-zinc-800' : 'bg-white/90 border-zinc-200'
      }`}>
        <button
          onClick={() => navigate('/')}
          className={`text-xs px-2.5 py-1 rounded-lg border transition-colors ${
            isDark ? 'border-zinc-700 text-zinc-400 hover:bg-zinc-800' : 'border-zinc-300 text-zinc-500 hover:bg-zinc-100'
          }`}
        >
          ← Home
        </button>
        <div className="text-center">
          <p className={`text-[10px] font-bold uppercase tracking-widest ${muted}`}>{currentCard.nodeTitle}</p>
          <p className={`text-xs font-mono ${muted}`}>{currentIdx + 1} / {queue.length} due today</p>
        </div>
        <div className="w-16" />
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-zinc-800">
        <div
          className="h-full transition-all duration-500"
          style={{ width: `${(currentIdx / queue.length) * 100}%`, background: '#2BB8A8' }}
        />
      </div>

      <div className="max-w-2xl mx-auto px-4 py-10 flex flex-col items-center gap-6">
        {/* Card */}
        <div
          className={`w-full rounded-2xl border p-6 min-h-[220px] flex flex-col justify-between cursor-pointer ${card}`}
          onClick={() => !flipped && setFlipped(true)}
        >
          <div className="flex items-center gap-2 mb-4">
            <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border ${
              isDark ? 'border-teal-700 text-teal-400' : 'border-teal-500 text-teal-600'
            }`}>
              {currentCard.exam ?? currentCard.source} {currentCard.year}
            </span>
          </div>

          <p className={`text-base font-semibold leading-relaxed mb-4 ${isDark ? 'text-zinc-100' : 'text-zinc-900'}`}>
            {currentCard.question}
          </p>

          {!flipped ? (
            <p className={`text-xs text-center py-3 rounded-xl border border-dashed ${
              isDark ? 'border-zinc-700 text-zinc-500' : 'border-zinc-300 text-zinc-400'
            }`}>
              Tap to reveal answer
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              {currentCard.options.map((opt, i) => (
                <div
                  key={i}
                  className={`text-sm px-4 py-2.5 rounded-xl border ${
                    i === correctIdx
                      ? isDark
                        ? 'bg-emerald-950/50 border-emerald-500 text-emerald-300 font-semibold'
                        : 'bg-emerald-50 border-emerald-500 text-emerald-900 font-semibold'
                      : isDark
                        ? 'border-zinc-800 text-zinc-500 opacity-60'
                        : 'border-zinc-200 text-zinc-400 opacity-60'
                  }`}
                >
                  {String.fromCharCode(65 + i)}. {opt}
                </div>
              ))}
              {currentCard.explanation && (
                <p className={`text-xs mt-2 leading-relaxed px-1 ${muted}`}>{currentCard.explanation}</p>
              )}
            </div>
          )}
        </div>

        {flipped ? (
          <div className="w-full grid grid-cols-4 gap-2">
            {([
              { label: 'Again', quality: 0 as const, color: 'bg-rose-600 hover:bg-rose-500' },
              { label: 'Hard', quality: 2 as const, color: 'bg-amber-600 hover:bg-amber-500' },
              { label: 'Good', quality: 4 as const, color: 'bg-blue-600 hover:bg-blue-500' },
              { label: 'Easy', quality: 5 as const, color: 'bg-emerald-600 hover:bg-emerald-500' },
            ] as const).map(({ label, quality, color }) => (
              <button
                key={label}
                onClick={() => handleRate(quality)}
                className={`${color} text-white rounded-xl py-3 text-xs font-bold transition-all active:scale-95`}
              >
                {label}
              </button>
            ))}
          </div>
        ) : (
          <button
            onClick={() => setFlipped(true)}
            className="w-full rounded-xl py-3 text-sm font-semibold transition-all active:scale-95"
            style={{ background: '#2BB8A8', color: '#fff' }}
          >
            Show answer
          </button>
        )}
      </div>
    </div>
  );
}
