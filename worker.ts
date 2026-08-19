import { onRequestGet as initializeLinkedIn } from './functions/api/auth/linkedin/init';
import {
  onRequestGet as completeLinkedInGet,
  onRequestPost as completeLinkedInPost,
} from './functions/api/auth/linkedin/callback';

interface Env {
  ASSETS: {
    fetch(request: Request): Promise<Response>;
  };
  LINKEDIN_CLIENT_ID?: string;
  LINKEDIN_CLIENT_SECRET?: string;
}

const jsonError = (message: string, status: number): Response =>
  Response.json({ type: 'LINKEDIN_AUTH_ERROR', error: message }, {
    status,
    headers: { 'Cache-Control': 'no-store' },
  });

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const context = { request, env };

    if (url.pathname === '/api/auth/linkedin/init' || url.pathname === '/api/auth/linkedin/init/') {
      if (request.method !== 'GET') return jsonError('Method not allowed.', 405);
      return initializeLinkedIn(context);
    }

    if (url.pathname === '/api/auth/linkedin/callback' || url.pathname === '/api/auth/linkedin/callback/') {
      if (request.method === 'GET') return completeLinkedInGet(context);
      if (request.method === 'POST') return completeLinkedInPost(context);
      return jsonError('Method not allowed.', 405);
    }

    return env.ASSETS.fetch(request);
  },
};
