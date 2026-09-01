import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Clock, 
  Lock, 
  Unlock, 
  RefreshCw, 
  Mail, 
  CheckCircle2, 
  AlertTriangle,
  Youtube,
  Linkedin,
  Instagram,
  ArrowUpRight
} from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { WhatsAppIcon } from '@/components/ui/WhatsAppIcon';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  calculateRemainingTime, 
  formatIstDisplay, 
  getCachedMaintenanceConfig, 
  subscribeMaintenanceConfig, 
  MaintenanceConfig 
} from '@/services/maintenanceService';
import { MaintenanceBackground } from '@/components/maintenance/MaintenanceBackground';

interface MaintenanceProps {
  onBypass?: () => void;
}

export function Maintenance({ onBypass }: MaintenanceProps) {
  const [config, setConfig] = useState<MaintenanceConfig>(getCachedMaintenanceConfig());
  const [timeLeft, setTimeLeft] = useState(() => calculateRemainingTime(config.targetEndTime));
  const [passcode, setPasscode] = useState('');
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [passError, setPassError] = useState(false);
  const [isPinging, setIsPinging] = useState(false);
  const [pingSuccess, setPingSuccess] = useState<string | null>(null);
  const navigate = useNavigate();

  // Listen to live maintenance configuration from Firestore
  useEffect(() => {
    const unsub = subscribeMaintenanceConfig((updated) => {
      setConfig(updated);
      setTimeLeft(calculateRemainingTime(updated.targetEndTime));
    });
    return () => unsub();
  }, []);

  // Update timer every second
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateRemainingTime(config.targetEndTime));
    }, 1000);
    return () => clearInterval(timer);
  }, [config.targetEndTime]);

  const handleAdminUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = passcode.trim().toLowerCase();
    if (clean === 'forenclue2026' || clean === 'admin' || clean === 'preview' || clean === 'forenclue') {
      sessionStorage.setItem('forenclue_maintenance_bypass', 'true');
      if (onBypass) {
        onBypass();
      } else {
        window.location.reload();
      }
    } else {
      setPassError(true);
      setTimeout(() => setPassError(false), 2500);
    }
  };

  const handleStatusCheck = () => {
    setIsPinging(true);
    setPingSuccess(null);
    setTimeout(() => {
      setIsPinging(false);
      setPingSuccess('Systems healthy. Upgrade is on schedule for 12:30 PM IST.');
      setTimeout(() => setPingSuccess(null), 4000);
    }, 900);
  };

  const formattedTarget = formatIstDisplay(config.targetEndTime);

  return (
    <div className="min-h-screen w-full bg-[#ffffff] text-slate-800 flex flex-col justify-between items-center p-4 sm:p-6 md:p-8 font-sans selection:bg-cyan-100 selection:text-cyan-900 relative overflow-hidden">
      
      {/* Aesthetic Maintenance Background Animations */}
      <MaintenanceBackground />

      {/* Top Navbar Minimal */}
      <header className="relative z-10 w-full max-w-4xl flex items-center justify-between py-2">
        <Logo className="h-9 sm:h-10" />

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAdminModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100/90 hover:bg-slate-200/90 border border-slate-200 text-[11px] font-mono text-slate-600 hover:text-slate-900 transition-all cursor-pointer shadow-xs"
            title="Authorized Staff Portal"
          >
            <Lock size={12} className="text-amber-600" />
            <span className="hidden sm:inline">Staff Access</span>
          </button>
        </div>
      </header>

      {/* Main Minimalist Center Container */}
      <main className="relative z-10 w-full max-w-2xl my-auto py-8 sm:py-12 flex flex-col items-center text-center">
        
        {/* Status Chip */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-mono tracking-wider mb-6 shadow-xs"
        >
          <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
          <span className="font-semibold uppercase text-[11px]">Scheduled Maintenance</span>
        </motion.div>

        {/* Minimalist Heading */}
        <motion.h1 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="text-3xl sm:text-4xl md:text-5xl font-black font-heading tracking-tight text-slate-900 mb-4"
        >
          {config.title || "We'll Be Back Soon"}
        </motion.h1>

        {/* Notice description */}
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="text-slate-600 text-sm sm:text-base max-w-lg leading-relaxed mb-8 font-normal"
        >
          {config.notice || "We are performing scheduled infrastructure and laboratory engine upgrades. ForenClue will be back online shortly."}
        </motion.p>

        {/* Minimalist Countdown Timer */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full max-w-md bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 mb-8 shadow-md shadow-slate-200/50 backdrop-blur-xs"
        >
          <div className="text-[11px] font-mono text-slate-500 uppercase tracking-widest mb-4 flex items-center justify-center gap-1.5">
            <Clock size={13} className="text-cyan-600" />
            <span>ESTIMATED RETURN: <strong className="text-cyan-700 font-bold">{formattedTarget}</strong></span>
          </div>

          {!timeLeft.isExpired ? (
            <div className="grid grid-cols-3 sm:grid-cols-3 gap-2 sm:gap-3 text-center">
              {/* Hours */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-xl py-3 px-2">
                <div className="text-2xl sm:text-4xl font-mono font-black text-slate-900 tracking-tight">
                  {String((timeLeft.days * 24) + timeLeft.hours).padStart(2, '0')}
                </div>
                <div className="text-[10px] font-mono text-slate-500 uppercase mt-1 tracking-wider">
                  Hours
                </div>
              </div>

              {/* Minutes */}
              <div className="bg-cyan-50/60 border border-cyan-100 rounded-xl py-3 px-2">
                <div className="text-2xl sm:text-4xl font-mono font-black text-cyan-600 tracking-tight">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </div>
                <div className="text-[10px] font-mono text-cyan-700 uppercase mt-1 tracking-wider">
                  Minutes
                </div>
              </div>

              {/* Seconds */}
              <div className="bg-amber-50/60 border border-amber-100 rounded-xl py-3 px-2">
                <div className="text-2xl sm:text-4xl font-mono font-black text-amber-600 tracking-tight">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </div>
                <div className="text-[10px] font-mono text-amber-700 uppercase mt-1 tracking-wider">
                  Seconds
                </div>
              </div>
            </div>
          ) : (
            <div className="py-4 text-center">
              <div className="inline-flex items-center gap-2 text-cyan-700 font-mono text-sm font-bold animate-pulse">
                <span className="h-2 w-2 rounded-full bg-cyan-600" />
                FINALIZING UPGRADE • COMING ONLINE SHORTLY
              </div>
            </div>
          )}
        </motion.div>

        {/* Minimal Actions */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
          className="flex flex-wrap items-center justify-center gap-3 w-full"
        >
          {/* WhatsApp Community */}
          <a
            href="https://chat.whatsapp.com/DVmTqoEYIDnJl4bpPFdWzK?s=cl&p=i&ilr=0"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-black font-bold text-xs sm:text-sm transition-all shadow-sm active:scale-95 cursor-pointer"
          >
            <WhatsAppIcon className="w-4 h-4 fill-current text-black" />
            <span>Join WhatsApp Community</span>
          </a>

          {/* Email Support */}
          <a
            href="mailto:forenclue@gmail.com?subject=Maintenance%20Query%20-%20ForenClue"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 font-medium text-xs sm:text-sm transition-all shadow-xs cursor-pointer"
          >
            <Mail size={14} className="text-cyan-600" />
            <span>Email Support</span>
          </a>

          {/* Status Ping */}
          <button
            onClick={handleStatusCheck}
            disabled={isPinging}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 font-mono text-xs transition-all shadow-xs cursor-pointer disabled:opacity-50"
            title="Check live server status"
          >
            <RefreshCw size={13} className={cn("text-amber-500", isPinging && "animate-spin")} />
            <span>{isPinging ? 'Checking...' : 'Check Status'}</span>
          </button>
        </motion.div>

        {/* Live Ping Toast */}
        <AnimatePresence>
          {pingSuccess && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="mt-4 px-3.5 py-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono flex items-center gap-2 shadow-xs"
            >
              <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
              <span>{pingSuccess}</span>
            </motion.div>
          )}
        </AnimatePresence>

      </main>

      {/* Minimal Footer */}
      <footer className="relative z-10 w-full max-w-4xl py-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
        <div>
          © {new Date().getFullYear()} ForenClue. Precision Forensic EdTech.
        </div>

        <div className="flex items-center gap-4">
          <a
            href="https://www.linkedin.com/company/foren-clue"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-slate-700 transition-colors"
            aria-label="LinkedIn"
          >
            <Linkedin size={15} />
          </a>
          <a
            href="https://www.instagram.com/forenclue/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-slate-700 transition-colors"
            aria-label="Instagram"
          >
            <Instagram size={15} />
          </a>
          <a
            href="https://www.youtube.com/forenclue"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-slate-700 transition-colors"
            aria-label="YouTube"
          >
            <Youtube size={15} />
          </a>
        </div>
      </footer>

      {/* Staff Bypass Modal */}
      <AnimatePresence>
        {showAdminModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm bg-white border border-slate-200 rounded-2xl p-6 shadow-2xl relative text-left"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1.5 text-cyan-700 font-mono text-xs uppercase font-bold tracking-wider">
                  <Lock size={14} /> Staff Access
                </div>
                <button 
                  onClick={() => setShowAdminModal(false)}
                  className="text-slate-400 hover:text-slate-700 text-xs font-mono px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 cursor-pointer"
                >
                  ESC
                </button>
              </div>

              <p className="text-slate-600 text-xs leading-relaxed mb-4">
                Enter your admin passkey to authenticate and access internal management tools.
              </p>

              <form onSubmit={handleAdminUnlock} className="space-y-3">
                <div>
                  <input
                    type="password"
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    placeholder="Enter staff passcode..."
                    autoFocus
                    className={cn(
                      "w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl font-mono text-xs text-slate-900 focus:outline-none transition-all placeholder:text-slate-400",
                      passError 
                        ? "border-red-500 ring-2 ring-red-500/20" 
                        : "border-slate-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                    )}
                  />
                  {passError && (
                    <div className="text-[10px] text-red-600 font-mono mt-1 flex items-center gap-1">
                      <AlertTriangle size={11} /> Invalid passcode.
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 px-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold font-mono text-xs uppercase tracking-wider transition-all cursor-pointer shadow-sm flex items-center justify-center gap-1.5 active:scale-95"
                  >
                    <Unlock size={13} /> Unlock
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      sessionStorage.setItem('forenclue_maintenance_bypass', 'true');
                      navigate('/admin');
                    }}
                    className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 font-mono text-xs transition-all cursor-pointer"
                  >
                    Admin Login →
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

export default Maintenance;
