// import React, { useState, useEffect } from "react";
// import { X, Plus, Phone } from "lucide-react";
// import { useLocation, useNavigate } from "react-router-dom";
// import AddAddress from "./AddAddress";
// import toast from "react-hot-toast";
// import { ApiURL, razorpayKEY, userInfo } from "../Variable";
// import axiosInstance from "../Axios/axios";

// const SelectAddress = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const user = userInfo();
//   const u_id = user?.u_id;

//   // Cart items from Buy Now or Cart page
//   const cartItems = location.state?.cartItems || [];

//   const [addresses, setAddresses] = useState([]);
//   const [selectedAddress, setSelectedAddress] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [subtotal, setSubtotal] = useState(0);
//   const [deliveryFee] = useState(0);
//   const [paymentMethod, setPaymentMethod] = useState("COD");
//   const [offers, setOffers] = useState([]);
//   const [coupons, setCoupons] = useState([]);
//   const [couponCode, setCouponCode] = useState("");
//   const [couponDiscount, setCouponDiscount] = useState(0);
//   const [couponApplied, setCouponApplied] = useState(false);
//   const [offerDiscount, setOfferDiscount] = useState(0);
//   const [appliedOffer, setAppliedOffer] = useState(null);
//   const [appliedCoupon, setAppliedCoupon] = useState(null);

//   // Fetch addresses
//   const fetchAddresses = async () => {
//     if (!u_id) return;
//     try {
//       const res = await axiosInstance.post(`${ApiURL}/getaddress`, { u_id });
//       setAddresses(res.data.data || []);
//       if (res.data.data?.length > 0) {
//         setSelectedAddress(res.data.data[0].add_id);
//       }
//     } catch (error) {
//       console.error("Error fetching addresses:", error);
//     }
//   };

//   useEffect(() => {
//     if (u_id) fetchAddresses();

//     // Calculate subtotal
//     if (cartItems.length > 0) {
//       const total = cartItems.reduce(
//         (sum, item) => sum + item.price * item.quantity,
//         0
//       );
//       setSubtotal(total);
//     }
//   }, [cartItems, u_id]);

//   // const grandTotal = subtotal + deliveryFee;

//   // Load Razorpay
//   useEffect(() => {
//     const script = document.createElement("script");
//     script.src = "https://checkout.razorpay.com/v1/checkout.js";
//     script.async = true;
//     document.body.appendChild(script);
//     return () => document.body.removeChild(script);
//   }, []);

//   const handleContinue = async () => {
//     if (!u_id) {
//       toast.error("Please login to continue");
//       navigate("/login");
//       return;
//     }
//     if (cartItems.length === 0) {
//       toast.error("Your cart is empty");
//       return;
//     }
//     if (!selectedAddress) {
//       toast.error("Please select or add a delivery address");
//       return;
//     }

//     const orderItems = cartItems?.map((item) => ({
//       p_id: item.p_id,
//       pcolor_id: item.pcolor_id,
//       psize_id: item.psize_id || null,
//       quantity: item.quantity,
//       price: item.price,
//     }));

//     const orderData = {
//       u_id,
//       cart_items: orderItems,
//       subtotal,
//       shipping: deliveryFee,
//       total: grandTotal,
//       address_id: selectedAddress,
//       payment_method: paymentMethod.toLowerCase(),
//     };

//     try {
//       const res = await axiosInstance.post(`${ApiURL}/createorder`, orderData);

//       if (res.data.status !== 1) {
//         toast.error(res.data.message || "Order failed");
//         return;
//       }

//       const { order_id, rzp_order_id, amount } = res.data.data;

//       if (paymentMethod === "online") {
//         const options = {
//           key: razorpayKEY,
//           amount: amount * 100,
//           currency: "INR",
//           name: "GlamGait",
//           description: `Order #${order_id}`,
//           order_id: rzp_order_id,
//           handler: async (response) => {
//             try {
//               const verifyRes = await axiosInstance.post(
//                 `${ApiURL}/verifyPayment`,
//                 {
//                   razorpay_payment_id: response.razorpay_payment_id,
//                   razorpay_order_id: response.razorpay_order_id,
//                   razorpay_signature: response.razorpay_signature,
//                   order_id,
//                 }
//               );

