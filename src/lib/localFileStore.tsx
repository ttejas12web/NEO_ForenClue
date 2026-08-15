import { useState, useEffect } from 'react';
import { ref, uploadBytes, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import { storage } from './firebase';

class LocalFileStore {
  private dbName = "ForenClueOfflineFiles";
  private storeName = "files";
  private db: IDBDatabase | null = null;

  async init(): Promise<IDBDatabase> {
    if (this.db) return this.db;
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);
      request.onerror = () => {
        console.error("IndexedDB failed to open:", request.error);
        reject(request.error);
      };
      request.onsuccess = () => {
        this.db = request.result;
        resolve(request.result);
      };
      request.onupgradeneeded = (event: any) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName);
        }
      };
    });
  }

  async saveFile(key: string, file: Blob): Promise<string> {
    try {
      const db = await this.init();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(this.storeName, "readwrite");
        const store = transaction.objectStore(this.storeName);
        const request = store.put(file, key);
        request.onsuccess = () => {
          resolve(`localdb://${key}`);
        };
        request.onerror = () => reject(request.error);
      });
    } catch (err) {
      console.error("Failed to save to local IndexedDB:", err);
      // Absolute fallback to direct base64 if IndexedDB fails entirely
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = () => reject(new Error('Failed to read file as Data URL'));
        reader.readAsDataURL(file);
      });
    }
  }

  async getFile(key: string): Promise<Blob | null> {
    try {
      const db = await this.init();
      return new Promise((resolve) => {
        const transaction = db.transaction(this.storeName, "readonly");
        const store = transaction.objectStore(this.storeName);
        const cleanedKey = key.replace("localdb://", "");
        const request = store.get(cleanedKey);
        request.onsuccess = () => {
          resolve(request.result || null);
        };
        request.onerror = () => {
          console.error("IndexedDB getFile error:", request.error);
          resolve(null);
        };
      });
    } catch (err) {
      console.error("IndexedDB not accessible in getFile:", err);
      return null;
    }
  }

  async deleteFile(key: string): Promise<boolean> {
    try {
      const db = await this.init();
      return new Promise((resolve) => {
        const transaction = db.transaction(this.storeName, "readwrite");
        const store = transaction.objectStore(this.storeName);
        const cleanedKey = key.replace("localdb://", "");
        const request = store.delete(cleanedKey);
        request.onsuccess = () => resolve(true);
        request.onerror = () => resolve(false);
      });
    } catch (err) {
      console.error("IndexedDB deleteFile error:", err);
      return false;
    }
  }
}

export const localFileStore = new LocalFileStore();

// Dynamic timeout helper
function withTimeout<T>(promise: Promise<T>, ms: number, errorMessage = "Operation timed out"): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(errorMessage));
    }, ms);
    promise
      .then((res) => {
        clearTimeout(timer);
        resolve(res);
      })
      .catch((err) => {
        clearTimeout(timer);
        reject(err);
      });
  });
}

function getApiCandidates(apiPath: string): string[] {
  const cleanPath = apiPath.startsWith('/') ? apiPath : `/${apiPath}`;
  const list: string[] = [cleanPath];
  const workerBackend = 'https://neo-forenclue.webcreator500.workers.dev';
  const primaryBackend = 'https://ais-pre-qppxi7labjn6lbaqqz6h5u-642747300953.asia-southeast1.run.app';
  const devBackend = 'https://ais-dev-qppxi7labjn6lbaqqz6h5u-642747300953.asia-southeast1.run.app';

  // Add Cloudflare Worker endpoint as highest priority edge worker route
  list.push(`${workerBackend}${cleanPath}`);

  if (typeof window !== 'undefined' && window.location && window.location.origin) {
    const currentOrigin = window.location.origin;
    if (!currentOrigin.includes('asia-southeast1.run.app')) {
      list.push(`${primaryBackend}${cleanPath}`);
      list.push(`${devBackend}${cleanPath}`);
    }
  } else {
    list.push(`${primaryBackend}${cleanPath}`);
  }
  return list;
}

const convertToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Failed to convert file to Base64'));
  });
};

