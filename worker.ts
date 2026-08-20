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
  LINKEDIN_FIREBASE_SESSION_SECRET?: string;
  FIREBASE_API_KEY?: string;
  FIREBASE_PROJECT_ID?: string;
  FIRESTORE_DATABASE_ID?: string;
}

interface SocialMetadata {
  title: string;
  description: string;
  image: string;
  canonicalUrl: string;
  type: 'website' | 'article' | 'book' | 'profile';
  dynamic: boolean;
}

interface DynamicTarget {
  collection: string;
  documentId: string;
  type: SocialMetadata['type'];
  label: string;
}

interface FirestoreValue {
  stringValue?: string;
  integerValue?: string;
  doubleValue?: number;
  booleanValue?: boolean;
  timestampValue?: string;
  nullValue?: null;
  arrayValue?: { values?: FirestoreValue[] };
  mapValue?: { fields?: Record<string, FirestoreValue> };
}

interface FirestoreDocument {
  fields?: Record<string, FirestoreValue>;
}

interface HtmlRewriterElement {
  remove(): void;
  prepend(content: string, options?: { html?: boolean }): void;
}

interface HtmlRewriterHandler {
  element?(element: HtmlRewriterElement): void | Promise<void>;
}

interface HtmlRewriterInstance {
  on(selector: string, handler: HtmlRewriterHandler): HtmlRewriterInstance;
  transform(response: Response): Response;
}

declare const HTMLRewriter: {
  new (): HtmlRewriterInstance;
};

const SITE_ORIGIN = 'https://www.forenclue.in';
const MAX_SOCIAL_IMAGE_BYTES = 5 * 1024 * 1024;
const DEFAULT_IMAGE =
  'https://blogger.googleusercontent.com/img/a/AVvXsEg_OeYXV0qnZe42fjD2ty2vBNDGqhWPnOjQBOiWFbkDcCaUa0Pl5sJyixMvmxEhAKoLMU9A4A2bjvxrpEuGG_jKX7q2su81OGr9eSt3DUWNwQVufTdGQI_NSKBcZduRx-7jyn3dMmQVb4o6Qom_9Ul2qen9YS8c-h2W5PTda-U8x6JsAasJG_3lHFitvX0';

const ROUTE_DEFAULTS: Record<string, Omit<SocialMetadata, 'canonicalUrl' | 'dynamic'>> = {
  '/': {
    title: 'ForenClue | Your Partner in Forensic Precision',
    description:
      "India's dedicated forensic science education platform for practical learning, case studies, simulations, quizzes, and professional resources.",
    image: DEFAULT_IMAGE,
    type: 'website',
  },
  '/ebooks': {
    title: 'Academic eLibrary - Reference Textbook Vault | ForenClue',
    description:
      'Access forensic textbooks, research papers, academic notes, laboratory manuals, and reference resources in the ForenClue eLibrary.',
    image: `${SITE_ORIGIN}/images/og/library.png`,
    type: 'website',
  },
  '/cases': {
    title: 'Forensic Case Studies | ForenClue',
    description:
      'Explore evidence-led forensic case studies, investigative methods, findings, and professional learning resources.',
    image: DEFAULT_IMAGE,
    type: 'website',
  },
  '/courses': {
    title: 'Forensic Science Courses | ForenClue',
    description:
      'Explore practical forensic science courses, structured learning paths, and professional training from ForenClue.',
    image: DEFAULT_IMAGE,
    type: 'website',
  },
  '/quizzes': {
    title: 'Forensic Quizzes and Assessments | ForenClue',
    description:
      'Test forensic science knowledge through live challenges, practice quizzes, and structured assessments.',
    image: DEFAULT_IMAGE,
    type: 'website',
  },
  '/webinar': {
    title: 'Forensic Webinars and Events | ForenClue',
    description:
      'Watch forensic science webinars, expert sessions, and professional events from the ForenClue community.',
    image: `${SITE_ORIGIN}/images/og/webinars.png`,
    type: 'website',
  },
  '/employees': {
    title: 'Verify ForenClue ID Card | ForenClue',
    description: 'Verify an official ForenClue employee, volunteer, or contributor credential.',
    image: DEFAULT_IMAGE,
    type: 'website',
  },
  '/colleges': {
    title: 'Forensic Science Colleges | ForenClue',
    description: 'Discover forensic science colleges, courses, admissions information, and academic pathways.',
    image: DEFAULT_IMAGE,
    type: 'website',
  },
  '/podcast': {
    title: 'Forensic Podcast | ForenClue',
    description: 'Listen to forensic science discussions, expert interviews, and investigative insights.',
    image: DEFAULT_IMAGE,
    type: 'website',
  },
  '/simulations': {
    title: 'Virtual Forensic Labs | ForenClue',
    description: 'Practice forensic laboratory skills through interactive virtual simulations.',
    image: DEFAULT_IMAGE,
    type: 'website',
  },
  '/files': {
    title: 'Careers in Forensic Science Handbook | ForenClue',
    description: 'Explore forensic science careers, pathways, entrance examinations, and admission guidance.',
    image: DEFAULT_IMAGE,
    type: 'book',
  },
};