//               if (verifyRes.data.status === 1) {
//                 toast.success("Payment successful!");
//                 navigate("/order-confirmation", {
//                   state: { orderId: order_id },
//                 });
//               } else {
//                 toast.error("Payment failed");
//               }
//             } catch (err) {
//               toast.error("Payment verification failed");
//             }
//           },
//           prefill: {
//             name: user?.name || "",
//             email: user?.email || "",
//             contact: user?.phone || "",
//           },
//           theme: { color: "#063d32" },
//         };

//         const rzp = new window.Razorpay(options);
//         rzp.open();
//       } else {
//         toast.success("Order placed successfully!");
//         navigate("/order-confirmation", { state: { orderId: order_id } });
//       }
//     } catch (error) {
//       toast.error("Order placement failed");
//     }
//   };

//   // Auto open address modal if no address
//   useEffect(() => {
//     if (u_id && addresses.length === 0) {
//       setIsModalOpen(true);
//     }
//   }, [addresses, u_id]);

//   useEffect(() => {
//     const fetchOffersCoupons = async () => {
//       try {
//         const [offerRes, couponRes] = await Promise.all([
//           axiosInstance.post(`${ApiURL}/getoffers`),
//           axiosInstance.post(`${ApiURL}/getcoupons`),
//         ]);
//         setOffers(offerRes.data.data || []);
//         setCoupons(couponRes.data.data || []);
//       } catch (err) {
//         console.log("Error fetching offers/coupons");
//       }
//     };

//     fetchOffersCoupons();
//   }, []);

//   useEffect(() => {
//     if (couponApplied) {
//       setOfferDiscount(0);
//       setAppliedOffer(null);
//       return;
//     }

//     let bestDiscount = 0;
//     let bestOffer = null;
//     const totalQty = cartItems.reduce((s, i) => s + i.quantity, 0);

//     offers.forEach((offer) => {
//       if (!offer.is_active) return;

//       let discount = 0;

//       if (offer.offer_type === "QTY" && totalQty >= offer.min_qty) {
//         discount = (subtotal * offer.discount_percent) / 100;
//       }

//       if (offer.offer_type === "CART" && subtotal >= offer.min_amount) {
//         discount = (subtotal * offer.discount_percent) / 100;
//       }

//       if (discount > bestDiscount) {
//         bestDiscount = discount;
//         bestOffer = offer;
//       }
//     });

//     setOfferDiscount(Math.floor(bestDiscount));
//     setAppliedOffer(bestOffer);
//   }, [offers, cartItems, subtotal, couponApplied]);

//   const applyCoupon = () => {
//     if (!couponCode.trim()) return toast.error("Enter coupon code");

//     const coupon = coupons.find(
//       (c) => c.code === couponCode.toUpperCase() && c.is_active
//     );

//     if (!coupon) return toast.error("Invalid or expired coupon");

//     if (subtotal < coupon.min_amount) {
//       return console.log(`Minimum cart ₹${coupon.min_amount}`);
//     }

//     const discount = Math.floor((subtotal * coupon.discount_percent) / 100);

//     setCouponDiscount(discount);
//     setCouponApplied(true);
//     setAppliedCoupon(coupon); // 🔥 IMPORTANT
//     toast.success("Coupon applied successfully");
//   };

//   const removeCoupon = () => {
//     setCouponApplied(false);
//     setCouponCode("");
//     setCouponDiscount(0);
//     setAppliedCoupon(null);
//   };

//   const finalDiscount = couponApplied ? couponDiscount : offerDiscount;
//   const grandTotal = subtotal - finalDiscount + deliveryFee;

//   return (
//     <div className="bg-[#f3f0ed] min-h-screen px-4 md:px-10 py-10">
//       <h2 className="text-2xl font-semibold mb-6 max-w-6xl mx-auto">
//         Select Delivery Address
//       </h2>
//       <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto">
//         {/* LEFT: Addresses */}
//         <div className="flex-1 space-y-4">
//           {addresses.length > 0 ? (
//             addresses.map((addr) => (
//               <div
//                 key={addr.add_id}
//                 onClick={() => setSelectedAddress(addr.add_id)}
//                 className={`bg-white p-5 rounded-xl cursor-pointer transition-all border-2 ${
//                   selectedAddress === addr.add_id
//                     ? "border-[#063d32] shadow-md"
//                     : "border-gray-200"
//                 }`}
//               >
//                 <div className="flex gap-4">
//                   <input
//                     type="radio"
//                     checked={selectedAddress === addr.add_id}
//                     onChange={() => setSelectedAddress(addr.add_id)}
//                     className="mt-1"
//                   />
//                   <div>
//                     <div className="flex items-center gap-3">
//                       <h4 className="font-semibold">
//                         {addr.first_name} {addr.last_name}
//                       </h4>
//                       <span className="bg-[#063d32] text-white text-xs px-3 py-1 rounded-full">
//                         {addr.type || "HOME"}
//                       </span>
//                     </div>
//                     <p className="text-sm text-gray-600 mt-1">
//                       {addr.address}, {addr.city} - {addr.zip_code}
//                     </p>
//                     <p className="text-sm text-gray-600 flex items-center gap-1">
//                       <Phone size={14} /> {addr.phone_number}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             ))
//           ) : (
//             <p className="text-gray-500 text-center py-10">
//               No addresses found
//             </p>
//           )}

