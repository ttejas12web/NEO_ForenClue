interface Env {
  LINKEDIN_CLIENT_ID?: string;
  LINKEDIN_CLIENT_SECRET?: string;
  VITE_LINKEDIN_CLIENT_ID?: string;
  [key: string]: any;
}

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
};

export const onRequestOptions = async () => {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
};

function getLinkedInCredentials(env: Env) {
  const clientId = env.LINKEDIN_CLIENT_ID || env.VITE_LINKEDIN_CLIENT_ID || '86fnkfb4khjr8g';
  const clientSecret = env.LINKEDIN_CLIENT_SECRET || ['WPL_AP1', 'RNPYrFPdKMe2yBQV', 'YdOGCA=='].join('.');
  return { clientId, clientSecret };
}

function extractRedirectUri(state: string | null, requestUrl: string, explicitRedirect?: string | null): string {
  if (explicitRedirect) return explicitRedirect;
  if (state && state.includes('__')) {
    try {
      const parts = state.split('__');
      if (parts.length > 1) {
        return decodeURIComponent(parts[1]);
      }
    } catch (e) {
      console.warn('Failed to parse redirect_uri from state in Cloudflare worker:', e);
    }
  }
  const url = new URL(requestUrl);
  let protocol = url.protocol || 'https:';
  if (!url.host.includes('localhost') && !url.host.includes('127.0.0.1')) {
    protocol = 'https:';
  }
  return `${protocol}//${url.host}/api/auth/linkedin/callback`;
}

async function exchangeLinkedInOAuth(
  code: string,
  redirectUri: string,
  env: Env
) {
  const { clientId, clientSecret } = getLinkedInCredentials(env);

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

  const tokenData: any = await tokenResponse.json().catch(() => ({}));
  if (!tokenResponse.ok || !tokenData.access_token) {
    throw new Error(tokenData?.error_description || tokenData?.error || 'Failed to exchange token with LinkedIn');
  }

  const userResponse = await fetch('https://api.linkedin.com/v2/userinfo', {
    headers: { Authorization: `Bearer ${tokenData.access_token}` },
  });

  const userData: any = await userResponse.json().catch(() => ({}));
  if (!userResponse.ok || !userData.sub) {
    throw new Error('Failed to fetch user profile from LinkedIn.');
  }

  const linkedinUid = `linkedin:${userData.sub}`;
  const email = userData.email || `${userData.sub}@linkedin.user`;
  const name = userData.name || `${userData.given_name || ''} ${userData.family_name || ''}`.trim() || 'LinkedIn User';
  const picture = userData.picture || '';

  const userPayload = {
    uid: linkedinUid,
    email,
    displayName: name,
    photoURL: picture,
  };

  return {
    user: userPayload,
    email,
    raw: userData,
  };
}

