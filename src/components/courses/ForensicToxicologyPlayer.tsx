import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  Award,
  FileText,
  FlaskConical,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Download,
  Upload,
  Sliders,
  RefreshCw,
  Check,
  X,
  Lock,
  Unlock,
  UserCheck,
  Calendar,
  Sparkles,
  Scale,
  Calculator,
  FileCheck,
  ExternalLink,
  HelpCircle,
  ClipboardCheck
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { localFileStore, uploadBlobToCloudFirestore, getBlobFromCloudFirestore } from '@/lib/localFileStore';
import {
  FORENSIC_TOXICOLOGY_COURSE_ID,
  FORENSIC_TOXICOLOGY_COURSE_CODE,
  FORENSIC_TOXICOLOGY_MODULES,
  ToxModule,
  ToxCourseEnrollment,
  ToxModuleProgress,
  CertTemplateConfig,
  DEFAULT_CERT_TEMPLATE_CONFIG,
  createInitialToxEnrollment,
  syncEnrollmentWithUpdatedSyllabus,
  runModuleQuizAutoCheck,
  runModuleAssignmentAutoCheck,
  moduleHasAssignment,
  verifyAllModulesEligibility,
  generateForensicToxicologyCertificatePdf
} from '@/services/forensicToxicologyCourse';
import {
  ModuleVisualMindmapAndCheatsheet,
  SectionClipartDiagram,
  MODULE_VISUAL_GUIDES
} from '@/components/courses/ForensicToxicologyVisualGuides';

const LOCAL_ENROLLMENT_KEY = 'forenclue_tox_course_enrollment_v1';
const LOCAL_TEMPLATE_CONFIG_KEY = 'forenclue_tox_cert_template_config_v1';
const LOCAL_TEMPLATE_BLOB_KEY = 'forenclue_tox_cert_template_pdf_blob';

