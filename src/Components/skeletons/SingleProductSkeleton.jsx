import { FaChevronRight } from "react-icons/fa";

/**
 * SingleProductSkeleton — two-column shimmer skeleton mirroring SingleProduct layout.
 */
export default function SingleProductSkeleton() {
  return (
    <div className="px-2 py-6 pb-16 md:px-10 lg:px-20">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-6 text-xs text-[#9A8F87]">
        <div className="h-4 w-20 rounded bg-gray-200 shimmer" />
        <FaChevronRight className="text-[10px] text-[#9A8F87]" />
        <div className="h-4 w-32 rounded bg-gray-200 shimmer" />
      </div>

      {/* ═══════════════ MAIN GRID ═══════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-[580px_1fr] gap-8 lg:gap-12 xl:gap-16 items-start max-w-7xl mx-auto">
        {/* LEFT — Images */}
        <div className="w-full">
          {/* Desktop stacked gallery */}
          <div className="hidden lg:flex md:gap-12 gap-6 w-full">
            {/* Desktop thumbnails */}
            <div className="flex flex-col gap-3">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex-shrink-0 w-[64px] h-[80px] rounded-md bg-gray-200 shimmer border border-[#E8E0DA]"
                />
              ))}
            </div>

            {/* Main stacked image placeholder */}
            <div className="flex-1 flex flex-col gap-3">
              <div className="relative w-full aspect-[3/4] bg-gray-200 shimmer rounded-lg" />
            </div>
          </div>

          {/* Mobile / Tablet slider placeholder */}
          <div className="block lg:hidden w-full relative">
            <div className="relative overflow-hidden w-full rounded-lg bg-gray-200 shimmer aspect-[3/4]" />
            {/* Mobile thumbnails */}
            <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="flex-shrink-0 w-14 h-18 bg-gray-200 shimmer border border-gray-200" />
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT — Details */}
        <div className="space-y-6">
          {/* Title & SKU */}
          <div>
            <div className="h-8 w-4/5 rounded bg-gray-200 shimmer" />
            <div className="h-4 w-24 rounded bg-gray-200 shimmer mt-3" />
          </div>

          {/* Price + rating */}
          <div className="flex items-center gap-4 flex-wrap">
            <div className="h-8 w-24 rounded bg-gray-200 shimmer" />
            <div className="h-6 w-16 rounded bg-gray-200 shimmer" />
            <div className="h-5 w-px bg-[#E8E0DA]" />
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                {[0, 1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-4 h-4 rounded-full bg-gray-200 shimmer" />
                ))}
              </div>
              <div className="h-4 w-8 rounded bg-gray-200 shimmer" />
            </div>
          </div>

          {/* Colors */}
          <div className="pb-2">
            <div className="h-4 w-28 rounded bg-gray-200 shimmer mb-4" />
            <div className="flex flex-wrap gap-3">
              {[0, 1, 2].map((i) => (
                <div key={i} className="w-8 h-8 rounded-full bg-gray-200 shimmer" />
              ))}
            </div>
          </div>

          {/* Sizes */}
          <div className="pb-2">
            <div className="flex justify-between items-center mb-4">
              <div className="h-4 w-12 rounded bg-gray-200 shimmer" />
              <div className="h-3 w-16 rounded bg-gray-200 shimmer" />
            </div>
            <div className="flex flex-wrap gap-2">
              {[0, 1, 2, 3, 4].map((i) => (
                <div key={i} className="h-10 w-12 rounded-lg bg-gray-200 shimmer" />
              ))}
            </div>
          </div>

          {/* Qty + Actions */}
          <div className="space-y-6">
            {/* Qty */}
            <div className="flex items-center gap-4">
              <div className="h-11 w-32 rounded-lg bg-gray-200 shimmer" />
            </div>

            {/* Add to Cart + Wishlist */}
            <div className="flex gap-3">
              <div className="flex-1 h-12 rounded-lg bg-gray-200 shimmer" />
              <div className="w-12 h-12 rounded-lg bg-gray-200 shimmer flex-shrink-0" />
            </div>

            {/* Buy Now */}
            <div className="h-12 w-full rounded-lg bg-gray-200 shimmer" />
          </div>

          {/* Shipping */}
          <div className="pt-4 border-t border-[#E8E0DA] space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-gray-200 shimmer flex-shrink-0" />
              <div className="h-4 flex-1 rounded bg-gray-200 shimmer max-w-[320px]" />
            </div>
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-gray-200 shimmer flex-shrink-0" />
              <div className="h-4 flex-1 rounded bg-gray-200 shimmer max-w-[280px]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
