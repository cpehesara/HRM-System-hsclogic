import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  addAttendance,
  updateAttendance,
  deleteAttendance,
} from "../../store/slices/attendanceSlice";
import Modal from "../../components/common/Modal";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import Badge from "../../components/common/Badge";
import AttendanceForm from "./AttendanceForm";
import { useToast } from "../../context/ToastContext";
import {
  MdAdd, MdEdit, MdDelete, MdSearch,
  MdCheckCircle, MdCancel, MdSchedule, MdAccessTime, MdCalendarToday,
} from "react-icons/md";

const Attendance = () => {
  const dispatch = useDispatch();
  const toast = useToast();
  const { records } = useSelector((state) => state.attendance);
  const { employees } = useSelector((state) => state.employees);
  const { currentUser } = useSelector((state) => state.auth);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const [search, setSearch] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  const canEdit = currentUser.role === "Admin" || currentUser.role === "HR Staff";

  const generateId = () => {
    const max = records.reduce((acc, r) => {
      const num = parseInt(r.id.replace("ATT", ""));
      return num > acc ? num : acc;
    }, 0);
    return `ATT${String(max + 1).padStart(3, "0")}`;
  };

  const filtered = records.filter((r) => {
    const matchSearch =
      r.employeeName.toLowerCase().includes(search.toLowerCase()) ||
      r.employeeId.toLowerCase().includes(search.toLowerCase());
    const matchDate = !filterDate || r.date === filterDate;
    const matchStatus = filterStatus === "All" || r.status === filterStatus;
    return matchSearch && matchDate && matchStatus;
  });

  const today = new Date().toISOString().split("T")[0];
  const todayRecs = records.filter((r) => r.date === today);
  const presentCount = todayRecs.filter((r) => r.status === "Present").length;
  const absentCount = todayRecs.filter((r) => r.status === "Absent").length;
  const lateCount = todayRecs.filter((r) => r.status === "Late").length;
  const totalHours = todayRecs.reduce((sum, r) => sum + r.totalHours, 0);
  const incomplete = records.filter((r) => r.checkIn && !r.checkOut).length;

  const handleAdd = (formData) => {
    dispatch(addAttendance({ ...formData, id: generateId() }));
    setShowAddModal(false);
    toast.success(`Attendance marked for ${formData.employeeName}.`, "Attendance Marked");
  };

  const handleEdit = (formData) => {
    dispatch(updateAttendance(formData));
    setShowEditModal(false);
    toast.success(`Attendance record updated for ${formData.employeeName}.`, "Record Updated");
  };

  const handleDelete = () => {
    const name = selectedRecord?.employeeName;
    dispatch(deleteAttendance(selectedRecord?.id));
    toast.info(`Attendance record for ${name} has been deleted.`, "Record Deleted");
  };

  return (
    <div className="space-y-5">

      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Attendance</h2>
          <p className="text-sm text-gray-500">{records.length} total records in history</p>
        </div>
        {canEdit && (
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 text-white text-sm font-medium rounded-lg"
            style={{ backgroundColor: "#22c55e" }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = "#16a34a"}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = "#22c55e"}
          >
            <MdAdd size={18} />
            Mark Attendance
          </button>
        )}
      </div>

      {/* ── Today's Summary Cards ── */}
      <div>
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
          Today's Summary — {new Date().toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
            <MdCheckCircle className="text-green-500 mx-auto mb-1" size={22} />
            <p className="text-2xl font-bold text-green-600">{presentCount}</p>
            <p className="text-xs text-gray-500 mt-0.5">Present</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
            <MdCancel className="text-red-500 mx-auto mb-1" size={22} />
            <p className="text-2xl font-bold text-red-500">{absentCount}</p>
            <p className="text-xs text-gray-500 mt-0.5">Absent</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
            <MdSchedule className="text-yellow-500 mx-auto mb-1" size={22} />
            <p className="text-2xl font-bold text-yellow-600">{lateCount}</p>
            <p className="text-xs text-gray-500 mt-0.5">Late</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
            <MdAccessTime className="text-gray-500 mx-auto mb-1" size={22} />
            <p className="text-2xl font-bold text-gray-700">{totalHours.toFixed(1)}</p>
            <p className="text-xs text-gray-500 mt-0.5">Total Hrs</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
            <MdSchedule className="text-orange-500 mx-auto mb-1" size={22} />
            <p className="text-2xl font-bold text-orange-600">{incomplete}</p>
            <p className="text-xs text-gray-500 mt-0.5">Incomplete</p>
          </div>
        </div>
      </div>

      {/* ── Search & Filters ── */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by employee name or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="All">All Status</option>
          <option value="Present">Present</option>
          <option value="Absent">Absent</option>
          <option value="Late">Late</option>
          <option value="Half Day">Half Day</option>
          <option value="Leave">Leave</option>
        </select>
        {(filterDate || filterStatus !== "All" || search) && (
          <button
            onClick={() => { setSearch(""); setFilterDate(""); setFilterStatus("All"); }}
            className="text-sm text-gray-500 hover:text-red-500 px-2 underline whitespace-nowrap"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* ── Attendance Table ── */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: "#1E1E1E" }}>
                <th className="text-left px-5 py-3 text-xs font-semibold uppercase text-white">Employee</th>
                <th className="text-left px-5 py-3 text-xs font-semibold uppercase text-white">Date</th>
                <th className="text-left px-5 py-3 text-xs font-semibold uppercase text-white">Check In</th>
                <th className="text-left px-5 py-3 text-xs font-semibold uppercase text-white">Check Out</th>
                <th className="text-left px-5 py-3 text-xs font-semibold uppercase text-white">Hours</th>
                <th className="text-left px-5 py-3 text-xs font-semibold uppercase text-white">Status</th>
                {canEdit && (
                  <th className="text-left px-5 py-3 text-xs font-semibold uppercase text-white">Actions</th>
                )}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={canEdit ? 7 : 6} className="text-center py-16">
                    <div className="flex flex-col items-center gap-2">
                      <MdCalendarToday size={40} className="text-gray-200" />
                      <p className="text-gray-400 font-medium text-sm">
                        {search || filterDate || filterStatus !== "All"
                          ? "No attendance records match your filters."
                          : "No attendance records yet. Start marking attendance."}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((rec) => (
                  <tr key={rec.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                          style={{ backgroundColor: "#1E1E1E" }}
                        >
                          <span className="text-white font-semibold text-xs">
                            {rec.employeeName.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{rec.employeeName}</p>
                          <p className="text-xs text-gray-400">{rec.employeeId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-gray-600">{rec.date}</td>
                    <td className="px-5 py-3.5">
                      {rec.checkIn
                        ? <span className="text-gray-700 font-medium">{rec.checkIn}</span>
                        : <span className="text-gray-300">—</span>}
                    </td>
                    <td className="px-5 py-3.5">
                      {rec.checkOut
                        ? <span className="text-gray-700 font-medium">{rec.checkOut}</span>
                        : rec.checkIn
                          ? <span className="text-orange-400 text-xs font-medium">Missing ⚠</span>
                          : <span className="text-gray-300">—</span>}
                    </td>
                    <td className="px-5 py-3.5">
                      {rec.totalHours > 0
                        ? <span className="text-green-600 font-semibold">{rec.totalHours} hrs</span>
                        : <span className="text-gray-300">—</span>}
                    </td>
                    <td className="px-5 py-3.5"><Badge status={rec.status} /></td>
                    {canEdit && (
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => { setSelectedRecord(rec); setShowEditModal(true); }}
                            className="p-1.5 rounded-lg hover:bg-yellow-50 text-yellow-600"
                            title="Edit"
                          >
                            <MdEdit size={17} />
                          </button>
                          <button
                            onClick={() => { setSelectedRecord(rec); setShowDeleteConfirm(true); }}
                            className="p-1.5 rounded-lg hover:bg-red-50 text-red-500"
                            title="Delete"
                          >
                            <MdDelete size={17} />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Modals ── */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Mark Attendance" size="lg">
        <AttendanceForm onSave={handleAdd} onCancel={() => setShowAddModal(false)} isEdit={false} />
      </Modal>

      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Edit Attendance Record" size="lg">
        <AttendanceForm
          initial={selectedRecord}
          onSave={handleEdit}
          onCancel={() => setShowEditModal(false)}
          isEdit={true}
        />
      </Modal>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Delete Attendance Record"
        message={`Are you sure you want to delete this attendance record for ${selectedRecord?.employeeName}? This cannot be undone.`}
        confirmLabel="Delete"
        confirmColor="red"
      />
    </div>
  );
};

export default Attendance;
