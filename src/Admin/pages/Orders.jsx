// /* eslint-disable react-hooks/exhaustive-deps */
// import { useState, useEffect } from "react";
// import {
//   FaTrash,
//   FaRupeeSign,
//   FaChevronDown,
//   FaChevronUp,
//   FaSearch,
//   FaSpinner,
//   FaInfoCircle,
// } from "react-icons/fa";
// import { toast } from "react-hot-toast";
// import axiosInstance from "../../Axios/axios";
// import { ApiURL } from "../../Variable";
// import TrackingSection from "./TrackingSection";

// const AdminOrders = () => {
//   const [orders, setOrders] = useState([]);
//   const [totalPages, setTotalPages] = useState(1);
//   const [totalOrders, setTotalOrders] = useState(0);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [loading, setLoading] = useState(true);
//   // const [expandedOrder, setExpandedOrder] = useState(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [openOrderId, setOpenOrderId] = useState(null);
//   const [logistics, setLogistics] = useState([]);
//   const [selectedLogistic, setSelectedLogistic] = useState(null);
//   const [loadingLogistics, setLoadingLogistics] = useState(false);
//   const [trackingDetails, setTrackingDetails] = useState([]);
//   const [limit] = useState(20);
//   useEffect(() => {
//     fetchOrders(currentPage, searchTerm);
//   }, [currentPage, searchTerm]);

//   const fetchOrders = async (page = 1, search = "") => {
//     try {
//       setLoading(true);
//       const response = await axiosInstance.post(`${ApiURL}/getallorders`, {
//         page,
//         limit: limit,
//         search,
//       });
//       if (response?.data?.status === 1) {
//         setOrders(response.data.data.orders || []);
//         setTotalPages(response.data.data.totalPages || 1);
//         setTotalOrders(response.data.data.totalOrders || 0);
//       } else {
//         setOrders([]);
//         setTotalPages(1);
//         setTotalOrders(0);
//       }
//     } catch (error) {
//       console.error("Failed to fetch orders:", error);

//       setOrders([]);
//       setTotalPages(1);
//       setTotalOrders(0);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const confirmDelete = (orderId) => {
//     if (window.confirm("Are you sure you want to delete this order?")) {
//       deleteOrder(orderId);
//     }
//   };

//   const deleteOrder = async (orderId) => {
//     try {
//       const response = await axiosInstance.post(`${ApiURL}/cancelorder`, {
//         order_id: orderId,
//       });
//       if (response.data.status === 1) {
//         fetchOrders(currentPage, searchTerm);
//         toast.success("Order cancelled successfully!");
//       } else {
//         console.log(response.data.description || "Order cancellation failed!");
//       }
//     } catch (error) {
//       console.error("Cancel failed:", error);
//     }
//   };

//   const handleSearch = () => {
//     setCurrentPage(1);
//   };

//   const fetchLogistics = async (expressflyOrderId) => {
//     try {
//       setLoadingLogistics(true);
//       const res = await axiosInstance.post(
//         `${ApiURL}/get-logistics/${expressflyOrderId}`
//       );

//       if (res.data.status === 1) {
//         // data comes as object {16: {}, 19: {}}
//         const arr = Object.values(res.data.data);
//         setLogistics(arr);
//       } else {
//         setLogistics([]);
//         toast.error(res.data.message);
//       }
//     } catch (e) {
//       toast.error("Failed to load logistics");
//     } finally {
//       setLoadingLogistics(false);
//     }
//   };

//   const toggleOrder = (order) => {
//     console.log(order.orderId);
//     console.log(openOrderId, "open");

//     if (openOrderId === order.orderId) {
//       setOpenOrderId(null); // collapse
//     } else {
//       setOpenOrderId(order.orderId); // expand
//       order.logist;
//       if (!order.logistic_id) {
//         fetchLogistics(order.expressfly_order_id);
//       }
//     }
//   };

//   const shipOrder = async (orderId) => {
//     if (!selectedLogistic) {
//       return toast.error("Please select a logistic partner");
//     }

//     try {
//       toast.loading("Shipping order...", { id: "ship" });

//       const order = orders.find((o) => o.orderId === orderId);

//       const res = await axiosInstance.post(`${ApiURL}/ship-order`, {
//         expressfly_order_id: order.expressfly_order_id,
//         logistic_id: selectedLogistic.logistic_id,
//       });

