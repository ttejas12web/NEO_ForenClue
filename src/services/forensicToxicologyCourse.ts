import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export interface ToxQuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  referenceTopic: string;
}

export interface ToxAssignmentField {
  id: string;
  label: string;
  type: 'number' | 'select' | 'text';
  placeholder?: string;
  unit?: string;
  options?: string[];
  expectedValue: string | number;
  tolerance?: number; // for numeric fields
  criterionLabel: string;
  hint: string;
}

export interface ToxAssignmentRubric {
  id: string;
  title: string;
  caseScenario: string;
  instructions: string[];
  structuredFields: ToxAssignmentField[];
  writtenPrompt: string;
  minWordCount: number;
  requiredKeywords: {
    groupLabel: string;
    terms: string[]; // at least one term from each group must appear
  }[];
  sampleFrameworkHint: string;
}

export interface ToxStudySection {
  id: string;
  heading: string;
  badge: string;
  summary: string;
  contentBlocks: {
    subtitle: string;
    body: string;
    formula?: string;
    keyPoints?: string[];
  }[];
  referenceTable?: {
    caption: string;
    headers: string[];
    rows: string[][];
  };
}

export interface ToxModule {
  id: string;
  moduleNumber: number;
  code: string;
  title: string;
  subtitle: string;
  level: 'Foundation' | 'Intermediate' | 'Advanced';
  estimatedHours: string;
  learningObjectives: string[];
  sections: ToxStudySection[];
  interactiveToolType: 'viscera_matrix' | 'pmr_calculator' | 'widmark_calculator' | 'ndps_schedule_checker' | 'analytical_validator' | 'fsl_report_verifier';
  quiz: ToxQuizQuestion[];
  assignment: ToxAssignmentRubric;
}

export interface ToxModuleProgress {
  readingCompleted: boolean;
  completedSectionIds: string[];
  quizScore: number | null; // percentage 0 - 100
  quizPassed: boolean; // >= 90
  quizAnswers: Record<string, number>;
  quizAttempts: number;
  assignmentFieldValues: Record<string, string>;
  assignmentWrittenResponse: string;
  assignmentPassed: boolean;
  assignmentCriteriaResults: {
    criterionId: string;
    label: string;
    passed: boolean;
    feedback: string;
  }[];
  assignmentSubmittedAt?: string;
}

export interface ToxCourseEnrollment {
  enrolled: boolean;
  syllabusVersion?: string;
  registeredName: string;
  enrolledAt: string;
  email: string;
  institution?: string;
  certificateIssued?: boolean;
  certificateNo?: string;
  certificateIssuedAt?: string;
  modules: Record<string, ToxModuleProgress>;
}

export interface CertTemplateConfig {
  templateBlobUrl?: string; // firestore-blob:// or data:application/pdf;base64,...
  templateFileName?: string;
  nameXPercent: number; // 0 to 100 (% of page width)
  nameYPercent: number; // 0 to 100 (% from bottom of page)
  nameFontSize: number;
  nameColorHex: string;
  nameCentered: boolean;
  dateXPercent: number;
  dateYPercent: number;
  dateFontSize: number;
  dateColorHex: string;
  dateCentered: boolean;
  showCertId: boolean;
  certIdXPercent: number;
  certIdYPercent: number;
  certIdFontSize: number;
  certIdColorHex: string;
  updatedAt?: string;
}

export const DEFAULT_CERT_TEMPLATE_CONFIG: CertTemplateConfig = {
  templateBlobUrl: '',
  templateFileName: 'Default ForenClue Official Forensic Toxicology Template',
  nameXPercent: 50,
  nameYPercent: 52,
  nameFontSize: 28,
  nameColorHex: '#1E293B',
  nameCentered: true,
  dateXPercent: 28,
  dateYPercent: 22,
  dateFontSize: 13,
  dateColorHex: '#334155',
  dateCentered: true,
  showCertId: true,
  certIdXPercent: 72,
  certIdYPercent: 22,
  certIdFontSize: 11,
  certIdColorHex: '#475569',
};

export const FORENSIC_TOXICOLOGY_COURSE_ID = 7;
export const FORENSIC_TOXICOLOGY_COURSE_CODE = 'FT2601';
export const CURRENT_TOX_SYLLABUS_VERSION = 'FT2601-BLENDED-V2';

