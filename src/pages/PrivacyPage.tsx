import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPage() {
  const { isDark } = useTheme();
  const navigate = useNavigate();

  return (
    <div className={`min-h-screen ${isDark ? 'bg-zinc-950 text-zinc-100' : 'bg-zinc-50 text-zinc-900'}`}>
      <div className="max-w-2xl mx-auto px-6 py-12">
        <button
          onClick={() => navigate('/')}
          className={`flex items-center gap-2 text-sm mb-8 ${isDark ? 'text-zinc-400 hover:text-zinc-200' : 'text-zinc-600 hover:text-zinc-900'}`}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Clinova
        </button>

        <h1 className="text-3xl font-black mb-2 tracking-tight">Privacy Policy</h1>
        <p className={`text-sm mb-8 ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
          Effective date: September 2026 · Clinova (Shivam Gola)
        </p>

        <div className={`prose prose-sm max-w-none ${isDark ? 'prose-invert' : ''} flex flex-col gap-6`}>
          <section>
            <h2 className="text-lg font-bold mb-2">1. Who we are</h2>
            <p className={`text-sm leading-relaxed ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>
              Clinova is an educational platform for medical students preparing for NEET-PG and INI-CET examinations.
              It is operated by Shivam Gola (doc.shivamgola@gmail.com), Prayagraj, Uttar Pradesh, India.
              This platform is not a clinical application and does not provide medical advice.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-2">2. What we collect</h2>
            <p className={`text-sm leading-relaxed ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>
              We collect only what is necessary to provide the service:
            </p>
            <ul className={`text-sm space-y-1 mt-2 pl-4 list-disc ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>
              <li>Email address (for account creation and login)</li>
              <li>Study progress data (which nodes viewed, questions answered, flashcard scores)</li>
              <li>Payment status (whether you are a Patron supporter — no card data is stored by us)</li>
            </ul>
            <p className={`text-sm leading-relaxed mt-2 ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>
              We do not collect health records, ABHA IDs, patient data, or any clinical information about you or your patients.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-2">3. How we use it</h2>
            <ul className={`text-sm space-y-1 pl-4 list-disc ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>
              <li>To operate your account and provide personalised study progress</li>
              <li>To send weekly study digest emails (if you opt in)</li>
              <li>To verify Patron supporter status via Razorpay webhooks</li>
            </ul>
            <p className={`text-sm leading-relaxed mt-2 ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>
              We do not sell your data. We do not share it with third parties except as needed to process payments (Razorpay) or host the application (Supabase, Vercel, Cloudflare).
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-2">4. Data storage &amp; residency</h2>
            <p className={`text-sm leading-relaxed ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>
              Your data is stored on Supabase servers in the Mumbai (ap-south-1) region, within India.
              This satisfies data residency requirements under the Digital Personal Data Protection Act 2023 (DPDP Act).
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-2">5. Your rights (DPDP Act 2023)</h2>
            <p className={`text-sm leading-relaxed ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>
              Under India's Digital Personal Data Protection Act 2023, you have the right to:
            </p>
            <ul className={`text-sm space-y-1 mt-2 pl-4 list-disc ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>
              <li><strong>Access</strong> the personal data we hold about you</li>
              <li><strong>Correction</strong> of inaccurate data</li>
              <li><strong>Erasure</strong> — delete your account and all associated data from Settings → Delete Account</li>
              <li><strong>Grievance redressal</strong> — contact doc.shivamgola@gmail.com</li>
            </ul>
            <p className={`text-sm leading-relaxed mt-2 ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>
              You may exercise any of these rights by emailing doc.shivamgola@gmail.com or using the Settings page in your account.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-2">6. Medical disclaimer</h2>
            <p className={`text-sm leading-relaxed ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>
              All content on Clinova — including organ node videos, wiki articles, PYQ explanations, and clinical atlas cases —
              is for <strong>educational purposes only</strong>. It does not constitute medical advice, diagnosis, or treatment.
              Clinova is not endorsed by the National Medical Commission (NMC), National Board of Examinations (NBE), or any government body.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-2">7. Changes to this policy</h2>
            <p className={`text-sm leading-relaxed ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>
              We will update this page when practices change and notify registered users by email. The effective date at the top reflects the last update.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-2">8. Contact</h2>
            <p className={`text-sm leading-relaxed ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>
              Shivam Gola · Clinova · Prayagraj, UP · India<br />
              doc.shivamgola@gmail.com
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
