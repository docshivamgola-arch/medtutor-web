export interface OrganNode {
  id: string;
  name: string;
  status: 'active' | 'in-production' | 'curriculum';
  cutsCount: number;
  highYieldPoints: number;
  system: string;
}

export interface MedicalSystem {
  id: string;
  name: string;
  icon: string;
  badgeColor: string;
  nodes: OrganNode[];
}

export const MEDICAL_SYSTEMS: MedicalSystem[] = [
  {
    id: 'endocrine',
    name: 'Endocrine System',
    icon: 'Activity',
    badgeColor: '#06b6d4',
    nodes: [
      {
        id: 'thyroid',
        name: 'The Thyroid Gland',
        status: 'active',
        cutsCount: 20,
        highYieldPoints: 48,
        system: 'Endocrine System'
      },
      {
        id: 'adrenal',
        name: 'Adrenal Glands (Cushing & Addison)',
        status: 'in-production',
        cutsCount: 18,
        highYieldPoints: 42,
        system: 'Endocrine System'
      },
      {
        id: 'parathyroid',
        name: 'Parathyroid & Calcium Kinetics',
        status: 'curriculum',
        cutsCount: 14,
        highYieldPoints: 35,
        system: 'Endocrine System'
      },
      {
        id: 'pituitary',
        name: 'Pituitary Axis & Sella Anomalies',
        status: 'curriculum',
        cutsCount: 16,
        highYieldPoints: 38,
        system: 'Endocrine System'
      },
      {
        id: 'diabetes',
        name: 'Endocrine Pancreas & Diabetes',
        status: 'curriculum',
        cutsCount: 22,
        highYieldPoints: 55,
        system: 'Endocrine System'
      }
    ]
  },
  {
    id: 'hepatobiliary',
    name: 'Hepatobiliary & GI System',
    icon: 'Layers',
    badgeColor: '#f97316',
    nodes: [
      {
        id: 'liver-jaundice',
        name: 'Liver & Jaundice Syndromes',
        status: 'in-production',
        cutsCount: 22,
        highYieldPoints: 52,
        system: 'Hepatobiliary & GI'
      },
      {
        id: 'cirrhosis-portal',
        name: 'Cirrhosis & Portal Hypertension',
        status: 'curriculum',
        cutsCount: 18,
        highYieldPoints: 44,
        system: 'Hepatobiliary & GI'
      },
      {
        id: 'pancreatitis',
        name: 'Acute & Chronic Pancreatitis',
        status: 'curriculum',
        cutsCount: 15,
        highYieldPoints: 36,
        system: 'Hepatobiliary & GI'
      },
      {
        id: 'pud-ibd',
        name: 'Peptic Ulcer Disease & IBD',
        status: 'curriculum',
        cutsCount: 20,
        highYieldPoints: 46,
        system: 'Hepatobiliary & GI'
      }
    ]
  },
  {
    id: 'cardiovascular',
    name: 'Cardiovascular System',
    icon: 'Heart',
    badgeColor: '#f43f5e',
    nodes: [
      {
        id: 'ihd-acs',
        name: 'Acute Coronary Syndromes & IHD',
        status: 'curriculum',
        cutsCount: 24,
        highYieldPoints: 60,
        system: 'Cardiovascular System'
      },
      {
        id: 'ecg-arrhythmias',
        name: 'High-Yield ECG & Arrhythmias',
        status: 'curriculum',
        cutsCount: 20,
        highYieldPoints: 50,
        system: 'Cardiovascular System'
      },
      {
        id: 'valvular-hf',
        name: 'Valvular Diseases & Heart Failure',
        status: 'curriculum',
        cutsCount: 18,
        highYieldPoints: 45,
        system: 'Cardiovascular System'
      }
    ]
  },
  {
    id: 'cns',
    name: 'Central Nervous System',
    icon: 'Sparkles',
    badgeColor: '#a855f7',
    nodes: [
      {
        id: 'stroke-aneurysm',
        name: 'Cerebrovascular Stroke & Aneurysms',
        status: 'curriculum',
        cutsCount: 20,
        highYieldPoints: 48,
        system: 'Central Nervous System'
      },
      {
        id: 'meningitis-cns',
        name: 'Meningitis & Encephalitis Emergencies',
        status: 'curriculum',
        cutsCount: 16,
        highYieldPoints: 40,
        system: 'Central Nervous System'
      },
      {
        id: 'demyelination',
        name: 'Multiple Sclerosis & Demyelination',
        status: 'curriculum',
        cutsCount: 14,
        highYieldPoints: 34,
        system: 'Central Nervous System'
      }
    ]
  },
  {
    id: 'renal',
    name: 'Renal & Acid-Base System',
    icon: 'ShieldCheck',
    badgeColor: '#38bdf8',
    nodes: [
      {
        id: 'nephritic-nephrotic',
        name: 'Nephritic vs Nephrotic Syndromes',
        status: 'curriculum',
        cutsCount: 20,
        highYieldPoints: 48,
        system: 'Renal & Acid-Base'
      },
      {
        id: 'acid-base-abg',
        name: 'Acid-Base Disorders & ABG Analysis',
        status: 'curriculum',
        cutsCount: 15,
        highYieldPoints: 38,
        system: 'Renal & Acid-Base'
      }
    ]
  }
];
