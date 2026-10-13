import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Quiz, LeaderboardEntry } from '@/types/quiz';
import { fetchQuizById, fetchQuizzes, fetchLeaderboard } from '@/services/quizService';
import { LeaderboardPodium } from '@/components/quiz/LeaderboardPodium';
import { Trophy, ArrowLeft, RefreshCw, Sparkles, Award } from 'lucide-react';
import { SEOManager } from '@/components/layout/SEOManager';

export default function QuizLeaderboard() {
  const { quizId } = useParams<{ quizId: string }>();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [leaderboardMode, setLeaderboardMode] = useState<'official' | 'practice'>('official');

  useEffect(() => {
    loadData();
  }, [quizId]);

  const loadData = async (targetMode: 'official' | 'practice' = leaderboardMode) => {
    setLoading(true);
    const allQuizzes = await fetchQuizzes();
    setQuizzes(allQuizzes);

    // Prioritize requested quizId, or Crime Scene Documentation (5PkY9duGUxCwriid7i6t), or first quiz
    let activeQuiz = allQuizzes.find(q => q.id === quizId) || 
      allQuizzes.find(q => q.id === '5PkY9duGUxCwriid7i6t' || q.title?.toLowerCase().includes('crime sence') || q.title?.toLowerCase().includes('crime scene documentation')) ||
      allQuizzes[0] || 
      null;

    setSelectedQuiz(activeQuiz);

    if (activeQuiz) {
      const topEntries = await fetchLeaderboard(activeQuiz, targetMode);
      setEntries(topEntries);
    }
    setLoading(false);
  };

  const handleSelectQuiz = async (id: string) => {
    const found = quizzes.find(q => q.id === id);
    if (found) {
      setSelectedQuiz(found);
      setLoading(true);
      const topEntries = await fetchLeaderboard(found, leaderboardMode);
      setEntries(topEntries);
      setLoading(false);
    }
  };

  const handleToggleMode = async (mode: 'official' | 'practice') => {
    setLeaderboardMode(mode);
    if (selectedQuiz) {
      setLoading(true);
      const topEntries = await fetchLeaderboard(selectedQuiz, mode);
      setEntries(topEntries);
      setLoading(false);
    }
  };

  const isChallenge = Boolean(
    selectedQuiz?.isWeeklyChallenge ||
    selectedQuiz?.id === '5PkY9duGUxCwriid7i6t' ||
    selectedQuiz?.title?.toLowerCase().includes('crime sence') ||
    selectedQuiz?.title?.toLowerCase().includes('crime scene')
  );

  return (
    <div className="min-h-screen bg-background text-text-main py-12 px-4 sm:px-6 lg:px-8">
      <SEOManager 
        collectionName="quizzes"
        docId={selectedQuiz?.id || quizId}
        initialData={selectedQuiz}
        fallbackTitle={`Quiz Leaderboard - ${selectedQuiz?.title || 'ForenClue'}`}
        fallbackDescription="Official Top 10 Leaderboard rankings for ForenClue weekly quiz challenges and practice tests."
        fallbackImage={selectedQuiz?.thumbnail}
        canonicalPath={`/quizzes/${selectedQuiz?.id || quizId}/leaderboard`}
      />

      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <Link
            to="/quizzes"
            className="inline-flex items-center gap-2 text-text-muted hover:text-white font-bold text-sm transition-colors"
          >
            <ArrowLeft size={16} /> Back to Quizzes Arena
          </Link>

          <div className="flex flex-wrap items-center gap-3">
            {isChallenge && (
              <div className="flex items-center bg-black/40 p-1 rounded-xl border border-white/10">
                <button
                  onClick={() => handleToggleMode('official')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    leaderboardMode === 'official'
                      ? 'bg-amber-500 text-black shadow-md'
                      : 'text-text-muted hover:text-white'
                  }`}
                >
                  <Trophy size={13} /> Official Live Challenge
                </button>
                <button
                  onClick={() => handleToggleMode('practice')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    leaderboardMode === 'practice'
                      ? 'bg-amber-500 text-black shadow-md'
                      : 'text-text-muted hover:text-white'
                  }`}
                >
                  <Sparkles size={13} /> Practice Mode
                </button>
              </div>
            )}

            {quizzes.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-text-muted hidden sm:inline">Quiz:</span>
                <select
                  value={selectedQuiz?.id || ''}
                  onChange={(e) => handleSelectQuiz(e.target.value)}
                  className="bg-black/50 border border-amber-500/30 text-amber-300 font-bold text-sm rounded-xl px-4 py-2 outline-none cursor-pointer"
                >
                  {quizzes.map(q => (
                    <option key={q.id} value={q.id}>
                      {q.isWeeklyChallenge ? '🏆 ' : '📝 '} {q.title}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        {loading ? (
          <div className="py-20 text-center text-text-muted flex items-center justify-center gap-3">
            <RefreshCw size={24} className="animate-spin text-amber-500" />
            <span className="font-bold text-sm">Loading Leaderboard Rankings...</span>
          </div>
        ) : (
          <LeaderboardPodium 
            entries={entries} 
            quizTitle={selectedQuiz?.title}
            badgeLabel={
              leaderboardMode === 'official' && isChallenge
                ? 'Official Live Challenge Leaderboard'
                : 'Practice Mode Leaderboard'
            }
            subtitleNote={
              leaderboardMode === 'official' && isChallenge
                ? '* Certified official rankings from the live competition held on October 11, 2026. Practice mode attempts are completely isolated and excluded from altering live competition standings.'
                : '* Standings among students attempting this quiz in practice mode.'
            }
          />
        )}

      </div>
    </div>
  );
}
