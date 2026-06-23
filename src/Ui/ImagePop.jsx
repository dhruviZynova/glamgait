import { X } from "lucide-react";
import { ApiURL } from "../Variable"; // Ensure this path is correct relative to this file

const ImagePop = ({ onClose, image }) => {
  // Determine if the image is already a full URL (http/https)
  const isFullUrl = image?.startsWith("http://") || image?.startsWith("https://");

  // Construct source URL. 
  // If it's not a full URL, we assume it's a relative path or filename from the backend.
  // Note: Adjust the fallback path "/assets/Category/" if your images are stored elsewhere.
  const imgSrc = isFullUrl ? image : `${ApiURL}/assets/Category/${image}`;

  // Prevent rendering if no image is provided
  if (!image) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-4xl max-h-[90vh] flex items-center justify-center">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 md:top-0 md:-right-12 z-10 bg-white/10 hover:bg-white/30 text-white rounded-full p-2 transition-all cursor-pointer"
          aria-label="Close popup"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Image Container */}
        <div className="relative rounded-lg overflow-hidden shadow-2xl bg-transparent">
          <img
            src={imgSrc}
            alt="Popup Preview"
            // 'object-contain' ensures the full image is visible without cropping
            // 'max-h-[85vh]' ensures it doesn't overflow the screen height
            className="max-w-full max-h-[85vh] w-auto h-auto object-contain"
            onError={(e) => {
              // Fallback if image fails to load
              e.target.style.display = "none";
              // You could render an error message div here if needed
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ImagePop;