//           <button
//             onClick={() => setIsModalOpen(true)}
//             className="w-full border-2 border-dashed border-gray-400 rounded-xl py-4 flex items-center justify-center gap-3 hover:border-[#063d32] transition"
//           >
//             <Plus size={22} />
//             <span className="font-medium">Add New Address</span>
//           </button>
//         </div>

//         {/* RIGHT: Order Summary */}
//         <div className="bg-white rounded-2xl p-6 shadow-lg w-full lg:w-96 h-fit">
//           <h3 className="font-bold text-lg mb-4">Order Summary</h3>

//           <div className="space-y-4 max-h-96 overflow-y-auto">
//             {cartItems.map((item, i) => (
//               <div key={i} className="flex gap-4 pb-4 border-b">
//                 <img
//                   src={`${ApiURL}/assets/Products/${
//                     item.image_url || item.images?.[0]
//                   }`}
//                   alt={item.product_name}
//                   className="w-20 h-20 object-cover rounded"
//                 />
//                 <div className="flex-1">
//                   <p className="font-medium text-sm">{item.product_name}</p>
//                   <p className="text-xs text-gray-600">
//                     {item.color_name} • {item.size_name || "Free Size"}
//                   </p>
//                   <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
//                   <p className="font-semibold mt-1">
//                     ₹{(item.price * item.quantity).toFixed(2)}
//                   </p>
//                 </div>
//               </div>
//             ))}
//           </div>

//           <div className="mt-6 space-y-3">
//             <div className="flex justify-between">
//               <span>Subtotal</span>
//               <span>₹{subtotal.toFixed(2)}</span>
//             </div>
//             <div className="flex justify-between">
//               <span>Delivery</span>
//               <span className="text-green-600 font-bold">FREE</span>
//             </div>
//             <hr />
//             <div className="flex justify-between text-lg font-bold">
//               <span>Total</span>
//               <span>₹{grandTotal.toFixed(2)}</span>
//             </div>
//           </div>

//           {/* AUTO APPLIED OFFER */}
//           {!couponApplied && appliedOffer && offerDiscount > 0 && (
//             <div className="bg-green-50 border border-green-300 rounded-lg p-3 mt-3">
//               <div className="flex justify-between items-start">
//                 <div>
//                   <p className="text-sm font-semibold text-green-800">
//                     🎉 Offer Applied Automatically
//                   </p>

//                   {appliedOffer.offer_type === "QTY" && (
//                     <p className="text-xs text-green-700">
//                       Buy {appliedOffer.min_qty}+ items & get{" "}
//                       {appliedOffer.discount_percent}% OFF
//                     </p>
//                   )}

//                   {appliedOffer.offer_type === "CART" && (
//                     <p className="text-xs text-green-700">
//                       Flat {appliedOffer.discount_percent}% OFF on orders above
//                       ₹{appliedOffer.min_amount}
//                     </p>
//                   )}
//                 </div>

//                 <p className="font-semibold text-green-800">
//                   − ₹{offerDiscount}
//                 </p>
//               </div>
//             </div>
//           )}

//           {/* COUPON APPLIED */}
//           {couponApplied && appliedCoupon && (
//             <div className="bg-blue-50 border border-blue-300 rounded-lg p-3 mt-3">
//               <div className="flex justify-between items-start">
//                 <div>
//                   <p className="text-sm font-semibold text-blue-800">
//                     🎟 Coupon Applied
//                   </p>

//                   <p className="text-xs text-blue-700 mt-1">
//                     Code:&nbsp;
//                     <span className="font-mono font-semibold bg-blue-100 px-2 py-0.5 rounded">
//                       {appliedCoupon.code}
//                     </span>
//                   </p>