export const FORENSIC_TOXICOLOGY_MODULES: ToxModule[] = [
  {
    id: 'tox-mod-1',
    moduleNumber: 1,
    code: 'FT2601-M1',
    title: 'Module 1: Foundations of Forensic Toxicology, Poisoning in India, Pharmacokinetics & Pharmacodynamics',
    subtitle: 'Scope & history, classification of poisons, factors modifying poison action, ADME pharmacokinetics, receptor pharmacodynamics, classical toxidromes & antidotes, Indian poisoning epidemiology (NCRB), crime scene investigation, and Indian poison laws.',
    level: 'Foundation',
    estimatedHours: '8 Hours',
    learningObjectives: [
      'Differentiate clinical, analytical, environmental, and medico-legal forensic toxicology across India’s CFSL/SFSL/RFSL laboratory network.',
      'Classify poisons by origin, mode of action, chemical nature, and medico-legal intent, and evaluate factors modifying the intensity of poisoning.',
      'Master Pharmacokinetics (Absorption, Distribution, Metabolism, Elimination) and Pharmacodynamics (Receptor types, classification, and dose-response metrics).',
      'Recognize classical toxidromes and specific antidotes, analyze Indian poisoning trends (NCRB ADSI data), and apply crime scene and statutory protocols (Poisons Act 1919, Drugs & Cosmetics Act 1940, Insecticides Act 1968, NDPS Act 1985, BNS/BNSS/BSA).'
    ],
    interactiveToolType: 'viscera_matrix',
    sections: [
      {
        id: 'm1-s1',
        heading: '1.1 Scope of Forensic Toxicology, Classification of Poisons & Factors Modifying Poison Action',
        badge: 'Foundations',
        summary: 'History from Kautilya’s Arthashastra and Paracelsus to Orfila, Indian FSL hierarchy, multi-axis poison classification, and host/chemical modifying factors.',
        contentBlocks: [
          {
            subtitle: 'Introduction, Scope & Institutional Framework of Forensic Toxicology',
            body: 'Forensic toxicology is the application of toxicology, analytical chemistry, pharmacology, and clinical medicine to the purposes of the law. Historically, ancient Indian treatises such as Kautilya’s Arthashastra and the Sushruta Samhita (Kalpasthana) documented vegetable, animal, and mineral poisons (Visha) alongside royal kitchen food-tasting protocols. In the 16th century, Paracelsus established the dose-response principle ("Sola dosis facit venenum" — Only the dose makes the poison). In 1814, Mathieu Joseph Bonaventure Orfila published "Traité des Poisons", proving that poisons accumulate in specific internal organs and can be chemically isolated from postmortem viscera—earning him the title Father of Modern Toxicology. Later, James Marsh (1836) developed the arsine mirror test, and Jean Servais Stas (1850) & Friedrich Otto developed alcoholic alkaloid extraction. In India, the first Chemical Examiner’s Laboratory was established in Madras (1849), evolving into today’s three-tier institutional network: Central Forensic Science Laboratories (CFSLs under DFSS — New Delhi, Kolkata, Hyderabad, Chandigarh, Pune, Bhopal, Guwahati), State Forensic Science Laboratories (SFSLs), and Regional Forensic Science Laboratories (RFSLs) operating alongside Poison Information Centres (AIIMS New Delhi, NIOH Ahmedabad, CMC Vellore).',
            keyPoints: [
              'Four Sub-Disciplines: (1) Postmortem (Medico-Legal) Toxicology — determining cause/manner of death from autopsy viscera; (2) Human Performance Toxicology — alcohol/drug impairment in driving (Sec. 185 MV Act), workplace accidents, and Drug-Facilitated Crimes (DFC); (3) Forensic Drug Testing & Doping Control — workplace, NDPS seizures, and sports anti-doping; (4) Environmental & Regulatory Toxicology — industrial effluents, adulterants, and food/water contamination.',
              'Definition of a Poison: Any substance (solid, liquid, or gas) which, when introduced into the living body or brought into contact with any part thereof, produces ill-health, disease, or death by its constitutional or local chemical/biochemical effects (excluding purely mechanical trauma, though mechanical irritants are grouped medico-legally).'
            ]
          },
          {
            subtitle: 'Classification of Poisons by Origin, Mode of Action, Chemical Nature & Medico-Legal Intent',
            body: 'A structured forensic investigation classifies xenobiotics across four complementary axes:',
            keyPoints: [
              '1. By Mode of Action (Pathophysiological): (a) Corrosives — destroy tissues on direct contact via coagulation necrosis (Strong Acids: H2SO4, HNO3, HCl, Carbolic acid, Oxalic acid) or liquefactive necrosis & fat saponification (Strong Alkalis: NaOH, KOH, Ammonia); (b) Irritants — produce severe GI inflammation, vomiting, and purging, subdivided into Inorganic Non-Metallic (Phosphorus, Halogens), Inorganic Metallic (Arsenic, Antimony, Lead, Mercury, Copper, Zinc, Thallium, Barium), Organic Plant (Abrus, Ricinus, Croton, Calotropis, Plumbago, Bhilawa), Organic Animal (Snake, Scorpion, Cantharidin), and Mechanical (Powdered glass, Diamond dust, Chopped hair); (c) Systemic / Neurotic Poisons — act selectively after bloodstream absorption on the CNS/Cerebral (Somniferous/Opioids, Inebriants/Alcohols, Barbiturates, Chloral Hydrate, Tranquilizers, Deliriants/Dhatura, Belladonna, Cannabis, Cocaine), Spinal Cord (Strychnos nux-vomica), Peripheral Nerves (Curare, Coniine), Cardiovascular (Aconite, Kaner/Oleander, Digitalis, Tobacco), and Cellular Asphyxiants (CO, Cyanide, H2S, Phosphine).',
              '2. By Origin & Chemical Nature: Plant (Alkaloids, Glycosides, Toxalbumins, Resins), Animal (Venoms, Cantharidin, Marine toxins), Mineral/Inorganic (Metals, Anions, Acids/Alkalis), and Synthetic Organic (Pesticides, Pharmaceuticals, Designer NPS).',
              '3. By Analytical / Extraction Behaviour: Volatile poisons (isolated by distillation/microdiffusion), Non-volatile organic acidic/neutral/basic/amphoteric poisons (isolated by solvent extraction), and Metallic/Inorganic poisons (isolated by dry ashing or wet acid digestion).',
              '4. By Clinical Pattern & Medico-Legal Intent: Acute, Subacute, Chronic, and Fulminant (massive collapse within minutes, e.g., Cyanide, Aluminium Phosphide) | Suicidal (Organophosphates, Aluminium Phosphide, Hanging/Poison combinations), Homicidal (Arsenic, Thallium, Aconite, Paraquat, Insulin, Cyanide), Stupefying/Facilitated Crime (Dhatura, Lorazepam, Alprazolam, Chloral Hydrate, Scopolamine), Accidental (Snakebite, CO, Pediatric kerosene/iron, Hooch methanol), and Occupational/Cattle Poisoning (Abrus "Sui", Organophosphates, Plumbism).'
            ]
          },
          {
            subtitle: 'Factors Modifying the Action and Intensity of Poisons',
            body: 'Identical doses of a poison can produce vastly different outcomes depending on substance-related and host-related factors:',
            keyPoints: [
              'Quantity (Dose) & Physical Form: Higher doses increase toxicity; gases/vapors act fastest, followed by solutions, fine powders, and coarse solids. Insoluble salts (e.g., Barium sulfate) are harmless orally, whereas soluble salts (Barium chloride/carbonate) are rapidly lethal.',
              'Route of Administration: Speed of onset follows: Inhalation / Intravenous > Intramuscular / Subcutaneous > Serous Cavity / Mucous Membrane > Oral (Ingested) > Intact Epidermal Skin.',
              'Age, Sex & Body Mass: Infants (deficient glucuronidation — e.g., Gray Baby Syndrome with chloramphenicol; immature blood-brain barrier) and elderly patients (reduced renal GFR and hepatic CYP450 clearance) show heightened susceptibility.',
              'Tolerance, Idiosyncrasy & Pharmacogenomics: Chronic opioid, alcohol, or arsenic users ("Arsenic eaters of Styria") develop marked tolerance. Genetic polymorphisms such as CYP2D6 ultrarapid metabolizers (converting codeine rapidly into lethal morphine), Pseudocholinesterase deficiency (prolonged apnea with succinylcholine), G6PD deficiency (hemolysis with oxidizing agents/naphthalene), and slow NAT2 acetylators alter toxicity dramatically.',
              'Stomach Contents, Sleep & Organ Disease: Fatty food delays gastric emptying and slows poison absorption (except lipophilic poisons like phosphorus or DDT whose absorption increases with fats). Sleep and intoxication blunt emetic reflexes and delay absorption. Pre-existing hepatic cirrhosis impairs detoxification, while renal failure prevents excretion of nephrotoxic/water-soluble toxins (mercury, lithium, digoxin).'
            ]
          }
        ]
      },
      {
        id: 'm1-s2',
        heading: '1.2 Introduction to Pharmacokinetics (ADME) & Pharmacodynamics (Receptors & Classification)',
        badge: 'Pharmacokinetics & Dynamics',
        summary: 'Quantitative ADME modeling, Henderson-Hasselbalch ionization, CYP450 Phase I/II metabolism, receptor families, and dose-response relationships.',
        contentBlocks: [
          {
            subtitle: 'Pharmacokinetics & Toxicokinetics: Absorption, Distribution, Metabolism & Elimination (ADME)',
            body: 'Pharmacokinetics (and toxicokinetics at overdose concentrations) describes what the body does to the xenobiotic across four sequential processes:',
            formula: 'Henderson-Hasselbalch: pH - pKa = log([Ionized] / [Unionized] for Weak Acids)   |   Vd = Total Body Burden / Plasma Concentration (C0)',
            keyPoints: [
              '1. Absorption & pH-Partitioning: Only unionized (non-polar, lipid-soluble) molecules cross biological lipid bilayers by passive diffusion. Weak acids (Salicylates, Barbiturates; pKa 3.0–7.5) are predominantly unionized in the acidic stomach (pH 1.5–2.0) and absorbed directly across gastric mucosa. Weak bases (Morphine, Strychnine, Cocaine, Amphetamines, Atropine; pKa 8.0–10.0) are ionized (trapped) in the stomach and absorbed primarily in the alkaline small intestine (pH 7.0–8.0).',
              '2. Distribution & Apparent Volume of Distribution (Vd): Quantifies partitioning between plasma and extravascular tissues. Drugs strongly bound to plasma albumin (Warfarin) or confined to body water (Ethanol, Vd ≈ 0.55–0.70 L/kg) have low Vd, whereas lipophilic bases sequestered in lung, liver, myocardium, and fat (Amitriptyline Vd ≈ 15 L/kg, Chloroquine Vd > 100 L/kg, Digoxin Vd ≈ 7 L/kg) have large Vd and undergo severe Postmortem Redistribution (PMR). Anatomical barriers include the Blood-Brain Barrier (tight junctions + P-glycoprotein efflux) and Placental Barrier.',
              '3. Metabolism (Biotransformation — Phase I & Phase II): Phase I reactions (oxidation, reduction, hydrolysis via hepatic Cytochrome P450 isozymes CYP3A4, CYP2D6, CYP2E1, CYP2C9, CYP1A2 and plasma esterases) introduce or unmask polar functional groups (-OH, -NH2, -COOH, -SH). While typically detoxifying, Phase I can cause "Lethal Synthesis" (Bioactivation): Parathion → Paraoxon; Methanol → Formic Acid; Ethylene Glycol → Oxalic Acid; Paracetamol → NAPQI. Phase II reactions conjugate polar groups with endogenous cofactors: Glucuronidation (UGT), Sulfation (SULT), Glutathione conjugation (GST), Acetylation (NAT), Methylation, and Glycine conjugation, yielding water-soluble metabolites.',
              '4. Elimination Kinetics: First-Order Kinetics eliminates a constant fraction/percentage of drug per unit time (rate proportional to concentration; constant half-life t1/2 = 0.693 × Vd / Clearance). Zero-Order (Michaelis-Menten Saturation) Kinetics occurs when metabolic enzymes saturate (e.g., Ethanol, Phenytoin, high-dose Salicylates), eliminating a constant mass per unit time (e.g., 15–20 mg/dL/hr for ethanol) regardless of plasma level.'
            ]
          },
          {
            subtitle: 'Pharmacodynamics: Receptors, Receptor Classification & Dose-Response Metrics',
            body: 'Pharmacodynamics describes what the drug or poison does to the body—specifically its molecular interaction with biological targets (receptors, ion channels, enzymes, and carrier proteins) and the resulting signal transduction cascade:',
            formula: 'Therapeutic Index (TI) = LD50 / ED50   |   Margin of Safety (MOS) = LD1 / ED99',
            keyPoints: [
              '1. Classification of Four Major Receptor Superfamilies: (a) Ligand-Gated Ion Channels (Ionotropic Receptors — millisecond response): Nicotinic ACh receptors (blocked by Curare/Cobra alpha-neurotoxin), GABAA Chloride channels (allosterically potentiated by Barbiturates, Benzodiazepines, Ethanol, Chloral hydrate/trichloroethanol; blocked by Picrotoxin), Glycine Chloride channels (competitively blocked by Strychnine), and NMDA Glutamate channels (blocked non-competitively by Phencyclidine/PCP and Ketamine); (b) G-Protein Coupled Receptors (GPCRs / Metabotropic 7-Transmembrane Receptors — second-messenger cAMP/IP3/DAG response in seconds): Muscarinic ACh receptors (activated by Muscarine/Pilocarpine; competitively blocked by Atropine/Scopolamine in Dhatura), Mu/Kappa/Delta Opioid receptors (Gi-coupled; activated by Morphine, Heroin, Fentanyl, Methadone, Hydromorphone; blocked by Naloxone), Adrenergic alpha/beta receptors (Cocaine/Amphetamines indirectly flood synapses with NE/DA), and Cannabinoid CB1/CB2 receptors (Δ9-THC); (c) Kinase-Linked / Enzyme-Linked Transmembrane Receptors (minute-to-hour response): Insulin receptor tyrosine kinase (activated in exogenous Insulin overdose causing lethal neuroglycopenia); (d) Intracellular / Nuclear Receptors (hour-to-day gene transcription response): Androgen/Steroid receptors (Anabolic-Androgenic Steroids in sports doping) and Aryl Hydrocarbon Receptor (AhR — Dioxins/TCDD).',
              '2. Agonists, Antagonists & Enzyme Inhibitors: Full Agonists (maximal efficacy, e.g., Methadone/Fentanyl at mu-receptors), Partial Agonists (Buprenorphine — ceiling effect), Competitive Reversible Antagonists (Atropine vs. Acetylcholine; Naloxone vs. Morphine; Flumazenil vs. Benzodiazepines — surmountable by increasing agonist), Non-Competitive / Irreversible Antagonists (aged Organophosphates covalently phosphorylating Acetylcholinesterase; Heavy metals binding -SH groups).',
              '3. Quantitative Dose-Response Metrics: ED50 (Median Effective Dose in 50% of population), LD50 (Median Lethal Dose in 50% of test population), Therapeutic Index (TI = LD50 / ED50), and Gosselin Toxicity Scale (Class 6 Super Toxic < 5 mg/kg down to Class 1 Practically Non-Toxic > 15 g/kg).'
            ]
          }
        ],
        referenceTable: {
          caption: 'Table 1.1: Pharmacodynamic Receptor Classification, Forensic Toxins & Physiological Antagonists',
          headers: ['Receptor Superfamily / Target', 'Transduction Mechanism', 'Forensic Agonist / Toxin', 'Specific Pharmacological Antagonist / Antidote'],
          rows: [
            ['Muscarinic ACh Receptor (GPCR - M1–M5)', 'Gq (IP3/DAG) & Gi (↓ cAMP)', 'Indirect: Organophosphates, Carbamates; Direct: Muscarine', 'Atropine Sulfate (Competitive antagonist); Physostigmine (for Atropine/Dhatura toxicity)'],
            ['Nicotinic ACh Receptor (Ionotropic NMJ)', 'Na+/K+ Depolarizing Cation Channel', 'Nicotine (depolarizing block); Cobra α-neurotoxin, Curare (antagonists)', 'Neostigmine + Atropine (for postsynaptic Elapid/Curare blockade)'],
            ['GABAA Receptor Complex (Ionotropic)', 'Cl- Influx → Neuronal Hyperpolarization', 'Barbiturates (↑ duration), Benzodiazepines (↑ frequency), Ethanol, Chloral hydrate', 'Flumazenil (specific for Benzodiazepine site)'],
            ['Spinal Glycine Receptor (Ionotropic)', 'Cl- Influx on Renshaw Interneurons', 'Strychnine (Strychnos nux-vomica — competitive antagonist)', 'Diazepam / Barbiturates + Neuromuscular blockade (Supportive GABA potentiation)'],
            ['Mu (μ) Opioid Receptor (GPCR - Gi)', '↓ cAMP, ↑ K+ efflux, ↓ Ca2+ influx', 'Morphine, Heroin (6-MAM), Fentanyl, Methadone, Hydromorphone', 'Naloxone HCl (Competitive μ-opioid antagonist)'],
            ['NMDA Glutamate Receptor (Ionotropic)', 'Ca2+/Na+ Cation Channel', 'Phencyclidine (PCP), Ketamine (Non-competitive channel blockers)', 'Benzodiazepines (Haloperidol/Lorazepam for dissociative agitation)'],
            ['Voltage-Gated Na+ Channel', 'Axonal & Myocardial Action Potential', 'Aconitine (opens channel), Tetrodotoxin & Saxitoxin (pore blockers), Cocaine (blocks)', 'Sodium Bicarbonate (NaHCO3 for Na+ channel blockade) / Amiodarone-Flecainide']
          ]
        }
      },
      {
        id: 'm1-s3',
        heading: '1.3 Poisoning in India: Toxidromes, Antidotes, Epidemiology, Crime Scene & Indian Poison Laws',
        badge: 'Clinical & Legal Forensics',
        summary: 'Five classical toxidromes, physiological/chemical/pharmacological antidotes, NCRB poisoning statistics, crime scene investigation, and Indian statutory acts.',
        contentBlocks: [
          {
            subtitle: 'Signs, Symptoms (Classical Toxidromes) & Antidote Mechanisms',
            body: 'Rapid clinical and postmortem recognition relies on grouping autonomic and neurological signs into five classical toxidromes and applying targeted antidotes:',
            keyPoints: [
              '1. Cholinergic Toxidrome (Organophosphates, Carbamates, Nerve Agents, Inocybe/Clitocybe Mushrooms): DUMBBELS / SLUDGE — Diarrhea/Defecation, Urination, Miosis (pinpoint pupils), Bronchorrhea/Bronchospasm, Bradycardia, Emesis, Lacrimation, Salivation, plus nicotinic muscle fasciculations and respiratory paralysis. Antidote: Atropine + Pralidoxime (2-PAM).',
              '2. Anticholinergic Toxidrome (Dhatura, Atropa belladonna, Tricyclic Antidepressants, Antihistamines): "Blind as a bat (mydriasis), mad as a hatter (delirium/carphologia), red as a beet (flushing), hot as a hare (hyperthermia), dry as a bone (anhidrosis/dry mucosa), full as a flask (urinary retention), tachycardia." Antidote: Physostigmine salicylate.',
              '3. Opioid Toxidrome (Morphine, Heroin, Fentanyl, Methadone, Hydromorphone, Opium): Classic Triad — Pinpoint pupils (Miosis), Central Respiratory Depression (bradypnea/apnea), and Coma. Antidote: Naloxone.',
              '4. Sympathomimetic Toxidrome (Cocaine, Amphetamine, Methamphetamine, MDMA, Ephedrine, Cathinones): Mydriasis, severe tachycardia, hypertension, hyperthermia, diaphoresis (sweating — distinguishes it from dry anticholinergic skin!), agitation, seizures, and coronary vasospasm. Management: Benzodiazepines + phentolamine/nitrates (avoid unopposed beta-blockers in cocaine toxicity).',
              '5. Sedative-Hypnotic Toxidrome (Barbiturates, Benzodiazepines, Chloral Hydrate, Ethanol, Z-drugs): Slurred speech, ataxia, nystagmus, stupor, coma, hypothermia, respiratory depression, and bullous skin lesions ("barbiturate blisters").',
              'Classification of Antidotes: (a) Physical/Mechanical (Activated Charcoal — adsorbs drugs with large surface area ~1000 m²/g; contraindicated in corrosives, hydrocarbons, heavy metals, alcohols, cyanide); (b) Chemical (neutralizes by chemical reaction: KMnO4 1:10,000 oxidizes alkaloids/phosphine; Sodium thiosulfate converts CN- to SCN-; Calcium gluconate/chloride precipitates oxalic acid & fluorides); (c) Physiological/Pharmacological (acts at receptors/enzymes: Naloxone, Atropine, Pralidoxime, Flumazenil, Fomepizole, Physostigmine); (d) Chelating Agents for Heavy Metals (BAL/Dimercaprol, Succimer/DMSA, DMPS, Calcium Disodium EDTA, D-Penicillamine, Desferrioxamine for Iron, Prussian Blue for Thallium); (e) Immunological (Polyvalent Anti-Snake Venom ASV, Digoxin-specific Fab fragments).'
            ]
          },
          {
            subtitle: 'Poisoning Trends in India (NCRB Data), Crime Scene Walkthrough & Indian Poison Laws',
            body: 'According to National Crime Records Bureau (NCRB "Accidental Deaths & Suicides in India" — ADSI) and ICMR toxicology surveillance, poisoning is the second most common mode of suicide in India after hanging (accounting for ~25–28% of suicidal deaths). Regional patterns show Aluminium Phosphide (Celphos) dominating Northern wheat-belt states (Punjab, Haryana, UP, Rajasthan, MP), Organophosphates/Carbamates/Pyrethroids and Yellow Oleander/Oduvanthalai (Cleistanthus collinus) in Southern & Western agricultural belts, and Pharmaceutical overdoses, household corrosives (toilet cleaners), and NDPS substances rising in metropolitan centers. At a poisoning crime scene, the Investigating Officer and Forensic Scene Officer execute a structured walkthrough:',
            keyPoints: [
              'Crime Scene Investigation Protocol: (1) Prioritize life-saving medical referral while preserving the primary scene (kitchen, bedroom, dining utensils, dustbins, medicine cabinets, farm sheds); (2) Collect Non-Biological Exhibits — half-empty pesticide tins/sachets, cups/glasses with drying residue, cooked food, cooking oil (for Argemone adulteration), syringes/needles, suicide notes, and blistering Foil strips; (3) Collect Biological Scene Exhibits — vomitus, purged fecal matter, urine stains, and gastric lavage washings (first washing is most valuable!) in clean wide-mouth glass jars without chemical preservative if sent immediately or with appropriate preservative + Control Blank; (4) Maintain unbroken Chain of Custody, sample seal impressions, FSL Forwarding Note, and Hash Value certification under Section 63 of the Bharatiya Sakshya Adhiniyam (BSA) 2023 for digital photography/videography.',
              'Statutory Framework of Indian Poison & Drug Laws: (1) The Poisons Act, 1919 — regulates importation, possession, and sale of specified poisons (white arsenic, cyanide, aconite, strychnine, mercuric chloride) requiring licensed vendors to maintain a Poison Register (buyer signature, quantity, stated purpose); (2) The Drugs and Cosmetics Act, 1940 & Rules, 1945 — classifies drugs into Schedules: Schedule H & H1 (prescription-only drugs including antibiotics, sedatives, habit-forming drugs requiring 3-year register retention), Schedule X (psychotropic/narcotic medications like secobarbital, amobarbital, amphetamines, ketamine requiring special license and duplicate prescription kept for 2 years), Schedule G (caution label drugs), and defines spurious/adulterated/misbranded drugs; (3) The Insecticides Act, 1968 — regulates manufacture, registration, color-coded toxicity triangle labels (Red = Extremely Toxic, Yellow = Highly Toxic, Blue = Moderately Toxic, Green = Slightly Toxic), and bans hazardous agrochemicals (e.g., Endosulfan, Monocrotophos restrictions); (4) The Narcotic Drugs and Psychotropic Substances (NDPS) Act, 1985 — controls narcotic plants/drugs and psychotropics with graded punishment for Small, Intermediate, and Commercial quantities; (5) Bharatiya Nyaya Sanhita (BNS) 2023: Sec. 101/103 (Culpable Homicide/Murder), Sec. 123 (328 IPC — Administering poison/stupefying drug with intent to cause hurt/commit crime), Sec. 274/275 (Adulteration of food/drugs), Sec. 286 (284 IPC — Negligent conduct with poisonous substance); (6) Bharatiya Nagarik Suraksha Sanhita (BNSS) 2023: Sec. 194 (174 CrPC — Police inquest), Sec. 196 (Magistrate inquest), Sec. 329 (293 CrPC — Admissibility of Government Scientific Expert / FSL reports).'
            ]
          }
        ],
        referenceTable: {
          caption: 'Table 1.2: Specific Antidotes, Mechanisms & Statutory Indian Poison Laws Reference',
          headers: ['Poison / Toxidrome', 'First-Line Specific Antidote', 'Mechanism of Antidotal Action', 'Applicable Indian Statutory Provision'],
          rows: [
            ['Organophosphates (Parathion, Chlorpyrifos)', 'Atropine Sulfate + Pralidoxime (2-PAM)', 'Competitive muscarinic block + Nucleophilic reactivation of non-aged AChE', 'Insecticides Act 1968 (Red/Yellow Label) & Sec. 103/123 BNS'],
            ['Opioids (Heroin, Morphine, Fentanyl)', 'Naloxone Hydrochloride (IV/IM/IN)', 'Competitive antagonist at CNS μ-opioid receptors reversing apnea', 'NDPS Act 1985 & Drugs and Cosmetics Act 1940'],
            ['Cyanide (HCN, KCN, NaCN)', 'Hydroxocobalamin OR Sodium Nitrite + Sodium Thiosulfate', 'Forms cyanocobalamin OR induces MetHb (Fe3+) + Rhodanese conversion to SCN-', 'Poisons Act 1919 & Sec. 286/103 BNS'],
            ['Methanol / Ethylene Glycol', 'Fomepizole (4-Methylpyrazole) or Ethanol + Folate/Pyridoxine', 'Competitive inhibition of Alcohol Dehydrogenase (ADH) blocking formate/oxalate formation', 'Excise Acts & Sec. 103/123 BNS (Hooch tragedies)'],
            ['Arsenic / Mercury / Lead', 'BAL (Dimercaprol), Succimer (DMSA), CaNa2-EDTA (for Pb)', 'Vicinal dithiol (-SH) or polyaminocarboxylic chelation into water-soluble urinary complexes', 'Poisons Act 1919 & Water/Environment Protection Acts'],
            ['Thallium Sulfate', 'Prussian Blue (Potassium ferric hexacyanoferrate)', 'Crystal lattice ion-exchange substitutes K+ for Tl+ in gut lumen blocking enterohepatic cycling', 'Poisons Act 1919 & Sec. 103 BNS'],
            ['Dhatura / Atropa Belladonna', 'Physostigmine Salicylate', 'Tertiary amine reversible AChE inhibitor crossing BBB to reverse central anticholinergic delirium', 'Sec. 123 BNS (formerly Sec. 328 IPC — Stupefaction)']
          ]
        }
      }
    ],
    quiz: [
      {
        id: 'm1-q1',
        question: 'Who is recognized as the "Father of Modern Toxicology" for publishing "Traité des Poisons" (1814) and proving that poisons accumulate in specific internal organs and can be chemically extracted from postmortem viscera (alongside ancient Indian treatises Kautilya’s Arthashastra and Sushruta Samhita Kalpasthana)?',
        options: ['Paracelsus', 'Mathieu Joseph Bonaventure Orfila', 'James Marsh', 'Jean Servais Stas'],
        correctAnswer: 1,
        explanation: 'Mathieu Orfila (1787–1853) established systematic chemical extraction of poisons from autopsy organs and correlated analytical chemistry with pathology.',
        referenceTopic: '1.1 Scope & History of Forensic Toxicology'
      },
      {
        id: 'm1-q2',
        question: 'In Unit II Classification of Poisons and Factors Modifying Poison Action, why is oral Barium Sulfate (BaSO4) safe as a radiopaque X-ray contrast medium whereas oral Barium Chloride (BaCl2) or Barium Carbonate (BaCO3) is rapidly lethal?',
        options: [
          'Barium sulfate is a gas that is exhaled immediately',
          'Physical state & solubility modify poison action: Barium sulfate is practically insoluble in water and gastrointestinal fluids (preventing systemic Ba2+ absorption), whereas Barium chloride and carbonate dissolve in gastric acid to release free Ba2+ ions',
          'Barium sulfate is destroyed by salivary amylase',
          'Barium chloride only acts on the skin'
        ],
        correctAnswer: 1,
        explanation: 'Physical form and water/acid solubility are critical modifying factors: insoluble BaSO4 passes unabsorbed through the gut, while soluble barium salts release toxic Ba2+ ions.',
        referenceTopic: '1.1 Classification & Factors Modifying Poison Action'
      },
      {
        id: 'm1-q3',
        question: 'Based on the Henderson-Hasselbalch pH-partition hypothesis in Pharmacokinetics (Unit II), why are weakly acidic poisons (such as Barbiturates and Salicylates, pKa 3.0–7.5) absorbed rapidly across the stomach mucosa (pH 1.5–2.0), whereas weakly basic alkaloids (Morphine, Strychnine, Atropine, pKa 8.0–10.0) are absorbed primarily in the small intestine?',
        options: [
          'Weak acids are completely ionized in gastric acid and actively pumped by H+/K+-ATPase',
          'At gastric pH (1.5–2.0) below their pKa, weak acids exist predominantly in the unionized, lipid-soluble form that diffuses across gastric mucosa, whereas weak bases are protonated (ionized/trapped) in the stomach and become unionized only in the alkaline intestine',
          'Gastric pepsin hydrolyzes weak acids into monosaccharides',
          'Weak acids only absorb in the colon'
        ],
        correctAnswer: 1,
        explanation: 'Only unionized (non-polar) species cross lipid bilayers rapidly; weak acids are unionized in acidic stomach contents, while weak bases are unionized in the alkaline small intestine.',
        referenceTopic: '1.2 Pharmacokinetics (ADME - Absorption)'
      },
      {
        id: 'm1-q4',
        question: 'In Pharmacokinetics (Unit II), how does Zero-Order (Michaelis-Menten saturation) elimination kinetics (seen with Ethanol, Phenytoin, and high-dose Salicylates) differ from First-Order elimination kinetics?',
        options: [
          'In Zero-Order kinetics, metabolic enzymes are saturated so a constant MASS/AMOUNT of drug (e.g., 15–20 mg/dL/hr of ethanol) is eliminated per unit time regardless of plasma concentration; in First-Order kinetics, a constant FRACTION/PERCENTAGE is eliminated per unit time with a constant half-life (t1/2)',
          'Zero-order kinetics means zero drug is ever eliminated from the body',
          'First-order kinetics only occurs after death',
          'Zero-order kinetics has a constant half-life independent of dose'
        ],
        correctAnswer: 0,
        explanation: 'When hepatic metabolizing enzymes (such as ADH for ethanol) reach saturation, elimination proceeds at a constant mass rate per hour (zero-order) rather than a constant percentage per hour (first-order).',
        referenceTopic: '1.2 Pharmacokinetics (ADME - Elimination)'
      },
      {
        id: 'm1-q5',
        question: 'Which of the following Phase I Cytochrome P450 biotransformations is a classic example of "Lethal Synthesis" (bioactivation of a parent compound into a much more toxic metabolite)?',
        options: [
          'Conversion of Parathion (P=S) into Paraoxon (P=O), Methanol into Formic Acid, Ethylene Glycol into Oxalic Acid, or Paracetamol into NAPQI',
          'Phase II Glucuronidation of Morphine to Morphine-3-glucuronide',
          'Conversion of Cyanide into Thiocyanate via hepatic Rhodanese',
          'Glutathione detoxification of electrophiles'
        ],
        correctAnswer: 0,
        explanation: 'Phase I oxidative bioactivation ("Lethal Synthesis") converts Parathion to Paraoxon, Methanol to Formic acid, Ethylene glycol to Oxalic acid, and Paracetamol to hepatotoxic NAPQI.',
        referenceTopic: '1.2 Pharmacokinetics (ADME - Metabolism)'
      },
      {
        id: 'm1-q6',
        question: 'In Pharmacodynamics (Unit II: Receptors and Their Classification), which of the following correctly pairs the four major receptor superfamilies with their forensic toxin/drug targets?',
        options: [
          '1. Ligand-Gated Ion Channels (Ionotropic: GABAA, Glycine [Strychnine], Nicotinic, NMDA [PCP]); 2. G-Protein Coupled Receptors (GPCRs: Muscarinic [Atropine], μ-Opioid [Morphine], CB1 [THC]); 3. Kinase-Linked Receptors (Insulin Tyrosine Kinase); 4. Intracellular/Nuclear Receptors (Anabolic Steroids, AhR)',
          'All receptors in the human body are nuclear DNA enzymes',
          'Muscarinic and Opioid receptors are voltage-gated sodium channels',
          'Strychnine binds exclusively to intracellular androgen receptors'
        ],
        correctAnswer: 0,
        explanation: 'Receptors are classified into four superfamilies: Ionotropic ligand-gated channels (millisecond response), 7-TM GPCRs (second-messenger response), Kinase-linked receptors (insulin/cytokines), and Nuclear receptors (gene transcription).',
        referenceTopic: '1.2 Pharmacodynamics (Receptors & Classification)'
      },
      {
        id: 'm1-q7',
        question: 'A patient presents with extreme agitation, dilated pupils (mydriasis), tachycardia, hypertension, hyperthermia, and profuse sweating (diaphoresis). Which toxidrome does this represent, and what physical sign differentiates it from an Anticholinergic (Dhatura/Atropa) toxidrome?',
        options: [
          'Cholinergic toxidrome; differentiated by pinpoint pupils',
          'Sympathomimetic toxidrome (Cocaine/Amphetamines/MDMA); differentiated by profuse diaphoresis (sweating) and active bowel sounds rather than the bone-dry skin ("dry as a bone") and urinary retention of anticholinergic poisoning',
          'Opioid toxidrome; differentiated by bradypnea',
          'Sedative-hypnotic toxidrome; differentiated by hypothermia'
        ],
        correctAnswer: 1,
        explanation: 'Both sympathomimetic and anticholinergic toxidromes produce mydriasis, tachycardia, agitation, and hyperthermia, but sympathomimetics cause heavy sweating (diaphoresis) whereas anticholinergics block muscarinic sweat glands.',
        referenceTopic: '1.3 Signs, Symptoms (Toxidromes) & Antidotes'
      },
      {
        id: 'm1-q8',
        question: 'According to NCRB ("Accidental Deaths & Suicides in India") epidemiological data and hospital crime scene protocols, which poison class dominates rural Northern Indian agricultural suicides, and which hospital gastric lavage sample is most valuable for FSL analysis?',
        options: [
          'Aluminium Phosphide (Celphos) and Organophosphates dominate agricultural suicides; the very FIRST gastric lavage aspirate/washing collected prior to instilling antidotes or charcoal is the most valuable hospital sample',
          'LSD blotters dominate rural suicides; the fifth saline washing is most valuable',
          'Marine tetrodotoxin dominates Northern India; intravenous saline bag is most valuable',
          'Carbon monoxide dominates rural India; dialysate after 48 hours is most valuable'
        ],
        correctAnswer: 0,
        explanation: 'Aluminium Phosphide (in Northern wheat-belt states) and Organophosphates account for the majority of agricultural suicidal poisonings in India, and the first gastric washing contains the highest undiluted concentration of unabsorbed poison.',
        referenceTopic: '1.3 Poisoning in India & Crime Scene Investigation'
      },
      {
        id: 'm1-q9',
        question: 'Under the Drugs and Cosmetics Act, 1940 & Rules, 1945, and the Insecticides Act, 1968 (India), what do "Schedule X" and a "Bright Red Triangle Label" signify?',
        options: [
          'Schedule X regulates psychotropic/narcotic medicinal drugs (requiring special license and 2-year duplicate prescription retention); a Bright Red lower triangle on an insecticide container designates an "Extremely Toxic" (Class I, oral LD50 ≤ 50 mg/kg) formulation',
          'Schedule X covers over-the-counter vitamins; Bright Red designates organic fertilizer',
          'Schedule X covers surgical dressings; Bright Red designates slightly toxic herbal sprays',
          'Schedule X covers veterinary vaccines; Bright Red designates non-toxic water'
        ],
        correctAnswer: 0,
        explanation: 'Schedule X strictly controls habit-forming psychotropic medications, while under the Insecticides Act 1968 toxicity triangle system: Red = Extremely Toxic, Yellow = Highly Toxic, Blue = Moderately Toxic, Green = Slightly Toxic.',
        referenceTopic: '1.3 Indian Laws Related to Poisons'
      },
      {
        id: 'm1-q10',
        question: 'Which section of the Bharatiya Nyaya Sanhita (BNS), 2023 [replacing Section 328 of the Indian Penal Code] criminalizes administering any poison or stupefying, intoxicating, or unwholesome drug (such as Dhatura or Lorazepam in "roadside/railway poisoning") with intent to cause hurt or facilitate a crime?',
        options: ['Section 103 BNS', 'Section 123 BNS (formerly Section 328 IPC)', 'Section 194 BNSS', 'Section 286 BNS'],
        correctAnswer: 1,
        explanation: 'Section 123 of the Bharatiya Nyaya Sanhita (BNS), 2023 corresponds to Section 328 IPC and punishes causing hurt by means of poison or stupefying drug with intent to commit an offense.',
        referenceTopic: '1.3 Indian Laws Related to Poisons'
      }
    ],
    assignment: {
      id: 'm1-assign',
      title: 'Case Assignment 1: Pharmacokinetics (Vd & ADME), Pharmacodynamics (TI & Receptors) & Indian Poison Laws',
      caseScenario: 'A 38-year-old passenger (body weight = 70 kg) is found unconscious on a train platform after accepting laced tea (suspected Dhatura / Lorazepam stupefaction under Section 123 BNS). Lab investigation of the recovered compound reveals an ED50 of 40 mg/kg, an LD50 of 220 mg/kg, and a 350 mg dose distributed with an initial plasma concentration (C0) of 0.5 mg/L.',
      instructions: [
        'Calculate the Therapeutic Index (TI = LD50 / ED50) of the recovered compound (220 / 40).',
        'Calculate the Apparent Volume of Distribution (Vd in L/kg) for the 70 kg victim given Dose = 350 mg (5 mg/kg) and C0 = 0.5 mg/L [Vd = (350 / 70) / 0.5].',
        'Identify the BNS 2023 Section for administering a poison/stupefying drug (formerly Sec. 328 IPC).',
        'Select the specific pharmacological antidote that crosses the blood-brain barrier to reverse central anticholinergic Dhatura delirium.'
      ],
      structuredFields: [
        {
          id: 'ti_value',
          label: 'Calculated Therapeutic Index (TI = LD50 [220] / ED50 [40])',
          type: 'number',
          placeholder: 'e.g., 5.5',
          expectedValue: 5.5,
          tolerance: 0.05,
          criterionLabel: 'Accurate calculation of Therapeutic Index (220 / 40 = 5.5)',
          hint: 'Divide LD50 (220 mg/kg) by ED50 (40 mg/kg).'
        },
        {
          id: 'vd_value',
          label: 'Calculated Apparent Volume of Distribution Vd = (Dose/Weight) / C0 = (350/70) / 0.5 [in L/kg]',
          type: 'number',
          unit: 'L/kg',
          placeholder: 'e.g., 10',
          expectedValue: 10,
          tolerance: 0.1,
          criterionLabel: 'Accurate calculation of Apparent Volume of Distribution Vd (5 / 0.5 = 10 L/kg)',
          hint: 'Dose per kg = 350 mg / 70 kg = 5 mg/kg; divide by C0 (0.5 mg/L) = 10 L/kg.'
        },
        {
          id: 'bns_section',
          label: 'BNS 2023 Section for Administering Poison / Stupefying Drug (formerly 328 IPC)',
          type: 'number',
          placeholder: 'e.g., 123',
          expectedValue: 123,
          tolerance: 0,
          criterionLabel: 'Correct citation of Section 123 BNS',
          hint: 'Section 123 BNS replaces Section 328 IPC.'
        },
        {
          id: 'dhatura_antidote',
          label: 'Specific Pharmacological Antidote for Dhatura (Central Muscarinic Blockade) Poisoning',
          type: 'select',
          options: [
            'Physostigmine Salicylate',
            'Pralidoxime (2-PAM)',
            'Naloxone Hydrochloride',
            'Fomepizole'
          ],
          expectedValue: 'Physostigmine Salicylate',
          criterionLabel: 'Correct selection of Physostigmine Salicylate',
          hint: 'Physostigmine is a tertiary amine reversible AChE inhibitor that crosses the BBB.'
        }
      ],
      writtenPrompt: 'Draft a concise forensic note covering: (1) ADME pH-partitioning & Vd (10 L/kg), (2) Receptor classification (Ionotropic vs. GPCR muscarinic/GABAA) and TI = 5.5, and (3) Crime scene collection (first gastric lavage washing) and Indian Poison Laws (Sec. 123 BNS, Poisons Act 1919, Drugs & Cosmetics Act 1940):',
      minWordCount: 30,
      requiredKeywords: [
        { groupLabel: 'ADME Pharmacokinetics & Vd', terms: ['adme', 'absorption', 'vd', 'pka', 'metabolism', 'cyp450'] },
        { groupLabel: 'Pharmacodynamics & Receptors', terms: ['receptor', 'muscarinic', 'gaba', 'ti', 'therapeutic index'] },
        { groupLabel: 'Statutory Law & Crime Scene', terms: ['123', 'bns', 'poisons act', 'gastric', 'lavage'] }
      ],
      sampleFrameworkHint: 'Include Vd = 10 L/kg, TI = 5.5, GPCR muscarinic vs ionotropic GABAA receptors, Section 123 BNS, and collection of the first gastric lavage washing.'
    }
  },
  {
    id: 'tox-mod-2',
    moduleNumber: 2,
    code: 'FT2601-M2',
    title: 'Module 2: Isolation & Clean-Up Procedures of Poisons from Viscera, Sample Matrices & Classical Extraction',
    subtitle: 'Post-mortem viscera collection (Bottles I–IV), preservatives, biological & non-biological matrices, Postmortem Redistribution (PMR), Stas-Otto & Ammonium Sulphate extraction, Steam Distillation, Conway Microdiffusion, and Dialysis.',
    level: 'Foundation',
    estimatedHours: '8 Hours',
    learningObjectives: [
      'Execute post-mortem examination and standard 4-Bottle viscera collection with appropriate chemical preservatives and statutory exceptions.',
      'Select optimal biological (femoral blood, vitreous humor, bile, urine, hair, nails, bone, lung, brain) and non-biological matrices while correcting for Postmortem Redistribution (PMR).',
      'Perform Classical Extraction of non-volatile organic poisons from viscera using the Stas-Otto Method and Ammonium Sulphate protein-precipitation method.',
      'Isolate volatile poisons and inorganic ions from complex viscera using Simple/Steam Distillation, the Conway Microdiffusion Cell, and Dialysis / Electrodialysis.'
    ],
    interactiveToolType: 'pmr_calculator',
    sections: [
      {
        id: 'm2-s1',
        heading: '2.1 Post-Mortem Examination, Viscera Collection (Bottles I–IV), Preservatives & Matrices',
        badge: 'Autopsy & Matrices',
        summary: 'External and internal post-mortem signs of poisoning, the 4-Bottle viscera protocol, preservative contraindications, and Postmortem Redistribution (PMR).',
        contentBlocks: [
          {
            subtitle: 'Post-Mortem Examination Signs & Standard 4-Bottle Viscera Protocol',
            body: 'A meticulous medico-legal autopsy in suspected poisoning integrates external examination (post-mortem lividity colour: cherry-red in CO, bright pink/brick-red in Cyanide, chocolate-brown in Nitrites/Aniline/Chlorates, dark congested in Opioids/Asphyxiants; characteristic odours around mouth/nostrils: garlic in Phosphorus/Arsenic/Aluminium Phosphide/OPs, bitter almonds in Cyanide, kerosene-like in OPs, sweetish fruity/pear-like in Chloral hydrate/Chloroform/Ethanol; perioral corrosion marks and injection track marks) with internal dissection. Double ligatures are tied at the cardiac and pyloric ends of the stomach before removal, and unabsorbed alimentary contents are strictly segregated from parenchymatous organs to prove antemortem systemic absorption versus post-mortem introduction:',
            keyPoints: [
              'Bottle I (Alimentary Tract — Unabsorbed Poison): Whole Stomach and its entire contents + proximal 30 cm of small intestine (duodenum/jejunum) with contents.',
              'Bottle II (Parenchymatous Organs — Absorbed & Metabolized Poison): At least 500 g of Liver (including intact gall bladder and bile, as many glucuronides, opioids, and heavy metals concentrate in bile), one-half of each Kidney (divided longitudinally), and one-half of Spleen (highest tissue reservoir for Cyanide and carboxyhemoglobin).',
              'Bottle III (Peripheral Venous Blood): 10–20 mL of Peripheral Blood aspirated from a clamped/ligated Femoral or Iliac vein, preserved with 1% w/v Sodium Fluoride (10 mg/mL) + Potassium Oxalate (3 mg/mL). NaF inhibits glycolytic enolase (preventing microbial neo-formation of ethanol by Candida albicans) and inhibits plasma esterases (preventing hydrolysis of Cocaine, 6-MAM, and Organophosphates).',
              'Bottle IV (Urine & Mandatory Preservative Control Blank): All available Urine (preserved with NaF or thymol) PLUS a separate sealed bottle containing 100 mL of the exact batch of preservative used (Control Sample) to negate defense arguments of pre-existing arsenic/lead contamination in commercial salt.',
              'Preservative Rules & Contraindications: Saturated Solution of Common Salt (NaCl) is the routine viscera preservative in India, EXCEPT in poisoning by Corrosive Mineral Acids (HCl, H2SO4, HNO3), Corrosive Alkalis, Mercuric Chloride (HgCl2), Silver Nitrate (AgNO3 — forms insoluble white AgCl precipitate with NaCl!), and Aconite (alkaline impurities hydrolyze aconitine). Rectified Spirit (90% Ethanol) is used for those exceptions, but is STRICTLY CONTRAINDICATED in Ethanol, Methanol, Chloral Hydrate, Chloroform, Ether, Formaldehyde, Cyanide, Phosphorus, and Carbolic Acid (Phenol). Formalin (10% formaldehyde) must NEVER be used for toxicological viscera because it cross-links tissue proteins and chemically destroys alkaloids and cyanide.'
            ]
          },
          {
            subtitle: 'Biological / Non-Biological Matrices & Postmortem Redistribution (PMR)',
            body: 'Beyond standard viscera, targeted toxicological matrices solve specialized forensic questions. Following somatic death, cellular ATP failure and intracellular acidosis (pH 5.5–6.0) cause basic lipophilic drugs with a large Apparent Volume of Distribution (Vd > 3.0 L/kg — e.g., Tricyclic antidepressants like Amitriptyline, Digoxin, Methadone, Fentanyl, Chloroquine) to diffuse passively out of solid organ reservoirs (lungs, myocardium, left lobe of liver, and stomach) into central cardiac chambers—a phenomenon termed Postmortem Redistribution (PMR):',
            formula: 'PMR Index = Central (Heart) Blood Concentration [C] / Peripheral (Femoral) Blood Concentration [P]',
            keyPoints: [
              'Vitreous Humor (4–5 mL aspirated from lateral canthus): Anatomically isolated inside the bony orbit, acellular, low in esterases, and resistant to putrefaction. Preserves 6-Monoacetylmorphine (6-MAM) in heroin deaths, confirms antemortem ethanol ingestion (equilibrium Vitreous : Blood ratio ≈ 1.15 : 1 due to 99% water content), and diagnoses Diabetic Ketoacidosis and dehydration.',
              'Specialised Biological Matrices: Brain (100–300 g — superior for lipophilic anesthetics, chloroform, ether, cyanide, and barbiturates; protected from gastric diffusion), Lungs (tied at bronchus in nylon bag for volatile inhalants, solvent abuse, chloroform, ether), Bone (Femur/Tibia shaft — 100 g for chronic Arsenic, Lead, Radium, Antimony in skeletonized/exhumed remains), Plucked Scalp Hair & Nails (keratin sulfhydryl groups bind chronic Arsenic, Thallium, Mercury, and basic drugs), Subcutaneous Fat (organochlorine pesticides like DDT/Lindane), Skin & Subcutaneous Tissue around Bite/Injection Site (with a remote control skin piece — for Snake Venom ELISA, Insulin, Potassium chloride, or Succinylcholine), and Entomotoxicology (blowfly maggots/puparial cases feeding on skeletonized tissue when soft viscera have liquified).',
              'Non-Biological Matrices: Suspected tablets/powders, beverages, cooked meals, vomitus/soil scrapings (plus uncontaminated control soil 5 meters away in exhumations), syringes, and containers.'
            ]
          }
        ],
        referenceTable: {
          caption: 'Table 2.1: Forensic Matrix Selection, Preservatives & Postmortem Redistribution (PMR) Reference',
          headers: ['Target Poison / Scenario', 'Optimal Matrix & Quantity', 'Preservative Protocol', 'Key Forensic / PMR Precaution'],
          rows: [
            ['Routine Systemic Poisons / Pesticides', 'Bottle I (Stomach), Bottle II (500g Liver, 1/2 Kidneys, 1/2 Spleen)', 'Saturated Solution of NaCl + Control Blank', 'Never mix Bottle I and Bottle II; never use Formalin'],
            ['Corrosive Acids (HCl, H2SO4) or AgNO3', 'Stomach, Esophagus, Liver, Kidney', 'Rectified Spirit (or Deep Freeze -20°C)', 'Saturated NaCl is contraindicated (precipitates AgCl / alters Cl- assay)'],
            ['Volatile Solvents (Chloroform, Ether, Alcohols)', 'Femoral Blood, Brain (100g), Lung (in nylon bag), Vitreous', '1% NaF for blood; Saturated NaCl for viscera (chilled airtight)', 'Rectified Spirit is strictly contraindicated; minimize headspace'],
            ['Carbon Monoxide / Cyanide', 'Femoral/Heart Blood, Spleen (highest CN-), Brain', '1% NaF + 1 cm layer of Liquid Paraffin over blood', 'Paraffin barrier prevents escape of volatile HCN and CO gases'],
            ['High-Vd Lipophilic Drugs (TCAs, Digoxin, Fentanyl)', 'Clamped Femoral Venous Blood + Vitreous Humor', '1% Sodium Fluoride + Potassium Oxalate', 'Cardiac blood is inflated 2–10× by PMR (C/P ratio > 2.0)'],
            ['Chronic Heavy Metals / Exhumation', 'Plucked Hair (with roots), Nails, Femur Bone (100g), Soil + Control Soil', 'Dry sealed paper envelopes (Hair/Nails/Bone)', 'Always collect control soil above, below, and 5m away from coffin']
          ]
        }
      },
      {
        id: 'm2-s2',
        heading: '2.2 Classical Extraction of Non-Volatile Organic Poisons: Stas-Otto & Ammonium Sulphate Methods',
        badge: 'Isolation & Clean-Up',
        summary: 'Maceration, protein precipitation, Stas-Otto vs. Ammonium Sulphate deproteinization, and pH-partitioned Acid-Ether / Alkaline-Chloroform fractionation.',
        contentBlocks: [
          {
            subtitle: 'Principle of Viscera Clean-Up & Protein Precipitation',
            body: 'Biological viscera (liver, stomach, kidney) contain ~75% water, 15–20% proteins, and 5–10% lipids, phospholipids, and pigments. Attempting to extract minced viscera directly with immiscible organic solvents produces intractable, gelatinous emulsions and co-extracts lipoproteins that foul chromatographic columns and quench colour tests. Therefore, classical isolation of Non-Volatile Organic Poisons (alkaloids, glycosides, barbiturates, tranquilizers, synthetic drugs, and pesticides) requires a two-stage workflow: (1) Complete deproteinization / protein precipitation to liberate protein-bound xenobiotics into a clear aqueous filtrate, followed by (2) Systematic pH-controlled Liquid-Liquid Extraction (LLE) into organic solvents.',
            keyPoints: [
              '1. The Stas-Otto Method (Acidified Alcohol Extraction — Jean Servais Stas, 1850 & Friedrich Julius Otto, 1856): Finely minced viscera (100–200 g) are rendered distinctly acidic with Tartaric Acid (or oxalic/acetic acid, never mineral H2SO4 which chars tissues) and digested with 2–3 volumes of 90–95% Ethanol at 60°C on a water bath with frequent shaking. Ethanol coagulates and precipitates tissue proteins while dissolving the water/alcohol-soluble tartrate salts of basic alkaloids alongside acidic/neutral drugs. After filtration, the alcoholic filtrate is evaporated under vacuum to a syrupy aqueous residue, treated with absolute alcohol to precipitate residual albumins, evaporated again, dissolved in warm acidulated water, and filtered to yield a clear, protein-free aqueous solution ready for solvent partitioning.',
              '2. The Ammonium Sulphate Method (Nickolls / Daubney Modification): Because the Stas-Otto method is time-consuming (24–48 hours), consumes large volumes of ethanol, and can lose heat-labile glycosides or ester alkaloids, the Ammonium Sulphate method is widely preferred in Indian FSLs. Minced viscera are acidified with dilute acetic or hydrochloric acid, mixed with a saturated aqueous solution (or solid crystals to saturation) of Ammonium Sulphate [(NH4)2SO4], and heated at 65–70°C for 30–60 minutes. At high ionic strength and mild heat, Ammonium Sulphate "salts out" and coagulates proteins and fats completely. Filtration through a Buchner funnel yields a crystal-clear, colourless aqueous filtrate with high recovery (75–90%) in under 2 hours, ready for direct organic solvent extraction.',
              'Alternative Deproteinization Reagents: Tungstic Acid (Folin-Wu: Sodium tungstate + H2SO4 — excellent for barbiturates and acidic drugs in blood/small tissue samples, though it can co-precipitate certain bulky alkaloids), Trichloroacetic Acid (TCA), and Acetonitrile Crash (modern bioanalytical protein precipitation).'
            ]
          },
          {
            subtitle: 'Systematic pH-Partitioned Fractionation (Acid-Ether, Alkaline, and Isoelectric Fractions)',
            body: 'Once the clear aqueous deproteinized filtrate is obtained from the Stas-Otto or Ammonium Sulphate procedure, drugs are separated into distinct chemical classes by exploiting the Henderson-Hasselbalch principle (unionized species extract into organic solvent; ionized species remain in water):',
            keyPoints: [
              'Fraction A — Strong & Weak Acids + Neutral Poisons (Acid-Ether / Acid-Chloroform Fraction at pH 2.0–3.0): Extracting the acidic aqueous filtrate (pH 2) with Diethyl Ether or Chloroform isolates unionized Acidic Drugs (Salicylates, Barbiturates, Phenytoin, NSAIDs, Valproic acid, Warfarin) and Neutral Compounds (Meprobamate, Carisoprodol, Chloralose, Non-ionic Glycosides like Digitalis/Oleander, and Organochlorine/OP pesticides).',
              'Sub-Fractionation of Fraction A (Sodium Bicarbonate NaHCO3 pH 8.0 vs. NaOH pH 12 Wash): Shaking the Acid-Ether organic layer with 5% aqueous NaHCO3 (pH 8.0) selectively back-extracts Strong Acids (Salicylic acid, Aspirin, pKa ~3.0–3.5) as water-soluble sodium salts, leaving Weak Acids (Barbiturates, Phenytoin, pKa 7.2–8.0) and Neutrals in the ether! Subsequent shaking of the ether with 0.45 N NaOH (pH 12–13) extracts the Barbiturates into the aqueous alkaline layer, leaving Neutral compounds and Glycosides in the organic phase.',
              'Fraction B — Basic Drugs & Alkaloids (Alkaline-Chloroform Fraction at pH 10.0–11.0): The remaining aqueous phase from Step 1 is basified to pH 10–11 with Ammonium Hydroxide (NH4OH) or NaOH and extracted with Chloroform or Dichloromethane. This isolates unionized Basic Alkaloids and Drugs (Strychnine, Brucine, Atropine, Scopolamine, Cocaine, Quinine, Aconitine, Codeine, Methadone, Fentanyl, Tricyclic Antidepressants, Amphetamines, Phenothiazines, and Benzodiazepines).',
              'Fraction C — Amphoteric Drugs (Isoelectric Chloroform:Isopropanol Fraction at pH 8.5–9.0): Morphine (and Pentazocine/Buprenorphine) contains both a basic tertiary amine (pKa ~8.0, positively charged at pH 2) AND an acidic phenolic hydroxyl group at C3 (pKa ~9.9, negatively charged as water-soluble sodium morphinate/phenoxide at pH 12). Therefore, Morphine MUST be extracted specifically at its Isoelectric Point (pH 8.5–9.0, buffered with NaHCO3/NH4Cl) using a mixed polar solvent of Chloroform : Isopropanol (9:1 or 3:1).',
              'Fraction D — Quaternary Ammonium Compounds (pH-Independent Ion-Pair Extraction): Permanently charged cations like Succinylcholine, Pancuronium, Tubocurarine, and Paraquat/Diquat remain ionized at all pH values and require Ion-Pair Extraction (e.g., with bromothymol blue or heptanesulfonate) or Cation-Exchange SPE.'
            ]
          }
        ]
      },
      {
        id: 'm2-s3',
        heading: '2.3 Volatile & Inorganic Clean-Up: Steam Distillation, Conway Microdiffusion & Dialysis',
        badge: 'Classical Isolation',
        summary: 'Steam distillation of volatile poisons, Conway Microdiffusion Cell for Cyanide/CO/Ethanol, and Dialysis/Electrodialysis for water-soluble inorganic ions.',
        contentBlocks: [
          {
            subtitle: 'Steam Distillation for Volatile Organic & Inorganic Poisons',
            body: 'Volatile poisons boil or co-distil with steam without decomposition, allowing direct physical separation from non-volatile tissue matrices without solvent extraction. Minced viscera or blood diluted with distilled water in a round-bottom flask are subjected to a continuous current of live steam generated from a boiler flask, passing through a Liebig or Allihn condenser into an ice-cooled receiver:',
            keyPoints: [
              '1. Acidic Steam Distillation (Viscera Tartaric/Sulfuric Acidified to pH 2–3): Isolates acidic and neutral volatiles: Hydrocyanic Acid (HCN — collected into an ice-cold receiver containing dilute NaOH or KOH to trap volatile HCN as stable NaCN/KCN!), Ethanol, Methanol, Isopropanol, Acetone, Acetaldehyde, Chloroform, Diethyl Ether, Chloral Hydrate, Carbon Tetrachloride, Phenol (Carbolic acid), Cresols, Camphor, Nitrobenzene, and Yellow Phosphorus (performed in a dark room via Mitscherlich’s apparatus, where luminous phosphorescent flashes appear in the condenser tube due to oxidation of phosphorus vapor!).',
              '2. Alkaline Steam Distillation (Residual Viscera Basified with MgO or NaOH to pH 10–11): Isolates volatile liquid organic bases that were held as non-volatile salts during acidic distillation: Nicotine (tobacco alkaloid), Coniine (hemlock alkaloid), Amphetamine free base, Aniline, Toluidine, and Pyridine.'
            ]
          },
          {
            subtitle: 'The Conway Microdiffusion Cell (Edward J. Conway) & Dialysis / Electrodialysis',
            body: 'For rapid, closed-system isolation of volatile poisons (Cyanide, Carbon Monoxide, Ethanol, Methanol, Acetaldehyde, Ammonia, Fluoride, Sulfide) from small volumes (0.5–2.0 mL) of whole blood, vitreous humor, or tissue homogenates without thermal distillation artifacts, the Conway Microdiffusion Cell is a cornerstone forensic technique. Simultaneously, non-volatile water-soluble inorganic anions and cations that cannot be distilled or extracted into organic solvents are isolated by Dialysis:',
            formula: 'Conway Principle: Liberating Agent (Outer Chamber) → Gaseous Diffusion → Trapping/Chromogenic Reagent (Center Well)',
            keyPoints: [
              'Conway Microdiffusion Cell Architecture & Workflow: Consists of a flat porcelain or glass petri-dish-like unit divided by an inner circular wall into an Outer Annular Chamber and an Inner Central Well, sealed airtight with a ground-glass lid smeared with silicone grease/paraffin. The biological sample (blood/homogenate) and a liberating reagent (e.g., 10% H2SO4 to liberate HCN from cyanide or HF from fluoride; K2CO3 to liberate ethanol/ammonia; or H2SO4 to release CO from carboxyhemoglobin) are placed on opposite sides of the Outer Chamber, while the specific absorbing/indicator reagent is placed in the Center Well. Tilting the sealed dish mixes the sample and liberating acid in the outer ring; over 1–2 hours at room temperature (or 37°C), the volatile gas diffuses across the shared headspace and is quantitatively trapped in the center well: (a) For Cyanide (HCN): Center well contains 0.1 N NaOH (for subsequent Prussian Blue / Pyridine-Pyrazolone test) or Filter paper soaked in Alkaline Picrate / p-Nitrobenzaldehyde; (b) For Ethanol / Methanol: Center well contains Acidified Potassium Dichromate (K2Cr2O7 in H2SO4), which is reduced from Orange-Yellow (Cr6+) to Bluish-Green (Cr3+)! (c) For Carbon Monoxide (CO): Center well contains Palladium Chloride (PdCl2), which is reduced by CO to a black metallic Palladium film (CO + PdCl2 + H2O → Pd↓ + CO2 + 2HCl).',
              'Dialysis & Electrodialysis for Water-Soluble Inorganic Anions & Cations: Corrosive mineral acids (H2SO4, HNO3, HCl), caustic alkalis (NaOH, KOH), and soluble inorganic salts/anions (Nitrite, Nitrate, Chlorate, Bromate, Borate, Fluoride, Oxalate, Barium, Soluble Copper/Zinc salts) are insoluble in organic solvents and destroyed by dry ashing. In Graham’s Dialysis, minced viscera in distilled water are placed inside a semi-permeable cellophane or parchment membrane bag suspended in an outer vessel of pure distilled water. Low-molecular-weight inorganic ions diffuse across the membrane pores into the outer dialysate while high-molecular-weight proteins and colloids remain trapped inside. In Electrodialysis, platinum electrodes apply a direct electric current across the membrane compartments, accelerating the migration of cations toward the cathode and anions toward the anode by 10-fold.'
            ]
          }
        ],
        referenceTable: {
          caption: 'Table 2.2: Classical Isolation & Clean-Up Procedures for Poison Classes from Viscera',
          headers: ['Poison Category', 'Target Analytes', 'Primary Isolation / Clean-Up Method', 'Trapping / Fractionation Principle'],
          rows: [
            ['Acidic / Neutral Volatiles', 'HCN, Ethanol, Methanol, Acetone, Chloroform, Ether, Chloral hydrate, Phenol, Phosphorus', 'Acidic Steam Distillation (Tartaric acid, pH 2–3) or Conway Microdiffusion', 'HCN trapped in NaOH receiver; Phosphorus gives luminescence in dark (Mitscherlich test)'],
            ['Basic Volatiles', 'Nicotine, Coniine, Aniline, Amphetamine base, Pyridine', 'Alkaline Steam Distillation (Basified to pH 10–11)', 'Distils into dilute HCl receiver as stable hydrochloride salts'],
            ['Non-Volatile Acidic Drugs', 'Salicylates (strong acids); Barbiturates, Phenytoin (weak acids)', 'Stas-Otto or (NH4)2SO4 Deproteinization → Acid-Ether LLE (pH 2)', 'Separated by 5% NaHCO3 wash (Salicylates) vs. 0.45 N NaOH wash (Barbiturates)'],
            ['Non-Volatile Basic Alkaloids', 'Strychnine, Atropine, Cocaine, Quinine, Aconitine, Codeine, TCAs', 'Stas-Otto or (NH4)2SO4 Deproteinization → Alkaline-CHCl3 LLE (pH 10–11)', 'Free unionized bases partition into Chloroform / Dichloromethane'],
            ['Amphoteric Alkaloids', 'Morphine, Hydromorphone, Pentazocine, Buprenorphine', 'Isoelectric LLE at pH 8.5–9.0 with Chloroform : Isopropanol (9:1)', 'Phenolic -OH ionizes at pH > 11; tertiary amine ionizes at pH < 3'],
            ['Water-Soluble Inorganic Ions', 'Nitrite, Nitrate, Chlorate, Borate, Fluoride, Bromate, Oxalate, Mineral Acids/Alkalis', 'Membrane Dialysis / Electrodialysis into Distilled Water', 'Low-MW ions pass through semi-permeable cellophane; proteins retained']
          ]
        }
      }
    ],
    quiz: [
      {
        id: 'm2-q1',
        question: 'During a medico-legal autopsy for suspected poisoning, why must the stomach and its contents (Bottle I) be preserved separately from the liver and kidneys (Bottle II)?',
        options: [
          'Hepatic enzymes digest gastric mucin if stored together',
          'Detection of poison in parenchymatous organs (liver/kidney) proves vital antemortem absorption and metabolism, whereas finding poison in stomach contents alone could reflect post-mortem instillation',
          'Saturated salt solution cannot preserve both stomach and liver in the same jar',
          'Kidney tissue neutralizes alkaloids in the stomach'
        ],
        correctAnswer: 1,
        explanation: 'Segregating Bottle I (unabsorbed alimentary contents) from Bottle II (absorbed systemic organs) is essential to prove antemortem ingestion and rule out post-mortem introduction.',
        referenceTopic: '2.1 Viscera Collection (Bottles I–IV)'
      },
      {
        id: 'm2-q2',
        question: 'In which of the following suspected poisonings is Saturated Solution of Common Salt (NaCl) strictly CONTRAINDICATED as a viscera preservative, requiring Rectified Spirit instead?',
        options: [
          'Organophosphate insecticide (Malathion) poisoning',
          'Methanol poisoning',
          'Corrosive Hydrochloric Acid (HCl), Mercuric Chloride, or Silver Nitrate (AgNO3) poisoning',
          'Chloroform poisoning'
        ],
        correctAnswer: 2,
        explanation: 'NaCl prevents chemical proof of HCl ingestion, alters HgCl2 complexes, and reacts with Silver Nitrate (AgNO3) to precipitate insoluble white Silver Chloride (AgCl).',
        referenceTopic: '2.1 Preservative Contraindications'
      },
      {
        id: 'm2-q3',
        question: 'Why does the Ammonium Sulphate [(NH4)2SO4] method offer a major operational advantage over the classical Stas-Otto acidified-alcohol method for deproteinizing viscera in forensic laboratories?',
        options: [
          'Ammonium sulphate converts all organic alkaloids into metallic mirrors',
          'Saturated Ammonium Sulphate at 65–70°C rapidly salts out and coagulates tissue proteins and fats in 1–2 hours to yield a clear aqueous filtrate, avoiding the 24–48 hour evaporation and high solvent volumes of the Stas-Otto method',
          'Ammonium sulphate eliminates the need for pH adjustment during subsequent solvent extraction',
          'Ammonium sulphate selectively destroys barbiturates'
        ],
        correctAnswer: 1,
        explanation: 'The Ammonium Sulphate method precipitates proteins and lipids rapidly by salting-out at 65–70°C, giving a clean aqueous filtrate ready for LLE in under 2 hours.',
        referenceTopic: '2.2 Stas-Otto vs. Ammonium Sulphate Method'
      },
      {
        id: 'm2-q4',
        question: 'During systematic Liquid-Liquid Extraction (LLE) of the Acid-Ether fraction (extracted from viscera at pH 2), how are Strongly Acidic drugs (such as Salicylic Acid / Aspirin) separated from Weakly Acidic drugs (such as Barbiturates and Phenytoin)?',
        options: [
          'By boiling the ether with concentrated nitric acid',
          'By shaking the Acid-Ether organic phase first with 5% aqueous Sodium Bicarbonate (NaHCO3, pH ~8.0) to extract Strong Acids (Salicylates), and then with 0.45 N Sodium Hydroxide (NaOH, pH ~12–13) to extract Weakly Acidic Barbiturates',
          'By passing hydrogen sulfide gas through the ether layer',
          'By cooling the ether to -80°C'
        ],
        correctAnswer: 1,
        explanation: 'Strong acids (pKa ~3.0–3.5) ionize in weak base (5% NaHCO3, pH 8) and partition into the aqueous bicarbonate layer, whereas weakly acidic barbiturates (pKa 7.2–8.0) remain unionized in ether until extracted with strong alkali (NaOH, pH 12–13).',
        referenceTopic: '2.2 pH-Partitioned Fractionation'
      },
      {
        id: 'm2-q5',
        question: 'Why does Morphine fail to extract at strongly acidic pH (pH 2) OR strongly alkaline pH (pH 12), requiring specific extraction at its Isoelectric Point (pH 8.5–9.0) using Chloroform : Isopropanol?',
        options: [
          'Morphine is a volatile gas at pH 12',
          'Morphine is an amphoteric alkaloid possessing both a basic tertiary amine (protonated at pH 2) and an acidic phenolic hydroxyl group at C3 (deprotonated to a water-soluble phenoxide ion at pH 12)',
          'Morphine is insoluble in all organic solvents',
          'Sodium hydroxide oxidizes morphine into strychnine'
        ],
        correctAnswer: 1,
        explanation: 'Because of its C3 phenolic -OH (pKa ~9.9) and tertiary amine (pKa ~8.0), Morphine is amphoteric and only exists in an uncharged extractable form at pH 8.5–9.0.',
        referenceTopic: '2.2 Amphoteric Extraction (Morphine)'
      },
      {
        id: 'm2-q6',
        question: 'During steam distillation of viscera for volatile poisons, why is a 2-step distillation (first from Tartaric-acidified viscera, followed by basification of the residue with MgO/NaOH) performed?',
        options: [
          'Acidic steam distillation isolates volatile acids/neutrals (HCN, Ethanol, Methanol, Chloroform, Phenol, Phosphorus), while subsequent alkaline steam distillation liberates volatile organic bases (Nicotine, Coniine, Aniline, Amphetamine) from their non-volatile acid salts',
          'Alkaline steam distillation is used to isolate nonvolatile heavy metals like Lead and Barium',
          'Tartaric acid converts ethanol into chloroform',
          'Steam distillation can only be performed at pH 7.0'
        ],
        correctAnswer: 0,
        explanation: 'In acidic media, volatile bases (nicotine, coniine, aniline) are protonated as non-volatile tartrate salts while HCN, alcohols, chloroform, and phenol distil over; basifying the flask then liberates the free volatile bases for the second distillation.',
        referenceTopic: '2.3 Steam Distillation'
      },
      {
        id: 'm2-q7',
        question: 'In a Conway Microdiffusion Cell test for Carbon Monoxide (CO) in whole blood, sulfuric acid is added to the blood in the outer chamber to release CO gas. What reagent is placed in the center well, and what positive visual change occurs?',
        options: [
          'Palladium Chloride (PdCl2) solution, which is reduced by CO to a black film/mirror of metallic Palladium (Pd0)',
          'Nessler’s reagent, which turns bright blue',
          'Barium chloride, which turns bright purple',
          'Dragendorff’s reagent, which forms orange crystals'
        ],
        correctAnswer: 0,
        explanation: 'Diffusing CO reduces Pd2+ ions in Palladium Chloride (PdCl2) in the center well to a metallic black Palladium film (CO + PdCl2 + H2O → Pd↓ + CO2 + 2HCl).',
        referenceTopic: '2.3 Conway Microdiffusion Cell'
      },
      {
        id: 'm2-q8',
        question: 'Which classical isolation technique uses a semi-permeable cellophane or parchment membrane (often accelerated by direct electric current in Electrodialysis) to separate water-soluble inorganic anions (Nitrite, Nitrate, Chlorate, Borate, Fluoride, Bromate) and mineral acids/alkalis from homogenized viscera?',
        options: [
          'Dry Ashing in a muffle furnace at 600°C',
          'Dialysis / Electrodialysis',
          'Soxhlet fat extraction with hexane',
          'Headspace Flame Ionization'
        ],
        correctAnswer: 1,
        explanation: 'Water-soluble inorganic ions cannot be extracted into immiscible organic solvents and many anions decompose on dry ashing; Dialysis/Electrodialysis cleanly separates low-molecular-weight ions from macromolecular tissue proteins across a semi-permeable membrane.',
        referenceTopic: '2.3 Dialysis & Electrodialysis'
      },
      {
        id: 'm2-q9',
        question: 'In a postmortem investigation of a Tricyclic Antidepressant (Amitriptyline, Vd ≈ 15 L/kg) overdose, Heart (Central) blood concentration is 3.6 mg/L and clamped Femoral (Peripheral) blood concentration is 0.8 mg/L. What is the C/P ratio and why is the heart blood elevated?',
        options: [
          'C/P = 4.5; Postmortem Redistribution (PMR) releases basic lipophilic drug stored in lung lysosomes and myocardium into central cardiac vessels after cellular acidosis and autolysis',
          'C/P = 0.22; femoral blood concentrates drugs after death',
          'C/P = 4.5; heart blood is the only accurate specimen',
          'C/P = 1.0; amitriptyline does not undergo PMR'
        ],
        correctAnswer: 0,
        explanation: 'C/P = 3.6 / 0.8 = 4.5. High-Vd basic lipophilic drugs diffuse postmortem from lung and myocardial reservoirs into cardiac blood; therefore peripheral femoral blood (0.8 mg/L) must be used for interpretation.',
        referenceTopic: '2.1 Postmortem Redistribution (PMR)'
      },
      {
        id: 'm2-q10',
        question: 'When performing acidic steam distillation for suspected Yellow Phosphorus poisoning (Mitscherlich’s test), why must the distillation condenser be observed in a completely dark room?',
        options: [
          'Light causes the glass condenser to shatter',
          'Yellow phosphorus vapor co-distilling with steam oxidizes on contact with air at the top of the condenser, producing characteristic luminous phosphorescent flashes visible in the dark',
          'Phosphorus turns dark blue only under ultraviolet darkness',
          'Tartaric acid only boils in the dark'
        ],
        correctAnswer: 1,
        explanation: 'In Mitscherlich’s test, trace white/yellow phosphorus vapor distils over with steam and undergoes chemiluminescent oxidation where it meets air in the condenser tube, emitting a diagnostic greenish-white glow in a dark room.',
        referenceTopic: '2.3 Steam Distillation (Mitscherlich Test)'
      }
    ],
    assignment: {
      id: 'm2-assign',
      title: 'Case Assignment 2 (Even Module): Viscera Isolation & Clean-Up, PMR Ratio, Stas-Otto / Ammonium Sulphate LLE, Conway & Dialysis',
      caseScenario: 'A 46-year-old decedent is autopsied 18 hours after suspected multi-drug and chemical ingestion. Autopsy toxicology shows: Central (Heart) Blood Amitriptyline = 3.6 mg/L and Clamped Peripheral (Femoral) Blood Amitriptyline = 0.8 mg/L (preserved in 1% NaF). The Toxicology Division receives Bottle I (Stomach + proximal 30 cm small intestine) and Bottle II (500 g Liver with gall bladder + Kidneys + Spleen) along with Bottle IV (Preservative Control Blank) to isolate a suspected mixture of Salicylate (strong acid), Phenobarbital (weak acid), Morphine (amphoteric alkaloid), Potassium Cyanide (volatile), and Sodium Nitrite/Chlorate (water-soluble inorganic anions).',
      instructions: [
        'Calculate the Central-to-Peripheral (C/P) Postmortem Redistribution Ratio for Amitriptyline (3.6 / 0.8).',
        'Specify the minimum standard mass of Liver tissue (in grams) required in Bottle II during a medico-legal autopsy.',
        'Select the mandatory classical Liquid-Liquid Extraction (LLE) condition required to isolate Amphoteric Morphine after Ammonium Sulphate or Stas-Otto deproteinization.',
        'Select the paired classical isolation techniques used to separate (a) volatile HCN gas from whole blood and (b) water-soluble inorganic anions (Nitrite/Chlorate) from homogenized viscera.',
        'Write a Forensic Viscera Isolation & Clean-Up Protocol explaining: (1) Why peripheral femoral blood is mandatory due to PMR (C/P = 4.5) and preservative rules, (2) How Ammonium Sulphate / Stas-Otto deproteinization followed by Acid-Ether (5% NaHCO3 vs. 0.45 N NaOH wash), Alkaline-Chloroform (pH 10–11), and Isoelectric (pH 8.5–9.0) LLE separates Salicylate, Phenobarbital, Basic Alkaloids, and Morphine, and (3) How Acidic Steam Distillation, the Conway Microdiffusion Cell, and Membrane Dialysis/Electrodialysis isolate volatile and water-soluble inorganic poisons.'
      ],
      structuredFields: [
        {
          id: 'cp_ratio',
          label: 'Calculated Central-to-Peripheral (C/P) PMR Ratio (3.6 mg/L ÷ 0.8 mg/L)',
          type: 'number',
          placeholder: 'e.g., 4.5',
          expectedValue: 4.5,
          tolerance: 0.05,
          criterionLabel: 'Accurate calculation of C/P PMR Ratio (3.6 / 0.8 = 4.5)',
          hint: 'Divide Central Heart Blood concentration (3.6 mg/L) by Peripheral Femoral Blood concentration (0.8 mg/L).'
        },
        {
          id: 'liver_mass_g',
          label: 'Minimum Standard Mass of Liver Required in Bottle II at Autopsy [in grams]',
          type: 'number',
          unit: 'g',
          placeholder: 'e.g., 500',
          expectedValue: 500,
          tolerance: 0,
          criterionLabel: 'Correct standard autopsy liver specimen mass (500 g)',
          hint: 'Standard Indian FSL autopsy guidelines require at least 500 g of liver (including intact gall bladder) in Bottle II.'
        },
        {
          id: 'morphine_isolation',
          label: 'Mandatory Classical LLE Condition to Isolate Amphoteric Morphine from Deproteinized Filtrate',
          type: 'select',
          options: [
            'Isoelectric Extraction at pH 8.5 – 9.0 using Chloroform : Isopropanol (9:1)',
            'Strongly Acidic Extraction at pH 1.0 using Hexane',
            'Strongly Alkaline Extraction at pH 13.5 using Petroleum Ether',
            'Dry Ashing in a Muffle Furnace at 550°C'
          ],
          expectedValue: 'Isoelectric Extraction at pH 8.5 – 9.0 using Chloroform : Isopropanol (9:1)',
          criterionLabel: 'Correct selection of Isoelectric pH 8.5–9.0 with Chloroform:Isopropanol for Morphine',
          hint: 'Morphine is amphoteric (tertiary amine + C3 phenolic OH) and extracts only near its isoelectric point (pH 8.5–9.0).'
        },
        {
          id: 'volatile_inorganic_isolation',
          label: 'Classical Isolation Techniques for (a) Volatile HCN in Blood & (b) Water-Soluble Inorganic Anions (Nitrite/Chlorate) in Viscera',
          type: 'select',
          options: [
            'Conway Microdiffusion / Acidic Steam Distillation (for HCN) & Membrane Dialysis / Electrodialysis (for Water-Soluble Inorganic Ions)',
            'Muffle Furnace Incineration at 600°C for both HCN and Nitrite',
            'Soxhlet Fat Extraction with Petroleum Ether',
            'Preservation in 10% Buffered Formalin'
          ],
          expectedValue: 'Conway Microdiffusion / Acidic Steam Distillation (for HCN) & Membrane Dialysis / Electrodialysis (for Water-Soluble Inorganic Ions)',
          criterionLabel: 'Correct selection of Conway Microdiffusion/Steam Distillation (HCN) & Dialysis/Electrodialysis (Inorganic Ions)',
          hint: 'Volatile HCN is isolated by Conway microdiffusion or acidic steam distillation into NaOH, while water-soluble inorganic anions are isolated across a cellophane membrane by Dialysis/Electrodialysis.'
        }
      ],
      writtenPrompt: 'Draft your Forensic Viscera Isolation & Clean-Up Protocol covering: (1) Autopsy Bottles I–IV, preservative exceptions, and PMR (C/P = 4.5 in femoral vs. heart blood), (2) Deproteinization (Stas-Otto / Ammonium Sulphate) and pH-partitioned fractionation of Strong Acids (5% NaHCO3), Weak Acids/Barbiturates (0.45 N NaOH), Basic Alkaloids (pH 10–11), and Amphoteric Morphine (pH 8.5–9.0), and (3) Isolation of volatiles and inorganic ions via Steam Distillation, Conway Microdiffusion, and Dialysis:',
      minWordCount: 35,
      requiredKeywords: [
        { groupLabel: 'PMR, Autopsy Bottles & Femoral Blood', terms: ['femoral', 'peripheral', 'pmr', 'redistribution', 'lung', 'heart', 'bottle', 'preservative'] },
        { groupLabel: 'Stas-Otto / Ammonium Sulphate & pH Fractionation', terms: ['stas-otto', 'ammonium', 'isoelectric', '8.5', '9.0', 'bicarbonate', 'barbiturate', 'morphine'] },
        { groupLabel: 'Conway Microdiffusion, Steam Distillation & Dialysis', terms: ['conway', 'microdiffusion', 'steam', 'distillation', 'dialysis', 'cyanide'] }
      ],
      sampleFrameworkHint: 'Include: (1) Why Amitriptyline redistributes from lungs/myocardium (C/P = 4.5), making clamped femoral blood in 1% NaF and 500 g liver in Bottle II mandatory; (2) How Ammonium Sulphate/Stas-Otto deproteinization followed by Acid-Ether (NaHCO3 vs NaOH wash), Alkaline-CHCl3, and Isoelectric pH 8.5–9.0 LLE separates Salicylate, Phenobarbital, and Morphine; and (3) How Conway microdiffusion/steam distillation traps HCN and Dialysis isolates Nitrite/Chlorate.'
    }
  },
  {
    id: 'tox-mod-3',
    moduleNumber: 3,
    code: 'FT2601-M3',
    title: 'Module 3: Modern Extraction, Chromatographic Separation & Spectrometric / Inorganic Instrumentation',
    subtitle: 'Dry ashing, wet & microwave digestion for metals, SPE, SPME, ASE & QuEChERS, TLC, HPTLC, HPLC & GLC, UV-Vis, FTIR, Mass Spectrometry (EI/CI/ESI-MRM), AAS (FAAS/GFAAS/HG-AAS/CV-AAS), ICP-OES, ICP-MS, and Ion Chromatography.',
    level: 'Intermediate',
    estimatedHours: '8 Hours',
    learningObjectives: [
      'Destroy organic viscera matrices for metallic poison isolation using Dry Ashing, Wet Acid Digestion (HNO3 + H2SO4 + HClO4), and Closed-Vessel Microwave Digestion without losing volatile metals.',
      'Execute modern organic sample extraction using Solid-Phase Extraction (SPE), Solid-Phase Microextraction (SPME), Accelerated Solvent Extraction (ASE), QuEChERS, and Dried Blood Spot (DBS) microsampling.',
      'Apply Chromatographic separation techniques (TLC Retardation Factor Rf, HPTLC, Reversed-Phase HPLC, and Capillary GLC / HS-GC-FID) with silylation/acylation derivatization.',
      'Operate Spectrometric and Inorganic platforms: UV-Vis (Beer-Lambert law), FTIR-ATR, Mass Spectrometry (70 eV EI, CI, ESI Triple-Quadrupole MRM), AAS (Flame, Graphite Furnace, Hydride Generation, Cold Vapour), ICP-OES, ICP-MS, and Ion Chromatography.'
    ],
    interactiveToolType: 'analytical_validator',
    sections: [
      {
        id: 'm3-s1',
        heading: '3.1 Viscera Digestion for Metallic Poisons (Dry Ashing, Wet & Microwave Digestion) & Modern Organic Extraction (SPE, SPME, ASE)',
        badge: 'Digestion & Modern Extraction',
        summary: 'Mineralization of biological tissues for elemental analysis and modern sorptive/pressurized extraction for organic xenobiotics.',
        contentBlocks: [
          {
            subtitle: 'Destruction of Organic Matter for Metallic Poisons: Dry Ashing, Wet Digestion & Microwave Digestion',
            body: 'Inorganic metallic poisons (Arsenic, Antimony, Lead, Mercury, Thallium, Copper, Zinc, Barium) are covalently bound to tissue sulfhydryl (-SH) proteins (metallothioneins and keratin) and cannot be extracted by organic solvents. Before qualitative tests or atomic spectrometry (AAS / ICP-MS), the organic biological matrix must be completely mineralized (oxidized to CO2, H2O, and oxides of nitrogen) leaving the metals in a clear inorganic ionic solution:',
            keyPoints: [
              '1. Dry Ashing (Incineration in Muffle Furnace at 450–550°C): Minced viscera dried in a silica or porcelain crucible (often with fusion/ashing aids like Magnesium Nitrate Mg(NO3)2 or Sodium Carbonate to prevent volatilization) are heated gradually in a muffle furnace at 450–550°C until a white carbon-free ash remains, which is dissolved in dilute HCl/HNO3. Advantage: Handles large tissue masses (100–200 g) with minimal reagent blank contamination. Critical Limitation: Volatile metals—specifically Mercury (Hg boils at 357°C; completely lost!), Arsenic (As), Antimony (Sb), Thallium (Tl), Selenium (Se), and Tetraethyl Lead—volatilize or bind to silica crucibles at >450°C! Dry ashing is suitable only for non-volatile refractory metals (Copper, Zinc, Barium, Bismuth, Iron, Chromium, Inorganic Lead at controlled ≤450°C).',
              '2. Wet Acid Digestion (Fresenius-Babo & Acid Mixture Mineralization): Prevents volatilization by oxidizing tissue in liquid strong acids at 100–250°C inside a Kjeldahl flask or reflux condenser: (a) Nitric-Sulfuric-Perchloric Acid Method (HNO3 + H2SO4 + HClO4 in 3:1:1 ratio): Concentrated HNO3 oxidizes bulk carbohydrates/proteins while H2SO4 dehydrates and raises the boiling point; adding Perchloric acid (HClO4) completes oxidation of refractory lipids to yield a water-clear digest (Note: never add HClO4 to dry or high-fat tissue without prior HNO3 digestion due to explosive perchlorate ester risk); (b) Fresenius-Babo Method (Hydrochloric Acid + Potassium Chlorate KClO3): Generates nascent chlorine (Cl2) in situ at gentle heat (60–80°C), keeping Arsenic and Mercury in higher non-volatile oxidation states; (c) Sub-Boiling Reflux Digestion for Mercury: Uses a cold-finger reflux condenser at ≤90°C with HNO3 + H2SO4 + KMnO4/K2S2O8 to prevent any loss of volatile elemental Hg0.',
              '3. Closed-Vessel Microwave-Assisted Acid Digestion (Modern Gold Standard): 0.5–2.0 g of tissue, blood, hair, or nail is sealed inside high-pressure PTFE/TFM (Teflon) bombs with ultra-pure SupraPur HNO3 + 30% Hydrogen Peroxide (H2O2) and irradiated with 2450 MHz microwaves (180–210°C, 20–40 bar for 15–25 minutes). Because the PTFE vessel is hermetically sealed, ZERO loss of volatile Mercury, Arsenic, Selenium, or Thallium occurs, reagent blanks are ultra-low, and the digest is directly ready for ICP-MS / GFAAS.'
            ]
          },
          {
            subtitle: 'Modern Organic Extraction: SPE, SPME, ASE (PLE), QuEChERS & Dried Blood Spots (DBS)',
            body: 'To overcome emulsion formation, high solvent consumption, and manual labor in classical Liquid-Liquid Extraction (LLE), modern forensic toxicology laboratories deploy automated solid-sorbent and microextraction platforms:',
            keyPoints: [
              '1. Solid-Phase Extraction (SPE — 4-Step Condition → Load → Wash → Elute): Uses disposable cartridges packed with silica-bonded or polymeric sorbents: Reversed-Phase (C18 / C8 / Oasis HLB hydrophilic-lipophilic balance), Normal-Phase (Silica, Florisil), or Mixed-Mode Ion Exchange (Clean Screen DAU / Oasis MCX containing both C8 hydrophobic chains and strong cation-exchange -SO3- sulfonic acid groups). In Mixed-Mode Cation Exchange SPE, acidified blood/urine extract loads neutral/acidic drugs onto C8 while protonated basic drugs bind electrostatically to -SO3-; acidic/neutral drugs are eluted first with organic solvent, interferences are washed away with methanol, and pure basic drugs (opioids, amphetamines, cocaine, benzodiazepines) are eluted with 2–5% NH4OH in ethyl acetate/methanol.',
              '2. Solid-Phase Microextraction (SPME — Solvent-Free Fiber Extraction): Invented by Janusz Pawliszyn, SPME uses a fused-silica fiber coated with a stationary polymeric phase (e.g., Polydimethylsiloxane PDMS for non-polar volatiles, or Polyacrylate/Carbowax-DVB for polar analytes) mounted inside a syringe needle. In Headspace-SPME (HS-SPME), the fiber is exposed to the vapor phase above warmed blood/viscera to adsorb volatile poisons (cyanide, alcohols, inhalants, pesticides, amphetamines) and then inserted directly into the hot GC injection port for thermal desorption—using zero organic solvent.',
              '3. Accelerated Solvent Extraction (ASE / Pressurized Liquid Extraction PLE): Extracts homogenized solid tissues, hair, bone, or soil inside stainless-steel cells using conventional solvents at elevated temperature (80–150°C) and high pressure (1500 psi / 10 MPa, keeping solvent liquid above its normal boiling point). High temperature reduces solvent viscosity and disrupts analyte-matrix binding, completing extraction in 12–15 minutes with 80% less solvent.',
              '4. QuEChERS & Dried Blood Spots (DBS): QuEChERS (Acetonitrile extraction + MgSO4/NaCl salting-out + dispersive SPE cleanup with Primary-Secondary Amine PSA and C18) rapidly extracts multi-class pesticides and drugs from liver/stomach homogenates. Dried Blood Spots (DBS — 20–50 µL capillary or venous blood spotted on Whatman 903 cellulose cards) stabilize ester-labile drugs (Cocaine, 6-MAM, GHB, Phosphatidylethanol PEth) at ambient temperature by inactivation of esterases upon drying.'
            ]
          }
        ]
      },
      {
        id: 'm3-s2',
        heading: '3.2 Chromatographic Separation Techniques: TLC, HPTLC, HPLC & GLC (GC)',
        badge: 'Chromatography',
        summary: 'Stationary vs. mobile phase partitioning, TLC/HPTLC screening, Reversed-Phase HPLC, and Capillary Gas-Liquid Chromatography (GLC).',
        contentBlocks: [
          {
            subtitle: 'Planar Chromatography: Thin-Layer Chromatography (TLC) & HPTLC',
            body: 'Planar chromatography separates extracted fractions across a flat stationary phase plate (Silica Gel G 60 F254 with calcium sulfate binder and 254 nm fluorescent indicator) using capillary migration of a mobile phase solvent system (e.g., Toxi-Lab or Davidow’s system: Ethyl acetate : Methanol : Ammonia 85:10:5 for basic drugs; Chloroform : Acetone 80:20 for acidic drugs/barbiturates):',
            formula: 'Retardation Factor (Rf) = Distance Traveled by Solute Spot Center (cm) / Distance Traveled by Solvent Front (cm)   [0 < Rf < 1]',
            keyPoints: [
              'TLC Visualization & Chromogenic Spray Reagents: Plates are examined first under UV light (254 nm fluorescence quenching and 366 nm native fluorescence — e.g., Quinine and LSD fluoresce intensely blue), followed by sequential chromogenic sprays: Dragendorff’s Reagent (Potassium bismuth iodide → Orange-red spots for tertiary amines/alkaloids), Acidified Iodoplatinate (Violet/blue-brown for alkaloids), Mandelin’s / Marquis Spray, Mercurous Nitrate + Diphenylcarbazone (for Barbiturates), and Palladium Chloride / Dithizone (for Organophosphates).',
              'High-Performance Thin-Layer Chromatography (HPTLC): Uses smaller, uniform silica particles (4–6 µm vs. 10–25 µm in classical TLC), automated piezonbulizer band applicators (CAMAG Linomat), shorter development distance (5–7 cm), and UV-Vis scanning densitometry (190–800 nm) to record full in-situ absorption spectra and semi-quantitative peak areas across 20 simultaneous forensic samples.'
            ]
          },
          {
            subtitle: 'Column Chromatography: Reversed-Phase HPLC & Gas-Liquid Chromatography (GLC / GC)',
            body: 'High-resolution quantitative separation of complex multi-drug and pesticide mixtures relies on instrumental column chromatography:',
            keyPoints: [
              '1. High-Performance Liquid Chromatography (HPLC / UHPLC): Separates non-volatile, polar, or thermally labile toxins (benzodiazepines, glucuronides, cardiac glycosides,toxalbumins, paraquat, carbamates, rodencides) in liquid solution at ambient/mild temperature (25–45°C) without chemical derivatization. Over 90% of forensic HPLC uses Reversed-Phase mode: a Non-Polar Stationary Phase (Octadecylsilane C18 or C8 bonded to 1.7–5 µm silica particles) paired with a Polar Aqueous-Organic Mobile Phase (Water/Formic acid/Ammonium formate buffer + Acetonitrile or Methanol gradient). In Reversed-Phase HPLC, polar hydrophilic metabolites elute first, while non-polar lipophilic compounds retain longer. Detectors: Photodiode Array (PDA/DAD — records full 200–400 nm UV spectrum of each peak to check peak purity), Fluorescence, Electrochemical, and Mass Spectrometry (LC-MS/MS).',
              '2. Gas-Liquid Chromatography (GLC / Capillary GC): Separates volatile and semi-volatile thermally stable compounds partitioned between a carrier gas mobile phase (Helium, Hydrogen, or Nitrogen) and a liquid polymeric film coated inside a fused-silica capillary column (15–30 m length, 0.25 mm ID; commonly 5%-Phenyl-95%-Dimethylpolysiloxane DB-5/HP-5MS). Headspace GC with Flame Ionization Detection (HS-GC-FID) using n-propanol or tert-butanol internal standard is the definitive method for ethanol, methanol, acetone, ether, and chloroform. For polar non-volatile drugs (Morphine, THC-COOH, Benzoylecgonine, GHB, Amphetamines) analyzed by GC-MS, Chemical Derivatization—Silylation (BSTFA + 1% TMCS or MSTFA replacing active -OH/-COOH hydrogens with -TMS groups) or Acylation (PFPA / HFBA / TFAA)—is mandatory to increase volatility and thermal stability.'
            ]
          }
        ]
      },
      {
        id: 'm3-s3',
        heading: '3.3 Spectrometric & Inorganic Poison Analysis: UV-Vis, FTIR, MS, AAS, ICP-OES, ICP-MS & Ion Chromatography',
        badge: 'Spectrometry & Elemental Analysis',
        summary: 'Molecular spectroscopy (UV-Vis, FTIR, Mass Spectrometry) and atomic/ionic analysis (FAAS, GFAAS, HG-AAS, CV-AAS, ICP-OES, ICP-MS, Ion Chromatography).',
        contentBlocks: [
          {
            subtitle: 'Spectrometric Detection: UV-Vis, FTIR & Mass Spectrometry (EI, CI, ESI, MRM)',
            body: 'Spectrometric detectors provide structural and quantitative confirmation:',
            formula: 'Beer-Lambert Law: Absorbance (A) = log10(I0 / I) = ε × c × l   |   Quadrupole Mass Filter: Separates ions by m/z (Mass-to-Charge Ratio)',
            keyPoints: [
              '1. UV-Visible Spectrophotometry (190–800 nm): Measures electronic transitions (π → π* and n → π*) in conjugated chromophores according to the Beer-Lambert Law. Classic Forensic Applications: Differential pH-shift UV spectrophotometry of Barbiturates (5,5-disubstituted barbiturates show λmax at 240 nm in pH 10 borate buffer due to mono-anion resonance, shifting to 255 nm in pH 13 NaOH due to di-anion formation, and disappearing at pH 2!), CO-Oximetry of Carboxyhemoglobin (540 & 576 nm) vs. Methemoglobin (630 nm), and Ellman’s colorimetric cholinesterase assay (412 nm).',
              '2. Fourier-Transform Infrared Spectroscopy (FTIR / ATR-FTIR, 4000–400 cm-1): Measures fundamental vibrational stretching and bending modes of chemical bonds. The "Fingerprint Region" (1500–400 cm-1) is unique to every molecule and distinguishes positional isomers (e.g., ortho-, meta-, and para-fluoroamphetamine or seized NDPS powders like Heroin HCl vs. Heroin base, Cocaine HCl vs. Crack Cocaine base) non-destructively via Attenuated Total Reflectance (ATR) diamond crystal.',
              '3. Mass Spectrometry (GC-MS & LC-MS/MS): In GC-MS, Electron Ionization (EI at 70 eV) is a "hard" ionization technique producing reproducible structural fragment ions for NIST/SWGDRUG library matching, whereas Chemical Ionization (CI) is a "soft" ionization technique yielding an abundant protonated molecular ion [M+H]+. In LC-MS/MS, Electrospray Ionization (ESI) or APCI feeds a Triple Quadrupole (Q1-q2-Q3) analyzer operating in Multiple Reaction Monitoring (MRM) mode: Q1 selects the Precursor Ion, q2 induces Collision-Induced Dissociation (CID), and Q3 monitors a Quantifier Product Ion and at least one Qualifier Product Ion (whose intensity ratio must match the reference standard within ±20% per SWGTOX / ANSI-ASB 036 guidelines, alongside LOD S/N ≥ 3 and LOQ S/N ≥ 10).'
            ]
          },
          {
            subtitle: 'Inorganic Poison Analysis: AAS (FAAS, GFAAS, HG-AAS, CV-AAS), ICP-OES, ICP-MS & Ion Chromatography',
            body: 'Analysis of metallic poisons and toxic inorganic anions in mineralized viscera or dialysates requires specialized atomic and ionic instrumentation:',
            keyPoints: [
              '1. Atomic Absorption Spectroscopy (AAS): Ground-state metal atoms absorb light of a characteristic resonance wavelength emitted by an element-specific Hollow Cathode Lamp (HCL). Four specialized atomization modes are used in forensic toxicology: (a) Flame AAS (FAAS — Air-Acetylene 2300°C or N2O-Acetylene 2900°C flame): Quantifies ppm (mg/L) levels of Copper, Zinc, Iron, Barium; (b) Graphite Furnace / Electrothermal AAS (GFAAS): Electrically heated graphite tube (up to 2700°C) with Zeeman background correction; requires only 20 µL of blood/digest and achieves ppb (µg/L) sensitivity for Lead, Thallium, Cadmium, and Chromium; (c) Hydride Generation AAS (HG-AAS): Reacts acid-digested sample with Sodium Borohydride (NaBH4) + HCl to convert Arsenic (As), Antimony (Sb), Bismuth (Bi), and Selenium (Se) into volatile covalent hydrides (Arsine AsH3, Stibine SbH3), swept by argon into a heated quartz cell at 900°C for sub-ppb detection; (d) Cold Vapour AAS (CV-AAS): Specifically designed for Mercury (Hg), which has an appreciable vapor pressure at room temperature! Stannous Chloride (SnCl2) or NaBH4 reduces Hg2+ in acid digest to elemental atomic Mercury vapor (Hg0), which is swept directly at ambient temperature through an optical quartz absorption cell at 253.7 nm without any flame or heating!',
              '2. Inductively Coupled Plasma Optical Emission Spectrometry (ICP-OES) & Mass Spectrometry (ICP-MS): An argon plasma torch operating at 6,000–10,000 K desolvates, atomizes, excites (ICP-OES measures multi-element atomic emission lines), and ionizes (ICP-MS separates singly charged positive ions M+ by mass-to-charge ratio m/z). ICP-MS is the supreme forensic standard for simultaneous trace multi-element profiling (As, Tl, Pb, Hg, Sb, Ba, Cd, U, Po) in single hair segments, nails, bone, and viscera down to parts-per-trillion (ppt) with isotopic ratio fingerprinting (e.g., lead isotope ratios 206Pb/207Pb/208Pb to match a bullet or paint source).',
              '3. Ion Chromatography (IC) with Suppressed Conductivity / UV Detection: The definitive instrumental method for quantifying water-soluble Toxic Inorganic Anions (Nitrite NO2-, Nitrate NO3-, Fluoride F-, Chloride Cl-, Bromide Br-, Bromate BrO3-, Chlorate ClO3-, Sulphate SO42-, Sulphide S2-, Thiosulphate, Oxalate C2O42-, and Cyanide CN-) and low-MW cations (Lithium, Barium, Ammonium, Paraquat) in aqueous dialysates, vitreous humor, or drinking water.'
            ]
          }
        ],
        referenceTable: {
          caption: 'Table 3.1: Instrumental Platform Selection for Organic & Inorganic Forensic Toxicology',
          headers: ['Instrumental Technique', 'Target Forensic Analytes', 'Atomization / Ionization Principle', 'Key Forensic Advantage & Sensitivity'],
          rows: [
            ['Cold Vapour AAS (CV-AAS)', 'Mercury (Hg) in blood, urine, fish, viscera', 'SnCl2 reduction to ambient Hg0 vapor at 253.7 nm (no flame)', 'Eliminates thermal loss; sub-ppb specificity for Mercury'],
            ['Hydride Generation AAS (HG-AAS)', 'Arsenic (As), Antimony (Sb), Selenium (Se), Bismuth (Bi)', 'NaBH4 + HCl generates volatile hydrides (AsH3, SbH3) → 900°C quartz cell', 'Separates metalloid from complex matrix interferences (ppb level)'],
            ['Graphite Furnace AAS (GFAAS)', 'Lead (Pb), Thallium (Tl), Cadmium (Cd), Aluminum (Al)', 'Electrothermal program (Dry → Char → Atomize) in graphite tube', 'Requires only 10–20 µL blood/digest; ppb (µg/L) detection'],
            ['ICP-MS (Collision/Reaction Cell)', 'Simultaneous multi-element metals (As, Tl, Pb, Hg, Ba, Sb, Cu, Zn)', 'Argon plasma (6000–10000 K) + Quadrupole/TOF mass analyzer', 'Parts-per-trillion (ppt) sensitivity + Lead/Metal Isotope Ratio matching'],
            ['Ion Chromatography (IC)', 'Nitrite, Nitrate, Fluoride, Chlorate, Bromate, Bromide, Sulphate, Oxalate', 'Anion-exchange column + Chemical suppressor + Conductivity detector', 'Simultaneous speciation of toxic inorganic anions without derivatization'],
            ['GC-MS (70 eV EI / CI) + Silylation', 'Volatile/semi-volatile drugs, TMS-derivatized Opioids, THC-COOH', 'Capillary GLC + Electron or Chemical Ionization', 'Gold-standard structural fingerprint library matching'],
            ['UHPLC-MS/MS (ESI-MRM)', 'Thermally labile/polar drugs, NPS, Pesticides, Glycosides, Glucuronides', 'Reversed-phase C18 UHPLC + Electrospray Triple-Quadrupole MRM', 'No derivatization needed; Quantifier + Qualifier ion ratio (±20%)']
          ]
        }
      }
    ],
    quiz: [
      {
        id: 'm3-q1',
        question: 'Why is Dry Ashing in a muffle furnace at 500–550°C strictly UNSUITABLE when analyzing autopsy viscera for suspected Mercury (Hg) or Arsenic (As) poisoning?',
        options: [
          'Mercury and Arsenic react with oxygen to form insoluble diamonds',
          'Mercury (boiling point 357°C) and Arsenic compounds volatilize and escape completely as vapor at muffle furnace temperatures, causing false-negative results',
          'Dry ashing only works on liquid urine samples',
          'Porcelain crucibles melt at 400°C'
        ],
        correctAnswer: 1,
        explanation: 'Elemental and inorganic Mercury and Arsenic are highly volatile at temperatures above 350–450°C and are lost during open dry ashing; closed-vessel microwave acid digestion or reflux wet digestion must be used.',
        referenceTopic: '3.1 Dry Ashing vs. Wet/Microwave Digestion'
      },
      {
        id: 'm3-q2',
        question: 'Which specialized Atomic Absorption Spectroscopy (AAS) technique is uniquely used for quantifying Mercury (Hg) by reducing Hg2+ with Stannous Chloride (SnCl2) into elemental atomic vapor (Hg0) measured at 253.7 nm at room temperature WITHOUT a flame?',
        options: [
          'Cold Vapour Atomic Absorption Spectroscopy (CV-AAS)',
          'Nitrous Oxide-Acetylene Flame AAS',
          'Fourier-Transform Infrared Spectroscopy (FTIR)',
          'Thin-Layer Chromatography (TLC)'
        ],
        correctAnswer: 0,
        explanation: 'Mercury is the only metal with an appreciable atomic vapor pressure at room temperature; CV-AAS reduces Hg2+ with SnCl2/NaBH4 and sweeps ambient Hg0 vapor into a quartz absorption cell at 253.7 nm.',
        referenceTopic: '3.3 Cold Vapour AAS (CV-AAS)'
      },
      {
        id: 'm3-q3',
        question: 'In Hydride Generation AAS (HG-AAS), which chemical reagent is added to an acidified viscera digest to convert Arsenic (As) and Antimony (Sb) into volatile Arsine (AsH3) and Stibine (SbH3) gases for atomization in a heated quartz tube?',
        options: [
          'Sodium Borohydride (NaBH4) in HCl',
          'Barium Sulfate (BaSO4)',
          'Dragendorff’s Potassium Bismuth Iodide',
          'Silver Nitrate (AgNO3)'
        ],
        correctAnswer: 0,
        explanation: 'Sodium borohydride (NaBH4) in acidic medium rapidly reduces As, Sb, Bi, and Se to their volatile covalent hydrides (AsH3, SbH3), separating them cleanly from matrix interferences.',
        referenceTopic: '3.3 Hydride Generation AAS (HG-AAS)'
      },
      {
        id: 'm3-q4',
        question: 'In Thin-Layer Chromatography (TLC), the mobile phase solvent front migrates 12.0 cm from the baseline origin while the center of the suspected alkaloid spot migrates 7.8 cm. What is the Retardation Factor (Rf)?',
        options: ['0.42', '0.65', '1.54', '4.20'],
        correctAnswer: 1,
        explanation: 'Rf = Distance traveled by solute spot center (7.8 cm) / Distance traveled by solvent front (12.0 cm) = 7.8 / 12.0 = 0.65.',
        referenceTopic: '3.2 TLC Retardation Factor (Rf)'
      },
      {
        id: 'm3-q5',
        question: 'What is the fundamental characteristic of Solid-Phase Microextraction (SPME) developed by Janusz Pawliszyn?',
        options: [
          'It requires 500 mL of boiling diethyl ether per sample',
          'It is a solvent-free microextraction technique using a polymer-coated fused-silica fiber (e.g., PDMS) exposed to the sample or headspace followed by direct thermal desorption in the GC injector',
          'It uses a muffle furnace at 800°C to char blood',
          'It can only separate inorganic bone calcium'
        ],
        correctAnswer: 1,
        explanation: 'SPME uses a coated fused-silica fiber inside a syringe needle to partition volatile or semi-volatile analytes directly from headspace or aqueous phase without organic solvents.',
        referenceTopic: '3.1 Modern Extraction (SPME)'
      },
      {
        id: 'm3-q6',
        question: 'In Reversed-Phase High-Performance Liquid Chromatography (RP-HPLC), what are the polarities of the stationary phase and mobile phase, and which analytes elute first?',
        options: [
          'Non-polar stationary phase (e.g., C18 octadecylsilane) and polar aqueous-organic mobile phase (water/acetonitrile or methanol); polar hydrophilic metabolites elute first',
          'Polar silica stationary phase and non-polar hexane mobile phase; lipids elute first',
          'Gaseous helium mobile phase and molten metal stationary phase',
          'Cellophane membrane stationary phase and pure sulfuric acid mobile phase'
        ],
        correctAnswer: 0,
        explanation: 'Reversed-Phase HPLC pairs a hydrophobic non-polar stationary phase (C18/C8) with a polar aqueous/organic mobile phase, so polar water-soluble metabolites have minimal retention and elute first.',
        referenceTopic: '3.2 Reversed-Phase HPLC'
      },
      {
        id: 'm3-q7',
        question: 'Prior to Gas Chromatography-Mass Spectrometry (GC-MS) analysis of polar, non-volatile metabolites containing -OH or -COOH groups (such as THC-COOH, Morphine, or Benzoylecgonine), why is Silylation (using BSTFA or MSTFA) performed?',
        options: [
          'To replace active polar hydrogens with Trimethylsilyl (-TMS) groups, increasing volatility, thermal stability, and chromatographic peak symmetry',
          'To precipitate proteins in whole blood',
          'To convert organic drugs into radioactive isotopes',
          'To make the compounds insoluble in helium carrier gas'
        ],
        correctAnswer: 0,
        explanation: 'Silylation replaces active protic hydrogens (-OH, -COOH, -NH) with non-polar Trimethylsilyl (-Si(CH3)3) groups so the analyte vaporizes intact in the GC injector.',
        referenceTopic: '3.2 GLC / GC-MS Derivatization'
      },
      {
        id: 'm3-q8',
        question: 'In Gas Chromatography-Mass Spectrometry (GC-MS), how does 70 eV Electron Ionization (EI) differ from Chemical Ionization (CI)?',
        options: [
          'EI is a "hard" ionization technique that produces extensive, reproducible structural fragmentation for library matching, whereas CI is a "soft" ionization technique that preserves the protonated molecular ion [M+H]+ for molecular weight determination',
          'EI uses a liquid mobile phase whereas CI uses a solid phase',
          'EI only detects inorganic anions whereas CI only detects noble gases',
          'CI destroys the molecular ion completely'
        ],
        correctAnswer: 0,
        explanation: '70 eV EI creates reproducible fragment ion fingerprints searchable against NIST libraries, while CI gently transfers a proton from reagent gas (methane/ammonia) to preserve [M+H]+.',
        referenceTopic: '3.3 Mass Spectrometry (EI vs. CI)'
      },
      {
        id: 'm3-q9',
        question: 'Which instrumental technique is the primary method of choice for simultaneous speciation and quantification of water-soluble toxic inorganic anions (Nitrite, Nitrate, Fluoride, Chlorate, Bromate, Sulphate, and Oxalate) in aqueous dialysates?',
        options: [
          'Ion Chromatography (IC) with suppressed conductivity detection',
          'Cold Vapour AAS',
          'Flame Photometry',
          'Attenuated Total Reflectance FTIR'
        ],
        correctAnswer: 0,
        explanation: 'Ion Chromatography separates inorganic anions on an ion-exchange column and quantifies them with high sensitivity via suppressed conductivity or UV detection.',
        referenceTopic: '3.3 Ion Chromatography'
      },
      {
        id: 'm3-q10',
        question: 'In LC-MS/MS Triple Quadrupole analysis operating in Multiple Reaction Monitoring (MRM) mode, what acceptance criterion must the Qualifier-to-Quantifier Product Ion Ratio satisfy to confirm compound identity?',
        options: [
          'It must match the certified reference standard’s ion ratio within ±20% tolerance (alongside retention time match and LOD S/N ≥ 3, LOQ S/N ≥ 10)',
          'It must always equal 1000%',
          'It does not need a reference standard',
          'Only a single precursor ion without fragmentation is required'
        ],
        correctAnswer: 0,
        explanation: 'Per SWGTOX / ANSI-ASB 036 standards, unambiguous MRM confirmation requires monitoring at least two transitions (Quantifier + Qualifier) with the ion ratio matching the reference standard within ±20%.',
        referenceTopic: '3.3 LC-MS/MS MRM Validation'
      }
    ],
    assignment: {
      id: 'm3-assign',
      title: 'Case Assignment 3: Microwave Metal Digestion, Modern SPE/SPME, TLC Rf & LC-MS/MS MRM Validation',
      caseScenario: 'On TLC screening of a basic SPE extract, the mobile phase solvent front migrated 15.0 cm while the suspected alkaloid spot migrated 9.0 cm. On UHPLC-MS/MS (MRM mode), the Certified Reference Standard exhibits a Qualifier-to-Quantifier Ion Ratio of 50%, and the case sample yields Quantifier Peak Area = 40,000 counts and Qualifier Peak Area = 19,200 counts. Simultaneously, liver tissue is prepared for trace Mercury and Arsenic quantification.',
      instructions: [
        'Calculate the TLC Retardation Factor (Rf = 9.0 / 15.0).',
        'Calculate the LC-MS/MS Qualifier-to-Quantifier Ion Ratio in percent [(19,200 / 40,000) × 100].',
        'Select the dedicated ambient-temperature AAS mode used for Mercury (Hg0) quantification after closed-vessel microwave digestion.',
        'Select the instrumental technique used to speciate water-soluble toxic inorganic anions (Nitrite, Nitrate, Fluoride, Chlorate, Bromate) in aqueous dialysates.'
      ],
      structuredFields: [
        {
          id: 'tlc_rf',
          label: 'Calculated TLC Retardation Factor (Rf = 9.0 cm / 15.0 cm)',
          type: 'number',
          placeholder: 'e.g., 0.6',
          expectedValue: 0.6,
          tolerance: 0.02,
          criterionLabel: 'Accurate TLC Rf calculation (9.0 / 15.0 = 0.60)',
          hint: 'Divide solute migration distance (9.0 cm) by solvent front distance (15.0 cm).'
        },
        {
          id: 'ion_ratio_pct',
          label: 'Calculated LC-MS/MS Qualifier-to-Quantifier Ion Ratio [(19,200 / 40,000) × 100] in %',
          type: 'number',
          unit: '%',
          placeholder: 'e.g., 48',
          expectedValue: 48,
          tolerance: 0.5,
          criterionLabel: 'Accurate LC-MS/MS Qualifier/Quantifier Ion Ratio calculation (48%)',
          hint: '(19,200 / 40,000) × 100 = 48%.'
        },
        {
          id: 'hg_aas_mode',
          label: 'Dedicated AAS Mode for Ambient-Temperature Mercury (Hg0) Quantification',
          type: 'select',
          options: [
            'Cold Vapour AAS (CV-AAS)',
            'Dry Ashing Flame Photometry',
            'Refractive Index HPLC',
            'Paper Electrophoresis'
          ],
          expectedValue: 'Cold Vapour AAS (CV-AAS)',
          criterionLabel: 'Correct selection of Cold Vapour AAS (CV-AAS)',
          hint: 'CV-AAS reduces Hg2+ with SnCl2 to elemental Hg0 vapor at room temperature (253.7 nm).'
        },
        {
          id: 'anion_ic_mode',
          label: 'Definitive Instrumental Technique for Speciating Toxic Inorganic Anions (NO2-, F-, ClO3-, BrO3-)',
          type: 'select',
          options: [
            'Ion Chromatography (IC) with Suppressed Conductivity Detection',
            'Dry Ashing at 600°C',
            'Flame Ionization GLC',
            'Simple Refractometry'
          ],
          expectedValue: 'Ion Chromatography (IC) with Suppressed Conductivity Detection',
          criterionLabel: 'Correct selection of Ion Chromatography (IC) for inorganic anions',
          hint: 'Ion Chromatography separates water-soluble inorganic anions with suppressed conductivity detection.'
        }
      ],
      writtenPrompt: 'Summarize why closed-vessel microwave digestion prevents Mercury/Arsenic loss compared to dry ashing, how SPE/SPME and TLC/HPLC/GLC separate organic toxins, and how LC-MS/MS MRM ion ratios (48%) confirm compound identity:',
      minWordCount: 30,
      requiredKeywords: [
        { groupLabel: 'Digestion & AAS/ICP-MS/IC', terms: ['microwave', 'volatile', 'mercury', 'arsenic', 'cv-aas', 'icp-ms', 'ion chromatography'] },
        { groupLabel: 'Chromatography & MRM Validation', terms: ['mrm', 'qualifier', 'quantifier', 'rf', '48%', 'hplc', 'glc', 'spe', 'spme'] }
      ],
      sampleFrameworkHint: 'Include TLC Rf = 0.60, MRM ion ratio = 48% (within ±20% of 50%), SPE/SPME extraction, and closed-vessel microwave digestion + CV-AAS/HG-AAS/ICP-MS/IC.'
    }
  },
  {
    id: 'tox-mod-4',
    moduleNumber: 4,
    code: 'FT2601-M4',
    title: 'Module 4: General Study & Analysis of Metallic Poisons, Inorganic Anions, Volatiles, Liquor Estimation, CNS Depressants & Pesticides',
    subtitle: 'Arsenic, Antimony, Lead, Barium, Copper, Mercury, Zinc & Thallium (living/dead sampling & lab tests); Nitrite, Nitrate, Sulphide, Sulphate, Phosphide, Chlorate, Borate, Bromide, Fluoride & Bromate; Barbiturates, Chloral Hydrate & Tranquilizers; Methanol, Ethanol, Acetone, Chloroform, Ether & Liquor Estimation in Breath/Blood/Urine; and Pesticides.',
    level: 'Intermediate',
    estimatedHours: '9 Hours',
    learningObjectives: [
      'Execute living and post-mortem sampling and classical/instrumental laboratory examination (Reinsch, Marsh, Gutzeit, Dithizone, AAS, ICP-MS) for Arsenic, Antimony, Lead, Barium, Copper, Mercury, Zinc, and Thallium.',
      'Analyze toxic inorganic anions: Nitrite, Nitrate, Sulphide, Sulphate, Phosphide, Chlorate, Borate, Bromide, Fluoride, Bromate, Oxalate, and Cyanide.',
      'Examine Barbiturates, Chloral Hydrate, and Tranquilizers (Benzodiazepines, Phenothiazines) alongside Volatile Poisons (Methanol, Ethanol, Acetone, Chloroform, Ether, CO, Cyanide) and perform quantitative Estimation of Liquor in Breath, Blood, and Urine (Widmark, Kozelka-Hine, Cavett, Breathalyzer, HS-GC-FID).',
      'Differentiate Organophosphate, Carbamate, Pyrethroid, Organochlorine, and Aluminium Phosphide (Celphos) pesticide poisonings.'
    ],
    interactiveToolType: 'widmark_calculator',
    sections: [
      {
        id: 'm4-s1',
        heading: '4.1 Metallic Poisons (As, Sb, Pb, Ba, Cu, Hg, Zn, Tl) & Toxic Inorganic Anions: Living/Dead Sampling & Lab Examination',
        badge: 'Metals & Anions',
        summary: 'Comprehensive study, sampling in living and dead cases, and laboratory chemical tests for all eight statutory metallic poisons and ten inorganic anions.',
        contentBlocks: [
          {
            subtitle: 'Metallic Poisons: Arsenic, Antimony, Lead, Barium, Copper, Mercury, Zinc & Thallium',
            body: 'Heavy metals exert systemic toxicity by binding covalently to nucleophilic sulfhydryl (-SH), carboxyl, and histidyl groups of cellular enzymes. Sampling in Living Cases requires whole blood (EDTA/heparin trace-element tube), 24-hour urine, vomitus/gastric lavage, and plucked scalp hair (with roots) + fingernail clippings (stored dry in paper envelopes). Sampling in Dead Cases requires Stomach & contents (Bottle I), Liver (500 g) + Kidneys (Bottle II), Femur shaft bone (100 g — crucial in exhumed/skeletonized cases for Arsenic, Lead, Antimony, Barium), plucked scalp hair (100–200 strands from posterior vertex with roots), intact fingernails/toenails, and grave soil + control soil:',
            keyPoints: [
              '1. Arsenic (As — White Arsenic As2O3, Copper Arsenite/Scheele’s Green, Paris Green): Inhibits lipoic acid dithiol in Pyruvate Dehydrogenase. Acute: Cholera-like rice-water stools with mucosal shreds, garlicky breath, intense thirst, "red velvety" congested gastric mucosa with petechial subendocardial flame hemorrhages in the left ventricle. Chronic (Arsenicosis): Raindrop hyperpigmentation, palmoplantar hyperkeratosis, glove-and-stocking sensory neuropathy, and transverse white Aldrich-Mees lines on nails. Note: Arsenic retards putrefaction in buried bodies! Antidote: BAL (Dimercaprol), Succimer (DMSA), DMPS.',
              '2. Antimony (Sb — Tartar Emetic [Potassium Antimonyl Tartrate], Antimony Trichloride "Butter of Antimony"): Closely mimics acute arsenic poisoning with profuse metallic taste, violent emesis, rice-water stools, pustular skin eruptions ("antimony pox"), and myocardial depression. Differentiated from Arsenic in the Marsh and Reinsch tests!',
              '3. Lead (Pb — Lead Acetate "Sugar of Lead", Lead Tetroxide "Sindoor", Lead Chromate in turmeric adulteration, Tetraethyl Lead): Inhibits δ-ALA Dehydratase and Ferrochelatase in heme synthesis plus pyrimidine 5’-nucleotidase. Chronic Plumbism: Microcytic hypochromic anemia with Coarse Basophilic Stippling of RBCs (punctate basophilia), Burtonian blue-black Lead Sulfide (PbS) line on gums, dry colic & obstinate constipation, Wrist Drop / Foot Drop (motor radial/peroneal nerve palsy), Lead Encephalopathy in children, and radiopaque metaphyseal "Lead Lines" on long-bone X-rays. Lab: Elevated blood Pb, urinary δ-ALA, and Free Erythrocyte Protoporphyrin (FEP/ZPP); Dithizone test (brick-red complex in CHCl3); Potassium Chromate (yellow PbCrO4 precipitate). Antidote: Calcium Disodium EDTA + BAL or Oral Succimer (DMSA).',
              '4. Barium (Ba — Soluble Barium Carbonate rodenticide, Barium Chloride, Barium Sulfide depilatory; note insoluble BaSO4 is non-toxic X-ray contrast): Soluble Ba2+ blocks sarcolemmal Potassium (K+) efflux channels while stimulating Na+/K+-ATPase, driving extracellular K+ into cells and causing profound, life-threatening Hypokalemia (< 2.0 mEq/L), violent abdominal cramps, hypertension, areflexic flaccid skeletal muscle paralysis ("Barium paralysis"), and ventricular fibrillation. Lab: Dilute H2SO4 precipitates heavy white Barium Sulfate (BaSO4) insoluble in nitric/hydrochloric acids; Sodium Rhodizonate gives a reddish-brown spot; Flame test gives Apple-Green flame. Antidote: Oral Magnesium Sulfate or Sodium Sulfate (precipitates unabsorbed Ba2+ in gut as insoluble BaSO4!) + Intravenous Potassium Chloride.',
              '5. Copper (Cu — Copper Sulfate "Blue Vitriol / Neelathotha", Copper Subacetate "Verdigris"): Acute ingestion causes metallic taste, blue-green vomitus and stools, severe hemorrhagic gastritis, intravascular hemolysis, hemoglobinuric acute tubular necrosis, and jaundice. Chronic toxicity (or Wilson’s disease): Kayser-Fleischer golden-brown corneal rings. Lab: Ammonium hydroxide (NH4OH) added to Cu2+ solution forms a pale blue precipitate dissolving in excess NH4OH to yield a deep Royal-Blue cuprammonium complex [Cu(NH3)4]2+ (distinguishing Copper from green Iron salts!); Potassium Ferrocyanide yields a chocolate-brown precipitate of Cu2[Fe(CN)6]. Antidote: D-Penicillamine, BAL, or Trientine; gastric lavage with 1% Potassium Ferrocyanide.',
              '6. Mercury (Hg — Elemental Hg0 vapor, Inorganic Mercuric Chloride HgCl2 "Corrosive Sublimate", Organic Methylmercury): Elemental vapor causes intention tremors ("Hatter’s shakes"), erethism, and gingivitis. Inorganic HgCl2 causes white/slate-grey coagulative necrosis of mouth and stomach followed by proximal renal tubular necrosis (anuria/uremia). Methylmercury causes Minamata disease (cerebellar ataxia, dysarthria, concentric tunnel vision). Lab: Reinsch test (silvery deposit on copper foil yielding shiny mercury globules on heating in a dry test tube); Stannous chloride reduces HgCl2 to white calomel (Hg2Cl2) turning grey-black (Hg0); Dithizone gives orange-yellow complex; CV-AAS at 253.7 nm.',
              '7. Zinc (Zn — Zinc Chloride corrosive flux, Zinc Sulfate "White Vitriol" emetic, Zinc Phosphide rodenticide, Zinc Oxide fumes): Inhalation of freshly oxidized ZnO fumes during welding/brass founding causes "Metal Fume Fever" ("Monday morning fever" / "Brass founder’s ague" — chills, fever, leukocytosis, metallic taste). Oral ZnCl2 causes severe corrosive gastroenteritis. Lab: Potassium Ferrocyanide gives a gelatinous white precipitate of Zinc Ferrocyanide (insoluble in dilute HCl); Hydrogen Sulfide in alkaline/acetate medium precipitates white Zinc Sulfide (ZnS — the ONLY common white sulfide!); Ammonium Mercuric Thiocyanate + trace Cobalt salt yields a sky-blue crystalline precipitate.',
              '8. Thallium (Tl — Thallium Sulfate rodenticide/depilatory): Monovalent Tl+ has an ionic radius almost identical to Potassium (K+), substituting for K+ in Na+/K+-ATPase and inhibiting riboflavin/sulfhydryl enzymes. Diagnostic Clinical Triad: Initial gastroenteritis → Painful ascending sensory-motor neuropathy ("Burning Feet Syndrome") → Characteristic Alopecia starting 14–21 days post-exposure (diffuse scalp hair loss + loss of the lateral outer two-thirds of the eyebrows while sparing the inner one-third) and black melanin-like pigment bands in plucked anagen hair roots! Flame test: Bright Green line (535 nm); Specific Antidote: Oral Prussian Blue (Potassium ferric hexacyanoferrate).'
            ]
          },
          {
            subtitle: 'Laboratory Examination of Metallic Poisons (Reinsch, Marsh & Gutzeit Tests) & Inorganic Anions',
            body: 'Three classical screening tests differentiate Arsenic, Antimony, Mercury, and Bismuth before AAS/ICP-MS confirmation, while ten statutory inorganic anions are examined from aqueous dialysates:',
            keyPoints: [
              '1. Reinsch Test (Heavy Metal Screen on Minced Viscera): Bright electrolytically pure Copper foil strip is boiled with minced viscera in ~10% Hydrochloric Acid (HCl) for 15–30 minutes. A dark deposit on the copper strip indicates: Steel-Grey/Black = Arsenic; Purplish-Violet/Dark Film = Antimony; Shiny Silvery Mirror = Mercury; Black = Bismuth or Silver. To differentiate them, the washed and dried copper strip is heated gently inside a narrow dry sublimation tube (Redfern tube) and the sublimate is examined microscopically: (a) Arsenic sublimes as glistening White Octahedral / Tetrahedral Crystals of Arsenic Trioxide (As2O3); (b) Antimony forms an amorphous white deposit (or needle-like crystals close to the heated spot); (c) Mercury condenses as minute, shiny, spherical Metallic Globules under the microscope!',
              '2. Marsh-Berzelius Test (Exquisitely Sensitive for Arsenic vs. Antimony): Nascent hydrogen (generated from Arsenic-free Zinc + dilute H2SO4 or electrolytically) reduces Arsenic and Antimony compounds into volatile Arsine (AsH3) and Stibine (SbH3) gases. Passing the dried gas through a heated hard-glass constriction decomposes it into a dark metallic mirror. Differential Confirmation of the Mirror: (a) Arsenic Mirror is deposited BEYOND (downstream of) the flame, is garlic-scented, and DISSOLVES readily in Sodium Hypochlorite (NaOCl / bleaching powder solution); (b) Antimony Mirror is deposited ON BOTH SIDES of (or before) the flame (since SbH3 decomposes at lower temperature), is insoluble in Sodium Hypochlorite (NaOCl), and dissolves in Ammonium Polysulfide to give an orange residue of Sb2S3!',
              '3. Gutzeit Test (Screening Test for Arsenic & Phosphide): Evolved Arsine gas (AsH3) passes through cotton moistened with Lead Acetate (which traps interfering H2S gas!) and contacts a filter paper disc impregnated with Mercuric Chloride (HgCl2) or Mercuric Bromide (HgBr2), producing a bright Yellow-to-Orange/Brown stain.',
              '4. General Study & Lab Examination of Toxic Inorganic Anions: (a) Nitrite (NO2-) & Nitrate (NO3-): Nitrites oxidize Fe2+ hemoglobin to chocolate-brown Methemoglobin (Fe3+; treated with IV Methylene Blue 1–2 mg/kg). Lab: Griess Ilosvay Test (Sulfanilic acid + alpha-naphthylamine → pink/red azo dye for Nitrite) and Diphenylamine Test / Brown Ring Test (FeSO4 + conc. H2SO4 → brown [Fe(H2O)5NO]2+ ring for Nitrate/Nitrite); (b) Sulphide (S2- / H2S "Sewer Gas"): Knock-down histotoxic asphyxiant smelling of rotten eggs; blackens Lead Acetate paper (forming black PbS) and turns Sodium Nitroprusside violet in alkaline medium; (c) Sulphate (SO42- / H2SO4 "Oil of Vitriol"): Causes black charring of stomach mucosa and clothing; forms white BaSO4 precipitate with Barium Chloride insoluble in conc. HNO3/HCl; (d) Phosphide (P3- / Aluminium & Zinc Phosphide): Liberates PH3 gas; blackens AgNO3 paper while Lead Acetate paper remains negative; (e) Chlorate (ClO3- — Potassium/Sodium Chlorate in match-heads & weedkillers): Powerful oxidizer causing acute intravascular hemolysis, chocolate-brown methemoglobinemia, and renal failure; turns Indigo Carmine blue solution yellow/colourless on adding sulfurous acid and gives blue colour with diphenylamine; (f) Borate (BO33- / Boric Acid & Borax): Causes "boiled lobster" erythematous rash and blue-green vomiting; Turmeric Paper Test turns reddish-brown on drying with HCl (turning greenish-black with NaOH), and burns with an Apple-Green edged flame when heated with Methanol + conc. H2SO4 (trimethyl borate); (g) Bromide (Br-) & Bromate (BrO3-): Chronic Bromide causes "Bromism" (acneiform rash, psychosis, ataxia); Acute Potassium Bromate (hair neutralizer) causes irreversible sensorineural deafness (ototoxicity) and acute renal failure; Lab: Fluorescein test (chlorine water liberates Br2 which converts yellow fluorescein paper into red Eosin!); (h) Fluoride (F- / Sodium Fluoride & Hydrofluoric Acid): Binds serum Ca2+ causing lethal hypocalcemia/tetany and inhibits enolase; Lab: Etches glass (SiF4) and bleaches pink Zirconium-Alizarin lake to yellow (Antidote: Calcium Gluconate).'
            ]
          }
        ],
        referenceTable: {
          caption: 'Table 4.1: Differential Laboratory Identification of Metallic Poisons & Toxic Anions',
          headers: ['Metal / Anion', 'Pathognomonic Clinical / Autopsy Hallmark', 'Classical Chemical / Microscopic Test', 'Specific Antidote / Confirmatory Instrument'],
          rows: [
            ['Arsenic (As)', 'Rice-water stools, Aldrich-Mees lines, Raindrop pigmentation, Red velvety stomach', 'Reinsch (Octahedral As2O3 crystals); Marsh Mirror soluble in NaOCl; Gutzeit (Yellow-brown on HgBr2)', 'BAL (Dimercaprol) / DMSA | HG-AAS & ICP-MS'],
            ['Antimony (Sb)', 'Metallic taste, choleraic purging, Antimony pox pustules', 'Reinsch (Amorphous sublimate); Marsh Mirror INSOLUBLE in NaOCl (orange with (NH4)2Sx)', 'BAL (Dimercaprol) | HG-AAS & ICP-MS'],
            ['Lead (Pb)', 'Burtonian blue gum line, Basophilic stippling, Wrist/foot drop, Colic', 'Dithizone (Brick-red in CHCl3); Potassium Chromate (Yellow PbCrO4)', 'CaNa2-EDTA + BAL / Succimer | GFAAS & ICP-MS'],
            ['Barium (Ba)', 'Profound Hypokalemia (<2 mEq/L), Flaccid Barium paralysis, Arrhythmia', 'Dilute H2SO4 (White BaSO4 insoluble in HNO3); Rhodizonate (Red-brown); Apple-green flame', 'Oral MgSO4 / Na2SO4 + IV K+ | FAAS & ICP-OES'],
            ['Copper (Cu)', 'Blue-green vomitus, Hemolysis, Kayser-Fleischer rings (chronic)', 'Excess NH4OH (Deep royal-blue cuprammonium); K4[Fe(CN)6] (Chocolate-brown ppt)', 'D-Penicillamine / BAL | FAAS & ICP-MS'],
            ['Mercury (Hg)', 'Hatter’s tremors, Erethism, Slate-grey corrosive stomach, Renal necrosis', 'Reinsch (Shiny spherical Hg globules on microscopy); Diphenylcarbazone (Violet-blue)', 'DMPS / DMSA / BAL | Cold Vapour AAS (CV-AAS)'],
            ['Zinc (Zn)', 'Metal Fume Fever (ZnO inhalation); Corrosive gastritis (ZnCl2)', 'H2S in acetate buffer (White ZnS precipitate); K4[Fe(CN)6] (White gelatinous ppt)', 'Supportive / CaNa2-EDTA | FAAS & ICP-MS'],
            ['Thallium (Tl)', 'Painful ascending neuropathy + Alopecia (spares inner 1/3 eyebrow) + Black hair root', 'Bright green flame (535 nm); Thallous iodide yellow precipitate', 'Oral Prussian Blue | GFAAS & ICP-MS'],
            ['Nitrite / Chlorate / Borate / Bromate', 'Methemoglobinemia (NO2-/ClO3-); Boiled lobster rash (Borate); Deafness/Renal failure (BrO3-)', 'Griess test (NO2-); Turmeric paper + Green methanol flame (Borate); Fluorescein→Eosin (Br)', 'Methylene Blue (for MetHb); Hemodialysis | Ion Chromatography (IC)']
          ]
        }
      },
      {
        id: 'm4-s2',
        heading: '4.2 Volatile Poisons (Methanol, Ethanol, Acetone, Chloroform, Ether), Liquor Estimation in Breath/Blood/Urine & Barbiturates, Chloral Hydrate & Tranquilizers',
        badge: 'Volatiles & Depressants',
        summary: 'Estimation of liquor in breath, blood, and urine (Widmark, Kozelka-Hine, Cavett, Breathalyzer, HS-GC-FID), volatile solvents, and Barbiturates/Chloral Hydrate/Tranquilizers.',
        contentBlocks: [
          {
            subtitle: 'Methanol, Ethanol, Acetone, Chloroform, Ether & Estimation of Liquor in Breath, Blood and Urine',
            body: 'Volatile organic poisons depress the central nervous system following the Meyer-Overton lipid solubility rule and undergo specific hepatic oxidation pathways:',
            formula: 'Widmark Formula: A (grams) = c (g/kg) × p (kg) × r   [r = 0.68 Males, 0.55 Females]   |   Blood : Alveolar Breath Ratio = 2100 : 1',
            keyPoints: [
              '1. Ethanol & Estimation of Liquor in Breath, Blood, and Urine: Absorbed from stomach (20%) and small intestine (80%), oxidized via hepatic ADH → Acetaldehyde → ALDH2 → Acetate at a zero-order elimination rate (β ≈ 15–20 mg/dL/hr). Statutory Indian Driving Limit (Sec. 185 MV Act): 30 mg per 100 mL of blood (0.03% BAC). Equilibrium Ratios: Urine-to-Blood (UAC:BAC) in post-absorptive phase ≈ 1.3 : 1; Vitreous-to-Blood ≈ 1.15 : 1; Deep Alveolar Breath-to-Blood ≈ 1 : 2100 (i.e., 2100 mL of alveolar air contains the same weight of ethanol as 1 mL of arterial blood at 34°C). Laboratory Methods for Liquor Estimation: (a) Chemical Oxidation (Kozelka-Hine Distillation & Cavett / Conway Microdiffusion Methods): Volatile ethanol is distilled (Kozelka-Hine uses HgCl2 + NaOH scrubber to trap interfering ketones/aldehydes!) or microdiffused into a standard solution of Acidified Potassium Dichromate (K2Cr2O7 + H2SO4), oxidizing ethanol to acetic acid while reducing Orange-Yellow Dichromate (Cr6+) to Bluish-Green Chromic ion (Cr3+); residual unreduced dichromate is titrated iodometrically with Sodium Thiosulfate (Na2S2O3) + Potassium Iodide (KI) using starch indicator; (b) Enzymatic ADH Method: Spectrophotometric measurement of NADH formation at 340 nm using yeast Alcohol Dehydrogenase + NAD+; (c) Breathalyzer Instrumentation: Classical Borkenstein Breathalyzer (K2Cr2O7 photometric reduction at 440 nm), Electrochemical Fuel Cell sensors (platinum electrode oxidizes ethanol to acetic acid generating current), and Infrared Spectrophotometry (3.4 µm and 9.5 µm C-O stretch to exclude acetone interference); (d) Confirmatory Gold Standard: Dual-column Headspace Gas Chromatography with Flame Ionization Detection (HS-GC-FID) using n-propanol or tert-butanol internal standard.',
              '2. Methanol (Methyl Alcohol / Wood Spirit — Indian Hooch Tragedies): Oxidized slowly (1/5th the rate of ethanol) by ADH to Formaldehyde and then by ALDH to Formic Acid (Formate), which inhibits retinal mitochondrial cytochrome oxidase causing optic papillitis, retinal edema, "snowfield blindness", bilateral necrosis of the Putamen on brain MRI/autopsy, and severe high-anion-gap metabolic acidosis. Chemical Tests: Schiff’s Reagent Test (after oxidizing methanol to formaldehyde with KMnO4/H3PO4, Schiff’s rosaniline reagent turns deep violet-magenta!) and Chromotropic Acid Test (violet colour with conc. H2SO4). Antidote: Fomepizole or Ethanol (has 10–20× higher affinity for ADH, competitively blocking methanol oxidation) + Folinic acid + Hemodialysis.',
              '3. Acetone, Chloroform & Diethyl Ether: (a) Acetone (Isopropanol metabolite / Diabetic Ketoacidosis / Solvent): Fruity nail-polish odor; gives positive Rothera’s Test (Sodium nitroprusside + ammonium sulfate + ammonia → permanganate purple ring) and Legal’s Test (ruby red) and Iodoform test (yellow hexagonal CHI3 crystals); (b) Chloroform (CHCl3 — Trichloromethane): Heavy non-flammable sweet-smelling volatile anesthetic (lethal dose ~30 mL); causes sudden cardiac arrest in early induction via catecholamine sensitization of myocardium (ventricular fibrillation) and delayed centrilobular hepatic & renal fatty degeneration. Chemical Tests: Fujiwara Test (heated with Pyridine + 20% NaOH → bright crimson-red/pink upper pyridine layer; shared with Chloral Hydrate and Trichloroethylene!) and Phenyl Isocyanide (Carbylamine) Test (heated with aniline + alcoholic KOH → offensive nauseating odor of phenyl isocyanide); (c) Diethyl Ether (C2H5-O-C2H5): Highly volatile, extremely flammable anesthetic (boils at 34.6°C) forming explosive peroxides with air; causes strong ether odor in brain and lungs at autopsy.',
              '4. Carbon Monoxide (CO) & Cyanide (HCN): CO binds Fe2+ hemoglobin (240× affinity) forming cherry-red Carboxyhemoglobin (Kunkel’s tannic acid test gives carmine-red precipitate vs. grey-brown in normal blood; Hoppe-Seyler NaOH test stays pink; CO-Oximetry). Cyanide inhibits Fe3+ Cytochrome c Oxidase causing histotoxic hypoxia, bitter almond odor, and brick-red lividity (Prussian Blue test, Lee-Jones test, Pyridine-Pyrazolone test).'
            ]
          },
          {
            subtitle: 'Barbiturates, Chloral Hydrate & Tranquilizers (Benzodiazepines, Phenothiazines & Z-Drugs)',
            body: 'Synthetic CNS depressants and tranquilizers are major agents in suicidal overdoses, hospital toxicity, and Drug-Facilitated Crimes (stupefaction):',
            keyPoints: [
              '1. Barbiturates (Derivatives of Barbituric Acid — Malonylurea, pKa 7.2–8.0): Classified by duration of action and lipid solubility: Ultra-Short Acting (Thiopental, Methohexital — IV anesthesia, t1/2 redistribution in minutes), Short-to-Intermediate Acting (Pentobarbital, Secobarbital, Amobarbital — onset 15–30 min, duration 3–6 hr; high abuse/fatal overdose risk), and Long-Acting (Phenobarbital, Barbital — onset 1 hr, duration 12–24 hr; excreted ~25–30% unchanged in urine, treated by Urinary Alkalinization with IV Sodium Bicarbonate to pH 7.5–8.0 for ion-trapping!). Mechanism: Bind GABAA receptor Cl- channels and prolong the DURATION of chloride channel opening (and directly open channels at high doses, explaining why barbiturates have a much narrower therapeutic index and deeper respiratory depression than benzodiazepines). Autopsy Hallmarks: Coma, "Barbiturate Blisters" (bullous lesions on pressure points/interdigital clefts), and "Barbiturate Automatism" (accidental repetitive dosing due to drug-induced anterograde amnesia). Lab Identification: Extracted in Acid-Ether fraction (pH 2, back-extracted into 0.45 N NaOH); Dille-Koppanyi Test (Cobalt acetate + isopropylamine in methanol → reddish-violet/purple colour); Zwikker’s Test (Copper sulfate + pyridine → violet/blue precipitate); Koppanyi-Zwikker & Mercurous Nitrate TLC sprays; Differential UV Spectrophotometry (240 nm at pH 10 shifting to 255 nm at pH 13).',
              '2. Chloral Hydrate ("Knockout Drops" / "Mickey Finn" when mixed with alcohol — CCl3-CH(OH)2): Rapidly reduced in vivo by hepatic Alcohol Dehydrogenase into its active hypnotic metabolite Trichloroethanol (CCl3-CH2OH) and oxidized to inactive Trichloroacetic Acid (TCA). When co-ingested with Ethanol, ethanol elevates NADH (accelerating reduction of chloral hydrate to active trichloroethanol) while competitively blocking trichloroethanol oxidation, producing profound synergistic CNS depression and stupor! Lab Identification: Extracted by acidic steam distillation or ether; Fujiwara Pyridine-NaOH Test (bright crimson-red pyridine layer due to trichloromethyl -CCl3 group); reduces Fehling’s and Benedict’s solutions (false-positive urine sugar test!).',
              '3. Tranquilizers — Major Tranquilizers (Antipsychotic Phenothiazines/Butyrophenones) vs. Minor Tranquilizers (Anxiolytic Benzodiazepines & Z-Drugs): (a) Minor Tranquilizers — Benzodiazepines (Diazepam, Lorazepam, Alprazolam, Clonazepam, Nitrazepam, Flunitrazepam, Midazolam): Allosterically bind between alpha and gamma subunits of GABAA receptors to increase the FREQUENCY of Cl- channel opening (ceiling effect when taken alone, but lethal respiratory synergism with Ethanol or Opioids; specific antidote: Flumazenil). Lab Identification: Extracted in Weakly Basic fraction (pH 9–10); Acid Hydrolysis to Benzophenones followed by Bratton-Marshall Diazotization Reaction (NaNO2 + HCl + N-(1-naphthyl)ethylenediamine → purple-magenta azo dye) or direct LC-MS/MS;Zimmermann Test (m-dinitrobenzene + KOH → reddish-purple); (b) Major Tranquilizers — Phenothiazines (Chlorpromazine, Promethazine, Thioridazine, Trifluoperazine) & Haloperidol: Block postsynaptic Dopamine D2, alpha-1 adrenergic, and muscarinic receptors, causing extrapyramidal dystonia, hypothermia, hypotension, QT prolongation, and Neuroleptic Malignant Syndrome (NMS). Lab Identification: FPN Reagent (Ferric chloride + Perchloric acid + Nitric acid — Forrest Urine Colour Test yielding pink, violet, or blue colours with phenothiazines).'
            ]
          }
        ]
      },
      {
        id: 'm4-s3',
        heading: '4.3 Agricultural Pesticide Poisoning: Organophosphates, Carbamates, Pyrethroids, Organochlorines & Aluminium Phosphide',
        badge: 'Agrochemical Toxicology',
        summary: 'Mechanisms, aging kinetics, clinical/autopsy pathology, chemical spot tests, and analytical confirmation of the five major pesticide classes.',
        contentBlocks: [
          {
            subtitle: 'Anticholinesterase Insecticides (Organophosphates vs. Carbamates), Organochlorines, Pyrethroids & Aluminium Phosphide',
            body: 'Agrochemical pesticides account for the highest volume of forensic viscera submissions in Indian FSLs:',
            keyPoints: [
              '1. Organophosphates (OPs — Phosphorothioates: Parathion, Methyl Parathion, Malathion, Chlorpyrifos, Diazinon, Quinalphos; Phosphates: Monocrotophos, Dichlorvos/DDVP, Phosphamidon): Irreversibly phosphorylate the serine hydroxyl (-OH) group at the esteratic site of Acetylcholinesterase (AChE) and plasma Butyrylcholinesterase. Following phosphorylation, spontaneous loss of an alkyl/alkoxy group from the phosphorus atom ("Aging") creates a permanent negatively charged complex resistant to oxime reactivation. Clinical Phases: (a) Acute Cholinergic Crisis (SLUDGE/DUMBBELS + nicotinic fasciculations + kerosene/garlic odor + blood-tinged froth at mouth/nostrils), (b) Intermediate Syndrome (24–96 hours post-ingestion — cranial nerve palsies, neck flexor & proximal limb weakness, and diaphragmatic paralysis), and (c) OP-Induced Delayed Polyneuropathy (OPIDN, 1–3 weeks later due to Neuropathy Target Esterase NTE inhibition). Antidote: Atropine Sulfate IV (titrated to dry bronchial secretions) + Pralidoxime (2-PAM, before aging). Lab Tests: Ellman’s Cholinesterase inhibition assay (>50–70% depression), Palladium Chloride / Bromophenol Blue-AgNO3 TLC sprays, p-Nitrophenol test (yellow in alkali for Parathion), and GC-FPD / GC-NPD / LC-MS/MS.',
              '2. Carbamates (Carbaryl/Sevin, Propoxur/Baygon, Carbofuran/Furadan, Aldicarb/Temik, Methomyl): Esters of N-methylcarbamic acid that carbamylate the serine -OH of AChE REVERSIBLY. The carbamylated enzyme undergoes spontaneous hydrolysis (decarbamylation) within 6–24 hours and DOES NOT AGE. Poorly penetrates the blood-brain barrier compared to OPs. Antidote: Atropine Sulfate alone (Pralidoxime is generally not required and is contraindicated in pure Carbaryl poisoning). Lab Test: Alkaline hydrolysis liberates 1-naphthol (from Carbaryl), which couples with diazotized p-nitroaniline to yield a purple-blue dye; HPTLC & LC-MS/MS.',
              '3. Organochlorines (DDT, Lindane/Gamma-HCH/BHC, Endosulfan, Aldrin, Dieldrin, Chlordane): Highly lipophilic, environmentally persistent chlorinated hydrocarbons (stored in adipose tissue). DDT opens axonal voltage-gated Na+ channels (delaying closure and causing repetitive firing, perioral paresthesia, tremors, and convulsions), while Cyclodienes (Endosulfan, Aldrin, Dieldrin) and Lindane non-competitively block GABAA chloride channels (causing sudden violent generalized status epilepticus without prodromal cholinergic signs!). Lab Test: Extracted in hexane/ether; Diphenylamine + ZnCl2 test, Fujiwara-type dechlorination, and Gas Chromatography with Electron Capture Detection (GC-ECD) or GC-MS/MS.',
              '4. Pyrethroids (Type I Non-Cyano: Permethrin, Allethrin → T-Syndrome fine tremors; Type II Alpha-Cyano: Cypermethrin, Deltamethrin, Fenvalerate → CS-Syndrome choreoathetosis, salivation, facial paresthesia, seizures): Prolong opening of voltage-gated Na+ channels; rapidly hydrolyzed in humans by hepatic carboxylesterases (making systemic human fatality lower than OPs, though severe neurotoxicity occurs with concentrated emulsifiable concentrates).',
              '5. Aluminium Phosphide (AlP / Celphos — Solid Grain Fumigant Tablets): Reacts with moisture or gastric HCl to liberate lethal Phosphine gas (AlP + 3H2O → Al(OH)3 + PH3↑). PH3 inhibits mitochondrial Cytochrome c Oxidase (Complex IV) and induces massive oxidative myocardial necrosis, refractory cardiogenic shock, arrhythmias, and severe metabolic acidosis with a characteristic decaying-fish / garlicky breath odor. Bedside & Autopsy Screening Test: Filter paper strip impregnated with 0.1 N Silver Nitrate (AgNO3) turns black upon exposure to gastric headspace/breath due to reduction to metallic silver/silver phosphide, while a parallel strip impregnated with Lead Acetate remains colourless (excluding putrefactive Hydrogen Sulfide H2S, which blackens both AgNO3 and Lead Acetate!). Management: Never use water/saline for gastric lavage (water accelerates PH3 release!); use Coconut Oil or Liquid Paraffin + 1:10,000 Potassium Permanganate (oxidizes PH3 to phosphate) + IV Magnesium Sulfate.'
            ]
          }
        ],
        referenceTable: {
          caption: 'Table 4.2: Comparative Forensic Matrix of Major Pesticide Classes & CNS Depressants',
          headers: ['Class / Agent', 'Primary Molecular Target', 'Characteristic Clinical / Autopsy Sign', 'Diagnostic Chemical Test & Antidote'],
          rows: [
            ['Organophosphates (Parathion, Chlorpyrifos)', 'Irreversible Phosphorylation of AChE (Ages)', 'Miosis, bronchorrhea, fasciculations, kerosene/garlic odor', 'p-Nitrophenol / PdCl2 TLC / GC-FPD | Atropine + Pralidoxime'],
            ['Carbamates (Carbaryl, Carbofuran)', 'Reversible Carbamylation of AChE (No Aging)', 'Cholinergic SLUDGE resolving in 24h; minimal CNS signs', '1-Naphthol Diazonium coupling / LC-MS/MS | Atropine alone'],
            ['Organochlorines (Endosulfan, DDT, Lindane)', 'GABAA Cl- Channel Block (Endosulfan) / Na+ Channel (DDT)', 'Sudden status epilepticus convulsions, hyperthermia (no miosis)', 'GC-ECD (Electron Capture Detector) | Diazepam / Phenobarbital'],
            ['Aluminium Phosphide (Celphos)', 'Cytochrome c Oxidase inhibition via PH3 gas', 'Decaying fish odor, refractory myocarditis/shock', 'AgNO3 paper black + Lead Acetate paper negative | Coconut oil lavage'],
            ['Barbiturates (Phenobarbital, Secobarbital)', 'Prolongs GABAA Cl- channel opening duration', 'Coma, hypothermia, Barbiturate blisters, automatism', 'Dille-Koppanyi (Violet) + Zwikker test + UV pH-shift | Urinary alkalinization'],
            ['Chloral Hydrate ("Mickey Finn")', 'Reduced by ADH to Trichloroethanol (GABAA agonist)', 'Pear-like odor, rapid stupor/synergism with ethanol', 'Fujiwara Pyridine-NaOH (Crimson-red) + Reduces Fehling’s | Supportive'],
            ['Benzodiazepines (Alprazolam, Lorazepam)', 'Increases GABAA Cl- channel opening frequency', 'Anterograde amnesia, ataxia, stupor (DFC stupefaction)', 'Bratton-Marshall (on benzophenone) / Zimmermann / LC-MS/MS | Flumazenil']
          ]
        }
      }
    ],
    quiz: [
      {
        id: 'm4-q1',
        question: 'In the Reinsch Test (boiling minced viscera with pure copper foil in dilute HCl) followed by gentle heating of the stained copper strip inside a dry glass sublimation tube, what microscopic finding confirms Arsenic versus Mercury?',
        options: [
          'Arsenic sublimes as glistening white octahedral crystals of Arsenic Trioxide (As2O3), whereas Mercury condenses as minute, shiny spherical metallic globules',
          'Arsenic forms liquid droplets whereas Mercury forms blue hexagonal crystals',
          'Both Arsenic and Mercury dissolve the glass tube',
          'Reinsch test only detects Barium and Zinc'
        ],
        correctAnswer: 0,
        explanation: 'Under the microscope, the Reinsch sublimate of Arsenic consists of characteristic octahedral crystals of As2O3, Antimony gives an amorphous sublimate, and Mercury forms shiny spherical metallic globules.',
        referenceTopic: '4.1 Metallic Poisons (Reinsch Test)'
      },
      {
        id: 'm4-q2',
        question: 'In the Marsh-Berzelius Test, both Arsenic (Arsine, AsH3) and Antimony (Stibine, SbH3) decompose on heating to deposit a dark metallic mirror inside the glass tube. Which chemical reagent readily DISSOLVES the Arsenic mirror while leaving the Antimony mirror insoluble?',
        options: [
          'Sodium Hypochlorite (NaOCl / bleaching solution)',
          'Distilled Water',
          'Liquid Paraffin',
          'Barium Sulfate'
        ],
        correctAnswer: 0,
        explanation: 'The Arsenic mirror deposits downstream of the flame and dissolves readily in Sodium Hypochlorite (NaOCl), whereas the Antimony mirror deposits on both sides of the flame and is insoluble in NaOCl (dissolving instead in ammonium polysulfide).',
        referenceTopic: '4.1 Metallic Poisons (Marsh Test)'
      },
      {
        id: 'm4-q3',
        question: 'Soluble Barium salts (such as Barium Carbonate rodenticide or Barium Chloride) cause lethal flaccid skeletal muscle paralysis ("Barium paralysis") and cardiac arrhythmias by blocking sarcolemmal K+ efflux channels and inducing profound hypokalemia. What is the specific oral chemical antidote used in gastric lavage to precipitate unabsorbed Ba2+ in the gut?',
        options: [
          'Magnesium Sulfate (MgSO4) or Sodium Sulfate (Na2SO4), which converts soluble Ba2+ into insoluble, non-toxic Barium Sulfate (BaSO4) precipitate (accompanied by IV Potassium supplementation)',
          'Sodium Chloride solution',
          'Activated charcoal alone',
          'Atropine sulfate'
        ],
        correctAnswer: 0,
        explanation: 'Oral Magnesium Sulfate or Sodium Sulfate reacts with soluble Ba2+ ions in the gastrointestinal lumen to precipitate completely insoluble Barium Sulfate (BaSO4), halting systemic absorption.',
        referenceTopic: '4.1 Metallic Poisons (Barium)'
      },
      {
        id: 'm4-q4',
        question: 'Which toxic inorganic anion gives an Apple-Green edged flame when heated with Methanol and concentrated H2SO4 (forming volatile trimethyl borate), turns HCl-acidified Turmeric paper reddish-brown (turning greenish-black on adding NaOH), and causes a "boiled-lobster" erythematous skin rash?',
        options: [
          'Borate / Boric Acid (BO33-)',
          'Sulphate (SO42-)',
          'Nitrite (NO2-)',
          'Bromide (Br-)'
        ],
        correctAnswer: 0,
        explanation: 'Borates/Boric acid produce a boiled-lobster exfoliative rash, turn turmeric paper reddish-brown (greenish-black with alkali), and burn with a bright green-edged flame on heating with methanol and H2SO4.',
        referenceTopic: '4.1 Toxic Inorganic Anions (Borate)'
      },
      {
        id: 'm4-q5',
        question: 'In the classical Kozelka-Hine distillation or Cavett/Conway microdiffusion method for Estimation of Liquor (Ethanol) in blood or urine, ethanol vapor reacts with Acidified Potassium Dichromate (K2Cr2O7 in H2SO4). What colour change confirms reduction of Cr6+ to Cr3+?',
        options: [
          'Orange-Yellow (Cr6+) turns to Bluish-Green (Cr3+)',
          'Colourless turns to Bright Purple',
          'Deep Blue turns to Brick Red',
          'Black turns to White'
        ],
        correctAnswer: 0,
        explanation: 'Ethanol is oxidized to acetic acid while reducing orange-yellow hexavalent dichromate (Cr2O72-) to bluish-green trivalent chromic ions (Cr3+).',
        referenceTopic: '4.2 Estimation of Liquor in Breath, Blood & Urine'
      },
      {
        id: 'm4-q6',
        question: 'What is the internationally accepted blood-to-deep-alveolar-breath partition ratio at 34°C used to calibrate evidential Breath Alcohol Analyzers (Breathalyzers), and what is the statutory BAC limit under Section 185 of the Indian Motor Vehicles Act?',
        options: [
          '2100 : 1 blood-to-breath ratio; 30 mg of alcohol per 100 mL of blood (0.03% BAC)',
          '100 : 1 blood-to-breath ratio; 100 mg per 100 mL of blood',
          '10,000 : 1 blood-to-breath ratio; 80 mg per 100 mL of blood',
          '1 : 1 blood-to-breath ratio; 5 mg per 100 mL of blood'
        ],
        correctAnswer: 0,
        explanation: '2100 mL of deep alveolar breath contains the same mass of ethanol as 1 mL of arterial blood (2100:1 ratio). Under Sec. 185 MV Act (India), the statutory limit is 30 mg/100 mL blood.',
        referenceTopic: '4.2 Estimation of Liquor in Breath, Blood & Urine'
      },
      {
        id: 'm4-q7',
        question: 'Which chemical test produces a bright crimson-red/pink colour in the upper Pyridine layer when heated with 20% NaOH and Pyridine, identifying compounds containing a trichloromethyl (-CCl3) group such as Chloroform, Chloral Hydrate, and Trichloroethylene?',
        options: [
          'Fujiwara Test',
          'Dille-Koppanyi Test',
          'Griess-Ilosvay Test',
          'Vitali-Morin Test'
        ],
        correctAnswer: 0,
        explanation: 'The Fujiwara reaction (heating with pyridine and strong aqueous NaOH) yields a characteristic crimson-red colour in the pyridine layer for polyhalogenated compounds (Chloroform, Chloral hydrate, Trichloroacetic acid).',
        referenceTopic: '4.2 Chloroform & Chloral Hydrate'
      },
      {
        id: 'm4-q8',
        question: 'How do Barbiturates (e.g., Phenobarbital, Secobarbital) identified by the Dille-Koppanyi (violet) and Zwikker tests differ pharmacodynamically from Benzodiazepines (minor tranquilizers like Diazepam and Alprazolam) at the GABAA chloride channel?',
        options: [
          'Barbiturates prolong the DURATION of GABAA Cl- channel opening (and directly open channels at high doses), whereas Benzodiazepines increase the FREQUENCY of Cl- channel opening',
          'Barbiturates block dopamine D2 receptors whereas Benzodiazepines inhibit acetylcholinesterase',
          'Barbiturates only act on skeletal muscle nicotinic receptors',
          'Benzodiazepines are strong mineral acids'
        ],
        correctAnswer: 0,
        explanation: 'Barbiturates increase the duration of chloride channel opening (and exhibit direct agonist opening at high concentration, explaining their high lethality), while benzodiazepines increase the frequency of opening in response to endogenous GABA.',
        referenceTopic: '4.2 Barbiturates & Tranquilizers'
      },
      {
        id: 'm4-q9',
        question: 'In the bedside/autopsy Silver Nitrate (AgNO3) filter-paper test for Aluminium Phosphide (Celphos) poisoning, why must a second paper strip impregnated with Lead Acetate be tested in parallel?',
        options: [
          'Putrefactive Hydrogen Sulfide (H2S) blackens BOTH AgNO3 and Lead Acetate papers, whereas Phosphine (PH3) blackens AgNO3 paper but leaves Lead Acetate paper negative—ruling out false positives from putrefaction',
          'Lead acetate converts phosphine into ethanol',
          'Lead acetate measures blood pH',
          'Silver nitrate only reacts with organochlorines'
        ],
        correctAnswer: 0,
        explanation: 'Both PH3 and putrefactive H2S blacken AgNO3 paper, but only H2S forms black PbS on Lead Acetate paper. Thus AgNO3 (+) and Lead Acetate (-) confirms Phosphine.',
        referenceTopic: '4.3 Aluminium Phosphide'
      },
      {
        id: 'm4-q10',
        question: 'How does an Organochlorine insecticide like Endosulfan or Lindane trigger acute status epilepticus convulsions, and why is Atropine ineffective in pure Organochlorine poisoning?',
        options: [
          'Endosulfan and Lindane non-competitively block neuronal GABAA chloride channels (whereas DDT prolongs Na+ channel opening) without inhibiting Acetylcholinesterase; seizures are controlled with Diazepam/Barbiturates rather than Atropine',
          'Organochlorines phosphorylate acetylcholinesterase identically to Parathion',
          'Organochlorines chelate serum potassium',
          'Organochlorines convert hemoglobin to carboxyhemoglobin'
        ],
        correctAnswer: 0,
        explanation: 'Cyclodiene organochlorines (Endosulfan, Aldrin, Dieldrin) and Lindane are GABAA receptor antagonists causing central convulsions without cholinergic excess; treatment relies on GABAergic anticonvulsants (Diazepam/Phenobarbital).',
        referenceTopic: '4.3 Organochlorine Pesticides'
      }
    ],
    assignment: {
      id: 'm4-assign',
      title: 'Case Assignment 4 (Even Module): Unit III Widmark Liquor Estimation, Metallic Poison Differentiation & Inorganic Anion Analysis',
      caseScenario: 'Case Part A (Traffic & Liquor Investigation): A 75 kg male driver (Widmark factor r = 0.68) is involved in a fatal highway collision. Venous blood drawn 3 hours after the crash shows a Blood Alcohol Concentration (c) of 120 mg/100 mL (1.2 g/kg) by HS-GC-FID and Kozelka-Hine dichromate titration. His zero-order elimination rate (β) is 15 mg/100 mL/hr. Case Part B (Unit III Metallic & Inorganic Anion Lab Case): The FSL receives viscera from two fatalities—Victim 1 shows white octahedral crystals in the Reinsch sublimate and a black Marsh deposit; Victim 2 ingested grain fumigant tablets that blackened Silver Nitrate paper while leaving Lead Acetate paper colourless.',
      instructions: [
        'Calculate the total grams of pure ethanol (A) present in the 75 kg male driver (r = 0.68) at the time of blood draw when c = 1.2 g/kg [A = 1.2 × 75 × 0.68].',
        'Perform Retrograde Extrapolation: Calculate the driver’s BAC (in mg/100 mL) at the exact time of the crash 3 hours earlier [C0 = 120 + (15 × 3)].',
        'Select the chemical confirmation test that differentiates an Arsenic (As) Marsh mirror from an Antimony (Sb) Marsh mirror in Victim 1.',
        'Identify the lethal gas liberated in Victim 2 that blackened the AgNO3 filter paper while leaving Lead Acetate paper negative.',
        'Draft a comprehensive Forensic Laboratory Opinion covering: (1) The driver’s crash-time BAC (165 mg/100 mL) relative to Section 185 MV Act (30 mg/100 mL) and how liquor is estimated in breath/blood/urine (Henry’s 2100:1, Kozelka-Hine/Cavett dichromate reduction & HS-GC-FID), (2) How the Reinsch octahedral As2O3 crystals and NaOCl-soluble Marsh mirror differentiate Arsenic from Antimony/Mercury, and (3) How Phosphine (PH3) is confirmed in Aluminium Phosphide poisoning.'
      ],
      structuredFields: [
        {
          id: 'widmark_grams',
          label: 'Total Pure Ethanol in Body at Blood Draw: A = c(1.2 g/kg) × p(75 kg) × r(0.68) [in grams]',
          type: 'number',
          unit: 'g',
          placeholder: 'e.g., 61.2',
          expectedValue: 61.2,
          tolerance: 0.2,
          criterionLabel: 'Accurate Widmark ethanol mass calculation (1.2 × 75 × 0.68 = 61.2 g)',
          hint: 'Multiply 1.2 × 75 × 0.68 = 61.2 grams.'
        },
        {
          id: 'retrograde_bac',
          label: 'Retrograde Extrapolated BAC at Time of Crash (3 hrs prior at β = 15 mg/dL/hr) [in mg/100 mL]',
          type: 'number',
          unit: 'mg/100mL',
          placeholder: 'e.g., 165',
          expectedValue: 165,
          tolerance: 0.5,
          criterionLabel: 'Accurate retrograde BAC extrapolation (120 + (3 × 15) = 165 mg/100 mL)',
          hint: 'C0 = Ct + (β × t) = 120 + (15 × 3) = 165 mg/100 mL.'
        },
        {
          id: 'marsh_arsenic_diff',
          label: 'Chemical Test Differentiating Arsenic (As) vs. Antimony (Sb) Deposit in Marsh’s Test (Victim 1)',
          type: 'select',
          options: [
            'Arsenic mirror dissolves readily in Sodium Hypochlorite (NaOCl), whereas Antimony mirror is insoluble in NaOCl',
            'Antimony mirror dissolves in distilled water, whereas Arsenic does not',
            'Arsenic mirror turns bright blue with Fujiwara reagent',
            'Arsenic mirror forms purple crystals with Zwikker reagent'
          ],
          expectedValue: 'Arsenic mirror dissolves readily in Sodium Hypochlorite (NaOCl), whereas Antimony mirror is insoluble in NaOCl',
          criterionLabel: 'Correct differentiation of Arsenic vs. Antimony Marsh mirror via Sodium Hypochlorite (NaOCl)',
          hint: 'In Marsh’s test, the hair-pin arsenic mirror dissolves in Sodium Hypochlorite (NaOCl), whereas the antimony mirror does not.'
        },
        {
          id: 'celphos_gas',
          label: 'Lethal Gas Liberated by Aluminium Phosphide in Victim 2 (AgNO3 Positive, Lead Acetate Negative)',
          type: 'select',
          options: [
            'Phosphine Gas (PH3)',
            'Arsine Gas (AsH3)',
            'Carbon Monoxide (CO)',
            'Phosgene Gas (COCl2)'
          ],
          expectedValue: 'Phosphine Gas (PH3)',
          criterionLabel: 'Correct identification of Phosphine gas (PH3)',
          hint: 'Aluminium phosphide reacts with moisture/HCl to release Phosphine (PH3), which blackens AgNO3 paper without blackening Lead Acetate paper.'
        }
      ],
      writtenPrompt: 'Draft your Forensic Toxicology Report addressing: (1) Widmark retrograde BAC (165 mg/100 mL vs. 30 mg/100 mL Sec. 185 MV Act limit) and liquor estimation methods (Henry’s 2100:1, Kozelka-Hine/Cavett dichromate reduction & HS-GC-FID), (2) Reinsch & Marsh test differentiation of Arsenic vs. Antimony/Mercury, and (3) Silver Nitrate + Lead Acetate + Ammonium Molybdate confirmation of Phosphine (PH3):',
      minWordCount: 35,
      requiredKeywords: [
        { groupLabel: 'Widmark & Liquor Estimation (Sec. 185 MV Act)', terms: ['widmark', '165', '30 mg', '185', 'dichromate', 'hs-gc', 'kozelka', 'cavett', '2100'] },
        { groupLabel: 'Unit III Reinsch & Marsh Metallic Differentiation', terms: ['reinsch', 'marsh', 'arsenic', 'octahedral', 'hypochlorite', 'naocl', 'antimony'] },
        { groupLabel: 'Unit III Phosphine & Inorganic Anion Confirmation', terms: ['phosphine', 'ph3', 'silver nitrate', 'lead acetate', 'h2s', 'molybdate'] }
      ],
      sampleFrameworkHint: 'State that 165 mg/100 mL is 5.5× the 30 mg/100 mL statutory limit under Sec 185 MV Act (estimated via HS-GC-FID and Kozelka-Hine/Cavett dichromate oxidation), explain how Reinsch octahedral As2O3 crystals and NaOCl-soluble Marsh mirror confirm Arsenic over Antimony, and explain how AgNO3 (+) with Lead Acetate (-) and Ammonium Molybdate confirm Phosphine (PH3) over putrefactive H2S.'
    }
  },
  {
    id: 'tox-mod-5',
    moduleNumber: 5,
    code: 'FT2601-M5',
    title: 'Module 5: Narcotic Drugs & Psychotropic Substances (NDPS), Sports Doping Analysis & Alkaloid Characterization',
    subtitle: 'NDPS Act classification & sampling; Cannabis, Heroin, Cocaine, Amphetamine, LSD, Phencyclidine (PCP), MDMA & Peyote; Alkaloid isolation, general reagents & profiles (Hydromorphone, Methadone, Mescaline, PCP, Atropine, Cocaine); and Sports Doping Analysis (WADA, GC-C-IRMS, ABP).',
    level: 'Advanced',
    estimatedHours: '9 Hours',
    learningObjectives: [
      'Apply the NDPS Act 1985 statutory classification, representative seizure sampling protocols (Standing Order 1/88 & 1/89), and Small vs. Commercial Quantity thresholds.',
      'Analyze specific NDPS drug types: Cannabis (Bhang, Ganja, Charas), Heroin (6-MAM), Cocaine (Cocaethylene), Amphetamine, LSD, Phencyclidine (PCP), MDMA, and Peyote (Mescaline).',
      'Classify Alkaloids, execute general alkaloid precipitation/colour characterization tests (Dragendorff, Mayer, Wagner, Hager, Marquis, Mandelin, Vitali-Morin), and profile Hydromorphone, Methadone, Mescaline, Phencyclidine, Atropine, and Cocaine.',
      'Examine Drugs of Abuse in Sports and their WADA-accredited laboratory methods of analysis (Anabolic Steroids via GC-C-IRMS T/E ratio, EPO via SAR-PAGE/IEF, Diuretics/Masking Agents, Stimulants, and the Athlete Biological Passport).'
    ],
    interactiveToolType: 'ndps_schedule_checker',
    sections: [
      {
        id: 'm5-s1',
        heading: '5.1 NDPS Act 1985: Classification, Representative Sampling & Specific Drugs (Cannabis, Heroin, Cocaine, Amphetamine, LSD, PCP, MDMA, Peyote)',
        badge: 'NDPS Syllabus',
        summary: 'Statutory classification of Narcotic Drugs vs. Psychotropic Substances, seizure sampling SOPs, and forensic chemistry of the eight core NDPS drugs.',
        contentBlocks: [
          {
            subtitle: 'NDPS Introduction, Classification & Representative Field Sampling Protocol',
            body: 'The Narcotic Drugs and Psychotropic Substances (NDPS) Act, 1985 (aligned with the 1961 UN Single Convention on Narcotic Drugs, the 1971 Convention on Psychotropic Substances, and the 1988 Convention against Illicit Traffic) divides controlled substances into three statutory categories: (1) Narcotic Drugs (Sec. 2(xiv) — Coca leaf, Cannabis [Charas, Ganja, and any mixture], Opium, Poppy straw, and all manufactured narcotic derivatives including Morphine, Heroin, Codeine, Thebaine, Hydrocodone, Hydromorphone, Oxycodone, Fentanyl, Methadone, Pethidine); (2) Psychotropic Substances (Sec. 2(xxiii) & Schedule to the Act — synthetic/natural CNS-active agents including LSD, MDMA, Amphetamine, Methamphetamine, Phencyclidine [PCP], Mescaline, Psilocybin, THC, Ketamine, Alprazolam, Diazepam, Lorazepam, Phenobarbital, Zolpidem); and (3) Controlled Substances (Precursor Chemicals under the RCS Order — Acetic Anhydride for Heroin acetylation, Ephedrine/Pseudoephedrine for Methamphetamine, Anthranilic acid/N-acetylanthranilic acid for Methaqualone, Ergometrine/Ergotamine for LSD, Safrole/Isosafrole/PMK for MDMA, and Potassium Permanganate for Cocaine processing):',
            keyPoints: [
              'Representative Seizure Sampling (NDPS Standing Order 1/88, 1/89 & Sec. 52A Certified Inventory before Magistrate): Homogeneous seizures in a single package require drawing duplicate representative samples of 24 grams each (or 5 grams each for high-value Heroin, Cocaine, Morphine, MDMA, LSD, Methamphetamine). When multiple packets/gunny bags are seized, packets with identical physical appearance and field spot-test response may be bunched in lots of 10 (for Ganja/Poppy straw) or 40 (for Heroin/Charas) and a composite duplicate sample drawn after thorough coning-and-quartering homogenization, heat-sealed with the Investigating Officer’s and Magistrate’s brass seal, and forwarded to the CFSL/SFSL within 72 hours.',
              'Graded Statutory Punishment (Small vs. Intermediate vs. Commercial Quantity): Possession of Small Quantity carries up to 1 year rigorous imprisonment; Intermediate Quantity (between Small and Commercial) carries up to 10 years RI; Commercial Quantity (or trafficking/financing) carries mandatory 10 to 20 years RI and fine ≥ ₹1–2 Lakh.'
            ]
          },
          {
            subtitle: 'Forensic Profiles of Specific NDPS Drugs: Cannabis, Heroin, Cocaine, Amphetamine, LSD, Phencyclidine, MDMA & Peyote',
            body: 'Each of the eight core Unit IV drug classes exhibits diagnostic botanical/chemical features, presumptive spot tests, and definitive metabolic biomarkers:',
            keyPoints: [
              '1. Cannabis (Cannabis sativa / indica — Cannabaceae): Dioecious herb bearing unicellular curved "bear-claw" Cystolithic Trichomes (with basal calcium carbonate deposits that effervesce with dilute HCl under microscopy!) and glandular trichomes secreting C21 terpenophenolic Cannabinoids: Δ9-Tetrahydrocannabinol (Δ9-THC, primary psychoactive CB1 agonist), Cannabidiol (CBD), and Cannabinol (CBN, oxidative degradation marker of aged cannabis). Preparations: Bhang (dried leaves — excluded from NDPS definition unless mixed with tops/resin; controlled under State Excise), Ganja (flowering/fruiting tops of female plant, 3–8% THC; Small Qty = 1 kg, Commercial = 20 kg), Charas / Hashish (separated resin, 10–25% THC; Small Qty = 100 g, Commercial = 1 kg), and Hashish Oil (30–60% THC). Spot Tests: Duquenois-Levine Test (Vanillin + acetaldehyde + ethanol + conc. HCl → deep violet-purple colour that extracts selectively into the lower Chloroform layer!) and Fast Blue B Salt Test (red-purple cannabinoidphenolic coupling). Bioanalytical Marker: 11-nor-9-carboxy-Δ9-THC (THC-COOH) in urine/blood.',
              '2. Heroin (Diacetylmorphine — Semi-Synthetic Opioid): Synthesized by acetylating anhydrous Morphine (from Opium) with Acetic Anhydride (a controlled precursor). Street "Brown Sugar" contains 10–40% diacetylmorphine base cut with caffeine, paracetamol, procaine, or phenobarbital, plus manufacturing impurities (6-acetylcodeine, noscapine, papaverine). Rapidly deacetylated in blood (t1/2 ≈ 3 min) to 6-Monoacetylmorphine (6-MAM — the ONLY pathognomonic biomarker proving Heroin intake over medicinal morphine or poppy seeds!) and then to Morphine (conjugated to M3G and active M6G). Spot Tests: Marquis Reagent (Formaldehyde + conc. H2SO4 → Purple-Violet), Froehde’s Reagent (Purple → Green), Mecke’s Reagent (Deep Bluish-Green), and Nitric Acid (Yellow turning green on heating). NDPS Thresholds: Small = 5 g, Commercial = 250 g.',
              '3. Cocaine (Methylbenzoylecgonine — Tropane Ester Alkaloid from Erythroxylum coca): Blocks presynaptic Dopamine, Norepinephrine, and Serotonin reuptake transporters (DAT/NET/SERT) AND blocks myocardial/axonal voltage-gated Na+ channels (local anesthetic + lethal arrhythmia risk). Exists as water-soluble Cocaine Hydrochloride powder (snorted/injected) or volatile free-base "Crack Cocaine" (precipitated with sodium bicarbonate and smoked, yielding pyrolysis biomarker Anhydroecgonine Methyl Ester [AEME] in urine!). Metabolized by plasma/hepatic esterases to Benzoylecgonine (primary urinary marker) and Ecgonine Methyl Ester; co-ingestion with Ethanol produces Cocaethylene via hepatic transesterification. Spot Tests: Scott’s 3-Step Cobalt Thiocyanate Test (Step 1: Cobalt thiocyanate gives turquoise-blue flaky precipitate; Step 2: Dissolves to clear pink on adding conc. HCl; Step 3: Turquoise-blue colour partitions into lower Chloroform layer — ruling out lidocaine/procaine false positives!) and Odor of Methyl Benzoate ("Wintergreen" test with methanol + H2SO4). NDPS Thresholds: Small = 2 g, Commercial = 100 g.',
              '4. Amphetamine & Methamphetamine (Phenethylamine CNS Stimulants): Indirect sympathomimetics that reverse vesicular VMAT2 and plasmalemmal DAT/NET transporters, flooding synapses with dopamine and norepinephrine. Spot Tests: Marquis Reagent gives an immediate Orange- turning-Brown colour; Simon’s Test (Sodium nitroprusside + acetaldehyde + aqueous Na2CO3) differentiates Secondary Amines (Methamphetamine & MDMA → Deep Blue colour) from Primary Amines (Amphetamine & MDA → No blue colour; reacts instead with Ninhydrin or Chen’s reagent!). Enantiomeric Chiral GC-MS separates illicit d-methamphetamine (dextro) from OTC nasal decongestant l-methamphetamine (levmetamfetamine).',
              '5. LSD (d-Lysergic Acid Diethylamide — Semi-Synthetic Indole/Ergoline Hallucinogen): Synthesized from Lysergic acid (from Ergot fungus Claviceps purpurea); potent partial agonist at cortical Serotonin 5-HT2A receptors. Active at microgram doses (50–150 µg impregnated on perforated blotter paper squares, gelatin "windowpanes", or microdots); causes visual synesthesia ("seeing sounds, hearing colours"), mydriasis, and perceptual distortion. Spot & Screening Tests: Intense blue-white native fluorescence under 366 nm UV light; Ehrlich’s Reagent (p-Dimethylaminobenzaldehyde [p-DMAB] in HCl/ethanol → deep Purple-Violet colour specific for the indole ring). Definitive Urinary Biomarker: 2-Oxo-3-hydroxy-LSD (present at 10–40× higher concentration in urine than parent LSD) analyzed by LC-MS/MS. NDPS Thresholds: Small = 0.002 g (2 mg), Commercial = 0.1 g (100 mg).',
              '6. Phencyclidine (PCP — "Angel Dust" — 1-(1-Phenylcyclohexyl)piperidine): Arylcyclohexylamine dissociative anesthetic that acts as a non-competitive antagonist inside the pore of the NMDA Glutamate receptor Ca2+ channel AND inhibits dopamine/norepinephrine reuptake. Produces profound analgesia, dissociative agitation, superhuman pain insensitivity, vertical AND horizontal bidirectional Nystagmus (pathognomonic clinical sign!), hypertension, rhabdomyolysis, and hyperthermia. Spot Tests: Scott’s Cobalt Thiocyanate (blue precipitate) and p-Dimethylaminobenzaldehyde (red); confirmed by GC-MS (characteristic base peak m/z 200, M+ 243).',
              '7. MDMA (3,4-Methylenedioxymethamphetamine — "Ecstasy" / "Molly"): Ring-substituted methylenedioxy phenethylamine (entactogen/empathogen) causing massive presynaptic Serotonin (5-HT) release alongside dopamine/norepinephrine, plus inappropriate ADH (vasopressin) secretion (SIADH → lethal hyponatremic cerebral edema when users drink excess water at raves) and serotonin-syndrome hyperthermia. Spot Tests: Marquis Reagent (Instant Black-Purple / Dark Violet due to the methylenedioxy ring!), Mandelin’s (Black-Violet), and Simon’s Test (Deep Blue, confirming secondary amine; distinguishes MDMA from primary amine metabolite MDA!). NDPS Thresholds: Small = 0.5 g, Commercial = 10 g.',
              '8. Peyote (Lophophora williamsii Cactus) & Mescaline (3,4,5-Trimethoxyphenethylamine): Spineless button cactus containing the proto-alkaloid Mescaline, a classical 5-HT2A receptor hallucinogen (oral active dose 200–500 mg; produces geometric visual hallucinations, mydriasis, nausea/vomiting, and diaphoresis). Spot Tests: Marquis Reagent (Bright Orange-Red!), Froehde’s Reagent (Yellow → Green/Blue), and Mecke’s Reagent (Yellow → Brown-Black).'
            ]
          }
        ],
        referenceTable: {
          caption: 'Table 5.1: NDPS Drugs — Statutory Quantities, Presumptive Color Tests & Definitive Biomarkers',
          headers: ['NDPS Substance', 'Small Qty / Commercial Qty', 'Primary Presumptive Color Spot Test', 'Definitive Confirmatory Biomarker (GC-MS / LC-MS/MS)'],
          rows: [
            ['Cannabis (Ganja / Charas)', 'Ganja: 1 kg / 20 kg | Charas: 100 g / 1 kg', 'Duquenois-Levine (Violet in CHCl3 layer) + Fast Blue B + Cystolithic hairs', 'Δ9-THC, 11-OH-THC & 11-nor-9-carboxy-Δ9-THC (THC-COOH)'],
            ['Heroin (Diacetylmorphine)', '5 grams / 250 grams', 'Marquis (Purple-Violet) | Froehde (Purple→Green)', '6-Monoacetylmorphine (6-MAM in urine/vitreous) + Morphine'],
            ['Cocaine', '2 grams / 100 grams', 'Scott’s 3-Step Cobalt Thiocyanate (Turquoise Blue in CHCl3)', 'Benzoylecgonine, Cocaethylene (with EtOH), AEME (crack)'],
            ['Amphetamine / Methamphetamine', '2 grams / 50 grams', 'Marquis (Orange→Brown) | Simon’s (Blue ONLY for Methamphetamine)', 'd/l-Enantiomeric Amphetamine & Methamphetamine'],
            ['LSD (Lysergic Acid Diethylamide)', '0.002 g (2 mg) / 0.1 g (100 mg)', '366 nm UV Blue Fluorescence + Ehrlich’s p-DMAB Reagent (Purple)', '2-Oxo-3-hydroxy-LSD (primary urinary metabolite)'],
            ['Phencyclidine (PCP)', '2 grams / 50 grams', 'Cobalt Thiocyanate / p-DMAB (Note: Vertical + Horizontal Nystagmus)', 'Parent PCP + PPC / PCHP metabolites (EI-MS m/z 200, 243)'],
            ['MDMA (Ecstasy)', '0.5 grams / 10 grams', 'Marquis (Instant Black-Purple) + Simon’s (Deep Blue for 2° amine)', 'MDMA + N-demethylated metabolite MDA + HMMA'],
            ['Peyote / Mescaline', 'Mescaline: 2 g / 50 g', 'Marquis (Bright Orange-Red) | Froehde (Yellow-Green)', '3,4,5-Trimethoxyphenethylamine & 3,4,5-Trimethoxyphenylacetic acid']
          ]
        }
      },
      {
        id: 'm5-s2',
        heading: '5.2 Alkaloids: Definition, Classification, Isolation, General Characterization & Specific Profiles (Hydromorphone, Methadone, Mescaline, PCP, Atropine, Cocaine)',
        badge: 'Alkaloid Chemistry',
        summary: 'Structural classification of alkaloids, general precipitation/colour reagents, and forensic profiles of Hydromorphone, Methadone, Mescaline, Phencyclidine, Atropine, and Cocaine.',
        contentBlocks: [
          {
            subtitle: 'Alkaloids: Definition, Structural Classification, Isolation & General Characterization Reagents',
            body: 'Coined by Carl Friedrich Wilhelm Meissner (1819), Alkaloids ("alkali-like") are naturally occurring (or semi-synthetically modified), basic, nitrogen-containing organic compounds—predominantly with the nitrogen atom incorporated inside a heterocyclic ring—biosynthesized from amino acids and possessing marked physiological/toxicological activity. In plants, they occur as water-soluble salts of organic acids (meconic, tartaric, citric, malic, or tannic acid), while their free bases are soluble in organic solvents (chloroform, ether) and insoluble in water (except liquid volatile alkaloids like Nicotine and Coniine):',
            keyPoints: [
              '1. Classification of Alkaloids: (a) True Alkaloids (derived from amino acids with nitrogen inside a heterocyclic ring): Pyridine/Piperidine (Nicotine, Coniine, Lobeline), Tropane (Atropine, Hyoscyamine, Scopolamine, Cocaine — from ornithine), Quinoline (Quinine, Quinidine — from tryptophan), Isoquinoline / Phenanthrene (Morphine, Codeine, Thebaine, Hydromorphone, Papaverine, Noscapine — from tyrosine), Indole (Strychnine, Brucine, Reserpine, Psilocybin, Ergot alkaloids/LSD — from tryptophan), Imidazole (Pilocarpine), and Purine (Caffeine, Theobromine); (b) Proto-Alkaloids / Amino-Alkaloids (derived from amino acids with nitrogen in an aliphatic side chain, NOT in a heterocycle): Mescaline (from Peyote), Ephedrine, Colchicine, Cathinone; (c) Pseudo-Alkaloids (nitrogen-containing heterocyclic bases NOT biosynthesized from amino acids, e.g., diterpenoid/steroidal skeleton): Aconitine (from Aconite), Conessine, Solanidine.',
              '2. General Alkaloid Isolation from Viscera: Isolated via Stas-Otto or Ammonium Sulphate deproteinization followed by basification (pH 10–11 with NH4OH) and extraction into Chloroform (except amphoteric Morphine/Hydromorphone extracted at isoelectric pH 8.5–9.0 with Chloroform:Isopropanol, and liquid volatile Nicotine/Coniine isolated by alkaline steam distillation).',
              '3. General Alkaloid Precipitation (Group) Reagents: React with protonated alkaloids in slightly acidic aqueous solution to form insoluble crystalline/amorphous precipitates: (a) Dragendorff’s Reagent (Potassium Bismuth Iodide, KBiI4) → Orange to Brick-Red precipitate; (b) Mayer’s Reagent (Potassium Mercuric Iodide, K2HgI4) → Creamy-White / Pale-Yellow precipitate; (c) Wagner’s Reagent (Iodine in Potassium Iodide, I2/KI) → Reddish-Brown precipitate; (d) Hager’s Reagent (Saturated Aqueous Picric Acid) → Bright Yellow crystalline picrate precipitate with characteristic melting point & microscopic crystal habit; (e) Sonnenschein’s Reagent (Phosphomolybdic acid → Yellow precipitate) & Scheibler’s Reagent (Phosphotungstic acid) & Tannic Acid (Buff-white precipitate, used clinically as a universal chemical antidote to precipitate unabsorbed alkaloids in the stomach!).',
              '4. General Alkaloid Chromogenic (Colour) Reagents: Concentrated H2SO4-based dehydration/oxidation reagents on dry porcelain spot plates: Marquis (Formaldehyde + H2SO4), Mandelin’s (Ammonium metavanadate + H2SO4), Froehde’s (Molybdic acid + H2SO4), Mecke’s (Selenious acid + H2SO4), Erdmann’s (HNO3 + H2SO4), and Vitali-Morin (Fuming HNO3 + alcoholic KOH).'
            ]
          },
          {
            subtitle: 'Specific Study: Hydromorphone, Methadone, Mescaline, Phencyclidine, Atropine & Cocaine',
            body: 'In accordance with the Unit IV syllabus, forensic toxicologists must master the structure, toxicodynamics, and confirmatory characterization of these six specified alkaloids and synthetic analogs:',
            keyPoints: [
              '1. Hydromorphone (Dihydromorphinone — "Dilaudid"): Semi-synthetic phenanthrene opioid ketone derivative of Morphine (5–8× more potent than Morphine as a full μ-opioid receptor agonist; contains a C6 ketone group and saturated C7–C8 bond while retaining the acidic C3 phenolic -OH, making it Amphoteric like morphine and requiring extraction at pH 8.5–9.0!). Also formed as a minor endogenous Phase I metabolite of high-dose Morphine or Hydrocodone (via CYP2D6). Metabolized primarily to Hydromorphone-3-glucuronide (H3G, neuroexcitatory at high renal-failure levels). Spot Tests: Marquis (Yellow → Red → Purple), Froehde (Purple → Blue), and forms a yellow hydrazone with 2,4-DNP due to its C6 ketone.',
              '2. Methadone (6-Dimethylamino-4,4-diphenyl-3-heptanone — "Dolophine"): Synthetic open-chain diphenylheptane full μ-opioid agonist AND non-competitive NMDA receptor antagonist, PLUS inhibitor of cardiac hERG Potassium channels (causing dose-dependent QTc prolongation and lethal Torsades de Pointes ventricular arrhythmia!). High oral bioavailability (~80%), high lipophilicity (Vd ≈ 4.0 L/kg — significant PMR!), and long, variable elimination half-life (24–55 hours), making fatal accumulation common during the first week of opioid maintenance induction. Metabolized via hepatic CYP3A4/CYP2B6 N-demethylation followed by spontaneous cyclization into its primary inactive urinary biomarker: EDDP (2-Ethylidene-1,5-dimethyl-3,3-diphenylpyrrolidine) and EMDP. Forensically, detecting EDDP in urine proves genuine in-vivo ingestion and rules out "spiking" (adding a drop of methadone directly into the urine cup at a clinic!). Spot Test: Mandelin’s (Green-to-Blue) & Cobalt Thiocyanate.',
              '3. Mescaline (3,4,5-Trimethoxyphenethylamine): Proto-alkaloid from Peyote cactus (Lophophora williamsii) and San Pedro cactus (Echinopsis pachanoi). Agonist at 5-HT2A/2C serotonin receptors; lacks a heterocyclic nitrogen ring; extracted in alkaline chloroform fraction; reacts bright Orange-Red with Marquis reagent and confirmed by GC-MS (TMS/PFP derivative) or LC-MS/MS.',
              '4. Phencyclidine (PCP): Synthetic piperidine-ring dissociative anesthetic ("pseudo-alkaloid" behavior in basic extraction at pH 10–11); NMDA receptor channel blocker causing bidirectional nystagmus and violent dissociative delirium; confirmed by GC-MS.',
              '5. Atropine (dl-Hyoscyamine — Racemic Tropane Ester of Tropic Acid + Tropine from Atropa belladonna & Datura): Competitive antagonist at M1–M5 Muscarinic ACh receptors causing mydriasis, cycloplegia, anhidrosis, hyperthermia, tachycardia, and central anticholinergic delirium. Extracted in Alkaline-Chloroform fraction (pH 10); gives a deep Violet colour in the Vitali-Morin Test (fuming HNO3 evaporation + alcoholic KOH), forms characteristic blade-like crystals with Wagner’s/Picric acid, and causes mydriasis when 1 drop of extract is instilled into a rabbit’s/cat’s eye (biological test, historical).',
              '6. Cocaine (Methylbenzoylecgonine — Tropane Diester Alkaloid from Erythroxylum coca): The ONLY local anesthetic that simultaneously causes vasoconstriction and sympathomimetic mydriasis/hypertension (by blocking NET/DAT reuptake). Identified by Scott’s 3-step Cobalt Thiocyanate test, microcrystal tests (feathery/rosette crystals with Gold Chloride HAuCl4 or Platinic Chloride), and GC-MS/LC-MS/MS quantification of Benzoylecgonine and Cocaethylene.'
            ]
          }
        ]
      },
      {
        id: 'm5-s3',
        heading: '5.3 Drugs of Abuse in Sports & Methods of Doping Analysis (WADA Prohibited List, GC-C-IRMS, EPO & Athlete Biological Passport)',
        badge: 'Sports Toxicology',
        summary: 'WADA Prohibited List classes (S0–S9, M1–M3, P1), Anabolic Steroid T/E ratio & Carbon Isotope Ratio MS, EPO Isoelectric Focusing, Diuretics/Masking Agents, and ABP.',
        contentBlocks: [
          {
            subtitle: 'Classification of Performance-Enhancing Drugs (WADA Prohibited List)',
            body: 'Sports doping toxicology (regulated globally by the World Anti-Doping Agency [WADA] and in India by the National Anti-Doping Agency [NADA] and the WADA-accredited National Dope Testing Laboratory [NDTL], New Delhi) monitors urine and blood samples divided into secure "A" (Screening & Confirmation) and "B" (Referee/Counter-analysis) bottles:',
            keyPoints: [
              '1. Substances Prohibited at All Times (In- and Out-of-Competition): (a) S1 — Anabolic Agents: Exogenous Anabolic-Androgenic Steroids (AAS: Stanozolol, Nandrolone/19-Nortestosterone, Metandienone, Oxandrolone, Trenbolone, Boldenone), Endogenous AAS administered exogenously (Testosterone, Epitestosterone, Dihydrotestosterone, DHEA), and Selective Androgen Receptor Modulators (SARMs: Ostarine/Enobosarm, Ligandrol) + Clenbuterol; (b) S2 — Peptide Hormones, Growth Factors & Related Substances: Erythropoietin (rhEPO, Darbepoetin alfa, CERA — stimulate erythropoiesis to boost VO2max), Hypoxia-Inducible Factor (HIF) stabilizers (Roxadustat, Cobalt), Human Growth Hormone (hGH), IGF-1, and Chorionic Gonadotropin (hCG); (c) S3 — Beta-2 Agonists (Salbutamol above threshold, Salmeterol, Fenoterol, Clenbuterol — bronchodilation + anabolic partitioning); (d) S4 — Hormone and Metabolic Modulators (Aromatase inhibitors like Anastrozole/Letrozole, SERMs like Tamoxifen/Clomiphene used to mask gynecomastia from AAS, and Meldonium / Trimetazidine / GW1516); (e) S5 — Diuretics and Masking Agents: Diuretics (Furosemide, Hydrochlorothiazide, Spironolactone, Acetazolamide — used for rapid weight-class cutting in wrestling/boxing AND to dilute urinary concentrations of prohibited drugs!), Plasma Volume Expanders (Albumin, Dextran, Hydroxyethyl Starch [HES], Mannitol — mask elevated hemoglobin/hematocrit in blood doping), and Epitestosterone / Probenecid (blocks renal tubular organic acid secretion of steroid glucuronides).',
              '2. Prohibited Methods (At All Times): M1 — Manipulation of Blood and Blood Components (Autologous or Homologous Blood Transfusions, EFAs/HBOCs); M2 — Chemical and Physical Manipulation (Urine substitution, catheterization, or adding Proteases like papain/trypsin to urine to destroy rhEPO!); M3 — Gene and Cell Doping.',
              '3. Substances Prohibited In-Competition Only (S6–S9) & In Particular Sports (P1): S6 — Stimulants (Amphetamine, Methamphetamine, Cocaine, Ephedrine > 10 µg/mL, Methylphenidate, Modafinil, Strychnine); S7 — Narcotics (Morphine, Heroin, Fentanyl, Oxycodone, Methadone, Hydromorphone); S8 — Cannabinoids (THC-COOH > 150 ng/mL threshold); S9 — Glucocorticoids; P1 — Beta-Blockers (Propranolol, Atenolol, Metoprolol — prohibited in precision sports like Archery, Shooting, Billiards, and Golf because they suppress hand tremor and anxiety bradycardia!).'
            ]
          },
          {
            subtitle: 'Analytical Methods in Doping Control: GC-MS/MS, LC-HRMS, GC-C-IRMS, SAR-PAGE & Athlete Biological Passport',
            body: 'Because athletes micro-dose endogenous hormones and synthetic analogs with rapid clearance, sports doping laboratories utilize advanced multi-tiered instrumentation:',
            formula: 'Testosterone / Epitestosterone (T/E) Ratio Screening Threshold > 4 : 1   →   Confirmed by GC-C-IRMS (δ13C ‰)',
            keyPoints: [
              '1. Anabolic Steroids & Gas Chromatography-Combustion-Isotope Ratio Mass Spectrometry (GC-C-IRMS): Endogenous Testosterone (T) and its inactive epimer Epitestosterone (E) are normally excreted in urine as glucuronides in a median T/E ratio of ~1 : 1. Exogenous administration of Testosterone increases urinary T while suppressing LH and endogenous E, elevating the T/E ratio > 4 : 1 (monitored longitudinally in the Athlete Biological Passport Steroidal Module). Because some individuals have naturally high T/E ratios (or UGT2B17 deletion variants have artificially low T/E ratios < 0.1), definitive proof of exogenous Testosterone relies on GC-C-IRMS: Synthetic pharmaceutical testosterone is manufactured semi-synthetically from plant sterols (soy stigmasterol / diosgenin from C3 plants), which are significantly depleted in Carbon-13 (δ13C ≈ -27‰ to -32‰) compared to endogenous human cholesterol/testosterone derived from a mixed C3/C4 diet (δ13C ≈ -16‰ to -22‰). A Δδ13C difference > 3‰ between urinary Testosterone metabolites (Androsterone/Etiocholanolone) and an endogenous reference steroid (Pregnanediol or 11-ketoetiocholanolone) conclusively proves exogenous synthetic testosterone doping! Furthermore, tracing long-term chlorinated/esterified metabolites (e.g., oral Turinabol or Stanozolol 3’-hydroxystanozolol by GC-QTOF-MS / LC-MS/MS) extends the detection window to months.',
              '2. Recombinant Erythropoietin (rhEPO) & Growth Hormone (hGH) Analysis: Although recombinant human EPO (rhEPO) has the exact same 165-amino-acid sequence as endogenous renal EPO, rhEPO is produced in Chinese Hamster Ovary (CHO) cells and exhibits a less negatively charged post-translational glycosylation (sialic acid) isoform profile! It is separated and detected in urine/serum by Isoelectric Focusing (IEF) or Sarcosyl-Polyacrylamide Gel Electrophoresis (SAR-PAGE) with double-blotting chemiluminescence. Exogenous hGH is detected via the Isoform Differential Immunoassay (measuring the ratio of recombinant monomeric 22 kDa hGH to pituitary 20 kDa/oligomeric isoforms) and the Biomarker Method (serum IGF-1 + P-III-NP).',
              '3. Diuretics, Stimulants & Athlete Biological Passport (ABP): Diuretics, Beta-blockers, SARMs, and Stimulants are screened in a single dilute-and-shoot or SPE run using UHPLC-HRMS (Orbitrap / Q-TOF) and LC-MS/MS. Homologous blood transfusion is detected directly by Flow Cytometry (identifying minor RBC surface antigen mismatches like C, c, E, e, Kell, Duffy, Kidd), while Autologous blood transfusion (re-infusing one’s own stored blood) is detected via the Athlete Biological Passport (ABP) Hematological Module (bayesian tracking of Hemoglobin [HGB], Reticulocyte percentage [RET%], and the OFF-hr Score = [HGB in g/L] - 60 × √[RET%], plus plasticizer metabolites DEHP/MEHP leaked from PVC blood storage bags!).'
            ]
          }
        ],
        referenceTable: {
          caption: 'Table 5.2: WADA Prohibited Drug Classes, Doping Purpose & Definitive Analytical Confirmation Methods',
          headers: ['WADA Class & Examples', 'Physiological Doping Advantage', 'Primary Biological Matrix', 'Definitive Confirmatory Analytical Method'],
          rows: [
            ['S1: Exogenous AAS (Stanozolol, Nandrolone)', 'Increases muscle protein synthesis & strength', 'Urine (β-glucuronidase hydrolyzed)', 'GC-MS/MS & LC-HRMS (Long-term hydroxylated/sulfated metabolites)'],
            ['S1: Endogenous AAS (Testosterone, DHT, DHEA)', 'Increases muscle mass & aggression', 'Urine (Steroidal Module ABP)', 'T/E Ratio (>4:1) + GC-C-IRMS (Carbon-13 δ13C isotope ratio difference > 3‰)'],
            ['S2: Erythropoietin (rhEPO, Darbepoetin, CERA)', 'Stimulates RBC production & aerobic VO2max', 'Urine & Serum/Whole Blood', 'IEF (Isoelectric Focusing) & SAR-PAGE western blot + ABP OFF-hr Score'],
            ['S2: Human Growth Hormone (hGH)', 'Lipolysis, lean mass & connective tissue repair', 'Serum (Blood tube)', '22 kDa vs. Total Pituitary Isoform Immunoassay + IGF-1 / P-III-NP biomarkers'],
            ['S5: Diuretics & Masking Agents (Furosemide)', 'Rapid weight loss & urinary dilution of prohibited drugs', 'Urine', 'UHPLC-ESI-MS/MS (Positive/Negative Polarity Switching) & Urinary Specific Gravity'],
            ['M1: Blood Transfusion (Homologous / Autologous)', 'Immediate surge in oxygen-carrying capacity', 'EDTA Whole Blood + Urine', 'Flow Cytometry (minor RBC antigens) + ABP Hematological Module + DEHP plasticizers'],
            ['P1: Beta-Blockers (Propranolol, Atenolol)', 'Reduces heart rate & hand tremor in Shooting/Archery', 'Urine (In-Competition)', 'LC-MS/MS or GC-MS after derivatization']
          ]
        }
      }
    ],
    quiz: [
      {
        id: 'm5-q1',
        question: 'Under the NDPS Act, 1985 (India), what are the statutory Small Quantity and Commercial Quantity thresholds for Heroin (Diacetylmorphine) versus Charas (Separated Cannabis Resin)?',
        options: [
          'Heroin: 5 g (Small) / 250 g (Commercial); Charas: 100 g (Small) / 1 kg (Commercial)',
          'Heroin: 100 g (Small) / 1 kg (Commercial); Charas: 5 g (Small) / 250 g (Commercial)',
          'Both Heroin and Charas have thresholds of 1 kg and 20 kg',
          'Heroin: 2 mg / 100 mg; Charas: 2 g / 100 g'
        ],
        correctAnswer: 0,
        explanation: 'Under the NDPS Act schedule, Heroin has Small Quantity = 5 g and Commercial Quantity = 250 g, whereas Charas (Cannabis resin) has Small Quantity = 100 g and Commercial Quantity = 1 kg (and Ganja has 1 kg / 20 kg).',
        referenceTopic: '5.1 NDPS Act Thresholds'
      },
      {
        id: 'm5-q2',
        question: 'In a forensic drug chemistry examination of suspected Cocaine Hydrochloride, how does Scott’s 3-Step Cobalt Thiocyanate Test prevent false-positive reactions from other local anesthetics like Lidocaine or Procaine?',
        options: [
          'Step 1 yields a turquoise-blue precipitate with cobalt thiocyanate; Step 2 dissolves the precipitate to a clear pink solution upon adding concentrated HCl; Step 3 re-extracts the intense turquoise-blue complex selectively into the lower Chloroform layer',
          'Cocaine turns bright yellow when boiled with nitric acid',
          'Cocaine effervesces with dilute hydrochloric acid due to cystolithic hairs',
          'Cocaine turns purple with Ehrlich’s reagent'
        ],
        correctAnswer: 0,
        explanation: 'The 3-step Scott’s modification (blue precipitate → clear pink with HCl → turquoise blue partitioning into the lower chloroform layer) confirms Cocaine specificity.',
        referenceTopic: '5.1 Specific NDPS Drugs (Cocaine)'
      },
      {
        id: 'm5-q3',
        question: 'Which NDPS hallucinogen is active at microgram doses (50–150 µg on blotter paper), exhibits intense blue-white fluorescence under 366 nm UV light, gives a deep purple-violet colour with Ehrlich’s reagent (p-DMAB), and is confirmed in urine via its major metabolite 2-Oxo-3-hydroxy-LSD?',
        options: [
          'd-Lysergic Acid Diethylamide (LSD)',
          'Phencyclidine (PCP)',
          'Mescaline',
          'Methadone'
        ],
        correctAnswer: 0,
        explanation: 'LSD is an ergoline indole alkaloid derivative active in micrograms; its indole ring reacts with Ehrlich’s reagent (p-DMAB) to give a purple colour, and 2-Oxo-3-hydroxy-LSD is its primary urinary biomarker.',
        referenceTopic: '5.1 Specific NDPS Drugs (LSD)'
      },
      {
        id: 'm5-q4',
        question: 'What is the primary pharmacological mechanism and pathognomonic clinical ocular sign of acute Phencyclidine (PCP — "Angel Dust") intoxication?',
        options: [
          'Non-competitive blockade of the NMDA Glutamate receptor Ca2+ channel pore (plus monoamine reuptake inhibition), producing dissociative agitation, extreme pain insensitivity, and combined Vertical AND Horizontal (bidirectional) Nystagmus',
          'Selective activation of muscarinic M3 receptors causing pinpoint pupils',
          'Inhibition of hepatic rhodanese causing cherry-red skin',
          'Blockade of spinal glycine receptors causing opisthotonus'
        ],
        correctAnswer: 0,
        explanation: 'Phencyclidine (PCP) is a non-competitive NMDA glutamate receptor channel blocker; the presence of both vertical and horizontal (rotatory/bidirectional) nystagmus in an agitated dissociative patient is classic for PCP.',
        referenceTopic: '5.1 Specific NDPS Drugs (Phencyclidine)'
      },
      {
        id: 'm5-q5',
        question: 'How are Proto-Alkaloids (such as Mescaline from Peyote cactus and Ephedrine) structurally distinguished from True Alkaloids (such as Morphine, Strychnine, Atropine, and Cocaine) and Pseudo-Alkaloids (such as Aconitine)?',
        options: [
          'Proto-alkaloids are biosynthesized from amino acids (like tyrosine/phenylalanine), but their basic Nitrogen atom is located in an aliphatic side chain (exocyclic) rather than inside a heterocyclic ring, whereas True Alkaloids have amino-acid-derived nitrogen inside a heterocyclic ring and Pseudo-alkaloids are not derived from amino acids',
          'Proto-alkaloids do not contain any nitrogen atoms',
          'Proto-alkaloids are inorganic heavy metal salts',
          'True alkaloids are gases at room temperature'
        ],
        correctAnswer: 0,
        explanation: 'True alkaloids derive from amino acids and contain heterocyclic nitrogen; Proto-alkaloids (Mescaline, Ephedrine, Colchicine) derive from amino acids with exocyclic (side-chain) nitrogen; Pseudo-alkaloids (Aconitine, Steroidal/Terpenoid alkaloids) acquire nitrogen without an amino acid precursor.',
        referenceTopic: '5.2 Alkaloid Classification'
      },
      {
        id: 'm5-q6',
        question: 'In clinical and forensic urine drug testing of a patient enrolled in a Methadone maintenance program, why is the detection of EDDP (2-Ethylidene-1,5-dimethyl-3,3-diphenylpyrrolidine) alongside parent Methadone critically important?',
        options: [
          'EDDP is formed exclusively by in-vivo hepatic CYP3A4/CYP2B6 N-demethylation and cyclization; finding parent Methadone in urine with ZERO EDDP proves the subject did not ingest the drug and instead "spiked" (adulterated) the urine specimen directly with liquid methadone',
          'EDDP is a synthetic adulterant added by street dealers',
          'EDDP converts methadone into heroin inside the bladder',
          'EDDP is only found in hair shafts'
        ],
        correctAnswer: 0,
        explanation: 'Because renal excretion of unchanged parent methadone varies wildly with urinary pH and patients occasionally spike urine with a drop of unconsumed methadone to pass compliance checks, confirming the hepatic metabolite EDDP proves genuine systemic ingestion.',
        referenceTopic: '5.2 Specific Alkaloids & Opioids (Methadone)'
      },
      {
        id: 'm5-q7',
        question: 'Why must Hydromorphone (Dihydromorphinone) be extracted from biological matrices at an Isoelectric pH of 8.5–9.0 (similar to Morphine) rather than at pH 2 or pH 13?',
        options: [
          'Hydromorphone retains the acidic C3 phenolic hydroxyl (-OH) group alongside its basic tertiary amine nitrogen, making it an amphoteric molecule that forms a water-soluble phenoxide anion at strongly alkaline pH',
          'Hydromorphone evaporates at pH 7.0',
          'Hydromorphone is a strong mineral acid',
          'Hydromorphone contains no oxygen atoms'
        ],
        correctAnswer: 0,
        explanation: 'Like Morphine, Hydromorphone has a free C3 phenolic -OH group and a tertiary amine, rendering it amphoteric (unlike Codeine or Oxycodone where the C3 position is methylated to -OCH3).',
        referenceTopic: '5.2 Specific Alkaloids & Opioids (Hydromorphone)'
      },
      {
        id: 'm5-q8',
        question: 'Which general alkaloid precipitation reagent consists of Potassium Bismuth Iodide (KBiI4) and produces an immediate Orange-to-Brick-Red precipitate with alkaloids (and is widely used as a universal TLC visualization spray)?',
        options: [
          'Dragendorff’s Reagent',
          'Mayer’s Reagent (Potassium Mercuric Iodide)',
          'Hager’s Reagent (Saturated Picric Acid)',
          'Wagner’s Reagent (Iodine in Potassium Iodide)'
        ],
        correctAnswer: 0,
        explanation: 'Dragendorff’s reagent (potassium bismuth iodide) yields an orange/brick-red precipitate; Mayer’s gives creamy-white, Wagner’s gives reddish-brown, and Hager’s gives bright yellow picrate crystals.',
        referenceTopic: '5.2 General Alkaloid Characterization'
      },
      {
        id: 'm5-q9',
        question: 'In WADA sports doping control, an athlete’s urine sample exhibits an elevated Testosterone-to-Epitestosterone (T/E) ratio of 6.5 : 1 (exceeding the 4 : 1 screening threshold). Which definitive mass-spectrometric technique is used to prove that the Testosterone is of exogenous synthetic origin rather than naturally elevated endogenous production?',
        options: [
          'Gas Chromatography-Combustion-Isotope Ratio Mass Spectrometry (GC-C-IRMS), which measures the Carbon-13 to Carbon-12 ratio (δ13C ‰) and detects the depleted 13C signature of synthetic steroids derived from C3 soy phytosterols',
          'Standard Benedict’s copper reduction test',
          'Flame Atomic Absorption Spectroscopy',
          'Simple Thin-Layer Chromatography'
        ],
        correctAnswer: 0,
        explanation: 'GC-C-IRMS measures the δ13C isotopic signature of urinary testosterone metabolites compared to endogenous reference steroids (such as pregnanediol); a Δδ13C difference > 3‰ proves exogenous administration of plant-sterol-derived synthetic testosterone.',
        referenceTopic: '5.3 Sports Doping Analysis (GC-C-IRMS)'
      },
      {
        id: 'm5-q10',
        question: 'Why are Diuretics (such as Furosemide, Hydrochlorothiazide, and Spironolactone) prohibited by WADA both In-Competition and Out-of-Competition under Class S5?',
        options: [
          'They act as dual abuses: (1) rapid artificial weight reduction to qualify for lower weight classes in combat/weightlifting sports, and (2) "Masking Agents" that rapidly increase urine volume to dilute the urinary concentration of prohibited steroids and stimulants below analytical detection limits',
          'They directly stimulate skeletal muscle hypertrophy more strongly than testosterone',
          'They increase red blood cell count like erythropoietin',
          'They convert glucose into ethanol'
        ],
        correctAnswer: 0,
        explanation: 'Diuretics are banned at all times because they allow unfair acute weight manipulation in weight-categorized sports and act as masking agents by diluting urinary concentrations of other prohibited substances.',
        referenceTopic: '5.3 Sports Doping Analysis (Diuretics & Masking Agents)'
      }
    ],
    assignment: {
      id: 'm5-assign',
      title: 'Case Assignment 5: Unit IV NDPS Seizure Classification, Alkaloid Profiling & WADA Sports Doping GC-C-IRMS Evaluation',
      caseScenario: 'Narcotics Control Bureau (NCB) officers intercept Packet A (320 g of Heroin) and Packet B (1.4 kg of Charas resin), alongside biological samples from a suspected Methadone and Tropane alkaloid overdose. Separately, a WADA-accredited sports doping laboratory screens an athlete’s urine showing a Testosterone/Epitestosterone (T/E) ratio above the screening threshold.',
      instructions: [
        'Enter the statutory NDPS Commercial Quantity threshold (in grams) for Heroin.',
        'Enter the WADA urinary Testosterone/Epitestosterone (T/E) screening threshold ratio (e.g., 4 for 4:1).',
        'Select the unique biomarker confirming illicit Heroin (diacetylmorphine) intake.',
        'Select the primary urinary metabolite that confirms Methadone administration vs. false-positive immunoassay interference.',
        'Summarize the NDPS quantity classification, general alkaloid & colour characterization tests (Dragendorff/Mayer/Vitali-Morin/Marquis/Scott), and WADA GC-C-IRMS protocol.'
      ],
      structuredFields: [
        {
          id: 'heroin_comm_qty',
          label: 'Statutory NDPS Commercial Quantity Threshold for Heroin [in grams]',
          type: 'number',
          unit: 'g',
          placeholder: 'e.g., 250',
          expectedValue: 250,
          tolerance: 0,
          criterionLabel: 'Accurate NDPS Commercial Quantity threshold for Heroin (250 g)',
          hint: 'Under the NDPS Act 1985, Heroin Small Quantity is 5 g and Commercial Quantity is 250 g.'
        },
        {
          id: 'wada_te_ratio',
          label: 'WADA Urinary Testosterone-to-Epitestosterone (T/E) Screening Ratio Threshold',
          type: 'number',
          placeholder: 'e.g., 4',
          expectedValue: 4,
          tolerance: 0,
          criterionLabel: 'Correct WADA T/E ratio threshold (4:1)',
          hint: 'A T/E ratio > 4:1 triggers confirmatory GC-C-IRMS testing.'
        },
        {
          id: 'heroin_biomarker',
          label: 'Pathognomonic Metabolite Confirming Heroin (Diacetylmorphine) Use',
          type: 'select',
          options: [
            '6-Monoacetylmorphine (6-MAM)',
            'Morphine-3-Glucuronide (M3G)',
            'Norcodeine',
            'Papaverine'
          ],
          expectedValue: '6-Monoacetylmorphine (6-MAM)',
          criterionLabel: 'Correct identification of 6-Monoacetylmorphine (6-MAM)',
          hint: '6-MAM is uniquely generated from the rapid deacetylation of heroin.'
        },
        {
          id: 'methadone_biomarker',
          label: 'Primary Urinary Metabolite Confirming Genuine Methadone Intake (Unit IV Alkaloid Profile)',
          type: 'select',
          options: [
            'EDDP (2-Ethylidene-1,5-dimethyl-3,3-diphenylpyrrolidine)',
            'Benzoylecgonine',
            '11-Nor-9-carboxy-THC (THC-COOH)',
            '2-Oxo-3-hydroxy-LSD'
          ],
          expectedValue: 'EDDP (2-Ethylidene-1,5-dimethyl-3,3-diphenylpyrrolidine)',
          criterionLabel: 'Correct identification of EDDP as the primary urinary metabolite of Methadone',
          hint: 'Methadone undergoes N-demethylation and cyclization to EDDP, proving in-vivo metabolism vs. sample spiking.'
        }
      ],
      writtenPrompt: 'Summarize the Unit IV NDPS classification of Heroin (250 g Commercial) and Charas (1000 g Commercial), alkaloid characterization reagents (Dragendorff/Mayer/Wagner/Vitali-Morin), and WADA GC-C-IRMS confirmation of exogenous testosterone:',
      minWordCount: 30,
      requiredKeywords: [
        { groupLabel: 'NDPS & Biomarkers (6-MAM / EDDP)', terms: ['250', '6-mam', 'heroin', 'charas', 'ndps', 'eddp'] },
        { groupLabel: 'Sports Doping & Alkaloid Characterization', terms: ['irms', 'testosterone', 'alkaloid', 'dragendorff', 'vitali'] }
      ],
      sampleFrameworkHint: 'Include Heroin Commercial Qty (250 g), Charas Commercial Qty (1 kg), 6-MAM & EDDP biomarkers, Dragendorff/Mayer/Vitali-Morin alkaloid tests, and WADA T/E > 4:1 confirmed by GC-C-IRMS.'
    }
  },
  {
    id: 'tox-mod-6',
    moduleNumber: 6,
    code: 'FT2601-M6',
    title: 'Module 6: Plant & Animal Poisons, Food Poisoning, Hair / Metabolite Analysis & Medico-Legal Reporting',
    subtitle: 'Opium, Nux-vomica, Mexican Prickly Poppy (Argemone), Dhatura, Aconite, Atropa, Kaner, Madar, Cannabis, Abrus, Ricinus, Bhilawa, Plumbago, Ergot, Cyanogenetic Glycosides & Poisonous Mushrooms; Snake, Cantharidin, Scorpion & Marine Toxins; Bacterial/Chemical Food Poisoning; Hair & EtG/EtS Analysis; and Sec. 329 BNSS Expert Reports.',
    level: 'Advanced',
    estimatedHours: '9 Hours',
    learningObjectives: [
      'Examine all sixteen statutory Plant Poisons (Unit V): Opium, Strychnos nux-vomica, Mexican prickly poppy (Argemone mexicana), Dhatura, Aconite, Atropa, Kaner, Madar, Cannabis, Abrus, Ricinus, Bhilawa, Plumbago, Poisonous fungi (Ergot), Cyanogenetic glycosides, and Poisonous mushrooms.',
      'Differentiate Animal & Venomous Poisons (Snake Big Four, Cantharidin, Scorpion, Insects, and Marine Toxins) alongside Bacterial and Chemical Food Poisoning (FSSAI vs. FSL roles).',
      'Execute Hair Segmental Analysis (1.0 cm/month chronology, SoHT decontamination) and Drug Metabolism interpretation (EtG/EtS vs. microbial fermentation, CYP450 polymorphisms, parent-to-metabolite ratios).',
      'Draft court-admissible Forensic Science Laboratory (FSL) Expert Reports under Section 329 BNSS (293 CrPC) and explain the scientific causes of negative chemical reports in true poisonings.'
    ],
    interactiveToolType: 'fsl_report_verifier',
    sections: [
      {
        id: 'm6-s1',
        heading: '6.1 Plant Poisons of Medico-Legal Importance in India (Complete Botanical Compendium)',
        badge: 'Plant Poisons',
        summary: 'Systematic pharmacognostic, clinical, autopsy, and chemical test profiles of all 16 syllabus plant poison groups.',
        contentBlocks: [
          {
            subtitle: 'Cerebral, Spinal & Cardiac Plant Poisons: Opium, Nux-Vomica, Dhatura, Atropa, Aconite, Kaner, Madar & Cannabis',
            body: 'Plant poisons represent a critical pillar of Indian medico-legal toxicology (homicide, suicide, road-poisoning stupefaction, criminal abortion, and cattle poisoning):',
            keyPoints: [
              '1. Opium (Afim — Dried latex incised from unripe capsules of Papaver somniferum; note ripe poppy seeds "Khas-khas" are non-poisonous culinary seeds!): Contains >25 alkaloids in two chemical groups combined with Meconic Acid: (a) Phenanthrene Narcotic Group: Morphine (~10%), Codeine (~0.5–1%), Thebaine (~0.3%, convulsant); (b) Benzylisoquinoline Smooth-Muscle Relaxant Group: Papaverine (~1%), Noscapine/Narcotine (~6%). Toxidrome: Pinpoint pupils (Miosis), bradypnea/central respiratory depression, coma, hypothermia, and Cheyne-Stokes respiration. Chemical Tests: Marquis Test (Purple-Violet for Morphine/Codeine), Husemann’s Test, Pellagri’s Test, and Ferric Chloride (FeCl3) Test for Meconic Acid (yields a deep blood-red colour of ferric meconate that is NOT discharged by boiling or adding HCl or Mercuric Chloride — distinguishing Opium from thiocyanates or acetates!). Antidote: Naloxone.',
              '2. Strychnos nux-vomica (Kuchila — Poison Nut): Flat, circular, disc-shaped, concavo-convex ash-grey seeds (~2.5 cm diameter, intense bitter taste) covered with radiating silky hairs, containing indole alkaloids Strychnine and Brucine (plus loganin; bark contains brucine and lacks strychnine, distinguishing it from Angostura bark). Mechanism: Strychnine competitively blocks postsynaptic Glycine chloride channels on Renshaw interneurons in the spinal cord anterior horn, causing violent symmetrical tetanic convulsions triggered by touch/noise/light: Risus sardonicus (fixed grinning facial spasm), Opisthotonus (body bowed backward on head and heels; or Emprosthotonus/Pleurothotonus), and epigastric squeezing pain while the patient remains completely conscious and mentally clear between spasms! Lethal in 1–2 crushed seeds (~15–50 mg strychnine; intact swallowed seeds pass unabsorbed due to hard pericarp). Resists putrefaction for years in exhumed viscera. Chemical Tests: Mandelin’s Test (Blue → Violet → Red-Orange), Dichromate + conc. H2SO4 Test (fading play of colours: Blue → Violet → Purple → Red → Orange → Yellow!), and Nitric Acid Test (turns Blood-Red with Brucine due to oxidation to cacotheline!).',
              '3. Dhatura (Datura fastuosa / metel / stramonium — Thorn Apple / "Roadside Poison") & 4. Atropa belladonna (Deadly Nightshade): All parts (especially Dhatura’s spherical spiny capsule "Dhature ka phal" containing ~500 yellowish-brown, kidney-shaped, laterally compressed, finely pitted seeds with a double-ridged convex border — differentiated from smooth flat rounded Chilli/Capsicum seeds!) contain Belladonna Tropane Alkaloids: l-Hyoscyamine, Atropine (dl-hyoscyamine), and l-Scopolamine (Hyoscine). Mechanism: Competitive blockade of central and peripheral Muscarinic ACh receptors causing the classic "8 D’s" Anticholinergic Stupefaction Syndrome: Dryness of mouth/throat, Dysphagia, Dysarthria, Dilated pupils (Mydriasis with loss of accommodation/diplopia), Dry hot flushed skin (hyperthermia), Drunken staggering gait, Delirium (muttering delirium with Carphologia — picking at imaginary threads on bedclothes and pill-rolling movements!), and Drowsiness progressing to coma, plus urinary retention. Used extensively by railway/highway criminals ("Thugs") mixed in tea/sweets/prasad to stupefy and rob passengers (Sec. 123 BNS). Chemical Test: Vitali-Morin Test (evaporate with fuming HNO3 on water bath + add freshly prepared alcoholic KOH → bright Violet colour!) and Gerrard’s Test (brick-red precipitate with mercuric chloride). Antidote: Physostigmine salicylate.',
              '5. Aconite (Aconitum napellus / Aconitum ferox — Monkshood / Bish / Mithazahar "Sweet Poison"): Dark conical tapering tuberous root (showing a stellate/star-shaped pink cambium on transverse cut section and sweetish taste followed by intense tingling/numbness of tongue — differentiated from cylindrical pungent Horseradish root!). Contains pseudo-alkaloids Aconitine, Mesaconitine, and Hypaconitine. Mechanism: Binds voltage-gated Na+ channels in an open state in myocardium and peripheral nerves, preventing repolarization. Clinical Hallmarks: Immediate tingling & numbness of lips, tongue, and pharynx spreading to fingertips, profuse salivation, Hippus (alternate rhythmic contraction and dilation of pupils!), Xanthopsia (yellow/green vision), and fatal bidirectional ventricular tachycardia/fibrillation. Forensic Caution: Aconitine is extremely labile and destroyed by putrefaction and alkaline common salt (preserve viscera in acidified rectified spirit!). Chemical Test: Alvarez test (bromine + HNO3 + KOH) & LC-MS/MS.',
              '6. Kaner — White/Pink Oleander (Nerium odorum / oleander: contains Oleandrin, Neriin, Folinerin) & Yellow Oleander (Cerbera thevetia / Cascabela thevetia: bell-shaped yellow flowers & triangular "Lucky Nut" fruits containing Thevetin A/B, Thevetoxin, and Cerberin): Potent Cardiac Glycosides that inhibit myocardial membrane Na+/K+-ATPase pump, causing intracellular Ca2+ overload, severe hyperkalemia (>6.0 mEq/L), vomiting, sinus bradycardia, complete AV heart block, and ventricular fibrillation. Used in rural suicides and criminal abortion. Chemical Tests: Keller-Kiliani Test (digitoxose sugar ring), Baljet Test (picric acid + NaOH → orange-red), Legal’s Test, and Raymond’s Test. Antidote: Digoxin-specific Fab antibody fragments (Digibind) + Atropine/Pacemaker.',
              '7. Madar (Calotropis gigantea [purple flowers] & Calotropis procera [white flowers] — Akdo / Swallow-wort): Thick acrid milky latex exudes when leaves or stems are broken, containing cardiac glycosides/steroid toxins Uscharin, Calotoxin, Calactin, and Calotropin (plus trypsin-like protease Calotropain). Local contact causes severe conjunctivitis/keratitis (used by malingerers to feign eye disease) and skin vesication; oral ingestion causes burning GI pain, dilated pupils, tetanic convulsions, and digoxin-like cardiotoxicity; applied locally on "abortion sticks" for criminal abortion and smeared on leather needles for cattle poisoning. Chemical Test: Conc. H2SO4 + Froehde/Liebermann-Burchard steroid reaction.',
              '8. Cannabis (Cannabis sativa — Bhang, Ganja, Charas): Cerebral deliriant/inebriant acting via Δ9-THC at CB1 receptors; produces euphoria, conjunctival injection, time-space distortion, increased appetite, and occasionally "Run Amok" (acute homicidal manic impulse following toxic cannabis psychosis).'
            ]
          },
          {
            subtitle: 'Irritant, Adulterant, Vesicant & Fungal/Glycosidic Plant Poisons: Argemone, Abrus, Ricinus, Bhilawa, Plumbago, Ergot, Cyanogenetic Glycosides & Mushrooms',
            body: 'The remaining eight Unit V botanical classes produce distinctive vascular, ribosome-inactivating, vesicant, or hepatorenal syndromes:',
            keyPoints: [
              '9. Mexican Prickly Poppy (Argemone mexicana — Satyanashi / Bhatkataiya / Kateli): Prickly thistle-like weed with yellow flowers and dark brown-black spherical globular seeds bearing a netted/reticulated surface and prominent raphe that closely resemble Mustard Seeds (Brassica nigra)! Intentional or accidental adulteration of Mustard Oil with Argemone Oil (containing benzophenanthridine isoquinoline alkaloids Sanguinarine and Dihydrosanguinarine) causes "Epidemic Dropsy": Sanguinarine inhibits Na+/K+-ATPase and oxidizes pyruvate, causing generalized capillary endothelial leakage, bilateral pitting pedal edema, tender erythematous skin nodules (erythema/telangiectasia), non-inflammatory Open-Angle Glaucoma (visual loss), high-output congestive heart failure, and breathlessness without albuminuria! Confirmatory Chemical Tests for Argemone Oil: (a) Nitric Acid Test (shake oil with equal volume of conc. HNO3 → crimson-orange to reddish-brown colour in lower acid layer); (b) Ferric Chloride Test (shake oil in HCl + alcohol with FeCl3 → reddish-brown acicular needle crystals of ferric sanguinarine!); (c) Cupric Acetate Test & Paper Chromatography / HPTLC (bright orange fluorescence under 366 nm UV).',
              '10. Abrus precatorius (Ratti / Gunja / Jequirity / Rosary Pea): Oval scarlet-red seeds with a jet-black spot at one pole (or white/black varieties; uniform average weight ~105–120 mg used historically by Indian goldsmiths as the "Ratti" weight!). Contains the heat-labile Toxalbumin Abrin (Type II Ribosome-Inactivating Protein: A-chain depurinates 28S rRNA of 60S ribosome halting protein synthesis; B-chain binds galactose and agglutinates RBCs) plus abric acid and N-methyltryptophan (abrine). Boiling or cooking destroys Abrin, and swallowing whole unbroken seeds is harmless; however, chewing 1–2 raw seeds causes fatal hemorrhagic gastroenteritis, OR decorticating and grinding seeds with madar latex/opium/dhatura into sharp sun-dried conical needles ("Suis" / "Sutari", 15–20 mm long, ~90–120 mg) driven under the skin of cattle (to obtain cheap hides) or humans causes massive local edema, ecchymosis, and fatal necrosis closely mimicking a Viperid Snakebite! Differentiated at autopsy by dissecting the puncture site to recover fragmentary wooden/seed "Sui" remnants and performing anti-abrin agglutination/LC-MS.',
              '11. Ricinus communis (Arandi / Castor Oil Plant): Mottled oval glossy brown seeds contain the potent Toxalbumin Ricin inside the solid endosperm/press-cake (note: extracted cold-pressed Castor Oil DOES NOT contain Ricin, containing instead purgative Ricinoleic acid!). Chewing 5–10 raw castor seeds (or parenteral assassination via ricin-coated pellets, e.g., Georgi Markov case) causes burning throat pain, hemorrhagic vomiting/purging, hemolysis, and multiorgan failure (analytical biomarker in urine: Ricinine alkaloid via LC-MS/MS).',
              '12. Bhilawa (Semecarpus anacardium — Marking Nut): Black, heart-shaped, laterally flattened nut with a rough pericarp containing black acrid oily juice used by washermen (Dhobis) with lime as indelible laundry marking ink ("Dhobi-mark"). Active principles: Semecarpol (monohydroxy phenol) and Bhilawanol (urushiol-like catechol). Direct skin contact produces painful, itchy, eczematous blisters containing acrid serum that turn bluish-black ("Artificial Bruise")—frequently applied maliciously to fabricate false assault charges! Differentiated from a true traumatic bruise (ecchymosis) because a Bhilawa artificial bruise has a raised vesicular/blistered margin, dark acrid fluid, itching, absence of Hemosiderin/Bilirubin colour changes, and turns Deep Bluish-Green/Black when dabbed with Alcoholic Potassium Hydroxide (KOH)!',
              '13. Plumbago (Plumbago zeylanica [White Chitrak] & Plumbago rosea [Lal Chitrak]): Crushable roots contain the naphthoquinone glycoside Plumbagin, a powerful local vesicant and uterine smooth-muscle stimulant. Applied to skin to fabricate artificial bruises, or applied on an "abortion stick" into the cervical os to induce criminal abortion (causing pelvic peritonitis and septic shock). Chemical Test: Turns bright Crimson-Red / Purple upon adding aqueous Alkali (NaOH/NH4OH).',
              '14. Poisonous Fungi — Ergot (Claviceps purpurea): Dark purple-black banana-shaped fungal sclerotium parasitizing rye, wheat, and bajra grains, containing Ergot Alkaloids (Ergotamine, Ergometrine/Ergonovine, Ergotoxine). Potent alpha-adrenergic vasoconstrictors and oxytocics (used as illicit abortifacients). Chronic ingestion of contaminated grain causes "Ergotism" ("St. Anthony’s Fire"): (a) Gangrenous Ergotism (intense vasospasm causing dry gangrene and auto-amputation of fingers/toes with burning pain) and (b) Convulsive Ergotism (formication — sensation of insects crawling under the skin, painful tonic spasms, and psychosis). Chemical Test: Van Urk’s / Ehrlich’s Reagent (p-DMAB → deep blue-violet).',
              '15. Cyanogenetic (Cyanogenic) Glycosides: Plant glycosides that release lethal Hydrocyanic Acid (HCN) upon enzymatic hydrolysis by endogenous beta-glucosidase (emulsin) and hydroxynitrile lyase when seeds/tubers are crushed or chewed in the presence of moisture: Amygdalin (in Bitter Almonds Prunus amygdalus, Peach, Apricot, Apple, Plum, and Cherry-laurel kernels/leaves), Linamarin & Lotaustralin (in Cassava / Tapioca roots Manihot esculenta and Lima beans), Taxiphyllin (in raw Bamboo shoots), and Dhurrin (in young Sorghum/Jowar fodder causing acute cattle cyanide poisoning). Produce classical histotoxic Cyanide asphyxia, bitter almond breath odor, and positive Conway microdiffusion / Prussian Blue tests.',
              '16. Poisonous Mushrooms (Mycetismus): (a) Cyclopeptide / Amatoxin Group (Amanita phalloides "Death Cap", Amanita virosa "Destroying Angel", Galerina): Contain heat-stable bicyclic octapeptides Alpha-Amanitin (inhibits eukaryotic RNA Polymerase II, halting mRNA transcription!) and Phalloidin (polymerizes F-actin). Characteristic Diphasic Clinical Course: Latent asymptomatic period of 6–24 hours → violent cholera-like gastroenteritis → apparent clinical improvement at 24–36 hours → fulminant hepatic necrosis, coagulopathy, and acute renal failure at 3–5 days! Bedside Test on mushroom cap: Meixner Test (drop of juice on newsprint lignin + conc. HCl → blue spot for amatoxins). Antidote: IV Silibinin (Milk Thistle), High-dose Penicillin G, and N-Acetylcysteine; (b) Isoxazole Group (Amanita muscaria "Fly Agaric", Amanita pantherina): Contain Ibotenic Acid and Muscimol (GABAA agonist / glutamate agonist causing delirium and visual hallucinations, NOT cholinergic!); (c) Muscarine Group (Inocybe and Clitocybe species): Contain quaternary amine Muscarine causing rapid SLUDGE cholinergic crisis within 30–120 minutes (treated with Atropine); (d) Gyromitrin Group (Gyromitra esculenta "False Morel"): Hydrolyzes to Monomethylhydrazine (MMH), depleting pyridoxal phosphate (Vitamin B6) and causing seizures + hemolysis (Antidote: IV Pyridoxine / Vitamin B6); (e) Coprine Group (Coprinopsis atramentaria "Inky Cap"): Inhibits ALDH2 causing a Disulfiram-like reaction with alcohol; (f) Psilocybin / Psilocin Group (Psilocybe "Magic Mushrooms"): Indole 5-HT2A hallucinogens.'
            ]
          }
        ],
        referenceTable: {
          caption: 'Table 6.1: Plant Poisons — Active Toxins, Clinical/Forensic Hallmarks & Confirmatory Tests',
          headers: ['Plant Poison (Common & Botanical Name)', 'Active Toxin / Alkaloid', 'Characteristic Forensic / Clinical Hallmark', 'Diagnostic Chemical Test & Antidote'],
          rows: [
            ['Opium (Papaver somniferum)', 'Morphine, Codeine, Thebaine + Meconic Acid', 'Miosis, respiratory depression, coma; raw latex has meconic acid', 'Marquis (Purple) + FeCl3 (Blood-red with Meconic acid) | Naloxone'],
            ['Kuchila (Strychnos nux-vomica)', 'Strychnine & Brucine (Indole alkaloids)', 'Spinal tetanic spasms, Opisthotonus, Risus sardonicus, clear mind', 'Mandelin (Violet→Orange) + K2Cr2O7 play of colours + HNO3 (Brucine red)'],
            ['Mexican Prickly Poppy (Argemone mexicana)', 'Sanguinarine & Dihydrosanguinarine', 'Mustard oil adulteration → Epidemic Dropsy (pedal edema, glaucoma, heart failure)', 'HNO3 (Crimson-orange) + FeCl3 (Red acicular crystals) + UV orange fluorescence'],
            ['Dhatura & Atropa belladonna', 'Atropine, Hyoscyamine, Scopolamine', '8 D’s Anticholinergic syndrome, Carphologia delirium, railway stupefaction', 'Vitali-Morin Test (Fuming HNO3 + alc. KOH → Violet) | Physostigmine'],
            ['Aconite (Aconitum napellus / ferox)', 'Aconitine (Diterpenoid pseudo-alkaloid)', 'Tingling/numbness of tongue, Hippus pupils, Xanthopsia, bidirectional VT', 'Labile in alkali (use acidified spirit); Alvarez test / LC-MS/MS'],
            ['Kaner (Nerium & Cerbera thevetia)', 'Oleandrin, Thevetin A/B, Cerberin', 'Na+/K+-ATPase block, hyperkalemia, AV block (Yellow & White Oleander)', 'Keller-Kiliani / Baljet / Legal test | Digoxin-specific Fab'],
            ['Madar (Calotropis gigantea / procera)', 'Uscharin, Calotoxin, Calotropin', 'Acrid milky latex causing keratitis, vesication, abortion stick & cardiotoxicity', 'Liebermann-Burchard / Froehde steroid test'],
            ['Ratti (Abrus) & Castor (Ricinus)', 'Abrin & Ricin (Toxalbumins / RIPs)', 'Inhibit 60S ribosome (28S rRNA); Abrus "Sui" needles mimic viper bite', 'Hemagglutination / ELISA / LC-MS (Ricinine / Abrine biomarkers)'],
            ['Bhilawa (Semecarpus) & Plumbago', 'Semecarpol/Bhilawanol & Plumbagin', 'Artificial bruise (vesicular, itchy) & abortion stick', 'Alcoholic KOH turns Bhilawa bluish-green; Alkali turns Plumbagin crimson'],
            ['Ergot (Claviceps) & Amanita phalloides', 'Ergotamine/Ergometrine & α-Amanitin', 'St. Anthony’s Fire gangrene (Ergot); Delayed 24h hepatorenal necrosis (Amanita)', 'Van Urk p-DMAB (Ergot); Meixner lignin-HCl blue test (Amanita) | Silibinin']
          ]
        }
      },
      {
        id: 'm6-s2',
        heading: '6.2 Animal & Venomous Poisons (Snake, Cantharidin, Scorpion, Marine) and Food Poisoning (Bacterial & Chemical)',
        badge: 'Animal & Food Toxins',
        summary: 'India’s Big Four venomous snakes (20WBCT, ELISA), Cantharidin (Spanish fly), Indian Red Scorpion, Marine toxins, and Bacterial/Chemical Food Poisoning.',
        contentBlocks: [
          {
            subtitle: 'Animal Poisons: Snake, Cantharidin, Scorpion, Insects & Marine Biotoxins',
            body: 'Forensic zootoxinology investigates fatal envenomations, aphrodisiac/vesicant poisonings, and marine biotoxins:',
            keyPoints: [
              '1. Snake Venom ("The Big Four" of India): Comprises two Elapidae (Neurotoxic) — Indian Spectacled Cobra (Naja naja: binocular hood mark, postsynaptic α-neurotoxin curare-like nicotinic ACh receptor block + cardiotoxin/PLA2 local necrosis; responds to IV Polyvalent ASV + Neostigmine-Atropine!) and Common Krait (Bungarus caeruleus: steel-blue body with paired white arches, enlarged hexagonal mid-dorsal scales; painless nocturnal bites inside floor bedding causing abdominal pain and progressive ptosis/ophthalmoplegia/respiratory paralysis via presynaptic β-bungarotoxin that destroys motor nerve terminal ACh vesicles — poorly responsive to neostigmine once paralytic!) — and two Viperidae (Vasculotoxic / Hemotoxic) — Russell’s Viper (Daboia russelii: three rows of diamond/chain-like oval spots; Factor V & X procoagulant metalloproteinases causing Venom-Induced Consumption Coagulopathy [VICC], gingival hemorrhage, acute kidney injury/bilateral renal cortical necrosis, and pituitary infarction) and Saw-Scaled Viper (Echis carinatus: wavy white lateral line & bird-foot head mark; Ecarin prothrombin activator causing prolonged defibrination syndrome). Sea Snakes (Hydrophiidae: Enhydrina schistosa) are Myotoxic (rhabdomyolysis, trismus, dark brown myoglobinuria, hyperkalemia). Clinical & Autopsy Protocol: Perform the Bedside 20-Minute Whole Blood Clotting Test (20WBCT) in a new, clean, dry, vessel-wall-uncoated glass tube (incoagulable liquid blood at 20 min confirms Viperid VICC and mandates Polyvalent ASV!). At autopsy, excise a 2 × 2 cm block of skin and subcutaneous tissue encompassing the fang puncture marks (plus a control skin sample from the opposite limb) and collect wound swabs/aspirates for Double-Sandwich ELISA Snake Venom Detection.',
              '2. Cantharidin (Spanish Fly / Blister Beetle — Lytta vesicatoria & Indian Mylabris cichorii): Dried iridescent shiny emerald-green beetles contain the bicyclic terpenoid anhydride Cantharidin (0.6–1.5%; lethal dose ~15–50 mg or 1.5 g powdered beetles). Historically misused as a folk aphrodisiac (because its excretion irritates the urethral mucosa causing reflex priapism!) and criminal abortifacient. Clinical & Autopsy Hallmarks: Intense burning blisters (vesication) on lips, tongue, palate, and esophagus, violent hematemesis, strangury (painful drop-by-drop passage of blood-stained urine), priapism, and acute tubular/glomerular renal necrosis. At autopsy, shining green iridescent particles of beetle elytra (wing-covers) are visible adhering to gastric mucosa under a hand lens! Isolated by Acid-Ether/Chloroform extraction and confirmed by GC-MS or sublimation of rhombic crystals (which raise a blister if applied in oil to skin).',
              '3. Scorpion Venom (Buthus / Mesobuthus tamulus — Indian Red Scorpion & Palamneus swammerdami — Giant Black Scorpion): Indian Red Scorpion (Mesobuthus tamulus, prevalent in Konkan Maharashtra, Gujarat, AP, Tamil Nadu) possesses a bulbous telson stinger injecting neurotoxic polypeptides (Iberiotoxin / Tamulustoxin) that block voltage-gated K+ channels and prolong neuronal Na+ channel opening, triggering a massive "Autonomic Storm": Initial transient cholinergic phase (profuse sweating, salivation, vomiting, priapism in boys, bradycardia) followed rapidly by a sustained Alpha-1 Adrenergic Catecholamine Storm (severe hypertension, vasoconstriction, cold clammy extremities, toxic myocarditis, acute left ventricular failure, and massive pink frothy Pulmonary Edema!). Specific Pharmacological Antidote: Oral/nasogastric Prazosin (selective postsynaptic Alpha-1 adrenergic blocker — the "physiological antidote" to scorpion autonomic storm!) + Scorpion Antivenom.',
              '4. Hymenoptera Insects (Honeybees, Wasps, Hornets) & Marine Biotoxins: Mass bee/hornet stings inject Melittin, Phospholipase A2, and Histamine causing IgE anaphylaxis OR direct rhabdomyolysis and hemolysis. Marine Toxins: Tetrodotoxin (TTX in Pufferfish Fugu ovaries/liver — guanidinium toxin blocking outer pore of voltage-gated Na+ channels causing perioral paresthesia and ascending respiratory paralysis with intact consciousness), Saxitoxin (Paralytic Shellfish Poisoning from dinoflagellate "Red Tide" Alexandrium), and Ciguatoxin (reef fish barracuda/snapper — opens Na+ channels causing pathognomonic "cold-to-hot temperature reversal dysesthesia").'
            ]
          },
          {
            subtitle: 'Food Poisoning: Bacterial, Chemical & Mycotoxins + FSSAI vs. FSL Jurisdictional Split',
            body: 'Outbreaks of acute gastroenteritis or neuroparalysis following a shared meal require distinguishing infectious/toxigenic bacterial food poisoning from chemical poisonings or adulteration:',
            keyPoints: [
              '1. Bacterial Food Poisoning: (a) Clostridium botulinum (Botulism — Anaerobic spore-forming bacillus in improperly canned/fermented foods, sausages, honey in infants): Heat-labile neurotoxin (types A, B, E; destroyed by boiling at 100°C for 10 min!) cleaves SNARE proteins (SNAP-25/Synaptobrevin) at presynaptic cholinergic nerve terminals, blocking Acetylcholine release and causing descending symmetrical flaccid paralysis (12–36 hr onset): Diplopia, blurred vision, ptosis, dysphagia, dysarthria ("bulbar palsies"), dry mouth, and respiratory arrest with normal sensorium and NO fever! Antidote: Equine Heptavalent Botulinum Antitoxin; (b) Staphylococcus aureus (Enterotoxins A–E in cream pastries, khoa/mawa sweets, milk products): Pre-formed HEAT-STABLE superantigen enterotoxin (survives boiling!) acts on vagal/medullary emetic centers causing explosive projectile vomiting and abdominal cramps within 1 to 6 hours (shortest incubation period!); (c) Bacillus cereus: Emetic form (pre-formed heat-stable cereulide toxin in reheated fried rice; 1–5 hr onset mimicking S. aureus) vs. Diarrheal form (heat-labile enterotoxin in meats/gravies; 8–16 hr onset); (d) Salmonella enteritidis / typhimurium, Clostridium perfringens, and Vibrio parahaemolyticus: Invasive/enterotoxic gastroenteritis with 12–48 hr incubation, fever, and inflammatory diarrhea.',
              '2. Chemical, Adulterant & Mycotoxin Food Poisoning: Acute metallic leaching from un-tinned brass/copper vessels (Copper/Zinc/Antimony poisoning from storing sour curd/buttermilk or acidic fruit juices), accidental mixing of pesticides (OPs, Barium carbonate rodenticide, or Sodium fluoride mistaken for flour/salt), Lathyrism (chronic consumption of Kesari dal Lathyrus sativus containing neurotoxin BOAA [β-N-oxalylamino-L-alanine] causing irreversible spastic paraparesis of lower limbs), and Aflatoxicosis (Aspergillus flavus on damp groundnuts/maize producing Aflatoxin B1 → acute hemorrhagic hepatitis and hepatocellular carcinoma).',
              '3. FSSAI Referral Labs vs. State/Central FSL Jurisdiction: Regulatory food quality, commercial adulteration (e.g., milk urea/detergent, turmeric metanil yellow/lead chromate, edible oil argemone under the Food Safety and Standards Act, 2006) is analyzed by designated Food Analysts and Central Food Laboratories (CFLs) under FSSAI, whereas suspected homicidal, suicidal, or mass criminal food poisoning involving illness or death (Sec. 274/123/103 BNS) is investigated by police and analyzed by the Toxicology Division of the State/Central Forensic Science Laboratory (SFSL/CFSL).'
            ]
          }
        ]
      },
      {
        id: 'm6-s3',
        heading: '6.3 Hair Analysis for Drugs/Chronic Poisoning, Drug Metabolism & Section 329 BNSS Medico-Legal Reporting',
        badge: 'Specialised Matrices & Law',
        summary: 'Posterior vertex hair segmentation (1 cm/month), decontamination washes, CYP450 metabolism & EtG/EtS interpretation, and Section 329 BNSS expert reports.',
        contentBlocks: [
          {
            subtitle: 'Hair Analysis for Drugs and Chronic Poisoning & Drug Metabolism / Postmortem Redistribution',
            body: 'When blood (hours to 1–2 days) and urine (2–5 days) have cleared a drug—such as in delayed reporting of Drug-Facilitated Sexual Assault (DFSA) or chronic heavy metal poisoning—Scalp Hair provides a retrospective calendar:',
            formula: 'Chronological Time Prior to Collection (Months) = Hair Segment Distance from Scalp Root (cm) / Average Growth Rate (1.0 cm/month)',
            keyPoints: [
              '1. Society of Hair Testing (SoHT) & SOFT Protocol: A pencil-thick lock (~100–200 strands) of scalp hair is cut (or plucked with roots for thallium/arsenic) from the Posterior Vertex (where blood supply is richest and ~85% of follicles are in uniform active Anagen growth at ~1.0 cm/month, range 0.7–1.4 cm/month). Because the hair follicle bulb sits 3–4 mm below the epidermis, a single drug dose takes 7–14 days to emerge above the scalp surface. In the laboratory, hair is aligned root-to-tip, segmented into 1.0 cm (or 0.5 cm) sections, and subjected to Sequential Decontamination Washes (dichloromethane/acetone + aqueous buffer) to remove external environmental smoke or sweat contamination before enzymatic/acid hydrolysis and LC-MS/MS or ICP-MS analysis. Systemic bloodstream incorporation is proven by: (a) a low Wash-to-Extract Ratio (<0.1), (b) detection of endogenous hepatic metabolites inside the hair shaft (e.g., Cocaethylene, Norcocaine, or 6-MAM/Morphine ratio > 0.05), and (c) adhering to SoHT cut-offs (e.g., Cocaine ≥ 500 pg/mg, 6-MAM ≥ 200 pg/mg, THC ≥ 50 pg/mg, EtG ≥ 30 pg/mg for chronic excessive drinking). Basic lipophilic drugs bind strongly to acidic eumelanin pigment (dark hair binds 5–10× more cocaine/codeine than blonde/grey hair), whereas acidic drugs incorporate poorly.',
              '2. Drug Metabolism, Parent-to-Metabolite Ratios & Resolving Postmortem Microbial Ethanol: In postmortem interpretation, high Parent-to-Metabolite ratios in peripheral blood indicate acute rapid overdose (death occurred before significant hepatic Phase I/II conversion), whereas low Parent-to-Metabolite ratios indicate prolonged survival after ingestion or chronic therapy. In decomposed/submerged bodies, microbes (Candida albicans, Clostridium perfringens) ferment glucose into ethanol (up to 50–150 mg/dL in putrefied blood). Antemortem drinking is definitively differentiated from postmortem microbial fermentation by: (a) Concordant ethanol in Vitreous Humor (Vitreous : Blood ≈ 1.15 : 1; zero in microbial fermentation), (b) Non-oxidative hepatic Phase II conjugates Ethyl Glucuronide (EtG ≥ 0.1–0.5 mg/L) and Ethyl Sulfate (EtS — NEVER synthesized by bacteria postmortem!), and (c) Urinary Serotonin metabolite ratio 5-HTOL / 5-HIAA > 15 pmol/nmol.'
            ]
          },
          {
            subtitle: 'Section 329 BNSS Courtroom Reporting & Explaining Negative FSL Reports in True Poisoning',
            body: 'Under Section 329 of the Bharatiya Nagarik Suraksha Sanhita (BNSS), 2023 [replacing Section 293 of the CrPC, 1973], any document purporting to be a report under the hand of a Government Scientific Expert (Chemical Examiner / Assistant Chemical Examiner to the Government, or Director / Deputy Director / Assistant Director of a Central or State Forensic Science Laboratory) upon any matter or thing duly submitted to them for examination and report may be used as evidence in any inquiry, trial, or other proceeding without calling the expert initially, though the Court may summon and examine the expert on chain of custody, method validation, and interpretation. In courtroom cross-examination, the toxicologist must also explain why a "Negative for Poison" FSL Chemical Report does NOT rule out death by poisoning:',
            keyPoints: [
              'Five Medico-Legal Reasons for a Negative Chemical Report in True Poisoning: (1) Prolonged Hospital Survival & Complete Elimination: If the victim survives in the ICU for 3–10 days before dying of hypoxic brain injury or hepatorenal failure (e.g., Paracetamol, Paraquat, Organophosphates, Amanita phalloides), the parent poison is completely metabolized and excreted prior to autopsy; (2) Early Vomiting, Purging & Gastric Lavage: Evacuation of unabsorbed stomach contents coupled with minimal residual tissue levels; (3) Volatility & Improper Sealing: Escape of volatile gases (HCN, Phosphine PH3, CO, volatile anesthetics) from unsealed jars or tubes lacking a liquid paraffin layer; (4) Postmortem Hydrolysis & Putrefactive Destruction: Enzymatic esterase or bacterial alkaline breakdown of labile toxins (Aconitine, Succinylcholine, Cocaine, Heroin, GHB, Plumbagin) when viscera are unpreserved or exposed to heat; (5) Ultra-Potent Biotoxins / Biologicals Outside Routine Stas-Otto/GC-MS Scope: Toxins lethal in microgram/nanogram doses (Snake Venoms, Botulinum toxin, Tetrodotoxin, Exogenous Insulin [requires Serum Insulin : C-Peptide ratio > 1.0!], Potassium Chloride IV injection, or novel synthetic Nitazene/Fentanyl analogs) require targeted immunoassays or LC-QTOF-MS.'
            ]
          }
        ],
        referenceTable: {
          caption: 'Table 6.2: Specialised Forensic Matrices, Animal Venoms & Medico-Legal Biomarker Reference',
          headers: ['Forensic Scenario / Toxin', 'Target Matrix & Collection Rule', 'Confirmatory Test / Biomarker', 'Medico-Legal Interpretation Standard'],
          rows: [
            ['Decomposed Body with Blood Ethanol', 'Femoral Blood + Vitreous Humor + Urine', 'Ethyl Glucuronide (EtG) & Ethyl Sulfate (EtS) + Vitreous Ethanol', 'Negative Vitreous + Negative EtG/EtS = Postmortem Microbial Fermentation Artifact'],
            ['Chronic Metal / Delayed DFSA', 'Posterior Vertex Scalp Hair (segmented 1 cm = 1 month)', 'SoHT Wash Protocol + ICP-MS (As, Tl) or LC-MS/MS (Drugs/Metabolites)', 'Distance from root (cm) / 1.0 cm/month = Months prior to collection'],
            ['Viperid vs. Elapid Snakebite', 'Bite-site skin/subcutis block + Control skin + Blood', 'Bedside 20WBCT (Viper VICC) + Double-Sandwich ELISA for Venom', 'Cobra (postsynaptic) responds to Neostigmine; Krait (presynaptic) does not'],
            ['Cantharidin / Scorpion Sting', 'Stomach mucosa (elytra) / Lung edema fluid', 'GC-MS for Cantharidin; Clinical autonomic storm (Scorpion)', 'Prazosin is specific physiological α1-blocker antidote for Indian Red Scorpion'],
            ['Exogenous Insulin Homicide', 'Injection-site tissue + Postmortem Serum (frozen)', 'Chemiluminescent Immunoassay / LC-MS for Insulin & C-Peptide', 'High Insulin with suppressed C-Peptide (Molar ratio > 1.0) proves exogenous injection'],
            ['FSL Expert Report Admissibility', 'Sealed Viscera Bottles I–IV + Control Preservative Blank', 'Dual orthogonal techniques (Presumptive + GC-MS/LC-MS/MS/ICP-MS)', 'Admissible under Section 329 BNSS, 2023 (formerly Section 293 CrPC)']
          ]
        }
      }
    ],
    quiz: [
      {
        id: 'm6-q1',
        question: 'Consumption of Mustard Oil adulterated with seeds/oil of Mexican Prickly Poppy (Argemone mexicana) causes "Epidemic Dropsy" (bilateral pitting pedal edema, erythematous skin nodules, non-inflammatory open-angle glaucoma, and high-output heart failure). Which toxic isoquinoline alkaloids are responsible, and which chemical test confirms Argemone oil?',
        options: [
          'Sanguinarine and Dihydrosanguinarine; confirmed by the Nitric Acid Test (crimson-orange colour) and Ferric Chloride Test (reddish-brown needle crystals of ferric sanguinarine)',
          'Strychnine and Brucine; confirmed by Mandelin’s test',
          'Atropine and Scopolamine; confirmed by Vitali-Morin test',
          'Ricin and Abrin; confirmed by Reinsch test'
        ],
        correctAnswer: 0,
        explanation: 'Argemone mexicana seeds closely resemble mustard seeds and contain Sanguinarine and Dihydrosanguinarine, which cause capillary leakage (Epidemic Dropsy) and give positive Nitric Acid (crimson-orange) and Ferric Chloride (red acicular crystal) tests.',
        referenceTopic: '6.1 Plant Poisons (Mexican Prickly Poppy / Argemone)'
      },
      {
        id: 'm6-q2',
        question: 'In a suspected case of fabricated assault, a complainant presents with a dark bluish-black blistered patch on the forearm. How does the Forensic Medical Officer prove that this lesion is an "Artificial Bruise" caused by Bhilawa (Semecarpus anacardium / Marking Nut) juice rather than a true traumatic contusion?',
        options: [
          'A Bhilawa artificial bruise exhibits a raised vesicular/blistered margin with acrid serum, severe itching, absence of hemosiderin/bilirubin chronological colour changes, and turns deep Bluish-Green/Black when dabbed with Alcoholic Potassium Hydroxide (KOH)',
          'Bhilawa bruises only occur on the soles of the feet',
          'True traumatic bruises turn bright purple with nitric acid',
          'Bhilawa contains metallic mercury globules'
        ],
        correctAnswer: 0,
        explanation: 'Semecarpol and bhilawanol in Marking Nut (Bhilawa) produce an itchy vesicating dermatitis that mimics a contusion but turns bluish-green/black upon applying alcoholic KOH and lacks extravasated RBC breakdown pigments.',
        referenceTopic: '6.1 Plant Poisons (Bhilawa & Plumbago)'
      },
      {
        id: 'm6-q3',
        question: 'In raw Opium latex (Papaver somniferum), which specific organic acid accompanies Morphine and Codeine and yields a deep blood-red colour with Ferric Chloride (FeCl3) that is NOT discharged by boiling or adding hydrochloric acid or mercuric chloride?',
        options: [
          'Meconic Acid',
          'Tartaric Acid',
          'Oxalic Acid',
          'Formic Acid'
        ],
        correctAnswer: 0,
        explanation: 'Meconic acid is uniquely present in Opium latex (forming ferric meconate blood-red complex with FeCl3 that persists on boiling or adding HgCl2), distinguishing crude Opium ingestion from pure pharmaceutical Morphine injection.',
        referenceTopic: '6.1 Plant Poisons (Opium)'
      },
      {
        id: 'm6-q4',
        question: 'Which plant poison utilizes decorticated scarlet-red seeds ground into sun-dried conical needles ("Suis" / "Sutari") driven subcutaneously into cattle or human victims to produce fatal local hemorrhagic necrosis mimicking a Viperid snakebite, and what is its active toxin?',
        options: [
          'Abrus precatorius (Ratti / Jequirity); active toxalbumin is Abrin (which depurinates 28S rRNA of the 60S ribosomal subunit)',
          'Strychnos nux-vomica (Kuchila); active alkaloid is Strychnine',
          'Aconitum napellus (Mithazahar); active toxin is Aconitine',
          'Claviceps purpurea (Ergot); active toxin is Ergotamine'
        ],
        correctAnswer: 0,
        explanation: 'Abrus precatorius (Ratti) seeds contain the ribosome-inactivating toxalbumin Abrin; when fashioned into sharp "Sui" needles and injected parenterally, Abrin causes lethal local edema, oozing, and necrosis mimicking viper envenomation.',
        referenceTopic: '6.1 Plant Poisons (Abrus & Ricinus)'
      },
      {
        id: 'm6-q5',
        question: 'Ingestion of which poisonous mushroom species causes a characteristic diphasic illness—a 6 to 24 hour latent period before cholera-like diarrhea, followed by transient apparent recovery and then fulminant hepatorenal necrosis at days 3–5 due to inhibition of eukaryotic RNA Polymerase II by Alpha-Amanitin?',
        options: [
          'Amanita phalloides ("Death Cap")',
          'Psilocybe cubensis',
          'Coprinopsis atramentaria ("Inky Cap")',
          'Clitocybe dealbata'
        ],
        correctAnswer: 0,
        explanation: 'Amanita phalloides contains heat-stable cyclopeptide Amatoxins (alpha-amanitin inhibits RNA Polymerase II) and Phalloidin, producing delayed hepatorenal failure detected by the Meixner newspaper-HCl blue test and treated with Silibinin.',
        referenceTopic: '6.1 Plant Poisons (Poisonous Mushrooms)'
      },
      {
        id: 'm6-q6',
        question: 'Why does neuroparalysis from an Indian Spectacled Cobra (Naja naja) bite respond favorably to intravenous Neostigmine + Atropine therapy alongside Polyvalent Anti-Snake Venom (ASV), whereas Common Krait (Bungarus caeruleus) neuroparalysis frequently fails to respond to Neostigmine?',
        options: [
          'Cobra alpha-neurotoxin acts postsynaptically (reversibly blocking muscle nicotinic ACh receptors like curare), whereas Krait beta-bungarotoxin acts presynaptically via phospholipase A2 to destroy synaptic vesicles and deplete acetylcholine at motor nerve terminals',
          'Krait venom only causes disseminated intravascular coagulation without neurotoxicity',
          'Cobra venom is purely a nephrotoxin',
          'Neostigmine is destroyed by Krait scales'
        ],
        correctAnswer: 0,
        explanation: 'Postsynaptic competitive blockade by Cobra α-neurotoxin is overcome by increasing synaptic ACh with Neostigmine, whereas presynaptic nerve-terminal destruction by Krait β-bungarotoxin depletes ACh vesicles.',
        referenceTopic: '6.2 Animal Poisons (Snake Venoms)'
      },
      {
        id: 'm6-q7',
        question: 'A child stung by an Indian Red Scorpion (Mesobuthus tamulus) develops profuse sweating, priapism, severe hypertension, toxic myocarditis, and pink frothy pulmonary edema ("autonomic storm"). Which selective Alpha-1 adrenergic blocker serves as the specific physiological antidote?',
        options: [
          'Prazosin',
          'Propranolol',
          'Naloxone',
          'Physostigmine'
        ],
        correctAnswer: 0,
        explanation: 'Oral/nasogastric Prazosin (a postsynaptic alpha-1 adrenergic receptor antagonist) reverses the massive catecholamine vasoconstriction, pulmonary edema, and myocardial strain caused by Mesobuthus tamulus venom.',
        referenceTopic: '6.2 Animal Poisons (Scorpion & Cantharidin)'
      },
      {
        id: 'm6-q8',
        question: 'A decomposed body recovered from water after 5 days exhibits a femoral blood ethanol level of 70 mg/dL, but Vitreous Humor ethanol is 0 mg/dL and urinary Ethyl Glucuronide (EtG) and Ethyl Sulfate (EtS) are 0.0 mg/L. What is the definitive forensic conclusion?',
        options: [
          'The 70 mg/dL blood ethanol is entirely an artifact of postmortem microbial fermentation (no antemortem alcohol consumption occurred)',
          'The deceased consumed alcohol 2 minutes before death',
          'Vitreous humor destroys EtG after death',
          'Bacteria convert EtG into methanol'
        ],
        correctAnswer: 0,
        explanation: 'EtG and EtS are hepatic Phase II conjugates formed only in vivo and never synthesized by fermentative microbes. Negative vitreous ethanol + negative EtG/EtS proves postmortem microbial fermentation.',
        referenceTopic: '6.3 Drug Metabolism & Postmortem Ethanol'
      },
      {
        id: 'm6-q9',
        question: 'Assuming the Society of Hair Testing (SoHT) standard posterior vertex scalp hair growth rate of 1.0 cm per month, a high Arsenic and Thallium band detected in the hair segment located between 4.0 cm and 6.0 cm from the scalp root corresponds to toxic exposure during which time window prior to collection?',
        options: [
          '4 to 6 months prior to collection',
          '4 to 6 days prior to collection',
          '4 to 6 weeks prior to collection',
          '4 to 6 years prior to collection'
        ],
        correctAnswer: 0,
        explanation: 'At 1.0 cm/month average growth rate, the 4.0 to 6.0 cm hair segment represents keratin formed 4 to 6 months prior to sampling.',
        referenceTopic: '6.3 Hair Analysis for Drugs & Chronic Poisoning'
      },
      {
        id: 'm6-q10',
        question: 'Under which section of the Bharatiya Nagarik Suraksha Sanhita (BNSS), 2023 [replacing Section 293 of the erstwhile CrPC, 1973] is the official Toxicology Report of a Government Scientific Expert (FSL/CFSL Director or Chemical Examiner) directly admissible as evidence in court?',
        options: [
          'Section 329 BNSS (formerly Section 293 CrPC)',
          'Section 194 BNSS',
          'Section 103 BNS',
          'Section 185 MV Act'
        ],
        correctAnswer: 0,
        explanation: 'Section 329 of the BNSS, 2023 governs the statutory admissibility of reports authored by designated Government Scientific Experts.',
        referenceTopic: '6.3 Section 329 BNSS Medico-Legal Reporting'
      }
    ],
    assignment: {
      id: 'm6-assign',
      title: 'Case Assignment 6 (Even Module): Final Capstone — Unit V Plant/Animal Toxinology, Hair Chronology, EtG & Section 329 BNSS FSL Report',
      caseScenario: 'Final Capstone Investigation: The Sessions Court refers a multi-exhibit toxicology file to your Forensic Science Laboratory: (1) Posterior vertex scalp hair (average growth rate = 1.0 cm/month) cut at the root from a chronic poisoning victim reveals a massive Arsenic & Thallium peak in the segment from 4.0 cm to 6.0 cm from the scalp. (2) Decomposed femoral blood from a river recovery shows 70 mg/dL ethanol, but Vitreous Humor ethanol is 0 mg/dL and urinary Ethyl Glucuronide (EtG) is 0.0 mg/L. (3) Village clinical and chemical exhibits include: Exhibit A—adulterated mustard oil from an outbreak of bilateral pitting pedal edema & glaucoma giving a crimson-orange layer with concentrated Nitric Acid; Exhibit B—a black pericarp seed extract turning deep purple with alcoholic KOH used to inflict a false bruise; and Exhibit C—a child hospitalized with severe pulmonary edema and priapism after an Indian Red Scorpion sting.',
      instructions: [
        'Calculate how many months prior to hair collection the start of the 4.0 cm hair segment corresponds to (at 1.0 cm/month growth rate).',
        'Enter the statutory Section of the Bharatiya Nagarik Suraksha Sanhita (BNSS) 2023 (formerly Sec. 293 CrPC) under which the FSL Director’s Toxicology Report is admissible.',
        'Select the correct forensic interpretation of the 70 mg/dL decomposed blood ethanol given Vitreous = 0 and EtG = 0.',
        'Select the correct Unit V Plant & Animal Toxinology triad matching Exhibits A, B, and C.',
        'Draft your Final Courtroom FSL Toxicology Expert Opinion citing Section 329 BNSS, explaining the 4–6 month hair segmental chronology, the EtG/Vitreous proof of postmortem microbial fermentation, the Unit V Plant/Animal findings (Argemone Sanguinarine, Semecarpus anacardium Bhilawa, and Mesobuthus tamulus Prazosin physiological antagonism), and at least two reasons why a true poisoning can yield a negative routine chemical report.'
      ],
      structuredFields: [
        {
          id: 'hair_months',
          label: 'Chronological Time Prior to Collection for Hair at 4.0 cm from Root (at 1.0 cm/month) [in months]',
          type: 'number',
          unit: 'months',
          placeholder: 'e.g., 4',
          expectedValue: 4,
          tolerance: 0.1,
          criterionLabel: 'Accurate hair segmental chronology calculation (4.0 cm / 1.0 cm/mo = 4 months)',
          hint: 'Divide 4.0 cm by 1.0 cm/month = 4 months.'
        },
        {
          id: 'bnss_section',
          label: 'Statutory BNSS 2023 Section for Government Scientific Expert Report Admissibility (formerly 293 CrPC)',
          type: 'number',
          placeholder: 'e.g., 329',
          expectedValue: 329,
          tolerance: 0,
          criterionLabel: 'Correct statutory citation of Section 329 BNSS (formerly 293 CrPC)',
          hint: 'Section 329 of the Bharatiya Nagarik Suraksha Sanhita (BNSS) 2023 replaces Section 293 CrPC.'
        },
        {
          id: 'etg_conclusion',
          label: 'Forensic Conclusion on Decomposed Blood Ethanol (70 mg/dL) with Vitreous = 0 & EtG = 0',
          type: 'select',
          options: [
            'Postmortem Microbial Fermentation Artifact (No Antemortem Alcohol Consumption)',
            'Confirmed Acute Antemortem Alcohol Intoxication',
            'Exogenous Methanol Substitution',
            'Chronic Hepatic Cirrhosis'
          ],
          expectedValue: 'Postmortem Microbial Fermentation Artifact (No Antemortem Alcohol Consumption)',
          criterionLabel: 'Correct exclusion of antemortem alcohol via negative Vitreous & EtG',
          hint: 'Absence of ethanol in vitreous humor and absence of EtG/EtS proves microbial fermentation.'
        },
        {
          id: 'unit5_plant_animal_triad',
          label: 'Unit V Plant & Animal Toxinology Confirmation for Exhibits A (Dropsy Oil), B (False Bruise Nut) & C (Scorpion Sting)',
          type: 'select',
          options: [
            'Exhibit A: Argemone mexicana (Sanguinarine) | Exhibit B: Semecarpus anacardium (Bhilawanol) | Exhibit C: Prazosin (Alpha-1 Blocker) for Scorpion Autonomic Storm',
            'Exhibit A: Ricinus communis (Ricin) | Exhibit B: Abrus precatorius (Abrin) | Exhibit C: Atropine for Scorpion Sting',
            'Exhibit A: Papaver somniferum | Exhibit B: Dhatura fastuosa | Exhibit C: Physostigmine',
            'Exhibit A: Nerium odorum | Exhibit B: Calotropis gigantea | Exhibit C: N-Acetylcysteine'
          ],
          expectedValue: 'Exhibit A: Argemone mexicana (Sanguinarine) | Exhibit B: Semecarpus anacardium (Bhilawanol) | Exhibit C: Prazosin (Alpha-1 Blocker) for Scorpion Autonomic Storm',
          criterionLabel: 'Accurate Unit V identification of Argemone (Sanguinarine), Bhilawa (Semecarpus anacardium), and Prazosin therapy for Scorpion envenomation',
          hint: 'Argemone oil (Sanguinarine) causes Epidemic Dropsy; Semecarpus anacardium (Marking Nut) turns purple with alcoholic KOH; Prazosin reverses scorpion autonomic storm.'
        }
      ],
      writtenPrompt: 'Draft your Final Courtroom FSL Toxicology Expert Opinion (cite Section 329 BNSS, explain why the 4.0–6.0 cm hair segment proves chronic metal exposure 4 to 6 months prior, explain why negative EtG/EtS + negative Vitreous proves postmortem fermentation, detail the Unit V findings for Argemone Sanguinarine, Bhilawa, and Scorpion Prazosin therapy, and state why a true poisoning can yield a negative routine chemical report):',
      minWordCount: 40,
      requiredKeywords: [
        { groupLabel: 'Hair Segmental Chronology (1 cm/month)', terms: ['hair', '4', '6', 'month', 'segment', '1 cm'] },
        { groupLabel: 'EtG / EtS & Vitreous Fermentation Proof', terms: ['etg', 'ethyl glucuronide', 'vitreous', 'fermentation', 'microbial', 'postmortem'] },
        { groupLabel: 'Section 329 BNSS, Negative Report & Unit V Plant/Animal Toxins', terms: ['329', 'bnss', '293', 'negative', 'metabolism', 'elimination', 'hydrolysis', 'volatile', 'argemone', 'sanguinarine', 'prazosin', 'bhilawa', 'semecarpus'] }
      ],
      sampleFrameworkHint: 'Include: (1) Admissibility under Section 329 BNSS (293 CrPC), (2) Hair growth at 1 cm/month placing the 4–6 cm metal band at 4–6 months prior, (3) Negative EtG/EtS and vitreous humor proving the 70 mg/dL blood ethanol is postmortem microbial fermentation, (4) Sanguinarine in Argemone oil (Epidemic Dropsy), Bhilawa (alcoholic KOH purple), and Prazosin for Scorpion sting, and (5) Why delayed death/metabolism or labile/volatile toxins can produce a negative chemical report.'
    }
  }
];

