import React, { useState } from "react";
import longlight2 from "../assets/images/longlight2.png";
import loginbgimg from "../assets/images/loginbgimg.png";
import longlight from "../assets/images/longlight.webp";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { resetPassword } from "../api/user";
import toast from "react-hot-toast";
import BrandBanner from "./BrandBanner";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import ScrollReveal from "./Ui/ScrollReveal";

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = useParams();
  const from = location.state?.from || "/";
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setConfirmPasswordError("");

    let isValid = true;

    if (!password) {
      setPasswordError("Password is required");
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters long");
      isValid = false;
    }

    if (!confirmPassword) {
      setConfirmPasswordError("Confirm password is required");
      isValid = false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
      isValid = false;
    }

    if (!isValid) return;

    if (loading) return;
    setLoading(true);

    try {
      const data = await resetPassword(token, password);

      if (data && (data.status === 1 || data.success === true)) {
        toast.success(data.description || data.message || "Password reset successfully");
        setPassword("");
        setConfirmPassword("");
        setTimeout(() => {
          navigate("/login", { state: { from } });
        }, 2000);
      } else {
        toast.error(data?.description || data?.message || "Failed to reset password");
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

        {/* Reset Password Card */}
        <ScrollReveal animation="fade-up" duration={800} className="relative z-20 w-full max-w-5xl rounded-xl flex flex-col md:flex-row min-h-auto">

          {/* Left Side: Form */}
          <div className="w-full bg-white/50 backdrop-blur-sm md:w-1/2 p-6 lg:p-12 flex flex-col justify-center bg-white shadow-lg rounded-t-xl md:rounded-tr-none md:rounded-l-xl z-10">
            <div className="mt-4">
              <h1 className="text-3xl font-bold text-[#1A2C2C] mb-2 font-poppins">Set New Password</h1>
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
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (passwordError) setPasswordError("");
                      }}
                      required
                      autoComplete="new-password"
                      placeholder="••••••••"
                      className={`w-full px-4 py-3 border ${passwordError ? "border-red-500" : "border-gray-200"} rounded-full focus:outline-none focus:ring-1 focus:ring-[#1A2C2C] text-sm text-gray-600 placeholder-gray-400`}
                    />
                    <button
                      type="button"
                      onClick={() => setPasswordVisible(!passwordVisible)}
                      className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#1A2C2C] transition-colors"
                    >
                      {passwordVisible ? <FaRegEyeSlash size={18} /> : <FaRegEye size={18} />}
                    </button>
                  </div>
                  {passwordError && (
                    <p className="text-xs text-red-500 mt-1 pl-2 font-poppins">{passwordError}</p>
                  )}
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
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        if (confirmPasswordError) setConfirmPasswordError("");
                      }}
                      required
                      autoComplete="new-password"
                      placeholder="••••••••"
                      className={`w-full px-4 py-3 border ${confirmPasswordError ? "border-red-500" : "border-gray-200"} rounded-full focus:outline-none focus:ring-1 focus:ring-[#1A2C2C] text-sm text-gray-600 placeholder-gray-400`}
                    />
                    <button
                      type="button"
                      onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                      className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#1A2C2C] transition-colors"
                    >
                      {confirmPasswordVisible ? <FaRegEyeSlash size={18} /> : <FaRegEye size={18} />}
                    </button>
                  </div>
                  {confirmPasswordError && (
                    <p className="text-xs text-red-500 mt-1 pl-2 font-poppins">{confirmPasswordError}</p>
                  )}
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
                  className="text-xs text-[#1A2C2C] font-medium underline cursor-pointer"
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
              className="md:absolute top-0 right-0 w-full h-[105%] md:h-[115%] object-cover md:object-top rounded-b-xl md:rounded-bl-none md:rounded-r-none z-0"
            />
          </div>
        </ScrollReveal>
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
