import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, onAuthStateChanged, signInWithCustomToken, signOut, OAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, sendEmailVerification, sendPasswordResetEmail } from 'firebase/auth';
import { auth, db } from '../lib/firebase';
import { doc, getDoc, setDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { Fingerprint, Search, ShieldCheck, Activity } from 'lucide-react';

interface UserProfile {
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
  signInWithLinkedIn: () => Promise<void>;
  signUpWithEmail: (email: string, pass: string, name: string) => Promise<User>;
  signInWithEmail: (email: string, pass: string) => Promise<User>;
  sendVerificationEmail: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
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
  'ePqdFRGvRVM8NMZX1zCLSC9ejGx2',
  'admin_purvabhawsar995',
  'admin_forenclue',
  'manual_admin'
];

export const getAssignedUidForEmail = (email?: string | null, firebaseUser?: User | null): string => {
  if (firebaseUser?.uid) return firebaseUser.uid;
  if (!email) return 'manual_admin';
  const normalized = email.trim().toLowerCase();
  if (normalized === 'purvabhawsar995@gmail.com') return 'admin_purvabhawsar995';
  if (normalized === 'forenclue@gmail.com') return 'admin_forenclue';
  return `admin_${normalized.replace(/[^a-z0-9]/g, '_')}`;
};

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

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [manualAdmin, setManualAdmin] = useState<{ email: string; displayName: string } | null>(() => {
    try {
      const saved = localStorage.getItem('manualAdmin') || sessionStorage.getItem('manualAdmin');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        setUserProfile(null);
        setLoading(false);
      }
    }, (error) => {
      console.error("Auth change error:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Manual User state (session-only)
  const [manualUser, setManualUser] = useState<{ email: string; displayName: string; uid: string; photoURL?: string } | null>(() => {
    try {
      const saved = localStorage.getItem('manualUser') || sessionStorage.getItem('manualUser');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const handleSetManualUser = (usr: typeof manualUser) => {
    setManualUser(usr);
    if (usr) {
      localStorage.setItem('manualUser', JSON.stringify(usr));
      sessionStorage.setItem('manualUser', JSON.stringify(usr));
    } else {
      localStorage.removeItem('manualUser');
      sessionStorage.removeItem('manualUser');
    }
  };

  const assignedUid = user?.uid || (manualAdmin ? getAssignedUidForEmail(manualAdmin.email, user) : 'manual_admin');

  const effectiveUser = manualAdmin 
    ? { email: manualAdmin.email, uid: assignedUid, displayName: manualAdmin.displayName } as any 
    : manualUser
    ? { email: manualUser.email, uid: manualUser.uid, displayName: manualUser.displayName, photoURL: manualUser.photoURL } as any
    : user;

  const effectiveUserProfile = manualAdmin
    ? {
        uid: assignedUid,
        email: manualAdmin.email,
        displayName: manualAdmin.displayName,
        photoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
        purchasedCourses: [],
        bookmarks: [],
        achievementTags: ['Forenclue Administrator'],
        progress: {},
        doubtsCount: 0,
        commentsCount: 0
      } as UserProfile
    : manualUser
    ? (userProfile || {
        uid: manualUser.uid,
        email: manualUser.email,
        displayName: manualUser.displayName,
        photoURL: manualUser.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
        purchasedCourses: [],
        bookmarks: [],
        achievementTags: ['Forensic Novice'],
        progress: {},
        doubtsCount: 0,
        commentsCount: 0
      } as UserProfile)
    : userProfile;

  const isAdmin = checkIsAdmin(effectiveUser?.uid, effectiveUser?.email);
  const isQuizOnlyAdmin = checkIsQuizOnlyAdmin(effectiveUser?.email);

  // Profile Listener linked to effectiveUser so simulated accounts sync fully with Firestore
  useEffect(() => {
    if (!effectiveUser) return;

    let unsubscribeProfile: (() => void) | null = null;

    const initProfile = async () => {
      const userRef = doc(db, 'users', effectiveUser.uid);
      
      try {
        let exists = true; // Assume exists by default to avoid overwriting if fetch fails
        try {
          // Try getting from cache/server first to ensure doc exists
          const userSnap = await getDoc(userRef);
          exists = userSnap.exists();
        } catch (e: any) {
          console.warn("Could not fetch initial profile, proceeding to listener:", e);
          exists = false; // Need to create doc if no cache
        }
          
        if (!exists) {
          try {
            await setDoc(userRef, {
              uid: effectiveUser.uid,
              email: effectiveUser.email || '',
              displayName: effectiveUser.displayName || 'Investigator',
              photoURL: effectiveUser.photoURL || '',
              createdAt: serverTimestamp(),
              purchasedCourses: [],
              bookmarks: [],
              achievementTags: ['Forensic Novice'],
              progress: {},
              doubtsCount: 0,
              commentsCount: 0
            });
          } catch (e) {
            console.warn("Could not create user profile:", e);
          }
        }

        // Setup real-time listener
        unsubscribeProfile = onSnapshot(userRef, (doc) => {
          if (doc.exists()) {
            const data = doc.data();
            setUserProfile({
              ...data,
              purchasedCourses: data.purchasedCourses || []
            } as UserProfile);
          }
          setLoading(false);
        }, (error) => {
          console.error("Profile sync error:", error);
          // Fallback to local profile if listener fails
          if (!userProfile) {
            setUserProfile({
              uid: effectiveUser.uid,
              email: effectiveUser.email,
              displayName: effectiveUser.displayName,
              photoURL: effectiveUser.photoURL,
              purchasedCourses: [],
              bookmarks: [],
              achievementTags: ['Forensic Novice'],
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
  }, [effectiveUser]);

  // Safety Timeout for loading
  useEffect(() => {
    const timer = setTimeout(() => {
      if (loading) {
        console.warn("Auth initialization timed out. Forcing app to load.");
        setLoading(false);
      }
    }, 8000); // 8 seconds max for auth/profile init

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
          const { customToken, tempPassword, email, user: linkedinUser } = event.data;
          try {
            if (customToken) {
              await signInWithCustomToken(auth, customToken);
            } else if (email && tempPassword) {
              await signInWithEmailAndPassword(auth, email, tempPassword);
            } else if (linkedinUser) {
              handleSetManualUser(linkedinUser);
            }
            resolve();
          } catch (err: any) {
            console.warn("Firebase custom auth error, falling back to session auth:", err);
            if (linkedinUser) {
              handleSetManualUser(linkedinUser);
              resolve();
            } else {
              reject(err);
            }
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

  const sendVerificationEmail = async () => {
    if (auth.currentUser) {
      await sendEmailVerification(auth.currentUser);
    }
  };

  const signUpWithEmail = async (email: string, pass: string, name: string) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, pass);
      await updateProfile(result.user, {
        displayName: name
      });
      try {
        await sendEmailVerification(result.user);
      } catch (e) {
        console.warn("Email verification send error:", e);
      }
      const userRef = doc(db, 'users', result.user.uid);
      await setDoc(userRef, {
        uid: result.user.uid,
        email: result.user.email || '',
        displayName: name || 'Investigator',
        photoURL: '',
        createdAt: serverTimestamp(),
        purchasedCourses: [],
        bookmarks: [],
        achievementTags: ['Forensic Novice'],
        progress: {},
        doubtsCount: 0,
        commentsCount: 0
      });
      return result.user;
    } catch (error) {
      console.error("Error signing up with email and password: ", error);
      throw error;
    }
  };

  const signInWithEmail = async (email: string, pass: string) => {
    const normalizedEmail = email.trim().toLowerCase();
    
    // Check if matching preset admin credentials
    const validAdmins: Record<string, { pass: string; displayName: string }> = {
      'forenclue@gmail.com': { pass: 'forenclue@2025', displayName: 'Forenclue Team Admin' },
      'purvabhawsar995@gmail.com': { pass: 'purva123@md', displayName: 'Purva Bhawsar (Quiz Admin)' }
    };

    if (validAdmins[normalizedEmail] && pass === validAdmins[normalizedEmail].pass) {
      try {
        const result = await signInWithEmailAndPassword(auth, email, pass);
        return result.user;
      } catch (err: any) {
        if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential' || err.code === 'auth/invalid-email') {
          try {
            const res = await createUserWithEmailAndPassword(auth, email, pass);
            await updateProfile(res.user, { displayName: validAdmins[normalizedEmail].displayName });
            return res.user;
          } catch (signUpErr) {
            console.warn("Could not register preset admin to Firebase Auth:", signUpErr);
          }
        }
        const session = { email: normalizedEmail, displayName: validAdmins[normalizedEmail].displayName };
        setManualAdmin(session);
        localStorage.setItem('manualAdmin', JSON.stringify(session));
        sessionStorage.setItem('manualAdmin', JSON.stringify(session));
        return { email: normalizedEmail, uid: getAssignedUidForEmail(normalizedEmail, null), displayName: validAdmins[normalizedEmail].displayName } as any;
      }
    }

    try {
      const result = await signInWithEmailAndPassword(auth, email, pass);
      return result.user;
    } catch (error: any) {
      console.warn("Sign-in with email failed:", error?.code || error?.message || error);
      throw error;
    }
  };

  const sendPasswordReset = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error("Error sending password reset email: ", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      if (manualAdmin) {
        setManualAdmin(null);
        localStorage.removeItem('manualAdmin');
        sessionStorage.removeItem('manualAdmin');
      }
      if (manualUser) {
        handleSetManualUser(null);
      }
      await signOut(auth);
      setAccessToken(null);
    } catch (error) {
      console.error("Error signing out: ", error);
      throw error;
    }
  };

  const adminLogin = async (email: string, password: string): Promise<boolean> => {
    const normalizedEmail = email.trim().toLowerCase();
    
    const validAdmins: Record<string, { pass: string; displayName: string }> = {
      'forenclue@gmail.com': { pass: 'forenclue@2025', displayName: 'Forenclue Team Admin' },
      'purvabhawsar995@gmail.com': { pass: 'purva123@md', displayName: 'Purva Bhawsar (Quiz Admin)' }
    };

    if (validAdmins[normalizedEmail] && password === validAdmins[normalizedEmail].pass) {
      try {
        await signInWithEmailAndPassword(auth, email, password);
      } catch (err: any) {
        if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential' || err.code === 'auth/invalid-email') {
          try {
            await createUserWithEmailAndPassword(auth, email, password);
          } catch (signUpErr) {
            console.warn("Could not register manual admin user to Firebase Auth:", signUpErr);
          }
        } else {
          console.warn("Firebase Auth login failed for manual admin:", err);
        }
      }
      const session = { email: normalizedEmail, displayName: validAdmins[normalizedEmail].displayName };
      setManualAdmin(session);
      localStorage.setItem('manualAdmin', JSON.stringify(session));
      sessionStorage.setItem('manualAdmin', JSON.stringify(session));
      return true;
    }
    return false;
  };

  return (
    <AuthContext.Provider value={{ user: effectiveUser, userProfile: effectiveUserProfile, loading, isAdmin, isQuizOnlyAdmin, accessToken, signInWithLinkedIn, signUpWithEmail, signInWithEmail, sendVerificationEmail, sendPasswordReset, logout, adminLogin }}>
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
