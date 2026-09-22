import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { Quiz, QuizQuestion, QuizAttempt, QuizRegistration } from '@/types/quiz';
import { fetchQuizById, submitQuizAttempt, enrollInQuiz, getUserQuizRegistration, isPaidQuiz } from '@/services/quizService';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Clock, CheckCircle2, AlertTriangle, ArrowRight, ArrowLeft, 
  Trophy, ShieldCheck, HelpCircle, Lock, RefreshCw, Sparkles,
  Bookmark, EyeOff, LayoutGrid, Keyboard, RotateCcw, Share2, Filter,
  X, Check, Flame, Award, Zap, Calendar, Maximize2, ZoomIn, Lightbulb,
  CreditCard, AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { SEO } from '@/components/layout/SEO';
import { SEOManager } from '@/components/layout/SEOManager';
import { ConfettiAnimation } from '@/components/quiz/ConfettiAnimation';
import { PaidChallengeRegistrationModal } from '@/components/quiz/PaidChallengeRegistrationModal';
import { ResilientImage } from '@/lib/localFileStore';

export default function QuizPlayer() {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAdmin, isQuizOnlyAdmin } = useAuth();

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  
  // Power User Features
  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<string, boolean>>({});
  const [eliminatedOptions, setEliminatedOptions] = useState<Record<string, number[]>>({}); // questionId -> optionIndices
  const [showHint, setShowHint] = useState<Record<string, boolean>>({});
  const [showQuestionsGrid, setShowQuestionsGrid] = useState(false);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('right');
  const [reviewFilter, setReviewFilter] = useState<'all' | 'incorrect' | 'flagged'>('all');
  const [fullscreenImage, setFullscreenImage] = useState<{ src: string; caption?: string } | null>(null);

  // Timer & Session state
  const [timeRemainingSec, setTimeRemainingSec] = useState<number>(0);
  const [quizStartedAt, setQuizStartedAt] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Anti-cheat & Exit Warning state
  const [tabSwitchWarnings, setTabSwitchWarnings] = useState(0);
  const [showCheatWarningModal, setShowCheatWarningModal] = useState(false);
  const [showExitWarningModal, setShowExitWarningModal] = useState(false);
  const [showClipboardNotice, setShowClipboardNotice] = useState(false);

  // Paid Challenge Registration State
  const [userRegistration, setUserRegistration] = useState<QuizRegistration | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Result state
  const [finalScore, setFinalScore] = useState(0);
  const [timeTakenSec, setTimeTakenSec] = useState(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (quizId) {
      loadQuiz(quizId);
    }
  }, [quizId]);

  const loadQuiz = async (id: string) => {
    setLoading(true);
    const data = await fetchQuizById(id);
    setQuiz(data);
    if (data) {
      let currentReg: QuizRegistration | null = null;
      const isPaid = isPaidQuiz(data);
      if (isPaid && user?.uid) {
        try {
          currentReg = await getUserQuizRegistration(data.id, user.uid);
          setUserRegistration(currentReg);
        } catch (e) {
          console.warn("Could not check registration", e);
        }
      } else {
        setUserRegistration(null);
      }

      const isUserEnrolled = Boolean(
        user && (isPaid ? currentReg?.status === 'approved' : data.enrolledUserIds?.includes(user.uid))
      );

      const totalSec = (data.durationMinutes || 10) * 60;
      setTimeRemainingSec(totalSec);

      // Only start quiz timer if not blocked by payment enrollment or upcoming schedule
      const isUpcoming = Boolean(
        data.isWeeklyChallenge &&
        data.scheduledStartTime &&
        new Date().getTime() < new Date(data.scheduledStartTime).getTime()
      );

      if ((!isPaid || isUserEnrolled) && !isUpcoming) {
        setQuizStartedAt(Date.now());
      }
    }
    setLoading(false);
  };

  // Timer Countdown Effect
  useEffect(() => {
    if (!quiz || isSubmitted || !quizStartedAt) return;

    timerRef.current = setInterval(() => {
      setTimeRemainingSec((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [quiz, isSubmitted, quizStartedAt]);

  // Anti-Cheat: Tab/Window switching detection & Clipboard protection (No copy, cut, paste)
  useEffect(() => {
    if (!quiz || isSubmitted || !quizStartedAt || !user) return;
    
    if (quiz.isWeeklyChallenge && quiz.scheduledStartTime) {
      const now = new Date().getTime();
      const start = new Date(quiz.scheduledStartTime).getTime();
      if (now < start) return;
    }

    const shouldEnforceTabSwitch = quiz.enableTabSwitchDetection ?? (quiz.isWeeklyChallenge || isPaidQuiz(quiz) || false);

    const handleViolation = () => {
      if (!shouldEnforceTabSwitch) return;
      setTabSwitchWarnings(prev => {
        const newWarnings = prev + 1;
        if (newWarnings >= 3) {
          handleAutoSubmit();
        } else {
          setShowCheatWarningModal(true);
        }
        return newWarnings;
      });
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        handleViolation();
      }
    };

    const handleWindowBlur = () => {
      handleViolation();
    };

    // Block Copy, Cut, Paste, Right Click, and Keyboard Shortcuts
    const handleClipboardEvent = (e: Event) => {
      e.preventDefault();
      setShowClipboardNotice(true);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      const isCmdOrCtrl = e.metaKey || e.ctrlKey;
      const key = e.key.toLowerCase();

      // Block Ctrl+C, Ctrl+X, Ctrl+V, Ctrl+A, Ctrl+U, Ctrl+P, F12
      if (
        (isCmdOrCtrl && ['c', 'x', 'v', 'a', 'u', 'p'].includes(key)) ||
        key === 'f12'
      ) {
        e.preventDefault();
        e.stopPropagation();
        setShowClipboardNotice(true);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleWindowBlur);
    document.addEventListener("copy", handleClipboardEvent);
    document.addEventListener("cut", handleClipboardEvent);
    document.addEventListener("paste", handleClipboardEvent);
    document.addEventListener("contextmenu", handleClipboardEvent);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleWindowBlur);
      document.removeEventListener("copy", handleClipboardEvent);
      document.removeEventListener("cut", handleClipboardEvent);
      document.removeEventListener("paste", handleClipboardEvent);
      document.removeEventListener("contextmenu", handleClipboardEvent);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [quiz, isSubmitted, quizStartedAt, user]);

  // Auto-hide clipboard notification notice after 3 seconds
  useEffect(() => {
    if (showClipboardNotice) {
      const timer = setTimeout(() => {
        setShowClipboardNotice(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showClipboardNotice]);

  // Back Button Navigation & Unload Guard
  useEffect(() => {
    if (!quiz || isSubmitted || !quizStartedAt || !user) return;

    // Push state so back button triggers popstate
    window.history.pushState({ quizActive: true }, '', window.location.href);

    const handlePopState = (e: PopStateEvent) => {
      // Re-push state to prevent leaving immediately
      window.history.pushState({ quizActive: true }, '', window.location.href);
      setShowExitWarningModal(true);
    };

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
      return '';
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [quiz, isSubmitted, quizStartedAt, user]);

  const handleSelectOption = (questionId: string, optionIdx: number) => {
    if (isSubmitted) return;
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: optionIdx
    }));
  };

  const toggleFlagQuestion = (questionId: string) => {
    setFlaggedQuestions(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  };

  const toggleEliminateOption = (questionId: string, optionIdx: number, e: React.MouseEvent) => {
    e.stopPropagation(); // prevent selecting option
    if (isSubmitted) return;
    setEliminatedOptions(prev => {
      const currentList = prev[questionId] || [];
      const exists = currentList.includes(optionIdx);
      const updated = exists 
        ? currentList.filter(i => i !== optionIdx)
        : [...currentList, optionIdx];
      return { ...prev, [questionId]: updated };
    });
  };

  const handle5050Lifeline = (q: QuizQuestion) => {
    if (isSubmitted) return;
    const currentElim = eliminatedOptions[q.id] || [];
    if (currentElim.length >= 2) {
      // Toggle off / restore all
      setEliminatedOptions(prev => ({ ...prev, [q.id]: [] }));
      return;
    }
    // Eliminate 2 wrong choices
    const wrongIndices = q.options
      .map((_, idx) => idx)
      .filter(idx => idx !== q.correctAnswerIndex);
    const toEliminate = wrongIndices.slice(0, 2);
    setEliminatedOptions(prev => ({ ...prev, [q.id]: toEliminate }));
  };

  const toggleHint = (questionId: string) => {
    setShowHint(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIdx > 0) {
      setSlideDirection('left');
      setCurrentQuestionIdx(prev => prev - 1);
    }
  };

  const handleNextQuestion = () => {
    if (quiz && currentQuestionIdx < quiz.questions.length - 1) {
      setSlideDirection('right');
      setCurrentQuestionIdx(prev => prev + 1);
    }
  };

  const calculateResults = () => {
    if (!quiz) return { score: 0, timeTaken: 0, correctCount: 0 };
    let score = 0;
    let correctCount = 0;

    quiz.questions.forEach((q) => {
      const selected = userAnswers[q.id];
      if (selected !== undefined && selected === q.correctAnswerIndex) {
        score += q.points || 10;
        correctCount += 1;
      }
    });

    const now = Date.now();
    const elapsedSec = quizStartedAt ? Math.round((now - quizStartedAt) / 1000) : 0;
    return { score, timeTaken: elapsedSec, correctCount };
  };

  const handleAutoSubmit = async () => {
    await handleSubmitQuiz();
  };

  const handleSubmitQuiz = async () => {
    if (!quiz || !user || isSubmitted) return;
    setSubmitting(true);
    setShowConfirmModal(false);

    const { score, timeTaken } = calculateResults();
    setFinalScore(score);
    setTimeTakenSec(timeTaken);

    const attemptPayload: QuizAttempt = {
      quizId: quiz.id,
      userId: user.uid,
      userName: user.displayName || user.email?.split('@')[0] || 'Investigator',
      userEmail: user.email || '',
      userPhoto: user.photoURL || '',
      score,
      totalPoints: quiz.totalPoints || 100,
      timeTakenSeconds: timeTaken,
      completedAt: new Date().toISOString(),
      answers: userAnswers
    };

    try {
      await submitQuizAttempt(attemptPayload);
    } catch (err) {
      console.error("Attempt submission error:", err);
    }

    setIsSubmitted(true);
    setSubmitting(false);
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-text-muted">
        <RefreshCw size={32} className="animate-spin text-warning" />
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="min-h-screen bg-background text-text-main p-8 text-center space-y-4">
        <h2 className="text-2xl font-bold">Quiz Not Found</h2>
        <Link to="/quizzes" className="text-warning underline">Return to Quizzes</Link>
      </div>
    );
  }

  // Non-admin draft check
  if (quiz.status === 'draft' && !isAdmin && !isQuizOnlyAdmin) {
    return (
      <div className="min-h-screen bg-background text-text-main flex items-center justify-center p-4 sm:p-6">
        <div className="max-w-md w-full bg-surface border border-amber-500/30 rounded-3xl p-8 text-center space-y-5 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto">
            <Clock size={32} />
          </div>
          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/30">
              Draft / Review In Progress
            </span>
            <h2 className="text-xl font-heading font-black text-white">{quiz.title}</h2>
            <p className="text-xs text-text-muted leading-relaxed">
              This quiz is currently in preparation by the admin team and has not yet been published. Please check back soon or explore other challenges.
            </p>
          </div>
          <div className="pt-2">
            <Link
              to="/quizzes"
              className="inline-flex items-center justify-center px-6 py-3 bg-warning text-crust font-black text-xs uppercase tracking-wider rounded-xl transition hover:bg-warning/90"
            >
              Explore Published Quizzes
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const formattedDate = quiz.scheduledStartTime
    ? (() => {
        try {
          return new Date(quiz.scheduledStartTime).toLocaleString('en-IN', {
            timeZone: 'Asia/Kolkata',
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
          }) + ' IST';
        } catch (e) {
          return new Date(quiz.scheduledStartTime).toLocaleString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          });
        }
      })()
    : quiz.createdAt
    ? new Date(quiz.createdAt).toLocaleDateString('en-IN', {
        timeZone: 'Asia/Kolkata',
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : new Date().toLocaleDateString('en-IN', {
        timeZone: 'Asia/Kolkata',
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });

  // Auth Guard
  if (!user) {
    return (
      <div className="min-h-screen bg-background text-text-main flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <SEOManager 
          collectionName="quizzes"
          docId={quizId}
          initialData={quiz}
          fallbackTitle={`Enroll in ${quiz?.title || 'Quiz'} | ForenClue`}
          fallbackDescription={`Sign in or create an account to enroll in ${quiz?.title || 'this quiz'} and attempt the quiz.`}
          fallbackImage={quiz?.thumbnail}
        />

        <div className="max-w-lg w-full bg-surface border border-amber-500/30 rounded-3xl p-6 sm:p-8 text-center space-y-6 shadow-2xl relative z-10">
          {/* Badge Header */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-mono font-bold uppercase tracking-widest mx-auto">
            <Trophy size={14} className="animate-pulse" />
            <span>Quiz Session Enrollment</span>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-heading font-black text-white uppercase tracking-tight leading-tight">
              {quiz.title}
            </h1>
            {quiz.description && (
              <p className="text-xs sm:text-sm text-text-muted line-clamp-2 leading-relaxed">
                {quiz.description}
              </p>
            )}
          </div>

          {/* Session Date & Quiz Info Box */}
          <div className="bg-black/40 border border-white/10 rounded-2xl p-4 space-y-3 text-left">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0">
                <Calendar size={20} />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-text-muted block">
                  Scheduled Quiz Session Date
                </span>
                <span className="text-xs sm:text-sm font-bold text-amber-300">
                  {formattedDate}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/10 text-center">
              <div className="p-2 rounded-xl bg-surface/60 border border-white/5">
                <span className="block text-[10px] font-mono text-text-muted">DURATION</span>
                <span className="text-xs font-bold text-white">{quiz.durationMinutes || 15} Mins</span>
              </div>
              <div className="p-2 rounded-xl bg-surface/60 border border-white/5">
                <span className="block text-[10px] font-mono text-text-muted">POINTS</span>
                <span className="text-xs font-bold text-amber-400">{quiz.totalPoints || 100} PTS</span>
              </div>
              <div className="p-2 rounded-xl bg-surface/60 border border-white/5">
                <span className="block text-[10px] font-mono text-text-muted">CATEGORY</span>
                <span className="text-xs font-bold text-white truncate block">{quiz.category || 'General'}</span>
              </div>
            </div>
          </div>

          {/* Enrollment Message */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-xs sm:text-sm leading-relaxed text-center font-medium">
            <p>
              Please <strong>sign in</strong> or <strong>create an account</strong> to enroll for this quiz session, attempt the challenge, and record your score on the live leaderboard.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-1">
            <button
              onClick={() => navigate('/login', { 
                state: { 
                  from: location, 
                  quizTitle: quiz.title,
                  scheduledStartTime: quiz.scheduledStartTime,
                  createdAt: quiz.createdAt,
                  category: quiz.category,
                  durationMinutes: quiz.durationMinutes,
                  isWeeklyChallenge: quiz.isWeeklyChallenge
                } 
              })}
              className="w-full bg-amber-500 hover:bg-amber-400 text-black font-black text-sm uppercase tracking-wider py-3.5 rounded-xl transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Lock size={16} />
              <span>Sign In / Login to Enroll & Attempt</span>
            </button>

            <Link
              to="/quizzes"
              className="block text-xs font-bold text-text-muted hover:text-amber-400 transition-colors text-center pt-2"
            >
              ← Explore All Available Quizzes
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = quiz.questions[currentQuestionIdx];
  const isPaid = isPaidQuiz(quiz);
  const isEnrolled = Boolean(
    user && (isPaid ? userRegistration?.status === 'approved' : quiz.enrolledUserIds?.includes(user.uid))
  );
  const answeredCount = Object.keys(userAnswers).length;
  const flaggedCount = Object.values(flaggedQuestions).filter(Boolean).length;

  // 1. Paid Challenge Registration Guard (Requires Admin-Approved UTR)
  if (isPaid && !isEnrolled) {
    const totalPrize = (quiz.prizes?.first ?? 300) + (quiz.prizes?.second ?? 200) + (quiz.prizes?.third ?? 100);
    return (
      <div className="min-h-screen bg-background text-text-main flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <SEOManager 
          collectionName="quizzes"
          docId={quizId}
          initialData={quiz}
          fallbackTitle={`Register for ${quiz?.title || 'Paid Challenge'} | ForenClue`}
          fallbackDescription={`Submit your payment registration for ${quiz?.title || 'this challenge'}.`}
          fallbackImage={quiz?.thumbnail}
        />

        <div className="max-w-lg w-full bg-surface border border-amber-500/30 rounded-3xl p-6 sm:p-8 text-center space-y-6 shadow-2xl relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/10">
            <Trophy size={32} className="fill-amber-400" />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-black uppercase tracking-wider">
              Paid Challenge • Registration Required
            </div>
            <h2 className="text-2xl font-black font-heading tracking-tight text-white uppercase">
              {quiz.title}
            </h2>
            <p className="text-text-muted text-xs leading-relaxed">
              This challenge requires advance registration, UPI fee payment, and admin verification of your 12-digit UTR before access is granted.
            </p>
          </div>

          {/* Cash Prizes Summary */}
          <div className="bg-black/40 border border-amber-500/20 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-text-muted uppercase font-mono">Entry Fee</span>
              <span className="text-warning font-black font-mono text-sm">₹{quiz.price || 49}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-text-muted uppercase font-mono">Cash Prize Pool</span>
              <span className="text-amber-400 font-black font-mono text-sm">₹{totalPrize}</span>
            </div>
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/10 text-center font-mono">
              <div className="bg-surface/80 p-2 rounded-xl">
                <span className="text-[10px] text-amber-400 block font-bold">1st Rank</span>
                <span className="text-xs font-black text-white">₹{quiz.prizes?.first ?? 300}</span>
              </div>
              <div className="bg-surface/80 p-2 rounded-xl">
                <span className="text-[10px] text-amber-400 block font-bold">2nd Rank</span>
                <span className="text-xs font-black text-white">₹{quiz.prizes?.second ?? 200}</span>
              </div>
              <div className="bg-surface/80 p-2 rounded-xl">
                <span className="text-[10px] text-amber-400 block font-bold">3rd Rank</span>
                <span className="text-xs font-black text-white">₹{quiz.prizes?.third ?? 100}</span>
              </div>
            </div>
          </div>

          {/* Status Display */}
          {userRegistration?.status === 'pending' ? (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs space-y-1">
              <p className="font-bold flex items-center justify-center gap-1.5">
                <Clock size={16} className="animate-pulse" /> Payment Verification Pending
              </p>
              <p className="text-text-muted text-[11px]">
                Submitted UTR: <span className="font-mono font-bold text-text-main">{userRegistration.utrNumber}</span>. Our admin team will verify it with bank statements. Your challenge will unlock automatically upon approval.
              </p>
            </div>
          ) : userRegistration?.status === 'rejected' ? (
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs space-y-1">
              <p className="font-bold flex items-center justify-center gap-1.5">
                <AlertCircle size={16} /> Verification Failed
              </p>
              <p className="text-text-muted text-[11px]">
                {userRegistration.rejectReason || 'UTR not verified in bank records. Please re-submit your correct UTR.'}
              </p>
            </div>
          ) : null}

          <div className="space-y-3">
            <button
              onClick={() => setShowPaymentModal(true)}
              className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:opacity-90 text-black font-black text-sm uppercase tracking-wider py-3.5 rounded-xl transition-all cursor-pointer shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
            >
              <CreditCard size={16} />
              {userRegistration?.status === 'pending'
                ? 'Check UTR Status / Update'
                : userRegistration?.status === 'rejected'
                ? 'Re-submit 12-Digit UTR'
                : `Register & Pay ₹${quiz.price || 49}`}
            </button>

            <Link to="/quizzes" className="block text-xs font-bold text-text-muted hover:text-amber-400 transition-colors">
              ← Back to Quizzes
            </Link>
          </div>

          <PaidChallengeRegistrationModal
            quiz={quiz}
            isOpen={showPaymentModal}
            onClose={() => setShowPaymentModal(false)}
            onRegistrationSubmitted={() => {
              if (quizId && user?.uid) {
                loadQuiz(quizId);
              }
            }}
          />
        </div>
      </div>
    );
  }

  // 2. Weekly Challenge Schedule Guards (For approved paid candidates or free participants)
  if (quiz.isWeeklyChallenge && quiz.scheduledStartTime) {
    const now = new Date().getTime();
    const start = new Date(quiz.scheduledStartTime).getTime();

    if (now < start) {
      return (
        <div className="min-h-screen bg-background text-text-main flex items-center justify-center p-4">
          <div className="max-w-lg w-full bg-surface border border-warning/30 rounded-3xl p-8 text-center space-y-6 shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-warning/10 text-warning border border-warning/30 flex items-center justify-center mx-auto">
              <Clock size={28} />
            </div>
            <h2 className="text-2xl font-black uppercase tracking-tight">Challenge Upcoming</h2>
            <p className="text-text-muted text-sm leading-relaxed">
              <strong>{quiz.title}</strong> will be live on <span className="font-bold text-warning">{formattedDate}</span>.
            </p>

            {isEnrolled ? (
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-sm flex items-center justify-center gap-2">
                <CheckCircle2 size={18} /> {isPaid ? 'Payment Approved • You are registered for this challenge!' : 'You are enrolled for this challenge!'}
              </div>
            ) : !isPaid && quiz.isEnrollmentOpen !== false ? (
              <button
                onClick={() => enrollInQuiz(quiz.id, user.uid).then(() => loadQuiz(quiz.id))}
                className="w-full bg-warning hover:bg-warning-dark text-crust font-black text-sm uppercase tracking-wider py-3.5 rounded-xl transition-all cursor-pointer shadow-lg shadow-warning/20"
              >
                Enroll Now
              </button>
            ) : (
              <div className="p-4 rounded-2xl bg-surface/50 border border-white/5 text-text-muted font-bold text-sm flex items-center justify-center gap-2">
                <Lock size={18} /> Enrollment not yet open
              </div>
            )}

            <Link to="/quizzes" className="inline-block text-text-muted text-xs hover:text-text-main underline">
              Back to All Quizzes
            </Link>
          </div>
        </div>
      );
    }
  }

  return (
    <div className="min-h-screen bg-background text-text-main py-6 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <SEOManager 
        collectionName="quizzes"
        docId={quizId}
        initialData={quiz}
        fallbackTitle={`${quiz?.title || 'Quiz'} | ForenClue Quiz`} 
        fallbackDescription={quiz?.description} 
        fallbackImage={quiz?.thumbnail}
      />
      
      {/* Premium Ambient Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-warning/5 rounded-full blur-[120px] pointer-events-none -z-0" />
      <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-[150px] pointer-events-none -z-0" />

      <div className="max-w-4xl mx-auto space-y-5 sm:space-y-8 relative z-10">
        
        {/* Sticky Top Bar: Quiz Header & Live Timer */}
        <div className="sticky top-14 sm:top-16 z-30 bg-surface/90 backdrop-blur-xl border border-black/10 dark:border-white/10 rounded-2xl sm:rounded-3xl p-3 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 shadow-xl transition-all">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            {!isSubmitted && (
              <button
                onClick={() => setShowExitWarningModal(true)}
                className="p-2 sm:p-2.5 rounded-xl sm:rounded-2xl bg-base border border-black/10 dark:border-white/10 text-text-muted hover:text-red-500 hover:border-red-500/40 hover:bg-red-500/10 transition-all cursor-pointer shrink-0 shadow-sm"
                title="Exit Quiz Attempt"
              >
                <ArrowLeft size={16} />
              </button>
            )}
            <div className="space-y-0.5 sm:space-y-1 min-w-0 flex-1">
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                <span className="text-[10px] font-black uppercase tracking-wider text-warning bg-warning/10 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full border border-warning/20 shadow-sm">
                  {quiz.category}
                </span>
                <span className="text-[10px] sm:text-xs font-mono font-bold text-text-muted">
                  Q{currentQuestionIdx + 1}/{quiz.questions.length}
                </span>
                <span className="text-[10px] sm:text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 sm:px-2 py-0.5 rounded-md shadow-sm">
                  {answeredCount} Done
                </span>
                {flaggedCount > 0 && (
                  <span className="text-[10px] sm:text-xs font-mono font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-1.5 sm:px-2 py-0.5 rounded-md shadow-sm flex items-center gap-1">
                    <Bookmark size={10} className="fill-current" /> {flaggedCount}
                  </span>
                )}
                {!isSubmitted && (
                  <span className="text-[10px] sm:text-xs font-mono font-bold text-amber-500 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20 px-1.5 sm:px-2 py-0.5 rounded-md shadow-sm flex items-center gap-1" title="Copy, Cut, and Paste actions are disabled during quiz attempt">
                    <ShieldCheck size={12} /> No Copy/Paste
                  </span>
                )}
              </div>
              <h1 className="font-heading font-black text-sm sm:text-xl text-text-main truncate tracking-tight">
                {quiz.title}
              </h1>
            </div>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0 border-t sm:border-t-0 border-black/5 dark:border-white/5 pt-2 sm:pt-0">
            {/* Questions Grid Drawer Toggle */}
            {!isSubmitted && (
              <button
                onClick={() => setShowQuestionsGrid(!showQuestionsGrid)}
                className={cn(
                  "px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl border font-black text-[11px] sm:text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 sm:gap-2 cursor-pointer shadow-sm",
                  showQuestionsGrid 
                    ? "bg-warning text-crust border-warning shadow-warning/20 ring-2 ring-warning/30" 
                    : "bg-surface border-black/10 dark:border-white/10 text-text-main hover:border-warning/50 hover:bg-black/5 dark:hover:bg-white/5"
                )}
              >
                <LayoutGrid size={14} className="sm:w-4 sm:h-4" />
                <span>Grid</span>
              </button>
            )}

            {/* Timer Pill */}
            {!isSubmitted && (
              <div className={cn(
                "px-3.5 sm:px-5 py-1.5 sm:py-2.5 rounded-xl sm:rounded-2xl border flex items-center gap-2 sm:gap-2.5 font-mono transition-all shadow-lg ml-auto sm:ml-0 bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white border-red-400/30 shadow-red-600/30",
                timeRemainingSec < 120 
                  ? "animate-pulse ring-2 ring-red-400 border-red-300 shadow-red-500/60 scale-105" 
                  : "hover:scale-[1.02]"
              )}>
                <Clock size={18} className="text-yellow-300 shrink-0 drop-shadow-sm" />
                <div className="text-right flex flex-col justify-center">
                  <span className="text-[8px] sm:text-[9px] uppercase font-black text-red-100/90 block leading-none tracking-wider">Time Left</span>
                  <span className="font-black text-base sm:text-xl text-white tracking-widest leading-tight drop-shadow-sm">{formatTimer(timeRemainingSec)}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Questions Grid Navigation Popover Drawer */}
        <AnimatePresence>
          {showQuestionsGrid && !isSubmitted && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-surface border border-warning/30 rounded-2xl p-5 shadow-2xl space-y-3 overflow-hidden"
            >
              <div className="flex items-center justify-between pb-2 border-b border-black/10 dark:border-white/10">
                <span className="text-xs font-black uppercase tracking-wider text-text-main flex items-center gap-2">
                  <LayoutGrid size={15} className="text-warning" /> Question Navigator
                </span>
                <button
                  onClick={() => setShowQuestionsGrid(false)}
                  className="p-1 text-text-muted hover:text-text-main transition"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 pt-1">
                {quiz.questions.map((q, idx) => {
                  const isAnswered = userAnswers[q.id] !== undefined;
                  const isFlagged = flaggedQuestions[q.id];
                  const isCurrent = currentQuestionIdx === idx;

                  return (
                    <button
                      key={q.id}
                      onClick={() => {
                        setCurrentQuestionIdx(idx);
                        setShowQuestionsGrid(false);
                      }}
                      className={cn(
                        "h-10 rounded-xl text-xs font-black transition-all flex flex-col items-center justify-center relative border cursor-pointer",
                        isCurrent 
                          ? "bg-warning text-crust border-warning shadow-md shadow-warning/20 scale-105" 
                          : isAnswered 
                            ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-400" 
                            : "bg-base border-black/10 dark:border-white/10 text-text-muted hover:border-warning/50"
                      )}
                    >
                      <span>{idx + 1}</span>
                      {isFlagged && (
                        <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-amber-500 flex items-center justify-center text-[8px] text-black font-black shadow-sm">
                          🚩
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center gap-4 text-[10px] font-mono text-text-muted pt-2 border-t border-black/5 dark:border-white/5 justify-center flex-wrap">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded bg-warning" /> Current
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded bg-emerald-500/30 border border-emerald-500" /> Answered
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded bg-base border border-black/20" /> Unanswered
                </span>
                <span className="flex items-center gap-1">
                  <span>🚩</span> Flagged
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* IF SUBMITTED: Show Animated Results & Interactive Explanations */}
        {isSubmitted ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Score Banner Box */}
            <div className="bg-surface border-2 border-warning/40 rounded-3xl p-8 text-center space-y-6 shadow-2xl relative overflow-hidden">
              {/* Background ambient glow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-warning/10 rounded-full blur-3xl pointer-events-none" />

              {/* Celebratory Confetti Animation */}
              <ConfettiAnimation />

              <motion.div 
                initial={{ scale: 0.5, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="w-20 h-20 rounded-full bg-warning/20 text-warning border-2 border-warning/50 flex items-center justify-center mx-auto shadow-xl shadow-warning/20"
              >
                <Trophy size={40} />
              </motion.div>

              <div className="space-y-2">
                <span className="text-xs font-black uppercase tracking-widest text-warning px-3 py-1 rounded-full bg-warning/10 border border-warning/20 inline-block">
                  Challenge Completed
                </span>
                <h2 className="text-3xl sm:text-5xl font-heading font-black uppercase tracking-tight text-text-main">
                  Score: <span className="text-warning">{finalScore}</span> / {quiz.totalPoints || 100}
                </h2>
                <p className="text-text-muted text-sm max-w-md mx-auto">
                  Completed in <strong className="text-text-main">{Math.floor(timeTakenSec / 60)}m {timeTakenSec % 60}s</strong>. Your submission is logged on the official ForenClue Leaderboard!
                </p>
              </div>

              {/* Stats pill row */}
              <div className="grid grid-cols-3 gap-3 max-w-md mx-auto pt-2">
                <div className="bg-base border border-black/10 dark:border-white/10 p-3 rounded-2xl text-center">
                  <span className="text-[10px] font-mono text-text-muted uppercase block">Accuracy</span>
                  <span className="text-lg font-black text-emerald-500 font-mono">
                    {Math.round((calculateResults().correctCount / quiz.questions.length) * 100)}%
                  </span>
                </div>

                <div className="bg-base border border-black/10 dark:border-white/10 p-3 rounded-2xl text-center">
                  <span className="text-[10px] font-mono text-text-muted uppercase block">Correct</span>
                  <span className="text-lg font-black text-warning font-mono">
                    {calculateResults().correctCount} / {quiz.questions.length}
                  </span>
                </div>

                <div className="bg-base border border-black/10 dark:border-white/10 p-3 rounded-2xl text-center">
                  <span className="text-[10px] font-mono text-text-muted uppercase block">Time/Q</span>
                  <span className="text-lg font-black text-amber-500 font-mono">
                    {Math.round(timeTakenSec / Math.max(1, quiz.questions.length))}s
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <Link
                  to={`/quizzes/${quiz.id}/leaderboard`}
                  className="w-full sm:w-auto bg-warning hover:bg-warning-dark text-crust font-black text-xs uppercase tracking-wider px-8 py-3.5 rounded-xl transition-all shadow-lg shadow-warning/20 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Trophy size={16} /> View Top 10 Leaderboard
                </Link>

                {!quiz.isWeeklyChallenge && (
                  <button
                    onClick={() => {
                      setIsSubmitted(false);
                      setUserAnswers({});
                      setFlaggedQuestions({});
                      setEliminatedOptions({});
                      setCurrentQuestionIdx(0);
                      setTimeRemainingSec((quiz.durationMinutes || 10) * 60);
                      setQuizStartedAt(Date.now());
                    }}
                    className="w-full sm:w-auto bg-base border border-black/10 dark:border-white/10 hover:border-warning/50 text-text-main font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <RotateCcw size={15} /> Retake Practice
                  </button>
                )}

                <Link
                  to="/quizzes"
                  className="w-full sm:w-auto bg-base border border-black/10 dark:border-white/10 hover:bg-black/5 text-text-muted hover:text-text-main font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl transition-all"
                >
                  Back to All Quizzes
                </Link>
              </div>
            </div>

            {/* Answer Key & Interactive Explanations */}
            <div className="bg-surface rounded-3xl border border-black/10 dark:border-white/10 p-6 sm:p-8 space-y-6 shadow-xl">
              
              {/* Filter controls */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-black/10 dark:border-white/10">
                <h3 className="text-lg font-heading font-black text-text-main flex items-center gap-2 uppercase tracking-wide">
                  <HelpCircle size={20} className="text-warning" /> Question Review & Explanations
                </h3>

                <div className="flex items-center gap-1.5 bg-base p-1 rounded-xl border border-black/10 dark:border-white/10">
                  <button
                    onClick={() => setReviewFilter('all')}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer",
                      reviewFilter === 'all' ? "bg-warning text-crust font-black" : "text-text-muted hover:text-text-main"
                    )}
                  >
                    All ({quiz.questions.length})
                  </button>
                  <button
                    onClick={() => setReviewFilter('incorrect')}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer",
                      reviewFilter === 'incorrect' ? "bg-red-500 text-white font-black" : "text-text-muted hover:text-text-main"
                    )}
                  >
                    Incorrect
                  </button>
                  {flaggedCount > 0 && (
                    <button
                      onClick={() => setReviewFilter('flagged')}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer",
                        reviewFilter === 'flagged' ? "bg-amber-500 text-black font-black" : "text-text-muted hover:text-text-main"
                      )}
                    >
                      Flagged
                    </button>
                  )}
                </div>
              </div>

              {/* Filtered Question Review Cards */}
              <div className="space-y-6">
                {quiz.questions
                  .filter(q => {
                    const selected = userAnswers[q.id];
                    const isCorrect = selected === q.correctAnswerIndex;
                    if (reviewFilter === 'incorrect') return !isCorrect;
                    if (reviewFilter === 'flagged') return flaggedQuestions[q.id];
                    return true;
                  })
                  .map((q, idx) => {
                    const selected = userAnswers[q.id];
                    const isCorrect = selected === q.correctAnswerIndex;
                    const origIndex = quiz.questions.findIndex(orig => orig.id === q.id);

                    return (
                      <div key={q.id} className="p-4 sm:p-5 rounded-2xl bg-base border border-black/10 dark:border-white/10 space-y-3 sm:space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 sm:gap-4">
                          <span className="font-heading font-extrabold text-sm sm:text-base text-text-main leading-snug">
                            {origIndex + 1}. {q.question}
                          </span>
                          {isCorrect ? (
                            <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] sm:text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 shrink-0 font-mono self-start">
                              <CheckCircle2 size={12} /> Correct (+{q.points || 10} pts)
                            </span>
                          ) : (
                            <span className="bg-red-500/20 text-red-400 border border-red-500/30 text-[10px] sm:text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 shrink-0 font-mono self-start">
                              <AlertTriangle size={12} /> Incorrect (0 pts)
                            </span>
                          )}
                        </div>

                        {/* Question Reference Diagram if available */}
                        {q.image && (
                          <div className="rounded-xl border border-black/10 dark:border-white/10 overflow-hidden bg-surface p-2 sm:p-3 flex flex-col items-center justify-center max-w-lg mx-auto shadow-sm relative group">
                            <div 
                              onClick={() => setFullscreenImage({ src: q.image!, caption: q.imageCaption })}
                              className="relative cursor-zoom-in w-full flex flex-col items-center group/img"
                              title="Click to view diagram in full size"
                            >
                              <ResilientImage 
                                src={q.image} 
                                alt={q.imageCaption || "Forensic Reference Diagram"} 
                                className="max-h-60 sm:max-h-72 w-full object-contain rounded-lg transition-transform group-hover/img:scale-[1.01]" 
                                fallbackText="Diagram Load Error"
                              />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity rounded-lg flex items-center justify-center backdrop-blur-[1px]">
                                <span className="px-3 py-1.5 rounded-xl bg-black/80 border border-white/20 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg">
                                  <Maximize2 size={13} className="text-warning" /> Click to enlarge diagram
                                </span>
                              </div>
                            </div>
                            {q.imageCaption && (
                              <span className="text-[10px] sm:text-[11px] font-mono text-text-muted mt-1.5 text-center italic">
                                🔬 {q.imageCaption}
                              </span>
                            )}
                          </div>
                        )}

                        {/* Options breakdown */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm">
                          {q.options.map((opt, optIdx) => {
                            const isOptionCorrect = optIdx === q.correctAnswerIndex;
                            const isOptionSelected = optIdx === selected;

                            return (
                              <div 
                                key={optIdx}
                                className={cn(
                                  "p-2.5 sm:p-3 rounded-xl border font-semibold text-xs sm:text-sm flex items-center justify-between gap-2 min-w-0",
                                  isOptionCorrect && "bg-emerald-500/20 border-emerald-500/60 !text-emerald-300 font-bold",
                                  isOptionSelected && !isOptionCorrect && "bg-red-500/20 border-red-500/60 !text-red-300 line-through",
                                  !isOptionCorrect && !isOptionSelected && "bg-white/5 border-white/10 !text-slate-200"
                                )}
                              >
                                <div className="flex items-center gap-2 min-w-0 flex-1">
                                  <span className="w-5 h-5 rounded-full border border-current text-[10px] flex items-center justify-center font-bold shrink-0">
                                    {String.fromCharCode(65 + optIdx)}
                                  </span>
                                  <span className="break-words min-w-0 flex-1 !text-white">{opt}</span>
                                </div>
                                {isOptionCorrect && <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />}
                              </div>
                            );
                          })}
                        </div>

                        {q.explanation && (
                          <div className="p-4 rounded-xl bg-warning/10 border border-warning/20 !text-white text-xs leading-relaxed space-y-1">
                            <span className="font-mono font-black text-warning uppercase block">Explanation / Rationale:</span>
                            <p className="!text-slate-200 text-xs leading-relaxed">{q.explanation}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            </div>
          </motion.div>
        ) : (
          /* ACTIVE QUIZ PLAYER VIEW */
          <div className="bg-surface/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-white/10 dark:border-white/5 p-4 sm:p-8 sm:px-10 space-y-6 sm:space-y-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] relative overflow-hidden ring-1 ring-black/5 dark:ring-white/5 select-none">
            
            {/* Top Progress Bar & Question Stats */}
            <div className="space-y-2 sm:space-y-3">
              <div className="flex items-center justify-between text-[11px] sm:text-xs font-mono text-text-muted font-bold tracking-wider">
                <span>PROGRESS: {Math.round(((currentQuestionIdx + 1) / quiz.questions.length) * 100)}%</span>
                <span>{answeredCount} of {quiz.questions.length} Completed</span>
              </div>
              <div className="w-full bg-black/5 dark:bg-white/5 h-2 rounded-full overflow-hidden shadow-inner">
                <motion.div 
                  className="bg-gradient-to-r from-warning via-amber-400 to-yellow-500 h-full rounded-full shadow-[0_0_10px_rgba(252,211,77,0.5)]"
                  animate={{ width: `${((currentQuestionIdx + 1) / quiz.questions.length) * 100}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </div>
            </div>

            {/* Question Card Box with AnimatePresence */}
            <AnimatePresence mode="wait">
              {currentQ && (
                <motion.div
                  key={currentQ.id}
                  initial={{ opacity: 0, x: slideDirection === 'right' ? 20 : -20, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, x: slideDirection === 'right' ? -20 : 20, filter: 'blur(4px)' }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="space-y-6 sm:space-y-8"
                >
                  {/* Question Header & Flag Toggle */}
                  <div className="flex items-start justify-between gap-3 sm:gap-6">
                    <div className="space-y-2 sm:space-y-3 min-w-0 flex-1">
                      <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                        <span className="text-[10px] font-black uppercase tracking-widest text-warning bg-warning/10 px-2 py-0.5 rounded-md border border-warning/20">
                          Question #{currentQuestionIdx + 1}
                        </span>
                        <span className="text-[10px] font-mono text-slate-300 bg-white/10 px-2 py-0.5 rounded-md border border-white/10">
                          {currentQ.points || 10} Points
                        </span>
                      </div>
                      
                      <h2 className="text-lg sm:text-2xl md:text-3xl font-heading font-black text-white leading-snug sm:leading-tight break-words">
                        {currentQ.question}
                      </h2>
                    </div>

                    {/* Action Buttons: 50:50 Lifeline, Clue Hint, Flag */}
                    <div className="flex items-center gap-2 shrink-0">
                      {/* 50:50 Lifeline Button */}
                      <button
                        type="button"
                        onClick={() => handle5050Lifeline(currentQ)}
                        className={cn(
                          "p-2.5 sm:p-3 rounded-xl sm:rounded-2xl border transition-all flex flex-col items-center gap-1 text-[10px] uppercase font-black tracking-wider cursor-pointer shadow-sm",
                          (eliminatedOptions[currentQ.id] || []).length >= 2
                            ? "bg-purple-600 text-white border-purple-400 shadow-purple-500/30"
                            : "bg-white/10 border-white/15 text-slate-300 hover:text-purple-300 hover:border-purple-400/50 hover:bg-purple-950/30"
                        )}
                        title="50:50 Lifeline: Eliminate 2 wrong choices to make the question easier"
                      >
                        <Zap size={18} className={cn("sm:w-5 sm:h-5", (eliminatedOptions[currentQ.id] || []).length >= 2 ? "fill-white" : "")} />
                        <span className="hidden sm:inline">50:50</span>
                      </button>

                      {/* Hint / Clue Button */}
                      {(currentQ.hint || currentQ.explanation) && (
                        <button
                          type="button"
                          onClick={() => toggleHint(currentQ.id)}
                          className={cn(
                            "p-2.5 sm:p-3 rounded-xl sm:rounded-2xl border transition-all flex flex-col items-center gap-1 text-[10px] uppercase font-black tracking-wider cursor-pointer shadow-sm",
                            showHint[currentQ.id]
                              ? "bg-amber-400 text-black border-amber-300 shadow-amber-400/30"
                              : "bg-white/10 border-white/15 text-slate-300 hover:text-amber-300 hover:border-amber-400/50 hover:bg-amber-950/30"
                          )}
                          title="View a helpful hint or clue"
                        >
                          <Lightbulb size={18} className={cn("sm:w-5 sm:h-5", showHint[currentQ.id] ? "fill-black text-black" : "")} />
                          <span className="hidden sm:inline">{showHint[currentQ.id] ? 'Hide Clue' : 'Clue'}</span>
                        </button>
                      )}

                      {/* Bookmark / Flag Button */}
                      <button
                        onClick={() => toggleFlagQuestion(currentQ.id)}
                        className={cn(
                          "p-2.5 sm:p-3 rounded-xl sm:rounded-2xl border transition-all flex flex-col items-center gap-1 text-[10px] uppercase font-black tracking-wider cursor-pointer shadow-sm",
                          flaggedQuestions[currentQ.id]
                            ? "bg-amber-500 text-black border-amber-400 shadow-amber-500/30"
                            : "bg-white/10 border-white/15 text-slate-300 hover:text-warning hover:border-warning/40 hover:bg-white/15"
                        )}
                        title="Flag question to review before final submission"
                      >
                        <Bookmark size={18} className={cn("sm:w-5 sm:h-5", flaggedQuestions[currentQ.id] ? "fill-black" : "")} />
                        <span className="hidden sm:inline">
                          {flaggedQuestions[currentQ.id] ? 'Flagged' : 'Flag'}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Gentle Study Hint / Clue Banner */}
                  <AnimatePresence>
                    {showHint[currentQ.id] && (
                      <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.98 }}
                        transition={{ duration: 0.2 }}
                        className="bg-amber-500/15 border border-amber-400/40 rounded-2xl p-4 text-amber-200 text-xs sm:text-sm flex items-start gap-3 shadow-lg backdrop-blur-sm"
                      >
                        <div className="w-8 h-8 rounded-xl bg-amber-400/20 text-amber-300 border border-amber-400/30 flex items-center justify-center shrink-0 mt-0.5">
                          <Lightbulb size={18} className="fill-amber-400/20 text-amber-300 animate-pulse" />
                        </div>
                        <div className="space-y-1 flex-1">
                          <span className="text-amber-300 font-bold uppercase tracking-wider text-[10px] sm:text-xs block">
                            💡 Helpful Guided Clue
                          </span>
                          <p className="text-amber-100 leading-relaxed">
                            {currentQ.hint || "Review the reference diagram and look closely at the shape, formula, and labels provided."}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Question Image / Reference Diagram if available */}
                  {currentQ.image && (
                    <div className="rounded-2xl border border-white/15 overflow-hidden bg-black/40 p-2 sm:p-4 flex flex-col items-center justify-center max-w-2xl mx-auto shadow-inner relative group">
                      <div 
                        onClick={() => setFullscreenImage({ src: currentQ.image!, caption: currentQ.imageCaption })}
                        className="relative cursor-zoom-in w-full flex flex-col items-center group/activeImg"
                        title="Click to view diagram in full size"
                      >
                        <ResilientImage 
                          src={currentQ.image} 
                          alt={currentQ.imageCaption || "Forensic Reference Diagram"} 
                          className="max-h-72 sm:max-h-96 w-full object-contain rounded-xl shadow-sm hover:scale-[1.01] transition-transform" 
                          fallbackText="Diagram Load Error"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/activeImg:opacity-100 transition-opacity rounded-xl flex items-center justify-center backdrop-blur-[1px]">
                          <span className="px-3.5 py-2 rounded-xl bg-black/85 border border-white/25 text-white text-xs font-bold flex items-center gap-2 shadow-2xl tracking-wide">
                            <Maximize2 size={15} className="text-warning" /> Click to view full size
                          </span>
                        </div>
                      </div>
                      {currentQ.imageCaption && (
                        <div className="mt-2.5 px-3 py-1 bg-white/10 border border-white/10 rounded-lg text-center">
                          <span className="text-[11px] sm:text-xs font-mono text-slate-300 italic flex items-center justify-center gap-1.5">
                            🔬 {currentQ.imageCaption}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Options List */}
                  <div className="space-y-2.5 sm:space-y-3.5">
                    {currentQ.options.map((option, optIdx) => {
                      const isSelected = userAnswers[currentQ.id] === optIdx;
                      const isEliminated = (eliminatedOptions[currentQ.id] || []).includes(optIdx);

                      return (
                        <div
                          key={optIdx}
                          onClick={() => !isEliminated && handleSelectOption(currentQ.id, optIdx)}
                          className={cn(
                            "group relative w-full text-left p-3.5 sm:p-5 rounded-2xl border font-semibold transition-all duration-200 flex items-center justify-between gap-3 cursor-pointer select-none shadow-sm",
                            isSelected 
                              ? "bg-warning/20 border-warning !text-white shadow-[0_4px_24px_rgba(252,211,77,0.25)] ring-1 ring-warning/60 z-10" 
                              : isEliminated
                                ? "bg-white/[0.03] border-white/5 !text-slate-500 line-through opacity-50"
                                : "bg-white/[0.07] hover:bg-white/[0.14] border-white/15 hover:border-warning/50 !text-white hover:shadow-md"
                          )}
                        >
                          <div className="flex items-center gap-2.5 sm:gap-4 min-w-0 flex-1">
                            <span className={cn(
                              "w-8 h-8 sm:w-10 sm:h-10 rounded-xl border text-xs sm:text-sm flex items-center justify-center font-mono font-black transition-all shrink-0",
                              isSelected 
                                ? "border-warning bg-warning text-black shadow-md font-black" 
                                : "border-white/20 !text-slate-100 bg-white/10 group-hover:border-warning/50 group-hover:bg-warning/20 group-hover:!text-warning"
                            )}>
                              {String.fromCharCode(65 + optIdx)}
                            </span>
                            
                            <span className={cn(
                              isEliminated ? "line-through !text-slate-400/60" : "!text-white", 
                              "leading-snug sm:leading-relaxed break-words min-w-0 flex-1 text-xs sm:text-base font-medium !text-white select-text"
                            )}>
                              {option}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                            {/* Eliminate Option Button */}
                            <button
                              type="button"
                              onClick={(e) => toggleEliminateOption(currentQ.id, optIdx, e)}
                              className={cn(
                                "p-1.5 sm:p-2 rounded-xl border transition-all text-[10px] font-mono flex items-center gap-1 cursor-pointer backdrop-blur-sm",
                                isEliminated 
                                  ? "bg-red-500/20 text-red-400 border-red-500/30 hover:bg-red-500/30 opacity-100" 
                                  : "opacity-70 sm:opacity-0 group-hover:opacity-100 bg-white/10 border-white/15 text-slate-300 hover:text-white hover:border-white/30"
                              )}
                              title={isEliminated ? "Restore Choice" : "Eliminate Choice"}
                            >
                              <EyeOff size={13} className="sm:w-3.5 sm:h-3.5" />
                              <span className="hidden md:inline">{isEliminated ? 'Restore' : 'Cross out'}</span>
                            </button>

                            {isSelected && (
                              <motion.div
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                              >
                                <CheckCircle2 size={20} className="sm:w-6 sm:h-6 text-warning shrink-0 drop-shadow-md" />
                              </motion.div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Bottom Question Navigation Bar */}
            <div className="pt-6 sm:pt-8 border-t border-black/10 dark:border-white/10 flex flex-col gap-4 sm:gap-6">
              {/* Number Buttons Toolbar */}
              <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto max-w-full py-1.5 px-2 no-scrollbar mask-edges justify-start sm:justify-center">
                {quiz.questions.map((q, idx) => {
                  const isAnswered = userAnswers[q.id] !== undefined;
                  const isFlagged = flaggedQuestions[q.id];
                  const isCurrent = currentQuestionIdx === idx;

                  return (
                    <button
                      key={q.id}
                      onClick={() => {
                        setSlideDirection(idx > currentQuestionIdx ? 'right' : 'left');
                        setCurrentQuestionIdx(idx);
                      }}
                      className={cn(
                        "w-8 h-8 sm:w-9 sm:h-9 rounded-xl text-xs transition-all duration-200 flex items-center justify-center cursor-pointer relative shrink-0 border",
                        isCurrent 
                          ? "bg-warning border-warning text-crust font-black shadow-[0_4px_12px_rgba(252,211,77,0.4)] scale-105 z-10" 
                          : isAnswered 
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 font-bold hover:bg-emerald-500/20" 
                            : "bg-surface border-black/10 dark:border-white/10 text-text-muted hover:border-warning/50 font-semibold hover:text-text-main"
                      )}
                    >
                      {idx + 1}
                      {isFlagged && (
                        <span className="absolute -top-1 -right-1 text-[9px] drop-shadow-md">🚩</span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Action Buttons Row */}
              <div className="flex items-center justify-between gap-3 w-full">
                <button
                  onClick={handlePrevQuestion}
                  disabled={currentQuestionIdx === 0}
                  className="flex-1 sm:flex-initial px-4 sm:px-6 py-3 sm:py-3.5 rounded-2xl border border-black/10 dark:border-white/10 text-xs font-black uppercase tracking-wider disabled:opacity-30 disabled:cursor-not-allowed hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-200 flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer shadow-sm hover:shadow-md"
                >
                  <ArrowLeft size={16} /> <span>Previous</span>
                </button>

                {currentQuestionIdx < quiz.questions.length - 1 ? (
                  <button
                    onClick={handleNextQuestion}
                    className="flex-1 sm:flex-initial px-6 sm:px-8 py-3 sm:py-3.5 rounded-2xl bg-warning hover:bg-warning-dark text-crust font-black text-xs uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer shadow-[0_4px_20px_rgba(252,211,77,0.3)] hover:shadow-[0_8px_25px_rgba(252,211,77,0.4)]"
                  >
                    <span>Next</span> <ArrowRight size={16} />
                  </button>
                ) : (
                  <button
                    onClick={() => setShowConfirmModal(true)}
                    className="flex-1 sm:flex-initial px-6 sm:px-8 py-3 sm:py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-black font-black text-xs uppercase tracking-widest transition-all duration-200 flex items-center justify-center gap-1.5 sm:gap-2 shadow-[0_4px_20px_rgba(245,158,11,0.4)] cursor-pointer"
                  >
                    <span>Submit</span> <CheckCircle2 size={16} />
                  </button>
                )}
              </div>
            </div>

          </div>
        )}

        {/* Pre-Submission Confirmation Modal */}
        <AnimatePresence>
          {showConfirmModal && (
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-surface border border-warning/40 rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-6 text-center shadow-2xl relative"
              >
                <div className="w-16 h-16 rounded-full bg-warning/10 text-warning border border-warning/30 flex items-center justify-center mx-auto shadow-md">
                  <Trophy size={28} />
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl font-heading font-black uppercase tracking-tight text-text-main">
                    Ready to Submit?
                  </h3>
                  <p className="text-text-muted text-sm leading-relaxed">
                    Review your progress before officially finalizing your attempt:
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-2 py-2">
                  <div className="p-3 bg-base border border-black/10 dark:border-white/10 rounded-2xl">
                    <span className="text-[10px] font-mono text-text-muted uppercase block">Answered</span>
                    <span className="text-base font-black text-emerald-400 font-mono">
                      {answeredCount} / {quiz.questions.length}
                    </span>
                  </div>

                  <div className="p-3 bg-base border border-black/10 dark:border-white/10 rounded-2xl">
                    <span className="text-[10px] font-mono text-text-muted uppercase block">Unanswered</span>
                    <span className="text-base font-black text-amber-400 font-mono">
                      {quiz.questions.length - answeredCount}
                    </span>
                  </div>

                  <div className="p-3 bg-base border border-black/10 dark:border-white/10 rounded-2xl">
                    <span className="text-[10px] font-mono text-text-muted uppercase block">Flagged</span>
                    <span className="text-base font-black text-warning font-mono">
                      {flaggedCount}
                    </span>
                  </div>
                </div>

                {quiz.questions.length - answeredCount > 0 && (
                  <div className="p-3 bg-amber-500/10 border border-amber-500/30 text-amber-500 text-xs rounded-xl flex items-center justify-center gap-1.5 font-bold">
                    <AlertTriangle size={14} /> You have {quiz.questions.length - answeredCount} unanswered questions!
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowConfirmModal(false)}
                    className="flex-1 py-3 rounded-xl border border-black/10 dark:border-white/10 text-text-muted hover:text-text-main font-bold text-xs uppercase tracking-wider cursor-pointer"
                  >
                    Review Again
                  </button>
                  <button
                    onClick={handleSubmitQuiz}
                    disabled={submitting}
                    className="flex-1 py-3 rounded-xl bg-warning hover:bg-warning-dark text-crust font-black text-xs uppercase tracking-wider shadow-lg shadow-warning/20 cursor-pointer"
                  >
                    {submitting ? 'Submitting...' : 'Confirm Submit'}
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Anti-cheat Warning Modal */}
        <AnimatePresence>
          {showCheatWarningModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-surface border-2 border-red-500/50 rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl shadow-red-500/10"
              >
                <div className="w-16 h-16 rounded-full bg-red-500/10 text-red-500 border border-red-500/30 flex items-center justify-center mx-auto mb-6">
                  <AlertTriangle size={32} />
                </div>
                <h3 className="text-xl font-black uppercase tracking-wider text-red-500 mb-3">
                  Warning: Tab Switch Detected
                </h3>
                <p className="text-sm text-text-muted mb-6">
                  Switching tabs or windows during an active quiz is not allowed. 
                  You have <strong>{3 - tabSwitchWarnings}</strong> warning(s) left. 
                  If you switch again, your quiz will be automatically submitted.
                </p>
                <button
                  onClick={() => setShowCheatWarningModal(false)}
                  className="w-full py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-black text-xs uppercase tracking-wider cursor-pointer transition-colors"
                >
                  I Understand
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Exit / Leave Quiz Warning Modal */}
        <AnimatePresence>
          {showExitWarningModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="bg-surface border border-black/15 dark:border-white/15 rounded-3xl p-6 sm:p-8 max-w-sm w-full text-center shadow-2xl relative overflow-hidden"
              >
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle size={24} />
                </div>

                <div className="space-y-1.5 mb-6">
                  <h3 className="text-xl font-heading font-black tracking-tight text-text-main">
                    Leave Quiz?
                  </h3>
                  <p className="text-text-muted text-xs leading-relaxed">
                    Your current progress will not be saved.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowExitWarningModal(false)}
                    className="flex-1 py-3 rounded-xl bg-warning hover:bg-warning-dark text-crust font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md"
                  >
                    Keep Solving
                  </button>
                  <button
                    onClick={() => {
                      setShowExitWarningModal(false);
                      setIsSubmitted(true);
                      navigate('/quizzes');
                    }}
                    className="flex-1 py-3 rounded-xl border border-black/10 dark:border-white/10 text-text-muted hover:text-red-500 hover:border-red-500/30 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
                  >
                    Leave
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Anti-cheat Clipboard Action Notice Toast */}
        <AnimatePresence>
          {showClipboardNotice && !isSubmitted && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-red-600 text-white font-bold text-xs sm:text-sm px-5 py-3.5 rounded-2xl shadow-2xl border border-red-400 flex items-center gap-2.5 max-w-md pointer-events-none"
            >
              <AlertTriangle size={18} className="shrink-0 animate-bounce" />
              <span>Copy, cut, and paste actions are strictly disabled during quiz attempts.</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Fullscreen Image Lightbox Modal */}
        <AnimatePresence>
          {fullscreenImage && (
            <div 
              className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
              onClick={() => setFullscreenImage(null)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={{ duration: 0.2 }}
                className="relative max-w-6xl w-full max-h-[95vh] flex flex-col items-center justify-center"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header bar / Close button */}
                <div className="w-full flex items-center justify-between gap-3 pb-3 text-white">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-warning/20 text-warning border border-warning/30">
                      <Maximize2 size={16} />
                    </span>
                    <span className="text-xs sm:text-sm font-mono font-bold text-slate-200">
                      Full-Size Forensic Diagram View
                    </span>
                  </div>
                  <button
                    onClick={() => setFullscreenImage(null)}
                    className="p-2 sm:px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all cursor-pointer flex items-center gap-1.5 text-xs font-bold shadow-lg"
                  >
                    <X size={18} />
                    <span className="hidden sm:inline">Close</span>
                  </button>
                </div>

                {/* High-res Image Box */}
                <div className="w-full overflow-auto max-h-[78vh] flex items-center justify-center p-3 rounded-2xl bg-black/80 border border-white/20 shadow-[0_0_50px_rgba(0,0,0,0.8)]">
                  <ResilientImage
                    src={fullscreenImage.src}
                    alt={fullscreenImage.caption || "Full Size Forensic Reference"}
                    className="max-h-[74vh] max-w-full object-contain rounded-xl shadow-2xl"
                    fallbackText="Failed to load full size diagram"
                  />
                </div>

                {/* Caption Footer */}
                {fullscreenImage.caption && (
                  <div className="mt-3 px-4 py-2 bg-white/10 border border-white/15 rounded-xl text-center max-w-3xl">
                    <p className="text-xs sm:text-sm font-mono text-slate-200">
                      🔬 {fullscreenImage.caption}
                    </p>
                  </div>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

