import React, { useState } from "react";
import { Star } from "lucide-react";
import { ApiURL } from "../Variable";
import frame2 from "../assets/images/frame2.png";
import quoteLeft from "../assets/quoteLeft.png";

const ReviewCard = ({ name, review, rating = 5, product, fallbackProductName }) => {
  const [imgError, setImgError] = useState(false);

  const colorList = product?.colors || product?.productcolors || [];
  const firstColor = colorList[0];
  const imgFile = firstColor?.images?.[0]?.image_url
    || firstColor?.productimages?.[0]?.image_url
    || (Array.isArray(product?.images) ? product.images[0] : null)
    || product?.image;

  const productImgSrc = (imgFile && typeof imgFile === "string")
    ? (imgFile.startsWith("http") ? imgFile : `${ApiURL}/assets/Products/${imgFile}`)
    : null;

  const productName = product?.name || fallbackProductName || "Product";

  return (
    <div className="relative w-full aspect-[4/4] overflow-hidden group">
      {/* Arch Frame Background */}
      <div className="absolute inset-0 z-0">
        <img
          src={frame2}
          alt="Arch Frame"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content Container - Vertically centered group */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-6">

        {/* Centered Content Group */}
        <div className="relative flex flex-col items-center max-w-sm">
          {/* Profile Image & Quote wrapper */}
          <div className="relative mb-4 z-10 flex items-center justify-center">
            {/* Quote Icon */}
            <div className="absolute -left-12 sm:-left-16 md:-left-20 top-1/2 -translate-y-1/2">
              <img
                src={quoteLeft}
                alt="Quote"
                className="w-6 h-auto md:w-8 lg:w-9 select-none pointer-events-none"
              />
            </div>

            {productImgSrc && !imgError ? (
              <img
                src={productImgSrc}
                alt={productName}
                onError={() => setImgError(true)}
                className="w-10 h-10 md:w-14 md:h-14 rounded-full object-cover border-4 border-[#D4AF37]/10"
              />
            ) : (
              <div className="w-10 h-10 md:w-14 md:h-14 rounded-full flex items-center justify-center bg-[#1C2F2F] text-white font-semibold text-lg md:text-2xl border-4 border-[#D4AF37]/10 select-none uppercase font-sans">
                {name ? name.trim().charAt(0) : "?"}
              </div>
            )}
          </div>

          {/* Name & Review Text */}
          <div className="flex flex-col items-center text-center w-full px-4">
            {/* Product Name */}
            <h4 className="text-[12px] font-semibold text-gray-900 mb-1.5 font-sans line-clamp-1 leading-tight">
              {productName}
            </h4>

            {/* Stars / Rating */}
            <div className="flex items-center gap-0.5 mb-2.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={
                    i < rating
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }
                />
              ))}
            </div>

            {/* Review Message */}
            <p className="text-[14px] text-gray-600 leading-relaxed font-sans line-clamp-2 mb-2 italic">
              "{review}"
            </p>

            {/* Reviewer Name */}
            <h3 className="text-[12px] font-bold text-gray-800 font-sans capitalize">
              — {name}
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
