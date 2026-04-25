
import { useState, useEffect } from "react";
import { recruitmentStatuses } from "../../data/mockData";

const emptyForm = {
  candidateName: "",
  contact: "",
  email: "",
  appliedPosition: "",
  applicationDate: "",
  resumeReference: "",
  remarks: "",
  status: "Applied",
};

const RecruitmentForm = ({ initial, onSave, onCancel, isEdit }) => {
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
    if (!form.candidateName.trim()) newErrors.candidateName = "Candidate name is required";
    if (!form.contact.trim()) newErrors.contact = "Contact is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = "Invalid email format";
    if (!form.appliedPosition.trim()) newErrors.appliedPosition = "Applied position is required";
    if (!form.applicationDate) newErrors.applicationDate = "Application date is required";
    return newErrors;
  };

  const handleSubmit = () => {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }
    onSave(form);
  };

  const Field = ({ label, name, type = "text", options, textarea }) => (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1">{label}</label>
      {textarea ? (
        <textarea
          name={name}
          value={form[name]}
          onChange={handleChange}
          rows={3}
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
        />
      ) : options ? (
        <select
          name={name}
          value={form[name]}
          onChange={handleChange}
          className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500
            ${errors[name] ? "border-red-400" : "border-gray-200"}`}
        >
          {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : (
        <input
          type={type}
          name={name}
          value={form[name]}
          onChange={handleChange}
          className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500
            ${errors[name] ? "border-red-400" : "border-gray-200"}`}
        />
      )}
      {errors[name] && <p className="text-red-500 text-xs mt-1">{errors[name]}</p>}
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Candidate Name *" name="candidateName" />
        <Field label="Email *" name="email" type="email" />
        <Field label="Contact *" name="contact" />
        <Field label="Application Date *" name="applicationDate" type="date" />
        <Field label="Applied Position *" name="appliedPosition" />
        <Field label="Resume Reference" name="resumeReference" />
        <Field label="Status" name="status" options={recruitmentStatuses} />
      </div>
      <Field label="Remarks" name="remarks" textarea />

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
          {isEdit ? "Save Changes" : "Add Candidate"}
        </button>
      </div>
    </div>
  );
};

export default RecruitmentForm;