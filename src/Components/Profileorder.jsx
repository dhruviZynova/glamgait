import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SideBar from "./SideBar";
import { ApiURL, userInfo } from "../Variable";
import axiosInstance from "../Axios/axios";
import toast from "react-hot-toast";
import { Package, XCircle, RefreshCcw, Receipt, ArrowLeftRight, Loader2 } from "lucide-react";
import { getGuestId } from "../utils/guest";
import BrandBanner from "./BrandBanner";
import CancelOrderModal from "./CancelOrderModal";
import ReturnOrderModal from "./ReturnOrderModal";
import { ORDER_STATUS, STATUS_LABELS } from "../utils/constants";
import InvoiceModal from "./InvoiceModal";
import OrdersSkeleton from "./skeletons/OrdersSkeleton";

const Profileorder = () => {

  const [activeTab, setActiveTab] = useState("Active");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const [returningId, setReturningId] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [selectedOrderForInvoice, setSelectedOrderForInvoice] = useState(null);
  const [isCreditNote, setIsCreditNote] = useState(false);

  const canShowInvoice = (order) => {
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

  const canShowCreditNote = (order) => {
    if (!order) return false;
    return [
      ORDER_STATUS.CANCELLED,
      ORDER_STATUS.RETURNED
    ].includes(order.status);
  };
  const navigate = useNavigate();
  const tabs = ["Active", "Completed", "Cancelled", "Returned"];
  const user = userInfo();
  const u_id = user?.u_id;
  const guestId = getGuestId();

  const isLoggedIn = !!u_id;

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
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
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [u_id, isLoggedIn, guestId]);

  const handleCancelOrder = async (reason) => {
    if (cancellingId) return;
    setCancellingId(selectedOrderId);
    try {
      const res = await axiosInstance.put(`${ApiURL}/cancelorder`, {
        order_id: selectedOrderId,
        reason: reason,
        ...(!isLoggedIn && { guest_id: guestId }),
      });

      if (res.data.status === 1) {
        toast.success("Order cancelled successfully!");
        setOrders((prev) =>
          prev.map((o) =>
            o.orderId === selectedOrderId ? { ...o, status: ORDER_STATUS.CANCELLED } : o,
          ),
        );
      } else {
        toast.error(res.data.message || "Failed to cancel");
      }
    } catch (err) {
      toast.error("Something went wrong");
      console.error(err);
    } finally {
      setCancellingId(null);
      setShowCancelModal(false);
    }
  };

  const handleReturnOrder = async (reason) => {
    if (returningId) return;
    setReturningId(selectedOrderId);
    try {
      const res = await axiosInstance.put(`${ApiURL}/returnorder`, {
        order_id: selectedOrderId,
        reason: reason,
        ...(!isLoggedIn && { guest_id: guestId }),
      });

      if (res.data.status === 1) {
        toast.success("Return request submitted successfully!");
        setOrders((prev) =>
          prev.map((o) =>
            o.orderId === selectedOrderId ? { ...o, status: ORDER_STATUS.RETURNED } : o,
          ),
        );
      } else {
        toast.error(res.data.message || "Failed to submit return request");
      }
    } catch (err) {
      toast.error("Something went wrong");
      console.error(err);
    } finally {
      setReturningId(null);
      setShowReturnModal(false);
    }
  };

  const filteredOrders = orders.filter((order) => {
    if (activeTab === "Active") return [
      ORDER_STATUS.PENDING,
      ORDER_STATUS.ACCEPTED,
      ORDER_STATUS.PREPARING,
      ORDER_STATUS.SHIPPED
    ].includes(order.status);
    if (activeTab === "Cancelled") return order.status === ORDER_STATUS.CANCELLED;
    if (activeTab === "Completed") return order.status === ORDER_STATUS.DELIVERED;
    if (activeTab === "Returned") return order.status === ORDER_STATUS.RETURNED;
    return true;
  });

  return (
    <>
      <div className="w-full lg:pt-0 pt-4 px-2 md:px-8 xl:px-24">
        <div className="flex flex-col md:flex-row font-inter">
          {/* Sidebar */}
          <div className="w-full md:w-1/4">
            <SideBar />
          </div>

          {/* Main content */}
          <div className="flex-1 p-2 sm:p-6 md:p-8">
            <h2 className="text-3xl font-semibold mb-8 text-[#1a1a1a]">
              My Orders
            </h2>

            {/* Tabs */}
            <div className="flex border-b-2 border-[#F6F6F6] mb-8 relative overflow-x-auto w-full scrollbar-none whitespace-nowrap">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`relative py-2 px-4 sm:px-8 text-sm sm:text-base md:text-lg font-semibold transition-all duration-300 text-center rounded-[4px] cursor-pointer border-none outline-none focus:outline-none focus:ring-0 flex-shrink-0 ${activeTab === tab
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
              {loading ? (
                <OrdersSkeleton count={3} />
              ) : filteredOrders?.map((order) => (
                <div
                  key={order.orderId}
                  className="bg-white rounded-2xl p-4 sm:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100"
                >
                  {/* Header Info */}
                  <div className="flex flex-col md:flex-row justify-between gap-6 mb-6">
                    <div className="grid grid-cols-1 gap-x-12 gap-y-2">
                      <div>
                        <h3 className="text-lg font-semibold text-[#1a1a1a] mb-2">Order no: #{order.orderId}</h3>
                        <p className="text-sm">
                          <span className="text-gray-500 font-[Causten] font-600">Order Date : </span><span className="text-[#3C4242] font-[Causten] font-600">{new Date(order.createdAt).toLocaleDateString()}</span>
                        </p>
                        <p className="text-sm">
                          <span className="text-gray-500 font-[Causten] font-600">Estimated Delivery Date : </span><span className="text-[#3C4242] font-[Causten] font-600">{new Date(new Date(order.createdAt).getTime() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}</span>
                        </p>
                      </div>
                    </div>

                    <div className="text-left md:text-right space-y-1">
                      <p className="text-sm">
                        <span className="text-gray-500 font-[Causten] font-600">Order Status : </span><span className={`font-[Causten] font-600 capitalize ${order.status === ORDER_STATUS.CANCELLED ? "text-red-500" : order.status === ORDER_STATUS.RETURNED ? "text-orange-500" : "text-[#3C4242]"}`}>{STATUS_LABELS[order.status] || "Unknown"}</span>
                      </p>
                      <p className="text-sm">
                        <span className="text-gray-500 font-[Causten] font-600">Payment Method : </span><span className="text-[#3C4242] font-[Causten] font-600">{order.paymentStatus}</span>
                      </p>
                    </div>
                  </div>

                  <div className="h-px bg-gray-100 w-full mb-8"></div>

                  {/* Product/Item Preview */}
                  <div className="flex flex-col justify-between items-end lg:items-center gap-6">
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
                    <div className="flex flex-col sm:flex-row justify-end flex-wrap gap-3 w-full mt-6 sm:mt-0">
                      {[
                        ORDER_STATUS.PENDING,
                        ORDER_STATUS.ACCEPTED,
                        ORDER_STATUS.PREPARING,
                        ORDER_STATUS.SHIPPED,
                      ].includes(order.status) && (
                          <button
                            onClick={() => {
                              setSelectedOrderId(order.orderId);
                              setShowCancelModal(true);
                            }}
                            disabled={cancellingId === order.orderId}
                            className="w-full sm:w-auto bg-white border-2 border-[#b32b2b] text-[#b32b2b] px-6 py-2.5 rounded-lg font-bold hover:bg-[#b32b2b] hover:text-white transition shadow-sm cursor-pointer text-sm flex items-center justify-center gap-2 disabled:opacity-60"
                          >
                            {cancellingId === order.orderId && <Loader2 size={14} className="animate-spin" />}
                            Cancel Order
                          </button>
                        )}
                      {order.status === ORDER_STATUS.DELIVERED && (
                        <button
                          onClick={() => {
                            setSelectedOrderId(order.orderId);
                            setShowReturnModal(true);
                          }}
                          disabled={returningId === order.orderId}
                          className="w-full sm:w-auto bg-white border-2 border-[#004534] text-[#004534] px-6 py-2.5 rounded-lg font-bold hover:bg-[#004534] hover:text-white transition shadow-sm cursor-pointer flex items-center justify-center gap-2 text-sm disabled:opacity-60"
                        >
                          {returningId === order.orderId
                            ? <Loader2 size={16} className="animate-spin" />
                            : <RefreshCcw size={16} />}
                          Return Order
                        </button>
                      )}
                      {order.status === ORDER_STATUS.CANCELLED && (
                        <div className="flex items-center justify-center gap-2 px-6 py-2.5 bg-red-50 text-red-600 rounded-lg font-bold border border-red-100 text-sm">
                          <XCircle size={18} />
                          <span>Cancelled</span>
                        </div>
                      )}
                      {order.status === ORDER_STATUS.RETURNED && (
                        <div className="flex items-center justify-center gap-2 px-6 py-2.5 bg-orange-50 text-orange-600 rounded-lg font-bold border border-orange-100 text-sm">
                          <RefreshCcw size={18} />
                          <span>Returned</span>
                        </div>
                      )}
                      {canShowInvoice(order) && (
                        <button
                          onClick={() => {
                            setSelectedOrderForInvoice(order);
                            setIsCreditNote(false);
                            setShowInvoiceModal(true);
                          }}
                          className="w-full sm:w-auto bg-white border-2 border-emerald-600 text-emerald-600 px-6 py-2.5 rounded-lg font-bold hover:bg-emerald-600 hover:text-white transition shadow-sm cursor-pointer flex items-center justify-center gap-2 text-sm"
                        >
                          <Receipt size={16} />
                          Invoice
                        </button>
                      )}
                      {canShowCreditNote(order) && (
                        <button
                          onClick={() => {
                            setSelectedOrderForInvoice(order);
                            setIsCreditNote(true);
                            setShowInvoiceModal(true);
                          }}
                          className="w-full sm:w-auto bg-white border-2 border-rose-600 text-rose-600 px-6 py-2.5 rounded-lg font-bold hover:bg-rose-600 hover:text-white transition shadow-sm cursor-pointer flex items-center justify-center gap-2 text-sm"
                        >
                          <ArrowLeftRight size={16} />
                          Credit Note
                        </button>
                      )}
                      <button
                        onClick={() => navigate(`/orderdetails/${order.orderId}`)}
                        className="w-full sm:w-auto bg-[#004534] text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-[#00382e] transition shadow-md cursor-pointer text-sm"
                      >
                        View Detail
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {!loading && filteredOrders.length === 0 && (
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
          <ReturnOrderModal
            isOpen={showReturnModal}
            onClose={() => setShowReturnModal(false)}
            onConfirm={handleReturnOrder}
            orderId={selectedOrderId}
          />
          <InvoiceModal
            isOpen={showInvoiceModal}
            onClose={() => setShowInvoiceModal(false)}
            order={selectedOrderForInvoice}
            isCreditNote={isCreditNote}
          />
        </div>
      </div>

      <BrandBanner />
    </>
  );
};

export default Profileorder;
