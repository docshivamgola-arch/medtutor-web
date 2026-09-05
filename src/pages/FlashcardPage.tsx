import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useNodeData, type NodePYQ } from '../hooks/useNodeData';
import { useTheme } from '../context/ThemeContext';
import { sm2, defaultCardState, isDue, type CardState } from '../utils/sm2';
import type { User } from '@supabase/supabase-js';

interface Props {
  nodeId: string;
  user: User | null;
}

interface CardWithState extends NodePYQ {
  state: CardState;
}

export default function FlashcardPage({ nodeId, user }: Props) {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const nodeData = useNodeData(nodeId);

  const [cards, setCards] = useState<CardWithState[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [sessionDone, setSessionDone] = useState(false);
  const [loading, setLoading] = useState(true);
  const [totalReviewed, setTotalReviewed] = useState(0);

  const bg = isDark ? 'bg-zinc-950 text-zinc-100' : 'bg-zinc-50 text-zinc-900';
  const card = isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm';
  const muted = isDark ? 'text-zinc-400' : 'text-zinc-500';

  // Load card states from Supabase (or use defaults)
  useEffect(() => {
    if (!user) return;
    async function loadCards() {
      setLoading(true);
      const ids = nodeData.pyqs.map(q => q.id);
      const { data } = await supabase
        .from('flashcard_progress')
        .select('*')
        .eq('user_id', user!.id)
        .in('question_id', ids);

      const progressMap: Record<string, CardState> = {};
      (data ?? []).forEach((row: { question_id: string; ef: number; interval_days: number; reps: number; due_at: string }) => {
        progressMap[row.question_id] = {
          ef: row.ef,
          interval: row.interval_days,
          reps: row.reps,
          dueAt: row.due_at,
        };
      });

      const withState: CardWithState[] = nodeData.pyqs.map(q => ({
        ...q,
        state: progressMap[q.id] ?? defaultCardState(),
      }));

      // Only show cards that are due
      const due = withState.filter(c => isDue(c.state));
      setCards(due.length > 0 ? due : withState); // if nothing due, show all (new user)
      setLoading(false);
    }
    loadCards();
  }, [user, nodeId, nodeData.pyqs]);

  const currentCard = cards[currentIdx];

  const handleRate = useCallback(async (quality: 0 | 1 | 2 | 3 | 4 | 5) => {
    if (!currentCard || !user) return;

    const newState = sm2(currentCard.state, quality);

    // Upsert to Supabase
    await supabase.from('flashcard_progress').upsert({
      user_id: user.id,
      question_id: currentCard.id,
      node_id: nodeId,
      ef: newState.ef,
      interval_days: newState.interval,
      reps: newState.reps,
      due_at: newState.dueAt,
    }, { onConflict: 'user_id,question_id' });

    setTotalReviewed(r => r + 1);

    if (currentIdx + 1 >= cards.length) {
      setSessionDone(true);
    } else {
      setCurrentIdx(i => i + 1);
      setFlipped(false);
    }
  }, [currentCard, user, nodeId, currentIdx, cards.length]);

  if (!user) {
    return (
      <div className={`min-h-screen flex items-center justify-center px-4 ${bg}`}>
        <div className={`w-full max-w-sm rounded-2xl border p-8 text-center ${card}`}>
          <div className="text-3xl mb-3">🔒</div>
          <h2 className="text-lg font-bold mb-2">Sign in to study</h2>
          <p className={`text-sm mb-5 ${muted}`}>Flashcards and progress tracking require an account.</p>
          <button
            onClick={() => navigate('/login')}
            className="w-full rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2.5 text-sm transition-colors"
          >
            Sign in
          </button>
          <button onClick={() => navigate(`/node/${nodeId}`)} className={`mt-3 text-xs ${muted} hover:underline block w-full`}>
            ← Back to node
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${bg}`}>
        <p className={`text-sm ${muted}`}>Loading cards…</p>
      </div>
    );
  }

  if (sessionDone || cards.length === 0) {
    return (
      <div className={`min-h-screen flex items-center justify-center px-4 ${bg}`}>
        <div className={`w-full max-w-sm rounded-2xl border p-8 text-center ${card}`}>
          <div className="text-4xl mb-3">🎉</div>
          <h2 className="text-xl font-black mb-2">Session complete!</h2>
          <p className={`text-sm mb-1 ${muted}`}>{totalReviewed} cards reviewed</p>
          <p className={`text-xs mb-6 ${muted}`}>
            {cards.length === 0
              ? 'All cards are up to date — nothing due today.'
              : 'Great work. Come back tomorrow for the next batch.'}
          </p>
          <button
            onClick={() => navigate(`/node/${nodeId}`)}
            className="w-full rounded-lg py-2.5 text-sm font-semibold transition-colors"
            style={{ background: '#2BB8A8', color: '#fff' }}
          >
            Back to {nodeData.title}
          </button>
          <button
            onClick={() => navigate('/flashcards')}
            className={`mt-2 w-full rounded-lg py-2.5 text-sm border font-semibold transition-colors ${
              isDark ? 'border-zinc-700 text-zinc-300 hover:bg-zinc-800' : 'border-zinc-300 text-zinc-700 hover:bg-zinc-100'
            }`}
          >
            Study all organs
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
          onClick={() => navigate(`/node/${nodeId}`)}
          className={`text-xs px-2.5 py-1 rounded-lg border transition-colors ${
            isDark ? 'border-zinc-700 text-zinc-400 hover:bg-zinc-800' : 'border-zinc-300 text-zinc-500 hover:bg-zinc-100'
          }`}
        >
          ← {nodeData.title}
        </button>
        <span className={`text-xs font-mono ${muted}`}>
          {currentIdx + 1} / {cards.length}
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-zinc-800">
        <div
          className="h-full transition-all duration-500"
          style={{ width: `${((currentIdx) / cards.length) * 100}%`, background: '#2BB8A8' }}
        />
      </div>

      <div className="max-w-2xl mx-auto px-4 py-10 flex flex-col items-center gap-6">
        {/* Card */}
        <div
          className={`w-full rounded-2xl border p-6 min-h-[220px] flex flex-col justify-between cursor-pointer transition-all ${card}`}
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
                <p className={`text-xs mt-2 leading-relaxed px-1 ${muted}`}>
                  {currentCard.explanation}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Rating buttons — only show after flip */}
        {flipped && (
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
        )}

        {!flipped && (
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
