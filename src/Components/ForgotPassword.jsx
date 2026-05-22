import React, { useState } from "react";
import longlight2 from "../assets/images/longlight2.png";
import loginbgimg from "../assets/images/loginbgimg.png";
import { useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "../Axios/axios";
import { ApiURL } from "../Variable";
import toast from "react-hot-toast";
import BrandBanner from "./BrandBanner";
import { FaArrowLeft } from "react-icons/fa";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axiosInstance.post(`${ApiURL}/auth/forgot-password`, {
        email,
      });

      if (response.data.status === 1) {
        navigate("/verify-otp", {
          state: {
            email: email,
            from: from
          }
        });
        toast.success(response.data.description || "OTP sent to your email");
        setEmail("");
      } else {
        toast.error(response.data.description || "Failed to send reset link");
      }
    } catch (err) {
      const errMsg = err.response?.data?.description || err.response?.data?.message || err.message || "An error occurred. Please try again later.";
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="w-full pt-16 pb-16 px-4 md:px-12 lg:px-20 flex items-center justify-center font-sans">
        {/* Forgot Password Card */}
        <div className="relative z-20 w-full max-w-5xl rounded-xl flex flex-col md:flex-row min-h-auto">

          {/* Left Side: Form */}
          <div className="w-full bg-white/50 backdrop-blur-sm md:w-1/2 p-6 lg:p-12 flex flex-col justify-center bg-white rounded-t-xl md:rounded-tr-none md:rounded-l-xl z-10">
            <div className="absolute top-8 left-8 lg:left-14">
              <button
                onClick={() => navigate("/login", { state: { from } })}
                className="flex items-center justify-start gap-3 pb-4 text-sm font-medium text-gray-400 hover:text-[#1A2C2C] transition-all duration-300 cursor-pointer group"
              >
                <FaArrowLeft className="text-[10px]" />
                Back
              </button>
            </div>

            <div className="pt-8">
              <h1 className="text-3xl font-bold text-[#1A2C2C] mb-2">Forgot Password?</h1>
              <p className="text-sm text-gray-500 mb-8">
                Don't worry! It happens. Please enter the email address associated with your account.
              </p>

              <form onSubmit={handleSubmit} className="space-y-7">
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-700 block">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="e.g. name@example.com"
                    className="w-full px-4 py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-1 focus:ring-[#1A2C2C] text-sm text-gray-600 placeholder-gray-400"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#1A2C2C] text-white py-4 rounded-full font-bold text-lg hover:bg-opacity-90 transition-all duration-300 shadow-lg cursor-pointer"
                >
                  <span className="relative z-10 flex items-center justify-center">
                    {loading ? (
                      <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      "Send Recovery Link"
                    )}
                  </span>
                </button>
              </form>

              <div className="pt-2 text-center">
                <p className="text-[12px] text-center text-gray-500 mt-4 sm:mt-6 leading-relaxed px-2">
                  Remember password?{" "}
                  <span
                    onClick={() => navigate("/login", { state: { from } })}
                    className="text-[#1A2C2C] font-medium hover:underline underline-offset-4 cursor-pointer ml-1 transition-all"
                  >
                    Login now
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Right Side: Visual Section */}
          <div className="w-full md:w-1/2 relative min-h-[400px] md:min-h-auto flex items-stretch">
            <img
              src={loginbgimg}
              alt="Mosque Illustration"
              className="md:absolute top-0 right-0 w-full h-[105%] md:h-[115%] object-cover md:object-top rounded-b-xl md:rounded-bl-none md:rounded-r-xl z-0"
            />
          </div>
        </div>
      </div>

      <div className="relative">
        <div className="absolute left-0 right-24 top-16 z-30 h-full flex flex-col justify-end pointer-events-none">
          <img
            src={longlight2}
            alt="Lantern Decoration"
            className="w-96 md:w-96 lg:w-lg object-contain -ml-20 scale-x-[-1]"
          />
        </div>
        <BrandBanner />
      </div>
    </>
  );
};

export default ForgotPassword;
