import { useState } from "react";
import { User, Package, Menu, X, LogOut, AlertTriangle } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useUser } from "../Context/UserContext";

const SideBar = ({ onMenuChange = () => { } }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useUser();

  const activeMenu =
    location.pathname === "/myinfo"
      ? "info"
      : location.pathname === "/myorders" || location.pathname.startsWith("/orderdetails")
        ? "orders"
        : "";

  const handleMenuClick = (menu) => {
    onMenuChange(menu);

    if (menu === "info") navigate("/myinfo");
    else if (menu === "orders") navigate("/myorders");

    setIsOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <>
      {/* Mobile Layout */}
      <div className="md:hidden">
        {/* Mobile Header */}
        <div className="flex justify-between items-center sticky top-0 z-20">
          <h1 className="text-lg font-semibold text-gray-900">My Account</h1>
          <button onClick={() => setIsOpen(true)} className="p-1 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
            <Menu size={22} className="text-gray-600" />
          </button>
        </div>

        {/* Mobile Drawer Backdrop */}
        {isOpen && (
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] transition-opacity duration-300"
            onClick={() => setIsOpen(false)}
          />
        )}

        {/* Mobile Drawer */}
        <div
          className={`fixed inset-y-0 right-0 w-72 bg-[#FAF7F2] z-[110] p-6 shadow-2xl transform transition-transform duration-300 ease-in-out font-poppins
            ${isOpen ? "translate-x-0" : "translate-x-full"}`}
        >
          {/* Mobile Drawer Close Button */}
          <div className="flex justify-end mb-4">
            <button onClick={() => setIsOpen(false)} className="p-1.5 rounded-lg hover:bg-gray-200/50 transition-colors cursor-pointer">
              <X size={22} className="text-gray-600" />
            </button>
          </div>

          {/* Header */}
          <div className="mb-8 border-b border-gray-300 pb-6">
            <div className="flex items-start gap-3">
              <div className="w-1 h-10 bg-[#063d32] rounded-full shrink-0"></div>
              <div>
                <h1 className="text-xl font-bold text-[#3C4242] leading-tight capitalize">
                  Hello {user?.first_name || "Guest"}
                </h1>
                <p className="text-xs text-[#807D7E] mt-1 font-medium">Welcome to your Account</p>
              </div>
            </div>
          </div>

          {/* Menu */}
          <div className="flex flex-col space-y-2">
            {/* My Orders */}
            <button
              onClick={() => handleMenuClick("orders")}
              className={`flex items-center gap-3.5 w-full text-left py-3.5 px-5 rounded-2xl transition-all duration-300 relative group cursor-pointer ${activeMenu === "orders"
                ? "bg-[#1E332C] text-white font-medium"
                : "text-[#7A8B99] hover:text-[#1E332C] hover:bg-gray-50/50 font-medium"
                }`}
            >
              <Package
                size={20}
                strokeWidth={activeMenu === "orders" ? 2.5 : 2}
                className={activeMenu === "orders" ? "text-white" : "text-[#7A8B99] group-hover:text-[#1E332C] transition-colors"}
              />
              <span>My Orders</span>
            </button>

            {/* My Info */}
            <button
              onClick={() => handleMenuClick("info")}
              className={`flex items-center gap-3.5 w-full text-left py-3.5 px-5 rounded-2xl transition-all duration-300 relative group cursor-pointer ${activeMenu === "info"
                ? "bg-[#1E332C] text-white font-medium"
                : "text-[#7A8B99] hover:text-[#1E332C] hover:bg-gray-50/50 font-medium"
                }`}
            >
              <User
                size={20}
                strokeWidth={activeMenu === "info" ? 2.5 : 2}
                className={activeMenu === "info" ? "text-white" : "text-[#7A8B99] group-hover:text-[#1E332C] transition-colors"}
              />
              <span>My Info</span>
            </button>

            {/* Logout */}
            <button
              className="flex items-center gap-3.5 w-full text-left py-3.5 px-5 rounded-2xl transition-all duration-300 text-red-500 hover:bg-red-50/50 hover:text-red-600 font-medium cursor-pointer"
              onClick={() => setShowLogoutModal(true)}
            >
              <LogOut size={20} strokeWidth={2} className="text-red-500 group-hover:text-red-600 transition-colors" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:block h-fit font-poppins sticky top-24 z-40">
        {/* Header */}
        <div className="mb-8 border-b border-gray-300 pb-6">
          <div className="flex items-start gap-3">
            <div className="w-1 h-10 bg-[#063d32] rounded-full shrink-0"></div>
            <div>
              <h1 className="text-xl font-bold text-[#3C4242] leading-tight capitalize">
                Hello {user?.first_name || "Guest"}
              </h1>
              <p className="text-xs text-[#807D7E] mt-1 font-medium">Welcome to your Account</p>
            </div>
          </div>
        </div>

        {/* Menu */}
        <div className="flex flex-col space-y-2">
          {/* My Orders */}
          <button
            onClick={() => handleMenuClick("orders")}
            className={`flex items-center gap-3.5 w-full text-left py-3.5 px-5 rounded-2xl transition-all duration-300 relative group cursor-pointer ${activeMenu === "orders"
              ? "bg-[#1E332C] text-white font-medium"
              : "text-[#7A8B99] hover:text-[#1E332C] hover:bg-gray-50/50 font-medium"
              }`}
          >
            <Package
              size={20}
              strokeWidth={activeMenu === "orders" ? 2.5 : 2}
              className={activeMenu === "orders" ? "text-white" : "text-[#7A8B99] group-hover:text-[#1E332C] transition-colors"}
            />
            <span>My Orders</span>
          </button>

          {/* My Info */}
          <button
            onClick={() => handleMenuClick("info")}
            className={`flex items-center gap-3.5 w-full text-left py-3.5 px-5 rounded-2xl transition-all duration-300 relative group cursor-pointer ${activeMenu === "info"
              ? "bg-[#1E332C] text-white font-medium"
              : "text-[#7A8B99] hover:text-[#1E332C] hover:bg-gray-50/50 font-medium"
              }`}
          >
            <User
              size={20}
              strokeWidth={activeMenu === "info" ? 2.5 : 2}
              className={activeMenu === "info" ? "text-white" : "text-[#7A8B99] group-hover:text-[#1E332C] transition-colors"}
            />
            <span>My Info</span>
          </button>

          {/* Logout */}
          <button
            className="flex items-center gap-3.5 w-full text-left py-3.5 px-5 rounded-2xl transition-all duration-300 text-red-500 hover:bg-red-50/50 hover:text-red-600 font-medium cursor-pointer"
            onClick={() => setShowLogoutModal(true)}
          >
            <LogOut size={20} strokeWidth={2} className="text-red-500 group-hover:text-red-600 transition-colors" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {showLogoutModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-[#00000060] backdrop-blur-sm z-[200] transition-all duration-300">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 shadow-xl border border-gray-100 flex flex-col items-center text-center animate-in fade-in zoom-in duration-200">
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-500 mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-[#3C4242] mb-2">
              Confirm Logout
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              Are you sure you want to sign out of your account?
            </p>
            <div className="flex gap-3 w-full">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-red-600 text-white hover:bg-red-700 transition-colors cursor-pointer shadow-sm shadow-red-100"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SideBar;
