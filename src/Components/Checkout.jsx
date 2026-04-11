import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Check, X, Loader2 } from "lucide-react";
import { ApiURL, userInfo } from "../Variable";
import axiosInstance from "../Axios/axios";
import toast from "react-hot-toast";
import { getGuestId } from "../utils/guest";
import BrandBanner from "./BrandBanner";

const Checkout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { cartItems = [], isGuest, guestId: stateGuestId } = location.state || {};

    const [currentStep, setCurrentStep] = useState(1); // 1: Personal, 2: Billing, 3: Confirmation
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [addresses, setAddresses] = useState([]);
    const [selectedAddressId, setSelectedAddressId] = useState(null);

    const user = userInfo();
    const u_id = user?.u_id;
    const guestId = stateGuestId || getGuestId();

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

    const subtotal = cartItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
    );
    const shipping = 100; // Hardcoded as per UI design
    const total = subtotal + shipping;

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
                    <select
                        onChange={(e) => {
                            const addr = addresses.find(a => a.add_id.toString() === e.target.value);
                            if (addr) fillFormFromAddress(addr);
                        }}
                        value={selectedAddressId || ""}
                        className="w-full bg-[#f9f9f9a1] border border-[#E9E9E9] rounded-[8px] px-4 py-3 focus:outline-none focus:ring-1 focus:ring-[#1C2F2F] font-[Oxygen]"
                    >
                        <option value="">-- Select an address --</option>
                        {addresses.map(addr => (
                            <option key={addr.add_id} value={addr.add_id}>
                                {addr.address}, {addr.city} ({addr.first_name})
                            </option>
                        ))}
                    </select>
                </div>
            )}
            <div className="space-y-2">
                <label className="block text-[#3D3D3D] font-[Oxygen] text-sm md:text-base">First Name*</label>
                <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full bg-[#f9f9f9a1] border border-[#E9E9E9] rounded-[8px] px-4 py-3 focus:outline-none focus:ring-1 focus:ring-[#1C2F2F] font-[Oxygen]"
                />
            </div>
            <div className="space-y-2">
                <label className="block text-[#3D3D3D] font-[Oxygen] text-sm md:text-base">Last Name*</label>
                <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full bg-[#f9f9f9a1] border border-[#E9E9E9] rounded-[8px] px-4 py-3 focus:outline-none focus:ring-1 focus:ring-[#1C2F2F] font-[Oxygen]"
                />
            </div>
            <div className="space-y-2">
                <label className="block text-[#3D3D3D] font-[Oxygen] text-sm md:text-base">Email Address*</label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full bg-[#f9f9f9a1] border border-[#E9E9E9] rounded-[8px] px-4 py-3 focus:outline-none focus:ring-1 focus:ring-[#1C2F2F] font-[Oxygen]"
                />
            </div>
            <div className="space-y-2">
                <label className="block text-[#3D3D3D] font-[Oxygen] text-sm md:text-base">Phone Number*</label>
                <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full bg-[#f9f9f9a1] border border-[#E9E9E9] rounded-[8px] px-4 py-3 focus:outline-none focus:ring-1 focus:ring-[#1C2F2F] font-[Oxygen]"
                />
            </div>
            <div className="md:col-span-2 space-y-2">
                <label className="block text-[#3D3D3D] font-[Oxygen] text-sm md:text-base">Street Address*</label>
                <input
                    type="text"
                    name="streetAddress"
                    value={formData.streetAddress}
                    onChange={handleInputChange}
                    className="w-full bg-[#f9f9f9a1] border border-[#E9E9E9] rounded-[8px] px-4 py-3 focus:outline-none focus:ring-1 focus:ring-[#1C2F2F] font-[Oxygen]"
                />
            </div>
            <div className="space-y-2">
                <label className="block text-[#3D3D3D] font-[Oxygen] text-sm md:text-base">Town / City*</label>
                <input
                    type="text"
                    name="townCity"
                    value={formData.townCity}
                    onChange={handleInputChange}
                    className="w-full bg-[#f9f9f9a1] border border-[#E9E9E9] rounded-[8px] px-4 py-3 focus:outline-none focus:ring-1 focus:ring-[#1C2F2F] font-[Oxygen]"
                />
            </div>
            <div className="space-y-2">
                <label className="block text-[#3D3D3D] font-[Oxygen] text-sm md:text-base">State*</label>
                <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full bg-[#f9f9f9a1] border border-[#E9E9E9] rounded-[8px] px-4 py-3 focus:outline-none focus:ring-1 focus:ring-[#1C2F2F] font-[Oxygen]"
                />
            </div>
            <div className="space-y-2">
                <label className="block text-[#3D3D3D] font-[Oxygen] text-sm md:text-base">Country*</label>
                <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full bg-[#f9f9f9a1] border border-[#E9E9E9] rounded-[8px] px-4 py-3 focus:outline-none focus:ring-1 focus:ring-[#1C2F2F] font-[Oxygen]"
                />
            </div>
            <div className="space-y-2">
                <label className="block text-[#3D3D3D] font-[Oxygen] text-sm md:text-base">Postcode / Zip*</label>
                <input
                    type="text"
                    name="postcodeZip"
                    value={formData.postcodeZip}
                    onChange={handleInputChange}
                    className="w-full bg-[#f9f9f9a1] border border-[#E9E9E9] rounded-[8px] px-4 py-3 focus:outline-none focus:ring-1 focus:ring-[#1C2F2F] font-[Oxygen]"
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
                <>
                    <div className="md:col-span-2 space-y-2">
                        <label className="block text-[#3D3D3D] font-[Oxygen] text-sm md:text-base">Name On Card*</label>
                        <input
                            type="text"
                            name="cardName"
                            value={formData.cardName}
                            onChange={handleInputChange}
                            className="w-full bg-[#f9f9f9a1] border border-[#E9E9E9] rounded-[8px] px-4 py-3 focus:outline-none focus:ring-1 focus:ring-[#1C2F2F] font-[Oxygen]"
                        />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                        <label className="block text-[#3D3D3D] font-[Oxygen] text-sm md:text-base">Card Number*</label>
                        <input
                            type="text"
                            name="cardNumber"
                            value={formData.cardNumber}
                            onChange={handleInputChange}
                            className="w-full bg-[#f9f9f9a1] border border-[#E9E9E9] rounded-[8px] px-4 py-3 focus:outline-none focus:ring-1 focus:ring-[#1C2F2F] font-[Oxygen]"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="block text-[#3D3D3D] font-[Oxygen] text-sm md:text-base">Valid Through*</label>
                        <input
                            type="text"
                            name="validThrough"
                            placeholder="MM/YY"
                            value={formData.validThrough}
                            onChange={handleInputChange}
                            className="w-full bg-[#f9f9f9a1] border border-[#E9E9E9] rounded-[8px] px-4 py-3 focus:outline-none focus:ring-1 focus:ring-[#1C2F2F] font-[Oxygen]"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="block text-[#3D3D3D] font-[Oxygen] text-sm md:text-base">CVV*</label>
                        <input
                            type="password"
                            name="cvv"
                            maxLength="3"
                            value={formData.cvv}
                            onChange={handleInputChange}
                            className="w-full bg-[#f9f9f9a1] border border-[#E9E9E9] rounded-[8px] px-4 py-3 focus:outline-none focus:ring-1 focus:ring-[#1C2F2F] font-[Oxygen]"
                        />
                    </div>
                    <div className="md:col-span-2 flex items-center gap-3">
                        <input
                            type="checkbox"
                            id="saveAsDefault"
                            name="saveAsDefault"
                            checked={formData.saveAsDefault}
                            onChange={handleInputChange}
                            className="w-5 h-5 accent-[#1C2F2F] cursor-pointer"
                        />
                        <label htmlFor="saveAsDefault" className="text-[#3D3D3D] font-[Oxygen] text-sm md:text-base cursor-pointer">
                            Save As Default Payment Method
                        </label>
                    </div>
                </>
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
            <div className="bg-[#f9f9f9a1] p-6 rounded-[8px] border border-[#E9E9E9]">
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
                            {formData.paymentMethod === "COD" ? "Cash on Delivery" : `Card ending in ${formData.cardNumber.slice(-4) || "****"}`}
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
            // Validate Billing (if online)
            if (formData.paymentMethod === "online") {
                if (!formData.cardName || !formData.cardNumber || !formData.validThrough || !formData.cvv) {
                    toast.error("Please fill all billing fields");
                    return;
                }
            }
            setCurrentStep(3);
        } else {
            // Step 3: Place Order
            handlePlaceOrder();
        }
    };

    const handlePlaceOrder = () => {
        // Validate form data before redirecting
        if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || 
            !formData.streetAddress || !formData.townCity || !formData.postcodeZip) {
            toast.error("Please fill all required fields");
            return;
        }

        // Navigate to SelectAddressPage with cart items and form data
        navigate("/selectaddress", {
            state: {
                cartItems: cartItems,
                formData: formData
            }
        });
    };

    
    return (
        <>
            <div className="min-h-screen pt-12 pb-12 px-4 md:px-10 lg:px-20">
                <div className="">
                    <div className="flex flex-col lg:flex-row gap-8">

                        {/* Left Section - Form */}
                        <div className="bg-[#F3F0ED] flex-1 rounded-[10px] overflow-hidden border border-[#DEDFE1]">
                            {/* Steps Header */}
                            <div className="bg-[#E7DCD2]">
                                <div className="flex justify-between items-center px-4 md:px-10 py-6">
                                    {steps.map((step) => (
                                        <button
                                            key={step.id}
                                            onClick={() => setCurrentStep(step.id)}
                                            className={`text-sm md:text-lg font-medium font-[Oxygen] transition-colors duration-300 cursor-pointer ${currentStep === step.id ? "text-[#000000]" : "text-[#767676]"
                                                }`}
                                        >
                                            {step.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Form Content */}
                            <div className="p-6 md:p-10">
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
                        </div>

                        {/* Right Section - Cart Details */}
                        <div className="w-full lg:w-[480px]">
                            <div className="bg-[#F3F0ED] rounded-[10px] overflow-hidden border border-[#DEDFE1]">
                                <div className="bg-[#E7DCD2] px-4 md:px-10 py-6">
                                    <h3 className="text-2xl font-medium text-[#000000] font-[Oxygen]">Cart Details</h3>
                                </div>

                                <div className=" ">
                                    {/* Table Header */}
                                    <div className="flex justify-between px-4 md:px-10 py-6 text-md font-medium text-[#3D3D3D] font-[Oxygen] uppercase tracking-wide">
                                        <span className="w-1/2">PRODUCT</span>
                                        <span className="w-1/4 text-center">Quantity</span>
                                        <span className="w-1/4 text-right">SUBTOTAL</span>
                                    </div>

                                    <div className="border-b border-dashed border-[#d7d4d4]"></div>

                                    {/* Product List */}
                                    <div className="space-y-8 px-4 md:px-10 py-6">
                                        {cartItems.map((item, index) => (
                                            <div key={item.cart_id || index} className="flex items-center text-[#767676] font-[Oxygen] text-lg">
                                                <div className="w-1/2 flex flex-col">
                                                    <span className="font-normal">{item.product_name}</span>
                                                </div>
                                                <span className="w-1/4 text-center">
                                                    {item.quantity < 10 ? `0${item.quantity}` : item.quantity}
                                                </span>
                                                <span className="w-1/4 text-right">
                                                    ${(item.price * item.quantity).toFixed(0)}
                                                </span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="border-b border-dashed border-[#d7d4d4]"></div>

                                    {/* Calculations */}
                                    <div className="">
                                        <div className="flex justify-between items-center font-[Oxygen] px-4 md:px-10 py-6">
                                            <span className="text-md font-medium text-[#3D3D3D] uppercase tracking-wide">SUBTOTAL</span>
                                            <span className="text-[#767676] text-lg">${subtotal.toFixed(0)}</span>
                                        </div>

                                        <div className="border-b border-dashed border-[#d7d4d4]"></div>

                                        <div className="flex justify-between items-center font-[Oxygen] px-4 md:px-10 py-6">
                                            <span className="text-md font-medium text-[#3D3D3D] uppercase tracking-wide">SHIPPING</span>
                                            <span className="text-[#767676] text-lg">${shipping.toFixed(0)}</span>
                                        </div>

                                        <div className="border-b border-dashed border-[#d7d4d4]"></div>

                                        <div className="flex justify-between items-center font-[Oxygen] px-4 md:px-10 py-6">
                                            <span className="text-md font-medium text-[#3D3D3D] tracking-wide">Total</span>
                                            <span className="text-[#767676] text-2xl font-semibold">${total.toFixed(0)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            <BrandBanner />

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
                                    Thank You For Choosing Modimal, Your Order Will Be Generated Based On Your Delivery Request.
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
                                <p className="text-lg">+1(929)460-3208</p>
                                <p className="uppercase text-sm">OR</p>
                                <p className="text-lg font-medium">Hello @ Modimal.Com</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Checkout;