const jsonError = (message: string, status: number): Response =>
  Response.json(
    { type: 'LINKEDIN_AUTH_ERROR', error: message },
    { status, headers: { 'Cache-Control': 'no-store' } },
  );

function decodeFirestoreValue(value: FirestoreValue): unknown {
  if ('stringValue' in value) return value.stringValue ?? '';
  if ('integerValue' in value) return Number(value.integerValue);
  if ('doubleValue' in value) return value.doubleValue;
  if ('booleanValue' in value) return value.booleanValue;
  if ('timestampValue' in value) return value.timestampValue;
  if ('nullValue' in value) return null;
  if ('arrayValue' in value) {
    return (value.arrayValue?.values ?? []).map(decodeFirestoreValue);
  }
  if ('mapValue' in value) {
    return decodeFirestoreFields(value.mapValue?.fields ?? {});
  }
  return undefined;
}

function decodeFirestoreFields(fields: Record<string, FirestoreValue>): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(fields).map(([key, value]) => [key, decodeFirestoreValue(value)]),
  );
}

function valueAtPath(data: Record<string, unknown>, path: string): unknown {
  return path.split('.').reduce<unknown>((current, segment) => {
    if (!current || typeof current !== 'object' || Array.isArray(current)) return undefined;
    return (current as Record<string, unknown>)[segment];
  }, data);
}

function firstText(data: Record<string, unknown>, paths: string[]): string {
  for (const path of paths) {
    const value = valueAtPath(data, path);
    if (typeof value === 'string' && value.trim()) return value.trim();
    if (typeof value === 'number' && Number.isFinite(value)) return String(value);
  }
  return '';
}

function truncate(value: string, maxLength: number): string {
  const normalized = value.replace(/\s+/g, ' ').trim();
  if (normalized.length <= maxLength) return normalized;
  return `${normalized.slice(0, maxLength - 1).trimEnd()}…`;
}

function absoluteUrl(value: string, fallback: string): string {
  if (!value) return fallback;
  try {
    return new URL(value, SITE_ORIGIN).toString();
  } catch {
    return fallback;
  }
}

function socialImageUrl(value: string, fallback: string): string {
  if (!value) return fallback;

  if (value.startsWith('firestore-blob://')) {
    const blobId = value.slice('firestore-blob://'.length);
    if (/^[a-zA-Z0-9_-]{1,128}$/.test(blobId)) {
      return `${SITE_ORIGIN}/api/social-image/${encodeURIComponent(blobId)}`;
    }
    return fallback;
  }

  // Browser-local and inline URLs cannot be fetched by social crawlers.
  if (value.startsWith('localdb://') || value.startsWith('blob:') || value.startsWith('data:')) {
    return fallback;
  }

  return absoluteUrl(value, fallback);
}

