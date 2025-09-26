import { useState } from "react";
import { useSubmit, Link } from "react-router-dom";
import { JOB_SORT_BY } from "../../../utils/constant";
import { useAllCandidatesContext } from "../pages/AllCandidates";
import { statusOptions } from "../utils/constants";
import { Button, Select, Input } from "antd";
import { FilterOutlined } from "@ant-design/icons";

const { Option } = Select;

const SearchContainer = () => {
  const { selectedParams, setSelectedParams } = useAllCandidatesContext();
  const [open, setOpen] = useState(false);
  const [tempFilters, setTempFilters] = useState(selectedParams);
  const submit = useSubmit();

  const handleReset = () => {
    const resetParams = {};
    Object.keys(selectedParams).forEach((key) => {
      resetParams[key] = Array.isArray(selectedParams[key]) ? [] : "";
    });
    resetParams.sort = "newest";
    setSelectedParams(resetParams);
    setTempFilters(resetParams);
    submit(resetParams, { replace: true });
  };

  const handleMultiChange = (name, values) => {
    setTempFilters((prev) => ({ ...prev, [name]: values }));
  };

  const handleSortChange = (val) => {
    setTempFilters((prev) => ({ ...prev, sort: val }));
  };

  const handleApplyFilters = () => {
    setSelectedParams(tempFilters);
    submit(tempFilters, { replace: true });
  };

  const renderMultiSelect = (label, name, options) => (
    <div className="form-control w-full">
      {label && <label className="mb-1 font-small text-gray-700">{label}</label>}
      <Select
        mode="multiple"
        allowClear
        value={tempFilters[name] || []}
        style={{ width: "100%" }}
        onChange={(vals) => handleMultiChange(name, vals)}
      >
        {options.map((opt) => (
          <Option key={opt} value={opt}>
            {opt}
          </Option>
        ))}
      </Select>
    </div>
  );

  const getStringOptions = (optionsArr) =>
    optionsArr.map((opt) => opt.label || "");

  return (
    <div className="p-4 bg-white shadow-md rounded-md">
      <form onSubmit={(e) => e.preventDefault()}>
        {/* Search bar */}
        <div className="mb-4 flex gap-2">
          <Input
            placeholder="Search"
            value={tempFilters.search || ""}
            onChange={(e) =>
              setTempFilters((prev) => ({ ...prev, search: e.target.value }))
            }
            onPressEnter={handleApplyFilters}
            style={{ width: "100%" }}
          />
          <Button icon={<FilterOutlined />} onClick={() => setOpen(!open)}>
            Filters
          </Button>
        </div>

        {/* Filters */}
        {open && (
          <div
            style={{
              maxHeight: "250px",
              overflowY: "auto",
              padding: "10px",
              border: "1px solid #ddd",
              borderRadius: "8px",
            }}
            className="mb-4"
          >
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {renderMultiSelect("Gender", "gender", getStringOptions(statusOptions.gender))}
              {renderMultiSelect("Medical status", "medicalStatus", getStringOptions(statusOptions.medicalStatus))}
              {renderMultiSelect("Religion", "religion", getStringOptions(statusOptions.religion))}
              {renderMultiSelect("COC Status", "cocStatus", getStringOptions(statusOptions.cocStatus))}
              {renderMultiSelect("Musaned Status", "musanedStatus", getStringOptions(statusOptions.musanedStatus))}
              {renderMultiSelect("Availability", "availabilityStatus", getStringOptions(statusOptions.availabilityStatus))}
              <div className="form-control w-full">
                <label className="mb-1 font-small text-gray-700">Sort by</label>
                <Select
                  value={tempFilters.sort || "newest"}
                  style={{ width: "100%" }}
                  onChange={handleSortChange}
                >
                  {Object.values(JOB_SORT_BY).map((opt) => (
                    <Option key={opt} value={opt}>
                      {opt}
                    </Option>
                  ))}
                </Select>
              </div>
            </div>
          </div>
        )}

        {/* Apply & Reset buttons */}
        {open && (
          <div className="flex justify-end gap-2">
            <Button type="default" onClick={handleApplyFilters}>
              Apply
            </Button>
            <Button type="primary" onClick={handleReset}>
              <Link to="/dashboard">Reset</Link>
            </Button>
          </div>
        )}
      </form>
    </div>
  );
};

export default SearchContainer;
