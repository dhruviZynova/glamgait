/**
 * WishlistSkeleton — shimmer placeholder matching the wishlist card layout.
 */
const WishlistItemSkeleton = () => (
  <div className="bg-white rounded-2xl flex flex-col md:flex-row gap-4 p-4 mb-4 shadow-sm relative">
    {/* Remove button placeholder */}
    <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-gray-200 shimmer" />

    {/* Image */}
    <div className="flex items-center justify-center flex-shrink-0">
      <div className="w-40 h-60 md:w-28 md:h-40 rounded-lg bg-gray-200 shimmer" />
    </div>

    {/* Info */}
    <div className="flex flex-col flex-1 gap-3 justify-center">
      <div className="h-5 w-3/4 rounded bg-gray-200 shimmer" />
      <div className="h-4 w-1/2 rounded bg-gray-200 shimmer" />
      <div className="h-4 w-1/3 rounded bg-gray-200 shimmer" />
    </div>

    {/* Action button */}
    <div className="flex items-center md:ml-4">
      <div className="h-9 w-28 rounded-md bg-gray-200 shimmer" />
    </div>
  </div>
);

export default function WishlistSkeleton({ count = 3 }) {
  return (
    <div>
      <div className="h-8 w-40 rounded bg-gray-200 shimmer mb-6" />
      {Array.from({ length: count }).map((_, i) => (
        <WishlistItemSkeleton key={i} />
      ))}
    </div>
  );
}
