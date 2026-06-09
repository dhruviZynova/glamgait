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
                            e.target.value
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
                            e.target.value
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
  );
};

export default StockMatrix;
