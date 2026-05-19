import React from 'react';
import img5 from '../assets/images/img5.png';

const HolidayBanner = () => {
    return (
        <section className="px-4 py-6 md:py-16 md:px-8 lg:px-10">
            <div className="bg-[#1C2F2F] rounded-3xl overflow-hidden flex flex-col md:flex-row items-center md:h-[400px] lg:h-[430px]">
                {/* Left Content Area */}
                <div className="flex-1 p-6 md:p-10 py-16 lg:p-12 text-white space-y-4">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-['Judson'] font-bold font-700 leading-tight">
                        Save 50% this Holiday season
                    </h2>
                    <p className="text-sm md:text-base lg:text-lg font-[Montserrat] font-500 max-w-xl">
                        It's time to revamp your fashion game without breaking the bank! Dive into
                        our exclusive 50% off sale and discover unbearable deals on the most
                        coveted styles.
                    </p>
                    {/* <div className="pt-2">
                        <button className="px-6 py-2 border-2 border-white rounded-full text-white font-[Montserrat] font-500 text-sm md:text-base hover:bg-white hover:text-[#1A2C2B] transition-colors duration-300 cursor-pointer">
                            Shop Now
                        </button>
                    </div> */}
                </div>

                {/* Right Image Area */}
                <div className="w-full h-[350px] md:h-full md:flex-1 self-stretch">
                    <img
                        src={img5}
                        alt="Holiday Sale"
                        className="w-full h-full object-cover object-top"
                    />
                </div>
            </div>
        </section>
    );
};

export default HolidayBanner;
