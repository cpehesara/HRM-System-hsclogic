import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  addCandidate,
  updateCandidate,
  deleteCandidate,
  updateCandidateStatus,
} from "../../store/slices/recruitmentSlice";
import Modal from "../../components/common/Modal";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import Badge from "../../components/common/Badge";
import RecruitmentForm from "./RecruitmentForm";
import CandidateDetail from "./CandidateDetail";
import { useToast } from "../../context/ToastContext";
import { recruitmentStatuses } from "../../data/mockData";
import { MdAdd, MdEdit, MdVisibility, MdDelete, MdSearch, MdWork } from "react-icons/md";

const stageColors = {
  Applied:              { bg: "#f3f4f6", text: "#374151" },
  Shortlisted:          { bg: "#dbeafe", text: "#1d4ed8" },
  "Interview Scheduled":{ bg: "#ede9fe", text: "#7c3aed" },
  Selected:             { bg: "#dcfce7", text: "#15803d" },
  Rejected:             { bg: "#fee2e2", text: "#dc2626" },
};

const PipelineBar = ({ candidates }) => {
  const counts = recruitmentStatuses.reduce((acc, s) => {
    acc[s] = candidates.filter((c) => c.status === s).length;
    return acc;
  }, {});

  return (
    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 sm:gap-3">
      {recruitmentStatuses.map((s) => (
        <div
          key={s}
          className="rounded-xl p-3 sm:p-4 text-center"
          style={{ backgroundColor: stageColors[s].bg, color: stageColors[s].text }}
        >
          <p className="text-xl sm:text-2xl font-bold">{counts[s]}</p>
          <p className="text-xs font-medium mt-1 leading-tight">{s}</p>
        </div>
      ))}
    </div>
  );
};

