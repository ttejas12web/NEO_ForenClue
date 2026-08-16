import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  Trophy, 
  Medal, 
  Award, 
  Clock, 
  TrendingUp,
  Sparkles,
  ChevronRight,
  Zap
} from 'lucide-react';
import { Quiz, LeaderboardEntry } from '@/types/quiz';
import { fetchQuizzes, fetchLeaderboard } from '@/services/quizService';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, where } from 'firebase/firestore';

export function RecentQuizLeaderboardSection() {
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const allQuizzes = await fetchQuizzes();
      
      // Filter for weekly challenges first and find the most recent/active one
      const weeklyChallenges = allQuizzes.filter(q => q.isWeeklyChallenge);
      weeklyChallenges.sort((a, b) => {
        const timeA = new Date(a.scheduledStartTime || a.scheduledEndTime || a.createdAt || 0).getTime();
        const timeB = new Date(b.scheduledStartTime || b.scheduledEndTime || b.createdAt || 0).getTime();
        return timeB - timeA;
      });

      // Target the latest weekly challenge, fallback to first available quiz
      const chosen = weeklyChallenges[0] || allQuizzes[0] || null;
      setSelectedQuiz(chosen);

      if (chosen) {
        const topEntries = await fetchLeaderboard(chosen);
        setEntries(topEntries);
      } else {
        setEntries([]);
      }
    } catch (err) {
      console.error("Failed to fetch recent quiz leaderboard:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Real-time listener for quizAttempts collection on the active quiz to reflect live submissions
  useEffect(() => {
    if (!selectedQuiz?.id) return;

    const attemptsRef = collection(db, 'quizAttempts');
    const q = query(attemptsRef, where('quizId', '==', selectedQuiz.id));

    const unsubscribe = onSnapshot(q, async () => {
      if (selectedQuiz) {
        try {
          const updated = await fetchLeaderboard(selectedQuiz);
          setEntries(updated);
        } catch (e) {
          console.warn("Real-time leaderboard update fallback:", e);
        }
      }
    }, (err) => {
      console.warn("Snapshot error on quiz attempts:", err);
    });

    return () => unsubscribe();
  }, [selectedQuiz]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs < 10 ? '0' : ''}${secs}s`;
  };

  const top1 = entries.find(e => e.rank === 1);
  const top2 = entries.find(e => e.rank === 2);
  const top3 = entries.find(e => e.rank === 3);
  const restEntries = entries.filter(e => e.rank > 3);

  return (
    <section 
      id="home-quiz-leaderboard-section" 
      className="py-20 relative overflow-hidden font-sans border-y border-white/10"
      style={{
        background: 'radial-gradient(ellipse at 50% 0%, #111a2e 0%, #080d19 50%, #050810 100%)',
        color: '#ffffff'
      }}
    >
      {/* Ambient Radial Lighting & Forensic Grid */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-warning/10 rounded-full blur-[150px] pointer-events-none -z-0" />
      <div className="absolute bottom-0 right-10 w-96 h-96 bg-amber-500/5 rounded-full blur-[120px] pointer-events-none -z-0" />
      <div className="absolute top-1/3 left-0 w-80 h-80 bg-blue-600/5 rounded-full blur-[130px] pointer-events-none -z-0" />

      {/* Forensic Grid overlay */}
      <div 
        className="absolute inset-0 opacity-[0.04] pointer-events-none" 
        style={{
          backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header (No Sync Live, No Full Standings, No Select Quiz) */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-warning/15 border border-warning/30 text-warning text-xs font-mono uppercase tracking-widest font-black mb-3.5 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-warning opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-warning"></span>
            </span>
            <Trophy size={13} className="text-warning" />
            <span>Live Challenge Standings</span>
          </div>

          <h2 className="font-heading font-black text-3xl sm:text-4xl md:text-5xl uppercase tracking-tight text-white">
            Recent Challenge <span className="text-transparent bg-clip-text bg-gradient-to-r from-warning via-amber-400 to-yellow-300">Leaderboard</span>
          </h2>

          <p 
            className="text-sm sm:text-base text-white mt-3 leading-relaxed font-normal opacity-100"
            style={{ color: '#ffffff' }}
          >
            Official rankings, accurate scoring metrics, and performance analytics from the latest ForenClue national challenge.
          </p>
        </div>

        {/* Active Quiz Header Card */}
        {selectedQuiz && (
          <div className="bg-[#0e1626]/90 border border-white/10 rounded-2xl p-4 sm:p-5 mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 backdrop-blur-md shadow-xl">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-11 h-11 rounded-xl bg-warning/15 border border-warning/30 flex items-center justify-center text-warning shrink-0 font-black">
                <Trophy size={22} />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-warning/20 text-warning px-2.5 py-0.5 rounded border border-warning/30">
                    {selectedQuiz.isWeeklyChallenge ? 'National Weekly Challenge' : 'Forensic Challenge'}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    {selectedQuiz.category || 'Forensic Science'}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white truncate mt-0.5">
                  {selectedQuiz.title}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Link
                to={`/quizzes/${selectedQuiz.id}`}
                className="px-5 py-2.5 bg-warning hover:bg-warning-dark text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center gap-2"
              >
                <span>Take This Challenge</span>
                <ChevronRight size={14} />
              </Link>
            </div>
          </div>
        )}

        {/* Leaderboard Content */}
        {loading ? (
          <div className="py-20 text-center flex flex-col items-center justify-center gap-3 bg-[#0d1424]/50 rounded-3xl border border-white/10">
            <div className="w-8 h-8 border-2 border-warning border-t-transparent rounded-full animate-spin" />
            <span className="font-bold text-sm text-slate-300">Loading Official Leaderboard...</span>
          </div>
        ) : entries.length === 0 ? (
          <div className="bg-[#0d1424]/60 border border-dashed border-white/15 rounded-3xl p-10 sm:p-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-warning/10 border border-warning/25 flex items-center justify-center text-warning mx-auto mb-4">
              <Trophy size={32} />
            </div>
            <h3 className="text-lg font-black uppercase tracking-wider text-white mb-1">
              Be The First On The Leaderboard!
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto mb-6">
              No official submissions logged for this challenge yet. Attempt the quiz challenge now to secure the #1 Champion spot!
            </p>
            {selectedQuiz && (
              <Link
                to={`/quizzes/${selectedQuiz.id}`}
                className="inline-flex items-center gap-2 px-6 py-3 bg-warning hover:bg-warning-dark text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg hover:shadow-warning/20"
              >
                <Zap size={15} />
                <span>Start Quiz Challenge Now</span>
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-10">
            
            {/* Top 3 Podium Layout (2nd Silver, 1st Gold Champion Center, 3rd Bronze) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end pt-4">
              
              {/* 2nd Place (Silver) */}
              <div className="order-2 md:order-1">
                {top2 ? (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="bg-[#0f172a] border border-slate-400/30 rounded-2xl p-6 text-center relative shadow-xl overflow-hidden group hover:border-slate-300/60 transition-all"
                  >
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-slate-400/50 via-slate-200 to-slate-400/50" />
                    
                    <div className="flex justify-between items-center mb-4">
                      <span className="bg-slate-500/15 text-slate-300 border border-slate-400/30 text-[10px] font-black uppercase px-2.5 py-1 rounded-full flex items-center gap-1">
                        <Medal size={12} className="text-slate-300" /> #2 Silver
                      </span>
                      <span className="text-[11px] font-mono font-bold text-emerald-400">
                        {top2.accuracyPercentage}% Acc
                      </span>
                    </div>

                    <div className="relative mx-auto w-20 h-20 rounded-full border-2 border-slate-300/60 p-1 mb-3.5 shadow-[0_0_15px_rgba(203,213,225,0.15)]">
                      {top2.userPhoto ? (
                        <img src={top2.userPhoto} alt={top2.userName} className="w-full h-full rounded-full object-cover" />
                      ) : (
                        <div className="w-full h-full rounded-full bg-slate-800 flex items-center justify-center text-slate-200 font-bold text-xl">
                          {top2.userName?.charAt(0) || 'U'}
                        </div>
                      )}
                    </div>

                    <h4 className="font-bold text-base text-white line-clamp-1 mb-3">
                      {top2.userName}
                    </h4>

                    <div className="grid grid-cols-2 gap-2 bg-[#080d19] rounded-xl p-3 border border-white/5">
                      <div>
                        <span className="text-[9px] uppercase tracking-wider text-slate-400 block font-semibold">Score</span>
                        <span className="font-black text-sm text-slate-200">{top2.score}/{top2.totalPoints || 100}</span>
                      </div>
                      <div>
                        <span className="text-[9px] uppercase tracking-wider text-slate-400 block font-semibold">Time</span>
                        <span className="font-black text-sm text-slate-200">{formatTime(top2.timeTakenSeconds)}</span>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <div className="bg-[#0e1626]/40 border border-dashed border-white/10 rounded-2xl p-6 text-center text-slate-400 text-xs">
                    2nd Place Position
                  </div>
                )}
              </div>

              {/* 1st Place (Gold Champion - Center Elevated) */}
              <div className="order-1 md:order-2 md:-translate-y-4">
                {top1 ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="bg-gradient-to-b from-amber-500/20 via-[#111a2e] to-[#0d1424] border-2 border-amber-500/60 rounded-3xl p-7 text-center relative shadow-[0_0_50px_rgba(245,158,11,0.25)] overflow-hidden group hover:border-amber-400 transition-all"
                  >
                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-yellow-300 to-amber-500" />
                    
                    <div className="flex justify-between items-center mb-4">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-black uppercase tracking-widest shadow-sm">
                        <Trophy size={14} className="text-yellow-400 fill-yellow-400" /> #1 Champion
                      </div>
                      <span className="text-xs font-mono font-black text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        {top1.accuracyPercentage}% Acc
                      </span>
                    </div>

                    <div className="relative mx-auto w-24 h-24 rounded-full border-4 border-yellow-400 p-1 mb-3.5 shadow-[0_0_25px_rgba(250,204,21,0.45)]">
                      {top1.userPhoto ? (
                        <img src={top1.userPhoto} alt={top1.userName} className="w-full h-full rounded-full object-cover" />
                      ) : (
                        <div className="w-full h-full rounded-full bg-amber-950 flex items-center justify-center text-yellow-400 font-black text-2xl">
                          {top1.userName?.charAt(0) || 'C'}
                        </div>
                      )}
                    </div>

                    <h4 className="font-black text-lg sm:text-xl text-white line-clamp-1 mb-3">
                      {top1.userName}
                    </h4>

                    <div className="grid grid-cols-2 gap-2 bg-amber-500/10 rounded-2xl p-3.5 border border-amber-500/25">
                      <div>
                        <span className="text-[10px] uppercase font-bold tracking-wider text-amber-300/80 block">Score</span>
                        <span className="font-black text-base sm:text-lg text-yellow-300">{top1.score}/{top1.totalPoints || 100}</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold tracking-wider text-amber-300/80 block">Time</span>
                        <span className="font-black text-base sm:text-lg text-yellow-300">{formatTime(top1.timeTakenSeconds)}</span>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <div className="bg-[#0e1626]/40 border border-dashed border-white/10 rounded-3xl p-8 text-center text-slate-400 text-xs">
                    1st Place Position
                  </div>
                )}
              </div>

              {/* 3rd Place (Bronze) */}
              <div className="order-3">
                {top3 ? (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    className="bg-[#0f172a] border border-amber-700/40 rounded-2xl p-6 text-center relative shadow-xl overflow-hidden group hover:border-amber-600/60 transition-all"
                  >
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-700 via-amber-600 to-amber-700" />
                    
                    <div className="flex justify-between items-center mb-4">
                      <span className="bg-amber-700/15 text-amber-400 border border-amber-700/30 text-[10px] font-black uppercase px-2.5 py-1 rounded-full flex items-center gap-1">
                        <Award size={12} className="text-amber-400" /> #3 Bronze
                      </span>
                      <span className="text-[11px] font-mono font-bold text-emerald-400">
                        {top3.accuracyPercentage}% Acc
                      </span>
                    </div>

                    <div className="relative mx-auto w-20 h-20 rounded-full border-2 border-amber-600/60 p-1 mb-3.5 shadow-[0_0_15px_rgba(217,119,6,0.15)]">
                      {top3.userPhoto ? (
                        <img src={top3.userPhoto} alt={top3.userName} className="w-full h-full rounded-full object-cover" />
                      ) : (
                        <div className="w-full h-full rounded-full bg-amber-950 flex items-center justify-center text-amber-400 font-bold text-xl">
                          {top3.userName?.charAt(0) || 'U'}
                        </div>
                      )}
                    </div>

                    <h4 className="font-bold text-base text-white line-clamp-1 mb-3">
                      {top3.userName}
                    </h4>

                    <div className="grid grid-cols-2 gap-2 bg-[#080d19] rounded-xl p-3 border border-white/5">
                      <div>
                        <span className="text-[9px] uppercase tracking-wider text-slate-400 block font-semibold">Score</span>
                        <span className="font-black text-sm text-amber-200">{top3.score}/{top3.totalPoints || 100}</span>
                      </div>
                      <div>
                        <span className="text-[9px] uppercase tracking-wider text-slate-400 block font-semibold">Time</span>
                        <span className="font-black text-sm text-amber-200">{formatTime(top3.timeTakenSeconds)}</span>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <div className="bg-[#0e1626]/40 border border-dashed border-white/10 rounded-2xl p-6 text-center text-slate-400 text-xs">
                    3rd Place Position
                  </div>
                )}
              </div>

            </div>

            {/* Ranks 4 to 10 Table */}
            {restEntries.length > 0 && (
              <div className="bg-[#0d1424] rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
                <div className="px-5 sm:px-6 py-4 bg-[#080d19]/90 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-2">
                    <TrendingUp size={14} className="text-warning" />
                    Runner-Up Standings (Ranks 4 - {entries.length})
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">
                    Ranked by Final Score & Time Efficiency
                  </span>
                </div>

                <div className="divide-y divide-white/5">
                  {restEntries.map((entry) => (
                    <div 
                      key={entry.userId + (entry.completedAt || '') + entry.rank}
                      className="p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-white/5 transition-colors gap-3 sm:gap-4"
                    >
                      <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                        <span className="w-8 h-8 rounded-full bg-[#080d19] border border-white/15 flex items-center justify-center font-black text-xs text-slate-300 shrink-0">
                          #{entry.rank}
                        </span>

                        <div className="w-9 h-9 rounded-full overflow-hidden bg-slate-800 shrink-0 border border-white/10">
                          {entry.userPhoto ? (
                            <img src={entry.userPhoto} alt={entry.userName} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs font-bold text-slate-300">
                              {entry.userName?.charAt(0) || 'U'}
                            </div>
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="font-bold text-sm text-white truncate">
                            {entry.userName}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-6 shrink-0 sm:text-right pl-[44px] sm:pl-0">
                        <div>
                          <div className="text-[10px] text-slate-400 uppercase font-semibold">Accuracy</div>
                          <div className="font-bold text-xs text-emerald-400">{entry.accuracyPercentage}%</div>
                        </div>

                        <div>
                          <div className="text-[10px] text-slate-400 uppercase font-semibold">Time Taken</div>
                          <div className="font-bold text-xs text-slate-200 flex items-center gap-1 sm:justify-end">
                            <Clock size={11} className="text-slate-400 shrink-0" />
                            {formatTime(entry.timeTakenSeconds)}
                          </div>
                        </div>

                        <div className="bg-[#080d19] border border-white/10 px-3 py-1.5 rounded-xl text-center sm:text-right min-w-[70px]">
                          <div className="text-[9px] uppercase text-slate-400 font-semibold">Points</div>
                          <div className="font-black text-xs text-warning">{entry.score} pts</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}



          </div>
        )}

      </div>
    </section>
  );
}
