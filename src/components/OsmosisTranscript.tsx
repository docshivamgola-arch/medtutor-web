import React from 'react';
import { Sparkles, Clock } from 'lucide-react';
import type { ChapterCut } from '../data/thyroidData';
import { useTheme } from '../context/ThemeContext';

interface OsmosisTranscriptProps {
  currentCut: ChapterCut;
  allCuts: ChapterCut[];
  onSelectCut: (cut: ChapterCut) => void;
}

export const OsmosisTranscript: React.FC<OsmosisTranscriptProps> = ({
  currentCut,
  allCuts,
  onSelectCut
}) => {
  const { isDark } = useTheme();

  return (
    <div className={`border rounded-2xl p-4 sm:p-5 flex flex-col gap-3 shadow-xl transition-colors ${
      isDark ? 'bg-slate-900/80 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900 shadow-sm'
    }`}>
      <div className={`flex items-center justify-between border-b pb-2.5 ${
        isDark ? 'border-slate-800' : 'border-slate-200'
      }`}>
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-teal-500" />
          <h3 className={`text-xs uppercase font-extrabold tracking-widest ${
            isDark ? 'text-slate-200' : 'text-slate-800'
          }`}>
            Osmosis Synced Transcript & Timecodes
          </h3>
        </div>
        <span className="text-[10px] font-mono text-slate-400">
          Click any timestamp to seek video
        </span>
      </div>

      <div className="max-h-48 overflow-y-auto pr-1 space-y-2 text-xs">
        {allCuts.map((cut) => {
          const isActive = cut.id === currentCut.id;
          return (
            <div
              key={cut.id}
              onClick={() => onSelectCut(cut)}
              className={`p-2.5 rounded-xl transition-all cursor-pointer flex items-start gap-3 ${
                isActive 
                  ? isDark
                    ? 'bg-teal-500/10 border border-teal-500/30 text-teal-200 shadow-sm'
                    : 'bg-teal-50 border border-teal-300 text-teal-900 shadow-sm'
                  : isDark
                    ? 'hover:bg-slate-950/60 text-slate-400 hover:text-slate-200'
                    : 'hover:bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono shrink-0 flex items-center gap-1 font-bold ${
                isActive 
                  ? 'bg-teal-500 text-slate-950 shadow-sm' 
                  : isDark ? 'bg-slate-950 text-slate-400 border border-slate-800' : 'bg-slate-100 text-slate-600 border border-slate-300'
              }`}>
                <Clock className="w-2.5 h-2.5" />
                {cut.timecode.split(' - ')[0]}
              </span>

              <div className="flex-1">
                <span className={`font-bold block mb-0.5 ${
                  isActive 
                    ? isDark ? 'text-white' : 'text-teal-950 font-black' 
                    : isDark ? 'text-slate-300' : 'text-slate-800'
                }`}>
                  Cut {cut.cutNumber}. {cut.title}
                </span>
                <p className="line-clamp-2 text-[11px] leading-relaxed">
                  {cut.coreConcept}
                </p>
              </div>

              {isActive && (
                <div className="w-2 h-2 rounded-full bg-teal-500 animate-pulse shrink-0 mt-1.5" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
