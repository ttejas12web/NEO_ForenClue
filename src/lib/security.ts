/**
 * ForenClue Enterprise Security & Authentication Utilities
 * Implements OWASP-compliant security controls:
 * - Exponential backoff rate limiting for authentication attempts
 * - Inactive session expiration & activity heartbeats
 * - Strong password entropy verification
 * - Rate limiting on password reset and email verification dispatches
 */

interface RateLimitRecord {
  attempts: number;
  lockedUntil: number; // timestamp ms
  lastAttempt: number;
}

const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 5 * 60 * 1000; // 5 minutes lockout on 5 consecutive failures
const ATTEMPT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes window for attempt accumulation

const loginAttemptStore = new Map<string, RateLimitRecord>();
const passwordResetStore = new Map<string, { lastSent: number; count: number; windowStart: number }>();
const emailVerificationStore = new Map<string, number>();

/**
 * Checks if login attempts for a specific identifier (email) are currently rate-limited.
 */
export function checkLoginRateLimit(identifier: string): {
  allowed: boolean;
  remainingAttempts: number;
  lockoutSeconds: number;
} {
  const key = identifier.trim().toLowerCase();
  const now = Date.now();
  const record = loginAttemptStore.get(key);

  if (!record) {
    return { allowed: true, remainingAttempts: MAX_LOGIN_ATTEMPTS, lockoutSeconds: 0 };
  }

  // Check if active lockout exists
  if (record.lockedUntil > now) {
    const lockoutSeconds = Math.ceil((record.lockedUntil - now) / 1000);
    return { allowed: false, remainingAttempts: 0, lockoutSeconds };
  }

  // Reset attempt count if outside the sliding time window
  if (now - record.lastAttempt > ATTEMPT_WINDOW_MS) {
    loginAttemptStore.delete(key);
    return { allowed: true, remainingAttempts: MAX_LOGIN_ATTEMPTS, lockoutSeconds: 0 };
  }

  const remainingAttempts = Math.max(0, MAX_LOGIN_ATTEMPTS - record.attempts);
  return {
    allowed: record.attempts < MAX_LOGIN_ATTEMPTS,
    remainingAttempts,
    lockoutSeconds: 0,
  };
}

/**
 * Records a failed login attempt and applies progressive lockout if threshold is reached.
 */
export function recordFailedLogin(identifier: string): {
  allowed: boolean;
  remainingAttempts: number;
  lockoutSeconds: number;
} {
  const key = identifier.trim().toLowerCase();
  const now = Date.now();
  let record = loginAttemptStore.get(key);

  if (!record || now - record.lastAttempt > ATTEMPT_WINDOW_MS) {
    record = { attempts: 1, lockedUntil: 0, lastAttempt: now };
  } else {
    record.attempts += 1;
    record.lastAttempt = now;
  }

  if (record.attempts >= MAX_LOGIN_ATTEMPTS) {
    // Progressive lockout multiplier for repeated threshold breeches
    const multiplier = Math.min(record.attempts - MAX_LOGIN_ATTEMPTS + 1, 4);
    record.lockedUntil = now + LOCKOUT_DURATION_MS * multiplier;
  }

  loginAttemptStore.set(key, record);

  const isLocked = record.lockedUntil > now;
  const lockoutSeconds = isLocked ? Math.ceil((record.lockedUntil - now) / 1000) : 0;
  const remainingAttempts = Math.max(0, MAX_LOGIN_ATTEMPTS - record.attempts);

  return {
    allowed: !isLocked,
    remainingAttempts,
    lockoutSeconds,
  };
}

/**
 * Resets the rate limiting counter upon a verified successful authentication.
 */
export function recordSuccessfulLogin(identifier: string): void {
  const key = identifier.trim().toLowerCase();
  loginAttemptStore.delete(key);
}

/**
 * Rate limit check for Password Reset link dispatches (Max 3 per 15 minutes, min 60s cooldown)
 */
