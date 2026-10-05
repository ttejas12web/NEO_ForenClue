import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { useAuth } from '@/contexts/AuthContext';

export interface WebsiteTextItem {
  id: string;
  text: string;
  originalText?: string;
  page?: string;
  updatedAt?: string;
  updatedBy?: string;
}

export interface TextItemDetail {
  id: string;
  originalText: string;
  currentText: string;
  isOverridden: boolean;
  element?: HTMLElement;
  tagName?: string;
  page: string;
}

interface WebsiteTextContextType {
  overrides: Record<string, WebsiteTextItem>;
  isEditMode: boolean;
  toggleEditMode: () => void;
  setEditMode: (val: boolean) => void;
  saveTextOverride: (
    originalText: string, 
    newText: string, 
    page?: string, 
    customId?: string,
    targetElement?: HTMLElement
  ) => Promise<void>;
  resetTextOverride: (idOrOriginalText: string, targetElement?: HTMLElement) => Promise<void>;
  editingItem: TextItemDetail | null;
  setEditingItem: (item: TextItemDetail | null) => void;
  pageTexts: TextItemDetail[];
  refreshPageTexts: () => void;
  getText: (originalText: string, defaultText?: string) => string;
  loading: boolean;
}

const WebsiteTextContext = createContext<WebsiteTextContextType | undefined>(undefined);

// Generate deterministic safe Firestore document ID from text
export function generateTextId(originalText: string): string {
  const normalized = originalText.trim().replace(/\s+/g, ' ');
  const slug = normalized
    .slice(0, 30)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '') || 'txt';

  let hash = 2166136261;
  for (let i = 0; i < normalized.length; i++) {
    hash ^= normalized.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  const hashHex = (hash >>> 0).toString(16).padStart(8, '0');

  return `wt_${slug.slice(0, 24)}_${hashHex}`;
}

const LOCAL_STORAGE_CACHE_KEY = 'forenclue_website_texts_cache';

export function normalizeStr(str: string): string {
  return str ? str.trim().replace(/\s+/g, ' ') : '';
}

// Safely updates text inside an element, preserving icons/SVG siblings if present
export function updateElementText(element: HTMLElement, newText: string) {
  if (!element) return;

  const textNodes: Text[] = [];
  const findTextNodes = (node: Node) => {
    for (const child of Array.from(node.childNodes)) {
      if (child.nodeType === Node.TEXT_NODE && child.nodeValue && child.nodeValue.trim().length > 0) {
        textNodes.push(child as Text);
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        const tag = (child as HTMLElement).tagName.toLowerCase();
        if (!['svg', 'path', 'script', 'style', 'input', 'textarea'].includes(tag)) {
          findTextNodes(child);
        }
      }
    }
  };

  findTextNodes(element);

  if (textNodes.length === 1) {
    textNodes[0].nodeValue = newText;
  } else if (textNodes.length > 1) {
    textNodes[0].nodeValue = newText;
    for (let i = 1; i < textNodes.length; i++) {
      textNodes[i].nodeValue = '';
    }
  } else {
    // If no text node found, check if it has SVG children
    const hasSvg = element.querySelector('svg');
    if (!hasSvg) {
      element.textContent = newText;
    } else {
      // Append text node after svg
      const newTextNode = document.createTextNode(newText);
      element.appendChild(newTextNode);
    }
  }
}

