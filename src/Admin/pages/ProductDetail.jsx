/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  RefreshCw,
  ArrowLeft,
  Tag,
  Package,
  Layers,
  Play,
} from "lucide-react";
import ProductModal from "./ProductModel";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import { ApiURL, showToaster } from "../../Variable";
import { adminAxios } from "../../Axios/axios";

const ProductDetail = () => {
  const { p_id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [activeTab, setActiveTab] = useState("DETAILS");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState(null);
  const [mainMedia, setMainMedia] = useState("");
  const [loading, setLoading] = useState(true);
  const videoRef = useRef(null); // ← for force-play

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await adminAxios.get(`${ApiURL}/getproductbyid/${p_id}`);
      const productData = response.data.data;

      const stockMap = {};
      productData.productvariants?.forEach((v) => {
        stockMap[`${v.pcolor_id}-${v.psize_id}`] = v.remaining_qty;
      });

      // Build a video lookup from productData.colors (color_id -> video URL)
      const colorVideoMap = {};
      (productData.colors || []).forEach((c) => {
        if (c.color_id && c.video) colorVideoMap[c.color_id] = c.video;
      });

      const enhancedColors =
        productData.productcolors?.map((color) => {
          let sizesWithStock = [];
          let colorTotalStock = 0;

          if (productData.productsizes && productData.productsizes.length > 0) {
            sizesWithStock = productData.productsizes.map((ps) => {
              const key = `${color.pcolor_id}-${ps.psize_id}`;
              const qty = stockMap[key] || 0;
              colorTotalStock += qty;
              return {
                ...ps,
                remaining_qty: qty,
                in_stock: qty > 0,
                low_stock: qty > 0 && qty <= 5,
              };
            });
          } else {
            const variant = productData.productvariants?.find(
              (v) => v.pcolor_id === color.pcolor_id
            );
            colorTotalStock = variant?.remaining_qty || 0;
            sizesWithStock = [
              {
                psize_id: null,
                size: { size_name: "Free Size" },
                remaining_qty: colorTotalStock,
                in_stock: colorTotalStock > 0,
                low_stock: colorTotalStock > 0 && colorTotalStock <= 5,
              },
            ];
          }
          const videoUrl = colorVideoMap[color.color?.color_id] || color.video || null;
          return {
            ...color,
            video: videoUrl,
            sizes: sizesWithStock,
            has_stock: colorTotalStock > 0,
            total_available: colorTotalStock,
          };
        }) || [];

      const enhancedProduct = {
        ...productData,
        productcolors: enhancedColors,
        total_stock: enhancedColors.reduce((sum, c) => sum + c.total_available, 0),
        has_any_stock: enhancedColors.some((c) => c.has_stock),
      };

      setProduct(enhancedProduct);

      if (enhancedColors.length > 0) {
        setSelectedColor(enhancedColors[0]);
      }
    } catch (error) {
      showToaster(0, error?.response?.data?.description || "Error fetching product");
      navigate("/admin/product");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (p_id) fetchProduct();
  }, [p_id]);

  // ─── Build media list: color.video FIRST, then productimages ───
  // Handles both full URLs (http...) and plain filenames
  const getMediaList = (color) => {
    const list = [];

    if (color?.video) {
      const videoUrl = color.video.startsWith("http")
        ? color.video
        : `${ApiURL}/assets/Products/${color.video}`;

      list.push({
        type: "video",
        url: videoUrl,
        id: `video-${color.pcolor_id}`,
      });
    }

    (color?.productimages || []).forEach((img) => {
      const imgUrl = img.image_url.startsWith("http")
        ? img.image_url
        : `${ApiURL}/assets/Products/${img.image_url}`;

      list.push({
        type: /\.(mp4|webm|mov|avi)$/i.test(img.image_url) ? "video" : "image",
        url: imgUrl,
        id: img.image_id || img.image_url,
      });
    });

    return list;
  };

  useEffect(() => {
    if (selectedColor) {
      const list = getMediaList(selectedColor);
      setMainMedia(list.length > 0 ? list[0].url : null);
    } else {
      setMainMedia(null);
    }
  }, [selectedColor]);

  // ─── Force autoplay when mainMedia changes ───
  const mediaList = getMediaList(selectedColor);
  const isMainVideo =
    !!mainMedia && mediaList.find((m) => m.url === mainMedia)?.type === "video";

  useEffect(() => {
    if (videoRef.current && isMainVideo) {
      videoRef.current.load();
      videoRef.current.play().catch(() => {
        // Autoplay blocked by browser — user must click play manually
      });
    }
  }, [mainMedia, isMainVideo]);

  const handleColorChange = (color) => {
    setSelectedColor(color);
    const list = getMediaList(color);
    setMainMedia(list.length > 0 ? list[0].url : null);
  };

  const handleThumbnailClick = (url) => {
    setMainMedia(url);
  };

  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    isDeleting: false,
  });

  const handleDeleteClick = () => {
    setDeleteModal({ isOpen: true, isDeleting: false });
  };

  const confirmDelete = async () => {
    setDeleteModal((prev) => ({ ...prev, isDeleting: true }));
    try {
      await adminAxios.delete(`${ApiURL}/deleteproduct/${p_id}`);
      showToaster(1, "Product deleted");
      navigate("/admin/product");
    } catch (error) {
      showToaster(0, error?.response?.data?.description || "Error deleting product");
      setDeleteModal({ isOpen: false, isDeleting: false });
    }
  };

  const discountPercent =
    product?.original_price && product?.original_price > product?.price
      ? Math.round(
        ((product.original_price - product.price) / product.original_price) * 100
      )
      : 0;

  if (loading) {
    return (
      <div className="glamloader-overlay" aria-label="Loading" role="status">
        <div className="glamloader-logo">
          KUNDRAT
          <div className="glamloader-logo-fill">KUNDRAT</div>
        </div>
        <div className="glamloader-ring">
          <svg viewBox="0 0 72 72">
            <circle className="glamloader-ring-track" cx="36" cy="36" r="32" />
            <circle className="glamloader-ring-arc glamloader-ring-arc--a2" cx="36" cy="36" r="32" />
            <circle className="glamloader-ring-arc glamloader-ring-arc--a1" cx="36" cy="36" r="32" />
          </svg>
          <div className="glamloader-ring-dot" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <p className="text-2xl text-gray-600">Product not found</p>
      </div>
    );
  }

  const tabs = ["DESCRIPTION", "DETAILS", "STOCK MATRIX"];

  const detailRows = [
    product.category &&
    (product.category.cate_name || product.category.name) && {
      label: "Category",
      value: product.category.cate_name || product.category.name,
      icon: <Layers className="w-4 h-4" />,
    },
    product.subcategory &&
    (product.subcategory.name || product.subcategory.subcate_name) && {
      label: "Collection",
      value: product.subcategory.name || product.subcategory.subcate_name,
      icon: <Package className="w-4 h-4" />,
    },
    product.fabric &&
    (product.fabric.name || product.fabric.fabric_name || product.fabric.f_name) && {
      label: "Fabric",
      value: product.fabric.name || product.fabric.fabric_name || product.fabric.f_name,
      icon: <Tag className="w-4 h-4" />,
    },
    product.work &&
    (product.work.name || product.work.work_name || product.work.w_name) && {
      label: "Work",
      value: product.work.name || product.work.work_name || product.work.w_name,
      icon: <Tag className="w-4 h-4" />,
    },
    product.occasion &&
    (product.occasion.name || product.occasion.occasion_name || product.occasion.o_name) && {
      label: "Occasion",
      value:
        product.occasion.name ||
        product.occasion.occasion_name ||
        product.occasion.o_name,
      icon: <Tag className="w-4 h-4" />,
    },
    product.style &&
    (product.style.name || product.style.style_name || product.style.s_name) && {
      label: "Style",
      value: product.style.name || product.style.style_name || product.style.s_name,
      icon: <Tag className="w-4 h-4" />,
    },
    product.weight > 0 && {
      label: "Weight",
      value: `${product.weight} kg`,
      icon: <Package className="w-4 h-4" />,
    },
    (product.length > 0 || product.width > 0 || product.height > 0) && {
      label: "Dimensions (L × W × H)",
      value: `${product.length || 0} × ${product.width || 0} × ${product.height || 0} cm`,
      icon: <Package className="w-4 h-4" />,
    },
  ].filter(Boolean);

  return (
    <div className="pb-12 px-4 sm:px-6 lg:px-10 mx-auto mt-2 sm:mt-4 lg:mt-6 max-w-[1400px]">
      {/* Header */}
      <div className="mb-8 flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="group flex items-center gap-2 text-gray-400 hover:text-gray-800 transition-colors cursor-pointer text-sm font-medium"
        >
          <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-0.5" />
          <span className="uppercase tracking-wider text-xs">Back</span>
        </button>
        <div className="h-4 w-px bg-gray-200" />
        <span className="text-xs text-gray-400 uppercase tracking-wider font-medium">
          Product Detail
        </span>
      </div>

      <div className="flex flex-col lg:flex-row gap-10 xl:gap-14">
        {/* ─── Left: Media Gallery ─── */}
        <div className="flex flex-col-reverse md:flex-row gap-4 lg:gap-5 flex-shrink-0">

          {/* Thumbnails Strip */}
          {mediaList.length > 0 && (
            <div
              className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto pb-2 md:pb-0 md:p-1 justify-start w-full md:w-[80px] lg:w-[92px] flex-shrink-0 scroll-smooth"
              style={{ maxHeight: "580px" }}
            >
              {mediaList.map((media, idx) => {
                const isActive = mainMedia === media.url;
                const isVideo = media.type === "video";

                return (
                  <button
                    key={media.id || idx}
                    onClick={() => handleThumbnailClick(media.url)}
                    className={`w-[72px] h-[96px] lg:w-[80px] lg:h-[106px] flex-shrink-0 rounded-lg overflow-hidden transition-all duration-200 cursor-pointer relative group ${
                      isActive
                        ? "ring-1 ring-gray-900 ring-offset-1 shadow-md"
                        : "ring-1 ring-gray-200 hover:ring-gray-300 hover:shadow-sm"
                    }`}
                  >
                    {isVideo ? (
                      <div className="w-full h-full bg-gray-100 relative">
                        <video
                          src={media.url}
                          className="w-full h-full object-cover"
                          muted
                          loop
                          playsInline
                          autoPlay
                          preload="metadata"
                          onCanPlay={(e) => {
                            e.target.muted = true;
                            e.target.play().catch(() => {});
                          }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/25">
                          <Play className="w-5 h-5 text-white fill-white" />
                        </div>
                      </div>
                    ) : (
                      <img
                        src={media.url}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          )}
 
          {/* Main Media — fixed height 580px */}
          <div
            className="bg-[#f7f7f8] rounded-xl shadow-lg overflow-hidden flex-shrink-0"
            style={{ width: "460px", height: "580px" }}
          >
            {!mainMedia || mainMedia.includes("undefined") ? (
              <div className="w-full h-full flex flex-col items-center justify-center text-gray-300 gap-3">
                <Package className="w-12 h-12" />
                <span className="text-sm font-medium">No Image Available</span>
              </div>
            ) : isMainVideo ? (
              <video
                ref={videoRef}
                key={mainMedia}
                src={mainMedia}
                autoPlay
                muted
                loop
                playsInline
                controls
                className="w-full h-full object-cover object-top"
                onCanPlay={(e) => {
                  e.target.muted = true;
                  e.target.play().catch(() => {});
                }}
              />
            ) : (
              <img
                src={mainMedia}
                alt={product.name}
                className="w-full h-full object-cover object-top"
              />
            )}
          </div>
        </div>

        {/* ─── Right: Product Info ─── */}
        <div className="flex-1 min-w-0 pt-0 lg:pt-1">
          <h1 className="text-[22px] sm:text-2xl font-semibold text-gray-900 leading-snug tracking-tight mb-3">
            {product.name}
          </h1>

          <div className="mb-5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded-md uppercase tracking-wider">
              SKU
              <span className="text-gray-900 font-bold">{product.sku || "N/A"}</span>
            </span>
          </div>

          <div className="mb-6 flex items-end gap-3 flex-wrap">
            {product.original_price > product.price && (
              <>
                <span className="text-gray-400 line-through text-base font-normal">
                  ₹{product.original_price}
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-md">
                  {discountPercent}% OFF
                </span>
              </>
            )}
            <span className="text-3xl font-bold text-gray-900 tracking-tight">
              ₹{product.price}
            </span>
          </div>

          {product.productcolors.length > 0 && (
            <div className="mb-7">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Color
                {selectedColor?.color?.color_name && (
                  <span className="text-gray-900 font-bold normal-case tracking-normal ml-1.5">
                    — {selectedColor.color.color_name}
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-2.5">
                {product.productcolors.map((color) => {
                  const isSelected = selectedColor?.pcolor_id === color.pcolor_id;
                  const outOfStock = !color.has_stock;
                  const colorCode = color.color?.color_code || color.color_code || "#ccc";

                  return (
                    <button
                      key={color.pcolor_id}
                      onClick={() => handleColorChange(color)}
                      disabled={outOfStock}
                      title={color.color?.color_name}
                      className={`relative w-9 h-9 rounded-full transition-all duration-200 flex items-center justify-center ${isSelected ? "ring-1 ring-gray-900 ring-offset-[3px]" : ""
                        } ${outOfStock ? "cursor-not-allowed opacity-40" : "cursor-pointer"}`}
                      style={{ backgroundColor: colorCode }}
                    >
                      {isSelected && (
                        <svg
                          className="w-4 h-4 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={3}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                      {outOfStock && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-full h-[2px] bg-gray-500 rotate-45 rounded-full" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="flex gap-3 mb-8">
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-gray-900 text-white px-7 py-2.5 font-semibold text-sm hover:bg-gray-800 active:bg-gray-950 transition-all duration-150 tracking-wider rounded-lg cursor-pointer"
            >
              Edit Product
            </button>
            <button
              onClick={handleDeleteClick}
              disabled={deleteModal.isDeleting}
              className="border border-gray-300 text-gray-600 px-7 py-2.5 font-semibold text-sm hover:border-red-300 hover:text-red-600 hover:bg-red-50 active:bg-red-100 transition-all duration-150 tracking-wider rounded-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {deleteModal.isDeleting ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                "Delete"
              )}
            </button>
          </div>

          <div className="border-t border-gray-200" />

          <div className="mt-8">
            <div className="flex gap-0 border-b border-gray-200 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`relative px-0 pb-3.5 text-[11px] font-bold tracking-[0.12em] uppercase transition-colors duration-200 cursor-pointer whitespace-nowrap mr-8 last:mr-0 ${activeTab === tab ? "text-gray-900" : "text-gray-400 hover:text-gray-600"
                    }`}
                >
                  {tab}
                  {activeTab === tab && (
                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gray-900 rounded-full" />
                  )}
                </button>
              ))}
            </div>

            <div className="pt-7 pb-2">
              {activeTab === "DESCRIPTION" && (
                <div className="max-w-2xl">
                  <p className="text-[15px] text-gray-600 leading-relaxed whitespace-pre-line">
                    {product.description || "No description available."}
                  </p>
                </div>
              )}

              {activeTab === "DETAILS" && (
                <div className="max-w-2xl">
                  <div className="divide-y divide-gray-100">
                    {detailRows.map((row, idx) => (
                      <div key={idx} className="flex items-center py-3.5 gap-4">
                        <div className="flex items-center gap-2.5 w-[100px] flex-shrink-0">
                          <span className="text-gray-300">{row.icon}</span>
                          <span className="text-sm font-semibold text-gray-900">{row.label}</span>
                        </div>
                        <span className="text-sm text-gray-500 capitalize">{row.value}</span>
                      </div>
                    ))}
                    {detailRows.length === 0 && (
                      <div className="py-10 text-center text-gray-400 text-sm">
                        No details available.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === "STOCK MATRIX" && (
                <div className="max-w-3xl overflow-x-auto">
                  <div className="border border-gray-200 rounded-xl overflow-hidden">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="p-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200 w-[140px]">
                            Size
                          </th>
                          {product.productcolors.map((c) => (
                            <th
                              key={c.pcolor_id}
                              className="p-3.5 text-center text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200 border-l border-gray-100"
                            >
                              <div className="flex flex-row items-center justify-center gap-1.5">
                                <span
                                  className="w-4 h-4 rounded-full inline-block ring-1 ring-gray-200"
                                  style={{
                                    backgroundColor: c.color?.color_code || c.color_code || "#ccc",
                                  }}
                                />
                                <span className="normal-case tracking-normal font-semibold text-gray-700 text-xs">
                                  {c.color?.color_name || "N/A"}
                                </span>
                              </div>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {product.productsizes?.length > 0
                          ? product.productsizes.map((s) => (
                            <tr key={s.psize_id} className="hover:bg-gray-50/60 transition-colors">
                              <td className="p-3.5 text-sm font-semibold text-gray-800 bg-gray-50/50">
                                {s.size?.size_name || "N/A"}
                              </td>
                              {product.productcolors.map((c) => {
                                const variant = product.productvariants?.find(
                                  (v) => v.pcolor_id === c.pcolor_id && v.psize_id === s.psize_id
                                );
                                const qty = variant?.remaining_qty || 0;
                                return (
                                  <td key={c.pcolor_id} className="p-3.5 text-center border-l border-gray-100">
                                    <StockBadge qty={qty} />
                                  </td>
                                );
                              })}
                            </tr>
                          ))
                          : (
                            <tr className="hover:bg-gray-50/60 transition-colors">
                              <td className="p-3.5 text-sm font-semibold text-gray-800 bg-gray-50/50">
                                Free Size
                              </td>
                              {product.productcolors.map((c) => {
                                const variant = product.productvariants?.find(
                                  (v) => v.pcolor_id === c.pcolor_id
                                );
                                const qty = variant?.remaining_qty || 0;
                                return (
                                  <td key={c.pcolor_id} className="p-3.5 text-center border-l border-gray-100">
                                    <StockBadge qty={qty} />
                                  </td>
                                );
                              })}
                            </tr>
                          )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <ProductModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          fetchProduct();
        }}
        product={product}
        refreshProducts={fetchProduct}
      />

      <ConfirmDeleteModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, isDeleting: false })}
        onConfirm={confirmDelete}
        itemType="product"
        itemName={product?.name}
        isDeleting={deleteModal.isDeleting}
      />
    </div>
  );
};

function StockBadge({ qty }) {
  if (qty === 0) {
    return (
      <span className="inline-flex items-center justify-center min-w-[36px] px-2 py-0.5 rounded-full text-[11px] font-bold bg-red-50 text-red-600 ring-1 ring-red-100">
        0
      </span>
    );
  }
  if (qty <= 5) {
    return (
      <span className="inline-flex items-center justify-center min-w-[36px] px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 ring-1 ring-amber-100">
        {qty}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center justify-center min-w-[36px] px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">
      {qty}
    </span>
  );
}

export default ProductDetail;