/**
 * Deterministic AutoCheck Engine for Module Quizzes & Assignments
 */
export function runModuleQuizAutoCheck(
  module: ToxModule,
  answers: Record<string, number>
): {
  scorePercent: number;
  correctCount: number;
  totalQuestions: number;
  passed: boolean;
  questionFeedback: {
    questionId: string;
    isCorrect: boolean;
    selectedOption: number | undefined;
    correctOption: number;
    explanation: string;
    referenceTopic: string;
  }[];
} {
  const totalQuestions = module.quiz.length;
  let correctCount = 0;

  const questionFeedback = module.quiz.map((q) => {
    const selected = answers[q.id];
    const isCorrect = selected === q.correctAnswer;
    if (isCorrect) correctCount++;
    return {
      questionId: q.id,
      isCorrect,
      selectedOption: selected,
      correctOption: q.correctAnswer,
      explanation: q.explanation,
      referenceTopic: q.referenceTopic
    };
  });

  const scorePercent = Math.round((correctCount / totalQuestions) * 100);
  // Strict requirement from user: quiz score equal and above 90 (>= 90)
  const passed = scorePercent >= 90;

  return {
    scorePercent,
    correctCount,
    totalQuestions,
    passed,
    questionFeedback
  };
}

export function runModuleAssignmentAutoCheck(
  module: ToxModule,
  fieldValues: Record<string, string>,
  writtenResponse: string
): {
  passed: boolean;
  criteriaResults: {
    criterionId: string;
    label: string;
    passed: boolean;
    feedback: string;
  }[];
} {
  const rubric = module.assignment;
  const criteriaResults: {
    criterionId: string;
    label: string;
    passed: boolean;
    feedback: string;
  }[] = [];

  // 1. Check all structured quantitative/protocol fields
  for (const field of rubric.structuredFields) {
    const rawVal = (fieldValues[field.id] ?? '').toString().trim();
    if (!rawVal) {
      criteriaResults.push({
        criterionId: `field-${field.id}`,
        label: field.criterionLabel,
        passed: false,
        feedback: `Missing value for "${field.label}". Hint: ${field.hint}`
      });
      continue;
    }

    if (field.type === 'number') {
      const numVal = parseFloat(rawVal);
      const expectedNum = Number(field.expectedValue);
      const tol = field.tolerance ?? 0.05;
      const isMatch = !isNaN(numVal) && Math.abs(numVal - expectedNum) <= tol;
      criteriaResults.push({
        criterionId: `field-${field.id}`,
        label: field.criterionLabel,
        passed: isMatch,
        feedback: isMatch
          ? `Verified: ${numVal}${field.unit ? ' ' + field.unit : ''} matches forensic calculation.`
          : `Incorrect value (${rawVal}). Expected ${expectedNum}${field.unit ? ' ' + field.unit : ''}. ${field.hint}`
      });
    } else {
      const isMatch = rawVal.toLowerCase() === String(field.expectedValue).toLowerCase();
      criteriaResults.push({
        criterionId: `field-${field.id}`,
        label: field.criterionLabel,
        passed: isMatch,
        feedback: isMatch
          ? `Verified: Correct protocol selection (${field.expectedValue}).`
          : `Incorrect selection. ${field.hint}`
      });
    }
  }

  // 2. Check minimum word count depth of written forensic analysis
  const words = writtenResponse
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 0);
  const wordCountPassed = words.length >= rubric.minWordCount;
  criteriaResults.push({
    criterionId: 'written-depth',
    label: `Minimum Technical Dossier Depth (≥ ${rubric.minWordCount} words; current: ${words.length} words)`,
    passed: wordCountPassed,
    feedback: wordCountPassed
      ? `Verified: Written forensic opinion contains ${words.length} words of detailed analysis.`
      : `Written response is too brief (${words.length} words). Please provide at least ${rubric.minWordCount} words covering the full case mechanism.`
  });

  // 3. Check each required forensic concept/keyword group
  const normalizedText = writtenResponse.toLowerCase();
  rubric.requiredKeywords.forEach((group, idx) => {
    const matchedTerm = group.terms.find((term) => normalizedText.includes(term.toLowerCase()));
    const groupPassed = Boolean(matchedTerm);
    criteriaResults.push({
      criterionId: `kw-group-${idx}`,
      label: `Scientific Concept Check: ${group.groupLabel}`,
      passed: groupPassed,
      feedback: groupPassed
        ? `Verified: Addressed "${group.groupLabel}" (referenced "${matchedTerm}").`
        : `Missing technical discussion of "${group.groupLabel}". Include key concepts such as: ${group.terms.slice(0, 3).join(', ')}.`
    });
  });

  const passed = criteriaResults.every((c) => c.passed);
  return { passed, criteriaResults };
}

