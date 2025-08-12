import { useRef, useState, useEffect } from "react";
import Candidate from "./Candidate";
import Wrapper from "../assets/wrappers/CandidatesContainer";
import { useAllCandidatesContext } from "../pages/AllCandidates";
import PageBtnContainer from "./PageBtnContainer";
import { PlusOutlined, CloseOutlined } from "@ant-design/icons";
import { Button, Select, Dropdown, Menu } from "antd";
import customFetch from "../utils/customFetch";
import { exportCandidatesTableToPDF, CombinedPDFDocument, CandidateCVPages, exportCandidatesTableToExcel } from "./ExportActions";
import { Document, pdf } from "@react-pdf/renderer";
import { fieldOptions, statusOptions } from "../utils/constants";

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

  const [selectedIds, setSelectedIds] = useState(new Set());
  const [selectAllGlobal, setSelectAllGlobal] = useState(false);
  const [selectedFields, setSelectedFields] = useState(["Full Name", "gender", "passportNo"]);
  const [bulkField, setBulkField] = useState("");
  const [bulkValue, setBulkValue] = useState("");


  // Select/deselect a single candidate
 const handleCheckboxChange = (id) => {
  setSelectedIds(prev => {
    const newSet = new Set(prev);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    return newSet;
  });
};

  // Select/Deselect all on current page
 const handleSelectAllCurrentPage = () => {
  const pageIds = candidates.map(c => c._id);
  const allSelected = pageIds.every(id => selectedIds.has(id));

  setSelectedIds(prev => {
    const newSet = new Set(prev);
    if (allSelected) {
      // remove only current page IDs
      pageIds.forEach(id => newSet.delete(id));
    } else {
      // add current page IDs
      pageIds.forEach(id => newSet.add(id));
    }
    return newSet;
  });
};

  // Select/Deselect all candidates in the DB (global)
 const handleSelectAllGlobal = async () => {
  if (selectAllGlobal) {
    setSelectedIds(new Set());
    setSelectAllGlobal(false);
  } else {
    const { data } = await customFetch.get("/candidates", { params: { limit: 100000 } });
    setSelectedIds(new Set(data.candidates.map(c => c._id)));
    setSelectAllGlobal(true);
  }
};

  const toggleField = (key) => {
    setSelectedFields((prev) =>
      prev.includes(key) ? prev.filter((f) => f !== key) : [...prev, key]
    );
  };

  const [showFieldSelector, setShowFieldSelector] = useState(false);
  const fieldSelectorRef = useRef(null);

  // Get selected candidates from current data
  const getSelectedCandidates = () => candidates.filter(c => selectedIds.has(c._id));

  // Bulk status update
  const handleBulkStatusUpdate = async () => {
    try {
      await Promise.all(
        Array.from(selectedIds).map((id) =>
          customFetch.patch(`/candidates/${id}`, { [bulkField]: bulkValue })
        )
      );
      alert("Statuses updated successfully");
      window.location.reload();
    } catch (err) {
      console.error("Bulk update failed", err);
      alert("Error during bulk update");
    }
  };

  // Export PDF
  const handleExportPDF = async () => {
    let selected = [];
    if (selectAllGlobal) {
      const { data } = await customFetch.get("/candidates", { params: { limit: 100000 } });
      selected = data.candidates;
    } else {
      selected = getSelectedCandidates();
    }
    if (!selected.length) return;
    exportCandidatesTableToPDF(selected, selectedFields);
  };

  // Export Excel
  const handleExportExcel = async () => {
    let selected = [];
    if (selectAllGlobal) {
      const { data } = await customFetch.get("/candidates", { params: { limit: 100000 } });
      selected = data.candidates;
    } else {
      selected = getSelectedCandidates();
    }
    if (!selected.length) return;
    exportCandidatesTableToExcel(selected, selectedFields);
  };

  // Generate CV PDF
  const handleGenerateAndPreviewPDF = async () => {
    const selected = getSelectedCandidates();
    if (!selected.length) return;
    const doc = selected.length === 1
      ? <Document><CandidateCVPages candidate={selected[0]} /></Document>
      : <CombinedPDFDocument candidates={selected} />;
    const blob = await pdf(doc).toBlob();
    const blobUrl = URL.createObjectURL(blob);
    window.open(blobUrl, "_blank");
  };

  // Clear selection on logout
  useEffect(() => {
    const clearOnLogout = () => {
      setSelectedIds(new Set());
      setSelectAllGlobal(false);
    };
    window.addEventListener("logout", clearOnLogout);
    return () => window.removeEventListener("logout", clearOnLogout);
  }, []);

  if (!candidates.length) {
    return <Wrapper><h2>No candidates to display...</h2></Wrapper>;
  }

  return (
    <Wrapper>
      <div className="flex justify-between mb-10">
        <h5 className="font-bold">{totalCandidates} candidates found</h5>
      </div>

      <BulkStatusUpdater
        bulkField={bulkField}
        setBulkField={setBulkField}
        bulkValue={bulkValue}
        setBulkValue={setBulkValue}
        onApply={handleBulkStatusUpdate}
        disabled={!bulkField || !bulkValue || selectedIds.size === 0}
      />

      <div className="flex flex-wrap gap-4 my-4">
        <Dropdown
          overlay={
            <Menu>
              <Menu.Item key="summary" onClick={handleExportPDF}>Preview Summary PDF</Menu.Item>
              <Menu.Item key="cv" onClick={handleGenerateAndPreviewPDF}>Preview CV PDF</Menu.Item>
              <Menu.Item key="excel" onClick={handleExportExcel}>Download Excel Table</Menu.Item>
            </Menu>
          }
          disabled={selectedIds.size === 0}
        >
          <Button>Download Options</Button>
        </Dropdown>

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

        <Button type="primary" onClick={handleSelectAllGlobal}>
          {selectAllGlobal ? "Deselect All (Global)" : "Select All (Global)"}
        </Button>
      </div>

      <div className="candidates overflow-x-auto w-full">
        <table className="min-w-[1400px] table">
          <thead>
            <tr>
              <th>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    className="checkbox"
                    checked={candidates.every(c => selectedIds.has(c._id))}
                    onChange={handleSelectAllCurrentPage}
                  />
                  <span>({selectedIds.size})</span>
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
              isSelected={selectedIds.has(candidate._id)}
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
