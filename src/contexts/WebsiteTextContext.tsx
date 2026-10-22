import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { useAuth } from '@/contexts/AuthContext';
import { applySvgOverrideToElement } from '@/lib/basicEditorIcons';

export interface DeviceTextStyle {
  color?: string;
  bgColor?: string;
  fontSize?: string;
  fontWeight?: string;
  textAlign?: string;
  textTransform?: string;
  letterSpacing?: string;
  lineHeight?: string;
  fontStyle?: string;
  textDecoration?: string;
  hidden?: boolean;
}

export interface WebsiteTextItem {
  id: string;
  text: string;
  mobileText?: string;
  desktopText?: string;
  originalText?: string;
  domSelector?: string;
  page?: string;
  desktopColor?: string;
  mobileColor?: string;
  desktopStyle?: DeviceTextStyle;
  mobileStyle?: DeviceTextStyle;
  iconName?: string;
  iconDeleted?: boolean;
  isDeleted?: boolean;
  updatedAt?: string;
  updatedBy?: string;
}

export interface SaveTextOverrideOptions {
  mobileText?: string;
  desktopText?: string;
  domSelector?: string;
  desktopColor?: string;
  mobileColor?: string;
  desktopStyle?: DeviceTextStyle;
  mobileStyle?: DeviceTextStyle;
  iconName?: string;
  iconDeleted?: boolean;
  isDeleted?: boolean;
}

export interface TextItemDetail {
  id: string;
  originalText: string;
  domSelector?: string;
  currentText: string;
  mobileText?: string;
  desktopText?: string;
  desktopColor?: string;
  mobileColor?: string;
  desktopStyle?: DeviceTextStyle;
  mobileStyle?: DeviceTextStyle;
  iconName?: string;
  iconDeleted?: boolean;
  isDeleted?: boolean;
  selectedSubstring?: string;
  isOverridden: boolean;
  element?: HTMLElement;
  tagName?: string;
  page: string;
}

export type PreviewDeviceMode = 'auto' | 'desktop' | 'mobile';

export interface WebsiteTextHistoryEntry {
  docId: string;
  originalText: string;
  page: string;
  before: WebsiteTextItem | null;
  after: WebsiteTextItem | null;
  timestamp: number;
}

