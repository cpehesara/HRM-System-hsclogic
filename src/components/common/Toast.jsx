import { useEffect } from "react";
import { MdCheckCircle, MdError, MdInfo, MdClose } from "react-icons/md";

const icons = {
  success: <MdCheckCircle size={20} className="text-green-500" />,
  error: <MdError size={20} className="text-red-500" />,
  info: <MdInfo size={20} className="text-blue-500" />,
};

const barColors = {
  success: "bg-green-500",
  error: "bg-red-500",
  info: "bg-blue-500",
};

export const Toast = ({ toasts, removeToast }) => {
  return (
    <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-3 pointer-events-none">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onClose={() => removeToast(t.id)} />
      ))}
    </div>
  );
};

const ToastItem = ({ toast, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3500);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="pointer-events-auto bg-white rounded-xl shadow-lg border border-gray-100 w-80 overflow-hidden animate-slide-in">
      <div className="flex items-start gap-3 px-4 py-3">
        <div className="shrink-0 mt-0.5">{icons[toast.type] || icons.info}</div>
        <div className="flex-1 min-w-0">
          {toast.title && (
            <p className="text-sm font-semibold text-gray-800">{toast.title}</p>
          )}
          <p className="text-xs text-gray-500 mt-0.5">{toast.message}</p>
        </div>
        <button
          onClick={onClose}
          className="shrink-0 text-gray-400 hover:text-gray-600 mt-0.5"
        >
          <MdClose size={16} />
        </button>
      </div>
      <div className={`h-1 ${barColors[toast.type] || barColors.info} animate-shrink`} />
    </div>
  );
};

export default Toast;
