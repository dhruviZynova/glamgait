import { useEffect, useRef, useState } from "react";
import { Button } from "reactstrap";
import { adminAxios } from "../../Axios/axios";
import { useForm } from "react-hook-form";
import { Pencil, PlusCircle, Trash2 } from "lucide-react";
import { ApiURL, showToaster } from "../../Variable";
import ConfirmDeleteModal from "./ConfirmDeleteModal";

const Sliders = () => {
  const { reset } = useForm();
  const fileInputRef = useRef();

  const [sliderList, setSliderList] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [addLoading, setAddLoading] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [editingImage, setEditingImage] = useState(null);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    image_id: null,
    image_name: "",
  });

  // Handle file selection
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files).filter((file) =>
      file.type.startsWith("image/")
    );

    setSelectedImages((prev) => {
      if (prev.length + files.length > 3 && !editingImage) {
        showToaster(0, "You can only upload up to 3 images.");
        return prev;
      }
      return editingImage ? files.slice(0, 1) : [...prev, ...files];
    });
  };

  const handleRemoveImage = (index) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddImages = () => {
    reset();
    setEditingImage(null);
    setSelectedImages([]);
    setModalOpen(true);
  };

  // Add or Update
  const saveSliderImages = async () => {
    if (selectedImages.length === 0) {
      showToaster(0, "Please select an image first.");
      return;
    }

    setAddLoading(true);
    const formData = new FormData();

    if (editingImage) {
      // For update: send image_id + file
      formData.append("image_id", editingImage.image_id);
      formData.append("sliderImage", selectedImages[0]);
    } else {
      // For add: send multiple files
      selectedImages.forEach((img) => formData.append("sliderImage", img));
    }

    try {
      let response;
      if (editingImage) {
        response = await adminAxios.put(`${ApiURL}/updateslider`, formData);
      } else {
        response = await adminAxios.post(`${ApiURL}/addslider`, formData);
      }

      showToaster(response?.data?.status, response?.data?.description);

      if (response?.data?.status === 1) {
        setModalOpen(false);
        setSelectedImages([]);
        setEditingImage(null);
        fileInputRef.current.value = "";
        getSlidersFunction(); // refresh list
      }
    } catch (error) {
      console.error(error);
    } finally {
      setAddLoading(false);
    }
  };

  const deleteSliderFunction = async () => {
    try {
      const response = await adminAxios.delete(
        `${ApiURL}/deleteslider/${deleteModal.image_id}`
      );
      showToaster(response?.data?.status, response?.data?.description);
      if (response?.data?.status === 1) {
        setSliderList((prev) =>
          prev.filter((img) => img.image_id !== deleteModal.image_id)
        );
        getSlidersFunction();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setDeleteModal({ isOpen: false, image_id: null, image_name: "" });
    }
  };

  // Fetch Sliders
  const getSlidersFunction = async () => {
    try {
      const response = await adminAxios.get("/getsliders");
      if (response?.data?.status === 1) {
        setSliderList(response?.data?.data);
      } else {
        setSliderList([]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditImage = (img) => {
    setEditingImage(img);
    setSelectedImages([]);
    setModalOpen(true);
  };

  useEffect(() => {
    getSlidersFunction();
  }, []);

  return (
    <>
      <div className="min-h-screen text-gray-800 pb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-6 sm:items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 text-left">Images</h2>
          <div className="md:flex justify-items-center w-full sm:w-auto space-y-2 md:space-y-0 gap-2">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className=" text-black placeholder-gray-400 border border-gray-600 focus:outline-none p-2 rounded-md w-full "
            />
            <Button
              onClick={handleAddImages}
              className="flex w-full items-center justify-center gap-2 bg-black hover:bg-black text-white px-4 py-2 rounded-lg cursor-pointer"
            >
              <PlusCircle size={20} /> Add Images
            </Button>
          </div>
        </div>

        <div className="">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">
            Slider Images
          </h3>

          {sliderList?.length === 0 ? (
            <p className="text-gray-500">No slider images available.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-2 gap-4">
              {sliderList
                ?.filter((img) =>
                  img?.image
                    ?.toLowerCase()
                    .includes(searchQuery.toLowerCase())
                )
                ?.map((img) => (
                  <div
                    key={img.image_id}
                    className="relative border rounded overflow-hidden group"
                  >
                    <div className="w-full aspect-[16/9] bg-gray-200">
                      <img
                        src={img?.image}
                        alt={img?.image}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {/* Action Buttons */}
                    <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition">
                      <button
                        onClick={() => handleEditImage(img)}
                        className="bg-blue-500 text-white p-1 rounded cursor-pointer"
                        aria-label={`Edit image ${img.image_id}`}
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() =>
                          setDeleteModal({
                            isOpen: true,
                            image_id: img.image_id,
                            image_name: img.image,
                          })
                        }
                        className="bg-red-500 text-white p-1 rounded cursor-pointer"
                        aria-label={`Delete slider ${img.image}`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 bg-black/30 bg-opacity-50 flex justify-center items-center text-black p-4 z-50"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="bg-white rounded-lg p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {editingImage ? "Update Slider Image" : "Add Dynamic Slider Images"}
            </h2>

            <div className="pt-2">
              <input
                multiple={!editingImage}
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="w-full p-2 rounded bg-white border border-black text-black"
              />

              {selectedImages?.length > 0 && (
                <div className="flex gap-2 flex-wrap mt-2">
                  {selectedImages?.map((img, index) => (
                    <div
                      key={index}
                      className="relative w-20 aspect-[16/9] bg-gray-200"
                    >
                      <img
                        src={URL.createObjectURL(img)}
                        alt={`Selected ${index}`}
                        className="w-full h-full object-cover rounded"
                      />
                      <Button
                        type="button"
                        className="absolute top-0 right-0 bg-red-500 text-white text-xs p-1 rounded-full"
                        onClick={() => handleRemoveImage(index)}
                        aria-label={`Remove preview image ${index + 1}`}
                      >
                        ✕
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-4 mt-4">
              <Button
                onClick={() => setModalOpen(false)}
                className="bg-gray-200 px-8 py-2  text-gray-700 rounded hover:bg-gray-300 transition-all duration-200 shadow-sm text-sm font-medium"
                aria-label="Cancel"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={addLoading}
                className="px-4 py-2 bg-black text-white rounded-lg hover:bg-black"
                onClick={saveSliderImages}
                aria-label={
                  editingImage ? "Update slider image" : "Add slider images"
                }
              >
                {editingImage ? "Update" : "Add"}
              </Button>
            </div>
          </div>
        </div>
      )}
      <ConfirmDeleteModal
        isOpen={deleteModal.isOpen}
        onClose={() =>
          setDeleteModal({ isOpen: false, image_id: null, image_name: "" })
        }
        onConfirm={deleteSliderFunction}
        itemType="slider image"
        itemName={deleteModal.image_name}
      />
    </>
  );
};

export default Sliders;
