import { useEffect } from "react";
import { MdClose } from "react-icons/md";

const sizes = {
  sm: "sm:max-w-md",
  md: "sm:max-w-xl",
  lg: "sm:max-w-2xl",
  xl: "sm:max-w-4xl",
};

const Modal = ({ isOpen, onClose, title, children, size = "md" }) => {
  /* Lock body scroll while open */
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [isOpen]);

  /* Close on Escape key */
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />

      {/*
        On mobile: full-width bottom sheet that slides up.
        On sm+:    centred dialog with max-width cap.
      */}
      <div
        className={`
          relative bg-white w-full z-10
          rounded-t-2xl sm:rounded-xl
          shadow-xl
          animate-sheet-up sm:animate-none
          max-h-[92dvh] sm:max-h-[90vh]
          flex flex-col
          ${sizes[size]}
        `}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
          {/* Drag handle — visual cue on mobile */}
          <div className="sm:hidden absolute top-2.5 left-1/2 -translate-x-1/2 w-10 h-1 bg-gray-300 rounded-full" />
          <h3
            id="modal-title"
            className="text-base sm:text-lg font-semibold text-gray-800 truncate pr-4"
          >
            {title}
          </h3>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 shrink-0 tap-target flex items-center justify-center"
            aria-label="Close dialog"
          >
            <MdClose size={20} />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto overscroll-contain px-5 py-5 pb-safe">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
