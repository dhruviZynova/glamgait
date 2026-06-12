import React from "react";
import indianKurti from "../assets/images/indian_kurti_model.png";
import lehengaCholi from "../assets/images/img3.webp";
import abayaTall from "../assets/images/img4.png";
import longLight from "../assets/images/longlight.webp";
import fusion from "../assets/images/homeherofusion_copy.webp";
import ScrollReveal from "./Ui/ScrollReveal";

const FashionShowcase = () => {
  return (
    <section className="w-full py-16 md:py-16 px-2 md:px-8 xl:px-24 relative">
      <div className="mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 md:grid-rows-6 gap-4 xl:gap-8 relative z-10">

        {/* Top Left: Large Couple Niqab Card */}
        <ScrollReveal
          className="sm:col-span-2 md:row-span-3 md:col-span-2 flex flex-col justify-end min-h-[220px] md:min-h-[350px]"
          animation="fade-right"
          duration={1000}
        >
          <div className="relative w-full h-full rounded-2xl overflow-hidden group shadow-lg flex flex-col justify-end">
            <img src={fusion} alt="Traditional Silk Saree" className="w-full h-full object-top object-cover group-hover:scale-105 transition-transform duration-300 absolute inset-0" loading="lazy" />
            <div className="relative z-10 h-full flex flex-col justify-end p-4 md:p-6 bg-gradient-to-t from-black/100 via-black/30 to-transparent">
              <h2 className="text-white text-xl sm:text-2xl md:text-3xl lg:text-5xl font-bold font-playfair mb-2">Indian & Muslim Fashion</h2>
              <p className="text-white text-xs md:text-sm lg:text-base opacity-90 mb-4 max-w-lg font-montserrat">A stunning collection blending rich traditional Indian aesthetics with elegant Muslim modest wear.</p>
            </div>
          </div>
        </ScrollReveal>

        {/* Top Right: Embroidery Burqa Card (Right Side - Full Height) */}
        <ScrollReveal
          className="sm:col-span-2 md:col-span-1 md:row-span-6 flex flex-col justify-end min-h-[300px] md:min-h-[420px] h-full"
          animation="fade-left"
          duration={1200}
          delay={150}
        >
          <div className="relative w-full h-full rounded-2xl overflow-hidden group shadow-lg flex flex-col justify-end">
            <img src={abayaTall} alt="Luxurious Embroidered Abaya" className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300 absolute inset-0" loading="lazy" />
            <div className="relative z-10 h-full flex flex-col justify-end items-start p-4 md:p-6 bg-gradient-to-t from-black/100 via-black/30 to-transparent">
              <h2 className="text-white text-xl sm:text-2xl md:text-3xl lg:text-5xl font-bold font-playfair mb-2">Embroidered Abaya</h2>
              <p className="text-white text-xs md:text-sm lg:text-base opacity-90 mb-4 max-w-lg font-montserrat">Exquisite embroidery patterns for a sophisticated and elegant modest Islamic look.</p>
            </div>
          </div>
        </ScrollReveal>

        {/* Bottom Left: Designer Kurtis Card */}
        <ScrollReveal
          className="sm:col-span-1 md:row-span-3 flex flex-col justify-end min-h-[180px] md:min-h-[350px]"
          animation="fade-up"
          duration={1000}
          delay={100}
        >
          <div className="relative w-full h-full rounded-2xl overflow-hidden group shadow-lg flex flex-col justify-end">
            <img src={indianKurti} alt="Designer Kurtis" className="w-full h-full object-top object-cover group-hover:scale-105 transition-transform duration-300 absolute inset-0" loading="lazy" />
            <div className="relative z-10 h-full flex flex-col justify-end p-4 md:p-6 bg-gradient-to-t from-black/100 via-black/30 to-transparent">
              <h2 className="text-white text-lg sm:text-xl md:text-2xl lg:text-4xl font-bold font-playfair mb-2">Designer Kurtis</h2>
            </div>
          </div>
        </ScrollReveal>

        {/* Bottom Center: Modest Wear Burqa Card */}
        <ScrollReveal
          className="sm:col-span-1 md:row-span-3 flex flex-col justify-end min-h-[180px] md:min-h-[350px]"
          animation="fade-up"
          duration={1000}
          delay={250}
        >
          <div className="relative w-full h-full rounded-2xl overflow-hidden group shadow-lg flex flex-col justify-end">
            <img src={lehengaCholi} alt="Designer Lehenga Choli" className="w-full h-full object-top object-cover group-hover:scale-105 transition-transform duration-300 absolute inset-0" loading="lazy" />
            <div className="relative z-10 h-full flex flex-col justify-end p-4 md:p-6 bg-gradient-to-t from-black/100 via-black/30 to-transparent">
              <h2 className="text-white text-lg sm:text-xl md:text-2xl lg:text-4xl font-bold font-playfair mb-2">Designer Lehenga</h2>
            </div>
          </div>
        </ScrollReveal>

      </div>

      {/* Decorative Hanging Light */}
      <ScrollReveal
        className="hidden md:block absolute right-4 md:right-12 xl:right-32 -bottom-32 xl:-bottom-40 z-0"
        animation="fade-down"
        duration={1500}
        delay={450}
      >
        <img
          src={longLight}
          alt="Decorative Light"
          className="h-[250px] xl:h-[350px] object-contain pointer-events-none"
          loading="lazy"
        />
      </ScrollReveal>
    </section>
  );
};

export default FashionShowcase;

