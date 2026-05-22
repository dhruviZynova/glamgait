import {
  Bars3Icon as MenuIcon,
  MagnifyingGlassIcon as SearchIcon,
} from "@heroicons/react/24/outline";
import { LogOut } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../Context/UserContext";

const Topbar = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { logout } = useUser();

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  const handleLogoutConfirm = () => {
    handleLogout();
    setIsModalOpen(false);
  };

  return (
    <div className="relative z-10 flex-shrink-0 flex h-16 bg-white border-b border-gray-200">
      {/* Mobile menu button */}
      <button
        type="button"
        className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-black lg:hidden"
        onClick={onMenuClick}
      >
        <span className="sr-only">Open sidebar</span>
        <MenuIcon className="h-6 w-6" />
      </button>

      {/* Search bar */}
      <div className="flex-1 px-4 flex justify-end sm:px-6 lg:px-8">
        {/* <div className="flex-1 flex items-center">
          <div className="w-full flex md:ml-0">
            <div className="relative w-full text-gray-400 focus-within:text-gray-600">
              <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5" />
              </div>
              <input
                id="search"
                name="search"
                className="block w-full h-full pl-8 pr-3 py-2 border-transparent text-gray-900 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-0 focus:border-transparent sm:text-sm"
                placeholder="Search"
                type="search"
              />
            </div>
          </div>
        </div> */}

        <div className="ml-4 flex items-center gap-1.5 md:ml-6">
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="bg-white cursor-pointer flex items-center gap-1.5"
          >
            <LogOut className="h-5 w-5 text-black" />
            <span className="text-sm font-medium bg-white">
              Logout
            </span>
          </button>
        </div>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 sm:p-8 max-w-sm w-full mx-4 sm:mx-0">
            <h1 className="text-lg sm:text-xl font-bold text:gray-900 mb-4">
              Confirm Logout
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mb-6">
              Are you sure you want to logout?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-sm sm:text-base text-gray-700 hover:text-gray-900 border border-gray-300 rounded-md transition-colors duration-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleLogoutConfirm}
                className="px-4 py-2 text-sm sm:text-base bg-black text-white hover:bg-gray-900 rounded-md transition-colors duration-200 cursor-pointer"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Topbar;
