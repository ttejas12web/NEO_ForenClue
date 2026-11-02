import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Bookmark,
  X,
  Scale,
  Check,
  Trash2,
  MapPin,
  GraduationCap,
  Copy,
  Cloud,
  CloudOff,
  Filter,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { College } from '@/types/college';
import { cn } from '@/lib/utils';
import { formatFee } from '@/pages/Colleges';
import { MAX_COMPARE_COLLEGES } from './CollegeComparisonModal';

interface BookmarkedCollegesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  colleges: College[];
  savedCollegeIds: string[];
  compareCollegeIds: string[];
  savedOnly: boolean;
  isCloudSynced: boolean;
  onToggleSave: (e: React.MouseEvent, collegeId: string) => void;
  onClearAllSaved: () => void;
  onToggleCompare: (collegeId: string, e?: React.MouseEvent) => void;
  onCompareSavedColleges: (ids: string[]) => void;
  onToggleSavedOnlyFilter: () => void;
  onOpenCollegeDetails: (college: College) => void;
  getDisplayInstitutionType: (college: College) => string;
  parseNumericMinFee: (college: College) => number;
}

export const BookmarkedCollegesDrawer: React.FC<BookmarkedCollegesDrawerProps> = ({
  isOpen,
  onClose,
  colleges,
  savedCollegeIds,
  compareCollegeIds,
  savedOnly,
  isCloudSynced,
  onToggleSave,
  onClearAllSaved,
  onToggleCompare,
  onCompareSavedColleges,
  onToggleSavedOnlyFilter,
  onOpenCollegeDetails,
  getDisplayInstitutionType,
  parseNumericMinFee,
}) => {
  const { user } = useAuth();
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);

  const collegeMap = useMemo(() => {
    const map = new Map<string, College>();
    for (const c of colleges) {
      map.set(c.id, c);
    }
    return map;
  }, [colleges]);

  const savedColleges = useMemo(() => {
    return savedCollegeIds
      .map((id) => collegeMap.get(id))
      .filter((c): c is College => Boolean(c));
  }, [savedCollegeIds, collegeMap]);

  // Shortlist summary stats
  const shortlistStats = useMemo(() => {
    let govtCount = 0;
    let totalPrograms = 0;
    let lowestFee = Number.POSITIVE_INFINITY;

    for (const c of savedColleges) {
      const displayType = getDisplayInstitutionType(c).toLowerCase();
      if (
        displayType.includes('government') ||
        displayType.includes('national importance') ||
        displayType.includes('central') ||
        displayType.includes('state')
      ) {
        govtCount++;
      }
      totalPrograms += c.coursesOffered?.length || 0;
      const fee = parseNumericMinFee(c);
      if (fee < lowestFee) lowestFee = fee;
    }

    return {
      total: savedColleges.length,
      govtCount,
      privateCount: Math.max(0, savedColleges.length - govtCount),
      totalPrograms,
      lowestFee: Number.isFinite(lowestFee) ? lowestFee : null,
    };
  }, [savedColleges, getDisplayInstitutionType, parseNumericMinFee]);

  // Reset confirmation state on close
  useEffect(() => {
    if (!isOpen) {
      setConfirmClear(false);
    }
  }, [isOpen]);

  const handleCopyShortlist = async () => {
    if (savedColleges.length === 0) return;
    const lines = [
      `FORENCLUE — MY BOOKMARKED FORENSIC COLLEGES (${savedColleges.length})`,
      `====================================================`,
      ...savedColleges.map((c, i) => {
        const fee = formatFee(c.feesRange, c.country) || 'Contact University';
        const url = `${window.location.origin}/colleges/${c.id}`;
        return `${i + 1}. ${c.name} (${c.city}, ${c.state || c.country})\n   • Type: ${getDisplayInstitutionType(c)}${c.accreditation ? ` | ${c.accreditation.split('|')[0].trim()}` : ''}\n   • Est. Fee: ${fee} | Programs: ${c.coursesOffered.length} Courses\n   • Profile: ${url}`;
      }),
    ];
    const text = lines.join('\n\n');
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2400);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-[999] flex items-end sm:items-stretch sm:justify-end"
          role="dialog"
          aria-modal="true"
          aria-label="Bookmarked Colleges Manager"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/75 backdrop-blur-sm"
          />

          {/* Slide-over Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="relative w-full sm:max-w-lg bg-surface border-t sm:border-t-0 sm:border-l border-warning/30 rounded-t-3xl sm:rounded-none max-h-[90dvh] sm:max-h-full sm:h-full z-10 flex flex-col shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="px-5 py-4 bg-crust border-b border-black/10 dark:border-white/10 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-warning/15 border border-warning/30 flex items-center justify-center text-warning shrink-0">
                  <Bookmark size={18} className="fill-warning" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-sm sm:text-base font-black uppercase tracking-wider text-text-main truncate">
                    Bookmarked Colleges ({savedColleges.length})
                  </h2>
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-text-muted">
                    {user && isCloudSynced ? (
                      <span className="inline-flex items-center gap-1 text-emerald-500 dark:text-emerald-400">
                        <Cloud size={12} /> Synced to {user.email || user.displayName}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-text-muted">
                        <CloudOff size={12} /> Saved on this device
                        {!user && (
                          <Link to="/login" onClick={onClose} className="text-warning hover:underline ml-1">
                            Sign in to sync
                          </Link>
                        )}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close bookmarked colleges drawer"
                className="w-9 h-9 rounded-xl bg-surface border border-black/10 dark:border-white/10 text-text-muted hover:text-text-main flex items-center justify-center transition-colors cursor-pointer shrink-0"
              >
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
              {savedColleges.length === 0 ? (
                <div className="bg-background border border-black/10 dark:border-white/10 rounded-2xl p-6 sm:p-8 text-center space-y-4 my-4">
                  <div className="w-14 h-14 rounded-2xl bg-warning/10 border border-warning/25 text-warning flex items-center justify-center mx-auto">
                    <Bookmark size={26} />
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="text-base font-black text-text-main">
                      No Colleges Bookmarked Yet
                    </h3>
                    <p className="text-xs text-text-muted leading-relaxed max-w-sm mx-auto">
                      Click the <strong className="text-warning">Bookmark icon</strong> on any college card or university profile page to save your favorite forensic institutions here.
                    </p>
                  </div>
                  <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2.5 rounded-xl bg-warning text-crust font-black text-xs uppercase tracking-wider shadow-md hover:bg-warning/90 transition-all cursor-pointer"
                    >
                      Browse Colleges Directory
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Analytics Strip */}
                  <div className="grid grid-cols-3 gap-2.5">
                    <div className="bg-background border border-black/5 dark:border-white/10 rounded-xl p-3 text-center">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted block">
                        Saved Institutes
                      </span>
                      <span className="text-base sm:text-lg font-black text-warning">
                        {shortlistStats.total}
                      </span>
                    </div>
                    <div className="bg-background border border-black/5 dark:border-white/10 rounded-xl p-3 text-center">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted block">
                        Govt / Private
                      </span>
                      <span className="text-xs sm:text-sm font-black text-text-main mt-0.5 block">
                        {shortlistStats.govtCount} Govt • {shortlistStats.privateCount} Pvt
                      </span>
                    </div>
                    <div className="bg-background border border-black/5 dark:border-white/10 rounded-xl p-3 text-center">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted block">
                        Total Courses
                      </span>
                      <span className="text-base sm:text-lg font-black text-text-main">
                        {shortlistStats.totalPrograms}
                      </span>
                    </div>
                  </div>

                  {/* Quick Bulk Actions */}
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        onCompareSavedColleges(savedColleges.slice(0, MAX_COMPARE_COLLEGES).map((c) => c.id));
                        onClose();
                      }}
                      className="flex-1 min-w-[140px] py-2.5 px-3.5 rounded-xl bg-warning text-crust font-black text-xs uppercase tracking-wider shadow-sm hover:bg-warning/90 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Scale size={14} className="shrink-0" />
                      <span>
                        Compare {savedColleges.length > MAX_COMPARE_COLLEGES ? `Top ${MAX_COMPARE_COLLEGES}` : `All (${savedColleges.length})`}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        onToggleSavedOnlyFilter();
                        onClose();
                      }}
                      className={cn(
                        'py-2.5 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 cursor-pointer',
                        savedOnly
                          ? 'bg-warning/15 border-warning text-warning font-black'
                          : 'bg-background border-black/10 dark:border-white/10 text-text-main hover:border-warning/50'
                      )}
                    >
                      <Filter size={13} className="text-warning shrink-0" />
                      <span>{savedOnly ? 'Showing Saved Only' : 'Filter Grid'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleCopyShortlist}
                      className="py-2.5 px-3 rounded-xl bg-background border border-black/10 dark:border-white/10 text-text-main hover:border-warning/50 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      title="Copy formatted bookmarked list summary to clipboard"
                    >
                      {copiedSummary ? (
                        <>
                          <Check size={13} className="text-emerald-500 shrink-0" />
                          <span className="text-emerald-500">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy size={13} className="text-warning shrink-0" />
                          <span>Export List</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Bookmarked College Cards */}
                  <div className="space-y-3">
                    {savedColleges.map((college) => {
                      const isCompared = compareCollegeIds.includes(college.id);
                      const feeText = formatFee(college.feesRange, college.country);

                      return (
                        <div
                          key={college.id}
                          className="group bg-background border border-black/10 dark:border-white/10 hover:border-warning/40 rounded-2xl p-4 transition-all shadow-xs space-y-3"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0 flex-1 space-y-1">
                              <div className="flex flex-wrap items-center gap-1.5">
                                <span className="px-2 py-0.5 rounded-md bg-warning/15 text-warning font-black text-[10px] uppercase tracking-wider">
                                  {getDisplayInstitutionType(college)}
                                </span>
                                {college.accreditation && (
                                  <span className="px-2 py-0.5 rounded-md bg-surface border border-black/10 dark:border-white/10 text-text-muted font-bold text-[10px]">
                                    {college.accreditation.split('|')[0].trim()}
                                  </span>
                                )}
                              </div>

                              <button
                                type="button"
                                onClick={() => {
                                  onClose();
                                  onOpenCollegeDetails(college);
                                }}
                                className="text-left text-sm sm:text-base font-black text-text-main hover:text-warning transition-colors line-clamp-2 cursor-pointer"
                              >
                                {college.name}
                              </button>

                              <p className="text-xs font-semibold text-text-muted flex items-center gap-1">
                                <MapPin size={12} className="text-warning shrink-0" />
                                <span className="truncate">
                                  {college.city}, {college.state ? `${college.state}, ` : ''}{college.country}
                                </span>
                              </p>
                            </div>

                            <button
                              type="button"
                              onClick={(e) => onToggleSave(e, college.id)}
                              aria-label={`Remove ${college.name} from bookmarks`}
                              title="Remove Bookmark"
                              className="w-8 h-8 rounded-xl bg-surface border border-black/10 dark:border-white/10 text-text-muted hover:text-red-500 hover:border-red-500/30 flex items-center justify-center transition-colors cursor-pointer shrink-0"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>

                          <div className="pt-2.5 border-t border-black/5 dark:border-white/5 flex flex-wrap items-center justify-between gap-2 text-xs">
                            <div className="flex items-center gap-3">
                              {feeText && (
                                <span className="font-black text-warning">{feeText}</span>
                              )}
                              <span className="text-text-muted font-bold flex items-center gap-1">
                                <GraduationCap size={13} className="text-warning" />
                                {college.coursesOffered.length} Courses
                              </span>
                            </div>

                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={(e) => onToggleCompare(college.id, e)}
                                className={cn(
                                  'px-2.5 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-wider border flex items-center gap-1 transition-all cursor-pointer',
                                  isCompared
                                    ? 'bg-warning text-crust border-warning'
                                    : 'bg-surface border-black/10 dark:border-white/10 text-text-main hover:border-warning/50'
                                )}
                              >
                                {isCompared ? <Check size={11} /> : <Scale size={11} className="text-warning" />}
                                <span>{isCompared ? 'Comparing' : 'Compare'}</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  onClose();
                                  onOpenCollegeDetails(college);
                                }}
                                className="px-2.5 py-1.5 rounded-lg bg-warning/15 text-warning hover:bg-warning hover:text-crust text-[11px] font-black uppercase tracking-wider flex items-center gap-0.5 transition-all cursor-pointer"
                              >
                                <span>Profile</span>
                                <ChevronRight size={12} />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            {/* Footer */}
            {savedColleges.length > 0 && (
              <div className="p-4 bg-crust border-t border-black/10 dark:border-white/10 flex items-center justify-between gap-3">
                {!confirmClear ? (
                  <button
                    type="button"
                    onClick={() => setConfirmClear(true)}
                    className="px-3.5 py-2.5 rounded-xl border border-red-500/30 text-red-500 hover:bg-red-500/10 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Trash2 size={14} />
                    <span>Clear All ({savedColleges.length})</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        onClearAllSaved();
                        setConfirmClear(false);
                      }}
                      className="px-3 py-2 rounded-xl bg-red-500 text-white text-xs font-black uppercase tracking-wider cursor-pointer"
                    >
                      Confirm Clear
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmClear(false)}
                      className="px-2.5 py-2 rounded-xl bg-surface text-text-muted text-xs font-bold cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                )}

                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl bg-surface border border-black/10 dark:border-white/10 text-text-main hover:border-warning text-xs font-black uppercase tracking-wider cursor-pointer"
                >
                  Done
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
