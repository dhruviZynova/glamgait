import React, { useState, useEffect, useRef } from "react";

const Counter = ({ target, suffix = "", duration = 2000, delay = 0 }) => {
  const [count, setCount] = useState(0);
  const elementRef = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;

    const startCount = () => {
      let startTime = null;

      const animate = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const progress = timestamp - startTime;
        const percentage = Math.min(progress / duration, 1);
        
        // Easing function for smoother count up (easeOutQuad)
        const easeProgress = percentage * (2 - percentage);
        
        setCount(Math.floor(easeProgress * target));

        if (percentage < 1) {
          requestAnimationFrame(animate);
        } else {
          setCount(target);
        }
      };

      setTimeout(() => {
        requestAnimationFrame(animate);
      }, delay);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          startCount();
          observer.unobserve(el);
        }
      },
      { threshold: 0.1 }
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
  }, [target, duration, delay]);

  return (
    <span ref={elementRef}>
      {count}
      {suffix}
    </span>
  );
};

export default Counter;
