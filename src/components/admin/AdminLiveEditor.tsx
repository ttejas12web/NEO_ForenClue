import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  useWebsiteText,
  DeviceTextStyle,
  generateTextId,
  getElementDomSelector,
  normalizeStr,
  isItemCustomized,
  resolveResponsiveText
} from '@/contexts/WebsiteTextContext';
import {
  BASIC_EDITOR_ICONS,
  BASIC_ICON_MAP,
  findAssociatedSvg,
  applySvgOverrideToElement
} from '@/lib/basicEditorIcons';
import { useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Edit3,
  Check,
  X,
  RotateCcw,
  Search,
  Eye,
  Sparkles,
  ShieldCheck,
  ChevronUp,
  ChevronDown,
  ListFilter,
  ExternalLink,
  Loader2,
  Save,
  FileText,
  Monitor,
  Smartphone,
  Palette,
  Type,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  EyeOff,
  Layers,
  Copy,
  RefreshCw,
  Trash2,
  Scissors,
  GripHorizontal,
  Move,
  Maximize2,
  Minimize2,
  Undo2,
  Redo2
} from 'lucide-react';

interface ModalDraftSnapshot {
  desktopText: string;
  mobileText: string;
  syncMobileText: boolean;
  desktopColor: string;
  mobileColor: string;
  syncMobileColor: boolean;
  desktopStyle: DeviceTextStyle;
  mobileStyle: DeviceTextStyle;
  selectedIconName: string;
  isIconDeleted: boolean;
}

export interface BasicColorOption {
  label: string;
  value: string;
  swatch: string;
  border?: string;
}

export const BASIC_TEXT_COLORS: BasicColorOption[] = [
  { label: 'Default', value: '', swatch: 'bg-gradient-to-br from-white via-zinc-400 to-zinc-900', border: 'border-white/30' },
  { label: 'White', value: '#ffffff', swatch: 'bg-[#ffffff]', border: 'border-zinc-400' },
  { label: 'Black', value: '#0f172a', swatch: 'bg-[#0f172a]', border: 'border-zinc-500' },
  { label: 'Amber / Gold', value: '#f59e0b', swatch: 'bg-[#f59e0b]' },
  { label: 'Yellow', value: '#facc15', swatch: 'bg-[#facc15]' },
  { label: 'Cyan', value: '#06b6d4', swatch: 'bg-[#06b6d4]' },
  { label: 'Emerald Green', value: '#10b981', swatch: 'bg-[#10b981]' },
  { label: 'Crimson Red', value: '#ef4444', swatch: 'bg-[#ef4444]' },
  { label: 'Royal Blue', value: '#3b82f6', swatch: 'bg-[#3b82f6]' },
  { label: 'Violet Purple', value: '#8b5cf6', swatch: 'bg-[#8b5cf6]' },
  { label: 'Rose Pink', value: '#f43f5e', swatch: 'bg-[#f43f5e]' },
  { label: 'Orange', value: '#f97316', swatch: 'bg-[#f97316]' },
  { label: 'Silver / Muted', value: '#94a3b8', swatch: 'bg-[#94a3b8]' }
];

export const BASIC_BG_COLORS: BasicColorOption[] = [
  { label: 'None', value: '', swatch: 'bg-transparent', border: 'border-dashed border-zinc-400' },
  { label: 'Dark Navy', value: '#0f172a', swatch: 'bg-[#0f172a]', border: 'border-zinc-600' },
  { label: 'Pure Black', value: '#000000', swatch: 'bg-[#000000]', border: 'border-zinc-600' },
  { label: 'Pure White', value: '#ffffff', swatch: 'bg-[#ffffff]', border: 'border-zinc-400' },
  { label: 'Amber Tint', value: 'rgba(245, 158, 11, 0.22)', swatch: 'bg-amber-500/40' },
  { label: 'Cyan Tint', value: 'rgba(6, 182, 212, 0.22)', swatch: 'bg-cyan-500/40' },
  { label: 'Emerald Tint', value: 'rgba(16, 185, 129, 0.22)', swatch: 'bg-emerald-500/40' },
  { label: 'Red Tint', value: 'rgba(239, 68, 68, 0.22)', swatch: 'bg-red-500/40' },
  { label: 'Blue Tint', value: 'rgba(59, 130, 246, 0.22)', swatch: 'bg-blue-500/40' },
  { label: 'Purple Tint', value: 'rgba(139, 92, 246, 0.22)', swatch: 'bg-purple-500/40' }
];

export const FONT_SIZE_PRESETS = [
  { label: 'Default', value: '' },
  { label: '2XS (11px)', value: '11px' },
  { label: 'XS (12px)', value: '12px' },
  { label: 'SM (14px)', value: '14px' },
  { label: 'Base (16px)', value: '16px' },
  { label: 'MD (18px)', value: '18px' },
  { label: 'LG (20px)', value: '20px' },
  { label: 'XL (24px)', value: '24px' },
  { label: '2XL (28px)', value: '28px' },
  { label: '3XL (32px)', value: '32px' },
  { label: '4XL (36px)', value: '36px' },
  { label: '5XL (42px)', value: '42px' },
  { label: '6XL (48px)', value: '48px' },
  { label: 'Hero (60px)', value: '60px' }
];

export const FONT_WEIGHT_PRESETS = [
  { label: 'Default', value: '' },
  { label: 'Light (300)', value: '300' },
  { label: 'Normal (400)', value: '400' },
  { label: 'Medium (500)', value: '500' },
  { label: 'SemiBold (600)', value: '600' },
  { label: 'Bold (700)', value: '700' },
  { label: 'ExtraBold (800)', value: '800' },
  { label: 'Black (900)', value: '900' }
];

export const LETTER_SPACING_PRESETS = [
  { label: 'Default', value: '' },
  { label: 'Tighter (-0.04em)', value: '-0.04em' },
  { label: 'Tight (-0.02em)', value: '-0.02em' },
  { label: 'Normal (0)', value: '0em' },
  { label: 'Wide (0.04em)', value: '0.04em' },
  { label: 'Wider (0.08em)', value: '0.08em' },
  { label: 'Widest (0.15em)', value: '0.15em' }
];

export const LINE_HEIGHT_PRESETS = [
  { label: 'Default', value: '' },
  { label: 'Tight (1.15)', value: '1.15' },
  { label: 'Snug (1.35)', value: '1.35' },
  { label: 'Normal (1.5)', value: '1.5' },
  { label: 'Relaxed (1.65)', value: '1.65' },
  { label: 'Loose (1.9)', value: '1.9' }
];

