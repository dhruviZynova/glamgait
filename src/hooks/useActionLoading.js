import { useState, useCallback } from "react";

/**
 * useActionLoading — granular, per-action loading state manager.
 *
 * Each "action" is identified by a unique string key (e.g. "add-to-cart",
 * "wishlist-42-red", "review-submit").  Multiple concurrent actions are all
 * tracked independently so a spinner on one button never blocks another.
 *
 * Usage:
 *   const { isLoading, withLoading } = useActionLoading();
 *
 *   // In a handler:
 *   await withLoading("add-to-cart", async () => {
 *     await axiosInstance.post(...);
 *   });
 *
 *   // In JSX:
 *   <button disabled={isLoading("add-to-cart")}>
 *     {isLoading("add-to-cart") ? <Spinner /> : "Add to Cart"}
 *   </button>
 */
export function useActionLoading() {
  const [loadingKeys, setLoadingKeys] = useState(new Set());

  const startLoading = useCallback((key) => {
    setLoadingKeys((prev) => new Set(prev).add(key));
  }, []);

  const stopLoading = useCallback((key) => {
    setLoadingKeys((prev) => {
      const next = new Set(prev);
      next.delete(key);
      return next;
    });
  }, []);

  const isLoading = useCallback(
    (key) => loadingKeys.has(key),
    [loadingKeys]
  );

  /**
   * Wraps an async function with automatic start/stop loading for a given key.
   * Prevents duplicate calls: if the key is already loading, the fn is not invoked.
   */
  const withLoading = useCallback(
    async (key, fn) => {
      if (loadingKeys.has(key)) return; // duplicate-click guard
      startLoading(key);
      try {
        return await fn();
      } finally {
        stopLoading(key);
      }
    },
    [loadingKeys, startLoading, stopLoading]
  );

  return { isLoading, withLoading, startLoading, stopLoading };
}
