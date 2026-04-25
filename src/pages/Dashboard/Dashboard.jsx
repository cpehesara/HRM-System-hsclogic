import { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  MdPeople, MdPersonAdd, MdWork, MdAccessTime,
  MdCheckCircle, MdCancel, MdSchedule, MdTrendingUp,
  MdCalendarToday, MdFilterList, MdArrowForward,
} from "react-icons/md";

/* ── Shared sub-components ────────────────────────────────────────── */

const StatCard = ({ title, value, subtitle, icon, color, bg }) => (
  <div className="bg-white rounded-xl p-4 sm:p-5 shadow-sm border border-gray-100
                  flex items-start justify-between gap-3">
    <div className="min-w-0">
      <p className="text-xs sm:text-sm text-gray-500 font-medium leading-tight">{title}</p>
      <p className={`text-2xl sm:text-3xl font-bold mt-1 ${color}`}>{value}</p>
      {subtitle && (
        <p className="text-xs text-gray-400 mt-1 hidden sm:block">{subtitle}</p>
      )}
    </div>
    <div className={`${bg} p-2.5 sm:p-3 rounded-xl shrink-0`}>{icon}</div>
  </div>
);

const Badge = ({ status }) => {
  const colors = {
    Active:               "bg-green-100 text-green-700",
    Inactive:             "bg-red-100 text-red-700",
    Present:              "bg-green-100 text-green-700",
    Absent:               "bg-red-100 text-red-700",
    Late:                 "bg-yellow-100 text-yellow-700",
    "Half Day":           "bg-orange-100 text-orange-700",
    Leave:                "bg-blue-100 text-blue-700",
    Applied:              "bg-gray-100 text-gray-700",
    Shortlisted:          "bg-blue-100 text-blue-700",
    Selected:             "bg-green-100 text-green-700",
    Rejected:             "bg-red-100 text-red-700",
    "Interview Scheduled":"bg-purple-100 text-purple-700",
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium shrink-0
                      ${colors[status] ?? "bg-gray-100 text-gray-600"}`}>
      {status}
    </span>
  );
};

/* ── Activity feed card ───────────────────────────────────────────── */
const ActivityCard = ({ title, icon, items, renderItem, emptyMsg }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-5">
    <h4 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
      {icon}
      {title}
    </h4>
    {items.length === 0
      ? <p className="text-xs text-gray-400 text-center py-6">{emptyMsg}</p>
      : <div className="space-y-0 divide-y divide-gray-50">{items.map(renderItem)}</div>
    }
  </div>
);

/* ─────────────────────────────────────────────────────────────────── */

const Dashboard = () => {
  const navigate = useNavigate();
  const { employees }  = useSelector((s) => s.employees);
  const { candidates } = useSelector((s) => s.recruitment);
  const { records }    = useSelector((s) => s.attendance);
  const { currentUser }= useSelector((s) => s.auth);

  const role      = currentUser?.role;
  const canManage = role === "Admin" || role === "HR Staff";

  const [timePeriod, setTimePeriod] = useState("daily");
  const today = new Date().toISOString().split("T")[0];

  const getMonthStart = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-01`;
  };

  const filteredAttendance = useMemo(() => {
    if (timePeriod === "daily") return records.filter((r) => r.date === today);
    const ms = getMonthStart();
    return records.filter((r) => r.date >= ms && r.date <= today);
  }, [records, timePeriod, today]);

  /* Stats */
  const totalEmp    = employees.length;
  const activeEmp   = employees.filter((e) => e.status === "Active").length;
  const inactiveEmp = employees.filter((e) => e.status === "Inactive").length;

  const totalCand   = candidates.length;
  const shortlisted = candidates.filter((c) => c.status === "Shortlisted").length;
  const selected    = candidates.filter((c) => c.status === "Selected").length;

  const presentCt   = filteredAttendance.filter((r) => r.status === "Present").length;
  const absentCt    = filteredAttendance.filter((r) => r.status === "Absent").length;
  const lateCt      = filteredAttendance.filter((r) => r.status === "Late").length;
  const totalHrs    = filteredAttendance.reduce((s, r) => s + r.totalHours, 0);

  /* Activity feeds */
  const recentEmps  = [...employees].slice(-3).reverse();
  const recentCands = [...candidates].slice(-3).reverse();
  const recentAtts  = [...records]
    .sort((a, b) => (b.date + b.checkIn) > (a.date + a.checkIn) ? 1 : -1)
    .slice(0, 4);

  /* Navigation quick-links (FRS §2.2) */
  const navCards = [
    {
      label: "Employee Management",
      desc:  canManage ? "Add, edit and manage employee records" : "View employee summaries",
      icon:  <MdPeople size={22} />, path: "/employees",
      color: "#22c55e", bg: "#dcfce7",
    },
    {
      label: "Recruitment",
      desc:  canManage ? "Track candidates through the hiring pipeline" : "Monitor recruitment data",
      icon:  <MdWork size={22} />, path: "/recruitment",
      color: "#7c3aed", bg: "#ede9fe",
    },
    {
      label: "Attendance",
      desc:  canManage ? "Mark and manage employee attendance" : "View attendance reports",
      icon:  <MdAccessTime size={22} />, path: "/attendance",
      color: "#2563eb", bg: "#dbeafe",
    },
  ];

  /* Avatar helper */
  const Avatar = ({ letter }) => (
    <div
      className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center shrink-0"
      style={{ backgroundColor: "#1E1E1E" }}
    >
      <span className="text-white font-semibold text-xs sm:text-sm">{letter}</span>
    </div>
  );

  return (
    <div className="space-y-5 sm:space-y-6">

      {/* ── Welcome banner + period filter ── */}
      <div
        className="rounded-xl p-4 sm:p-6 text-white flex flex-col sm:flex-row
                   sm:items-center sm:justify-between gap-4"
        style={{ background: "linear-gradient(135deg,#1E1E1E 0%,#2d2d2d 100%)" }}
      >
        <div>
          <h2 className="text-xl sm:text-2xl font-bold leading-tight">
            Welcome back, {currentUser?.name?.split(" ")[0]}
          </h2>
          <p className="mt-1 text-xs sm:text-sm" style={{ color: "#22c55e" }}>
            {new Date().toLocaleDateString("en-US", {
              weekday:"long", year:"numeric", month:"long", day:"numeric",
            })}
          </p>
          <span
            className="mt-2 inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full"
            style={{
              backgroundColor:
                role === "Admin" ? "#22c55e" : role === "HR Staff" ? "#3b82f6" : "#a855f7",
              color: "#fff",
            }}
          >
            {role}
          </span>
        </div>

        {/* Daily / Monthly filter — FRS §2.2 */}
        <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2 self-start">
          <MdFilterList size={15} className="text-gray-300 shrink-0" />
          <span className="text-xs text-gray-300 font-medium">View:</span>
          <div className="flex rounded-md overflow-hidden border border-white/20">
            {["daily","monthly"].map((p) => (
              <button
                key={p}
                onClick={() => setTimePeriod(p)}
                className={`px-3 py-1 text-xs font-semibold transition-colors
                  ${timePeriod === p ? "text-white" : "text-gray-400 hover:text-white"}`}
                style={timePeriod === p ? { backgroundColor: "#22c55e" } : {}}
              >
                {p === "daily" ? "Daily" : "Monthly"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Navigation quick-links — FRS §2.2 ── */}
      <section aria-label="Quick navigation">
        <h3 className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
          Quick Navigation
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          {navCards.map((c) => (
            <button
              key={c.path}
              onClick={() => navigate(c.path)}
              className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 sm:p-5
                         text-left hover:shadow-md active:scale-[.98] transition group tap-target"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="p-2.5 rounded-xl shrink-0"
                  style={{ backgroundColor: c.bg, color: c.color }}>
                  {c.icon}
                </div>
                <MdArrowForward
                  size={17}
                  className="text-gray-300 group-hover:text-gray-500 transition-colors mt-0.5"
                />
              </div>
              <p className="text-sm font-semibold text-gray-800">{c.label}</p>
              <p className="text-xs text-gray-400 mt-0.5 leading-snug">{c.desc}</p>
            </button>
          ))}
        </div>
      </section>

      {/* ── Employee summary — FRS §2.2 ── */}
      <section aria-label="Employee summary">
        <h3 className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
          Employee Summary
        </h3>
        <div className="grid grid-cols-3 gap-2 sm:gap-4">
          <StatCard title="Total"    value={totalEmp}    icon={<MdPeople size={20} className="text-green-600"/>}     color="text-green-600" bg="bg-green-50"  />
          <StatCard title="Active"   value={activeEmp}   icon={<MdCheckCircle size={20} className="text-green-600"/>} color="text-green-600" bg="bg-green-50"  />
          <StatCard title="Inactive" value={inactiveEmp} icon={<MdCancel size={20} className="text-red-500"/>}        color="text-red-500"   bg="bg-red-50"    />
        </div>
      </section>

      {/* ── Recruitment summary — FRS §2.2 ── */}
      <section aria-label="Recruitment summary">
        <h3 className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
          Recruitment Summary
        </h3>
        <div className="grid grid-cols-3 gap-2 sm:gap-4">
          <StatCard title="Applicants"  value={totalCand}   icon={<MdPersonAdd size={20} className="text-gray-700"/>}    color="text-gray-800"  bg="bg-gray-100"  />
          <StatCard title="Shortlisted" value={shortlisted}  icon={<MdTrendingUp size={20} className="text-yellow-600"/>} color="text-yellow-600" bg="bg-yellow-50" />
          <StatCard title="Selected"    value={selected}     icon={<MdWork size={20} className="text-green-600"/>}         color="text-green-600"  bg="bg-green-50"  />
        </div>
      </section>

      {/* ── Attendance summary — FRS §2.2 ── */}
      <section aria-label="Attendance summary">
        <h3 className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-2 flex-wrap">
          Attendance Summary
          <span className="text-xs font-normal text-gray-400 normal-case">
            — {timePeriod === "daily" ? "Today" : "This Month"}
          </span>
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
          <StatCard title="Present"     value={presentCt}            icon={<MdCheckCircle size={20} className="text-green-600"/>} color="text-green-600"  bg="bg-green-50"  />
          <StatCard title="Absent"      value={absentCt}             icon={<MdCancel size={20} className="text-red-500"/>}        color="text-red-500"    bg="bg-red-50"    />
          <StatCard title="Late"        value={lateCt}               icon={<MdSchedule size={20} className="text-yellow-600"/>}   color="text-yellow-600" bg="bg-yellow-50" />
          <StatCard title="Total Hrs"   value={totalHrs.toFixed(1)}  icon={<MdAccessTime size={20} className="text-gray-700"/>}   color="text-gray-800"   bg="bg-gray-100"  />
        </div>
      </section>

      {/* ── Activity overview — FRS §2.2 ── */}
      <section aria-label="Activity overview">
        <h3 className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
          Activity Overview
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">

          <ActivityCard
            title="Recently Added Employees"
            icon={<MdPeople style={{ color:"#22c55e" }} size={17} />}
            items={recentEmps}
            emptyMsg="No employees yet."
            renderItem={(emp) => (
              <div key={emp.id} className="flex items-center justify-between py-2.5 gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <Avatar letter={emp.fullName.charAt(0)} />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{emp.fullName}</p>
                    <p className="text-xs text-gray-400 truncate">{emp.designation} · {emp.department}</p>
                  </div>
                </div>
                <Badge status={emp.status} />
              </div>
            )}
          />

          <ActivityCard
            title="Recent Recruitment Updates"
            icon={<MdWork style={{ color:"#22c55e" }} size={17} />}
            items={recentCands}
            emptyMsg="No candidates yet."
            renderItem={(can) => (
              <div key={can.id} className="flex items-center justify-between py-2.5 gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <Avatar letter={can.candidateName.charAt(0)} />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{can.candidateName}</p>
                    <p className="text-xs text-gray-400 truncate">{can.appliedPosition} · {can.applicationDate}</p>
                  </div>
                </div>
                <Badge status={can.status} />
              </div>
            )}
          />

          <ActivityCard
            title="Recent Attendance Records"
            icon={<MdCalendarToday style={{ color:"#22c55e" }} size={17} />}
            items={recentAtts}
            emptyMsg="No attendance records yet."
            renderItem={(rec) => (
              <div key={rec.id} className="flex items-center justify-between py-2.5 gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <Avatar letter={rec.employeeName.charAt(0)} />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{rec.employeeName}</p>
                    <p className="text-xs text-gray-400 truncate">
                      {rec.date}{rec.checkIn ? ` · In: ${rec.checkIn}` : ""}
                    </p>
                  </div>
                </div>
                <Badge status={rec.status} />
              </div>
            )}
          />

        </div>
      </section>

    </div>
  );
};

export default Dashboard;
