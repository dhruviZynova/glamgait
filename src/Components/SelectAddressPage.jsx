import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Radio, Phone, MapPin, User, X, Check, Plus } from "lucide-react";
import toast from "react-hot-toast";
import { ApiURL, razorpayKEY, userInfo } from "../Variable";
import axiosInstance from "../Axios/axios";
import { getGuestId } from "../utils/guest";
import AddAddress from "./AddAddress";

const SelectAddressPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const user = userInfo();
    const u_id = user?.u_id;
    const guestId = getGuestId();

    // Get data from checkout page
    const { cartItems = [], formData: checkoutFormData = {} } = location.state || {};

    const [addresses, setAddresses] = useState([]);
    const [selectedAddressId, setSelectedAddressId] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState("COD");
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);

    const [showAddAddressModal, setShowAddAddressModal] = useState(false);
    const [addressType, setAddressType] = useState("HOME");

    // Calculate totals - Memoized for performance
    const subtotal = React.useMemo(() => cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0), [cartItems]);
    const taxes = React.useMemo(() => Math.round(subtotal * 0.18), [subtotal]); // 18% GST
    const deliveryFee = React.useMemo(() => subtotal > 500 ? 0 : 40, [subtotal]); // Free delivery above ₹500
    const grandTotal = React.useMemo(() => subtotal + taxes + deliveryFee, [subtotal, taxes, deliveryFee]);

    // Fetch addresses
    useEffect(() => {
        const fetchAddresses = async () => {
            try {
                const payload = u_id ? { u_id } : { guest_id: guestId };
                const res = await axiosInstance.post(`/getaddress`, payload);
                if (res.data.status === 1) {
                    const addrList = res.data.data || [];
                    setAddresses(addrList);
                    // Select default address if available
                    const defaultAddr = addrList.find(a => a.is_default === 1);
                    if (defaultAddr) {
                        setSelectedAddressId(defaultAddr.add_id);
                    } else if (addrList.length > 0) {
                        setSelectedAddressId(addrList[0].add_id);
                    }
                }
            } catch {
                console.error("Error fetching addresses:");
            }
        };

        if (u_id || guestId) {
            fetchAddresses();
        }
    }, [u_id, guestId]);

    // Refresh addresses function
    const refreshAddresses = async () => {
        try {
            const payload = u_id ? { u_id } : { guest_id: guestId };
            const res = await axiosInstance.post(`/getaddress`, payload);
            if (res.data.status === 1) {
                const addrList = res.data.data || [];
                setAddresses(addrList);
                // Select default address if available
                const defaultAddr = addrList.find(a => a.is_default === 1);
                if (defaultAddr) {
                    setSelectedAddressId(defaultAddr.add_id);
                } else if (addrList.length > 0 && !selectedAddressId) {
                    setSelectedAddressId(addrList[0].add_id);
                }
            }
        } catch {
            console.error("Error refreshing addresses:");
        }
    };

    // Load Razorpay script
    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        document.body.appendChild(script);
        return () => {
            if (document.body.contains(script)) {
                document.body.removeChild(script);
            }
        };
    }, []);

    const handlePlaceOrder = async () => {
        if (cartItems.length === 0) {
            toast.error("Your cart is empty");
            return;
        }

        setIsProcessing(true);

        try {
            let resolvedAddressId = selectedAddressId;

            // If no existing address is selected, create a new one from checkout form data
            if (!resolvedAddressId && checkoutFormData) {
                const addressPayload = {
                    first_name: checkoutFormData.firstName,
                    last_name: checkoutFormData.lastName,
                    email: checkoutFormData.email,
                    phone_number: checkoutFormData.phone,
                    address: checkoutFormData.streetAddress,
                    apartment: checkoutFormData.apartment || "",
                    city: checkoutFormData.townCity,
                    state: checkoutFormData.state || "",
                    zip_code: checkoutFormData.postcodeZip,
                    country: checkoutFormData.country || "India",
                    u_id: u_id || null,
                    guest_id: u_id ? null : guestId,
                    address_type: "Home",
                    is_default: 1
                };

                const addressRes = await axiosInstance.post(`/addaddress`, addressPayload);
                if (addressRes.data.status === 1) {
                    resolvedAddressId = addressRes.data.data.add_id;
                    setSelectedAddressId(resolvedAddressId); // Update selected address
                } else {
                    throw new Error(addressRes.data.description || "Failed to save address");
                }
            }

            // Validate we have an address ID
            if (!resolvedAddressId) {
                throw new Error("No valid address found. Please add an address.");
            }

            // Prepare order items
            const orderItems = cartItems.map((item) => ({
                p_id: item.p_id,
                pcolor_id: item.pcolor_id,
                psize_id: item.psize_id || null,
                quantity: item.quantity,
                price: item.price,
            }));

            // Create order
            const orderData = {
                u_id: u_id || null,
                guest_id: u_id ? null : guestId,
                cart_items: orderItems,
                subtotal,
                shipping: deliveryFee,
                total: grandTotal,
                address_id: resolvedAddressId,
                add_id: resolvedAddressId, // Alternative field name
                payment_method: paymentMethod.toLowerCase(),
            };

            const res = await axiosInstance.post(`/createorder`, orderData);

            if (res.data.status !== 1) {
                throw new Error(res.data.message || "Order failed");
            }

            const { order_id: newOrderId, rzp_order_id, amount } = res.data.data;


            // Handle payment
            if (paymentMethod === "online") {
                const options = {
                    key: razorpayKEY,
                    amount: amount * 100,
                    currency: "INR",
                    name: "Kundrat",
                    description: `Order #${newOrderId}`,
                    order_id: rzp_order_id,
                    handler: async (response) => {
                        try {
                            const verifyRes = await axiosInstance.post(`/verifyPayment`, {
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_signature: response.razorpay_signature,
                                order_id: newOrderId,
                            });

                            if (verifyRes.data.status === 1) {
                                toast.success("Payment successful!");
                                setShowSuccessModal(true);
                            } else {
                                toast.error("Payment verification failed");
                            }
                        } catch {
                            toast.error("Payment verification failed");
                        }
                    },
                    prefill: {
                        name: checkoutFormData.firstName ? `${checkoutFormData.firstName} ${checkoutFormData.lastName || ""}`.trim() : user?.name || "",
                        email: checkoutFormData.email || user?.email || "",
                        contact: checkoutFormData.phone || user?.phone || "",
                    },
                    theme: { color: "#1C2F2F" },
                };

                if (window.Razorpay) {
                    const rzp = new window.Razorpay(options);
                    rzp.open();
                } else {
                    toast.error("Razorpay SDK not loaded");
                }
            } else {
                toast.success("Order placed successfully!");
                setShowSuccessModal(true);
            }
        } catch (error) {
            toast.error(error.message || "Failed to place order");
            console.error(error);
        } finally {
            setIsProcessing(false);
        }
    };

    const renderAddressCard = (address, isDefault = false) => (
        <div
            key={address.add_id}
            onClick={() => setSelectedAddressId(address.add_id)}
            className={`bg-white p-4 rounded-[10px] cursor-pointer transition-all ${selectedAddressId === address.add_id
                ? "border-[#E7E5E4]"
                : "border-[#E7E5E4] hover:border-[#E7E5E4]"
                }`}
        >
            <div className="flex items-start gap-3">
                <div className="pt-1">
                    <Radio
                        checked={selectedAddressId === address.add_id}
                        className="w-5 h-5 text-[#1C2F2F]"
                    />
                </div>
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        <User size={16} className="text-gray-600" />
                        <span className="font-semibold text-gray-900">
                            {address.first_name} {address.last_name}
                        </span>
                        {isDefault && (
                            <span className="bg-[#1C2F2F] text-white text-xs px-2 py-1 rounded-full">
                                Default
                            </span>
                        )}
                    </div>
                    <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                            <MapPin size={14} />
                            <span>
                                {address.address}, {address.apartment && `${address.apartment}, `}
                                {address.city}, {address.state} - {address.zip_code}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Phone size={14} />
                            <span>{address.phone_number}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const selectedAddress = addresses.find(addr => addr.add_id === selectedAddressId);
    const otherAddresses = addresses.filter(addr => addr.add_id !== selectedAddressId);

    return (
        <div className="min-h-screen bg-[#F3F0ED] px-4 md:px-10 py-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-[#1C2F2F] mb-8 font-[Oxygen]">
                    Select Address
                </h1>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left Section - Payment and Address Selection */}
                    <div className="flex-1 space-y-6">
                        {/* Payment Method Selection - Show First */}
                        <div className="bg-white p-4 rounded-[10px] border border-[#E7E5E4]">
                            <h3 className="text-lg font-semibold text-[#1C2F2F] mb-4 font-[Oxygen]">
                                Payment Method
                            </h3>
                            <div className="space-y-3">
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="COD"
                                        checked={paymentMethod === "COD"}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        className="w-5 h-5 accent-[#1C2F2F]"
                                    />
                                    <span className="font-[Oxygen]">Cash on Delivery</span>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="online"
                                        checked={paymentMethod === "online"}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        className="w-5 h-5 accent-[#1C2F2F]"
                                    />
                                    <span className="font-[Oxygen]">Online Payment</span>
                                </label>
                            </div>
                        </div>

                        {/* Selected Address Section - Default Address */}
                        {selectedAddress && (
                            <div>
                                <h2 className="text-xl font-semibold text-[#1C2F2F] mb-4 font-[Oxygen]">
                                    Default Address
                                </h2>
                                <div className="space-y-3">
                                    {renderAddressCard(selectedAddress, true)}
                                </div>
                            </div>
                        )}

                        {/* Other Addresses Section */}
                        {otherAddresses.length > 0 && (
                            <div>
                                <h2 className="text-xl font-semibold text-[#1C2F2F] mb-4 font-[Oxygen]">
                                    Other Address
                                </h2>
                                <div className="space-y-3">
                                    {otherAddresses.map(addr => renderAddressCard(addr, false))}
                                </div>
                            </div>
                        )}

                        {/* No Addresses Message */}
                        {addresses.length === 0 && (
                            <div className="bg-white p-8 rounded-lg border border-gray-200 text-center">
                                <div className="mb-4">
                                    <div className="w-16 h-16 bg-[#F3F0ED] rounded-full flex items-center justify-center mx-auto mb-4">
                                        <MapPin size={24} className="text-[#1C2F2F]" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-[#1C2F2F] mb-2 font-[Oxygen]">
                                        No Saved Addresses
                                    </h3>
                                    <p className="text-gray-600 font-[Oxygen] mb-4">
                                        We'll use the address you provided during checkout to deliver your order.
                                    </p>
                                    {checkoutFormData && (
                                        <div className="bg-[#F3F0ED] p-4 rounded-lg text-left">
                                            <p className="font-semibold text-[#1C2F2F] mb-2 font-[Oxygen]">
                                                Delivery Address:
                                            </p>
                                            <p className="text-sm text-gray-700 font-[Oxygen]">
                                                {checkoutFormData.firstName} {checkoutFormData.lastName}<br />
                                                {checkoutFormData.streetAddress}<br />
                                                {checkoutFormData.townCity}, {checkoutFormData.state} - {checkoutFormData.postcodeZip}<br />
                                                {checkoutFormData.phone}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Add New Address Button */}
                        <button
                            onClick={() => setShowAddAddressModal(true)}
                            className="flex items-center gap-2 bg-[#1C2F2F] text-white px-4 py-3 rounded-lg hover:bg-black transition-colors font-[Oxygen] font-medium"
                        >
                            <Plus size={20} />
                            ADD NEW ADDRESS
                        </button>
                    </div>

                    {/* Right Section - Order Summary */}
                    <div className="w-full lg:w-[420px]">
                        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                            {/* Product Details */}
                            <div className="p-6">
                                <h3 className="text-lg font-semibold text-[#1C2F2F] mb-4 font-[Oxygen]">
                                    Order Summary
                                </h3>

                                {cartItems.map((item, index) => (
                                    <div key={index} className="flex gap-4 mb-6">
                                        <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                                            <img
                                                src={`${ApiURL}/assets/Products/${item.image_url || item.images?.[0]}`}
                                                alt={item.product_name}
                                                className="w-full h-full object-cover rounded-lg"
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                    e.target.parentElement.innerHTML = '<div class="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 text-xs">No Image</div>';
                                                }}
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-[#1C2F2F] font-[Oxygen]">
                                                {item.product_name}
                                            </h4>
                                            <p className="text-sm text-gray-600 font-[Oxygen]">
                                                Size: {item.size_name || 'M'} • Color: {item.color_name || 'Black'}
                                            </p>
                                            <p className="text-sm text-gray-600 font-[Oxygen]">
                                                Qty: {item.quantity}
                                            </p>
                                            <p className="font-semibold text-[#1C2F2F] mt-1 font-[Oxygen]">
                                                ₹{(item.price * item.quantity).toFixed(0)}
                                            </p>
                                        </div>
                                    </div>
                                ))}

                                {/* Price Breakdown */}
                                <div className="border-t pt-4 space-y-3">
                                    <div className="flex justify-between text-gray-600 font-[Oxygen]">
                                        <span>Subtotal</span>
                                        <span>₹{subtotal.toFixed(0)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600 font-[Oxygen]">
                                        <span>Taxes</span>
                                        <span>₹{taxes.toFixed(0)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600 font-[Oxygen]">
                                        <span>Delivery Fee</span>
                                        <span className={deliveryFee === 0 ? "text-green-600" : ""}>
                                            {deliveryFee === 0 ? "FREE" : `₹${deliveryFee.toFixed(0)}`}
                                        </span>
                                    </div>
                                    <div className="border-t pt-3">
                                        <div className="flex justify-between text-lg font-bold text-[#1C2F2F] font-[Oxygen]">
                                            <span>Grand Total</span>
                                            <span>₹{grandTotal.toFixed(0)}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Continue Button */}
                                <button
                                    onClick={handlePlaceOrder}
                                    disabled={isProcessing || cartItems.length === 0}
                                    className="w-full mt-6 bg-[#1C2F2F] text-white py-4 rounded-full font-semibold font-[Oxygen] hover:bg-black transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isProcessing && (
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    )}
                                    {paymentMethod === "online" ? "PAY NOW" : "CONTINUE"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Success Modal */}
            {showSuccessModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
                    <div
                        className="absolute inset-0 bg-[#00000040] backdrop-blur-sm"
                        onClick={() => setShowSuccessModal(false)}
                    ></div>
                    <div className="bg-white rounded-[24px] p-8 md:p-12 w-full max-w-[650px] relative z-10 shadow-xl animate-fadeIn scale-up text-center space-y-8">
                        <button
                            onClick={() => setShowSuccessModal(false)}
                            className="absolute top-6 right-6 text-[#767676] hover:text-[#000] transition-colors cursor-pointer"
                        >
                            <X size={24} />
                        </button>
                        <div className="flex justify-center">
                            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border-[3px] border-[#000] flex items-center justify-center">
                                <Check size={36} className="text-[#000]" strokeWidth={3} />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-4xl md:text-5xl font-semibold font-[Cinzel,serif] text-[#1C2F2F]">
                                Thank You!
                            </h2>
                            <p className="text-[#3D3D3D] font-[Oxygen] text-lg md:text-xl max-w-md mx-auto leading-relaxed">
                                Your Order Has Been Confirmed & It Is On The Way. Check Your Email For The Details
                            </p>
                        </div>

                        <div className="flex flex-col md:flex-row gap-4 justify-center">
                            <button
                                onClick={() => navigate("/")}
                                className="bg-[#1C2F2F] text-white px-8 py-4 rounded-full font-medium transition-all hover:bg-black active:scale-[0.98] font-[Oxygen] text-lg cursor-pointer"
                            >
                                Go to Homepage
                            </button>
                            <button
                                onClick={() => {
                                    setShowSuccessModal(false);
                                    setShowDetailsModal(true);
                                }}
                                className="border border-[#1C2F2F] text-[#1C2F2F] px-8 py-4 rounded-full font-medium transition-all hover:bg-[#1C2F2F] hover:text-white active:scale-[0.98] font-[Oxygen] text-lg cursor-pointer"
                            >
                                Check Order Details
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* Details Modal */}
            {showDetailsModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
                    <div
                        className="absolute inset-0 bg-[#00000040] backdrop-blur-sm"
                        onClick={() => setShowDetailsModal(false)}
                    ></div>
                    <div className="bg-white rounded-[24px] p-8 md:p-12 w-full max-w-[650px] relative z-10 shadow-xl animate-fadeIn scale-up text-center space-y-6">
                        <button
                            onClick={() => setShowDetailsModal(false)}
                            className="absolute top-6 right-6 text-[#767676] hover:text-[#000] transition-colors cursor-pointer"
                        >
                            <X size={24} />
                        </button>
                        <div className="flex justify-center">
                            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border-[3px] border-[#000] flex items-center justify-center">
                                <Check size={36} className="text-[#000]" strokeWidth={3} />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-4xl md:text-5xl font-semibold font-[Cinzel,serif] text-[#1C2F2F]">
                                Payment Successful
                            </h2>
                            <div className="space-y-4 text-[#3D3D3D] font-[Oxygen] text-md md:text-lg max-w-lg mx-auto leading-relaxed">
                                <p>
                                    Thank You For Choosing Kundrat, Your Order Will Be Generated Based On Your Delivery Request.
                                </p>
                                <p>
                                    The Receipt Has Been Sent To Your Email
                                </p>
                            </div>
                        </div>

                        <div className="pt-4 space-y-2">
                            <p className="text-[#767676] font-[Oxygen] font-medium uppercase tracking-widest text-sm">
                                Please Contact Us For Any Query
                            </p>
                            <div className="space-y-1 font-[Oxygen] text-[#3D3D3D]">
                                <p className="text-lg">+91 98765 43210</p>
                                <p className="uppercase text-sm">OR</p>
                                <p className="text-lg font-medium">Hello@kundrat.Com</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Address Modal */}
            {showAddAddressModal && (
                <AddAddress
                    onClose={() => setShowAddAddressModal(false)}
                    addressType={addressType}
                    setAddressType={setAddressType}
                    refreshAddresses={refreshAddresses}
                />
            )}
        </div>
    );
};

export default SelectAddressPage;
