const OfferList = ({ offers }) => {
  return (
    <div className="mt-3 space-y-2">
      <div className="flex items-center gap-2">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#02382A] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#02382A]"></span>
        </span>

        <p className="text-sm font-semibold uppercase tracking-wide text-[#02382A]">
          Special Offers
        </p>
      </div>

      <div className="bg-[#02382A]/5 border border-[#02382A]/30 rounded-md px-3 py-2.5 text-sm flex items-center gap-2">
        <span className="font-semibold text-[#02382A]">Additional 10% OFF</span>
        <span className="text-[#02382A]">on Prepaid orders</span>
      </div>

      {offers.map((offer) => (
        <div
          key={offer.offer_id}
          className="bg-[#02382A]/5 border border-[#02382A]/20 rounded-md px-3 py-2.5 text-sm"
        >
          <span className="font-semibold text-[#02382A]">
            {offer.discount_percent}% OFF
          </span>
          {" • "}
          {offer.offer_type === "QTY"
            ? `on Buying ${offer.min_qty}+ items`
            : `on Cart Above ₹${offer.min_amount}`}
        </div>
      ))}
    </div>
  );
};

export default OfferList;
