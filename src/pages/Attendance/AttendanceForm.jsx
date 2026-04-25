
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { attendanceStatuses } from "../../data/mockData";

const emptyForm = {
  employeeId: "",
  employeeName: "",
  date: "",
  checkIn: "",
  checkOut: "",
  status: "Present",
};

// Calculate hours between two time strings
const calcHours = (checkIn, checkOut) => {
  if (!checkIn || !checkOut) return 0;
  const [inH, inM] = checkIn.split(":").map(Number);
  const [outH, outM] = checkOut.split(":").map(Number);
  const mins = (outH * 60 + outM) - (inH * 60 + inM);
  return mins > 0 ? (Math.round((mins / 60) * 100) / 100) : 0;
};

const AttendanceForm = ({ initial, onSave, onCancel, isEdit }) => {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const { employees } = useSelector((state) => state.employees);

  // Only active employees can have attendance
  const activeEmployees = employees.filter((e) => e.status === "Active");

  useEffect(() => {
    if (initial) setForm(initial);
  }, [initial]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // When employee is selected, auto-fill employee name
    if (name === "employeeId") {
      const emp = employees.find((e) => e.id === value);
      setForm((prev) => ({
        ...prev,
        employeeId: value,
        employeeName: emp ? emp.fullName : "",
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.employeeId) newErrors.employeeId = "Employee is required";
    if (!form.date) newErrors.date = "Date is required";
    if (!form.status) newErrors.status = "Status is required";
    return newErrors;
  };

  const handleSubmit = () => {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }
    onSave(form);
  };

  const workedHours = calcHours(form.checkIn, form.checkOut);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        {/* Employee selector */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Employee *</label>
          <select
            name="employeeId"
            value={form.employeeId}
            onChange={handleChange}
            disabled={isEdit}
            className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500
              ${errors.employeeId ? "border-red-400" : "border-gray-200"}
              ${isEdit ? "bg-gray-50 text-gray-500" : ""}`}
          >
            <option value="">Select Employee</option>
            {activeEmployees.map((e) => (
              <option key={e.id} value={e.id}>{e.fullName} ({e.id})</option>
            ))}
          </select>
          {errors.employeeId && <p className="text-red-500 text-xs mt-1">{errors.employeeId}</p>}
        </div>

        {/* Date */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Date *</label>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500
              ${errors.date ? "border-red-400" : "border-gray-200"}`}
          />
          {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
        </div>

        {/* Check In */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Check-In Time</label>
          <input
            type="time"
            name="checkIn"
            value={form.checkIn}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Check Out */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Check-Out Time</label>
          <input
            type="time"
            name="checkOut"
            value={form.checkOut}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Status */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Status *</label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            {attendanceStatuses.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        {/* Auto-calculated hours display */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Calculated Work Hours</label>
          <div className={`w-full px-3 py-2 text-sm border rounded-lg font-semibold
            ${workedHours > 0 ? "bg-green-50 border-green-200 text-green-700" : "bg-gray-50 border-gray-200 text-gray-400"}`}>
            {workedHours > 0 ? `${workedHours} hrs` : "—"}
          </div>
          {form.checkIn && !form.checkOut && (
            <p className="text-yellow-600 text-xs mt-1">⚠ Check-out missing — incomplete record</p>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button onClick={onCancel} className="px-4 py-2 text-sm rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50">
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className="px-5 py-2 text-sm rounded-lg text-white font-medium"
          style={{ backgroundColor: "#22c55e" }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = "#16a34a"}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = "#22c55e"}
        >
          {isEdit ? "Save Changes" : "Mark Attendance"}
        </button>
      </div>
    </div>
  );
};

export default AttendanceForm;