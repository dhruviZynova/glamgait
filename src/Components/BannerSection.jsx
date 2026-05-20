import React from "react";
import bgImage from "../assets/images/bgimage4.png";

const BannerSection = () => {
    return (
        <section className="relative w-full overflow-hidden">
            {/* Parallax Background Image */}
            <div
                className="relative w-full h-[400px] sm:h-[500px] md:h-[600px] lg:h-[700px] xl:h-[1100px] bg-fixed bg-cover bg-top"
                style={{ backgroundImage: `url(${bgImage})` }}
            >
                {/* <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80" /> */}
                <div className="absolute inset-0 bg-black/30" />
            </div>
        </section>
    );
};

export default BannerSection;
