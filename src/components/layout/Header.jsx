import { useState } from "react";
import { MdMenu, MdNotifications, MdPerson, MdLogout, MdKeyboardArrowDown } from "react-icons/md";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../store/slices/authSlice";
import ConfirmDialog from "../common/ConfirmDialog";

const roleColors = {
  Admin: { bg: "#dcfce7", text: "#15803d" },
  "HR Staff": { bg: "#dbeafe", text: "#1d4ed8" },
  Management: { bg: "#f3e8ff", text: "#7e22ce" },
};

const Header = ({ onMenuClick, pageTitle }) => {
  const { currentUser } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const roleStyle = roleColors[currentUser?.role] || { bg: "#f3f4f6", text: "#374151" };

  return (
    <>
      <header
        className="bg-white px-4 py-3 flex items-center justify-between sticky top-0 z-10"
        style={{ borderBottom: "1px solid #e5e7eb" }}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-600"
          >
            <MdMenu size={22} />
          </button>
          <h2 className="text-lg font-semibold text-gray-800">{pageTitle}</h2>
        </div>

        <div className="flex items-center gap-2">
          {/* Notification bell */}
          <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 relative">
            <MdNotifications size={20} />
            <span
              className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
              style={{ backgroundColor: "#22c55e" }}
            />
          </button>

          {/* User menu */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="flex items-center gap-2 rounded-lg px-3 py-1.5 hover:bg-gray-50 transition"
              style={{ border: "1px solid #e5e7eb" }}
            >
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                style={{ backgroundColor: "#1E1E1E" }}
              >
                <MdPerson size={16} className="text-white" />
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-semibold text-gray-800 leading-tight">
                  {currentUser?.name}
                </p>
                <p
                  className="text-xs font-medium leading-tight"
                  style={{ color: roleStyle.text }}
                >
                  {currentUser?.role}
                </p>
              </div>
              <MdKeyboardArrowDown
                size={16}
                className="text-gray-400 hidden sm:block transition-transform"
                style={{ transform: menuOpen ? "rotate(180deg)" : "rotate(0deg)" }}
              />
            </button>

            {menuOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setMenuOpen(false)}
                />
                <div
                  className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 z-20 overflow-hidden"
                >
                  {/* User info block */}
                  <div className="px-4 py-3 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                        style={{ backgroundColor: "#1E1E1E" }}
                      >
                        <MdPerson size={18} className="text-white" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-800 truncate">
                          {currentUser?.name}
                        </p>
                        <p className="text-xs text-gray-400 truncate">{currentUser?.email}</p>
                      </div>
                    </div>
                    <span
                      className="mt-2 inline-block text-xs font-medium px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: roleStyle.bg, color: roleStyle.text }}
                    >
                      {currentUser?.role}
                    </span>
                  </div>

                  {/* Logout */}
                  <button
                    onClick={() => { setMenuOpen(false); setShowLogoutConfirm(true); }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition"
                  >
                    <MdLogout size={17} />
                    Sign Out
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      <ConfirmDialog
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={() => dispatch(logout())}
        title="Sign Out"
        message="Are you sure you want to sign out of the system?"
        confirmLabel="Sign Out"
        confirmColor="red"
      />
    </>
  );
};

export default Header;