function firestoreDocumentsUrl(env: Env, pathSegments: string[]): URL {
  const projectId = env.FIREBASE_PROJECT_ID || 'gen-lang-client-0244976845';
  const databaseId =
    env.FIRESTORE_DATABASE_ID || 'ai-studio-forenclue-b34a37b4-310e-4cb1-a96f-b72c4dfcd96e';
  const encodedPath = pathSegments.map(encodeURIComponent).join('/');
  const endpoint = new URL(
    `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(projectId)}/databases/${encodeURIComponent(databaseId)}/documents/${encodedPath}`,
  );
  if (env.FIREBASE_API_KEY) endpoint.searchParams.set('key', env.FIREBASE_API_KEY);
  return endpoint;
}

function decodeBase64DataUrl(value: string): Uint8Array | undefined {
  const separator = value.indexOf(',');
  const base64 = separator >= 0 ? value.slice(separator + 1) : value;
  if (!base64) return undefined;

  try {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let index = 0; index < binary.length; index += 1) {
      bytes[index] = binary.charCodeAt(index);
    }
    return bytes;
  } catch {
    return undefined;
  }
}

async function serveFirestoreSocialImage(
  request: Request,
  env: Env,
  encodedBlobId: string,
): Promise<Response> {
  let blobId = '';
  try {
    blobId = decodeURIComponent(encodedBlobId);
  } catch {
    return new Response('Invalid image identifier.', { status: 400 });
  }

  if (!/^[a-zA-Z0-9_-]{1,128}$/.test(blobId)) {
    return new Response('Invalid image identifier.', { status: 400 });
  }

  const metadataResponse = await fetch(firestoreDocumentsUrl(env, ['_cloud_blobs', blobId]), {
    headers: { Accept: 'application/json' },
  });
  if (!metadataResponse.ok) return new Response('Image not found.', { status: 404 });

  const metadataDocument = (await metadataResponse.json()) as FirestoreDocument;
  const metadata = decodeFirestoreFields(metadataDocument.fields ?? {});
  const mimeType = typeof metadata.mimeType === 'string' ? metadata.mimeType : '';
  const size = typeof metadata.size === 'number' ? metadata.size : 0;
  const totalChunks = typeof metadata.totalChunks === 'number' ? metadata.totalChunks : 0;

  if (!mimeType.startsWith('image/')) return new Response('Unsupported image type.', { status: 415 });
  if (!size || size > MAX_SOCIAL_IMAGE_BYTES || !totalChunks || totalChunks > 20) {
    return new Response('Image is too large.', { status: 413 });
  }

  const headers = new Headers({
    'Content-Type': mimeType,
    'Content-Length': String(size),
    'Cache-Control': 'public, max-age=86400, s-maxage=604800, immutable',
    'Access-Control-Allow-Origin': '*',
    'X-Content-Type-Options': 'nosniff',
  });
  if (request.method === 'HEAD') return new Response(null, { status: 200, headers });

  // Fetch deterministic document IDs directly. Firestore can allow individual
  // chunk reads while denying collection-list queries under stricter rules.
  const chunkResponses = await Promise.all(
    Array.from({ length: totalChunks }, (_, index) =>
      fetch(firestoreDocumentsUrl(env, ['_cloud_blobs', blobId, 'chunks', `chunk_${index}`]), {
        headers: { Accept: 'application/json' },
      }),
    ),
  );
  if (chunkResponses.some((response) => !response.ok)) {
    return new Response('Image data unavailable.', { status: 502 });
  }

  const chunkDocuments = await Promise.all(
    chunkResponses.map((response) => response.json() as Promise<FirestoreDocument>),
  );
  const chunks = chunkDocuments
    .map((document) => decodeFirestoreFields(document.fields ?? {}))
    .map((chunk) => ({
      index: typeof chunk.chunkIndex === 'number' ? chunk.chunkIndex : -1,
      bytes: typeof chunk.data === 'string' ? decodeBase64DataUrl(chunk.data) : undefined,
    }))
    .filter((chunk): chunk is { index: number; bytes: Uint8Array } =>
      chunk.index >= 0 && Boolean(chunk.bytes),
    )
    .sort((left, right) => left.index - right.index);

  if (chunks.length !== totalChunks || chunks.some((chunk, index) => chunk.index !== index)) {
    return new Response('Image data is incomplete.', { status: 502 });
  }

  const assembledLength = chunks.reduce((total, chunk) => total + chunk.bytes.byteLength, 0);
  if (assembledLength !== size || assembledLength > MAX_SOCIAL_IMAGE_BYTES) {
    return new Response('Image data is invalid.', { status: 502 });
  }

  const assembled = new Uint8Array(assembledLength);
  let offset = 0;
  for (const chunk of chunks) {
    assembled.set(chunk.bytes, offset);
    offset += chunk.bytes.byteLength;
  }

  return new Response(assembled.buffer, { status: 200, headers });
}

