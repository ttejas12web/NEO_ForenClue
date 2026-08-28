/**
 * Utility to compress images on the client side before upload
 */
export async function compressImage(file: File, maxWidth = 1200, quality = 0.7): Promise<Blob> {
  return new Promise((resolve) => {
    if (!file || !(file instanceof Blob) || !file.type.startsWith('image/')) {
      return resolve(file);
    }

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        try {
          const img = new Image();
          img.src = event.target?.result as string;
          img.onload = () => {
            try {
              const canvas = document.createElement('canvas');
              let width = img.width;
              let height = img.height;

              if (width > maxWidth) {
                height = Math.round((height * maxWidth) / width);
                width = maxWidth;
              }

              canvas.width = width;
              canvas.height = height;

              const ctx = canvas.getContext('2d');
              if (!ctx) {
                console.warn('Canvas context unavailable for image compression, returning raw file');
                return resolve(file);
              }

              ctx.drawImage(img, 0, 0, width, height);

              canvas.toBlob(
                (blob) => {
                  if (blob) {
                    resolve(blob);
                  } else {
                    console.warn('Canvas toBlob returned null, returning raw file');
                    resolve(file);
                  }
                },
                'image/jpeg',
                quality
              );
            } catch (err) {
              console.warn('Canvas compression error, returning raw file:', err);
              resolve(file);
            }
          };
          img.onerror = (err) => {
            console.warn('Image element failed to load data URL, returning raw file:', err);
            resolve(file);
          };
        } catch (err) {
          console.warn('FileReader onload handler error, returning raw file:', err);
          resolve(file);
        }
      };
      reader.onerror = (err) => {
        console.warn('FileReader failed to read image file, returning raw file:', err);
        resolve(file);
      };
    } catch (err) {
      console.warn('compressImage exception, returning raw file:', err);
      resolve(file);
    }
  });
}

const SOCIAL_PREVIEW_WIDTH = 1200;
const SOCIAL_PREVIEW_HEIGHT = 630;
const SOCIAL_PREVIEW_MAX_BYTES = 550 * 1024;

function canvasToJpeg(canvas: HTMLCanvasElement, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => blob ? resolve(blob) : reject(new Error('Could not encode the social preview image.')),
      'image/jpeg',
      quality,
    );
  });
}

/**
 * Produces a WhatsApp/Open Graph-ready 1200x630 JPEG while preserving the
 * center of the source image. The quality is reduced only as far as needed to
 * keep the result below the crawler delivery limit.
 */
export async function createSocialPreviewImage(file: File | Blob): Promise<Blob> {
  if (!file || !(file instanceof Blob) || !file.type.startsWith('image/')) {
    throw new Error('A valid image is required to create a social preview.');
  }

  const objectUrl = URL.createObjectURL(file);
  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const element = new Image();
      element.onload = () => resolve(element);
      element.onerror = () => reject(new Error('Could not decode the social preview image.'));
      element.src = objectUrl;
    });

    const canvas = document.createElement('canvas');
    canvas.width = SOCIAL_PREVIEW_WIDTH;
    canvas.height = SOCIAL_PREVIEW_HEIGHT;
    const context = canvas.getContext('2d', { alpha: false });
    if (!context) throw new Error('Canvas is unavailable for social preview generation.');

    context.fillStyle = '#111111';
    context.fillRect(0, 0, canvas.width, canvas.height);

    const scale = Math.max(canvas.width / image.naturalWidth, canvas.height / image.naturalHeight);
    const sourceWidth = canvas.width / scale;
    const sourceHeight = canvas.height / scale;
    const sourceX = Math.max(0, (image.naturalWidth - sourceWidth) / 2);
    const sourceY = Math.max(0, (image.naturalHeight - sourceHeight) / 2);
    context.drawImage(
      image,
      sourceX,
      sourceY,
      sourceWidth,
      sourceHeight,
      0,
      0,
      canvas.width,
      canvas.height,
    );

    let encoded: Blob | undefined;
    for (const quality of [0.84, 0.76, 0.68, 0.60, 0.52, 0.44, 0.36]) {
      encoded = await canvasToJpeg(canvas, quality);
      if (encoded.size <= SOCIAL_PREVIEW_MAX_BYTES) return encoded;
    }

    if (!encoded) throw new Error('Could not encode the social preview image.');
    return encoded;
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}
