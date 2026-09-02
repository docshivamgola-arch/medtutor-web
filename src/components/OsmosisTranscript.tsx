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
      isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-zinc-200 text-zinc-900 shadow-sm'
    }`}>
      <div className={`flex items-center justify-between border-b pb-2.5 ${
        isDark ? 'border-zinc-800' : 'border-zinc-200'
      }`}>
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-500" />
          <h3 className={`text-xs uppercase font-extrabold tracking-widest ${
            isDark ? 'text-zinc-200' : 'text-zinc-800'
          }`}>
            Osmosis Synced Transcript & Timecodes
          </h3>
        </div>
        <span className="text-[10px] font-mono text-zinc-400">
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
                    ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 shadow-sm'
                    : 'bg-emerald-50 border border-emerald-300 text-emerald-900 shadow-sm'
                  : isDark
                    ? 'hover:bg-zinc-950 text-zinc-400 hover:text-zinc-200'
                    : 'hover:bg-zinc-100 text-zinc-600 hover:text-zinc-900'
              }`}
            >
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono shrink-0 flex items-center gap-1 font-bold ${
                isActive 
                  ? 'bg-emerald-500 text-zinc-950 shadow-sm' 
                  : isDark ? 'bg-zinc-950 text-zinc-400 border border-zinc-800' : 'bg-zinc-100 text-zinc-600 border border-zinc-300'
              }`}>
                <Clock className="w-2.5 h-2.5" />
                {cut.timecode.split(' - ')[0]}
              </span>

              <div className="flex-1">
                <span className={`font-bold block mb-0.5 ${
                  isActive 
                    ? isDark ? 'text-white' : 'text-emerald-950 font-black' 
                    : isDark ? 'text-zinc-300' : 'text-zinc-800'
                }`}>
                  Cut {cut.cutNumber}. {cut.title}
                </span>
                <p className="line-clamp-2 text-[11px] leading-relaxed">
                  {cut.coreConcept}
                </p>
              </div>

              {isActive && (
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0 mt-1.5" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