function InteractiveModuleSandbox({ toolType }: { toolType: ToxModule['interactiveToolType'] }) {
  // 1. Viscera Matrix Explorer (Module 1)
  const [selectedPoisonClass, setSelectedPoisonClass] = useState<string>('silver_nitrate');
  // 2. PMR & Vd Calculator (Module 2)
  const [centralConc, setCentralConc] = useState<number>(3.6);
  const [peripheralConc, setPeripheralConc] = useState<number>(0.8);
  const [doseMg, setDoseMg] = useState<number>(400);
  const [weightKg, setWeightKg] = useState<number>(80);
  const [plasmaC0, setPlasmaC0] = useState<number>(0.5);
  // 3. Widmark BAC Calculator (Module 3)
  const [bacMgDl, setBacMgDl] = useState<number>(120);
  const [driverWeight, setDriverWeight] = useState<number>(75);
  const [widmarkR, setWidmarkR] = useState<number>(0.68);
  const [hoursElapsed, setHoursElapsed] = useState<number>(3);
  const [elimRate, setElimRate] = useState<number>(15);
  // 4. NDPS Quantity Classifier (Module 4)
  const [ndpsDrug, setNdpsDrug] = useState<'heroin' | 'charas' | 'ganja' | 'cocaine' | 'lsd'>('heroin');
  const [seizedGrams, setSeizedGrams] = useState<number>(320);
  // 5. Analytical TLC Rf & MRM Ion Ratio Validator (Module 5)
  const [soluteCm, setSoluteCm] = useState<number>(9.0);
  const [solventCm, setSolventCm] = useState<number>(15.0);
  const [quantArea, setQuantArea] = useState<number>(40000);
  const [qualArea, setQualArea] = useState<number>(19200);
  const [refRatioPct, setRefRatioPct] = useState<number>(50);
  // 6. Hair Chronology & EtG Analyzer (Module 6)
  const [hairDistCm, setHairDistCm] = useState<number>(4.0);
  const [hairGrowthRate, setHairGrowthRate] = useState<number>(1.0);
  const [bloodEtOH, setBloodEtOH] = useState<number>(70);
  const [vitreousEtOH, setVitreousEtOH] = useState<number>(0);
  const [urineEtG, setUrineEtG] = useState<number>(0);

  if (toolType === 'viscera_matrix') {
    const matrices: Record<string, { label: string; preservative: string; contraindicated: string; reason: string; bottles: string; toxidrome: string; antidote: string }> = {
      routine: {
        label: 'Organophosphate / Carbamate Pesticide (Cholinergic Crisis)',
        preservative: 'Saturated Solution of Common Salt (NaCl)',
        contraindicated: '10% Buffered Formalin',
        reason: 'Saturated NaCl arrests putrefaction without interfering in Stas-Otto or GC-MS pesticide extraction.',
        bottles: 'Bottle I: Stomach + FIRST Gastric Lavage fluid | Bottle II: Liver (≥500g) + Kidney | Bottle III: Blood (1% NaF) | Bottle IV: Control NaCl Blank',
        toxidrome: 'Cholinergic SLUDGE + Killer B’s (Bronchorrhea, Bronchospasm, Bradycardia) + Pinpoint Miosis via AChE phosphorylation',
        antidote: 'Atropine (Competitive Muscarinic Antagonist) + Pralidoxime / 2-PAM (AChE Reactivator before aging)'
      },
      silver_nitrate: {
        label: 'Silver Nitrate (AgNO3) / Corrosive Mineral Acid (HCl)',
        preservative: 'Rectified Spirit (90% Ethanol)',
        contraindicated: 'Saturated Solution of Common Salt (NaCl)',
        reason: 'NaCl reacts with AgNO3 to precipitate insoluble white Silver Chloride (AgCl) and confounds chloride quantification in HCl poisoning.',
        bottles: 'Bottle I: Stomach + contents in Rectified Spirit | Bottle II: Liver (≥500g) + Kidney | Bottle III: Blood (NaF) | Bottle IV: Control Spirit Sample',
        toxidrome: 'Corrosive Coagulative Necrosis: Intense burning retrosternal pain, black/brown eschar, white curdy AgCl vomitus',
        antidote: 'Demulcents (milk, egg albumin); strictly avoid gastric lavage, emetics, and sodium bicarbonate (perforation risk)'
      },
      alcohol_volatiles: {
        label: 'Ethanol / Methanol / Paracetamol (Zero-Order & Lethal Synthesis)',
        preservative: 'Saturated NaCl (Viscera) & 1% Sodium Fluoride (Blood)',
        contraindicated: 'Rectified Spirit (90% Ethanol)',
        reason: 'Rectified spirit is 90% ethanol and completely invalidates forensic alcohol/volatile estimation.',
        bottles: 'Bottle I & II: Viscera in Sat. NaCl | Bottle III: Femoral Blood + Vitreous Humor in 1% NaF | Bottle IV: Control NaCl Blank',
        toxidrome: 'Methanol -> Formic Acid optic neuropathy/anion-gap acidosis | Paracetamol -> CYP2E1 NAPQI centrilobular hepatic necrosis',
        antidote: 'Fomepizole / Ethanol (ADH competitive inhibition for Methanol) | N-Acetylcysteine (Glutathione replenishment for NAPQI)'
      },
      aconite: {
        label: 'Aconite (Mithazahar) / Datura (Stupefying Sec. 123 BNS)',
        preservative: 'Acidified Rectified Spirit (Ethanol + trace Acetic Acid)',
        contraindicated: 'Alkaline / Impure Saturated NaCl',
        reason: 'Aconitine ester alkaloid is rapidly hydrolyzed into inactive aconine in alkaline media or putrefactive environments.',
        bottles: 'Bottle I: Stomach in Acidified Spirit | Bottle II: Liver (≥500g) + Kidney | Bottle III: Blood (NaF) | Bottle IV: Control Spirit Blank',
        toxidrome: 'Aconite: Voltage-gated Na+ channel activation (tingling/numbness, Hippus, ventricular ectopy) | Datura: Anticholinergic 7 D’s',
        antidote: 'Aconite: Amiodarone/Flecanide & supportive ICU care | Datura: Physostigmine Salicylate (crosses BBB to restore ACh)'
      }
    };
    const active = matrices[selectedPoisonClass] || matrices.silver_nitrate;

    return (
      <div className="bg-base border border-black/10 dark:border-white/10 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <FlaskConical size={18} className="text-warning" />
            <h4 className="text-xs font-black uppercase tracking-widest text-text-main">
              Interactive Toxidrome, Antidote & Preservative Matrix Simulator
            </h4>
          </div>
          <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            ● LAB SIMULATOR
          </span>
        </div>

        <div>
          <label className="text-[10px] font-mono uppercase tracking-wider text-text-muted block mb-1.5">
            Select Suspected Poison / Toxidrome Scenario:
          </label>
          <select
            value={selectedPoisonClass}
            onChange={(e) => setSelectedPoisonClass(e.target.value)}
            className="w-full bg-surface border border-black/10 dark:border-white/10 rounded-lg px-3 py-2 text-xs font-bold text-text-main outline-none focus:border-warning"
          >
            {Object.entries(matrices).map(([k, v]) => (
              <option key={k} value={k}>{v.label}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
            <span className="text-[10px] font-mono uppercase text-emerald-400 font-black block">
              ✓ Specific Antidote & Receptor Action
            </span>
            <p className="text-xs font-bold text-text-main mt-1">{active.antidote}</p>
          </div>
          <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
            <span className="text-[10px] font-mono uppercase text-amber-400 font-black block">
              ⚡ Clinical Toxidrome & ADME Mechanism
            </span>
            <p className="text-xs font-bold text-text-main mt-1">{active.toxidrome}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
            <span className="text-[10px] font-mono uppercase text-emerald-400 font-black block">
              ✓ Recommended Autopsy Preservative
            </span>
            <p className="text-xs font-bold text-text-main mt-1">{active.preservative}</p>
          </div>
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
            <span className="text-[10px] font-mono uppercase text-red-400 font-black block">
              ✕ Contraindicated Preservative
            </span>
            <p className="text-xs font-bold text-text-main mt-1">{active.contraindicated}</p>
          </div>
        </div>

        <div className="p-3 rounded-lg bg-surface border border-black/5 dark:border-white/5 text-xs space-y-1.5">
          <p className="text-text-main font-semibold">Forensic Rationale & Bottle Protocol:</p>
          <p className="text-text-muted leading-relaxed">{active.reason}</p>
          <p className="text-[11px] font-mono text-warning pt-1">{active.bottles}</p>
        </div>
      </div>
    );
  }

  if (toolType === 'pmr_calculator') {
    const cpRatio = peripheralConc > 0 ? +(centralConc / peripheralConc).toFixed(2) : 0;
    const vdCalc = weightKg > 0 && plasmaC0 > 0 ? +((doseMg / weightKg) / plasmaC0).toFixed(2) : 0;
    const highPmr = cpRatio >= 2.0;

    return (
      <div className="bg-base border border-black/10 dark:border-white/10 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <Calculator size={18} className="text-warning" />
            <h4 className="text-xs font-black uppercase tracking-widest text-text-main">
              Postmortem Redistribution (C/P) & Vd Simulator
            </h4>
          </div>
          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${highPmr ? 'text-amber-400 bg-amber-500/10 border-amber-500/20' : 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'}`}>
            {highPmr ? '▲ HIGH PMR ARTIFACT' : '● LOW PMR'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2 bg-surface p-3 rounded-lg border border-black/5 dark:border-white/5">
            <p className="text-[10px] font-mono font-bold uppercase text-warning">1. Central vs. Peripheral Blood</p>
            <div>
              <label className="text-[10px] text-text-muted block">Central (Heart) Blood [C]: {centralConc} mg/L</label>
              <input
                type="range"
                min="0.1"
                max="10"
                step="0.1"
                value={centralConc}
                onChange={(e) => setCentralConc(parseFloat(e.target.value))}
                className="w-full accent-warning"
              />
            </div>
            <div>
              <label className="text-[10px] text-text-muted block">Peripheral (Femoral) Blood [P]: {peripheralConc} mg/L</label>
              <input
                type="range"
                min="0.1"
                max="5"
                step="0.1"
                value={peripheralConc}
                onChange={(e) => setPeripheralConc(parseFloat(e.target.value))}
                className="w-full accent-warning"
              />
            </div>
            <div className="pt-1 border-t border-black/10 dark:border-white/10 flex justify-between items-center">
              <span className="text-xs font-bold text-text-muted">Calculated C/P Ratio:</span>
              <span className="text-sm font-mono font-black text-warning">{cpRatio} : 1</span>
            </div>
          </div>

          <div className="space-y-2 bg-surface p-3 rounded-lg border border-black/5 dark:border-white/5">
            <p className="text-[10px] font-mono font-bold uppercase text-warning">2. Volume of Distribution (Vd)</p>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-[9px] text-text-muted block">Dose (mg)</label>
                <input
                  type="number"
                  value={doseMg}
                  onChange={(e) => setDoseMg(parseFloat(e.target.value) || 0)}
                  className="w-full bg-base border border-black/10 dark:border-white/10 rounded px-2 py-1 text-xs font-mono text-text-main"
                />
              </div>
              <div>
                <label className="text-[9px] text-text-muted block">Weight (kg)</label>
                <input
                  type="number"
                  value={weightKg}
                  onChange={(e) => setWeightKg(parseFloat(e.target.value) || 1)}
                  className="w-full bg-base border border-black/10 dark:border-white/10 rounded px-2 py-1 text-xs font-mono text-text-main"
                />
              </div>
              <div>
                <label className="text-[9px] text-text-muted block">C0 (mg/L)</label>
                <input
                  type="number"
                  step="0.1"
                  value={plasmaC0}
                  onChange={(e) => setPlasmaC0(parseFloat(e.target.value) || 0.1)}
                  className="w-full bg-base border border-black/10 dark:border-white/10 rounded px-2 py-1 text-xs font-mono text-text-main"
                />
              </div>
            </div>
            <div className="pt-2 border-t border-black/10 dark:border-white/10 flex justify-between items-center">
              <span className="text-xs font-bold text-text-muted">Apparent Vd:</span>
              <span className="text-sm font-mono font-black text-emerald-400">{vdCalc} L/kg</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (toolType === 'widmark_calculator') {
    const cGPerKg = bacMgDl / 100;
    const totalEthanolGrams = +(cGPerKg * driverWeight * widmarkR).toFixed(2);
    const crashTimeBac = +(bacMgDl + hoursElapsed * elimRate).toFixed(1);
    const exceedsIndiaLimit = crashTimeBac > 30;

    return (
      <div className="bg-base border border-black/10 dark:border-white/10 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <Calculator size={18} className="text-warning" />
            <h4 className="text-xs font-black uppercase tracking-widest text-text-main">
              Widmark Ethanol Burden & Retrograde Extrapolation Calculator
            </h4>
          </div>
          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${exceedsIndiaLimit ? 'text-red-400 bg-red-500/10 border-red-500/20' : 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'}`}>
            {exceedsIndiaLimit ? '▲ EXCEEDS SEC. 185 MV ACT (30 mg/dL)' : '● WITHIN STATUTORY LIMIT'}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          <div className="bg-surface p-2.5 rounded-lg border border-black/5 dark:border-white/5">
            <label className="text-[9px] font-mono uppercase text-text-muted block">Measured BAC (mg/dL)</label>
            <input
              type="number"
              value={bacMgDl}
              onChange={(e) => setBacMgDl(parseFloat(e.target.value) || 0)}
              className="w-full mt-1 bg-base border border-black/10 dark:border-white/10 rounded px-2 py-1 text-xs font-mono font-bold text-text-main"
            />
          </div>
          <div className="bg-surface p-2.5 rounded-lg border border-black/5 dark:border-white/5">
            <label className="text-[9px] font-mono uppercase text-text-muted block">Weight p (kg)</label>
            <input
              type="number"
              value={driverWeight}
              onChange={(e) => setDriverWeight(parseFloat(e.target.value) || 0)}
              className="w-full mt-1 bg-base border border-black/10 dark:border-white/10 rounded px-2 py-1 text-xs font-mono font-bold text-text-main"
            />
          </div>
          <div className="bg-surface p-2.5 rounded-lg border border-black/5 dark:border-white/5">
            <label className="text-[9px] font-mono uppercase text-text-muted block">Widmark r</label>
            <select
              value={widmarkR}
              onChange={(e) => setWidmarkR(parseFloat(e.target.value))}
              className="w-full mt-1 bg-base border border-black/10 dark:border-white/10 rounded px-2 py-1 text-xs font-mono font-bold text-text-main"
            >
              <option value={0.68}>0.68 (Male)</option>
              <option value={0.55}>0.55 (Female)</option>
            </select>
          </div>
          <div className="bg-surface p-2.5 rounded-lg border border-black/5 dark:border-white/5">
            <label className="text-[9px] font-mono uppercase text-text-muted block">Delay t (hrs)</label>
            <input
              type="number"
              step="0.5"
              value={hoursElapsed}
              onChange={(e) => setHoursElapsed(parseFloat(e.target.value) || 0)}
              className="w-full mt-1 bg-base border border-black/10 dark:border-white/10 rounded px-2 py-1 text-xs font-mono font-bold text-text-main"
            />
          </div>
          <div className="bg-surface p-2.5 rounded-lg border border-black/5 dark:border-white/5">
            <label className="text-[9px] font-mono uppercase text-text-muted block">β Rate (mg/dL/h)</label>
            <input
              type="number"
              value={elimRate}
              onChange={(e) => setElimRate(parseFloat(e.target.value) || 0)}
              className="w-full mt-1 bg-base border border-black/10 dark:border-white/10 rounded px-2 py-1 text-xs font-mono font-bold text-text-main"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3 bg-surface rounded-lg border border-black/5 dark:border-white/5 flex justify-between items-center">
            <span className="text-xs text-text-muted font-bold">Total Pure Ethanol in Body (A = c × p × r):</span>
            <span className="text-sm font-mono font-black text-warning">{totalEthanolGrams} g</span>
          </div>
          <div className="p-3 bg-surface rounded-lg border border-black/5 dark:border-white/5 flex justify-between items-center">
            <span className="text-xs text-text-muted font-bold">Retrograde Crash-Time BAC (C0 = Ct + βt):</span>
            <span className="text-sm font-mono font-black text-emerald-400">{crashTimeBac} mg/100 mL</span>
          </div>
        </div>
      </div>
    );
  }

  if (toolType === 'ndps_schedule_checker') {
    const thresholds = {
      heroin: { name: 'Heroin (Diacetylmorphine)', small: 5, commercial: 250, biomarker: '6-Monoacetylmorphine (6-MAM)', spot: 'Marquis Reagent (Purple-Violet)' },
      charas: { name: 'Charas / Hashish (Cannabis Resin)', small: 100, commercial: 1000, biomarker: 'Δ9-THC & 11-nor-9-carboxy-THC', spot: 'Duquenois-Levine (Violet in CHCl3)' },
      ganja: { name: 'Ganja (Cannabis Flowering Tops)', small: 1000, commercial: 20000, biomarker: 'Δ9-THC & THC-COOH', spot: 'Duquenois-Levine + Cystolithic Hairs' },
      cocaine: { name: 'Cocaine (Benzoylecgonine methyl ester)', small: 2, commercial: 100, biomarker: 'Benzoylecgonine & Cocaethylene (with EtOH)', spot: 'Scott\'s Cobalt Thiocyanate (Blue)' },
      lsd: { name: 'LSD (Lysergic Acid Diethylamide)', small: 0.002, commercial: 0.1, biomarker: '2-Oxo-3-hydroxy-LSD', spot: 'Ehrlich\'s Reagent (p-DMAB → Purple)' }
    };
    const item = thresholds[ndpsDrug];
    const categoryLabel =
      seizedGrams <= item.small
        ? 'SMALL QUANTITY (Sec. 21(a)/20(b)(ii)(A) NDPS)'
        : seizedGrams >= item.commercial
          ? 'COMMERCIAL QUANTITY (Rigorous Imprisonment 10–20 Yrs)'
          : 'INTERMEDIATE QUANTITY (Greater than Small, Less than Commercial)';

    return (
      <div className="bg-base border border-black/10 dark:border-white/10 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <Scale size={18} className="text-warning" />
            <h4 className="text-xs font-black uppercase tracking-widest text-text-main">
              NDPS Act 1985 Statutory Seizure Quantity Classifier
            </h4>
          </div>
          <span className="text-[10px] font-mono font-bold text-warning bg-warning/10 px-2 py-0.5 rounded border border-warning/20">
            ● NDPS SCHEDULE
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-[10px] font-mono uppercase text-text-muted block mb-1">Controlled Narcotic / Psychotropic Substance:</label>
            <select
              value={ndpsDrug}
              onChange={(e) => setNdpsDrug(e.target.value as any)}
              className="w-full bg-surface border border-black/10 dark:border-white/10 rounded-lg px-3 py-2 text-xs font-bold text-text-main"
            >
              {Object.entries(thresholds).map(([k, v]) => (
                <option key={k} value={k}>{v.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-[10px] font-mono uppercase text-text-muted block mb-1">Seized Net Weight (in grams):</label>
            <input
              type="number"
              step="0.01"
              value={seizedGrams}
              onChange={(e) => setSeizedGrams(parseFloat(e.target.value) || 0)}
              className="w-full bg-surface border border-black/10 dark:border-white/10 rounded-lg px-3 py-2 text-xs font-mono font-bold text-text-main"
            />
          </div>
        </div>

        <div className="p-3 bg-surface rounded-lg border border-black/5 dark:border-white/5 space-y-1.5 text-xs">
          <div className="flex justify-between">
            <span className="text-text-muted">Small Threshold: <strong>{item.small} g</strong> | Commercial Threshold: <strong>{item.commercial} g</strong></span>
            <span className="font-mono font-black text-warning">{categoryLabel}</span>
          </div>
          <p className="text-text-muted text-[11px]">
            <strong>Spot Test:</strong> {item.spot} &nbsp;|&nbsp; <strong>Definitive Biomarker:</strong> {item.biomarker}
          </p>
        </div>
      </div>
    );
  }

  if (toolType === 'analytical_validator') {
    const rfVal = solventCm > 0 ? +(soluteCm / solventCm).toFixed(2) : 0;
    const calcIonRatio = quantArea > 0 ? +((qualArea / quantArea) * 100).toFixed(1) : 0;
    const minAllowed = +(refRatioPct * 0.8).toFixed(1);
    const maxAllowed = +(refRatioPct * 1.2).toFixed(1);
    const ionRatioPasses = calcIonRatio >= minAllowed && calcIonRatio <= maxAllowed;

    return (
      <div className="bg-base border border-black/10 dark:border-white/10 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <Sliders size={18} className="text-warning" />
            <h4 className="text-xs font-black uppercase tracking-widest text-text-main">
              TLC Rf & LC-MS/MS MRM Ion-Ratio Validator
            </h4>
          </div>
          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${ionRatioPasses ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' : 'text-red-400 bg-red-500/10 border-red-500/20'}`}>
            {ionRatioPasses ? '● MRM RATIO VERIFIED (±20%)' : '▲ MRM RATIO OUT OF TOLERANCE'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-surface p-3 rounded-lg border border-black/5 dark:border-white/5 space-y-2">
            <p className="text-[10px] font-mono font-bold uppercase text-warning">1. Thin-Layer Chromatography (Rf)</p>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[9px] text-text-muted block">Solute Spot (cm)</label>
                <input
                  type="number"
                  step="0.1"
                  value={soluteCm}
                  onChange={(e) => setSoluteCm(parseFloat(e.target.value) || 0)}
                  className="w-full bg-base border border-black/10 dark:border-white/10 rounded px-2 py-1 text-xs font-mono text-text-main"
                />
              </div>
              <div>
                <label className="text-[9px] text-text-muted block">Solvent Front (cm)</label>
                <input
                  type="number"
                  step="0.1"
                  value={solventCm}
                  onChange={(e) => setSolventCm(parseFloat(e.target.value) || 1)}
                  className="w-full bg-base border border-black/10 dark:border-white/10 rounded px-2 py-1 text-xs font-mono text-text-main"
                />
              </div>
            </div>
            <div className="flex justify-between items-center pt-1 border-t border-black/10 dark:border-white/10">
              <span className="text-xs text-text-muted font-bold">Calculated Rf:</span>
              <span className="text-sm font-mono font-black text-warning">{rfVal}</span>
            </div>
          </div>

          <div className="bg-surface p-3 rounded-lg border border-black/5 dark:border-white/5 space-y-2">
            <p className="text-[10px] font-mono font-bold uppercase text-warning">2. LC-MS/MS Qualifier/Quantifier Ratio</p>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-[9px] text-text-muted block">Quantifier Area</label>
                <input
                  type="number"
                  value={quantArea}
                  onChange={(e) => setQuantArea(parseFloat(e.target.value) || 1)}
                  className="w-full bg-base border border-black/10 dark:border-white/10 rounded px-2 py-1 text-xs font-mono text-text-main"
                />
              </div>
              <div>
                <label className="text-[9px] text-text-muted block">Qualifier Area</label>
                <input
                  type="number"
                  value={qualArea}
                  onChange={(e) => setQualArea(parseFloat(e.target.value) || 0)}
                  className="w-full bg-base border border-black/10 dark:border-white/10 rounded px-2 py-1 text-xs font-mono text-text-main"
                />
              </div>
              <div>
                <label className="text-[9px] text-text-muted block">Ref Ratio (%)</label>
                <input
                  type="number"
                  value={refRatioPct}
                  onChange={(e) => setRefRatioPct(parseFloat(e.target.value) || 50)}
                  className="w-full bg-base border border-black/10 dark:border-white/10 rounded px-2 py-1 text-xs font-mono text-text-main"
                />
              </div>
            </div>
            <div className="flex justify-between items-center pt-1 border-t border-black/10 dark:border-white/10">
              <span className="text-[11px] text-text-muted">Sample Ratio: <strong>{calcIonRatio}%</strong> (Accept: {minAllowed}%–{maxAllowed}%)</span>
              <span className={`text-xs font-mono font-black ${ionRatioPasses ? 'text-emerald-400' : 'text-red-400'}`}>
                {ionRatioPasses ? 'PASS' : 'FAIL'}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default / Module 6: Hair Segmental Chronology & EtG Fermentation Evaluator
  const monthsPrior = hairGrowthRate > 0 ? +(hairDistCm / hairGrowthRate).toFixed(1) : 0;
  const isAntemortemDrinking = vitreousEtOH > 10 || urineEtG >= 0.1;

  return (
    <div className="bg-base border border-black/10 dark:border-white/10 rounded-xl p-5 space-y-4">
      <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <FileCheck size={18} className="text-warning" />
          <h4 className="text-xs font-black uppercase tracking-widest text-text-main">
            Hair Segmental Chronology & EtG Fermentation Evaluator
          </h4>
        </div>
        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${isAntemortemDrinking ? 'text-amber-400 bg-amber-500/10 border-amber-500/20' : 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'}`}>
          {isAntemortemDrinking ? '▲ ANTEMORTEM INGESTION CONFIRMED' : '● POSTMORTEM FERMENTATION ARTIFACT'}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-surface p-3 rounded-lg border border-black/5 dark:border-white/5 space-y-2">
          <p className="text-[10px] font-mono font-bold uppercase text-warning">1. Scalp Hair Segmental Chronology (SoHT)</p>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[9px] text-text-muted block">Distance from Root (cm)</label>
              <input
                type="number"
                step="0.5"
                value={hairDistCm}
                onChange={(e) => setHairDistCm(parseFloat(e.target.value) || 0)}
                className="w-full bg-base border border-black/10 dark:border-white/10 rounded px-2 py-1 text-xs font-mono text-text-main"
              />
            </div>
            <div>
              <label className="text-[9px] text-text-muted block">Growth Rate (cm/mo)</label>
              <input
                type="number"
                step="0.1"
                value={hairGrowthRate}
                onChange={(e) => setHairGrowthRate(parseFloat(e.target.value) || 1)}
                className="w-full bg-base border border-black/10 dark:border-white/10 rounded px-2 py-1 text-xs font-mono text-text-main"
              />
            </div>
          </div>
          <div className="flex justify-between items-center pt-1 border-t border-black/10 dark:border-white/10">
            <span className="text-xs text-text-muted font-bold">Estimated Exposure Time:</span>
            <span className="text-sm font-mono font-black text-warning">{monthsPrior} Months Prior</span>
          </div>
        </div>

        <div className="bg-surface p-3 rounded-lg border border-black/5 dark:border-white/5 space-y-2">
          <p className="text-[10px] font-mono font-bold uppercase text-warning">2. Decomposed Blood Ethanol vs. EtG/Vitreous</p>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-[9px] text-text-muted block">Blood EtOH (mg/dL)</label>
              <input
                type="number"
                value={bloodEtOH}
                onChange={(e) => setBloodEtOH(parseFloat(e.target.value) || 0)}
                className="w-full bg-base border border-black/10 dark:border-white/10 rounded px-2 py-1 text-xs font-mono text-text-main"
              />
            </div>
            <div>
              <label className="text-[9px] text-text-muted block">Vitreous (mg/dL)</label>
              <input
                type="number"
                value={vitreousEtOH}
                onChange={(e) => setVitreousEtOH(parseFloat(e.target.value) || 0)}
                className="w-full bg-base border border-black/10 dark:border-white/10 rounded px-2 py-1 text-xs font-mono text-text-main"
              />
            </div>
            <div>
              <label className="text-[9px] text-text-muted block">Urine EtG (mg/L)</label>
              <input
                type="number"
                step="0.1"
                value={urineEtG}
                onChange={(e) => setUrineEtG(parseFloat(e.target.value) || 0)}
                className="w-full bg-base border border-black/10 dark:border-white/10 rounded px-2 py-1 text-xs font-mono text-text-main"
              />
            </div>
          </div>
          <div className="flex justify-between items-center pt-1 border-t border-black/10 dark:border-white/10">
            <span className="text-[11px] text-text-muted">Conclusion:</span>
            <span className={`text-xs font-mono font-black ${isAntemortemDrinking ? 'text-amber-400' : 'text-emerald-400'}`}>
              {isAntemortemDrinking ? 'Antemortem Ethanol Ingestion' : 'Postmortem Microbial Fermentation'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ForensicToxicologyPlayer() {
  const { user, userProfile, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [enrollment, setEnrollment] = useState<ToxCourseEnrollment | null>(null);
  const [loadingEnrollment, setLoadingEnrollment] = useState(true);
  const [savingProgress, setSavingProgress] = useState(false);

  // Enrollment form inputs
  const [regNameInput, setRegNameInput] = useState('');
  const [regInstInput, setRegInstInput] = useState('');

  // Navigation state: defaults to 'modules-hub' so clicking Enter Course shows all 6 modules options first
  const [activeModuleIdx, setActiveModuleIdx] = useState(0);
  const [activeSubView, setActiveSubView] = useState<'modules-hub' | 'study' | 'quiz' | 'assignment' | 'certificate'>('modules-hub');

  // Certificate Template & PDF generation state
  const [templateConfig, setTemplateConfig] = useState<CertTemplateConfig>(DEFAULT_CERT_TEMPLATE_CONFIG);
  const [customTemplateBytes, setCustomTemplateBytes] = useState<Uint8Array | null>(null);
  const [customTemplateMimeType, setCustomTemplateMimeType] = useState<string>('application/pdf');
  const [uploadingTemplate, setUploadingTemplate] = useState(false);
  const [templateStatusMsg, setTemplateStatusMsg] = useState('');
  const [showTemplateConfigurator, setShowTemplateConfigurator] = useState(false);

  const [previewPdfUrl, setPreviewPdfUrl] = useState<string>('');
  const [generatingCert, setGeneratingCert] = useState(false);
  const [certIssueDateInput, setCertIssueDateInput] = useState<string>(() =>
    new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })
  );
  const [certSuccessBanner, setCertSuccessBanner] = useState<string>('');
  const [showCertNamePromptModal, setShowCertNamePromptModal] = useState(false);
  const [certNameError, setCertNameError] = useState('');

  // Quiz feedback state for the active module
  const [quizFeedbackState, setQuizFeedbackState] = useState<ReturnType<typeof runModuleQuizAutoCheck> | null>(null);

  const activeModule = FORENSIC_TOXICOLOGY_MODULES[activeModuleIdx];

  // Load enrollment from localStorage + Firestore
  useEffect(() => {
    let mounted = true;
    const loadData = async () => {
      setLoadingEnrollment(true);
      try {
        // 1. Check localStorage first
        let loadedEnrollment: ToxCourseEnrollment | null = null;
        const localRaw = localStorage.getItem(LOCAL_ENROLLMENT_KEY);
        if (localRaw) {
          try {
            loadedEnrollment = JSON.parse(localRaw);
          } catch (_) {}
        }

        // 2. Check Firestore user profile if signed in
        if (user) {
          try {
            const userSnap = await getDoc(doc(db, 'users', user.uid));
            if (userSnap.exists()) {
              const data = userSnap.data();
              const cloudTox = data?.progress?.forensic_toxicology_enrollment as ToxCourseEnrollment | undefined;
              if (cloudTox && cloudTox.enrolled) {
                loadedEnrollment = cloudTox;
                localStorage.setItem(LOCAL_ENROLLMENT_KEY, JSON.stringify(cloudTox));
              }
            }
          } catch (e) {
            console.warn('Could not fetch cloud toxicology enrollment:', e);
          }
        }

        if (mounted) {
          const raw = loadedEnrollment as any;
          const candidate = raw?.enrollment?.enrolled !== undefined ? raw.enrollment : raw;

          if (candidate && candidate.enrolled) {
            const syncedEnrollment = syncEnrollmentWithUpdatedSyllabus(candidate);
            setEnrollment(syncedEnrollment);
            localStorage.setItem(LOCAL_ENROLLMENT_KEY, JSON.stringify(syncedEnrollment));
            const savedName =
              syncedEnrollment.registeredName ||
              userProfile?.displayName ||
              user?.displayName ||
              '';
            setRegNameInput(savedName);
            setRegInstInput(syncedEnrollment.institution || (userProfile as any)?.universityName || '');
          } else {
            const searchParams = new URLSearchParams(window.location.search);
            const isJustEnrolled = searchParams.get('enrolled') === 'true';
            const hasPurchased = userProfile?.purchasedCourses?.some((id: any) => {
              const parsedId = typeof id === 'string' ? parseInt(id, 10) : id;
              return parsedId === FORENSIC_TOXICOLOGY_COURSE_ID;
            });
            const defaultName = userProfile?.displayName || user?.displayName || '';
            const defaultInst = (userProfile as any)?.universityName || '';

            if (isJustEnrolled || hasPurchased || defaultName) {
              const autoEnrollment = createInitialToxEnrollment(
                defaultName || 'Investigator',
                user?.email || '',
                defaultInst
              );
              setEnrollment(autoEnrollment);
              setRegNameInput(defaultName || 'Investigator');
              setRegInstInput(defaultInst);
              localStorage.setItem(LOCAL_ENROLLMENT_KEY, JSON.stringify(autoEnrollment));
              if (user) {
                persistEnrollment(autoEnrollment).catch(console.warn);
              }
            } else {
              setEnrollment(null);
              setRegNameInput('');
              setRegInstInput(defaultInst);
            }
          }
        }

        // 3. Load Certificate Template Config & PDF Bytes (from Cloud system_settings + local cache)
        let cfg = { ...DEFAULT_CERT_TEMPLATE_CONFIG };
        const localCfgRaw = localStorage.getItem(LOCAL_TEMPLATE_CONFIG_KEY);
        if (localCfgRaw) {
          try {
            cfg = { ...cfg, ...JSON.parse(localCfgRaw) };
          } catch (_) {}
        }
        try {
          const tplSnap = await getDoc(doc(db, 'system_settings', 'forensic_toxicology_cert_template'));
          if (tplSnap.exists()) {
            cfg = { ...cfg, ...(tplSnap.data() as CertTemplateConfig) };
            localStorage.setItem(LOCAL_TEMPLATE_CONFIG_KEY, JSON.stringify(cfg));
          }
        } catch (_) {}

        if (mounted) {
          setTemplateConfig(cfg);
        }

        // Resolve template binary bytes if stored in IndexedDB or Cloud Firestore Blobs
        let foundBlob: Blob | null = null;
        try {
          foundBlob = await localFileStore.getFile(LOCAL_TEMPLATE_BLOB_KEY);
        } catch (_) {}

        if (!foundBlob && cfg.templateBlobUrl) {
          if (cfg.templateBlobUrl.startsWith('firestore-blob://')) {
            const blobId = cfg.templateBlobUrl.replace('firestore-blob://', '');
            foundBlob = await getBlobFromCloudFirestore(blobId);
          } else if (cfg.templateBlobUrl.startsWith('localdb://')) {
            foundBlob = await localFileStore.getFile(cfg.templateBlobUrl);
          }
        }

        if (foundBlob && mounted) {
          const buf = await foundBlob.arrayBuffer();
          setCustomTemplateBytes(new Uint8Array(buf));
          setCustomTemplateMimeType(foundBlob.type || 'application/pdf');
        }
      } finally {
        if (mounted) setLoadingEnrollment(false);
      }
    };
    loadData();
    return () => {
      mounted = false;
    };
  }, [user, userProfile]);

  // Persist enrollment helper
  const persistEnrollment = async (updated: ToxCourseEnrollment) => {
    setEnrollment(updated);
    localStorage.setItem(LOCAL_ENROLLMENT_KEY, JSON.stringify(updated));

    if (!user) return;
    setSavingProgress(true);
    try {
      const userRef = doc(db, 'users', user.uid);
      const completedModuleIds = Object.entries(updated.modules)
        .filter(([id, m]) => {
          const modDef = FORENSIC_TOXICOLOGY_MODULES.find((item) => item.id === id);
          const requiresAssign = modDef ? moduleHasAssignment(modDef.moduleNumber) : false;
          return m.readingCompleted && m.quizPassed && (requiresAssign ? m.assignmentPassed : true);
        })
        .map(([id]) => id);

      await setDoc(userRef, {
        progress: {
          forensic_toxicology_enrollment: updated,
          [FORENSIC_TOXICOLOGY_COURSE_ID]: completedModuleIds
        },
        updatedAt: serverTimestamp()
      }, { merge: true });
    } catch (err) {
      console.warn('Could not sync toxicology progress to Firestore:', err);
    } finally {
      setSavingProgress(false);
    }
  };

  // Enroll handler
  const handleEnrollSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = regNameInput.trim() || userProfile?.displayName || user?.displayName || 'Investigator';

    const newEnrollment = createInitialToxEnrollment(
      trimmedName,
      user?.email || '',
      regInstInput.trim() || (userProfile as any)?.universityName || ''
    );
    setEnrollment(newEnrollment);
    localStorage.setItem(LOCAL_ENROLLMENT_KEY, JSON.stringify(newEnrollment));
    await persistEnrollment(newEnrollment);
  };

  const eligibility = useMemo(() => verifyAllModulesEligibility(enrollment), [enrollment]);

  // Reset quiz feedback view when switching modules
  useEffect(() => {
    if (!moduleHasAssignment(activeModule.moduleNumber) && activeSubView === 'assignment') {
      setActiveSubView('study');
    }
    if (!enrollment) {
      setQuizFeedbackState(null);
      return;
    }
    const modProg = enrollment.modules?.[activeModule.id];
    if (modProg && modProg.quizScore !== null && Object.keys(modProg.quizAnswers || {}).length > 0) {
      setQuizFeedbackState(runModuleQuizAutoCheck(activeModule, modProg.quizAnswers));
    } else {
      setQuizFeedbackState(null);
    }
  }, [activeModuleIdx, activeModule, enrollment, activeSubView]);

  // Live PDF preview generator when on certificate tab — strictly only when all 6 modules are verified
  useEffect(() => {
    let active = true;
    let currentUrl = '';

    if (activeSubView === 'certificate' && enrollment && eligibility.isEligible) {
      const certId =
        enrollment.certificateNo ||
        `FC-${FORENSIC_TOXICOLOGY_COURSE_CODE}-${new Date().getFullYear()}-${(user?.uid || '8492').substring(0, 5).toUpperCase()}`;

      generateForensicToxicologyCertificatePdf({
        learnerName: regNameInput.trim() || enrollment.registeredName || 'Candidate Full Name',
        issueDate: certIssueDateInput,
        certificateNo: certId,
        config: templateConfig,
        customTemplateBytes,
        customTemplateMimeType
      })
        .then((pdfBytes) => {
          if (!active) return;
          const blob = new Blob([pdfBytes], { type: 'application/pdf' });
          currentUrl = URL.createObjectURL(blob);
          setPreviewPdfUrl(currentUrl);
        })
        .catch((err) => {
          console.warn('Preview PDF generation error:', err);
        });
    } else {
      setPreviewPdfUrl('');
    }

    return () => {
      active = false;
      if (currentUrl) URL.revokeObjectURL(currentUrl);
    };
  }, [
    activeSubView,
    enrollment,
    eligibility.isEligible,
    regNameInput,
    certIssueDateInput,
    templateConfig,
    customTemplateBytes,
    customTemplateMimeType,
    user?.uid
  ]);

  // Section toggle
  const handleToggleSectionRead = async (sectionId: string) => {
    if (!enrollment) return;
    const modProg = enrollment.modules[activeModule.id] || {
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

    const exists = modProg.completedSectionIds.includes(sectionId);
    const updatedSections = exists
      ? modProg.completedSectionIds.filter((s) => s !== sectionId)
      : [...modProg.completedSectionIds, sectionId];

    const allSectionsDone = activeModule.sections.every((s) => updatedSections.includes(s.id));

    const updatedEnrollment: ToxCourseEnrollment = {
      ...enrollment,
      modules: {
        ...enrollment.modules,
        [activeModule.id]: {
          ...modProg,
          completedSectionIds: updatedSections,
          readingCompleted: allSectionsDone
        }
      }
    };
    await persistEnrollment(updatedEnrollment);
  };

  const handleMarkAllSectionsComplete = async () => {
    if (!enrollment) return;
    const modProg = enrollment.modules[activeModule.id];
    const allIds = activeModule.sections.map((s) => s.id);
    const updatedEnrollment: ToxCourseEnrollment = {
      ...enrollment,
      modules: {
        ...enrollment.modules,
        [activeModule.id]: {
          ...modProg,
          completedSectionIds: allIds,
          readingCompleted: true
        }
      }
    };
    await persistEnrollment(updatedEnrollment);
    setActiveSubView('quiz');
  };

  // Quiz option selection
  const handleSelectQuizAnswer = (questionId: string, optionIdx: number) => {
    if (!enrollment) return;
    const modProg = enrollment.modules[activeModule.id];
    const updatedEnrollment: ToxCourseEnrollment = {
      ...enrollment,
      modules: {
        ...enrollment.modules,
        [activeModule.id]: {
          ...modProg,
          quizAnswers: {
            ...(modProg.quizAnswers || {}),
            [questionId]: optionIdx
          }
        }
      }
    };
    setEnrollment(updatedEnrollment);
  };

  // Submit Quiz to AutoCheck (requires module content readingCompleted first)
  const handleSubmitQuizAutoCheck = async () => {
    if (!enrollment) return;
    const modProg = enrollment.modules[activeModule.id];
    const allSectionsDone = activeModule.sections.every((s) =>
      (modProg.completedSectionIds || []).includes(s.id)
    );
    if (!modProg.readingCompleted || !allSectionsDone) return;

    const result = runModuleQuizAutoCheck(activeModule, modProg.quizAnswers || {});
    setQuizFeedbackState(result);

    const updatedEnrollment: ToxCourseEnrollment = {
      ...enrollment,
      modules: {
        ...enrollment.modules,
        [activeModule.id]: {
          ...modProg,
          quizScore: result.scorePercent,
          quizPassed: result.passed,
          quizAttempts: (modProg.quizAttempts || 0) + 1
        }
      }
    };
    await persistEnrollment(updatedEnrollment);
  };

  // Retry Quiz when score is below 90%
  const handleRetryQuiz = async () => {
    if (!enrollment) return;
    const modProg = enrollment.modules[activeModule.id];
    setQuizFeedbackState(null);

    const updatedEnrollment: ToxCourseEnrollment = {
      ...enrollment,
      modules: {
        ...enrollment.modules,
        [activeModule.id]: {
          ...modProg,
          quizScore: null,
          quizPassed: false,
          quizAnswers: {}
        }
      }
    };
    await persistEnrollment(updatedEnrollment);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Update Assignment Inputs
  const handleAssignmentFieldChange = (fieldId: string, value: string) => {
    if (!enrollment) return;
    const modProg = enrollment.modules[activeModule.id];
    setEnrollment({
      ...enrollment,
      modules: {
        ...enrollment.modules,
        [activeModule.id]: {
          ...modProg,
          assignmentFieldValues: {
            ...(modProg.assignmentFieldValues || {}),
            [fieldId]: value
          }
        }
      }
    });
  };

  const handleAssignmentWrittenChange = (value: string) => {
    if (!enrollment) return;
    const modProg = enrollment.modules[activeModule.id];
    setEnrollment({
      ...enrollment,
      modules: {
        ...enrollment.modules,
        [activeModule.id]: {
          ...modProg,
          assignmentWrittenResponse: value
        }
      }
    });
  };

  // Submit Assignment to AutoCheck
  const handleSubmitAssignmentAutoCheck = async () => {
    if (!enrollment) return;
    const modProg = enrollment.modules[activeModule.id];
    const result = runModuleAssignmentAutoCheck(
      activeModule,
      modProg.assignmentFieldValues || {},
      modProg.assignmentWrittenResponse || ''
    );

    const updatedEnrollment: ToxCourseEnrollment = {
      ...enrollment,
      modules: {
        ...enrollment.modules,
        [activeModule.id]: {
          ...modProg,
          assignmentPassed: result.passed,
          assignmentCriteriaResults: result.criteriaResults,
          assignmentSubmittedAt: new Date().toISOString()
        }
      }
    };
    await persistEnrollment(updatedEnrollment);
  };

  // Upload Custom PDF/Image Certificate Template
  const handleTemplateFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingTemplate(true);
    setTemplateStatusMsg(`Loading template "${file.name}"...`);

    try {
      const arrayBuf = await file.arrayBuffer();
      const bytes = new Uint8Array(arrayBuf);
      setCustomTemplateBytes(bytes);
      setCustomTemplateMimeType(file.type || 'application/pdf');

      // 1. Save in local IndexedDB for immediate offline/client persistence
      await localFileStore.saveFile(LOCAL_TEMPLATE_BLOB_KEY, file);

      // 2. Upload to Firestore _cloud_blobs if user is signed in
      let cloudBlobUrl = `localdb://${LOCAL_TEMPLATE_BLOB_KEY}`;
      if (user) {
        try {
          cloudBlobUrl = await uploadBlobToCloudFirestore(
            file,
            'certificates/templates',
            (msg) => setTemplateStatusMsg(msg)
          );
        } catch (cloudErr) {
          console.warn('Cloud blob sync fallback to local IndexedDB:', cloudErr);
        }
      }

      const updatedConfig: CertTemplateConfig = {
        ...templateConfig,
        templateBlobUrl: cloudBlobUrl,
        templateFileName: file.name,
        updatedAt: new Date().toISOString()
      };

      setTemplateConfig(updatedConfig);
      localStorage.setItem(LOCAL_TEMPLATE_CONFIG_KEY, JSON.stringify(updatedConfig));

      if (isAdmin) {
        try {
          await setDoc(doc(db, 'system_settings', 'forensic_toxicology_cert_template'), updatedConfig, { merge: true });
        } catch (_) {}
      }

      setTemplateStatusMsg(`Template "${file.name}" saved! Every learner certificate will now stamp Name & Date on this template.`);
    } catch (err: any) {
      console.error('Template upload error:', err);
      setTemplateStatusMsg(`Failed to load template: ${err?.message || 'Unknown error'}`);
    } finally {
      setUploadingTemplate(false);
    }
  };

  const handleSaveTemplateConfig = async (newCfg: CertTemplateConfig) => {
    setTemplateConfig(newCfg);
    localStorage.setItem(LOCAL_TEMPLATE_CONFIG_KEY, JSON.stringify(newCfg));
    if (isAdmin) {
      try {
        await setDoc(doc(db, 'system_settings', 'forensic_toxicology_cert_template'), newCfg, { merge: true });
      } catch (_) {}
    }
  };

  // Generate & Download Official Certificate PDF + Register in Firestore `certificates`
  const handleGenerateAndDownloadCertificate = async () => {
    if (!enrollment) return;
    if (!eligibility.isEligible) return;

    const finalName = regNameInput.trim();
    if (!finalName) {
      setCertNameError('Please enter your full name to be stamped onto the official Certificate PDF.');
      setShowCertNamePromptModal(true);
      return;
    }

    setCertNameError('');
    setGeneratingCert(true);
    setCertSuccessBanner('');

    try {
      const certId =
        enrollment.certificateNo ||
        `FC-${FORENSIC_TOXICOLOGY_COURSE_CODE}-${new Date().getFullYear()}-${(user?.uid || Math.random().toString(36).substring(2, 7)).substring(0, 5).toUpperCase()}`;

      const pdfBytes = await generateForensicToxicologyCertificatePdf({
        learnerName: finalName,
        issueDate: certIssueDateInput,
        certificateNo: certId,
        config: templateConfig,
        customTemplateBytes,
        customTemplateMimeType
      });

      // Trigger browser PDF download
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const downloadUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `ForenClue_${FORENSIC_TOXICOLOGY_COURSE_CODE}_Certificate_${finalName.replace(/\s+/g, '_')}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(downloadUrl), 5000);

      // Register official credential in Firestore `certificates` collection for `/certificate?id=...` verification
      if (user) {
        try {
          const safeDocId = certId.toUpperCase().trim().replace(/\//g, '_');
          await setDoc(
            doc(db, 'certificates', safeDocId),
            {
              certificateNo: certId,
              fullName: finalName,
              courseTitle: `Certificate Course in Forensic Toxicology (${FORENSIC_TOXICOLOGY_COURSE_CODE})`,
              certificateType: 'Forensic Toxicology Specialization Certificate',
              issueDate: certIssueDateInput,
              additionalDetails:
                `Verified by ForenClue AutoCheck System: Completed all 6 Self-Paced Forensic Toxicology Modules (Course Code: ${FORENSIC_TOXICOLOGY_COURSE_CODE}) with ≥ 90% Quiz Mastery and 100% Case Assignment Criteria Verification.`,
              createdAt: new Date().toISOString()
            },
            { merge: true }
          );
        } catch (certDbErr) {
          console.warn('Could not register certificate in public verification table:', certDbErr);
        }
      }

      const updatedEnrollment: ToxCourseEnrollment = {
        ...enrollment,
        registeredName: finalName,
        certificateIssued: true,
        certificateNo: certId,
        certificateIssuedAt: certIssueDateInput
      };
      await persistEnrollment(updatedEnrollment);

      setShowCertNamePromptModal(false);
      setCertSuccessBanner(
        `Official Certificate PDF generated for ${finalName} (Credential ID: ${certId})!`
      );
    } catch (err: any) {
      console.error('Certificate PDF generation failed:', err);
    } finally {
      setGeneratingCert(false);
    }
  };

  if (loadingEnrollment) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center gap-3 bg-base">
        <RefreshCw size={32} className="animate-spin text-warning" />
        <p className="text-xs font-mono uppercase tracking-widest text-text-muted">
          Initializing Forensic Toxicology Self-Paced Curriculum & AutoCheck Engine...
        </p>
      </div>
    );
  }

  // ENROLLMENT REGISTRATION GATE IF NOT YET ENROLLED
  if (!enrollment || !enrollment.enrolled) {
    return (
      <div className="min-h-screen bg-base py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <Link
            to="/courses"
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-text-muted hover:text-warning mb-6"
          >
            <ChevronLeft size={16} /> Back to Courses Directory
          </Link>

          <div className="bg-surface border border-black/10 dark:border-white/10 rounded-2xl p-6 sm:p-10 shadow-2xl space-y-8">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono font-black uppercase tracking-widest">
                ● SELF-PACED CERTIFICATION COURSE
              </span>
              <span className="px-3 py-1 rounded-md bg-warning/10 border border-warning/20 text-warning text-[10px] font-mono font-black uppercase tracking-widest">
                NO VIDEO LECTURES • 100% RESEARCH & CASEWORK
              </span>
              <span className="px-3 py-1 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-mono font-black uppercase tracking-widest">
                AUTOCHECK VERIFIED (QUIZ ≥ 90% + ASSIGNMENTS)
              </span>
            </div>

            <div>
              <h1 className="text-2xl sm:text-4xl font-heading font-black uppercase tracking-tight text-text-main">
                Certificate Course in <span className="text-warning">Forensic Toxicology</span>
              </h1>
              <p className="text-sm text-text-muted mt-3 leading-relaxed">
                Complete 6 comprehensive self-paced modules progressing from foundational dose-response toxicology and autopsy viscera preservation to advanced toxicokinetics, postmortem redistribution (PMR), heavy metals, agrochemicals, NDPS Act drug chemistry, GC-MS/LC-MS/MS instrumentation, and Section 329 BNSS courtroom reporting.
              </p>
            </div>

            {/* Lead Instructor Card: Mr. Rajat Pithadia */}
            <div className="p-4 sm:p-5 rounded-xl bg-base border border-warning/25 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <img
                src="https://blogger.googleusercontent.com/img/a/AVvXsEiseuO8LFJ74UtogyoZLu5orh44gH7WVqDM4oinlMLhD3u4grQKoinTCZYk-OfKJrXJjV8E9EZHoPbhefI60LoXmqO623wQXiv-4hXumhYmBrBJCh4HYvYk9ifZ4nSccrYe5qyJHQXAQvW_8Zgkdq3T7vCycYqiJy0aUSZYzhmqc8M12jhhUq3X1GoORws"
                alt="Mr. Rajat Pithadia"
                className="w-16 h-16 rounded-full object-cover object-top border-2 border-warning/40 shrink-0"
                referrerPolicy="no-referrer"
              />
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-mono font-black uppercase tracking-widest text-warning bg-warning/10 px-2 py-0.5 rounded border border-warning/20">
                    COURSE INSTRUCTOR & ACADEMIC MENTOR
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold">
                    UGC-NET & GSET Qualified • Wiley Author
                  </span>
                </div>
                <h3 className="text-base font-heading font-black text-text-main uppercase tracking-tight">
                  Mr. Rajat Pithadia
                </h3>
                <p className="text-xs text-text-muted leading-relaxed">
                  M.Sc. (Forensic Chemistry, Toxicology & Pharmacology) • Ph.D. Scholar (Genotoxicity & Mutagenicity) • Assistant Professor, Parul University
                </p>
              </div>
            </div>

            {/* 6 Modules Overview Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {FORENSIC_TOXICOLOGY_MODULES.map((m) => (
                <div
                  key={m.id}
                  className="p-4 rounded-xl bg-base border border-black/10 dark:border-white/5 flex items-start gap-3"
                >
                  <div className="w-8 h-8 rounded-lg bg-warning/10 border border-warning/20 text-warning font-mono font-black text-xs flex items-center justify-center shrink-0">
                    0{m.moduleNumber}
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-warning font-bold">
                      {m.code} • {m.level}
                    </span>
                    <h3 className="text-xs font-bold text-text-main mt-0.5 leading-snug">{m.title}</h3>
                  </div>
                </div>
              ))}
            </div>

            {/* Enrollment Form */}
            <form
              onSubmit={handleEnrollSubmit}
              className="bg-base border border-warning/30 rounded-xl p-6 space-y-5"
            >
              <div className="flex items-center gap-2 border-b border-black/10 dark:border-white/10 pb-3">
                <UserCheck size={18} className="text-warning" />
                <h2 className="text-sm font-heading font-black uppercase tracking-wider text-text-main">
                  Candidate Enrollment & Certificate Name Registration
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-text-main block mb-1.5">
                    Registered Full Name (Exact Name for Certificate PDF) *
                  </label>
                  <input
                    type="text"
                    required
                    value={regNameInput}
                    onChange={(e) => setRegNameInput(e.target.value)}
                    placeholder="e.g., Dr. Aarav Deshmukh / Vaibhav Bade"
                    className="w-full bg-surface border border-black/10 dark:border-white/10 rounded-lg px-4 py-3 text-sm font-bold text-text-main outline-none focus:border-warning"
                  />
                  <p className="text-[11px] text-text-muted mt-1">
                    This exact name will be stamped onto your official Certificate PDF upon passing all 6 modules.
                  </p>
                </div>

                <div>
                  <label className="text-xs font-bold text-text-main block mb-1.5">
                    University / Institution / Forensic Laboratory (Optional)
                  </label>
                  <input
                    type="text"
                    value={regInstInput}
                    onChange={(e) => setRegInstInput(e.target.value)}
                    placeholder="e.g., National Forensic Sciences University"
                    className="w-full bg-surface border border-black/10 dark:border-white/10 rounded-lg px-4 py-3 text-sm text-text-main outline-none focus:border-warning"
                  />
                </div>
              </div>

              <div className="p-3.5 rounded-lg bg-warning/5 border border-warning/20 text-xs text-text-muted space-y-1">
                <p className="font-bold text-text-main flex items-center gap-1.5">
                  <ShieldCheck size={15} className="text-warning" /> AutoCheck Certification Criteria:
                </p>
                <p>
                  1. Complete the self-paced research dossier for all <strong>6 Modules</strong> (No video lectures; 100% self-paced scientific study).
                </p>
                <p>
                  2. Achieve a score of <strong>≥ 90%</strong> on every module&apos;s 10-question forensic assessment quiz.
                </p>
                <p>
                  3. Pass all quantitative &amp; written case rubric criteria in every module&apos;s <strong>Forensic Assignment</strong>.
                </p>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-warning text-crust font-heading font-black uppercase tracking-widest text-xs rounded-xl hover:bg-warning/90 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-warning/10"
              >
                <Unlock size={16} /> Enroll in Forensic Toxicology Certificate Course & Start Module 1
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  const currentModProg: ToxModuleProgress = enrollment.modules?.[activeModule.id] || {
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

  const currentModStatus = eligibility.moduleStatuses.find((s) => s.moduleId === activeModule.id);

  return (
    <div className="min-h-screen bg-base flex flex-col">
      {/* Minimalistic Course Header */}
      <header className="bg-surface border-b border-black/10 dark:border-white/10 px-4 sm:px-6 py-3.5 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              to="/courses"
              className="p-2 rounded-lg bg-base border border-black/10 dark:border-white/10 text-text-muted hover:text-warning transition-colors"
              title="Back to Courses"
            >
              <ChevronLeft size={18} />
            </Link>
            <div>
              <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-text-muted">
                <span className="text-warning font-black">COURSE CODE: {FORENSIC_TOXICOLOGY_COURSE_CODE}</span>
                <span aria-hidden="true">·</span>
                <span>MR. RAJAT PITHADIA</span>
                {savingProgress && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className="inline-flex items-center gap-1">
                      <RefreshCw size={10} className="animate-spin" /> Syncing
                    </span>
                  </>
                )}
              </div>
              <h1 className="text-sm sm:text-base font-heading font-black uppercase tracking-tight text-text-main">
                Certificate Course in Forensic Toxicology
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {activeSubView !== 'modules-hub' && (
              <button
                onClick={() => {
                  setActiveSubView('modules-hub');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-3.5 py-2 rounded-lg bg-base border border-black/10 dark:border-white/10 hover:border-warning/50 text-text-main text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <ChevronLeft size={14} />
                <span>All 6 Modules</span>
              </button>
            )}

            <span className="text-xs font-mono text-text-muted px-2.5 py-1.5 rounded-lg bg-base border border-black/10 dark:border-white/10">
              <strong className="text-text-main">{eligibility.completedModulesCount}/6</strong> Modules Completed
            </span>

            <button
              onClick={() => {
                setActiveSubView('certificate');
                if (eligibility.isEligible) {
                  setShowCertNamePromptModal(true);
                }
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                eligibility.isEligible
                  ? 'bg-emerald-500 text-crust hover:bg-emerald-400 font-black'
                  : 'bg-base border border-black/10 dark:border-white/10 text-text-muted hover:border-warning/40'
              }`}
              title={
                eligibility.isEligible
                  ? 'All 6 Modules Verified — Generate Official Certificate'
                  : `Certificate Locked: Complete all 6 modules (${eligibility.completedModulesCount}/6 completed)`
              }
            >
              {eligibility.isEligible ? (
                <Award size={15} className="text-crust" />
              ) : (
                <Lock size={14} className="text-amber-400" />
              )}
              <span>
                {eligibility.isEligible
                  ? 'Generate Certificate'
                  : `Certificate Locked (${eligibility.completedModulesCount}/6)`}
              </span>
            </button>
          </div>
        </div>
      </header>

      {activeSubView === 'modules-hub' ? (
        /* CLEAN, MINIMALISTIC & USER-FRIENDLY 6-MODULE HUB */
        <div className="max-w-6xl w-full mx-auto flex-1 px-4 sm:px-6 py-10 sm:py-14 space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-warning font-bold block">
              Course Code: {FORENSIC_TOXICOLOGY_COURSE_CODE}
            </span>
            <h2 className="text-2xl sm:text-3xl font-heading font-black uppercase tracking-tight text-text-main">
              Select a Course Module to Begin Study
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FORENSIC_TOXICOLOGY_MODULES.map((mod, idx) => {
              const st = eligibility.moduleStatuses[idx];

              return (
                <motion.button
                  type="button"
                  key={mod.id}
                  whileHover={{ y: -3 }}
                  onClick={() => {
                    setActiveModuleIdx(idx);
                    setActiveSubView('study');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`text-left bg-surface border rounded-xl p-6 flex flex-col justify-between transition-all duration-200 cursor-pointer group ${
                    st?.moduleComplete
                      ? 'border-emerald-500/40 hover:border-emerald-500'
                      : 'border-black/10 dark:border-white/10 hover:border-warning/60'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-warning font-black uppercase tracking-wider">
                        Module 0{mod.moduleNumber}
                      </span>
                      {st?.moduleComplete ? (
                        <span className="text-emerald-400 font-bold flex items-center gap-1">
                          <CheckCircle2 size={13} /> Completed
                        </span>
                      ) : (
                        <span className="text-text-muted">{FORENSIC_TOXICOLOGY_COURSE_CODE}</span>
                      )}
                    </div>

                    <h3 className="text-base sm:text-lg font-heading font-bold text-text-main group-hover:text-warning transition-colors leading-snug">
                      {mod.title.replace(/^Module \d+:\s*/, '')}
                    </h3>

                    <p className="text-xs text-text-muted line-clamp-2 leading-relaxed">
                      {mod.subtitle}
                    </p>

                    {MODULE_VISUAL_GUIDES[mod.moduleNumber]?.clipartImageSrc && (
                      <div className="mt-2 rounded-lg border border-slate-200 bg-white p-1.5 overflow-hidden">
                        <img
                          src={MODULE_VISUAL_GUIDES[mod.moduleNumber].clipartImageSrc}
                          alt={`${mod.code} Mindmap & Cheatsheet`}
                          referrerPolicy="no-referrer"
                          className="w-full h-28 object-contain bg-white rounded"
                        />
                      </div>
                    )}
                  </div>

                  <div className="pt-5 mt-5 border-t border-black/5 dark:border-white/5 flex items-center justify-between text-xs font-bold">
                    <span className="text-text-muted font-mono font-normal">
                      {mod.estimatedHours}
                    </span>
                    <span className="text-warning flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                      <span>Open Module</span>
                      <ChevronRight size={14} />
                    </span>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      ) : (
        /* Full-Width Workspace Showing Only Selected Module Content (or Certificate Studio) */
        <div className="max-w-5xl w-full mx-auto flex-1 p-4 sm:p-6">
          <section className="space-y-6">
            {activeSubView === 'certificate' ? (
            /* MASTER AUTOCHECK VERIFICATION & PDF CERTIFICATE GENERATOR STUDIO */
            <div className="bg-surface border border-black/10 dark:border-white/10 rounded-2xl p-6 sm:p-8 space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-black/10 dark:border-white/10 pb-6">
                <div>
                  <h2 className="text-2xl font-heading font-black uppercase tracking-tight text-text-main">
                    Course Verification & Certificate PDF Generator
                  </h2>
                </div>
                {isAdmin && (
                  <button
                    onClick={() => setShowTemplateConfigurator(!showTemplateConfigurator)}
                    className="px-4 py-2 rounded-xl bg-base border border-black/10 dark:border-white/10 hover:border-warning text-xs font-bold text-text-main flex items-center gap-2 cursor-pointer self-start"
                  >
                    <Upload size={14} className="text-warning" />
                    <span>{showTemplateConfigurator ? 'Hide PDF Template Settings' : 'Upload / Configure PDF Template'}</span>
                  </button>
                )}
              </div>

              {/* Custom PDF Template Uploader & Placement Configurator */}
              <AnimatePresence>
                {showTemplateConfigurator && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-base border border-warning/30 rounded-xl p-5 space-y-5 overflow-hidden"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-black/10 dark:border-white/10 pb-3">
                      <div>
                        <h3 className="text-sm font-heading font-black uppercase tracking-wider text-warning flex items-center gap-2">
                          <FileText size={16} /> Custom PDF Certificate Template Manager
                        </h3>
                        <p className="text-xs text-text-muted mt-0.5">
                          Upload your official PDF (or PNG/JPG) certificate template once. Every time a learner completes the course, our system will stamp only their <strong>Registered Name</strong> and <strong>Completion Date</strong> onto your template.
                        </p>
                      </div>
                      <label className="px-4 py-2.5 bg-warning text-crust font-black text-xs uppercase tracking-wider rounded-lg hover:bg-warning/90 transition-all cursor-pointer inline-flex items-center gap-2 shrink-0">
                        <Upload size={14} />
                        <span>{uploadingTemplate ? 'Saving Template...' : 'Upload PDF Template'}</span>
                        <input
                          type="file"
                          accept=".pdf,application/pdf,image/png,image/jpeg"
                          onChange={handleTemplateFileUpload}
                          className="hidden"
                        />
                      </label>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs bg-surface p-3 rounded-lg border border-black/5 dark:border-white/5">
                      <div>
                        <span className="text-text-muted font-mono">Active Template: </span>
                        <strong className="text-text-main font-mono">
                          {customTemplateBytes
                            ? `${templateConfig.templateFileName || 'Custom Uploaded PDF Template'} (Loaded)`
                            : 'Built-in ForenClue Official Forensic Toxicology PDF Template'}
                        </strong>
                      </div>
                      {customTemplateBytes && (
                        <button
                          onClick={async () => {
                            setCustomTemplateBytes(null);
                            await localFileStore.deleteFile(LOCAL_TEMPLATE_BLOB_KEY);
                            const resetCfg = {
                              ...DEFAULT_CERT_TEMPLATE_CONFIG,
                              templateBlobUrl: '',
                              templateFileName: 'Default ForenClue Official Forensic Toxicology Template'
                            };
                            await handleSaveTemplateConfig(resetCfg);
                            setTemplateStatusMsg('Reverted to built-in official template.');
                          }}
                          className="text-[11px] font-mono text-red-400 hover:underline cursor-pointer"
                        >
                          Reset to Default Template
                        </button>
                      )}
                    </div>

                    {templateStatusMsg && (
                      <p className="text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 rounded-lg">
                        {templateStatusMsg}
                      </p>
                    )}

                    {/* Coordinate Sliders for Name & Date on the PDF Template */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Learner Name Position */}
                      <div className="bg-surface p-4 rounded-xl border border-black/5 dark:border-white/5 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold uppercase tracking-wider text-warning">
                            1. Registered Name Stamp Position
                          </span>
                          <label className="text-[11px] flex items-center gap-1.5 text-text-muted cursor-pointer">
                            <input
                              type="checkbox"
                              checked={templateConfig.nameCentered}
                              onChange={(e) =>
                                handleSaveTemplateConfig({ ...templateConfig, nameCentered: e.target.checked })
                              }
                            />
                            Center Horizontally
                          </label>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-[10px] font-mono text-text-muted block">
                              Horizontal X: {templateConfig.nameXPercent}%
                            </label>
                            <input
                              type="range"
                              min="5"
                              max="95"
                              value={templateConfig.nameXPercent}
                              onChange={(e) =>
                                handleSaveTemplateConfig({
                                  ...templateConfig,
                                  nameXPercent: parseInt(e.target.value, 10)
                                })
                              }
                              className="w-full accent-warning"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-mono text-text-muted block">
                              Vertical Y (from bottom): {templateConfig.nameYPercent}%
                            </label>
                            <input
                              type="range"
                              min="5"
                              max="90"
                              value={templateConfig.nameYPercent}
                              onChange={(e) =>
                                handleSaveTemplateConfig({
                                  ...templateConfig,
                                  nameYPercent: parseInt(e.target.value, 10)
                                })
                              }
                              className="w-full accent-warning"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-mono text-text-muted block">
                              Font Size: {templateConfig.nameFontSize} pt
                            </label>
                            <input
                              type="range"
                              min="14"
                              max="48"
                              value={templateConfig.nameFontSize}
                              onChange={(e) =>
                                handleSaveTemplateConfig({
                                  ...templateConfig,
                                  nameFontSize: parseInt(e.target.value, 10)
                                })
                              }
                              className="w-full accent-warning"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-mono text-text-muted block">Text Color (Hex)</label>
                            <input
                              type="color"
                              value={templateConfig.nameColorHex}
                              onChange={(e) =>
                                handleSaveTemplateConfig({ ...templateConfig, nameColorHex: e.target.value })
                              }
                              className="h-7 w-16 bg-base border border-black/10 dark:border-white/10 rounded cursor-pointer"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Completion Date Position */}
                      <div className="bg-surface p-4 rounded-xl border border-black/5 dark:border-white/5 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold uppercase tracking-wider text-warning">
                            2. Completion Date Stamp Position
                          </span>
                          <label className="text-[11px] flex items-center gap-1.5 text-text-muted cursor-pointer">
                            <input
                              type="checkbox"
                              checked={templateConfig.showCertId}
                              onChange={(e) =>
                                handleSaveTemplateConfig({ ...templateConfig, showCertId: e.target.checked })
                              }
                            />
                            Also Stamp Cert ID
                          </label>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-[10px] font-mono text-text-muted block">
                              Horizontal X: {templateConfig.dateXPercent}%
                            </label>
                            <input
                              type="range"
                              min="5"
                              max="95"
                              value={templateConfig.dateXPercent}
                              onChange={(e) =>
                                handleSaveTemplateConfig({
                                  ...templateConfig,
                                  dateXPercent: parseInt(e.target.value, 10)
                                })
                              }
                              className="w-full accent-warning"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-mono text-text-muted block">
                              Vertical Y (from bottom): {templateConfig.dateYPercent}%
                            </label>
                            <input
                              type="range"
                              min="5"
                              max="90"
                              value={templateConfig.dateYPercent}
                              onChange={(e) =>
                                handleSaveTemplateConfig({
                                  ...templateConfig,
                                  dateYPercent: parseInt(e.target.value, 10)
                                })
                              }
                              className="w-full accent-warning"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-mono text-text-muted block">
                              Font Size: {templateConfig.dateFontSize} pt
                            </label>
                            <input
                              type="range"
                              min="8"
                              max="28"
                              value={templateConfig.dateFontSize}
                              onChange={(e) =>
                                handleSaveTemplateConfig({
                                  ...templateConfig,
                                  dateFontSize: parseInt(e.target.value, 10)
                                })
                              }
                              className="w-full accent-warning"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-mono text-text-muted block">Date Color (Hex)</label>
                            <input
                              type="color"
                              value={templateConfig.dateColorHex}
                              onChange={(e) =>
                                handleSaveTemplateConfig({ ...templateConfig, dateColorHex: e.target.value })
                              }
                              className="h-7 w-16 bg-base border border-black/10 dark:border-white/10 rounded cursor-pointer"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* 6-Module Eligibility Audit Matrix */}
              <div className="space-y-3">
                <h3 className="text-xs font-mono font-black uppercase tracking-widest text-text-muted">
                  6-Module Eligibility Audit Matrix
                </h3>

                <div className="overflow-x-auto border border-black/10 dark:border-white/10 rounded-xl">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-base border-b border-black/10 dark:border-white/10 text-[10px] font-mono uppercase text-text-muted">
                        <th className="py-3 px-4">Module</th>
                        <th className="py-3 px-4">Self-Paced Study</th>
                        <th className="py-3 px-4">Quiz Score (≥ 90%)</th>
                        <th className="py-3 px-4">Case Assignment (Modules 2, 4, 6)</th>
                        <th className="py-3 px-4">AutoCheck Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black/5 dark:divide-white/5">
                      {eligibility.moduleStatuses.map((st, idx) => (
                        <tr key={st.moduleId} className="hover:bg-base/40">
                          <td className="py-3 px-4 font-bold text-text-main">
                            <button
                              onClick={() => {
                                setActiveModuleIdx(idx);
                                setActiveSubView('study');
                              }}
                              className="hover:text-warning text-left cursor-pointer"
                            >
                              Module 0{st.moduleNumber}: {FORENSIC_TOXICOLOGY_MODULES[idx].code}
                            </button>
                          </td>
                          <td className="py-3 px-4 font-mono">
                            {st.readingDone ? (
                              <span className="text-emerald-400 font-bold">✓ Completed</span>
                            ) : (
                              <button
                                onClick={() => {
                                  setActiveModuleIdx(idx);
                                  setActiveSubView('study');
                                }}
                                className="text-amber-400 hover:underline cursor-pointer"
                              >
                                ○ Complete Study
                              </button>
                            )}
                          </td>
                          <td className="py-3 px-4 font-mono">
                            {st.quizPassed ? (
                              <span className="text-emerald-400 font-bold">✓ {st.quizScore}% (Passed)</span>
                            ) : (
                              <button
                                onClick={() => {
                                  setActiveModuleIdx(idx);
                                  setActiveSubView('quiz');
                                }}
                                className="text-amber-400 hover:underline cursor-pointer"
                              >
                                {st.quizScore !== null ? `✕ ${st.quizScore}% (Need ≥90%)` : '○ Take Quiz'}
                              </button>
                            )}
                          </td>
                          <td className="py-3 px-4 font-mono">
                            {!st.hasAssignment ? (
                              <span className="text-text-muted">— Not Required</span>
                            ) : st.assignmentPassed ? (
                              <span className="text-emerald-400 font-bold">✓ Criteria Verified</span>
                            ) : st.quizPassed ? (
                              <button
                                onClick={() => {
                                  setActiveModuleIdx(idx);
                                  setActiveSubView('assignment');
                                }}
                                className="text-amber-400 hover:underline cursor-pointer"
                              >
                                ○ Submit Assignment
                              </button>
                            ) : (
                              <span className="text-text-muted inline-flex items-center gap-1">
                                <Lock size={11} /> Locked (Pass Quiz ≥90%)
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            {st.moduleComplete ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono font-black">
                                <CheckCircle2 size={11} /> VERIFIED
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-mono font-bold">
                                INCOMPLETE
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Registered Candidate Name for Official Certificate PDF — Unlocked Strictly Only When All 6 Modules Are Eligible */}
              <div className="bg-base border border-black/10 dark:border-white/10 rounded-xl p-6 space-y-5">
                {eligibility.isEligible ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2.5 border-b border-black/10 dark:border-white/10 pb-3">
                      <UserCheck size={18} className="text-emerald-400 shrink-0" />
                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-black block">
                          Course Completed • Certificate Eligibility Unlocked ({FORENSIC_TOXICOLOGY_COURSE_CODE})
                        </span>
                        <h3 className="text-sm font-heading font-black uppercase text-text-main">
                          Registered Candidate Name for Official Certificate PDF
                        </h3>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-text-main block mb-1">
                          Enter Your Full Name for the Official Certificate PDF *
                        </label>
                        <input
                          type="text"
                          value={regNameInput}
                          onChange={(e) => {
                            setRegNameInput(e.target.value);
                            if (certNameError) setCertNameError('');
                          }}
                          placeholder="Enter your full name to stamp on Certificate PDF"
                          className="w-full bg-surface border border-black/10 dark:border-white/10 rounded-lg px-4 py-2.5 text-sm font-bold text-text-main outline-none focus:border-warning"
                        />
                        {certNameError && (
                          <p className="text-xs text-red-400 mt-1 font-medium">{certNameError}</p>
                        )}
                      </div>
                      <div>
                        <label className="text-xs font-bold text-text-main block mb-1">
                          Completion / Issuance Date (Stamped on Certificate PDF)
                        </label>
                        <input
                          type="text"
                          value={certIssueDateInput}
                          onChange={(e) => setCertIssueDateInput(e.target.value)}
                          className="w-full bg-surface border border-black/10 dark:border-white/10 rounded-lg px-4 py-2.5 text-sm font-bold text-text-main outline-none focus:border-warning"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-3 p-4 rounded-xl bg-surface border border-amber-500/25">
                    <Lock size={18} className="text-amber-400 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <h4 className="text-xs font-heading font-black uppercase tracking-wider text-text-main">
                        Official Certificate PDF Generation Locked ({eligibility.completedModulesCount} of {eligibility.totalModules} Modules Completed)
                      </h4>
                      <p className="text-xs text-text-muted leading-relaxed">
                        Your certificate cannot be generated until you complete <strong className="text-text-main">all 6 modules&apos; study content</strong>, pass <strong className="text-text-main">all 6 module quizzes with ≥ 90%</strong>, and pass <strong className="text-text-main">all required Case Assignments (Modules 2, 4, and 6)</strong>. Click any incomplete item in the table above to continue your coursework.
                      </p>
                    </div>
                  </div>
                )}

                {eligibility.isEligible && certSuccessBanner && (
                  <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 text-emerald-400 text-xs font-bold">
                      <CheckCircle2 size={18} className="shrink-0" />
                      <span>{certSuccessBanner}</span>
                    </div>
                    {enrollment.certificateNo && (
                      <Link
                        to={`/certificate?id=${encodeURIComponent(enrollment.certificateNo)}`}
                        className="text-xs font-mono font-black text-warning hover:underline flex items-center gap-1 shrink-0"
                      >
                        <span>Verify Credential Online</span>
                        <ExternalLink size={12} />
                      </Link>
                    )}
                  </div>
                )}

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                  <div className="text-xs text-text-muted">
                    {eligibility.isEligible ? (
                      <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                        <ShieldCheck size={16} /> AutoCheck System Verified: All 6 Modules, Quizzes & Assignments Completed!
                      </span>
                    ) : (
                      <span className="text-amber-400 flex items-center gap-1.5">
                        <Lock size={15} /> Complete all 6 modules ({eligibility.completedModulesCount}/6 verified) to unlock certificate.
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      if (!eligibility.isEligible) return;
                      if (!regNameInput.trim()) {
                        setShowCertNamePromptModal(true);
                      } else {
                        handleGenerateAndDownloadCertificate();
                      }
                    }}
                    disabled={!eligibility.isEligible || generatingCert}
                    className={`px-6 py-3.5 rounded-xl font-heading font-black text-xs uppercase tracking-widest flex items-center gap-2 transition-all ${
                      eligibility.isEligible
                        ? 'bg-warning text-crust hover:bg-warning/90 cursor-pointer shadow-lg shadow-warning/20'
                        : 'bg-black/10 dark:bg-white/5 text-text-muted cursor-not-allowed opacity-60'
                    }`}
                  >
                    {eligibility.isEligible ? <Download size={16} /> : <Lock size={15} />}
                    <span>
                      {generatingCert
                        ? 'Generating PDF...'
                        : eligibility.isEligible
                          ? 'Generate Certificate PDF'
                          : 'Locked Until All 6 Modules Completed'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Live Certificate PDF Preview — Only Rendered When Eligible */}
              {eligibility.isEligible && previewPdfUrl && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-text-muted">
                      Live Certificate PDF Preview (Name & Date Dynamically Stamped)
                    </span>
                    <a
                      href={previewPdfUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] font-mono text-warning hover:underline flex items-center gap-1"
                    >
                      <span>Open Preview in New Tab</span>
                      <ExternalLink size={12} />
                    </a>
                  </div>
                  <div className="w-full h-[460px] rounded-xl overflow-hidden border border-black/10 dark:border-white/10 bg-black/20">
                    <iframe
                      src={`${previewPdfUrl}#toolbar=0&navpanes=0`}
                      title="Certificate PDF Preview"
                      className="w-full h-full border-0"
                    />
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* ACTIVE MODULE WORKSPACE (STUDY DOSSIER / QUIZ / ASSIGNMENT) */
            <div className="bg-surface border border-black/10 dark:border-white/10 rounded-2xl overflow-hidden shadow-xl">
              {/* Module Banner Header */}
              <div className="p-6 sm:p-8 bg-base/60 border-b border-black/10 dark:border-white/10 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-1 rounded bg-warning/15 border border-warning/30 text-warning text-[10px] font-mono font-black uppercase tracking-widest">
                      MODULE 0{activeModule.moduleNumber} OF 06 • {activeModule.code}
                    </span>
                    <span className="px-2.5 py-1 rounded bg-black/5 dark:bg-white/5 text-text-muted text-[10px] font-mono font-bold uppercase">
                      {activeModule.level} • {activeModule.estimatedHours}
                    </span>
                  </div>

                  {currentModStatus?.moduleComplete && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-black">
                      <CheckCircle2 size={14} /> MODULE AUTOCHECK VERIFIED
                    </span>
                  )}
                </div>

                <div>
                  <h2 className="text-xl sm:text-2xl font-heading font-black text-text-main leading-tight">
                    {activeModule.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-text-muted mt-1.5 leading-relaxed">
                    {activeModule.subtitle}
                  </p>
                </div>

                {/* Module Segmented Navigation Bar (2 Steps for Odd Modules 1,3,5 • 3 Steps for Even Modules 2,4,6) */}
                <div
                  className={`grid grid-cols-1 ${
                    moduleHasAssignment(activeModule.moduleNumber) ? 'sm:grid-cols-3' : 'sm:grid-cols-2'
                  } gap-2 pt-2`}
                >
                  <button
                    onClick={() => setActiveSubView('study')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                      activeSubView === 'study'
                        ? 'bg-warning text-crust border-warning font-black'
                        : 'bg-surface border-black/10 dark:border-white/10 text-text-main hover:border-warning/40'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <BookOpen size={16} />
                      <div>
                        <span className="text-[10px] font-mono uppercase block opacity-80">Step 1</span>
                        <span className="text-xs font-bold">Research Dossier</span>
                      </div>
                    </div>
                    {currentModProg.readingCompleted && (
                      <CheckCircle2 size={16} className={activeSubView === 'study' ? 'text-crust' : 'text-emerald-400'} />
                    )}
                  </button>

                  <button
                    type="button"
                    disabled={!currentModStatus?.readingDone}
                    onClick={() => {
                      if (!currentModStatus?.readingDone) return;
                      setActiveSubView('quiz');
                    }}
                    title={
                      currentModStatus?.readingDone
                        ? 'Open Module Quiz'
                        : 'Locked: Complete all sections in Step 1 Research Dossier to unlock the Module Quiz'
                    }
                    className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                      !currentModStatus?.readingDone
                        ? 'bg-base/50 border-black/10 dark:border-white/5 text-text-muted opacity-60 cursor-not-allowed'
                        : activeSubView === 'quiz'
                          ? 'bg-warning text-crust border-warning font-black cursor-pointer'
                          : 'bg-surface border-black/10 dark:border-white/10 text-text-main hover:border-warning/40 cursor-pointer'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {currentModStatus?.readingDone ? <HelpCircle size={16} /> : <Lock size={16} />}
                      <div>
                        <span className="text-[10px] font-mono uppercase block opacity-80">
                          {currentModStatus?.readingDone ? 'Step 2 (Pass ≥ 90%)' : 'Step 2 (Locked • Complete Study)'}
                        </span>
                        <span className="text-xs font-bold">
                          Module Quiz {currentModProg.quizScore !== null ? `(${currentModProg.quizScore}%)` : '(10 Qs)'}
                        </span>
                      </div>
                    </div>
                    {currentModProg.quizPassed && (
                      <CheckCircle2 size={16} className={activeSubView === 'quiz' ? 'text-crust' : 'text-emerald-400'} />
                    )}
                  </button>

                  {moduleHasAssignment(activeModule.moduleNumber) && (
                    <button
                      type="button"
                      disabled={!currentModStatus?.readingDone || !currentModProg.quizPassed}
                      onClick={() => {
                        if (!currentModStatus?.readingDone || !currentModProg.quizPassed) return;
                        setActiveSubView('assignment');
                      }}
                      title={
                        currentModStatus?.readingDone && currentModProg.quizPassed
                          ? 'Open Case Assignment'
                          : 'Locked: Complete Module Study and score ≥ 90% on Module Quiz to unlock Case Assignment'
                      }
                      className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                        !currentModStatus?.readingDone || !currentModProg.quizPassed
                          ? 'bg-base/50 border-black/10 dark:border-white/5 text-text-muted opacity-60 cursor-not-allowed'
                          : activeSubView === 'assignment'
                            ? 'bg-warning text-crust border-warning font-black cursor-pointer'
                            : 'bg-surface border-black/10 dark:border-white/10 text-text-main hover:border-warning/40 cursor-pointer'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {currentModStatus?.readingDone && currentModProg.quizPassed ? (
                          <ClipboardCheck size={16} />
                        ) : (
                          <Lock size={16} />
                        )}
                        <div>
                          <span className="text-[10px] font-mono uppercase block opacity-80">
                            {currentModStatus?.readingDone && currentModProg.quizPassed
                              ? 'Step 3 (AutoCheck)'
                              : 'Step 3 (Locked • Need Study + Quiz ≥ 90%)'}
                          </span>
                          <span className="text-xs font-bold">Case Assignment</span>
                        </div>
                      </div>
                      {currentModProg.assignmentPassed && (
                        <CheckCircle2
                          size={16}
                          className={activeSubView === 'assignment' ? 'text-crust' : 'text-emerald-400'}
                        />
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* SUBVIEW 1: SELF-PACED RESEARCH DOSSIER */}
              {activeSubView === 'study' && (
                <div className="p-6 sm:p-8 space-y-8">
                  {/* Learning Objectives Box */}
                  <div className="bg-base border border-black/10 dark:border-white/10 rounded-xl p-5">
                    <h3 className="text-xs font-mono font-black uppercase tracking-widest text-warning mb-3">
                      Module Learning Objectives & Competency Targets
                    </h3>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-xs text-text-muted">
                      {activeModule.learningObjectives.map((obj, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-warning font-mono font-bold">0{i + 1}.</span>
                          <span className="leading-relaxed text-text-main/90">{obj}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Interactive Forensic Simulator for this Module */}
                  <InteractiveModuleSandbox toolType={activeModule.interactiveToolType} />

                  {/* White-Background Professional Clipart Mindmap, Illustrated Diagram & Exam Cheatsheet */}
                  <ModuleVisualMindmapAndCheatsheet moduleNumber={activeModule.moduleNumber} />

                  {/* Detailed Research Sections */}
                  <div className="space-y-8">
                    {activeModule.sections.map((sec, secIdx) => {
                      const isSecDone = currentModProg.completedSectionIds?.includes(sec.id);
                      return (
                        <div
                          key={sec.id}
                          className="border border-black/10 dark:border-white/10 rounded-2xl overflow-hidden bg-base/40"
                        >
                          <div className="p-5 bg-base border-b border-black/10 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div>
                              <span className="text-[10px] font-mono font-black uppercase tracking-widest text-warning">
                                {sec.badge}
                              </span>
                              <h3 className="text-lg font-heading font-black text-text-main mt-0.5">
                                {sec.heading}
                              </h3>
                              <p className="text-xs text-text-muted mt-0.5">{sec.summary}</p>
                            </div>
                            <button
                              onClick={() => handleToggleSectionRead(sec.id)}
                              className={`px-3.5 py-2 rounded-lg text-xs font-mono font-bold flex items-center gap-2 shrink-0 cursor-pointer transition-all ${
                                isSecDone
                                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                                  : 'bg-surface border border-black/10 dark:border-white/10 text-text-muted hover:text-text-main'
                              }`}
                            >
                              <Check size={14} />
                              <span>{isSecDone ? 'Section Studied' : 'Mark Section Studied'}</span>
                            </button>
                          </div>

                          <div className="p-5 sm:p-6 space-y-6">
                            {/* Section-Specific White-Background Professional Clipart Flow Diagram */}
                            <SectionClipartDiagram
                              moduleNumber={activeModule.moduleNumber}
                              sectionIndex={secIdx}
                            />
                            {sec.contentBlocks.map((blk, bIdx) => (
                              <div key={bIdx} className="space-y-3">
                                <h4 className="text-sm font-heading font-bold text-warning">
                                  {blk.subtitle}
                                </h4>
                                <p className="text-xs sm:text-sm text-text-main/90 leading-relaxed">
                                  {blk.body}
                                </p>

                                {blk.formula && (
                                  <div className="p-3.5 rounded-lg bg-surface border-l-4 border-warning font-mono text-xs sm:text-sm font-bold text-text-main">
                                    {blk.formula}
                                  </div>
                                )}

                                {blk.keyPoints && blk.keyPoints.length > 0 && (
                                  <ul className="space-y-2 pl-1">
                                    {blk.keyPoints.map((kp, kIdx) => (
                                      <li
                                        key={kIdx}
                                        className="text-xs sm:text-sm text-text-muted leading-relaxed flex items-start gap-2.5 bg-surface/60 p-3 rounded-lg border border-black/5 dark:border-white/5"
                                      >
                                        <span className="text-warning font-mono font-black mt-0.5">▸</span>
                                        <span className="text-text-main/90">{kp}</span>
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              </div>
                            ))}

                            {sec.referenceTable && (
                              <div className="space-y-2 pt-2">
                                <p className="text-xs font-mono font-bold text-warning">
                                  {sec.referenceTable.caption}
                                </p>
                                <div className="overflow-x-auto border border-black/10 dark:border-white/10 rounded-xl">
                                  <table className="w-full text-left border-collapse text-xs">
                                    <thead>
                                      <tr className="bg-surface border-b border-black/10 dark:border-white/10 text-[10px] font-mono uppercase text-text-muted">
                                        {sec.referenceTable.headers.map((h, hIdx) => (
                                          <th key={hIdx} className="py-2.5 px-3.5">
                                            {h}
                                          </th>
                                        ))}
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-black/5 dark:divide-white/5">
                                      {sec.referenceTable.rows.map((row, rIdx) => (
                                        <tr key={rIdx} className="hover:bg-surface/40">
                                          {row.map((cell, cIdx) => (
                                            <td
                                              key={cIdx}
                                              className={`py-2.5 px-3.5 ${
                                                cIdx === 0 ? 'font-bold text-text-main' : 'text-text-muted'
                                              }`}
                                            >
                                              {cell}
                                            </td>
                                          ))}
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Complete Module Research Footer Button */}
                  <div className="p-5 rounded-xl bg-base border border-black/10 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                      <p className="text-xs font-bold text-text-main">
                        {currentModProg.readingCompleted
                          ? '✓ Module Research Dossier Completed'
                          : 'Finished studying all sections and tables in this module?'}
                      </p>
                      <p className="text-[11px] text-text-muted">
                        Proceed to the 10-question AutoCheck Quiz (requires ≥ 90% score to verify).
                      </p>
                    </div>
                    <button
                      onClick={handleMarkAllSectionsComplete}
                      className="px-6 py-3 rounded-xl bg-warning text-crust font-heading font-black text-xs uppercase tracking-widest hover:bg-warning/90 transition-all flex items-center gap-2 cursor-pointer shrink-0"
                    >
                      <CheckCircle2 size={16} />
                      <span>Complete Research & Proceed to Module Quiz</span>
                    </button>
                  </div>
                </div>
              )}

              {/* SUBVIEW 2: MODULE QUIZ (LOCKED UNTIL STUDY COMPLETED • AUTOCHECK THRESHOLD >= 90%) */}
              {activeSubView === 'quiz' && !currentModStatus?.readingDone && (
                <div className="p-8 text-center space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto">
                    <Lock size={22} />
                  </div>
                  <h3 className="text-lg font-heading font-black uppercase text-text-main">
                    Module Quiz Locked — Complete Module Research Dossier First
                  </h3>
                  <p className="text-xs sm:text-sm text-text-muted max-w-md mx-auto leading-relaxed">
                    You must study and complete all sections of <strong>Module 0{activeModule.moduleNumber}</strong> before unlocking the 10-question competency quiz.
                  </p>
                  <button
                    type="button"
                    onClick={() => setActiveSubView('study')}
                    className="px-6 py-3 rounded-xl bg-warning text-crust font-heading font-black text-xs uppercase tracking-widest hover:bg-warning/90 transition-all inline-flex items-center gap-2 cursor-pointer"
                  >
                    <BookOpen size={15} />
                    <span>Return to Module Content</span>
                  </button>
                </div>
              )}

              {activeSubView === 'quiz' && currentModStatus?.readingDone && (
                <div className="p-6 sm:p-8 space-y-6">
                  <div className="p-4 rounded-xl bg-base border border-black/10 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-mono font-black uppercase tracking-widest text-warning">
                        AUTOCHECK MODULE ASSESSMENT • 10 QUESTIONS
                      </span>
                      <h3 className="text-lg font-heading font-black text-text-main">
                        {activeModule.code} Competency Quiz (Minimum Passing Score: 90%)
                      </h3>
                      <p className="text-xs text-text-muted">
                        You must answer at least 9 out of 10 questions correctly (≥ 90%) for AutoCheck to verify this module&apos;s quiz.
                      </p>
                    </div>

                    {quizFeedbackState && (
                      <div className="flex flex-wrap items-center gap-3 shrink-0">
                        <div
                          className={`px-4 py-2.5 rounded-xl border text-right ${
                            quizFeedbackState.passed
                              ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                              : 'bg-red-500/15 border-red-500/30 text-red-400'
                          }`}
                        >
                          <span className="text-[10px] font-mono uppercase block font-bold">
                            {quizFeedbackState.passed ? '✓ AUTOCHECK PASSED' : '✕ BELOW 90% THRESHOLD'}
                          </span>
                          <span className="text-xl font-mono font-black">
                            {quizFeedbackState.scorePercent}% ({quizFeedbackState.correctCount}/{quizFeedbackState.totalQuestions})
                          </span>
                        </div>

                        {!quizFeedbackState.passed && (
                          <button
                            type="button"
                            onClick={handleRetryQuiz}
                            className="px-4 py-3 rounded-xl bg-warning text-crust font-heading font-black text-xs uppercase tracking-wider hover:bg-warning/90 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                          >
                            <RefreshCw size={14} />
                            <span>Retry Quiz</span>
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Retry Notice Banner when Quiz Score < 90% */}
                  {quizFeedbackState && !quizFeedbackState.passed && (
                    <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-0.5">
                        <p className="text-xs font-bold text-red-400">
                          Minimum 90% Required (Your Score: {quizFeedbackState.scorePercent}%)
                        </p>
                        <p className="text-xs text-text-muted">
                          {moduleHasAssignment(activeModule.moduleNumber)
                            ? 'Review the feedback below and click Retry Quiz to retake the assessment. You can proceed to the Case Assignment once you score ≥ 90%.'
                            : 'Review the feedback below and click Retry Quiz to retake the assessment. Scoring ≥ 90% completes this module.'}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={handleRetryQuiz}
                        className="px-4 py-2.5 rounded-lg bg-red-500 text-white font-heading font-black text-xs uppercase tracking-wider hover:bg-red-400 transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer"
                      >
                        <RefreshCw size={14} />
                        <span>Retry Quiz Now</span>
                      </button>
                    </div>
                  )}

                  {/* Questions List */}
                  <div className="space-y-5">
                    {activeModule.quiz.map((q, qIdx) => {
                      const selectedOpt = currentModProg.quizAnswers?.[q.id];
                      const fb = quizFeedbackState?.questionFeedback.find((f) => f.questionId === q.id);

                      return (
                        <div
                          key={q.id}
                          className="p-5 rounded-xl bg-base border border-black/10 dark:border-white/10 space-y-3"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <p className="text-xs sm:text-sm font-bold text-text-main leading-relaxed">
                              <span className="text-warning font-mono mr-2">Q{qIdx + 1}.</span>
                              {q.question}
                            </p>
                            <span className="text-[10px] font-mono text-text-muted shrink-0">10 Pts</span>
                          </div>

                          <div className="grid grid-cols-1 gap-2 pt-1">
                            {q.options.map((opt, oIdx) => {
                              const isSelected = selectedOpt === oIdx;
                              let optionStyle =
                                'bg-surface border-black/10 dark:border-white/10 text-text-muted hover:border-warning/40';

                              if (isSelected) {
                                optionStyle = 'bg-warning/15 border-warning text-text-main font-bold';
                              }
                              if (fb) {
                                if (quizFeedbackState?.passed && oIdx === q.correctAnswer) {
                                  optionStyle = 'bg-emerald-500/15 border-emerald-500 text-emerald-300 font-bold';
                                } else if (isSelected && fb.isCorrect) {
                                  optionStyle = 'bg-emerald-500/15 border-emerald-500 text-emerald-300 font-bold';
                                } else if (isSelected && !fb.isCorrect) {
                                  optionStyle = 'bg-red-500/15 border-red-500 text-red-300 font-bold';
                                }
                              }

                              return (
                                <button
                                  key={oIdx}
                                  type="button"
                                  onClick={() => handleSelectQuizAnswer(q.id, oIdx)}
                                  className={`w-full text-left p-3 rounded-lg border text-xs transition-all cursor-pointer flex items-start gap-2.5 ${optionStyle}`}
                                >
                                  <span className="font-mono font-bold uppercase">
                                    {String.fromCharCode(65 + oIdx)}.
                                  </span>
                                  <span className="flex-1 leading-relaxed">{opt}</span>
                                </button>
                              );
                            })}
                          </div>

                          {fb && (
                            <div
                              className={`p-3 rounded-lg border text-xs mt-2 ${
                                fb.isCorrect
                                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
                                  : 'bg-amber-500/10 border-amber-500/20 text-amber-300'
                              }`}
                            >
                              <p className="font-bold mb-0.5">
                                {fb.isCorrect ? '✓ Correct Analysis:' : '✕ Incorrect — Review Topic:'}
                              </p>
                              <p className="text-text-main/90 leading-relaxed">
                                {fb.isCorrect
                                  ? fb.explanation
                                  : `Review syllabus section on "${fb.referenceTopic}" and retry the quiz to achieve ≥ 90%.`}
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Quiz Submit / Retry / Next Action */}
                  <div className="p-5 rounded-xl bg-base border border-black/10 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-xs text-text-muted">
                      Answered{' '}
                      <strong className="text-text-main">
                        {Object.keys(currentModProg.quizAnswers || {}).length} / {activeModule.quiz.length}
                      </strong>{' '}
                      questions.{' '}
                      {moduleHasAssignment(activeModule.moduleNumber) ? (
                        <>
                          Score <strong>≥ 90%</strong> is required to unlock the Case Assignment.
                        </>
                      ) : (
                        <>
                          Score <strong>≥ 90%</strong> to verify and complete Module 0{activeModule.moduleNumber}.
                        </>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      {quizFeedbackState && !quizFeedbackState.passed && (
                        <button
                          type="button"
                          onClick={handleRetryQuiz}
                          className="px-5 py-3 rounded-xl bg-surface border border-warning/40 text-warning font-heading font-black text-xs uppercase tracking-widest hover:bg-warning hover:text-crust transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                          <RefreshCw size={14} />
                          <span>Retry Quiz (Clear Answers)</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={handleSubmitQuizAutoCheck}
                        className="px-6 py-3 rounded-xl bg-warning text-crust font-heading font-black text-xs uppercase tracking-widest hover:bg-warning/90 transition-all cursor-pointer"
                      >
                        {quizFeedbackState ? 'Re-Submit Quiz' : 'Submit Quiz'}
                      </button>

                      {moduleHasAssignment(activeModule.moduleNumber) ? (
                        currentModProg.quizPassed ? (
                          <button
                            type="button"
                            onClick={() => {
                              setActiveSubView('assignment');
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="px-5 py-3 rounded-xl bg-emerald-500 text-crust font-heading font-black text-xs uppercase tracking-widest hover:bg-emerald-400 transition-all flex items-center gap-1.5 cursor-pointer"
                          >
                            <span>Proceed to Case Assignment</span>
                            <ChevronRight size={15} />
                          </button>
                        ) : (
                          <span className="px-4 py-3 rounded-xl bg-black/10 dark:bg-white/5 text-text-muted text-xs font-mono flex items-center gap-1.5 opacity-70 cursor-not-allowed">
                            <Lock size={14} />
                            <span>Case Assignment Locked (Need ≥ 90%)</span>
                          </span>
                        )
                      ) : (
                        currentModProg.quizPassed && (
                          <button
                            type="button"
                            onClick={() => {
                              if (activeModuleIdx < FORENSIC_TOXICOLOGY_MODULES.length - 1) {
                                setActiveModuleIdx(activeModuleIdx + 1);
                                setActiveSubView('study');
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                              } else {
                                setActiveSubView('certificate');
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                              }
                            }}
                            className="px-5 py-3 rounded-xl bg-emerald-500 text-crust font-heading font-black text-xs uppercase tracking-widest hover:bg-emerald-400 transition-all flex items-center gap-1.5 cursor-pointer"
                          >
                            <span>Next: Module 0{activeModuleIdx + 2}</span>
                            <ChevronRight size={15} />
                          </button>
                        )
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* SUBVIEW 3: PRACTICAL CASE ASSIGNMENT (EVEN MODULES 2, 4, 6 ONLY • LOCKED UNTIL QUIZ >= 90%) */}
              {activeSubView === 'assignment' && moduleHasAssignment(activeModule.moduleNumber) && !currentModProg.quizPassed && (
                <div className="p-8 text-center space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto">
                    <Lock size={22} />
                  </div>
                  <h3 className="text-lg font-heading font-black uppercase text-text-main">
                    Case Assignment Locked — Quiz Score ≥ 90% Required
                  </h3>
                  <p className="text-xs sm:text-sm text-text-muted max-w-md mx-auto leading-relaxed">
                    You must first score at least <strong>90%</strong> on this module&apos;s quiz before unlocking the Case Assignment.
                  </p>
                  <button
                    type="button"
                    onClick={() => setActiveSubView('quiz')}
                    className="px-6 py-3 rounded-xl bg-warning text-crust font-heading font-black text-xs uppercase tracking-widest hover:bg-warning/90 transition-all inline-flex items-center gap-2 cursor-pointer"
                  >
                    <HelpCircle size={15} />
                    <span>Go to Module Quiz</span>
                  </button>
                </div>
              )}

              {activeSubView === 'assignment' && moduleHasAssignment(activeModule.moduleNumber) && currentModProg.quizPassed && (
                <div className="p-6 sm:p-8 space-y-6">
                  <div className="p-5 rounded-xl bg-base border border-black/10 dark:border-white/10 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-[10px] font-mono font-black uppercase tracking-widest text-warning">
                        PRACTICAL FORENSIC CASEWORK ASSIGNMENT • AUTOCHECK RUBRIC
                      </span>
                      {currentModProg.assignmentPassed ? (
                        <span className="px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-black">
                          ✓ ALL ASSIGNMENT CRITERIA VERIFIED (100%)
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full bg-warning/10 border border-warning/20 text-warning text-xs font-mono font-bold">
                          Pending AutoCheck Verification
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg font-heading font-black text-text-main">
                      {activeModule.assignment.title}
                    </h3>

                    <div className="p-4 rounded-lg bg-surface border-l-4 border-warning text-xs sm:text-sm text-text-main leading-relaxed">
                      <strong className="text-warning font-mono uppercase block text-[10px] mb-1">
                        Official Medico-Legal Case Scenario:
                      </strong>
                      {activeModule.assignment.caseScenario}
                    </div>

                    <div className="space-y-1.5 pt-1">
                      <p className="text-xs font-bold text-text-main uppercase tracking-wider">
                        Assignment Instructions:
                      </p>
                      <ul className="space-y-1 text-xs text-text-muted">
                        {activeModule.assignment.instructions.map((inst, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-warning font-mono font-bold">{idx + 1}.</span>
                            <span>{inst}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Part A: Structured Quantitative & Protocol Parameters */}
                  <div className="p-5 rounded-xl bg-base border border-black/10 dark:border-white/10 space-y-4">
                    <h4 className="text-xs font-mono font-black uppercase tracking-widest text-warning">
                      Part A: Quantitative Calculations & Protocol Determinations
                    </h4>

                    <div className="grid grid-cols-1 gap-4">
                      {activeModule.assignment.structuredFields.map((field) => {
                        const val = currentModProg.assignmentFieldValues?.[field.id] ?? '';
                        return (
                          <div
                            key={field.id}
                            className="p-4 rounded-lg bg-surface border border-black/5 dark:border-white/5 space-y-1.5"
                          >
                            <label className="text-xs font-bold text-text-main block">
                              {field.label}
                            </label>
                            {field.type === 'select' ? (
                              <select
                                value={val}
                                onChange={(e) => handleAssignmentFieldChange(field.id, e.target.value)}
                                className="w-full bg-base border border-black/10 dark:border-white/10 rounded-lg px-3 py-2.5 text-xs font-bold text-text-main outline-none focus:border-warning"
                              >
                                <option value="">-- Select Official Protocol Determination --</option>
                                {field.options?.map((opt) => (
                                  <option key={opt} value={opt}>
                                    {opt}
                                  </option>
                                ))}
                              </select>
                            ) : (
                              <div className="flex items-center gap-2">
                                <input
                                  type="number"
                                  step="any"
                                  value={val}
                                  onChange={(e) => handleAssignmentFieldChange(field.id, e.target.value)}
                                  placeholder={field.placeholder}
                                  className="w-full bg-base border border-black/10 dark:border-white/10 rounded-lg px-3 py-2.5 text-xs font-mono font-bold text-text-main outline-none focus:border-warning"
                                />
                                {field.unit && (
                                  <span className="text-xs font-mono font-bold text-warning shrink-0">
                                    {field.unit}
                                  </span>
                                )}
                              </div>
                            )}
                            <p className="text-[11px] text-text-muted">
                              <em>Guidance: {field.hint}</em>
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Part B: Written Forensic Toxicology Case Opinion */}
                  <div className="p-5 rounded-xl bg-base border border-black/10 dark:border-white/10 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <h4 className="text-xs font-mono font-black uppercase tracking-widest text-warning">
                        Part B: Written Forensic Toxicology Case Opinion
                      </h4>
                      <span className="text-[11px] font-mono text-text-muted">
                        Word Count:{' '}
                        <strong className="text-text-main">
                          {(currentModProg.assignmentWrittenResponse || '')
                            .trim()
                            .split(/\s+/)
                            .filter(Boolean).length}
                        </strong>{' '}
                        / Required ≥ {activeModule.assignment.minWordCount} words
                      </span>
                    </div>

                    <p className="text-xs text-text-main font-medium">
                      {activeModule.assignment.writtenPrompt}
                    </p>

                    <textarea
                      rows={5}
                      value={currentModProg.assignmentWrittenResponse || ''}
                      onChange={(e) => handleAssignmentWrittenChange(e.target.value)}
                      placeholder="Write your detailed forensic toxicological opinion here..."
                      className="w-full bg-surface border border-black/10 dark:border-white/10 rounded-xl p-4 text-xs sm:text-sm text-text-main leading-relaxed outline-none focus:border-warning"
                    />

                    <div className="p-3 rounded-lg bg-surface/70 border border-black/5 dark:border-white/5 text-[11px] text-text-muted">
                      <strong className="text-warning">AutoCheck Rubric Hint:</strong>{' '}
                      {activeModule.assignment.sampleFrameworkHint}
                    </div>
                  </div>

                  {/* AutoCheck Rubric Criteria Evaluation Breakdown */}
                  {currentModProg.assignmentCriteriaResults &&
                    currentModProg.assignmentCriteriaResults.length > 0 && (
                      <div className="p-5 rounded-xl bg-base border border-black/10 dark:border-white/10 space-y-3">
                        <h4 className="text-xs font-mono font-black uppercase tracking-widest text-text-main">
                          AutoCheck Assignment Rubric Verification Report
                        </h4>
                        <div className="space-y-2">
                          {currentModProg.assignmentCriteriaResults.map((crit) => (
                            <div
                              key={crit.criterionId}
                              className={`p-3 rounded-lg border text-xs flex items-start justify-between gap-3 ${
                                crit.passed
                                  ? 'bg-emerald-500/10 border-emerald-500/20'
                                  : 'bg-red-500/10 border-red-500/20'
                              }`}
                            >
                              <div className="space-y-0.5">
                                <p className="font-bold text-text-main">{crit.label}</p>
                                <p className="text-text-muted">{crit.feedback}</p>
                              </div>
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-mono font-black shrink-0 ${
                                  crit.passed
                                    ? 'bg-emerald-500/20 text-emerald-400'
                                    : 'bg-red-500/20 text-red-400'
                                }`}
                              >
                                {crit.passed ? 'PASSED' : 'REVISION NEEDED'}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  {/* Submit Assignment to AutoCheck Footer */}
                  <div className="p-5 rounded-xl bg-base border border-black/10 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-xs text-text-muted">
                      AutoCheck verifies all quantitative parameters, required scientific mechanisms, and minimum technical depth.
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={handleSubmitAssignmentAutoCheck}
                        className="px-6 py-3 rounded-xl bg-warning text-crust font-heading font-black text-xs uppercase tracking-widest hover:bg-warning/90 transition-all cursor-pointer"
                      >
                        Run AutoCheck on Assignment
                      </button>

                      {currentModStatus?.moduleComplete && (
                        <button
                          type="button"
                          onClick={() => {
                            if (activeModuleIdx < FORENSIC_TOXICOLOGY_MODULES.length - 1) {
                              setActiveModuleIdx(activeModuleIdx + 1);
                              setActiveSubView('study');
                            } else {
                              setActiveSubView('certificate');
                            }
                          }}
                          className="px-5 py-3 rounded-xl bg-emerald-500 text-crust font-heading font-black text-xs uppercase tracking-widest hover:bg-emerald-400 transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                          <span>
                            {activeModuleIdx < FORENSIC_TOXICOLOGY_MODULES.length - 1
                              ? `Next: Module 0${activeModuleIdx + 2}`
                              : 'All Modules Done! Open Certificate PDF Studio'}
                          </span>
                          <ChevronRight size={15} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          </section>
        </div>
      )}

      {/* Modal Prompt: Ask for Registered Candidate Name at Certificate Generation Time */}
      <AnimatePresence>
        {showCertNamePromptModal && eligibility.isEligible && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !generatingCert && setShowCertNamePromptModal(false)}
              className="absolute inset-0 bg-crust/85 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              className="relative z-10 w-full max-w-md bg-surface border border-black/10 dark:border-white/10 rounded-2xl p-6 sm:p-7 shadow-2xl space-y-5"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
                  <Award size={20} />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-black block">
                    Course {FORENSIC_TOXICOLOGY_COURSE_CODE} • Eligible for Certificate
                  </span>
                  <h3 className="text-base font-heading font-black uppercase text-text-main">
                    Registered Candidate Name for Official Certificate PDF
                  </h3>
                </div>
              </div>

              <p className="text-xs text-text-muted leading-relaxed">
                Congratulations on completing the course requirements. Please enter your exact full name below—this name will be stamped onto your official Certificate PDF.
              </p>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-text-main block mb-1.5">
                    Candidate Full Name *
                  </label>
                  <input
                    type="text"
                    autoFocus
                    value={regNameInput}
                    onChange={(e) => {
                      setRegNameInput(e.target.value);
                      if (certNameError) setCertNameError('');
                    }}
                    placeholder="e.g., Aarav Deshmukh"
                    className="w-full bg-base border border-black/10 dark:border-white/10 rounded-lg px-4 py-3 text-sm font-bold text-text-main outline-none focus:border-warning"
                  />
                  {certNameError && (
                    <p className="text-xs text-red-400 mt-1 font-medium">{certNameError}</p>
                  )}
                </div>

                <div>
                  <label className="text-xs font-bold text-text-main block mb-1.5">
                    Certificate Date
                  </label>
                  <input
                    type="text"
                    value={certIssueDateInput}
                    onChange={(e) => setCertIssueDateInput(e.target.value)}
                    className="w-full bg-base border border-black/10 dark:border-white/10 rounded-lg px-4 py-2.5 text-xs font-mono text-text-main outline-none focus:border-warning"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  disabled={generatingCert}
                  onClick={() => setShowCertNamePromptModal(false)}
                  className="px-4 py-2.5 rounded-lg bg-base border border-black/10 dark:border-white/10 text-xs font-bold text-text-muted hover:text-text-main cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={generatingCert}
                  onClick={handleGenerateAndDownloadCertificate}
                  className="px-5 py-2.5 rounded-lg bg-warning text-crust font-heading font-black text-xs uppercase tracking-wider hover:bg-warning/90 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Download size={15} />
                  <span>{generatingCert ? 'Generating...' : 'Confirm & Download PDF'}</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
