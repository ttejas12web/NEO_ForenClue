import { createContext, useContext, useEffect, useState, useCallback, useRef, ReactNode } from 'react';
import { 
  User, 
  onAuthStateChanged, 
  signInWithCustomToken, 
  signInAnonymously,
  signOut, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  updateProfile, 
  sendEmailVerification, 
  sendPasswordResetEmail,
  reload
} from 'firebase/auth';
import { auth, db } from '../lib/firebase';
import { doc, getDoc, setDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { Fingerprint, Search, ShieldAlert, Clock, X } from 'lucide-react';
import { 
  checkLoginRateLimit, 
  recordFailedLogin, 
  recordSuccessfulLogin, 
  checkPasswordResetRateLimit, 
  recordPasswordResetRequest, 
  checkEmailVerificationCooldown, 
  recordEmailVerificationSent,
  SESSION_INACTIVITY_LIMIT_MS
} from '../lib/security';

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  purchasedCourses: number[];
  bookmarks: number[];
  lessonBookmarks?: Record<string, string[]>;
  achievementTags: string[];
  progress: Record<string, any>;
  quizScores?: Record<string, Record<string, number>>;
  doubtsCount?: number;
  commentsCount?: number;
  careerSpeciality?: string | null;
  careerQuizAnswers?: string[] | null;
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  isQuizOnlyAdmin: boolean;
  accessToken: string | null;
  sessionExpiredNotice: boolean;
  clearSessionExpiredNotice: () => void;
  signInWithLinkedIn: () => Promise<void>;
  signUpWithEmail: (email: string, pass: string, name: string) => Promise<User>;
  signInWithEmail: (email: string, pass: string) => Promise<User>;
  sendVerificationEmail: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  reloadUser: () => Promise<void>;
  logout: () => Promise<void>;
  adminLogin?: (email: string, password: string) => Promise<boolean>;
}

export const adminEmails = [
  'ayushgaikwad7050@gmail.com', 
  'ayushgaikwad705o@gmail.com', 
  'mrunmayeebodhe118@gmail.com', 
  'webcreator500@gmail.com', 
  'forenclue@gmail.com', 
  'ttapse12@gmail.com',
  'purvabhawsar995@gmail.com'
];

export const quizOnlyAdminEmails = [
  'purvabhawsar995@gmail.com'
];

export const adminUids = [
  'PLvOz5Ah9CgKuhlhcNnIyVte0Dl1',
  'mz4nA7KKI5YiyvzrXMUQL6Nig7a2',
  'jfVmtdHZyJUN7DGrYZoWZXI9BRF2',
  'ePqdFRGvRVM8NMZX1zCLSC9ejGx2'
];

export const checkIsAdmin = (uid: string | null | undefined, email?: string | null): boolean => {
  if (email && adminEmails.map(e => e.toLowerCase()).includes(email.trim().toLowerCase())) return true;
  if (uid && adminUids.includes(uid)) return true;
  return false;
};

