import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useParams, useSearchParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, MapPin, Globe, BookOpen, GraduationCap, 
  Search, Filter, ExternalLink, Award, CheckCircle2, 
  ChevronRight, Bookmark, Share2, Phone, Mail, FileText, X, 
  ShieldCheck, Info, RefreshCw, ArrowLeft, Loader2, Star, Check, ArrowUpDown, Sparkles, Scale
} from 'lucide-react';
import { SEOManager } from '@/components/layout/SEOManager';
import { College, CollegeCourse } from '@/types/college';
import { fetchColleges, fetchCollegeById, getCachedColleges, matchCollegeBySlug } from '@/services/collegeService';
import { CollegeComparisonSystem, MAX_COMPARE_COLLEGES } from '@/components/colleges/CollegeComparisonModal';
import { cn } from '@/lib/utils';

const RETURN_TO_COLLEGE_KEY = 'forenclue_return_to_college_id';
const DIRECTORY_FILTERS_KEY = 'forenclue_colleges_directory_filters';
const COMPARE_COLLEGES_KEY = 'forenclue_compare_colleges';

const FALLBACK_CAMPUS_BANNERS = [
  'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=75&w=640',
  'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=75&w=640',
  'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=75&w=640',
  'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?auto=format&fit=crop&q=75&w=640',
];

function getFallbackBannerForCollege(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  }
  return FALLBACK_CAMPUS_BANNERS[hash % FALLBACK_CAMPUS_BANNERS.length];
}

function getCollegeInitials(college: College): string {
  const source = college.shortName || college.name || 'FC';
  const words = source
    .replace(/[^a-zA-Z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 0 && !['of', 'and', 'the', 'in', 'for', 'to', 'be'].includes(w.toLowerCase()));
  if (words.length === 0) return 'FC';
  if (words.length === 1) return words[0].slice(0, 3).toUpperCase();
  return words.slice(0, 3).map(w => w[0].toUpperCase()).join('');
}

// Helper to format fee strings accurately without corrupting years or non-numeric text
export const formatFee = (feeStr?: string, country?: string): string => {
  if (!feeStr || !feeStr.trim()) return '';
  const trimmed = feeStr.trim();

  const isIndia = !country || country.toLowerCase().includes('india');

  if (isIndia) {
    if (trimmed.includes('₹') || trimmed.toLowerCase().includes('inr') || trimmed.toLowerCase().includes('rs')) {
      return trimmed;
    }

    if (trimmed.includes('$')) {
      return trimmed.replace(/\$\s*([\d,]+(\.\d+)?)/g, (_, amountStr) => {
        const num = parseFloat(amountStr.replace(/,/g, ''));
        if (isNaN(num)) return `₹${amountStr}`;
        const inrVal = Math.round(num * 83.5);
        return `₹${inrVal.toLocaleString('en-IN')}`;
      });
    }

    // Only prefix ₹ if the string starts with a number and looks like a pure numeric fee
    if (/^\d[\d,]*(\s*-\s*\d[\d,]*)?(\s*\/.*)?$/.test(trimmed) && !/[£€$]/.test(trimmed)) {
      return trimmed.replace(/(\d[\d,]{2,})/g, (m) => {
        const val = parseInt(m.replace(/,/g, ''), 10);
        return isNaN(val) ? m : `₹${val.toLocaleString('en-IN')}`;
      });
    }

    return trimmed;
  }

  return trimmed;
};

// Extract approximate minimum annual fee in INR for sorting
function parseNumericMinFee(college: College): number {
  const raw = college.feesRange || college.coursesOffered?.[0]?.estimatedFees || '';
  if (!raw) return Number.MAX_SAFE_INTEGER;
  const formatted = formatFee(raw, college.country);
  const match = formatted.match(/([\d,]{3,})/);
  if (!match) return Number.MAX_SAFE_INTEGER;
  const num = parseInt(match[1].replace(/,/g, ''), 10);
  if (isNaN(num)) return Number.MAX_SAFE_INTEGER;
  const isPerSemester = /semester|sem/i.test(raw);
  return isPerSemester ? num * 2 : num;
}

// Normalize text for case-insensitive, whitespace-normalized, punctuation-tolerant search
function normalizeSearchText(input?: string): string {
  if (!input) return '';
  return input
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Also build a compact version where dots in abbreviations like B.Sc. / M.Sc. / Ph.D. are collapsed (bsc, msc, phd)
function normalizeAbbrevText(input?: string): string {
  if (!input) return '';
  return input
    .toLowerCase()
    .replace(/\./g, '')
    .replace(/&/g, ' and ')
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Human-friendly institution category label
function getDisplayInstitutionType(college: College): string {
  const t = (college.type || '').trim();
  const accred = (college.accreditation || '').toLowerCase();
  if (t === 'Institute of National Importance' || accred.includes('institution of national importance')) {
    return t === 'Central' ? 'Central / National Importance' : 'Institute of National Importance';
  }
  if (t === 'Central') return 'Central University';
  if (t === 'State') return 'State Govt. University';
  if (t === 'Deemed' || t === 'Deemed University') return 'Deemed-to-be University';
  if (t === 'Government') return 'Government Institute';
  if (t === 'Private') return 'Private University';
  if (t === 'Autonomous') return 'Autonomous Institute';
  return t || 'University';
}

// Check if a college matches the selected Institution Type filter
function matchesInstitutionTypeFilter(college: College, selectedType: string): boolean {
  if (!selectedType || selectedType === 'All') return true;
  const rawType = (college.type || '').toLowerCase().trim();
  const accred = (college.accreditation || '').toLowerCase();
  const desc = (college.description || '').toLowerCase();

  switch (selectedType) {
    case 'Government':
      return (
        rawType === 'government' ||
        rawType === 'central' ||
        rawType === 'state' ||
        rawType === 'institute of national importance' ||
        accred.includes('government') ||
        accred.includes('institution of national importance')
      );
    case 'Institute of National Importance':
      return (
        rawType === 'institute of national importance' ||
        accred.includes('institution of national importance') ||
        desc.includes('institution of national importance') ||
        college.id.startsWith('nfsu-') ||
        college.id.startsWith('rru-')
      );
    case 'Central':
      return rawType === 'central' || rawType === 'institute of national importance';
    case 'State':
      return rawType === 'state' || rawType === 'government';
    case 'Private':
      return rawType === 'private';
    case 'Deemed University':
    case 'Deemed':
      return (
        rawType === 'deemed' ||
        rawType === 'deemed university' ||
        accred.includes('deemed')
      );
    case 'Autonomous':
      return (
        rawType === 'autonomous' ||
        accred.includes('autonomous') ||
        desc.includes('autonomous')
      );
    default:
      return rawType === selectedType.toLowerCase();
  }
}

// Check if a course matches the selected Degree Level filter
function matchesCourseDegreeLevel(course: CollegeCourse, selectedDegree: string): boolean {
  if (!selectedDegree || selectedDegree === 'All') return true;
  const level = (course.degreeLevel || '').toLowerCase();
  const name = (course.name || '').toLowerCase();

  switch (selectedDegree) {
    case 'Bachelor':
      return (
        level === 'bachelor' ||
        /\bb\.?\s*sc\b|\bb\.?\s*tech\b|\bb\.?\s*voc\b|\bb\.?\s*a\b|\bb\.?\s*b\.?\s*a\b|integrated/i.test(name)
      );
    case 'Master':
      return (
        level === 'master' ||
        /\bm\.?\s*sc\b|\bm\.?\s*tech\b|\bm\.?\s*a\b|\bm\.?\s*b\.?\s*a\b|\bll\.?\s*m\b|\bm\.?\s*pharm\b/i.test(name)
      );
    case 'Doctorate':
      return (
        level === 'doctorate' ||
        /\bph\.?\s*d\b|\bm\.?\s*d\b|doctoral/i.test(name)
      );
    case 'Diploma':
      return (
        level === 'diploma' ||
        level === 'certificate/diploma' ||
        /\bdiploma\b|\bpgd/i.test(name)
      );
    case 'Certificate':
      return (
        level === 'certificate' ||
        level === 'certificate/diploma' ||
        /\bcertificate\b/i.test(name)
      );
    default:
      return level === selectedDegree.toLowerCase();
  }
}

// Build a comprehensive searchable index string for each college
function buildCollegeSearchIndex(college: College): string {
  const degreeAliases: string[] = [];
  for (const c of college.coursesOffered || []) {
    const lvl = (c.degreeLevel || '').toLowerCase();
    const nm = (c.name || '').toLowerCase();
    if (lvl === 'bachelor' || /\bb\.?\s*sc|\bb\.?\s*tech|\bb\.?\s*voc|\bb\.?\s*a/i.test(nm)) {
      degreeAliases.push('bachelor bachelors ug undergraduate bsc b sc btech bvoc');
    }
    if (lvl === 'master' || /\bm\.?\s*sc|\bm\.?\s*tech|\bm\.?\s*a|\bmba|\bllm/i.test(nm)) {
      degreeAliases.push('master masters pg postgraduate msc m sc mtech ma mba llm');
    }
    if (lvl === 'doctorate' || /\bph\.?\s*d|\bm\.?\s*d/i.test(nm)) {
      degreeAliases.push('doctorate doctoral phd ph d md research');
    }
    if (lvl.includes('diploma') || /\bdiploma|\bpgd/i.test(nm)) {
      degreeAliases.push('diploma pgd pgdiploma postgraduate diploma');
    }
    if (lvl.includes('certificate') || /\bcertificate/i.test(nm)) {
      degreeAliases.push('certificate certification short term');
    }
  }

  const rawParts = [
    college.id,
    college.name,
    college.shortName,
    college.city,
    college.state,
    college.country,
    college.type,
    getDisplayInstitutionType(college),
    college.accreditation,
    college.ranking,
    college.admissionProcess,
    college.address,
    college.description,
    ...(college.facilities || []),
    ...degreeAliases,
    ...(college.coursesOffered || []).flatMap(course => [
      course.name,
      course.degreeLevel,
      course.duration,
      course.eligibility,
      course.mode,
      ...(course.specializations || []),
    ]),
  ]
    .filter(Boolean)
    .join(' ');

  return `${normalizeSearchText(rawParts)} ${normalizeAbbrevText(rawParts)}`;
}

// Resilient Banner Image with automatic fallback, lightweight sizing, and gentle skeleton shimmer
function CollegeBannerImage({
  college,
  className,
}: {
  college: College;
  className?: string;
}) {
  const fallbackSrc = useMemo(() => getFallbackBannerForCollege(college.id), [college.id]);
  
  // Downscale Unsplash URLs for directory thumbnails to prevent downloading massive full-res images
  const optimizedSrc = useMemo(() => {
    const raw = college.bannerImage || fallbackSrc;
    if (raw && raw.includes('images.unsplash.com')) {
      return raw.replace(/w=\d+/, 'w=640').replace(/q=\d+/, 'q=75');
    }
    return raw;
  }, [college.bannerImage, fallbackSrc]);

  const [imgSrc, setImgSrc] = useState<string>(optimizedSrc);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setImgSrc(optimizedSrc);
    setIsLoaded(false);
  }, [optimizedSrc]);

  return (
    <div className="relative w-full h-full overflow-hidden bg-slate-900">
      {!isLoaded && (
        <div
          className="absolute inset-0 skeleton-shimmer bg-slate-900/90"
          aria-hidden="true"
        />
      )}
      <img
        src={imgSrc}
        alt={`${college.name} campus`}
        loading="lazy"
        decoding="async"
        referrerPolicy="no-referrer"
        onLoad={() => setIsLoaded(true)}
        onError={() => {
          if (imgSrc !== fallbackSrc) {
            setImgSrc(fallbackSrc);
          } else {
            setIsLoaded(true);
          }
        }}
        className={cn(
          className,
          'transition-all duration-700 ease-out will-change-[opacity,transform]',
          isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-[1.03]'
        )}
      />
    </div>
  );
}

// Resilient University Logo with automatic monogram fallback, skeleton shimmer, and async decoding
function CollegeLogoBadge({
  college,
  size = 'md',
}: {
  college: College;
  size?: 'sm' | 'md' | 'lg';
}) {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const initials = useMemo(() => getCollegeInitials(college), [college]);

  useEffect(() => {
    setHasError(false);
    setIsLoaded(false);
  }, [college.logo, college.id]);

  const sizeClasses = {
    sm: 'w-11 h-11 rounded-xl text-xs',
    md: 'w-14 h-14 rounded-xl text-sm',
    lg: 'w-24 h-24 sm:w-28 sm:h-28 rounded-2xl text-xl',
  }[size];

  if (!college.logo || hasError) {
    return (
      <div
        className={cn(
          sizeClasses,
          'bg-surface border-2 border-warning/30 shadow-lg shrink-0 flex flex-col items-center justify-center text-warning font-black tracking-tight select-none'
        )}
        aria-hidden="true"
      >
        <Building2 size={size === 'lg' ? 28 : size === 'md' ? 18 : 14} className="text-warning mb-0.5" />
        <span className="text-[10px] leading-none font-mono">{initials}</span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        sizeClasses,
        'relative bg-white dark:bg-surface border-2 border-warning/30 p-1.5 shadow-lg shrink-0 overflow-hidden flex items-center justify-center'
      )}
    >
      {!isLoaded && (
        <div className="absolute inset-0 skeleton-shimmer" aria-hidden="true" />
      )}
      <img
        src={college.logo}
        alt={`${college.shortName || college.name} logo`}
        loading="lazy"
        decoding="async"
        referrerPolicy="no-referrer"
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        className={cn(
          'w-full h-full object-contain transition-opacity duration-500 ease-out',
          isLoaded ? 'opacity-100' : 'opacity-0'
        )}
      />
    </div>
  );
}

// Gentle, Anatomically Accurate Skeleton Card for Initial & Scroll-Based Loading Across All Orientations
function CollegeCardSkeleton({ index = 0 }: { index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{
        duration: 0.4,
        delay: Math.min(index * 0.05, 0.25),
        ease: [0.22, 1, 0.36, 1],
      }}
      aria-hidden="true"
      className="bg-surface border border-black/5 dark:border-white/10 rounded-2xl overflow-hidden shadow-[0_2px_10px_-3px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.03)] dark:shadow-[0_2px_12px_-3px_rgba(0,0,0,0.35)] flex flex-col select-none pointer-events-none"
    >
      {/* Banner Skeleton Header (adapts to portrait & landscape orientations) */}
      <div className="relative h-36 sm:h-44 landscape:max-lg:h-32 bg-crust overflow-hidden skeleton-shimmer">
        <div className="absolute top-2.5 sm:top-3 left-2.5 sm:left-3 right-2.5 sm:right-3 flex items-center justify-between gap-2">
          <div className="h-5 w-28 rounded-full bg-white/10 dark:bg-white/10" />
          <div className="flex items-center gap-1.5">
            <div className="w-8 h-8 rounded-full bg-white/10 dark:bg-white/10" />
            <div className="w-8 h-8 rounded-full bg-white/10 dark:bg-white/10" />
          </div>
        </div>
        <div className="absolute bottom-2.5 sm:bottom-3 left-2.5 sm:left-3 right-2.5 sm:right-3 flex items-center justify-between gap-2">
          <div className="h-3.5 w-36 rounded bg-white/10 dark:bg-white/10" />
          <div className="h-4 w-16 rounded bg-white/10 dark:bg-white/10" />
        </div>
      </div>

      {/* Card Body Skeleton */}
      <div className="p-4 sm:p-6 space-y-3.5 sm:space-y-4 flex-1 flex flex-col justify-between">
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-11 h-11 rounded-xl skeleton-shimmer shrink-0" />
            <div className="min-w-0 flex-1 space-y-2 pt-0.5">
              <div className="h-4 sm:h-5 w-4/5 rounded-md skeleton-shimmer" />
              <div className="h-3.5 sm:h-4 w-3/5 rounded-md skeleton-shimmer" />
              <div className="h-2.5 w-2/5 rounded skeleton-shimmer" />
            </div>
          </div>
          <div className="space-y-1.5 pt-1">
            <div className="h-3 w-full rounded skeleton-shimmer" />
            <div className="h-3 w-11/12 rounded skeleton-shimmer" />
          </div>
        </div>

        {/* Fee & Programs Skeleton */}
        <div className="space-y-2.5 sm:space-y-3 pt-2.5 border-t border-black/5 dark:border-white/5">
          <div className="flex items-center justify-between gap-2">
            <div className="h-3 w-24 rounded skeleton-shimmer" />
            <div className="h-3.5 w-28 rounded skeleton-shimmer" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="h-3 w-24 rounded skeleton-shimmer" />
              <div className="h-3 w-16 rounded skeleton-shimmer" />
            </div>
            <div className="flex flex-wrap gap-1.5">
              <div className="h-6 w-28 rounded-md skeleton-shimmer" />
              <div className="h-6 w-32 rounded-md skeleton-shimmer" />
              <div className="h-6 w-20 rounded-md skeleton-shimmer" />
            </div>
          </div>
        </div>

        {/* Bottom Action Buttons Skeleton */}
        <div className="pt-1.5 sm:pt-2 flex items-center gap-2 sm:gap-2.5">
          <div className="h-11 w-24 sm:w-28 rounded-xl skeleton-shimmer shrink-0" />
          <div className="h-11 flex-1 rounded-xl skeleton-shimmer" />
        </div>
      </div>
    </motion.div>
  );
}

// Steady, Smooth Count-Up Number Animation Triggered After Page Load
function SteadyCountUp({
  target,
  durationMs = 1750,
  delayMs = 0,
  isReady = true,
  suffix = '+',
}: {
  target: number;
  durationMs?: number;
  delayMs?: number;
  isReady?: boolean;
  suffix?: string;
}) {
  const [displayValue, setDisplayValue] = useState<number>(0);
  const prevTargetRef = useRef<number>(0);

  useEffect(() => {
    if (!isReady || target <= 0) {
      setDisplayValue(0);
      prevTargetRef.current = 0;
      return;
    }

    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      setDisplayValue(target);
      prevTargetRef.current = target;
      return;
    }

    const startValue = prevTargetRef.current;
    const delta = target - startValue;
    if (delta === 0) {
      setDisplayValue(target);
      return;
    }

    let rafId = 0;
    let startTime: number | null = null;

    const timerId = setTimeout(() => {
      const step = (timestamp: number) => {
        if (startTime === null) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / durationMs, 1);
        // Smooth, steady cubic/quartic ease-out curve
        const eased = 1 - Math.pow(1 - progress, 3.2);
        const current = Math.round(startValue + delta * eased);
        setDisplayValue(current);

        if (progress < 1) {
          rafId = requestAnimationFrame(step);
        } else {
          setDisplayValue(target);
          prevTargetRef.current = target;
        }
      };
      rafId = requestAnimationFrame(step);
    }, delayMs);

    return () => {
      clearTimeout(timerId);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [target, durationMs, delayMs, isReady]);

  return (
    <span className="font-mono tabular-nums tracking-tight">
      {displayValue.toLocaleString('en-IN')}
      {suffix && <span className="text-warning ml-0.5">{suffix}</span>}
    </span>
  );
}