interface WebsiteTextContextType {
  overrides: Record<string, WebsiteTextItem>;
  isEditMode: boolean;
  toggleEditMode: () => void;
  setEditMode: (val: boolean) => void;
  previewDevice: PreviewDeviceMode;
  setPreviewDevice: (mode: PreviewDeviceMode) => void;
  isMobileViewport: boolean;
  saveTextOverride: (
    originalText: string,
    newText: string,
    page?: string,
    customId?: string,
    targetElement?: HTMLElement,
    extraOptions?: SaveTextOverrideOptions
  ) => Promise<void>;
  resetTextOverride: (idOrOriginalText: string, targetElement?: HTMLElement) => Promise<void>;
  canUndo: boolean;
  canRedo: boolean;
  undoCount: number;
  redoCount: number;
  undoLastEdit: () => Promise<WebsiteTextHistoryEntry | null>;
  redoLastEdit: () => Promise<WebsiteTextHistoryEntry | null>;
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

// Compute a deterministic structural CSS selector path for an element so it can be re-located on page refresh
export function getElementDomSelector(el?: HTMLElement | null): string {
  if (!el || typeof document === 'undefined') return '';
  const parts: string[] = [];
  let curr: HTMLElement | null = el;

  while (curr && curr !== document.body && curr !== document.documentElement) {
    const tag = curr.tagName.toLowerCase();
    if (['main', 'nav', 'footer', 'header'].includes(tag)) {
      const parent = curr.parentElement;
      if (parent) {
        const sameTag = Array.from(parent.children).filter(
          (c) => c.tagName.toLowerCase() === tag
        );
        if (sameTag.length > 1) {
          parts.unshift(`${tag}:nth-of-type(${sameTag.indexOf(curr) + 1})`);
        } else {
          parts.unshift(tag);
        }
      } else {
        parts.unshift(tag);
      }
      break;
    }

    const parent = curr.parentElement;
    if (!parent) break;
    const siblings = Array.from(parent.children).filter(
      (c) => c.tagName.toLowerCase() === tag
    );
    if (siblings.length > 1) {
      const idx = siblings.indexOf(curr) + 1;
      parts.unshift(`${tag}:nth-of-type(${idx})`);
    } else {
      parts.unshift(tag);
    }
    curr = parent;
  }

  return parts.join(' > ');
}

function querySelectorSafe(selector?: string): HTMLElement | null {
  if (!selector || typeof document === 'undefined') return null;
  try {
    const el = document.querySelector<HTMLElement>(selector);
    if (el && !el.closest('[data-admin-editor-ignore="true"]')) {
      return el;
    }
  } catch {
    // Ignore invalid selector syntax
  }
  return null;
}

const LOCAL_STORAGE_CACHE_KEY = 'forenclue_website_texts_cache';
const LOCAL_ADMIN_SAVED_KEY = 'forenclue_admin_saved_overrides';
const STYLE_ELEMENT_ID = 'forenclue-live-text-styles';

function getLocalAdminSavedMap(): Record<string, WebsiteTextItem> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(LOCAL_ADMIN_SAVED_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveLocalAdminItem(item: WebsiteTextItem) {
  if (typeof window === 'undefined') return;
  try {
    const map = getLocalAdminSavedMap();
    map[item.id] = item;
    localStorage.setItem(LOCAL_ADMIN_SAVED_KEY, JSON.stringify(map));
  } catch {
    // Ignore storage error
  }
}

function removeLocalAdminItem(docId: string) {
  if (typeof window === 'undefined') return;
  try {
    const map = getLocalAdminSavedMap();
    if (docId in map) {
      delete map[docId];
      localStorage.setItem(LOCAL_ADMIN_SAVED_KEY, JSON.stringify(map));
    }
  } catch {
    // Ignore storage error
  }
}

export function normalizeStr(str: string): string {
  return str ? str.trim().replace(/\s+/g, ' ') : '';
}

function buildOrigLookupMap(itemsMap: Record<string, WebsiteTextItem>): Map<string, WebsiteTextItem> {
  const map = new Map<string, WebsiteTextItem>();
  Object.values(itemsMap).forEach((item) => {
    if (item && item.originalText) {
      const norm = normalizeStr(item.originalText);
      if (norm) {
        map.set(norm, item);
        map.set(norm.toLowerCase(), item);
      }
    }
  });
  return map;
}

function lookupByOriginalText(
  map: Map<string, WebsiteTextItem>,
  text?: string | null
): WebsiteTextItem | undefined {
  if (!text) return undefined;
  const norm = normalizeStr(text);
  if (!norm) return undefined;
  return map.get(norm) || map.get(norm.toLowerCase());
}

export function hasDeviceStyleProps(style?: DeviceTextStyle): boolean {
  if (!style) return false;
  return Boolean(
    style.color ||
    style.bgColor ||
    style.fontSize ||
    style.fontWeight ||
    style.textAlign ||
    style.textTransform ||
    style.letterSpacing ||
    style.lineHeight ||
    (style.fontStyle && style.fontStyle !== 'normal') ||
    (style.textDecoration && style.textDecoration !== 'none') ||
    style.hidden
  );
}

export function isItemCustomized(item?: WebsiteTextItem, fallbackOrig?: string): boolean {
  if (!item) return false;
  if (item.isDeleted || item.iconDeleted || item.iconName) return true;
  const orig = normalizeStr(item.originalText || fallbackOrig || '');
  if (item.text !== undefined && normalizeStr(item.text) !== orig) return true;
  if (item.mobileText !== undefined && item.mobileText !== '' && normalizeStr(item.mobileText) !== orig) return true;
  if (item.desktopText !== undefined && normalizeStr(item.desktopText) !== orig) return true;
  if (item.desktopColor || item.mobileColor) return true;
  if (hasDeviceStyleProps(item.desktopStyle) || hasDeviceStyleProps(item.mobileStyle)) return true;
  return false;
}

// Resolve effective text for current viewport (mobile vs desktop)
export function resolveResponsiveText(item: WebsiteTextItem, isMobile: boolean): string {
  if (item.isDeleted) return '';
  if (isMobile) {
    if (item.mobileStyle?.hidden) return '';
    if (item.mobileText !== undefined && item.mobileText.trim().length > 0) {
      return item.mobileText;
    }
    return item.text ?? '';
  } else {
    if (item.desktopStyle?.hidden) return '';
    if (item.desktopText !== undefined) {
      return item.desktopText;
    }
    return item.text ?? '';
  }
}

export function isItemHiddenOnViewport(item: WebsiteTextItem, isMobile: boolean): boolean {
  if (item.isDeleted) return true;
  if (isMobile) {
    return Boolean(item.mobileStyle?.hidden);
  }
  return Boolean(item.desktopStyle?.hidden);
}

// Build CSS declarations from DeviceTextStyle + color shorthand
function buildCssDeclarations(style?: DeviceTextStyle, fallbackColor?: string): string {
  const rules: string[] = [];
  const color = style?.color || fallbackColor;
  if (color) rules.push(`color: ${color} !important;`);
  if (style?.bgColor) {
    rules.push(`background-color: ${style.bgColor} !important;`);
    rules.push(`padding-left: 0.35em; padding-right: 0.35em; border-radius: 0.35em;`);
  }
  if (style?.fontSize) rules.push(`font-size: ${style.fontSize} !important;`);
  if (style?.fontWeight) rules.push(`font-weight: ${style.fontWeight} !important;`);
  if (style?.textAlign) rules.push(`text-align: ${style.textAlign} !important;`);
  if (style?.textTransform) rules.push(`text-transform: ${style.textTransform} !important;`);
  if (style?.letterSpacing) rules.push(`letter-spacing: ${style.letterSpacing} !important;`);
  if (style?.lineHeight) rules.push(`line-height: ${style.lineHeight} !important;`);
  if (style?.fontStyle) rules.push(`font-style: ${style.fontStyle} !important;`);
  if (style?.textDecoration) rules.push(`text-decoration: ${style.textDecoration} !important;`);
  if (style?.hidden) rules.push(`display: none !important;`);
  return rules.join(' ');
}

// Safely updates text inside an element, preserving icons/SVG siblings if present
export function updateElementText(element: HTMLElement, newText: string) {
  if (!element) return;

  const textNodes: Text[] = [];
  const findTextNodes = (node: Node) => {
    for (const child of Array.from(node.childNodes)) {
      if (child.nodeType === Node.TEXT_NODE) {
        if (newText === '' || (child.nodeValue && child.nodeValue.trim().length > 0)) {
          textNodes.push(child as Text);
        }
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
  } else if (newText !== '') {
    const hasSvg = element.querySelector('svg');
    if (!hasSvg) {
      element.textContent = newText;
    } else {
      const newTextNode = document.createTextNode(newText);
      element.appendChild(newTextNode);
    }
  }
}

function syncEmptyParentShellVisibility(el: HTMLElement) {
  const parent = el.parentElement;
  if (!parent || parent === document.body || parent.closest('[data-admin-editor-ignore="true"]')) {
    return;
  }
  const pTag = parent.tagName.toLowerCase();
  if (!['span', 'a', 'button', 'label', 'p', 'div'].includes(pTag)) return;
  if (parent.children.length > 3) return;
  if (parent.querySelector('img, input, select, textarea, video, canvas, iframe')) return;

  // Check if any child or direct text node of parent is still visible
  const hasDirectText = Array.from(parent.childNodes).some(
    (n) => n.nodeType === Node.TEXT_NODE && (n.nodeValue || '').trim().length > 0
  );
  if (hasDirectText) return;

  const hasVisibleChild = Array.from(parent.children).some((child) => {
    const cEl = child as HTMLElement;
    if (cEl.style.display === 'none') return false;
    if (cEl.tagName.toLowerCase() === 'svg') {
      return cEl.getAttribute('data-wt-icon-deleted') !== 'true';
    }
    const cText = (cEl.textContent || '').trim();
    const visibleNestedSvg = Array.from(cEl.querySelectorAll('svg')).some(
      (s) => s.style.display !== 'none' && s.getAttribute('data-wt-icon-deleted') !== 'true'
    );
    return cText.length > 0 || visibleNestedSvg;
  });

  if (!hasVisibleChild) {
    if (!parent.hasAttribute('data-wt-empty-shell')) {
      parent.setAttribute('data-wt-empty-shell', parent.style.display || '');
    }
    parent.style.setProperty('display', 'none', 'important');
  } else if (parent.hasAttribute('data-wt-empty-shell')) {
    const prev = parent.getAttribute('data-wt-empty-shell') || '';
    parent.removeAttribute('data-wt-empty-shell');
    if (prev) {
      parent.style.display = prev;
    } else {
      parent.style.removeProperty('display');
    }
  }
}

function applyOverrideToDomElement(
  el: HTMLElement,
  override: WebsiteTextItem,
  isMobileViewport: boolean
) {
  if (!el || el.closest('[data-admin-editor-ignore="true"]')) return;

  if (el.getAttribute('data-wt-id') !== override.id) {
    el.setAttribute('data-wt-id', override.id);
  }
  if (override.originalText && !el.hasAttribute('data-wt-orig')) {
    el.setAttribute('data-wt-orig', normalizeStr(override.originalText));
  }

  const isStandaloneIconItem = Boolean(
    override.originalText && override.originalText.startsWith('[Icon ')
  );
  const targetText = resolveResponsiveText(override, isMobileViewport);
  const hiddenNow = isItemHiddenOnViewport(override, isMobileViewport);

  if (!isStandaloneIconItem && typeof targetText === 'string') {
    const currentTextContent = normalizeStr(el.textContent || '');
    const currentInnerText = normalizeStr(el.innerText || '');
    const normTarget = normalizeStr(targetText);
    if (currentTextContent !== normTarget || currentInnerText !== normTarget) {
      updateElementText(el, targetText);
    }
  }

  // Apply or clear inline display:none so deleted/hidden elements never remain visible
  if (hiddenNow) {
    if (!el.hasAttribute('data-wt-prev-display')) {
      el.setAttribute('data-wt-prev-display', el.style.display || '');
    }
    el.style.setProperty('display', 'none', 'important');
  } else if (el.hasAttribute('data-wt-prev-display')) {
    const prevDisplay = el.getAttribute('data-wt-prev-display') || '';
    el.removeAttribute('data-wt-prev-display');
    if (prevDisplay) {
      el.style.display = prevDisplay;
    } else {
      el.style.removeProperty('display');
    }
  }

  // Always apply or restore icon overrides if configured or previously modified
  if (
    override.iconDeleted ||
    override.iconName ||
    el.querySelector('[data-wt-orig-svg]') ||
    el.hasAttribute('data-wt-orig-svg')
  ) {
    applySvgOverrideToElement(el, override.iconName, override.iconDeleted);
  }

  if (hiddenNow || override.iconDeleted || el.parentElement?.hasAttribute('data-wt-empty-shell')) {
    syncEmptyParentShellVisibility(el);
  }
}

export function WebsiteTextProvider({ children }: { children: React.ReactNode }) {
  const { isAdmin, user } = useAuth();
  const [overrides, setOverrides] = useState<Record<string, WebsiteTextItem>>(() => {
    try {
      const cached = localStorage.getItem(LOCAL_STORAGE_CACHE_KEY);
      const parsedCache = cached ? JSON.parse(cached) : {};
      const localSaved = getLocalAdminSavedMap();
      return { ...parsedCache, ...localSaved };
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

  const [previewDevice, setPreviewDevice] = useState<PreviewDeviceMode>('auto');
  const [windowIsMobile, setWindowIsMobile] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );

  const isMobileViewport =
    previewDevice === 'mobile'
      ? true
      : previewDevice === 'desktop'
      ? false
      : windowIsMobile;

  const [editingItem, setEditingItem] = useState<TextItemDetail | null>(null);
  const [pageTexts, setPageTexts] = useState<TextItemDetail[]>([]);
  const [loading, setLoading] = useState(true);

  // Undo / Redo History Stacks for Admin Live Text Edits
  const [undoStack, setUndoStack] = useState<WebsiteTextHistoryEntry[]>(() => {
    try {
      const saved = sessionStorage.getItem('forenclue_wt_undo_stack');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [redoStack, setRedoStack] = useState<WebsiteTextHistoryEntry[]>(() => {
    try {
      const saved = sessionStorage.getItem('forenclue_wt_redo_stack');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const isUndoRedoExecutingRef = useRef(false);

  const pushHistoryEntry = useCallback((entry: WebsiteTextHistoryEntry) => {
    if (isUndoRedoExecutingRef.current) return;
    setUndoStack((prev) => {
      const next = [...prev.slice(-49), entry];
      try {
        sessionStorage.setItem('forenclue_wt_undo_stack', JSON.stringify(next));
      } catch {}
      return next;
    });
    setRedoStack(() => {
      try {
        sessionStorage.removeItem('forenclue_wt_redo_stack');
      } catch {}
      return [];
    });
  }, []);

  // Map of normalized original text -> WebsiteTextItem (populated synchronously from initial state)
  const originalToOverrideRef = useRef<Map<string, WebsiteTextItem>>(buildOrigLookupMap(overrides));
  // Map of text node -> original text string
  const textNodeOriginalMap = useRef<WeakMap<Node, string>>(new WeakMap());
  // Set to prevent recursive mutation observer triggers
  const isApplyingReplacements = useRef(false);

  // Listen to window resize to detect mobile (<768px) vs desktop (>=768px)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleResize = () => {
      const nextMobile = window.innerWidth < 768;
      setWindowIsMobile((prev) => (prev !== nextMobile ? nextMobile : prev));
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Sync previewDevice attribute on documentElement for forced previewing
  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (previewDevice === 'auto') {
      document.documentElement.removeAttribute('data-wt-preview-device');
    } else {
      document.documentElement.setAttribute('data-wt-preview-device', previewDevice);
    }
  }, [previewDevice]);

  // Inject dynamic responsive CSS rules for desktop & mobile text colors and styles
  useEffect(() => {
    if (typeof document === 'undefined') return;

    let styleEl = document.getElementById(STYLE_ELEMENT_ID) as HTMLStyleElement | null;
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = STYLE_ELEMENT_ID;
      document.head.appendChild(styleEl);
    }

    const cssBlocks: string[] = [];

    Object.values(overrides).forEach((item) => {
      if (!item || !item.id) return;
      const safeId = item.id.replace(/"/g, '\\"');

      const desktopStyleObj = item.isDeleted ? { ...item.desktopStyle, hidden: true } : item.desktopStyle;
      const mobileStyleObj = item.isDeleted ? { ...item.mobileStyle, hidden: true } : item.mobileStyle;
      const effectiveDesktopColor = desktopStyleObj?.color || item.desktopColor;
      const effectiveMobileColor = mobileStyleObj?.color || item.mobileColor || item.desktopColor || item.desktopStyle?.color;

      const desktopCss = buildCssDeclarations(desktopStyleObj, item.desktopColor);
      const mobileCss = buildCssDeclarations(mobileStyleObj, effectiveMobileColor);

      const getLightModeSafeColor = (col?: string, hasBg?: boolean): string | null => {
        if (!col || hasBg) return null;
        const c = col.trim().toLowerCase();
        if (['#ffffff', '#fff', '#f8fafc', '#f1f5f9', '#e2e8f0', 'white'].includes(c)) {
          return '#0f172a';
        }
        if (['#00f0ff', '#22d3ee', '#67e8f9', '#a5f3fc', '#38bdf8'].includes(c)) {
          return '#0369a1';
        }
        return null;
      };

      if (desktopCss) {
        cssBlocks.push(
          `@media (min-width: 768px) { html:not([data-wt-preview-device="mobile"]) [data-wt-id="${safeId}"] { ${desktopCss} } }`
        );
        cssBlocks.push(
          `html[data-wt-preview-device="desktop"] [data-wt-id="${safeId}"] { ${desktopCss} }`
        );
        const lightDesktopColor = getLightModeSafeColor(effectiveDesktopColor, Boolean(desktopStyleObj?.bgColor));
        if (lightDesktopColor) {
          cssBlocks.push(
            `@media (min-width: 768px) { html.light:not([data-wt-preview-device="mobile"]) [data-wt-id="${safeId}"] { color: ${lightDesktopColor} !important; } }`
          );
          cssBlocks.push(
            `html.light[data-wt-preview-device="desktop"] [data-wt-id="${safeId}"] { color: ${lightDesktopColor} !important; }`
          );
        }
      }

      if (mobileCss) {
        cssBlocks.push(
          `@media (max-width: 767px) { html:not([data-wt-preview-device="desktop"]) [data-wt-id="${safeId}"] { ${mobileCss} } }`
        );
        cssBlocks.push(
          `html[data-wt-preview-device="mobile"] [data-wt-id="${safeId}"] { ${mobileCss} }`
        );
        const lightMobileColor = getLightModeSafeColor(effectiveMobileColor, Boolean(mobileStyleObj?.bgColor));
        if (lightMobileColor) {
          cssBlocks.push(
            `@media (max-width: 767px) { html.light:not([data-wt-preview-device="desktop"]) [data-wt-id="${safeId}"] { color: ${lightMobileColor} !important; } }`
          );
          cssBlocks.push(
            `html.light[data-wt-preview-device="mobile"] [data-wt-id="${safeId}"] { color: ${lightMobileColor} !important; }`
          );
        }
      }
    });

    styleEl.textContent = cssBlocks.join('\n');
  }, [overrides]);

  // Core DOM text replacement & style tagging engine
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

      const origMap = originalToOverrideRef.current;
      const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/';

      // 0. Locate elements directly via saved structural domSelector (handles multi-node containers, deleted blocks & standalone icons)
      for (const override of activeOverridesList) {
        if (!override.domSelector) continue;
        const isGlobalLayoutSelector =
          override.domSelector.startsWith('nav') ||
          override.domSelector.startsWith('header') ||
          override.domSelector.startsWith('footer');
        if (!isGlobalLayoutSelector && override.page && override.page !== currentPath) {
          continue;
        }
        const matchedBySelector = querySelectorSafe(override.domSelector);
        if (matchedBySelector) {
          const existingId = matchedBySelector.getAttribute('data-wt-id');
          const elRawText = normalizeStr(
            matchedBySelector.innerText || matchedBySelector.textContent || ''
          );
          const origNorm = normalizeStr(override.originalText || '');
          const isStandaloneIcon = origNorm.startsWith('[Icon ');
          const matchesTextOrAlreadyTagged =
            existingId === override.id ||
            isStandaloneIcon ||
            !origNorm ||
            elRawText.toLowerCase() === origNorm.toLowerCase() ||
            elRawText === normalizeStr(override.text || '') ||
            elRawText === normalizeStr(override.desktopText || '') ||
            elRawText === normalizeStr(override.mobileText || '') ||
            elRawText === '';

          if (matchesTextOrAlreadyTagged) {
            applyOverrideToDomElement(matchedBySelector, override, isMobileViewport);
          }
        }
      }

      // 1. Process elements already marked with data-wt-id or data-wt-orig
      const markedElements = document.querySelectorAll<HTMLElement>('[data-wt-id], [data-wt-orig]');
      markedElements.forEach((el) => {
        if (el.closest('[data-admin-editor-ignore="true"]')) {
          el.removeAttribute('data-wt-id');
          el.removeAttribute('data-wt-orig');
          return;
        }
        const id = el.getAttribute('data-wt-id');
        const orig = el.getAttribute('data-wt-orig');
        const match = (id && overrides[id]) || lookupByOriginalText(origMap, orig);
        if (match) {
          applyOverrideToDomElement(el, match, isMobileViewport);
        }
      });

      // 2. Element-level check for headings/buttons/badges/containers (runs BEFORE TreeWalker so multi-span containers match before child text nodes are cleared)
      const candidateNodes = document.querySelectorAll<HTMLElement>(
        'h1, h2, h3, h4, h5, h6, button, a, p, span, label, li, td, th, blockquote, dt, dd, figcaption, strong, b, em, div'
      );

      for (const override of activeOverridesList) {
        if (!override.originalText) continue;
        const origNorm = normalizeStr(override.originalText);
        if (origNorm.length < 2 || origNorm.startsWith('[Icon ')) continue;

        const origNormLower = origNorm.toLowerCase();
        const normOverrideText = override.text ? normalizeStr(override.text) : '';
        const normMobileText = override.mobileText ? normalizeStr(override.mobileText) : '';
        const normDesktopText = override.desktopText ? normalizeStr(override.desktopText) : '';

        candidateNodes.forEach((element) => {
          if (element.closest('[data-admin-editor-ignore="true"]')) return;
          const tag = element.tagName.toLowerCase();
          if (tag === 'div') {
            if (element.children.length > 4) return;
            const hasBlockDescendant = element.querySelector('div, section, article, ul, ol, table, form');
            if (hasBlockDescendant && element.children.length > 2) return;
          } else if (element.children.length > 6) {
            return;
          }

          const innerTxt = normalizeStr(element.innerText || '');
          const contentTxt = normalizeStr(element.textContent || '');
          const fullText = innerTxt || contentTxt;
          if (!fullText || fullText.length < 2) return;

          const fullTextLower = fullText.toLowerCase();
          const contentTxtLower = contentTxt.toLowerCase();

          const isMatch =
            fullText === origNorm ||
            fullTextLower === origNormLower ||
            contentTxt === origNorm ||
            contentTxtLower === origNormLower ||
            (normOverrideText.length >= 2 && fullText === normOverrideText) ||
            (normMobileText.length >= 2 && fullText === normMobileText) ||
            (normDesktopText.length >= 2 && fullText === normDesktopText);

          if (isMatch) {
            applyOverrideToDomElement(element, override, isMobileViewport);
          }
        });
      }

      // 3. Walk all text nodes across the entire document
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

        let originalText = textNodeOriginalMap.current.get(textNode);
        if (!originalText) {
          originalText = trimmedCurrent;
          textNodeOriginalMap.current.set(textNode, originalText);
        }

        const override =
          lookupByOriginalText(origMap, originalText) ||
          lookupByOriginalText(origMap, trimmedCurrent);

        if (override) {
          const targetText = resolveResponsiveText(override, isMobileViewport);
          const parentEl = textNode.parentElement;
          if (parentEl && !parentEl.hasAttribute('data-wt-id')) {
            parentEl.setAttribute('data-wt-id', override.id);
            parentEl.setAttribute('data-wt-orig', override.originalText || originalText);
          }

          if (typeof targetText === 'string' && trimmedCurrent !== normalizeStr(targetText)) {
            const leading = currentVal.match(/^\s*/)?.[0] || '';
            const trailing = currentVal.match(/\s*$/)?.[0] || '';
            textNode.nodeValue = targetText === '' ? '' : leading + targetText + trailing;
          }

          if (parentEl) {
            applyOverrideToDomElement(parentEl, override, isMobileViewport);
          }
        }

        currentNode = walker.nextNode();
      }
    } catch (err) {
      console.warn('DOM text replacement notice:', err);
    } finally {
      isApplyingReplacements.current = false;
    }
  }, [overrides, isMobileViewport]);

  // Subscribe to Firestore collection websiteTexts
  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'websiteTexts'),
      (snapshot) => {
        const firestoreMap: Record<string, WebsiteTextItem> = {};

        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          if (data && (typeof data.text === 'string' || data.isDeleted || data.iconDeleted)) {
            const item: WebsiteTextItem = {
              id: docSnap.id,
              text: data.text || '',
              mobileText: data.mobileText || '',
              desktopText: data.desktopText !== undefined ? data.desktopText : (data.text || ''),
              originalText: data.originalText,
              domSelector: data.domSelector || '',
              page: data.page,
              desktopColor: data.desktopColor || data.desktopStyle?.color || '',
              mobileColor: data.mobileColor || data.mobileStyle?.color || '',
              desktopStyle: data.desktopStyle || {},
              mobileStyle: data.mobileStyle || {},
              iconName: data.iconName || '',
              iconDeleted: Boolean(data.iconDeleted),
              isDeleted: Boolean(data.isDeleted),
              updatedAt: data.updatedAt,
              updatedBy: data.updatedBy
            };
            firestoreMap[docSnap.id] = item;
          }
        });

        // Merge with locally saved admin overrides so immediate refreshes or offline/delayed writes never lose edits
        const localSaved = getLocalAdminSavedMap();
        const nextMap: Record<string, WebsiteTextItem> = { ...localSaved, ...firestoreMap };
        Object.keys(localSaved).forEach((docId) => {
          const loc = localSaved[docId];
          const rem = firestoreMap[docId];
          if (loc && rem) {
            const locTime = loc.updatedAt ? Date.parse(loc.updatedAt) : 0;
            const remTime = rem.updatedAt ? Date.parse(rem.updatedAt) : 0;
            nextMap[docId] = locTime >= remTime ? loc : rem;
          }
        });

        originalToOverrideRef.current = buildOrigLookupMap(nextMap);
        setOverrides(nextMap);
        setLoading(false);

        try {
          localStorage.setItem(LOCAL_STORAGE_CACHE_KEY, JSON.stringify(nextMap));
        } catch (e) {
          console.warn('LocalStorage save failed for websiteTexts:', e);
        }
      },
      (err) => {
        console.warn('Error syncing websiteTexts collection from Firestore:', err);
        setLoading(false);
      }
    );

    return () => unsub();
  }, []);

