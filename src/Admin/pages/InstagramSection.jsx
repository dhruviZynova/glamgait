/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import axiosInstance, { adminAxios } from "../../Axios/axios";
import { Upload, Trash2, Loader2 } from "lucide-react";
import { ApiURL, showToaster, adminInfo } from "../../Variable";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import toast, { Toaster } from "react-hot-toast";

const InstagramSection = () => {
  const adminData = adminInfo();
  const [error, setError] = useState("");
  const [file, setFile] = useState(null);
  const [media, setMedia] = useState([]);
  const [success, setSuccess] = useState("");
  const [instaLink, setInstaLink] = useState("");
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    insta_id: null,
    image_name: "",
  });

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setError("");
    setSuccess("");

    if (selectedFile) {
      if (
        selectedFile.type.startsWith("image/") ||
        selectedFile.type.startsWith("video/")
      ) {
        const url = URL.createObjectURL(selectedFile);
        setPreviewUrl(url);
      } else {
        setError("Please select an image or video file");
        setFile(null);
        setPreviewUrl(null);
      }
    } else {
      setPreviewUrl(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select an image or video to upload");
      return;
    }
    if (!instaLink) {
      setError("Please add an Instagram link");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("instaImage", file);
    formData.append("insta_link", instaLink);

    try {
      const response = await adminAxios.post(
        `${ApiURL}/addinstaimage`,
        formData
      );
      if (response?.data?.status) {
        setFile(null);
        setPreviewUrl(null);
        setInstaLink("");
        fetchImages();
        setError("");
        setSuccess("Media uploaded successfully");
        showToaster(response?.data?.status, response?.data?.description);
      } else {
        setError("Failed to upload file");
        showToaster(
          false,
          response?.data?.description || "Failed to upload file"
        );
      }
    } catch (err) {
      setError("Failed to upload file");
      showToaster(false, "Failed to upload file");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = (insta_id, image_name) => {
    setDeleteModal({ isOpen: true, insta_id, image_name });
  };

  const confirmDelete = async () => {
    try {
      const response = await adminAxios.delete(
        `${ApiURL}/deleteinstaimage/${deleteModal.insta_id}`
      );
      if (response?.data?.status) {
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
      setDeleteModal({ isOpen: false, insta_id: null, image_name: "" });
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
    }
  };

  useEffect(() => {
    fetchImages();
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  return (
    <div className="pb-8 min-h-screen ">
      <Toaster />
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Manage Instagram Section
      </h1>

      <>
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md border border-gray-200 mb-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Upload Media
              </label>
              <input
                type="file"
                accept="image/*,video/*"
                onChange={handleFileChange}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-black focus:border-black outline-none transition-all duration-300"
                aria-label="Upload image or video"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Instagram Link
              </label>
              <input
                type="text"
                value={instaLink}
                onChange={(e) => setInstaLink(e.target.value)}
                placeholder="Enter Instagram Link (e.g., https://instagram.com/p/xyz)"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-black focus:border-black outline-none transition-all duration-300"
                aria-label="Instagram link"
              />
            </div>
            <button
              onClick={handleUpload}
              disabled={isUploading}
              className={`flex items-center gap-2 px-5 py-2.5 bg-black text-white rounded-xl hover:bg-black transition-all duration-200 shadow-sm text-sm font-medium ${isUploading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              aria-label="Upload media"
            >
              {isUploading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Upload className="w-5 h-5" />
              )}
              {isUploading ? "Uploading..." : "Upload Media"}
            </button>
            {error && (
              <p className="text-red-500 text-sm mt-2" role="alert">
                {error}
              </p>
            )}
            {success && (
              <p className="text-green-500 text-sm mt-2" role="status">
                {success}
              </p>
            )}
          </div>
        </div>

        {previewUrl && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Preview
            </h2>
            <div className="bg-white p-4 rounded-xl shadow-md border border-gray-200">
              <div className="w-full max-w-xs aspect-[9/16] bg-gray-200 rounded-lg overflow-hidden">
                {file?.type.startsWith("image/") ? (
                  <img
                    src={previewUrl}
                    alt="Media preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://placehold.co/180x320?text=Preview+Failed";
                    }}
                  />
                ) : (
                  <video
                    src={previewUrl}
                    controls
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.poster =
                        "https://placehold.co/180x320?text=Preview+Failed";
                    }}
                  />
                )}
              </div>
              {instaLink && (
                <p className="mt-2 text-sm text-gray-700">
                  Instagram Link:{" "}
                  <a
                    href={instaLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-black underline hover:text-black"
                    aria-label="View Instagram link"
                  >
                    {instaLink.length > 50
                      ? `${instaLink.slice(0, 50)}...`
                      : instaLink}
                  </a>
                </p>
              )}
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto">
          {media?.length === 0 ? (
            <p className="text-gray-500 text-center col-span-full">
              No Instagram media available.
            </p>
          ) : (
            media?.map((item) => (
              <div
                key={item?.insta_id}
                className="bg-white border border-gray-200 rounded-xl shadow-md overflow-hidden group transform transition-all duration-300 hover:scale-105 animate-fade-in"
              >
                <div className="w-full aspect-[9/14] bg-gray-200">
                  {item?.image_url.endsWith(".mp4") ||
                    item?.image_url.endsWith(".webm") ||
                    item?.image_url.endsWith(".ogg") ? (
                    <video
                      src={`${item?.image_url}`}
                      controls
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.poster =
                          "https://placehold.co/180x320?text=Media+Failed";
                      }}
                      aria-label={`Instagram video ${item.insta_id}`}
                    />
                  ) : (
                    <img
                      src={`${item?.image_url}`}
                      alt={`Instagram media ${item.insta_id}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "https://placehold.co/180x320?text=Media+Failed";
                      }}
                    />
                  )}
                </div>
                <div className="p-3 flex justify-between items-center bg-gray-50">
                  {item?.insta_link && (
                    <a
                      href={item?.insta_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-black text-sm font-medium hover:underline truncate"
                      aria-label="View on Instagram"
                    >
                      {item.insta_link.length > 30
                        ? `${item.insta_link.slice(0, 30)}...`
                        : item.insta_link}
                    </a>
                  )}
                  <button
                    onClick={() =>
                      handleDelete(item?.insta_id, item?.image_url)
                    }
                    className="flex items-center gap-1 text-red-500 text-sm font-medium hover:text-red-600 transition-colors duration-200"
                    aria-label={`Delete Instagram media ${item.insta_id}`}
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}

          <ConfirmDeleteModal
            isOpen={deleteModal.isOpen}
            onClose={() =>
              setDeleteModal({ isOpen: false, insta_id: null, image_name: "" })
            }
            onConfirm={confirmDelete}
            itemType="Instagram post"
            itemName={deleteModal.image_name}
          />
        </div>
      </>
    </div>
  );
};

export default InstagramSection;
