import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import axios from "axios"; // <-- Add this import
import axiosInstance from "../Axios/axios";
import { userInfo } from "../Variable";
import toast from "react-hot-toast";

const AddAddress = ({
  onClose,
  addressType,
  setAddressType,
  refreshAddresses,
  editingAddress,
}) => {
  const user = userInfo();
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

  const [pincodeLoading, setPincodeLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Allow only numbers for zip_code and max 6 digits
    if (name === "zip_code") {
      if (/^\d*$/.test(value) && value.length <= 6) {
        setFormData({ ...formData, [name]: value });
        if (value.length === 6) {
          fetchCityState(value);
        }
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Fetch City & State from PIN
  const fetchCityState = async (pincode) => {
    if (!pincode || pincode.length !== 6) return;

    setPincodeLoading(true);
    try {
      const response = await axios.get(
        `https://api.postalpincode.in/pincode/${pincode}`
      );
      const data = response.data[0];

      if (
        data.Status === "Success" &&
        data.PostOffice &&
        data.PostOffice.length > 0
      ) {
        const { District, State } = data.PostOffice[0];
        setFormData((prev) => ({
          ...prev,
          city: District || "",
          state: State || "",
        }));
        toast.success("Location auto-filled!");
      } else {
        toast.error("Invalid PIN code");
        setFormData((prev) => ({ ...prev, city: "", state: "" }));
      }
    } catch (err) {
      toast.error("Failed to fetch location");
      console.error(err);
    } finally {
      setPincodeLoading(false);
    }
  };

  useEffect(() => {
    if (editingAddress) {
      setFormData({
        first_name: editingAddress.first_name,
        last_name: editingAddress.last_name,
        email: editingAddress.email,
        phone_number: editingAddress.phone_number,
        address: editingAddress.address,
        apartment: editingAddress.apartment,
        city: editingAddress.city,
        state: editingAddress.state,
        zip_code: editingAddress.zip_code,
      });
      setAddressType(editingAddress.address_type || "HOME");
    }
  }, [editingAddress]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        u_id: user?.u_id,
        address_type: addressType.charAt(0).toUpperCase() + addressType.slice(1).toLowerCase(),
      };

      let res;
      if (editingAddress) {
        payload.add_id = editingAddress.add_id;
        res = await axiosInstance.put("/updateaddress", payload);
      } else {
        res = await axiosInstance.post("/addaddress", payload);
      }

      if (res?.data?.status === 1) {
        toast.success(res.data.description || "Address saved successfully");
        refreshAddresses();
        onClose();
      } else {
        toast.error(res?.data?.description || "Failed to save address");
      }
    } catch (err) {
      toast.error("Something went wrong");
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 px-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 relative my-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold">
            {editingAddress ? "Edit Address" : "Add New Address"}
          </h3>
          <button onClick={onClose} className="text-gray-600 hover:text-black">
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div className="flex gap-2">
            <input
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              placeholder="First Name"
              required
              className="w-1/2 px-4 py-3 border rounded-lg focus:outline-none focus:border-[#063d32]"
            />
            <input
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              placeholder="Last Name"
              required
              className="w-1/2 px-4 py-3 border rounded-lg focus:outline-none focus:border-[#063d32]"
            />
          </div>

          {/* Email */}
          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            required
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-[#063d32]"
          />

          {/* Phone */}
          <input
            name="phone_number"
            type="tel"
            value={formData.phone_number}
            onChange={handleChange}
            placeholder="Phone Number"
            required
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-[#063d32]"
          />

          {/* Address */}
          <input
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="flat,house no,floor,building"
            required
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-[#063d32]"
          />

          {/* Apartment */}
          <input
            name="apartment"
            value={formData.apartment}
            onChange={handleChange}
            placeholder="area ,street, sector, village"
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-[#063d32]"
          />

          {/* ZIP Code */}
          <div className="relative">
            <input
              name="zip_code"
              value={formData.zip_code}
              onChange={handleChange}
              placeholder="PIN Code (6 digits)"
              required
              maxLength={6}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-[#063d32] pr-10"
            />
            {pincodeLoading && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <div className="w-4 h-4 border-2 border-t-transparent border-[#063d32] rounded-full animate-spin"></div>
              </div>
            )}
          </div>

          {/* State & City (Auto-filled) */}
          <div className="flex gap-2">
            <input
              name="state"
              value={formData.state}
              readOnly
              placeholder="State (auto-filled)"
              className="w-1/2 px-4 py-3 border rounded-lg bg-gray-50 text-gray-700 cursor-not-allowed"
            />
            <input
              name="city"
              value={formData.city}
              readOnly
              placeholder="City (auto-filled)"
              className="w-1/2 px-4 py-3 border rounded-lg bg-gray-50 text-gray-700 cursor-not-allowed"
            />
          </div>

          {/* Address Type */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setAddressType("HOME")}
              className={`px-6 py-2 rounded-md font-medium transition-all ${
                addressType === "HOME"
                  ? "bg-[#063d32] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              HOME
            </button>
            <button
              type="button"
              onClick={() => setAddressType("WORK")}
              className={`px-6 py-2 rounded-md font-medium transition-all ${
                addressType === "WORK"
                  ? "bg-[#063d32] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              WORK
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={pincodeLoading}
            className="w-full bg-[#063d32] text-white py-3 rounded-lg hover:bg-[#052d25] transition font-medium mt-6 disabled:opacity-70"
          >
            {editingAddress ? "UPDATE" : "ADD"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddAddress;
