import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import SideBar from "./SideBar";
import AddAddress from "./AddAddress";
import axiosInstance from "../Axios/axios";
import { ApiURL, userInfo } from "../Variable";
import toast from "react-hot-toast";
import { getGuestId } from "../utils/guest";
import BrandBanner from "./BrandBanner";
import ProfileInfoSkeleton from "./skeletons/ProfileInfoSkeleton";
import { Loader2, User, Mail, Lock, Plus, MapPin, Trash2, Edit3, Home, Briefcase, AlertTriangle } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useProfile, useUpdateProfile, useAddresses, useDeleteAddress } from "../hooks/useProfile";
import ScrollReveal from "./Ui/ScrollReveal";


const PersonalInfo = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [editingField, setEditingField] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [addressType, setAddressType] = useState("HOME");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState(null);

  const user = userInfo();
  const u_id = user?.u_id;
  const isLoggedIn = !!u_id;

  // TanStack Queries & Mutations
  const { data: userData, isLoading: isLoadingProfile } = useProfile();
  const { data: addresses = [], isLoading: isLoadingAddresses } = useAddresses();

  const updateProfileMutation = useUpdateProfile();
  const deleteAddressMutation = useDeleteAddress();

  const dataLoading = (isLoggedIn && isLoadingProfile) || isLoadingAddresses;
  const savingProfile = updateProfileMutation.isPending;
  const deletingAddress = deleteAddressMutation.isPending;

  // Edit & Save user info
  const handleEdit = (field) => {
    if (!isLoggedIn) {
      toast.error("Please login to edit profile");
      return;
    }
    setEditingField(field);
    setInputValue(userData ? userData[field] || "" : "");
  };

  const handleSave = () => {
    if (!isLoggedIn || savingProfile) return;
    updateProfileMutation.mutate(
      { [editingField]: inputValue },
      {
        onSuccess: () => {
          setEditingField("");
        },
        onError: (err) => {
          toast.error(err.message || "Failed to update profile");
        },
      }
    );
  };

  // DELETE address
  const handleDeleteAddress = (add_id) => {
    setAddressToDelete(add_id);
    setDeleteModalOpen(true);
  };

  const confirmDeleteAddress = () => {
    if (!addressToDelete || deletingAddress) return;
    deleteAddressMutation.mutate(addressToDelete, {
      onSuccess: () => {
        setDeleteModalOpen(false);
        setAddressToDelete(null);
      },
      onError: (err) => {
        toast.error(err.message || "Failed to delete address");
        setDeleteModalOpen(false);
        setAddressToDelete(null);
      },
    });
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

  const getInitials = () => {
    if (userData && userData.first_name) {
      return userData.first_name.charAt(0).toUpperCase();
    }
    return "U";
  };

  return (
    <>
      {(
        <div className="min-h-screen">
          <div className="w-full lg:pt-8 pt-4 px-2 md:px-8 xl:px-24 flex flex-col md:flex-row font-poppins">
            {/* Left Sidebar */}
            <div className="md:w-1/3 lg:w-1/4">
              <SideBar />
            </div>

            {/* Right Content */}
            <ScrollReveal animation="fade-left" duration={800} className="flex-1 p-4 sm:p-6 md:p-8">
              {/* Header section with avatar */}
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#063d32] to-[#1c2f2f] flex items-center justify-center text-white text-xl font-bold shadow-md">
                  {getInitials()}
                </div>
                <div>
                  <h1 className="text-3xl font-semibold text-[#3C4242] font-poppins">My Info</h1>
                  <p className="text-sm text-[#807D7E] mt-0.5">Manage your personal details and shipping addresses</p>
                </div>
              </div>

              {dataLoading ? (
                <ProfileInfoSkeleton />
              ) : (
                <div>
                  {/* Contact Details Card */}
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8 mb-10">
                    <h2 className="text-xl font-semibold text-[#3C4242] mb-6 flex items-center gap-2">
                      <User className="text-[#063d32] w-5 h-5" />
                      Contact Details
                    </h2>

                    {userData || !isLoggedIn ? (
                      <div className="space-y-6">
                        {[
                          { label: "Your Name", field: "first_name", icon: User },
                          { label: "Email Address", field: "email", icon: Mail },
                          { label: "Password", field: "password", icon: Lock },
                        ].map(({ label, field, icon: FieldIcon }) => (
                          <div
                            key={field}
                            className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-4 border-b border-gray-50 last:border-b-0 gap-4"
                          >
                            <div className="flex-1">
                              {editingField === field ? (
                                <div className="max-w-md">
                                  <label className="text-xs text-[#807D7E] font-medium uppercase tracking-wider block mb-1.5">
                                    {label}
                                  </label>
                                  <input
                                    type={field === "password" ? "password" : "text"}
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#063d32] focus:ring-1 focus:ring-[#063d32] outline-none bg-gray-50/50 transition-all font-medium text-[#3C4242]"
                                    autoFocus
                                  />
                                  <div className="flex gap-3 mt-3">
                                    <button
                                      className="px-4 py-2 rounded-lg text-xs font-semibold bg-[#063d32] text-white hover:bg-[#12584a] transition-all flex items-center gap-1.5 shadow-sm disabled:opacity-60 cursor-pointer"
                                      onClick={handleSave}
                                      disabled={savingProfile}
                                    >
                                      {savingProfile && <Loader2 size={12} className="animate-spin" />}
                                      Save
                                    </button>
                                    <button
                                      className="px-4 py-2 rounded-lg text-xs font-semibold bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all cursor-pointer"
                                      onClick={() => setEditingField("")}
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-[#063d32] shrink-0">
                                    <FieldIcon className="w-5 h-5" />
                                  </div>
                                  <div>
                                    <p className="text-xs text-[#807D7E] font-medium uppercase tracking-wider">
                                      {label}
                                    </p>
                                    <p className={`text-base font-semibold text-[#3C4242] mt-0.5 ${field === "first_name" ? "capitalize" : ""}`}>
                                      {field === "password"
                                        ? "••••••••"
                                        : userData && userData[field]}
                                    </p>
                                  </div>
                                </div>
                              )}
                            </div>

                            <div className="sm:self-center">
                              {isLoggedIn && editingField !== field && (
                                <button
                                  className="text-sm font-semibold text-[#063d32] bg-emerald-50 hover:bg-emerald-100 px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                                  onClick={() => {
                                    if (field === "password") {
                                      navigate("/forgot-password");
                                    } else {
                                      handleEdit(field);
                                    }
                                  }}
                                >
                                  Change
                                </button>
                              )}
                              {!isLoggedIn && (
                                <button
                                  className="text-sm font-semibold text-gray-400 bg-gray-50 px-4 py-2 rounded-xl cursor-not-allowed flex items-center gap-1.5"
                                  disabled
                                  title="Login to change"
                                >
                                  Change
                                </button>
                              )}
                            </div>
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
                  <div className="mt-12">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-semibold text-[#3C4242] flex items-center gap-2">
                        <MapPin className="text-[#063d32] w-5 h-5" />
                        Saved Addresses
                      </h2>
                      <button
                        onClick={() => {
                          setEditingAddress(null);
                          setIsModalOpen(true);
                        }}
                        className="text-sm font-semibold text-white bg-[#063d32] hover:bg-[#12584a] px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
                      >
                        <Plus className="w-4 h-4" />
                        Add New
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {addresses?.length > 0 ? (
                        addresses.map((addr) => (
                          <div
                            key={addr.add_id}
                            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:border-emerald-800/10 hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
                          >
                            <div>
                              <div className="flex justify-between items-start mb-4 gap-2">
                                <div>
                                  <p className="text-lg font-bold text-[#3C4242] capitalize">
                                    {addr.first_name} {addr.last_name}
                                  </p>
                                  <p className="text-sm text-[#807D7E] font-medium mt-0.5">
                                    {addr.phone_number}
                                  </p>
                                </div>

                                {/* Badges */}
                                <div className="flex flex-wrap gap-1.5 justify-end shrink-0">
                                  <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-50 text-[#063d32] border border-emerald-100 capitalize flex items-center gap-1">
                                    {addr.address_type?.toLowerCase() === "work" ? (
                                      <Briefcase className="w-3.5 h-3.5" />
                                    ) : (
                                      <Home className="w-3.5 h-3.5" />
                                    )}
                                    {addr.address_type || "Home"}
                                  </span>
                                  {addr.is_default == 1 && (
                                    <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-amber-50 text-amber-700 border border-amber-100 flex items-center gap-1">
                                      Default
                                    </span>
                                  )}
                                </div>
                              </div>

                              <p className="text-sm text-[#807D7E] mb-6 leading-relaxed">
                                {addr.address}{addr.apartment ? `, ${addr.apartment}` : ''}{addr.city ? `, ${addr.city}` : ''}{addr.zip_code ? ` - ${addr.zip_code}` : ''}{addr.state ? `, ${addr.state}` : ''}
                              </p>
                            </div>

                            <div className="flex items-center gap-4 border-t border-gray-50 pt-4 mt-auto">
                              <button
                                className={`text-sm font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${addr.add_id.toString().startsWith('dummy')
                                    ? 'text-gray-300 cursor-not-allowed'
                                    : 'text-gray-600 hover:text-red-600'
                                  }`}
                                onClick={() => !addr.add_id.toString().startsWith('dummy') && handleDeleteAddress(addr.add_id)}
                                disabled={addr.add_id.toString().startsWith('dummy')}
                              >
                                <Trash2 className="w-4 h-4" />
                                Remove
                              </button>
                              <div className="w-px h-4 bg-gray-200"></div>
                              <button
                                className={`text-sm font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${addr.add_id.toString().startsWith('dummy')
                                    ? 'text-gray-300 cursor-not-allowed'
                                    : 'text-[#063d32] hover:text-[#12584a]'
                                  }`}
                                onClick={() => !addr.add_id.toString().startsWith('dummy') && handleEditAddress(addr)}
                                disabled={addr.add_id.toString().startsWith('dummy')}
                              >
                                <Edit3 className="w-4 h-4" />
                                Edit
                              </button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="col-span-full text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200 text-[#807D7E]">
                          <MapPin className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                          <p className="text-sm font-medium">No addresses found</p>
                          <p className="text-xs text-gray-400 mt-1">Click "Add New" to create your first address.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </ScrollReveal>
          </div>
          <BrandBanner />
        </div>
      )}

      {isModalOpen && (
        <AddAddress
          onClose={() => setIsModalOpen(false)}
          addressType={addressType}
          setAddressType={setAddressType}
          refreshAddresses={() => queryClient.invalidateQueries({ queryKey: ["addresses"] })}
          editingAddress={editingAddress}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-[#00000060] backdrop-blur-sm transition-all duration-300">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 shadow-xl border border-gray-100 flex flex-col items-center text-center animate-in fade-in zoom-in duration-200">
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-500 mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#3C4242] mb-2">
              Delete Address?
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              Are you sure you want to delete this address? This action cannot be undone.
            </p>
            <div className="flex gap-3 w-full">
              <button
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors cursor-pointer"
                onClick={cancelDelete}
              >
                Cancel
              </button>
              <button
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-red-600 text-white hover:bg-red-700 transition-colors cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-60 shadow-sm shadow-red-100"
                onClick={confirmDeleteAddress}
                disabled={deletingAddress}
              >
                {deletingAddress && <Loader2 size={14} className="animate-spin" />}
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

