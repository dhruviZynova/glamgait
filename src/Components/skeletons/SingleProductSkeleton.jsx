/**
 * SingleProductSkeleton — two-column shimmer skeleton mirroring SingleProduct layout.
 */
export default function SingleProductSkeleton() {
  return (
    <div className="min-h-screen px-2 py-8 pb-24 md:px-10 lg:px-20">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-6">
        <div className="h-4 w-24 rounded bg-gray-200 shimmer" />
        <div className="h-4 w-4 rounded bg-gray-200 shimmer" />
        <div className="h-4 w-32 rounded bg-gray-200 shimmer" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
        {/* LEFT — Images */}
        <div className="flex gap-6">
          {/* Thumbnails desktop */}
          <div className="hidden lg:flex flex-col gap-4 w-24">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="w-24 h-32 rounded-lg bg-gray-200 shimmer" />
            ))}
          </div>
          {/* Main image */}
          <div className="flex-1">
            <div className="w-full h-[400px] sm:h-[500px] lg:h-[700px] rounded-[20px] bg-gray-200 shimmer" />
            {/* Mobile thumbnails */}
            <div className="flex gap-2 mt-4 lg:hidden">
              {[0, 1, 2].map((i) => (
                <div key={i} className="flex-shrink-0 w-16 h-20 rounded-md bg-gray-200 shimmer" />
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT — Details */}
        <div className="space-y-6 sm:space-y-8">
          {/* Stock + wishlist row */}
          <div className="flex justify-between items-center">
            <div className="h-5 w-28 rounded bg-gray-200 shimmer" />
            <div className="w-8 h-8 rounded-full bg-gray-200 shimmer" />
          </div>

          {/* Title */}
          <div className="space-y-2">
            <div className="h-8 w-4/5 rounded bg-gray-200 shimmer" />
            <div className="h-8 w-3/5 rounded bg-gray-200 shimmer" />
          </div>

          {/* Price + rating */}
          <div className="flex items-center gap-4">
            <div className="h-8 w-24 rounded bg-gray-200 shimmer" />
            <div className="h-8 w-20 rounded bg-gray-200 shimmer" />
            <div className="h-px w-6 bg-gray-300" />
            <div className="h-5 w-28 rounded bg-gray-200 shimmer" />
          </div>

          {/* Divider */}
          <div className="h-px bg-gray-200 w-full" />

          {/* Description */}
          <div className="space-y-2">
            <div className="h-4 w-full rounded bg-gray-200 shimmer" />
            <div className="h-4 w-4/5 rounded bg-gray-200 shimmer" />
            <div className="h-4 w-3/5 rounded bg-gray-200 shimmer" />
          </div>

          {/* Color swatches */}
          <div>
            <div className="h-4 w-12 rounded bg-gray-200 shimmer mb-3" />
            <div className="flex gap-4">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="w-8 h-8 rounded-full bg-gray-200 shimmer" />
              ))}
            </div>
          </div>

          {/* Size buttons */}
          <div>
            <div className="h-4 w-10 rounded bg-gray-200 shimmer mb-4" />
            <div className="flex gap-3 flex-wrap">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="h-12 w-16 rounded-lg bg-gray-200 shimmer" />
              ))}
            </div>
          </div>

          {/* Quantity + Add to Cart */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="h-12 w-full sm:w-40 rounded-full bg-gray-200 shimmer" />
            <div className="h-12 flex-1 rounded-full bg-gray-200 shimmer" />
          </div>

          {/* Buy Now */}
          <div className="h-12 w-full rounded-full bg-gray-200 shimmer" />

          {/* Shipping info */}
          <div className="pt-8 border-t border-gray-200 space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-gray-200 shimmer" />
              <div className="h-4 w-56 rounded bg-gray-200 shimmer" />
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-gray-200 shimmer" />
              <div className="h-4 w-48 rounded bg-gray-200 shimmer" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
