import React, { useState } from 'react';
import { Maximize2, X, ZoomIn, CheckCircle2 } from 'lucide-react';

export interface ModuleVisualGuideData {
  moduleNumber: number;
  code: string;
  title: string;
  clipartImageSrc: string;
  clipartImageCaption: string;
  mindmapTitle: string;
  mindmapCenterLabel: string;
  mindmapCenterSub: string;
  mindmapBranches: {
    id: string;
    title: string;
    colorHex: string;
    bgHex: string;
    borderHex: string;
    iconType: 'flask' | 'organ' | 'receptor' | 'shield' | 'jar' | 'funnel' | 'chromatography' | 'spectrum' | 'metal' | 'breath' | 'reagent' | 'plant' | 'snake' | 'gavel';
    items: string[];
  }[];
  cheatsheetTitle: string;
  cheatsheetSubtitle: string;
  cheatsheetCards: {
    heading: string;
    badge: string;
    accentColor: string;
    rows: { label: string; value: string; highlight?: string }[];
  }[];
}

export const MODULE_VISUAL_GUIDES: Record<number, ModuleVisualGuideData> = {
  1: {
    moduleNumber: 1,
    code: 'FT2601-M1',
    title: 'Poison Classification, ADME, Receptor Superfamilies & Antidotes',
    clipartImageSrc: '/src/assets/images/tox_m1_adme_mindmap_1793820529061.jpg',
    clipartImageCaption:
      'Figure 1.1: Illustrated Clipart Mindmap — Poison Classification, ADME Pathway, 4 Receptor Superfamilies & Specific Antidotes',
    mindmapTitle: 'Module 01 Mindmap: Principles of Toxicology, ADME & Pharmacodynamics',
    mindmapCenterLabel: 'GENERAL TOXICOLOGY',
    mindmapCenterSub: 'Classification · ADME · Receptors · Laws',
    mindmapBranches: [
      {
        id: 'm1-b1',
        title: '1. Classification of Poisons',
        colorHex: '#0284c7',
        bgHex: '#f0f9ff',
        borderHex: '#bae6fd',
        iconType: 'flask',
        items: [
          'Corrosives: Strong Acids (H2SO4, HNO3, HCl) & Alkalis (NaOH, KOH)',
          'Irritants: Inorganic (As, Pb, Hg, P), Organic (Abrus, Ricinus, Snake)',
          'Systemic Neurotics: Cerebral (Opioids, Alcohol), Spinal (Strychnine), Peripheral (Coniine)',
          'Cardiotoxic & Asphyxiants: Aconite, Oleander, Digitalis, CO, HCN, H2S'
        ]
      },
      {
        id: 'm1-b2',
        title: '2. ADME Toxicokinetics',
        colorHex: '#dc2626',
        bgHex: '#fef2f2',
        borderHex: '#fecaca',
        iconType: 'organ',
        items: [
          'Absorption: Weak acids (Aspirin) in stomach (pH 1.5–3); Weak bases (Morphine) in intestine',
          'Distribution: Vd = Dose / (C0 × BW); high Vd (>3–5 L/kg) indicates tissue sequestration',
          'Phase I CYP450 Lethal Synthesis: Paracetamol → NAPQI; Parathion → Paraoxon; Methanol → Formate',
          'Elimination: Zero-Order (Ethanol 15 mg/dL/hr, Phenytoin, Salicylates) vs First-Order'
        ]
      },
      {
        id: 'm1-b3',
        title: '3. 4 Receptor Superfamilies',
        colorHex: '#7c3aed',
        bgHex: '#f5f3ff',
        borderHex: '#ddd6fe',
        iconType: 'receptor',
        items: [
          'Type 1 Ionotropic (ms): GABAA (Barbiturates/BZDs), GlycineR (Strychnine), nAChR',
          'Type 2 Metabotropic GPCR (sec): Muscarinic M1–M5 (Atropine/Datura), Mu-Opioid (Morphine)',
          'Type 3 Kinase-Linked (min–hr): Insulin & Growth Factor Receptor Tyrosine Kinases',
          'Type 4 Nuclear/Intracellular (hr–days): Steroid, Thyroid & AhR (Dioxin/TCDD) transcription'
        ]
      },
      {
        id: 'm1-b4',
        title: '4. Antidotes & Toxic Laws',
        colorHex: '#059669',
        bgHex: '#ecfdf5',
        borderHex: '#a7f3d0',
        iconType: 'shield',
        items: [
          'Physiological vs Receptor: Prazosin (Scorpion) vs Naloxone (Opioids) & Atropine (OP)',
          'Enzyme Reactivator & Chelators: Pralidoxime (2-PAM), BAL, DMSA, Penicillamine, Desferrioxamine',
          'Therapeutic Index: TI = LD50 / ED50; Certain Safety Factor = LD1 / ED99',
          'Statutory Framework: Sec. 123 BNS (Stupefying Poisons), Poisons Act 1919, Schedule X'
        ]
      }
    ],
    cheatsheetTitle: 'Module 01 High-Yield Cheatsheet: Toxidromes, Antidotes & Modifying Factors',
    cheatsheetSubtitle: 'Quick-Reference Clinical & Medico-Legal Sheet',
    cheatsheetCards: [
      {
        heading: 'Toxidrome & Specific Antidote Matrix',
        badge: 'CLINICAL ANTIDOTES',
        accentColor: '#059669',
        rows: [
          { label: 'Organophosphates (SLUDGE + Miosis)', value: 'Atropine (Muscarinic block) + Pralidoxime (2-PAM)', highlight: 'Before Aging' },
          { label: 'Datura / Belladonna (7 D’s + Mydriasis)', value: 'Physostigmine Salicylate (Tertiary amine; crosses BBB)', highlight: 'NOT Neostigmine' },
          { label: 'Paracetamol (CYP2E1 → NAPQI)', value: 'N-Acetylcysteine (NAC — replenishes Hepatic GSH)', highlight: 'Centrilobular' },
          { label: 'Opioid Triad (Coma + Miosis + Bradypnea)', value: 'Naloxone HCl (Competitive Mu-Opioid Antagonist)', highlight: 'IV Titration' },
          { label: 'Cyanide (Cytochrome c Oxidase Fe3+)', value: 'Amyl/Sodium Nitrite + Sodium Thiosulphate / Hydroxocobalamin', highlight: 'Rhodanese' }
        ]
      },
      {
        heading: 'Pharmacokinetic & statutory Key Equations',
        badge: 'FORMULAS & LAWS',
        accentColor: '#0284c7',
        rows: [
          { label: 'Henderson-Hasselbalch (Weak Acid)', value: 'pH - pKa = log([A-] / [HA]) → Ion trapping in alkaline urine', highlight: 'NaHCO3 Diuresis' },
          { label: 'Therapeutic Index & Safety Margin', value: 'TI = LD50 / ED50 | Margin of Safety = LD1 / ED99', highlight: 'Dose-Response' },
          { label: 'Insecticides Act 1968 Hazard Triangles', value: 'Bright Red (Extremely Toxic) > Yellow > Blue > Green', highlight: '4 Colour Labels' },
          { label: 'First Gastric Lavage Washing Rule', value: 'Always preserve FIRST washing (highest unabsorbed poison)', highlight: 'Without Antidote' },
          { label: 'Bharatiya Nyaya Sanhita (BNS 2023)', value: 'Sec. 123: Administering stupefying/unwholesome drug', highlight: 'Formerly 328 IPC' }
        ]
      }
    ]
  },
  2: {
    moduleNumber: 2,
    code: 'FT2601-M2',
    title: 'Autopsy Viscera Preservation, PMR & Isolation from Viscera',
    clipartImageSrc: '/src/assets/images/tox_m2_viscera_mindmap_1793820532189.jpg',
    clipartImageCaption:
      'Figure 2.1: Illustrated Clipart Cheatsheet — Autopsy Viscera Bottles I–IV, Postmortem Redistribution (PMR), Stas-Otto LLE & Conway Microdiffusion',
    mindmapTitle: 'Module 02 Mindmap: Autopsy Viscera Protocol, PMR & Classical Isolation',
    mindmapCenterLabel: 'VISCERA ISOLATION',
    mindmapCenterSub: 'Bottles I–IV · PMR · Stas-Otto · Distillation',
    mindmapBranches: [
      {
        id: 'm2-b1',
        title: '1. Standard 4-Bottle Autopsy Protocol',
        colorHex: '#0284c7',
        bgHex: '#f0f9ff',
        borderHex: '#bae6fd',
        iconType: 'jar',
        items: [
          'Bottle I: Entire Stomach + Contents + Upper 30 cm Proximal Duodenum (Unabsorbed Poison)',
          'Bottle II: Liver (≥ 500 g with Gallbladder) + Half of Each Kidney + Spleen (Metabolized Poison)',
          'Bottle III: Peripheral Femoral Venous Blood (≥ 10 mL in 1% w/v NaF + Potassium Oxalate) + Urine',
          'Bottle IV: 100 mL Control Sample of Preservative (Saturated NaCl / Rectified Spirit) to rule out contamination'
        ]
      },
      {
        id: 'm2-b2',
        title: '2. Preservative Contraindications & PMR',
        colorHex: '#dc2626',
        bgHex: '#fef2f2',
        borderHex: '#fecaca',
        iconType: 'organ',
        items: [
          'Saturated NaCl Contraindicated in: Silver Nitrate (forms AgCl ppt) & Corrosive HCl',
          'Rectified Spirit Contraindicated in: Ethanol, Methanol, Chloral Hydrate, Chloroform, Ether',
          'Aconite Special Rule: Acidified Rectified Spirit prevents alkaline ester hydrolysis of Aconitine',
          'Postmortem Redistribution (PMR): Heart/Femoral (C/P) ratio ≥ 2.0 in TCAs, Digoxin, Amphetamines, Fentanyl'
        ]
      },
      {
        id: 'm2-b3',
        title: '3. Stas-Otto & Deproteinization',
        colorHex: '#7c3aed',
        bgHex: '#f5f3ff',
        borderHex: '#ddd6fe',
        iconType: 'funnel',
        items: [
          'Stas-Otto Method: Tartaric/Acetic acid + Hot Absolute Ethanol precipitates proteins & dissolves salts',
          'Ammonium Sulphate Method: Saturated (NH4)2SO4 salting-out at 65°C yields cleanest aqueous filtrate',
          'Acid-Ether Fraction: Subfraction A1 (Weak Acids: Salicylates, Barbiturates via NaHCO3) & A2 (Phenols/Neutrals)',
          'Alkaline Fraction (pH 10–11): Basic Alkaloids (Strychnine, Quinine, Cocaine) vs Morphine (pH 8.5–9.2 CHCl3:IPA)'
        ]
      },
      {
        id: 'm2-b4',
        title: '4. Volatiles & Membrane Dialysis',
        colorHex: '#059669',
        bgHex: '#ecfdf5',
        borderHex: '#a7f3d0',
        iconType: 'flask',
        items: [
          'Acidified Steam Distillation: HCN, Ethanol, Methanol, Chloral Hydrate, Chloroform, Yellow Phosphorus',
          'Alkaline Steam Distillation (NaOH): Volatile Basic Poisons — Nicotine, Coniine, Amphetamines, Aniline',
          'Conway Microdiffusion Cell: Outer chamber (Blood + Acid/Alkali) → Inner well colorimetric trapping (CO, HCN, EtOH)',
          'Membrane Dialysis & Electrodialysis: Cellophane semi-permeable isolation of ionic inorganic salts (Na+, Li+, Ba2+, F-)'
        ]
      }
    ],
    cheatsheetTitle: 'Module 02 High-Yield Cheatsheet: Viscera Matrices & Fractionation Tree',
    cheatsheetSubtitle: 'Autopsy Sampling & pH-Partitioned Liquid-Liquid Extraction Guide',
    cheatsheetCards: [
      {
        heading: 'pH-Partitioned LLE Subfractions (A1, A2, B, C)',
        badge: 'STAS-OTTO TREE',
        accentColor: '#7c3aed',
        rows: [
          { label: 'Subfraction A1 (Acidic -> 5% NaHCO3)', value: 'Strong/Weak Organic Acids: Salicylates, Barbiturates, Phenytoin', highlight: 'pH 1–2 Ether' },
          { label: 'Subfraction A2 (Acidic -> 0.5N NaOH)', value: 'Very Weak Acids & Neutrals: Phenols, Cresols, Meprobamate, Picrotoxin', highlight: 'pH 1–2 Organic' },
          { label: 'Fraction B (Strong Alkaline pH 10–11)', value: 'Non-Phenolic Alkaloids: Strychnine, Brucine, Atropine, Cocaine, Quinine', highlight: 'CHCl3 Extract' },
          { label: 'Fraction C (Amphoteric pH 8.5–9.2)', value: 'Phenolic Alkaloid: Morphine (forms water-soluble phenoxide at pH > 11)', highlight: 'CHCl3:IPA (3:1)' },
          { label: 'Putrefactive Ptomaine Exclusion', value: 'beta-Phenylethylamine, Tryptamine, Tyramine lack true alkaloid MS ions', highlight: 'GC-MS / LC-MS' }
        ]
      },
      {
        heading: 'Special Forensic Matrices & Preservatives',
        badge: 'AUTOPSY PROTOCOL',
        accentColor: '#0284c7',
        rows: [
          { label: 'Vitreous Humor (1–2 mL per eye)', value: 'Anatomically isolated; resists bacterial putrefaction & PMR', highlight: 'EtOH / Electrolytes' },
          { label: 'Bile & Gallbladder Fluid', value: 'Concentrates glucuronide conjugates of Morphine, Codeine, BZDs', highlight: 'Chronic/Opioids' },
          { label: 'Bone, Hair, Nails & Teeth', value: 'Keratin disulfide (-S-S-) & hydroxyapatite trap Arsenic, Lead, Thallium', highlight: 'Exhumation' },
          { label: 'Lung Apex & Brain (Tied Bronchi)', value: 'Preserved in sealed nylon/glass headspace bags (NO chemical preservative)', highlight: 'Inhalants/Gases' },
          { label: '1% Sodium Fluoride (Grey-Top Tube)', value: 'Inhibits yeast/bacterial Enolase to block postmortem neo-ethanol synthesis', highlight: '10 mg/mL Blood' }
        ]
      }
    ]
  },
  3: {
    moduleNumber: 3,
    code: 'FT2601-M3',
    title: 'Acid Digestion, SPE/QuEChERS, Chromatography & Hyphenated MS/Atomic Spectroscopy',
    clipartImageSrc: '/src/assets/images/tox_m3_instrumentation_cheatsheet_1793820535965.jpg',
    clipartImageCaption:
      'Figure 3.1: Illustrated Clipart Cheatsheet — Microwave Acid Digestion, 4-Step SPE, Silica Gel TLC Plate, Triple Quadrupole LC-MS/MS & CV-AAS / ICP-MS',
    mindmapTitle: 'Module 03 Mindmap: Sample Digestion, Chromatography & Mass Spectrometry',
    mindmapCenterLabel: 'ANALYTICAL TOXICOLOGY',
    mindmapCenterSub: 'Digestion · SPE · TLC/GC/HPLC · MS & ICP-MS',
    mindmapBranches: [
      {
        id: 'm3-b1',
        title: '1. Metallic Digestion & Modern Clean-Up',
        colorHex: '#0284c7',
        bgHex: '#f0f9ff',
        borderHex: '#bae6fd',
        iconType: 'flask',
        items: [
          'Dry Ashing (450–550°C Muffle Furnace): Causes severe volatilization loss of Hg, As, Se, Sb & Tetraethyl Lead',
          'Closed-Vessel Microwave Digestion (PTFE + Conc. HNO3 + H2O2): 100% recovery of volatile & trace metals',
          'Solid-Phase Extraction (SPE): 4 Steps — Condition → Sample Load → Interference Wash → Selective Elution',
          'QuEChERS (MeCN + MgSO4 + PSA) & Headspace SPME (Solvent-free fiber adsorption of volatiles)'
        ]
      },
      {
        id: 'm3-b2',
        title: '2. Planar & Column Chromatography',
        colorHex: '#059669',
        bgHex: '#ecfdf5',
        borderHex: '#a7f3d0',
        iconType: 'chromatography',
        items: [
          'TLC / HPTLC (Silica Gel GF254): Rf = Distance of Solute / Distance of Solvent Front (UV 254 nm fluorescence quenching)',
          'Gas Chromatography (GC): Headspace GC-FID (Alcohols/Volatiles), GC-ECD (Halogenated Organochlorines), GC-NPD',
          'Chemical Derivatization for GC: Silylation (BSTFA/MSTFA → TMS ethers) for polar non-volatile metabolites',
          'Reverse-Phase HPLC-DAD: C18 Non-Polar Column + Polar Mobile Phase (Water/MeCN) for heat-labile toxins'
        ]
      },
      {
        id: 'm3-b3',
        title: '3. Mass Spectrometry (GC-MS & LC-MS/MS)',
        colorHex: '#7c3aed',
        bgHex: '#f5f3ff',
        borderHex: '#ddd6fe',
        iconType: 'spectrum',
        items: [
          'GC-MS Electron Ionization (EI at 70 eV): Reproducible fragmentation fingerprint matched against NIST/SWGDRUG libraries',
          'LC-MS/MS Soft Ionization (ESI / APCI): Generates intact protonated molecular ions [M+H]+ without thermal breakdown',
          'Triple Quadrupole MRM: Q1 (Precursor Ion) → q2 (Collision CID) → Q3 (Quantifier & Qualifier Product Ions)',
          'HRAM Orbitrap / Q-TOF: Exact monoisotopic mass (< 2–5 ppm) for non-targeted Designer NPS discovery'
        ]
      },
      {
        id: 'm3-b4',
        title: '4. Elemental & Anion Spectroscopy',
        colorHex: '#dc2626',
        bgHex: '#fef2f2',
        borderHex: '#fecaca',
        iconType: 'metal',
        items: [
          'Cold-Vapour AAS (CV-AAS): SnCl2/NaBH4 reduces Hg2+ to monoatomic Hg0 vapour at room temperature (253.7 nm)',
          'Hydride Generation AAS (HG-AAS): Converts As, Sb, Se into volatile hydrides (AsH3, SbH3) for trace ppt sensitivity',
          'ICP-MS (Argon Plasma 6000–10000 K): Multi-elemental profiling + Helium KED Collision Cell removes 40Ar35Cl+ at m/z 75',
          'Suppressed Ion Chromatography (IC):Simultaneous trace quantification of F-, Cl-, NO2-, NO3-, BrO3-, ClO3-, SO4(2-)'
        ]
      }
    ],
    cheatsheetTitle: 'Module 03 High-Yield Cheatsheet: Analytical Formulas & Detector Selection',
    cheatsheetSubtitle: 'Instrumental Parameters, MRM Tolerances & Elemental Modes',
    cheatsheetCards: [
      {
        heading: 'Chromatographic & Spectrophotometric Equations',
        badge: 'ANALYTICAL MATH',
        accentColor: '#0284c7',
        rows: [
          { label: 'TLC Retardation Factor (Rf)', value: 'Rf = Distance migrated by Solute center / Distance of Solvent Front (0 < Rf < 1)', highlight: 'E.g. 9/15 = 0.60' },
          { label: 'Beer-Lambert UV-Vis Law', value: 'A = log10(I0 / I) = epsilon × c × l | Derivative dA/dlambda resolves overlapping bands', highlight: 'CO-Hb / Met-Hb' },
          { label: 'LC-MS/MS MRM Ion Ratio Deviation', value: 'Relative Deviation = |Observed Ratio - Std Ratio| / Std Ratio × 100 (Pass <= ±20%)', highlight: 'WADA / SOFT' },
          { label: 'FTIR-ATR Fingerprint Region', value: '4000–400 cm-1 (Fingerprint: 1500–400 cm-1) differentiates positional isomers', highlight: 'Non-Destructive' }
        ]
      },
      {
        heading: 'Gold-Standard Instrument Match by Poison Class',
        badge: 'INSTRUMENT MATRIX',
        accentColor: '#7c3aed',
        rows: [
          { label: 'Mercury (Hg) in Blood/Viscera', value: 'Cold-Vapour Atomic Absorption Spectrometry (CV-AAS at 253.7 nm)', highlight: 'No Flame Needed' },
          { label: 'Arsenic (As) & Antimony (Sb)', value: 'Hydride Generation AAS (HG-AAS) or ICP-MS with He KED Collision Cell', highlight: 'Resolves ArCl+' },
          { label: 'Volatile Alcohols (EtOH, MeOH)', value: 'Headspace Gas Chromatography with Flame Ionization Detection (HS-GC-FID)', highlight: 't-Butanol I.S.' },
          { label: 'Inorganic Anions (NO2-, F-, ClO3-)', value: 'Suppressed Anion-Exchange Ion Chromatography with Conductivity Detector', highlight: 'Sub-ppm Anions' }
        ]
      }
    ]
  },
  4: {
    moduleNumber: 4,
    code: 'FT2601-M4',
    title: 'Metallic Poisons, Inorganic Anions, CNS Depressants & Liquor Estimation',
    clipartImageSrc: '/src/assets/images/tox_m4_metals_alcohol_mindmap_1793820536454.jpg',
    clipartImageCaption:
      'Figure 4.1: Illustrated Clipart Mindmap — Reinsch & Marsh Tests, Aluminium Phosphide AgNO3 Test, Fujiwara Reaction & Widmark Liquor Estimation',
    mindmapTitle: 'Module 04 Mindmap: Metallic Poisons, Anions, Volatiles & Alcohol',
    mindmapCenterLabel: 'METALS & LIQUOR',
    mindmapCenterSub: 'Metals · Anions · Depressants · Widmark BAC',
    mindmapBranches: [
      {
        id: 'm4-b1',
        title: '1. Metallic Poisons (As, Sb, Pb, Hg, Tl, Cu, Ba)',
        colorHex: '#0284c7',
        bgHex: '#f0f9ff',
        borderHex: '#bae6fd',
        iconType: 'metal',
        items: [
          'Arsenic (As3+): Binds PDH lipoic acid dithiol; Aldrich-Mees’ lines, Raindrop pigmentation; Reinsch white octahedral As2O3',
          'Marsh Test Differentiation: Hair-pin As mirror dissolves in Sodium Hypochlorite (NaOCl); Antimony (Sb) mirror is insoluble',
          'Lead (Pb2+): Inhibits ALA Dehydratase & Ferrochelatase → Basophilic stippling, Burton’s blue gum line, Wrist/Foot drop',
          'Thallium (Tl+): K+ mimic; painful peripheral neuropathy + rapid anagen scalp Alopecia (spares inner 1/3 eyebrows); Prussian Blue'
        ]
      },
      {
        id: 'm4-b2',
        title: '2. Inorganic Anions & Celphos (AlP)',
        colorHex: '#059669',
        bgHex: '#ecfdf5',
        borderHex: '#a7f3d0',
        iconType: 'flask',
        items: [
          'Aluminium Phosphide (Celphos): Liberates Phosphine (PH3) → blocks Cytochrome c Oxidase; AgNO3 paper (+) black, Lead Acetate (-)',
          'Nitrites (NO2-) & Chlorates (ClO3-): Oxidize Hb(Fe2+) to chocolate-brown Methemoglobin (Fe3+); Antidote: Methylene Blue',
          'Fluoride (F-): Precipitates Ca2+ (hypocalcemic tetany) & inhibits Enolase; etched gastric mucosa; Calcium Gluconate',
          'Sulphides (H2S): Rotten-egg sewer gas; blackens Lead Acetate paper (PbS); Greenish-purple putrefactive marbling'
        ]
      },
      {
        id: 'm4-b3',
        title: '3. Barbiturates, Chloral Hydrate & Volatiles',
        colorHex: '#7c3aed',
        bgHex: '#f5f3ff',
        borderHex: '#ddd6fe',
        iconType: 'reagent',
        items: [
          'Barbiturates: Prolong GABAA Cl- channel opening DURATION; Dille-Koppanyi (Red-Violet) & Zwikker’s Test (Purple)',
          'Chloral Hydrate ("Knockout Drops"): Reduced by ADH to Trichloroethanol; Fujiwara Test (Pyridine + NaOH → Crimson-Red layer)',
          'Benzodiazepines: Increase GABAA Cl- channel opening FREQUENCY; specific competitive antagonist is Flumazenil',
          'Methanol ("Hooch"): ADH → Formaldehyde → Formic Acid (Optic neuropathy/snowstorm vision); Fomepizole + Folinic Acid'
        ]
      },
      {
        id: 'm4-b4',
        title: '4. Estimation of Liquor (Breath, Blood, Urine)',
        colorHex: '#dc2626',
        bgHex: '#fef2f2',
        borderHex: '#fecaca',
        iconType: 'breath',
        items: [
          'Breath Partition (Henry’s Law): 2100 mL Alveolar Breath = 1 mL Arterial Blood; IR 3.4 um & 9.5 um + Fuel Cell',
          'Blood & Urine Estimation: Kozelka-Hine Distillation & Cavett Microdiffusion (Acid K2Cr2O7 Orange Cr6+ → Green Cr3+) & HS-GC-FID',
          'Urine-to-Blood Ratio: UAC / BAC approx 1.3 : 1 in post-absorptive phase; Section 185 MV Act statutory limit = 30 mg/100 mL',
          'Widmark Formula & Retrograde BAC: A = c × p × r (r = 0.68 male, 0.55 female) | C0 = Ct + (beta × t) [beta = 15 mg/dL/hr]'
        ]
      }
    ],
    cheatsheetTitle: 'Module 04 High-Yield Cheatsheet: Reinsch/Marsh Crystals, Anions & Widmark Math',
    cheatsheetSubtitle: 'Benchtop Differentiation & Retrograde BAC Reference Sheet',
    cheatsheetCards: [
      {
        heading: 'Reinsch & Marsh Metallic Differentiation Table',
        badge: 'METALLIC POISONS',
        accentColor: '#0284c7',
        rows: [
          { label: 'Arsenic (As) on Reinsch Copper Foil', value: 'Steel-grey deposit → Sublimes into White Octahedral Crystals (As2O3)', highlight: 'Soluble in NaOCl' },
          { label: 'Antimony (Sb) on Reinsch Copper Foil', value: 'Purplish-black deposit → Amorphous / needle sublimate', highlight: 'Insoluble in NaOCl' },
          { label: 'Mercury (Hg) on Reinsch Copper Foil', value: 'Silvery mirror on copper → Sublimes into Shiny Metallic Globules (Hg0)', highlight: 'CV-AAS 253.7 nm' },
          { label: 'Copper (CuSO4) & Barium (BaCO3)', value: 'Cu: Blue-green mucosa + Kayser-Fleischer ring | Ba: Profound K+ hypokalemic paralysis', highlight: 'MgSO4 for Barium' }
        ]
      },
      {
        heading: 'Liquor Estimation & Agrochemical Antidotes',
        badge: 'LIQUOR & PESTICIDES',
        accentColor: '#dc2626',
        rows: [
          { label: 'Widmark Body Ethanol Mass (A)', value: 'A (grams) = c (g/kg) × p (body weight kg) × r (0.68 Male / 0.55 Female)', highlight: 'Retrograde: Ct + beta*t' },
          { label: 'Dichromate Oxidation Reaction', value: 'K2Cr2O7 + H2SO4 + Ethanol → Acetic Acid + Green Cr2(SO4)3', highlight: 'Kozelka-Hine / Cavett' },
          { label: 'Carbamates vs Organophosphates', value: 'Carbamates cause reversible carbamylation (spontaneously decarbamylates)', highlight: 'Atropine ONLY' },
          { label: 'Paraquat Bipyridyl Herbicide', value: 'Redox-cycling Pulmonary Fibrosis; Sodium Dithionite + Alkali → Blue colour', highlight: 'O2 Contraindicated!' }
        ]
      }
    ]
  },
  5: {
    moduleNumber: 5,
    code: 'FT2601-M5',
    title: 'NDPS Act, Drugs of Abuse, Sports Doping & Alkaloid Characterization',
    clipartImageSrc: '/src/assets/images/tox_m5_ndps_alkaloids_cheatsheet_1793820539029.jpg',
    clipartImageCaption:
      'Figure 5.1: Illustrated Clipart Cheatsheet — Color Spot Test Rack, Alkaloid Precipitation Reagents & WADA GC-C-IRMS Steroid Isotope Analysis',
    mindmapTitle: 'Module 05 Mindmap: NDPS Drugs, Alkaloids & Sports Doping Analysis',
    mindmapCenterLabel: 'NDPS & ALKALOIDS',
    mindmapCenterSub: 'NDPS Act · Spot Tests · Alkaloids · WADA',
    mindmapBranches: [
      {
        id: 'm5-b1',
        title: '1. NDPS Act 1985 Quantities & Sampling',
        colorHex: '#0284c7',
        bgHex: '#f0f9ff',
        borderHex: '#bae6fd',
        iconType: 'gavel',
        items: [
          'Heroin (Diacetylmorphine): Small Qty = 5 g | Commercial Qty = 250 g (Pathognomonic biomarker: 6-MAM)',
          'Cannabis: Ganja (1000 g / 20 kg) | Charas / Hashish Resin (100 g / 1 kg) | Cocaine (2 g / 100 g)',
          'LSD (0.002 g / 0.1 g) | MDMA (0.5 g / 10 g) | Morphine (5 g / 250 g) | Methadone (2 g / 50 g)',
          'Standing Order 1/88 & 1/89: Minimum 24 g per duplicate packet (Cannabis/Opium) & 5 g per packet (Heroin/Cocaine/Psychotropics)'
        ]
      },
      {
        id: 'm5-b2',
        title: '2. Specific NDPS Drugs & Presumptive Tests',
        colorHex: '#7c3aed',
        bgHex: '#f5f3ff',
        borderHex: '#ddd6fe',
        iconType: 'reagent',
        items: [
          'Cannabis (Delta9-THC): Glandular cystolithic trichomes; Duquenois-Levine Test (Violet CHCl3 layer) & Fast Blue B (Red)',
          'Opioids (Heroin/Morphine/Hydromorphone): Marquis (Purple-Violet), Froehde (Violet → Green), Mecke (Blue-Green)',
          'Cocaine: Scott’s 3-Step Cobalt Thiocyanate Test (Blue ppt → dissolves pink in HCl → Blue CHCl3 layer); Cocaethylene with EtOH',
          'Amphetamine (Marquis Orange-Brown) vs MDMA (Marquis Black-Purple + Simon’s Secondary Amine Deep Blue) | LSD (Ehrlich Purple)'
        ]
      },
      {
        id: 'm5-b3',
        title: '3. Alkaloids: Isolation & Characterization',
        colorHex: '#d97706',
        bgHex: '#fffbeb',
        borderHex: '#fde68a',
        iconType: 'flask',
        items: [
          'General Precipitants: Dragendorff’s (KBiI4 → Orange-Red), Mayer’s (K2HgI4 → Creamy-White), Wagner’s (I2/KI → Brown)',
          'Picric Acid (Hager’s → Yellow crystalline) & Marme’s (K2CdI4 → White-Yellow) precipitate basic nitrogenous alkaloids',
          'Tropane Alkaloids (Atropine, Hyoscyamine, Scopolamine): Vitali-Morin Reaction (Conc. HNO3 + Alc. KOH → Intense Violet)',
          'Synthetic Opioids & Hallucinogens: Methadone → EDDP urinary metabolite; Peyote Mescaline (3,4,5-trimethoxyphenethylamine); PCP'
        ]
      },
      {
        id: 'm5-b4',
        title: '4. WADA Sports Doping Analysis',
        colorHex: '#059669',
        bgHex: '#ecfdf5',
        borderHex: '#a7f3d0',
        iconType: 'spectrum',
        items: [
          'Class S1 Anabolic Androgenic Steroids (AAS): Urinary Testosterone / Epitestosterone (T/E) ratio > 4 : 1 triggers confirmation',
          'GC-C-IRMS Confirmation: Measures delta13C isotopic depletion of synthetic plant-sterol-derived testosterone vs endogenous steroids',
          'Class S2 Peptide Hormones (EPO): Isoelectric Focusing (IEF) / SAR-PAGE distinguishes recombinant rHuEPO glycoforms',
          'Class S5 Diuretics & Masking Agents: Furosemide, Hydrochlorothiazide, Probenecid dilute urine or block renal tubular secretion'
        ]
      }
    ],
    cheatsheetTitle: 'Module 05 High-Yield Cheatsheet: NDPS Thresholds, Spot-Test Colors & Alkaloid Reagents',
    cheatsheetSubtitle: 'Colorimetric Swatch Guide & Statutory Quantity Reference',
    cheatsheetCards: [
      {
        heading: 'Presumptive Color Spot-Test & Alkaloid Reagent Chart',
        badge: 'COLORIMETRIC SWATCHES',
        accentColor: '#7c3aed',
        rows: [
          { label: 'Marquis Reagent (HCHO + Conc. H2SO4)', value: 'Purple-Violet (Opioids) | Orange-Brown (Amphetamine) | Black-Purple (MDMA)', highlight: 'Primary Screen' },
          { label: 'Duquenois-Levine (Vanillin + MeCHO + HCl)', value: 'Deep Violet-Purple in lower Chloroform organic phase', highlight: 'Cannabis THC' },
          { label: 'Scott’s Test (Cobalt Thiocyanate)', value: 'Step 1 Blue ppt → Step 2 Pink (HCl) → Step 3 Intense Blue CHCl3 layer', highlight: 'Cocaine HCl/Base' },
          { label: 'Vitali-Morin & Ehrlich’s Reagents', value: 'Vitali-Morin: Violet (Atropine/Datura) | Ehrlich (p-DMAB): Purple-Blue (LSD)', highlight: 'Tropane / Indole' },
          { label: 'Dragendorff / Mayer / Wagner / Hager', value: 'Orange-Red (Bi) / Creamy-White (Hg) / Red-Brown (I2) / Yellow (Picric)', highlight: 'Alkaloid Ppt' }
        ]
      },
      {
        heading: 'NDPS Act 1985 Quantities & Definitive Biomarkers',
        badge: 'STATUTORY & BIOMARKERS',
        accentColor: '#0284c7',
        rows: [
          { label: 'Heroin (5 g Small / 250 g Commercial)', value: '6-Monoacetylmorphine (6-MAM) in urine/blood/vitreous proves Heroin use', highlight: 'Half-life ~36 min' },
          { label: 'Cocaine (2 g Small / 100 g Commercial)', value: 'Benzoylecgonine (primary urinary) + Cocaethylene (co-ingestion with Ethanol)', highlight: 'Cardiotoxic' },
          { label: 'Methadone (2 g Small / 50 g Commercial)', value: 'EDDP (2-Ethylidene-1,5-dimethyl-3,3-diphenylpyrrolidine) proves in-vivo intake', highlight: 'Rules out Spiking' },
          { label: 'WADA T/E Ratio & GC-C-IRMS', value: 'T/E > 4:1 screened → Confirmed by Delta-delta13C > 3 per mil on GC-C-IRMS', highlight: 'Exogenous AAS' }
        ]
      }
    ]
  },
  6: {
    moduleNumber: 6,
    code: 'FT2601-M6',
    title: 'Plant & Animal Poisons, Hair/EtG Forensics & Section 329 BNSS Courtroom Reporting',
    clipartImageSrc: '/src/assets/images/tox_m6_biotoxins_bnss_mindmap_1793820540273.jpg',
    clipartImageCaption:
      'Figure 6.1: Illustrated Clipart Mindmap — Botanical & Animal Poisons, Scalp Hair Segmental Timeline (1 cm/month), Urine EtG & Section 329 BNSS FSL Report',
    mindmapTitle: 'Module 06 Mindmap: Plant/Animal Toxinology, Hair/EtG & Section 329 BNSS',
    mindmapCenterLabel: 'BIOTOXINS & BNSS',
    mindmapCenterSub: 'Plants · Venoms · Hair/EtG · Sec. 329 BNSS',
    mindmapBranches: [
      {
        id: 'm6-b1',
        title: '1. Plant Poisons I (Spinal, Deliriant, Cardiac, Dropsy)',
        colorHex: '#059669',
        bgHex: '#ecfdf5',
        borderHex: '#a7f3d0',
        iconType: 'plant',
        items: [
          'Strychnos nux-vomica (Kuchila): Strychnine blocks spinal Renshaw cell Glycine receptors → Opisthotonus, Risus sardonicus, conscious spasms',
          'Argemone mexicana (Katakar Oil): Sanguinarine & Dihydrosanguinarine → Epidemic Dropsy (Bilateral pedal edema + Glaucoma); HNO3 Crimson',
          'Aconitum napellus (Mithazahar): Persistent Voltage-Gated Na+ channel opening → Tingling/Numbness, Hippus, Bidirectional VT',
          'Cardiotoxic Plants: Kaner (Nerium odorum / Cerbera thevetia) & Madar (Calotropis Uscharin/Calotropin) inhibit Na+/K+-ATPase'
        ]
      },
      {
        id: 'm6-b2',
        title: '2. Plant Poisons II (Toxalbumins, Bhilawa, Fungi)',
        colorHex: '#d97706',
        bgHex: '#fffbeb',
        borderHex: '#fde68a',
        iconType: 'plant',
        items: [
          'Abrus precatorius (Ratti / Sui Needles) & Ricinus communis (Castor): Abrin & Ricin cleave 28S rRNA of 60S ribosome (halt protein synthesis)',
          'Semecarpus anacardium (Bhilawa / Marking Nut): Bhilawanol & Anacardol cause "False Bruise" blister; turns Deep Purple-Blue with Alcoholic KOH',
          'Plumbago rosea/zeylanica (Chitrak): Plumbagin used as criminal abortifacient | Ergot (Claviceps purpurea): St. Anthony’s Fire gangrene',
          'Amanita phalloides (Death Cap): alpha-Amanitin inhibits RNA Polymerase II (Meixner Blue test) | Cyanogenetic Glycosides (Amygdalin/Linamarin)'
        ]
      },
      {
        id: 'm6-b3',
        title: '3. Animal Poisons (Snake, Scorpion & Cantharidin)',
        colorHex: '#dc2626',
        bgHex: '#fef2f2',
        borderHex: '#fecaca',
        iconType: 'snake',
        items: [
          'Elapids (Cobra Naja naja & Krait Bungarus): Neurotoxic (Alpha-neurotoxins & Beta-bungarotoxin) → Ptosis, bulbar & respiratory paralysis',
          'Viperids (Russell’s & Saw-Scaled Viper): Hemotoxic/Vasculotoxic → 20WBCT (> 20 min unclotted), DIC, gum bleeding, acute renal failure',
          'Mesobuthus tamulus (Indian Red Scorpion): Alpha-toxin Catecholamine Autonomic Storm (Pulmonary edema, Priapism); Antidote: Prazosin',
          'Cantharidin (Spanish Fly Blister Beetle): Inhibits Protein Phosphatase 2A (PP2A) → Intense genitourinary blistering, hematuria, priapism'
        ]
      },
      {
        id: 'm6-b4',
        title: '4. Hair Chronology, EtG & Sec. 329 BNSS',
        colorHex: '#0284c7',
        bgHex: '#f0f9ff',
        borderHex: '#bae6fd',
        iconType: 'gavel',
        items: [
          'Scalp Hair Segmental Analysis: Posterior vertex grows ~1.0 cm/month (0.35 mm/day); 4.0–6.0 cm segment = exposure 4 to 6 months prior',
          'Antemortem vs Postmortem Ethanol: Positive Ethyl Glucuronide (EtG) & Ethyl Sulphate (EtS) + Vitreous Humor proves antemortem intake',
          'Section 329 BNSS 2023 (formerly Sec. 293 CrPC): FSL Director / Chemical Examiner Report is per se admissible without routine appearance',
          'Causes of Negative Chemical Report in True Poisoning: Complete antemortem metabolism, emesis/lavage, ester hydrolysis (Aconite/Cocaine), volatility'
        ]
      }
    ],
    cheatsheetTitle: 'Module 06 High-Yield Cheatsheet: Plant/Animal Differential & Courtroom Forensics',
    cheatsheetSubtitle: 'Botanical/Zoogenic Diagnostic Table & Section 329 BNSS Protocol',
    cheatsheetCards: [
      {
        heading: 'Differential Diagnosis: Strychnine vs Tetanus & True vs False Bruise',
        badge: 'MEDICO-LEGAL DIFF',
        accentColor: '#059669',
        rows: [
          { label: 'Strychnine vs Tetanus Spasms', value: 'Strychnine: Generalized, complete relaxation between spasms, Risus sardonicus; Tetanus: Trismus first, rigid', highlight: 'Conscious Sensorium' },
          { label: 'Bhilawa False Bruise vs True Bruise', value: 'Bhilawa:Itchy marginal vesicles, dark acrid fluid turns Purple-Blue with Alcoholic KOH', highlight: 'No Extravasation' },
          { label: 'Argemone Oil Confirmation Tests', value: 'Conc. HNO3 Test (Crimson-Orange lower layer) + Ferric Chloride Test (Red acicular crystals)', highlight: 'Sanguinarine' },
          { label: 'Snakebite Bedside 20WBCT & ASV', value: '2 mL blood in new clean dry glass tube for 20 min → Unclotted = Viperid VICC; Polyvalent ASV + Neostigmine', highlight: 'Big Four India' }
        ]
      },
      {
        heading: 'Hair Chronology, EtG Biomarkers & Section 329 BNSS',
        badge: 'FORENSIC INTERPRETATION',
        accentColor: '#0284c7',
        rows: [
          { label: 'Hair Segmental Timeline Formula', value: 'Months Prior to Collection = Distance from Root (cm) / 1.0 cm per month', highlight: 'Posterior Vertex' },
          { label: 'Microbial Fermentation vs Ingestion', value: 'Blood EtOH (+) with Vitreous EtOH (0) and Urine EtG/EtS (0) = Postmortem Microbial Artifact', highlight: 'Candida / E. coli' },
          { label: 'Section 329 BNSS 2023 Admissibility', value: 'Replaces Sec. 293 CrPC; Court may summon expert if report is ambiguous or contested by defence', highlight: 'Chain of Custody' },
          { label: 'Negative FSL Report in True Poisoning', value: 'Prolonged survival/metabolism, volatility (HCN/PH3), ester hydrolysis (Aconite/Succinylcholine)', highlight: 'Clinical + Autopsy' }
        ]
      }
    ]
  }
};

