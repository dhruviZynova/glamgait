/**
 * WishlistSkeleton — shimmer placeholder matching the wishlist grid card layout.
 */
const WishlistItemSkeleton = () => (
  <div className="arrival-card bg-white rounded-2xl overflow-hidden flex flex-col justify-between shadow-sm border border-gray-100 p-3 relative">
    {/* Remove button placeholder */}
    <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-gray-200 shimmer z-10" />

    {/* Image wrapper */}
    <div className="card-image-wrapper bg-gray-200 shimmer mb-3 rounded-lg" style={{ aspectRatio: "1/1.2" }} />

    {/* Info */}
    <div className="card-info flex-1 flex flex-col justify-between gap-3">
      <div className="space-y-2">
        <div className="h-4 w-3/4 rounded bg-gray-200 shimmer" />
        <div className="h-4 w-1/3 rounded bg-gray-200 shimmer" />
      </div>
      <div className="flex items-center justify-between mt-2">
        <div className="h-4 w-4 rounded-full bg-gray-200 shimmer" />
        <div className="h-4 w-12 rounded bg-gray-200 shimmer" />
      </div>
      {/* Action button */}
      <div className="mt-3.5">
        <div className="h-8 w-full rounded-lg bg-gray-200 shimmer" />
      </div>
    </div>
  </div>
);

export default function WishlistSkeleton({ count = 4 }) {
  return (
    <div>
      <div className="h-8 w-44 rounded bg-gray-200 shimmer mb-8" />
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: count }).map((_, i) => (
          <WishlistItemSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

