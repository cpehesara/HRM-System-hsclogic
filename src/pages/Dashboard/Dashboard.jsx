
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

  const totalEmployees = employees.length;
  const activeEmployees = employees.filter((e) => e.status === "Active").length;
  const inactiveEmployees = employees.filter((e) => e.status === "Inactive").length;

  const totalCandidates = candidates.length;
  const shortlisted = candidates.filter((c) => c.status === "Shortlisted").length;
  const selected = candidates.filter((c) => c.status === "Selected").length;

  const today = new Date().toISOString().split("T")[0];
  const todayRecords = records.filter((r) => r.date === today);
  const presentToday = todayRecords.filter((r) => r.status === "Present").length;
  const absentToday = todayRecords.filter((r) => r.status === "Absent").length;
  const lateToday = todayRecords.filter((r) => r.status === "Late").length;
  const totalHoursToday = todayRecords.reduce((sum, r) => sum + r.totalHours, 0);

  const recentEmployees = [...employees].slice(-3).reverse();
  const recentCandidates = [...candidates].slice(-3).reverse();

  return (
    <div className="space-y-6">

      {/* ── Welcome Banner ── */}
      <div
        className="rounded-xl p-6 text-white"
        style={{ background: "linear-gradient(135deg, #1E1E1E 0%, #2d2d2d 100%)" }}
      >
        <h2 className="text-2xl font-bold">Welcome back! 👋</h2>
        <p className="mt-1 text-sm" style={{ color: "#22c55e" }}>
          Here's what's happening at HSClogic today —{" "}
          {new Date().toLocaleDateString("en-US", {
            weekday: "long", year: "numeric", month: "long", day: "numeric",
          })}
        </p>
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
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
          Today's Attendance
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard
            title="Present"
            value={presentToday}
            icon={<MdCheckCircle size={22} className="text-green-600" />}
            color="text-green-600"
            bg="bg-green-50"
          />
          <StatCard
            title="Absent"
            value={absentToday}
            icon={<MdCancel size={22} className="text-red-500" />}
            color="text-red-500"
            bg="bg-red-50"
          />
          <StatCard
            title="Late Entries"
            value={lateToday}
            icon={<MdSchedule size={22} className="text-yellow-600" />}
            color="text-yellow-600"
            bg="bg-yellow-50"
          />
          <StatCard
            title="Total Hours"
            value={totalHoursToday.toFixed(1)}
            subtitle="Combined work hours"
            icon={<MdAccessTime size={22} className="text-gray-700" />}
            color="text-gray-800"
            bg="bg-gray-100"
          />
        </div>
      </div>

      {/* ── Recent Activity Section ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Recent Employees */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <MdPeople style={{ color: "#22c55e" }} size={18} />
            Recently Added Employees
          </h3>
          <div className="space-y-3">
            {recentEmployees.map((emp) => (
              <div key={emp.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center"
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
        </div>

        {/* Recent Candidates */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <MdWork style={{ color: "#22c55e" }} size={18} />
            Recent Recruitment Updates
          </h3>
          <div className="space-y-3">
            {recentCandidates.map((can) => (
              <div key={can.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center"
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
        </div>
      </div>

    </div>
  );
};

export default Dashboard;