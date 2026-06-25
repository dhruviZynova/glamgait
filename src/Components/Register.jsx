// src/pages/Register.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import longlight2 from "../assets/images/longlight2.png";
import loginbgimg from "../assets/images/loginbgimg.png";
import longlight from "../assets/images/longlight.webp";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { FaRegEye, FaRegEyeSlash, FaArrowLeft } from "react-icons/fa";
import BrandBanner from "./BrandBanner";
import { Loader2 } from "lucide-react";
import { useSignup } from "../hooks/useAuth";
import ScrollReveal from "./Ui/ScrollReveal";

const Register = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";

  const signupMutation = useSignup();
  const loading = signupMutation.isPending;

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
    if (loading) return; // prevent duplicate submission

    const { first_name, last_name, email, password } = formData;
    if (!first_name || !last_name || !email || !password) {
      toast.error("Please fill all fields");
      return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      toast.error(passwordError);
      return;
    }

    try {
      await signupMutation.mutateAsync(formData);
      toast.success("Registration Successful!");
      navigate("/login", { state: { from } });
    } catch (error) {
      const errMsg = error.response?.data?.description || error.response?.data?.message || error.message || "An error occurred during registration";
      toast.error(errMsg);
    }
  };

  return (
    <>
      <div className="w-full pt-16 md:pt-36 pb-16 px-4 md:px-12 lg:px-20 flex items-center justify-center font-poppins relative z-10 overflow-hidden">
        {/* Hanging Lantern (Top Right) */}
        <ScrollReveal
          className="absolute -top-8 sm:-top-12 right-2 sm:right-4 md:right-8 lg:right-12 xl:right-16 z-30 pointer-events-none"
          animation="fade-down"
          duration={1200}
        >
          <img
            src={longlight}
            alt="Hanging Lantern"
            className="w-22 sm:w-24 md:w-32 lg:w-44 h-auto drop-shadow-lg"
          />
        </ScrollReveal>

        {/* Register Card */}
        <ScrollReveal animation="fade-up" duration={800} className="relative z-20 w-full max-w-5xl rounded-xl flex flex-col md:flex-row min-h-auto">

          {/* Left Side: Register Form */}
          <div className="w-full bg-white/50 backdrop-blur-sm md:w-1/2 p-6 lg:p-12 flex flex-col justify-center bg-white shadow-lg rounded-t-xl md:rounded-tr-none md:rounded-l-xl z-10">
            <div className="mb-4">
              <button
                onClick={() => navigate("/")}
                className="inline-flex items-center gap-2 text-xs font-medium text-gray-400 hover:text-[#1A2C2C] transition-all cursor-pointer"
              >
                <FaArrowLeft size={10} /> Back to Website
              </button>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#1A2C2C] mb-2 font-poppins">Create Account</h1>
            <p className="text-xs sm:text-sm text-gray-500 mb-6 sm:mb-8">
              Already Have An Account? <span onClick={() => navigate("/login", { state: { from } })} className="text-[#1A2C2C] font-medium underline cursor-pointer">Log In</span>
            </p>

            <form className="space-y-3 sm:space-y-4" onSubmit={handleRegister}>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 block">First Name</label>
                <input
                  type="text"
                  name="first_name"
                  placeholder="First Name"
                  value={formData.first_name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-full focus:outline-none text-sm text-gray-600 placeholder-gray-400"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 block">Last Name</label>
                <input
                  type="text"
                  name="last_name"
                  placeholder="Last Name"
                  value={formData.last_name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-full focus:outline-none text-sm text-gray-600 placeholder-gray-400"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 block">Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-full focus:outline-none text-sm text-gray-600 placeholder-gray-400"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 block">Password</label>
                <div className="relative">
                  <input
                    type={passwordVisible ? "text" : "password"}
                    name="password"
                    placeholder="Min 8 chars, 1 uppercase, 1 number"
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete="off"
                    className="w-full px-4 py-3 border border-gray-200 rounded-full focus:outline-none text-sm text-gray-600 placeholder-gray-400"
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
                className="w-full bg-[#1A2C2C] text-white py-3 sm:py-4 rounded-full font-bold text-sm sm:text-lg hover:bg-opacity-90 transition-all duration-300 mt-3 sm:mt-4 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
              >
                {loading && <Loader2 size={18} className="animate-spin" />}
                {loading ? "Creating Account..." : "Register"}
              </button>
            </form>

            <p className="text-[12px] text-center text-gray-500 mt-6 leading-relaxed px-2">
              By clicking Register you agree to <span className="text-xs text-[#1A2C2C] font-medium underline cursor-pointer">
                <Link to="/terms-and-conditions">Terms & Conditions </Link></span> and <span className="text-xs text-[#1A2C2C] font-medium underline cursor-pointer">
                <Link to="/privacy-policy">Privacy Policy</Link></span>.
            </p>
          </div>

          {/* Right Side: Mosque Image (Overflowing bottom) */}
          <div className="hidden md:block w-full md:w-1/2 relative min-h-[400px] md:min-h-auto flex items-stretch overflow-visible">
            <img
              src={loginbgimg}
              alt="Mosque Illustration"
              className="md:absolute top-0 right-0 w-full h-[105%] md:h-[115%] object-cover md:object-top rounded-b-xl md:rounded-bl-none md:rounded-r-none z-0"
            />
          </div>
        </ScrollReveal>
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
