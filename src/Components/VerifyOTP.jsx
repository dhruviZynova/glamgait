import React, { useState, useEffect, useRef } from "react";
import longlight2 from "../assets/images/longlight2.png";
import loginbgimg from "../assets/images/loginbgimg.png";
import { useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "../Axios/axios";
import { ApiURL } from "../Variable";
import toast from "react-hot-toast";
import BrandBanner from "./BrandBanner";
import { FaArrowLeft } from "react-icons/fa";

const VerifyOTP = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";
  const from = location.state?.from || "/";

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(30);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (!email) {
      navigate("/forgot-password");
    }
  }, [email, navigate]);

  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Move to next input if value is entered
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpString = otp.join("");
    if (otpString.length < 6) {
      toast.error("Please enter the complete OTP");
      return;
    }

    setLoading(true);
    try {
      // Assuming there's a verify otp endpoint
      const response = await axiosInstance.post(`${ApiURL}/auth/verify-otp`, {
        otp: otpString,
      });

      if (response.data.status === 1) {
        toast.success(response.data.description || "OTP Verified Successfully");
        navigate("/reset-password", { state: { email, otp: otpString, from } });
      } else {
        toast.error(response.data.description || "Invalid OTP");
      }
    } catch (err) {
      toast.error(err?.description || err?.message || "Error verifying OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (timer > 0) return;

    try {
      const response = await axiosInstance.post(`${ApiURL}/auth/forgot-password`, {
        email,
      });
      if (response.data.status === 1) {
        toast.success("OTP resent successfully");
        setTimer(30);
      } else {
        toast.error(response.data.description || "Failed to resend OTP");
      }
    } catch (err) {
      toast.error(err?.description || err?.message || "Error resending OTP");
    }
  };

  return (
    <>
      <div className="w-full pt-16 pb-16 px-4 md:px-12 lg:px-20 flex items-center justify-center font-sans">
        <div className="relative z-20 w-full max-w-5xl rounded-xl flex flex-col md:flex-row min-h-auto">
          {/* Left Side: OTP Verification */}
          <div className="w-full bg-white/50 backdrop-blur-sm md:w-1/2 p-6 lg:p-12 flex flex-col justify-center bg-white rounded-t-xl md:rounded-tr-none md:rounded-l-xl z-10">
            <div className="absolute top-8 left-8 lg:left-14">
              <button
                onClick={() => navigate("/forgot-password")}
                className="flex items-center justify-start gap-3 pb-4 text-sm font-medium text-gray-400 hover:text-[#1A2C2C] transition-all duration-300 cursor-pointer group"
              >
                <FaArrowLeft className="text-[10px]" />
                Back
              </button>
            </div>

            <div className="pt-8">
              <h1 className="text-3xl font-bold text-[#1A2C2C] mb-2">Verify OTP</h1>
              <p className="text-sm text-gray-500 mb-8">
                We've sent a 6-digit code to <span className="font-semibold text-[#1A2C2C]">{email}</span>. Please enter it below.
              </p>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="flex justify-between gap-1.5 sm:gap-2 max-w-sm mx-auto">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => (inputRefs.current[index] = el)}
                      type="text"
                      maxLength="1"
                      value={digit}
                      onChange={(e) => handleChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className="w-9 h-9 xs:w-10 xs:h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 text-center text-lg sm:text-xl font-bold border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#1A2C2C] text-gray-700 bg-gray-50/50"
                    />
                  ))}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#1A2C2C] text-white py-4 rounded-full font-bold text-lg hover:bg-opacity-90 transition-all duration-300 shadow-lg cursor-pointer flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    "Verify & Proceed"
                  )}
                </button>
              </form>

              <div className="mt-8 text-center">
                <p className="text-[12px] text-center text-gray-500 mt-4 sm:mt-6 leading-relaxed px-2">
                  Didn't receive the code?{" "}
                  <button
                    onClick={handleResend}
                    disabled={timer > 0}
                    className={`font-medium ml-1 transition-all ${timer > 0 ? "text-gray-300 cursor-not-allowed" : "text-[#1A2C2C] hover:underline cursor-pointer"
                      }`}
                  >
                    Resend {timer > 0 && `(${timer}s)`}
                  </button>
                </p>
              </div>
            </div>
          </div>

          {/* Right Side: Image */}
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

export default VerifyOTP;
