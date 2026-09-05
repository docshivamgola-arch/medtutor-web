import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNodeData } from '../hooks/useNodeData';
import { useTheme } from '../context/ThemeContext';

const WIKI_TABS = [
  'Overview',
  'Embryology',
  'Anatomy',
  'Physiology',
  'Pathology',
  'Pharmacology',
  'Surgery',
] as const;
type WikiTab = typeof WIKI_TABS[number];

interface Props {
  nodeId: string;
}

export default function WikiPage({ nodeId }: Props) {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const nodeData = useNodeData(nodeId);
  const [activeTab, setActiveTab] = useState<WikiTab>('Overview');

  const bg = isDark ? 'bg-zinc-950 text-zinc-100' : 'bg-zinc-50 text-zinc-900';
  const card = isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm';
  const muted = isDark ? 'text-zinc-400' : 'text-zinc-500';
  const tabActive = isDark
    ? 'bg-teal-600 text-white'
    : 'bg-teal-500 text-white';
  const tabInactive = isDark
    ? 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
    : 'text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100';

  return (
    <div className={`min-h-screen ${bg}`}>
      {/* Wiki header */}
      <div className={`sticky top-0 z-30 border-b px-4 py-3 flex items-center justify-between backdrop-blur-md ${
        isDark ? 'bg-zinc-900/90 border-zinc-800' : 'bg-white/90 border-zinc-200'
      }`}>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(`/node/${nodeId}`)}
            className={`text-xs px-2.5 py-1 rounded-lg border transition-colors ${
              isDark ? 'border-zinc-700 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800' : 'border-zinc-300 text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100'
            }`}
          >
            ← {nodeData.title}
          </button>
          <span className={`text-xs font-bold uppercase tracking-widest ${muted}`}>Wiki</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(`/node/${nodeId}/flashcards`)}
            className="text-xs px-3 py-1.5 rounded-lg font-semibold transition-colors"
            style={{ background: '#2BB8A8', color: '#fff' }}
          >
            Study Flashcards
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Title */}
        <div className="mb-6">
          <p className={`text-xs font-bold uppercase tracking-widest mb-1 ${muted}`}>{nodeData.system}</p>
          <h1 className="text-3xl font-black tracking-tight">{nodeData.title} — Wiki</h1>
          <p className={`text-sm mt-2 ${muted}`}>
            {nodeData.cuts.length} video cuts · {nodeData.pyqs.length} PYQs linked
          </p>
        </div>

        {/* Subject tab bar */}
        <div className="flex flex-wrap gap-1.5 mb-6">
          {WIKI_TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-xs px-3 py-1.5 rounded-full font-semibold transition-all ${
                activeTab === tab ? tabActive : tabInactive
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Cut index — links to cuts in the video node */}
        <div className={`rounded-2xl border p-5 mb-6 ${card}`}>
          <h2 className="text-sm font-bold mb-3">Video Cuts in this Node</h2>
          <div className="flex flex-col gap-1.5">
            {nodeData.cuts.map((cut, idx) => (
              <button
                key={cut.id}
                onClick={() => navigate(`/node/${nodeId}`)}
                className={`text-left flex items-center gap-3 px-3 py-2 rounded-lg text-xs transition-colors ${
                  isDark ? 'hover:bg-zinc-800 text-zinc-300' : 'hover:bg-zinc-100 text-zinc-700'
                }`}
              >
                <span className={`font-mono text-[10px] w-5 shrink-0 ${muted}`}>{idx + 1}</span>
                <span className="font-medium">{cut.title}</span>
                {(cut.subject ?? (cut.tags?.[0])) && (
                  <span className={`ml-auto text-[10px] px-2 py-0.5 rounded-full border ${
                    isDark ? 'border-zinc-700 text-zinc-400' : 'border-zinc-300 text-zinc-500'
                  }`}>
                    {cut.subject ?? cut.tags?.[0]}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Wiki content area — placeholder for each tab */}
        <div className={`rounded-2xl border p-6 ${card}`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold">{activeTab}</h2>
            <span className={`text-xs px-2 py-0.5 rounded-full border ${
              isDark ? 'border-amber-700 text-amber-400 bg-amber-500/10' : 'border-amber-400 text-amber-700 bg-amber-50'
            }`}>
              Content coming soon
            </span>
          </div>
          <p className={`text-sm leading-relaxed ${muted}`}>
            The {activeTab.toLowerCase()} wiki for <strong>{nodeData.title}</strong> is being authored.
            Each section will contain hyperlinked concepts cross-referenced with PYQ explanations —
            the cross-link moat that no Indian platform has built yet.
          </p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {nodeData.pyqs.slice(0, 4).map(q => (
              <div
                key={q.id}
                className={`rounded-xl border p-3 text-xs ${
                  isDark ? 'bg-zinc-950 border-zinc-800 text-zinc-400' : 'bg-zinc-50 border-zinc-200 text-zinc-600'
                }`}
              >
                <span className={`font-bold text-[10px] uppercase tracking-wider block mb-1 ${
                  isDark ? 'text-teal-400' : 'text-teal-600'
                }`}>
                  {q.exam ?? q.source} {q.year}
                </span>
                <p className="line-clamp-2">{q.question}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
