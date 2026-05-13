// import { useState, useEffect } from "react";
// import {
//   PlusIcon,
//   TrashIcon,
//   ArrowPathIcon,
//   PencilSquareIcon,
// } from "@heroicons/react/24/outline";
// import axiosInstance from "../../Axios/axios";
// import { ApiURL, showToaster, userInfo } from "../../Variable";
// import ConfirmDeleteModal from "./ConfirmDeleteModal";

// const Categories = () => {
//   const userData = userInfo();

//   const [isEdit, setIsEdit] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [categoryData, setCategoryData] = useState([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [mediaPreview, setMediaPreview] = useState(null);
//   const [mediaType, setMediaType] = useState(null); // Track if media is image or video
//   const [formData, setFormData] = useState({
//     cate_name: "",
//     cate_id: null,
//     cate_image: null,
//   });
//   const [deleteModal, setDeleteModal] = useState({
//     isOpen: false,
//     cate_id: null,
//     cate_name: "",
//   });

//   const fetchCategories = async () => {
//     try {
//       setLoading(true);
//       const response = await axiosInstance.get(`${ApiURL}/getcategory`);

//       if (response?.data?.status) setCategoryData(response?.data?.data);
//       else setCategoryData([]);
//     } catch (error) {
//       console.error("Error fetching categories:", error);
//       setCategoryData([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleMediaChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setFormData({ ...formData, cate_image: file });
//       setMediaPreview(URL.createObjectURL(file));
//       setMediaType(file.type.startsWith("video/") ? "video" : "image");
//     }
//   };

//   useEffect(() => {
//     fetchCategories();
//   }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const payload = new FormData();
//       payload.append("cate_name", formData.cate_name);
//       if (isEdit) payload.append("cate_id", formData.cate_id);
//       if (formData.cate_image)
//         payload.append("categoryImage", formData.cate_image);

//       if (isEdit) {
//         const response = await axiosInstance.put(
//           `${ApiURL}/updatecategory`,
//           payload
//         );
//         showToaster(response?.data?.status, response?.data?.description);
//       } else {
//         const response = await axiosInstance.post(
//           `${ApiURL}/addcategory`,
//           payload
//         );
//         showToaster(response?.data?.status, response?.data?.description);
//       }
//       fetchCategories();
//       setIsModalOpen(false);
//       setFormData({ cate_name: "", cate_id: null, cate_image: null });
//       setMediaPreview(null);
//       setMediaType(null);
//       setIsEdit(false);
//     } catch (error) {
//       console.log(error);
//       showToaster(0, "Error saving category");
//     }
//   };

//   const handleDelete = (cate_id, cate_image) => {
//     setDeleteModal({ isOpen: true, cate_id, cate_image });
//   };

//   const confirmDelete = async () => {
//     try {
//       const response = await axiosInstance.post(
//         `${ApiURL}/deletecategory`,
//         { cate_id: deleteModal.cate_id, cate_image: deleteModal?.cate_image },
//         {
//           headers: { Authorization: `Bearer ${userData?.token}` },
//         }
//       );
//       showToaster(response?.data?.status, response?.data?.description);
//       if (response?.data?.status) fetchCategories();
//     } catch (error) {
//       console.error(error);
//       showToaster(0, "Error deleting category");
//     } finally {
//       setDeleteModal({ isOpen: false, cate_id: null, cate_name: "" });
//     }
//   };

//   const filteredCategories = categoryData?.filter((category) =>
//     category?.cate_name.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div className="container mx-auto px-4 py-6">
//       <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
//         <h1 className="text-2xl font-bold text-gray-800">
//           Category Management
//         </h1>