async function uploadToServerDisk(file: File, cloudPath: string, onStatusChange?: (msg: string) => void): Promise<string> {
  if (onStatusChange) onStatusChange('Routing upload to Cloudflare R2 Object Storage...');
  const endpoints = getApiCandidates('/api/upload');
  let lastError: any = null;

  for (const endpoint of endpoints) {
    try {
      console.log(`[uploadToServerDisk] Attempting upload to endpoint: ${endpoint}`);

      // 1. Try multipart/form-data for high efficiency and minimal RAM usage
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('cloudPath', cloudPath);
        formData.append('fileName', file.name);

        const response = await fetch(endpoint, {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const contentType = response.headers.get('content-type') || '';
          if (contentType.includes('application/json')) {
            const data = await response.json();
            if (data && data.url) {
              console.log(`[uploadToServerDisk] Successfully uploaded file via FormData to ${endpoint}. URL:`, data.url);
              return data.url;
            }
          }
        }
      } catch (formErr) {
        console.warn(`[uploadToServerDisk] FormData attempt failed on ${endpoint}, trying Base64 JSON:`, formErr);
      }

      // 2. Fallback to Base64 JSON payload
      const base64Data = await convertToBase64(file);
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fileName: file.name,
          fileType: file.type || 'application/octet-stream',
          base64Data: base64Data,
          cloudPath: cloudPath
        })
      });

      const contentType = response.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        const text = await response.text();
        console.warn(`[uploadToServerDisk] Endpoint ${endpoint} returned non-JSON response (${response.status}):`, text.substring(0, 150));
        throw new Error(`Endpoint ${endpoint} returned non-JSON (${response.status})`);
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.warn(`[uploadToServerDisk] Endpoint ${endpoint} rejected upload (${response.status}):`, errorData);
        throw new Error(errorData.error || `Upload rejected with status ${response.status}`);
      }

      const data = await response.json();
      if (data && data.url) {
        console.log(`[uploadToServerDisk] Successfully uploaded file to R2 storage via ${endpoint}. URL:`, data.url);
        return data.url;
      }
      throw new Error(`Malformed response from ${endpoint}`);
    } catch (err: any) {
      lastError = err;
      console.warn(`[uploadToServerDisk] Failed on endpoint ${endpoint}:`, err.message);
    }
  }

  throw lastError || new Error('All R2 upload endpoints failed.');
}

/**
 * Splits a file into ultra-conservative, small chunks (e.g. 300KB each), transfers them individually 
 * using /api/upload-chunk to bypass reverse proxy request limits, 
 * and gets the final aggregated remote url location back.
 */