function ClipartNodeIcon({ type, color }: { type: ModuleVisualGuideData['mindmapBranches'][0]['iconType']; color: string }) {
  switch (type) {
    case 'flask':
      return (
        <svg viewBox="0 0 36 36" className="w-8 h-8 shrink-0" fill="none">
          <rect x="2" y="2" width="32" height="32" rx="8" fill="#ffffff" stroke={color} strokeWidth="2" />
          <path d="M14 9h8M16 9v6l-6 10a2 2 0 001.7 3h12.6a2 2 0 001.7-3l-6-10V9" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M12.5 22h11" stroke={color} strokeWidth="2" strokeLinecap="round" />
          <circle cx="16" cy="25" r="1.3" fill={color} />
          <circle cx="20" cy="24.5" r="1" fill={color} />
        </svg>
      );
    case 'organ':
      return (
        <svg viewBox="0 0 36 36" className="w-8 h-8 shrink-0" fill="none">
          <rect x="2" y="2" width="32" height="32" rx="8" fill="#ffffff" stroke={color} strokeWidth="2" />
          <path d="M18 27s-8-4.8-8-11a4.5 4.5 0 018-2.8A4.5 4.5 0 0126 16c0 6.2-8 11-8 11z" fill={color} fillOpacity="0.15" stroke={color} strokeWidth="2.2" />
          <path d="M12 18h3l2-3 2 6 2-3h3" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'receptor':
      return (
        <svg viewBox="0 0 36 36" className="w-8 h-8 shrink-0" fill="none">
          <rect x="2" y="2" width="32" height="32" rx="8" fill="#ffffff" stroke={color} strokeWidth="2" />
          <path d="M7 18h22" stroke="#94a3b8" strokeWidth="2" strokeDasharray="2 2" />
          <rect x="13" y="10" width="4" height="16" rx="2" fill={color} fillOpacity="0.2" stroke={color} strokeWidth="2" />
          <rect x="19" y="10" width="4" height="16" rx="2" fill={color} fillOpacity="0.2" stroke={color} strokeWidth="2" />
          <circle cx="18" cy="7" r="2" fill={color} />
        </svg>
      );
    case 'shield':
      return (
        <svg viewBox="0 0 36 36" className="w-8 h-8 shrink-0" fill="none">
          <rect x="2" y="2" width="32" height="32" rx="8" fill="#ffffff" stroke={color} strokeWidth="2" />
          <path d="M18 8l8 3.5v6c0 5.2-3.4 9.6-8 11-4.6-1.4-8-5.8-8-11v-6L18 8z" fill={color} fillOpacity="0.15" stroke={color} strokeWidth="2.2" />
          <path d="M14.5 18l2.5 2.5 4.5-4.5" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'jar':
      return (
        <svg viewBox="0 0 36 36" className="w-8 h-8 shrink-0" fill="none">
          <rect x="2" y="2" width="32" height="32" rx="8" fill="#ffffff" stroke={color} strokeWidth="2" />
          <rect x="12" y="8" width="12" height="3" rx="1" fill={color} />
          <rect x="10" y="11" width="16" height="17" rx="2.5" fill={color} fillOpacity="0.12" stroke={color} strokeWidth="2" />
          <path d="M10 18h16" stroke={color} strokeWidth="1.6" />
        </svg>
      );
    case 'funnel':
      return (
        <svg viewBox="0 0 36 36" className="w-8 h-8 shrink-0" fill="none">
          <rect x="2" y="2" width="32" height="32" rx="8" fill="#ffffff" stroke={color} strokeWidth="2" />
          <path d="M13 10h10l-2 11-3 4v4h-0l-3-4-2-11z" fill={color} fillOpacity="0.15" stroke={color} strokeWidth="2" strokeLinejoin="round" />
          <path d="M12 16h12" stroke={color} strokeWidth="1.8" />
        </svg>
      );
    case 'chromatography':
      return (
        <svg viewBox="0 0 36 36" className="w-8 h-8 shrink-0" fill="none">
          <rect x="2" y="2" width="32" height="32" rx="8" fill="#ffffff" stroke={color} strokeWidth="2" />
          <rect x="11" y="8" width="14" height="20" rx="1.5" fill="#ffffff" stroke={color} strokeWidth="2" />
          <path d="M11 12h14M11 24h14" stroke={color} strokeWidth="1.4" strokeDasharray="2 2" />
          <circle cx="16" cy="19" r="2" fill={color} />
          <circle cx="20" cy="15" r="2" fill="#dc2626" />
        </svg>
      );
    case 'spectrum':
      return (
        <svg viewBox="0 0 36 36" className="w-8 h-8 shrink-0" fill="none">
          <rect x="2" y="2" width="32" height="32" rx="8" fill="#ffffff" stroke={color} strokeWidth="2" />
          <path d="M8 26h20M11 26l2.5-12 2.5 12M18 26l2.5-16 2.5 16M24 26l1.5-7 1.5 7" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'metal':
      return (
        <svg viewBox="0 0 36 36" className="w-8 h-8 shrink-0" fill="none">
          <rect x="2" y="2" width="32" height="32" rx="8" fill="#ffffff" stroke={color} strokeWidth="2" />
          <polygon points="18,8 26,18 18,28 10,18" fill={color} fillOpacity="0.15" stroke={color} strokeWidth="2" />
          <path d="M10 18h16M18 8v20" stroke={color} strokeWidth="1.5" />
        </svg>
      );
    case 'breath':
      return (
        <svg viewBox="0 0 36 36" className="w-8 h-8 shrink-0" fill="none">
          <rect x="2" y="2" width="32" height="32" rx="8" fill="#ffffff" stroke={color} strokeWidth="2" />
          <path d="M9 25V11M9 25h18" stroke="#64748b" strokeWidth="2" strokeLinecap="round" />
          <path d="M10 24c2-8 4-11 6-11s8 6 10 9" stroke={color} strokeWidth="2.4" strokeLinecap="round" />
        </svg>
      );
    case 'reagent':
      return (
        <svg viewBox="0 0 36 36" className="w-8 h-8 shrink-0" fill="none">
          <rect x="2" y="2" width="32" height="32" rx="8" fill="#ffffff" stroke={color} strokeWidth="2" />
          <rect x="11" y="9" width="5" height="18" rx="2.5" fill={color} fillOpacity="0.25" stroke={color} strokeWidth="2" />
          <rect x="20" y="9" width="5" height="18" rx="2.5" fill="#0284c7" fillOpacity="0.25" stroke="#0284c7" strokeWidth="2" />
        </svg>
      );
    case 'plant':
      return (
        <svg viewBox="0 0 36 36" className="w-8 h-8 shrink-0" fill="none">
          <rect x="2" y="2" width="32" height="32" rx="8" fill="#ffffff" stroke={color} strokeWidth="2" />
          <path d="M18 27V15M18 21c-5 0-8-4-7-9 5-1 9 2 7 9zM18 18c5 0 8-3 7-8-5-1-8 2-7 8z" fill={color} fillOpacity="0.16" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'snake':
      return (
        <svg viewBox="0 0 36 36" className="w-8 h-8 shrink-0" fill="none">
          <rect x="2" y="2" width="32" height="32" rx="8" fill="#ffffff" stroke={color} strokeWidth="2" />
          <path d="M11 25c0-4 14-3 14-8s-12-4-12-7c0-2 3-3 6-2" stroke={color} strokeWidth="2.4" strokeLinecap="round" />
          <circle cx="19" cy="9" r="1.5" fill={color} />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 36 36" className="w-8 h-8 shrink-0" fill="none">
          <rect x="2" y="2" width="32" height="32" rx="8" fill="#ffffff" stroke={color} strokeWidth="2" />
          <path d="M13 12l6-4 5 5-6 4-5-5zM18 15l8 8M10 26h10" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
  }
}

export function ModuleVisualMindmapAndCheatsheet({ moduleNumber }: { moduleNumber: number }) {
  const guide = MODULE_VISUAL_GUIDES[moduleNumber] || MODULE_VISUAL_GUIDES[1];
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <div className="rounded-2xl border border-slate-300 bg-white text-slate-900 shadow-md overflow-hidden">
      {/* Top White-Background Visual Atlas Header Bar */}
      <div className="px-5 py-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-600">
            <span className="text-sky-700 font-black">{guide.code}</span>
            <span aria-hidden="true">·</span>
            <span>VISUAL MINDMAP, DIAGRAMS & EXAM CHEATSHEET</span>
          </div>
          <h3 className="text-base sm:text-lg font-heading font-black text-slate-900 mt-0.5">
            {guide.title}
          </h3>
        </div>
      </div>

      <div className="p-5 sm:p-6 bg-white space-y-8">
        {/* 1. ILLUSTRATED CLIPART PLATE ON PURE WHITE BACKGROUND */}
        <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-sky-700">
                  01. Illustrated Scientific Clipart Diagram & Visual Overview
                </span>
                <p className="text-xs text-slate-600">
                  High-resolution professional clipart mindmap and laboratory workflow plate on a crisp white background. Click image to enlarge.
                </p>
              </div>
              {!imageError && (
                <button
                  type="button"
                  onClick={() => setLightboxOpen(true)}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <ZoomIn size={14} className="text-sky-700" />
                  <span>Enlarge Diagram</span>
                </button>
              )}
            </div>

            {!imageError ? (
              <div
                onClick={() => setLightboxOpen(true)}
                className="relative group rounded-xl border-2 border-slate-200 bg-white p-2 sm:p-4 cursor-zoom-in overflow-hidden shadow-xs hover:border-sky-500 transition-colors"
              >
                <img
                  src={guide.clipartImageSrc}
                  alt={guide.clipartImageCaption}
                  referrerPolicy="no-referrer"
                  onError={() => setImageError(true)}
                  className="w-full max-h-[520px] object-contain mx-auto bg-white rounded-lg"
                />
                <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600 px-1">
                  <span className="font-medium">{guide.clipartImageCaption}</span>
                  <span className="text-sky-700 font-bold flex items-center gap-1 shrink-0">
                    <Maximize2 size={12} /> Click to Zoom
                  </span>
                </div>
              </div>
            ) : (
              <div className="p-6 rounded-xl border border-slate-200 bg-slate-50 text-center text-xs text-slate-600">
                Refer to the interactive vector mindmap and cheatsheet diagrams below for complete {guide.code} visual schematics.
              </div>
            )}
          </div>

        {/* 2. PROFESSIONAL VECTOR CLIPART MINDMAP DIAGRAM ON PURE WHITE BACKGROUND */}
        <div className="space-y-4">
            <div className="border-b border-slate-200 pb-2">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-indigo-700">
                02. Structured Concept Mindmap ({guide.code})
              </span>
              <h4 className="text-sm sm:text-base font-heading font-black text-slate-900">
                {guide.mindmapTitle}
              </h4>
            </div>

            {/* Pure White Mindmap Canvas */}
            <div className="rounded-xl border-2 border-slate-200 bg-white p-4 sm:p-6 space-y-6">
              {/* Central Root Hub Node */}
              <div className="flex justify-center">
                <div className="px-6 py-3.5 rounded-2xl bg-slate-900 text-white border-2 border-slate-800 shadow-md text-center max-w-md">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-amber-300 font-bold block">
                    {guide.code} · CENTRAL CONCEPT HUB
                  </span>
                  <p className="text-sm sm:text-base font-heading font-black tracking-tight mt-0.5">
                    {guide.mindmapCenterLabel}
                  </p>
                  <p className="text-[11px] text-slate-300 font-mono mt-0.5">
                    {guide.mindmapCenterSub}
                  </p>
                </div>
              </div>

              {/* SVG Connector Branches (Desktop) */}
              <div className="hidden md:block -my-3">
                <svg viewBox="0 0 800 44" className="w-full h-10 overflow-visible" fill="none">
                  <path
                    d="M400 0 V20 M200 20 H600 M200 20 V42 M600 20 V42"
                    stroke="#64748b"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                  <circle cx="400" cy="20" r="4.5" fill="#0f172a" />
                  <circle cx="200" cy="20" r="4" fill="#0284c7" />
                  <circle cx="600" cy="20" r="4" fill="#dc2626" />
                </svg>
              </div>

              {/* 4 Mindmap Branch Quadrants with Professional Clipart Icons */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {guide.mindmapBranches.map((branch) => (
                  <div
                    key={branch.id}
                    style={{
                      backgroundColor: branch.bgHex,
                      borderColor: branch.borderHex
                    }}
                    className="rounded-xl border-2 p-4 space-y-3 transition-shadow hover:shadow-md"
                  >
                    <div className="flex items-center gap-3 pb-2 border-b border-slate-200/80">
                      <ClipartNodeIcon type={branch.iconType} color={branch.colorHex} />
                      <h5
                        style={{ color: branch.colorHex }}
                        className="text-xs sm:text-sm font-heading font-black uppercase tracking-tight"
                      >
                        {branch.title}
                      </h5>
                    </div>

                    <ul className="space-y-2">
                      {branch.items.map((item, i) => (
                        <li
                          key={i}
                          className="bg-white rounded-lg px-3 py-2 border border-slate-200/90 text-xs text-slate-800 leading-relaxed flex items-start gap-2 shadow-2xs"
                        >
                          <span
                            style={{ color: branch.colorHex }}
                            className="font-mono font-black text-xs mt-0.5 shrink-0"
                          >
                            ▸
                          </span>
                          <span className="font-medium">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>

        {/* 3. HIGH-YIELD REVISION & LAB CHEATSHEET ON PURE WHITE BACKGROUND */}
        <div className="space-y-4">
            <div className="border-b border-slate-200 pb-2">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-700">
                03. High-Yield Forensic Revision Cheatsheet ({guide.code})
              </span>
              <h4 className="text-sm sm:text-base font-heading font-black text-slate-900">
                {guide.cheatsheetTitle}
              </h4>
              <p className="text-xs text-slate-600">{guide.cheatsheetSubtitle}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {guide.cheatsheetCards.map((card, cIdx) => (
                <div
                  key={cIdx}
                  className="rounded-xl border-2 border-slate-200 bg-white overflow-hidden shadow-xs flex flex-col"
                >
                  <div
                    style={{ borderBottomColor: card.accentColor }}
                    className="px-4 py-3 bg-slate-50 border-b-2 flex items-center justify-between gap-2"
                  >
                    <h5 className="text-xs sm:text-sm font-heading font-black text-slate-900 uppercase tracking-tight">
                      {card.heading}
                    </h5>
                    <span
                      style={{ color: card.accentColor }}
                      className="text-[10px] font-mono font-black uppercase tracking-wider shrink-0"
                    >
                      {card.badge}
                    </span>
                  </div>

                  <div className="divide-y divide-slate-200 flex-1">
                    {card.rows.map((r, rIdx) => (
                      <div key={rIdx} className="p-3.5 bg-white hover:bg-slate-50/80 transition-colors space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                            <CheckCircle2 size={13} style={{ color: card.accentColor }} className="shrink-0" />
                            <span>{r.label}</span>
                          </span>
                          {r.highlight && (
                            <span className="text-[10px] font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-300 shrink-0">
                              {r.highlight}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-700 pl-5 leading-relaxed font-medium">
                          {r.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
      </div>

      {/* Fullscreen Lightbox Modal for Clipart Mindmap & Cheatsheet Image */}
      {lightboxOpen && !imageError && (
        <div
          onClick={() => setLightboxOpen(false)}
          className="fixed inset-0 z-[300] bg-black/80 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl max-w-6xl w-full max-h-[92vh] overflow-auto p-4 sm:p-6 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <span className="text-xs font-mono font-black text-sky-700 uppercase">
                  {guide.code} · HIGH-RESOLUTION VISUAL DIAGRAM
                </span>
                <h4 className="text-sm sm:text-base font-heading font-black text-slate-900">
                  {guide.clipartImageCaption}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setLightboxOpen(false)}
                className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 cursor-pointer"
                aria-label="Close diagram"
              >
                <X size={18} />
              </button>
            </div>
            <div className="bg-white p-2 rounded-xl border border-slate-200">
              <img
                src={guide.clipartImageSrc}
                alt={guide.clipartImageCaption}
                referrerPolicy="no-referrer"
                className="w-full h-auto max-h-[75vh] object-contain mx-auto bg-white"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function SectionClipartDiagram({
  moduleNumber,
  sectionIndex
}: {
  moduleNumber: number;
  sectionIndex: number;
}) {
  const guide = MODULE_VISUAL_GUIDES[moduleNumber] || MODULE_VISUAL_GUIDES[1];
  const branch = guide.mindmapBranches[sectionIndex % guide.mindmapBranches.length];
  if (!branch) return null;

  return (
    <div className="rounded-xl border-2 border-slate-200 bg-white text-slate-900 p-4 sm:p-5 shadow-xs space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2.5">
        <div className="flex items-center gap-2.5">
          <ClipartNodeIcon type={branch.iconType} color={branch.colorHex} />
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 block">
              {guide.code} · SECTION {sectionIndex + 1} VISUAL CONCEPT DIAGRAM
            </span>
            <h5
              style={{ color: branch.colorHex }}
              className="text-xs sm:text-sm font-heading font-black uppercase tracking-tight"
            >
              {branch.title} — Key Pathway & Mechanism Nodes
            </h5>
          </div>
        </div>
        <span className="text-[10px] font-mono font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded border border-slate-300">
          Whiteboard Clipart Schematic
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
        {branch.items.map((item, idx) => {
          const [head, ...rest] = item.split(':');
          const body = rest.join(':').trim();
          return (
            <div
              key={idx}
              style={{
                backgroundColor: branch.bgHex,
                borderColor: branch.borderHex
              }}
              className="rounded-xl border-2 p-3 flex flex-col justify-between gap-2 relative"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between gap-1">
                  <span
                    style={{
                      backgroundColor: branch.colorHex
                    }}
                    className="text-white font-mono font-black text-[10px] px-2 py-0.5 rounded"
                  >
                    NODE 0{idx + 1}
                  </span>
                  <ClipartNodeIcon type={branch.iconType} color={branch.colorHex} />
                </div>
                {body ? (
                  <>
                    <p className="text-xs font-heading font-black text-slate-900 leading-snug pt-0.5">
                      {head}
                    </p>
                    <p className="text-[11px] text-slate-700 leading-relaxed font-medium bg-white p-2 rounded-lg border border-slate-200/80">
                      {body}
                    </p>
                  </>
                ) : (
                  <p className="text-xs text-slate-800 leading-relaxed font-semibold bg-white p-2 rounded-lg border border-slate-200/80">
                    {item}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

