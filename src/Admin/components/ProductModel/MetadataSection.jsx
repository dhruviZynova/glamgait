import React from "react";

const MetadataSection = ({
  formData,
  handleInputChange
}) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        <div>
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
    </div>
  );
};

export default MetadataSection;
