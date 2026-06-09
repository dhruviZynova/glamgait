import { useEffect, useRef } from "react";
import { Trash2, X } from "lucide-react";

const ConfirmDeleteModal = ({
  isOpen,
  onClose,
  onConfirm,
  itemType,
  itemName,
}) => {
  const modalRef = useRef(null);
  const cancelButtonRef = useRef(null);

  // Handle Escape key to close modal
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape" && isOpen) {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // Focus on cancel button when modal opens
  useEffect(() => {
    if (isOpen && cancelButtonRef.current) {
      cancelButtonRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50"
      onClick={onClose}
      role="dialog"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <div
        className="bg-white rounded-xl shadow-md p-6 w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
        ref={modalRef}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 id="modal-title" className="text-xl font-bold text-gray-800">
            Confirm Delete
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors duration-200 cursor-pointer"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <p id="modal-description" className="text-sm text-gray-600 mb-6">
          Are you sure you want to delete this {itemType}{" "}
          {itemName ? (
            <span className="font-semibold">&quot;{itemName}&quot;</span>
          ) : (
            ""
          )}
          ? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <button
            ref={cancelButtonRef}
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all duration-200 shadow-sm text-sm font-medium cursor-pointer"
            aria-label="Cancel deletion"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all duration-200 shadow-sm text-sm font-medium cursor-pointer"
            aria-label={`Confirm delete ${itemType}`}
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
