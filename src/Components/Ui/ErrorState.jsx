import React from "react";
import { AlertCircle, RotateCcw } from "lucide-react";

export default function ErrorState({ 
  title = "Something went wrong", 
  message = "We encountered an error while fetching your details. Please try again.", 
  onRetry 
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center bg-white/50 backdrop-blur-sm rounded-2xl border border-rose-100 max-w-xl mx-auto shadow-sm my-8 font-inter">
      <div className="w-16 h-16 rounded-full bg-rose-50 flex items-center justify-center text-rose-500 mb-6">
        <AlertCircle size={32} />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-500 max-w-sm mb-8 leading-relaxed">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#1C2F2F] text-white hover:bg-black font-semibold text-sm transition-all duration-300 shadow-md cursor-pointer active:scale-95"
        >
          <RotateCcw size={16} />
          <span>Try Again</span>
        </button>
      )}
    </div>
  );
}
