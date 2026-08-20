const SOCIAL_ORIGIN = 'https://forenclue.in';

function stableRevision(parts: unknown[]): string {
  const value = parts
    .filter((part) => part !== undefined && part !== null && String(part).trim())
    .map(String)
    .join('|');
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(36);
}

export function buildSocialShareUrl(
  pathname: string,
  params: Record<string, string | number>,
  revisionParts: unknown[],
): string {
  const url = new URL(pathname, SOCIAL_ORIGIN);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, String(value));
  }
  url.searchParams.set('v', stableRevision(revisionParts));
  return url.toString();
}

