/**
 * ProfileInfoSkeleton — shimmer placeholders for PersonalInfo contact details + addresses.
 */
const FieldSkeleton = () => (
  <div className="flex justify-between items-start">
    <div className="flex-1 space-y-2">
      <div className="h-3 w-24 rounded bg-gray-200 shimmer" />
      <div className="h-5 w-48 rounded bg-gray-200 shimmer" />
    </div>
    <div className="h-5 w-14 rounded bg-gray-200 shimmer" />
  </div>
);

const AddressCardSkeleton = () => (
  <div className="bg-[#f9f9f9] rounded-2xl p-6 lg:p-8 shadow-sm border border-transparent space-y-3">
    <div className="h-5 w-40 rounded bg-gray-200 shimmer" />
    <div className="h-4 w-28 rounded bg-gray-200 shimmer" />
    <div className="h-4 w-64 rounded bg-gray-200 shimmer" />
    <div className="h-4 w-56 rounded bg-gray-200 shimmer" />
    <div className="flex gap-2 mt-2">
      <div className="h-7 w-16 rounded-lg bg-gray-200 shimmer" />
      <div className="h-7 w-24 rounded-lg bg-gray-200 shimmer" />
    </div>
    <div className="flex items-center gap-6 mt-2">
      <div className="h-4 w-16 rounded bg-gray-200 shimmer" />
      <div className="h-4 w-10 rounded bg-gray-200 shimmer" />
    </div>
  </div>
);

export default function ProfileInfoSkeleton() {
  return (
    <div>
      {/* Contact Details */}
      <div className="mb-12">
        <div className="h-6 w-36 rounded bg-gray-200 shimmer mb-8" />
        <div className="space-y-8">
          <FieldSkeleton />
          <FieldSkeleton />
          <FieldSkeleton />
        </div>
      </div>

      {/* Address Section */}
      <div className="mt-16">
        <div className="flex justify-between items-center mb-8">
          <div className="h-6 w-20 rounded bg-gray-200 shimmer" />
          <div className="h-5 w-16 rounded bg-gray-200 shimmer" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          <AddressCardSkeleton />
          <AddressCardSkeleton />
        </div>
      </div>
    </div>
  );
}