//       toast.dismiss("ship");

//       if (res.data.status === 1) {
//         toast.success("Order shipped successfully");
//         fetchOrders(currentPage, searchTerm);
//       } else {
//         toast.error(res.data.message || "Failed to ship order");
//       }
//     } catch (error) {
//       toast.dismiss("ship");
//       toast.error("Error while shipping");
//     }
//   };

//   const handleTracking = async (order) => {
//     try {
//       const response = await axiosInstance.get(
//         `${ApiURL}/track/${order.awb_number}`
//       );
//       setTrackingDetails(response.data.data);
//     } catch (error) {
//       console.log(error);
//       setTrackingDetails([]);
//     }
//   };

//   const printLabel = (awb) => {
//     if (!awb) {
//       toast.error("AWB not available");
//       return;
//     }

//     // This will auto-download perfect PDF
//     const url = `${ApiURL}/shipping-label/${awb}`;
//     window.open(url, "_blank");

//     toast.success("Label downloading...");
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center min-h-screen bg-gray-100">
//         <FaSpinner className="animate-spin h-12 w-12 text-gray-600" />
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-6 sm:py-8">
//       <div className=" px-4 sm:px-6 lg:px-8">
//         {/* Header */}
//         <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-4">
//           <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
//             Order Management
//           </h1>
//           <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
//             <div className="relative w-full sm:w-64">
//               <input
//                 type="text"
//                 placeholder="Search orders..."
//                 className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300 text-sm"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 onKeyPress={(e) => e.key === "Enter" && handleSearch()}
//                 aria-label="Search orders"
//               />
//               <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
//             </div>
//           </div>
//         </div>

//         {/* Orders List */}
//         <div className="space-y-4">
//           {orders.length === 0 ? (
//             <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
//               <p className="text-gray-500 text-lg" role="status">
//                 No orders found.
//               </p>
//             </div>
//           ) : (
//             orders?.map((order) => (
//               <div
//                 key={order.orderId}
//                 className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-md"
//               >
//                 {/* Order Header */}
//                 <div
//                   className="p-4 sm:p-6 cursor-pointer hover:bg-gray-50 transition-colors duration-200"
//                   onClick={() => toggleOrder(order)}
//                   role="button"
//                   tabIndex={0}
//                   aria-label={`Toggle order ${order.orderId} details`}
//                 >
//                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
//                     <div className="space-y-1">
//                       <p className="text-sm font-semibold text-gray-700">
//                         Order #
//                       </p>
//                       <p className="text-base font-medium text-gray-900">
//                         #{order.orderId}
//                       </p>
//                     </div>
//                     <div className="space-y-1">
//                       <p className="text-sm font-semibold text-gray-700">
//                         Customer
//                       </p>
//                       <p className="text-sm text-gray-900">
//                         {order.customerName || "Unknown Customer"}
//                       </p>
//                     </div>
//                     <div className="space-y-1">
//                       <p className="text-sm font-semibold text-gray-700">
//                         Amount
//                       </p>
//                       <p className="text-lg font-bold text-green-600">
//                         ₹{order.grandTotal.toFixed(2)}
//                       </p>
//                       <p className="text-xs text-gray-500">
//                         {order.paymentStatus || "N/A"}
//                       </p>
//                     </div>
//                     <div className="flex items-center justify-end sm:justify-start">
//                       <button
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           toggleOrder(order);
//                         }}
//                         className="ml-2 p-1 rounded-full hover:bg-gray-100 transition-colors duration-200"
//                         aria-label={
//                           openOrderId === order.orderId
//                             ? "Collapse order details"
//                             : "Expand order details"
//                         }
//                       >
//                         {openOrderId === order.orderId ? (
//                           <FaChevronUp className="h-4 w-4 text-gray-500" />
//                         ) : (
//                           <FaChevronDown className="h-4 w-4 text-gray-500" />
//                         )}
//                       </button>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Order Details - Expanded */}
//                 {openOrderId === order.orderId && (
//                   <div className="p-4 sm:p-6 bg-gray-50 animate-slide-down">
//                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
//                       {/* Shipping Details */}
//                       <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
//                         <div className="flex items-center mb-4">
//                           <FaInfoCircle className="h-5 w-5 text-blue-500 mr-2" />
//                           <h3 className="font-semibold text-lg text-gray-800">
//                             Shipping Details
//                           </h3>
//                         </div>
//                         <div className="space-y-2 text-sm text-gray-600">
//                           {order.address.first_name !== "N/A" &&
//                             order.address.last_name !== "N/A" && (
//                               <p>
//                                 <span className="font-medium text-gray-800">
//                                   Name:
//                                 </span>{" "}
//                                 {order.address.first_name}{" "}
//                                 {order?.address?.last_name}
//                               </p>
//                             )}
//                           {order.address.address !== "N/A" && (
//                             <p>
//                               <span className="font-medium text-gray-800">
//                                 Address:
//                               </span>{" "}
//                               {order.address.address}
//                             </p>
//                           )}
//                           {(order.address.city !== "N/A" ||
//                             order.address.state !== "N/A") && (
//                             <p>
//                               <span className="font-medium text-gray-800">
//                                 Location:
//                               </span>{" "}
//                               {order.address.city || "N/A"},{" "}
//                               {order.address.state || "N/A"}{" "}
//                               {order.address.zip_code !== "N/A"
//                                 ? ` - ${order.address.zip_code}`
//                                 : ""}
//                             </p>
//                           )}
//                           {order.address.phone_number !== "N/A" && (
//                             <p>
//                               <span className="font-medium text-gray-800">
//                                 Phone:
//                               </span>{" "}
//                               {order.address.phone_number}
//                             </p>
//                           )}
//                           {order.address.email !== "N/A" && (
//                             <p>
//                               <span className="font-medium text-gray-800">
//                                 Email:
//                               </span>{" "}
//                               {order.address.email}
//                             </p>
//                           )}
//                           {order.address.add_type !== "N/A" && (
//                             <p>
//                               <span className="font-medium text-gray-800">
//                                 Type:
//                               </span>{" "}
//                               {order.address.add_type}
//                             </p>
//                           )}
//                           {!(
//                             order.address.customerName !== "N/A" ||
//                             order.address.address !== "N/A" ||
//                             order.address.email !== "N/A" ||
//                             order.address.phone_number !== "N/A"
//                           ) && (
//                             <p className="text-gray-500 italic">
//                               No shipping details available
//                             </p>
//                           )}
//                         </div>
//                       </div>