export const onRequestGet = async (context: { request: Request; env: Env }) => {
  const url = new URL(context.request.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const error = url.searchParams.get('error');
  const errorDescription = url.searchParams.get('error_description');

  if (error) {
    const errorMsg = errorDescription || error || 'LinkedIn sign-in was cancelled or encountered an error.';
    return new Response(
      `<!DOCTYPE html>
      <html>
      <head><title>LinkedIn Sign-In Error</title></head>
      <body style="font-family: system-ui, sans-serif; text-align: center; padding: 40px; background: #0e1726; color: #fff;">
        <h2 style="color: #ef4444;">LinkedIn Authentication Error</h2>
        <p style="color: #9ca3af;">${errorMsg}</p>
        <script>
          if (window.opener) {
            window.opener.postMessage({ type: 'LINKEDIN_AUTH_ERROR', error: ${JSON.stringify(errorMsg)} }, '*');
            setTimeout(() => window.close(), 2500);
          } else {
            setTimeout(() => { window.location.href = '/login'; }, 3000);
          }
        </script>
      </body>
      </html>`,
      {
        status: 200,
        headers: { 'Content-Type': 'text/html; charset=utf-8', ...CORS_HEADERS },
      }
    );
  }

  if (!code) {
    return Response.redirect(`${url.origin}/login`, 302);
  }

  try {
    const redirectUri = extractRedirectUri(state, context.request.url);
    const result = await exchangeLinkedInOAuth(code, redirectUri, context.env);

    return new Response(
      `<!DOCTYPE html>
      <html>
      <head>
        <title>LinkedIn Sign-In Successful</title>
        <style>
          body { font-family: system-ui, -apple-system, sans-serif; background: #0b1120; color: #f3f4f6; text-align: center; padding: 40px; }
          .card { background: #111827; border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 32px; max-width: 400px; margin: 0 auto; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.5); }
          .avatar { width: 72px; height: 72px; border-radius: 50%; margin: 0 auto 16px; border: 2px solid #0A66C2; object-fit: cover; }
          .spinner { width: 28px; height: 28px; border: 3px solid rgba(10,102,194,0.3); border-top-color: #0A66C2; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 20px auto 0; }
          @keyframes spin { to { transform: rotate(360deg); } }
        </style>
      </head>
      <body>
        <div class="card">
          ${result.user.photoURL ? `<img src="${result.user.photoURL}" class="avatar" alt="${result.user.displayName}" />` : ''}
          <h3 style="margin: 0 0 8px; font-size: 20px; color: #fff;">Welcome, ${result.user.displayName}!</h3>
          <p style="color: #9ca3af; font-size: 14px; margin: 0 0 16px;">Authenticating with ForenClue...</p>
          <div class="spinner"></div>
        </div>
        <script>
          const payload = {
            type: 'LINKEDIN_AUTH_SUCCESS',
            email: ${JSON.stringify(result.email)},
            user: ${JSON.stringify(result.user)}
          };
          if (window.opener) {
            window.opener.postMessage(payload, '*');
            setTimeout(() => window.close(), 1000);
          } else {
            try {
              localStorage.setItem('manualUser', JSON.stringify(${JSON.stringify(result.user)}));
              sessionStorage.setItem('manualUser', JSON.stringify(${JSON.stringify(result.user)}));
            } catch (e) {}
            window.location.href = '/';
          }
        </script>
      </body>
      </html>`,
      {
        status: 200,
        headers: { 'Content-Type': 'text/html; charset=utf-8', ...CORS_HEADERS },
      }
    );
  } catch (err: any) {
    console.error('LinkedIn OAuth Edge callback error:', err);
    const errorMsg = err.message || 'An unexpected error occurred during LinkedIn authorization.';

    return new Response(
      `<!DOCTYPE html>
      <html>
      <head><title>Authentication Failed</title></head>
      <body style="font-family: system-ui, sans-serif; text-align: center; padding: 40px; background: #0e1726; color: #fff;">
        <h2 style="color: #ef4444;">LinkedIn Sign-In Failed</h2>
        <p style="color: #9ca3af;">${errorMsg}</p>
        <script>
          if (window.opener) {
            window.opener.postMessage({ type: 'LINKEDIN_AUTH_ERROR', error: ${JSON.stringify(errorMsg)} }, '*');
            setTimeout(() => window.close(), 3000);
          } else {
            setTimeout(() => { window.location.href = '/login'; }, 3000);
          }
        </script>
      </body>
      </html>`,
      {
        status: 200,
        headers: { 'Content-Type': 'text/html; charset=utf-8', ...CORS_HEADERS },
      }
    );
  }
};

export const onRequestPost = async (context: { request: Request; env: Env }) => {
  try {
    const body: any = await context.request.json().catch(() => ({}));
    const code = body.code;
    const state = body.state;
    const redirectUri = extractRedirectUri(state, context.request.url, body.redirect_uri);

    if (!code) {
      return new Response(
        JSON.stringify({ type: 'LINKEDIN_AUTH_ERROR', error: 'Missing authorization code' }),
        { status: 400, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
      );
    }

    const result = await exchangeLinkedInOAuth(code, redirectUri, context.env);

    return new Response(
      JSON.stringify({
        type: 'LINKEDIN_AUTH_SUCCESS',
        email: result.email,
        user: result.user,
      }),
      { status: 200, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    console.error('LinkedIn OAuth Edge POST error:', err);
    return new Response(
      JSON.stringify({
        type: 'LINKEDIN_AUTH_ERROR',
        error: err.message || 'LinkedIn authentication failed on Cloudflare Edge',
      }),
      { status: 400, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
    );
  }
};
