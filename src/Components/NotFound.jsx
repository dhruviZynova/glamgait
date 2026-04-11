import { BiUndo } from "react-icons/bi";
import React from "react";
import { useNavigate } from "react-router-dom";
import faceImg from "../assets/images/404img.png";
import lanternImg from "../assets/images/longlight.png";
import fontimg from "../assets/images/fontimg.png";

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="relative flex flex-col items-center justify-center gap-16 pt-34 overflow-hidden">
      {/* Top Lantern (right) */}
      <img
        src={lanternImg}
        alt="Lantern"
        className="hidden md:block absolute top-0 right-10 w-20 md:w-28 lg:w-36 z-10 animate-fadeIn"
        style={{ animationDelay: "0.2s" }}
      />
      {/* Hanging Lantern (left, mobile) */}
      <img
        src={lanternImg}
        alt="Lantern"
        className="block md:hidden absolute top-0 left-1/2 -translate-x-1/2 w-16 z-10 animate-fadeIn"
        style={{ animationDelay: "0.2s" }}
      />

      <div className="flex flex-col items-center justify-center gap-16">
        {/* Oops! */}
        <h1 className="text-3xl md:text-4xl font-extrabold text-black z-20">Oops!</h1>
        {/* Only face image (no 4s) */}
        <div className="relative flex items-center justify-center">
          <img
            src={faceImg}
            alt="404 Face"
            className="w-32 md:w-56 lg:w-2xl z-20 pointer-events-none"
          />
        </div>
        {/* Go Home Button */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 border-b-2 border-black text-black font-medium text-base md:text-lg bg-transparent transition-all duration-200 cursor-pointer"
        >
          <BiUndo className="text-xl md:text-2xl" /> Go Home
        </button>
      </div>

      {/* Large faded background text at bottom */}
      <div className="w-full text-center select-none pointer-events-none z-0">
        <img src={fontimg} alt="Background Text" className="w-full h-auto opacity-80" />
      </div>
    </div>
  );
};

export default NotFound;

