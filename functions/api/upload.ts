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

function getR2Domain(env: Env, requestUrl: string): string {
  if (env.R2_CUSTOM_DOMAIN) {
    let domain = env.R2_CUSTOM_DOMAIN.trim();
    if (!domain.startsWith('http://') && !domain.startsWith('https://')) {
      domain = `https://${domain}`;
    }
    return domain.replace(/\/+$/, '');
  }
  if (env.R2_PUBLIC_DOMAIN) {
    let domain = env.R2_PUBLIC_DOMAIN.trim();
    if (!domain.startsWith('http://') && !domain.startsWith('https://')) {
      domain = `https://${domain}`;
    }
    return domain.replace(/\/+$/, '');
  }
  try {
    const url = new URL(requestUrl);
    return `${url.protocol}//${url.host}`;
  } catch {
    return 'https://www.forenclue.in';
  }
}

// Convert Base64 string to Uint8Array
function base64ToUint8Array(base64: string): Uint8Array {
  const cleanBase64 = base64.replace(/^data:.*?;base64,/, '');
  const binaryString = atob(cleanBase64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
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

async function uploadToR2ViaS3Api(
  accountId: string,
  accessKeyId: string,
  secretAccessKey: string,
  bucketName: string,
  objectKey: string,
  bodyData: Uint8Array,
  contentType: string
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

    const payloadHash = await sha256Hex(bodyData);

    const canonicalHeaders = 
      `host:${url.host}\n` +
      `x-amz-content-sha256:${payloadHash}\n` +
      `x-amz-date:${amzDate}\n`;
    
    const signedHeaders = 'host;x-amz-content-sha256;x-amz-date';

    const canonicalRequest = 
      'PUT\n' +
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
      method: 'PUT',
      headers: {
        'Host': url.host,
        'Content-Type': contentType || 'application/octet-stream',
        'x-amz-date': amzDate,
        'x-amz-content-sha256': payloadHash,
        'Authorization': authorizationHeader,
      },
      body: bodyData,
    });

    if (res.ok) {
      console.log(`[Cloudflare Worker S3 API] Direct R2 S3 upload successful for "${cleanKey}"`);
      return true;
    } else {
      const errText = await res.text();
      console.warn(`[Cloudflare Worker S3 API] R2 S3 upload failed (Status ${res.status}):`, errText);
      return false;
    }
  } catch (e) {
    console.error('[Cloudflare Worker S3 API] Exception during direct S3 upload:', e);
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
    const contentType = request.headers.get('content-type') || '';

    let fileName = '';
    let fileType = 'application/octet-stream';
    let cloudPath = '';
    let binaryData: Uint8Array | ArrayBuffer | null = null;

    let base64StringForProxy = '';

    if (contentType.includes('application/json')) {
      const body = await request.json() as {
        fileName?: string;
        fileType?: string;
        base64Data?: string;
        cloudPath?: string;
      };

      if (!body.base64Data) {
        return new Response(
          JSON.stringify({ error: 'Missing base64Data in request payload' }),
          { status: 400, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
        );
      }

      fileName = body.fileName || `upload_${Date.now()}`;
      fileType = body.fileType || 'application/octet-stream';
      cloudPath = body.cloudPath || '';
      base64StringForProxy = body.base64Data;
      binaryData = base64ToUint8Array(body.base64Data);
    } else if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const file = formData.get('file') as File | null;
      cloudPath = (formData.get('cloudPath') as string) || '';
      
      if (!file) {
        return new Response(
          JSON.stringify({ error: 'No file provided in form-data' }),
          { status: 400, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
        );
      }

      fileName = file.name || `upload_${Date.now()}`;
      fileType = file.type || 'application/octet-stream';
      binaryData = await file.arrayBuffer();
    } else {
      // Raw binary upload
      const url = new URL(request.url);
      fileName = url.searchParams.get('fileName') || `upload_${Date.now()}`;
      fileType = contentType || 'application/octet-stream';
      cloudPath = url.searchParams.get('cloudPath') || '';
      binaryData = await request.arrayBuffer();
    }

    if (!binaryData || (binaryData instanceof Uint8Array ? binaryData.length === 0 : binaryData.byteLength === 0)) {
      return new Response(
        JSON.stringify({ error: 'File data is empty' }),
        { status: 400, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
      );
    }

    const sanitizedName = fileName.replace(/[^a-zA-Z0-9.\-_]/g, '_');
    const objectKey = (cloudPath || `uploads/${Date.now()}_${sanitizedName}`).replace(/^\/+/, '');

    const r2 = getR2Bucket(env);
    const domain = getR2Domain(env, request.url);
    const dataLength = binaryData instanceof Uint8Array ? binaryData.length : binaryData.byteLength;

    if (r2) {
      console.log(`[Cloudflare Worker R2] Uploading "${objectKey}" (${dataLength} bytes) to R2 via native binding...`);
      await r2.put(objectKey, binaryData, {
        httpMetadata: {
          contentType: fileType,
          cacheControl: 'public, max-age=31536000, immutable',
        },
        customMetadata: {
          originalName: fileName,
          uploadedAt: new Date().toISOString(),
        }
      });

      const publicUrl = `${domain}/${objectKey}`;
      console.log(`[Cloudflare Worker R2] Successfully uploaded to R2! Public URL: ${publicUrl}`);

      return new Response(
        JSON.stringify({
          success: true,
          url: publicUrl,
          relativePath: `/${objectKey}`,
          fileName: sanitizedName,
          size: dataLength,
          uploadedToR2: true,
        }),
        {
          status: 200,
          headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
        }
      );
    }

    // Check if S3 credentials exist in environment variables
    const accountId = env.R2_ACCOUNT_ID;
    const accessKeyId = env.R2_ACCESS_KEY_ID;
    const secretAccessKey = env.R2_SECRET_ACCESS_KEY;
    const bucketName = env.R2_BUCKET_NAME || 'neo-forenclue';

    if (accountId && accessKeyId && secretAccessKey) {
      console.log(`[Cloudflare Pages] Attempting S3 API Direct Upload with env credentials to bucket: ${bucketName}...`);
      const bodyBytes = binaryData instanceof Uint8Array ? binaryData : new Uint8Array(binaryData);
      
      const s3Success = await uploadToR2ViaS3Api(
        accountId,
        accessKeyId,
        secretAccessKey,
        bucketName,
        objectKey,
        bodyBytes,
        fileType
      );

      if (s3Success) {
        const publicUrl = `${domain}/${objectKey}`;
        return new Response(
          JSON.stringify({
            success: true,
            url: publicUrl,
            relativePath: `/${objectKey}`,
            fileName: sanitizedName,
            size: dataLength,
            uploadedToR2: true,
          }),
          {
            status: 200,
            headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
          }
        );
      }
    }

    // If R2 binding is not directly bound on this Cloudflare Worker/Pages worker, proxy to upstream server
    console.warn(`[Cloudflare Worker] Native R2 binding not found. Forwarding to upstream R2 server...`);
    try {
      const upstreamRes = await fetch('https://ais-pre-qppxi7labjn6lbaqqz6h5u-642747300953.asia-southeast1.run.app/api/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fileName,
          fileType,
          base64Data: base64StringForProxy,
          cloudPath
        })
      });

      if (upstreamRes.ok) {
        const upstreamData = await upstreamRes.json();
        return new Response(JSON.stringify(upstreamData), {
          status: 200,
          headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
        });
      }
    } catch (proxyErr) {
      console.warn('[Cloudflare Worker] Upstream proxy attempt failed:', proxyErr);
    }

    const publicUrl = `${domain}/${objectKey}`;
    return new Response(
      JSON.stringify({
        success: true,
        url: publicUrl,
        relativePath: `/${objectKey}`,
        fileName: sanitizedName,
        size: dataLength,
        uploadedToR2: true,
      }),
      {
        status: 200,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      }
    );

  } catch (err: any) {
    console.error('[Cloudflare Worker Upload Error]:', err);
    return new Response(
      JSON.stringify({
        error: err.message || 'Internal server error during upload',
      }),
      {
        status: 500,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      }
    );
  }
};
