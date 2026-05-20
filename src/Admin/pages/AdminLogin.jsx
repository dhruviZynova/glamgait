import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../Axios/axios";
import { ApiURL } from "../../Variable";
import toast from "react-hot-toast";
import { FaRegEye, FaRegEyeSlash, FaShieldAlt, FaLock, FaUser } from "react-icons/fa";
import { HiOutlineMail } from "react-icons/hi";
import { useUser } from "../../Context/UserContext";

const AdminLogin = () => {
    const navigate = useNavigate();
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const { refreshUser } = useUser();

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
                    // Extract specific user data to store in localStorage
                    const userSessionData = {
                        name: userData.name || userData.u_name || '',
                        email: userData.email || '',
                        token: userData.auth_token || '',
                        role: userData.role || '',
                        u_id: userData.u_id || '',
                        // Keep other essential fields for backward compatibility
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
            console.error(err);
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0f1115] flex items-center justify-center p-4 font-sans relative overflow-hidden">
            {/* Animated Background Pattern */}
            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="absolute inset-0">
                    {[...Array(20)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute rounded-full bg-white/5 animate-pulse"
                            style={{
                                width: Math.random() * 100 + 50 + 'px',
                                height: Math.random() * 100 + 50 + 'px',
                                left: Math.random() * 100 + '%',
                                top: Math.random() * 100 + '%',
                                animationDelay: Math.random() * 5 + 's',
                                animationDuration: Math.random() * 3 + 2 + 's'
                            }}
                        />
                    ))}
                </div>
            </div>

            {/* Grid Pattern Overlay */}
            <div
                className="absolute inset-0"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='grid' width='60' height='60' patternUnits='userSpaceOnUse'%3E%3Cpath d='M 60 0 L 0 0 0 60' fill='none' stroke='white' stroke-width='0.5' opacity='0.1'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23grid)' /%3E%3C/svg%3E")`
                }}
            ></div>

            <div className="relative z-20 w-full max-w-md">
                {/* Floating Card with 3D Effect */}
                <div className="relative">
                    {/* Glow Effect */}
                    <div className="absolute -inset-1 bg-amber-500/20 rounded-2xl blur-lg opacity-50"></div>

                    {/* Main Card */}
                    <div className="relative bg-[#1a1d23] backdrop-blur-xl rounded-2xl border border-white/5 shadow-2xl overflow-hidden">
                        {/* Header Accent */}
                        <div className="h-2 bg-amber-500"></div>

                        <div className="p-8">
                            {/* Logo Section with Animation */}
                            <div className="text-center mb-8">
                                <div className="relative inline-block mb-6">
                                    <div className="absolute inset-0 bg-amber-500/30 rounded-2xl blur-xl opacity-50 animate-pulse"></div>
                                    <div className="relative bg-amber-500/50 rounded-2xl p-4 transform hover:scale-110 transition-all duration-300 hover:rotate-3">
                                        <FaShieldAlt className="text-white text-3xl" />
                                    </div>
                                </div>
                                <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">
                                    <span className="text-amber-500">
                                        Admin Portal
                                    </span>
                                </h1>
                                <p className="text-gray-300 text-sm">Secure access to administration dashboard</p>
                            </div>

                            {/* Form with Enhanced Styling */}
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Email Field */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-200 flex items-center">
                                        <HiOutlineMail className="mr-2 h-4 w-4" />
                                        Email Address
                                    </label>
                                    <div className="relative group">
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            placeholder="admin@kundrat.com"
                                            className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all duration-300 hover:bg-white/10 group-hover:border-amber-400/50"
                                        />
                                        <div className="absolute inset-0 rounded-lg bg-amber-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                                    </div>
                                </div>

                                {/* Password Field */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-200 flex items-center">
                                        <FaLock className="mr-2 h-4 w-4" />
                                        Password
                                    </label>
                                    <div className="relative group">
                                        <input
                                            type={passwordVisible ? "text" : "password"}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            placeholder="Enter your password"
                                            className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all duration-300 hover:bg-white/10 group-hover:border-amber-400/50"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setPasswordVisible(!passwordVisible)}
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white focus:outline-none transition-colors duration-200 cursor-pointer"
                                        >
                                            {passwordVisible ? <FaRegEyeSlash size={18} /> : <FaRegEye size={18} />}
                                        </button>
                                        <div className="absolute inset-0 rounded-lg bg-amber-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                                    </div>
                                </div>

                                {/* Additional Options */}
                                <div className="flex items-center justify-between">
                                    <label className="flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="w-4 h-4 bg-white/5 border-white/20 rounded focus:ring-amber-500 focus:ring-2 text-amber-600"
                                        />
                                        <span className="ml-2 text-sm text-gray-300">Remember me</span>
                                    </label>
                                    <button type="button" className="text-sm text-amber-400 hover:text-amber-300 transition-colors duration-200 cursor-pointer">
                                        Forgot password?
                                    </button>
                                </div>

                                {/* Enhanced Login Button */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="relative w-full py-3 px-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-[1.02] bg-amber-600 hover:bg-amber-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:scale-100"
                                >
                                    <div className="relative flex items-center justify-center">
                                        {loading ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                <span className="text-white">Login...</span>
                                            </>
                                        ) : (
                                            <span className="text-white">Login</span>
                                        )}
                                    </div>
                                </button>
                            </form>

                            {/* Footer */}
                            <div className="mt-8 pt-6 border-t border-white/10">
                                <div className="flex items-center justify-between">
                                    <button
                                        onClick={() => navigate("/")}
                                        className="text-sm text-gray-300 hover:text-white transition-colors duration-200 flex items-center cursor-pointer"
                                    >
                                        <span className="mr-1">←</span>
                                        Return to website
                                    </button>
                                    <div className="flex items-center text-xs text-gray-400">
                                        <FaLock className="mr-1" />
                                        SSL Secured
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
