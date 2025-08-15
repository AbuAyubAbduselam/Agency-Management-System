import Wrapper from "../assets/wrappers/CandidatesContainer";
import { UseAllCandidatesAttendanceContext } from "../pages/CandidateAttendance";
import Attendance from "./Attendance";
import PageBtnContainer2 from "./PageBtnContainer2";
import { useEffect, useState, useRef } from "react";
import { Button, Dropdown, Menu } from "antd";
import customFetch from "../utils/customFetch";
import { exportCandidatesTableToExcel, exportCandidatesTableToPDF } from "./ExportActions";
import BulkUpdateFieldSelector from "./BulkUpdateFieldSelector";
import { statusOptions, fieldOptions } from "../utils/constants";
import { useSubmit } from "react-router-dom";
import { toast } from "react-toastify";

const CandidateAttendanceContainer = () => {
  const {
    data,
    selectedParams,
    setSelectedParams,
    selectedCandidateIds,
    setSelectedCandidateIds,
  } = UseAllCandidatesAttendanceContext();

  const { selectedCandidates, totalSelectedCandidates, numOfPages } = data;

  const submit = useSubmit();
  const [selectAll, setSelectAll] = useState(false);
  const [selectAllGlobal, setSelectAllGlobal] = useState(false); // ✅ NEW: global select state
  const [selectedFields, setSelectedFields] = useState([
    "Full Name",
    "passportNo",
    "laborId",
    "medicalStatus",
  ]);
  const [bulkField, setBulkField] = useState("");
  const [bulkValue, setBulkValue] = useState("");
  const [showFieldSelector, setShowFieldSelector] = useState(false);
  const fieldSelectorRef = useRef(null);

  // ✅ Toggle single row
  const handleCheckboxChange = (id) => {
    setSelectedCandidateIds((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  // ✅ Local page select all
  const handleSelectAllChange = () => {
    const currentIds = selectedCandidates.map((c) => c._id);
    if (selectAll) {
      setSelectedCandidateIds((prev) => prev.filter((id) => !currentIds.includes(id)));
    } else {
      setSelectedCandidateIds((prev) => Array.from(new Set([...prev, ...currentIds])));
    }
    setSelectAll(!selectAll);
  };

  // ✅ GLOBAL select all toggle
  const handleSelectAllGlobal = async () => {
    if (selectedCandidateIds.length > 0) {
      // Deselect all
      setSelectedCandidateIds([]);
      setSelectAllGlobal(false);
      setSelectAll(false);
      return;
    }

    try {
      const { data } = await customFetch.get("/attendance/selected", {
        params: { limit: 100000 } // fetch all
      });
      const allIds = data.selectedCandidates.map(c => c._id);
      setSelectedCandidateIds(allIds);
      setSelectAllGlobal(true);
    } catch (err) {
      console.error("Error fetching all candidates globally:", err);
      toast.error("Failed to select all candidates globally");
    }
  };

  useEffect(() => {
    const currentIds = selectedCandidates.map((c) => c._id);
    const allSelected = currentIds.every((id) => selectedCandidateIds.includes(id));
    setSelectAll(allSelected);
  }, [selectedCandidates, selectedCandidateIds]);

  const toggleField = (key) => {
    setSelectedFields((prev) =>
      prev.includes(key) ? prev.filter((f) => f !== key) : [...prev, key]
    );
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (fieldSelectorRef.current && !fieldSelectorRef.current.contains(event.target)) {
        setShowFieldSelector(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ PDF Export
  const handleExportPDF = async () => {
    if (selectedCandidateIds.length === 0 || selectedFields.length === 0) {
      toast.error("Please select at least one candidate and one field.");
      return;
    }

    try {
      const { data } = await customFetch.get("/attendance/selected", {
        params: { ids: selectedCandidateIds.join(",") }
      });
      exportCandidatesTableToPDF(data.selectedCandidates, selectedFields);
    } catch (err) {
      console.error(err);
      toast.error("Failed to export PDF");
    }
  };

  // ✅ Excel Export
  const handleExportExcel = async () => {
    if (selectedCandidateIds.length === 0 || selectedFields.length === 0) {
      toast.error("Please select at least one candidate and one field.");
      return;
    }

    try {
      const { data } = await customFetch.get("/attendance/selected", {
        params: { ids: selectedCandidateIds.join(",") }
      });
      exportCandidatesTableToExcel(data.selectedCandidates, selectedFields);
    } catch (err) {
      console.error(err);
      toast.error("Failed to export Excel");
    }
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

  const handleFilterClick = (officeName) => {
    setSelectedParams((prev) => ({
      ...prev,
      insideOffice: officeName || "",
    }));
    submit({ insideOffice: officeName || "" });
  };

  return (
    <Wrapper>
      <div className="flex justify-between mb-6">
        <h5 className="font-bold">
          {totalSelectedCandidates} {totalSelectedCandidates > 1 ? "candidates" : "candidate"} found
        </h5>
      </div>

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
          <Button type={selectAllGlobal ? "danger" : "primary"} onClick={handleSelectAllGlobal}>
          {selectAllGlobal || selectedCandidateIds.length > 0 ? "Deselect All" : "Select All"}
        </Button>
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
          <Button onClick={() => setShowFieldSelector((prev) => !prev)}>Select Fields</Button>
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

      <div className="candidates overflow-x-auto">
        <table className="min-w-[50rem] table">
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
        </table>
      </div>

      {numOfPages > 1 && <PageBtnContainer2 />}
    </Wrapper>
  );
};

export default CandidateAttendanceContainer;
