/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { adminAxios } from "../../Axios/axios";
import { Upload, Trash2, Loader2, Link2, Image, Plus, Pencil } from "lucide-react";
import { ApiURL, showToaster, getFullImageUrl } from "../../Variable";
import ConfirmDeleteModal from "./ConfirmDeleteModal";

const SocialMedia = () => {
  const [error, setError] = useState("");
  const [file, setFile] = useState(null);
  const [media, setMedia] = useState(null);
  const [success, setSuccess] = useState("");
  const [instaLink, setInstaLink] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    insta_id: null,
    image_name: "",
    isDeleting: false,
  });

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setError("");
    setSuccess("");

    if (selectedFile) {
      if (!selectedFile.type.startsWith("image/")) {
        setError("Please select an image file");
        showToaster(false, "Please select an image file");
        setFile(null);
        setMediaPreview(null);
      } else {
        setMediaPreview(URL.createObjectURL(selectedFile));
      }
    } else {
      setMediaPreview(null);
    }
  };

  const handleUpload = async () => {
    if (!file && !isEdit) {
      setError("Please select an image to upload");
      showToaster(false, "Please select an image to upload");
      return;
    }
    const trimmedLink = instaLink.trim();
    if (!trimmedLink) {
      setError("Please add a link");
      showToaster(false, "Please add a link");
      return;
    }

    const urlRegex = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/.*)?$/;
    if (!urlRegex.test(trimmedLink)) {
      setError("Please enter a valid Link (e.g., https://example.com)");
      showToaster(false, "Please enter a valid Link (e.g., https://example.com)");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    if (file) {
      formData.append("instaImage", file);
    }
    formData.append("insta_link", trimmedLink);
    if (isEdit) {
      formData.append("insta_id", editId);
    }

    try {
      let response;
      if (isEdit) {
        response = await adminAxios.put(
          `${ApiURL}/updateinstaimage`,
          formData
        );
      } else {
        response = await adminAxios.post(
          `${ApiURL}/addinstaimage`,
          formData
        );
      }
      if (response?.data?.status) {
        setFile(null);
        setMediaPreview(null);
        setInstaLink("");
        fetchImages();
        setError("");
        setSuccess(isEdit ? "Media updated successfully." : "Media uploaded successfully.");
        showToaster(1, isEdit ? "Media updated successfully." : "Media uploaded successfully.");
        setModalOpen(false);
        setIsEdit(false);
        setEditId(null);
      } else {
        setError(isEdit ? "Failed to update media" : "Failed to upload file");
        showToaster(
          false,
          response?.data?.description || (isEdit ? "Failed to update media" : "Failed to upload file")
        );
      }
    } catch (err) {
      setError(isEdit ? "Failed to update media" : "Failed to upload file");
      showToaster(false, isEdit ? "Failed to update media" : "Failed to upload file");
    } finally {
      setIsUploading(false);
    }
  };

  const handleEdit = (item) => {
    setIsEdit(true);
    setEditId(item.insta_id);
    setInstaLink(item.insta_link || "");
    setFile(null);
    if (item?.image_url) {
      setMediaPreview(getFullImageUrl(item?.image_url, "Instagram"));
    } else {
      setMediaPreview(null);
    }
    setError("");
    setSuccess("");
    setModalOpen(true);
  };

  const handleDelete = (insta_id, image_url) => {
    const filename = image_url ? image_url.substring(image_url.lastIndexOf('/') + 1) : "";
    setDeleteModal({ isOpen: true, insta_id, image_name: filename, isDeleting: false });
  };

  const confirmDelete = async () => {
    setDeleteModal((prev) => ({ ...prev, isDeleting: true }));
    try {
      const response = await adminAxios.delete(
        `${ApiURL}/deleteinstaimage/${deleteModal.insta_id}`
      );
      if (response?.data?.status) {
        setMedia((prevMedia) =>
          prevMedia.filter((item) => item.insta_id !== deleteModal.insta_id)
        );
        fetchImages();
        setError("");
        setSuccess("Media deleted successfully");
        showToaster(response?.data?.status, response?.data?.description);
      } else {
        setError("Failed to delete media");
        showToaster(
          false,
          response?.data?.description || "Failed to delete media"
        );
      }
    } catch (err) {
      setError("Failed to delete media");
      showToaster(false, "Failed to delete media");
    } finally {
      setDeleteModal({ isOpen: false, insta_id: null, image_name: "", isDeleting: false });
    }
  };

  const fetchImages = async () => {
    try {
      const response = await adminAxios.get(`${ApiURL}/getinstaimages`);
      if (response?.data?.status) {
        setMedia(response.data.data);
      } else {
        setMedia([]);
      }
    } catch (err) {
      setError("Error fetching images");
      setMedia([]);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  return (
    <div className="pb-8 min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-6 sm:items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Manage Social Media Section
        </h1>
        <button
          onClick={() => {
            setIsEdit(false);
            setEditId(null);
            setFile(null);
            setMediaPreview(null);
            setInstaLink("");
            setError("");
            setSuccess("");
            setModalOpen(true);
          }}
          className="flex items-center justify-center gap-2 bg-black text-white px-4 py-2 rounded-lg transition-colors cursor-pointer text-sm font-medium"
        >
          <Plus size={18} /> Add Media
        </button>
      </div>

      <div className="mb-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {media === null ? (
            <div className="glamloader-overlay" aria-label="Loading" role="status">
              <div className="glamloader-logo">
                KUNDRAT
                <div className="glamloader-logo-fill">KUNDRAT</div>
              </div>
              <div className="glamloader-ring">
                <svg viewBox="0 0 72 72">
                  <circle className="glamloader-ring-track" cx="36" cy="36" r="32" />
                  <circle className="glamloader-ring-arc glamloader-ring-arc--a2" cx="36" cy="36" r="32" />
                  <circle className="glamloader-ring-arc glamloader-ring-arc--a1" cx="36" cy="36" r="32" />
                </svg>
                <div className="glamloader-ring-dot" />
              </div>
            </div>
          ) : media?.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
              <div className="w-16 h-16 rounded-2xl bg-gray-100 border border-gray-200 flex items-center justify-center mb-4 shadow-sm">
                <Image className="w-7 h-7 text-gray-400" />
              </div>
              <p className="text-sm font-semibold text-gray-700 mb-1">No Instagram media uploaded yet.</p>
              <p className="text-xs text-gray-400">Upload your first Instagram media above</p>
            </div>
          ) : (
            media?.map((item) => {
              const fileUrl = getFullImageUrl(item?.image_url, "Instagram");
              const isVideo = fileUrl?.endsWith(".mp4") ||
                fileUrl?.endsWith(".webm") ||
                fileUrl?.endsWith(".ogg") ||
                item?.image_url?.endsWith(".mp4") ||
                item?.image_url?.endsWith(".webm") ||
                item?.image_url?.endsWith(".ogg");

              return (
                <div
                  key={item?.insta_id}
                  className="bg-white border border-gray-200 rounded-xl overflow-hidden transition-all duration-300 flex flex-col"
                >
                  <div className="w-full aspect-square bg-gray-100 relative overflow-hidden">
                    {isVideo ? (
                      <video
                        src={fileUrl}
                        controls
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.poster =
                            "https://placehold.co/180x180?text=Media+Failed";
                        }}
                        aria-label={`Instagram video ${item.insta_id}`}
                      />
                    ) : (
                      <img
                        src={fileUrl}
                        alt={`Instagram media ${item.insta_id}`}
                        className="w-full h-full object-cover transition-transform duration-500"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src =
                            "https://placehold.co/180x180?text=Media+Failed";
                        }}
                      />
                    )}
                  </div>
                  <div className="flex flex-col gap-2 p-2 bg-white border-t border-gray-100 min-w-0">
                    {item?.insta_link ? (
                      <>
                        <a
                          href={item?.insta_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-600 hover:text-gray-700 text-xs font-semibold truncate flex items-center gap-1 min-w-0 flex-1"
                          aria-label="View link"
                        >
                          <Link2 className="w-3.5 h-3.5 flex-shrink-0" />
                          <span className="truncate">{item?.insta_link}</span>
                        </a>
                        <div className="flex items-center justify-end gap-1 flex-shrink-0">
                          <button
                            onClick={() => handleEdit(item)}
                            className="text-gray-500 hover:text-gray-700 p-1.5 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                            aria-label={`Edit Instagram media ${item.insta_id}`}
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() =>
                              handleDelete(item?.insta_id, item?.image_url)
                            }
                            className="text-red-500 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                            aria-label={`Delete Instagram media ${item.insta_id}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </>
                    ) : (
                      <span className="text-gray-400 text-xs italic flex-1">No Link</span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Upload Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center text-black p-4 z-50"
          onClick={() => {
            setModalOpen(false);
            setIsEdit(false);
            setEditId(null);
          }}
        >
          <div
            className="bg-white rounded-lg p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {isEdit ? "Edit Social Media" : "Add Social Media"}
            </h2>

            <div className="space-y-4 pt-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Upload Image {isEdit && "(Optional)"}
                </label>
                <input
                  key={file ? "loaded" : "empty"}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl bg-white focus:outline-none text-sm file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 file:cursor-pointer"
                  aria-label="Upload image"
                />
                {mediaPreview && (
                  <div className="mt-3 flex justify-start">
                    <img
                      src={mediaPreview}
                      alt="Image Preview"
                      className="w-28 h-28 object-cover rounded-lg border border-gray-200"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Social Link
                </label>
                <input
                  type="text"
                  value={instaLink}
                  onChange={(e) => setInstaLink(e.target.value)}
                  placeholder="Enter Link"
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl bg-white focus:outline-none text-sm"
                  aria-label="Link"
                />
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => {
                  setModalOpen(false);
                  setIsEdit(false);
                  setEditId(null);
                }}
                className="bg-gray-200 px-6 py-2 text-gray-700 rounded hover:bg-gray-300 transition-all duration-200 shadow-sm text-sm font-medium cursor-pointer"
                aria-label="Cancel"
              >
                Cancel
              </button>
              <button
                disabled={isUploading}
                onClick={handleUpload}
                className="flex items-center justify-center gap-2 px-6 py-2 bg-black text-white rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer text-sm font-medium disabled:opacity-50"
                aria-label={isEdit ? "Update media" : "Upload media"}
              >
                {isUploading && <Loader2 className="w-4 h-4 animate-spin" />}
                {isEdit ? "Update" : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDeleteModal
        isOpen={deleteModal.isOpen}
        onClose={() =>
          setDeleteModal({ isOpen: false, insta_id: null, image_name: "", isDeleting: false })
        }
        onConfirm={confirmDelete}
        itemType="media item"
        itemName=""
        isDeleting={deleteModal.isDeleting}
      />
    </div>
  );
};

export default SocialMedia;
