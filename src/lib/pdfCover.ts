const PDF_JS_VERSION = '3.11.174';
const PDF_JS_URL = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDF_JS_VERSION}/pdf.min.js`;
const PDF_WORKER_URL = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDF_JS_VERSION}/pdf.worker.min.js`;

let pdfEnginePromise: Promise<any> | null = null;

function loadPdfEngine(): Promise<any> {
  if ((window as any).pdfjsLib) return Promise.resolve((window as any).pdfjsLib);
  if (pdfEnginePromise) return pdfEnginePromise;

  pdfEnginePromise = new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${PDF_JS_URL}"]`);
    const script = existing || document.createElement('script');
    const finish = () => {
      const engine = (window as any).pdfjsLib;
      if (!engine) {
        reject(new Error('PDF preview engine did not initialize.'));
        return;
      }
      engine.GlobalWorkerOptions.workerSrc = PDF_WORKER_URL;
      resolve(engine);
    };

    if (existing) {
      existing.addEventListener('load', finish, { once: true });
      existing.addEventListener(
        'error',
        () => reject(new Error('Failed to load PDF preview engine.')),
        { once: true },
      );
      return;
    }

    script.src = PDF_JS_URL;
    script.async = true;
    script.onload = finish;
    script.onerror = () => reject(new Error('Failed to load PDF preview engine.'));
    document.head.appendChild(script);
  });

  return pdfEnginePromise;
}

export async function createPdfFirstPageCover(pdfFile: File): Promise<File> {
  const pdfjs = await loadPdfEngine();
  const loadingTask = pdfjs.getDocument({ data: new Uint8Array(await pdfFile.arrayBuffer()) });
  const pdf = await loadingTask.promise;
  const page = await pdf.getPage(1);
  const initialViewport = page.getViewport({ scale: 1 });
  const scale = Math.min(2.5, 1200 / initialViewport.width);
  const viewport = page.getViewport({ scale });
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(viewport.width));
  canvas.height = Math.max(1, Math.round(viewport.height));
  const context = canvas.getContext('2d', { alpha: false });
  if (!context) throw new Error('Could not create the cover preview canvas.');
  context.fillStyle = '#ffffff';
  context.fillRect(0, 0, canvas.width, canvas.height);
  await page.render({ canvasContext: context, viewport }).promise;

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (result) => result ? resolve(result) : reject(new Error('Could not encode the cover preview.')),
      'image/jpeg',
      0.9,
    );
  });
  const basename = pdfFile.name.replace(/\.pdf$/i, '').replace(/[^a-zA-Z0-9_-]+/g, '_');
  return new File([blob], `${basename || 'resource'}_page_1.jpg`, { type: 'image/jpeg' });
}
