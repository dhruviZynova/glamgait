import React, { useState } from "react";
import longlight2 from "../assets/images/longlight2.png";
import loginbgimg from "../assets/images/loginbgimg.png";
import { useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "../Axios/axios";
import { ApiURL } from "../Variable";
import toast from "react-hot-toast";
import BrandBanner from "./BrandBanner";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      // Assuming there's a reset password endpoint
      const response = await axiosInstance.post(`${ApiURL}/auth/reset-password`, {
        newPassword: password,
        confirmNewPassword: confirmPassword,
      });

      if (response.data.status === 1) {
        toast.success(response.data.description || "Password reset successfully");
        setTimeout(() => {
          navigate("/login", { state: { from } });
        }, 2000);
      } else {
        toast.error(response.data.description || "Failed to reset password");
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
        {/* Reset Password Card */}
        <div className="relative z-20 w-full max-w-5xl rounded-xl flex flex-col md:flex-row min-h-auto">

          {/* Left Side: Form */}
          <div className="w-full bg-white/50 backdrop-blur-sm md:w-1/2 p-6 lg:p-12 flex flex-col justify-center bg-white rounded-t-xl md:rounded-tr-none md:rounded-l-xl z-10">
            <div className="mt-4">
              <h1 className="text-3xl font-bold text-[#1A2C2C] mb-2">Set New Password</h1>
              <p className="text-sm text-gray-500 mb-8">
                Your new password must be different from previously used passwords.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* New Password */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-700 block">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={passwordVisible ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      autoComplete="new-password"
                      placeholder="••••••••"
                      className="w-full px-4 py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-1 focus:ring-[#1A2C2C] text-sm text-gray-600 placeholder-gray-400"
                    />
                    <button
                      type="button"
                      onClick={() => setPasswordVisible(!passwordVisible)}
                      className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#1A2C2C] transition-colors"
                    >
                      {passwordVisible ? <FaRegEyeSlash size={18} /> : <FaRegEye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-700 block">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={confirmPasswordVisible ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      autoComplete="new-password"
                      placeholder="••••••••"
                      className="w-full px-4 py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-1 focus:ring-[#1A2C2C] text-sm text-gray-600 placeholder-gray-400"
                    />
                    <button
                      type="button"
                      onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                      className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#1A2C2C] transition-colors"
                    >
                      {confirmPasswordVisible ? <FaRegEyeSlash size={18} /> : <FaRegEye size={18} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#1A2C2C] text-white py-4 rounded-full font-bold text-lg hover:bg-opacity-90 transition-all duration-300 mt-4 shadow-lg cursor-pointer"
                >
                  <span className="relative z-10 flex items-center justify-center">
                    {loading ? (
                      <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      "Reset Password"
                    )}
                  </span>
                </button>
              </form>

              <div className="mt-8 text-center">
                <button
                  onClick={() => navigate("/login", { state: { from } })}
                  className="text-xs text-gray-500 hover:underline underline-offset-4 cursor-pointer"
                >
                  Back to Login
                </button>
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

export default ResetPassword;
