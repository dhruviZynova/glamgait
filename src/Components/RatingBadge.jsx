const RatingBadge = ({ p_id, reviewsSummary }) => {
  const data = reviewsSummary?.[p_id];
  if (!data || data.count === 0) {
    return (
      <div className="flex items-center gap-1 mt-1">
        <span className="text-xs text-gray-500">No reviews yet</span>
      </div>
    );
  }
  const { rating, count } = data;

  return (
    <div className="flex items-center gap-2 mt-1">
      {/* Stars */}
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className="w-4 h-4"
            fill={i < Math.round(rating) ? "#FBBF24" : "#E5E7EB"}
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.173c.969 0 1.371 1.24.588 1.81l-3.378 2.455a1 1 0 00-.364 1.118l1.287 3.967c.3.921-.755 1.688-1.54 1.118L10 14.347l-3.953 2.805c-.785.57-1.84-.197-1.54-1.118l1.287-3.967a1 1 0 00-.364-1.118L2.052 9.394c-.783-.57-.38-1.81.588-1.81h4.173a1 1 0 00.95-.69l1.286-3.967z" />
          </svg>
        ))}
      </div>

      {/* Rating + Count */}
      {/* <span className="font-bold text-gray-900 text-sm">{rating}</span> */}
      <span className="text-xs text-gray-600">
        ({count} review{count > 1 ? "s" : ""})
      </span>
    </div>
  );
};

export default RatingBadge;
