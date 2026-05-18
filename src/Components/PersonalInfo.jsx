import React, { useEffect, useState, useCallback } from "react";
import SideBar from "./SideBar";
import AddAddress from "./AddAddress";
import axiosInstance from "../Axios/axios";
import { ApiURL, userInfo } from "../Variable";
import toast from "react-hot-toast";
import { getGuestId } from "../utils/guest";
import BrandBanner from "./BrandBanner";

const PersonalInfo = () => {
  const [userData, setUserData] = useState(null);
  const [editingField, setEditingField] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null); // NEW: address being edited
  const [addressType, setAddressType] = useState("HOME");
  const [addresses, setAddresses] = useState([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState(null);
  const user = userInfo();
  const u_id = user?.u_id;
  const guestId = getGuestId(); // ← Guest ID from localStorage (same as cart)
  const isLoggedIn = !!u_id;
  // Fetch user data and addresses
  const fetchUser = useCallback(async () => {
    if (!isLoggedIn) {
      return;
    }
    try {
      const res = await axiosInstance.get(`/user/${u_id}`);
      if (res.data.status === 1) setUserData(res.data.data);
    } catch (err) {
      console.error("Error fetching user:", err);
    }
  }, [isLoggedIn, u_id]);

  const fetchAddress = useCallback(async () => {
    try {
      const payload = isLoggedIn ? { u_id } : { guest_id: guestId };
      const res = await axiosInstance.post(`/getaddress`, payload);

      if (res.data.status === 1) {
        setAddresses(res.data.data || []);
      } else {
        setAddresses([]);
      }
    } catch (err) {
      console.error("Error fetching addresses:", err);
      toast.error("Failed to load addresses");
      setAddresses([]);
    }
  }, [isLoggedIn, u_id, guestId]);

  // Fetch all data and set loading to false when done
  const fetchAllData = useCallback(async () => {
    await Promise.all([
      fetchUser(),
      fetchAddress()
    ]);

  }, [fetchUser, fetchAddress]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // Edit & Save user info
  const handleEdit = (field) => {
    if (!isLoggedIn) {
      toast.error("Please login to edit profile");
      return;
    }
    setEditingField(field);
    setInputValue(userData[field] || "");
  };

  const handleSave = async () => {
    if (!isLoggedIn) return;
    try {
      const res = await axiosInstance.put(`${ApiURL}/user/${u_id}`, {
        [editingField]: inputValue,
      });
      if (res.data.status === 1) {
        setUserData((prev) => ({ ...prev, [editingField]: inputValue }));
        setEditingField("");
        toast.success("Profile updated successfully!");
      } else {
        toast.error(res.data.description || "Failed to update");
      }
    } catch (err) {
      if (err.response?.status === 400 && err.response?.data?.description) {
        toast.error(err.response.data.description);
      } else {
        toast.error("Something went wrong while updating your profile");
      }
      console.error(err);
    }
  };

  // DELETE address
  const handleDeleteAddress = async (add_id) => {
    setAddressToDelete(add_id);
    setDeleteModalOpen(true);
  };

  const confirmDeleteAddress = async () => {
    if (!addressToDelete) return;
    try {
      const res = await axiosInstance.delete(
        `${ApiURL}/deleteaddress/${addressToDelete}`
      );
      if (res.data.status === 1) {
        toast.success("Address deleted successfully");
        fetchAddress();
      } else {
        // Handle error responses from backend
        toast.error(res.data.description || "Failed to delete address");
      }
    } catch (err) {
      // Check if it's a 400 error with response data
      if (err.response?.status === 400 && err.response?.data?.description) {
        toast.error(err.response.data.description);
      } else {
        toast.error("Something went wrong while deleting the address");
      }
    } finally {
      setDeleteModalOpen(false);
      setAddressToDelete(null);
    }
  };

  const cancelDelete = () => {
    setDeleteModalOpen(false);
    setAddressToDelete(null);
  };

  // EDIT address
  const handleEditAddress = (addr) => {
    setEditingAddress(addr);
    setAddressType(addr.address_type || "HOME");
    setIsModalOpen(true);
  };

  return (
    <>
      {(
        <div className="">
          <div className="w-full lg:pt-0 pt-8 px-2 md:px-8 xl:px-24 flex flex-col md:flex-row font-inter">
            {/* Left Sidebar */}
            <div className="md:w-1/3 lg:w-1/4">
              <SideBar />
            </div>

            {/* Right Content */}
            <div className="flex-1 p-4 sm:p-6 md:p-8">
              <h1 className="text-3xl font-semibold text-[#3C4242] mb-8">My Info</h1>

              {/* Contact Details */}
              <div className="mb-12">
                <h2 className="text-xl font-semibold text-[#3C4242] mb-8">
                  Contact Details
                </h2>

                {userData || !isLoggedIn ? (
                  <div className="space-y-8">
                    {[
                      { label: "Your Name", field: "first_name" },
                      { label: "Email Address", field: "email" },
                      // { label: "Phone Number", field: "phone_number" },
                      { label: "Password", field: "password" },
                    ].map(({ label, field }) => (
                      <div
                        key={field}
                        className="flex justify-between items-start"
                      >
                        <div className="flex-1">
                          <p className="text-sm text-[#807D7E] font-medium mb-1">
                            {label}
                          </p>
                          {editingField === field ? (
                            <div className="mt-1 max-w-md">
                              <input
                                type={field === "password" ? "password" : "text"}
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                className="w-full border-b-2 border-gray-300 focus:border-[#807D7E] outline-none bg-transparent py-1 transition-colors"
                                autoFocus
                              />
                              <div className="flex gap-4 mt-3">
                                <button
                                  className="text-sm font-semibold text-green-600 hover:text-green-800 transition-colors cursor-pointer"
                                  onClick={handleSave}
                                >
                                  Save
                                </button>
                                <button
                                  className="text-sm font-semibold text-red-600 hover:text-red-800 transition-colors cursor-pointer"
                                  onClick={() => setEditingField("")}
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <p className="text-lg font-semibold text-[#3C4242]">
                              {field === "password"
                                ? "•••••••"
                                : userData && userData[field]}
                            </p>
                          )}
                        </div>

                        {isLoggedIn && editingField !== field && (
                          <button
                            className="text-base font-semibold text-[#807D7E] hover:text-[#807D7E] transition-colors"
                            onClick={() => handleEdit(field)}
                          >
                            Change
                          </button>
                        )}
                        {!isLoggedIn && field !== "password" && (
                          <button
                            className="text-base font-semibold text-[#807D7E] cursor-not-allowed"
                            disabled
                            title="Login to change"
                          >
                            Change
                          </button>
                        )}
                        {!isLoggedIn && field === "password" && (
                          <button
                            className="text-base font-semibold text-[#807D7E] cursor-not-allowed"
                            disabled
                          >
                            Change
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-6 text-gray-500">
                    Loading profile info...
                  </div>
                )}
              </div>

              {/* Address Section */}
              <div className="mt-16">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-xl font-semibold text-[#3C4242]">Address</h2>
                  <button
                    onClick={() => {
                      setEditingAddress(null);
                      setIsModalOpen(true);
                    }}
                    className="text-base font-semibold text-[#807D7E] hover:text-[#807D7E] transition-colors"
                  >
                    Add New
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                  {addresses?.length > 0 ? (
                    addresses.map((addr) => (
                      <div
                        key={addr.add_id}
                        className="bg-[#f9f9f9] rounded-2xl p-6 lg:p-8 shadow-sm border border-transparent transition-all"
                      >
                        <p className="text-xl font-semibold text-[#3C4242] mb-1">
                          {addr.first_name} {addr.last_name}
                        </p>
                        <p className="text-base text-[#807D7E] mb-4 font-semibold">
                          {addr.phone_number}
                        </p>
                        <p className="text-sm text-[#807D7E] mb-6 leading-relaxed max-w-xs">
                          {addr.address}{addr.apartment ? `, ${addr.apartment}` : ''}{addr.city ? `, ${addr.city}` : ''}{addr.zip_code ? ` - ${addr.zip_code}` : ''}{addr.state ? `, ${addr.state}` : ''}
                        </p>

                        <div className="flex flex-wrap gap-2 mb-6">
                          <button className="text-xs font-medium border border-[#807D7E] px-4 py-1.5 rounded-lg bg-white text-[#807D7E]">
                            {addr.address_type || "Home"}
                          </button>
                          {addr.is_default == 1 && (
                            <button className="text-xs font-medium border border-[#807D7E] px-4 py-1.5 rounded-lg bg-white text-[#807D7E]">
                              Default address
                            </button>
                          )}
                        </div>

                        <div className="flex items-center gap-6">
                          <button
                            className={`text-sm font-bold transition-colors cursor-pointer ${addr.add_id.toString().startsWith('dummy') ? 'text-[#3C4242] cursor-not-allowed' : 'text-[#3C4242] hover:text-[#3C4242]'} font-semibold`}
                            onClick={() => !addr.add_id.toString().startsWith('dummy') && handleDeleteAddress(addr.add_id)}
                            disabled={addr.add_id.toString().startsWith('dummy')}
                          >
                            Remove
                          </button>
                          <button
                            className={`text-sm font-bold transition-colors cursor-pointer ${addr.add_id.toString().startsWith('dummy') ? 'text-[#3C4242] cursor-not-allowed' : 'text-[#3C4242] hover:text-[#3C4242]'} font-semibold`}
                            onClick={() => !addr.add_id.toString().startsWith('dummy') && handleEditAddress(addr)}
                            disabled={addr.add_id.toString().startsWith('dummy')}
                          >
                            Edit
                          </button>
                          {addr.is_default != 1 && (
                            <button
                              className={`text-sm font-bold transition-colors cursor-pointer ${addr.add_id.toString().startsWith('dummy') ? 'text-[#3C4242] cursor-not-allowed' : 'text-[#3C4242] hover:text-[#3C4242]'} font-semibold`}
                              disabled={addr.add_id.toString().startsWith('dummy')}
                            >
                              Set as default
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-8 text-[#807D7E]">
                      No addresses found. Click "Add New" to create your first address.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <BrandBanner />
        </div>
      )}

      {isModalOpen && (
        <AddAddress
          onClose={() => setIsModalOpen(false)}
          addressType={addressType}
          setAddressType={setAddressType}
          refreshAddresses={fetchAddress}
          editingAddress={editingAddress}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-[#00000040] backdrop-blur-sm">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
            <h3 className="text-lg font-semibold text-[#3C4242] mb-4">
              Are you sure you want to delete this address?
            </h3>
            <div className="flex gap-4 justify-end">
              <button
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors cursor-pointer"
                onClick={cancelDelete}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-800 transition-colors cursor-pointer"
                onClick={confirmDeleteAddress}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default PersonalInfo;
