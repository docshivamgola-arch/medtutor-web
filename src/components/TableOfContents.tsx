import React, { useEffect, useState } from 'react';
import { AlignLeft, ChevronRight } from 'lucide-react';

interface TocItem {
  id: string;
  label: string;
  badge?: string;
  badgeColor?: string;
}

const TOC_ITEMS: TocItem[] = [
  { id: 'sec-anatomy', label: '1. Surgical Anatomy & Ligation', badge: 'Anatomy', badgeColor: '#38bdf8' },
  { id: 'sec-thyroiditis', label: '2. Thyroiditis Subtypes Matrix', badge: 'Pathology', badgeColor: '#eab308' },
  { id: 'sec-oncology', label: '3. Oncology & Genetics Matrix', badge: 'Oncology', badgeColor: '#f43f5e' },
  { id: 'sec-pharma', label: '4. Thioamides & Thyroid Storm', badge: 'Pharma', badgeColor: '#22c55e' },
  { id: 'sec-bethesda', label: '5. Bethesda FNAC & Surgery', badge: 'Surgery', badgeColor: '#a855f7' }
];

export const TableOfContents: React.FC = () => {
  const [activeId, setActiveId] = useState<string>(TOC_ITEMS[0].id);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 150;
      for (let i = TOC_ITEMS.length - 1; i >= 0; i--) {
        const el = document.getElementById(TOC_ITEMS[i].id);
        if (el && el.offsetTop <= scrollPos) {
          setActiveId(TOC_ITEMS[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveId(id);
    }
  };

  return (
    <aside className="hidden xl:block w-64 sticky top-[75px] h-[calc(100vh-140px)] overflow-y-auto p-4 shrink-0">
      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-800 text-xs font-bold uppercase tracking-widest text-slate-400">
        <AlignLeft className="w-3.5 h-3.5 text-teal-400" />
        <span>On This Page</span>
      </div>

      <nav className="space-y-1 text-xs">
        {TOC_ITEMS.map(item => {
          const isActive = activeId === item.id;
          return (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-all cursor-pointer ${
                isActive 
                  ? 'bg-teal-500/10 text-teal-300 font-bold border-l-2 border-teal-400 pl-2.5 shadow-sm' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <span className="truncate pr-1">{item.label}</span>
              {isActive && (
                <ChevronRight className="w-3.5 h-3.5 text-teal-400 shrink-0" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Quick Jump Callout */}
      <div className="mt-6 p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] text-slate-400 space-y-2">
        <span className="font-bold text-slate-300 block">Amboss Smart Nodes</span>
        <p className="leading-snug">
          Click or hover any underlined term in the text to see instant definitions without scrolling.
        </p>
      </div>
    </aside>
  );
};
