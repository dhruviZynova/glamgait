import { useEffect, useState } from "react";
import {
  Star,
  Truck,
  Package,
  Gift,
  Minus,
  Plus,
  AlertCircle,
  Heart,
} from "lucide-react";
import { FaChevronRight } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import VideoPopUp from "../Ui/VideoPopUp";
import ImagePop from "../Ui/ImagePop";
import ReturnsDetails from "../Information/ReturnsDetails";
import { ApiURL, userInfo } from "../Variable";

import axiosInstance from "../Axios/axios";
import ReletedProduct from "../Components/ReletedProduct";
import { getGuestId } from "../utils/guest";
import toast from "react-hot-toast";
import Review from "./Review";
import OfferList from "./OfferList";
import CouponList from "./CouponList";
import { Helmet } from "@dr.pogodin/react-helmet";

function SingleProduct() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [mainIndex, setMainIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [showSizePopup, setShowSizePopup] = useState(false);
  const [selectedColorImages, setSelectedColorImages] = useState([]);
  const [videoFiles, setVideoFiles] = useState([]);
  const [availableStock, setAvailableStock] = useState(0);
  const [reviewsSummary, setReviewsSummary] = useState({});
  const [offers, setOffers] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [activeTab, setActiveTab] = useState("description");
  const [wishlistMap, setWishlistMap] = useState({});

  const navigate = useNavigate();
  const user = userInfo();

  const names = [
    "Yash Rajput",
    "Amit Sharma",
    "Priya Singh",
    "Neha Patel",
    "Ravi Mehta",
    "Karan Verma",
    "Simran Kaur",
    "Rahul Joshi",
    "Pooja Das",
    "Ankit Mishra",
  ];

  const cities = [
    "Mumbai",
    "Delhi",
    "Ahmedabad",
    "Jaipur",
    "Surat",
    "Indore",
    "Pune",
    "Varanasi",
    "Kanpur",
    "Chennai",
  ];

  const times = [
    "2 minutes",
    "5 minutes",
    "9 minutes",
    "14 minutes",
    "18 minutes",
    "25 minutes",
    "31 minutes",
    "40 minutes",
    "45 minutes",
    "50 minutes",
  ];

  const [purchase, setPurchase] = useState({
    name: "Yash Rajput",
    time: "31 minutes",
    city: "Jamnagar",
  });

  useEffect(() => {
    if (!product?.p_id) return;

    const fetchReviewsSummary = async () => {
      try {
        const res = await axiosInstance.post(
          `${ApiURL}/getreviewsformultiple`,
          {
            p_ids: [product.p_id],
          },
        );

        if (res.data.status === 1 && res.data.data[product.p_id]) {
          setReviewsSummary(res.data.data[product.p_id]);
        }
        console.log(res.data.data[product.p_id], "summary");
      } catch (err) {
        console.error("Failed to load reviews summary", err);
      }
    };

    fetchReviewsSummary();
  }, [product?.p_id]);

  useEffect(() => {
    const interval = setInterval(() => {
      const randomName = names[Math.floor(Math.random() * names.length)];
      const randomTime = times[Math.floor(Math.random() * times.length)];
      const randomCity = cities[Math.floor(Math.random() * cities.length)];

      setPurchase({
        name: randomName,
        time: randomTime,
        city: randomCity,
      });
    }, 5000); // change every 5 seconds

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axiosInstance.post(
          `${ApiURL}/getproductbyname/${slug}`,
        );
        if (res.data.status === 1) {
          const data = res.data.data;

          // Enhance with stock info
          const stockMap = {};
          data.productvariants?.forEach((v) => {
            stockMap[`${v.pcolor_id}-${v.psize_id || "nosize"}`] =
              v.remaining_qty;
          });

          const enhancedColors = data.productcolors.map((color) => {
            const sizes =
              data.productsizes?.length > 0
                ? data.productsizes.map((ps) => {
                  const qty =
                    stockMap[`${color.pcolor_id}-${ps.psize_id}`] || 0;
                  return { ...ps, remaining_qty: qty, in_stock: qty > 0 };
                })
                : [
                  {
                    psize_id: null,
                    size: { size_name: "Free Size" },
                    remaining_qty: stockMap[`${color.pcolor_id}-nosize`] || 0,
                    in_stock: true,
                  },
                ];

            return {
              ...color,
              sizes,
              has_stock: sizes.some((s) => s.in_stock),
              total_available: sizes.reduce(
                (sum, s) => sum + s.remaining_qty,
                0,
              ),
            };
          });

          const enhancedProduct = {
            ...data,
            productcolors: enhancedColors,
            has_sizes: data.productsizes?.length > 0,
          };

          setProduct(enhancedProduct);

          // Auto select first available color
          const firstColor = enhancedColors.find((c) => c.has_stock);
          if (firstColor) {
            setSelectedColor(firstColor);
            const firstSize = firstColor.sizes.find((s) => s.in_stock);
            if (firstSize) {
              setSelectedSize(firstSize);
              setAvailableStock(firstSize.remaining_qty);
            }
          }
        }
      } catch (err) {
        toast.error("Product not found");
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
  }, [product]);

  //Update stock when color/size changes
  useEffect(() => {
    if (selectedColor && selectedSize) {
      setAvailableStock(selectedSize.remaining_qty || 0);
    }
  }, [selectedColor, selectedSize]);

  useEffect(() => {
    if (product) {
      const firstColor = product.productcolors.find((c) => c.has_stock);
      if (firstColor) {
        handleColorChange(firstColor); // ← Same function reuse!
      }
    }
  }, [product]);

  //Ek function bana do — sab logic yahan
  const handleColorChange = (color) => {
    setSelectedColor(color);

    // Images update
    const images = color.productimages?.map((img) => img.image_url) || [];
    const imageFiles = images.filter((f) => !/\.(mp4|mov|webm)$/i.test(f));
    const videos = images.filter((f) => /\.(mp4|mov|webm)$/i.test(f));
    console.log(videos, "videos");

    setSelectedColorImages(imageFiles);
    setVideoFiles(videos);
    setMainIndex(0);
    setSelectedImage(null);

    // Size auto select
    const firstSize = color.sizes.find((s) => s.in_stock);
    if (firstSize) {
      setSelectedSize(firstSize);
      setAvailableStock(firstSize.remaining_qty);
    } else {
      setSelectedSize(null);
      setAvailableStock(0);
    }
  };

  const handleAddToCart = async () => {
    window.dataLayer.push({
      event: "add_to_cart",
      content_name: product.name,
      content_ids: [product.p_id],
      value: product.price,
      currency: "INR",
    });
    if (!selectedColor) {
      toast.error("Please select a color");
      return;
    }
    if (product?.has_sizes && !selectedSize) {
      toast.error("Please select a size");
      return;
    }
    if (availableStock < quantity) {
      toast.error(`Only ${availableStock} left in stock`);
      return;
    }

    const payload = {
      u_id: user?.u_id || null,
      guest_id: user?.u_id ? null : getGuestId(),
      p_id: product.p_id,
      pcolor_id: selectedColor.pcolor_id,
      psize_id: selectedSize?.psize_id || null,
      quantity,
    };

    try {
      const res = await axiosInstance.post(`${ApiURL}/createcart`, payload);
      if (res.data.status === 1) {
        toast.success("Added to cart!");
      } else {
        toast.error(res.data.description || "Failed to add");
      }
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  const handleBuyNow = async () => {
    // Validation
    if (!selectedColor) {
      toast.error("Please select a color");
      return;
    }
    if (product.has_sizes && !selectedSize) {
      toast.error("Please select a size");
      return;
    }
    if (availableStock < quantity) {
      toast.error(`Only ${availableStock} left!`);
      return;
    }

    // Yeh payload ab 100% sahi jayega
    const payload = {
      u_id: user?.u_id || null,
      guest_id: user?.u_id ? null : getGuestId(),
      p_id: product.p_id,
      pcolor_id: selectedColor.pcolor_id, // ← Ye ab sahi jayega
      psize_id: product.has_sizes ? selectedSize.psize_id : null, // ← Size na ho to null
      quantity,
    };

    console.log("Buy Now Payload:", payload); // ← Check karne ke liye

    try {
      const res = await axiosInstance.post(`${ApiURL}/createcart`, payload);
      if (res.data.status === 1) {
        const cartItem = {
          p_id: product.p_id,
          product_name: product.name,
          price: product.price,
          quantity,
          image_url: selectedColor.productimages[0]?.image_url,
          color_name: selectedColor.color.color_name,
          size_name: product.has_sizes
            ? selectedSize.size.size_name
            : "Free Size",
          pcolor_id: selectedColor.pcolor_id,
          psize_id: product.has_sizes ? selectedSize.psize_id : null,
        };
        navigate("/selectaddress", { state: { cartItems: [cartItem] } });
      }
    } catch (err) {
      toast.error("Buy Now failed");
    }
  };

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const res = await axiosInstance.post(`${ApiURL}/getoffers`);
        if (res?.data?.status === 1) {
          // show only active offers
          const activeOffers = res.data.data.filter((o) => o.is_active);
          setOffers(activeOffers);
        }
      } catch (err) {
        console.error("Failed to load offers");
      }
    };

    fetchOffers();
  }, []);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const res = await axiosInstance.post(`${ApiURL}/getcoupons`);
        if (res?.data?.status === 1) {
          // show only active offers
          const activeOffers = res.data.data.filter((o) => o.is_active);
          setCoupons(activeOffers);
        }
      } catch (err) {
        console.error("Failed to load offers");
      }
    };

    fetchCoupons();
  }, []);

  const fetchWishlist = async () => {
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
        setWishlistMap(map);
      }
    } catch (err) {
      console.error("Wishlist fetch failed", err);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const toggleWishlist = async (e) => {
    e.stopPropagation();

    if (!selectedColor) {
      toast.error("Please select a color");
      return;
    }

    const wishlistKey = `${product.p_id}-${selectedColor.pcolor_id}`;
    const wishlistData = wishlistMap[wishlistKey];
    const isWished = !!wishlistData;
    const wishlistId = wishlistData?.w_id || null;

    try {
      if (isWished && wishlistId) {
        const res = await axiosInstance.post(`${ApiURL}/removewishlist`, {
          w_id: wishlistId,
        });

        if (res.data.status === 1) {
          toast.success("Removed from wishlist");
          fetchWishlist();
        }
      } else {
        const payload = {
          u_id: user?.u_id || null,
          guest_id: user?.u_id ? null : getGuestId(),
          p_id: product.p_id,
          sc_id: product.sc_id,
          pcolor_id: selectedColor.pcolor_id,
          psize_id: selectedSize?.psize_id || null,
        };

        const res = await axiosInstance.post(
          `${ApiURL}/addtowishlist`,
          payload,
        );

        if (res.data.status === 1) {
          toast.success("Added to wishlist");
          fetchWishlist();
        } else {
          toast.error(res.data.description || "Already in wishlist");
        }
      }
    } catch (err) {
      toast.error("Wishlist action failed");
      console.error(err);
    }
  };

  if (!product) return null;

  // Final image list (from selected color or fallback)
  const allMedia =
    selectedColorImages.length > 0
      ? selectedColorImages
      : product.productcolors?.flatMap((c) =>
        c.productimages.map((img) => img.image_url),
      ) || [];

  const imageFiles = allMedia.filter(
    (file) => !/\.(mp4|mov|avi|mkv|webm)$/i.test(file),
  );
  const videoFilesFromAll = allMedia.filter((file) =>
    /\.(mp4|mov|avi|mkv|webm)$/i.test(file),
  );
  const finalVideoFiles =
    videoFiles.length > 0 ? videoFiles : videoFilesFromAll;

  return (
    <>
      <Helmet>
        <title>{product.meta_title}</title>
        <meta name="description" content={product.meta_description} />
        <meta name="keywords" content={product.meta_keywords} />
        <script type="application/ld+json">{`
    {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": "${product.name}${selectedSize ? " - " + selectedSize.size.size_name : ""
          }${selectedColor ? " in " + selectedColor.color.color_name : ""}",
      "image": [
        "${ApiURL}/assets/Products/${imageFiles[0] || ""}",
        ${imageFiles
            .slice(1)
            .slice(0, 5)
            .map((img) => `"${ApiURL}/assets/Products/${img}"`)
            .join(",")}
      ],
      "description": "${(product.description || "")
            .replace(/"/g, '\\"')
            .replace(/\n/g, " ")}",
      "sku": "${product.sku || product.p_id || ""}",
      "mpn": "${product.mpn || ""
          }",  // add if you have manufacturer part number
      "brand": {
        "@type": "Brand",
        "name": "${product.brand || "Glamgait"}"  // Use your actual brand name
      },
      "color": "${selectedColor?.color?.color_name || ""}",
      "size": "${selectedSize?.size?.size_name || "Free Size"}",
      "offers": {
        "@type": "Offer",
        "url": "${window.location.href}",
        "priceCurrency": "INR",
        "price": "${product.price}",
        "itemCondition": "https://schema.org/NewCondition",
        "availability": "${availableStock > 0
            ? "https://schema.org/InStock"
            : "https://schema.org/OutOfStock"
          }",
        "seller": {
          "@type": "Organization",
          "name": "Glamgait"
        }
      },
      "aggregateRating": ${reviewsSummary.average_rating
            ? `{
        "@type": "AggregateRating",
        "ratingValue": "${reviewsSummary.average_rating.toFixed(1)}",
        "reviewCount": "${reviewsSummary.total_reviews || 0}"
      }`
            : "null"
          }
    }
  `}</script>
      </Helmet>
      <div className="min-h-screen">
        <div className="px-2 py-8 pb-24 md:px-10 lg:px-20">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs sm:text-sm font-[oxygen] font-400 mb-6 sm:mb-8 overflow-x-auto whitespace-nowrap scrollbar-hide">
            <span className="hover:underline cursor-pointer text-[#7B7B7B]">Product Listing</span>
            <span><FaChevronRight className="text-[#7B7B7B]" size={12} /></span>
            <span className="text-[#414141] truncate">{product.name}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">

            {/* ================= LEFT SIDE - IMAGE SECTION ================= */}
            <div className="flex gap-6">

              {/* Thumbnails - Desktop */}
              <div className="hidden lg:flex flex-col gap-4 w-24">
                {imageFiles.map((file, index) => (
                  <div
                    key={index}
                    onClick={() => setMainIndex(index)}
                    className={`cursor-pointer rounded-lg overflow-hidden border-2 transition-all
              ${mainIndex === index
                        ? "border-[#02382A]"
                        : "border-transparent hover:border-gray-300"}`}
                  >
                    <img
                      src={`${ApiURL}/assets/Products/${file}`}
                      className="w-24 h-32 object-cover"
                      alt={`Thumbnail ${index + 1}`}
                    />
                  </div>
                ))}
              </div>

              {/* Main Image */}
              <div className="flex-1">
                <div
                  onClick={() => setSelectedImage(mainIndex)}
                  className="bg-white rounded-[15px] sm:rounded-[20px] overflow-hidden cursor-pointer shadow-sm"
                >
                  <img
                    src={`${ApiURL}/assets/Products/${imageFiles[mainIndex]}`}
                    className="w-full h-[400px] sm:h-[500px] lg:h-[700px] object-cover"
                    alt="Main Product"
                  />
                </div>

                {/* Mobile Thumbnails */}
                <div className="flex gap-2 mt-4 overflow-x-auto lg:hidden scrollbar-hide pb-2">
                  {imageFiles.map((file, index) => (
                    <div
                      key={index}
                      onClick={() => setMainIndex(index)}
                      className={`flex-shrink-0 w-16 h-20 rounded-md overflow-hidden border-2 transition-all
              ${mainIndex === index ? "border-[#02382A]" : "border-gray-200"}`}
                    >
                      <img
                        src={`${ApiURL}/assets/Products/${file}`}
                        className="w-full h-full object-cover"
                        alt=""
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ================= RIGHT SIDE - PRODUCT DETAILS ================= */}
            <div className="space-y-6 sm:space-y-8">

              {/* Title & Wishlist */}
              <div className="flex justify-between items-start gap-4">
                <h1 className="text-2xl sm:text-4xl font-700 font-bold text-[#2D2D2D] font-[Oxygen] leading-tight max-w-[85%]">
                  {product.name}
                </h1>
                <button
                  onClick={toggleWishlist}
                  className="transition bg-none"
                >
                  <Heart
                    className={`${wishlistMap[`${product.p_id}-${selectedColor?.pcolor_id}`]
                      ? "fill-red-500 text-red-500"
                      : "text-[#AEAEAE]"
                      }`}
                  />
                </button>
              </div>

              {/* Price & Rating Row */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-400 font-[oxygen] text-[#414141]">
                    ₹{product.price}
                  </span>
                  {product.original_price > product.price && (
                    <span className="text-xl font-400 font-[oxygen] text-[#414141] line-through">
                      ₹{product.original_price}
                    </span>
                  )}
                </div>

                <div className="h-6 w-px bg-[#000000] mx-1"></div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => {
                      const rating = reviewsSummary.average_rating || 0;
                      return (
                        <Star
                          key={i}
                          className={`w-3 h-3 sm:w-4 sm:h-4 ${i < Math.floor(rating)
                            ? "fill-yellow-400 text-yellow-400"
                            : "fill-gray-200 text-gray-200"
                            }`}
                        />
                      );
                    })}
                  </div>
                  <span className="text-xs sm:text-sm text-gray-600">
                    ({reviewsSummary.total_reviews || 0} reviews)
                  </span>
                </div>
              </div>

              <div className="h-px bg-[#DDDDDD] w-full"></div>

              {/* Description Snippet/Points */}
              <div className="space-y-4">
                <p className="text-[#414141] font-[Oxygen] font-400 leading-relaxed line-clamp-3">
                  {product?.description}
                </p>
              </div>

              {/* Color Selection */}
              {product?.productcolors?.length > 0 && (
                <div>
                  <h3 className="text-sm text-[#414141] font-[Oxygen] font-semibold mb-4 uppercase tracking-wider">Color</h3>
                  <div className="flex gap-4">
                    {product?.productcolors?.map((color) => (
                      <button
                        key={color.pcolor_id}
                        onClick={() => handleColorChange(color)}
                        style={{ backgroundColor: color.color.color_code }}
                        className={`w-8 h-8 rounded-full border-2 transition-all relative
                  ${selectedColor?.pcolor_id === color.pcolor_id
                            ? "border-[#1A1A1A] ring-2 ring-offset-2 ring-[#1A1A1A]"
                            : "border-transparent"
                          }`}
                      >
                        {selectedColor?.pcolor_id === color.pcolor_id && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-1.5 h-1.5 rounded-full bg-white shadow-sm"></div>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size Selection */}
              {product.has_sizes && selectedColor?.sizes?.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-[#1A1A1A] mb-4 uppercase tracking-wider">Size</h3>
                  <div className="flex gap-3 flex-wrap">
                    {selectedColor.sizes.map((size) => (
                      <button
                        key={size.psize_id}
                        onClick={() => setSelectedSize(size)}
                        className={`min-w-12 h-12 px-4 rounded-lg text-sm font-medium border transition-all
                  ${selectedSize?.psize_id === size.psize_id
                            ? "bg-[#1A1A1A] text-white border-[#1A1A1A] shadow-md"
                            : "bg-white text-gray-800 border-gray-200 hover:border-gray-400"
                          }`}
                      >
                        {size.size.size_name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Select & Action Area */}
              <div className="flex flex-col gap-4 sm:gap-6 pt-2">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                  {/* Quantity */}
                  <div className="flex items-center justify-between sm:justify-center bg-white border border-[#D7D7D7] rounded-full p-1 w-full sm:w-auto">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full hover:bg-gray-50 transition text-[#414141]"
                    >
                      <Minus size={18} />
                    </button>
                    <span className="w-12 text-center font-medium text-[#1A1A1A]">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full hover:bg-gray-50 transition text-[#414141]"
                    >
                      <Plus size={18} />
                    </button>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    onClick={handleAddToCart}
                    className="w-full sm:flex-1 bg-[#1F352F] text-white py-4 px-8 rounded-full font-semibold hover:bg-[#152521] transition shadow-md flex items-center justify-center cursor-pointer"
                  >
                    Add to Cart
                  </button>
                </div>

                {/* Buy Now Button */}
                <button
                  onClick={handleBuyNow}
                  className="w-full border-2 border-[#1A1A1A] text-[#1A1A1A] py-4 rounded-full font-bold hover:bg-gray-50 transition cursor-pointer"
                >
                  Buy Now
                </button>
              </div>

              {/* Shipping & Support Info */}
              <div className="pt-8 border-t border-[#DDDDDD] space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 flex items-center justify-center">
                    <Truck size={24} className="text-[#B9B9B9]" />
                  </div>
                  <div>
                    <p className="text-sm text-[#424242] font-medium">Free worldwide shipping on all orders over ₹1500</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 flex items-center justify-center">
                    <Package size={24} className="text-[#B9B9B9]" />
                  </div>
                  <div>
                    <p className="text-sm text-[#424242] font-medium">Delivers in: 3-7 Working Days <span className="underline cursor-pointer ml-1">Shipping & Return</span></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================= TABS SECTION - DESCRIPTION & REVIEWS ================= */}
        <div className="px-4 py-6 md:py-16 md:px-10 lg:px-20">
          <div className="flex items-center gap-6 mb-10 text-2xl font-light">
            <button
              onClick={() => setActiveTab("description")}
              className={`pb-1 transition-all cursor-pointer ${activeTab === "description"
                ? "text-[#696969] font-semibold font-[oxygen]"
                : "text-[#696969] font-400 font-[oxygen]"
                }`}
            >
              Description
            </button>
            <div className="w-px h-6 bg-[#000000]"></div>
            <button
              onClick={() => setActiveTab("reviews")}
              className={`pb-1 transition-all cursor-pointer ${activeTab === "reviews"
                ? "text-[#696969] font-semibold font-[oxygen]"
                : "text-[#696969] font-400 font-[oxygen]"
                }`}
            >
              Reviews
            </button>
          </div>

          <div className="min-h-[300px]">
            {activeTab === "description" ? (
              <div className="animate-fadeIn space-y-8">
                <p className="text-lg text-[#575757] font-[oxygen] leading-relaxed">
                  {product?.description}
                </p>
              </div>
            ) : (
              <div className="animate-fadeIn">
                <Review p_id={product.p_id} />
              </div>
            )}
          </div>
        </div>

        {/* Popup Sections */}
        {finalVideoFiles.length > 0 && (
          <VideoPopUp
            videoSrc={`${ApiURL}/assets/Products/${finalVideoFiles[0]}`}
            onClose={() => setShowPopup(false)}
            autoPlay={true}
          />
        )}
        {showPopup && <ReturnsDetails onClose={() => setShowPopup(false)} />}
        {showSizePopup && product?.category?.cate_chart && (
          <ImagePop
            onClose={() => setShowSizePopup(false)}
            image={product?.category?.cate_chart}
          />
        )}
        <ReletedProduct
          cate_name={product?.category?.cate_name}
          currentProductId={product.p_id}
          cate_id={product?.category?.cate_id}
        />
      </div>
    </>
  );
}

export default SingleProduct;
