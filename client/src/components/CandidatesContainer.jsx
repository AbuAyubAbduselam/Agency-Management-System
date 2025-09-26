import { useRef, useState } from "react";
import Candidate from "./Candidate";
import Wrapper from "../assets/wrappers/CandidatesContainer";
import { useAllCandidatesContext } from "../pages/AllCandidates";
import PageBtnContainer from "./PageBtnContainer";
import { Button, Select, Dropdown, Menu } from "antd";
import customFetch from "../utils/customFetch";
import { agentLogos,ourLogo } from "../utils/agentLogos";
import {
  exportCandidatesTableToPDF,
  exportCandidatesTableToExcel
} from "./ExportActions";
import { CandidateCVPages} from "./cv-templates/DefaultCV";
import { CombinedPDFDocument } from "./cv-templates/DefaultCV";
import { Document, pdf } from "@react-pdf/renderer";
import { fieldOptions, statusOptions } from "../utils/constants";
import { cvLayouts } from "./cv-templates/cvLayouts";


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

const CandidatesContainer = () => {
  const { data, selectedIds, setSelectedIds, selectAllGlobal, setSelectAllGlobal } = useAllCandidatesContext();
  const { candidates, totalCandidates, numOfPages } = data;

  const [selectedFields, setSelectedFields] = useState(["Full Name", "gender", "passportNo"]);
  const [bulkField, setBulkField] = useState("");
  const [bulkValue, setBulkValue] = useState("");
  const [showFieldSelector, setShowFieldSelector] = useState(false);
  const fieldSelectorRef = useRef(null);

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

  const handleSelectAllCurrentPage = () => {
    const pageIds = candidates.map(c => c._id);
    const allSelected = pageIds.every(id => selectedIds.has(id));

    setSelectedIds(prev => {
      const newSet = new Set(prev);
      if (allSelected) {
        pageIds.forEach(id => newSet.delete(id));
      } else {
        pageIds.forEach(id => newSet.add(id));
      }
      return newSet;
    });
  };

  const handleSelectAllGlobal = async () => {
  // If any rows are selected → clear all
  if (selectedIds.size > 0) {
    setSelectedIds(new Set());
    setSelectAllGlobal(false);
    return;
  }

  // Else → fetch all and select all globally
  try {
    const { data } = await customFetch.get("/candidates", {
      params: { limit: 100000 }
    });
    const allIds = new Set(data.candidates.map(c => c._id));
    setSelectedIds(allIds);
    setSelectAllGlobal(true);
  } catch (err) {
    console.error("Error selecting all globally:", err);
  }
};


  const toggleField = (key) => {
    setSelectedFields((prev) =>
      prev.includes(key) ? prev.filter((f) => f !== key) : [...prev, key]
    );
  };

  const getSelectedCandidates = () => candidates.filter(c => selectedIds.has(c._id));

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


const handleGenerateAgentPDF = async (layoutKey) => {
  const selected = getSelectedCandidates();
  if (!selected.length) return;

  const CVComponent = cvLayouts[layoutKey] || cvLayouts.default;

  const doc =
    selected.length === 1 ? (
      <Document>
        <CVComponent candidate={selected[0]} agentName={layoutKey} agentLogo={agentLogos[layoutKey]} />
      </Document>
    ) : (
      <Document>
        {selected.map((c, i) => (
          <CVComponent
            key={i}
            candidate={c}
            agentName={layoutKey}
            agentLogo={agentLogos[layoutKey]}
          />
        ))}
      </Document>
    );

  const blob = await pdf(doc).toBlob();
  const blobUrl = URL.createObjectURL(blob);
  window.open(blobUrl, "_blank");
};





  const handleExportPDF = async () => {
  let selected = [];

  if (selectAllGlobal) {
    // Fetch all candidates if "Select All (Global)" was used
    const { data } = await customFetch.get("/candidates", { params: { limit: 100000 } });
    selected = data.candidates;
  } else {
    // Fetch only selected IDs across all pages
    const { data } = await customFetch.get("/candidates", { 
      params: { ids: Array.from(selectedIds).join(",") } 
    });
    selected = data.candidates;
  }

  if (!selected.length) return;
  exportCandidatesTableToPDF(selected, selectedFields);
};

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
         <Button type="primary" onClick={handleSelectAllGlobal}>
          {selectAllGlobal ? "Deselect All" : "Select All"}
        </Button>
        <Dropdown
          overlay={
            <Menu>
             <Menu.Item key="summary" onClick={handleExportPDF}>Preview Summary PDF</Menu.Item>
<Menu.Item key="cv" onClick={handleGenerateAndPreviewPDF}>Preview CV PDF</Menu.Item>
<Menu.Item key="excel" onClick={handleExportExcel}>Download Excel Table</Menu.Item>

<Menu.Divider />
<Menu.SubMenu key="byAgent" title="Download CV by Agent">
  {Object.keys(cvLayouts).map((layoutKey) => (
    <Menu.Item
      key={layoutKey}
      onClick={() => handleGenerateAgentPDF(layoutKey)}
    >
      {layoutKey}
    </Menu.Item>
  ))}
</Menu.SubMenu>


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
      </div>

      <div className="candidates overflow-x-auto w-full">
        <table className="min-w-[60rem] table">
          <thead>
            <tr>
              <th>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    className="checkbox"
                    checked={candidates.length > 0 && candidates.every(c => selectedIds.has(c._id))}
                    onChange={handleSelectAllCurrentPage}
                  />
                  <span>({selectedIds.size})</span>
                </div>
              </th>
              <td>Photo</td>
              <td>Full Name</td>
              <th>Code</th>
              <th>Gender</th>
              <th>Age</th>
              <th>Passport No.</th>
              <th>Labor ID</th>
              <th>Phone No.</th>
              <th>Narative</th>
              <th>Religion</th>
              <th>CV Status</th>
              <th>CV Sent to</th>
              <th>COC Status</th>
              <th>Musaned Status</th>
              <th>Medical Status</th>
              <th> Medical Date</th>
              <th>Experience</th>
              <th>Note</th>

              <th>Availability Status</th>
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
        </table>
      </div>

      {numOfPages > 1 && <PageBtnContainer />}
    </Wrapper>
  );
};

export default CandidatesContainer;
