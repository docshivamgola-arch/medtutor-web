import { useRef, useEffect, useState } from 'react';

const SYSTEMS = [
  { group: 'Neurosciences', items: [
    { id: 'cns', label: 'CNS & Brain', zone: 'head' },
    { id: 'psych', label: 'Psychiatry', zone: 'head' },
  ]},
  { group: 'Special Senses', items: [
    { id: 'ophtho', label: 'Ophthalmology', zone: 'head' },
    { id: 'ent', label: 'ENT', zone: 'head' },
  ]},
  { group: 'Cardiorespiratory', items: [
    { id: 'cvs', label: 'Cardiovascular', zone: 'chest' },
    { id: 'resp', label: 'Respiratory', zone: 'chest' },
    { id: 'heme', label: 'Hematology', zone: 'chest' },
  ]},
  { group: 'Abdomen & Pelvis', items: [
    { id: 'gi', label: 'Gastroenterology', zone: 'abdomen' },
    { id: 'renal', label: 'Renal', zone: 'abdomen' },
    { id: 'endo', label: 'Endocrinology', zone: 'abdomen' },
    { id: 'repro', label: 'Reproductive / OBGYN', zone: 'abdomen' },
  ]},
  { group: 'Musculoskeletal & Skin', items: [
    { id: 'ortho', label: 'Orthopaedics', zone: 'limbs' },
    { id: 'rheum', label: 'Rheumatology', zone: 'limbs' },
    { id: 'derm', label: 'Dermatology', zone: 'limbs' },
  ]},
  { group: 'General / Integrated', items: [
    { id: 'surg', label: 'General Surgery', zone: 'abdomen' },
    { id: 'paeds', label: 'Pediatrics', zone: 'abdomen' },
    { id: 'psm', label: 'Preventive Medicine', zone: 'abdomen' },
    { id: 'em', label: 'Emergency Medicine', zone: 'chest' },
  ]},
];

const ZONE_TO_SYSTEM: Record<string, string> = {
  chest: 'Cardiovascular',
  head: 'CNS & Brain',
  abdomen: 'Endocrinology',
  limbs: 'Orthopaedics',
};

interface Props {
  onEnterDashboard: (system: string) => void;
}

