import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Trophy, ShieldCheck, Copy, CheckCircle2, AlertCircle, 
  CreditCard, Clock, QrCode, ExternalLink, Loader2, ArrowRight,
  Smartphone, RefreshCw
} from 'lucide-react';
import { Quiz, QuizRegistration } from '@/types/quiz';
import { useAuth } from '@/contexts/AuthContext';
import { submitQuizRegistration, getUserQuizRegistration } from '@/services/quizService';

interface PaidChallengeRegistrationModalProps {
  quiz: Quiz;
  isOpen: boolean;
  onClose: () => void;
  onRegistrationSubmitted?: () => void;
}

export function PaidChallengeRegistrationModal({
  quiz,
  isOpen,
  onClose,
  onRegistrationSubmitted
}: PaidChallengeRegistrationModalProps) {
  const { user } = useAuth();
  const [utrNumber, setUtrNumber] = useState('');
  const [senderName, setSenderName] = useState(user?.displayName || '');
  const [submitting, setSubmitting] = useState(false);
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [existingRegistration, setExistingRegistration] = useState<QuizRegistration | null>(null);
  const [loadingExisting, setLoadingExisting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isEditingRejected, setIsEditingRejected] = useState(false);

  const upiId = quiz.upiId || 'forenclue@okaxis';
  const payeeName = quiz.payeeName || 'ForenClue Forensic Services';
  const entryFee = quiz.price || 49;
  const firstPrize = quiz.prizes?.first ?? 300;
  const secondPrize = quiz.prizes?.second ?? 200;
  const thirdPrize = quiz.prizes?.third ?? 100;
  const totalPrize = firstPrize + secondPrize + thirdPrize;

  // Generate standard UPI URI for QR Code and Direct Pay App Intent
  const upiUri = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(payeeName)}&am=${entryFee}&cu=INR&tn=${encodeURIComponent(`Challenge: ${quiz.title.substring(0, 20)}`)}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=8&data=${encodeURIComponent(upiUri)}`;

  useEffect(() => {
    if (isOpen && user?.uid) {
      setErrorMsg('');
      setSuccessMsg('');
      loadExisting();
    }
  }, [isOpen, user?.uid, quiz.id]);

  const loadExisting = async () => {
    if (!user?.uid) return;
    setLoadingExisting(true);
    try {
      const reg = await getUserQuizRegistration(quiz.id, user.uid);
      setExistingRegistration(reg);
      if (reg) {
        setUtrNumber(reg.utrNumber);
        setSenderName(reg.senderName || user.displayName || '');
      }
    } catch (e) {
      console.warn("Could not check existing registration", e);
    } finally {
      setLoadingExisting(false);
    }
  };

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2500);
  };

  const handleUtrChange = (val: string) => {
    // Automatically sanitize whitespace and special characters
    const sanitized = val.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    setUtrNumber(sanitized);
    if (errorMsg) setErrorMsg('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setErrorMsg('Please sign in to register for this challenge.');
      return;
    }

    const trimmedUtr = utrNumber.trim().replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    if (!trimmedUtr) {
      setErrorMsg('Please enter your 12-digit UPI / UTR reference number.');
      return;
    }

    if (trimmedUtr.length < 6) {
      setErrorMsg('UTR / Reference numbers are usually 12 digits. Please verify your receipt.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');
    try {
      await submitQuizRegistration({
        quizId: quiz.id,
        quizTitle: quiz.title,
        userId: user.uid,
        userName: (user.displayName || senderName || user.email?.split('@')[0] || 'Candidate').trim(),
        userEmail: (user.email || '').trim(),
        utrNumber: trimmedUtr,
        senderName: (senderName || user.displayName || 'Candidate').trim(),
        amount: entryFee
      });

      setSuccessMsg('Payment reference received! Your verification is logged and under review.');
      setIsEditingRejected(false);
      await loadExisting();
      onRegistrationSubmitted?.();
    } catch (err: any) {
      console.warn("Notice: UTR submission issue:", err?.message || err);
      const friendlyMsg = err?.message || 'Failed to submit registration proof. Please try again.';
      setErrorMsg(friendlyMsg);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const isApproved = existingRegistration?.status === 'approved';
  const isPending = existingRegistration?.status === 'pending';
  const isRejected = existingRegistration?.status === 'rejected';
  const showForm = !existingRegistration || isRejected || isEditingRejected;

  const is12Digits = utrNumber.length === 12;
  const isValidLength = utrNumber.length >= 8 && utrNumber.length <= 18;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-surface border border-amber-500/30 rounded-3xl p-5 sm:p-8 shadow-2xl space-y-6 my-8 text-text-main overflow-hidden"
        >
          {/* Header Ambient Glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Modal Header */}
          <div className="flex items-start justify-between relative z-10 border-b border-black/10 dark:border-white/10 pb-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-black uppercase tracking-wider">
                <Trophy size={14} className="fill-amber-400" /> Paid Challenge Registration
              </div>
              <h2 className="text-xl sm:text-2xl font-black font-heading tracking-tight text-text-main">
                {quiz.title}
              </h2>
              <p className="text-xs text-text-muted">
                Quick 2-step verification: Pay via UPI & submit your 12-digit UTR reference.
              </p>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-text-muted hover:text-text-main transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Cash Prize Pool Callout */}
          <div className="bg-gradient-to-r from-amber-500/15 via-yellow-500/10 to-amber-500/5 border border-amber-500/30 rounded-2xl p-4 sm:p-5 relative overflow-hidden">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="text-[11px] font-black uppercase tracking-widest text-amber-400">Total Cash Prize Pool</p>
                <h3 className="text-2xl sm:text-3xl font-black text-text-main font-mono">₹{totalPrize}</h3>
                <p className="text-xs text-text-muted mt-1">
                  Verified cash prizes awarded to top 3 ranked candidates on the leaderboard.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2 w-full sm:w-auto">
                <div className="bg-base/80 border border-amber-500/30 rounded-xl p-2.5 text-center">
                  <span className="text-[10px] font-black text-amber-400 uppercase block">1st Rank</span>
                  <span className="text-base font-black text-text-main font-mono">₹{firstPrize}</span>
                </div>
                <div className="bg-base/80 border border-amber-500/30 rounded-xl p-2.5 text-center">
                  <span className="text-[10px] font-black text-amber-400 uppercase block">2nd Rank</span>
                  <span className="text-base font-black text-text-main font-mono">₹{secondPrize}</span>
                </div>
                <div className="bg-base/80 border border-amber-500/30 rounded-xl p-2.5 text-center">
                  <span className="text-[10px] font-black text-amber-400 uppercase block">3rd Rank</span>
                  <span className="text-base font-black text-text-main font-mono">₹{thirdPrize}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Status Box if already submitted */}
          {loadingExisting ? (
            <div className="py-6 text-center text-xs text-text-muted flex items-center justify-center gap-2">
              <Loader2 size={16} className="animate-spin text-warning" /> Checking registration status...
            </div>
          ) : existingRegistration && (
            <div className={`p-4 sm:p-5 rounded-2xl border text-xs space-y-3 ${
              isApproved 
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                : isRejected
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
            }`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  {isApproved ? (
                    <CheckCircle2 size={20} className="text-emerald-400 shrink-0" />
                  ) : isRejected ? (
                    <AlertCircle size={20} className="text-rose-400 shrink-0" />
                  ) : (
                    <Clock size={20} className="text-amber-400 animate-pulse shrink-0" />
                  )}
                  <span className="font-black uppercase tracking-wider text-sm">
                    {isApproved && 'Registration Approved! Challenge Access Unlocked.'}
                    {isPending && 'Payment Verification in Progress'}
                    {isRejected && 'Registration Rejected'}
                  </span>
                </div>
                <span className="font-mono text-[11px] px-2.5 py-1 rounded-lg bg-black/40 border border-current font-bold self-start sm:self-auto">
                  UTR: {existingRegistration.utrNumber}
                </span>
              </div>
              
              {isPending && (
                <div className="space-y-2 pt-1 border-t border-amber-500/20">
                  <p className="text-text-muted text-xs leading-relaxed">
                    Your 12-digit UTR reference is recorded in our system. The verification team matches incoming UPI receipts against bank records. Once verified, your quiz will automatically unlock.
                  </p>
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setIsEditingRejected(true)}
                      className="text-[11px] text-amber-400 hover:text-amber-300 underline font-medium flex items-center gap-1 cursor-pointer"
                    >
                      <RefreshCw size={11} /> Update or re-enter UTR number
                    </button>
                  </div>
                </div>
              )}

              {isRejected && (
                <div className="space-y-2 pt-1 border-t border-rose-500/20">
                  <p className="text-xs text-rose-300">
                    <strong>Admin Note:</strong> {existingRegistration.rejectReason || 'UTR not verified in bank statement.'}
                  </p>
                  <p className="text-[11px] text-text-muted">
                    If this was a typo or you used a different payment method, re-enter your 12-digit reference below:
                  </p>
                </div>
              )}

              {isApproved && (
                <p className="text-text-muted text-xs">
                  Your seat is confirmed! When the challenge is live, open the quiz directly to begin your test.
                </p>
              )}
            </div>
          )}

          {/* Payment & UTR Submission Form */}
          {showForm && !isApproved && (
            <div className="space-y-6">
              {/* Step 1: Scan & Pay */}
              <div className="bg-base border border-black/10 dark:border-white/10 rounded-2xl p-4 sm:p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-warning flex items-center gap-1.5">
                    <CreditCard size={14} /> Step 1: Pay Entry Fee (₹{entryFee})
                  </span>
                  <span className="text-[11px] font-mono font-bold text-text-muted">
                    Instant UPI Transfer
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-6 pt-1">
                  {/* UPI QR Code */}
                  <div className="bg-white p-3 rounded-2xl shadow-md shrink-0 border border-black/10 text-center">
                    <img 
                      src={qrCodeUrl} 
                      alt="UPI Payment QR Code" 
                      className="w-36 h-36 object-contain mx-auto"
                    />
                    <span className="block text-center text-[9px] font-bold text-black uppercase mt-1 tracking-wider">
                      Scan to Pay ₹{entryFee}
                    </span>
                  </div>

                  {/* UPI ID & Direct Pay Button */}
                  <div className="space-y-3 w-full">
                    {/* Direct App Pay (Mobile Friendly) */}
                    <a
                      href={upiUri}
                      className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-md cursor-pointer"
                    >
                      <Smartphone size={15} /> Pay via Any UPI App (GPay / PhonePe / Paytm)
                      <ExternalLink size={12} className="opacity-80" />
                    </a>

                    <div>
                      <span className="text-[10px] font-mono text-text-muted uppercase block">Or Copy UPI ID:</span>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="px-3 py-2 bg-surface rounded-xl border border-black/10 dark:border-white/10 font-mono text-xs sm:text-sm font-bold text-text-main select-all flex-1 truncate">
                          {upiId}
                        </div>
                        <button
                          type="button"
                          onClick={handleCopyUpi}
                          className="p-2.5 rounded-xl bg-warning/10 hover:bg-warning/20 border border-warning/30 text-warning text-xs font-bold transition flex items-center gap-1 shrink-0 cursor-pointer"
                          title="Copy UPI ID"
                        >
                          {copiedUpi ? <CheckCircle2 size={15} /> : <Copy size={15} />}
                          <span>{copiedUpi ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                    </div>

                    <div className="text-xs text-text-muted space-y-1">
                      <p><strong className="text-text-main">Payee Name:</strong> {payeeName}</p>
                      <p><strong className="text-text-main">Amount:</strong> <span className="text-warning font-bold">₹{entryFee}</span></p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 2: Submit 12-Digit UTR */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-warning flex items-center gap-1.5">
                    <ShieldCheck size={14} /> Step 2: Submit Payment UTR / Ref No.
                  </span>

                  {utrNumber && (
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                      is12Digits 
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' 
                        : isValidLength 
                        ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                        : 'bg-black/10 dark:bg-white/10 text-text-muted'
                    }`}>
                      {is12Digits ? '✓ 12-Digit UTR' : `${utrNumber.length}/12 Digits`}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono text-text-muted uppercase mb-1">
                      12-Digit UTR / UPI Ref ID *
                    </label>
                    <input
                      type="text"
                      maxLength={20}
                      value={utrNumber}
                      onChange={(e) => handleUtrChange(e.target.value)}
                      placeholder="e.g. 423489102834"
                      className="w-full bg-base border border-black/10 dark:border-white/10 rounded-xl p-3 text-sm font-mono font-bold text-text-main outline-none focus:border-warning tracking-wider"
                      required
                      autoFocus
                    />
                    <p className="text-[10px] text-text-muted mt-1">
                      Available under transaction details in your UPI app receipt.
                    </p>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-text-muted uppercase mb-1">
                      Sender Name / Account Holder *
                    </label>
                    <input
                      type="text"
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full bg-base border border-black/10 dark:border-white/10 rounded-xl p-3 text-sm font-bold text-text-main outline-none focus:border-warning"
                      required
                    />
                    <p className="text-[10px] text-text-muted mt-1">
                      Name registered with your paying bank or UPI profile.
                    </p>
                  </div>
                </div>

                {errorMsg && (
                  <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2.5">
                    <AlertCircle size={16} className="shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {successMsg && (
                  <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2.5">
                    <CheckCircle2 size={16} className="shrink-0" />
                    <span>{successMsg}</span>
                  </div>
                )}

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-5 py-2.5 rounded-xl border border-black/10 dark:border-white/10 text-xs font-bold text-text-muted hover:text-text-main transition cursor-pointer"
                  >
                    Close
                  </button>

                  <button
                    type="submit"
                    disabled={submitting || !utrNumber.trim()}
                    className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-black uppercase tracking-wider transition flex items-center gap-2 shadow-lg shadow-amber-500/20 disabled:opacity-50 cursor-pointer"
                  >
                    {submitting ? (
                      <>
                        <Loader2 size={14} className="animate-spin" /> Submitting...
                      </>
                    ) : (
                      <>
                        <ShieldCheck size={14} /> Submit UTR for Review
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

