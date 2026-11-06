import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'motion/react';
import {
  Building2,
  MapPin,
  GraduationCap,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Globe,
  BookOpen,
  Award,
  Search,
} from 'lucide-react';
import { College } from '@/types/college';
import {
  fetchColleges,
  getCachedColleges,
  isEligibleFeaturedCampus,
  getFeaturedPriorityRank,
} from '@/services/collegeService';
import { cn } from '@/lib/utils';

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
    .filter(
      (w) =>
        w.length > 0 &&
        !['of', 'and', 'the', 'in', 'for', 'to', 'be'].includes(w.toLowerCase())
    );
  if (words.length === 0) return 'FC';
  if (words.length === 1) return words[0].slice(0, 3).toUpperCase();
  return words
    .slice(0, 3)
    .map((w) => w[0].toUpperCase())
    .join('');
}

export function LandingColleges3DSlider() {
  const navigate = useNavigate();
  const initialCached = useMemo(() => getCachedColleges() || [], []);
  const [colleges, setColleges] = useState<College[]>(initialCached);
  const [loading, setLoading] = useState<boolean>(initialCached.length === 0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [failedBanners, setFailedBanners] = useState<Record<string, boolean>>({});
  const [failedLogos, setFailedLogos] = useState<Record<string, boolean>>({});

  // 3D Mouse Tilt for Header & Active Card
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const headerRotateX = useTransform(mouseY, [-300, 300], [8, -8]);
  const headerRotateY = useTransform(mouseX, [-300, 300], [-10, 10]);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const list = await fetchColleges();
        if (mounted && Array.isArray(list)) {
          setColleges(list);
        }
      } catch (err) {
        console.error('Failed to load colleges for landing 3D slider:', err);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  // Curate showcase list: prioritize Featured/Government/NFSU/RRU + diverse cities across India
  const showcaseColleges = useMemo(() => {
    if (colleges.length === 0) return [];
    const sorted = [...colleges].sort((a, b) => {
      const rankA = getFeaturedPriorityRank(a);
      const rankB = getFeaturedPriorityRank(b);
      if (rankA !== rankB) return rankA - rankB;
      return (a.name || '').localeCompare(b.name || '');
    });
    return sorted.slice(0, 18);
  }, [colleges]);

  // Directory summary stats
  const stats = useMemo(() => {
    const totalColleges = colleges.length;
    const cities = new Set(colleges.map((c) => c.city?.trim()).filter(Boolean));
    const states = new Set(colleges.map((c) => c.state?.trim()).filter(Boolean));
    const totalCourses = colleges.reduce(
      (acc, c) => acc + (c.coursesOffered?.length || 0),
      0
    );
    return {
      totalColleges,
      totalCities: cities.size,
      totalStates: states.size,
      totalCourses,
    };
  }, [colleges]);

  // Auto-advance 3D slider
  useEffect(() => {
    if (isPaused || showcaseColleges.length <= 1) return;
    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % showcaseColleges.length);
    }, 3200);
    return () => window.clearInterval(timer);
  }, [isPaused, showcaseColleges.length]);

  const handlePrev = () => {
    if (showcaseColleges.length === 0) return;
    setActiveIndex(
      (prev) => (prev - 1 + showcaseColleges.length) % showcaseColleges.length
    );
  };

  const handleNext = () => {
    if (showcaseColleges.length === 0) return;
    setActiveIndex((prev) => (prev + 1) % showcaseColleges.length);
  };

  const handleSectionMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set(e.clientX - centerX);
    mouseY.set(e.clientY - centerY);
  };

  const handleSectionMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsPaused(false);
  };

  // Compute circular signed offset in [-floor(N/2), +floor(N/2)]
  const getSignedOffset = (index: number, current: number, total: number) => {
    if (total === 0) return 0;
    let diff = index - current;
    const half = Math.floor(total / 2);
    if (diff > half) diff -= total;
    if (diff < -half) diff += total;
    return diff;
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.65 }}
      onMouseMove={handleSectionMouseMove}
      onMouseLeave={handleSectionMouseLeave}
      className="py-20 sm:py-24 bg-crust relative overflow-hidden border-b border-black/10 dark:border-white/5 select-none"
    >
      {/* 3D Ambient Perspective Grid & Radial Glows */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none overflow-hidden"
      >
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[680px] h-[340px] bg-warning/10 rounded-full blur-[130px]" />
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-amber-500/5 rounded-full blur-[110px]" />
        <div className="absolute top-10 right-10 w-80 h-80 bg-warning/5 rounded-full blur-[110px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* 3D Animated Header: "Your City, Your College" */}
        <div className="text-center max-w-4xl mx-auto mb-10 sm:mb-14 perspective-1000">
          <motion.div
            style={{
              rotateX: headerRotateX,
              rotateY: headerRotateY,
              transformStyle: 'preserve-3d',
            }}
            className="relative inline-block px-4 sm:px-12 py-2"
          >
            {/* Soft Ambient Halo Behind Title */}
            <motion.div
              aria-hidden="true"
              animate={{
                opacity: [0.35, 0.7, 0.35],
                scale: [0.96, 1.04, 0.96],
              }}
              transition={{
                duration: 4.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="absolute -inset-x-6 -inset-y-3 rounded-3xl bg-gradient-to-r from-amber-500/15 via-warning/20 to-amber-500/15 blur-2xl pointer-events-none"
            />

            {/* Top 3D Badge */}
            <motion.div
              style={{ translateZ: 35 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-warning/15 border border-warning/30 text-warning text-[11px] font-mono uppercase tracking-widest font-black mb-4 shadow-lg"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-warning opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-warning" />
              </span>
              <span>India&apos;s Forensic Universities &amp; Colleges Directory</span>
            </motion.div>

            {/* Floating 3D Left & Right Academic Pillars */}
            <motion.div
              aria-hidden="true"
              style={{ translateZ: 55 }}
              animate={{
                y: [0, -6, 0],
                rotateZ: [-4, 4, -4],
                opacity: [0.65, 1, 0.65],
              }}
              transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut' }}
              className="hidden sm:flex items-center justify-center absolute -left-2 lg:-left-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/40 text-amber-400 shadow-[0_10px_25px_rgba(245,158,11,0.25)] pointer-events-none"
            >
              <MapPin size={18} />
            </motion.div>

            <motion.div
              aria-hidden="true"
              style={{ translateZ: 55 }}
              animate={{
                y: [0, 6, 0],
                rotateZ: [4, -4, 4],
                opacity: [0.65, 1, 0.65],
              }}
              transition={{
                duration: 3.8,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 0.5,
              }}
              className="hidden sm:flex items-center justify-center absolute -right-2 lg:-right-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-2xl bg-warning/15 border border-warning/40 text-warning shadow-[0_10px_25px_rgba(245,158,11,0.25)] pointer-events-none"
            >
              <GraduationCap size={19} />
            </motion.div>

            {/* Subtle glassmorphic light-sweep across title backdrop */}
            <div
              aria-hidden="true"
              className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none"
            >
              <div className="w-1/3 h-full bg-gradient-to-r from-transparent via-white/10 dark:via-white/[0.07] to-transparent animate-college-beam" />
            </div>

            {/* 3D Extruded Title: "Your City, Your College" */}
            <motion.h2
              style={{ translateZ: 60 }}
              className="relative text-4xl sm:text-6xl lg:text-7xl font-heading font-black text-text-main tracking-tight leading-[1.1] sm:leading-none drop-shadow-[0_12px_24px_rgba(0,0,0,0.35)]"
            >
              Your City,{' '}
              <span className="relative inline-block bg-gradient-to-r from-amber-400 via-warning to-amber-500 bg-clip-text text-transparent animate-college-title-gradient pb-1">
                Your College
                {/* Animated luminous 3D underline accent */}
                <motion.span
                  aria-hidden="true"
                  initial={{ scaleX: 0, opacity: 0 }}
                  whileInView={{ scaleX: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    delay: 0.25,
                    duration: 0.85,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="absolute left-0 right-0 -bottom-0.5 sm:-bottom-1.5 h-1 sm:h-1.5 rounded-full bg-gradient-to-r from-amber-400 via-warning to-amber-500 opacity-90 shadow-[0_0_20px_rgba(245,158,11,0.55)] origin-left pointer-events-none"
                />
              </span>
            </motion.h2>

            <motion.p
              style={{ translateZ: 30 }}
              className="text-sm sm:text-base text-text-muted mt-4 max-w-2xl mx-auto leading-relaxed"
            >
              Explore NFSU campuses, Rashtriya Raksha University, Government Institutes of Forensic Science, and top accredited universities across India with real-time course, fee, and admission insights.
            </motion.p>
          </motion.div>

          {/* Live Directory Metrics Strip */}
          {stats.totalColleges > 0 && (
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto">
              {[
                { label: 'Verified Colleges', value: `${stats.totalColleges}+`, icon: Building2 },
                { label: 'Forensic Courses', value: `${stats.totalCourses}+`, icon: GraduationCap },
                { label: 'States & Regions', value: `${stats.totalStates}+`, icon: MapPin },
                { label: 'Campus Cities', value: `${stats.totalCities}+`, icon: Globe },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.label}
                    className="px-3 py-2.5 rounded-xl bg-surface/70 border border-black/10 dark:border-white/10 backdrop-blur-md flex flex-col items-center justify-center shadow-sm"
                  >
                    <span className="text-xl sm:text-2xl font-black text-text-main tracking-tight">
                      {item.value}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted flex items-center gap-1 mt-0.5">
                      <Icon size={11} className="text-warning" />
                      {item.label}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 3D AUTO-SLIDER STAGE (Handles both Loading State & Live 3D Coverflow) */}
        {loading && showcaseColleges.length === 0 ? (
          <div className="relative h-[390px] sm:h-[430px] flex flex-col items-center justify-center perspective-1000">
            <div className="flex items-center justify-center gap-4 sm:gap-8 w-full max-w-5xl mx-auto overflow-hidden py-6">
              {[-1, 0, 1].map((slot) => (
                <motion.div
                  key={slot}
                  animate={{
                    rotateY: slot * -22,
                    scale: slot === 0 ? 1 : 0.85,
                    opacity: slot === 0 ? 1 : 0.45,
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    repeatType: 'reverse',
                  }}
                  style={{ transformStyle: 'preserve-3d' }}
                  className={cn(
                    'w-[290px] sm:w-[360px] h-[340px] rounded-2xl bg-surface border border-warning/30 p-5 flex flex-col justify-between shadow-2xl shrink-0',
                    slot !== 0 && 'hidden sm:flex'
                  )}
                >
                  <div className="h-36 rounded-xl bg-crust/70 animate-pulse border border-white/5" />
                  <div className="space-y-2.5">
                    <div className="h-4 w-24 rounded bg-warning/20 animate-pulse" />
                    <div className="h-6 w-3/4 rounded bg-crust/80 animate-pulse" />
                    <div className="h-4 w-1/2 rounded bg-crust/60 animate-pulse" />
                  </div>
                  <div className="h-10 w-full rounded-xl bg-warning/25 animate-pulse" />
                </motion.div>
              ))}
            </div>
            <div className="mt-3 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface border border-warning/30 text-xs font-mono text-warning">
              <span className="w-2 h-2 rounded-full bg-warning animate-ping" />
              <span>Loading Verified Colleges Auto-Slider...</span>
            </div>
          </div>
        ) : showcaseColleges.length > 0 ? (
          <div
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={() => setIsPaused(true)}
            onTouchEnd={() => setIsPaused(false)}
            className="relative"
          >
            {/* 3D Coverflow Stage */}
            <div
              className="relative h-[420px] sm:h-[450px] w-full flex items-center justify-center overflow-visible"
              style={{ perspective: '1400px' }}
            >
              {showcaseColleges.map((college, index) => {
                const offset = getSignedOffset(
                  index,
                  activeIndex,
                  showcaseColleges.length
                );
                const absOffset = Math.abs(offset);

                // Only render cards within [-2, 2] for crisp 60fps 3D performance
                if (absOffset > 2) return null;

                const isCenter = offset === 0;
                const bannerUrl =
                  !failedBanners[college.id] && college.bannerImage
                    ? college.bannerImage
                    : getFallbackBannerForCollege(college.id);
                const hasLogo =
                  Boolean(college.logo) && !failedLogos[college.id];
                const isFeaturedGov = isEligibleFeaturedCampus(college);

                // 3D spatial coordinates
                const translateX =
                  offset === 0
                    ? '0%'
                    : offset === -1
                      ? '-68%'
                      : offset === 1
                        ? '68%'
                        : offset === -2
                          ? '-122%'
                          : '122%';
                const translateZ =
                  offset === 0 ? 70 : absOffset === 1 ? -55 : -150;
                const rotateY =
                  offset === 0
                    ? 0
                    : offset === -1
                      ? 28
                      : offset === 1
                        ? -28
                        : offset === -2
                          ? 42
                          : -42;
                const scale =
                  offset === 0 ? 1 : absOffset === 1 ? 0.86 : 0.72;
                const opacity =
                  offset === 0 ? 1 : absOffset === 1 ? 0.72 : 0.35;
                const zIndex = 30 - absOffset * 10;

                return (
                  <motion.div
                    key={college.id}
                    initial={false}
                    animate={{
                      x: translateX,
                      z: translateZ,
                      rotateY,
                      scale,
                      opacity,
                    }}
                    transition={{
                      type: 'spring',
                      stiffness: 210,
                      damping: 26,
                      mass: 0.9,
                    }}
                    style={{
                      zIndex,
                      transformStyle: 'preserve-3d',
                    }}
                    onClick={() => {
                      if (isCenter) {
                        navigate(`/colleges/${college.id}`);
                      } else {
                        setActiveIndex(index);
                      }
                    }}
                    className={cn(
                      'absolute w-[295px] xs:w-[325px] sm:w-[390px] rounded-3xl bg-surface border transition-colors cursor-pointer overflow-hidden shadow-[0_25px_60px_-15px_rgba(0,0,0,0.65)]',
                      isCenter
                        ? 'border-warning/70 ring-2 ring-warning/25'
                        : 'border-black/15 dark:border-white/10 hover:border-warning/40'
                    )}
                  >
                    {/* Top Campus Banner with 3D Floating Badges */}
                    <div className="relative h-44 sm:h-48 w-full overflow-hidden bg-crust">
                      <img
                        src={bannerUrl}
                        alt={college.name}
                        referrerPolicy="no-referrer"
                        loading="lazy"
                        onError={() =>
                          setFailedBanners((prev) => ({
                            ...prev,
                            [college.id]: true,
                          }))
                        }
                        className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/35 to-black/35" />

                      {/* Top-Left Institution Type Badge */}
                      <div className="absolute top-3 left-3 flex items-center gap-1.5">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-black uppercase tracking-wider bg-crust/85 text-warning border border-warning/30 backdrop-blur-md shadow-sm">
                          {college.type || 'Institute'}
                        </span>
                        {isFeaturedGov && (
                          <span className="px-2 py-1 rounded-full text-[10px] font-mono font-black uppercase tracking-wider bg-amber-500/90 text-crust shadow-sm flex items-center gap-1">
                            <Award size={10} /> Govt / INI
                          </span>
                        )}
                      </div>

                      {/* Top-Right City Pill */}
                      <div className="absolute top-3 right-3">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-black/70 text-white backdrop-blur-md flex items-center gap-1 border border-white/15">
                          <MapPin size={10} className="text-warning shrink-0" />
                          <span className="truncate max-w-[110px]">
                            {college.city}
                          </span>
                        </span>
                      </div>

                      {/* 3D Floating College Logo / Crest */}
                      <div className="absolute bottom-3 left-4 flex items-end gap-3 right-4">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white dark:bg-crust border-2 border-warning/50 shadow-xl flex items-center justify-center overflow-hidden shrink-0">
                          {hasLogo ? (
                            <img
                              src={college.logo}
                              alt={college.shortName || college.name}
                              referrerPolicy="no-referrer"
                              onError={() =>
                                setFailedLogos((prev) => ({
                                  ...prev,
                                  [college.id]: true,
                                }))
                              }
                              className="w-full h-full object-contain p-1.5 bg-white"
                            />
                          ) : (
                            <span className="font-heading font-black text-xs sm:text-sm text-warning">
                              {getCollegeInitials(college)}
                            </span>
                          )}
                        </div>

                        <div className="min-w-0 flex-1 pb-0.5">
                          <p className="text-[10px] font-mono uppercase tracking-wider text-warning font-bold truncate">
                            {college.city}, {college.state}
                          </p>
                          <h3 className="text-sm sm:text-base font-heading font-black text-text-main leading-tight line-clamp-2 drop-shadow-xs">
                            {college.name}
                          </h3>
                        </div>
                      </div>
                    </div>

                    {/* Card Body: Courses & 3D Action Button */}
                    <div className="p-4 sm:p-5 space-y-3.5 bg-surface">
                      {/* Degree Programs Preview */}
                      <div className="flex flex-wrap items-center gap-1.5 min-h-[28px]">
                        {(college.coursesOffered || [])
                          .slice(0, 2)
                          .map((course, cIdx) => (
                            <span
                              key={cIdx}
                              className="px-2.5 py-1 rounded-lg bg-crust/70 border border-black/10 dark:border-white/10 text-[11px] font-semibold text-text-main truncate max-w-[165px]"
                            >
                              {course.name}
                            </span>
                          ))}
                        {(college.coursesOffered?.length || 0) > 2 && (
                          <span className="px-2 py-1 rounded-lg bg-warning/15 border border-warning/30 text-[10px] font-mono font-bold text-warning">
                            +{(college.coursesOffered?.length || 0) - 2} more
                          </span>
                        )}
                      </div>

                      {/* Accreditation / Fee Info */}
                      <div className="flex items-center justify-between text-xs text-text-muted border-t border-black/10 dark:border-white/10 pt-3">
                        <span className="flex items-center gap-1.5 font-medium truncate max-w-[60%]">
                          <BookOpen size={13} className="text-warning shrink-0" />
                          <span>
                            {college.coursesOffered?.length || 1}{' '}
                            {(college.coursesOffered?.length || 1) === 1
                              ? 'Program'
                              : 'Programs'}
                          </span>
                        </span>
                        <span className="font-mono text-[11px] font-bold text-text-main truncate">
                          {college.feesRange
                            ? college.feesRange.split('(')[0].trim()
                            : 'View Fees'}
                        </span>
                      </div>

                      {/* 3D Action Button */}
                      <Link
                        to={`/colleges/${college.id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="w-full py-2.5 px-4 rounded-xl bg-warning hover:bg-warning-dark text-crust font-heading font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_4px_0_0_#9a3412] hover:shadow-[0_2px_0_0_#9a3412] active:translate-y-[2px] transition-all"
                      >
                        <span>Explore Campus</span>
                        <ArrowRight size={14} />
                      </Link>
                    </div>
                  </motion.div>
                );
              })}

              {/* Left & Right 3D Navigation Controls */}
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous college"
                className="absolute left-1 sm:left-4 lg:left-8 z-40 w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-crust/90 hover:bg-warning text-text-main hover:text-crust border border-black/15 dark:border-white/15 hover:border-warning flex items-center justify-center shadow-xl transition-all cursor-pointer active:scale-95"
              >
                <ChevronLeft size={20} strokeWidth={2.5} />
              </button>

              <button
                type="button"
                onClick={handleNext}
                aria-label="Next college"
                className="absolute right-1 sm:right-4 lg:right-8 z-40 w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-crust/90 hover:bg-warning text-text-main hover:text-crust border border-black/15 dark:border-white/15 hover:border-warning flex items-center justify-center shadow-xl transition-all cursor-pointer active:scale-95"
              >
                <ChevronRight size={20} strokeWidth={2.5} />
              </button>
            </div>

            {/* Interactive Slide Progress Dots */}
            <div className="flex items-center justify-center gap-1.5 mt-2 mb-8 flex-wrap px-4">
              {showcaseColleges.map((col, idx) => (
                <button
                  key={col.id}
                  type="button"
                  onClick={() => setActiveIndex(idx)}
                  aria-label={`View ${col.name}`}
                  className={cn(
                    'h-2 rounded-full transition-all duration-300 cursor-pointer',
                    idx === activeIndex
                      ? 'w-7 bg-warning shadow-[0_0_10px_rgba(245,158,11,0.7)]'
                      : 'w-2 bg-text-muted/30 hover:bg-warning/50'
                  )}
                />
              ))}
            </div>

            {/* Continuous Auto-Sliding City & College Quick-Jump Ribbon */}
            <div className="relative overflow-hidden py-2 mask-fade-edges">
              <motion.div
                animate={{ x: ['0%', '-50%'] }}
                transition={{
                  duration: 36,
                  repeat: Infinity,
                  ease: 'linear',
                }}
                className="flex items-center gap-3 w-max"
              >
                {[...showcaseColleges, ...showcaseColleges].map((col, idx) => (
                  <Link
                    key={`${col.id}-ticker-${idx}`}
                    to={`/colleges/${col.id}`}
                    className="group flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-surface/90 hover:bg-warning/15 border border-black/10 dark:border-white/10 hover:border-warning/50 transition-all shrink-0 shadow-xs"
                  >
                    <span className="w-6 h-6 rounded-lg bg-warning/15 text-warning font-mono text-[10px] font-black flex items-center justify-center shrink-0">
                      {getCollegeInitials(col)}
                    </span>
                    <div className="text-left">
                      <p className="text-xs font-bold text-text-main group-hover:text-warning transition-colors truncate max-w-[180px]">
                        {col.shortName || col.name}
                      </p>
                      <p className="text-[10px] font-mono text-text-muted flex items-center gap-1">
                        <MapPin size={9} className="text-warning" />
                        <span>
                          {col.city}, {col.state}
                        </span>
                      </p>
                    </div>
                  </Link>
                ))}
              </motion.div>
            </div>
          </div>
        ) : null}

        {/* Bottom 3D Button to Open Full /colleges Directory */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/colleges"
            className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-warning hover:bg-warning-dark text-crust font-heading font-black uppercase tracking-wider rounded-2xl text-xs sm:text-sm shadow-[0_6px_0_0_#9a3412] hover:shadow-[0_4px_0_0_#9a3412] active:shadow-[0_0px_0_0_#9a3412] active:translate-y-[6px] border border-amber-500/20 transition-all cursor-pointer"
          >
            <GraduationCap size={18} className="text-crust" />
            <span>Explore All Colleges in Your City</span>
            <ArrowRight
              size={17}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>
        </div>
      </div>
    </motion.section>
  );
}
