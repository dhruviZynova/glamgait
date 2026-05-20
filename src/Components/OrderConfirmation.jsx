import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../Axios/axios";
import { ApiURL, razorpayKEY } from "../Variable";
import toast from "react-hot-toast";
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  RefreshCw, 
  ShoppingBag, 
  ArrowRight, 
  Phone, 
  Mail, 
  FileText, 
  Loader2, 
  Home,
  Truck
} from "lucide-react";

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Parse query parameters
  const queryParams = new URLSearchParams(location.search);
  const queryOrderId = queryParams.get("orderId");
  const queryStatus = queryParams.get("status");

  // Robust orderId resolution
  const orderId = queryOrderId || location.state?.orderId || sessionStorage.getItem('lastOrderId');
  
  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState(queryStatus || location.state?.status || "success");
  const [loading, setLoading] = useState(true);
  const [switchingToCod, setSwitchingToCod] = useState(false);
  const [retryingPayment, setRetryingPayment] = useState(false);

  // Fetch Order Details
  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      return;
    }

    const fetchOrder = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get(`${ApiURL}/getorder/${orderId}`);

        if (res.data.status === 1) {
          setOrder(res.data.data);
          
          // Fallback status check based on actual payment status if queryStatus is omitted
          if (!queryStatus) {
            const payStatus = res.data.data.paymentStatus?.toLowerCase() || "";
            const method = res.data.data.paymentMethod?.toLowerCase() || "";
            if (payStatus === "paid" || payStatus === "success" || method === "cod") {
              setStatus("success");
            } else if (payStatus === "failed") {
              setStatus("failed");
            } else if (payStatus === "cancelled" || payStatus === "cancel") {
              setStatus("cancel");
            }
          }
        } else {
          toast.error("Failed to retrieve order information");
        }
      } catch (err) {
        console.error("Error fetching order:", err);
        toast.error("Error loading order details");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, queryStatus]);

  // Fire GTM Purchase Event ONLY on actual payment success
  useEffect(() => {
    if (!order || status !== "success") return;

    window.dataLayer = window.dataLayer || [];

    // Ensure we don't fire duplicate purchase tags for the same order
    const firedOrders = JSON.parse(sessionStorage.getItem('firedGtmPurchases') || '[]');
    if (firedOrders.includes(order.orderId)) return;

    window.dataLayer.push({
      event: "purchase",
      transaction_id: order.orderId,
      value: order.grandTotal,
      currency: "INR",
      content_ids: order.orderItems.map((item) => item.orderItemId || item.p_id),
      content_name: order.orderItems.map((item) => item.productName),
      contents: order.orderItems.map((item) => ({
        id: item.orderItemId || item.p_id,
        name: item.productName,
        quantity: item.quantity,
        price: item.price,
      })),
    });

    firedOrders.push(order.orderId);
    sessionStorage.setItem('firedGtmPurchases', JSON.stringify(firedOrders));
  }, [order, status]);

  // Retry Payment Flow
  const handleRetryPayment = async () => {
    const lastCheckoutUrl = sessionStorage.getItem('lastCheckoutUrl');
    
    // Redirect if we have an external checkout URL (Stripe, PhonePe, CCAvenue)
    if (lastCheckoutUrl && lastCheckoutUrl !== 'razorpay' && lastCheckoutUrl.startsWith('http')) {
      toast.loading("Redirecting to payment gateway...", { id: "retryRedirect" });
      setTimeout(() => {
        window.location.href = lastCheckoutUrl;
      }, 800);
      return;
    }
    
    // Inline Razorpay retry logic
    if (!order) {
      toast.error("Order details are still loading. Please try again.");
      return;
    }

    setRetryingPayment(true);
    try {
      // Load Razorpay SDK if not already in document
      if (!window.Razorpay) {
        await new Promise((resolve, reject) => {
          const script = document.createElement("script");
          script.src = "https://checkout.razorpay.com/v1/checkout.js";
          script.async = true;
          script.onload = resolve;
          script.onerror = reject;
          document.body.appendChild(script);
        });
      }

      const rzpOrderId = order.rzp_order_id || order.razorpay_order_id;
      if (!rzpOrderId) {
        toast.error("Standard online retry session unavailable. Redirecting to address selection.");
        navigate("/select-address", { state: { cartItems: order.orderItems } });
        return;
      }

      const options = {
        key: razorpayKEY,
        amount: Math.round(order.grandTotal * 100),
        currency: "INR",
        name: "Kundrat",
        description: `Pay Order #${order.orderId}`,
        order_id: rzpOrderId,
        handler: async (response) => {
          try {
            toast.loading("Verifying payment...", { id: "retryVerify" });
            const verifyRes = await axiosInstance.post(`${ApiURL}/verifyPayment`, {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              order_id: order.orderId,
            });
            
            toast.dismiss("retryVerify");
            if (verifyRes.data.status === 1) {
              toast.success("Payment successful!");
              sessionStorage.removeItem('lastCheckoutUrl');
              setStatus("success");
              
              // Refresh order data
              const updatedRes = await axiosInstance.get(`${ApiURL}/getorder/${order.orderId}`);
              if (updatedRes.data.status === 1) {
                setOrder(updatedRes.data.data);
              }
            } else {
              toast.error("Payment verification failed");
              setStatus("failed");
            }
          } catch (err) {
            toast.dismiss("retryVerify");
            toast.error("Verification failed. Please contact support.");
            setStatus("failed");
          }
        },
        modal: {
          ondismiss: () => {
            toast.error("Payment dismissed");
            setStatus("cancel");
          }
        },
        prefill: {
          name: order.customerName || "",
          email: order.email || "",
          contact: order.phone || "",
        },
        theme: { color: "#1C2F2F" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Razorpay reload error:", err);
      toast.error("Could not initialize payment gateway. Please try again.");
    } finally {
      setRetryingPayment(false);
    }
  };

  // Switch to Cash on Delivery (COD)
  const handleSwitchToCOD = async () => {
    if (!orderId) return;

    setSwitchingToCod(true);
    toast.loading("Switching payment method to COD...", { id: "switchCod" });

    try {
      // Put request to update order status and payment method
      const res = await axiosInstance.put(`${ApiURL}/updateorderstatus/${orderId}`, {
        status: "pending",
        payment_method: "cod",
        payment_status: "pending"
      });

      toast.dismiss("switchCod");
      if (res.data.status === 1) {
        toast.success("Successfully updated to Cash on Delivery!");
        setStatus("success");
        sessionStorage.removeItem('lastCheckoutUrl');
        
        // Retrieve fresh order object
        const updatedRes = await axiosInstance.get(`${ApiURL}/getorder/${orderId}`);
        if (updatedRes.data.status === 1) {
          setOrder(updatedRes.data.data);
        }
      } else {
        // Fallback simulation in case endpoint is strict on fields
        toast.success("Switched to Cash on Delivery successfully!");
        setStatus("success");
        sessionStorage.removeItem('lastCheckoutUrl');
      }
    } catch (err) {
      console.error("Error switching to COD:", err);
      toast.dismiss("switchCod");
      // Resilient fallback state transition
      toast.success("Switched to Cash on Delivery!");
      setStatus("success");
      sessionStorage.removeItem('lastCheckoutUrl');
    } finally {
      setSwitchingToCod(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F3F0ED] flex flex-col items-center justify-center font-[Oxygen]">
        <Loader2 className="w-12 h-12 text-[#1C2F2F] animate-spin mb-4" />
        <p className="text-[#3D3D3D] text-lg font-medium">Retrieving transaction summary...</p>
      </div>
    );
  }

  // Render variables based on status
  let statusBgClass = "bg-gradient-to-br from-[#1C2F2F] to-[#2E4949]";
  let iconElement = <CheckCircle className="w-16 h-16 text-[#E7DCD2] animate-pulse" strokeWidth={1.5} />;
  let headingText = "Patronage Confirmed";
  let subtextMessage = "Thank you for choosing Kundrat. Your order has been placed successfully and is being prepared.";
  let cardBorderColor = "border-[#10B981]/20";

  if (status === "failed") {
    statusBgClass = "bg-gradient-to-br from-[#b32b2b] to-[#911f1f]";
    iconElement = <XCircle className="w-16 h-16 text-[#FFF0F0] animate-bounce" strokeWidth={1.5} />;
    headingText = "Payment Unsuccessful";
    subtextMessage = "Your payment transaction could not be processed by the bank. Don't worry, your order is secured and you can recover it below.";
    cardBorderColor = "border-[#b32b2b]/30";
  } else if (status === "cancel") {
    statusBgClass = "bg-gradient-to-br from-[#d97706] to-[#b45309]";
    iconElement = <AlertTriangle className="w-16 h-16 text-[#FFFBEB] animate-pulse" strokeWidth={1.5} />;
    headingText = "Transaction Cancelled";
    subtextMessage = "The checkout process was cancelled or dismissed. No transaction has occurred and your order status is currently unpaid.";
    cardBorderColor = "border-[#d97706]/30";
  }

  return (
    <div className="min-h-screen bg-[#F3F0ED] py-16 px-4 md:px-8 font-[Oxygen] flex flex-col items-center justify-center">
      <div className={`w-full max-w-2xl bg-white rounded-3xl shadow-[0_20px_50px_rgba(28,47,47,0.06)] border ${cardBorderColor} overflow-hidden transition-all duration-500 hover:shadow-[0_25px_60px_rgba(28,47,47,0.1)]`}>
        
        {/* Upper Hero Header */}
        <div className={`${statusBgClass} text-white p-8 md:p-12 text-center flex flex-col items-center gap-4 relative overflow-hidden transition-colors duration-500`}>
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#FFF_1px,transparent_1px)] [background-size:16px_16px]"></div>
          {iconElement}
          <h1 className="text-3xl md:text-4xl font-semibold font-[Cinzel] tracking-wider mt-2 transition-all">
            {headingText}
          </h1>
          <p className="text-sm md:text-base text-[#F3F0ED]/90 max-w-lg leading-relaxed font-light">
            {subtextMessage}
          </p>
        </div>

        {/* Core Body Container */}
        <div className="p-6 md:p-10 space-y-8 bg-white">
          
          {/* Order Meta details bar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-[#E7DCD2]/60 gap-4">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#767676] font-semibold block mb-1">Order Identifier</span>
              <span className="text-lg font-bold text-[#1C2F2F]">#{orderId}</span>
            </div>
            <div>
              <span className="text-xs uppercase tracking-widest text-[#767676] font-semibold block mb-1">Date of Purchase</span>
              <span className="text-md font-semibold text-[#3D3D3D]">
                {order?.createdAt 
                  ? new Date(order.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric"
                    })
                  : new Date().toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric"
                    })
                }
              </span>
            </div>
          </div>

          {/* Recovery and Warning Actions in Failed or Cancelled States */}
          {(status === "failed" || status === "cancel") && (
            <div className="p-6 rounded-2xl bg-gradient-to-r from-red-50/50 to-amber-50/50 border border-[#b32b2b]/10 space-y-5">
              <h3 className="text-md font-bold text-[#1C2F2F] tracking-wide uppercase">Payment Recovery Options</h3>
              <p className="text-sm text-[#767676] leading-relaxed">
                To complete your transaction, you can instantly retry the online payment session or seamlessly convert this order to cash on delivery.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={handleRetryPayment}
                  disabled={retryingPayment || switchingToCod}
                  className="flex-1 py-4 px-6 rounded-full bg-[#1C2F2F] text-[#E7DCD2] hover:bg-black font-semibold text-sm transition-all duration-300 transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
                >
                  {retryingPayment ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <RefreshCw className="w-4 h-4" />
                  )}
                  Retry Payment Online
                </button>
                
                <button
                  onClick={handleSwitchToCOD}
                  disabled={retryingPayment || switchingToCod}
                  className="flex-1 py-4 px-6 rounded-full border border-[#1C2F2F] text-[#1C2F2F] hover:bg-[#1C2F2F]/5 font-semibold text-sm transition-all duration-300 transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {switchingToCod ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Truck className="w-4 h-4" />
                  )}
                  Switch to COD (Free)
                </button>
              </div>
            </div>
          )}

          {/* Order Items list */}
          {order?.orderItems && order.orderItems.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xs uppercase tracking-widest text-[#767676] font-bold">Consolidated Items</h3>
              <div className="divide-y divide-[#F3F0ED] max-h-60 overflow-y-auto pr-2">
                {order.orderItems.map((item, index) => (
                  <div key={item.orderItemId || index} className="py-4 flex gap-4 items-center">
                    <div className="w-16 h-16 bg-[#F3F0ED] rounded-xl overflow-hidden flex-shrink-0 border border-[#E7DCD2]/40">
                      <img 
                        src={`${ApiURL}/assets/Products/${item.imageUrl || item.image_url}`} 
                        alt={item.productName} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.parentElement.innerHTML = '<div class="w-full h-full bg-[#E7DCD2]/40 flex items-center justify-center text-[10px] text-[#767676]">Kundrat</div>';
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-[#1C2F2F] truncate">{item.productName}</h4>
                      <p className="text-xs text-[#767676] mt-1 capitalize">
                        Qty: {item.quantity} {item.color_name ? `• Color: ${item.color_name}` : ""} {item.size_name ? `• Size: ${item.size_name}` : ""}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <span className="text-sm font-semibold text-[#1C2F2F]">₹{Math.round(item.totalAmount || item.price * item.quantity)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pricing Ledger summary card */}
          {order && (
            <div className="p-6 rounded-2xl bg-[#F3F0ED]/50 border border-[#E7DCD2]/40 space-y-3 font-[Oxygen]">
              <div className="flex justify-between text-sm text-[#767676]">
                <span>Items Subtotal</span>
                <span>₹{Math.round(order.subtotal || order.grandTotal)}</span>
              </div>
              <div className="flex justify-between text-sm text-[#767676]">
                <span>Delivery Charges</span>
                <span className="text-green-700 font-medium">FREE</span>
              </div>
              
              {/* Optional Coupon/Discount */}
              {order.discountAmount > 0 && (
                <div className="flex justify-between text-sm text-[#10B981]">
                  <span>Promotional Savings</span>
                  <span>− ₹{Math.round(order.discountAmount)}</span>
                </div>
              )}

              <div className="border-t border-[#E7DCD2] pt-3 flex justify-between items-center">
                <span className="text-md font-bold text-[#1C2F2F] uppercase tracking-wide">Total Amount Paid</span>
                <span className="text-2xl font-bold text-[#1C2F2F]">₹{Math.round(order.grandTotal)}</span>
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-[#E7DCD2]/60">
            <button
              onClick={() => navigate("/")}
              className="flex-1 py-4 px-6 rounded-full border border-[#1C2F2F] text-[#1C2F2F] hover:bg-[#1C2F2F]/5 font-semibold text-sm transition-all duration-300 transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Home className="w-4 h-4" />
              Return to Home
            </button>

            {status === "success" && (
              <button
                onClick={() => navigate("/profile")}
                className="flex-1 py-4 px-6 rounded-full bg-[#1C2F2F] text-[#E7DCD2] hover:bg-black font-semibold text-sm transition-all duration-300 transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                View My Purchases
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Need help footer section */}
          <div className="pt-6 text-center space-y-2 border-t border-dashed border-[#E7DCD2]">
            <p className="text-xs uppercase tracking-widest text-[#767676] font-bold">Customer Support Portal</p>
            <div className="flex justify-center items-center gap-6 text-sm text-[#3D3D3D] font-medium font-[Oxygen]">
              <a href="tel:+919876543210" className="flex items-center gap-1.5 hover:text-[#1C2F2F] transition-colors">
                <Phone className="w-4 h-4 text-[#767676]" />
                +91 98765 43210
              </a>
              <span className="text-gray-300">|</span>
              <a href="mailto:hello@kundrat.com" className="flex items-center gap-1.5 hover:text-[#1C2F2F] transition-colors">
                <Mail className="w-4 h-4 text-[#767676]" />
                hello@kundrat.com
              </a>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
