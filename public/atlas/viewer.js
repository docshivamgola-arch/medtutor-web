/**
 * ==============================================================================
 * COMMERCIAL-GRADE 3D HUMAN ANATOMY VIEWER (THREE.JS R160 + DRACO)
 * ==============================================================================
 * Terminologia Anatomica (TA2) Standard
 * 60 FPS Real-Time Medical Diagnostics & Organ Illumination Engine
 * ==============================================================================
 */

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';

// ------------------------------------------------------------------------------
// MEDICAL KNOWLEDGE BASE & TERMINOLOGIA ANATOMICA (TA2) DICTIONARY
// ------------------------------------------------------------------------------
const ANATOMY_DATABASE = {
  // Outer Shell
  "Anatomy_Head": {
    ta2: "Caput humanum (TA2: 12)",
    system: "System_OuterShell",
    sysLabel: "Outer Shell / Craniofacial",
    func: "Encloses and protects the neurocranium vault and houses sensory organs (visual, auditory, olfactory, gustatory).",
    landmarks: "Cranial calvaria, orbital apertures, zygomatic arches, maxilla, mandibular contour.",
    clinical: "Cranial trauma assessment, cephalometric analysis, aesthetic reconstructive plane."
  },
  "Anatomy_Neck": {
    ta2: "Collum / Cervix (TA2: 782)",
    system: "System_OuterShell",
    sysLabel: "Outer Shell / Cervical",
    func: "Provides multidirectional head mobility while transmitting neurovascular bundles (carotid sheath, jugular veins, vagus nerve) and airway.",
    landmarks: "Sternocleidomastoid muscle borders, thyroid cartilage prominence (Adam's apple), supraclavicular fossae.",
    clinical: "Carotid pulse palpation site, emergency cricothyroidotomy access window."
  },
  "Anatomy_Torso": {
    ta2: "Thorax (TA2: 980)",
    system: "System_OuterShell",
    sysLabel: "Outer Shell / Thoracic",
    func: "Protects cardiopulmonary structures within mediastinum; expands during negative-pressure respiratory mechanics.",
    landmarks: "Pectoralis major contours, clavicular indentations, sternal notch, axillary lines.",
    clinical: "Auscultation zones, tube thoracostomy triangle of safety."
  },
  "Anatomy_Abdomen": {
    ta2: "Abdomen (TA2: 1350)",
    system: "System_OuterShell",
    sysLabel: "Outer Shell / Abdominal",
    func: "Muscular containment and pressure regulation for the peritoneal and retroperitoneal viscera.",
    landmarks: "Linea alba, rectus abdominis inscriptions, umbilicus (L3-L4), iliac crest flanks.",
    clinical: "Abdominal quadrants (RUQ, LUQ, RLQ, LLQ), McBurney's surgical point."
  },

  // Cardiovascular System
  "Organ_Heart": {
    ta2: "Cor (TA2: 3951)",
    system: "System_Cardiovascular",
    sysLabel: "Cardiovascular System",
    func: "Muscular double-pump driving systemic circulation (LV -> Aorta) and pulmonary circulation (RV -> Pulmonary Trunk).",
    landmarks: "4 Chambers (RA, RV, LA, LV), Interventricular Sulcus, Coronary Sinus, Cardiac Apex.",
    clinical: "Auscultatory cardiac apex at left 5th intercostal space midclavicular line. Site of ischemic infarction."
  },
  "Vessel_Aorta": {
    ta2: "Aorta (TA2: 4120)",
    system: "System_Cardiovascular",
    sysLabel: "Cardiovascular System",
    func: "Main systemic arterial trunk distributing oxygenated blood under high pulsatile pressure to all organs.",
    landmarks: "Ascending aorta, aortic arch, 3 supra-aortic branches (brachiocephalic, carotid, subclavian), abdominal aorta, iliac bifurcation.",
    clinical: "Site of aortic aneurysm, dissection (Stanford Type A/B), and coarctation."
  },
  "Vessel_VenaCava": {
    ta2: "Vena cava superior et inferior (TA2: 4420)",
    system: "System_Cardiovascular",
    sysLabel: "Cardiovascular System",
    func: "Primary venous drainage returning deoxygenated systemic blood from upper and lower extremities into right atrium.",
    landmarks: "SVC enters RA superiorly; IVC ascends on right of abdominal aorta, passes diaphragm to enter lower RA.",
    clinical: "Central venous line catheterization, IVC filtration placement."
  },
  "Vessel_PulmonaryTrunk": {
    ta2: "Truncus pulmonalis (TA2: 3950)",
    system: "System_Cardiovascular",
    sysLabel: "Cardiovascular System",
    func: "Arterial conduit originating from right ventricle infundibulum conveying deoxygenated blood to the lungs.",
    landmarks: "Bifurcation beneath aortic arch into left and right pulmonary arteries at ligamentum arteriosum.",
    clinical: "Saddle pulmonary embolism, pulmonary arterial hypertension, pulmonary valve stenosis."
  },


  // Nervous System
  "Organ_Brain": {
    ta2: "Encephalon (TA2: 5210)",
    system: "System_Nervous",
    sysLabel: "Nervous System",
    func: "Master central nervous system command organ: sensory processing, motor control, cognitive executive function, autonomic regulation.",
    landmarks: "Cerebral hemispheres, longitudinal fissure, cortical gyri and sulci, cerebellum with horizontal folia, brainstem (pons, medulla).",
    clinical: "Cerebrovascular accident (stroke), neurosurgical pterional approach, intracranial pressure monitoring."
  },

  // Respiratory System
  "Organ_Lung_Left": {
    ta2: "Pulmo sinister (TA2: 3100)",
    system: "System_Respiratory",
    sysLabel: "Respiratory System",
    func: "Bilateral pulmonary gas exchange organ with 2 lobes (superior, inferior) and cardiac notch accommodating the pericardial apex.",
    landmarks: "Superior lobe, inferior lobe, oblique fissure, lingula, cardiac impression.",
    clinical: "Auscultation of breath sounds, left-sided pneumothorax, pulmonary lobectomy."
  },
  "Organ_Lung_Right": {
    ta2: "Pulmo dexter (TA2: 3101)",
    system: "System_Respiratory",
    sysLabel: "Respiratory System",
    func: "Larger pulmonary organ with 3 distinct lobes (superior, middle, inferior) performing oxygen uptake and carbon dioxide elimination.",
    landmarks: "Superior lobe, middle lobe, inferior lobe, horizontal and oblique fissures, diaphragmatic base.",
    clinical: "Right lower lobe aspiration pneumonia predisposition due to straighter right main bronchus."
  },
  "Organ_Trachea": {
    ta2: "Trachea et arbor bronchialis (TA2: 3080)",
    system: "System_Respiratory",
    sysLabel: "Respiratory System",
    func: "Fibrocartilaginous conducting airway tube extending from cricoid cartilage to carina bifurcation into right and left main bronchi.",
    landmarks: "C-shaped cartilaginous tracheal rings, trachealis muscle posteriorly, carina tracheae.",
    clinical: "Endotracheal intubation depth verification, tracheostomy between 2nd and 3rd tracheal rings."
  },

  // Skeletal System
  "Skeletal_Skull": {
    ta2: "Cranium (TA2: 120)",
    system: "System_Skeletal",
    sysLabel: "Skeletal System",
    func: "Rigid protective osseous framework for the brain, special senses, and dentition.",
    landmarks: "Neurocranium calvaria, orbital sockets, piriform nasal aperture, zygomatic arch, mandible.",
    clinical: "Le Fort facial fracture classifications, craniotomy access corridors."
  },
  "Skeletal_Spine": {
    ta2: "Columna vertebralis (TA2: 450)",
    system: "System_Skeletal",
    sysLabel: "Skeletal System",
    func: "Flexible axial pillar supporting trunk mass, enabling locomotor kinematics, and shielding the spinal cord.",
    landmarks: "7 Cervical (lordosis), 12 Thoracic (kyphosis), 5 Lumbar (lordosis), Sacrum and Coccyx (kyphosis).",
    clinical: "Lumbar puncture site at L3-L4 / L4-L5 interspaces, disc herniation."
  },
  "Skeletal_Ribcage": {
    ta2: "Cavea thoracis et cingulum pectorale (TA2: 580)",
    system: "System_Skeletal",
    sysLabel: "Skeletal System",
    func: "Dynamic structural cage protecting thoracic viscera while facilitating negative-pressure ventilation; anchored to shoulder girdle via bilateral clavicles and scapulae.",
    landmarks: "12 pairs of ribs, costal cartilages, sternum (manubrium, body, xiphoid), bilateral Clavicles and Scapulae.",
    clinical: "Median sternotomy for cardiac bypass, clavicular fracture management, flail chest biomechanics."
  },
  "Skeletal_Pelvis": {
    ta2: "Pelvis (TA2: 1110)",
    system: "System_Skeletal",
    sysLabel: "Skeletal System",
    func: "Bony basin transmitting trunk load to lower extremities and sheltering pelvic viscera (bladder, rectum, reproductive).",
    landmarks: "Iliac crests, anterior superior iliac spine (ASIS), ischial tuberosities, pubic symphysis, acetabulum.",
    clinical: "Bone marrow biopsy from posterior iliac crest, obstetric pelvic brim diameter."
  },
  "Skeletal_Limbs_Upper": {
    ta2: "Ossa membri superioris (TA2: 600)",
    system: "System_Skeletal",
    sysLabel: "Skeletal System / Upper Extremity",
    func: "Articulated osseous lever arms providing 3D spatial positioning, reach kinematics, and dexterity.",
    landmarks: "Humerus (greater/lesser tubercles, olecranon fossa), Radius (radial head, styloid process), Ulna (olecranon, coronoid process).",
    clinical: "Colles' distal radius fracture, humeral shaft spiral fracture with radial nerve injury."
  },
  "Skeletal_Limbs_Lower": {
    ta2: "Ossa membri inferioris (TA2: 1150)",
    system: "System_Skeletal",
    sysLabel: "Skeletal System / Lower Extremity",
    func: "Weight-bearing osseous columns driving bipedal locomotion, ground reaction absorption, and posture.",
    landmarks: "Femur (femoral head, greater trochanter, condyles), Patella sesamoid, Tibia (tibial plateau, medial malleolus), Fibula (lateral malleolus).",
    clinical: "Femoral neck fracture with avascular necrosis risk, tibial plateau fracture, ankle trimalleolar injury."
  },


  // Muscular System
  "Muscle_Pectoralis": {
    ta2: "Musculus pectoralis major et minor (TA2: 2010)",
    system: "System_Muscular",
    sysLabel: "Muscular System / Pectoral Girdle",
    func: "Adducts and medially rotates the humerus; draws scapula anteriorly and inferiorly for clavicular stabilization.",
    landmarks: "Clavicular head, sternocostal head, abdominal slip, bicipital crest insertion.",
    clinical: "Poland syndrome congenital absence, subpectoral breast implant pocket placement."
  },
  "Muscle_Deltoid": {
    ta2: "Musculus deltoideus (TA2: 2015)",
    system: "System_Muscular",
    sysLabel: "Muscular System / Shoulder",
    func: "Prime abductor of the arm (beyond initial 15° by supraspinatus); anterior head flexes/medially rotates, posterior head extends/laterally rotates.",
    landmarks: "Clavicular anterior, acromial lateral, and spinal posterior heads converging into deltoid tuberosity.",
    clinical: "Intramuscular injection site (3 fingerbreadths below acromion), axillary nerve vulnerability during humeral neck fractures."
  },
  "Muscle_RectusAbdominis": {
    ta2: "Musculus rectus abdominis (TA2: 2150)",
    system: "System_Muscular",
    sysLabel: "Muscular System / Abdominal Wall",
    func: "Flexes the lumbar vertebral column, compresses abdominal viscera for expiration and posture stabilization.",
    landmarks: "Paired longitudinal muscle columns separated by linea alba, interrupted by 3-4 tendinous intersections.",
    clinical: "Diastasis recti separation, paramedian surgical laparotomy incision corridor, TRAM flap reconstruction."
  },
  "Muscle_Diaphragm": {
    ta2: "Diaphragma thoracoabdominale (TA2: 2110)",
    system: "System_Muscular",
    sysLabel: "Muscular System / Respiratory",
    func: "Primary muscle of respiration; contracts downward during inhalation to generate negative thoracic pressure and inflate lungs.",
    landmarks: "Central tendon, peripheral muscular slips, aortic hiatus (T12), esophageal hiatus (T10), caval opening (T8).",
    clinical: "Congenital diaphragmatic hernia (Bochdalek/Morgagni), phrenic nerve (C3, C4, C5) palsy."
  },
  "Muscle_Trapezius": {
    ta2: "Musculus trapezius (TA2: 2005)",
    system: "System_Muscular",
    sysLabel: "Muscular System / Posterior Neck & Back",
    func: "Stabilizes, elevates, depresses, and retracts the scapula; rotates glenoid cavity superiorly during arm abduction.",
    landmarks: "External occipital protuberance and nuchal line origin, spines of C1-T12, insertion along spine of scapula and lateral clavicle.",
    clinical: "Accessory nerve (CN XI) clinical testing via shoulder shrug against resistance."
  },
  "Muscle_LatissimusDorsi": {
    ta2: "Musculus latissimus dorsi (TA2: 2008)",
    system: "System_Muscular",
    sysLabel: "Muscular System / Posterior Trunk",
    func: "Extends, adducts, and medially rotates the humerus ('swimmer's muscle'); draws shoulder inferiorly and posteriorly.",
    landmarks: "Thoracolumbar fascia origin, lower 6 thoracic spines, iliac crest, intertubercular sulcus floor of humerus.",
    clinical: "Latissimus dorsi myocutaneous flap for breast or reconstructive soft-tissue coverage."
  },
  "Muscle_BicepsBrachii": {
    ta2: "Musculus biceps brachii et brachialis (TA2: 2025)",
    system: "System_Muscular",
    sysLabel: "Muscular System / Anterior Arm",
    func: "Powerful supinator of the flexed forearm and prime elbow flexor; assists shoulder flexion.",
    landmarks: "Long head tendon traversing bicipital groove, short head from coracoid process, radial tuberosity insertion.",
    clinical: "Biceps tendinopathy, 'Popeye deformity' from proximal long head tendon rupture."
  },
  "Muscle_TricepsBrachii": {
    ta2: "Musculus triceps brachii (TA2: 2030)",
    system: "System_Muscular",
    sysLabel: "Muscular System / Posterior Arm",
    func: "Primary extensor of the elbow joint; long head stabilizes abducted shoulder and resists downward displacement.",
    landmarks: "Long head (infraglenoid tubercle), lateral and medial heads converging on olecranon of ulna.",
    clinical: "Radial nerve injury in spiral groove causing triceps weakness and wrist drop."
  },
  "Muscle_Gluteal": {
    ta2: "Musculus gluteus maximus et medius (TA2: 2180)",
    system: "System_Muscular",
    sysLabel: "Muscular System / Gluteal Region",
    func: "Gluteus maximus: powerful hip extensor driving rising, climbing, and running. Gluteus medius: major pelvic stabilizer during gait.",
    landmarks: "Iliac crest, posterior sacrum/coccyx, iliotibial tract, gluteal tuberosity of femur, greater trochanter.",
    clinical: "Trendelenburg sign (superior gluteal nerve palsy), intragluteal injection upper outer quadrant landmark."
  },
  "Muscle_QuadricepsFemoris": {
    ta2: "Musculus quadriceps femoris (TA2: 2210)",
    system: "System_Muscular",
    sysLabel: "Muscular System / Anterior Thigh",
    func: "Primary extensor of the knee joint; rectus femoris also flexes the hip joint.",
    landmarks: "Rectus femoris (AIIS), Vastus lateralis/medialis/intermedius converging via quadriceps tendon onto patella.",
    clinical: "Patellar tendon reflex (L3-L4), quadriceps tendon rupture, Osgood-Schlatter disease at tibial tuberosity."
  },
  "Muscle_Hamstrings": {
    ta2: "Musculi ischiocrurales (TA2: 2225)",
    system: "System_Muscular",
    sysLabel: "Muscular System / Posterior Thigh",
    func: "Flexes the knee joint and extends the hip joint during walking and sprinting kinematics.",
    landmarks: "Ischial tuberosity common origin, Biceps femoris (fibular head), Semitendinosus and Semimembranosus (pes anserinus/medial condyle).",
    clinical: "Hamstring strain avulsion injuries during athletic sprint deceleration."
  },
  "Muscle_TricepsSurae_Calf": {
    ta2: "Musculus triceps surae et tibialis anterior (TA2: 2240)",
    system: "System_Muscular",
    sysLabel: "Muscular System / Leg & Calf",
    func: "Gastrocnemius & Soleus: powerful plantarflexion via Achilles tendon for propulsion. Tibialis anterior: dorsiflexion and inversion.",
    landmarks: "Medial/lateral femoral condyles, soleal line of tibia/fibula, Calcaneal (Achilles) tendon, medial cuneiform/1st metatarsal.",
    clinical: "Achilles tendon rupture (positive Thompson test), foot drop (deep fibular nerve palsy)."
  },



  // Digestive System
  "Organ_Stomach": {
    ta2: "Gaster / Ventriculus (TA2: 2420)",
    system: "System_Digestive",
    sysLabel: "Digestive System",
    func: "Gastric reservoir initiating chemical digestion via hydrochloric acid and pepsin; peristaltic churning into chyme.",
    landmarks: "Cardia, fundus dome, greater curvature, lesser curvature, pyloric antrum, pyloric sphincter.",
    clinical: "Peptic ulcer disease, gastric adenocarcinoma, sleeve gastrectomy resection."
  },
  "Organ_Liver": {
    ta2: "Hepar (TA2: 2510)",
    system: "System_Digestive",
    sysLabel: "Digestive System",
    func: "Central metabolic laboratory: bile synthesis, glycogen storage, drug/toxin detoxification, plasma protein production (albumin, clotting factors).",
    landmarks: "Right and left anatomical lobes, falciform ligament fissure, diaphragmatic convexity, visceral gallbladder fossa.",
    clinical: "Hepatic cirrhosis, portal hypertension, segment-based Couinaud resection."
  },
  "Organ_Gallbladder": {
    ta2: "Vesica biliaris (TA2: 2560)",
    system: "System_Digestive",
    sysLabel: "Digestive System",
    func: "Stores and concentrates hepatic bile, ejecting it into the duodenum upon cholecystokinin (CCK) trigger.",
    landmarks: "Fundus, body, neck, infundibulum (Hartmann's pouch), cystic duct junction.",
    clinical: "Cholelithiasis (gallstones), laparoscopic cholecystectomy in Calot's triangle."
  },
  "Organ_Pancreas": {
    ta2: "Pancreas (TA2: 2610)",
    system: "System_Digestive",
    sysLabel: "Digestive & Endocrine",
    func: "Dual gland: exocrine acini secrete alkaline digestive enzymes; endocrine islets of Langerhans secrete insulin and glucagon.",
    landmarks: "Head nestled in duodenal C-loop, uncinate process, neck, body, tail reaching splenic hilum.",
    clinical: "Pancreatic ductal adenocarcinoma, acute necrotizing pancreatitis, Whipple procedure."
  },
  "Organ_Spleen": {
    ta2: "Lien / Splen (TA2: 4300)",
    system: "System_Digestive",
    sysLabel: "Lymphatic & Hematic",
    func: "Largest secondary lymphoid organ: filters senescent erythrocytes in red pulp, mounts adaptive immune responses in white pulp.",
    landmarks: "Diaphragmatic surface under ribs 9-11, visceral gastric/renal impressions, splenic hilum.",
    clinical: "Splenomegaly in portal hypertension, high risk of rupture in blunt abdominal trauma."
  },
  "Organ_Intestines": {
    ta2: "Intestinum (TA2: 2460)",
    system: "System_Digestive",
    sysLabel: "Digestive System",
    func: "Small intestine: enzymatic digestion and nutrient absorption. Large intestine: water/electrolyte reabsorption and fecal consolidation.",
    landmarks: "Duodenum, jejunum/ileum mesenteric loops, cecum, ascending colon, transverse colon, descending colon, sigmoid colon, haustra.",
    clinical: "Appendicitis at cecal base, colonoscopy screening for neoplastic polyps."
  },

  // Renal System
  "Organ_Kidney_Left": {
    ta2: "Ren sinister (TA2: 3101)",
    system: "System_Renal",
    sysLabel: "Renal / Urinary System",
    func: "Filters blood plasma to generate urine, maintains fluid/electrolyte/acid-base equilibrium, secretes renin and erythropoietin.",
    landmarks: "Convex lateral border, concave medial hilum (renal artery, vein, pelvis), T12-L3 position.",
    clinical: "Left donor nephrectomy preferred due to longer left renal vein."
  },
  "Organ_Kidney_Right": {
    ta2: "Ren dexter (TA2: 3102)",
    system: "System_Renal",
    sysLabel: "Renal / Urinary System",
    func: "Filters blood plasma and regulates systemic blood pressure via renin-angiotensin-aldosterone axis.",
    landmarks: "Slightly lower than left kidney due to hepatic compression, renal hilum.",
    clinical: "Renal cell carcinoma staging, lithotripsy for nephrolithiasis."
  },
  "Organ_Bladder": {
    ta2: "Vesica urinaria (TA2: 3200)",
    system: "System_Renal",
    sysLabel: "Renal / Urinary System",
    func: "Distensible smooth muscle (detrusor) reservoir accumulating urine prior to micturition.",
    landmarks: "Apex with median umbilical ligament (urachus), fundus, trigone with bilateral ureteric orifices.",
    clinical: "Suprapubic catheterization, cystoscopy, transitional cell carcinoma."
  },

  // Endocrine System
  "Organ_Thyroid": {
    ta2: "Glandula thyroidea (TA2: 3600)",
    system: "System_Endocrine",
    sysLabel: "Endocrine System",
    func: "Produces metabolic hormones thyroxine (T4) and triiodothyronine (T3), and calcitonin for calcium regulation.",
    landmarks: "Right and left lateral lobes straddling the trachea, joined by central isthmus.",
    clinical: "Thyroidectomy with preservation of recurrent laryngeal nerves and parathyroids."
  },
  "Organ_Parathyroids": {
    ta2: "Glandulae parathyroideae (TA2: 3620)",
    system: "System_Endocrine",
    sysLabel: "Endocrine System",
    func: "Secretes parathyroid hormone (PTH) to stimulate osteoclast calcium release and renal calcium reabsorption.",
    landmarks: "4 lentiform glands on posterior capsule of superior/inferior thyroid lobes.",
    clinical: "Primary hyperparathyroidism causing hypercalcemia ('bones, stones, groans')."
  },
  "Organ_Adrenals": {
    ta2: "Glandulae suprarenales (TA2: 3700)",
    system: "System_Endocrine",
    sysLabel: "Endocrine System",
    func: "Cortex: mineralocorticoids (aldosterone), glucocorticoids (cortisol), androgens. Medulla: epinephrine and norepinephrine.",
    landmarks: "Right pyramidal cap and left semilunar crescent resting atop renal poles.",
    clinical: "Pheochromocytoma, Cushing's syndrome, Addisonian adrenal crisis."
  },

  // ── Integumentary & Fascial System ────────────────────────────────────────

  "Skin_Body": {
    ta2: "Cutis (TA2: 7001)",
    system: "System_Integumentary",
    sysLabel: "Integumentary System / Cutaneous Skin",
    func: "Outermost protective barrier organ covering ~1.7 m² of body surface; regulates thermoregulation, sensation, vitamin D synthesis, and immune surveillance via keratinocytes, melanocytes, Langerhans cells, and Merkel cells.",
    landmarks: "Epidermis (5 strata: basale, spinosum, granulosum, lucidum, corneum), dermis (papillary & reticular), dermal papillae, rete ridges, eccrine and apocrine glands.",
    clinical: "Burns (Wallace rule of nines), melanoma ABCDE criteria, pressure injury staging (NPUAP), dermatological biopsy sites."
  },
  "Fascia_Superficial": {
    ta2: "Tela subcutanea / Fascia superficialis (TA2: 7010)",
    system: "System_Integumentary",
    sysLabel: "Integumentary System / Superficial Fascia & Hypodermis",
    func: "Fibro-adipose layer between dermis and deep fascia housing subcutaneous fat lobules, cutaneous nerves, superficial veins, and lymphatics; acts as thermal insulator and energy reserve. Contains Platysma in neck region.",
    landmarks: "Camper's fascia (fatty layer), Scarpa's fascia (membranous layer in lower abdomen), Platysma muscle belly in cervical region, superficial inguinal ring.",
    clinical: "Site of subcutaneous injections (insulin, heparin), lipedema, subcutaneous abscess drainage, Fournier's gangrene in perineal region."
  },
  "Fascia_Deep_Thoracolumbar": {
    ta2: "Fascia thoracolumbaris (TA2: 2220)",
    system: "System_Integumentary",
    sysLabel: "Deep Fascia / Thoracolumbar (Posterior Trunk)",
    func: "Three-layer investing aponeurosis of the posterior trunk enclosing the deep back muscles (erector spinae, multifidus); posterior layer serves as attachment for latissimus dorsi, gluteus maximus, and internal oblique.",
    landmarks: "Posterior, middle (anterior to erector spinae), and anterior layers; lateral raphe; lumbosacral junction.",
    clinical: "Compartment syndrome of paraspinal muscles, chronic low back pain fascial tension, donor site for reconstruction flaps."
  },
  "Fascia_Deep_Transversalis": {
    ta2: "Fascia transversalis (TA2: 2310)",
    system: "System_Integumentary",
    sysLabel: "Deep Fascia / Transversalis (Deep Abdomen)",
    func: "Innermost layer of the abdominal wall lining the transversus abdominis muscle internally; forms the posterior wall of the inguinal canal and contributes to the internal spermatic fascia.",
    landmarks: "Deep inguinal ring, iliopubic tract, lateral border of rectus sheath.",
    clinical: "Direct inguinal hernia site (medial to inferior epigastric vessels — Hesselbach's triangle), laparoscopic hernia repair landmark."
  },
  "Fascia_Deep_Lata": {
    ta2: "Fascia lata (TA2: 2190)",
    system: "System_Integumentary",
    sysLabel: "Deep Fascia / Fascia Lata (Thigh Sleeve)",
    func: "Dense cylindrical investing fascia encasing the thigh muscles; thickened laterally to form the iliotibial tract. Encloses femoral triangle superiorly and contains the saphenous opening.",
    landmarks: "Iliotibial tract (Gerdy's tubercle laterally), saphenous opening (cribriform fascia), femoral sheath, pes anserinus.",
    clinical: "IT band syndrome (lateral knee pain in runners), fascia lata graft for dural repair, compartment syndrome of thigh."
  },
  "Fascia_Deep_IT_Band": {
    ta2: "Tractus iliotibialis (TA2: 2195)",
    system: "System_Integumentary",
    sysLabel: "Deep Fascia / Iliotibial Tract",
    func: "Thickened lateral reinforcement of the fascia lata running from iliac tubercle to Gerdy's tubercle on the tibia; transmits forces from TFL and gluteus maximus to the knee, stabilising lateral compartment.",
    landmarks: "Iliac tubercle origin, lateral femoral condyle (impingement zone), Gerdy's tubercle insertion, Kaplan fibres.",
    clinical: "IT band syndrome (lateral knee pain) in runners and cyclists, TFL tightness testing (Ober's test)."
  },
  "Fascia_Deep_Galea": {
    ta2: "Galea aponeurotica (TA2: 5010)",
    system: "System_Integumentary",
    sysLabel: "Deep Fascia / Galea Aponeurotica (Scalp)",
    func: "Dense aponeurotic tendon connecting frontalis anteriorly to occipitalis posteriorly; moves scalp over periosteum with 3rd layer of the SCALP mnemonic (Skin / Connective tissue / Aponeurosis / Loose areolar tissue / Periosteum).",
    landmarks: "Frontalis muscle anteriorly, occipitalis posteriorly, temporoparietal fascia laterally.",
    clinical: "Scalp laceration repair (must close galea to prevent wound gaping), subgaleal haematoma in neonates, galeal layer in craniofacial surgery."
  },
  "Fascia_Deep_Plantar": {
    ta2: "Aponeurosis plantaris (TA2: 7510)",
    system: "System_Integumentary",
    sysLabel: "Deep Fascia / Plantar Aponeurosis",
    func: "Thick triangular fibrous plate on the plantar surface originating from medial calcaneal tubercle and fanning into five digital slips; maintains the medial longitudinal arch via the windlass mechanism.",
    landmarks: "Calcaneal tubercle origin, medial and lateral bands, digital slips, metatarsal heads.",
    clinical: "Plantar fasciitis (most common cause of heel pain), fasciotomy for plantar compartment syndrome, diabetic plantar ulceration predisposition."
  },
  "Fascia_Deep_Palmar": {
    ta2: "Aponeurosis palmaris (TA2: 7310)",
    system: "System_Integumentary",
    sysLabel: "Deep Fascia / Palmar Aponeurosis",
    func: "Triangular fibrous expansion of the flexor retinaculum and palmaris longus tendon covering the central palm; protects flexor tendons and digital neurovascular bundles.",
    landmarks: "Palmaris longus tendon apex, four digital slips to fingers 2-5, natatory ligaments, pretendinous bands.",
    clinical: "Dupuytren's disease (progressive fibromatosis causing flexion contracture of ring/little fingers), palmar fasciectomy, recurrence after incomplete excision."
  },
  "Fascia_Deep_Retinacula": {
    ta2: "Retinaculum musculorum (TA2: 7400)",
    system: "System_Integumentary",
    sysLabel: "Deep Fascia / Retinacula (Wrist & Ankle)",
    func: "Transverse thickened bands of deep fascia at the wrist and ankle that hold tendons in place during joint movement, preventing bowstringing; include flexor/extensor retinacula at the wrist and superior/inferior extensor retinacula at the ankle.",
    landmarks: "Flexor retinaculum (carpal tunnel roof), extensor retinaculum (wrist dorsum), superior extensor retinaculum (ankle), inferior extensor retinaculum (cruciate ligament), fibular retinacula.",
    clinical: "Carpal tunnel syndrome (median nerve compression under flexor retinaculum), tarsal tunnel syndrome (posterior tibial nerve), trigger finger at A1 pulley (first annular fibrous sheath)."
  },

  // ============================================================================
  // CRANIAL & FACIAL SKELETON (23 DISCRETE BONES)
  // ============================================================================
  "Bone_Frontal": {
    ta2: "Os frontale (TA2: 121)",
    system: "System_Skeletal",
    sysLabel: "Skeletal / Neurocranium",
    func: "Forms anterior calvaria dome, superior orbital roofs, and anterior cranial fossa floor shielding the frontal cerebral lobes.",
    landmarks: "Supraorbital margin/notch, glabella, frontal air sinuses, coronal suture junction with parietal bones.",
    clinical: "Frontal bone fractures with anterior cranial fossa disruption predispose to CSF rhinorrhea and orbital roof blow-in."
  },
  "Bone_Parietal_L": {
    ta2: "Os parietale sinistrum (TA2: 135)",
    system: "System_Skeletal",
    sysLabel: "Skeletal / Neurocranium",
    func: "Forms curved superolateral vault of neurocranium; internal surface grooved by middle meningeal artery branches.",
    landmarks: "Sagittal suture medially, coronal suture anteriorly, lambdoid suture posteriorly, squamous suture inferiorly, pterion landmark.",
    clinical: "Pterion fracture lacerates anterior branch of middle meningeal artery producing acute epidural hematoma."
  },
  "Bone_Parietal_R": {
    ta2: "Os parietale dextrum (TA2: 135)",
    system: "System_Skeletal",
    sysLabel: "Skeletal / Neurocranium",
    func: "Forms curved superolateral vault of neurocranium; internal surface grooved by middle meningeal artery branches.",
    landmarks: "Sagittal suture medially, coronal suture anteriorly, lambdoid suture posteriorly, squamous suture inferiorly, pterion landmark.",
    clinical: "Pterion fracture lacerates anterior branch of middle meningeal artery producing acute epidural hematoma."
  },
  "Bone_Occipital": {
    ta2: "Os occipitale (TA2: 145)",
    system: "System_Skeletal",
    sysLabel: "Skeletal / Neurocranium",
    func: "Forms posterior base and vault of cranium; encloses foramen magnum and houses cerebellum and brainstem.",
    landmarks: "Foramen magnum, occipital condyles (atlanto-occipital joint), external occipital protuberance (inion), hypoglossal canals.",
    clinical: "Basilar skull fractures extending into foramen magnum risk brainstem compression; Chiari malformation herniation corridor."
  },
  "Bone_Temporal_L": {
    ta2: "Os temporale sinistrum (TA2: 160)",
    system: "System_Skeletal",
    sysLabel: "Skeletal / Cranial Base",
    func: "Houses middle and inner auditory/vestibular apparatus; accommodates mandibular condyle at TMJ; transmits carotid artery and CN VII/VIII.",
    landmarks: "Petrous ridge, internal acoustic meatus, mastoid process, styloid process, zygomatic process, mandibular fossa, carotid canal.",
    clinical: "Petrous temporal bone fracture leads to hemotympanum, Battle sign (mastoid ecchymosis), and facial nerve (CN VII) palsy."
  },
  "Bone_Temporal_R": {
    ta2: "Os temporale dextrum (TA2: 160)",
    system: "System_Skeletal",
    sysLabel: "Skeletal / Cranial Base",
    func: "Houses middle and inner auditory/vestibular apparatus; accommodates mandibular condyle at TMJ; transmits carotid artery and CN VII/VIII.",
    landmarks: "Petrous ridge, internal acoustic meatus, mastoid process, styloid process, zygomatic process, mandibular fossa, carotid canal.",
    clinical: "Petrous temporal bone fracture leads to hemotympanum, Battle sign (mastoid ecchymosis), and facial nerve (CN VII) palsy."
  },
  "Bone_Sphenoid": {
    ta2: "Os sphenoidale (TA2: 210)",
    system: "System_Skeletal",
    sysLabel: "Skeletal / Cranial Base Keystone",
    func: "Central wedge bone bridging neurocranium and viscerocranium; contains sella turcica housing pituitary gland; transmits optic nerve (CN II).",
    landmarks: "Sella turcica (hypophyseal fossa), greater/lesser wings, superior orbital fissure, optic canal, foramen rotundum/ovale/spinosum.",
    clinical: "Transsphenoidal endoscopic pituitary adenoma resection surgical approach through sphenoid sinus."
  },
  "Bone_Ethmoid": {
    ta2: "Os ethmoidale (TA2: 235)",
    system: "System_Skeletal",
    sysLabel: "Skeletal / Craniofacial Junction",
    func: "Delicate sponge-like bone forming anterior cranial floor, medial orbital walls, and superior/middle nasal conchae.",
    landmarks: "Cribriform plate (olfactory foramina), crista galli, perpendicular plate (nasal septum), ethmoidal labyrinth/air cells.",
    clinical: "Cribriform plate fracture disrupts olfactory rootlets (anosmia) and tears dura mater causing CSF rhinorrhea."
  },
  "Bone_Mandible": {
    ta2: "Mandibula (TA2: 350)",
    system: "System_Skeletal",
    sysLabel: "Skeletal / Viscerocranium",
    func: "Strongest and sole mobile bone of the skull; bears lower dentition and provides muscular anchors for mastication.",
    landmarks: "Mandibular body, ramus, coronoid process, condylar head (TMJ), mental foramen, mandibular foramen (inferior alveolar nerve).",
    clinical: "Inferior alveolar nerve block at mandibular lingula prior to molar extraction; angle/parasymphyseal fracture biomechanics."
  },
  "Bone_Maxilla_L": {
    ta2: "Maxilla sinistra (TA2: 280)",
    system: "System_Skeletal",
    sysLabel: "Skeletal / Facial Skeleton",
    func: "Forms upper jaw, anterior hard palate, inferomedial orbital floor, and lateral nasal aperture margins.",
    landmarks: "Alveolar process (upper dentition), palatine process, infraorbital foramen, maxillary sinus cavity (antrum of Highmore).",
    clinical: "Le Fort I, II, and III facial fracture patterns; orbital floor 'blowout' fractures with inferior rectus muscle entrapment."
  },
  "Bone_Maxilla_R": {
    ta2: "Maxilla dextra (TA2: 280)",
    system: "System_Skeletal",
    sysLabel: "Skeletal / Facial Skeleton",
    func: "Forms upper jaw, anterior hard palate, inferomedial orbital floor, and lateral nasal aperture margins.",
    landmarks: "Alveolar process (upper dentition), palatine process, infraorbital foramen, maxillary sinus cavity (antrum of Highmore).",
    clinical: "Le Fort I, II, and III facial fracture patterns; orbital floor 'blowout' fractures with inferior rectus muscle entrapment."
  },
  "Bone_Zygomatic_L": {
    ta2: "Os zygomaticum sinistrum (TA2: 300)",
    system: "System_Skeletal",
    sysLabel: "Skeletal / Facial Skeleton",
    func: "Prominence of cheek and anterolateral orbital margin; forms zygomatic arch by joining temporal zygomatic process.",
    landmarks: "Frontal process, temporal process, maxillary process, zygomaticofacial foramen.",
    clinical: "Tripod (zygomaticomaxillary complex) fracture causing flattened cheek contour, trismus, and diplopia."
  },
  "Bone_Zygomatic_R": {
    ta2: "Os zygomaticum dextrum (TA2: 300)",
    system: "System_Skeletal",
    sysLabel: "Skeletal / Facial Skeleton",
    func: "Prominence of cheek and anterolateral orbital margin; forms zygomatic arch by joining temporal zygomatic process.",
    landmarks: "Frontal process, temporal process, maxillary process, zygomaticofacial foramen.",
    clinical: "Tripod (zygomaticomaxillary complex) fracture causing flattened cheek contour, trismus, and diplopia."
  },
  "Bone_Nasal_L": {
    ta2: "Os nasale sinistrum (TA2: 260)",
    system: "System_Skeletal",
    sysLabel: "Skeletal / Nasal Bridge",
    func: "Forms bony bridge of the nose and superior margin of the piriform aperture.",
    landmarks: "Internasal suture, frontonasal suture, nasomaxillary suture.",
    clinical: "Most frequently fractured bone of the human skeleton following direct blunt facial trauma; risks septal hematoma."
  },
  "Bone_Nasal_R": {
    ta2: "Os nasale dextrum (TA2: 260)",
    system: "System_Skeletal",
    sysLabel: "Skeletal / Nasal Bridge",
    func: "Forms bony bridge of the nose and superior margin of the piriform aperture.",
    landmarks: "Internasal suture, frontonasal suture, nasomaxillary suture.",
    clinical: "Most frequently fractured bone of the human skeleton following direct blunt facial trauma; risks septal hematoma."
  },
  "Bone_Hyoid": {
    ta2: "Os hyoideum (TA2: 390)",
    system: "System_Skeletal",
    sysLabel: "Skeletal / Cervical Skeleton",
    func: "Free-floating U-shaped bone suspended in anterior neck by stylohyoid ligaments and suprahyoid/infrahyoid strap muscles; anchors tongue base and elevates larynx during deglutition.",
    landmarks: "Central body, greater horns (cornua majora), lesser horns (cornua minora), C3 vertebral level.",
    clinical: "Hyoid bone fracture is a forensic hallmark of manual strangulation and hanging."
  },

  // ============================================================================
  // POSTCRANIAL SKELETON (KEY AXIAL & APPENDICULAR STRUCTURES)
  // ============================================================================
  "Bone_Vertebra_C1_Atlas": {
    ta2: "Atlas C1 (TA2: 455)",
    system: "System_Skeletal",
    sysLabel: "Skeletal / Cervical Spine",
    func: "Ring-shaped first cervical vertebra lacking a vertebral body and spinous process; cradles occipital condyles allowing nodding motion ('yes').",
    landmarks: "Anterior arch with facet for dens, posterior arch with vertebral artery groove, lateral masses, transverse foramen (vertebral artery).",
    clinical: "Jefferson burst fracture from axial loading compression impact (e.g. diving into shallow water)."
  },
  "Bone_Vertebra_C2_Axis": {
    ta2: "Axis C2 (TA2: 460)",
    system: "System_Skeletal",
    sysLabel: "Skeletal / Cervical Spine",
    func: "Serves as rotational pivot for the head; dens (odontoid process) acts as a vertical axle within the atlas ring allowing side-to-side rotation ('no').",
    landmarks: "Dens (odontoid process), superior articular facets, robust bifid spinous process, transverse foramina.",
    clinical: "Hangman's fracture (traumatic spondylolisthesis of C2 pedicles); dens fracture Type I, II, III classifications."
  },
  "Bone_Sacrum": {
    ta2: "Os sacrum (TA2: 520)",
    system: "System_Skeletal",
    sysLabel: "Skeletal / Pelvic Axial Spine",
    func: "Large triangular wedge of 5 fused sacral vertebrae transferring entire upper body weight to the pelvic girdle via bilateral sacroiliac joints.",
    landmarks: "Sacral promontory, anterior and posterior sacral foramina (sacral nerves), sacral canal, sacral hiatus, auricular articular surface.",
    clinical: "Caudal epidural anesthesia administered via sacral hiatus; sacral insufficiency fractures in postmenopausal osteoporosis."
  },
  "Bone_Coccyx": {
    ta2: "Os coccygis (TA2: 540)",
    system: "System_Skeletal",
    sysLabel: "Skeletal / Terminal Axial Column",
    func: "Vestigial terminal tailbone composed of 3-5 fused coccygeal segments; provides osseous attachment for gluteus maximus and pelvic diaphragm muscles (levator ani).",
    landmarks: "Coccygeal cornua, sacrococcygeal symphysis, apex.",
    clinical: "Coccydynia following fall onto buttocks; hypermobility or anterior displacement during vaginal delivery."
  },
  "Bone_Sternum_Manubrium": {
    ta2: "Manubrium sterni (TA2: 582)",
    system: "System_Skeletal",
    sysLabel: "Skeletal / Thoracic Cage",
    func: "Superior hexagonal segment of sternum articulating with clavicles and 1st/2nd costal cartilages.",
    landmarks: "Suprasternal (jugular) notch (T2 level), clavicular notches, sternal angle of Louis (T4-T5 intervertebral disc level).",
    clinical: "Sternal angle of Louis is the crucial clinical landmark for counting ribs (2nd costal cartilage) and demarcating superior/inferior mediastinum."
  },
  "Bone_Sternum_Body": {
    ta2: "Corpus sterni (TA2: 585)",
    system: "System_Skeletal",
    sysLabel: "Skeletal / Thoracic Cage",
    func: "Elongated flat bone shielding pericardium and thoracic aorta; articulates with costal cartilages of ribs 2 through 7.",
    landmarks: "Costal notches 2-7, transverse ridges of fused sternebrae.",
    clinical: "Median sternotomy surgical split for open-heart coronary artery bypass grafting (CABG)."
  },
  "Bone_Sternum_Xiphoid": {
    ta2: "Processus xiphoideus (TA2: 588)",
    system: "System_Skeletal",
    sysLabel: "Skeletal / Thoracic Cage",
    func: "Smallest inferior cartilaginous/osseous sternal tip; anchors rectus abdominis and linea alba aponeurosis.",
    landmarks: "Xiphisternal joint (T9 level), infrasternal angle.",
    clinical: "Landmark for CPR chest compressions (avoid direct pressure to prevent hepatic laceration); pericardiocentesis subxiphoid needle entry."
  },
  "Bone_Femur_L": {
    ta2: "Femur sinistrum (TA2: 1205)",
    system: "System_Skeletal",
    sysLabel: "Skeletal / Lower Extremity",
    func: "Longest, heaviest, and strongest bone in the human body; transmits ground reaction force to pelvis and drives bipedal walking.",
    landmarks: "Femoral head (fovea capitis), neck (125-degree angle of inclination), greater and lesser trochanters, linea aspera, medial/lateral condyles.",
    clinical: "Subcapital femoral neck fracture disrupts retinacular arteries risking avascular necrosis; intertrochanteric fractures treated with cephalomedullary nails."
  },
  "Bone_Femur_R": {
    ta2: "Femur dextrum (TA2: 1205)",
    system: "System_Skeletal",
    sysLabel: "Skeletal / Lower Extremity",
    func: "Longest, heaviest, and strongest bone in the human body; transmits ground reaction force to pelvis and drives bipedal walking.",
    landmarks: "Femoral head (fovea capitis), neck (125-degree angle of inclination), greater and lesser trochanters, linea aspera, medial/lateral condyles.",
    clinical: "Subcapital femoral neck fracture disrupts retinacular arteries risking avascular necrosis; intertrochanteric fractures treated with cephalomedullary nails."
  },

  // ============================================================================
  // ALIMENTARY CANAL & HEPATOBILIARY SYSTEM (30 DECONSTRUCTED STRUCTURES)
  // ============================================================================
  "GI_Esophagus": {
    ta2: "Oesophagus (TA2: 2380)",
    system: "System_Digestive",
    sysLabel: "Digestive / Foregut Conduit",
    func: "25-cm muscular propulsion tube conveying food boluses from hypopharynx to gastric cardia via coordinated peristaltic contractions.",
    landmarks: "Upper esophageal sphincter (cricopharyngeus), diaphragmatic hiatus (T10 level), lower esophageal sphincter (LES) at gastroesophageal junction (Z-line).",
    clinical: "Gastroesophageal reflux disease (GERD) leading to Barrett's esophagus metaplasia; esophageal varices from portal hypertension."
  },
  "GI_Stomach_Muscularis": {
    ta2: "Tunica muscularis gastrica (TA2: 2435)",
    system: "System_Digestive",
    sysLabel: "Digestive / Gastric Motor Engine",
    func: "Three distinct smooth muscle coats (outer longitudinal, middle circular, inner oblique) executing vigorous mechanical churning and retropulsion.",
    landmarks: "Cardia, fundic dome, greater curvature, lesser curvature, pyloric antral pump, thickened pyloric sphincter muscle.",
    clinical: "Infantile hypertrophic pyloric stenosis presenting with projectile non-bilious vomiting; sleeve gastrectomy longitudinal resection."
  },
  "GI_Stomach_Mucosa": {
    ta2: "Tunica mucosa gastrica (TA2: 2425)",
    system: "System_Digestive",
    sysLabel: "Digestive / Gastric Secretory Lining",
    func: "Specialized glandular secretory barrier arranged in prominent longitudinal rugal folds; secretes HCl, intrinsic factor, pepsinogen, and alkaline mucin.",
    landmarks: "Rugal folds (rugae gastri), gastric pits, parietal cell zone (fundus/body), gastrin-secreting G-cell zone (antrum).",
    clinical: "Helicobacter pylori colonization predisposing to peptic ulcer disease and gastric MALT lymphoma; autoimmune gastritis causing pernicious anemia."
  },
  "GI_Liver_Segment_I": {
    ta2: "Segmentum hepatis I - Lobus caudatus (TA2: 2521)",
    system: "System_Digestive",
    sysLabel: "Hepatobiliary / Couinaud Segment I",
    func: "Caudate lobe of the liver situated posteriorly between IVC and fissure for ligamentum venosum; receives blood from both left and right portal triads and drains directly into IVC.",
    landmarks: "Posterior liver surface, hugs inferior vena cava, papillary process.",
    clinical: "Hypertrophies compensatory in Budd-Chiari syndrome (hepatic vein thrombosis) due to its direct, independent venous drainage into the IVC."
  },
  "GI_Liver_Segment_II": {
    ta2: "Segmentum hepatis II - Posterolaterale sinistrum (TA2: 2522)",
    system: "System_Digestive",
    sysLabel: "Hepatobiliary / Couinaud Segment II",
    func: "Superior subsegment of left lateral liver division; performs metabolic biosynthesis and bile synthesis.",
    landmarks: "Superior aspect of left hepatic lobe, bounded medially by left hepatic fissure.",
    clinical: "Included in left lateral segmentectomy (segments II and III), a common graft procurement for pediatric living-donor liver transplantation."
  },
  "GI_Liver_Segment_III": {
    ta2: "Segmentum hepatis III - Anterolaterale sinistrum (TA2: 2523)",
    system: "System_Digestive",
    sysLabel: "Hepatobiliary / Couinaud Segment III",
    func: "Inferior subsegment of left lateral liver division; adjacent to falciform ligament and stomach.",
    landmarks: "Inferior aspect of left hepatic lobe, gastric impression.",
    clinical: "Left lateral sectionectomy donor graft for pediatric recipients."
  },
  "GI_Liver_Segment_IV": {
    ta2: "Segmentum hepatis IV - Lobus quadratus (TA2: 2524)",
    system: "System_Digestive",
    sysLabel: "Hepatobiliary / Couinaud Segment IV",
    func: "Left medial division (quadrate lobe, subdivided into IVa superior and IVb inferior); situated between falciform ligament and gallbladder fossa.",
    landmarks: "Porta hepatis anteriorly, fossa for gallbladder laterally, umbilical fissure medially.",
    clinical: "Segment IVb resection required in gallbladder adenocarcinoma with local liver bed invasion."
  },
  "GI_Liver_Segment_V": {
    ta2: "Segmentum hepatis V - Anteromediale dextrum (TA2: 2525)",
    system: "System_Digestive",
    sysLabel: "Hepatobiliary / Couinaud Segment V",
    func: "Anterior inferior subsegment of right hepatic lobe; directly abuts gallbladder bed and right colic flexure.",
    landmarks: "Inferior right lobe, adjacent to gallbladder fossa.",
    clinical: "High-frequency site of gallbladder cancer direct extension; non-anatomical wedge resection."
  },
  "GI_Liver_Segment_VI": {
    ta2: "Segmentum hepatis VI - Anterolaterale dextrum (TA2: 2526)",
    system: "System_Digestive",
    sysLabel: "Hepatobiliary / Couinaud Segment VI",
    func: "Posterior inferior subsegment of right hepatic lobe; bears renal impression from right kidney.",
    landmarks: "Inferolateral margin of right lobe, right renal impression, right colic angle.",
    clinical: "Most accessible segment for ultrasound-guided percutaneous liver biopsy."
  },
  "GI_Liver_Segment_VII": {
    ta2: "Segmentum hepatis VII - Posterolaterale dextrum (TA2: 2527)",
    system: "System_Digestive",
    sysLabel: "Hepatobiliary / Couinaud Segment VII",
    func: "Posterior superior subsegment of right hepatic lobe directly beneath diaphragmatic dome.",
    landmarks: "Superior right posterosuperior aspect, bare area of liver boundary.",
    clinical: "Challenging laparoscopic access; common site for solitary colorectal cancer metastasis."
  },
  "GI_Liver_Segment_VIII": {
    ta2: "Segmentum hepatis VIII - Posteromediale dextrum (TA2: 2528)",
    system: "System_Digestive",
    sysLabel: "Hepatobiliary / Couinaud Segment VIII",
    func: "Anterior superior subsegment of right hepatic lobe; occupies superior convexity under diaphragm dome.",
    landmarks: "Superior dome of right lobe, sits directly over middle and right hepatic veins.",
    clinical: "Complex surgical resection due to proximity to the confluence of middle and right hepatic veins with the IVC."
  },
  "GI_Gallbladder": {
    ta2: "Vesica biliaris (TA2: 2560)",
    system: "System_Digestive",
    sysLabel: "Hepatobiliary / Bile Storage",
    func: "Pear-shaped reservoir storing and concentrating hepatic bile up to 10-fold; contracts via cholecystokinin (CCK) stimulus during fatty meal ingestion.",
    landmarks: "Fundus (projects at right 9th costal cartilage / midclavicular line), body, neck, Hartmann's pouch, cystic duct.",
    clinical: "Cholelithiasis, acute cholecystitis (positive Murphy's sign), laparoscopic cholecystectomy in Calot's triangle (cystic artery identification)."
  },
  "GI_Bile_Ducts": {
    ta2: "Ductus biliares extrahepatici (TA2: 2570)",
    system: "System_Digestive",
    sysLabel: "Hepatobiliary / Biliary Conduit Tree",
    func: "Extrahepatic biliary conduit network routing bile from liver and gallbladder into descending duodenum.",
    landmarks: "Right and left hepatic ducts, common hepatic duct, cystic duct with spiral valves of Heister, common bile duct (choledochus), ampulla of Vater, sphincter of Oddi.",
    clinical: "Choledocholithiasis causing obstructive jaundice and ascending cholangitis (Charcot's triad); ERCP sphincterotomy."
  },
  "GI_Duodenum": {
    ta2: "Duodenum (TA2: 2470)",
    system: "System_Digestive",
    sysLabel: "Digestive / Foregut-Midgut Transition",
    func: "C-shaped 25-cm initial small bowel loop neutralizing acidic gastric chyme and receiving pancreatic juice and bile.",
    landmarks: "Superior (1st) duodenal bulb, descending (2nd) part with major duodenal papilla, horizontal (3rd) part crossing IVC/aorta, ascending (4th) part ending at ligament of Treitz.",
    clinical: "Duodenal peptic ulcers occur predominantly in 1st part; superior mesenteric artery (SMA) syndrome compresses 3rd part."
  },
  "GI_Pancreas": {
    ta2: "Pancreas (TA2: 2610)",
    system: "System_Digestive",
    sysLabel: "Digestive / Exocrine & Endocrine Gland",
    func: "Dual-function retroperitoneal gland: exocrine acini secrete digestive enzymes (lipase, amylase, proteases); endocrine islets of Langerhans secrete insulin, glucagon, somatostatin.",
    landmarks: "Head nestled in duodenal C-loop, uncinate process hooked beneath mesenteric vessels, neck, body, tail reaching splenic hilum.",
    clinical: "Pancreatic ductal adenocarcinoma with painless jaundice; acute necrotizing pancreatitis; Whipple procedure (pancreaticoduodenectomy)."
  },
  "GI_Jejunum": {
    ta2: "Jejunum (TA2: 2480)",
    system: "System_Digestive",
    sysLabel: "Digestive / Small Intestine Midgut",
    func: "Proximal 40% of post-duodenal small bowel; primary site of nutrient, carbohydrate, protein, and water-soluble vitamin absorption.",
    landmarks: "Thick vascular wall, tall closely packed plicae circulares (valves of Kerckring), long vasa recta with few arterial arcades, LUQ position.",
    clinical: "Celiac disease (gluten-sensitive enteropathy) with mucosal villous blunting; jejunal atresia in neonates ('triple bubble' sign)."
  },
  "GI_Ileum": {
    ta2: "Ileum (TA2: 2490)",
    system: "System_Digestive",
    sysLabel: "Digestive / Small Intestine Midgut",
    func: "Distal 60% of small intestine terminating at the ileocecal valve; specialized absorption of vitamin B12 (intrinsic factor complex) and conjugated bile acids.",
    landmarks: "Peyer's patches (aggregated lymphoid nodules in mucosa/submucosa), short vasa recta with multiple complex arterial arcades, fat-wrapped mesentery, RLQ position.",
    clinical: "Terminal ileitis in Crohn's disease; terminal ileal resection causing bile acid diarrhea and vitamin B12 deficiency; Meckel's diverticulum."
  },
  "GI_Cecum": {
    ta2: "Caecum (TA2: 2501)",
    system: "System_Digestive",
    sysLabel: "Digestive / Proximal Large Intestine",
    func: "Blind-ended pouch situated at ileocecal junction in right iliac fossa; initiates large bowel water absorption and bacterial fermentation.",
    landmarks: "Ileocecal valve (Bauhin's valve), convergence of three taeniae coli at appendiceal base, retrocecal peritoneal recess.",
    clinical: "Cecal volvulus; largest diameter in colon making it most vulnerable to perforation under high intraluminal pressure (Laplace's law)."
  },
  "GI_Appendix": {
    ta2: "Appendix vermiformis (TA2: 2505)",
    system: "System_Digestive",
    sysLabel: "Digestive / Gut-Associated Lymphoid Organ",
    func: "Blind tubular diverticulum rich in lymphoid follicles; acts as immune organ and bacterial reservoir for enteric microbiome recolonization.",
    landmarks: "Arises from posteromedial cecum 2 cm below ileocecal valve; mesoappendix containing appendicular artery (terminal branch of ileocolic artery).",
    clinical: "Acute appendicitis from fecalith obstruction presenting with periumbilical pain migrating to McBurney's point; open/laparoscopic appendectomy."
  },
  "GI_Colon_Ascending": {
    ta2: "Colon ascendens (TA2: 2502)",
    system: "System_Digestive",
    sysLabel: "Digestive / Large Intestine Hindgut",
    func: "Retroperitoneal colon segment ascending along right posterior abdominal wall; reabsorbs water and sodium.",
    landmarks: "Extends from cecum to right colic (hepatic) flexure, retroperitoneal fixation via Toldt's fascia, right paracolic gutter.",
    clinical: "Right-sided colon carcinoma typically presents with occult bleeding, chronic iron-deficiency anemia, and exophytic polypoid mass."
  },
  "GI_Colon_Transverse": {
    ta2: "Colon transversum (TA2: 2503)",
    system: "System_Digestive",
    sysLabel: "Digestive / Large Intestine Hindgut",
    func: "Longest and most mobile segment of the large intestine suspended by transverse mesocolon; facilitates fecal transit and drying.",
    landmarks: "Suspended between hepatic flexure and splenic flexure (phrenicocolic ligament), greater omentum attachment, middle colic artery vascular supply.",
    clinical: "Transverse colon volvulus; gastrocolic fistula in penetrating gastric ulcer."
  },
  "GI_Colon_Descending": {
    ta2: "Colon descendens (TA2: 2504)",
    system: "System_Digestive",
    sysLabel: "Digestive / Large Intestine Hindgut",
    func: "Secondarily retroperitoneal colon segment descending along left posterior abdominal flank into pelvic inlet.",
    landmarks: "Splenic flexure to pelvic brim, left paracolic gutter, left colic artery branches.",
    clinical: "Left-sided colon cancer presents with napkin-ring annular constriction causing bowel obstruction and altered bowel habits."
  },
  "GI_Colon_Sigmoid": {
    ta2: "Colon sigmoideum (TA2: 2508)",
    system: "System_Digestive",
    sysLabel: "Digestive / Large Intestine Hindgut",
    func: "S-shaped mobile intraperitoneal loop storing formed fecal matter prior to passage into the rectum.",
    landmarks: "Suspended by inverted V-shaped sigmoid mesocolon (crossing left ureter and iliac bifurcation), terminates at S3 rectosigmoid junction.",
    clinical: "Diverticulosis and acute diverticulitis ('left-sided appendicitis'); sigmoid volvulus with classic 'coffee bean' radiologic sign."
  },
  "GI_Taeniae_Coli": {
    ta2: "Taeniae coli (TA2: 2515)",
    system: "System_Digestive",
    sysLabel: "Digestive / Colonic Muscular Bands",
    func: "Three distinct narrow bands of longitudinal smooth muscle (taenia libera, taenia omentalis, taenia mesocolica) running along the colon surface; tonic contraction bunches colon into sacculations (haustra).",
    landmarks: "Originate at appendiceal base on cecum, run entire length of colon, fuse at rectosigmoid junction to form continuous longitudinal rectal coat.",
    clinical: "Surgical guide for locating appendix base during appendectomy; absence in Hirschsprung's aganglionic megacolon segment."
  },
  "GI_Rectum": {
    ta2: "Rectum (TA2: 2510)",
    system: "System_Digestive",
    sysLabel: "Digestive / Pelvic Terminal Reservoir",
    func: "12-15 cm fixed retroperitoneal pelvic reservoir storing feces until defecation reflex is triggered by rectal wall stretch.",
    landmarks: "Begins at S3 level, sacral flexure, lateral flexures corresponding to internal transverse rectal folds (valves of Houston), rectal ampulla.",
    clinical: "Total mesorectal excision (TME) surgical standard for rectal cancer; digital rectal examination (DRE) palpating prostate and rectal wall masses."
  },
  "GI_Anal_Canal": {
    ta2: "Canalis analis (TA2: 2520)",
    system: "System_Digestive",
    sysLabel: "Digestive / Terminal Anorectal Conduit",
    func: "Final 3-4 cm segment of the digestive tract traversing the pelvic floor to external anal orifice; coordinates fecal continence and evacuation.",
    landmarks: "Anal columns of Morgagni, anal valves, anal crypts, pectinate (dentate) line, anocutaneous line (Hilton's white line).",
    clinical: "Pectinate line demarcates visceral (endoderm) vs somatic (ectoderm) neurovascular zones: internal hemorrhoids (painless) vs external hemorrhoids (painful)."
  },
  "GI_Sphincter_Ani_Externus": {
    ta2: "Musculus sphincter ani externus (TA2: 2526)",
    system: "System_Digestive",
    sysLabel: "Digestive / Voluntary Continence Sphincter",
    func: "Striated voluntary skeletal muscle ring enclosing anal canal; provides conscious emergency contraction to maintain fecal continence.",
    landmarks: "Three parts (subcutaneous, superficial attached to anococcygeal body, deep blending with puborectalis), pudendal nerve innervation (S2-S4).",
    clinical: "Obstetric perineal lacerations (3rd/4th degree tears); pudendal nerve injury during difficult labor causing fecal incontinence."
  },
  "GI_Sphincter_Ani_Internus": {
    ta2: "Musculus sphincter ani internus (TA2: 2525)",
    system: "System_Digestive",
    sysLabel: "Digestive / Involuntary Resting Sphincter",
    func: "Smooth muscle cylinder formed by thickened circular coat of the rectum; maintains tonic baseline closure accounting for 70-80% of resting anal continence pressure.",
    landmarks: "Upper two-thirds of anal canal, autonomic innervation (sympathetic hypogastric plexus maintains tone; parasympathetic relaxes during rectoanal inhibitory reflex).",
    clinical: "Chronic anal fissure treated by lateral internal sphincterotomy (LIS); high resting pressures causing mucosal ischemia."
  },

  // ============================================================================
  // CARDIOVASCULAR PERIPHERAL VASCULAR TREES (184 VESSELS)
  // ============================================================================
  "Vascular_Arterial_HeadNeck": {
    ta2: "Arteriae capitis et colli (TA2: 4130)",
    system: "System_Cardiovascular",
    sysLabel: "Cardiovascular / Cranial & Cervical Arteries",
    func: "Conveys high-pressure oxygenated blood from aortic arch and brachiocephalic trunk to the brain, cranium, face, and cervical organs.",
    landmarks: "Common carotid arteries, internal carotid arteries (Circle of Willis), external carotid branches (facial, maxillary, superficial temporal), vertebral arteries (basilar trunk).",
    clinical: "Carotid endarterectomy for atherosclerotic stenosis to prevent ischemic stroke; temporal arteritis (giant cell arteritis) biopsy site."
  },
  "Vascular_Arterial_UpperLimb": {
    ta2: "Arteriae membri superioris (TA2: 4180)",
    system: "System_Cardiovascular",
    sysLabel: "Cardiovascular / Upper Limb Arterial Tree",
    func: "Distributes arterial perfusion from subclavian and axillary trunks down to digital palmar arches.",
    landmarks: "Subclavian artery, axillary artery, brachial artery (blood pressure auscultation), radial artery, ulnar artery, superficial/deep palmar arches.",
    clinical: "Radial artery arterial line cannulation and coronary angiography access; Allen's test for palmar collateral adequacy."
  },
  "Vascular_Arterial_AbdomenPelvis": {
    ta2: "Arteriae abdominis et pelvis (TA2: 4220)",
    system: "System_Cardiovascular",
    sysLabel: "Cardiovascular / Splanchnic & Pelvic Arteries",
    func: "Branches from abdominal aorta supplying visceral organs (celiac trunk, SMA, IMA, renal arteries) and pelvic organs/gluteal musculature via internal/external iliac arteries.",
    landmarks: "Celiac trunk (hepatic, splenic, left gastric), superior mesenteric artery, inferior mesenteric artery, bilateral renal arteries, common iliac bifurcation (L4).",
    clinical: "Abdominal aortic aneurysm (AAA) repair; acute mesenteric ischemia from superior mesenteric artery thromboembolism."
  },
  "Vascular_Arterial_LowerLimb": {
    ta2: "Arteriae membri inferioris (TA2: 4280)",
    system: "System_Cardiovascular",
    sysLabel: "Cardiovascular / Lower Limb Arterial Tree",
    func: "Carries systemic arterial supply from femoral artery down to plantar arches of the foot.",
    landmarks: "Femoral artery (midinguinal point), deep femoral (profunda femoris), popliteal artery (popliteal fossa), anterior tibial, posterior tibial, dorsalis pedis.",
    clinical: "Peripheral artery disease (PAD) with intermittent claudication; dorsalis pedis and posterior tibial pulse palpation for vascular status."
  },
  "Vascular_Venous_HeadNeck": {
    ta2: "Venae capitis et colli (TA2: 4430)",
    system: "System_Cardiovascular",
    sysLabel: "Cardiovascular / Cranial & Cervical Veins",
    func: "Drains deoxygenated venous blood from dural venous sinuses, face, and neck down into brachiocephalic veins and SVC.",
    landmarks: "Internal jugular vein (exits jugular foramen), external jugular vein (superficial to SCM), anterior jugular, facial vein.",
    clinical: "Internal jugular vein ultrasound-guided central line catheterization; external jugular vein distension in congestive heart failure."
  },
  "Vascular_Venous_UpperLimb": {
    ta2: "Venae membri superioris (TA2: 4480)",
    system: "System_Cardiovascular",
    sysLabel: "Cardiovascular / Upper Limb Venous Drainage",
    func: "Superficial and deep venous drainage network of arm and hand returning blood to axillary and subclavian veins.",
    landmarks: "Cephalic vein (lateral arm), basilic vein (medial arm), median cubital vein (cubital fossa), paired venae comitantes of deep arteries.",
    clinical: "Median cubital vein is the premier site for routine routine clinical venipuncture and peripheral IV cannulation."
  },
  "Vascular_Venous_AbdomenPelvis": {
    ta2: "Venae abdominis et pelvis (TA2: 4520)",
    system: "System_Cardiovascular",
    sysLabel: "Cardiovascular / Caval & Portal Venous Systems",
    func: "Dual venous drainage: inferior vena cava system draining lower body and kidneys; hepatic portal system draining GI tract to the liver for metabolic processing.",
    landmarks: "Inferior vena cava, hepatic veins (right, middle, left), hepatic portal vein (formed by SMV and splenic vein), renal veins, common iliac veins.",
    clinical: "Portosystemic anastomoses (esophageal varices, caput medusae, hemorrhoids) opening in cirrhosis; IVC filter placement for DVT."
  },
  "Vascular_Venous_LowerLimb": {
    ta2: "Venae membri inferioris (TA2: 4580)",
    system: "System_Cardiovascular",
    sysLabel: "Cardiovascular / Lower Limb Venous Tree",
    func: "Returns blood from foot and calf against gravity to femoral vein via muscular pump mechanisms and one-way venous bicuspid valves.",
    landmarks: "Great saphenous vein (anterior to medial malleolus, ascends medial thigh to saphenofemoral junction), small saphenous vein, femoral and popliteal veins.",
    clinical: "Deep vein thrombosis (DVT) risk causing pulmonary embolism; great saphenous vein harvesting for coronary artery bypass grafting (CABG); varicose veins."
  },

  // ============================================================================
  // NERVOUS SYSTEM - PERIPHERAL & CRANIAL NETWORKS (257 NERVES)
  // ============================================================================
  "Nervous_Cranial_Nerves": {
    ta2: "Nervi craniales I–XII (TA2: 5400)",
    system: "System_Nervous",
    sysLabel: "Nervous / Cranial Nerves CN I–XII",
    func: "12 pairs of peripheral nerves originating directly from cerebrum and brainstem; provide sensory and motor innervation to head, neck, and viscera.",
    landmarks: "CN I (Olfactory), CN II (Optic), CN III (Oculomotor), CN IV (Trochlear), CN V (Trigeminal V1/V2/V3), CN VI (Abducens), CN VII (Facial), CN VIII (Vestibulocochlear), CN IX (Glossopharyngeal), CN X (Vagus), CN XI (Accessory), CN XII (Hypoglossal).",
    clinical: "Comprehensive 12-nerve clinical neurological exam; Bell's palsy (CN VII); trigeminal neuralgia; acoustic neuroma (CN VIII vestibular schwannoma)."
  },
  "Nervous_Brachial_Plexus": {
    ta2: "Plexus brachialis (TA2: 5600)",
    system: "System_Nervous",
    sysLabel: "Nervous / Brachial Somatic Plexus",
    func: "Somatic nerve network formed by anterior rami of C5-T1 spinal nerves; provides complete motor and sensory innervation to shoulder girdle and upper limb.",
    landmarks: "5 Roots (C5-T1), 3 Trunks (Upper, Middle, Lower), 6 Divisions (3 anterior, 3 posterior), 3 Cords (Lateral, Posterior, Medial).",
    clinical: "Erb-Duchenne palsy (upper trunk C5-C6 injury, 'waiter's tip' hand); Klumpke palsy (lower trunk C8-T1 injury, claw hand); interscalene nerve block."
  },
  "Nervous_UpperLimb_Nerves": {
    ta2: "Nervi membri superioris (TA2: 5650)",
    system: "System_Nervous",
    sysLabel: "Nervous / Upper Limb Peripheral Nerves",
    func: "Terminal peripheral branches of the brachial plexus innervating arm, forearm, and hand musculature and dermatomes.",
    landmarks: "Musculocutaneous nerve, axillary nerve (surgical neck of humerus), radial nerve (spiral groove), median nerve (carpal tunnel), ulnar nerve (cubital tunnel / funny bone).",
    clinical: "Radial nerve palsy causing wrist drop; median nerve compression in carpal tunnel syndrome; ulnar nerve entrapment causing claw hand."
  },
  "Nervous_Lumbosacral_Plexus": {
    ta2: "Plexus lumbosacralis (TA2: 5700)",
    system: "System_Nervous",
    sysLabel: "Nervous / Lumbosacral Plexus",
    func: "Network formed by L1-S4 anterior rami providing motor and sensory innervation to lower abdomen, pelvis, perineum, and lower extremity.",
    landmarks: "Lumbar plexus (L1-L4) in psoas major; Sacral plexus (L4-S4) on piriformis; femoral, obturator, and sciatic roots.",
    clinical: "Psoas compartment block; meralgia paresthetica (lateral femoral cutaneous nerve compression); sacral plexopathy."
  },
  "Nervous_LowerLimb_Nerves": {
    ta2: "Nervi membri inferioris (TA2: 5750)",
    system: "System_Nervous",
    sysLabel: "Nervous / Lower Limb Peripheral Nerves",
    func: "Major peripheral nerve trunks innervating pelvis, thigh, leg, and foot musculature and cutaneous dermatomes.",
    landmarks: "Femoral nerve (femoral triangle), obturator nerve (obturator canal), sciatic nerve (greater sciatic foramen under piriformis), tibial nerve, common fibular (peroneal) nerve (fibula neck).",
    clinical: "Common fibular nerve injury at fibular neck causing foot drop; sciatica radiating down posterior leg from L5-S1 nerve root compression."
  },
  "Nervous_Sympathetic_Trunk": {
    ta2: "Truncus sympathicus (TA2: 5900)",
    system: "System_Nervous",
    sysLabel: "Nervous / Autonomic Sympathetic Chain",
    func: "Paired ganglionated nerve chain extending from skull base to coccyx; drives systemic 'fight-or-flight' autonomic responses (tachycardia, bronchodilation, vasoconstriction).",
    landmarks: "Superior, middle, and stellate (cervicothoracic) ganglia; thoracic paravertebral chain; splanchnic nerves (greater, lesser, least); ganglion impar over coccyx.",
    clinical: "Horner syndrome (ptosis, miosis, anhidrosis) from apical lung tumor (Pancoast) compressing stellate ganglion; endoscopic thoracic sympathectomy for hyperhidrosis."
  },
  "Nervous_Trunk_Nerves": {
    ta2: "Nervi thoracici et abdominis (TA2: 5850)",
    system: "System_Nervous",
    sysLabel: "Nervous / Thoracoabdominal & Intercostal Nerves",
    func: "Anterior rami of T1-T11 spinal nerves traversing costal grooves to innervate intercostal muscles, thoracic wall, and abdominal wall.",
    landmarks: "Intercostal neurovascular bundle (Vein-Artery-Nerve, VAN) along inferior costal margin; subcostal nerve (T12); phrenic nerve (C3-C5 to diaphragm).",
    clinical: "Herpes zoster (shingles) dermatomal distribution; intercostal nerve block for rib fractures or post-thoracotomy analgesia; phrenic nerve palsy."
  },

  // ----------------------------------------------------------------------------
  // AUDITORY APPARATUS & OSSICULAR MECHANISM (TA2 ENTRIES)
  // ----------------------------------------------------------------------------
  "Auditory_Tympanic_Membrane": {
    ta2: "Membrana tympanica (TA2: 6695)",
    system: "System_Endocrine",
    sysLabel: "Auditory / Special Sensory",
    func: "Conical fibrous acoustic transducer (~55 mm2 effective area) converting aerial acoustic pressure waves into mechanical vibrations.",
    landmarks: "Umbo (manubrial attachment), Pars flaccida (Shrapnell membrane), Pars tensa, Cone of light, Annulus fibrocartilagineus.",
    clinical: "Myringotomy for otitis media, tympanic membrane perforation (conductive hearing loss), tympanometry peak compliance."
  },
  "Auditory_Malleus": {
    ta2: "Malleus (TA2: 6702)",
    system: "System_Endocrine",
    sysLabel: "Auditory / Auditory Ossicles",
    func: "Hammer-shaped lateral ossicle transmitting vibration from the tympanic membrane to the incus via incudomalleolar joint.",
    landmarks: "Caput mallei (head), Collum mallei (neck), Manubrium mallei (handle embedded in eardrum), Processus lateralis, Processus anterior.",
    clinical: "Incudomalleolar fixation in tympanosclerosis; tensor tympani muscle attenuation reflex prevents acoustic trauma."
  },
  "Auditory_Incus": {
    ta2: "Incus (TA2: 6710)",
    system: "System_Endocrine",
    sysLabel: "Auditory / Auditory Ossicles",
    func: "Anvil-shaped intermediate ossicle providing the fulcrum for the 1.3:1 acoustic lever mechanical advantage.",
    landmarks: "Corpus incudis (body), Crus breve (short process), Crus longum (long process), Processus lenticularis (articulates with stapes head).",
    clinical: "Incus necrosis secondary to chronic suppurative otitis media or cholesteatoma; incus interposition graft reconstruction."
  },
  "Auditory_Stapes": {
    ta2: "Stapes (TA2: 6717)",
    system: "System_Endocrine",
    sysLabel: "Auditory / Auditory Ossicles",
    func: "Stirrup-shaped medial ossicle delivering concentrated mechanical force (17:1 area hydraulic pressure ratio + 1.3:1 lever = ~22:1 impedance match) directly to the oval window.",
    landmarks: "Caput stapedis (head), Crus anterius, Crus posterius, Basis stapedis (footplate ~3.2 mm2 resting on fenestra vestibuli).",
    clinical: "Otosclerosis (calcification/fixation of stapes footplate causing conductive hearing loss); stapedectomy and fluoroplastic piston prosthetic replacement."
  },
  "Auditory_Cochlea": {
    ta2: "Cochlea (TA2: 6750)",
    system: "System_Endocrine",
    sysLabel: "Auditory / Inner Ear (Labyrinth)",
    func: "Fluid-filled spiral osseous and membranous canal (2.5 turns around modiolus) performing mechanical tonotopic frequency decomposition (20 Hz at apex to 20,000 Hz at base).",
    landmarks: "Modiolus, Lamina spiralis ossea, Scala vestibuli (perilymph), Scala tympani (perilymph), Ductus cochlearis (endolymph), Helicotrema.",
    clinical: "Sensorineural hearing loss, presbycusis (high-frequency hair cell degradation), Cochlear implant electrode array insertion through round window."
  },
  "Auditory_Vestibule_Canals": {
    ta2: "Vestibulum et Canales semicirculares ossei (TA2: 6736, 6742)",
    system: "System_Endocrine",
    sysLabel: "Vestibular / Inner Ear Balance Apparatus",
    func: "3 orthogonal semicircular canals (anterior, posterior, lateral) and otolith organs (utricle, saccule) detecting angular and linear acceleration.",
    landmarks: "Canalis semicircularis anterior, posterior, lateralis; Ampullae membranaceae, Utriculus, Sacculus, Fenestra vestibuli (oval window).",
    clinical: "Benign Paroxysmal Positional Vertigo (BPPV / canalithiasis treated with Epley maneuver), Meniere disease (endolymphatic hydrops)."
  },
  "Auditory_Cochlear_Nerve": {
    ta2: "Nervus vestibulocochlearis [CN VIII] - Pars cochlearis (TA2: 6310)",
    system: "System_Endocrine",
    sysLabel: "Special Sensory Cranial Nerve",
    func: "Transmits tonotopically organized action potentials from organ of Corti spiral ganglion neurons to cochlear nuclei in rostral medulla / pontomedullary junction.",
    landmarks: "Internal acoustic meatus, Spiral ganglion of Corti, Cerebellopontine angle cistern.",
    clinical: "Vestibular schwannoma (acoustic neuroma) in cerebellopontine angle causing unilateral sensorineural hearing loss and tinnitus."
  },

  // ----------------------------------------------------------------------------
  // CORONARY ATHEROSCLEROSIS, STENTING & CABG BYPASS (TA2 ENTRIES)
  // ----------------------------------------------------------------------------
  "Cardio_Coronary_LAD_Healthy": {
    ta2: "Ramus interventricularis anterior arteriae coronariae sinistrae (TA2: 4005)",
    system: "System_Cardiovascular",
    sysLabel: "Cardiovascular / Left Anterior Descending Artery",
    func: "Principal coronary conduit ('widow-maker artery') supplying ~50% of left ventricular myocardium, apex, and anterior 2/3 of interventricular septum.",
    landmarks: "Anterior interventricular sulcus, diagonal branches (D1, D2), septal perforators, terminal apical loop.",
    clinical: "Primary target of percutaneous coronary intervention (PCI); critical LAD stenosis causes anterior wall STEMI with high mortality."
  },
  "Cardio_Coronary_Plaque_Stenosis": {
    ta2: "Atheroma arteriae coronariae (ICD-11: BA80 / Robbins Path)",
    system: "System_Cardiovascular",
    sysLabel: "Cardiovascular / Atherosclerotic Plaque (80% Stenosis)",
    func: "Eccentric fibrofatty intimal lesion consisting of a soft lipid-rich necrotic core (cholesterol crystals, foam cells) covered by a fibrous collagen cap.",
    landmarks: "Fibrous cap, necrotic lipid core, intraplaque neovascularization, calcification, critical 80% luminal area reduction.",
    clinical: "Plaque rupture triggers platelet aggregation and acute luminal thrombosis, causing unstable angina or acute transmural myocardial infarction."
  },
  "Cardio_Coronary_Balloon_Angioplasty": {
    ta2: "Angioplastia coronaria transluminalis percutanea (PTCA / MeSH: D015908)",
    system: "System_Cardiovascular",
    sysLabel: "Interventional Hardware / Semi-Compliant PTCA Balloon",
    func: "Polyethylene terephthalate (PET) balloon inflated to 10-16 atmospheres to fracture rigid fibrocalcific plaque and expand the metallic stent scaffold.",
    landmarks: "Tapered distal/proximal shoulders, radio-opaque gold marker bands, delivery catheter shaft (0.014-inch guidewire compatibility).",
    clinical: "Balloon pre-dilatation restores initial channel; high-pressure post-dilatation ensures full stent apposition against arterial wall without edge dissection."
  },
  "Cardio_Coronary_Stent_CobaltChromium": {
    ta2: "Prosthesis vascularis stent coronaria (MeSH: D054855 / Drug-Eluting Stent)",
    system: "System_Cardiovascular",
    sysLabel: "Interventional Hardware / Cobalt-Chromium DES Stent",
    func: "Balloon-expandable metallic tubular scaffold with sinusoidal diamond struts (strut thickness ~80 um) eluting antiproliferative drugs (everolimus/zotarolimus).",
    landmarks: "Sinusoidal strut crowns, flexible inter-ring connectors, durable fluoropolymer drug matrix, expanded diamond cellular architecture.",
    clinical: "Prevents acute vessel recoil and reduces neointimal hyperplasia / in-stent restenosis to <5%; requires dual antiplatelet therapy (DAPT: aspirin + P2Y12 inhibitor)."
  },
  "Cardio_Bypass_LIMA_Graft": {
    ta2: "Arteria thoracica interna sinistra - Insitio bypass (TA2: 4120 / CABG)",
    system: "System_Cardiovascular",
    sysLabel: "Surgical Reconstruction / LIMA-to-LAD In Situ Arterial Graft",
    func: "Gold-standard pedicled arterial conduit mobilized from the left anterior chest wall and anastomosed end-to-side to LAD distal to stenosis.",
    landmarks: "Subclavian origin, sternal pleural pedicle, bevelled graft heel, continuous 7-0 or 8-0 polypropylene running microvascular suture anastomosis.",
    clinical: "Superior long-term patency (>90% at 10-15 years) due to active endothelial nitric oxide synthase (eNOS) production; resistant to atherosclerosis."
  },
  "Cardio_Bypass_Saphenous_Graft": {
    ta2: "Vena saphena magna - Insitio aortocoronaria (TA2: 5210 / SVG CABG)",
    system: "System_Cardiovascular",
    sysLabel: "Surgical Reconstruction / Reverse Saphenous Vein Graft (SVG)",
    func: "Free autologous venous conduit harvested from lower extremity, reversed (valvular orientation) to bypass ascending aorta directly to diagonal/circumflex branches.",
    landmarks: "Aortic punch aortotomy hood, continuous 6-0 polypropylene proximal aortic anastomosis, distal coronary arteriotomy anastomosis.",
    clinical: "Susceptible to accelerated vein graft atheroma and intimal hyperplasia (~50% occlusion at 10 years); antiplatelet and high-intensity statin therapy required."
  },
  "Cardio_Aorta_Root": {
    ta2: "Radix aortae et Aorta ascendens (TA2: 3990)",
    system: "System_Cardiovascular",
    sysLabel: "Cardiovascular / Ascending Aorta Root",
    func: "Primary systemic outflow vessel receiving oxygenated blood from left ventricle; provides ostial inflow to native coronaries and proximal CABG anastomoses.",
    landmarks: "Sinuses of Valsalva, sinotubular junction, ascending aorta anterior wall, SVG aortic anastomosis site.",
    clinical: "Site of partial-occlusion side-biting vascular clamp during proximal CABG anastomosis; ascending aortic dissection (Stanford type A)."
  },
  "Cardio_Myocardium_Bed": {
    ta2: "Myocardium ventriculi sinistri (TA2: 3968)",
    system: "System_Cardiovascular",
    sysLabel: "Cardiovascular / Ventricular Myocardium",
    func: "Thick muscular syncytium of striated cardiac myocytes driving left ventricular contractile ejection during systole.",
    landmarks: "Anterior left ventricular free wall, interventricular septum junction, subepicardial fat pad, epicardial coronary capillary bed.",
    clinical: "Ischemic territory at risk during LAD occlusion; collateral revascularization via CABG restores metabolic perfusion and salvages hibernating myocardium."
  },

  // ----------------------------------------------------------------------------
  // PULMONARY MICRO-ANATOMY & ALVEOLAR GAS EXCHANGE (TA2 ENTRIES)
  // ----------------------------------------------------------------------------
  "Pulmo_Airway_TerminalBronchiole": {
    ta2: "Bronchiolus terminalis (TA2: 3230)",
    system: "System_Respiratory",
    sysLabel: "Respiratory / Terminal Bronchiole (Conducting Airway)",
    func: "Final segment of the conducting airway (<1 mm caliber); lined by simple ciliated columnar epithelium and non-ciliated Club cells (Clara cells); wrapped by spiraling smooth muscle rings without hyaline cartilage plates.",
    landmarks: "Bronchiolar lumen, smooth muscle sphincter coat, Club cell secretory dome, bifurcation into respiratory bronchioles.",
    clinical: "Target of intense smooth muscle bronchoconstriction in asthma (reversible airflow obstruction) and bronchiolitis obliterans."
  },
  "Pulmo_Airway_RespiratoryBronchiole": {
    ta2: "Bronchiolus respiratorius (TA2: 3235)",
    system: "System_Respiratory",
    sysLabel: "Respiratory / Respiratory Bronchiole (Transitional Airway)",
    func: "First site of microscopic gas exchange in the bronchial tree; exhibits transitional cuboidal epithelium with scattered single alveoli outpouching directly from its lateral walls.",
    landmarks: "Transitional epithelial lining, scattered alveolar outpouchings, interstitial elastic fiber network.",
    clinical: "Primary site of tissue destruction in Centriacinar (Centrilobular) Emphysema, predominantly affecting cigarette smokers and upper lung lobes."
  },
  "Pulmo_Airway_AlveolarDuct": {
    ta2: "Ductus alveolaris (TA2: 3240)",
    system: "System_Respiratory",
    sysLabel: "Respiratory / Alveolar Duct & Sphincters",
    func: "Elongated corridor completely surrounded by alveolar openings; contains spiraling smooth muscle bundles ('alveolar knobs') at the entrances of individual alveoli.",
    landmarks: "Alveolar entrance rings, smooth muscle sphincteric knobs, terminal transition into alveolar sacs.",
    clinical: "Smooth muscle tone regulates local ventilation-perfusion matching (V/Q ratio); susceptible to chronic inflammatory remodeling in COPD."
  },
  "Pulmo_Alveolus_HealthySac": {
    ta2: "Sacculus alveolaris / Alveoli pulmonis (TA2: 3250)",
    system: "System_Respiratory",
    sysLabel: "Respiratory / Alveolar Sac & Collateral Pores",
    func: "Polyhedral cluster of terminal functional gas-exchange units (~200 um diameter); provides ~70-100 m² of total surface area in healthy adult lungs; inter-alveolar septa feature Pores of Kohn for collateral airflow.",
    landmarks: "Alveolar cluster dome, interalveolar septa, Pores of Kohn (8 um apertures), delicate reticular fiber basket.",
    clinical: "Collateral ventilation via Pores of Kohn prevents atelectasis distal to obstructed bronchioles but also facilitates the intra-lobar spread of lobar pneumonia (Streptococcus pneumoniae)."
  },
  "Pulmo_Alveolus_CutawayLumen": {
    ta2: "Septum interalveolare et Cavitas alveolaris (TA2: 3252)",
    system: "System_Respiratory",
    sysLabel: "Respiratory / Alveolar Lumen & Blood-Air Barrier",
    func: "Anatomical 180° cross-section revealing the internal alveolar cavity and ultra-thin respiratory membrane (0.2-0.5 um) comprising alveolar epithelium, fused basal lamina, and capillary endothelium.",
    landmarks: "Alveolar lumen, concave septal wall, fused basement membrane, endothelial interface.",
    clinical: "Fick's law dictates rapid O2/CO2 diffusion across the 0.2-0.5 um barrier; pathologically thickened in pulmonary fibrosis, ARDS, and hydrostatic pulmonary edema."
  },
  "Pulmo_Cell_Pneumocyte_Type1": {
    ta2: "Pneumocytus typus I / Epitheliocytus respiratorius (TA2: 3255)",
    system: "System_Respiratory",
    sysLabel: "Histology / Type I Alveolar Pneumocyte",
    func: "Extremely attenuated squamous epithelial cells covering ~95% of the total alveolar surface area; cytoplasm stretched to 0.1-0.2 um thickness to minimize the diffusion distance for gas exchange.",
    landmarks: "Attenuated cytoplasmic plates, central nuclear protrusion, tight junctions (zonulae occludentes).",
    clinical: "Vulnerable to toxic, viral, and ischemic injury; unable to divide or self-replicate; damaged Type I cells must be replaced by proliferating and differentiating Type II pneumocytes."
  },
  "Pulmo_Cell_Pneumocyte_Type2": {
    ta2: "Pneumocytus typus II / Epitheliocytus granulosus (TA2: 3260)",
    system: "System_Respiratory",
    sysLabel: "Histology / Type II Pneumocyte (Surfactant Factory)",
    func: "Cuboidal secretory cells nestled in alveolar septal angles; synthesize and secrete pulmonary surfactant (dipalmitoylphosphatidylcholine - DPPC) stored in intracellular lamellar bodies; act as stem cell progenitors for Type I cells.",
    landmarks: "Cuboidal cell body, apical microvilli, lamellar secretory bodies, alveolar macrophage (dust cell) neighbor.",
    clinical: "Surfactant reduces surface tension (Laplace's Law: P=2T/r), preventing small alveoli from collapsing at end-expiration; deficiency causes Infant Respiratory Distress Syndrome (IRDS / Hyaline Membrane Disease) in premature infants."
  },
  "Pulmo_Capillary_Plexus_Diffusion": {
    ta2: "Plexus capillaris alveolaris (TA2: 3265)",
    system: "System_Cardiovascular",
    sysLabel: "Microcirculation / Alveolar Capillary Plexus",
    func: "Dense anastomosing vascular basket enveloping the alveolus like a continuous sheet of blood; receives deoxygenated blood from terminal pulmonary arterioles and returns fully oxygenated scarlet blood to pulmonary venules.",
    landmarks: "Pulmonary arteriole inlet (deoxygenated), anastomotic capillary meshwork, pulmonary venule outlet (oxygenated).",
    clinical: "Transit time through the capillary bed is ~0.75 seconds (reduced to 0.25s during heavy exercise); complete O2 equilibration occurs within the first 0.25s in healthy lungs, providing huge diffusion reserve."
  },
  "Pulmo_Pathology_Emphysema_Bullae": {
    ta2: "Emphysema pulmonum panacinaris / bullosum (ICD-11: CA22 / Robbins Path)",
    system: "System_Respiratory",
    sysLabel: "Pathology / Emphysematous Bulla (COPD)",
    func: "Permanent abnormal enlargement of respiratory airspaces distal to terminal bronchioles with extensive proteolytic destruction of interalveolar septa by neutrophil elastase (exceeding alpha-1 antitrypsin antiprotease defense).",
    landmarks: "Confluent hyperinflated bullous airspace, necrotic septal stumps, destroyed capillary beds, loss of elastic tethering.",
    clinical: "Marked reduction in alveolar diffusing capacity (DLCO), loss of elastic recoil causing expiratory air trapping, hyperinflation ('barrel chest'), and 'pink puffer' presentation in severe COPD."
  },

  // ----------------------------------------------------------------------------
  // RENAL GLOMERULUS, FILTRATION BARRIER & JGA (TA2 ENTRIES)
  // ----------------------------------------------------------------------------
  "Renal_Arteriole_Afferent": {
    ta2: "Arteriola glomerularis afferens (TA2: 3410)",
    system: "System_Renal",
    sysLabel: "Renal / Afferent Glomerular Arteriole",
    func: "High-compliance muscular resistance conduit delivering oxygenated cortical blood from interlobular (cortical radiate) arteries directly into the glomerular capillary tuft; regulates renal blood flow and glomerular filtration rate via myogenic autoregulation and tubuloglomerular feedback.",
    landmarks: "Vascular pole entrance, tunica media with renin-positive granular juxtaglomerular cells, internal elastic lamina, vascular smooth muscle rings.",
    clinical: "Preferential vasodilatation by prostaglandins (PGE2, PGI2) maintains GFR; NSAIDs block prostaglandin synthesis causing afferent vasoconstriction and precipitating acute pre-renal azotemia and acute kidney injury (AKI)."
  },
  "Renal_Arteriole_Efferent": {
    ta2: "Arteriola glomerularis efferens (TA2: 3412)",
    system: "System_Renal",
    sysLabel: "Renal / Efferent Glomerular Arteriole (Resistance Gate)",
    func: "Narrower, high-resistance post-glomerular outlet vessel draining capillary blood toward peritubular capillary plexuses (cortical nephrons) or vasa recta hairpins (juxtamedullary nephrons); regulates intraglomerular capillary hydrostatic pressure (P_GC ~55 mmHg).",
    landmarks: "Vascular pole exit cleft, narrower vascular caliber, peritubular capillary transition.",
    clinical: "Preferential vasoconstriction by Angiotensin II maintains GFR during systemic hypotension; ACE inhibitors and Angiotensin Receptor Blockers (ARBs) dilate efferent arterioles, reducing intraglomerular hypertension and slowing diabetic nephropathy progression."
  },
  "Renal_Glomerulus_CapillaryTuft": {
    ta2: "Glomerulus / Rete capillare glomerulare (TA2: 3405)",
    system: "System_Renal",
    sysLabel: "Renal / Glomerular Capillary Tuft & Mesangium",
    func: "Highly specialized anastomosing lobular capillary network suspended between two arterioles; generates ~180 liters of primary ultrafiltrate daily driven by high net ultrafiltration pressure (P_UF = P_GC - P_BS - pi_GC). Mesangial cells provide structural axial support, phagocytic debris clearance, and contractile tone.",
    landmarks: "Lobular capillary loops, central mesangial stalks, vascular pole origin, urinary pole outflow.",
    clinical: "Target of immune-complex deposition in post-streptococcal glomerulonephritis, lupus nephritis (wire-loop lesions), and anti-GBM (Goodpasture) disease presenting with hematuria, RBC casts, and nephritic syndrome."
  },
  "Renal_Glomerulus_EndotheliumFenestrated": {
    ta2: "Endothelium fenestratum capillaris glomerularis (TA2: 3406)",
    system: "System_Renal",
    sysLabel: "Histology / Fenestrated Glomerular Endothelium",
    func: "Innermost cellular layer of the glomerular filtration barrier; characterized by dense arrays of transcellular circular pores (fenestrae, 70-100 nm diameter) lacking diaphragm seals; coated by negatively charged luminal glycocalyx (syndecans, podocalyxin, sialic acid) repelling circulating erythrocytes, leukocytes, and platelets.",
    landmarks: "Attenuated endothelial cytoplasm, transcellular fenestrae sieve plate, endothelial glycocalyx lumen interface.",
    clinical: "Endothelial glycocalyx shedding occurs in sepsis, preeclampsia (glomerular endotheliosis with swollen endothelial cells obliterating capillary lumens), and thrombotic microangiopathies (HUS/TTP)."
  },
  "Renal_Membrane_GBM": {
    ta2: "Membrana basalis glomerularis (TA2: 3407)",
    system: "System_Renal",
    sysLabel: "Ultrastructure / Glomerular Basement Membrane (GBM)",
    func: "Thick fused trilaminar extracellular matrix (300-350 nm) composed of lamina rara interna, lamina densa, and lamina rara externa; synthesized jointly by podocytes and endothelial cells; composed of Type IV collagen (alpha-3, alpha-4, alpha-5 chains), laminin-521, nidogen, and negatively charged heparan sulfate proteoglycans (agrin, perlecan) forming a crucial electrostatic and molecular sieve barrier.",
    landmarks: "Trilaminar basement membrane, lamina densa central core, subendothelial and subepithelial zones.",
    clinical: "Alport syndrome (X-linked mutation in COL4A5 causing split, 'basket-weave' lamina densa and progressive renal failure with sensorineural deafness); Goodpasture syndrome (autoantibodies targeting the NC1 domain of alpha-3 Type IV collagen causing rapidly progressive crescentic glomerulonephritis and pulmonary hemorrhage).",
  },
  "Renal_Cell_Podocyte_Pedicels": {
    ta2: "Podocytus / Pedicelli podocyti (TA2: 3408)",
    system: "System_Renal",
    sysLabel: "Histology / Visceral Podocytes & Slit Diaphragms",
    func: "Terminally differentiated visceral epithelial cells with octopus-like star bodies and branching primary/secondary trabeculae terminating in interdigitating foot processes (pedicels); pedicels embrace outer capillary GBM and are bridged by molecular slit diaphragms (nephrin, podocin, NEPH1, CD2AP) with narrow filtration pores (4-14 nm), constituting the final selective barrier against proteinuria.",
    landmarks: "Podocyte perikaryon (cell body), primary trabecular arms, interdigitating pedicel interspaces, filtration slit diaphragm pores.",
    clinical: "Podocyte effacement (flattening and loss of foot processes) is the hallmark of Minimal Change Disease (MCD) and Focal Segmental Glomerulosclerosis (FSGS), resulting in severe non-selective nephrotic-range proteinuria (>3.5 g/24h), hypoalbuminemia, and generalized anasarca edema."
  },
  "Renal_Capsule_Bowman_Space": {
    ta2: "Capsula glomerularis (Bowmani) et Spatium urinarium (TA2: 3409)",
    system: "System_Renal",
    sysLabel: "Renal / Bowman's Capsule & Urinary Space",
    func: "Double-layered epithelial cup surrounding the capillary tuft; outer parietal layer composed of simple squamous epithelium supported by a thick basement membrane; internal urinary space collects protein-free glomerular ultrafiltrate and funnels it into the neck of the proximal convoluted tubule (PCT) at the urinary pole.",
    landmarks: "Parietal squamous epithelium, Bowman's space (urinary space), vascular pole reflection, urinary pole neck transitioning into PCT.",
    clinical: "Crescentic glomerulonephritis (RPGN) characterized by exuberant proliferation of parietal epithelial cells and infiltrating macrophages filling Bowman's space, compressing the capillary tuft and causing rapid, irreversible loss of renal function within weeks."
  },
  "Renal_Apparatus_Juxtaglomerular": {
    ta2: "Complexus juxtaglomerularis (TA2: 3415)",
    system: "System_Renal",
    sysLabel: "Renal / Juxtaglomerular Apparatus (JGA Autoregulation)",
    func: "Specialized endocrine-sensory micro-organ nestled in the vascular cleft; Macula Densa cells in the distal tubule sense luminal NaCl delivery via NKCC2 co-transporters; JG granular cells in afferent arteriole synthesize, store, and release renin in response to decreased renal perfusion, sympathetic beta-1 stimulation, or low NaCl delivery; Extraglomerular mesangial (Lacis) cells mediate tubuloglomerular feedback signaling.",
    landmarks: "Macula densa plaque (tall columnar sensory cells), JG granular cells with renin storage vesicles, extraglomerular mesangial (Lacis/Goormaghtigh) triangular cell bed.",
    clinical: "Renin cleaves angiotensinogen to Angiotensin I (converted by pulmonary ACE to Angiotensin II), stimulating systemic vasoconstriction and aldosterone release; renal artery stenosis hyperactivates the JGA, producing severe renovascular hypertension (Goldblatt kidney mechanism)."
  },
  "Renal_Pathology_KimmelstielWilson": {
    ta2: "Glomerulosclerosis diabetica nodularis (Kimmelstiel-Wilson) (ICD-11: GB61 / Robbins Path)",
    system: "System_Renal",
    sysLabel: "Pathology / Kimmelstiel-Wilson Diabetic Glomerulosclerosis",
    func: "Hallmark advanced lesion of Diabetic Nephropathy (diabetic glomerulosclerosis); chronic hyperglycemia promotes advanced glycation end-products (AGEs), non-enzymatic glycation of efferent arteriole, and TGF-beta overexpression, causing massive mesangial matrix expansion, acellular PAS-positive eosinophilic nodular hyaline masses (Kimmelstiel-Wilson nodules), and peripheral capillary microaneurysms and capillary lumen obliteration.",
    landmarks: "Lobular acellular eosinophilic hyaline nodule, compressed and obliterated peripheral capillaries, microaneurysmal capillary dilatation, thickened hyalinized arteriolar cuffs.",
    clinical: "Causes progressive microalbuminuria transitioning to overt macroalbuminuria, nephrotic syndrome, secondary hypertension, and relentless decline in GFR leading to End-Stage Renal Disease (ESRD) requiring chronic hemodialysis or renal transplantation."
  },

  // ----------------------------------------------------------------------------
  // HEPATIC LOBULE, SINUSOIDAL SPACE OF DISSE & CIRRHOSIS / JAUNDICE (TA2 ENTRIES)
  // ----------------------------------------------------------------------------
  "Hepatic_Lobule_HexagonalFrame": {
    ta2: "Lobulus hepaticus classicus (TA2: 2950)",
    system: "System_Digestive",
    sysLabel: "Hepatic Micro-Architecture / Classical Lobule",
    func: "Hexagonal functional subunit of the liver parenchyma (~1-2 mm) centered around a central vein; comprises radiating plates of hepatocytes (Remak cords) separated by vascular sinusoids, bound peripherally by portal tracts and the limiting plate.",
    landmarks: "Hexagonal outer perilobular boundary, radiating hepatocyte plates, limiting plate (lamina limitans), subcapsular Glissonian stroma.",
    clinical: "Zonal metabolic heterogeneity (Rappaport acinar model): Zone 1 (periportal) is oxygen-rich and vulnerable to direct toxins; Zone 3 (centrilobular) has low PO2 and is most susceptible to ischemic necrosis, acetaminophen hepatotoxicity, and fatty change (steatosis)."
  },
  "Hepatic_Triad_PortalVein": {
    ta2: "Vena interlobularis / Ramus venae portae hepatis (TA2: 4320)",
    system: "System_Cardiovascular",
    sysLabel: "Portal Triad / Interlobular Portal Venule",
    func: "Wide, thin-walled venous conduit traversing the portal canal (of Kiernan); delivers low-pressure (8-10 mmHg), nutrient-rich, deoxygenated blood carrying intestinal nutrients, pancreatic hormones, and absorbed antigens directly from mesenteric circulation into the lobular sinusoids.",
    landmarks: "Interlobular portal canal, distributing inlet venules piercing the limiting plate, connective tissue collar.",
    clinical: "Portal hypertension (wedge hepatic venous pressure gradient > 10-12 mmHg) causes portosystemic collateral shunting (esophageal varices, caput medusae, hemorrhoids), ascites, and congestive splenomegaly."
  },
  "Hepatic_Triad_HepaticArtery": {
    ta2: "Arteria interlobularis / Ramus arteriae hepaticae propriae (TA2: 4125)",
    system: "System_Cardiovascular",
    sysLabel: "Portal Triad / Interlobular Hepatic Arteriole",
    func: "Narrow, thick-walled muscular resistance vessel supplying high-pressure pulsatile oxygenated blood (25-30% of total hepatic inflow) to biliary peribiliary capillary plexuses and lobular sinusoids.",
    landmarks: "Arteriolar muscular media, internal elastic lamina, terminal inlet arterioles emptying into periportal sinusoids.",
    clinical: "Hepatic arterial thrombosis is a catastrophic post-liver transplant complication causing severe ischemic necrosis of the biliary tree and biliary strictures, as bile ducts depend exclusively on hepatic arterial blood supply."
  },
  "Hepatic_Triad_BileDuctule": {
    ta2: "Ductulus bilifer / Canalis Heringi (TA2: 2962)",
    system: "System_Digestive",
    sysLabel: "Portal Triad / Interlobular Bile Ductule",
    func: "Simple cuboidal epithelial conduit running centrifugally (counter-current to sinusoidal blood flow); collects bile synthesized by hepatocytes via apical canalicular networks and canals of Hering, directing it into interlobular and lobar bile ducts.",
    landmarks: "Cuboidal cholangiocyte lumen, basement membrane, canal of Hering-ductule junction.",
    clinical: "Primary Biliary Cholangitis (PBC) targets interlobular bile ductules via autoimmune granulomatous destruction (anti-mitochondrial antibodies / AMA positive), resulting in progressive vanishing bile duct syndrome and severe cholestatic jaundice."
  },
  "Hepatic_Sinusoid_Capillaries": {
    ta2: "Vasa capillaria sinusoidea hepatica (TA2: 2955)",
    system: "System_Cardiovascular",
    sysLabel: "Microcirculation / Sinusoidal Capillaries & Kupffer Cells",
    func: "Low-resistance, wide, tortuous fenestrated capillaries lined by discontinuous endothelial cells lacking a continuous basement membrane; permit bidirectional exchange of plasma solutes between blood and hepatocytes. Houses resident star-shaped Kupffer cells (macrophages) that scavenge senescent erythrocytes and gut-derived endotoxins.",
    landmarks: "Endothelial sieve plates (fenestrae ~100-150 nm), sinusoidal lumen, dendritic Kupffer macrophages.",
    clinical: "Kupffer cell hyperactivation in endotoxemia / sepsis generates high levels of TNF-alpha, IL-1, and reactive oxygen species, driving systemic inflammatory response syndrome (SIRS) and acute liver injury."
  },
  "Hepatic_Space_Of_Disse_Stellate": {
    ta2: "Spatium perisinusoideum Disse / Cellula stellata hepatica (TA2: 2958)",
    system: "System_Digestive",
    sysLabel: "Perisinusoidal Space of Disse & Hepatic Stellate Cells",
    func: "Subendothelial compartment separating sinusoidal endothelium from hepatocyte basolateral microvillar membranes, facilitating plasma filtration and lymphatic production. Houses quiescent Hepatic Stellate cells (Ito cells / lipocytes) storing 80% of total body Vitamin A in cytoplasmic lipid droplets.",
    landmarks: "Perisinusoidal fluid cleft, hepatocyte basolateral microvilli, star-shaped Ito cell body with retinyl ester lipid inclusions.",
    clinical: "Under chronic inflammatory stimulation (TGF-beta, PDGF), quiescent stellate cells undergo transdifferentiation into contractile, alpha-SMA-positive myofibroblasts, synthesizing copious Type I & III fibrillar collagen that obliterates the space of Disse ('capillarization of sinusoids') and drives liver cirrhosis."
  },
  "Hepatic_Vein_Central": {
    ta2: "Vena centralis / Vena centrilobularis (TA2: 4325)",
    system: "System_Cardiovascular",
    sysLabel: "Venous Drainage / Central Draining Vein",
    func: "Centrilobular thin-walled draining venule situated at the axis of each classical lobule; receives converging mixed sinusoidal blood via circumferential ostia and empties into sublobular veins, hepatic veins (right, middle, left), and inferior vena cava (IVC).",
    landmarks: "Centrilobular axis, circumferential inlet ostia, thin endothelial wall with minimal supporting connective tissue.",
    clinical: "Budd-Chiari syndrome (hepatic vein / centrilobular venular thrombosis) causes massive centrilobular sinusoidal congestion, Zone 3 ischemic necrosis, acute portal hypertension, painful hepatomegaly, and intractable ascites."
  },
  "Hepatic_Pathology_Cirrhosis_Nodule": {
    ta2: "Cirrhosis hepatis / Pseudolobulus regenerativus (ICD-11: DB93 / Robbins Path)",
    system: "System_Digestive",
    sysLabel: "Pathology / Cirrhotic Regenerative Nodule & Jaundice",
    func: "End-stage irreversible hepatic remodeling characterized by diffuse parenchymal nodular regeneration encircled by dense bridging fibrous bands (fibroconnective septa linking portal-to-portal and portal-to-central). Destroys sinusoidal microarchitecture, obliterates vascular outflow, and causes canalicular bile plugs (cholestatic jaundice).",
    landmarks: "Avascular regenerative pseudolobule lacking central vein, bridging myofibroblast collagen bands, inspissated yellow-green canalicular bile thrombi, architectural distortion.",
    clinical: "Clinova Node 02 correlation: Results in decompensated liver failure, progressive jaundice (hyperbilirubinemia due to canalicular excretion block), coagulopathy (loss of factor synthesis), hypoalbuminemia, hepatic encephalopathy (hyperammonemia), and portal hypertension."
  }
};

