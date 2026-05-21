import React, { useState } from "react";
import longlight2 from "../assets/images/longlight2.png";
import loginbgimg from "../assets/images/loginbgimg.png";
import { useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "../Axios/axios";
import { ApiURL } from "../Variable";
import toast from "react-hot-toast";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa"; // Importing eye icons if available, otherwise will fallback
import BrandBanner from "./BrandBanner";
import { useUser } from "../Context/UserContext";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { refreshUser } = useUser();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    try {
      setSubmitting(true);
      const response = await axiosInstance.post(`${ApiURL}/userlogin`, {
        email,
        password,
      });

      if (response.data.status === 1) {
        const userData = response.data.data;

        // Extract specific user data to store in localStorage
        const userSessionData = {
          ...userData
        };

        try {
          sessionStorage.setItem("GlamGait", JSON.stringify(userSessionData));
          refreshUser();
        } catch (error) {
          console.error("Error storing data in sessionStorage:", error);
        }

        toast.success(response.data.description);
        const localCart = JSON.parse(localStorage.getItem("localCart") || "[]");
        const localWishlist = JSON.parse(localStorage.getItem("localWishlist") || "[]");

        if (localCart.length > 0) {
          try {
            await Promise.all(localCart.map(item =>
              axiosInstance.post(
                `${ApiURL}/createcart`,
                {
                  p_id: item.p_id,
                  pcolor_id: item.pcolor_id,
                  psize_id: item.psize_id || null,
                  quantity: item.quantity || 1,
                  u_id: userData.u_id,
                  guest_id: null
                },
                { headers: { Authorization: `Bearer ${userData.auth_token}` } }
              )
            ));
            // localStorage.removeItem("localCart"); // Persist local cart
          } catch (error) {
            console.error("Local cart sync failed:", error);
          }
        }

        if (localWishlist.length > 0) {
          try {
            await Promise.all(localWishlist.map(item =>
              axiosInstance.post(
                `${ApiURL}/addtowishlist`,
                {
                  p_id: item.p_id,
                  sc_id: item.sc_id || null,
                  pcolor_id: item.pcolor_id,
                  psize_id: item.psize_id || null,
                  u_id: userData.u_id,
                  guest_id: null
                },
                { headers: { Authorization: `Bearer ${userData.auth_token}` } }
              )
            ));
            // localStorage.removeItem("localWishlist"); // Persist local wishlist
          } catch (error) {
            console.error("Local wishlist sync failed:", error);
          }
        }

        // Redirection Hardening: Ensure 'from' is a safe relative path
        const safeFrom = (from && from.startsWith('/') && !from.startsWith('//')) ? from : "/";
        navigate(safeFrom, { replace: true });

        setEmail("");
        setPassword("");
      } else {
        toast.error(response.data.description || "Invalid email or password");
      }
    } catch (err) {
      toast.error(err?.description || err?.message || "Invalid email or password");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="w-full pt-16 pb-16 px-4 md:px-12 lg:px-20 flex items-center justify-center font-sans">
        {/* Login Card */}
        <div className="relative z-20 w-full max-w-5xl rounded-xl flex flex-col md:flex-row min-h-auto">
          {/* Left Side: Login Form */}
          <div className="w-full bg-white/50 backdrop-blur-sm md:w-1/2 p-6 lg:p-12 flex flex-col justify-center bg-white rounded-t-xl md:rounded-tr-none md:rounded-l-xl z-10">
            <h1 className="text-3xl font-bold text-[#1A2C2C] mb-2">Login</h1>
            <p className="text-sm text-gray-500 mb-8">
              Do not have an account, <span onClick={() => navigate("/register", { state: { from } })} className="underline cursor-pointer">create a new one.</span>
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 block">
                  Enter Your Email Or Phone
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="michael.joe@xmail.com"
                  className="w-full px-4 py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-1 focus:ring-[#1A2C2C] text-sm text-gray-600 placeholder-gray-400"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 block">
                  Enter Your Password
                </label>
                <div className="relative">
                  <input
                    type={passwordVisible ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••"
                    className="w-full px-4 py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-1 focus:ring-[#1A2C2C] text-sm text-gray-600 placeholder-gray-400"
                  />
                  <button
                    type="button"
                    onClick={() => setPasswordVisible(!passwordVisible)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    {passwordVisible ? <FaRegEyeSlash size={18} /> : <FaRegEye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-[#1A2C2C] text-white py-4 rounded-full font-bold text-lg hover:bg-opacity-90 transition-all duration-300 mt-4 shadow-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "Login..." : "Login"}
              </button>
            </form>

            <div className="mt-8 text-center">
              <button
                onClick={() => navigate("/forgot-password", { state: { from } })}
                className="text-xs text-gray-500 hover:underline underline-offset-4 cursor-pointer"
              >
                Forgot Your Password
              </button>
            </div>
          </div>

          {/* Right Side: Mosque Image (Overflowing bottom) */}
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

export default Login;