async function uploadChunksToServer(
  file: File, 
  cloudPath: string, 
  onStatusChange?: (msg: string) => void
): Promise<string> {
  const uploadId = `${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
  const chunkSize = 300 * 1024; // 300KB chunks
  const totalChunks = Math.ceil(file.size / chunkSize);
  const endpointCandidates = getApiCandidates('/api/upload-chunk');
  
  if (onStatusChange) onStatusChange(`Preparing secure multi-part chunked transfer (${totalChunks} segments)...`);
  console.log(`[uploadChunksToServer] Initiating chunked upload of "${file.name}" (${file.size} bytes). Total pieces: ${totalChunks}`);

  let lastError: any = null;

  // Try endpoint candidates in order
  for (const chunkEndpoint of endpointCandidates) {
    try {
      console.log(`[uploadChunksToServer] Trying chunk upload endpoint: ${chunkEndpoint}`);
      let endpointSuccess = true;

      for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
        const start = chunkIndex * chunkSize;
        const end = Math.min(start + chunkSize, file.size);
        const chunkBlob = file.slice(start, end);
        
        // Progress calculation
        const percent = Math.round((chunkIndex / totalChunks) * 100);
        if (onStatusChange) {
          onStatusChange(`Uploading section ${chunkIndex + 1}/${totalChunks} (${percent}% uploaded)...`);
        }

        // Convert slice to data URL
        const base64Data = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = () => reject(new Error(`Failed to convert slice ${chunkIndex} to Base64`));
          reader.readAsDataURL(chunkBlob);
        });

        const response = await fetch(chunkEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            uploadId,
            chunkIndex,
            totalChunks,
            fileName: file.name,
            fileType: file.type || 'application/octet-stream',
            base64Data,
            cloudPath
          })
        });

        const contentType = response.headers.get('content-type') || '';
        if (!contentType.includes('application/json')) {
          const text = await response.text();
          console.warn(`[uploadChunksToServer] Chunk ${chunkIndex} received non-JSON (${contentType}) from ${chunkEndpoint}:`, text.substring(0, 150));
          endpointSuccess = false;
          break;
        }

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.warn(`[uploadChunksToServer] Chunk ${chunkIndex} rejected by ${chunkEndpoint} (${response.status}):`, errorData);
          endpointSuccess = false;
          break;
        }

        // If it is the final chunk, parse response to fetch the aggregated remote url location
        if (chunkIndex === totalChunks - 1) {
          const data = await response.json();
          if (data && data.url) {
            console.log(`[uploadChunksToServer] Success! R2 merged all chunks via ${chunkEndpoint}. Result URL:`, data.url);
            if (onStatusChange) onStatusChange('All segments successfully merged and published on Cloudflare R2!');
            return data.url;
          }
          endpointSuccess = false;
          break;
        } else {
          await new Promise(resolve => setTimeout(resolve, 20));
        }
      }

      if (!endpointSuccess) {
        throw new Error(`Endpoint ${chunkEndpoint} failed to complete chunk transfer.`);
      }
    } catch (err: any) {
      lastError = err;
      console.warn(`[uploadChunksToServer] Endpoint ${chunkEndpoint} failed:`, err.message);
    }
  }

  throw lastError || new Error('All chunk upload endpoints failed.');
}

/**
 * Resilient upload utility that tries Cloud Storage with progress updates and a timeout,
 * falls back to our Express server uploads disk, and ultimately falls back to IndexedDB.
 */
export async function uploadFileResilient(
  file: File | Blob, 
  cloudPath: string, 
  onStatusChange?: (msg: string) => void
): Promise<{ url: string; isFallback: boolean }> {
  
  // Convert Blob into a File if it's not already, ensuring it has a 'name' field
  let fileToUpload: File;
  if (file instanceof File) {
    fileToUpload = file;
  } else {
    const extension = file.type.split('/')[1] || 'bin';
    fileToUpload = new File([file], `evidence_${Date.now()}.${extension}`, { type: file.type });
  }

  // Primary Storage Target: Server Cloudflare R2 Object Storage / Server pipeline
  try {
    if (onStatusChange) onStatusChange('Routing upload to Cloudflare R2 Object Storage...');
    let serverUrl: string;
    if (fileToUpload.size > 300 * 1024) {
      console.log(`[uploadFileResilient] File size is ${fileToUpload.size} bytes. Utilizing chunked upload pipeline.`);
      try {
        serverUrl = await uploadChunksToServer(fileToUpload, cloudPath, onStatusChange);
      } catch (chunkErr) {
        console.warn("[uploadFileResilient] Chunked upload failed, retrying with direct R2 upload pipeline:", chunkErr);
        if (onStatusChange) onStatusChange('Retrying with direct R2 storage transfer...');
        serverUrl = await uploadToServerDisk(fileToUpload, cloudPath, onStatusChange);
      }
    } else {
      console.log(`[uploadFileResilient] File size is ${fileToUpload.size} bytes. Utilizing direct upload.`);
      serverUrl = await uploadToServerDisk(fileToUpload, cloudPath, onStatusChange);
    }
    return { url: serverUrl, isFallback: false };
  } catch (serverErr: any) {
    const errorMsg = serverErr instanceof Error ? serverErr.message : String(serverErr);
    console.warn("Server R2 upload pipeline rejected or unavailable. Trying Firebase Storage fallback:", serverErr);
    if (onStatusChange) {
      onStatusChange(`Server Upload Warning: ${errorMsg}. Trying Firebase Storage...`);
    }
  }

  // Secondary Fallback: Firebase Storage
  if (storage) {
    try {
      if (onStatusChange) onStatusChange('Connecting to Firebase Cloud Storage...');
      const fileRef = ref(storage, cloudPath);
      
      const uploadPromise = new Promise<{ url: string; isFallback: boolean }>((resolve, reject) => {
        if (onStatusChange) onStatusChange('Starting Cloud Storage upload...');
        
        const metadata = {
          contentType: fileToUpload.type || 'application/octet-stream',
        };
        
        const uploadTask = uploadBytesResumable(fileRef, fileToUpload, metadata);
        
        let completed = false;

        const unsubscribe = uploadTask.on('state_changed', 
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            const progressFormatted = isNaN(progress) ? 0 : Math.round(progress);
            if (onStatusChange) {
              onStatusChange(`Cloud Storage: ${progressFormatted}% complete`);
            }
          }, 
          (err) => {
            if (!completed) {
              completed = true;
              unsubscribe();
              reject(err);
            }
          }, 
          async () => {
            try {
              if (!completed) {
                completed = true;
                unsubscribe();
                if (onStatusChange) onStatusChange('Retrieving secure download URL...');
                const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
                resolve({ url: downloadUrl, isFallback: false });
              }
            } catch (err) {
              reject(err);
            }
          }
        );
      });

      // Attempt Firebase Storage upload with a 30-second timeout
      const result = await withTimeout(uploadPromise, 30000, "Firebase Storage took too long to complete.");
      return result;
    } catch (err: any) {
      console.warn("Firebase Cloud storage upload rejected or timed out:", err);
    }
  }


  // Fallback 2: For images, convert to highly-compressed Base64 data-URL so other users can view it too!
  if (fileToUpload.type.startsWith('image/')) {
    if (onStatusChange) onStatusChange('Encoding image to resilient offline-safe Base64...');
    try {
      const { compressImage } = await import('./image-utils');
      // Compress to a friendly resolution and quality so it fits comfortably within Firestore boundaries
      const compressedBlob = await compressImage(fileToUpload, 800, 0.6);
      const base64Url = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = () => reject(new Error('Failed to read compressed image file'));
        reader.readAsDataURL(compressedBlob);
      });
      return { url: base64Url, isFallback: true };
    } catch (compressErr) {
      console.warn("Compression failed during Base64 fallback, using raw file:", compressErr);
      const base64Url = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = () => reject(new Error('Failed to read raw image file for Base64'));
        reader.readAsDataURL(fileToUpload);
      });
      return { url: base64Url, isFallback: true };
    }
  }

  // Fallback 3: Local IndexedDB (for non-image files like large PDFs, which are too big for Base64 injection)
  if (onStatusChange) onStatusChange('Switching to local browser sandbox database (IndexedDB)...');
  
  // Create a clean key for IndexedDB
  const uniqueId = `${Date.now()}_${fileToUpload.name.replace(/[^a-zA-Z0-9]/g, '_')}`;
  const localUrl = await localFileStore.saveFile(uniqueId, fileToUpload);
  
  return { url: localUrl, isFallback: true };
}

/**
 * Resolves any localdb:// URL or Base64 string to a usable web URL for images and media files.
 * Also parses and optimizes third-party hosted files like Dropbox to ensure compatibility with native HTML5 media streaming.
 */
export async function resolveFileUrl(url: string | null | undefined): Promise<string> {
  if (!url) return '';
  if (url.startsWith('localdb://')) {
    const blob = await localFileStore.getFile(url);
    if (blob) {
      return URL.createObjectURL(blob);
    }
    // Return a beautiful fallback if not present in DB
    return 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=300';
  }

  // Optimize Dropbox URLs for direct streaming in audio/video players
  if (url.includes('dropbox.com')) {
    try {
      let optimized = url;
      // Convert standard Dropbox domains to dl.dropboxusercontent.com
      optimized = optimized.replace(/(www\.)?dropbox\.com/gi, 'dl.dropboxusercontent.com');
      
      // Convert dl=0 or dl=1 to raw=1 (forces direct streaming/retrieval bypass)
      if (optimized.includes('dl=0')) {
        optimized = optimized.replace('dl=0', 'raw=1');
      } else if (optimized.includes('dl=1')) {
        optimized = optimized.replace('dl=1', 'raw=1');
      } else if (!optimized.includes('raw=1')) {
        const joiner = optimized.includes('?') ? '&' : '?';
        optimized = `${optimized}${joiner}raw=1`;
      }
      return optimized;
    } catch (e) {
      console.warn("Failed to automatically optimize Dropbox URL:", e);
    }
  }

  return url;
}

export function ResilientImage({ src, alt, className, fallbackText, ...props }: { src: string; alt: string; className?: string; fallbackText?: string; [key: string]: any }) {
  const [resolvedSrc, setResolvedSrc] = useState<string>('');
  const [hasError, setHasError] = useState<boolean>(false);

  useEffect(() => {
    let active = true;
    let objectUrl = '';
    setHasError(false);

    const resolve = async () => {
      if (!src) return;
      if (src.startsWith('localdb://')) {
        const url = await resolveFileUrl(src);
        if (active) {
          setResolvedSrc(url);
          objectUrl = url;
        }
      } else {
        if (active) {
          setResolvedSrc(src);
        }
      }
    };

    resolve();

    return () => {
      active = false;
      if (objectUrl && objectUrl.startsWith('blob:')) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [src]);

  if (hasError && fallbackText) {
    return (
      <div className={className ? className + " flex items-center justify-center bg-warning/20 text-warning font-bold text-sm" : "w-full h-full flex items-center justify-center bg-warning/20 text-warning font-bold text-sm rounded-lg"}>
        {fallbackText}
      </div>
    );
  }

  if (!resolvedSrc) {
    return <div className={className ? className + " animate-pulse bg-black/5 dark:bg-white/5" : "animate-pulse bg-black/5 dark:bg-white/5 rounded-lg w-full h-full"} />;
  }

  return (
    <img 
      src={resolvedSrc} 
      alt={alt} 
      className={className} 
      referrerPolicy="no-referrer" 
      onError={() => setHasError(true)}
      {...props} 
    />
  );
}

/**
 * Deletes a file from storage (handles Cloudflare R2 via backend server endpoint and local IndexedDB)
 */
export async function deleteFileResilient(fileUrlOrKey: string): Promise<{ success: boolean; message: string; deletedFromR2: boolean }> {
  if (!fileUrlOrKey || typeof fileUrlOrKey !== 'string') {
    return { success: false, message: 'No valid file URL or key provided.', deletedFromR2: false };
  }

  const cleanUrl = fileUrlOrKey.trim();

  // If local IndexedDB URL
  if (cleanUrl.startsWith('localdb://')) {
    try {
      await localFileStore.deleteFile(cleanUrl);
      return { success: true, message: 'Deleted file from local offline store.', deletedFromR2: false };
    } catch (err: any) {
      console.warn('Error deleting localdb file:', err);
      return { success: false, message: 'Failed to remove local file.', deletedFromR2: false };
    }
  }

  // If data URI or blob URL, no remote deletion needed
  if (cleanUrl.startsWith('data:') || cleanUrl.startsWith('blob:')) {
    return { success: true, message: 'Transient memory URL cleared.', deletedFromR2: false };
  }

  // Request deletion from backend server (handles Cloudflare R2)
  try {
    const res = await fetch('/api/delete-file', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fileUrl: cleanUrl })
    });

    if (res.ok) {
      const data = await res.json();
      return {
        success: true,
        message: data.message || 'File deletion request succeeded.',
        deletedFromR2: !!data.deletedFromR2
      };
    } else {
      const errData = await res.json().catch(() => ({}));
      return {
        success: false,
        message: errData.error || 'Server file deletion endpoint returned error.',
        deletedFromR2: false
      };
    }
  } catch (err: any) {
    console.warn('Error deleting file via API:', err);
    return { success: false, message: 'Failed to connect to file deletion server endpoint.', deletedFromR2: false };
  }
}


