import React, { useState, useRef, useEffect } from 'react';
import { SMART_CONCEPTS } from '../data/smartCardsData';
import { Sparkles, ArrowRight, AlertTriangle } from 'lucide-react';

interface SmartCardProps {
  conceptId: string;
  children?: React.ReactNode;
  onNavigateToCut?: (cutNumber: number) => void;
}

export const SmartCard: React.FC<SmartCardProps> = ({ conceptId, children, onNavigateToCut }) => {
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
        className="cursor-pointer font-semibold text-teal-300 underline decoration-teal-500/60 decoration-dotted underline-offset-4 hover:text-teal-200 hover:decoration-teal-400 hover:bg-teal-500/10 px-1 py-0.5 rounded transition-all"
        title="Click or hover for Amboss-style High-Yield Smart Card"
      >
        {children || concept.term}
      </span>

      {isOpen && (
        <div
          ref={popoverRef}
          onMouseLeave={() => setIsOpen(false)}
          className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2.5 z-50 w-80 sm:w-96 p-4 rounded-xl bg-slate-900 border border-teal-500/40 shadow-2xl shadow-slate-950/80 backdrop-blur-md text-left animate-in fade-in zoom-in-95 duration-150 ring-1 ring-teal-500/20"
        >
          {/* Top Bar with Subject Badge */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2.5">
            <div className="flex items-center gap-1.5">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: concept.subjectColor }}
              />
              <span className="text-[10px] uppercase font-extrabold tracking-widest text-slate-300">
                {concept.subject} Smart Node
              </span>
            </div>
            <span className="text-[10px] font-mono text-teal-400 bg-teal-500/10 px-1.5 py-0.5 rounded border border-teal-500/20">
              Cut #{concept.targetCutNumber}
            </span>
          </div>

          {/* Term Headline */}
          <h4 className="text-sm font-black text-white leading-tight mb-1 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-teal-400 shrink-0" />
            <span>{concept.term}</span>
          </h4>
          <p className="text-[11px] font-medium text-teal-300 mb-2">
            {concept.headline}
          </p>

          {/* Definition */}
          <p className="text-xs text-slate-300 leading-relaxed mb-3 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
            {concept.definition}
          </p>

          {/* Exam Trap Alert */}
          <div className="flex items-start gap-1.5 text-[11px] text-amber-300 bg-amber-950/40 border border-amber-800/40 p-2.5 rounded-lg mb-3">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
            <span className="leading-snug">{concept.examTrap}</span>
          </div>

          {/* Jump Action Button */}
          {onNavigateToCut && (
            <button
              onClick={() => {
                onNavigateToCut(concept.targetCutNumber);
                setIsOpen(false);
              }}
              className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg bg-teal-500/10 hover:bg-teal-500 hover:text-slate-950 text-teal-300 text-xs font-bold border border-teal-500/30 transition-all cursor-pointer group"
            >
              <span>Jump to Video Cut #{concept.targetCutNumber}</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </button>
          )}

          {/* Popover triangle arrow */}
          <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-slate-900" />
        </div>
      )}
    </span>
  );
};
