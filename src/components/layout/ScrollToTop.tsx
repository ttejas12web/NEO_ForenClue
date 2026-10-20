import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    const normalizedPath = pathname.replace(/\/+$/, '') || '/';
    const isCollegeDirectory = normalizedPath === '/colleges' || normalizedPath === '/college';

    if (isCollegeDirectory) {
      try {
        const returnToCollegeId = sessionStorage.getItem('forenclue_return_to_college_id');
        if (returnToCollegeId) {
          return;
        }
      } catch {
        // Ignore sessionStorage errors
      }
    }

    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
}
