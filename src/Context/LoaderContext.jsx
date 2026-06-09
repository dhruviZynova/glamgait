/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react";
import loaderService from "../utils/loaderService";
import { useUser } from "./UserContext";

const LoaderContext = createContext(null);

/**
 * Counter-based loading state so that concurrent API calls never hide the
 * loader prematurely. The overlay is visible as long as pendingCount > 0.
 *
 * `initialLoad` is a separate boolean that stays true until the auth check
 * completes (authChecked from UserContext). The GlobalLoader uses ONLY
 * `initialLoad` so routine API calls never trigger the full-page overlay.
 */
export function LoaderProvider({ children }) {
  const [pendingCount, setPendingCount] = useState(0);
  const { authChecked } = useUser();

  const show = () => setPendingCount((c) => c + 1);
  const hide = () => setPendingCount((c) => Math.max(0, c - 1));

  // Register with the Axios-side singleton once (and update if refs change).
  useEffect(() => {
    loaderService.register(show, hide);
  }, []);

  const isLoading = pendingCount > 0;

  // initialLoad stays true until the auth check resolves — this is the
  // ONLY condition that drives the full-page GlobalLoader overlay.
  const initialLoad = !authChecked;

  return (
    <LoaderContext.Provider value={{ isLoading, initialLoad, show, hide }}>
      {children}
    </LoaderContext.Provider>
  );
}

export function useLoader() {
  const ctx = useContext(LoaderContext);
  if (!ctx) throw new Error("useLoader must be used inside <LoaderProvider>");
  return ctx;
}
