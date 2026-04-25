import { useState, useEffect } from "react";
import { departments, designations } from "../../data/mockData";

const emptyForm = {
  fullName: "",
  designation: "",
  department: "",
  dateOfJoining: "",
  contact: "",
  email: "",
  employmentType: "Full-Time",
  eligibleLeaves: 14,
  status: "Active",
};

const EmployeeForm = ({ initial, onSave, onCancel, isEdit }) => {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initial) setForm(initial);
  }, [initial]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!form.designation) newErrors.designation = "Designation is required";
    if (!form.department) newErrors.department = "Department is required";
    if (!form.dateOfJoining) newErrors.dateOfJoining = "Date of joining is required";
    if (!form.contact.trim()) newErrors.contact = "Contact is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = "Invalid email format";
    return newErrors;
  };

  const handleSubmit = () => {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }
    onSave(form);
  };

  const Field = ({ label, name, type = "text", options }) => (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1.5">{label}</label>
      {options ? (
        <select
          name={name}
          value={form[name]}
          onChange={handleChange}
          className={`w-full px-3 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 bg-white
            ${errors[name] ? "border-red-400 bg-red-50" : "border-gray-200"}`}
        >
          <option value="">Select {label}</option>
          {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : (
        <input
          type={type}
          name={name}
          value={form[name]}
          onChange={handleChange}
          className={`w-full px-3 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500
            ${errors[name] ? "border-red-400 bg-red-50" : "border-gray-200"}`}
        />
      )}
      {errors[name] && <p className="text-red-500 text-xs mt-1">{errors[name]}</p>}
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Full Name *" name="fullName" />
        <Field label="Email *" name="email" type="email" />
        <Field label="Contact *" name="contact" />
        <Field label="Date of Joining *" name="dateOfJoining" type="date" />
        <Field label="Designation *" name="designation" options={designations} />
        <Field label="Department *" name="department" options={departments} />
        <Field label="Employment Type" name="employmentType" options={["Full-Time", "Part-Time", "Hourly-Based"]} />
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">Eligible Leaves</label>
          <input
            type="number"
            name="eligibleLeaves"
            value={form.eligibleLeaves}
            onChange={handleChange}
            min={0}
            className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
          />
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
          {isEdit ? "Save Changes" : "Add Employee"}
        </button>
      </div>
    </div>
  );
};

export default EmployeeForm;
