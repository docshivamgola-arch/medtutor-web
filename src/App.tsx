import { useState, useMemo, useEffect } from 'react';
import { 
  Play, Pause, FastForward, Rewind, CheckCircle, 
  BookOpen, Layers, Activity, ChevronRight,
  Search, ShieldCheck, Heart, Award, 
  Sparkles, Stethoscope, AlertTriangle, Lightbulb,
  UploadCloud, X, PanelLeftClose, PanelLeftOpen,
  Sun, Moon
} from 'lucide-react';
import { 
  THYROID_CUTS, 
  THYROID_PYQS
} from './data/thyroidData';
import type { ChapterCut } from './data/thyroidData';
import { SmartCard } from './components/SmartCard';
import { CommandPalette } from './components/CommandPalette';
import { SystemsSidebar } from './components/SystemsSidebar';
import { TableOfContents } from './components/TableOfContents';
import { RadiopaediaCaseViewer } from './components/RadiopaediaCaseViewer';
import { OsmosisTranscript } from './components/OsmosisTranscript';
import { useTheme } from './context/ThemeContext';

type WorkspaceTab = 'visual' | 'wiki' | 'pyq' | 'atlas';

export default function App() {
  const { isDark, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<WorkspaceTab>('visual');
  const [selectedCut, setSelectedCut] = useState<ChapterCut>(THYROID_CUTS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<'1.0x' | '1.25x' | '1.5x' | '2.0x'>('1.0x');
  const [activeSubjectFilter, setActiveSubjectFilter] = useState<string>('All');
  
  // Sidebar & Navigation State
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // PYQ Interactive State
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [showExplanations, setShowExplanations] = useState<Record<string, boolean>>({});
  const [score, setScore] = useState(0);

  // Modals
  const [isPatronModalOpen, setIsPatronModalOpen] = useState(false);
  const [isCaseUploadModalOpen, setIsCaseUploadModalOpen] = useState(false);
  const [caseSubmitted, setCaseSubmitted] = useState(false);

  // Wiki subject tab
  const [wikiSubject, setWikiSubject] = useState<'all' | 'anatomy' | 'biochem' | 'patho' | 'pharma' | 'medicine' | 'surgery'>('all');

  // Global Keyboard Shortcuts (Ctrl+K, Ctrl+B, Alt+1..4)
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Ctrl+K or Cmd+K
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
      // Ctrl+B to toggle sidebar
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        setIsSidebarOpen(prev => !prev);
      }
      // Alt+1 to Alt+4 for rapid workspace switching
      if (e.altKey && e.key === '1') { e.preventDefault(); setActiveTab('visual'); }
      if (e.altKey && e.key === '2') { e.preventDefault(); setActiveTab('wiki'); }
      if (e.altKey && e.key === '3') { e.preventDefault(); setActiveTab('pyq'); }
      if (e.altKey && e.key === '4') { e.preventDefault(); setActiveTab('atlas'); }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  // Jump to specific cut from SmartCard or Transcript
  const handleNavigateToCut = (cutNumber: number) => {
    const target = THYROID_CUTS.find(c => c.cutNumber === cutNumber);
    if (target) {
      setSelectedCut(target);
      setActiveTab('visual');
    }
  };

  // Filtered cuts for sidebar
  const filteredCuts = useMemo(() => {
    return THYROID_CUTS.filter(cut => {
      const matchesSubject = activeSubjectFilter === 'All' || cut.subject === activeSubjectFilter;
      return matchesSubject;
    });
  }, [activeSubjectFilter]);

  const handleSelectOption = (questionId: string, optionIdx: number, correctIdx: number) => {
    if (selectedAnswers[questionId] !== undefined) return; // already answered
    setSelectedAnswers(prev => ({ ...prev, [questionId]: optionIdx }));
    setShowExplanations(prev => ({ ...prev, [questionId]: true }));
    if (optionIdx === correctIdx) {
      setScore(prev => prev + 1);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${
      isDark ? 'bg-slate-950 text-slate-100' : 'bg-[#f8fafc] text-slate-900'
    }`}>
      {/* ── Command Palette (Ctrl+K) ── */}
      <CommandPalette 
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelectCut={(cut) => setSelectedCut(cut)}
        onSwitchTab={(tab) => setActiveTab(tab)}
      />

      {/* ── Top Header Navigation ── */}
      <header className={`sticky top-0 z-40 backdrop-blur-md border-b px-4 py-2.5 flex items-center justify-between transition-colors duration-200 ${
        isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white/90 border-slate-200 shadow-sm'
      }`}>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
            title="Toggle Systems Tree (Ctrl+B)"
          >
            {isSidebarOpen ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeftOpen className="w-4 h-4" />}
          </button>

          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-teal-500 via-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-teal-500/20">
            <Stethoscope className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-tight bg-gradient-to-r from-teal-500 to-indigo-500 bg-clip-text text-transparent">
                MedTutor
              </span>
              <span className={`text-[9px] uppercase font-bold tracking-widest px-1.5 py-0.2 rounded border hidden sm:inline ${
                isDark ? 'bg-teal-500/10 text-teal-400 border-teal-500/20' : 'bg-teal-50 text-teal-700 border-teal-200'
              }`}>
                19-Subject Integrated
              </span>
            </div>
          </div>
        </div>

        {/* Center & Right Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Global Command Palette Trigger Bar (Linear / Raycast Style) */}
          <button
            onClick={() => setIsCommandPaletteOpen(true)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs transition-all shadow-inner w-36 sm:w-64 justify-between cursor-pointer ${
              isDark 
                ? 'bg-slate-950/80 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border-slate-800' 
                : 'bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 border-slate-300'
            }`}
          >
            <div className="flex items-center gap-2 truncate">
              <Search className="w-3.5 h-3.5 text-teal-500 shrink-0" />
              <span className="truncate">Jump to organ, drug...</span>
            </div>
            <div className="flex items-center gap-1 shrink-0 hidden sm:flex">
              <kbd className={`px-1.5 py-0.2 rounded text-[10px] font-mono border ${
                isDark ? 'bg-slate-800 text-slate-300 border-slate-700' : 'bg-white text-slate-700 border-slate-300'
              }`}>Ctrl</kbd>
              <kbd className={`px-1.5 py-0.2 rounded text-[10px] font-mono border ${
                isDark ? 'bg-slate-800 text-slate-300 border-slate-700' : 'bg-white text-slate-700 border-slate-300'
              }`}>K</kbd>
            </div>
          </button>

          {/* ── 1-CLICK THEME SWITCHER (Obsidian Glass ↔ Nordic Paper) ── */}
          <button
            onClick={toggleTheme}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer shadow-sm ${
              isDark 
                ? 'bg-slate-800/90 hover:bg-slate-700 text-slate-200 border-slate-700 hover:border-slate-600' 
                : 'bg-white hover:bg-slate-100 text-slate-800 border-slate-300 hover:border-slate-400'
            }`}
            title="Toggle Theme (Obsidian Glass ↔ Nordic Paper)"
          >
            {isDark ? (
              <>
                <Moon className="w-3.5 h-3.5 text-indigo-400 fill-indigo-400/20" />
                <span className="hidden md:inline">Obsidian</span>
              </>
            ) : (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-500 fill-amber-500/20" />
                <span className="hidden md:inline">Nordic Paper</span>
              </>
            )}
          </button>

          <button 
            onClick={() => setIsCaseUploadModalOpen(true)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer hidden md:flex ${
              isDark 
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700' 
                : 'bg-white hover:bg-slate-100 text-slate-800 border-slate-300'
            }`}
          >
            <UploadCloud className="w-3.5 h-3.5 text-teal-500" />
            <span>Contribute</span>
          </button>

          <button 
            onClick={() => setIsPatronModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-xs font-bold text-white shadow-md shadow-teal-500/20 transition-all cursor-pointer"
          >
            <Heart className="w-3.5 h-3.5 fill-current" />
            <span className="hidden sm:inline">Support (₹99)</span>
          </button>
        </div>
      </header>

      {/* ── Main App Layout (Vercel-Style 3-Column Architecture) ── */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Column: Collapsible Systems Tree */}
        <SystemsSidebar 
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          activeNodeId="thyroid"
          onSelectNode={() => {}}
        />

        {/* Center Column: Main Content Canvas */}
        <div className={`flex-1 flex flex-col overflow-y-auto transition-colors duration-200 ${
          isDark ? 'bg-slate-950 text-slate-100' : 'bg-[#f8fafc] text-slate-900'
        }`}>
          {/* Breadcrumb Status Bar */}
          <div className={`border-b px-4 py-2 flex flex-wrap items-center justify-between text-xs sticky top-0 z-30 backdrop-blur-md transition-colors duration-200 ${
            isDark ? 'bg-slate-900/40 border-slate-800/80 text-slate-400' : 'bg-slate-100/90 border-slate-200 text-slate-600 shadow-sm'
          }`}>
            <div className="flex items-center gap-2">
              <span className="text-slate-400">System:</span>
              <span className={`font-medium ${isDark ? 'text-slate-300' : 'text-slate-800'}`}>Endocrine System</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className={`font-semibold px-2 py-0.5 rounded border ${
                isDark ? 'text-teal-400 bg-teal-500/10 border-teal-500/20' : 'text-teal-700 bg-teal-50 border-teal-200'
              }`}>
                Node: The Thyroid Gland
              </span>
              <span className="hidden md:inline text-slate-400">• 20 Modular Cuts (16.5 min total)</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                <ShieldCheck className="w-3.5 h-3.5" /> 100% Peer-Verified & Free
              </span>
              <span className="text-slate-400">|</span>
              <span className="font-medium">CBME / NEET-PG Matrix</span>
            </div>
          </div>

          <main className={`flex-1 pb-24 transition-colors duration-200 ${
            isDark ? 'bg-slate-950' : 'bg-[#f8fafc]'
          }`}>
            {/* ROOM 1: VISUAL CINEMA (Modular Video Engine + Osmosis Synced Transcript) */}
            {activeTab === 'visual' && (
              <div className="max-w-7xl mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left: Video Player Cinema & Interactive Callouts */}
                <div className="lg:col-span-8 flex flex-col gap-4">
                  <div className={`relative aspect-video rounded-2xl border overflow-hidden shadow-2xl flex flex-col justify-between p-4 group ${
                    isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-900 border-slate-700 text-white'
                  }`}>
                    {/* Visual Simulation Canvas */}
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-slate-950/80 to-slate-950 flex flex-col items-center justify-center p-6 text-center">
                      <div className="w-16 h-16 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center mb-4 text-teal-400 shadow-inner">
                        <Activity className="w-8 h-8 animate-pulse" />
                      </div>
                      <span className="text-xs uppercase tracking-widest text-teal-400 font-bold mb-1">
                        {selectedCut.subject} • Cut {selectedCut.cutNumber} of {THYROID_CUTS.length}
                      </span>
                      <h2 className="text-xl sm:text-2xl font-black text-white max-w-xl">
                        {selectedCut.title}
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-md line-clamp-2">
                        {selectedCut.visualSummary}
                      </p>
                    </div>

                    {/* Video Top Controls */}
                    <div className="relative z-10 flex items-center justify-between">
                      <span className="text-[11px] font-mono font-bold bg-slate-900/90 text-slate-300 px-2.5 py-1 rounded-md border border-slate-700/60 backdrop-blur-sm">
                        {selectedCut.timecode}
                      </span>
                      <div className="flex items-center gap-2">
                        {(['1.0x', '1.25x', '1.5x', '2.0x'] as const).map(speed => (
                          <button 
                            key={speed}
                            onClick={() => setPlaybackSpeed(speed)}
                            className={`text-[10px] font-bold px-2 py-0.5 rounded transition-all cursor-pointer ${
                              playbackSpeed === speed 
                                ? 'bg-teal-500 text-white shadow-sm shadow-teal-500/30' 
                                : 'bg-slate-900/80 text-slate-400 hover:text-slate-200'
                            }`}
                          >
                            {speed}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Video Bottom Playback Bar */}
                    <div className="relative z-10 flex flex-col gap-2">
                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden cursor-pointer">
                        <div 
                          className="h-full bg-gradient-to-r from-teal-400 to-indigo-500 transition-all duration-300"
                          style={{ width: `${(selectedCut.cutNumber / THYROID_CUTS.length) * 100}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <div className="flex items-center gap-3">
                          <button 
                            onClick={() => {
                              const prevIdx = Math.max(0, selectedCut.cutNumber - 2);
                              setSelectedCut(THYROID_CUTS[prevIdx]);
                            }}
                            className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                            title="Previous Cut"
                          >
                            <Rewind className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => setIsPlaying(!isPlaying)}
                            className="w-8 h-8 rounded-full bg-teal-500 hover:bg-teal-400 text-slate-950 flex items-center justify-center font-bold transition-transform active:scale-95 shadow-md shadow-teal-500/30 cursor-pointer"
                          >
                            {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                          </button>
                          <button 
                            onClick={() => {
                              const nextIdx = Math.min(THYROID_CUTS.length - 1, selectedCut.cutNumber);
                              setSelectedCut(THYROID_CUTS[nextIdx]);
                            }}
                            className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                            title="Next Cut"
                          >
                            <FastForward className="w-4 h-4" />
                          </button>
                          <span className="text-xs text-slate-400 font-mono">
                            {isPlaying ? 'Playing Modular Stream...' : 'Paused'}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-slate-400 font-medium">Modular Beat {selectedCut.cutNumber}/{THYROID_CUTS.length}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Osmosis-Style Synchronized Interactive Transcript */}
                  <OsmosisTranscript 
                    currentCut={selectedCut}
                    allCuts={THYROID_CUTS}
                    onSelectCut={(c) => setSelectedCut(c)}
                  />

                  {/* Dynamic Live Concept Card */}
                  <div className={`border rounded-xl p-4 sm:p-5 flex flex-col gap-3 transition-colors duration-200 ${
                    isDark ? 'bg-slate-900/70 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                  }`}>
                    <div className={`flex items-center justify-between border-b pb-3 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-teal-500" />
                        <h3 className={`text-sm font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                          Live High-Yield Micro-Card ({selectedCut.subject})
                        </h3>
                      </div>
                      <span className="text-[11px] text-slate-400 font-mono">
                        Node Ref: #{selectedCut.id}
                      </span>
                    </div>

                    <p className={`text-sm leading-relaxed font-normal ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      {selectedCut.coreConcept}
                    </p>

                    <div className="grid grid-cols-1 gap-2 pt-1">
                      {selectedCut.highYieldBullets.map((bullet, idx) => (
                        <div key={idx} className={`flex items-start gap-2 border rounded-lg p-2.5 text-xs ${
                          isDark ? 'bg-slate-950/60 border-slate-800/80 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-800 shadow-none'
                        }`}>
                          <CheckCircle className="w-3.5 h-3.5 text-teal-500 shrink-0 mt-0.5" />
                          <span>{bullet}</span>
                        </div>
                      ))}
                    </div>

                    {selectedCut.mnemonic && (
                      <div className={`flex items-start gap-2 border rounded-lg p-3 text-xs ${
                        isDark ? 'bg-indigo-950/40 border-indigo-800/50 text-indigo-200' : 'bg-indigo-50 border-indigo-200 text-indigo-950'
                      }`}>
                        <Lightbulb className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-300 block mb-0.5">High-Yield Mnemonic</span>
                          <span>{selectedCut.mnemonic}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right: 20-Cut Modular Beat Sheet Playlist */}
                <div className="lg:col-span-4 flex flex-col gap-3">
                  <div className={`flex items-center justify-between border rounded-xl p-3 transition-colors ${
                    isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                  }`}>
                    <div>
                      <h4 className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-800'}`}>Modular Cut Sequence</h4>
                      <p className="text-[11px] text-slate-400">20 Independent Cuts (19 Subjects)</p>
                    </div>
                    <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${
                      isDark ? 'text-teal-400 bg-teal-500/10 border-teal-500/20' : 'text-teal-700 bg-teal-50 border-teal-200'
                    }`}>
                      {filteredCuts.length} Cuts
                    </span>
                  </div>

                  {/* Subject Filter Pills */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[10px]">
                    {['All', 'Anatomy', 'Physiology', 'Biochemistry', 'Pathology', 'Pharmacology', 'Medicine', 'Surgery'].map(subj => (
                      <button
                        key={subj}
                        onClick={() => setActiveSubjectFilter(subj)}
                        className={`px-2.5 py-1 rounded-md font-semibold whitespace-nowrap transition-all cursor-pointer ${
                          activeSubjectFilter === subj 
                            ? isDark ? 'bg-slate-700 text-white shadow-sm' : 'bg-slate-800 text-white shadow-sm'
                            : isDark ? 'bg-slate-900/60 text-slate-400 hover:text-slate-200' : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {subj}
                      </button>
                    ))}
                  </div>

                  {/* Cut List */}
                  <div className="flex flex-col gap-2 max-h-[640px] overflow-y-auto pr-1">
                    {filteredCuts.map((cut) => {
                      const isSelected = selectedCut.id === cut.id;
                      return (
                        <button
                          key={cut.id}
                          onClick={() => setSelectedCut(cut)}
                          className={`text-left p-3 rounded-xl border transition-all cursor-pointer flex flex-col gap-1.5 ${
                            isSelected 
                              ? isDark
                                ? 'bg-slate-900 border-teal-500/60 shadow-lg ring-1 ring-teal-500/30'
                                : 'bg-teal-50 border-teal-500 shadow-md ring-1 ring-teal-400/40'
                              : isDark
                                ? 'bg-slate-950/70 border-slate-800/80 hover:bg-slate-900/80 hover:border-slate-700'
                                : 'bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300 shadow-sm'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span 
                                className="w-2 h-2 rounded-full" 
                                style={{ backgroundColor: cut.subjectColor }}
                              />
                              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                {cut.subject}
                              </span>
                            </div>
                            <span className="text-[10px] font-mono text-slate-400">
                              {cut.timecode}
                            </span>
                          </div>
                          <span className={`text-xs font-bold line-clamp-1 ${
                            isSelected ? isDark ? 'text-teal-300' : 'text-teal-900' : isDark ? 'text-slate-200' : 'text-slate-800'
                          }`}>
                            Cut {cut.cutNumber}. {cut.title}
                          </span>
                          <p className="text-[11px] text-slate-400 line-clamp-1">
                            {cut.coreConcept}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* ROOM 2: INTEGRATED WIKI (with Vercel-Style TOC + Amboss Smart Cards) */}
            {activeTab === 'wiki' && (
              <div className="flex items-start justify-center p-4 md:p-6 gap-6">
                <div className="flex-1 max-w-5xl flex flex-col gap-6">
                  {/* Wiki Filter Header */}
                  <div className={`flex flex-wrap items-center justify-between gap-3 border p-4 rounded-xl transition-colors duration-200 ${
                    isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                  }`}>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className={`text-lg font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          Integrated Knowledge Matrix: The Thyroid Gland
                        </h2>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                          isDark ? 'bg-teal-500/10 text-teal-400 border-teal-500/20' : 'bg-teal-50 text-teal-700 border-teal-200'
                        }`}>
                          Amboss Smart Cards Active
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">Hover or click any dotted-underline buzzword to open instant high-yield micro-cards.</p>
                    </div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {(['all', 'anatomy', 'biochem', 'patho', 'pharma', 'medicine', 'surgery'] as const).map(sub => (
                        <button
                          key={sub}
                          onClick={() => setWikiSubject(sub)}
                          className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                            wikiSubject === sub 
                              ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20' 
                              : isDark ? 'bg-slate-800 text-slate-400 hover:text-slate-200' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {sub}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Section 1: Surgical Anatomy */}
                  {(wikiSubject === 'all' || wikiSubject === 'anatomy' || wikiSubject === 'surgery') && (
                    <div id="sec-anatomy" className={`border rounded-xl p-5 flex flex-col gap-4 scroll-mt-20 transition-colors duration-200 ${
                      isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                    }`}>
                      <div className="flex items-center gap-2 text-sky-500 font-bold text-sm uppercase tracking-wider border-b pb-2 border-slate-200 dark:border-slate-800">
                        <Layers className="w-4 h-4" />
                        <span>1. Surgical Anatomy & Nerve Safety Rules</span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        <div className={`p-4 rounded-lg border flex flex-col gap-2 ${
                          isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200 text-slate-800'
                        }`}>
                          <span className="font-bold text-sky-600 dark:text-sky-300 text-sm">Superior Thyroid Artery (STA)</span>
                          <p className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                            Arises as the 1st anterior branch of the <strong>External Carotid Artery</strong>. Closely accompanied by the{' '}
                            <SmartCard conceptId="ebsln" onNavigateToCut={handleNavigateToCut}>
                              External Branch of the Superior Laryngeal Nerve (EBSLN)
                            </SmartCard>.
                          </p>
                          <div className={`p-2.5 rounded font-medium border ${
                            isDark ? 'bg-sky-950/40 border-sky-800/40 text-sky-200' : 'bg-sky-50 border-sky-200 text-sky-900'
                          }`}>
                            ⚠️ <strong>Golden Rule:</strong> Must be ligated <u>AS CLOSE AS POSSIBLE</u> to the upper pole of the gland to spare EBSLN (cricothyroid tensor).
                          </div>
                        </div>

                        <div className={`p-4 rounded-lg border flex flex-col gap-2 ${
                          isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200 text-slate-800'
                        }`}>
                          <span className="font-bold text-rose-600 dark:text-rose-300 text-sm">Inferior Thyroid Artery (ITA)</span>
                          <p className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                            Arises from the <strong>Thyrocervical Trunk</strong> (Subclavian Artery). Crosses the branches of the{' '}
                            <SmartCard conceptId="rln" onNavigateToCut={handleNavigateToCut}>
                              Recurrent Laryngeal Nerve (RLN)
                            </SmartCard>{' '}
                            near the lower pole.
                          </p>
                          <div className={`p-2.5 rounded font-medium border ${
                            isDark ? 'bg-rose-950/40 border-rose-800/40 text-rose-200' : 'bg-rose-50 border-rose-200 text-rose-900'
                          }`}>
                            ⚠️ <strong>Golden Rule:</strong> Must be ligated <u>FAR AWAY FROM THE GLAND</u> (at the trunk) to spare RLN (vocal cords).
                          </div>
                        </div>
                      </div>

                      <div className={`p-3 rounded-lg border text-xs ${
                        isDark ? 'bg-slate-950/60 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-800'
                      }`}>
                        <span>Midline congenital anomalies like Thyroglossal duct cysts require the{' '}</span>
                        <SmartCard conceptId="sistrunk" onNavigateToCut={handleNavigateToCut}>
                          Sistrunk Procedure
                        </SmartCard>
                        <span> to resect the cyst with the central body of the hyoid bone.</span>
                      </div>
                    </div>
                  )}

                  {/* Section 2: Thyroiditis Matrix */}
                  {(wikiSubject === 'all' || wikiSubject === 'patho') && (
                    <div id="sec-thyroiditis" className={`border rounded-xl p-5 flex flex-col gap-4 scroll-mt-20 transition-colors duration-200 ${
                      isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                    }`}>
                      <div className="flex items-center gap-2 text-amber-500 font-bold text-sm uppercase tracking-wider border-b pb-2 border-slate-200 dark:border-slate-800">
                        <BookOpen className="w-4 h-4" />
                        <span>2. High-Yield Comparison: Thyroiditis Subtypes</span>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr className={`border-b text-slate-400 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                              <th className="p-2.5 font-bold">Thyroiditis</th>
                              <th className="p-2.5 font-bold">Etiology</th>
                              <th className="p-2.5 font-bold">Histopathology</th>
                              <th className="p-2.5 font-bold">Clinical & Lab Highlights</th>
                              <th className="p-2.5 font-bold">Exam Trap</th>
                            </tr>
                          </thead>
                          <tbody className={`divide-y ${isDark ? 'divide-slate-800/60 text-slate-300' : 'divide-slate-200 text-slate-700'}`}>
                            <tr>
                              <td className="p-2.5 font-bold text-teal-600 dark:text-teal-300">Hashimoto</td>
                              <td className="p-2.5">Autoimmune (Anti-TPO, Anti-Tg, HLA-DR3/5)</td>
                              <td className="p-2.5">
                                <SmartCard conceptId="hurthle-cells" onNavigateToCut={handleNavigateToCut}>
                                  Hurthle (Askanazy) cells
                                </SmartCard>{' '}
                                with prominent germinal centers
                              </td>
                              <td className="p-2.5">Painless diffuse goiter; leading cause of hypothyroidism</td>
                              <td className="p-2.5 text-amber-600 dark:text-amber-300 font-semibold">Risk of B-cell MALToma</td>
                            </tr>
                            <tr>
                              <td className="p-2.5 font-bold text-teal-600 dark:text-teal-300">De Quervain's</td>
                              <td className="p-2.5">Post-viral URI (Coxsackie, Adenovirus)</td>
                              <td className="p-2.5">Multinucleated giant cells with non-caseating granulomas</td>
                              <td className="p-2.5">Painful tender thyroid, very high ESR</td>
                              <td className="p-2.5 text-amber-600 dark:text-amber-300 font-semibold">RAIU is suppressed (&lt; 2%)</td>
                            </tr>
                            <tr>
                              <td className="p-2.5 font-bold text-teal-600 dark:text-teal-300">Riedel's</td>
                              <td className="p-2.5">IgG4-Related Systemic Sclerosis</td>
                              <td className="p-2.5">Dense fibrous replacement extending into neck structures</td>
                              <td className="p-2.5">"Woody" rock-hard fixed thyroid in young females</td>
                              <td className="p-2.5 text-amber-600 dark:text-amber-300 font-semibold">Mimics Anaplastic Carcinoma</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Section 3: Oncology Matrix */}
                  {(wikiSubject === 'all' || wikiSubject === 'patho' || wikiSubject === 'surgery') && (
                    <div id="sec-oncology" className={`border rounded-xl p-5 flex flex-col gap-4 scroll-mt-20 transition-colors duration-200 ${
                      isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                    }`}>
                      <div className="flex items-center gap-2 text-rose-500 font-bold text-sm uppercase tracking-wider border-b pb-2 border-slate-200 dark:border-slate-800">
                        <Award className="w-4 h-4" />
                        <span>3. The Thyroid Oncology Matrix</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                        <div className={`p-4 rounded-lg border flex flex-col gap-2 ${
                          isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200 text-slate-800'
                        }`}>
                          <span className="font-bold text-teal-600 dark:text-teal-400 text-sm">Papillary Ca (~80%)</span>
                          <p className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                            • <strong>Histology:</strong>{' '}
                            <SmartCard conceptId="orphan-annie" onNavigateToCut={handleNavigateToCut}>
                              Orphan Annie eye nuclei
                            </SmartCard>,{' '}
                            <SmartCard conceptId="psammoma-bodies" onNavigateToCut={handleNavigateToCut}>
                              Psammoma bodies
                            </SmartCard>, Nuclear grooves.
                          </p>
                          <p className={isDark ? 'text-slate-300' : 'text-slate-700'}>• <strong>Genetics:</strong> BRAF V600E, RET/PTC.</p>
                          <p className={isDark ? 'text-slate-300' : 'text-slate-700'}>• <strong>Spread:</strong> Lymphatic to cervical nodes.</p>
                          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">10-Year Survival &gt; 95%</span>
                        </div>

                        <div className={`p-4 rounded-lg border flex flex-col gap-2 ${
                          isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200 text-slate-800'
                        }`}>
                          <span className="font-bold text-amber-600 dark:text-amber-400 text-sm">Follicular Ca (~10%)</span>
                          <p className={isDark ? 'text-slate-300' : 'text-slate-700'}>• <strong>Histology:</strong> Follicles with Capsular / Vascular invasion.</p>
                          <p className={isDark ? 'text-slate-300' : 'text-slate-700'}>• <strong>Genetics:</strong> RAS, PAX8-PPARgamma.</p>
                          <p className={isDark ? 'text-slate-300' : 'text-slate-700'}>• <strong>Spread:</strong> Hematogenous to Bone & Lungs.</p>
                          <p className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                            • <strong>Triage:</strong> Classified under{' '}
                            <SmartCard conceptId="bethesda" onNavigateToCut={handleNavigateToCut}>
                              Bethesda IV (Follicular Neoplasm)
                            </SmartCard>.
                          </p>
                        </div>

                        <div className={`p-4 rounded-lg border flex flex-col gap-2 ${
                          isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200 text-slate-800'
                        }`}>
                          <span className="font-bold text-purple-600 dark:text-purple-400 text-sm">Medullary Ca (~5%)</span>
                          <p className={isDark ? 'text-slate-300' : 'text-slate-700'}>• <strong>Histology:</strong> Amyloid stroma (Congo Red apple-green).</p>
                          <p className={isDark ? 'text-slate-300' : 'text-slate-700'}>• <strong>Origin:</strong> Parafollicular C-cells (Calcitonin+).</p>
                          <p className={isDark ? 'text-slate-300' : 'text-slate-700'}>• <strong>Genetics:</strong> RET mutation (MEN 2A & 2B).</p>
                          <span className="text-[11px] text-purple-600 dark:text-purple-300 font-semibold">Screen family for RET</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Section 4: Pharmacology & Emergencies */}
                  {(wikiSubject === 'all' || wikiSubject === 'pharma' || wikiSubject === 'medicine') && (
                    <div id="sec-pharma" className={`border rounded-xl p-5 flex flex-col gap-4 scroll-mt-20 transition-colors duration-200 ${
                      isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                    }`}>
                      <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm uppercase tracking-wider border-b pb-2 border-slate-200 dark:border-slate-800">
                        <AlertTriangle className="w-4 h-4" />
                        <span>4. Pharmacology, Autoregulation & Thyroid Storm</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        <div className={`p-4 rounded-lg border flex flex-col gap-2 ${
                          isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200 text-slate-800'
                        }`}>
                          <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">Thioamide Pregnancy Algorithm</span>
                          <ul className={`space-y-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                            <li>
                              • <strong>1st Trimester:</strong>{' '}
                              <SmartCard conceptId="ptu" onNavigateToCut={handleNavigateToCut}>
                                Propylthiouracil (PTU)
                              </SmartCard>{' '}
                              is the drug of choice.
                            </li>
                            <li>
                              • <strong>2nd & 3rd Trimester:</strong> Switch to{' '}
                              <SmartCard conceptId="methimazole" onNavigateToCut={handleNavigateToCut}>
                                Methimazole (MMI)
                              </SmartCard>{' '}
                              (prevents PTU hepatotoxicity).
                            </li>
                            <li>
                              • <strong>Autoregulation:</strong> High iodide invokes the{' '}
                              <SmartCard conceptId="wolff-chaikoff" onNavigateToCut={handleNavigateToCut}>
                                Wolff-Chaikoff effect
                              </SmartCard>; autonomous goiters can trigger{' '}
                              <SmartCard conceptId="jod-basedow" onNavigateToCut={handleNavigateToCut}>
                                Jod-Basedow hyperthyroidism
                              </SmartCard>.
                            </li>
                          </ul>
                        </div>

                        <div className={`p-4 rounded-lg border flex flex-col gap-2 ${
                          isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200 text-slate-800'
                        }`}>
                          <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">Thyroid Storm 4-Step Protocol</span>
                          <p className="text-slate-400 mb-1">
                            Diagnosed when{' '}
                            <SmartCard conceptId="burch-wartofsky" onNavigateToCut={handleNavigateToCut}>
                              Burch-Wartofsky Score
                            </SmartCard>{' '}
                            &ge; 45:
                          </p>
                          <ol className={`space-y-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                            <li><strong>1. IV Beta-Blocker:</strong> Esmolol / Propranolol (blocks sympathetic surge).</li>
                            <li><strong>2. High-Dose PTU:</strong> Blocks synthesis + peripheral 5'-deiodinase.</li>
                            <li><strong>3. Iodine (Lugol's):</strong> <u>Given 1 hour AFTER PTU</u> (Wolff-Chaikoff).</li>
                            <li><strong>4. IV Hydrocortisone:</strong> Adrenal support + blocks T4 to T3 conversion.</li>
                          </ol>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Section 5: Bethesda FNAC */}
                  {(wikiSubject === 'all' || wikiSubject === 'surgery') && (
                    <div id="sec-bethesda" className={`border rounded-xl p-5 flex flex-col gap-4 scroll-mt-20 transition-colors duration-200 ${
                      isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                    }`}>
                      <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-bold text-sm uppercase tracking-wider border-b pb-2 border-slate-200 dark:border-slate-800">
                        <Layers className="w-4 h-4" />
                        <span>5. Bethesda System for Thyroid Cytopathology</span>
                      </div>
                      
                      <div className={`p-4 rounded-lg border text-xs space-y-2 ${
                        isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200 text-slate-800'
                      }`}>
                        <p className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                          Fine needle aspiration cytology is the primary diagnostic modality. Stratified using the{' '}
                          <SmartCard conceptId="bethesda" onNavigateToCut={handleNavigateToCut}>
                            Bethesda 6-Tier System
                          </SmartCard>:
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                          <div className={`p-2.5 rounded border ${isDark ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-white border-slate-200 text-slate-700 shadow-sm'}`}>
                            <strong className="text-emerald-600 dark:text-emerald-400 block">Bethesda II (Benign, 0-3% risk):</strong>
                            Observation with serial USG.
                          </div>
                          <div className={`p-2.5 rounded border ${isDark ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-white border-slate-200 text-slate-700 shadow-sm'}`}>
                            <strong className="text-amber-600 dark:text-amber-400 block">Bethesda IV (Follicular Neoplasm, 25-40%):</strong>
                            Diagnostic Hemithyroidectomy.
                          </div>
                          <div className={`p-2.5 rounded border sm:col-span-2 ${isDark ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-white border-slate-200 text-slate-700 shadow-sm'}`}>
                            <strong className="text-rose-600 dark:text-rose-400 block">Bethesda VI (Malignant, 97-99% risk):</strong>
                            Total Thyroidectomy with central compartment dissection.
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Column: Sticky Table of Contents */}
                <TableOfContents />
              </div>
            )}

            {/* ROOM 3: PYQ & ACTIVE RECALL MATRIX */}
            {activeTab === 'pyq' && (
              <div className="max-w-4xl mx-auto p-4 md:p-6 flex flex-col gap-6">
                <div className={`flex items-center justify-between border p-4 rounded-xl transition-colors duration-200 ${
                  isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                }`}>
                  <div>
                    <h2 className={`text-lg font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>NEET-PG & INI-CET Question Bank</h2>
                    <p className="text-xs text-slate-400">Interactive clinical vignettes mapped directly to this thyroid node with Smart Card explanations.</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400 block">Score</span>
                    <span className="text-lg font-black text-teal-500 font-mono">
                      {score} / {THYROID_PYQS.length}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-6">
                  {THYROID_PYQS.map((q, qIndex) => {
                    const userAnswer = selectedAnswers[q.id];
                    const isAnswered = userAnswer !== undefined;
                    const isCorrect = isAnswered && userAnswer === q.correctIndex;

                    return (
                      <div 
                        key={q.id}
                        className={`border rounded-xl p-5 flex flex-col gap-4 shadow-lg transition-colors duration-200 ${
                          isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 border border-indigo-500/20">
                              {q.exam} {q.year}
                            </span>
                            <span className="text-xs text-slate-400">{q.subjectTag}</span>
                          </div>
                          <span className="text-xs font-mono text-slate-400">Q{qIndex + 1}</span>
                        </div>

                        <p className={`text-sm font-medium leading-relaxed ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                          {q.question}
                        </p>

                        <div className="grid grid-cols-1 gap-2">
                          {q.options.map((opt, optIdx) => {
                            let btnStyle = isDark 
                              ? 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300'
                              : 'bg-slate-50 border-slate-200 hover:bg-slate-100 hover:border-slate-300 text-slate-800 shadow-none';
                            
                            if (isAnswered) {
                              if (optIdx === q.correctIndex) {
                                btnStyle = isDark 
                                  ? 'bg-emerald-950/70 border-emerald-500 text-emerald-200 font-semibold'
                                  : 'bg-emerald-50 border-emerald-500 text-emerald-900 font-semibold shadow-sm';
                              } else if (userAnswer === optIdx) {
                                btnStyle = isDark
                                  ? 'bg-rose-950/70 border-rose-500 text-rose-200 line-through'
                                  : 'bg-rose-50 border-rose-400 text-rose-900 line-through';
                              } else {
                                btnStyle = isDark 
                                  ? 'bg-slate-950/40 border-slate-900 text-slate-600 opacity-60'
                                  : 'bg-slate-100/50 border-slate-200 text-slate-400 opacity-60';
                              }
                            }

                            return (
                              <button
                                key={optIdx}
                                disabled={isAnswered}
                                onClick={() => handleSelectOption(q.id, optIdx, q.correctIndex)}
                                className={`text-left px-4 py-3 rounded-lg border text-xs sm:text-sm transition-all flex items-center justify-between cursor-pointer disabled:cursor-default ${btnStyle}`}
                              >
                                <span>{String.fromCharCode(65 + optIdx)}. {opt}</span>
                                {isAnswered && optIdx === q.correctIndex && (
                                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 ml-2" />
                                )}
                              </button>
                            );
                          })}
                        </div>

                        {/* Explanation Box */}
                        {showExplanations[q.id] && (
                          <div className={`mt-2 p-4 rounded-lg border flex flex-col gap-2 text-xs animate-in fade-in duration-200 ${
                            isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
                          }`}>
                            <div className="flex items-center gap-2">
                              <span className={`font-bold ${isCorrect ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                                {isCorrect ? '✓ Correct Answer!' : '✕ Incorrect'}
                              </span>
                              <span className="text-slate-400">•</span>
                              <span className="text-indigo-600 dark:text-indigo-400 font-semibold">⚡ {q.buzzword}</span>
                            </div>
                            <p className={`leading-relaxed font-normal ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                              {q.explanation}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ROOM 4: RADIOPAEDIA-STYLE CLINICAL ATLAS */}
            {activeTab === 'atlas' && (
              <RadiopaediaCaseViewer onOpenUploadModal={() => setIsCaseUploadModalOpen(true)} />
            )}
          </main>
        </div>
      </div>

      {/* ── DaVinci-Style Bottom Workspace Switcher Dock ── */}
      <footer className={`fixed bottom-0 inset-x-0 z-40 backdrop-blur-lg border-t px-4 py-2 flex items-center justify-center transition-colors duration-200 ${
        isDark ? 'bg-slate-900/95 border-slate-800' : 'bg-white/95 border-slate-200 shadow-lg'
      }`}>
        <div className={`flex items-center gap-1 sm:gap-2 p-1 rounded-xl border shadow-2xl ${
          isDark ? 'bg-slate-950 border-slate-800/80' : 'bg-slate-100 border-slate-300'
        }`}>
          {[
            { id: 'visual', label: '1. Visual Cinema', icon: Play, shortcut: 'Alt+1' },
            { id: 'wiki', label: '2. Integrated Wiki', icon: BookOpen, shortcut: 'Alt+2' },
            { id: 'pyq', label: '3. PYQ Matrix', icon: CheckCircle, shortcut: 'Alt+3' },
            { id: 'atlas', label: '4. Clinical Atlas', icon: Layers, shortcut: 'Alt+4' },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as WorkspaceTab)}
                className={`flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  isActive 
                    ? 'bg-gradient-to-r from-teal-500 to-indigo-600 text-white shadow-lg shadow-teal-500/20 ring-1 ring-teal-400/40' 
                    : isDark ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-900' : 'text-slate-600 hover:text-slate-900 hover:bg-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.label.split('.')[1]}</span>
              </button>
            );
          })}
        </div>
      </footer>

      {/* ── MODAL 1: Community Support / Patron Pass (₹99) ── */}
      {isPatronModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`border rounded-2xl max-w-md w-full p-6 relative shadow-2xl animate-in zoom-in-95 duration-150 ${
            isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <button 
              onClick={() => setIsPatronModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-200 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-500 mb-4">
              <Heart className="w-6 h-6 fill-current" />
            </div>

            <h3 className={`text-xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>Keep Medical Education 100% Free</h3>
            <p className={`text-xs mt-2 leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              MedTutor is an initiative to make integrated 19-subject MBBS and NEET-PG education free, visual, and accessible without expensive coaching paywalls.
            </p>

            <div className={`p-4 rounded-xl border my-4 flex items-center justify-between ${
              isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <div>
                <span className="text-xs text-slate-400 block">Monthly Supporter Pass</span>
                <span className="text-2xl font-black text-teal-500 font-mono">₹99 <span className="text-xs text-slate-400">/ month</span></span>
              </div>
              <span className="text-[10px] uppercase tracking-wider font-bold bg-teal-500/10 text-teal-600 dark:text-teal-400 px-2 py-1 rounded border border-teal-500/20">
                Cancel Anytime
              </span>
            </div>

            <ul className={`text-xs space-y-2 mb-5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-teal-500" />
                <span>Founding Supporter Badge on Community Profile</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-teal-500" />
                <span>Directly funds free server hosting & AI synthesis</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-teal-500" />
                <span>Vote on which organ system is released next</span>
              </li>
            </ul>

            <button 
              onClick={() => {
                alert('Thank you for supporting MedTutor! Payment gateway simulation complete.');
                setIsPatronModalOpen(false);
              }}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-sm font-bold text-white shadow-lg shadow-teal-500/25 transition-all cursor-pointer"
            >
              Support with ₹99 via UPI / Card
            </button>
          </div>
        </div>
      )}

      {/* ── MODAL 2: Contribute Case / Study ── */}
      {isCaseUploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`border rounded-2xl max-w-lg w-full p-6 relative shadow-2xl ${
            isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <button 
              onClick={() => {
                setIsCaseUploadModalOpen(false);
                setCaseSubmitted(false);
              }}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-200 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {!caseSubmitted ? (
              <form onSubmit={(e) => { e.preventDefault(); setCaseSubmitted(true); }} className="space-y-4">
                <div className="flex items-center gap-2">
                  <UploadCloud className="w-5 h-5 text-teal-500" />
                  <h3 className={`text-lg font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>Contribute Clinical Case / Image</h3>
                </div>

                <div className={`p-3 rounded-lg text-xs space-y-1 border ${
                  isDark ? 'bg-amber-950/30 border-amber-800/40 text-amber-300' : 'bg-amber-50 border-amber-200 text-amber-900'
                }`}>
                  <strong>⚠️ Patient Privacy & AI De-Identification Gate:</strong>
                  <p>All names, hospital MRNs, faces, and patient identifiers must be stripped. Our automated AI filter will mask facial features before editor review.</p>
                </div>

                <div className="space-y-1">
                  <label className={`text-xs font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Case Title</label>
                  <input 
                    required 
                    placeholder="e.g., Toxic Multinodular Goiter with Retrosternal Extension" 
                    className={`w-full rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-teal-500 border ${
                      isDark ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className={`text-xs font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Age & Gender</label>
                    <input 
                      required 
                      placeholder="e.g., 52 Female" 
                      className={`w-full rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-teal-500 border ${
                        isDark ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
                      }`}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className={`text-xs font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Your Medical Role</label>
                    <input 
                      required 
                      placeholder="e.g., Surgery Resident, KGMU" 
                      className={`w-full rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-teal-500 border ${
                        isDark ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
                      }`}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className={`text-xs font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Clinical Findings & Diagnosis</label>
                  <textarea 
                    required 
                    rows={3} 
                    placeholder="Brief description of presentation, USG/FNAC findings, and surgical/medical management..." 
                    className={`w-full rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-teal-500 border ${
                      isDark ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold transition-all shadow-md shadow-teal-500/20 cursor-pointer"
                >
                  Submit Case to Editorial Review Queue
                </button>
              </form>
            ) : (
              <div className="text-center py-6 space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <h4 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Case Submitted for Review!</h4>
                <p className={`text-xs max-w-sm mx-auto ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  Your case has passed the automated PII sanitizer and is now in the Chief Editor (Dr. Shivam Gola) verification queue. Once stamped, it will appear on your public profile and the Clinical Atlas.
                </p>
                <button 
                  onClick={() => { setIsCaseUploadModalOpen(false); setCaseSubmitted(false); }}
                  className={`px-4 py-2 rounded-lg text-xs font-bold cursor-pointer ${
                    isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-200' : 'bg-slate-200 hover:bg-slate-300 text-slate-800'
                  }`}
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
