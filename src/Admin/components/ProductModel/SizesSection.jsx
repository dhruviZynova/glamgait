import React, { useState, useEffect, useRef } from "react";
import { PlusCircle, Trash2, ChevronDown } from "lucide-react";

const SizesSection = ({
  formData,
  setFormData,
  sizesList
}) => {
  const [openSizeIndex, setOpenSizeIndex] = useState(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpenSizeIndex(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!formData.cate_id || sizesList.length === 0) return null;

  return (
    <div className="bg-gray-50 p-6 rounded-xl" ref={containerRef}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Sizes</h3>
      {formData.sizes.map((size, i) => {
        const selectedSizeIds = formData.sizes
          .filter((_, idx) => idx !== i)
          .map((s) => parseFloat(s.size_id))
          .filter(Boolean);

        const availableSizes = sizesList.filter(
          (s) => !selectedSizeIds.includes(s.size_id),
        );

        const selectedSize = sizesList.find(s => String(s.size_id) === String(size.size_id));

        return (
          <div key={i} className="flex gap-4 mb-3 items-center">
            <div className="relative flex-1">
              <button
                type="button"
                onClick={() => setOpenSizeIndex(openSizeIndex === i ? null : i)}
                className="flex items-center justify-between w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                <span>
                  {selectedSize ? selectedSize.size_name : "Select Size"}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-gray-500 transition-transform duration-200 flex-shrink-0 ${
                    openSizeIndex === i ? "rotate-180 text-[#0f1115]" : ""
                  }`}
                />
              </button>

              {openSizeIndex === i && (
                <div className="absolute left-0 w-full mt-1 bg-white rounded-lg shadow-xl border border-gray-200 overflow-y-auto max-h-60 z-[100] transform origin-top transition-all duration-200">
                  <button
                    type="button"
                    onClick={() => {
                      setFormData((prev) => {
                        const updatedSizes = [...prev.sizes];
                        updatedSizes[i] = {
                          ...updatedSizes[i],
                          size_id: "",
                        };
                        return { ...prev, sizes: updatedSizes };
                      });
                      setOpenSizeIndex(null);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors cursor-pointer flex items-center justify-between ${
                      !size.size_id
                        ? "bg-[#0f1115]/10 text-[#0f1115] font-semibold"
                        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <span>Select Size</span>
                    {!size.size_id && (
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
                  {availableSizes.map((s) => {
                    const isSelected = String(s.size_id) === String(size.size_id);
                    return (
                      <button
                        key={s.size_id}
                        type="button"
                        onClick={() => {
                          setFormData((prev) => {
                            const updatedSizes = [...prev.sizes];
                            updatedSizes[i] = {
                              ...updatedSizes[i],
                              size_id: s.size_id,
                            };
                            return { ...prev, sizes: updatedSizes };
                          });
                          setOpenSizeIndex(null);
                        }}
                        className={`w-full text-left px-4 py-2.5 text-sm transition-colors cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? "bg-[#0f1115]/10 text-[#0f1115] font-semibold"
                            : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                        }`}
                      >
                        <span>{s.size_name}</span>
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
        className="text-black flex items-center gap-2 cursor-pointer"
      >
        <PlusCircle /> Add Size
      </button>
    </div>
  );
};

export default SizesSection;
