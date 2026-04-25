import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import BottomNav from "./BottomNav";

const pageTitles = {
  "/":           "Dashboard",
  "/employees":  "Employee Management",
  "/recruitment":"Recruitment Management",
  "/attendance": "Attendance Management",
};

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location  = useLocation();
  const pageTitle = pageTitles[location.pathname] || "HSClogic HRMS";

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">

      {/* Sidebar — hidden on mobile, static on lg+ */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Right column */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        <Header onMenuClick={() => setSidebarOpen(true)} pageTitle={pageTitle} />

        {/* Scrollable page area — extra bottom padding on mobile for BottomNav */}
        <main className="flex-1 overflow-y-auto overscroll-contain">
          <div className="px-4 py-4 md:px-6 md:py-6 pb-24 lg:pb-6 max-w-screen-xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Bottom navigation bar — mobile only (lg: hidden) */}
      <BottomNav />
    </div>
  );
};

export default MainLayout;
