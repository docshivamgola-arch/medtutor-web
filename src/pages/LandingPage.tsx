import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

// ── STAT TILE DATA ──
const STATS = [
  { end: 18, suffix: '+', label: 'Organs Mapped', format: undefined as undefined | ((n: number) => string) },
  {
    end: 1200,
    suffix: '+',
    label: 'PYQ Questions',
    format: (n: number) => n >= 1000 ? `${(n / 1000).toFixed(1).replace('.0', '')}K` : String(n),
  },
  { end: 5, suffix: '', label: 'Exam Sources', format: undefined as undefined | ((n: number) => string) },
];

// ── COUNT-UP HOOK ──
function useCountUp(end: number, duration: number, started: boolean): number {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!started) return;
    let startTime: number | null = null;
    let rafId: number;

    const animate = (timestamp: number) => {
      if (startTime === null) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setCount(Math.round(end * progress));
      if (progress < 1) {
        rafId = requestAnimationFrame(animate);
      }
    };

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [end, duration, started]);

  return count;
}

// ── STAT TILE COMPONENT ──
function StatTile({
  end,
  suffix,
  label,
  format,
  started,
  isDark,
  subtext,
}: {
  end: number;
  suffix: string;
  label: string;
  format?: (n: number) => string;
  started: boolean;
  isDark: boolean;
  subtext: string;
}) {
  const count = useCountUp(end, 1200, started);
  const display = format ? format(count) : String(count);

  return (
    <div
      className={`flex flex-col items-center justify-center py-8 px-4 gap-1 ${
        isDark ? 'bg-[#0F1829]' : 'bg-white'
      }`}
    >
      <span className="text-4xl sm:text-5xl font-black tabular-nums tracking-tight bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">
        {display}{suffix}
      </span>
      <span className={`text-xs sm:text-sm font-medium ${subtext}`}>{label}</span>
    </div>
  );
}

const GAP_CARDS = [
  { num: '01', title: 'No cross-organ synthesis', desc: 'Platforms teach thyroid without connecting it to pharma, patho, or surgery.' },
  { num: '02', title: 'No Concept-Linked Wiki', desc: 'No platform cross-links wiki concepts directly to PYQ explanations the Indian way.' },
  { num: '03', title: 'INI-CET underserved', desc: 'AIIMS, PGI, JIPMER pattern questions are treated as an afterthought everywhere.' },
  { num: '04', title: 'No sub-3-min content', desc: 'Lectures run 60–90 min. No modular micro-cuts that fit a break between wards.' },
  { num: '05', title: '3D anatomy siloed', desc: '3D models exist but never connect to histology, physiology, or clinical cases.' },
  { num: '06', title: '₹99/mo has no competitor', desc: 'Coaching costs ₹3–5 lakh. Integrated digital learning at this price does not exist.' },
];

const PATRON_FEATURES = [
  'Flashcard SRS (spaced repetition)',
  'PYQ question bank with explanations',
  'Progress tracking across systems',
  'Clinical cases (coming soon)',
];