const QUICK_SEARCH_TOPICS = [
  { label: 'B.Sc. Forensic Science', query: 'B.Sc Forensic Science' },
  { label: 'M.Sc. Forensic Science', query: 'M.Sc Forensic Science' },
  { label: 'Cyber & Digital Forensics', query: 'Cyber Forensics' },
  { label: 'NFSU Campuses', query: 'NFSU' },
  { label: 'DNA & Serology', query: 'DNA Profiling' },
  { label: 'Questioned Documents', query: 'Questioned Documents' },
];

const BATCH_SIZE = 12;

export default function Colleges() {
  const { id } = useParams<{ id?: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const initialCache = getCachedColleges();
  const [colleges, setColleges] = useState<College[]>(() => initialCache || []);
  const [loading, setLoading] = useState<boolean>(() => !initialCache || initialCache.length === 0);
  const [isMetricsReady, setIsMetricsReady] = useState<boolean>(false);
  const [syncNotice, setSyncNotice] = useState<string | null>(null);
  const [selectedCollege, setSelectedCollege] = useState<College | null>(null);
  const [highlightedCollegeId, setHighlightedCollegeId] = useState<string | null>(null);
  const [activeCourseDegreeTab, setActiveCourseDegreeTab] = useState<string>('All');
  const [visibleCount, setVisibleCount] = useState<number>(BATCH_SIZE);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const loadMoreSentinelRef = useRef<HTMLDivElement | null>(null);
  const loadMoreTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastTargetIdRef = useRef<string | null>(null);

  const [savedCollegeIds, setSavedCollegeIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('forenclue_saved_colleges');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [compareCollegeIds, setCompareCollegeIds] = useState<string[]>(() => {
    try {
      const urlCompare = searchParams.get('compare');
      if (urlCompare) {
        const parsed = urlCompare
          .split(',')
          .map(s => s.trim())
          .filter(Boolean)
          .slice(0, MAX_COMPARE_COLLEGES);
        if (parsed.length > 0) {
          localStorage.setItem(COMPARE_COLLEGES_KEY, JSON.stringify(parsed));
          return parsed;
        }
      }
      const saved = localStorage.getItem(COMPARE_COLLEGES_KEY);
      return saved ? JSON.parse(saved).slice(0, MAX_COMPARE_COLLEGES) : [];
    } catch {
      return [];
    }
  });

  const [isCompareModalOpen, setIsCompareModalOpen] = useState<boolean>(() => {
    return Boolean(searchParams.get('compare'));
  });

  // Restore saved filters when returning from a college detail page
  const savedFilters = useMemo(() => {
    try {
      const raw = sessionStorage.getItem(DIRECTORY_FILTERS_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }, []);

  // Filters state (URL search params take precedence over sessionStorage)
  const [searchInput, setSearchInput] = useState<string>(
    () => searchParams.get('q') ?? savedFilters?.searchQuery ?? ''
  );
  const [searchQuery, setSearchQuery] = useState<string>(
    () => searchParams.get('q') ?? savedFilters?.searchQuery ?? ''
  );
  const [selectedCountry, setSelectedCountry] = useState<string>(
    () => searchParams.get('country') ?? savedFilters?.selectedCountry ?? 'All'
  );
  const [selectedState, setSelectedState] = useState<string>(
    () => searchParams.get('state') ?? savedFilters?.selectedState ?? 'All'
  );
  const [selectedCity, setSelectedCity] = useState<string>(
    () => searchParams.get('city') ?? savedFilters?.selectedCity ?? 'All'
  );
  const [selectedDegree, setSelectedDegree] = useState<string>(
    () => searchParams.get('degree') ?? savedFilters?.selectedDegree ?? 'All'
  );
  const [selectedType, setSelectedType] = useState<string>(
    () => searchParams.get('type') ?? savedFilters?.selectedType ?? 'All'
  );
  const [featuredOnly, setFeaturedOnly] = useState<boolean>(
    () => searchParams.get('featured') === 'true' ? true : (savedFilters?.featuredOnly ?? false)
  );
  const [savedOnly, setSavedOnly] = useState<boolean>(
    () => searchParams.get('saved') === 'true' ? true : (savedFilters?.savedOnly ?? false)
  );
  const [sortBy, setSortBy] = useState<'featured' | 'name-asc' | 'name-desc' | 'courses-desc' | 'fee-asc'>(
    () => (searchParams.get('sort') as any) ?? savedFilters?.sortBy ?? 'featured'
  );
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCardId, setCopiedCardId] = useState<string | null>(null);

  const targetId = id || searchParams.get('id');

  // Debounce searchInput -> searchQuery (180ms) for smooth, responsive filtering without lag
  useEffect(() => {
    if (searchInput === searchQuery) return;
    if (!searchInput.trim()) {
      setSearchQuery('');
      return;
    }
    const timer = setTimeout(() => {
      setSearchQuery(searchInput);
    }, 180);
    return () => clearTimeout(timer);
  }, [searchInput, searchQuery]);

  // Persist directory filters in sessionStorage & URL query parameters when on directory view
  useEffect(() => {
    try {
      sessionStorage.setItem(
        DIRECTORY_FILTERS_KEY,
        JSON.stringify({
          searchQuery,
          selectedCountry,
          selectedState,
          selectedCity,
          selectedDegree,
          selectedType,
          featuredOnly,
          savedOnly,
          sortBy,
        })
      );
    } catch {
      // Ignore storage errors
    }

    if (!targetId) {
      const nextParams = new URLSearchParams();
      if (searchQuery.trim()) nextParams.set('q', searchQuery.trim());
      if (selectedCountry !== 'All') nextParams.set('country', selectedCountry);
      if (selectedState !== 'All') nextParams.set('state', selectedState);
      if (selectedCity !== 'All') nextParams.set('city', selectedCity);
      if (selectedType !== 'All') nextParams.set('type', selectedType);
      if (selectedDegree !== 'All') nextParams.set('degree', selectedDegree);
      if (featuredOnly) nextParams.set('featured', 'true');
      if (savedOnly) nextParams.set('saved', 'true');
      if (sortBy !== 'featured') nextParams.set('sort', sortBy);

      const currentStr = searchParams.toString();
      const nextStr = nextParams.toString();
      if (currentStr !== nextStr) {
        setSearchParams(nextParams, { replace: true });
      }
    }
  }, [
    searchQuery,
    selectedCountry,
    selectedState,
    selectedCity,
    selectedDegree,
    selectedType,
    featuredOnly,
    savedOnly,
    sortBy,
    targetId,
    searchParams,
    setSearchParams,
  ]);

  // Load Colleges once or refresh in background without collapsing the DOM
  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      const cached = getCachedColleges();
      if (cached && cached.length > 0) {
        setColleges(cached);
        setLoading(false);
      } else {
        setLoading(true);
      }
      try {
        const data = await fetchColleges();
        if (!isMounted) return;
        if (data && data.length > 0) {
          setColleges(data);
          setSyncNotice(null);
        }
      } catch (err) {
        if (!isMounted) return;
        setSyncNotice('Showing verified directory records.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Trigger steady number loading animation after successful loading of page data
  useEffect(() => {
    if (loading || colleges.length === 0) return;
    const readyTimer = setTimeout(() => {
      setIsMetricsReady(true);
    }, 140);
    return () => clearTimeout(readyTimer);
  }, [loading, colleges.length]);

  // Real-time aggregated directory statistics (Colleges, Courses, States, Cities)
  const directoryStats = useMemo(() => {
    const totalColleges = colleges.length;
    const totalCourses = colleges.reduce(
      (sum, c) => sum + (c.coursesOffered?.length || 0),
      0
    );
    const totalStates = new Set(
      colleges.map((c) => (c.state || '').trim()).filter(Boolean)
    ).size;
    const totalCities = new Set(
      colleges.map((c) => (c.city || '').trim()).filter(Boolean)
    ).size;

    return {
      totalColleges,
      totalCourses,
      totalStates,
      totalCities,
    };
  }, [colleges]);

  // Resolve specific college when targetId changes & record it for return scroll restoration
  useEffect(() => {
    setActiveCourseDegreeTab('All');
    if (!targetId) {
      setSelectedCollege(null);
      return;
    }

    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

    const found = matchCollegeBySlug(colleges, targetId);
    if (found) {
      setSelectedCollege(found);
      lastTargetIdRef.current = found.id;
      try {
        sessionStorage.setItem(RETURN_TO_COLLEGE_KEY, found.id);
      } catch {
        // Ignore storage errors
      }
      return;
    }

    lastTargetIdRef.current = targetId;
    try {
      sessionStorage.setItem(RETURN_TO_COLLEGE_KEY, targetId);
    } catch {
      // Ignore storage errors
    }

    let isMounted = true;
    fetchCollegeById(targetId).then(single => {
      if (isMounted && single) {
        setSelectedCollege(single);
        lastTargetIdRef.current = single.id;
        try {
          sessionStorage.setItem(RETURN_TO_COLLEGE_KEY, single.id);
        } catch {
          // Ignore storage errors
        }
      }
    });
    return () => {
      isMounted = false;
    };
  }, [targetId, colleges]);

  // Sync bookmark updates to localStorage
  const toggleSaveCollege = useCallback((e: React.MouseEvent, collegeId: string) => {
    e.stopPropagation();
    e.preventDefault();
    setSavedCollegeIds(prev => {
      const exists = prev.includes(collegeId);
      const updated = exists ? prev.filter(i => i !== collegeId) : [...prev, collegeId];
      try {
        localStorage.setItem('forenclue_saved_colleges', JSON.stringify(updated));
      } catch (err) {
        console.error('Failed to save college bookmark:', err);
      }
      return updated;
    });
  }, []);

  // Toggle college in comparison list (up to MAX_COMPARE_COLLEGES)
  const handleToggleCompare = useCallback((collegeId: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    setCompareCollegeIds(prev => {
      const exists = prev.includes(collegeId);
      if (exists) {
        const updated = prev.filter(id => id !== collegeId);
        try {
          localStorage.setItem(COMPARE_COLLEGES_KEY, JSON.stringify(updated));
        } catch {
          // Ignore storage error
        }
        return updated;
      }
      if (prev.length >= MAX_COMPARE_COLLEGES) {
        setSyncNotice(`You can compare up to ${MAX_COMPARE_COLLEGES} colleges at a time. Remove one to add another.`);
        return prev;
      }
      const updated = [...prev, collegeId];
      try {
        localStorage.setItem(COMPARE_COLLEGES_KEY, JSON.stringify(updated));
      } catch {
        // Ignore storage error
      }
      return updated;
    });
  }, []);

  const handleSetCompareIds = useCallback((ids: string[]) => {
    const trimmed = ids.slice(0, MAX_COMPARE_COLLEGES);
    setCompareCollegeIds(trimmed);
    try {
      localStorage.setItem(COMPARE_COLLEGES_KEY, JSON.stringify(trimmed));
    } catch {
      // Ignore storage error
    }
  }, []);

  const handleClearCompare = useCallback(() => {
    setCompareCollegeIds([]);
    try {
      localStorage.removeItem(COMPARE_COLLEGES_KEY);
    } catch {
      // Ignore storage error
    }
  }, []);

  // Share link handler with Web Share API + Clipboard fallback
  const handleShareCollege = useCallback(async (e: React.MouseEvent | null, college: College, isCard = false) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    const shareUrl = `${window.location.origin}/colleges/${college.id}`;
    const shareData = {
      title: `${college.name} | ForenClue Forensic Colleges Directory`,
      text: `Explore forensic science programs, fee structure, eligibility, and campus details for ${college.name} (${college.city}, ${college.state || college.country}) on ForenClue.`,
      url: shareUrl,
    };

    if (typeof navigator !== 'undefined' && navigator.share && window.matchMedia('(pointer: coarse)').matches) {
      try {
        await navigator.share(shareData);
        return;
      } catch (err: any) {
        if (err?.name === 'AbortError') return;
      }
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
    } catch {
      const textArea = document.createElement('textarea');
      textArea.value = shareUrl;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }

    if (isCard) {
      setCopiedCardId(college.id);
      setTimeout(() => setCopiedCardId(prev => (prev === college.id ? null : prev)), 2200);
    } else {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  }, []);

  // Precompute search index per college for fast, multi-token matching
  const collegeSearchIndexMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const c of colleges) {
      map.set(c.id, buildCollegeSearchIndex(c));
    }
    return map;
  }, [colleges]);

  // Derive unique Filter Options
  const countries = useMemo(() => {
    const set = new Set(colleges.map(c => c.country).filter(Boolean));
    return ['All', ...Array.from(set).sort()];
  }, [colleges]);

  const states = useMemo(() => {
    let filtered = colleges;
    if (selectedCountry !== 'All') {
      filtered = filtered.filter(c => c.country === selectedCountry);
    }
    const set = new Set(filtered.map(c => c.state).filter(Boolean));
    return ['All', ...Array.from(set).sort()];
  }, [colleges, selectedCountry]);

  const cities = useMemo(() => {
    let filtered = colleges;
    if (selectedCountry !== 'All') filtered = filtered.filter(c => c.country === selectedCountry);
    if (selectedState !== 'All') filtered = filtered.filter(c => c.state === selectedState);
    const set = new Set(filtered.map(c => c.city).filter(Boolean));
    return ['All', ...Array.from(set).sort()];
  }, [colleges, selectedCountry, selectedState]);

  // Ensure cascading state/city filters stay valid if parent option changes
  useEffect(() => {
    if (selectedState !== 'All' && states.length > 1 && !states.includes(selectedState)) {
      setSelectedState('All');
    }
  }, [states, selectedState]);

  useEffect(() => {
    if (selectedCity !== 'All' && cities.length > 1 && !cities.includes(selectedCity)) {
      setSelectedCity('All');
    }
  }, [cities, selectedCity]);

  // Filtered & Sorted Colleges
  const filteredColleges = useMemo(() => {
    const rawQuery = searchQuery.trim();
    const normQuery = normalizeSearchText(rawQuery);
    const abbrevQuery = normalizeAbbrevText(rawQuery);
    const queryTokens = abbrevQuery ? abbrevQuery.split(' ').filter(Boolean) : [];

    const list = colleges.filter(college => {
      if (queryTokens.length > 0) {
        const indexed = collegeSearchIndexMap.get(college.id) || '';
        const matchesFull = normQuery && indexed.includes(normQuery);
        const matchesAllTokens = queryTokens.every(token => indexed.includes(token));
        if (!matchesFull && !matchesAllTokens) return false;
      }

      if (selectedCountry !== 'All' && college.country !== selectedCountry) return false;
      if (selectedState !== 'All' && college.state !== selectedState) return false;
      if (selectedCity !== 'All' && college.city !== selectedCity) return false;
      if (!matchesInstitutionTypeFilter(college, selectedType)) return false;

      if (selectedDegree !== 'All') {
        const hasDegree = (college.coursesOffered || []).some(c =>
          matchesCourseDegreeLevel(c, selectedDegree)
        );
        if (!hasDegree) return false;
      }

      if (featuredOnly && !college.featured) return false;
      if (savedOnly && !savedCollegeIds.includes(college.id)) return false;

      return true;
    });

    return list.sort((a, b) => {
      if (sortBy === 'featured') {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return a.name.localeCompare(b.name);
      }
      if (sortBy === 'name-asc') {
        return a.name.localeCompare(b.name);
      }
      if (sortBy === 'name-desc') {
        return b.name.localeCompare(a.name);
      }
      if (sortBy === 'courses-desc') {
        const diff = (b.coursesOffered?.length || 0) - (a.coursesOffered?.length || 0);
        return diff !== 0 ? diff : a.name.localeCompare(b.name);
      }
      if (sortBy === 'fee-asc') {
        const diff = parseNumericMinFee(a) - parseNumericMinFee(b);
        return diff !== 0 ? diff : a.name.localeCompare(b.name);
      }
      return 0;
    });
  }, [
    colleges,
    collegeSearchIndexMap,
    searchQuery,
    selectedCountry,
    selectedState,
    selectedCity,
    selectedType,
    selectedDegree,
    featuredOnly,
    savedOnly,
    savedCollegeIds,
    sortBy,
  ]);

  // Slice visible colleges for instant, lightweight DOM rendering
  const visibleColleges = useMemo(() => {
    return filteredColleges.slice(0, visibleCount);
  }, [filteredColleges, visibleCount]);

  // Reset visible batch count to BATCH_SIZE whenever filter or search conditions change
  useEffect(() => {
    if (loadMoreTimerRef.current) {
      clearTimeout(loadMoreTimerRef.current);
      loadMoreTimerRef.current = null;
    }
    setIsLoadingMore(false);
    setVisibleCount(BATCH_SIZE);
  }, [
    searchQuery,
    selectedCountry,
    selectedState,
    selectedCity,
    selectedType,
    selectedDegree,
    featuredOnly,
    savedOnly,
    sortBy,
  ]);

  // Trigger smooth skeleton loading transition before revealing next batch of colleges
  const triggerLoadMoreBatch = useCallback(() => {
    if (isLoadingMore || visibleCount >= filteredColleges.length) return;
    setIsLoadingMore(true);
    if (loadMoreTimerRef.current) clearTimeout(loadMoreTimerRef.current);
    loadMoreTimerRef.current = setTimeout(() => {
      setVisibleCount((prev) => Math.min(filteredColleges.length, prev + BATCH_SIZE));
      setIsLoadingMore(false);
      loadMoreTimerRef.current = null;
    }, 420);
  }, [isLoadingMore, visibleCount, filteredColleges.length]);

  useEffect(() => {
    return () => {
      if (loadMoreTimerRef.current) {
        clearTimeout(loadMoreTimerRef.current);
      }
    };
  }, []);

  // Progressive loading intersection observer for smooth, gentle skeleton scroll loading
  useEffect(() => {
    if (visibleCount >= filteredColleges.length || isLoadingMore) return;
    const sentinel = loadMoreSentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          triggerLoadMoreBatch();
        }
      },
      { rootMargin: '260px 0px' }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [visibleCount, filteredColleges.length, isLoadingMore, triggerLoadMoreBatch]);

  const recordReturnCollege = useCallback((collegeId: string) => {
    lastTargetIdRef.current = collegeId;
    try {
      sessionStorage.setItem(RETURN_TO_COLLEGE_KEY, collegeId);
    } catch {
      // Ignore storage errors
    }
  }, []);

  const handleOpenDetails = useCallback((college: College) => {
    recordReturnCollege(college.id);
    navigate(`/colleges/${college.id}`);
  }, [navigate, recordReturnCollege]);

  const clearSearch = useCallback(() => {
    setSearchInput('');
    setSearchQuery('');
    searchInputRef.current?.focus();
  }, []);

  const resetFilters = useCallback(() => {
    setSearchInput('');
    setSearchQuery('');
    setSelectedCountry('All');
    setSelectedState('All');
    setSelectedCity('All');
    setSelectedDegree('All');
    setSelectedType('All');
    setFeaturedOnly(false);
    setSavedOnly(false);
    setSearchParams({}, { replace: true });
  }, [setSearchParams]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (searchQuery.trim()) count++;
    if (selectedCountry !== 'All') count++;
    if (selectedState !== 'All') count++;
    if (selectedCity !== 'All') count++;
    if (selectedType !== 'All') count++;
    if (selectedDegree !== 'All') count++;
    if (featuredOnly) count++;
    if (savedOnly) count++;
    return count;
  }, [searchQuery, selectedCountry, selectedState, selectedCity, selectedType, selectedDegree, featuredOnly, savedOnly]);

  // Restore scroll position directly to the opened college card when returning to /colleges
  useEffect(() => {
    if (targetId || loading || colleges.length === 0) return;

    let returnCollegeId = lastTargetIdRef.current;
    if (!returnCollegeId) {
      try {
        returnCollegeId = sessionStorage.getItem(RETURN_TO_COLLEGE_KEY);
      } catch {
        returnCollegeId = null;
      }
    }

    if (!returnCollegeId) return;

    const matchedInFiltered = matchCollegeBySlug(filteredColleges, returnCollegeId);
    const matchedInAll = matchCollegeBySlug(colleges, returnCollegeId);

    // If active filters hid the college card we are returning to, clear filters first so the card is visible
    if (!matchedInFiltered && matchedInAll) {
      resetFilters();
      return;
    }

    const resolvedId = matchedInFiltered?.id || matchedInAll?.id || returnCollegeId;
    const targetIdx = filteredColleges.findIndex(c => c.id === resolvedId);
    if (targetIdx >= 0 && targetIdx >= visibleCount) {
      setVisibleCount(Math.min(filteredColleges.length, Math.ceil((targetIdx + 1) / BATCH_SIZE) * BATCH_SIZE));
    }
    const cardDomId = `college-card-${resolvedId}`;

    const scrollToCard = () => {
      const cardEl = document.getElementById(cardDomId);
      if (cardEl) {
        const rect = cardEl.getBoundingClientRect();
        const targetTop = Math.max(0, rect.top + window.scrollY - 115);
        window.scrollTo({ top: targetTop, left: 0, behavior: 'instant' });
        return true;
      }
      return false;
    };

    // Execute immediately and reinforce across animation frames to prevent any layout/footer jump
    scrollToCard();
    const rafId = requestAnimationFrame(() => {
      scrollToCard();
    });
    const timer1 = setTimeout(scrollToCard, 50);
    const timer2 = setTimeout(() => {
      scrollToCard();
      lastTargetIdRef.current = null;
      try {
        sessionStorage.removeItem(RETURN_TO_COLLEGE_KEY);
      } catch {
        // Ignore storage errors
      }
    }, 150);

    if (matchedInFiltered) {
      setHighlightedCollegeId(matchedInFiltered.id);
      const highlightTimer = setTimeout(() => {
        setHighlightedCollegeId(prev => (prev === matchedInFiltered.id ? null : prev));
      }, 2400);
      return () => {
        cancelAnimationFrame(rafId);
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(highlightTimer);
      };
    }

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [targetId, loading, colleges, filteredColleges, resetFilters]);

  // Render Full-Page Dedicated College View if targetId is present in URL
  if (targetId) {
    const college = selectedCollege || matchCollegeBySlug(colleges, targetId);

    if (loading && !college) {
      return (
        <div className="min-h-screen bg-background py-20 px-4 flex flex-col items-center justify-center gap-3">
          <Loader2 size={36} className="animate-spin text-warning" />
          <span className="text-xs font-bold text-text-muted uppercase tracking-wider">Loading College Profile...</span>
        </div>
      );
    }

    if (!college) {
      return (
        <div className="min-h-[75vh] bg-background py-20 px-4 flex flex-col items-center justify-center text-center">
          <Building2 size={56} className="text-warning mb-4 opacity-40" />
          <h1 className="text-2xl sm:text-3xl font-black text-text-main mb-2">College Record Not Found</h1>
          <p className="text-sm text-text-muted mb-8 max-w-md">
            The requested university or college record (<span className="font-mono text-warning">{targetId}</span>) could not be located in our directory.
          </p>
          <Link
            to="/colleges"
            className="px-6 py-3.5 rounded-xl bg-warning text-crust font-black text-xs uppercase tracking-wider shadow-lg hover:bg-warning/90 transition-all flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            <span>Back to Colleges Directory</span>
          </Link>
        </div>
      );
    }

    const isSaved = savedCollegeIds.includes(college.id);

    // Distinct course degree categories for this college
    const availableCourseTabs = ['All', ...Array.from(new Set(college.coursesOffered.map(c => c.degreeLevel).filter(Boolean)))];
    const displayedCourses = activeCourseDegreeTab === 'All'
      ? college.coursesOffered
      : college.coursesOffered.filter(c => c.degreeLevel === activeCourseDegreeTab);

    // Strictly match other colleges in the same state first
    const sameStateColleges = college.state
      ? colleges.filter(
          c =>
            c.id !== college.id &&
            c.state &&
            c.state.trim().toLowerCase() === college.state.trim().toLowerCase()
        )
      : [];

    const hasSameStateColleges = sameStateColleges.length > 0;
    const relatedRegionLabel = hasSameStateColleges
      ? college.state
      : college.country || 'India';

    const relatedColleges = (
      hasSameStateColleges
        ? sameStateColleges
        : colleges.filter(
            c =>
              c.id !== college.id &&
              (!college.country || c.country.trim().toLowerCase() === college.country.trim().toLowerCase())
          )
    ).slice(0, 3);

    const totalRelatedInRegion = hasSameStateColleges
      ? sameStateColleges.length
      : colleges.filter(c => c.id !== college.id).length;

    // Structured Data Schema for this specific college
    const collegeCustomSchema = [
      {
        '@type': 'CollegeOrUniversity',
        '@id': `https://forenclue.in/colleges/${college.id}#college`,
        'name': college.name,
        'alternateName': college.shortName || undefined,
        'description': college.description,
        'url': `https://forenclue.in/colleges/${college.id}`,
        'sameAs': college.website ? [college.website] : undefined,
        'logo': college.logo || undefined,
        'image': college.bannerImage || undefined,
        'telephone': college.contactPhone || undefined,
        'email': college.contactEmail || undefined,
        'address': {
          '@type': 'PostalAddress',
          'streetAddress': college.address || college.city,
          'addressLocality': college.city,
          'addressRegion': college.state,
          'addressCountry': college.country,
        },
        'hasOfferCatalog': {
          '@type': 'OfferCatalog',
          'name': `Forensic Science Programs at ${college.name}`,
          'itemListElement': college.coursesOffered.map((course, idx) => ({
            '@type': 'Course',
            'position': idx + 1,
            'name': course.name,
            'educationalCredentialAwarded': course.degreeLevel,
            'timeRequired': course.duration,
            'description': `${course.name} (${course.degreeLevel}, ${course.duration}) at ${college.name}. ${course.eligibility ? `Eligibility: ${course.eligibility}.` : ''}`,
            'provider': {
              '@type': 'CollegeOrUniversity',
              'name': college.name,
            },
          })),
        },
      },
    ];

    return (
      <div
        key={`college-detail-${college.id}`}
        className={cn(
          'min-h-screen bg-background pt-6',
          compareCollegeIds.length > 0 ? 'pb-36' : 'pb-20'
        )}
        style={{ overflowAnchor: 'none' }}
      >
        <SEOManager
          fallbackTitle={`${college.name} — Forensic Science Courses, Fees & Admission`}
          fallbackDescription={college.description}
          canonicalPath={`/colleges/${college.id}`}
          fallbackImage={college.bannerImage || college.logo || 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEigBhuL76TN0HRboJtSqMyjwBxyV_Z-HYJ4W8QpLPhYiJQDfbLfXbXBZAYb9GHXpqDuOekfsthvORaaitUq59u3Mjvlv0SurAKv6xTR3VyP9zj1nriYXLqhFGBXzjHmjjAXiqHAn9yWldwtwDS336Sh55PhcfIGgf1PrqAu9iPhVgL-XEpaht8ActVJv_g/s1600/image.png'}
          keywords={`${college.name}, ${college.shortName || ''}, forensic science college ${college.city}, ${college.state} forensic university, bsc forensic science, msc forensic science, ${college.coursesOffered.map(c => c.name).join(', ')}`}
          breadcrumbs={[
            { name: 'Home', path: '/' },
            { name: 'Colleges Directory', path: '/colleges' },
            { name: college.shortName || college.name, path: `/colleges/${college.id}` },
          ]}
          customSchema={collegeCustomSchema}
        />

        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 space-y-5 sm:space-y-8"
        >
          {/* Breadcrumb & Top Bar Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
            <div className="flex flex-wrap items-center justify-between sm:justify-start gap-2 sm:gap-3">
              <Link
                to="/colleges"
                onClick={() => recordReturnCollege(college.id)}
                className="inline-flex items-center justify-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-xl bg-surface border border-black/10 dark:border-white/10 text-xs font-bold text-text-main hover:border-warning/50 hover:text-warning transition-all min-h-[44px] shadow-sm focus-visible:outline-2 focus-visible:outline-warning w-full sm:w-auto"
              >
                <ArrowLeft size={16} />
                <span>Back to Colleges Directory</span>
              </Link>

              <nav aria-label="Breadcrumb" className="hidden md:flex items-center gap-1.5 text-xs text-text-muted font-medium">
                <Link to="/" className="hover:text-warning transition-colors">Home</Link>
                <ChevronRight size={13} className="opacity-50" />
                <Link to="/colleges" onClick={() => recordReturnCollege(college.id)} className="hover:text-warning transition-colors">Colleges</Link>
                <ChevronRight size={13} className="opacity-50" />
                <span className="text-text-main font-semibold truncate max-w-[260px]" aria-current="page">
                  {college.shortName || college.name}
                </span>
              </nav>
            </div>

            <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={(e) => handleToggleCompare(college.id, e)}
                aria-pressed={compareCollegeIds.includes(college.id)}
                className={cn(
                  'px-3 sm:px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 sm:gap-2 transition-all min-h-[44px] border shadow-sm cursor-pointer focus-visible:outline-2 focus-visible:outline-warning',
                  compareCollegeIds.includes(college.id)
                    ? 'bg-warning text-crust border-warning font-black'
                    : 'bg-surface border-black/10 dark:border-white/10 text-text-main hover:border-warning/50'
                )}
              >
                {compareCollegeIds.includes(college.id) ? <Check size={15} /> : <Scale size={15} className="text-warning shrink-0" />}
                <span className="truncate">
                  {compareCollegeIds.includes(college.id)
                    ? `Comparing (${compareCollegeIds.length}/${MAX_COMPARE_COLLEGES})`
                    : 'Compare'}
                </span>
              </button>

              {compareCollegeIds.length > 0 && (
                <button
                  type="button"
                  onClick={() => setIsCompareModalOpen(true)}
                  className="px-3 sm:px-4 py-2.5 rounded-xl bg-warning/15 border border-warning/40 text-warning hover:bg-warning hover:text-crust text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all min-h-[44px] cursor-pointer"
                >
                  <Scale size={14} className="shrink-0" />
                  <span>Matrix ({compareCollegeIds.length})</span>
                </button>
              )}

              <button
                type="button"
                onClick={(e) => toggleSaveCollege(e, college.id)}
                aria-pressed={isSaved}
                aria-label={isSaved ? `Remove ${college.name} from saved colleges` : `Save ${college.name} to bookmarks`}
                className={cn(
                  'px-3 sm:px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 sm:gap-2 transition-all min-h-[44px] border shadow-sm cursor-pointer focus-visible:outline-2 focus-visible:outline-warning',
                  isSaved
                    ? 'bg-warning/15 border-warning text-warning'
                    : 'bg-surface border-black/10 dark:border-white/10 text-text-main hover:border-warning/50'
                )}
              >
                <Bookmark size={15} className={cn('shrink-0', isSaved && 'fill-warning')} />
                <span className="truncate">{isSaved ? 'Saved' : 'Save'}</span>
              </button>

              <button
                type="button"
                onClick={(e) => handleShareCollege(e, college, false)}
                aria-label={`Share link to ${college.name}`}
                className="px-3 sm:px-4 py-2.5 rounded-xl bg-surface border border-black/10 dark:border-white/10 text-text-main hover:border-warning/50 text-xs font-bold flex items-center justify-center gap-1.5 sm:gap-2 transition-all min-h-[44px] shadow-sm cursor-pointer focus-visible:outline-2 focus-visible:outline-warning"
              >
                {copiedLink ? <Check size={15} className="text-emerald-500 shrink-0" /> : <Share2 size={15} className="shrink-0" />}
                <span className="truncate">{copiedLink ? 'Copied!' : 'Share'}</span>
              </button>
            </div>
          </div>

          {/* Full Page Hero Header Card */}
          <div className="relative rounded-2xl sm:rounded-3xl bg-surface border border-black/10 dark:border-white/10 overflow-hidden shadow-xl">
            {/* Banner Cover Image */}
            <div className="relative h-48 sm:h-80 w-full overflow-hidden bg-crust">
              <CollegeBannerImage
                college={college}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/75 to-black/60" />
            </div>

            {/* Hero Details Header */}
            <div className="relative -mt-16 sm:-mt-32 p-4 sm:p-10 space-y-5 sm:space-y-6">
              <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 sm:gap-6">
                {/* Logo, Title & Badges */}
                <div className="flex flex-col sm:flex-row items-start gap-3.5 sm:gap-5 w-full">
                  <CollegeLogoBadge college={college} size="lg" />

                  <div className="space-y-2 min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                      <span className="px-2.5 sm:px-3 py-1 rounded-full bg-warning text-crust font-black text-[10px] sm:text-xs uppercase tracking-wider shadow-xs">
                        {getDisplayInstitutionType(college)}
                      </span>
                      {college.accreditation && (
                        <span className="px-2.5 sm:px-3 py-1 rounded-full bg-black/75 backdrop-blur-md text-amber-300 font-bold text-[10px] sm:text-xs uppercase tracking-wider border border-amber-500/30">
                          {college.accreditation.split('|')[0].trim()}
                        </span>
                      )}
                      {college.featured && (
                        <span className="px-2.5 sm:px-3 py-1 rounded-full bg-amber-500 text-crust font-black text-[10px] sm:text-xs uppercase tracking-wider flex items-center gap-1 shadow-md">
                          <Star size={12} className="fill-crust text-crust" /> Featured
                        </span>
                      )}
                    </div>

                    <h1 className="text-xl sm:text-4xl font-black text-text-main tracking-tight leading-snug sm:leading-tight">
                      {college.name}
                    </h1>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs font-bold text-text-muted">
                      <span className="flex items-center gap-1.5 text-warning font-semibold">
                        <MapPin size={14} className="shrink-0" />
                        {college.city}, {college.state ? `${college.state}, ` : ''}{college.country}
                      </span>
                      {college.ranking && (
                        <span className="flex items-center gap-1.5 text-text-main">
                          <Award size={14} className="text-warning shrink-0" />
                          {college.ranking}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Highlights Summary Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4 pt-4 sm:pt-6 border-t border-black/10 dark:border-white/10">
                <div className="bg-background/85 backdrop-blur-md p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-black/5 dark:border-white/5 space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-wider text-text-muted block">Location</span>
                  <span className="text-xs font-bold text-text-main block truncate" title={`${college.city}, ${college.state ? `${college.state}, ` : ''}${college.country}`}>
                    {college.city}, {college.state || college.country}
                  </span>
                </div>
                <div className="bg-background/85 backdrop-blur-md p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-black/5 dark:border-white/5 space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-wider text-text-muted block">Estimated Fee</span>
                  <span className="text-xs font-black text-warning block truncate" title={formatFee(college.feesRange, college.country) || 'Contact University'}>
                    {formatFee(college.feesRange, college.country) || 'Contact University'}
                  </span>
                </div>
                <div className="bg-background/85 backdrop-blur-md p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-black/5 dark:border-white/5 space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-wider text-text-muted block">Forensic Programs</span>
                  <span className="text-xs font-bold text-text-main block">
                    {college.coursesOffered.length} {college.coursesOffered.length === 1 ? 'Course' : 'Courses'} Offered
                  </span>
                </div>
                <div className="bg-background/85 backdrop-blur-md p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-black/5 dark:border-white/5 space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-wider text-text-muted block">Institution Category</span>
                  <span className="text-xs font-bold text-text-main block truncate">
                    {getDisplayInstitutionType(college)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Grid Content Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left 2 Columns: Deep Details */}
            <div className="lg:col-span-2 space-y-8">
              {/* Campus Overview */}
              <section className="bg-surface border border-black/10 dark:border-white/10 rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
                <h2 className="text-xs font-black uppercase tracking-widest text-warning flex items-center gap-2">
                  <Info size={18} /> Campus Overview & Background
                </h2>
                <p className="text-sm sm:text-base text-text-main dark:text-white leading-relaxed font-medium">
                  {college.description}
                </p>
                {college.accreditation && (
                  <div className="pt-3 border-t border-black/5 dark:border-white/5 flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-black uppercase tracking-wider text-text-muted">Approvals & Accreditations:</span>
                    {college.accreditation.split('|').map((item, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg bg-background border border-black/10 dark:border-white/10 text-xs font-bold text-text-main"
                      >
                        {item.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </section>

              {/* Forensic Courses Offered */}
              <section className="bg-surface border border-black/10 dark:border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-8 space-y-5 sm:space-y-6 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pb-4 border-b border-black/10 dark:border-white/10">
                  <h2 className="text-xs font-black uppercase tracking-widest text-warning flex items-center gap-2">
                    <GraduationCap size={18} className="shrink-0" /> Forensic Science Degree Programs ({college.coursesOffered.length})
                  </h2>

                  {availableCourseTabs.length > 2 && (
                    <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 -mx-1 px-1 sm:flex-wrap" role="tablist" aria-label="Filter courses by degree level">
                      {availableCourseTabs.map(tab => (
                        <button
                          key={tab}
                          type="button"
                          role="tab"
                          aria-selected={activeCourseDegreeTab === tab}
                          onClick={() => setActiveCourseDegreeTab(tab)}
                          className={cn(
                            'px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer shrink-0 min-h-[36px]',
                            activeCourseDegreeTab === tab
                              ? 'bg-warning text-crust font-black shadow-xs'
                              : 'bg-background text-text-muted hover:text-text-main border border-black/5 dark:border-white/10'
                          )}
                        >
                          {tab === 'All' ? `All (${college.coursesOffered.length})` : tab}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  {displayedCourses.map((course, idx) => (
                    <div
                      key={`${course.name}-${idx}`}
                      className="bg-background border border-black/10 dark:border-white/10 rounded-2xl p-5 space-y-4 hover:border-warning/40 transition-colors shadow-sm"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <h3 className="text-base sm:text-lg font-black text-text-main">
                          {course.name}
                        </h3>
                        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto shrink-0">
                          <span className="px-3 py-1.5 rounded-xl bg-warning/10 text-warning font-black text-xs uppercase tracking-wider border border-warning/20">
                            {course.degreeLevel} • {course.duration}
                          </span>
                          {course.mode && (
                            <span className="px-2.5 py-1.5 rounded-xl bg-surface border border-black/10 dark:border-white/10 text-text-muted font-bold text-xs">
                              {course.mode}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-semibold text-text-muted pt-3 border-t border-black/5 dark:border-white/5">
                        {course.eligibility && (
                          <div className="bg-surface p-3.5 rounded-xl border border-black/5 dark:border-white/5 space-y-1">
                            <span className="text-text-main font-bold block text-[11px] uppercase tracking-wider">Eligibility Criteria:</span>
                            <span className="text-text-muted leading-relaxed block">{course.eligibility}</span>
                          </div>
                        )}
                        {course.estimatedFees && (
                          <div className="bg-surface p-3.5 rounded-xl border border-black/5 dark:border-white/5 space-y-1">
                            <span className="text-text-main font-bold block text-[11px] uppercase tracking-wider">Tuition Fee:</span>
                            <span className="text-warning font-black text-sm block">{formatFee(course.estimatedFees, college.country)}</span>
                          </div>
                        )}
                      </div>

                      {course.specializations && course.specializations.length > 0 && (
                        <div className="pt-2 space-y-2">
                          <span className="text-[11px] font-black uppercase tracking-wider text-text-muted block">
                            Key Modules & Specializations:
                          </span>
                          <div className="flex flex-wrap items-center gap-1.5">
                            {course.specializations.map((spec, sIdx) => (
                              <span
                                key={sIdx}
                                className="px-2.5 py-1 rounded-lg bg-surface border border-black/10 dark:border-white/10 text-xs font-bold text-text-main"
                              >
                                {spec}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>

              {/* Admission Process */}
              {college.admissionProcess && (
                <section className="bg-surface border border-amber-500/30 rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
                  <h2 className="text-xs font-black uppercase tracking-widest text-warning flex items-center gap-2">
                    <FileText size={18} /> Admission Procedure & Entrance Examinations
                  </h2>
                  <p className="text-xs sm:text-sm text-text-main leading-relaxed font-semibold">
                    {college.admissionProcess}
                  </p>
                </section>
              )}

              {/* Campus Facilities */}
              {college.facilities && college.facilities.length > 0 && (
                <section className="bg-surface border border-black/10 dark:border-white/10 rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
                  <h2 className="text-xs font-black uppercase tracking-widest text-warning flex items-center gap-2">
                    <Building2 size={18} /> Campus Infrastructure & Laboratories
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {college.facilities.map((fac, fIdx) => (
                      <div
                        key={fIdx}
                        className="p-3.5 rounded-2xl bg-background border border-black/5 dark:border-white/5 text-xs font-bold text-text-main flex items-center gap-3"
                      >
                        <CheckCircle2 size={16} className="text-warning shrink-0" />
                        <span>{fac}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Right 1 Column Sidebar */}
            <aside className="space-y-6">
              <div className="bg-surface border border-black/10 dark:border-white/10 rounded-3xl p-6 space-y-5 shadow-sm sticky top-24">
                <h2 className="text-xs font-black uppercase tracking-widest text-text-main border-b border-black/10 dark:border-white/10 pb-3">
                  University Summary
                </h2>

                <div className="space-y-3.5 text-xs font-bold">
                  <div className="flex justify-between items-center gap-3 py-1 border-b border-black/5 dark:border-white/5">
                    <span className="text-text-muted shrink-0">Type:</span>
                    <span className="text-text-main font-black text-right">{getDisplayInstitutionType(college)}</span>
                  </div>
                  <div className="flex justify-between items-center gap-3 py-1 border-b border-black/5 dark:border-white/5">
                    <span className="text-text-muted shrink-0">City / Region:</span>
                    <span className="text-text-main text-right">{college.city}, {college.state || college.country}</span>
                  </div>
                  <div className="flex justify-between items-center gap-3 py-1 border-b border-black/5 dark:border-white/5">
                    <span className="text-text-muted shrink-0">Country:</span>
                    <span className="text-text-main text-right">{college.country}</span>
                  </div>
                  {college.accreditation && (
                    <div className="flex justify-between items-start gap-3 py-1 border-b border-black/5 dark:border-white/5">
                      <span className="text-text-muted shrink-0">Accreditation:</span>
                      <span className="text-amber-600 dark:text-amber-400 font-bold text-right">
                        {college.accreditation.split('|')[0].trim()}
                      </span>
                    </div>
                  )}
                  {college.feesRange && (
                    <div className="flex justify-between items-center gap-3 py-1 border-b border-black/5 dark:border-white/5">
                      <span className="text-text-muted shrink-0">Est. Annual Fee:</span>
                      <span className="text-warning font-black text-right">{formatFee(college.feesRange, college.country)}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center gap-3 py-1">
                    <span className="text-text-muted shrink-0">Programs Listed:</span>
                    <span className="text-text-main font-bold text-right">{college.coursesOffered.length} Courses</span>
                  </div>
                </div>

                {/* Contact details */}
                {(college.address || college.contactEmail || college.contactPhone) && (
                  <div className="pt-4 border-t border-black/10 dark:border-white/10 space-y-3">
                    <span className="text-[11px] font-black uppercase tracking-wider text-text-muted block">Contact Information</span>
                    {college.address && (
                      <p className="text-xs text-text-muted leading-relaxed font-semibold">
                        {college.address}
                      </p>
                    )}
                    {college.contactEmail && (
                      <a
                        href={`mailto:${college.contactEmail}`}
                        className="flex items-center gap-2 text-xs font-bold text-warning hover:underline truncate"
                      >
                        <Mail size={14} className="shrink-0" />
                        <span className="truncate">{college.contactEmail}</span>
                      </a>
                    )}
                    {college.contactPhone && (
                      <a
                        href={`tel:${college.contactPhone.split('/')[0].replace(/[^\d+]/g, '')}`}
                        className="flex items-center gap-2 text-xs font-bold text-text-main hover:text-warning transition-colors"
                      >
                        <Phone size={14} className="text-warning shrink-0" />
                        <span>{college.contactPhone}</span>
                      </a>
                    )}
                  </div>
                )}

                {college.website && (
                  <a
                    href={college.website.startsWith('http') ? college.website : `https://${college.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 px-4 bg-warning text-crust font-black text-xs uppercase tracking-wider rounded-xl shadow-lg hover:bg-warning/90 transition-all flex items-center justify-center gap-2 mt-4 min-h-[44px]"
                  >
                    <span>Visit Official Website</span>
                    <ExternalLink size={14} />
                  </a>
                )}
              </div>
            </aside>
          </div>

          {/* Related Forensic Institutions */}
          {relatedColleges.length > 0 && (
            <section className="pt-6 sm:pt-8 border-t border-black/10 dark:border-white/10 space-y-4 sm:space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
                <h2 className="text-xs sm:text-base font-black uppercase tracking-wider text-text-main flex items-center gap-2">
                  <Building2 size={18} className="text-warning shrink-0" />
                  <span>Other Forensic Science Institutions in {relatedRegionLabel}</span>
                </h2>
                <Link
                  to={
                    hasSameStateColleges && college.state
                      ? `/colleges?state=${encodeURIComponent(college.state)}`
                      : '/colleges'
                  }
                  onClick={() => {
                    if (hasSameStateColleges && college.state) {
                      setSelectedCountry(college.country || 'All');
                      setSelectedState(college.state);
                      setSelectedCity('All');
                    } else {
                      recordReturnCollege(college.id);
                    }
                  }}
                  className="text-xs font-bold text-warning hover:underline inline-flex items-center gap-1 self-start sm:self-auto shrink-0"
                >
                  <span>
                    {hasSameStateColleges
                      ? `View All in ${college.state} (${totalRelatedInRegion + 1})`
                      : `View All (${colleges.length})`}
                  </span>
                  <ChevronRight size={14} />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {relatedColleges.map(rel => (
                  <Link
                    key={rel.id}
                    to={`/colleges/${rel.id}`}
                    className="group bg-surface border border-black/10 dark:border-white/10 rounded-2xl p-5 hover:border-warning/40 transition-all shadow-sm hover:shadow-md flex flex-col justify-between gap-4"
                  >
                    <div className="flex items-start gap-3.5">
                      <CollegeLogoBadge college={rel} size="sm" />
                      <div className="min-w-0 space-y-1">
                        <span className="text-[10px] font-black uppercase tracking-wider text-warning block">
                          {getDisplayInstitutionType(rel)}
                        </span>
                        <h3 className="text-sm font-black text-text-main group-hover:text-warning transition-colors line-clamp-2">
                          {rel.name}
                        </h3>
                        <p className="text-xs text-text-muted flex items-center gap-1">
                          <MapPin size={12} className="text-warning shrink-0" />
                          <span className="truncate">{rel.city}, {rel.state || rel.country}</span>
                        </p>
                      </div>
                    </div>

                     <div className="pt-3 border-t border-black/5 dark:border-white/5 flex items-center justify-between gap-2 text-xs font-bold">
                      <span className="text-text-muted truncate">{rel.coursesOffered.length} Programs</span>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={(e) => handleToggleCompare(rel.id, e)}
                          className={cn(
                            'px-2.5 py-1 rounded-lg border text-[11px] font-black uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer',
                            compareCollegeIds.includes(rel.id)
                              ? 'bg-warning text-crust border-warning'
                              : 'bg-background border-black/10 dark:border-white/10 text-text-main hover:border-warning/50 hover:text-warning'
                          )}
                        >
                          {compareCollegeIds.includes(rel.id) ? <Check size={11} /> : <Scale size={11} className="text-warning" />}
                          <span>{compareCollegeIds.includes(rel.id) ? 'Added' : 'Compare'}</span>
                        </button>
                        <span className="text-warning flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                          Explore <ChevronRight size={13} />
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </motion.div>

        <CollegeComparisonSystem
          colleges={colleges}
          compareIds={compareCollegeIds}
          isOpen={isCompareModalOpen}
          onClose={() => setIsCompareModalOpen(false)}
          onOpen={() => setIsCompareModalOpen(true)}
          onToggleCompare={(cId) => handleToggleCompare(cId)}
          onSetCompareIds={handleSetCompareIds}
          onClearCompare={handleClearCompare}
          getDisplayInstitutionType={getDisplayInstitutionType}
          parseNumericMinFee={parseNumericMinFee}
          matchesCourseDegreeLevel={matchesCourseDegreeLevel}
        />
      </div>
    );
  }

  // Structured data for the directory listing page
  const directorySchema = [
    {
      '@type': 'ItemList',
      '@id': 'https://forenclue.in/colleges#directory-list',
      'name': 'Forensic Science Colleges & Universities Directory',
      'description': 'Verified directory of top universities and government institutes offering B.Sc., M.Sc., PG Diploma, and Ph.D. programs in Forensic Science and Cyber Forensics.',
      'numberOfItems': filteredColleges.length,
      'itemListElement': filteredColleges.slice(0, 25).map((c, idx) => ({
        '@type': 'ListItem',
        'position': idx + 1,
        'name': c.name,
        'url': `https://forenclue.in/colleges/${c.id}`,
      })),
    },
  ];

  // Render Colleges Directory Page
  return (
    <div
      key="college-directory-view"
      className={cn(
        'min-h-screen bg-background',
        compareCollegeIds.length > 0 ? 'pb-36' : 'pb-20'
      )}
      style={{ overflowAnchor: 'none' }}
    >
      <SEOManager 
        fallbackTitle="Forensic Science Colleges & Universities Directory"
        fallbackDescription="Explore top global and Indian universities, NFSU campuses, and government institutes offering accredited B.Sc., M.Sc., PG Diploma, and Ph.D. forensic science degree programs."
        canonicalPath="/colleges"
        fallbackImage="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEigBhuL76TN0HRboJtSqMyjwBxyV_Z-HYJ4W8QpLPhYiJQDfbLfXbXBZAYb9GHXpqDuOekfsthvORaaitUq59u3Mjvlv0SurAKv6xTR3VyP9zj1nriYXLqhFGBXzjHmjjAXiqHAn9yWldwtwDS336Sh55PhcfIGgf1PrqAu9iPhVgL-XEpaht8ActVJv_g/s1600/image.png"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Forensic Colleges', path: '/colleges' },
        ]}
        customSchema={directorySchema}
      />

      {/* Hero Banner Header */}
      <section className="relative py-8 sm:py-14 lg:py-20 landscape:py-6 bg-surface border-b border-black/10 dark:border-white/10 overflow-hidden">
        {/* Layered University, Campus & City Ambient Background Animations */}
        <div className="absolute inset-0 pointer-events-none select-none overflow-hidden" aria-hidden="true">
          {/* Architectural dot & coordinate blueprint grid */}
          <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:20px_20px] opacity-45 dark:opacity-35 [mask-image:radial-gradient(ellipse_85%_80%_at_50%_45%,#000_55%,transparent_100%)]" />
          <div className="absolute inset-0 forensic-grid opacity-45 [mask-image:radial-gradient(ellipse_75%_70%_at_50%_50%,#000_40%,transparent_100%)]" />

          {/* Smooth drifting aurora orb 1 - Top Right Cyan/Warning */}
          <motion.div
            animate={{
              x: [0, -45, 25, 0],
              y: [0, 35, -20, 0],
              scale: [1, 1.14, 0.94, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 14,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute -top-24 -right-20 w-72 h-72 sm:w-[28rem] sm:h-[28rem] rounded-full bg-gradient-to-br from-warning/25 via-cyan-500/15 to-transparent blur-2xl transform-gpu pointer-events-none"
          />

          {/* Smooth drifting aurora orb 2 - Bottom Left Amber/Gold */}
          <motion.div
            animate={{
              x: [0, 50, -30, 0],
              y: [0, -35, 25, 0],
              scale: [1, 1.18, 0.92, 1],
              opacity: [0.28, 0.48, 0.28],
            }}
            transition={{
              duration: 16,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute -bottom-24 -left-20 w-72 h-72 sm:w-[30rem] sm:h-[30rem] rounded-full bg-gradient-to-tr from-amber-500/25 via-orange-400/15 to-transparent blur-2xl transform-gpu pointer-events-none"
          />

          {/* Smooth breathing center spotlight behind title */}
          <motion.div
            animate={{
              scale: [0.95, 1.08, 0.95],
              opacity: [0.22, 0.42, 0.22],
            }}
            transition={{
              duration: 9,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 sm:w-[48rem] h-40 sm:h-56 rounded-full bg-gradient-to-r from-amber-500/15 via-warning/20 to-amber-400/15 blur-2xl transform-gpu pointer-events-none"
          />

          {/* University Crest & Academic Coat-of-Arms Watermark Ring Behind Title */}
          <div className="absolute top-[42%] sm:top-[44%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[290px] h-[290px] sm:w-[500px] sm:h-[500px] lg:w-[640px] lg:h-[640px] opacity-25 dark:opacity-20 pointer-events-none select-none">
            {/* Outer rotating academic degree compass ring */}
            <motion.svg
              viewBox="0 0 400 400"
              className="w-full h-full text-warning transform-gpu"
              animate={{ rotate: 360 }}
              transition={{ duration: 75, repeat: Infinity, ease: 'linear' }}
            >
              <circle cx="200" cy="200" r="190" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="6 8" opacity="0.45" />
              <circle cx="200" cy="200" r="172" fill="none" stroke="#f59e0b" strokeWidth="0.75" strokeDasharray="2 10" opacity="0.4" />
              {/* Cardinal academic nodes on outer ring */}
              <circle cx="200" cy="10" r="4" fill="currentColor" opacity="0.8" />
              <circle cx="200" cy="390" r="4" fill="#f59e0b" opacity="0.8" />
              <circle cx="10" cy="200" r="3.5" fill="#f59e0b" opacity="0.7" />
              <circle cx="390" cy="200" r="3.5" fill="currentColor" opacity="0.7" />
            </motion.svg>

            {/* Inner counter-rotating laurel & university emblem ring */}
            <motion.svg
              viewBox="0 0 400 400"
              className="absolute inset-0 w-full h-full text-amber-500 transform-gpu"
              animate={{ rotate: -360 }}
              transition={{ duration: 55, repeat: Infinity, ease: 'linear' }}
            >
              <circle cx="200" cy="200" r="138" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="16 12" opacity="0.35" />
              <polygon points="200,56 204,64 196,64" fill="currentColor" opacity="0.6" />
              <polygon points="200,344 204,336 196,336" fill="currentColor" opacity="0.6" />
            </motion.svg>
          </div>

          {/* City-to-University Connection Arcs & Architectural Campus Skyline SVG */}
          <svg
            viewBox="0 0 1440 420"
            fill="none"
            preserveAspectRatio="xMidYMax slice"
            className="absolute inset-x-0 bottom-0 w-full h-full max-h-[420px] opacity-35 dark:opacity-30 hidden sm:block pointer-events-none select-none"
          >
            <defs>
              <linearGradient id="campusSkylineGrad" x1="0" y1="0" x2="1440" y2="0" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.15" />
                <stop offset="25%" stopColor="var(--theme-warning)" stopOpacity="0.45" />
                <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.55" />
                <stop offset="75%" stopColor="var(--theme-warning)" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.15" />
              </linearGradient>
              <linearGradient id="campusBuildingFill" x1="0" y1="220" x2="0" y2="420" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="var(--theme-warning)" stopOpacity="0.14" />
                <stop offset="100%" stopColor="var(--theme-warning)" stopOpacity="0.01" />
              </linearGradient>
              <linearGradient id="amberBuildingFill" x1="0" y1="200" x2="0" y2="420" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.14" />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.01" />
              </linearGradient>
            </defs>

            {/* Animated City-to-College Flight/Network Arcs */}
            {/* Arc 1: Left City Skyline to Central University Rotunda */}
            <motion.path
              d="M 130 330 Q 270 150 420 275"
              stroke="url(#campusSkylineGrad)"
              strokeWidth="1.5"
              strokeDasharray="6 6"
              fill="none"
              animate={{ strokeDashoffset: [48, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            />
            {/* Arc 2: Far Left City Node to Right University Clock Tower */}
            <motion.path
              d="M 210 310 Q 590 70 1015 245"
              stroke="url(#campusSkylineGrad)"
              strokeWidth="1.2"
              strokeDasharray="8 8"
              fill="none"
              opacity="0.65"
              animate={{ strokeDashoffset: [64, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
            />
            {/* Arc 3: Right City/Research Node to Central University Dome */}
            <motion.path
              d="M 1310 325 Q 1160 155 1015 245"
              stroke="url(#campusSkylineGrad)"
              strokeWidth="1.5"
              strokeDasharray="6 6"
              fill="none"
              animate={{ strokeDashoffset: [-48, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: 'linear' }}
            />

            {/* LEFT WING: "YOUR CITY" Metropolitan High-Rises & Location Beacons */}
            <g opacity="0.85">
              {/* City Skyscraper 1 */}
              <rect x="45" y="295" width="42" height="125" fill="url(#amberBuildingFill)" stroke="#f59e0b" strokeWidth="1" strokeOpacity="0.4" />
              <line x1="66" y1="272" x2="66" y2="295" stroke="#f59e0b" strokeWidth="1.2" strokeOpacity="0.5" />
              <circle cx="66" cy="270" r="2.5" fill="#f59e0b" />
              {/* Skyscraper windows */}
              <rect x="53" y="306" width="6" height="6" fill="#f59e0b" opacity="0.35" />
              <rect x="63" y="306" width="6" height="6" fill="#f59e0b" opacity="0.2" />
              <rect x="73" y="306" width="6" height="6" fill="#f59e0b" opacity="0.4" />
              <rect x="53" y="320" width="6" height="6" fill="#f59e0b" opacity="0.2" />
              <rect x="63" y="320" width="6" height="6" fill="#f59e0b" opacity="0.45" />
              <rect x="73" y="320" width="6" height="6" fill="#f59e0b" opacity="0.25" />
              <rect x="53" y="334" width="6" height="6" fill="#f59e0b" opacity="0.4" />
              <rect x="63" y="334" width="6" height="6" fill="#f59e0b" opacity="0.15" />
              <rect x="73" y="334" width="6" height="6" fill="#f59e0b" opacity="0.35" />

              {/* City Stepped Tower 2 */}
              <path d="M 96 420 L 96 320 L 106 320 L 106 302 L 136 302 L 136 320 L 146 320 L 146 420 Z" fill="url(#campusBuildingFill)" stroke="var(--theme-warning)" strokeWidth="1" strokeOpacity="0.4" />
              <rect x="110" y="315" width="22" height="4" fill="var(--theme-warning)" opacity="0.35" />
              <rect x="110" y="328" width="22" height="4" fill="var(--theme-warning)" opacity="0.25" />
              <rect x="110" y="341" width="22" height="4" fill="var(--theme-warning)" opacity="0.4" />

              {/* City Modern Tower 3 */}
              <rect x="158" y="335" width="38" height="85" fill="url(#amberBuildingFill)" stroke="#f59e0b" strokeWidth="1" strokeOpacity="0.35" />
              <line x1="166" y1="345" x2="166" y2="410" stroke="#f59e0b" strokeWidth="1" strokeOpacity="0.25" />
              <line x1="177" y1="345" x2="177" y2="410" stroke="#f59e0b" strokeWidth="1" strokeOpacity="0.25" />
              <line x1="188" y1="345" x2="188" y2="410" stroke="#f59e0b" strokeWidth="1" strokeOpacity="0.25" />
            </g>

            {/* CENTER-LEFT: Classical University Rotunda, Dome & Academic Columns */}
            <g opacity="0.9">
              {/* Grand University Dome */}
              <path d="M 365 290 C 365 242, 475 242, 475 290 Z" fill="url(#campusBuildingFill)" stroke="var(--theme-warning)" strokeWidth="1.3" strokeOpacity="0.55" />
              {/* Cupola & Spire on Dome */}
              <rect x="412" y="238" width="16" height="16" fill="url(#amberBuildingFill)" stroke="#f59e0b" strokeWidth="1" strokeOpacity="0.5" />
              <line x1="420" y1="216" x2="420" y2="238" stroke="#f59e0b" strokeWidth="1.5" strokeOpacity="0.7" />
              <circle cx="420" cy="214" r="3" fill="#f59e0b" />

              {/* Classical Triangular Pediment (Roof of University Hall) */}
              <polygon points="330,320 420,275 510,320" fill="url(#amberBuildingFill)" stroke="#f59e0b" strokeWidth="1.4" strokeOpacity="0.6" />
              <circle cx="420" cy="303" r="8" fill="none" stroke="#f59e0b" strokeWidth="1.2" strokeOpacity="0.55" />

              {/* Entablature Beam */}
              <rect x="336" y="320" width="168" height="8" fill="url(#campusBuildingFill)" stroke="var(--theme-warning)" strokeWidth="1" strokeOpacity="0.5" />

              {/* Main University Hall Body & 6 Classical Pillars */}
              <rect x="342" y="328" width="156" height="82" fill="url(#campusBuildingFill)" stroke="var(--theme-warning)" strokeWidth="1" strokeOpacity="0.4" />
              <line x1="360" y1="328" x2="360" y2="410" stroke="var(--theme-warning)" strokeWidth="2.5" strokeOpacity="0.45" />
              <line x1="384" y1="328" x2="384" y2="410" stroke="var(--theme-warning)" strokeWidth="2.5" strokeOpacity="0.45" />
              <line x1="408" y1="328" x2="408" y2="410" stroke="var(--theme-warning)" strokeWidth="2.5" strokeOpacity="0.45" />
              <line x1="432" y1="328" x2="432" y2="410" stroke="var(--theme-warning)" strokeWidth="2.5" strokeOpacity="0.45" />
              <line x1="456" y1="328" x2="456" y2="410" stroke="var(--theme-warning)" strokeWidth="2.5" strokeOpacity="0.45" />
              <line x1="480" y1="328" x2="480" y2="410" stroke="var(--theme-warning)" strokeWidth="2.5" strokeOpacity="0.45" />

              {/* Central Arched University Entrance */}
              <path d="M 411 410 L 411 372 A 9 9 0 0 1 429 372 L 429 410 Z" fill="#f59e0b" fillOpacity="0.25" stroke="#f59e0b" strokeWidth="1.2" strokeOpacity="0.6" />

              {/* Grand University Steps */}
              <rect x="332" y="410" width="176" height="5" fill="var(--theme-warning)" fillOpacity="0.2" />
              <rect x="324" y="415" width="192" height="5" fill="var(--theme-warning)" fillOpacity="0.3" />
            </g>

            {/* CENTER-RIGHT: Iconic University Clock Tower (Campanile) & Academic Quadrangle */}
            <g opacity="0.9">
              {/* Left & Right Quadrangle Wings */}
              <rect x="935" y="342" width="52" height="78" fill="url(#campusBuildingFill)" stroke="var(--theme-warning)" strokeWidth="1" strokeOpacity="0.4" />
              <polygon points="932,342 961,322 990,342" fill="url(#campusBuildingFill)" stroke="var(--theme-warning)" strokeWidth="1" strokeOpacity="0.45" />
              <rect x="1043" y="342" width="52" height="78" fill="url(#campusBuildingFill)" stroke="var(--theme-warning)" strokeWidth="1" strokeOpacity="0.4" />
              <polygon points="1040,342 1069,322 1098,342" fill="url(#campusBuildingFill)" stroke="var(--theme-warning)" strokeWidth="1" strokeOpacity="0.45" />

              {/* Central Tall University Clock Tower */}
              <rect x="987" y="245" width="56" height="175" fill="url(#amberBuildingFill)" stroke="#f59e0b" strokeWidth="1.4" strokeOpacity="0.6" />
              {/* Clock Tower Spire / Pyramid Roof */}
              <polygon points="983,245 1015,192 1047,245" fill="url(#amberBuildingFill)" stroke="#f59e0b" strokeWidth="1.4" strokeOpacity="0.65" />
              <line x1="1015" y1="170" x2="1015" y2="192" stroke="var(--theme-warning)" strokeWidth="1.5" strokeOpacity="0.8" />
              <circle cx="1015" cy="168" r="3.5" fill="var(--theme-warning)" />

              {/* Illuminated University Clock Face */}
              <circle cx="1015" cy="276" r="15" fill="var(--theme-surface)" stroke="#f59e0b" strokeWidth="1.6" strokeOpacity="0.8" />
              <circle cx="1015" cy="276" r="11" fill="none" stroke="var(--theme-warning)" strokeWidth="0.75" strokeDasharray="2 3" strokeOpacity="0.6" />
              {/* Clock Hands */}
              <line x1="1015" y1="276" x2="1015" y2="266" stroke="#f59e0b" strokeWidth="1.6" strokeLinecap="round" />
              <line x1="1015" y1="276" x2="1023" y2="276" stroke="var(--theme-warning)" strokeWidth="1.4" strokeLinecap="round" />
              <circle cx="1015" cy="276" r="2" fill="#f59e0b" />

              {/* Belfry Arched Windows */}
              <path d="M 1002 325 L 1002 306 A 5 5 0 0 1 1012 306 L 1012 325 Z" fill="var(--theme-warning)" fillOpacity="0.25" stroke="var(--theme-warning)" strokeWidth="1" strokeOpacity="0.55" />
              <path d="M 1018 325 L 1018 306 A 5 5 0 0 1 1028 306 L 1028 325 Z" fill="var(--theme-warning)" fillOpacity="0.25" stroke="var(--theme-warning)" strokeWidth="1" strokeOpacity="0.55" />

              {/* Grand Archway at Base of Clock Tower */}
              <path d="M 1003 420 L 1003 376 A 12 12 0 0 1 1027 376 L 1027 420 Z" fill="#f59e0b" fillOpacity="0.22" stroke="#f59e0b" strokeWidth="1.2" strokeOpacity="0.6" />
            </g>

            {/* RIGHT WING: Modern Forensic Science & Research University Complex */}
            <g opacity="0.85">
              {/* Forensic Science Lab Building */}
              <rect x="1235" y="318" width="95" height="102" fill="url(#campusBuildingFill)" stroke="var(--theme-warning)" strokeWidth="1.1" strokeOpacity="0.45" />
              {/* Observatory / Research Dome */}
              <path d="M 1255 318 C 1255 292, 1310 292, 1310 318 Z" fill="url(#amberBuildingFill)" stroke="#f59e0b" strokeWidth="1.2" strokeOpacity="0.5" />
              {/* Lab Windows Grid */}
              <rect x="1248" y="332" width="16" height="8" rx="1" fill="var(--theme-warning)" opacity="0.3" />
              <rect x="1274" y="332" width="16" height="8" rx="1" fill="#f59e0b" opacity="0.4" />
              <rect x="1300" y="332" width="16" height="8" rx="1" fill="var(--theme-warning)" opacity="0.25" />
              <rect x="1248" y="350" width="16" height="8" rx="1" fill="#f59e0b" opacity="0.35" />
              <rect x="1274" y="350" width="16" height="8" rx="1" fill="var(--theme-warning)" opacity="0.2" />
              <rect x="1300" y="350" width="16" height="8" rx="1" fill="#f59e0b" opacity="0.4" />
              <rect x="1248" y="368" width="16" height="8" rx="1" fill="var(--theme-warning)" opacity="0.3" />
              <rect x="1274" y="368" width="16" height="8" rx="1" fill="var(--theme-warning)" opacity="0.45" />
              <rect x="1300" y="368" width="16" height="8" rx="1" fill="var(--theme-warning)" opacity="0.2" />

              {/* Modern Tower 4 */}
              <rect x="1342" y="298" width="46" height="122" fill="url(#amberBuildingFill)" stroke="#f59e0b" strokeWidth="1" strokeOpacity="0.35" />
              <rect x="1352" y="312" width="26" height="5" fill="#f59e0b" opacity="0.3" />
              <rect x="1352" y="326" width="26" height="5" fill="#f59e0b" opacity="0.45" />
              <rect x="1352" y="340" width="26" height="5" fill="#f59e0b" opacity="0.25" />
              <rect x="1352" y="354" width="26" height="5" fill="#f59e0b" opacity="0.35" />
            </g>

            {/* Glowing Horizon Baseline */}
            <line x1="0" y1="419" x2="1440" y2="419" stroke="url(#campusSkylineGrad)" strokeWidth="2" />
          </svg>

          {/* Floating University & City Academic Emblems (Peripheral Depth Layer) */}
          {/* Top-Left Floating University Badge (Desktop & Tablet) */}
          <motion.div
            animate={{
              y: [0, -10, 0],
              rotate: [-1.5, 1.5, -1.5],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="hidden md:flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-background/70 dark:bg-surface/75 backdrop-blur-md border border-amber-500/25 shadow-lg shadow-amber-500/5 absolute top-8 lg:top-12 left-6 lg:left-12 xl:left-20"
          >
            <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <GraduationCap size={17} />
            </div>
            <div className="text-left">
              <div className="text-[10px] font-black uppercase tracking-wider text-text-main leading-tight">Degree Programs</div>
              <div className="text-[9px] font-semibold text-amber-500 dark:text-amber-400">B.Sc. • M.Sc. • Ph.D.</div>
            </div>
          </motion.div>

          {/* Top-Right Floating Campus Badge (Desktop & Tablet) */}
          <motion.div
            animate={{
              y: [0, 10, 0],
              rotate: [1.5, -1.5, 1.5],
            }}
            transition={{
              duration: 6.8,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 0.6,
            }}
            className="hidden md:flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-background/70 dark:bg-surface/75 backdrop-blur-md border border-warning/25 shadow-lg shadow-warning/5 absolute top-8 lg:top-12 right-6 lg:right-12 xl:right-20"
          >
            <div className="w-8 h-8 rounded-xl bg-warning/15 border border-warning/30 flex items-center justify-center text-warning">
              <Building2 size={17} />
            </div>
            <div className="text-left">
              <div className="text-[10px] font-black uppercase tracking-wider text-text-main leading-tight">Premier Campuses</div>
              <div className="text-[9px] font-semibold text-warning">NFSU • Central • State</div>
            </div>
          </motion.div>

          {/* Bottom-Left Floating City Network Badge (Large Screens) */}
          <motion.div
            animate={{
              y: [0, -8, 0],
              x: [0, 5, 0],
            }}
            transition={{
              duration: 7.4,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 1.1,
            }}
            className="hidden lg:flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-background/70 dark:bg-surface/75 backdrop-blur-md border border-warning/20 shadow-lg absolute bottom-12 left-10 xl:left-28"
          >
            <div className="relative w-8 h-8 rounded-xl bg-warning/15 border border-warning/30 flex items-center justify-center text-warning">
              <MapPin size={16} />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            </div>
            <div className="text-left">
              <div className="text-[10px] font-black uppercase tracking-wider text-text-main leading-tight">City-Wise Search</div>
              <div className="text-[9px] font-semibold text-text-muted">Pan-India & Global</div>
            </div>
          </motion.div>

          {/* Bottom-Right Floating Accreditation Badge (Large Screens) */}
          <motion.div
            animate={{
              y: [0, 8, 0],
              x: [0, -5, 0],
            }}
            transition={{
              duration: 7.8,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 1.5,
            }}
            className="hidden lg:flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-background/70 dark:bg-surface/75 backdrop-blur-md border border-amber-500/20 shadow-lg absolute bottom-12 right-10 xl:right-28"
          >
            <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Award size={16} />
            </div>
            <div className="text-left">
              <div className="text-[10px] font-black uppercase tracking-wider text-text-main leading-tight">Accredited Data</div>
              <div className="text-[9px] font-semibold text-amber-500 dark:text-amber-400">UGC • NAAC • Govt</div>
            </div>
          </motion.div>

          {/* Subtle Floating Academic Icons for Mobile & All Screens */}
          <motion.div
            animate={{ y: [0, -9, 0], rotate: [-8, 6, -8], opacity: [0.22, 0.45, 0.22] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-5 left-4 sm:left-16 text-amber-400"
          >
            <GraduationCap className="w-6 h-6 sm:w-8 sm:h-8" />
          </motion.div>
          <motion.div
            animate={{ y: [0, 9, 0], rotate: [6, -6, 6], opacity: [0.2, 0.42, 0.2] }}
            transition={{ duration: 6.2, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
            className="absolute top-6 right-4 sm:right-16 text-warning"
          >
            <Building2 className="w-6 h-6 sm:w-7 sm:h-7" />
          </motion.div>
          <motion.div
            animate={{ y: [0, -7, 0], opacity: [0.15, 0.35, 0.15] }}
            transition={{ duration: 6.8, repeat: Infinity, ease: 'easeInOut', delay: 1.4 }}
            className="absolute bottom-16 left-5 sm:left-1/4 text-warning"
          >
            <BookOpen className="w-5 h-5 sm:w-6 sm:h-6" />
          </motion.div>
          <motion.div
            animate={{ y: [0, 7, 0], opacity: [0.15, 0.35, 0.15] }}
            transition={{ duration: 6.4, repeat: Infinity, ease: 'easeInOut', delay: 1.9 }}
            className="absolute bottom-16 right-5 sm:right-1/4 text-amber-400"
          >
            <MapPin className="w-5 h-5 sm:w-6 sm:h-6" />
          </motion.div>

          {/* Horizontal scanning horizon line */}
          <motion.div
            animate={{
              y: [-65, 65, -65],
              opacity: [0.05, 0.25, 0.05],
            }}
            transition={{
              duration: 11,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-warning/50 to-transparent"
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3.5 sm:space-y-5">
          {/* University & Campus Crest Eyebrow Badge */}
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-background/85 dark:bg-crust/80 border border-amber-500/30 dark:border-warning/25 shadow-sm backdrop-blur-md mx-auto"
          >
            <GraduationCap size={14} className="text-amber-500 dark:text-amber-400 shrink-0 animate-bounce" style={{ animationDuration: '3s' }} />
            <span className="text-[10px] sm:text-xs font-extrabold uppercase tracking-widest bg-gradient-to-r from-amber-500 via-warning to-amber-400 bg-clip-text text-transparent">
              Official University &amp; Campus Explorer
            </span>
            <Building2 size={13} className="text-warning shrink-0" />
          </motion.div>

          {/* Premium Main Heading with Smooth Animated Aura, Laurel Framing & Shimmer */}
          <div className="relative inline-block mx-auto py-1.5 sm:py-2.5 px-3 sm:px-10 max-w-full">
            {/* Soft luminous aura behind title text */}
            <motion.div
              aria-hidden="true"
              animate={{
                opacity: [0.35, 0.7, 0.35],
                scale: [0.98, 1.03, 0.98],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="absolute -inset-x-4 sm:-inset-x-6 -inset-y-2 sm:-inset-y-3 rounded-3xl bg-gradient-to-r from-amber-500/12 via-warning/18 to-amber-500/12 blur-2xl pointer-events-none"
            />

            {/* Decorative Left & Right Academic Pillars / Crest Accents around Title */}
            <motion.div
              aria-hidden="true"
              animate={{ y: [0, -4, 0], opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="hidden sm:flex items-center justify-center absolute -left-2 lg:-left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 pointer-events-none"
            >
              <MapPin size={15} />
            </motion.div>
            <motion.div
              aria-hidden="true"
              animate={{ y: [0, 4, 0], opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
              className="hidden sm:flex items-center justify-center absolute -right-2 lg:-right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-warning/10 border border-warning/30 text-warning pointer-events-none"
            >
              <GraduationCap size={16} />
            </motion.div>

            {/* Subtle glassmorphic light-sweep across title backdrop */}
            <div
              aria-hidden="true"
              className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none"
            >
              <div className="w-1/3 h-full bg-gradient-to-r from-transparent via-white/10 dark:via-white/[0.07] to-transparent animate-college-beam" />
            </div>

            <motion.h1 
              initial={{ opacity: 0, y: 14, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="relative text-3xl sm:text-6xl lg:text-7xl font-black text-text-main tracking-tight leading-[1.12] sm:leading-none drop-shadow-xs"
            >
              Your City,{' '}
              <span className="relative inline-block bg-gradient-to-r from-amber-400 via-warning to-amber-500 bg-clip-text text-transparent animate-college-title-gradient pb-1">
                Your College
                {/* Animated luminous underline accent */}
                <motion.span
                  aria-hidden="true"
                  initial={{ scaleX: 0, opacity: 0 }}
                  animate={{ scaleX: 1, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute left-0 right-0 -bottom-0.5 sm:-bottom-1 h-1 sm:h-1.5 rounded-full bg-gradient-to-r from-amber-400 via-warning to-amber-500 opacity-85 shadow-[0_0_16px_rgba(245,158,11,0.45)] origin-left pointer-events-none"
                />
              </span>
            </motion.h1>
          </div>

          {/* Open, Unboxed Editorial Directory Metrics Ribbon (Portrait & Landscape Friendly) */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            aria-label="Verified Forensic Directory Statistics"
            className="relative max-w-3xl mx-auto w-full pt-1 pb-0.5 sm:py-2 landscape:max-lg:py-0.5 px-2"
          >
            {/* Subtle ambient glow behind the unboxed numbers */}
            <div
              aria-hidden="true"
              className="absolute inset-x-12 inset-y-0 bg-gradient-to-r from-transparent via-warning/10 to-transparent blur-2xl pointer-events-none"
            />

            {loading && colleges.length === 0 ? (
              <div className="grid grid-cols-2 landscape:grid-cols-4 sm:grid-cols-4 gap-y-3 gap-x-4 items-center justify-items-center py-1">
                {[0, 1, 2, 3].map((sIdx) => (
                  <div
                    key={`metric-skeleton-${sIdx}`}
                    className="flex flex-col items-center space-y-1.5"
                  >
                    <div className="h-6 sm:h-8 w-16 rounded-md skeleton-shimmer" />
                    <div className="h-2.5 w-24 rounded skeleton-shimmer" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="relative grid grid-cols-2 landscape:grid-cols-4 sm:grid-cols-4 gap-y-3.5 sm:gap-y-0 items-center">
                {[
                  {
                    label: 'Verified Colleges',
                    value: directoryStats.totalColleges,
                    icon: Building2,
                    delayMs: 0,
                    durationMs: 1650,
                    accentColor: 'text-warning',
                  },
                  {
                    label: 'Forensic Courses',
                    value: directoryStats.totalCourses,
                    icon: GraduationCap,
                    delayMs: 90,
                    durationMs: 1850,
                    accentColor: 'text-amber-400',
                  },
                  {
                    label: 'States & Regions',
                    value: directoryStats.totalStates,
                    icon: MapPin,
                    delayMs: 180,
                    durationMs: 1550,
                    accentColor: 'text-warning',
                  },
                  {
                    label: 'Campus Cities',
                    value: directoryStats.totalCities,
                    icon: Globe,
                    delayMs: 260,
                    durationMs: 1700,
                    accentColor: 'text-amber-400',
                  },
                ].map((stat, idx) => {
                  const Icon = stat.icon;
                  return (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.45,
                        delay: 0.1 + idx * 0.06,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className="group relative flex flex-col items-center justify-center px-2 sm:px-4"
                    >
                      {/* Delicate vertical hairline divider between items (no boxy borders) */}
                      {idx > 0 && (
                        <span
                          aria-hidden="true"
                          className={cn(
                            'absolute left-0 top-1/2 -translate-y-1/2 w-px h-8 sm:h-10 bg-gradient-to-b from-transparent via-black/15 dark:via-white/15 to-transparent pointer-events-none',
                            idx === 2 ? 'hidden landscape:block sm:block' : 'block'
                          )}
                        />
                      )}

                      {/* Steady Animated Number */}
                      <div className="flex items-baseline justify-center text-2xl sm:text-3xl lg:text-4xl landscape:max-lg:text-2xl font-black text-text-main leading-none tracking-tight drop-shadow-xs">
                        <SteadyCountUp
                          target={stat.value}
                          durationMs={stat.durationMs}
                          delayMs={stat.delayMs}
                          isReady={isMetricsReady}
                          suffix="+"
                        />
                      </div>

                      {/* Clean Unboxed Icon + Label */}
                      <div className="mt-1 sm:mt-1.5 flex items-center justify-center gap-1.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.12em] text-text-muted group-hover:text-text-main transition-colors">
                        <Icon
                          size={12}
                          className={cn('shrink-0 transition-transform duration-300 group-hover:scale-110', stat.accentColor)}
                          aria-hidden="true"
                        />
                        <span className="truncate">{stat.label}</span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>

          {/* Mobile & Orientation-Perfected Search Bar */}
          <motion.div 
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-2xl mx-auto w-full pt-1 sm:pt-1.5 landscape:max-lg:pt-0.5 space-y-2 sm:space-y-2.5"
          >
            <form
              role="search"
              aria-label="Search forensic science colleges and universities"
              onSubmit={(e) => {
                e.preventDefault();
                setSearchQuery(searchInput);
                searchInputRef.current?.blur();
              }}
              className="group relative flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 landscape:max-lg:p-1.5 rounded-2xl bg-background/95 dark:bg-crust/90 backdrop-blur-xl border border-black/15 dark:border-white/15 focus-within:border-warning focus-within:ring-4 focus-within:ring-warning/15 shadow-[0_10px_32px_-8px_rgba(0,0,0,0.22)] transition-all"
            >
              <label htmlFor="college-directory-search" className="sr-only">
                Search forensic science colleges, cities, states, or degree programs
              </label>

              {/* Left Search Icon Badge */}
              <div
                aria-hidden="true"
                className="w-9 h-9 sm:w-10 sm:h-10 landscape:max-lg:w-9 landscape:max-lg:h-9 rounded-xl bg-warning/12 dark:bg-warning/15 text-warning flex items-center justify-center shrink-0 transition-transform duration-300 group-focus-within:scale-105"
              >
                <Search size={18} className="shrink-0" />
              </div>

              {/* Search Input (16px on mobile prevents iOS auto-zoom; hides native webkit cancel X) */}
              <input
                ref={searchInputRef}
                id="college-directory-search"
                type="search"
                inputMode="search"
                enterKeyHint="search"
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
                placeholder="Search colleges, cities, courses..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Escape' && searchInput) {
                    e.preventDefault();
                    clearSearch();
                  }
                }}
                className="flex-1 min-w-0 bg-transparent px-1 sm:px-1.5 py-1.5 text-[16px] sm:text-sm font-semibold text-text-main placeholder:text-text-muted/65 focus:outline-none [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden"
              />

              {/* Right Inline Actions: Live Count + Clear Button + Mobile Filter Trigger */}
              <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
                {searchInput && (
                  <>
                    <span
                      aria-live="polite"
                      className="hidden xs:inline-flex items-center px-2 py-1 rounded-lg bg-warning/10 text-warning font-mono tabular-nums text-[11px] font-black"
                    >
                      {filteredColleges.length}
                    </span>
                    <button
                      type="button"
                      onClick={clearSearch}
                      aria-label="Clear search query"
                      className="w-9 h-9 rounded-xl text-text-muted hover:text-text-main hover:bg-black/5 dark:hover:bg-white/10 flex items-center justify-center transition-colors cursor-pointer"
                    >
                      <X size={17} />
                    </button>
                  </>
                )}

                {/* Integrated Mobile & Landscape Filter Button inside Search Bar */}
                <button
                  type="button"
                  onClick={() => setIsMobileFilterOpen(true)}
                  aria-label="Open directory filters"
                  className={cn(
                    'lg:hidden h-9 sm:h-10 landscape:max-lg:h-9 px-2.5 sm:px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all cursor-pointer shrink-0',
                    activeFilterCount > 0
                      ? 'bg-warning text-crust border-warning font-black shadow-xs'
                      : 'bg-surface/90 text-text-main border-black/10 dark:border-white/10 hover:border-warning/50'
                  )}
                >
                  <Filter size={14} className={cn('shrink-0', activeFilterCount > 0 ? 'text-crust' : 'text-warning')} />
                  <span className="hidden xs:inline">Filters</span>
                  {activeFilterCount > 0 && (
                    <span
                      className={cn(
                        'px-1.5 py-0.5 rounded-full text-[10px] font-mono tabular-nums font-black leading-none',
                        activeFilterCount > 0 ? 'bg-crust/20 text-crust' : 'bg-warning/20 text-warning'
                      )}
                    >
                      {activeFilterCount}
                    </span>
                  )}
                </button>
              </div>
            </form>

            {/* Quick Search Topic Strip - Smooth horizontal snap scroll on mobile portrait/landscape, wrapped on desktop */}
            <div className="flex items-center sm:flex-wrap sm:justify-center gap-1.5 overflow-x-auto no-scrollbar snap-x snap-mandatory pt-0.5 pb-1 -mx-3.5 px-3.5 sm:mx-0 sm:px-0">
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-text-muted/80 mr-0.5 shrink-0 select-none">
                Popular:
              </span>
              {QUICK_SEARCH_TOPICS.map(topic => {
                const isActive = searchInput.toLowerCase() === topic.query.toLowerCase();
                return (
                  <button
                    key={topic.label}
                    type="button"
                    onClick={() => {
                      const nextVal = isActive ? '' : topic.query;
                      setSearchInput(nextVal);
                      setSearchQuery(nextVal);
                    }}
                    className={cn(
                      'snap-start px-2.5 sm:px-3 py-1.5 sm:py-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer border shrink-0 min-h-[32px] sm:min-h-0 flex items-center',
                      isActive
                        ? 'bg-warning text-crust border-warning font-black shadow-xs'
                        : 'bg-background/80 dark:bg-surface/70 backdrop-blur-sm text-text-muted hover:text-text-main border-black/10 dark:border-white/10 hover:border-warning/40'
                    )}
                  >
                    {topic.label}
                  </button>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Container - Filter Sidebar & College Cards Grid */}
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 mt-5 sm:mt-10">
        <div className="flex flex-col lg:flex-row gap-6 sm:gap-8">
          
          {/* Desktop Filter Sidebar */}
          <aside aria-label="Directory Filters" className="hidden lg:block w-72 shrink-0 space-y-6">
            <div className="bg-surface border border-black/5 dark:border-white/10 rounded-2xl p-6 space-y-6 shadow-lg sticky top-24">
              <div className="flex items-center justify-between pb-4 border-b border-black/5 dark:border-white/10">
                <div className="flex items-center gap-2 font-black text-sm uppercase tracking-wider text-text-main">
                  <Filter size={16} className="text-warning" />
                  <span>Refine Search</span>
                </div>
                {activeFilterCount > 0 && (
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="text-xs font-bold text-warning hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw size={12} /> Reset ({activeFilterCount})
                  </button>
                )}
              </div>

              {/* Country Filter */}
              <div className="space-y-2">
                <label htmlFor="filter-country-desktop" className="text-xs font-black uppercase tracking-wider text-text-muted flex items-center gap-1.5">
                  <Globe size={14} className="text-warning" /> Country
                </label>
                <select
                  id="filter-country-desktop"
                  value={selectedCountry}
                  onChange={(e) => {
                    setSelectedCountry(e.target.value);
                    setSelectedState('All');
                    setSelectedCity('All');
                  }}
                  className="w-full bg-background border border-black/10 dark:border-white/10 rounded-xl px-3 py-2.5 text-xs font-semibold text-text-main focus:border-warning focus:outline-none min-h-[40px]"
                >
                  {countries.map(c => (
                    <option key={c} value={c}>{c === 'All' ? 'All Countries' : c}</option>
                  ))}
                </select>
              </div>

              {/* State Filter */}
              <div className="space-y-2">
                <label htmlFor="filter-state-desktop" className="text-xs font-black uppercase tracking-wider text-text-muted flex items-center gap-1.5">
                  <MapPin size={14} className="text-warning" /> State / Region
                </label>
                <select
                  id="filter-state-desktop"
                  value={selectedState}
                  onChange={(e) => {
                    setSelectedState(e.target.value);
                    setSelectedCity('All');
                  }}
                  className="w-full bg-background border border-black/10 dark:border-white/10 rounded-xl px-3 py-2.5 text-xs font-semibold text-text-main focus:border-warning focus:outline-none min-h-[40px]"
                >
                  {states.map(s => (
                    <option key={s} value={s}>{s === 'All' ? 'All States / Regions' : s}</option>
                  ))}
                </select>
              </div>

              {/* City Filter */}
              <div className="space-y-2">
                <label htmlFor="filter-city-desktop" className="text-xs font-black uppercase tracking-wider text-text-muted flex items-center gap-1.5">
                  <Building2 size={14} className="text-warning" /> City
                </label>
                <select
                  id="filter-city-desktop"
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full bg-background border border-black/10 dark:border-white/10 rounded-xl px-3 py-2.5 text-xs font-semibold text-text-main focus:border-warning focus:outline-none min-h-[40px]"
                >
                  {cities.map(ct => (
                    <option key={ct} value={ct}>{ct === 'All' ? 'All Cities' : ct}</option>
                  ))}
                </select>
              </div>

              {/* Institution Type Filter */}
              <div className="space-y-2">
                <label htmlFor="filter-type-desktop" className="text-xs font-black uppercase tracking-wider text-text-muted flex items-center gap-1.5">
                  <ShieldCheck size={14} className="text-warning" /> Institution Type
                </label>
                <select
                  id="filter-type-desktop"
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full bg-background border border-black/10 dark:border-white/10 rounded-xl px-3 py-2.5 text-xs font-semibold text-text-main focus:border-warning focus:outline-none min-h-[40px]"
                >
                  <option value="All">All Institution Types</option>
                  <option value="Government">Government / Public (All)</option>
                  <option value="Institute of National Importance">Institute of National Importance (NFSU / RRU)</option>
                  <option value="Central">Central University</option>
                  <option value="State">State Govt. University / Institute</option>
                  <option value="Private">Private University</option>
                  <option value="Deemed University">Deemed-to-be University</option>
                  <option value="Autonomous">Autonomous Institute</option>
                </select>
              </div>

              {/* Degree Level Filter */}
              <div className="space-y-2">
                <label htmlFor="filter-degree-desktop" className="text-xs font-black uppercase tracking-wider text-text-muted flex items-center gap-1.5">
                  <GraduationCap size={14} className="text-warning" /> Degree Level
                </label>
                <select
                  id="filter-degree-desktop"
                  value={selectedDegree}
                  onChange={(e) => setSelectedDegree(e.target.value)}
                  className="w-full bg-background border border-black/10 dark:border-white/10 rounded-xl px-3 py-2.5 text-xs font-semibold text-text-main focus:border-warning focus:outline-none min-h-[40px]"
                >
                  <option value="All">All Degrees</option>
                  <option value="Bachelor">Bachelor (B.Sc. / B.Tech. / Integrated)</option>
                  <option value="Master">Master (M.Sc. / M.Tech. / M.A.)</option>
                  <option value="Doctorate">Doctorate (Ph.D. / M.D.)</option>
                  <option value="Diploma">PG Diploma / Diploma</option>
                  <option value="Certificate">Certificate Course</option>
                </select>
              </div>

              {/* Checkboxes: Featured & Saved */}
              <div className="pt-3 border-t border-black/5 dark:border-white/10 space-y-3">
                <label className="flex items-center gap-3 cursor-pointer text-xs font-bold text-text-main select-none">
                  <input
                    type="checkbox"
                    checked={featuredOnly}
                    onChange={(e) => setFeaturedOnly(e.target.checked)}
                    className="w-4 h-4 rounded text-warning focus:ring-warning border-black/20"
                  />
                  <span className="flex items-center gap-1.5">
                    <Star size={14} className="text-warning fill-warning" />
                    Show Featured Colleges Only
                  </span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer text-xs font-bold text-text-main select-none">
                  <input
                    type="checkbox"
                    checked={savedOnly}
                    onChange={(e) => setSavedOnly(e.target.checked)}
                    className="w-4 h-4 rounded text-warning focus:ring-warning border-black/20"
                  />
                  <span className="flex items-center gap-1.5">
                    <Bookmark size={14} className="text-warning fill-warning" />
                    Saved Bookmarks Only ({savedCollegeIds.length})
                  </span>
                </label>
              </div>
            </div>
          </aside>

          {/* Directory Grid View */}
          <div className="flex-1 space-y-4 sm:space-y-6 min-w-0">
            
            {/* Control Bar: Mobile Filter Button, Compare, Sorting & Active Count */}
            <div className="bg-surface border border-black/5 dark:border-white/10 rounded-2xl p-3.5 sm:p-4 shadow-sm space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                {/* Results Counter + Mobile Quick Saved / Reset */}
                <div className="flex items-center justify-between sm:justify-start gap-2">
                  <div className="text-xs font-bold text-text-muted" aria-live="polite">
                    Showing <span className="text-warning font-black text-sm">{filteredColleges.length}</span> of{' '}
                    <span className="text-text-main font-bold">{colleges.length}</span> institutes
                  </div>

                  <div className="flex items-center gap-1.5 sm:hidden">
                    {savedCollegeIds.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setSavedOnly(prev => !prev)}
                        aria-pressed={savedOnly}
                        className={cn(
                          'text-[11px] font-bold px-2.5 py-1.5 rounded-lg flex items-center gap-1 border transition-all cursor-pointer',
                          savedOnly
                            ? 'bg-warning text-crust border-warning font-black shadow-xs'
                            : 'text-warning bg-warning/10 border-warning/20'
                        )}
                      >
                        <Bookmark size={12} className={cn(savedOnly ? 'fill-crust text-crust' : 'fill-warning')} />
                        <span>{savedCollegeIds.length}</span>
                      </button>
                    )}
                    {activeFilterCount > 0 && (
                      <button
                        type="button"
                        onClick={resetFilters}
                        className="text-[11px] font-bold text-warning px-2 py-1 rounded-lg bg-warning/10 flex items-center gap-1 cursor-pointer"
                      >
                        <RefreshCw size={11} />
                        <span>Reset</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Mobile Action Grid + Desktop Action Row */}
                <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center sm:justify-end gap-2">
                  {/* Mobile Filter Drawer Trigger Button */}
                  <button
                    type="button"
                    onClick={() => setIsMobileFilterOpen(true)}
                    className="lg:hidden flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-warning/10 border border-warning/30 text-warning font-black text-xs uppercase tracking-wider hover:bg-warning hover:text-crust transition-all min-h-[42px] cursor-pointer"
                  >
                    <Filter size={15} className="shrink-0" />
                    <span className="truncate">Filters</span>
                    {activeFilterCount > 0 && (
                      <span className="w-5 h-5 rounded-full bg-warning text-crust text-[10px] font-black flex items-center justify-center shrink-0">
                        {activeFilterCount}
                      </span>
                    )}
                  </button>

                  {/* Compare Colleges Trigger */}
                  <button
                    type="button"
                    onClick={() => setIsCompareModalOpen(true)}
                    className={cn(
                      'text-xs font-bold px-3 sm:px-3.5 py-2.5 sm:py-2 rounded-xl flex items-center justify-center gap-1.5 shrink-0 border transition-all cursor-pointer min-h-[42px] sm:min-h-[40px]',
                      compareCollegeIds.length > 0
                        ? 'bg-warning text-crust border-warning font-black shadow-xs'
                        : 'bg-background sm:bg-surface text-text-main border-black/10 dark:border-white/10 hover:border-warning/50 hover:text-warning'
                    )}
                  >
                    <Scale size={14} className={cn('shrink-0', compareCollegeIds.length > 0 ? 'text-crust' : 'text-warning')} />
                    <span className="truncate">
                      {compareCollegeIds.length > 0
                        ? `Compare (${compareCollegeIds.length}/${MAX_COMPARE_COLLEGES})`
                        : 'Compare'}
                    </span>
                  </button>

                  {/* Saved Colleges Trigger (Desktop/Tablet) */}
                  {savedCollegeIds.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setSavedOnly(prev => !prev)}
                      aria-pressed={savedOnly}
                      className={cn(
                        'hidden sm:flex text-xs font-bold px-3 py-2 rounded-xl items-center gap-1.5 shrink-0 border transition-all cursor-pointer min-h-[40px]',
                        savedOnly
                          ? 'bg-warning text-crust border-warning font-black shadow-xs'
                          : 'text-warning bg-warning/10 border-warning/20 hover:border-warning/50'
                      )}
                    >
                      <Bookmark size={13} className={cn(savedOnly ? 'fill-crust text-crust' : 'fill-warning')} />
                      <span>{savedCollegeIds.length} Saved</span>
                    </button>
                  )}

                  {/* Sort Select (Full width across the 2 cols on mobile, inline on sm+) */}
                  <div className="col-span-2 sm:col-span-1 flex items-center gap-2">
                    <label htmlFor="sort-colleges-select" className="text-xs font-mono uppercase text-text-muted hidden sm:inline-flex items-center gap-1">
                      <ArrowUpDown size={12} className="text-warning" /> Sort:
                    </label>
                    <div className="relative w-full sm:w-auto flex items-center">
                      <ArrowUpDown size={13} className="text-warning absolute left-3 pointer-events-none sm:hidden" />
                      <select
                        id="sort-colleges-select"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as any)}
                        className="w-full sm:w-auto bg-background border border-black/10 dark:border-white/10 rounded-xl pl-8 sm:pl-3 pr-3 py-2.5 sm:py-2 text-xs font-bold text-text-main focus:border-warning focus:outline-none min-h-[42px] sm:min-h-[40px]"
                      >
                        <option value="featured">Sort: Featured First</option>
                        <option value="name-asc">Sort: Name (A–Z)</option>
                        <option value="name-desc">Sort: Name (Z–A)</option>
                        <option value="courses-desc">Sort: Most Programs</option>
                        <option value="fee-asc">Sort: Lowest Estimated Fee</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mobile Quick-Filter Pill Strip (Degree & Institution Type shortcuts) */}
              <div className="lg:hidden flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-2 border-t border-black/5 dark:border-white/5 -mx-1 px-1">
                <button
                  type="button"
                  onClick={() => setIsMobileFilterOpen(true)}
                  className={cn(
                    'px-2.5 py-1.5 rounded-lg text-[11px] font-bold border flex items-center gap-1 shrink-0 cursor-pointer transition-all',
                    selectedState !== 'All' || selectedCity !== 'All'
                      ? 'bg-warning/15 border-warning text-warning font-black'
                      : 'bg-background border-black/10 dark:border-white/10 text-text-main'
                  )}
                >
                  <MapPin size={12} className="text-warning shrink-0" />
                  <span>
                    {selectedCity !== 'All'
                      ? selectedCity
                      : selectedState !== 'All'
                      ? selectedState
                      : 'Select City / State'}
                  </span>
                </button>

                {(['All', 'Bachelor', 'Master', 'Doctorate', 'Diploma'] as const).map(deg => {
                  const active = selectedDegree === deg;
                  const label =
                    deg === 'All'
                      ? 'All Degrees'
                      : deg === 'Bachelor'
                      ? 'B.Sc / Bachelor'
                      : deg === 'Master'
                      ? 'M.Sc / Master'
                      : deg === 'Doctorate'
                      ? 'Ph.D.'
                      : 'Diploma';
                  return (
                    <button
                      key={deg}
                      type="button"
                      onClick={() => setSelectedDegree(active && deg !== 'All' ? 'All' : deg)}
                      className={cn(
                        'px-2.5 py-1.5 rounded-lg text-[11px] font-bold border shrink-0 cursor-pointer transition-all',
                        active
                          ? 'bg-warning text-crust border-warning font-black shadow-xs'
                          : 'bg-background border-black/10 dark:border-white/10 text-text-muted hover:text-text-main'
                      )}
                    >
                      {label}
                    </button>
                  );
                })}

                <button
                  type="button"
                  onClick={() => setSelectedType(prev => (prev === 'Government' ? 'All' : 'Government'))}
                  className={cn(
                    'px-2.5 py-1.5 rounded-lg text-[11px] font-bold border shrink-0 cursor-pointer transition-all',
                    selectedType === 'Government'
                      ? 'bg-warning text-crust border-warning font-black shadow-xs'
                      : 'bg-background border-black/10 dark:border-white/10 text-text-muted hover:text-text-main'
                  )}
                >
                  Govt. Institutes
                </button>
              </div>
            </div>

            {syncNotice && (
              <div className="text-xs text-text-muted bg-surface border border-black/5 dark:border-white/10 rounded-xl px-4 py-2.5 flex items-center justify-between">
                <span>{syncNotice}</span>
                <button type="button" onClick={() => setSyncNotice(null)} className="text-text-muted hover:text-text-main">
                  <X size={14} />
                </button>
              </div>
            )}

            {/* Active Filter Chips - Swipeable single row on mobile */}
            {activeFilterCount > 0 && (
              <div className="flex items-center sm:flex-wrap gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar py-1 -mx-3.5 px-3.5 sm:mx-0 sm:px-0">
                <span className="text-[11px] font-mono text-text-muted uppercase shrink-0">Active:</span>
                {searchQuery && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-lg bg-warning/10 border border-warning/30 text-warning text-xs font-bold shrink-0">
                    Search: "{searchQuery}"
                    <button type="button" onClick={clearSearch} aria-label="Remove search filter" className="hover:text-text-main cursor-pointer">
                      <X size={12} />
                    </button>
                  </span>
                )}
                {selectedCountry !== 'All' && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-lg bg-surface border border-black/10 dark:border-white/10 text-xs font-bold text-text-main shrink-0">
                    {selectedCountry}
                    <button type="button" onClick={() => setSelectedCountry('All')} aria-label="Remove country filter" className="text-text-muted hover:text-text-main cursor-pointer">
                      <X size={12} />
                    </button>
                  </span>
                )}
                {selectedState !== 'All' && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-lg bg-surface border border-black/10 dark:border-white/10 text-xs font-bold text-text-main shrink-0">
                    {selectedState}
                    <button type="button" onClick={() => setSelectedState('All')} aria-label="Remove state filter" className="text-text-muted hover:text-text-main cursor-pointer">
                      <X size={12} />
                    </button>
                  </span>
                )}
                {selectedCity !== 'All' && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-lg bg-surface border border-black/10 dark:border-white/10 text-xs font-bold text-text-main shrink-0">
                    {selectedCity}
                    <button type="button" onClick={() => setSelectedCity('All')} aria-label="Remove city filter" className="text-text-muted hover:text-text-main cursor-pointer">
                      <X size={12} />
                    </button>
                  </span>
                )}
                {selectedType !== 'All' && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-lg bg-surface border border-black/10 dark:border-white/10 text-xs font-bold text-text-main shrink-0">
                    Type: {selectedType}
                    <button type="button" onClick={() => setSelectedType('All')} aria-label="Remove institution type filter" className="text-text-muted hover:text-text-main cursor-pointer">
                      <X size={12} />
                    </button>
                  </span>
                )}
                {selectedDegree !== 'All' && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-lg bg-surface border border-black/10 dark:border-white/10 text-xs font-bold text-text-main shrink-0">
                    Degree: {selectedDegree}
                    <button type="button" onClick={() => setSelectedDegree('All')} aria-label="Remove degree filter" className="text-text-muted hover:text-text-main cursor-pointer">
                      <X size={12} />
                    </button>
                  </span>
                )}
                {featuredOnly && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-lg bg-warning text-crust text-xs font-black shadow-xs shrink-0">
                    <Star size={12} className="fill-crust text-crust" /> Featured Only
                    <button type="button" onClick={() => setFeaturedOnly(false)} aria-label="Remove featured filter" className="hover:opacity-75 cursor-pointer">
                      <X size={12} />
                    </button>
                  </span>
                )}
                {savedOnly && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-lg bg-warning text-crust text-xs font-black shadow-xs shrink-0">
                    <Bookmark size={12} className="fill-crust text-crust" /> Saved Only
                    <button type="button" onClick={() => setSavedOnly(false)} aria-label="Remove saved filter" className="hover:opacity-75 cursor-pointer">
                      <X size={12} />
                    </button>
                  </span>
                )}
                <button
                  type="button"
                  onClick={resetFilters}
                  className="text-xs font-bold text-warning hover:underline ml-1 shrink-0 cursor-pointer"
                >
                  Clear All
                </button>
              </div>
            )}

            {/* Loading State */}
            {loading ? (
              <div className="grid grid-cols-1 landscape:grid-cols-2 sm:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-4 sm:gap-6">
                {[0, 1, 2, 3, 4, 5].map(idx => (
                  <CollegeCardSkeleton key={`initial-skeleton-${idx}`} index={idx} />
                ))}
              </div>
            ) : filteredColleges.length === 0 ? (
              /* Empty Search Results State */
              <div className="bg-surface border border-black/5 dark:border-white/10 rounded-2xl sm:rounded-3xl p-8 sm:p-12 text-center space-y-4 shadow-sm">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-warning/10 text-warning flex items-center justify-center mx-auto">
                  <Building2 size={28} />
                </div>
                <h3 className="text-base sm:text-lg font-black text-text-main">No Institutes Match Your Current Filters</h3>
                <p className="text-xs text-text-muted max-w-md mx-auto font-medium leading-relaxed">
                  We couldn't find any forensic colleges matching your combination of search terms and filters. Try clearing a filter or broadening your search query.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 pt-2">
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={clearSearch}
                      className="px-4 sm:px-5 py-2.5 rounded-xl bg-background border border-black/10 dark:border-white/10 text-text-main hover:border-warning text-xs font-bold transition-all cursor-pointer min-h-[42px]"
                    >
                      Clear Search "{searchQuery}"
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="px-5 sm:px-6 py-2.5 rounded-xl bg-warning text-crust font-black text-xs uppercase tracking-wider shadow-md hover:bg-warning/90 transition-all inline-flex items-center gap-2 cursor-pointer min-h-[42px]"
                  >
                    <RefreshCw size={14} /> Reset All Filters
                  </button>
                </div>
              </div>
            ) : (
              /* College Cards Grid */
              <div className="grid grid-cols-1 landscape:grid-cols-2 sm:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-4 sm:gap-6" style={{ overflowAnchor: 'none' }}>
                {visibleColleges.map((college, idx) => {
                  const isSaved = savedCollegeIds.includes(college.id);
                  const isCompared = compareCollegeIds.includes(college.id);
                  const isHighlighted = highlightedCollegeId === college.id;
                  const isCardCopied = copiedCardId === college.id;
                  const formattedFee = formatFee(college.feesRange, college.country);

                  return (
                    <motion.article
                      key={college.id}
                      id={`college-card-${college.id}`}
                      data-college-id={college.id}
                      initial={{ opacity: 0, y: 16, scale: 0.99 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{
                        duration: 0.5,
                        delay: Math.min((idx % BATCH_SIZE) * 0.04, 0.28),
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className={cn(
                        'group bg-surface border rounded-2xl overflow-hidden flex flex-col cursor-pointer scroll-mt-24 sm:scroll-mt-28',
                        'transform-gpu will-change-transform transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)]',
                        'shadow-[0_2px_10px_-3px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.03)] dark:shadow-[0_2px_12px_-3px_rgba(0,0,0,0.35)]',
                        'hover:-translate-y-1 hover:shadow-[0_16px_36px_-10px_rgba(15,23,42,0.14),0_6px_16px_-4px_rgba(15,23,42,0.06)] dark:hover:shadow-[0_18px_40px_-10px_rgba(0,0,0,0.65),0_0_24px_rgba(245,158,11,0.07)]',
                        'hover:border-warning/40 dark:hover:border-warning/30 active:translate-y-0 active:scale-[0.995]',
                        isHighlighted
                          ? 'border-warning ring-2 ring-warning shadow-[0_18px_40px_-8px_rgba(234,179,8,0.25)] -translate-y-1'
                          : isCompared
                          ? 'border-warning/60 ring-1 ring-warning/40'
                          : 'border-black/5 dark:border-white/10'
                      )}
                      onClick={() => handleOpenDetails(college)}
                    >
                      {/* Banner / Cover Header */}
                      <div className="relative h-36 sm:h-44 landscape:max-lg:h-32 bg-crust overflow-hidden">
                        <CollegeBannerImage
                          college={college}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/45 to-black/45" />

                        {/* Type, Featured, Share & Bookmark Controls */}
                        <div className="absolute top-2.5 sm:top-3 left-2.5 sm:left-3 right-2.5 sm:right-3 flex items-center justify-between gap-2 z-10">
                          <span className="px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md text-white font-black text-[10px] uppercase tracking-wider border border-white/10 truncate max-w-[55%]">
                            {getDisplayInstitutionType(college)}
                          </span>

                          <div className="flex items-center gap-1.5 shrink-0">
                            {college.featured && (
                              <span className="px-2 sm:px-2.5 py-1 rounded-full bg-warning text-crust font-black text-[10px] uppercase tracking-wider flex items-center gap-1 shadow-md">
                                <Star size={11} className="fill-crust text-crust shrink-0" />
                                <span className="hidden xs:inline">Featured</span>
                              </span>
                            )}

                            <button
                              type="button"
                              onClick={(e) => handleShareCollege(e, college, true)}
                              aria-label={`Share ${college.name}`}
                              title={isCardCopied ? 'Link Copied!' : 'Share College Link'}
                              className="w-9 h-9 rounded-full bg-black/65 text-white hover:text-warning transition-colors backdrop-blur-md flex items-center justify-center cursor-pointer"
                            >
                              {isCardCopied ? <Check size={14} className="text-emerald-400" /> : <Share2 size={14} />}
                            </button>

                            <button
                              type="button"
                              onClick={(e) => toggleSaveCollege(e, college.id)}
                              aria-pressed={isSaved}
                              aria-label={isSaved ? `Remove ${college.name} from bookmarks` : `Save ${college.name} to bookmarks`}
                              title={isSaved ? 'Remove Bookmark' : 'Save College'}
                              className="w-9 h-9 rounded-full bg-black/65 text-white hover:text-warning transition-colors backdrop-blur-md flex items-center justify-center cursor-pointer"
                            >
                              <Bookmark size={14} className={cn(isSaved && 'fill-warning text-warning')} />
                            </button>
                          </div>
                        </div>

                        {/* Location & Accreditation overlay */}
                        <div className="absolute bottom-2.5 sm:bottom-3 left-2.5 sm:left-3 right-2.5 sm:right-3 flex items-center justify-between gap-2 text-xs font-bold text-white z-10">
                          <span className="flex items-center gap-1 drop-shadow-md text-amber-200 truncate">
                            <MapPin size={12} className="text-warning shrink-0" />
                            <span className="truncate">
                              {college.city}, {college.state ? `${college.state}, ` : ''}{college.country}
                            </span>
                          </span>
                          {college.accreditation && (
                            <span className="bg-amber-500/90 text-crust font-black text-[10px] px-2 py-0.5 rounded uppercase shrink-0">
                              {college.accreditation.split('|')[0].trim()}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Card Body */}
                      <div className="p-4 sm:p-6 space-y-3.5 sm:space-y-4 flex-1 flex flex-col justify-between">
                        <div className="space-y-2.5">
                          <div className="flex items-start gap-3">
                            <CollegeLogoBadge college={college} size="sm" />
                            <div className="min-w-0 flex-1">
                              <h2 className="text-base sm:text-lg font-black tracking-tight text-text-main group-hover:text-warning transition-colors line-clamp-2 leading-snug">
                                <Link
                                  to={`/colleges/${college.id}`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    recordReturnCollege(college.id);
                                  }}
                                  className="focus:outline-none"
                                >
                                  {college.name}
                                </Link>
                              </h2>
                              {college.ranking && (
                                <p className="text-[11px] font-bold text-text-muted truncate mt-0.5 flex items-center gap-1">
                                  <Award size={12} className="text-warning shrink-0" />
                                  <span className="truncate">{college.ranking}</span>
                                </p>
                              )}
                            </div>
                          </div>

                          <p className="text-xs text-text-muted line-clamp-2 leading-relaxed">
                            {college.description}
                          </p>
                        </div>

                        {/* Fee & Programs Summary */}
                        <div className="space-y-2.5 sm:space-y-3 pt-2.5 border-t border-black/5 dark:border-white/5">
                          {formattedFee && (
                            <div className="flex items-center justify-between gap-2 text-xs">
                              <span className="text-text-muted font-semibold shrink-0">Est. Tuition Fee:</span>
                              <span className="text-warning font-black truncate text-right">{formattedFee}</span>
                            </div>
                          )}

                          <div className="space-y-1.5 sm:space-y-2">
                            <div className="text-[11px] font-black uppercase tracking-wider text-text-muted flex items-center justify-between">
                              <span className="flex items-center gap-1">
                                <BookOpen size={12} className="text-warning" /> Key Programs:
                              </span>
                              <span className="text-warning font-bold">{college.coursesOffered.length} Courses</span>
                            </div>
                            
                            <div className="flex flex-wrap gap-1.5">
                              {college.coursesOffered.slice(0, 3).map((course, idx) => (
                                <span 
                                  key={idx} 
                                  className="px-2 sm:px-2.5 py-1 rounded-md bg-background border border-black/5 dark:border-white/10 text-[11px] font-bold text-text-main line-clamp-1"
                                >
                                  {course.name}
                                </span>
                              ))}
                              {college.coursesOffered.length > 3 && (
                                <span className="px-2 py-1 rounded-md bg-warning/10 text-warning font-black text-[10px]">
                                  +{college.coursesOffered.length - 3} more
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Card Action Links: Compare & Explore */}
                        <div className="pt-1.5 sm:pt-2 flex items-center gap-2 sm:gap-2.5">
                          <button
                            type="button"
                            onClick={(e) => handleToggleCompare(college.id, e)}
                            aria-pressed={isCompared}
                            aria-label={isCompared ? `Remove ${college.name} from comparison` : `Add ${college.name} to comparison`}
                            className={cn(
                              'py-2.5 px-3 sm:px-3.5 rounded-xl font-black text-[11px] sm:text-xs uppercase tracking-wider border transition-all flex items-center justify-center gap-1.5 min-h-[44px] shrink-0 cursor-pointer',
                              isCompared
                                ? 'bg-warning/15 border-warning text-warning'
                                : 'bg-background border-black/10 dark:border-white/10 text-text-main hover:border-warning/50 hover:text-warning'
                            )}
                          >
                            {isCompared ? <Check size={14} /> : <Scale size={14} className="text-warning shrink-0" />}
                            <span>{isCompared ? 'Comparing' : 'Compare'}</span>
                          </button>

                          <Link
                            to={`/colleges/${college.id}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              recordReturnCollege(college.id);
                            }}
                            className="flex-1 py-2.5 px-3 sm:px-4 bg-warning text-crust font-black text-[11px] sm:text-xs uppercase tracking-wider rounded-xl shadow-md hover:bg-warning/90 transition-all flex items-center justify-center gap-1.5 sm:gap-2 min-h-[44px]"
                          >
                            <span className="truncate">Explore College</span>
                            <ChevronRight size={14} className="shrink-0" />
                          </Link>
                        </div>
                      </div>
                    </motion.article>
                  );
                })}

                {/* Smooth Skeleton Cards While Scrolling */}
                {visibleCount < filteredColleges.length &&
                  Array.from({
                    length: Math.min(
                      isLoadingMore ? 4 : 2,
                      filteredColleges.length - visibleCount
                    ),
                  }).map((_, sIdx) => (
                    <CollegeCardSkeleton
                      key={`scroll-skeleton-${visibleCount}-${sIdx}`}
                      index={sIdx}
                    />
                  ))}

                {/* Progressive Loading Sentinel & Quick Batch Controls */}
                {visibleCount < filteredColleges.length && (
                  <div
                    ref={loadMoreSentinelRef}
                    className="col-span-full pt-3 pb-8 space-y-4"
                  >
                    <div className="bg-surface border border-black/5 dark:border-white/10 rounded-2xl p-4 sm:p-6 text-center space-y-3 shadow-xs">
                      <div className="flex items-center justify-between text-xs font-bold text-text-muted">
                        <span className="flex items-center gap-2">
                          {isLoadingMore && (
                            <Loader2 size={14} className="animate-spin text-warning shrink-0" />
                          )}
                          <span>
                            Showing <strong className="text-text-main">{visibleColleges.length}</strong> of{' '}
                            <strong className="text-warning">{filteredColleges.length}</strong> colleges
                          </span>
                        </span>
                        <span className="font-mono text-warning">
                          {Math.round((visibleColleges.length / filteredColleges.length) * 100)}%
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-black/5 dark:bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-amber-500 to-warning rounded-full transition-all duration-500 ease-out"
                          style={{ width: `${(visibleColleges.length / filteredColleges.length) * 100}%` }}
                        />
                      </div>
                      <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 pt-1">
                        <button
                          type="button"
                          onClick={triggerLoadMoreBatch}
                          disabled={isLoadingMore}
                          className="px-5 py-2.5 rounded-xl bg-warning text-crust font-black text-xs uppercase tracking-wider shadow-md hover:bg-warning/90 disabled:opacity-70 transition-all cursor-pointer flex items-center gap-2 min-h-[42px]"
                        >
                          {isLoadingMore ? (
                            <>
                              <Loader2 size={14} className="animate-spin shrink-0" />
                              <span>Loading Colleges...</span>
                            </>
                          ) : (
                            <span>Load Next {Math.min(BATCH_SIZE, filteredColleges.length - visibleCount)} Colleges</span>
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (loadMoreTimerRef.current) {
                              clearTimeout(loadMoreTimerRef.current);
                              loadMoreTimerRef.current = null;
                            }
                            setIsLoadingMore(false);
                            setVisibleCount(filteredColleges.length);
                          }}
                          className="px-4 py-2.5 rounded-xl bg-background border border-black/10 dark:border-white/10 text-text-main hover:border-warning text-xs font-bold transition-all cursor-pointer min-h-[42px]"
                        >
                          <span>Show All ({filteredColleges.length})</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Bottom-Sheet / Off-Canvas Drawer */}
      <AnimatePresence>
        {isMobileFilterOpen && (
          <div className="fixed inset-0 z-[999] lg:hidden flex items-end sm:items-stretch sm:justify-end" role="dialog" aria-modal="true" aria-label="Filter colleges">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileFilterOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            />

            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 260 }}
              className="relative w-full sm:max-w-sm bg-surface border-t sm:border-t-0 sm:border-l border-warning/30 rounded-t-3xl sm:rounded-none max-h-[88dvh] sm:max-h-full sm:h-full z-10 flex flex-col shadow-2xl overflow-hidden"
            >
              {/* Mobile Drag Handle Pill */}
              <div className="sm:hidden pt-2.5 pb-1 bg-crust flex justify-center">
                <div className="w-10 h-1.5 rounded-full bg-text-muted/30" />
              </div>

              {/* Drawer Header */}
              <div className="px-5 py-3.5 sm:p-5 border-b border-black/10 dark:border-white/10 flex items-center justify-between bg-crust">
                <div className="flex items-center gap-2 font-black text-sm uppercase tracking-wider text-text-main">
                  <Filter size={18} className="text-warning" />
                  <span>Refine Colleges</span>
                  {activeFilterCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-warning/15 text-warning text-[11px] font-black">
                      {activeFilterCount} Active
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setIsMobileFilterOpen(false)}
                  aria-label="Close filter drawer"
                  className="w-9 h-9 rounded-xl bg-surface text-text-muted hover:text-text-main flex items-center justify-center cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Drawer Body - Filter Controls */}
              <div className="p-5 sm:p-6 space-y-5 overflow-y-auto flex-1">
                {/* Country Filter */}
                <div className="space-y-2">
                  <label htmlFor="filter-country-mobile" className="text-xs font-black uppercase tracking-wider text-text-muted flex items-center gap-1.5">
                    <Globe size={14} className="text-warning" /> Country
                  </label>
                  <select
                    id="filter-country-mobile"
                    value={selectedCountry}
                    onChange={(e) => {
                      setSelectedCountry(e.target.value);
                      setSelectedState('All');
                      setSelectedCity('All');
                    }}
                    className="w-full bg-background border border-black/10 dark:border-white/10 rounded-xl px-3.5 py-3 text-base sm:text-xs font-semibold text-text-main focus:border-warning focus:outline-none min-h-[46px]"
                  >
                    {countries.map(c => (
                      <option key={c} value={c}>{c === 'All' ? 'All Countries' : c}</option>
                    ))}
                  </select>
                </div>

                {/* State Filter */}
                <div className="space-y-2">
                  <label htmlFor="filter-state-mobile" className="text-xs font-black uppercase tracking-wider text-text-muted flex items-center gap-1.5">
                    <MapPin size={14} className="text-warning" /> State / Region
                  </label>
                  <select
                    id="filter-state-mobile"
                    value={selectedState}
                    onChange={(e) => {
                      setSelectedState(e.target.value);
                      setSelectedCity('All');
                    }}
                    className="w-full bg-background border border-black/10 dark:border-white/10 rounded-xl px-3.5 py-3 text-base sm:text-xs font-semibold text-text-main focus:border-warning focus:outline-none min-h-[46px]"
                  >
                    {states.map(s => (
                      <option key={s} value={s}>{s === 'All' ? 'All States / Regions' : s}</option>
                    ))}
                  </select>
                </div>

                {/* City Filter */}
                <div className="space-y-2">
                  <label htmlFor="filter-city-mobile" className="text-xs font-black uppercase tracking-wider text-text-muted flex items-center gap-1.5">
                    <Building2 size={14} className="text-warning" /> City
                  </label>
                  <select
                    id="filter-city-mobile"
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full bg-background border border-black/10 dark:border-white/10 rounded-xl px-3.5 py-3 text-base sm:text-xs font-semibold text-text-main focus:border-warning focus:outline-none min-h-[46px]"
                  >
                    {cities.map(ct => (
                      <option key={ct} value={ct}>{ct === 'All' ? 'All Cities' : ct}</option>
                    ))}
                  </select>
                </div>

                {/* Institution Type Filter */}
                <div className="space-y-2">
                  <label htmlFor="filter-type-mobile" className="text-xs font-black uppercase tracking-wider text-text-muted flex items-center gap-1.5">
                    <ShieldCheck size={14} className="text-warning" /> Institution Type
                  </label>
                  <select
                    id="filter-type-mobile"
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="w-full bg-background border border-black/10 dark:border-white/10 rounded-xl px-3.5 py-3 text-base sm:text-xs font-semibold text-text-main focus:border-warning focus:outline-none min-h-[46px]"
                  >
                    <option value="All">All Institution Types</option>
                    <option value="Government">Government / Public (All)</option>
                    <option value="Institute of National Importance">Institute of National Importance (NFSU / RRU)</option>
                    <option value="Central">Central University</option>
                    <option value="State">State Govt. University / Institute</option>
                    <option value="Private">Private University</option>
                    <option value="Deemed University">Deemed-to-be University</option>
                    <option value="Autonomous">Autonomous Institute</option>
                  </select>
                </div>

                {/* Degree Level Filter */}
                <div className="space-y-2">
                  <label htmlFor="filter-degree-mobile" className="text-xs font-black uppercase tracking-wider text-text-muted flex items-center gap-1.5">
                    <GraduationCap size={14} className="text-warning" /> Degree Level
                  </label>
                  <select
                    id="filter-degree-mobile"
                    value={selectedDegree}
                    onChange={(e) => setSelectedDegree(e.target.value)}
                    className="w-full bg-background border border-black/10 dark:border-white/10 rounded-xl px-3.5 py-3 text-base sm:text-xs font-semibold text-text-main focus:border-warning focus:outline-none min-h-[46px]"
                  >
                    <option value="All">All Degrees</option>
                    <option value="Bachelor">Bachelor (B.Sc. / B.Tech. / Integrated)</option>
                    <option value="Master">Master (M.Sc. / M.Tech. / M.A.)</option>
                    <option value="Doctorate">Doctorate (Ph.D. / M.D.)</option>
                    <option value="Diploma">PG Diploma / Diploma</option>
                    <option value="Certificate">Certificate Course</option>
                  </select>
                </div>

                {/* Checkboxes: Featured & Saved */}
                <div className="pt-3 border-t border-black/5 dark:border-white/10 space-y-3.5">
                  <label className="flex items-center gap-3 cursor-pointer text-xs font-bold text-text-main select-none py-1">
                    <input
                      type="checkbox"
                      checked={featuredOnly}
                      onChange={(e) => setFeaturedOnly(e.target.checked)}
                      className="w-5 h-5 rounded text-warning focus:ring-warning border-black/20"
                    />
                    <span className="flex items-center gap-1.5">
                      <Star size={14} className="text-warning fill-warning" />
                      Show Featured Colleges Only
                    </span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer text-xs font-bold text-text-main select-none py-1">
                    <input
                      type="checkbox"
                      checked={savedOnly}
                      onChange={(e) => setSavedOnly(e.target.checked)}
                      className="w-5 h-5 rounded text-warning focus:ring-warning border-black/20"
                    />
                    <span className="flex items-center gap-1.5">
                      <Bookmark size={14} className="text-warning fill-warning" />
                      Saved Bookmarks Only ({savedCollegeIds.length})
                    </span>
                  </label>
                </div>
              </div>

              {/* Drawer Footer */}
              <div className="p-4 sm:p-5 pb-[max(1rem,env(safe-area-inset-bottom))] border-t border-black/10 dark:border-white/10 bg-crust flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => {
                    resetFilters();
                    setIsMobileFilterOpen(false);
                  }}
                  className="px-4 py-3 rounded-xl border border-black/10 dark:border-white/10 text-text-muted hover:text-text-main text-xs font-bold min-h-[46px] cursor-pointer"
                >
                  Reset All
                </button>
                <button
                  type="button"
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="flex-1 px-6 py-3 rounded-xl bg-warning text-crust font-black text-xs uppercase tracking-wider shadow-lg hover:bg-warning/90 transition-all min-h-[46px] cursor-pointer"
                >
                  Show {filteredColleges.length} {filteredColleges.length === 1 ? 'Institute' : 'Institutes'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Professional College Comparison Dock & Matrix Modal */}
      <CollegeComparisonSystem
        colleges={colleges}
        compareIds={compareCollegeIds}
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
        onOpen={() => setIsCompareModalOpen(true)}
        onToggleCompare={(cId) => handleToggleCompare(cId)}
        onSetCompareIds={handleSetCompareIds}
        onClearCompare={handleClearCompare}
        getDisplayInstitutionType={getDisplayInstitutionType}
        parseNumericMinFee={parseNumericMinFee}
        matchesCourseDegreeLevel={matchesCourseDegreeLevel}
      />
    </div>
  );
}
