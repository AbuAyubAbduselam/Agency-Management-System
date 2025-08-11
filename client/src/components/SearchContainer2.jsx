import { useSubmit, Link } from "react-router-dom";
import { JOB_SORT_BY } from "../../../utils/constant";
import { UseAllCandidatesAttendanceContext } from "../pages/CandidateAttendance";
import FormSelectGroup from "./FormSelectGroup";
import { Button, Spin } from "antd";
import { useState } from "react";
import { statusOptions } from "../utils/constants";

// ✅ debounce function outside
const debounce = (callback, delay = 900) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      callback(...args);
    }, delay);
  };
};

const SearchContainer2 = () => {
  const { selectedParams, setSelectedParams } =
    UseAllCandidatesAttendanceContext();
  const {
    search,
    sort,
    visaStatus,
    ticket,
    wokala,
    selectedBy,
    medicalStatus,
    tasheer,
    cocStatus,
    lmis,
  } = selectedParams;

  const submit = useSubmit();
  const [loading, setLoading] = useState(false);
  const [localSearch, setLocalSearch] = useState(search || "");

  // ✅ Debounced submit that runs after typing stops
  const debouncedSubmit = debounce((form) => {
    setLoading(true);
    submit(form, { replace: true });
    setLoading(false);
  }, 1000);

  // Handle reset button
  const handleReset = () => {
    const resetParams = {
      search: "",
      sort: "newest",
      visaStatus: "",
      ticket: "",
      wokala: "",
      selectedBy: "",
      medicalStatus: "",
      tasheer: "",
      cocStatus: "",
      lmis: "",
    };
    setSelectedParams(resetParams);
    setLocalSearch("");
    setLoading(true);
    submit();
    setLoading(false);
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-md">
      <h5 className="text-lg font-bold mb-4">Search Form</h5>

      <form
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"
        onSubmit={(e) => e.preventDefault()} // prevent full reload
      >
        {/* Search box */}
        <div className="form-control flex-1">
          <input
            type="search"
            name="search"
            value={localSearch}
            onChange={(e) => {
              setLocalSearch(e.target.value);
              debouncedSubmit(e.currentTarget.form);
            }}
            placeholder="Search"
            className="input input-bordered bg-white w-full"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                submit(e.currentTarget.form, { replace: true });
              }
            }}
          />
        </div>

        {/* Dropdowns using statusOptions */}
        <FormSelectGroup
          label="Medical Status"
          name="medicalStatus"
          value={medicalStatus}
          options={statusOptions.medicalStatus}
          onChange={(e) => submit(e.currentTarget.form, { replace: true })}
        />

        <FormSelectGroup
          label="CoC Status"
          name="cocStatus"
          value={cocStatus}
          options={statusOptions.cocStatus}
          onChange={(e) => submit(e.currentTarget.form, { replace: true })}
        />

        <FormSelectGroup
          label="Visa Status"
          name="visaStatus"
          value={visaStatus}
          options={statusOptions.visaStatus}
          onChange={(e) => submit(e.currentTarget.form, { replace: true })}
        />

        <FormSelectGroup
          label="Ticket"
          name="ticket"
          value={ticket}
          options={statusOptions.ticket}
          onChange={(e) => submit(e.currentTarget.form, { replace: true })}
        />

        <FormSelectGroup
          label="Wokala"
          name="wokala"
          value={wokala}
          options={statusOptions.wokala}
          onChange={(e) => submit(e.currentTarget.form, { replace: true })}
        />

        <FormSelectGroup
          label="Selected By"
          name="selectedBy"
          value={selectedBy}
          options={statusOptions.selectedBy}
          onChange={(e) => submit(e.currentTarget.form, { replace: true })}
        />

        <FormSelectGroup
          label="Tasheer"
          name="tasheer"
          value={tasheer}
          options={statusOptions.tasheer}
          onChange={(e) => submit(e.currentTarget.form, { replace: true })}
        />

        <FormSelectGroup
          label="LMIS"
          name="lmis"
          value={lmis}
          options={statusOptions.lmis}
          onChange={(e) => submit(e.currentTarget.form, { replace: true })}
        />

        <FormSelectGroup
          name="sort"
          value={sort}
          options={Object.values(JOB_SORT_BY).map((item) => ({
            label: item,
            value: item,
          }))}
          onChange={(e) => submit(e.currentTarget.form, { replace: true })}
        />
      </form>

      {/* Reset Button */}
      <div className="mt-5 flex justify-center">
        <Button type="primary">
          <Link to="/dashboard/candidate-attendance" onClick={handleReset}>
            Reset
          </Link>
        </Button>
      </div>

      {/* Loading Indicator */}
      {loading && (
        <div className="mt-3 flex justify-center">
          <Spin />
        </div>
      )}
    </div>
  );
};

export default SearchContainer2;
