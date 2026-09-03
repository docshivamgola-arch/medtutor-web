export interface ChapterCut {
  id: string;
  cutNumber: number;
  timecode: string;
  durationSec: number;
  title: string;
  subject: 'Anatomy' | 'Physiology' | 'Biochemistry' | 'Pathology' | 'Pharmacology' | 'Medicine' | 'Surgery' | 'Radiology' | 'PYQ';
  subjectColor: string;
  visualSummary: string;
  coreConcept: string;
  highYieldBullets: string[];
  mnemonic?: string;
  neetQuote?: string;
}

export interface WikiSection {
  id: string;
  title: string;
  subject: string;
  color: string;
  iconName: string;
  contentMarkdown: string;
  tables?: {
    headers: string[];
    rows: string[][];
  }[];
  highYieldBoxes: {
    title: string;
    text: string;
    tag: string;
  }[];
}

export interface PYQQuestion {
  id: string;
  exam: string;
  year: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  buzzword: string;
  subjectTag: string;
}

export interface ClinicalCase {
  id: string;
  title: string;
  ageGender: string;
  presentingComplaint: string;
  history: string;
  findings: string;
  investigations: {
    tsh: string;
    ft4: string;
    raiu: string;
    usg: string;
    fnac?: string;
  };
  finalDiagnosis: string;
  management: string[];
  imageUrl: string;
  imageCaption: string;
  contributor: {
    name: string;
    role: string;
    hospital: string;
    verified: boolean;
  };
  upvotes: number;
}

