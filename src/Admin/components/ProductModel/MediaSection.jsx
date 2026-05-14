import React from "react";
import { PlusCircle, Trash2, X } from "lucide-react";
import { ApiURL } from "../../../Variable";

const MediaSection = ({
  formData,
  setFormData,
  colorsList,
  existingMedia,
  setExistingMedia,
  setDeletedMediaIds
}) => {
  return (
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
            {/* Existing media */}
            {(existingMedia[i]?.images || []).map((img) => {
              const mediaUrl = `${ApiURL}/assets/Products/${img.image_url}`;
              const isVideo = /\.(mp4|webm|mov|avi|quicktime)$/i.test(
                img.image_url,
              );
              return (
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
                </div>
              );
            })}

            {/* New uploaded media */}
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
        className="text-blue-600 flex items-center gap-2 cursor-pointer"
      >
        <PlusCircle /> Add Color
      </button>
    </div>
  );
};

export default MediaSection;
