import React, { useState } from 'react';
import { 
  ZoomIn, ZoomOut, RotateCcw, 
  MapPin, CheckCircle, ThumbsUp, UserCheck, 
  UploadCloud
} from 'lucide-react';
import { THYROID_CASES } from '../data/thyroidData';
import type { ClinicalCase } from '../data/thyroidData';
import { useTheme } from '../context/ThemeContext';

interface RadiopaediaCaseViewerProps {
  onOpenUploadModal: () => void;
}

export const RadiopaediaCaseViewer: React.FC<RadiopaediaCaseViewerProps> = ({ onOpenUploadModal }) => {
  const { isDark } = useTheme();
  const [selectedCase, setSelectedCase] = useState<ClinicalCase>(THYROID_CASES[0]);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [showAnnotations, setShowAnnotations] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'presentation' | 'investigations' | 'management'>('presentation');
  const [upvotes, setUpvotes] = useState<Record<string, number>>({
    'case-001': 42,
    'case-002': 38
  });
  const [hasUpvoted, setHasUpvoted] = useState<Record<string, boolean>>({});

  const handleZoom = (delta: number) => {
    setZoomLevel(prev => Math.min(2.5, Math.max(0.8, prev + delta)));
  };

  const handleToggleUpvote = (caseId: string) => {
    if (hasUpvoted[caseId]) {
      setUpvotes(prev => ({ ...prev, [caseId]: prev[caseId] - 1 }));
      setHasUpvoted(prev => ({ ...prev, [caseId]: false }));
    } else {
      setUpvotes(prev => ({ ...prev, [caseId]: prev[caseId] + 1 }));
      setHasUpvoted(prev => ({ ...prev, [caseId]: true }));
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 flex flex-col gap-6">
      {/* Top Header Bar */}
      <div className={`flex flex-wrap items-center justify-between gap-3 border p-4 rounded-2xl shadow-sm transition-colors ${
        isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'
      }`}>
        <div>
          <div className="flex items-center gap-2">
            <h2 className={`text-lg font-black ${isDark ? 'text-white' : 'text-zinc-900'}`}>
              Clinical & Histology Atlas
            </h2>
            <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${
              isDark ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-blue-50 text-blue-700 border-blue-200'
            }`}>
              Interactive Slide Viewer
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            Split-view clinical examination, high-resolution histopathology annotations, and verified doctor case reports.
          </p>
        </div>

        {/* Case Switcher Tabs */}
        <div className="flex items-center gap-2">
          {THYROID_CASES.map((c, idx) => (
            <button
              key={c.id}
              onClick={() => {
                setSelectedCase(c);
                setZoomLevel(1);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedCase.id === c.id 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : isDark ? 'bg-zinc-800 text-zinc-400 hover:text-zinc-200' : 'bg-zinc-100 text-zinc-600 hover:text-zinc-900'
              }`}
            >
              Case 0{idx + 1}: {c.finalDiagnosis.split(' ')[0]}
            </button>
          ))}
          <button
            onClick={onOpenUploadModal}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
              isDark ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border-zinc-700' : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700 border-zinc-300'
            }`}
          >
            <UploadCloud className="w-3.5 h-3.5 text-blue-500" />
            <span className="hidden sm:inline">Upload</span>
          </button>
        </div>
      </div>

      {/* Main Split-Pane Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Pane: Interactive Deep Medical Image / Slide Viewer */}
        <div className={`lg:col-span-7 border rounded-2xl overflow-hidden shadow-sm flex flex-col transition-colors ${
          isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'
        }`}>
          {/* Image Toolbar */}
          <div className={`px-4 py-2.5 border-b flex items-center justify-between text-xs ${
            isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-zinc-100 border-zinc-200'
          }`}>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono font-bold text-blue-500">
                {selectedCase.ageGender}
              </span>
              <span className="text-zinc-400">|</span>
              <span className={`font-medium truncate max-w-xs ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>
                {selectedCase.title}
              </span>
            </div>

            {/* Zoom Controls */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setShowAnnotations(!showAnnotations)}
                className={`px-2 py-1 rounded text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                  showAnnotations 
                    ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' 
                    : isDark ? 'bg-zinc-800 text-zinc-400' : 'bg-zinc-200 text-zinc-600'
                }`}
                title="Toggle High-Yield Hotspot Pins"
              >
                <MapPin className="w-3 h-3" />
                <span className="hidden sm:inline">Pins</span>
              </button>
              <button
                onClick={() => handleZoom(-0.2)}
                className={`p-1.5 rounded cursor-pointer ${isDark ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300' : 'bg-zinc-200 hover:bg-zinc-300 text-zinc-700'}`}
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="text-[10px] font-mono text-zinc-400 w-10 text-center">
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                onClick={() => handleZoom(0.2)}
                className={`p-1.5 rounded cursor-pointer ${isDark ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300' : 'bg-zinc-200 hover:bg-zinc-300 text-zinc-700'}`}
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setZoomLevel(1)}
                className={`p-1.5 rounded cursor-pointer ${isDark ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300' : 'bg-zinc-200 hover:bg-zinc-300 text-zinc-700'}`}
                title="Reset Zoom"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Interactive Zoomable Viewport */}
          <div className="relative aspect-video sm:aspect-[4/3] bg-black overflow-hidden flex items-center justify-center p-4 group">
            <div 
              className="relative transition-transform duration-150 ease-out origin-center"
              style={{ transform: `scale(${zoomLevel})` }}
            >
              <img 
                src={selectedCase.imageUrl} 
                alt={selectedCase.title}
                className="max-h-[380px] w-auto object-contain rounded-lg shadow-xl border border-zinc-800 select-none"
                draggable={false}
              />

              {/* High-Yield Interactive Annotations / Pins */}
              {showAnnotations && selectedCase.id === 'case-002' && (
                <>
                  <div className="absolute top-[35%] left-[45%] -translate-x-1/2 -translate-y-1/2 group/pin">
                    <div className="w-6 h-6 rounded-full bg-rose-500/80 border-2 border-white flex items-center justify-center animate-ping absolute inset-0" />
                    <div className="w-6 h-6 rounded-full bg-rose-600 border-2 border-white flex items-center justify-center shadow-lg cursor-pointer text-[10px] font-black text-white relative z-10">
                      1
                    </div>
                    <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-zinc-900 text-white text-[11px] p-2 rounded-lg shadow-xl border border-rose-500/40 w-44 pointer-events-none opacity-0 group-hover/pin:opacity-100 transition-opacity z-20">
                      <strong className="text-rose-400 block">Orphan Annie Eyes:</strong>
                      Ground-glass optical clearing of nuclei.
                    </div>
                  </div>

                  <div className="absolute top-[65%] left-[60%] -translate-x-1/2 -translate-y-1/2 group/pin2">
                    <div className="w-6 h-6 rounded-full bg-blue-600 border-2 border-white flex items-center justify-center shadow-lg cursor-pointer text-[10px] font-black text-white relative z-10">
                      2
                    </div>
                    <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-zinc-900 text-white text-[11px] p-2 rounded-lg shadow-xl border border-blue-500/40 w-44 pointer-events-none opacity-0 group-hover/pin2:opacity-100 transition-opacity z-20">
                      <strong className="text-blue-400 block">Psammoma Body:</strong>
                      Concentric calcospherite calcification.
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Bottom Caption Pill */}
            <div className="absolute bottom-3 inset-x-3 bg-zinc-950/90 border border-zinc-800 backdrop-blur-md p-2.5 rounded-xl text-xs text-zinc-300">
              <span className="font-bold text-blue-400">Microscopic Finding: </span>
              <span>{selectedCase.imageCaption}</span>
            </div>
          </div>
        </div>

        {/* Right Pane: Structured Clinical Accordion & Management */}
        <div className={`lg:col-span-5 border rounded-2xl p-5 shadow-sm flex flex-col gap-4 transition-colors ${
          isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'
        }`}>
          {/* Navigation Tabs */}
          <div className={`flex items-center gap-1 p-1 rounded-xl border text-[11px] font-bold ${
            isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-zinc-100 border-zinc-200'
          }`}>
            {(['presentation', 'investigations', 'management'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-1.5 rounded-lg capitalize transition-all cursor-pointer ${
                  activeTab === tab 
                    ? isDark ? 'bg-zinc-800 text-white shadow-sm' : 'bg-white text-zinc-900 shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab 1: Presentation & History */}
          {activeTab === 'presentation' && (
            <div className="space-y-3 text-xs animate-in fade-in duration-150">
              <div className={`p-3.5 rounded-xl border space-y-1.5 ${
                isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-zinc-50 border-zinc-200'
              }`}>
                <span className="font-bold text-blue-500 block uppercase tracking-wider text-[10px]">Chief Complaint</span>
                <p className={`leading-relaxed ${isDark ? 'text-zinc-200' : 'text-zinc-800'}`}>{selectedCase.presentingComplaint}</p>
              </div>

              <div className={`p-3.5 rounded-xl border space-y-1.5 ${
                isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-zinc-50 border-zinc-200'
              }`}>
                <span className="font-bold text-zinc-400 block uppercase tracking-wider text-[10px]">Clinical History</span>
                <p className={`leading-relaxed ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>{selectedCase.history}</p>
              </div>

              <div className={`p-3.5 rounded-xl border space-y-1.5 ${
                isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-zinc-50 border-zinc-200'
              }`}>
                <span className="font-bold text-zinc-400 block uppercase tracking-wider text-[10px]">Physical Examination</span>
                <p className={`leading-relaxed ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>{selectedCase.findings}</p>
              </div>
            </div>
          )}

          {/* Tab 2: Investigations & Scans */}
          {activeTab === 'investigations' && (
            <div className="space-y-2.5 text-xs animate-in fade-in duration-150">
              <div className={`p-3 rounded-xl border flex items-center justify-between ${
                isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-zinc-50 border-zinc-200'
              }`}>
                <span className="text-zinc-400">Serum TSH:</span>
                <span className="font-mono font-bold text-blue-500">{selectedCase.investigations.tsh}</span>
              </div>
              <div className={`p-3 rounded-xl border flex items-center justify-between ${
                isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-zinc-50 border-zinc-200'
              }`}>
                <span className="text-zinc-400">Free T4:</span>
                <span className="font-mono font-bold text-blue-500">{selectedCase.investigations.ft4}</span>
              </div>
              <div className={`p-3 rounded-xl border flex items-center justify-between ${
                isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-zinc-50 border-zinc-200'
              }`}>
                <span className="text-zinc-400">24-hr RAIU Scintigraphy:</span>
                <span className="font-mono font-bold text-blue-500">{selectedCase.investigations.raiu}</span>
              </div>
              <div className={`p-3.5 rounded-xl border space-y-1 ${
                isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-zinc-50 border-zinc-200'
              }`}>
                <span className="text-zinc-400 font-bold block text-[10px] uppercase">Ultrasound (USG) Features</span>
                <p className={isDark ? 'text-zinc-200' : 'text-zinc-800'}>{selectedCase.investigations.usg}</p>
              </div>
              {selectedCase.investigations.fnac && (
                <div className={`p-3.5 rounded-xl border space-y-1 ${
                  isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-zinc-50 border-zinc-200'
                }`}>
                  <span className="text-rose-500 font-bold block text-[10px] uppercase">FNAC Cytopathology</span>
                  <p className="text-rose-600 dark:text-rose-300 font-medium">{selectedCase.investigations.fnac}</p>
                </div>
              )}
            </div>
          )}

          {/* Tab 3: Management & Protocols */}
          {activeTab === 'management' && (
            <div className="space-y-3 text-xs animate-in fade-in duration-150">
              <div className={`border p-3.5 rounded-xl ${
                isDark ? 'bg-blue-600/15 border-blue-500/30' : 'bg-blue-50 border-blue-200'
              }`}>
                <span className="text-blue-500 font-bold uppercase tracking-wider text-[10px] block mb-1">Final Confirmed Diagnosis</span>
                <p className={`text-base font-black ${isDark ? 'text-white' : 'text-zinc-900'}`}>{selectedCase.finalDiagnosis}</p>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] uppercase tracking-wider font-bold text-zinc-400 block">Recommended Management Plan:</span>
                {selectedCase.management.map((step, idx) => (
                  <div key={idx} className={`flex items-start gap-2 p-3 rounded-xl border ${
                    isDark ? 'bg-zinc-950 border-zinc-800 text-zinc-200' : 'bg-zinc-50 border-zinc-200 text-zinc-800'
                  }`}>
                    <CheckCircle className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Contributor Profile Footer */}
          <div className={`pt-3 border-t flex items-center justify-between text-xs ${
            isDark ? 'border-zinc-800' : 'border-zinc-200'
          }`}>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs shadow-sm">
                DR
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <span className={`font-bold ${isDark ? 'text-zinc-200' : 'text-zinc-800'}`}>{selectedCase.contributor.name}</span>
                  {selectedCase.contributor.verified && (
                    <span title="Verified Medical Editor">
                      <UserCheck className="w-3.5 h-3.5 text-blue-500" />
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-zinc-400 block">{selectedCase.contributor.hospital}</span>
              </div>
            </div>

            <button 
              onClick={() => handleToggleUpvote(selectedCase.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                hasUpvoted[selectedCase.id]
                  ? 'bg-blue-600 text-white font-bold border-blue-500 shadow-sm'
                  : isDark ? 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white' : 'bg-zinc-100 border-zinc-200 text-zinc-600 hover:text-zinc-900'
              }`}
            >
              <ThumbsUp className="w-3.5 h-3.5" />
              <span className="font-mono text-xs">{upvotes[selectedCase.id] || selectedCase.upvotes}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
