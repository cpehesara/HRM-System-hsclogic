import { createContext, useContext, useState, useCallback } from "react";
import { Toast } from "../components/common/Toast";

const ToastContext = createContext(null);

let _id = 0;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "info", title = "") => {
    const id = ++_id;
    setToasts((prev) => [...prev, { id, message, type, title }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = {
    success: (message, title = "Success") => addToast(message, "success", title),
    error: (message, title = "Error") => addToast(message, "error", title),
    info: (message, title = "") => addToast(message, "info", title),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <Toast toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
