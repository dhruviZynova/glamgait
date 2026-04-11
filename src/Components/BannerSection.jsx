import React from "react";
import bgImage from "../assets/images/bgimage1.png";

const BannerSection = () => {
    return (
        <section className="relative w-full overflow-hidden">
            {/* Background Image */}
            <div className="relative w-full h-[400px] sm:h-[500px] md:h-[600px] lg:h-[700px] xl:h-[1100px]">
                <img
                    src={bgImage}
                    alt="Modesty is the new beauty"
                    className="w-full h-full object-cover object-top object-center"
                />

                {/* Gradient overlay for text readability */}
                {/* <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" /> */}

                {/* Bottom tagline */}
                {/* <div className="absolute bottom-8 sm:bottom-12 md:bottom-16 left-0 right-0 text-center z-10">
                    <p
                        className="text-white text-lg sm:text-xl md:text-2xl lg:text-3xl italic tracking-wide"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                        Modesty is the new beauty
                    </p>
                </div> */}
            </div>
        </section>
    );
};

export default BannerSection;
