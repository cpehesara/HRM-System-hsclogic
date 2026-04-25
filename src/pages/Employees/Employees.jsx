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
import { useToast } from "../../context/ToastContext";
import {
  MdAdd, MdEdit, MdVisibility, MdPersonOff, MdPerson, MdSearch, MdPeople,
} from "react-icons/md";

const Employees = () => {
  const dispatch = useDispatch();
  const toast = useToast();
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
    const id = generateId();
    dispatch(addEmployee({ ...formData, id }));
    setShowAddModal(false);
    toast.success(`${formData.fullName} has been added successfully.`, "Employee Added");
  };

  const handleEdit = (formData) => {
    dispatch(updateEmployee(formData));
    setShowEditModal(false);
    toast.success(`${formData.fullName}'s record has been updated.`, "Employee Updated");
  };

  const handleConfirmAction = () => {
    if (confirmAction === "deactivate") {
      dispatch(deactivateEmployee(selectedEmp.id));
      toast.info(`${selectedEmp.fullName} has been deactivated.`, "Employee Deactivated");
    }
    if (confirmAction === "activate") {
      dispatch(activateEmployee(selectedEmp.id));
      toast.success(`${selectedEmp.fullName} has been reactivated.`, "Employee Activated");
    }
  };

  const openView = (emp) => { setSelectedEmp(emp); setShowViewModal(true); };
  const openEdit = (emp) => { setSelectedEmp(emp); setShowEditModal(true); };
  const openToggle = (emp, action) => { setSelectedEmp(emp); setConfirmAction(action); setShowConfirm(true); };

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
            className="flex items-center gap-2 px-4 py-2.5 text-white text-sm font-semibold rounded-xl tap-target"
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
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-col gap-3">
        <div className="relative">
          <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by name, ID or designation..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div className="flex gap-3">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
          <select
            value={filterDept}
            onChange={(e) => setFilterDept(e.target.value)}
            className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
          >
            <option value="All">All Depts</option>
            {departments.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
      </div>

      {/* ── Mobile card list (xs / sm) ── */}
      <div className="md:hidden space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm py-16 flex flex-col items-center gap-2">
            <MdPeople size={40} className="text-gray-200" />
            <p className="text-gray-400 font-medium text-sm text-center px-4">
              {search || filterStatus !== "All" || filterDept !== "All"
                ? "No employees match your search."
                : "No employees yet. Add your first employee."}
            </p>
          </div>
        ) : (
          filtered.map((emp) => (
            <div key={emp.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                    style={{ backgroundColor: "#1E1E1E" }}
                  >
                    <span className="text-white font-semibold text-sm">{emp.fullName.charAt(0)}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-800 text-sm truncate">{emp.fullName}</p>
                    <p className="text-xs text-gray-400 truncate">{emp.id} · {emp.designation}</p>
                    <p className="text-xs text-gray-500 truncate mt-0.5">{emp.department}</p>
                  </div>
                </div>
                <Badge status={emp.status} />
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
                <div className="flex items-center gap-1.5">
                  <Badge status={emp.employmentType} />
                  <span className="text-xs text-gray-400">· {emp.dateOfJoining}</span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openView(emp)}
                    className="p-2 rounded-lg hover:bg-gray-100 tap-target flex items-center justify-center"
                    style={{ color: "#22c55e" }}
                    aria-label="View"
                  >
                    <MdVisibility size={18} />
                  </button>
                  {canEdit && (
                    <>
                      <button
                        onClick={() => openEdit(emp)}
                        className="p-2 rounded-lg hover:bg-yellow-50 text-yellow-600 tap-target flex items-center justify-center"
                        aria-label="Edit"
                      >
                        <MdEdit size={18} />
                      </button>
                      {emp.status === "Active" ? (
                        <button
                          onClick={() => openToggle(emp, "deactivate")}
                          className="p-2 rounded-lg hover:bg-red-50 text-red-500 tap-target flex items-center justify-center"
                          aria-label="Deactivate"
                        >
                          <MdPersonOff size={18} />
                        </button>
                      ) : (
                        <button
                          onClick={() => openToggle(emp, "activate")}
                          className="p-2 rounded-lg hover:bg-green-50 tap-target flex items-center justify-center"
                          style={{ color: "#22c55e" }}
                          aria-label="Activate"
                        >
                          <MdPerson size={18} />
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ── Desktop table (md+) ── */}
      <div className="hidden md:block bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
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
                  <td colSpan={6} className="text-center py-16">
                    <div className="flex flex-col items-center gap-2">
                      <MdPeople size={40} className="text-gray-200" />
                      <p className="text-gray-400 font-medium text-sm">
                        {search || filterStatus !== "All" || filterDept !== "All"
                          ? "No employees match your search."
                          : "No employees yet. Add your first employee."}
                      </p>
                    </div>
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
                          onClick={() => openView(emp)}
                          className="p-1.5 rounded-lg hover:bg-gray-100"
                          style={{ color: "#22c55e" }}
                          title="View"
                        >
                          <MdVisibility size={17} />
                        </button>
                        {canEdit && (
                          <>
                            <button
                              onClick={() => openEdit(emp)}
                              className="p-1.5 rounded-lg hover:bg-yellow-50 text-yellow-600"
                              title="Edit"
                            >
                              <MdEdit size={17} />
                            </button>
                            {emp.status === "Active" ? (
                              <button
                                onClick={() => openToggle(emp, "deactivate")}
                                className="p-1.5 rounded-lg hover:bg-red-50 text-red-500"
                                title="Deactivate"
                              >
                                <MdPersonOff size={17} />
                              </button>
                            ) : (
                              <button
                                onClick={() => openToggle(emp, "activate")}
                                className="p-1.5 rounded-lg hover:bg-green-50"
                                style={{ color: "#22c55e" }}
                                title="Activate"
                              >
                                <MdPerson size={17} />
                              </button>
                            )}
                          </>
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
            ? `Are you sure you want to deactivate ${selectedEmp?.fullName}? They will be marked as inactive.`
            : `Are you sure you want to reactivate ${selectedEmp?.fullName}?`
        }
        confirmLabel={confirmAction === "deactivate" ? "Deactivate" : "Activate"}
        confirmColor={confirmAction === "deactivate" ? "red" : "green"}
      />
    </div>
  );
};

export default Employees;
