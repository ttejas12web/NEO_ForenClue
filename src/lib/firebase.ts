import { initializeApp } from 'firebase/app';
import { initializeAuth, browserLocalPersistence, browserSessionPersistence, browserPopupRedirectResolver, signOut } from 'firebase/auth';
import { initializeFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase config from auto-generated applet settings
const getRuntimeConfig = () => {
  const config = { ...firebaseConfig };
  // We use the default authDomain (firebaseapp.com) to ensure the 
  // /__/auth/handler script loads correctly. 
  return config;
};

const app = initializeApp(getRuntimeConfig());
const dbDatabaseId = (firebaseConfig as any).firestoreDatabaseId;
export const db = initializeFirestore(app, {
  experimentalAutoDetectLongPolling: true
}, dbDatabaseId);

// Initialize Firebase Auth explicitly with browserLocalPersistence and browserSessionPersistence for session continuity.
export const auth = initializeAuth(app, {
  persistence: [browserLocalPersistence, browserSessionPersistence],
  popupRedirectResolver: browserPopupRedirectResolver
});
export let storage: any;
try {
  storage = getStorage(app);
} catch (error) {
  console.warn("Firebase Storage is not available. Image uploads will use fallback.");
  storage = null;
}

let cachedAccessToken: string | null = null;
export const getAccessToken = () => cachedAccessToken;

export enum OperationType {
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

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
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
  console.warn('Firestore Warning: ', JSON.stringify(errInfo));
}

export const logout = () => signOut(auth);
