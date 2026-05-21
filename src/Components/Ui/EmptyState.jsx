import React from "react";
import { Link } from "react-router-dom";

export default function EmptyState({ 
  icon: Icon, 
  title = "No items found", 
  description = "It looks like you don't have any items here yet.", 
  actionText, 
  actionLink 
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center max-w-lg mx-auto font-inter bg-white/30 rounded-2xl border border-dashed border-gray-200 shadow-sm my-6">
      {Icon && (
        <div className="w-20 h-20 rounded-full bg-[#E7DCD2] flex items-center justify-center text-[#1C2F2F] mb-6 shadow-inner">
          <Icon size={38} className="stroke-[1.5]" />
        </div>
      )}
      <h2 className="text-2xl font-bold text-gray-900 mb-2 font-oxygen">{title}</h2>
      <p className="text-sm text-gray-500 max-w-sm mb-8 leading-relaxed font-oxygen">{description}</p>
      {actionText && actionLink && (
        <Link
          to={actionLink}
          className="bg-[#1C2F2F] text-white px-8 py-3.5 rounded-full font-bold text-sm tracking-wide hover:bg-black transition-all duration-300 shadow-md active:scale-95 inline-flex items-center"
        >
          {actionText}
        </Link>
      )}
    </div>
  );
}
