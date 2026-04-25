import { useState } from "react";
import {
  MdMenu, MdNotifications, MdPerson,
  MdLogout, MdKeyboardArrowDown,
} from "react-icons/md";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../store/slices/authSlice";
import ConfirmDialog from "../common/ConfirmDialog";

const roleColors = {
  Admin:      { bg: "#dcfce7", text: "#15803d" },
  "HR Staff": { bg: "#dbeafe", text: "#1d4ed8" },
  Management: { bg: "#f3e8ff", text: "#7e22ce" },
};

const Header = ({ onMenuClick, pageTitle }) => {
  const { currentUser } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const roleStyle = roleColors[currentUser?.role] || { bg: "#f3f4f6", text: "#374151" };
  const firstName = currentUser?.name?.split(" ")[0] ?? "";

  return (
    <>
      <header
        className="bg-white px-3 sm:px-5 py-2.5 flex items-center justify-between sticky top-0 z-20 shrink-0"
        style={{ borderBottom: "1px solid #e5e7eb", minHeight: "56px" }}
      >
        {/* Left — hamburger + title */}
        <div className="flex items-center gap-2 min-w-0">
          {/* Hamburger visible only on < lg (sidebar shows on lg+) */}
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-600 tap-target flex items-center justify-center shrink-0"
            aria-label="Open navigation menu"
          >
            <MdMenu size={22} />
          </button>
          <h2 className="text-base sm:text-lg font-semibold text-gray-800 truncate leading-tight">
            {pageTitle}
          </h2>
        </div>

        {/* Right — bell + user menu */}
        <div className="flex items-center gap-1.5 shrink-0">

          {/* Notification bell */}
          <button
            className="relative p-2 rounded-lg hover:bg-gray-100 text-gray-500 tap-target flex items-center justify-center"
            aria-label="Notifications"
          >
            <MdNotifications size={21} />
            <span
              className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
              style={{ backgroundColor: "#22c55e" }}
            />
          </button>

          {/* User dropdown trigger */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 hover:bg-gray-50 transition-colors tap-target"
              style={{ border: "1px solid #e5e7eb" }}
              aria-haspopup="true"
              aria-expanded={menuOpen}
              aria-label="User menu"
            >
              {/* Avatar */}
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                style={{ backgroundColor: "#1E1E1E" }}
              >
                <MdPerson size={15} className="text-white" />
              </div>

              {/* Name + role — hidden on xs */}
              <div className="hidden sm:block text-left leading-tight">
                <p className="text-xs font-semibold text-gray-800 truncate max-w-25">
                  {firstName}
                </p>
                <p className="text-[10px] font-medium truncate" style={{ color: roleStyle.text }}>
                  {currentUser?.role}
                </p>
              </div>

              <MdKeyboardArrowDown
                size={15}
                className="text-gray-400 hidden sm:block transition-transform duration-200"
                style={{ transform: menuOpen ? "rotate(180deg)" : "rotate(0deg)" }}
              />
            </button>

            {/* Dropdown */}
            {menuOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setMenuOpen(false)}
                  aria-hidden="true"
                />
                <div
                  className="absolute right-0 mt-2 w-60 bg-white rounded-xl shadow-xl border border-gray-100 z-20 overflow-hidden"
                  role="menu"
                >
                  {/* User info */}
                  <div className="px-4 py-3 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                        style={{ backgroundColor: "#1E1E1E" }}
                      >
                        <MdPerson size={19} className="text-white" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-800 truncate">
                          {currentUser?.name}
                        </p>
                        <p className="text-xs text-gray-400 truncate">{currentUser?.email}</p>
                      </div>
                    </div>
                    <span
                      className="mt-2 inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full"
                      style={{ backgroundColor: roleStyle.bg, color: roleStyle.text }}
                    >
                      {currentUser?.role}
                    </span>
                  </div>

                  {/* Sign out */}
                  <button
                    role="menuitem"
                    onClick={() => { setMenuOpen(false); setShowLogoutConfirm(true); }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors tap-target"
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
