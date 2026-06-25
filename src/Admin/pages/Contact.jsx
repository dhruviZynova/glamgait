/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useMemo } from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { Trash2, Inbox, Clock, Mail, User, MessageSquare, AlertCircle } from "lucide-react";
import { toast } from "react-hot-toast";
import { adminAxios } from "../../Axios/axios";
import { ApiURL } from "../../Variable";
import ConfirmDeleteModal from "./ConfirmDeleteModal";

const Contact = () => {
  const [contacts, setContacts] = useState([]); // Stores all fetched contacts
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [expandedMessages, setExpandedMessages] = useState({});
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    contactId: null,
    name: "",
    isDeleting: false,
  });

  // Handle window resize for responsive card/table switching
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch all contacts
  const fetchContacts = async () => {
    setLoading(true);
    try {
      const response = await adminAxios.get(`${ApiURL}/getcontacts`, {
        params: { page: 1, limit: 1000, search: "" },
      });

      const { contacts: data } = response.data.data || { contacts: [] };
      setContacts(data);
    } catch (error) {
      console.error("Error fetching contacts:", error);
      setContacts([]);
      toast.error("Failed to fetch contacts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  // Reset to page 1 when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handleDelete = (contactId, name) => {
    setDeleteModal({ isOpen: true, contactId, name });
  };

  const confirmDelete = async () => {
    setDeleteModal((prev) => ({ ...prev, isDeleting: true }));
    try {
      await adminAxios.delete(`${ApiURL}/deletecontact/${deleteModal.contactId}`);
      toast.success("Request Deleted...");
      fetchContacts(); // Refresh the list
    } catch (error) {
      console.error("Error deleting contact:", error);
      toast.error("Failed to delete contact");
    } finally {
      setDeleteModal({ isOpen: false, contactId: null, name: "", isDeleting: false });
    }
  };

  // Client-side filtering logic
  const filteredContacts = useMemo(() => {
    if (!searchTerm) return contacts;

    const lowerTerm = searchTerm.toLowerCase();
    return contacts.filter(
      (contact) =>
        (contact.name && contact.name.toLowerCase().includes(lowerTerm)) ||
        (contact.email && contact.email.toLowerCase().includes(lowerTerm))
    );
  }, [contacts, searchTerm]);

  // Client-side pagination logic
  const currentContacts = useMemo(() => {
    const indexOfLastContact = currentPage * itemsPerPage;
    const indexOfFirstContact = indexOfLastContact - itemsPerPage;
    return filteredContacts.slice(indexOfFirstContact, indexOfLastContact);
  }, [filteredContacts, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredContacts.length / itemsPerPage);

  // Toggle message expansion
  const toggleExpandMessage = (contactId) => {
    setExpandedMessages((prev) => ({
      ...prev,
      [contactId]: !prev[contactId],
    }));
  };

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Asia/Kolkata",
    };
    return new Date(dateString).toLocaleDateString("en-IN", options);
  };

  const getInitials = (name) => {
    if (!name) return "??";
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const getAvatarBg = (name) => {
    const colors = [
      "from-pink-500 to-rose-500",
      "from-purple-500 to-indigo-500",
      "from-blue-500 to-teal-500",
      "from-amber-500 to-orange-500",
      "from-violet-500 to-fuchsia-500",
    ];
    let sum = 0;
    const cleanName = name || "Anonymous";
    for (let i = 0; i < cleanName.length; i++) {
      sum += cleanName.charCodeAt(i);
    }
    return colors[sum % colors.length];
  };

  // Message display with expand/collapse
  const renderMessage = (message, contactId) => {
    const isExpanded = expandedMessages[contactId];
    const displayMessage = isExpanded
      ? message
      : `${message?.substring(0, 80)}${message?.length > 80 ? "..." : ""}`;

    return (
      <div className="flex flex-col">
        <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
          {displayMessage}
        </p>
        {message?.length > 80 && (
          <button
            onClick={() => toggleExpandMessage(contactId)}
            className="text-xs font-semibold text-pink-600 hover:text-pink-700 mt-2 self-start flex items-center transition-colors cursor-pointer"
            aria-label={isExpanded ? "Show less of message" : "Show more of message"}
          >
            {isExpanded ? "Show Less" : "Read Full Message"}
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="pb-8">
      {/* Header Panel */}
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold text-gray-900">Contact Requests</h1>
            <span className="bg-pink-100 text-pink-700 text-xs font-semibold px-2.5 py-0.5 rounded-full">
              {filteredContacts.length} Total
            </span>
          </div>
          <p className="text-sm text-gray-500">
            View and manage customer inquiries and requests submitted via the contact form.
          </p>
        </div>
        <div className="relative group w-full md:w-96">
          <input
            type="text"
            placeholder="Search by name or email..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 hover:bg-gray-100/50 focus:bg-white border border-gray-200 focus:border-pink-500 rounded-xl focus:outline-none transition-all text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search contact requests"
          />
          <MagnifyingGlassIcon className="absolute left-3.5 top-2.5 h-4.5 w-4.5 text-gray-400" />
        </div>
      </div>

      {loading ? (
        <div className="glamloader-overlay" aria-label="Loading" role="status">
          <div className="glamloader-logo">
            KUNDRAT
            <div className="glamloader-logo-fill">KUNDRAT</div>
          </div>
          <div className="glamloader-ring">
            <svg viewBox="0 0 72 72">
              <circle className="glamloader-ring-track" cx="36" cy="36" r="32" />
              <circle className="glamloader-ring-arc glamloader-ring-arc--a2" cx="36" cy="36" r="32" />
              <circle className="glamloader-ring-arc glamloader-ring-arc--a1" cx="36" cy="36" r="32" />
            </svg>
            <div className="glamloader-ring-dot" />
          </div>
        </div>
      ) : filteredContacts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-pink-50 flex items-center justify-center mb-4">
            <Inbox className="w-8 h-8 text-pink-500" />
          </div>
          <p className="text-base font-bold text-gray-800 mb-1" role="status">
            {searchTerm ? "No matching inquiries" : "Your inbox is empty"}
          </p>
          <p className="text-sm text-gray-500 text-center max-w-xs">
            {searchTerm ? "Try searching for a different name, email, or reset your filters." : "New messages will automatically appear here."}
          </p>
        </div>
      ) : (
        <>
          {isMobile ? (
            /* Responsive Mobile View (Cards) */
            <div className="space-y-4">
              {currentContacts.map((contact) => (
                <div
                  key={contact.contactId}
                  className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
                >
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${getAvatarBg(contact.name)} text-white flex items-center justify-center text-sm font-bold shadow-sm flex-shrink-0`}>
                        {getInitials(contact.name)}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bold text-gray-900 text-sm truncate flex items-center gap-1.5">
                          <User size={13} className="text-gray-400" /> {contact.name}
                        </h3>
                        <p className="text-xs text-gray-500 truncate flex items-center gap-1.5 mt-0.5">
                          <Mail size={13} className="text-gray-400" /> {contact.email || "No email"}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(contact.contactId, contact.name)}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      aria-label={`Delete message from ${contact.name}`}
                    >
                      <Trash2 className="h-4.5 w-4.5" />
                    </button>
                  </div>

                  <div className="bg-gray-50/60 p-3.5 rounded-xl border border-gray-100 mb-3">
                    {renderMessage(contact.message, contact.contactId)}
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <Clock size={12} /> {formatDate(contact.createdAt)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Premium Desktop View (Table) */
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-100">
                  <thead>
                    <tr className="bg-gray-50/50">
                      <th className="px-6 py-4.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Sender Information
                      </th>
                      <th className="px-6 py-4.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Message Description
                      </th>
                      <th className="px-6 py-4.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Received Date
                      </th>
                      <th className="px-6 py-4.5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
                    {currentContacts.map((contact) => (
                      <tr key={contact.contactId} className="hover:bg-gray-50/40 transition-colors group">
                        {/* Sender */}
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${getAvatarBg(contact.name)} text-white flex items-center justify-center text-sm font-bold shadow-sm flex-shrink-0`}>
                              {getInitials(contact.name)}
                            </div>
                            <div className="flex flex-col">
                              <span className="text-sm font-bold text-gray-900 group-hover:text-pink-600 transition-colors">
                                {contact.name}
                              </span>
                              <span className="text-xs text-gray-500 mt-0.5">
                                {contact.email || "No email"}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Message Description */}
                        <td className="px-6 py-5 max-w-md">
                          <div className="flex items-start gap-2.5">
                            <MessageSquare className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                            {renderMessage(contact.message, contact.contactId)}
                          </div>
                        </td>

                        {/* Received Date */}
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className="flex items-center gap-1.5 text-sm text-gray-600">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <span>{formatDate(contact.createdAt)}</span>
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-5 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleDelete(contact.contactId, contact.name)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all inline-flex items-center justify-center cursor-pointer"
                            aria-label={`Delete message from ${contact.name}`}
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Pagination Panel */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between mt-6 bg-white border border-gray-100 rounded-2xl px-6 py-4 shadow-sm gap-4">
              <div className="text-sm text-gray-500" aria-live="polite">
                Showing <span className="font-semibold text-gray-800">{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
                <span className="font-semibold text-gray-800">
                  {Math.min(currentPage * itemsPerPage, filteredContacts.length)}
                </span>{" "}
                of <span className="font-semibold text-gray-800">{filteredContacts.length}</span> inquiries
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`p-2 border border-gray-200 rounded-xl inline-flex items-center text-sm font-medium transition-colors ${currentPage === 1
                    ? "text-gray-300 bg-gray-50/50 cursor-not-allowed"
                    : "text-gray-700 hover:bg-gray-50 hover:text-black cursor-pointer"
                    }`}
                  aria-label="Previous page"
                >
                  <ChevronLeftIcon className="h-5 w-5" />
                </button>

                <div className="flex gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-9 h-9 rounded-xl border text-sm font-semibold transition-all cursor-pointer flex items-center justify-center ${currentPage === pageNum
                          ? "bg-black text-white border-black shadow-sm"
                          : "border-gray-200 text-gray-600 hover:bg-gray-50"
                          }`}
                        aria-label={`Page ${pageNum}`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  {totalPages > 5 && currentPage < totalPages - 2 && (
                    <span className="w-9 h-9 flex items-center justify-center text-gray-400">...</span>
                  )}
                  {totalPages > 5 && currentPage < totalPages - 2 && (
                    <button
                      onClick={() => setCurrentPage(totalPages)}
                      className="w-9 h-9 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 cursor-pointer flex items-center justify-center"
                      aria-label={`Page ${totalPages}`}
                    >
                      {totalPages}
                    </button>
                  )}
                </div>

                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`p-2 border border-gray-200 rounded-xl inline-flex items-center text-sm font-medium transition-colors ${currentPage === totalPages
                    ? "text-gray-300 bg-gray-50/50 cursor-not-allowed"
                    : "text-gray-700 hover:bg-gray-50 hover:text-black cursor-pointer"
                    }`}
                  aria-label="Next page"
                >
                  <ChevronRightIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      <ConfirmDeleteModal
        isOpen={deleteModal.isOpen}
        onClose={() =>
          setDeleteModal({ isOpen: false, contactId: null, name: "", isDeleting: false })
        }
        onConfirm={confirmDelete}
        itemType="contact request"
        itemName={deleteModal.name}
        isDeleting={deleteModal.isDeleting}
      />
    </div>
  );
};

export default Contact;