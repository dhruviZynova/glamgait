import React from "react";
import { PlusCircle, Trash2 } from "lucide-react";

const SizesSection = ({
  formData,
  setFormData,
  sizesList
}) => {
  if (!formData.cate_id || sizesList.length === 0) return null;

  return (
    <div className="bg-gray-50 p-6 rounded-xl">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Sizes</h3>
      {formData.sizes.map((size, i) => {
        const selectedSizeIds = formData.sizes
          .filter((_, idx) => idx !== i)
          .map((s) => parseFloat(s.size_id))
          .filter(Boolean);

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
        className="text-blue-600 flex items-center gap-2 cursor-pointer"
      >
        <PlusCircle /> Add Size
      </button>
    </div>
  );
};

export default SizesSection;
