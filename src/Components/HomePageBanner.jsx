// HomePageBanner.jsx
import React from "react";

// Assets (update these with actual paths)
import backgroundImage from "../assets/singlebanner.jpg"; // Background image
import rightlight from "../assets/rightlight.png"; // Lantern image

const HomePageBanner = ({ title = "comfort and lasting style", bgImage = backgroundImage }) => {
  return (
    <div
      className="relative w-full h-[300px] sm:h-[350px] md:h-[400px] lg:h-[450px] overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* Overlay for better text readability */}

      {/* Lantern Decoration */}
      <img
        src={rightlight}
        alt="Lantern"
        className="absolute left-4 top-4 w-12 sm:w-16 md:w-20 opacity-70 z-10"
      />

      {/* Title */}
      <div className="relative z-10 flex items-center justify-center h-full text-white">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center px-4">
          {title}
        </h1>
      </div>
    </div>
  );
};

export default HomePageBanner;