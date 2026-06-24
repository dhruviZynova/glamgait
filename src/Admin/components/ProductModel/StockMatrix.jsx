import React from "react";

const StockMatrix = ({
  formData,
  colorsList,
  sizesList,
  originalStock,
  stockAdjustments,
  handleAddChange,
  handleRemoveChange,
  hasSelectedSizes,
  originalColorQuantities,
  colorAdjustments,
  handleColorAddChange,
  handleColorRemoveChange
}) => {
  if (!formData.colors.some((c) => c.color_id)) return null;

  return (
    <div className="bg-gray-50 p-6 rounded-xl">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Stock Adjustment
      </h3>

      {hasSelectedSizes ? (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-400 px-6 py-4 text-left">
                  Size → Color ↓
                </th>
                <th className="border border-gray-400 px-6 py-4 text-center">
                  Current Stock
                </th>
                <th className="border border-gray-400 px-6 py-4 text-center">
                  Add Stock
                </th>
                <th className="border border-gray-400 px-6 py-4 text-center">
                  Remove Stock
                </th>
                <th className="border border-gray-400 px-6 py-4 text-center">
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
                                  e.target.value
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
                                  e.target.value
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
        <div className="overflow-x-auto w-full max-w-full">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-3 text-left font-bold text-gray-800 text-sm whitespace-nowrap">
                  Color
                </th>
                <th className="border border-gray-300 px-4 py-3 text-center font-bold text-gray-800 text-sm whitespace-nowrap">
                  Current Stock
                </th>
                <th className="border border-gray-300 px-4 py-3 text-center font-bold text-gray-800 text-sm whitespace-nowrap">
                  Add Stock
                </th>
                <th className="border border-gray-300 px-4 py-3 text-center font-bold text-gray-800 text-sm whitespace-nowrap">
                  Remove Stock
                </th>
                <th className="border border-gray-300 px-4 py-3 text-center font-bold text-gray-800 text-sm whitespace-nowrap">
                  New Total
                </th>
              </tr>
            </thead>
            <tbody>
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
                    <tr key={color.color_id} className="bg-white">
                      <td className="border border-gray-300 px-4 py-3 text-left text-sm font-medium whitespace-nowrap capitalize">
                        {colorName}
                      </td>
                      <td className="border border-gray-300 px-4 py-3 text-center text-sm font-bold whitespace-nowrap">
                        {currentStock}
                      </td>
                      <td className="border border-gray-300 p-2 text-center whitespace-nowrap">
                        <input
                          type="number"
                          min="0"
                          placeholder="Add"
                          className="w-20 px-2 py-1 border rounded text-center text-sm"
                          value={adjustment.add || 0}
                          onChange={(e) =>
                            handleColorAddChange(
                              color.color_id,
                              e.target.value
                            )
                          }
                        />
                      </td>
                      <td className="border border-gray-300 p-2 text-center whitespace-nowrap">
                        <input
                          type="number"
                          min="0"
                          max={currentStock + adjustment.add}
                          placeholder="Remove"
                          className="w-20 px-2 py-1 border rounded text-center text-sm"
                          value={adjustment.remove || 0}
                          onChange={(e) =>
                            handleColorRemoveChange(
                              color.color_id,
                              e.target.value
                            )
                          }
                        />
                      </td>
                      <td className="border border-gray-300 px-4 py-3 text-center text-sm font-bold text-gray-700 whitespace-nowrap">
                        {newTotal}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>

          <p className="text-sm text-gray-700 mt-4">
            Enter amounts to add or remove. Remove cannot exceed current
            + added stock.
          </p>
        </div>
      )}
    </div>
  );
};

export default StockMatrix;
