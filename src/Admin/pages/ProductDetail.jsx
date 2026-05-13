/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  RefreshCw,
  Edit,
  Trash2,
  ArrowLeft,
  Palette,
  Ruler,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import ProductModal from "./ProductModel";
import { ApiURL, showToaster } from "../../Variable";
import { adminAxios } from "../../Axios/axios";

const ProductDetail = () => {
  const { p_id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState(null);
  const [mainMedia, setMainMedia] = useState("");
  const [showStockMatrix, setShowStockMatrix] = useState(false);

  const fetchProduct = async () => {
    try {
      const response = await axiosInstance.get(
        `${ApiURL}/getproductbyid/${p_id}`
      );
      const productData = response.data.data;

      // Build stock lookup: { "pcolor_id-psize_id": remaining_qty }
      const stockMap = {};
      productData.productvariants?.forEach((v) => {
        stockMap[`${v.pcolor_id}-${v.psize_id}`] = v.remaining_qty;
      });

      // Attach stock to each size under each color
      const enhancedColors =
        productData.productcolors?.map((color) => {
          let sizesWithStock = [];
          let colorTotalStock = 0;

          if (productData.productsizes && productData.productsizes.length > 0) {
            // Size-wise stock
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
            // No sizes → use total variant qty for this color
            const variant = productData.productvariants?.find(
              (v) => v.pcolor_id === color.pcolor_id
            );
            colorTotalStock = variant?.remaining_qty || 0;
            sizesWithStock = [
              {
                psize_id: null,
                size: { size_name: "Free Size" }, // or "One Size"
                remaining_qty: colorTotalStock,
                in_stock: colorTotalStock > 0,
                low_stock: colorTotalStock > 0 && colorTotalStock <= 5,
              },
            ];
          }
          return {
            ...color,
            sizes: sizesWithStock,
            has_stock: colorTotalStock > 0,
            total_available: colorTotalStock,
          };
        }) || [];

      const enhancedProduct = {
        ...productData,
        productcolors: enhancedColors,
        total_stock: enhancedColors.reduce(
          (sum, c) => sum + c.total_available,
          0
        ),
        has_any_stock: enhancedColors.some((c) => c.has_stock),
      };

      setProduct(enhancedProduct);

      // Auto-select first color (regardless of stock)
      if (enhancedColors.length > 0) {
        setSelectedColor(enhancedColors[0]);
      }
    } catch (error) {
      showToaster(0, error?.response?.data?.description || "Error fetching product");
      navigate("/admin/product");
    }
  };

  useEffect(() => {
    if (p_id) fetchProduct();
  }, [p_id]);

  useEffect(() => {
    if (selectedColor?.productimages?.length > 0) {
      setMainMedia(
        `${ApiURL}/assets/Products/${selectedColor.productimages[0].image_url}`
      );
    } else {
      setMainMedia(null);
    }
  }, [selectedColor, ApiURL]);

  const handleColorChange = (color) => {
    setSelectedColor(color);
    const firstImage = color.productimages?.[0]?.image_url;
    setMainMedia(firstImage ? `${ApiURL}/assets/Products/${firstImage}` : "");
  };

  const handleThumbnailClick = (imageUrl) => {
    setMainMedia(`${ApiURL}/assets/Products/${imageUrl}`);
  };

  const handleDelete = async () => {
    if (window.confirm("Delete this product permanently?")) {
      try {
        await axiosInstance.delete(`${ApiURL}/deleteproduct/${p_id}`);
        showToaster(1, "Product deleted");
        navigate("/admin/product");
      } catch (error) {
        showToaster(0, error?.response?.data?.description || "Error deleting product");
      }
    }
  };

  if (!product) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <p className="text-2xl text-gray-600">Product not found</p>
      </div>
    );
  }

  return (
    <div className="pb-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-700 hover:text-black"
        >
          <ArrowLeft /> Back
        </button>
        <div className="flex gap-3">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-black text-white px-5 py-3 rounded-lg flex items-center gap-2 hover:bg-gray-800"
          >
            <Edit size={18} /> Edit Product
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-600 text-white px-5 py-3 rounded-lg flex items-center gap-2 hover:bg-red-700"
          >
            <Trash2 size={18} /> Delete
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Left: Media + Color Selector */}
        <div className="space-y-6">
          {/* Main Media */}
          {/* Main Media */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-lg">
            {mainMedia ? (
              (() => {
                const isVideo = /\.(mp4|webm|mov|avi)$/i.test(mainMedia);
                const imageUrl = selectedColor?.productimages?.[0]?.image_url;

                return isVideo ? (
                  <div className="relative">
                    <video
                      src={mainMedia}
                      controls
                      className="w-full aspect-[3/4] object-cover"
                      poster={
                        imageUrl
                          ? `${ApiURL}/assets/Products/${imageUrl}`
                          : undefined
                      }
                    >
                      <source src={mainMedia} type="video/mp4" />
                      <source src={mainMedia} type="video/webm" />
                      Your browser does not support the video tag.
                    </video>
                    {/* Play icon overlay (optional, for consistency) */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="bg-white/80 rounded-full p-4 shadow-lg">
                        <svg
                          className="w-12 h-12 text-black"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                ) : (
                  <img
                    src={mainMedia}
                    alt="Main"
                    className="w-full aspect-[3/4] object-cover"
                  />
                );
              })()
            ) : (
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full aspect-[3/4] flex items-center justify-center text-gray-500">
                No Media
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {selectedColor?.productimages?.length > 0 && (
            <div className="space-y-3">
              <div className="flex gap-3 overflow-x-auto pb-2">
                {selectedColor.productimages.map((img) => {
                  const mediaUrl = `${ApiURL}/assets/Products/${img.image_url}`;
                  const isVideo = /\.(mp4|webm|mov|avi)$/i.test(img.image_url);

                  return (
                    <button
                      key={img.image_id}
                      onClick={() => handleThumbnailClick(img.image_url)}
                      className={`w-20 h-20 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all relative ${mainMedia === mediaUrl
                        ? "border-black"
                        : "border-gray-300"
                        }`}
                    >
                      {isVideo ? (
                        <div className="relative w-full h-full">
                          <video
                            src={mediaUrl}
                            className="w-full h-full object-cover"
                            muted
                          />
                          {/* Play icon on thumbnail */}
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                            <svg
                              className="w-6 h-6 text-white"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </div>
                        </div>
                      ) : (
                        <img
                          src={mediaUrl}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Color Selector */}
          <div className="bg-white p-5 rounded-2xl shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Palette className="w-5 h-5" /> Available Colors
            </h3>
            <div className="flex flex-wrap gap-3">
              {product.productcolors.map((color) => {
                const isSelected = selectedColor?.pcolor_id === color.pcolor_id;
                const outOfStock = !color.has_stock;

                return (
                  <button
                    key={color.pcolor_id}
                    onClick={() => handleColorChange(color)}
                    disabled={outOfStock}
                    className={`relative w-12 h-12 rounded-full transition-all ${isSelected
                      ? "ring-2 ring-offset-1 ring-black"
                      : "ring-1 ring-offset-1 ring-gray-300 hover:ring-black"
                      } ${outOfStock ? "cursor-not-allowed" : ""}`}
                    style={{ backgroundColor: color.color?.color_code || color.color_code || "#ccc" }}
                    title={color.color?.color_name}
                  >
                    {isSelected && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-3 h-3 bg-white rounded-full border-2 border-black" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Details + Stock */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h1 className="text-4xl font-bold mb-4">{product.name}</h1>

            {/* Price */}
            <div className="mb-6">
              <span className="text-3xl font-bold">₹{product.price}</span>
              {product.original_price > product.price && (
                <span className="text-xl text-gray-500 line-through ml-3">
                  ₹{product.original_price}
                </span>
              )}
            </div>

            {/* Stock Summary */}
            <div className="mb-8 p-5 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Available Stock</p>
                  <p className="text-3xl font-bold text-green-700">
                    {product.total_stock || 0}
                  </p>
                </div>
                {product.has_any_stock ? (
                  <CheckCircle className="w-12 h-12 text-green-600" />
                ) : (
                  <AlertCircle className="w-12 h-12 text-red-600" />
                )}
              </div>
              {!product.has_any_stock && (
                <p className="mt-3 text-red-600 font-semibold">
                  Currently Out of Stock
                </p>
              )}
            </div>

            {/* Size + Stock for Selected Color */}
            {selectedColor && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Ruler className="w-6 h-6" />
                  Available Sizes - {selectedColor.color?.color_name}
                </h3>

                {selectedColor.sizes.length > 1 ||
                  selectedColor.sizes[0]?.psize_id ? (
                  // Multiple sizes or real sizes
                  <div className="grid grid-cols-3 sm:grid-cols-3 gap-3">
                    {selectedColor.sizes.map((size) => {
                      const qty = size.remaining_qty;
                      return (
                        <div
                          key={size.psize_id || "free"}
                          className={`p-4 rounded-xl text-center font-medium border-2 transition-all ${qty > 0
                            ? size.low_stock
                              ? "border-orange-500 bg-orange-50 text-orange-700"
                              : "border-green-500 bg-green-50 text-green-700"
                            : "border-gray-300 bg-gray-100 text-gray-400 line-through"
                            }`}
                        >
                          <div className="text-lg">
                            {size.size?.size_name || "One Color"}
                          </div>
                          <div className="text-xs mt-1">
                            {qty > 0
                              ? qty <= 5
                                ? `Only ${qty} left`
                                : `${qty} in stock`
                              : "Out of Stock"}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  // No sizes → show total for color
                  <div className="p-6 bg-green-50 border-2 border-green-300 rounded-xl text-center">
                    <p className="text-lg font-semibold text-green-800">
                      One Size · {selectedColor.total_available} in stock
                    </p>
                  </div>
                )}
              </div>
            )}
            {/* Toggle Full Stock Matrix */}
            <button
              onClick={() => setShowStockMatrix(!showStockMatrix)}
              className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2"
            >
              {showStockMatrix ? "Hide" : "Show"} Full Stock Matrix
            </button>

            {showStockMatrix && (
              <div className="mt-6 overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border p-3 text-left">Size → Color</th>
                      {product.productcolors.map((c) => (
                        <th
                          key={c.pcolor_id}
                          className="border p-3 text-center"
                        >
                          {c.color?.color_name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {product.productsizes.map((ps) => (
                      <tr key={ps.psize_id}>
                        <td className="border p-3 font-medium bg-gray-50">
                          {ps.size?.size_name}
                        </td>
                        {product.productcolors.map((color) => {
                          const sizeInColor = color.sizes.find(
                            (s) => s.psize_id === ps.psize_id
                          );
                          const qty = sizeInColor?.remaining_qty || 0;
                          return (
                            <td
                              key={color.pcolor_id}
                              className="border p-3 text-center"
                            >
                              <span
                                className={`font-bold ${qty > 0 ? "text-green-600" : "text-red-600"
                                  }`}
                              >
                                {qty}
                              </span>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Other Info */}
            <div className="mt-10 space-y-4 text-gray-700">
              <p className="text-sm text-gray-700">
                <span className="font-semibold text-gray-900">SKU:</span> {product.sku || "N/A"}
              </p>
              <p className="text-sm text-gray-700">
                <span className="font-semibold text-gray-900">Category:</span> {product.subcategory?.name || "N/A"}
              </p>
              <p className="text-sm font-semibold text-gray-900">
                Description:
              </p>
              <p className="whitespace-pre-line text-sm text-gray-700">
                {product.description || "No description"}
              </p>
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
    </div>
  );
};

export default ProductDetail;