export default function LandingPage() {
  const navigate = useNavigate();
  const { isDark } = useTheme();

  const bg = isDark ? 'bg-[#080F1E]' : 'bg-slate-50';
  const text = isDark ? 'text-zinc-100' : 'text-zinc-900';
  const subtext = isDark ? 'text-zinc-400' : 'text-zinc-500';
  const surface = isDark ? 'bg-[#0F1829] border-zinc-800' : 'bg-white border-zinc-200 shadow-sm';
  const cardHover = isDark ? 'hover:border-teal-700/60' : 'hover:border-teal-400';

  // ── STAT ANIMATION STATE ──
  const statSectionRef = useRef<HTMLElement>(null);
  const [statsStarted, setStatsStarted] = useState(false);

  useEffect(() => {
    const el = statSectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setStatsStarted(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className={`min-h-screen ${bg} ${text} font-sans`}>

      {/* ── HERO ── */}
      <section className="max-w-4xl mx-auto px-4 pt-20 pb-16 text-center flex flex-col items-center gap-6">
        {/* Eyebrow */}
        <span className={`text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border ${
          isDark ? 'border-teal-700 text-teal-400 bg-teal-500/10' : 'border-teal-500 text-teal-600 bg-teal-50'
        }`}>
          Built for INI-CET · AIIMS · PGI · JIPMER
        </span>

        {/* Headline */}
        <h1 className={`text-6xl sm:text-7xl font-black leading-tight tracking-tight ${isDark ? 'text-white' : 'text-zinc-900'}`}>
          Study Medicine the
          <br />
          <span className="bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">Way Your Organs Work</span>
        </h1>

        {/* Sub-headline */}
        <p className={`text-base sm:text-lg max-w-2xl leading-relaxed ${subtext}`}>
          Cross-organ synthesis. Every concept connected. The cross-linked learning model for India — at{' '}
          <span className={`font-bold ${isDark ? 'text-zinc-200' : 'text-zinc-700'}`}>₹99/month</span>.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-3 mt-2">
          <button
            onClick={() => navigate('/atlas')}
            className="px-6 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-white font-bold text-sm transition-colors shadow-md"
          >
            Explore 3D Atlas →
          </button>
          <button
            onClick={() => navigate('/node/thyroid')}
            className={`px-6 py-3 rounded-xl border font-bold text-sm transition-colors ${
              isDark
                ? 'border-teal-500 text-teal-400 hover:bg-teal-500/10'
                : 'border-teal-500 text-teal-600 hover:bg-teal-50'
            }`}
          >
            Start with Thyroid →
          </button>
        </div>
      </section>

      {/* ── STAT TILES ── */}
      <section ref={statSectionRef} className="max-w-4xl mx-auto px-4 pb-10">
        <div className={`grid grid-cols-3 divide-x rounded-2xl border overflow-hidden ${
          isDark ? 'border-zinc-800 divide-zinc-800' : 'border-zinc-200 divide-zinc-200'
        }`}>
          {STATS.map(({ end, suffix, label, format }) => (
            <StatTile
              key={label}
              end={end}
              suffix={suffix}
              label={label}
              format={format}
              started={statsStarted}
              isDark={isDark}
              subtext={subtext}
            />
          ))}
        </div>
      </section>

      {/* ── EXAM TRUST BAR ── */}
      <section className="max-w-4xl mx-auto px-4 pb-12">
        <p className={`text-center text-[10px] font-bold uppercase tracking-widest mb-4 ${subtext}`}>
          Covering questions from
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          {['AIIMS', 'PGI', 'JIPMER', 'INI-CET', 'NEET-PG'].map((exam) => (
            <span
              key={exam}
              className={`px-4 py-1.5 rounded-full text-xs font-bold border ${
                isDark
                  ? 'border-zinc-700 text-zinc-300 bg-zinc-800/60'
                  : 'border-zinc-300 text-zinc-600 bg-zinc-100'
              }`}
            >
              {exam}
            </span>
          ))}
        </div>
      </section>

      {/* ── 6 GAP CARDS ── */}
      <section className="max-w-5xl mx-auto px-4 py-14">
        <h2 className={`text-2xl font-black text-center mb-10 ${isDark ? 'text-white' : 'text-zinc-900'}`}>
          Six gaps no Indian platform has solved
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {GAP_CARDS.map((card) => (
            <div
              key={card.num}
              className={`border rounded-xl p-5 flex flex-col gap-2 transition-all duration-150 hover:-translate-y-1 hover:shadow-lg ${isDark ? 'hover:shadow-teal-900/40' : 'hover:shadow-teal-200/60'} ${surface} ${cardHover}`}
            >
              <span className="text-3xl font-black text-teal-400 leading-none">{card.num}</span>
              <h3 className={`font-bold text-sm ${isDark ? 'text-zinc-100' : 'text-zinc-900'}`}>
                {card.title}
              </h3>
              <p className={`text-xs leading-relaxed ${subtext}`}>{card.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 3D ATLAS CALLOUT ── */}
      <section className="max-w-5xl mx-auto px-4 py-6">
        <div className={`border rounded-2xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6 ${
          isDark ? 'bg-teal-950/30 border-teal-700/40' : 'bg-teal-50 border-teal-200'
        }`}>
          <div className="flex flex-col gap-2 text-center sm:text-left">
            <span className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-teal-400' : 'text-teal-600'}`}>
              Free — No login required
            </span>
            <h3 className={`text-xl font-black ${isDark ? 'text-white' : 'text-zinc-900'}`}>
              Free 3D Body Atlas
            </h3>
            <p className={`text-sm ${subtext}`}>
              Explore 24 organ systems. Fully interactive. Always free.
            </p>
          </div>
          <button
            onClick={() => navigate('/atlas')}
            className="shrink-0 px-6 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-white font-bold text-sm transition-colors shadow-md"
          >
            Open Atlas
          </button>
        </div>
      </section>

      {/* ── PATRON PASS PRICING ── */}
      <section className="max-w-md mx-auto px-4 py-14">
        <div className={`border rounded-2xl p-8 flex flex-col gap-5 ${surface}`}>
          {/* Header */}
          <div className="flex items-baseline justify-between flex-wrap gap-2">
            <h3 className={`text-xl font-black ${isDark ? 'text-white' : 'text-zinc-900'}`}>
              Patron Pass
            </h3>
            <span className={`text-2xl font-black text-teal-400 font-mono`}>
              ₹99<span className={`text-sm font-normal ${subtext}`}>/month</span>
            </span>
          </div>

          {/* Features */}
          <ul className="flex flex-col gap-2">
            {PATRON_FEATURES.map((feat) => (
              <li key={feat} className={`flex items-center gap-2 text-sm ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>
                <span className="w-4 h-4 rounded-full bg-teal-500/20 border border-teal-500/40 flex items-center justify-center shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                </span>
                {feat}
              </li>
            ))}
          </ul>

          {/* CTA */}
          <button
            onClick={() => navigate('/signup')}
            className="w-full py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-white font-bold text-sm transition-colors shadow-md mt-1"
          >
            Get Patron Pass
          </button>

          {/* Footnote */}
          <p className={`text-xs text-center leading-relaxed ${subtext}`}>
            Free content stays free. Patron Pass unlocks memory + practice tools.
          </p>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className={`border-t py-8 px-4 ${isDark ? 'border-zinc-800' : 'border-zinc-200'}`}>
        <div className={`max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs ${subtext}`}>
          <span className="font-semibold">
            Clinova · For NEET-PG and INI-CET
          </span>
          <div className="flex items-center gap-4">
            <a
              href="mailto:doc.shivamgola@gmail.com"
              className="hover:underline hover:text-teal-400 transition-colors duration-150"
            >
              doc.shivamgola@gmail.com
            </a>
            <button
              onClick={() => navigate('/privacy')}
              className="hover:underline hover:text-teal-400 transition-colors duration-150"
            >
              Privacy
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
}