// ------------------------------------------------------------------------------
// GLOBAL APPLICATION STATE
// ------------------------------------------------------------------------------
const state = {
  model: null,
  meshes: new Map(), // name -> THREE.Mesh
  materials: new Map(), // name -> original Material
  systemMeshes: {
    "System_OuterShell": [],
    "System_Skeletal": [],
    "System_Muscular": [],
    "System_Cardiovascular": [],
    "System_Respiratory": [],
    "System_Nervous": [],
    "System_Digestive": [],
    "System_Renal": [],
    "System_Endocrine": [],
    "System_Integumentary": [],
    "System_HandFoot": [],
    "System_Lymphatic": [],
    "System_Articular": [],
    "System_Fascia": []
  },
  systemVisibility: {
    "System_OuterShell": true,
    "System_Skeletal": true,
    "System_Muscular": true,
    "System_Cardiovascular": true,
    "System_Respiratory": true,
    "System_Nervous": true,
    "System_Digestive": true,
    "System_Renal": true,
    "System_Endocrine": true,
    "System_Integumentary": true,
    "System_HandFoot": true,
    "System_Lymphatic": true,
    "System_Articular": true,
    "System_Fascia": true
  },
  currentModel: "human_anatomy_commercial.glb",
  addonScenes: [],
  hiddenMeshes: new Set(),
  explodedRatio: 0.0,
  selectedMesh: null,
  hoveredMesh: null,
  isIsolated: false,
  xrayOpacity: 0.25,
  modes: {
    cardiacPulse: false,
    neuralPulse: false,
    autoRotate: false
  },
  clipping: {
    enabled: false,
    axis: "none",
    plane: new THREE.Plane(),
    depth: 0,
    inverted: false
  },
  cameraTransition: null,
  fpsTracker: {
    frames: 0,
    lastTime: performance.now(),
    fps: 60
  }
};

