/**
 * OrdersSkeleton — shimmer placeholder for the orders list in Profileorder.
 */
const OrderRowSkeleton = () => (
  <div className="bg-white rounded-2xl p-4 sm:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100">
    {/* Header */}
    <div className="flex flex-col md:flex-row justify-between gap-6 mb-6">
      <div className="space-y-2">
        <div className="h-5 w-48 rounded bg-gray-200 shimmer" />
        <div className="h-4 w-64 rounded bg-gray-200 shimmer" />
        <div className="h-4 w-56 rounded bg-gray-200 shimmer" />
      </div>
      <div className="space-y-2">
        <div className="h-4 w-40 rounded bg-gray-200 shimmer" />
        <div className="h-4 w-32 rounded bg-gray-200 shimmer" />
      </div>
    </div>

    <div className="h-px bg-gray-100 w-full mb-8" />

    {/* Item row */}
    <div className="flex flex-wrap gap-6">
      <div className="flex gap-4">
        <div className="w-24 h-24 rounded-xl bg-gray-200 shimmer flex-shrink-0" />
        <div className="flex flex-col justify-center gap-2">
          <div className="h-5 w-36 rounded bg-gray-200 shimmer" />
          <div className="h-4 w-24 rounded bg-gray-200 shimmer" />
          <div className="h-4 w-20 rounded bg-gray-200 shimmer" />
        </div>
      </div>
    </div>

    {/* Action buttons */}
    <div className="flex justify-end gap-3 mt-6">
      <div className="h-9 w-28 rounded-lg bg-gray-200 shimmer" />
      <div className="h-9 w-28 rounded-lg bg-gray-200 shimmer" />
    </div>
  </div>
);

export default function OrdersSkeleton({ count = 3 }) {
  return (
    <div className="space-y-8">
      {Array.from({ length: count }).map((_, i) => (
        <OrderRowSkeleton key={i} />
      ))}
    </div>
  );
}
