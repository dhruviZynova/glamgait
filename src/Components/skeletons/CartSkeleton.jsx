/**
 * CartSkeleton — shimmer placeholder for the Cart page table rows.
 */
const CartRowSkeleton = () => (
  <tr className="border-t border-gray-100">
    {/* Product cell */}
    <td className="py-8 px-6">
      <div className="flex items-center gap-6">
        <div className="w-5 h-5 rounded bg-gray-200 shimmer flex-shrink-0" />
        <div className="w-20 h-24 rounded bg-gray-200 shimmer flex-shrink-0" />
        <div className="flex flex-col gap-2">
          <div className="h-4 w-36 rounded bg-gray-200 shimmer" />
          <div className="h-3 w-24 rounded bg-gray-200 shimmer" />
        </div>
      </div>
    </td>
    {/* Price */}
    <td className="py-8 px-6 text-center">
      <div className="h-4 w-16 rounded bg-gray-200 shimmer mx-auto" />
    </td>
    {/* Qty */}
    <td className="py-8 px-6">
      <div className="h-10 w-28 rounded-full bg-gray-200 shimmer mx-auto" />
    </td>
    {/* Total */}
    <td className="py-8 px-6 text-right">
      <div className="h-4 w-16 rounded bg-gray-200 shimmer ml-auto" />
    </td>
  </tr>
);

const CartMobileCardSkeleton = () => (
  <div className="bg-white p-4 rounded-xl">
    <div className="flex flex-col items-center gap-4">
      <div className="w-32 h-40 rounded-lg bg-gray-200 shimmer" />
      <div className="w-full space-y-3">
        <div className="h-4 w-3/4 rounded bg-gray-200 shimmer mx-auto" />
        <div className="h-3 w-1/2 rounded bg-gray-200 shimmer mx-auto" />
        <div className="flex justify-between items-center border-t border-gray-100 pt-4">
          <div className="h-4 w-16 rounded bg-gray-200 shimmer" />
          <div className="h-8 w-24 rounded-full bg-gray-200 shimmer" />
          <div className="h-4 w-16 rounded bg-gray-200 shimmer" />
        </div>
      </div>
    </div>
  </div>
);

export default function CartSkeleton({ count = 3 }) {
  return (
    <>
      {/* Desktop */}
      <div className="hidden md:block overflow-hidden rounded-[10px] border border-[#DEDFE1]">
        <table className="w-full border-collapse">
          <thead className="bg-[#E7DCD2]">
            <tr>
              <th className="py-4 px-6 text-left font-medium text-lg text-[#000000]">Product</th>
              <th className="py-4 px-6 text-center font-medium text-lg text-[#000000]">Price</th>
              <th className="py-4 px-6 text-center font-medium text-lg text-[#000000]">Quantity</th>
              <th className="py-4 px-6 text-right font-medium text-lg text-[#000000]">Total</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: count }).map((_, i) => (
              <CartRowSkeleton key={i} />
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile */}
      <div className="md:hidden space-y-4">
        {Array.from({ length: count }).map((_, i) => (
          <CartMobileCardSkeleton key={i} />
        ))}
      </div>
    </>
  );
}
