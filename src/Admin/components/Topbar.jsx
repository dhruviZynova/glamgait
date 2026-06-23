import { Bars3Icon as MenuIcon } from "@heroicons/react/24/outline";
import logo1 from "../../assets/logo1.png";

const Topbar = ({ onMenuClick }) => {
  return (
    <div className="relative z-10 flex-shrink-0 flex h-16 bg-white border-b border-gray-200 items-center justify-between px-4 sm:px-6">
      {/* Left side: Logo - switches based on menu state */}
      <div className="flex items-center">
        <img src={logo1} alt="Glam Gait Logo" className="h-10 w-auto" />
      </div>

      {/* Right side: Mobile menu button */}
      <button
        type="button"
        className="p-2 rounded-md text-gray-500 hover:text-gray-900 focus:outline-none lg:hidden cursor-pointer"
        onClick={onMenuClick}
      >
        <MenuIcon className="h-6 w-6" />
      </button>
    </div>
  );
};

export default Topbar;