// ------------------------------------------------------------------------------
// THREE.JS SCENE SETUP & ENGINE INITIALIZATION
// ------------------------------------------------------------------------------
const container = document.getElementById('canvas-container');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x06090e);

// Studio Camera
const camera = new THREE.PerspectiveCamera(38, window.innerWidth / window.innerHeight, 0.05, 50.0);
camera.position.set(0.0, 1.35, 1.95);

// WebGL 2.0 Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2.0));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.15;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.localClippingEnabled = true;
renderer.clippingPlanes = [];

container.appendChild(renderer.domElement);

// Orbit Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.06;
controls.target.set(0.0, 1.25, 0.0);
controls.minDistance = 0.35;
controls.maxDistance = 4.5;
controls.maxPolarAngle = Math.PI * 0.95;
controls.enablePan = true;
controls.screenSpacePanning = true;
controls.mouseButtons.LEFT = THREE.MOUSE.ROTATE;
controls.mouseButtons.RIGHT = THREE.MOUSE.PAN;

// ------------------------------------------------------------------------------
// MEDICAL STUDIO LIGHTING RIG
// ------------------------------------------------------------------------------
function setupStudioLighting() {
  // Ambient Soft Occlusion Light
  const ambient = new THREE.AmbientLight(0xffffff, 0.85);
  scene.add(ambient);

  // Key Light (Clinical Crisp Light from Front-Right)
  const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
  keyLight.position.set(2.5, 3.5, 3.0);
  scene.add(keyLight);

  // Fill Light (Soft Cool Cyan Fill from Front-Left)
  const fillLight = new THREE.DirectionalLight(0xa5f3fc, 1.2);
  fillLight.position.set(-2.5, 2.0, 2.5);
  scene.add(fillLight);

  // Rim Light (Sharp Cold White Rim from Behind-Superior for silhouette definition)
  const rimLight = new THREE.DirectionalLight(0x38bdf8, 2.5);
  rimLight.position.set(0.0, 3.8, -3.0);
  scene.add(rimLight);

  // Subtle Base Ground Light
  const groundLight = new THREE.DirectionalLight(0x1e293b, 0.6);
  groundLight.position.set(0, -2, 0);
  scene.add(groundLight);
}
setupStudioLighting();

