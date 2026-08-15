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

async function s3Request(
  method: 'PUT' | 'GET' | 'DELETE',
  accountId: string,
  accessKeyId: string,
  secretAccessKey: string,
  bucketName: string,
  objectKey: string,
  bodyData?: Uint8Array | null,
  contentType?: string
): Promise<Response> {
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

  const payload = bodyData || new Uint8Array(0);
  const payloadHash = await sha256Hex(payload);

  const canonicalHeaders = 
    `host:${url.host}\n` +
    `x-amz-content-sha256:${payloadHash}\n` +
    `x-amz-date:${amzDate}\n`;
  
  const signedHeaders = 'host;x-amz-content-sha256;x-amz-date';

  const canonicalRequest = 
    `${method}\n` +
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

  const headers: Record<string, string> = {
    'Host': url.host,
    'x-amz-date': amzDate,
    'x-amz-content-sha256': payloadHash,
    'Authorization': authorizationHeader,
  };

  if (method === 'PUT' && contentType) {
    headers['Content-Type'] = contentType;
  }

  return await fetch(endpoint, {
    method,
    headers,
    body: method === 'PUT' ? payload : undefined,
  });
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
      uploadId: string;
      chunkIndex: number;
      totalChunks: number;
      fileName: string;
      fileType?: string;
      base64Data: string;
      cloudPath?: string;
    };

    const { uploadId, chunkIndex, totalChunks, fileName, fileType, base64Data, cloudPath } = body;

    if (!uploadId || chunkIndex === undefined || totalChunks === undefined || !base64Data) {
      return new Response(
        JSON.stringify({ error: 'Missing required chunk upload payload parameters' }),
        { status: 400, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
      );
    }

    const chunkData = base64ToUint8Array(base64Data);
    const r2 = getR2Bucket(env);
    const domain = getR2Domain(env, request.url);
    const tempChunkKey = `_temp_chunks/${uploadId}/chunk_${chunkIndex}`;

    // 1. Native Cloudflare R2 Binding Route
    if (r2) {
      // Store current chunk in temporary R2 prefix
      await r2.put(tempChunkKey, chunkData, {
        httpMetadata: { contentType: 'application/octet-stream' },
        customMetadata: { uploadId, chunkIndex: String(chunkIndex), totalChunks: String(totalChunks) }
      });

      // If it is the last chunk, assemble all pieces
      if (chunkIndex === totalChunks - 1) {
        console.log(`[Cloudflare Worker R2] Last chunk received for ${uploadId}. Stitching all ${totalChunks} chunks...`);
        
        // Fetch all chunks
        const chunkBuffers: Uint8Array[] = [];
        let totalByteLength = 0;

        for (let i = 0; i < totalChunks; i++) {
          const key = `_temp_chunks/${uploadId}/chunk_${i}`;
          const obj = await r2.get(key);
          if (!obj) {
            throw new Error(`Missing expected chunk ${i} at ${key}`);
          }
          const buf = new Uint8Array(await obj.arrayBuffer());
          chunkBuffers.push(buf);
          totalByteLength += buf.length;
        }

        // Merge into single Uint8Array
        const consolidated = new Uint8Array(totalByteLength);
        let offset = 0;
        for (const buf of chunkBuffers) {
          consolidated.set(buf, offset);
          offset += buf.length;
        }

        const sanitizedName = (fileName || `upload_${Date.now()}`).replace(/[^a-zA-Z0-9.\-_]/g, '_');
        const finalObjectKey = (cloudPath || `uploads/${Date.now()}_${sanitizedName}`).replace(/^\/+/, '');

        // Write final object to R2
        await r2.put(finalObjectKey, consolidated, {
          httpMetadata: {
            contentType: fileType || 'application/octet-stream',
            cacheControl: 'public, max-age=31536000, immutable',
          },
          customMetadata: {
            originalName: fileName || sanitizedName,
            uploadedAt: new Date().toISOString(),
          }
        });

        // Clean up temporary chunks in background
        for (let i = 0; i < totalChunks; i++) {
          r2.delete(`_temp_chunks/${uploadId}/chunk_${i}`).catch(() => {});
        }

        const publicUrl = `${domain}/${finalObjectKey}`;
        console.log(`[Cloudflare Worker R2] Multi-part chunked upload complete! Public URL: ${publicUrl}`);

        return new Response(
          JSON.stringify({
            success: true,
            url: publicUrl,
            relativePath: `/${finalObjectKey}`,
            fileName: sanitizedName,
            size: totalByteLength,
            uploadedToR2: true,
            isCompleted: true,
          }),
          {
            status: 200,
            headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
          }
        );
      }

      // Intermediate chunk saved successfully
      return new Response(
        JSON.stringify({
          success: true,
          uploadId,
          chunkIndex,
          totalChunks,
          isCompleted: false,
        }),
        {
          status: 200,
          headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
        }
      );
    }

    // 2. Direct S3 SigV4 API Route with env credentials (R2_ACCESS_KEY_ID & R2_SECRET_ACCESS_KEY)
    const accountId = env.R2_ACCOUNT_ID;
    const accessKeyId = env.R2_ACCESS_KEY_ID;
    const secretAccessKey = env.R2_SECRET_ACCESS_KEY;
    const bucketName = env.R2_BUCKET_NAME || 'neo-forenclue';

    if (accountId && accessKeyId && secretAccessKey) {
      // Save chunk to S3 temp location
      const putRes = await s3Request(
        'PUT',
        accountId,
        accessKeyId,
        secretAccessKey,
        bucketName,
        tempChunkKey,
        chunkData,
        'application/octet-stream'
      );

      if (!putRes.ok) {
        const errText = await putRes.text();
        console.warn(`[Cloudflare S3 Chunk Upload] S3 chunk PUT failed (${putRes.status}):`, errText);
        throw new Error(`S3 chunk upload failed with status ${putRes.status}`);
      }

      // If it is the last chunk, fetch all and assemble
      if (chunkIndex === totalChunks - 1) {
        console.log(`[Cloudflare S3 Chunk Upload] Final chunk received for ${uploadId}. Consolidating ${totalChunks} chunks via S3 API...`);
        const chunkBuffers: Uint8Array[] = [];
        let totalByteLength = 0;

        for (let i = 0; i < totalChunks; i++) {
          const key = `_temp_chunks/${uploadId}/chunk_${i}`;
          const getRes = await s3Request(
            'GET',
            accountId,
            accessKeyId,
            secretAccessKey,
            bucketName,
            key
          );

          if (!getRes.ok) {
            throw new Error(`Missing expected S3 chunk ${i} at ${key} (${getRes.status})`);
          }

          const buf = new Uint8Array(await getRes.arrayBuffer());
          chunkBuffers.push(buf);
          totalByteLength += buf.length;
        }

        // Merge buffers
        const consolidated = new Uint8Array(totalByteLength);
        let offset = 0;
        for (const buf of chunkBuffers) {
          consolidated.set(buf, offset);
          offset += buf.length;
        }

        const sanitizedName = (fileName || `upload_${Date.now()}`).replace(/[^a-zA-Z0-9.\-_]/g, '_');
        const finalObjectKey = (cloudPath || `uploads/${Date.now()}_${sanitizedName}`).replace(/^\/+/, '');

        // Upload final consolidated file to R2 bucket
        const finalPutRes = await s3Request(
          'PUT',
          accountId,
          accessKeyId,
          secretAccessKey,
          bucketName,
          finalObjectKey,
          consolidated,
          fileType || 'application/octet-stream'
        );

        if (!finalPutRes.ok) {
          const errText = await finalPutRes.text();
          throw new Error(`Final consolidated S3 PUT failed (${finalPutRes.status}): ${errText}`);
        }

        // Clean up temp chunks asynchronously
        for (let i = 0; i < totalChunks; i++) {
          s3Request(
            'DELETE',
            accountId,
            accessKeyId,
            secretAccessKey,
            bucketName,
            `_temp_chunks/${uploadId}/chunk_${i}`
          ).catch(() => {});
        }

        const publicUrl = `${domain}/${finalObjectKey}`;
        console.log(`[Cloudflare S3 Chunk Upload] All chunks stitched successfully! Public URL: ${publicUrl}`);

        return new Response(
          JSON.stringify({
            success: true,
            url: publicUrl,
            relativePath: `/${finalObjectKey}`,
            fileName: sanitizedName,
            size: totalByteLength,
            uploadedToR2: true,
            isCompleted: true,
          }),
          {
            status: 200,
            headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
          }
        );
      }

      // Intermediate chunk saved successfully
      return new Response(
        JSON.stringify({
          success: true,
          uploadId,
          chunkIndex,
          totalChunks,
          isCompleted: false,
        }),
        {
          status: 200,
          headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
        }
      );
    }

    // 3. Fallback: Proxy to upstream backend server
    try {
      const upstreamRes = await fetch('https://ais-pre-qppxi7labjn6lbaqqz6h5u-642747300953.asia-southeast1.run.app/api/upload-chunk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      if (upstreamRes.ok) {
        const data = await upstreamRes.json();
        return new Response(JSON.stringify(data), {
          status: 200,
          headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
        });
      }
    } catch (proxyErr) {
      console.warn('[Cloudflare Worker] Upstream chunk proxy failed:', proxyErr);
    }

    throw new Error('No active R2 binding or S3 environment variables configured on this deployment.');

  } catch (err: any) {
    console.error('[Cloudflare Worker Chunk Upload Error]:', err);
    return new Response(
      JSON.stringify({
        error: err.message || 'Failed to process chunk in worker',
      }),
      {
        status: 500,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      }
    );
  }
};
