/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import {
  UserIcon,
  EnvelopeIcon,
  ArrowPathIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChatBubbleLeftIcon,
} from "@heroicons/react/24/outline";
import { Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { adminAxios } from "../../Axios/axios";
import { ApiURL, adminInfo } from "../../Variable";
import ConfirmDeleteModal from "./ConfirmDeleteModal";

const Contact = () => {
  const [contacts, setContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [expandedMessages, setExpandedMessages] = useState({});
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    contactId: null,
    name: "",
  });
  const userData = adminInfo();

  const fetchContacts = async (page = 1, limit = itemsPerPage, search = searchTerm) => {
    try {
      const response = await adminAxios.get(`${ApiURL}/getcontacts`, {
        params: { page, limit, search },
      });

      const { contacts, totalPages } = response.data.data || {
        contacts: [],
        totalPages: 1,
      };
      setContacts(contacts);
      setTotalPages(totalPages);
    } catch (error) {
      console.error("Error fetching contacts:", error);
    }
  };

  useEffect(() => {
    fetchContacts(currentPage);
  }, [currentPage, searchTerm]);

  const handleDelete = (contactId, name) => {
    setDeleteModal({ isOpen: true, contactId, name });
  };

  const confirmDelete = async () => {
    try {
      await adminAxios.delete(
        `${ApiURL}/deletecontact/${deleteModal.contactId}`
      );
      toast.success("Request Deleted...");
      fetchContacts(currentPage);
    } catch (error) {
      console.error("Error deleting contact:", error);
    } finally {
      setDeleteModal({ isOpen: false, contactId: null, name: "" });
    }
  };

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

  // Message display with expand/collapse
  const renderMessage = (message, contactId) => {
    const isExpanded = expandedMessages[contactId];
    const displayMessage = isExpanded
      ? message
      : `${message?.substring(0, 50)}${message?.length > 50 ? "..." : ""}`;

    return (
      <div className="flex flex-col">
        <div
          className={`text-sm text-gray-500 ${isExpanded ? "" : "line-clamp-2"
            }`}
        >
          {displayMessage}
        </div>
        {message?.length > 50 && (
          <button
            onClick={() => toggleExpandMessage(contactId)}
            className="text-xs text-black hover:text-gray-700 mt-1 self-start"
            aria-label={
              isExpanded ? "Show less of message" : "Show more of message"
            }
          >
            {isExpanded ? "Show less" : "Show more"}
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="pb-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Contact Requests</h1>
        <div className="relative flex-grow max-w-md">
          <input
            type="text"
            placeholder="Search contacts..."
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            aria-label="Search contact requests"
          />
        </div>
      </div>

      {contacts?.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500 text-lg" role="status">
            No contact requests found
          </p>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Message
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {contacts?.map((contact) => (
                    <tr key={contact.contactId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <UserIcon
                            className="flex-shrink-0 h-5 w-5 text-gray-400 mr-2"
                            aria-hidden="true"
                          />
                          <div className="text-sm font-medium text-gray-900">
                            {contact.first_name} {contact?.last_name}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <EnvelopeIcon
                            className="flex-shrink-0 h-5 w-5 text-gray-400 mr-2"
                            aria-hidden="true"
                          />
                          <div className="text-sm text-gray-500">
                            {contact.email || "No email"}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-start">
                          <ChatBubbleLeftIcon
                            className="flex-shrink-0 h-5 w-5 text-gray-400 mr-2 mt-1"
                            aria-hidden="true"
                          />
                          {renderMessage(contact.message, contact.contactId)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(contact.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() =>
                            handleDelete(contact.contact_id, contact.name)
                          }
                          className="text-red-600 hover:text-red-900"
                          aria-label={`Delete contact request from ${contact.name || "Unknown"
                            }`}
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

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 px-4 py-3 bg-white border-t rounded-b-lg">
              <div className="text-sm text-gray-700" aria-live="polite">
                Showing{" "}
                <span className="font-medium">
                  {(currentPage - 1) * itemsPerPage + 1}
                </span>{" "}
                to{" "}
                <span className="font-medium">
                  {Math.min(currentPage * itemsPerPage, contacts.length)}
                </span>{" "}
                of <span className="font-medium">{contacts.length}</span>{" "}
                results
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className={`px-3 py-1 border rounded flex items-center ${currentPage === 1
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-gray-50"
                    }`}
                  aria-label="Previous page"
                >
                  <ChevronLeftIcon className="h-4 w-4 mr-1" />
                  Previous
                </button>
                <div className="flex space-x-1">
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
                        className={`px-3 py-1 border rounded ${currentPage === pageNum
                          ? "bg-black text-white border-black"
                          : "hover:bg-gray-50"
                          }`}
                        aria-label={`Page ${pageNum}`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  {totalPages > 5 && currentPage < totalPages - 2 && (
                    <span className="px-3 py-1">...</span>
                  )}
                  {totalPages > 5 && currentPage < totalPages - 2 && (
                    <button
                      onClick={() => setCurrentPage(totalPages)}
                      className={`px-3 py-1 border rounded hover:bg-gray-50`}
                      aria-label={`Page ${totalPages}`}
                    >
                      {totalPages}
                    </button>
                  )}
                </div>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 border rounded flex items-center ${currentPage === totalPages
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-gray-50"
                    }`}
                  aria-label="Next page"
                >
                  Next
                  <ChevronRightIcon className="h-4 w-4 ml-1" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
      <ConfirmDeleteModal
        isOpen={deleteModal.isOpen}
        onClose={() =>
          setDeleteModal({ isOpen: false, contactId: null, name: "" })
        }
        onConfirm={confirmDelete}
        itemType="contact request"
        itemName={deleteModal.name}
      />
    </div>
  );
};

export default Contact;
