import { useEffect } from 'react';

const SUFFIX = 'Trine Kitchen';

/** Set the document title for a route, restoring nothing — each page sets its own. */
export function usePageTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} — ${SUFFIX}` : `${SUFFIX} — Taste of Ghana`;
  }, [title]);
}

export default usePageTitle;
