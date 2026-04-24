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
import { recruitmentStatuses } from "../../data/mockData";
import { MdAdd, MdEdit, MdVisibility, MdDelete, MdSearch } from "react-icons/md";

const PipelineBar = ({ candidates }) => {
  const counts = recruitmentStatuses.reduce((acc, s) => {
    acc[s] = candidates.filter((c) => c.status === s).length;
    return acc;
  }, {});

  const colors = {
    Applied: { bg: "#f3f4f6", text: "#374151" },
    Shortlisted: { bg: "#dbeafe", text: "#1d4ed8" },
    "Interview Scheduled": { bg: "#ede9fe", text: "#7c3aed" },
    Selected: { bg: "#dcfce7", text: "#15803d" },
    Rejected: { bg: "#fee2e2", text: "#dc2626" },
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
      {recruitmentStatuses.map((s) => (
        <div key={s} className="rounded-xl p-4 text-center"
          style={{ backgroundColor: colors[s].bg, color: colors[s].text }}>
          <p className="text-2xl font-bold">{counts[s]}</p>
          <p className="text-xs font-medium mt-1">{s}</p>
        </div>
      ))}
    </div>
  );
};

const Recruitment = () => {
  const dispatch = useDispatch();
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
  };

  const handleEdit = (formData) => {
    dispatch(updateCandidate(formData));
    setShowEditModal(false);
  };

  const handleStatusChange = (id, status) => {
    dispatch(updateCandidateStatus({ id, status }));
  };

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
            className="flex items-center gap-2 px-4 py-2 text-white text-sm font-medium rounded-lg"
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
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by name, position or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none"
        >
          <option value="All">All Status</option>
          {recruitmentStatuses.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* ── Candidates Table ── */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: "#1E1E1E" }}>
                <th className="text-left px-5 py-3 text-xs font-semibold uppercase text-white">Candidate</th>
                <th className="text-left px-5 py-3 text-xs font-semibold uppercase text-white">Position</th>
                <th className="text-left px-5 py-3 text-xs font-semibold uppercase text-white">Applied Date</th>
                <th className="text-left px-5 py-3 text-xs font-semibold uppercase text-white">Status</th>
                <th className="text-left px-5 py-3 text-xs font-semibold uppercase text-white">Update Status</th>
                <th className="text-left px-5 py-3 text-xs font-semibold uppercase text-white">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-400">
                    No candidates found.
                  </td>
                </tr>
              ) : (
                filtered.map((can) => (
                  <tr key={can.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                          style={{ backgroundColor: "#1E1E1E" }}>
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
                    <td className="px-5 py-3.5">
                      {canEdit ? (
                        <select
                          value={can.status}
                          onChange={(e) => handleStatusChange(can.id, e.target.value)}
                          className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none bg-white"
                        >
                          {recruitmentStatuses.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                      ) : (
                        <span className="text-xs text-gray-400">No access</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => { setSelectedCan(can); setShowViewModal(true); }}
                          className="p-1.5 rounded-lg hover:bg-gray-100"
                          style={{ color: "#22c55e" }}
                          title="View"
                        >
                          <MdVisibility size={17} />
                        </button>
                        {canEdit && (
                          <>
                            <button
                              onClick={() => { setSelectedCan(can); setShowEditModal(true); }}
                              className="p-1.5 rounded-lg hover:bg-yellow-50 text-yellow-600"
                              title="Edit"
                            >
                              <MdEdit size={17} />
                            </button>
                            <button
                              onClick={() => { setSelectedCan(can); setShowDeleteConfirm(true); }}
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

      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Edit Candidate" size