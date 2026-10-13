import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { X, Upload, Loader2, Plus, Trash2, AlertCircle, CheckCircle2, RotateCcw } from 'lucide-react';
import { db } from '@/lib/firebase';
import { doc, setDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { uploadFileResilient } from '@/lib/localFileStore';
import { ensureCaseSources } from '@/data/caseSources';

// Converts a single Google Drive sharing URL to a direct viewable image link
export function convertGDriveUrl(url: string | null | undefined): string {
  if (!url) return '';
  const trimmed = url.trim();
  if (trimmed.includes('drive.google.com')) {
    let fileId = '';
    
    // Pattern 1: /file/d/FILE_ID/view or /file/d/FILE_ID/preview
    const dMatch = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (dMatch && dMatch[1]) {
      fileId = dMatch[1];
    } else {
      // Pattern 2: ?id=FILE_ID or &id=FILE_ID
      const idMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
      if (idMatch && idMatch[1]) {
        fileId = idMatch[1];
      }
    }
    
    if (fileId) {
      return `https://docs.google.com/uc?export=view&id=${fileId}`;
    }
  }
  return trimmed;
}

// Replaces all Google Drive links inside a text block (like the details markdown input)
export function convertGDriveUrlsInText(text: string | null | undefined): string {
  if (!text) return '';
  
  // Regex to match any variant of Google Drive links
  const gdriveRegex = /https:\/\/drive\.google\.com\/(?:file\/d\/([a-zA-Z0-9_-]+)(?:\/[^\s\)]*)?|open\?(?:[^\s\)]*&)?id=([a-zA-Z0-9_-]+)[^\s\)]*)/g;
  
  return text.replace(gdriveRegex, (match, id1, id2) => {
    const fileId = id1 || id2;
    if (fileId) {
      return `https://docs.google.com/uc?export=view&id=${fileId}`;
    }
    return match;
  });
}

// Helper to convert Blob or File to Base64 string safely
async function convertBlobToBase64(blob: Blob | File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string) || '');
    reader.onerror = () => reject(new Error('Failed to read file as Base64'));
    reader.readAsDataURL(blob);
  });
}

const DRAFT_STORAGE_KEY = 'forenclue_case_editor_draft';

interface CaseEditorModalProps {
  onClose: (savedCase?: any) => void;
  caseToEdit?: any; // the case to edit, or null/undefined if creating new
  userEmail: string;
}

