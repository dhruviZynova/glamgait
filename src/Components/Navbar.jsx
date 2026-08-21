import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Search, Heart, ShoppingCart, CircleUser, X, AlignRight, Plus, Minus, ChevronDown, ChevronRight } from "lucide-react";
import { FaUserCircle, FaUser } from "react-icons/fa";
import logo from "../assets/logo1.png";
import axiosInstance from "../Axios/axios";
import { ApiURL, createSlug } from "../Variable";
import { useCart } from "../Context/CartContext";
import { useUser } from "../Context/UserContext";
import { getCategories as getCachedCategories, getAnnouncements as getCachedAnnouncements } from "../utils/dataCache";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useUser();
  const u_id = user?.u_id;
  const token = user?.token || user?.auth_token;
  const { cartCount, wishlistCount } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [currentAnnouncement, setCurrentAnnouncement] = useState(0);

  const [showAuthChoice, setShowAuthChoice] = useState(false);
  const [activeCategorySlug, setActiveCategorySlug] = useState(
    sessionStorage.getItem("activeCategorySlug") || ""
  );
  const [subcategories, setSubcategories] = useState([]);
  const [activeHoveredCategory, setActiveHoveredCategory] = useState(null);
  const [showCollectionsDropdown, setShowCollectionsDropdown] = useState(false);
  const [mobileCollectionsExpanded, setMobileCollectionsExpanded] = useState(false);
  const [mobileCategoryExpanded, setMobileCategoryExpanded] = useState({});

  const toggleMobileCategory = (cate_id) => {
    setMobileCategoryExpanded((prev) => ({
      ...prev,
      [cate_id]: !prev[cate_id],
    }));
  };

  useEffect(() => {
    const handleCategoryChange = () => {
      setActiveCategorySlug(sessionStorage.getItem("activeCategorySlug") || "");
    };
    window.addEventListener("activeCategoryChanged", handleCategoryChange);
    return () => window.removeEventListener("activeCategoryChanged", handleCategoryChange);
  }, []);

  useEffect(() => {
    if (!location.pathname.startsWith("/product")) {
      sessionStorage.removeItem("activeCategorySlug");
      setActiveCategorySlug("");
    }
    setShowCollectionsDropdown(false);
    setActiveHoveredCategory(null);
  }, [location.pathname]);

  const isAccountActive =
    location.pathname === "/myorders" ||
    location.pathname === "/myinfo" ||
    location.pathname === "/login" ||
    location.pathname === "/register" ||
    location.pathname.startsWith("/orderdetails");

  const isWishlistActive = location.pathname === "/wishlist";

  const isCartActive =
    location.pathname === "/cart" ||
    location.pathname === "/checkout" ||
    location.pathname === "/selectaddress" ||
    location.pathname === "/order-confirmation";

  const desktopSearchRef = useRef(null);
  const navRef = useRef(null);

  // Helper function to get user initials
  const getUserInitials = (userName) => {
    if (!userName) return "U";

    const names = userName.trim().split(" ");
    if (names.length === 1) {
      return names[0].charAt(0).toUpperCase();
    }

    const firstInitial = names[0].charAt(0).toUpperCase();
    const lastInitial = names[names.length - 1].charAt(0).toUpperCase();
    return firstInitial + lastInitial;
  };


  // Close search on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        desktopSearchRef.current &&
        !desktopSearchRef.current.contains(event.target)
      ) {
        setSearchQuery("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getAnnouncements = useCallback(async () => {
    try {
      const data = await getCachedAnnouncements(axiosInstance);
      if (data) setAnnouncements(data);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const getCategories = useCallback(async () => {
    try {
      const data = await getCachedCategories(axiosInstance);
      if (data) setCategories(data);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const getSubcategories = useCallback(async () => {
    try {
      const res = await axiosInstance.get("/getsubcategory");
      if (res?.data?.status === 1) {
        setSubcategories(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching subcategories:", err);
    }
  }, []);

  useEffect(() => {
    if (showCollectionsDropdown && categories.length > 0 && !activeHoveredCategory) {
      setActiveHoveredCategory(categories[0].cate_id);
    }
  }, [showCollectionsDropdown, categories, activeHoveredCategory]);

  useEffect(() => {
    getCategories();
    getAnnouncements();
    getSubcategories();
  }, []);




  useEffect(() => {
    if (!announcements.length) return;
    const interval = setInterval(() => {
      setCurrentAnnouncement((prev) => (prev + 1) % announcements.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [announcements]);




  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const windowHeight = window.innerHeight;
          const docHeight = document.documentElement.scrollHeight;
          const scrollPos = window.scrollY + windowHeight;
          const isNearBottom = scrollPos >= docHeight - 10;
          setIsAtBottom((prev) => {
            if (prev !== isNearBottom) return isNearBottom;
            return prev;
          });
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const updateBounds = () => {
      const nav = navRef.current;
      if (!nav) return;
      const homeLink = nav.querySelector('a[href="/"]');
      const contactLink = nav.querySelector('a[href="/contact"]');
      if (!homeLink || !contactLink) return;
      const navRect = nav.getBoundingClientRect();
      const homeRect = homeLink.getBoundingClientRect();
      const contactRect = contactLink.getBoundingClientRect();
      const startOffset = homeRect.left - navRect.left;
      const endOffset = navRect.right - contactRect.right;
      document.documentElement.style.setProperty(
        "--nav-start",
        `${startOffset}px`
      );
      document.documentElement.style.setProperty("--nav-end", `${endOffset}px`);
    };
    updateBounds();
    window.addEventListener("resize", updateBounds);
    return () => window.removeEventListener("resize", updateBounds);
  }, [categories]);

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const capitalized = searchQuery
        .trim()
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
      navigate(`/search?query=${encodeURIComponent(capitalized)}`);
      setSearchQuery("");
      setIsMobileSearchOpen(false);
    }
  };



  return (
    <>
      {/* Announcement Bar */}
      {announcements.length > 0 && (
        <div className="bg-[#23403b] text-white text-xs md:text-sm py-2 text-center font-Montserrat font-medium">
          <div className="transition-all duration-500 ease-in-out">
            {announcements[currentAnnouncement]?.text || ""}
          </div>
        </div>
      )}
      <nav ref={navRef} className="sticky bg-white shadow-md top-0 z-50">
        <div className="mx-auto px-2 md:px-10 lg:px-20 py-3 flex justify-between items-center">
          <Link to="/">
            <img src={logo} alt="Logo" className="h-12 md:h-14 lg:h-16 w-auto" />
          </Link>

          {/* Desktop Menu */}
          <div
            className="hidden lg:flex items-center space-x-8 mr-6"
            onMouseLeave={() => {
              setShowCollectionsDropdown(false);
              setActiveHoveredCategory(null);
            }}
          >
            {/* Home Link */}
            <div className="relative py-2">
              <Link
                to="/"
                className={`text-[16px] capitalize transition-all duration-300 ${
                  location.pathname === "/"
                    ? "text-[#1C2F2F] font-semibold border-b-2 border-[#1C2F2F] pb-1"
                    : "text-[#767676] font-medium hover:text-[#1C2F2F]"
                }`}
              >
                Home
              </Link>
            </div>

            {/* Collections Link with Dropdown */}
            <div
              className="relative py-2"
              onMouseEnter={() => setShowCollectionsDropdown(true)}
            >
              <Link
                to="/collections/All Products"
                className={`text-[16px] capitalize transition-all duration-300 flex items-center gap-1 ${
                  location.pathname.startsWith("/collections")
                    ? "text-[#1C2F2F] font-semibold border-b-2 border-[#1C2F2F] pb-1"
                    : "text-[#767676] font-medium hover:text-[#1C2F2F]"
                }`}
              >
                Collections
                <ChevronDown size={14} className={`transition-transform duration-200 ${showCollectionsDropdown ? "rotate-180" : ""}`} />
              </Link>            </div>

            {/* About Link */}
            <div className="relative py-2">
              <Link
                to="/about"
                className={`text-[16px] capitalize transition-all duration-300 ${
                  location.pathname === "/about"
                    ? "text-[#1C2F2F] font-semibold border-b-2 border-[#1C2F2F] pb-1"
                    : "text-[#767676] font-medium hover:text-[#1C2F2F]"
                }`}
              >
                About
              </Link>
            </div>

            {/* Contact Us Link */}
            <div className="relative py-2">
              <Link
                to="/contact"
                className={`text-[16px] capitalize transition-all duration-300 ${
                  location.pathname === "/contact"
                    ? "text-[#1C2F2F] font-semibold border-b-2 border-[#1C2F2F] pb-1"
                    : "text-[#767676] font-medium hover:text-[#1C2F2F]"
                }`}
              >
                Contact Us
              </Link>
            </div>
          </div>

          {/* Icons */}
          <div className="flex items-center gap-4 md:gap-4">

            {/* 1. Search Icon */}
            <button
              onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
              aria-label="Toggle search"
              className="focus:outline-none"
            >
              <Search className="cursor-pointer text-[#767676] hover:text-[#1C2F2F]" />
            </button>

            {/* 2. Heart/Wishlist Icon */}
            <Link to="/wishlist" className="hidden lg:block relative" aria-label={`Wishlist, ${wishlistCount} items`}>
              <Heart className="cursor-pointer text-[#767676] hover:text-[#1C2F2F]" />
              <span className="absolute -top-2 -right-2 bg-[#1C2F2F] text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                {wishlistCount}
              </span>
            </Link>

            {/* 3. Shopping Cart Icon */}
            <Link to="/cart" className="hidden lg:block relative" aria-label={`Shopping cart, ${cartCount} items`}>
              <ShoppingCart className="cursor-pointer text-[#767676] hover:text-[#1C2F2F]" />
              <span className="absolute -top-2 -right-2 bg-[#1C2F2F] text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            </Link>

            {/* 4. Custom User Icon */}
            <div
              className="hidden lg:flex items-center gap-1 cursor-pointer text-[#767676] hover:text-black"
              aria-label={u_id && token ? "Account" : "Login"}
              role="button"
              onClick={() => {
                if (u_id && token) {
                  navigate("/myorders");
                } else {
                  navigate("/login", { state: { from: location.pathname + location.search } });
                }
              }}
            >
              {u_id && token ? (
                <div className="w-8 h-8 bg-[#1C2F2F] text-white rounded-full flex items-center justify-center text-sm font-medium">
                  {getUserInitials(user?.name)}
                </div>
              ) : (
                <FaUserCircle className="text-xl" />
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="lg:hidden p-2 text-gray-700 hover:text-black"
              onClick={toggleMenu}
              aria-label="Toggle navigation menu"
              aria-expanded={isOpen}
            >
              {isOpen ? <X size={24} /> : <AlignRight size={24} />}
            </button>

            {/* Auth Modal Logic */}
            {showAuthChoice && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4 relative">
                  <button
                    className="absolute top-3 right-3 text-gray-400 hover:text-black focus:outline-none"
                    onClick={() => setShowAuthChoice(false)}
                    aria-label="Close"
                  >
                    <X size={22} />
                  </button>
                  <h3 className="text-lg font-medium mb-4">Welcome!</h3>
                  <p className="text-gray-600 mb-6">
                    You can continue shopping as a guest or sign in for better
                    experience
                  </p>

                  <div className="space-y-3">
                    <button
                      onClick={() => {
                        setShowAuthChoice(false);
                        navigate("/login", { state: { from: location.pathname + location.search } });
                      }}
                      className="w-full bg-black text-white py-3 rounded-md"
                    >
                      Login / Register
                    </button>

                    <button
                      onClick={() => {
                        setShowAuthChoice(false);
                        navigate("/myorders");
                      }}
                      className="w-full bg-gray-100 text-gray-800 py-3 rounded-md"
                    >
                      Continue as Guest
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>


        {/* Search Bar */}
        {isMobileSearchOpen && (
          <div
            className="absolute top-full left-0 w-full bg-white shadow-md px-4 py-3 flex items-center justify-center z-40 border-t border-gray-50"
            ref={desktopSearchRef}
          >
            <form
              onSubmit={handleSearch}
              className="flex w-full max-w-xl items-center"
            >
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-full focus:outline-none"
                  placeholder="Search..."
                />
              </div>
            </form>
          </div>
        )}
        {/* Collections Dropdown Menu */}
        {showCollectionsDropdown && (
          <div
            className="absolute inset-x-0 top-full bg-white shadow-[0_8px_30px_rgba(0,0,0,0.12)] border-t border-gray-100 z-50"
            onMouseEnter={() => setShowCollectionsDropdown(true)}
            onMouseLeave={() => {
              setShowCollectionsDropdown(false);
              setActiveHoveredCategory(null);
            }}
          >
            <div className="max-w-6xl mx-auto px-8 py-6">
              {/* Top Header */}
              <div className="flex items-center justify-between mb-5 pb-3 border-b border-gray-100">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">
                  Shop by Category
                </h3>
                <Link
                  to="/collections/All Products"
                  className="text-xs font-semibold text-[#1C2F2F] uppercase tracking-wider hover:text-[#8B1A1A] transition-colors duration-200 flex items-center gap-1"
                  onClick={() => {
                    setShowCollectionsDropdown(false);
                    setActiveHoveredCategory(null);
                  }}
                >
                  View All Collections
                  <ChevronRight size={12} />
                </Link>
              </div>

              {/* Category Cards Grid */}
              {categories.length === 0 ? (
                <div className="py-8 text-center text-sm text-gray-400 italic">
                  Loading collections...
                </div>
              ) : (
                <div className="grid grid-cols-4 gap-5">
                {categories.map((cat) => {
                  const cate_slug = createSlug(cat.cate_name);
                  const catSubcats = subcategories.filter((sc) => sc.cate_id === cat.cate_id);

                  return (
                    <div
                      key={cat.cate_id}
                      className="group"
                      onMouseEnter={() => setActiveHoveredCategory(cat.cate_id)}
                    >
                      {/* Category Image Card */}
                      <Link
                        to={`/collections/${cate_slug}`}
                        className="block relative overflow-hidden rounded-xl aspect-[4/3] mb-3"
                        onClick={() => {
                          setShowCollectionsDropdown(false);
                          setActiveHoveredCategory(null);
                        }}
                      >
                        <img
                          src={cat.cate_image || cat.category_image || cat.categoryImage || cat.image}
                          alt={cat.cate_name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-3">
                          <h4 className="text-white font-bold text-sm capitalize tracking-wide">
                            {cat.cate_name}
                          </h4>
                          <span className="text-white/70 text-[10px] uppercase tracking-widest">
                            {catSubcats.length} {catSubcats.length === 1 ? "type" : "types"}
                          </span>
                        </div>
                      </Link>

                      {/* Subcategory Links */}
                      <div className="space-y-1.5">
                        <Link
                          to={`/collections/${cate_slug}`}
                          className="block text-xs font-semibold text-[#1C2F2F] hover:text-[#8B1A1A] transition-colors capitalize"
                          onClick={() => {
                            setShowCollectionsDropdown(false);
                            setActiveHoveredCategory(null);
                          }}
                        >
                          Shop All {cat.cate_name} →
                        </Link>
                        {catSubcats.map((sub) => {
                          const subSlug = createSlug(sub.name);
                          return (
                            <Link
                              key={sub.sc_id}
                              to={`/collections/${cate_slug}/${subSlug}`}
                              className="block text-xs text-gray-500 hover:text-[#1C2F2F] hover:pl-1 transition-all duration-200 capitalize"
                              onClick={() => {
                                setShowCollectionsDropdown(false);
                                setActiveHoveredCategory(null);
                              }}
                            >
                              {sub.name}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/30 z-[1000] backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setIsOpen(false)}
          />
          <div
            className={`fixed top-0 right-0 h-full w-80 bg-[#f3f0ed] shadow-2xl z-[1001] transform transition-transform duration-300 rounded-l-3xl ${isOpen ? "translate-x-0" : "translate-x-full"
              }`}
          >
            <button
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-200"
              onClick={() => setIsOpen(false)}
            >
              <X size={24} />
            </button>
            <div className="p-6 pt-24 space-y-1 overflow-y-auto h-full rounded-l-3xl">
              {/* Home */}
              <div className="border-b border-gray-200">
                <Link
                  to="/"
                  onClick={() => setIsOpen(false)}
                  className={`block py-4 font-medium transition-colors ${
                    location.pathname === "/"
                      ? "text-[#1C2F2F] font-bold border-l-4 border-[#1C2F2F] pl-3 -ml-4 bg-[#ede9e6]"
                      : "text-gray-900"
                  }`}
                >
                  Home
                </Link>
              </div>

              {/* Collections Collapsible */}
              <div className="border-b border-gray-200">
                <div className="flex justify-between items-center py-4">
                  <Link
                    to="/collections/All Products"
                    onClick={() => setIsOpen(false)}
                    className={`font-medium transition-colors flex-grow ${
                      location.pathname.startsWith("/collections")
                        ? "text-[#1C2F2F] font-bold border-l-4 border-[#1C2F2F] pl-3 -ml-4 bg-[#ede9e6]"
                        : "text-gray-900"
                    }`}
                  >
                    Collections
                  </Link>
                  <button
                    onClick={() => setMobileCollectionsExpanded(!mobileCollectionsExpanded)}
                    className="p-2 text-gray-500 hover:text-[#1C2F2F]"
                  >
                    <ChevronDown
                      size={18}
                      className={`transition-transform duration-200 ${mobileCollectionsExpanded ? "rotate-180" : ""}`}
                    />
                  </button>
                </div>

                {/* Categories Level (Expanded) */}
                {mobileCollectionsExpanded && (
                  <div className="pl-4 pb-3 space-y-2">
                    {categories.map((cat) => {
                      const cate_slug = createSlug(cat.cate_name);
                      const catSubcats = subcategories.filter((sc) => sc.cate_id === cat.cate_id);
                      const isCatExpanded = !!mobileCategoryExpanded[cat.cate_id];

                      return (
                        <div key={cat.cate_id} className="border-l border-gray-200 pl-3">
                          <div className="flex justify-between items-center py-1">
                            <Link
                              to={`/collections/${cate_slug}`}
                              onClick={() => setIsOpen(false)}
                              className="text-sm font-medium text-gray-800 capitalize hover:text-[#1C2F2F]"
                            >
                              {cat.cate_name}
                            </Link>
                            {catSubcats.length > 0 && (
                              <button
                                onClick={() => toggleMobileCategory(cat.cate_id)}
                                className="p-1.5 text-gray-400 hover:text-[#1C2F2F]"
                              >
                                {isCatExpanded ? <Minus size={14} /> : <Plus size={14} />}
                              </button>
                            )}
                          </div>

                          {/* Subcategories Level */}
                          {isCatExpanded && catSubcats.length > 0 && (
                            <div className="pl-4 py-1 space-y-1.5">
                              <Link
                                to={`/collections/${cate_slug}`}
                                onClick={() => setIsOpen(false)}
                                className="block text-xs font-semibold text-[#1C2F2F] hover:underline"
                              >
                                Shop All {cat.cate_name}
                              </Link>
                              {catSubcats.map((sub) => {
                                const subSlug = createSlug(sub.name);
                                return (
                                  <Link
                                    key={sub.sc_id}
                                    to={`/collections/${cate_slug}/${subSlug}`}
                                    onClick={() => setIsOpen(false)}
                                    className="block text-xs text-gray-500 hover:text-black capitalize"
                                  >
                                    {sub.name}
                                  </Link>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* About */}
              <div className="border-b border-gray-200">
                <Link
                  to="/about"
                  onClick={() => setIsOpen(false)}
                  className={`block py-4 font-medium transition-colors ${
                    location.pathname === "/about"
                      ? "text-[#1C2F2F] font-bold border-l-4 border-[#1C2F2F] pl-3 -ml-4 bg-[#ede9e6]"
                      : "text-gray-900"
                  }`}
                >
                  About
                </Link>
              </div>

              {/* Contact Us */}
              <div className="border-b border-gray-200">
                <Link
                  to="/contact"
                  onClick={() => setIsOpen(false)}
                  className={`block py-4 font-medium transition-colors ${
                    location.pathname === "/contact"
                      ? "text-[#1C2F2F] font-bold border-l-4 border-[#1C2F2F] pl-3 -ml-4 bg-[#ede9e6]"
                      : "text-gray-900"
                  }`}
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Premium iOS-Style Curved Glass Bottom Bar for Mobile */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-gray-200/50 shadow-[0_-8px_30px_rgba(28,47,47,0.05)] rounded-t-[28px] flex justify-around items-center py-2 px-4 z-[999]">
        {/* Account / Profile Link */}
        <div
          className={`flex flex-col items-center justify-center cursor-pointer px-4 py-1.5 transition-colors duration-200 ${isAccountActive ? "text-[#1C2F2F]" : "text-[#767676]"}`}
          onClick={() => {
            if (u_id && token) {
              navigate("/myorders");
            } else {
              navigate("/login", { state: { from: location.pathname + location.search } });
            }
          }}
        >
          {u_id && token ? (
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold mb-0.5 ${isAccountActive ? "bg-[#1C2F2F] text-white" : "bg-[#767676] text-white"}`}>
              {getUserInitials(user?.name)}
            </div>
          ) : (
            <FaUserCircle size={22} className="mb-0.5" />
          )}
          <span className={`text-[10px] tracking-wide ${isAccountActive ? "font-semibold" : "font-medium"}`}>Account</span>
        </div>

        {/* Wishlist Link */}
        <Link
          to="/wishlist"
          className={`flex flex-col items-center justify-center relative px-4 py-1.5 transition-colors duration-200 ${isWishlistActive ? "text-[#1C2F2F]" : "text-[#767676]"}`}
        >
          <div className="relative">
            <Heart size={22} className={`mb-0.5 transition-all duration-300 ${isWishlistActive ? "text-[#1C2F2F] fill-[#1C2F2F] scale-110" : "text-[#767676]"}`} />
            <span className={`absolute -top-1.5 -right-2.5 bg-[#1C2F2F] text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-full font-semibold ${isWishlistActive ? "ring-2 ring-white " : ""}`}>
              {wishlistCount}
            </span>
          </div>
          <span className={`text-[10px] tracking-wide ${isWishlistActive ? "font-semibold" : "font-medium"}`}>Wishlist</span>
        </Link>

        {/* Cart Link */}
        <Link
          to="/cart"
          className={`flex flex-col items-center justify-center relative px-4 py-1.5 transition-colors duration-200 ${isCartActive ? "text-[#1C2F2F]" : "text-[#767676]"}`}
        >
          <div className="relative">
            <ShoppingCart size={22} className="mb-0.5" />
            <span className="absolute -top-1.5 -right-2.5 bg-[#1C2F2F] text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-full font-semibold">
              {cartCount}
            </span>
          </div>
          <span className={`text-[10px] tracking-wide ${isCartActive ? "font-semibold" : "font-medium"}`}>Cart</span>
        </Link>
      </div>
    </>
  );
};
export default Navbar;