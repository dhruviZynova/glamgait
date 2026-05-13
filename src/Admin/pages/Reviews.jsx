/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import {
  TrashIcon,
  StarIcon,
  XMarkIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";
import { ApiURL, adminInfo } from "../../Variable";
import toast from "react-hot-toast";
import axiosInstance from "../../Axios/axios";
import ConfirmDeleteModal from "./ConfirmDeleteModal";

const Reviews = () => {
  const adminData = adminInfo();
  const [reviews, setReviews] = useState([]);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [reviewsPerPage] = useState(10);
  const [productDropdownOpen, setProductDropdownOpen] = useState(false);

  // Modal
  const [modal, setModal] = useState({
    open: false,
    editMode: false,
    reviewId: null,
  });
  const [form, setForm] = useState({
    product: "",
    rating: 0,
    comment: "",
    name: "",
    image: null,
    preview: null,
  });

  // Delete Modal
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    reviewId: null,
    name: "",
  });

  const [submitting, setSubmitting] = useState(false);

  // Fetch Reviews
  const fetchReviews = async (page = 1) => {
    try {
      const response = await axiosInstance.post(`${ApiURL}/getalluserreviews`, {
        page,
        perPage: reviewsPerPage,
        search: searchTerm,
      }, {
        headers: {
          Authorization: `Bearer ${adminData?.token || adminData?.auth_token}`,
        },
      });
      if (response.data.status === 1) {
        const data = response.data.data;
        setReviews(data.reviews || []);
        const totalCount = data.totalCount || 0;
        setTotalPages(Math.ceil(totalCount / reviewsPerPage));
      } else {
        setReviews([]);
        setTotalPages(1);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setReviews([]);
      setTotalPages(1);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await axiosInstance.get(`${ApiURL}/getproducts`, {
        limit: 100,
      }, {
        headers: {
          Authorization: `Bearer ${adminData?.token || adminData?.auth_token}`,
        },
      });
      if (res.data.status === 1) setProducts(res.data.data || []);
    } catch (err) {
      console.error("Failed to load products", err);
    }
  };

  useEffect(() => {
    fetchReviews(currentPage);
    fetchProducts();
  }, [currentPage, searchTerm]);

  const paginate = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  // Delete
  const handleDelete = (reviewId, name) =>
    setDeleteModal({ isOpen: true, reviewId, name });

  const confirmDelete = async () => {
    try {
      await axiosInstance.delete(
        `${ApiURL}/deleteuserreview/${deleteModal.reviewId}`,
        {
          headers: {
            Authorization: `Bearer ${adminData?.token || adminData?.auth_token}`,
          },
        }
      );
      toast.success("Review deleted");
      fetchReviews(currentPage);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete");
    } finally {
      setDeleteModal({ isOpen: false, reviewId: null, name: "" });
    }
  };

  const togglePublish = async (reviewId, currentStatus) => {
    try {
      const newStatus = currentStatus ? 0 : 1;
      await axiosInstance.post(`${ApiURL}/togglereviewpublish`, {
        r_id: reviewId,
        is_published: newStatus,
      }, {
        headers: {
          Authorization: `Bearer ${adminData?.token || adminData?.auth_token}`,
        },
      });
      toast.success(newStatus ? "Published" : "Unpublished");
      fetchReviews(currentPage);
    } catch (error) {
      toast.error("Failed to update");
      console.error(error);
    }
  };

  // Open Add/Edit Modal
  const openModal = (edit = false, review = null) => {
    if (edit && review) {
      setForm({
        product: review.p_id || "",
        rating: review.rating || 0,
        comment: review.message || "",
        name: review.reviewer_name || "",
        image: null,
        preview: review.image_url
          ? `${ApiURL}/assets/UserReviews/${review.image_url}`
          : null,
        customCreatedAt: review.custom_created_at || null, // already 'YYYY-MM-DD' or null
      });
      setModal({ open: true, editMode: true, reviewId: review.r_id });
    } else {
      resetForm();
      setModal({ open: true, editMode: false, reviewId: null });
    }
  };

  const resetForm = () =>
    setForm({
      product: "",
      rating: 0,
      comment: "",
      name: "",
      image: null,
      preview: null,
    });

  // Add or Edit Review
  const handleSubmit = async () => {
    if (!form.product || form.rating === 0 || !form.comment.trim()) {
      toast.error("Please fill all required fields");
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("p_id", form.product);
      formData.append("rating", form.rating);
      formData.append("message", form.comment);
      formData.append("is_published", 1);
      if (form.name) formData.append("user_name", form.name);
      if (form.image) formData.append("userReviewImage", form.image);
      if (form.customCreatedAt) {
        formData.append("custom_created_at", form.customCreatedAt); // already 'YYYY-MM-DD'
      }
      if (modal.editMode) {
        formData.append("r_id", modal.reviewId);
        await axiosInstance.post(`${ApiURL}/updateuserreview`, formData, {
          headers: {
            Authorization: `Bearer ${adminData?.token || adminData?.auth_token}`,
          },
        });
        toast.success("Review updated!");
      } else {
        await axiosInstance.post(`${ApiURL}/addfakereview`, formData, {
          headers: {
            Authorization: `Bearer ${adminData?.token || adminData?.auth_token}`,
          },
        });
        toast.success("Review added!");
      }

      setModal({ open: false, editMode: false, reviewId: null });
      resetForm();
      fetchReviews(currentPage);
    } catch (error) {
      toast.error("Failed to save review");
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const getPageNumbers = () => {
    const pages = [];
    const max = 5;
    const half = Math.floor(max / 2);
    let start = Math.max(1, currentPage - half);
    let end = Math.min(totalPages, start + max - 1);
    if (end - start + 1 < max) start = Math.max(1, end - max + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  return (
    <div className="container mx-auto pb-8 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-800">
          Review Management
        </h2>
        <div className="flex gap-3 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search reviews..."
            className="flex-1 sm:w-64 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
          <button
            onClick={() => openModal(false)}
            className="bg-black text-white px-5 py-2.5 rounded-lg font-medium text-sm hover:bg-gray-800 transition"
          >
            Add Review
          </button>
        </div>
      </div>

      {/* Loading */}
      {reviews.length === 0 ? (
        <div className="text-center py-16 text-gray-500 text-lg">
          No reviews found
        </div>
      ) : (
        <>
          {/* Mobile Cards */}
          <div className="block lg:hidden grid grid-cols-2 sm:grid-cols-3 gap-4">
            {reviews.map((r) => (
              <div
                key={r.r_id}
                className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 flex flex-col"
              >
                {/* Image */}
                {r.image_url && (
                  <img
                    src={r.image_url}
                    alt="review"
                    className="w-full h-40 object-cover rounded-lg mb-3"
                  />
                )}

                {/* Header */}
                <div className="flex justify-between items-start mb-2 flex-1">
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">
                      {r.reviewer_name || "User"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDate(r.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-500 font-medium">
                      {r.rating}
                    </span>
                    <StarIcon className="w-4 h-4 text-yellow-500" />
                  </div>
                </div>

                {/* Comment */}
                <p className="text-sm text-gray-700 mb-2 line-clamp-2 flex-1">
                  {r.message}
                </p>

                {/* Product */}
                <p className="text-xs text-gray-500 italic mb-3">
                  Product: {r.product_name}
                </p>

                {/* Publish Toggle + Actions */}
                <div className="flex justify-between items-center mt-auto">
                  {/* Toggle */}
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={r.is_published}
                      onChange={() => togglePublish(r.r_id, r.is_published)}
                      className="sr-only peer"
                    />
                    <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-600 text-xs"></div>
                    <span className="ml-1 text-xs text-gray-600">
                      {r.is_published ? "Live" : "Draft"}
                    </span>
                  </label>

                  {/* Actions */}
                  <div className="flex gap-2 text-xs">
                    <button
                      onClick={() => openModal(true, r)}
                      className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                    >
                      <PencilSquareIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(r.r_id, r.reviewer_name)}
                      className="text-red-600 hover:text-red-800 flex items-center gap-1"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block bg-white rounded-xl shadow-sm overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Image</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Rating</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Comment</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-sm text-gray-700">
                {reviews.map((r) => (
                  <tr key={r.r_id}>
                    <td className="px-6 py-3">
                      {r.image_url ? (
                        <img
                          src={`${ApiURL}/assets/UserReviews/${r.image_url}`}
                          alt="review"
                          className="w-12 h-12 object-cover rounded-md"
                        />
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="px-6 py-3">{r.product_name || "N/A"}</td>
                    <td className="px-6 py-3 flex items-center gap-1">
                      {r.rating}
                      <StarIcon className="w-4 h-4 text-yellow-500" />
                    </td>
                    <td className="px-6 py-3">{r.message}</td>
                    <td className="px-6 py-3 text-gray-500">
                      {formatDate(r.createdAt)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-3">
                        {/* Publish Toggle */}
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={r.is_published}
                            onChange={() =>
                              togglePublish(r.r_id, r.is_published)
                            }
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                        </label>

                        {/* Edit & Delete */}
                        <button
                          onClick={() => openModal(true, r)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <PencilSquareIcon className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(r.r_id, r.reviewer_name)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center gap-2 flex-wrap">
              {getPageNumbers().map((n) => (
                <button
                  key={n}
                  onClick={() => paginate(n)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${currentPage === n
                    ? "bg-black text-white"
                    : "bg-white border border-gray-300 text-gray-700"
                    }`}
                >
                  {n}
                </button>
              ))}
            </div>
          )}
        </>
      )}

      {/* Delete Modal */}
      <ConfirmDeleteModal
        isOpen={deleteModal.isOpen}
        onClose={() =>
          setDeleteModal({ isOpen: false, reviewId: null, name: "" })
        }
        onConfirm={confirmDelete}
        itemType="review"
        itemName={deleteModal.name || "this review"}
      />

      {/* Add/Edit Modal */}
      {modal.open && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 sm:p-6">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md sm:max-w-lg md:max-w-xl mx-auto">
            {/* Header */}
            <div className="px-5 py-4 sm:px-6 sm:py-5 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
                {modal.editMode ? "Edit Review" : "Add New Review"}
              </h2>
              <button
                onClick={() =>
                  setModal({ open: false, editMode: false, reviewId: null })
                }
                className="p-2 -mr-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <XMarkIcon className="w-7 h-7 text-gray-500 hover:text-gray-700" />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 sm:p-6 space-y-6 max-h-[70vh] sm:max-h-[75vh] overflow-y-auto">
              {/* Product Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Product <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setProductDropdownOpen(!productDropdownOpen)}
                    className="w-full flex items-center justify-between px-4 py-3.5 border border-gray-300 rounded-xl bg-white hover:border-gray-400 focus:border-black focus:ring-2 focus:ring-black/20 transition text-left text-sm sm:text-base"
                  >
                    {form.product ? (
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        {form.productImage && (
                          <img
                            src={`${ApiURL}/assets/Products/${form.productImage}`}
                            alt=""
                            className="w-10 h-10 sm:w-11 sm:h-11 object-cover rounded-lg border border-gray-200 flex-shrink-0"
                          />
                        )}
                        <span className="font-medium text-gray-900 truncate">
                          {products.find((p) => p.p_id == form.product)?.name}
                        </span>
                      </div>
                    ) : (
                      <span className="text-gray-400">Select product</span>
                    )}
                    <span
                      className={`text-gray-500 transition-transform ml-2 ${productDropdownOpen ? "rotate-180" : ""
                        }`}
                    >
                      ▾
                    </span>
                  </button>

                  {/* Dropdown - important mobile fix */}
                  {productDropdownOpen && (
                    <div className="absolute z-50 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-2xl max-h-[45vh] sm:max-h-72 overflow-y-auto">
                      {products.length === 0 ? (
                        <div className="px-5 py-8 text-center text-gray-500 text-sm">
                          No products available
                        </div>
                      ) : (
                        products.map((p) => (
                          <div
                            key={p.p_id}
                            onClick={() => {
                              setForm({
                                ...form,
                                product: p.p_id,
                                productImage:
                                  p.productcolors?.[0]?.productimages?.[0]
                                    ?.image_url ||
                                  p.image ||
                                  "",
                              });
                              setProductDropdownOpen(false);
                            }}
                            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 active:bg-gray-100 cursor-pointer transition-colors border-b border-gray-100 last:border-0"
                          >
                            <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                              {p.productcolors?.[0]?.productimages?.[0]
                                ?.image_url ? (
                                <img
                                  src={`${ApiURL}/assets/Products/${p.productcolors[0].productimages[0].image_url}`}
                                  alt=""
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                                  No img
                                </div>
                              )}
                            </div>
                            <span className="text-sm font-medium text-gray-900 truncate">
                              {p.name}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Rating - smaller on mobile */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Rating <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-1.5 sm:gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setForm({ ...form, rating: star })}
                      className={`p-1.5 transition-transform active:scale-95 sm:hover:scale-110 ${star <= form.rating
                        ? "text-yellow-500"
                        : "text-gray-200"
                        }`}
                    >
                      <StarIcon className="w-8 h-8 sm:w-10 sm:h-10 drop-shadow-sm" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Comment */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Review Comment <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  value={form.comment}
                  onChange={(e) =>
                    setForm({ ...form, comment: e.target.value })
                  }
                  placeholder="Write your honest review here..."
                  className="w-full px-4 py-3.5 text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-black resize-none placeholder-gray-400"
                />
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Reviewer Name (optional)
                </label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-3.5 text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-black placeholder-gray-400"
                />
              </div>

              {/* In your Add/Edit Review Modal - after Reviewer Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Display Date{" "}
                  {modal.editMode && form.is_fake ? "(custom)" : ""}
                </label>
                <input
                  type="date"
                  value={form.customCreatedAt || ""} // Expecting 'YYYY-MM-DD'
                  onChange={(e) =>
                    setForm({
                      ...form,
                      customCreatedAt: e.target.value || null,
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-black"
                />
                <p className="mt-1 text-xs text-gray-500">
                  {modal.editMode && !form.is_fake
                    ? "Only fake reviews can have custom display dates"
                    : "Leave empty to use today's date"}
                </p>
              </div>

              {/* Image Upload - better mobile layout */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Customer Photo (optional)
                </label>

                <div className="flex flex-col sm:flex-row sm:items-start gap-4 mt-2">
                  <label className="cursor-pointer inline-block">
                    <div className="w-full max-w-[140px] sm:w-32 h-32 sm:h-32 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 active:bg-gray-100 transition-colors overflow-hidden">
                      {form.preview ? (
                        <img
                          src={form.preview}
                          alt="preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <>
                          <svg
                            className="w-10 h-10 text-gray-400 mb-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          <span className="text-xs text-gray-500 text-center px-3">
                            Tap to upload
                          </span>
                        </>
                      )}
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          setForm({
                            ...form,
                            image: e.target.files[0],
                            preview: URL.createObjectURL(e.target.files[0]),
                          });
                        }
                      }}
                    />
                  </label>

                  {form.preview && (
                    <div className="text-sm text-gray-600 sm:mt-2">
                      <p className="font-medium">Image selected</p>
                      <button
                        type="button"
                        onClick={() =>
                          setForm({ ...form, image: null, preview: null })
                        }
                        className="text-red-600 hover:text-red-800 underline text-sm mt-1"
                      >
                        Remove photo
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer - better stacking on mobile */}
            <div className="px-5 py-5 sm:px-6 sm:py-5 border-t border-gray-100 flex flex-col-reverse sm:flex-row gap-3 sm:gap-4">
              <button
                type="button"
                onClick={() =>
                  setModal({ open: false, editMode: false, reviewId: null })
                }
                className="flex-1 py-3.5 px-6 rounded-xl font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 active:bg-gray-200 transition-colors order-2 sm:order-1"
              >
                Cancel
              </button>

              <button
                disabled={submitting}
                onClick={handleSubmit}
                className={`flex-1 py-3.5 px-6 rounded-xl font-medium text-white transition-colors order-1 sm:order-2 ${submitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-black hover:bg-gray-900 active:bg-gray-900"
                  }`}
              >
                {submitting
                  ? "Saving..."
                  : modal.editMode
                    ? "Update Review"
                    : "Add Review"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reviews;
