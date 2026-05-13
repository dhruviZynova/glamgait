import { useState, useEffect } from "react";
import { ChevronLeft, Package, Truck, CheckCircle, MapPin, X } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import SideBar from "./SideBar";
import axiosInstance from "../Axios/axios";
import { ApiURL } from "../Variable";
import BrandBanner from "./BrandBanner";

const OrderDetails = () => {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [tracking, setTracking] = useState(null);
  const [loading, setLoading] = useState(true);

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
        <div className="max-w-7xl mx-auto min-h-screen flex flex-col md:flex-row font-inter">
          <div className="w-full md:w-1/4">
            <SideBar />
          </div>

          <div className="flex-1 p-4 sm:p-6 md:p-10">
            {/* Header/Breadcrumb */}
            <div className="flex items-center gap-2 mb-10 text-[#1a1a1a]">
              <ChevronLeft
                className="cursor-pointer"
                size={24}
                onClick={() => navigate("/myorders")}
              />
              <h2 className="text-3xl font-semibold">Order Details</h2>
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
            <div className="mb-12 px-4">
              <div className="relative flex justify-between items-center max-w-4xl mx-auto">
                {/* Connection Line */}
                <div className="absolute top-1/2 left-0 w-full h-1 bg-[#BEBCBD] -translate-y-1/2"></div>
                <div
                  className="absolute top-1/2 left-0 h-1 bg-[#004534] -translate-y-1/2 transition-all duration-500"
                  style={{ width: "33%" }} // Fixed for demo, should be dynamic based on status
                ></div>

                {/* Steps */}
                {["Order Placed", "Inprogress", "shipped", "Delivered"].map((step, idx) => (
                  <div key={idx} className="relative z-10 flex flex-col items-center">
                    <div className={`w-5 h-5 rounded-full border-4 ${idx <= 1 ? "bg-[#004534] border-[#004534]" : "bg-white border-[#BEBCBD]"
                      }`}></div>
                    <p className={`mt-3 text-sm font-bold capitalize ${idx <= 1 ? "text-[#004534]" : "text-[#BEBCBD]"
                      }`}>{step}</p>
                  </div>
                ))}
              </div>

              {/* Status Highlight Banner */}
              <div className="mt-12 relative max-w-4xl mx-auto">
                {/* Pointer Arrow */}
                <div className="absolute -top-3 left-[33%] -translate-x-1/2 w-6 h-6 bg-[#f9f9f9] rotate-45 border-l border-t border-[#807D7E33] hidden sm:block"></div>

                <div className="bg-[#f9f9f9] rounded-xl p-6 border border-[#807D7E33] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <p className="text-sm text-[#807D7E] font-semibold">8 June 2023 3:40 PM</p>
                  <p className="text-base text-[#3C4242] font-semibold">Your order has been successfully verified.</p>
                  <div className="hidden sm:block"></div> {/* Spacer */}
                </div>
              </div>
            </div>

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
                  {/* Remove/Cancel Icon Button */}
                  {/* < button className="absolute top-5 right-5 text-[#807D7E] hover:text-red-500 transition-colors cursor-pointer" >
                    <X size={24} />
                  </button> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div >

      <BrandBanner />
    </>
  );
};

export default OrderDetails;
