import { useState, useEffect } from "react";
import axiosInstance from "../Axios/axios";
import { Link } from "react-router-dom";
import longlight from "../assets/images/longlight.webp";
import leftlonglight from "../assets/images/leftlonglight.png";
import footerbgimg from "../assets/images/footerbgimg.png";
import logo from "../assets/logo2.png";

import {
  FaFacebookF,
  FaInstagram,
  FaXTwitter,
  FaPinterestP,
  FaArrowRight,
  FaPhone,
  FaEnvelope,
} from "react-icons/fa6";

import gpay from "../assets/gpay.png";
import paypal from "../assets/paypal.png";
import razorpay from "../assets/razorpay.png";
import stripe from "../assets/stripe.png"
import applepay from "../assets/applepay.png";
import visa from "../assets/visa.webp";
import mastercard from "../assets/mastercard.png"

import { getFullImageUrl, createSlug } from "../Variable";
import { getCategories as getCachedCategories } from "../utils/dataCache";
import toast from "react-hot-toast";

const Footer = () => {

  const [categories, setCategories] = useState([]);
  const [instaImages, setInstaImages] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCachedCategories(axiosInstance);
        setCategories(data || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    const fetchInstaImages = async () => {
      try {
        const res = await axiosInstance.get("/getinstaimages");
        if (res.data.status === 1) {
          setInstaImages(res.data.data || []);
        }
      } catch (error) {
        console.error("Error fetching instagram images:", error);
      }
    };

    fetchCategories();
    fetchInstaImages();
  }, []);

  return (
    <footer className="relative w-full bg-[#1C2F2F] font-inter text-white overflow-hidden px-4 md:px-10 lg:px-20">
      {/* Decorative Lamps */}
      {/* <img
        src={leftlonglight}
        alt="Decor"
        className="absolute left-2 lg:left-6 top-0 w-12 lg:w-16 z-11 pointer-events-none"
      /> */}
      <img
        src={longlight}
        alt="Decor"
        className="absolute right-2 lg:right-0 top-0 w-20 lg:w-34 z-11 pointer-events-none"
      />
      <img
        src={leftlonglight}
        alt="Decor"
        className="hidden lg:block absolute lg:left-[28%] lg:w-10 top-0 z-10 pointer-events-none"
      />
      <img
        src={leftlonglight}
        alt="Decor"
        className="hidden lg:block absolute lg:left-[60%] lg:w-12 top-0 z-10 pointer-events-none"
      />

      {/* Background Image */}
      <div className="absolute bottom-0 left-0 right-0 z-0 h-[480px] md:h-[680px] lg:h-full">
        <img
          src={footerbgimg}
          alt="Footer Background"
          className="w-full h-full object-cover object-bottom opacity-30 pointer-events-none"
        />
      </div>

      {/* Footer Content */}
      <div className="relative z-10 w-full pt-20 pb-22 md:pb-8 max-w-7xl mx-auto">
        {/* Top Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 lg:gap-12 w-full border-b border-white/10 pb-8 md:pb-12">
          {/* Brand Section */}
          <div className="flex flex-col gap-6">
            <img src={logo} alt="Logo" className="h-12 md:h-14 lg:h-16 w-auto self-start" />
            <p className="text-[#CCCCCC] font-[Nunito Sans] text-sm leading-relaxed">
              Defining modern elegance with timeless design. We craft collections for those who appreciate the finer details.
            </p>
            {/* Social Media Icons */}
            {instaImages && instaImages.length > 0 && (
              <div className="flex flex-col gap-2">
                <div className="flex flex-wrap gap-2">
                  {instaImages
                    .filter(item => {
                      const fileUrl = item?.image_url || "";
                      return !(
                        fileUrl.endsWith(".mp4") ||
                        fileUrl.endsWith(".webm") ||
                        fileUrl.endsWith(".ogg")
                      );
                    })
                    .slice(0, 4)
                    .map((img) => (
                      <a
                        key={img.insta_id}
                        href={img.insta_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-6 h-6 rounded overflow-hidden transition-all flex-shrink-0"
                      >
                        <img
                          src={getFullImageUrl(img.image_url, "Instagram")}
                          alt={`Instagram ${img.insta_id}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://placehold.co/150x150?text=Media";
                          }}
                        />
                      </a>
                    ))}
                </div>
              </div>
            )}
          </div>

          {/* Collections Section */}
          <div>
            <h3 className="text-sm font-semibold tracking-wider text-[#A3B8B5] font-[Montserrat] mb-6 uppercase">
              Collections
            </h3>
            <ul className="space-y-3 text-sm text-[#CCCCCC]">
              {categories.map((category) => (
                <li key={category.cate_id}>
                  <Link
                    to={`/collections/${createSlug(category.cate_name)}`}
                    className="hover:text-white transition-colors capitalize"
                  >
                    {category.cate_name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Section */}
          <div>
            <h3 className="text-sm font-semibold tracking-wider text-[#A3B8B5] font-[Montserrat] mb-6 uppercase">
              Company
            </h3>
            <ul className="space-y-3 text-sm text-[#CCCCCC]">
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Section */}
          <div>
            <h3 className="text-sm font-semibold tracking-wider text-[#A3B8B5] font-[Montserrat] mb-6 uppercase">
              Support
            </h3>
            <ul className="space-y-3 text-sm text-[#CCCCCC]">
              <li>
                <Link to="/faq" className="hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/shipping-policy" className="hover:text-white transition-colors">
                  Shipping & Delivery
                </Link>
              </li>
              <li>
                <Link to="/refund-policy" className="hover:text-white transition-colors">
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms-and-conditions" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Middle Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 w-full py-8 md:py-12 border-b border-white/10">
          {/* Join the List */}
          <div className="md:col-span-2 flex flex-col justify-center">
            <h3 className="text-xl font-medium text-white mb-2">Join the List</h3>
            <p className="text-sm text-[#CCCCCC] leading-relaxed max-w-md">
              Sign up for early access to new drops, styling tips, and exclusive members-only offers.
            </p>
            <form onSubmit={(e) => {
              e.preventDefault();
              const email = e.target.elements.email?.value;
              if (email) {
                toast.success("Thank you for subscribing!");
                e.target.reset();
              }
            }} className="mt-6 max-w-md">
              <div className="relative flex items-center border-b border-white/50 py-2 focus-within:border-white transition-colors">
                <input
                  type="email"
                  name="email"
                  placeholder="Your email address"
                  className="appearance-none bg-transparent border-none w-full text-white mr-3 py-1 px-2 leading-tight focus:outline-none placeholder:text-white/50 text-sm"
                  aria-label="Email address"
                  required
                />
                <button
                  type="submit"
                  className="flex-shrink-0 text-white hover:text-gray-300 transition-colors"
                  aria-label="Subscribe"
                >
                  <FaArrowRight className="h-4 w-4" />
                </button>
              </div>
            </form>
          </div>

          {/* Get in Touch */}
          <div>
            <h3 className="text-xs font-semibold tracking-wider text-[#A3B8B5] font-[Montserrat] mb-6 uppercase">
              Get in Touch
            </h3>
            <ul className="space-y-3 text-sm text-[#CCCCCC]">
              <li className="flex items-center gap-3">
                <FaPhone className="h-4 w-4 text-[#A3B8B5]" />
                <a href="tel:+919768967885" className="hover:text-white transition-colors">
                  +91 97689 67885
                </a>
              </li>
              <li className="flex items-center gap-3">
                <FaEnvelope className="h-4 w-4 text-[#A3B8B5]" />
                <a href="mailto:info@kundrat.com" className="hover:text-white transition-colors">
                  info@kundrat.com
                </a>
              </li>
            </ul>
          </div>

          {/* Location */}
          <div>
            <h3 className="text-xs font-semibold tracking-wider text-[#A3B8B5] font-[Montserrat] mb-6 uppercase">
              Location
            </h3>
            <p className="text-sm text-[#CCCCCC] leading-relaxed">
              123 Fashion Avenue, Design District
              <br />
              Mumbai, Maharashtra 400001
              <br />
              India
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-8 text-sm text-[#CCCCCC]">
          {/* Copyright */}
          <div>
            © {new Date().getFullYear()} Kundrat. All rights reserved.
          </div>


          {/* Payment Badges */}
          <div className="flex gap-2">
            <div className="w-12 h-8 bg-white/100 border border-white/10 rounded flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-all cursor-pointer overflow-hidden">
              <img src={gpay} alt="GPay" className="w-full h-full object-contain p-1" />
            </div>
            <div className="w-12 h-8 bg-white/100 border border-white/10 rounded flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-all cursor-pointer overflow-hidden">
              <img src={paypal} alt="Paypal" className="w-full h-full object-contain p-1" />
            </div>
            <div className="w-12 h-8 bg-white/100 border border-white/10 rounded flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-all cursor-pointer overflow-hidden">
              <img src={razorpay} alt="Razorpay" className="w-full h-full object-contain p-1" />
            </div>
            <div className="w-12 h-8 bg-white/100 border border-white/10 rounded flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-all cursor-pointer overflow-hidden">
              <img src={stripe} alt="Stripe" className="w-full h-full object-contain p-1" />
            </div>
            <div className="w-12 h-8 bg-white/100 border border-white/10 rounded flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-all cursor-pointer overflow-hidden">
              <img src={applepay} alt="ApplePay" className="w-full h-full object-contain p-1.5" />
            </div>
            <div className="w-12 h-8 bg-white/100 border border-white/10 rounded flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-all cursor-pointer overflow-hidden">
              <img src={visa} alt="Visa" className="w-full h-full object-contain p-1" />
            </div>
            <div className="w-12 h-8 bg-white/100 border border-white/10 rounded flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-all cursor-pointer overflow-hidden">
              <img src={mastercard} alt="MasterCard" className="w-full h-full object-contain p-1" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