export function BodyNavigatorHome({ onEnterDashboard }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const activeZoneRef = useRef('chest');
  const hoverZoneRef = useRef<string | null>(null);
  const rafRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);

  const [activeSystem, setActiveSystem] = useState('Endocrinology → The Thyroid Gland');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const CX = 130;

    function zoneStyle(zone: string) {
      const isActive = activeZoneRef.current === zone;
      const isHover = hoverZoneRef.current === zone;
      return {
        fill: isActive
          ? `rgba(54,199,183,${.22 + Math.abs(Math.sin(Date.now() * .002)) * .08})`
          : isHover ? 'rgba(54,199,183,.12)' : 'rgba(184,212,234,.18)',
        stroke: isActive ? '#2BA898' : isHover ? '#36C7B7' : '#94B3CB',
        sw: isActive ? 2 : 1.5,
      };
    }

    function drawFrame(ts: number) {
      if (!startTimeRef.current) startTimeRef.current = ts;
      const elapsed = (ts - startTimeRef.current) / 1000;
      const bf = Math.sin(elapsed * .9) * 2.5;
      ctx!.clearRect(0, 0, 260, 490);

      // Head & neck
      const hs = zoneStyle('head');
      ctx!.beginPath();
      ctx!.ellipse(CX, 46, 27, 31, 0, 0, Math.PI * 2);
      ctx!.fillStyle = hs.fill; ctx!.fill();
      ctx!.strokeStyle = hs.stroke; ctx!.lineWidth = hs.sw; ctx!.stroke();
      ctx!.beginPath();
      ctx!.moveTo(CX - 12, 77); ctx!.lineTo(CX + 12, 77);
      ctx!.lineTo(CX + 10, 93); ctx!.lineTo(CX - 10, 93);
      ctx!.closePath();
      ctx!.fillStyle = hs.fill; ctx!.fill();
      ctx!.strokeStyle = hs.stroke; ctx!.lineWidth = hs.sw; ctx!.stroke();

      // Chest
      const bx = bf * 1.2;
      const cs = zoneStyle('chest');
      ctx!.beginPath();
      ctx!.moveTo(CX - 47, 95);
      ctx!.bezierCurveTo(CX - 60 + bx, 100, CX - 62 + bx, 130, CX - 57 + bx, 200);
      ctx!.lineTo(CX + 57 - bx, 200);
      ctx!.bezierCurveTo(CX + 62 - bx, 130, CX + 60 - bx, 100, CX + 47, 95);
      ctx!.closePath();
      ctx!.fillStyle = cs.fill; ctx!.fill();
      ctx!.strokeStyle = cs.stroke; ctx!.lineWidth = cs.sw; ctx!.stroke();
      if (activeZoneRef.current === 'chest' || hoverZoneRef.current === 'chest') {
        const pulse = Math.sin(elapsed * 3.5) * .5 + .5;
        ctx!.beginPath();
        ctx!.moveTo(CX - 20, 155); ctx!.lineTo(CX - 12, 155);
        ctx!.lineTo(CX - 8, 145); ctx!.lineTo(CX - 4, 165);
        ctx!.lineTo(CX, 140); ctx!.lineTo(CX + 4, 170);
        ctx!.lineTo(CX + 8, 155); ctx!.lineTo(CX + 20, 155);
        ctx!.strokeStyle = `rgba(54,199,183,${.4 + pulse * .5})`; ctx!.lineWidth = 1.5; ctx!.stroke();
      }
      ctx!.beginPath(); ctx!.moveTo(CX - 48, 95); ctx!.bezierCurveTo(CX - 30, 88, CX - 12, 87, CX, 88);
      ctx!.strokeStyle = cs.stroke; ctx!.lineWidth = .8; ctx!.stroke();
      ctx!.beginPath(); ctx!.moveTo(CX + 48, 95); ctx!.bezierCurveTo(CX + 30, 88, CX + 12, 87, CX, 88); ctx!.stroke();

      // Abdomen
      const bxa = bf * .7;
      const as2 = zoneStyle('abdomen');
      ctx!.beginPath();
      ctx!.moveTo(CX - 57 + bf, 200);
      ctx!.bezierCurveTo(CX - 60 + bxa, 220, CX - 56 + bxa, 250, CX - 50, 278);
      ctx!.lineTo(CX + 50, 278);
      ctx!.bezierCurveTo(CX + 56 - bxa, 250, CX + 60 - bxa, 220, CX + 57 - bf, 200);
      ctx!.closePath();
      ctx!.fillStyle = as2.fill; ctx!.fill();
      ctx!.strokeStyle = as2.stroke; ctx!.lineWidth = as2.sw; ctx!.stroke();

      // Limbs
      const ls = zoneStyle('limbs');
      const limbPairs = [
        // left arm
        [[CX-48,100],[CX-72,110,CX-78,160,CX-72,215],[CX-70,240,CX-68,270,CX-68,285],[CX-60,285],[CX-60,270,CX-62,240,CX-64,215],[CX-70,160,CX-64,110,CX-42,100]],
        // right arm
        [[CX+48,100],[CX+72,110,CX+78,160,CX+72,215],[CX+70,240,CX+68,270,CX+68,285],[CX+60,285],[CX+60,270,CX+62,240,CX+64,215],[CX+70,160,CX+64,110,CX+42,100]],
        // left leg
        [[CX-48,278],[CX-52,310,CX-54,360,CX-52,400],[CX-51,430,CX-50,455,CX-48,475],[CX-36,475],[CX-34,455,CX-33,430,CX-34,400],[CX-36,360,CX-38,310,CX-38,278]],
        // right leg
        [[CX+48,278],[CX+52,310,CX+54,360,CX+52,400],[CX+51,430,CX+50,455,CX+48,475],[CX+36,475],[CX+34,455,CX+33,430,CX+34,400],[CX+36,360,CX+38,310,CX+38,278]],
      ];
      limbPairs.forEach(pts => {
        ctx!.beginPath();
        ctx!.moveTo((pts[0] as number[])[0], (pts[0] as number[])[1]);
        ctx!.bezierCurveTo(...(pts[1] as number[]) as [number,number,number,number,number,number]);
        ctx!.bezierCurveTo(...(pts[2] as number[]) as [number,number,number,number,number,number]);
        ctx!.lineTo((pts[3] as number[])[0], (pts[3] as number[])[1]);
        ctx!.bezierCurveTo(...(pts[4] as number[]) as [number,number,number,number,number,number]);
        ctx!.bezierCurveTo(...(pts[5] as number[]) as [number,number,number,number,number,number]);
        ctx!.closePath();
        ctx!.fillStyle = ls.fill; ctx!.fill();
        ctx!.strokeStyle = ls.stroke; ctx!.lineWidth = ls.sw; ctx!.stroke();
      });

      rafRef.current = requestAnimationFrame(drawFrame);
    }

    rafRef.current = requestAnimationFrame(drawFrame);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  function hitZone(x: number, y: number): string | null {
    const CX = 130;
    const dx = x - CX, dy = y - 46;
    if ((dx * dx) / (27 * 27) + (dy * dy) / (31 * 31) < 1) return 'head';
    if (x < CX - 38 && x > CX - 82 && y > 93 && y < 290) return 'limbs';
    if (x > CX + 38 && x < CX + 82 && y > 93 && y < 290) return 'limbs';
    if (x > CX - 56 && x < CX + 56 && y > 93 && y < 200) return 'chest';
    if (x > CX - 58 && x < CX + 58 && y > 200 && y < 280) return 'abdomen';
    if (x > CX - 56 && x < CX + 56 && y > 277 && y < 480) return 'limbs';
    return null;
  }

  function getCanvasCoords(e: React.MouseEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current!;
    const r = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - r.left) * (canvas.width / r.width),
      y: (e.clientY - r.top) * (canvas.height / r.height),
    };
  }

  function handleCanvasClick(e: React.MouseEvent<HTMLCanvasElement>) {
    const { x, y } = getCanvasCoords(e);
    const z = hitZone(x, y);
    if (!z) return;
    activeZoneRef.current = z;
    const sys = ZONE_TO_SYSTEM[z];
    setActiveSystem(sys + ' ↗');
    onEnterDashboard(sys);
  }

  function handleCanvasMouseMove(e: React.MouseEvent<HTMLCanvasElement>) {
    const { x, y } = getCanvasCoords(e);
    const z = hitZone(x, y);
    hoverZoneRef.current = z;
    if (canvasRef.current) canvasRef.current.style.cursor = z ? 'pointer' : 'default';
  }

  function handleSystemClick(label: string, zone: string) {
    activeZoneRef.current = zone;
    setActiveSystem(label + ' ↗ Open Dashboard');
    onEnterDashboard(label);
  }

  return (
    <div className="flex-1 overflow-y-auto" style={{ background: 'var(--mist)' }}>

      {/* ── Hero triptych ── */}
      <section style={{
        display: 'grid', gridTemplateColumns: '1fr 300px 1fr',
        gap: '32px', maxWidth: '1200px', margin: '0 auto',
        padding: '56px 32px 40px', alignItems: 'start',
      }}>

        {/* LEFT: System rail */}
        <div style={{ paddingTop: '24px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {SYSTEMS.map(group => (
              <div key={group.group} style={{ marginBottom: '4px' }}>
                <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '.8px', textTransform: 'uppercase', color: 'var(--light)', padding: '8px 10px 4px' }}>
                  {group.group}
                </div>
                {group.items.map(item => {
                  const isActive = activeSystem.startsWith(item.label);
                  return (
                    <div
                      key={item.id}
                      onClick={() => handleSystemClick(item.label, item.zone)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '10px',
                        padding: '8px 12px', borderRadius: '8px',
                        fontSize: '13px', fontWeight: isActive ? 600 : 500,
                        color: isActive ? 'var(--teal)' : 'var(--muted)',
                        background: isActive ? 'var(--teal-light)' : 'transparent',
                        border: `1px solid ${isActive ? 'rgba(54,199,183,.3)' : 'transparent'}`,
                        cursor: 'pointer', transition: 'all .12s',
                      }}
                      onMouseEnter={e => { if (!isActive) { const el = e.currentTarget as HTMLDivElement; el.style.background = 'var(--teal-light)'; el.style.color = 'var(--teal-mid)'; } }}
                      onMouseLeave={e => { if (!isActive) { const el = e.currentTarget as HTMLDivElement; el.style.background = 'transparent'; el.style.color = 'var(--muted)'; } }}
                    >
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: isActive ? 'var(--teal)' : 'var(--border)', flexShrink: 0 }} />
                      {item.label}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* CENTER: Animated canvas body */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <canvas
            ref={canvasRef}
            width={260}
            height={490}
            onClick={handleCanvasClick}
            onMouseMove={handleCanvasMouseMove}
            onMouseLeave={() => { hoverZoneRef.current = null; }}
            style={{ borderRadius: '12px', maxWidth: '100%' }}
            aria-label="Interactive anatomical body navigator — click a region to open its study dashboard"
          />
          <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--teal)', minHeight: '20px', textAlign: 'center' }}>
            {activeSystem}
          </div>
          <p style={{ fontSize: '12px', color: 'var(--muted)', textAlign: 'center' }}>
            Click a body region or system to open the study dashboard
          </p>
        </div>

        {/* RIGHT: Command panel */}
        <div style={{ paddingTop: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Resume card */}
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border-soft)', borderRadius: 'var(--radius-lg)', padding: '18px 20px', boxShadow: 'var(--shadow)' }}>
            <h3 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--navy)', marginBottom: '12px' }}>Resume Study</h3>
            <div style={{ background: 'var(--elevated)', borderRadius: '8px', padding: '12px 14px' }}>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)' }}>Endocrine → The Thyroid Gland</div>
              <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '2px' }}>Visual Cinema · Cut 1 of 20 · In progress</div>
              <div style={{ marginTop: '10px', height: '4px', borderRadius: '2px', background: 'var(--border)' }}>
                <div style={{ width: '5%', height: '100%', background: 'var(--teal)', borderRadius: '2px' }} />
              </div>
            </div>
            <button
              onClick={() => onEnterDashboard('Endocrine')}
              style={{ width: '100%', marginTop: '12px', padding: '10px', borderRadius: '8px', background: 'var(--teal)', color: '#fff', fontSize: '13.5px', fontWeight: 600, border: 'none', cursor: 'pointer', transition: 'background .15s' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--teal-mid)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'var(--teal)')}
            >
              Continue →
            </button>
          </div>

          {/* Trending Topics */}
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border-soft)', borderRadius: 'var(--radius-lg)', padding: '18px 20px', boxShadow: 'var(--shadow)' }}>
            <h3 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--navy)', marginBottom: '12px' }}>Trending Topics</h3>
            <div>
              {['Thyroid Disorders', 'Liver & Jaundice', 'IHD & ACS', 'Renal Failure', 'Stroke', 'IBD'].map((tag, i) => (
                <span key={tag} style={{
                  display: 'inline-flex', alignItems: 'center',
                  padding: '5px 12px', borderRadius: '100px',
                  fontSize: '12px', fontWeight: 600, margin: '3px 2px',
                  background: i < 2 ? 'var(--teal-light)' : 'var(--elevated)',
                  color: i < 2 ? 'var(--teal-mid)' : 'var(--muted)',
                  cursor: 'pointer',
                }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border-soft)', borderRadius: 'var(--radius-lg)', padding: '18px 20px', boxShadow: 'var(--shadow)' }}>
            <h3 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--navy)', marginBottom: '12px' }}>Today's Stats</h3>
            <div style={{ display: 'flex', gap: '12px' }}>
              {[['0', 'MCQs done'], ['0', 'min studied'], ['1', 'day streak']].map(([num, lbl]) => (
                <div key={lbl} style={{ flex: 1, textAlign: 'center', padding: '12px 8px', background: 'var(--elevated)', borderRadius: '8px' }}>
                  <div style={{ fontSize: '22px', fontWeight: 700, color: 'var(--navy)' }}>{num}</div>
                  <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '2px' }}>{lbl}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Pillars ── */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 32px 64px', display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '20px' }}>
        {[
          {
            title: 'Learn by System',
            desc: 'Modular video cuts organised by system, with timestamped transcripts, a 7-subject knowledge matrix, and NEET PG-style clinical vignettes for every topic.',
            tag: 'Videos · Notes · MCQs',
            icon: (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--teal)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
              </svg>
            ),
          },
          {
            title: 'Clinical Atlas',
            desc: 'Curated imaging, histopathology, and ECG cases with structured teaching points. Each image is reviewed for educational accuracy before publication.',
            tag: 'Imaging · Histopath · ECG',
            icon: (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--teal)" strokeWidth="2" strokeLinecap="round">
                <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
              </svg>
            ),
          },
          {
            title: 'Doctor Cases',
            desc: 'De-identified educational cases submitted through a structured editorial pipeline — CARE checklist, consent, and de-identification before a Clinova Reviewed mark is assigned.',
            tag: 'Editorial · CARE · De-identified',
            icon: (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--teal)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            ),
          },
        ].map(p => (
          <div key={p.title} style={{ background: 'var(--surface)', border: '1px solid var(--border-soft)', borderRadius: 'var(--radius-lg)', padding: '28px 24px', boxShadow: 'var(--shadow)' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'var(--teal-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              {p.icon}
            </div>
            <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--navy)', marginBottom: '8px' }}>{p.title}</h3>
            <p style={{ fontSize: '13.5px', color: 'var(--muted)', lineHeight: 1.6 }}>{p.desc}</p>
            <span style={{ display: 'inline-block', marginTop: '14px', fontSize: '11.5px', fontWeight: 600, color: 'var(--teal-mid)', background: 'var(--teal-light)', padding: '4px 10px', borderRadius: '100px' }}>
              {p.tag}
            </span>
          </div>
        ))}
      </section>

      {/* ── Doctor community pipeline ── */}
      <section style={{ background: 'var(--surface)', borderTop: '1px solid var(--border-soft)', borderBottom: '1px solid var(--border-soft)', padding: '56px 32px' }}>
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--teal-mid)', marginBottom: '10px' }}>Doctor Community</div>
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--navy)', marginBottom: '10px' }}>From Bedside to Clinova</h2>
          <p style={{ fontSize: '15px', color: 'var(--muted)', maxWidth: '560px', marginBottom: '36px' }}>Every case goes through a five-step editorial pipeline. Publishing access is earned through quality — not purchased.</p>
          <div style={{ display: 'flex', gap: '0', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '22px', left: '22px', right: '22px', height: '2px', background: 'var(--border)' }} />
            {[
              { n: '1', h: 'Submit', p: 'Structured form with CARE checklist and consent declaration', done: true },
              { n: '2', h: 'De-identify', p: 'All identifying details removed by the author and verified by Clinova', done: true },
              { n: '3', h: 'Editorial Review', p: 'Clinical accuracy check by Clinova editorial team', done: false },
              { n: '4', h: 'Author Approval', p: 'Final sign-off before publication. Author retains attribution.', done: false },
              { n: '5', h: 'Clinova Reviewed', p: 'Published as an educational case with Case ID and attribution', done: false },
            ].map(step => (
              <div key={step.n} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '10px', position: 'relative', zIndex: 1 }}>
                <div style={{
                  width: '44px', height: '44px', borderRadius: '50%',
                  background: step.done ? 'var(--teal-light)' : 'var(--surface)',
                  border: `2px solid ${step.done ? 'var(--teal)' : 'var(--border)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '16px', fontWeight: 700,
                  color: step.done ? 'var(--teal)' : 'var(--muted)',
                }}>
                  {step.n}
                </div>
                <h4 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)' }}>{step.h}</h4>
                <p style={{ fontSize: '12px', color: 'var(--muted)', lineHeight: 1.5 }}>{step.p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
