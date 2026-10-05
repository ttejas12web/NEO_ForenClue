import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useWebsiteText } from '@/contexts/WebsiteTextContext';
import { useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Edit3, Check, X, RotateCcw, Search, Eye, Filter, 
  Sparkles, ShieldCheck, ChevronUp, ChevronDown, ListFilter,
  ExternalLink, Loader2, Save, FileText, Globe
} from 'lucide-react';

export function AdminLiveEditor() {
  const { isAdmin } = useAuth();
  const { 
    isEditMode, 
    toggleEditMode, 
    setEditMode, 
    editingItem, 
    setEditingItem, 
    saveTextOverride, 
    resetTextOverride, 
    overrides, 
    pageTexts, 
    refreshPageTexts 
  } = useWebsiteText();

  const location = useLocation();

  // Dialog state
  const [draftText, setDraftText] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Inspector Drawer state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'overridden' | 'default'>('all');
  const [isMinimized, setIsMinimized] = useState(false);

  // When an item is selected for editing, set draft text
  useEffect(() => {
    if (editingItem) {
      setDraftText(editingItem.currentText);
      setSaveSuccess(false);
    }
  }, [editingItem]);

  // Refresh page texts when location or drawer changes
  useEffect(() => {
    if (isDrawerOpen) {
      refreshPageTexts();
    }
  }, [location.pathname, isDrawerOpen, refreshPageTexts]);

  // Only render for authenticated admins
  if (!isAdmin) return null;

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!editingItem) return;

    setIsSaving(true);
    try {
      await saveTextOverride(
        editingItem.originalText, 
        draftText, 
        location.pathname, 
        editingItem.id,
        editingItem.element
      );
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        setEditingItem(null);
      }, 500);
    } catch (err) {
      console.error('Failed to save website text:', err);
      alert('Failed to save website text override. Please check network/permissions.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = async () => {
    if (!editingItem) return;
    if (!window.confirm('Reset this text back to the website original default?')) return;

    setIsSaving(true);
    try {
      await resetTextOverride(editingItem.id, editingItem.element);
      setEditingItem(null);
    } catch (err) {
      console.error('Failed to reset text:', err);
      alert('Failed to reset text.');
    } finally {
      setIsSaving(false);
    }
  };

  // Filter page texts in drawer
  const filteredPageTexts = pageTexts.filter((item) => {
    if (filterType === 'overridden' && !item.isOverridden) return false;
    if (filterType === 'default' && item.isOverridden) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.originalText.toLowerCase().includes(q) || 
        item.currentText.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const totalOverriddenOnPage = pageTexts.filter(i => i.isOverridden).length;
  const totalSiteOverrides = Object.keys(overrides).length;

  return (
    <div data-admin-editor-ignore="true" className="font-sans">
      {/* FLOATING ADMIN LIVE CONTROLLER */}
      <aside 
        aria-label="Admin Website Text Editor Controls"
        className="fixed bottom-5 left-5 z-[9990] flex flex-col items-start pointer-events-auto"
      >
        <div className="bg-surface/95 backdrop-blur-md border border-warning/40 shadow-2xl rounded-2xl overflow-hidden transition-all duration-300 ring-1 ring-black/10 dark:ring-white/10">
          {/* Header Bar */}
          <div className="flex items-center justify-between gap-3 px-3.5 py-2 bg-gradient-to-r from-amber-500/15 via-warning/10 to-transparent border-b border-warning/20">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 relative">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isEditMode ? 'bg-amber-400' : 'bg-emerald-400'}`} />
                <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isEditMode ? 'bg-amber-500' : 'bg-emerald-500'}`} />
              </span>
              <span className="text-[11px] font-heading font-black uppercase tracking-wider text-text-main flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-warning" />
                Live Text Editor
              </span>
            </div>

            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1 hover:bg-black/10 dark:hover:bg-white/10 rounded-md text-text-muted hover:text-text-main transition-colors cursor-pointer"
              title={isMinimized ? "Expand toolbar" : "Minimize toolbar"}
            >
              {isMinimized ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
          </div>

          {/* Controls Body */}
          {!isMinimized && (
            <div className="p-3 space-y-2.5 min-w-[260px]">
              {/* Toggle Switch */}
              <div className="flex items-center justify-between gap-3 bg-base/70 p-2 rounded-xl border border-black/5 dark:border-white/5">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-text-main flex items-center gap-1.5">
                    <Edit3 size={13} className={isEditMode ? "text-warning animate-bounce" : "text-text-muted"} />
                    Click-To-Edit
                  </span>
                  <span className="text-[10px] font-mono text-text-muted">
                    {isEditMode ? 'Active: Click any text to edit' : 'Inactive'}
                  </span>
                </div>

                <button
                  onClick={toggleEditMode}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    isEditMode ? 'bg-warning' : 'bg-zinc-700'
                  }`}
                  title="Toggle Admin In-Page Edit Mode"
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                      isEditMode ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => {
                    refreshPageTexts();
                    setIsDrawerOpen(true);
                  }}
                  className="px-2.5 py-1.5 bg-black/5 dark:bg-white/5 hover:bg-warning/15 hover:text-warning border border-black/5 dark:border-white/5 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider text-text-main transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  title="Open text inspector for this page"
                >
                  <ListFilter size={12} />
                  <span>Page Texts</span>
                </button>

                <Link
                  to="/admin"
                  className="px-2.5 py-1.5 bg-black/5 dark:bg-white/5 hover:bg-warning/15 hover:text-warning border border-black/5 dark:border-white/5 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider text-text-main transition-all flex items-center justify-center gap-1.5 cursor-pointer text-center"
                  title="Open Admin Dashboard"
                >
                  <ExternalLink size={12} />
                  <span>Dashboard</span>
                </Link>
              </div>

              {/* Live Status Tag */}
              <div className="flex items-center justify-between text-[9px] font-mono text-text-muted pt-1 border-t border-black/5 dark:border-white/5">
                <span>Site overrides: <strong className="text-warning">{totalSiteOverrides}</strong></span>
                {totalOverriddenOnPage > 0 && (
                  <span className="text-emerald-400 font-bold">{totalOverriddenOnPage} on this page</span>
                )}
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* QUICK IN-PLACE TEXT EDITOR MODAL */}
      <AnimatePresence>
        {editingItem && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm pointer-events-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className="bg-surface border border-warning/40 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="px-5 py-4 border-b border-black/10 dark:border-white/10 flex items-center justify-between bg-base/50">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-warning/15 text-warning">
                    <Edit3 size={18} />
                  </div>
                  <div>
                    <h3 className="font-heading font-black text-sm uppercase tracking-wider text-text-main flex items-center gap-2">
                      Live Text Editor
                      {editingItem.isOverridden && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                          Customized
                        </span>
                      )}
                    </h3>
                    <p className="text-[10px] font-mono text-text-muted">
                      Page: <span className="text-warning">{location.pathname}</span> &bull; Tag: <span className="uppercase text-text-main font-bold">&lt;{editingItem.tagName || 'text'}&gt;</span>
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setEditingItem(null)}
                  className="p-1.5 hover:bg-black/10 dark:hover:bg-white/10 rounded-lg text-text-muted hover:text-text-main transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Modal Form */}
              <form onSubmit={handleSave} className="p-5 space-y-4 overflow-y-auto">
                {/* Original reference text */}
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-text-muted">
                    Original Default Content:
                  </label>
                  <div className="p-3 rounded-xl bg-base border border-black/5 dark:border-white/5 text-xs text-text-muted italic max-h-24 overflow-y-auto leading-relaxed font-sans select-all">
                    "{editingItem.originalText}"
                  </div>
                </div>

                {/* Edit input */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-mono font-bold uppercase tracking-wider text-text-main flex items-center gap-1.5">
                      <Sparkles size={13} className="text-warning" /> New Live Text Content:
                    </label>
                    <span className="text-[10px] font-mono text-text-muted">
                      {draftText.length} characters
                    </span>
                  </div>

                  <textarea
                    value={draftText}
                    onChange={(e) => setDraftText(e.target.value)}
                    rows={draftText.length > 100 ? 5 : 3}
                    autoFocus
                    className="w-full bg-base border border-black/15 dark:border-white/10 rounded-xl p-3.5 text-sm text-text-main focus:outline-none focus:border-warning focus:ring-1 focus:ring-warning font-sans leading-relaxed shadow-inner"
                    placeholder="Enter customized text..."
                  />
                </div>

                {/* Save Feedback Notice */}
                {saveSuccess && (
                  <motion.div 
                    initial={{ opacity: 0, y: -5 }} 
                    animate={{ opacity: 1, y: 0 }}
                    className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold flex items-center gap-2"
                  >
                    <Check size={14} /> Saved live! Content updated across the entire website.
                  </motion.div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-black/10 dark:border-white/10">
                  <div>
                    {editingItem.isOverridden && (
                      <button
                        type="button"
                        onClick={handleReset}
                        disabled={isSaving}
                        className="px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                      >
                        <RotateCcw size={13} />
                        <span>Reset to Default</span>
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    <button
                      type="button"
                      onClick={() => setEditingItem(null)}
                      disabled={isSaving}
                      className="px-4 py-2 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 rounded-xl text-xs font-bold text-text-muted hover:text-text-main transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={isSaving || !draftText.trim()}
                      className="px-5 py-2 bg-warning hover:bg-warning/90 text-crust font-black text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                      <span>Save & Publish Live</span>
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* PAGE TEXTS INSPECTOR DRAWER */}
      <AnimatePresence>
        {isDrawerOpen && (
          <div className="fixed inset-0 z-[9998] flex justify-start bg-black/50 backdrop-blur-xs pointer-events-auto">
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="bg-surface border-r border-black/10 dark:border-white/10 w-full max-w-lg h-full shadow-2xl flex flex-col"
            >
              {/* Drawer Header */}
              <div className="p-5 border-b border-black/10 dark:border-white/10 bg-base/50 flex items-center justify-between">
                <div>
                  <h3 className="font-heading font-black text-base uppercase tracking-tight text-text-main flex items-center gap-2">
                    <FileText size={18} className="text-warning" /> Current Page Texts
                  </h3>
                  <p className="text-xs text-text-muted mt-0.5 font-mono">
                    Page: <span className="text-warning">{location.pathname}</span> &bull; {pageTexts.length} items detected
                  </p>
                </div>

                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-2 hover:bg-black/10 dark:hover:bg-white/10 rounded-xl text-text-muted hover:text-text-main transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Drawer Controls */}
              <div className="p-4 border-b border-black/10 dark:border-white/10 space-y-3 bg-surface">
                {/* Search */}
                <div className="relative">
                  <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search text on this page..."
                    className="w-full bg-base border border-black/10 dark:border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-text-main placeholder:text-text-muted focus:outline-none focus:border-warning font-mono"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-main"
                    >
                      <X size={12} />
                    </button>
                  )}
                </div>

                {/* Filter Pills */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <button
                    onClick={() => setFilterType('all')}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                      filterType === 'all' ? 'bg-warning text-crust' : 'bg-base text-text-muted hover:text-text-main border border-black/5 dark:border-white/5'
                    }`}
                  >
                    All ({pageTexts.length})
                  </button>
                  <button
                    onClick={() => setFilterType('overridden')}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1 ${
                      filterType === 'overridden' ? 'bg-warning text-crust' : 'bg-base text-text-muted hover:text-text-main border border-black/5 dark:border-white/5'
                    }`}
                  >
                    <Sparkles size={10} /> Overridden ({totalOverriddenOnPage})
                  </button>
                  <button
                    onClick={() => setFilterType('default')}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                      filterType === 'default' ? 'bg-warning text-crust' : 'bg-base text-text-muted hover:text-text-main border border-black/5 dark:border-white/5'
                    }`}
                  >
                    Default ({pageTexts.length - totalOverriddenOnPage})
                  </button>
                </div>
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {filteredPageTexts.length === 0 ? (
                  <div className="text-center py-12 border border-dashed border-black/10 dark:border-white/10 rounded-2xl text-text-muted font-mono text-xs">
                    No text items match filter.
                  </div>
                ) : (
                  filteredPageTexts.map((item) => (
                    <div
                      key={item.id}
                      className={`p-3.5 rounded-xl border transition-all ${
                        item.isOverridden 
                          ? 'bg-amber-500/10 border-amber-500/30' 
                          : 'bg-base border-black/5 dark:border-white/5 hover:border-warning/30'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-black/5 dark:bg-white/5 text-text-muted">
                          &lt;{item.tagName}&gt;
                        </span>
                        {item.isOverridden && (
                          <span className="text-[9px] font-mono font-bold uppercase text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded">
                            Customized
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-text-main font-sans leading-relaxed line-clamp-3 mb-3">
                        "{item.currentText}"
                      </p>

                      <div className="flex items-center justify-between pt-2 border-t border-black/5 dark:border-white/5">
                        <button
                          onClick={() => {
                            if (item.element) {
                              item.element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                              item.element.classList.add('admin-edit-highlight');
                              setTimeout(() => {
                                item.element?.classList.remove('admin-edit-highlight');
                              }, 2000);
                            }
                          }}
                          className="text-[10px] font-mono text-text-muted hover:text-warning flex items-center gap-1 cursor-pointer transition-colors"
                          title="Scroll to element on page"
                        >
                          <Eye size={11} /> Find on Page
                        </button>

                        <button
                          onClick={() => {
                            setEditingItem(item);
                            setIsDrawerOpen(false);
                          }}
                          className="px-3 py-1 bg-warning text-crust font-black text-[10px] uppercase tracking-wider rounded-lg shadow-sm hover:bg-warning/90 transition-all flex items-center gap-1 cursor-pointer active:scale-95"
                        >
                          <Edit3 size={11} /> Edit Text
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
