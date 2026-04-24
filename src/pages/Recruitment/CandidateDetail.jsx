
import Badge from "../../components/common/Badge";
import { MdPerson, MdEmail, MdPhone, MdWork, MdCalendarToday, MdDescription, MdNotes } from "react-icons/md";

const Row = ({ icon, label, value }) => (
  <div className="flex items-start gap-3 py-3 border-b border-gray-50 last:border-0">
    <div className="text-purple-500 mt-0.5">{icon}</div>
    <div>
      <p className="text-xs text-gray-400 font-medium">{label}</p>
      <p className="text-sm text-gray-800 font-medium mt-0.5">{value || "—"}</p>
    </div>
  </div>
);

const CandidateDetail = ({ candidate }) => {
  if (!candidate) return null;
  return (
    <div>
      <div className="flex items-center gap-4 mb-6 pb-5 border-b border-gray-100">
        <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
          {candidate.candidateName.charAt(0)}
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-800">{candidate.candidateName}</h3>
          <p className="text-sm text-gray-500">{candidate.appliedPosition}</p>
          <div className="mt-1">
            <Badge status={candidate.status} />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
        <Row icon={<MdPerson size={16} />} label="Candidate ID" value={candidate.id} />
        <Row icon={<MdEmail size={16} />} label="Email" value={candidate.email} />
        <Row icon={<MdPhone size={16} />} label="Contact" value={candidate.contact} />
        <Row icon={<MdCalendarToday size={16} />} label="Application Date" value={candidate.applicationDate} />
        <Row icon={<MdWork size={16} />} label="Applied Position" value={candidate.appliedPosition} />
        <Row icon={<MdDescription size={16} />} label="Resume Reference" value={candidate.resumeReference} />
      </div>
      <Row icon={<MdNotes size={16} />} label="Remarks" value={candidate.remarks} />
    </div>
  );
};

export default CandidateDetail;