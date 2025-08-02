import { useRef, useState, useEffect } from "react";
import Candidate from "./Candidate";
import Wrapper from "../assets/wrappers/CandidatesContainer";
import { useAllCandidatesContext } from "../pages/AllCandidates";
import PageBtnContainer from "./PageBtnContainer";
import { AddCandidate } from "../pages";
import { PlusOutlined, CloseOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { toast } from "react-toastify";
import customFetch from "../utils/customFetch";
import { exportCandidatesTableToPDF, exportCandidateCVs } from "./ExportActions";
import { PDFDownloadLink } from "@react-pdf/renderer";

const fieldOptions = [
  { key: "Full Name", label: "Full Name" },
  { key: "gender", label: "Gender" },
  { key: "age", label: "Age" },
  { key: "passportNo", label: "Passport No." },
  { key: "phoneNo", label: "Phone No." },
  { key: "narrativePhoneNo", label: "Narrative Phone" },
  { key: "religion", label: "Religion" },
  { key: "laborId", label: "Labor ID" },
  { key: "cvStatus", label: "CV Status" },
  { key: "cvSentTo", label: "CV Sent To" },
  { key: "cocStatus", label: "COC Status" },
  { key: "musanedStatus", label: "Musaned Status" },
  { key: "medicalStatus", label: "Medical Status" },
  { key: "medicalDate", label: "Medical Days" },
  { key: "experienceOutside", label: "Experience Outside" },
  { key: "availabilityStatus", label: "Availability Status" },
];

const CandidatesContainer = () => {
  const { data } = useAllCandidatesContext();
  const { candidates, totalCandidates, numOfPages } = data;

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedCandidateIds, setSelectedCandidateIds] = useState(() => {
    const saved = localStorage.getItem("selectedCandidateIds");
    return saved ? JSON.parse(saved) : [];
  });

  const [selectedFields, setSelectedFields] = useState([
    "Full Name", "gender", "passportNo"
  ]);

  const [selectAll, setSelectAll] = useState(false);
  const modalRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("selectedCandidateIds", JSON.stringify(selectedCandidateIds));
  }, [selectedCandidateIds]);

  const toggleField = (key) => {
    setSelectedFields((prev) =>
      prev.includes(key) ? prev.filter((f) => f !== key) : [...prev, key]
    );
  };

  const fetchAllCandidates = async () => {
    const response = await customFetch.get("/candidates?limit=1000&page=1");
    return response.data.candidates;
  };

  const handleExportPDF = async () => {
    const allCandidates = await fetchAllCandidates();
    const selected = allCandidates.filter((c) => selectedCandidateIds.includes(c._id));
    exportCandidatesTableToPDF(selected, selectedFields);
  };

  const handleDeleteSelected = async () => {
    try {
      await Promise.all(
        selectedCandidateIds.map((id) =>
          fetch(`/api/candidates/${id}`, { method: "DELETE" })
        )
      );
      toast.success("Selected candidates deleted");
      setSelectedCandidateIds([]);
      setSelectAll(false);
    } catch (error) {
      toast.error("Error deleting candidates");
    }
  };

  const handleCheckboxChange = (id) => {
    setSelectedCandidateIds((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  const handleSelectAllChange = () => {
    if (selectAll) {
      setSelectedCandidateIds([]);
    } else {
      const currentIds = candidates.map((s) => s._id);
      const updated = Array.from(new Set([...selectedCandidateIds, ...currentIds]));
      setSelectedCandidateIds(updated);
    }
    setSelectAll(!selectAll);
  };

  useEffect(() => {
    const currentIds = candidates.map((s) => s._id);
    const allSelected = currentIds.every((id) => selectedCandidateIds.includes(id));
    setSelectAll(allSelected);
  }, [candidates, selectedCandidateIds]);

  const showModal = () => setIsModalVisible(true);
  const closeModal = () => setIsModalVisible(false);

  if (candidates.length === 0) {
    return (
      <Wrapper>
        <div className="flex justify-between mb-10">
          <Button className="btn flex" onClick={showModal} icon={<PlusOutlined />}>
            <span className="ml-3">Register</span>
          </Button>
          {isModalVisible && (
            <div className="modal modal-open">
              <div ref={modalRef} className="modal-box bg-white max-w-7xl relative">
                <button
                  className="fixed top-2 right-4 bg-transparent border-0 text-gray-500 text-lg"
                  onClick={closeModal}
                >
                  <CloseOutlined />
                </button>
                <AddCandidate closeModal={closeModal} />
              </div>
            </div>
          )}
        </div>
        <h2>No candidates to display...</h2>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <div className="flex justify-between mb-10">
        <h5 className="font-bold">
          {totalCandidates} {totalCandidates > 1 ? "candidates" : "candidate"} found
        </h5>
        <Button className="btn flex" onClick={showModal} icon={<PlusOutlined />}>
          <span className="ml-3">Register</span>
        </Button>
        {isModalVisible && (
          <div className="modal modal-open">
            <div ref={modalRef} className="modal-box bg-white max-w-7xl relative">
              <button
                className="fixed top-2 right-4 bg-transparent border-0 text-gray-500 text-lg"
                onClick={closeModal}
              >
                <CloseOutlined />
              </button>
              <AddCandidate closeModal={closeModal} />
            </div>
          </div>
        )}
      </div>

      {/* Field Selection UI */}
      <div className="flex flex-wrap gap-4 mb-4">
        {fieldOptions.map(({ key, label }) => (
          <label key={key} className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={selectedFields.includes(key)}
              onChange={() => toggleField(key)}
            />
            <span>{label}</span>
          </label>
        ))}
      </div>

      {/* Export and Delete Buttons */}
      <div className="flex space-x-4 my-4">
        <Button onClick={handleExportPDF} disabled={selectedCandidateIds.length === 0}>
          Export Selected to PDF
        </Button>
        <Button danger onClick={handleDeleteSelected} disabled={selectedCandidateIds.length === 0}>
          Delete Selected
        </Button>
        {exportCandidateCVs(candidates.filter(c => selectedCandidateIds.includes(c._id))).map((cv, idx) => (
          <PDFDownloadLink
            key={idx}
            document={cv.document}
            fileName={cv.filename}
            className="btn btn-outline"
          >
            {({ loading }) => (loading ? "Generating..." : `Download ${cv.filename}`)}
          </PDFDownloadLink>
        ))}
      </div>

      {/* Candidates Table */}
      <div className="candidates overflow-x-auto w-full">
        <table className="min-w-[1400px] table">
          <thead>
            <tr>
              <th>
                <div className="flex items-center space-x-2">
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
              <th>Gender</th>
              <th>Age</th>
              <th>Passport No.</th>
              <th>Phone No.</th>
              <th>Narrative Phone</th>
              <th>Religion</th>
              <th>Labor ID</th>
              <th>CV Status</th>
              <th>CV Sent To</th>
              <th>COC Status</th>
              <th>Musaned Status</th>
              <th>Medical Status</th>
              <th>Medical Days</th>
              <th>Experience Outside</th>
              <th>Availablity Status</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          {candidates.map((candidate) => (
            <Candidate
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
              <th>Gender</th>
              <th>Age</th>
              <th>Passport No.</th>
              <th>Phone No.</th>
              <th>Narrative Phone</th>
              <th>Religion</th>
              <th>Labor ID</th>
              <th>CV Status</th>
              <th>CV Sent To</th>
              <th>COC Status</th>
              <th>Musaned Status</th>
              <th>Medical Status</th>
              <th>Medical Days</th>
              <th>Experience Outside</th>
              <th>Availablity Status</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </tfoot>
        </table>
      </div>
      {numOfPages > 1 && <PageBtnContainer />}
    </Wrapper>
  );
};

export default CandidatesContainer;
