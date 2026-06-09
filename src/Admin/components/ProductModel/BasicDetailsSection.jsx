import React, { useState, useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";

const CustomSelect = ({
  label,
  name,
  value,
  options = [],
  placeholder,
  onChange,
  isOpen,
  onToggle,
  className
}) => {
  const selectedOption = options.find((opt) => String(opt.value) === String(value));

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="relative">
        <button
          type="button"
          onClick={onToggle}
          className={`flex items-center justify-between w-full bg-white text-gray-900 cursor-pointer focus:outline-none ${className || "px-4 py-2.5 border border-gray-200 rounded-lg text-sm"
            }`}
        >
          <span className="truncate">{selectedOption ? selectedOption.label : placeholder}</span>
          <ChevronDown
            className={`w-4 h-4 text-gray-500 transition-transform duration-200 flex-shrink-0 ${isOpen ? "rotate-180 text-[#23403b]" : ""
              }`}
          />
        </button>

        {isOpen && (
          <div className="absolute left-0 w-full mt-1 bg-white rounded-lg shadow-xl border border-gray-200 overflow-y-auto max-h-60 z-[100] transform origin-top transition-all duration-200">
            {placeholder && (
              <button
                type="button"
                onClick={() => {
                  onChange({ target: { name, value: "" } });
                  onToggle();
                }}
                className={`w-full text-left px-4 py-2.5 text-sm transition-colors cursor-pointer flex items-center justify-between ${!value
                  ? "bg-[#0f1115]/10 text-[#0f1115] font-semibold"
                  : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  }`}
              >
                <span>{placeholder}</span>
                {!value && (
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
            )}
            {options.map((option) => {
              const isSelected = String(option.value) === String(value);
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange({ target: { name, value: option.value } });
                    onToggle();
                  }}
                  className={`w-full text-left px-4 py-2.5 text-sm transition-colors cursor-pointer flex items-center justify-between ${isSelected
                    ? "bg-[#0f1115]/10 text-[#0f1115] font-semibold"
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                >
                  <span className="truncate">{option.label}</span>
                  {isSelected && (
                    <svg
                      className="w-4 h-4 text-[#0f1115] flex-shrink-0"
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
  );
};

const BasicDetailsSection = ({
  formData,
  handleInputChange,
  categories,
  subcategories,
  fabrics,
  works,
  occasions,
  styles
}) => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" ref={containerRef}>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Name *
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none"
          placeholder="Enter Product Name"
          required
        />
      </div>
      <CustomSelect
        label="Category *"
        name="cate_id"
        value={formData.cate_id}
        onChange={handleInputChange}
        options={categories?.map((c) => ({ value: c.cate_id, label: c.cate_name })) || []}
        placeholder="Select Category"
        isOpen={openDropdown === "category"}
        onToggle={() => setOpenDropdown(openDropdown === "category" ? null : "category")}
        required
      />
      <CustomSelect
        label="Collection *"
        name="sc_id"
        value={formData.sc_id}
        onChange={handleInputChange}
        options={subcategories?.map((s) => ({ value: s.sc_id, label: s.name })) || []}
        placeholder="Select Collection"
        isOpen={openDropdown === "collection"}
        onToggle={() => setOpenDropdown(openDropdown === "collection" ? null : "collection")}
      />
      <CustomSelect
        label="Fabric *"
        name="f_id"
        value={formData.f_id}
        onChange={handleInputChange}
        options={fabrics?.map((f) => ({ value: f.f_id, label: f.name })) || []}
        placeholder="Select"
        isOpen={openDropdown === "fabric"}
        onToggle={() => setOpenDropdown(openDropdown === "fabric" ? null : "fabric")}
        className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none"
      />
      <CustomSelect
        label="Work *"
        name="work_id"
        value={formData.work_id}
        onChange={handleInputChange}
        options={works?.map((w) => ({ value: w.work_id, label: w.name })) || []}
        placeholder="Select"
        isOpen={openDropdown === "work"}
        onToggle={() => setOpenDropdown(openDropdown === "work" ? null : "work")}
        className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none"
      />
      <CustomSelect
        label="Occasion *"
        name="occasion_id"
        value={formData.occasion_id}
        onChange={handleInputChange}
        options={occasions?.map((o) => ({ value: o.occasion_id, label: o.name })) || []}
        placeholder="Select"
        isOpen={openDropdown === "occasion"}
        onToggle={() => setOpenDropdown(openDropdown === "occasion" ? null : "occasion")}
        className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none"
      />
      <CustomSelect
        label="Style *"
        name="style_id"
        value={formData.style_id}
        onChange={handleInputChange}
        options={styles?.map((s) => ({ value: s.style_id, label: s.name })) || []}
        placeholder="Select"
        isOpen={openDropdown === "style"}
        onToggle={() => setOpenDropdown(openDropdown === "style" ? null : "style")}
        className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none"
      />
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Price *
        </label>
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none"
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
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none"
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
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none"
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
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none"
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
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none"
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
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none"
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
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none"
        />
      </div>
    </div>
  );
};

export default BasicDetailsSection;
