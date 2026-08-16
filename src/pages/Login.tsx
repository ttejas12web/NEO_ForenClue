import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '@/contexts/AuthContext';
import DnaVisualizer from '../components/DnaVisualizer';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { SEO } from '@/components/layout/SEO';
import { validatePasswordStrength } from '@/lib/security';
import { 
  ShieldCheck, 
  Fingerprint, 
  Search, 
  Key, 
  ArrowRight, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Terminal, 
  CheckCircle, 
  BookOpen, 
  Award, 
  Activity,
  AlertCircle,
  User as UserIcon,
  Calendar,
  Trophy,
  Sparkles,
  Clock,
  Check,
  RefreshCw,
  ShieldAlert
} from 'lucide-react';

export default function Login() {
  const { 
    user, 
    signInWithLinkedIn, 
    signUpWithEmail, 
    signInWithEmail, 
    sendVerificationEmail, 
    sendPasswordReset, 
    reloadUser,
    loading, 
    adminLogin 
  } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || "/dashboard";
  const quizTitle = (location.state as any)?.quizTitle;
  const scheduledStartTime = (location.state as any)?.scheduledStartTime;
  const createdAt = (location.state as any)?.createdAt;
  const category = (location.state as any)?.category;
  const durationMinutes = (location.state as any)?.durationMinutes;
  const isFromQuiz = from?.includes('/quizzes/');

  const rawDate = scheduledStartTime || createdAt;
  const quizDateFormatted = rawDate 
    ? new Date(typeof rawDate === 'object' && rawDate.seconds ? rawDate.seconds * 1000 : rawDate).toLocaleDateString(undefined, { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
      })
    : 'Upcoming Session';

  // Email Verification State
  const [emailVerificationSent, setEmailVerificationSent] = useState(false);
  const [resendEmailMsg, setResendEmailMsg] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isCheckingVerification, setIsCheckingVerification] = useState(false);

  // Forgot Password Reset Credentials State
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [isSendingReset, setIsSendingReset] = useState(false);
  const [resetSuccessMsg, setResetSuccessMsg] = useState('');
  const [resetErrorMsg, setResetErrorMsg] = useState('');

  // Tabs for interactive Sign In vs Create Account vs Admin Portal
  const [activeTab, setActiveTab] = useState<'signin' | 'signup' | 'admin'>('signin');
  
  // Traditional inputs
  const [displayName, setDisplayName] = useState('');
  const [simulatedEmail, setSimulatedEmail] = useState('');
  const [simulatedPassword, setSimulatedPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Password validation analysis
  const passwordStrength = validatePasswordStrength(simulatedPassword);

  useEffect(() => {
    if (user && !loading) {
      navigate(from, { replace: true });
    }
  }, [user, loading, navigate, from]);

  // Resend cooldown timer countdown
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(c => c - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleResendVerificationEmail = async () => {
    try {
      setResendEmailMsg('');
      await sendVerificationEmail();
      setResendEmailMsg("Verification email resent! Please check your inbox or spam folder.");
      setResendCooldown(60);
    } catch (err: any) {
      console.error("Resend email error:", err);
      setResendEmailMsg(err.message || "Could not resend verification email.");
    }
  };

  const handleCheckEmailVerified = async () => {
    setIsCheckingVerification(true);
    try {
      await reloadUser();
      if (user?.emailVerified) {
        setAuthSuccess("✅ Email successfully verified! Welcome to ForenClue.");
      } else {
        setResendEmailMsg("Email not verified yet. Please click the confirmation link in your email and retry.");
      }
    } catch (err: any) {
      console.error("Verification reload error:", err);
    } finally {
      setIsCheckingVerification(false);
    }
  };

  const handleSendPasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetErrorMsg('');
    setResetSuccessMsg('');
    if (!resetEmail.trim()) {
      setResetErrorMsg('Please enter your account email address.');
      return;
    }
    setIsSendingReset(true);
    try {
      await sendPasswordReset(resetEmail.trim());
      setResetSuccessMsg(`A secure reset link has been dispatched to ${resetEmail.trim()}! Please check your inbox.`);
    } catch (err: any) {
      console.error("Password reset error:", err);
      let msg = err.message || "Could not send password reset email.";
      if (err.code === 'auth/user-not-found') {
        msg = "No account found matching this email address.";
      } else if (err.code === 'auth/invalid-email') {
        msg = "Please enter a valid email address.";
      }
      setResetErrorMsg(msg);
    } finally {
      setIsSendingReset(false);
    }
  };

  const handleLinkedInLogin = async () => {
    setAuthError('');
    setAuthSuccess('');
    try {
      await signInWithLinkedIn();
    } catch (error: any) {
      if (error.code === 'auth/popup-closed-by-user' || error.code === 'auth/cancelled-popup-request') {
        return;
      }
      let errMsg = error.message || "An unexpected error occurred during LinkedIn sign-in.";
      if (error.code === 'auth/unauthorized-domain' || error.message?.includes('unauthorized-domain')) {
        errMsg = "UNAUTHORIZED_DOMAIN";
      } else if (
        error.code === 'auth/operation-not-allowed' || 
        error.code === 'auth/configuration-not-found' || 
        error.code === 'auth/invalid-provider-id' || 
        error.message?.includes('operation-not-allowed')
      ) {
        errMsg = "LINKEDIN_NOT_ENABLED";
      } else if (error.code === 'auth/popup-blocked') {
        errMsg = "The sign-in popup was blocked by your browser settings. Please allow popups for this site.";
      }
      setAuthError(errMsg);
    }
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');
    setIsSubmitting(true);
    
    try {
      if (activeTab === 'signup') {
        if (!passwordStrength.isStrong) {
          setAuthError('Please ensure your password meets all security requirements before proceeding.');
          setIsSubmitting(false);
          return;
        }
        const name = displayName.trim() || simulatedEmail.split('@')[0] || 'Investigator';
        await signUpWithEmail(simulatedEmail, simulatedPassword, name);
        setAuthSuccess('Account registered successfully! A verification email has been dispatched.');
        setEmailVerificationSent(true);
        setTimeout(() => {
          navigate(from, { replace: true });
        }, 1200);
      } else if (activeTab === 'admin') {
        if (!adminLogin) {
          throw new Error('Admin authentication service unavailable.');
        }
        await adminLogin(simulatedEmail, simulatedPassword);
        setAuthSuccess('Administrator authenticated successfully! Redirecting to command console...');
        setTimeout(() => {
          navigate('/admin', { replace: true });
        }, 800);
      } else {
        await signInWithEmail(simulatedEmail, simulatedPassword);
        setAuthSuccess('Sign in successful! Directing to portal...');
        setTimeout(() => {
          navigate(from, { replace: true });
        }, 800);
      }
    } catch (err: any) {
      console.warn("Authentication failed:", err?.code || err?.message || err);
      let errMsg = "An unexpected error occurred. Please try again.";
      if (err.code === 'auth/email-already-in-use') {
        errMsg = "This email is already registered. Please sign in instead.";
      } else if (err.code === 'auth/invalid-email') {
        errMsg = "The email address is invalid.";
      } else if (err.code === 'auth/weak-password') {
        errMsg = "The password is too weak. Please include letters, numbers, and symbols.";
      } else if (err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
        errMsg = "Invalid email or password. If you do not have an account yet, please click 'Sign Up' above to register.";
      } else if (err.code === 'auth/operation-not-allowed') {
        errMsg = "Email authentication is disabled in Firebase configuration.";
      } else {
        errMsg = err.message || errMsg;
      }
      setAuthError(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-base py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden flex items-center justify-center">
      <SEO 
        title="Sign In / Sign Up | Investigator Portal" 
        description="Access the ForenClue Investigator Dashboard to view courses, certifications, case studies, and join the community." 
        noindex={true} 
      />
      {/* Dynamic scan line forensic grid background */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #00f0ff 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
      <div className="absolute top-[10%] left-[5%] w-[40vw] h-[40vw] bg-warning/5 rounded-full blur-[140px] pointer-events-none opacity-30" />
      <div className="absolute bottom-[15%] right-[5%] w-[35vw] h-[35vw] bg-warning/5 rounded-full blur-[110px] pointer-events-none opacity-20" />

      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch relative z-10">
        
        {/* Left Side: Interactive 3D DNA Helix & Forensic Scanner Pane */}
        <motion.div 
          initial={{ opacity: 0, x: -35 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-5 hidden lg:flex flex-col items-stretch min-h-[500px]"
        >
          <DnaVisualizer />
        </motion.div>

        {/* Right Side: Enhanced Authentication Core */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-7 bg-surface border border-black/15 dark:border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden flex flex-col justify-between"
        >
          <div>
            {/* Unverified Email Warning Banner if signed in but unverified */}
            {user && !user.emailVerified && (
              <div className="mb-6 p-4 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs flex flex-col gap-2 shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold uppercase tracking-wider">
                    <Mail size={16} className="text-amber-400" />
                    <span>Email Verification Required</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCheckEmailVerified}
                    disabled={isCheckingVerification}
                    className="flex items-center gap-1 text-[11px] bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 px-2.5 py-1 rounded-lg border border-amber-500/30 transition-colors"
                  >
                    <RefreshCw size={12} className={isCheckingVerification ? 'animate-spin' : ''} />
                    <span>Check Status</span>
                  </button>
                </div>
                <p className="text-[11px] text-amber-200/90 leading-relaxed">
                  A verification link was sent to <strong className="text-amber-100">{user.email}</strong>. Please confirm your email address to enable full portal features.
                </p>
                <div className="flex items-center gap-3 pt-1">
                  <button
                    type="button"
                    onClick={handleResendVerificationEmail}
                    disabled={resendCooldown > 0}
                    className="text-[11px] font-bold uppercase tracking-wider text-amber-400 hover:text-amber-300 underline disabled:opacity-50 disabled:no-underline"
                  >
                    {resendCooldown > 0 ? `Resend email in ${resendCooldown}s` : 'Resend Verification Email'}
                  </button>
                  {resendEmailMsg && (
                    <span className="text-[11px] text-success font-mono">{resendEmailMsg}</span>
                  )}
                </div>
              </div>
            )}

            {(quizTitle || isFromQuiz) && (
              <div className="mb-6 p-5 rounded-2xl bg-gradient-to-br from-amber-500/15 via-surface to-amber-500/5 border border-amber-500/30 text-text-main shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-3 opacity-10 pointer-events-none text-amber-400">
                  <Trophy size={80} />
                </div>

                <div className="flex items-center gap-2 text-amber-400 font-mono text-[11px] uppercase tracking-widest font-bold mb-1.5">
                  <Sparkles size={14} className="animate-pulse" />
                  <span>Quiz Session Enrollment</span>
                </div>

                <h3 className="text-base sm:text-lg font-black text-white mb-2 leading-snug">
                  {quizTitle || 'Forensic Quiz Challenge'}
                </h3>

                <p className="text-xs sm:text-sm text-text-muted leading-relaxed mb-3 font-medium">
                  Please sign in or create an account to enroll for this quiz session, attempt the challenge, and record your progress on the live leaderboard.
                </p>

                <div className="flex flex-wrap items-center gap-2 pt-2.5 border-t border-white/10 text-xs">
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-black/40 border border-amber-500/20 text-amber-300 font-semibold">
                    <Calendar size={13} className="text-amber-400" />
                    <span>Session Date: {quizDateFormatted}</span>
                  </div>

                  {durationMinutes && (
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-black/40 border border-white/10 text-gray-300 font-medium">
                      <Clock size={13} className="text-amber-400" />
                      <span>{durationMinutes} Mins</span>
                    </div>
                  )}

                  {category && (
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-black/40 border border-white/10 text-gray-300 font-medium">
                      <Award size={13} className="text-amber-400" />
                      <span>{category}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tab switch mechanism: Sign In vs Create Account vs Admin */}
            <div className="flex border-b border-black/10 dark:border-white/5 mb-8">
              <button 
                onClick={() => {
                  setActiveTab('signin');
                  setAuthError('');
                  setAuthSuccess('');
                }}
                className={`flex-1 pb-4 text-xs sm:text-sm font-heading font-black uppercase tracking-widest transition-all relative ${
                  activeTab === 'signin' ? 'text-warning' : 'text-text-muted/60 hover:text-text-main'
                }`}
              >
                Sign In
                {activeTab === 'signin' && (
                  <motion.div layoutId="authTabUnderline" className="absolute bottom-0 left-0 right-0 h-[2px] bg-warning" />
                )}
              </button>
              <button 
                onClick={() => {
                  setActiveTab('signup');
                  setAuthError('');
                  setAuthSuccess('');
                }}
                className={`flex-1 pb-4 text-xs sm:text-sm font-heading font-black uppercase tracking-widest transition-all relative ${
                  activeTab === 'signup' ? 'text-warning' : 'text-text-muted/60 hover:text-text-main'
                }`}
              >
                Create Account
                {activeTab === 'signup' && (
                  <motion.div layoutId="authTabUnderline" className="absolute bottom-0 left-0 right-0 h-[2px] bg-warning" />
                )}
              </button>
              <button 
                onClick={() => {
                  setActiveTab('admin');
                  setAuthError('');
                  setAuthSuccess('');
                }}
                className={`flex-1 pb-4 text-xs sm:text-sm font-heading font-black uppercase tracking-widest transition-all relative ${
                  activeTab === 'admin' ? 'text-warning' : 'text-text-muted/60 hover:text-text-main'
                }`}
              >
                Admin
                {activeTab === 'admin' && (
                  <motion.div layoutId="authTabUnderline" className="absolute bottom-0 left-0 right-0 h-[2px] bg-warning" />
                )}
              </button>
            </div>

            {/* Error and Success alerts */}
            <AnimatePresence mode="wait">
              {authError && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="bg-red-500/10 border border-red-500/30 text-red-500 dark:text-red-400 px-4 py-3 rounded-lg text-xs flex items-start gap-2.5 mb-6 leading-relaxed w-full"
                >
                  <AlertCircle size={16} className="shrink-0 mt-0.5 animate-pulse" />
                  <div className="flex-1 min-w-0">
                    <span className="font-bold uppercase tracking-wider block mb-1">
                      {authError.includes('Lockout') 
                        ? "Brute-Force Rate Limiting Activated"
                        : authError === 'EMAIL_NOT_ENABLED' 
                        ? "Email Sign-in Disabled" 
                        : authError === 'UNAUTHORIZED_DOMAIN' 
                        ? "Unauthorized Domain for Social Login" 
                        : authError === 'LINKEDIN_NOT_ENABLED'
                        ? "LinkedIn Authentication Disabled"
                        : "Authentication Notice"}
                    </span>
                    <p>{authError}</p>
                  </div>
                </motion.div>
              )}

              {authSuccess && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="bg-success/10 border border-success/30 text-success px-4 py-3 rounded-lg text-xs flex items-start gap-2.5 mb-6 leading-relaxed"
                >
                  <CheckCircle size={16} className="shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold uppercase tracking-wider block mb-0.5 font-heading">Identity Secured</span>
                    {authSuccess}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Authentication Form */}
            <form onSubmit={handleAuthSubmit} className="space-y-4 mb-8">
              {activeTab === 'signup' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <label className="block text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1.5">
                    Profile Identifier (Full Name)
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-text-muted/50">
                      <UserIcon size={16} />
                    </span>
                    <input
                      type="text"
                      required
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="e.g. Dr. Aryan Roy"
                      className="w-full bg-base/50 text-text-main placeholder-text-muted/40 text-xs rounded-xl border border-black/15 dark:border-white/5 pl-10 pr-4 h-11 focus:outline-none focus:border-warning/50 transition-all font-mono"
                    />
                  </div>
                </motion.div>
              )}

              <div>
                <label className="block text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1.5">
                  {activeTab === 'admin' ? 'Administrator Email' : 'Email Address'}
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-text-muted/50">
                    <Mail size={16} />
                  </span>
                  <input
                    type="email"
                    required
                    value={simulatedEmail}
                    onChange={(e) => setSimulatedEmail(e.target.value)}
                    placeholder={activeTab === 'admin' ? 'forenclue@gmail.com' : 'investigator@forenclue.in'}
                    className="w-full bg-base/50 text-text-main placeholder-text-muted/40 text-xs rounded-xl border border-black/15 dark:border-white/5 pl-10 pr-4 h-11 focus:outline-none focus:border-warning/50 transition-all font-mono"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-[10px] font-bold text-text-muted uppercase tracking-widest">
                    Password Key
                  </label>
                  {activeTab === 'signin' && (
                    <button
                      type="button"
                      onClick={() => {
                        setResetEmail(simulatedEmail);
                        setResetErrorMsg('');
                        setResetSuccessMsg('');
                        setShowForgotPasswordModal(true);
                      }}
                      className="text-[10px] font-bold uppercase tracking-wider text-warning hover:underline cursor-pointer"
                    >
                      Forgot Password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-text-muted/50">
                    <Lock size={16} />
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={simulatedPassword}
                    onChange={(e) => setSimulatedPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-base/50 text-text-main placeholder-text-muted/40 text-xs rounded-xl border border-black/15 dark:border-white/5 pl-10 pr-10 h-11 focus:outline-none focus:border-warning/50 transition-all font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-text-muted hover:text-text-main cursor-pointer"
                    title={showPassword ? "Hide Password" : "Show Password"}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                {/* Password Strength Meter for Registration */}
                {activeTab === 'signup' && simulatedPassword.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-3 p-3 bg-base/80 rounded-xl border border-black/10 dark:border-white/5 space-y-2"
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono">
                      <span className="text-text-muted uppercase">Password Strength:</span>
                      <span className={`font-bold ${
                        passwordStrength.score >= 4 ? 'text-success' : passwordStrength.score >= 2 ? 'text-warning' : 'text-red-400'
                      }`}>
                        {passwordStrength.score >= 4 ? 'Strong (Approved)' : passwordStrength.score >= 2 ? 'Moderate' : 'Weak'}
                      </span>
                    </div>

                    {/* Visual Progress Bar */}
                    <div className="h-1.5 w-full bg-black/20 dark:bg-white/10 rounded-full overflow-hidden flex gap-1">
                      {[1, 2, 3, 4].map((step) => (
                        <div 
                          key={step} 
                          className={`flex-1 h-full rounded-full transition-all ${
                            step <= passwordStrength.score 
                              ? passwordStrength.score >= 4 
                                ? 'bg-success' 
                                : passwordStrength.score >= 2 
                                ? 'bg-warning' 
                                : 'bg-red-400' 
                              : 'bg-transparent'
                          }`} 
                        />
                      ))}
                    </div>

                    {/* Requirements Checklist */}
                    <div className="grid grid-cols-2 gap-1.5 pt-1 text-[10px]">
                      <div className={`flex items-center gap-1.5 ${passwordStrength.hasMinLength ? 'text-success' : 'text-text-muted'}`}>
                        <Check size={12} className={passwordStrength.hasMinLength ? 'text-success' : 'opacity-30'} />
                        <span>8+ Characters</span>
                      </div>
                      <div className={`flex items-center gap-1.5 ${passwordStrength.hasUpper && passwordStrength.hasLower ? 'text-success' : 'text-text-muted'}`}>
                        <Check size={12} className={passwordStrength.hasUpper && passwordStrength.hasLower ? 'text-success' : 'opacity-30'} />
                        <span>Upper & Lower</span>
                      </div>
                      <div className={`flex items-center gap-1.5 ${passwordStrength.hasNumber ? 'text-success' : 'text-text-muted'}`}>
                        <Check size={12} className={passwordStrength.hasNumber ? 'text-success' : 'opacity-30'} />
                        <span>Numbers (0-9)</span>
                      </div>
                      <div className={`flex items-center gap-1.5 ${passwordStrength.hasSpecial ? 'text-success' : 'text-text-muted'}`}>
                        <Check size={12} className={passwordStrength.hasSpecial ? 'text-success' : 'opacity-30'} />
                        <span>Special Symbol (!@#$)</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full h-11 bg-warning text-crust hover:bg-warning/90 font-heading font-black text-xs uppercase tracking-widest rounded-xl transition-all text-center flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-md shadow-warning/10"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-crust border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    {activeTab === 'signin' ? 'Verify Credentials' : activeTab === 'admin' ? 'Authorize Admin Portal' : 'Create Protected Account'}
                    <ArrowRight size={14} />
                  </>
                )}
              </button>
            </form>

            {/* Split lines/Or */}
            {activeTab !== 'admin' && (
              <>
                <div className="relative flex items-center justify-center mb-8">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-black/10 dark:border-white/5" />
                  </div>
                  <span className="px-3 bg-surface text-[10px] font-mono text-text-muted uppercase tracking-[0.25em] relative">
                    OR
                  </span>
                </div>

                {/* Social Authentication Engines */}
                <div className="space-y-3">
                  <motion.button 
                    type="button"
                    onClick={handleLinkedInLogin}
                    disabled={loading}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="w-full h-13 bg-[#0A66C2] hover:bg-[#084e96] text-white border border-blue-400/20 font-heading font-black text-xs sm:text-sm uppercase tracking-[0.18em] rounded-xl transition-all flex items-center justify-center gap-4 group shadow-xl shadow-blue-500/10 cursor-pointer disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                        </svg>
                        <span>
                          {activeTab === 'signin' ? 'Sign In with LinkedIn' : 'Register with LinkedIn'}
                        </span>
                        <ArrowRight size={18} className="group-hover:translate-x-1.5 transition-transform text-white/90" />
                      </>
                    )}
                  </motion.button>
                </div>
              </>
            )}
          </div>

        </motion.div>
      </div>

      {/* Embedded Terms alignment links */}
      <div className="absolute bottom-4 left-0 right-0 text-center z-10">
        <p className="text-[10px] text-text-muted/60 uppercase tracking-widest">
          By signing in above, you agree to our{' '}
          <Link to="/terms" className="text-warning/70 hover:text-warning transition-colors underline">Terms</Link>
          {' '}and{' '}
          <Link to="/privacy" className="text-warning/70 hover:text-warning transition-colors underline">Privacy Policy</Link>.
        </p>
      </div>

      {/* Forgot Password Reset Modal */}
      <AnimatePresence>
        {showForgotPasswordModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-surface border border-warning/40 max-w-md w-full rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden text-text-main"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-2xl bg-warning/15 border border-warning/30 flex items-center justify-center text-warning shrink-0">
                  <Key size={22} className="animate-pulse" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black font-heading uppercase tracking-wider text-white">
                    Reset Credentials
                  </h3>
                  <p className="text-[11px] font-mono text-text-muted">
                    Expiring Token & Verified Email Dispatch
                  </p>
                </div>
              </div>

              <p className="text-xs text-text-muted leading-relaxed mb-4">
                Enter your registered account email address. Firebase will generate a secure, expiring, single-use password reset token and dispatch it to your inbox.
              </p>

              {resetErrorMsg && (
                <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                  <AlertCircle size={15} className="shrink-0 animate-pulse" />
                  <span>{resetErrorMsg}</span>
                </div>
              )}

              {resetSuccessMsg && (
                <div className="mb-4 p-3 rounded-xl bg-success/10 border border-success/30 text-success text-xs flex items-center gap-2 leading-relaxed">
                  <CheckCircle size={15} className="shrink-0 mt-0.5" />
                  <span>{resetSuccessMsg}</span>
                </div>
              )}

              <form onSubmit={handleSendPasswordReset} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-text-muted mb-1.5">
                    Account Email Address
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-text-muted/50">
                      <Mail size={16} />
                    </span>
                    <input
                      type="email"
                      required
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      placeholder="investigator@forenclue.in"
                      className="w-full bg-base/80 text-text-main text-xs font-mono rounded-xl border border-warning/40 pl-10 pr-4 h-11 focus:outline-none focus:border-warning focus:ring-1 focus:ring-warning transition-all"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotPasswordModal(false)}
                    className="flex-1 h-11 bg-base border border-white/10 text-text-muted hover:text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                  >
                    Back to Login
                  </button>
                  <button
                    type="submit"
                    disabled={isSendingReset}
                    className="flex-1 h-11 bg-warning hover:bg-warning/90 text-black font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isSendingReset ? (
                      <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Send Reset Link</span>
                        <ArrowRight size={14} />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
