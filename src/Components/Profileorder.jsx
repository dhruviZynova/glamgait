// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import SideBar from "./SideBar";
// import { ApiURL, userInfo } from "../Variable";
// import axiosInstance from "../Axios/axios";

// const Profileorder = () => {
//   const statusMap = {
//     1: "Pending",
//     2: "Accepted",
//     3: "Preparing",
//     4: "Shipped",
//     5: "Delivered",
//     6: "Cancelled",
//   };
//   const [activeTab, setActiveTab] = useState("Active");
//   const [orders, setOrders] = useState([]);

//   const navigate = useNavigate();

//   const tabs = ["Active", "Cancelled", "Completed"];

//   const user = userInfo();
//   const u_id = user?.u_id;

//   useEffect(() => {
//     const fetchOrders = async () => {
//       try {
//         if (!u_id) return;
//         const res = await axiosInstance.get(`${ApiURL}/getorder/${u_id}`);
//         if (res.data.status === 1) {
//           setOrders(res.data.data);
//         } else {
//           setOrders([]);
//         }
//       } catch (err) {
//         console.error("Error fetching orders:", err);
//         setOrders([]);
//       }
//     };
//     fetchOrders();
//   }, [u_id]);

//   //  Filter orders by tab
//   const filteredOrders = orders.filter((order) => {
//     if (activeTab === "Active") return order.status === 1; // pending/active
//     if (activeTab === "Cancelled") return order.status === 0; // cancelled
//     if (activeTab === "Completed") return order.status === 2; // completed
//     return true;
//   });

//   return (
//     <div className="bg-[#f3f0ed] min-h-screen flex flex-col md:flex-row font-inter">
//       {/* Sidebar */}
//       <div className="w-full md:w-1/4">
//         <SideBar />
//       </div>

//       {/* Main content */}
//       <div className="flex-1 p-4 sm:p-6 md:p-10 bg-[#f3f0ed]">
//         <h2 className="text-xl sm:text-2xl font-semibold mb-6 text-gray-800">
//           My Orders
//         </h2>

//         {/* Tabs */}
//         <div className="flex justify-between border-b border-gray-300 mb-8">
//           {tabs.map((tab) => (
//             <button
//               key={tab}
//               onClick={() => setActiveTab(tab)}
//               className={`relative pb-3 w-1/3 text-sm sm:text-lg font-medium transition-all duration-300 text-center rounded-t-md ${
//                 activeTab === tab
//                   ? "text-gray-900 bg-[#f6f6f6] after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-black"
//                   : "text-gray-500 hover:text-gray-800"
//               }`}
//             >
//               {tab}
//             </button>
//           ))}
//         </div>

//         {/* Orders List */}
//         <div className="space-y-6">
//           {filteredOrders?.map((order, i) => (
//             <div
//               key={order.orderId}
//               className="bg-[#f6f6f6] rounded-xl p-5 sm:p-6 shadow-sm border border-gray-100"
//             >
//               {/* Header */}
//               <div className="flex flex-col sm:flex-row justify-between text-sm text-gray-600 mb-4">
//                 <div>
//                   <p>
//                     <span className="font-medium text-gray-800">Order no:</span>{" "}
//                     {order.orderId}
//                   </p>
//                   <p className="font-light">Order Date: {order?.date}</p>
//                   <p className="font-light">
//                     Estimated Delivery Date: {order?.delivery}
//                   </p>
//                 </div>

//                 <div className="mt-3 sm:mt-0 text-left sm:text-right font-light text-gray-500">
//                   <p>
//                     <span className="font-light text-gray-500">
//                       Order Status:
//                     </span>{" "}
//                     <span className="text-black">
//                       {statusMap[order.status] || "Unknown"}
//                     </span>
//                   </p>
//                   <p>
//                     <span className="font-light text-gray-500">
//                       Payment Method:
//                     </span>{" "}
//                     {order.paymentStatus}
//                   </p>
//                 </div>
//               </div>

//               <hr className="my-3" />