export function WebsiteTextProvider({ children }: { children: React.ReactNode }) {
  const { isAdmin, user } = useAuth();
  const [overrides, setOverrides] = useState<Record<string, WebsiteTextItem>>(() => {
    try {
      const cached = localStorage.getItem(LOCAL_STORAGE_CACHE_KEY);
      return cached ? JSON.parse(cached) : {};
    } catch {
      return {};
    }
  });

  const [isEditMode, setIsEditMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem('forenclue_admin_live_edit') === 'true';
    } catch {
      return false;
    }
  });

  const [editingItem, setEditingItem] = useState<TextItemDetail | null>(null);
  const [pageTexts, setPageTexts] = useState<TextItemDetail[]>([]);
  const [loading, setLoading] = useState(true);

  // Map of normalized original text -> WebsiteTextItem
  const originalToOverrideRef = useRef<Map<string, WebsiteTextItem>>(new Map());
  // Map of text node -> original text string
  const textNodeOriginalMap = useRef<WeakMap<Node, string>>(new WeakMap());
  // Set to prevent recursive mutation observer triggers
  const isApplyingReplacements = useRef(false);

  // Core DOM text replacement engine
  const applyTextReplacements = useCallback(() => {
    if (typeof document === 'undefined') return;
    if (isApplyingReplacements.current) return;
    isApplyingReplacements.current = true;

    try {
      const activeOverridesList = Object.values(overrides).filter(
        (o) => o && o.text !== undefined && o.text !== null
      );

      if (activeOverridesList.length === 0) {
        isApplyingReplacements.current = false;
        return;
      }

      // Fast lookup map by normalized originalText and by id
      const origMap = originalToOverrideRef.current;

      // 1. Process elements with data-wt-id or data-wt-orig
      const markedElements = document.querySelectorAll<HTMLElement>('[data-wt-id], [data-wt-orig]');
      markedElements.forEach((el) => {
        const id = el.getAttribute('data-wt-id');
        const orig = el.getAttribute('data-wt-orig');
        const match = (id && overrides[id]) || (orig && origMap.get(normalizeStr(orig)));
        if (match && typeof match.text === 'string') {
          const currentContent = normalizeStr(el.innerText || el.textContent || '');
          if (currentContent !== match.text) {
            updateElementText(el, match.text);
          }
        }
      });

      // 2. Walk all text nodes across the entire document
      const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
        {
          acceptNode: (node) => {
            const parent = node.parentElement;
            if (!parent) return NodeFilter.FILTER_REJECT;
            const tag = parent.tagName.toLowerCase();
            if (['script', 'style', 'svg', 'path', 'noscript', 'code', 'pre'].includes(tag)) {
              return NodeFilter.FILTER_REJECT;
            }
            if (parent.closest('[data-admin-editor-ignore="true"]')) {
              return NodeFilter.FILTER_REJECT;
            }
            if (parent.isContentEditable) {
              return NodeFilter.FILTER_REJECT;
            }
            const val = node.nodeValue?.trim();
            if (!val || val.length === 0) {
              return NodeFilter.FILTER_REJECT;
            }
            return NodeFilter.FILTER_ACCEPT;
          }
        }
      );

      let currentNode = walker.nextNode();
      while (currentNode) {
        const textNode = currentNode as Text;
        const currentVal = textNode.nodeValue || '';
        const trimmedCurrent = normalizeStr(currentVal);

        // Check if we already recorded the original text of this node
        let originalText = textNodeOriginalMap.current.get(textNode);
        if (!originalText) {
          originalText = trimmedCurrent;
          textNodeOriginalMap.current.set(textNode, originalText);
        }

        // Direct exact match
        let override = origMap.get(originalText) || origMap.get(trimmedCurrent);

        if (override && typeof override.text === 'string') {
          if (trimmedCurrent !== override.text) {
            const leading = currentVal.match(/^\s*/)?.[0] || '';
            const trailing = currentVal.match(/\s*$/)?.[0] || '';
            textNode.nodeValue = leading + override.text + trailing;
          }
        }

        currentNode = walker.nextNode();
      }

      // 3. Leaf Element Level check for complex headings/buttons that have multiple child spans
      for (const override of activeOverridesList) {
        if (!override.originalText) continue;
        const origNorm = normalizeStr(override.originalText);
        if (origNorm.length < 3) continue;

        // Find candidate elements whose normalized text matches this override
        const headingsAndButtons = document.querySelectorAll(
          'h1, h2, h3, h4, h5, h6, button, a, p, span.font-heading'
        );

        headingsAndButtons.forEach((el) => {
          const element = el as HTMLElement;
          if (element.closest('[data-admin-editor-ignore="true"]')) return;
          const fullText = normalizeStr(element.innerText || element.textContent || '');
          if (fullText === origNorm && fullText !== override.text) {
            element.setAttribute('data-wt-id', override.id);
            element.setAttribute('data-wt-orig', origNorm);
            updateElementText(element, override.text);
          }
        });
      }
    } catch (err) {
      console.warn('DOM text replacement notice:', err);
    } finally {
      isApplyingReplacements.current = false;
    }
  }, [overrides]);

  // Subscribe to Firestore collection websiteTexts
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'websiteTexts'), (snapshot) => {
      const nextMap: Record<string, WebsiteTextItem> = {};
      const origMap = new Map<string, WebsiteTextItem>();

      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        if (data && typeof data.text === 'string') {
          const item: WebsiteTextItem = {
            id: docSnap.id,
            text: data.text,
            originalText: data.originalText,
            page: data.page,
            updatedAt: data.updatedAt,
            updatedBy: data.updatedBy
          };
          nextMap[docSnap.id] = item;
          if (data.originalText) {
            origMap.set(normalizeStr(data.originalText), item);
          }
        }
      });

      setOverrides(nextMap);
      originalToOverrideRef.current = origMap;
      setLoading(false);

      try {
        localStorage.setItem(LOCAL_STORAGE_CACHE_KEY, JSON.stringify(nextMap));
      } catch (e) {
        console.warn('LocalStorage save failed for websiteTexts:', e);
      }
    }, (err) => {
      console.warn('Error syncing websiteTexts collection from Firestore:', err);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  // Update originalToOverrideRef when overrides change
  useEffect(() => {
    const origMap = new Map<string, WebsiteTextItem>();
    Object.values(overrides).forEach((item) => {
      if (item.originalText) {
        origMap.set(normalizeStr(item.originalText), item);
      }
    });
    originalToOverrideRef.current = origMap;
    // Trigger DOM update
    applyTextReplacements();
  }, [overrides, applyTextReplacements]);

  // Turn off edit mode if admin logs out
  useEffect(() => {
    if (!isAdmin && isEditMode) {
      setIsEditMode(false);
      localStorage.setItem('forenclue_admin_live_edit', 'false');
    }
  }, [isAdmin, isEditMode]);

  const toggleEditMode = useCallback(() => {
    if (!isAdmin) return;
    setIsEditMode(prev => {
      const next = !prev;
      localStorage.setItem('forenclue_admin_live_edit', String(next));
      return next;
    });
  }, [isAdmin]);

  const setEditMode = useCallback((val: boolean) => {
    if (!isAdmin) return;
    setIsEditMode(val);
    localStorage.setItem('forenclue_admin_live_edit', String(val));
  }, [isAdmin]);

  // Save text override
  const saveTextOverride = useCallback(async (
    originalText: string, 
    newText: string, 
    page: string = window.location.pathname,
    customId?: string,
    targetElement?: HTMLElement
  ) => {
    const trimmedOriginal = normalizeStr(originalText);
    const trimmedNew = newText.trim();
    const docId = customId || generateTextId(trimmedOriginal);
    const now = new Date().toISOString();

    const payload: WebsiteTextItem = {
      id: docId,
      text: trimmedNew,
      originalText: trimmedOriginal,
      page,
      updatedAt: now,
      updatedBy: user?.email || 'admin'
    };

    // 1. Immediately update targetElement directly in the DOM
    if (targetElement) {
      targetElement.setAttribute('data-wt-id', docId);
      targetElement.setAttribute('data-wt-orig', trimmedOriginal);
      updateElementText(targetElement, trimmedNew);
      targetElement.classList.add('admin-edit-saved-flash');
      setTimeout(() => {
        targetElement.classList.remove('admin-edit-saved-flash');
      }, 1500);
    }

    // 2. Optimistically update local state & in-memory cache
    originalToOverrideRef.current.set(trimmedOriginal, payload);
    setOverrides(prev => {
      const next = { ...prev, [docId]: payload };
      try {
        localStorage.setItem(LOCAL_STORAGE_CACHE_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });

    // 3. Immediately apply to all matching elements across the DOM
    applyTextReplacements();

    // 4. Save to Firestore database
    try {
      await setDoc(doc(db, 'websiteTexts', docId), {
        text: trimmedNew,
        originalText: trimmedOriginal,
        page,
        updatedAt: now,
        updatedBy: user?.email || 'admin'
      }, { merge: true });
    } catch (err: any) {
      console.warn("Firestore websiteTexts write notice:", err);
    }

    // 5. Re-check on upcoming frames to guarantee React re-renders preserve the change
    requestAnimationFrame(() => applyTextReplacements());
    setTimeout(() => {
      applyTextReplacements();
      scanPageTexts();
    }, 80);
    setTimeout(() => {
      applyTextReplacements();
    }, 300);
  }, [user, applyTextReplacements]);

  // Reset text override
  const resetTextOverride = useCallback(async (idOrOriginalText: string, targetElement?: HTMLElement) => {
    let targetDocId = idOrOriginalText;
    let originalTextKey = '';

    if (!overrides[idOrOriginalText]) {
      const normalized = normalizeStr(idOrOriginalText);
      const match = originalToOverrideRef.current.get(normalized);
      if (match) {
        targetDocId = match.id;
        originalTextKey = normalized;
      } else {
        targetDocId = generateTextId(normalized);
        originalTextKey = normalized;
      }
    } else {
      originalTextKey = overrides[idOrOriginalText]?.originalText || '';
    }

    // Revert targetElement directly if provided
    if (targetElement && originalTextKey) {
      targetElement.removeAttribute('data-wt-id');
      targetElement.removeAttribute('data-wt-orig');
      updateElementText(targetElement, originalTextKey);
    }

    try {
      await deleteDoc(doc(db, 'websiteTexts', targetDocId));
    } catch (e) {
      console.warn('Could not delete override doc from Firestore:', e);
    }

    setOverrides(prev => {
      const next = { ...prev };
      delete next[targetDocId];
      try {
        localStorage.setItem(LOCAL_STORAGE_CACHE_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });

    if (originalTextKey) {
      originalToOverrideRef.current.delete(originalTextKey);
    }

    // Reapply to DOM
    setTimeout(() => {
      applyTextReplacements();
      scanPageTexts();
    }, 50);
  }, [overrides, applyTextReplacements]);

  // Helper function to get text for programmatic React use
  const getText = useCallback((originalText: string, defaultText?: string): string => {
    const normalized = normalizeStr(originalText);
    const match = originalToOverrideRef.current.get(normalized);
    if (match && typeof match.text === 'string') {
      return match.text;
    }
    const id = generateTextId(normalized);
    if (overrides[id] && typeof overrides[id].text === 'string') {
      return overrides[id].text;
    }
    return defaultText !== undefined ? defaultText : originalText;
  }, [overrides]);

  // Scan current page text elements for inspector drawer
  const scanPageTexts = useCallback(() => {
    if (typeof document === 'undefined') return;

    const items: TextItemDetail[] = [];
    const seenTexts = new Set<string>();

    const candidateElements = document.querySelectorAll(
      'h1, h2, h3, h4, h5, h6, p, span, a, button, label, li, blockquote, dt, dd'
    );

    candidateElements.forEach((el) => {
      const element = el as HTMLElement;
      if (element.closest('[data-admin-editor-ignore="true"]')) return;
      if (element.children.length > 3) return; // Skip complex container wrappers

      const text = normalizeStr(element.innerText || element.textContent || '');
      if (!text || text.length < 2 || text.length > 2000) return;
      if (seenTexts.has(text)) return;
      seenTexts.add(text);

      const id = generateTextId(text);
      const override = originalToOverrideRef.current.get(text) || overrides[id];
      const isOverridden = Boolean(override && override.text && override.text !== text);

      items.push({
        id,
        originalText: text,
        currentText: isOverridden ? override.text : text,
        isOverridden,
        element,
        tagName: element.tagName.toLowerCase(),
        page: window.location.pathname
      });
    });

    setPageTexts(items);
  }, [overrides]);

  // MutationObserver to watch DOM additions, page navigations, and characterData changes
  useEffect(() => {
    if (typeof window === 'undefined') return;

    applyTextReplacements();

    let animationFrameId: number | null = null;
    const observer = new MutationObserver((mutations) => {
      if (isApplyingReplacements.current) return;

      let shouldRun = false;
      for (const m of mutations) {
        const target = m.target as HTMLElement;
        if (target && target.closest && target.closest('[data-admin-editor-ignore="true"]')) {
          continue;
        }
        shouldRun = true;
        break;
      }

      if (shouldRun) {
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
        animationFrameId = requestAnimationFrame(() => {
          applyTextReplacements();
        });
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true // Crucial to catch React text node reconciliation
    });

    return () => {
      observer.disconnect();
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [applyTextReplacements]);

  // In Edit Mode: attach hover and click listeners to highlight and edit elements
  useEffect(() => {
    if (!isAdmin || !isEditMode) return;

    let hoveredEl: HTMLElement | null = null;

    const isEligibleElement = (el: HTMLElement): boolean => {
      if (el.closest('[data-admin-editor-ignore="true"]')) return false;
      const tag = el.tagName.toLowerCase();
      if (['html', 'body', 'script', 'style', 'input', 'textarea', 'select'].includes(tag)) {
        return false;
      }
      const text = (el.innerText || el.textContent || '').trim();
      return text.length > 0;
    };

    const handleMouseOver = (e: MouseEvent) => {
      let target = e.target as HTMLElement;
      if (!target) return;
      if (['svg', 'path'].includes(target.tagName.toLowerCase())) {
        target = target.closest('button, a, span, div, p, h1, h2, h3, h4, h5, h6') as HTMLElement || target;
      }
      if (!isEligibleElement(target)) return;

      if (hoveredEl && hoveredEl !== target) {
        hoveredEl.classList.remove('admin-edit-highlight');
      }

      hoveredEl = target;
      target.classList.add('admin-edit-highlight');
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target && target === hoveredEl) {
        target.classList.remove('admin-edit-highlight');
        hoveredEl = null;
      }
    };

    const handleClick = (e: MouseEvent) => {
      let target = e.target as HTMLElement;
      if (!target) return;
      if (['svg', 'path'].includes(target.tagName.toLowerCase())) {
        target = target.closest('button, a, span, div, p, h1, h2, h3, h4, h5, h6') as HTMLElement || target;
      }
      if (!isEligibleElement(target)) return;

      e.preventDefault();
      e.stopPropagation();

      const text = normalizeStr(target.innerText || target.textContent || '');
      if (!text) return;

      const id = generateTextId(text);
      const override = originalToOverrideRef.current.get(text) || overrides[id];
      const isOverridden = Boolean(override && override.text);

      setEditingItem({
        id,
        originalText: override?.originalText || text,
        currentText: override?.text || text,
        isOverridden,
        element: target,
        tagName: target.tagName.toLowerCase(),
        page: window.location.pathname
      });
    };

    document.addEventListener('mouseover', handleMouseOver, true);
    document.addEventListener('mouseout', handleMouseOut, true);
    document.addEventListener('click', handleClick, true);

    return () => {
      document.removeEventListener('mouseover', handleMouseOver, true);
      document.removeEventListener('mouseout', handleMouseOut, true);
      document.removeEventListener('click', handleClick, true);
      if (hoveredEl) {
        hoveredEl.classList.remove('admin-edit-highlight');
      }
    };
  }, [isAdmin, isEditMode, overrides]);

  return (
    <WebsiteTextContext.Provider
      value={{
        overrides,
        isEditMode,
        toggleEditMode,
        setEditMode,
        saveTextOverride,
        resetTextOverride,
        editingItem,
        setEditingItem,
        pageTexts,
        refreshPageTexts: scanPageTexts,
        getText,
        loading
      }}
    >
      {children}
    </WebsiteTextContext.Provider>
  );
}

export function useWebsiteText() {
  const context = useContext(WebsiteTextContext);
  if (!context) {
    throw new Error('useWebsiteText must be used within a WebsiteTextProvider');
  }
  return context;
}