export function createInitialToxEnrollment(
  registeredName: string,
  email: string,
  institution?: string
): ToxCourseEnrollment {
  const modules: Record<string, ToxModuleProgress> = {};
  for (const mod of FORENSIC_TOXICOLOGY_MODULES) {
    modules[mod.id] = {
      readingCompleted: false,
      completedSectionIds: [],
      quizScore: null,
      quizPassed: false,
      quizAnswers: {},
      quizAttempts: 0,
      assignmentFieldValues: {},
      assignmentWrittenResponse: '',
      assignmentPassed: false,
      assignmentCriteriaResults: []
    };
  }
  return {
    enrolled: true,
    syllabusVersion: CURRENT_TOX_SYLLABUS_VERSION,
    registeredName: registeredName.trim(),
    enrolledAt: new Date().toISOString(),
    email: email || '',
    institution: institution || '',
    certificateIssued: false,
    modules
  };
}

/**
 * Ensures any enrollment loaded from localStorage or Firestore is synchronized
 * with the updated FT2601 blended syllabus quizzes and assignment rubrics.
 */
export function syncEnrollmentWithUpdatedSyllabus(
  rawInput: ToxCourseEnrollment | { enrollment: ToxCourseEnrollment; [key: string]: any }
): ToxCourseEnrollment {
  // Gracefully unwrap if rawInput was stored as { enrollment: ... }
  const existing: ToxCourseEnrollment =
    (rawInput as any)?.enrollment && (rawInput as any).enrollment.enrolled !== undefined
      ? (rawInput as any).enrollment
      : (rawInput as ToxCourseEnrollment);

  if (!existing || typeof existing !== 'object') {
    return createInitialToxEnrollment('', '');
  }

  if (existing.syllabusVersion === CURRENT_TOX_SYLLABUS_VERSION) {
    return existing;
  }

  const syncedModules: Record<string, ToxModuleProgress> = {};
  for (const mod of FORENSIC_TOXICOLOGY_MODULES) {
    const prevMod = existing.modules?.[mod.id];
    const validSectionIds = new Set(mod.sections.map((s) => s.id));
    const validQuizIds = new Set(mod.quiz.map((q) => q.id));
    const validFieldIds = new Set(mod.assignment.structuredFields.map((f) => f.id));

    const filteredSections = (prevMod?.completedSectionIds || []).filter((id) =>
      validSectionIds.has(id)
    );
    const filteredQuizAnswers: Record<string, number> = {};
    if (prevMod?.quizAnswers) {
      for (const [k, v] of Object.entries(prevMod.quizAnswers)) {
        if (validQuizIds.has(k)) {
          filteredQuizAnswers[k] = v;
        }
      }
    }

    const filteredFieldValues: Record<string, string> = {};
    if (prevMod?.assignmentFieldValues) {
      for (const [k, v] of Object.entries(prevMod.assignmentFieldValues)) {
        if (validFieldIds.has(k)) {
          filteredFieldValues[k] = v;
        }
      }
    }

    // Re-evaluate quiz & assignment against the updated syllabus questions/rubric
    const hasAllQuizAnswers = Object.keys(filteredQuizAnswers).length === mod.quiz.length;
    const quizEval = hasAllQuizAnswers
      ? runModuleQuizAutoCheck(mod, filteredQuizAnswers)
      : null;

    const hasAllFields = mod.assignment.structuredFields.every(
      (f) => (filteredFieldValues[f.id] ?? '').toString().trim() !== ''
    );
    const assignEval =
      hasAllFields && (prevMod?.assignmentWrittenResponse || '').trim().length > 0
        ? runModuleAssignmentAutoCheck(
            mod,
            filteredFieldValues,
            prevMod?.assignmentWrittenResponse || ''
          )
        : null;

    syncedModules[mod.id] = {
      readingCompleted:
        filteredSections.length === mod.sections.length && mod.sections.length > 0,
      completedSectionIds: filteredSections,
      quizScore: quizEval ? quizEval.scorePercent : null,
      quizPassed: quizEval ? quizEval.passed : false,
      quizAnswers: filteredQuizAnswers,
      quizAttempts: prevMod?.quizAttempts || 0,
      assignmentFieldValues: filteredFieldValues,
      assignmentWrittenResponse: prevMod?.assignmentWrittenResponse || '',
      assignmentPassed: assignEval ? assignEval.passed : false,
      assignmentCriteriaResults: assignEval ? assignEval.criteriaResults : []
    };
  }

  return {
    ...existing,
    enrolled: true,
    syllabusVersion: CURRENT_TOX_SYLLABUS_VERSION,
    modules: syncedModules
  };
}

