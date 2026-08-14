interface Env {
  R2_BUCKET?: R2Bucket;
  BUCKET?: R2Bucket;
  STORAGE?: R2Bucket;
  FORENCLUE_R2?: R2Bucket;
  FORENCLUE_STORAGE?: R2Bucket;
  R2_CUSTOM_DOMAIN?: string;
  R2_PUBLIC_DOMAIN?: string;
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

    // Fallback if R2 binding not available
    const sanitizedName = (fileName || `upload_${Date.now()}`).replace(/[^a-zA-Z0-9.\-_]/g, '_');
    const finalObjectKey = (cloudPath || `uploads/${Date.now()}_${sanitizedName}`).replace(/^\/+/, '');
    const publicUrl = `${domain}/${finalObjectKey}`;

    if (chunkIndex === totalChunks - 1) {
      return new Response(
        JSON.stringify({
          success: true,
          url: publicUrl,
          relativePath: `/${finalObjectKey}`,
          fileName: sanitizedName,
          size: chunkData.length,
          uploadedToR2: false,
          isCompleted: true,
          warning: 'R2 bucket binding not detected; please ensure R2_BUCKET is bound in Cloudflare Dashboard.'
        }),
        {
          status: 200,
          headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
        }
      );
    }

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
