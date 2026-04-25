
import Badge from "../../components/common/Badge";
import { MdPerson, MdEmail, MdPhone, MdCalendarToday, MdWork, MdBusiness } from "react-icons/md";

const Row = ({ icon, label, value }) => (
  <div className="flex items-start gap-3 py-3 border-b border-gray-50 last:border-0">
    <div className="mt-0.5" style={{ color: "#22c55e" }}>{icon}</div>
    <div>
      <p className="text-xs text-gray-400 font-medium">{label}</p>
      <p className="text-sm text-gray-800 font-medium mt-0.5">{value || "—"}</p>
    </div>
  </div>
);

const EmployeeDetail = ({ employee }) => {
  if (!employee) return null;
  return (
    <div>
      {/* Avatar + name header */}
      <div className="flex items-center gap-4 mb-6 pb-5 border-b border-gray-100">
        <div className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold"
          style={{ backgroundColor: "#1E1E1E" }}>
          {employee.fullName.charAt(0)}
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-800">{employee.fullName}</h3>
          <p className="text-sm text-gray-500">{employee.designation} · {employee.department}</p>
          <div className="mt-1 flex gap-2">
            <Badge status={employee.status} />
            <Badge status={employee.employmentType} />
          </div>
        </div>
      </div>

      {/* Details grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
        <Row icon={<MdPerson size={16} />} label="Employee ID" value={employee.id} />
        <Row icon={<MdEmail size={16} />} label="Email" value={employee.email} />
        <Row icon={<MdPhone size={16} />} label="Contact" value={employee.contact} />
        <Row icon={<MdCalendarToday size={16} />} label="Date of Joining" value={employee.dateOfJoining} />
        <Row icon={<MdWork size={16} />} label="Employment Type" value={employee.employmentType} />
        <Row icon={<MdBusiness size={16} />} label="Department" value={employee.department} />
        <Row icon={<MdCalendarToday size={16} />} label="Eligible Leaves" value={`${employee.eligibleLeaves} days`} />
        <Row icon={<MdWork size={16} />} label="Status" value={<Badge status={employee.status} />} />
      </div>
    </div>
  );
};

export default EmployeeDetail;