function disposeObject3D(root) {
  root.traverse((child) => {
    if (!child.isMesh) return;
    if (child.geometry) child.geometry.dispose();
    if (child.material) {
      if (Array.isArray(child.material)) child.material.forEach(m => m.dispose());
      else child.material.dispose();
    }
  });
}

function clearAddonScenes() {
  state.addonScenes.forEach((addonScene) => {
    scene.remove(addonScene);
    disposeObject3D(addonScene);
  });
  state.addonScenes = [];
}

function addAddonScene(addonScene) {
  state.addonScenes.push(addonScene);
  scene.add(addonScene);
  applyVisibility();
}

function setCoarseMeshSuppressed(meshName, suppressed = true) {
  const coarse = state.meshes.get(meshName);
  if (!coarse) return;
  coarse.userData.coarseSuppressed = suppressed;
  applyVisibility();
}

function isMeshInSystem(mesh, systemKey) {
  return (state.systemMeshes[systemKey] || []).includes(mesh);
}

function isSubLayerVisible(mesh) {
  const checked = (id) => {
    const el = document.getElementById(id);
    return !el || el.checked;
  };

  if (isMeshInSystem(mesh, "System_Integumentary")) {
    if (mesh.name.startsWith('Fascia_Superficial')) return checked('sub-Fascia_Superficial');
    if (mesh.name.startsWith('Fascia_Deep_')) return checked('sub-Fascia_Deep');
  }
  if (isMeshInSystem(mesh, "System_HandFoot")) {
    const ids = {
      carpal: 'sub-hf-carpal',
      metacarpal: 'sub-hf-metacarpal',
      phalanx_hand: 'sub-hf-phalanx-hand',
      forearm_musc: 'sub-hf-forearm-musc',
      forearm_tend: 'sub-hf-forearm-tend',
      tarsal: 'sub-hf-tarsal',
      metatarsal: 'sub-hf-metatarsal',
      phalanx_foot: 'sub-hf-phalanx-foot',
      foot_tend: 'sub-hf-foot-tend'
    };
    return checked(ids[mesh.userData.hfGroup]);
  }
  if (isMeshInSystem(mesh, "System_Skeletal")) {
    const ids = {
      skull: 'sub-skel-skull',
      spine: 'sub-skel-spine',
      thorax: 'sub-skel-thorax',
      upperlimb: 'sub-skel-upperlimbs',
      lowerlimb: 'sub-skel-lowerlimbs'
    };
    return checked(ids[mesh.userData.skelGroup]);
  }
  if (isMeshInSystem(mesh, "System_Cardiovascular")) {
    if (['Organ_Heart', 'Vessel_Aorta', 'Vessel_VenaCava', 'Vessel_PulmonaryTrunk'].includes(mesh.name) || mesh.name.startsWith('Heart_')) {
      return checked('sub-vasc-heart');
    }
    const ids = { arterial: 'sub-vasc-arterial', venous: 'sub-vasc-venous' };
    return checked(ids[mesh.userData.vascGroup]);
  }
  if (isMeshInSystem(mesh, "System_Nervous")) {
    if (mesh.name === 'Organ_Brain' || mesh.name.startsWith('CNS_')) return checked('sub-nerve-brain');
    const ids = {
      cranial: 'sub-nerve-cranial',
      brachial: 'sub-nerve-brachial',
      lumbosacral: 'sub-nerve-lumbosacral',
      sympathetic: 'sub-nerve-sympathetic'
    };
    return checked(ids[mesh.userData.nerveGroup]);
  }
  if (isMeshInSystem(mesh, "System_Digestive")) {
    const ids = {
      upper: 'sub-gi-upper',
      hepatobiliary: 'sub-gi-hepatobiliary',
      smallbowel: 'sub-gi-smallbowel',
      colon: 'sub-gi-colon',
      anorectal: 'sub-gi-anorectal'
    };
    return checked(ids[mesh.userData.giGroup]);
  }
  if (isMeshInSystem(mesh, "System_Respiratory")) {
    const ids = { larynx: 'sub-resp-larynx', airway: 'sub-resp-airway', lungs: 'sub-resp-lungs' };
    return checked(ids[mesh.userData.respGroup]);
  }
  if (isMeshInSystem(mesh, "System_Renal")) {
    const ids = {
      kidneys: 'sub-uro-kidneys',
      adrenals: 'sub-uro-adrenals',
      urinary: 'sub-uro-urinary',
      reproductive: 'sub-uro-reproductive'
    };
    return checked(ids[mesh.userData.uroGroup]);
  }
  if (isMeshInSystem(mesh, "System_Endocrine")) {
    const ids = { glands: 'sub-endo-glands', eyes: 'sub-sens-eyes', ears: 'sub-sens-ears' };
    return checked(ids[mesh.userData.endoGroup]);
  }
  if (isMeshInSystem(mesh, "System_Lymphatic")) {
    const ids = { organs: 'sub-lymph-organs', ducts: 'sub-lymph-ducts', nodes: 'sub-lymph-nodes' };
    return checked(ids[mesh.userData.lymphGroup]);
  }
  if (isMeshInSystem(mesh, "System_Articular")) {
    const ids = {
      spine: 'sub-art-spine',
      torso: 'sub-art-torso',
      upper: 'sub-art-upper',
      lower: 'sub-art-lower',
      menisci: 'sub-art-menisci'
    };
    return checked(ids[mesh.userData.articularGroup]);
  }
  if (isMeshInSystem(mesh, "System_Muscular")) {
    const ids = {
      headneck: 'sub-musc-headneck',
      thorax: 'sub-musc-thorax',
      abdomen: 'sub-musc-abdomen',
      back: 'sub-musc-back',
      pelvis: 'sub-musc-pelvis',
      upperlimb: 'sub-musc-upperlimb',
      lowerlimb: 'sub-musc-lowerlimb'
    };
    return checked(ids[mesh.userData.muscleGroup]);
  }
  if (isMeshInSystem(mesh, "System_Fascia")) {
    const ids = {
      headneck: 'sub-fascia-headneck',
      trunk: 'sub-fascia-trunk',
      upper: 'sub-fascia-upper',
      lower: 'sub-fascia-lower'
    };
    return checked(ids[mesh.userData.fasciaGroup]);
  }
  return true;
}

function applyVisibility() {
  state.meshes.forEach((mesh) => {
    const info = getAnatomyInfo(mesh.name);
    const systemVisible = !info.system || state.systemVisibility[info.system] !== false;
    const hiddenByUser = state.hiddenMeshes.has(mesh.name);
    const suppressed = mesh.userData.coarseSuppressed === true;
    mesh.visible = Boolean(systemVisible && !hiddenByUser && !suppressed && isSubLayerVisible(mesh));
  });
}

// ------------------------------------------------------------------------------
// ASSET LOADING WITH GOOGLE DRACO DECOMPRESSION
// ------------------------------------------------------------------------------
function loadAnatomyModel(modelFileName = 'human_anatomy_commercial.glb') {
  state.currentModel = modelFileName;
  const loadingOverlay = document.getElementById('loading-overlay');
  const loadingMsg = document.getElementById('loading-msg');
  if (loadingOverlay) {
    loadingOverlay.style.display = 'flex';
    loadingOverlay.style.opacity = '1';
    if (loadingMsg) loadingMsg.textContent = `LOADING MODULAR ASSET: ${modelFileName}...`;
  }

  // Remove previous model if exists
  if (state.model) {
    scene.remove(state.model);
    disposeObject3D(state.model);
    state.model = null;
  }
  clearAddonScenes();

  state.meshes.clear();
  state.materials.clear();
  state.hiddenMeshes.clear();
  Object.keys(state.systemMeshes).forEach(sys => {
    state.systemMeshes[sys] = [];
  });
  state.selectedMesh = null;
  state.hoveredMesh = null;

  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath('./draco/');
  dracoLoader.setDecoderConfig({ type: 'wasm' });

  const gltfLoader = new GLTFLoader();
  gltfLoader.setDRACOLoader(dracoLoader);

  let totalPolys = 0;

  gltfLoader.load(
    './' + modelFileName,
    (gltf) => {
      state.model = gltf.scene;
      scene.add(state.model);

      state.model.traverse((child) => {
        if (child.isMesh) {
          state.meshes.set(child.name, child);
          child.material = child.material.clone(); // unique per mesh — prevents shared emissive highlight

          // Count polygons
          if (child.geometry && child.geometry.index) {
            totalPolys += child.geometry.index.count / 3;
          } else if (child.geometry && child.geometry.attributes.position) {
            totalPolys += child.geometry.attributes.position.count / 3;
          }

          // Centroid for exploded view
          child.geometry.computeBoundingBox();
          const bbox = child.geometry.boundingBox;
          const center = new THREE.Vector3();
          bbox.getCenter(center);
          child.userData.origPos = child.position.clone();
          child.userData.centroid = center;

          // Match to database
          const info = getAnatomyInfo(child.name);
          if (info && state.systemMeshes[info.system]) {
            state.systemMeshes[info.system].push(child);
          }

          // Outer Shell Translucent X-Ray setup
          if (child.name.startsWith("Anatomy_")) {
            child.material.transparent = true;
            child.material.depthWrite = false;
            child.material.depthTest = true;
            child.renderOrder = 99;
            child.material.opacity = state.xrayOpacity;
          }

          // Store AFTER Anatomy_ setup so the restore baseline captures glass settings
          state.materials.set(child.name, child.material.clone());
        }
      });

      console.log(`[Viewer] ${modelFileName} loaded: ${state.meshes.size} meshes, ${Math.round(totalPolys).toLocaleString()} polygons.`);

      // Update Polygon metric in HUD
      const polyElem = document.getElementById('metric-polys');
      if (polyElem) polyElem.textContent = Math.round(totalPolys).toLocaleString();

      // Sync system card toggles: highlight cards present in this sub-model
      document.querySelectorAll('.system-card').forEach(card => {
        const sys = card.dataset.system;
        const hasMeshes = (state.systemMeshes[sys] && state.systemMeshes[sys].length > 0);
        card.style.opacity = hasMeshes ? '1' : '0.35';
      });

      // Reset explode slider
      const explodeSlider = document.getElementById('slider-explode');
      const explodeLabel = document.getElementById('label-explode');
      if (explodeSlider) explodeSlider.value = 0;
      if (explodeLabel) explodeLabel.textContent = '0%';
      state.explodedRatio = 0.0;

      // Remove loading overlay
      if (loadingOverlay) {
        loadingOverlay.style.opacity = '0';
        setTimeout(() => { loadingOverlay.style.display = 'none'; }, 400);
      }

      // Default selection
      if (state.meshes.has("Organ_Heart")) {
        selectOrgan("Organ_Heart", false);
      } else if (state.meshes.size > 0) {
        const first = Array.from(state.meshes.keys()).find(k => !k.startsWith("Anatomy_")) || Array.from(state.meshes.keys())[0];
        selectOrgan(first, false);
      }

      // Camera auto-focus per submodel
            if (modelFileName === 'submodel_coronary_stent_bypass.glb') {
        camera.near = 0.005;
        camera.updateProjectionMatrix();
        controls.minDistance = 0.02;
        controls.maxDistance = 1.5;
        controls.target.set(0.038, -0.038, 1.268);
        camera.position.set(0.038 + 0.045, -0.038 - 0.12, 1.268 + 0.020);
        controls.update();
      } else if (modelFileName === 'submodel_auditory_apparatus.glb') {
        camera.near = 0.002;
        camera.updateProjectionMatrix();
        controls.minDistance = 0.01;
        controls.maxDistance = 1.0;
        controls.target.set(0.043, 0.005, 1.582);
        camera.position.set(0.043 + 0.045, 0.005 - 0.055, 1.582 + 0.035);
        controls.update();
      } else if (modelFileName === 'submodel_pulmonary_alveolus.glb') {
        camera.near = 0.002;
        camera.updateProjectionMatrix();
        controls.minDistance = 0.01;
        controls.maxDistance = 1.2;
        controls.target.set(0.068, -0.033, 1.317);
        camera.position.set(0.068 + 0.035, -0.033 - 0.125, 1.317 + 0.020);
        controls.update();
      } else if (modelFileName === 'submodel_renal_nephron.glb') {
        camera.near = 0.002;
        camera.updateProjectionMatrix();
        controls.minDistance = 0.01;
        controls.maxDistance = 1.2;
        controls.target.set(0.045, -0.015, 1.150);
        camera.position.set(0.045 + 0.035, -0.015 - 0.125, 1.150 + 0.020);
        controls.update();
      } else if (modelFileName === 'submodel_hepatic_lobule.glb') {
        camera.near = 0.002;
        camera.updateProjectionMatrix();
        controls.minDistance = 0.01;
        controls.maxDistance = 1.2;
        controls.target.set(0.048, -0.020, 1.180);
        camera.position.set(0.048 + 0.035, -0.020 - 0.125, 1.180 + 0.020);
        controls.update();
      } else {
        camera.near = 0.05;
        camera.updateProjectionMatrix();
        controls.minDistance = 0.35;
        controls.maxDistance = 4.5;
        controls.target.set(0.0, 1.25, 0.0);
        camera.position.set(0.0, 1.35, 1.95);
        controls.update();
      }

      applyVisibility();
      loadAddonModels();
    },
    (xhr) => {
      if (xhr.lengthComputable && loadingMsg) {
        const percent = Math.round((xhr.loaded / xhr.total) * 100);
        loadingMsg.textContent = `DECOMPRESSING ${modelFileName}: ${percent}%...`;
      }
    },
    (err) => {
      console.warn(`[Viewer] Local Draco load failed for ${modelFileName}, falling back to CDN...`, err);
      dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');
      gltfLoader.load('./' + modelFileName, (gltf) => {
        state.model = gltf.scene;
        scene.add(state.model);
        state.model.traverse((child) => {
          if (child.isMesh) {
            state.meshes.set(child.name, child);
            child.material = child.material.clone(); // unique per mesh
            child.geometry.computeBoundingBox();
            const bbox = child.geometry.boundingBox;
            const center = new THREE.Vector3();
            bbox.getCenter(center);
            child.userData.origPos = child.position.clone();
            child.userData.centroid = center;

            const info = getAnatomyInfo(child.name);
            if (info && state.systemMeshes[info.system]) {
              state.systemMeshes[info.system].push(child);
            }
            if (child.name.startsWith("Anatomy_")) {
              child.material.transparent = true;
              child.material.depthWrite = false;
              child.renderOrder = 99;
              child.material.opacity = state.xrayOpacity;
            }
            state.materials.set(child.name, child.material.clone());
          }
        });
        if (loadingOverlay) loadingOverlay.style.display = 'none';
        applyVisibility();
        loadAddonModels();
      });
    }
  );
}
loadAnatomyModel();

// ------------------------------------------------------------------------------
// SKIN & FASCIA ADDON GLB LOADER
// ------------------------------------------------------------------------------
function loadSkinFasciaModel() {
  const dracoLoader2 = new DRACOLoader();
  dracoLoader2.setDecoderPath('./draco/');
  dracoLoader2.setDecoderConfig({ type: 'wasm' });

  const sfLoader = new GLTFLoader();
  sfLoader.setDRACOLoader(dracoLoader2);

  sfLoader.load(
    './skin_fascia.glb',
    (gltf) => {
      gltf.scene.traverse((child) => {
        if (!child.isMesh) return;

        state.meshes.set(child.name, child);

        child.geometry.computeBoundingBox();
        const bbox = child.geometry.boundingBox;
        const center = new THREE.Vector3();
        bbox.getCenter(center);
        child.userData.origPos = child.position.clone();
        child.userData.centroid = center;

        if (child.name === 'Skin_Body') {
          // Route full-body skin envelope into System_OuterShell so it acts as
          // the X-ray glass shell for the entire body including extremities.
          // The Anatomy_* panels only cover core body — Skin_Body fills that gap.
          child.material.transparent = true;
          child.material.depthWrite = false;
          child.material.opacity = state.xrayOpacity;
          child.renderOrder = 99;
          state.materials.set(child.name, child.material.clone());
          state.systemMeshes["System_OuterShell"].push(child);
          child.visible = state.systemVisibility["System_OuterShell"];
        } else {
          // Fascia layers stay in System_Integumentary.
          // Set transparent flags BEFORE cloning so ISOLATE restore preserves them.
          child.material.transparent = true;
          child.material.depthWrite = false;
          child.renderOrder = 2;
          state.materials.set(child.name, child.material.clone());
          const info = getAnatomyInfo(child.name);
          if (info && state.systemMeshes["System_Integumentary"]) {
            state.systemMeshes["System_Integumentary"].push(child);
          }
          child.visible = state.systemVisibility["System_Integumentary"];
        }
      });

      addAddonScene(gltf.scene);

      // Refresh card opacities now that meshes are present
      const sfCard = document.querySelector('[data-system="System_Integumentary"]');
      if (sfCard) sfCard.style.opacity = '1';
      const shellCard = document.querySelector('[data-system="System_OuterShell"]');
      if (shellCard) shellCard.style.opacity = '1';

      console.log(`[Viewer] skin_fascia.glb loaded — OuterShell: ${state.systemMeshes["System_OuterShell"].length} meshes, Integumentary: ${state.systemMeshes["System_Integumentary"].length} meshes.`);
    },
    null,
    (err) => console.warn('[Viewer] skin_fascia.glb load failed:', err)
  );
}

// ------------------------------------------------------------------------------
// HAND & FOOT ADDON GLB LOADER
// ------------------------------------------------------------------------------
function loadHandFootModel() {
  const HF_GROUPS = {
    carpal: ["Capitate bone.l","Capitate bone.r","Hamate bone.l","Hamate bone.r",
             "Lunate bone.l","Lunate bone.r","Pisiform bone.l","Pisiform bone.r",
             "Scaphoid bone.l","Scaphoid bone.r","Trapezium bone.l","Trapezium bone.r",
             "Trapezoid bone.l","Trapezoid bone.r","Triquetrum bone.l","Triquetrum bone.r"],
    metacarpal: ["First metacarpal bone.l","First metacarpal bone.r",
                 "Second metacarpal bone.l","Second metacarpal bone.r",
                 "Third metacarpal bone.l","Third metacarpal bone.r",
                 "Fourth metacarpal bone.l","Fourth metacarpal bone.r",
                 "Fifth metacarpal bone.l","Fifth metacarpal bone.r"],
    phalanx_hand: [
      "Proximal phalanx of first finger of hand.l","Proximal phalanx of first finger of hand.r",
      "Proximal phalanx of second finger of hand.l","Proximal phalanx of second finger of hand.r",
      "Proximal phalanx of third finger of hand.l","Proximal phalanx of third finger of hand.r",
      "Proximal phalanx of fourth finger of hand.l","Proximal phalanx of fourth finger of hand.r",
      "Proximal phalanx of fifth finger of hand.l","Proximal phalanx of fifth finger of hand.r",
      "Middle phalanx of second finger of hand.l","Middle phalanx of second finger of hand.r",
      "Middle phalanx of third finger of hand.l","Middle phalanx of third finger of hand.r",
      "Middle phalanx of fourth finger of hand.l","Middle phalanx of fourth finger of hand.r",
      "Middle phalanx of fifth finger of hand.l","Middle phalanx of fifth finger of hand.r",
      "Distal phalanx of first finger of hand.l","Distal phalanx of first finger of hand.r",
      "Distal phalanx of second finger of hand.l","Distal phalanx of second finger of hand.r",
      "Distal phalanx of third finger of hand.l","Distal phalanx of third finger of hand.r",
      "Distal phalanx of fourth finger of hand.l","Distal phalanx of fourth finger of hand.r",
      "Distal phalanx of fifth finger of hand.l","Distal phalanx of fifth finger of hand.r"
    ],
    forearm_musc: [
      "Abductor pollicis longus.l","Abductor pollicis longus.r",
      "Extensor carpi radialis brevis.l","Extensor carpi radialis brevis.r",
      "Extensor carpi radialis longus.l","Extensor carpi radialis longus.r",
      "Extensor carpi ulnaris.el","Extensor carpi ulnaris.er",
      "Extensor digiti minimi.l","Extensor digiti minimi.r",
      "Extensor digitorum.l","Extensor digitorum.r",
      "Extensor pollicis brevis.l","Extensor pollicis brevis.r",
      "Extensor pollicis longus.l","Extensor pollicis longus.r",
      "Flexor carpi radialis.l","Flexor carpi radialis.r",
      "Flexor carpi ulnaris.el","Flexor carpi ulnaris.er",
      "Flexor digitorum profundus.l","Flexor digitorum profundus.r",
      "Flexor digitorum superficialis.el","Flexor digitorum superficialis.er",
      "Flexor pollicis longus.l","Flexor pollicis longus.r",
      "Palmaris longus muscle.l","Palmaris longus muscle.r",
      "Pronator quadratus.l","Pronator quadratus.r",
      "Pronator teres.el","Pronator teres.er",
      "Supinator.l","Supinator.r"
    ],
    forearm_tend: [
      "Common extensor tendon.ol","Common extensor tendon.or",
      "Common flexor tendon.ol","Common flexor tendon.or",
      "Extensor retinaculum of wrist.l","Extensor retinaculum of wrist.r",
      "Flexor retinaculum of wrist.l","Flexor retinaculum of wrist.r"
    ],
    tarsal: [
      "Calcaneus.l","Calcaneus.r","Talus.l","Talus.r",
      "Navicular bone.l","Navicular bone.r","Cuboid bone.l","Cuboid bone.r",
      "Medial cuneiform bone.l","Medial cuneiform bone.r",
      "Intermediate cuneiform bone.l","Intermediate cuneiform bone.r",
      "Lateral cuneiform bone.l","Lateral cuneiform bone.r"
    ],
    metatarsal: [
      "First metatarsal bone.l","First metatarsal bone.r",
      "Second metatarsal bone.l","Second metatarsal bone.r",
      "Third metatarsal bone.l","Third metatarsal bone.r",
      "Fourth metatarsal bone.l","Fourth metatarsal bone.r",
      "Fifth metatarsal bone.l","Fifth metatarsal bone.r"
    ],
    phalanx_foot: [
      "Proximal phalanx of first finger of foot.l","Proximal phalanx of first finger of foot.r",
      "Proximal phalanx of second finger of foot.l","Proximal phalanx of second finger of foot.r",
      "Proximal phalanx of third finger of foot.l","Proximal phalanx of third finger of foot.r",
      "Proximal phalanx of fourth finger of foot.l","Proximal phalanx of fourth finger of foot.r",
      "Proximal phalanx of fifth finger of foot.l","Proximal phalanx of fifth finger of foot.r",
      "Middle phalanx of second finger of foot.l","Middle phalanx of second finger of foot.r",
      "Middle phalanx of third finger of foot.l","Middle phalanx of third finger of foot.r",
      "Middle phalanx of fourth finger of foot.l","Middle phalanx of fourth finger of foot.r",
      "Middle phalanx of fifth finger of foot.l","Middle phalanx of fifth finger of foot.r",
      "Distal phalanx of first finger of foot.l","Distal phalanx of first finger of foot.r",
      "Distal phalanx of second finger of foot.l","Distal phalanx of second finger of foot.r",
      "Distal phalanx of third finger of foot.l","Distal phalanx of third finger of foot.r",
      "Distal phalanx of fourth finger of foot.l","Distal phalanx of fourth finger of foot.r",
      "Distal phalanx of fifth finger of foot.l","Distal phalanx of fifth finger of foot.r"
    ],
    foot_tend: [
      "Calcaneal tendon.l","Calcaneal tendon.r",
      "Extensor digitorum longus.l","Extensor digitorum longus.r",
      "Extensor hallucis longus.l","Extensor hallucis longus.r",
      "Fibularis brevis muscle.l","Fibularis brevis muscle.r",
      "Fibularis longus muscle.l","Fibularis longus muscle.r",
      "Flexor digitorum longus.l","Flexor digitorum longus.r",
      "Flexor hallucis longus.l","Flexor hallucis longus.r",
      "Plantaris muscle.l","Plantaris muscle.r",
      "Tibialis anterior muscle.l","Tibialis anterior muscle.r",
      "Tibialis posterior muscle.l","Tibialis posterior muscle.r"
    ]
  };

  const hfNameMap = {};
  Object.entries(HF_GROUPS).forEach(([tag, names]) => {
    names.forEach(n => { hfNameMap[n] = tag; });
  });

  const dracoLoader3 = new DRACOLoader();
  dracoLoader3.setDecoderPath('./draco/');
  dracoLoader3.setDecoderConfig({ type: 'wasm' });

  const hfLoader = new GLTFLoader();
  hfLoader.setDRACOLoader(dracoLoader3);

  hfLoader.load(
    './hand_foot.glb',
    (gltf) => {
      gltf.scene.traverse((child) => {
        if (!child.isMesh) return;

        state.meshes.set(child.name, child);
        child.material = child.material.clone(); // unique per mesh

        child.geometry.computeBoundingBox();
        const bbox = child.geometry.boundingBox;
        const center = new THREE.Vector3();
        bbox.getCenter(center);
        child.userData.origPos = child.position.clone();
        child.userData.centroid = center;

        child.userData.hfGroup = hfNameMap[child.name] || 'unknown';
        state.materials.set(child.name, child.material.clone());

        state.systemMeshes["System_HandFoot"].push(child);
        child.visible = state.systemVisibility["System_HandFoot"];
      });

      addAddonScene(gltf.scene);

      const hfCard = document.querySelector('[data-system="System_HandFoot"]');
      if (hfCard) hfCard.style.opacity = '1';

      console.log(`[Viewer] hand_foot.glb loaded: ${state.systemMeshes["System_HandFoot"].length} hand/foot meshes.`);
    },
    null,
    (err) => console.warn('[Viewer] hand_foot.glb load failed:', err)
  );
}

