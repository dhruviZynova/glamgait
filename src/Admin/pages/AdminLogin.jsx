import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../Axios/axios";
import { ApiURL } from "../../Variable";
import toast from "react-hot-toast";
import { FaRegEye, FaRegEyeSlash, FaShoppingBag, FaUsers } from "react-icons/fa";
import { FiTrendingUp, FiShield } from "react-icons/fi";
import { useUser } from "../../Context/UserContext";
import logo from "../../assets/logo1.png";
import loginimg1 from "../../assets/images/loginimg1.jpg";
import loginimg2 from "../../assets/images/loginimg2.jpg";
import loginimg3 from "../../assets/images/loginimg3.jpg";
import loginimg4 from "../../assets/images/loginimg4.jpg";
import loginimg5 from "../../assets/images/loginimg5.jpg";

const AdminLogin = () => {
    const navigate = useNavigate();
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const { refreshUser } = useUser();

    // Auto scroll showcase images state
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const showcaseImages = [loginimg1, loginimg2, loginimg3, loginimg4, loginimg5];

    useEffect(() => {
        document.body.classList.add("admin-body");
        return () => {
            document.body.classList.remove("admin-body");
        };
    }, []);

    // Set interval for auto scrolling images
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % showcaseImages.length);
        }, 4000);
        return () => clearInterval(timer);
    }, [showcaseImages.length]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (loading) return;
        setLoading(true);

        try {
            const response = await axiosInstance.post(`${ApiURL}/userlogin`, {
                email,
                password,
            });

            if (response.data.status === 1) {
                const userData = response.data.data;

                if (userData.role === "admin") {
                    const userSessionData = {
                        name: userData.name || userData.u_name || '',
                        email: userData.email || '',
                        token: userData.auth_token || '',
                        role: userData.role || '',
                        u_id: userData.u_id || '',
                        phone: userData.phone || '',
                        ...userData
                    };

                    sessionStorage.setItem("GlamGaitAdmin", JSON.stringify(userSessionData));
                    refreshUser();
                    toast.success("Login Successful");
                    navigate("/admin");
                } else {
                    toast.error("Access denied. Admin privileges required.");
                }
            } else {
                toast.error(response?.data?.description || "Login failed");
            }
        } catch (err) {
            toast.error("Something went wrong");
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8F7F4] flex flex-col md:flex-row font-sans relative overflow-hidden">
            {/* LEFT SECTION (50% on desktop) - Visual Storytelling & Branding */}
            <div className="w-full md:w-[50%] bg-gradient-to-br from-[#F8F7F4] via-[#F3F1EC] to-[#EBE7DF] py-12 md:py-0 p-6 md:p-12 lg:p-0 flex flex-col items-center justify-center relative overflow-hidden border-r border-[#E5E7EB]">
                {/* Decorative Traditional Indian Motif (Subtle SVG Paisley Grid Pattern) */}
                <div
                    className="absolute inset-0 opacity-[0.03] pointer-events-none"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M40 0 C45 15, 55 25, 40 40 C25 25, 35 15, 40 0 Z M40 40 C45 55, 55 65, 40 80 C25 65, 35 55, 40 40 Z' fill='%23C9A96E' fill-rule='evenodd'/%3E%3C/svg%3E")`
                    }}
                ></div>

                {/* Soft ambient lighting overlay */}
                <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-[#C9A96E]/5 blur-[100px] pointer-events-none"></div>

                {/* Branding Top Header */}
                <div className="relative z-10 flex items-center gap-3">
                    <span className="text-xs font-bold tracking-[0.2em] text-[#C9A96E] uppercase">Kundrat Lifestyle</span>
                    <span className="h-[1px] w-8 bg-[#C9A96E]/30"></span>
                    <span className="text-[10px] text-gray-400 tracking-wider">Enterprise System</span>
                </div>

                {/* Main Showcase Area */}
                <div className="relative z-10 py-8 max-w-xl">
                    <h1 className="text-2xl md:text-2xl lg:text-4xl md:text-5xl font-semibold text-[#111827] tracking-tight leading-none mb-4">
                        Admin Control Center
                    </h1>
                    <p className="text-[#6B7280] text-sm md:text-base leading-relaxed mb-8 max-w-lg">
                        Manage products, orders, customers and store operations from one place.
                    </p>

                    {/* Image and Floating Glass Cards Container */}
                    <div className="relative inline-block w-full max-w-lg">
                        {/* Luxury Frame with Auto-Scrolling Carousel */}
                        <div className="relative rounded-2xl overflow-hidden border border-white/60 shadow-2xl p-2 bg-white/40 backdrop-blur-md">
                            <div className="relative w-full h-[340px] md:h-[540px] overflow-hidden rounded-xl">
                                {showcaseImages.map((img, idx) => (
                                    <img
                                        key={idx}
                                        src={img}
                                        alt={`Kundrat Collection Showcase ${idx + 1}`}
                                        className={`absolute inset-0 w-full h-full object-cover object-top rounded-xl grayscale-[5%] hover:grayscale-0 transition-all duration-1000 ease-in-out ${currentImageIndex === idx
                                            ? "translate-x-0 z-10 opacity-100"
                                            : (currentImageIndex - 1 + showcaseImages.length) % showcaseImages.length === idx
                                                ? "-translate-x-full z-10 opacity-0"
                                                : "translate-x-full z-0 opacity-0"
                                            }`}
                                    />
                                ))}
                            </div>
                            {/* Accent gold overlay border inside image */}
                            <div className="absolute inset-4 border border-[#C9A96E]/20 rounded-lg pointer-events-none z-20"></div>
                        </div>

                        {/* FLOATING GLASS CARDS */}
                        {/* Card 1: Revenue (Top Right) */}
                        <div className="absolute -top-3 right-2 md:-top-4 md:-right-4 lg:-right-8 bg-white/90 backdrop-blur-md border border-white rounded-xl p-2 md:p-3.5 shadow-lg flex items-center gap-2 md:gap-3 transform hover:translate-y-[-2px] transition-transform duration-300 z-30 scale-90 md:scale-100 origin-top-right">
                            <div className="p-1.5 md:p-2 bg-[#C9A96E]/10 rounded-lg">
                                <FiTrendingUp className="text-[#C9A96E] w-3.5 h-3.5 md:w-4 md:h-4" />
                            </div>
                            <div>
                                <p className="text-[9px] md:text-[10px] text-[#6B7280] uppercase tracking-wider font-semibold">Weekly Revenue</p>
                                <p className="text-xs md:text-sm font-bold text-[#111827]">₹8.42 Lakhs</p>
                            </div>
                        </div>

                        {/* Card 2: Orders (Bottom Left) */}
                        <div className="absolute -bottom-3 left-2 md:-bottom-4 md:-left-4 lg:-left-8 bg-white/90 backdrop-blur-md border border-white rounded-xl p-2 md:p-3.5 shadow-lg flex items-center gap-2 md:gap-3 transform hover:translate-y-[-2px] transition-transform duration-300 z-30 scale-90 md:scale-100 origin-bottom-left">
                            <div className="p-1.5 md:p-2 bg-[#111111]/5 rounded-lg">
                                <FaShoppingBag className="text-[#111111] w-3.5 h-3.5 md:w-4 md:h-4" />
                            </div>
                            <div>
                                <p className="text-[9px] md:text-[10px] text-[#6B7280] uppercase tracking-wider font-semibold">Pending Orders</p>
                                <p className="text-xs md:text-sm font-bold text-[#111827]">1,248 Items</p>
                            </div>
                        </div>

                        {/* Card 3: Customers (Bottom Right) */}
                        <div className="absolute -bottom-3 right-2 md:-bottom-8 md:right-6 lg:right-12 bg-white/90 backdrop-blur-md border border-white rounded-xl p-2 md:p-3.5 shadow-lg flex items-center gap-2 md:gap-3 transform hover:translate-y-[-2px] transition-transform duration-300 z-30 scale-90 md:scale-100 origin-bottom-right">
                            <div className="p-1.5 md:p-2 bg-emerald-500/10 rounded-lg">
                                <FaUsers className="text-emerald-600 w-3.5 h-3.5 md:w-4 md:h-4" />
                            </div>
                            <div>
                                <p className="text-[9px] md:text-[10px] text-[#6B7280] uppercase tracking-wider font-semibold">Active Customers</p>
                                <p className="text-xs md:text-sm font-bold text-[#111827]">12.5k Loyal</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Info */}
                <div className="relative z-10 flex items-center gap-2 text-xs text-[#6B7280]">
                    <FiShield className="text-[#C9A96E] w-4 h-4" />
                    <span>Authorized Administrative Core Interface</span>
                </div>
            </div>

            {/* RIGHT SECTION (50% on desktop) - Clean Modern Login Form */}
            <div className="w-full md:w-[50%] bg-[#F8F7F4] py-12 md:py-0 p-6 md:p-12 lg:p-0 flex items-center justify-center relative">
                {/* Accent glow on form background */}
                <div className="absolute top-[-10%] right-[-10%] w-[300px] h-[300px] rounded-full bg-[#C9A96E]/5 blur-[80px] pointer-events-none"></div>

                <div className="w-full max-w-lg">
                    {/* Centered Luxury Login Card */}
                    <div className="bg-white border border-[#E5E7EB] rounded-[24px] shadow-2xl p-6 md:p-10 lg:p-12 relative overflow-hidden h-auto">

                        {/* Logo Section */}
                        <div className="text-center mb-6">
                            <div className="inline-block mb-4">
                                <img src={logo} alt="Kundrat Logo" className="h-12 w-auto object-contain mx-auto" />
                            </div>

                            <h2 className="text-xl font-bold text-[#111827]">Welcome Back</h2>
                            <p className="text-xs text-[#6B7280] mt-1">Sign in to continue to your dashboard</p>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
                            {/* Email Address */}
                            <div className="space-y-1">
                                <label className="block text-sm font-bold text-[#6B7280]">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    placeholder="admin@kundrat.com"
                                    className="w-full px-3.5 py-2.5 bg-[#FAF9F6] border border-[#E5E7EB] rounded-lg text-sm text-[#111827] placeholder-gray-400 outline-none transition-all duration-300"
                                />
                            </div>

                            {/* Password */}
                            <div className="space-y-1">
                                <div className="flex justify-between items-center">
                                    <label className="block text-sm font-bold text-[#6B7280]">
                                        Password
                                    </label>
                                </div>
                                <div className="relative">
                                    <input
                                        type={passwordVisible ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        placeholder="••••••••"
                                        className="w-full px-3.5 py-2.5 bg-[#FAF9F6] border border-[#E5E7EB] rounded-lg text-sm text-[#111827] placeholder-gray-400 outline-none transition-all duration-300 pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setPasswordVisible(!passwordVisible)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-[#111827] transition-colors duration-200 cursor-pointer"
                                    >
                                        {passwordVisible ? <FaRegEyeSlash size={15} /> : <FaRegEye size={15} />}
                                    </button>
                                </div>
                            </div>

                            {/* Remember me & Forgot password */}
                            {/* <div className="flex items-center justify-between pt-1">
                                <label className="flex items-center cursor-pointer select-none">
                                    <input
                                        type="checkbox"
                                        className="w-4 h-4 rounded border-gray-300 text-[#111111] focus:ring-[#C9A96E] focus:ring-offset-0"
                                    />
                                    <span className="ml-2 text-xs text-[#6B7280] hover:text-[#111827] transition-colors">Remember me</span>
                                </label>
                                <button type="button" className="text-xs font-semibold text-[#C9A96E] hover:text-[#b09059] transition-colors duration-200 cursor-pointer">
                                    Forgot password?
                                </button>
                            </div> */}

                            {/* Sign In Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="relative w-full mt-4 py-3 px-4 rounded-lg font-bold text-sm tracking-wider transition-all duration-300 bg-[#111111] hover:bg-black text-white cursor-pointer shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <div className="relative flex items-center justify-center">
                                    {loading ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            <span>Signing In...</span>
                                        </>
                                    ) : (
                                        <span>Sign In</span>
                                    )}
                                </div>
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
