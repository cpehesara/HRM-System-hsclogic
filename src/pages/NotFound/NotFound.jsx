import { useNavigate } from "react-router-dom";
import { MdHome, MdErrorOutline } from "react-icons/md";

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center px-6">
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center">
            <MdErrorOutline size={48} className="text-gray-400" />
          </div>
        </div>
        <h1 className="text-6xl font-bold text-gray-800 mb-2">404</h1>
        <h2 className="text-xl font-semibold text-gray-600 mb-3">Page Not Found</h2>
        <p className="text-sm text-gray-400 mb-8 max-w-sm mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <button
          onClick={() => navigate("/")}
          className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white rounded-lg transition"
          style={{ backgroundColor: "#22c55e" }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = "#16a34a"}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = "#22c55e"}
        >
          <MdHome size={18} />
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default NotFound;