function humanize(value: string): string {
  return decodeURIComponent(value)
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
    .trim();
}

function routeRoot(pathname: string): string {
  const firstSegment = pathname.split('/').filter(Boolean)[0];
  return firstSegment ? `/${firstSegment}` : '/';
}

function canonicalFor(url: URL, target?: DynamicTarget): string {
  const canonical = new URL(url.pathname, SITE_ORIGIN);
  if (target) {
    if (url.pathname === '/ebooks') canonical.searchParams.set('id', target.documentId);
    if (url.pathname === '/cases') canonical.searchParams.set('case', target.documentId);
    if (url.pathname === '/courses') canonical.searchParams.set('id', target.documentId);
    if (url.pathname === '/employees') canonical.searchParams.set('id', target.documentId);
  } else if (url.pathname === '/webinar') {
    const eventId = url.searchParams.get('id') || url.searchParams.get('event');
    if (eventId) canonical.searchParams.set('id', eventId);
  }
  return canonical.toString();
}

function getDynamicTarget(url: URL): DynamicTarget | undefined {
  const path = url.pathname.replace(/\/$/, '') || '/';

  if (path === '/ebooks') {
    const id = url.searchParams.get('id');
    if (id) return { collection: 'ebooks', documentId: id, type: 'book', label: 'eLibrary' };
  }

  if (path === '/cases') {
    const id = url.searchParams.get('case');
    if (id) return { collection: 'cases', documentId: id, type: 'article', label: 'Case Study' };
  }

  const caseMatch = path.match(/^\/(?:cases|case-studies)\/([^/]+)$/);
  if (caseMatch) {
    return { collection: 'cases', documentId: caseMatch[1], type: 'article', label: 'Case Study' };
  }

  if (path === '/courses') {
    const id = url.searchParams.get('id');
    if (id) return { collection: 'courses', documentId: id, type: 'article', label: 'Course' };
  }

  const courseMatch = path.match(/^\/player\/([^/]+)$/);
  if (courseMatch) {
    return { collection: 'courses', documentId: courseMatch[1], type: 'article', label: 'Course' };
  }

  const quizMatch = path.match(/^\/quizzes\/([^/]+)(?:\/leaderboard)?$/);
  if (quizMatch) {
    return { collection: 'quizzes', documentId: quizMatch[1], type: 'article', label: 'Quiz' };
  }

  const collegeMatch = path.match(/^\/(?:colleges|college)\/([^/]+)$/);
  if (collegeMatch) {
    return { collection: 'colleges', documentId: collegeMatch[1], type: 'article', label: 'College' };
  }

  if (path === '/employees') {
    const id = url.searchParams.get('id');
    if (id) {
      const normalizedId = id.toUpperCase().trim().replace(/[\/\s]/g, '_');
      return { collection: 'employees', documentId: normalizedId, type: 'profile', label: 'Verified Profile' };
    }
  }

  return undefined;
}