  // Update originalToOverrideRef when overrides or viewport change
  useEffect(() => {
    originalToOverrideRef.current = buildOrigLookupMap(overrides);
    applyTextReplacements();
    const t1 = setTimeout(() => applyTextReplacements(), 120);
    const t2 = setTimeout(() => applyTextReplacements(), 450);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [overrides, isMobileViewport, applyTextReplacements]);

  // Turn off edit mode if admin logs out
  useEffect(() => {
    if (!isAdmin && isEditMode) {
      setIsEditMode(false);
      localStorage.setItem('forenclue_admin_live_edit', 'false');
    }
  }, [isAdmin, isEditMode]);

  const toggleEditMode = useCallback(() => {
    if (!isAdmin) return;
    setIsEditMode((prev) => {
      const next = !prev;
      localStorage.setItem('forenclue_admin_live_edit', String(next));
      return next;
    });
  }, [isAdmin]);

  const setEditMode = useCallback(
    (val: boolean) => {
      if (!isAdmin) return;
      setIsEditMode(val);
      localStorage.setItem('forenclue_admin_live_edit', String(val));
    },
    [isAdmin]
  );

  // Scan current page text elements for inspector drawer (Mobile & Desktop)
  const scanPageTexts = useCallback(() => {
    if (typeof document === 'undefined') return;

    const items: TextItemDetail[] = [];
    const seenKeys = new Set<string>();

    const candidateElements = document.querySelectorAll(
      'h1, h2, h3, h4, h5, h6, p, span, a, button, label, li, blockquote, dt, dd, td, th, figcaption, strong, b, em, div'
    );

    candidateElements.forEach((el) => {
      const element = el as HTMLElement;
      if (element.closest('[data-admin-editor-ignore="true"]')) return;
      const tag = element.tagName.toLowerCase();

      // For generic divs, only include if they directly contain text nodes or very few inline children
      if (tag === 'div') {
        const hasDirectText = Array.from(element.childNodes).some(
          (n) => n.nodeType === Node.TEXT_NODE && (n.nodeValue || '').trim().length > 1
        );
        if (!hasDirectText || element.children.length > 2) return;
      } else {
        if (element.children.length > 6) return;
      }

      const existingId = element.getAttribute('data-wt-id');
      const existingOrig = element.getAttribute('data-wt-orig');
      const rawText = normalizeStr(element.innerText || element.textContent || '');
      const baseOriginal = existingOrig ? normalizeStr(existingOrig) : rawText;
      if (!baseOriginal || baseOriginal.length < 2 || baseOriginal.length > 2500) return;

      const id = existingId || generateTextId(baseOriginal);
      if (seenKeys.has(id)) return;
      seenKeys.add(id);

      const override =
        overrides[id] ||
        lookupByOriginalText(originalToOverrideRef.current, baseOriginal) ||
        lookupByOriginalText(originalToOverrideRef.current, rawText);
      const isOverridden = isItemCustomized(override, baseOriginal);

      items.push({
        id: override?.id || id,
        originalText: override?.originalText || baseOriginal,
        domSelector: override?.domSelector || getElementDomSelector(element),
        currentText: override ? resolveResponsiveText(override, isMobileViewport) : rawText,
        mobileText: override?.mobileText || '',
        desktopText: override?.desktopText !== undefined ? override.desktopText : override?.text ?? rawText,
        desktopColor: override?.desktopColor || override?.desktopStyle?.color || '',
        mobileColor: override?.mobileColor || override?.mobileStyle?.color || '',
        desktopStyle: override?.desktopStyle || {},
        mobileStyle: override?.mobileStyle || {},
        iconName: override?.iconName || '',
        iconDeleted: Boolean(override?.iconDeleted),
        isDeleted: Boolean(override?.isDeleted),
        isOverridden,
        element,
        tagName: tag,
        page: window.location.pathname
      });
    });

    setPageTexts(items);
  }, [overrides, isMobileViewport]);

  // Save text and responsive mobile/desktop override
  const saveTextOverride = useCallback(
    async (
      originalText: string,
      newText: string,
      page: string = window.location.pathname,
      customId?: string,
      targetElement?: HTMLElement,
      extraOptions?: SaveTextOverrideOptions
    ) => {
      const trimmedOriginal = normalizeStr(originalText);
      const trimmedNew = newText.trim();
      const docId = customId || generateTextId(trimmedOriginal);
      const now = new Date().toISOString();

      const computedSelector =
        extraOptions?.domSelector ||
        (targetElement ? getElementDomSelector(targetElement) : '') ||
        overrides[docId]?.domSelector ||
        '';

      const desktopColor = extraOptions?.desktopColor ?? extraOptions?.desktopStyle?.color ?? '';
      const mobileColor = extraOptions?.mobileColor ?? extraOptions?.mobileStyle?.color ?? '';

      const desktopStyle: DeviceTextStyle = {
        ...(extraOptions?.desktopStyle || {}),
        color: desktopColor || undefined
      };
      const mobileStyle: DeviceTextStyle = {
        ...(extraOptions?.mobileStyle || {}),
        color: mobileColor || undefined
      };

      // Clean undefined keys for Firestore
      const cleanStyle = (s: DeviceTextStyle): DeviceTextStyle => {
        const out: Record<string, any> = {};
        Object.entries(s).forEach(([k, v]) => {
          if (v !== undefined && v !== '') {
            out[k] = v;
          }
        });
        return out as DeviceTextStyle;
      };

      const cleanedDesktopStyle = cleanStyle(desktopStyle);
      const cleanedMobileStyle = cleanStyle(mobileStyle);

      const mobileTextVal = extraOptions?.mobileText !== undefined ? extraOptions.mobileText.trim() : '';
      const desktopTextVal = extraOptions?.desktopText !== undefined ? extraOptions.desktopText.trim() : trimmedNew;
      const iconNameVal = extraOptions?.iconName !== undefined ? extraOptions.iconName.trim() : '';
      const iconDeletedVal = Boolean(extraOptions?.iconDeleted);
      const isDeletedVal = Boolean(extraOptions?.isDeleted);

      const payload: WebsiteTextItem = {
        id: docId,
        text: isDeletedVal ? '' : desktopTextVal,
        mobileText: isDeletedVal ? '' : mobileTextVal,
        desktopText: isDeletedVal ? '' : desktopTextVal,
        originalText: trimmedOriginal,
        domSelector: computedSelector,
        page,
        desktopColor,
        mobileColor,
        desktopStyle: cleanedDesktopStyle,
        mobileStyle: cleanedMobileStyle,
        iconName: iconNameVal,
        iconDeleted: iconDeletedVal,
        isDeleted: isDeletedVal,
        updatedAt: now,
        updatedBy: user?.email || 'admin'
      };

      // Record previous state for Undo / Redo before mutating
      const previousItem = overrides[docId]
        ? (JSON.parse(JSON.stringify(overrides[docId])) as WebsiteTextItem)
        : null;

      pushHistoryEntry({
        docId,
        originalText: trimmedOriginal,
        page,
        before: previousItem,
        after: JSON.parse(JSON.stringify(payload)) as WebsiteTextItem,
        timestamp: Date.now()
      });

      // 1. Immediately update targetElement & all matching [data-wt-id] elements directly in the DOM
      const matchedEls =
        typeof document !== 'undefined'
          ? Array.from(document.querySelectorAll<HTMLElement>(`[data-wt-id="${docId}"]`))
          : [];
      if (targetElement && !matchedEls.includes(targetElement)) {
        matchedEls.push(targetElement);
      }
      if (computedSelector) {
        const bySel = querySelectorSafe(computedSelector);
        if (bySel && !matchedEls.includes(bySel)) {
          matchedEls.push(bySel);
        }
      }
      matchedEls.forEach((el) => {
        applyOverrideToDomElement(el, payload, isMobileViewport);
        el.classList.add('admin-edit-saved-flash');
        setTimeout(() => {
          el.classList.remove('admin-edit-saved-flash');
        }, 1500);
      });

      // 2. Optimistically update local state & in-memory cache
      saveLocalAdminItem(payload);
      originalToOverrideRef.current.set(trimmedOriginal, payload);
      originalToOverrideRef.current.set(trimmedOriginal.toLowerCase(), payload);
      setOverrides((prev) => {
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
        await setDoc(
          doc(db, 'websiteTexts', docId),
          {
            text: payload.text,
            mobileText: payload.mobileText || '',
            desktopText: payload.desktopText ?? '',
            originalText: trimmedOriginal,
            domSelector: computedSelector || '',
            page,
            desktopColor: desktopColor || '',
            mobileColor: mobileColor || '',
            desktopStyle: cleanedDesktopStyle,
            mobileStyle: cleanedMobileStyle,
            iconName: iconNameVal || '',
            iconDeleted: iconDeletedVal,
            isDeleted: isDeletedVal,
            updatedAt: now,
            updatedBy: user?.email || 'admin'
          },
          { merge: true }
        );
      } catch (err: any) {
        console.warn('Firestore websiteTexts write notice:', err);
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
    },
    [user, isMobileViewport, overrides, pushHistoryEntry, applyTextReplacements, scanPageTexts]
  );

  // Reset text override
  const resetTextOverride = useCallback(
    async (idOrOriginalText: string, targetElement?: HTMLElement) => {
      let targetDocId = idOrOriginalText;
      let originalTextKey = '';

      if (!overrides[idOrOriginalText]) {
        const normalized = normalizeStr(idOrOriginalText);
        const match = lookupByOriginalText(originalToOverrideRef.current, normalized);
        if (match) {
          targetDocId = match.id;
          originalTextKey = match.originalText || normalized;
        } else {
          targetDocId = generateTextId(normalized);
          originalTextKey = normalized;
        }
      } else {
        originalTextKey = overrides[idOrOriginalText]?.originalText || '';
      }

      const previousItem = overrides[targetDocId]
        ? (JSON.parse(JSON.stringify(overrides[targetDocId])) as WebsiteTextItem)
        : null;

      if (previousItem) {
        pushHistoryEntry({
          docId: targetDocId,
          originalText: originalTextKey || previousItem.originalText || '',
          page: previousItem.page || window.location.pathname,
          before: previousItem,
          after: null,
          timestamp: Date.now()
        });
      }

      const restoreDomEl = (el: HTMLElement) => {
        const orig = el.getAttribute('data-wt-orig') || originalTextKey;
        el.removeAttribute('data-wt-id');
        el.removeAttribute('data-wt-orig');
        if (el.hasAttribute('data-wt-prev-display')) {
          const prevDisplay = el.getAttribute('data-wt-prev-display') || '';
          el.removeAttribute('data-wt-prev-display');
          if (prevDisplay) {
            el.style.display = prevDisplay;
          } else {
            el.style.removeProperty('display');
          }
        } else {
          el.style.removeProperty('display');
        }
        if (orig && !orig.startsWith('[Icon ')) {
          updateElementText(el, orig);
        }
        applySvgOverrideToElement(el, '', false);
        if (el.parentElement?.hasAttribute('data-wt-empty-shell')) {
          const prevShell = el.parentElement.getAttribute('data-wt-empty-shell') || '';
          el.parentElement.removeAttribute('data-wt-empty-shell');
          if (prevShell) {
            el.parentElement.style.display = prevShell;
          } else {
            el.parentElement.style.removeProperty('display');
          }
        }
        el.classList.add('admin-edit-saved-flash');
        setTimeout(() => {
          el.classList.remove('admin-edit-saved-flash');
        }, 1500);
      };

      // Revert targetElement and any elements sharing data-wt-id or domSelector in DOM
      if (typeof document !== 'undefined') {
        const els = document.querySelectorAll<HTMLElement>(`[data-wt-id="${targetDocId}"]`);
        els.forEach((el) => restoreDomEl(el));
        if (previousItem?.domSelector) {
          const bySel = querySelectorSafe(previousItem.domSelector);
          if (bySel) restoreDomEl(bySel);
        }
      }

      if (targetElement) {
        restoreDomEl(targetElement);
      }

      removeLocalAdminItem(targetDocId);

      try {
        await deleteDoc(doc(db, 'websiteTexts', targetDocId));
      } catch (e) {
        console.warn('Could not delete override doc from Firestore:', e);
      }

      setOverrides((prev) => {
        const next = { ...prev };
        delete next[targetDocId];
        try {
          localStorage.setItem(LOCAL_STORAGE_CACHE_KEY, JSON.stringify(next));
        } catch {}
        return next;
      });

      if (originalTextKey) {
        originalToOverrideRef.current.delete(originalTextKey);
        originalToOverrideRef.current.delete(originalTextKey.toLowerCase());
      }

      setTimeout(() => {
        applyTextReplacements();
        scanPageTexts();
      }, 50);
    },
    [overrides, pushHistoryEntry, applyTextReplacements, scanPageTexts]
  );

  // Undo last saved website text edit
  const undoLastEdit = useCallback(async (): Promise<WebsiteTextHistoryEntry | null> => {
    if (undoStack.length === 0) return null;
    const entry = undoStack[undoStack.length - 1];

    setUndoStack((prev) => {
      const next = prev.slice(0, -1);
      try {
        sessionStorage.setItem('forenclue_wt_undo_stack', JSON.stringify(next));
      } catch {}
      return next;
    });
    setRedoStack((prev) => {
      const next = [...prev, entry];
      try {
        sessionStorage.setItem('forenclue_wt_redo_stack', JSON.stringify(next));
      } catch {}
      return next;
    });

    isUndoRedoExecutingRef.current = true;
    try {
      if (entry.before === null) {
        await resetTextOverride(entry.docId);
      } else {
        const target = entry.before;
        await saveTextOverride(
          target.originalText || entry.originalText,
          target.desktopText ?? target.text ?? '',
          target.page || entry.page,
          target.id || entry.docId,
          undefined,
          {
            desktopText: target.desktopText ?? target.text ?? '',
            mobileText: target.mobileText ?? '',
            domSelector: target.domSelector || '',
            desktopColor: target.desktopColor ?? '',
            mobileColor: target.mobileColor ?? '',
            desktopStyle: target.desktopStyle || {},
            mobileStyle: target.mobileStyle || {},
            iconName: target.iconName ?? '',
            iconDeleted: Boolean(target.iconDeleted),
            isDeleted: Boolean(target.isDeleted)
          }
        );
      }
      return entry;
    } finally {
      isUndoRedoExecutingRef.current = false;
    }
  }, [undoStack, resetTextOverride, saveTextOverride]);

  // Redo previously undone website text edit
  const redoLastEdit = useCallback(async (): Promise<WebsiteTextHistoryEntry | null> => {
    if (redoStack.length === 0) return null;
    const entry = redoStack[redoStack.length - 1];

    setRedoStack((prev) => {
      const next = prev.slice(0, -1);
      try {
        sessionStorage.setItem('forenclue_wt_redo_stack', JSON.stringify(next));
      } catch {}
      return next;
    });
    setUndoStack((prev) => {
      const next = [...prev, entry];
      try {
        sessionStorage.setItem('forenclue_wt_undo_stack', JSON.stringify(next));
      } catch {}
      return next;
    });

    isUndoRedoExecutingRef.current = true;
    try {
      if (entry.after === null) {
        await resetTextOverride(entry.docId);
      } else {
        const target = entry.after;
        await saveTextOverride(
          target.originalText || entry.originalText,
          target.desktopText ?? target.text ?? '',
          target.page || entry.page,
          target.id || entry.docId,
          undefined,
          {
            desktopText: target.desktopText ?? target.text ?? '',
            mobileText: target.mobileText ?? '',
            domSelector: target.domSelector || '',
            desktopColor: target.desktopColor ?? '',
            mobileColor: target.mobileColor ?? '',
            desktopStyle: target.desktopStyle || {},
            mobileStyle: target.mobileStyle || {},
            iconName: target.iconName ?? '',
            iconDeleted: Boolean(target.iconDeleted),
            isDeleted: Boolean(target.isDeleted)
          }
        );
      }
      return entry;
    } finally {
      isUndoRedoExecutingRef.current = false;
    }
  }, [redoStack, resetTextOverride, saveTextOverride]);

  // Helper function to get text for programmatic React use
  const getText = useCallback(
    (originalText: string, defaultText?: string): string => {
      const normalized = normalizeStr(originalText);
      const match = lookupByOriginalText(originalToOverrideRef.current, normalized);
      if (match) {
        return resolveResponsiveText(match, isMobileViewport);
      }
      const id = generateTextId(normalized);
      if (overrides[id]) {
        return resolveResponsiveText(overrides[id], isMobileViewport);
      }
      return defaultText !== undefined ? defaultText : originalText;
    },
    [overrides, isMobileViewport]
  );

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
      characterData: true
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
      if (typeof window !== 'undefined') {
        const path = window.location.pathname;
        if (path.startsWith('/admin') || path.startsWith('/dashboard')) return false;
      }
      if (el.closest('[data-admin-editor-ignore="true"]')) return false;
      const tag = el.tagName.toLowerCase();
      if (['html', 'body', 'main', 'section', 'nav', 'header', 'footer', 'script', 'style', 'input', 'textarea', 'select'].includes(tag)) {
        return false;
      }
      if (tag === 'div' && el.children.length > 4) {
        return false;
      }
      const text = (el.innerText || el.textContent || '').trim();
      if (text.length > 0 && text.length <= 2500) return true;
      // Also allow standalone icons or icon-only wrappers
      return Boolean(tag === 'svg' || el.querySelector('svg'));
    };

    const resolveTargetElement = (rawTarget: HTMLElement | null): HTMLElement | null => {
      if (!rawTarget) return null;
      const svgEl = rawTarget.tagName.toLowerCase() === 'svg' ? rawTarget : rawTarget.closest('svg');
      if (svgEl) {
        const candidate =
          (svgEl.closest('button, a, h1, h2, h3, h4, h5, h6, label, li, p, span') as HTMLElement) ||
          (svgEl.parentElement as HTMLElement);
        if (candidate && candidate.tagName.toLowerCase() === 'div' && candidate.children.length > 4) {
          return svgEl as unknown as HTMLElement;
        }
        return candidate || (svgEl as unknown as HTMLElement);
      }
      return rawTarget;
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = resolveTargetElement(e.target as HTMLElement);
      if (!target || !isEligibleElement(target)) return;

      if (hoveredEl && hoveredEl !== target) {
        hoveredEl.classList.remove('admin-edit-highlight');
      }

      hoveredEl = target;
      target.classList.add('admin-edit-highlight');
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = resolveTargetElement(e.target as HTMLElement);
      if (target && target === hoveredEl) {
        target.classList.remove('admin-edit-highlight');
        hoveredEl = null;
      }
    };

    const handleClick = (e: MouseEvent) => {
      const target = resolveTargetElement(e.target as HTMLElement);
      if (!target || !isEligibleElement(target)) return;

      e.preventDefault();
      e.stopPropagation();

      const browserSelection = typeof window !== 'undefined' ? window.getSelection()?.toString().trim() || '' : '';

      const domSelector = getElementDomSelector(target);
      // Prefer raw DOM textContent if innerText was transformed by CSS uppercase, so originalText matches DOM text nodes on refresh
      const rawTextContent = normalizeStr(target.textContent || '');
      const rawInnerText = normalizeStr(target.innerText || '');
      const rawText = rawTextContent || rawInnerText;
      const existingId = target.getAttribute('data-wt-id');
      const existingOrig = target.getAttribute('data-wt-orig');
      const fallbackIconOrig = !rawText && (target.tagName.toLowerCase() === 'svg' || target.querySelector('svg'))
        ? `[Icon ${domSelector || 'element'}]`
        : '';
      const baseOrig = existingOrig ? normalizeStr(existingOrig) : rawText || fallbackIconOrig;
      if (!baseOrig) return;
      const id = existingId || generateTextId(baseOrig);

      const override =
        overrides[id] ||
        lookupByOriginalText(originalToOverrideRef.current, baseOrig) ||
        lookupByOriginalText(originalToOverrideRef.current, rawInnerText);
      const isOverridden = isItemCustomized(override, baseOrig);

      const validSelectedSubstring =
        browserSelection &&
        browserSelection.length > 0 &&
        (rawInnerText.toLowerCase().includes(browserSelection.toLowerCase()) ||
          rawText.toLowerCase().includes(browserSelection.toLowerCase()) ||
          baseOrig.toLowerCase().includes(browserSelection.toLowerCase()))
          ? browserSelection
          : undefined;

      setEditingItem({
        id: override?.id || id,
        originalText: override?.originalText || baseOrig,
        domSelector: override?.domSelector || domSelector,
        currentText: override ? resolveResponsiveText(override, isMobileViewport) : rawText,
        mobileText: override?.mobileText || '',
        desktopText: override?.desktopText !== undefined ? override.desktopText : override?.text ?? rawText,
        desktopColor: override?.desktopColor || override?.desktopStyle?.color || '',
        mobileColor: override?.mobileColor || override?.mobileStyle?.color || '',
        desktopStyle: override?.desktopStyle || {},
        mobileStyle: override?.mobileStyle || {},
        iconName: override?.iconName || '',
        iconDeleted: Boolean(override?.iconDeleted),
        isDeleted: Boolean(override?.isDeleted),
        selectedSubstring: validSelectedSubstring,
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
  }, [isAdmin, isEditMode, overrides, isMobileViewport]);

  return (
    <WebsiteTextContext.Provider
      value={{
        overrides,
        isEditMode,
        toggleEditMode,
        setEditMode,
        previewDevice,
        setPreviewDevice,
        isMobileViewport,
        saveTextOverride,
        resetTextOverride,
        canUndo: undoStack.length > 0,
        canRedo: redoStack.length > 0,
        undoCount: undoStack.length,
        redoCount: redoStack.length,
        undoLastEdit,
        redoLastEdit,
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
