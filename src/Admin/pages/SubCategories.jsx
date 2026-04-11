// import { useState, useEffect } from "react";
// import {
//   PlusIcon,
//   TrashIcon,
//   ArrowPathIcon,
//   PencilSquareIcon,
// } from "@heroicons/react/24/outline";
// import axiosInstance from "../../Axios/axios";
// import { ApiURL, showToaster } from "../../Variable";
// import ConfirmDeleteModal from "./ConfirmDeleteModal";

// const SubCategories = () => {
//   const [isEdit, setIsEdit] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [subCategoryData, setSubCategoryData] = useState([]);
//   const [categoryData, setCategoryData] = useState([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [mediaPreview, setMediaPreview] = useState(null);
//   const [mediaType, setMediaType] = useState(null);
//   const [formData, setFormData] = useState({
//     name: "",
//     cate_id: null,
//     subCate_image: null,
//   });
//   const [deleteModal, setDeleteModal] = useState({
//     isOpen: false,

//     name: "",
//   });

//   // Fetch categories for dropdown
//   const fetchCategories = async () => {
//     try {
//       const response = await axiosInstance.get(`${ApiURL}/getcategory`);
//       if (response?.data?.status) {
//         setCategoryData(response?.data?.data);
//       } else {
//         setCategoryData([]);
//       }
//     } catch (error) {
//       console.error("Error fetching categories:", error);
//       setCategoryData([]);
//     }
//   };

//   // Fetch subcategories
//   const fetchSubCategories = async () => {
//     try {
//       setLoading(true);
//       const response = await axiosInstance.get(`${ApiURL}/getsubcategory`);
//       if (response?.data?.status) {
//         setSubCategoryData(response?.data?.data);
//       } else {
//         setSubCategoryData([]);
//       }
//     } catch (error) {
//       console.error("Error fetching subcategories:", error);
//       setSubCategoryData([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleMediaChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setFormData({ ...formData, subCate_image: file });
//       setMediaPreview(URL.createObjectURL(file));
//       setMediaType(file.type.startsWith("video/") ? "video" : "image");
//     }
//   };

//   useEffect(() => {
//     fetchCategories();
//     fetchSubCategories();
//   }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const payload = new FormData();
//       payload.append("name", formData.name);
//       payload.append("cate_id", formData.cate_id);
//       if (isEdit) payload.append("sc_id", formData.sc_id);
//       if (formData.subCate_image)
//         payload.append("subCategoryImage", formData.subCate_image);

//       if (isEdit) {
//         const response = await axiosInstance.put(
//           `${ApiURL}/updatesubcategory`,
//           payload
//         );
//         showToaster(response?.data?.status, response?.data?.description);
//       } else {
//         const response = await axiosInstance.post(
//           `${ApiURL}/addsubcategory`,
//           payload
//         );
//         showToaster(response?.data?.status, response?.data?.description);
//       }
//       fetchSubCategories();
//       setIsModalOpen(false);
//       setFormData({ name: "", cate_id: null, subCate_image: null });
//       setIsEdit(false);
//     } catch (error) {
//       console.error(error);
//       showToaster(0, "Error saving subcategory");
//     }
//   };

//   const handleDelete = (sc_id, name) => {
//     setDeleteModal({ isOpen: true, sc_id, name });
//   };

//   const confirmDelete = async () => {
//     try {
//       const response = await axiosInstance.delete(
//         `${ApiURL}/deletesubcategory/${deleteModal.sc_id}`,
//       );
//       showToaster(response?.data?.status, response?.data?.description);
//       if (response?.data?.status) fetchSubCategories();
//     } catch (error) {
//       console.error(error);
//       showToaster(0, "Error deleting subcategory");
//     } finally {
//       setDeleteModal({ isOpen: false, name: "" });
//     }
//   };

//   const filteredSubCategories = subCategoryData?.filter((subcategory) =>
//     subcategory?.name.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div className="container mx-auto px-4 py-6">
//       <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
//         <h1 className="text-2xl font-bold text-gray-800">
//           Subcategory Management
//         </h1>

//         <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
//           <input
//             type="text"
//             placeholder="Search subcategories..."
//             className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//           <button
//             onClick={() => {
//               setIsEdit(false);
//               setFormData({ name: "", cate_id: null, subCate_image: null });

//               setIsModalOpen(true);
//             }}
//             className="w-full flex items-center justify-center gap-2 bg-black text-white px-4 py-2 rounded-lg transition-colors"
//           >
//             <PlusIcon className="h-5 w-5" />
//             <span>Add Subcategory</span>
//           </button>
//         </div>
//       </div>

