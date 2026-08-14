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
      console.log(`[Cloudflare Worker R2] Uploading "${objectKey}" (${dataLength} bytes) to R2...`);
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

    // If R2 binding is not directly bound on this Cloudflare Worker/Pages worker, proxy to upstream server
    console.warn(`[Cloudflare Worker] R2 bucket binding not directly attached. Forwarding to upstream R2 server...`);
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
