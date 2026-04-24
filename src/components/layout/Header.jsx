import { MdMenu, MdNotifications, MdPerson } from "react-icons/md";
import { useSelector, useDispatch } from "react-redux";
import { switchRole } from "../../store/slices/authSlice";

const Header = ({ onMenuClick, pageTitle }) => {
  const { currentUser } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  return (
    <header className="bg-white px-4 py-3 flex items-center justify-between sticky top-0 z-10"
      style={{ borderBottom: "1px solid #e5e7eb" }}>

      <div className="flex items-center gap-3">
        <button onClick={onMenuClick} className="lg:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-600">
          <MdMenu size={22} />
        </button>
        <h2 className="text-lg font-semibold text-gray-800">{pageTitle}</h2>
      </div>

      <div className="flex items-center gap-3">
        <select
          value={currentUser.role}
          onChange={(e) => dispatch(switchRole(e.target.value))}
          className="text-xs border rounded-lg px-2 py-1.5 focus:outline-none"
          style={{ borderColor: "#d1d5db", color: "#1E1E1E", backgroundColor: "#f9fafb" }}
        >
          <option value="Admin">Admin</option>
          <option value="HR Staff">HR Staff</option>
          <option value="Management">Management</option>
        </select>

        <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 relative">
          <MdNotifications size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full" style={{ backgroundColor: "#22c55e" }}></span>
        </button>

        <div className="flex items-center gap-2 rounded-lg px-3 py-1.5"
          style={{ backgroundColor: "#f9fafb", border: "1px solid #e5e7eb" }}>
          <div className="w-7 h-7 rounded-full flex items-center justify-center"
            style={{ backgroundColor: "#1E1E1E" }}>
            <MdPerson size={16} className="text-white" />
          </div>
          <div className="hidden sm:block">
            <p className="text-xs font-semibold text-gray-800">{currentUser.name}</p>
            <p className="text-xs" style={{ color: "#22c55e" }}>{currentUser.role}</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;