//         <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
//           <input
//             type="text"
//             placeholder="Search categories..."
//             className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//           <button
//             onClick={() => {
//               setIsEdit(false);
//               setFormData({ cate_name: "", cate_id: null, cate_image: null });
//               setMediaPreview(null);
//               setMediaType(null);
//               setIsModalOpen(true);
//             }}
//             className="w-full flex items-center justify-center gap-2 bg-black  text-white px-4 py-2 rounded-lg transition-colors"
//           >
//             <PlusIcon className="h-5 w-5" />
//             <span>Add Category</span>
//           </button>
//         </div>
//       </div>

//       {loading ? (
//         <div className="flex justify-center items-center h-64">
//           <ArrowPathIcon className="h-12 w-12 text-gray-400 animate-spin" />
//         </div>
//       ) : filteredCategories?.length === 0 ? (
//         <div className="text-center py-10">
//           <p className="text-gray-500 text-lg">No categories found</p>
//         </div>
//       ) : (
//         <div className="bg-white rounded-lg shadow overflow-hidden">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Category Name
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Media
//                 </th>
//                 <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Actions
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {filteredCategories?.map((category) => (
//                 <tr key={category?.cate_id}>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="text-sm text-gray-900">
//                       <span className="bg-gray-100 px-3 py-1 rounded-full text-gray-700">
//                         {category?.cate_name}
//                       </span>
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     {category?.cate_image ? (
//                       category?.cate_image.match(/\.(mp4|webm|ogg)$/i) ? (
//                         <video
//                           src={`${ApiURL}/assets/Category/${category?.cate_image}`}
//                           className="h-10 w-10 object-cover rounded"
//                           controls
//                         />
//                       ) : (
//                         <img
//                           src={`${ApiURL}/assets/Category/${category?.cate_image}`}
//                           alt={category?.cate_name}
//                           className="h-10 w-10 object-cover rounded"
//                         />
//                       )
//                     ) : (
//                       <span className="text-gray-500">No Media</span>
//                     )}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                     <button
//                       onClick={() => {
//                         setIsEdit(true);
//                         setFormData({
//                           cate_name: category?.cate_name,
//                           cate_id: category?.cate_id,
//                           cate_image: null,
//                         });
//                         setMediaPreview(
//                           category?.cate_image
//                             ? `${ApiURL}/assets/Category/${category?.cate_image}`
//                             : null
//                         );
//                         setMediaType(
//                           category?.cate_image?.match(/\.(mp4|webm|ogg)$/i)
//                             ? "video"
//                             : category?.cate_image
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
//                         handleDelete(category?.cate_id, category?.cate_image)
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
//               {isEdit ? "Edit Category" : "Add New Category"}
//             </h2>
//             <form onSubmit={handleSubmit}>
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Category Name
//                 </label>
//                 <input
//                   autoFocus
//                   type="text"
//                   className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
//                   value={formData?.cate_name}
//                   onChange={(e) =>
//                     setFormData({ ...formData, cate_name: e.target.value })
//                   }
//                   required
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Category Media (Image or Video)
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
//                     setMediaPreview(null);
//                     setMediaType(null);
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
//         onClose={() =>
//           setDeleteModal({ isOpen: false, cate_id: null, cate_name: "" })
//         }
//         onConfirm={confirmDelete}
//         itemType="category"
//         itemName={deleteModal.cate_name}
//       />
//     </div>
//   );
// };

// export default Categories;


import { useState, useEffect } from "react";
import {
  PlusIcon,
  TrashIcon,
  ArrowPathIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";
import { adminAxios } from "../../Axios/axios";
import { ApiURL, showToaster, adminInfo, getFullImageUrl } from "../../Variable";
import ConfirmDeleteModal from "./ConfirmDeleteModal";

const Categories = () => {
  const adminData = adminInfo();

  const [isEdit, setIsEdit] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryData, setCategoryData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [mediaPreview, setMediaPreview] = useState(null);
  const [mediaType, setMediaType] = useState(null);

  // ⭐ NEW: Chart Image Preview
  const [chartPreview, setChartPreview] = useState(null);

  const [formData, setFormData] = useState({
    cate_name: "",
    cate_id: null,
    cate_image: null,
    cate_chart: null, // ⭐ NEW FIELD
  });

  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    cate_id: null,
    cate_name: "",
    cate_chart: "",
  });

  const fetchCategories = async () => {
    try {
      const response = await adminAxios.get(`${ApiURL}/getcategory`);

      if (response?.data?.status) setCategoryData(response?.data?.data);
      else setCategoryData([]);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategoryData([]);
    }
  };

  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, cate_image: file });
      setMediaPreview(URL.createObjectURL(file));
      setMediaType(file.type.startsWith("video/") ? "video" : "image");
    }
  };

  // ⭐ NEW — chart image change handler
  const handleChartChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, cate_chart: file });
      setChartPreview(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = new FormData();
      payload.append("cate_name", formData.cate_name);

      if (isEdit) payload.append("cate_id", formData.cate_id);
      if (formData.cate_image)
        payload.append("categoryImage", formData.cate_image);

      // ⭐ NEW chart upload
      if (formData.cate_chart)
        payload.append("categoryChart", formData.cate_chart);

      const api = isEdit
        ? `${ApiURL}/updatecategory`
        : `${ApiURL}/addcategory`;

      const response = await adminAxios({
        method: isEdit ? "PUT" : "POST",
        url: api,
        data: payload,
      });

      fetchCategories();
      setIsModalOpen(false);
      showToaster(response?.data?.status, response?.data?.description);
      setFormData({
        cate_name: "",
        cate_id: null,
        cate_image: null,
        cate_chart: null,
      });
      setMediaPreview(null);
      setChartPreview(null);
      setMediaType(null);
      setIsEdit(false);
    } catch (error) {
      showToaster(0, error?.response?.data?.description || "Error saving category");
    }
  };

  const handleDelete = (cate_id, cate_image, cate_chart) => {
    setDeleteModal({ isOpen: true, cate_id, cate_image, cate_chart });
  };

  const confirmDelete = async () => {
    try {
      const response = await adminAxios.post(
        `${ApiURL}/deletecategory`,
        {
          cate_id: deleteModal.cate_id,
          cate_image: deleteModal.cate_image,
          cate_chart: deleteModal.cate_chart, // ⭐ include chart delete
        }
      );

      showToaster(response?.data?.status, response?.data?.description);
      if (response?.data?.status) fetchCategories();
    } catch (error) {
      console.error(error);
      showToaster(0, "Error deleting category");
    } finally {
      setDeleteModal({ isOpen: false, cate_id: null, cate_name: "" });
    }
  };

  const filteredCategories = categoryData?.filter((category) =>
    category?.cate_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="pb-8">
      {/* UI SAME AS YOURS */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">
          Category Management
        </h1>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <input
            type="text"
            placeholder="Search categories..."
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <button
            onClick={() => {
              setIsEdit(false);
              setFormData({
                cate_name: "",
                cate_id: null,
                cate_image: null,
                cate_chart: null,
              });
              setMediaPreview(null);
              setChartPreview(null);
              setMediaType(null);
              setIsModalOpen(true);
            }}
            className="w-full flex items-center justify-center gap-2 bg-black text-white px-4 py-2 rounded-lg"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Add Category</span>
          </button>
        </div>
      </div>

      {/* TABLE SECTION (UNCHANGED) */}
      {filteredCategories?.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500 text-lg">No categories found</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Category Name</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Media</th>

                {/* ⭐ NEW COLUMN */}
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Chart</th>

                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredCategories?.map((category) => (
                <tr key={category?.cate_id}>
                  <td className="px-6 py-4 text-sm text-gray-700">{category?.cate_name}</td>

                  <td className="px-6 py-4">
                    {category?.image || category?.cate_image ? (
                      (category?.image || category?.cate_image)?.match(/\.(mp4|webm|ogg)$/i) ? (
                        <video
                          src={getFullImageUrl(category?.image || category?.cate_image, "Category")}
                          className="h-10 w-10 rounded"
                          controls
                        />
                      ) : (
                        <img
                          src={getFullImageUrl(category?.image || category?.cate_image, "Category")}
                          className="h-10 w-10 rounded object-cover"
                          alt={category?.cate_name}
                        />
                      )
                    ) : (
                      <span className="text-sm text-gray-500">No Media</span>
                    )}
                  </td>


                  {/* ⭐ NEW CHART COLUMN */}
                  <td className="px-6 py-4">
                    {category?.cate_chart ? (
                      <img
                        src={getFullImageUrl(category?.cate_chart, "Category/Chart")}
                        className="h-10 w-10 rounded object-cover"
                        alt="Chart"
                      />
                    ) : (
                      <span className="text-sm text-gray-500">No Chart</span>
                    )}
                  </td>


                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => {
                        setIsEdit(true);
                        setFormData({
                          cate_name: category?.cate_name,
                          cate_id: category?.cate_id,
                          cate_image: null,
                          cate_chart: null,
                        });

                        setMediaPreview(
                          category?.image || category?.cate_image
                            ? getFullImageUrl(category?.image || category?.cate_image, "Category")
                            : null
                        );

                        setChartPreview(
                          category?.cate_chart
                            ? getFullImageUrl(category?.cate_chart, "Category/Chart")
                            : null
                        );

                        setMediaType(
                          (category?.image || category?.cate_image)?.match(/\.(mp4|webm|ogg)$/i)
                            ? "video"
                            : "image"
                        );


                        setIsModalOpen(true);
                      }}
                      className="text-black mr-4"
                    >
                      <PencilSquareIcon className="h-5 w-5" />
                    </button>

                    <button
                      onClick={() =>
                        handleDelete(
                          category?.cate_id,
                          category?.cate_image,
                          category?.cate_chart
                        )
                      }
                      className="text-red-600"
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

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {isEdit ? "Edit Category" : "Add Category"}
            </h2>

            <form onSubmit={handleSubmit}>
              {/* NAME INPUT */}
              <div className="mb-4">
                <label className="block mb-1">Category Name</label>
                <input
                  type="text"
                  className="w-full border px-3 py-2 rounded"
                  value={formData.cate_name}
                  onChange={(e) =>
                    setFormData({ ...formData, cate_name: e.target.value })
                  }
                  required
                />
              </div>

              {/* MEDIA IMAGE/VIDEO */}
              <div className="mb-4">
                <label className="block mb-1">
                  Category Media (image or video)
                </label>
                <input
                  type="file"
                  accept="image/*,video/*"
                  className="w-full border px-3 py-2 rounded"
                  onChange={handleMediaChange}
                />

                {mediaPreview && (
                  <div className="mt-2">
                    {mediaType === "video" ? (
                      <video src={mediaPreview} className="h-20 w-20" controls />
                    ) : (
                      <img src={mediaPreview} className="h-20 w-20 rounded" />
                    )}
                  </div>
                )}
              </div>

              {/* ⭐ NEW — CHART IMAGE INPUT */}
              <div className="mb-4">
                <label className="block mb-1">Category Chart (image)</label>
                <input
                  type="file"
                  accept="image/*"
                  className="w-full border px-3 py-2 rounded"
                  onChange={handleChartChange}
                />

                {chartPreview && (
                  <img
                    src={chartPreview}
                    className="h-20 w-20 rounded mt-2 object-cover"
                  />
                )}
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setMediaPreview(null);
                    setChartPreview(null);
                  }}
                  className="px-4 py-2 bg-gray-200 rounded"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 bg-black text-white rounded"
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
          setDeleteModal({ isOpen: false, cate_id: null, cate_name: "" })
        }
        onConfirm={confirmDelete}
        itemType="category"
        itemName={deleteModal.cate_name}
      />
    </div>
  );
};

export default Categories;
