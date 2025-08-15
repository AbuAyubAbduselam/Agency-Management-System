import { useSubmit, Link } from "react-router-dom";
import { JOB_SORT_BY } from "../../../utils/constant";
import { UseAllCandidatesAttendanceContext } from "../pages/CandidateAttendance";
import { Button, DatePicker, Input, Select, Spin } from "antd";
import { useState } from "react";
import { statusOptions } from "../utils/constants";
import dayjs from "dayjs";
import { FilterOutlined } from "@ant-design/icons";

const { RangePicker } = DatePicker;
const { Option } = Select;

const SearchContainer2 = () => {
  const { selectedParams, setSelectedParams } = UseAllCandidatesAttendanceContext();
  const submit = useSubmit();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false); // like SearchContainer

  const [filters, setFilters] = useState({
    search: selectedParams.search || "",
    medicalStatus: selectedParams.medicalStatus || [],
    cocStatus: selectedParams.cocStatus || [],
    visaStatus: selectedParams.visaStatus || [],
    ticket: selectedParams.ticket || [],
    wokala: selectedParams.wokala || [],
    selectedBy: selectedParams.selectedBy || [],
    tasheer: selectedParams.tasheer || [],
    lmis: selectedParams.lmis || [],
    sort: selectedParams.sort || "newest",
    contractRange:
      selectedParams.contractStart && selectedParams.contractEnd
        ? [dayjs(selectedParams.contractStart), dayjs(selectedParams.contractEnd)]
        : [],
    tasheerRange:
      selectedParams.tasheerStart && selectedParams.tasheerEnd
        ? [dayjs(selectedParams.tasheerStart), dayjs(selectedParams.tasheerEnd)]
        : [],
    ticketRange:
      selectedParams.ticketStart && selectedParams.ticketEnd
        ? [dayjs(selectedParams.ticketStart), dayjs(selectedParams.ticketEnd)]
        : [],
  });

  const handleApply = () => {
    const updatedParams = {
      ...selectedParams,
      search: filters.search || "",
      medicalStatus: filters.medicalStatus,
      cocStatus: filters.cocStatus,
      visaStatus: filters.visaStatus,
      ticket: filters.ticket,
      wokala: filters.wokala,
      selectedBy: filters.selectedBy,
      tasheer: filters.tasheer,
      lmis: filters.lmis,
      sort: filters.sort || "newest",
      contractStart: filters.contractRange?.[0]?.format("YYYY-MM-DD") || "",
      contractEnd: filters.contractRange?.[1]?.format("YYYY-MM-DD") || "",
      tasheerStart: filters.tasheerRange?.[0]?.format("YYYY-MM-DD") || "",
      tasheerEnd: filters.tasheerRange?.[1]?.format("YYYY-MM-DD") || "",
      ticketStart: filters.ticketRange?.[0]?.format("YYYY-MM-DD") || "",
      ticketEnd: filters.ticketRange?.[1]?.format("YYYY-MM-DD") || "",
    };

    setSelectedParams(updatedParams);
    setLoading(true);
    submit(updatedParams, { replace: true });
    setLoading(false);
  };

  const handleReset = () => {
    setFilters({
      search: "",
      medicalStatus: [],
      cocStatus: [],
      visaStatus: [],
      ticket: [],
      wokala: [],
      selectedBy: [],
      tasheer: [],
      lmis: [],
      sort: "newest",
      contractRange: [],
      tasheerRange: [],
      ticketRange: [],
    });
    setSelectedParams({});
    submit();
  };

  const renderMultiSelect = (label, name, value, options) => (
    <div className="form-control w-full">
      {label && <label className="mb-1 font-small text-gray-700">{label}</label>}
      <Select
        mode="multiple"
        allowClear
        style={{ width: "100%" }}
        value={value}
        onChange={(vals) => setFilters({ ...filters, [name]: vals })}
      >
        {options.map((opt) => (
          <Option key={opt} value={opt}>
            {opt}
          </Option>
        ))}
      </Select>
    </div>
  );

  return (
    <div className="p-4 bg-white shadow-md rounded-md w-auto">
      {/* Search bar and filter toggle */}
     <div className="mb-4 flex flex-wrap gap-2">
  <Input
    placeholder="Search"
    value={filters.search}
    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
    className="flex-1 min-w-[180px]"
    onPressEnter={handleApply}
  />
  <Button icon={<FilterOutlined />} onClick={() => setOpen(!open)}>
    Filters
  </Button>
</div>

      {/* Filters section like SearchContainer */}
      {open && (
        <div
          style={{
            maxHeight: "300px",
            overflowY: "auto",
            padding: "10px",
            border: "1px solid #ddd",
            borderRadius: "8px",
          }}
          className="mb-4"
        >
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {renderMultiSelect(
              "Medical Status",
              "medicalStatus",
              filters.medicalStatus,
              statusOptions.medicalStatus.map((o) => o.label || o.value)
            )}
            {renderMultiSelect(
              "CoC Status",
              "cocStatus",
              filters.cocStatus,
              statusOptions.cocStatus.map((o) => o.label || o.value)
            )}
            {renderMultiSelect(
              "Visa Status",
              "visaStatus",
              filters.visaStatus,
              statusOptions.visaStatus.map((o) => o.label || o.value)
            )}
            {renderMultiSelect(
              "Ticket",
              "ticket",
              filters.ticket,
              statusOptions.ticket.map((o) => o.label || o.value)
            )}
            {renderMultiSelect(
              "Wokala",
              "wokala",
              filters.wokala,
              statusOptions.wokala.map((o) => o.label || o.value)
            )}
            {renderMultiSelect(
              "Selected By",
              "selectedBy",
              filters.selectedBy,
              statusOptions.selectedBy.map((o) => o.label || o.value)
            )}
            {renderMultiSelect(
              "Tasheer",
              "tasheer",
              filters.tasheer,
              statusOptions.tasheer.map((o) => o.label || o.value)
            )}
            {renderMultiSelect(
              "LMIS",
              "lmis",
              filters.lmis,
              statusOptions.lmis.map((o) => o.label || o.value)
            )}

            <RangePicker
              placeholder={["Contract Start", "Contract End"]}
              value={filters.contractRange}
              onChange={(dates) => setFilters({ ...filters, contractRange: dates })}
              className="w-full"
            />
            <RangePicker
              placeholder={["Tasheer Start", "Tasheer End"]}
              value={filters.tasheerRange}
              onChange={(dates) => setFilters({ ...filters, tasheerRange: dates })}
              className="w-full"
            />
            <RangePicker
              placeholder={["Ticket Start", "Ticket End"]}
              value={filters.ticketRange}
              onChange={(dates) => setFilters({ ...filters, ticketRange: dates })}
              className="w-full"
            />

            <div className="form-control w-full">
              <label className="mb-1 font-small text-gray-700">Sort By</label>
              <Select
                value={filters.sort}
                onChange={(val) => setFilters({ ...filters, sort: val })}
                style={{ width: "100%" }}
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
          <Button type="default" onClick={handleApply}>
            Apply
          </Button>
          <Button type="primary" onClick={handleReset}>
            <Link to="/dashboard">Reset</Link>
          </Button>
        </div>
      )}

      {loading && <Spin />}
    </div>
  );
};

export default SearchContainer2;