//               {/* Product Info */}
//               <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
//                 {order.orderItems.map((item, idx) => (
//                   <div
//                     key={idx}
//                     className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 bg-[#f6f6f6] p-4 rounded-md"
//                   >
//                     <div className="flex items-center gap-4">
//                       <img
//                         src={`${ApiURL}/assets/Products/${item.imageUrl}`}
//                         alt={item.productName}
//                         className="w-20 h-20 rounded-md object-cover"
//                       />
//                       <div>
//                         <h3 className="font-semibold text-gray-800 text-sm sm:text-base">
//                           {item.productName}
//                         </h3>
//                         <p className="text-xs sm:text-sm text-gray-600">
//                           Colour:{" "}
//                           <span className="text-black">
//                             {item.color?.color_name || "N/A"}
//                           </span>
//                         </p>
//                         <p className="text-xs sm:text-sm text-gray-600">
//                           Qty:{" "}
//                           <span className="text-black">{item.quantity}</span>
//                         </p>
//                         <p className="text-xs sm:text-sm text-gray-600">
//                           Total:{" "}
//                           <span className="text-black">
//                             ₹{item.totalAmount.toFixed(2)}
//                           </span>
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 ))}

//                 {/* Button logic */}
//                 <div className="w-full sm:w-auto">
//                   {order.status === "Active" ? (
//                     <button
//                       onClick={() => navigate("/orderdetails")}
//                       className="mt-3 sm:mt-0 bg-[#002e25] text-white px-5 py-2 rounded-md hover:bg-[#004534] transition text-sm sm:text-base w-full sm:w-auto text-center"
//                     >
//                       View Details
//                     </button>
//                   ) : order.status === "Cancelled" ? (
//                     <button
//                       disabled
//                       className="mt-3 sm:mt-0 bg-red-100 text-red-700 px-5 py-2 rounded-md text-sm sm:text-base w-full sm:w-auto text-center cursor-not-allowed"
//                     >
//                       Successfully Cancelled
//                     </button>
//                   ) : (
//                     <button
//                       disabled
//                       className="mt-3 sm:mt-0 bg-green-100 text-green-700 px-5 py-2 rounded-md text-sm sm:text-base w-full sm:w-auto text-center cursor-not-allowed"
//                     >
//                       Received Successfully
//                     </button>
//                   )}
//                 </div>
//               </div>
//             </div>
//           ))}

//           {/* No orders message */}
//           {filteredOrders.length === 0 && (
//             <div className="text-center text-gray-500 text-sm py-10">
//               No {activeTab.toLowerCase()} orders found.
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Profileorder;

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SideBar from "./SideBar";
import { ApiURL, userInfo } from "../Variable";
import axiosInstance from "../Axios/axios";
import toast from "react-hot-toast";
import ConfirmDeleteModal from "../Admin/pages/ConfirmDeleteModal";
import { Package } from "lucide-react";
import { getGuestId } from "../utils/guest";
import BrandBanner from "./BrandBanner";

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
  const tabs = ["Active", "Cancelled", "Completed"];
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

  const handleCancelOrder = async () => {
    try {
      const res = await axiosInstance.put(`${ApiURL}/cancelorder`, {
        order_id: selectedOrderId,
        // Optional: guest_id bhej sakte ho if needed
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
                  className="bg-white rounded-2xl p-6 sm:p-8 shadow-[0_4px_20px_rgba(0,0,0,0,03)] border border-gray-100"
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
                        <span className="text-[#3C4242] font-[Causten] font-600">Order Status : </span><span className="text-[#3C4242] font-[Causten] font-600 capitalize">{statusMap[order.status] || "Unknown"}</span>
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
                      {order.status === 1 && (
                        <button
                          onClick={() => {
                            setSelectedOrderId(order.orderId);
                            setShowCancelModal(true);
                          }}
                          className="flex-1 sm:flex-none bg-[#b32b2b] text-white px-8 py-3 rounded-lg font-bold hover:bg-[#8e2222] transition shadow-md min-w-[140px]"
                        >
                          Cancel
                        </button>
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
          <ConfirmDeleteModal
            isOpen={showCancelModal}
            onClose={() => setShowCancelModal(false)}
            onConfirm={handleCancelOrder}
            itemType="order"
            itemName={`#${selectedOrderId}`}
          />
        </div>
      </div>

      <BrandBanner />
    </>
  );
};

export default Profileorder;