const Recruitment = () => {
  const dispatch = useDispatch();
  const toast = useToast();
  const { candidates } = useSelector((state) => state.recruitment);
  const { currentUser } = useSelector((state) => state.auth);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedCan, setSelectedCan] = useState(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  const canEdit = currentUser.role === "Admin" || currentUser.role === "HR Staff";

  const generateId = () => {
    const max = candidates.reduce((acc, c) => {
      const num = parseInt(c.id.replace("CAN", ""));
      return num > acc ? num : acc;
    }, 0);
    return `CAN${String(max + 1).padStart(3, "0")}`;
  };

  const filtered = candidates.filter((c) => {
    const matchSearch =
      c.candidateName.toLowerCase().includes(search.toLowerCase()) ||
      c.appliedPosition.toLowerCase().includes(search.toLowerCase()) ||
      c.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "All" || c.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const handleAdd = (formData) => {
    dispatch(addCandidate({ ...formData, id: generateId() }));
    setShowAddModal(false);
    toast.success(`${formData.candidateName} has been added to the pipeline.`, "Candidate Added");
  };

  const handleEdit = (formData) => {
    dispatch(updateCandidate(formData));
    setShowEditModal(false);
    toast.success(`${formData.candidateName}'s record has been updated.`, "Candidate Updated");
  };

  const handleDelete = () => {
    const name = selectedCan?.candidateName;
    dispatch(deleteCandidate(selectedCan?.id));
    toast.info(`${name} has been removed from the pipeline.`, "Candidate Removed");
  };

  const handleStatusChange = (id, status, name) => {
    dispatch(updateCandidateStatus({ id, status }));
    toast.success(`${name} moved to "${status}".`, "Status Updated");
  };

  const openView = (can) => { setSelectedCan(can); setShowViewModal(true); };
  const openEdit = (can) => { setSelectedCan(can); setShowEditModal(true); };
  const openDelete = (can) => { setSelectedCan(can); setShowDeleteConfirm(true); };

  return (
    <div className="space-y-5">

      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Recruitment</h2>
          <p className="text-sm text-gray-500">{candidates.length} total candidates in pipeline</p>
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
            Add Candidate
          </button>
        )}
      </div>

      {/* ── Pipeline Summary ── */}
      <PipelineBar candidates={candidates} />

      {/* ── Search & Filter ── */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-col gap-3">
        <div className="relative">
          <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by name, position or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
        >
          <option value="All">All Status</option>
          {recruitmentStatuses.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* ── Mobile card list (xs / sm) ── */}
      <div className="md:hidden space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm py-16 flex flex-col items-center gap-2">
            <MdWork size={40} className="text-gray-200" />
            <p className="text-gray-400 font-medium text-sm text-center px-4">
              {search || filterStatus !== "All"
                ? "No candidates match your search."
                : "No candidates yet. Add your first candidate."}
            </p>
          </div>
        ) : (
          filtered.map((can) => (
            <div key={can.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                    style={{ backgroundColor: "#1E1E1E" }}
                  >
                    <span className="text-white font-semibold text-sm">{can.candidateName.charAt(0)}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-800 text-sm truncate">{can.candidateName}</p>
                    <p className="text-xs text-gray-400 truncate">{can.id} · {can.email}</p>
                    <p className="text-xs text-gray-500 truncate mt-0.5">{can.appliedPosition}</p>
                  </div>
                </div>
                <Badge status={can.status} />
              </div>

              <div className="mt-3 pt-3 border-t border-gray-50 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs text-gray-400">Applied: {can.applicationDate}</span>
                  {canEdit && (
                    <select
                      value={can.status}
                      onChange={(e) => handleStatusChange(can.id, e.target.value, can.candidateName)}
                      className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none bg-white focus:ring-2 focus:ring-green-500"
                    >
                      {recruitmentStatuses.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  )}
                </div>
                <div className="flex items-center justify-end gap-1">
                  <button
                    onClick={() => openView(can)}
                    className="p-2 rounded-lg hover:bg-gray-100 tap-target flex items-center justify-center"
                    style={{ color: "#22c55e" }}
                    aria-label="View"
                  >
                    <MdVisibility size={18} />
                  </button>
                  {canEdit && (
                    <>
                      <button
                        onClick={() => openEdit(can)}
                        className="p-2 rounded-lg hover:bg-yellow-50 text-yellow-600 tap-target flex items-center justify-center"
                        aria-label="Edit"
                      >
                        <MdEdit size={18} />
                      </button>
                      <button
                        onClick={() => openDelete(can)}
                        className="p-2 rounded-lg hover:bg-red-50 text-red-500 tap-target flex items-center justify-center"
                        aria-label="Delete"
                      >
                        <MdDelete size={18} />
                      </button>
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
                <th className="text-left px-5 py-3 text-xs font-semibold uppercase text-white">Candidate</th>
                <th className="text-left px-5 py-3 text-xs font-semibold uppercase text-white">Position</th>
                <th className="text-left px-5 py-3 text-xs font-semibold uppercase text-white">Applied Date</th>
                <th className="text-left px-5 py-3 text-xs font-semibold uppercase text-white">Status</th>
                {canEdit && (
                  <th className="text-left px-5 py-3 text-xs font-semibold uppercase text-white">Update Status</th>
                )}
                <th className="text-left px-5 py-3 text-xs font-semibold uppercase text-white">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={canEdit ? 6 : 5} className="text-center py-16">
                    <div className="flex flex-col items-center gap-2">
                      <MdWork size={40} className="text-gray-200" />
                      <p className="text-gray-400 font-medium text-sm">
                        {search || filterStatus !== "All"
                          ? "No candidates match your search."
                          : "No candidates yet. Add your first candidate."}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((can) => (
                  <tr key={can.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                          style={{ backgroundColor: "#1E1E1E" }}
                        >
                          <span className="text-white font-semibold text-sm">{can.candidateName.charAt(0)}</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{can.candidateName}</p>
                          <p className="text-xs text-gray-400">{can.id} · {can.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-gray-600">{can.appliedPosition}</td>
                    <td className="px-5 py-3.5 text-gray-600">{can.applicationDate}</td>
                    <td className="px-5 py-3.5"><Badge status={can.status} /></td>
                    {canEdit && (
                      <td className="px-5 py-3.5">
                        <select
                          value={can.status}
                          onChange={(e) => handleStatusChange(can.id, e.target.value, can.candidateName)}
                          className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none bg-white focus:ring-2 focus:ring-green-500"
                        >
                          {recruitmentStatuses.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </td>
                    )}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openView(can)}
                          className="p-1.5 rounded-lg hover:bg-gray-100"
                          style={{ color: "#22c55e" }}
                          title="View"
                        >
                          <MdVisibility size={17} />
                        </button>
                        {canEdit && (
                          <>
                            <button
                              onClick={() => openEdit(can)}
                              className="p-1.5 rounded-lg hover:bg-yellow-50 text-yellow-600"
                              title="Edit"
                            >
                              <MdEdit size={17} />
                            </button>
                            <button
                              onClick={() => openDelete(can)}
                              className="p-1.5 rounded-lg hover:bg-red-50 text-red-500"
                              title="Delete"
                            >
                              <MdDelete size={17} />
                            </button>
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
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add New Candidate" size="lg">
        <RecruitmentForm onSave={handleAdd} onCancel={() => setShowAddModal(false)} isEdit={false} />
      </Modal>

      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Edit Candidate" size="lg">
        <RecruitmentForm
          initial={selectedCan}
          onSave={handleEdit}
          onCancel={() => setShowEditModal(false)}
          isEdit={true}
        />
      </Modal>

      <Modal isOpen={showViewModal} onClose={() => setShowViewModal(false)} title="Candidate Details" size="lg">
        <CandidateDetail candidate={selectedCan} />
      </Modal>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Remove Candidate"
        message={`Are you sure you want to remove ${selectedCan?.candidateName} from the pipeline? This cannot be undone.`}
        confirmLabel="Remove"
        confirmColor="red"
      />
    </div>
  );
};

export default Recruitment;
