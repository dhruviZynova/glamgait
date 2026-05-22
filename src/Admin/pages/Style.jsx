import { useEffect, useState, useRef } from "react";
import { ChevronDown } from "lucide-react";
import { ApiURL, showToaster } from "../../Variable";
import { adminAxios } from "../../Axios/axios";
import {
  PlusIcon,
  TrashIcon,
  ArrowPathIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";
import ConfirmDeleteModal from "./ConfirmDeleteModal";

const Styles = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [categoryData, setCategoryData] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const [searchTerm, setSearchTerm] = useState("");
  const [styleData, setStyleData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    style_id: null,
    cate_id: null,
  });
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    style_id: null,
    name: "",
  });

  // Fetch Styles
  const fetchStyles = async () => {
    try {
      const response = await adminAxios.get(`${ApiURL}/getstyles`);
      if (response?.data?.status) setStyleData(response?.data?.data);
      else setStyleData([]);
    } catch (error) {
      console.error("Error fetching styles:", error);
      setStyleData([]);
    }
  };

  // Fetch Categories
  const fetchCategories = async () => {
    try {
      const response = await adminAxios.get(`${ApiURL}/getcategory`);
      setCategoryData(response?.data?.data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategoryData([]);
    }
  };

  useEffect(() => {
    fetchStyles();
    fetchCategories();
  }, []);

  // Add / Edit Style
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) {
        const response = await adminAxios.put(
          `${ApiURL}/updatestyle`,
          formData
        );
        showToaster(response?.data?.status, response?.data?.description);
      } else {
        const response = await adminAxios.post(
          `${ApiURL}/addstyle`,
          formData
        );
        showToaster(response?.data?.status, response?.data?.description);
      }
      fetchStyles();
      setIsModalOpen(false);
      setFormData({ name: "", style_id: null, cate_id: "" });
      setIsEdit(false);
    } catch (error) {
      console.error(error);
      showToaster(0, "Error saving style");
    }
  };

  // Delete Style
  const handleDelete = (style_id) => {
    setDeleteModal({ isOpen: true, style_id });
  };

  const confirmDelete = async () => {
    try {
      const response = await adminAxios.post(
        `${ApiURL}/deletestyle`,
        {
          style_id: deleteModal.style_id,
        }
      );
      showToaster(response?.data?.status, response?.data?.description);
      if (response?.data?.status) fetchStyles();
    } catch (error) {
      console.error(error);
      showToaster(0, "Error deleting style");
    } finally {
      setDeleteModal({ isOpen: false, style_id: null, name: "" });
    }
  };

  // Filter Styles by search
  const filterStyles = styleData?.filter((style) =>
    style?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800 text-left">Styles Management</h1>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <input
            type="text"
            placeholder="Search styles..."
            className="w-full px-4 py-2 border rounded-lg focus:outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            onClick={() => {
              setIsEdit(false);
              setFormData({ name: "", style_id: null, cate_id: "" });
              setIsModalOpen(true);
            }}
            className="w-full flex items-center justify-center gap-2 bg-black text-white px-4 py-2 rounded-lg transition-colors cursor-pointer"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Add Style</span>
          </button>
        </div>
      </div>

      {filterStyles?.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500 text-lg">No Styles found</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Style Name
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
              {filterStyles?.map((style) => (
                <tr key={style?.style_id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <span className="bg-gray-100 px-3 py-1 rounded-full text-gray-700 capitalize">
                        {style?.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 capitalize">
                    {categoryData?.find((cat) => cat.cate_id === style?.cate_id)
                      ?.cate_name || "—"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => {
                        setIsEdit(true);
                        setFormData({
                          name: style?.name,
                          style_id: style?.style_id,
                          cate_id: style?.cate_id,
                        });
                        setIsModalOpen(true);
                      }}
                      className="text-black mr-4 cursor-pointer"
                    >
                      <PencilSquareIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(style?.style_id)}
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
        <div className="fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {isEdit ? "Edit Style" : "Add New Style"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Style Name
                </label>
                <input
                  autoFocus
                  type="text"
                  placeholder="Enter Style Name"
                  className="w-full px-3 py-2 capitalize border border-gray-200 rounded-lg focus:outline-none"
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
                <div className="relative" ref={dropdownRef}>
                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center justify-between w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 bg-white cursor-pointer focus:outline-none"
                  >
                    <span>
                      {categoryData.find(cat => String(cat.cate_id) === String(formData?.cate_id))?.cate_name || "-- Select Category --"}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isDropdownOpen ? "rotate-180 text-[#0f1115]" : ""
                        }`}
                    />
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute left-0 w-full mt-1 bg-white rounded-lg shadow-xl border border-gray-200 overflow-y-auto max-h-60 z-[100] transform origin-top transition-all duration-200">
                      <button
                        type="button"
                        onClick={() => {
                          setFormData({ ...formData, cate_id: "" });
                          setIsDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 text-sm transition-colors cursor-pointer flex items-center justify-between ${!formData?.cate_id
                          ? "bg-[#0f1115]/10 text-[#0f1115] font-semibold"
                          : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                          }`}
                      >
                        <span>-- Select Category --</span>
                        {!formData?.cate_id && (
                          <svg
                            className="w-4 h-4 text-[#0f1115]"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2.5"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        )}
                      </button>
                      {categoryData.map((cat) => {
                        const isSelected = String(cat.cate_id) === String(formData?.cate_id);
                        return (
                          <button
                            key={cat.cate_id}
                            type="button"
                            onClick={() => {
                              setFormData({ ...formData, cate_id: cat.cate_id });
                              setIsDropdownOpen(false);
                            }}
                            className={`w-full text-left px-4 py-2.5 text-sm transition-colors cursor-pointer flex items-center justify-between ${isSelected
                              ? "bg-[#0f1115]/10 text-[#0f1115] font-semibold"
                              : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                              }`}
                          >
                            <span>{cat.cate_name}</span>
                            {isSelected && (
                              <svg
                                className="w-4 h-4 text-[#0f1115]"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2.5"
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
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

      <ConfirmDeleteModal
        isOpen={deleteModal.isOpen}
        onClose={() =>
          setDeleteModal({ isOpen: false, style_id: null, name: "" })
        }
        onConfirm={confirmDelete}
        itemType="style"
        itemName={deleteModal.name}
      />
    </div>
  );
};

export default Styles;
