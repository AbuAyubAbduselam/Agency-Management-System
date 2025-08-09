export const statusColorMap = {
    medicalStatus: {
      fit: "bg-[#1DCD9F] text-black",
      unfit: "bg-[#F7374F] text-white",
      booked: "bg-[#FFF085] text-black",
      waiting: "bg-[#799EFF] text-white",
    },
    cocStatus: {
      done: "bg-green-500 text-white",
      waiting: "bg-yellow-400 text-black",
      booked: "bg-blue-400 text-white",
    },
    musanedStatus: {
      done: "bg-green-600 text-white",
      waiting: "bg-yellow-300 text-black",
      "pending-release": "bg-orange-500 text-white",
    },
    cvStatus: {
      done: "bg-green-500 text-white",
      waiting: "bg-yellow-300 text-black",
    },
    availabilityStatus: {
      available: "bg-blue-500 text-white",
      selected: "bg-purple-500 text-white",
      unavailable: "bg-gray-400 text-white",
    },
    visaStatus: {
      "ready for embassy": "bg-blue-500 text-white",
      "sent to embassy": "bg-yellow-400 text-black",
      "visa issued": "bg-green-500 text-white",
      "visa canceled": "bg-red-500 text-white",
      "arrived ksa": "bg-teal-500 text-white",
    },
    lmis: {
      draft: "bg-gray-300 text-black",
      pending: "bg-yellow-400 text-black",
      issued: "bg-green-500 text-white",
      rejected: "bg-red-500 text-white",
    },
    tasheer: {
      waiting: "bg-yellow-300 text-black",
      booked: "bg-blue-500 text-white",
      done: "bg-green-500 text-white",
    },
    wokala: {
      "waiting tasdeeq": "bg-yellow-300 text-black",
      waiting: "bg-yellow-400 text-black",
      done: "bg-green-500 text-white",
    },
    ticket: {
      waiting: "bg-yellow-300 text-black",
      booked: "bg-blue-500 text-white",
      done: "bg-green-500 text-white",
    },
    cvSentTo: {
      "SARAYA AL-RIYADH RECRUITMENT": "bg-blue-500 text-white",
      "QUICK TICKET FOR RECUITMENT": "bg-green-500 text-white",
      " ": "bg-gray-300 text-black",
    },
    selectedBy: {
      "A": "bg-blue-500 text-white",
      "B": "bg-green-500 text-white",
      "C": "bg-yellow-500 text-black",
      " ": "bg-gray-300 text-black",
    },
  };

  export const renderStatus = (type, value) => {
    const statusClass =
      statusColorMap[type]?.[value?.toLowerCase()] || "bg-gray-200 text-black";
    return (
      <span
        className={`px-3 py-1 rounded-md font-semibold text-center inline-block min-w-[70px] ${statusClass}`}
      >
        {value}
      </span>
    );
  };