import { useEffect } from "react";
import { MdCheckCircle, MdError, MdInfo, MdClose } from "react-icons/md";

const icons = {
  success: <MdCheckCircle size={20} className="text-green-500" />,
  error:   <MdError       size={20} className="text-red-500"   />,
  info:    <MdInfo        size={20} className="text-blue-500"  />,
};

const barColors = {
  success: "bg-green-500",
  error:   "bg-red-500",
  info:    "bg-blue-500",
};

export const Toast = ({ toasts, removeToast }) => (
  /*
    Desktop: stacked in bottom-right corner, fixed width.
    Mobile:  full-width strip above the bottom nav bar (+ safe-area).
  */
  <div className="fixed z-9999 flex flex-col gap-2 pointer-events-none
                  bottom-[calc(4rem+env(safe-area-inset-bottom,0))] left-2 right-2
                  sm:bottom-5 sm:left-auto sm:right-5 sm:w-80">
    {toasts.map((t) => (
      <ToastItem key={t.id} toast={t} onClose={() => removeToast(t.id)} />
    ))}
  </div>
);

const ToastItem = ({ toast, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3500);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="pointer-events-auto bg-white rounded-xl shadow-lg border border-gray-100
                    overflow-hidden animate-slide-in-up sm:animate-slide-in">
      <div className="flex items-start gap-3 px-4 py-3">
        <div className="shrink-0 mt-0.5">{icons[toast.type] ?? icons.info}</div>
        <div className="flex-1 min-w-0">
          {toast.title && (
            <p className="text-sm font-semibold text-gray-800 leading-tight">{toast.title}</p>
          )}
          <p className="text-xs text-gray-500 mt-0.5 leading-snug">{toast.message}</p>
        </div>
        <button
          onClick={onClose}
          className="shrink-0 text-gray-400 hover:text-gray-600 mt-0.5 tap-target flex items-center justify-center"
          aria-label="Dismiss notification"
        >
          <MdClose size={16} />
        </button>
      </div>
      <div className={`h-1 ${barColors[toast.type] ?? barColors.info} animate-shrink`} />
    </div>
  );
};

export default Toast;
