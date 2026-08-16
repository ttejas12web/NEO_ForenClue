interface Env {
  LINKEDIN_CLIENT_ID?: string;
  VITE_LINKEDIN_CLIENT_ID?: string;
  [key: string]: any;
}

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export const onRequestOptions = async () => {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
};

export const onRequest = async (context: { request: Request; env: Env }) => {
  const url = new URL(context.request.url);
  const clientId = context.env.LINKEDIN_CLIENT_ID || context.env.VITE_LINKEDIN_CLIENT_ID || '86fnkfb4khjr8g';
  const redirectUri = url.searchParams.get('redirect_uri') || `${url.origin}/api/auth/linkedin/callback`;
  const state = url.searchParams.get('state') || 'auth_' + Math.random().toString(36).substring(7);
  const scope = 'openid profile email';

  const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}&scope=${encodeURIComponent(scope)}`;

  if (context.request.headers.get('accept')?.includes('application/json') || url.searchParams.get('json') === 'true') {
    return new Response(JSON.stringify({ authUrl, clientId, redirectUri, state }), {
      status: 200,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  }

  return Response.redirect(authUrl, 302);
};
