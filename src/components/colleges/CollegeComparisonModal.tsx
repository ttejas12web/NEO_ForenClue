import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Scale,
  X,
  Plus,
  Search,
  Award,
  MapPin,
  ShieldCheck,
  GraduationCap,
  BookOpen,
  CheckCircle2,
  ExternalLink,
  Share2,
  Check,
  Sparkles,
  Trash2,
  ChevronRight,
  ChevronDown,
  Building2,
  FileText,
  Phone,
  Mail,
  TrendingDown,
  Trophy,
  Columns2,
  Rows3,
} from 'lucide-react';
import { College } from '@/types/college';
import { cn } from '@/lib/utils';
import { formatFee } from '@/pages/Colleges';

export const MAX_COMPARE_COLLEGES = 4;

interface CollegeComparisonProps {
  colleges: College[];
  compareIds: string[];
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
  onToggleCompare: (collegeId: string) => void;
  onSetCompareIds: (ids: string[]) => void;
  onClearCompare: () => void;
  getDisplayInstitutionType: (college: College) => string;
  parseNumericMinFee: (college: College) => number;
  matchesCourseDegreeLevel: (course: any, degree: string) => boolean;
}

type CompareSectionTab = 'all' | 'overview' | 'admissions' | 'courses' | 'facilities';

const PRESET_COMPARISONS: { label: string; shortLabel: string; description: string; ids: string[] }[] = [
  {
    label: 'NFSU vs RRU (National Importance)',
    shortLabel: 'NFSU vs RRU',
    description: 'Central government flagship forensic & security universities',
    ids: ['nfsu-gandhinagar', 'rru-gandhinagar', 'nfsu-delhi'],
  },
  {
    label: 'Top Govt. Forensic Colleges',
    shortLabel: 'Top Govt. Colleges',
    description: 'Premier state government autonomous institutes with low tuition fees',
    ids: ['ifs-mumbai', 'gifsa-aurangabad', 'holkar-science-college-indore'],
  },
  {
    label: 'Leading Private & Deemed Universities',
    shortLabel: 'Manipal vs Jain vs Amity',
    description: 'Top NAAC A++/A+ private & deemed universities for Forensic Science',
    ids: ['manipal-university', 'jain-university-bangalore', 'amity-noida'],
  },
];

