import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface Cinematic3DBodyPortalProps {
  onEnterSystemOrgan: (systemId: string, organId: string) => void;
  onClose?: () => void;
}

/**
 * Cinematic3DBodyPortal — embeds the full Human Anatomy 3D atlas
 * (public/atlas/index.html) as an iframe so every feature built in
 * the standalone viewer (24 GLBs, hand/foot, skin/fascia, all layer
 * toggles, X-ray opacity slider, sub-mesh controls) is available
 * inside the Clinova app without re-implementing the viewer.
 */
export const Cinematic3DBodyPortal: React.FC<Cinematic3DBodyPortalProps> = ({
  onEnterSystemOrgan,
  onClose
}) => {
  const { isDark } = useTheme();
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      className={`relative w-full h-[calc(100vh-57px)] overflow-hidden select-none ${
        isDark ? 'bg-zinc-950' : 'bg-slate-100'
      }`}
    >
      {/* Loading shimmer while iframe bootstraps */}
      {!loaded && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-zinc-950">
          <div className="w-12 h-12 rounded-full border-2 border-teal-400 border-t-transparent animate-spin" />
          <p className="text-xs font-mono text-zinc-400 tracking-widest uppercase">
            Loading Full Anatomy Atlas…
          </p>
        </div>
      )}

      {/* Full atlas iframe — serves all 24 GLBs from public/atlas/ */}
      <iframe
        src="/atlas/index.html"
        title="Human Anatomy 3D Atlas"
        className="w-full h-full border-0"
        style={{ display: 'block' }}
        onLoad={() => setLoaded(true)}
        allow="fullscreen"
      />

      {/* Close / back to Dashboard button overlay */}
      {onClose && (
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 z-20 flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer shadow-lg ${
            isDark
              ? 'bg-zinc-900/90 hover:bg-zinc-800 text-zinc-300 border-zinc-700'
              : 'bg-white/90 hover:bg-zinc-100 text-zinc-800 border-zinc-300'
          }`}
        >
          <X className="w-3.5 h-3.5" />
          <span>Direct Dashboard</span>
        </button>
      )}
    </div>
  );
};

export default Cinematic3DBodyPortal;
