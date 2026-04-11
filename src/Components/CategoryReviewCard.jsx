// src/components/CategoryReviewCard.jsx
import { Star, Check } from "lucide-react";
import pattern from "../assets/pattern.png";
import rightlight from "../assets/rightlight.png";

const CategoryReviewCard = ({ name, comment, rating = 5 }) => {
  return (
    <div className="group relative w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl mx-auto bg-white rounded-2xl shadow-md overflow-hidden flex flex-col sm:flex-row transition-all duration-300 hover:shadow-xl">
      {/* LEFT: Pattern */}
      <div className="relative w-full sm:w-24 md:w-28 lg:w-32 h-24 sm:h-auto overflow-hidden">
        <img
          src={pattern}
          alt="Pattern"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>

      {/* RIGHT: Content */}
      <div className="flex-1 p-4 sm:p-5 md:p-6 relative flex flex-col">
        {/* Light Glow */}
        <img
          src={rightlight}
          alt="Glow"
          className="absolute right-0 top-0 w-14 sm:w-16 md:w-20 opacity-30 pointer-events-none"
        />

        {/* Content */}
        <div className="relative z-10 mt-1">
          {/* Name + Verified */}
          <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
            <h4 className="text-sm sm:text-base md:text-lg font-bold text-gray-900 truncate max-w-[65%]">
              {name}
            </h4>
            {
              <span className="flex items-center gap-1.5 text-xs font-medium bg-black text-white px-2.5 py-1 rounded-full shadow-sm whitespace-nowrap">
                <Check className="w-3.5 h-3.5" strokeWidth={3} />
                Verified
              </span>
            }
          </div>

          {/* Rating Stars */}
          <div className="flex gap-0.5 mb-2">
            {Array.from({ length: 5 }, (_, i) => (
              <Star
                key={i}
                className={`w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 transition-colors ${
                  i < rating ? "fill-amber-400 text-amber-400" : "text-gray-300"
                }`}
              />
            ))}
          </div>

          {/* Comment */}
          <p className="text-sm text-gray-700 leading-relaxed italic">
            “{comment}”
          </p>
        </div>
      </div>
    </div>
  );
};

export default CategoryReviewCard;
