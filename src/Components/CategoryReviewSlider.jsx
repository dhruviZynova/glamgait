// src/components/CategoryReviewSlider.jsx
import { useEffect, useRef, useState } from "react";
import CategoryReviewCard from "./CategoryReviewCard";
import waves from "../assets/waves.png"; // Same wave as CustomersSay

const CategoryReviewSlider = ({
  reviews = [],
  direction = "left",
  speed = "normal",
  cate_name
}) => {
  const containerRef = useRef(null);
  const scrollerRef = useRef(null);
  const [start, setStart] = useState(false);

  useEffect(() => {
    if (reviews.length === 0) return;
    addAnimation();
  }, [reviews]);

  const addAnimation = () => {
    if (!containerRef.current || !scrollerRef.current) return;

    const scrollerContent = Array.from(scrollerRef.current.children);
    scrollerContent.forEach((item) => {
      const duplicatedItem = item.cloneNode(true);
      scrollerRef.current.appendChild(duplicatedItem);
    });

    setScrollProperties();
    setStart(true);
  };

  const setScrollProperties = () => {
    const container = containerRef.current;
    if (!container) return;

    container.style.setProperty(
      "--animation-direction",
      direction === "left" ? "forwards" : "reverse"
    );

    const durations = { fast: "20s", normal: "40s", slow: "80s" };
    container.style.setProperty(
      "--animation-duration",
      durations[speed] || "40s"
    );
  };

  if (reviews.length === 0) return null;

  return (
    <section className="relative bg-[#F3F0ED] py-16 overflow-hidden">
      {/* Decorative Waves – SAME AS CUSTOMERS SAY */}
      <img
        src={waves}
        alt="Wave Top"
        className="hidden md:block absolute top-0 right-0 md:-top-10 md:right-10 lg:right-20 lg:-top-20 xl:right-50 xl:-top-20 w-40 md:w-64 rotate-45 lg:h-90 lg:w-80 2xl:h-120 2xl:w-120 2xl:right-100 2xl:-top-50"
      />

      {/* Title & Description – SAME STYLING */}
      <div className="text-center max-w-2xl mx-auto mb-10 relative z-10 px-4">
        <h2 className="text-[30px] md:text-[34px] xl:text-[34px] font-bold text-gray-800 mb-2">
          What Customers Say About{" "}
          <span className="text-[#046A4D]">{cate_name}</span>
        </h2>
        <p className="text-[12px] md:text-[16px] text-gray-600">
          Real reviews from real buyers
        </p>
      </div>

      {/* Review Scroller – SAME AS CUSTOMERS SAY */}
      <div
        ref={containerRef}
        className="group relative z-10 w-full overflow-hidden"
      >
        <ul
          ref={scrollerRef}
          className={`flex w-max min-w-full shrink-0 flex-nowrap gap-6 py-4 ${start ? "animate-scroll" : ""
            }`}
        >
          {reviews.map((review, idx) => (
            <li key={idx} className="shrink-0">
              <CategoryReviewCard
                name={review.reviewer_name}
                comment={review.message}
                rating={review.rating}
              />
            </li>
          ))}
        </ul>
      </div>

      {/* Scroll Animation – EXACT SAME */}
      <style>{`
        .animate-scroll {
          animation: scroll var(--animation-duration) linear infinite;
          animation-direction: var(--animation-direction);
        }
        .group:hover .animate-scroll {
          animation-play-state: paused;
        }
        @keyframes scroll {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </section>
  );
};

export default CategoryReviewSlider;
