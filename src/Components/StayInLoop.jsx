import React, { useState } from "react";
import pattern from "../assets/pattern.png";
import leftlight from "../assets/leftlight.png";

const StayInLoop = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setEmail("");
  };

  return (
    <section className="relative bg-white py-6 overflow-hidden">
      {/* Left Pattern */}
      <div className="">
        <img
          src={pattern}
          alt="Pattern"
          className="hidden md:block absolute left-0 top-0 h-60 w-70 2xl:h-[400px] 2xl:w-[400px] z-0"
        />
      </div>
      {/* Right Pattern */}
      <div>
        <img
          src={pattern}
          alt="Pattern"
          className="hidden md:block absolute -right-5 top-0 h-60 w-70 -scale-x-90 2xl:h-[400px] 2xl:w-[400px] z-0"
        />
      </div>

      {/* Left Lantern Image */}
      <div className="absolute left-5 top-20 lg:top-1/2 transform -translate-y-1/2">
        <img
          src={leftlight}
          alt="Decorative"
          className="hidden md:block h-35 lg:h-50 object-contain"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-[30px] md:text-[34px] xl:text-[34px] font-bold text-gray-800 mb-2">
          Stay in the Loop
        </h2>
        <p className="text-[12px] md:text-[16px] text-gray-600 pb-4">
          Join our community for exclusive offers, new arrivals, and sustainable
          fashion tips
        </p>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col md:flex-row justify-center items-center gap-2 md:gap-0"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email address..."
            className="w-full md:w-[500px] px-4 py-3 md:rounded-l-lg rounded-lg md:rounded-none bg-[#EAE7E7] text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-600 transition duration-200"
          />
          <button
            type="submit"
            className="w-full md:w-auto px-6 py-3 bg-[#02382A] text-white rounded-lg md:rounded-none md:rounded-r-lg
 hover:bg-white hover:text-[#02382A] border border-[#02382A] focus:outline-none transition duration-200"
          >
            SIGN UP
          </button>
        </form>
      </div>
    </section>
  );
};

export default StayInLoop;
