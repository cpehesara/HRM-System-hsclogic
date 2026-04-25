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
  const activeEmployees = employees.filter((e) => e.status === "Active");

  useEffect(() => {
    if (initial) setForm(initial);
  }, [initial]);

  const handleChange = (e) => {
    const { name, value } = e.target;
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
    if (form.checkIn && form.checkOut) {
      const [inH, inM] = form.checkIn.split(":").map(Number);
      const [outH, outM] = form.checkOut.split(":").map(Number);
      if ((outH * 60 + outM) <= (inH * 60 + inM)) {
        newErrors.checkOut = "Check-out time must be after check-in time";
      }
    }
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
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">Employee *</label>
          <select
            name="employeeId"
            value={form.employeeId}
            onChange={handleChange}
            disabled={isEdit}
            className={`w-full px-3 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 bg-white
              ${errors.employeeId ? "border-red-400 bg-red-50" : "border-gray-200"}
              ${isEdit ? "opacity-60" : ""}`}
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
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">Date *</label>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            className={`w-full px-3 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500
              ${errors.date ? "border-red-400 bg-red-50" : "border-gray-200"}`}
          />
          {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
        </div>

        {/* Check In */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">Check-In Time</label>
          <input
            type="time"
            name="checkIn"
            value={form.checkIn}
            onChange={handleChange}
            className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Check Out */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">Check-Out Time</label>
          <input
            type="time"
            name="checkOut"
            value={form.checkOut}
            onChange={handleChange}
            className={`w-full px-3 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500
              ${errors.checkOut ? "border-red-400 bg-red-50" : "border-gray-200"}`}
          />
          {errors.checkOut && <p className="text-red-500 text-xs mt-1">{errors.checkOut}</p>}
        </div>

        {/* Status */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">Status *</label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
          >
            {attendanceStatuses.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        {/* Auto-calculated hours */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">Calculated Work Hours</label>
          <div className={`w-full px-3 py-2.5 text-sm border rounded-xl font-semibold
            ${workedHours > 0 ? "bg-green-50 border-green-200 text-green-700" : "bg-gray-50 border-gray-200 text-gray-400"}`}>
            {workedHours > 0 ? `${workedHours} hrs` : "—"}
          </div>
          {form.checkIn && !form.checkOut && (
            <p className="text-yellow-600 text-xs mt-1">⚠ Check-out missing — incomplete record</p>
          )}
        </div>
      </div>

      <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-2">
        <button
          onClick={onCancel}
          className="w-full sm:w-auto px-4 py-2.5 text-sm rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 tap-target"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className="w-full sm:w-auto px-5 py-2.5 text-sm rounded-xl text-white font-semibold tap-target"
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
