import React, { useRef, useState, useEffect } from "react";

const ScrollReveal = ({
  children,
  animation = "fade-up",
  duration = 800,
  delay = 0,
  threshold = 0.1,
  once = true,
  className = "",
  as: Component = "div",
}) => {
  const elementRef = useRef(null);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;

    // Check if user prefers reduced motion (accessibility standards)
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      setIsRevealed(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsRevealed(true);
          if (once) {
            observer.unobserve(el);
          }
        } else if (!once) {
          setIsRevealed(false);
        }
      },
      {
        threshold,
        // Start animating slightly before the element fully enters the screen
        rootMargin: "0px 0px -50px 0px",
      }
    );

    observer.observe(el);

    return () => {
      if (el) {
        try {
          observer.unobserve(el);
        } catch (e) {
          // ignore
        }
      }
    };
  }, [threshold, once]);

  // Combine appropriate CSS animation classes
  const baseAnimationClass = `reveal-${animation}`;
  const activeClass = isRevealed ? "reveal-active" : "";

  // Standard transition styles matching standard hardware acceleration rules
  const style = {
    transitionDuration: `${duration}ms`,
    transitionDelay: `${delay}ms`,
  };

  return (
    <Component
      ref={elementRef}
      className={`reveal-base ${baseAnimationClass} ${activeClass} ${className}`}
      style={style}
    >
      {children}
    </Component>
  );
};

export default ScrollReveal;
