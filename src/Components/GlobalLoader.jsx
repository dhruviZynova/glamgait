import { useEffect, useRef, useState } from "react";
import { useLoader } from "../Context/LoaderContext";

/**
 * GlobalLoader — full-page overlay shown ONLY during the initial auth check.
 * Regular API calls no longer trigger this loader; they use local skeleton
 * states or per-button spinners instead.
 */
export default function GlobalLoader() {
  const { initialLoad } = useLoader();
  const safetyTimerRef = useRef(null);
  const [visible, setVisible] = useState(true); // starts visible on mount
  const [fading, setFading] = useState(false);

  // When initialLoad transitions false → start fade-out
  useEffect(() => {
    if (!initialLoad) {
      if (safetyTimerRef.current) clearTimeout(safetyTimerRef.current);
      // Short delay so the app has painted before we fade
      safetyTimerRef.current = setTimeout(() => {
        setFading(true);
        setTimeout(() => {
          setVisible(false);
          setFading(false);
        }, 700);
      }, 120);
    }
    return () => {
      if (safetyTimerRef.current) clearTimeout(safetyTimerRef.current);
    };
  }, [initialLoad]);

  // Safety net — never block UI for more than 3 seconds regardless
  useEffect(() => {
    const id = setTimeout(() => {
      setFading(true);
      setTimeout(() => {
        setVisible(false);
        setFading(false);
      }, 700);
    }, 3000);
    return () => clearTimeout(id);
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`glamloader-overlay${fading ? " glamloader-overlay--fade" : ""}`}
      aria-label="Loading"
      role="status"
    >
      {/* Logo */}
      <div className="glamloader-logo">
        KUNDRAT
        <div className="glamloader-logo-fill">KUNDRAT</div>
      </div>

      {/* Morphing ring */}
      <div className="glamloader-ring">
        <svg viewBox="0 0 72 72">
          <circle className="glamloader-ring-track" cx="36" cy="36" r="32" />
          <circle className="glamloader-ring-arc glamloader-ring-arc--a2" cx="36" cy="36" r="32" />
          <circle className="glamloader-ring-arc glamloader-ring-arc--a1" cx="36" cy="36" r="32" />
        </svg>
        <div className="glamloader-ring-dot" />
      </div>
    </div>
  );
}
