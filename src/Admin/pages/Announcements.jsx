import { useState, useEffect } from "react";
import {
  PlusIcon,
  TrashIcon,
  ArrowPathIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";
import { adminAxios } from "../../Axios/axios";
import { ApiURL, showToaster } from "../../Variable";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
// 
const Announcement = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [announcements, setAnnouncements] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    text: "",
    ann_id: null,
  });
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    ann_id: null,
    text: "",
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
    }
  };

  // Delete announcement
  const handleDelete = (ann_id, text) => {
    setDeleteModal({ isOpen: true, ann_id, text });
  };

  const confirmDelete = async () => {
    try {
      const response = await adminAxios.delete(
        `${ApiURL}/deleteannouncement/${deleteModal.ann_id}`
      );
      showToaster(response?.data?.status, response?.data?.description);
      if (response?.data?.status) fetchAnnouncements();
    } catch (error) {
      console.error(error);
      showToaster(0, "Error deleting announcement");
    }
    setDeleteModal({ isOpen: false, ann_id: null, text: "" });
  };

  // Filter announcements by text
  const filteredAnnouncements = announcements?.filter((item) =>
    item?.text?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="pb-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">
          Announcement Management
        </h1>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <input
            type="text"
            placeholder="Search announcements..."
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            onClick={() => {
              setIsEdit(false);
              setFormData({ text: "", ann_id: null });
              setIsModalOpen(true);
            }}
            className="w-full flex items-center justify-center gap-2 bg-black text-white px-4 py-2 rounded-lg transition-colors cursor-pointer"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Add Announcement</span>
          </button>
        </div>
      </div>

      {/* Table Section */}
      {filteredAnnouncements?.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500 text-lg">No announcements found</p>
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
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
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
                  className="px-4 py-2 bg-black text-white rounded-lg hover:bg-black cursor-pointer"
                >
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
          setDeleteModal({ isOpen: false, ann_id: null, text: "" })
        }
        onConfirm={confirmDelete}
        itemType="announcement"
        itemName={deleteModal.text}
      />
    </div>
  );
};

export default Announcement;
