import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, Play, CheckCircle, Layers, 
  Sparkles, Stethoscope, CornerDownLeft, X
} from 'lucide-react';
import { THYROID_CUTS, THYROID_PYQS, THYROID_CASES } from '../data/thyroidData';
import { SMART_CONCEPTS } from '../data/smartCardsData';
import type { ChapterCut } from '../data/thyroidData';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCut: (cut: ChapterCut) => void;
  onSwitchTab: (tab: 'visual' | 'wiki' | 'pyq' | 'atlas') => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onSelectCut,
  onSwitchTab
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Build searchable items list
  const results = React.useMemo(() => {
    const q = query.toLowerCase().trim();

    const items: Array<{
      id: string;
      title: string;
      subtitle: string;
      category: 'Cut' | 'Smart Card' | 'Question' | 'Case' | 'Navigation';
      badge: string;
      action: () => void;
    }> = [];

    // Quick Navigation Items
    if (!q || 'cinema video cuts'.includes(q)) {
      items.push({
        id: 'nav-visual',
        title: 'Switch to 1. Visual Cinema',
        subtitle: 'Watch modular 45-60s video stream and dynamic micro-cards',
        category: 'Navigation',
        badge: 'Workspace (Alt+1)',
        action: () => { onSwitchTab('visual'); onClose(); }
      });
    }
    if (!q || 'wiki notes high-yield tables'.includes(q)) {
      items.push({
        id: 'nav-wiki',
        title: 'Switch to 2. Integrated Wiki Matrix',
        subtitle: 'Browse synthesized 19-subject comparison tables and oncology charts',
        category: 'Navigation',
        badge: 'Workspace (Alt+2)',
        action: () => { onSwitchTab('wiki'); onClose(); }
      });
    }
    if (!q || 'pyq test questions mcq'.includes(q)) {
      items.push({
        id: 'nav-pyq',
        title: 'Switch to 3. PYQ Matrix & Active Recall',
        subtitle: 'Solve past NEET-PG & INI-CET clinical vignettes with instant scoring',
        category: 'Navigation',
        badge: 'Workspace (Alt+3)',
        action: () => { onSwitchTab('pyq'); onClose(); }
      });
    }
    if (!q || 'clinical atlas cases scans slides'.includes(q)) {
      items.push({
        id: 'nav-atlas',
        title: 'Switch to 4. Clinical Atlas',
        subtitle: 'Explore de-identified doctor case studies and histopathology',
        category: 'Navigation',
        badge: 'Workspace (Alt+4)',
        action: () => { onSwitchTab('atlas'); onClose(); }
      });
    }

    // Search Smart Concepts
    Object.values(SMART_CONCEPTS).forEach(sc => {
      if (!q || sc.term.toLowerCase().includes(q) || sc.definition.toLowerCase().includes(q) || sc.examTrap.toLowerCase().includes(q)) {
        const targetCut = THYROID_CUTS.find(c => c.cutNumber === sc.targetCutNumber);
        items.push({
          id: `smart-${sc.id}`,
          title: sc.term,
          subtitle: `${sc.headline} • ${sc.definition.slice(0, 75)}...`,
          category: 'Smart Card',
          badge: `${sc.subject} (Cut #${sc.targetCutNumber})`,
          action: () => {
            if (targetCut) {
              onSelectCut(targetCut);
              onSwitchTab('visual');
            }
            onClose();
          }
        });
      }
    });

    // Search Video Cuts
    THYROID_CUTS.forEach(cut => {
      if (!q || cut.title.toLowerCase().includes(q) || cut.coreConcept.toLowerCase().includes(q) || cut.highYieldBullets.some(b => b.toLowerCase().includes(q))) {
        items.push({
          id: `cut-${cut.id}`,
          title: `Cut ${cut.cutNumber}: ${cut.title}`,
          subtitle: cut.coreConcept,
          category: 'Cut',
          badge: `${cut.subject} • ${cut.timecode}`,
          action: () => {
            onSelectCut(cut);
            onSwitchTab('visual');
            onClose();
          }
        });
      }
    });

    // Search PYQs
    THYROID_PYQS.forEach((pyq) => {
      if (!q || pyq.question.toLowerCase().includes(q) || pyq.buzzword.toLowerCase().includes(q) || pyq.explanation.toLowerCase().includes(q)) {
        items.push({
          id: `pyq-${pyq.id}`,
          title: `PYQ: ${pyq.buzzword}`,
          subtitle: `(${pyq.exam} ${pyq.year}) ${pyq.question.slice(0, 90)}...`,
          category: 'Question',
          badge: pyq.subjectTag,
          action: () => {
            onSwitchTab('pyq');
            onClose();
          }
        });
      }
    });

    // Search Clinical Cases
    THYROID_CASES.forEach(c => {
      if (!q || c.title.toLowerCase().includes(q) || c.finalDiagnosis.toLowerCase().includes(q)) {
        items.push({
          id: `case-${c.id}`,
          title: `Case: ${c.title}`,
          subtitle: `Diagnosis: ${c.finalDiagnosis} • Contributed by ${c.contributor.name}`,
          category: 'Case',
          badge: 'Clinical Atlas',
          action: () => {
            onSwitchTab('atlas');
            onClose();
          }
        });
      }
    });

    return items;
  }, [query, onSelectCut, onSwitchTab, onClose]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev < results.length - 1 ? prev + 1 : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : results.length - 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (results[selectedIndex]) {
          results[selectedIndex].action();
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex, onClose]);

  // Scroll selected into view
  useEffect(() => {
    if (listRef.current) {
      const selectedEl = listRef.current.children[selectedIndex] as HTMLElement;
      if (selectedEl) {
        selectedEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-start justify-center pt-16 sm:pt-24 p-4 animate-in fade-in duration-100">
      <div 
        className="w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[75vh] ring-1 ring-slate-700/50"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-800 bg-slate-950/70">
          <Search className="w-5 h-5 text-teal-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command, drug (PTU, MMI), pathology buzzword, or jump to cut..."
            value={query}
            onChange={e => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none font-medium"
          />
          {query && (
            <button 
              onClick={() => setQuery('')}
              className="text-slate-400 hover:text-slate-200 text-xs px-1.5 py-0.5 rounded bg-slate-800 cursor-pointer"
            >
              Clear
            </button>
          )}
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Suggested Quick Filter Chips */}
        <div className="flex items-center gap-1.5 px-4 py-2 bg-slate-950/40 border-b border-slate-800/80 overflow-x-auto text-[11px] text-slate-400">
          <span className="text-slate-500 font-bold shrink-0">Suggestions:</span>
          {['Orphan Annie', 'PTU vs MMI', 'Thyroid Storm', 'Bethesda FNAC', 'EBSLN vs RLN', 'Wolff-Chaikoff'].map(s => (
            <button
              key={s}
              onClick={() => setQuery(s)}
              className="px-2.5 py-0.5 rounded-full bg-slate-800/80 hover:bg-teal-500/20 hover:text-teal-300 text-slate-300 transition-colors whitespace-nowrap cursor-pointer border border-slate-700/60"
            >
              {s}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div 
          ref={listRef}
          className="flex-1 overflow-y-auto p-2 divide-y divide-slate-800/40"
        >
          {results.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs">
              No matching medical concepts, cuts, or questions found for "{query}".
            </div>
          ) : (
            results.map((item, index) => {
              const isSelected = index === selectedIndex;
              let CategoryIcon = Sparkles;
              if (item.category === 'Cut') CategoryIcon = Play;
              if (item.category === 'Navigation') CategoryIcon = Layers;
              if (item.category === 'Question') CategoryIcon = CheckCircle;
              if (item.category === 'Case') CategoryIcon = Stethoscope;

              return (
                <div
                  key={item.id}
                  onClick={item.action}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${
                    isSelected 
                      ? 'bg-slate-800 text-white border border-teal-500/40 shadow-sm' 
                      : 'hover:bg-slate-800/50 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-teal-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400'
                    }`}>
                      <CategoryIcon className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col overflow-hidden">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold truncate text-slate-100">{item.title}</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-950/80 text-teal-400 border border-slate-700 shrink-0">
                          {item.badge}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 truncate mt-0.5">{item.subtitle}</span>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="flex items-center gap-1 text-[10px] font-mono text-slate-400 shrink-0 ml-2">
                      <CornerDownLeft className="w-3.5 h-3.5 text-teal-400" />
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Bottom Hotkey Help Bar */}
        <div className="px-4 py-2.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px] border border-slate-700">↑</kbd>
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px] border border-slate-700">↓</kbd>
              to navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px] border border-slate-700">Enter</kbd>
              to select
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px] border border-slate-700">Esc</kbd>
              to close
            </span>
          </div>
          <span className="hidden sm:inline text-teal-400 font-mono font-semibold">
            {results.length} results
          </span>
        </div>
      </div>
    </div>
  );
};