export const THYROID_CUTS: ChapterCut[] = [
  {
    id: 'cut-001',
    cutNumber: 1,
    timecode: '00:00 - 00:45',
    durationSec: 45,
    title: 'Hook & 19-Subject Systemic Map',
    subject: 'Anatomy',
    subjectColor: '#38bdf8',
    visualSummary: '3D anatomical body rotating to glowing Thyroid gland with 19-subject neural network web interconnecting.',
    coreConcept: 'Why learning Thyroid across 5 separate MBBS years causes exam failure, and how all 19 subjects fuse into a single organ system.',
    highYieldBullets: [
      'Anatomy dictates surgical complications (RLN vs EBSLN).',
      'Biochemical steps are the exact drug targets (TPO vs 5\'-deiodinase).',
      'Pathological subtypes determine hematogenous vs lymphatic spread.'
    ]
  },
  {
    id: 'cut-002',
    cutNumber: 2,
    timecode: '00:45 - 01:30',
    durationSec: 45,
    title: 'Embryology & Descent Anomalies',
    subject: 'Anatomy',
    subjectColor: '#38bdf8',
    visualSummary: 'Animated pharyngeal pouch migration from foramen cecum down to C5-T1 pre-tracheal level.',
    coreConcept: 'Originates from floor of primitive pharynx (foregut endoderm). Parafollicular C-cells derive from Neural Crest via Ultimobranchial Body (4th/5th pouch).',
    highYieldBullets: [
      'Thyroglossal Duct Cyst: Midline mass that moves UPWARD on tongue protrusion.',
      'Sistrunk Procedure: Excision of cyst + central body of hyoid bone + tract.',
      'Lingual Thyroid: Most common ectopic site; rule out normal neck thyroid before surgery.'
    ],
    mnemonic: 'Sistrunk = Slices the central Hyoid bone to prevent recurrence!'
  },
  {
    id: 'cut-003',
    cutNumber: 3,
    timecode: '01:30 - 02:15',
    durationSec: 45,
    title: 'Surgical Arteries & Ligation Golden Rules',
    subject: 'Surgery',
    subjectColor: '#f43f5e',
    visualSummary: '3D vascular map highlighting Superior Thyroid Artery from ECA and Inferior Thyroid Artery from Thyrocervical trunk.',
    coreConcept: 'Surgical ligation proximity rules to preserve vital laryngeal nerves.',
    highYieldBullets: [
      'Superior Thyroid Artery (from External Carotid) -> Ligated CLOSE to gland to spare EBSLN.',
      'Inferior Thyroid Artery (from Thyrocervical Trunk) -> Ligated FAR from gland to spare RLN.',
      'Arteria Thyroidea Ima: Inconstant vessel from Brachiocephalic trunk (Bleeding in emergency tracheostomy).'
    ],
    neetQuote: 'NEET-PG Repeat: Superior artery CLOSE, Inferior artery FAR.'
  },
  {
    id: 'cut-004',
    cutNumber: 4,
    timecode: '02:15 - 03:00',
    durationSec: 45,
    title: 'Nerve Hazard Zones (RLN vs. EBSLN)',
    subject: 'Surgery',
    subjectColor: '#f43f5e',
    visualSummary: 'Larynx anatomy with vibrating vocal cords and cricothyroid muscle tensor innervation highlighted.',
    coreConcept: 'Clinical voice consequences of unilateral vs bilateral laryngeal nerve injuries.',
    highYieldBullets: [
      'EBSLN Injury: Cricothyroid paralysis -> Inability to produce high-pitch sounds ("singers voice loss / vocal fatigue").',
      'Unilateral RLN Injury: Paralyzed cord in paramedian position -> Hoarseness of voice, bovine cough.',
      'Bilateral RLN Injury: Both cords in paramedian position -> Acute respiratory stridor & life-threatening airway obstruction (needs urgent tracheostomy).'
    ]
  },
  {
    id: 'cut-005',
    cutNumber: 5,
    timecode: '03:00 - 03:50',
    durationSec: 50,
    title: 'Biochemistry: Hormone Synthesis Cascade',
    subject: 'Biochemistry',
    subjectColor: '#a855f7',
    visualSummary: 'Cellular schematic: Basolateral NIS symporter -> Follicle -> Pendrin -> Colloid TPO oxidation -> MIT/DIT coupling.',
    coreConcept: 'Iodide trapping, TPO-mediated organification onto Thyroglobulin, and coupling ratios.',
    highYieldBullets: [
      'NIS (Na+/I- Symporter): 2 Na+ per 1 I- transported against gradient.',
      'Pendred Syndrome: SLC26A4 defect in Pendrin transporter -> Sensorineural deafness + Goiter.',
      'TPO (Thyroid Peroxidase): Performs 3 jobs (Oxidation, Organification to tyrosine, and Coupling).',
      'Coupling: DIT + DIT = T4 (90%), MIT + DIT = T3 (10%).'
    ]
  },
  {
    id: 'cut-006',
    cutNumber: 6,
    timecode: '03:50 - 04:35',
    durationSec: 45,
    title: 'Peripheral Deiodination & TBG Dynamics',
    subject: 'Physiology',
    subjectColor: '#22c55e',
    visualSummary: 'Flowchart showing T4 conversion to active T3 vs inactive reverse T3 (rT3) across organs.',
    coreConcept: '5\'-deiodinase regulation and drug-induced peripheral inhibition.',
    highYieldBullets: [
      '5\'-deiodinase converts T4 -> T3 (active).',
      'Inhibitors of 5\'-deiodinase: PTU, Propranolol, Glucocorticoids, Amiodarone, Radiocontrast.',
      'High Estrogen (Pregnancy, OCPs) -> Increases TBG -> Total T4 high, but Free T4 & TSH remain normal.'
    ]
  },
  {
    id: 'cut-007',
    cutNumber: 7,
    timecode: '04:35 - 05:25',
    durationSec: 50,
    title: 'Wolff-Chaikoff vs. Jod-Basedow Phenomena',
    subject: 'Physiology',
    subjectColor: '#22c55e',
    visualSummary: 'Split screen interactive graph comparing high iodide protective shutdown vs hyperthyroid induction.',
    coreConcept: 'Autoregulatory response of the thyroid gland to acute massive iodine load.',
    highYieldBullets: [
      'Wolff-Chaikoff Effect: High iodide transiently INHIBITS TPO -> Decreases T3/T4 synthesis (protective).',
      'Jod-Basedow Phenomenon: High iodide in iodine-deficient gland induces HYPERTHYROIDISM (autonomous toxic response).'
    ]
  },
  {
    id: 'cut-008',
    cutNumber: 8,
    timecode: '05:25 - 06:15',
    durationSec: 50,
    title: 'Hashimoto vs. De Quervain\'s Thyroiditis',
    subject: 'Pathology',
    subjectColor: '#eab308',
    visualSummary: 'Histopathology comparison: Hurthle cells with germinal follicles vs Multinucleated giant cell granulomas.',
    coreConcept: 'Autoimmune painless destructive hypothyroidism vs post-viral tender painful inflammatory thyroiditis.',
    highYieldBullets: [
      'Hashimoto: Anti-TPO & Anti-Tg positive; Hurthle (Askanazy) cells packed with mitochondria; risk of B-cell MALToma.',
      'De Quervain\'s (Subacute Granulomatous): Painful tender neck, post-viral, high ESR, RAIU < 2%, self-limiting.'
    ]
  },
  {
    id: 'cut-009',
    cutNumber: 9,
    timecode: '06:15 - 07:00',
    durationSec: 45,
    title: 'Riedel\'s Fibrosing Thyroiditis',
    subject: 'Pathology',
    subjectColor: '#eab308',
    visualSummary: 'Dense collagenous fibrotic mass encasing carotid sheath and invading strap muscles.',
    coreConcept: 'IgG4-related systemic fibrosing disorder mimicking anaplastic carcinoma.',
    highYieldBullets: [
      'Rock-hard, "woody", fixed thyroid gland in young females.',
      'Extrathyroidal collagen extension causes dyspnea and dysphagia.',
      'Associated with Retroperitoneal Fibrosis & Sclerosing Cholangitis.'
    ]
  },
  {
    id: 'cut-010',
    cutNumber: 10,
    timecode: '07:00 - 08:00',
    durationSec: 60,
    title: 'Papillary Thyroid Carcinoma (PTC)',
    subject: 'Pathology',
    subjectColor: '#eab308',
    visualSummary: 'Microscopic zoom showing ground-glass Orphan Annie nuclei, Psammoma bodies, and nuclear grooves.',
    coreConcept: 'Most common thyroid malignancy (~80%), BRAF V600E & RET/PTC drivers, lymphatic spread.',
    highYieldBullets: [
      'Pathognomonic: Orphan Annie eye nuclei (cleared chromatin), Psammoma bodies, Nuclear grooves.',
      'Driver Mutation: BRAF V600E (aggressive variant), RET/PTC rearrangement.',
      'Route of Spread: Lymphatic to cervical nodes (Level VI -> Level II-IV). Excellent 10-yr survival >95%.'
    ],
    mnemonic: 'P-A-P-I-L-L-A-R-Y = Psammoma, Annie eyes, Palpable lymph nodes, Iodine-cold, Radiation history, Low mortality.'
  },
  {
    id: 'cut-011',
    cutNumber: 11,
    timecode: '08:00 - 08:50',
    durationSec: 50,
    title: 'Follicular vs. Medullary Carcinoma',
    subject: 'Pathology',
    subjectColor: '#eab308',
    visualSummary: 'Split screen: Capsular invasion histology (FTC) vs Amyloid stroma with Congo Red apple-green birefringence (MTC).',
    coreConcept: 'Diagnostic boundaries on FNAC and MEN 2A/2B genetic screening.',
    highYieldBullets: [
      'Follicular Ca: CANNOT be diagnosed on FNAC (requires histological capsular/vascular invasion); hematogenous spread to bone/lung.',
      'Medullary Ca: Derived from Parafollicular C-cells; secretes Calcitonin; Amyloid stroma shows Apple-Green Birefringence; RET proto-oncogene (MEN 2A/2B).'
    ]
  },
  {
    id: 'cut-012',
    cutNumber: 12,
    timecode: '08:50 - 09:35',
    durationSec: 45,
    title: 'Anaplastic Carcinoma & Thyroid Lymphoma',
    subject: 'Pathology',
    subjectColor: '#eab308',
    visualSummary: 'Elderly patient CT scan with invasive necrotic neck mass compressing trachea.',
    coreConcept: 'Worst human solid cancer prognosis (TP53 inactivation) vs Hashimoto-associated B-cell lymphoma.',
    highYieldBullets: [
      'Anaplastic Ca: Rapidly enlarging fixed rock-hard mass in elderly with hoarseness and stridor; TP53 mutation; median survival < 6 months.',
      'Thyroid Lymphoma: Rapidly enlarging mass in elderly with pre-existing Hashimoto thyroiditis.'
    ]
  },
  {
    id: 'cut-013',
    cutNumber: 13,
    timecode: '09:35 - 10:30',
    durationSec: 55,
    title: 'Pharmacology: Methimazole vs. PTU',
    subject: 'Pharmacology',
    subjectColor: '#f97316',
    visualSummary: 'Comparative pharmacological dashboard showing pregnancy trimester safety dials and adverse effect alerts.',
    coreConcept: 'Thioamide mechanisms, pregnancy trimester rules, and fatal toxicity profiles.',
    highYieldBullets: [
      'Both inhibit TPO; PTU ALSO inhibits peripheral 5\'-deiodinase.',
      '1st Trimester Pregnancy: PTU is Drug of Choice (MMI causes Aplasia Cutis & Choanal Atresia).',
      '2nd & 3rd Trimester: Switch to Methimazole (PTU causes severe fulminant hepatotoxicity).',
      'Most dreaded side effect of both: Agranulocytosis (Fever + Sore throat -> Stop drug immediately, check CBC).'
    ]
  },
  {
    id: 'cut-014',
    cutNumber: 14,
    timecode: '10:30 - 11:15',
    durationSec: 45,
    title: 'Lugol\'s Solution & Radioactive Iodine (I-131)',
    subject: 'Pharmacology',
    subjectColor: '#f97316',
    visualSummary: 'Pre-op thyroid gland shrinking diagram and I-131 beta-particle follicular ablation.',
    coreConcept: 'Inhibition of thyroglobulin proteolysis pre-surgery and radioiodine contraindications.',
    highYieldBullets: [
      'Lugol\'s Iodine (5% I + 10% KI): Given 10-14 days before thyroidectomy to reduce gland vascularity and friability.',
      'I-131 Radioiodine: Beta emitter destroys follicles; Gamma emitter allows imaging.',
      'I-131 Absolute Contraindications: Pregnancy, Breastfeeding, and Severe active Graves Orbitopathy.'
    ]
  },
  {
    id: 'cut-015',
    cutNumber: 15,
    timecode: '11:15 - 12:10',
    durationSec: 55,
    title: 'Clinical RAIU Scintigraphy Algorithm',
    subject: 'Medicine',
    subjectColor: '#06b6d4',
    visualSummary: 'Interactive diagnostic decision tree branching based on 24-hr Radioactive Iodine Uptake scans.',
    coreConcept: 'Differentiation of hyperthyroidism causes using scan patterns and Thyroglobulin levels.',
    highYieldBullets: [
      'High Diffuse Uptake: Graves\' Disease (TSH-Receptor stimulatory antibodies).',
      'High Patchy/Nodular Uptake: Toxic Multinodular Goiter (Plummer Disease).',
      'Single Hot Nodule: Toxic Adenoma.',
      'Low/Near-Zero Uptake + High Tg: Subacute / Postpartum Thyroiditis.',
      'Low/Near-Zero Uptake + Low Tg: Factitious / Exogenous Thyroxine intake.'
    ]
  },
  {
    id: 'cut-016',
    cutNumber: 16,
    timecode: '12:10 - 13:00',
    durationSec: 50,
    title: 'Emergency: Thyroid Storm 4-Step Protocol',
    subject: 'Medicine',
    subjectColor: '#06b6d4',
    visualSummary: 'ICU monitor alert graphic; Burch-Wartofsky score criteria and sequential 4-drug emergency timeline.',
    coreConcept: 'Sequential pharmacotherapy of life-threatening decompensated thyrotoxicosis.',
    highYieldBullets: [
      'Diagnostic Scale: Burch-Wartofsky Point Scale (BWPS) >= 45.',
      'Step 1: IV Beta-Blocker (Esmolol / Propranolol) -> Controls sympathetic storm.',
      'Step 2: High-Dose PTU -> Blocks synthesis & peripheral T4->T3 conversion.',
      'Step 3: Iodine (Lugol\'s / SSKI) -> GIVEN 1 HOUR AFTER PTU (prevents iodine from being used as substrate!).',
      'Step 4: IV Hydrocortisone -> Treats relative adrenal crisis & blocks peripheral deiodinase.'
    ]
  },
  {
    id: 'cut-017',
    cutNumber: 17,
    timecode: '13:00 - 13:45',
    durationSec: 45,
    title: 'Emergency: Myxedema Coma Protocol',
    subject: 'Medicine',
    subjectColor: '#06b6d4',
    visualSummary: 'Clinical protocol card: Hypothermia (<35C), hyponatremia, and IV Levothyroxine + Hydrocortisone priority.',
    coreConcept: 'Resuscitation sequence in decompensated severe hypothyroidism.',
    highYieldBullets: [
      'Elderly female in winter presenting with hypothermia, bradycardia, hypoglycemia, hyponatremia, altered sensorium.',
      'MUST give IV Hydrocortisone BEFORE or simultaneously with IV Levothyroxine (preventing fatal adrenal crisis).',
      'Passive rewarming (avoid active rewarming to prevent peripheral vasodilation & cardiovascular shock).'
    ]
  },
  {
    id: 'cut-018',
    cutNumber: 18,
    timecode: '13:45 - 14:40',
    durationSec: 55,
    title: 'Surgery: Bethesda FNAC System & Triage',
    subject: 'Surgery',
    subjectColor: '#f43f5e',
    visualSummary: '6-tier Bethesda cytopathology chart with malignancy risk percentages and surgical pathways.',
    coreConcept: 'Fine needle aspiration cytology classification for thyroid nodule workup.',
    highYieldBullets: [
      'Bethesda I (Non-diagnostic): Repeat USG-guided FNAC.',
      'Bethesda II (Benign, 0-3% risk): Clinical and USG follow-up.',
      'Bethesda IV (Follicular Neoplasm, 25-40% risk): Diagnostic Hemithyroidectomy.',
      'Bethesda VI (Malignant, 97-99% risk): Total Thyroidectomy +/- Central Neck Dissection.'
    ]
  },
  {
    id: 'cut-019',
    cutNumber: 19,
    timecode: '14:40 - 15:35',
    durationSec: 55,
    title: 'Post-Op Disasters & Management',
    subject: 'Surgery',
    subjectColor: '#f43f5e',
    visualSummary: 'Bedside tension hematoma opening simulation + Chvostek and Trousseau sign illustrations.',
    coreConcept: 'Immediate bedside triage of neck hematoma, bilateral RLN stridor, and post-op hypocalcemic tetany.',
    highYieldBullets: [
      'Tension Neck Hematoma: DO NOT WAIT FOR OT! Cut skin sutures and evacuate clot immediately at bedside.',
      'Hypocalcemia (Parathyroid ischemia/excision): Chvostek sign (facial twitch on tapping) & Trousseau sign (carpopedal spasm on BP cuff).',
      'Treatment of Acute Tetany: IV 10% Calcium Gluconate (10 mL over 10 min) slowly under cardiac monitoring.'
    ]
  },
  {
    id: 'cut-020',
    cutNumber: 20,
    timecode: '15:35 - 16:30',
    durationSec: 55,
    title: '60-Second PYQ Blitzkrieg',
    subject: 'PYQ',
    subjectColor: '#ec4899',
    visualSummary: 'Rapid-fire 10-question flashcard cascade on dark high-contrast matrix.',
    coreConcept: 'Top 10 highest-frequency 1-liners in NEET-PG / INI-CET.',
    highYieldBullets: [
      'Most common cancer: Papillary Carcinoma.',
      'Cancer not diagnosed on FNAC: Follicular Carcinoma.',
      'Cancer with Amyloid: Medullary Carcinoma.',
      'Worst prognosis cancer: Anaplastic Carcinoma.',
      'Subclinical Hypothyroidism: Elevated TSH with normal Free T4.'
    ]
  }
];

