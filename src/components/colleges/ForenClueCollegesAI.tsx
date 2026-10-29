import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Fingerprint,
  X,
  Send,
  MapPin,
  GraduationCap,
  Award,
  ExternalLink,
  ChevronRight,
  ArrowUpRight,
  RotateCcw,
  Scale,
  Check,
  Building2,
  ShieldCheck,
  Loader2,
  Maximize2,
  Minimize2,
  SlidersHorizontal,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { College, CollegeCourse } from '@/types/college';
import { formatFee } from '@/pages/Colleges';
import { cn } from '@/lib/utils';

interface ForenClueCollegesAIProps {
  colleges: College[];
  onSelectCollege: (college: College) => void;
  compareIds: string[];
  onToggleCompare: (collegeId: string, e?: React.MouseEvent) => void;
  getFallbackBannerForCollege: (id: string) => string;
  getCollegeInitials: (college: College) => string;
  getDisplayInstitutionType: (college: College) => string;
  parseNumericMinFee: (college: College) => number;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  recommendedColleges?: College[];
  matchedCourseFilterLabel?: string;
  followUpSuggestions?: string[];
  timestamp: string;
}

const STARTER_INQUIRIES: { category: string; prompt: string }[] = [
  {
    category: 'State & Affordability',
    prompt: 'Give best affordable low fees colleges in Maharashtra',
  },
  {
    category: 'Budget & Specialization',
    prompt: 'Best colleges for M.Sc. Cyber Security under 50,000 fees',
  },
  {
    category: 'NFSU Flagship',
    prompt: 'Give NFSU best campus for M.Sc. Forensic Science',
  },
  {
    category: 'Public Institutes',
    prompt: 'Top Government colleges for B.Sc. Forensic Science',
  },
];

// Strict course-title predicates (matching course.name only to prevent false positives from generic syllabus sub-bullets)
const isCyberDigitalForensicsCourse = (course: CollegeCourse): boolean =>
  /\b(cyber\s*forensic|digital\s*(?:and\s*cyber\s*)?forensic|forensic\s*cyber|cyber\s*security|information\s*security|cyber\s*crime|cyber\s*law|multimedia\s*forensic|dfis)\b/i.test(
    course.name
  );

const isDnaSerologyCourse = (course: CollegeCourse): boolean =>
  /\b(dna|serology|forensic\s*biotech|biotechnology|forensic\s*biology|genetics|forensic\s*bioscience|molecular\s*biology)\b/i.test(
    course.name
  );

const isQuestionedDocumentsCourse = (course: CollegeCourse): boolean =>
  /\b(questioned\s*document|document\s*examination|forensic\s*document|fingerprint)\b/i.test(
    course.name
  );

const isToxicologyChemistryCourse = (course: CollegeCourse): boolean =>
  /\b(toxicology|forensic\s*chemistry|analytical\s*chemistry|forensic\s*pharmacy|pharmaceutical)\b/i.test(
    course.name
  );

const isPsychologyCriminologyCourse = (course: CollegeCourse): boolean =>
  /\b(criminology|forensic\s*psychology|clinical\s*psychology|neuropsychology|behavioural|behavioral|victimology)\b/i.test(
    course.name
  );

const isBscCourse = (course: CollegeCourse): boolean =>
  course.degreeLevel === 'Bachelor' || /\bb\.?\s*sc\b|\bbachelor/i.test(course.name);

const isMscCourse = (course: CollegeCourse): boolean =>
  course.degreeLevel === 'Master' || /\bm\.?\s*sc\b|\bmaster/i.test(course.name);

const isBtechMtechCourse = (course: CollegeCourse): boolean =>
  /\bb\.?\s*tech\b|\bm\.?\s*tech\b/i.test(course.name);

const isMbaCourse = (course: CollegeCourse): boolean =>
  /\bm\.?\s*b\.?\s*a\b/i.test(course.name);

const isPhdCourse = (course: CollegeCourse): boolean =>
  course.degreeLevel === 'Doctorate' || /\bph\.?\s*d\b|\bdoctorate|\bdoctoral/i.test(course.name);

const isDiplomaOrCertCourse = (course: CollegeCourse): boolean =>
  course.degreeLevel === 'Diploma' ||
  course.degreeLevel === 'Certificate' ||
  course.degreeLevel === 'Certificate/Diploma' ||
  /\bdiploma\b|\bpgd\b|\bcertificate\b/i.test(course.name);

const isCollegeNFSU = (college: College): boolean =>
  college.id.toLowerCase().startsWith('nfsu-') ||
  /^national forensic sciences university/i.test(college.name);

const isCollegeRRU = (college: College): boolean =>
  college.id.toLowerCase().startsWith('rru-') ||
  /rashtriya raksha university|raksha shakti/i.test(college.name);

const isCollegeGovernment = (college: College): boolean => {
  const t = (college.type || '').toLowerCase().trim();
  const accred = (college.accreditation || '').toLowerCase();
  return (
    t === 'government' ||
    t === 'central' ||
    t === 'state' ||
    t === 'institute of national importance' ||
    accred.includes('government') ||
    accred.includes('institution of national importance')
  );
};

const isCollegePrivate = (college: College): boolean => {
  const t = (college.type || '').toLowerCase().trim();
  return t === 'private' || t === 'deemed' || t === 'deemed university';
};

/**
 * Parse a fee string (from course.estimatedFees or college.feesRange) into both:
 * - `annualFee`: estimated annual tuition in INR
 * - `semesterFee`: estimated per-semester tuition in INR
 * - `rawNumbers`: all rupee numbers found in the fee string
 */
function extractFeeMetrics(
  feeStr?: string,
  country?: string
): { annualFee: number; semesterFee: number; rawFirstNumber: number } {
  if (!feeStr || !feeStr.trim()) {
    return {
      annualFee: Number.MAX_SAFE_INTEGER,
      semesterFee: Number.MAX_SAFE_INTEGER,
      rawFirstNumber: Number.MAX_SAFE_INTEGER,
    };
  }
  const formatted = formatFee(feeStr, country);
  const numberMatches = Array.from(formatted.matchAll(/₹?\s*([\d,]{3,})/g))
    .map(m => parseInt(m[1].replace(/,/g, ''), 10))
    .filter(n => !isNaN(n) && n >= 500 && n !== 2020 && n !== 2024 && n !== 2025 && n !== 2026);

  if (numberMatches.length === 0) {
    return {
      annualFee: Number.MAX_SAFE_INTEGER,
      semesterFee: Number.MAX_SAFE_INTEGER,
      rawFirstNumber: Number.MAX_SAFE_INTEGER,
    };
  }

  const firstNum = numberMatches[0];
  const isPerSemFirst =
    /₹?\s*[\d,]+\s*(?:\/\s*sem|per\s*sem|semester)/i.test(formatted) &&
    !/₹?\s*[\d,]+\s*(?:\/\s*year|per\s*year|annum).*semester/i.test(formatted);

  if (isPerSemFirst) {
    const semFee = firstNum;
    // Check if an explicit annual approximation is also in the string e.g. "(approx ₹1,30,000 / year)"
    const explicitYearMatch = formatted.match(/₹?\s*([\d,]{4,})\s*(?:\/\s*year|per\s*year|annum)/i);
    const annualFee = explicitYearMatch
      ? parseInt(explicitYearMatch[1].replace(/,/g, ''), 10)
      : semFee * 2;
    return { annualFee, semesterFee: semFee, rawFirstNumber: firstNum };
  }

  // Otherwise first number is annual or total course fee
  const explicitSemMatch = formatted.match(/₹?\s*([\d,]{3,})\s*(?:\/\s*sem|per\s*sem|semester)/i);
  const semesterFee = explicitSemMatch
    ? parseInt(explicitSemMatch[1].replace(/,/g, ''), 10)
    : Math.round(firstNum / 2);

  return {
    annualFee: firstNum,
    semesterFee,
    rawFirstNumber: firstNum,
  };
}

/**
 * Parse any user-specified fee budget from natural language query:
 * e.g. "under 50,000 fees", "below 50k", "under 1.5 lakh", "within 80000", "50,000 fees", "between 20000 and 60000"
 */
interface ParsedFeeBudget {
  maxBudgetINR: number;
  minBudgetINR?: number;
  isExplicitlyPerSemester: boolean;
  displayLabel: string;
}

