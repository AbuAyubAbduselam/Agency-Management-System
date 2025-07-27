// components/StatusFilter.jsx
const statusOptions = {
    cvStatus:["done", "waiting"],
    cocStatus: ["done", "waiting", "booked"],
    experienceOutside: ["yes", "no"],
    musanedStatus: ["done", "waiting", "pending-release"],
    medicalStatus: ["fit", "unfit", "waiting", "booked"],
    availabilityStatus: ["available", "selected", "unavailable"],
    visaStatus: ["ready for embassy", "sent to embassy", "visa issued", "visa canceled", "arrived ksa"],
    lmis: ["draft", "pending", "issued", "rejected"],
    tasheer: ["waiting", "booked", "done"],
    wokala: ["waiting tasdeeq", "waiting", "done"],
    ticket: ["waiting", "booked", "done"],  
    cvSentTo: ["A", "B", "C", " "],
    selectedBy: ["A", "B", "C",],
    religion: ["muslim", "non-muslim",],

  };
  
  const StatusFilter = ({ field, value, onChange }) => {
    return (
      <div className="mb-2 mr-4 bg-white p-4 rounded-lg shadow-md">
        <label className="block text-sm font-medium capitalize mb-1">
          {field.replace("Status", "")}
        </label>
        <select
          className="select select-bordered w-full max-w-xs bg-yellow-50"
          value={value}
          onChange={(e) => onChange(field, e.target.value)}
        >
          <option value="">All</option>
          {statusOptions[field].map((option) => (
            <option key={option} value={option}>
              {option[0].toUpperCase() + option.slice(1)}
            </option>
          ))}
        </select>
      </div>
    );
  };
  
  export default StatusFilter;
  