import { useState, useEffect, useRef } from "react";
import {
  FaTrash,
  FaRupeeSign,
  FaChevronDown,
  FaSearch,
  FaSpinner,
  FaTruck,
  FaBoxOpen,
  FaDownload,
} from "react-icons/fa";
import { toast } from "react-hot-toast";
import { adminAxios } from "../../Axios/axios";
import { ApiURL } from "../../Variable";
import TrackingSection from "./TrackingSection";
import { ORDER_STATUS, STATUS_LABELS, STATUS_COLORS } from "../../utils/constants";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [openDropdownKey, setOpenDropdownKey] = useState(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpenDropdownKey(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [openOrderId, setOpenOrderId] = useState(null);
  const [logistics, setLogistics] = useState([]);
  const [selectedLogistic, setSelectedLogistic] = useState(null);
  const [loadingLogistics, setLoadingLogistics] = useState(false);
  const [trackingDetails, setTrackingDetails] = useState([]);
  const limit = 20;

  const getStatusInfo = (status) => {
    const s = parseInt(status);
    return {
      label: STATUS_LABELS[s] || "Unknown",
      color: STATUS_COLORS[s] || STATUS_COLORS[ORDER_STATUS.CANCELLED],
    };
  };

  // Consolidate fetching logic
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchOrders(currentPage, searchTerm);
    }, searchTerm ? 600 : 0);
    return () => clearTimeout(timer);
  }, [currentPage, searchTerm]);

  // Reset to page 1 when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const fetchOrders = async (page = 1, search = "") => {
    try {
      const response = await adminAxios.post(`${ApiURL}/getallorders`, {
        page,
        limit,
        search,
      });
      if (response?.data?.status === 1) {
        setOrders(response.data.data.orders || []);
        setTotalPages(response.data.data.totalPages || 1);
      } else {
        setOrders([]);
      }
    } catch (error) {
      toast.error(error?.message || "Failed to load orders");
      setOrders([]);
    }
  };

  const toggleOrder = (orderId) => {
    // clear tracking when switching orders
    if (openOrderId !== orderId) {
      setTrackingDetails([]);
    }

    setOpenOrderId(openOrderId === orderId ? null : orderId);

    if (openOrderId !== orderId && orders) {
      const order = orders.find((o) => o.orderId === orderId);
      if (order && !order.logistic_id && order.expressfly_order_id) {
        fetchLogistics(order.expressfly_order_id);
      }
    }
  };

  const fetchLogistics = async (expressflyOrderId) => {
    try {
      setLoadingLogistics(true);
      const res = await adminAxios.post(
        `${ApiURL}/get-logistics/${expressflyOrderId}`,
        {},
      );
      if (res.data.status === 1) {
        setLogistics(Object.values(res.data.data));
      } else {
        toast.error(res.data.message);
      }
    } catch {
      toast.error("Failed to load logistics");
    } finally {
      setLoadingLogistics(false);
    }
  };

  const shipOrder = async (orderId) => {
    if (!selectedLogistic) return toast.error("Select a logistic partner");

    toast.loading("Shipping order...", { id: "ship" });
    try {
      const order = orders.find((o) => o.orderId === orderId);
      const res = await adminAxios.post(`${ApiURL}/ship-order`, {
        expressfly_order_id: order.expressfly_order_id,
        logistic_id: selectedLogistic.logistic_id,
      });

      toast.dismiss("ship");
      if (res.data.status === 1) {
        toast.success("Order shipped!");
        fetchOrders(currentPage, searchTerm);
      } else {
        toast.error(res.data.message || "Shipping failed");
      }
    } catch {
      toast.dismiss("ship");
      toast.error("Shipping error");
    }
  };

  const handleTracking = async (awb) => {
    setTrackingDetails([]);
    try {
      const res = await adminAxios.get(`${ApiURL}/track/${awb}`);
      setTrackingDetails(res.data.data);
    } catch {
      setTrackingDetails([]);
    }
  };

  const printLabel = (awb) => {
    if (!awb) return toast.error("No AWB");
    window.open(`${ApiURL}/shipping-label/${awb}`, "_blank");
    toast.success("Downloading label...");
  };

  const cancelOrder = async (orderId) => {
    if (!window.confirm("Cancel this order?")) return;
    try {
      const res = await adminAxios.put(`${ApiURL}/cancelorder`, {
        order_id: orderId,
      });
      if (res.data.status === 1) {
        toast.success("Order cancelled");
        fetchOrders(currentPage, searchTerm);
      }
    } catch {
      toast.error("Failed to cancel");
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      toast.loading("Updating status...", { id: "updateStatus" });
      const res = await adminAxios.put(`${ApiURL}/updateorderstatus/${orderId}`, {
        status: newStatus,
      });
      toast.dismiss("updateStatus");
      if (res.data.status === 1) {
        toast.success("Order status updated");
        fetchOrders(currentPage, searchTerm);
      } else {
        toast.error(res.data.description || "Failed to update status");
      }
    } catch (error) {
      toast.dismiss("updateStatus");
      toast.error(error.message || "Error updating status");
    }
  };

  return (
    <div className="pb-8 min-h-screen bg-gray-50" ref={containerRef}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Order Management
            </h1>
            <p className="text-sm text-gray-600 mt-1 font-medium">
              Monitor and process your store's orders
            </p>
          </div>

          <div className="relative group w-full md:w-96">
            <FaSearch
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors"
              size={18}
            />
            <input
              type="text"
              placeholder="Search by ID, name, phone..."
              className="w-full pl-11 pr-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all duration-200 text-sm font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Orders Grid */}
        <div className="grid gap-6">
          {orders.length === 0 ? (
            <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-gray-200">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaBoxOpen className="text-gray-300 text-3xl" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">No orders found</h3>
              <p className="text-gray-500 mt-1 text-sm">Try adjusting your search filters</p>
            </div>
          ) : (
            orders.map((order) => {
              const status = getStatusInfo(order.status);
              return (
                <div
                  key={order.orderId}
                  className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all duration-300"
                >
                  {/* Card Header/Row */}
                  <div
                    className={`p-6 cursor-pointer transition-colors ${openOrderId === order.orderId ? "bg-gray-50/50" : "hover:bg-gray-50/30"
                      }`}
                    onClick={() => toggleOrder(order.orderId)}
                  >
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 items-center">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                          Reference
                        </span>
                        <p className="text-base font-bold text-gray-900">
                          #{order.orderId}
                        </p>
                      </div>

                      <div className="space-y-1 hidden sm:block">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                          Customer
                        </span>
                        <p className="text-sm font-semibold text-gray-800 truncate">
                          {`${order?.address?.first_name} ${order?.address?.last_name || ""
                            }`}
                        </p>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                          Grand Total
                        </span>
                        <div className="flex flex-col">
                          <p className="text-base font-bold text-gray-900">
                            ₹{order.grandTotal.toFixed(2)}
                          </p>
                          <span className="text-[10px] font-medium text-gray-500">
                            {order.paymentStatus}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col items-start space-y-2">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest sm:hidden">
                          Status
                        </span>
                        <span
                          className={`px-3 py-1 rounded-full text-[11px] font-bold border ${status.color}`}
                        >
                          {status.label}
                        </span>
                      </div>

                      <div className="flex items-center justify-end gap-3 lg:col-span-1">
                        {order.awb_number && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              printLabel(order.awb_number);
                            }}
                            className="p-2.5 bg-white border border-gray-200 text-gray-600 hover:text-black hover:border-black rounded-xl shadow-sm transition-all duration-200 hover:scale-105"
                            title="Download Label"
                          >
                            <FaDownload size={14} />
                          </button>
                        )}
                        <div
                          className={`p-2 rounded-xl transition-all duration-200 ${openOrderId === order.orderId
                            ? "bg-black text-white rotate-180"
                            : "bg-gray-100 text-gray-400"
                            }`}
                        >
                          <FaChevronDown size={14} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {openOrderId === order.orderId && (
                    <div className="px-6 pb-8 bg-gray-50/30 border-t border-gray-100 animate-in fade-in slide-in-from-top-2 duration-300">
                      <div className="grid lg:grid-cols-3 gap-6 mt-8">
                        {/* Shipping Info */}
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
                          <div className="flex items-center gap-3 mb-5 pb-4 border-b border-gray-50">
                            <div className="p-2 bg-black text-white rounded-lg">
                              <FaTruck size={16} />
                            </div>
                            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                              Shipping Details
                            </h3>
                          </div>
                          <div className="space-y-4">
                            <div className="space-y-1">
                              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                Recipient
                              </p>
                              <p className="text-sm font-bold text-gray-800">
                                {order.address.first_name}{" "}
                                {order.address.last_name}
                              </p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                Address
                              </p>
                              <p className="text-sm text-gray-600 leading-relaxed font-medium">
                                {order.address?.address},{" "}
                                {order.address?.apartment} <br />
                                {order.address.city}, {order.address.state} -{" "}
                                {order.address.zip_code}
                              </p>
                            </div>
                            <div className="pt-2 flex flex-col gap-2">
                              <div className="flex items-center justify-between text-[11px] font-bold">
                                <span className="text-gray-400 uppercase tracking-tighter">
                                  Phone
                                </span>
                                <span className="text-gray-800">
                                  {order.address.phone_number}
                                </span>
                              </div>
                              {order.address.email !== "N/A" && (
                                <div className="flex items-center justify-between text-[11px] font-bold">
                                  <span className="text-gray-400 uppercase tracking-tighter">
                                    Email
                                  </span>
                                  <span className="text-gray-800">
                                    {order.address.email}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Items */}
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm transition-all hover:shadow-md lg:col-span-1">
                          <div className="flex items-center gap-3 mb-5 pb-4 border-b border-gray-50">
                            <div className="p-2 bg-black text-white rounded-lg">
                              <FaBoxOpen size={16} />
                            </div>
                            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                              Ordered Items
                            </h3>
                          </div>
                          <div className="max-h-[300px] overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                            {order.orderItems.map((item) => (
                              <div
                                key={item.orderItemId}
                                className="flex gap-4 p-3 bg-gray-50/50 rounded-xl border border-gray-100/50"
                              >
                                <div className="relative group">
                                  <img
                                    src={
                                      item.imageUrl
                                        ? `${ApiURL}/assets/Products/${item.imageUrl}`
                                        : "/placeholder.jpg"
                                    }
                                    alt={item.productName}
                                    className="w-14 h-14 object-cover rounded-lg shadow-sm"
                                    onError={(e) =>
                                      (e.target.src = "/placeholder.jpg")
                                    }
                                  />
                                  <span className="absolute -top-2 -right-2 bg-black text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                                    {item.quantity}
                                  </span>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="text-[13px] font-bold text-gray-800 truncate">
                                    {item.productName}
                                  </h4>
                                  <div className="flex flex-wrap gap-2 mt-1">
                                    {item.size && (
                                      <span className="text-[9px] font-extrabold bg-gray-200 px-1.5 py-0.5 rounded uppercase">
                                        Size: {item.size}
                                      </span>
                                    )}
                                    {item.color && (
                                      <span className="text-[9px] font-extrabold bg-gray-200 px-1.5 py-0.5 rounded uppercase">
                                        Color: {item.color.color_name}
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-[11px] font-bold text-gray-900 mt-1">
                                    ₹{item.price}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Payment & Actions */}
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
                          <div className="flex items-center gap-3 mb-5 pb-4 border-b border-gray-50">
                            <div className="p-2 bg-black text-white rounded-lg">
                              <FaRupeeSign size={16} />
                            </div>
                            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                              Summary & Control
                            </h3>
                          </div>
                          <div className="space-y-4">
                            <div className="bg-gray-50 p-4 rounded-xl space-y-3 font-bold text-[11px]">
                              <div className="flex justify-between">
                                <span className="text-gray-400">SUBTOTAL</span>
                                <span className="text-gray-800">
                                  ₹{order.totalPrice.toFixed(2)}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-400">SHIPPING</span>
                                <span className="text-gray-800">
                                  ₹{order.shippingCharge.toFixed(2)}
                                </span>
                              </div>
                              <div className="border-t border-gray-200 pt-3 flex justify-between text-base">
                                <span className="text-gray-900 font-extrabold">
                                  TOTAL
                                </span>
                                <span className="text-black font-extrabold">
                                  ₹{order.grandTotal.toFixed(2)}
                                </span>
                              </div>
                            </div>

                            <div className="pt-4 flex flex-col gap-3">
                              {order.logistic_id ? (
                                <button
                                  onClick={() => handleTracking(order.awb_number)}
                                  className="w-full py-3 bg-black text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-gray-900 transition-all shadow-sm active:scale-95"
                                >
                                  <FaTruck size={14} /> Track Order
                                </button>
                              ) : (
                                <div className="space-y-3">
                                  <div className="relative">
                                    <button
                                      type="button"
                                      onClick={() => setOpenDropdownKey(openDropdownKey === `carrier-${order.orderId}` ? null : `carrier-${order.orderId}`)}
                                      className="flex items-center justify-between w-full px-4 py-3 border border-gray-200 rounded-xl bg-white text-sm font-bold focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all cursor-pointer"
                                    >
                                      <span>
                                        {selectedLogistic ? `${selectedLogistic.logistic} – ₹${selectedLogistic.total}` : "Select Carrier"}
                                      </span>
                                      <FaChevronDown
                                        className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                                          openDropdownKey === `carrier-${order.orderId}` ? "rotate-180 text-[#0f1115]" : ""
                                        }`}
                                      />
                                    </button>

                                    {openDropdownKey === `carrier-${order.orderId}` && (
                                      <div className="absolute left-0 w-full mt-1 bg-white rounded-lg shadow-xl border border-gray-200 overflow-y-auto max-h-60 z-[100] transform origin-top transition-all duration-200">
                                        <button
                                          type="button"
                                          onClick={() => {
                                            setSelectedLogistic(null);
                                            setOpenDropdownKey(null);
                                          }}
                                          className={`w-full text-left px-4 py-2.5 text-sm transition-colors cursor-pointer flex items-center justify-between font-bold ${
                                            !selectedLogistic
                                              ? "bg-[#0f1115]/10 text-[#0f1115] font-semibold"
                                              : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                                          }`}
                                        >
                                          <span>Select Carrier</span>
                                          {!selectedLogistic && (
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
                                        {logistics.map((l) => {
                                          const isSelected = selectedLogistic?.logistic_id === l.logistic_id;
                                          return (
                                            <button
                                              key={l.logistic_id}
                                              type="button"
                                              onClick={() => {
                                                setSelectedLogistic(l);
                                                setOpenDropdownKey(null);
                                              }}
                                              className={`w-full text-left px-4 py-2.5 text-sm transition-colors cursor-pointer flex items-center justify-between font-bold ${
                                                isSelected
                                                  ? "bg-[#0f1115]/10 text-[#0f1115] font-semibold"
                                                  : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                                              }`}
                                            >
                                              <span>{l.logistic} – ₹{l.total}</span>
                                              {isSelected && (
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
                                          );
                                        })}
                                      </div>
                                    )}
                                  </div>

                                  {selectedLogistic && (
                                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                                      <img
                                        src={`https://cp.expressfly.in/logos/${selectedLogistic.logo_image}`}
                                        alt={selectedLogistic.logistic}
                                        className="h-8 rounded"
                                      />
                                      <span className="text-xs font-bold text-gray-800">
                                        {selectedLogistic.logistic}
                                      </span>
                                    </div>
                                  )}

                                  <button
                                    onClick={() => shipOrder(order.orderId)}
                                    disabled={
                                      !selectedLogistic || loadingLogistics
                                    }
                                    className="w-full py-3 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-sm active:scale-95 cursor-pointer"
                                  >
                                    {loadingLogistics ? (
                                      <FaSpinner size={14} className="animate-spin mx-auto" />
                                    ) : (
                                      "Ship Dispatch"
                                    )}
                                  </button>
                                </div>
                              )}
                              <div className="pt-2">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">
                                  Update Status
                                </span>
                                <div className="relative">
                                  <button
                                    type="button"
                                    onClick={() => setOpenDropdownKey(openDropdownKey === `status-${order.orderId}` ? null : `status-${order.orderId}`)}
                                    className="flex items-center justify-between w-full px-4 py-3 border border-gray-200 rounded-xl bg-white text-sm font-bold focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all cursor-pointer"
                                  >
                                    <span>
                                      {STATUS_LABELS[order.status] || "Unknown"}
                                    </span>
                                    <FaChevronDown
                                      className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                                        openDropdownKey === `status-${order.orderId}` ? "rotate-180 text-[#0f1115]" : ""
                                      }`}
                                    />
                                  </button>

                                  {openDropdownKey === `status-${order.orderId}` && (
                                    <div className="absolute left-0 w-full mt-1 bg-white rounded-lg shadow-xl border border-gray-200 overflow-y-auto max-h-60 z-[100] transform origin-top transition-all duration-200">
                                      {Object.values(ORDER_STATUS).map((value) => {
                                        const isSelected = order.status === value;
                                        return (
                                          <button
                                            key={value}
                                            type="button"
                                            onClick={() => {
                                              updateOrderStatus(order.orderId, value);
                                              setOpenDropdownKey(null);
                                            }}
                                            className={`w-full text-left px-4 py-2.5 text-sm transition-colors cursor-pointer flex items-center justify-between font-bold ${
                                              isSelected
                                                ? "bg-[#0f1115]/10 text-[#0f1115] font-semibold"
                                                : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                                            }`}
                                          >
                                            <span>{STATUS_LABELS[value]}</span>
                                            {isSelected && (
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
                                        );
                                      })}
                                    </div>
                                  )}
                                </div>
                              </div>

                              <button
                                onClick={() => cancelOrder(order.orderId)}
                                className="w-full py-3 bg-white border border-rose-200 text-rose-600 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-rose-50 transition-all active:scale-95 cursor-pointer"
                              >
                                <FaTrash size={12} /> Cancel Order
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {trackingDetails.length > 0 && (
                        <div className="mt-8 pt-8 border-t border-gray-100">
                          <TrackingSection trackingData={trackingDetails} />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-10 flex justify-center gap-2 flex-wrap">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-5 py-2.5 rounded-2xl font-bold transition-all duration-200 ${currentPage === i + 1
                  ? "bg-black text-white shadow-lg scale-110"
                  : "bg-white text-gray-500 hover:text-black border border-gray-100"
                  }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
