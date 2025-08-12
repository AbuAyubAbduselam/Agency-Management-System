import Wrapper from "../assets/wrappers/CandidatesContainer";
import { UseAllCandidatesAttendanceContext } from "../pages/CandidateAttendance";
import Attendance from "./Attendance";
import PageBtnContainer2 from "./PageBtnContainer2";
import { useEffect, useState, useRef } from "react";
import { Button, Dropdown, Menu } from "antd";
import customFetch from "../utils/customFetch";
import { exportCandidatesTableToExcel, exportCandidatesTableToPDF } from "./ExportActions";
import BulkUpdateFieldSelector from "./BulkUpdateFieldSelector";
import { statusOptions } from "../utils/constants";
import { useSubmit } from "react-router-dom";
import { fieldOptions } from "../utils/constants";



const CandidateAttendanceContainer = () => {
  const { data, selectedParams, setSelectedParams } = UseAllCandidatesAttendanceContext();
  const { selectedCandidates, totalSelectedCandidates, numOfPages } = data;

  const submit = useSubmit();

  const [selectedCandidateIds, setSelectedCandidateIds] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedFields, setSelectedFields] = useState([
    "Full Name",
    "passportNo",
    "laborId",
    "medicalStatus",
  ]);

  const [bulkField, setBulkField] = useState("");
  const [bulkValue, setBulkValue] = useState("");

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

  const toggleField = (key) => {
    setSelectedFields((prev) =>
      prev.includes(key) ? prev.filter((f) => f !== key) : [...prev, key]
    );
  };

  const [showFieldSelector, setShowFieldSelector] = useState(false);
  const fieldSelectorRef = useRef(null);

  // Close field selector if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (fieldSelectorRef.current && !fieldSelectorRef.current.contains(event.target)) {
        setShowFieldSelector(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleExportPDF = () => {
    const selected = selectedCandidates.filter((c) =>
      selectedCandidateIds.includes(c._id)
    );
    if (selected.length === 0 || selectedFields.length === 0) return;
    exportCandidatesTableToPDF(selected, selectedFields);
  };

  const handleExportExcel = () => {
    const selected = selectedCandidates.filter((c) =>
      selectedCandidateIds.includes(c._id)
    );
    if (selected.length === 0 || selectedFields.length === 0) return;
    exportCandidatesTableToExcel(selected, selectedFields);
  };

  const handleBulkStatusUpdate = async () => {
    if (!bulkField || !bulkValue || selectedCandidateIds.length === 0) {
      alert("Please select a field, value, and at least one candidate.");
      return;
    }
    try {
      await Promise.all(
        selectedCandidateIds.map((id) =>
          customFetch.patch(`/candidates/${id}`, {
            [bulkField]: bulkValue,
          })
        )
      );
      alert("Statuses updated successfully");
      window.location.reload();
    } catch (error) {
      console.error("Bulk update failed:", error.response?.data || error.message);
      alert("Failed to update status.");
    }
  };

  // Handle insideOffice filter click
 const handleFilterClick = (officeName) => {
  setSelectedParams((prev) => ({
    ...prev,
    insideOffice: officeName || "" // If empty, show all
  }));
  submit({ insideOffice: officeName || "" });
};


  if (selectedCandidates.length === 0) {
    return (
      <Wrapper>
             <div className="flex items-center gap-4 my-4 overflow-x-auto">
        <BulkUpdateFieldSelector
          statusOptions={statusOptions}
          bulkField={bulkField}
          bulkValue={bulkValue}
          setBulkField={setBulkField}
          setBulkValue={setBulkValue}
          onApply={handleBulkStatusUpdate}
        />
      </div>

      <div className="flex flex-wrap gap-4 my-4">
        <Dropdown
          overlay={
            <Menu>
              <Menu.Item key="summary" onClick={handleExportPDF}>
                Download PDF
              </Menu.Item>
              <Menu.Item key="excel" onClick={handleExportExcel}>
                Download Excel
              </Menu.Item>
            </Menu>
          }
          disabled={selectedCandidateIds.length === 0}
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

        {/* Inside Office Filter Buttons */}
      <div className="flex gap-2 mb-4">
  <Button
    type={!selectedParams.insideOffice ? "primary" : "default"}
    onClick={() => handleFilterClick("")}
  >
    All
  </Button>
  <Button
    type={selectedParams.insideOffice === "Mubarek Agency" ? "primary" : "default"}
    onClick={() => handleFilterClick("Mubarek Agency")}
  >
    Mubarek Agency
  </Button>

  <Button
    type={selectedParams.insideOffice === "Kalid Agency" ? "primary" : "default"}
    onClick={() => handleFilterClick("Kalid Agency")}
  >
    Kalid Agency
  </Button>

</div>

      </div>
        <h3 className="mt-14 smal normal-case">No candidates to display...</h3>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <div className="flex justify-between mb-6">
        <h5 className="font-bold">
          {totalSelectedCandidates}{" "}
          {totalSelectedCandidates > 1 ? "candidates" : "candidate"} found
        </h5>
      </div>

      {/* Bulk Update UI */}
      <div className="flex items-center gap-4 my-4 overflow-x-auto">
        <BulkUpdateFieldSelector
          statusOptions={statusOptions}
          bulkField={bulkField}
          bulkValue={bulkValue}
          setBulkField={setBulkField}
          setBulkValue={setBulkValue}
          onApply={handleBulkStatusUpdate}
        />
      </div>

      <div className="flex flex-wrap gap-4 my-4">
        <Dropdown
          overlay={
            <Menu>
              <Menu.Item key="summary" onClick={handleExportPDF}>
                Download PDF
              </Menu.Item>
              <Menu.Item key="excel" onClick={handleExportExcel}>
                Download Excel
              </Menu.Item>
            </Menu>
          }
          disabled={selectedCandidateIds.length === 0}
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

        <div className="flex gap-2 mb-4">
  <Button
    type={!selectedParams.insideOffice ? "primary" : "default"}
    onClick={() => handleFilterClick("")}
  >
    All
  </Button>
  <Button
    type={selectedParams.insideOffice === "Mubarek Agency" ? "primary" : "default"}
    onClick={() => handleFilterClick("Mubarek Agency")}
  >
    Mubarek Agency
  </Button>

  <Button
    type={selectedParams.insideOffice === "Kalid Agency" ? "primary" : "default"}
    onClick={() => handleFilterClick("Kalid Agency")}
  >
    Kalid Agency
  </Button>

</div>

      </div>

      {/* Table */}
      <div className="candidates overflow-x-auto">
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
              <th>Passport No.</th>
              <th>Labor ID</th>
              <th>Contract Date</th>
              <th>Medical Status</th>
              <th>Medical Days</th>
              <th>Selected By</th>
              <th>Tasheer</th>
              <th>Tasheer Date</th>
              <th>Wokala</th>
              <th>Visa Status</th>
              <th>COC Status</th>
              <th>LMIS</th>
              <th>QR code</th>
              <th>Arrival City</th>
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
              <th>Contract Date</th>
              <th>Medical Status</th>
              <th>Selected By</th>
              <th>Tasheer</th>
              <th>Tasheer Date</th>
              <th>Wokala</th>
              <th>Visa Status</th>
              <th>COC Status</th>
              <th>LMIS</th>
              <th>Ticket</th>
              <th>Ticket Date</th>
              <th>Edit</th>
            </tr>
          </tfoot>
        </table>
      </div>

      {numOfPages > 1 && <PageBtnContainer2 />}
    </Wrapper>
  );
};

export default CandidateAttendanceContainer;
