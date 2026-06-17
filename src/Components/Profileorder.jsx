import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import SideBar from "./SideBar";
import { ApiURL, userInfo } from "../Variable";
import axiosInstance from "../Axios/axios";
import toast from "react-hot-toast";
import { Package, XCircle, RefreshCcw, Receipt, ArrowLeftRight, Loader2, Calendar, Truck, Eye } from "lucide-react";
import { getGuestId } from "../utils/guest";
import BrandBanner from "./BrandBanner";
import CancelOrderModal from "./CancelOrderModal";
import ReturnOrderModal from "./ReturnOrderModal";
import { ORDER_STATUS, STATUS_LABELS } from "../utils/constants";
import InvoiceModal from "./InvoiceModal";
import OrdersSkeleton from "./skeletons/OrdersSkeleton";
import { useOrders, useCancelOrder, useReturnOrder } from "../hooks/useOrders";
import ScrollReveal from "./Ui/ScrollReveal";


const Profileorder = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.state?.activeTab || "Active");
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

  // TanStack Queries & Mutations
  const { data: orders = [], isLoading: loading } = useOrders();

  const cancelOrderMutation = useCancelOrder();
  const returnOrderMutation = useReturnOrder();

  const cancellingId = cancelOrderMutation.isPending ? selectedOrderId : null;
  const returningId = returnOrderMutation.isPending ? selectedOrderId : null;

  const handleCancelOrder = (reason) => {
    if (cancellingId) return;
    cancelOrderMutation.mutate({
      order_id: selectedOrderId,
      reason: reason,
      ...(!isLoggedIn && { guest_id: guestId }),
    }, {
      onSettled: () => {
        setShowCancelModal(false);
      }
    });
  };

  const handleReturnOrder = (reason) => {
    if (returningId) return;
    returnOrderMutation.mutate({
      order_id: selectedOrderId,
      reason: reason,
      ...(!isLoggedIn && { guest_id: guestId }),
    }, {
      onSettled: () => {
        setShowReturnModal(false);
      }
    });
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

  const getStatusBadge = (status) => {
    switch (status) {
      case ORDER_STATUS.CANCELLED:
        return (
          <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-red-50 text-red-700 border border-red-100 flex items-center gap-1 capitalize">
            {STATUS_LABELS[status] || "Cancelled"}
          </span>
        );
      case ORDER_STATUS.RETURNED:
        return (
          <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-orange-50 text-orange-700 border border-orange-100 flex items-center gap-1 capitalize">
            {STATUS_LABELS[status] || "Returned"}
          </span>
        );
      case ORDER_STATUS.DELIVERED:
        return (
          <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-50 text-[#063d32] border border-emerald-100 flex items-center gap-1 capitalize">
            {STATUS_LABELS[status] || "Completed"}
          </span>
        );
      default:
        return (
          <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-100 flex items-center gap-1 capitalize">
            {STATUS_LABELS[status] || "Active"}
          </span>
        );
    }
  };

  return (
    <>
      <div className="w-full lg:pt-8 py-4 px-2 md:px-8 xl:px-24">
        <div className="flex flex-col md:flex-row gap-6 md:gap-14 font-poppins">
          {/* Sidebar */}
          <div className="w-full md:w-1/3 lg:w-1/4">
            <SideBar />
          </div>

          {/* Main content */}
          <ScrollReveal animation="fade-left" duration={800} className="flex-1">
            <h2 className="text-3xl font-semibold mb-8 text-[#3C4242] font-poppins">
              My Orders
            </h2>

            {/* Tabs */}
            <div className="flex p-1 rounded-xl mb-8 overflow-x-auto w-full scrollbar-none whitespace-nowrap gap-1">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`relative py-2 text-sm sm:text-base font-semibold transition-all duration-300 text-center rounded-lg cursor-pointer border-none outline-none focus:outline-none flex-shrink-0 ${activeTab === tab
                    ? "px-6 text-white bg-[#063d32] shadow-sm"
                    : "px-4 text-gray-500 hover:text-[#063d32] hover:bg-white/60"
                    }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Orders List */}
            <div className="space-y-6">
              {loading ? (
                <OrdersSkeleton count={3} />
              ) : filteredOrders?.map((order) => (
                <div
                  key={order.orderId}
                  className="bg-white rounded-2xl p-4 md:p-6 sm:p-8 shadow-sm border border-gray-100 hover:border-emerald-800/10 hover:shadow-md transition-all duration-300"
                >
                  {/* Header Info */}
                  <div className="flex flex-col lg:flex-row justify-between gap-6 mb-6">
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                      <div>
                        <h3 className="text-lg font-bold text-[#3C4242] mb-2">Order #{order.orderId}</h3>
                        <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-[#807D7E] font-medium">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            Date: {new Date(order.createdAt).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })}
                          </span>
                          <span className="flex items-center gap-1">
                            <Truck className="w-3.5 h-3.5" />
                            Delivery: {new Date(new Date(order.createdAt).getTime() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap lg:flex-col lg:items-end gap-3 lg:gap-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-[#807D7E] font-semibold">Status:</span>
                        {getStatusBadge(order.status)}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-[#807D7E] font-semibold">Payment:</span>
                        <span className="text-xs font-bold text-gray-700 bg-gray-50 border border-gray-200/50 px-2 py-0.5 rounded-lg capitalize">{order.paymentStatus}</span>
                      </div>
                    </div>
                  </div>

                  <div className="h-px bg-gray-50 w-full mb-6"></div>

                  {/* Product/Item Preview */}
                  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 md:gap-6">
                    <div className="flex flex-wrap gap-6 flex-1 w-full">
                      {order.orderItems.map((item) => (
                        <div key={item.orderItemId} className="flex gap-4 w-full sm:w-auto">
                          <img
                            src={`${ApiURL}/assets/Products/${item.imageUrl}`}
                            alt={item.productName}
                            className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover shadow-sm transition-transform duration-300 group-hover:scale-105 border border-gray-50 flex-shrink-0"
                          />
                          <div className="flex flex-col justify-center">
                            <h4 className="font-bold text-[#3C4242] text-base mb-1 line-clamp-1">{item.productName}</h4>
                            <div className="space-y-0.5 text-xs text-[#807D7E] font-medium">
                              <p className="flex items-center gap-1.5">
                                Color :
                                {item.color_code && (
                                  <span
                                    className="w-3 h-3 rounded-full border border-gray-300"
                                    style={{ backgroundColor: item.color_code }}
                                  ></span>
                                )}
                                {item.color_name && <span className="text-gray-700 font-bold capitalize">{item.color_name}</span>}
                              </p>
                              <p>
                                Qty : <span className="text-gray-700 font-bold">{item.quantity}</span>
                              </p>
                              <p>
                                Total : <span className="text-gray-700 font-bold">₹{Math.round(item.totalAmount)}</span>
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap justify-end gap-2.5 w-full lg:w-auto lg:mt-0 pt-4 lg:pt-0 border-t lg:border-t-0 border-gray-50">
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
                            className="w-full sm:w-auto bg-white border border-red-200 text-red-600 px-4 py-2 rounded-xl font-semibold hover:bg-red-50 transition-all cursor-pointer text-sm flex items-center justify-center gap-1.5 disabled:opacity-60"
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
                          className="w-full sm:w-auto bg-white border border-[#063d32]/20 text-[#063d32] px-4 py-2 rounded-xl font-semibold hover:bg-emerald-50 transition-all cursor-pointer flex items-center justify-center gap-1.5 text-sm disabled:opacity-60"
                        >
                          {returningId === order.orderId ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : (
                            <RefreshCcw size={14} />
                          )}
                          Return Order
                        </button>
                      )}
                      {canShowInvoice(order) && (
                        <button
                          onClick={() => {
                            setSelectedOrderForInvoice(order);
                            setIsCreditNote(false);
                            setShowInvoiceModal(true);
                          }}
                          className="w-full sm:w-auto bg-white border border-emerald-200 text-emerald-600 px-4 py-2 rounded-xl font-semibold hover:bg-emerald-50 transition-all cursor-pointer flex items-center justify-center gap-1.5 text-sm"
                        >
                          <Receipt size={14} />
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
                          className="w-full sm:w-auto bg-white border border-rose-200 text-rose-600 px-4 py-2 rounded-xl font-semibold hover:bg-rose-50 transition-all cursor-pointer flex items-center justify-center gap-1.5 text-sm"
                        >
                          <ArrowLeftRight size={14} />
                          Credit Note
                        </button>
                      )}
                      <button
                        onClick={() => navigate(`/orderdetails/${order.orderId}`, { state: { activeTab } })}
                        className="w-full sm:w-auto bg-[#063d32] text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-[#12584a] transition-all cursor-pointer text-sm flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        <Eye size={14} />
                        View Detail
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {!loading && filteredOrders.length === 0 && (
                <div className="bg-white border border-dashed border-gray-200 rounded-2xl py-20 text-center shadow-sm">
                  <Package size={48} className="mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-400 font-medium text-sm">No {activeTab.toLowerCase()} orders found.</p>
                </div>
              )}
            </div>
          </ScrollReveal>
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

      <BrandBanner />
    </>
  );
};

export default Profileorder;
