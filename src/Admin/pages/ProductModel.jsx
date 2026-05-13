// import { useState, useEffect } from "react";
// import { PlusCircle, Trash2, X } from "lucide-react";
// import { ApiURL } from "../../Variable";
// import toast from "react-hot-toast";
// import axiosInstance from "../../Axios/axios";

// const ProductModal = ({ isOpen, onClose, product, refreshProducts }) => {
//   const [formData, setFormData] = useState({
//     name: "",
//     cate_id: "",
//     sc_id: "",
//     f_id: "",
//     work_id: "",
//     occasion_id: "",
//     style_id: "",
//     price: "",
//     original_price: "",
//     description: "",
//     sku: "",
//     meta_title: "",
//     meta_description: "",
//     keywords: "",
//     is_expert_choice: false,
//     weight: "",
//     length: "",
//     width: "",
//     height: "",
//     colors: [{ color_id: "", images: [] }],
//     sizes: [{ size_id: "" }],
//   });
//   const [categories, setCategories] = useState([]);
//   const [subcategories, setSubCategories] = useState([]);
//   const [fabrics, setFabrics] = useState([]);
//   const [works, setWorks] = useState([]);
//   const [occasions, setOccasions] = useState([]);
//   const [styles, setStyles] = useState([]);
//   const [colorsList, setColorsList] = useState([]);
//   const [sizesList, setSizesList] = useState([]);
//   const [existingMedia, setExistingMedia] = useState([]);
//   const [deletedMediaIds, setDeletedMediaIds] = useState([]);

//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const [stockMatrix, setStockMatrix] = useState({});
//   const [colorQuantities, setColorQuantities] = useState({});
//   const [originalStock, setOriginalStock] = useState({}); // Track original stock for comparison
//   const [originalColorQuantities, setOriginalColorQuantities] = useState({});
//   const [stockAdjustments, setStockAdjustments] = useState({});
//   const [colorAdjustments, setColorAdjustments] = useState({});
//   const hasSelectedSizes = formData.sizes.some((s) => s.size_id);

//   useEffect(() => {
//     if (!product) {
//       // Reset for "Add New"
//       setFormData({
//         name: "",
//         cate_id: "",
//         sc_id: "",
//         f_id: "",
//         work_id: "",
//         occasion_id: "",
//         style_id: "",
//         price: "",
//         original_price: "",
//         description: "",
//         sku: "",
//         meta_title: "",
//         meta_description: "",
//         keywords: "",
//         is_expert_choice: false,
//         weight: "",
//         length: "",
//         width: "",
//         height: "",
//         colors: [{ color_id: "", images: [] }],
//         sizes: [{ size_id: "" }],
//       });
//       setStockMatrix({});
//       setColorQuantities({});
//       setExistingMedia([]);
//       setDeletedMediaIds([]);
//       setStockAdjustments({});
//       setColorAdjustments({});
//       setOriginalStock({});
//       setOriginalColorQuantities({});
//       return;
//     }

//     // Edit mode
//     setFormData({
//       name: product.name || "",
//       cate_id: product.cate_id || "",
//       sc_id: product.sc_id || "",
//       f_id: product.f_id || "",
//       work_id: product.work_id || "",
//       occasion_id: product.occasion_id || "",
//       style_id: product.style_id || "",
//       price: product.price || "",
//       original_price: product.original_price || "",
//       description: product.description || "",
//       sku: product.sku || "",
//       meta_title: product.meta_title || "",
//       meta_description: product.meta_description || "",
//       keywords: product.keywords || "",
//       is_expert_choice: !!product.is_expert_choice,
//       weight: product.weight || "",
//       length: product.length || "",
//       width: product.width || "",
//       height: product.height || "",
//       colors: product.productcolors?.map((pc) => ({
//         color_id: pc.color_id,
//         images: [],
//       })) || [{ color_id: "", images: [] }],
//       sizes: product.productsizes?.map((ps) => ({
//         size_id: ps.size_id,
//       })) || [{ size_id: "" }],
//     });

//     const mapping = {};
//     product.productcolors?.forEach((pc) => {
//       mapping[pc.color_id] = pc.pcolor_id;
//     });

//     // Load existing images grouped by pcolor_id
//     const existing = product.productcolors?.map((pc) => ({
//       pcolor_id: pc.pcolor_id,
//       color_name: pc.color?.color_name || "Unknown",
//       images: pc.productimages || [],
//     }));
//     setExistingMedia(existing || []);

//     if (
//       product?.productsizes &&
//       product.productvariants &&
//       product.productsizes.length > 0
//     ) {
//       console.log(product.productsizes, product.productvariants, "productss");

//       const matrix = {};
//       const adjustments = {};

//       product?.productvariants.forEach((v) => {
//         if (v.pcolor_id && v.psize_id) {
//           const colorId = Object.keys(mapping).find(
//             (cid) => mapping[cid] === v.pcolor_id
//           );
//           const size = product?.productsizes?.find(
//             (ps) => ps.psize_id === v.psize_id
//           );
//           if (colorId && size) {
//             const key = `${colorId}-${size.size_id}`;
//             matrix[key] = v.remaining_qty || 0;
//             adjustments[key] = { add: 0, remove: 0 }; // Initialize adjustments
//           }
//         }
//       });

//       setOriginalStock(matrix);
//       setStockAdjustments(adjustments);
//     } else if (product?.productvariants) {
//       console.log("enter");
//       const qtyMap = {};
//       const colorAdj = {};

//       product.productvariants.forEach((v) => {
//         if (v.pcolor_id) {
//           const colorId = Object.keys(mapping).find(
//             (cid) => mapping[cid] === v.pcolor_id
//           );
//           if (colorId) {
//             qtyMap[colorId] = v.remaining_qty || 0;
//             colorAdj[colorId] = { add: 0, remove: 0 }; // Initialize adjustments
//           }
//         }
//       });

//       setOriginalColorQuantities(qtyMap);
//       setColorAdjustments(colorAdj);
//     }
//   }, [product]);

//   useEffect(() => {
//     if (!product) return;

//     if (hasSelectedSizes) {
//       const newMatrix = {};
//       formData.colors.forEach((c) => {
//         if (!c.color_id) return;
//         formData.sizes.forEach((s) => {
//           if (!s.size_id) return;
//           const key = `${c.color_id}-${s.size_id}`;
//           newMatrix[key] = stockMatrix[key] ?? 0;
//         });
//       });
//       setStockMatrix(newMatrix);
//     } else {
//       const newQty = {};
//       formData.colors.forEach((c) => {
//         if (c.color_id) {
//           newQty[c.color_id] = colorQuantities[c.color_id] ?? 0;
//         }
//       });
//       setColorQuantities(newQty);
//     }
//   }, [formData.colors, formData.sizes, product]);

//   useEffect(() => {
//     axiosInstance
//       .get(`${ApiURL}/getcategory`)
//       .then((res) => {
//         setCategories(res?.data?.data || []);
//       })
//       .catch(console.error);
//   }, []);

//   useEffect(() => {
//     if (!formData.cate_id) {
//       setSubCategories([]);
//       setFabrics([]);
//       setWorks([]);
//       setOccasions([]);
//       setStyles([]);
//       setSizesList([]);
//       setColorsList([]);
//       return;
//     }

//     Promise.all([
//       axiosInstance
//         .get(`${ApiURL}/getcolor`)
//         .then((r) => setColorsList(r.data.data || [])),
//       axiosInstance
//         .get(`${ApiURL}/getsize/${formData.cate_id}`)
//         .then((r) => setSizesList(r.data.data || [])),
//       axiosInstance
//         .get(`${ApiURL}/getsubcategory/${formData.cate_id}`)
//         .then((r) => setSubCategories(r.data.data || [])),
//       axiosInstance
//         .get(`${ApiURL}/getworks/${formData.cate_id}`)
//         .then((r) => setWorks(r.data.data || [])),
//       axiosInstance
//         .get(`${ApiURL}/getfabrics/${formData.cate_id}`)
//         .then((r) => setFabrics(r.data.data || [])),
//       axiosInstance
//         .get(`${ApiURL}/getstyles/${formData.cate_id}`)
//         .then((r) => setStyles(r.data.data || [])),
//       axiosInstance
//         .get(`${ApiURL}/getoccasions/${formData.cate_id}`)
//         .then((r) => setOccasions(r.data.data || [])),
//     ]).catch(console.error);
//   }, [formData.cate_id]);

