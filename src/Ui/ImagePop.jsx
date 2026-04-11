import { X } from "lucide-react";
import { ApiURL } from "../Variable";

const ImagePop = ({ onClose ,image}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative w-[550px] max-w-[90%] rounded-xl overflow-hidden shadow-2xl">
        {/* ❌ Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 z-10 bg-white/80 hover:bg-white rounded-full p-1 transition"
        >
          <X className="w-5 h-5 text-black" />
        </button>

        {/* 🖼️ Image */}
        <img src={`${ApiURL}/assets/Category/${image}`} alt="Popup" className="w-full h-auto object-cover" />
      </div>
    </div>
  );
};

export default ImagePop;