export const checkIsQuizOnlyAdmin = (email?: string | null): boolean => {
  if (!email) return false;
  return quizOnlyAdminEmails.map(e => e.toLowerCase()).includes(email.trim().toLowerCase());
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [sessionExpiredNotice, setSessionExpiredNotice] = useState(false);
  const lastActivityRef = useRef<number>(Date.now());

  // Inactivity timeout handler
  const handleInactivityLogout = useCallback(async () => {
    if (auth.currentUser) {
      console.warn("[Security] User session expired due to inactivity (>2h). Logging out securely.");
      try {
        await signOut(auth);
      } catch (err) {
        console.error("Error during inactivity signOut:", err);
      }
      setUser(null);
      setUserProfile(null);
      setSessionExpiredNotice(true);
    }
  }, []);

  // Track user activity to prevent premature session expiration during active usage
  useEffect(() => {
    const updateActivity = () => {
      lastActivityRef.current = Date.now();
    };

    const events = ['mousemove', 'keydown', 'touchstart', 'scroll', 'click'];
    events.forEach(event => window.addEventListener(event, updateActivity, { passive: true }));

    // Check inactivity every 60 seconds
    const interval = setInterval(() => {
      if (auth.currentUser) {
        const idleTime = Date.now() - lastActivityRef.current;
        if (idleTime > SESSION_INACTIVITY_LIMIT_MS) {
          handleInactivityLogout();
        }
      }
    }, 60000);

    return () => {
      events.forEach(event => window.removeEventListener(event, updateActivity));
      clearInterval(interval);
    };
  }, [handleInactivityLogout]);

  // Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        setUserProfile(null);
        setLoading(false);
      } else {
        lastActivityRef.current = Date.now();
      }
    }, (error) => {
      console.error("Auth change error:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const isAdmin = checkIsAdmin(user?.uid, user?.email);
  const isQuizOnlyAdmin = checkIsQuizOnlyAdmin(user?.email);

  // Profile Listener for authentic Firebase user
  useEffect(() => {
    if (!user) return;

    let unsubscribeProfile: (() => void) | null = null;

    const initProfile = async () => {
      const userRef = doc(db, 'users', user.uid);
      
      try {
        let exists = true;
        try {
          const userSnap = await getDoc(userRef);
          exists = userSnap.exists();
        } catch (e: any) {
          console.warn("Could not fetch initial profile, proceeding to listener:", e);
          exists = false;
        }
          
        if (!exists) {
          try {
            await setDoc(userRef, {
              uid: user.uid,
              email: user.email || '',
              displayName: user.displayName || 'Investigator',
              photoURL: user.photoURL || '',
              createdAt: serverTimestamp(),
              purchasedCourses: [],
              bookmarks: [],
              achievementTags: isAdmin ? ['Forenclue Administrator'] : ['Forensic Novice'],
              progress: {},
              doubtsCount: 0,
              commentsCount: 0
            });
          } catch (e) {
            console.warn("Could not create user profile:", e);
          }
        }

        // Setup real-time listener
        unsubscribeProfile = onSnapshot(userRef, (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            setUserProfile({
              ...data,
              purchasedCourses: data.purchasedCourses || []
            } as UserProfile);
          }
          setLoading(false);
        }, (error) => {
          console.error("Profile sync error:", error);
          if (!userProfile) {
            setUserProfile({
              uid: user.uid,
              email: user.email,
              displayName: user.displayName,
              photoURL: user.photoURL,
              purchasedCourses: [],
              bookmarks: [],
              achievementTags: isAdmin ? ['Forenclue Administrator'] : ['Forensic Novice'],
              progress: {},
              doubtsCount: 0,
              commentsCount: 0
            });
          }
          setLoading(false);
        });
      } catch (error) {
        console.error("Profile init error:", error);
        setLoading(false);
      }
    };

    initProfile();

    return () => {
      if (unsubscribeProfile) unsubscribeProfile();
    };
  }, [user, isAdmin]);

  // Safety Timeout for loading
  useEffect(() => {
    const timer = setTimeout(() => {
      if (loading) {
        console.warn("Auth initialization timed out. Forcing app to load.");
        setLoading(false);
      }
    }, 8000);

    return () => clearTimeout(timer);
  }, [loading]);

  const signInWithLinkedIn = async () => {
    return new Promise<void>((resolve, reject) => {
      const clientId = import.meta.env.VITE_LINKEDIN_CLIENT_ID || '86fnkfb4khjr8g';
      const protocol = window.location.protocol;
      const host = window.location.host;
      let origin = `${protocol}//${host}`;
      if (!host.includes('localhost') && !host.includes('127.0.0.1')) {
        origin = `https://${host}`;
      }
      
      const redirectUri = `${origin}/api/auth/linkedin/callback`;
      const randomState = Array.from(window.crypto.getRandomValues(new Uint8Array(16)))
        .map(b => b.toString(16).padStart(2, '0')).join('');
      const state = `${randomState}__${encodeURIComponent(redirectUri)}`;
      
      const scope = encodeURIComponent("openid profile email");
      const linkedinAuthUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}&scope=${scope}`;

      const width = 600;
      const height = 700;
      const left = window.screen.width / 2 - width / 2;
      const top = window.screen.height / 2 - height / 2;

      const popup = window.open(
        linkedinAuthUrl,
        'LinkedIn Authorization',
        `width=${width},height=${height},top=${top},left=${left},resizable=yes,scrollbars=yes`
      );

      if (!popup) {
        reject(new Error("The sign-in popup was blocked by your browser settings. Please allow popups for this site."));
        return;
      }

      let isSettled = false;

      const cleanup = () => {
        clearInterval(timer);
        window.removeEventListener('message', handleMessage);
      };

      const timer = setInterval(() => {
        if (popup.closed && !isSettled) {
          cleanup();
          isSettled = true;
          resolve();
        }
      }, 1000);

      const handleMessage = async (event: MessageEvent) => {
        if (event.data?.type === 'LINKEDIN_AUTH_SUCCESS') {
          if (isSettled) return;
          isSettled = true;
          cleanup();
          const { customToken, user: authUser, email } = event.data;
          try {
            if (customToken) {
              await signInWithCustomToken(auth, customToken);
              recordSuccessfulLogin('linkedin_oauth');
            } else if (authUser) {
              // Edge / serverless fallback without Admin customToken
              let activeFirebaseUser = auth.currentUser;
              if (!activeFirebaseUser) {
                try {
                  const anonCred = await signInAnonymously(auth);
                  activeFirebaseUser = anonCred.user;
                } catch (anonErr) {
                  console.warn("Anonymous sign-in fallback for LinkedIn:", anonErr);
                }
              }

              if (activeFirebaseUser) {
                try {
                  await updateProfile(activeFirebaseUser, {
                    displayName: authUser.displayName || 'LinkedIn User',
                    photoURL: authUser.photoURL || undefined
                  });
                } catch (profErr) {
                  console.warn("Could not update auth profile:", profErr);
                }

                try {
                  const userRef = doc(db, 'users', activeFirebaseUser.uid);
                  await setDoc(userRef, {
                    uid: activeFirebaseUser.uid,
                    email: authUser.email || email || activeFirebaseUser.email || '',
                    displayName: authUser.displayName || activeFirebaseUser.displayName || 'LinkedIn User',
                    photoURL: authUser.photoURL || activeFirebaseUser.photoURL || '',
                    provider: 'linkedin',
                    linkedinUid: authUser.uid,
                    updatedAt: serverTimestamp()
                  }, { merge: true });
                } catch (fsErr) {
                  console.warn("Could not merge Firestore profile:", fsErr);
                }
              }
              recordSuccessfulLogin('linkedin_oauth');
            }
            resolve();
          } catch (err: any) {
            console.error("Firebase custom auth error with LinkedIn:", err);
            reject(err);
          }
        } else if (event.data?.type === 'LINKEDIN_AUTH_ERROR') {
          if (isSettled) return;
          isSettled = true;
          cleanup();
          reject(new Error(event.data.error || 'LinkedIn authentication failed'));
        }
      };

      window.addEventListener('message', handleMessage);
    });
  };

  const reloadUser = async () => {
    if (auth.currentUser) {
      await reload(auth.currentUser);
      setUser({ ...auth.currentUser });
    }
  };

  const sendVerificationEmail = async () => {
    if (!auth.currentUser) {
      throw new Error("No active session. Please sign in to verify your email.");
    }
    const email = auth.currentUser.email || '';
    const rateCheck = checkEmailVerificationCooldown(email);
    if (!rateCheck.allowed) {
      throw new Error(`Verification email was recently dispatched. Please wait ${rateCheck.cooldownSeconds}s before resending.`);
    }

    await sendEmailVerification(auth.currentUser);
    recordEmailVerificationSent(email);
  };

  const signUpWithEmail = async (email: string, pass: string, name: string) => {
    const normalizedEmail = email.trim().toLowerCase();
    const rateCheck = checkLoginRateLimit(normalizedEmail);
    if (!rateCheck.allowed) {
      throw new Error(`Too many registration/auth requests. For security, please wait ${rateCheck.lockoutSeconds} seconds.`);
    }

    try {
      const result = await createUserWithEmailAndPassword(auth, normalizedEmail, pass);
      await updateProfile(result.user, {
        displayName: name.trim() || 'Investigator'
      });
      
      try {
        await sendEmailVerification(result.user);
        recordEmailVerificationSent(normalizedEmail);
      } catch (e) {
        console.warn("Email verification send warning:", e);
      }

      const userRef = doc(db, 'users', result.user.uid);
      await setDoc(userRef, {
        uid: result.user.uid,
        email: result.user.email || normalizedEmail,
        displayName: name.trim() || 'Investigator',
        photoURL: '',
        createdAt: serverTimestamp(),
        purchasedCourses: [],
        bookmarks: [],
        achievementTags: ['Forensic Novice'],
        progress: {},
        doubtsCount: 0,
        commentsCount: 0
      });

      recordSuccessfulLogin(normalizedEmail);
      lastActivityRef.current = Date.now();
      return result.user;
    } catch (error: any) {
      recordFailedLogin(normalizedEmail);
      console.error("Error signing up with email and password: ", error);
      throw error;
    }
  };

  const signInWithEmail = async (email: string, pass: string) => {
    const normalizedEmail = email.trim().toLowerCase();
    
    // Check client rate limiting (Brute-force protection)
    const rateCheck = checkLoginRateLimit(normalizedEmail);
    if (!rateCheck.allowed) {
      throw new Error(`Security Lockout: Too many failed login attempts for this account. Please wait ${rateCheck.lockoutSeconds} seconds before trying again.`);
    }

    try {
      const result = await signInWithEmailAndPassword(auth, normalizedEmail, pass);
      recordSuccessfulLogin(normalizedEmail);
      lastActivityRef.current = Date.now();
      return result.user;
    } catch (error: any) {
      const failed = recordFailedLogin(normalizedEmail);
      console.warn(`Sign-in failed for ${normalizedEmail}. Remaining attempts: ${failed.remainingAttempts}`);
      if (!failed.allowed) {
        throw new Error(`Account locked for security. Too many invalid attempts. Please wait ${failed.lockoutSeconds} seconds.`);
      }
      throw error;
    }
  };

  const sendPasswordReset = async (email: string) => {
    const normalizedEmail = email.trim().toLowerCase();
    const rateCheck = checkPasswordResetRateLimit(normalizedEmail);
    if (!rateCheck.allowed) {
      throw new Error(rateCheck.reason || `Please wait ${rateCheck.cooldownSeconds}s before requesting another reset.`);
    }

    try {
      await sendPasswordResetEmail(auth, normalizedEmail);
      recordPasswordResetRequest(normalizedEmail);
    } catch (error: any) {
      console.error("Error sending password reset email: ", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setUserProfile(null);
      setAccessToken(null);
      lastActivityRef.current = Date.now();
    } catch (error) {
      console.error("Error signing out: ", error);
      throw error;
    }
  };

  const adminLogin = async (email: string, password: string): Promise<boolean> => {
    const normalizedEmail = email.trim().toLowerCase();
    
    // Check rate limiter for admin endpoint
    const rateCheck = checkLoginRateLimit(normalizedEmail);
    if (!rateCheck.allowed) {
      throw new Error(`Administrator Access Locked: Too many failed attempts. Cooldown: ${rateCheck.lockoutSeconds} seconds.`);
    }

    try {
      const result = await signInWithEmailAndPassword(auth, normalizedEmail, password);
      
      // Verify user has authorized admin status
      const isUserAdmin = checkIsAdmin(result.user.uid, result.user.email) || checkIsQuizOnlyAdmin(result.user.email);
      
      if (!isUserAdmin) {
        // Immediately revoke and sign out unauthorized user attempting admin access
        await signOut(auth);
        recordFailedLogin(normalizedEmail);
        throw new Error("Access Denied: Your account is not authorized with Administrator privileges.");
      }

      recordSuccessfulLogin(normalizedEmail);
      lastActivityRef.current = Date.now();
      return true;
    } catch (err: any) {
      recordFailedLogin(normalizedEmail);
      console.error("Admin authentication rejected:", err?.message || err);
      throw err;
    }
  };

  const clearSessionExpiredNotice = () => setSessionExpiredNotice(false);

  return (
    <AuthContext.Provider value={{ 
      user, 
      userProfile, 
      loading, 
      isAdmin, 
      isQuizOnlyAdmin, 
      accessToken, 
      sessionExpiredNotice,
      clearSessionExpiredNotice,
      signInWithLinkedIn, 
      signUpWithEmail, 
      signInWithEmail, 
      sendVerificationEmail, 
      sendPasswordReset, 
      reloadUser,
      logout, 
      adminLogin 
    }}>
      {/* Session Expired Security Banner */}
      <AnimatePresence>
        {sessionExpiredNotice && (
          <motion.div 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-50 max-w-md w-[90%] bg-surface border border-red-500/40 rounded-2xl p-4 shadow-2xl backdrop-blur-xl flex items-center gap-3 text-text-main"
          >
            <div className="p-2.5 rounded-xl bg-red-500/10 text-red-500">
              <Clock size={20} />
            </div>
            <div className="flex-1 text-xs">
              <p className="font-bold text-red-400">Session Expired</p>
              <p className="text-text-muted mt-0.5">Your session was safely closed due to 2 hours of inactivity. Please sign in again.</p>
            </div>
            <button 
              onClick={clearSessionExpiredNotice}
              className="p-1 text-text-muted hover:text-text-main rounded-lg"
              title="Dismiss"
            >
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div 
            key="loader"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen bg-crust flex flex-col items-center justify-center relative overflow-hidden"
          >
            {/* Background Grid Pattern */}
            <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #00f0ff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
            
            <div className="relative w-40 h-40 md:w-64 md:h-64 flex items-center justify-center">
              {/* Spinning Hexagon Ring */}
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border-[1px] border-warning/20 rounded-full"
              />
              <motion.div 
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute inset-4 border-[1px] border-warning/10 rounded-full"
              />

              {/* Forensic Icons Staggered */}
              <div className="relative">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0.5 }}
                  animate={{ 
                    scale: [0.8, 1.1, 0.8],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="bg-warning/10 p-4 md:p-6 rounded-2xl border border-warning/30 backdrop-blur-sm relative z-10"
                >
                  <Fingerprint size={32} className="text-warning md:hidden" />
                  <Fingerprint size={48} className="text-warning hidden md:block" />
                </motion.div>

                {/* Scanning Bar Animation */}
                <motion.div 
                  animate={{ top: ['0%', '100%', '0%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="absolute left-[-10%] right-[-10%] h-[2px] bg-warning shadow-[0_0_15px_#00f0ff] z-20 opacity-50"
                />
              </div>

              {/* Orbiting Elements */}
              {[...Array(4)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ 
                    rotate: 360,
                  }}
                  transition={{ 
                    duration: 4 + i, 
                    repeat: Infinity, 
                    ease: "linear" 
                  }}
                  className="absolute inset-0 flex items-start justify-center"
                >
                  <motion.div 
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                    className="w-1 md:w-1.5 h-1 md:h-1.5 bg-warning rounded-full shadow-[0_0_8px_#00f0ff]"
                  />
                </motion.div>
              ))}
            </div>

            <div className="mt-8 md:mt-12 flex flex-col items-center gap-4">
              <div className="flex items-center gap-3">
                <Search size={18} className="text-warning animate-pulse md:size-5" />
                <motion.p 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-text-main font-heading font-black text-xl md:text-2xl uppercase tracking-[0.3em]"
                >
                  Investigating<span className="animate-pulse">...</span>
                </motion.p>
              </div>
            </div>

          </motion.div>
        ) : (
          <motion.div 
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col min-h-screen"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
