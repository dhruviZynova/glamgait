import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const scrollPositions = {};

export default function useScrollRestoration(pageKey) {
  const { pathname } = useLocation();

  // Restore only for allowed pages
  const allowedPages = ["/", "/shop"];
  const shouldRestore = allowedPages.includes(pathname);

  // Restore scroll position
  useEffect(() => {
    if (shouldRestore) {
      const savedY = scrollPositions[pageKey];
      setTimeout(() => {
        window.scrollTo({ top: savedY || 0, behavior: "instant" });
      }, 0);
    } else {
      // For all other pages → ALWAYS scroll to top
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "instant" });
      }, 0);
    }
  }, [pathname, pageKey, shouldRestore]);

  // Save scroll on unmount
  useEffect(() => {
    return () => {
      if (shouldRestore) {
        scrollPositions[pageKey] = window.scrollY;
      }
    };
  }, [pageKey, shouldRestore]);
}
