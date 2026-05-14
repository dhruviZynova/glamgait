import { useState, useEffect, useRef, useCallback } from "react";
import { SlidersHorizontal, ChevronUp, ChevronDown, ChevronRight } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../Axios/axios";
import ScrollToTop from "./ScrollToTop";
import { ApiURL, userInfo } from "../Variable";
import { getGuestId } from "../utils/guest";
import { Helmet } from "@dr.pogodin/react-helmet";
import ProductCard from "./ProductCard";

const Allproducts = () => {
  ScrollToTop();
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const searchTimeoutRef = useRef(null);

  // Debounce search term
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1); // Reset to first page when searching
    }, 500); // 500ms delay

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchTerm]);

  const handleSearch = () => {
    // Immediate search for button click
    setDebouncedSearchTerm(searchTerm);
    setCurrentPage(1);
  };

  const clearSearch = () => {
    setSearchTerm("");
    setDebouncedSearchTerm("");
    setCurrentPage(1);
  };
  const [collectionsExpanded, setCollectionsExpanded] = useState(false);
  const [fabricExpanded, setFabricExpanded] = useState(false);
  const [workExpanded, setWorkExpanded] = useState(false);
  const [occasionExpanded, setOccasionExpanded] = useState(false);
  const [styleExpanded, setStyleExpanded] = useState(false);
  const [sizeExpanded, setSizeExpanded] = useState(false);
  const [colorExpanded, setColorExpanded] = useState(false);
  const [filters, setFilters] = useState({
    subcategories: [],
    fabrics: [],
    works: [],
    occasions: [],
    styles: [],
    sizes: [],
    categories: [],
  });
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState([]);
  const [selectedFabrics, setSelectedFabrics] = useState([]);
  const [selectedWorks, setSelectedWorks] = useState([]);
  const [selectedOccasions, setSelectedOccasions] = useState([]);
  const [selectedStyles, setSelectedStyles] = useState([]);
  const [allColors, setAllColors] = useState([]); // ← global colors
  const [selectedColors, setSelectedColors] = useState([]);
  const { cate_name, filterValue } = useParams();
  const [wishlistMap, setWishlistMap] = useState({});

  const [products, setProducts] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [sortBy, setSortBy] = useState("a-z");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const [cateId, setCateId] = useState(null);
  const [categoryDisplayName, setCategoryDisplayName] = useState("");
  const [activeFilterName, setActiveFilterName] = useState("");
  const [limit] = useState(18);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  const [seo, setSeo] = useState({
    title: "",
    description: "",
  });

  const navigate = useNavigate();


  const createSlug = (name) =>
    name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "");
  // Set selected filters from URL filterValue (infer type by matching in filters)

  useEffect(() => {
    if (!filterValue || Object.keys(filters).length === 0) {
      setSelectedSubcategories([]);
      setSelectedFabrics([]);
      setSelectedWorks([]);
      setSelectedOccasions([]);
      setSelectedStyles([]);
      setActiveFilterName("");
      return;
    }
    let matched = null;
    let type = null;
    // Check each filter list for matching slug
    matched = filters.subcategories.find(
      (item) => createSlug(item.name) === filterValue
    );
    if (matched) {
      type = "collection";
      setSelectedSubcategories([matched.sc_id]);
      setActiveFilterName(matched.name);
    } else {
      matched = filters.fabrics.find(
        (item) => createSlug(item.name) === filterValue
      );
      if (matched) {
        type = "fabric";
        setSelectedFabrics([matched.f_id]);
        setActiveFilterName(matched.name);
      } else {
        matched = filters.works.find(
          (item) => createSlug(item.name) === filterValue
        );
        if (matched) {
          type = "work";
          setSelectedWorks([matched.work_id]);
          setActiveFilterName(matched.name);
        } else {
          matched = filters.occasions.find(
            (item) => createSlug(item.name) === filterValue
          );
          if (matched) {
            type = "occasion";
            setSelectedOccasions([matched.occasion_id]);
            setActiveFilterName(matched.name);
          } else {
            matched = filters.styles.find(
              (item) => createSlug(item.name) === filterValue
            );
            if (matched) {
              type = "style";
              setSelectedStyles([matched.style_id]);
              setActiveFilterName(matched.name);
            }
          }
        }
      }
    }
    // Clear other filters if a match found
    if (matched && type) {
      setSelectedSubcategories(type === "collection" ? [matched.sc_id] : []);
      setSelectedFabrics(type === "fabric" ? [matched.f_id] : []);
      setSelectedWorks(type === "work" ? [matched.work_id] : []);
      setSelectedOccasions(type === "occasion" ? [matched.occasion_id] : []);
      setSelectedStyles(type === "style" ? [matched.style_id] : []);
    }
  }, [filterValue, filters]);

  useEffect(() => {
    if (!cate_name) {
      // If no category slug → show all products or redirect
      setCateId(null);
      setCategoryDisplayName("All Products");
      return;
    }
    const fetchCategoryId = async () => {
      try {
        // Call backend to get cate_id from name/slug
        const res = await axiosInstance.get(`/getcategorybyname/${cate_name}`);
        if (res.data.status === 1 && res.data.data) {
          setCateId(res.data.data.cate_id);
          setCategoryDisplayName(res.data.data.cate_name || cate_name);
        } else {
          console.log("cate_not found");
        }
      } catch (err) {
        console.error("Category not found:", err);
      }
    };
    fetchCategoryId();
  }, [cate_name, navigate]);

  useEffect(() => {
    const fetchCategoryFilters = async () => {
      try {
        // Fetch categories (no category ID needed)
        const categoryRes = await axiosInstance.get(`${ApiURL}/getcategory`);

        // Fetch other filters using category ID if available, otherwise use default (2)
        const categoryId = cateId || 2;

        const [subRes, fabricRes, workRes, occRes, styleRes, sizeRes] =
          await Promise.all([
            cateId ? axiosInstance.get(`${ApiURL}/getsubcategory/${categoryId}`) : Promise.resolve({ data: { data: [] } }),
            axiosInstance.get(`${ApiURL}/getfabrics/${categoryId}`),
            axiosInstance.get(`${ApiURL}/getworks/${categoryId}`),
            axiosInstance.get(`${ApiURL}/getoccasions/${categoryId}`),
            axiosInstance.get(`${ApiURL}/getstyles/${categoryId}`),
            axiosInstance.get(`${ApiURL}/getsize/${categoryId}`),
          ]);

        setFilters({
          subcategories: subRes.data.data || [],
          fabrics: fabricRes.data.data || [],
          works: workRes.data.data || [],
          occasions: occRes.data.data || [],
          styles: styleRes.data.data || [],
          sizes: sizeRes.data.data || [],
          categories: categoryRes.data.data || [],
        });
      } catch (error) {
        console.error("Error fetching category filters:", error);
      }
    };
    fetchCategoryFilters();
  }, [cateId]);

  // Sync URL category with sidebar selection
  useEffect(() => {
    if (cateId) {
      setSelectedCategories([cateId]);
    } else {
      setSelectedCategories([]);
    }
  }, [cateId]);

  useEffect(() => {
    const fetchAllColors = async () => {
      try {
        const res = await axiosInstance.get("/getcolor");
        if (res.data.status === 1) {
          setAllColors(res.data.data || []);
        }
      } catch (error) {
        console.error("Error fetching global colors:", error);
      }
    };

    fetchAllColors();
  }, []);

  const fetchProducts = useCallback(async () => {
    try {
      const isSearch = !!debouncedSearchTerm;
      const isAllProductsPage = !cate_name || cate_name === "All Products";

      // Use global endpoint if searching, filtering by multiple categories, or on a generic page
      const useGlobalEndpoint = isSearch || selectedCategories.length > 1 || isAllProductsPage;
      const endpoint = useGlobalEndpoint ? "/getallproducts" : `/productbycategory/${cate_name}`;

      // Build parameters
      const params = {
        page: currentPage,
        limit: limit,
        perPage: limit,
        search: debouncedSearchTerm,
        // Pass selected categories as a comma-separated string if filtering,
        // otherwise fallback to the URL-based cateId
        cate_id: selectedCategories.length > 0
          ? selectedCategories.join(",")
          : (useGlobalEndpoint ? undefined : cateId),
        cate_name: useGlobalEndpoint ? undefined : cate_name,
        price_min: priceRange[0],
        price_max: priceRange[1],
        sort_by:
          sortBy === "a-z"
            ? "name_asc"
            : sortBy === "z-a"
              ? "name_desc"
              : sortBy === "low-high"
                ? "price_asc"
                : "price_desc",
      };

      // Add filter arrays, converting them to comma-separated strings if they have values
      const filterMappings = {
        categories: selectedCategories,
        subcategories: selectedSubcategories,
        fabrics: selectedFabrics,
        works: selectedWorks,
        occasions: selectedOccasions,
        styles: selectedStyles,
        colors: selectedColors,
        sizes: selectedSizes,
      };

      Object.keys(filterMappings).forEach((key) => {
        const val = filterMappings[key];
        if (Array.isArray(val) && val.length > 0) {
          params[key] = val.join(",");
        }
      });

      const response = await axiosInstance.get(endpoint, { params });

      if (response.data.status === 1) {
        let fetchedProducts, pagination;

        if (useGlobalEndpoint) {
          // Handle global endpoint (/getallproducts) response structure
          fetchedProducts = response.data.data?.productData || [];
          pagination = response.data.data?.pagination || {
            totalCount: response.data.data?.totalCount || 0,
            totalPages: response.data.data?.totalPages || 0,
            page: response.data.data?.currentPage || currentPage,
          };
        } else {
          // Handle category-specific endpoint (/productbycategory) response structure
          fetchedProducts = response.data.data?.products || [];
          pagination = response.data.data?.pagination || {
            totalCount: response.data.data?.totalCount || 0,
            totalPages: response.data.data?.totalPages || 0,
            page: currentPage,
          };
        }

        if (currentPage === 1) {
          setProducts(fetchedProducts);
        } else {
          setProducts((prev) => {
            const existingIds = new Set(prev.map((p) => p.p_id));
            const uniqueNew = (fetchedProducts || []).filter(
              (p) => !existingIds.has(p.p_id)
            );
            return [...prev, ...uniqueNew];
          });
        }

        // Calculate max price from products and round up to nearest 1000 (only on initial load)
        if (
          fetchedProducts &&
          fetchedProducts.length > 0 &&
          priceRange[1] === 100000
        ) {
          const maxPrice = Math.max(...fetchedProducts.map((p) => p.price || 0));
          const roundedMaxPrice = Math.ceil(maxPrice / 1000) * 1000;
          setPriceRange([0, roundedMaxPrice]);
        }

        setTotalProducts(pagination?.totalCount || 0);

        if (pagination?.page && pagination.page !== currentPage) {
          // Only sync if necessary
          // setCurrentPage(pagination.page); 
        }
      } else {
        setProducts([]);
        setTotalProducts(0);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  }, [
    cate_name,
    cateId,
    selectedCategories,
    selectedSubcategories,
    selectedFabrics,
    selectedWorks,
    selectedOccasions,
    selectedStyles,
    selectedColors,
    selectedSizes,
    priceRange,
    sortBy,
    currentPage,
    debouncedSearchTerm,
    limit,
  ]);

  useEffect(() => {
    if (cate_name) fetchProducts();
  }, [
    cate_name,
    selectedCategories,
    selectedSubcategories,
    selectedFabrics,
    selectedWorks,
    selectedOccasions,
    selectedStyles,
    selectedSizes,
    selectedColors,
    sortBy,
    currentPage,
    debouncedSearchTerm,
    fetchProducts,
  ]);

  // Separate effect for price range changes (debounced to avoid infinite loops)
  useEffect(() => {
    if (cate_name && priceRange[1] !== 100000) {
      const timer = setTimeout(() => {
        fetchProducts();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [priceRange, cate_name, fetchProducts]);

  const toggleCategory = (val) => {
    setSelectedCategories((prev) =>
      prev.includes(val) ? prev.filter((v) => v !== val) : [...prev, val]
    );
    setCurrentPage(1);
  };
  const toggleSubcategory = (val) => {
    setSelectedSubcategories((prev) =>
      prev.includes(val) ? prev.filter((v) => v !== val) : [...prev, val]
    );
    setCurrentPage(1);
  };
  const toggleFabric = (val) => {
    setSelectedFabrics((prev) =>
      prev.includes(val) ? prev.filter((v) => v !== val) : [...prev, val]
    );
    setCurrentPage(1);
  };
  const toggleWork = (val) => {
    setSelectedWorks((prev) =>
      prev.includes(val) ? prev.filter((v) => v !== val) : [...prev, val]
    );
    setCurrentPage(1);
  };
  const toggleOccasion = (val) => {
    setSelectedOccasions((prev) =>
      prev.includes(val) ? prev.filter((v) => v !== val) : [...prev, val]
    );
    setCurrentPage(1);
  };
  const toggleStyle = (val) => {
    setSelectedStyles((prev) =>
      prev.includes(val) ? prev.filter((v) => v !== val) : [...prev, val]
    );
    setCurrentPage(1);
  };
  const toggleSizeNew = (val) => {
    setSelectedSizes((prev) =>
      prev.includes(val) ? prev.filter((v) => v !== val) : [...prev, val]
    );
    setCurrentPage(1);
  };

  const toggleColor = (colorId) => {
    setSelectedColors(
      (prev) =>
        prev.includes(colorId)
          ? prev.filter((id) => id !== colorId) // remove if already selected
          : [...prev, colorId] // add if not selected
    );
    setCurrentPage(1);
  };
  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedSubcategories([]);
    setSelectedFabrics([]);
    setSelectedWorks([]);
    setSelectedOccasions([]);
    setSelectedStyles([]);
    setSelectedSizes([]);
    setSelectedColors([]);
    setPriceRange([0, 100000]);
    setCurrentPage(1);
  };

  useEffect(() => {
    const fetchWishlist = async () => {
      const user = userInfo();
      const identifier = user?.u_id || getGuestId();
      try {
        const query = user?.u_id
          ? `u_id=${identifier}`
          : `guest_id=${identifier}`;
        const res = await axiosInstance.get(`/getwishlist?${query}`);
        if (res.data.status === 1) {
          const items = res.data.data || [];
          // Create fast lookup map: "p_id-pcolor_id" → true
          const map = {};
          items.forEach((item) => {
            const key = `${item.p_id}-${item.pcolor_id}`;
            map[key] = {
              wished: true,
              w_id: item.w_id, // optional: for remove
            };
          });
          setWishlistMap(map);
        }
      } catch (err) {
        console.error("Wishlist fetch failed", err);
      }
    };
    fetchWishlist();
  }, []);
  const refreshWishlist = async () => {
    const user = userInfo();
    const identifier = user?.u_id || getGuestId();
    try {
      const query = user?.u_id
        ? `u_id=${identifier}`
        : `guest_id=${identifier}`;
      const res = await axiosInstance.get(`/getwishlist?${query}`);
      if (res.data.status === 1) {
        const items = res.data.data || [];
        const map = {};
        items.forEach((item) => {
          const key = `${item.p_id}-${item.pcolor_id}`;
          map[key] = {
            wished: true,
            w_id: item.w_id,
          };
        });
        setWishlistMap(map); // ← Yeh update karega sab ProductCards ko
      }
    } catch (err) {
      console.error("Wishlist refresh failed", err);
    }
  };




  useEffect(() => {
    let title = "";
    let description = "";

    // ✅ Subcategory SEO (highest priority)
    if (activeFilterName && filters.subcategories.length > 0) {
      const sub = filters.subcategories.find(
        (s) => s.name === activeFilterName
      );

      if (sub) {
        title =
          sub.meta_title || `${sub.name} - ${categoryDisplayName} Collection`;

        description =
          sub.meta_description ||
          `Buy ${sub.name} online from our exclusive ${categoryDisplayName} collection.`;
      }
    }

    // ✅ Category SEO fallback
    if (!title) {
      title = `${categoryDisplayName} Collection | Buy Online`;
      description = `Shop latest ${categoryDisplayName} products with best price and fast delivery.`;
    }

    setSeo({ title, description });
  }, [activeFilterName, filters.subcategories, categoryDisplayName]);

  return (
    <>
      <Helmet>
        <title>{seo.title}</title>

        <meta name="description" content={seo.description} />
      </Helmet>

      {/* 
         CHANGED 1: Reverted to min-h-screen and removed overflow-hidden.
         This allows the page to grow naturally and the main browser scrollbar to appear.
         This fixes the "cut section" issue.
      */}
      <div className="bg-[#f3f0ed] relative">

        <div className="w-full py-8 px-2 md:px-8 xl:px-24">

          <div className="flex flex-col lg:flex-row sm:gap-8 gap-2 items-start">

            {/* Mobile Filter Button */}
            <button
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="lg:hidden flex items-center justify-center gap-2 bg-[#f3f0ed] border border-gray-300 px-4 py-3 rounded-lg sm:mb-4 mb-0 shadow-sm flex-shrink-0"
            >
              <SlidersHorizontal className="w-5 h-5" />
              <span className="font-medium">Filters</span>
            </button>

            <aside
              className={`${mobileFilterOpen ? "block" : "hidden"
                } lg:block w-full lg:w-72 flex-shrink-0 lg:sticky lg:top-28 h-fit`}
            >
              <div className="bg-[#f3f0ed] border border-gray-200 rounded-lg shadow-sm mb-8">
                {/* --- CATEGORIES SECTION --- */}
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between sm:p-4 p-2 border-b border-gray-200">
                    <h2 className="text-xl font-400 text-[#2D2D2D] font-[Oxygen] border-l-4 pl-2">Filters</h2>
                    <button
                      onClick={clearAllFilters}
                      className="text-xs font-400 text-gray-500 hover:text-[#5a2063] underline cursor-pointer transition-colors"
                    >
                      Clear All
                    </button>
                  </div>

                  {/* Filters Content */}
                  <div className="flex flex-col gap-4 px-4">
                    {/* Categories */}
                    {filters?.categories?.length > 0 && (
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-400 font-[Oxygen] text-[#414141] text-lg block">
                            All Categories
                          </span>
                          <div
                            onClick={() => setCollectionsExpanded(!collectionsExpanded)}
                            className="cursor-pointer p-1 rounded transition-colors"
                          >
                            {collectionsExpanded ? (
                              <ChevronUp className="w-4 h-4 text-[#414141] group-hover:text-gray-600 transition-transform" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-[#414141] group-hover:text-gray-600 transition-transform" />
                            )}
                          </div>
                        </div>
                        {collectionsExpanded && (
                          <div className="space-y-1">
                            {filters?.categories?.map((val) => (
                              <div
                                key={val.cate_id}
                                onClick={() => navigate(`/collections/${val.cate_name}`)}
                                className="flex items-center justify-between group cursor-pointer p-2 hover:bg-white/50 rounded-md transition-colors"
                              >
                                <div className="flex items-center gap-3">
                                  <input
                                    type="checkbox"
                                    checked={selectedCategories.includes(val.cate_id)}
                                    onChange={(e) => {
                                      e.stopPropagation();
                                      toggleCategory(val.cate_id);
                                    }}
                                    className="w-4 h-4 text-[#73287E] border-[#73287E] rounded focus:ring-[#73287E] cursor-pointer accent-[#73287E]"
                                  />
                                  <span className="text-sm text-[#2D2D2D] font-[Oxygen] font-400 capitalize">
                                    {val?.cate_name}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Subcategory / Collections */}
                    {filters?.subcategories?.length > 0 && (
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-400 font-[Oxygen] text-[#414141] text-lg block">
                            Collections
                          </span>
                          <div
                            onClick={() => setCollectionsExpanded(!collectionsExpanded)}
                            className="cursor-pointer p-1 rounded transition-colors"
                          >
                            {collectionsExpanded ? (
                              <ChevronUp className="w-4 h-4 text-[#414141] group-hover:text-gray-600 transition-transform" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-[#414141] group-hover:text-gray-600 transition-transform" />
                            )}
                          </div>
                        </div>
                        {collectionsExpanded && (
                          <div className="space-y-1">
                            {filters?.subcategories?.map((val) => (
                              <label
                                key={val.sc_id}
                                className="flex items-center justify-between group cursor-pointer p-2 hover:bg-white/50 rounded-md transition-colors"
                              >
                                <div className="flex items-center gap-3">
                                  <input
                                    type="checkbox"
                                    checked={selectedSubcategories.includes(val.sc_id)}
                                    onChange={() => toggleSubcategory(val.sc_id)}
                                    className="w-4 h-4 text-[#73287E] border-[#73287E] rounded focus:ring-[#73287E] cursor-pointer accent-[#73287E]"
                                  />
                                  <span className="text-sm text-[#2D2D2D] font-[Oxygen] font-400 capitalize">
                                    {val?.name}
                                  </span>
                                  {val.count && (
                                    <span className="text-xs text-[#2D2D2D]">({val.count})</span>
                                  )}
                                </div>
                              </label>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Fabric */}
                    {filters?.fabrics?.length > 0 && (
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-400 font-[Oxygen] text-[#414141] text-lg block">Fabric</span>
                          <div
                            onClick={() => setFabricExpanded(!fabricExpanded)}
                            className="cursor-pointer p-1 rounded transition-colors"
                          >
                            {fabricExpanded ? (
                              <ChevronUp className="w-4 h-4 text-[#414141] group-hover:text-gray-600 transition-transform" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-[#414141] group-hover:text-gray-600 transition-transform" />
                            )}
                          </div>
                        </div>
                        {fabricExpanded && (
                          <div className="space-y-1">
                            {filters.fabrics.map((val) => (
                              <label
                                key={val.f_id}
                                className="flex items-center justify-between group cursor-pointer p-2 hover:bg-white/50 rounded-md transition-colors"
                              >
                                <div className="flex items-center gap-3">
                                  <input
                                    type="checkbox"
                                    checked={selectedFabrics.includes(val.f_id)}
                                    onChange={() => toggleFabric(val.f_id)}
                                    className="w-4 h-4 text-[#73287E] border-[#73287E] rounded focus:ring-[#73287E] cursor-pointer accent-[#73287E]"
                                  />
                                  <span className="text-sm text-[#2D2D2D] font-[Oxygen] font-400 capitalize">{val?.name}</span>
                                </div>
                              </label>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Work */}
                    {filters.works.length > 0 && (
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-400 font-[Oxygen] text-[#414141] text-lg block">Work</span>
                          <div
                            onClick={() => setWorkExpanded(!workExpanded)}
                            className="cursor-pointer p-1 rounded transition-colors"
                          >
                            {workExpanded ? (
                              <ChevronUp className="w-4 h-4 text-[#414141] group-hover:text-gray-600 transition-transform" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-[#414141] group-hover:text-gray-600 transition-transform" />
                            )}
                          </div>
                        </div>
                        {workExpanded && (
                          <div className="space-y-1">
                            {filters.works.map((val) => (
                              <label
                                key={val.work_id}
                                className="flex items-center justify-between group cursor-pointer p-2 hover:bg-white/50 rounded-md transition-colors"
                              >
                                <div className="flex items-center gap-3">
                                  <input
                                    type="checkbox"
                                    checked={selectedWorks.includes(val.work_id)}
                                    onChange={() => toggleWork(val.work_id)}
                                    className="w-4 h-4 text-[#73287E] border-[#73287E] rounded focus:ring-[#73287E] cursor-pointer accent-[#73287E]"
                                  />
                                  <span className="text-sm text-[#2D2D2D] font-[Oxygen] font-400 capitalize">{val?.name}</span>
                                </div>
                              </label>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Occasion */}
                    {filters.occasions.length > 0 && (
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-400 font-[Oxygen] text-[#414141] text-lg block">Occasion</span>
                          <div
                            onClick={() => setOccasionExpanded(!occasionExpanded)}
                            className="cursor-pointer p-1 rounded transition-colors"
                          >
                            {occasionExpanded ? (
                              <ChevronUp className="w-4 h-4 text-[#414141] group-hover:text-gray-600 transition-transform" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-[#414141] group-hover:text-gray-600 transition-transform" />
                            )}
                          </div>
                        </div>
                        {occasionExpanded && (
                          <div className="space-y-1">
                            {filters.occasions.map((val) => (
                              <label
                                key={val.occasion_id}
                                className="flex items-center justify-between group cursor-pointer p-2 hover:bg-white/50 rounded-md transition-colors"
                              >
                                <div className="flex items-center gap-3">
                                  <input
                                    type="checkbox"
                                    checked={selectedOccasions.includes(val.occasion_id)}
                                    onChange={() => toggleOccasion(val.occasion_id)}
                                    className="w-4 h-4 text-[#73287E] border-[#73287E] rounded focus:ring-[#73287E] cursor-pointer accent-[#73287E]"
                                  />
                                  <span className="text-sm text-[#2D2D2D] font-[Oxygen] font-400 capitalize">{val?.name}</span>
                                </div>
                              </label>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Style */}
                    {filters.styles.length > 0 && (
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-400 font-[Oxygen] text-[#414141] text-lg block">Style</span>
                          <div
                            onClick={() => setStyleExpanded(!styleExpanded)}
                            className="cursor-pointer p-1 rounded transition-colors"
                          >
                            {styleExpanded ? (
                              <ChevronUp className="w-4 h-4 text-[#414141] group-hover:text-gray-600 transition-transform" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-[#414141] group-hover:text-gray-600 transition-transform" />
                            )}
                          </div>
                        </div>
                        {styleExpanded && (
                          <div className="space-y-1">
                            {filters.styles.map((val) => (
                              <label
                                key={val.style_id}
                                className="flex items-center justify-between group cursor-pointer p-2 hover:bg-white/50 rounded-md transition-colors"
                              >
                                <div className="flex items-center gap-3">
                                  <input
                                    type="checkbox"
                                    checked={selectedStyles.includes(val.style_id)}
                                    onChange={() => toggleStyle(val.style_id)}
                                    className="w-4 h-4 text-[#73287E] border-[#73287E] rounded focus:ring-[#73287E] cursor-pointer accent-[#73287E]"
                                  />
                                  <span className="text-sm text-[#2D2D2D] font-[Oxygen] font-400 capitalize">{val?.name}</span>
                                </div>
                              </label>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Size */}
                    {filters.sizes.length > 0 && (
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-400 font-[Oxygen] text-[#414141] text-lg block">Size</span>
                          <div
                            onClick={() => setSizeExpanded(!sizeExpanded)}
                            className="cursor-pointer p-1 rounded transition-colors"
                          >
                            {sizeExpanded ? (
                              <ChevronUp className="w-4 h-4 text-[#414141] group-hover:text-gray-600 transition-transform" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-[#414141] group-hover:text-gray-600 transition-transform" />
                            )}
                          </div>
                        </div>
                        {sizeExpanded && (
                          <div className="space-y-1">
                            {filters.sizes.map((val) => (
                              <label
                                key={val.size_id}
                                className="flex items-center gap-3 group cursor-pointer p-2 hover:bg-white/50 rounded-md transition-colors"
                              >
                                <input
                                  type="checkbox"
                                  checked={selectedSizes.includes(val.size_id)}
                                  onChange={() => toggleSizeNew(val.size_id)}
                                  className="w-4 h-4 text-[#73287E] border-[#73287E] rounded focus:ring-[#73287E] cursor-pointer accent-[#73287E]"
                                />
                                <span className="text-sm text-[#2D2D2D] font-[Oxygen] font-400">{val?.size_name}</span>
                              </label>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Color - Global */}
                    {allColors?.length > 0 && (
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-400 font-[Oxygen] text-[#414141] text-lg block">Color</span>
                          <div
                            onClick={() => setColorExpanded(!colorExpanded)}
                            className="cursor-pointer p-1 rounded transition-colors"
                          >
                            {colorExpanded ? (
                              <ChevronUp className="w-4 h-4 text-[#414141] group-hover:text-gray-600 transition-transform" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-[#414141] group-hover:text-gray-600 transition-transform" />
                            )}
                          </div>
                        </div>
                        {colorExpanded && (
                          <div className="grid grid-cols-5 gap-3">
                            {allColors?.map((color) => (
                              <label
                                key={color.color_id}
                                className="flex flex-col items-center cursor-pointer group"
                              >
                                <div className="relative w-8 h-8 sm:w-10 sm:h-10">
                                  <div
                                    className={`w-full h-full rounded-full border-2 transition-all shadow-sm ${selectedColors.includes(color.color_id)
                                      ? "border-black ring-2 ring-offset-2 ring-gray-200"
                                      : "border-transparent group-hover:border-gray-300"
                                      }`}
                                    style={{
                                      backgroundColor: color.color_code || "#ffffff",
                                    }}
                                  />
                                  {selectedColors.includes(color.color_id) && (
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                      <svg
                                        className="w-4 h-4 text-white drop-shadow-md"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth="3"
                                          d="M5 13l4 4L19 7"
                                        />
                                      </svg>
                                    </div>
                                  )}
                                </div>
                                <span className="mt-1.5 text-[10px] sm:text-xs text-gray-600 text-center capitalize w-full truncate">
                                  {color.color_name}
                                </span>
                                <input
                                  type="checkbox"
                                  checked={selectedColors.includes(color.color_id)}
                                  onChange={() => toggleColor(color.color_id)}
                                  className="hidden"
                                />
                              </label>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-[#f3f0ed] border border-gray-200 rounded-lg overflow-hidden lg:sticky shadow-sm">
                {/* --- PRICE RANGE SECTION --- */}
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between sm:p-4 p-2 border-b border-gray-200">
                    <h2 className="text-xl font-400 text-[#2D2D2D] font-[Oxygen] border-l-4 pl-2">Price Range</h2>
                  </div>

                  {/* Price Content */}
                  <div className="p-2 px-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="relative w-1/2">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">₹</span>
                          <input
                            type="number"
                            min={0}
                            value={priceRange[0]}
                            onChange={(e) =>
                              setPriceRange([Number(e.target.value), priceRange[1]])
                            }
                            className="w-full pl-6 pr-2 py-2 bg-white border border-gray-300 rounded text-sm focus:outline-none focus:border-black transition-colors text-gray-700 font-medium placeholder-gray-400"
                            placeholder="Min"
                          />
                        </div>
                        <div className="relative w-1/2">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">₹</span>
                          <input
                            type="number"
                            min={0}
                            value={Math.ceil(priceRange[1] / 1000) * 1000}
                            onChange={(e) =>
                              setPriceRange([priceRange[0], Number(e.target.value)])
                            }
                            className="w-full pl-6 pr-2 py-2 bg-white border border-gray-300 rounded text-sm focus:outline-none focus:border-black transition-colors text-gray-700 font-medium placeholder-gray-400"
                            placeholder="Max"
                          />
                        </div>
                      </div>
                      <div className="flex justify-between items-center pt-1">
                        <span className="text-xs text-[#2c2c2c] font-medium py-1 rounded">
                          ₹{priceRange[0]}
                        </span>
                        <span className="text-xs text-[#2c2c2c]">to</span>
                        <span className="text-xs text-[#2c2c2c] font-medium py-1 rounded">
                          ₹{Math.ceil(priceRange[1] / 1000) * 1000}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </aside>

            {/* 
              CHANGED 3: Main Content
              Removed h-full and overflow-y-auto.
              Now it acts as a normal block element, allowing the page to scroll naturally.
            */}
            <main className="flex-1 min-w-0">
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-['Judson'] font-bold font-700 capitalize text-[#000000] mb-4 leading-tight">
                {activeFilterName
                  ? `${activeFilterName} - ${categoryDisplayName} Collection`
                  : `${categoryDisplayName} Collection`}
              </h2>
              {/* Search Bar - matches top image */}
              <div className="w-full mb-6">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search An Item"
                    className="w-full rounded-full border border-gray-200 bg-[#f8f6f4] py-3 pl-5 pr-24 text-gray-700 text-base focus:outline-none focus:ring-2 focus:ring-gray-300"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                  {searchTerm && (
                    <button
                      className="absolute right-12 top-1/2 -translate-y-1/2 bg-gray-500 hover:bg-gray-600 text-white rounded-full w-8 h-8 flex items-center justify-center"
                      onClick={clearSearch}
                      aria-label="Clear search"
                      type="button"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                  <button
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-gray-700 hover:bg-gray-800 text-white rounded-full w-8 h-8 flex items-center justify-center"
                    onClick={handleSearch}
                    aria-label="Search"
                    type="button"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <p className="text-sm text-gray-600">
                  Showing{" "}
                  <span className="font-semibold">
                    {totalProducts === 0 ? 0 : (currentPage - 1) * limit + 1} -{" "}
                    {Math.min(currentPage * limit, totalProducts)}
                  </span>{" "}
                  of <span className="font-semibold">{totalProducts}</span>{" "}
                  item(s)
                </p>
                
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 font-medium">Sort by:</span>
                  <select 
                    value={sortBy}
                    onChange={(e) => {
                      setSortBy(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="bg-transparent border-none text-sm font-semibold text-gray-900 focus:ring-0 cursor-pointer outline-none"
                  >
                    <option value="a-z">Alphabetical (A-Z)</option>
                    <option value="z-a">Alphabetical (Z-A)</option>
                    <option value="low-high">Price (Low to High)</option>
                    <option value="high-low">Price (High to Low)</option>
                  </select>
                </div>
              </div>

              {products?.length > 0 ? (
                <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-3 sm:gap-6 pb-8">
                  {products?.map((product) => (
                    <ProductCard
                      key={product.p_id}
                      product={product}
                      wishlistMap={wishlistMap}
                      onWishlistChange={refreshWishlist}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <p className="text-gray-500 text-lg mb-2">
                    No products found
                  </p>
                  <button
                    onClick={clearAllFilters}
                    className="text-black underline hover:text-gray-700"
                  >
                    Clear all filters
                  </button>
                </div>
              )}

              {/* Pagination Controls */}
              {totalProducts > 0 && (
                <div className="flex flex-col items-center mt-12 mb-16">
                  <p className="text-[#767676] mb-4 text-[14px]">
                    Showing 1&ndash;{products.length} of {totalProducts} item(s)
                  </p>
                  <div className="w-64 h-[2px] bg-[#E5E7EB] mb-8 relative">
                    <div
                      className="absolute top-0 left-0 h-full bg-[#1C2F2F] transition-all duration-500"
                      style={{ width: `${Math.min((products.length / totalProducts) * 100, 100)}%` }}
                    />
                  </div>
                  {products.length < totalProducts && (
                    <button
                      onClick={() => setCurrentPage(prev => prev + 1)}
                      className="bg-[#2D2D2D] hover:bg-black text-white px-8 py-3 rounded-[30px] font-medium transition-colors flex items-center gap-2"
                    >
                      Load More <ChevronRight className="w-5 h-5" />
                    </button>
                  )}
                </div>
              )}
            </main>
          </div>
        </div >
      </div >
    </>
  );
};
export default Allproducts;
