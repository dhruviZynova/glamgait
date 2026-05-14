// src/pages/Register.jsx
import React, { useState } from "react";
import longlight2 from "../assets/images/longlight2.png";
import loginbgimg from "../assets/images/loginbgimg.png";
import { useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "../Axios/axios";
import toast from "react-hot-toast";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import BrandBanner from "./BrandBanner";

const Register = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validatePassword = (password) => {
    if (password.length < 8) return "Password must be at least 8 characters";
    if (!/[A-Z]/.test(password)) return "Password must contain at least one uppercase letter";
    if (!/[0-9]/.test(password)) return "Password must contain at least one number";
    return null;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { first_name, last_name, email, password } = formData;
    if (!first_name || !last_name || !email || !password) {
      toast.error("Please fill all fields");
      setLoading(false);
      return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      toast.error(passwordError);
      setLoading(false);
      return;
    }

    try {
      const response = await axiosInstance.post("/userregister", formData);
      if (response.data.status === 1) {
        toast.success("Registration Successful!");
        navigate("/login", { state: { from } });
      } else {
        toast.error(response.data.message || "Registration failed");
      }
    } catch (error) {
      toast.error(error?.description || error?.message || "An error occurred during registration");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="w-full pt-6 pb-24 px-4 sm:px-6 md:px-12 lg:px-20 flex items-center justify-center overflow-hidden font-sans relative">

        {/* Register Card */}
        <div className="relative z-20 w-full max-w-6xl mx-2 sm:mx-4 rounded-xl flex flex-col md:flex-row min-h-auto">

          {/* Left Side: Register Form */}
          <div className="w-full bg-white/50 backdrop-blur-sm md:w-1/2 p-6 sm:p-8 lg:p-12 flex flex-col justify-center rounded-xl md:rounded-tr-none md:rounded-l-xl z-10 border border-white/20">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#1A2C2C] mb-2 text-center md:text-left">Create Account</h1>
            <p className="text-xs sm:text-sm text-gray-500 mb-6 sm:mb-8 text-center md:text-left">
              Already Have An Account? <span onClick={() => navigate("/login", { state: { from } })} className="text-[#1A2C2C] font-semibold underline cursor-pointer">Log In</span>
            </p>

            <form className="space-y-3 sm:space-y-4" onSubmit={handleRegister}>
              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-medium text-gray-700 block">First Name</label>
                <input
                  type="text"
                  name="first_name"
                  placeholder="First Name"
                  value={formData.first_name}
                  onChange={handleChange}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-1 focus:ring-[#1A2C2C] text-xs sm:text-sm text-gray-600 placeholder-gray-400"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-medium text-gray-700 block">Last Name</label>
                <input
                  type="text"
                  name="last_name"
                  placeholder="Last Name"
                  value={formData.last_name}
                  onChange={handleChange}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-1 focus:ring-[#1A2C2C] text-xs sm:text-sm text-gray-600 placeholder-gray-400"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-medium text-gray-700 block">Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-1 focus:ring-[#1A2C2C] text-xs sm:text-sm text-gray-600 placeholder-gray-400"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-medium text-gray-700 block">Password</label>
                <div className="relative">
                  <input
                    type={passwordVisible ? "text" : "password"}
                    name="password"
                    placeholder="Min 8 chars, 1 uppercase, 1 number"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-1 focus:ring-[#1A2C2C] text-xs sm:text-sm text-gray-600 placeholder-gray-400"
                  />
                  <button
                    type="button"
                    className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => setPasswordVisible(!passwordVisible)}
                  >
                    {passwordVisible ? <FaRegEyeSlash size={16} /> : <FaRegEye size={16} />}
                  </button>
                </div>
                <p className="text-[10px] text-gray-400 pl-2">Min 8 characters, 1 uppercase letter &amp; 1 number required</p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#1A2C2C] text-white py-3 sm:py-4 rounded-full font-bold text-sm sm:text-lg hover:bg-opacity-90 transition-all duration-300 mt-3 sm:mt-4 shadow-lg disabled:bg-gray-400 cursor-pointer"
              >
                {loading ? "Registering..." : "Register"}
              </button>
            </form>

            <p className="text-[12px] text-center text-gray-500 mt-6 leading-relaxed px-2">
              By clicking Register you agree to <span className="underline cursor-pointer">Terms & Conditions</span> and <span className="underline cursor-pointer">Privacy Policy</span>.
            </p>
          </div>

          {/* Right Side: Mosque Image (Overflowing bottom) */}
          <div className="hidden md:block w-full md:w-1/2 relative min-h-[400px] md:min-h-auto flex items-stretch overflow-visible">
            <img
              src={loginbgimg}
              alt="Mosque Illustration"
              className="md:absolute top-0 right-0 w-full h-[105%] md:h-[115%] object-cover md:object-top rounded-b-xl md:rounded-bl-none md:rounded-r-xl z-0"
            />
          </div>
        </div>
      </div>

      <div className="relative">
        {/* Background Lantern */}
        <div className="absolute left-0 right-24 top-16 z-30 h-full flex flex-col justify-end pointer-events-none">
          <img
            src={longlight2}
            alt="Lantern Decoration"
            className="w-96 md:w-94 lg:w-lg object-contain -ml-20 scale-x-[-1]"
          />
        </div>

        <BrandBanner />
      </div>
    </>
  );
};

export default Register;
