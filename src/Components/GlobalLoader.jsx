import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { useLoader } from "../Context/LoaderContext";

const NAV_FLASH_MS = 200;

export default function GlobalLoader() {
  const { isLoading, show, hide } = useLoader();
  const location = useLocation();
  const navTimerRef = useRef(null);
  const countIntervalRef = useRef(null);
  const safetyTimerRef = useRef(null);
  const [count, setCount] = useState(0);
  const [visible, setVisible] = useState(false);
  const [fading, setFading] = useState(false);

  // Flash the loader briefly on every route change.
  // Disabled to prevent blur overlay from getting stuck
  // useEffect(() => {
  //   show();
  //   if (navTimerRef.current) clearTimeout(navTimerRef.current);
  //   navTimerRef.current = setTimeout(hide, NAV_FLASH_MS);
  //   return () => {
  //     if (navTimerRef.current) clearTimeout(navTimerRef.current);
  //   };
  // }, [location.pathname]);

  // Safety timeout to ensure loader always fades out
  useEffect(() => {
    if (visible) {
      if (safetyTimerRef.current) clearTimeout(safetyTimerRef.current);
      safetyTimerRef.current = setTimeout(() => {
        setFading(true);
        setTimeout(() => {
          setVisible(false);
          setFading(false);
          setCount(0);
        }, 700);
      }, 5000); // Force fade out after 5 seconds
    }
    return () => {
      if (safetyTimerRef.current) clearTimeout(safetyTimerRef.current);
    };
  }, [visible]);

  useEffect(() => {
    const clearCount = () => {
      if (countIntervalRef.current) {
        clearInterval(countIntervalRef.current);
        countIntervalRef.current = null;
      }
    };

    if (isLoading) {
      // Show loader and slowly count up to 90.
      clearCount();
      setFading(false);
      setVisible(true);
      setCount(0);
      countIntervalRef.current = setInterval(() => {
        setCount(prev => {
          if (prev >= 90) { clearCount(); return 90; }
          return prev + 1;
        });
      }, 25);
    } else {
      // Loading done — rush counter to 100, then fade out.
      clearCount();
      countIntervalRef.current = setInterval(() => {
        setCount(prev => {
          if (prev >= 100) {
            clearCount();
            // Pause at 100% for 400ms, then fade and unmount.
            setTimeout(() => {
              setFading(true);
              setTimeout(() => {
                setVisible(false);
                setFading(false);
                setCount(0);
              }, 700);
            }, 400);
            return 100;
          }
          return prev + 1;
        });
      }, 12);
    }

    return clearCount;
  }, [isLoading]);

  if (!visible) return null;

  return (
    <div className={`glamloader-overlay${fading ? ' glamloader-overlay--fade' : ''}`} aria-label="Loading" role="status">

      {/* Logo */}
      <div className="glamloader-logo">
        GLAMGAIT
        <div className="glamloader-logo-fill">GLAMGAIT</div>
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
