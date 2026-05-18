/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react";
import loaderService from "../utils/loaderService";

const LoaderContext = createContext(null);

/**
 * Counter-based loading state so that concurrent API calls never hide the
 * loader prematurely. The overlay is visible as long as pendingCount > 0.
 */
export function LoaderProvider({ children }) {
  const [pendingCount, setPendingCount] = useState(0);

  const show = () => setPendingCount((c) => c + 1);
  const hide = () => setPendingCount((c) => Math.max(0, c - 1));

  // Register with the Axios-side singleton once (and update if refs change).
  useEffect(() => {
    loaderService.register(show, hide);
  }, []);

  const isLoading = pendingCount > 0;

  return (
    <LoaderContext.Provider value={{ isLoading, show, hide }}>
      {children}
    </LoaderContext.Provider>
  );
}

export function useLoader() {
  const ctx = useContext(LoaderContext);
  if (!ctx) throw new Error("useLoader must be used inside <LoaderProvider>");
  return ctx;
}
