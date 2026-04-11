import React, { useState } from "react";
import longlight from "../assets/images/longlight.png";
import faqbgimg from "../assets/images/faqbgimg.png";
import location from "../assets/location.svg";
import phone from "../assets/phone.svg";
import mail from "../assets/mail.svg";
import { FaYoutube, FaInstagram, FaFacebookF, FaXTwitter } from "react-icons/fa6";
import axiosInstance from "../Axios/axios";
import toast from "react-hot-toast";
import BrandBanner from "./BrandBanner";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, message } = formData;
    if (!name || !email || !message) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      setLoading(true);
      const response = await axiosInstance.post("/addcontact", { name, email, message });
      if (response.data?.status === 1) {
        toast.success("Message sent successfully!");
        setFormData({ name: "", email: "", message: "" });
      } else {
        toast.error(response.data?.message || "Failed to send message");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen font-sans overflow-hidden relative">
      {/* Main Contact Section */}
      <section className="relative pt-24 pb-16 px-6 md:px-12 lg:px-20 z-20">
        {/* Hanging Lantern (Top Left) */}
        <div className="absolute -top-12 -lg-top-14 left-0 md:left-4 -lg:left-8 z-20 pointer-events-none">
          <img
            src={longlight}
            alt="Hanging Lantern"
            className="w-24 md:w-32 lg:w-44 xl:w-56 h-auto drop-shadow-lg"
          />
        </div>

        {/* Header */}
        <div className="text-center mb-12 md:mb-16 relative z-10">
          <h1 className="text-[42px] md:text-[42px] lg:text-[46px] font-[Judson] text-[#000000] tracking-tight">
            Get In Touch
          </h1>
          <p className="text-[#8A8A8A] font-[Poppins] max-w-2xl mx-auto text-[16px] md:text-lg leading-relaxed px-4">
            If you have any query or any type of suggestion, you can contact us here. We would love to hear from you.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-8 relative z-10 items-start">
          {/* Left Column - Form */}
          <div className="bg-white/50 backdrop-blur-sm p-6 md:p-10 rounded-2xl shadow-xl shadow-gray-200/50">
            <h2 className="text-2xl md:text-3xl font-[Judson] text-[#000000] mb-8 border-l-4 border-[#003124] pl-4">
              Leave us a message
            </h2>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="group relative">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder=" "
                  id="contact-name"
                  className="peer w-full bg-white px-4 pt-6 pb-2 rounded-lg border-b-1 border-gray-200 outline-none focus:border-[#003124] transition-all text-gray-800 placeholder-transparent"
                />
                <label
                  htmlFor="contact-name"
                  className="absolute left-4 top-1 text-xs font-600 text-[#003124] transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-4 peer-focus:top-1 peer-focus:text-xs peer-focus:text-[#003124]"
                >
                  Full Name
                </label>
              </div>

              <div className="group relative">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder=" "
                  id="contact-email"
                  className="peer w-full bg-white px-4 pt-6 pb-2 rounded-lg border-b-1 border-gray-200 outline-none focus:border-[#003124] transition-all text-gray-800 placeholder-transparent"
                />
                <label
                  htmlFor="contact-email"
                  className="absolute left-4 top-1 text-xs font-600 text-[#003124] transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-4 peer-focus:top-1 peer-focus:text-xs peer-focus:text-[#003124]"
                >
                  Email Address
                </label>
              </div>

              <div className="group relative">
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder=" "
                  id="contact-message"
                  className="peer w-full bg-white px-4 pt-6 pb-2 rounded-lg border-b-1 border-gray-200 outline-none focus:border-[#003124] transition-all text-gray-800 h-40 resize-none placeholder-transparent"
                />
                <label
                  htmlFor="contact-message"
                  className="absolute left-4 top-1 text-xs font-600 text-[#003124] transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-4 peer-focus:top-1 peer-focus:text-xs peer-focus:text-[#003124]"
                >
                  Your Message
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full md:w-auto min-w-[200px] bg-[#003124] text-white font-[Poppins] py-4 px-8 rounded-full font-semibold tracking-widest hover:bg-[#004d39] hover:shadow-lg hover:transform hover:-translate-y-1 transition-all disabled:opacity-50 disabled:translate-y-0"
              >
                {loading ? "SENDING..." : "SEND"}
              </button>
            </form>
          </div>

          {/* Right Column - Info */}
          <div className="flex flex-col justify-center space-y-12 lg:pl-10 py-8 lg:py-0">
            <div className="space-y-8">
              <div className="flex items-center gap-5 group">
                <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center transition-transform">
                  <img src={location} alt="Location" className="w-6 h-6 object-contain" />
                </div>
                <div>
                  <p className="text-[#0F001A] font-poppins text-lg leading-snug">
                    Infomation technologies building, <br />
                    Victoria Island, Lagos, Nigeria.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-5 group">
                <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center transition-transform">
                  <img src={phone} alt="Phone" className="w-6 h-6 object-contain" />
                </div>
                <div>
                  <p className="text-[#0F001A] font-poppins text-lg">
                    +234 081-1236-4568
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-5 group">
                <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center transition-transform">
                  <img src={mail} alt="Email" className="w-6 h-6 object-contain" />
                </div>
                <div>
                  <p className="text-[#0F001A] font-poppins text-lg">
                    hello@info.com.ng
                  </p>
                </div>
              </div>
            </div>

            {/* Social Icons */}
            <div className="">
              <div className="flex items-center gap-4">
                {[
                  { icon: <FaYoutube className="text-xl" />, label: "YouTube" },
                  { icon: <FaInstagram className="text-xl" />, label: "Instagram" },
                  { icon: <FaFacebookF className="text-lg" />, label: "Facebook" },
                  { icon: <FaXTwitter className="text-lg" />, label: "Twitter" }
                ].map((social, idx) => (
                  <a
                    key={idx}
                    href="#"
                    className="w-12 h-12 bg-[#003124] rounded-full flex items-center justify-center text-white hover:bg-white hover:text-[#003124] border-2 border-[#003124] transition-all group"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Decorative Monument (Bottom Right) */}
      <div className="absolute bottom-0 right-0 w-full md:w-1/2 h-1/2 pointer-events-none">
        <img
          src={faqbgimg}
          alt="Decorative Monuments"
          className="absolute bottom-0 right-0 z-10 -scale-x-100 w-full max-w-[300px] md:max-w-[450px] lg:max-w-[600px] h-auto object-contain opacity-40 md:opacity-70 translate-y-10"
        />
      </div>

      {/* Brand Banner at the very bottom */}
      <div className="relative z-0">
        <BrandBanner />
      </div>
    </div>
  );
};

export default Contact;