//                       {/* Payment Details */}
//                       <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
//                         <div className="flex items-center mb-4">
//                           <FaRupeeSign className="h-5 w-5 text-green-500 mr-2" />
//                           <h3 className="font-semibold text-lg text-gray-800">
//                             Payment Details
//                           </h3>
//                         </div>
//                         <div className="space-y-2 text-sm">
//                           <div className="flex justify-between py-1 border-b border-gray-200">
//                             <span className="text-gray-600">Subtotal</span>
//                             <span className="font-medium text-gray-900">
//                               ₹{order?.totalPrice.toFixed(2)}
//                             </span>
//                           </div>
//                           <div className="flex justify-between py-1 border-b border-gray-200">
//                             <span className="text-gray-600">Shipping</span>
//                             <span className="font-medium text-gray-900">
//                               ₹{order?.shippingCharge.toFixed(2)}
//                             </span>
//                           </div>
//                           {/* <div className="flex justify-between py-1 border-b border-gray-200">
//                             <span className="text-gray-600">Tax</span>
//                             <span className="font-medium text-gray-900">
//                               ₹{order?.tax.toFixed(2)}
//                             </span>
//                           </div> */}
//                           <div className="flex justify-between py-2 border-b border-gray-200 font-semibold text-lg text-gray-800">
//                             <span>Grand Total</span>
//                             <span>₹{order?.grandTotal.toFixed(2)}</span>
//                           </div>
//                         </div>
//                       </div>
//                     </div>