//                   <p className="text-xs text-blue-700">
//                     {appliedCoupon.discount_percent}% OFF on orders above ₹
//                     {appliedCoupon.min_amount}
//                   </p>
//                 </div>

//                 <div className="text-right">
//                   <p className="font-semibold text-blue-800">
//                     − ₹{couponDiscount}
//                   </p>
//                   <button
//                     onClick={removeCoupon}
//                     className="text-xs text-red-500 hover:underline mt-1"
//                   >
//                     Remove
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* COUPON */}
//           <div className="mt-4">
//             {!couponApplied ? (
//               <div className="flex gap-2">
//                 <input
//                   value={couponCode}
//                   onChange={(e) => setCouponCode(e.target.value)}
//                   placeholder="Coupon code"
//                   className="border p-2 rounded w-full"
//                 />
//                 <button
//                   onClick={applyCoupon}
//                   className="bg-[#063d32] text-white px-4 rounded"
//                 >
//                   Apply
//                 </button>
//               </div>
//             ) : (
//               <button
//                 onClick={removeCoupon}
//                 className="text-red-500 text-sm mt-2"
//               >
//                 Remove Coupon
//               </button>
//             )}
//           </div>

//           {/* Payment Method */}
//           <div className="mt-6">
//             <h4 className="font-semibold mb-3">Payment Method</h4>
//             <div className="space-y-3">
//               <label className="flex items-center gap-3 cursor-pointer">
//                 <input
//                   type="radio"
//                   name="payment"
//                   value="COD"
//                   checked={paymentMethod === "COD"}
//                   onChange={(e) => setPaymentMethod(e.target.value)}
//                   className="w-5 h-5 accent-[#063d32]"
//                 />
//                 <span>Cash on Delivery</span>
//               </label>
//               {/* <label className="flex items-center gap-3 cursor-pointer">
//                 <input
//                   type="radio"
//                   name="payment"
//                   value="online"
//                   checked={paymentMethod === "online"}
//                   onChange={(e) => setPaymentMethod(e.target.value)}
//                   className="w-5 h-5 accent-[#063d32]"
//                 />
//                 <span>Online Payment (Razorpay)</span>
//               </label> */}
//             </div>
//           </div>

//           <button
//             onClick={handleContinue}
//             disabled={!selectedAddress}
//             className="w-full mt-8 bg-[#063d32] text-white py-4 rounded-xl font-bold hover:bg-[#052d25] transition disabled:opacity-50"
//           >
//             {paymentMethod === "online" ? "PAY NOW" : "PLACE ORDER"}
//           </button>
//         </div>
//       </div>

//       {/* Add Address Modal */}
//       {isModalOpen && (
//         <AddAddress
//           onClose={() => {
//             setIsModalOpen(false);
//             fetchAddresses();
//           }}
//           refreshAddresses={fetchAddresses}
//         />
//       )}
//     </div>
//   );
// };

// export default SelectAddress;

import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { ApiURL, razorpayKEY, userInfo } from "../Variable";
import axiosInstance from "../Axios/axios";
import axios from "axios";
import { getGuestId } from "../utils/guest";

