import { useState, useEffect } from "react";
import { ChevronLeft, Package, Truck, CheckCircle, MapPin, X, XCircle } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import SideBar from "./SideBar";
import axiosInstance from "../Axios/axios";
import { ApiURL, userInfo } from "../Variable";
import BrandBanner from "./BrandBanner";
import CancelOrderModal from "./CancelOrderModal";
import toast from "react-hot-toast";
import { getGuestId } from "../utils/guest";

const OrderDetails = () => {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [tracking, setTracking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const user = userInfo();
  const u_id = user?.u_id;
  const guestId = getGuestId();
  const isLoggedIn = !!u_id;

  useEffect(() => {
    const fetchData = async () => {
      if (!orderId) return;

      try {
        const orderRes = await axiosInstance.get(
          `${ApiURL}/getorder/${orderId}`
        );
        const orderData = orderRes.data.data;
        setOrder(orderData);

        // 2. AWB se tracking fetch karo — yahan orderData use karo, order state ka wait mat karo!
        if (orderData?.awb_number) {
          try {
            const trackRes = await axiosInstance.get(
              `${ApiURL}/track/${orderData.awb_number}`
            );
            if (trackRes.data.status === 1 && trackRes.data.data) {
              setTracking(trackRes.data.data);
            }
          } catch (trackErr) {
            console.log("Tracking API failed:", trackErr);
          }
        }
      } catch (err) {
        console.error("Order fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [orderId]);

  // Ab yeh safety net bhi add kar dete hain (extra strong)
  useEffect(() => {
    if (order?.awb_number && !tracking) {
      const retry = async () => {
        try {
          const res = await axiosInstance.get(
            `${ApiURL}/track/${order.awb_number}`
          );
          if (res.data.status === 1 && res.data.data) {
            setTracking(res.data.data);
          }
        } catch (err) {
          console.log("Retry failed");
        }
      };
      retry();
    }
  }, [order]);

  const handleCancelOrder = async (reason) => {
    try {
      const res = await axiosInstance.put(`${ApiURL}/cancelorder`, {
        order_id: orderId,
        reason: reason,
        ...(!isLoggedIn && { guest_id: guestId }),
      });

      if (res.data.status === 1) {
        toast.success("Order cancelled successfully!");
        setOrder(prev => ({ ...prev, status: 6, status_label: "Cancelled" }));
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

  // Current status from latest scan
  const getCurrentStatus = () => {
    if (!tracking?.tracking_detail || tracking.tracking_detail.length === 0) {
      return "Order Placed";
    }
    const latest =
      tracking.tracking_detail[tracking.tracking_detail.length - 1];
    return latest.scan;
  };

  const currentStatus = tracking ? getCurrentStatus() : "Processing";

  // Sort scans: latest first
  const sortedScans = tracking?.tracking_detail
    ? [...tracking.tracking_detail].reverse()
    : [];

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
    return "Your order has been placed successfully and is awaiting verification.";
  };

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f3f0ed] text-red-600">
        Order not found
      </div>
    );
  }

  return (
    <>
      <div className="w-full lg:pt-0 pt-8 px-2 md:px-8 xl:px-24">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row font-inter">
          <div className="w-full md:w-1/4">
            <SideBar />
          </div>

          <div className="flex-1 p-4 sm:p-6 md:p-10">
            {/* Header/Breadcrumb */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
              <div className="flex items-center gap-2 text-[#1a1a1a]">
                <ChevronLeft
                  className="cursor-pointer"
                  size={24}
                  onClick={() => navigate("/myorders")}
                />
                <h2 className="text-3xl font-semibold">Order Details</h2>
              </div>
              
              <div className="flex gap-4">
                {order.status === 5 && (
                  <button
                    onClick={() => setShowCancelModal(true)}
                    className="bg-white border-2 border-[#b32b2b] text-[#b32b2b] px-6 py-2.5 rounded-lg font-bold hover:bg-[#b32b2b] hover:text-white transition shadow-sm cursor-pointer"
                  >
                    Cancel Order
                  </button>
                )}
                {order.status === 6 && (
                   <div className="flex items-center gap-2 px-6 py-2.5 bg-red-50 text-red-600 rounded-lg font-bold border border-red-100">
                      <XCircle size={18} />
                      <span>Cancelled</span>
                   </div>
                )}
              </div>
            </div>

            {/* Order Summary Card */}
            <div className="bg-white rounded-xl p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)] mb-10 border border-gray-100">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="text-xl font-semibold text-[#1a1a1a]">Order no: #{order.orderId}</h3>
                  <p className="text-sm text-[#807D7E] mt-1 font-medium">
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
                  <p className="text-lg text-[#807D7E] font-semibold mb-1">Total : &nbsp; <span className="text-[#1a1a1a]">₹{Math.round(order.grandTotal)}</span></p>
                </div>
              </div>
            </div>

            {/* Stepper Tracking */}
            {order.status !== 6 && (
               <div className="mb-16 px-4">
               <div className="relative max-w-4xl mx-auto">
                 {/* Progress Bar Background */}
                 <div className="absolute top-[10px] left-0 w-full h-1 bg-[#E0E0E0] rounded-full -translate-y-1/2"></div>
                 
                 {/* Progress Bar Active */}
                 <div
                   className="absolute top-[10px] left-0 h-1 bg-[#004534] rounded-full transition-all duration-700 ease-in-out -translate-y-1/2"
                   style={{ width: `${progressWidth}%` }}
                 ></div>

                 {/* Steps */}
                 <div className="relative flex justify-between items-start">
                   {steps.map((step, idx) => (
                     <div key={idx} className="flex flex-col items-center w-24">
                       <div 
                         className={`w-5 h-5 rounded-full border-2 z-10 transition-colors duration-500 flex items-center justify-center ${
                           idx <= currentStep 
                             ? "bg-[#004534] border-[#004534]" 
                             : "bg-white border-[#E0E0E0]"
                         }`}
                       >
                         {idx < currentStep && <CheckCircle size={10} className="text-white" />}
                         {idx === currentStep && <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />}
                       </div>
                       <p 
                         className={`mt-4 text-[12px] sm:text-sm font-bold text-center capitalize transition-colors duration-500 ${
                           idx <= currentStep ? "text-[#004534]" : "text-[#BEBCBD]"
                         }`}
                       >
                         {step}
                       </p>
                     </div>
                   ))}
                 </div>
               </div>

               {/* Status Highlight Banner */}
               <div className="mt-12 relative max-w-4xl mx-auto">
                 {/* Pointer Arrow - Clamped to stay within banner bounds */}
                 <div 
                   className="absolute -top-2.5 w-5 h-5 bg-[#f9f9f9] rotate-45 -translate-x-1/2 border-l border-t border-[#807D7E33] hidden sm:block transition-all duration-700 ease-in-out z-0"
                   style={{ 
                     left: `${Math.min(Math.max(progressWidth, 5), 95)}%`
                   }}
                 ></div>

                 <div className="bg-[#f9f9f9] rounded-2xl p-6 border border-[#807D7E33] flex flex-col sm:flex-row justify-between items-center gap-6 relative z-10 shadow-[0_4px_15px_rgba(0,0,0,0.02)]">
                   <div className="flex items-center gap-4">
                     <div className="w-12 h-12 rounded-full bg-[#00453410] flex items-center justify-center text-[#004534] flex-shrink-0">
                       <Package size={24} />
                     </div>
                     <div>
                       <p className="text-[10px] text-[#807D7E] font-bold uppercase tracking-widest mb-0.5">Order Status</p>
                       <p className="text-base text-[#3C4242] font-bold">{getStatusMessage(order.status_label)}</p>
                     </div>
                   </div>
                   <div className="text-left sm:text-right flex-shrink-0">
                     <p className="text-[10px] text-[#807D7E] font-bold uppercase tracking-widest mb-0.5">Last Update</p>
                     <p className="text-sm text-[#1a1a1a] font-bold">
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

            {order.status === 6 && (
               <div className="mb-16 bg-red-50 p-8 rounded-2xl border border-red-100 flex flex-col items-center text-center max-w-4xl mx-auto shadow-sm">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-red-600 mb-4">
                     <XCircle size={40} />
                  </div>
                  <h3 className="text-2xl font-bold text-red-700 mb-2">Order Cancelled</h3>
                  <p className="text-red-600 max-w-md mx-auto">
                     This order was cancelled. If you have any questions or would like to re-order, please contact our support team.
                  </p>
               </div>
            )}

            {/* Products List */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-[#807D7E33] overflow-hidden relative">
                <div className="divide-y divide-[#807D7E33] p-8">
                  {order.orderItems.map((item) => (
                    <div key={item.orderItemId} className="py-8 flex flex-col sm:flex-row gap-8 items-center group">
                      <img
                        src={`${ApiURL}/assets/Products/${item.imageUrl}`}
                        alt={item.productName}
                        className="w-32 h-32 rounded-xl object-cover shadow-sm transition-transform group-hover:scale-105"
                      />
                      <div className="flex-1 text-center sm:text-left">
                        <h3 className="font-600 text-[#1a1a1a] font-[poppins] text-xl mb-2">
                          {item.productName}
                        </h3>
                        <div className="flex flex-wrap justify-center items-center sm:justify-start gap-x-8 gap-y-2">
                          <p className="text-[#807D7E] font-400 font-[poppins] flex items-center gap-2 justify-center sm:justify-start">
                            Color :
                            <span className="text-[#1a1a1a] font-400 capitalize">{item.color_name || "N/A"}</span>
                            {item.color_code && (
                              <span
                                className="w-4 h-4 rounded-full border border-gray-300"
                                style={{ backgroundColor: item.color_code }}
                              ></span>
                            )}
                          </p>
                          <p className="text-[#807D7E] font-400 font-[poppins]">Qty : <span className="text-[#1a1a1a] font-400">{item.quantity}</span></p>
                          <p className="text-[#807D7E] font-400 mt-2 sm:mt-0 ml-auto">
                            <span className="text-[#1a1a1a] text-2xl font-semibold">₹{Math.round(item.totalAmount || item.price)}</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div >

      <CancelOrderModal 
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={handleCancelOrder}
        orderId={orderId}
      />

      <BrandBanner />
    </>
  );
};

export default OrderDetails;
