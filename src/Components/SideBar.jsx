import { useState } from "react";
import { User, Package, Menu, X, LogOut, AlertTriangle } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { userInfo } from "../Variable";

const SideBar = ({ onMenuChange = () => { } }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const user = userInfo();

  const activeMenu =
    location.pathname === "/myinfo"
      ? "info"
      : location.pathname === "/myorders" || location.pathname.startsWith("/orderdetails")
        ? "orders"
        : "";

  const breadcrumbLabel =
    activeMenu === "orders"
      ? "My Orders"
      : activeMenu === "info"
        ? "Personal Info"
        : "";

  const handleMenuClick = (menu) => {
    onMenuChange(menu);

    if (menu === "info") navigate("/myinfo");
    else if (menu === "orders") navigate("/myorders");

    setIsOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("GlamGait");
    navigate("/");
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden px-5 py-4 flex justify-between items-center shadow-sm sticky top-0 z-20">
        <h1 className="text-lg font-semibold text-gray-900">My Account</h1>
        <button onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`${isOpen ? "block" : "hidden"
          } md:block md:min-h-screen w-full p-6 md:p-8 font-inter sticky top-0 z-40 transition-all duration-300`}
      >
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start gap-3 mb-2">
            <div className="w-1.5 h-8 bg-[#004534] rounded-full mt-0.5"></div>
            <div>
              <h1 className="text-2xl font-semibold text-[#1a1a1a]">
                Hello {user?.first_name}
              </h1>
              <p className="text-base text-[#807D7E] mt-1">Welcome to your Account</p>
            </div>
          </div>
        </div>

        {/* Menu */}
        <div className="flex flex-col space-y-3">
          {/* My Orders */}
          <button
            onClick={() => handleMenuClick("orders")}
            className={`flex items-center gap-3 w-full text-left py-3.5 px-5 rounded-lg transition-all relative group cursor-pointer ${activeMenu === "orders"
              ? "bg-[#f5f5f5] text-[#1a1a1a] shadow-sm"
              : "text-gray-600 hover:text-[#1a1a1a] hover:bg-gray-100/50"
              }`}
          >
            {activeMenu === "orders" && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#004534] rounded-r-full"></div>
            )}
            <Package size={22} strokeWidth={activeMenu === "orders" ? 2 : 1.5} className={activeMenu === "orders" ? "text-[#004534]" : "text-gray-500"} />
            <span className={`font-medium ${activeMenu === "orders" ? "text-[#1a1a1a]" : ""}`}>My orders</span>
          </button>


          {/* My Info */}
          <button
            onClick={() => handleMenuClick("info")}
            className={`flex items-center gap-3 w-full text-left py-3.5 px-5 rounded-lg transition-all relative group cursor-pointer ${activeMenu === "info"
              ? "bg-[#f5f5f5] text-[#1a1a1a] shadow-sm"
              : "text-gray-600 hover:text-[#1a1a1a] hover:bg-gray-100/50"
              }`}
          >
            {activeMenu === "info" && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#004534] rounded-r-full"></div>
            )}
            <User size={22} strokeWidth={activeMenu === "info" ? 2 : 1.5} className={activeMenu === "info" ? "text-[#004534]" : "text-gray-500"} />
            <span className={`font-medium ${activeMenu === "info" ? "text-[#1a1a1a]" : ""}`}>My info</span>
          </button>

          {/* Logout */}
          <button
            className="flex items-center gap-3 w-full text-left py-3.5 px-5 rounded-lg transition-all text-red-600 hover:bg-red-50 cursor-pointer"
            onClick={() => setShowLogoutModal(true)}
          >
            <LogOut size={22} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>
      {showLogoutModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white rounded-xl p-6 w-80 text-center space-y-4">
            <AlertTriangle className="mx-auto text-red-500" size={40} />
            <h2 className="text-lg font-semibold text-gray-900">
              Are you sure you want to logout?
            </h2>
            <div className="flex justify-between gap-4 mt-4">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 py-2 px-4 bg-gray-200 rounded-md text-gray-700 hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 py-2 px-4 bg-red-600 rounded-md text-white hover:bg-red-700 transition-colors"
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