export function moduleHasAssignment(moduleNumber: number): boolean {
  return moduleNumber % 2 === 0;
}

export function verifyAllModulesEligibility(enrollment: ToxCourseEnrollment | null): {
  isEligible: boolean;
  completedModulesCount: number;
  totalModules: number;
  moduleStatuses: {
    moduleId: string;
    moduleNumber: number;
    title: string;
    hasAssignment: boolean;
    readingDone: boolean;
    quizScore: number | null;
    quizPassed: boolean;
    assignmentPassed: boolean;
    moduleComplete: boolean;
  }[];
} {
  const totalModules = FORENSIC_TOXICOLOGY_MODULES.length;
  if (!enrollment || !enrollment.enrolled) {
    return {
      isEligible: false,
      completedModulesCount: 0,
      totalModules,
      moduleStatuses: FORENSIC_TOXICOLOGY_MODULES.map((m) => {
        const hasAssignment = moduleHasAssignment(m.moduleNumber);
        return {
          moduleId: m.id,
          moduleNumber: m.moduleNumber,
          title: m.title,
          hasAssignment,
          readingDone: false,
          quizScore: null,
          quizPassed: false,
          assignmentPassed: !hasAssignment,
          moduleComplete: false
        };
      })
    };
  }

  const moduleStatuses = FORENSIC_TOXICOLOGY_MODULES.map((m) => {
    const prog = enrollment.modules?.[m.id];
    const hasAssignment = moduleHasAssignment(m.moduleNumber);
    const allSectionsDone =
      m.sections.length > 0 &&
      m.sections.every((s) => (prog?.completedSectionIds || []).includes(s.id));
    const readingDone = Boolean(prog?.readingCompleted) && allSectionsDone;
    const quizScore = prog?.quizScore ?? null;
    const quizPassed = Boolean(prog?.quizPassed && quizScore !== null && quizScore >= 90);
    const assignmentPassed = hasAssignment ? Boolean(prog?.assignmentPassed) : true;
    const moduleComplete = readingDone && quizPassed && assignmentPassed;

    return {
      moduleId: m.id,
      moduleNumber: m.moduleNumber,
      title: m.title,
      hasAssignment,
      readingDone,
      quizScore,
      quizPassed,
      assignmentPassed,
      moduleComplete
    };
  });

  const completedModulesCount = moduleStatuses.filter((s) => s.moduleComplete).length;
  const isEligible = totalModules > 0 && completedModulesCount === totalModules;

  return {
    isEligible,
    completedModulesCount,
    totalModules,
    moduleStatuses
  };
}

