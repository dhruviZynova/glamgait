import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import leftlonglight from "../assets/images/leftlonglight.png";
import footerbgimg from "../assets/images/footerbgimg.png";
import logo from "../assets/logo2.png";
import axiosInstance from "../Axios/axios";

import { FaFacebook, FaDribbble, FaInstagram, FaThreads } from "react-icons/fa6";

const Footer = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axiosInstance.get("/getcategory");
        if (res.data.status === 1) {
          setCategories(res.data.data || []);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);
  return (
    <footer className="relative w-full bg-[#1C2F2F] font-inter text-white overflow-hidden px-4 md:px-10 lg:px-20">

      {/* Decorative Lamps */}
      <img
        src={leftlonglight}
        alt="Decor"
        className="absolute -right-1 lg:-left-10 lg:top-10 lg:w-20 xl:-left-10 xl:top-0 xl:w-25 2xl:left-0 z-11 pointer-events-none"
      />
      <img
        src={leftlonglight}
        alt="Decor"
        className="hidden lg:block absolute lg:left-105 lg:w-10 xl:left-120 xl:w-9 2xl:left-150 2k:left-210 4k:left-270 z-10 pointer-events-none"
      />
      <img
        src={leftlonglight}
        alt="Decor"
        className="hidden lg:block absolute lg:left-115 lg:w-8 xl:left-130 xl:w-7 2xl:left-160 2k:left-220 4k:left-280 z-10 pointer-events-none"
      />
      <img
        src={leftlonglight}
        alt="Decor"
        className="hidden lg:block absolute lg:-right-5 lg:w-18 xl:right-15 xl:w-20 2xl:right-0 z-10 pointer-events-none"
      />
      {/* <img
        src={longlight2}
        alt="Right Decor Light"
        className="absolute -right-10 sm:-right-16 md:-right-24 xl:-right-12 bottom-0 top-100 sm:top-80 md:top-35 z-11 w-[250px] sm:w-[300px] md:w-[350px] xl:w-[350px] h-auto object-contain pointer-events-none"
      /> */}

      {/* Background Image */}
      <div className="absolute inset-0 z-0 lg:h-full">
        <img
          src={footerbgimg}
          alt="Footer Background"
          className="w-full h-full object-cover object-bottom opacity-30"
        />
      </div>

      {/* Footer Content */}
      <div className="relative z-10 container mt-24 mb-0 sm:mb-24 max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 lg:gap-12">

          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="mb-6">
              <img src={logo} alt="Logo" className="h-12 md:h-14 lg:h-16 w-auto" />
              <p className="pt-4 text-[#F6F6F6] font-[Nunito Sans] text-sm lg:text-base leading-relaxed break-words">
                Glamgait is your go-to destination for trendy, affordable, and high-quality fashion for women , crafted to bring style, comfort, and confidence into everyday life.
              </p>
            </div>
            {/* Social Media Icons */}
            <div className="flex space-x-4">
              <a
                href="https://www.facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-300 transition-colors cursor-pointer"
                aria-label="Facebook"
              >
                <FaFacebook className="h-6 w-6 text-[#F6F6F6]" />
              </a>
              <a
                href="https://dribbble.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-pink-400 transition-colors cursor-pointer"
                aria-label="Dribbble"
              >
                <FaDribbble className="h-6 w-6 text-[#F6F6F6]" />
              </a>
              <a
                href="https://www.instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-pink-400 transition-colors cursor-pointer"
                aria-label="Instagram"
              >
                <FaInstagram className="h-6 w-6 text-[#F6F6F6]" />
              </a>
              <a
                href="https://www.threads.net"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-300 transition-colors cursor-pointer"
                aria-label="Threads"
              >
                <FaThreads className="h-6 w-6 text-[#F6F6F6]" />
              </a>
            </div>
          </div>

          <div className="flex gap-6 lg:gap-12">
            {/* Quick Links Section */}
            <div>
              <h3 className="text-lg lg:text-xl font-semibold text-[#F6F6F6] font-[Nunito Sans] mb-4">
                Quick Links
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="text-[#F6F6F6] hover:text-[#767676] font-[Nunito Sans] transition-colors text-sm lg:text-base">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="text-[#F6F6F6] hover:text-[#767676] font-[Nunito Sans] transition-colors text-sm lg:text-base">
                    About
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-[#F6F6F6] hover:text-[#767676] font-[Nunito Sans] transition-colors text-sm lg:text-base">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            {/* Categories Section */}
            <div>
              <h3 className="text-lg lg:text-xl font-semibold text-[#F6F6F6] font-[Nunito Sans] mb-4">
                Categories
              </h3>
              <ul className="space-y-2">
                {categories.map((category) => (
                  <li key={category.cate_id}>
                    <Link
                      to={`/collections/${category.cate_name}`}
                      className="text-[#F6F6F6] hover:text-[#767676] font-[Nunito Sans] transition-colors text-sm lg:text-base capitalize"
                    >
                      {category.cate_name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Policy Section */}
            <div>
              <h3 className="text-lg lg:text-xl font-semibold text-[#F6F6F6] font-[Nunito Sans] mb-4">
                Policy
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/privacy-policy" className="text-[#F6F6F6] hover:text-[#767676] font-[Nunito Sans] transition-colors text-sm lg:text-base">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/terms-and-conditions" className="text-[#F6F6F6] hover:text-[#767676] font-[Nunito Sans] transition-colors text-sm lg:text-base">
                    Terms & Conditions
                  </Link>
                </li>
                <li>
                  <Link to="/cancellation-policy" className="text-[#F6F6F6] hover:text-[#767676] font-[Nunito Sans] transition-colors text-sm lg:text-base">
                    Cancellation Policy
                  </Link>
                </li>
                <li>
                  <Link to="/refund-policy" className="text-[#F6F6F6] hover:text-[#767676] font-[Nunito Sans] transition-colors text-sm lg:text-base">
                    Refund Policy
                  </Link>
                </li>
                <li>
                  <Link to="/shipping-policy" className="text-[#F6F6F6] hover:text-[#767676] font-[Nunito Sans] transition-colors text-sm lg:text-base">
                    Shipping Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="w-full flex flex-col justify-center items-center gap-4 sm:mt-8 mt-10 mb-2">
        {/* Copyright */}
        <div className="text-center md:text-left">
          <p className="text-[#F6F6F6] font-[Nunito Sans] text-sm lg:text-base">
            © 2025 Netural. Design by Zynova Solutions
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
