import React, { useState } from "react";
import { X, AlertCircle } from "lucide-react";

const CancelOrderModal = ({ isOpen, onClose, onConfirm, orderId }) => {
  const [reason, setReason] = useState("");
  const [otherReason, setOtherReason] = useState("");

  const reasons = [
    "Changed my mind",
    "Found a better price elsewhere",
    "Ordered by mistake",
    "Delivery is taking too long",
    "Other",
  ];

  if (!isOpen) return null;

  const handleConfirm = () => {
    const finalReason = reason === "Other" ? otherReason : reason;
    onConfirm(finalReason);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]">
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#b32b2b] p-6 text-white flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-full">
              <AlertCircle size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold">Cancel Order</h2>
              <p className="text-white/80 text-sm">Order #{orderId}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="hover:bg-white/20 p-2 rounded-full transition-colors cursor-pointer"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8">
          <p className="text-gray-600 mb-6 font-medium">
            We're sorry to see you cancel. Please tell us why you're cancelling so we can improve our service.
          </p>

          <div className="space-y-4">
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Reason for cancellation
            </label>
            <div className="grid grid-cols-1 gap-3">
              {reasons.map((r) => (
                <label
                  key={r}
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all cursor-pointer ${reason === r
                    ? "border-[#b32b2b] bg-[#b32b2b]/5"
                    : "border-gray-100 hover:border-gray-200"
                    }`}
                >
                  <input
                    type="radio"
                    name="cancelReason"
                    value={r}
                    checked={reason === r}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-4 h-4 text-[#b32b2b] focus:ring-[#b32b2b]"
                  />
                  <span className={`text-sm font-semibold ${reason === r ? "text-[#b32b2b]" : "text-gray-700"}`}>
                    {r}
                  </span>
                </label>
              ))}
            </div>

            {reason === "Other" && (
              <textarea
                value={otherReason}
                onChange={(e) => setOtherReason(e.target.value)}
                placeholder="Please specify your reason..."
                className="w-full mt-4 p-4 border-2 border-gray-100 rounded-xl focus:border-[#b32b2b] focus:ring-0 outline-none transition-all text-sm min-h-[100px]"
              />
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-8 bg-gray-50 flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 py-2 px-4 border-2 border-gray-200 rounded-2xl font-bold text-gray-600 hover:bg-gray-100 transition-all cursor-pointer"
          >
            Go Back
          </button>
          <button
            onClick={handleConfirm}
            disabled={!reason || (reason === "Other" && !otherReason)}
            className="flex-1 py-2 px-4 bg-[#b32b2b] text-white rounded-2xl font-bold hover:bg-[#8e2222] disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            Confirm Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancelOrderModal;
