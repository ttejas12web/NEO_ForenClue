import { ReactNode, useState, useEffect } from 'react';
import { Monitor, X } from 'lucide-react';

export function DesktopOnly({ children }: { children: ReactNode }) {
  const [isMobile, setIsMobile] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="w-full">
      {isMobile && !dismissed && (
        <div className="bg-surface border-b border-warning/30 px-4 py-3 text-xs text-text-muted flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Monitor size={16} className="text-warning shrink-0" />
            <span>
              <strong className="text-text-main">Viewport Notice:</strong> Interactive 3D controls are optimized for desktop screens, while the full laboratory simulator and educational reference guide remain accessible below.
            </span>
          </div>
          <button
            type="button"
            onClick={() => setDismissed(true)}
            aria-label="Dismiss viewport notice"
            className="p-1 rounded-md hover:bg-black/10 dark:hover:bg-white/10 text-text-muted hover:text-text-main shrink-0"
          >
            <X size={14} />
          </button>
        </div>
      )}
      {children}
    </div>
  );
}
