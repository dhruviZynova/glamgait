import { NavLink } from "react-router-dom";
import {
  ClipboardList,
  Users,
  Mail,
  X,
  Star,
  Box,
  LayoutDashboard,
  Grid,
  Palette,
  Instagram,
  SlidersHorizontal,
  Grid2X2,
  MegaphoneIcon,
  TicketPercent,
  ListTree,
  Ruler,
} from "lucide-react";
import logo from "../../assets/logo.svg";
import { userInfo } from "../../Variable";

const Sidebar = ({ onClose }) => {
  const userData = userInfo();
  const adminName = userData?.first_name;
  const adminLastName = userData?.last_name;
  const adminEmail = userData?.email;
  const initials = (adminName?.charAt(0) || '').toUpperCase() + (adminLastName?.charAt(0) || '').toUpperCase();
  const sections = [
    {
      title: "Overview",
      items: [
        { name: "Dashboard", path: "/admin", icon: LayoutDashboard, end: true },
        { name: "Announcements", path: "/admin/announcements", icon: MegaphoneIcon },
        { name: "Offers & Coupons", path: "/admin/offer-coupon", icon: TicketPercent },
      ]
    },
    {
      title: "Catalog",
      items: [
        { name: "Categories", path: "/admin/categories", icon: Grid2X2 },
        { name: "Subcategory", path: "/admin/subcategories", icon: Grid },
        { name: "Attributes", path: "/admin/product-attributes", icon: ListTree },
        { name: "Colors", path: "/admin/colors", icon: Palette },
        { name: "Sizes", path: "/admin/sizes", icon: Ruler },
        { name: "Products", path: "/admin/product", icon: Box },
      ]
    },
    {
      title: "Management",
      items: [
        { name: "Orders", path: "/admin/orders", icon: ClipboardList },
        { name: "Users", path: "/admin/users", icon: Users },
      ]
    },
    {
      title: "Content & Support",
      items: [
        { name: "Instagram", path: "/admin/instagram", icon: Instagram },
        { name: "Sliders", path: "/admin/sliders", icon: SlidersHorizontal },
        { name: "Reviews", path: "/admin/reviews", icon: Star },
        { name: "Contact", path: "/admin/contact", icon: Mail },
      ]
    }
  ];

  const handleNavClick = () => {
    if (onClose && window.innerWidth < 1024) {
      onClose();
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#0f1115] text-gray-400 shadow-2xl border-r border-white/5 overflow-hidden">
      {/* Logo Section */}
      <div className="flex items-center justify-center py-8 px-6 border-b border-white/5">
        <img src={logo} alt="Glam Gait Logo" className="h-10 w-auto brightness-0 invert opacity-90" />
      </div>

      {/* Mobile close button */}
      <div className="lg:hidden flex items-center justify-between px-6 py-4 border-b border-white/5 bg-white/5">
        <div className="text-sm font-semibold tracking-wider text-white uppercase">Menu</div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors p-1 rounded-md hover:bg-white/10"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-8 hide-scrollbar">
        {sections.map((section) => (
          <div key={section.title} className="space-y-3">
            <h3 className="px-4 text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">
              {section.title}
            </h3>
            <div className="space-y-1">
              {section.items.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  end={item.end}
                  onClick={handleNavClick}
                  className={({ isActive }) =>
                    `group relative flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-300 ${isActive
                      ? "bg-amber-500/10 text-amber-500 shadow-[inset_0_0_20px_rgba(245,158,11,0.05)]"
                      : "text-gray-400 hover:bg-white/5 hover:text-white"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <item.icon
                        className={`mr-3.5 flex-shrink-0 h-4.5 w-4.5 transition-all duration-300 ${isActive
                          ? "text-amber-500 scale-110"
                          : "text-gray-500 group-hover:text-gray-300 group-hover:translate-x-0.5"
                          }`}
                      />
                      <span className="truncate">{item.name}</span>

                      {/* Premium Accent line */}
                      <div
                        className={`absolute left-0 w-1 rounded-r-full bg-amber-500 transition-all duration-300 ${isActive ? "h-6 opacity-100" : "h-0 opacity-0"
                          }`}
                      />

                      {/* Subtle hover glow for active state */}
                      {isActive && (
                        <div className="absolute inset-0 bg-amber-500/5 blur-sm rounded-lg" />
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom Footer or User profile shortcut could go here */}
      <div className="p-4 border-t border-white/5 bg-black/20">
        <div className="flex items-center px-4 py-3 space-x-3 rounded-xl bg-white/5 border border-white/5">
          <div className="h-8 w-8 rounded-full bg-amber-500 flex items-center justify-center text-white font-bold text-xs shadow-lg shadow-amber-500/20">
            {initials}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-xs font-semibold text-white truncate capitalize">{adminName} {adminLastName}</p>
            <p className="text-[10px] text-gray-500 truncate">{adminEmail}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
