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

const Fabrics = () => {
  const [categoryData, setCategoryData] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [fabricData, setFabricData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    f_id: null,
    cate_id: null,
  });
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    f_id: null,
    cate_id: null,
    name: "",
  });

  // ✅ Fetch all categories
  const fetchCategories = async () => {
    try {
      const response = await adminAxios.get(`${ApiURL}/getcategory`);
      setCategoryData(response?.data?.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategoryData([]);
    }
  };


  const fetchFabrics = async () => {
    try {
      const response = await adminAxios.get(`${ApiURL}/getfabrics`);
      if (response?.data?.status) setFabricData(response?.data?.data);
      else setFabricData([]);
    } catch (error) {
      console.error("Error fetching fabrics:", error);
      setFabricData([]);
    }
  };

  useEffect(() => {
    fetchFabrics();
    fetchCategories();
  }, []);

  // ✅ Submit (Add/Edit)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!formData.cate_id) {
        showToaster(0, "Please select a category");
        return;
      }

      if (isEdit) {
        const response = await adminAxios.put(
          `${ApiURL}/updatefabric`,
          formData
        );
        showToaster(response?.data?.status, response?.data?.description);
      } else {
        const response = await adminAxios.post(
          `${ApiURL}/addfabric`,
          formData
        );
        showToaster(response?.data?.status, response?.data?.description);
      }

      fetchFabrics();
      setIsModalOpen(false);
      setFormData({ name: "", f_id: null, cate_id: null });
      setIsEdit(false);
    } catch (error) {
      showToaster(0, error?.response?.data?.description || "Error saving fabric");
    }
  };

  const handleDelete = (f_id) => {
    setDeleteModal({ isOpen: true, f_id });
  };

  const confirmDelete = async () => {
    try {
      const response = await adminAxios.post(
        `${ApiURL}/deletefabric`,
        {
          f_id: deleteModal.f_id,
        }
      );
      showToaster(response?.data?.status, response?.data?.description);
      if (response?.data?.status) fetchFabrics();
    } catch (error) {
      console.error(error);
      showToaster(0, "Error deleting fabric");
    } finally {
      setDeleteModal({ isOpen: false, f_id: null, name: "" });
    }
  };

  const filterFabrics = fabricData?.filter((fabric) =>
    fabric?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="pb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Fabrics Management</h1>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <input
            type="text"
            placeholder="Search fabrics..."
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            onClick={() => {
              setIsEdit(false);
              setFormData({ name: "", f_id: null, cate_id: null });
              setIsModalOpen(true);
            }}
            className="w-full flex items-center justify-center gap-2 bg-black text-white px-4 py-2 rounded-lg transition-colors cursor-pointer"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Add Fabric</span>
          </button>
        </div>
      </div>

      {/* Table */}
      {filterFabrics?.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500 text-lg">No Fabric found</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Fabric Name
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
              {filterFabrics?.map((fabric) => (
                <tr key={fabric?.f_id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {fabric?.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {categoryData?.find(
                      (cat) => cat.cate_id === fabric?.cate_id
                    )?.cate_name || "—"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => {
                        setIsEdit(true);
                        setFormData({
                          name: fabric?.name,
                          f_id: fabric?.f_id,
                          cate_id: fabric?.cate_id,
                        });
                        setIsModalOpen(true);
                      }}
                      className="text-black mr-4 cursor-pointer"
                    >
                      <PencilSquareIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(fabric?.f_id)}
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {isEdit ? "Edit Fabric" : "Add New Fabric"}
            </h2>
            <form onSubmit={handleSubmit}>
              {/* Fabric Name */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fabric Name
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

              {/* Category Dropdown */}
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
                  {categoryData.map((cat) => (
                    <option key={cat.cate_id} value={cat.cate_id}>
                      {cat.cate_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 cursor-pointer"
                >
                  {isEdit ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDeleteModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, f_id: null, name: "" })}
        onConfirm={confirmDelete}
        itemType="fabric"
        itemName={deleteModal.name}
      />
    </div>
  );
};

export default Fabrics;