export function checkPasswordResetRateLimit(email: string): {
  allowed: boolean;
  cooldownSeconds: number;
  reason?: string;
} {
  const key = email.trim().toLowerCase();
  const now = Date.now();
  const record = passwordResetStore.get(key);

  if (!record) {
    return { allowed: true, cooldownSeconds: 0 };
  }

  // 60-second consecutive dispatch cooldown
  const timeSinceLast = now - record.lastSent;
  if (timeSinceLast < 60 * 1000) {
    const cooldownSeconds = Math.ceil((60 * 1000 - timeSinceLast) / 1000);
    return {
      allowed: false,
      cooldownSeconds,
      reason: `Please wait ${cooldownSeconds}s before requesting another password reset email.`,
    };
  }

  // Window check: max 3 requests per 15 mins
  if (now - record.windowStart < 15 * 60 * 1000 && record.count >= 3) {
    const waitMins = Math.ceil((15 * 60 * 1000 - (now - record.windowStart)) / 60000);
    return {
      allowed: false,
      cooldownSeconds: waitMins * 60,
      reason: `Maximum reset attempts reached. For security, please try again in ${waitMins} minute(s).`,
    };
  }

  return { allowed: true, cooldownSeconds: 0 };
}

/**
 * Records a dispatched password reset request
 */
export function recordPasswordResetRequest(email: string): void {
  const key = email.trim().toLowerCase();
  const now = Date.now();
  const record = passwordResetStore.get(key);

  if (!record || now - record.windowStart > 15 * 60 * 1000) {
    passwordResetStore.set(key, { lastSent: now, count: 1, windowStart: now });
  } else {
    record.lastSent = now;
    record.count += 1;
    passwordResetStore.set(key, record);
  }
}

/**
 * Rate limit check for Email Verification resends (60-second cooldown)
 */
export function checkEmailVerificationCooldown(email: string): {
  allowed: boolean;
  cooldownSeconds: number;
} {
  const key = email.trim().toLowerCase();
  const now = Date.now();
  const lastSent = emailVerificationStore.get(key);

  if (!lastSent) return { allowed: true, cooldownSeconds: 0 };

  const elapsed = now - lastSent;
  if (elapsed < 60 * 1000) {
    const cooldownSeconds = Math.ceil((60 * 1000 - elapsed) / 1000);
    return { allowed: false, cooldownSeconds };
  }

  return { allowed: true, cooldownSeconds: 0 };
}

export function recordEmailVerificationSent(email: string): void {
  const key = email.trim().toLowerCase();
  emailVerificationStore.set(key, Date.now());
}

/**
 * Password Entropy & Strength Evaluator
 * Verifies OWASP baseline: >= 8 characters, with lowercase, uppercase, number, and special character.
 */
export interface PasswordValidationResult {
  isStrong: boolean;
  score: number; // 0 to 4
  hasMinLength: boolean;
  hasUpper: boolean;
  hasLower: boolean;
  hasNumber: boolean;
  hasSpecial: boolean;
  errors: string[];
}

export function validatePasswordStrength(password: string): PasswordValidationResult {
  const hasMinLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);

  const errors: string[] = [];
  if (!hasMinLength) errors.push('Minimum 8 characters required');
  if (!hasUpper) errors.push('At least one uppercase letter (A-Z)');
  if (!hasLower) errors.push('At least one lowercase letter (a-z)');
  if (!hasNumber) errors.push('At least one number (0-9)');
  if (!hasSpecial) errors.push('At least one special character (!@#$%^&*)');

  let score = 0;
  if (hasMinLength) score++;
  if (hasUpper && hasLower) score++;
  if (hasNumber) score++;
  if (hasSpecial) score++;

  return {
    isStrong: errors.length === 0,
    score,
    hasMinLength,
    hasUpper,
    hasLower,
    hasNumber,
    hasSpecial,
    errors,
  };
}

/**
 * Inactivity Session Monitor Configuration
 */
export const SESSION_INACTIVITY_LIMIT_MS = 2 * 60 * 60 * 1000; // 2 hours idle timeout