function getInitials(college: College): string {
  const source = college.shortName || college.name || 'FC';
  const words = source
    .replace(/[^a-zA-Z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 0 && !['of', 'and', 'the', 'in', 'for', 'to', 'be'].includes(w.toLowerCase()));
  if (words.length === 0) return 'FC';
  if (words.length === 1) return words[0].slice(0, 3).toUpperCase();
  return words.slice(0, 3).map(w => w[0].toUpperCase()).join('');
}

export const CollegeComparisonSystem: React.FC<CollegeComparisonProps> = ({
  colleges,
  compareIds,
  isOpen,
  onClose,
  onOpen,
  onToggleCompare,
  onSetCompareIds,
  onClearCompare,
  getDisplayInstitutionType,
  parseNumericMinFee,
  matchesCourseDegreeLevel,
}) => {
  const [activeTab, setActiveTab] = useState<CompareSectionTab>('all');
  const [selectorSearch, setSelectorSearch] = useState('');
  const [copiedCompareLink, setCopiedCompareLink] = useState(false);
  const [isMobileAddDrawerOpen, setIsMobileAddDrawerOpen] = useState(false);
  const [mobileViewMode, setMobileViewMode] = useState<'grid' | 'stacked'>('grid');
  const [expandedCoursesByCollege, setExpandedCoursesByCollege] = useState<Record<string, boolean>>({});

  const selectedColleges = useMemo(() => {
    return compareIds
      .map(id => colleges.find(c => c.id === id))
      .filter((c): c is College => Boolean(c));
  }, [compareIds, colleges]);

  // Close on Escape key & lock body scroll when modal is open
  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isMobileAddDrawerOpen) {
          setIsMobileAddDrawerOpen(false);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, isMobileAddDrawerOpen, onClose]);

  // Compute lowest fee & highest course count among compared colleges (when >= 2 selected)
  const { lowestFeeCollegeId, mostProgramsCollegeId } = useMemo(() => {
    if (selectedColleges.length < 2) {
      return { lowestFeeCollegeId: null, mostProgramsCollegeId: null };
    }
    let minFee = Number.MAX_SAFE_INTEGER;
    let minFeeId: string | null = null;
    let maxCourses = -1;
    let maxCoursesId: string | null = null;

    for (const c of selectedColleges) {
      const fee = parseNumericMinFee(c);
      if (fee < minFee) {
        minFee = fee;
        minFeeId = c.id;
      }
      const courseCount = c.coursesOffered?.length || 0;
      if (courseCount > maxCourses) {
        maxCourses = courseCount;
        maxCoursesId = c.id;
      }
    }

    return {
      lowestFeeCollegeId: minFee < Number.MAX_SAFE_INTEGER ? minFeeId : null,
      mostProgramsCollegeId: maxCourses > 0 ? maxCoursesId : null,
    };
  }, [selectedColleges, parseNumericMinFee]);

  // Available colleges to add into comparison
  const availableToAdd = useMemo(() => {
    const q = selectorSearch.trim().toLowerCase();
    return colleges
      .filter(c => !compareIds.includes(c.id))
      .filter(c => {
        if (!q) return true;
        return (
          c.name.toLowerCase().includes(q) ||
          (c.shortName && c.shortName.toLowerCase().includes(q)) ||
          c.city.toLowerCase().includes(q) ||
          (c.state && c.state.toLowerCase().includes(q)) ||
          c.type.toLowerCase().includes(q)
        );
      })
      .slice(0, 16);
  }, [colleges, compareIds, selectorSearch]);

  const handleShareComparison = async () => {
    if (selectedColleges.length === 0) return;
    const url = `${window.location.origin}/colleges?compare=${selectedColleges.map(c => c.id).join(',')}`;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const textArea = document.createElement('textarea');
      textArea.value = url;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }
    setCopiedCompareLink(true);
    setTimeout(() => setCopiedCompareLink(false), 2500);
  };

  const toggleCourseExpansion = (collegeId: string) => {
    setExpandedCoursesByCollege(prev => ({
      ...prev,
      [collegeId]: !prev[collegeId],
    }));
  };

  const showSection = (section: CompareSectionTab) => activeTab === 'all' || activeTab === section;

  return (
    <>
      {/* Floating Bottom Comparison Dock (Mobile & Desktop Responsive) */}
      <AnimatePresence>
        {selectedColleges.length > 0 && !isOpen && (
          <motion.div
            initial={{ y: 110, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 110, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            className="fixed bottom-0 sm:bottom-4 left-0 sm:left-1/2 sm:-translate-x-1/2 z-[900] w-full sm:w-[calc(100%-1.5rem)] max-w-5xl px-2.5 pb-[max(0.65rem,env(safe-area-inset-bottom))] sm:p-0"
            role="region"
            aria-label="College comparison tray"
          >
            <div className="bg-surface/95 backdrop-blur-xl border-2 border-warning/45 rounded-2xl p-2.5 sm:p-3.5 shadow-2xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2.5 sm:gap-3">
              {/* Selected College Chips Strip */}
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar flex-1 py-0.5">
                <div className="hidden sm:flex items-center gap-2 pr-2.5 border-r border-black/10 dark:border-white/10 shrink-0">
                  <div className="w-9 h-9 rounded-xl bg-warning/15 border border-warning/30 text-warning flex items-center justify-center">
                    <Scale size={18} />
                  </div>
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-wider text-warning">
                      Compare List
                    </div>
                    <div className="text-xs font-bold text-text-main tabular-nums">
                      {selectedColleges.length} of {MAX_COMPARE_COLLEGES}
                    </div>
                  </div>
                </div>

                {selectedColleges.map(college => (
                  <div
                    key={college.id}
                    className="flex items-center gap-1.5 sm:gap-2 pl-2 pr-1 py-1 sm:py-1.5 rounded-xl bg-background border border-black/10 dark:border-white/10 shrink-0 max-w-[165px] sm:max-w-[205px]"
                  >
                    <div className="w-6 h-6 rounded-lg bg-warning/15 text-warning font-black text-[10px] flex items-center justify-center shrink-0">
                      {getInitials(college)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] sm:text-xs font-bold text-text-main truncate">
                        {college.shortName || college.name}
                      </p>
                      <p className="text-[9px] sm:text-[10px] text-text-muted truncate hidden sm:block">
                        {college.city}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => onToggleCompare(college.id)}
                      aria-label={`Remove ${college.name} from comparison`}
                      className="p-1.5 rounded-lg text-text-muted hover:text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer min-w-[28px] min-h-[28px] flex items-center justify-center"
                    >
                      <X size={13} />
                    </button>
                  </div>
                ))}

                {selectedColleges.length < MAX_COMPARE_COLLEGES && (
                  <button
                    type="button"
                    onClick={() => {
                      onOpen();
                      setIsMobileAddDrawerOpen(true);
                    }}
                    className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl border border-dashed border-black/20 dark:border-white/20 text-text-muted hover:text-warning hover:border-warning/50 text-[11px] sm:text-xs font-bold transition-all shrink-0 cursor-pointer min-h-[34px]"
                  >
                    <Plus size={13} className="text-warning" />
                    <span>Add ({MAX_COMPARE_COLLEGES - selectedColleges.length})</span>
                  </button>
                )}
              </div>

              {/* Action Controls Row */}
              <div className="flex items-center justify-between md:justify-end gap-2 shrink-0 pt-1.5 md:pt-0 border-t md:border-t-0 border-black/10 dark:border-white/10">
                <div className="flex items-center gap-1.5 sm:hidden">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-lg bg-warning/15 text-warning font-black text-xs tabular-nums">
                    {selectedColleges.length}
                  </span>
                  <span className="text-[11px] font-bold text-text-muted">
                    of {MAX_COMPARE_COLLEGES} selected
                  </span>
                </div>

                <div className="flex items-center gap-2 ml-auto">
                  <button
                    type="button"
                    onClick={onClearCompare}
                    aria-label="Clear comparison list"
                    className="px-2.5 sm:px-3 py-2 rounded-xl text-xs font-bold text-text-muted hover:text-rose-500 hover:bg-rose-500/10 transition-colors flex items-center gap-1.5 cursor-pointer min-h-[40px]"
                  >
                    <Trash2 size={14} />
                    <span className="hidden xs:inline">Clear</span>
                  </button>

                  <button
                    type="button"
                    onClick={onOpen}
                    className="px-4 sm:px-5 py-2.5 rounded-xl bg-warning text-crust font-black text-xs uppercase tracking-wider shadow-lg hover:bg-warning/90 transition-all flex items-center gap-1.5 sm:gap-2 cursor-pointer min-h-[42px]"
                  >
                    <Scale size={15} />
                    <span>Compare Now ({selectedColleges.length})</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full-Screen Mobile Sheet / Large Desktop Modal Comparison Matrix */}
      <AnimatePresence>
        {isOpen && (
          <div
            className="fixed inset-0 z-[1000] flex items-end sm:items-center justify-center sm:p-4 lg:p-6"
            role="dialog"
            aria-modal="true"
            aria-label="Forensic Science College Comparison Matrix"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/80 backdrop-blur-md"
            />

            {/* Modal Container (Full height bottom sheet on mobile, rounded 3xl modal on desktop) */}
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 28 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="relative w-full max-w-7xl h-[96dvh] sm:h-auto sm:max-h-[92vh] bg-surface border-t sm:border border-black/10 dark:border-white/10 rounded-t-3xl sm:rounded-3xl shadow-2xl z-10 flex flex-col overflow-hidden"
            >
              {/* Top Modal Header */}
              <div className="px-3.5 py-3 sm:p-6 border-b border-black/10 dark:border-white/10 bg-crust flex flex-col gap-2.5 sm:gap-4 shrink-0">
                {/* Title & Action Buttons */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-warning/15 border border-warning/30 text-warning flex items-center justify-center shrink-0">
                      <Scale size={18} className="sm:w-[22px] sm:h-[22px]" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h2 className="text-sm sm:text-xl font-black text-text-main tracking-tight truncate">
                          College Comparison
                        </h2>
                        <span className="px-2 py-0.5 rounded-full bg-warning/15 text-warning font-black text-[10px] sm:text-[11px] uppercase tracking-wider tabular-nums shrink-0">
                          {selectedColleges.length}/{MAX_COMPARE_COLLEGES}
                        </span>
                      </div>
                      <p className="hidden sm:block text-xs text-text-muted font-medium mt-0.5">
                        Compare accreditations, tuition fees, entrance procedures, degree levels, and forensic lab infrastructure side by side.
                      </p>
                    </div>
                  </div>

                  {/* Header Actions */}
                  <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                    {selectedColleges.length > 0 && (
                      <>
                        <button
                          type="button"
                          onClick={handleShareComparison}
                          title="Copy shareable comparison link"
                          className="px-2.5 sm:px-3.5 py-2 rounded-xl bg-surface border border-black/10 dark:border-white/10 text-text-main hover:border-warning/50 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer min-h-[38px]"
                        >
                          {copiedCompareLink ? (
                            <>
                              <Check size={14} className="text-emerald-500" />
                              <span className="text-emerald-500 hidden sm:inline">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Share2 size={14} className="text-warning" />
                              <span className="hidden sm:inline">Share Matrix</span>
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={onClearCompare}
                          title="Reset all selected colleges"
                          className="px-2.5 sm:px-3.5 py-2 rounded-xl bg-surface border border-black/10 dark:border-white/10 text-text-muted hover:text-rose-500 hover:border-rose-500/40 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer min-h-[38px]"
                        >
                          <Trash2 size={14} />
                          <span className="hidden sm:inline">Reset</span>
                        </button>
                      </>
                    )}

                    <button
                      type="button"
                      onClick={onClose}
                      aria-label="Close comparison matrix"
                      className="p-2 rounded-xl bg-surface border border-black/10 dark:border-white/10 text-text-muted hover:text-text-main hover:border-warning/40 transition-colors cursor-pointer min-h-[38px] min-w-[38px] flex items-center justify-center"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>

                {/* Section Filter Tabs & Preset Comparisons Bar */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2 sm:gap-3 pt-2 border-t border-black/5 dark:border-white/5">
                  <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                    {(
                      [
                        { id: 'all', label: 'All Parameters', shortLabel: 'All' },
                        { id: 'overview', label: 'Overview & Ranking', shortLabel: 'Overview' },
                        { id: 'admissions', label: 'Fees & Admissions', shortLabel: 'Fees & Exam' },
                        { id: 'courses', label: 'Courses & Degrees', shortLabel: 'Courses' },
                        { id: 'facilities', label: 'Labs & Facilities', shortLabel: 'Labs & Links' },
                      ] as { id: CompareSectionTab; label: string; shortLabel: string }[]
                    ).map(tab => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveTab(tab.id)}
                        className={cn(
                          'px-3 py-1.5 rounded-xl text-[11px] sm:text-xs font-bold transition-all shrink-0 cursor-pointer min-h-[34px]',
                          activeTab === tab.id
                            ? 'bg-warning text-crust font-black shadow-xs'
                            : 'bg-surface text-text-muted hover:text-text-main border border-black/5 dark:border-white/10'
                        )}
                      >
                        <span className="sm:hidden">{tab.shortLabel}</span>
                        <span className="hidden sm:inline">{tab.label}</span>
                      </button>
                    ))}
                  </div>

                  {/* Quick Preset Comparisons */}
                  <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                    <span className="text-[10px] sm:text-[11px] font-bold text-text-muted shrink-0 flex items-center gap-1">
                      <Sparkles size={11} className="text-warning" /> Presets:
                    </span>
                    {PRESET_COMPARISONS.map(preset => (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => {
                          const validIds = preset.ids.filter(id => colleges.some(c => c.id === id));
                          if (validIds.length > 0) {
                            onSetCompareIds(validIds);
                            setIsMobileAddDrawerOpen(false);
                          }
                        }}
                        title={preset.description}
                        className="px-2.5 py-1 rounded-lg bg-surface hover:bg-warning/15 text-text-muted hover:text-warning border border-black/10 dark:border-white/10 hover:border-warning/40 text-[10px] sm:text-[11px] font-bold transition-all shrink-0 cursor-pointer"
                      >
                        <span className="sm:hidden">{preset.shortLabel}</span>
                        <span className="hidden sm:inline">{preset.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sticky Mobile Selected Institutes Bar & Add Drawer (Visible on < lg when >= 1 college selected) */}
              {selectedColleges.length > 0 && (
                <div className="lg:hidden bg-background/95 backdrop-blur-md border-b border-black/10 dark:border-white/10 px-3.5 py-2.5 shrink-0 space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar flex-1 py-0.5">
                      {selectedColleges.map((c, index) => (
                        <div
                          key={c.id}
                          className="flex items-center gap-1.5 pl-2 pr-1 py-1 rounded-xl bg-surface border border-black/10 dark:border-white/10 shrink-0 max-w-[160px]"
                        >
                          <span className="w-5 h-5 rounded-md bg-warning text-crust font-black text-[10px] flex items-center justify-center shrink-0">
                            {index + 1}
                          </span>
                          <span className="text-[11px] font-bold text-text-main truncate">
                            {c.shortName || c.name}
                          </span>
                          <button
                            type="button"
                            onClick={() => onToggleCompare(c.id)}
                            aria-label={`Remove ${c.name}`}
                            className="p-1 text-text-muted hover:text-rose-500 rounded-md"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}

                      {selectedColleges.length < MAX_COMPARE_COLLEGES && (
                        <button
                          type="button"
                          onClick={() => setIsMobileAddDrawerOpen(prev => !prev)}
                          className={cn(
                            'flex items-center gap-1 px-2.5 py-1.5 rounded-xl border text-[11px] font-black transition-all shrink-0 cursor-pointer',
                            isMobileAddDrawerOpen
                              ? 'bg-warning text-crust border-warning'
                              : 'border-dashed border-warning/50 text-warning bg-warning/5'
                          )}
                        >
                          <Plus size={12} />
                          <span>Add ({MAX_COMPARE_COLLEGES - selectedColleges.length})</span>
                        </button>
                      )}
                    </div>

                    {/* Mobile Layout Toggle (2-Col Split vs Full-Width Cards) when >= 2 colleges */}
                    {selectedColleges.length >= 2 && (
                      <div className="flex items-center bg-surface border border-black/10 dark:border-white/10 rounded-xl p-0.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => setMobileViewMode('grid')}
                          title="2-Column Split View"
                          aria-label="2-Column Split View"
                          className={cn(
                            'p-1.5 rounded-lg transition-colors',
                            mobileViewMode === 'grid'
                              ? 'bg-warning text-crust'
                              : 'text-text-muted hover:text-text-main'
                          )}
                        >
                          <Columns2 size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setMobileViewMode('stacked')}
                          title="Stacked Full-Width View"
                          aria-label="Stacked Full-Width View"
                          className={cn(
                            'p-1.5 rounded-lg transition-colors',
                            mobileViewMode === 'stacked'
                              ? 'bg-warning text-crust'
                              : 'text-text-muted hover:text-text-main'
                          )}
                        >
                          <Rows3 size={14} />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Expandable Mobile Search Panel to Add Another College */}
                  <AnimatePresence>
                    {isMobileAddDrawerOpen && selectedColleges.length < MAX_COMPARE_COLLEGES && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="pt-1 pb-2 space-y-2 border-t border-black/10 dark:border-white/10">
                          <div className="relative">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-warning" />
                            <input
                              type="search"
                              value={selectorSearch}
                              onChange={e => setSelectorSearch(e.target.value)}
                              placeholder="Search college by name, city, or state..."
                              className="w-full pl-9 pr-8 py-2.5 rounded-xl bg-surface border border-black/10 dark:border-white/10 text-xs font-semibold text-text-main focus:border-warning focus:outline-none"
                            />
                            {selectorSearch && (
                              <button
                                type="button"
                                onClick={() => setSelectorSearch('')}
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted"
                              >
                                <X size={14} />
                              </button>
                            )}
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-44 overflow-y-auto pr-0.5">
                            {availableToAdd.slice(0, 8).map(item => (
                              <button
                                key={item.id}
                                type="button"
                                onClick={() => {
                                  onToggleCompare(item.id);
                                  setSelectorSearch('');
                                  if (selectedColleges.length + 1 >= MAX_COMPARE_COLLEGES) {
                                    setIsMobileAddDrawerOpen(false);
                                  }
                                }}
                                className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-surface hover:bg-warning/10 border border-black/10 dark:border-white/10 text-left transition-all cursor-pointer"
                              >
                                <div className="min-w-0">
                                  <p className="text-xs font-bold text-text-main truncate">
                                    {item.shortName || item.name}
                                  </p>
                                  <p className="text-[10px] text-text-muted truncate">
                                    {item.city}, {item.state || item.country}
                                  </p>
                                </div>
                                <span className="px-2 py-1 rounded-lg bg-warning/15 text-warning font-black text-[10px] shrink-0 flex items-center gap-0.5">
                                  <Plus size={11} /> Add
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* Modal Body */}
              <div className="flex-1 overflow-y-auto overflow-x-auto p-3.5 sm:p-6">
                {selectedColleges.length === 0 ? (
                  /* Empty State when 0 colleges selected */
                  <div className="max-w-3xl mx-auto py-4 sm:py-8 space-y-6 text-center">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-warning/15 text-warning flex items-center justify-center mx-auto">
                      <Scale size={28} />
                    </div>
                    <div className="space-y-1.5">
                      <h3 className="text-lg sm:text-xl font-black text-text-main">
                        Select Institutes to Compare Side-by-Side
                      </h3>
                      <p className="text-xs sm:text-sm text-text-muted max-w-xl mx-auto leading-relaxed">
                        Search for any forensic science university or college below, or tap one of our curated comparison presets to evaluate courses, fee structures, and accreditations.
                      </p>
                    </div>

                    {/* Search box to add first college */}
                    <div className="max-w-xl mx-auto space-y-3 text-left">
                      <div className="relative">
                        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-warning" />
                        <input
                          type="search"
                          value={selectorSearch}
                          onChange={e => setSelectorSearch(e.target.value)}
                          placeholder="Search by college name, city, or state (e.g., NFSU, Holkar, Manipal)..."
                          className="w-full pl-10 pr-4 py-3 rounded-xl bg-background border border-black/10 dark:border-white/10 text-xs font-semibold text-text-main focus:border-warning focus:outline-none min-h-[44px]"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-1">
                        {availableToAdd.map(college => (
                          <button
                            key={college.id}
                            type="button"
                            onClick={() => onToggleCompare(college.id)}
                            className="flex items-center justify-between gap-3 p-3 rounded-xl bg-background hover:bg-warning/10 border border-black/10 dark:border-white/10 hover:border-warning/40 text-left transition-all cursor-pointer group min-h-[52px]"
                          >
                            <div className="min-w-0">
                              <p className="text-xs font-black text-text-main group-hover:text-warning truncate">
                                {college.name}
                              </p>
                              <p className="text-[11px] text-text-muted truncate">
                                {college.city}, {college.state || college.country} • {getDisplayInstitutionType(college)}
                              </p>
                            </div>
                            <Plus size={16} className="text-warning shrink-0" />
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Curated Preset Cards */}
                    <div className="pt-4 border-t border-black/10 dark:border-white/10">
                      <p className="text-xs font-black uppercase tracking-wider text-text-muted mb-3">
                        Or Load a Quick Professional Comparison Preset
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-left">
                        {PRESET_COMPARISONS.map(preset => (
                          <button
                            key={preset.label}
                            type="button"
                            onClick={() => {
                              const validIds = preset.ids.filter(id => colleges.some(c => c.id === id));
                              if (validIds.length > 0) onSetCompareIds(validIds);
                            }}
                            className="p-4 rounded-2xl bg-background border border-black/10 dark:border-white/10 hover:border-warning/50 transition-all space-y-1.5 cursor-pointer group"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-black text-text-main group-hover:text-warning">
                                {preset.label}
                              </span>
                              <ChevronRight size={14} className="text-warning" />
                            </div>
                            <p className="text-[11px] text-text-muted leading-relaxed">
                              {preset.description}
                            </p>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* =====================================================================
                        MOBILE & TABLET COMPARISON VIEW (< 1024px) — ZERO HORIZONTAL SCROLL
                       ===================================================================== */}
                    <div className="lg:hidden space-y-5 pb-6">
                      {/* Mobile Selected Colleges Summary Cards */}
                      <div
                        className={cn(
                          'grid gap-2.5',
                          mobileViewMode === 'grid' && selectedColleges.length >= 2
                            ? 'grid-cols-2'
                            : 'grid-cols-1'
                        )}
                      >
                        {selectedColleges.map((college, idx) => {
                          const isLowestFee = lowestFeeCollegeId === college.id;
                          const isMostPrograms = mostProgramsCollegeId === college.id;

                          return (
                            <div
                              key={college.id}
                              className="p-3 rounded-2xl bg-background border border-black/10 dark:border-white/10 flex flex-col justify-between gap-2.5 relative"
                            >
                              <button
                                type="button"
                                onClick={() => onToggleCompare(college.id)}
                                aria-label={`Remove ${college.name}`}
                                className="absolute top-2.5 right-2.5 p-1 rounded-lg bg-surface text-text-muted hover:text-rose-500 border border-black/10 dark:border-white/10"
                              >
                                <X size={13} />
                              </button>

                              <div className="space-y-2 pr-6">
                                <div className="flex flex-wrap items-center gap-1">
                                  <span className="w-5 h-5 rounded-md bg-warning text-crust font-black text-[10px] flex items-center justify-center shrink-0">
                                    {idx + 1}
                                  </span>
                                  <span className="px-2 py-0.5 rounded bg-warning/15 text-warning font-black text-[9px] uppercase tracking-wider truncate max-w-full">
                                    {getDisplayInstitutionType(college)}
                                  </span>
                                  {isLowestFee && (
                                    <span className="px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-black text-[9px] uppercase inline-flex items-center gap-0.5">
                                      <TrendingDown size={10} /> Lowest Fee
                                    </span>
                                  )}
                                  {isMostPrograms && (
                                    <span className="px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-600 dark:text-amber-300 font-black text-[9px] uppercase inline-flex items-center gap-0.5">
                                      <Trophy size={10} /> Top Courses
                                    </span>
                                  )}
                                </div>

                                <Link
                                  to={`/colleges/${college.id}`}
                                  onClick={onClose}
                                  className="text-xs sm:text-sm font-black text-text-main hover:text-warning line-clamp-2 leading-snug block"
                                >
                                  {college.name}
                                </Link>

                                <p className="text-[11px] font-semibold text-text-muted flex items-center gap-1">
                                  <MapPin size={11} className="text-warning shrink-0" />
                                  <span className="truncate">
                                    {college.city}, {college.state || college.country}
                                  </span>
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* MOBILE SECTION 1: OVERVIEW & STANDING */}
                      {showSection('overview') && (
                        <div className="space-y-3">
                          <div className="px-3.5 py-2 rounded-xl bg-crust border border-black/10 dark:border-white/10 flex items-center gap-2 font-black text-[11px] uppercase tracking-wider text-warning">
                            <Building2 size={14} />
                            <span>Overview, Accreditation & Ranking</span>
                          </div>

                          {/* Accreditation Card */}
                          <div className="rounded-2xl bg-background border border-black/10 dark:border-white/10 overflow-hidden">
                            <div className="px-3.5 py-2 bg-crust/50 border-b border-black/5 dark:border-white/5 text-[11px] font-black uppercase tracking-wider text-text-muted">
                              Accreditation & Approvals
                            </div>
                            <div
                              className={cn(
                                'grid divide-y sm:divide-y-0',
                                mobileViewMode === 'grid' && selectedColleges.length >= 2
                                  ? 'grid-cols-2 divide-x divide-black/10 dark:divide-white/10'
                                  : 'grid-cols-1 divide-black/10 dark:divide-white/10'
                              )}
                            >
                              {selectedColleges.map((c, idx) => (
                                <div key={c.id} className="p-3 space-y-1.5">
                                  <div className="text-[10px] font-black text-warning uppercase tracking-wider truncate">
                                    #{idx + 1} {c.shortName || c.name}
                                  </div>
                                  {c.accreditation ? (
                                    <div className="flex flex-wrap gap-1">
                                      {c.accreditation.split('|').map((item, i) => (
                                        <span
                                          key={i}
                                          className="px-2 py-0.5 rounded-md bg-warning/10 border border-warning/25 text-text-main font-bold text-[10px] sm:text-[11px]"
                                        >
                                          {item.trim()}
                                        </span>
                                      ))}
                                    </div>
                                  ) : (
                                    <p className="text-xs text-text-muted">UGC / Govt. Recognized</p>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Ranking Card */}
                          <div className="rounded-2xl bg-background border border-black/10 dark:border-white/10 overflow-hidden">
                            <div className="px-3.5 py-2 bg-crust/50 border-b border-black/5 dark:border-white/5 text-[11px] font-black uppercase tracking-wider text-text-muted">
                              National / Global Ranking
                            </div>
                            <div
                              className={cn(
                                'grid divide-y sm:divide-y-0',
                                mobileViewMode === 'grid' && selectedColleges.length >= 2
                                  ? 'grid-cols-2 divide-x divide-black/10 dark:divide-white/10'
                                  : 'grid-cols-1 divide-black/10 dark:divide-white/10'
                              )}
                            >
                              {selectedColleges.map((c, idx) => (
                                <div key={c.id} className="p-3 space-y-1">
                                  <div className="text-[10px] font-black text-warning uppercase tracking-wider truncate">
                                    #{idx + 1} {c.shortName || c.name}
                                  </div>
                                  {c.ranking ? (
                                    <p className="text-xs font-bold text-text-main flex items-start gap-1.5 leading-snug">
                                      <Award size={13} className="text-warning shrink-0 mt-0.5" />
                                      <span>{c.ranking}</span>
                                    </p>
                                  ) : (
                                    <p className="text-xs text-text-muted">Recognized Forensic Program</p>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* MOBILE SECTION 2: FEES & ADMISSIONS */}
                      {showSection('admissions') && (
                        <div className="space-y-3">
                          <div className="px-3.5 py-2 rounded-xl bg-crust border border-black/10 dark:border-white/10 flex items-center gap-2 font-black text-[11px] uppercase tracking-wider text-warning">
                            <FileText size={14} />
                            <span>Tuition Fee & Admission Procedure</span>
                          </div>

                          {/* Tuition Fee Card */}
                          <div className="rounded-2xl bg-background border border-black/10 dark:border-white/10 overflow-hidden">
                            <div className="px-3.5 py-2 bg-crust/50 border-b border-black/5 dark:border-white/5 text-[11px] font-black uppercase tracking-wider text-text-muted">
                              Estimated Annual Tuition Fee
                            </div>
                            <div
                              className={cn(
                                'grid divide-y sm:divide-y-0',
                                mobileViewMode === 'grid' && selectedColleges.length >= 2
                                  ? 'grid-cols-2 divide-x divide-black/10 dark:divide-white/10'
                                  : 'grid-cols-1 divide-black/10 dark:divide-white/10'
                              )}
                            >
                              {selectedColleges.map((c, idx) => {
                                const fee = formatFee(c.feesRange, c.country);
                                const isLowest = lowestFeeCollegeId === c.id;
                                return (
                                  <div
                                    key={c.id}
                                    className={cn('p-3 space-y-1', isLowest && 'bg-emerald-500/5')}
                                  >
                                    <div className="text-[10px] font-black text-warning uppercase tracking-wider truncate">
                                      #{idx + 1} {c.shortName || c.name}
                                    </div>
                                    <div className="text-xs sm:text-sm font-black text-warning tabular-nums">
                                      {fee || 'Refer to Prospectus'}
                                    </div>
                                    {isLowest && (
                                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-black text-[9px] uppercase">
                                        <TrendingDown size={10} /> Most Affordable
                                      </span>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {/* Admission Process Card */}
                          <div className="rounded-2xl bg-background border border-black/10 dark:border-white/10 overflow-hidden">
                            <div className="px-3.5 py-2 bg-crust/50 border-b border-black/5 dark:border-white/5 text-[11px] font-black uppercase tracking-wider text-text-muted">
                              Entrance Exam & Admission Process
                            </div>
                            <div className="divide-y divide-black/10 dark:divide-white/10">
                              {selectedColleges.map((c, idx) => (
                                <div key={c.id} className="p-3 space-y-1">
                                  <div className="text-[10px] font-black text-warning uppercase tracking-wider">
                                    #{idx + 1} {c.shortName || c.name}
                                  </div>
                                  <p className="text-xs text-text-main leading-relaxed">
                                    {c.admissionProcess || 'Merit / University Entrance Test'}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* MOBILE SECTION 3: COURSES & DEGREES */}
                      {showSection('courses') && (
                        <div className="space-y-3">
                          <div className="px-3.5 py-2 rounded-xl bg-crust border border-black/10 dark:border-white/10 flex items-center gap-2 font-black text-[11px] uppercase tracking-wider text-warning">
                            <GraduationCap size={14} />
                            <span>Degree Levels & Forensic Courses</span>
                          </div>

                          {/* Degree Levels Checklist */}
                          <div className="rounded-2xl bg-background border border-black/10 dark:border-white/10 overflow-hidden">
                            <div className="px-3.5 py-2 bg-crust/50 border-b border-black/5 dark:border-white/5 text-[11px] font-black uppercase tracking-wider text-text-muted">
                              Degree Levels Offered
                            </div>
                            <div className="divide-y divide-black/10 dark:divide-white/10">
                              {selectedColleges.map((c, idx) => {
                                const levels = [
                                  { label: 'Bachelor (UG)', key: 'Bachelor' },
                                  { label: 'Master (PG)', key: 'Master' },
                                  { label: 'Ph.D.', key: 'Doctorate' },
                                  { label: 'PG Diploma', key: 'Diploma' },
                                ];
                                return (
                                  <div key={c.id} className="p-3 space-y-2">
                                    <div className="text-[10px] font-black text-warning uppercase tracking-wider">
                                      #{idx + 1} {c.shortName || c.name} ({c.coursesOffered.length} Programs)
                                    </div>
                                    <div className="grid grid-cols-2 gap-1.5">
                                      {levels.map(lvl => {
                                        const available = (c.coursesOffered || []).some(
                                          course =>
                                            matchesCourseDegreeLevel(course, lvl.key) ||
                                            (lvl.key === 'Diploma' &&
                                              matchesCourseDegreeLevel(course, 'Certificate'))
                                        );
                                        return (
                                          <div
                                            key={lvl.key}
                                            className={cn(
                                              'flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-[11px] font-bold',
                                              available
                                                ? 'bg-emerald-500/10 border-emerald-500/30 text-text-main'
                                                : 'bg-surface/40 border-black/5 dark:border-white/5 text-text-muted/45'
                                            )}
                                          >
                                            {available ? (
                                              <CheckCircle2 size={12} className="text-emerald-500 shrink-0" />
                                            ) : (
                                              <X size={12} className="opacity-40 shrink-0" />
                                            )}
                                            <span className="truncate">{lvl.label}</span>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {/* Courses Breakdown per College (Collapsible if > 2 courses on mobile) */}
                          <div className="rounded-2xl bg-background border border-black/10 dark:border-white/10 overflow-hidden">
                            <div className="px-3.5 py-2 bg-crust/50 border-b border-black/5 dark:border-white/5 text-[11px] font-black uppercase tracking-wider text-text-muted">
                              Courses, Eligibility & Fee Breakdown
                            </div>
                            <div className="divide-y divide-black/10 dark:divide-white/10">
                              {selectedColleges.map((c, idx) => {
                                const isExpanded = Boolean(expandedCoursesByCollege[c.id]);
                                const visibleCourses = isExpanded
                                  ? c.coursesOffered
                                  : c.coursesOffered.slice(0, 2);
                                const hiddenCount = c.coursesOffered.length - visibleCourses.length;

                                return (
                                  <div key={c.id} className="p-3 space-y-2.5">
                                    <div className="flex items-center justify-between">
                                      <span className="text-[11px] font-black text-warning uppercase tracking-wider">
                                        #{idx + 1} {c.shortName || c.name}
                                      </span>
                                      <span className="text-[11px] font-bold text-text-muted">
                                        {c.coursesOffered.length} Courses
                                      </span>
                                    </div>

                                    <div className="space-y-2">
                                      {visibleCourses.map((course, cIdx) => (
                                        <div
                                          key={cIdx}
                                          className="p-2.5 rounded-xl bg-surface border border-black/10 dark:border-white/10 space-y-1"
                                        >
                                          <div className="flex items-start justify-between gap-2">
                                            <span className="text-xs font-black text-text-main leading-snug">
                                              {course.name}
                                            </span>
                                            <span className="px-2 py-0.5 rounded bg-warning/15 text-warning font-black text-[10px] shrink-0">
                                              {course.duration}
                                            </span>
                                          </div>
                                          {course.estimatedFees && (
                                            <p className="text-[11px] font-bold text-warning tabular-nums">
                                              Fee: {formatFee(course.estimatedFees, c.country)}
                                            </p>
                                          )}
                                          {course.eligibility && (
                                            <p className="text-[11px] text-text-muted leading-relaxed">
                                              <strong className="text-text-main">Eligibility:</strong>{' '}
                                              {course.eligibility}
                                            </p>
                                          )}
                                        </div>
                                      ))}
                                    </div>

                                    {c.coursesOffered.length > 2 && (
                                      <button
                                        type="button"
                                        onClick={() => toggleCourseExpansion(c.id)}
                                        className="w-full py-2 rounded-xl bg-surface border border-black/10 dark:border-white/10 text-xs font-bold text-warning flex items-center justify-center gap-1 cursor-pointer"
                                      >
                                        <span>
                                          {isExpanded
                                            ? 'Show Fewer Courses'
                                            : `Show All ${c.coursesOffered.length} Courses (+${hiddenCount} more)`}
                                        </span>
                                        <ChevronDown
                                          size={14}
                                          className={cn('transition-transform', isExpanded && 'rotate-180')}
                                        />
                                      </button>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* MOBILE SECTION 4: LABS & DIRECT ACTIONS */}
                      {showSection('facilities') && (
                        <div className="space-y-3">
                          <div className="px-3.5 py-2 rounded-xl bg-crust border border-black/10 dark:border-white/10 flex items-center gap-2 font-black text-[11px] uppercase tracking-wider text-warning">
                            <BookOpen size={14} />
                            <span>Forensic Labs, Facilities & Official Links</span>
                          </div>

                          <div className="rounded-2xl bg-background border border-black/10 dark:border-white/10 divide-y divide-black/10 dark:divide-white/10 overflow-hidden">
                            {selectedColleges.map((c, idx) => (
                              <div key={c.id} className="p-3.5 space-y-3">
                                <div className="text-[11px] font-black text-warning uppercase tracking-wider">
                                  #{idx + 1} {c.shortName || c.name}
                                </div>

                                {c.facilities && c.facilities.length > 0 && (
                                  <div className="flex flex-wrap gap-1.5">
                                    {c.facilities.map((fac, fIdx) => (
                                      <span
                                        key={fIdx}
                                        className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-surface border border-black/10 dark:border-white/10 text-[11px] font-semibold text-text-main"
                                      >
                                        <CheckCircle2 size={11} className="text-warning shrink-0" />
                                        <span>{fac}</span>
                                      </span>
                                    ))}
                                  </div>
                                )}

                                <div className="flex items-center gap-2 pt-1">
                                  <Link
                                    to={`/colleges/${c.id}`}
                                    onClick={onClose}
                                    className="flex-1 py-2.5 px-3 rounded-xl bg-warning text-crust font-black text-xs uppercase tracking-wider text-center flex items-center justify-center gap-1 min-h-[40px]"
                                  >
                                    <span>View Profile</span>
                                    <ChevronRight size={14} />
                                  </Link>
                                  {c.website && (
                                    <a
                                      href={c.website}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="py-2.5 px-3.5 rounded-xl bg-surface border border-black/10 dark:border-white/10 text-text-main font-bold text-xs flex items-center justify-center gap-1.5 min-h-[40px]"
                                    >
                                      <span>Website</span>
                                      <ExternalLink size={13} className="text-warning" />
                                    </a>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* =====================================================================
                        DESKTOP MULTI-COLUMN MATRIX TABLE (>= 1024px)
                       ===================================================================== */}
                    <div className="hidden lg:block min-w-[740px]">
                      <table className="w-full border-collapse table-fixed">
                        <thead>
                          <tr>
                            {/* Parameter Column Header */}
                            <th className="w-56 p-4 align-top text-left bg-crust/70 border border-black/10 dark:border-white/10 rounded-tl-2xl">
                              <div className="space-y-3">
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-warning/15 text-warning text-[10px] font-black uppercase tracking-wider">
                                  <Scale size={12} /> Parameters
                                </span>
                                <h3 className="text-sm font-black text-text-main leading-snug">
                                  Institutional & Academic Comparison
                                </h3>
                                <p className="text-[11px] text-text-muted font-medium leading-relaxed">
                                  Compare up to {MAX_COMPARE_COLLEGES} forensic science institutions across verified academic metrics.
                                </p>
                              </div>
                            </th>

                            {/* Selected College Header Columns */}
                            {selectedColleges.map(college => {
                              const isLowestFee = lowestFeeCollegeId === college.id;
                              const isMostPrograms = mostProgramsCollegeId === college.id;

                              return (
                                <th
                                  key={college.id}
                                  className="p-4 align-top text-left bg-background border border-black/10 dark:border-white/10 relative group"
                                >
                                  {/* Remove button */}
                                  <button
                                    type="button"
                                    onClick={() => onToggleCompare(college.id)}
                                    aria-label={`Remove ${college.name} from comparison`}
                                    title="Remove from comparison"
                                    className="absolute top-3 right-3 p-1.5 rounded-lg bg-surface border border-black/10 dark:border-white/10 text-text-muted hover:text-rose-500 hover:border-rose-500/40 transition-colors cursor-pointer z-10"
                                  >
                                    <X size={14} />
                                  </button>

                                  <div className="space-y-3 pr-7">
                                    {/* Badges Row */}
                                    <div className="flex flex-wrap items-center gap-1.5">
                                      <span className="px-2 py-0.5 rounded-md bg-warning/15 text-warning font-black text-[10px] uppercase tracking-wider">
                                        {getDisplayInstitutionType(college)}
                                      </span>
                                      {isLowestFee && (
                                        <span className="px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-black text-[10px] uppercase tracking-wider inline-flex items-center gap-1">
                                          <TrendingDown size={11} /> Lowest Fee
                                        </span>
                                      )}
                                      {isMostPrograms && (
                                        <span className="px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-600 dark:text-amber-300 font-black text-[10px] uppercase tracking-wider inline-flex items-center gap-1">
                                          <Trophy size={11} /> Most Programs
                                        </span>
                                      )}
                                    </div>

                                    {/* College Identity */}
                                    <div className="flex items-start gap-2.5">
                                      <div className="w-10 h-10 rounded-xl bg-warning/15 border border-warning/30 text-warning font-black text-xs flex items-center justify-center shrink-0">
                                        {getInitials(college)}
                                      </div>
                                      <div className="min-w-0">
                                        <Link
                                          to={`/colleges/${college.id}`}
                                          onClick={onClose}
                                          className="text-sm font-black text-text-main hover:text-warning transition-colors line-clamp-2 leading-snug block"
                                        >
                                          {college.name}
                                        </Link>
                                        <p className="text-[11px] font-semibold text-text-muted flex items-center gap-1 mt-1">
                                          <MapPin size={11} className="text-warning shrink-0" />
                                          <span className="truncate">
                                            {college.city}, {college.state || college.country}
                                          </span>
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </th>
                              );
                            })}

                            {/* Empty Slot Column to Add Another College */}
                            {selectedColleges.length < MAX_COMPARE_COLLEGES && (
                              <th className="p-4 align-top text-left bg-crust/40 border border-dashed border-black/15 dark:border-white/15">
                                <div className="space-y-2.5">
                                  <div className="flex items-center justify-between">
                                    <span className="text-[11px] font-black uppercase tracking-wider text-warning flex items-center gap-1">
                                      <Plus size={13} /> Add Institute ({selectedColleges.length + 1}/{MAX_COMPARE_COLLEGES})
                                    </span>
                                  </div>

                                  <div className="relative">
                                    <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted" />
                                    <input
                                      type="search"
                                      value={selectorSearch}
                                      onChange={e => setSelectorSearch(e.target.value)}
                                      placeholder="Search college to add..."
                                      className="w-full pl-8 pr-2.5 py-2 rounded-xl bg-surface border border-black/10 dark:border-white/10 text-xs font-semibold text-text-main focus:border-warning focus:outline-none"
                                    />
                                  </div>

                                  <div className="max-h-36 overflow-y-auto space-y-1 pr-0.5">
                                    {availableToAdd.slice(0, 6).map(item => (
                                      <button
                                        key={item.id}
                                        type="button"
                                        onClick={() => {
                                          onToggleCompare(item.id);
                                          setSelectorSearch('');
                                        }}
                                        className="w-full flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-lg bg-surface hover:bg-warning/15 border border-black/5 dark:border-white/5 hover:border-warning/40 text-left transition-all cursor-pointer group"
                                      >
                                        <div className="min-w-0">
                                          <p className="text-[11px] font-bold text-text-main group-hover:text-warning truncate">
                                            {item.shortName || item.name}
                                          </p>
                                          <p className="text-[10px] text-text-muted truncate">
                                            {item.city}, {item.state || item.country}
                                          </p>
                                        </div>
                                        <Plus size={13} className="text-warning shrink-0" />
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              </th>
                            )}
                          </tr>
                        </thead>

                        <tbody className="text-xs">
                          {/* SECTION 1: OVERVIEW & INSTITUTIONAL STANDING */}
                          {showSection('overview') && (
                            <>
                              <tr>
                                <td
                                  colSpan={
                                    selectedColleges.length +
                                    1 +
                                    (selectedColleges.length < MAX_COMPARE_COLLEGES ? 1 : 0)
                                  }
                                  className="px-4 py-2.5 bg-crust font-black text-[11px] uppercase tracking-wider text-warning border border-black/10 dark:border-white/10"
                                >
                                  <span className="flex items-center gap-2">
                                    <Building2 size={14} /> Institutional Overview & Standing
                                  </span>
                                </td>
                              </tr>

                              {/* Institution Type */}
                              <tr>
                                <td className="p-4 font-bold text-text-muted bg-crust/30 border border-black/10 dark:border-white/10">
                                  Institution Category
                                </td>
                                {selectedColleges.map(c => (
                                  <td key={c.id} className="p-4 border border-black/10 dark:border-white/10 font-bold text-text-main">
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface border border-black/10 dark:border-white/10">
                                      <ShieldCheck size={13} className="text-warning shrink-0" />
                                      <span>{getDisplayInstitutionType(c)}</span>
                                    </span>
                                  </td>
                                ))}
                                {selectedColleges.length < MAX_COMPARE_COLLEGES && (
                                  <td className="p-4 border border-dashed border-black/10 dark:border-white/10 text-text-muted/40 text-center">
                                    —
                                  </td>
                                )}
                              </tr>

                              {/* Location & Address */}
                              <tr>
                                <td className="p-4 font-bold text-text-muted bg-crust/30 border border-black/10 dark:border-white/10">
                                  Location & Address
                                </td>
                                {selectedColleges.map(c => (
                                  <td key={c.id} className="p-4 border border-black/10 dark:border-white/10 text-text-main space-y-1">
                                    <p className="font-bold">
                                      {c.city}, {c.state ? `${c.state}, ` : ''}{c.country}
                                    </p>
                                    {c.address && (
                                      <p className="text-[11px] text-text-muted leading-relaxed">{c.address}</p>
                                    )}
                                  </td>
                                ))}
                                {selectedColleges.length < MAX_COMPARE_COLLEGES && (
                                  <td className="p-4 border border-dashed border-black/10 dark:border-white/10 text-text-muted/40 text-center">
                                    —
                                  </td>
                                )}
                              </tr>

                              {/* Accreditation */}
                              <tr>
                                <td className="p-4 font-bold text-text-muted bg-crust/30 border border-black/10 dark:border-white/10">
                                  Accreditation & Approvals
                                </td>
                                {selectedColleges.map(c => (
                                  <td key={c.id} className="p-4 border border-black/10 dark:border-white/10">
                                    {c.accreditation ? (
                                      <div className="flex flex-wrap gap-1.5">
                                        {c.accreditation.split('|').map((item, i) => (
                                          <span
                                            key={i}
                                            className="px-2.5 py-1 rounded-lg bg-warning/10 border border-warning/25 text-text-main font-bold text-[11px]"
                                          >
                                            {item.trim()}
                                          </span>
                                        ))}
                                      </div>
                                    ) : (
                                      <span className="text-text-muted">UGC / Government Recognized</span>
                                    )}
                                  </td>
                                ))}
                                {selectedColleges.length < MAX_COMPARE_COLLEGES && (
                                  <td className="p-4 border border-dashed border-black/10 dark:border-white/10 text-text-muted/40 text-center">
                                    —
                                  </td>
                                )}
                              </tr>

                              {/* Ranking */}
                              <tr>
                                <td className="p-4 font-bold text-text-muted bg-crust/30 border border-black/10 dark:border-white/10">
                                  Ranking & Recognition
                                </td>
                                {selectedColleges.map(c => (
                                  <td key={c.id} className="p-4 border border-black/10 dark:border-white/10">
                                    {c.ranking ? (
                                      <div className="flex items-start gap-2 text-text-main font-bold">
                                        <Award size={15} className="text-warning shrink-0 mt-0.5" />
                                        <span>{c.ranking}</span>
                                      </div>
                                    ) : (
                                      <span className="text-text-muted">Recognized Forensic Program</span>
                                    )}
                                  </td>
                                ))}
                                {selectedColleges.length < MAX_COMPARE_COLLEGES && (
                                  <td className="p-4 border border-dashed border-black/10 dark:border-white/10 text-text-muted/40 text-center">
                                    —
                                  </td>
                                )}
                              </tr>
                            </>
                          )}

                          {/* SECTION 2: FEES & ADMISSIONS */}
                          {showSection('admissions') && (
                            <>
                              <tr>
                                <td
                                  colSpan={
                                    selectedColleges.length +
                                    1 +
                                    (selectedColleges.length < MAX_COMPARE_COLLEGES ? 1 : 0)
                                  }
                                  className="px-4 py-2.5 bg-crust font-black text-[11px] uppercase tracking-wider text-warning border border-black/10 dark:border-white/10"
                                >
                                  <span className="flex items-center gap-2">
                                    <FileText size={14} /> Tuition Fee Structure & Admission Process
                                  </span>
                                </td>
                              </tr>

                              {/* Estimated Tuition Fee */}
                              <tr>
                                <td className="p-4 font-bold text-text-muted bg-crust/30 border border-black/10 dark:border-white/10">
                                  Estimated Annual Tuition Fee
                                </td>
                                {selectedColleges.map(c => {
                                  const fee = formatFee(c.feesRange, c.country);
                                  const isLowest = lowestFeeCollegeId === c.id;
                                  return (
                                    <td
                                      key={c.id}
                                      className={cn(
                                        'p-4 border border-black/10 dark:border-white/10',
                                        isLowest && 'bg-emerald-500/5'
                                      )}
                                    >
                                      <div className="space-y-1.5">
                                        <div className="text-sm font-black text-warning tabular-nums">
                                          {fee || 'Refer to Official Prospectus'}
                                        </div>
                                        {isLowest && (
                                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-black text-[10px] uppercase tracking-wider">
                                            <TrendingDown size={11} /> Most Affordable in Comparison
                                          </span>
                                        )}
                                      </div>
                                    </td>
                                  );
                                })}
                                {selectedColleges.length < MAX_COMPARE_COLLEGES && (
                                  <td className="p-4 border border-dashed border-black/10 dark:border-white/10 text-text-muted/40 text-center">
                                    —
                                  </td>
                                )}
                              </tr>

                              {/* Admission Process */}
                              <tr>
                                <td className="p-4 font-bold text-text-muted bg-crust/30 border border-black/10 dark:border-white/10">
                                  Entrance Exam & Admission Procedure
                                </td>
                                {selectedColleges.map(c => (
                                  <td key={c.id} className="p-4 border border-black/10 dark:border-white/10 text-text-main leading-relaxed">
                                    {c.admissionProcess || 'Merit / University Entrance Test'}
                                  </td>
                                ))}
                                {selectedColleges.length < MAX_COMPARE_COLLEGES && (
                                  <td className="p-4 border border-dashed border-black/10 dark:border-white/10 text-text-muted/40 text-center">
                                    —
                                  </td>
                                )}
                              </tr>
                            </>
                          )}

                          {/* SECTION 3: COURSES & DEGREE LEVELS */}
                          {showSection('courses') && (
                            <>
                              <tr>
                                <td
                                  colSpan={
                                    selectedColleges.length +
                                    1 +
                                    (selectedColleges.length < MAX_COMPARE_COLLEGES ? 1 : 0)
                                  }
                                  className="px-4 py-2.5 bg-crust font-black text-[11px] uppercase tracking-wider text-warning border border-black/10 dark:border-white/10"
                                >
                                  <span className="flex items-center gap-2">
                                    <GraduationCap size={14} /> Forensic Science Programs & Specializations
                                  </span>
                                </td>
                              </tr>

                              {/* Degree Levels Checklist */}
                              <tr>
                                <td className="p-4 font-bold text-text-muted bg-crust/30 border border-black/10 dark:border-white/10">
                                  Degree Levels Offered
                                </td>
                                {selectedColleges.map(c => {
                                  const levels = [
                                    { label: 'Bachelor (UG)', key: 'Bachelor' },
                                    { label: 'Master (PG)', key: 'Master' },
                                    { label: 'Doctorate (Ph.D.)', key: 'Doctorate' },
                                    { label: 'PG Diploma / Cert.', key: 'Diploma' },
                                  ];
                                  return (
                                    <td key={c.id} className="p-4 border border-black/10 dark:border-white/10">
                                      <div className="grid grid-cols-2 gap-2">
                                        {levels.map(lvl => {
                                          const available = (c.coursesOffered || []).some(
                                            course =>
                                              matchesCourseDegreeLevel(course, lvl.key) ||
                                              (lvl.key === 'Diploma' &&
                                                matchesCourseDegreeLevel(course, 'Certificate'))
                                          );
                                          return (
                                            <div
                                              key={lvl.key}
                                              className={cn(
                                                'flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-[11px] font-bold',
                                                available
                                                  ? 'bg-emerald-500/10 border-emerald-500/30 text-text-main'
                                                  : 'bg-background/50 border-black/5 dark:border-white/5 text-text-muted/50'
                                              )}
                                            >
                                              {available ? (
                                                <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
                                              ) : (
                                                <X size={13} className="opacity-40 shrink-0" />
                                              )}
                                              <span className="truncate">{lvl.label}</span>
                                            </div>
                                          );
                                        })}
                                      </div>
                                    </td>
                                  );
                                })}
                                {selectedColleges.length < MAX_COMPARE_COLLEGES && (
                                  <td className="p-4 border border-dashed border-black/10 dark:border-white/10 text-text-muted/40 text-center">
                                    —
                                  </td>
                                )}
                              </tr>

                              {/* Detailed Courses Breakdown */}
                              <tr>
                                <td className="p-4 font-bold text-text-muted bg-crust/30 border border-black/10 dark:border-white/10 align-top">
                                  Courses, Fees & Specializations
                                </td>
                                {selectedColleges.map(c => (
                                  <td key={c.id} className="p-4 border border-black/10 dark:border-white/10 align-top space-y-2.5">
                                    <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-wider text-warning pb-1 border-b border-black/5 dark:border-white/5">
                                      <span>{c.coursesOffered.length} Forensic Programs</span>
                                    </div>
                                    <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                                      {c.coursesOffered.map((course, idx) => (
                                        <div
                                          key={idx}
                                          className="p-3 rounded-xl bg-background border border-black/10 dark:border-white/10 space-y-1.5"
                                        >
                                          <div className="flex items-start justify-between gap-2">
                                            <span className="font-black text-text-main leading-snug">
                                              {course.name}
                                            </span>
                                            <span className="px-2 py-0.5 rounded bg-warning/15 text-warning font-black text-[10px] shrink-0">
                                              {course.duration}
                                            </span>
                                          </div>

                                          {course.estimatedFees && (
                                            <p className="text-[11px] font-bold text-warning tabular-nums">
                                              Fee: {formatFee(course.estimatedFees, c.country)}
                                            </p>
                                          )}

                                          {course.eligibility && (
                                            <p className="text-[11px] text-text-muted leading-relaxed">
                                              <strong className="text-text-main">Eligibility:</strong> {course.eligibility}
                                            </p>
                                          )}

                                          {course.specializations && course.specializations.length > 0 && (
                                            <div className="flex flex-wrap gap-1 pt-1">
                                              {course.specializations.slice(0, 4).map((spec, sIdx) => (
                                                <span
                                                  key={sIdx}
                                                  className="px-2 py-0.5 rounded bg-surface border border-black/5 dark:border-white/10 text-[10px] font-semibold text-text-muted"
                                                >
                                                  {spec}
                                                </span>
                                              ))}
                                            </div>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  </td>
                                ))}
                                {selectedColleges.length < MAX_COMPARE_COLLEGES && (
                                  <td className="p-4 border border-dashed border-black/10 dark:border-white/10 text-text-muted/40 text-center">
                                    —
                                  </td>
                                )}
                              </tr>
                            </>
                          )}

                          {/* SECTION 4: LABS, INFRASTRUCTURE & ACTIONS */}
                          {showSection('facilities') && (
                            <>
                              <tr>
                                <td
                                  colSpan={
                                    selectedColleges.length +
                                    1 +
                                    (selectedColleges.length < MAX_COMPARE_COLLEGES ? 1 : 0)
                                  }
                                  className="px-4 py-2.5 bg-crust font-black text-[11px] uppercase tracking-wider text-warning border border-black/10 dark:border-white/10"
                                >
                                  <span className="flex items-center gap-2">
                                    <BookOpen size={14} /> Forensic Laboratories, Campus Facilities & Contact
                                  </span>
                                </td>
                              </tr>

                              {/* Facilities */}
                              <tr>
                                <td className="p-4 font-bold text-text-muted bg-crust/30 border border-black/10 dark:border-white/10 align-top">
                                  Laboratories & Infrastructure
                                </td>
                                {selectedColleges.map(c => (
                                  <td key={c.id} className="p-4 border border-black/10 dark:border-white/10 align-top">
                                    {c.facilities && c.facilities.length > 0 ? (
                                      <div className="flex flex-wrap gap-1.5">
                                        {c.facilities.map((fac, idx) => (
                                          <span
                                            key={idx}
                                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-background border border-black/10 dark:border-white/10 text-[11px] font-semibold text-text-main"
                                          >
                                            <CheckCircle2 size={11} className="text-warning shrink-0" />
                                            <span>{fac}</span>
                                          </span>
                                        ))}
                                      </div>
                                    ) : (
                                      <span className="text-text-muted">Forensic Science Laboratories & Library</span>
                                    )}
                                  </td>
                                ))}
                                {selectedColleges.length < MAX_COMPARE_COLLEGES && (
                                  <td className="p-4 border border-dashed border-black/10 dark:border-white/10 text-text-muted/40 text-center">
                                    —
                                  </td>
                                )}
                              </tr>

                              {/* Contact & Direct Links */}
                              <tr>
                                <td className="p-4 font-bold text-text-muted bg-crust/30 border border-black/10 dark:border-white/10 rounded-bl-2xl">
                                  Direct Actions & Links
                                </td>
                                {selectedColleges.map(c => (
                                  <td key={c.id} className="p-4 border border-black/10 dark:border-white/10 space-y-3">
                                    <div className="space-y-1 text-[11px] text-text-muted">
                                      {c.contactPhone && (
                                        <p className="flex items-center gap-1.5 truncate">
                                          <Phone size={12} className="text-warning shrink-0" />
                                          <span>{c.contactPhone}</span>
                                        </p>
                                      )}
                                      {c.contactEmail && (
                                        <p className="flex items-center gap-1.5 truncate">
                                          <Mail size={12} className="text-warning shrink-0" />
                                          <span className="truncate">{c.contactEmail}</span>
                                        </p>
                                      )}
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-2 pt-1">
                                      <Link
                                        to={`/colleges/${c.id}`}
                                        onClick={onClose}
                                        className="flex-1 py-2 px-3 rounded-xl bg-warning text-crust font-black text-[11px] uppercase tracking-wider text-center hover:bg-warning/90 transition-all flex items-center justify-center gap-1"
                                      >
                                        <span>Full Profile</span>
                                        <ChevronRight size={13} />
                                      </Link>
                                      {c.website && (
                                        <a
                                          href={c.website}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="py-2 px-3 rounded-xl bg-background border border-black/10 dark:border-white/10 hover:border-warning/50 text-text-main font-bold text-[11px] flex items-center justify-center gap-1 transition-all"
                                        >
                                          <span>Website</span>
                                          <ExternalLink size={12} className="text-warning" />
                                        </a>
                                      )}
                                    </div>
                                  </td>
                                ))}
                                {selectedColleges.length < MAX_COMPARE_COLLEGES && (
                                  <td className="p-4 border border-dashed border-black/10 dark:border-white/10 text-text-muted/40 text-center">
                                    —
                                  </td>
                                )}
                              </tr>
                            </>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
