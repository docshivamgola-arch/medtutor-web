import React, { useEffect, useState } from 'react';
import { AlignLeft, ChevronRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface TocItem {
  id: string;
  label: string;
}

const TOC_ITEMS: TocItem[] = [
  { id: 'sec-anatomy', label: '1. Surgical Anatomy & Ligation' },
  { id: 'sec-thyroiditis', label: '2. Thyroiditis Subtypes Matrix' },
  { id: 'sec-oncology', label: '3. Oncology & Genetics Matrix' },
  { id: 'sec-pharma', label: '4. Thioamides & Thyroid Storm' },
  { id: 'sec-bethesda', label: '5. Bethesda FNAC & Surgery' }
];

export const TableOfContents: React.FC = () => {
  const { isDark } = useTheme();
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
      <div className={`flex items-center gap-2 mb-3 pb-2 border-b text-xs font-bold uppercase tracking-widest ${
        isDark ? 'border-zinc-800 text-zinc-400' : 'border-zinc-200 text-zinc-600'
      }`}>
        <AlignLeft className="w-3.5 h-3.5 text-emerald-500" />
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
                  ? isDark
                    ? 'bg-emerald-500/10 text-emerald-400 font-bold border-l-2 border-emerald-500 pl-2.5 shadow-sm' 
                    : 'bg-emerald-50 text-emerald-800 font-bold border-l-2 border-emerald-600 pl-2.5 shadow-sm'
                  : isDark
                    ? 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
                    : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
              }`}
            >
              <span className="truncate pr-1">{item.label}</span>
              {isActive && (
                <ChevronRight className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Quick Jump Callout */}
      <div className={`mt-6 p-3 rounded-xl border text-[11px] space-y-2 ${
        isDark 
          ? 'bg-zinc-900/90 border-zinc-800 text-zinc-400' 
          : 'bg-white border-zinc-200 text-zinc-600 shadow-sm'
      }`}>
        <span className={`font-bold block ${isDark ? 'text-zinc-200' : 'text-zinc-800'}`}>
          Amboss Smart Nodes
        </span>
        <p className="leading-snug">
          Click or hover any underlined term in the text to see instant definitions without scrolling.
        </p>
      </div>
    </aside>
  );
};
