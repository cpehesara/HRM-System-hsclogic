
const Badge = ({ status }) => {
  const colors = {
    Active: "bg-green-100 text-green-700",
    Inactive: "bg-red-100 text-red-700",
    Present: "bg-green-100 text-green-700",
    Absent: "bg-red-100 text-red-700",
    Late: "bg-yellow-100 text-yellow-700",
    "Half Day": "bg-orange-100 text-orange-700",
    Leave: "bg-blue-100 text-blue-700",
    Applied: "bg-gray-100 text-gray-700",
    Shortlisted: "bg-blue-100 text-blue-700",
    "Interview Scheduled": "bg-purple-100 text-purple-700",
    Selected: "bg-green-100 text-green-700",
    Rejected: "bg-red-100 text-red-700",
    "Full-Time": "bg-blue-100 text-blue-700",
    "Part-Time": "bg-yellow-100 text-yellow-700",
    "Hourly-Based": "bg-orange-100 text-orange-700",
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[status] || "bg-gray-100 text-gray-600"}`}>
      {status}
    </span>
  );
};

export default Badge;