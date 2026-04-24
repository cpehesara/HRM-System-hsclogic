import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  addEmployee,
  updateEmployee,
  deactivateEmployee,
  activateEmployee,
} from "../../store/slices/employeeSlice";
import Modal from "../../components/common/Modal";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import Badge from "../../components/common/Badge";
import EmployeeForm from "./EmployeeForm";
import EmployeeDetail from "./EmployeeDetail";
import {
  MdAdd, MdEdit, MdVisibility, MdPersonOff, MdPerson, MdSearch,
} from "react-icons/md";

const Employees = () => {
  const dispatch = useDispatch();
  const { employees } = useSelector((state) => state.employees);
  const { currentUser } = useSelector((state) => state.auth);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedEmp, setSelectedEmp] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterDept, setFilterDept] = useState("All");

  const canEdit = currentUser.role === "Admin" || currentUser.role === "HR Staff";

  const generateId = () => {
    const max = employees.reduce((acc, e) => {
      const num = parseInt(e.id.replace("EMP", ""));
      return num > acc ? num : acc;
    }, 0);
    return `EMP${String(max + 1).padStart(3, "0")}`;
  };

  const filtered = employees.filter((e) => {
    const matchSearch =
      e.fullName.toLowerCase().includes(search.toLowerCase()) ||
      e.id.toLowerCase().includes(search.toLowerCase()) ||
      e.designation.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "All" || e.status === filterStatus;
    const matchDept = filterDept === "All" || e.department === filterDept;
    return matchSearch && matchStatus && matchDept;
  });

  const departments = [...new Set(employees.map((e) => e.department))];

  const handleAdd = (formData) => {
    dispatch(addEmployee({ ...formData, id: generateId() }));
    setShowAddModal(false);
  };

  const handleEdit = (formData) => {
    dispatch(updateEmployee(formData));
    setShowEditModal(false);
  };

  const handleConfirmAction = () => {
    if (confirmAction === "deactivate") dispatch(deactivateEmployee(selectedEmp.id));
    if (confirmAction === "activate") dispatch(activateEmployee(selectedEmp.id));
  };

  return (
    <div className="space-y-5">

      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Employees</h2>
          <p className="text-sm text-gray-500">{employees.length} total employees registered</p>
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
            Add Employee
          </button>
        )}
      </div>

      {/* ── Search & Filters ── */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by name, ID or designation..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2"
            style={{ "--tw-ring-color": "#22c55e" }}
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none"
        >
          <option value="All">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
        <select
          value={filterDept}
          onChange={(e) => setFilterDept(e.target.value)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none"
        >
          <option value="All">All Departments</option>
          {departments.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      {/* ── Employee Table ── */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: "#1E1E1E" }}>
                <th className="text-left px-5 py-3 text-xs font-semibold uppercase text-white">Employee</th>
                <th className="text-left px-5 py-3 text-xs font-semibold uppercase text-white">Department</th>
                <th className="text-left px-5 py-3 text-xs font-semibold uppercase text-white">Type</th>
                <th className="text-left px-5 py-3 text-xs font-semibold uppercase text-white">Joined</th>
                <th className="text-left px-5 py-3 text-xs font-semibold uppercase text-white">Status</th>
                <th className="text-left px-5 py-3 text-xs font-semibold uppercase text-white">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-400">
                    No employees found matching your search.
                  </td>
                </tr>
              ) : (
                filtered.map((emp) => (
                  <tr key={emp.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                          style={{ backgroundColor: "#1E1E1E" }}>
                          <span className="text-white font-semibold text-sm">{emp.fullName.charAt(0)}</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{emp.fullName}</p>
                          <p className="text-xs text-gray-400">{emp.id} · {emp.designation}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-gray-600">{emp.department}</td>
                    <td className="px-5 py-3.5"><Badge status={emp.employmentType} /></td>
                    <td className="px-5 py-3.5 text-gray-600">{emp.dateOfJoining}</td>
                    <td className="px-5 py-3.5"><Badge status={emp.status} /></td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => { setSelectedEmp(emp); setShowViewModal(true); }}
                          className="p-1.5 rounded-lg hover:bg-gray-100"
                          style={{ color: "#22c55e" }}
                          title="View"
                        >
                          <MdVisibility size={17} />
                        </button>
                        {canEdit && (
                          <button
                            onClick={() => { setSelectedEmp(emp); setShowEditModal(true); }}
                            className="p-1.5 rounded-lg hover:bg-yellow-50 text-yellow-600"
                            title="Edit"
                          >
                            <MdEdit size={17} />
                          </button>
                        )}
                        {canEdit && (
                          emp.status === "Active" ? (
                            <button
                              onClick={() => { setSelectedEmp(emp); setConfirmAction("deactivate"); setShowConfirm(true); }}
                              className="p-1.5 rounded-lg hover:bg-red-50 text-red-500"
                              title="Deactivate"
                            >
                              <MdPersonOff size={17} />
                            </button>
                          ) : (
                            <button
                              onClick={() => { setSelectedEmp(emp); setConfirmAction("activate"); setShowConfirm(true); }}
                              className="p-1.5 rounded-lg hover:bg-green-50"
                              style={{ color: "#22c55e" }}
                              title="Activate"
                            >
                              <MdPerson size={17} />
                            </button>
                          )
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Modals ── */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add New Employee" size="lg">
        <EmployeeForm onSave={handleAdd} onCancel={() => setShowAddModal(false)} isEdit={false} />
      </Modal>

      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Edit Employee" size="lg">
        <EmployeeForm initial={selectedEmp} onSave={handleEdit} onCancel={() => setShowEditModal(false)} isEdit={true} />
      </Modal>

      <Modal isOpen={showViewModal} onClose={() => setShowViewModal(false)} title="Employee Details" size="lg">
        <EmployeeDetail employee={selectedEmp} />
      </Modal>

      <ConfirmDialog
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleConfirmAction}
        title={confirmAction === "deactivate" ? "Deactivate Employee" : "Activate Employee"}
        message={
          confirmAction === "deactivate"
            ? `Are you sure you want to deactivate ${selectedEmp?.fullName}?`
            : `Are you sure you want to reactivate ${selectedEmp?.fullName}?`
        }
        confirmLabel={confirmAction === "deactivate" ? "Deactivate" : "Activate"}
        confirmColor={confirmAction === "deactivate" ? "red" : "green"}
      />
    </div>
  );
};

export default Employees;