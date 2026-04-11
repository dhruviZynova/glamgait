import React from "react";
import homeherobg from "../assets/images/homeherobg.jpg";

const HomeHero = () => {
  return (
    <section className="w-full flex items-center justify-center bg-[#3a0d0d] min-h-[230px] md:min-h-[320px] lg:min-h-[375px]">
      <img
        src={homeherobg}
        alt="Home Hero"
        className="w-full h-full object-cover max-h-[600px] rounded-lg shadow-xl"
      />
    </section>
  );
};

export default HomeHero;
