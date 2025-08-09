import { useRef, useState, useEffect } from "react";
import Candidate from "./Candidate";
import Wrapper from "../assets/wrappers/CandidatesContainer";
import { useAllCandidatesContext } from "../pages/AllCandidates";
import PageBtnContainer from "./PageBtnContainer";
import { AddCandidate } from "../pages";
import { PlusOutlined, CloseOutlined } from "@ant-design/icons";
import { Button, Select } from "antd";
import customFetch from "../utils/customFetch";
import { exportCandidatesTableToPDF, CombinedPDFDocument, CandidateCVPages } from "./ExportActions";
import { Document, pdf } from "@react-pdf/renderer";
import { fieldOptions } from "../utils/constants";
import { statusOptions } from "../utils/constants";
import { Dropdown, Menu } from "antd"; 
import { exportCandidatesTableToExcel } from "./ExportActions";



const BulkStatusUpdater = ({ bulkField, setBulkField, bulkValue, setBulkValue, onApply, disabled }) => (
  <div className="flex gap-4 mb-6 items-center flex-wrap">
   <Select value={bulkField} onChange={setBulkField} className="w-48">
  <Select.Option value="">Status Field</Select.Option>
  {Object.keys(statusOptions).map((field) => (
    <Select.Option key={field} value={field}>{field}</Select.Option>
  ))}
</Select>

<Select
  value={bulkValue}
  onChange={setBulkValue}
  className="w-48"
  disabled={!bulkField}
>
  <Select.Option value="">New Value</Select.Option>
  {statusOptions[bulkField]?.map(({ label, value }) => (
    <Select.Option key={value} value={value}>{label}</Select.Option>
  ))}
</Select>

    <Button type="primary" onClick={onApply} disabled={disabled}>Apply to Selected</Button>
  </div>
);

const CandidateModal = ({ isVisible, closeModal, modalRef, children }) =>
  isVisible && (
    <div className="modal modal-open">
      <div ref={modalRef} className="modal-box bg-white max-w-7xl relative">
        <button className="fixed top-2 right-4 bg-transparent border-0 text-gray-500 text-lg" onClick={closeModal}>
          <CloseOutlined />
        </button>
        {children}
      </div>
    </div>
  );

const CandidatesContainer = () => {
  const { data } = useAllCandidatesContext();
  const { candidates, totalCandidates, numOfPages } = data;

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedCandidateIds, setSelectedCandidateIds] = useState(() =>
    JSON.parse(localStorage.getItem("selectedCandidateIds") || "[]")
  );
  const [selectedFields, setSelectedFields] = useState(["Full Name", "gender", "passportNo"]);
  const [selectAll, setSelectAll] = useState(false);
  const [bulkField, setBulkField] = useState("");
  const [bulkValue, setBulkValue] = useState("");
  const [isAgentModalVisible, setIsAgentModalVisible] = useState(false);
const [agentName, setAgentName] = useState("");
const [agentLogo, setAgentLogo] = useState(null); // store File


  const modalRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("selectedCandidateIds", JSON.stringify(selectedCandidateIds));
  }, [selectedCandidateIds]);

  const toggleField = (key) => {
    setSelectedFields((prev) => prev.includes(key) ? prev.filter((f) => f !== key) : [...prev, key]);
  };

  const getSelectedCandidates = () =>
    candidates.filter((c) => selectedCandidateIds.includes(c._id));


  const handleExportPDF = async () => {
  let selected = [];

  if (selectAll) {
    // Fetch ALL candidates from the backend
    const { data } = await customFetch.get("/candidates", {
      params: { limit: 100000 } // adjust as needed
    });
    selected = data.candidates;
  } else {
    // Use only selected from current page & already loaded pages
    selected = candidates.filter(c => selectedCandidateIds.includes(c._id));
  }

  if (!selected.length || !selectedFields.length) return;
  exportCandidatesTableToPDF(selected, selectedFields);
};

