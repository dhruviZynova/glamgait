import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import img from "../assets/Order-Confirm.png";
import axiosInstance from "../Axios/axios";
import { ApiURL } from "../Variable";

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const orderId = location.state?.orderId;
  const [order, setOrder] = useState(null);

  // Fetch Order Details
  useEffect(() => {
    if (!orderId) return;

    const fetchOrder = async () => {
      try {
        const res = await axiosInstance.get(`${ApiURL}/getorder/${orderId}`);

        if (res.data.status === 1) {
          setOrder(res.data.data);
        }
      } catch (err) {
        console.error("Error fetching order:", err);
      }
    };

    fetchOrder();
  }, [orderId]);

  //Fire purchase event
  useEffect(() => {
    if (!order) return;

    window.dataLayer = window.dataLayer || [];

    window.dataLayer.push({
      event: "purchase",
      transaction_id: order.orderId,
      value: order.grandTotal,
      currency: "INR",
      content_ids: order.orderItems.map((item) => item.orderItemId),
      content_name: order.orderItems.map((item) => item.productName),
      contents: order.orderItems.map((item) => ({
        id: item.orderItemId,
        name: item.productName,
        quantity: item.quantity,
        price: item.price,
      })),
    });
  }, [order]);

  // UI
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f3f0ed] px-4">
      <div className="w-full max-w-md text-center">
        <img src={img} alt="" />
        <h1 className="text-4xl font-semibold my-5">Thank You!</h1>
        <p className="text-gray-600 mb-6">
          Your order {orderId ? `#${orderId}` : ""} is Confirmed !
        </p>

        {orderId && (
          <p className="text-sm text-gray-500 mb-6">
            You can track your order in your profile or check your email for
            order details.
          </p>
        )}

        <button
          onClick={() => navigate("/")}
          className="bg-[#063d32] text-white py-3 px-6 rounded-md hover:bg-[#052d25] transition"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
};

export default OrderConfirmation;
