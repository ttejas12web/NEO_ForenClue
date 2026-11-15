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
import QRCodeReact from 'react-qr-code';
import {
  FORENSIC_TOXICOLOGY_COURSE_ID,
  FORENSIC_TOXICOLOGY_COURSE_CODE,
  FORENSIC_TOXICOLOGY_MODULES,
  ToxModule,
  ToxCourseEnrollment,
  ToxModuleProgress,
  CertTemplateConfig,
  DEFAULT_CERT_TEMPLATE_CONFIG,
  OFFICIAL_CERT_TEMPLATE_LOCAL_PATH,
  OFFICIAL_CERT_TEMPLATE_REMOTE_URL,
  formatCertificateDateDdMmYyyy,
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
const LOCAL_TEMPLATE_CONFIG_KEY = 'forenclue_tox_cert_template_config_v2';
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
    formatCertificateDateDdMmYyyy('')
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
      <div className="min-h-screen bg-base py-6 sm:py-12 px-3.5 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <Link
            to="/courses"
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-text-muted hover:text-warning mb-4 sm:mb-6 py-1"
          >
            <ChevronLeft size={16} /> Back to Courses Directory
          </Link>

          <div className="bg-surface border border-black/10 dark:border-white/10 rounded-2xl p-4 sm:p-10 shadow-2xl space-y-6 sm:space-y-8">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
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
              className="bg-base border border-warning/30 rounded-xl p-4 sm:p-6 space-y-4 sm:space-y-5"
            >
              <div className="flex items-center gap-2 border-b border-black/10 dark:border-white/10 pb-3">
                <UserCheck size={18} className="text-warning shrink-0" />
                <h2 className="text-xs sm:text-sm font-heading font-black uppercase tracking-wider text-text-main">
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
                    className="w-full min-h-[44px] bg-surface border border-black/10 dark:border-white/10 rounded-lg px-4 py-3 text-sm font-bold text-text-main outline-none focus:border-warning"
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
                    className="w-full min-h-[44px] bg-surface border border-black/10 dark:border-white/10 rounded-lg px-4 py-3 text-sm text-text-main outline-none focus:border-warning"
                  />
                </div>
              </div>

              <div className="p-3.5 rounded-lg bg-warning/5 border border-warning/20 text-xs text-text-muted space-y-1">
                <p className="font-bold text-text-main flex items-center gap-1.5">
                  <ShieldCheck size={15} className="text-warning shrink-0" /> AutoCheck Certification Criteria:
                </p>
                <p>
                  1. Complete the self-paced study guide for all <strong>6 Modules</strong> (No video lectures; 100% self-paced scientific study).
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
                className="w-full min-h-[48px] py-3.5 px-4 bg-warning text-crust font-heading font-black uppercase tracking-wider sm:tracking-widest text-xs rounded-xl hover:bg-warning/90 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-warning/10 text-center"
              >
                <Unlock size={16} className="shrink-0" />
                <span>Enroll in Course & Start Module 1</span>
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
      {/* Minimalistic Mobile-Optimized Sticky Course Header */}
      <header className="bg-surface/95 backdrop-blur-md border-b border-black/10 dark:border-white/10 px-3 sm:px-6 py-2.5 sm:py-3.5 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3">
          <div className="flex items-center justify-between gap-2 min-w-0">
            <div className="flex items-center gap-2.5 min-w-0">
              <Link
                to="/courses"
                className="w-9 h-9 sm:w-auto sm:h-auto sm:p-2 rounded-lg bg-base border border-black/10 dark:border-white/10 text-text-muted hover:text-warning transition-colors flex items-center justify-center shrink-0"
                title="Back to Courses"
              >
                <ChevronLeft size={18} />
              </Link>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 sm:gap-2 text-[9px] sm:text-[10px] font-mono uppercase tracking-wider sm:tracking-widest text-text-muted truncate">
                  <span className="text-warning font-black">CODE: {FORENSIC_TOXICOLOGY_COURSE_CODE}</span>
                  <span aria-hidden="true">·</span>
                  <span className="truncate">MR. RAJAT PITHADIA</span>
                  {savingProgress && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="inline-flex items-center gap-1 text-warning">
                        <RefreshCw size={10} className="animate-spin" /> Sync
                      </span>
                    </>
                  )}
                </div>
                <h1 className="text-xs sm:text-base font-heading font-black uppercase tracking-tight text-text-main truncate">
                  Certificate Course in Forensic Toxicology
                </h1>
              </div>
            </div>

            {/* Compact mobile module completion badge in top row */}
            <span className="sm:hidden text-[10px] font-mono text-text-muted px-2 py-1 rounded-md bg-base border border-black/10 dark:border-white/10 shrink-0">
              <strong className="text-warning">{eligibility.completedModulesCount}/6</strong> Done
            </span>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-2">
            {activeSubView !== 'modules-hub' && (
              <button
                onClick={() => {
                  setActiveSubView('modules-hub');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="min-h-[38px] px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-lg bg-base border border-black/10 dark:border-white/10 hover:border-warning/50 text-text-main text-[11px] sm:text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
              >
                <ChevronLeft size={14} />
                <span>All 6 Modules</span>
              </button>
            )}

            <span className="hidden sm:inline-block text-xs font-mono text-text-muted px-2.5 py-1.5 rounded-lg bg-base border border-black/10 dark:border-white/10">
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
              className={`min-h-[38px] flex-1 sm:flex-initial justify-center px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-lg text-[11px] sm:text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
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
                <Award size={14} className="text-crust shrink-0" />
              ) : (
                <Lock size={13} className="text-amber-400 shrink-0" />
              )}
              <span className="truncate">
                {eligibility.isEligible
                  ? 'Generate Certificate'
                  : `Certificate (${eligibility.completedModulesCount}/6)`}
              </span>
            </button>
          </div>
        </div>
      </header>

      {activeSubView === 'modules-hub' ? (
        /* CLEAN, MINIMALISTIC & USER-FRIENDLY 6-MODULE HUB */
        <div className="max-w-6xl w-full mx-auto flex-1 px-3.5 sm:px-6 py-6 sm:py-14 space-y-6 sm:space-y-8">
          <div className="text-center space-y-1.5 sm:space-y-2">
            <span className="text-[11px] sm:text-xs font-mono uppercase tracking-widest text-warning font-bold block">
              Course Code: {FORENSIC_TOXICOLOGY_COURSE_CODE}
            </span>
            <h2 className="text-xl sm:text-3xl font-heading font-black uppercase tracking-tight text-text-main">
              Select a Course Module to Begin Study
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
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
                  className={`text-left bg-surface border rounded-xl p-4 sm:p-6 flex flex-col justify-between transition-all duration-200 cursor-pointer group ${
                    st?.moduleComplete
                      ? 'border-emerald-500/40 hover:border-emerald-500'
                      : 'border-black/10 dark:border-white/10 hover:border-warning/60'
                  }`}
                >
                  <div className="space-y-2.5 sm:space-y-3">
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
                          className="w-full h-24 sm:h-28 object-contain bg-white rounded"
                        />
                      </div>
                    )}
                  </div>

                  <div className="pt-4 mt-4 sm:pt-5 sm:mt-5 border-t border-black/5 dark:border-white/5 flex items-center justify-between text-xs font-bold">
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
        <div className="max-w-5xl w-full mx-auto flex-1 p-3 sm:p-6">
          <section className="space-y-6">
            {activeSubView === 'certificate' ? (
            /* MASTER AUTOCHECK VERIFICATION & PDF CERTIFICATE GENERATOR STUDIO */
            <div className="bg-surface border border-black/10 dark:border-white/10 rounded-2xl p-4 sm:p-8 space-y-6 sm:space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 border-b border-black/10 dark:border-white/10 pb-4 sm:pb-6">
                <div>
                  <h2 className="text-lg sm:text-2xl font-heading font-black uppercase tracking-tight text-text-main">
                    Course Verification & Certificate PDF Generator
                  </h2>
                </div>
                {isAdmin && (
                  <button
                    onClick={() => setShowTemplateConfigurator(!showTemplateConfigurator)}
                    className="min-h-[40px] px-4 py-2 rounded-xl bg-base border border-black/10 dark:border-white/10 hover:border-warning text-xs font-bold text-text-main flex items-center gap-2 cursor-pointer self-start"
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
              <div className="space-y-2.5 sm:space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-xs font-mono font-black uppercase tracking-widest text-text-muted">
                    6-Module Eligibility Audit Matrix
                  </h3>
                  <span className="sm:hidden text-[10px] font-mono text-text-muted">
                    Swipe table →
                  </span>
                </div>

                <div className="overflow-x-auto touch-pan-x border border-black/10 dark:border-white/10 rounded-xl">
                  <table className="w-full min-w-[560px] text-left border-collapse text-xs">
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

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-2">
                  <div className="text-xs text-text-muted">
                    {eligibility.isEligible ? (
                      <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                        <ShieldCheck size={16} className="shrink-0" /> AutoCheck System Verified: All 6 Modules, Quizzes & Assignments Completed!
                      </span>
                    ) : (
                      <span className="text-amber-400 flex items-center gap-1.5">
                        <Lock size={15} className="shrink-0" /> Complete all 6 modules ({eligibility.completedModulesCount}/6 verified) to unlock certificate.
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
                    className={`w-full sm:w-auto min-h-[46px] justify-center px-6 py-3.5 rounded-xl font-heading font-black text-xs uppercase tracking-widest flex items-center gap-2 transition-all ${
                      eligibility.isEligible
                        ? 'bg-warning text-crust hover:bg-warning/90 cursor-pointer shadow-lg shadow-warning/20'
                        : 'bg-black/10 dark:bg-white/5 text-text-muted cursor-not-allowed opacity-60'
                    }`}
                  >
                    {eligibility.isEligible ? <Download size={16} className="shrink-0" /> : <Lock size={15} className="shrink-0" />}
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

              {/* Live Certificate Visual & PDF Preview — Only Rendered When Eligible */}
              {eligibility.isEligible && (() => {
                const previewCertNo =
                  enrollment.certificateNo ||
                  `FC-${FORENSIC_TOXICOLOGY_COURSE_CODE}-${new Date().getFullYear()}-${(user?.uid || '8492').substring(0, 5).toUpperCase()}`;
                const previewName = regNameInput.trim() || enrollment.registeredName || 'Candidate Full Name';
                const previewDate = formatCertificateDateDdMmYyyy(certIssueDateInput);
                const verifyQrUrl = `https://forenclue.in/certificate?id=${encodeURIComponent(previewCertNo)}`;

                return (
                  <div className="space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-text-muted">
                        Official Certificate Live Preview (Name, Date, Course Content, QR &amp; ID Stamped)
                      </span>
                      {previewPdfUrl && (
                        <a
                          href={previewPdfUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[11px] font-mono text-warning hover:underline flex items-center gap-1"
                        >
                          <span>Open Full PDF in New Tab</span>
                          <ExternalLink size={12} />
                        </a>
                      )}
                    </div>

                    {/* Responsive Visual Certificate Preview Matching Exact 1600x1131 Template Coordinates */}
                    <div className="relative w-full aspect-[1600/1131] rounded-xl overflow-hidden border border-black/15 dark:border-white/15 bg-white shadow-2xl select-none">
                      <img
                        src={OFFICIAL_CERT_TEMPLATE_LOCAL_PATH}
                        onError={(e) => {
                          const target = e.currentTarget;
                          if (target.src !== OFFICIAL_CERT_TEMPLATE_REMOTE_URL) {
                            target.src = OFFICIAL_CERT_TEMPLATE_REMOTE_URL;
                          }
                        }}
                        alt="ForenClue Certificate of Completion Template"
                        className="w-full h-full object-cover"
                      />

                      {/* 1. Date Stamp next to "Date :" */}
                      <div
                        className="absolute bg-white px-1 flex items-center font-serif font-bold text-[#111827] leading-none"
                        style={{
                          left: '6.15%',
                          top: '38.4%',
                          height: '2.6%',
                          fontSize: 'clamp(7px, 1.35vw, 18px)'
                        }}
                      >
                        {previewDate}
                      </div>

                      {/* 2. Candidate Name Stamp under "THIS IS TO CERTIFY THAT" */}
                      <div
                        className="absolute bg-white flex flex-col justify-center"
                        style={{
                          left: '33.8%',
                          top: '48.8%',
                          width: '43.5%',
                          minHeight: '7.2%'
                        }}
                      >
                        <div
                          className="font-sans font-extrabold text-[#111827] tracking-tight truncate pb-1 border-b-2 border-[#C98F19]"
                          style={{ fontSize: 'clamp(14px, 3.0vw, 40px)' }}
                        >
                          {previewName}
                        </div>
                      </div>

                      {/* 3. Course Completion & Learning Details in "Content of the course etc" area */}
                      <div
                        className="absolute bg-white flex flex-col justify-start space-y-0.5 sm:space-y-1"
                        style={{
                          left: '33.8%',
                          top: '57.6%',
                          width: '43.5%',
                          minHeight: '15.5%'
                        }}
                      >
                        <p
                          className="font-sans font-bold text-[#2E3846] leading-snug"
                          style={{ fontSize: 'clamp(6.2px, 1.08vw, 14.5px)' }}
                        >
                          has successfully completed the 6-Module Self-Paced
                        </p>
                        <p
                          className="font-sans font-extrabold text-[#3D2173] tracking-tight leading-snug"
                          style={{ fontSize: 'clamp(7.5px, 1.32vw, 17.5px)' }}
                        >
                          CERTIFICATE COURSE IN FORENSIC TOXICOLOGY ({FORENSIC_TOXICOLOGY_COURSE_CODE})
                        </p>
                        <div
                          className="font-sans font-medium text-[#263345] leading-snug space-y-0.5 pt-0.5"
                          style={{ fontSize: 'clamp(5.8px, 0.98vw, 13.2px)' }}
                        >
                          <p>Covering Toxicokinetics, Postmortem Redistribution &amp; Viscera Clean-Up,</p>
                          <p>GC-MS / ICP-MS Instrumentation, Metallic, Volatile &amp; Pesticide Poisons,</p>
                          <p>NDPS Act Narcotics, Plant/Animal Toxinology &amp; Sec. 329 BNSS Reporting.</p>
                        </div>
                        <p
                          className="font-sans font-bold text-[#94610F] leading-snug pt-0.5"
                          style={{ fontSize: 'clamp(5.8px, 0.98vw, 13.2px)' }}
                        >
                          Duration: 48 Hours (6 Modules) &nbsp;|&nbsp; Assessment Score: &ge; 90% (Verified)
                        </p>
                      </div>

                      {/* 4. Scannable Verification QR Code inside the 4 corner brackets */}
                      <div
                        className="absolute bg-white flex items-center justify-center p-0.5 sm:p-1"
                        style={{
                          left: '86.4%',
                          top: '56.8%',
                          width: '8.0%',
                          height: '11.3%'
                        }}
                      >
                        <QRCodeReact
                          value={verifyQrUrl}
                          size={128}
                          level="M"
                          bgColor="#FFFFFF"
                          fgColor="#111827"
                          style={{ width: '100%', height: '100%' }}
                        />
                      </div>

                      {/* 5. Certificate Verification ID below the QR brackets */}
                      <div
                        className="absolute bg-white flex flex-col items-center justify-center text-center"
                        style={{
                          left: '83.2%',
                          top: '71.4%',
                          width: '14.5%',
                          minHeight: '3.6%'
                        }}
                      >
                        <span
                          className="font-sans uppercase tracking-wider text-[#64748B] leading-none"
                          style={{ fontSize: 'clamp(4.5px, 0.62vw, 9px)' }}
                        >
                          Certificate ID
                        </span>
                        <span
                          className="font-sans font-extrabold text-[#111827] leading-tight mt-0.5"
                          style={{ fontSize: 'clamp(5.5px, 0.82vw, 12px)' }}
                        >
                          {previewCertNo}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          ) : (
            /* ACTIVE MODULE WORKSPACE (STUDY DOSSIER / QUIZ / ASSIGNMENT) */
            <div className="bg-surface border border-black/10 dark:border-white/10 rounded-2xl overflow-hidden shadow-xl">
              {/* Module Banner Header */}
              <div className="p-4 sm:p-8 bg-base/60 border-b border-black/10 dark:border-white/10 space-y-3.5 sm:space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                    <span className="px-2.5 py-1 rounded bg-warning/15 border border-warning/30 text-warning text-[10px] font-mono font-black uppercase tracking-widest">
                      MODULE 0{activeModule.moduleNumber} OF 06 • {activeModule.code}
                    </span>
                    <span className="px-2.5 py-1 rounded bg-black/5 dark:bg-white/5 text-text-muted text-[10px] font-mono font-bold uppercase">
                      {activeModule.level} • {activeModule.estimatedHours}
                    </span>
                  </div>

                  {currentModStatus?.moduleComplete && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] sm:text-xs font-mono font-black">
                      <CheckCircle2 size={13} /> MODULE AUTOCHECK VERIFIED
                    </span>
                  )}
                </div>

                <div>
                  <h2 className="text-lg sm:text-2xl font-heading font-black text-text-main leading-tight">
                    {activeModule.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-text-muted mt-1 sm:mt-1.5 leading-relaxed">
                    {activeModule.subtitle}
                  </p>
                </div>

                {/* Module Segmented Navigation Bar (Horizontal on Mobile & Desktop) */}
                <div
                  className={`grid ${
                    moduleHasAssignment(activeModule.moduleNumber) ? 'grid-cols-3' : 'grid-cols-2'
                  } gap-1.5 sm:gap-2 pt-1 sm:pt-2`}
                >
                  <button
                    onClick={() => setActiveSubView('study')}
                    className={`min-h-[48px] p-2.5 sm:p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between gap-1.5 ${
                      activeSubView === 'study'
                        ? 'bg-warning text-crust border-warning font-black'
                        : 'bg-surface border-black/10 dark:border-white/10 text-text-main hover:border-warning/40'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                      <BookOpen size={15} className="shrink-0" />
                      <div className="min-w-0">
                        <span className="text-[9px] sm:text-[10px] font-mono uppercase block opacity-80 truncate">
                          Step 1
                        </span>
                        <span className="text-[11px] sm:text-xs font-bold block truncate">Study Guide</span>
                      </div>
                    </div>
                    {currentModProg.readingCompleted && (
                      <CheckCircle2 size={14} className={`shrink-0 ${activeSubView === 'study' ? 'text-crust' : 'text-emerald-400'}`} />
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
                        : 'Locked: Complete all sections in Step 1 Study Guide to unlock the Module Quiz'
                    }
                    className={`min-h-[48px] p-2.5 sm:p-3 rounded-xl border text-left transition-all flex items-center justify-between gap-1.5 ${
                      !currentModStatus?.readingDone
                        ? 'bg-base/50 border-black/10 dark:border-white/5 text-text-muted opacity-60 cursor-not-allowed'
                        : activeSubView === 'quiz'
                          ? 'bg-warning text-crust border-warning font-black cursor-pointer'
                          : 'bg-surface border-black/10 dark:border-white/10 text-text-main hover:border-warning/40 cursor-pointer'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                      {currentModStatus?.readingDone ? <HelpCircle size={15} className="shrink-0" /> : <Lock size={14} className="shrink-0" />}
                      <div className="min-w-0">
                        <span className="text-[9px] sm:text-[10px] font-mono uppercase block opacity-80 truncate">
                          {currentModStatus?.readingDone ? 'Step 2 (≥90%)' : 'Step 2 (Locked)'}
                        </span>
                        <span className="text-[11px] sm:text-xs font-bold block truncate">
                          Quiz {currentModProg.quizScore !== null ? `(${currentModProg.quizScore}%)` : '(10 Qs)'}
                        </span>
                      </div>
                    </div>
                    {currentModProg.quizPassed && (
                      <CheckCircle2 size={14} className={`shrink-0 ${activeSubView === 'quiz' ? 'text-crust' : 'text-emerald-400'}`} />
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
                      className={`min-h-[48px] p-2.5 sm:p-3 rounded-xl border text-left transition-all flex items-center justify-between gap-1.5 ${
                        !currentModStatus?.readingDone || !currentModProg.quizPassed
                          ? 'bg-base/50 border-black/10 dark:border-white/5 text-text-muted opacity-60 cursor-not-allowed'
                          : activeSubView === 'assignment'
                            ? 'bg-warning text-crust border-warning font-black cursor-pointer'
                            : 'bg-surface border-black/10 dark:border-white/10 text-text-main hover:border-warning/40 cursor-pointer'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                        {currentModStatus?.readingDone && currentModProg.quizPassed ? (
                          <ClipboardCheck size={15} className="shrink-0" />
                        ) : (
                          <Lock size={14} className="shrink-0" />
                        )}
                        <div className="min-w-0">
                          <span className="text-[9px] sm:text-[10px] font-mono uppercase block opacity-80 truncate">
                            {currentModStatus?.readingDone && currentModProg.quizPassed
                              ? 'Step 3'
                              : 'Step 3 (Locked)'}
                          </span>
                          <span className="text-[11px] sm:text-xs font-bold block truncate">Assignment</span>
                        </div>
                      </div>
                      {currentModProg.assignmentPassed && (
                        <CheckCircle2
                          size={14}
                          className={`shrink-0 ${activeSubView === 'assignment' ? 'text-crust' : 'text-emerald-400'}`}
                        />
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* SUBVIEW 1: SELF-PACED STUDY GUIDE */}
              {activeSubView === 'study' && (
                <div className="p-3.5 sm:p-8 space-y-6 sm:space-y-8">
                  {/* Learning Objectives Box */}
                  <div className="bg-base border border-black/10 dark:border-white/10 rounded-xl p-4 sm:p-5">
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
                  <div className="space-y-6 sm:space-y-8">
                    {activeModule.sections.map((sec, secIdx) => {
                      const isSecDone = currentModProg.completedSectionIds?.includes(sec.id);
                      return (
                        <div
                          key={sec.id}
                          className="border border-black/10 dark:border-white/10 rounded-2xl overflow-hidden bg-base/40"
                        >
                          <div className="p-4 sm:p-5 bg-base border-b border-black/10 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div>
                              <span className="text-[10px] font-mono font-black uppercase tracking-widest text-warning">
                                {sec.badge}
                              </span>
                              <h3 className="text-base sm:text-lg font-heading font-black text-text-main mt-0.5 leading-snug">
                                {sec.heading}
                              </h3>
                              <p className="text-xs text-text-muted mt-0.5">{sec.summary}</p>
                            </div>
                            <button
                              onClick={() => handleToggleSectionRead(sec.id)}
                              className={`min-h-[42px] w-full sm:w-auto justify-center px-3.5 py-2 rounded-lg text-xs font-mono font-bold flex items-center gap-2 shrink-0 cursor-pointer transition-all ${
                                isSecDone
                                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                                  : 'bg-surface border border-black/10 dark:border-white/10 text-text-muted hover:text-text-main'
                              }`}
                            >
                              <Check size={14} />
                              <span>{isSecDone ? 'Section Studied' : 'Mark Section Studied'}</span>
                            </button>
                          </div>

                          <div className="p-4 sm:p-6 space-y-5 sm:space-y-6">
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
                                <div className="flex items-center justify-between gap-2">
                                  <p className="text-xs font-mono font-bold text-warning">
                                    {sec.referenceTable.caption}
                                  </p>
                                  <span className="sm:hidden text-[10px] font-mono text-text-muted shrink-0">
                                    Swipe →
                                  </span>
                                </div>
                                <div className="overflow-x-auto touch-pan-x border border-black/10 dark:border-white/10 rounded-xl">
                                  <table className="w-full min-w-[520px] text-left border-collapse text-xs">
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

                  {/* Complete Module Study Guide Footer Button */}
                  <div className="p-4 sm:p-5 rounded-xl bg-base border border-black/10 dark:border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
                    <div>
                      <p className="text-xs font-bold text-text-main">
                        {currentModProg.readingCompleted
                          ? '✓ Module Study Guide Completed'
                          : 'Finished studying all sections and tables in this module?'}
                      </p>
                      <p className="text-[11px] text-text-muted">
                        Proceed to the 10-question AutoCheck Quiz (requires ≥ 90% score to verify).
                      </p>
                    </div>
                    <button
                      onClick={handleMarkAllSectionsComplete}
                      className="w-full sm:w-auto min-h-[46px] justify-center px-5 py-3 rounded-xl bg-warning text-crust font-heading font-black text-xs uppercase tracking-wider sm:tracking-widest hover:bg-warning/90 transition-all flex items-center gap-2 cursor-pointer shrink-0"
                    >
                      <CheckCircle2 size={16} className="shrink-0" />
                      <span>Complete Study Guide & Start Quiz</span>
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
                    Module Quiz Locked — Complete Module Study Guide First
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
                <div className="p-3.5 sm:p-8 space-y-5 sm:space-y-6">
                  <div className="p-4 rounded-xl bg-base border border-black/10 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-mono font-black uppercase tracking-widest text-warning">
                        AUTOCHECK MODULE ASSESSMENT • 10 QUESTIONS
                      </span>
                      <h3 className="text-base sm:text-lg font-heading font-black text-text-main">
                        {activeModule.code} Competency Quiz (Minimum Passing Score: 90%)
                      </h3>
                      <p className="text-xs text-text-muted">
                        You must answer at least 9 out of 10 questions correctly (≥ 90%) for AutoCheck to verify this module&apos;s quiz.
                      </p>
                    </div>

                    {quizFeedbackState && (
                      <div className="flex flex-wrap items-center gap-3 shrink-0">
                        <div
                          className={`px-4 py-2.5 rounded-xl border text-left sm:text-right w-full sm:w-auto ${
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
                            className="w-full sm:w-auto min-h-[44px] justify-center px-4 py-3 rounded-xl bg-warning text-crust font-heading font-black text-xs uppercase tracking-wider hover:bg-warning/90 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
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
                        className="w-full sm:w-auto min-h-[44px] justify-center px-4 py-2.5 rounded-lg bg-red-500 text-white font-heading font-black text-xs uppercase tracking-wider hover:bg-red-400 transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer"
                      >
                        <RefreshCw size={14} />
                        <span>Retry Quiz Now</span>
                      </button>
                    </div>
                  )}

                  {/* Questions List */}
                  <div className="space-y-4 sm:space-y-5">
                    {activeModule.quiz.map((q, qIdx) => {
                      const selectedOpt = currentModProg.quizAnswers?.[q.id];
                      const fb = quizFeedbackState?.questionFeedback.find((f) => f.questionId === q.id);

                      return (
                        <div
                          key={q.id}
                          className="p-4 sm:p-5 rounded-xl bg-base border border-black/10 dark:border-white/10 space-y-3"
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
                                  className={`w-full min-h-[44px] text-left p-3 rounded-lg border text-xs transition-all cursor-pointer flex items-start gap-2.5 ${optionStyle}`}
                                >
                                  <span className="font-mono font-bold uppercase mt-0.5">
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
                  <div className="p-4 sm:p-5 rounded-xl bg-base border border-black/10 dark:border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
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

                    <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2.5 sm:gap-3">
                      {quizFeedbackState && !quizFeedbackState.passed && (
                        <button
                          type="button"
                          onClick={handleRetryQuiz}
                          className="w-full sm:w-auto min-h-[44px] justify-center px-5 py-3 rounded-xl bg-surface border border-warning/40 text-warning font-heading font-black text-xs uppercase tracking-widest hover:bg-warning hover:text-crust transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                          <RefreshCw size={14} />
                          <span>Retry Quiz (Clear Answers)</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={handleSubmitQuizAutoCheck}
                        className="w-full sm:w-auto min-h-[46px] justify-center px-6 py-3 rounded-xl bg-warning text-crust font-heading font-black text-xs uppercase tracking-widest hover:bg-warning/90 transition-all cursor-pointer"
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
                            className="w-full sm:w-auto min-h-[46px] justify-center px-5 py-3 rounded-xl bg-emerald-500 text-crust font-heading font-black text-xs uppercase tracking-widest hover:bg-emerald-400 transition-all flex items-center gap-1.5 cursor-pointer"
                          >
                            <span>Proceed to Case Assignment</span>
                            <ChevronRight size={15} />
                          </button>
                        ) : (
                          <span className="w-full sm:w-auto min-h-[44px] justify-center px-4 py-3 rounded-xl bg-black/10 dark:bg-white/5 text-text-muted text-xs font-mono flex items-center gap-1.5 opacity-70 cursor-not-allowed">
                            <Lock size={14} className="shrink-0" />
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
                            className="w-full sm:w-auto min-h-[46px] justify-center px-5 py-3 rounded-xl bg-emerald-500 text-crust font-heading font-black text-xs uppercase tracking-widest hover:bg-emerald-400 transition-all flex items-center gap-1.5 cursor-pointer"
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

              {activeSubView === 'assignment' && moduleHasAssignment(activeModule.moduleNumber) && currentModProg.quizPassed && (() => {
                const fieldValues = currentModProg.assignmentFieldValues || {};
                const writtenText = currentModProg.assignmentWrittenResponse || '';
                const liveCheck = runModuleAssignmentAutoCheck(activeModule, fieldValues, writtenText);
                const totalCriteriaCount = liveCheck.criteriaResults.length;
                const passedCriteriaCount = liveCheck.criteriaResults.filter((c) => c.passed).length;
                const readinessPercent = totalCriteriaCount > 0 ? Math.round((passedCriteriaCount / totalCriteriaCount) * 100) : 0;

                const currentWords = writtenText
                  .trim()
                  .split(/\s+/)
                  .filter(Boolean).length;
                const wordProgressPct = Math.min(
                  100,
                  Math.round((currentWords / Math.max(1, activeModule.assignment.minWordCount)) * 100)
                );

                // Module-specific guided sentences per keyword group so learners can build their report interactively
                const getGuidedSentenceForGroup = (modNum: number, groupIdx: number): string => {
                  if (modNum === 2) {
                    if (groupIdx === 0) {
                      return '1. Autopsy Sampling & PMR: Because Amitriptyline exhibits marked postmortem redistribution from the lungs and myocardium (C/P ratio = 4.5), clamped peripheral femoral blood preserved in 1% NaF and 500 g of liver in Bottle II with a preservative control blank (Bottle IV) are mandatory.';
                    }
                    if (groupIdx === 1) {
                      return '2. Classical Deproteinization & pH Fractionation: Following Ammonium Sulphate or Stas-Otto deproteinization, Acid-Ether extraction separates strong acids (Salicylate via 5% NaHCO3) from weak acid barbiturates (Phenobarbital via 0.45 N NaOH), Alkaline-Chloroform isolates basic alkaloids, and Isoelectric extraction at pH 8.5–9.0 isolates amphoteric Morphine.';
                    }
                    return '3. Volatile & Inorganic Isolation: Acidic steam distillation and the Conway microdiffusion cell trap volatile cyanide (HCN) into alkaline NaOH, while membrane dialysis and electrodialysis isolate water-soluble Nitrite and Chlorate anions.';
                  }
                  if (modNum === 4) {
                    if (groupIdx === 0) {
                      return '1. Widmark & Liquor Estimation: The driver’s total body ethanol is 61.2 g and retrograde extrapolated BAC at crash time is 165 mg/100 mL (5.5× the 30 mg/100 mL statutory limit under Section 185 MV Act), quantified via HS-GC-FID, Henry’s 2100:1 breath law, and Kozelka-Hine/Cavett dichromate oxidation.';
                    }
                    if (groupIdx === 1) {
                      return '2. Metallic Poison Differentiation: In Victim 1, Reinsch test sublimate showing white octahedral As2O3 crystals and a Marsh test hair-pin mirror that dissolves readily in Sodium Hypochlorite (NaOCl) confirms Arsenic and excludes Antimony.';
                    }
                    return '3. Phosphine Confirmation: In Victim 2, blackening of Silver Nitrate (AgNO3) filter paper with a negative Lead Acetate strip (excluding putrefactive H2S) and positive Ammonium Molybdate test confirms lethal Phosphine (PH3) gas from Aluminium Phosphide.';
                  }
                  // Module 6
                  if (groupIdx === 0) {
                    return '1. Hair Segmental Chronology: At the standard posterior vertex scalp hair growth rate of 1.0 cm/month, the Arsenic and Thallium band between 4.0 cm and 6.0 cm from the root establishes chronic toxic exposure 4 to 6 months prior to collection.';
                  }
                  if (groupIdx === 1) {
                    return '2. Postmortem Fermentation Proof: Although decomposed femoral blood showed 70 mg/dL ethanol, the complete absence of ethanol in vitreous humor (0 mg/dL) and urinary Ethyl Glucuronide (EtG = 0.0 mg/L) proves postmortem microbial fermentation with no antemortem alcohol intake.';
                  }
                  return '3. Section 329 BNSS & Plant/Animal Toxinology Findings: Submitted under Section 329 BNSS (formerly Sec. 293 CrPC), Exhibit A confirms Argemone oil (Sanguinarine) Epidemic Dropsy, Exhibit B confirms Semecarpus anacardium (Bhilawa) false bruise, and Exhibit C requires Prazosin alpha-1 blockade for Red Scorpion envenomation; delayed death, metabolic elimination, or volatile/hydrolyzed toxins explain why true poisonings can yield a negative routine report.';
                };

                const handleAppendSentence = (sentence: string) => {
                  const trimmed = writtenText.trim();
                  const nextText = trimmed ? `${trimmed}\n\n${sentence}` : sentence;
                  handleAssignmentWrittenChange(nextText);
                };

                const handleLoadFullGuidedDraft = () => {
                  const fullDraft = activeModule.assignment.requiredKeywords
                    .map((_, idx) => getGuidedSentenceForGroup(activeModule.moduleNumber, idx))
                    .join('\n\n');
                  handleAssignmentWrittenChange(fullDraft);
                };

                return (
                  <div className="p-4 sm:p-8 space-y-6">
                    {/* Top Interactive Assignment Header & Live Readiness Tracker */}
                    <div className="p-5 rounded-2xl bg-base border border-black/10 dark:border-white/10 space-y-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-1 rounded-md bg-warning/15 border border-warning/30 text-[10px] font-mono font-black uppercase tracking-widest text-warning">
                            Step 3 • Interactive Case Assignment
                          </span>
                          <span className="text-[11px] font-mono text-text-muted">
                            Module 0{activeModule.moduleNumber}
                          </span>
                        </div>
                        {currentModProg.assignmentPassed ? (
                          <span className="px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-black flex items-center gap-1.5">
                            <CheckCircle2 size={14} />
                            <span>Assignment Completed & Verified (100%)</span>
                          </span>
                        ) : liveCheck.passed ? (
                          <span className="px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold">
                            ✓ Ready to Submit (All {totalCriteriaCount}/{totalCriteriaCount} Checks Met)
                          </span>
                        ) : (
                          <span className="px-3 py-1 rounded-full bg-warning/10 border border-warning/20 text-warning text-xs font-mono font-bold">
                            Live Progress: {passedCriteriaCount} / {totalCriteriaCount} Checks Ready ({readinessPercent}%)
                          </span>
                        )}
                      </div>

                      <h3 className="text-base sm:text-lg font-heading font-black text-text-main">
                        {activeModule.assignment.title.replace(/^Case Assignment \d+ \(Even Module\):\s*/i, '').replace(/Unit [I|V|X]+\s*/gi, '')}
                      </h3>

                      {/* Live Interactive Progress Bar */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-[11px] font-mono">
                          <span className="text-text-muted">Interactive Assignment Readiness</span>
                          <span className={readinessPercent === 100 ? 'text-emerald-400 font-black' : 'text-warning font-bold'}>
                            {readinessPercent}% Complete
                          </span>
                        </div>
                        <div className="w-full h-2.5 rounded-full bg-surface overflow-hidden border border-black/10 dark:border-white/10">
                          <div
                            className={`h-full transition-all duration-300 rounded-full ${
                              readinessPercent === 100 ? 'bg-emerald-500' : 'bg-warning'
                            }`}
                            style={{ width: `${readinessPercent}%` }}
                          />
                        </div>
                      </div>

                      {/* Case Scenario Card */}
                      <div className="p-4 rounded-xl bg-surface border-l-4 border-warning space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <strong className="text-warning font-mono uppercase text-[10px] tracking-wider flex items-center gap-1.5">
                            <FlaskConical size={13} />
                            <span>Case Scenario & Lab Evidence Summary</span>
                          </strong>
                        </div>
                        <p className="text-xs sm:text-sm text-text-main leading-relaxed">
                          {activeModule.assignment.caseScenario}
                        </p>
                      </div>
                    </div>

                    {/* PART A: INTERACTIVE LAB CALCULATIONS & PROTOCOL CARDS */}
                    <div className="p-5 rounded-2xl bg-base border border-black/10 dark:border-white/10 space-y-4">
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-black/10 dark:border-white/10 pb-3">
                        <div>
                          <span className="text-[10px] font-mono font-black uppercase tracking-widest text-warning block">
                            Part A • Interactive Lab Workstation
                          </span>
                          <h4 className="text-sm sm:text-base font-heading font-black text-text-main">
                            Quantitative Calculations & Protocol Selection
                          </h4>
                        </div>
                        <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-surface border border-black/10 dark:border-white/10 text-text-main">
                          {
                            activeModule.assignment.structuredFields.filter((f) => {
                              const c = liveCheck.criteriaResults.find((r) => r.criterionId === `field-${f.id}`);
                              return c?.passed;
                            }).length
                          }{' '}
                          / {activeModule.assignment.structuredFields.length} Tasks Solved
                        </span>
                      </div>

                      <div className="grid grid-cols-1 gap-4">
                        {activeModule.assignment.structuredFields.map((field, fIdx) => {
                          const val = fieldValues[field.id] ?? '';
                          const hasVal = val.toString().trim().length > 0;
                          const fieldCriterion = liveCheck.criteriaResults.find(
                            (c) => c.criterionId === `field-${field.id}`
                          );
                          const isFieldCorrect = Boolean(fieldCriterion?.passed);

                          return (
                            <div
                              key={field.id}
                              className={`p-4 sm:p-5 rounded-xl border transition-all space-y-3 ${
                                isFieldCorrect
                                  ? 'bg-emerald-500/[0.06] border-emerald-500/35'
                                  : hasVal
                                    ? 'bg-amber-500/[0.06] border-amber-500/35'
                                    : 'bg-surface border-black/10 dark:border-white/10'
                              }`}
                            >
                              <div className="flex flex-wrap items-start justify-between gap-2">
                                <div className="flex items-start gap-2.5">
                                  <span
                                    className={`w-6 h-6 rounded-lg text-xs font-mono font-black flex items-center justify-center shrink-0 mt-0.5 ${
                                      isFieldCorrect
                                        ? 'bg-emerald-500 text-crust'
                                        : 'bg-warning/15 text-warning border border-warning/30'
                                    }`}
                                  >
                                    {isFieldCorrect ? <Check size={14} /> : fIdx + 1}
                                  </span>
                                  <div>
                                    <label className="text-xs sm:text-sm font-bold text-text-main block leading-snug">
                                      {field.label.replace(/Unit [I|V|X]+\s*/gi, '')}
                                    </label>
                                    <p className="text-[11px] text-text-muted mt-0.5">
                                      💡 {field.hint}
                                    </p>
                                  </div>
                                </div>

                                {isFieldCorrect ? (
                                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-black uppercase tracking-wider shrink-0">
                                    ✓ Verified
                                  </span>
                                ) : hasVal ? (
                                  <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-mono font-bold uppercase tracking-wider shrink-0">
                                    Check Value
                                  </span>
                                ) : (
                                  <span className="px-2.5 py-1 rounded-full bg-base text-text-muted text-[10px] font-mono uppercase tracking-wider shrink-0">
                                    Task {fIdx + 1}
                                  </span>
                                )}
                              </div>

                              {field.type === 'number' ? (
                                <div className="space-y-2.5 pl-0 sm:pl-8">
                                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                                    <div className="relative flex-1 flex items-center">
                                      <input
                                        type="number"
                                        step="any"
                                        value={val}
                                        onChange={(e) => handleAssignmentFieldChange(field.id, e.target.value)}
                                        placeholder={field.placeholder}
                                        className={`w-full min-h-[44px] bg-base border rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-mono font-bold text-text-main outline-none transition-colors ${
                                          isFieldCorrect
                                            ? 'border-emerald-500/50 focus:border-emerald-400'
                                            : 'border-black/15 dark:border-white/15 focus:border-warning'
                                        }`}
                                      />
                                      {field.unit && (
                                        <span className="ml-2 px-2.5 py-2.5 rounded-lg bg-base border border-black/10 dark:border-white/10 text-xs font-mono font-bold text-warning shrink-0">
                                          {field.unit}
                                        </span>
                                      )}
                                    </div>

                                    {!isFieldCorrect && (
                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleAssignmentFieldChange(field.id, String(field.expectedValue))
                                        }
                                        className="w-full sm:w-auto min-h-[44px] justify-center px-3.5 py-2.5 rounded-xl bg-warning/15 hover:bg-warning text-warning hover:text-crust border border-warning/30 text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
                                        title="Auto-calculate and fill the verified forensic value"
                                      >
                                        <Calculator size={13} className="shrink-0" />
                                        <span>
                                          Auto-Calculate ({field.expectedValue}
                                          {field.unit ? ` ${field.unit}` : ''})
                                        </span>
                                      </button>
                                    )}
                                  </div>

                                  {hasVal && !isFieldCorrect && (
                                    <p className="text-[11px] text-amber-400 font-medium">
                                      Expected result is <strong>{field.expectedValue}{field.unit ? ` ${field.unit}` : ''}</strong>. Click &ldquo;Auto-Calculate&rdquo; above or type <strong>{field.expectedValue}</strong>.
                                    </p>
                                  )}
                                </div>
                              ) : (
                                /* Interactive Clickable Lab Option Cards instead of raw dropdown */
                                <div className="grid grid-cols-1 gap-2 pl-0 sm:pl-8">
                                  {field.options?.map((opt, optIdx) => {
                                    const isSelected = val === opt;
                                    const isCorrectOption =
                                      opt.toLowerCase() === String(field.expectedValue).toLowerCase();
                                    return (
                                      <button
                                        key={opt}
                                        type="button"
                                        onClick={() => handleAssignmentFieldChange(field.id, opt)}
                                        className={`w-full text-left p-3 rounded-xl border text-xs transition-all flex items-start justify-between gap-3 cursor-pointer ${
                                          isSelected && isCorrectOption
                                            ? 'bg-emerald-500/15 border-emerald-500/50 text-text-main font-bold shadow-xs'
                                            : isSelected && !isCorrectOption
                                              ? 'bg-amber-500/15 border-amber-500/50 text-text-main font-semibold'
                                              : 'bg-base/80 hover:bg-base border-black/10 dark:border-white/10 text-text-muted hover:text-text-main hover:border-warning/40'
                                        }`}
                                      >
                                        <div className="flex items-start gap-2.5">
                                          <span
                                            className={`w-5 h-5 rounded-md text-[10px] font-mono font-black flex items-center justify-center shrink-0 mt-0.5 ${
                                              isSelected && isCorrectOption
                                                ? 'bg-emerald-500 text-crust'
                                                : isSelected && !isCorrectOption
                                                  ? 'bg-amber-500 text-crust'
                                                  : 'bg-surface border border-black/10 dark:border-white/10 text-text-muted'
                                            }`}
                                          >
                                            {String.fromCharCode(65 + optIdx)}
                                          </span>
                                          <span className="leading-relaxed">{opt}</span>
                                        </div>

                                        {isSelected && (
                                          <span
                                            className={`text-[10px] font-mono font-black uppercase px-2 py-0.5 rounded shrink-0 ${
                                              isCorrectOption
                                                ? 'bg-emerald-500/20 text-emerald-400'
                                                : 'bg-amber-500/20 text-amber-400'
                                            }`}
                                          >
                                            {isCorrectOption ? '✓ Correct' : 'Try Another'}
                                          </span>
                                        )}
                                      </button>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* PART B: INTERACTIVE GUIDED FORENSIC REPORT BUILDER */}
                    <div className="p-5 rounded-2xl bg-base border border-black/10 dark:border-white/10 space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-black/10 dark:border-white/10 pb-3">
                        <div>
                          <span className="text-[10px] font-mono font-black uppercase tracking-widest text-warning block">
                            Part B • Interactive Forensic Report Builder
                          </span>
                          <h4 className="text-sm sm:text-base font-heading font-black text-text-main">
                            Written Forensic Toxicology Case Opinion
                          </h4>
                        </div>

                        {/* Quick Report Builder Action Buttons */}
                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            onClick={handleLoadFullGuidedDraft}
                            className="px-3.5 py-2 rounded-xl bg-warning/15 hover:bg-warning text-warning hover:text-crust border border-warning/30 text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                            title="Populate a structured forensic opinion draft covering all 3 required scientific concepts"
                          >
                            <Sparkles size={13} />
                            <span>Insert Guided Report Draft</span>
                          </button>
                          {writtenText.trim().length > 0 && (
                            <button
                              type="button"
                              onClick={() => handleAssignmentWrittenChange('')}
                              className="px-3 py-2 rounded-xl bg-surface hover:bg-red-500/15 text-text-muted hover:text-red-400 border border-black/10 dark:border-white/10 text-xs font-mono transition-all cursor-pointer"
                            >
                              Clear Text
                            </button>
                          )}
                        </div>
                      </div>

                      <p className="text-xs text-text-muted leading-relaxed">
                        Write your case opinion below, or click the <strong>+ Add Finding to Report</strong> buttons on each concept card below to build your forensic report step by step.
                      </p>

                      {/* Interactive Scientific Concept Cards (Live Checklist + 1-Click Sentence/Keyword Insertion) */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {activeModule.assignment.requiredKeywords.map((group, idx) => {
                          const normalized = writtenText.toLowerCase();
                          const matchedTerms = group.terms.filter((t) =>
                            normalized.includes(t.toLowerCase())
                          );
                          const isCovered = matchedTerms.length > 0;

                          return (
                            <div
                              key={group.groupLabel}
                              className={`p-3.5 rounded-xl border transition-all flex flex-col justify-between gap-3 ${
                                isCovered
                                  ? 'bg-emerald-500/[0.06] border-emerald-500/35'
                                  : 'bg-surface border-black/10 dark:border-white/10'
                              }`}
                            >
                              <div className="space-y-2">
                                <div className="flex items-start justify-between gap-2">
                                  <span className="text-[11px] font-bold text-text-main leading-snug">
                                    Concept {idx + 1}: {group.groupLabel.replace(/Unit [I|V|X]+\s*/gi, '')}
                                  </span>
                                  <span
                                    className={`px-2 py-0.5 rounded text-[9px] font-mono font-black uppercase shrink-0 ${
                                      isCovered
                                        ? 'bg-emerald-500/20 text-emerald-400'
                                        : 'bg-warning/15 text-warning'
                                    }`}
                                  >
                                    {isCovered ? '✓ Covered' : 'Required'}
                                  </span>
                                </div>

                                {/* Clickable Keyword Chips */}
                                <div className="flex flex-wrap gap-1">
                                  {group.terms.slice(0, 5).map((term) => {
                                    const termPresent = normalized.includes(term.toLowerCase());
                                    return (
                                      <button
                                        key={term}
                                        type="button"
                                        onClick={() => {
                                          if (!termPresent) {
                                            const sep = writtenText.trim().length > 0 ? ' ' : '';
                                            handleAssignmentWrittenChange(`${writtenText}${sep}${term}`);
                                          }
                                        }}
                                        className={`px-2 py-0.5 rounded text-[10px] font-mono transition-all cursor-pointer ${
                                          termPresent
                                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold'
                                            : 'bg-base hover:bg-warning/15 text-text-muted hover:text-warning border border-black/10 dark:border-white/10'
                                        }`}
                                        title={termPresent ? `"${term}" is included in your report` : `Click to insert "${term}"`}
                                      >
                                        {termPresent ? `✓ ${term}` : `+ ${term}`}
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>

                              <button
                                type="button"
                                onClick={() =>
                                  handleAppendSentence(getGuidedSentenceForGroup(activeModule.moduleNumber, idx))
                                }
                                className={`w-full py-1.5 px-2.5 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1 cursor-pointer ${
                                  isCovered
                                    ? 'bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25 border border-emerald-500/30'
                                    : 'bg-warning/15 text-warning hover:bg-warning hover:text-crust border border-warning/30'
                                }`}
                              >
                                <span>{isCovered ? '+ Re-Insert Finding' : '+ Add Finding to Report'}</span>
                              </button>
                            </div>
                          );
                        })}
                      </div>

                      {/* Word Count Progress Bar */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className="text-text-muted">
                            Report Word Count:{' '}
                            <strong className={currentWords >= activeModule.assignment.minWordCount ? 'text-emerald-400' : 'text-text-main'}>
                              {currentWords} words
                            </strong>{' '}
                            (Minimum required: {activeModule.assignment.minWordCount} words)
                          </span>
                          <span
                            className={`text-[10px] font-bold uppercase ${
                              currentWords >= activeModule.assignment.minWordCount
                                ? 'text-emerald-400'
                                : 'text-warning'
                            }`}
                          >
                            {currentWords >= activeModule.assignment.minWordCount
                              ? '✓ Word Count Target Met'
                              : `${activeModule.assignment.minWordCount - currentWords} more words needed`}
                          </span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-surface overflow-hidden">
                          <div
                            className={`h-full transition-all duration-300 ${
                              currentWords >= activeModule.assignment.minWordCount ? 'bg-emerald-500' : 'bg-warning'
                            }`}
                            style={{ width: `${wordProgressPct}%` }}
                          />
                        </div>
                      </div>

                      <textarea
                        rows={6}
                        value={writtenText}
                        onChange={(e) => handleAssignmentWrittenChange(e.target.value)}
                        placeholder="Write your forensic toxicological opinion here, or click 'Insert Guided Report Draft' / '+ Add Finding to Report' above to build your response interactively..."
                        className="w-full bg-surface border border-black/10 dark:border-white/10 rounded-xl p-4 text-xs sm:text-sm text-text-main leading-relaxed outline-none focus:border-warning transition-colors"
                      />
                    </div>

                    {/* Live / Submitted Rubric Verification Breakdown */}
                    {currentModProg.assignmentCriteriaResults &&
                      currentModProg.assignmentCriteriaResults.length > 0 && (
                        <div className="p-5 rounded-2xl bg-base border border-black/10 dark:border-white/10 space-y-3">
                          <h4 className="text-xs font-mono font-black uppercase tracking-widest text-text-main">
                            Assignment Rubric Verification Summary
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            {currentModProg.assignmentCriteriaResults.map((crit) => (
                              <div
                                key={crit.criterionId}
                                className={`p-3 rounded-xl border text-xs flex items-start justify-between gap-3 ${
                                  crit.passed
                                    ? 'bg-emerald-500/10 border-emerald-500/25'
                                    : 'bg-amber-500/10 border-amber-500/25'
                                }`}
                              >
                                <div className="space-y-0.5">
                                  <p className="font-bold text-text-main">
                                    {crit.label.replace(/Unit [I|V|X]+\s*/gi, '')}
                                  </p>
                                  <p className="text-[11px] text-text-muted">{crit.feedback}</p>
                                </div>
                                <span
                                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-black shrink-0 ${
                                    crit.passed
                                      ? 'bg-emerald-500/20 text-emerald-400'
                                      : 'bg-amber-500/20 text-amber-400'
                                  }`}
                                >
                                  {crit.passed ? '✓ PASSED' : 'REVIEW'}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                    {/* Submit & Next Action Footer */}
                    <div className="p-4 sm:p-5 rounded-2xl bg-base border border-black/10 dark:border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                      <div className="text-xs text-text-muted">
                        {liveCheck.passed ? (
                          <span className="text-emerald-400 font-bold">
                            ✓ All {totalCriteriaCount} assignment checks are ready! Click the button to verify and complete Module 0{activeModule.moduleNumber}.
                          </span>
                        ) : (
                          <span>
                            Complete the remaining checks above ({passedCriteriaCount}/{totalCriteriaCount} ready), then click <strong>Verify & Complete Assignment</strong>.
                          </span>
                        )}
                      </div>
                      <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2.5 sm:gap-3">
                        <button
                          type="button"
                          onClick={handleSubmitAssignmentAutoCheck}
                          className={`w-full sm:w-auto min-h-[46px] justify-center px-6 py-3 rounded-xl font-heading font-black text-xs uppercase tracking-widest transition-all flex items-center gap-2 cursor-pointer ${
                            liveCheck.passed
                              ? 'bg-warning text-crust hover:bg-warning/90 shadow-lg shadow-warning/15'
                              : 'bg-surface border border-warning/40 text-warning hover:bg-warning hover:text-crust'
                          }`}
                        >
                          <CheckCircle2 size={16} className="shrink-0" />
                          <span>
                            {currentModProg.assignmentPassed
                              ? 'Re-Verify Case Assignment'
                              : 'Verify & Complete Case Assignment'}
                          </span>
                        </button>

                        {currentModStatus?.moduleComplete && (
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
                            className="w-full sm:w-auto min-h-[46px] justify-center px-5 py-3 rounded-xl bg-emerald-500 text-crust font-heading font-black text-xs uppercase tracking-widest hover:bg-emerald-400 transition-all flex items-center gap-1.5 cursor-pointer"
                          >
                            <span>
                              {activeModuleIdx < FORENSIC_TOXICOLOGY_MODULES.length - 1
                                ? `Next: Module 0${activeModuleIdx + 2}`
                                : 'All Modules Done! Open Certificate PDF Studio'}
                            </span>
                            <ChevronRight size={15} className="shrink-0" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })()}
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
