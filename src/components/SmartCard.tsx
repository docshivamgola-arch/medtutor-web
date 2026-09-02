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
            ? 'text-teal-300 decoration-teal-500/60 hover:text-teal-200 hover:decoration-teal-400 hover:bg-teal-500/10'
            : 'text-teal-700 decoration-teal-600/70 hover:text-teal-900 hover:decoration-teal-600 hover:bg-teal-50'
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
              ? 'bg-slate-900 border-teal-500/40 shadow-slate-950/80 ring-teal-500/20 text-slate-100'
              : 'bg-white border-teal-500/40 shadow-slate-400/40 ring-teal-500/10 text-slate-900'
          }`}
        >
          {/* Top Bar with Subject Badge */}
          <div className={`flex items-center justify-between border-b pb-2 mb-2.5 ${
            isDark ? 'border-slate-800' : 'border-slate-200'
          }`}>
            <div className="flex items-center gap-1.5">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: concept.subjectColor }}
              />
              <span className={`text-[10px] uppercase font-extrabold tracking-widest ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}>
                {concept.subject} Smart Node
              </span>
            </div>
            <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
              isDark ? 'text-teal-400 bg-teal-500/10 border-teal-500/20' : 'text-teal-700 bg-teal-50 border-teal-200'
            }`}>
              Cut #{concept.targetCutNumber}
            </span>
          </div>

          {/* Term Headline */}
          <div className={`text-sm font-black leading-tight mb-1 flex items-center gap-1.5 ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>
            <Sparkles className="w-3.5 h-3.5 text-teal-500 shrink-0" />
            <span>{concept.term}</span>
          </div>
          <div className="text-[11px] font-semibold text-teal-600 dark:text-teal-400 mb-2">
            {concept.headline}
          </div>

          {/* Definition */}
          <div className={`text-xs leading-relaxed mb-3 p-2.5 rounded-lg border ${
            isDark ? 'bg-slate-950/60 border-slate-800/80 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
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
                  ? 'bg-teal-500/10 hover:bg-teal-500 hover:text-slate-950 text-teal-300 border-teal-500/30'
                  : 'bg-teal-50 hover:bg-teal-600 hover:text-white text-teal-800 border-teal-300 shadow-sm'
              }`}
            >
              <span>Jump to Video Cut #{concept.targetCutNumber}</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </button>
          )}

          {/* Popover triangle arrow */}
          <div className={`absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-8 border-x-transparent border-t-8 ${
            isDark ? 'border-t-slate-900' : 'border-t-white'
          }`} />
        </div>
      )}
    </span>
  );
};