//                     {/* Order Items */}
//                     <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
//                       <h3 className="font-semibold text-lg mb-4 text-gray-800">
//                         Order Items ({order?.orderItems?.length || 0})
//                       </h3>
//                       <div className="space-y-4">
//                         {order?.orderItems?.map((item) => (
//                           <div
//                             key={item?.orderItemId}
//                             className="flex flex-col sm:flex-row items-start gap-4 border-b border-gray-200 pb-4 last:border-0"
//                           >
//                             <img
//                               src={
//                                 item.imageUrl
//                                   ? `${ApiURL}/assets/Products/${item.imageUrl}`
//                                   : "https://via.placeholder.com/80x80?text=No+Image"
//                               }
//                               alt={item.productName || "Item"}
//                               className="w-20 h-20 object-cover rounded-lg shadow-sm flex-shrink-0"
//                               onError={(e) => {
//                                 e.target.src =
//                                   "https://via.placeholder.com/80x80?text=No+Image";
//                               }}
//                             />
//                             <div className="flex-1 min-w-0">
//                               <h4 className="font-medium text-gray-800 text-sm sm:text-base mb-1">
//                                 {item.productName || "Unknown Item"}
//                               </h4>
//                               <p className="text-xs sm:text-sm text-gray-600 mb-1">
//                                 Sub-Category: {item.subCategoryName || "N/A"}
//                               </p>
//                               {item.color && (
//                                 <div className="flex items-center gap-2 mb-2">
//                                   <div
//                                     className="w-3 h-3 rounded-full"
//                                     style={{
//                                       backgroundColor:
//                                         item.color.color_code || "#000",
//                                     }}
//                                   />
//                                   <span className="text-xs sm:text-sm text-gray-600">
//                                     {item.color.color_name || "N/A"}
//                                   </span>
//                                 </div>
//                               )}
//                               <div className="flex items-center justify-between sm:justify-start gap-4 text-sm">
//                                 <span className="text-gray-600">
//                                   Qty: {item.quantity}
//                                 </span>
//                                 <span className="text-gray-600">
//                                   ₹{item.price.toFixed(2)}
//                                 </span>
//                                 <span className="font-medium text-gray-900">
//                                   ₹{item.totalAmount.toFixed(2)}
//                                 </span>
//                               </div>
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     </div>

//                     {/* Actions */}
//                     <div className="flex flex-col sm:flex-row gap-4 justify-end mt-6">
//                       <button
//                         onClick={() => confirmDelete(order.orderId)}
//                         className="w-full sm:w-auto px-6 py-2.5 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all duration-200 shadow-sm flex items-center justify-center gap-2 text-sm font-medium"
//                         aria-label="Cancel order"
//                       >
//                         <FaTrash className="w-4 h-4" />
//                         Cancel Order
//                       </button>
//                     </div>
//                     {openOrderId === order.orderId && (
//                       <div className="p-4 bg-gray-100 rounded-xl mt-3">
//                         {/* If logistic already selected → show ONLY Track Order */}
//                         {order?.logistic_id ? (
//                           <div className="flex gap-4">
//                             <button
//                               className="px-6 py-2 bg-green-600 text-white rounded-xl"
//                               onClick={() => handleTracking(order)}
//                             >
//                               Track Order
//                             </button>
//                             {trackingDetails && (
//                               <div className="mt-4">
//                                 <TrackingSection
//                                   trackingData={trackingDetails}
//                                 />
//                               </div>
//                             )}
//                           </div>
//                         ) : (
//                           <div>
//                             {loadingLogistics ? (
//                               <p>Loading logistics...</p>
//                             ) : (
//                               <>
//                                 <select
//                                   className="border p-2 rounded-xl w-full"
//                                   onChange={(e) =>
//                                     setSelectedLogistic(
//                                       logistics.find(
//                                         (l) =>
//                                           String(l.logistic_id) ===
//                                           String(e.target.value)
//                                       )
//                                     )
//                                   }
//                                 >
//                                   <option value="">Select Logistic</option>

//                                   {logistics?.map((l) => (
//                                     <option
//                                       key={l.logistic_id}
//                                       value={l.logistic_id}
//                                     >
//                                       {l.logistic} – ₹{l.total}
//                                     </option>
//                                   ))}
//                                 </select>

//                                 {/* Show logo also */}
//                                 {selectedLogistic && (
//                                   <div className="flex items-center gap-3 mt-2">
//                                     <img
//                                       src={`https://cp.expressfly.in/logos/${selectedLogistic.logo_image}`}
//                                       className="h-10 w-auto rounded-md"
//                                     />
//                                     <span className="text-gray-700 font-medium">
//                                       {selectedLogistic.logistic}
//                                     </span>
//                                   </div>
//                                 )}

