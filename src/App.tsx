/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Suspense, lazy, useEffect, useState } from 'react';
import { Routes, Route, useParams, Navigate, useLocation } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { ScrollToTop } from './components/layout/ScrollToTop';
import { FloatingWhatsAppButton } from './components/ui/FloatingWhatsAppButton';
import { motion, AnimatePresence } from 'motion/react';
import { SEO } from './components/layout/SEO';
import { getSEOForRoute } from './config/seo';

import { DesktopOnly } from './components/layout/DesktopOnly';
import { cn } from './lib/utils';

import { Loader2, WifiOff } from 'lucide-react';
import { 
  getCachedMaintenanceConfig, 
  subscribeMaintenanceConfig, 
  MaintenanceConfig 
} from './services/maintenanceService';

function GlobalSEO() {
  const location = useLocation();
  const seoConfig = getSEOForRoute(location.pathname);
  
  // Render SEO fallback for all routes. Explicit route SEO components will override this due to Helmet async.
  return <SEO {...seoConfig} canonicalPath={location.pathname} />;
}

function lazyWithRetry<T extends React.ComponentType<any>>(
  factory: () => Promise<{ default: T }>
) {
  return lazy(async () => {
    try {
      return await factory();
    } catch (error: any) {
      console.warn('Failed to load route chunk, attempting automatic reload...', error);
      const reloadedKey = 'chunk_error_reloaded';
      const lastReload = sessionStorage.getItem(reloadedKey);
      const now = Date.now();
      if (!lastReload || now - Number(lastReload) > 10000) {
        sessionStorage.setItem(reloadedKey, String(now));
        window.location.reload();
        return new Promise(() => {});
      }
      throw error;
    }
  });
}

const Home = lazyWithRetry(() => import('./pages/Home'));
const About = lazyWithRetry(() => import('./pages/About'));
const Courses = lazyWithRetry(() => import('./pages/Courses'));
const Cases = lazyWithRetry(() => import('./pages/Cases'));
const Careers = lazyWithRetry(() => import('./pages/Careers'));
const Services = lazyWithRetry(() => import('./pages/Services'));
const EBooks = lazyWithRetry(() => import('./pages/EBooks'));
const Files = lazyWithRetry(() => import('./pages/Files'));
const Contact = lazyWithRetry(() => import('./pages/Contact'));
const Profile = lazyWithRetry(() => import('./pages/Profile'));
const Podcast = lazyWithRetry(() => import('./pages/Podcast'));
const Dashboard = lazyWithRetry(() => import('./pages/Dashboard'));
const CoursePlayer = lazyWithRetry(() => import('./pages/CoursePlayer'));
const Login = lazyWithRetry(() => import('./pages/Login'));
const Admin = lazyWithRetry(() => import('./pages/Admin'));
const CertificateVerification = lazyWithRetry(() => import('./pages/CertificateVerification'));
const Webinar = lazyWithRetry(() => import('./pages/Webinar'));
const Employees = lazyWithRetry(() => import('./pages/Employees'));
const Volunteers = lazyWithRetry(() => import('./pages/Volunteers'));
const CampusAmbassadors = lazyWithRetry(() => import('./pages/CampusAmbassadors'));
const GoogleForms = lazyWithRetry(() => import('./pages/GoogleForms'));
const PrivacyPolicy = lazyWithRetry(() => import('./pages/PrivacyPolicy'));
const TermsOfService = lazyWithRetry(() => import('./pages/TermsOfService'));
const RefundPolicy = lazyWithRetry(() => import('./pages/RefundPolicy'));
const ShippingPolicy = lazyWithRetry(() => import('./pages/ShippingPolicy'));
const NotFound = lazyWithRetry(() => import('./pages/NotFound'));

const Webinars = lazyWithRetry(() => import('./pages/Webinar'));
const Simulations = lazyWithRetry(() => import('./pages/Simulations'));
const StereoMicroscopeLab = lazyWithRetry(() => import('./pages/StereoMicroscopeLab'));
const MicroscopeLab = lazyWithRetry(() => import('./pages/MicroscopeLab'));
const ComparisonMicroscopeLab = lazyWithRetry(() => import('./pages/ComparisonMicroscopeLab'));
const SpectrophotometerLab = lazyWithRetry(() => import('./pages/SpectrophotometerLab'));
const Quizzes = lazyWithRetry(() => import('./pages/Quizzes'));
const QuizPlayer = lazyWithRetry(() => import('./pages/QuizPlayer'));
const QuizLeaderboard = lazyWithRetry(() => import('./pages/QuizLeaderboard'));
const Colleges = lazyWithRetry(() => import('./pages/Colleges'));
const LinkedInCallback = lazyWithRetry(() => import('./pages/LinkedInCallback'));
const Maintenance = lazyWithRetry(() => import('./pages/Maintenance'));

function PageLoader() {
  return (
    <div className="flex h-[60vh] items-center justify-center">
      <Loader2 size={40} className="animate-spin text-warning" />
    </div>
  );
}

function RootShareResolver() {
  const { id } = useParams();
  const reserved = [
    'about', 'courses', 'cases', 'careers', 'services', 
    'ebooks', 'files', 'contact', 'privacy', 'terms', 'refund', 'refund-policy', 'cancellation-refund', 'return-policy', 'shipping', 'shipping-policy', 'profile', 'dashboard', 'login', 'admin', 'podcast', 'certificate', 'webinar', 'employees', 'volunteers', 'ambassadors', 'forms', 'simulations', 'colleges', 'college', 'api'
  ];
  if (id && reserved.includes(id.toLowerCase())) {
    return <Navigate to={`/${id}`} replace />;
  }
  return <Navigate to={`/ebooks?id=${id}`} replace />;
}