export function AdminLiveEditor() {
  const { isAdmin } = useAuth();
  const {
    isEditMode,
    toggleEditMode,
    previewDevice,
    setPreviewDevice,
    isMobileViewport,
    editingItem,
    setEditingItem,
    saveTextOverride,
    resetTextOverride,
    canUndo,
    canRedo,
    undoCount,
    redoCount,
    undoLastEdit,
    redoLastEdit,
    overrides,
    pageTexts,
    refreshPageTexts
  } = useWebsiteText();

  const location = useLocation();

  // Editor Modal State for Desktop & Mobile
  const [activeDeviceTab, setActiveDeviceTab] = useState<'desktop' | 'mobile' | 'both'>('both');
  const [desktopText, setDesktopText] = useState('');
  const [mobileText, setMobileText] = useState('');
  const [syncMobileText, setSyncMobileText] = useState(true);

  const [desktopColor, setDesktopColor] = useState('');
  const [mobileColor, setMobileColor] = useState('');
  const [syncMobileColor, setSyncMobileColor] = useState(false);

  const [desktopStyle, setDesktopStyle] = useState<DeviceTextStyle>({});
  const [mobileStyle, setMobileStyle] = useState<DeviceTextStyle>({});

  // Icon replacement & deletion state
  const [selectedIconName, setSelectedIconName] = useState<string>('');
  const [isIconDeleted, setIsIconDeleted] = useState<boolean>(false);
  const [iconCategoryFilter, setIconCategoryFilter] = useState<
    'all' | 'academic' | 'forensic' | 'general' | 'navigation' | 'communication'
  >('all');

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorBanner, setErrorBanner] = useState('');

  // Textarea refs & highlighted selection state for Selected Text Deletion
  const desktopTextareaRef = useRef<HTMLTextAreaElement | null>(null);
  const mobileTextareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [desktopSelection, setDesktopSelection] = useState<{ start: number; end: number; text: string }>({
    start: 0,
    end: 0,
    text: ''
  });
  const [mobileSelection, setMobileSelection] = useState<{ start: number; end: number; text: string }>({
    start: 0,
    end: 0,
    text: ''
  });
  const [pageSelectedPhrase, setPageSelectedPhrase] = useState<string>('');

  const [isMinimized, setIsMinimized] = useState(false);
  const [confirmPageReset, setConfirmPageReset] = useState(false);
  const [isResettingPage, setIsResettingPage] = useState(false);
  const [historyStatusMsg, setHistoryStatusMsg] = useState<string>('');

  // In-Modal Draft Undo / Redo History State
  const [draftHistory, setDraftHistory] = useState<ModalDraftSnapshot[]>([]);
  const [draftIndex, setDraftIndex] = useState<number>(0);
  const isRestoringDraftRef = useRef<boolean>(false);
  const lastEditingIdRef = useRef<string | null>(null);

  // Floating & Draggable state for the Admin Text Editor Controller Widget
  const widgetRef = useRef<HTMLElement | null>(null);
  const [widgetPos, setWidgetPos] = useState<{ x: number; y: number } | null>(() => {
    if (typeof window === 'undefined') return null;
    try {
      const saved = localStorage.getItem('forenclue_admin_text_editor_pos');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed?.x === 'number' && typeof parsed?.y === 'number') {
          return {
            x: Math.max(8, Math.min(parsed.x, window.innerWidth - 220)),
            y: Math.max(8, Math.min(parsed.y, window.innerHeight - 80))
          };
        }
      }
    } catch {
      // Ignore storage errors
    }
    return null;
  });
  const [isDraggingWidget, setIsDraggingWidget] = useState(false);
  const widgetDragOffsetRef = useRef<{ offsetX: number; offsetY: number }>({ offsetX: 0, offsetY: 0 });

  // Floating & Draggable state for the In-Place Element Editor Window
  const modalRef = useRef<HTMLDivElement | null>(null);
  const [modalPos, setModalPos] = useState<{ x: number; y: number } | null>(null);
  const [isDraggingModal, setIsDraggingModal] = useState(false);
  const modalDragOffsetRef = useRef<{ offsetX: number; offsetY: number }>({ offsetX: 0, offsetY: 0 });
  const [isModalCompact, setIsModalCompact] = useState(false);

  // Keep floating panels inside viewport on window resize
  useEffect(() => {
    const handleResize = () => {
      setWidgetPos((prev) => {
        if (!prev) return null;
        const w = widgetRef.current?.offsetWidth || 280;
        const h = widgetRef.current?.offsetHeight || 60;
        return {
          x: Math.max(8, Math.min(prev.x, window.innerWidth - w - 8)),
          y: Math.max(8, Math.min(prev.y, window.innerHeight - h - 8))
        };
      });
      setModalPos((prev) => {
        if (!prev) return null;
        const w = Math.min(modalRef.current?.offsetWidth || 640, window.innerWidth - 16);
        return {
          x: Math.max(8, Math.min(prev.x, window.innerWidth - w - 8)),
          y: Math.max(8, Math.min(prev.y, window.innerHeight - 72))
        };
      });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Initialize modal state when an item is selected for editing
  useEffect(() => {
    if (editingItem) {
      const existingOverride = overrides[editingItem.id];
      const isDeletedItem = Boolean(existingOverride?.isDeleted || editingItem.isDeleted);
      const isStandaloneIcon = Boolean(
        editingItem.originalText && editingItem.originalText.startsWith('[Icon ')
      );
      const fallbackOrigText = isStandaloneIcon ? '' : editingItem.originalText;
      const dText = isDeletedItem
        ? ''
        : existingOverride?.desktopText !== undefined
        ? existingOverride.desktopText
        : existingOverride?.text !== undefined
        ? existingOverride.text
        : editingItem.currentText || fallbackOrigText;
      const mText = isDeletedItem ? '' : existingOverride?.mobileText || '';

      setDesktopText(dText);
      setMobileText(mText || dText);
      setSyncMobileText(!mText || mText === dText);

      const dColor = existingOverride?.desktopColor || existingOverride?.desktopStyle?.color || editingItem.desktopColor || '';
      const mColor = existingOverride?.mobileColor || existingOverride?.mobileStyle?.color || editingItem.mobileColor || '';

      setDesktopColor(dColor);
      setMobileColor(mColor);
      setSyncMobileColor(Boolean(dColor && dColor === mColor));

      setDesktopStyle({
        ...(existingOverride?.desktopStyle || editingItem.desktopStyle || {}),
        color: dColor || undefined
      });
      setMobileStyle({
        ...(existingOverride?.mobileStyle || editingItem.mobileStyle || {}),
        color: mColor || undefined
      });

      setDesktopSelection({ start: 0, end: 0, text: '' });
      setMobileSelection({ start: 0, end: 0, text: '' });
      setPageSelectedPhrase(editingItem.selectedSubstring || '');

      const initIconName = existingOverride?.iconName || editingItem.iconName || '';
      const initIconDeleted = Boolean(
        existingOverride?.iconDeleted || editingItem.iconDeleted || initIconName === 'none'
      );
      const resolvedIconName = initIconName === 'none' ? '' : initIconName;
      setSelectedIconName(resolvedIconName);
      setIsIconDeleted(initIconDeleted);
      setIconCategoryFilter('all');

      setSaveSuccess(false);
      setErrorBanner('');

      // Initialize modal draft undo/redo history when opening a new item
      if (lastEditingIdRef.current !== editingItem.id) {
        lastEditingIdRef.current = editingItem.id;
        const initialSnapshot: ModalDraftSnapshot = {
          desktopText: dText,
          mobileText: mText || dText,
          syncMobileText: !mText || mText === dText,
          desktopColor: dColor,
          mobileColor: mColor,
          syncMobileColor: Boolean(dColor && dColor === mColor),
          desktopStyle: {
            ...(existingOverride?.desktopStyle || editingItem.desktopStyle || {}),
            color: dColor || undefined
          },
          mobileStyle: {
            ...(existingOverride?.mobileStyle || editingItem.mobileStyle || {}),
            color: mColor || undefined
          },
          selectedIconName: resolvedIconName,
          isIconDeleted: initIconDeleted
        };
        setDraftHistory([initialSnapshot]);
        setDraftIndex(0);
      }
    } else {
      lastEditingIdRef.current = null;
      setDraftHistory([]);
      setDraftIndex(0);
    }
  }, [editingItem, overrides]);

  // Track changes inside the modal for Draft Undo / Redo
  useEffect(() => {
    if (!editingItem) return;
    if (isRestoringDraftRef.current) {
      isRestoringDraftRef.current = false;
      return;
    }

    const timer = setTimeout(() => {
      const nextSnap: ModalDraftSnapshot = {
        desktopText,
        mobileText,
        syncMobileText,
        desktopColor,
        mobileColor,
        syncMobileColor,
        desktopStyle: { ...desktopStyle },
        mobileStyle: { ...mobileStyle },
        selectedIconName,
        isIconDeleted
      };

      setDraftHistory((prev) => {
        const current = prev[draftIndex];
        if (current && JSON.stringify(current) === JSON.stringify(nextSnap)) {
          return prev;
        }
        const sliced = prev.slice(0, draftIndex + 1);
        const updated = [...sliced.slice(-39), nextSnap];
        setDraftIndex(updated.length - 1);
        return updated;
      });
    }, 180);

    return () => clearTimeout(timer);
  }, [
    editingItem,
    desktopText,
    mobileText,
    syncMobileText,
    desktopColor,
    mobileColor,
    syncMobileColor,
    desktopStyle,
    mobileStyle,
    selectedIconName,
    isIconDeleted,
    draftIndex
  ]);

  const applyDraftSnapshot = (snap: ModalDraftSnapshot) => {
    isRestoringDraftRef.current = true;
    setDesktopText(snap.desktopText);
    setMobileText(snap.mobileText);
    setSyncMobileText(snap.syncMobileText);
    setDesktopColor(snap.desktopColor);
    setMobileColor(snap.mobileColor);
    setSyncMobileColor(snap.syncMobileColor);
    setDesktopStyle({ ...snap.desktopStyle });
    setMobileStyle({ ...snap.mobileStyle });
    setSelectedIconName(snap.selectedIconName);
    setIsIconDeleted(snap.isIconDeleted);
    if (editingItem?.element) {
      applySvgOverrideToElement(editingItem.element, snap.selectedIconName, snap.isIconDeleted);
    }
  };

  const canModalUndo = draftIndex > 0;
  const canModalRedo = draftIndex < draftHistory.length - 1;

  const handleModalUndo = () => {
    if (draftIndex > 0) {
      const targetIdx = draftIndex - 1;
      const snap = draftHistory[targetIdx];
      if (snap) {
        setDraftIndex(targetIdx);
        applyDraftSnapshot(snap);
      }
    }
  };

  const handleModalRedo = () => {
    if (draftIndex < draftHistory.length - 1) {
      const targetIdx = draftIndex + 1;
      const snap = draftHistory[targetIdx];
      if (snap) {
        setDraftIndex(targetIdx);
        applyDraftSnapshot(snap);
      }
    }
  };

  const handleGlobalUndo = async () => {
    if (!canUndo) return;
    const entry = await undoLastEdit();
    if (entry) {
      setHistoryStatusMsg('Undid last change');
      setTimeout(() => setHistoryStatusMsg(''), 2000);
    }
  };

  const handleGlobalRedo = async () => {
    if (!canRedo) return;
    const entry = await redoLastEdit();
    if (entry) {
      setHistoryStatusMsg('Redid change');
      setTimeout(() => setHistoryStatusMsg(''), 2000);
    }
  };

  // Refresh page texts when location changes so on-page override count stays accurate
  useEffect(() => {
    if (isAdmin) {
      const timer = setTimeout(() => refreshPageTexts(), 250);
      return () => clearTimeout(timer);
    }
  }, [location.pathname, isAdmin, refreshPageTexts]);

  const handleCancelModal = () => {
    if (editingItem?.element) {
      const savedOverride = overrides[editingItem.id];
      applySvgOverrideToElement(
        editingItem.element,
        savedOverride?.iconName || '',
        Boolean(savedOverride?.iconDeleted)
      );
    }
    setEditingItem(null);
  };

  // Keyboard shortcuts: Escape to close modal, Ctrl/Cmd+Z for Undo, Ctrl+Y / Cmd+Shift+Z for Redo
  useEffect(() => {
    if (!isAdmin) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && editingItem) {
        if (editingItem?.element) {
          const savedOverride = overrides[editingItem.id];
          applySvgOverrideToElement(
            editingItem.element,
            savedOverride?.iconName || '',
            Boolean(savedOverride?.iconDeleted)
          );
        }
        setEditingItem(null);
        return;
      }

      const isMod = e.ctrlKey || e.metaKey;
      if (!isMod) return;

      const key = e.key.toLowerCase();
      const isUndoKey = key === 'z' && !e.shiftKey;
      const isRedoKey = (key === 'z' && e.shiftKey) || key === 'y';

      if (!isUndoKey && !isRedoKey) return;

      const activeTag = (document.activeElement as HTMLElement)?.tagName?.toLowerCase();
      const isTypingInInput = activeTag === 'input' || activeTag === 'textarea';

      if (editingItem) {
        if (!isTypingInInput) {
          e.preventDefault();
          if (isUndoKey && canModalUndo) handleModalUndo();
          if (isRedoKey && canModalRedo) handleModalRedo();
        }
      } else if (isEditMode && !isTypingInInput) {
        e.preventDefault();
        if (isUndoKey && canUndo) handleGlobalUndo();
        if (isRedoKey && canRedo) handleGlobalRedo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    isAdmin,
    editingItem,
    isEditMode,
    overrides,
    setEditingItem,
    canModalUndo,
    canModalRedo,
    canUndo,
    canRedo,
    draftIndex,
    draftHistory
  ]);

  // Only render for authenticated admins, and hide on admin and dashboard panels
  if (
    !isAdmin ||
    location.pathname.startsWith('/admin') ||
    location.pathname.startsWith('/dashboard')
  ) {
    return null;
  }

  // Navigate to parent or child DOM element in editor modal
  const handleSelectRelativeElement = (newEl: HTMLElement | null) => {
    if (!newEl || newEl.closest('[data-admin-editor-ignore="true"]')) return;
    const tag = newEl.tagName.toLowerCase();
    if (['html', 'body', 'main', 'section', 'nav', 'header', 'footer', 'script', 'style'].includes(tag)) return;

    const rawText = normalizeStr(newEl.textContent || newEl.innerText || '');
    const domSelector = getElementDomSelector(newEl);
    const fallbackIconOrig =
      !rawText && (tag === 'svg' || newEl.querySelector('svg'))
        ? `[Icon ${domSelector || 'element'}]`
        : '';
    const existingId = newEl.getAttribute('data-wt-id');
    const existingOrig = newEl.getAttribute('data-wt-orig');
    const baseOrig = existingOrig ? normalizeStr(existingOrig) : rawText || fallbackIconOrig;
    if (!baseOrig) return;

    const id = existingId || generateTextId(baseOrig);
    const override = overrides[id];

    setEditingItem({
      id: override?.id || id,
      originalText: override?.originalText || baseOrig,
      domSelector: override?.domSelector || domSelector,
      currentText: override ? resolveResponsiveText(override, isMobileViewport) : rawText,
      mobileText: override?.mobileText || '',
      desktopText: override?.desktopText ?? override?.text ?? rawText,
      desktopColor: override?.desktopColor || override?.desktopStyle?.color || '',
      mobileColor: override?.mobileColor || override?.mobileStyle?.color || '',
      desktopStyle: override?.desktopStyle || {},
      mobileStyle: override?.mobileStyle || {},
      iconName: override?.iconName || '',
      iconDeleted: Boolean(override?.iconDeleted),
      isDeleted: Boolean(override?.isDeleted),
      isOverridden: isItemCustomized(override, baseOrig),
      element: newEl,
      tagName: tag,
      page: location.pathname
    });
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!editingItem) return;

    const finalDesktopText = desktopText.trim();
    const finalMobileText = syncMobileText ? '' : mobileText.trim();
    const finalDesktopColor = desktopColor.trim();
    const finalMobileColor = syncMobileColor ? finalDesktopColor : mobileColor.trim();

    const isStandaloneIcon = Boolean(
      editingItem.originalText && editingItem.originalText.startsWith('[Icon ')
    );
    const isBothEmpty =
      !isStandaloneIcon && finalDesktopText === '' && (syncMobileText || finalMobileText === '');
    const resolvedDomSelector =
      editingItem.domSelector || getElementDomSelector(editingItem.element);

    setIsSaving(true);
    setErrorBanner('');
    try {
      await saveTextOverride(
        editingItem.originalText,
        finalDesktopText,
        location.pathname,
        editingItem.id,
        editingItem.element,
        {
          desktopText: finalDesktopText,
          mobileText: finalMobileText,
          domSelector: resolvedDomSelector,
          desktopColor: finalDesktopColor,
          mobileColor: finalMobileColor,
          iconName: isIconDeleted ? 'none' : selectedIconName.trim(),
          iconDeleted: isIconDeleted,
          isDeleted: isBothEmpty,
          desktopStyle: {
            ...desktopStyle,
            color: finalDesktopColor || undefined,
            hidden: !isStandaloneIcon && finalDesktopText === '' ? true : desktopStyle.hidden
          },
          mobileStyle: {
            ...mobileStyle,
            color: finalMobileColor || undefined,
            hidden:
              !isStandaloneIcon && (syncMobileText ? finalDesktopText === '' : finalMobileText === '')
                ? true
                : mobileStyle.hidden
          }
        }
      );
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        setEditingItem(null);
      }, 450);
    } catch (err) {
      console.error('Failed to save website text:', err);
      setErrorBanner('Failed to save website text override. Please check network or permissions.');
    } finally {
      setIsSaving(false);
    }
  };

  // Delete highlighted selection inside Desktop or Mobile textarea (or clear text if nothing highlighted)
  const handleDeleteHighlightedInTextarea = (device: 'desktop' | 'mobile') => {
    const isDesktop = device === 'desktop';
    const sel = isDesktop ? desktopSelection : mobileSelection;
    const currentVal = isDesktop ? desktopText : syncMobileText ? desktopText : mobileText;

    if (sel.end > sel.start && sel.text.length > 0) {
      const before = currentVal.slice(0, sel.start);
      const after = currentVal.slice(sel.end);
      const updated = (before + after).replace(/\s{2,}/g, ' ').trim();

      if (isDesktop) {
        setDesktopText(updated);
        if (syncMobileText) setMobileText(updated);
        setDesktopSelection({ start: 0, end: 0, text: '' });
      } else {
        setSyncMobileText(false);
        setMobileText(updated);
        setMobileSelection({ start: 0, end: 0, text: '' });
      }
    } else if (pageSelectedPhrase) {
      handleRemovePhraseFromTexts(pageSelectedPhrase, device);
    } else {
      // If no substring is highlighted, clear the text for this screen
      if (isDesktop) {
        setDesktopText('');
        if (syncMobileText) setMobileText('');
      } else {
        setSyncMobileText(false);
        setMobileText('');
      }
    }
  };

  // Remove a specific highlighted phrase (e.g., selected on the page before clicking)
  const handleRemovePhraseFromTexts = (phrase: string, scope: 'both' | 'desktop' | 'mobile' = 'both') => {
    if (!phrase) return;
    const escaped = phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(escaped, 'gi');

    if (scope === 'both' || scope === 'desktop') {
      const nextDesktop = desktopText.replace(regex, '').replace(/\s{2,}/g, ' ').trim();
      setDesktopText(nextDesktop);
      if (syncMobileText && scope === 'both') {
        setMobileText(nextDesktop);
      }
    }
    if (scope === 'both' || scope === 'mobile') {
      const baseMobile = syncMobileText ? desktopText : mobileText;
      const nextMobile = baseMobile.replace(regex, '').replace(/\s{2,}/g, ' ').trim();
      setMobileText(nextMobile);
      if (scope === 'mobile') {
        setSyncMobileText(false);
      }
    }
    setPageSelectedPhrase('');
  };

  // One-click Delete Selected Text Element (removes text on active device tab or both screens & saves live)
  const handleDeleteSelectedTextElement = async () => {
    if (!editingItem) return;

    setIsSaving(true);
    setErrorBanner('');
    try {
      const deleteDesktop = activeDeviceTab === 'both' || activeDeviceTab === 'desktop';
      const deleteMobile = activeDeviceTab === 'both' || activeDeviceTab === 'mobile';
      const isStandaloneIcon = Boolean(
        editingItem.originalText && editingItem.originalText.startsWith('[Icon ')
      );
      const fallbackOrig = isStandaloneIcon ? '' : editingItem.originalText;

      const nextDesktopText = deleteDesktop ? '' : desktopText.trim() || fallbackOrig;
      const nextMobileText = deleteMobile
        ? ''
        : (syncMobileText ? desktopText.trim() : mobileText.trim()) || fallbackOrig;
      const isCompletelyDeleted = deleteDesktop && deleteMobile;
      const shouldAlsoDeleteIcon = isIconDeleted || (isStandaloneIcon && isCompletelyDeleted);
      const resolvedDomSelector =
        editingItem.domSelector || getElementDomSelector(editingItem.element);

      await saveTextOverride(
        editingItem.originalText,
        nextDesktopText,
        location.pathname,
        editingItem.id,
        editingItem.element,
        {
          desktopText: nextDesktopText,
          mobileText: nextMobileText,
          domSelector: resolvedDomSelector,
          desktopColor: desktopColor.trim(),
          mobileColor: syncMobileColor ? desktopColor.trim() : mobileColor.trim(),
          iconName: shouldAlsoDeleteIcon ? 'none' : selectedIconName.trim(),
          iconDeleted: shouldAlsoDeleteIcon,
          isDeleted: isCompletelyDeleted,
          desktopStyle: {
            ...desktopStyle,
            color: desktopColor.trim() || undefined,
            hidden: deleteDesktop ? true : desktopStyle.hidden
          },
          mobileStyle: {
            ...mobileStyle,
            color: (syncMobileColor ? desktopColor.trim() : mobileColor.trim()) || undefined,
            hidden: deleteMobile ? true : mobileStyle.hidden
          }
        }
      );

      setDesktopText(nextDesktopText);
      setMobileText(nextMobileText);
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        setEditingItem(null);
      }, 450);
    } catch (err) {
      console.error('Failed to delete selected text:', err);
      setErrorBanner('Failed to delete selected text. Please check network or permissions.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = async () => {
    if (!editingItem) return;
    setIsSaving(true);
    setErrorBanner('');
    try {
      await resetTextOverride(editingItem.id, editingItem.element);
      setEditingItem(null);
    } catch (err) {
      console.error('Failed to reset text:', err);
      setErrorBanner('Failed to reset text override.');
    } finally {
      setIsSaving(false);
    }
  };

  const updateDeviceStyle = (
    device: 'desktop' | 'mobile' | 'both',
    key: keyof DeviceTextStyle,
    val: any
  ) => {
    if (device === 'both') {
      setDesktopStyle((prev) => ({ ...prev, [key]: val }));
      setMobileStyle((prev) => ({ ...prev, [key]: val }));
    } else if (device === 'desktop') {
      setDesktopStyle((prev) => ({ ...prev, [key]: val }));
    } else {
      setMobileStyle((prev) => ({ ...prev, [key]: val }));
    }
  };

  const copyDesktopSettingsToMobile = () => {
    setMobileText(desktopText);
    setSyncMobileText(false);
    setMobileColor(desktopColor);
    setSyncMobileColor(false);
    setMobileStyle({ ...desktopStyle, color: desktopColor || undefined });
  };

  const totalOverriddenOnPage = pageTexts.filter((i) => i.isOverridden).length;
  const totalSiteOverrides = Object.keys(overrides).length;

  const handleResetCurrentPageOverrides = async () => {
    const overriddenItems = pageTexts.filter((i) => i.isOverridden);
    if (overriddenItems.length === 0) return;
    setIsResettingPage(true);
    try {
      for (const item of overriddenItems) {
        await resetTextOverride(item.id, item.element);
      }
      refreshPageTexts();
      setConfirmPageReset(false);
    } finally {
      setIsResettingPage(false);
    }
  };

  // Compute inline preview style for modal preview cards
  const getPreviewBoxStyle = (style: DeviceTextStyle, color: string): React.CSSProperties => {
    return {
      color: color || style.color || undefined,
      backgroundColor: style.bgColor || undefined,
      fontSize: style.fontSize || undefined,
      fontWeight: style.fontWeight as any,
      textAlign: (style.textAlign as any) || undefined,
      textTransform: (style.textTransform as any) || undefined,
      letterSpacing: style.letterSpacing || undefined,
      lineHeight: style.lineHeight || undefined,
      fontStyle: style.fontStyle || undefined,
      textDecoration: style.textDecoration || undefined,
      padding: style.bgColor ? '4px 8px' : undefined,
      borderRadius: style.bgColor ? '6px' : undefined,
      opacity: style.hidden ? 0.35 : 1
    };
  };

  const getFriendlyTagLabel = (tag?: string) => {
    const t = (tag || 'text').toLowerCase();
    if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(t)) return `Heading (${t.toUpperCase()})`;
    if (t === 'button') return 'Button';
    if (t === 'a') return 'Link';
    if (t === 'p') return 'Paragraph';
    if (t === 'li') return 'List Item';
    if (t === 'label') return 'Label';
    return `Text (${t.toUpperCase()})`;
  };

  // Render clean, admin-friendly style controls for Unified ('both'), Desktop ('desktop'), or Mobile ('mobile')
  const renderDeviceStyleControls = (mode: 'both' | 'desktop' | 'mobile') => {
    const isUnified = mode === 'both';
    const isDesktop = mode === 'desktop' || mode === 'both';
    const currentColor = isDesktop ? desktopColor : syncMobileColor ? desktopColor : mobileColor;

    const setColorFn = (val: string) => {
      if (isUnified) {
        setDesktopColor(val);
        setMobileColor(val);
        setSyncMobileColor(true);
        updateDeviceStyle('both', 'color', val);
      } else if (mode === 'desktop') {
        setDesktopColor(val);
        updateDeviceStyle('desktop', 'color', val);
        if (syncMobileColor) {
          setMobileColor(val);
          updateDeviceStyle('mobile', 'color', val);
        }
      } else {
        setSyncMobileColor(false);
        setMobileColor(val);
        updateDeviceStyle('mobile', 'color', val);
      }
    };

    const currentStyle = isDesktop ? desktopStyle : mobileStyle;
    const activeSelection = isDesktop ? desktopSelection : mobileSelection;
    const currentTextValue = isDesktop ? desktopText : syncMobileText ? desktopText : mobileText;

    return (
      <div className="space-y-4 bg-base/70 border border-black/10 dark:border-white/10 rounded-2xl p-4">
        <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-2.5 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            {isUnified ? (
              <div className="flex items-center gap-1 text-warning">
                <Monitor size={15} />
                <Smartphone size={14} />
              </div>
            ) : isDesktop ? (
              <Monitor size={15} className="text-cyan-400" />
            ) : (
              <Smartphone size={15} className="text-amber-400" />
            )}
            <span className="text-xs font-heading font-black uppercase tracking-wider text-text-main">
              {isUnified
                ? 'All Screens (Desktop + Mobile)'
                : isDesktop
                ? 'Desktop Screen Only (≥ 768px)'
                : 'Mobile Screen Only (< 768px)'}
            </span>
          </div>

          {mode === 'mobile' && (
            <button
              type="button"
              onClick={copyDesktopSettingsToMobile}
              className="px-2.5 py-1 rounded-lg bg-warning/10 hover:bg-warning/20 text-warning border border-warning/30 text-[10px] font-mono font-bold flex items-center gap-1 cursor-pointer transition-colors"
              title="Copy all Desktop text, color, and typography settings to Mobile"
            >
              <Copy size={11} /> Copy from Desktop
            </button>
          )}
        </div>

        {/* 1. TEXT CONTENT */}
        <div className="space-y-2">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-text-main flex items-center gap-1.5">
              <Type size={13} className={isUnified ? 'text-warning' : isDesktop ? 'text-cyan-400' : 'text-amber-400'} />
              {isUnified ? 'Edit Text Content:' : isDesktop ? 'Desktop Text:' : 'Mobile Text:'}
            </label>

            <div className="flex items-center flex-wrap gap-1.5">
              {mode === 'mobile' && (
                <label className="flex items-center gap-1.5 text-[10px] font-mono text-text-muted cursor-pointer mr-1">
                  <input
                    type="checkbox"
                    checked={syncMobileText}
                    onChange={(e) => {
                      setSyncMobileText(e.target.checked);
                      if (e.target.checked) {
                        setMobileText(desktopText);
                      }
                    }}
                    className="rounded border-white/20 text-warning focus:ring-warning"
                  />
                  <span>Same as Desktop</span>
                </label>
              )}

              {/* Quick Undo/Redo, Case & Delete Selected Text Controls */}
              <div className="flex items-center gap-1 flex-wrap">
                <button
                  type="button"
                  onClick={handleModalUndo}
                  disabled={!canModalUndo}
                  className="px-2 py-0.5 rounded bg-surface border border-black/10 dark:border-white/10 text-[10px] font-mono font-bold text-text-main hover:border-warning hover:text-warning disabled:opacity-35 disabled:pointer-events-none flex items-center gap-1 cursor-pointer transition-colors"
                  title="Undo change in editor (Ctrl+Z)"
                >
                  <Undo2 size={11} /> Undo
                </button>
                <button
                  type="button"
                  onClick={handleModalRedo}
                  disabled={!canModalRedo}
                  className="px-2 py-0.5 rounded bg-surface border border-black/10 dark:border-white/10 text-[10px] font-mono font-bold text-text-main hover:border-warning hover:text-warning disabled:opacity-35 disabled:pointer-events-none flex items-center gap-1 cursor-pointer transition-colors"
                  title="Redo change in editor (Ctrl+Y)"
                >
                  <Redo2 size={11} /> Redo
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const next = currentTextValue.toUpperCase();
                    if (isUnified) {
                      setDesktopText(next);
                      setMobileText(next);
                      setSyncMobileText(true);
                    } else if (isDesktop) {
                      setDesktopText(next);
                      if (syncMobileText) setMobileText(next);
                    } else {
                      setSyncMobileText(false);
                      setMobileText(next);
                    }
                  }}
                  className="px-2 py-0.5 rounded bg-surface border border-black/10 dark:border-white/10 text-[10px] font-mono text-text-muted hover:text-text-main cursor-pointer"
                  title="UPPERCASE"
                >
                  UPPER
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const toTitle = (str: string) =>
                      str.replace(/\w\S*/g, (t) => t.charAt(0).toUpperCase() + t.slice(1).toLowerCase());
                    const next = toTitle(currentTextValue);
                    if (isUnified) {
                      setDesktopText(next);
                      setMobileText(next);
                      setSyncMobileText(true);
                    } else if (isDesktop) {
                      setDesktopText(next);
                      if (syncMobileText) setMobileText(next);
                    } else {
                      setSyncMobileText(false);
                      setMobileText(next);
                    }
                  }}
                  className="px-2 py-0.5 rounded bg-surface border border-black/10 dark:border-white/10 text-[10px] font-mono text-text-muted hover:text-text-main cursor-pointer"
                  title="Title Case"
                >
                  Title
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const next = currentTextValue.toLowerCase();
                    if (isUnified) {
                      setDesktopText(next);
                      setMobileText(next);
                      setSyncMobileText(true);
                    } else if (isDesktop) {
                      setDesktopText(next);
                      if (syncMobileText) setMobileText(next);
                    } else {
                      setSyncMobileText(false);
                      setMobileText(next);
                    }
                  }}
                  className="px-2 py-0.5 rounded bg-surface border border-black/10 dark:border-white/10 text-[10px] font-mono text-text-muted hover:text-text-main cursor-pointer"
                  title="lowercase"
                >
                  lower
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const orig = editingItem?.originalText || '';
                    if (isUnified) {
                      setDesktopText(orig);
                      setMobileText(orig);
                      setSyncMobileText(true);
                    } else if (isDesktop) {
                      setDesktopText(orig);
                      if (syncMobileText) setMobileText(orig);
                    } else {
                      setSyncMobileText(false);
                      setMobileText(orig);
                    }
                  }}
                  className="px-2 py-0.5 rounded bg-surface border border-black/10 dark:border-white/10 text-[10px] font-mono text-text-muted hover:text-warning cursor-pointer"
                  title="Reset text box to original wording"
                >
                  Reset Text
                </button>

                {/* DELETE SELECTED SUBSTRING OR CLEAR TEXT BUTTON */}
                <button
                  type="button"
                  onClick={() => handleDeleteHighlightedInTextarea(isDesktop ? 'desktop' : 'mobile')}
                  className={`px-2.5 py-0.5 rounded border text-[10px] font-mono font-bold flex items-center gap-1 cursor-pointer transition-colors ${
                    activeSelection.text
                      ? 'bg-red-500 text-white border-red-500 shadow-xs animate-pulse'
                      : 'bg-red-500/15 text-red-400 border-red-500/30 hover:bg-red-500/25'
                  }`}
                  title={
                    activeSelection.text
                      ? `Delete highlighted selection: "${activeSelection.text.slice(0, 35)}"`
                      : 'Highlight specific words in the text box to delete them, or click to clear all text'
                  }
                >
                  <Scissors size={11} />
                  <span>
                    {activeSelection.text ? 'Delete Selected Words' : 'Clear Text'}
                  </span>
                </button>
              </div>
            </div>
          </div>

          <textarea
            ref={isDesktop ? desktopTextareaRef : mobileTextareaRef}
            value={currentTextValue}
            onSelect={(e) => {
              const target = e.currentTarget;
              const start = target.selectionStart || 0;
              const end = target.selectionEnd || 0;
              const selected = end > start ? target.value.slice(start, end) : '';
              if (isDesktop) {
                setDesktopSelection({ start, end, text: selected });
              } else {
                setMobileSelection({ start, end, text: selected });
              }
            }}
            onChange={(e) => {
              const val = e.target.value;
              if (isUnified) {
                setDesktopText(val);
                setMobileText(val);
                setSyncMobileText(true);
                setDesktopSelection({ start: 0, end: 0, text: '' });
              } else if (isDesktop) {
                setDesktopText(val);
                if (syncMobileText) setMobileText(val);
                setDesktopSelection({ start: 0, end: 0, text: '' });
              } else {
                setSyncMobileText(false);
                setMobileText(val);
                setMobileSelection({ start: 0, end: 0, text: '' });
              }
            }}
            rows={currentTextValue.length > 90 ? 4 : 3}
            className="w-full bg-surface border border-black/15 dark:border-white/10 rounded-xl p-3 text-sm text-text-main focus:outline-none focus:border-warning font-sans leading-relaxed"
            placeholder="Type your text here, or highlight specific words to delete them..."
          />

          {/* Interactive Selection Helper Bar when user highlights text inside the textarea */}
          {activeSelection.text && (
            <div className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-red-500/15 border border-red-500/30 text-xs font-mono text-red-300">
              <span className="truncate">
                Selected: <strong className="text-white">"{activeSelection.text}"</strong>
              </span>
              <button
                type="button"
                onClick={() => handleDeleteHighlightedInTextarea(isDesktop ? 'desktop' : 'mobile')}
                className="px-3 py-1 rounded-lg bg-red-500 hover:bg-red-600 text-white font-bold uppercase tracking-wider flex items-center gap-1.5 shrink-0 cursor-pointer shadow-xs"
              >
                <Trash2 size={12} /> Remove Selected Words
              </button>
            </div>
          )}
        </div>

        {/* 2. TEXT COLOR SWATCHES */}
        <div className="space-y-2">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-text-main flex items-center gap-1.5">
              <Palette size={13} className={isUnified ? 'text-warning' : isDesktop ? 'text-cyan-400' : 'text-amber-400'} />
              <span>Text Color:</span>
            </label>

            <div className="flex items-center gap-2">
              {mode === 'mobile' && (
                <label className="flex items-center gap-1 text-[10px] font-mono text-text-muted cursor-pointer">
                  <input
                    type="checkbox"
                    checked={syncMobileColor}
                    onChange={(e) => {
                      setSyncMobileColor(e.target.checked);
                      if (e.target.checked) {
                        setMobileColor(desktopColor);
                        updateDeviceStyle('mobile', 'color', desktopColor);
                      }
                    }}
                    className="rounded border-white/20 text-warning focus:ring-warning"
                  />
                  <span>Same color as Desktop</span>
                </label>
              )}

              {currentColor && (
                <button
                  type="button"
                  onClick={() => setColorFn('')}
                  className="text-[10px] font-mono text-red-400 hover:underline cursor-pointer"
                >
                  Reset Color
                </button>
              )}
            </div>
          </div>

          {/* Basic Swatches Grid */}
          <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5">
            {BASIC_TEXT_COLORS.map((c) => {
              const isSelected = (currentColor || '').toLowerCase() === c.value.toLowerCase();
              return (
                <button
                  key={c.label}
                  type="button"
                  onClick={() => setColorFn(c.value)}
                  className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg border text-[10px] font-mono font-bold transition-all cursor-pointer ${
                    isSelected
                      ? 'border-warning bg-warning/15 text-text-main ring-1 ring-warning shadow-sm'
                      : 'border-black/10 dark:border-white/10 bg-surface text-text-muted hover:text-text-main hover:border-warning/40'
                  }`}
                  title={`${c.label} (${c.value || 'Theme Default'})`}
                >
                  <span
                    className={`w-3.5 h-3.5 rounded-full shrink-0 border ${c.swatch} ${
                      c.border || 'border-black/20 dark:border-white/20'
                    }`}
                  />
                  <span className="truncate">{c.label}</span>
                </button>
              );
            })}
          </div>

          {/* Custom Color Picker + Background Highlight in one compact row */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-text-muted">Custom Color:</span>
              <input
                type="color"
                value={currentColor && currentColor.startsWith('#') && currentColor.length === 7 ? currentColor : '#f59e0b'}
                onChange={(e) => setColorFn(e.target.value)}
                className="w-7 h-7 rounded-lg cursor-pointer bg-transparent border border-black/15 dark:border-white/15 p-0.5"
              />
              <input
                type="text"
                value={currentColor}
                onChange={(e) => setColorFn(e.target.value)}
                placeholder="#ffffff"
                className="w-28 bg-surface border border-black/10 dark:border-white/10 rounded-lg px-2.5 py-1 text-[11px] font-mono text-text-main focus:outline-none focus:border-warning"
              />
            </div>

            {/* Highlight Pill Selector */}
            <div className="flex items-center gap-1 flex-wrap">
              <span className="text-[10px] font-mono text-text-muted mr-1">Highlight:</span>
              {BASIC_BG_COLORS.slice(0, 6).map((bg) => {
                const isSelected = (currentStyle.bgColor || '') === bg.value;
                return (
                  <button
                    key={bg.label}
                    type="button"
                    onClick={() => updateDeviceStyle(mode, 'bgColor', bg.value)}
                    className={`flex items-center gap-1 px-2 py-1 rounded-lg border text-[10px] font-mono transition-all cursor-pointer ${
                      isSelected
                        ? 'border-warning bg-warning/15 text-text-main font-bold'
                        : 'border-black/10 dark:border-white/10 bg-surface text-text-muted hover:text-text-main'
                    }`}
                    title={`Highlight: ${bg.label}`}
                  >
                    <span className={`w-2.5 h-2.5 rounded-xs shrink-0 border ${bg.swatch} ${bg.border || 'border-white/20'}`} />
                    <span>{bg.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 3. TYPOGRAPHY & FORMATTING ROW */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
          {/* Font Size */}
          <div>
            <label className="block text-[10px] font-mono uppercase text-text-muted mb-1 font-bold">
              Font Size
            </label>
            <select
              value={currentStyle.fontSize || ''}
              onChange={(e) => updateDeviceStyle(mode, 'fontSize', e.target.value)}
              className="w-full bg-surface border border-black/10 dark:border-white/10 rounded-lg px-2 py-1.5 text-[11px] font-mono text-text-main focus:outline-none focus:border-warning cursor-pointer"
            >
              {FONT_SIZE_PRESETS.map((s) => (
                <option key={s.label} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          {/* Font Weight */}
          <div>
            <label className="block text-[10px] font-mono uppercase text-text-muted mb-1 font-bold">
              Font Weight
            </label>
            <select
              value={currentStyle.fontWeight || ''}
              onChange={(e) => updateDeviceStyle(mode, 'fontWeight', e.target.value)}
              className="w-full bg-surface border border-black/10 dark:border-white/10 rounded-lg px-2 py-1.5 text-[11px] font-mono text-text-main focus:outline-none focus:border-warning cursor-pointer"
            >
              {FONT_WEIGHT_PRESETS.map((w) => (
                <option key={w.label} value={w.value}>
                  {w.label}
                </option>
              ))}
            </select>
          </div>

          {/* Letter Spacing */}
          <div>
            <label className="block text-[10px] font-mono uppercase text-text-muted mb-1 font-bold">
              Letter Spacing
            </label>
            <select
              value={currentStyle.letterSpacing || ''}
              onChange={(e) => updateDeviceStyle(mode, 'letterSpacing', e.target.value)}
              className="w-full bg-surface border border-black/10 dark:border-white/10 rounded-lg px-2 py-1.5 text-[11px] font-mono text-text-main focus:outline-none focus:border-warning cursor-pointer"
            >
              {LETTER_SPACING_PRESETS.map((ls) => (
                <option key={ls.label} value={ls.value}>
                  {ls.label}
                </option>
              ))}
            </select>
          </div>

          {/* Line Height */}
          <div>
            <label className="block text-[10px] font-mono uppercase text-text-muted mb-1 font-bold">
              Line Height
            </label>
            <select
              value={currentStyle.lineHeight || ''}
              onChange={(e) => updateDeviceStyle(mode, 'lineHeight', e.target.value)}
              className="w-full bg-surface border border-black/10 dark:border-white/10 rounded-lg px-2 py-1.5 text-[11px] font-mono text-text-main focus:outline-none focus:border-warning cursor-pointer"
            >
              {LINE_HEIGHT_PRESETS.map((lh) => (
                <option key={lh.label} value={lh.value}>
                  {lh.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 4. ALIGNMENT, STYLE & VISIBILITY */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          {/* Alignment Buttons */}
          <div className="flex items-center gap-1">
            <span className="text-[10px] font-mono uppercase text-text-muted mr-1 font-bold">Align:</span>
            {[
              { value: '', label: 'Auto', icon: null },
              { value: 'left', label: 'Left', icon: <AlignLeft size={13} /> },
              { value: 'center', label: 'Center', icon: <AlignCenter size={13} /> },
              { value: 'right', label: 'Right', icon: <AlignRight size={13} /> },
              { value: 'justify', label: 'Justify', icon: <AlignJustify size={13} /> }
            ].map((al) => {
              const active = (currentStyle.textAlign || '') === al.value;
              return (
                <button
                  key={al.label}
                  type="button"
                  onClick={() => updateDeviceStyle(mode, 'textAlign', al.value)}
                  className={`px-2 py-1 rounded-lg border text-[10px] font-mono font-bold flex items-center gap-1 cursor-pointer transition-colors ${
                    active
                      ? 'bg-warning text-crust border-warning'
                      : 'bg-surface text-text-muted hover:text-text-main border-black/10 dark:border-white/10'
                  }`}
                  title={`Align ${al.label}`}
                >
                  {al.icon || <span>Auto</span>}
                </button>
              );
            })}
          </div>

          {/* Formatting & Screen Visibility */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() =>
                updateDeviceStyle(mode, 'fontStyle', currentStyle.fontStyle === 'italic' ? '' : 'italic')
              }
              className={`p-1.5 rounded-lg border text-xs cursor-pointer transition-colors ${
                currentStyle.fontStyle === 'italic'
                  ? 'bg-warning text-crust border-warning'
                  : 'bg-surface text-text-muted hover:text-text-main border-black/10 dark:border-white/10'
              }`}
              title="Italic"
            >
              <Italic size={13} />
            </button>

            <button
              type="button"
              onClick={() =>
                updateDeviceStyle(
                  mode,
                  'textDecoration',
                  currentStyle.textDecoration === 'underline' ? '' : 'underline'
                )
              }
              className={`p-1.5 rounded-lg border text-xs cursor-pointer transition-colors ${
                currentStyle.textDecoration === 'underline'
                  ? 'bg-warning text-crust border-warning'
                  : 'bg-surface text-text-muted hover:text-text-main border-black/10 dark:border-white/10'
              }`}
              title="Underline"
            >
              <Underline size={13} />
            </button>

            <button
              type="button"
              onClick={() =>
                updateDeviceStyle(
                  mode,
                  'textDecoration',
                  currentStyle.textDecoration === 'line-through' ? '' : 'line-through'
                )
              }
              className={`p-1.5 rounded-lg border text-xs cursor-pointer transition-colors ${
                currentStyle.textDecoration === 'line-through'
                  ? 'bg-warning text-crust border-warning'
                  : 'bg-surface text-text-muted hover:text-text-main border-black/10 dark:border-white/10'
              }`}
              title="Strikethrough"
            >
              <Strikethrough size={13} />
            </button>

            <button
              type="button"
              onClick={() => updateDeviceStyle(mode, 'hidden', !currentStyle.hidden)}
              className={`px-2.5 py-1 rounded-lg border text-[10px] font-mono font-bold flex items-center gap-1 cursor-pointer transition-colors ${
                currentStyle.hidden
                  ? 'bg-red-500/20 text-red-400 border-red-500/40'
                  : 'bg-surface text-text-muted hover:text-text-main border-black/10 dark:border-white/10'
              }`}
              title="Hide this element without deleting its saved text"
            >
              <EyeOff size={12} />
              <span>{currentStyle.hidden ? 'Hidden' : 'Hide Element'}</span>
            </button>
          </div>
        </div>

        {/* 5. ICON REPLACEMENT & DELETION PANEL */}
        {(() => {
          const detectedSvg = findAssociatedSvg(editingItem?.element);
          const filteredIcons =
            iconCategoryFilter === 'all'
              ? BASIC_EDITOR_ICONS
              : BASIC_EDITOR_ICONS.filter((ic) => ic.category === iconCategoryFilter);

          return (
            <div className="space-y-2.5 pt-3 border-t border-black/10 dark:border-white/10">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Sparkles size={13} className="text-warning" />
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-text-main">
                    Website Icon (Replace or Delete):
                  </span>
                  {detectedSvg ? (
                    <span className="px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[9px] font-mono font-bold uppercase">
                      Icon Detected on Element
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-md bg-black/10 dark:bg-white/10 text-text-muted text-[9px] font-mono">
                      Optional Inline Icon
                    </span>
                  )}
                </div>

                {/* Quick Icon Actions: Default Icon vs Delete Icon */}
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedIconName('');
                      setIsIconDeleted(false);
                      if (editingItem?.element) {
                        applySvgOverrideToElement(editingItem.element, '', false);
                      }
                    }}
                    className={`px-2.5 py-1 rounded-lg border text-[10px] font-mono font-bold flex items-center gap-1 cursor-pointer transition-all ${
                      !isIconDeleted && !selectedIconName
                        ? 'bg-warning text-crust border-warning shadow-xs'
                        : 'bg-surface text-text-muted hover:text-text-main border-black/10 dark:border-white/10'
                    }`}
                    title="Keep or restore the original website icon"
                  >
                    <RotateCcw size={11} />
                    <span>Default Icon</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const nextDeleted = !isIconDeleted;
                      setIsIconDeleted(nextDeleted);
                      if (nextDeleted) {
                        setSelectedIconName('');
                      }
                      if (editingItem?.element) {
                        applySvgOverrideToElement(
                          editingItem.element,
                          nextDeleted ? 'none' : selectedIconName,
                          nextDeleted
                        );
                      }
                    }}
                    className={`px-2.5 py-1 rounded-lg border text-[10px] font-mono font-bold flex items-center gap-1 cursor-pointer transition-all ${
                      isIconDeleted
                        ? 'bg-red-500 text-white border-red-500 shadow-xs'
                        : 'bg-red-500/15 text-red-400 border-red-500/30 hover:bg-red-500 hover:text-white'
                    }`}
                    title="Delete/remove the icon from this website element"
                  >
                    <Trash2 size={11} />
                    <span>{isIconDeleted ? 'Icon Deleted' : 'Delete Icon'}</span>
                  </button>
                </div>
              </div>

              {/* Category Filter Pills */}
              <div className="flex items-center gap-1 overflow-x-auto pb-0.5 no-scrollbar">
                {(
                  [
                    { id: 'all', label: 'All Icons (32)' },
                    { id: 'academic', label: 'Academic & College' },
                    { id: 'forensic', label: 'Forensic & Lab' },
                    { id: 'general', label: 'General & Badges' },
                    { id: 'navigation', label: 'Location & Links' },
                    { id: 'communication', label: 'Contact & Media' }
                  ] as const
                ).map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setIconCategoryFilter(cat.id)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold shrink-0 cursor-pointer transition-colors border ${
                      iconCategoryFilter === cat.id
                        ? 'bg-warning/20 text-warning border-warning/40'
                        : 'bg-surface text-text-muted hover:text-text-main border-black/5 dark:border-white/5'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Mostly Used Basic Icons Grid */}
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-1.5 max-h-40 overflow-y-auto pr-1">
                {filteredIcons.map((icon) => {
                  const isSelected = !isIconDeleted && selectedIconName === icon.id;
                  return (
                    <button
                      key={icon.id}
                      type="button"
                      onClick={() => {
                        setSelectedIconName(icon.id);
                        setIsIconDeleted(false);
                        if (editingItem?.element) {
                          applySvgOverrideToElement(editingItem.element, icon.id, false);
                        }
                      }}
                      className={`flex items-center gap-1.5 px-2 py-1.5 rounded-xl border text-left text-[10px] font-mono font-bold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-warning text-crust border-warning shadow-sm ring-1 ring-warning'
                          : 'bg-surface text-text-muted hover:text-text-main hover:border-warning/40 border-black/10 dark:border-white/10'
                      }`}
                      title={`Replace icon with ${icon.label}`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className={`shrink-0 ${isSelected ? 'text-crust' : 'text-warning'}`}
                        dangerouslySetInnerHTML={{ __html: icon.svgContent }}
                      />
                      <span className="truncate">{icon.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })()}
      </div>
    );
  };

  // Pointer Drag Handlers for the Floating Controller Widget
  const handleWidgetPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // Do not start dragging if clicking an interactive button or input inside the header
    if ((e.target as HTMLElement).closest('button, input, a, select')) return;
    if (!widgetRef.current) return;

    const rect = widgetRef.current.getBoundingClientRect();
    widgetDragOffsetRef.current = {
      offsetX: e.clientX - rect.left,
      offsetY: e.clientY - rect.top
    };
    setWidgetPos({ x: rect.left, y: rect.top });
    setIsDraggingWidget(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handleWidgetPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingWidget || !widgetRef.current) return;
    const w = widgetRef.current.offsetWidth || 280;
    const h = widgetRef.current.offsetHeight || 60;
    const nextX = Math.max(8, Math.min(e.clientX - widgetDragOffsetRef.current.offsetX, window.innerWidth - w - 8));
    const nextY = Math.max(8, Math.min(e.clientY - widgetDragOffsetRef.current.offsetY, window.innerHeight - h - 8));
    setWidgetPos({ x: nextX, y: nextY });
  };

  const handleWidgetPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingWidget) return;
    setIsDraggingWidget(false);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // Ignore pointer capture release errors
    }
    if (widgetPos) {
      try {
        localStorage.setItem('forenclue_admin_text_editor_pos', JSON.stringify(widgetPos));
      } catch {
        // Ignore storage errors
      }
    }
  };

  const snapWidgetToCorner = (corner: 'tl' | 'tr' | 'bl' | 'br') => {
    const w = widgetRef.current?.offsetWidth || 295;
    const h = widgetRef.current?.offsetHeight || 220;
    const pad = 16;
    const next = {
      x: corner === 'tl' || corner === 'bl' ? pad : Math.max(pad, window.innerWidth - w - pad),
      y: corner === 'tl' || corner === 'tr' ? 76 : Math.max(pad, window.innerHeight - h - pad)
    };
    setWidgetPos(next);
    try {
      localStorage.setItem('forenclue_admin_text_editor_pos', JSON.stringify(next));
    } catch {
      // Ignore storage errors
    }
  };

  // Pointer Drag Handlers for the Floating Element Editor Window
  const handleModalPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('button, input, a, select')) return;
    if (!modalRef.current) return;

    const rect = modalRef.current.getBoundingClientRect();
    modalDragOffsetRef.current = {
      offsetX: e.clientX - rect.left,
      offsetY: e.clientY - rect.top
    };
    setModalPos({ x: rect.left, y: rect.top });
    setIsDraggingModal(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handleModalPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingModal || !modalRef.current) return;
    const w = modalRef.current.offsetWidth || 640;
    const nextX = Math.max(8, Math.min(e.clientX - modalDragOffsetRef.current.offsetX, window.innerWidth - w - 8));
    const nextY = Math.max(8, Math.min(e.clientY - modalDragOffsetRef.current.offsetY, window.innerHeight - 64));
    setModalPos({ x: nextX, y: nextY });
  };

  const handleModalPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingModal) return;
    setIsDraggingModal(false);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // Ignore pointer capture release errors
    }
  };

  return (
    <div data-admin-editor-ignore="true" className="font-sans">
      {/* FLOATING & DRAGGABLE ADMIN TEXT EDITOR CONTROLLER */}
      <aside
        ref={widgetRef}
        aria-label="Admin Text Editor Controls"
        style={
          widgetPos
            ? { left: `${widgetPos.x}px`, top: `${widgetPos.y}px` }
            : { left: '16px', bottom: '16px' }
        }
        className={`fixed z-[9990] flex flex-col items-start pointer-events-auto max-w-[calc(100vw-1rem)] ${
          isDraggingWidget ? 'select-none opacity-95 scale-[1.01]' : 'transition-shadow duration-200'
        }`}
      >
        <div
          className={`bg-surface/95 backdrop-blur-md border shadow-2xl rounded-2xl overflow-hidden ring-1 ring-black/10 dark:ring-white/10 ${
            isDraggingWidget ? 'border-warning shadow-warning/20' : 'border-warning/40'
          }`}
        >
          {/* Draggable Header Bar */}
          <div
            onPointerDown={handleWidgetPointerDown}
            onPointerMove={handleWidgetPointerMove}
            onPointerUp={handleWidgetPointerUp}
            onPointerCancel={handleWidgetPointerUp}
            title="Drag to move Text Editor anywhere on the screen"
            className="flex items-center justify-between gap-2.5 px-3 py-2.5 bg-gradient-to-r from-amber-500/15 via-warning/10 to-transparent border-b border-warning/20 cursor-grab active:cursor-grabbing select-none touch-none"
          >
            <div className="flex items-center gap-2">
              <GripHorizontal size={14} className="text-warning/80 shrink-0" />
              <span className="flex h-2.5 w-2.5 relative shrink-0">
                <span
                  className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                    isEditMode ? 'bg-amber-400' : 'bg-emerald-400'
                  }`}
                />
                <span
                  className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                    isEditMode ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}
                />
              </span>
              <span className="text-xs font-heading font-black uppercase tracking-wider text-text-main flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-warning" />
                Text Editor
              </span>
              <span
                className={`text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded-md border ${
                  isEditMode
                    ? 'bg-warning/20 text-warning border-warning/40'
                    : 'bg-black/5 dark:bg-white/5 text-text-muted border-black/10 dark:border-white/10'
                }`}
              >
                {isEditMode ? 'Active' : 'Standby'}
              </span>
            </div>

            <div className="flex items-center gap-1" onPointerDown={(e) => e.stopPropagation()}>
              {isMinimized && (
                <>
                  <button
                    type="button"
                    onClick={handleGlobalUndo}
                    disabled={!canUndo}
                    className="p-1 rounded-md bg-black/10 dark:bg-white/10 text-text-main hover:text-warning disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                    title={`Undo last saved edit (${undoCount})`}
                  >
                    <Undo2 size={13} />
                  </button>
                  <button
                    type="button"
                    onClick={handleGlobalRedo}
                    disabled={!canRedo}
                    className="p-1 rounded-md bg-black/10 dark:bg-white/10 text-text-main hover:text-warning disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                    title={`Redo saved edit (${redoCount})`}
                  >
                    <Redo2 size={13} />
                  </button>
                  <button
                    type="button"
                    onClick={toggleEditMode}
                    className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase transition-colors cursor-pointer ${
                      isEditMode
                        ? 'bg-warning text-crust'
                        : 'bg-black/10 dark:bg-white/10 text-text-main hover:bg-warning/20'
                    }`}
                    title="Quick toggle Click-To-Edit mode"
                  >
                    {isEditMode ? 'Turn Off' : 'Edit Page'}
                  </button>
                </>
              )}
              <button
                type="button"
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1 hover:bg-black/10 dark:hover:bg-white/10 rounded-md text-text-muted hover:text-text-main transition-colors cursor-pointer"
                title={isMinimized ? 'Expand Text Editor' : 'Minimize Text Editor'}
              >
                {isMinimized ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
            </div>
          </div>

          {/* Controls Body */}
          {!isMinimized && (
            <div className="p-3 space-y-2.5 min-w-[275px] max-w-[315px]">
              {/* Click-To-Edit Toggle Switch */}
              <div className="flex items-center justify-between gap-3 bg-base/80 p-2.5 rounded-xl border border-black/5 dark:border-white/5">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-text-main flex items-center gap-1.5">
                    <Edit3 size={13} className={isEditMode ? 'text-warning animate-bounce' : 'text-text-muted'} />
                    Click-To-Edit Mode
                  </span>
                  <span className="text-[10px] font-mono text-text-muted">
                    {isEditMode ? 'Click any text on page to edit' : 'Turn on to edit page text'}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={toggleEditMode}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    isEditMode ? 'bg-warning' : 'bg-zinc-700'
                  }`}
                  title="Toggle Admin Click-To-Edit Mode"
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                      isEditMode ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Helpful Quick Guidance when Edit Mode is Active */}
              {isEditMode && (
                <div className="px-2.5 py-1.5 rounded-lg bg-warning/10 border border-warning/25 text-[10px] font-mono text-text-main leading-snug">
                  <strong className="text-warning">Tip:</strong> Drag the top bar to float this editor anywhere. Click any text or icon on the page to edit.
                </div>
              )}

              {/* Screen Preview Mode Switcher (Auto / Desktop / Mobile) */}
              <div className="bg-base/80 p-2 rounded-xl border border-black/5 dark:border-white/5 space-y-1.5">
                <div className="flex items-center justify-between px-0.5">
                  <span className="text-[9px] font-mono uppercase tracking-wider text-text-muted font-bold">
                    Responsive Preview:
                  </span>
                  <span className="text-[9px] font-mono text-warning font-bold uppercase">
                    {previewDevice === 'auto'
                      ? isMobileViewport
                        ? 'Auto (Mobile)'
                        : 'Auto (Desktop)'
                      : previewDevice}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  <button
                    type="button"
                    onClick={() => setPreviewDevice('auto')}
                    className={`px-2 py-1 rounded-lg text-[10px] font-mono font-bold uppercase transition-colors cursor-pointer flex items-center justify-center gap-1 ${
                      previewDevice === 'auto'
                        ? 'bg-warning text-crust shadow-xs'
                        : 'text-text-muted hover:text-text-main bg-surface'
                    }`}
                  >
                    Auto
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewDevice('desktop')}
                    className={`px-2 py-1 rounded-lg text-[10px] font-mono font-bold uppercase transition-colors cursor-pointer flex items-center justify-center gap-1 ${
                      previewDevice === 'desktop'
                        ? 'bg-cyan-500 text-crust shadow-xs'
                        : 'text-text-muted hover:text-text-main bg-surface'
                    }`}
                  >
                    <Monitor size={11} /> Desktop
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewDevice('mobile')}
                    className={`px-2 py-1 rounded-lg text-[10px] font-mono font-bold uppercase transition-colors cursor-pointer flex items-center justify-center gap-1 ${
                      previewDevice === 'mobile'
                        ? 'bg-amber-500 text-crust shadow-xs'
                        : 'text-text-muted hover:text-text-main bg-surface'
                    }`}
                  >
                    <Smartphone size={11} /> Mobile
                  </button>
                </div>
              </div>

              {/* Undo / Redo Saved Edits Controls */}
              <div className="bg-base/80 p-2 rounded-xl border border-black/5 dark:border-white/5 space-y-1.5">
                <div className="flex items-center justify-between px-0.5">
                  <span className="text-[9px] font-mono uppercase tracking-wider text-text-muted font-bold">
                    Edit History:
                  </span>
                  {historyStatusMsg ? (
                    <span className="text-[9px] font-mono text-emerald-400 font-bold">
                      {historyStatusMsg}
                    </span>
                  ) : (
                    <span className="text-[9px] font-mono text-text-muted">
                      Ctrl+Z / Ctrl+Y
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={handleGlobalUndo}
                    disabled={!canUndo}
                    className="px-2.5 py-1.5 rounded-lg bg-surface hover:bg-warning/15 border border-black/10 dark:border-white/10 text-[10px] font-mono font-bold uppercase text-text-main hover:text-warning disabled:opacity-35 disabled:pointer-events-none transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                    title="Undo last saved text or icon change (Ctrl+Z)"
                  >
                    <Undo2 size={12} />
                    <span>Undo {undoCount > 0 ? `(${undoCount})` : ''}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleGlobalRedo}
                    disabled={!canRedo}
                    className="px-2.5 py-1.5 rounded-lg bg-surface hover:bg-warning/15 border border-black/10 dark:border-white/10 text-[10px] font-mono font-bold uppercase text-text-main hover:text-warning disabled:opacity-35 disabled:pointer-events-none transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                    title="Redo previously undone change (Ctrl+Y)"
                  >
                    <Redo2 size={12} />
                    <span>Redo {redoCount > 0 ? `(${redoCount})` : ''}</span>
                  </button>
                </div>
              </div>

              {/* Clean Admin Footer Status */}
              <div className="pt-1.5 border-t border-black/5 dark:border-white/5 flex items-center justify-between gap-2 text-[10px] font-mono text-text-muted">
                <div className="flex items-center gap-2">
                  <span>
                    Saved edits: <strong className="text-warning">{totalSiteOverrides}</strong>
                  </span>
                  {totalOverriddenOnPage > 0 && (
                    <span className="text-emerald-400 font-bold">
                      &bull; {totalOverriddenOnPage} on page
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* FLOATING & DRAGGABLE IN-PLACE TEXT EDITOR WINDOW */}
      <AnimatePresence>
        {editingItem && (
          <div className="fixed inset-0 z-[9999] pointer-events-none flex items-center justify-center p-2 sm:p-4">
            <motion.div
              ref={modalRef}
              initial={{ scale: 0.96, opacity: 0, y: 12 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.96, opacity: 0, y: 12 }}
              style={
                modalPos
                  ? {
                      position: 'fixed',
                      left: `${modalPos.x}px`,
                      top: `${modalPos.y}px`,
                      margin: 0
                    }
                  : undefined
              }
              className={`pointer-events-auto bg-surface/95 backdrop-blur-xl border-2 rounded-2xl w-full max-w-2xl shadow-[0_25px_70px_-15px_rgba(0,0,0,0.75)] overflow-hidden flex flex-col max-h-[88vh] ring-1 ring-black/15 dark:ring-white/15 ${
                isDraggingModal ? 'border-warning select-none opacity-95' : 'border-warning/50'
              }`}
            >
              {/* Draggable Floating Window Header */}
              <div
                onPointerDown={handleModalPointerDown}
                onPointerMove={handleModalPointerMove}
                onPointerUp={handleModalPointerUp}
                onPointerCancel={handleModalPointerUp}
                title="Drag this header bar to move the Text Editor window anywhere on screen"
                className="px-3.5 sm:px-5 py-3 border-b border-black/10 dark:border-white/10 flex items-center justify-between bg-gradient-to-r from-amber-500/15 via-warning/10 to-base/80 gap-2 cursor-grab active:cursor-grabbing select-none touch-none"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="p-2 rounded-xl bg-warning/15 text-warning shrink-0 flex items-center gap-1">
                    <GripHorizontal size={15} />
                    <Edit3 size={15} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-heading font-black text-xs sm:text-sm uppercase tracking-wider text-text-main flex items-center gap-2 flex-wrap">
                      <span>Floating Text Editor</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-black/5 dark:bg-white/10 text-text-muted">
                        {getFriendlyTagLabel(editingItem.tagName)}
                      </span>
                      {editingItem.isOverridden && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                          Customized
                        </span>
                      )}
                    </h3>
                    <p className="text-[10px] font-mono text-text-muted truncate">
                      Drag bar to move anywhere &bull; Page: <span className="text-warning">{location.pathname}</span>
                    </p>
                  </div>
                </div>

                {/* Window Controls: Undo/Redo, Outer Container, Center Reset, Minimize/Compact & Close */}
                <div
                  className="flex items-center gap-1.5 shrink-0"
                  onPointerDown={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center gap-1 bg-surface/90 p-0.5 rounded-lg border border-black/10 dark:border-white/10">
                    <button
                      type="button"
                      onClick={handleModalUndo}
                      disabled={!canModalUndo}
                      className="px-2 py-1 rounded-md hover:bg-warning/15 text-[10px] font-mono font-bold text-text-main hover:text-warning disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1 cursor-pointer transition-colors"
                      title="Undo change in editor (Ctrl+Z)"
                    >
                      <Undo2 size={12} />
                      <span className="hidden md:inline">Undo</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleModalRedo}
                      disabled={!canModalRedo}
                      className="px-2 py-1 rounded-md hover:bg-warning/15 text-[10px] font-mono font-bold text-text-main hover:text-warning disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1 cursor-pointer transition-colors"
                      title="Redo change in editor (Ctrl+Y)"
                    >
                      <Redo2 size={12} />
                      <span className="hidden md:inline">Redo</span>
                    </button>
                  </div>

                  {editingItem.element?.parentElement && !isModalCompact && (
                    <button
                      type="button"
                      onClick={() => handleSelectRelativeElement(editingItem.element?.parentElement || null)}
                      className="hidden sm:flex px-2.5 py-1 rounded-lg bg-surface hover:bg-warning/15 border border-black/10 dark:border-white/10 text-[10px] font-mono font-bold text-text-muted hover:text-warning items-center gap-1 cursor-pointer transition-colors"
                      title="Select the outer parent container instead"
                    >
                      <Layers size={11} /> Outer Container
                    </button>
                  )}

                  {modalPos && (
                    <button
                      type="button"
                      onClick={() => setModalPos(null)}
                      className="px-2 py-1 rounded-lg bg-surface hover:bg-warning/15 border border-black/10 dark:border-white/10 text-[10px] font-mono font-bold text-text-muted hover:text-warning flex items-center gap-1 cursor-pointer transition-colors"
                      title="Snap window back to center of screen"
                    >
                      <Move size={11} />
                      <span className="hidden xs:inline">Center</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => setIsModalCompact((prev) => !prev)}
                    className="p-1.5 hover:bg-black/10 dark:hover:bg-white/10 rounded-lg text-text-muted hover:text-text-main transition-colors cursor-pointer"
                    title={isModalCompact ? 'Expand Editor Window' : 'Minimize Window to inspect page'}
                  >
                    {isModalCompact ? <Maximize2 size={15} /> : <Minimize2 size={15} />}
                  </button>

                  <button
                    type="button"
                    onClick={handleCancelModal}
                    className="p-1.5 hover:bg-black/10 dark:hover:bg-white/10 rounded-lg text-text-muted hover:text-text-main transition-colors cursor-pointer"
                    title="Close Editor (Esc)"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Compact / Minimized Floating Bar View */}
              {isModalCompact ? (
                <div className="px-4 py-3 flex items-center justify-between gap-3 bg-surface">
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-mono text-warning uppercase font-bold block">
                      Editing {getFriendlyTagLabel(editingItem.tagName)}:
                    </span>
                    <p className="text-xs text-text-main font-semibold truncate">
                      {desktopText || editingItem.originalText}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={handleModalUndo}
                      disabled={!canModalUndo}
                      className="p-1.5 rounded-lg bg-base border border-black/10 dark:border-white/10 text-text-main hover:border-warning disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                      title="Undo (Ctrl+Z)"
                    >
                      <Undo2 size={13} />
                    </button>
                    <button
                      type="button"
                      onClick={handleModalRedo}
                      disabled={!canModalRedo}
                      className="p-1.5 rounded-lg bg-base border border-black/10 dark:border-white/10 text-text-main hover:border-warning disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                      title="Redo (Ctrl+Y)"
                    >
                      <Redo2 size={13} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsModalCompact(false)}
                      className="px-3 py-1.5 rounded-xl bg-base border border-black/10 dark:border-white/10 text-xs font-bold text-text-main hover:border-warning cursor-pointer"
                    >
                      Expand Controls
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSave()}
                      disabled={isSaving}
                      className="px-4 py-1.5 rounded-xl bg-warning text-crust font-black text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
                    >
                      {isSaving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
                      <span>Save</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* Modal Scrollable Form Body */
                <form onSubmit={handleSave} className="p-4 sm:p-5 space-y-4 overflow-y-auto">
                  {/* Original Default Reference + Screen Mode Switcher */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-base p-3 rounded-xl border border-black/5 dark:border-white/5">
                    <div className="min-w-0 flex-1">
                      <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-text-muted block">
                        Original Default Text:
                      </span>
                      <p className="text-xs text-text-muted italic line-clamp-2 select-all mt-0.5">
                        "{editingItem.originalText}"
                      </p>
                    </div>

                    {/* Screen Mode Tabs: All Screens (Unified) / Desktop Only / Mobile Only */}
                    <div className="flex items-center gap-1 bg-surface p-1 rounded-xl border border-black/10 dark:border-white/10 shrink-0">
                      <button
                        type="button"
                        onClick={() => setActiveDeviceTab('both')}
                        className={`px-2.5 py-1.5 rounded-lg text-[10px] font-mono font-bold uppercase transition-colors cursor-pointer flex items-center gap-1 ${
                          activeDeviceTab === 'both'
                            ? 'bg-warning text-crust'
                            : 'text-text-muted hover:text-text-main'
                        }`}
                        title="Edit both Desktop and Mobile together"
                      >
                        <Monitor size={11} />+<Smartphone size={11} /> All Screens
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveDeviceTab('desktop')}
                        className={`px-2.5 py-1.5 rounded-lg text-[10px] font-mono font-bold uppercase transition-colors cursor-pointer flex items-center gap-1 ${
                          activeDeviceTab === 'desktop'
                            ? 'bg-cyan-500 text-crust'
                            : 'text-text-muted hover:text-text-main'
                        }`}
                        title="Customize Desktop screen specifically"
                      >
                        <Monitor size={11} /> Desktop
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveDeviceTab('mobile')}
                        className={`px-2.5 py-1.5 rounded-lg text-[10px] font-mono font-bold uppercase transition-colors cursor-pointer flex items-center gap-1 ${
                          activeDeviceTab === 'mobile'
                            ? 'bg-amber-500 text-crust'
                            : 'text-text-muted hover:text-text-main'
                        }`}
                        title="Customize Mobile screen specifically"
                      >
                        <Smartphone size={11} /> Mobile
                        {!syncMobileText && mobileText !== desktopText && (
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Quick Banner if Admin Highlighted a Phrase on the Webpage Before Clicking */}
                  {pageSelectedPhrase && (
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-xl bg-red-500/15 border border-red-500/30">
                      <div className="min-w-0">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-red-400 block">
                          Selected Text Highlighted on Page:
                        </span>
                        <p className="text-xs text-text-main font-semibold truncate">
                          "{pageSelectedPhrase}"
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleRemovePhraseFromTexts(pageSelectedPhrase, 'both')}
                          className="px-3 py-1.5 rounded-lg bg-red-500 hover:bg-red-600 text-white text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer shadow-sm"
                        >
                          <Scissors size={12} /> Delete Highlighted Phrase
                        </button>
                      </div>
                    </div>
                  )}

                  {/* LIVE PREVIEW CARDS FOR DESKTOP & MOBILE */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Desktop Live Preview */}
                    <div className="p-3 rounded-xl bg-base border border-cyan-500/25 space-y-1.5">
                      <div className="flex items-center justify-between text-[10px] font-mono text-cyan-400 font-bold">
                        <span className="flex items-center gap-1">
                          <Monitor size={11} /> Desktop Preview (≥768px)
                        </span>
                        {desktopColor && (
                          <span className="px-1.5 py-0.2 rounded bg-cyan-500/10 border border-cyan-500/20 text-[9px]">
                            {desktopColor}
                          </span>
                        )}
                      </div>
                      <div className="p-2.5 rounded-lg bg-surface/90 border border-black/5 dark:border-white/5 min-h-[44px] flex items-center overflow-hidden">
                        <div
                          style={getPreviewBoxStyle(desktopStyle, desktopColor)}
                          className="w-full text-xs leading-relaxed break-words flex items-center gap-2"
                        >
                          {!isIconDeleted && selectedIconName && BASIC_ICON_MAP.has(selectedIconName) && (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="15"
                              height="15"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="text-warning shrink-0"
                              dangerouslySetInnerHTML={{
                                __html: BASIC_ICON_MAP.get(selectedIconName)!.svgContent
                              }}
                            />
                          )}
                          {isIconDeleted && (
                            <span className="px-1.5 py-0.5 rounded bg-red-500/15 text-red-400 font-mono text-[9px] shrink-0">
                              [Icon Deleted]
                            </span>
                          )}
                          {desktopText ? (
                            <span>{desktopText}</span>
                          ) : (
                            <span className="text-red-400/80 italic font-mono text-[11px]">
                              [Deleted / Empty on Desktop]
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Mobile Live Preview */}
                    <div className="p-3 rounded-xl bg-base border border-amber-500/25 space-y-1.5">
                      <div className="flex items-center justify-between text-[10px] font-mono text-amber-400 font-bold">
                        <span className="flex items-center gap-1">
                          <Smartphone size={11} /> Mobile Preview (&lt;768px)
                        </span>
                        {(syncMobileColor ? desktopColor : mobileColor) && (
                          <span className="px-1.5 py-0.2 rounded bg-amber-500/10 border border-amber-500/20 text-[9px]">
                            {syncMobileColor ? desktopColor : mobileColor}
                          </span>
                        )}
                      </div>
                      <div className="p-2.5 rounded-lg bg-surface/90 border border-black/5 dark:border-white/5 min-h-[44px] flex items-center overflow-hidden">
                        <div
                          style={getPreviewBoxStyle(
                            mobileStyle,
                            syncMobileColor ? desktopColor : mobileColor || desktopColor
                          )}
                          className="w-full text-xs leading-relaxed break-words flex items-center gap-2"
                        >
                          {!isIconDeleted && selectedIconName && BASIC_ICON_MAP.has(selectedIconName) && (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="15"
                              height="15"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="text-warning shrink-0"
                              dangerouslySetInnerHTML={{
                                __html: BASIC_ICON_MAP.get(selectedIconName)!.svgContent
                              }}
                            />
                          )}
                          {isIconDeleted && (
                            <span className="px-1.5 py-0.5 rounded bg-red-500/15 text-red-400 font-mono text-[9px] shrink-0">
                              [Icon Deleted]
                            </span>
                          )}
                          {(syncMobileText ? desktopText : mobileText) ? (
                            <span>{syncMobileText ? desktopText : mobileText}</span>
                          ) : (
                            <span className="text-red-400/80 italic font-mono text-[11px]">
                              [Deleted / Empty on Mobile]
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* UNIFIED OR DEVICE-SPECIFIC CONFIGURATION PANEL */}
                  {renderDeviceStyleControls(activeDeviceTab)}

                  {/* Error or Save Feedback Notice */}
                  {errorBanner && (
                    <div className="p-2.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 text-xs font-mono font-bold">
                      {errorBanner}
                    </div>
                  )}

                  {saveSuccess && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold flex items-center gap-2"
                    >
                      <Check size={14} /> Changes saved live across the website!
                    </motion.div>
                  )}

                  {/* Modal Footer Action Buttons */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-black/10 dark:border-white/10">
                    <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
                      {/* UNDO & REDO IN FOOTER */}
                      <button
                        type="button"
                        onClick={handleModalUndo}
                        disabled={!canModalUndo || isSaving}
                        className="px-3 py-2 bg-base hover:bg-warning/15 text-text-main hover:text-warning border border-black/10 dark:border-white/10 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-35 disabled:pointer-events-none"
                        title="Undo change in editor (Ctrl+Z)"
                      >
                        <Undo2 size={13} />
                        <span>Undo</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleModalRedo}
                        disabled={!canModalRedo || isSaving}
                        className="px-3 py-2 bg-base hover:bg-warning/15 text-text-main hover:text-warning border border-black/10 dark:border-white/10 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-35 disabled:pointer-events-none"
                        title="Redo change in editor (Ctrl+Y)"
                      >
                        <Redo2 size={13} />
                        <span>Redo</span>
                      </button>

                      {/* DELETE SELECTED TEXT OPTION */}
                      <button
                        type="button"
                        onClick={handleDeleteSelectedTextElement}
                        disabled={isSaving}
                        className="px-3 py-2 bg-red-500/15 hover:bg-red-500 hover:text-white text-red-400 border border-red-500/30 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                        title={
                          activeDeviceTab === 'desktop'
                            ? 'Delete this text from Desktop screens'
                            : activeDeviceTab === 'mobile'
                            ? 'Delete this text from Mobile screens'
                            : 'Delete this entire text element from the page'
                        }
                      >
                        <Trash2 size={13} />
                        <span>
                          {activeDeviceTab === 'desktop'
                            ? 'Delete on Desktop'
                            : activeDeviceTab === 'mobile'
                            ? 'Delete on Mobile'
                            : 'Delete Selected Text'}
                        </span>
                      </button>

                      {editingItem.isOverridden && (
                        <button
                          type="button"
                          onClick={handleReset}
                          disabled={isSaving}
                          className="px-3 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/25 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                        >
                          <RotateCcw size={13} />
                          <span>Restore Default</span>
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                      <button
                        type="button"
                        onClick={handleCancelModal}
                        disabled={isSaving}
                        className="px-4 py-2 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 rounded-xl text-xs font-bold text-text-muted hover:text-text-main transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>

                      <button
                        type="submit"
                        disabled={isSaving}
                        className="px-5 py-2 bg-warning hover:bg-warning/90 text-crust font-black text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                      >
                        {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                        <span>Save Changes</span>
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
