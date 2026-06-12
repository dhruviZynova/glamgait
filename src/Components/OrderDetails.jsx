import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { ChevronLeft, Package, Truck, CheckCircle, MapPin, X, XCircle, RefreshCcw, Receipt, ArrowLeftRight, Star, Calendar, Loader2, Pencil, Trash2 } from "lucide-react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import SideBar from "./SideBar";
import axiosInstance from "../Axios/axios";
import { ApiURL, userInfo } from "../Variable";
import BrandBanner from "./BrandBanner";
import CancelOrderModal from "./CancelOrderModal";
import ReturnOrderModal from "./ReturnOrderModal";
import { getGuestId } from "../utils/guest";
import { ORDER_STATUS } from "../utils/constants";
import InvoiceModal from "./InvoiceModal";
import ScrollReveal from "./Ui/ScrollReveal";
import ProductReviewModal from "./ProductReviewModal";

const OrderDetailsSkeleton = () => (
  <div className="space-y-6">
    {/* Breadcrumb / title shimmer */}
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8 animate-pulse">
      <div className="h-8 w-48 rounded bg-gray-200" />
      <div className="h-10 w-32 rounded-xl bg-gray-200" />
    </div>

    {/* Timeline Card Shimmer */}
    <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 animate-pulse">
      <div className="h-4 w-32 rounded bg-gray-200 mb-6" />
      <div className="h-2 w-full rounded bg-gray-200 mb-8" />
      <div className="flex justify-between gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gray-200" />
            <div className="h-3 w-16 rounded bg-gray-200" />
          </div>
        ))}
      </div>
    </div>

    {/* Order Items Card Shimmer */}
    <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 space-y-6 animate-pulse">
      <div className="h-6 w-40 rounded bg-gray-200 mb-4" />
      {[...Array(2)].map((_, i) => (
        <div key={i} className="flex gap-4 items-center">
          <div className="w-20 h-20 rounded-xl bg-gray-200 flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-5 w-48 rounded bg-gray-200" />
            <div className="h-4 w-32 rounded bg-gray-200" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

const OrderDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [tracking, setTracking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [isCreditNote, setIsCreditNote] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedProductForReview, setSelectedProductForReview] = useState(null);
  const [checkingReviews, setCheckingReviews] = useState(false);
  const [existingReviewForModal, setExistingReviewForModal] = useState(null);

  // ✅ Init from localStorage so badge persists across page refreshes
  const [reviewsStatus, setReviewsStatus] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("glamgait_reviewed_pids") || "[]");
      const map = {};
      stored.forEach(pid => { map[Number(pid)] = { status: "pending", is_published: 0 }; });
      return map;
    } catch (_) { return {}; }
  });

  const user = userInfo();
  const u_id = user?.u_id;
  const guestId = getGuestId();
  const isLoggedIn = !!u_id;

  const checkReviews = async () => {
    if (!order?.orderItems || !u_id) return;
    setCheckingReviews(true);
    const statusMap = {};
    for (const item of order.orderItems) {
      const rawId = item.p_id || item.product_id || item.pid || item.id || item.productId || item.product?.p_id || item.product?.product_id || item.product?.id;
      const p_id = rawId ? Number(rawId) : null;
      if (!p_id || isNaN(p_id)) continue;
      try {
        const body = { p_id };
        if (u_id) {
          body.currentUserId = Number(u_id);
        }
        const res = await axiosInstance.post("/getuserreviews", body);
        if (res.data.status === 1) {
          const data = res.data.data;
          let userRev = null;
          if (Array.isArray(data)) {
            userRev = data.find(r => String(r.u_id || r.user_id) === String(u_id));
          } else if (data && typeof data === 'object') {
            userRev = data;
          }
          statusMap[p_id] = userRev || null;
        }
      } catch (err) {
        console.warn("Could not check review status for product", p_id, err?.response?.status);
        if (err.response?.status === 400) {
          statusMap[p_id] = null;
        }
      }
    }
    // MERGE into existing state so optimistic updates aren't overwritten on API errors
    setReviewsStatus(prev => ({ ...prev, ...statusMap }));
    setCheckingReviews(false);
  };

  useEffect(() => {
    if (order?.status === ORDER_STATUS.DELIVERED) {
      checkReviews();
    }
  }, [order, u_id]);

  const handleReviewSaved = (submittedPId) => {
    // ✅ Immediately hide the Write Review button (optimistic update)
    if (submittedPId) {
      setReviewsStatus(prev => ({
        ...prev,
        [Number(submittedPId)]: { status: "pending", is_published: 0, _optimistic: true },
      }));
    }
    // Then sync with server in the background
    checkReviews();
  };

  const handleDeleteReview = async (reviewId, p_id) => {
    try {
      const res = await axiosInstance.delete(`/deleteuserreview/${reviewId}`);
      if (res.data?.status === 1) {
        toast.success("Review deleted successfully.");
        // Remove from localStorage
        try {
          const stored = JSON.parse(localStorage.getItem("glamgait_reviewed_pids") || "[]");
          const updated = stored.filter(pid => Number(pid) !== Number(p_id));
          localStorage.setItem("glamgait_reviewed_pids", JSON.stringify(updated));
        } catch (_) { }
        // Optimistically set to null in reviewsStatus
        setReviewsStatus(prev => ({
          ...prev,
          [Number(p_id)]: null
        }));
        // Refresh reviews status
        checkReviews();
      } else {
        toast.error(res.data?.description || res.data?.message || "Failed to delete review");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Failed to delete review");
    }
  };

  const canShowInvoice = () => {
    if (!order) return false;
    const payStatus = order.paymentStatus?.toLowerCase() || "";
    if (payStatus.includes("failed") || payStatus.includes("pending")) return false;

    return [
      ORDER_STATUS.ACCEPTED,
      ORDER_STATUS.PREPARING,
      ORDER_STATUS.SHIPPED,
      ORDER_STATUS.DELIVERED
    ].includes(order.status);
  };

  const canShowCreditNote = () => {
    if (!order) return false;
    return [
      ORDER_STATUS.CANCELLED,
      ORDER_STATUS.RETURNED
    ].includes(order.status);
  };

  // 1. Fetch Order Details
  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) return;
      try {
        const orderRes = await axiosInstance.get(`${ApiURL}/getorder/${orderId}`);
        if (orderRes.data.status === 1) {
          setOrder(orderRes.data.data);
        }
      } catch (err) {
        console.error("Order fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  // 2. Fetch Tracking Info (when awb_number is available)
  useEffect(() => {
    const fetchTracking = async () => {
      if (order?.awb_number && !tracking) {
        try {
          const trackRes = await axiosInstance.get(`${ApiURL}/track/${order.awb_number}`);
          if (trackRes.data.status === 1 && trackRes.data.data) {
            setTracking(trackRes.data.data);
          }
        } catch (trackErr) {
          console.warn("Tracking API failed:", trackErr);
        }
      }
    };
    fetchTracking();
  }, [order?.awb_number, tracking]);

  const handleCancelOrder = async (reason) => {
    try {
      const res = await axiosInstance.put(`${ApiURL}/cancelorder`, {
        order_id: orderId,
        reason: reason,
        ...(!isLoggedIn && { guest_id: guestId }),
      });

      if (res.data.status === 1) {
        toast.success("Order cancelled successfully!");
        setOrder(prev => ({ ...prev, status: ORDER_STATUS.CANCELLED, status_label: "Cancelled" }));
      } else {
        toast.error(res.data.message || "Failed to cancel");
      }
    } catch (err) {
      toast.error("Something went wrong");
      console.error(err);
    } finally {
      setShowCancelModal(false);
    }
  };

  const handleReturnOrder = async (reason) => {
    try {
      const res = await axiosInstance.put(`${ApiURL}/returnorder`, {
        order_id: orderId,
        reason: reason,
        ...(!isLoggedIn && { guest_id: guestId }),
      });

      if (res.data.status === 1) {
        toast.success("Return request submitted successfully!");
        setOrder(prev => ({ ...prev, status: ORDER_STATUS.RETURNED, status_label: "Returned" }));
      } else {
        toast.error(res.data.message || "Failed to submit return request");
      }
    } catch (err) {
      toast.error("Something went wrong");
      console.error(err);
    } finally {
      setShowReturnModal(false);
    }
  };

  const steps = ["Order Placed", "Inprogress", "shipped", "Delivered"];

  const getStatusStep = (status) => {
    const s = status?.toLowerCase();
    if (s === "delivered") return 3;
    if (s === "shipped") return 2;
    if (s === "inprogress" || s === "preparing" || s === "accepted" || s === "order accepted") return 1;
    return 0; // "order placed" or "pending"
  };

  const currentStep = getStatusStep(order?.status_label);
  const progressWidth = (currentStep / (steps.length - 1)) * 100;

  const getStatusMessage = (status) => {
    const s = status?.toLowerCase();
    if (s === "delivered") return "Your order has been delivered successfully.";
    if (s === "shipped") return "Your order has been shipped and is on its way.";
    if (s === "inprogress" || s === "preparing" || s === "accepted" || s === "order accepted") return "Your order is currently being prepared and verified.";
    if (s === "cancelled") return "This order has been cancelled.";
    if (s === "returned") return "This order has been returned.";
    return "Your order has been placed successfully and is awaiting verification.";
  };

  return (
    <>
      <div className="w-full lg:py-8 py-4 px-2 md:px-8 xl:px-24">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-6 md:gap-14 font-poppins">
          {/* Sidebar */}
          <div className="w-full md:w-1/3 lg:w-1/4">
            <SideBar />
          </div>

          {/* Main content */}
          <div className="flex-1">
            {loading ? (
              <OrderDetailsSkeleton />
            ) : !order ? (
              <div className="min-h-[50vh] flex flex-col items-center justify-center text-red-600 font-bold bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                Order not found
              </div>
            ) : (
              <ScrollReveal animation="fade-left" duration={800}>
                {/* Header/Breadcrumb */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div className="flex items-center gap-2 text-[#3C4242]">
                    <ChevronLeft
                      className="cursor-pointer hover:text-[#063d32] transition-colors"
                      size={24}
                      onClick={() => navigate("/myorders", { state: { activeTab: location.state?.activeTab } })}
                    />
                    <h2 className="text-2xl sm:text-3xl font-semibold">Order Details</h2>
                  </div>

                  <div className="flex flex-row gap-3 w-full sm:w-auto">
                    {[
                      ORDER_STATUS.PENDING,
                      ORDER_STATUS.ACCEPTED,
                      ORDER_STATUS.PREPARING,
                      ORDER_STATUS.SHIPPED,
                    ].includes(order.status) && (
                        <button
                          onClick={() => setShowCancelModal(true)}
                          className="flex-1 sm:flex-none bg-white border border-red-200 text-red-600 px-4 py-2.5 rounded-xl font-semibold hover:bg-red-50 transition-all cursor-pointer text-sm text-center justify-center"
                        >
                          Cancel Order
                        </button>
                      )}
                    {order.status === ORDER_STATUS.DELIVERED && (
                      <button
                        onClick={() => setShowReturnModal(true)}
                        className="flex-1 sm:flex-none bg-white border border-[#063d32]/20 text-[#063d32] px-4 py-2.5 rounded-xl font-semibold hover:bg-emerald-50 transition-all cursor-pointer flex items-center justify-center gap-1.5 text-sm text-center"
                      >
                        <RefreshCcw size={16} />
                        Return Order
                      </button>
                    )}

                    {order.status === ORDER_STATUS.CANCELLED && (
                      <div className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 text-red-600 rounded-xl font-semibold border border-red-100 text-sm">
                        <XCircle size={16} />
                        <span>Cancelled</span>
                      </div>
                    )}

                    {order.status === ORDER_STATUS.RETURNED && (
                      <div className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-orange-50 text-orange-600 rounded-xl font-semibold border border-orange-100 text-sm">
                        <RefreshCcw size={16} />
                        <span>Returned</span>
                      </div>
                    )}

                    {canShowInvoice() && (
                      <button
                        onClick={() => {
                          setIsCreditNote(false);
                          setShowInvoiceModal(true);
                        }}
                        className="flex-1 sm:flex-none bg-white border border-emerald-200 text-emerald-600 px-4 py-2.5 rounded-xl font-semibold hover:bg-emerald-50 transition-all cursor-pointer flex items-center justify-center gap-1.5 text-sm text-center"
                      >
                        <Receipt size={16} />
                        Invoice
                      </button>
                    )}

                    {canShowCreditNote() && (
                      <button
                        onClick={() => {
                          setIsCreditNote(true);
                          setShowInvoiceModal(true);
                        }}
                        className="flex-1 sm:flex-none bg-white border border-rose-200 text-rose-600 px-4 py-2.5 rounded-xl font-semibold hover:bg-rose-50 transition-all cursor-pointer flex items-center justify-center gap-1.5 text-sm text-center"
                      >
                        <ArrowLeftRight size={16} />
                        Credit Note
                      </button>
                    )}
                  </div>
                </div>

                {/* Order Summary Card */}
                <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 mb-8">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <h3 className="text-xl font-bold text-[#3C4242]">Order #{order.orderId}</h3>
                      <p className="text-sm text-[#807D7E] mt-1 font-medium flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        Placed On {order.createdAt
                          ? new Date(order.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                          : "N/A"}
                      </p>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="text-lg text-[#807D7E] font-semibold">Total : &nbsp; <span className="text-[#3C4242] font-bold text-2xl">₹{Math.round(order.grandTotal)}</span></p>
                    </div>
                  </div>
                </div>

                {/* Stepper Tracking */}
                {order.status !== ORDER_STATUS.CANCELLED && (
                  <div className="mb-8 bg-white rounded-2xl p-4 sm:p-8 border border-gray-100 shadow-sm">
                    <div className="relative max-w-3xl mx-auto py-4">
                      {/* Progress Bar Background */}
                      <div className="absolute top-[26px] left-[32px] right-[32px] sm:left-[48px] sm:right-[48px] h-1 bg-gray-100 rounded-full -translate-y-1/2"></div>

                      {/* Progress Bar Active */}
                      <div
                        className="absolute top-[26px] left-[32px] right-[32px] sm:left-[48px] sm:right-[48px] h-1 bg-[#063d32] rounded-full transition-all duration-700 ease-in-out -translate-y-1/2 origin-left"
                        style={{ transform: `scaleX(${currentStep / (steps.length - 1)}) translateY(-50%)` }}
                      ></div>

                      {/* Steps */}
                      <div className="relative flex justify-between items-start">
                        {steps.map((step, idx) => (
                          <div key={idx} className="flex flex-col items-center w-16 sm:w-24">
                            <div
                              className={`w-6 h-6 rounded-full border-2 z-10 transition-all duration-500 flex items-center justify-center ${idx <= currentStep
                                ? "bg-[#063d32] border-[#063d32] text-white"
                                : "bg-white border-gray-200 text-gray-400"
                                }`}
                            >
                              {idx < currentStep ? (
                                <CheckCircle size={12} className="text-white fill-current" />
                              ) : idx === currentStep ? (
                                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                              ) : (
                                <div className="w-1.5 h-1.5 bg-gray-200 rounded-full" />
                              )}
                            </div>
                            <p
                              className={`mt-4 text-[9px] sm:text-xs font-bold text-center capitalize transition-colors duration-500 tracking-wider ${idx <= currentStep ? "text-[#063d32]" : "text-gray-400"
                                }`}
                            >
                              {step}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Status Highlight Banner */}
                    <div className="mt-8 relative max-w-3xl mx-auto">
                      <div className="bg-emerald-50/40 rounded-2xl p-6 border border-emerald-100/50 flex flex-row items-start gap-4 relative z-10">
                        <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[#063d32] shrink-0">
                          <Package size={24} />
                        </div>
                        <div className="flex flex-col gap-4 text-left">
                          <div>
                            <p className="text-[10px] text-[#807D7E] font-bold uppercase tracking-widest mb-0.5">Order Status</p>
                            <p className="text-base text-[#3C4242] font-bold">{getStatusMessage(order.status_label)}</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-[#807D7E] font-bold uppercase tracking-widest mb-0.5">Last Update</p>
                            <p className="text-sm text-[#3C4242] font-bold">
                              {order.updatedAt
                                ? new Date(order.updatedAt).toLocaleDateString("en-IN", { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
                                : order.createdAt
                                  ? new Date(order.createdAt).toLocaleDateString("en-IN", { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
                                  : "N/A"
                              }
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {order.status === ORDER_STATUS.CANCELLED && (
                  <div className="mb-8 bg-red-50/50 p-8 rounded-2xl border border-red-100 flex flex-col items-center text-center max-w-4xl mx-auto shadow-sm">
                    <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4">
                      <XCircle size={40} />
                    </div>
                    <h3 className="text-2xl font-bold text-red-700 mb-2">Order Cancelled</h3>
                    <p className="text-red-600 max-w-md mx-auto text-sm">
                      This order was cancelled. If you have any questions or would like to re-order, please contact our support team.
                    </p>
                  </div>
                )}

                {order.status === ORDER_STATUS.RETURNED && (
                  <div className="mb-8 bg-orange-50/50 p-8 rounded-2xl border border-orange-100 flex flex-col items-center text-center max-w-4xl mx-auto shadow-sm">
                    <div className="w-16 h-16 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center mb-4">
                      <RefreshCcw size={40} className="animate-spin-reverse" style={{ animationDuration: '3s' }} />
                    </div>
                    <h3 className="text-2xl font-bold text-orange-700 mb-2">Order Returned</h3>
                    <p className="text-orange-600 max-w-md mx-auto text-sm">
                      A return request has been processed for this order. We will contact you shortly regarding the pickup and refund.
                    </p>
                  </div>
                )}

                {/* Products List */}
                <div className="space-y-6">
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden relative">
                    <div className="divide-y divide-gray-50 p-4 sm:p-8">
                      {order.orderItems.map((item) => (
                        <div key={item.orderItemId} className="py-6 first:pt-0 last:pb-0 flex flex-col gap-4 group">
                          {/* Top Row: Image & Details */}
                          <div className="flex flex-row gap-4 sm:gap-6 items-start">
                            <img
                              src={`${ApiURL}/assets/Products/${item.imageUrl}`}
                              alt={item.productName}
                              className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover shadow-sm transition-transform duration-300 group-hover:scale-105 border border-gray-50 flex-shrink-0"
                            />
                            <div className="flex-1 text-left">
                              <h3 className="font-bold text-[#3C4242] text-sm sm:text-lg mb-1 sm:mb-2 line-clamp-2">
                                {item.productName}
                              </h3>
                              <div className="flex flex-wrap justify-start items-center gap-x-4 gap-y-1.5 text-xs sm:text-sm">
                                {item.sku && (
                                  <p className="text-[#807D7E] font-medium">SKU: <span className="text-gray-700 font-bold uppercase">{item.sku}</span></p>
                                )}
                                <p className="text-[#807D7E] font-medium flex items-center gap-1.5">
                                  Color:
                                  <span className="text-gray-700 font-bold capitalize">{item.color_name || "N/A"}</span>
                                  {item.color_code && (
                                    <span
                                      className="w-3 h-3 rounded-full border border-gray-300"
                                      style={{ backgroundColor: item.color_code }}
                                    ></span>
                                  )}
                                </p>
                                <p className="text-[#807D7E] font-medium">Qty: <span className="text-gray-700 font-bold">{item.quantity}</span></p>
                                <p className="text-[#3C4242] text-base sm:text-xl font-bold sm:ml-auto">
                                  ₹{Math.round(item.totalAmount || item.price)}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Bottom Row: Review Section */}
                          {order.status === ORDER_STATUS.DELIVERED && isLoggedIn && (() => {
                            const p_id = item.p_id || item.product_id || item.pid || item.id || item.productId;
                            let userReview = reviewsStatus[p_id];

                            // Fallback to localStorage if the state doesn't have it yet but localStorage says it's reviewed
                            if (!userReview) {
                              try {
                                const stored = JSON.parse(localStorage.getItem("glamgait_reviewed_pids") || "[]");
                                if (stored.includes(Number(p_id))) {
                                  userReview = { status: "pending", is_published: 0 };
                                }
                              } catch (_) { }
                            }

                            // ⏳ Show spinner while fetching review status (first load)
                            if (checkingReviews && userReview === undefined) {
                              return (
                                <div className="mt-3 flex justify-center sm:justify-start">
                                  <div className="flex items-center gap-1.5 text-xs text-gray-400 font-poppins">
                                    <Loader2 size={12} className="animate-spin" />
                                    <span>Checking...</span>
                                  </div>
                                </div>
                              );
                            }

                            if (userReview) {
                              const getReviewStatus = (review) => {
                                if (!review) return null;
                                if (review.status === "pending" || review.status === "approved" || review.status === "rejected") {
                                  return review.status;
                                }
                                const pub = review.is_published;
                                if (pub === undefined || pub == 1 || pub === true || String(pub) === "1") return "approved";
                                if (pub == 2 || String(pub) === "2" || pub === "rejected") return "rejected";
                                return "pending";
                              };

                              const status = getReviewStatus(userReview);

                              if (status === "pending") {
                                return (
                                  <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-poppins">
                                    <div className="flex items-center gap-2.5 flex-wrap">
                                      <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider bg-amber-50 border border-amber-100/50 px-2 py-0.5 rounded">Pending Approval</span>
                                      <span className="text-xs text-gray-400">Your review was added successfully and will be shown after admin approval.</span>
                                    </div>
                                    <div className="flex items-center gap-1 shrink-0 self-end sm:self-start">
                                      <button
                                        onClick={() => {
                                          setSelectedProductForReview(item);
                                          setExistingReviewForModal(userReview);
                                          setShowReviewModal(true);
                                        }}
                                        className="p-1.5 text-gray-400 hover:text-black hover:bg-gray-50 rounded-full border border-gray-200 transition cursor-pointer"
                                        title="Edit Review"
                                      >
                                        <Pencil size={13} />
                                      </button>
                                      <button
                                        onClick={() => handleDeleteReview(userReview.r_id || userReview.review_id, p_id)}
                                        className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full border border-red-100 transition cursor-pointer"
                                        title="Delete Review"
                                      >
                                        <Trash2 size={13} />
                                      </button>
                                    </div>
                                  </div>
                                );
                              }

                              if (status === "rejected") {
                                return (
                                  <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-poppins">
                                    <div className="flex items-center gap-2.5 flex-wrap">
                                      <span className="text-[10px] font-bold text-red-700 uppercase tracking-wider bg-red-50 border border-red-100/50 px-2 py-0.5 rounded">Review Rejected</span>
                                      <span className="text-xs text-gray-400">Please edit and resubmit your review</span>
                                    </div>
                                    <div className="flex items-center gap-1 shrink-0 self-end sm:self-start">
                                      <button
                                        onClick={() => {
                                          setSelectedProductForReview(item);
                                          setExistingReviewForModal(userReview);
                                          setShowReviewModal(true);
                                        }}
                                        className="p-1.5 text-gray-400 hover:text-black hover:bg-gray-50 rounded-full border border-gray-200 transition cursor-pointer"
                                        title="Edit Review"
                                      >
                                        <Pencil size={13} />
                                      </button>
                                      <button
                                        onClick={() => handleDeleteReview(userReview.r_id || userReview.review_id, p_id)}
                                        className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full border border-red-100 transition cursor-pointer"
                                        title="Delete Review"
                                      >
                                        <Trash2 size={13} />
                                      </button>
                                    </div>
                                  </div>
                                );
                              }

                              if (status === "approved") {
                                const rating = Number(userReview.rating || 0);
                                const comment = userReview.message || "";
                                const imageUrls = userReview.image_url
                                  ? userReview.image_url.split(",").filter(Boolean)
                                  : [];
                                const getReviewImageUrl = (img) => {
                                  if (!img) return "";
                                  if (img.startsWith("http://") || img.startsWith("https://")) return img;
                                  return `${ApiURL}/assets/UserReviews/${img}`;
                                };

                                return (
                                  <div className="mt-2 pt-4 border-t border-gray-100 flex flex-col sm:flex-row sm:items-start justify-between gap-4 font-poppins">
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
                                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Your Review</span>
                                        <div className="flex items-center gap-0.5">
                                          {[...Array(5)].map((_, i) => (
                                            <Star
                                              key={i}
                                              size={14}
                                              className={i < rating ? "fill-[#F5A623] text-[#F5A623]" : "text-gray-200"}
                                            />
                                          ))}
                                        </div>
                                        <span className="text-xs text-gray-400">({rating}/5)</span>
                                      </div>
                                      {comment && (
                                        <p className="text-md text-gray-600 font-[oxygen] leading-relaxed pl-0.5">
                                          &ldquo;{comment}&rdquo;
                                        </p>
                                      )}
                                      {imageUrls.length > 0 && (
                                        <div className="flex flex-wrap gap-1.5 mt-2">
                                          {imageUrls.map((url, i) => (
                                            <img
                                              key={i}
                                              src={getReviewImageUrl(url)}
                                              alt={`Review image ${i + 1}`}
                                              className="w-10 h-10 object-cover rounded-lg border border-gray-200 hover:opacity-90 cursor-pointer transition-opacity"
                                              onClick={() => window.open(getReviewImageUrl(url), "_blank")}
                                            />
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                    <div className="flex items-center gap-1 shrink-0 self-end sm:self-start">
                                      <button
                                        onClick={() => {
                                          setSelectedProductForReview(item);
                                          setExistingReviewForModal(userReview);
                                          setShowReviewModal(true);
                                        }}
                                        className="p-1.5 text-gray-400 hover:text-black hover:bg-gray-50 rounded-full border border-gray-200 transition cursor-pointer"
                                        title="Edit Review"
                                      >
                                        <Pencil size={13} />
                                      </button>
                                      <button
                                        onClick={() => handleDeleteReview(userReview.r_id || userReview.review_id, p_id)}
                                        className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full border border-red-100 transition cursor-pointer"
                                        title="Delete Review"
                                      >
                                        <Trash2 size={13} />
                                      </button>
                                    </div>
                                  </div>
                                );
                              }
                              return null;
                            }

                            // No review yet — show Write Review button
                            return (
                              <div className="mt-4 flex justify-center sm:justify-start">
                                <button
                                  onClick={() => {
                                    setSelectedProductForReview(item);
                                    setExistingReviewForModal(null);
                                    setShowReviewModal(true);
                                  }}
                                  className="bg-white border border-[#063d32] text-[#063d32] hover:bg-[#063d32] hover:text-white px-4 py-1.5 rounded-xl text-xs font-bold transition shadow-sm cursor-pointer flex items-center gap-1.5"
                                >
                                  <Star size={12} className="fill-current" />
                                  Write Review
                                </button>
                              </div>
                            );
                          })()}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            )}
          </div>
        </div>
      </div>

      <CancelOrderModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={handleCancelOrder}
        orderId={orderId}
      />

      <ReturnOrderModal
        isOpen={showReturnModal}
        onClose={() => setShowReturnModal(false)}
        onConfirm={handleReturnOrder}
        orderId={orderId}
      />

      <InvoiceModal
        isOpen={showInvoiceModal}
        onClose={() => setShowInvoiceModal(false)}
        order={order}
        isCreditNote={isCreditNote}
      />

      <ProductReviewModal
        isOpen={showReviewModal}
        onClose={() => {
          setShowReviewModal(false);
          setSelectedProductForReview(null);
          setExistingReviewForModal(null);
        }}
        product={selectedProductForReview}
        user={user}
        existingReview={existingReviewForModal}
        onReviewSaved={handleReviewSaved}
      />

      <BrandBanner />
    </>
  );
};

export default OrderDetails;