// Helper for creating modular DRACO GLTF loaders
function createModularGLTFLoader() {
  const draco = new DRACOLoader();
  draco.setDecoderPath('./draco/');
  draco.setDecoderConfig({ type: 'wasm' });
  const loader = new GLTFLoader();
  loader.setDRACOLoader(draco);
  return loader;
}

// ------------------------------------------------------------------------------
// SKULL BONES ADDON LOADER (23 DISCRETE BONES)
// ------------------------------------------------------------------------------
function loadSkullBonesModel() {
  const loader = createModularGLTFLoader();
  loader.load('./skeleton_skull.glb', (gltf) => {
    setCoarseMeshSuppressed('Skeletal_Skull');

    gltf.scene.traverse((child) => {
      if (!child.isMesh) return;
      state.meshes.set(child.name, child);
      child.material = child.material.clone();
      child.geometry.computeBoundingBox();
      const center = new THREE.Vector3();
      child.geometry.boundingBox.getCenter(center);
      child.userData.origPos = child.position.clone();
      child.userData.centroid = center;
      child.userData.skelGroup = 'skull';
      state.materials.set(child.name, child.material.clone());
      state.systemMeshes["System_Skeletal"].push(child);
      child.visible = state.systemVisibility["System_Skeletal"];
    });
    addAddonScene(gltf.scene);
    console.log('[Viewer] skeleton_skull.glb loaded: 23 individual cranial/facial bones.');
  }, null, (err) => console.warn('[Viewer] skeleton_skull.glb load error:', err));
}

// ------------------------------------------------------------------------------
// POSTCRANIAL SKELETON ADDON LOADER (116 BONES & CARTILAGES)
// ------------------------------------------------------------------------------
function loadPostcranialSkeletonModel() {
  const loader = createModularGLTFLoader();
  loader.load('./skeleton_postcranial.glb', (gltf) => {
    ['Skeletal_Spine', 'Skeletal_Ribcage', 'Skeletal_Pelvis'].forEach(k => {
      setCoarseMeshSuppressed(k);
    });

    gltf.scene.traverse((child) => {
      if (!child.isMesh) return;
      state.meshes.set(child.name, child);
      child.material = child.material.clone();
      child.geometry.computeBoundingBox();
      const center = new THREE.Vector3();
      child.geometry.boundingBox.getCenter(center);
      child.userData.origPos = child.position.clone();
      child.userData.centroid = center;

      const n = child.name;
      if (n.startsWith('Bone_Vertebra_') || n.startsWith('Cartilage_IV_Disc_') || n === 'Bone_Sacrum' || n === 'Bone_Coccyx') {
        child.userData.skelGroup = 'spine';
      } else if (n.startsWith('Bone_Rib_') || n.startsWith('Cartilage_Costal_') || n.startsWith('Bone_Sternum_')) {
        child.userData.skelGroup = 'thorax';
      } else if (n.startsWith('Bone_Clavicle_') || n.startsWith('Bone_Scapula_') || n.startsWith('Bone_Humerus_') || n.startsWith('Bone_Radius_') || n.startsWith('Bone_Ulna_')) {
        child.userData.skelGroup = 'upperlimb';
      } else {
        child.userData.skelGroup = 'lowerlimb';
      }

      state.materials.set(child.name, child.material.clone());
      state.systemMeshes["System_Skeletal"].push(child);
      child.visible = state.systemVisibility["System_Skeletal"];
    });
    addAddonScene(gltf.scene);
    console.log('[Viewer] skeleton_postcranial.glb loaded: 116 axial & appendicular skeletal structures.');
  }, null, (err) => console.warn('[Viewer] skeleton_postcranial.glb load error:', err));
}

// ------------------------------------------------------------------------------
// UPPER GI & HEPATOBILIARY ADDON LOADER (15 STRUCTURES)
// ------------------------------------------------------------------------------
function loadUpperGIModel() {
  const loader = createModularGLTFLoader();
  loader.load('./gi_upper_hepatobiliary.glb', (gltf) => {
    ['Organ_Stomach', 'Organ_Liver', 'Organ_Gallbladder'].forEach(k => {
      setCoarseMeshSuppressed(k);
    });

    gltf.scene.traverse((child) => {
      if (!child.isMesh) return;
      state.meshes.set(child.name, child);
      child.material = child.material.clone();
      child.geometry.computeBoundingBox();
      const center = new THREE.Vector3();
      child.geometry.boundingBox.getCenter(center);
      child.userData.origPos = child.position.clone();
      child.userData.centroid = center;

      const n = child.name;
      if (n.startsWith('GI_Esophagus') || n.startsWith('GI_Stomach_')) {
        child.userData.giGroup = 'upper';
      } else if (n.startsWith('GI_Liver_') || n === 'GI_Gallbladder' || n === 'GI_Bile_Ducts' || n === 'GI_Pancreas') {
        child.userData.giGroup = 'hepatobiliary';
      } else {
        child.userData.giGroup = 'smallbowel';
      }

      state.materials.set(child.name, child.material.clone());
      state.systemMeshes["System_Digestive"].push(child);
      child.visible = state.systemVisibility["System_Digestive"];
    });
    addAddonScene(gltf.scene);
    console.log('[Viewer] gi_upper_hepatobiliary.glb loaded: 15 upper GI and Couinaud segments.');
  }, null, (err) => console.warn('[Viewer] gi_upper_hepatobiliary.glb load error:', err));
}

// ------------------------------------------------------------------------------
// LOWER GI & HINDGUT ADDON LOADER (15 STRUCTURES)
// ------------------------------------------------------------------------------
function loadLowerBowelModel() {
  const loader = createModularGLTFLoader();
  loader.load('./gi_lower_bowel.glb', (gltf) => {
    setCoarseMeshSuppressed('Organ_Intestines');

    gltf.scene.traverse((child) => {
      if (!child.isMesh) return;
      state.meshes.set(child.name, child);
      child.material = child.material.clone();
      child.geometry.computeBoundingBox();
      const center = new THREE.Vector3();
      child.geometry.boundingBox.getCenter(center);
      child.userData.origPos = child.position.clone();
      child.userData.centroid = center;

      const n = child.name;
      if (n === 'GI_Jejunum' || n === 'GI_Ileum') {
        child.userData.giGroup = 'smallbowel';
      } else if (n === 'GI_Rectum' || n.startsWith('GI_Anal_') || n.startsWith('GI_Sphincter_')) {
        child.userData.giGroup = 'anorectal';
      } else {
        child.userData.giGroup = 'colon';
      }

      state.materials.set(child.name, child.material.clone());
      state.systemMeshes["System_Digestive"].push(child);
      child.visible = state.systemVisibility["System_Digestive"];
    });
    addAddonScene(gltf.scene);
    console.log('[Viewer] gi_lower_bowel.glb loaded: 15 midgut, hindgut, and anorectal structures.');
  }, null, (err) => console.warn('[Viewer] gi_lower_bowel.glb load error:', err));
}

// ------------------------------------------------------------------------------
// PERIPHERAL VASCULAR ADDON LOADER (184 VESSELS)
// ------------------------------------------------------------------------------
function loadPeripheralVascularModel() {
  const loader = createModularGLTFLoader();
  loader.load('./vascular_peripheral.glb', (gltf) => {
    gltf.scene.traverse((child) => {
      if (!child.isMesh) return;
      state.meshes.set(child.name, child);
      child.material = child.material.clone();
      child.geometry.computeBoundingBox();
      const center = new THREE.Vector3();
      child.geometry.boundingBox.getCenter(center);
      child.userData.origPos = child.position.clone();
      child.userData.centroid = center;
      child.userData.vascGroup = child.name.includes('_Arterial_') ? 'arterial' : 'venous';

      state.materials.set(child.name, child.material.clone());
      state.systemMeshes["System_Cardiovascular"].push(child);
      child.visible = state.systemVisibility["System_Cardiovascular"];
    });
    addAddonScene(gltf.scene);
    console.log('[Viewer] vascular_peripheral.glb loaded: 184 peripheral arteries & veins.');
  }, null, (err) => console.warn('[Viewer] vascular_peripheral.glb load error:', err));
}

// ------------------------------------------------------------------------------
// PERIPHERAL NERVOUS ADDON LOADER (257 NERVES)
// ------------------------------------------------------------------------------
function loadPeripheralNervousModel() {
  const loader = createModularGLTFLoader();
  loader.load('./nervous_peripheral.glb', (gltf) => {
    gltf.scene.traverse((child) => {
      if (!child.isMesh) return;
      state.meshes.set(child.name, child);
      child.material = child.material.clone();
      child.geometry.computeBoundingBox();
      const center = new THREE.Vector3();
      child.geometry.boundingBox.getCenter(center);
      child.userData.origPos = child.position.clone();
      child.userData.centroid = center;

      const n = child.name;
      if (n === 'Nervous_Cranial_Nerves') {
        child.userData.nerveGroup = 'cranial';
      } else if (n.includes('Brachial') || n.includes('UpperLimb')) {
        child.userData.nerveGroup = 'brachial';
      } else if (n.includes('Lumbosacral') || n.includes('LowerLimb')) {
        child.userData.nerveGroup = 'lumbosacral';
      } else {
        child.userData.nerveGroup = 'sympathetic';
      }

      state.materials.set(child.name, child.material.clone());
      state.systemMeshes["System_Nervous"].push(child);
      child.visible = state.systemVisibility["System_Nervous"];
    });
    addAddonScene(gltf.scene);
    console.log('[Viewer] nervous_peripheral.glb loaded: 257 cranial, somatic, and autonomic nerves.');
  }, null, (err) => console.warn('[Viewer] nervous_peripheral.glb load error:', err));
}

// ------------------------------------------------------------------------------
// RESPIRATORY SYSTEM ADDON LOADER (LARYNX, TRACHEOBRONCHIAL TREE, LUNGS)
// ------------------------------------------------------------------------------
function loadRespiratoryModel() {
  const loader = createModularGLTFLoader();
  loader.load('./respiratory_system.glb', (gltf) => {
    ['Organ_Lung_Left', 'Organ_Lung_Right', 'Organ_Trachea'].forEach(k => {
      setCoarseMeshSuppressed(k);
    });

    gltf.scene.traverse((child) => {
      if (!child.isMesh) return;
      state.meshes.set(child.name, child);
      child.material = child.material.clone();
      child.geometry.computeBoundingBox();
      const center = new THREE.Vector3();
      child.geometry.boundingBox.getCenter(center);
      child.userData.origPos = child.position.clone();
      child.userData.centroid = center;

      const n = child.name;
      if (n.startsWith('Resp_Larynx_') || n.includes('Cartilage') || n.includes('Epiglottis')) {
        child.userData.respGroup = 'larynx';
      } else if (n.startsWith('Resp_Trachea') || n.includes('Bronch')) {
        child.userData.respGroup = 'airway';
      } else {
        child.userData.respGroup = 'lungs';
      }

      state.materials.set(child.name, child.material.clone());
      state.systemMeshes["System_Respiratory"].push(child);
      child.visible = state.systemVisibility["System_Respiratory"];
    });
    addAddonScene(gltf.scene);
    console.log('[Viewer] respiratory_system.glb loaded: Larynx, tracheobronchial tree, lungs & lobes.');
  }, null, (err) => console.warn('[Viewer] respiratory_system.glb load error:', err));
}

// ------------------------------------------------------------------------------
// UROGENITAL & RENAL ADDON LOADER (KIDNEYS, ADRENALS, URETERS, BLADDER, GENITAL)
// ------------------------------------------------------------------------------
function loadUrogenitalModel() {
  const loader = createModularGLTFLoader();
  loader.load('./urogenital_system.glb', (gltf) => {
    ['Organ_Kidney_Left', 'Organ_Kidney_Right', 'Organ_Bladder'].forEach(k => {
      setCoarseMeshSuppressed(k);
    });

    gltf.scene.traverse((child) => {
      if (!child.isMesh) return;
      state.meshes.set(child.name, child);
      child.material = child.material.clone();
      child.geometry.computeBoundingBox();
      const center = new THREE.Vector3();
      child.geometry.boundingBox.getCenter(center);
      child.userData.origPos = child.position.clone();
      child.userData.centroid = center;

      const n = child.name;
      if (n.includes('Kidney') || n.includes('Renal')) {
        child.userData.uroGroup = 'kidneys';
      } else if (n.includes('Adrenal') || n.includes('Suprarenal')) {
        child.userData.uroGroup = 'adrenals';
      } else if (n.includes('Ureter') || n.includes('Bladder') || n.includes('Urethra')) {
        child.userData.uroGroup = 'urinary';
      } else {
        child.userData.uroGroup = 'reproductive';
      }

      state.materials.set(child.name, child.material.clone());
      state.systemMeshes["System_Renal"].push(child);
      child.visible = state.systemVisibility["System_Renal"];
    });
    addAddonScene(gltf.scene);
    console.log('[Viewer] urogenital_system.glb loaded: Kidneys, adrenals, ureters, bladder & reproductive.');
  }, null, (err) => console.warn('[Viewer] urogenital_system.glb load error:', err));
}

// ------------------------------------------------------------------------------
// ENDOCRINE & SPECIAL SENSES ADDON LOADER (GLANDS, EYES, AUDITORY APPARATUS)
// ------------------------------------------------------------------------------
function loadEndocrineSensoryModel() {
  const loader = createModularGLTFLoader();
  loader.load('./endocrine_sensory.glb', (gltf) => {
    gltf.scene.traverse((child) => {
      if (!child.isMesh) return;
      state.meshes.set(child.name, child);
      child.material = child.material.clone();
      child.geometry.computeBoundingBox();
      const center = new THREE.Vector3();
      child.geometry.boundingBox.getCenter(center);
      child.userData.origPos = child.position.clone();
      child.userData.centroid = center;

      const n = child.name;
      if (n.startsWith('Endo_') || n.includes('Gland') || n.includes('Thymus') || n.includes('Pituitary') || n.includes('Thyroid')) {
        child.userData.endoGroup = 'glands';
      } else if (n.includes('Eye') || n.includes('Oculi') || n.includes('Cornea') || n.includes('Lens')) {
        child.userData.endoGroup = 'eyes';
      } else {
        child.userData.endoGroup = 'ears';
      }

      state.materials.set(child.name, child.material.clone());
      state.systemMeshes["System_Endocrine"].push(child);
      child.visible = state.systemVisibility["System_Endocrine"];
    });
    addAddonScene(gltf.scene);
    console.log('[Viewer] endocrine_sensory.glb loaded: Pituitary, thyroid, thymus, eyes & auditory apparatus.');
  }, null, (err) => console.warn('[Viewer] endocrine_sensory.glb load error:', err));
}

// ------------------------------------------------------------------------------
// CENTRAL NERVOUS SYSTEM (CNS) ADDON LOADER (13 REGIONAL BRAIN/SPINE NODES)
// ------------------------------------------------------------------------------
function loadBrainCNSModel() {
  const loader = createModularGLTFLoader();
  loader.load('./brain_cns.glb', (gltf) => {
    setCoarseMeshSuppressed('Organ_Brain');

    gltf.scene.traverse((child) => {
      if (!child.isMesh) return;
      state.meshes.set(child.name, child);
      child.material = child.material.clone();
      child.geometry.computeBoundingBox();
      const center = new THREE.Vector3();
      child.geometry.boundingBox.getCenter(center);
      child.userData.origPos = child.position.clone();
      child.userData.centroid = center;

      const n = child.name;
      if (n.startsWith('CNS_Cerebrum_')) {
        child.userData.nerveGroup = 'cortex';
      } else if (n === 'CNS_Brainstem' || n === 'CNS_Cerebellum') {
        child.userData.nerveGroup = 'brainstem';
      } else if (n === 'CNS_Ventricular_System') {
        child.userData.nerveGroup = 'ventricles';
      } else if (n === 'CNS_SpinalCord_Meninges') {
        child.userData.nerveGroup = 'spinalcord';
      } else {
        child.userData.nerveGroup = 'deepgray';
      }

      state.materials.set(child.name, child.material.clone());
      state.systemMeshes["System_Nervous"].push(child);
      child.visible = state.systemVisibility["System_Nervous"];
    });
    addAddonScene(gltf.scene);
    console.log('[Viewer] brain_cns.glb loaded: 13 cerebral, limbic, brainstem & ventricular nodes.');
  }, null, (err) => console.warn('[Viewer] brain_cns.glb load error:', err));
}

// ------------------------------------------------------------------------------
// CARDIOVASCULAR CORE: HEART & CORONARY CIRCULATION (11 NODES)
// ------------------------------------------------------------------------------
function loadHeartCoronaryModel() {
  const loader = createModularGLTFLoader();
  loader.load('./heart_coronary.glb', (gltf) => {
    setCoarseMeshSuppressed('Organ_Heart');

    gltf.scene.traverse((child) => {
      if (!child.isMesh) return;
      state.meshes.set(child.name, child);
      child.material = child.material.clone();
      child.geometry.computeBoundingBox();
      const center = new THREE.Vector3();
      child.geometry.boundingBox.getCenter(center);
      child.userData.origPos = child.position.clone();
      child.userData.centroid = center;

      const n = child.name;
      if (n.includes('Atrium')) {
        child.userData.cardiacGroup = 'atria';
      } else if (n.includes('Ventricle')) {
        child.userData.cardiacGroup = 'ventricles';
      } else if (n.includes('Valve') || n.includes('Papillary')) {
        child.userData.cardiacGroup = 'valves';
      } else {
        child.userData.cardiacGroup = 'coronary';
      }

      state.materials.set(child.name, child.material.clone());
      state.systemMeshes["System_Cardiovascular"].push(child);
      child.visible = state.systemVisibility["System_Cardiovascular"];
    });
    addAddonScene(gltf.scene);
    console.log('[Viewer] heart_coronary.glb loaded: 11 cardiac chambers, valves & coronary vessels.');
  }, null, (err) => console.warn('[Viewer] heart_coronary.glb load error:', err));
}

// ------------------------------------------------------------------------------
// LYMPHATIC & IMMUNE SYSTEM ADDON LOADER (SPLEEN, TONSILS, DUCTS, 240+ NODES)
// ------------------------------------------------------------------------------
function loadLymphaticModel() {
  const loader = createModularGLTFLoader();
  loader.load('./lymphatic_system.glb', (gltf) => {
    setCoarseMeshSuppressed('Organ_Spleen');

    gltf.scene.traverse((child) => {
      if (!child.isMesh) return;
      state.meshes.set(child.name, child);
      child.material = child.material.clone();
      child.geometry.computeBoundingBox();
      const center = new THREE.Vector3();
      child.geometry.boundingBox.getCenter(center);
      child.userData.origPos = child.position.clone();
      child.userData.centroid = center;

      const n = child.name;
      if (n.includes('Spleen') || n.includes('Tonsils')) {
        child.userData.lymphGroup = 'organs';
      } else if (n.includes('Ducts')) {
        child.userData.lymphGroup = 'ducts';
      } else {
        child.userData.lymphGroup = 'nodes';
      }

      state.materials.set(child.name, child.material.clone());
      state.systemMeshes["System_Lymphatic"].push(child);
      child.visible = state.systemVisibility["System_Lymphatic"];
    });
    addAddonScene(gltf.scene);
    console.log('[Viewer] lymphatic_system.glb loaded: Spleen, tonsils, thoracic duct & regional lymph node chains.');
  }, null, (err) => console.warn('[Viewer] lymphatic_system.glb load error:', err));
}

// ------------------------------------------------------------------------------
// ARTICULAR SYSTEM ADDON LOADER (LIGAMENTS, MENISCI, LABRA & CAPSULES)
// ------------------------------------------------------------------------------
function loadArticularLigamentsModel() {
  const loader = createModularGLTFLoader();
  loader.load('./ligaments_arthrology.glb', (gltf) => {
    gltf.scene.traverse((child) => {
      if (!child.isMesh) return;
      state.meshes.set(child.name, child);
      child.material = child.material.clone();
      child.geometry.computeBoundingBox();
      const center = new THREE.Vector3();
      child.geometry.boundingBox.getCenter(center);
      child.userData.origPos = child.position.clone();
      child.userData.centroid = center;

      const n = child.name;
      if (n === 'Ligaments_Spine') {
        child.userData.articularGroup = 'spine';
      } else if (n === 'Ligaments_Thorax_Pelvis') {
        child.userData.articularGroup = 'torso';
      } else if (n === 'Ligaments_Upper_Limb') {
        child.userData.articularGroup = 'upper';
      } else if (n === 'Ligaments_Lower_Limb') {
        child.userData.articularGroup = 'lower';
      } else {
        child.userData.articularGroup = 'menisci';
      }

      state.materials.set(child.name, child.material.clone());
      state.systemMeshes["System_Articular"].push(child);
      child.visible = state.systemVisibility["System_Articular"];
    });
    addAddonScene(gltf.scene);
    console.log('[Viewer] ligaments_arthrology.glb loaded: 5 articular groups (spine, thorax, limbs & menisci).');
  }, null, (err) => console.warn('[Viewer] ligaments_arthrology.glb load error:', err));
}

// ------------------------------------------------------------------------------
// AXIAL & TORSO MUSCULATURE ADDON LOADER (9 COMPREHENSIVE REGIONS)
// ------------------------------------------------------------------------------
function loadAxialMusclesModel() {
  const loader = createModularGLTFLoader();
  loader.load('./muscles_axial_torso.glb', (gltf) => {
    ['Muscle_Pectoralis', 'Muscle_RectusAbdominis', 'Muscle_Diaphragm', 'Muscle_Trapezius', 'Muscle_LatissimusDorsi'].forEach(k => {
      setCoarseMeshSuppressed(k);
    });

    gltf.scene.traverse((child) => {
      if (!child.isMesh) return;
      state.meshes.set(child.name, child);
      child.material = child.material.clone();
      child.geometry.computeBoundingBox();
      const center = new THREE.Vector3();
      child.geometry.boundingBox.getCenter(center);
      child.userData.origPos = child.position.clone();
      child.userData.centroid = center;

      const n = child.name;
      if (n.includes('Head') || n.includes('Neck')) {
        child.userData.muscleGroup = 'headneck';
      } else if (n.includes('Thoracic') || n.includes('Diaphragm')) {
        child.userData.muscleGroup = 'thorax';
      } else if (n.includes('Abdominal')) {
        child.userData.muscleGroup = 'abdomen';
      } else if (n.includes('Back')) {
        child.userData.muscleGroup = 'back';
      } else {
        child.userData.muscleGroup = 'pelvis';
      }

      state.materials.set(child.name, child.material.clone());
      state.systemMeshes["System_Muscular"].push(child);
      child.visible = state.systemVisibility["System_Muscular"];
    });
    addAddonScene(gltf.scene);
    console.log('[Viewer] muscles_axial_torso.glb loaded: 9 axial muscular groups (facial, neck, torso, abdomen, back & pelvic floor).');
  }, null, (err) => console.warn('[Viewer] muscles_axial_torso.glb load error:', err));
}

// ------------------------------------------------------------------------------
// APPENDICULAR MUSCULATURE ADDON LOADER (UPPER & LOWER LIMBS)
// ------------------------------------------------------------------------------
function loadAppendicularMusclesModel() {
  const loader = createModularGLTFLoader();
  loader.load('./muscles_appendicular.glb', (gltf) => {
    ['Muscle_Deltoid', 'Muscle_BicepsBrachii', 'Muscle_GluteusMaximus', 'Muscle_QuadricepsFemoris', 'Muscle_Gastrocnemius'].forEach(k => {
      setCoarseMeshSuppressed(k);
    });

    gltf.scene.traverse((child) => {
      if (!child.isMesh) return;
      state.meshes.set(child.name, child);
      child.material = child.material.clone();
      child.geometry.computeBoundingBox();
      const center = new THREE.Vector3();
      child.geometry.boundingBox.getCenter(center);
      child.userData.origPos = child.position.clone();
      child.userData.centroid = center;

      const n = child.name;
      child.userData.muscleGroup = n.includes('Upper') ? 'upperlimb' : 'lowerlimb';

      state.materials.set(child.name, child.material.clone());
      state.systemMeshes["System_Muscular"].push(child);
      child.visible = state.systemVisibility["System_Muscular"];
    });
    addAddonScene(gltf.scene);
    console.log('[Viewer] muscles_appendicular.glb loaded: Upper & lower limb appendicular musculature.');
  }, null, (err) => console.warn('[Viewer] muscles_appendicular.glb load error:', err));
}

// ------------------------------------------------------------------------------
// DEEP FASCIAL COMPARTMENTS & APONEUROSES ADDON LOADER
// ------------------------------------------------------------------------------
function loadFasciaCompartmentsModel() {
  const loader = createModularGLTFLoader();
  loader.load('./fascia_compartments.glb', (gltf) => {
    gltf.scene.traverse((child) => {
      if (!child.isMesh) return;
      state.meshes.set(child.name, child);
      child.material = child.material.clone();
      child.geometry.computeBoundingBox();
      const center = new THREE.Vector3();
      child.geometry.boundingBox.getCenter(center);
      child.userData.origPos = child.position.clone();
      child.userData.centroid = center;

      const n = child.name;
      if (n.includes('Head') || n.includes('Neck')) {
        child.userData.fasciaGroup = 'headneck';
      } else if (n.includes('Trunk')) {
        child.userData.fasciaGroup = 'trunk';
      } else if (n.includes('Upper')) {
        child.userData.fasciaGroup = 'upper';
      } else {
        child.userData.fasciaGroup = 'lower';
      }

      state.materials.set(child.name, child.material.clone());
      state.systemMeshes["System_Fascia"].push(child);
      child.visible = state.systemVisibility["System_Fascia"];
    });
    addAddonScene(gltf.scene);
    console.log('[Viewer] fascia_compartments.glb loaded: Deep fascia, aponeuroses & retinacula.');
  }, null, (err) => console.warn('[Viewer] fascia_compartments.glb load error:', err));
}

function loadAddonModels() {
  if (state.currentModel !== 'human_anatomy_commercial.glb') {
    return; // Dedicated sub-models load their own focused assets
  }
  loadSkinFasciaModel();
  loadHandFootModel();
  loadSkullBonesModel();
  loadPostcranialSkeletonModel();
  loadUpperGIModel();
  loadLowerBowelModel();
  loadPeripheralVascularModel();
  loadPeripheralNervousModel();
  loadRespiratoryModel();
  loadUrogenitalModel();
  loadEndocrineSensoryModel();
  loadBrainCNSModel();
  loadHeartCoronaryModel();
  loadLymphaticModel();
  loadArticularLigamentsModel();
  loadAxialMusclesModel();
  loadAppendicularMusclesModel();
  loadFasciaCompartmentsModel();
}

// ------------------------------------------------------------------------------
// INTERACTIVE RAYCASTING & ORGAN INSPECTION
// ------------------------------------------------------------------------------
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function isPrimaryPickMesh(mesh) {
  if (!mesh.visible || state.hiddenMeshes.has(mesh.name)) return false;
  if (mesh.name === 'Skin_Body' || mesh.name.startsWith('Anatomy_')) return false;
  if (isMeshInSystem(mesh, "System_Integumentary") || isMeshInSystem(mesh, "System_OuterShell")) return false;
  return true;
}

function onPointerMove(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  if (!state.model) return;

  raycaster.setFromCamera(mouse, camera);
  const meshList = Array.from(state.meshes.values()).filter(m => m.visible && !state.hiddenMeshes.has(m.name));
  
  // Prioritize internal organs over outer shell for precise hover
  const internalMeshes = meshList.filter(isPrimaryPickMesh);
  let intersects = raycaster.intersectObjects(internalMeshes, false);
  
  if (intersects.length === 0) {
    intersects = raycaster.intersectObjects(meshList, false);
  }

  if (intersects.length > 0) {
    const topHit = intersects[0].object;
    if (state.hoveredMesh !== topHit) {
      resetHover();
      state.hoveredMesh = topHit;
      document.body.style.cursor = 'pointer';
      
      // Subtle emissive highlight on hover
      if (state.hoveredMesh.material && state.hoveredMesh.material.emissive) {
        state.hoveredMesh.material.emissive.set(0x00f0ff);
        state.hoveredMesh.material.emissiveIntensity = 0.6;
      }
    }
  } else {
    resetHover();
  }
}

function resetHover() {
  if (state.hoveredMesh) {
    if (state.hoveredMesh !== state.selectedMesh && state.hoveredMesh.material && state.hoveredMesh.material.emissive) {
      const orig = state.materials.get(state.hoveredMesh.name);
      state.hoveredMesh.material.emissive.copy(orig.emissive || new THREE.Color(0, 0, 0));
      state.hoveredMesh.material.emissiveIntensity = orig.emissiveIntensity || 0;
    }
    state.hoveredMesh = null;
    document.body.style.cursor = 'default';
  }
}

function onPointerClick(event) {
  // Avoid clicks on HUD overlays
  if (event.target.closest('.glass-panel')) return;

  if (state.hoveredMesh) {
    selectOrgan(state.hoveredMesh.name, true);
  }
}

window.addEventListener('pointermove', onPointerMove);
window.addEventListener('click', onPointerClick);

