import { NavLink } from "react-router-dom";
import {
  MdDashboard, MdPeople, MdWork, MdAccessTime,
} from "react-icons/md";

const items = [
  { path: "/",           label: "Dashboard",  icon: MdDashboard  },
  { path: "/employees",  label: "Employees",  icon: MdPeople     },
  { path: "/recruitment",label: "Recruit",    icon: MdWork       },
  { path: "/attendance", label: "Attendance", icon: MdAccessTime },
];

const BottomNav = () => (
  <nav
    className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-gray-200 pb-safe"
    style={{ boxShadow: "0 -2px 12px rgba(0,0,0,0.06)" }}
  >
    <div className="flex">
      {items.map(({ path, label, icon: Icon }) => (
        <NavLink
          key={path}
          to={path}
          end={path === "/"}
          className={({ isActive }) =>
            `flex-1 flex flex-col items-center justify-center py-2 gap-0.5 text-[10px] font-medium transition-colors
            ${isActive ? "text-green-600" : "text-gray-400"}`
          }
        >
          {({ isActive }) => (
            <>
              <span
                className="p-1.5 rounded-xl transition-colors"
                style={isActive ? { backgroundColor: "#dcfce7" } : {}}
              >
                <Icon size={22} />
              </span>
              {label}
            </>
          )}
        </NavLink>
      ))}
    </div>
  </nav>
);

export default BottomNav;