function parseFeeBudgetFromQuery(queryText: string): ParsedFeeBudget | null {
  const q = queryText.toLowerCase();

  // Remove common non-fee numbers so "10+2", "12th", "3 years", "2 years", "top 5", "top 10" are not mistaken for fees
  const cleaned = q
    .replace(/\b10\s*\+\s*2\b/g, ' ')
    .replace(/\b(?:10th|12th)\b/g, ' ')
    .replace(/\btop\s+\d+\b/g, ' ')
    .replace(/\b\d+\s*(?:year|years|yr|yrs|sem|semester|months)\b/g, ' ');

  const isExplicitlyPerSemester = /\b(per\s*sem|\/\s*sem|per\s*semester|each\s*semester|semester\s*fee)\b/i.test(q);

  // 1. Check "between X and Y" or "X to Y"
  const rangeMatch = cleaned.match(
    /\b(?:between|from)?\s*₹?\s*(\d+(?:[\d,]*)(?:\.\d+)?)\s*(k|thousand|lakh|lakhs|lac|lacs)?\s*(?:to|and|-)\s*₹?\s*(\d+(?:[\d,]*)(?:\.\d+)?)\s*(k|thousand|lakh|lakhs|lac|lacs)?\b/i
  );
  if (rangeMatch) {
    const parseVal = (numStr: string, unit?: string) => {
      const n = parseFloat(numStr.replace(/,/g, ''));
      const u = (unit || '').toLowerCase();
      if (u === 'k' || u === 'thousand') return Math.round(n * 1000);
      if (u.startsWith('lak') || u.startsWith('lac')) return Math.round(n * 100000);
      return Math.round(n);
    };
    const v1 = parseVal(rangeMatch[1], rangeMatch[2] || rangeMatch[4]);
    const v2 = parseVal(rangeMatch[3], rangeMatch[4] || rangeMatch[2]);
    if (v2 >= 1000) {
      return {
        minBudgetINR: Math.min(v1, v2),
        maxBudgetINR: Math.max(v1, v2),
        isExplicitlyPerSemester,
        displayLabel: `₹${Math.min(v1, v2).toLocaleString('en-IN')} – ₹${Math.max(v1, v2).toLocaleString('en-IN')}`,
      };
    }
  }

  // 2. Check "<= / under / below / within / upto / less than / around / max X (k / lakh / fees)"
  const budgetRegex =
    /(?:under|below|less\s*than|within|upto|up\s*to|max|maximum|around|near|in|of|<=|<)?\s*₹?\s*(\d+(?:,\d+)*(?:\.\d+)?)\s*(k|thousand|lakh|lakhs|lac|lacs)?\s*(?:rs|inr|rupees|fees|fee|budget|per\s*year|per\s*sem|\/\s*year|\/\s*sem)?/gi;

  let match: RegExpExecArray | null;
  while ((match = budgetRegex.exec(cleaned)) !== null) {
    const fullMatch = match[0].trim();
    const rawNum = parseFloat(match[1].replace(/,/g, ''));
    const unit = (match[2] || '').toLowerCase();

    let valueINR = rawNum;
    if (unit === 'k' || unit === 'thousand') {
      valueINR = Math.round(rawNum * 1000);
    } else if (unit.startsWith('lak') || unit.startsWith('lac')) {
      valueINR = Math.round(rawNum * 100000);
    }

    // Must be a realistic tuition amount (>= ₹2,000) or accompanied by unit/fee keywords
    const hasFeeContext =
      /under|below|less\s*than|within|upto|up\s*to|max|around|budget|fee|fees|₹|rs|inr|lakh|lac|k\b/i.test(
        fullMatch
      ) || /under|below|less\s*than|within|upto|up\s*to|fee|fees|budget|₹/i.test(cleaned);

    if (valueINR >= 2000 && hasFeeContext) {
      return {
        maxBudgetINR: valueINR,
        isExplicitlyPerSemester,
        displayLabel: `₹${valueINR.toLocaleString('en-IN')}${isExplicitlyPerSemester ? ' / semester' : ''}`,
      };
    }
  }

  return null;
}

/**
 * Compute the best matching course and its fee metrics for a given college based on query predicates
 */
function getTargetCourseMetricsForCollege(
  college: College,
  coursePredicate?: (course: CollegeCourse) => boolean,
  fallbackPredicate?: (course: CollegeCourse) => boolean
): {
  matchedCourses: CollegeCourse[];
  bestAnnualFee: number;
  bestSemesterFee: number;
  bestFeeDisplay: string;
} {
  const allCourses = college.coursesOffered || [];
  let matched = coursePredicate ? allCourses.filter(coursePredicate) : allCourses;
  if (matched.length === 0 && fallbackPredicate) {
    matched = allCourses.filter(fallbackPredicate);
  }
  const coursesToEvaluate = matched.length > 0 ? matched : allCourses;

  let bestAnnualFee = Number.MAX_SAFE_INTEGER;
  let bestSemesterFee = Number.MAX_SAFE_INTEGER;
  let bestFeeDisplay = formatFee(college.feesRange, college.country) || '';

  for (const c of coursesToEvaluate) {
    if (c.estimatedFees) {
      const m = extractFeeMetrics(c.estimatedFees, college.country);
      if (m.annualFee < bestAnnualFee) {
        bestAnnualFee = m.annualFee;
        bestSemesterFee = m.semesterFee;
        bestFeeDisplay = formatFee(c.estimatedFees, college.country);
      }
    }
  }

  if (bestAnnualFee === Number.MAX_SAFE_INTEGER && college.feesRange) {
    const colMetrics = extractFeeMetrics(college.feesRange, college.country);
    bestAnnualFee = colMetrics.annualFee;
    bestSemesterFee = colMetrics.semesterFee;
    bestFeeDisplay = formatFee(college.feesRange, college.country);
  }

  return {
    matchedCourses: matched.length > 0 ? matched : allCourses,
    bestAnnualFee,
    bestSemesterFee,
    bestFeeDisplay: bestFeeDisplay || 'Refer to official prospectus',
  };
}

/**
 * Intelligent, Query-Targeted Forensic College Counselor Engine
 */