//   const handleAddChange = (colorId, sizeId, value) => {
//     const num = value === "" ? 0 : parseInt(value, 10) || 0;
//     const key = `${colorId}-${sizeId}`;
//     setStockAdjustments((prev) => ({
//       ...prev,
//       [key]: {
//         ...prev[key],
//         add: num,
//         remove: prev[key]?.remove || 0,
//       },
//     }));
//   };

//   const handleRemoveChange = (colorId, sizeId, value) => {
//     const num = value === "" ? 0 : parseInt(value, 10) || 0;
//     const key = `${colorId}-${sizeId}`;
//     const currentStock = originalStock[key] || 0;
//     const currentAdd = stockAdjustments[key]?.add || 0;
//     const maxAllowed = currentStock + currentAdd;
//     const safeValue = Math.min(num, maxAllowed);

//     setStockAdjustments((prev) => ({
//       ...prev,
//       [key]: {
//         ...prev[key],
//         remove: safeValue,
//       },
//     }));
//   };

//   const handleColorAddChange = (colorId, value) => {
//     const num = value === "" ? 0 : parseInt(value, 10) || 0;
//     setColorAdjustments((prev) => ({
//       ...prev,
//       [colorId]: {
//         ...prev[colorId],
//         add: num,
//         remove: prev[colorId]?.remove || 0,
//       },
//     }));
//   };

//   const handleColorRemoveChange = (colorId, value) => {
//     const num = value === "" ? 0 : parseInt(value, 10) || 0;
//     const currentStock = originalColorQuantities[colorId] || 0;
//     const currentAdd = colorAdjustments[colorId]?.add || 0;
//     const maxAllowed = currentStock + currentAdd;
//     const safeValue = Math.min(num, maxAllowed);

//     setColorAdjustments((prev) => ({
//       ...prev,
//       [colorId]: {
//         ...prev[colorId],
//         remove: safeValue,
//       },
//     }));
//   };
//   const handleInputChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (isSubmitting) return;
//     setIsSubmitting(true);

//     // Validation: no duplicate colors
//     const colorIds = formData.colors.map((c) => c.color_id).filter(Boolean);
//     if (new Set(colorIds).size !== colorIds.length) {
//       toast.error("Duplicate colors not allowed!");
//       setIsSubmitting(false);
//       return;
//     }

//     const data = new FormData();
//     // Append all basic fields
//     Object.keys(formData).forEach((key) => {
//       if (!["colors", "sizes"].includes(key)) {
//         if (key === "is_expert_choice") {
//           data.append(key, formData[key] === true ? 1 : 0);
//         } else {
//           data.append(key, formData[key]);
//         }
//       }
//     });

//     data.append(
//       "colors",
//       JSON.stringify(formData.colors.map((c) => ({ color_id: c.color_id })))
//     );
//     data.append(
//       "sizes",
//       JSON.stringify(formData.sizes.map((s) => ({ size_id: s.size_id })))
//     );

//     // Append new images
//     formData.colors.forEach((color, i) => {
//       color.images.forEach((file) => data.append(`images_color_${i}`, file));
//     });

//     if (product) data.append("deleted_media", JSON.stringify(deletedMediaIds));

//     try {
//       const url = product
//         ? `${ApiURL}/updateproduct/${product.p_id}`
//         : `${ApiURL}/insertproduct`;

//       const res = await axiosInstance.post(url, data);
//       if (res.data.status !== 1)
//         throw new Error(res.data.description || "Failed");

//       const p_id = product?.p_id || res.data.data.p_id;

//       // Refetch full product to get pcolor_id & psize_id
//       const fullRes = await axiosInstance.post(
//         `${ApiURL}/getproductbyid/${p_id}`
//       );
//       const fullProduct = fullRes.data.data;

//       const pColorMap = {};
//       fullProduct.productcolors.forEach((pc) => {
//         pColorMap[pc.color_id] = pc.pcolor_id;
//       });

//       const pSizeMap = {};
//       fullProduct.productsizes.forEach((ps) => {
//         pSizeMap[ps.size_id] = ps.psize_id;
//       });

//       // Update stock - using the new updateStock helper function
//       const stockPromises = [];

//       if (hasSelectedSizes) {
//         // For products with sizes
//         Object.entries(stockAdjustments).forEach(([key, adjustment]) => {
//           const [color_id, size_id] = key.split("-");
//           const pcolor_id = pColorMap[color_id];
//           const psize_id = pSizeMap[size_id];

//           if (
//             pcolor_id &&
//             psize_id &&
//             (adjustment.add > 0 || adjustment.remove > 0)
//           ) {
//             // Add stock if needed
//             if (adjustment.add > 0) {
//               stockPromises.push(
//                 axiosInstance.post(`${ApiURL}/addstock`, {
//                   p_id,
//                   pcolor_id,
//                   psize_id,
//                   qty_to_add: adjustment.add,
//                 })
//               );
//             }

//             // Remove stock if needed
//             if (adjustment.remove > 0) {
//               stockPromises.push(
//                 axiosInstance.post(`${ApiURL}/removestock`, {
//                   p_id,
//                   pcolor_id,
//                   psize_id,
//                   qty_to_remove: adjustment.remove,
//                 })
//               );
//             }
//           }
//         });
//       } else {
//         // For products without sizes
//         Object.entries(colorAdjustments).forEach(([color_id, adjustment]) => {
//           const pcolor_id = pColorMap[color_id];

//           if (pcolor_id && (adjustment.add > 0 || adjustment.remove > 0)) {
//             // Add stock if needed
//             if (adjustment.add > 0) {
//               stockPromises.push(
//                 axiosInstance.post(`${ApiURL}/addstock`, {
//                   p_id,
//                   pcolor_id,
//                   psize_id: null,
//                   qty_to_add: adjustment.add,
//                 })
//               );
//             }

//             // Remove stock if needed
//             if (adjustment.remove > 0) {
//               stockPromises.push(
//                 axiosInstance.post(`${ApiURL}/removestock`, {
//                   p_id,
//                   pcolor_id,
//                   psize_id: null,
//                   qty_to_remove: adjustment.remove,
//                 })
//               );
//             }
//           }
//         });
//       }

//       if (!product && hasSelectedSizes) {
//         Object.entries(originalStock).forEach(([key, qty]) => {
//           if (qty > 0) {
//             const [color_id, size_id] = key.split("-");
//             const pcolor_id = pColorMap[color_id];
//             const psize_id = pSizeMap[size_id];

//             if (pcolor_id && psize_id) {
//               stockPromises.push(
//                 axiosInstance.post(`${ApiURL}/addstock`, {
//                   p_id,
//                   pcolor_id,
//                   psize_id,
//                   qty_to_add: qty,
//                 })
//               );
//             }
//           }
//         });
//       } else if (!product) {
//         Object.entries(originalColorQuantities).forEach(([color_id, qty]) => {
//           if (qty > 0) {
//             const pcolor_id = pColorMap[color_id];
//             if (pcolor_id) {
//               stockPromises.push(
//                 axiosInstance.post(`${ApiURL}/addstock`, {
//                   p_id,
//                   pcolor_id,
//                   psize_id: null,
//                   qty_to_add: qty,
//                 })
//               );
//             }
//           }
//         });
//       }

//       if (stockPromises.length > 0) {
//         await Promise.all(stockPromises);
//       }

