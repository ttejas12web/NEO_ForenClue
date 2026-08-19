export interface LinkedInEnv {
  LINKEDIN_CLIENT_ID?: string;
}

type RequestContext = {
  request: Request;
  env: LinkedInEnv;
};

const CALLBACK_PATH = '/api/auth/linkedin/callback';

function isAllowedOrigin(url: URL): boolean {
  return (
    url.origin === 'https://forenclue.in' ||
    url.origin === 'https://www.forenclue.in' ||
    (url.protocol === 'http:' && (url.hostname === 'localhost' || url.hostname === '127.0.0.1'))
  );
}

function getRedirectUri(request: Request): string {
  const requestUrl = new URL(request.url);
  const requested = requestUrl.searchParams.get('redirect_uri');
  const candidate = new URL(requested || CALLBACK_PATH, requestUrl.origin);

  if (!isAllowedOrigin(candidate) || candidate.pathname !== CALLBACK_PATH) {
    throw new Error('Invalid LinkedIn redirect URI.');
  }

  candidate.search = '';
  candidate.hash = '';
  return candidate.toString();
}

function randomState(redirectUri: string): string {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  const nonce = Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');
  return `${nonce}__${encodeURIComponent(redirectUri)}`;
}

export const onRequestGet = async ({ request, env }: RequestContext): Promise<Response> => {
  try {
    if (!env.LINKEDIN_CLIENT_ID) {
      return Response.json({ error: 'LinkedIn authentication is not configured.' }, { status: 503 });
    }

    const redirectUri = getRedirectUri(request);
    const requestUrl = new URL(request.url);
    const state = requestUrl.searchParams.get('state') || randomState(redirectUri);
    const authUrl = new URL('https://www.linkedin.com/oauth/v2/authorization');
    authUrl.search = new URLSearchParams({
      response_type: 'code',
      client_id: env.LINKEDIN_CLIENT_ID,
      redirect_uri: redirectUri,
      state,
      scope: 'openid profile email',
    }).toString();

    if (requestUrl.searchParams.get('json') === 'true' || request.headers.get('Accept')?.includes('application/json')) {
      return Response.json({ authUrl: authUrl.toString(), redirectUri, state }, {
        headers: { 'Cache-Control': 'no-store' },
      });
    }

    return Response.redirect(authUrl.toString(), 302);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to initialize LinkedIn authentication.';
    return Response.json({ error: message }, { status: 400 });
  }
};
