// import { useEffect, useRef, useState } from "react";
// import { X } from "lucide-react";
// import v1 from "../assets/v1.mp4";

// const VideoPopUp = ({videoSrc, onClose, autoPlay = true}) => {
//   console.log(videoSrc,'video');

//   const videoRef = useRef(null);
//   const [isVisible, setIsVisible] = useState(true); // State to control visibility

//   useEffect(() => {
//     if (videoRef.current) {
//       videoRef.current.play().catch((error) => {
//         console.log("Autoplay prevented:", error);
//       });
//     }
//   }, []);

//   if (!isVisible) return null; // Don't render if popup is closed

//   return (
//     <div className="fixed bottom-40 right-4 z-50 w-[110px] h-[160px] rounded-xl overflow-hidden shadow-lg bg-black">
//       <div className="relative w-full h-full">
//         {/* ❌ Close Button */}
//         <button
//           onClick={() => setIsVisible(false)}
//           className="absolute top-1 right-1 z-10 bg-white/60 rounded-full p-1 transition cursor-pointer"
//         >
//           <X className="w-4 h-4 text-black" />
//         </button>

//         {/* 🎥 Video */}
//         <video
//           ref={videoSrc}
//           autoPlay
//           muted
//           loop
//           playsInline
//           className="w-full h-full object-cover"
//         >
//           <source src={v1} type="video/mp4" />
//           Your browser does not support the video tag.
//         </video>
//       </div>
//     </div>
//   );
// };

// export default VideoPopUp;

// VideoPopUp.jsx
import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

const VideoPopUp = ({ videoSrc, onClose, autoPlay = true }) => {
  const videoRef = useRef(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (videoRef.current && autoPlay) {
      videoRef.current.play().catch((error) => {
        console.log("Autoplay prevented:", error);
      });
    }
  }, [videoSrc, autoPlay]);

  if (!isVisible) return null;
  if (!videoSrc) return null;

  return (
    <div className="fixed bottom-40 right-4 z-50 w-[110px] h-[160px] rounded-xl overflow-hidden shadow-lg bg-black">
      <div className="relative w-full h-full">
        {/* Close Button */}
        <button
          onClick={() => setIsVisible(false)}
          className="absolute top-1 right-1 z-10 bg-white/60 rounded-full p-1 transition cursor-pointer hover:bg-white/80"
        >
          <X className="w-4 h-4 text-black" />
        </button>

        {/* Video */}
        <video
          ref={videoRef}
          src={videoSrc}
          autoPlay={autoPlay}
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
        >
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  );
};

export default VideoPopUp;