export function CaseEditorModal({ onClose, caseToEdit, userEmail }: CaseEditorModalProps) {
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [hasRestoredDraft, setHasRestoredDraft] = useState(false);

  const [formData, setFormData] = useState({
    title: caseToEdit?.title || '',
    tag: caseToEdit?.tag || '',
    year: caseToEdit?.year || '',
    location: caseToEdit?.location || '',
    difficulty: caseToEdit?.difficulty || 'Beginner',
    type: caseToEdit?.type || 'Homicide',
    summary: caseToEdit?.summary || '',
    details: caseToEdit?.details || '',
    status: caseToEdit?.status || 'published',
    evidenceLabels: caseToEdit?.evidenceLabels?.join(', ') || '',
    forensicTechniques: caseToEdit?.forensicTechniques?.join(', ') || '',
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [existingImage, setExistingImage] = useState(caseToEdit?.image || '');
  const [contentImages, setContentImages] = useState<{ url: string; caption: string }[]>(() => {
    if (!caseToEdit?.contentImages) return [];
    return caseToEdit.contentImages.map((img: any) => {
      if (typeof img === 'string') {
        return { url: img, caption: '' };
      }
      return { url: img?.url || '', caption: img?.caption || '' };
    });
  });
  const [newContentImageFiles, setNewContentImageFiles] = useState<File[]>([]);
  const [attachments, setAttachments] = useState<string[]>(caseToEdit?.attachments || []);
  const [newAttachmentFiles, setNewAttachmentFiles] = useState<File[]>([]);

  // Check and restore draft for new cases
  useEffect(() => {
    if (!caseToEdit) {
      try {
        const savedDraftRaw = localStorage.getItem(DRAFT_STORAGE_KEY);
        if (savedDraftRaw) {
          const draft = JSON.parse(savedDraftRaw);
          if (draft && draft.formData && (draft.formData.title || draft.formData.details)) {
            setFormData(draft.formData);
            if (draft.existingImage) setExistingImage(draft.existingImage);
            if (draft.contentImages) setContentImages(draft.contentImages);
            setHasRestoredDraft(true);
          }
        }
      } catch (e) {
        console.warn('Failed to parse saved case draft:', e);
      }
    }
  }, [caseToEdit]);

  // Auto-save draft as user edits (only for new cases)
  const isInitialMount = useRef(true);
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    if (!caseToEdit && (formData.title || formData.details || formData.summary)) {
      try {
        localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify({
          formData,
          existingImage,
          contentImages,
          savedAt: Date.now()
        }));
      } catch (e) {
        // quota exceeded or private mode
      }
    }
  }, [formData, existingImage, contentImages, caseToEdit]);

  // Clean up object preview URL
  useEffect(() => {
    if (imageFile) {
      const url = URL.createObjectURL(imageFile);
      setImagePreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setImagePreviewUrl(null);
    }
  }, [imageFile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrorMessage(null);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
      setErrorMessage(null);
    }
  };

  const handleContentImagesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setNewContentImageFiles(Array.from(e.target.files));
      setErrorMessage(null);
    }
  };

  const handleAttachmentsUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setNewAttachmentFiles(Array.from(e.target.files));
      setErrorMessage(null);
    }
  };

  const clearDraft = () => {
    localStorage.removeItem(DRAFT_STORAGE_KEY);
    setHasRestoredDraft(false);
    setFormData({
      title: '',
      tag: '',
      year: '',
      location: '',
      difficulty: 'Beginner',
      type: 'Homicide',
      summary: '',
      details: '',
      status: 'published',
      evidenceLabels: '',
      forensicTechniques: '',
    });
    setExistingImage('');
    setImageFile(null);
    setContentImages([]);
  };

  /**
   * Safe upload wrapper that pre-compresses images, attempts resilient upload,
   * and falls back to compressed Base64 data URL without ever throwing blocking errors.
   */
  const uploadFile = async (file: File, path: string): Promise<string> => {
    try {
      let fileToUpload = file;
      
      // If it's an image, pre-compress it upfront
      if (file.type.startsWith('image/')) {
        try {
          const { compressImage } = await import('@/lib/image-utils');
          const compressedBlob = await compressImage(file, 1200, 0.75);
          if (compressedBlob && compressedBlob.size < file.size) {
            fileToUpload = new File([compressedBlob], file.name, {
              type: compressedBlob.type || file.type
            });
          }
        } catch (compErr) {
          console.warn('[uploadFile] Image pre-compression bypassed:', compErr);
        }
      }

      const uploadResult = await uploadFileResilient(fileToUpload, path, (msg) => setStatusMessage(msg));
      
      // Ensure we don't save device-local localdb:// URLs to global Firestore for images
      if (uploadResult.url.startsWith('localdb://') && file.type.startsWith('image/')) {
        const { compressImage } = await import('@/lib/image-utils');
        const compressedBlob = await compressImage(file, 900, 0.6);
        const base64 = await convertBlobToBase64(compressedBlob);
        if (base64) return base64;
      }

      return uploadResult.url;
    } catch (err: any) {
      console.warn('[uploadFile] Resilient network transfer fallback for', file.name, err);
      
      // Resilient fallback: compress and convert to safe offline Base64 URL
      if (file.type.startsWith('image/')) {
        try {
          const { compressImage } = await import('@/lib/image-utils');
          const compressedBlob = await compressImage(file, 900, 0.6);
          const base64 = await convertBlobToBase64(compressedBlob);
          if (base64) return base64;
        } catch (e) {
          console.warn('Error compressing image in fallback:', e);
        }
      }

      try {
        const base64 = await convertBlobToBase64(file);
        if (base64) return base64;
      } catch (_) {}

      throw new Error(`Unable to prepare image "${file.name}". Please check the image file format and try again.`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    setStatusMessage('Analyzing and preparing dossier files...');

    try {
      let mainImageUrl = convertGDriveUrl(existingImage);
      
      // 1. Process Main Image Upload
      if (imageFile) {
        setStatusMessage(`Optimizing and uploading "${imageFile.name}"...`);
        mainImageUrl = await uploadFile(imageFile, `cases/${Date.now()}_${imageFile.name}`);
      }

      // Social Image: use mainImageUrl directly or fallback to previous
      const socialImageUrl = mainImageUrl || caseToEdit?.socialImage || 'https://images.unsplash.com/photo-1542382257-80dedb725088?auto=format&fit=crop&q=80&w=1000';

      // 2. Process Gallery Content Images
      let uploadedContentImages = contentImages.map(img => ({
        url: convertGDriveUrl(img.url),
        caption: img.caption || ''
      }));

      for (let i = 0; i < newContentImageFiles.length; i++) {
        const file = newContentImageFiles[i];
        setStatusMessage(`Gallery: Uploading image ${i + 1} of ${newContentImageFiles.length} ("${file.name}")...`);
        const url = await uploadFile(file, `cases/content/${Date.now()}_${file.name}`);
        const cleanName = file.name.split('.').slice(0, -1).join('.').replace(/[_-]/g, ' ');
        const autoCaption = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
        uploadedContentImages.push({ url, caption: autoCaption });
      }

      // 3. Process Document Attachments
      let uploadedAttachments = [...attachments];
      for (let i = 0; i < newAttachmentFiles.length; i++) {
        const file = newAttachmentFiles[i];
        setStatusMessage(`Attachments: Uploading file ${i + 1} of ${newAttachmentFiles.length} ("${file.name}")...`);
        const url = await uploadFile(file, `cases/attachments/${Date.now()}_${file.name}`);
        uploadedAttachments.push(url);
      }

      // 4. Sanitize and prepare case payload
      setStatusMessage('Sanitizing links and formatting dossier...');
      const convertedDetails = convertGDriveUrlsInText(formData.details);

      const effectiveUserEmail = (userEmail && userEmail.trim()) || 'forenclue@gmail.com';

      const caseData = {
        title: formData.title.trim(),
        tag: formData.tag.trim(),
        year: formData.year.trim(),
        location: formData.location.trim(),
        difficulty: formData.difficulty,
        type: formData.type,
        summary: formData.summary.trim(),
        details: convertedDetails,
        status: formData.status,
        sources: ensureCaseSources(formData.title, caseToEdit?.sources),
        evidenceLabels: formData.evidenceLabels.split(',').map((s: string) => s.trim()).filter(Boolean),
        forensicTechniques: formData.forensicTechniques.split(',').map((s: string) => s.trim()).filter(Boolean),
        image: mainImageUrl || 'https://images.unsplash.com/photo-1542382257-80dedb725088?auto=format&fit=crop&q=80&w=1000',
        socialImage: socialImageUrl,
        socialImageType: 'image/jpeg',
        socialImageWidth: 1200,
        socialImageHeight: 630,
        contentImages: uploadedContentImages,
        attachments: uploadedAttachments,
        createdBy: caseToEdit?.createdBy || effectiveUserEmail,
        updatedAt: serverTimestamp(),
      };

      let savedResult: any = null;

      if (caseToEdit?.id && !caseToEdit.id.startsWith('hardcoded_')) {
        // Update existing document
        setStatusMessage('Updating investigative case study record...');
        await setDoc(doc(db, 'cases', caseToEdit.id), caseData, { merge: true });
        savedResult = { id: caseToEdit.id, ...caseData };
      } else {
        // Create new document
        setStatusMessage('Enrolling new case dossier in database...');
        const newDocRef = await addDoc(collection(db, 'cases'), {
          ...caseData,
          createdAt: serverTimestamp()
        });
        savedResult = { id: newDocRef.id, ...caseData };
      }

      // Clear local draft upon successful save
      localStorage.removeItem(DRAFT_STORAGE_KEY);

      setStatusMessage('Case study published successfully!');
      setSuccessMessage('Case study saved and published successfully!');
      
      setTimeout(() => {
        onClose(savedResult);
      }, 600);
    } catch (err: any) {
      console.error('Error saving case:', err);
      const msg = err?.message || 'Error saving case study. Please check network connection and try again.';
      setErrorMessage(msg);
      setStatusMessage(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] bg-base/98 backdrop-blur-xl flex items-center justify-center p-4 overflow-y-auto">
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-surface border border-black/10 dark:border-white/10 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden my-auto"
      >
        <div className="p-6 border-b border-black/10 dark:border-white/5 flex justify-between items-center bg-surface sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-heading font-black uppercase">
              {caseToEdit ? 'Edit Case Study' : 'Add New Case Study'}
            </h2>
            {hasRestoredDraft && !caseToEdit && (
              <span className="text-[10px] bg-warning/15 text-warning border border-warning/30 px-2 py-0.5 rounded font-mono uppercase tracking-wider flex items-center gap-1">
                Draft Restored
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {hasRestoredDraft && !caseToEdit && (
              <button 
                type="button" 
                onClick={clearDraft} 
                className="text-xs text-text-muted hover:text-red-400 p-1 flex items-center gap-1"
                title="Discard restored draft"
              >
                <RotateCcw size={13} />
                <span className="text-[10px]">Reset</span>
              </button>
            )}
            <button onClick={() => onClose()} className="p-2 hover:bg-white/5 rounded-lg text-text-muted hover:text-text-main">
              <X size={20} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
          {/* Error Banner */}
          {errorMessage && (
            <motion.div 
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center justify-between gap-3 shadow-lg"
            >
              <div className="flex items-center gap-2.5">
                <AlertCircle size={18} className="shrink-0 text-red-400" />
                <span className="font-semibold">{errorMessage}</span>
              </div>
              <button 
                type="button" 
                onClick={() => setErrorMessage(null)} 
                className="text-[10px] uppercase font-bold px-2 py-1 bg-red-500/20 hover:bg-red-500/30 rounded shrink-0"
              >
                Dismiss
              </button>
            </motion.div>
          )}

          {/* Success Banner */}
          {successMessage && (
            <motion.div 
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2.5 shadow-lg"
            >
              <CheckCircle2 size={18} className="shrink-0 text-emerald-400" />
              <span className="font-semibold">{successMessage}</span>
            </motion.div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-text-muted mb-2 uppercase">Title *</label>
              <input 
                required 
                name="title" 
                value={formData.title} 
                onChange={handleChange} 
                className="w-full bg-crust border border-white/10 rounded-lg p-3 text-sm focus:border-warning outline-none" 
                placeholder="e.g. Nirbhaya Case Forensic Reconstruction"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-text-muted mb-2 uppercase">Tag (e.g. DNA Analysis) *</label>
              <input 
                required 
                name="tag" 
                value={formData.tag} 
                onChange={handleChange} 
                className="w-full bg-crust border border-white/10 rounded-lg p-3 text-sm focus:border-warning outline-none" 
                placeholder="e.g. Odontology, DNA Profiling"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-text-muted mb-2 uppercase">Year *</label>
              <input 
                required 
                name="year" 
                value={formData.year} 
                onChange={handleChange} 
                className="w-full bg-crust border border-white/10 rounded-lg p-3 text-sm focus:border-warning outline-none" 
                placeholder="e.g. 2012"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-text-muted mb-2 uppercase">Location *</label>
              <input 
                required 
                name="location" 
                value={formData.location} 
                onChange={handleChange} 
                className="w-full bg-crust border border-white/10 rounded-lg p-3 text-sm focus:border-warning outline-none" 
                placeholder="e.g. New Delhi, India"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-text-muted mb-2 uppercase">Difficulty</label>
              <select name="difficulty" value={formData.difficulty} onChange={handleChange} className="w-full bg-crust border border-white/10 rounded-lg p-3 text-sm focus:border-warning outline-none">
                <option>Beginner</option>
                <option>Advanced</option>
                <option>Expert</option>
                <option>Scientific</option>
                <option>Historical</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-text-muted mb-2 uppercase">Type</label>
              <select name="type" value={formData.type} onChange={handleChange} className="w-full bg-crust border border-white/10 rounded-lg p-3 text-sm focus:border-warning outline-none">
                <option>Homicide</option>
                <option>Cyber</option>
                <option>Theft</option>
                <option>Forgery</option>
                <option>Cold Case</option>
                <option>Death Investigation</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-text-muted mb-2 uppercase">Status</label>
              <select name="status" value={formData.status} onChange={handleChange} className="w-full bg-crust border border-white/10 rounded-lg p-3 text-sm focus:border-warning outline-none">
                <option value="published">Published (Visible to all students)</option>
                <option value="draft">Draft (Admin eyes only)</option>
              </select>
            </div>
            <div>
               <label className="block text-xs font-bold text-text-muted mb-2 uppercase">Main Image / Thumbnail (Upload or Link)</label>
               <input 
                 type="text" 
                 value={existingImage} 
                 onChange={(e) => setExistingImage(e.target.value)} 
                 placeholder="Paste image link/GDrive link here..." 
                 className="w-full bg-crust border border-white/10 rounded-lg p-3 text-sm focus:border-warning outline-none mb-1.5" 
               />
               <p className="text-[10px] text-text-muted mb-2 font-mono">Google Drive sharing links are auto-converted to direct image links!</p>
               <input 
                 type="file" 
                 accept="image/*" 
                 onChange={handleImageUpload} 
                 className="w-full text-sm text-text-muted file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-warning/10 file:text-warning hover:file:bg-warning/20 cursor-pointer" 
               />
               
               {/* Selected image thumbnail preview */}
               {imagePreviewUrl && imageFile && (
                 <div className="mt-2 p-2 bg-crust rounded-xl border border-warning/20 flex items-center gap-3">
                   <img 
                     src={imagePreviewUrl} 
                     alt="Selected" 
                     className="w-12 h-12 rounded-lg object-cover border border-white/10" 
                   />
                   <div className="flex-1 min-w-0">
                     <p className="text-xs font-bold text-warning truncate">{imageFile.name}</p>
                     <p className="text-[10px] text-text-muted font-mono">{(imageFile.size / 1024).toFixed(1)} KB • Pre-optimized</p>
                   </div>
                   <button 
                     type="button" 
                     onClick={() => setImageFile(null)} 
                     className="p-1.5 text-text-muted hover:text-red-400 rounded-lg hover:bg-white/5"
                     title="Remove selected file"
                   >
                     <X size={14} />
                   </button>
                 </div>
               )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-text-muted mb-2 uppercase">Summary (Short) *</label>
            <textarea 
              required 
              name="summary" 
              value={formData.summary} 
              onChange={handleChange} 
              rows={2} 
              className="w-full bg-crust border border-white/10 rounded-lg p-3 text-sm focus:border-warning outline-none custom-scrollbar" 
              placeholder="Brief overview of the investigation and forensic significance..."
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-xs font-bold text-text-muted uppercase">Details (Markdown supported) *</label>
              <span className="text-[10px] text-warning font-mono">Google Drive links are auto-converted!</span>
            </div>
            <textarea 
              required 
              name="details" 
              value={formData.details} 
              onChange={handleChange} 
              rows={8} 
              className="w-full bg-crust border border-white/10 rounded-lg p-3 text-sm focus:border-warning outline-none custom-scrollbar font-mono text-xs" 
              placeholder="State the details... Use markdown `![image](gdrive_sharing_url)` to embed inline photos!" 
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div>
                <label className="block text-xs font-bold text-text-muted mb-2 uppercase">Evidence Labels (comma separated)</label>
                <input 
                  name="evidenceLabels" 
                  value={formData.evidenceLabels} 
                  onChange={handleChange} 
                  className="w-full bg-crust border border-white/10 rounded-lg p-3 text-sm focus:border-warning outline-none" 
                  placeholder="e.g. Fingerprint, DNA, Bite Marks" 
                />
             </div>
             <div>
                <label className="block text-xs font-bold text-text-muted mb-2 uppercase">Forensic Techniques (comma separated)</label>
                <input 
                  name="forensicTechniques" 
                  value={formData.forensicTechniques} 
                  onChange={handleChange} 
                  className="w-full bg-crust border border-white/10 rounded-lg p-3 text-sm focus:border-warning outline-none" 
                  placeholder="e.g. STR Analysis, Comparison Microscope, UV Illumination" 
                />
             </div>
          </div>

          <div>
             <label className="block text-xs font-bold text-text-muted mb-2 uppercase">Gallery Images (Upload or Links)</label>
             <div className="flex gap-2 mb-2">
               <input 
                 type="text" 
                 id="galleryLinkInput" 
                 placeholder="Paste image/GDrive link here" 
                 className="flex-1 bg-crust border border-white/10 rounded-lg p-3 text-sm focus:border-warning outline-none" 
               />
               <button 
                 type="button" 
                 onClick={() => {
                   const el = document.getElementById('galleryLinkInput') as HTMLInputElement;
                   if (el && el.value) {
                     const converted = convertGDriveUrl(el.value);
                     setContentImages(prev => [...prev, { url: converted, caption: '' }]);
                     el.value = '';
                   }
                 }} 
                 className="bg-warning/20 hover:bg-warning/30 text-warning px-4 rounded-lg text-sm font-bold transition-colors cursor-pointer"
               >
                 Add Link
               </button>
             </div>
             <input 
               type="file" 
               accept="image/*" 
               multiple 
               onChange={handleContentImagesUpload} 
               className="w-full text-sm text-text-muted mb-4 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-warning/10 file:text-warning hover:file:bg-warning/20 cursor-pointer" 
             />
             
             <div className="space-y-3 max-h-72 overflow-y-auto p-2 bg-crust rounded-xl border border-white/10 custom-scrollbar mb-4">
               {contentImages.map((img, i) => (
                  <div key={i} className="flex gap-4 p-3 bg-surface border border-white/10 rounded-xl relative group items-center">
                    <img src={img.url} className="w-16 h-16 object-cover rounded-lg border border-white/15 shrink-0" alt="gallery thumbnail" />
                    <div className="flex-1 min-w-0">
                      <label className="block text-[9px] font-mono uppercase tracking-wider text-text-muted mb-1">Image Address / Link</label>
                      <span className="text-[10px] font-mono text-text-main block truncate pr-8">{img.url}</span>
                      
                      <label className="block text-[9px] font-mono uppercase tracking-wider text-text-muted mt-2 mb-1 font-bold">Dossier Caption</label>
                      <input 
                        type="text" 
                        value={img.caption || ''} 
                        placeholder="Enter brief caption describing this evidence image..."
                        onChange={(e) => {
                          const updatedCaption = e.target.value;
                          setContentImages(prev => prev.map((item, idx) => idx === i ? { ...item, caption: updatedCaption } : item));
                        }} 
                        className="w-full bg-base border border-white/15 rounded px-2.5 py-1.5 text-xs text-text-main focus:border-warning outline-none" 
                      />
                    </div>
                    <button 
                      type="button" 
                      onClick={() => setContentImages(contentImages.filter((_, idx) => idx !== i))} 
                      className="p-2 text-text-muted hover:text-red-400 hover:bg-red-500/10 rounded-lg shrink-0 transition-colors"
                      title="Remove image"
                    >
                      <Trash2 size={16}/>
                    </button>
                  </div>
               ))}
               {contentImages.length === 0 && (
                 <p className="text-xs text-text-muted text-center py-6 font-mono">No laboratory files added to scientific gallery yet.</p>
               )}
             </div>
             {newContentImageFiles.length > 0 && (
               <div className="text-xs text-warning font-semibold mt-1">
                 {newContentImageFiles.length} newly selected files will be uploaded and added with auto-captions on saving.
               </div>
             )}
          </div>

          <div>
             <label className="block text-xs font-bold text-text-muted mb-2 uppercase">Attachments (PDF/Doc/Report)</label>
             <input 
               type="file" 
               accept=".pdf,.doc,.docx,.txt" 
               multiple 
               onChange={handleAttachmentsUpload} 
               className="w-full text-sm text-text-muted mb-2 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-warning/10 file:text-warning hover:file:bg-warning/20 cursor-pointer" 
             />
             <div className="flex gap-2 flex-wrap">
               {attachments.map((att, i) => (
                  <div key={i} className="relative group p-2 bg-white/5 rounded border border-white/10 text-xs">
                    Attachment {i + 1}
                    <button 
                      type="button" 
                      onClick={() => setAttachments(attachments.filter((_, idx) => idx !== i))} 
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={12}/>
                    </button>
                  </div>
               ))}
               {newAttachmentFiles.map(f => (
                 <div key={f.name} className="p-2 bg-black/10 dark:bg-white/10 text-xs rounded border border-black/20 dark:border-white/20">
                   {f.name}
                 </div>
               ))}
             </div>
          </div>

          {loading && statusMessage && (
            <div className="flex items-center gap-2.5 text-xs text-warning bg-warning/10 px-4 py-3 rounded-xl border border-warning/20 font-mono shrink-0 shadow-lg">
              <Loader2 className="w-4 h-4 animate-spin text-warning shrink-0" />
              <span className="font-semibold">{statusMessage}</span>
            </div>
          )}

          <div className="flex justify-end pt-6 border-t border-black/10 dark:border-white/5 gap-4">
            <button 
              type="button" 
              onClick={() => onClose()} 
              disabled={loading}
              className="px-6 py-2.5 rounded-xl font-bold text-text-muted hover:text-text-main transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading} 
              className="px-8 py-2.5 bg-warning text-crust rounded-xl font-black uppercase tracking-wider flex items-center gap-2 hover:bg-warning/90 transition-all shadow-md disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>{caseToEdit ? 'Save Changes' : 'Publish Case Study'}</span>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