// Dynamic clinical resolver for systematic naming patterns
function getAnatomyInfo(meshName) {
  if (ANATOMY_DATABASE[meshName]) return ANATOMY_DATABASE[meshName];

  // 1. Ribs
  if (meshName.startsWith("Bone_Rib_")) {
    const parts = meshName.replace("Bone_Rib_", "").split("_");
    const num = parseInt(parts[0]);
    const side = parts[1] === "L" ? "Left" : "Right";
    const type = num <= 7 ? "True rib (costa vera)" : (num <= 10 ? "False rib (costa spuria)" : "Floating rib (costa fluctuans)");
    return {
      ta2: `Costa ${num} ${side.toLowerCase()} (TA2: 590)`,
      system: "System_Skeletal",
      sysLabel: "Skeletal / Thoracic Cage",
      func: `Protects mediastinal and upper abdominal viscera while articulating dynamically during bucket-handle respiratory excursion. Categorized as a ${type}.`,
      landmarks: `Head with articular demifacets, neck, tubercle articulating with transverse process, costal angle, and costal groove carrying intercostal neurovascular bundle (VAN).`,
      clinical: `Rib fractures risk lacerating underlying pleura/lung causing pneumothorax or hemothorax; intercostal nerve block targeted at inferior costal margin.`
    };
  }
  // 2. Costal Cartilages
  if (meshName.startsWith("Cartilage_Costal_")) {
    const parts = meshName.replace("Cartilage_Costal_", "").split("_");
    const num = parseInt(parts[0]);
    const side = parts[1] === "L" ? "Left" : "Right";
    return {
      ta2: `Cartilago costalis ${num} ${side.toLowerCase()} (TA2: 620)`,
      system: "System_Skeletal",
      sysLabel: "Skeletal / Costal Cartilage",
      func: `Hyaline cartilage bar extending the ribs anteriorly to provide elastic compliance to the thoracic cage during ventilation.`,
      landmarks: `Costochondral junction laterally, sternochondral articulation medially (ribs 1-7) or forming costal margin (ribs 8-10).`,
      clinical: `Costochondritis (Tietze syndrome) presenting as reproducible anterior chest wall pain mimicking acute coronary syndrome.`
    };
  }
  // 3. Vertebrae
  if (meshName.startsWith("Bone_Vertebra_")) {
    const code = meshName.replace("Bone_Vertebra_", "");
    let region = "Vertebra";
    if (code.startsWith("C")) region = "Cervical";
    else if (code.startsWith("T")) region = "Thoracic";
    else if (code.startsWith("L")) region = "Lumbar";
    return {
      ta2: `Vertebra ${code} (TA2: 480)`,
      system: "System_Skeletal",
      sysLabel: `Skeletal / ${region} Spine`,
      func: `Weight-bearing axial structural segment transmitting body mass, providing muscle lever arms, and enclosing the spinal canal to shield the spinal cord/cauda equina.`,
      landmarks: `Vertebral body, pedicles, laminae forming neural arch, superior/inferior articular processes (facet joints), spinous process, and transverse processes.`,
      clinical: `Compression fractures in osteoporosis, spondylolysis/spondylolisthesis, pedicle screw placement in spinal instrumentation, facet joint arthropathy.`
    };
  }
  // 4. Intervertebral Discs
  if (meshName.startsWith("Cartilage_IV_Disc_")) {
    const code = meshName.replace("Cartilage_IV_Disc_", "");
    return {
      ta2: `Discus intervertebralis ${code} (TA2: 495)`,
      system: "System_Skeletal",
      sysLabel: "Skeletal / Intervertebral Fibrocartilage",
      func: `Symphysial fibrocartilaginous shock absorber with gelatinous inner nucleus pulposus and concentric fibrous outer anulus fibrosus.`,
      landmarks: `Anulus fibrosus lamellae, central nucleus pulposus, cartilaginous vertebral endplates.`,
      clinical: `Posterolateral disc herniation impinging traversing/exiting nerve roots; degenerative disc disease; discogenic radiculopathy (e.g. sciatica).`
    };
  }
  // 5. Extremity / Limb Bones
  if (meshName.startsWith("Bone_")) {
    const raw = meshName.replace("Bone_", "");
    const isL = raw.endsWith("_L");
    const isR = raw.endsWith("_R");
    const baseName = raw.replace(/_[LR]$/, "");
    const side = isL ? "Left " : (isR ? "Right " : "");
    return {
      ta2: `Os ${baseName.toLowerCase()} ${side.toLowerCase()}(TA2)`,
      system: "System_Skeletal",
      sysLabel: "Skeletal / Appendicular Skeleton",
      func: `Load-bearing long/flat bone providing structural rigidity, articular surfaces for joint kinematics, and attachment levers for skeletal muscle locomotion.`,
      landmarks: `Cortical bone shaft (diaphysis), metaphyseal trabeculae, epiphysis with articular hyaline cartilage, nutrient foramen.`,
      clinical: `Fracture management, osteosynthesis with intramedullary nails or plating, avascular necrosis, stress fracture.`
    };
  }

  // 6. Respiratory System
  if (meshName.startsWith("Resp_")) {
    if (meshName.includes("Larynx") || meshName.includes("Cartilage") || meshName.includes("Epiglottis")) {
      return {
        ta2: `${meshName.replace("Resp_Larynx_", "")} (TA2: 3000)`,
        system: "System_Respiratory",
        sysLabel: "Respiratory / Laryngeal Apparatus",
        func: "Cartilaginous and fibroelastic framework shielding the vocal apparatus, regulating phonation, and sealing the airway during swallowing.",
        landmarks: "Laryngeal prominence (Adam's apple), cricoid ring, vocal process of arytenoids, epiglottic cartilage petiole.",
        clinical: "Emergency cricothyroidotomy access window between cricoid and thyroid cartilages; laryngeal edema."
      };
    } else if (meshName.includes("Trachea") || meshName.includes("Bronch")) {
      return {
        ta2: "Trachea et bronchi (TA2: 3080)",
        system: "System_Respiratory",
        sysLabel: "Respiratory / Tracheobronchial Conduits",
        func: "Conducting airway tubes distributing humidified, filtered inspired air down into segmental bronchi and alveoli.",
        landmarks: "C-shaped cartilaginous tracheal rings, carina tracheae, right main bronchus (wider, more vertical), left main bronchus.",
        clinical: "Aspiration foreign body predilection for right bronchus; tracheostomy between 2nd and 3rd tracheal rings."
      };
    } else {
      return {
        ta2: "Pulmo (TA2: 3100)",
        system: "System_Respiratory",
        sysLabel: "Respiratory / Pulmonary Parenchyma",
        func: "Essential organ of respiration executing alveolar gas exchange, oxygenation of venous blood, and clearance of carbon dioxide.",
        landmarks: "Apex, base/diaphragmatic surface, costal surface, mediastinal hilum, horizontal and oblique fissures.",
        clinical: "Pneumonia, COPD, pulmonary embolism, tension pneumothorax requiring urgent needle decompression."
      };
    }
  }

  // 7. Urogenital System
  if (meshName.startsWith("Uro_")) {
    if (meshName.includes("Kidney") || meshName.includes("Renal")) {
      return {
        ta2: "Ren (TA2: 3101)",
        system: "System_Renal",
        sysLabel: "Renal / Kidney Architecture",
        func: "Filters metabolic nitrogenous waste (urea, creatinine) from blood, regulates electrolyte and acid-base homeostasis, and produces erythropoietin.",
        landmarks: "Renal cortex, medullary pyramids, minor/major calyces, renal pelvis, renal hilum with renal vein, artery, and pelvis.",
        clinical: "Acute kidney injury, chronic kidney disease, nephrolithiasis, renal cell carcinoma (clear cell variant)."
      };
    } else if (meshName.includes("Adrenal") || meshName.includes("Suprarenal")) {
      return {
        ta2: "Glandula suprarenalis (TA2: 3120)",
        system: "System_Renal",
        sysLabel: "Endocrine / Adrenal Gland",
        func: "Cortex secretes mineralocorticoids (aldosterone), glucocorticoids (cortisol), and androgens; medulla secretes catecholamines (epinephrine, norepinephrine).",
        landmarks: "Pyramidal right gland, semilunar left gland, capped over superior renal poles, retroperitoneal fat pad.",
        clinical: "Cushing syndrome (hypercortisolism), Addison disease (adrenal insufficiency), pheochromocytoma."
      };
    } else if (meshName.includes("Ureter") || meshName.includes("Bladder") || meshName.includes("Urethra")) {
      return {
        ta2: "Tractus urinarius (TA2: 3200)",
        system: "System_Renal",
        sysLabel: "Renal / Urinary Excretory Tract",
        func: "Transports urine via ureteral peristalsis from renal pelves to the bladder; detrusor contracts during micturition.",
        landmarks: "Ureteric pelvic brim crossing, bladder trigone, ureteral orifices, internal/external urethral sphincters.",
        clinical: "Ureteral calculi impaction sites (ureteropelvic junction, pelvic brim, ureterovesical junction); cystitis."
      };
    } else {
      return {
        ta2: "Organa genitalia (TA2: 3300)",
        system: "System_Renal",
        sysLabel: "Urogenital / Reproductive System",
        func: "Primary and accessory reproductive organs driving gametogenesis, endocrine sex steroid synthesis, and copulation.",
        landmarks: "Prostate capsule, peripheral zone, seminal vesicles, pampiniform venous plexus, testicular tunica albuginea.",
        clinical: "Benign prostatic hyperplasia (BPH) in transition zone; prostate adenocarcinoma in peripheral zone; testicular torsion."
      };
    }
  }

  // 8. Endocrine & Special Senses
  if (meshName.startsWith("Endo_") || meshName.startsWith("Sens_")) {
    if (meshName.includes("Pituitary") || meshName.includes("Hypophysis")) {
      return {
        ta2: "Hypophysis / Glandula pituitaria (TA2: 3400)",
        system: "System_Endocrine",
        sysLabel: "Endocrine / Master Pituitary Gland",
        func: "Master endocrine regulator: adenohypophysis secretes ACTH, TSH, GH, LH, FSH, PRL; neurohypophysis stores ADH and oxytocin.",
        landmarks: "Sits within sella turcica of sphenoid bone, infundibular stalk connecting to hypothalamus.",
        clinical: "Pituitary adenoma compressing optic chiasm causing bitemporal hemianopsia."
      };
    } else if (meshName.includes("Thyroid")) {
      return {
        ta2: "Glandula thyroidea (TA2: 3450)",
        system: "System_Endocrine",
        sysLabel: "Endocrine / Thyroid Gland",
        func: "Synthesizes triiodothyronine (T3) and thyroxine (T4) regulating basal metabolic rate; C-cells secrete calcitonin.",
        landmarks: "Right and left lobes connected across trachea by central isthmus (at tracheal rings 2-4).",
        clinical: "Hyperthyroidism (Graves disease), hypothyroidism (Hashimoto thyroiditis), thyroidectomy with risk to recurrent laryngeal nerve."
      };
    } else if (meshName.includes("Eye") || meshName.includes("Eyeball") || meshName.includes("Oculi")) {
      return {
        ta2: "Bulbus oculi (TA2: 6100)",
        system: "System_Endocrine",
        sysLabel: "Special Senses / Visual Apparatus",
        func: "Focuses light through refracting media (cornea, aqueous humor, lens, vitreous) onto retina to generate phototransduction signals.",
        landmarks: "Cornea, sclera, iris, pupil, crystalline lens, retina, fovea centralis, extraocular rectus and oblique muscles.",
        clinical: "Cataract (lens opacification), glaucoma (elevated intraocular pressure), retinal detachment."
      };
    } else {
      return {
        ta2: "Organum vestibulocochleare (TA2: 6300)",
        system: "System_Endocrine",
        sysLabel: "Special Senses / Auditory & Vestibular",
        func: "Ossicular chain mechanically amplifies sound waves to oval window; cochlear hair cells transduce sound; semicircular canals sense angular acceleration.",
        landmarks: "Malleus, incus, stapes, cochlea (scala vestibuli/tympani/media), semicircular ducts (anterior, posterior, lateral).",
        clinical: "Otosclerosis causing conductive hearing loss; benign paroxysmal positional vertigo (BPPV); sensorineural hearing loss."
      };
    }
  }

  // 9. Central Nervous System (CNS)
  if (meshName.startsWith("CNS_")) {
    return {
      ta2: `${meshName.replace("CNS_", "")} (TA2: 5200)`,
      system: "System_Nervous",
      sysLabel: "Nervous / Central Nervous System",
      func: "Central neural command processing, sensorimotor integration, cognition, and CSF circulation.",
      landmarks: "Cortical sulci/gyri, subcortical gray nuclei, ventricular foramina, brainstem pyramids, spinal cord tracts.",
      clinical: "Ischemic/hemorrhagic stroke, neurodegenerative syndromes, hydrocephalus, traumatic brain injury."
    };
  }

  // 10. Cardiac & Coronary Apparatus
  if (meshName.startsWith("Heart_")) {
    return {
      ta2: `${meshName.replace("Heart_", "")} (TA2: 3950)`,
      system: "System_Cardiovascular",
      sysLabel: "Cardiovascular / Cardiac Architecture",
      func: "Myocardial muscular pump generating systemic and pulmonary blood flow via synchronized electrophysiology and valvular competence.",
      landmarks: "Atria, ventricles, semilunar & atrioventricular valves, papillary muscles, coronary arterial & venous trees.",
      clinical: "Myocardial infarction, valvular stenosis/regurgitation, heart failure, arrhythmia."
    };
  }

  // 11. Lymphatic & Immune System
  if (meshName.startsWith("Lymph_")) {
    return {
      ta2: `${meshName.replace("Lymph_", "")} (TA2: 4050)`,
      system: "System_Lymphatic",
      sysLabel: "Lymphatic / Immune Defense System",
      func: "Immune surveillance, lymphocyte maturation, antigen presentation, tissue fluid drainage, and chylomicron lipid transport.",
      landmarks: "Splenic pulp, Waldeyer tonsillar ring, thoracic duct, regional lymph node chains (cervical, axillary, mesenteric, inguinal).",
      clinical: "Lymphadenopathy, metastatic tumor staging (sentinel node), lymphedema, splenomegaly, lymphoma."
    };
  }

  // 12. Articular System (Joint Ligaments & Menisci)
  if (meshName.startsWith("Ligaments_") || meshName.startsWith("Articular_")) {
    return {
      ta2: `${meshName} (TA2: 2500)`,
      system: "System_Articular",
      sysLabel: "Articular / Joint Ligaments & Fibrocartilage",
      func: "Provides passive joint stability, guides biomechanical kinematics, prevents pathological translation, and absorbs shock via fibrocartilaginous menisci.",
      landmarks: "Cruciate ligaments (ACL/PCL), collaterals, glenoid/acetabular labra, menisci, capsular thickenings, spinal flava.",
      clinical: "Ligamentous rupture/sprain (ACL tear, ATFL ankle inversion), meniscal tears (bucket-handle), joint dislocation."
    };
  }

  // 13. Muscular System (Axial & Appendicular)
  if (meshName.startsWith("Muscles_")) {
    return {
      ta2: `${meshName.replace("Muscles_", "")} (TA2: 2000)`,
      system: "System_Muscular",
      sysLabel: "Muscular / Skeletal Musculature",
      func: "Converts chemical ATP energy into mechanical contractile tension to execute voluntary joint movement, postural maintenance, and thermogenesis.",
      landmarks: "Striated muscle bellies, tendinous origins/insertions, fascial septa, myofascial trigger points.",
      clinical: "Muscle strain, compartment syndrome, muscular dystrophy, myasthenia gravis, tendinopathy."
    };
  }

  // 14. Deep Fascial Compartments
  if (meshName.startsWith("Fascia_")) {
    return {
      ta2: `${meshName.replace("Fascia_", "")} (TA2: 1900)`,
      system: "System_Fascia",
      sysLabel: "Fascia / Deep Fascial Architecture",
      func: "Envelopes muscular compartments, transmits myofascial tension vectors, reduces muscular friction, and guides neurovascular bundles.",
      landmarks: "Deep investing fascia, aponeurotic sheets (galea, rectus sheath, thoracolumbar, plantar), retinacular pulleys.",
      clinical: "Fasciotomy for acute compartment syndrome, plantar fasciitis, myofascial pain syndrome, hernia defect."
    };
  }

  return {
    ta2: `${meshName} (TA2 Standard)`,
    system: "Anatomical Structure",
    sysLabel: "Human Anatomy",
    func: "Specialized anatomical sub-mesh configured for medical visualization.",
    landmarks: "Physiological contours and surface striations.",
    clinical: "Clinical evaluation."
  };
}

// Select and focus an organ
function selectOrgan(meshName, animateCamera = true) {
  const mesh = state.meshes.get(meshName);
  if (!mesh) return;

  // Clear previous selected highlight
  if (state.selectedMesh && state.selectedMesh.material && state.selectedMesh.material.emissive) {
    const orig = state.materials.get(state.selectedMesh.name);
    state.selectedMesh.material.emissive.copy(orig.emissive || new THREE.Color(0, 0, 0));
    state.selectedMesh.material.emissiveIntensity = orig.emissiveIntensity || 0;
  }

  state.selectedMesh = mesh;

  // Set highlight emissive glow
  if (mesh.material && mesh.material.emissive) {
    mesh.material.emissive.set(0x00f0ff);
    mesh.material.emissiveIntensity = 0.9;
  }

  // Populate Inspector Card
  const info = getAnatomyInfo(meshName);

  document.getElementById('insp-system').textContent = info.sysLabel.toUpperCase();
  document.getElementById('insp-name').textContent = meshName;
  document.getElementById('insp-latin').textContent = info.ta2;
  document.getElementById('insp-function').textContent = info.func;
  document.getElementById('insp-landmarks').textContent = info.landmarks;
  document.getElementById('insp-clinical').textContent = info.clinical;

  // Camera smooth focus
  if (animateCamera) {
    focusOnMesh(mesh);
  }
  if (state.isIsolated) applyIsolation();

  // Bi-directional sync with Virtual Histology Lab
  if (window.VirtualHistology && typeof window.VirtualHistology.syncFrom3D === 'function') {
    window.VirtualHistology.syncFrom3D(meshName);
  }
}

// Smooth camera focus animation
function focusOnMesh(mesh) {
  const box = new THREE.Box3().setFromObject(mesh);
  const center = new THREE.Vector3();
  box.getCenter(center);
  const size = new THREE.Vector3();
  box.getSize(size);
  const maxDim = Math.max(size.x, size.y, size.z);
  const dist = Math.max(0.45, maxDim * 2.8);

  const startTarget = controls.target.clone();
  const endTarget = center.clone();

  const dir = camera.position.clone().sub(controls.target).normalize();
  const startPos = camera.position.clone();
  const endPos = endTarget.clone().add(dir.multiplyScalar(dist));

  state.cameraTransition = {
    startTime: performance.now(),
    duration: 850,
    startPos,
    endPos,
    startTarget,
    endTarget
  };
}

// ------------------------------------------------------------------------------
// SYSTEM VISIBILITY & X-RAY CONTROLS
// ------------------------------------------------------------------------------
const coarseReplacedMeshes = new Set([
  'Skeletal_Skull',
  'Skeletal_Spine',
  'Skeletal_Ribcage',
  'Skeletal_Pelvis',
  'Organ_Stomach',
  'Organ_Liver',
  'Organ_Gallbladder',
  'Organ_Intestines',
  'Organ_Lung_Left',
  'Organ_Lung_Right',
  'Organ_Trachea',
  'Organ_Kidney_Left',
  'Organ_Kidney_Right',
  'Organ_Bladder'
]);

function setSystemVisibility(systemKey, visible) {
  state.systemVisibility[systemKey] = visible;
  applyVisibility();
}

// Setup Event Listeners for System Toggles
Object.keys(state.systemVisibility).forEach(sysKey => {
  const toggle = document.getElementById(`toggle-${sysKey}`);
  if (toggle) {
    toggle.addEventListener('change', (e) => {
      setSystemVisibility(sysKey, e.target.checked);
    });
  }
});

// Integumentary sub-layer toggles
function bindIntegumentarySubToggle(subId, meshNamePrefix) {
  const el = document.getElementById(subId);
  if (!el) return;
  el.addEventListener('change', (e) => {
    applyVisibility();
  });
}
bindIntegumentarySubToggle('sub-Fascia_Superficial', 'Fascia_Superficial');
bindIntegumentarySubToggle('sub-Fascia_Deep',        'Fascia_Deep_');

// Hand & Foot sub-layer toggles
function bindHandFootSubToggle(subId, groupTag) {
  const el = document.getElementById(subId);
  if (!el) return;
  el.addEventListener('change', (e) => {
    applyVisibility();
  });
}
bindHandFootSubToggle('sub-hf-carpal',       'carpal');
bindHandFootSubToggle('sub-hf-metacarpal',   'metacarpal');
bindHandFootSubToggle('sub-hf-phalanx-hand', 'phalanx_hand');
bindHandFootSubToggle('sub-hf-forearm-musc', 'forearm_musc');
bindHandFootSubToggle('sub-hf-forearm-tend', 'forearm_tend');
bindHandFootSubToggle('sub-hf-tarsal',       'tarsal');
bindHandFootSubToggle('sub-hf-metatarsal',   'metatarsal');
bindHandFootSubToggle('sub-hf-phalanx-foot', 'phalanx_foot');
bindHandFootSubToggle('sub-hf-foot-tend',    'foot_tend');

// Skeletal sub-layer toggles
function bindSkeletalSubToggle(subId, groupTag) {
  const el = document.getElementById(subId);
  if (!el) return;
  el.addEventListener('change', (e) => {
    applyVisibility();
  });
}
bindSkeletalSubToggle('sub-skel-skull',      'skull');
bindSkeletalSubToggle('sub-skel-spine',      'spine');
bindSkeletalSubToggle('sub-skel-thorax',     'thorax');
bindSkeletalSubToggle('sub-skel-upperlimbs', 'upperlimb');
bindSkeletalSubToggle('sub-skel-lowerlimbs', 'lowerlimb');

// Cardiovascular sub-layer toggles
function bindCardiovascularSubToggle(subId, target) {
  const el = document.getElementById(subId);
  if (!el) return;
  el.addEventListener('change', (e) => {
    applyVisibility();
  });
}
bindCardiovascularSubToggle('sub-vasc-heart',    'heart');
bindCardiovascularSubToggle('sub-vasc-arterial', 'arterial');
bindCardiovascularSubToggle('sub-vasc-venous',   'venous');

// Nervous sub-layer toggles
function bindNervousSubToggle(subId, target) {
  const el = document.getElementById(subId);
  if (!el) return;
  el.addEventListener('change', (e) => {
    applyVisibility();
  });
}
bindNervousSubToggle('sub-nerve-brain',       'brain');
bindNervousSubToggle('sub-nerve-cranial',     'cranial');
bindNervousSubToggle('sub-nerve-brachial',    'brachial');
bindNervousSubToggle('sub-nerve-lumbosacral', 'lumbosacral');
bindNervousSubToggle('sub-nerve-sympathetic', 'sympathetic');

// Digestive sub-layer toggles
function bindDigestiveSubToggle(subId, groupTag) {
  const el = document.getElementById(subId);
  if (!el) return;
  el.addEventListener('change', (e) => {
    applyVisibility();
  });
}
bindDigestiveSubToggle('sub-gi-upper',         'upper');
bindDigestiveSubToggle('sub-gi-hepatobiliary', 'hepatobiliary');
bindDigestiveSubToggle('sub-gi-smallbowel',    'smallbowel');
bindDigestiveSubToggle('sub-gi-colon',         'colon');
bindDigestiveSubToggle('sub-gi-anorectal',     'anorectal');

// Respiratory sub-layer toggles
function bindRespiratorySubToggle(subId, groupTag) {
  const el = document.getElementById(subId);
  if (!el) return;
  el.addEventListener('change', (e) => {
    applyVisibility();
  });
}
bindRespiratorySubToggle('sub-resp-larynx', 'larynx');
bindRespiratorySubToggle('sub-resp-airway', 'airway');
bindRespiratorySubToggle('sub-resp-lungs',  'lungs');

// Urogenital sub-layer toggles
function bindUrogenitalSubToggle(subId, groupTag) {
  const el = document.getElementById(subId);
  if (!el) return;
  el.addEventListener('change', (e) => {
    applyVisibility();
  });
}
bindUrogenitalSubToggle('sub-uro-kidneys',      'kidneys');
bindUrogenitalSubToggle('sub-uro-adrenals',     'adrenals');
bindUrogenitalSubToggle('sub-uro-urinary',      'urinary');
bindUrogenitalSubToggle('sub-uro-reproductive', 'reproductive');

// Endocrine & Sensory sub-layer toggles
function bindEndocrineSensorySubToggle(subId, groupTag) {
  const el = document.getElementById(subId);
  if (!el) return;
  el.addEventListener('change', (e) => {
    applyVisibility();
  });
}
bindEndocrineSensorySubToggle('sub-endo-glands', 'glands');
bindEndocrineSensorySubToggle('sub-sens-eyes',   'eyes');
bindEndocrineSensorySubToggle('sub-sens-ears',   'ears');

// Lymphatic sub-layer toggles
function bindLymphaticSubToggle(subId, groupTag) {
  const el = document.getElementById(subId);
  if (!el) return;
  el.addEventListener('change', (e) => {
    applyVisibility();
  });
}
bindLymphaticSubToggle('sub-lymph-organs', 'organs');
bindLymphaticSubToggle('sub-lymph-ducts',  'ducts');
bindLymphaticSubToggle('sub-lymph-nodes',  'nodes');

// Articular / Ligaments sub-layer toggles
function bindArticularSubToggle(subId, groupTag) {
  const el = document.getElementById(subId);
  if (!el) return;
  el.addEventListener('change', (e) => {
    applyVisibility();
  });
}
bindArticularSubToggle('sub-art-spine',   'spine');
bindArticularSubToggle('sub-art-torso',   'torso');
bindArticularSubToggle('sub-art-upper',   'upper');
bindArticularSubToggle('sub-art-lower',   'lower');
bindArticularSubToggle('sub-art-menisci', 'menisci');

// Muscular sub-layer toggles
function bindMuscularSubToggle(subId, groupTag) {
  const el = document.getElementById(subId);
  if (!el) return;
  el.addEventListener('change', (e) => {
    applyVisibility();
  });
}
bindMuscularSubToggle('sub-musc-headneck',  'headneck');
bindMuscularSubToggle('sub-musc-thorax',    'thorax');
bindMuscularSubToggle('sub-musc-abdomen',   'abdomen');
bindMuscularSubToggle('sub-musc-back',      'back');
bindMuscularSubToggle('sub-musc-pelvis',    'pelvis');
bindMuscularSubToggle('sub-musc-upperlimb', 'upperlimb');
bindMuscularSubToggle('sub-musc-lowerlimb', 'lowerlimb');

// Fascia sub-layer toggles
function bindFasciaSubToggle(subId, groupTag) {
  const el = document.getElementById(subId);
  if (!el) return;
  el.addEventListener('change', (e) => {
    applyVisibility();
  });
}
bindFasciaSubToggle('sub-fascia-headneck', 'headneck');
bindFasciaSubToggle('sub-fascia-trunk',    'trunk');
bindFasciaSubToggle('sub-fascia-upper',    'upper');
bindFasciaSubToggle('sub-fascia-lower',    'lower');

function updateSystemCardSummary(card) {
  const mainToggle = card.querySelector('.switch input[type="checkbox"]');
  const details = card.querySelector('.system-sub-toggles, .xray-slider-group');
  const stateEl = card.querySelector('.system-tools .system-state');
  const expandBtn = card.querySelector('.system-expand-btn');
  const subToggles = Array.from(card.querySelectorAll('.system-sub-toggles input[type="checkbox"]'));

  card.classList.toggle('is-off', mainToggle ? !mainToggle.checked : false);
  if (expandBtn) {
    const isExpanded = card.classList.contains('is-expanded');
    expandBtn.textContent = isExpanded ? '-' : '+';
    expandBtn.title = isExpanded ? 'Collapse sublayers' : 'Expand sublayers';
    expandBtn.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
    if (details) details.setAttribute('aria-hidden', isExpanded ? 'false' : 'true');
  }

  if (!stateEl) return;
  if (subToggles.length > 0) {
    const active = subToggles.filter(input => input.checked).length;
    stateEl.textContent = `${active}/${subToggles.length}`;
    stateEl.title = `${active} of ${subToggles.length} sublayers active`;
    return;
  }
  stateEl.textContent = details ? 'SET' : '';
  stateEl.title = details ? 'Settings available' : '';
}

function enhanceSystemControlPanel() {
  document.querySelectorAll('.system-card').forEach((card, index) => {
    const header = card.querySelector('.system-header');
    const mainSwitch = card.querySelector('.switch');
    const details = card.querySelector('.system-sub-toggles, .xray-slider-group');
    if (!header || !mainSwitch) return;

    let tools = card.querySelector('.system-tools');
    if (!tools) {
      tools = document.createElement('div');
      tools.className = 'system-tools';
      header.appendChild(tools);
      tools.appendChild(mainSwitch);
    }

    if (!tools.querySelector('.system-state')) {
      const headerState = document.createElement('span');
      headerState.className = 'system-state';
      tools.appendChild(headerState);
    }

    if (details) {
      card.classList.add('has-details');
      details.classList.add('system-details');

      const expandBtn = document.createElement('button');
      expandBtn.type = 'button';
      expandBtn.className = 'btn-mini system-expand-btn';
      expandBtn.setAttribute('aria-controls', details.id || `${card.dataset.system || `system-${index}`}-details`);
      expandBtn.addEventListener('click', () => {
        card.classList.toggle('is-expanded');
        updateSystemCardSummary(card);
      });
      tools.appendChild(expandBtn);

      const subToggles = Array.from(details.querySelectorAll('input[type="checkbox"]'));
      if (subToggles.length > 1 && !details.querySelector('.system-sub-actions')) {
        const actions = document.createElement('div');
        actions.className = 'system-sub-actions';

        const allBtn = document.createElement('button');
        allBtn.type = 'button';
        allBtn.className = 'btn-mini';
        allBtn.textContent = 'ALL';

        const noneBtn = document.createElement('button');
        noneBtn.type = 'button';
        noneBtn.className = 'btn-mini';
        noneBtn.textContent = 'NONE';

        actions.appendChild(allBtn);
        actions.appendChild(noneBtn);
        details.prepend(actions);

        const setSubToggles = (checked) => {
          subToggles.forEach(input => {
            input.checked = checked;
          });
          applyVisibility();
          updateSystemCardSummary(card);
        };
        allBtn.addEventListener('click', () => setSubToggles(true));
        noneBtn.addEventListener('click', () => setSubToggles(false));
      }
    }

    const update = () => updateSystemCardSummary(card);
    card.querySelectorAll('input[type="checkbox"], input[type="range"]').forEach(input => {
      input.addEventListener('change', update);
      input.addEventListener('input', update);
    });
    updateSystemCardSummary(card);
  });
}
enhanceSystemControlPanel();

function updateAllSystemCardSummaries() {
  document.querySelectorAll('.system-card').forEach(updateSystemCardSummary);
}

// X-Ray Opacity Slider
const xraySlider = document.getElementById('slider-xray-opacity');
const xrayLabel = document.getElementById('label-xray-opacity');
if (xraySlider) {
  xraySlider.addEventListener('input', (e) => {
    const val = parseInt(e.target.value) / 100;
    state.xrayOpacity = val;
    xrayLabel.textContent = `${e.target.value}%`;
    const shellMeshes = state.systemMeshes["System_OuterShell"] || [];
    shellMeshes.forEach(m => {
      if (m.material) m.material.opacity = val;
    });
  });
}

// Quick Actions
document.getElementById('btn-show-all').addEventListener('click', () => {
  Object.keys(state.systemVisibility).forEach(k => {
    setSystemVisibility(k, true);
    const toggle = document.getElementById(`toggle-${k}`);
    if (toggle) toggle.checked = true;
  });
  updateAllSystemCardSummaries();
});

document.getElementById('btn-hide-all').addEventListener('click', () => {
  Object.keys(state.systemVisibility).forEach(k => {
    setSystemVisibility(k, false);
    const toggle = document.getElementById(`toggle-${k}`);
    if (toggle) toggle.checked = false;
  });
  updateAllSystemCardSummaries();
});

document.getElementById('btn-xray-toggle').addEventListener('click', () => {
  const shellToggle = document.getElementById('toggle-System_OuterShell');
  if (shellToggle) {
    shellToggle.checked = !shellToggle.checked;
    setSystemVisibility('System_OuterShell', shellToggle.checked);
    updateAllSystemCardSummaries();
  }
});

// Inspector Actions
function restoreMeshMaterial(mesh) {
  const orig = state.materials.get(mesh.name);
  if (!mesh.material || !orig) return;
  mesh.material.transparent = orig.transparent;
  mesh.material.opacity = mesh.name.startsWith("Anatomy_") || mesh.name === "Skin_Body" ? state.xrayOpacity : orig.opacity;
  if (mesh.material.emissive && orig.emissive) {
    mesh.material.emissive.copy(orig.emissive);
    mesh.material.emissiveIntensity = orig.emissiveIntensity || 0;
  }
}

function restoreIsolationMaterials() {
  state.meshes.forEach(restoreMeshMaterial);
  if (state.selectedMesh && state.selectedMesh.material && state.selectedMesh.material.emissive) {
    state.selectedMesh.material.emissive.set(0x00f0ff);
    state.selectedMesh.material.emissiveIntensity = 0.9;
  }
}

function applyIsolation() {
  restoreIsolationMaterials();
  state.meshes.forEach(m => {
    if (m === state.selectedMesh || state.hiddenMeshes.has(m.name) || !m.visible) return;
    if (m.material) {
      m.material.transparent = true;
      m.material.opacity = 0.08;
    }
  });
}

function updateHiddenControls() {
  const restoreBtn = document.getElementById('btn-restore-hidden');
  if (!restoreBtn) return;
  const count = state.hiddenMeshes.size;
  restoreBtn.textContent = count > 0 ? `RESTORE HIDDEN (${count})` : 'RESTORE HIDDEN';
  restoreBtn.disabled = count === 0;
  restoreBtn.style.opacity = count === 0 ? '0.45' : '1';
}

document.getElementById('btn-focus-organ').addEventListener('click', () => {
  if (state.selectedMesh) focusOnMesh(state.selectedMesh);
});

document.getElementById('btn-isolate-organ').addEventListener('click', () => {
  if (!state.selectedMesh) return;
  state.isIsolated = !state.isIsolated;
  const btn = document.getElementById('btn-isolate-organ');

  if (state.isIsolated) {
    btn.textContent = 'RESTORE ALL';
    btn.style.borderColor = 'var(--cyan-bright)';
    applyIsolation();
  } else {
    btn.textContent = '🔍 ISOLATE';
    btn.style.borderColor = '';
    restoreIsolationMaterials();
    applyVisibility();
  }
});

document.getElementById('btn-hide-selected').addEventListener('click', () => {
  if (!state.selectedMesh) return;
  state.hiddenMeshes.add(state.selectedMesh.name);
  applyVisibility();
  if (state.isIsolated) applyIsolation();
  updateHiddenControls();
});

document.getElementById('btn-restore-hidden').addEventListener('click', () => {
  state.hiddenMeshes.clear();
  applyVisibility();
  restoreIsolationMaterials();
  if (state.isIsolated) applyIsolation();
  updateHiddenControls();
});
updateHiddenControls();

function panView(dx, dy) {
  const distance = camera.position.distanceTo(controls.target);
  const step = Math.max(0.008, distance * 0.018);
  const forward = new THREE.Vector3();
  camera.getWorldDirection(forward);
  const right = new THREE.Vector3().crossVectors(forward, camera.up).normalize();
  const up = new THREE.Vector3().copy(camera.up).normalize();
  const offset = new THREE.Vector3()
    .addScaledVector(right, dx * step)
    .addScaledVector(up, dy * step);

  camera.position.add(offset);
  controls.target.add(offset);
  controls.update();
}

const panButtonMap = {
  'btn-pan-left': [-1, 0],
  'btn-pan-right': [1, 0],
  'btn-pan-up': [0, 1],
  'btn-pan-down': [0, -1]
};

Object.entries(panButtonMap).forEach(([id, offset]) => {
  const btn = document.getElementById(id);
  if (!btn) return;
  btn.addEventListener('click', () => panView(offset[0], offset[1]));
});

document.getElementById('btn-pan-reset')?.addEventListener('click', () => {
  controls.target.set(0.0, 1.25, 0.0);
  camera.position.set(0.0, 1.35, 1.95);
  controls.update();
});

window.addEventListener('keydown', (event) => {
  if (!event.shiftKey || event.target.closest?.('input, select, textarea, button')) return;
  const keyMap = {
    ArrowLeft: [-1, 0],
    ArrowRight: [1, 0],
    ArrowUp: [0, 1],
    ArrowDown: [0, -1]
  };
  const offset = keyMap[event.key];
  if (!offset) return;
  event.preventDefault();
  panView(offset[0], offset[1]);
});

// ------------------------------------------------------------------------------
// SUB-MODEL SWITCHER & EXPLODED VIEW CONTROLS
// ------------------------------------------------------------------------------
const submodelSelect = document.getElementById('select-submodel');
if (submodelSelect) {
  submodelSelect.addEventListener('change', (e) => {
    loadAnatomyModel(e.target.value);
    if (window.VirtualHistology && typeof window.VirtualHistology.syncFromSubmodel === 'function') {
      window.VirtualHistology.syncFromSubmodel(e.target.value);
    }
  });
}

const explodeSlider = document.getElementById('slider-explode');
const explodeLabel = document.getElementById('label-explode');
if (explodeSlider) {
  explodeSlider.addEventListener('input', (e) => {
    const factor = parseFloat(e.target.value) / 100;
    state.explodedRatio = factor;
    if (explodeLabel) explodeLabel.textContent = `${e.target.value}%`;

    state.meshes.forEach((mesh) => {
      if (mesh.userData.origPos && mesh.userData.centroid) {
        // Displace radially from torso longitudinal axis (0, Y, 0)
        const offsetDir = mesh.userData.centroid.clone();
        offsetDir.y = 0; // horizontal vector away from body centerline
        if (offsetDir.lengthSq() < 0.0004) {
          offsetDir.set(mesh.name.includes("Right") || mesh.name.includes(".r") ? 1 : -1, 0, 0);
        } else {
          offsetDir.normalize();
        }

        // Add subtle vertical expansion
        const yOffset = (mesh.userData.centroid.y - 1.25) * 0.35;
        mesh.position.copy(mesh.userData.origPos).addScaledVector(offsetDir, factor * 0.40);
        mesh.position.y += yOffset * factor;
      }
    });
  });
}