async function fetchFirestoreDocument(
  env: Env,
  target: DynamicTarget,
): Promise<Record<string, unknown> | undefined> {
  if (!env.FIREBASE_API_KEY) return undefined;

  const endpoint = firestoreDocumentsUrl(env, [target.collection, target.documentId]);

  try {
    const response = await fetch(endpoint, {
      headers: { Accept: 'application/json' },
    });
    if (!response.ok) {
      console.warn(
        JSON.stringify({
          event: 'social_metadata_document_unavailable',
          collection: target.collection,
          documentId: target.documentId,
          status: response.status,
        }),
      );
      return undefined;
    }
    const document = (await response.json()) as FirestoreDocument;
    return decodeFirestoreFields(document.fields ?? {});
  } catch (error) {
    console.warn(
      JSON.stringify({
        event: 'social_metadata_fetch_failed',
        collection: target.collection,
        documentId: target.documentId,
        message: error instanceof Error ? error.message : 'Unknown error',
      }),
    );
    return undefined;
  }
}

function baseMetadata(url: URL): SocialMetadata {
  const path = url.pathname.replace(/\/$/, '') || '/';
  const defaults = ROUTE_DEFAULTS[path] || ROUTE_DEFAULTS[routeRoot(path)] || ROUTE_DEFAULTS['/'];

  if (path === '/webinar') {
    const eventId = url.searchParams.get('id') || url.searchParams.get('event');
    if (eventId) {
      return {
        ...defaults,
        title: `${humanize(eventId)} | ForenClue Webinar`,
        canonicalUrl: canonicalFor(url),
        dynamic: false,
      };
    }
  }

  if (!ROUTE_DEFAULTS[path] && path !== '/') {
    const lastSegment = path.split('/').filter(Boolean).at(-1);
    if (lastSegment) {
      return {
        ...defaults,
        title: `${humanize(lastSegment)} | ForenClue`,
        canonicalUrl: canonicalFor(url),
        dynamic: false,
      };
    }
  }

  return { ...defaults, canonicalUrl: canonicalFor(url), dynamic: false };
}

function metadataFromDocument(
  url: URL,
  target: DynamicTarget,
  data: Record<string, unknown>,
  fallback: SocialMetadata,
): SocialMetadata {
  const rawTitle = firstText(data, ['title', 'name', 'fullName', 'courseTitle', 'quizTitle']);
  if (!rawTitle) return fallback;

  const rawDescription = firstText(data, [
    'desc',
    'description',
    'summary',
    'subtitle',
    'abstract',
    'overview',
    'bio',
    'position',
  ]);
  const author = firstText(data, [
    'author',
    'uploaderName',
    'uploadedBy',
    'instructor',
    'speaker.name',
    'fullName',
  ]);
  const category = firstText(data, ['category', 'type', 'department', 'subject']);
  const image = firstText(data, [
    'image',
    'coverImage',
    'coverUrl',
    'thumbnailUrl',
    'thumbnail',
    'poster',
    'bannerImage',
    'imageUrl',
    'avatar',
    'speaker.avatar',
  ]);

  const contextualDescription = [rawDescription, author ? `By ${author}.` : '', category ? `${category}.` : '']
    .filter(Boolean)
    .join(' ');
  const titleSuffix = url.pathname.endsWith('/leaderboard')
    ? 'Leaderboard | ForenClue'
    : `${target.label} | ForenClue`;

  return {
    title: `${truncate(rawTitle, 90)} | ${titleSuffix}`,
    description: truncate(contextualDescription || fallback.description, 220),
    image: socialImageUrl(image, fallback.image),
    canonicalUrl: canonicalFor(url, target),
    type: target.type,
    dynamic: true,
  };
}