export const THYROID_PYQS: PYQQuestion[] = [
  {
    id: 'pyq-1',
    exam: 'NEET-PG',
    year: '2023',
    question: 'A 28-year-old female in her 8th week of pregnancy is diagnosed with Graves\' disease. Which of the following is the most appropriate initial antithyroid drug therapy?',
    options: [
      'Methimazole',
      'Propylthiouracil (PTU)',
      'Radioactive Iodine (I-131)',
      'Potassium Iodide'
    ],
    correctIndex: 1,
    explanation: 'Propylthiouracil (PTU) is the drug of choice for Graves\' disease during the FIRST TRIMESTER of pregnancy because it has higher plasma protein binding and crosses the placenta less than Methimazole. Methimazole is teratogenic in the 1st trimester (causes Aplasia Cutis Congenita and Choanal Atresia), though it is preferred in 2nd and 3rd trimesters due to PTU\'s risk of fulminant hepatotoxicity.',
    buzzword: '1st Trimester Graves -> PTU (Aplasia Cutis avoided)',
    subjectTag: 'Pharmacology'
  },
  {
    id: 'pyq-2',
    exam: 'INI-CET',
    year: '2024',
    question: 'A 42-year-old female presents with a solitary thyroid nodule. FNAC is performed and reveals cells with ground-glass optical clearing of nuclei, intranuclear pseudo-inclusions, and laminated calcospherites. Which genetic alteration is most commonly associated with this tumor?',
    options: [
      'RET proto-oncogene point mutation',
      'BRAF V600E point mutation',
      'PAX8-PPARgamma translocation',
      'TP53 inactivating mutation'
    ],
    correctIndex: 1,
    explanation: 'The histopathological findings described (Orphan Annie eye nuclei, intranuclear pseudo-inclusions, and psammoma bodies) are pathognomonic for Papillary Thyroid Carcinoma (PTC). PTC is most commonly driven by BRAF V600E point mutations (found in ~45-60% of cases and associated with aggressive behavior) and RET/PTC rearrangements. RET point mutations are seen in Medullary Ca; PAX8-PPARg in Follicular Ca; TP53 in Anaplastic Ca.',
    buzzword: 'Orphan Annie + Psammoma -> Papillary Ca (BRAF V600E)',
    subjectTag: 'Pathology'
  },
  {
    id: 'pyq-3',
    exam: 'NEET-PG',
    year: '2022',
    question: 'During a total thyroidectomy for multinodular goiter, the surgeon ligates the Superior Thyroid Artery. To avoid injuring the closely related nerve, where should the ligation be performed?',
    options: [
      'As close to the upper pole of the gland as possible',
      'As far away from the gland at its origin from External Carotid Artery',
      'Near the carotid bifurcation',
      'At the level of the cricoid cartilage'
    ],
    correctIndex: 0,
    explanation: 'The Superior Thyroid Artery is closely related to the External Branch of the Superior Laryngeal Nerve (EBSLN). Near its origin, the EBSLN runs close to the artery, but diverges as the artery reaches the upper pole. Therefore, the Superior Thyroid Artery must be ligated AS CLOSE TO THE GLAND AS POSSIBLE. Conversely, the Inferior Thyroid Artery must be ligated FAR AWAY from the gland to avoid injuring the Recurrent Laryngeal Nerve (RLN).',
    buzzword: 'Superior Artery CLOSE to gland -> Spares EBSLN',
    subjectTag: 'Surgery / Anatomy'
  },
  {
    id: 'pyq-4',
    exam: 'NEET-PG',
    year: '2021',
    question: 'A 35-year-old female presents with severe anterior neck pain, fever, and palpitation 2 weeks after a viral upper respiratory infection. On examination, the thyroid is exquisitely tender. Labs reveal elevated Free T4, suppressed TSH, ESR of 95 mm/hr, and a 24-hour Radioactive Iodine Uptake (RAIU) of 1.2%. What is the most likely diagnosis?',
    options: [
      'Hashimoto Thyroiditis',
      'Subacute Granulomatous (De Quervain\'s) Thyroiditis',
      'Graves\' Disease',
      'Riedel\'s Thyroiditis'
    ],
    correctIndex: 1,
    explanation: 'Subacute Granulomatous (De Quervain\'s) Thyroiditis characteristically presents in young females following a viral URI with a painful, tender thyroid, hyperthyroid symptoms due to follicular rupture, very high ESR/CRP, and a markedly suppressed RAIU (< 2%). Histology shows non-caseating granulomas with multinucleated foreign body giant cells. Graves has high diffuse RAIU; Hashimoto is non-tender.',
    buzzword: 'Painful tender thyroid + Post-viral + Low RAIU -> De Quervain\'s',
    subjectTag: 'Medicine / Pathology'
  },
  {
    id: 'pyq-5',
    exam: 'INI-CET',
    year: '2023',
    question: 'A patient in thyroid storm is being managed in the ICU. The attending doctor orders IV Propranolol, Propylthiouracil, Lugol\'s iodine, and Hydrocortisone. Why is Lugol\'s iodine administered strictly 1 hour AFTER the loading dose of Propylthiouracil?',
    options: [
      'To prevent iodine-induced anaphylaxis',
      'To prevent the administered iodine from acting as a substrate for new thyroid hormone synthesis',
      'To enhance the absorption of PTU in the gut',
      'To prevent immediate renal clearance of iodine'
    ],
    correctIndex: 1,
    explanation: 'In Thyroid Storm, giving iodine (Lugol\'s or SSKI) before blocking the thyroid peroxidase (TPO) enzyme would provide a massive substrate load for the hyperactive gland to synthesize and store even more thyroid hormone. Therefore, PTU or Methimazole is administered FIRST to paralyze TPO. Waiting 1 hour allows the thioamide to block synthesis before iodine is given to halt hormone release via the Wolff-Chaikoff effect.',
    buzzword: 'Thyroid Storm: PTU FIRST, then wait 1 hr before Iodine!',
    subjectTag: 'Pharmacology / Medicine'
  }
];

