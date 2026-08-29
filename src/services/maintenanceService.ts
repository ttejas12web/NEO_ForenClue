import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';

export interface MaintenanceConfig {
  isActive: boolean;
  title: string;
  notice: string;
  targetEndTime: string; // ISO String
  durationMinutes?: number;
  updatedAt?: string;
  updatedBy?: string;
}

const STORAGE_KEY = 'forenclue_maintenance_config_cache';

// Calculate the nearest / default IST 12:30 PM timestamp ISO string
export function getDefaultIst1230Target(): string {
  const now = new Date();
  // IST is UTC+5:30.
  // 12:30 PM IST = 07:00 AM UTC on the same day in IST.
  
  // Get current date parts in Asia/Kolkata (IST)
  const istString = now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });
  const istDate = new Date(istString);
  
  const year = istDate.getFullYear();
  const month = String(istDate.getMonth() + 1).padStart(2, '0');
  const day = String(istDate.getDate()).padStart(2, '0');
  
  // 12:30 PM IST is 12:30:00+05:30
  let target = new Date(`${year}-${month}-${day}T12:30:00+05:30`);
  
  // If target time has already passed today by more than 15 minutes, target tomorrow 12:30 PM IST or keep today's
  if (now.getTime() > target.getTime() + 15 * 60 * 1000) {
    // Tomorrow 12:30 PM IST
    target = new Date(target.getTime() + 24 * 60 * 60 * 1000);
  }
  
  return target.toISOString();
}

export const DEFAULT_MAINTENANCE_CONFIG: MaintenanceConfig = {
  // Fail open for visitors and crawlers when Firestore is slow or unavailable.
  // An explicit Firestore setting can still activate maintenance mode.
  isActive: false,
  title: 'Platform Maintenance in Progress',
  notice: 'We are performing scheduled infrastructure and laboratory engine upgrades. ForenClue will be back online shortly.',
  targetEndTime: getDefaultIst1230Target(),
  durationMinutes: 120,
  updatedAt: new Date().toISOString()
};

/**
 * Get initial cached configuration for instant rendering without layout shift
 */
export function getCachedMaintenanceConfig(): MaintenanceConfig {
  try {
    const cached = localStorage.getItem(STORAGE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      return { ...DEFAULT_MAINTENANCE_CONFIG, ...parsed };
    }
  } catch (e) {
    // fallback
  }
  return DEFAULT_MAINTENANCE_CONFIG;
}

/**
 * Listen in real-time to Maintenance mode configuration from Firestore
 */
export function subscribeMaintenanceConfig(
  onUpdate: (config: MaintenanceConfig) => void,
  onError?: (error: Error) => void
): () => void {
  const docRef = doc(db, 'system_settings', 'maintenance');

  const unsubscribe = onSnapshot(
    docRef,
    (snap) => {
      if (snap.exists()) {
        const data = snap.data() as Partial<MaintenanceConfig>;
        const merged: MaintenanceConfig = {
          isActive: typeof data.isActive === 'boolean' ? data.isActive : false,
          title: data.title || DEFAULT_MAINTENANCE_CONFIG.title,
          notice: data.notice || DEFAULT_MAINTENANCE_CONFIG.notice,
          targetEndTime: data.targetEndTime || DEFAULT_MAINTENANCE_CONFIG.targetEndTime,
          durationMinutes: data.durationMinutes || DEFAULT_MAINTENANCE_CONFIG.durationMinutes,
          updatedAt: data.updatedAt || new Date().toISOString(),
          updatedBy: data.updatedBy
        };
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
        } catch (e) {}
        onUpdate(merged);
      } else {
        // Doc doesn't exist yet, emit default
        onUpdate(DEFAULT_MAINTENANCE_CONFIG);
      }
    },
    (err) => {
      console.warn("Firestore maintenance listener error:", err);
      if (onError) onError(err);
      // Fallback to cache or default
      onUpdate(getCachedMaintenanceConfig());
    }
  );

  return unsubscribe;
}

/**
 * Save maintenance configuration from Admin Panel
 */
export async function saveMaintenanceConfig(config: Partial<MaintenanceConfig>, adminEmail?: string): Promise<void> {
  const docRef = doc(db, 'system_settings', 'maintenance');
  const payload: MaintenanceConfig = {
    isActive: typeof config.isActive === 'boolean' ? config.isActive : false,
    title: config.title || DEFAULT_MAINTENANCE_CONFIG.title,
    notice: config.notice || DEFAULT_MAINTENANCE_CONFIG.notice,
    targetEndTime: config.targetEndTime || DEFAULT_MAINTENANCE_CONFIG.targetEndTime,
    durationMinutes: config.durationMinutes || DEFAULT_MAINTENANCE_CONFIG.durationMinutes,
    updatedAt: new Date().toISOString(),
    updatedBy: adminEmail || 'Admin'
  };

  await setDoc(docRef, payload, { merge: true });
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch (e) {}
}

/**
 * Calculates countdown remaining time till target
 */
export function calculateRemainingTime(targetIso: string) {
  const targetTime = new Date(targetIso).getTime();
  const now = Date.now();
  const diff = targetTime - now;

  if (isNaN(targetTime) || diff <= 0) {
    return {
      totalMs: 0,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isExpired: true
    };
  }

  const seconds = Math.floor((diff / 1000) % 60);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  return {
    totalMs: diff,
    days,
    hours,
    minutes,
    seconds,
    isExpired: false
  };
}

/**
 * Format ISO String to user-friendly IST string
 */
export function formatIstDisplay(targetIso: string): string {
  try {
    const d = new Date(targetIso);
    if (isNaN(d.getTime())) return '12:30 PM IST';
    return d.toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      day: 'numeric',
      month: 'short'
    }) + ' IST';
  } catch (e) {
    return '12:30 PM IST';
  }
}
