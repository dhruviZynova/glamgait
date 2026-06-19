import React, { useState, useEffect } from "react";
import longlight2 from "../assets/images/longlight2.png";
import loginbgimg from "../assets/images/loginbgimg.png";
import { useNavigate, useLocation } from "react-router-dom";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import BrandBanner from "./BrandBanner";
import { Loader2 } from "lucide-react";
import { useLogin } from "../hooks/useAuth";
import { useUser } from "../Context/UserContext";
import ScrollReveal from "./Ui/ScrollReveal";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Persist 'from' in sessionStorage so it survives any re-renders or context updates
  const from = location.state?.from || sessionStorage.getItem("redirectAfterLogin") || "/";

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pendingRedirect, setPendingRedirect] = useState(false);

  const loginMutation = useLogin();
  const submitting = loginMutation.isPending;
  const { user } = useUser();

  // Save redirect target before login attempt so it's not lost
  useEffect(() => {
    if (from && from !== "/") {
      sessionStorage.setItem("redirectAfterLogin", from);
    }
  }, [from]);

  // Watch user context — navigate only after user is actually set
  useEffect(() => {
    if (pendingRedirect && user?.u_id) {
      const target = sessionStorage.getItem("redirectAfterLogin") || "/";
      // Safety: only allow relative paths
      const safeTarget =
        target.startsWith("/") && !target.startsWith("//") ? target : "/";
      sessionStorage.removeItem("redirectAfterLogin");
      setPendingRedirect(false);
      navigate(safeTarget, { replace: true });
    }
  }, [user, pendingRedirect, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (submitting) return;

    loginMutation.mutate(
      { email, password },
      {
        onSuccess: () => {
          setEmail("");
          setPassword("");
          // Signal that we want to redirect — actual navigation happens
          // in the useEffect above once user context is populated
          setPendingRedirect(true);
        },
      }
    );
  };

  return (
    <>
      <div className="w-full pt-16 pb-16 px-4 md:px-12 lg:px-20 flex items-center justify-center font-poppins">
        {/* Login Card */}
        <ScrollReveal
          animation="fade-up"
          duration={800}
          className="relative z-20 w-full max-w-5xl rounded-xl flex flex-col md:flex-row min-h-auto"
        >
          {/* Left Side: Login Form */}
          <div className="w-full bg-white/50 backdrop-blur-sm md:w-1/2 p-6 lg:p-12 flex flex-col justify-center bg-white shadow-lg rounded-t-xl md:rounded-tr-none md:rounded-l-xl z-10">
            <h1 className="text-3xl font-bold text-[#1A2C2C] mb-2 font-poppins">
              Login
            </h1>

            <p className="text-sm text-gray-500 mb-8">
              Don't have an account,{" "}
              <span
                onClick={() => navigate("/register", { state: { from } })}
                className="underline cursor-pointer text-[#1A2C2C] font-medium"
              >
                create a new one.
              </span>
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 block">
                  Enter Your Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="off"
                  placeholder="michael.joe@xmail.com"
                  className="w-full px-4 py-3 border border-gray-200 rounded-full focus:outline-none text-sm text-gray-600 placeholder-gray-400"
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
                    autoComplete="off"
                    placeholder="••••••"
                    className="w-full px-4 py-3 border border-gray-200 rounded-full focus:outline-none text-sm text-gray-600 placeholder-gray-400"
                  />
                  <button
                    type="button"
                    onClick={() => setPasswordVisible(!passwordVisible)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    {passwordVisible ? (
                      <FaRegEyeSlash size={18} />
                    ) : (
                      <FaRegEye size={18} />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-[#1A2C2C] text-white py-4 rounded-full font-bold text-lg hover:bg-opacity-90 transition-all duration-300 mt-4 shadow-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {submitting && <Loader2 size={18} className="animate-spin" />}
                {submitting ? "Logging in..." : "Login"}
              </button>
            </form>

            <div className="mt-8 text-center">
              <button
                onClick={() => navigate("/forgot-password", { state: { from } })}
                className="text-xs text-[#1A2C2C] font-medium underline cursor-pointer"
              >
                Forgot Password?
              </button>
            </div>
          </div>

          {/* Right Side: Background Image */}
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

export default Login;