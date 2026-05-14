import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { ApiURL } from "../../Variable";
import toast from "react-hot-toast";
import { adminAxios } from "../../Axios/axios";

// Sub-components
import BasicDetailsSection from "../components/ProductModel/BasicDetailsSection";
import MediaSection from "../components/ProductModel/MediaSection";
import SizesSection from "../components/ProductModel/SizesSection";
import StockMatrix from "../components/ProductModel/StockMatrix";
import MetadataSection from "../components/ProductModel/MetadataSection";

const ProductModal = ({ isOpen, onClose, product, refreshProducts }) => {
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
  const [originalStock, setOriginalStock] = useState({});
  const [originalColorQuantities, setOriginalColorQuantities] = useState({});
  const [stockAdjustments, setStockAdjustments] = useState({});
  const [colorAdjustments, setColorAdjustments] = useState({});

  const hasSelectedSizes = formData.sizes.some((s) => s.size_id);

  // Initial Data Load
  useEffect(() => {
    if (!product) {
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

    // Edit Mode Hydration
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

    const existing = product.productcolors?.map((pc) => ({
      pcolor_id: pc.pcolor_id,
      color_name: pc.color?.color_name || "Unknown",
      images: pc.productimages || [],
    }));
    setExistingMedia(existing || []);

    if (product?.productsizes?.length > 0 && product.productvariants) {
      const matrix = {};
      const adjustments = {};
      product.productvariants.forEach((v) => {
        if (v.pcolor_id && v.psize_id) {
          const colorId = Object.keys(mapping).find((cid) => mapping[cid] === v.pcolor_id);
          const size = product.productsizes.find((ps) => ps.psize_id === v.psize_id);
          if (colorId && size) {
            const key = `${colorId}-${size.size_id}`;
            matrix[key] = v.remaining_qty || 0;
            adjustments[key] = { add: 0, remove: 0 };
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
          const colorId = Object.keys(mapping).find((cid) => mapping[cid] === v.pcolor_id);
          if (colorId) {
            qtyMap[colorId] = v.remaining_qty || 0;
            colorAdj[colorId] = { add: 0, remove: 0 };
          }
        }
      });
      setOriginalColorQuantities(qtyMap);
      setColorAdjustments(colorAdj);
    }
  }, [product, isOpen]);

  // Fetch Dropdown Data
  useEffect(() => {
    adminAxios.get(`${ApiURL}/getcategory`).then((res) => setCategories(res.data.data || [])).catch(console.error);
  }, []);

  useEffect(() => {
    if (!formData.cate_id) {
      setSubCategories([]); setFabrics([]); setWorks([]); setOccasions([]); setStyles([]); setSizesList([]); setColorsList([]);
      return;
    }
    Promise.all([
      adminAxios.get(`${ApiURL}/getcolor`).then((r) => setColorsList(r.data.data || [])),
      adminAxios.get(`${ApiURL}/getsize/${formData.cate_id}`).then((r) => setSizesList(r.data.data || [])),
      adminAxios.get(`${ApiURL}/getsubcategory/${formData.cate_id}`).then((r) => setSubCategories(r.data.data || [])),
      adminAxios.get(`${ApiURL}/getworks/${formData.cate_id}`).then((r) => setWorks(r.data.data || [])),
      adminAxios.get(`${ApiURL}/getfabrics/${formData.cate_id}`).then((r) => setFabrics(r.data.data || [])),
      adminAxios.get(`${ApiURL}/getstyles/${formData.cate_id}`).then((r) => setStyles(r.data.data || [])),
      adminAxios.get(`${ApiURL}/getoccasions/${formData.cate_id}`).then((r) => setOccasions(r.data.data || [])),
    ]).catch(console.error);
  }, [formData.cate_id]);

  // Handlers
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleAddChange = (colorId, sizeId, value) => {
    const num = value === "" ? 0 : parseInt(value, 10) || 0;
    const key = `${colorId}-${sizeId}`;
    setStockAdjustments((prev) => ({ ...prev, [key]: { ...prev[key], add: num, remove: prev[key]?.remove || 0 } }));
  };

  const handleRemoveChange = (colorId, sizeId, value) => {
    const num = value === "" ? 0 : parseInt(value, 10) || 0;
    const key = `${colorId}-${sizeId}`;
    const maxAllowed = (originalStock[key] || 0) + (stockAdjustments[key]?.add || 0);
    setStockAdjustments((prev) => ({ ...prev, [key]: { ...prev[key], remove: Math.min(num, maxAllowed) } }));
  };

  const handleColorAddChange = (colorId, value) => {
    const num = value === "" ? 0 : parseInt(value, 10) || 0;
    setColorAdjustments((prev) => ({ ...prev, [colorId]: { ...prev[colorId], add: num, remove: prev[colorId]?.remove || 0 } }));
  };

  const handleColorRemoveChange = (colorId, value) => {
    const num = value === "" ? 0 : parseInt(value, 10) || 0;
    const maxAllowed = (originalColorQuantities[colorId] || 0) + (colorAdjustments[colorId]?.add || 0);
    setColorAdjustments((prev) => ({ ...prev, [colorId]: { ...prev[colorId], remove: Math.min(num, maxAllowed) } }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    const colorIds = formData.colors.map((c) => c.color_id).filter(Boolean);
    if (new Set(colorIds).size !== colorIds.length) {
      toast.error("Duplicate colors not allowed!");
      setIsSubmitting(false);
      return;
    }

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (!["colors", "sizes"].includes(key)) {
        data.append(key, key === "is_expert_choice" ? (formData[key] ? 1 : 0) : formData[key]);
      }
    });

    data.append("colors", JSON.stringify(formData.colors.map((c) => ({ color_id: c.color_id }))));
    data.append("sizes", JSON.stringify(formData.sizes.map((s) => ({ size_id: s.size_id }))));

    formData.colors.forEach((color, i) => {
      color.images.forEach((file) => data.append(`images_color_${i}`, file));
    });

    if (product) data.append("deleted_media", JSON.stringify(deletedMediaIds));

    try {
      const url = product ? `${ApiURL}/updateproduct/${product.p_id}` : `${ApiURL}/insertproduct`;
      const res = await adminAxios.post(url, data);
      if (res.data.status !== 1) throw new Error(res.data.description || "Failed");

      const p_id = product?.p_id || res.data.data.p_id;
      const fullRes = await adminAxios.get(`${ApiURL}/getproductbyid/${p_id}`);
      const fullProduct = fullRes.data.data;

      const pColorMap = {}; fullProduct.productcolors.forEach(pc => pColorMap[pc.color_id] = pc.pcolor_id);
      const pSizeMap = {}; fullProduct.productsizes.forEach(ps => pSizeMap[ps.size_id] = ps.psize_id);

      const stockPromises = [];
      if (hasSelectedSizes) {
        Object.entries(stockAdjustments).forEach(([key, adj]) => {
          const [cid, sid] = key.split("-");
          const pcid = pColorMap[cid]; const psid = pSizeMap[sid];
          if (pcid && psid) {
            if (adj.add > 0) stockPromises.push(adminAxios.post(`${ApiURL}/addstock`, { p_id, pcolor_id: pcid, psize_id: psid, qty_to_add: adj.add }));
            if (adj.remove > 0) stockPromises.push(adminAxios.post(`${ApiURL}/removestock`, { p_id, pcolor_id: pcid, psize_id: psid, qty_to_remove: adj.remove }));
          }
        });
      } else {
        Object.entries(colorAdjustments).forEach(([cid, adj]) => {
          const pcid = pColorMap[cid];
          if (pcid) {
            if (adj.add > 0) stockPromises.push(adminAxios.post(`${ApiURL}/addstock`, { p_id, pcolor_id: pcid, psize_id: null, qty_to_add: adj.add }));
            if (adj.remove > 0) stockPromises.push(adminAxios.post(`${ApiURL}/removestock`, { p_id, pcolor_id: pcid, psize_id: null, qty_to_remove: adj.remove }));
          }
        });
      }

      // Initial stock for new products
      if (!product) {
        if (hasSelectedSizes) {
          Object.entries(originalStock).forEach(([key, qty]) => {
            const [cid, sid] = key.split("-");
            if (qty > 0 && pColorMap[cid] && pSizeMap[sid]) {
              stockPromises.push(adminAxios.post(`${ApiURL}/addstock`, { p_id, pcolor_id: pColorMap[cid], psize_id: pSizeMap[sid], qty_to_add: qty }));
            }
          });
        } else {
          Object.entries(originalColorQuantities).forEach(([cid, qty]) => {
            if (qty > 0 && pColorMap[cid]) {
              stockPromises.push(adminAxios.post(`${ApiURL}/addstock`, { p_id, pcolor_id: pColorMap[cid], psize_id: null, qty_to_add: qty }));
            }
          });
        }
      }

      if (stockPromises.length > 0) await Promise.all(stockPromises);
      toast.success(product ? "Product updated!" : "Product created!");
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
          <h2 className="text-lg font-semibold text-gray-900">
            {product ? "Edit Product" : "Add New Product"}
          </h2>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-900 p-2 rounded-full hover:bg-gray-100 cursor-pointer">
            <X className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <BasicDetailsSection
            formData={formData}
            handleInputChange={handleInputChange}
            categories={categories}
            subcategories={subcategories}
            fabrics={fabrics}
            works={works}
            occasions={occasions}
            styles={styles}
          />

          <MediaSection
            formData={formData}
            setFormData={setFormData}
            colorsList={colorsList}
            existingMedia={existingMedia}
            setExistingMedia={setExistingMedia}
            setDeletedMediaIds={setDeletedMediaIds}
          />

          <SizesSection
            formData={formData}
            setFormData={setFormData}
            sizesList={sizesList}
          />

          <StockMatrix
            formData={formData}
            colorsList={colorsList}
            sizesList={sizesList}
            originalStock={originalStock}
            stockAdjustments={stockAdjustments}
            handleAddChange={handleAddChange}
            handleRemoveChange={handleRemoveChange}
            hasSelectedSizes={hasSelectedSizes}
            originalColorQuantities={originalColorQuantities}
            colorAdjustments={colorAdjustments}
            handleColorAddChange={handleColorAddChange}
            handleColorRemoveChange={handleColorRemoveChange}
          />

          <MetadataSection
            formData={formData}
            handleInputChange={handleInputChange}
          />

          <div className="flex justify-end gap-4 pt-8">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all duration-200 shadow-sm text-sm font-medium cursor-pointer"
            >Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-black text-white rounded-xl hover:bg-gray-900 transition-all duration-200 shadow-sm text-sm font-medium cursor-pointer">
              {isSubmitting ? "Saving..." : (product ? "Update Product" : "Create Product")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;