function hexToRgbColor(hex: string) {
  const clean = hex.replace('#', '').trim();
  const num = parseInt(clean.length === 3 ? clean.split('').map((c) => c + c).join('') : clean, 16);
  if (isNaN(num)) return rgb(0.1, 0.15, 0.23);
  const r = ((num >> 16) & 255) / 255;
  const g = ((num >> 8) & 255) / 255;
  const b = (num & 255) / 255;
  return rgb(r, g, b);
}

function toWinAnsiSafe(text: string): string {
  return (text || '')
    .replace(/≥/g, '>=')
    .replace(/≤/g, '<=')
    .replace(/•/g, '|')
    .replace(/[–—]/g, '-')
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .normalize('NFKD')
    .replace(/[^\x20-\x7E\xA0-\xFF]/g, '');
}

/**
 * Generates the learner's Certificate PDF using either:
 * 1. The uploaded custom PDF/Image template (stamping ONLY the Registered Name, Date, and optional Certificate ID at the configured coordinates), OR
 * 2. The built-in official ForenClue Forensic Toxicology Certificate PDF template if no custom template bytes are supplied.
 */
export async function generateForensicToxicologyCertificatePdf(params: {
  learnerName: string;
  issueDate: string;
  certificateNo: string;
  config: CertTemplateConfig;
  customTemplateBytes?: Uint8Array | null;
  customTemplateMimeType?: string;
}): Promise<Uint8Array> {
  const { learnerName, issueDate, certificateNo, config, customTemplateBytes, customTemplateMimeType } = params;

  let pdfDoc: PDFDocument;
  let isCustomTemplateLoaded = false;

  if (customTemplateBytes && customTemplateBytes.byteLength > 0) {
    try {
      if (customTemplateMimeType?.startsWith('image/')) {
        pdfDoc = await PDFDocument.create();
        const isPng = customTemplateMimeType.includes('png');
        const embeddedImg = isPng
          ? await pdfDoc.embedPng(customTemplateBytes)
          : await pdfDoc.embedJpg(customTemplateBytes);
        const page = pdfDoc.addPage([841.89, 595.28]); // A4 Landscape
        page.drawImage(embeddedImg, {
          x: 0,
          y: 0,
          width: 841.89,
          height: 595.28
        });
        isCustomTemplateLoaded = true;
      } else {
        // Native PDF template! Load the exact PDF template and stamp only Name & Date
        pdfDoc = await PDFDocument.load(customTemplateBytes, { ignoreEncryption: true });
        isCustomTemplateLoaded = true;
      }
    } catch (err) {
      console.warn('Could not parse custom template bytes, using built-in official template:', err);
      pdfDoc = await PDFDocument.create();
    }
  } else {
    pdfDoc = await PDFDocument.create();
  }

  const fontBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
  const fontItalic = await pdfDoc.embedFont(StandardFonts.TimesRomanItalic);
  const fontSansBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontSans = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const safeCertNo = toWinAnsiSafe(certificateNo.trim());

  if (!isCustomTemplateLoaded) {
    // Draw the Official ForenClue Forensic Toxicology Certificate Template on A4 Landscape (841.89 x 595.28 pt)
    const width = 841.89;
    const height = 595.28;
    const page = pdfDoc.addPage([width, height]);

    // Ivory parchment background
    page.drawRectangle({
      x: 0,
      y: 0,
      width,
      height,
      color: rgb(0.99, 0.985, 0.97)
    });

    // Outer deep navy border
    page.drawRectangle({
      x: 24,
      y: 24,
      width: width - 48,
      height: height - 48,
      borderColor: rgb(0.06, 0.11, 0.22),
      borderWidth: 3.5
    });

    // Inner gold double hairline border
    page.drawRectangle({
      x: 34,
      y: 34,
      width: width - 68,
      height: height - 68,
      borderColor: rgb(0.76, 0.6, 0.22),
      borderWidth: 1.5
    });

    // Top Header Banner
    const orgTitle = toWinAnsiSafe('FORENCLUE VENTURES | DIVISION OF FORENSIC TOXICOLOGY');
    const orgWidth = fontSansBold.widthOfTextAtSize(orgTitle, 11);
    page.drawText(orgTitle, {
      x: (width - orgWidth) / 2,
      y: height - 78,
      size: 11,
      font: fontSansBold,
      color: rgb(0.72, 0.54, 0.14)
    });

    const mainHeading = 'CERTIFICATE OF EXCELLENCE & COMPLETION';
    const mainHeadingWidth = fontBold.widthOfTextAtSize(mainHeading, 26);
    page.drawText(mainHeading, {
      x: (width - mainHeadingWidth) / 2,
      y: height - 118,
      size: 26,
      font: fontBold,
      color: rgb(0.06, 0.11, 0.22)
    });

    const subText = 'This is to officially certify that';
    const subWidth = fontItalic.widthOfTextAtSize(subText, 14);
    page.drawText(subText, {
      x: (width - subWidth) / 2,
      y: height - 156,
      size: 14,
      font: fontItalic,
      color: rgb(0.35, 0.4, 0.48)
    });

    // Decorative gold line under learner's name area
    page.drawLine({
      start: { x: 180, y: height * (config.nameYPercent / 100) - 10 },
      end: { x: width - 180, y: height * (config.nameYPercent / 100) - 10 },
      thickness: 1.2,
      color: rgb(0.76, 0.6, 0.22)
    });

    // Course Completion Body Copy
    const line1 = toWinAnsiSafe('has successfully completed all 6 Self-Paced Research Modules, Analytical Case Assignments,');
    const line2 = toWinAnsiSafe('and Proctored AutoCheck Assessments (achieving >= 90% mastery in every module) for the');
    const courseName = toWinAnsiSafe('CERTIFICATE COURSE IN FORENSIC TOXICOLOGY (COURSE CODE: FT2601)');
    const syllabusLine = toWinAnsiSafe('Covering Toxicokinetics, Postmortem Redistribution, Heavy Metals, Agrochemicals, NDPS Act, GC-MS/LC-MS/MS & BNSS Sec. 329 Reporting');

    page.drawText(line1, {
      x: (width - fontSans.widthOfTextAtSize(line1, 12)) / 2,
      y: height - 290,
      size: 12,
      font: fontSans,
      color: rgb(0.2, 0.25, 0.33)
    });
    page.drawText(line2, {
      x: (width - fontSans.widthOfTextAtSize(line2, 12)) / 2,
      y: height - 308,
      size: 12,
      font: fontSans,
      color: rgb(0.2, 0.25, 0.33)
    });
    page.drawText(courseName, {
      x: (width - fontSansBold.widthOfTextAtSize(courseName, 14.5)) / 2,
      y: height - 336,
      size: 14.5,
      font: fontSansBold,
      color: rgb(0.06, 0.11, 0.22)
    });
    page.drawText(syllabusLine, {
      x: (width - fontSans.widthOfTextAtSize(syllabusLine, 9.5)) / 2,
      y: height - 358,
      size: 9.5,
      font: fontSans,
      color: rgb(0.4, 0.45, 0.52)
    });

    // Footer labels for Date, Seal, and Signature
    page.drawLine({
      start: { x: 140, y: 118 },
      end: { x: 330, y: 118 },
      thickness: 1,
      color: rgb(0.6, 0.65, 0.72)
    });
    const dateLabel = 'DATE OF ISSUANCE';
    page.drawText(dateLabel, {
      x: 235 - fontSansBold.widthOfTextAtSize(dateLabel, 8.5) / 2,
      y: 102,
      size: 8.5,
      font: fontSansBold,
      color: rgb(0.4, 0.45, 0.52)
    });

    // Center Seal Badge
    page.drawCircle({
      x: width / 2,
      y: 122,
      size: 32,
      borderColor: rgb(0.76, 0.6, 0.22),
      borderWidth: 2,
      color: rgb(0.97, 0.94, 0.85)
    });
    const sealText1 = 'AUTOCHECK';
    const sealText2 = 'VERIFIED >=90%';
    page.drawText(sealText1, {
      x: width / 2 - fontSansBold.widthOfTextAtSize(sealText1, 7) / 2,
      y: 125,
      size: 7,
      font: fontSansBold,
      color: rgb(0.55, 0.4, 0.08)
    });
    page.drawText(sealText2, {
      x: width / 2 - fontSansBold.widthOfTextAtSize(sealText2, 6.5) / 2,
      y: 114,
      size: 6.5,
      font: fontSansBold,
      color: rgb(0.55, 0.4, 0.08)
    });

    // Right Signature & Credential ID Line
    page.drawLine({
      start: { x: width - 330, y: 118 },
      end: { x: width - 140, y: 118 },
      thickness: 1,
      color: rgb(0.6, 0.65, 0.72)
    });
    const sigLabel = 'CREDENTIAL VERIFICATION CODE';
    page.drawText(sigLabel, {
      x: width - 235 - fontSansBold.widthOfTextAtSize(sigLabel, 8.5) / 2,
      y: 102,
      size: 8.5,
      font: fontSansBold,
      color: rgb(0.4, 0.45, 0.52)
    });

    const verifyUrlText = toWinAnsiSafe(`Verify authenticity online at: forenclue.in/certificate?id=${safeCertNo}`);
    page.drawText(verifyUrlText, {
      x: (width - fontSans.widthOfTextAtSize(verifyUrlText, 8.5)) / 2,
      y: 52,
      size: 8.5,
      font: fontSans,
      color: rgb(0.45, 0.5, 0.58)
    });
  }

  // Stamp Registered Name, Issue Date, and optional Certificate ID on the first page of the PDF
  const pages = pdfDoc.getPages();
  const firstPage = pages[0];
  const { width, height } = firstPage.getSize();

  // 1. Stamp Learner's Registered Name
  const cleanName = toWinAnsiSafe(learnerName.trim()) || 'Candidate';
  const nameFontSize = config.nameFontSize || 28;
  const nameTextWidth = fontBold.widthOfTextAtSize(cleanName, nameFontSize);
  const rawNameX = (config.nameXPercent / 100) * width;
  const nameX = config.nameCentered ? rawNameX - nameTextWidth / 2 : rawNameX;
  const nameY = (config.nameYPercent / 100) * height;

  firstPage.drawText(cleanName, {
    x: Math.max(10, nameX),
    y: Math.max(10, nameY),
    size: nameFontSize,
    font: fontBold,
    color: hexToRgbColor(config.nameColorHex || '#1E293B')
  });

  // 2. Stamp Completion Date
  const cleanDate = toWinAnsiSafe(issueDate.trim());
  const dateFontSize = config.dateFontSize || 13;
  const dateTextWidth = fontSansBold.widthOfTextAtSize(cleanDate, dateFontSize);
  const rawDateX = (config.dateXPercent / 100) * width;
  const dateX = config.dateCentered ? rawDateX - dateTextWidth / 2 : rawDateX;
  const dateY = (config.dateYPercent / 100) * height;

  firstPage.drawText(cleanDate, {
    x: Math.max(10, dateX),
    y: Math.max(10, dateY),
    size: dateFontSize,
    font: fontSansBold,
    color: hexToRgbColor(config.dateColorHex || '#334155')
  });

  // 3. Stamp Certificate Verification ID (if enabled)
  if (config.showCertId && safeCertNo) {
    const certIdFontSize = config.certIdFontSize || 11;
    const certIdWidth = fontSansBold.widthOfTextAtSize(safeCertNo, certIdFontSize);
    const rawCertX = (config.certIdXPercent / 100) * width;
    const certX = rawCertX - certIdWidth / 2;
    const certY = (config.certIdYPercent / 100) * height;

    firstPage.drawText(safeCertNo, {
      x: Math.max(10, certX),
      y: Math.max(10, certY),
      size: certIdFontSize,
      font: fontSansBold,
      color: hexToRgbColor(config.certIdColorHex || '#475569')
    });
  }

  return await pdfDoc.save();
}
