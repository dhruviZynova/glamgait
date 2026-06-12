import { useEffect, useState, useCallback, useRef } from "react";
import { Star, Truck, Package, Minus, Plus, AlertCircle, Heart, Loader2 } from "lucide-react";
import { FaChevronRight } from "react-icons/fa";
import { Link, useNavigate, useParams } from "react-router-dom";
import VideoPopUp from "../Ui/VideoPopUp";
import ImagePop from "../Ui/ImagePop";
import ReturnsDetails from "../Information/ReturnsDetails";
import { ApiURL, createSlug } from "../Variable";
import { useUser } from "../Context/UserContext";
import axiosInstance from "../Axios/axios";
import ReletedProduct from "../Components/ReletedProduct";
import { getGuestId } from "../utils/guest";
import toast from "react-hot-toast";
import Review from "./Review";
import SingleProductSkeleton from "./skeletons/SingleProductSkeleton";
import { Helmet } from "@dr.pogodin/react-helmet";

import gpay from "../assets/gpay.png";
import paypal from "../assets/paypal.png";
import razorpay from "../assets/razorpay.png";
import stripe from "../assets/stripe.png";
import applepay from "../assets/applepay.png";
import visa from "../assets/visa.webp";
import mastercard from "../assets/mastercard.png";

function SingleProduct() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [productLoading, setProductLoading] = useState(true);

  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [showSizePopup, setShowSizePopup] = useState(false);
  const [selectedColorImages, setSelectedColorImages] = useState([]);
  const [videoFiles, setVideoFiles] = useState([]);
  const [availableStock, setAvailableStock] = useState(0);
  const [reviewsSummary, setReviewsSummary] = useState({});
  const [activeTab, setActiveTab] = useState("description");
  const [wishlistMap, setWishlistMap] = useState({});

  // Mobile slider index
  const [mobileIndex, setMobileIndex] = useState(0);
  const mobileSliderRef = useRef(null);

  // Lightbox
  const [lightboxImage, setLightboxImage] = useState(null);

  const [addToCartLoading, setAddToCartLoading] = useState(false);
  const [buyNowLoading, setBuyNowLoading] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  const navigate = useNavigate();
  const { user } = useUser();

  // Refs for scrolling to images from the thumb rail
  const imageRefs = useRef([]);

  const fetchReviewsSummary = useCallback(async () => {
    if (!product?.p_id) return;
    try {
      const res = await axiosInstance.post(`${ApiURL}/getreviewsformultiple`, {
        p_ids: [product.p_id],
      });
      if (res.data.status === 1 && res.data.data?.[product.p_id]) {
        setReviewsSummary(res.data.data[product.p_id]);
      } else {
        setReviewsSummary({ average_rating: 0, total_reviews: 0 });
      }
    } catch {
      setReviewsSummary({ average_rating: 0, total_reviews: 0 });
    }
  }, [product?.p_id]);

  useEffect(() => { fetchReviewsSummary(); }, [fetchReviewsSummary]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  useEffect(() => {
    const fetchProduct = async () => {
      setProductLoading(true);
      try {
        const res = await axiosInstance.get(`${ApiURL}/getproductbyname/${slug}`);
        if (res.data.status === 1) {
          const data = res.data.data;
          const stockMap = {};
          data.productvariants?.forEach((v) => {
            stockMap[`${v.pcolor_id}-${v.psize_id || "nosize"}`] = v.remaining_qty;
          });

          const enhancedColors = data.productcolors.map((color) => {
            const sizes = data.productsizes?.length > 0
              ? data.productsizes.map((ps) => {
                const qty = stockMap[`${color.pcolor_id}-${ps.psize_id}`] || 0;
                return { ...ps, remaining_qty: qty, in_stock: qty > 0 };
              })
              : [{
                psize_id: null,
                size: { size_name: "Free Size" },
                remaining_qty: stockMap[`${color.pcolor_id}-nosize`] || 0,
                in_stock: true,
              }];
            return {
              ...color,
              sizes,
              has_stock: sizes.some((s) => s.in_stock),
              total_available: sizes.reduce((sum, s) => sum + s.remaining_qty, 0),
            };
          });

          const enhancedProduct = {
            ...data,
            productcolors: enhancedColors,
            has_sizes: data.productsizes?.length > 0,
          };
          setProduct(enhancedProduct);
        }
      } catch (err) {
        toast.error(err.message || "Product not found");
      } finally {
        setProductLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  useEffect(() => {
    if (!product) return;
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "view_content",
      content_name: product.name,
      content_ids: [product.p_id],
      value: product.price,
      currency: "INR",
    });
    if (product?.category?.cate_name) {
      sessionStorage.setItem("activeCategorySlug", createSlug(product.category.cate_name));
      window.dispatchEvent(new Event("activeCategoryChanged"));
    }
  }, [product]);

  useEffect(() => {
    if (selectedColor && selectedSize) setAvailableStock(selectedSize.remaining_qty || 0);
  }, [selectedColor, selectedSize]);

  useEffect(() => {
    if (product) {
      const firstColor = product.productcolors.find((c) => c.has_stock) || product.productcolors[0];
      if (firstColor) handleColorChange(firstColor, true);
    }
    // eslint-disable-next-line
  }, [product]);

  const handleColorChange = (color, isInitial = false) => {
    setSelectedColor(color);
    const images = color.productimages?.map((img) => img.image_url) || [];
    const imgs = images.filter((f) => !/\.(mp4|mov|webm)$/i.test(f));
    const vids = images.filter((f) => /\.(mp4|mov|webm)$/i.test(f));
    setSelectedColorImages(imgs);
    setVideoFiles(vids);

    const firstSize = color.sizes.find((s) => s.in_stock) || color.sizes[0];
    if (firstSize) {
      setSelectedSize(firstSize);
      setAvailableStock(firstSize.remaining_qty);
    } else {
      setSelectedSize(null);
      setAvailableStock(0);
    }

    if (!isInitial) {
      setMobileIndex(0);
      if (mobileSliderRef.current) {
        mobileSliderRef.current.scrollTo({ left: 0, behavior: "instant" });
      }
      // Scroll back to first image on color change
      setTimeout(() => {
        imageRefs.current[0]?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 50);
    }
  };

  const handleAddToCart = async () => {
    if (addToCartLoading) return;
    window.dataLayer?.push({
      event: "add_to_cart",
      content_name: product.name,
      content_ids: [product.p_id],
      value: product.price,
      currency: "INR",
    });
    if (!selectedColor) return toast.error("Please select a color");
    if (product?.has_sizes && !selectedSize) return toast.error("Please select a size");
    if (availableStock < quantity) return toast.error(`Only ${availableStock} left in stock`);

    setAddToCartLoading(true);
    try {
      if (!user?.u_id) {
        const cartItems = JSON.parse(localStorage.getItem("localCart") || "[]");
        const idx = cartItems.findIndex(
          (i) => i.p_id === product.p_id && i.pcolor_id === selectedColor.pcolor_id && i.psize_id === (selectedSize?.psize_id || null)
        );
        if (idx !== -1) cartItems[idx].quantity += quantity;
        else cartItems.push({
          p_id: product.p_id, pcolor_id: selectedColor.pcolor_id,
          psize_id: selectedSize?.psize_id || null, quantity,
          product_name: product.name, price: product.price, original_price: product.original_price,
          image_url: selectedColor.productimages?.[0]?.image_url || "",
          color_name: selectedColor.color.color_name,
          size_name: selectedSize?.size?.size_name || null, available_stock: availableStock,
        });
        localStorage.setItem("localCart", JSON.stringify(cartItems));
        window.dispatchEvent(new Event("cartUpdated"));
        toast.success("Added to cart!");
        return;
      }
      const res = await axiosInstance.post(`${ApiURL}/createcart`, {
        u_id: user.u_id, guest_id: null, p_id: product.p_id,
        pcolor_id: selectedColor.pcolor_id, psize_id: selectedSize?.psize_id || null, quantity,
      });
      if (res.data.status === 1) {
        toast.success("Added to cart!");
        window.dispatchEvent(new Event("cartUpdated"));
      } else toast.error(res.data.description || "Failed to add");
    } catch (err) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setAddToCartLoading(false);
    }
  };

  const handleBuyNow = async () => {
    if (!user?.u_id) {
      toast.error("Please login to buy this product");
      navigate("/login", { state: { from: `/product/${slug}` } });
      return;
    }
    if (buyNowLoading) return;
    if (!selectedColor) return toast.error("Please select a color");
    if (product.has_sizes && !selectedSize) return toast.error("Please select a size");
    if (availableStock < quantity) return toast.error(`Only ${availableStock} left`);
    setBuyNowLoading(true);
    try {
      const res = await axiosInstance.post(`${ApiURL}/createcart`, {
        u_id: user?.u_id || null,
        guest_id: user?.u_id ? null : getGuestId(),
        p_id: product.p_id, pcolor_id: selectedColor.pcolor_id,
        psize_id: product.has_sizes ? selectedSize.psize_id : null, quantity,
      });
      if (res.data.status === 1) {
        navigate("/checkout", {
          state: {
            cartItems: [{
              p_id: product.p_id, product_name: product.name, price: product.price, quantity,
              image_url: selectedColor.productimages[0]?.image_url,
              color_name: selectedColor.color.color_name,
              size_name: product.has_sizes ? selectedSize.size.size_name : "Free Size",
              pcolor_id: selectedColor.pcolor_id,
              psize_id: product.has_sizes ? selectedSize.psize_id : null,
            }],
          },
        });
      }
    } catch (err) {
      toast.error(err.message || "Buy Now failed");
    } finally {
      setBuyNowLoading(false);
    }
  };

  const isFetchingWishlist = useRef(false);
  const fetchWishlist = useCallback(async () => {
    if (!user?.u_id) {
      const local = JSON.parse(localStorage.getItem("localWishlist") || "[]");
      const map = {};
      local.forEach((item, i) => {
        map[`${item.p_id}-${item.pcolor_id}`] = { wished: true, w_id: `local-${i}` };
      });
      setWishlistMap(map);
      return;
    }
    if (isFetchingWishlist.current) return;
    isFetchingWishlist.current = true;
    try {
      const res = await axiosInstance.get(`/getwishlist?u_id=${user.u_id}`);
      if (res.data.status === 1) {
        const map = {};
        (res.data.data || []).forEach((item) => {
          map[`${item.p_id}-${item.pcolor_id}`] = { wished: true, w_id: item.w_id };
        });
        setWishlistMap(map);
      }
    } catch (e) { console.error(e); }
    finally { isFetchingWishlist.current = false; }
  }, [user?.u_id]);

  useEffect(() => { fetchWishlist(); }, [fetchWishlist]);

  const toggleWishlist = async (e) => {
    e.stopPropagation();
    if (wishlistLoading) return;
    if (!selectedColor) return toast.error("Please select a color");

    const key = `${product.p_id}-${selectedColor.pcolor_id}`;
    const data = wishlistMap[key];
    const isWished = !!data;
    setWishlistLoading(true);
    try {
      if (!user?.u_id) {
        let local = JSON.parse(localStorage.getItem("localWishlist") || "[]");
        const payload = {
          p_id: product.p_id, sc_id: product.sc_id,
          pcolor_id: selectedColor.pcolor_id, psize_id: selectedSize?.psize_id || null,
          product_name: product.name, price: product.price, original_price: product.original_price,
          image_url: selectedColor.productimages?.[0]?.image_url || "",
          color_name: selectedColor.color.color_name,
          size_name: selectedSize?.size?.size_name || null, stock_qty: availableStock,
        };
        const idx = local.findIndex((i) => i.p_id === product.p_id && i.pcolor_id === payload.pcolor_id);
        if (isWished || idx !== -1) {
          if (idx !== -1) local.splice(idx, 1);
          toast.success("Removed from wishlist");
        } else {
          local.push(payload);
          toast.success("Added to wishlist");
        }
        localStorage.setItem("localWishlist", JSON.stringify(local));
        window.dispatchEvent(new Event("wishlistUpdated"));
        fetchWishlist();
        return;
      }
      if (isWished && data.w_id) {
        const res = await axiosInstance.post(`${ApiURL}/removewishlist`, { w_id: data.w_id });
        if (res.data.status === 1) {
          toast.success("Removed from wishlist");
          window.dispatchEvent(new Event("wishlistUpdated"));
          fetchWishlist();
        }
      } else {
        const res = await axiosInstance.post(`${ApiURL}/addtowishlist`, {
          u_id: user.u_id, guest_id: null, p_id: product.p_id, sc_id: product.sc_id,
          pcolor_id: selectedColor.pcolor_id, psize_id: selectedSize?.psize_id || null,
        });
        if (res.data.status === 1) {
          toast.success("Added to wishlist");
          window.dispatchEvent(new Event("wishlistUpdated"));
          fetchWishlist();
        } else toast.error(res.data.description || "Already in wishlist");
      }
    } catch (err) {
      toast.error("Wishlist action failed");
    } finally {
      setWishlistLoading(false);
    }
  };

  const discountPercent = product?.original_price > product?.price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100) : 0;

  if (productLoading) return <SingleProductSkeleton />;
  if (!product) return null;

  const allMedia = selectedColorImages.length > 0
    ? selectedColorImages
    : product.productcolors?.flatMap((c) => c.productimages.map((img) => img.image_url)) || [];

  const imageFiles = allMedia.filter((f) => !/\.(mp4|mov|avi|mkv|webm)$/i.test(f));
  const videoFilesFromAll = allMedia.filter((f) => /\.(mp4|mov|avi|mkv|webm)$/i.test(f));
  const finalVideoFiles = videoFiles.length > 0 ? videoFiles : videoFilesFromAll;
  const isWishlisted = !!wishlistMap[`${product.p_id}-${selectedColor?.pcolor_id}`];

  const handleMobileScroll = () => {
    const container = mobileSliderRef.current;
    if (container) {
      const width = container.offsetWidth;
      const scrollLeft = container.scrollLeft;
      const index = Math.round(scrollLeft / width);
      if (index !== mobileIndex && index >= 0 && index < imageFiles.length) {
        setMobileIndex(index);
      }
    }
  };

  const handleMobileThumbnailClick = (i) => {
    setMobileIndex(i);
    const container = mobileSliderRef.current;
    if (container) {
      const width = container.offsetWidth;
      container.scrollTo({
        left: i * width,
        behavior: "smooth",
      });
    }
  };

  const scrollToImage = (i) => {
    imageRefs.current[i]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <Helmet>
        <title>{product.meta_title}</title>
        <meta name="description" content={product.meta_description} />
        <meta name="keywords" content={product.meta_keywords} />
      </Helmet>

      <div className="px-2 py-6 pb-16 md:px-10 lg:px-20">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-[#9A8F87] mb-6 flex-wrap">
          <Link
            to={product?.category?.cate_name ? `/collections/${createSlug(product.category.cate_name)}` : "/collections/All Products"}
            className="hover:text-[#3D2C25] shrink-0"
          >
            Collections
          </Link>
          <FaChevronRight className="text-[10px] shrink-0" />
          <span className="text-[#3D2C25] break-words">{product.name}</span>
        </div>

        {/* ═══════════════ MAIN GRID ═══════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-[580px_1fr] gap-8 lg:gap-12 xl:gap-16 items-start max-w-7xl mx-auto">

          {/* ═══════════════ LEFT — STACKED GALLERY (desktop) & SLIDER (mobile) ═══════════════ */}
          <div className="w-full">
            {/* Desktop stacked gallery */}
            <div className="hidden lg:flex md:gap-12 gap-6 w-full">
              {/* Optional desktop thumbnail rail — sticky, click to scroll */}
              {imageFiles.length > 1 && (
                <div className="flex sticky top-24 self-start flex-col gap-3 max-h-[calc(100vh-7rem)] overflow-y-auto pr-1 scrollbar-thin">
                  {imageFiles.map((file, i) => (
                    <button
                      key={i}
                      onClick={() => scrollToImage(i)}
                      className="flex-shrink-0 w-[64px] h-[80px] rounded-md overflow-hidden border border-[#E8E0DA] hover:border-[#3D2C25] transition-all cursor-pointer"
                    >
                      <img
                        src={`${ApiURL}/assets/Products/${file}`}
                        alt={`thumb-${i}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* All images stacked vertically */}
              <div className="flex-1 flex flex-col gap-3">
                {imageFiles.map((file, i) => (
                  <div
                    key={i}
                    ref={(el) => (imageRefs.current[i] = el)}
                    onClick={() => setLightboxImage(file)}
                    className="relative w-full bg-[#F5F1EE] rounded-lg overflow-hidden cursor-zoom-in group"
                  >
                    <img
                      src={`${ApiURL}/assets/Products/${file}`}
                      alt={`${product.name}-${i}`}
                      className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                      loading={i === 0 ? "eager" : "lazy"}
                    />
                    {i === 0 && discountPercent > 0 && (
                      <div className="absolute top-4 left-4 bg-[#3D2C25] text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                        -{discountPercent}% OFF
                      </div>
                    )}
                    {i === 0 && availableStock <= 0 && (
                      <div className="absolute top-4 right-4 bg-red-600 text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                        Out of Stock
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile / Tablet slider (lg:hidden) */}
            <div className="block lg:hidden w-full relative">
              <div className="relative overflow-hidden w-full rounded-lg bg-[#F5F1EE]" style={{ aspectRatio: "3/4" }}>
                <div
                  ref={mobileSliderRef}
                  onScroll={handleMobileScroll}
                  className="flex w-full h-full overflow-x-auto snap-x snap-mandatory hide-scrollbar scroll-smooth"
                >
                  {imageFiles.map((file, i) => (
                    <div key={i} className="w-full h-full flex-shrink-0 snap-start snap-always relative">
                      <img
                        src={`${ApiURL}/assets/Products/${file}`}
                        alt={`${product.name}-${i}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>

                {/* Badges */}
                {discountPercent > 0 && (
                  <div className="absolute top-3 left-3 bg-[#3D2C25] text-white text-xs font-semibold px-2.5 py-1 rounded-full pointer-events-none">
                    -{discountPercent}% OFF
                  </div>
                )}
                {availableStock <= 0 && (
                  <div className="absolute top-3 right-3 bg-red-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full pointer-events-none">
                    Out of Stock
                  </div>
                )}
              </div>

              {/* Horizontal Thumbnails row */}
              {imageFiles.length > 1 && (
                <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 mt-3">
                  {imageFiles.map((file, i) => (
                    <button
                      key={i}
                      onClick={() => handleMobileThumbnailClick(i)}
                      className={`flex-shrink-0 w-14 h-18 overflow-hidden border cursor-pointer transition-all rounded-none ${mobileIndex === i ? "border-black" : "border-gray-200 opacity-60"
                        }`}
                    >
                      <img
                        src={`${ApiURL}/assets/Products/${file}`}
                        alt={`thumb-${i}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ═══════════════ RIGHT — STICKY INFO PANEL ═══════════════ */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <div className="space-y-6">
              {/* Title */}
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-2xl lg:text-3xl font-semibold text-[#1E1512] leading-tight">
                    {product.name}
                  </h1>
                  {(product?.sku || product?.p_id) && (
                    <p className="text-xs text-[#9A8F87] mt-2 tracking-wider">
                      SKU: {product.sku || `KDT-${product.p_id}`}
                    </p>
                  )}
                </div>
              </div>

              {/* Price + rating */}
              <div className="flex items-center gap-4 flex-wrap">
                <span className="text-2xl font-semibold text-[#1E1512]">
                  ₹{product.price.toLocaleString("en-IN")}
                </span>
                {product.original_price > product.price && (
                  <span className="text-base text-[#9A8F87] line-through">
                    ₹{product.original_price.toLocaleString("en-IN")}
                  </span>
                )}
                <div className="h-5 w-px bg-[#E8E0DA]" />
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < Math.round(reviewsSummary.average_rating || 0)
                          ? "fill-yellow-400 text-yellow-400" : "text-[#E8E0DA]"}`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-[#9A8F87]">
                    ({reviewsSummary.total_reviews || 0})
                  </span>
                </div>
              </div>

              {availableStock > 0 && availableStock <= 5 && (
                <p className="text-sm text-orange-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" /> Only {availableStock} left
                </p>
              )}

              {/* Colors */}
              {product?.productcolors?.length > 0 && (
                <div className="pb-2">
                  <p className="text-sm font-medium text-[#1E1512] mb-4">
                    Color {selectedColor && <span className="text-[#9A8F87]">— {selectedColor.color.color_name}</span>}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {product.productcolors.map((color) => (
                      <button
                        key={color.pcolor_id}
                        onClick={() => handleColorChange(color)}
                        title={color.color.color_name}
                        style={{ backgroundColor: color.color.color_code }}
                        className={`w-8 h-8 rounded-full transition cursor-pointer ${selectedColor?.pcolor_id === color.pcolor_id
                          ? "ring-2 ring-offset-2 ring-[#3D2C25] scale-110"
                          : "hover:scale-105"
                          }`}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Sizes */}
              {product.has_sizes && selectedColor?.sizes?.length > 0 && (
                <div className="pb-2">
                  <div className="flex justify-between items-center mb-4">
                    <p className="text-sm font-medium text-[#1E1512]">Size</p>
                    {product?.category?.cate_chart && (
                      <button
                        onClick={() => setShowSizePopup(true)}
                        className="text-xs underline text-[#9A8F87] hover:text-[#3D2C25] cursor-pointer"
                      >
                        Size Guide
                      </button>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedColor.sizes.map((size) => (
                      <button
                        key={size.psize_id}
                        onClick={() => setSelectedSize(size)}
                        disabled={!size.in_stock}
                        className={`min-w-[46px] h-10 px-3 rounded-lg text-sm font-medium border transition cursor-pointer
                          ${selectedSize?.psize_id === size.psize_id
                            ? "bg-[#1E1512] text-white border-[#1E1512]"
                            : size.in_stock
                              ? "bg-white text-[#1E1512] border-[#E8E0DA] hover:border-[#3D2C25]"
                              : "bg-[#F5F1EE] text-[#C5B8B0] border-[#E8E0DA] cursor-not-allowed line-through"}`}
                      >
                        {size.size.size_name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Qty + Actions */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  {/* <span className="text-sm font-medium text-[#1E1512]">Quantity:</span> */}
                  <div className="flex items-center border border-[#E8E0DA] rounded-lg bg-white">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-11 flex items-center justify-center hover:bg-[#F5F1EE] cursor-pointer transition-colors"
                      type="button"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center text-sm font-semibold text-[#1E1512]">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-11 flex items-center justify-center hover:bg-[#F5F1EE] cursor-pointer transition-colors"
                      type="button"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleAddToCart}
                    disabled={addToCartLoading || availableStock <= 0}
                    className="flex-1 h-12 rounded-lg border border-[#1E1512] text-[#1E1512] text-sm font-semibold hover:bg-[#1E1512] hover:text-white transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {addToCartLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Adding...</> : "Add to Cart"}
                  </button>
                  <button
                    onClick={toggleWishlist}
                    className="w-12 h-12 rounded-lg border border-[#E8E0DA] flex items-center justify-center hover:bg-[#F5F1EE] transition-all cursor-pointer flex-shrink-0"
                  >
                    {wishlistLoading
                      ? <Loader2 className="w-4 h-4 animate-spin text-[#3D2C25]" />
                      : <Heart className={`w-5 h-5 ${isWishlisted ? "fill-red-500 text-red-500" : "text-[#3D2C25]"}`} />}
                  </button>
                </div>

                <button
                  onClick={handleBuyNow}
                  disabled={buyNowLoading || availableStock <= 0}
                  className="w-full h-12 rounded-lg bg-[#1E1512] text-white text-sm font-semibold hover:bg-[#3D2C25] transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {buyNowLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</> : "Buy Now"}
                </button>
              </div>

              {/* Shipping & Payment */}
              <div className="pt-4 border-t border-[#E8E0DA] space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Truck className="w-5 h-5 text-[#3D2C25] flex-shrink-0" />
                    <p className="text-sm text-[#5C504A]">Free worldwide shipping on all orders over ₹1500</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Package className="w-5 h-5 text-[#3D2C25] flex-shrink-0" />
                    <p className="text-sm text-[#5C504A]">
                      Delivers in: 3-7 Working Days{" "}
                      <button onClick={() => setShowPopup(true)} className="underline text-[#3D2C25] ml-1 cursor-pointer">
                        Shipping & Return
                      </button>
                    </p>
                  </div>
                </div>

                {/* Payment Gateway Logos */}
                <div className="pt-6 border-t border-dashed border-[#E8E0DA]">
                  <p className="text-xs font-semibold text-[#8C7A70] tracking-wider uppercase mb-4">Guaranteed Safe & Secure Checkout</p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { src: gpay, alt: "GPay" },
                      { src: paypal, alt: "PayPal" },
                      { src: razorpay, alt: "RazorPay" },
                      { src: stripe, alt: "Stripe" },
                      { src: applepay, alt: "ApplePay" },
                      { src: visa, alt: "Visa" },
                      { src: mastercard, alt: "MasterCard" }
                    ].map((gate, i) => (
                      <div key={i} className="w-12 h-8 bg-white border border-[#E8E0DA] rounded flex items-center justify-center transition-all hover:scale-105 hover:border-[#3D2C25] shadow-sm overflow-hidden shrink-0">
                        <img src={gate.src} alt={gate.alt} className="w-full h-full object-contain p-1" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-16 pt-10">
          <div className="flex gap-2">
            {["description", "details", "reviews"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative px-4 pb-2 text-sm font-semibold uppercase tracking-widest cursor-pointer ${activeTab === tab ? "text-[#1E1512] border-b-2 border-[#1E1512] " : "text-[#9A8F87] hover:text-[#3D2C25]"
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="pt-8">
            {activeTab === "description" ? (
              <p className="text-sm text-[#5C504A] leading-relaxed whitespace-pre-line">{product?.description}</p>
            ) : activeTab === "details" ? (
              <div className="max-w-2xl">
                <table className="w-full text-sm text-[#5C504A] border-collapse">
                  <tbody>
                    {product?.category?.cate_name && (
                      <tr className="border-b border-[#E8E0DA]">
                        <td className="py-3 font-semibold text-[#1E1512]">Category</td>
                        <td className="py-3 capitalize">{product.category.cate_name}</td>
                      </tr>
                    )}
                    {product?.subcategory?.name && (
                      <tr className="border-b border-[#E8E0DA]">
                        <td className="py-3 font-semibold text-[#1E1512]">Collection</td>
                        <td className="py-3 capitalize">{product.subcategory.name}</td>
                      </tr>
                    )}
                    {product?.fabric?.name && (
                      <tr className="border-b border-[#E8E0DA]">
                        <td className="py-3 font-semibold text-[#1E1512] w-1/3">Fabric</td>
                        <td className="py-3">{product.fabric.name}</td>
                      </tr>
                    )}
                    {product?.work?.name && (
                      <tr className="border-b border-[#E8E0DA]">
                        <td className="py-3 font-semibold text-[#1E1512]">Work</td>
                        <td className="py-3">{product.work.name}</td>
                      </tr>
                    )}
                    {product?.occasion?.name && (
                      <tr className="border-b border-[#E8E0DA]">
                        <td className="py-3 font-semibold text-[#1E1512]">Occasion</td>
                        <td className="py-3">{product.occasion.name}</td>
                      </tr>
                    )}
                    {product?.style?.name && (
                      <tr className="border-b border-[#E8E0DA]">
                        <td className="py-3 font-semibold text-[#1E1512]">Style</td>
                        <td className="py-3">{product.style.name}</td>
                      </tr>
                    )}
                    {product?.weight && (
                      <tr className="border-b border-[#E8E0DA]">
                        <td className="py-3 font-semibold text-[#1E1512]">Weight</td>
                        <td className="py-3">{product.weight} kg</td>
                      </tr>
                    )}
                    {(product?.length || product?.width || product?.height) && (
                      <tr className="border-b border-[#E8E0DA]">
                        <td className="py-3 font-semibold text-[#1E1512]">Dimensions (L x W x H)</td>
                        <td className="py-3">
                          {[product.length, product.width, product.height].filter(Boolean).join(" x ")} cm
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            ) : (
              <Review productId={product.p_id} />
            )}
          </div>
        </div>

        {/* Popups */}
        {finalVideoFiles.length > 0 && (
          <VideoPopUp
            videos={finalVideoFiles}
            open={false}
            onClose={() => setShowPopup(false)}
            autoPlay
          />
        )}
        {showPopup && <ReturnsDetails onClose={() => setShowPopup(false)} />}
        {showSizePopup && product?.category?.cate_chart && (
          <ImagePop onClose={() => setShowSizePopup(false)} image={product.category.cate_chart} />
        )}
        {lightboxImage && (
          <ImagePop
            onClose={() => setLightboxImage(null)}
            image={`${ApiURL}/assets/Products/${lightboxImage}`}
          />
        )}

        <ReletedProduct sc_id={product.sc_id} currentProductId={product.p_id} />
      </div>
    </>
  );
}

export default SingleProduct;
