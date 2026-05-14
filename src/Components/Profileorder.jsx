import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SideBar from "./SideBar";
import { ApiURL, userInfo } from "../Variable";
import axiosInstance from "../Axios/axios";
import toast from "react-hot-toast";
import { Package, XCircle } from "lucide-react";
import { getGuestId } from "../utils/guest";
import BrandBanner from "./BrandBanner";
import CancelOrderModal from "./CancelOrderModal";

const Profileorder = () => {
  const statusMap = {
    1: "Pending",
    2: "Accepted",
    3: "Preparing",
    4: "Shipped",
    5: "Delivered",
    6: "Cancelled",
  };

  const [activeTab, setActiveTab] = useState("Active");
  const [orders, setOrders] = useState([]);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const navigate = useNavigate();
  const tabs = ["Active", "Completed", "Cancelled"];
  const user = userInfo();
  const u_id = user?.u_id;
  const guestId = getGuestId();

  const isLoggedIn = !!u_id;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        let url = `${ApiURL}/getorder?`;
        if (isLoggedIn) {
          url += `u_id=${u_id}`;
        } else {
          url += `guest_id=${guestId}`;
        }

        const res = await axiosInstance.get(url);

        if (res.data.status === 1) {
          setOrders(res.data.data || []);
        } else {
          setOrders([]);
        }
      } catch (err) {
        console.error("Error fetching orders:", err);
        setOrders([]);
        toast.error("Failed to load orders");
      }
    };

    fetchOrders();
  }, [u_id, isLoggedIn, guestId]);

  const handleCancelOrder = async (reason) => {
    try {
      const res = await axiosInstance.put(`${ApiURL}/cancelorder`, {
        order_id: selectedOrderId,
        reason: reason, // Passing the reason for cancellation
        ...(!isLoggedIn && { guest_id: guestId }),
      });

      if (res.data.status === 1) {
        toast.success("Order cancelled successfully!");
        setOrders((prev) =>
          prev.map((o) =>
            o.orderId === selectedOrderId ? { ...o, status: 6 } : o,
          ),
        );
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

  const filteredOrders = orders.filter((order) => {
    if (activeTab === "Active") return [1, 2, 3, 4].includes(order.status); // Pending to Shipped
    if (activeTab === "Cancelled") return order.status === 6; // Cancelled
    if (activeTab === "Completed") return [5].includes(order.status); // Delivered
    return true;
  });

  return (
    <>
      <div className="w-full lg:pt-0 pt-8 px-2 md:px-8 xl:px-24">
        <div className="flex flex-col md:flex-row font-inter">
          {/* Sidebar */}
          <div className="w-full md:w-1/4">
            <SideBar />
          </div>

          {/* Main content */}
          <div className="flex-1 p-4 sm:p-6 md:p-8">
            <h2 className="text-3xl font-semibold mb-8 text-[#1a1a1a]">
              My Orders
            </h2>

            {/* Tabs */}
            <div className="flex border-b-2 border-[#F6F6F6] mb-8 relative">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`relative py-2 px-8 text-base sm:text-lg font-semibold transition-all duration-300 text-center rounded-[4px] cursor-pointer ${activeTab === tab
                    ? "text-[#3C4242] after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-[#1a1a1a] bg-[#F6F6F6]"
                    : "text-[#3C4242] hover:text-[#1a1a1a]"
                    }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Orders List */}
            <div className="space-y-8">
              {filteredOrders?.map((order) => (
                <div
                  key={order.orderId}
                  className="bg-white rounded-2xl p-6 sm:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100"
                >
                  {/* Header Info */}
                  <div className="flex flex-col md:flex-row justify-between gap-6 mb-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-2">
                      <div>
                        <h3 className="text-lg font-semibold text-[#1a1a1a] mb-2">Order no: #{order.orderId}</h3>
                        <p className="text-sm">
                          <span className="text-[#3C4242] font-[Causten] font-600">Order Date : </span><span className="text-[#3C4242] font-[Causten] font-600">{new Date(order.createdAt).toLocaleDateString()}</span>
                        </p>
                        <p className="text-sm">
                          <span className="text-[#3C4242] font-[Causten] font-600">Estimated Delivery Date : </span><span className="text-[#3C4242] font-[Causten] font-600">8 June 2023</span>
                        </p>
                      </div>
                    </div>

                    <div className="text-left md:text-right space-y-1">
                      <p className="text-sm">
                        <span className="text-[#3C4242] font-[Causten] font-600">Order Status : </span><span className={`font-[Causten] font-600 capitalize ${order.status === 6 ? "text-red-500" : "text-[#3C4242]"}`}>{statusMap[order.status] || "Unknown"}</span>
                      </p>
                      <p className="text-sm">
                        <span className="text-[#3C4242] font-[Causten] font-600">Payment Method : </span><span className="text-[#3C4242] font-[Causten] font-600">{order.paymentStatus}</span>
                      </p>
                    </div>
                  </div>

                  <div className="h-px bg-gray-100 w-full mb-8"></div>

                  {/* Product/Item Preview */}
                  <div className="flex flex-col lg:flex-row justify-between items-end lg:items-center gap-6">
                    <div className="flex flex-wrap gap-6 flex-1 w-full">
                      {order.orderItems.map((item) => (
                        <div key={item.orderItemId} className="flex gap-4 w-full sm:w-auto">
                          <img
                            src={`${ApiURL}/assets/Products/${item.imageUrl}`}
                            alt={item.productName}
                            className="w-24 h-24 rounded-xl object-cover shadow-sm"
                          />
                          <div className="flex flex-col justify-center">
                            <h4 className="font-semibold text-[#1a1a1a] text-lg mb-1">{item.productName}</h4>
                            <div className="space-y-0.5">
                              <p className="text-sm flex items-center gap-2">
                                Colour : <span className="text-[#3C4242] font-[Causten] font-600 capitalize">{item.color_name || "N/A"}</span>
                                {item.color_code && (
                                  <span
                                    className="w-3 h-3 rounded-full border border-gray-300"
                                    style={{ backgroundColor: item.color_code }}
                                  ></span>
                                )}
                              </p>
                              <p className="text-sm">
                                Qty : <span className="text-[#3C4242] font-[Causten] font-600">{item.quantity}</span>
                              </p>
                              <p className="text-sm">
                                Total : <span className="text-[#3C4242] font-[Causten] font-600">₹{Math.round(item.totalAmount)}</span>
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-3 w-full sm:w-auto mt-4 sm:mt-0">
                      {order.status === 5 && (
                        <button
                          onClick={() => {
                            setSelectedOrderId(order.orderId);
                            setShowCancelModal(true);
                          }}
                          className="flex-1 sm:flex-none bg-white border-2 border-[#b32b2b] text-[#b32b2b] px-8 py-3 rounded-lg font-bold hover:bg-[#b32b2b] hover:text-white transition shadow-sm min-w-[140px] cursor-pointer"
                        >
                          Cancel Order
                        </button>
                      )}
                      {order.status === 6 && (
                         <div className="flex items-center gap-2 px-6 py-3 bg-red-50 text-red-600 rounded-lg font-bold border border-red-100">
                            <XCircle size={18} />
                            <span>Cancelled</span>
                         </div>
                      )}
                      <button
                        onClick={() => navigate(`/orderdetails/${order.orderId}`)}
                        className="flex-1 sm:flex-none bg-[#004534] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#00382e] transition shadow-md min-w-[140px] cursor-pointer"
                      >
                        View Detail
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {filteredOrders.length === 0 && (
                <div className="bg-white/50 border-2 border-dashed border-gray-200 rounded-2xl py-20 text-center">
                  <Package size={48} className="mx-auto text-[#004534] mb-4" />
                  <p className="text-[#004534] font-medium">No {activeTab.toLowerCase()} orders found.</p>
                </div>
              )}
            </div>
          </div>
          <CancelOrderModal
            isOpen={showCancelModal}
            onClose={() => setShowCancelModal(false)}
            onConfirm={handleCancelOrder}
            orderId={selectedOrderId}
          />
        </div>
      </div>

      <BrandBanner />
    </>
  );
};

export default Profileorder;