export const THYROID_CASES: ClinicalCase[] = [
  {
    id: 'case-001',
    title: 'Post-Viral Acute Tender Neck Swelling in a 34-Year-Old Doctor',
    ageGender: '34 Female',
    presentingComplaint: 'Severe anterior neck pain radiating to ears and fever for 5 days.',
    history: 'Had acute viral rhinitis 2 weeks ago. Complains of sudden hand tremors, heat intolerance, and painful swallowing. No prior thyroid disease.',
    findings: 'Diffuse enlargement of thyroid gland with exquisite tenderness on gentle palpation. Fine hand tremors present. Pulse 110 bpm regular.',
    investigations: {
      tsh: '< 0.01 mIU/L (Suppressed)',
      ft4: '28.4 pmol/L (High)',
      raiu: '0.8% at 24 hours (Markedly low / suppressed)',
      usg: 'Patchy ill-defined hypoechoic areas with decreased vascularity on color Doppler.'
    },
    finalDiagnosis: 'Subacute Granulomatous (De Quervain\'s) Thyroiditis',
    management: [
      'Oral Prednisolone 40 mg/day tapered over 4-6 weeks for severe pain and inflammation.',
      'Propranolol 20 mg TID for adrenergic symptom control.',
      'Strictly avoid antithyroid drugs (MMI/PTU) because this is a release thyroiditis, not increased synthesis.'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=800',
    imageCaption: 'High-power histology demonstrating characteristic non-caseating granuloma surrounded by multinucleated giant cells disrupting thyroid follicles.',
    contributor: {
      name: 'Dr. Shivam Gola',
      role: 'Founding Lead & Medical Editor',
      hospital: 'Clinova Editorial Team',
      verified: true
    },
    upvotes: 42
  },
  {
    id: 'case-002',
    title: 'Incidental Solitary Hard Thyroid Nodule in a 48-Year-Old Female',
    ageGender: '48 Female',
    presentingComplaint: 'Painless solitary nodule in right thyroid lobe discovered during routine health checkup.',
    history: 'No history of hoarseness, dysphagia, or radiation exposure. Euthyroid clinically.',
    findings: 'Single 1.8 cm firm-to-hard non-tender nodule in right lower lobe. Moves with swallowing. No palpable cervical lymphadenopathy.',
    investigations: {
      tsh: '2.1 mIU/L (Normal)',
      ft4: '14.2 pmol/L (Normal)',
      raiu: 'Cold nodule on Scintigraphy',
      usg: 'Solid hypoechoic 1.8 cm nodule, taller-than-wide shape, irregular margins with punctate microcalcifications (ACR-TIRADS 5).',
      fnac: 'Bethesda VI: Papillary Thyroid Carcinoma (Orphan Annie nuclei, nuclear grooves, psammoma bodies).'
    },
    finalDiagnosis: 'Papillary Thyroid Carcinoma (cT1bN0M0)',
    management: [
      'Total Thyroidectomy with prophylactic central compartment (Level VI) neck dissection.',
      'Post-operative Levothyroxine suppressive therapy (Target TSH 0.1-0.5 mIU/L).',
      'Serum Thyroglobulin and anti-Tg surveillance at 6 months post-op.'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=800',
    imageCaption: 'Fine needle aspiration cytology (Papanicolaou stain) showing papillary fronds with ground-glass optical clearing of nuclei (Orphan Annie eyes).',
    contributor: {
      name: 'Dr. Rajesh Nair',
      role: 'Associate Professor of Endocrine Surgery',
      hospital: 'AIIMS New Delhi',
      verified: true
    },
    upvotes: 38
  }
];
