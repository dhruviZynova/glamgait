import { useRef, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { ApiURL } from "../Variable";

const VideoCard = ({ product }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);

  // Flatten all images across colors
  const allMedia =
    product?.productcolors?.flatMap((c) => c.productimages) || [];

  // Pick first mp4 if exists, otherwise first image
  const videoFile = allMedia.find((img) => img?.image_url?.endsWith(".mp4"));
  const imageFile = allMedia.find((img) => !img?.image_url?.endsWith(".mp4"));

  const mediaSrc = videoFile?.image_url || imageFile?.image_url || "";

  const handleCardClick = useCallback(() => { }, []);

  const handlePlayPause = (e) => {
    e.stopPropagation();
    if (!videoFile) return;
    if (videoRef.current) {
      if (isPlaying) videoRef.current.pause();
      else videoRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  let slug = product?.name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-&'()]/g, "") // Allow &, ', (, )
    .replace(/\s+/g, "-") // spaces → dashes
    .replace(/-+/g, "-") // multiple dashes → one
    .replace(/^-+|-+$/g, ""); // trim dashes

  // URL-encode the slug to safely handle & and other special chars
  const encodedSlug = encodeURIComponent(slug);

  return (
    <Link
      to={`/product/${encodedSlug}`}
      className="relative overflow-hidden cursor-pointer w-full max-w-[300px] mx-auto"
      onClick={handleCardClick}
    >
      {videoFile ? (
        <video
          ref={videoRef}
          src={`${ApiURL}/assets/Products/${mediaSrc}`}
          className="w-full h-auto aspect-[4/6] object-cover rounded-2xl"
          autoPlay
          loop
          muted
          playsInline
          onClick={handlePlayPause}
        />
      ) : (
        <img
          src={`${ApiURL}/assets/Products/${mediaSrc}`}
          alt={product.name}
          className="w-full h-auto aspect-[4/6] object-cover rounded-2xl"
        />
      )}

      <div className="absolute bottom-4 left-4 right-4">
        <div className="bg-[#FFFFFF]/50 backdrop-blur-md rounded-2xl p-3 shadow-lg w-auto">
          <div className="flex items-start gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2">
                <h3 className="text-lg font-semibold text-gray-900 truncate">
                  {product.name}
                </h3>
              </div>
              <span className="text-[14px] font-bold text-gray-900">
                ₹{product?.price}
              </span>
              <p className="text-xs text-gray-600 leading-relaxed line-clamp-1">
                {product?.reviews}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default VideoCard;
