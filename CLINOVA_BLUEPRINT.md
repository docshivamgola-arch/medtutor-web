# Clinova Product Blueprint
> Version 1.0 · September 2026 · Solo operator: Shivam Gola
> Artifact (interactive): https://claude.ai/code/artifact/2e3b03de-2fe3-4b22-9782-c05f9b2a6bec

---

## Executive Summary

**Positioning:** INI-CET first, not NEET-PG volume. INI-CET rewards synthesis; NEET-PG volume is Marrow's fortress.
**Moat:** PYQ ↔ Wiki cross-link (Amboss model for India). Cannot be retrofitted by competitors.
**Hook:** 3D atlas, free, no login required (Kenhub model).
**Price:** ₹99/mo Patron Pass — zero competitor at this price point.

### 6 Gaps Nobody Has Solved
1. No cross-organ synthesis — every Indian platform is subject-silo
2. No Indian Amboss — hyperlinked wiki ↔ QBank doesn't exist in India
3. INI-CET underserved — every competitor optimises for NEET-PG MCQ volume
4. No sub-3-minute modular content — DocTutorials is at 10–15 min
5. 3D anatomy siloed — Cerebellum has 3D but zero connection to video/PYQ/wiki
6. ₹99/month has no competitor — Marrow is ₹8K–33K/yr

### Locked Decisions
| Decision | Choice | Reason |
|---|---|---|
| Payments | Razorpay | ₹1.98 vs ₹25 per ₹99 charge; native UPI |
| Auth | Supabase Auth | Already in project; free to 50K MAU |
| GLB Hosting | Cloudflare R2 | Zero egress; 10 GB free covers all 24 GLBs |
| Mobile | PWA (vite-plugin-pwa) | Avoids Play Store 30% cut on ₹99 |

---

## Competitive Landscape

| Platform | Price | Critical Weakness | Threat |
|---|---|---|---|
| Marrow | ₹8K–33K/yr | Subject-silo, no synthesis | HIGH |
| PrepLadder | ₹9K–30K/yr | Version XI explicitly calls out system-wise gap | HIGH |
| DocTutorials | ₹3K–8K/yr | No synthesis, app crashes | Medium |
| Cerebellum | ₹5K–12K/yr | 3D is a toy — not connected to content | Medium |
| Osmosis | $35–99/mo | Not India-focused | North Star UX |
| Amboss | $20–50/mo | USMLE only | Copy architecture |
| Kenhub | €9–19/mo | Anatomy only | Copy atlas model |

---

## Product Architecture — 4 Rooms

| Room | Name | Auth | Sprint |
|---|---|---|---|
| 1 | Video Node Dashboard | Public (progress = login) | S0 |
| 2 | SM-2 SRS Flashcards | Login | S2 |
| 3 | PYQ + Question Bank | Login | S2 |
| 4 | Clinical Atlas (Cases) | Login | S3 |

### Route Map (23 Routes)
| Route | Component | Auth | Sprint |
|---|---|---|---|
| `/` | Landing page | Public | S1 |
| `/atlas` | 3D Body Explorer | **Public — no login** | S0 |
| `/node/:nodeId` | Organ node dashboard | Public (progress = login) | S1 |
| `/node/:nodeId/video/:cutId` | Video player + wiki sidebar | Public | S1 |
| `/node/:nodeId/wiki` | Organ wiki | Public | S1 |
| `/node/:nodeId/flashcards` | SRS deck | Login | S2 |
| `/node/:nodeId/questions` | PYQ bank | Login | S2 |
| `/flashcards` | All-organ due-today queue | Login | S2 |
| `/practice` | Custom test builder | Login | S3 |
| `/practice/timed` | Timed exam simulation | Login | S3 |
| `/cases` | Clinical atlas browser | Login | S3 |
| `/cases/:caseId` | Case + differential AI | Login | S3 |
| `/progress` | Study dashboard | Login | S3 |
| `/leaderboard` | Week/month/all-time | Login | S4 |
| `/patron` | Razorpay checkout | Login | S4 |
| `/login` | Supabase Auth UI | Public | S0 ✓ |
| `/signup` | Registration + consent | Public | S0 ✓ |
| `/settings` | Profile + data erasure | Login | S0 |
| `/privacy` | Privacy Policy | Public | S0 ✓ |

### Database Schema (6 Tables)
```sql
-- Supabase (Mumbai ap-south-1) — RLS must be enabled on ALL tables
users        id | email | display_name | is_patron | created_at
nodes        id | slug | title | system | description | cut_count
cuts         id | node_id | title | video_url | duration_s | wiki_slug
questions    id | node_id | body | options | answer | explanation | year | source | wiki_slug
srs_cards    id | user_id | question_id | ef | interval | due_at | reps
progress     id | user_id | node_id | cuts_watched | questions_done | streak_days
```
> `wiki_slug` on both `cuts` and `questions` is the cross-link moat.

---

## Design System

**Palette (dark-first — medical-grade, not standard SaaS):**
| Token | Dark | Light |
|---|---|---|
| Background | `#080F1E` | `#F1F5FB` |
| Surface | `#0F1829` | `#FFFFFF` |
| Accent (Clinova Teal) | `#2BB8A8` | `#1F9A8C` |
| Amber (warning) | `#F59E0B` | `#D97706` |
| Green (correct) | `#34D399` | `#059669` |
| Rose (wrong) | `#F87171` | `#EF4444` |

