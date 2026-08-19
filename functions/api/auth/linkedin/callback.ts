export interface LinkedInEnv {
  LINKEDIN_CLIENT_ID?: string;
  LINKEDIN_CLIENT_SECRET?: string;
  LINKEDIN_FIREBASE_SESSION_SECRET?: string;
  FIREBASE_API_KEY?: string;
}

type RequestContext = {
  request: Request;
  env: LinkedInEnv;
};

type LinkedInUserInfo = {
  sub?: string;
  email?: string;
  name?: string;
  given_name?: string;
  family_name?: string;
  picture?: string;
};

const CALLBACK_PATH = '/api/auth/linkedin/callback';
const AUTH_RESULT_STORAGE_KEY = 'forenclue:linkedin-auth-result';
const HTML_HEADERS = {
  'Cache-Control': 'no-store',
  'Content-Type': 'text/html; charset=utf-8',
  'Referrer-Policy': 'no-referrer',
  'X-Content-Type-Options': 'nosniff',
  'Content-Security-Policy': "default-src 'none'; style-src 'unsafe-inline'; script-src 'unsafe-inline'; base-uri 'none'; frame-ancestors 'none'",
};

function isAllowedOrigin(url: URL): boolean {
  return (
    url.origin === 'https://forenclue.in' ||
    url.origin === 'https://www.forenclue.in' ||
    (url.protocol === 'http:' && (url.hostname === 'localhost' || url.hostname === '127.0.0.1'))
  );
}

function redirectUriFrom(request: Request, state: string | null, explicit?: unknown): string {
  const requestUrl = new URL(request.url);
  let value = typeof explicit === 'string' ? explicit : '';

  if (!value && state?.includes('__')) {
    try {
      value = decodeURIComponent(state.slice(state.indexOf('__') + 2));
    } catch {
      value = '';
    }
  }

  const candidate = new URL(value || CALLBACK_PATH, requestUrl.origin);
  if (!isAllowedOrigin(candidate) || candidate.pathname !== CALLBACK_PATH) {
    throw new Error('Invalid LinkedIn redirect URI.');
  }

  candidate.search = '';
  candidate.hash = '';
  return candidate.toString();
}

function serializeForScript(value: unknown): string {
  return JSON.stringify(value)
    .replace(/&/g, '\\u0026')
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
}

function popupHtml(payload: Record<string, unknown>, targetOrigin: string, success: boolean): Response {
  const safePayload = serializeForScript(payload);
  const safeOrigin = serializeForScript(targetOrigin);
  const safeStorageKey = serializeForScript(AUTH_RESULT_STORAGE_KEY);
  const heading = success ? 'LinkedIn sign-in successful' : 'LinkedIn sign-in failed';
  const detail = success ? 'Completing sign-in with ForenClue…' : 'Return to ForenClue and try again.';

  return new Response(`<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${heading}</title></head>
<body style="font-family:system-ui,sans-serif;text-align:center;padding:48px;background:#0b1120;color:#fff">
  <main style="max-width:440px;margin:auto;padding:32px;border:1px solid rgba(255,255,255,.12);border-radius:16px;background:#111827">
    <h1 style="font-size:22px">${heading}</h1><p style="color:#9ca3af">${detail}</p>
  </main>
  <script>
    const payload = ${safePayload};
    const targetOrigin = ${safeOrigin};
    const storageKey = ${safeStorageKey};
    try {
      localStorage.setItem(storageKey, JSON.stringify({ payload, createdAt: Date.now() }));
      setTimeout(() => localStorage.removeItem(storageKey), 10000);
    } catch (_) {}
    if (window.opener) {
      try { window.opener.postMessage(payload, targetOrigin); } catch (_) {}
      setTimeout(() => window.close(), ${success ? 900 : 2500});
    } else {
      setTimeout(() => {
        window.close();
        setTimeout(() => window.location.replace('/login?linkedin=complete'), 300);
      }, ${success ? 900 : 2500});
    }
  </script>
</body>
</html>`, { status: 200, headers: HTML_HEADERS });
}

function credentials(env: LinkedInEnv): { clientId: string; clientSecret: string } {
  if (!env.LINKEDIN_CLIENT_ID || !env.LINKEDIN_CLIENT_SECRET) {
    throw new Error('LinkedIn authentication is not configured on the server.');
  }
  return { clientId: env.LINKEDIN_CLIENT_ID, clientSecret: env.LINKEDIN_CLIENT_SECRET };
}

function toHex(bytes: ArrayBuffer): string {
  return Array.from(new Uint8Array(bytes), byte => byte.toString(16).padStart(2, '0')).join('');
}

