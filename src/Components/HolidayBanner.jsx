import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import img5 from '../assets/images/holidaybannerimg.png'
import axiosInstance from '../Axios/axios';
import { ApiURL, createSlug } from '../Variable';

const HolidayBanner = () => {
    const [firstCategorySlug, setFirstCategorySlug] = useState("");

    useEffect(() => {
        const fetchFirstCategory = async () => {
            try {
                const response = await axiosInstance.get(`${ApiURL}/getcategory`);
                if (response?.data?.status && response?.data?.data && response.data.data.length > 0) {
                    const firstCat = response.data.data[0];
                    const slug = createSlug(firstCat.cate_name);
                    setFirstCategorySlug(slug);
                }
            } catch (err) {
                console.error("Error fetching first category in HolidayBanner:", err);
            }
        };
        fetchFirstCategory();
    }, []);

    const targetSlug = firstCategorySlug || "lehengas";

    return (
        <section className="px-2 py-16 md:py-16 md:px-8 lg:px-10">
            <div className="bg-[#1C2F2F] rounded-3xl overflow-hidden flex flex-col md:flex-row items-center md:h-[400px] lg:h-[430px]">
                {/* Left Content Area */}
                <div className="flex-1 p-6 md:p-10 py-16 lg:p-12 text-white space-y-6">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-['Judson'] font-bold font-700 leading-tight">
                        Save 50% this Holiday season
                    </h2>
                    <p className="text-sm md:text-base lg:text-lg font-[Montserrat] font-500 max-w-xl leading-relaxed">
                        It's time to revamp your fashion game without breaking the bank! Dive into
                        our exclusive 50% off sale and discover unbeatable deals on the most
                        coveted styles.
                    </p>
                    <div className="pt-2">
                        <Link
                            to={`/collections/${targetSlug}`}
                            className="inline-block px-8 py-3 bg-white text-[#1C2F2F] font-[Montserrat] font-bold text-sm uppercase tracking-wider rounded-lg hover:bg-white/90 hover:shadow-xl transition-all duration-300 transform hover:scale-[1.03] active:scale-[0.98]"
                        >
                            Shop The Sale
                        </Link>
                    </div>
                </div>

                {/* Right Image Area */}
                <div className="w-full h-[350px] md:h-full md:flex-1 self-stretch">
                    <img
                        src={img5}
                        alt="Holiday Sale"
                        className="w-full h-full object-cover object-top"
                        loading="lazy"
                    />
                </div>
            </div>
        </section>
    );
};

export default HolidayBanner;
