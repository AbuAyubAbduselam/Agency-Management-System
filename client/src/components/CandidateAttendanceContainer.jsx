import Wrapper from "../assets/wrappers/CandidatesContainer";
import { UseAllCandidatesAttendanceContext } from "../pages/CandidateAttendance";
import Attendance from "./Attendance";
import PageBtnContainer2 from "./PageBtnContainer2";
import { useEffect, useState } from "react";
import { Button } from "antd";
import { toast } from "react-toastify";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import day from "dayjs";

const CandidateAttendanceContainer = () => {
  const { data } = UseAllCandidatesAttendanceContext();
  const { selectedCandidates, totalSelectedCandidates, numOfPages } = data;

  const [selectedCandidateIds, setSelectedCandidateIds] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const handleCheckboxChange = (id) => {
    setSelectedCandidateIds((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  const handleSelectAllChange = () => {
    if (selectAll) {
      setSelectedCandidateIds([]);
    } else {
      const currentIds = selectedCandidates.map((c) => c._id);
      setSelectedCandidateIds(currentIds);
    }
    setSelectAll(!selectAll);
  };

  useEffect(() => {
    const currentIds = selectedCandidates.map((c) => c._id);
    const allSelected = currentIds.every((id) =>
      selectedCandidateIds.includes(id)
    );
    setSelectAll(allSelected);
  }, [selectedCandidates, selectedCandidateIds]);

  const handleExportPDF = () => {
    const selected = selectedCandidates.filter((c) =>
      selectedCandidateIds.includes(c._id)
    );

    const doc = new jsPDF();
    autoTable(doc, {
      head: [
        [
          "No.",
          "Full Name",
          "Passport No.",
          "Labor ID",
          "Contract Date",
          "Medical",
          "Selected By",
          "Tasheer",
          "Wokala",
          "Visa",
          "Coc",
          "LMIS",
          "Ticket",
        ],
      ],
      body: selected.map((c, i) => [
        i + 1,
        `${c.firstName} ${c.middleName}`,
        c.passportNo,
        c.laborId,
        day(c.contractCreationDate).format("YYYY-MM-DD"),
        c.medicalStatus,
        c.selectedBy,
        c.tasheer,
        c.wokala,
        c.visaStatus,
        c.cocStatus,
        c.lmis,
        c.ticket,
      ]),
    });
    doc.save("attendance-candidates.pdf");
  };

  if (selectedCandidates.length === 0) {
    return (
      <Wrapper>
        <h2>No candidates to display...</h2>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <div className="flex justify-between mb-10">
        <h5 className="font-bold">
          {totalSelectedCandidates}{" "}
          {totalSelectedCandidates > 1 ? "candidates" : "candidate"} found
        </h5>
      </div>

      <div className="flex space-x-4 my-4">
        <Button
          onClick={handleExportPDF}
          disabled={selectedCandidateIds.length === 0}
        >
          Export Selected to PDF
        </Button>
      </div>

      <div className="candidates">
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>
                  <div className="flex items-center space-x-2 ">
                    <input
                      type="checkbox"
                      className="checkbox"
                      checked={selectAll}
                      onChange={handleSelectAllChange}
                    />
                    <span>({selectedCandidateIds.length})</span>
                  </div>
                </th>
                <th>Photo</th>
                <th>Full Name</th>
                <th>Passport No.</th>
                <th>Labor ID</th>
                <th>Contract Creation Date</th>
                <th>Medical Status</th>
                <th>Selected By</th>
                <th>Tasheer</th>
                <th>Tasheer Date</th>
                <th>Wokala</th>
                <th>Visa Status</th>
                <th>Coc Status</th>
                <th>LMIS</th>
                <th>Ticket</th>
                <th>Ticket Date</th>
                <th>Edit</th>
              </tr>
            </thead>

            {selectedCandidates.map((candidate) => (
              <Attendance
                key={candidate._id}
                {...candidate}
                isSelected={selectedCandidateIds.includes(candidate._id)}
                onCheckboxChange={handleCheckboxChange}
              />
            ))}

            <tfoot>
              <tr>
                <th></th>
                <th>Photo</th>
                <th>Full Name</th>
                <th>Passport No.</th>
                <th>Labor ID</th>
                <th>Contract Creation Date</th>
                <th>Medical Status</th>
                <th>Selected By</th>
                <th>Tasheer</th>
                <th>Tasheer Date</th>
                <th>Wokala</th>
                <th>Visa Status</th>
                <th>Coc Status</th>
                <th>LMIS</th>
                <th>Ticket</th>
                <th>Ticket Date</th>
                <th>Edit</th>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {numOfPages > 1 && <PageBtnContainer2 />}
    </Wrapper>
  );
};

export default CandidateAttendanceContainer;
