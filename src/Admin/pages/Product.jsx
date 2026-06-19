import { useEffect, useState, useRef, useCallback } from "react";
import {
  Plus,
  Edit,
  ToggleRight,
  ToggleLeft,
  AlertCircle,
  Search,
  Trash2,
} from "lucide-react";
import { ApiURL } from "../../Variable";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { adminAxios } from "../../Axios/axios";
import ProductModal from "./ProductModel";
import ConfirmDeleteModal from "./ConfirmDeleteModal";

const Product = () => {
  const [products, setProducts] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const searchTimeoutRef = useRef(null);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 24;

  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    product: null,
    isDeleting: false,
  });

  // Helper to resolve media URLs dynamically
  const getMediaUrl = (url) => {
    if (!url) return null;
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    return `${ApiURL}/assets/Products/${url}`;
  };

  // Debounce logic
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchTerm]);

  // Fetch Products
  const fetchProducts = useCallback(async (page = 1, isSearch = false) => {
    try {
      // If searching, fetch a large batch to filter client-side
      const limit = isSearch ? 1000 : itemsPerPage;

      const res = await adminAxios.get(`${ApiURL}/getallproducts`, {
        params: {
          page: isSearch ? 1 : page,
          perPage: limit,
          // No search params sent to backend; we filter in frontend
        }
      });

      const { productData, totalCount } = res.data.data || {};
      const enhancedProducts = (productData || []).map((p) => {
        const totalStock =
          p.total_stock !== undefined
            ? p.total_stock
            : p.productvariants?.reduce(
              (sum, v) => sum + (v.remaining_qty || 0),
              0
            ) || 0;
        const hasStock = totalStock > 0;
        const lowStock = totalStock > 0 && totalStock <= 5;
        const firstImage =
          p.productcolors?.[0]?.productimages?.[0]?.image_url ||
          p.colors?.[0]?.images?.[0]?.image_url ||
          p.thumbnail;

        return {
          ...p,
          total_stock: totalStock,
          has_stock: hasStock,
          low_stock: lowStock,
          thumbnail: firstImage ? `${firstImage}` : null,
        };
      });

      setProducts(enhancedProducts);
      setTotalPages(Math.ceil(totalCount / itemsPerPage));
      setCurrentPage(page);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to load products");
    }
  }, [itemsPerPage]);

  // Trigger fetch when search changes
  useEffect(() => {
    if (debouncedSearchTerm) {
      fetchProducts(1, true);
    } else {
      fetchProducts(1, false);
    }
  }, [debouncedSearchTerm, fetchProducts]);

  const handleStatusToggle = async (product) => {
    try {
      const newStatus = product.p_status === 1 ? 0 : 1;
      await adminAxios.post(`${ApiURL}/changeproductstatus`, {
        p_id: product.p_id,
        p_status: newStatus,
      });
      toast.success(`Product ${newStatus === 1 ? "activated" : "deactivated"}`);
      fetchProducts(currentPage, !!debouncedSearchTerm);
    } catch (error) {
      console.error("Error:", error);
      toast.error(error?.message || "Failed to update status");
    }
  };

  const handleDeleteClick = (product) => {
    setDeleteModal({ isOpen: true, product, isDeleting: false });
  };

  const confirmDelete = async () => {
    if (!deleteModal.product) return;
    setDeleteModal((prev) => ({ ...prev, isDeleting: true }));
    try {
      await adminAxios.delete(`${ApiURL}/deleteproduct/${deleteModal.product.p_id}`);
      toast.success("Product deleted successfully");
      setDeleteModal({ isOpen: false, product: null, isDeleting: false });
      fetchProducts(currentPage, !!debouncedSearchTerm);
    } catch (error) {
      console.error("Error:", error);
      toast.error(error?.response?.data?.description || "Failed to delete product");
      setDeleteModal((prev) => ({ ...prev, isDeleting: false }));
    }
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      fetchProducts(page, false);
    }
  };

  if (products === null) {
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

  // --- FIXED FILTERING LOGIC ---
  // Use startsWith() instead of includes() to filter only by first letter (Prefix)
  const displayedProducts = products.filter((product) => {
    if (!debouncedSearchTerm) return true;

    const searchLower = debouncedSearchTerm.toLowerCase().trim();
    const nameLower = product.name.toLowerCase().trim();

    // This ensures only products STARTING with the letter appear
    return nameLower.startsWith(searchLower);
  });

  return (
    <div className="pb-8 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="text-left">
          <h1 className="text-2xl font-bold text-gray-800">Products</h1>
          <p className="text-sm text-gray-600 mt-1 font-medium">Manage your inventory & stock</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          <button
            onClick={() => {
              setCurrentProduct(null);
              setIsModalOpen(true);
            }}
            className="flex items-center justify-center gap-2 bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-lg transition-colors font-medium whitespace-nowrap cursor-pointer"
          >
            <Plus className="w-5 h-5" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {displayedProducts.length > 0 ? (
          displayedProducts.map((product) => {
            const discountPercent = product.original_price > product.price
              ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
              : 0;

            return (
              <div
                key={product.p_id}
                className="group relative bg-white rounded-2xl overflow-hidden transition-all duration-300 border border-gray-100 hover:shadow-lg hover:shadow-gray-200/50 hover:-translate-y-1 flex flex-col"
              >
                <Link to={`/admin/product/${product.p_id}`} className="block">
                  <div className="relative aspect-[4/5] overflow-hidden bg-gray-50">
                    {(() => {
                      const mediaUrl = getMediaUrl(product.thumbnail);

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
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
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
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        />
                      );
                    })()}

                    {/* Stock Badge */}
                    <div className="absolute top-2.5 left-2.5 z-10">
                      {product.has_stock ? (
                        product.low_stock ? (
                          <span className="bg-amber-50 text-amber-700 border border-amber-100 px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-sm">
                            <AlertCircle size={13} /> Low Stock ({product.total_stock})
                          </span>
                        ) : null
                      ) : (
                        <span className="bg-rose-50 text-rose-700 border border-rose-100 px-2.5 py-1 rounded-full text-xs font-semibold shadow-sm">
                          Out of Stock
                        </span>
                      )}
                    </div>

                    {/* Status Badge */}
                    <div className="absolute top-2.5 right-2.5 z-10">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold shadow-sm border ${product.p_status === 1
                          ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                          : "bg-gray-100 text-gray-600 border-gray-200"
                          }`}
                      >
                        {product.p_status === 1 ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>
                </Link>

                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-1">
                    <Link to={`/admin/product/${product.p_id}`} className="block">
                      <h3 className="font-semibold text-[15px] text-gray-800 line-clamp-1 leading-snug group-hover:text-black transition-colors" title={product.name}>
                        {product.name}
                      </h3>
                    </Link>

                    <div className="flex gap-2 items-center flex-wrap">
                      <span className="text-base font-bold text-gray-900">
                        ₹{product.price}
                      </span>
                      {product.original_price > product.price && (
                        <>
                          <span className="text-xs text-gray-400 line-through">
                            ₹{product.original_price}
                          </span>
                          <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                            {discountPercent}% OFF
                          </span>
                        </>
                      )}
                    </div>

                    {product.productcolors?.length > 0 && (
                      <div className="flex items-center gap-1 flex-wrap pt-1">
                        {product.productcolors.slice(0, 5).map((c) => (
                          <div
                            key={c.pcolor_id}
                            className="w-4 h-4 rounded-full border border-white shadow-sm ring-1 ring-gray-200"
                            style={{ backgroundColor: c.color?.color_code || "#ccc" }}
                            title={c.color?.color_name}
                          />
                        ))}
                        {product.productcolors.length > 5 && (
                          <span className="text-[11px] text-gray-500 font-medium pl-1">
                            +{product.productcolors.length - 5}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-auto">
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          setCurrentProduct(product);
                          setIsModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-all cursor-pointer"
                        title="Edit Product"
                      >
                        <Edit size={18} />
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          handleDeleteClick(product);
                        }}
                        className="p-1.5 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 transition-all cursor-pointer"
                        title="Delete Product"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        handleStatusToggle(product);
                      }}
                      className="transition-all cursor-pointer p-0.5 rounded-lg hover:bg-gray-50"
                      title={product.p_status === 1 ? "Deactivate" : "Activate"}
                    >
                      {product.p_status === 1 ? (
                        <ToggleRight className="w-8 h-8 text-green-600" />
                      ) : (
                        <ToggleLeft className="w-8 h-8 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full text-center py-10 text-gray-500">
            No products found starting with "{debouncedSearchTerm}"
          </div>
        )}
      </div>

      {/* Pagination - Hidden during search */}
      {!debouncedSearchTerm && totalPages > 1 && (
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
          fetchProducts(currentPage, !!debouncedSearchTerm);
        }}
        product={currentProduct}
        refreshProducts={() => fetchProducts(currentPage, !!debouncedSearchTerm)}
      />

      <ConfirmDeleteModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, product: null, isDeleting: false })}
        onConfirm={confirmDelete}
        itemType="product"
        itemName={deleteModal.product?.name}
        isDeleting={deleteModal.isDeleting}
      />
    </div>
  );
};

export default Product;