function AppMain() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <>
      <Navbar />
      <main className={cn("flex-grow", !isAdmin && "pt-20")}>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/cases" element={<Cases />} />
            <Route path="/cases/:slug" element={<Cases />} />
            <Route path="/case-studies/:slug" element={<Cases />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/services" element={<Services />} />
            <Route path="/ebooks" element={<EBooks />} />
            <Route path="/files" element={<Files />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/terms-and-conditions" element={<TermsOfService />} />
            <Route path="/refund-policy" element={<RefundPolicy />} />
            <Route path="/refund" element={<RefundPolicy />} />
            <Route path="/return-policy" element={<RefundPolicy />} />
            <Route path="/cancellation-refund" element={<RefundPolicy />} />
            <Route path="/shipping-policy" element={<ShippingPolicy />} />
            <Route path="/shipping" element={<ShippingPolicy />} />
            <Route path="/podcast" element={<Podcast />} />
            <Route path="/certificate" element={<CertificateVerification />} />
            <Route path="/webinar" element={<Webinar />} />
            <Route path="/employees" element={<Employees />} />
            <Route path="/volunteers" element={<Volunteers />} />
            <Route path="/ambassadors" element={<CampusAmbassadors />} />
            <Route path="/forms" element={<GoogleForms />} />
            <Route path="/simulations" element={<DesktopOnly><Simulations /></DesktopOnly>} />
            <Route path="/simulations/stereo-microscope" element={<DesktopOnly><StereoMicroscopeLab /></DesktopOnly>} />
            <Route path="/simulations/microscope" element={<DesktopOnly><MicroscopeLab /></DesktopOnly>} />
            <Route path="/simulations/comparison-microscope" element={<DesktopOnly><ComparisonMicroscopeLab /></DesktopOnly>} />
            <Route path="/simulations/spectrophotometer" element={<DesktopOnly><SpectrophotometerLab /></DesktopOnly>} />
            <Route path="/quizzes" element={<Quizzes />} />
            <Route path="/quizzes/:quizId" element={<QuizPlayer />} />
            <Route path="/quizzes/:quizId/leaderboard" element={<QuizLeaderboard />} />
            <Route path="/colleges" element={<Colleges />} />
            <Route path="/colleges/:id" element={<Colleges />} />
            <Route path="/college" element={<Colleges />} />
            <Route path="/college/:id" element={<Colleges />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/:userId" element={<Profile />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/api/auth/linkedin/callback" element={<LinkedInCallback />} />
            <Route path="/api/auth/linkedin/callback/" element={<LinkedInCallback />} />
            <Route path="/:id" element={<RootShareResolver />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </>
  );
}

export default function App() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [maintenanceConfig, setMaintenanceConfig] = useState<MaintenanceConfig>(getCachedMaintenanceConfig());
  const [isMaintenanceActive, setIsMaintenanceActive] = useState<boolean>(() => getCachedMaintenanceConfig().isActive);
  const [isBypassed, setIsBypassed] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    const hasParamBypass = params.get('bypass') === 'true' || params.get('preview') === 'true' || params.get('bypass') === 'maintenance';
    const hasStoredBypass = sessionStorage.getItem('forenclue_maintenance_bypass') === 'true';
    if (hasParamBypass) {
      sessionStorage.setItem('forenclue_maintenance_bypass', 'true');
    }
    return hasParamBypass || hasStoredBypass;
  });

  // Subscribe to real-time maintenance state from Firestore
  useEffect(() => {
    const unsub = subscribeMaintenanceConfig((config) => {
      setMaintenanceConfig(config);
      setIsMaintenanceActive(config.isActive);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleRevokeBypass = () => {
    sessionStorage.removeItem('forenclue_maintenance_bypass');
    setIsBypassed(false);
  };

  // If website is in maintenance mode and user hasn't authenticated bypass
  if (isMaintenanceActive && !isBypassed) {
    return (
      <div className="min-h-screen bg-[#ffffff] flex flex-col">
        <GlobalSEO />
        <Suspense fallback={<PageLoader />}>
          <Maintenance onBypass={() => setIsBypassed(true)} />
        </Suspense>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base flex flex-col">
      <GlobalSEO />

      {/* Staff Preview Bar when bypassing active maintenance */}
      {isMaintenanceActive && isBypassed && (
        <div className="bg-amber-500/90 text-black px-4 py-1.5 text-xs font-mono font-bold flex items-center justify-between z-[9999] shadow-md">
          <span className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-black animate-pulse" />
            STAFF PREVIEW MODE: Public visitors see Maintenance Screen
          </span>
          <button
            onClick={handleRevokeBypass}
            className="px-2.5 py-0.5 rounded bg-black/80 hover:bg-black text-white text-[11px] font-mono cursor-pointer transition-colors"
          >
            Re-engage Maintenance View
          </button>
        </div>
      )}

      <AnimatePresence>
        {isOffline && (
          <motion.div 
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            className="fixed top-0 left-0 right-0 z-[9999] bg-red-600 border-b border-red-500/50 flex items-center justify-center py-2 px-4 gap-3 shadow-lg"
          >
            <WifiOff size={16} className="text-text-main" />
            <span className="text-xs font-black uppercase tracking-widest text-text-main">Connection Lost. Operating in offline mode.</span>
          </motion.div>
        )}
      </AnimatePresence>
      <ScrollToTop />
      <FloatingWhatsAppButton />

      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/maintenance" element={<Maintenance onBypass={() => setIsBypassed(true)} />} />
          <Route path="/player/:courseId" element={<CoursePlayer />} />
          <Route path="*" element={<AppMain />} />
        </Routes>
      </Suspense>
    </div>
  );
}
