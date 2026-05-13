import { useEffect, useState } from "react";
import { ApiURL, showToaster } from "../../Variable";
import { adminAxios } from "../../Axios/axios";
import {
  PlusIcon,
  TrashIcon,
  ArrowPathIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";
import ConfirmDeleteModal from "./ConfirmDeleteModal";

const Occasions = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [categoryData, setCategoryData] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [occasionData, setOccasionData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    occasion_id: null,
    cate_id: null,
  });
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    occasion_id: null,
    cate_id: null,
    name: "",
  });

  const fetchOccasions = async () => {
    try {
      const response = await adminAxios.get(`${ApiURL}/getoccasions`);
      if (response?.data?.status) setOccasionData(response?.data?.data);
      else setOccasionData([]);
    } catch (error) {
      console.error("Error fetching occasions:", error);
      setOccasionData([]);
    }
  };
  const fetchCategories = async () => {
    try {
      const response = await adminAxios.get(`${ApiURL}/getcategory`);
      setCategoryData(response?.data?.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategoryData([]);
    }
  };

  useEffect(() => {
    fetchOccasions();
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) {
        const response = await adminAxios.put(
          `${ApiURL}/updateoccasion`,
          formData
        );
        showToaster(response?.data?.status, response?.data?.description);
      } else {
        const response = await adminAxios.post(
          `${ApiURL}/addoccasion`,
          formData
        );
        showToaster(response?.data?.status, response?.data?.description);
      }
      fetchOccasions();
      setIsModalOpen(false);
      setFormData({ name: "", occasion_id: null, cate_id: "" });
      setIsEdit(false);
    } catch (error) {
      showToaster(0, error?.response?.data?.description || "Error saving occasion");
    }
  };

  const handleDelete = (occasion_id) => {
    setDeleteModal({ isOpen: true, occasion_id });
  };

  const confirmDelete = async () => {
    try {
      const response = await axiosInstance.post(
        `${ApiURL}/deleteoccasion`,
        {
          occasion_id: deleteModal.occasion_id,
        }
      );
      showToaster(response?.data?.status, response?.data?.description);
      if (response?.data?.status) fetchOccasions();
    } catch (error) {
      console.error(error);
      showToaster(0, "Error deleting occasion");
    } finally {
      setDeleteModal({ isOpen: false, occasion_id: null, name: "" });
    }
  };

  const filterOccasions = occasionData?.filter((occasion) =>
    occasion?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">
          Occasions Management
        </h1>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <input
            type="text"
            placeholder="Search occasions..."
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            onClick={() => {
              setIsEdit(false);
              setFormData({ name: "", occasion_id: null });
              setIsModalOpen(true);
            }}
            className="w-full flex items-center justify-center gap-2 bg-black text-white px-4 py-2 rounded-lg transition-colors"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Add Occasion</span>
          </button>
        </div>
      </div>

      {filterOccasions?.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500 text-lg">No Occasions found</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Occasion Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Parent Category
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filterOccasions?.map((occasion) => (
                <tr key={occasion?.occasion_id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <span className="bg-gray-100 px-3 py-1 rounded-full text-gray-700">
                        {occasion?.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {categoryData?.find(
                      (cat) => cat.cate_id === occasion?.cate_id
                    )?.cate_name || "—"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => {
                        setIsEdit(true);
                        setFormData({
                          name: occasion?.name,
                          occasion_id: occasion?.occasion_id,
                        });
                        setIsModalOpen(true);
                      }}
                      className="text-black mr-4"
                    >
                      <PencilSquareIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(occasion?.occasion_id)}
                      className="text-red-600 hover:text-red-900"
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
              {isEdit ? "Edit Occasion" : "Add New Occasion"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Occasion Name
                </label>
                <input
                  autoFocus
                  type="text"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
                  value={formData?.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Category
                </label>
                <select
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
                  value={formData?.cate_id || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, cate_id: e.target.value })
                  }
                  required
                >
                  <option value="">-- Select Category --</option>
                  {categoryData?.map((cat) => (
                    <option key={cat.cate_id} value={cat.cate_id}>
                      {cat.cate_name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all duration-200 shadow-sm text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-black text-white rounded-lg hover:bg-black"
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
        onClose={() =>
          setDeleteModal({ isOpen: false, occasion_id: null, name: "" })
        }
        onConfirm={confirmDelete}
        itemType="occasion"
        itemName={deleteModal.name}
      />
    </div>
  );
};

export default Occasions;