//       {loading ? (
//         <div className="flex justify-center items-center h-64">
//           <ArrowPathIcon className="h-12 w-12 text-gray-400 animate-spin" />
//         </div>
//       ) : filteredSubCategories?.length === 0 ? (
//         <div className="text-center py-10">
//           <p className="text-gray-500 text-lg">No subcategories found</p>
//         </div>
//       ) : (
//         <div className="bg-white rounded-lg shadow overflow-hidden">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Subcategory Name
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Media
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Parent Category
//                 </th>

//                 <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Actions
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {filteredSubCategories?.map((subcategory) => (
//                 <tr key={subcategory?.sc_id}>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="text-sm text-gray-900">
//                       <span className="bg-gray-100 px-3 py-1 rounded-full text-gray-700">
//                         {subcategory?.name}
//                       </span>
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     {subcategory?.subCate_image ? (
//                       subcategory?.subCate_image.match(/\.(mp4|webm|ogg)$/i) ? (
//                         <video
//                           src={`${ApiURL}/assets/SubCategory/${subcategory?.subCate_image}`}
//                           className="h-10 w-10 object-cover rounded"
//                           controls
//                         />
//                       ) : (
//                         <img
//                           src={`${ApiURL}/assets/SubCategory/${subcategory?.subCate_image}`}
//                           alt={subcategory?.name}
//                           className="h-10 w-10 object-cover rounded"
//                         />
//                       )
//                     ) : (
//                       <span className="text-gray-500">No Media</span>
//                     )}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="text-sm text-gray-900">
//                       {subcategory?.category?.cate_name || "N/A"}
//                     </div>
//                   </td>

//                   <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                     <button
//                       onClick={() => {
//                         setIsEdit(true);
//                         setFormData({
//                           name: subcategory?.name,
//                           sc_id: subcategory?.sc_id,
//                           cate_id: subcategory?.cate_id,
//                           subCate_image: null,
//                         });
//                         setMediaPreview(
//                           subcategory?.cate_image
//                             ? `${ApiURL}/assets/SubCategory/${subcategory?.cate_image}`
//                             : null
//                         );
//                         setMediaType(
//                           subcategory?.subCate_image?.match(
//                             /\.(mp4|webm|ogg)$/i
//                           )
//                             ? "video"
//                             : subcategory?.subCate_image
//                             ? "image"
//                             : null
//                         );
//                         setIsModalOpen(true);
//                       }}
//                       className="text-black mr-4"
//                     >
//                       <PencilSquareIcon className="h-5 w-5" />
//                     </button>
//                     <button
//                       onClick={() =>
//                         handleDelete(subcategory?.sc_id, subcategory?.name)
//                       }
//                       className="text-red-600 hover:text-red-900"
//                     >
//                       <TrashIcon className="h-5 w-5" />
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}

//       {isModalOpen && (
//         <div className="fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-lg p-6 w-full max-w-md">
//             <h2 className="text-xl font-bold mb-4">
//               {isEdit ? "Edit Subcategory" : "Add New Subcategory"}
//             </h2>
//             <form onSubmit={handleSubmit}>
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Subcategory Name
//                 </label>
//                 <input
//                   autoFocus
//                   type="text"
//                   className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
//                   value={formData?.name}
//                   onChange={(e) =>
//                     setFormData({ ...formData, name: e.target.value })
//                   }
//                   required
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Parent Category
//                 </label>
//                 <select
//                   className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
//                   value={formData?.cate_id || ""}
//                   onChange={(e) =>
//                     setFormData({ ...formData, cate_id: e.target.value })
//                   }
//                   required
//                 >
//                   <option value="" disabled>
//                     Select a category
//                   </option>
//                   {categoryData?.map((category) => (
//                     <option key={category.cate_id} value={category.cate_id}>
//                       {category.cate_name}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   SubCategory Media (Image or Video)
//                 </label>
//                 <input
//                   type="file"
//                   accept="image/*,video/*"
//                   className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
//                   onChange={handleMediaChange}
//                 />
//                 {mediaPreview && (
//                   <div className="mt-2">
//                     {mediaType === "video" ? (
//                       <video
//                         src={mediaPreview}
//                         className="h-20 w-20 object-cover rounded"
//                         controls
//                       />
//                     ) : (
//                       <img
//                         src={mediaPreview}
//                         alt="Preview"
//                         className="h-20 w-20 object-cover rounded"
//                       />
//                     )}
//                   </div>
//                 )}
//               </div>
//               <div className="flex justify-end gap-3">
//                 <button
//                   type="button"
//                   onClick={() => {
//                     setIsModalOpen(false);
//                   }}
//                   className="px-4 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all duration-200 shadow-sm text-sm font-medium"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="px-4 py-2 bg-black text-white rounded-lg hover:bg-black"
//                 >
//                   {isEdit ? "Update" : "Create"}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//       <ConfirmDeleteModal
//         isOpen={deleteModal.isOpen}
//         onClose={() => setDeleteModal({ isOpen: false, name: "" })}
//         onConfirm={confirmDelete}
//         itemType="subcategory"
//         itemName={deleteModal.name}
//       />
//     </div>
//   );
// };

// export default SubCategories;

import { useState, useEffect } from "react";
import {
  PlusIcon,
  TrashIcon,
  ArrowPathIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";
import axiosInstance from "../../Axios/axios";
import { ApiURL, showToaster, getFullImageUrl } from "../../Variable";
import ConfirmDeleteModal from "./ConfirmDeleteModal";

const SubCategories = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [subCategoryData, setSubCategoryData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [mediaType, setMediaType] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    cate_id: null,
    subCate_image: null,
    meta_title: "",
    meta_description: "",
  });
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    sc_id: null,
    name: "",
  });

  // Fetch categories for dropdown
  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get(`${ApiURL}/getcategory`);
      if (response?.data?.status) {
        setCategoryData(response?.data?.data);
      } else {
        setCategoryData([]);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategoryData([]);
    }
  };

  // Fetch subcategories (updated to include SEO fields)
  const fetchSubCategories = async () => {
    try {
      const response = await axiosInstance.get(`${ApiURL}/getsubcategory`);
      if (response?.data?.status) {
        setSubCategoryData(response?.data?.data);
      } else {
        setSubCategoryData([]);
      }
    } catch (error) {
      console.error("Error fetching subcategories:", error);
      setSubCategoryData([]);
    }
  };

  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, subCate_image: file });
      setMediaPreview(URL.createObjectURL(file));
      setMediaType(file.type.startsWith("video/") ? "video" : "image");
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchSubCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = new FormData();
      payload.append("name", formData.name);
      payload.append("cate_id", formData.cate_id);
      payload.append("meta_title", formData.meta_title || "");
      payload.append("meta_description", formData.meta_description || "");

      if (isEdit) payload.append("sc_id", formData.sc_id);
      if (formData.subCate_image)
        payload.append("subCategoryImage", formData.subCate_image);

      let response;
      if (isEdit) {
        response = await axiosInstance.put(
          `${ApiURL}/updatesubcategory`,
          payload
        );
      } else {
        response = await axiosInstance.post(
          `${ApiURL}/addsubcategory`,
          payload
        );
      }

      showToaster(response?.data?.status, response?.data?.description);
      fetchSubCategories();
      setIsModalOpen(false);
      setFormData({
        name: "",
        cate_id: null,
        subCate_image: null,
        meta_title: "",
        meta_description: "",
      });
      setIsEdit(false);
    } catch (error) {
      console.error(error);
      showToaster(0, "Error saving subcategory");
    }
  };

  const handleEdit = (subcategory) => {
    setIsEdit(true);
    setFormData({
      sc_id: subcategory.sc_id,
      name: subcategory.name,
      cate_id: subcategory.cate_id,
      meta_title: subcategory.meta_title || "",
      meta_description: subcategory.meta_description || "",
      subCate_image: null, // reset file input
    });
    setMediaPreview(
      subcategory.subCate_image
        ? getFullImageUrl(subcategory.subCate_image, "SubCategory")
        : subcategory.image
          ? getFullImageUrl(subcategory.image, "SubCategory")
          : null
    );
    setMediaType(
      (subcategory.subCate_image || subcategory.image)?.match(/\.(mp4|webm|ogg)$/i)
        ? "video"
        : (subcategory.subCate_image || subcategory.image)
          ? "image"
          : null
    );
    setIsModalOpen(true);
  };

  const handleDelete = (sc_id, name) => {
    setDeleteModal({ isOpen: true, sc_id, name });
  };

  const confirmDelete = async () => {
    try {
      const response = await axiosInstance.delete(
        `${ApiURL}/deletesubcategory/${deleteModal.sc_id}`
      );
      showToaster(response?.data?.status, response?.data?.description);
      if (response?.data?.status) fetchSubCategories();
    } catch (error) {
      console.error(error);
      showToaster(0, "Error deleting subcategory");
    } finally {
      setDeleteModal({ isOpen: false, sc_id: null, name: "" });
    }
  };

  const filteredSubCategories = subCategoryData?.filter((subcategory) =>
    (subcategory?.name || "").toLowerCase().includes((searchTerm || "").toLowerCase())
  );

  return (
    <div className="pb-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">
          Subcategory Management
        </h1>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <input
            type="text"
            placeholder="Search subcategories..."
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            onClick={() => {
              setIsEdit(false);
              setFormData({
                name: "",
                cate_id: null,
                subCate_image: null,
                meta_title: "",
                meta_description: "",
              });
              setMediaPreview(null);
              setMediaType(null);
              setIsModalOpen(true);
            }}
            className="w-full flex items-center justify-center gap-2 bg-black text-white px-4 py-2 rounded-lg transition-colors"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Add Subcategory</span>
          </button>
        </div>
      </div>

      {filteredSubCategories?.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500 text-lg">No subcategories found</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Subcategory Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Media
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Parent Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Meta Title
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSubCategories?.map((subcategory) => (
                <tr key={subcategory?.sc_id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    <div className="text-sm text-gray-900">
                      <span className="bg-gray-100 px-3 py-1 rounded-full text-gray-700">
                        {subcategory?.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {subcategory?.subCate_image || subcategory?.image ? (
                      (subcategory?.subCate_image || subcategory?.image)?.match(/\.(mp4|webm|ogg)$/i) ? (
                        <video
                          src={getFullImageUrl(subcategory?.subCate_image || subcategory?.image, "SubCategory")}
                          className="h-10 w-10 object-cover rounded"
                          controls
                        />
                      ) : (
                        <img
                          src={getFullImageUrl(subcategory?.subCate_image || subcategory?.image, "SubCategory")}
                          alt={subcategory?.name}
                          className="h-10 w-10 object-cover rounded"
                        />
                      )
                    ) : (
                      <span className="text-gray-500">No Media</span>
                    )}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-700">
                      {subcategory?.category?.cate_name || "N/A"}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-700 line-clamp-2 max-w-xs">
                      {subcategory?.meta_title || "—"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEdit(subcategory)}
                      className="text-black mr-4"
                    >
                      <PencilSquareIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() =>
                        handleDelete(subcategory?.sc_id, subcategory?.name)
                      }
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
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              {isEdit ? "Edit Subcategory" : "Add New Subcategory"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subcategory Name *
                </label>
                <input
                  autoFocus
                  type="text"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>

              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Parent Category *
                </label>
                <select
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
                  value={formData.cate_id || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, cate_id: e.target.value })
                  }
                  required
                >
                  <option value="" disabled>
                    Select a category
                  </option>
                  {categoryData?.map((category) => (
                    <option key={category.cate_id} value={category.cate_id}>
                      {category.cate_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* SEO Fields */}
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Meta Title (for Google search)
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
                  value={formData.meta_title}
                  onChange={(e) =>
                    setFormData({ ...formData, meta_title: e.target.value })
                  }
                  placeholder="e.g. Women's Ethnic Wear - Latest Collection"
                  maxLength={100}
                />
              </div>

              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Meta Description (search snippet)
                </label>
                <textarea
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
                  rows={3}
                  value={formData.meta_description}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      meta_description: e.target.value,
                    })
                  }
                  placeholder="Describe the subcategory in 150-160 characters..."
                />
              </div>

              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  SubCategory Media (Image or Video)
                </label>
                <input
                  type="file"
                  accept="image/*,video/*"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
                  onChange={handleMediaChange}
                />
                {mediaPreview && (
                  <div className="mt-3">
                    {mediaType === "video" ? (
                      <video
                        src={mediaPreview}
                        className="h-24 w-24 object-cover rounded"
                        controls
                      />
                    ) : (
                      <img
                        src={mediaPreview}
                        alt="Preview"
                        className="h-24 w-24 object-cover rounded"
                      />
                    )}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all duration-200 shadow-sm text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-black text-white rounded-xl hover:bg-gray-900 transition-all duration-200 shadow-sm text-sm font-medium"
                >
                  {isEdit ? "Update Subcategory" : "Create Subcategory"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDeleteModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, sc_id: null, name: "" })}
        onConfirm={confirmDelete}
        itemType="subcategory"
        itemName={deleteModal.name}
      />
    </div>
  );
};

export default SubCategories;
