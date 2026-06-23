import { useState, useEffect } from "react";
import {
  PlusIcon,
  PencilSquareIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { Trash2, Loader2, Inbox } from "lucide-react";
import { adminAxios } from "../../Axios/axios";
import { ApiURL, showToaster } from "../../Variable";
import ConfirmDeleteModal from "./ConfirmDeleteModal";

const Colors = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [colorData, setColorData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    color_name: "",
    color_code: "#000000",
    color_id: null,
  });
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    color_id: null,
    color_name: "",
    isDeleting: false,
  });

  const fetchColors = async () => {
    try {
      const response = await adminAxios.get(`${ApiURL}/getcolor`);
      if (response?.data?.status) {
        setColorData(response?.data?.data);
      } else {
        setColorData([]);
      }
    } catch {
      setColorData([]);
      showToaster(0, "Error fetching colors");
    }
  };

  useEffect(() => {
    fetchColors();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        color_name: formData.color_name,
        color_code: formData.color_code,
        ...(isEdit && { color_id: formData.color_id }),
      };

      if (isEdit) {
        const response = await adminAxios.put(
          `${ApiURL}/updatecolor`,
          payload
        );
        showToaster(response?.data?.status, response?.data?.description);
      } else {
        const response = await adminAxios.post(
          `${ApiURL}/addcolor`,
          payload
        );
        showToaster(response?.data?.status, response?.data?.description);
      }
      fetchColors();
      setIsModalOpen(false);
      setFormData({ color_name: "", color_code: "#000000", color_id: null });
      setIsEdit(false);
    } catch (error) {
      console.error("Error saving color:", error);
      showToaster(0, "Error saving color");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (color_id, color_name) => {
    setDeleteModal({ isOpen: true, color_id, color_name });
  };

  const confirmDelete = async () => {
    setDeleteModal((prev) => ({ ...prev, isDeleting: true }));
    try {
      const response = await adminAxios.delete(
        `${ApiURL}/deletecolor/${deleteModal.color_id}`
      );
      showToaster(response?.data?.status, response?.data?.description);
      if (response?.data?.status) fetchColors();
    } catch (error) {
      console.error("Error deleting color:", error);
      showToaster(0, "Error deleting color");
    } finally {
      setDeleteModal({ isOpen: false, color_id: null, color_name: "", isDeleting: false });
    }
  };

  const filteredColors = colorData?.filter((color) =>
    color?.color_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="pb-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800 text-left">Color Management</h1>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search colors..."
              className="w-full pl-10 pr-4 py-2 capitalize border border-gray-300 rounded-lg focus:outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search colors"
            />
            <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          <button
            onClick={() => {
              setIsEdit(false);
              setFormData({
                color_name: "",
                color_code: "#000000",
                color_id: null,
              });
              setIsModalOpen(true);
            }}
            className="flex items-center justify-center gap-2 bg-black  text-white px-4 py-2 rounded-lg transition-colors cursor-pointer"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Add Color</span>
          </button>
        </div>
      </div>

      {colorData === null ? (
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
      ) : filteredColors?.length === 0 ? (
        <div className="col-span-full flex flex-col items-center justify-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 border border-gray-200 flex items-center justify-center mb-4 shadow-sm">
            <Inbox className="w-7 h-7 text-gray-400" />
          </div>
          <p className="text-sm font-semibold text-gray-700 mb-1" role="status">
            {searchTerm ? "No matching colors found" : "No colors yet"}
          </p>
          <p className="text-xs text-gray-400">
            {searchTerm ? "Try adjusting your search term" : "Add your first color above"}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Color Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Color Code
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredColors?.map((color) => (
                <tr key={color?.color_id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <span className="bg-gray-100 px-3 py-1 rounded-full text-gray-700">
                        {color?.color_name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div
                        className="w-6 h-6 rounded-full border border-gray-300"
                        style={{ backgroundColor: color?.color_code }}
                      ></div>
                      <span className="ml-2 text-sm text-gray-700">
                        {color?.color_code}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => {
                        setIsEdit(true);
                        setFormData({
                          color_name: color?.color_name,
                          color_code: color?.color_code,
                          color_id: color?.color_id,
                        });
                        setIsModalOpen(true);
                      }}
                      className="text-black hover:text-gray-700 mr-4 cursor-pointer"
                      aria-label={`Edit color ${color.color_name}`}
                    >
                      <PencilSquareIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() =>
                        handleDelete(color.color_id, color.color_name)
                      }
                      className="text-red-600 hover:text-red-900 cursor-pointer"
                      aria-label={`Delete color ${color.color_name}`}
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {isEdit ? "Edit Color" : "Add New Color"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Color Name
                </label>
                <input
                  autoFocus
                  type="text"
                  placeholder="Enter Color Name"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none"
                  value={formData?.color_name}
                  onChange={(e) =>
                    setFormData({ ...formData, color_name: e.target.value })
                  }
                  required
                  aria-label="Color name"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Color Code
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    className="w-12 h-10 p-1 border rounded-lg"
                    value={formData?.color_code}
                    onChange={(e) =>
                      setFormData({ ...formData, color_code: e.target.value })
                    }
                    required
                    aria-label="Select color"
                  />
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none"
                    value={formData?.color_code}
                    onChange={(e) =>
                      setFormData({ ...formData, color_code: e.target.value })
                    }
                    required
                    aria-label="Color code"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all duration-200 shadow-sm text-sm font-medium cursor-pointer"
                  aria-label="Cancel color form"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-xl hover:bg-gray-800 transition-all duration-200 shadow-sm text-sm font-medium cursor-pointer disabled:opacity-50"
                  aria-label={isEdit ? "Update color" : "Create color"}
                >
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {isEdit ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDeleteModal
        isOpen={deleteModal.isOpen}
        onClose={() =>
          setDeleteModal({ isOpen: false, color_id: null, color_name: "", isDeleting: false })
        }
        onConfirm={confirmDelete}
        itemType="color"
        itemName={deleteModal.color_name}
        isDeleting={deleteModal.isDeleting}
      />
    </div>
  );
};

export default Colors;
