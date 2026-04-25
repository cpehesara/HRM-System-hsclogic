import { NavLink } from "react-router-dom";
import {
  MdDashboard, MdPeople, MdWork, MdAccessTime, MdClose,
} from "react-icons/md";

const navItems = [
  { path: "/",            label: "Dashboard",             icon: MdDashboard  },
  { path: "/employees",   label: "Employee Management",   icon: MdPeople     },
  { path: "/recruitment", label: "Recruitment",           icon: MdWork       },
  { path: "/attendance",  label: "Attendance",            icon: MdAccessTime },
];

const Sidebar = ({ isOpen, onClose }) => (
  <>
    {/* Mobile overlay */}
    {isOpen && (
      <div
        className="fixed inset-0 bg-black/50 z-20 lg:hidden"
        onClick={onClose}
        aria-hidden="true"
      />
    )}

    <aside
      className={`
        fixed top-0 left-0 h-full w-64 z-30 flex flex-col
        transform transition-transform duration-300 ease-in-out
        lg:static lg:translate-x-0 lg:z-auto lg:shrink-0
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      style={{ backgroundColor: "#1E1E1E" }}
      aria-label="Main navigation"
    >
      {/* Brand */}
      <div
        className="flex items-center justify-between px-5 py-4 shrink-0"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm text-white shrink-0"
            style={{ backgroundColor: "#22c55e", boxShadow: "0 0 12px rgba(34,197,94,0.35)" }}
          >
            HS
          </div>
          <div className="min-w-0">
            <h1 className="text-sm font-bold text-white leading-tight truncate">HSClogic</h1>
            <p className="text-xs truncate" style={{ color: "#9ca3af" }}>
              HR Management System
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="lg:hidden ml-2 p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors shrink-0 tap-target flex items-center justify-center"
          aria-label="Close menu"
        >
          <MdClose size={20} />
        </button>
      </div>

      {/* Nav links */}
      <nav className="flex-1 overflow-y-auto py-3 px-3" aria-label="Primary">
        <p
          className="text-xs font-semibold px-3 mb-2 uppercase tracking-widest"
          style={{ color: "#6b7280" }}
        >
          Main Menu
        </p>
        {navItems.map(({ path, label, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            end={path === "/"}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg mb-0.5 text-sm font-medium
               transition-colors duration-150
               ${isActive ? "text-white" : "text-gray-400 hover:text-white hover:bg-white/5"}`
            }
            style={({ isActive }) =>
              isActive ? { backgroundColor: "#22c55e" } : {}
            }
          >
            <Icon size={19} className="shrink-0" />
            <span className="truncate">{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div
        className="px-5 py-3 shrink-0 pb-safe"
        style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
      >
        <p className="text-xs" style={{ color: "#6b7280" }}>
          © 2026 HSClogic Pvt. Ltd.
        </p>
      </div>
    </aside>
  </>
);

export default Sidebar;
