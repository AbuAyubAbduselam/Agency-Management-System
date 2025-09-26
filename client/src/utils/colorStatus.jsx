// colorStatus.jsx
import { statusOptions } from "./constants";

// Define color mappings for each status type + value
const baseStatusColors = {
  medicalStatus: {
    Fit: "bg-[#1DCD9F] text-black",
    Unfit: "bg-[#F7374F] text-white",
    Booked: "bg-[#FFF085] text-black",
    Waiting: "bg-[#799EFF] text-white",
    "In Progress": "bg-blue-400 text-white",
    Expired: "bg-gray-400 text-black",
  },
  cocStatus: {
    Done: "bg-green-500 text-white",
    Waiting: "bg-yellow-400 text-black",
    Booked: "bg-blue-400 text-white",
  },
  musanedStatus: {
    Done: "bg-green-600 text-white",
    Waiting: "bg-yellow-300 text-black",
    "Pending release": "bg-orange-500 text-white",
  },
  cvStatus: {
    Done: "bg-green-500 text-white",
    Waiting: "bg-yellow-300 text-black",
  },
  availabilityStatus: {
    Available: "bg-blue-500 text-white",
    Selected: "bg-purple-500 text-white",
    Unavailable: "bg-gray-400 text-white",
  },
  visaStatus: {
    "Ready for embassy": "bg-blue-500 text-white",
    "Sent to Embassy": "bg-yellow-400 text-black",
    "Visa issued": "bg-green-500 text-white",
    "Visa canceled": "bg-red-500 text-white",
    "Arrived ksa": "bg-teal-500 text-white",
  },
  lmis: {
    Draft: "bg-gray-300 text-black",
    Pending: "bg-yellow-400 text-black",
    Issued: "bg-green-500 text-white",
    Rejected: "bg-red-500 text-white",
  },
  tasheer: {
    Waiting: "bg-yellow-300 text-black",
    Booked: "bg-blue-500 text-white",
    Done: "bg-green-500 text-white",
    Ready: "bg-purple-400 text-white",
  },
  wokala: {
    "Waiting tasdeeq": "bg-yellow-300 text-black",
    Waiting: "bg-yellow-400 text-black",
    Done: "bg-green-500 text-white",
  },
  ticket: {
    Waiting: "bg-yellow-300 text-black",
    Booked: "bg-blue-500 text-white",
    Done: "bg-green-500 text-white",
  },
  cvSentTo: {
    "Saraya Al-riyadh Recruitmen": "bg-[#3E0703] text-white",
    "Quick Ticket for Recruitment": "bg-[#154D71] text-white",
    "Speed Recruitment": "bg-[#33A1E0] text-white",
  },
  selectedBy: {
    "Saraya Al-riyadh Recruitmen": "bg-[#3E0703] text-white",
    "Quick Ticket for Recruitment": "bg-[#154D71] text-white",
    "Speed Recruitment": "bg-[#33A1E0] text-white",
  },
  qrCode: {
    Waiting: "bg-yellow-300 text-black",
    Printed: "bg-green-500 text-white",
  },
};

// Dynamically build the color map based on constants.js
export const statusColorMap = Object.keys(statusOptions).reduce(
  (acc, key) => {
    acc[key] = statusOptions[key].reduce((innerAcc, opt) => {
      if (opt.value) {
        innerAcc[opt.value] =
          baseStatusColors[key]?.[opt.value] || "bg-gray-200 text-black";
      }
      return innerAcc;
    }, {});
    return acc;
  },
  {}
);

export const renderStatus = (type, value) => {
  const statusClass =
    statusColorMap[type]?.[value] || "bg-gray-200 text-black";
  return (
    <span
      className={`px-3 py-1 rounded-md font-semibold text-center inline-block min-w-[70px] ${statusClass}`}
    >
      {value}
    </span>
  );
};
