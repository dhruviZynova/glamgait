// CouponList.jsx
import { Copy } from "lucide-react";
import { showToaster } from "../Variable";

const CouponList = ({ coupons }) => {
  if (!coupons?.length) return null;

  return (
    <div className="mt-4 space-y-3">
      <p className="text-xs font-semibold text-[#02382A] uppercase tracking-wide">
        Coupons
      </p>

      {coupons.map((coupon) => (
        <div
          key={coupon.coupon_id}
          className="flex items-center justify-between gap-3 bg-[#02382A]/5 border border-[#02382A]/20 rounded-md pl-3 pr-2 py-2.5"
        >
          <div>
            <div className="font-bold text-[#02382A] text-base tracking-wide">
              {coupon.code}
            </div>
            <div className="text-xs text-gray-700">
              {coupon.discount_percent}% off • Min ₹{coupon.min_amount}
            </div>
          </div>

          <button
            onClick={() => {
              navigator.clipboard.writeText(coupon.code);
              showToaster(1, "Copied!");
            }}
            className="px-3 py-1.5 bg-[#02382A] text-white text-xs font-medium rounded hover:bg-[#02382A]/90 transition-colors"
          >
            COPY
          </button>
        </div>
      ))}
    </div>
  );
};
export default CouponList;
