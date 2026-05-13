/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import {
  Plus,
  Edit,
  Trash2,
  RefreshCw,
  ToggleRight,
  ToggleLeft,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { ApiURL } from "../../Variable";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { adminAxios } from "../../Axios/axios";
import ProductModal from "./ProductModel";

const Product = () => {
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 24;

  const fetchProducts = async (page = 1, search = "") => {
    try {
      const res = await adminAxios.get(`${ApiURL}/getallproducts`, {
        page,
        perPage: itemsPerPage,
        search,
      });

      const { productData, totalCount } = res.data.data || {};
      const enhancedProducts = (productData || []).map((p) => {
        // Calculate total stock
        const totalStock =
          p.total_stock !== undefined
            ? p.total_stock
            : p.productvariants?.reduce(
              (sum, v) => sum + (v.remaining_qty || 0),
              0
            ) || 0;
        const hasStock = totalStock > 0;
        const lowStock = totalStock > 0 && totalStock <= 5;

        // Get first image
        const firstImage = p.productcolors?.[0]?.productimages?.[0]?.image_url;

        return {
          ...p,
          total_stock: totalStock,
          has_stock: hasStock,
          low_stock: lowStock,
          thumbnail: firstImage
            ? `${firstImage}`
            : null,
        };
      });

      setProducts(enhancedProducts);
      setTotalPages(Math.ceil(totalCount / itemsPerPage));
      setCurrentPage(page);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to load products");
    }
  };

  useEffect(() => {
    fetchProducts(1, "");
  }, []);

  const handleStatusToggle = async (product) => {
    try {
      const newStatus = product.p_status === 1 ? 0 : 1;
      await adminAxios.post(`${ApiURL}/changeproductstatus`, {
        p_id: product.p_id,
        p_status: newStatus,
      });
      toast.success(`Product ${newStatus === 1 ? "activated" : "deactivated"}`);
      fetchProducts(currentPage, searchTerm);
    } catch (error) {
      console.error("Error:", error);
      toast.error(error?.message || "Failed to update status");
    }
  };

  const handleSearch = () => {
    fetchProducts(1, searchTerm);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      fetchProducts(page, searchTerm);
    }
  };

  return (
    <div className="pb-8 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Products</h1>
          <p className="text-sm text-gray-600 mt-1 font-medium">Manage your inventory & stock</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <button
            onClick={() => {
              setCurrentProduct(null);
              setIsModalOpen(true);
            }}
            className="w-full flex items-center justify-center gap-2 bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-lg transition-colors font-medium whitespace-nowrap"
          >
            <Plus className="w-5 h-5" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-6  gap-4 sm:gap-6">
        {products.map((product) => (
          <div
            key={product.p_id}
            className="group relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100"
          >
            <Link to={`/admin/product/${product.p_id}`} className="block">
              <div className="relative aspect-square overflow-hidden bg-gray-50">
                {(() => {
                  // API returns colors[].images[].image_url as a full URL
                  const mediaUrl =
                    product.colors?.[0]?.images?.[0]?.image_url || null;

                  if (!mediaUrl) {
                    return (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm font-medium bg-gray-100">
                        No Media
                      </div>
                    );
                  }

                  const isVideo = mediaUrl.match(/\.(mp4|webm|mov|avi)$/i);

                  return isVideo ? (
                    <div className="relative w-full h-full">
                      <video
                        src={mediaUrl}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        muted
                        loop
                        playsInline
                      >
                        <source src={mediaUrl} />
                      </video>
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                        <div className="bg-white/80 rounded-full p-3 shadow-lg">
                          <svg className="w-8 h-8 text-black" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <img
                      src={mediaUrl}
                      alt={product.name}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  );
                })()}

                {/* Stock Badge - Top Left */}
                <div className="absolute top-2 left-2 z-10">
                  {product.has_stock ? (
                    product.low_stock ? (
                      <span className="bg-orange-500 text-white px-2.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                        <AlertCircle size={13} /> Low Stock ({product.total_stock})
                      </span>
                    ) : null
                  ) : (
                    <span className="bg-red-600 text-white px-2.5 py-1.5 rounded-full text-xs font-bold shadow-lg">
                      Out of Stock
                    </span>
                  )}
                </div>

                {/* Status Badge - Top Right */}
                <div className="absolute top-2 right-2 z-10">
                  <span
                    className={`px-3 py-1.5 rounded-full text-xs font-bold shadow-md ${product.p_status === 1
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-gray-200 text-gray-600"
                      }`}
                  >
                    {product.p_status === 1 ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
            </Link>

            <div className="p-2 space-y-1">
              {/* Product Name */}
              <h3 className="font-semibold text-sm text-gray-900 line-clamp-2 leading-tight">
                {product.name}
              </h3>

              {/* Price */}
              <div className="flex items-end justify-between">
                <span className="text-md font-bold text-gray-900">
                  ₹{product.price}
                </span>
                {product.original_price > product.price && (
                  <span className="text-sm text-gray-500 line-through">
                    ₹{product.original_price}
                  </span>
                )}
              </div>

              {/* Color Dots */}
              {product.productcolors?.length > 0 && (
                <div className="flex items-center gap-1.5 flex-wrap">
                  {product.productcolors.slice(0, 6).map((c) => (
                    <div
                      key={c.pcolor_id}
                      className="w-6 h-6 rounded-full border-2 border-white shadow ring-1 ring-gray-300"
                      style={{ backgroundColor: c.color?.color_code || "#ccc" }}
                      title={c.color?.color_name}
                    />
                  ))}
                  {product.productcolors.length > 6 && (
                    <span className="text-xs text-gray-500 font-medium">
                      +{product.productcolors.length - 6}
                    </span>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-1 border-t border-gray-100">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    setCurrentProduct(product);
                    setIsModalOpen(true);
                  }}
                  className="text-blue-600 hover:text-blue-800 transition-colors"
                  title="Edit Product"
                >
                  <Edit size={20} />
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    handleStatusToggle(product);
                  }}
                  className="transition-all"
                  title={product.p_status === 1 ? "Deactivate" : "Activate"}
                >
                  {product.p_status === 1 ? (
                    <ToggleRight className="w-9 h-9 text-green-600" />
                  ) : (
                    <ToggleLeft className="w-9 h-9 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="max-w-7xl mx-auto mt-12 flex justify-center gap-2 flex-wrap">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-5 py-3 bg-black text-white rounded-lg disabled:opacity-50 hover:bg-gray-900 transition"
          >
            Previous
          </button>
          {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
            let pageNum;
            if (totalPages <= 7) pageNum = i + 1;
            else if (currentPage <= 4) pageNum = i + 1;
            else if (currentPage >= totalPages - 3)
              pageNum = totalPages - 6 + i;
            else pageNum = currentPage - 3 + i;

            return (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={`px-5 py-3 rounded-lg font-medium transition ${currentPage === pageNum
                  ? "bg-black text-white"
                  : "bg-gray-200 hover:bg-gray-300"
                  }`}
              >
                {pageNum}
              </button>
            );
          })}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-5 py-3 bg-black text-white rounded-lg disabled:opacity-50 hover:bg-gray-900 transition"
          >
            Next
          </button>
        </div>
      )}

      <ProductModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setCurrentProduct(null);
          fetchProducts(currentPage, searchTerm);
        }}
        product={currentProduct}
        refreshProducts={() => fetchProducts(currentPage, searchTerm)}
      />
    </div>
  );
};

export default Product;
