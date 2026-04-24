import { NavLink } from "react-router-dom";
import { MdDashboard, MdPeople, MdWork, MdAccessTime, MdClose } from "react-icons/md";

const navItems = [
  { path: "/", label: "Dashboard", icon: <MdDashboard size={20} /> },
  { path: "/employees", label: "Employees", icon: <MdPeople size={20} /> },
  { path: "/recruitment", label: "Recruitment", icon: <MdWork size={20} /> },
  { path: "/attendance", label: "Attendance", icon: <MdAccessTime size={20} /> },
];

const Sidebar = ({ isOpen, onClose }) => {
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-20 lg:hidden" onClick={onClose} />
      )}
      <aside
        className={`fixed top-0 left-0 h-full w-64 z-30 transform transition-transform duration-300
          text-white flex flex-col
          ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static lg:z-auto`}
        style={{ backgroundColor: "#1E1E1E" }}
      >
        {/* Logo Area */}
        <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <div className="flex items-center gap-3">
            {/* HSClogic green circle logo mark */}
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm"
              style={{ backgroundColor: "#22c55e", boxShadow: "0 0 12px rgba(34,197,94,0.4)" }}>
              HS
            </div>
            <div>
              <h1 className="text-base font-bold text-white leading-tight">HSClogic</h1>
              <p className="text-xs" style={{ color: "#9ca3af" }}>HR Management System</p>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden" style={{ color: "#9ca3af" }}>
            <MdClose size={22} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-4 px-3 flex-1">
          <p className="text-xs font-semibold px-4 mb-2 uppercase tracking-widest" style={{ color: "#6b7280" }}>
            Main Menu
          </p>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg mb-1 text-sm font-medium transition-all duration-200
                ${isActive ? "text-white" : "text-gray-400 hover:text-white"}`
              }
              style={({ isActive }) => isActive
                ? { backgroundColor: "#22c55e", color: "#fff" }
                : {}
              }
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Bottom */}
        <div className="px-6 py-4" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <p className="text-xs" style={{ color: "#6b7280" }}>© 2026 HSClogic Pvt. Ltd.</p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;