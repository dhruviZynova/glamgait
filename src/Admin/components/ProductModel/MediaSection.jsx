import React, { useState, useEffect, useRef } from "react";
import { PlusCircle, Trash2, X, ChevronDown } from "lucide-react";
import { ApiURL } from "../../../Variable";

const MediaSection = ({
  formData,
  setFormData,
  colorsList,
  existingMedia,
  setExistingMedia,
  setDeletedMediaIds
}) => {
  const [openColorIndex, setOpenColorIndex] = useState(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpenColorIndex(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="bg-gray-50 p-6 rounded-xl" ref={containerRef}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Colors & Media (Images + Videos)
      </h3>
      {formData.colors.map((color, i) => {
        const selectedColorIds = formData.colors
          .filter((_, idx) => idx !== i)
          .map((c) => parseFloat(c.color_id))
          .filter(Boolean);

        const availableColors = colorsList.filter(
          (c) => !selectedColorIds.includes(c.color_id),
        );

        return (
          <div key={i} className="bg-white p-4 rounded-lg border mb-4">
            <div className="flex gap-4 items-center">
              <div className="relative flex-1">
                <button
                  type="button"
                  onClick={() => setOpenColorIndex(openColorIndex === i ? null : i)}
                  className="flex items-center justify-between w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-900 bg-white cursor-pointer focus:outline-none"
                >
                  <span>
                    {colorsList.find(c => String(c.color_id) === String(color.color_id))?.color_name || "Select Color"}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-500 transition-transform duration-200 flex-shrink-0 ${openColorIndex === i ? "rotate-180 text-[#0f1115]" : ""
                      }`}
                  />
                </button>

                {openColorIndex === i && (
                  <div className="absolute left-0 w-full mt-1 bg-white rounded-lg shadow-xl border border-gray-200 overflow-y-auto max-h-60 z-[100] transform origin-top transition-all duration-200">
                    <button
                      type="button"
                      onClick={() => {
                        const updated = [...formData.colors];
                        updated[i].color_id = "";
                        setFormData({ ...formData, colors: updated });
                        setOpenColorIndex(null);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors cursor-pointer flex items-center justify-between ${!color.color_id
                        ? "bg-[#0f1115]/10 text-[#0f1115] font-semibold"
                        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                        }`}
                    >
                      <span>Select Color</span>
                      {!color.color_id && (
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
                    {availableColors.map((c) => {
                      const isSelected = String(c.color_id) === String(color.color_id);
                      return (
                        <button
                          key={c.color_id}
                          type="button"
                          onClick={() => {
                            const updated = [...formData.colors];
                            updated[i].color_id = c.color_id;
                            setFormData({ ...formData, colors: updated });
                            setOpenColorIndex(null);
                          }}
                          className={`w-full text-left px-4 py-2.5 text-sm transition-colors cursor-pointer flex items-center justify-between ${isSelected
                            ? "bg-[#0f1115]/10 text-[#0f1115] font-semibold"
                            : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                            }`}
                        >
                          <span>{c.color_name}</span>
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
              <label className="cursor-pointer bg-black hover:bg-gray-800 text-white px-4 py-2 rounded">
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
        );
      })}

      <button
        type="button"
        onClick={() =>
          setFormData((prev) => ({
            ...prev,
            colors: [...prev.colors, { color_id: "", images: [] }],
          }))
        }
        className="text-black flex items-center gap-2 cursor-pointer"
      >
        <PlusCircle /> Add Color
      </button>
    </div>
  );
};

export default MediaSection;