// ------------------------------------------------------------------------------
// ANATOMICAL CROSS-SECTION CLIPPING PLANES
// ------------------------------------------------------------------------------
function updateClippingPlane() {
  if (!state.clipping.enabled || state.clipping.axis === "none") {
    renderer.clippingPlanes = [];
    return;
  }

  const normal = new THREE.Vector3();
  let constant = 0;
  const depthFactor = state.clipping.depth; // -1 to 1

  if (state.clipping.axis === "sagittal") {
    // Sagittal cut: normal along X (left/right cut)
    const sign = state.clipping.inverted ? -1 : 1;
    normal.set(sign, 0, 0);
    constant = -sign * (depthFactor * 0.45);
  } else if (state.clipping.axis === "coronal") {
    // Coronal cut: normal along Z (front/back cut)
    const sign = state.clipping.inverted ? -1 : 1;
    normal.set(0, 0, sign);
    constant = -sign * (depthFactor * 0.35);
  } else if (state.clipping.axis === "transverse") {
    // Transverse / Axial cut: normal along Y (top/bottom cut, centered at mid-torso y=1.20)
    const sign = state.clipping.inverted ? -1 : 1;
    normal.set(0, sign, 0);
    const yCut = 1.20 + depthFactor * 0.75;
    constant = -sign * yCut;
  }

  state.clipping.plane.set(normal, constant);
  renderer.clippingPlanes = [state.clipping.plane];
}

const clipSelect = document.getElementById('select-clip-plane');
const clipSlider = document.getElementById('slider-clip-depth');
const clipFlip = document.getElementById('btn-clip-flip');

if (clipSelect && clipSlider && clipFlip) {
  clipSelect.addEventListener('change', (e) => {
    const val = e.target.value;
    state.clipping.axis = val;
    state.clipping.enabled = (val !== "none");
    const active = state.clipping.enabled;
    clipSlider.disabled = !active;
    clipFlip.disabled = !active;
    clipSlider.style.opacity = active ? '1' : '0.35';
    clipFlip.style.opacity = active ? '1' : '0.35';
    if (!active) {
      clipSlider.value = 0;
      state.clipping.depth = 0;
    }
    updateClippingPlane();
  });

  clipSlider.addEventListener('input', (e) => {
    state.clipping.depth = parseFloat(e.target.value) / 100;
    updateClippingPlane();
  });

  clipFlip.addEventListener('click', () => {
    state.clipping.inverted = !state.clipping.inverted;
    clipFlip.classList.toggle('active', state.clipping.inverted);
    updateClippingPlane();
  });
}


// ------------------------------------------------------------------------------
// CAMERA PRESETS
// ------------------------------------------------------------------------------
const CAMERA_PRESETS = {
  "anterior": { pos: [0.0, 1.30, 1.90], target: [0.0, 1.25, 0.0] },
  "posterior": { pos: [0.0, 1.30, -1.90], target: [0.0, 1.25, 0.0] },
  "lateral-left": { pos: [-1.85, 1.30, 0.0], target: [0.0, 1.25, 0.0] },
  "lateral-right": { pos: [1.85, 1.30, 0.0], target: [0.0, 1.25, 0.0] },
  "superior": { pos: [0.0, 2.70, 0.01], target: [0.0, 1.25, 0.0] },
  "cardiac": { pos: [-0.08, 1.32, 0.48], target: [-0.02, 1.29, 0.0] },
  "cranial": { pos: [0.0, 1.70, 0.55], target: [0.0, 1.68, 0.0] },
  "reset": { pos: [0.0, 1.35, 1.95], target: [0.0, 1.25, 0.0] }
};

document.querySelectorAll('.dock-btn[data-view]').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.dock-btn[data-view]').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const key = btn.dataset.view;
    const preset = CAMERA_PRESETS[key];
    if (preset) {
      state.cameraTransition = {
        startTime: performance.now(),
        duration: 900,
        startPos: camera.position.clone(),
        endPos: new THREE.Vector3(...preset.pos),
        startTarget: controls.target.clone(),
        endTarget: new THREE.Vector3(...preset.target)
      };
    }
  });
});

// ------------------------------------------------------------------------------
// ILLUMINATION & DIAGNOSTIC ANIMATION MODES
// ------------------------------------------------------------------------------
const btnPulse = document.getElementById('btn-pulse-mode');
const btnNeural = document.getElementById('btn-neural-mode');
const btnRotate = document.getElementById('btn-autorotate');

btnPulse.addEventListener('click', () => {
  state.modes.cardiacPulse = !state.modes.cardiacPulse;
  btnPulse.classList.toggle('pulse-active', state.modes.cardiacPulse);
});

btnNeural.addEventListener('click', () => {
  state.modes.neuralPulse = !state.modes.neuralPulse;
  btnNeural.classList.toggle('active', state.modes.neuralPulse);
});

btnRotate.addEventListener('click', () => {
  state.modes.autoRotate = !state.modes.autoRotate;
  btnRotate.classList.toggle('active', state.modes.autoRotate);
  controls.autoRotate = state.modes.autoRotate;
  controls.autoRotateSpeed = 1.2;
});

// ------------------------------------------------------------------------------
// 60 FPS RENDER LOOP & REAL-TIME DIAGNOSTIC SHADERS
// ------------------------------------------------------------------------------
function animate() {
  requestAnimationFrame(animate);

  const now = performance.now();
  const timeSec = now * 0.001;

  // 1. Camera Transitions (Smooth Cubic Easing)
  if (state.cameraTransition) {
    const elapsed = now - state.cameraTransition.startTime;
    const t = Math.min(1.0, elapsed / state.cameraTransition.duration);
    // Smoothstep easing
    const ease = t * t * (3 - 2 * t);

    camera.position.lerpVectors(state.cameraTransition.startPos, state.cameraTransition.endPos, ease);
    controls.target.lerpVectors(state.cameraTransition.startTarget, state.cameraTransition.endTarget, ease);

    if (t >= 1.0) state.cameraTransition = null;
  }

  // 2. Cardiac Heartbeat Pulse Animation (Systole/Diastole 72 BPM)
  if (state.modes.cardiacPulse) {
    const heart = state.meshes.get("Organ_Heart");
    const aorta = state.meshes.get("Vessel_Aorta");

    // 72 BPM: ~0.833s period
    const cycle = (timeSec % 0.833) / 0.833;
    // Dual systolic peak
    const pulse = Math.pow(Math.sin(cycle * Math.PI * 2), 6);
    const scale = 1.0 + pulse * 0.05;

    if (heart) {
      heart.scale.set(scale, scale, scale);
      if (heart.material && heart.material.emissive) {
        heart.material.emissive.set(0xff2a4b);
        heart.material.emissiveIntensity = 0.5 + pulse * 1.5;
      }
    }

    // Downward vascular pulse traveling through Aorta
    if (aorta && aorta.material && aorta.material.emissive) {
      const wave = (Math.sin(timeSec * 8.0) + 1.0) * 0.5;
      aorta.material.emissive.set(0xff1217);
      aorta.material.emissiveIntensity = 0.3 + wave * 0.9;
    }
  }

  // 3. Neural Synaptic Oscillations
  if (state.modes.neuralPulse) {
    const brain = state.meshes.get("Organ_Brain");
    if (brain && brain.material && brain.material.emissive) {
      const nGlow = (Math.sin(timeSec * 6.0) * 0.5 + 0.5) * (Math.cos(timeSec * 14.0) * 0.3 + 0.7);
      brain.material.emissive.set(0xa855f7);
      brain.material.emissiveIntensity = 0.4 + nGlow * 1.2;
    }
  }

  // 4. Update Controls & Render Scene
  controls.update();
  renderer.render(scene, camera);

  // 5. FPS & Frame Metrics Tracker
  state.fpsTracker.frames++;
  if (now > state.fpsTracker.lastTime + 1000) {
    state.fpsTracker.fps = Math.round((state.fpsTracker.frames * 1000) / (now - state.fpsTracker.lastTime));
    document.getElementById('metric-fps').textContent = `${state.fpsTracker.fps} FPS`;
    state.fpsTracker.frames = 0;
    state.fpsTracker.lastTime = now;
  }
}
animate();

// ------------------------------------------------------------------------------
// RESIZE HANDLER
// ------------------------------------------------------------------------------
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// ==============================================================================
// VIRTUAL HISTOLOGY DUAL-VIEWPORT DRAWER & MICROSCOPIC SLIDE VIEWER (PHASE 5)
// ==============================================================================

const HISTOLOGY_DATABASE = {
  cochlea: {
    id: "cochlea",
    name: "Cochlea: Organ of Corti",
    badge: "H&E STAIN",
    subTitle: "Organ of Corti: Mechanosensory Hair Cells, Tectorial Membrane & Tonotopic Basilar Tuning",
    description: "Radial cross-section of the cochlear duct (scala media) within the temporal bone. Displays the mechanosensory neuroepithelium that transduces fluid pressure waves into auditory nerve impulses.",
    stainTitle: "Hematoxylin & Eosin (H&E)",
    stainRows: [
      { color: "#4a2d73", label: "Nuclei / Chromatin: Deep Purple (#4a2d73)" },
      { color: "#e07a9b", label: "Cytoplasm & Stereocilia: Eosin Pink (#e07a9b)" },
      { color: "#f3b2bc", label: "Basilar Membrane Collagen: Pinkish-Orange" }
    ],
    meshTarget: "Sens_Cochlea",
    submodel: "submodel_auditory_apparatus.glb",
    pillTag: "COCHLEA",
    normalPins: [
      { id: "ihc", x: 0.36, y: 0.48, name: "Inner Hair Cell (IHC)", badge: "PRIMARY TRANSDUCER", desc: "Single row of flask-shaped sensory cells receiving ~95% of afferent auditory innervation (type I spiral ganglion neurons).", targetMesh: "Sens_Cochlea", isPath: false },
      { id: "ohc", x: 0.58, y: 0.46, name: "Outer Hair Cells (OHC)", badge: "PRESTIN ACOUSTIC MOTOR", desc: "Three rows of cylindrical electromotile cells driven by prestin motor proteins, acting as non-linear cochlear amplifiers.", targetMesh: "Sens_Cochlea", isPath: false },
      { id: "tect", x: 0.48, y: 0.34, name: "Tectorial Membrane", badge: "ACELLULAR MATRIX", desc: "Gelatinous ribbon rich in Type II, IX, and XI collagen and otogelin, physically anchoring stereocilia tips.", targetMesh: "Sens_Cochlea", isPath: false },
      { id: "basilar", x: 0.50, y: 0.65, name: "Basilar Membrane", badge: "TONOTOPIC PLATFORM", desc: "Stiff and narrow at base (high frequencies ~20kHz), compliant and wide at apex (low frequencies ~20Hz).", targetMesh: "Sens_Cochlea", isPath: false },
      { id: "tunnel", x: 0.44, y: 0.55, name: "Tunnel of Corti", badge: "PILLAR CELLS", desc: "Fluid-filled triangular space bounded by inner and outer pillar cells; contains cortilymph with low potassium.", targetMesh: "Sens_Cochlea", isPath: false }
    ],
    pathologyPins: [
      { id: "lost-ohc", x: 0.58, y: 0.46, name: "Outer Hair Cell Loss", badge: "OTOTOXIC APOPTOSIS", desc: "Loss and vacuolization of OHCs secondary to acoustic trauma, cisplatin, or aminoglycosides resulting in permanent sensorineural hearing loss.", targetMesh: "Sens_Cochlea", isPath: true },
      { id: "stereocilia-fusion", x: 0.42, y: 0.44, name: "Fused Stereocilia Stubs", badge: "CYTOSKELETAL COLLAPSE", desc: "Disruption and tip-link loss in remaining hair cells with disorganized, splayed actin core bundles.", targetMesh: "Sens_Cochlea", isPath: true },
      { id: "ganglion-atrophy", x: 0.22, y: 0.70, name: "Secondary Ganglion Loss", badge: "NEURAL DEGENERATION", desc: "Retrograde neuronal loss within the modiolus following chronic deafferentation.", targetMesh: "Sens_Cochlea", isPath: true }
    ]
  },

  coronary: {
    id: "coronary",
    name: "Coronary LAD: Atherosclerosis",
    badge: "H&E STAIN",
    subTitle: "Left Anterior Descending Coronary Artery: Vulnerable Fibroatheroma & Cholesterol Clefts",
    description: "Cross-section of the proximal left anterior descending (LAD) coronary artery demonstrating eccentric fibroatheromatous plaque, luminal compromise, and deep core necrotic debris.",
    stainTitle: "Hematoxylin & Eosin (H&E)",
    stainRows: [
      { color: "#4a2d73", label: "Nuclei & Calcification: Deep Violet-Blue" },
      { color: "#e07a9b", label: "Collagen & Smooth Muscle: Eosin Pink" },
      { color: "#ffffff", border: true, label: "Cholesterol Clefts: Empty White Lacunae" },
      { color: "#e11d48", label: "Erythrocytes in Lumen: Red (#e11d48)" }
    ],
    meshTarget: "Organ_Heart",
    submodel: "submodel_coronary_stent_bypass.glb",
    pillTag: "LAD",
    normalPins: [
      { id: "endo", x: 0.50, y: 0.32, name: "Normal Endothelium", badge: "VASCULAR BARRIER", desc: "Continuous monolayer maintaining non-thrombogenic surface via nitric oxide (NO) and prostacyclin (PGI2) synthesis.", targetMesh: "Vessel_Aorta", isPath: false },
      { id: "media", x: 0.72, y: 0.58, name: "Tunica Media", badge: "SMOOTH MUSCLE", desc: "Regular concentric rings of contractile vascular smooth muscle cells (VSMCs) maintaining vascular tone.", targetMesh: "Organ_Heart", isPath: false },
      { id: "lumen", x: 0.50, y: 0.48, name: "Patent Lumen", badge: "UNOBSTRUCTED FLOW", desc: "Wide cylindrical lumen providing unrestricted epicardial myocardial perfusion.", targetMesh: "Organ_Heart", isPath: false }
    ],
    pathologyPins: [
      { id: "cap", x: 0.50, y: 0.34, name: "Fibrous Cap", badge: "COLLAGEN SHEATH", desc: "Extracellular matrix sheath rich in Type I and III collagen; thinning cap (<65µm) indicates high risk of sudden rupture.", targetMesh: "Organ_Heart", isPath: true },
      { id: "cleft", x: 0.50, y: 0.54, name: "Cholesterol Clefts", badge: "LIPID CORE", desc: "Biconvex needle-shaped empty spaces where crystalline cholesterol dissolved during xylene histological processing.", targetMesh: "Organ_Heart", isPath: true },
      { id: "foam", x: 0.34, y: 0.44, name: "Foam Cell Aggregate", badge: "OX-LDL MACROPHAGE", desc: "Macrophages packed with lipid droplets, secreting metalloproteinases (MMPs) that degrade the fibrous cap.", targetMesh: "Organ_Heart", isPath: true },
      { id: "neovasc", x: 0.66, y: 0.48, name: "Thin-Walled Neovessels", badge: "PLAQUE NEOVASCULARIZATION", desc: "Fragile, leaky capillary sprouts prone to intraplaque hemorrhage and sudden plaque expansion.", targetMesh: "Organ_Heart", isPath: true },
      { id: "calc", x: 0.48, y: 0.68, name: "Dystrophic Calcification", badge: "BASOPHILIC DEPOSITS", desc: "Precipitated calcium phosphate within necrotic core tissue in the setting of normal serum calcium.", targetMesh: "Organ_Heart", isPath: true }
    ]
  },

  lung: {
    id: "lung",
    name: "Pulmonary: Alveoli & Emphysema",
    badge: "H&E STAIN",
    subTitle: "Alveolar Septa, Blood-Air Barrier & Centriacinar Emphysema Destruction",
    description: "Pulmonary parenchyma highlighting fragile 0.2 µm blood-air diffusion barriers against smoking/elastase-driven septal rupture and enlarged confluent bullae.",
    stainTitle: "Hematoxylin & Eosin (H&E)",
    stainRows: [
      { color: "#4a2d73", label: "Pneumocyte Nuclei: Deep Purple" },
      { color: "#e07a9b", label: "Alveolar Septa: Eosin Pink" },
      { color: "#e11d48", label: "Capillary Erythrocytes: Ruby Red" },
      { color: "#1e293b", label: "Anthracotic Pigment: Carbon Black" }
    ],
    meshTarget: "Organ_Lung_Left",
    submodel: "submodel_pulmonary_alveolus.glb",
    pillTag: "LUNG",
    normalPins: [
      { id: "type1", x: 0.40, y: 0.48, name: "Type I Pneumocyte", badge: "SQUAMOUS DIFFUSION BARRIER", desc: "Attenuated squamous cell covering >90% of alveolar surface. Cytoplasm is 0.2 µm thin to facilitate gas diffusion.", targetMesh: "Organ_Lung_Left", isPath: false },
      { id: "type2", x: 0.60, y: 0.38, name: "Type II Pneumocyte", badge: "SURFACTANT SYNTHESIS", desc: "Cuboidal cell with lamellar bodies synthesizing dipalmitoylphosphatidylcholine (DPPC); acts as stem cell.", targetMesh: "Organ_Lung_Right", isPath: false },
      { id: "capillary", x: 0.48, y: 0.64, name: "Septal Capillary Bed", badge: "MICROCIRCULATION", desc: "Continuous capillaries where red blood cells pass in single file for rapid oxygenation.", targetMesh: "Organ_Lung_Left", isPath: false },
      { id: "dust", x: 0.28, y: 0.36, name: "Alveolar Macrophage", badge: "LUMINAL PHAGOCYTE", desc: "Scavenges inhaled dust, particulate matter, and apoptotic cellular debris in the alveolar airspace.", targetMesh: "Organ_Lung_Left", isPath: false }
    ],
    pathologyPins: [
      { id: "bulla", x: 0.50, y: 0.45, name: "Emphysematous Bulla", badge: "CONFLUENT AIRSPACE", desc: "Markedly dilated empty space resulting from elastase-mediated breakdown of interalveolar septa.", targetMesh: "Organ_Lung_Left", isPath: true },
      { id: "spur", x: 0.34, y: 0.60, name: "Clubbed Septal Spur", badge: "ELASTOLYTIC REMNANT", desc: "Free-floating ruptured alveolar wall remnant with bulbous end; hallmark of pulmonary emphysema.", targetMesh: "Organ_Lung_Left", isPath: true },
      { id: "carbon", x: 0.68, y: 0.32, name: "Anthracotic Macrophage", badge: "PIGMENTED SMOKER CELL", desc: "Macrophage heavy with ingested tobacco smoke particulate and carbon granules.", targetMesh: "Organ_Lung_Right", isPath: true }
    ]
  },

  kidney: {
    id: "kidney",
    name: "Kidney: Glomerular Tuft & KW",
    badge: "PAS STAIN",
    subTitle: "Glomerular Filtration Barrier & Kimmelstiel-Wilson Nodular Glomerulosclerosis",
    description: "Renal cortex with Periodic Acid-Schiff (PAS) stain highlighting intensely magenta-positive basement membranes, mesangial matrix expansion, and diabetic nodular lesions.",
    stainTitle: "Periodic Acid-Schiff (PAS)",
    stainRows: [
      { color: "#d946ef", label: "Basement Membranes (GBM): Intense Magenta (#d946ef)" },
      { color: "#6b21a8", label: "Nuclei: Pale Hematoxylin Violet (#6b21a8)" },
      { color: "#fae8ff", label: "Tubular Cytoplasm: Delicate Pink (#fae8ff)" }
    ],
    meshTarget: "Organ_Kidney_Left",
    submodel: "human_anatomy_commercial.glb",
    pillTag: "RENAL",
    normalPins: [
      { id: "gbm", x: 0.44, y: 0.40, name: "Glomerular Basement Membrane", badge: "PAS-INTENSE MAGENTA", desc: "Trilaminar filter composed of Type IV collagen and heparan sulfate proteoglycans providing charge selectivity.", targetMesh: "Organ_Kidney_Left", isPath: false },
      { id: "podocyte", x: 0.56, y: 0.28, name: "Podocyte Pedicels", badge: "SLIT DIAPHRAGM", desc: "Interdigitating secondary foot processes spanning slit diaphragms with nephrin and podocin.", targetMesh: "Organ_Kidney_Left", isPath: false },
      { id: "bowman", x: 0.22, y: 0.22, name: "Bowman's Capsule & Space", badge: "URINARY SPACE", desc: "Parietal layer of simple squamous cells receiving primary ultrafiltrate before entering proximal tubule.", targetMesh: "Organ_Kidney_Left", isPath: false },
      { id: "brush", x: 0.78, y: 0.68, name: "PCT Brush Border", badge: "APICAL MICROVILLI", desc: "Dense apical microvilli staining strongly PAS-positive, executing bulk reabsorption of filtered glucose and amino acids.", targetMesh: "Organ_Kidney_Left", isPath: false }
    ],
    pathologyPins: [
      { id: "kw-nodule", x: 0.48, y: 0.52, name: "Kimmelstiel-Wilson Nodule", badge: "DIABETIC NEPHROPATHY", desc: "Spherical, acellular, laminated PAS-dense mesangial nodules pathognomonic for advanced diabetic nodular glomerulosclerosis.", targetMesh: "Organ_Kidney_Left", isPath: true },
      { id: "thick-gbm", x: 0.38, y: 0.34, name: "Thickened GBM (3-5x)", badge: "MICROVASCULAR SCLEROSIS", desc: "Non-enzymatic glycation of Type IV collagen causing diffuse basement membrane thickening and podocyte effacement.", targetMesh: "Organ_Kidney_Left", isPath: true },
      { id: "arteriolar", x: 0.66, y: 0.68, name: "Arteriolar Hyalinosis", badge: "PROTEIN EXTRAVASATION", desc: "Hyaline accumulation involving both afferent and efferent renal arterioles characteristic of diabetes mellitus.", targetMesh: "Organ_Kidney_Right", isPath: true }
    ]
  },

  liver: {
    id: "liver",
    name: "Liver: Portal Triad & Cirrhosis",
    badge: "MASSON TRICHROME",
    subTitle: "Hepatic Lobular Architecture, Sinusoidal Plates & Cirrhotic Bridging Fibrosis",
    description: "Liver biopsy processed with Masson Trichrome stain (blue collagen, scarlet hepatocytes) demonstrating cirrhotic architectural destruction and bridging fibrotic septa.",
    stainTitle: "Masson's Trichrome",
    stainRows: [
      { color: "#1d4ed8", label: "Collagen & Fibrous Scar: Brilliant Blue (#1d4ed8)" },
      { color: "#dc2626", label: "Hepatocytes / Cytoplasm: Scarlet Red (#dc2626)" },
      { color: "#0f172a", label: "Nuclei: Dark Blue-Black (#0f172a)" }
    ],
    meshTarget: "Organ_Liver",
    submodel: "submodel_gastrointestinal.glb",
    pillTag: "LIVER",
    normalPins: [
      { id: "hep-plate", x: 0.62, y: 0.45, name: "Hepatocyte Cords", badge: "POLYGONAL PARENCHYMA", desc: "Cords of metabolic hepatocytes radiating from portal tracts toward the central vein; glycogen and mitochondria rich.", targetMesh: "Organ_Liver", isPath: false },
      { id: "kupffer", x: 0.52, y: 0.60, name: "Kupffer Cell", badge: "SINUSOIDAL MACROPHAGE", desc: "Resident phagocyte anchored within sinusoidal lumen clearing gut endotoxins and old erythrocytes.", targetMesh: "Organ_Liver", isPath: false },
      { id: "bile-duct", x: 0.28, y: 0.32, name: "Bile Ductule (Triad)", badge: "CUBOIDAL CHOLANGIOCYTE", desc: "Bile ductule lined by simple cuboidal epithelium conveying bile synthesized by hepatocytes.", targetMesh: "Organ_Liver", isPath: false },
      { id: "portal-vein", x: 0.22, y: 0.48, name: "Portal Vein Branch", badge: "NUTRIENT INFLOW", desc: "Large thin-walled venous channel delivering blood from splanchnic circulation.", targetMesh: "Organ_Liver", isPath: false }
    ],
    pathologyPins: [
      { id: "bridge", x: 0.44, y: 0.50, name: "Bridging Fibrosis (Blue Scar)", badge: "ANILINE BLUE COLLAGEN", desc: "Dense broad bands of collagen connecting portal tracts to central veins, synthesized by activated hepatic stellate cells.", targetMesh: "Organ_Liver", isPath: true },
      { id: "regen-nodule", x: 0.68, y: 0.34, name: "Regenerative Nodule", badge: "ENCAPSULATED ISLET", desc: "Parenchymal nodule of proliferating hepatocytes entrapped in fibrous bands, lacking normal central vein drainage.", targetMesh: "Organ_Liver", isPath: true },
      { id: "duct-rxn", x: 0.34, y: 0.66, name: "Ductular Reaction", badge: "PROLIFERATING BILE DUCTS", desc: "Reactive proliferation of immature bile ductules at the interface of fibrous scars.", targetMesh: "Organ_Liver", isPath: true }
    ]
  }
};

class VirtualHistologyEngine {
  constructor() {
    this.drawer = document.getElementById('histology-drawer');
    this.canvas = document.getElementById('histo-canvas');
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
    this.pinsLayer = document.getElementById('histo-pins-layer');
    this.popover = document.getElementById('histo-pin-popover');
    this.splitOverlay = document.getElementById('histo-split-overlay');
    this.splitDivider = document.getElementById('split-divider-line');

    this.isOpen = false;
    this.isMaximized = false;
    this.activeSlideId = 'coronary';
    this.viewMode = 'pathology'; // 'normal' | 'pathology' | 'split'
    this.showPins = true;

    // Viewport transforms
    this.zoom = 10.0;
    this.scale = 1.6; // derived from zoom
    this.panX = 0;
    this.panY = 0;
    this.splitRatio = 0.50; // 0.0 to 1.0

    this.isDraggingPan = false;
    this.isDraggingSplit = false;
    this.lastPointerX = 0;
    this.lastPointerY = 0;
    this.selectedPin = null;

    if (this.drawer && this.canvas) {
      this.initEventListeners();
      this.renderCurrentSlide();
      this.updateUIHeaders();
    }
  }

