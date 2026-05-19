/* eslint-disable no-unused-vars */
// src/pages/admin/PromotionsManagement.jsx
import { useEffect, useState, useRef } from "react";
import { ChevronDown } from "lucide-react";
import { ApiURL, showToaster } from "../../Variable"; // adjust path if needed
import { adminAxios } from "../../Axios/axios";
import {
  PlusIcon,
  TrashIcon,
  PencilSquareIcon,
  ArrowPathIcon,
  TagIcon,
  PercentBadgeIcon,
} from "@heroicons/react/24/outline";

const PromotionsManagement = () => {
  const [activeTab, setActiveTab] = useState("offers"); // "offers" | "coupons"
  const [offers, setOffers] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [formData, setFormData] = useState({});

  // Delete confirmation
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    id: null,
    type: null, // "offer" | "coupon"
  });

  const fetchOffers = async () => {
    try {
      setLoading(true);
      const res = await adminAxios.post(`${ApiURL}/getoffers`);
      if (res?.data?.status === 1) setOffers(res.data.data || []);
    } catch (err) {
      console.error("Error fetching offers:", err);
      showToaster(0, "Failed to load offers");
    } finally {
      setLoading(false);
    }
  };

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const res = await adminAxios.post(`${ApiURL}/getcoupons`);
      if (res?.data?.status === 1) setCoupons(res.data.data || []);
    } catch (err) {
      console.error("Error fetching coupons:", err);
      showToaster(0, "Failed to load coupons");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "offers") fetchOffers();
    else fetchCoupons();
  }, [activeTab]);

  const openAddModal = () => {
    setIsEdit(false);
    setFormData(activeTab === "offers" ? {} : {});
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setIsEdit(true);
    setFormData({ ...item });
    setIsModalOpen(true);
  };

  const handleDeleteRequest = (id) => {
    setDeleteModal({
      isOpen: true,
      id,
      type: activeTab === "offers" ? "offer" : "coupon",
    });
  };

  const confirmDelete = async () => {
    const endpoint =
      deleteModal.type === "offer" ? "deleteoffer" : "deletecoupon";
    const idField = deleteModal.type === "offer" ? "offer_id" : "coupon_id";

    try {
      const res = await adminAxios.post(`${ApiURL}/${endpoint}`, {
        [idField]: deleteModal.id,
      });
      showToaster(res?.data?.status, res?.data?.description || "Deleted");
      if (res?.data?.status === 1) {
        if (deleteModal.type === "offer") fetchOffers();
        else fetchCoupons();
      }
    } catch (err) {
      showToaster(0, "Error deleting item");
    } finally {
      setDeleteModal({ isOpen: false, id: null, type: null });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isOffer = activeTab === "offers";
    const endpoint = isEdit
      ? isOffer
        ? "updateoffer"
        : "updatecoupon"
      : isOffer
        ? "addoffer"
        : "addcoupon";

    try {
      const res = await adminAxios[isEdit ? "put" : "post"](
        `${ApiURL}/${endpoint}`,
        formData
      );
      showToaster(
        res?.data?.status,
        res?.data?.description || (isEdit ? "Updated" : "Created")
      );

      if (res?.data?.status === 1) {
        isOffer ? fetchOffers() : fetchCoupons();
        setIsModalOpen(false);
        setFormData({});
      }
    } catch (err) {
      showToaster(0, "Error saving promotion");
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <div className="mb-8">
      {/* Header + Tabs + Add Button */}
      <div className="flex flex-col gap-6 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-800">
            Promotions Management
          </h1>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setActiveTab("offers")}
              className={`px-5 py-2 rounded-lg font-medium transition-colors cursor-pointer ${activeTab === "offers"
                ? "bg-black text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
            >
              <PercentBadgeIcon className="inline h-5 w-5 mr-1.5" />
              Offers
            </button>
            <button
              onClick={() => setActiveTab("coupons")}
              className={`px-5 py-2 rounded-lg font-medium transition-colors cursor-pointer ${activeTab === "coupons"
                ? "bg-black text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
            >
              <TagIcon className="inline h-5 w-5 mr-1.5" />
              Coupons
            </button>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={openAddModal}
            className="flex items-center justify-center gap-2 bg-black text-white px-5 py-2 rounded-lg hover:bg-gray-900 transition-colors cursor-pointer"
          >
            <PlusIcon className="h-5 w-5" />
            Add {activeTab === "offers" ? "Offer" : "Coupon"}
          </button>
        </div>
      </div>

      {/* Content */}
      {(activeTab === "offers" ? offers : coupons).length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No {activeTab} found</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {activeTab === "offers" ? (
                  <>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Condition
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Discount
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </>
                ) : (
                  <>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Code
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Discount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Min Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Valid Period
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {(activeTab === "offers" ? offers : coupons).map((item) =>
                activeTab === "offers" ? (
                  <tr key={item.offer_id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="bg-gray-100 px-3 py-1 rounded-full text-gray-700 text-sm">
                        {item.offer_type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {item.offer_type === "QTY"
                        ? `≥ ${item.min_qty} qty`
                        : `≥ ₹${item.min_amount || "-"}`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {item.discount_percent}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => openEditModal(item)}
                        className="text-black mr-4 hover:text-gray-700 cursor-pointer"
                      >
                        <PencilSquareIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteRequest(item.offer_id)}
                        className="text-red-600 hover:text-red-800 cursor-pointer"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ) : (
                  <tr key={item.coupon_id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-mono font-semibold text-gray-800">
                        {item.code}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.discount_percent}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      ₹{item.min_amount || "0"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(item.start_date).toLocaleDateString()} –{" "}
                      {new Date(item.end_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => openEditModal(item)}
                        className="text-black mr-4 hover:text-gray-700 cursor-pointer"
                      >
                        <PencilSquareIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteRequest(item.coupon_id)}
                        className="text-red-600 hover:text-red-800 cursor-pointer"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <h2 className="text-xl font-bold mb-5">
              {isEdit ? "Edit" : "Add New"}{" "}
              {activeTab === "offers" ? "Offer" : "Coupon"}
            </h2>

            <form onSubmit={handleSubmit}>
              {activeTab === "offers" ? (
                <>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Offer Type
                    </label>
                    <div className="relative" ref={dropdownRef}>
                      <button
                        type="button"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="flex items-center justify-between w-full px-3 py-2 border rounded-lg text-sm text-gray-900 bg-white cursor-pointer focus:outline-none focus:ring-1 focus:ring-black"
                      >
                        <span>
                          {formData.offer_type === "QTY"
                            ? "Quantity Based"
                            : formData.offer_type === "CART"
                            ? "Cart Amount Based"
                            : "Select type"}
                        </span>
                        <ChevronDown
                          className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                            isDropdownOpen ? "rotate-180 text-[#0f1115]" : ""
                          }`}
                        />
                      </button>

                      {isDropdownOpen && (
                        <div className="absolute left-0 w-full mt-1 bg-white rounded-lg shadow-xl border border-gray-200 overflow-y-auto max-h-60 z-[100] transform origin-top transition-all duration-200">
                          <button
                            type="button"
                            onClick={() => {
                              handleChange({ target: { name: "offer_type", value: "" } });
                              setIsDropdownOpen(false);
                            }}
                            className={`w-full text-left px-4 py-2.5 text-sm transition-colors cursor-pointer flex items-center justify-between ${
                              !formData.offer_type
                                ? "bg-[#0f1115]/10 text-[#0f1115] font-semibold"
                                : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                            }`}
                          >
                            <span>Select type</span>
                            {!formData.offer_type && (
                              <svg
                                className="w-4 h-4 text-[#0f1115]"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2.5"
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              handleChange({ target: { name: "offer_type", value: "QTY" } });
                              setIsDropdownOpen(false);
                            }}
                            className={`w-full text-left px-4 py-2.5 text-sm transition-colors cursor-pointer flex items-center justify-between ${
                              formData.offer_type === "QTY"
                                ? "bg-[#0f1115]/10 text-[#0f1115] font-semibold"
                                : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                            }`}
                          >
                            <span>Quantity Based</span>
                            {formData.offer_type === "QTY" && (
                              <svg
                                className="w-4 h-4 text-[#0f1115]"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2.5"
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              handleChange({ target: { name: "offer_type", value: "CART" } });
                              setIsDropdownOpen(false);
                            }}
                            className={`w-full text-left px-4 py-2.5 text-sm transition-colors cursor-pointer flex items-center justify-between ${
                              formData.offer_type === "CART"
                                ? "bg-[#0f1115]/10 text-[#0f1115] font-semibold"
                                : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                            }`}
                          >
                            <span>Cart Amount Based</span>
                            {formData.offer_type === "CART" && (
                              <svg
                                className="w-4 h-4 text-[#0f1115]"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2.5"
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {formData.offer_type === "QTY" && (
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Minimum Quantity
                      </label>
                      <input
                        type="number"
                        name="min_qty"
                        value={formData.min_qty || ""}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                        min="1"
                        required
                      />
                    </div>
                  )}

                  {formData.offer_type === "CART" && (
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Minimum Cart Amount
                      </label>
                      <input
                        type="number"
                        name="min_amount"
                        value={formData.min_amount || ""}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                        min="0"
                        required
                      />
                    </div>
                  )}

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Discount Percent (%)
                    </label>
                    <input
                      type="number"
                      name="discount_percent"
                      value={formData.discount_percent || ""}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                      min="1"
                      max="100"
                      required
                    />
                  </div>
                </>
              ) : (
                <>
                  {!isEdit && (
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Coupon Code
                      </label>
                      <input
                        type="text"
                        name="code"
                        value={formData.code || ""}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black uppercase"
                        placeholder="SUMMER25"
                        required
                      />
                    </div>
                  )}

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Discount Percent (%)
                    </label>
                    <input
                      type="number"
                      name="discount_percent"
                      value={formData.discount_percent || ""}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                      min="1"
                      max="100"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Minimum Amount (₹)
                    </label>
                    <input
                      type="number"
                      name="min_amount"
                      value={formData.min_amount || 0}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                      min="0"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Start Date
                      </label>
                      <input
                        type="date"
                        name="start_date"
                        value={formData.start_date?.split("T")[0] || ""}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        End Date
                      </label>
                      <input
                        type="date"
                        name="end_date"
                        value={formData.end_date?.split("T")[0] || ""}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                        required
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Common fields */}
              <div className="mb-6">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={formData.is_active !== false}
                    onChange={handleChange}
                    className="h-4 w-4 text-black border-gray-300 rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Active
                  </span>
                </label>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-black text-white rounded-lg hover:bg-gray-900 transition-colors"
                >
                  {isEdit ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this {deleteModal.type}?
              <br />
              This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() =>
                  setDeleteModal({ isOpen: false, id: null, type: null })
                }
                className="px-5 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PromotionsManagement;
