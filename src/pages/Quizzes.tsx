import React, { useState, useEffect } from 'react';
import { Quiz, QuizAttempt } from '@/types/quiz';
import { fetchQuizzes, enrollInQuiz, fetchUserQuizAttempts, isWeeklyChallengeExpired, isPaidQuiz } from '@/services/quizService';
import { QuizCard } from '@/components/quiz/QuizCard';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Trophy, HelpCircle, CheckCircle2, Target, Award, Sparkles, BookOpen, Zap
} from 'lucide-react';
import { SEO } from '@/components/layout/SEO';

import { useNavigate } from 'react-router-dom';

export default function Quizzes() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [userAttemptsMap, setUserAttemptsMap] = useState<Record<string, QuizAttempt>>({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'weekly' | 'practice'>('weekly');
  const [pricingFilter, setPricingFilter] = useState<'all' | 'free' | 'paid'>('all');
  const [enrollingQuizId, setEnrollingQuizId] = useState<string | null>(null);
  const [enrollSuccessMsg, setEnrollSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    loadQuizzes();
  }, [user]);

  const loadQuizzes = async () => {
    setLoading(true);
    const data = await fetchQuizzes();
    setQuizzes(data);

    if (user?.uid) {
      try {
        const attempts = await fetchUserQuizAttempts(user.uid);
        const map: Record<string, QuizAttempt> = {};
        attempts.forEach(att => {
          // keep the highest score or most recent attempt for each quiz
          if (!map[att.quizId] || att.score > map[att.quizId].score) {
            map[att.quizId] = att;
          }
        });
        setUserAttemptsMap(map);
      } catch (err) {
        console.warn("Error loading user quiz attempts:", err);
      }
    } else {
      setUserAttemptsMap({});
    }

    setLoading(false);
  };

  const handleEnroll = async (quizId: string) => {
    if (!user) {
      navigate('/login');
      return;
    }
    const targetQuiz = quizzes.find(q => q.id === quizId);
    if (isPaidQuiz(targetQuiz)) {
      return;
    }
    setEnrollingQuizId(quizId);
    const ok = await enrollInQuiz(quizId, user.uid);
    if (ok) {
      setEnrollSuccessMsg('Successfully enrolled in Weekly Quiz Challenge!');
      setTimeout(() => setEnrollSuccessMsg(null), 4000);
      loadQuizzes();
    }
    setEnrollingQuizId(null);
  };

  // Active / Upcoming Weekly Challenges (not yet expired & published)
  const activeWeeklyChallenges = quizzes.filter(q => q.status !== 'draft' && q.isWeeklyChallenge && !isWeeklyChallengeExpired(q));

  // Practice Quizzes includes standard practice quizzes + concluded weekly challenges whose date and time has passed
  const practiceQuizzes = quizzes.filter(q => q.status !== 'draft' && (!q.isWeeklyChallenge || isWeeklyChallengeExpired(q)));

  useEffect(() => {
    if (!loading && activeWeeklyChallenges.length === 0 && practiceQuizzes.length > 0) {
      setActiveTab('practice');
    }
  }, [loading, activeWeeklyChallenges.length, practiceQuizzes.length]);

  const baseQuizzes = activeTab === 'weekly' ? activeWeeklyChallenges : practiceQuizzes;
  const filteredQuizzes = baseQuizzes.filter(q => {
    if (pricingFilter === 'free') return !isPaidQuiz(q);
    if (pricingFilter === 'paid') return isPaidQuiz(q);
    return true;
  });

  return (
    <div className="min-h-screen bg-background text-text-main py-12 px-4 sm:px-6 lg:px-8">
      <SEO 
        title="Forensic Quizzes & Weekly Challenges"
        description="Test your forensic science knowledge through interactive quizzes, challenges, and practical assessments. Learn, compete, and sharpen your investigative skills with ForenClue."
        image="https://blogger.googleusercontent.com/img/a/AVvXsEg_OeYXV0qnZe42fjD2ty2vBNDGqhWPnOjQBOiWFbkDcCaUa0Pl5sJyixMvmxEhAKoLMU9A4A2bjvxrpEuGG_jKX7q2su81OGr9eSt3DUWNwQVufTdGQI_NSKBcZduRx-7jyn3dMmQVb4o6Qom_9Ul2qen9YS8c-h2W5PTda-U8x6JsAasJG_3lHFitvX0"
      />

      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Page Header Banner */}
        <div className="relative rounded-3xl bg-gradient-to-r from-surface via-surface-dark to-black border border-white/10 p-8 sm:p-12 overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-black uppercase tracking-widest">
              <Trophy size={14} className="text-amber-400" /> ForenClue Quiz Arena
            </div>

            <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-text-main leading-tight">
              Weekly Quiz <span className="text-amber-400">Challenges</span> & Practice Tests
            </h1>

            <p className="text-text-muted text-base sm:text-lg leading-relaxed">
              Enrolled participants compete live during active challenge dates. Once a weekly challenge concludes, it is automatically preserved in <strong className="text-amber-400">Practice Quizzes</strong> for endless future practice!
            </p>

            {enrollSuccessMsg && (
              <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold text-sm flex items-center gap-2 animate-fadeIn">
                <CheckCircle2 size={18} /> {enrollSuccessMsg}
              </div>
            )}
          </div>
        </div>

        {/* Navigation Tabs and Access Filters */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-black/10 dark:border-white/10 pb-6">
          <div className="flex items-center gap-2 bg-surface dark:bg-black/40 p-1.5 rounded-2xl border border-black/10 dark:border-white/10 shadow-sm flex-wrap">
            <button
              onClick={() => setActiveTab('weekly')}
              className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'weekly' 
                  ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20' 
                  : 'text-text-muted hover:text-text-main'
              }`}
            >
              <Trophy size={15} /> Active Challenges ({activeWeeklyChallenges.length})
            </button>

            <button
              onClick={() => setActiveTab('practice')}
              className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'practice' 
                  ? 'bg-warning text-crust shadow-lg shadow-warning/30 font-black' 
                  : 'text-text-muted hover:text-text-main'
              }`}
            >
              <Target size={15} /> Practice Quizzes ({practiceQuizzes.length})
            </button>
          </div>

          {/* Pricing Access Filter (All / Free / Paid) */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center bg-surface dark:bg-black/40 p-1.5 rounded-2xl border border-black/10 dark:border-white/10 shadow-sm text-xs font-mono">
              <button
                onClick={() => setPricingFilter('all')}
                className={`px-3.5 py-1.5 rounded-xl font-bold uppercase transition-all cursor-pointer ${
                  pricingFilter === 'all'
                    ? 'bg-base text-text-main shadow-sm border border-black/10 dark:border-white/10'
                    : 'text-text-muted hover:text-text-main'
                }`}
              >
                All ({baseQuizzes.length})
              </button>

              <button
                onClick={() => setPricingFilter('free')}
                className={`px-3.5 py-1.5 rounded-xl font-bold uppercase transition-all flex items-center gap-1.5 cursor-pointer ${
                  pricingFilter === 'free'
                    ? 'bg-emerald-500/20 text-emerald-400 shadow-sm border border-emerald-500/30'
                    : 'text-text-muted hover:text-emerald-400'
                }`}
              >
                <Zap size={13} /> 100% Free ({baseQuizzes.filter(q => !isPaidQuiz(q)).length})
              </button>

              <button
                onClick={() => setPricingFilter('paid')}
                className={`px-3.5 py-1.5 rounded-xl font-bold uppercase transition-all flex items-center gap-1.5 cursor-pointer ${
                  pricingFilter === 'paid'
                    ? 'bg-amber-500/20 text-amber-400 shadow-sm border border-amber-500/30'
                    : 'text-text-muted hover:text-amber-400'
                }`}
              >
                <Trophy size={13} /> Paid Challenges ({baseQuizzes.filter(q => isPaidQuiz(q)).length})
              </button>
            </div>

            {activeTab === 'practice' && (
              <div className="hidden xl:flex items-center gap-2 text-xs font-mono text-amber-400/90 bg-amber-500/10 px-3.5 py-2 rounded-xl border border-amber-500/20">
                <BookOpen size={14} />
                <span>Concluded weekly challenges saved for self-study</span>
              </div>
            )}
          </div>
        </div>

        {/* Quizzes List Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(n => (
              <div key={n} className="bg-surface/40 h-80 rounded-2xl animate-pulse border border-white/5" />
            ))}
          </div>
        ) : filteredQuizzes.length === 0 ? (
          <div className="bg-surface/30 rounded-2xl border border-white/10 p-12 text-center text-text-muted space-y-3">
            <HelpCircle size={40} className="mx-auto text-text-muted opacity-50" />
            <p className="text-lg font-bold">No quizzes available in this section.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredQuizzes.map(quiz => (
              <QuizCard 
                key={quiz.id} 
                quiz={quiz} 
                onEnroll={handleEnroll}
                isEnrolling={enrollingQuizId === quiz.id}
                userAttempt={userAttemptsMap[quiz.id]}
              />
            ))}
          </div>
        )}

        {/* Written Educational Overview & Assessment Methodology */}
        <article className="mt-16 pt-12 border-t border-black/10 dark:border-white/10 space-y-8">
          <div className="space-y-3 max-w-4xl">
            <span className="text-xs font-mono uppercase tracking-widest text-warning font-bold">
              Competency-Based Forensic Science Assessment Framework
            </span>
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-text-main">
              Educational Overview, Syllabus Alignment &amp; Key Learning Objectives
            </h2>
            <p className="text-sm sm:text-base text-text-muted leading-relaxed">
              ForenClue’s Weekly Quiz Challenges and Practice Assessments are structured around the official syllabus of the University Grants Commission National Eligibility Test (UGC-NET Subject Code 82: Forensic Science), the National Forensic Admission Test (NFAT), CUET-PG Forensic Science, and the Forensic Aptitude and Caliber Test (FACT) conducted by the Ministry of Home Affairs. Each assessment tests analytical reasoning, laboratory protocol selection, and statutory legal admissibility rather than rote memorization.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <section className="rounded-2xl border border-black/10 dark:border-white/10 bg-surface p-6 space-y-2.5">
              <h3 className="text-lg font-heading font-bold text-text-main">
                Core Syllabus Units (I–IV)
              </h3>
              <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
                Covers the organizational structure of FSLs/CFSLs in India, crime scene documentation, Bharatiya Sakshya Adhiniyam (BSA) 2023 evidentiary sections, optical and electron microscopy, UV-Vis/FTIR/AAS spectroscopy, and chromatographic separations (TLC, GC-MS, HPLC).
              </p>
            </section>

            <section className="rounded-2xl border border-black/10 dark:border-white/10 bg-surface p-6 space-y-2.5">
              <h3 className="text-lg font-heading font-bold text-text-main">
                Biological &amp; Chemical Units (V–VII)
              </h3>
              <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
                Evaluates catalytic and crystal blood identification, seminal/salivary body fluid typing, autosomal and Y-STR DNA profiling, postmortem redistribution in forensic toxicology, extraction of acidic/basic poisons, and alcohol headspace analysis.
              </p>
            </section>

            <section className="rounded-2xl border border-black/10 dark:border-white/10 bg-surface p-6 space-y-2.5">
              <h3 className="text-lg font-heading font-bold text-text-main">
                Physical &amp; Digital Units (VIII–X)
              </h3>
              <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
                Tests internal/external/terminal ballistics, GSR primer element analysis (Pb, Ba, Sb), glass refractive index (Becke line method), dactyloscopy ridge minutiae, VSC/ESDA questioned document examination, forensic odontology/anthropology, and cyber forensics.
              </p>
            </section>
          </div>

          <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-surface p-6 space-y-3">
            <h3 className="text-base font-heading font-bold text-text-main">
              Key Learning Objectives of ForenClue Assessments
            </h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs sm:text-sm text-text-muted">
              <li className="flex items-start gap-2">
                <CheckCircle2 size={15} className="text-warning shrink-0 mt-0.5" />
                <span>Apply quantitative forensic equations (Beer-Lambert Law, Rf calculation, Medullary Index, and bloodstain angle of impact) under timed conditions.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={15} className="text-warning shrink-0 mt-0.5" />
                <span>Distinguish class characteristics from individualizing characteristics across toolmarks, footwear impressions, and firearms striations.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={15} className="text-warning shrink-0 mt-0.5" />
                <span>Review detailed post-submission explanations and rationale for every multiple-choice item to reinforce conceptual mastery.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={15} className="text-warning shrink-0 mt-0.5" />
                <span>Prepare systematically for university semester examinations, CUET-PG, NFAT, and national forensic recruitment assessments.</span>
              </li>
            </ul>
          </div>
        </article>

      </div>
    </div>
  );
}
