export interface SmartConcept {
  id: string;
  term: string;
  subject: 'Anatomy' | 'Physiology' | 'Biochemistry' | 'Pathology' | 'Pharmacology' | 'Medicine' | 'Surgery' | 'Radiology';
  subjectColor: string;
  headline: string;
  definition: string;
  examTrap: string;
  targetCutNumber: number;
}

export const SMART_CONCEPTS: Record<string, SmartConcept> = {
  'orphan-annie': {
    id: 'orphan-annie',
    term: 'Orphan Annie Eye Nuclei',
    subject: 'Pathology',
    subjectColor: '#eab308',
    headline: 'Pathognomonic Nuclear Feature of Papillary Thyroid Ca',
    definition: 'Optically clear, ground-glass nuclei caused by dispersed, finely powdered chromatin with peripheral margination.',
    examTrap: 'Associated with BRAF V600E point mutations and RET/PTC rearrangements. Prior history of head/neck radiation.',
    targetCutNumber: 10
  },
  'psammoma-bodies': {
    id: 'psammoma-bodies',
    term: 'Psammoma Bodies',
    subject: 'Pathology',
    subjectColor: '#eab308',
    headline: 'Concentric Laminated Calcospherites',
    definition: 'Round, microscopically laminated calcifications representing infarcted and mineralized papillary tips.',
    examTrap: 'Mnemonic PSaMMoma: Papillary thyroid ca, Serous ovarian ca, Meningioma, Mesothelioma.',
    targetCutNumber: 10
  },
  'ptu': {
    id: 'ptu',
    term: 'Propylthiouracil (PTU)',
    subject: 'Pharmacology',
    subjectColor: '#f97316',
    headline: 'Dual-Action Thioamide (TPO + Peripheral 5\'-DI Block)',
    definition: 'Inhibits Thyroid Peroxidase (TPO) to block organification AND uniquely inhibits peripheral 5\'-deiodinase (blocking T4 to T3 conversion).',
    examTrap: 'Drug of choice in 1st Trimester Pregnancy (less teratogenic than Methimazole). Black Box Warning: Fulminant Hepatotoxicity.',
    targetCutNumber: 13
  },
  'methimazole': {
    id: 'methimazole',
    term: 'Methimazole (MMI)',
    subject: 'Pharmacology',
    subjectColor: '#f97316',
    headline: 'Potent Once-Daily Thioamide',
    definition: 'Inhibits TPO organification & coupling. 10x more potent than PTU with longer half-life.',
    examTrap: 'Contraindicated in 1st trimester due to Aplasia Cutis Congenita and Choanal Atresia. Preferred in 2nd/3rd trimesters.',
    targetCutNumber: 13
  },
  'ebsln': {
    id: 'ebsln',
    term: 'External Branch of Superior Laryngeal Nerve (EBSLN)',
    subject: 'Anatomy',
    subjectColor: '#38bdf8',
    headline: 'Motor Innervation to Cricothyroid Tensor Muscle',
    definition: 'Runs intimately with Superior Thyroid Artery near the upper pole. Innervates Cricothyroid (tenses vocal cords for high-pitch sounds).',
    examTrap: 'Ligate Superior Thyroid Artery CLOSE TO GLAND. Injury causes loss of high-pitch voice / vocal fatigue in singers.',
    targetCutNumber: 4
  },
  'rln': {
    id: 'rln',
    term: 'Recurrent Laryngeal Nerve (RLN)',
    subject: 'Anatomy',
    subjectColor: '#38bdf8',
    headline: 'Innervates All Intrinsic Laryngeal Muscles (Except Cricothyroid)',
    definition: 'Ascends in the tracheoesophageal groove, closely related to branches of Inferior Thyroid Artery at Ligament of Berry.',
    examTrap: 'Ligate Inferior Thyroid Artery FAR FROM GLAND. Unilateral injury = Hoarseness; Bilateral injury = Acute airway stridor (emergency tracheostomy).',
    targetCutNumber: 4
  },
  'hurthle-cells': {
    id: 'hurthle-cells',
    term: 'Hurthle (Askanazy) Cells',
    subject: 'Pathology',
    subjectColor: '#eab308',
    headline: 'Transformed Eosinophilic Follicular Oncocytic Cells',
    definition: 'Enlarged polygonal follicular cells packed with dense abnormal mitochondria giving granular eosinophilic cytoplasm.',
    examTrap: 'Characteristic of Hashimoto Thyroiditis. Long-standing Hashimoto carries increased risk of Marginal Zone B-cell MALToma.',
    targetCutNumber: 8
  },
  'wolff-chaikoff': {
    id: 'wolff-chaikoff',
    term: 'Wolff-Chaikoff Effect',
    subject: 'Physiology',
    subjectColor: '#22c55e',
    headline: 'Autoregulatory Inhibition by Acute High Iodide Load',
    definition: 'Excess intrathyroidal iodide transiently downregulates TPO activity and NIS expression, halting T3/T4 synthesis for 10-14 days.',
    examTrap: 'Protective physiological brake. Utilized clinically by giving Lugol\'s iodine 10-14 days before thyroidectomy.',
    targetCutNumber: 7
  },
  'jod-basedow': {
    id: 'jod-basedow',
    term: 'Jod-Basedow Phenomenon',
    subject: 'Physiology',
    subjectColor: '#22c55e',
    headline: 'Iodine-Induced Hyperthyroidism in Autonomous Goiter',
    definition: 'Administration of iodine to a patient with an underlying iodine-deficient multinodular goiter triggers autonomous thyrotoxicosis.',
    examTrap: 'Can be triggered by CT contrast agents or Amiodarone in patients with endemic goiters.',
    targetCutNumber: 7
  },
  'burch-wartofsky': {
    id: 'burch-wartofsky',
    term: 'Burch-Wartofsky Point Scale (BWPS)',
    subject: 'Medicine',
    subjectColor: '#06b6d4',
    headline: 'Diagnostic Scoring System for Thyroid Storm',
    definition: 'Evaluates thermoregulatory dysfunction, CNS effects (agitation/delirium/coma), tachycardia/AFib, CHF, and GI-hepatic dysfunction.',
    examTrap: 'Score >= 45 is highly diagnostic of Thyroid Storm. Requires 4-step emergency sequence: Beta-blocker -> PTU -> Iodine -> Hydrocortisone.',
    targetCutNumber: 16
  },
  'bethesda': {
    id: 'bethesda',
    term: 'Bethesda System for Thyroid Cytopathology',
    subject: 'Surgery',
    subjectColor: '#f43f5e',
    headline: '6-Tier Risk Stratification for Thyroid FNAC',
    definition: 'Standardized cytopathology reporting scale from Tier I (Non-diagnostic, 5-10% risk) to Tier VI (Malignant, 97-99% risk).',
    examTrap: 'Bethesda IV (Follicular Neoplasm) cannot be distinguished from Follicular Adenoma on FNAC -> Requires diagnostic hemithyroidectomy.',
    targetCutNumber: 18
  },
  'sistrunk': {
    id: 'sistrunk',
    term: 'Sistrunk Operation',
    subject: 'Surgery',
    subjectColor: '#f43f5e',
    headline: 'Definitive Surgical Cure for Thyroglossal Duct Cyst',
    definition: 'En bloc excision of the midline thyroglossal cyst, the central body of the hyoid bone, and the core of tissue up to foramen cecum.',
    examTrap: 'Simple excision without resecting the hyoid bone carries a high recurrence rate (>50%).',
    targetCutNumber: 2
  },
  'pendred': {
    id: 'pendred',
    term: 'Pendred Syndrome',
    subject: 'Biochemistry',
    subjectColor: '#a855f7',
    headline: 'SLC26A4 Mutation (Pendrin Transporter Defect)',
    definition: 'Autosomal recessive disorder causing sensorineural hearing loss and euthyroid/hypothyroid goiter with abnormal perchlorate discharge test.',
    examTrap: 'Pendrin is an apical iodide-chloride exchanger in thyroid follicular cells and inner ear endolymph.',
    targetCutNumber: 5
  }
};
