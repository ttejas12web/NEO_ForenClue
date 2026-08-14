interface Env {
  R2_BUCKET?: R2Bucket;
  BUCKET?: R2Bucket;
  STORAGE?: R2Bucket;
  FORENCLUE_R2?: R2Bucket;
  FORENCLUE_STORAGE?: R2Bucket;
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
