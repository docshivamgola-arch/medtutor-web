import { useState, useEffect } from 'react';

export function IntroOverlay() {
  const [phase, setPhase] = useState<'in' | 'out' | 'done'>('in');

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('out'), 2000);
    const t2 = setTimeout(() => setPhase('done'), 2400);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  if (phase === 'done') return null;

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'var(--surface)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexDirection: 'column', gap: '16px',
        transition: 'opacity .4s ease, transform .4s ease',
        opacity: phase === 'out' ? 0 : 1,
        transform: phase === 'out' ? 'scale(.98)' : 'scale(1)',
        pointerEvents: phase === 'out' ? 'none' : 'auto',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <svg width="48" height="48" viewBox="0 0 32 32" fill="none" aria-hidden="true">
          <path d="M22 8A10 10 0 1 0 22 24" stroke="#123F63" strokeWidth="3" strokeLinecap="round"/>
          <path d="M15 16 L22 16" stroke="#36C7B7" strokeWidth="2.5" strokeLinecap="round"/>
          <path d="M19 13 L22 16 L19 19" stroke="#36C7B7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span style={{ fontSize: '36px', fontWeight: 800, color: 'var(--navy)', letterSpacing: '-1px' }}>
          Clin<em style={{ color: 'var(--teal)', fontStyle: 'normal' }}>ova</em>
        </span>
      </div>
      <div style={{ fontSize: '14px', color: 'var(--muted)', letterSpacing: '.5px' }}>
        Medical Knowledge, System by System
      </div>
      <div style={{ width: '120px', height: '3px', borderRadius: '2px', background: 'var(--elevated)', overflow: 'hidden' }}>
        <div style={{
          height: '100%', width: '0%', background: 'var(--teal)',
          animation: 'clv-bar-grow 2s ease forwards',
        }} />
      </div>
    </div>
  );
}
