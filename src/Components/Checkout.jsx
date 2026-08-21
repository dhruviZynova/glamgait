import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Check, X, Loader2, ChevronDown } from "lucide-react";
import { ApiURL, userInfo } from "../Variable";
import axiosInstance from "../Axios/axios";
import toast from "react-hot-toast";
import { getGuestId } from "../utils/guest";
import BrandBanner from "./BrandBanner";
import ScrollReveal from "./Ui/ScrollReveal";
import { useQueryClient } from "@tanstack/react-query";
import OfferList from "./OfferList";
import CouponList from "./CouponList";

const Checkout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { cartItems = [], guestId: stateGuestId } = location.state || {};
    const queryClient = useQueryClient();

    const [currentStep, setCurrentStep] = useState(1); // 1: Personal, 2: Billing, 3: Confirmation
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [addresses, setAddresses] = useState([]);
    const [selectedAddressId, setSelectedAddressId] = useState(null);
    const [isAddressDropdownOpen, setIsAddressDropdownOpen] = useState(false);
    const addressDropdownRef = useRef(null);
    const isPlacingOrderRef = useRef(false);

    // Offers and coupons states
    const [offers, setOffers] = useState([]);
    const [coupons, setCoupons] = useState([]);
    const [couponCode, setCouponCode] = useState("");
    const [couponDiscount, setCouponDiscount] = useState(0);
    const [couponApplied, setCouponApplied] = useState(false);
    const [offerDiscount, setOfferDiscount] = useState(0);
    const [appliedOffer, setAppliedOffer] = useState(null);
    const [appliedCoupon, setAppliedCoupon] = useState(null);

    const user = userInfo();
    const u_id = user?.u_id;
    const guestId = stateGuestId || getGuestId();

    // Fetch offers and coupons
    useEffect(() => {
        const fetchOffersCoupons = async () => {
            try {
                const [offerRes, couponRes] = await Promise.all([
                    axiosInstance.post(`/getoffers`),
                    axiosInstance.post(`/getcoupons`),
                ]);
                setOffers(offerRes.data.data || []);
                setCoupons(couponRes.data.data || []);
            } catch (err) {
                console.error("Error fetching offers/coupons:", err);
            }
        };
        fetchOffersCoupons();
    }, []);

    const [formData, setFormData] = useState({
        // Personal fields
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        streetAddress: "",
        apartment: "",
        townCity: "",
        state: "",
        country: "India",
        postcodeZip: "",
        // Billing fields
        cardName: "",
        cardNumber: "",
        validThrough: "",
        cvv: "",
        saveAsDefault: false,
        paymentMethod: "COD", // Default to COD
    });

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (name === "phone") {
            if (!/^\d*$/.test(value) || value.length > 10) {
                return;
            }
        }
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    // Fetch addresses on mount
    useEffect(() => {
        const fetchAddresses = async () => {
            try {
                const payload = u_id ? { u_id } : { guest_id: guestId };
                const res = await axiosInstance.post(`/getaddress`, payload);
                if (res.data.status === 1) {
                    const addrList = res.data.data || [];
                    setAddresses(addrList);
                    if (addrList.length > 0) {
                        // Pre-fill with default or first address
                        const defaultAddr = addrList.find(a => a.is_default === 1) || addrList[0];
                        fillFormFromAddress(defaultAddr);
                    }
                }
            } catch (err) {
                console.error("Error fetching addresses:", err);
            }
        };

        fetchAddresses();
    }, [u_id, guestId]);

    // Close address dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (addressDropdownRef.current && !addressDropdownRef.current.contains(event.target)) {
                setIsAddressDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const fillFormFromAddress = (addr) => {
        setSelectedAddressId(addr.add_id);
        setFormData(prev => ({
            ...prev,
            firstName: addr.first_name || "",
            lastName: addr.last_name || "",
            email: addr.email || "",
            phone: addr.phone_number || "",
            streetAddress: addr.address || "",
            apartment: addr.apartment || "",
            townCity: addr.city || "",
            state: addr.state || "",
            postcodeZip: addr.zip_code || "",
            country: "India"
        }));
    };

    const subtotal = React.useMemo(() => cartItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
    ), [cartItems]);

    // Evaluate auto-applied offers
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

        setOfferDiscount(Math.round(bestDiscount));
        setAppliedOffer(bestOffer);
    }, [offers, cartItems, subtotal, couponApplied]);

    const applyCoupon = () => {
        if (!couponCode.trim()) return toast.error("Enter coupon code");

        const coupon = coupons.find(
            (c) => c.code === couponCode.toUpperCase() && c.is_active,
        );

        if (!coupon) return toast.error("Invalid or expired coupon");

        if (subtotal < coupon.min_amount) {
            return toast.error(`Minimum cart ₹${coupon.min_amount}`);
        }

        const discount = Math.round((subtotal * coupon.discount_percent) / 100);

        setCouponDiscount(discount);
        setCouponApplied(true);
        setAppliedCoupon(coupon);
        toast.success("Coupon applied successfully");
    };

    const removeCoupon = () => {
        setCouponApplied(false);
        setCouponCode("");
        setCouponDiscount(0);
        setAppliedCoupon(null);
    };

    const shipping = location.state?.shippingCharge || 0;
    const totalDiscount = couponDiscount + offerDiscount;
    const total = React.useMemo(() => Math.max(0, subtotal - totalDiscount + shipping), [subtotal, totalDiscount, shipping]);

    const steps = [
        { id: 1, name: "Personal" },
        { id: 2, name: "Billing" },
        { id: 3, name: "Confirmation" },
    ];

    const renderPersonalFields = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
            {addresses.length > 0 && (
                <div className="md:col-span-2 space-y-2 mb-4">
                    <label className="block text-[#3D3D3D] font-[Oxygen] text-sm md:text-base font-semibold">Select Saved Address</label>
                    <div className="relative w-full" ref={addressDropdownRef}>
                        <button
                            type="button"
                            onClick={() => setIsAddressDropdownOpen(!isAddressDropdownOpen)}
                            className="flex items-center justify-between w-full bg-[#f9f9f9a1] border border-[#E9E9E9] rounded-[8px] px-4 py-3 text-sm text-[#3D3D3D] font-[Oxygen] cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#1C2F2F]"
                        >
                            <span>
                                {(() => {
                                    const addr = addresses.find(a => a.add_id === selectedAddressId);
                                    return addr ? `${addr.address}, ${addr.city} (${addr.first_name})` : "-- Select an address --";
                                })()}
                            </span>
                            <ChevronDown
                                className={`w-4 h-4 transition-transform duration-200 ${isAddressDropdownOpen ? "rotate-180 text-[#23403b]" : ""
                                    }`}
                            />
                        </button>

                        {isAddressDropdownOpen && (
                            <div className="absolute left-0 w-full mt-1 bg-white rounded-xl shadow-xl border border-gray-100 overflow-y-auto max-h-60 z-[100] transform origin-top transition-all duration-200">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSelectedAddressId(null);
                                        setIsAddressDropdownOpen(false);
                                    }}
                                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors cursor-pointer flex items-center justify-between font-[Oxygen] ${!selectedAddressId
                                        ? "bg-[#23403b]/10 text-[#23403b] font-semibold"
                                        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                                        }`}
                                >
                                    <span>-- Select an address --</span>
                                    {!selectedAddressId && (
                                        <svg
                                            className="w-4 h-4 text-[#23403b]"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2.5"
                                                d="M5 13l4 4L19 7"
                                            />
                                        </svg>
                                    )}
                                </button>
                                {addresses.map((addr) => {
                                    const isSelected = addr.add_id === selectedAddressId;
                                    return (
                                        <button
                                            key={addr.add_id}
                                            type="button"
                                            onClick={() => {
                                                fillFormFromAddress(addr);
                                                setIsAddressDropdownOpen(false);
                                            }}
                                            className={`w-full text-left px-4 py-2.5 text-sm transition-colors cursor-pointer flex items-center justify-between font-[Oxygen] ${isSelected
                                                ? "bg-[#23403b]/10 text-[#23403b] font-semibold"
                                                : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                                                }`}
                                        >
                                            <span>
                                                {addr.address}, {addr.city} ({addr.first_name})
                                            </span>
                                            {isSelected && (
                                                <svg
                                                    className="w-4 h-4 text-[#23403b]"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2.5"
                                                        d="M5 13l4 4L19 7"
                                                    />
                                                </svg>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            )}
            <div className="space-y-2">
                <label className="block text-[#3D3D3D] font-[Oxygen] text-sm md:text-base">First Name*</label>
                <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full bg-[#f9f9f9a1] border border-[#E9E9E9] rounded-[8px] px-4 py-3 focus:outline-none font-[Oxygen]"
                />
            </div>
            <div className="space-y-2">
                <label className="block text-[#3D3D3D] font-[Oxygen] text-sm md:text-base">Last Name*</label>
                <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full bg-[#f9f9f9a1] border border-[#E9E9E9] rounded-[8px] px-4 py-3 focus:outline-none font-[Oxygen]"
                />
            </div>
            <div className="space-y-2">
                <label className="block text-[#3D3D3D] font-[Oxygen] text-sm md:text-base">Email Address*</label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full bg-[#f9f9f9a1] border border-[#E9E9E9] rounded-[8px] px-4 py-3 focus:outline-none font-[Oxygen]"
                />
            </div>
            <div className="space-y-2">
                <label className="block text-[#3D3D3D] font-[Oxygen] text-sm md:text-base">Phone Number*</label>
                <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full bg-[#f9f9f9a1] border border-[#E9E9E9] rounded-[8px] px-4 py-3 focus:outline-none font-[Oxygen]"
                />
            </div>
            <div className="md:col-span-2 space-y-2">
                <label className="block text-[#3D3D3D] font-[Oxygen] text-sm md:text-base">Street Address*</label>
                <input
                    type="text"
                    name="streetAddress"
                    value={formData.streetAddress}
                    onChange={handleInputChange}
                    className="w-full bg-[#f9f9f9a1] border border-[#E9E9E9] rounded-[8px] px-4 py-3 focus:outline-none font-[Oxygen]"
                />
            </div>
            <div className="space-y-2">
                <label className="block text-[#3D3D3D] font-[Oxygen] text-sm md:text-base">Town / City*</label>
                <input
                    type="text"
                    name="townCity"
                    value={formData.townCity}
                    onChange={handleInputChange}
                    className="w-full bg-[#f9f9f9a1] border border-[#E9E9E9] rounded-[8px] px-4 py-3 focus:outline-none font-[Oxygen]"
                />
            </div>
            <div className="space-y-2">
                <label className="block text-[#3D3D3D] font-[Oxygen] text-sm md:text-base">State*</label>
                <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full bg-[#f9f9f9a1] border border-[#E9E9E9] rounded-[8px] px-4 py-3 focus:outline-none font-[Oxygen]"
                />
            </div>
            <div className="space-y-2">
                <label className="block text-[#3D3D3D] font-[Oxygen] text-sm md:text-base">Country*</label>
                <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full bg-[#f9f9f9a1] border border-[#E9E9E9] rounded-[8px] px-4 py-3 focus:outline-none font-[Oxygen]"
                />
            </div>
            <div className="space-y-2">
                <label className="block text-[#3D3D3D] font-[Oxygen] text-sm md:text-base">Postcode / Zip*</label>
                <input
                    type="text"
                    name="postcodeZip"
                    value={formData.postcodeZip}
                    onChange={handleInputChange}
                    className="w-full bg-[#f9f9f9a1] border border-[#E9E9E9] rounded-[8px] px-4 py-3 focus:outline-none font-[Oxygen]"
                />
            </div>
        </div>
    );

    const renderBillingFields = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
            <div className="md:col-span-2 space-y-3 mb-4">
                <label className="block text-[#3D3D3D] font-[Oxygen] text-sm md:text-base font-semibold">Payment Method</label>
                <div className="flex gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="radio"
                            name="paymentMethod"
                            value="COD"
                            checked={formData.paymentMethod === "COD"}
                            onChange={handleInputChange}
                            className="w-5 h-5 accent-[#1C2F2F]"
                        />
                        <span className="font-[Oxygen]">Cash on Delivery</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="radio"
                            name="paymentMethod"
                            value="online"
                            checked={formData.paymentMethod === "online"}
                            onChange={handleInputChange}
                            className="w-5 h-5 accent-[#1C2F2F]"
                        />
                        <span className="font-[Oxygen]">Online Payment</span>
                    </label>
                </div>
            </div>

            {formData.paymentMethod === "online" && (
                <div className="md:col-span-2 p-6 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-800 font-[Oxygen]">You have selected Online Payment. You will be redirected to the payment gateway to complete your transaction securely after clicking "Place Order".</p>
                </div>
            )}
            {formData.paymentMethod === "COD" && (
                <div className="md:col-span-2 p-6 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-blue-800 font-[Oxygen]">You have selected Cash on Delivery. You can review your details in the next step.</p>
                </div>
            )}
        </div>
    );

    const renderConfirmationStep = () => (
        <div className="space-y-8 animate-fadeIn">
            <div className="bg-[#f9f9f9a1] p-4 md:p-6 rounded-[8px] border border-[#E9E9E9]">
                <h3 className="text-lg font-medium text-[#1C2F2F] font-[Oxygen] mb-4">Order Summary</h3>
                <div className="space-y-3">
                    <div className="flex justify-between text-[#3D3D3D] font-[Oxygen]">
                        <span>Shipping To:</span>
                        <span className="font-medium">{formData.firstName} {formData.lastName}</span>
                    </div>
                    <p className="text-sm text-[#767676] font-[Oxygen] text-right">
                        {formData.streetAddress}, {formData.townCity}<br />
                        {formData.state}, {formData.country} - {formData.postcodeZip}
                    </p>
                    <div className="border-t border-dashed border-[#d7d4d4] my-4"></div>
                    <div className="flex justify-between text-[#3D3D3D] font-[Oxygen]">
                        <span>Payment Method:</span>
                        <span className="font-medium">
                            {formData.paymentMethod === "COD" ? "Cash on Delivery" : "Online Payment"}
                        </span>
                    </div>
                </div>
            </div>
            <div className="text-center">
                <p className="text-[#3D3D3D] font-[Oxygen]">Please review your details before placing the order.</p>
            </div>
        </div>
    );

    const handleNext = async () => {
        if (currentStep === 1) {
            // Validate Personal Fields
            if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.streetAddress || !formData.townCity || !formData.postcodeZip) {
                toast.error("Please fill all required fields");
                return;
            }

            // Validate email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                toast.error("Please enter a valid email address");
                return;
            }

            // Validate phone number (exactly 10 digits, starts with 6, 7, 8, or 9)
            const phoneRegex = /^[6-9]\d{9}$/;
            if (!phoneRegex.test(formData.phone)) {
                toast.error("Please enter a valid 10-digit phone number starting with 6, 7, 8, or 9");
                return;
            }

            // If an existing address is already selected, skip saving and proceed
            if (selectedAddressId) {
                setCurrentStep(2);
                return;
            }

            setIsProcessing(true);
            try {
                // Save new Address
                const addressPayload = {
                    first_name: formData.firstName,
                    last_name: formData.lastName,
                    email: formData.email,
                    phone_number: formData.phone,
                    address: formData.streetAddress,
                    apartment: formData.apartment || "",
                    city: formData.townCity,
                    state: formData.state || "",
                    zip_code: formData.postcodeZip,
                    country: formData.country,
                    u_id: u_id || null,
                    guest_id: u_id ? null : guestId,
                    address_type: "Home",
                    is_default: 1
                };

                const res = await axiosInstance.post(`/addaddress`, addressPayload);
                if (res.data.status === 1) {
                    setSelectedAddressId(res.data.data.add_id);
                    setCurrentStep(2);
                } else {
                    toast.error(res.data.description || "Failed to save address");
                }
            } catch (err) {
                toast.error("Error saving address");
                console.error(err);
            } finally {
                setIsProcessing(false);
            }
        } else if (currentStep === 2) {
            setCurrentStep(3);
        } else {
            // Step 3: Place Order
            handlePlaceOrder();
        }
    };

    const handlePlaceOrder = async () => {
        // Validate form data before redirecting
        if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone ||
            !formData.streetAddress || !formData.townCity || !formData.postcodeZip) {
            toast.error("Please fill all required fields");
            return;
        }

        if (!selectedAddressId) {
            toast.error("Please select or save an address first.");
            return;
        }

        if (isPlacingOrderRef.current) return;
        isPlacingOrderRef.current = true;
        setIsProcessing(true);
        try {
            const orderItems = cartItems.map((item) => ({
                p_id: item.p_id,
                pcolor_id: item.pcolor_id,
                psize_id: item.psize_id || null,
                quantity: item.quantity,
                price: item.price,
            }));

            const orderData = {
                u_id: u_id || null,
                guest_id: u_id ? null : guestId,
                cart_items: orderItems,
                subtotal,
                shipping: shipping,
                total: total,
                address_id: selectedAddressId,
                add_id: selectedAddressId,
                payment_method: formData.paymentMethod.toLowerCase(),
                coupon_code: couponApplied && appliedCoupon ? appliedCoupon.code : null,
                offer_id: appliedOffer ? appliedOffer.offer_id : null,
            };

            const res = await axiosInstance.post(`/createorder`, orderData);
            const apiBody = res.data || res;

            if (apiBody.status !== 1) {
                throw new Error(apiBody.message || "Order failed");
            }

            // Clear cart from local storage and trigger navbar updates
            localStorage.removeItem("localCart");
            queryClient.invalidateQueries({ queryKey: ["cart"] });
            window.dispatchEvent(new Event("cartUpdated"));

            if (formData.paymentMethod === "online") {
                const checkoutUrl = apiBody?.data?.checkoutUrl;
                const paymentId = apiBody?.data?.paymentId || apiBody?.data?.id || apiBody?.data?.paymentIntentId;
                const order_id = apiBody?.data?.order_id || apiBody?.data?.orderId;

                if (paymentId) {
                    sessionStorage.setItem('retryPaymentId', paymentId);
                }

                if (checkoutUrl) {
                    sessionStorage.setItem('lastCheckoutUrl', checkoutUrl);
                    if (order_id) {
                        sessionStorage.setItem('lastOrderId', order_id);
                    }
                    window.location.href = checkoutUrl;
                } else {
                    toast.error('Failed to get payment checkout URL.');
                    setIsProcessing(false);
                    isPlacingOrderRef.current = false;
                }
            } else {
                // Show success modal upon successful order placement (COD)
                setShowSuccessModal(true);
            }
        } catch (err) {
            console.error(err);
            toast.error(err.message || "Failed to place order");
            isPlacingOrderRef.current = false;
        } finally {
            setIsProcessing(false);
            if (formData.paymentMethod !== "online") {
                isPlacingOrderRef.current = false;
            }
        }
    };

    return (
        <>
            <div className="min-h-screen px-2 md:px-10 py-10 font-poppins">
                <div className="">
                    <div className="flex flex-col lg:flex-row items-start gap-8">

                        {/* Left Section - Form */}
                        <ScrollReveal animation="fade-right" duration={800} className="w-full lg:w-[480px] flex-1 rounded-[10px] overflow-hidden border border-[#DEDFE1]">
                            {/* Steps Header */}
                            <div className="bg-[#E7DCD2]">
                                <div className="flex justify-between items-center px-4 md:px-10 py-6">
                                    {steps.map((step) => (
                                        <button
                                            key={step.id}
                                            onClick={() => setCurrentStep(step.id)}
                                            className={`text-md md:text-lg font-medium font-[Oxygen] transition-colors duration-300 cursor-pointer ${currentStep === step.id ? "text-[#000000]" : "text-[#767676]"
                                                }`}
                                        >
                                            {step.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Form Content */}
                            <div className="p-4 md:p-10">
                                {currentStep === 1 && renderPersonalFields()}
                                {currentStep === 2 && renderBillingFields()}
                                {currentStep === 3 && renderConfirmationStep()}

                                <div className="mt-10">
                                    <button
                                        type="button"
                                        onClick={handleNext}
                                        disabled={isProcessing}
                                        className="bg-[#1C2F2F] text-white px-8 md:px-12 py-4 rounded-full font-medium transition-all hover:bg-black active:scale-[0.98] font-[Oxygen] text-md md:text-lg cursor-pointer flex items-center justify-center gap-2 min-w-[200px]"
                                    >
                                        {isProcessing && <Loader2 className="animate-spin" size={18} />}
                                        {currentStep === 3 ? "Place Order" : "Proceed to Next Step"}
                                    </button>
                                </div>
                            </div>
                        </ScrollReveal>

                        {/* Right Section - Cart Details */}
                        <ScrollReveal animation="fade-left" duration={800} className="w-full lg:w-[480px]">
                            <div className="rounded-[10px] overflow-hidden border border-[#DEDFE1]">
                                <div className="bg-[#E7DCD2] px-4 md:px-10 py-6">
                                    <h3 className="text-2xl font-medium text-[#000000] font-[Oxygen]">Cart Details</h3>
                                </div>

                                <div className=" ">
                                    {/* Table Header */}
                                    <div className="flex justify-between px-4 md:px-10 py-6 text-xs md:text-md font-medium text-[#3D3D3D] font-[Oxygen] uppercase tracking-wide">
                                        <span className="w-1/2">PRODUCT</span>
                                        <span className="w-1/4 text-center">QTY</span>
                                        <span className="w-1/4 text-right">SUBTOTAL</span>
                                    </div>

                                    <div className="border-b border-dashed border-[#d7d4d4]"></div>

                                    {/* Product List */}
                                    <div className="space-y-8 px-4 md:px-10 py-6">
                                        {cartItems.map((item, index) => (
                                            <div key={item.cart_id || index} className="flex items-start text-[#767676] font-[Oxygen] text-sm md:text-lg gap-4">
                                                <img
                                                    src={item.image_url?.startsWith("http") ? item.image_url : `${ApiURL}/assets/Products/${item.image_url}`}
                                                    alt={item.product_name}
                                                    className="w-12 h-16 object-cover rounded border flex-shrink-0"
                                                />
                                                <div className="w-1/2 flex flex-col">
                                                    <span className="font-medium text-[#3D3D3D] leading-tight">{item.product_name}</span>

                                                    {/* --- UPDATED DYNAMIC COLOR & SKU SECTION --- */}
                                                    {(item.color_name || item.size_name || item.sku) && (
                                                        <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                                                            {item.sku && String(item.sku).trim() !== "" && (
                                                                <span className="px-1.5 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-200/80 text-[10px] font-semibold uppercase">
                                                                    SKU: {item.sku}
                                                                </span>
                                                            )}
                                                            {/* Dynamic Color Circle */}
                                                            {item.color_code && (
                                                                <div
                                                                    className="w-3.5 h-3.5 rounded-full border border-gray-200 shadow-xs flex-shrink-0"
                                                                    style={{ backgroundColor: item.color_code }}
                                                                    title={item.color_name}
                                                                />
                                                            )}

                                                            {/* Text Label: Color / Size */}
                                                            <span className="text-xs text-[#9A8F87] flex items-center gap-1">
                                                                {item.color_name && <span className="capitalize">{item.color_name}</span>}
                                                                {(item.color_name && item.size_name) && <span className="text-gray-400">/</span>}
                                                                {item.size_name && <span className="uppercase">{item.size_name}</span>}
                                                            </span>
                                                        </div>
                                                    )}
                                                    {/* --- END UPDATED SECTION --- */}

                                                </div>
                                                <span className="w-1/4 text-center pt-1">
                                                    {item.quantity < 10 ? `0${item.quantity}` : item.quantity}
                                                </span>
                                                <span className="w-1/4 text-right pt-1">
                                                    ₹{(item.price * item.quantity).toFixed(0)}
                                                </span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="border-b border-dashed border-[#d7d4d4]"></div>

                                    {/* Calculations */}
                                    <div className="">
                                        <div className="flex justify-between items-center font-[Oxygen] px-4 md:px-10 py-6">
                                            <span className="text-md font-medium text-[#3D3D3D] uppercase tracking-wide">SUBTOTAL</span>
                                            <span className="text-[#767676] text-lg">₹{subtotal.toFixed(0)}</span>
                                        </div>

                                        <div className="border-b border-dashed border-[#d7d4d4]"></div>

                                        <div className="flex justify-between items-center font-[Oxygen] px-4 md:px-10 py-6">
                                            <span className="text-md font-medium text-[#3D3D3D] uppercase tracking-wide">SHIPPING</span>
                                            <span className="text-[#767676] text-lg">{shipping > 0 ? `₹${shipping.toFixed(0)}` : "Free"}</span>
                                        </div>

                                        {offerDiscount > 0 && (
                                            <>
                                                <div className="border-b border-dashed border-[#d7d4d4]"></div>
                                                <div className="flex justify-between items-center font-[Oxygen] px-4 md:px-10 py-6 text-green-700">
                                                    <span className="text-md font-medium uppercase tracking-wide">Offer Discount</span>
                                                    <span className="text-lg font-semibold">- ₹{offerDiscount}</span>
                                                </div>
                                            </>
                                        )}

                                        {couponApplied && couponDiscount > 0 && (
                                            <>
                                                <div className="border-b border-dashed border-[#d7d4d4]"></div>
                                                <div className="flex justify-between items-center font-[Oxygen] px-4 md:px-10 py-6 text-blue-700">
                                                    <span className="text-md font-medium uppercase tracking-wide">Coupon Discount ({appliedCoupon?.code})</span>
                                                    <span className="text-lg font-semibold">- ₹{couponDiscount}</span>
                                                </div>
                                            </>
                                        )}

                                        <div className="border-b border-dashed border-[#d7d4d4]"></div>

                                        <div className="flex justify-between items-center font-[Oxygen] px-4 md:px-10 py-6">
                                            <span className="text-md font-medium text-[#3D3D3D] tracking-wide">Total</span>
                                            <span className="text-[#767676] text-2xl font-semibold">₹{total.toFixed(0)}</span>
                                        </div>
                                    </div>

                                    {/* Coupon and Offers Promo Section */}
                                    <div className="px-4 md:px-10 py-6 border-t border-[#DEDFE1] bg-gray-50/70">
                                        <h4 className="text-sm font-semibold text-[#1C2F2F] mb-4 font-[Oxygen] uppercase tracking-wider">Promotions & Coupons</h4>

                                        {/* Coupon Input */}
                                        <div className="mt-2">
                                            {!couponApplied ? (
                                                <div className="flex gap-2">
                                                    <input
                                                        value={couponCode}
                                                        onChange={(e) => setCouponCode(e.target.value)}
                                                        placeholder="Enter Coupon code"
                                                        className="border border-gray-300 p-2.5 rounded-lg w-full text-sm font-[Oxygen] focus:outline-none uppercase"
                                                    />
                                                    <button
                                                        onClick={applyCoupon}
                                                        className="bg-[#1C2F2F] hover:bg-black text-white px-5 rounded-lg text-sm font-medium font-[Oxygen] transition-colors cursor-pointer"
                                                    >
                                                        Apply
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="flex justify-between items-center bg-blue-50 border border-blue-200 rounded-lg p-3">
                                                    <div>
                                                        <p className="text-xs text-blue-800 font-semibold font-[Oxygen]">Coupon Applied</p>
                                                        <p className="text-sm font-mono font-bold text-blue-900">{appliedCoupon?.code}</p>
                                                    </div>
                                                    <button
                                                        onClick={removeCoupon}
                                                        className="text-red-600 text-sm font-semibold hover:underline font-[Oxygen] cursor-pointer"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            )}
                                        </div>

                                        {/* Auto-applied offer notification */}
                                        {!couponApplied && appliedOffer && offerDiscount > 0 && (
                                            <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-4 flex justify-between items-center">
                                                <div className="flex-1 pr-2">
                                                    <p className="text-xs text-green-800 font-semibold font-[Oxygen]">🎉 Best Offer Auto-Applied</p>
                                                    <p className="text-xs text-green-900 font-medium font-[Oxygen] mt-0.5 leading-relaxed">
                                                        {appliedOffer.offer_type === "QTY"
                                                            ? `Buy ${appliedOffer.min_qty}+ items & get ${appliedOffer.discount_percent}% OFF`
                                                            : `Flat ${appliedOffer.discount_percent}% OFF on orders above ₹${appliedOffer.min_amount}`
                                                        }
                                                    </p>
                                                </div>
                                                <span className="font-bold text-green-800 text-sm">- ₹{offerDiscount}</span>
                                            </div>
                                        )}

                                        {/* Lists of all active promotions */}
                                        <div className="mt-4 space-y-4">
                                            <OfferList offers={offers} />
                                            <CouponList coupons={coupons} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </ScrollReveal>

                    </div>
                </div>
            </div>

            <BrandBanner />

            {/* Success Modal */}
            {showSuccessModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
                    <div
                        className="absolute inset-0 bg-[#00000040] backdrop-blur-sm"
                        onClick={() => {
                            setShowSuccessModal(false);
                            navigate(u_id ? "/myorders" : "/");
                        }}
                    ></div>
                    <div className="bg-white rounded-[24px] p-8 md:p-12 w-full max-w-[650px] relative z-10 shadow-xl animate-fadeIn scale-up text-center space-y-8">
                        <button
                            onClick={() => {
                                setShowSuccessModal(false);
                                navigate(u_id ? "/myorders" : "/");
                            }}
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
                                <p className="text-lg font-medium">Hello@Kundrat.Com</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Checkout;