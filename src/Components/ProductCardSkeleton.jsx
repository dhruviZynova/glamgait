/**
 * ProductCardSkeleton — animated shimmer placeholder that mirrors the
 * dimensions of ProductCard while product data is loading.
 *
 * Usage:
 *   import ProductCardSkeleton from "../Components/ProductCardSkeleton";
 *
 *   {isLoading
 *     ? Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)
 *     : products.map((p) => <ProductCard key={p.p_id} product={p} ... />)
 *   }
 */
export default function ProductCardSkeleton() {
  return (
    <div className="text-left">
      {/* Image placeholder — keeps the 1:1.2 aspect-ratio of .card-image-wrapper */}
      <div
        className="w-full rounded-xl bg-gray-200 mb-4 overflow-hidden"
        style={{ aspectRatio: "1/1.2" }}
      >
        <div className="w-full h-full shimmer" />
      </div>

      {/* Product name */}
      <div className="h-4 w-3/4 rounded bg-gray-200 shimmer mb-2" />

      {/* Price row */}
      <div className="flex items-center gap-2 mb-2">
        <div className="h-4 w-16 rounded bg-gray-200 shimmer" />
        <div className="h-4 w-12 rounded bg-gray-200 shimmer" />
      </div>

      {/* Category tag */}
      <div className="h-3 w-1/2 rounded bg-gray-200 shimmer mb-3" />

      {/* Color swatches */}
      <div className="flex gap-2">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-4 w-4 rounded-full bg-gray-200 shimmer" />
        ))}
      </div>
    </div>
  );
}