const handleExportExcel = async () => {
  let selected = [];

  if (selectAll) {
    const { data } = await customFetch.get("/candidates", {
      params: { limit: 100000 }
    });
    selected = data.candidates;
  } else {
    selected = candidates.filter(c => selectedCandidateIds.includes(c._id));
  }

  if (!selected.length || !selectedFields.length) return;
  exportCandidatesTableToExcel(selected, selectedFields);
};






const handleGenerateAndPreviewPDF = async () => {
  const selected = getSelectedCandidates();
  if (selected.length === 0) return;

  const doc =
    selected.length === 1
      ? <Document><CandidateCVPages candidate={selected[0]} /></Document>
      : <CombinedPDFDocument candidates={selected} />;

  const blob = await pdf(doc).toBlob();
  const blobUrl = URL.createObjectURL(blob);
  window.open(blobUrl, "_blank");
};


  const handleBulkStatusUpdate = async () => {
    try {
      await Promise.all(
        selectedCandidateIds.map((id) =>
          customFetch.patch(`/candidates/${id}`, { [bulkField]: bulkValue })
        )
      );
      alert("Statuses updated successfully");
      window.location.reload();
    } catch (err) {
      console.error("Bulk update failed", err);
      alert("An error occurred during bulk update");
    }
  };

 

  const handleCheckboxChange = (id) => {
    setSelectedCandidateIds((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  const handleSelectAllChange = async () => {
  if (selectAll) {
    // Deselect all
    setSelectedCandidateIds([]);
    setSelectAll(false);
  } else {
    try {
      // Fetch all candidate IDs from all pages (not paginated)
      const { data } = await customFetch.get("/candidates", {
        params: { limit: 100000 }, // large enough number to fetch all
      });

      const allIds = data.candidates.map((c) => c._id);
      setSelectedCandidateIds(allIds);
      setSelectAll(true);
    } catch (err) {
      console.error("Failed to fetch all candidates:", err);
    }
  }
};

const AgentInfoModal = ({ visible, onClose, onConfirm }) => {
  const [tempName, setTempName] = useState("");
  const [tempLogo, setTempLogo] = useState(null);

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) setTempLogo(file);
  };

  return visible ? (
    <div className="modal modal-open">
      <div className="modal-box bg-white max-w-md">
        <h3 className="text-lg font-bold mb-4">Agent Information</h3>
        
        <label className="block mb-2">Agent Name</label>
        <input
          type="text"
          value={tempName}
          onChange={(e) => setTempName(e.target.value)}
          className="border rounded p-2 w-full mb-4 bg-slate-100"
        />

        <label className="block mb-2">Agent Logo</label>
        <input type="file" accept="image/*" onChange={handleLogoChange} className="mb-4" />

        <div className="flex justify-end gap-3">
          <Button onClick={onClose}>Cancel</Button>
          <Button
            type="primary"
            onClick={() => onConfirm(tempName, tempLogo)}
            disabled={!tempName || !tempLogo}
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  ) : null;
};

const handleDownloadCVWithAgentInfo = async (name, logoFile) => {
  const selected = getSelectedCandidates();
  if (selected.length === 0) return;

  let logoUrl = null;
  if (logoFile) {
    logoUrl = URL.createObjectURL(logoFile); // temporary blob URL for PDF
  }

  const doc =
    selected.length === 1
      ? <Document><CandidateCVPages candidate={selected[0]} agentName={name} agentLogo={logoUrl} /></Document>
      : <CombinedPDFDocument candidates={selected} agentName={name} agentLogo={logoUrl} />;

  const blob = await pdf(doc).toBlob();
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "CV.pdf";
  link.click();
};



  const [showFieldSelector, setShowFieldSelector] = useState(false);
const fieldSelectorRef = useRef(null);

// Close field selector if clicked outside
useEffect(() => {
  const handleClickOutside = (event) => {
    if (
      fieldSelectorRef.current &&
      !fieldSelectorRef.current.contains(event.target)
    ) {
      setShowFieldSelector(false);
    }
  };
  document.addEventListener("mousedown", handleClickOutside);
  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);


useEffect(() => {
  // selectAll is true if all candidates are selected across pages
  setSelectAll(selectedCandidateIds.length > 0 && selectedCandidateIds.length >= totalCandidates);
}, [selectedCandidateIds, totalCandidates]);


  const showModal = () => setIsModalVisible(true);
  const closeModal = () => setIsModalVisible(false);

  if (!candidates.length) {
    return (
      <Wrapper>
        <div className="flex justify-between mb-10">
          <Button className="btn flex" onClick={showModal} icon={<PlusOutlined />}><span className="ml-3">Register</span></Button>
          <CandidateModal isVisible={isModalVisible} closeModal={closeModal} modalRef={modalRef}>
            <AddCandidate closeModal={closeModal} />
          </CandidateModal>
        </div>
        <h2>No candidates to display...</h2>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <div className="flex justify-between mb-10">
        <h5 className="font-bold">{totalCandidates} {totalCandidates > 1 ? "candidates" : "candidate"} found</h5>
        <Button className="btn flex" onClick={showModal} icon={<PlusOutlined />}><span className="ml-3">Register</span></Button>
        <CandidateModal isVisible={isModalVisible} closeModal={closeModal} modalRef={modalRef}>
          <AddCandidate closeModal={closeModal} />
        </CandidateModal>
      </div>
      <BulkStatusUpdater
        bulkField={bulkField}
        setBulkField={setBulkField}
        bulkValue={bulkValue}
        setBulkValue={setBulkValue}
        onApply={handleBulkStatusUpdate}
        disabled={!bulkField || !bulkValue || selectedCandidateIds.length === 0}
      />

     <div className="flex flex-wrap gap-4 my-4">

  <Dropdown
  overlay={
    <Menu>
      <Menu.Item key="summary" onClick={handleExportPDF}>
        Preview Summary PDF
      </Menu.Item>
      <Menu.Item key="cv" onClick={handleGenerateAndPreviewPDF}>
        Preview CV PDF
      </Menu.Item>
      <Menu.Item key="excel" onClick={handleExportExcel}>
        Download Excel Table
      </Menu.Item>
    </Menu>
  }
  disabled={selectedCandidateIds.length === 0}
>
  <Button>Download Options</Button>
</Dropdown>

<Button
  type="primary"
  onClick={() => setIsAgentModalVisible(true)}
  disabled={selectedCandidateIds.length === 0}
>
  Download CV PDF
</Button>

<AgentInfoModal
  visible={isAgentModalVisible}
  onClose={() => setIsAgentModalVisible(false)}
  onConfirm={(name, logo) => {
    setAgentName(name);
    setAgentLogo(logo);
    setIsAgentModalVisible(false);
    handleDownloadCVWithAgentInfo(name, logo);
  }}
/>



  <div className="relative" ref={fieldSelectorRef}>
    <Button onClick={() => setShowFieldSelector((prev) => !prev)}>
      Select Fields
    </Button>

    {showFieldSelector && (
      <div className="absolute z-50 bg-white shadow-lg border rounded mt-2 p-4 max-h-64 overflow-y-auto w-64">
        {fieldOptions.map(({ key, label }) => (
          <label key={key} className="flex items-center space-x-2 mb-2">
            <input
              type="checkbox"
              checked={selectedFields.includes(key)}
              onChange={() => toggleField(key)}
            />
            <span>{label}</span>
          </label>
        ))}
      </div>
    )}
  </div>

</div>
 <div className="candidates overflow-x-auto w-full">
        <table className="min-w-[1400px] table">
          <thead>
            <tr>
              <th>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" className="checkbox" checked={selectAll} onChange={handleSelectAllChange} />
                  <span>({selectedCandidateIds.length})</span>
                </div>
              </th>
              {fieldOptions.map(({ label }) => <th key={label}>{label}</th>)}
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
              {fieldOptions.map(({ label }) => <th key={label}>{label}</th>)}
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