  initEventListeners() {
    // 1. Header and Dock Toggle Buttons
    const btnHeaderToggle = document.getElementById('btn-toggle-histology');
    const btnDockToggle = document.getElementById('btn-histology-dock');
    const btnClose = document.getElementById('btn-histo-close');
    const btnExpand = document.getElementById('btn-histo-expand');

    const toggleDrawer = () => this.setDrawerOpen(!this.isOpen);
    if (btnHeaderToggle) btnHeaderToggle.addEventListener('click', toggleDrawer);
    if (btnDockToggle) btnDockToggle.addEventListener('click', toggleDrawer);
    if (btnClose) btnClose.addEventListener('click', () => this.setDrawerOpen(false));
    if (btnExpand) btnExpand.addEventListener('click', () => this.toggleMaximized());

    // Keyboard shortcut 'H'
    window.addEventListener('keydown', (e) => {
      if (e.target.closest?.('input, select, textarea')) return;
      if (e.key.toLowerCase() === 'h' && !e.ctrlKey && !e.altKey && !e.metaKey) {
        e.preventDefault();
        toggleDrawer();
      }
    });

    // 2. Slide Selector
    const selectSlide = document.getElementById('select-histo-slide');
    if (selectSlide) {
      selectSlide.addEventListener('change', (e) => {
        this.loadSlide(e.target.value);
      });
    }

    // 3. View Mode Buttons
    const modeButtons = document.querySelectorAll('.histo-mode-btn');
    modeButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        modeButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.setViewMode(btn.dataset.mode);
      });
    });

    // 4. Pins Toggle
    const btnPins = document.getElementById('btn-toggle-pins');
    if (btnPins) {
      btnPins.addEventListener('click', () => {
        this.showPins = !this.showPins;
        btnPins.classList.toggle('active', this.showPins);
        this.updatePins();
      });
    }

    // 5. Magnification Controls
    const magButtons = document.querySelectorAll('.histo-mag-btn');
    const zoomSlider = document.getElementById('histo-zoom-slider');
    const zoomReadout = document.getElementById('histo-zoom-readout');

    const setMagnification = (mag) => {
      this.zoom = parseFloat(mag);
      // Map magnification (2 to 50) to scale (0.5 to 4.5)
      this.scale = 0.5 + (this.zoom / 50) * 4.0;
      if (zoomSlider) zoomSlider.value = this.zoom;
      if (zoomReadout) zoomReadout.textContent = `${this.zoom.toFixed(1)}x`;

      magButtons.forEach(b => {
        b.classList.toggle('active', Math.abs(parseFloat(b.dataset.mag) - this.zoom) < 1.0);
      });

      this.render();
      this.updatePins();
    };

    magButtons.forEach(btn => {
      btn.addEventListener('click', () => setMagnification(btn.dataset.mag));
    });

    if (zoomSlider) {
      zoomSlider.addEventListener('input', (e) => setMagnification(e.target.value));
    }

    // 6. Recenter & Sync 3D
    const btnRecenter = document.getElementById('btn-histo-recenter');
    if (btnRecenter) {
      btnRecenter.addEventListener('click', () => {
        this.panX = 0;
        this.panY = 0;
        setMagnification(10);
      });
    }

    const btnSync3D = document.getElementById('btn-histo-sync3d');
    if (btnSync3D) {
      btnSync3D.addEventListener('click', () => {
        const slide = HISTOLOGY_DATABASE[this.activeSlideId];
        if (slide && typeof selectOrgan === 'function') {
          selectOrgan(slide.meshTarget, true);
        }
      });
    }

    // 7. Popover Close & Sync
    const popoverClose = document.getElementById('popover-close-btn');
    if (popoverClose) {
      popoverClose.addEventListener('click', () => this.hidePopover());
    }

    const popoverSync = document.getElementById('popover-sync-3d-btn');
    if (popoverSync) {
      popoverSync.addEventListener('click', () => {
        if (this.selectedPin && typeof selectOrgan === 'function') {
          selectOrgan(this.selectedPin.targetMesh, true);
        }
      });
    }

    // 8. Canvas Pointer Navigation (Pan & Zoom)
    const viewport = document.getElementById('histo-viewport-container');
    if (viewport) {
      viewport.addEventListener('pointerdown', (e) => {
        if (e.target.closest('.histo-pin, .histo-pin-popover, #split-divider-line')) return;
        this.isDraggingPan = true;
        this.lastPointerX = e.clientX;
        this.lastPointerY = e.clientY;
        viewport.setPointerCapture(e.pointerId);
      });

      viewport.addEventListener('pointermove', (e) => {
        if (this.isDraggingSplit) {
          const rect = viewport.getBoundingClientRect();
          const relX = Math.max(0.1, Math.min(0.9, (e.clientX - rect.left) / rect.width));
          this.splitRatio = relX;
          if (this.splitDivider) this.splitDivider.style.left = `${(relX * 100).toFixed(1)}%`;
          this.render();
          this.updatePins();
          return;
        }

        if (!this.isDraggingPan) return;
        const dx = e.clientX - this.lastPointerX;
        const dy = e.clientY - this.lastPointerY;
        this.lastPointerX = e.clientX;
        this.lastPointerY = e.clientY;

        this.panX += dx;
        this.panY += dy;
        this.render();
        this.updatePins();
      });

      const stopDrag = (e) => {
        if (this.isDraggingPan) {
          this.isDraggingPan = false;
          try { viewport.releasePointerCapture(e.pointerId); } catch (_) {}
        }
        this.isDraggingSplit = false;
      };
      viewport.addEventListener('pointerup', stopDrag);
      viewport.addEventListener('pointercancel', stopDrag);

      // Mouse Wheel Smooth Zoom
      viewport.addEventListener('wheel', (e) => {
        e.preventDefault();
        const rect = viewport.getBoundingClientRect();
        const cursorX = e.clientX - rect.left - rect.width / 2;
        const cursorY = e.clientY - rect.top - rect.height / 2;

        const zoomDelta = e.deltaY < 0 ? 1.14 : 0.88;
        const oldScale = this.scale;
        let newZoom = this.zoom * (e.deltaY < 0 ? 1.15 : 0.87);
        newZoom = Math.max(2, Math.min(50, newZoom));

        setMagnification(newZoom);

        // Adjust pan to zoom into cursor point
        const scaleRatio = this.scale / oldScale;
        this.panX = cursorX - (cursorX - this.panX) * scaleRatio;
        this.panY = cursorY - (cursorY - this.panY) * scaleRatio;
        this.render();
        this.updatePins();
      }, { passive: false });
    }

    // 9. Split Divider Drag
    if (this.splitDivider) {
      this.splitDivider.addEventListener('pointerdown', (e) => {
        e.stopPropagation();
        this.isDraggingSplit = true;
      });
    }

    // 10. Window Resize Handler
    window.addEventListener('resize', () => {
      if (this.isOpen) {
        this.render();
        this.updatePins();
      }
    });
  }

  setDrawerOpen(open) {
    this.isOpen = open;
    this.drawer.classList.toggle('is-open', open);

    const btnHeader = document.getElementById('btn-toggle-histology');
    const btnDock = document.getElementById('btn-histology-dock');
    if (btnHeader) btnHeader.classList.toggle('is-active', open);
    if (btnDock) btnDock.classList.toggle('active', open);

    if (open) {
      setTimeout(() => {
        this.render();
        this.updatePins();
      }, 50);
    } else {
      this.hidePopover();
    }
  }

  toggleMaximized() {
    this.isMaximized = !this.isMaximized;
    this.drawer.classList.toggle('is-maximized', this.isMaximized);
    const btn = document.getElementById('btn-histo-expand');
    if (btn) btn.textContent = this.isMaximized ? '❐' : '⛶';
    setTimeout(() => {
      this.render();
      this.updatePins();
    }, 150);
  }

  setViewMode(mode) {
    this.viewMode = mode;
    const modeBadge = document.getElementById('histo-mode-badge');
    if (modeBadge) modeBadge.textContent = mode.toUpperCase();

    if (this.splitOverlay) {
      this.splitOverlay.style.display = mode === 'split' ? 'block' : 'none';
      if (this.splitDivider) this.splitDivider.style.left = `${(this.splitRatio * 100).toFixed(1)}%`;
    }

    this.render();
    this.updatePins();
  }

  loadSlide(slideId) {
    if (!HISTOLOGY_DATABASE[slideId]) return;
    this.activeSlideId = slideId;
    const select = document.getElementById('select-histo-slide');
    if (select && select.value !== slideId) select.value = slideId;

    const badge = document.getElementById('badge-histo-slide');
    if (badge) badge.textContent = HISTOLOGY_DATABASE[slideId].pillTag;

    this.hidePopover();
    this.updateUIHeaders();
    this.renderCurrentSlide();
    this.updatePins();
    this.populatePinsList();
  }

  updateUIHeaders() {
    const slide = HISTOLOGY_DATABASE[this.activeSlideId];
    if (!slide) return;

    const stainBadge = document.getElementById('histo-stain-badge');
    const subtitle = document.getElementById('histo-slide-subtitle');
    const panelTitle = document.getElementById('histo-panel-title');
    const panelDesc = document.getElementById('histo-panel-desc');
    const stainTitle = document.getElementById('stain-title-text');
    const stainRowsWrap = document.getElementById('stain-color-rows');

    if (stainBadge) stainBadge.textContent = slide.badge;
    if (subtitle) subtitle.textContent = slide.subTitle;
    if (panelTitle) panelTitle.textContent = slide.name;
    if (panelDesc) panelDesc.textContent = slide.description;
    if (stainTitle) stainTitle.textContent = slide.stainTitle;

    if (stainRowsWrap && slide.stainRows) {
      stainRowsWrap.innerHTML = slide.stainRows.map(row => `
        <div class="stain-color-row">
          <span class="stain-swatch" style="background:${row.color}; ${row.border ? 'border:1px solid #64748b;' : ''}"></span>
          <span class="stain-key">${row.label}</span>
        </div>
      `).join('');
    }
  }

  populatePinsList() {
    const slide = HISTOLOGY_DATABASE[this.activeSlideId];
    const listWrap = document.getElementById('histo-pins-list');
    const countLabel = document.getElementById('pins-count-label');
    if (!slide || !listWrap) return;

    const pins = (this.viewMode === 'normal') 
      ? slide.normalPins 
      : (this.viewMode === 'pathology') 
        ? slide.pathologyPins 
        : [...slide.normalPins, ...slide.pathologyPins];

    if (countLabel) countLabel.textContent = pins.length;

    listWrap.innerHTML = pins.map(pin => `
      <div class="histo-pin-list-item" data-pin-id="${pin.id}">
        <span style="display:flex; align-items:center; gap:6px;">
          <span style="width:8px; height:8px; border-radius:50%; background:${pin.isPath ? '#f43f5e' : '#00f0ff'};"></span>
          <span>${pin.name}</span>
        </span>
        <span class="histo-pin-list-target">${pin.targetMesh}</span>
      </div>
    `).join('');

    listWrap.querySelectorAll('.histo-pin-list-item').forEach(item => {
      item.addEventListener('click', () => {
        const pinId = item.dataset.pinId;
        const targetPin = pins.find(p => p.id === pinId);
        if (targetPin) {
          this.focusPin(targetPin);
        }
      });
    });
  }

  focusPin(pin) {
    this.selectedPin = pin;
    if (typeof selectOrgan === 'function') {
      selectOrgan(pin.targetMesh, true);
    }
    this.showPopoverForPin(pin);
  }

  showPopoverForPin(pin) {
    if (!this.popover) return;
    this.selectedPin = pin;

    const badge = document.getElementById('popover-cell-badge');
    const name = document.getElementById('popover-cell-name');
    const desc = document.getElementById('popover-cell-desc');
    const link = document.getElementById('popover-3d-link');

    if (badge) {
      badge.textContent = pin.badge;
      badge.style.color = pin.isPath ? '#f43f5e' : '#00f0ff';
      badge.style.background = pin.isPath ? 'rgba(244, 63, 94, 0.15)' : 'rgba(0, 240, 255, 0.12)';
    }
    if (name) name.textContent = pin.name;
    if (desc) desc.textContent = pin.desc;
    if (link) link.textContent = pin.targetMesh;

    // Calculate position relative to viewport
    const container = document.getElementById('histo-viewport-container');
    if (container) {
      const w = container.clientWidth;
      const h = container.clientHeight;
      let px = (pin.x - 0.5) * w * this.scale + w / 2 + this.panX;
      let py = (pin.y - 0.5) * h * this.scale + h / 2 + this.panY;

      // Keep inside container bounds
      const popW = 290;
      const popH = 170;
      px = Math.max(10, Math.min(w - popW - 10, px - popW / 2));
      py = Math.max(10, Math.min(h - popH - 10, py - popH - 15));

      this.popover.style.left = `${px}px`;
      this.popover.style.top = `${py}px`;
      this.popover.style.display = 'flex';
    }
  }

  hidePopover() {
    if (this.popover) this.popover.style.display = 'none';
    this.selectedPin = null;
  }

  renderCurrentSlide() {
    this.render();
    this.populatePinsList();
  }

  render() {
    if (!this.canvas || !this.ctx) return;
    const container = document.getElementById('histo-viewport-container');
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;
    if (width <= 0 || height <= 0) return;

    const dpr = window.devicePixelRatio || 1;
    if (this.canvas.width !== width * dpr || this.canvas.height !== height * dpr) {
      this.canvas.width = width * dpr;
      this.canvas.height = height * dpr;
    }

    const ctx = this.ctx;
    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, width, height);

    if (this.viewMode === 'normal') {
      this.drawTissue(ctx, width, height, this.activeSlideId, false);
    } else if (this.viewMode === 'pathology') {
      this.drawTissue(ctx, width, height, this.activeSlideId, true);
    } else if (this.viewMode === 'split') {
      // Left side: Normal
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 0, width * this.splitRatio, height);
      ctx.clip();
      this.drawTissue(ctx, width, height, this.activeSlideId, false);
      ctx.restore();

      // Right side: Pathology
      ctx.save();
      ctx.beginPath();
      ctx.rect(width * this.splitRatio, 0, width * (1 - this.splitRatio), height);
      ctx.clip();
      this.drawTissue(ctx, width, height, this.activeSlideId, true);
      ctx.restore();
    }

    ctx.restore();
  }

  drawTissue(ctx, w, h, slideId, isPath) {
    ctx.save();
    // Center transformation with pan and scale
    ctx.translate(w / 2 + this.panX, h / 2 + this.panY);
    ctx.scale(this.scale, this.scale);
    ctx.translate(-w / 2, -h / 2);

    switch (slideId) {
      case 'cochlea':
        this.renderCochlea(ctx, w, h, isPath);
        break;
      case 'coronary':
        this.renderCoronary(ctx, w, h, isPath);
        break;
      case 'lung':
        this.renderLung(ctx, w, h, isPath);
        break;
      case 'kidney':
        this.renderKidney(ctx, w, h, isPath);
        break;
      case 'liver':
        this.renderLiver(ctx, w, h, isPath);
        break;
      default:
        this.renderCoronary(ctx, w, h, isPath);
    }
    ctx.restore();
  }

  // --------------------------------------------------------------------------
  // HISTOLOGICAL TISSUE VECTOR RENDERERS
  // --------------------------------------------------------------------------

  renderCochlea(ctx, w, h, isPath) {
    // Background endolymph fluid
    ctx.fillStyle = isPath ? "#13091f" : "#0d1326";
    ctx.fillRect(0, 0, w, h);

    // Scala Tympani & Vestibuli partitions (perilymph)
    const cx = w * 0.5;
    const cy = h * 0.55;

    // Basilar Membrane (eosin pink band)
    ctx.beginPath();
    ctx.moveTo(w * 0.2, cy + 50);
    ctx.quadraticCurveTo(cx, cy + 60, w * 0.85, cy + 30);
    ctx.lineWidth = isPath ? 14 : 9;
    ctx.strokeStyle = isPath ? "#9d3a68" : "#d87295";
    ctx.stroke();

    // Tectorial Membrane (wavy gelatinous ribbon overlying sensory cells)
    ctx.beginPath();
    ctx.moveTo(w * 0.32, cy - 35);
    ctx.bezierCurveTo(cx - 30, cy - 50, cx + 40, cy - 10, w * 0.72, isPath ? cy - 40 : cy + 10);
    ctx.lineWidth = 14;
    ctx.lineCap = 'round';
    ctx.strokeStyle = isPath ? "rgba(224, 122, 155, 0.4)" : "rgba(224, 122, 155, 0.85)";
    ctx.stroke();

    // Tunnel of Corti (triangular pillar cell arch)
    ctx.beginPath();
    ctx.moveTo(cx - 35, cy + 55);
    ctx.lineTo(cx - 5, cy + 10);
    ctx.lineTo(cx + 25, cy + 53);
    ctx.closePath();
    ctx.fillStyle = isPath ? "rgba(40, 20, 60, 0.7)" : "rgba(15, 23, 42, 0.85)";
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#4a2d73";
    ctx.stroke();

    // Inner Hair Cell (1 row, flask shaped)
    const ihcX = cx - 55;
    const ihcY = cy + 20;
    ctx.beginPath();
    ctx.ellipse(ihcX, ihcY, 14, 22, -0.15, 0, Math.PI * 2);
    ctx.fillStyle = "#e07a9b";
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#4a2d73";
    ctx.stroke();

    // IHC Nucleus
    ctx.beginPath();
    ctx.arc(ihcX, ihcY + 8, 7, 0, Math.PI * 2);
    ctx.fillStyle = "#4a2d73";
    ctx.fill();

    // Stereocilia tuft on IHC
    ctx.beginPath();
    ctx.moveTo(ihcX - 4, ihcY - 22);
    ctx.lineTo(ihcX - 3, ihcY - (isPath ? 28 : 36));
    ctx.moveTo(ihcX + 2, ihcY - 22);
    ctx.lineTo(ihcX + 4, ihcY - (isPath ? 29 : 38));
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = isPath ? "#be123c" : "#f472b6";
    ctx.stroke();

    // Outer Hair Cells (3 rows)
    for (let i = 0; i < 3; i++) {
      const ohcX = cx + 45 + i * 28;
      const ohcY = cy + 20 + i * 4;
      if (isPath && i > 0) {
        // Degenerated apoptotic ghost cells
        ctx.beginPath();
        ctx.ellipse(ohcX, ohcY, 9, 14, 0.25, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(74, 45, 115, 0.2)";
        ctx.fill();
        continue;
      }

      ctx.beginPath();
      ctx.ellipse(ohcX, ohcY, 12, 24, 0.25, 0, Math.PI * 2);
      ctx.fillStyle = "#e07a9b";
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#4a2d73";
      ctx.stroke();

      // Nucleus
      ctx.beginPath();
      ctx.arc(ohcX, ohcY + 8, 6, 0, Math.PI * 2);
      ctx.fillStyle = "#4a2d73";
      ctx.fill();

      // Stereocilia (V-shaped pattern)
      if (!isPath) {
        ctx.beginPath();
        ctx.moveTo(ohcX - 5, ohcY - 23);
        ctx.lineTo(ohcX - 8, ohcY - 36);
        ctx.moveTo(ohcX, ohcY - 24);
        ctx.lineTo(ohcX - 1, ohcY - 39);
        ctx.moveTo(ohcX + 5, ohcY - 23);
        ctx.lineTo(ohcX + 6, ohcY - 35);
        ctx.lineWidth = 2;
        ctx.strokeStyle = "#f472b6";
        ctx.stroke();
      }
    }

    // Spiral Ganglion (neurons on medial side)
    for (let n = 0; n < (isPath ? 5 : 14); n++) {
      const gx = w * 0.16 + (n % 4) * 22;
      const gy = h * 0.65 + Math.floor(n / 4) * 24;
      ctx.beginPath();
      ctx.arc(gx, gy, 10, 0, Math.PI * 2);
      ctx.fillStyle = "#e07a9b";
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#4a2d73";
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(gx, gy, 5, 0, Math.PI * 2);
      ctx.fillStyle = "#39195c";
      ctx.fill();
    }
  }

  renderCoronary(ctx, w, h, isPath) {
    const cx = w * 0.5;
    const cy = h * 0.5;
    const outerR = Math.min(w, h) * 0.42;

    // Background connective tissue (adventitia)
    ctx.fillStyle = "#0c101d";
    ctx.fillRect(0, 0, w, h);

    // Tunica Media: robust concentric bands of smooth muscle
    ctx.beginPath();
    ctx.arc(cx, cy, outerR, 0, Math.PI * 2);
    ctx.fillStyle = isPath ? "#2b1222" : "#3b1528";
    ctx.fill();
    ctx.lineWidth = 8;
    ctx.strokeStyle = "#4a2d73";
    ctx.stroke();

    if (!isPath) {
      // Normal Artery: wide open patent circular lumen
      ctx.beginPath();
      ctx.arc(cx, cy, outerR * 0.72, 0, Math.PI * 2);
      ctx.fillStyle = "#080c16";
      ctx.fill();
      ctx.lineWidth = 3;
      ctx.strokeStyle = "#e07a9b";
      ctx.stroke();

      // Endothelial cell nuclei along perimeter
      const count = 36;
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2;
        const ex = cx + Math.cos(angle) * (outerR * 0.72);
        const ey = cy + Math.sin(angle) * (outerR * 0.72);
        ctx.beginPath();
        ctx.ellipse(ex, ey, 5, 2.5, angle, 0, Math.PI * 2);
        ctx.fillStyle = "#4a2d73";
        ctx.fill();
      }

      // Red blood cells floating in lumen
      for (let r = 0; r < 24; r++) {
        const rAng = r * 1.37;
        const rDist = Math.sin(r * 4.2) * (outerR * 0.55);
        ctx.beginPath();
        ctx.arc(cx + Math.cos(rAng) * rDist, cy + Math.sin(rAng) * rDist, 6, 0, Math.PI * 2);
        ctx.fillStyle = "#e11d48";
        ctx.fill();
      }
      return;
    }

    // PATHOLOGY: Advanced Atherosclerotic Plaque (Fibroatheroma)
    // 1. Necrotic Lipid Core
    ctx.beginPath();
    ctx.ellipse(cx + 20, cy + 30, outerR * 0.65, outerR * 0.45, 0.15, 0, Math.PI * 2);
    ctx.fillStyle = "#1e1428";
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = "#581c87";
    ctx.stroke();

    // 2. Cholesterol Clefts (Needle-like acellular white slits)
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2.5;
    for (let c = 0; c < 30; c++) {
      const angle = (c * 0.45) % (Math.PI * 2);
      const rad = 25 + (c * 13) % 95;
      const x = cx + 15 + Math.cos(angle) * rad;
      const y = cy + 25 + Math.sin(angle) * (rad * 0.7);
      const len = 16 + (c % 5) * 5;
      const rot = 0.4 + (c % 4) * 0.3;

      ctx.beginPath();
      ctx.moveTo(x - Math.cos(rot) * len, y - Math.sin(rot) * len);
      ctx.lineTo(x + Math.cos(rot) * len, y + Math.sin(rot) * len);
      ctx.stroke();
    }

    // 3. Foam Cells (pale vacuolated bubbly lipid macrophages)
    for (let f = 0; f < 35; f++) {
      const fAng = (f * 0.75);
      const fRad = 45 + (f * 9) % 110;
      const fx = cx - 20 + Math.cos(fAng) * fRad;
      const fy = cy + 10 + Math.sin(fAng) * (fRad * 0.6);

      ctx.beginPath();
      ctx.arc(fx, fy, 8, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(244, 151, 178, 0.45)";
      ctx.fill();
      ctx.lineWidth = 1.2;
      ctx.strokeStyle = "#4a2d73";
      ctx.stroke();

      // Eccentric dark nucleus
      ctx.beginPath();
      ctx.arc(fx + 2.5, fy + 2, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = "#39195c";
      ctx.fill();
    }

    // 4. Dystrophic Calcification (deep basophilic purple granular deposits)
    for (let k = 0; k < 18; k++) {
      const kx = cx + 30 + Math.cos(k * 1.1) * (k * 4.5);
      const ky = cy + 70 + Math.sin(k * 1.7) * 15;
      ctx.beginPath();
      ctx.arc(kx, ky, 6 + (k % 4) * 2, 0, Math.PI * 2);
      ctx.fillStyle = "#250e3e";
      ctx.fill();
      ctx.strokeStyle = "#7e22ce";
      ctx.stroke();
    }

    // 5. Fibrous Cap (dense collagen band overlying plaque)
    ctx.beginPath();
    ctx.ellipse(cx - 35, cy - 60, outerR * 0.55, 32, -0.25, 0, Math.PI * 2);
    ctx.fillStyle = "#e07a9b";
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#f472b6";
    ctx.stroke();

    // 6. Severely Stenosed Residual Lumen (eccentric, 75% occlusion)
    ctx.beginPath();
    ctx.ellipse(cx - 70, cy - 80, outerR * 0.28, outerR * 0.18, -0.4, 0, Math.PI * 2);
    ctx.fillStyle = "#090d18";
    ctx.fill();
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = "#f43f5e";
    ctx.stroke();

    // Trapped erythrocytes in residual lumen
    for (let b = 0; b < 12; b++) {
      const bx = cx - 70 + (Math.sin(b * 2.1) * 22);
      const by = cy - 80 + (Math.cos(b * 2.5) * 14);
      ctx.beginPath();
      ctx.arc(bx, by, 5, 0, Math.PI * 2);
      ctx.fillStyle = "#e11d48";
      ctx.fill();
    }
  }

  renderLung(ctx, w, h, isPath) {
    ctx.fillStyle = "#070b14";
    ctx.fillRect(0, 0, w, h);

    if (!isPath) {
      // Normal Lung: Delicate honeycomb lattice of thin alveolar septa
      const rows = 5;
      const cols = 7;
      const dx = w / cols;
      const dy = h / rows;

      ctx.lineWidth = 3.5;
      ctx.strokeStyle = "#e07a9b";

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const ax = c * dx + dx * 0.5 + (r % 2 ? dx * 0.25 : 0);
          const ay = r * dy + dy * 0.5;

          ctx.beginPath();
          ctx.arc(ax, ay, dx * 0.38, 0, Math.PI * 2);
          ctx.stroke();

          // Type I Pneumocyte nuclei (flat squamous)
          ctx.beginPath();
          ctx.ellipse(ax + dx * 0.35, ay, 6, 2, 0.4, 0, Math.PI * 2);
          ctx.fillStyle = "#4a2d73";
          ctx.fill();

          // Type II Pneumocyte (cuboidal, at corners)
          if ((r + c) % 2 === 0) {
            ctx.beginPath();
            ctx.arc(ax - dx * 0.32, ay - dy * 0.2, 5.5, 0, Math.PI * 2);
            ctx.fillStyle = "#e07a9b";
            ctx.fill();
            ctx.beginPath();
            ctx.arc(ax - dx * 0.32, ay - dy * 0.2, 3, 0, Math.PI * 2);
            ctx.fillStyle = "#39195c";
            ctx.fill();
          }

          // Capillary red blood cells in septa
          ctx.beginPath();
          ctx.arc(ax, ay + dx * 0.38, 3.5, 0, Math.PI * 2);
          ctx.fillStyle = "#e11d48";
          ctx.fill();
        }
      }
      return;
    }

    // PATHOLOGY: Centriacinar Emphysema (Septal destruction and bullae)
    // Confluent destroyed bullae
    ctx.fillStyle = "#060810";
    ctx.fillRect(0, 0, w, h);

    // Broken septal remnants (free floating clubbed spurs)
    ctx.lineWidth = 5;
    ctx.strokeStyle = "#e07a9b";
    ctx.lineCap = "round";

    const spurs = [
      { x1: w * 0.15, y1: h * 0.2, x2: w * 0.35, y2: h * 0.38 },
      { x1: w * 0.45, y1: h * 0.15, x2: w * 0.48, y2: h * 0.32 },
      { x1: w * 0.82, y1: h * 0.25, x2: w * 0.65, y2: h * 0.42 },
      { x1: w * 0.18, y1: h * 0.75, x2: w * 0.38, y2: h * 0.62 },
      { x1: w * 0.55, y1: h * 0.85, x2: w * 0.52, y2: h * 0.65 },
      { x1: w * 0.88, y1: h * 0.70, x2: w * 0.72, y2: h * 0.58 }
    ];

    spurs.forEach(s => {
      ctx.beginPath();
      ctx.moveTo(s.x1, s.y1);
      ctx.lineTo(s.x2, s.y2);
      ctx.stroke();

      // Clubbed bulbous end of ruptured septal spur
      ctx.beginPath();
      ctx.arc(s.x2, s.y2, 7.5, 0, Math.PI * 2);
      ctx.fillStyle = "#e07a9b";
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#4a2d73";
      ctx.stroke();
    });

    // Pigmented smoker macrophages with black/brown anthracotic carbon
    for (let m = 0; m < 16; m++) {
      const mx = w * 0.35 + (Math.sin(m * 1.8) * w * 0.25);
      const my = h * 0.45 + (Math.cos(m * 2.3) * h * 0.25);

      ctx.beginPath();
      ctx.arc(mx, my, 11, 0, Math.PI * 2);
      ctx.fillStyle = "#e07a9b";
      ctx.fill();
      ctx.strokeStyle = "#4a2d73";
      ctx.stroke();

      // Carbon granules
      for (let g = 0; g < 5; g++) {
        ctx.beginPath();
        ctx.arc(mx - 4 + g * 2, my - 3 + (g % 3) * 3, 2, 0, Math.PI * 2);
        ctx.fillStyle = "#1e293b";
        ctx.fill();
      }
    }
  }

  renderKidney(ctx, w, h, isPath) {
    // PAS STAIN: Intense magenta basement membranes, delicate pink cytoplasm
    ctx.fillStyle = "#0c0814";
    ctx.fillRect(0, 0, w, h);

    const cx = w * 0.5;
    const cy = h * 0.5;
    const r = Math.min(w, h) * 0.36;

    // Bowman's Capsule (circular outer wall)
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.lineWidth = isPath ? 7 : 4;
    ctx.strokeStyle = "#d946ef"; // PAS intense magenta
    ctx.stroke();

    // Bowman's space (clear crescent)
    ctx.fillStyle = "#08060e";
    ctx.fill();

    // Glomerular Tuft (central lobules)
    const tuftR = isPath ? r * 0.88 : r * 0.74;

    if (!isPath) {
      // Normal Glomerulus: delicate open capillary loops with razor-thin PAS magenta GBM
      for (let l = 0; l < 8; l++) {
        const ang = (l / 8) * Math.PI * 2;
        const lx = cx + Math.cos(ang) * (tuftR * 0.5);
        const ly = cy + Math.sin(ang) * (tuftR * 0.5);

        ctx.beginPath();
        ctx.arc(lx, ly, tuftR * 0.32, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(250, 232, 255, 0.12)";
        ctx.fill();
        ctx.lineWidth = 2.5;
        ctx.strokeStyle = "#d946ef";
        ctx.stroke();

        // Podocyte nuclei on urinary surface
        ctx.beginPath();
        ctx.arc(lx + Math.cos(ang) * (tuftR * 0.34), ly + Math.sin(ang) * (tuftR * 0.34), 4.5, 0, Math.PI * 2);
        ctx.fillStyle = "#6b21a8";
        ctx.fill();
      }
      return;
    }

    // PATHOLOGY: Diabetic Glomerulosclerosis (Kimmelstiel-Wilson Lesions)
    // 1. Markedly thickened, ribbon-like GBM
    ctx.lineWidth = 8;
    ctx.strokeStyle = "#c026d3";
    for (let b = 0; b < 6; b++) {
      const bAng = (b / 6) * Math.PI * 2;
      ctx.beginPath();
      ctx.arc(cx + Math.cos(bAng) * (tuftR * 0.55), cy + Math.sin(bAng) * (tuftR * 0.55), tuftR * 0.35, 0, Math.PI * 2);
      ctx.stroke();
    }

    // 2. Kimmelstiel-Wilson Nodules (Concentric spherical PAS-intense mesangial nodules)
    const nodules = [
      { x: cx - tuftR * 0.32, y: cy - tuftR * 0.25, rad: tuftR * 0.30 },
      { x: cx + tuftR * 0.35, y: cy - tuftR * 0.20, rad: tuftR * 0.28 },
      { x: cx - tuftR * 0.15, y: cy + tuftR * 0.35, rad: tuftR * 0.34 },
      { x: cx + tuftR * 0.30, y: cy + tuftR * 0.30, rad: tuftR * 0.26 }
    ];

    nodules.forEach(nod => {
      // Outer laminated ring
      ctx.beginPath();
      ctx.arc(nod.x, nod.y, nod.rad, 0, Math.PI * 2);
      ctx.fillStyle = "#86198f";
      ctx.fill();
      ctx.lineWidth = 4;
      ctx.strokeStyle = "#f0abfc";
      ctx.stroke();

      // Inner dense PAS core
      ctx.beginPath();
      ctx.arc(nod.x, nod.y, nod.rad * 0.65, 0, Math.PI * 2);
      ctx.fillStyle = "#a21caf";
      ctx.fill();

      // Acellular center
      ctx.beginPath();
      ctx.arc(nod.x, nod.y, nod.rad * 0.35, 0, Math.PI * 2);
      ctx.fillStyle = "#d946ef";
      ctx.fill();
    });

    // 3. Arteriolar Hyalinosis cuff at vascular pole
    ctx.beginPath();
    ctx.ellipse(cx + tuftR * 0.75, cy + tuftR * 0.75, 24, 15, Math.PI / 4, 0, Math.PI * 2);
    ctx.fillStyle = "#e879f9";
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#a21caf";
    ctx.stroke();
  }

  renderLiver(ctx, w, h, isPath) {
    // MASSON TRICHROME: Brilliant aniline blue collagen, scarlet red hepatocytes, dark nuclei
    ctx.fillStyle = "#0a0d18";
    ctx.fillRect(0, 0, w, h);

    if (!isPath) {
      // Normal Liver: regular cords of red hepatocytes with delicate portal triad
      // Hepatocyte cords (plates)
      const count = 48;
      for (let i = 0; i < count; i++) {
        const hx = (i % 8) * (w / 8) + (w / 16);
        const hy = Math.floor(i / 8) * (h / 6) + (h / 12);

        ctx.beginPath();
        ctx.arc(hx, hy, 16, 0, Math.PI * 2);
        ctx.fillStyle = "#dc2626"; // Scarlet red
        ctx.fill();
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = "#991b1b";
        ctx.stroke();

        // Nucleus (dark blue-black)
        ctx.beginPath();
        ctx.arc(hx, hy, 5, 0, Math.PI * 2);
        ctx.fillStyle = "#0f172a";
        ctx.fill();

        // Binucleated cells in normal liver
        if (i % 5 === 0) {
          ctx.beginPath();
          ctx.arc(hx + 7, hy, 4, 0, Math.PI * 2);
          ctx.fillStyle = "#0f172a";
          ctx.fill();
        }
      }

      // Portal Triad (small localized portal tract with minimal blue collagen)
      const tx = w * 0.28;
      const ty = h * 0.38;
      ctx.beginPath();
      ctx.ellipse(tx, ty, 45, 35, 0, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(29, 78, 216, 0.2)";
      ctx.fill();
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = "#2563eb";
      ctx.stroke();

      // Portal vein branch
      ctx.beginPath();
      ctx.ellipse(tx - 12, ty, 18, 12, 0.3, 0, Math.PI * 2);
      ctx.fillStyle = "#0f172a";
      ctx.fill();
      ctx.strokeStyle = "#38bdf8";
      ctx.stroke();

      // Bile ductule (cuboidal cells)
      ctx.beginPath();
      ctx.arc(tx + 18, ty - 8, 8, 0, Math.PI * 2);
      ctx.fillStyle = "#dc2626";
      ctx.fill();
      ctx.stroke();
      return;
    }

    // PATHOLOGY: Advanced Cirrhosis with Bridging Fibrosis (Masson Trichrome)
    // 1. Broad Aniline Blue Collagen Bridging Septa
    ctx.lineWidth = 28;
    ctx.strokeStyle = "#1d4ed8"; // Brilliant aniline blue
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    ctx.beginPath();
    ctx.moveTo(0, h * 0.45);
    ctx.bezierCurveTo(w * 0.35, h * 0.40, w * 0.40, h * 0.65, w, h * 0.55);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(w * 0.52, 0);
    ctx.bezierCurveTo(w * 0.45, h * 0.35, w * 0.58, h * 0.70, w * 0.48, h);
    ctx.stroke();

    // 2. Regenerative Nodules (Entrapped clonal islands of hepatocytes)
    const nodules = [
      { x: w * 0.25, y: h * 0.22, rx: w * 0.18, ry: h * 0.16 },
      { x: w * 0.78, y: h * 0.25, rx: w * 0.16, ry: h * 0.18 },
      { x: w * 0.22, y: h * 0.75, rx: w * 0.16, ry: h * 0.17 },
      { x: w * 0.76, y: h * 0.80, rx: w * 0.18, ry: h * 0.16 }
    ];

    nodules.forEach(nod => {
      ctx.beginPath();
      ctx.ellipse(nod.x, nod.y, nod.rx, nod.ry, 0, 0, Math.PI * 2);
      ctx.fillStyle = "#ef4444";
      ctx.fill();
      ctx.lineWidth = 5;
      ctx.strokeStyle = "#1e40af"; // Encapsulating blue collagen ring
      ctx.stroke();

      // Swollen hepatocytes with fatty change vacuoles inside nodule
      for (let c = 0; c < 12; c++) {
        const cx = nod.x + Math.sin(c * 2.1) * (nod.rx * 0.65);
        const cy = nod.y + Math.cos(c * 2.7) * (nod.ry * 0.65);
        ctx.beginPath();
        ctx.arc(cx, cy, 9, 0, Math.PI * 2);
        ctx.fillStyle = "#dc2626";
        ctx.fill();

        ctx.beginPath();
        ctx.arc(cx, cy, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = "#0f172a";
        ctx.fill();
      }
    });

    // 3. Proliferating Bile Ductules (Ductular reaction) within the blue scar
    for (let d = 0; d < 8; d++) {
      const dx = w * 0.48 + Math.sin(d * 1.5) * 25;
      const dy = h * 0.40 + Math.cos(d * 1.8) * 45;
      ctx.beginPath();
      ctx.arc(dx, dy, 5, 0, Math.PI * 2);
      ctx.fillStyle = "#ef4444";
      ctx.fill();
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = "#3b82f6";
      ctx.stroke();
    }
  }

  // --------------------------------------------------------------------------
  // INTERACTIVE ANNOTATION PINS SYSTEM
  // --------------------------------------------------------------------------

  updatePins() {
    if (!this.pinsLayer) return;
    this.pinsLayer.innerHTML = '';

    if (!this.showPins) return;
    const slide = HISTOLOGY_DATABASE[this.activeSlideId];
    if (!slide) return;

    const container = document.getElementById('histo-viewport-container');
    if (!container) return;
    const w = container.clientWidth;
    const h = container.clientHeight;

    const currentPins = (this.viewMode === 'normal') 
      ? slide.normalPins 
      : (this.viewMode === 'pathology') 
        ? slide.pathologyPins 
        : [...slide.normalPins, ...slide.pathologyPins];

    currentPins.forEach(pin => {
      // In split view, check if pin belongs to its visible split half
      if (this.viewMode === 'split') {
        if (!pin.isPath && pin.x > this.splitRatio) return;
        if (pin.isPath && pin.x < this.splitRatio) return;
      }

      // Convert normalized coordinates (0..1) to screen coordinates
      const screenX = (pin.x - 0.5) * w * this.scale + w / 2 + this.panX;
      const screenY = (pin.y - 0.5) * h * this.scale + h / 2 + this.panY;

      // Don't render pins if out of viewport
      if (screenX < -20 || screenX > w + 20 || screenY < -20 || screenY > h + 20) return;

      const pinEl = document.createElement('div');
      pinEl.className = `histo-pin ${pin.isPath ? 'pin-pathology' : 'pin-normal'}`;
      pinEl.style.left = `${screenX}px`;
      pinEl.style.top = `${screenY}px`;
      pinEl.dataset.pinId = pin.id;

      pinEl.innerHTML = `
        <div class="histo-pin-dot"></div>
        <span class="histo-pin-label">${pin.name}</span>
      `;

      pinEl.addEventListener('click', (e) => {
        e.stopPropagation();
        this.focusPin(pin);
      });

      this.pinsLayer.appendChild(pinEl);
    });
  }

  // --------------------------------------------------------------------------
  // BIDIRECTIONAL SYNCHRONIZATION INTERFACE
  // --------------------------------------------------------------------------

  syncFrom3D(meshName) {
    if (!meshName) return;
    let targetSlide = null;

    if (meshName.includes("Cochlea") || meshName.includes("Ear") || meshName.includes("Ossicle") || meshName.includes("Sens_")) {
      targetSlide = "cochlea";
    } else if (meshName.includes("Heart") || meshName.includes("Coronary") || meshName.includes("Aorta") || meshName.includes("Vessel_")) {
      targetSlide = "coronary";
    } else if (meshName.includes("Lung") || meshName.includes("Resp_") || meshName.includes("Trachea") || meshName.includes("Bronch")) {
      targetSlide = "lung";
    } else if (meshName.includes("Kidney") || meshName.includes("Renal") || meshName.includes("Uro_") || meshName.includes("Adrenal")) {
      targetSlide = "kidney";
    } else if (meshName.includes("Liver") || meshName.includes("Hepatic") || meshName.includes("GI_") || meshName.includes("Gallbladder")) {
      targetSlide = "liver";
    }

    if (targetSlide && targetSlide !== this.activeSlideId) {
      this.loadSlide(targetSlide);
      // Pulse toggle button to notify user
      const toggle = document.getElementById('btn-toggle-histology');
      if (toggle) {
        toggle.classList.add('is-active');
        setTimeout(() => {
          if (!this.isOpen) toggle.classList.remove('is-active');
        }, 1200);
      }
    }
  }

  syncFromSubmodel(modelFile) {
    if (!modelFile) return;
    if (modelFile.includes("auditory")) {
      this.loadSlide("cochlea");
    } else if (modelFile.includes("coronary") || modelFile.includes("cardiopulmonary")) {
      this.loadSlide("coronary");
    } else if (modelFile.includes("pulmonary")) {
      this.loadSlide("lung");
    } else if (modelFile.includes("gastrointestinal")) {
      this.loadSlide("liver");
    }
  }
}

// Instantiate and expose globally for bidirectional linking
const virtualHistology = new VirtualHistologyEngine();
window.VirtualHistology = virtualHistology;