async function resolveMetadata(url: URL, env: Env): Promise<SocialMetadata> {
  const fallback = baseMetadata(url);
  const target = getDynamicTarget(url);
  if (!target) return fallback;

  const document = await fetchFirestoreDocument(env, target);
  return document ? metadataFromDocument(url, target, document, fallback) : fallback;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function metadataMarkup(metadata: SocialMetadata): string {
  const title = escapeHtml(metadata.title);
  const description = escapeHtml(metadata.description);
  const image = escapeHtml(metadata.image);
  const canonicalUrl = escapeHtml(metadata.canonicalUrl);
  const type = escapeHtml(metadata.type);

  return [
    `<title>${title}</title>`,
    `<meta name="description" content="${description}">`,
    `<link rel="canonical" href="${canonicalUrl}">`,
    `<meta property="og:site_name" content="ForenClue">`,
    `<meta property="og:type" content="${type}">`,
    `<meta property="og:title" content="${title}">`,
    `<meta property="og:description" content="${description}">`,
    `<meta property="og:image" content="${image}">`,
    `<meta property="og:image:alt" content="${title}">`,
    `<meta property="og:url" content="${canonicalUrl}">`,
    '<meta name="twitter:card" content="summary_large_image">',
    `<meta name="twitter:title" content="${title}">`,
    `<meta name="twitter:description" content="${description}">`,
    `<meta name="twitter:image" content="${image}">`,
  ].join('');
}

function rewriteHtml(response: Response, metadata: SocialMetadata): Response {
  const removeHandler = {
    element(element: HtmlRewriterElement): void {
      element.remove();
    },
  };

  let rewriter = new HTMLRewriter();
  for (const selector of [
    'title',
    'meta[name="description"]',
    'link[rel="canonical"]',
    'meta[property^="og:"]',
    'meta[name^="twitter:"]',
  ]) {
    rewriter = rewriter.on(selector, removeHandler);
  }
  rewriter = rewriter.on('head', {
    element(element: HtmlRewriterElement) {
      element.prepend(metadataMarkup(metadata), { html: true });
    },
  });

  const transformed = rewriter.transform(response);
  const headers = new Headers(transformed.headers);
  headers.set(
    'Cache-Control',
    metadata.dynamic
      ? 'public, max-age=0, s-maxage=300, stale-while-revalidate=86400'
      : 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
  );
  headers.set('X-Content-Type-Options', 'nosniff');

  return new Response(transformed.body, {
    status: transformed.status,
    statusText: transformed.statusText,
    headers,
  });
}

function isFileRequest(pathname: string): boolean {
  return /\.[a-zA-Z0-9]{1,8}$/.test(pathname) && !pathname.endsWith('.html');
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const context = { request, env };

    const socialImageMatch = url.pathname.match(/^\/api\/social-image\/([^/]+)$/);
    if (socialImageMatch) {
      if (request.method !== 'GET' && request.method !== 'HEAD') {
        return new Response('Method not allowed.', { status: 405, headers: { Allow: 'GET, HEAD' } });
      }
      return serveFirestoreSocialImage(request, env, socialImageMatch[1]);
    }

    if (url.pathname === '/api/auth/linkedin/init' || url.pathname === '/api/auth/linkedin/init/') {
      if (request.method !== 'GET') return jsonError('Method not allowed.', 405);
      return initializeLinkedIn(context);
    }

    if (
      url.pathname === '/api/auth/linkedin/callback' ||
      url.pathname === '/api/auth/linkedin/callback/'
    ) {
      if (request.method === 'GET') return completeLinkedInGet(context);
      if (request.method === 'POST') return completeLinkedInPost(context);
      return jsonError('Method not allowed.', 405);
    }

    if (request.method !== 'GET' || isFileRequest(url.pathname)) {
      return env.ASSETS.fetch(request);
    }

    const assetResponse = await env.ASSETS.fetch(request);
    const contentType = assetResponse.headers.get('content-type') || '';
    if (!assetResponse.ok || !contentType.includes('text/html')) return assetResponse;

    const metadata = await resolveMetadata(url, env);
    return rewriteHtml(assetResponse, metadata);
  },
};
