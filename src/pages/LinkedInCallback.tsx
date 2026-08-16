import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export default function LinkedInCallback() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    async function processCallback() {
      const code = searchParams.get('code');
      const state = searchParams.get('state');
      const error = searchParams.get('error');
      const errorDesc = searchParams.get('error_description');

      if (error) {
        const msg = errorDesc || error || 'LinkedIn authentication was cancelled or failed.';
        setStatus('error');
        setErrorMessage(msg);
        if (window.opener) {
          window.opener.postMessage({ type: 'LINKEDIN_AUTH_ERROR', error: msg }, '*');
          setTimeout(() => window.close(), 2500);
        }
        return;
      }

      if (!code) {
        setStatus('error');
        setErrorMessage('Missing authorization code from LinkedIn.');
        if (window.opener) {
          window.opener.postMessage({ type: 'LINKEDIN_AUTH_ERROR', error: 'Missing authorization code' }, '*');
          setTimeout(() => window.close(), 2500);
        }
        return;
      }

      try {
        const origin = window.location.origin;
        const redirectUri = `${origin}/api/auth/linkedin/callback`;

        // Try candidate backend endpoints in sequence if relative call fails
        const backendCandidates = [
          '/api/auth/linkedin/callback',
          'https://forenclue.in/api/auth/linkedin/callback',
          'https://www.forenclue.in/api/auth/linkedin/callback'
        ];

        let response: Response | null = null;
        let data: any = null;

        for (const endpoint of backendCandidates) {
          try {
            const res = await fetch(endpoint, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
              },
              body: JSON.stringify({
                code,
                state,
                redirect_uri: redirectUri
              })
            });
            const contentType = res.headers.get('content-type') || '';
            if (contentType.includes('application/json')) {
              const jsonData = await res.json().catch(() => null);
              if (jsonData) {
                response = res;
                data = jsonData;
                if (res.ok) break;
              }
            }
          } catch (err) {
            console.warn(`[LinkedIn Callback Client] Endpoint ${endpoint} failed:`, err);
          }
        }

        if (response && response.ok && data && (data.type === 'LINKEDIN_AUTH_SUCCESS' || data.user || data.customToken)) {
          setStatus('success');
          const payload = {
            type: 'LINKEDIN_AUTH_SUCCESS',
            customToken: data.customToken,
            tempPassword: data.tempPassword,
            email: data.email,
            user: data.user
          };
          if (window.opener) {
            window.opener.postMessage(payload, '*');
            setTimeout(() => window.close(), 1000);
          } else {
            try {
              if (data.user) {
                localStorage.setItem('manualUser', JSON.stringify(data.user));
              }
            } catch (e) {}
            window.location.href = '/';
          }
        } else {
          const errText = data?.error || data?.message || 'Failed to authenticate with LinkedIn backend server.';
          setStatus('error');
          setErrorMessage(errText);
          if (window.opener) {
            window.opener.postMessage({ type: 'LINKEDIN_AUTH_ERROR', error: errText }, '*');
            setTimeout(() => window.close(), 3000);
          }
        }
      } catch (err: any) {
        console.error("LinkedIn Callback Client Exception:", err);
        const msg = err.message || 'Network error communicating with authentication server.';
        setStatus('error');
        setErrorMessage(msg);
        if (window.opener) {
          window.opener.postMessage({ type: 'LINKEDIN_AUTH_ERROR', error: msg }, '*');
          setTimeout(() => window.close(), 3000);
        }
      }
    }

    processCallback();
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-[#0b1120] text-white flex items-center justify-center p-6 text-center font-sans">
      <div className="bg-[#111827] border border-white/10 rounded-2xl p-8 max-w-md w-full shadow-2xl space-y-4">
        {status === 'loading' && (
          <>
            <div className="w-12 h-12 border-4 border-[#0A66C2]/30 border-t-[#0A66C2] rounded-full animate-spin mx-auto" />
            <h3 className="text-xl font-bold">Authenticating with LinkedIn</h3>
            <p className="text-sm text-gray-400">Verifying credentials with ForenClue...</p>
          </>
        )}
        {status === 'success' && (
          <>
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
            <h3 className="text-xl font-bold text-emerald-400">Sign-In Successful!</h3>
            <p className="text-sm text-gray-400">Completing sign-in and closing window...</p>
          </>
        )}
        {status === 'error' && (
          <>
            <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
            <h3 className="text-xl font-bold text-rose-400">Authentication Failed</h3>
            <p className="text-sm text-rose-200/80 bg-rose-950/40 p-3 rounded-lg border border-rose-800/40">{errorMessage}</p>
            <p className="text-xs text-gray-400 mt-2">Closing popup window...</p>
          </>
        )}
      </div>
    </div>
  );
}
