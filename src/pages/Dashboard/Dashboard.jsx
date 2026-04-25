
import { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import {
  MdPeople,
  MdPersonAdd,
  MdWork,
  MdAccessTime,
  MdCheckCircle,
  MdCancel,
  MdSchedule,
  MdTrendingUp,
  MdCalendarToday,
  MdFilterList,
} from "react-icons/md";

const StatCard = ({ title, value, subtitle, icon, color, bg }) => (
  <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex items-start justify-between">
    <div>
      <p className="text-sm text-gray-500 font-medium">{title}</p>
      <p className={`text-3xl font-bold mt-1 ${color}`}>{value}</p>
      {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
    </div>
    <div className={`${bg} p-3 rounded-xl`}>{icon}</div>
  </div>
);

const Badge = ({ status }) => {
  const colors = {
    Active: "bg-green-100 text-green-700",
    Inactive: "bg-red-100 text-red-700",
    Present: "bg-green-100 text-green-700",
    Absent: "bg-red-100 text-red-700",
    Late: "bg-yellow-100 text-yellow-700",
    "Half Day": "bg-orange-100 text-orange-700",
    Leave: "bg-blue-100 text-blue-700",
    Applied: "bg-gray-100 text-gray-700",
    Shortlisted: "bg-blue-100 text-blue-700",
    Selected: "bg-green-100 text-green-700",
    Rejected: "bg-red-100 text-red-700",
    "Interview Scheduled": "bg-purple-100 text-purple-700",
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${colors[status] || "bg-gray-100 text-gray-600"}`}>
      {status}
    </span>
  );
};

const Dashboard = () => {
  const { employees } = useSelector((state) => state.employees);
  const { candidates } = useSelector((state) => state.recruitment);
  const { records } = useSelector((state) => state.attendance);

  const [timePeriod, setTimePeriod] = useState("daily");

  const today = new Date().toISOString().split("T")[0];

  const getMonthStart = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-01`;
  };

  const filteredAttendance = useMemo(() => {
    if (timePeriod === "daily") {
      return records.filter((r) => r.date === today);
    }
    const monthStart = getMonthStart();
    return records.filter((r) => r.date >= monthStart && r.date <= today);
  }, [records, timePeriod, today]);

  // Employee summary (not filtered by period — always total)
  const totalEmployees = employees.length;
  const activeEmployees = employees.filter((e) => e.status === "Active").length;
  const inactiveEmployees = employees.filter((e) => e.status === "Inactive").length;

  // Recruitment summary (always total)
  const totalCandidates = candidates.length;
  const shortlisted = candidates.filter((c) => c.status === "Shortlisted").length;
  const selected = candidates.filter((c) => c.status === "Selected").length;

  // Attendance summary filtered by period
  const presentCount = filteredAttendance.filter((r) => r.status === "Present").length;
  const absentCount = filteredAttendance.filter((r) => r.status === "Absent").length;
  const lateCount = filteredAttendance.filter((r) => r.status === "Late").length;
  const totalHours = filteredAttendance.reduce((sum, r) => sum + r.totalHours, 0);

  // Activity feeds
  const recentEmployees = [...employees].slice(-3).reverse();
  const recentCandidates = [...candidates].slice(-3).reverse();
  const recentAttendance = [...records]
    .sort((a, b) => (b.date + b.checkIn) > (a.date + a.checkIn) ? 1 : -1)
    .slice(0, 4);

  return (
    <div className="space-y-6">

      {/* ── Welcome Banner ── */}
      <div
        className="rounded-xl p-6 text-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        style={{ background: "linear-gradient(135deg, #1E1E1E 0%, #2d2d2d 100%)" }}
      >
        <div>
          <h2 className="text-2xl font-bold">Welcome back!</h2>
          <p className="mt-1 text-sm" style={{ color: "#22c55e" }}>
            {new Date().toLocaleDateString("en-US", {
              weekday: "long", year: "numeric", month: "long", day: "numeric",
            })}
          </p>
        </div>

        {/* Time Period Filter (FRS 2.2 - Data Filtering) */}
        <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2">
          <MdFilterList size={16} className="text-gray-300" />
          <span className="text-xs text-gray-300 font-medium">View:</span>
          <div className="flex rounded-md overflow-hidden border border-white/20">
            <button
              onClick={() => setTimePeriod("daily")}
              className={`px-3 py-1 text-xs font-semibold transition-colors ${
                timePeriod === "daily"
                  ? "text-white"
                  : "text-gray-400 hover:text-white"
              }`}
              style={timePeriod === "daily" ? { backgroundColor: "#22c55e" } : {}}
            >
              Daily
            </button>
            <button
              onClick={() => setTimePeriod("monthly")}
              className={`px-3 py-1 text-xs font-semibold transition-colors ${
                timePeriod === "monthly"
                  ? "text-white"
                  : "text-gray-400 hover:text-white"
              }`}
              style={timePeriod === "monthly" ? { backgroundColor: "#22c55e" } : {}}
            >
              Monthly
            </button>
          </div>
        </div>
      </div>

      {/* ── Employee Summary Cards ── */}
      <div>
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
          Employee Summary
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            title="Total Employees"
            value={totalEmployees}
            subtitle="All registered employees"
            icon={<MdPeople size={22} className="text-green-600" />}
            color="text-green-600"
            bg="bg-green-50"
          />
          <StatCard
            title="Active Employees"
            value={activeEmployees}
            subtitle="Currently working"
            icon={<MdCheckCircle size={22} className="text-green-600" />}
            color="text-green-600"
            bg="bg-green-50"
          />
          <StatCard
            title="Inactive Employees"
            value={inactiveEmployees}
            subtitle="Deactivated records"
            icon={<MdCancel size={22} className="text-red-500" />}
            color="text-red-500"
            bg="bg-red-50"
          />
        </div>
      </div>

      {/* ── Recruitment Summary Cards ── */}
      <div>
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
          Recruitment Summary
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            title="Total Applicants"
            value={totalCandidates}
            subtitle="All applications received"
            icon={<MdPersonAdd size={22} className="text-gray-700" />}
            color="text-gray-800"
            bg="bg-gray-100"
          />
          <StatCard
            title="Shortlisted"
            value={shortlisted}
            subtitle="Moved to next stage"
            icon={<MdTrendingUp size={22} className="text-yellow-600" />}
            color="text-yellow-600"
            bg="bg-yellow-50"
          />
          <StatCard
            title="Selected"
            value={selected}
            subtitle="Offer extended"
            icon={<MdWork size={22} className="text-green-600" />}
            color="text-green-600"
            bg="bg-green-50"
          />
        </div>
      </div>

      {/* ── Attendance Summary Cards ── */}
      <div>
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-2">
          Attendance Summary
          <span className="text-xs font-normal text-gray-400 capitalize">
            ({timePeriod === "daily" ? "Today" : "This Month"})
          </span>
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard
            title="Present"
            value={presentCount}
            icon={<MdCheckCircle size={22} className="text-green-600" />}
            color="text-green-600"
            bg="bg-green-50"
          />
          <StatCard
            title="Absent"
            value={absentCount}
            icon={<MdCancel size={22} className="text-red-500" />}
            color="text-red-500"
            bg="bg-red-50"
          />
          <StatCard
            title="Late Entries"
            value={lateCount}
            icon={<MdSchedule size={22} className="text-yellow-600" />}
            color="text-yellow-600"
            bg="bg-yellow-50"
          />
          <StatCard
            title="Total Hours"
            value={totalHours.toFixed(1)}
            subtitle="Combined work hours"
            icon={<MdAccessTime size={22} className="text-gray-700" />}
            color="text-gray-800"
            bg="bg-gray-100"
          />
        </div>
      </div>

      {/* ── Activity Overview (FRS 2.2 - Activity Overview) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Recently Added Employees */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <MdPeople style={{ color: "#22c55e" }} size={18} />
            Recently Added Employees
          </h3>
          {recentEmployees.length === 0 ? (
            <p className="text-xs text-gray-400 text-center py-4">No employees yet.</p>
          ) : (
            <div className="space-y-3">
              {recentEmployees.map((emp) => (
                <div key={emp.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                      style={{ backgroundColor: "#1E1E1E" }}>
                      <span className="text-white font-semibold text-sm">
                        {emp.fullName.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">{emp.fullName}</p>
                      <p className="text-xs text-gray-400">{emp.designation} · {emp.department}</p>
                    </div>
                  </div>
                  <Badge status={emp.status} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Recruitment Updates */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <MdWork style={{ color: "#22c55e" }} size={18} />
            Recent Recruitment Updates
          </h3>
          {recentCandidates.length === 0 ? (
            <p className="text-xs text-gray-400 text-center py-4">No candidates yet.</p>
          ) : (
            <div className="space-y-3">
              {recentCandidates.map((can) => (
                <div key={can.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                      style={{ backgroundColor: "#1E1E1E" }}>
                      <span className="text-white font-semibold text-sm">
                        {can.candidateName.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">{can.candidateName}</p>
                      <p className="text-xs text-gray-400">{can.appliedPosition} · {can.applicationDate}</p>
                    </div>
                  </div>
                  <Badge status={can.status} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Attendance Records */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <MdCalendarToday style={{ color: "#22c55e" }} size={18} />
            Recent Attendance Records
          </h3>
          {recentAttendance.length === 0 ? (
            <p className="text-xs text-gray-400 text-center py-4">No attendance records yet.</p>
          ) : (
            <div className="space-y-3">
              {recentAttendance.map((rec) => (
                <div key={rec.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                      style={{ backgroundColor: "#1E1E1E" }}>
                      <span className="text-white font-semibold text-sm">
                        {rec.employeeName.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">{rec.employeeName}</p>
                      <p className="text-xs text-gray-400">
                        {rec.date} {rec.checkIn ? `· In: ${rec.checkIn}` : ""}
                      </p>
                    </div>
                  </div>
                  <Badge status={rec.status} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
