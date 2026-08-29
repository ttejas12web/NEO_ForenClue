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
import { Clock, X } from 'lucide-react';
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
  signInWithCustomFirebaseToken: (customToken: string) => Promise<User>;
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

  const completeLinkedInAuthentication = useCallback(async (data: any) => {
    const { customToken, tempPassword, authEmail, user: authUser, email } = data || {};

    if (customToken) {
      await signInWithCustomToken(auth, customToken);
      recordSuccessfulLogin('linkedin_oauth');
      return;
    }

    if (!authUser) {
      throw new Error('LinkedIn did not return a valid ForenClue identity.');
    }

    let activeFirebaseUser = auth.currentUser;
    if (!activeFirebaseUser && authEmail && tempPassword) {
      const linkedInCredential = await signInWithEmailAndPassword(auth, authEmail, tempPassword);
      activeFirebaseUser = linkedInCredential.user;
    }

    // Retained only for deployments that still have anonymous auth enabled.
    if (!activeFirebaseUser) {
      try {
        const anonCred = await signInAnonymously(auth);
        activeFirebaseUser = anonCred.user;
      } catch (anonErr) {
        console.warn('Anonymous sign-in fallback for LinkedIn:', anonErr);
      }
    }

    if (!activeFirebaseUser) {
      throw new Error('ForenClue could not establish the Firebase session for this LinkedIn account.');
    }

    try {
      await updateProfile(activeFirebaseUser, {
        displayName: authUser.displayName || 'LinkedIn User',
        photoURL: authUser.photoURL || undefined
      });
    } catch (profErr) {
      console.warn('Could not update auth profile:', profErr);
    }

    try {
      const userRef = doc(db, 'users', activeFirebaseUser.uid);
      await setDoc(userRef, {
        uid: activeFirebaseUser.uid,
        email: authUser.email || email || activeFirebaseUser.email || '',
        displayName: authUser.displayName || activeFirebaseUser.displayName || 'LinkedIn User',
        photoURL: authUser.photoURL || activeFirebaseUser.photoURL || '',
        provider: 'linkedin',
        linkedinUid: authUser.linkedinUid || authUser.uid,
        updatedAt: serverTimestamp()
      }, { merge: true });
    } catch (fsErr) {
      console.warn('Could not merge Firestore profile:', fsErr);
    }

    recordSuccessfulLogin('linkedin_oauth');
  }, []);

  // Complete a same-tab LinkedIn redirect after the callback returns to /login.
  useEffect(() => {
    const storageKey = 'forenclue:linkedin-auth-result';
    const stateKey = 'forenclue:linkedin-oauth-state';
    let rawValue: string | null = null;

    try {
      rawValue = window.sessionStorage.getItem(storageKey) || window.localStorage.getItem(storageKey);
    } catch (_) {}
    if (!rawValue) return;

    const completeStoredResult = async () => {
      try {
        const stored = JSON.parse(rawValue);
        const createdAt = Number(stored?.createdAt || 0);
        const payload = stored?.payload;
        const expectedState = window.sessionStorage.getItem(stateKey);

        if (!createdAt || Date.now() - createdAt > 5 * 60 * 1000) {
          throw new Error('The LinkedIn sign-in response expired. Please try again.');
        }
        if (expectedState && payload?.state !== expectedState) {
          throw new Error('LinkedIn sign-in state verification failed. Please try again.');
        }
        if (payload?.type !== 'LINKEDIN_AUTH_SUCCESS') {
          throw new Error(payload?.error || 'LinkedIn authentication failed.');
        }

        await completeLinkedInAuthentication(payload);
      } catch (error) {
        console.error('LinkedIn redirect completion failed:', error);
      } finally {
        try {
          window.sessionStorage.removeItem(storageKey);
          window.sessionStorage.removeItem(stateKey);
          window.localStorage.removeItem(storageKey);
        } catch (_) {}
        if (window.location.search.includes('linkedin=complete')) {
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      }
    };

    void completeStoredResult();
  }, [completeLinkedInAuthentication]);

  const signInWithLinkedIn = async () => {
    return new Promise<void>((resolve, reject) => {
      const storageKey = 'forenclue:linkedin-auth-result';
      const clientId = import.meta.env.VITE_LINKEDIN_CLIENT_ID || '86fnkfb4khjr8g';
      const origin = window.location.origin;
      const redirectUri = `${origin}/api/auth/linkedin/callback`;
      const randomState = Array.from(window.crypto.getRandomValues(new Uint8Array(16)))
        .map(b => b.toString(16).padStart(2, '0')).join('');
      const state = `${randomState}__${encodeURIComponent(redirectUri)}`;
      
      const scope = encodeURIComponent("openid profile email");
      const linkedinAuthUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}&scope=${scope}`;

      try {
        window.localStorage.removeItem(storageKey);
        window.sessionStorage.removeItem(storageKey);
      } catch (_) {}

      // LinkedIn can sever popup opener communication in Safari on custom domains.
      // A same-tab round trip preserves the OAuth result and Firebase session setup.
      if (window.location.hostname === 'forenclue.in' || window.location.hostname === 'www.forenclue.in') {
        try {
          window.sessionStorage.setItem('forenclue:linkedin-oauth-state', state);
        } catch (_) {}
        window.location.assign(linkedinAuthUrl);
        return;
      }

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
      let timeoutTimer: number | undefined;
      let storagePollTimer: number | undefined;

      const cleanup = () => {
        if (timeoutTimer !== undefined) window.clearTimeout(timeoutTimer);
        if (storagePollTimer !== undefined) window.clearInterval(storagePollTimer);
        window.removeEventListener('message', handleMessage);
        window.removeEventListener('storage', handleStorage);
      };

      const fail = (message: string) => {
        if (isSettled) return;
        isSettled = true;
        cleanup();
        reject(new Error(message));
      };

      timeoutTimer = window.setTimeout(() => {
        try {
          popup.close();
        } catch (_) {}
        fail('LinkedIn sign-in timed out. Please try again.');
      }, 5 * 60 * 1000);

      const handleAuthResult = async (data: any) => {
        if (data?.state !== state) return;

        try {
          window.localStorage.removeItem(storageKey);
        } catch (_) {}

        if (data?.type === 'LINKEDIN_AUTH_SUCCESS') {
          if (isSettled) return;
          isSettled = true;
          cleanup();
          try {
            await completeLinkedInAuthentication(data);
            resolve();
          } catch (err: any) {
            console.error("Firebase custom auth error with LinkedIn:", err);
            reject(err);
          }
        } else if (data?.type === 'LINKEDIN_AUTH_ERROR') {
          fail(data.error || 'LinkedIn authentication failed');
        }
      };

      const handleMessage = (event: MessageEvent) => {
        if (event.origin !== origin || event.data?.state !== state) return;
        void handleAuthResult(event.data);
      };

      const handleStorage = (event: StorageEvent) => {
        if (event.key !== storageKey || !event.newValue) return;

        consumeStoredResult(event.newValue);
      };

      const consumeStoredResult = (rawValue: string | null) => {
        if (!rawValue || isSettled) return;

        try {
          const stored = JSON.parse(rawValue);
          const createdAt = Number(stored?.createdAt || 0);
          if (!createdAt || Date.now() - createdAt > 5 * 60 * 1000) {
            window.localStorage.removeItem(storageKey);
            return;
          }
          void handleAuthResult(stored.payload);
        } catch (_) {
          // Ignore malformed or unrelated local storage values.
        }
      };

      try {
        window.localStorage.removeItem(storageKey);
      } catch (_) {}
      window.addEventListener('message', handleMessage);
      window.addEventListener('storage', handleStorage);
      // Safari can suppress the storage event after a cross-origin OAuth popup
      // severs its opener. Polling the same-origin handoff makes completion reliable.
      storagePollTimer = window.setInterval(() => {
        try {
          consumeStoredResult(window.localStorage.getItem(storageKey));
        } catch (_) {}
      }, 350);
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

  const signInWithCustomFirebaseToken = async (customToken: string) => {
    try {
      const result = await signInWithCustomToken(auth, customToken);
      if (result.user.email) {
        recordSuccessfulLogin(result.user.email);
      }
      lastActivityRef.current = Date.now();
      return result.user;
    } catch (error: any) {
      console.error("Error signing in with custom token:", error);
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
      signInWithCustomFirebaseToken,
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

      {/*
        Authentication initializes in the background. Public content must not be
        hidden behind Firebase because search and AdSense crawlers may snapshot
        the page before the auth request finishes (or when that request fails).
        Protected components can continue to use the exposed `loading` state.
      */}
      <div className="flex flex-col min-h-screen">
        {children}
      </div>
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