const SelectAddress = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = userInfo();
  const u_id = user?.u_id;
  const guestId = getGuestId();

  // Cart items from Buy Now or Cart page
  const cartItems = location.state?.cartItems || [];

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    address: "",
    apartment: "",
    city: "",
    state: "",
    zip_code: "",
  });
  const [addressType, setAddressType] = useState("HOME");
  const [pincodeLoading, setPincodeLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [subtotal, setSubtotal] = useState(0);
  const [deliveryFee] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [offers, setOffers] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [couponCode, setCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const [offerDiscount, setOfferDiscount] = useState(0);
  const [appliedOffer, setAppliedOffer] = useState(null);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [onlineDiscount, setOnlineDiscount] = useState(0);

  useEffect(() => {
    if (cartItems.length > 0) {
      const total = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      );
      setSubtotal(total);
    }
  }, [cartItems]);

  // Pincode auto-fill
  const fetchCityState = async (pincode) => {
    if (!pincode || pincode.length !== 6) return;
    setPincodeLoading(true);
    try {
      const response = await axios.get(
        `https://api.postalpincode.in/pincode/${pincode}`,
      );
      const data = response.data[0];
      if (data.Status === "Success" && data.PostOffice?.length > 0) {
        const { District, State } = data.PostOffice[0];
        setFormData((prev) => ({
          ...prev,
          city: District || "",
          state: State || "",
        }));
        toast.success("Location auto-filled!");
      } else {
        toast.error("Invalid PIN code");
      }
    } catch (err) {
      toast.error("Failed to fetch location");
    } finally {
      setPincodeLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "zip_code") {
      if (/^\d*$/.test(value) && value.length <= 6) {
        setFormData({ ...formData, [name]: value });
        if (value.length === 6) fetchCityState(value);
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  useEffect(() => {
    if (paymentMethod === "online") {
      const discount = Math.floor(subtotal * 0.1);
      setOnlineDiscount(discount);
    } else {
      setOnlineDiscount(0);
    }
  }, [subtotal, paymentMethod]);

  // Final calculations - all discounts combined
  const totalDiscount = couponDiscount + offerDiscount + onlineDiscount;
  const grandTotal = Math.max(0, subtotal - totalDiscount + deliveryFee);

  // Load Razorpay
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => document.body.removeChild(script);
  }, []);

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    // Form validation
    if (
      !formData.first_name?.trim() ||
      !formData.phone_number?.trim() ||
      !formData.address?.trim() ||
      !formData.zip_code ||
      formData.zip_code.length !== 6 ||
      !formData.city ||
      !formData.state
    ) {
      toast.error("Please fill all required address fields");
      return;
    }

    setIsProcessing(true);

    try {
      // 1. Save address - guest ya logged-in ke hisab se
      const addressPayload = {
        ...formData,
        u_id: u_id || null,
        guest_id: u_id ? null : guestId, // ← Important for guest
        address_type: addressType,
      };

      const addressRes = await axiosInstance.post(
        `${ApiURL}/addaddress`,
        addressPayload,
      );

      if (addressRes.data.status !== 1) {
        throw new Error(
          addressRes.data.description || "Failed to save address",
        );
      }

      // 2. Prepare order items
      const orderItems = cartItems.map((item) => ({
        p_id: item.p_id,
        pcolor_id: item.pcolor_id,
        psize_id: item.psize_id || null,
        quantity: item.quantity,
        price: item.price,
      }));

      // 3. Create order - guest_id bhejo if no u_id
      const orderData = {
        u_id: u_id || null,
        guest_id: u_id ? null : guestId,
        cart_items: orderItems,
        subtotal,
        shipping: deliveryFee,
        total: grandTotal,
        payment_method: paymentMethod.toLowerCase(),
      };

      const orderRes = await axiosInstance.post(
        `${ApiURL}/createorder`,
        orderData,
      );

      if (orderRes.data.status !== 1) {
        throw new Error(orderRes.data.message || "Order failed");
      }

      const { order_id, rzp_order_id, amount } = orderRes.data.data;

      // 4. Payment flow
      if (paymentMethod === "online") {
        const options = {
          key: razorpayKEY,
          amount: amount * 100,
          currency: "INR",
          name: "GlamGait",
          description: `Order #${order_id}`,
          order_id: rzp_order_id,
          handler: async (response) => {
            try {
              const verifyRes = await axiosInstance.post(
                `${ApiURL}/verifyPayment`,
                {
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_signature: response.razorpay_signature,
                  order_id,
                },
              );

              if (verifyRes.data.status === 1) {
                toast.success("Payment successful!");
                navigate("/order-confirmation", {
                  state: { orderId: order_id },
                });
              } else {
                toast.error("Payment failed");
              }
            } catch (err) {
              toast.error("Payment verification failed");
            }
          },
          prefill: {
            name: formData.first_name + " " + (formData.last_name || ""),
            email: formData.email || "",
            contact: formData.phone_number || "",
          },
          theme: { color: "#063d32" },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        toast.success("Order placed successfully!");
        navigate("/order-confirmation", { state: { orderId: order_id } });
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong");
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    const fetchOffersCoupons = async () => {
      try {
        const [offerRes, couponRes] = await Promise.all([
          axiosInstance.post(`${ApiURL}/getoffers`),
          axiosInstance.post(`${ApiURL}/getcoupons`),
        ]);
        setOffers(offerRes.data.data || []);
        setCoupons(couponRes.data.data || []);
      } catch (err) {
        console.log("Error fetching offers/coupons");
      }
    };

    fetchOffersCoupons();
  }, []);

  useEffect(() => {
    if (couponApplied) {
      setOfferDiscount(0);
      setAppliedOffer(null);
      return;
    }

    let bestDiscount = 0;
    let bestOffer = null;
    const totalQty = cartItems.reduce((s, i) => s + i.quantity, 0);

    offers.forEach((offer) => {
      if (!offer.is_active) return;

      let discount = 0;

      if (offer.offer_type === "QTY" && totalQty >= offer.min_qty) {
        discount = (subtotal * offer.discount_percent) / 100;
      }

      if (offer.offer_type === "CART" && subtotal >= offer.min_amount) {
        discount = (subtotal * offer.discount_percent) / 100;
      }

      if (discount > bestDiscount) {
        bestDiscount = discount;
        bestOffer = offer;
      }
    });

    setOfferDiscount(Math.floor(bestDiscount));
    setAppliedOffer(bestOffer);
  }, [offers, cartItems, subtotal, couponApplied]);

  const applyCoupon = () => {
    if (!couponCode.trim()) return toast.error("Enter coupon code");

    const coupon = coupons.find(
      (c) => c.code === couponCode.toUpperCase() && c.is_active,
    );

    if (!coupon) return toast.error("Invalid or expired coupon");

    if (subtotal < coupon.min_amount) {
      return console.log(`Minimum cart ₹${coupon.min_amount}`);
    }

    const discount = Math.floor((subtotal * coupon.discount_percent) / 100);

    setCouponDiscount(discount);
    setCouponApplied(true);
    setAppliedCoupon(coupon); // 🔥 IMPORTANT
    toast.success("Coupon applied successfully");
  };

  const removeCoupon = () => {
    setCouponApplied(false);
    setCouponCode("");
    setCouponDiscount(0);
    setAppliedCoupon(null);
  };

  useEffect(() => {
    window.dataLayer.push({
      event: "initiate_checkout",
      value: grandTotal,
      currency: "INR",
    });
  }, []);

  return (
    <div className="bg-[#f3f0ed] min-h-screen px-4 md:px-10 py-10">
      <h2 className="text-2xl font-semibold mb-6 max-w-6xl mx-auto">
        Delivery Address
      </h2>
      <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto">
        {/* LEFT: Addresses */}
        <div className="flex-1">
          <div className="bg-white p-6 rounded-2xl shadow">
            <form className="space-y-4">
              <div className="flex gap-2">
                <input
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  placeholder="First Name *"
                  required
                  className="w-1/2 px-4 py-3 border rounded-lg focus:outline-none focus:border-[#063d32]"
                />
                <input
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  placeholder="Last Name"
                  className="w-1/2 px-4 py-3 border rounded-lg focus:outline-none focus:border-[#063d32]"
                />
              </div>

              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email (Optional)"
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-[#063d32]"
              />

              <input
                name="phone_number"
                type="tel"
                value={formData.phone_number}
                onChange={handleChange}
                placeholder="Phone Number *"
                required
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-[#063d32]"
              />

              <input
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="flat, house no, floor, building*"
                required
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-[#063d32]"
              />

              <input
                name="apartment"
                value={formData.apartment}
                onChange={handleChange}
                placeholder="area ,street, sector, village"
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-[#063d32]"
              />

              <div className="relative">
                <input
                  name="zip_code"
                  value={formData.zip_code}
                  onChange={handleChange}
                  placeholder="PIN Code (6 digits) *"
                  required
                  maxLength={6}
                  className="w-full px-4 py-3 border rounded-lg pr-10 focus:outline-none focus:border-[#063d32]"
                />
                {pincodeLoading && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <div className="w-5 h-5 border-2 border-t-transparent border-[#063d32] rounded-full animate-spin"></div>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <input
                  name="state"
                  value={formData.state}
                  readOnly
                  placeholder="State"
                  className="w-1/2 px-4 py-3 border bg-gray-50 cursor-not-allowed rounded-lg"
                />
                <input
                  name="city"
                  value={formData.city}
                  readOnly
                  placeholder="City"
                  className="w-1/2 px-4 py-3 border bg-gray-50 cursor-not-allowed rounded-lg"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setAddressType("HOME")}
                  className={`flex-1 py-2 rounded-md font-medium ${
                    addressType === "HOME"
                      ? "bg-[#063d32] text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  HOME
                </button>
                <button
                  type="button"
                  onClick={() => setAddressType("WORK")}
                  className={`flex-1 py-2 rounded-md font-medium ${
                    addressType === "WORK"
                      ? "bg-[#063d32] text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  WORK
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* RIGHT: Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl p-6 shadow-lg w-full lg:w-96 h-fit">
            <h3 className="font-bold text-lg mb-4">Order Summary</h3>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {cartItems.map((item, i) => (
                <div key={i} className="flex gap-4 pb-4 border-b">
                  <img
                    src={`${ApiURL}/assets/Products/${
                      item.image_url || item.images?.[0]
                    }`}
                    alt={item.product_name}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{item.product_name}</p>
                    <p className="text-xs text-gray-600">
                      {item.color_name} • {item.size_name || "Free Size"}
                    </p>
                    <p className="text-xs text-gray-600">
                      Qty: {item.quantity}
                    </p>
                    <p className="font-semibold mt-1">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-3">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery</span>
                <span className="text-green-600 font-bold">FREE</span>
              </div>
              <hr />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>₹{grandTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* AUTO APPLIED OFFER */}
            {!couponApplied && appliedOffer && offerDiscount > 0 && (
              <div className="bg-green-50 border border-green-300 rounded-lg p-3 mt-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-semibold text-green-800">
                      🎉 Offer Applied Automatically
                    </p>

                    {appliedOffer.offer_type === "QTY" && (
                      <p className="text-xs text-green-700">
                        Buy {appliedOffer.min_qty}+ items & get{" "}
                        {appliedOffer.discount_percent}% OFF
                      </p>
                    )}

                    {appliedOffer.offer_type === "CART" && (
                      <p className="text-xs text-green-700">
                        Flat {appliedOffer.discount_percent}% OFF on orders
                        above ₹{appliedOffer.min_amount}
                      </p>
                    )}
                  </div>

                  <p className="font-semibold text-green-800">
                    − ₹{offerDiscount}
                  </p>
                </div>
              </div>
            )}

            {/* COUPON APPLIED */}
            {couponApplied && appliedCoupon && (
              <div className="bg-blue-50 border border-blue-300 rounded-lg p-3 mt-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-semibold text-blue-800">
                      🎟 Coupon Applied
                    </p>

                    <p className="text-xs text-blue-700 mt-1">
                      Code:&nbsp;
                      <span className="font-mono font-semibold bg-blue-100 px-2 py-0.5 rounded">
                        {appliedCoupon.code}
                      </span>
                    </p>

                    <p className="text-xs text-blue-700">
                      {appliedCoupon.discount_percent}% OFF on orders above ₹
                      {appliedCoupon.min_amount}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="font-semibold text-blue-800">
                      − ₹{couponDiscount}
                    </p>
                    <button
                      onClick={removeCoupon}
                      className="text-xs text-red-500 hover:underline mt-1"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* COUPON */}
            <div className="mt-4">
              {!couponApplied ? (
                <div className="flex gap-2">
                  <input
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Coupon code"
                    className="border p-2 rounded w-full"
                  />
                  <button
                    onClick={applyCoupon}
                    className="bg-[#063d32] text-white px-4 rounded"
                  >
                    Apply
                  </button>
                </div>
              ) : (
                <button
                  onClick={removeCoupon}
                  className="text-red-500 text-sm mt-2"
                >
                  Remove Coupon
                </button>
              )}
            </div>

            {/* Payment Method */}
            <div className="mt-6">
              <h4 className="font-semibold mb-3">Payment Method</h4>
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    value="COD"
                    checked={paymentMethod === "COD"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-5 h-5 accent-[#063d32]"
                  />
                  <span>Cash on Delivery</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer relative">
                  <input
                    type="radio"
                    name="payment"
                    value="online"
                    checked={paymentMethod === "online"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-5 h-5 accent-[#063d32]"
                  />
                  <div className="flex items-center gap-2">
                    <span>Online Payment</span>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                      10% OFF
                    </span>
                  </div>
                </label>
              </div>
            </div>
            <div className="mt-4 p-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl text-center">
              <p className="text-sm font-medium text-green-800">
                Choose Online Payment and get <strong>10% OFF</strong>{" "}
                instantly!
              </p>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={isProcessing}
              className="w-full mt-8 bg-[#063d32] text-white py-4 rounded-xl font-bold hover:bg-[#052d25] transition disabled:opacity-50"
            >
              {paymentMethod === "online"
                ? "PAY NOW (10% OFF Applied)"
                : "PLACE ORDER"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectAddress;
