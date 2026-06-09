import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { ChevronLeft, Package, Truck, CheckCircle, MapPin, X, XCircle, RefreshCcw, Receipt, ArrowLeftRight, Star, Calendar } from "lucide-react";
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
  const [reviewsStatus, setReviewsStatus] = useState({});

  const user = userInfo();
  const u_id = user?.u_id;
  const guestId = getGuestId();
  const isLoggedIn = !!u_id;

  const checkReviews = async () => {
    if (!order?.orderItems || !u_id) return;
    const statusMap = {};
    for (const item of order.orderItems) {
      const rawId = item.p_id || item.product_id || item.pid || item.id || item.productId || item.product?.p_id || item.product?.product_id || item.product?.id;
      const p_id = rawId ? Number(rawId) : null;
      if (!p_id || isNaN(p_id)) continue;
      try {
        const res = await axiosInstance.post("/getuserreviews", { p_id });
        if (res.data.status === 1) {
          const list = res.data.data || [];
          const userRev = list.find(r => String(r.u_id || r.user_id) === String(u_id));
          statusMap[p_id] = userRev || null;
        }
      } catch (err) {
        console.error("Error checking review status:", err);
      }
    }
    setReviewsStatus(statusMap);
  };

  useEffect(() => {
    if (order?.status === ORDER_STATUS.DELIVERED) {
      checkReviews();
    }
  }, [order, u_id]);

  const handleReviewSaved = () => {
    checkReviews();
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f3f0ed]">
        <RefreshCcw className="w-10 h-10 animate-spin text-[#004534]" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f3f0ed] text-red-600 font-bold">
        Order not found
      </div>
    );
  }

  return (
    <>
      <div className="w-full lg:pt-8 pt-4 px-2 md:px-8 xl:px-24 min-h-screen">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row font-poppins">
          {/* Sidebar */}
          <div className="w-full md:w-1/3 lg:w-1/4">
            <SideBar />
          </div>

          {/* Main content */}
          <ScrollReveal animation="fade-left" duration={800} className="flex-1 p-4 sm:p-6 md:p-8">
            {/* Header/Breadcrumb */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
              <div className="flex items-center gap-2 text-[#3C4242]">
                <ChevronLeft
                  className="cursor-pointer hover:text-[#063d32] transition-colors"
                  size={24}
                  onClick={() => navigate("/myorders", { state: { activeTab: location.state?.activeTab } })}
                />
                <h2 className="text-3xl font-semibold">Order Details</h2>
              </div>

              <div className="flex flex-wrap gap-3 w-full sm:w-auto">
                {[
                  ORDER_STATUS.PENDING,
                  ORDER_STATUS.ACCEPTED,
                  ORDER_STATUS.PREPARING,
                  ORDER_STATUS.SHIPPED,
                ].includes(order.status) && (
                    <button
                      onClick={() => setShowCancelModal(true)}
                      className="w-full sm:w-auto bg-white border border-red-200 text-red-600 px-5 py-2.5 rounded-xl font-semibold hover:bg-red-50 transition-all cursor-pointer text-sm"
                    >
                      Cancel Order
                    </button>
                  )}
                {order.status === ORDER_STATUS.DELIVERED && (
                  <button
                    onClick={() => setShowReturnModal(true)}
                    className="w-full sm:w-auto bg-white border border-[#063d32]/20 text-[#063d32] px-5 py-2.5 rounded-xl font-semibold hover:bg-emerald-50 transition-all cursor-pointer flex items-center justify-center gap-1.5 text-sm"
                  >
                    <RefreshCcw size={16} />
                    Return Order
                  </button>
                )}

                {order.status === ORDER_STATUS.CANCELLED && (
                  <div className="flex items-center justify-center gap-2 px-5 py-2.5 bg-red-50 text-red-600 rounded-xl font-semibold border border-red-100 text-sm">
                    <XCircle size={16} />
                    <span>Cancelled</span>
                  </div>
                )}

                {order.status === ORDER_STATUS.RETURNED && (
                  <div className="flex items-center justify-center gap-2 px-5 py-2.5 bg-orange-50 text-orange-600 rounded-xl font-semibold border border-orange-100 text-sm">
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
                    className="w-full sm:w-auto bg-white border border-emerald-200 text-emerald-600 px-5 py-2.5 rounded-xl font-semibold hover:bg-emerald-50 transition-all cursor-pointer flex items-center justify-center gap-1.5 text-sm"
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
                    className="w-full sm:w-auto bg-white border border-rose-200 text-rose-600 px-5 py-2.5 rounded-xl font-semibold hover:bg-rose-50 transition-all cursor-pointer flex items-center justify-center gap-1.5 text-sm"
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
              <div className="mb-8 bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm">
                <div className="relative max-w-3xl mx-auto py-4">
                  {/* Progress Bar Background */}
                  <div className="absolute top-[26px] left-0 w-full h-1 bg-gray-100 rounded-full -translate-y-1/2"></div>

                  {/* Progress Bar Active */}
                  <div
                    className="absolute top-[26px] left-0 h-1 bg-[#063d32] rounded-full transition-all duration-700 ease-in-out -translate-y-1/2"
                    style={{ width: `${progressWidth}%` }}
                  ></div>

                  {/* Steps */}
                  <div className="relative flex justify-between items-start">
                    {steps.map((step, idx) => (
                      <div key={idx} className="flex flex-col items-center w-24">
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
                          className={`mt-4 text-[10px] sm:text-xs font-bold text-center capitalize transition-colors duration-500 tracking-wider ${idx <= currentStep ? "text-[#063d32]" : "text-gray-400"
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
                  <div className="bg-emerald-50/40 rounded-2xl p-6 border border-emerald-100/50 flex flex-col sm:flex-row justify-between items-center gap-6 relative z-10">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[#063d32] shrink-0">
                        <Package size={24} />
                      </div>
                      <div>
                        <p className="text-[10px] text-[#807D7E] font-bold uppercase tracking-widest mb-0.5">Order Status</p>
                        <p className="text-base text-[#3C4242] font-bold">{getStatusMessage(order.status_label)}</p>
                      </div>
                    </div>
                    <div className="text-left sm:text-right flex-shrink-0">
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
                <div className="divide-y divide-gray-50 p-6 sm:p-8">
                  {order.orderItems.map((item) => (
                    <div key={item.orderItemId} className="py-6 first:pt-0 last:pb-0 flex flex-col sm:flex-row gap-6 items-center group">
                      <img
                        src={`${ApiURL}/assets/Products/${item.imageUrl}`}
                        alt={item.productName}
                        className="w-24 h-24 rounded-xl object-cover shadow-sm transition-transform duration-300 group-hover:scale-105 border border-gray-50"
                      />
                      <div className="flex-1 text-center sm:text-left">
                        <h3 className="font-bold text-[#3C4242] text-lg mb-2">
                          {item.productName}
                        </h3>
                        <div className="flex flex-wrap justify-center items-center sm:justify-start gap-x-8 gap-y-2 text-sm">
                          <p className="text-[#807D7E] font-medium flex items-center gap-1.5 justify-center sm:justify-start">
                            Color:
                            <span className="text-gray-700 font-bold capitalize">{item.color_name || "N/A"}</span>
                            {item.color_code && (
                              <span
                                className="w-3.5 h-3.5 rounded-full border border-gray-300"
                                style={{ backgroundColor: item.color_code }}
                              ></span>
                            )}
                          </p>
                          <p className="text-[#807D7E] font-medium">Qty: <span className="text-gray-700 font-bold">{item.quantity}</span></p>
                          <p className="text-[#807D7E] font-medium mt-2 sm:mt-0 sm:ml-auto">
                            <span className="text-[#3C4242] text-xl font-bold">₹{Math.round(item.totalAmount || item.price)}</span>
                          </p>
                        </div>
                        {order.status === ORDER_STATUS.DELIVERED && isLoggedIn && (() => {
                          const p_id = item.p_id || item.product_id || item.pid || item.id || item.productId;
                          const userReview = reviewsStatus[p_id];

                          if (userReview) {
                            if (userReview.is_published === 1 || userReview.is_published === true) {
                              return (
                                <div className="mt-4 flex justify-center sm:justify-start">
                                  <span className="flex items-center gap-1.5 text-xs text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg font-bold border border-emerald-100">
                                    <CheckCircle size={14} className="text-emerald-600" />
                                    Review approved & published
                                  </span>
                                </div>
                              );
                            } else {
                              return (
                                <div className="mt-4 flex justify-center sm:justify-start">
                                  <span className="flex items-center gap-1.5 text-xs text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg font-bold border border-amber-100">
                                    <CheckCircle size={14} className="text-amber-500 animate-pulse" />
                                    Your review was added successfully and will be shown after admin approval.
                                  </span>
                                </div>
                              );
                            }
                          }

                          return (
                            <div className="mt-4 flex justify-center sm:justify-start">
                              <button
                                onClick={() => {
                                  setSelectedProductForReview(item);
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
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div >

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
        }}
        product={selectedProductForReview}
        user={user}
        onReviewSaved={handleReviewSaved}
      />

      <BrandBanner />
    </>
  );
};

export default OrderDetails;
