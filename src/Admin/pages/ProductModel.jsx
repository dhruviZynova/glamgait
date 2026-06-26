import { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
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
  const [loading, setLoading] = useState(false);

  const [originalStock, setOriginalStock] = useState({});
  const [originalColorQuantities, setOriginalColorQuantities] = useState({});
  const [stockAdjustments, setStockAdjustments] = useState({});
  const [colorAdjustments, setColorAdjustments] = useState({});

  const hasSelectedSizes = formData.sizes.some((s) => s.size_id);

  // Initial Data Load
  useEffect(() => {
    if (!isOpen) return;

    // Reset all state to pristine initial state immediately upon open
    setIsSubmitting(false);
    setExistingMedia([]);
    setDeletedMediaIds([]);
    setStockAdjustments({});
    setColorAdjustments({});
    setOriginalStock({});
    setOriginalColorQuantities({});
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

    if (!product) {
      return;
    }

    const loadProductData = async () => {
      try {
        setLoading(true);
        const res = await adminAxios.get(`${ApiURL}/getproductbyid/${product.p_id}`);
        const prod = res.data.data;
        if (!prod) return;

        // Deduplicate colors
        const uniqueColors = [];
        const seenColorIds = new Set();
        prod.productcolors?.forEach((pc) => {
          if (pc.color_id && !seenColorIds.has(pc.color_id)) {
            seenColorIds.add(pc.color_id);
            uniqueColors.push({
              color_id: pc.color_id,
              images: [],
            });
          }
        });

        // Deduplicate sizes
        const uniqueSizes = [];
        const seenSizeIds = new Set();
        prod.productsizes?.forEach((ps) => {
          if (ps.size_id && !seenSizeIds.has(ps.size_id)) {
            seenSizeIds.add(ps.size_id);
            uniqueSizes.push({
              size_id: ps.size_id,
            });
          }
        });

        setFormData({
          name: prod.name || "",
          cate_id: prod.cate_id || "",
          sc_id: prod.sc_id || "",
          f_id: prod.f_id || "",
          work_id: prod.work_id || "",
          occasion_id: prod.occasion_id || "",
          style_id: prod.style_id || "",
          price: prod.price || "",
          original_price: prod.original_price || "",
          description: prod.description || "",
          sku: prod.sku || "",
          meta_title: prod.meta_title || "",
          meta_description: prod.meta_description || "",
          keywords: prod.keywords || "",
          is_expert_choice: !!prod.is_expert_choice,
          weight: prod.weight || "",
          length: prod.length || "",
          width: prod.width || "",
          height: prod.height || "",
          colors: uniqueColors.length > 0 ? uniqueColors : [{ color_id: "", images: [] }],
          sizes: uniqueSizes.length > 0 ? uniqueSizes : [{ size_id: "" }],
        });

        // Map all database rows pcolor_id -> color_id (handles existing DB duplicates robustly)
        const pcolorToColorId = {};
        prod.productcolors?.forEach((pc) => {
          pcolorToColorId[pc.pcolor_id] = pc.color_id;
        });

        // Build a video and image lookup from prod.colors (color_id -> video & images)
        const colorVideoMap = {};
        const colorImagesMap = {};
        (prod.colors || []).forEach((c) => {
          if (c.color_id) {
            const idStr = String(c.color_id);
            if (c.video) {
              colorVideoMap[idStr] = c.video;
              colorVideoMap[c.color_id] = c.video;
            }
            if (c.images) {
              colorImagesMap[idStr] = c.images;
              colorImagesMap[c.color_id] = c.images;
            }
          }
          if (c.color_name) {
            const nameLower = c.color_name.toLowerCase();
            if (c.video) colorVideoMap[nameLower] = c.video;
            if (c.images) colorImagesMap[nameLower] = c.images;
          }
        });

        // Deduplicate existing media rows for display
        const existing = [];
        const seenColorIdsForMedia = new Set();
        prod.productcolors?.forEach((pc) => {
          if (pc.color_id && !seenColorIdsForMedia.has(pc.color_id)) {
            seenColorIdsForMedia.add(pc.color_id);

            const colorIdStr = pc.color?.color_id ? String(pc.color.color_id) : pc.color_id ? String(pc.color_id) : "";
            const colorNameStr = pc.color?.color_name?.toLowerCase() || pc.color_name?.toLowerCase() || "";

            const videoUrl = colorVideoMap[colorIdStr] || pc.video || "";
            const rawImages = colorImagesMap[colorIdStr] || 
                              (colorNameStr ? colorImagesMap[colorNameStr] : []) || 
                              pc.productimages || 
                              [];
            const imagesList = rawImages.map(img => {
              if (typeof img === "string") return { image_url: img };
              if (img && img.image_url) return { image_url: img.image_url };
              return img;
            });

            existing.push({
              pcolor_id: pc.pcolor_id,
              color_name: pc.color?.color_name || "Unknown",
              images: imagesList,
              video: videoUrl,
            });
          }
        });
        setExistingMedia(existing);

        if (prod?.productsizes?.length > 0 && prod.productvariants) {
          const matrix = {};
          const adjustments = {};
          prod.productvariants.forEach((v) => {
            if (v.pcolor_id && v.psize_id) {
              const colorId = pcolorToColorId[v.pcolor_id];
              const size = prod.productsizes.find((ps) => ps.psize_id === v.psize_id);
              if (colorId && size) {
                const key = `${colorId}-${size.size_id}`;
                matrix[key] = (matrix[key] || 0) + (v.remaining_qty || 0); // Accumulate stock robustly!
                adjustments[key] = { add: 0, remove: 0 };
              }
            }
          });
          setOriginalStock(matrix);
          setStockAdjustments(adjustments);
        } else if (prod?.productvariants) {
          const qtyMap = {};
          const colorAdj = {};
          prod.productvariants.forEach((v) => {
            if (v.pcolor_id) {
              const colorId = pcolorToColorId[v.pcolor_id];
              if (colorId) {
                qtyMap[colorId] = (qtyMap[colorId] || 0) + (v.remaining_qty || 0); // Accumulate stock robustly!
                colorAdj[colorId] = { add: 0, remove: 0 };
              }
            }
          });
          setOriginalColorQuantities(qtyMap);
          setColorAdjustments(colorAdj);
        }
      } catch (err) {
        console.error("Failed to load fresh product data by ID:", err);
        toast.error("Failed to load fresh product details");
      } finally {
        setLoading(false);
      }
    };

    loadProductData();
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

    if (!formData.name || !formData.name.trim()) {
      toast.error("Product Name is required!");
      setIsSubmitting(false);
      return;
    }
    if (!formData.cate_id) {
      toast.error("Category is required!");
      setIsSubmitting(false);
      return;
    }
    if (!formData.sc_id) {
      toast.error("Collection is required!");
      setIsSubmitting(false);
      return;
    }
    if (!formData.f_id) {
      toast.error("Fabric is required!");
      setIsSubmitting(false);
      return;
    }
    if (!formData.work_id) {
      toast.error("Work is required!");
      setIsSubmitting(false);
      return;
    }
    if (!formData.occasion_id) {
      toast.error("Occasion is required!");
      setIsSubmitting(false);
      return;
    }
    if (!formData.style_id) {
      toast.error("Style is required!");
      setIsSubmitting(false);
      return;
    }
    if (!formData.price) {
      toast.error("Price is required!");
      setIsSubmitting(false);
      return;
    }
    if (!formData.original_price) {
      toast.error("Original Price is required!");
      setIsSubmitting(false);
      return;
    }
    if (!formData.sku || !formData.sku.trim()) {
      toast.error("SKU is required!");
      setIsSubmitting(false);
      return;
    }
    if (formData.colors.some((c) => !c.color_id)) {
      toast.error("Please select a color");
      setIsSubmitting(false);
      return;
    }
    for (let i = 0; i < formData.colors.length; i++) {
      const newImagesCount = formData.colors[i].images?.length || 0;
      const existingImagesCount = existingMedia[i]?.images?.length || 0;
      if (newImagesCount + existingImagesCount === 0) {
        toast.error("Please upload at least one image or video for each color!");
        setIsSubmitting(false);
        return;
      }
    }

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
      color.images.forEach((file) => {
        if (file && file.type && file.type.startsWith("video/")) {
          data.append("video", file);
        } else {
          data.append(`images_color_${i}`, file);
        }
      });
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
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-black"></div>
            <p className="text-sm font-medium text-gray-500 animate-pulse">Loading latest product details...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
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
                className="flex items-center gap-2 px-6 py-2 bg-black text-white rounded-xl hover:bg-gray-900 transition-all duration-200 shadow-sm text-sm font-medium cursor-pointer disabled:opacity-50"
              >
                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                {isSubmitting ? "Saving..." : (product ? "Update Product" : "Create Product")}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ProductModal;
