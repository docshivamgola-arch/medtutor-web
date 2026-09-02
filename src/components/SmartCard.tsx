import React, { useState, useRef, useEffect } from 'react';
import { SMART_CONCEPTS } from '../data/smartCardsData';
import { Sparkles, ArrowRight, AlertTriangle } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface SmartCardProps {
  conceptId: string;
  children?: React.ReactNode;
  onNavigateToCut?: (cutNumber: number) => void;
}

export const SmartCard: React.FC<SmartCardProps> = ({ conceptId, children, onNavigateToCut }) => {
  const { isDark } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const concept = SMART_CONCEPTS[conceptId];
  const popoverRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current && 
        !popoverRef.current.contains(event.target as Node) &&
        triggerRef.current && 
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  if (!concept) {
    return <span>{children || conceptId}</span>;
  }

  return (
    <span className="relative inline-block">
      <span
        ref={triggerRef}
        onMouseEnter={() => setIsOpen(true)}
        onClick={() => setIsOpen(!isOpen)}
        className={`cursor-pointer font-semibold underline decoration-dotted underline-offset-4 px-1 py-0.5 rounded transition-all ${
          isDark 
            ? 'text-emerald-400 decoration-emerald-500/60 hover:text-emerald-300 hover:decoration-emerald-400 hover:bg-emerald-500/10'
            : 'text-emerald-700 decoration-emerald-600/70 hover:text-emerald-900 hover:decoration-emerald-600 hover:bg-emerald-50'
        }`}
        title="Click or hover for Amboss-style High-Yield Smart Card"
      >
        {children || concept.term}
      </span>

      {isOpen && (
        <div
          ref={popoverRef}
          onMouseLeave={() => setIsOpen(false)}
          className={`absolute left-1/2 -translate-x-1/2 bottom-full mb-2.5 z-50 w-80 sm:w-96 p-4 rounded-xl shadow-2xl backdrop-blur-md text-left animate-in fade-in zoom-in-95 duration-150 border ring-1 ${
            isDark 
              ? 'bg-zinc-900 border-zinc-700 shadow-black/90 ring-zinc-700/50 text-zinc-100'
              : 'bg-white border-zinc-300 shadow-zinc-400/40 ring-zinc-300/60 text-zinc-900'
          }`}
        >
          {/* Top Bar with Subject Badge */}
          <div className={`flex items-center justify-between border-b pb-2 mb-2.5 ${
            isDark ? 'border-zinc-800' : 'border-zinc-200'
          }`}>
            <div className="flex items-center gap-1.5">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: concept.subjectColor }}
              />
              <span className={`text-[10px] uppercase font-extrabold tracking-widest ${
                isDark ? 'text-zinc-300' : 'text-zinc-700'
              }`}>
                {concept.subject} Smart Node
              </span>
            </div>
            <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
              isDark ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' : 'text-emerald-700 bg-emerald-50 border-emerald-200'
            }`}>
              Cut #{concept.targetCutNumber}
            </span>
          </div>

          {/* Term Headline */}
          <div className={`text-sm font-black leading-tight mb-1 flex items-center gap-1.5 ${
            isDark ? 'text-white' : 'text-zinc-900'
          }`}>
            <Sparkles className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span>{concept.term}</span>
          </div>
          <div className="text-[11px] font-semibold text-emerald-500 mb-2">
            {concept.headline}
          </div>

          {/* Definition */}
          <div className={`text-xs leading-relaxed mb-3 p-2.5 rounded-lg border ${
            isDark ? 'bg-zinc-950 border-zinc-800 text-zinc-300' : 'bg-zinc-50 border-zinc-200 text-zinc-700'
          }`}>
            {concept.definition}
          </div>

          {/* Exam Trap Alert */}
          <div className={`flex items-start gap-1.5 text-[11px] p-2.5 rounded-lg mb-3 border ${
            isDark ? 'text-amber-300 bg-amber-950/40 border-amber-800/40' : 'text-amber-900 bg-amber-50 border-amber-200'
          }`}>
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
            <span className="leading-snug font-medium">{concept.examTrap}</span>
          </div>

          {/* Jump Action Button */}
          {onNavigateToCut && (
            <button
              onClick={() => {
                onNavigateToCut(concept.targetCutNumber);
                setIsOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer group ${
                isDark 
                  ? 'bg-emerald-500/10 hover:bg-emerald-500 hover:text-zinc-950 text-emerald-400 border-emerald-500/30'
                  : 'bg-emerald-50 hover:bg-emerald-600 hover:text-white text-emerald-800 border-emerald-300 shadow-sm'
              }`}
            >
              <span>Jump to Video Cut #{concept.targetCutNumber}</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </button>
          )}

          {/* Popover triangle arrow */}
          <div className={`absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-8 border-x-transparent border-t-8 ${
            isDark ? 'border-t-zinc-900' : 'border-t-white'
          }`} />
        </div>
      )}
    </span>
  );
};
