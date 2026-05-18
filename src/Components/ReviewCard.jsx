import frame2 from "../assets/images/frame2.png";
import userPlaceholder from "../assets/images/profile1.jpg";

const ReviewCard = ({ name, review, image }) => {
  return (
    <div className="relative w-full aspect-[4/4] overflow-hidden group">
      {/* Arch Frame Background */}
      <div className="absolute inset-0 z-0">
        <img
          src={frame2}
          alt="Arch Frame"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content Container - Vertically centered group */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-6">

        {/* Centered Content Group */}
        <div className="relative flex flex-col items-center max-w-sm">
          {/* Quote Icon - Robust Responsive positioning */}
          {/* <div className="absolute left-0 sm:-left-4 md:-left-8 lg:-left-12 top-12 md:top-16 z-0 transform -translate-x-1/2 md:translate-x-0">
            <img
              src={quoteLeft}
              alt="Quote"
              className="w-6 md:w-8 lg:w-10 opacity-70"
            />
          </div> */}

          {/* Profile Image */}
          <div className="mb-4 relative z-10">
            <img
              src={image || userPlaceholder}
              alt={name}
              className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover border-4 border-[#D4AF37]/10"
            />
          </div>

          {/* Name & Review Text */}
          <div className="flex flex-col items-center text-center">
            <h3 className="text-[18px] md:text-[20px] font-bold text-gray-900 mb-4 font-sans uppercase tracking-tight">
              {name}
            </h3>
            <div className="px-4">
              <p className="text-[14px] md:text-[15px] text-gray-600 leading-relaxed font-sans line-clamp-3">
                {review}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;