**Typography:**
- Display/Headings: `Plus Jakarta Sans` 500–800 (Google Fonts)
- Body/UI: `Inter` 400–600
- Code/Mono: `JetBrains Mono` 400–500

---

## Infrastructure & Stack

| Layer | Tool | Status |
|---|---|---|
| Frontend | React + Vite | ✓ Live |
| Router | React Router v6 | ✓ S0 done |
| Styling | Tailwind CSS | ✓ Live |
| Animation | Framer Motion | S1 |
| Database | Supabase Mumbai (ap-south-1) | ✓ Provisioned |
| Auth | Supabase Auth | ✓ S0 done |
| GLB Storage | Cloudflare R2 | ⚠ Migrate before launch |
| Payments | Razorpay Subscriptions | S4 |
| Deploy | Vercel (auto-deploy from main) | ✓ Live |
| PWA | vite-plugin-pwa | S4 |
| 3D | Three.js (iframe in /public/atlas/) | ✓ Live (24 GLBs) |
| SRS | SM-2 pure function | S2 |
| Analytics | Vercel Analytics (zero-cookie) | S1 |

### Cloudflare R2 Migration (before launch)
1. Create bucket `clinova-atlas` → enable public access
2. Upload all 24 GLBs
3. Note endpoint: `https://pub-xxx.r2.dev/`
4. Update `ANATOMY_DATABASE` model paths in `viewer.js`
5. Remove GLBs from `public/atlas/` in git

### Environment Variables (Vercel project settings — never commit)
```
VITE_SUPABASE_URL=https://djgxapyoalcghfinbzdy.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_...
VITE_RAZORPAY_KEY_ID=rzp_live_xxx        # client-side (publishable)
RAZORPAY_KEY_SECRET=xxx                  # Edge Function only — never client
```

---

## Security & Legal

### Pre-Launch Blockers (non-negotiable)
- [ ] Enable RLS on **all** Supabase tables (off by default)
- [ ] service_role key only in Edge Functions, never client-side
- [ ] Razorpay webhook: HMAC-SHA256 signature verification before trusting
- [ ] CSP + security headers in `vercel.json` ✓ (X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy)
- [ ] No secrets in git history (`git-secrets` or Gitleaks scan before making repo public)

### DPDP Act 2023 (India — mandatory before User #1)
- Consent notice before any data collection (no pre-ticked boxes)
- Privacy Policy live at `/privacy` ✓
- Delete-account flow in `/settings` (remove all Supabase rows for user)
- Age confirmation 18+ on signup
- Data minimisation: only email + study progress, nothing else

### Medical Disclaimer
> "All content on Clinova is for educational purposes only. It does not constitute medical advice, diagnosis, or treatment. Clinova is not endorsed by NMC, NBE, or any government body."

### GST
- No registration until ~₹20L/year (~1,683 subscribers at ₹99/mo)
- Track revenue from month 1. Razorpay GST invoicing built-in.

---

## Sprint Roadmap

### S0 — Foundation (✓ In progress)
- [x] React Router v6 — replace state flags with URL routing
- [x] Supabase Auth — `/login`, `/signup` pages
- [x] Privacy Policy at `/privacy`
- [x] `vercel.json` security headers
- [ ] Enable RLS on Supabase tables (no tables yet — do when schema created)
- [ ] `/settings` page with delete-account
- [ ] DPDP consent checkbox on signup

### S1 — Soft Launch (~2 weeks)
- Landing page (INI-CET positioning, 3D atlas CTA no-login, Patron Pass mention)
- Parameterise node: `/node/:nodeId` loads JSON per organ — Thyroid + Liver (Node 02)
- Video player with wiki sidebar
- Node wiki: `/node/:nodeId/wiki`
- Cloudflare R2 migration (24 GLBs out of git)
- Framer Motion page transitions
- **Soft launch: 50–100 trusted users**

### S2 — Retention (~2 weeks)
- SM-2 SRS: client-side pure function + one Supabase upsert per answer
- PYQ question bank with `wiki_slug` cross-links (the moat)
- `/flashcards` all-organ due-today queue
- `/node/:nodeId/questions` per-organ PYQ

### S3 — Progress (~2 weeks)
- Progress dashboard
- Timed exam simulation
- Room 4: Clinical Atlas (cases browser + differential AI)
- Leaderboard

### S4 — Revenue (~1 week)
- Razorpay subscriptions (₹99/mo, ₹799/yr)
- Patron webhook Edge Function (HMAC-SHA256 verified)
- PWA (vite-plugin-pwa) — add to homescreen, offline SRS
- Email digest (weekly study summary)

---

## File Locations
- App: `C:\Users\shiva\.gemini\antigravity\scratch\medtutor-web\`
- GitHub: `docshivamgola-arch/medtutor-web` (main branch → auto-deploys to Vercel)
- Supabase: `djgxapyoalcghfinbzdy` (Mumbai ap-south-1)
- Dev server: `http://localhost:5173` (`npm run dev`)
- Interactive blueprint artifact: https://claude.ai/code/artifact/2e3b03de-2fe3-4b22-9782-c05f9b2a6bec
