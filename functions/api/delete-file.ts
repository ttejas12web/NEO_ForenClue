interface Env {
  R2_BUCKET?: R2Bucket;
  BUCKET?: R2Bucket;
  STORAGE?: R2Bucket;
  FORENCLUE_R2?: R2Bucket;
  FORENCLUE_STORAGE?: R2Bucket;
  R2_CUSTOM_DOMAIN?: string;
  R2_PUBLIC_DOMAIN?: string;
  R2_ACCOUNT_ID?: string;
  R2_ACCESS_KEY_ID?: string;
  R2_SECRET_ACCESS_KEY?: string;
  R2_BUCKET_NAME?: string;
}

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
  'Access-Control-Max-Age': '86400',
};

function getR2Bucket(env: Env): R2Bucket | null {
  return env.R2_BUCKET || env.BUCKET || env.STORAGE || env.FORENCLUE_R2 || env.FORENCLUE_STORAGE || null;
}

// Web Crypto based AWS SigV4 implementation for Cloudflare Pages / Workers
async function hmacSha256(key: ArrayBuffer | Uint8Array, data: string | Uint8Array): Promise<ArrayBuffer> {
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    key,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const dataBytes = typeof data === 'string' ? new TextEncoder().encode(data) : data;
  return await crypto.subtle.sign('HMAC', cryptoKey, dataBytes);
}

async function sha256Hex(data: string | Uint8Array): Promise<string> {
  const dataBytes = typeof data === 'string' ? new TextEncoder().encode(data) : data;
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBytes);
  return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}

async function getSignatureKey(key: string, dateStamp: string, regionName: string, serviceName: string): Promise<ArrayBuffer> {
  const kDate = await hmacSha256(new TextEncoder().encode('AWS4' + key), dateStamp);
  const kRegion = await hmacSha256(kDate, regionName);
  const kService = await hmacSha256(kRegion, serviceName);
  return await hmacSha256(kService, 'aws4_request');
}

async function s3DeleteRequest(
  accountId: string,
  accessKeyId: string,
  secretAccessKey: string,
  bucketName: string,
  objectKey: string
): Promise<boolean> {
  try {
    const cleanAccountId = accountId.trim();
    const cleanBucket = bucketName.trim();
    const cleanKey = objectKey.replace(/^\/+/, '');
    const endpoint = `https://${cleanAccountId}.r2.cloudflarestorage.com/${cleanBucket}/${cleanKey}`;
    const url = new URL(endpoint);

    const now = new Date();
    const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, '');
    const dateStamp = amzDate.substring(0, 8);
    const region = 'auto';
    const service = 's3';

    const payload = new Uint8Array(0);
    const payloadHash = await sha256Hex(payload);

    const canonicalHeaders = 
      `host:${url.host}\n` +
      `x-amz-content-sha256:${payloadHash}\n` +
      `x-amz-date:${amzDate}\n`;
    
    const signedHeaders = 'host;x-amz-content-sha256;x-amz-date';

    const canonicalRequest = 
      'DELETE\n' +
      `/${cleanBucket}/${cleanKey}\n` +
      '\n' +
      canonicalHeaders +
      '\n' +
      signedHeaders +
      '\n' +
      payloadHash;

    const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`;
    const stringToSign = 
      'AWS4-HMAC-SHA256\n' +
      amzDate + '\n' +
      credentialScope + '\n' +
      (await sha256Hex(canonicalRequest));

    const signingKey = await getSignatureKey(secretAccessKey.trim(), dateStamp, region, service);
    const signatureBuffer = await hmacSha256(signingKey, stringToSign);
    const signatureHex = Array.from(new Uint8Array(signatureBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');

    const authorizationHeader = 
      `AWS4-HMAC-SHA256 Credential=${accessKeyId.trim()}/${credentialScope}, ` +
      `SignedHeaders=${signedHeaders}, ` +
      `Signature=${signatureHex}`;

    const res = await fetch(endpoint, {
      method: 'DELETE',
      headers: {
        'Host': url.host,
        'x-amz-date': amzDate,
        'x-amz-content-sha256': payloadHash,
        'Authorization': authorizationHeader,
      },
    });

    return res.ok || res.status === 404;
  } catch (e) {
    console.error('[Cloudflare Worker Delete S3 API Error]:', e);
    return false;
  }
}

export const onRequestOptions = async () => {
  return new Response(null, {
    status: 204,
    headers: CORS_HEADERS,
  });
};

export const onRequestPost = async (context: { request: Request; env: Env }) => {
  try {
    const { request, env } = context;
    const body = await request.json() as {
      fileUrl?: string;
      keyName?: string;
    };

    let targetKey = body.keyName;

    if (!targetKey && body.fileUrl) {
      const fileUrl = body.fileUrl;
      if (fileUrl.startsWith('data:') || fileUrl.startsWith('blob:') || fileUrl.startsWith('localdb://')) {
        return new Response(
          JSON.stringify({ success: true, isLocal: true, message: 'Local transient reference cleared.' }),
          { status: 200, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
        );
      }
      try {
        if (fileUrl.startsWith('http://') || fileUrl.startsWith('https://')) {
          const urlObj = new URL(fileUrl);
          targetKey = urlObj.pathname.replace(/^\/+/, '');
        } else {
          targetKey = fileUrl.replace(/^\/+/, '');
        }
      } catch {
        targetKey = fileUrl.replace(/^\/+/, '');
      }
    }

    if (!targetKey) {
      return new Response(
        JSON.stringify({ error: 'Missing fileUrl or keyName for deletion' }),
        { status: 400, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
      );
    }

    targetKey = decodeURIComponent(targetKey);
    const r2 = getR2Bucket(env);

    if (r2) {
      await r2.delete(targetKey);
      console.log(`[Cloudflare Worker R2] Successfully deleted object "${targetKey}" from R2.`);
      return new Response(
        JSON.stringify({
          success: true,
          keyName: targetKey,
          deletedFromR2: true,
          message: `Object "${targetKey}" permanently deleted from Cloudflare R2 storage.`,
        }),
        { status: 200, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
      );
    }

    const accountId = env.R2_ACCOUNT_ID;
    const accessKeyId = env.R2_ACCESS_KEY_ID;
    const secretAccessKey = env.R2_SECRET_ACCESS_KEY;
    const bucketName = env.R2_BUCKET_NAME || 'neo-forenclue';

    if (accountId && accessKeyId && secretAccessKey) {
      const s3Deleted = await s3DeleteRequest(accountId, accessKeyId, secretAccessKey, bucketName, targetKey);
      if (s3Deleted) {
        console.log(`[Cloudflare S3 API] Successfully deleted object "${targetKey}" from R2 bucket "${bucketName}".`);
        return new Response(
          JSON.stringify({
            success: true,
            keyName: targetKey,
            deletedFromR2: true,
            message: `Object "${targetKey}" permanently deleted via S3 API from Cloudflare R2 storage.`,
          }),
          { status: 200, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
        );
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        keyName: targetKey,
        deletedFromR2: false,
        message: `Deletion requested for "${targetKey}".`,
      }),
      { status: 200, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
    );

  } catch (err: any) {
    console.error('[Cloudflare Worker Delete Error]:', err);
    return new Response(
      JSON.stringify({ error: err.message || 'Failed to delete file from storage' }),
      { status: 500, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
    );
  }
};
