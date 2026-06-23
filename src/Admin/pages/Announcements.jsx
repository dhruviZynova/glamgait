import { useState, useEffect } from "react";
import { Loader2, Inbox } from "lucide-react";
import {
  PlusIcon,
  TrashIcon,
  ArrowPathIcon,
  PencilSquareIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { adminAxios } from "../../Axios/axios";
import { ApiURL, showToaster } from "../../Variable";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
// 
const Announcement = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [announcements, setAnnouncements] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    text: "",
    ann_id: null,
  });
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    ann_id: null,
    text: "",
    isDeleting: false,
  });

  // Fetch announcements
  const fetchAnnouncements = async () => {
    try {
      const response = await adminAxios.get(`${ApiURL}/getannouncements`);
      if (response?.data?.status) setAnnouncements(response?.data?.data);
      else setAnnouncements([]);
    } catch (error) {
      console.error("Error fetching announcements:", error);
      setAnnouncements([]);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  // Add / Update announcement
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      let response;
      if (isEdit) {
        response = await adminAxios.put(`${ApiURL}/updateannouncement`, {
          ann_id: formData.ann_id,
          text: formData.text,
        });
      } else {
        response = await adminAxios.post(`${ApiURL}/addannouncement`, {
          text: formData.text,
        });
      }

      showToaster(response?.data?.status, response?.data?.description);
      fetchAnnouncements();
      setIsModalOpen(false);
      setFormData({ text: "", ann_id: null });
      setIsEdit(false);
    } catch (error) {
      console.error(error);
      showToaster(0, "Error saving announcement");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete announcement
  const handleDelete = (ann_id, text) => {
    setDeleteModal({ isOpen: true, ann_id, text });
  };

  const confirmDelete = async () => {
    setDeleteModal((prev) => ({ ...prev, isDeleting: true }));
    try {
      const response = await adminAxios.delete(
        `${ApiURL}/deleteannouncement/${deleteModal.ann_id}`
      );
      showToaster(response?.data?.status, response?.data?.description);
      if (response?.data?.status) fetchAnnouncements();
    } catch (error) {
      console.error(error);
      showToaster(0, "Error deleting announcement");
    } finally {
      setDeleteModal({ isOpen: false, ann_id: null, text: "", isDeleting: false });
    }
  };

  // Filter announcements by text
  const filteredAnnouncements = announcements?.filter((item) =>
    item?.text?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="pb-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">
          Announcement Management
        </h1>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search announcements..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          <button
            onClick={() => {
              setIsEdit(false);
              setFormData({ text: "", ann_id: null });
              setIsModalOpen(true);
            }}
            className="flex items-center justify-center gap-2 bg-black text-white px-4 py-2 rounded-lg transition-colors cursor-pointer"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Add Announcement</span>
          </button>
        </div>
      </div>

      {/* Table Section */}
      {announcements === null ? (
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
      ) : filteredAnnouncements?.length === 0 ? (
        <div className="col-span-full flex flex-col items-center justify-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 border border-gray-200 flex items-center justify-center mb-4 shadow-sm">
            <Inbox className="w-7 h-7 text-gray-400" />
          </div>
          <p className="text-sm font-semibold text-gray-700 mb-1">
            {searchTerm ? "No matching announcements found" : "No announcements yet"}
          </p>
          <p className="text-xs text-gray-400">
            {searchTerm ? "Try adjusting your search term" : "Add your first announcement above"}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Announcement Text
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAnnouncements?.map((item) => (
                <tr key={item?.ann_id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {item?.text || "—"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => {
                        setIsEdit(true);
                        setFormData({
                          text: item?.text,
                          ann_id: item?.ann_id,
                        });
                        setIsModalOpen(true);
                      }}
                      className="text-black mr-4 cursor-pointer"
                    >
                      <PencilSquareIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(item?.ann_id, item?.text)}
                      className="text-red-600 hover:text-red-900 cursor-pointer"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {isEdit ? "Edit Announcement" : "Add New Announcement"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Announcement Text
                </label>
                <textarea
                  autoFocus
                  rows={3}
                  placeholder="Enter announcement text..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none"
                  value={formData?.text}
                  onChange={(e) =>
                    setFormData({ ...formData, text: e.target.value })
                  }
                  required
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all duration-200 shadow-sm text-sm font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-black cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {isEdit ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={deleteModal.isOpen}
        onClose={() =>
          setDeleteModal({ isOpen: false, ann_id: null, text: "", isDeleting: false })
        }
        onConfirm={confirmDelete}
        itemType="announcement"
        itemName={deleteModal.text}
        isDeleting={deleteModal.isDeleting}
      />
    </div>
  );
};

export default Announcement;
