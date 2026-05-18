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

const Sizes = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [sizeData, setSizeData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    size_name: "",
    cate_id: "",
    size_id: null,
  });
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    size_id: null,
    name: "",
  });

  const fetchCategories = async () => {
    try {
      const response = await adminAxios.get(`${ApiURL}/getcategory`);
      if (response?.data?.status) {
        setCategories(response?.data?.data);
      } else {
        setCategories([]);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories([]);
    }
  };

  const fetchSizes = async () => {
    try {
      const response = await adminAxios.get(`${ApiURL}/getsize`);
      if (response?.data?.status) setSizeData(response?.data?.data);
      else setSizeData([]);
    } catch (error) {
      console.error("Error fetching sizes:", error);
      setSizeData([]);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchSizes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        size_name: formData?.size_name,
        cate_id: formData?.cate_id,
        ...(isEdit && { size_id: formData?.size_id }),
      };

      if (isEdit) {
        const response = await adminAxios.put(
          `${ApiURL}/updatesize`,
          payload
        );
        showToaster(response?.data?.status, response?.data?.description);
      } else {
        const response = await adminAxios.post(`${ApiURL}/addsize`, payload);
        showToaster(response?.data?.status, response?.data?.description);
      }
      fetchSizes();
      setIsModalOpen(false);
      setFormData({ size_name: "", cate_id: "", size_id: null });
      setIsEdit(false);
    } catch (error) {
      showToaster(0, error?.response?.data?.description || "Error saving size");
    }
  };

  const handleDelete = (size_id, size_name) => {
    setDeleteModal({ isOpen: true, size_id, name: size_name });
  };

  const confirmDelete = async () => {
    try {
      const response = await adminAxios.delete(`${ApiURL}/deletesize/${deleteModal.size_id}`);
      showToaster(response?.data?.status, response?.data?.description);
      if (response?.data?.status) fetchSizes();
    } catch (error) {
      showToaster(0, error?.response?.data?.description || "Error deleting size");
    } finally {
      setDeleteModal({ isOpen: false, size_id: null, name: "" });
    }
  };

  const getCategoryName = (cateId) => {
    const category = categories.find((cat) => cat.cate_id === parseInt(cateId));
    return category ? category.cate_name : cateId;
  };

  const filteredSizes = sizeData?.filter((size) =>
    size?.size_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="pb-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Size Management</h1>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <input
            type="text"
            placeholder="Search sizes..."
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            onClick={() => {
              setIsEdit(false);
              setFormData({ size_name: "", cate_id: "", size_id: null });
              setIsModalOpen(true);
            }}
            className="w-full flex items-center justify-center gap-2 bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-lg transition-colors font-medium whitespace-nowrap cursor-pointer"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Add Size</span>
          </button>
        </div>
      </div>

      {filteredSizes?.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500 text-lg">No sizes found</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Size Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSizes?.map((size) => (
                <tr key={size?.size_id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <span className="text-gray-700">
                        {size?.size_name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-700 line-clamp-2 max-w-xs">
                      {getCategoryName(size?.cate_id)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => {
                        setIsEdit(true);
                        setFormData({
                          size_name: size?.size_name,
                          cate_id: size?.cate_id,
                          size_id: size?.size_id,
                        });
                        setIsModalOpen(true);
                      }}
                      className="text-black hover:text-gray-700 mr-4 cursor-pointer"
                      aria-label={`Edit size ${size.size_name}`}
                    >
                      <PencilSquareIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(size?.size_id, size?.size_name)}
                      className="text-red-600 hover:text-red-900 cursor-pointer"
                      aria-label={`Delete size ${size.size_name}`}
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

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {isEdit ? "Edit Size" : "Add New Size"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Size Name
                </label>
                <input
                  autoFocus
                  type="text"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
                  value={formData?.size_name}
                  onChange={(e) =>
                    setFormData({ ...formData, size_name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
                  value={formData?.cate_id}
                  onChange={(e) =>
                    setFormData({ ...formData, cate_id: e.target.value })
                  }
                  required
                >
                  <option value="">Select a Category</option>
                  {categories.map((category) => (
                    <option key={category.cate_id} value={category.cate_id}>
                      {category.cate_name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all duration-200 shadow-sm text-sm font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-black text-white rounded-xl hover:bg-gray-900 transition-all duration-200 shadow-sm text-sm font-medium cursor-pointer"
                >
                  {isEdit ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDeleteModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, size_id: null, name: "" })}
        onConfirm={confirmDelete}
        itemType="size"
        itemName={deleteModal.name}
      />
    </div>
  );
};

export default Sizes;