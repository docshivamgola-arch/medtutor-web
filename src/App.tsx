import { useState, useMemo, useEffect } from 'react';
import { 
  Play, Pause, FastForward, Rewind, CheckCircle, 
  BookOpen, Layers, Activity, ChevronRight,
  Search, ShieldCheck, Heart, Award, 
  Sparkles, Stethoscope, AlertTriangle, Lightbulb,
  UploadCloud, X, PanelLeftClose, PanelLeftOpen
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

type WorkspaceTab = 'visual' | 'wiki' | 'pyq' | 'atlas';

export default function App() {
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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-teal-500 selection:text-white">
      {/* ── Command Palette (Ctrl+K) ── */}
      <CommandPalette 
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelectCut={(cut) => setSelectedCut(cut)}
        onSwitchTab={(tab) => setActiveTab(tab)}
      />

      {/* ── Top Header Navigation ── */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
            title="Toggle Systems Tree (Ctrl+B)"
          >
            {isSidebarOpen ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeftOpen className="w-4 h-4" />}
          </button>

          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-teal-500 via-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-teal-500/20">
            <Stethoscope className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-tight bg-gradient-to-r from-teal-400 to-indigo-300 bg-clip-text text-transparent">
                MedTutor
              </span>
              <span className="text-[9px] uppercase font-bold tracking-widest px-1.5 py-0.2 rounded bg-teal-500/10 text-teal-400 border border-teal-500/20 hidden sm:inline">
                19-Subject Integrated
              </span>
            </div>
          </div>
        </div>

        {/* Global Command Palette Trigger Bar (Linear / Raycast Style) */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsCommandPaletteOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/80 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 hover:border-slate-700 text-xs transition-all shadow-inner w-44 sm:w-72 justify-between cursor-pointer"
          >
            <div className="flex items-center gap-2 truncate">
              <Search className="w-3.5 h-3.5 text-teal-400 shrink-0" />
              <span className="truncate">Jump to organ, drug, buzzword...</span>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <kbd className="px-1.5 py-0.2 rounded bg-slate-800 text-[10px] font-mono text-slate-300 border border-slate-700">Ctrl</kbd>
              <kbd className="px-1.5 py-0.2 rounded bg-slate-800 text-[10px] font-mono text-slate-300 border border-slate-700">K</kbd>
            </div>
          </button>

          <button 
            onClick={() => setIsCaseUploadModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-all cursor-pointer hidden md:flex"
          >
            <UploadCloud className="w-3.5 h-3.5 text-teal-400" />
            <span>Contribute</span>
          </button>

          <button 
            onClick={() => setIsPatronModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-xs font-bold text-white shadow-md shadow-teal-500/20 transition-all cursor-pointer"
          >
            <Heart className="w-3.5 h-3.5 fill-current" />
            <span>Support (₹99)</span>
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
        <div className="flex-1 flex flex-col overflow-y-auto">
          {/* Breadcrumb Status Bar */}
          <div className="bg-slate-900/40 border-b border-slate-800/80 px-4 py-2 flex flex-wrap items-center justify-between text-xs text-slate-400 sticky top-0 z-30 backdrop-blur-md">
            <div className="flex items-center gap-2">
              <span className="text-slate-500">System:</span>
              <span className="text-slate-300 font-medium">Endocrine System</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
              <span className="text-teal-400 font-semibold bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20">
                Node: The Thyroid Gland
              </span>
              <span className="text-slate-500 hidden md:inline">• 20 Modular Cuts (16.5 min total)</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-emerald-400 font-medium">
                <ShieldCheck className="w-3.5 h-3.5" /> 100% Peer-Verified & Free
              </span>
              <span className="text-slate-500">|</span>
              <span className="text-slate-400 font-medium">CBME / NEET-PG Matrix</span>
            </div>
          </div>

          <main className="flex-1 pb-24">
            {/* ROOM 1: VISUAL CINEMA (Modular Video Engine + Osmosis Synced Transcript) */}
            {activeTab === 'visual' && (
              <div className="max-w-7xl mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left: Video Player Cinema & Interactive Callouts */}
                <div className="lg:col-span-8 flex flex-col gap-4">
                  <div className="relative aspect-video bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl flex flex-col justify-between p-4 group">
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

                  {/* Dynamic Live Concept Card (Zero-Re-rendering Layer) */}
                  <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 sm:p-5 flex flex-col gap-3">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-teal-400" />
                        <h3 className="text-sm font-bold text-slate-200">
                          Live High-Yield Micro-Card ({selectedCut.subject})
                        </h3>
                      </div>
                      <span className="text-[11px] text-slate-400 font-mono">
                        Node Ref: #{selectedCut.id}
                      </span>
                    </div>

                    <p className="text-sm text-slate-300 leading-relaxed font-normal">
                      {selectedCut.coreConcept}
                    </p>

                    <div className="grid grid-cols-1 gap-2 pt-1">
                      {selectedCut.highYieldBullets.map((bullet, idx) => (
                        <div key={idx} className="flex items-start gap-2 bg-slate-950/60 border border-slate-800/80 rounded-lg p-2.5 text-xs text-slate-300">
                          <CheckCircle className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" />
                          <span>{bullet}</span>
                        </div>
                      ))}
                    </div>

                    {selectedCut.mnemonic && (
                      <div className="flex items-start gap-2 bg-indigo-950/40 border border-indigo-800/50 rounded-lg p-3 text-xs text-indigo-200">
                        <Lightbulb className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold uppercase tracking-wider text-indigo-300 block mb-0.5">High-Yield Mnemonic</span>
                          <span>{selectedCut.mnemonic}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right: 20-Cut Modular Beat Sheet Playlist */}
                <div className="lg:col-span-4 flex flex-col gap-3">
                  <div className="flex items-center justify-between bg-slate-900 border border-slate-800 rounded-xl p-3">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">Modular Cut Sequence</h4>
                      <p className="text-[11px] text-slate-500">20 Independent Cuts (19 Subjects)</p>
                    </div>
                    <span className="text-xs font-mono font-bold text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20">
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
                            ? 'bg-slate-700 text-white shadow-sm' 
                            : 'bg-slate-900/60 text-slate-400 hover:text-slate-200'
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
                              ? 'bg-slate-900 border-teal-500/60 shadow-lg shadow-teal-500/5 ring-1 ring-teal-500/30' 
                              : 'bg-slate-950/70 border-slate-800/80 hover:bg-slate-900/80 hover:border-slate-700'
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
                            <span className="text-[10px] font-mono text-slate-500">
                              {cut.timecode}
                            </span>
                          </div>
                          <span className="text-xs font-bold text-slate-200 line-clamp-1">
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
                  <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-4 rounded-xl">
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-lg font-black text-white">Integrated Knowledge Matrix: The Thyroid Gland</h2>
                        <span className="text-[10px] font-bold bg-teal-500/10 text-teal-400 px-2 py-0.5 rounded border border-teal-500/20">
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
                              : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          {sub}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Section 1: Surgical Anatomy */}
                  {(wikiSubject === 'all' || wikiSubject === 'anatomy' || wikiSubject === 'surgery') && (
                    <div id="sec-anatomy" className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 flex flex-col gap-4 scroll-mt-20">
                      <div className="flex items-center gap-2 text-sky-400 font-bold text-sm uppercase tracking-wider border-b border-slate-800 pb-2">
                        <Layers className="w-4 h-4" />
                        <span>1. Surgical Anatomy & Nerve Safety Rules</span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 flex flex-col gap-2">
                          <span className="font-bold text-sky-300 text-sm">Superior Thyroid Artery (STA)</span>
                          <p className="text-slate-300">
                            Arises as the 1st anterior branch of the <strong>External Carotid Artery</strong>. Closely accompanied by the{' '}
                            <SmartCard conceptId="ebsln" onNavigateToCut={handleNavigateToCut}>
                              External Branch of the Superior Laryngeal Nerve (EBSLN)
                            </SmartCard>.
                          </p>
                          <div className="bg-sky-950/40 border border-sky-800/40 p-2.5 rounded text-sky-200 font-medium">
                            ⚠️ <strong>Golden Rule:</strong> Must be ligated <u>AS CLOSE AS POSSIBLE</u> to the upper pole of the gland to spare EBSLN (cricothyroid tensor).
                          </div>
                        </div>

                        <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 flex flex-col gap-2">
                          <span className="font-bold text-rose-300 text-sm">Inferior Thyroid Artery (ITA)</span>
                          <p className="text-slate-300">
                            Arises from the <strong>Thyrocervical Trunk</strong> (Subclavian Artery). Crosses the branches of the{' '}
                            <SmartCard conceptId="rln" onNavigateToCut={handleNavigateToCut}>
                              Recurrent Laryngeal Nerve (RLN)
                            </SmartCard>{' '}
                            near the lower pole.
                          </p>
                          <div className="bg-rose-950/40 border border-rose-800/40 p-2.5 rounded text-rose-200 font-medium">
                            ⚠️ <strong>Golden Rule:</strong> Must be ligated <u>FAR AWAY FROM THE GLAND</u> (at the trunk) to spare RLN (vocal cords).
                          </div>
                        </div>
                      </div>

                      <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800 text-xs text-slate-300">
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
                    <div id="sec-thyroiditis" className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 flex flex-col gap-4 scroll-mt-20">
                      <div className="flex items-center gap-2 text-yellow-400 font-bold text-sm uppercase tracking-wider border-b border-slate-800 pb-2">
                        <BookOpen className="w-4 h-4" />
                        <span>2. High-Yield Comparison: Thyroiditis Subtypes</span>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr className="border-b border-slate-800 text-slate-400">
                              <th className="p-2.5 font-bold">Thyroiditis</th>
                              <th className="p-2.5 font-bold">Etiology</th>
                              <th className="p-2.5 font-bold">Histopathology</th>
                              <th className="p-2.5 font-bold">Clinical & Lab Highlights</th>
                              <th className="p-2.5 font-bold">Exam Trap</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800/60 text-slate-300">
                            <tr>
                              <td className="p-2.5 font-bold text-teal-300">Hashimoto</td>
                              <td className="p-2.5">Autoimmune (Anti-TPO, Anti-Tg, HLA-DR3/5)</td>
                              <td className="p-2.5">
                                <SmartCard conceptId="hurthle-cells" onNavigateToCut={handleNavigateToCut}>
                                  Hurthle (Askanazy) cells
                                </SmartCard>{' '}
                                with prominent germinal centers
                              </td>
                              <td className="p-2.5">Painless diffuse goiter; leading cause of hypothyroidism</td>
                              <td className="p-2.5 text-amber-300">Risk of B-cell MALToma</td>
                            </tr>
                            <tr>
                              <td className="p-2.5 font-bold text-teal-300">De Quervain's</td>
                              <td className="p-2.5">Post-viral URI (Coxsackie, Adenovirus)</td>
                              <td className="p-2.5">Multinucleated giant cells with non-caseating granulomas</td>
                              <td className="p-2.5">Painful tender thyroid, very high ESR</td>
                              <td className="p-2.5 text-amber-300">RAIU is suppressed (&lt; 2%)</td>
                            </tr>
                            <tr>
                              <td className="p-2.5 font-bold text-teal-300">Riedel's</td>
                              <td className="p-2.5">IgG4-Related Systemic Sclerosis</td>
                              <td className="p-2.5">Dense fibrous replacement extending into neck structures</td>
                              <td className="p-2.5">"Woody" rock-hard fixed thyroid in young females</td>
                              <td className="p-2.5 text-amber-300">Mimics Anaplastic Carcinoma</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Section 3: Oncology Matrix */}
                  {(wikiSubject === 'all' || wikiSubject === 'patho' || wikiSubject === 'surgery') && (
                    <div id="sec-oncology" className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 flex flex-col gap-4 scroll-mt-20">
                      <div className="flex items-center gap-2 text-rose-400 font-bold text-sm uppercase tracking-wider border-b border-slate-800 pb-2">
                        <Award className="w-4 h-4" />
                        <span>3. The Thyroid Oncology Matrix</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                        <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 flex flex-col gap-2">
                          <span className="font-bold text-teal-400 text-sm">Papillary Ca (~80%)</span>
                          <p className="text-slate-300">
                            • <strong>Histology:</strong>{' '}
                            <SmartCard conceptId="orphan-annie" onNavigateToCut={handleNavigateToCut}>
                              Orphan Annie eye nuclei
                            </SmartCard>,{' '}
                            <SmartCard conceptId="psammoma-bodies" onNavigateToCut={handleNavigateToCut}>
                              Psammoma bodies
                            </SmartCard>, Nuclear grooves.
                          </p>
                          <p className="text-slate-300">• <strong>Genetics:</strong> BRAF V600E, RET/PTC.</p>
                          <p className="text-slate-300">• <strong>Spread:</strong> Lymphatic to cervical nodes.</p>
                          <span className="text-[11px] text-emerald-400 font-semibold">10-Year Survival &gt; 95%</span>
                        </div>

                        <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 flex flex-col gap-2">
                          <span className="font-bold text-amber-400 text-sm">Follicular Ca (~10%)</span>
                          <p className="text-slate-300">• <strong>Histology:</strong> Follicles with Capsular / Vascular invasion.</p>
                          <p className="text-slate-300">• <strong>Genetics:</strong> RAS, PAX8-PPARgamma.</p>
                          <p className="text-slate-300">• <strong>Spread:</strong> Hematogenous to Bone & Lungs.</p>
                          <p className="text-slate-300">
                            • <strong>Triage:</strong> Classified on FNAC under{' '}
                            <SmartCard conceptId="bethesda" onNavigateToCut={handleNavigateToCut}>
                              Bethesda IV (Follicular Neoplasm)
                            </SmartCard>.
                          </p>
                        </div>

                        <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 flex flex-col gap-2">
                          <span className="font-bold text-purple-400 text-sm">Medullary Ca (~5%)</span>
                          <p className="text-slate-300">• <strong>Histology:</strong> Amyloid stroma (Congo Red apple-green).</p>
                          <p className="text-slate-300">• <strong>Origin:</strong> Parafollicular C-cells (Calcitonin+).</p>
                          <p className="text-slate-300">• <strong>Genetics:</strong> RET mutation (MEN 2A & 2B).</p>
                          <span className="text-[11px] text-purple-300 font-semibold">Screen family for RET</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Section 4: Pharmacology & Emergencies */}
                  {(wikiSubject === 'all' || wikiSubject === 'pharma' || wikiSubject === 'medicine') && (
                    <div id="sec-pharma" className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 flex flex-col gap-4 scroll-mt-20">
                      <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm uppercase tracking-wider border-b border-slate-800 pb-2">
                        <AlertTriangle className="w-4 h-4 text-emerald-400" />
                        <span>4. Pharmacology, Autoregulation & Thyroid Storm</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 flex flex-col gap-2">
                          <span className="font-bold text-emerald-400 text-sm">Thioamide Pregnancy Algorithm</span>
                          <ul className="space-y-2 text-slate-300">
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

                        <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 flex flex-col gap-2">
                          <span className="font-bold text-emerald-400 text-sm">Thyroid Storm 4-Step Protocol</span>
                          <p className="text-slate-400 mb-1">
                            Diagnosed when{' '}
                            <SmartCard conceptId="burch-wartofsky" onNavigateToCut={handleNavigateToCut}>
                              Burch-Wartofsky Score
                            </SmartCard>{' '}
                            &ge; 45:
                          </p>
                          <ol className="space-y-1 text-slate-300">
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
                    <div id="sec-bethesda" className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 flex flex-col gap-4 scroll-mt-20">
                      <div className="flex items-center gap-2 text-purple-400 font-bold text-sm uppercase tracking-wider border-b border-slate-800 pb-2">
                        <Layers className="w-4 h-4" />
                        <span>5. Bethesda System for Thyroid Cytopathology</span>
                      </div>
                      
                      <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 text-xs space-y-2">
                        <p className="text-slate-300">
                          Fine needle aspiration cytology is the primary diagnostic modality. Stratified using the{' '}
                          <SmartCard conceptId="bethesda" onNavigateToCut={handleNavigateToCut}>
                            Bethesda 6-Tier System
                          </SmartCard>:
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-300">
                          <div className="bg-slate-900 p-2.5 rounded border border-slate-800">
                            <strong className="text-emerald-400 block">Bethesda II (Benign, 0-3% risk):</strong>
                            Observation with serial USG.
                          </div>
                          <div className="bg-slate-900 p-2.5 rounded border border-slate-800">
                            <strong className="text-amber-400 block">Bethesda IV (Follicular Neoplasm, 25-40%):</strong>
                            Diagnostic Hemithyroidectomy.
                          </div>
                          <div className="bg-slate-900 p-2.5 rounded border border-slate-800 sm:col-span-2">
                            <strong className="text-rose-400 block">Bethesda VI (Malignant, 97-99% risk):</strong>
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
                <div className="flex items-center justify-between bg-slate-900 border border-slate-800 p-4 rounded-xl">
                  <div>
                    <h2 className="text-lg font-black text-white">NEET-PG & INI-CET Question Bank</h2>
                    <p className="text-xs text-slate-400">Interactive clinical vignettes mapped directly to this thyroid node with Smart Card explanations.</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400 block">Score</span>
                    <span className="text-lg font-black text-teal-400 font-mono">
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
                        className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 flex flex-col gap-4 shadow-lg"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                              {q.exam} {q.year}
                            </span>
                            <span className="text-xs text-slate-400">{q.subjectTag}</span>
                          </div>
                          <span className="text-xs font-mono text-slate-500">Q{qIndex + 1}</span>
                        </div>

                        <p className="text-sm font-medium text-slate-200 leading-relaxed">
                          {q.question}
                        </p>

                        <div className="grid grid-cols-1 gap-2">
                          {q.options.map((opt, optIdx) => {
                            let btnStyle = 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300';
                            if (isAnswered) {
                              if (optIdx === q.correctIndex) {
                                btnStyle = 'bg-emerald-950/70 border-emerald-500 text-emerald-200 font-semibold';
                              } else if (userAnswer === optIdx) {
                                btnStyle = 'bg-rose-950/70 border-rose-500 text-rose-200 line-through';
                              } else {
                                btnStyle = 'bg-slate-950/40 border-slate-900 text-slate-600 opacity-60';
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
                                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />
                                )}
                              </button>
                            );
                          })}
                        </div>

                        {/* Explanation Box */}
                        {showExplanations[q.id] && (
                          <div className="mt-2 p-4 rounded-lg bg-slate-950 border border-slate-800 flex flex-col gap-2 text-xs animate-in fade-in duration-200">
                            <div className="flex items-center gap-2">
                              <span className={`font-bold ${isCorrect ? 'text-emerald-400' : 'text-rose-400'}`}>
                                {isCorrect ? '✓ Correct Answer!' : '✕ Incorrect'}
                              </span>
                              <span className="text-slate-500">•</span>
                              <span className="text-indigo-400 font-semibold">⚡ {q.buzzword}</span>
                            </div>
                            <p className="text-slate-300 leading-relaxed font-normal">
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
      <footer className="fixed bottom-0 inset-x-0 z-40 bg-slate-900/95 backdrop-blur-lg border-t border-slate-800 px-4 py-2 flex items-center justify-center">
        <div className="flex items-center gap-1 sm:gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800/80 shadow-2xl">
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
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
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
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 relative shadow-2xl animate-in zoom-in-95 duration-150">
            <button 
              onClick={() => setIsPatronModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 mb-4">
              <Heart className="w-6 h-6 fill-current" />
            </div>

            <h3 className="text-xl font-black text-white">Keep Medical Education 100% Free</h3>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              MedTutor is an initiative to make integrated 19-subject MBBS and NEET-PG education free, visual, and accessible without expensive coaching paywalls.
            </p>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 my-4 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 block">Monthly Supporter Pass</span>
                <span className="text-2xl font-black text-teal-400 font-mono">₹99 <span className="text-xs text-slate-500">/ month</span></span>
              </div>
              <span className="text-[10px] uppercase tracking-wider font-bold bg-teal-500/10 text-teal-400 px-2 py-1 rounded border border-teal-500/20">
                Cancel Anytime
              </span>
            </div>

            <ul className="text-xs text-slate-300 space-y-2 mb-5">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-teal-400" />
                <span>Founding Supporter Badge on Community Profile</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-teal-400" />
                <span>Directly funds free server hosting & AI synthesis</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-teal-400" />
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

      {/* ── MODAL 2: Contribute Case / Study (AI De-Identification Gate) ── */}
      {isCaseUploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 relative shadow-2xl">
            <button 
              onClick={() => {
                setIsCaseUploadModalOpen(false);
                setCaseSubmitted(false);
              }}
              className="absolute top-4 right-4 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {!caseSubmitted ? (
              <form onSubmit={(e) => { e.preventDefault(); setCaseSubmitted(true); }} className="space-y-4">
                <div className="flex items-center gap-2">
                  <UploadCloud className="w-5 h-5 text-teal-400" />
                  <h3 className="text-lg font-black text-white">Contribute Clinical Case / Image</h3>
                </div>

                <div className="bg-amber-950/30 border border-amber-800/40 p-3 rounded-lg text-xs text-amber-300 space-y-1">
                  <strong>⚠️ Patient Privacy & AI De-Identification Gate:</strong>
                  <p>All names, hospital MRNs, faces, and patient identifiers must be stripped. Our automated AI filter will mask facial features before editor review.</p>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Case Title</label>
                  <input 
                    required 
                    placeholder="e.g., Toxic Multinodular Goiter with Retrosternal Extension" 
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300">Age & Gender</label>
                    <input 
                      required 
                      placeholder="e.g., 52 Female" 
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-teal-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300">Your Medical Role</label>
                    <input 
                      required 
                      placeholder="e.g., Surgery Resident, KGMU" 
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-teal-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Clinical Findings & Diagnosis</label>
                  <textarea 
                    required 
                    rows={3} 
                    placeholder="Brief description of presentation, USG/FNAC findings, and surgical/medical management..." 
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-teal-500"
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
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-white">Case Submitted for Review!</h4>
                <p className="text-xs text-slate-300 max-w-sm mx-auto">
                  Your case has passed the automated PII sanitizer and is now in the Chief Editor (Dr. Shivam Gola) verification queue. Once stamped, it will appear on your public profile and the Clinical Atlas.
                </p>
                <button 
                  onClick={() => { setIsCaseUploadModalOpen(false); setCaseSubmitted(false); }}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 cursor-pointer"
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
