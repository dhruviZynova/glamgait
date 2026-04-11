import React from "react";
import niqabCouple from "../assets/images/img1.png";
import niqabSingle from "../assets/images/img2.png";
import burqa from "../assets/images/img3.png";
import embroideryBurqa from "../assets/images/img4.png";

const FashionShowcase = () => {
  return (
    <section className="w-full py-6 md:py-16 px-2 md:px-8 xl:px-24">
      <div className="mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 md:grid-rows-6 gap-4 xl:gap-8">
        {/* Top Left: Large Couple Niqab Card */}
        <div className="relative rounded-2xl overflow-hidden group shadow-lg sm:col-span-2 md:row-span-3 md:col-span-2 flex flex-col justify-end min-h-[220px] md:min-h-[350px]">
          <img src={niqabCouple} alt="Islamic Niqab Face Cover" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 absolute inset-0" />
          <div className="relative z-10 h-full flex flex-col justify-end p-6 bg-gradient-to-t from-black/100 via-black/30 to-transparent">
            <h2 className="text-white text-xl sm:text-2xl md:text-3xl lg:text-5xl font-bold font-playfair mb-2">Islamic Niqab Face Cover</h2>
            <p className="text-white text-xs md:text-sm lg:text-base opacity-90 mb-4 max-w-lg font-montserrat">Our Collection for Couple Features coordinated designs and patterns, allowing couples to showcase their unity through fashion.</p>
          </div>
        </div>
        {/* Top Right: Embroidery Burqa Card (Right Side - Full Height) */}
        <div className="relative rounded-2xl overflow-hidden group shadow-lg sm:col-span-2 md:col-span-1 md:row-span-6 flex flex-col justify-end min-h-[300px] md:min-h-[420px] h-full">
          <img src={embroideryBurqa} alt="Embroidery Work Burqa" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 absolute inset-0" />
          <div className="relative z-10 h-full flex flex-col justify-end items-start p-6 bg-gradient-to-t from-black/100 via-black/30 to-transparent">
            <h2 className="text-white text-xl sm:text-2xl md:text-3xl lg:text-5xl font-bold font-playfair mb-2">Embroidery Work Burqa</h2>
            <p className="text-white text-xs md:text-sm lg:text-base opacity-90 mb-4 max-w-lg font-montserrat">Exquisite embroidery patterns for a sophisticated and elegant look.</p>
            <button className="bg-white/20 border border-white text-white px-4 py-2 rounded-full flex items-center gap-2 hover:bg-white/40 transition">Shop now <span className="text-xl">↗</span></button>
          </div>
        </div>
        {/* Bottom Left: Single Niqab Card */}
        <div className="relative rounded-2xl overflow-hidden group shadow-lg sm:col-span-1 md:row-span-3 flex flex-col justify-end min-h-[180px] md:min-h-[350px]">
          <img src={niqabSingle} alt="Islamic Niqab Face Cover" className="w-full h-full object-top object-cover group-hover:scale-105 transition-transform duration-300 absolute inset-0" />
          <div className="relative z-10 h-full flex flex-col justify-end p-4 bg-gradient-to-t from-black/100 via-black/30 to-transparent">
            <h2 className="text-white text-lg sm:text-xl md:text-2xl lg:text-4xl font-bold font-playfair mb-2">Islamic Niqab Face Cover</h2>
          </div>
        </div>
        {/* Bottom Center: Modest Wear Burqa Card */}
        <div className="relative rounded-2xl overflow-hidden group shadow-lg sm:col-span-1 md:row-span-3 flex flex-col justify-end min-h-[180px] md:min-h-[350px]">
          <img src={burqa} alt="Modest Wear Burqa" className="w-full h-full object-top object-cover group-hover:scale-105 transition-transform duration-300 absolute inset-0" />
          <div className="relative z-10 h-full flex flex-col justify-end p-4 bg-gradient-to-t from-black/100 via-black/30 to-transparent">
            <h2 className="text-white text-lg sm:text-xl md:text-2xl lg:text-4xl font-bold font-playfair mb-2">Modest Wear Burqa</h2>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FashionShowcase;