function toBase64Url(bytes: ArrayBuffer): string {
  let binary = '';
  for (const byte of new Uint8Array(bytes)) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

async function firebaseIdentityFor(linkedInSub: string, env: LinkedInEnv) {
  if (!env.FIREBASE_API_KEY || !env.LINKEDIN_FIREBASE_SESSION_SECRET) {
    throw new Error('LinkedIn Firebase session creation is not configured on the server.');
  }

  const encoder = new TextEncoder();
  const subjectHash = await crypto.subtle.digest('SHA-256', encoder.encode(linkedInSub));
  const authEmail = `linkedin.${toHex(subjectHash).slice(0, 40)}@auth.forenclue.invalid`;
  const hmacKey = await crypto.subtle.importKey(
    'raw',
    encoder.encode(env.LINKEDIN_FIREBASE_SESSION_SECRET),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const signature = await crypto.subtle.sign('HMAC', hmacKey, encoder.encode(`linkedin:${linkedInSub}`));
  const tempPassword = `${toBase64Url(signature)}Aa1!`;

  const callFirebase = async (action: 'signUp' | 'signInWithPassword') => {
    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:${action}?key=${encodeURIComponent(env.FIREBASE_API_KEY!)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: authEmail, password: tempPassword, returnSecureToken: true }),
      },
    );
    const body = await response.json().catch(() => ({})) as {
      localId?: string;
      error?: { message?: string };
    };
    return { response, body };
  };

  let { response, body } = await callFirebase('signUp');
  const errorCode = body.error?.message?.split(' : ')[0];
  if (!response.ok && errorCode === 'EMAIL_EXISTS') {
    ({ response, body } = await callFirebase('signInWithPassword'));
  }

  if (!response.ok || !body.localId) {
    const reason = body.error?.message || 'Firebase rejected the LinkedIn session.';
    throw new Error(`Could not create the ForenClue session: ${reason}`);
  }

  return { authEmail, tempPassword, firebaseUid: body.localId };
}

async function exchangeCode(code: string, redirectUri: string, env: LinkedInEnv) {
  const { clientId, clientSecret } = credentials(env);
  const tokenResponse = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
    }),
  });
  const tokenData = await tokenResponse.json().catch(() => ({})) as Record<string, unknown>;
  const accessToken = typeof tokenData.access_token === 'string' ? tokenData.access_token : '';
  if (!tokenResponse.ok || !accessToken) {
    const message = typeof tokenData.error_description === 'string'
      ? tokenData.error_description
      : 'LinkedIn rejected the authorization code.';
    throw new Error(message);
  }

  const userResponse = await fetch('https://api.linkedin.com/v2/userinfo', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const userInfo = await userResponse.json().catch(() => ({})) as LinkedInUserInfo;
  if (!userResponse.ok || !userInfo.sub) {
    throw new Error('LinkedIn did not return a valid user profile.');
  }

  const firebaseIdentity = await firebaseIdentityFor(userInfo.sub, env);
  const displayName = userInfo.name || `${userInfo.given_name || ''} ${userInfo.family_name || ''}`.trim() || 'LinkedIn User';
  const email = userInfo.email || `${userInfo.sub}@linkedin.user`;
  return {
    email,
    authEmail: firebaseIdentity.authEmail,
    tempPassword: firebaseIdentity.tempPassword,
    user: {
      uid: firebaseIdentity.firebaseUid,
      linkedinUid: `linkedin:${userInfo.sub}`,
      email,
      displayName,
      photoURL: userInfo.picture || '',
    },
  };
}

export const onRequestGet = async ({ request, env }: RequestContext): Promise<Response> => {
  const url = new URL(request.url);
  const state = url.searchParams.get('state');
  let targetOrigin = url.origin;

  try {
    const redirectUri = redirectUriFrom(request, state);
    targetOrigin = new URL(redirectUri).origin;
    const providerError = url.searchParams.get('error_description') || url.searchParams.get('error');
    if (providerError) throw new Error(providerError);

    const code = url.searchParams.get('code');
    if (!code) throw new Error('Missing authorization code from LinkedIn.');
    const result = await exchangeCode(code, redirectUri, env);
    return popupHtml({ type: 'LINKEDIN_AUTH_SUCCESS', state, ...result }, targetOrigin, true);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'LinkedIn authentication failed.';
    return popupHtml({ type: 'LINKEDIN_AUTH_ERROR', state, error: message }, targetOrigin, false);
  }
};

export const onRequestPost = async ({ request, env }: RequestContext): Promise<Response> => {
  try {
    const body = await request.json().catch(() => ({})) as Record<string, unknown>;
    const code = typeof body.code === 'string' ? body.code : '';
    const state = typeof body.state === 'string' ? body.state : null;
    if (!code) {
      return Response.json({ type: 'LINKEDIN_AUTH_ERROR', error: 'Missing authorization code.' }, { status: 400 });
    }

    const redirectUri = redirectUriFrom(request, state, body.redirect_uri);
    const result = await exchangeCode(code, redirectUri, env);
    return Response.json({ type: 'LINKEDIN_AUTH_SUCCESS', state, ...result }, {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'LinkedIn authentication failed.';
    return Response.json({ type: 'LINKEDIN_AUTH_ERROR', error: message }, {
      status: 400,
      headers: { 'Cache-Control': 'no-store' },
    });
  }
};
