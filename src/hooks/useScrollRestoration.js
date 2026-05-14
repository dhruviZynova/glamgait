import { useEffect, useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

const scrollPositions = {};

export default function useScrollRestoration(pageKey) {
  const { pathname } = useLocation();

  // Restore only for allowed pages
  const allowedPages = ["/", "/shop"];
  const shouldRestore = allowedPages.includes(pathname);

  // Restore scroll position
  useLayoutEffect(() => {
    if (shouldRestore) {
      const savedY = scrollPositions[pageKey];
      requestAnimationFrame(() => {
        window.scrollTo({ top: savedY || 0, behavior: "instant" });
      });
    } else {
      // For all other pages → ALWAYS scroll to top
      window.scrollTo({ top: 0, behavior: "instant" });
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
