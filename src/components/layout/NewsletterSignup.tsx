import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Mail, ArrowRight, CheckCircle2, AlertCircle, Loader2, Sparkles } from 'lucide-react';
import { db, auth, handleFirestoreError, OperationType } from '@/lib/firebase';

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const SUBSCRIBED_STORAGE_KEY = 'forenclue_newsletter_emails';

export function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'duplicate' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const getSubscribedEmails = (): string[] => {
    try {
      const raw = localStorage.getItem(SUBSCRIBED_STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  const markEmailSubscribed = (normalizedEmail: string) => {
    try {
      const current = getSubscribedEmails();
      if (!current.includes(normalizedEmail)) {
        localStorage.setItem(SUBSCRIBED_STORAGE_KEY, JSON.stringify([...current, normalizedEmail]));
      }
    } catch {
      // Ignore storage quota errors
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      setStatus('error');
      setErrorMessage('Please enter your email address.');
      return;
    }

    if (normalizedEmail.length < 5 || normalizedEmail.length > 254 || !EMAIL_REGEX.test(normalizedEmail)) {
      setStatus('error');
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (getSubscribedEmails().includes(normalizedEmail)) {
      setStatus('duplicate');
      setEmail('');
      return;
    }

    setStatus('loading');
    setErrorMessage('');

    try {
      const payload: Record<string, unknown> = {
        email: normalizedEmail,
        status: 'active',
        source: 'footer',
        createdAt: serverTimestamp(),
      };

      if (auth.currentUser?.uid) {
        payload.userId = auth.currentUser.uid;
      }

      await addDoc(collection(db, 'newsletter_subscribers'), payload);
      markEmailSubscribed(normalizedEmail);
      setStatus('success');
      setEmail('');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'newsletter_subscribers');
      setStatus('error');
      setErrorMessage('Unable to subscribe right now. Please try again in a moment.');
    }
  };

  return (
    <div className="mb-12 rounded-2xl bg-surface/80 dark:bg-surface/50 border border-black/10 dark:border-white/10 p-6 sm:p-8 relative overflow-hidden">
      <div className="absolute -right-12 -top-12 w-40 h-40 rounded-full bg-warning/10 blur-3xl pointer-events-none" />
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative z-10">
        <div className="lg:col-span-7 space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-warning">
            <Sparkles size={14} />
            <span>Forensic Intelligence Dispatch</span>
          </div>
          <h3 className="font-heading font-bold text-lg sm:text-xl text-text-main">
            Stay Updated on Declassified Cases, Lab Simulations & Webinars
          </h3>
          <p className="text-sm text-text-muted max-w-xl leading-relaxed">
            Subscribe to receive forensic science alerts, new virtual lab releases, and upcoming expert seminar invitations straight to your inbox.
          </p>
        </div>

        <div className="lg:col-span-5">
          <form onSubmit={handleSubmit} noValidate className="space-y-2.5">
            <div className="flex flex-col sm:flex-row gap-2.5">
              <div className="relative flex-1">
                <Mail
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (status === 'error' || status === 'success' || status === 'duplicate') {
                      setStatus('idle');
                      setErrorMessage('');
                    }
                  }}
                  placeholder="Enter your email address..."
                  aria-label="Email address for newsletter updates"
                  disabled={status === 'loading'}
                  maxLength={254}
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-crust border border-black/15 dark:border-white/15 text-sm text-text-main placeholder:text-text-muted/70 focus:outline-none focus:border-warning focus:ring-1 focus:ring-warning transition-colors disabled:opacity-60"
                />
              </div>
              <button
                type="submit"
                disabled={status === 'loading'}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-warning hover:bg-warning/90 text-black font-semibold text-sm transition-all duration-200 shrink-0 disabled:opacity-60 cursor-pointer"
              >
                {status === 'loading' ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Subscribing...</span>
                  </>
                ) : (
                  <>
                    <span>Subscribe</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </div>

            {status === 'success' && (
              <div
                role="status"
                className="flex items-center gap-2 text-xs font-medium text-emerald-600 dark:text-emerald-400 pt-1"
              >
                <CheckCircle2 size={14} className="shrink-0" />
                <span>You're subscribed! Watch your inbox for future forensic updates and alerts.</span>
              </div>
            )}

            {status === 'duplicate' && (
              <div
                role="status"
                className="flex items-center gap-2 text-xs font-medium text-emerald-600 dark:text-emerald-400 pt-1"
              >
                <CheckCircle2 size={14} className="shrink-0" />
                <span>This email is already subscribed to our updates and alerts.</span>
              </div>
            )}

            {status === 'error' && errorMessage && (
              <div
                role="alert"
                className="flex items-center gap-2 text-xs font-medium text-red-600 dark:text-red-400 pt-1"
              >
                <AlertCircle size={14} className="shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {status === 'idle' && (
              <p className="text-[11px] text-text-muted/80">
                Zero spam. Unsubscribe anytime. Protected under our Privacy Policy.
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
