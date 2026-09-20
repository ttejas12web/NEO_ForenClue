import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Trophy, ShieldCheck, Copy, CheckCircle2, AlertCircle, 
  CreditCard, Clock, QrCode, ExternalLink, Loader2, ArrowRight
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

  const upiId = quiz.upiId || 'forenclue@okaxis';
  const payeeName = quiz.payeeName || 'ForenClue Forensic Services';
  const entryFee = quiz.price || 49;
  const firstPrize = quiz.prizes?.first ?? 300;
  const secondPrize = quiz.prizes?.second ?? 200;
  const thirdPrize = quiz.prizes?.third ?? 100;
  const totalPrize = firstPrize + secondPrize + thirdPrize;

  // Generate UPI URI for QR Code
  const upiUri = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(payeeName)}&am=${entryFee}&cu=INR&tn=${encodeURIComponent(`Challenge: ${quiz.title.substring(0, 20)}`)}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=8&data=${encodeURIComponent(upiUri)}`;

  useEffect(() => {
    if (isOpen && user?.uid) {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setErrorMsg('Please sign in to register for this challenge.');
      return;
    }

    const trimmedUtr = utrNumber.trim();
    if (!trimmedUtr) {
      setErrorMsg('Please enter your 12-digit UPI / UTR reference number.');
      return;
    }

    if (trimmedUtr.length < 8) {
      setErrorMsg('UTR / Reference numbers are usually 12 digits. Please verify from your payment receipt.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');
    try {
      await submitQuizRegistration({
        quizId: quiz.id,
        quizTitle: quiz.title,
        userId: user.uid,
        userName: user.displayName || senderName || user.email?.split('@')[0] || 'Candidate',
        userEmail: user.email || '',
        utrNumber: trimmedUtr,
        senderName: senderName.trim(),
        amount: entryFee
      });

      setSuccessMsg('UTR Submitted Successfully! Admin will review and activate your challenge access.');
      await loadExisting();
      onRegistrationSubmitted?.();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to submit registration proof.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-surface border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 my-8 text-text-main overflow-hidden"
        >
          {/* Header Ambient Glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Modal Header */}
          <div className="flex items-start justify-between relative z-10 border-b border-black/10 dark:border-white/10 pb-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-black uppercase tracking-wider">
                <Trophy size={14} className="fill-amber-400" /> Paid Quiz Challenge Registration
              </div>
              <h2 className="text-xl sm:text-2xl font-black font-heading tracking-tight text-text-main">
                {quiz.title}
              </h2>
              <p className="text-xs text-text-muted">
                Advance registration opens now. Pay via UPI & submit your 12-digit UTR for admin approval.
              </p>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-text-muted hover:text-text-main transition-colors"
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
                  Awarded to top 3 verified leaderboard rankers after accuracy & anti-cheat audit.
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

          {/* Current Status Box if already submitted */}
          {loadingExisting ? (
            <div className="py-6 text-center text-xs text-text-muted flex items-center justify-center gap-2">
              <Loader2 size={16} className="animate-spin text-warning" /> Checking registration status...
            </div>
          ) : existingRegistration && (
            <div className={`p-4 rounded-2xl border text-xs space-y-2 ${
              existingRegistration.status === 'approved' 
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                : existingRegistration.status === 'rejected'
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {existingRegistration.status === 'approved' ? (
                    <CheckCircle2 size={18} className="text-emerald-400" />
                  ) : existingRegistration.status === 'rejected' ? (
                    <AlertCircle size={18} className="text-rose-400" />
                  ) : (
                    <Clock size={18} className="text-amber-400 animate-pulse" />
                  )}
                  <span className="font-bold uppercase tracking-wider text-sm">
                    {existingRegistration.status === 'approved' && 'Registration Approved! You Can Attempt.'}
                    {existingRegistration.status === 'pending' && 'Payment Under Admin Review'}
                    {existingRegistration.status === 'rejected' && 'Registration Rejected'}
                  </span>
                </div>
                <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-black/30 border border-current">
                  UTR: {existingRegistration.utrNumber}
                </span>
              </div>
              
              {existingRegistration.status === 'pending' && (
                <p className="text-text-muted text-[11px] leading-relaxed">
                  Your payment reference has been logged. Our administrative team is verifying the transaction in the bank statement. Your challenge will unlock automatically once approved.
                </p>
              )}

              {existingRegistration.status === 'rejected' && (
                <div className="space-y-1">
                  <p className="text-[11px] text-rose-300">
                    Reason: {existingRegistration.rejectReason || 'UTR not verified in bank statement'}
                  </p>
                  <p className="text-[10px] text-text-muted">
                    If this was a typo, you can re-enter your correct 12-digit UTR below to re-submit.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Payment & UTR Submission Form (Only if not already approved) */}
          {(!existingRegistration || existingRegistration.status !== 'approved') && (
            <div className="space-y-6">
              {/* Step 1: Scan & Pay */}
              <div className="bg-base border border-black/10 dark:border-white/10 rounded-2xl p-4 sm:p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-warning flex items-center gap-1.5">
                    <CreditCard size={14} /> Step 1: Pay Entry Fee (₹{entryFee}) via UPI
                  </span>
                  <span className="text-[11px] font-mono font-bold text-text-muted">
                    GPay • PhonePe • Paytm • BHIM
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-6 pt-2">
                  {/* UPI QR Code */}
                  <div className="bg-white p-3 rounded-2xl shadow-md shrink-0 border border-black/10">
                    <img 
                      src={qrCodeUrl} 
                      alt="UPI Payment QR Code" 
                      className="w-36 h-36 object-contain"
                    />
                    <span className="block text-center text-[9px] font-bold text-black uppercase mt-1 tracking-wider">
                      Scan to Pay ₹{entryFee}
                    </span>
                  </div>

                  {/* UPI ID & Details */}
                  <div className="space-y-3 w-full">
                    <div>
                      <span className="text-[10px] font-mono text-text-muted uppercase block">Official UPI ID:</span>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="px-3 py-2 bg-surface rounded-xl border border-black/10 dark:border-white/10 font-mono text-sm font-bold text-text-main select-all flex-1">
                          {upiId}
                        </div>
                        <button
                          type="button"
                          onClick={handleCopyUpi}
                          className="p-2.5 rounded-xl bg-warning/10 hover:bg-warning/20 border border-warning/30 text-warning text-xs font-bold transition flex items-center gap-1 shrink-0"
                          title="Copy UPI ID"
                        >
                          {copiedUpi ? <CheckCircle2 size={16} /> : <Copy size={16} />}
                          <span className="hidden sm:inline">{copiedUpi ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                    </div>

                    <div className="text-xs text-text-muted space-y-1">
                      <p><strong className="text-text-main">Payee Name:</strong> {payeeName}</p>
                      <p><strong className="text-text-main">Required Amount:</strong> <span className="text-warning font-bold">₹{entryFee}</span></p>
                      <p className="text-[11px] text-amber-500/90 font-medium">
                        ⚠️ Note: After paying, copy the 12-digit UTR / UPI Ref ID from your receipt.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 2: Submit 12-Digit UTR */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-warning flex items-center gap-1.5">
                    <ShieldCheck size={14} /> Step 2: Submit Payment UTR for Approval
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono text-text-muted uppercase mb-1">
                      12-Digit UTR / UPI Ref No. *
                    </label>
                    <input
                      type="text"
                      maxLength={18}
                      value={utrNumber}
                      onChange={(e) => setUtrNumber(e.target.value)}
                      placeholder="e.g. 423489102834"
                      className="w-full bg-base border border-black/10 dark:border-white/10 rounded-xl p-3 text-sm font-mono font-bold text-text-main outline-none focus:border-warning"
                      required
                    />
                    <p className="text-[10px] text-text-muted mt-1">
                      Found in your transaction details in GPay, PhonePe, or Paytm receipt.
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
                      Name appearing on the sending bank account or UPI profile.
                    </p>
                  </div>
                </div>

                {errorMsg && (
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                    <AlertCircle size={15} /> {errorMsg}
                  </div>
                )}

                {successMsg && (
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
                    <CheckCircle2 size={15} /> {successMsg}
                  </div>
                )}

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-5 py-2.5 rounded-xl border border-black/10 dark:border-white/10 text-xs font-bold text-text-muted hover:text-text-main transition"
                  >
                    Close
                  </button>

                  <button
                    type="submit"
                    disabled={submitting}
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