//                                 <button
//                                   disabled={!selectedLogistic}
//                                   onClick={() => shipOrder(order.orderId)}
//                                   className="w-full mt-3 px-6 py-2.5 bg-blue-600 text-white rounded-xl"
//                                 >
//                                   Ship Order
//                                 </button>
//                               </>
//                             )}
//                           </div>
//                         )}
//                       </div>
//                     )}

//                     <button
//                       onClick={() => printLabel(order.awb_number)}
//                       disabled={!order.awb_number}
//                       className={`px-6 py-3 rounded-xl font-medium text-white transition-all shadow-md ${
//                         order.awb_number
//                           ? "bg-red-600 hover:bg-red-700"
//                           : "bg-gray-400 cursor-not-allowed"
//                       }`}
//                     >
//                       {order.awb_number ? "Download Print Label" : "No AWB Yet"}
//                     </button>
//                   </div>
//                 )}
//               </div>
//             ))
//           )}

//           {/* Pagination */}
//           {totalOrders > 0 && (
//             <div className="mt-8 flex flex-wrap justify-center gap-2">
//               {Array.from({ length: totalPages }, (_, i) => (
//                 <button
//                   key={i + 1}
//                   onClick={() => setCurrentPage(i + 1)}
//                   className={`px-4 py-2 rounded-xl text-sm font-medium ${
//                     currentPage === i + 1
//                       ? "bg-black text-white shadow-md"
//                       : "bg-gray-200 text-gray-700 hover:bg-gray-300"
//                   } transition-all duration-200 min-w-[40px]`}
//                   aria-label={`Page ${i + 1}`}
//                 >
//                   {i + 1}
//                 </button>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminOrders;

/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import {
  FaTrash,
  FaRupeeSign,
  FaChevronDown,
  FaChevronUp,
  FaSearch,
  FaSpinner,
  FaInfoCircle,
  FaTruck,
  FaBoxOpen,
  FaDownload,
} from "react-icons/fa";
import { toast } from "react-hot-toast";
import { adminAxios } from "../../Axios/axios";
import { ApiURL } from "../../Variable";
import TrackingSection from "./TrackingSection";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
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
    switch (s) {
      case 1:
        return {
          label: "Pending",
          color: "bg-amber-100 text-amber-700 border-amber-200",
        };
      case 2:
        return {
          label: "Accepted",
          color: "bg-sky-100 text-sky-700 border-sky-200",
        };
      case 3:
        return {
          label: "Preparing",
          color: "bg-indigo-100 text-indigo-700 border-indigo-200",
        };
      case 4:
        return {
          label: "Shipped",
          color: "bg-purple-100 text-purple-700 border-purple-200",
        };
      case 5:
        return {
          label: "Delivered",
          color: "bg-emerald-100 text-emerald-700 border-emerald-200",
        };
      default:
        return {
          label: "Cancelled",
          color: "bg-rose-100 text-rose-700 border-rose-200",
        };
    }
  };

  useEffect(() => {
    fetchOrders(currentPage, searchTerm);
  }, [currentPage]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm) {
        setCurrentPage(1);
        fetchOrders(1, searchTerm);
      } else if (searchTerm === "") {
        fetchOrders(currentPage, "");
      }
    }, 600);
    return () => clearTimeout(timer);
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

  return (
    <div className="pb-8 min-h-screen bg-gray-50">
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
                                  <select
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white text-sm font-bold focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                                    onChange={(e) =>
                                      setSelectedLogistic(
                                        logistics.find(
                                          (l) =>
                                            String(l.logistic_id) ===
                                            e.target.value,
                                        ),
                                      )
                                    }
                                  >
                                    <option value="">Select Carrier</option>
                                    {logistics.map((l) => (
                                      <option
                                        key={l.logistic_id}
                                        value={l.logistic_id}
                                      >
                                        {l.logistic} – ₹{l.total}
                                      </option>
                                    ))}
                                  </select>

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
                                    className="w-full py-3 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-sm active:scale-95"
                                  >
                                    {loadingLogistics ? (
                                      <FaSpinner size={14} className="animate-spin mx-auto" />
                                    ) : (
                                      "Ship Dispatch"
                                    )}
                                  </button>
                                </div>
                              )}
                              <button
                                onClick={() => cancelOrder(order.orderId)}
                                className="w-full py-3 bg-white border border-rose-200 text-rose-600 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-rose-50 transition-all active:scale-95"
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