//       toast.success(
//         product ? "Product & stock updated!" : "Product created with stock!"
//       );
//       refreshProducts();
//       onClose();
//     } catch (err) {
//       toast.error("Error: " + (err.response?.data?.description || err.message));
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   useEffect(() => {
//     return () => {
//       // Revoke all object URLs when modal closes
//       formData.colors.forEach((color) => {
//         color.images?.forEach((file) => {
//           if (file instanceof File) {
//             URL.revokeObjectURL(URL.createObjectURL(file));
//           }
//         });
//       });
//     };
//   }, [isOpen]);

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-2xl p-4 sm:p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-xl">
//         <div className="flex justify-between items-center mb-6">
//           <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
//             {product ? "Edit Product" : "Add New Product"}
//           </h2>
//           <button
//             onClick={onClose}
//             className="text-gray-600 hover:text-gray-900 p-2 rounded-full hover:bg-gray-100"
//           >
//             <X className="w-6 h-6" />
//           </button>
//         </div>
//         <form onSubmit={handleSubmit} className="space-y-6">
//           {/* All form fields unchanged */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Name *
//               </label>
//               <input
//                 type="text"
//                 name="name"
//                 value={formData.name}
//                 onChange={handleInputChange}
//                 className="w-full px-4 py-2.5 border border-black rounded focus:ring-2 focus:ring-gray-500 outline-none"
//                 required
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Category *
//               </label>
//               <select
//                 name="cate_id"
//                 value={formData.cate_id}
//                 onChange={handleInputChange}
//                 className="w-full px-4 py-2.5 border border-black rounded focus:ring-2 focus:ring-gray-500 outline-none"
//                 required
//               >
//                 <option value="">Select Category</option>
//                 {categories?.map((category) => (
//                   <option key={category.cate_id} value={category.cate_id}>
//                     {category.cate_name}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Collection *
//               </label>
//               <select
//                 name="sc_id"
//                 value={formData.sc_id}
//                 onChange={handleInputChange}
//                 className="w-full px-4 py-2.5 border border-black rounded focus:ring-2 focus:ring-gray-500 outline-none"
//               >
//                 <option value="">Select Collection</option>
//                 {subcategories?.map((category) => (
//                   <option key={category.sc_id} value={category.sc_id}>
//                     {category.name}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Fabric *
//               </label>
//               <select
//                 name="f_id"
//                 value={formData.f_id}
//                 onChange={handleInputChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 outline-none"
//               >
//                 <option value="">Select</option>
//                 {fabrics.map((f) => (
//                   <option key={f.f_id} value={f.f_id}>
//                     {f.name}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Work *
//               </label>
//               <select
//                 name="work_id"
//                 value={formData.work_id}
//                 onChange={handleInputChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 outline-none"
//               >
//                 <option value="">Select</option>
//                 {works?.map((w) => (
//                   <option key={w.work_id} value={w.work_id}>
//                     {w.name}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Occasion *
//               </label>
//               <select
//                 name="occasion_id"
//                 value={formData.occasion_id}
//                 onChange={handleInputChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 outline-none"
//               >
//                 <option value="">Select</option>
//                 {occasions?.map((o) => (
//                   <option key={o.occasion_id} value={o.occasion_id}>
//                     {o.name}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Style *
//               </label>
//               <select
//                 name="style_id"
//                 value={formData.style_id}
//                 onChange={handleInputChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 outline-none"
//               >
//                 <option value="">Select</option>
//                 {styles?.map((o) => (
//                   <option key={o.style_id} value={o.style_id}>
//                     {o.name}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Price *
//               </label>
//               <input
//                 type="number"
//                 name="price"
//                 value={formData.price}
//                 onChange={handleInputChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 outline-none"
//                 required
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Original Price
//               </label>
//               <input
//                 type="number"
//                 name="original_price"
//                 value={formData.original_price}
//                 onChange={handleInputChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 outline-none"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 SKU *
//               </label>
//               <input
//                 type="text"
//                 name="sku"
//                 value={formData.sku}
//                 onChange={handleInputChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 outline-none"
//                 required
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Weight
//               </label>
//               <input
//                 type="number"
//                 name="weight"
//                 placeholder="Weight in Kg"
//                 value={formData.weight}
//                 onChange={handleInputChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 outline-none"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Length
//               </label>
//               <input
//                 type="number"
//                 name="length"
//                 placeholder="length in cm"
//                 value={formData.length}
//                 onChange={handleInputChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 outline-none"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Width
//               </label>
//               <input
//                 type="number"
//                 name="width"
//                 placeholder="width in cm"
//                 value={formData.width}
//                 onChange={handleInputChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 outline-none"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Height
//               </label>
//               <input
//                 type="number"
//                 name="height"
//                 placeholder="height in cm"
//                 value={formData.height}
//                 onChange={handleInputChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 outline-none"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Meta Title
//               </label>
//               <input
//                 type="text"
//                 name="meta_title"
//                 value={formData.meta_title}
//                 onChange={handleInputChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 outline-none"
//               />
//             </div>
//             <div className="sm:col-span-2 lg:col-span-3">
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Meta Description
//               </label>
//               <textarea
//                 name="meta_description"
//                 value={formData.meta_description}
//                 onChange={handleInputChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 outline-none min-h-[80px]"
//               />
//             </div>
//             <div className="sm:col-span-2 lg:col-span-3">
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Keywords
//               </label>
//               <input
//                 type="text"
//                 name="keywords"
//                 value={formData.keywords}
//                 onChange={handleInputChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 outline-none"
//               />
//             </div>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Description
//             </label>
//             <textarea
//               name="description"
//               value={formData.description}
//               onChange={handleInputChange}
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 outline-none min-h-[100px]"
//             />
//           </div>

//           <div className="md:col-span-2">
//             <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
//               <input
//                 type="checkbox"
//                 name="is_expert_choice"
//                 checked={formData.is_expert_choice}
//                 onChange={handleInputChange}
//                 className="mr-2 h-4 w-4 text-black border-gray-300 rounded focus:ring-black"
//               />
//               Add To Reel Section
//             </label>
//           </div>

//           {/* Color section */}
//           <div className="bg-gray-50 p-6 rounded-xl">
//             <h3 className="text-xl font-bold mb-4">Colors & Images</h3>
//             {formData.colors.map((color, i) => (
//               <div key={i} className="bg-white p-4 rounded-lg border mb-4">
//                 <div className="flex gap-4 items-center">
//                   <select
//                     value={color.color_id}
//                     onChange={(e) => {
//                       const updated = [...formData.colors];
//                       updated[i].color_id = e.target.value;
//                       setFormData({ ...formData, colors: updated });
//                     }}
//                     className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
//                   >
//                     <option value="">Select Color</option>
//                     {colorsList.map((c) => (
//                       <option key={c.color_id} value={c.color_id}>
//                         {c.color_name}
//                       </option>
//                     ))}
//                   </select>
//                   <label className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded">
//                     Upload Images
//                     <input
//                       type="file"
//                       multiple
//                       accept="image/*"
//                       className="hidden"
//                       onChange={(e) => {
//                         const newFiles = Array.from(e.target.files);
//                         if (newFiles.length === 0) return;

//                         const updatedColors = [...formData.colors];
//                         const currentFiles = updatedColors[i].images || [];

//                         // Append new files (preserves selection order)
//                         updatedColors[i].images = [
//                           ...currentFiles,
//                           ...newFiles,
//                         ];

//                         setFormData({ ...formData, colors: updatedColors });

//                         // Reset input so user can re-select same files
//                         e.target.value = "";
//                       }}
//                     />
//                   </label>
//                   {formData.colors.length > 1 && (
//                     <button
//                       type="button"
//                       onClick={() => {
//                         setFormData((prev) => ({
//                           ...prev,
//                           colors: prev.colors.filter((_, idx) => idx !== i),
//                         }));
//                       }}
//                       className="text-red-600"
//                     >
//                       <Trash2 />
//                     </button>
//                   )}
//                 </div>
//                 {/* New uploaded images with drag-to-reorder */}
//                 <div className="flex gap-3 mt-4 flex-wrap">
//                   {/* Existing images (unchanged) */}
//                   {(existingMedia[i]?.images || []).map((img) => (
//                     <div key={img.image_id} className="relative group">
//                       <img
//                         src={`${ApiURL}/assets/Products/${img.image_url}`}
//                         alt="existing"
//                         className="w-24 h-24 object-cover rounded-lg border"
//                       />
//                       <button
//                         type="button"
//                         onClick={() => {
//                           setDeletedMediaIds((prev) => [...prev, img.image_id]);
//                           setExistingMedia((prev) => {
//                             const updated = [...prev];
//                             updated[i].images = updated[i].images.filter(
//                               (x) => x.image_id !== img.image_id
//                             );
//                             return updated;
//                           });
//                         }}
//                         className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition rounded-lg"
//                       >
//                         <Trash2 className="w-6 h-6 text-white" />
//                       </button>
//                     </div>
//                   ))}

//                   {/* Reorderable new images */}
//                   {formData.colors[i]?.images?.length > 0 && (
//                     <div
//                       className="flex gap-3 flex-wrap"
//                       onDragOver={(e) => e.preventDefault()}
//                     >
//                       {formData.colors[i].images.map((file, idx) => (
//                         <div
//                           key={idx}
//                           draggable
//                           onDragStart={(e) => {
//                             e.dataTransfer.setData("dragIndex", idx.toString());
//                           }}
//                           onDrop={(e) => {
//                             e.preventDefault();
//                             const fromIndex = parseInt(
//                               e.dataTransfer.getData("dragIndex")
//                             );
//                             const toIndex = idx;

//                             if (fromIndex === toIndex) return;

//                             setFormData((prev) => {
//                               const updated = [...prev.colors];
//                               const images = [...updated[i].images];

//                               // Reorder array
//                               const [moved] = images.splice(fromIndex, 1);
//                               images.splice(toIndex, 0, moved);

//                               updated[i].images = images;
//                               return { ...prev, colors: updated };
//                             });
//                           }}
//                           className="relative group cursor-move"
//                         >
//                           <img
//                             src={URL.createObjectURL(file)}
//                             alt={`preview-${idx}`}
//                             className="w-24 h-24 object-cover rounded-lg border"
//                           />
//                           <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition rounded-lg">
//                             <span className="text-white text-xs font-medium">
//                               Drag to reorder
//                             </span>
//                           </div>
//                           <button
//                             type="button"
//                             onClick={() => {
//                               setFormData((prev) => {
//                                 const updated = [...prev.colors];
//                                 updated[i].images = updated[i].images.filter(
//                                   (_, index) => index !== idx
//                                 );
//                                 return { ...prev, colors: updated };
//                               });
//                             }}
//                             className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
//                           >
//                             <X size={14} />
//                           </button>
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               </div>
//             ))}
//             <button
//               type="button"
//               onClick={() =>
//                 setFormData((prev) => ({
//                   ...prev,
//                   colors: [...prev.colors, { color_id: "", images: [] }],
//                 }))
//               }
//               className="text-blue-600 flex items-center gap-2"
//             >
//               <PlusCircle /> Add Color
//             </button>
//           </div>

//           {/* Sizes Section */}
//           {formData.cate_id && sizesList.length > 0 && (
//             <div className="bg-gray-50 p-6 rounded-xl">
//               <h3 className="text-xl font-bold mb-4">Sizes</h3>
//               {formData.sizes.map((size, i) => (
//                 <div key={i} className="flex gap-4 mb-3 items-center">
//                   <select
//                     value={size.size_id}
//                     onChange={(e) => {
//                       const updated = [...formData.sizes];
//                       updated[i].size_id = e.target.value;
//                       setFormData({ ...formData, sizes: updated });
//                     }}
//                     className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
//                   >
//                     <option value="">Select Size</option>
//                     {sizesList.map((s) => (
//                       <option key={s.size_id} value={s.size_id}>
//                         {s.size_name}
//                       </option>
//                     ))}
//                   </select>
//                   {formData.sizes.length > 1 && (
//                     <button
//                       type="button"
//                       onClick={() =>
//                         setFormData((prev) => ({
//                           ...prev,
//                           sizes: prev.sizes.filter((_, idx) => idx !== i),
//                         }))
//                       }
//                       className="text-red-600"
//                     >
//                       <Trash2 />
//                     </button>
//                   )}
//                 </div>
//               ))}
//               <button
//                 type="button"
//                 onClick={() =>
//                   setFormData((prev) => ({
//                     ...prev,
//                     sizes: [...prev.sizes, { size_id: "" }],
//                   }))
//                 }
//                 className="text-blue-600 flex items-center gap-2"
//               >
//                 <PlusCircle /> Add Size
//               </button>
//             </div>
//           )}

//           {formData.colors.some((c) => c.color_id) && (
//             <div className="bg-green-50 border-2 border-green-300 rounded-xl p-8">
//               <h3 className="text-2xl font-bold text-green-800 mb-6">
//                 Stock Adjustment
//               </h3>

//               {hasSelectedSizes ? (
//                 <div className="overflow-x-auto">
//                   <table className="min-w-full border-collapse">
//                     <thead>
//                       <tr className="bg-green-100">
//                         <th className="border border-green-400 px-6 py-4 text-left">
//                           Size → Color ↓
//                         </th>
//                         <th className="border border-green-400 px-6 py-4 text-center">
//                           Current Stock
//                         </th>
//                         <th className="border border-green-400 px-6 py-4 text-center">
//                           Add Stock
//                         </th>
//                         <th className="border border-green-400 px-6 py-4 text-center">
//                           Remove Stock
//                         </th>
//                         <th className="border border-green-400 px-6 py-4 text-center">
//                           New Total
//                         </th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {formData.sizes
//                         .filter((s) => s.size_id)
//                         .map((size) => {
//                           const sizeName =
//                             sizesList.find((s) => s.size_id == size.size_id)
//                               ?.size_name || "Size";

//                           return formData.colors
//                             .filter((c) => c.color_id)
//                             .map((color) => {
//                               const colorName =
//                                 colorsList.find(
//                                   (c) => c.color_id == color.color_id
//                                 )?.color_name || "Color";
//                               const key = `${color.color_id}-${size.size_id}`;
//                               const currentStock = originalStock[key] || 0;
//                               const adjustment = stockAdjustments[key] || {
//                                 add: 0,
//                                 remove: 0,
//                               };
//                               const newTotal =
//                                 currentStock +
//                                 adjustment.add -
//                                 adjustment.remove;

//                               return (
//                                 <tr key={key}>
//                                   <td className="border border-green-400 px-6 py-4">
//                                     {colorName} - {sizeName}
//                                   </td>
//                                   <td className="border border-green-400 px-6 py-4 text-center">
//                                     {currentStock}
//                                   </td>
//                                   <td className="border border-green-400 p-3 text-center">
//                                     <input
//                                       type="number"
//                                       min="0"
//                                       placeholder="Add"
//                                       className="w-24 px-3 py-2 border rounded text-center"
//                                       value={adjustment.add || 0}
//                                       onChange={(e) =>
//                                         handleAddChange(
//                                           color.color_id,
//                                           size.size_id,
//                                           e.target.value
//                                         )
//                                       }
//                                     />
//                                   </td>
//                                   <td className="border border-green-400 p-3 text-center">
//                                     <input
//                                       type="number"
//                                       min="0"
//                                       max={currentStock + adjustment.add}
//                                       placeholder="Remove"
//                                       className="w-24 px-3 py-2 border rounded text-center"
//                                       value={adjustment.remove || 0}
//                                       onChange={(e) =>
//                                         handleRemoveChange(
//                                           color.color_id,
//                                           size.size_id,
//                                           e.target.value
//                                         )
//                                       }
//                                     />
//                                   </td>
//                                   <td className="border border-green-400 px-6 py-4 text-center font-bold">
//                                     {newTotal}
//                                   </td>
//                                 </tr>
//                               );
//                             });
//                         })}
//                     </tbody>
//                   </table>
//                   <p className="text-sm text-green-700 mt-4">
//                     Enter amounts to add or remove from current stock. Remove
//                     cannot exceed current + added stock.
//                   </p>
//                 </div>
//               ) : (
//                 <div>
//                   {/* Headings for Color-Only */}
//                   <div className="grid grid-cols-5 gap-4 mb-4 px-4 font-bold text-green-800">
//                     <div className="col-span-1">Color</div>
//                     <div className="text-center">Current Stock</div>
//                     <div className="text-center">Add Stock</div>
//                     <div className="text-center">Remove Stock</div>
//                     <div className="text-center">New Total</div>
//                   </div>

//                   {/* Color Rows */}
//                   <div className="space-y-4">
//                     {formData.colors
//                       .filter((c) => c.color_id)
//                       .map((color) => {
//                         const colorName =
//                           colorsList.find((c) => c.color_id == color.color_id)
//                             ?.color_name || "Color";
//                         const currentStock =
//                           originalColorQuantities[color.color_id] || 0;
//                         const adjustment = colorAdjustments[color.color_id] || {
//                           add: 0,
//                           remove: 0,
//                         };
//                         const newTotal =
//                           currentStock + adjustment.add - adjustment.remove;

//                         return (
//                           <div
//                             key={color.color_id}
//                             className="grid grid-cols-5 gap-4 items-center bg-white p-4 rounded-lg border border-green-200"
//                           >
//                             <div className="font-medium">{colorName}</div>
//                             <div className="text-center font-bold">
//                               {currentStock}
//                             </div>
//                             <div className="text-center">
//                               <input
//                                 type="number"
//                                 min="0"
//                                 placeholder="Add"
//                                 className="w-full max-w-24 px-3 py-2 border rounded text-center"
//                                 value={adjustment.add || 0}
//                                 onChange={(e) =>
//                                   handleColorAddChange(
//                                     color.color_id,
//                                     e.target.value
//                                   )
//                                 }
//                               />
//                             </div>
//                             <div className="text-center">
//                               <input
//                                 type="number"
//                                 min="0"
//                                 max={currentStock + adjustment.add}
//                                 placeholder="Remove"
//                                 className="w-full max-w-24 px-3 py-2 border rounded text-center"
//                                 value={adjustment.remove || 0}
//                                 onChange={(e) =>
//                                   handleColorRemoveChange(
//                                     color.color_id,
//                                     e.target.value
//                                   )
//                                 }
//                               />
//                             </div>
//                             <div className="text-center font-bold text-green-700">
//                               {newTotal}
//                             </div>
//                           </div>
//                         );
//                       })}
//                   </div>

//                   <p className="text-sm text-green-700 mt-4">
//                     Enter amounts to add or remove. Remove cannot exceed current
//                     + added stock.
//                   </p>
//                 </div>
//               )}
//             </div>
//           )}

//           <div className="flex justify-end gap-4 pt-8">
//             <button
//               type="button"
//               onClick={onClose}
//               className="px-8 py-3 bg-gray-300 rounded-lg"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               disabled={isSubmitting}
//               className="px-8 py-3 bg-black text-white rounded-lg disabled:opacity-50"
//             >
//               {isSubmitting
//                 ? "Saving..."
//                 : product
//                 ? "Update Product + Stock"
//                 : "Create Product + Stock"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default ProductModal;

import { useState, useEffect } from "react";
import { PlusCircle, Trash2, X } from "lucide-react";
import { ApiURL, adminInfo } from "../../Variable";
import toast from "react-hot-toast";
import axiosInstance from "../../Axios/axios";

const ProductModal = ({ isOpen, onClose, product, refreshProducts }) => {
  const adminData = adminInfo();
  const [formData, setFormData] = useState({
    name: "",
    cate_id: "",
    sc_id: "",
    f_id: "",
    work_id: "",
    occasion_id: "",
    style_id: "",
    price: "",
    original_price: "",
    description: "",
    sku: "",
    meta_title: "",
    meta_description: "",
    keywords: "",
    is_expert_choice: false,
    weight: "",
    length: "",
    width: "",
    height: "",
    colors: [{ color_id: "", images: [] }],
    sizes: [{ size_id: "" }],
  });
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubCategories] = useState([]);
  const [fabrics, setFabrics] = useState([]);
  const [works, setWorks] = useState([]);
  const [occasions, setOccasions] = useState([]);
  const [styles, setStyles] = useState([]);
  const [colorsList, setColorsList] = useState([]);
  const [sizesList, setSizesList] = useState([]);
  const [existingMedia, setExistingMedia] = useState([]);
  const [deletedMediaIds, setDeletedMediaIds] = useState([]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [stockMatrix, setStockMatrix] = useState({});
  const [colorQuantities, setColorQuantities] = useState({});
  const [originalStock, setOriginalStock] = useState({}); // Track original stock for comparison
  const [originalColorQuantities, setOriginalColorQuantities] = useState({});
  const [stockAdjustments, setStockAdjustments] = useState({});
  const [colorAdjustments, setColorAdjustments] = useState({});
  const hasSelectedSizes = formData.sizes.some((s) => s.size_id);

  useEffect(() => {
    if (!product) {
      // Reset for "Add New"
      setFormData({
        name: "",
        cate_id: "",
        sc_id: "",
        f_id: "",
        work_id: "",
        occasion_id: "",
        style_id: "",
        price: "",
        original_price: "",
        description: "",
        sku: "",
        meta_title: "",
        meta_description: "",
        keywords: "",
        is_expert_choice: false,
        weight: "",
        length: "",
        width: "",
        height: "",
        colors: [{ color_id: "", images: [] }],
        sizes: [{ size_id: "" }],
      });
      setStockMatrix({});
      setColorQuantities({});
      setExistingMedia([]);
      setDeletedMediaIds([]);
      setStockAdjustments({});
      setColorAdjustments({});
      setOriginalStock({});
      setOriginalColorQuantities({});
      return;
    }

    // Edit mode
    setFormData({
      name: product.name || "",
      cate_id: product.cate_id || "",
      sc_id: product.sc_id || "",
      f_id: product.f_id || "",
      work_id: product.work_id || "",
      occasion_id: product.occasion_id || "",
      style_id: product.style_id || "",
      price: product.price || "",
      original_price: product.original_price || "",
      description: product.description || "",
      sku: product.sku || "",
      meta_title: product.meta_title || "",
      meta_description: product.meta_description || "",
      keywords: product.keywords || "",
      is_expert_choice: !!product.is_expert_choice,
      weight: product.weight || "",
      length: product.length || "",
      width: product.width || "",
      height: product.height || "",
      colors: product.productcolors?.map((pc) => ({
        color_id: pc.color_id,
        images: [],
      })) || [{ color_id: "", images: [] }],
      sizes: product.productsizes?.map((ps) => ({
        size_id: ps.size_id,
      })) || [{ size_id: "" }],
    });

    const mapping = {};
    product.productcolors?.forEach((pc) => {
      mapping[pc.color_id] = pc.pcolor_id;
    });

    // Load existing images grouped by pcolor_id
    const existing = product.productcolors?.map((pc) => ({
      pcolor_id: pc.pcolor_id,
      color_name: pc.color?.color_name || "Unknown",
      images: pc.productimages || [],
    }));
    setExistingMedia(existing || []);

    if (
      product?.productsizes &&
      product.productvariants &&
      product.productsizes.length > 0
    ) {

      const matrix = {};
      const adjustments = {};

      product?.productvariants.forEach((v) => {
        if (v.pcolor_id && v.psize_id) {
          const colorId = Object.keys(mapping).find(
            (cid) => mapping[cid] === v.pcolor_id,
          );
          const size = product?.productsizes?.find(
            (ps) => ps.psize_id === v.psize_id,
          );
          if (colorId && size) {
            const key = `${colorId}-${size.size_id}`;
            matrix[key] = v.remaining_qty || 0;
            adjustments[key] = { add: 0, remove: 0 }; // Initialize adjustments
          }
        }
      });

      setOriginalStock(matrix);
      setStockAdjustments(adjustments);
    } else if (product?.productvariants) {
      const qtyMap = {};
      const colorAdj = {};

      product.productvariants.forEach((v) => {
        if (v.pcolor_id) {
          const colorId = Object.keys(mapping).find(
            (cid) => mapping[cid] === v.pcolor_id,
          );
          if (colorId) {
            qtyMap[colorId] = v.remaining_qty || 0;
            colorAdj[colorId] = { add: 0, remove: 0 }; // Initialize adjustments
          }
        }
      });

      setOriginalColorQuantities(qtyMap);
      setColorAdjustments(colorAdj);
    }
  }, [product]);

  useEffect(() => {
    if (!product) return;

    if (hasSelectedSizes) {
      const newMatrix = {};
      formData.colors.forEach((c) => {
        if (!c.color_id) return;
        formData.sizes.forEach((s) => {
          if (!s.size_id) return;
          const key = `${c.color_id}-${s.size_id}`;
          newMatrix[key] = stockMatrix[key] ?? 0;
        });
      });
      setStockMatrix(newMatrix);
    } else {
      const newQty = {};
      formData.colors.forEach((c) => {
        if (c.color_id) {
          newQty[c.color_id] = colorQuantities[c.color_id] ?? 0;
        }
      });
      setColorQuantities(newQty);
    }
  }, [formData.colors, formData.sizes, product]);

  useEffect(() => {
    axiosInstance
      .get(`${ApiURL}/getcategory`)
      .then((res) => {
        setCategories(res?.data?.data || []);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!formData.cate_id) {
      setSubCategories([]);
      setFabrics([]);
      setWorks([]);
      setOccasions([]);
      setStyles([]);
      setSizesList([]);
      setColorsList([]);
      return;
    }

    Promise.all([
      axiosInstance
        .get(`${ApiURL}/getcolor`)
        .then((r) => setColorsList(r.data.data || [])),
      axiosInstance
        .get(`${ApiURL}/getsize/${formData.cate_id}`)
        .then((r) => setSizesList(r.data.data || [])),
      axiosInstance
        .get(`${ApiURL}/getsubcategory/${formData.cate_id}`)
        .then((r) => setSubCategories(r.data.data || [])),
      axiosInstance
        .get(`${ApiURL}/getworks/${formData.cate_id}`)
        .then((r) => setWorks(r.data.data || [])),
      axiosInstance
        .get(`${ApiURL}/getfabrics/${formData.cate_id}`)
        .then((r) => setFabrics(r.data.data || [])),
      axiosInstance
        .get(`${ApiURL}/getstyles/${formData.cate_id}`)
        .then((r) => setStyles(r.data.data || [])),
      axiosInstance
        .get(`${ApiURL}/getoccasions/${formData.cate_id}`)
        .then((r) => setOccasions(r.data.data || [])),
    ]).catch(console.error);
  }, [formData.cate_id]);

  const handleAddChange = (colorId, sizeId, value) => {
    const num = value === "" ? 0 : parseInt(value, 10) || 0;
    const key = `${colorId}-${sizeId}`;
    setStockAdjustments((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        add: num,
        remove: prev[key]?.remove || 0,
      },
    }));
  };

  const handleRemoveChange = (colorId, sizeId, value) => {
    const num = value === "" ? 0 : parseInt(value, 10) || 0;
    const key = `${colorId}-${sizeId}`;
    const currentStock = originalStock[key] || 0;
    const currentAdd = stockAdjustments[key]?.add || 0;
    const maxAllowed = currentStock + currentAdd;
    const safeValue = Math.min(num, maxAllowed);

    setStockAdjustments((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        remove: safeValue,
      },
    }));
  };

  const handleColorAddChange = (colorId, value) => {
    const num = value === "" ? 0 : parseInt(value, 10) || 0;
    setColorAdjustments((prev) => ({
      ...prev,
      [colorId]: {
        ...prev[colorId],
        add: num,
        remove: prev[colorId]?.remove || 0,
      },
    }));
  };

  const handleColorRemoveChange = (colorId, value) => {
    const num = value === "" ? 0 : parseInt(value, 10) || 0;
    const currentStock = originalColorQuantities[colorId] || 0;
    const currentAdd = colorAdjustments[colorId]?.add || 0;
    const maxAllowed = currentStock + currentAdd;
    const safeValue = Math.min(num, maxAllowed);

    setColorAdjustments((prev) => ({
      ...prev,
      [colorId]: {
        ...prev[colorId],
        remove: safeValue,
      },
    }));
  };
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    // Validation: no duplicate colors
    const colorIds = formData.colors.map((c) => c.color_id).filter(Boolean);
    if (new Set(colorIds).size !== colorIds.length) {
      toast.error("Duplicate colors not allowed!");
      setIsSubmitting(false);
      return;
    }

    const data = new FormData();
    // Append all basic fields
    Object.keys(formData).forEach((key) => {
      if (!["colors", "sizes"].includes(key)) {
        if (key === "is_expert_choice") {
          data.append(key, formData[key] === true ? 1 : 0);
        } else {
          data.append(key, formData[key]);
        }
      }
    });

    data.append(
      "colors",
      JSON.stringify(formData.colors.map((c) => ({ color_id: c.color_id }))),
    );
    data.append(
      "sizes",
      JSON.stringify(formData.sizes.map((s) => ({ size_id: s.size_id }))),
    );

    // Append new images
    formData.colors.forEach((color, i) => {
      color.images.forEach((file) => data.append(`images_color_${i}`, file));
    });

    if (product) data.append("deleted_media", JSON.stringify(deletedMediaIds));

    try {
      const url = product
        ? `${ApiURL}/updateproduct/${product.p_id}`
        : `${ApiURL}/insertproduct`;

      const res = await axiosInstance.post(url, data, {
        headers: {
          Authorization: `Bearer ${adminData?.token || adminData?.auth_token}`,
        },
      });
      if (res.data.status !== 1)
        throw new Error(res.data.description || "Failed");

      const p_id = product?.p_id || res.data.data.p_id;

      // Refetch full product to get pcolor_id & psize_id
      const fullRes = await axiosInstance.get(
        `${ApiURL}/getproductbyid/${p_id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${adminData?.token || adminData?.auth_token}`,
          },
        },
      );
      const fullProduct = fullRes.data.data;

      const pColorMap = {};
      fullProduct.productcolors.forEach((pc) => {
        pColorMap[pc.color_id] = pc.pcolor_id;
      });

      const pSizeMap = {};
      fullProduct.productsizes.forEach((ps) => {
        pSizeMap[ps.size_id] = ps.psize_id;
      });

      // Update stock - using the new updateStock helper function
      const stockPromises = [];

      if (hasSelectedSizes) {
        // For products with sizes
        Object.entries(stockAdjustments).forEach(([key, adjustment]) => {
          const [color_id, size_id] = key.split("-");
          const pcolor_id = pColorMap[color_id];
          const psize_id = pSizeMap[size_id];

          if (
            pcolor_id &&
            psize_id &&
            (adjustment.add > 0 || adjustment.remove > 0)
          ) {
            // Add stock if needed
            if (adjustment.add > 0) {
              stockPromises.push(
                axiosInstance.post(`${ApiURL}/addstock`, {
                  p_id,
                  pcolor_id,
                  psize_id,
                  qty_to_add: adjustment.add,
                }
                  , { headers: { Authorization: `Bearer ${adminData?.token || adminData?.auth_token}` } }
                ),
              );
            }

            // Remove stock if needed
            if (adjustment.remove > 0) {
              stockPromises.push(
                axiosInstance.post(`${ApiURL}/removestock`, {
                  p_id,
                  pcolor_id,
                  psize_id,
                  qty_to_remove: adjustment.remove,
                }),
              );
            }
          }
        });
      } else {
        // For products without sizes
        Object.entries(colorAdjustments).forEach(([color_id, adjustment]) => {
          const pcolor_id = pColorMap[color_id];

          if (pcolor_id && (adjustment.add > 0 || adjustment.remove > 0)) {
            // Add stock if needed
            if (adjustment.add > 0) {
              stockPromises.push(
                axiosInstance.post(`${ApiURL}/addstock`, {
                  p_id,
                  pcolor_id,
                  psize_id: null,
                  qty_to_add: adjustment.add,
                }
                  , { headers: { Authorization: `Bearer ${adminData?.token || adminData?.auth_token}` } }
                ),
              );
            }

            // Remove stock if needed
            if (adjustment.remove > 0) {
              stockPromises.push(
                axiosInstance.post(`${ApiURL}/removestock`, {
                  p_id,
                  pcolor_id,
                  psize_id: null,
                  qty_to_remove: adjustment.remove,
                }),
              );
            }
          }
        });
      }

      if (!product && hasSelectedSizes) {
        Object.entries(originalStock).forEach(([key, qty]) => {
          if (qty > 0) {
            const [color_id, size_id] = key.split("-");
            const pcolor_id = pColorMap[color_id];
            const psize_id = pSizeMap[size_id];

            if (pcolor_id && psize_id) {
              stockPromises.push(
                axiosInstance.post(`${ApiURL}/addstock`, {
                  p_id,
                  pcolor_id,
                  psize_id,
                  qty_to_add: qty,
                }
                  , { headers: { Authorization: `Bearer ${adminData?.token || adminData?.auth_token}` } }
                ),
              );
            }
          }
        });
      } else if (!product) {
        Object.entries(originalColorQuantities).forEach(([color_id, qty]) => {
          if (qty > 0) {
            const pcolor_id = pColorMap[color_id];
            if (pcolor_id) {
              stockPromises.push(
                axiosInstance.post(`${ApiURL}/addstock`, {
                  p_id,
                  pcolor_id,
                  psize_id: null,
                  qty_to_add: qty,
                }
                  , { headers: { Authorization: `Bearer ${adminData?.token || adminData?.auth_token}` } }
                ),
              );
            }
          }
        });
      }

      if (stockPromises.length > 0) {
        await Promise.all(stockPromises);
      }

      toast.success(
        product ? "Product & stock updated!" : "Product created with stock!",
      );
      refreshProducts();
      onClose();
    } catch (err) {
      toast.error("Error: " + (err.response?.data?.description || err.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-4 sm:p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {product ? "Edit Product" : "Add New Product"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-900 p-2 rounded-full hover:bg-gray-100"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* All form fields unchanged */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 border border-black rounded focus:ring-2 focus:ring-gray-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category *
              </label>
              <select
                name="cate_id"
                value={formData.cate_id}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 border border-black rounded focus:ring-2 focus:ring-gray-500 outline-none"
                required
              >
                <option value="">Select Category</option>
                {categories?.map((category) => (
                  <option key={category.cate_id} value={category.cate_id}>
                    {category.cate_name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Collection *
              </label>
              <select
                name="sc_id"
                value={formData.sc_id}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 border border-black rounded focus:ring-2 focus:ring-gray-500 outline-none"
              >
                <option value="">Select Collection</option>
                {subcategories?.map((category) => (
                  <option key={category.sc_id} value={category.sc_id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fabric *
              </label>
              <select
                name="f_id"
                value={formData.f_id}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 outline-none"
              >
                <option value="">Select</option>
                {fabrics.map((f) => (
                  <option key={f.f_id} value={f.f_id}>
                    {f.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Work *
              </label>
              <select
                name="work_id"
                value={formData.work_id}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 outline-none"
              >
                <option value="">Select</option>
                {works?.map((w) => (
                  <option key={w.work_id} value={w.work_id}>
                    {w.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Occasion *
              </label>
              <select
                name="occasion_id"
                value={formData.occasion_id}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 outline-none"
              >
                <option value="">Select</option>
                {occasions?.map((o) => (
                  <option key={o.occasion_id} value={o.occasion_id}>
                    {o.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Style *
              </label>
              <select
                name="style_id"
                value={formData.style_id}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 outline-none"
              >
                <option value="">Select</option>
                {styles?.map((o) => (
                  <option key={o.style_id} value={o.style_id}>
                    {o.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Original Price
              </label>
              <input
                type="number"
                name="original_price"
                value={formData.original_price}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                SKU *
              </label>
              <input
                type="text"
                name="sku"
                value={formData.sku}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Weight
              </label>
              <input
                type="number"
                name="weight"
                placeholder="Weight in Kg"
                value={formData.weight}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Length
              </label>
              <input
                type="number"
                name="length"
                placeholder="length in cm"
                value={formData.length}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Width
              </label>
              <input
                type="number"
                name="width"
                placeholder="width in cm"
                value={formData.width}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Height
              </label>
              <input
                type="number"
                name="height"
                placeholder="height in cm"
                value={formData.height}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Meta Title
              </label>
              <input
                type="text"
                name="meta_title"
                value={formData.meta_title}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 outline-none"
              />
            </div>
            <div className="sm:col-span-2 lg:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Meta Description
              </label>
              <textarea
                name="meta_description"
                value={formData.meta_description}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 outline-none min-h-[80px]"
              />
            </div>
            <div className="sm:col-span-2 lg:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Keywords
              </label>
              <input
                type="text"
                name="keywords"
                value={formData.keywords}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 outline-none min-h-[100px]"
            />
          </div>

          <div className="md:col-span-2">
            <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
              <input
                type="checkbox"
                name="is_expert_choice"
                checked={formData.is_expert_choice}
                onChange={handleInputChange}
                className="mr-2 h-4 w-4 text-black border-gray-300 rounded focus:ring-black"
              />
              Add To Reel Section
            </label>
          </div>

          {/* Color section */}
          {/* Color section - Now supports Images + Videos (same design) */}
          <div className="bg-gray-50 p-6 rounded-xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Colors & Media (Images + Videos)
            </h3>
            {formData.colors.map((color, i) => (
              <div key={i} className="bg-white p-4 rounded-lg border mb-4">
                <div className="flex gap-4 items-center">
                  <select
                    value={color.color_id}
                    onChange={(e) => {
                      const updated = [...formData.colors];
                      updated[i].color_id = e.target.value;
                      setFormData({ ...formData, colors: updated });
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">Select Color</option>
                    {colorsList.map((c) => (
                      <option key={c.color_id} value={c.color_id}>
                        {c.color_name}
                      </option>
                    ))}
                  </select>
                  <label className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded">
                    Upload Images / Videos
                    <input
                      type="file"
                      multiple
                      accept="image/*,video/mp4,video/webm,video/quicktime"
                      className="hidden"
                      onChange={(e) => {
                        const newFiles = Array.from(e.target.files);
                        if (newFiles.length === 0) return;

                        const updatedColors = [...formData.colors];
                        const currentFiles = updatedColors[i].images || [];
                        updatedColors[i].images = [
                          ...currentFiles,
                          ...newFiles,
                        ];

                        setFormData({ ...formData, colors: updatedColors });
                        e.target.value = "";
                      }}
                    />
                  </label>
                  {formData.colors.length > 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          colors: prev.colors.filter((_, idx) => idx !== i),
                        }));
                      }}
                      className="text-red-600"
                    >
                      <Trash2 />
                    </button>
                  )}
                </div>

                <div className="flex gap-3 mt-4 flex-wrap">
                  {/* Existing images (unchanged - only images from DB) */}
                  {(existingMedia[i]?.images || []).map((img) => {
                    const mediaUrl = `${ApiURL}/assets/Products/${img.image_url}`;
                    const isVideo = /\.(mp4|webm|mov|avi|quicktime)$/i.test(
                      img.image_url,
                    );
                    <div key={img.image_id} className="relative group">
                      {isVideo ? (
                        <video
                          src={mediaUrl}
                          className="w-24 h-24 object-cover rounded-lg border"
                          muted
                        />
                      ) : (
                        <img
                          src={mediaUrl}
                          alt="existing"
                          className="w-24 h-24 object-cover rounded-lg border"
                        />
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          setDeletedMediaIds((prev) => [...prev, img.image_id]);
                          setExistingMedia((prev) => {
                            const updated = [...prev];
                            updated[i].images = updated[i].images.filter(
                              (x) => x.image_id !== img.image_id,
                            );
                            return updated;
                          });
                        }}
                        className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition rounded-lg"
                      >
                        <Trash2 className="w-6 h-6 text-white" />
                      </button>
                    </div>;
                  })}

                  {/* New uploaded media (images + videos) with drag-to-reorder */}
                  {formData.colors[i]?.images?.length > 0 && (
                    <div
                      className="flex gap-3 flex-wrap"
                      onDragOver={(e) => e.preventDefault()}
                    >
                      {formData.colors[i].images.map((file, idx) => {
                        const isVideo = file.type.startsWith("video/");

                        return (
                          <div
                            key={idx}
                            draggable
                            onDragStart={(e) => {
                              e.dataTransfer.setData(
                                "dragIndex",
                                idx.toString(),
                              );
                            }}
                            onDrop={(e) => {
                              e.preventDefault();
                              const fromIndex = parseInt(
                                e.dataTransfer.getData("dragIndex"),
                              );
                              const toIndex = idx;

                              if (fromIndex === toIndex) return;

                              setFormData((prev) => {
                                const updated = [...prev.colors];
                                const images = [...updated[i].images];
                                const [moved] = images.splice(fromIndex, 1);
                                images.splice(toIndex, 0, moved);
                                updated[i].images = images;
                                return { ...prev, colors: updated };
                              });
                            }}
                            className="relative group cursor-move"
                          >
                            {isVideo ? (
                              <video
                                src={URL.createObjectURL(file)}
                                className="w-24 h-24 object-cover rounded-lg border"
                                muted
                              />
                            ) : (
                              <img
                                src={URL.createObjectURL(file)}
                                alt={`preview-${idx}`}
                                className="w-24 h-24 object-cover rounded-lg border"
                              />
                            )}

                            {/* Play icon for videos */}
                            {isVideo && (
                              <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-lg">
                                <svg
                                  className="w-8 h-8 text-white"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M8 5v14l11-7z" />
                                </svg>
                              </div>
                            )}

                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition rounded-lg">
                              <span className="text-white text-xs font-medium">
                                Drag to reorder
                              </span>
                            </div>

                            <button
                              type="button"
                              onClick={() => {
                                setFormData((prev) => {
                                  const updated = [...prev.colors];
                                  updated[i].images = updated[i].images.filter(
                                    (_, index) => index !== idx,
                                  );
                                  return { ...prev, colors: updated };
                                });
                              }}
                              className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={() =>
                setFormData((prev) => ({
                  ...prev,
                  colors: [...prev.colors, { color_id: "", images: [] }],
                }))
              }
              className="text-blue-600 flex items-center gap-2"
            >
              <PlusCircle /> Add Color
            </button>
          </div>

          {/* Sizes Section - No duplicate sizes allowed */}
          {formData.cate_id && sizesList.length > 0 && (
            <div className="bg-gray-50 p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Sizes</h3>
              {formData.sizes.map((size, i) => {
                // Get all currently selected size_ids (excluding current index to allow editing)
                const selectedSizeIds = formData.sizes
                  .filter((_, idx) => idx !== i)
                  .map((s) => parseFloat(s.size_id))
                  .filter(Boolean);

                // Filter available sizes: exclude already selected ones
                const availableSizes = sizesList.filter(
                  (s) => !selectedSizeIds.includes(s.size_id),
                );
                return (
                  <div key={i} className="flex gap-4 mb-3 items-center">
                    <select
                      value={size.size_id || ""}
                      onChange={(e) => {
                        const newValue = e.target.value;
                        setFormData((prev) => {
                          const updatedSizes = [...prev.sizes];
                          updatedSizes[i] = {
                            ...updatedSizes[i],
                            size_id: newValue,
                          };
                          return { ...prev, sizes: updatedSizes };
                        });
                      }}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="">Select Size</option>
                      {availableSizes.map((s) => (
                        <option key={s.size_id} value={s.size_id}>
                          {s.size_name}
                        </option>
                      ))}
                    </select>
                    {formData.sizes.length > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          setFormData((prev) => ({
                            ...prev,
                            sizes: prev.sizes.filter((_, idx) => idx !== i),
                          }));
                        }}
                        className="text-red-600"
                      >
                        <Trash2 />
                      </button>
                    )}
                  </div>
                );
              })}
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    sizes: [...prev.sizes, { size_id: "" }],
                  }))
                }
                className="text-blue-600 flex items-center gap-2"
              >
                <PlusCircle /> Add Size
              </button>
            </div>
          )}

          {formData.colors.some((c) => c.color_id) && (
            <div className="bg-green-50 border-2 border-green-300 rounded-xl p-8">
              <h3 className="text-2xl font-bold text-green-800 mb-6">
                Stock Adjustment
              </h3>

              {hasSelectedSizes ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full border-collapse">
                    <thead>
                      <tr className="bg-green-100">
                        <th className="border border-green-400 px-6 py-4 text-left">
                          Size → Color ↓
                        </th>
                        <th className="border border-green-400 px-6 py-4 text-center">
                          Current Stock
                        </th>
                        <th className="border border-green-400 px-6 py-4 text-center">
                          Add Stock
                        </th>
                        <th className="border border-green-400 px-6 py-4 text-center">
                          Remove Stock
                        </th>
                        <th className="border border-green-400 px-6 py-4 text-center">
                          New Total
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {formData.sizes
                        .filter((s) => s.size_id)
                        .map((size) => {
                          const sizeName =
                            sizesList.find((s) => s.size_id == size.size_id)
                              ?.size_name || "Size";

                          return formData.colors
                            .filter((c) => c.color_id)
                            .map((color) => {
                              const colorName =
                                colorsList.find(
                                  (c) => c.color_id == color.color_id,
                                )?.color_name || "Color";
                              const key = `${color.color_id}-${size.size_id}`;
                              const currentStock = originalStock[key] || 0;
                              const adjustment = stockAdjustments[key] || {
                                add: 0,
                                remove: 0,
                              };
                              const newTotal =
                                currentStock +
                                adjustment.add -
                                adjustment.remove;

                              return (
                                <tr key={key}>
                                  <td className="border border-green-400 px-6 py-4">
                                    {colorName} - {sizeName}
                                  </td>
                                  <td className="border border-green-400 px-6 py-4 text-center">
                                    {currentStock}
                                  </td>
                                  <td className="border border-green-400 p-3 text-center">
                                    <input
                                      type="number"
                                      min="0"
                                      placeholder="Add"
                                      className="w-24 px-3 py-2 border rounded text-center"
                                      value={adjustment.add || 0}
                                      onChange={(e) =>
                                        handleAddChange(
                                          color.color_id,
                                          size.size_id,
                                          e.target.value,
                                        )
                                      }
                                    />
                                  </td>
                                  <td className="border border-green-400 p-3 text-center">
                                    <input
                                      type="number"
                                      min="0"
                                      max={currentStock + adjustment.add}
                                      placeholder="Remove"
                                      className="w-24 px-3 py-2 border rounded text-center"
                                      value={adjustment.remove || 0}
                                      onChange={(e) =>
                                        handleRemoveChange(
                                          color.color_id,
                                          size.size_id,
                                          e.target.value,
                                        )
                                      }
                                    />
                                  </td>
                                  <td className="border border-green-400 px-6 py-4 text-center font-bold">
                                    {newTotal}
                                  </td>
                                </tr>
                              );
                            });
                        })}
                    </tbody>
                  </table>
                  <p className="text-sm text-green-700 mt-4">
                    Enter amounts to add or remove from current stock. Remove
                    cannot exceed current + added stock.
                  </p>
                </div>
              ) : (
                <div>
                  {/* Headings for Color-Only */}
                  <div className="grid grid-cols-5 gap-4 mb-4 px-4 font-bold text-green-800">
                    <div className="col-span-1">Color</div>
                    <div className="text-center">Current Stock</div>
                    <div className="text-center">Add Stock</div>
                    <div className="text-center">Remove Stock</div>
                    <div className="text-center">New Total</div>
                  </div>

                  {/* Color Rows */}
                  <div className="space-y-4">
                    {formData.colors
                      .filter((c) => c.color_id)
                      .map((color) => {
                        const colorName =
                          colorsList.find((c) => c.color_id == color.color_id)
                            ?.color_name || "Color";
                        const currentStock =
                          originalColorQuantities[color.color_id] || 0;
                        const adjustment = colorAdjustments[color.color_id] || {
                          add: 0,
                          remove: 0,
                        };
                        const newTotal =
                          currentStock + adjustment.add - adjustment.remove;

                        return (
                          <div
                            key={color.color_id}
                            className="grid grid-cols-5 gap-4 items-center bg-white p-4 rounded-lg border border-green-200"
                          >
                            <div className="font-medium">{colorName}</div>
                            <div className="text-center font-bold">
                              {currentStock}
                            </div>
                            <div className="text-center">
                              <input
                                type="number"
                                min="0"
                                placeholder="Add"
                                className="w-full max-w-24 px-3 py-2 border rounded text-center"
                                value={adjustment.add || 0}
                                onChange={(e) =>
                                  handleColorAddChange(
                                    color.color_id,
                                    e.target.value,
                                  )
                                }
                              />
                            </div>
                            <div className="text-center">
                              <input
                                type="number"
                                min="0"
                                max={currentStock + adjustment.add}
                                placeholder="Remove"
                                className="w-full max-w-24 px-3 py-2 border rounded text-center"
                                value={adjustment.remove || 0}
                                onChange={(e) =>
                                  handleColorRemoveChange(
                                    color.color_id,
                                    e.target.value,
                                  )
                                }
                              />
                            </div>
                            <div className="text-center font-bold text-green-700">
                              {newTotal}
                            </div>
                          </div>
                        );
                      })}
                  </div>

                  <p className="text-sm text-green-700 mt-4">
                    Enter amounts to add or remove. Remove cannot exceed current
                    + added stock.
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="flex justify-end gap-4 pt-8">
            <button
              type="button"
              onClick={onClose}
              className="px-8 py-3 bg-gray-300 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 bg-black text-white rounded-lg disabled:opacity-50"
            >
              {isSubmitting
                ? "Saving..."
                : product
                  ? "Update Product + Stock"
                  : "Create Product + Stock"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;