function analyzeCollegesQuery(
  queryText: string,
  colleges: College[],
  parseNumericMinFee: (college: College) => number,
  getDisplayInstitutionType: (college: College) => string
): {
  relevantColleges: College[];
  matchedCourseFilterLabel?: string;
  coursePredicate?: (course: CollegeCourse) => boolean;
  fallbackAnswer: string;
  followUpSuggestions: string[];
} {
  const q = queryText.toLowerCase().trim();

  // 1. Detect Explicit Named College Mentions (for direct college questions or comparisons)
  const explicitlyNamedColleges = colleges.filter(college => {
    const idClean = college.id.toLowerCase().replace(/-/g, ' ');
    const nameLower = college.name.toLowerCase();
    const shortLower = (college.shortName || '').toLowerCase();
    if (q.includes(nameLower) && nameLower.length > 5) return true;
    if (shortLower && shortLower.length > 4 && q.includes(shortLower)) return true;
    if (idClean.length > 5 && q.includes(idClean)) return true;
    // Specific popular short aliases
    if (college.id === 'ifs-mumbai' && /\bifs\s*mumbai\b/i.test(q)) return true;
    if (college.id === 'gifsa-aurangabad' && /\bgifsa\b|\bifs\s*aurangabad\b/i.test(q)) return true;
    if (college.id === 'gifs-nagpur' && /\bgifs\s*nagpur\b|\bifs\s*nagpur\b/i.test(q)) return true;
    if (college.id === 'nfsu-gandhinagar' && /\bnfsu\s*gandhinagar\b/i.test(q)) return true;
    if (college.id === 'nfsu-delhi' && /\bnfsu\s*delhi\b|\blnjn\b|\bnicfs\b/i.test(q)) return true;
    if (college.id === 'nfsu-goa' && /\bnfsu\s*goa\b/i.test(q)) return true;
    if (college.id === 'nfsu-bhopal' && /\bnfsu\s*bhopal\b/i.test(q)) return true;
    if (college.id === 'nfsu-pune' && /\bnfsu\s*pune\b/i.test(q)) return true;
    if (college.id === 'nfsu-tripura' && /\bnfsu\s*tripura\b/i.test(q)) return true;
    if (college.id === 'nfsu-dharwad' && /\bnfsu\s*dharwad\b/i.test(q)) return true;
    if (college.id === 'nfsu-guwahati' && /\bnfsu\s*guwahati\b/i.test(q)) return true;
    if (college.id === 'nfsu-manipur' && /\bnfsu\s*manipur\b/i.test(q)) return true;
    return false;
  });

  // 2. Detect Specialization Intent (Strict Course Name Matching)
  const wantsCyber =
    /\b(cyber|digital\s*forensic|information\s*security|computer\s*forensic|dfis|multimedia\s*forensic)\b/i.test(q);
  const wantsDna =
    /\b(dna|serology|genetics|forensic\s*biology|forensic\s*biotech|biotechnology)\b/i.test(q);
  const wantsDocuments =
    /\b(questioned\s*document|document\s*examination|fingerprint)\b/i.test(q);
  const wantsToxicology =
    /\b(toxicology|forensic\s*chemistry)\b/i.test(q);
  const wantsPsychologyCriminology =
    /\b(criminology|forensic\s*psychology|neuropsychology|behavioral|behavioural)\b/i.test(q);

  // 3. Detect Degree Level Intent
  const wantsMsc = /\b(m\.?\s*sc|master'?s?|post\s*graduate|pg\s+program|pg\s+degree)\b/i.test(q);
  const wantsBsc = /\b(b\.?\s*sc|bachelor'?s?|under\s*graduate|ug\s+program|ug\s+degree|after\s*12th|10\+2)\b/i.test(q);
  const wantsBtechMtech = /\b(b\.?\s*tech|m\.?\s*tech|engineering)\b/i.test(q);
  const wantsMba = /\b(m\.?\s*b\.?\s*a)\b/i.test(q);
  const wantsPhd = /\b(ph\.?\s*d|doctorate|doctoral)\b/i.test(q);
  const wantsDiploma = /\b(diploma|pg\s*diploma|pgd|certificate)\b/i.test(q);

  // 4. Detect Institution / Brand Intent
  const wantsNFSU = /\b(nfsu|national\s*forensic\s*sciences?\s*university|nicfs)\b/i.test(q);
  const wantsRRU = /\b(rru|rashtriya\s*raksha|raksha\s*shakti)\b/i.test(q);
  const wantsGovt = /\b(govt|government|public\s+university|central\s+university|state\s+govt)\b/i.test(q);
  const wantsPrivate = /\b(private)\b/i.test(q);

  // 5. Detect Specific Question Aspect (Eligibility, Entrance Exam, Comparison, Facilities, Fees)
  const parsedBudget = parseFeeBudgetFromQuery(queryText);
  const wantsLowFee =
    Boolean(parsedBudget) ||
    /\b(affordable|low\s*fee|low\s*cost|cheap|cheapest|budget|lowest\s*fee|less\s*fee|economical|minimum\s*fee)\b/i.test(
      q
    );
  const asksEligibility = /\b(eligibility|eligible|qualification|criteria|pcb|pcm|marks\s*required|who\s*can\s*apply)\b/i.test(q);
  const asksAdmissionOrExam = /\b(admission|entrance|exam|nfat|cuet|aifset|merit\s*based|how\s*to\s*apply|how\s*to\s*get\s*into)\b/i.test(q);
  const asksComparison = /\b(compare|vs|versus|difference\s*between|better\s*between)\b/i.test(q);
  const asksFacilities = /\b(facility|facilities|hostel|lab|laboratory|infrastructure|campus\s*life)\b/i.test(q);

  // 6. Detect State & City Mentions from actual `/colleges` dataset
  const allStates = Array.from(new Set(colleges.map(c => (c.state || '').trim()).filter(Boolean)));
  const allCities = Array.from(new Set(colleges.map(c => (c.city || '').trim()).filter(Boolean)));

  const matchedStates = allStates.filter(st => {
    const stLower = st.toLowerCase();
    return q.includes(stLower) || (stLower.includes('delhi') && /\b(delhi|ncr)\b/i.test(q));
  });

  const matchedCities = allCities.filter(ct => {
    const ctLower = ct.toLowerCase();
    if (ctLower.length < 3) return false;
    const escaped = ctLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return new RegExp(`\\b${escaped}\\b`, 'i').test(q);
  });

  const hasAliasAurangabad = /\b(aurangabad|sambhajinagar)\b/i.test(q);
  const hasAliasBangalore = /\b(bangalore|bengaluru)\b/i.test(q);
  const hasAliasDelhiNcr = /\b(delhi\s*ncr|ncr)\b/i.test(q);
  const hasLocationFilter =
    matchedStates.length > 0 ||
    matchedCities.length > 0 ||
    hasAliasAurangabad ||
    hasAliasBangalore ||
    hasAliasDelhiNcr;

  const matchesLocationStrict = (college: College): boolean => {
    if (!hasLocationFilter) return true;
    const cState = (college.state || '').toLowerCase();
    const cCity = (college.city || '').toLowerCase();
    const cAddr = (college.address || '').toLowerCase();
    const cName = (college.name || '').toLowerCase();

    for (const st of matchedStates) {
      if (cState === st.toLowerCase() || cState.includes(st.toLowerCase())) return true;
    }
    for (const ct of matchedCities) {
      const ctL = ct.toLowerCase();
      if (cCity.includes(ctL) || cAddr.includes(ctL) || cName.includes(ctL)) return true;
    }
    if (hasAliasAurangabad && /aurangabad|sambhajinagar/i.test(`${cCity} ${cAddr} ${cName}`)) {
      return true;
    }
    if (hasAliasBangalore && /bangalore|bengaluru/i.test(`${cCity} ${cAddr} ${cName}`)) {
      return true;
    }
    if (
      hasAliasDelhiNcr &&
      /delhi|noida|greater noida|gurugram|gurgaon|faridabad|ghaziabad|sonipat|panipat|rohtak/i.test(
        `${cState} ${cCity} ${cAddr}`
      )
    ) {
      return true;
    }
    return false;
  };

  // Build Human-Readable Filter Label & Course Predicates
  const degreeLabel = wantsMsc
    ? 'M.Sc.'
    : wantsBsc
      ? 'B.Sc.'
      : wantsBtechMtech
        ? 'B.Tech./M.Tech.'
        : wantsMba
          ? 'MBA'
          : wantsPhd
            ? 'Ph.D.'
            : wantsDiploma
              ? 'PG Diploma/Certificate'
              : '';

  const specLabel = wantsCyber
    ? 'Cyber Security & Digital Forensics'
    : wantsDna
      ? 'DNA & Serology'
      : wantsDocuments
        ? 'Questioned Documents & Fingerprints'
        : wantsToxicology
          ? 'Forensic Toxicology & Chemistry'
          : wantsPsychologyCriminology
            ? 'Criminology & Forensic Psychology'
            : 'Forensic Science';

  const fullProgramLabel = [degreeLabel, specLabel].filter(Boolean).join(' ');

  const filterBadgeParts: string[] = [];
  if (degreeLabel || wantsCyber || wantsDna || wantsDocuments || wantsToxicology || wantsPsychologyCriminology) {
    filterBadgeParts.push(fullProgramLabel);
  }
  if (parsedBudget) {
    filterBadgeParts.push(`≤ ${parsedBudget.displayLabel}`);
  }
  const matchedCourseFilterLabel = filterBadgeParts.length > 0 ? filterBadgeParts.join(' • ') : undefined;

  const matchesSpecializationCourse = (course: CollegeCourse): boolean => {
    if (wantsCyber && !isCyberDigitalForensicsCourse(course)) return false;
    if (wantsDna && !isDnaSerologyCourse(course)) return false;
    if (wantsDocuments && !isQuestionedDocumentsCourse(course)) return false;
    if (wantsToxicology && !isToxicologyChemistryCourse(course)) return false;
    if (wantsPsychologyCriminology && !isPsychologyCriminologyCourse(course)) return false;
    return true;
  };

  const matchesDegreeCourse = (course: CollegeCourse): boolean => {
    if (wantsMsc && !isMscCourse(course)) return false;
    if (wantsBsc && !isBscCourse(course)) return false;
    if (wantsBtechMtech && !isBtechMtechCourse(course)) return false;
    if (wantsMba && !isMbaCourse(course)) return false;
    if (wantsPhd && !isPhdCourse(course)) return false;
    if (wantsDiploma && !isDiplomaOrCertCourse(course)) return false;
    return true;
  };

  const hasSpecializationFilter =
    wantsCyber || wantsDna || wantsDocuments || wantsToxicology || wantsPsychologyCriminology;
  const hasDegreeFilter =
    wantsMsc || wantsBsc || wantsBtechMtech || wantsMba || wantsPhd || wantsDiploma;

  const combinedCoursePredicate = (course: CollegeCourse): boolean => {
    return matchesSpecializationCourse(course) && matchesDegreeCourse(course);
  };

  const activeCoursePredicate =
    hasSpecializationFilter && hasDegreeFilter
      ? combinedCoursePredicate
      : hasSpecializationFilter
        ? matchesSpecializationCourse
        : hasDegreeFilter
          ? matchesDegreeCourse
          : undefined;

  // CASE A: User explicitly asked to compare or inspect specific named college(s) (and didn't ask a general list query)
  if (explicitlyNamedColleges.length > 0 && (asksComparison || explicitlyNamedColleges.length <= 3) && !wantsLowFee && !hasLocationFilter) {
    const targetList = explicitlyNamedColleges.slice(0, 4);
    const lines: string[] = [];

    if (targetList.length >= 2) {
      lines.push(
        `### Comparison: ${targetList.map(c => c.shortName || c.name).join(' vs ')}\nHere is the side-by-side comparison from our verified **/colleges** directory:`
      );
    } else {
      const c = targetList[0];
      lines.push(
        `### ${c.name} (${c.city}, ${c.state})\nHere are the complete verified details for **${c.name}** from our **/colleges** directory:`
      );
    }

    targetList.forEach((c, idx) => {
      const m = getTargetCourseMetricsForCollege(c, activeCoursePredicate, matchesSpecializationCourse);
      const coursesList = m.matchedCourses
        .slice(0, 5)
        .map(
          co =>
            `  - **${co.name}** (${co.duration}) — *Fees:* ${formatFee(co.estimatedFees, c.country) || 'Check prospectus'}${co.eligibility ? ` | *Eligibility:* ${co.eligibility}` : ''}`
        )
        .join('\n');

      lines.push(
        `\n#### ${idx + 1}. ${c.name} — *${c.city}, ${c.state}*\n` +
          `- **Institution Category:** ${getDisplayInstitutionType(c)}${c.accreditation ? ` (${c.accreditation})` : ''}\n` +
          `- **Overall Fees Range:** ${formatFee(c.feesRange, c.country) || m.bestFeeDisplay}\n` +
          (c.admissionProcess ? `- **Admission Process:** ${c.admissionProcess}\n` : '') +
          (c.ranking ? `- **Ranking / Standing:** ${c.ranking}\n` : '') +
          (coursesList ? `- **Courses Offered:**\n${coursesList}\n` : '') +
          (asksFacilities && c.facilities?.length
            ? `- **Key Campus Facilities:** ${c.facilities.slice(0, 5).join(', ')}\n`
            : '')
      );
    });

    return {
      relevantColleges: targetList,
      matchedCourseFilterLabel,
      coursePredicate: activeCoursePredicate,
      fallbackAnswer: lines.join('\n'),
      followUpSuggestions: [
        'Best colleges for M.Sc. Cyber Security under 50,000 fees',
        'Give best affordable low fees colleges in Maharashtra',
        'Top Government colleges for B.Sc. Forensic Science',
      ],
    };
  }

  // STEP 1: Filter colleges by program (specialization + degree), location, and institution type
  let programMatchedColleges = colleges.filter(college => {
    if (!matchesLocationStrict(college)) return false;
    if (wantsNFSU && !isCollegeNFSU(college)) return false;
    if (wantsRRU && !isCollegeRRU(college)) return false;
    if (wantsGovt && !wantsPrivate && !isCollegeGovernment(college)) return false;
    if (wantsPrivate && !wantsGovt && !isCollegePrivate(college)) return false;

    if (hasSpecializationFilter && hasDegreeFilter) {
      return (college.coursesOffered || []).some(combinedCoursePredicate);
    }
    if (hasSpecializationFilter) {
      return (college.coursesOffered || []).some(matchesSpecializationCourse);
    }
    if (hasDegreeFilter) {
      return (college.coursesOffered || []).some(matchesDegreeCourse);
    }
    return true;
  });

  // If both specialization AND degree were requested and 0 had a single combined course, check specialization
  if (programMatchedColleges.length === 0 && hasSpecializationFilter && hasDegreeFilter) {
    programMatchedColleges = colleges.filter(college => {
      if (!matchesLocationStrict(college)) return false;
      if (wantsNFSU && !isCollegeNFSU(college)) return false;
      if (wantsRRU && !isCollegeRRU(college)) return false;
      if (wantsGovt && !wantsPrivate && !isCollegeGovernment(college)) return false;
      if (wantsPrivate && !wantsGovt && !isCollegePrivate(college)) return false;
      return (college.coursesOffered || []).some(matchesSpecializationCourse);
    });
  }

  // Enrich each candidate with its exact target course metrics (course-specific annual & per-semester fee)
  const enrichedCandidates = programMatchedColleges.map(college => {
    const courseMetrics = getTargetCourseMetricsForCollege(
      college,
      activeCoursePredicate,
      hasSpecializationFilter ? matchesSpecializationCourse : undefined
    );
    const minFee =
      courseMetrics.bestAnnualFee < Number.MAX_SAFE_INTEGER
        ? courseMetrics.bestAnnualFee
        : parseNumericMinFee(college);
    const semFee =
      courseMetrics.bestSemesterFee < Number.MAX_SAFE_INTEGER
        ? courseMetrics.bestSemesterFee
        : Math.round(minFee / 2);

    return {
      college,
      matchedCourses: courseMetrics.matchedCourses,
      annualFee: minFee,
      semesterFee: semFee,
      bestFeeDisplay: courseMetrics.bestFeeDisplay,
    };
  });

  // STEP 2: Handle Explicit Numeric Fee Budget Queries (e.g. "best colleges for msc cyber security under 50,000 fees")
  if (parsedBudget) {
    const maxB = parsedBudget.maxBudgetINR;
    const minB = parsedBudget.minBudgetINR || 0;

    // 1) Strictly within annual fee budget (annualFee <= maxB)
    const strictAnnualMatches = enrichedCandidates
      .filter(item => item.annualFee >= minB && item.annualFee <= maxB)
      .sort((a, b) => a.annualFee - b.annualFee);

    // 2) Within per-semester fee budget (semesterFee <= maxB, or within 30% buffer like ₹60,000–₹65,000/sem for ₹50,000 target)
    const semesterOrNearMatches = enrichedCandidates
      .filter(
        item =>
          !strictAnnualMatches.some(s => s.college.id === item.college.id) &&
          (item.semesterFee <= maxB * 1.3 || item.annualFee <= maxB * 1.5)
      )
      .sort((a, b) => a.annualFee - b.annualFee);

    // 3) Overall lowest-fee colleges for this exact program if user's budget is very tight
    const lowestFeeForProgram = [...enrichedCandidates].sort((a, b) => a.annualFee - b.annualFee);

    const locDisplay =
      matchedCities.length > 0 || matchedStates.length > 0
        ? ` in ${[...matchedCities, ...matchedStates].join(', ')}`
        : '';

    const lines: string[] = [];
    let selectedItems = strictAnnualMatches;

    if (strictAnnualMatches.length > 0) {
      lines.push(
        `### ${fullProgramLabel} Colleges Under ${parsedBudget.displayLabel}${locDisplay}\nFound **${strictAnnualMatches.length}** verified ${strictAnnualMatches.length === 1 ? 'institution' : 'institutions'} in our **/colleges** directory offering **${fullProgramLabel}** with annual tuition fees within **${parsedBudget.displayLabel}**:`
      );

      strictAnnualMatches.slice(0, 5).forEach((item, idx) => {
        const c = item.college;
        const courseList = item.matchedCourses
          .slice(0, 2)
          .map(
            co =>
              `${co.name} — **${formatFee(co.estimatedFees, c.country) || item.bestFeeDisplay}**`
          )
          .join(' • ');

        lines.push(
          `\n**${idx + 1}. ${c.name}** (*${c.city}, ${c.state}*)\n` +
            `- **Program & Fee:** ${courseList}\n` +
            `- **Institution Type:** ${getDisplayInstitutionType(c)}\n` +
            (c.admissionProcess ? `- **Admission:** ${c.admissionProcess}\n` : '')
        );
      });

      // Also mention per-semester matches if helpful
      if (strictAnnualMatches.length < 3 && semesterOrNearMatches.length > 0) {
        lines.push(
          `\n#### Additional Options With Per-Semester Fees Near ${parsedBudget.displayLabel}:`
        );
        semesterOrNearMatches.slice(0, 3).forEach(item => {
          const c = item.college;
          const courseName = item.matchedCourses[0]?.name || fullProgramLabel;
          lines.push(
            `- **${c.name}** (${c.city}): *${courseName}* — **${item.bestFeeDisplay}** (~₹${item.semesterFee.toLocaleString('en-IN')}/semester)`
          );
        });
        selectedItems = [...strictAnnualMatches, ...semesterOrNearMatches].slice(0, 6);
      }
    } else if (semesterOrNearMatches.length > 0) {
      // No college has FULL YEAR fee <= maxB (e.g., ₹50,000/year for M.Sc. Cyber Security),
      // but several colleges have PER-SEMESTER fees <= ₹50,000–₹65,000 or annual fees slightly above ₹50,000!
      selectedItems = semesterOrNearMatches.slice(0, 6);
      lines.push(
        `### ${fullProgramLabel} Colleges Targeting ${parsedBudget.displayLabel} Budget${locDisplay}\nIn our verified **/colleges** directory, no institution offers **${fullProgramLabel}** with a full-year tuition fee under **₹${maxB.toLocaleString('en-IN')}/year**, because specialized postgraduate cyber/forensic lab programs start at **~₹20,000–₹65,000 per semester**.\n\nHowever, here are the **most affordable ${fullProgramLabel} colleges** where the **per-semester fee is around or under ${parsedBudget.displayLabel}** (ranked from lowest to highest fee):`
      );

      selectedItems.slice(0, 5).forEach((item, idx) => {
        const c = item.college;
        const courseList = item.matchedCourses
          .slice(0, 2)
          .map(
            co =>
              `${co.name} (**${formatFee(co.estimatedFees, c.country) || item.bestFeeDisplay}**)`
          )
          .join(' • ');

        lines.push(
          `\n**${idx + 1}. ${c.name}** (*${c.city}, ${c.state}*)\n` +
            `- **Target Program & Fee:** ${courseList}\n` +
            `- **Fee Comparison:** ~₹${item.semesterFee.toLocaleString('en-IN')} / semester (₹${item.annualFee.toLocaleString('en-IN')} / year)\n` +
            `- **Category:** ${getDisplayInstitutionType(c)}\n` +
            (c.admissionProcess ? `- **Admission:** ${c.admissionProcess}\n` : '')
        );
      });
    } else {
      // Even per-semester fees are higher than maxB; show the absolute lowest-fee options for that program and explain clearly
      selectedItems = lowestFeeForProgram.slice(0, 5);
      const lowestFeeVal = selectedItems[0]?.annualFee;
      lines.push(
        `### Lowest-Fee ${fullProgramLabel} Colleges (Compared to Your ${parsedBudget.displayLabel} Budget)${locDisplay}\nNo institution in our **/colleges** directory offers **${fullProgramLabel}** under **${parsedBudget.displayLabel}**${lowestFeeVal && lowestFeeVal < Number.MAX_SAFE_INTEGER ? ` (the most affordable verified option starts at **₹${lowestFeeVal.toLocaleString('en-IN')}/year** or **~₹${selectedItems[0].semesterFee.toLocaleString('en-IN')}/semester**)` : ''}.\n\nHere are the **lowest-fee institutions offering ${fullProgramLabel}** ranked by affordability:`
      );

      selectedItems.forEach((item, idx) => {
        const c = item.college;
        const courseList = item.matchedCourses
          .slice(0, 2)
          .map(
            co =>
              `${co.name} (**${formatFee(co.estimatedFees, c.country) || item.bestFeeDisplay}**)`
          )
          .join(' • ');

        lines.push(
          `\n**${idx + 1}. ${c.name}** (*${c.city}, ${c.state}*)\n` +
            `- **Program & Fee:** ${courseList}\n` +
            `- **Category:** ${getDisplayInstitutionType(c)}\n` +
            (c.admissionProcess ? `- **Admission:** ${c.admissionProcess}\n` : '')
        );
      });
    }

    return {
      relevantColleges: selectedItems.map(i => i.college),
      matchedCourseFilterLabel,
      coursePredicate: activeCoursePredicate,
      fallbackAnswer: lines.join('\n'),
      followUpSuggestions: [
        `Best Government colleges for ${fullProgramLabel}`,
        'Give best affordable low fees colleges in Maharashtra',
        'Give NFSU best campus for M.Sc. Forensic Science',
      ],
    };
  }

  // STEP 3: General / Non-Numeric-Budget Scoring & Query-Specific Answer Synthesis
  const queryTokens = q
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(
      w =>
        w.length > 2 &&
        ![
          'give',
          'best',
          'for',
          'the',
          'and',
          'with',
          'which',
          'what',
          'are',
          'top',
          'colleges',
          'college',
          'university',
          'universities',
          'institute',
          'institutes',
          'from',
          'page',
          'show',
          'tell',
          'offer',
          'offers',
          'offering',
          'india',
        ].includes(w)
    );

  const scored = enrichedCandidates.map(item => {
    const { college, matchedCourses, annualFee } = item;
    let score = 10;
    const nameLower = `${college.name} ${college.shortName || ''} ${college.id}`.toLowerCase();

    score += matchedCourses.length * 12;

    for (const token of queryTokens) {
      if (nameLower.includes(token)) score += 22;
      else if (
        (college.city || '').toLowerCase().includes(token) ||
        (college.state || '').toLowerCase().includes(token)
      ) {
        score += 14;
      } else if (
        asksAdmissionOrExam &&
        (college.admissionProcess || '').toLowerCase().includes(token)
      ) {
        score += 25;
      }
    }

    if (isCollegeNFSU(college)) {
      score += 20;
      if (college.id === 'nfsu-gandhinagar') score += 35;
      else if (college.id === 'nfsu-delhi') score += 28;
      else if (
        ['nfsu-goa', 'nfsu-bhopal', 'nfsu-pune', 'nfsu-dharwad', 'nfsu-tripura'].includes(college.id)
      ) {
        score += 15;
      }
    } else if (isCollegeRRU(college)) {
      score += 18;
    } else if (isCollegeGovernment(college)) {
      score += 14;
    }

    if (college.featured) score += 8;

    if (wantsLowFee) {
      if (annualFee <= 15000) score += 70;
      else if (annualFee <= 45000) score += 50;
      else if (annualFee <= 90000) score += 30;
      else if (annualFee <= 140000) score += 10;
      else score -= 25;
    }

    return { ...item, score };
  });

  scored.sort((a, b) => {
    if (wantsLowFee) {
      if (a.annualFee !== b.annualFee) return a.annualFee - b.annualFee;
    }
    if (b.score !== a.score) return b.score - a.score;
    return a.annualFee - b.annualFee;
  });

  const topItems = scored.slice(0, 6);
  const topColleges = topItems.map(item => item.college);

  const locDisplay =
    matchedCities.length > 0 || matchedStates.length > 0
      ? [...matchedCities, ...matchedStates].join(', ')
      : hasAliasAurangabad
        ? 'Chhatrapati Sambhajinagar (Aurangabad)'
        : hasAliasBangalore
          ? 'Bengaluru'
          : hasAliasDelhiNcr
            ? 'Delhi-NCR'
            : '';

  const lines: string[] = [];

  if (topItems.length === 0) {
    lines.push(
      `### No Exact Directory Match for "${queryText}"\nNo institutions in the current **/colleges** directory matched all of those specific filters simultaneously${locDisplay ? ` in **${locDisplay}**` : ''}. Try broadening your location, fee limit, or degree filter.`
    );
  } else if (asksEligibility) {
    lines.push(
      `### Eligibility & Academic Criteria for ${fullProgramLabel}${locDisplay ? ` in ${locDisplay}` : ''}\nHere are the official eligibility requirements and offering institutions from our **/colleges** directory:`
    );
  } else if (asksAdmissionOrExam) {
    lines.push(
      `### Admission Process & Entrance Exams for ${fullProgramLabel}${locDisplay ? ` in ${locDisplay}` : ''}\nHere is how admissions work at the top matching institutions in our **/colleges** directory:`
    );
  } else if (wantsLowFee) {
    lines.push(
      `### Most Affordable ${fullProgramLabel} Colleges${locDisplay ? ` in ${locDisplay}` : ''}\nRanked from **lowest tuition fees** to highest based on verified **/colleges** data (${scored.length} matching ${scored.length === 1 ? 'institute' : 'institutes'}):`
    );
  } else if (wantsNFSU) {
    lines.push(
      `### Best NFSU Campuses for ${fullProgramLabel}\n**National Forensic Sciences University (NFSU)** (*Institution of National Importance, Ministry of Home Affairs, Govt. of India*) offers the following top campuses for **${fullProgramLabel}**:`
    );
  } else {
    lines.push(
      `### Best Colleges for ${fullProgramLabel}${locDisplay ? ` in ${locDisplay}` : ''}\nShowing **only** verified institutions from our **/colleges** directory that offer **${fullProgramLabel}** (${scored.length} verified ${scored.length === 1 ? 'institute' : 'institutes'} found):`
    );
  }

  topItems.slice(0, 5).forEach((item, idx) => {
    const c = item.college;
    const coursesToShow = item.matchedCourses.slice(0, 3);
    const courseSummary = coursesToShow
      .map(
        co =>
          `${co.name}${co.estimatedFees ? ` (**${formatFee(co.estimatedFees, c.country)}**)` : ''}${asksEligibility && co.eligibility ? ` — *Eligibility: ${co.eligibility}*` : ''}`
      )
      .join(' • ');

    lines.push(
      `\n**${idx + 1}. ${c.name}** (*${c.city}, ${c.state}*)\n` +
        `- **Type:** ${getDisplayInstitutionType(c)}\n` +
        `- **Tuition Fees:** ${item.bestFeeDisplay}\n` +
        (courseSummary ? `- **Matching Programs:** ${courseSummary}\n` : '') +
        (c.admissionProcess ? `- **Admission:** ${c.admissionProcess}\n` : '')
    );
  });

  const followUps: string[] = [];
  if (!parsedBudget) {
    followUps.push(`Best colleges for ${fullProgramLabel} under 50,000 fees`);
  }
  if (!wantsNFSU) {
    followUps.push('Give NFSU best campus for M.Sc. Forensic Science');
  }
  if (!matchedStates.includes('Maharashtra')) {
    followUps.push('Give best affordable low fees colleges in Maharashtra');
  }
  if (!wantsGovt) {
    followUps.push('Top Government colleges for B.Sc. Forensic Science');
  }

  return {
    relevantColleges: topColleges,
    matchedCourseFilterLabel,
    coursePredicate: activeCoursePredicate,
    fallbackAnswer: lines.join('\n'),
    followUpSuggestions: followUps.slice(0, 3),
  };
}

export const ForenClueCollegesAI: React.FC<ForenClueCollegesAIProps> = ({
  colleges,
  onSelectCollege,
  compareIds,
  onToggleCompare,
  getFallbackBannerForCollege,
  getCollegeInitials,
  getDisplayInstitutionType,
  parseNumericMinFee,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const latestMessageTopRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to the TOP of the new query/response so results are read from top to bottom
  useEffect(() => {
    if (!isOpen || messages.length === 0) return;

    const timer = setTimeout(() => {
      if (messages.length <= 2 && scrollContainerRef.current) {
        scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (latestMessageTopRef.current) {
        latestMessageTopRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 60);

    return () => clearTimeout(timer);
  }, [messages, isOpen]);

  const handleSendQuestion = async (questionText?: string) => {
    const query = (questionText ?? input).trim();
    if (!query || isLoading) return;

    if (!questionText) {
      setInput('');
    }

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      // 1. Run query-targeted analysis on `/colleges` dataset (including exact fee budget, degree, specialization, location)
      const localAnalysis = analyzeCollegesQuery(
        query,
        colleges,
        parseNumericMinFee,
        getDisplayInstitutionType
      );

      // 2. Only send strictly matched colleges in `collegesContext`
      const strictCandidateIds = new Set(localAnalysis.relevantColleges.map(c => c.id));
      const compactCollegesContext = localAnalysis.relevantColleges.map(c => {
        const matchingCourses = localAnalysis.coursePredicate
          ? (c.coursesOffered || []).filter(localAnalysis.coursePredicate)
          : c.coursesOffered || [];
        const coursesToUse = matchingCourses.length > 0 ? matchingCourses : c.coursesOffered || [];

        return {
          id: c.id,
          name: c.name,
          shortName: c.shortName,
          city: c.city,
          state: c.state,
          country: c.country,
          type: getDisplayInstitutionType(c),
          feesRange: formatFee(c.feesRange, c.country) || c.feesRange,
          minAnnualFeeINR:
            parseNumericMinFee(c) < Number.MAX_SAFE_INTEGER ? parseNumericMinFee(c) : undefined,
          accreditation: c.accreditation,
          ranking: c.ranking,
          admissionProcess: c.admissionProcess,
          courses: coursesToUse.map(co => ({
            name: co.name,
            degreeLevel: co.degreeLevel,
            duration: co.duration,
            fees: formatFee(co.estimatedFees, c.country) || co.estimatedFees,
            eligibility: co.eligibility,
          })),
        };
      });

      let finalAnswer = localAnalysis.fallbackAnswer;
      let recommendedColleges = localAnalysis.relevantColleges;
      let followUps = localAnalysis.followUpSuggestions;

      try {
        const response = await fetch('/api/colleges/ai-chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: query,
            collegesContext: compactCollegesContext,
            fallbackAnswer: localAnalysis.fallbackAnswer,
            fallbackCollegeIds: localAnalysis.relevantColleges.map(c => c.id),
            fallbackFollowUps: localAnalysis.followUpSuggestions,
            history: messages.slice(-4).map(m => ({
              role: m.role,
              content: m.content,
            })),
          }),
        });

        const contentType = response.headers.get('content-type') || '';
        if (response.ok && contentType.includes('application/json')) {
          const data = await response.json();
          if (data.answer && typeof data.answer === 'string' && data.answer.trim()) {
            finalAnswer = data.answer.trim();
          }
          if (Array.isArray(data.recommendedCollegeIds) && data.recommendedCollegeIds.length > 0) {
            const matchedFromIds = data.recommendedCollegeIds
              .map((id: string) =>
                colleges.find(
                  c =>
                    c.id.toLowerCase() === String(id).toLowerCase() ||
                    c.name.toLowerCase() === String(id).toLowerCase()
                )
              )
              .filter(
                (c): c is College =>
                  Boolean(c) && (strictCandidateIds.size === 0 || strictCandidateIds.has(c!.id))
              );

            if (matchedFromIds.length > 0) {
              recommendedColleges = matchedFromIds;
            }
          }
          if (Array.isArray(data.followUpSuggestions) && data.followUpSuggestions.length > 0) {
            followUps = data.followUpSuggestions.slice(0, 3);
          }
        }
      } catch {
        // Fallback to localAnalysis seamlessly
      }

      const assistantMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: finalAnswer,
        recommendedColleges: recommendedColleges.slice(0, 6),
        matchedCourseFilterLabel: localAnalysis.matchedCourseFilterLabel,
        followUpSuggestions: followUps,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages(prev => [...prev, assistantMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages([]);
    setInput('');
  };

  const hasCompareTray = compareIds.length > 0;

  const QUICK_FILTER_PROMPTS: { label: string; prompt: string }[] = [
    {
      label: 'Under ₹50,000 Fees',
      prompt: 'Best colleges for M.Sc. Cyber Security under 50,000 fees',
    },
    {
      label: 'Maharashtra Low Fee',
      prompt: 'Give best affordable low fees colleges in Maharashtra',
    },
    {
      label: 'NFSU Campuses',
      prompt: 'Give NFSU best campus for M.Sc. Forensic Science',
    },
    {
      label: 'Govt. B.Sc. Colleges',
      prompt: 'Top Government colleges for B.Sc. Forensic Science',
    },
  ];

  return (
    <>
      {/* Bright Professional Royal Blue Left-Bottom ForenClue AI Launcher */}
      <div
        className={cn(
          'fixed left-3 sm:left-5 z-[910] transition-all duration-300',
          hasCompareTray
            ? 'bottom-28 sm:bottom-24 landscape:max-lg:bottom-20'
            : 'bottom-4 sm:bottom-5 landscape:max-lg:bottom-3'
        )}
      >
        <AnimatePresence mode="wait">
          {!isOpen && (
            <motion.button
              key="forenclue-ai-minimal-launcher"
              type="button"
              initial={{ opacity: 0, y: 12, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.95 }}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsOpen(true)}
              aria-label="Open ForenClue AI Directory Advisor"
              className="group flex items-center gap-2.5 pl-2.5 pr-3.5 py-2 sm:pl-3 sm:pr-4 sm:py-2.5 landscape:max-lg:py-1.5 landscape:max-lg:pl-2 landscape:max-lg:pr-3 rounded-xl bg-gradient-to-r from-[#1E40AF] to-[#2563EB] hover:from-[#1D4ED8] hover:to-[#3B82F6] text-white border border-blue-400/50 shadow-[0_12px_28px_-6px_rgba(37,99,235,0.55)] cursor-pointer transition-all"
            >
              {/* Fingerprint Emblem */}
              <div className="relative w-8 h-8 sm:w-9 sm:h-9 landscape:max-lg:w-7 landscape:max-lg:h-7 rounded-lg bg-white/15 group-hover:bg-white/20 border border-white/25 text-white flex items-center justify-center transition-colors shrink-0">
                <Fingerprint size={18} className="stroke-[2]" />
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-[#1E40AF]" />
              </div>

              {/* Typography */}
              <div className="text-left leading-none">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs sm:text-[13px] font-semibold tracking-tight text-white">
                    ForenClue AI
                  </span>
                </div>
                <span className="block text-[10px] font-medium text-blue-100 mt-0.5 landscape:max-lg:hidden">
                  Admissions Advisor
                </span>
              </div>
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Bright Professional Daylight & Royal Blue ForenClue AI Console */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              'fixed z-[995] flex flex-col bg-[#F4F7FB] text-slate-900 border border-slate-200 shadow-[0_24px_60px_-12px_rgba(15,23,42,0.45)] overflow-hidden transition-all duration-200 font-sans',
              isExpanded
                ? 'inset-2 sm:inset-auto sm:left-5 sm:bottom-5 sm:w-[min(92vw,740px)] sm:h-[min(86dvh,760px)] rounded-2xl'
                : [
                    // Portrait Mobile & Desktop default
                    'inset-x-2.5 bottom-2.5 sm:inset-x-auto sm:left-5 sm:bottom-5 sm:w-[420px] md:w-[450px]',
                    'h-[min(80dvh,620px)] max-h-[calc(100dvh-1.25rem)]',
                    // Landscape Mobile & Small Tablet optimization
                    'landscape:max-lg:inset-x-auto landscape:max-lg:left-3 landscape:max-lg:bottom-2 landscape:max-lg:w-[min(94vw,640px)] landscape:max-lg:h-[calc(100dvh-1rem)]',
                    'rounded-2xl',
                  ]
            )}
            role="dialog"
            aria-label="ForenClue AI College Directory Advisor"
          >
            {/* Bright Executive Royal Blue Header Bar */}
            <div className="px-4 py-3 landscape:max-lg:py-2 bg-gradient-to-r from-[#1E3A8A] via-[#1D4ED8] to-[#2563EB] border-b border-blue-700/40 flex items-center justify-between gap-3 shrink-0 text-white">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 landscape:max-lg:w-7 landscape:max-lg:h-7 rounded-lg bg-white/15 border border-white/25 text-white flex items-center justify-center shrink-0 shadow-2xs">
                  <Fingerprint size={16} className="stroke-[2]" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-[13px] sm:text-sm font-semibold tracking-tight text-white truncate">
                      ForenClue AI
                    </h3>
                    <span className="text-blue-200/60" aria-hidden="true">
                      ·
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-blue-100">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span>Directory Advisor</span>
                    </span>
                  </div>
                  <p className="text-[11px] text-blue-100/85 truncate landscape:max-lg:hidden">
                    {colleges.length} verified institutions · Course & tuition analysis
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                {messages.length > 0 && (
                  <button
                    type="button"
                    onClick={handleResetChat}
                    title="Clear conversation"
                    aria-label="Clear conversation"
                    className="px-2.5 py-1 rounded-lg bg-white/15 hover:bg-white/25 border border-white/20 text-white text-[11px] font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <RotateCcw size={12} />
                    <span className="hidden xs:inline">New Inquiry</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setIsExpanded(prev => !prev)}
                  title={isExpanded ? 'Standard size' : 'Expand view'}
                  aria-label={isExpanded ? 'Standard size' : 'Expand view'}
                  className="hidden sm:flex w-7 h-7 rounded-lg bg-white/15 hover:bg-white/25 border border-white/20 text-white items-center justify-center transition-colors cursor-pointer"
                >
                  {isExpanded ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  title="Close advisor"
                  aria-label="Close advisor"
                  className="w-7 h-7 rounded-lg bg-white/15 hover:bg-rose-500 border border-white/20 hover:border-rose-400 text-white flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X size={15} />
                </button>
              </div>
            </div>

            {/* Body Area: Bright Crisp Daylight Surface (#F4F7FB) */}
            <div
              ref={scrollContainerRef}
              className="flex-1 overflow-y-auto p-4 landscape:max-lg:p-3 bg-[#F4F7FB]"
            >
              {messages.length === 0 ? (
                /* FIRST LOOK: Bright Professional Admissions Briefing */
                <div className="h-full flex flex-col justify-between gap-4 landscape:max-lg:gap-2.5">
                  {/* Editorial Introduction */}
                  <div className="space-y-3">
                    <div className="p-4 landscape:max-lg:p-3 rounded-xl bg-white border border-slate-200/90 shadow-xs">
                      <div className="flex items-center gap-2 text-[11px] font-semibold text-[#1D4ED8] mb-1">
                        <SlidersHorizontal size={12} className="text-[#1D4ED8]" />
                        <span>Forensic & Cyber Security Admissions Desk</span>
                      </div>
                      <h4 className="text-sm sm:text-[15px] font-semibold text-slate-900 tracking-tight">
                        Compare colleges by program, fee structure & location
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed mt-1">
                        Query verified B.Sc., M.Sc., and Diploma programs across NFSU campuses, Government institutes, and private universities.
                      </p>

                      {/* Quick Action Filter Buttons */}
                      <div className="pt-3 mt-3 border-t border-slate-100 flex flex-wrap gap-1.5">
                        {QUICK_FILTER_PROMPTS.map((qItem, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => handleSendQuestion(qItem.prompt)}
                            className="px-2.5 py-1 rounded-md bg-blue-50 hover:bg-[#1D4ED8] text-[#1D4ED8] hover:text-white border border-blue-200/80 hover:border-[#1D4ED8] text-[11px] font-medium transition-colors cursor-pointer"
                          >
                            {qItem.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Curated Student Inquiries List */}
                  <div className="space-y-2">
                    <div className="px-1 flex items-center justify-between text-[11px] text-slate-600">
                      <span className="font-semibold text-slate-800">Recommended Inquiries</span>
                      <span>{colleges.length} institutions indexed</span>
                    </div>

                    <div className="grid grid-cols-1 landscape:max-lg:grid-cols-2 gap-2">
                      {STARTER_INQUIRIES.map((item, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleSendQuestion(item.prompt)}
                          className="group w-full text-left px-3.5 py-2.5 landscape:max-lg:py-2 rounded-xl bg-white hover:bg-blue-50/50 text-slate-900 border border-slate-200/90 hover:border-blue-400 transition-all flex items-center justify-between gap-3 cursor-pointer shadow-2xs"
                        >
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5 text-[10px] font-semibold text-[#1D4ED8]">
                              <span className="font-mono text-slate-400">0{idx + 1}.</span>
                              <span>{item.category}</span>
                            </div>
                            <span className="block text-xs font-medium text-slate-800 group-hover:text-slate-950 truncate mt-0.5">
                              {item.prompt}
                            </span>
                          </div>
                          <div className="w-6 h-6 rounded-md bg-blue-50 group-hover:bg-[#1D4ED8] text-[#1D4ED8] group-hover:text-white flex items-center justify-center shrink-0 transition-colors">
                            <ArrowUpRight size={13} />
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                /* ACTIVE CONSULTATION STREAM (Reads Top-to-Bottom) */
                <div className="space-y-5 landscape:max-lg:space-y-3.5">
                  {messages.map((msg, msgIdx) => {
                    const targetTopIdx =
                      messages.length >= 2 && messages[messages.length - 1].role === 'assistant'
                        ? messages.length - 2
                        : messages.length - 1;
                    const isLatestTurnStart = msgIdx === targetTopIdx;

                    return (
                      <div
                        key={msg.id}
                        ref={isLatestTurnStart ? latestMessageTopRef : undefined}
                        className={cn(
                          'flex flex-col gap-2 scroll-mt-2',
                          msg.role === 'user' ? 'items-end' : 'items-start'
                        )}
                      >
                        {/* Clean Unboxed Sender Metadata */}
                        <div className="flex items-center gap-1.5 px-1 flex-wrap text-[11px] text-slate-500">
                          {msg.role === 'assistant' && (
                            <Fingerprint size={12} className="text-[#1D4ED8] shrink-0" />
                          )}
                          <span className="font-semibold text-slate-800">
                            {msg.role === 'user' ? 'You' : 'ForenClue Advisor'}
                          </span>
                          {msg.matchedCourseFilterLabel && (
                            <>
                              <span aria-hidden="true">·</span>
                              <span className="font-semibold text-[#1D4ED8]">
                                {msg.matchedCourseFilterLabel}
                              </span>
                            </>
                          )}
                          <span aria-hidden="true">·</span>
                          <span className="text-slate-400">{msg.timestamp}</span>
                        </div>

                        {/* Message Bubble */}
                        <div
                          className={cn(
                            'max-w-[96%] rounded-xl px-4 py-3 text-xs sm:text-[13px] leading-relaxed',
                            msg.role === 'user'
                              ? 'bg-[#1D4ED8] text-white font-medium border border-blue-700 shadow-xs'
                              : 'bg-white text-slate-800 border border-slate-200/90 shadow-xs'
                          )}
                        >
                          {msg.role === 'user' ? (
                            <p className="whitespace-pre-wrap">{msg.content}</p>
                          ) : (
                            <div className="prose prose-xs prose-slate max-w-none prose-p:my-1.5 prose-headings:my-2 prose-headings:text-slate-900 prose-headings:font-semibold prose-ul:my-1.5 prose-li:my-0.5 prose-strong:text-slate-900">
                              <ReactMarkdown>{msg.content}</ReactMarkdown>
                            </div>
                          )}
                        </div>

                        {/* Strictly Matched Institutional Directory Cards */}
                        {msg.role === 'assistant' &&
                          msg.recommendedColleges &&
                          msg.recommendedColleges.length > 0 && (
                            <div className="w-full space-y-2.5 pt-1">
                              <div className="flex items-center justify-between px-1 text-[11px] text-slate-600">
                                <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                                  <Building2 size={12} className="text-[#1D4ED8]" />
                                  <span>Matched Institutions ({msg.recommendedColleges.length})</span>
                                </span>
                              </div>

                              {/* Grid adapts to 2 columns in Landscape or Expanded mode */}
                              <div
                                className={cn(
                                  'grid gap-2.5',
                                  isExpanded
                                    ? 'grid-cols-1 sm:grid-cols-2'
                                    : 'grid-cols-1 landscape:max-lg:grid-cols-2'
                                )}
                              >
                                {msg.recommendedColleges.map(college => {
                                  const bannerUrl =
                                    college.bannerImage || getFallbackBannerForCollege(college.id);
                                  const isComparing = compareIds.includes(college.id);
                                  const labelLower = (msg.matchedCourseFilterLabel || '').toLowerCase();

                                  // Prioritize courses that match the user's requested degree & specialization
                                  const prioritizedCourses = [...(college.coursesOffered || [])].sort(
                                    (a, b) => {
                                      const scoreCourse = (co: CollegeCourse) => {
                                        let s = 0;
                                        if (labelLower.includes('cyber') && isCyberDigitalForensicsCourse(co)) s += 10;
                                        if (labelLower.includes('dna') && isDnaSerologyCourse(co)) s += 10;
                                        if (labelLower.includes('document') && isQuestionedDocumentsCourse(co)) s += 10;
                                        if (labelLower.includes('toxicology') && isToxicologyChemistryCourse(co)) s += 10;
                                        if (labelLower.includes('criminology') && isPsychologyCriminologyCourse(co)) s += 10;
                                        if (labelLower.includes('m.sc.') && isMscCourse(co)) s += 5;
                                        if (labelLower.includes('b.sc.') && isBscCourse(co)) s += 5;
                                        return s;
                                      };
                                      return scoreCourse(b) - scoreCourse(a);
                                    }
                                  );

                                  const primaryCourseFee = prioritizedCourses[0]?.estimatedFees
                                    ? formatFee(prioritizedCourses[0].estimatedFees, college.country)
                                    : '';
                                  const formattedFee =
                                    primaryCourseFee ||
                                    formatFee(college.feesRange, college.country);

                                  return (
                                    <div
                                      key={college.id}
                                      className="group bg-white border border-slate-200/90 hover:border-blue-400 rounded-xl overflow-hidden shadow-xs transition-all flex flex-col justify-between text-slate-900"
                                    >
                                      <div>
                                        {/* Campus Banner Header */}
                                        <div className="relative h-24 sm:h-26 landscape:max-lg:h-20 w-full overflow-hidden bg-slate-900">
                                          <img
                                            src={bannerUrl}
                                            alt={college.name}
                                            loading="lazy"
                                            onError={e => {
                                              const target = e.currentTarget;
                                              const fallback = getFallbackBannerForCollege(college.id);
                                              if (target.src !== fallback) {
                                                target.src = fallback;
                                              }
                                            }}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                                          />
                                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/45 to-slate-950/10" />

                                          {/* Logo & College Name */}
                                          <div className="absolute bottom-2.5 left-3 right-3 flex items-end gap-2.5">
                                            <div className="w-8 h-8 rounded-lg bg-white border border-white/20 p-1 flex items-center justify-center shrink-0 overflow-hidden shadow-xs">
                                              {college.logo ? (
                                                <img
                                                  src={college.logo}
                                                  alt={`${college.name} logo`}
                                                  className="w-full h-full object-contain"
                                                  onError={e => {
                                                    e.currentTarget.style.display = 'none';
                                                  }}
                                                />
                                              ) : (
                                                <span className="text-[9px] font-bold text-[#1D4ED8]">
                                                  {getCollegeInitials(college)}
                                                </span>
                                              )}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                              <h4 className="text-xs font-semibold text-white leading-tight truncate">
                                                {college.name}
                                              </h4>
                                              <p className="text-[10px] text-slate-200 flex items-center gap-1 truncate mt-0.5">
                                                <MapPin size={10} className="text-blue-300 shrink-0" />
                                                <span>
                                                  {college.city}, {college.state}
                                                </span>
                                              </p>
                                            </div>
                                          </div>
                                        </div>

                                        {/* Clean Institutional Metadata & Courses */}
                                        <div className="p-3 space-y-2">
                                          {/* Type & Tuition Metadata Row */}
                                          <div className="flex items-center justify-between gap-2 text-[11px] pb-2 border-b border-slate-100">
                                            <span className="font-medium text-slate-600 flex items-center gap-1 truncate">
                                              <ShieldCheck size={11} className="text-[#1D4ED8] shrink-0" />
                                              <span className="truncate">{getDisplayInstitutionType(college)}</span>
                                            </span>
                                            {formattedFee && (
                                              <span className="font-semibold text-slate-900 shrink-0 tabular-nums">
                                                {formattedFee}
                                              </span>
                                            )}
                                          </div>

                                          {/* Target Courses List */}
                                          {prioritizedCourses.length > 0 && (
                                            <div className="space-y-1">
                                              {prioritizedCourses.slice(0, 2).map((course, idx) => (
                                                <div
                                                  key={idx}
                                                  className="flex items-center gap-1.5 text-[11px] text-slate-700"
                                                >
                                                  <GraduationCap
                                                    size={11}
                                                    className="text-[#1D4ED8] shrink-0"
                                                  />
                                                  <span className="truncate font-medium">
                                                    {course.name}
                                                  </span>
                                                </div>
                                              ))}
                                              {prioritizedCourses.length > 2 && (
                                                <p className="text-[10px] text-slate-400 pl-4">
                                                  +{prioritizedCourses.length - 2} additional programs
                                                </p>
                                              )}
                                            </div>
                                          )}

                                          {(college.accreditation || college.ranking) && (
                                            <p className="text-[10px] text-slate-500 line-clamp-1 flex items-center gap-1 pt-0.5">
                                              <Award size={10} className="text-[#1D4ED8] shrink-0" />
                                              <span>{college.ranking || college.accreditation}</span>
                                            </p>
                                          )}
                                        </div>
                                      </div>

                                      {/* Card Actions */}
                                      <div className="px-3 pb-3 pt-2 flex items-center gap-1.5 border-t border-slate-100">
                                        <button
                                          type="button"
                                          onClick={() => {
                                            onSelectCollege(college);
                                            setIsOpen(false);
                                          }}
                                          className="flex-1 px-2.5 py-1.5 rounded-lg bg-[#1D4ED8] hover:bg-[#1E40AF] text-white font-medium text-[11px] transition-colors flex items-center justify-center gap-1 cursor-pointer"
                                        >
                                          <span>View Details</span>
                                          <ChevronRight size={12} />
                                        </button>

                                        <button
                                          type="button"
                                          onClick={e => onToggleCompare(college.id, e)}
                                          className={cn(
                                            'px-2.5 py-1.5 rounded-lg border text-[11px] font-medium flex items-center gap-1 transition-colors cursor-pointer',
                                            isComparing
                                              ? 'bg-blue-50 border-[#1D4ED8] text-[#1D4ED8]'
                                              : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                                          )}
                                        >
                                          {isComparing ? <Check size={11} /> : <Scale size={11} />}
                                          <span>{isComparing ? 'Added' : 'Compare'}</span>
                                        </button>

                                        {college.website && (
                                          <a
                                            href={college.website}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            title="Official Website"
                                            className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                                          >
                                            <ExternalLink size={12} />
                                          </a>
                                        )}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                        {/* Follow-Up Suggestions */}
                        {msg.role === 'assistant' &&
                          msg.followUpSuggestions &&
                          msg.followUpSuggestions.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              {msg.followUpSuggestions.map((suggestion, idx) => (
                                <button
                                  key={idx}
                                  type="button"
                                  disabled={isLoading}
                                  onClick={() => handleSendQuestion(suggestion)}
                                  className="text-left px-2.5 py-1.5 rounded-lg bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-[11px] font-medium text-slate-700 hover:text-[#1D4ED8] transition-all cursor-pointer flex items-center gap-1 shadow-2xs"
                                >
                                  <span>{suggestion}</span>
                                  <ArrowUpRight size={11} className="text-[#1D4ED8] shrink-0" />
                                </button>
                              ))}
                            </div>
                          )}
                      </div>
                    );
                  })}

                  {/* Loading State */}
                  {isLoading && (
                    <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 w-fit shadow-xs">
                      <Loader2 size={14} className="text-[#1D4ED8] animate-spin" />
                      <span className="text-xs font-medium text-slate-700">
                        Searching verified college records...
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Bright Clean Input Footer */}
            <form
              onSubmit={e => {
                e.preventDefault();
                handleSendQuestion();
              }}
              className="p-3 landscape:max-lg:p-2 bg-white border-t border-slate-200/90 flex items-center gap-2 shrink-0"
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Ask by course, fee budget (e.g. under ₹50,000), or state..."
                disabled={isLoading}
                className="flex-1 bg-[#F8FAFC] focus:bg-white border border-slate-200 rounded-xl px-3.5 py-2 landscape:max-lg:py-1.5 text-xs sm:text-[13px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#1D4ED8] focus:ring-2 focus:ring-blue-500/15 transition-all"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                aria-label="Send inquiry"
                className="w-9 h-9 landscape:max-lg:w-8 landscape:max-lg:h-8 rounded-xl bg-[#1D4ED8] hover:bg-[#1E40AF] text-white flex items-center justify-center disabled:opacity-35 disabled:pointer-events-none transition-all cursor-pointer shrink-0 shadow-xs"
              >
                <Send size={14} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
