import React from "react";

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
  return (
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
    </div>
  );
};

export default BasicDetailsSection;
