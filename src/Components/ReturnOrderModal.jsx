import React, { useState } from "react";
import { X, RefreshCcw } from "lucide-react";

const ReturnOrderModal = ({ isOpen, onClose, onConfirm, orderId }) => {
  const [reason, setReason] = useState("");
  const [otherReason, setOtherReason] = useState("");

  const reasons = [
    "Item is damaged",
    "Received wrong item",
    "Size doesn't fit",
    "Quality not as expected",
    "Changed my mind",
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
        <div className="bg-[#004534] p-4 md:p-6 text-white flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-full">
              <RefreshCcw size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold">Return Order</h2>
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
        <div className="p-4 md:p-8">
          <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Reason for return
            </label>
            <div className="grid grid-cols-1 gap-3">
              {reasons.map((r) => (
                <label
                  key={r}
                  className={`flex items-center gap-3 p-4 rounded-xl border-1 transition-all cursor-pointer ${reason === r
                    ? "border-[#004534] bg-[#004534]/5"
                    : "border-gray-100 hover:border-gray-200"
                    }`}
                >
                  <input
                    type="radio"
                    name="returnReason"
                    value={r}
                    checked={reason === r}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-4 h-4 text-[#004534] focus:ring-[#004534]"
                  />
                  <span className={`text-sm font-semibold ${reason === r ? "text-[#004534]" : "text-gray-700"}`}>
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
                className="w-full p-4 border-1 border-gray-100 rounded-xl outline-none transition-all text-sm min-h-[100px]"
              />
            )}
          </div>

          <div className="pt-4 flex justify-center">
            <button
              onClick={handleConfirm}
              disabled={!reason || (reason === "Other" && !otherReason)}
              className="flex-1 py-2 px-4 bg-[#004534] text-white rounded-2xl font-semibold hover:bg-[#00382e] disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              Request Return
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReturnOrderModal;
