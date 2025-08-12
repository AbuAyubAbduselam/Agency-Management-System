import { useSubmit, Link } from "react-router-dom";
import { JOB_SORT_BY } from "../../../utils/constant";
import { useAllCandidatesContext } from "../pages/AllCandidates";
import FormSelectGroup from "../components/FormSelectGroup";
import { statusOptions } from "../utils/constants";
import { Button } from "antd";

const SearchContainer2 = () => {
  const { selectedParams, setSelectedParams } = useAllCandidatesContext();
  const {
    search,
    sort,
    medicalStatus,
    gender,
    religion,
    cvStatus,
    cocStatus,
    musanedStatus,
    availabilityStatus,
    cvSentTo,
  } = selectedParams;

  const submit = useSubmit();

  const debounce = (callback, delay = 1000) => {
    let timeoutId;
    return (e) => {
      const form = e.currentTarget.form;
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        callback(form);
      }, delay);
    };
  };

  const handleReset = () => {
    const resetParams = {
      search: "",
      gender: "",
      sort: "newest",
      medicalStatus: "",
      religion: "",
      cvStatus: "",
      cocStatus: "",
      musanedStatus: "",
      availabilityStatus: "",
      cvSentTo: "",
    };
    setSelectedParams(resetParams);
    submit();
  };

  const handleSelectChange = (e) => submit(e.currentTarget.form);

  // Helper to convert {label, value}[] → string[] for FormSelectGroup
  const getStringOptions = (optionsArr) =>
    optionsArr.map((opt) => opt.label || "");

  return (
    <div className="p-6 bg-white shadow-md rounded-md">
      <h5 className="text-lg font-bold mb-4">Search Form</h5>
      <form className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="form-control flex-1">
          <input
            type="search"
            name="search"
            defaultValue={search}
            onChange={debounce((form) => submit(form))}
            placeholder="Search"
            className="input input-bordered bg-white w-full"
          />
        </div>

        <FormSelectGroup
          name="gender"
          value={gender}
          onChange={handleSelectChange}
          options={getStringOptions(statusOptions.gender)}
        />
        <FormSelectGroup
          name="medicalStatus"
          value={medicalStatus}
          onChange={handleSelectChange}
          options={getStringOptions(statusOptions.medicalStatus)}
        />
        <FormSelectGroup
          name="religion"
          value={religion}
          onChange={handleSelectChange}
          options={getStringOptions(statusOptions.religion)}
        />
        <FormSelectGroup
          name="cvStatus"
          value={cvStatus}
          onChange={handleSelectChange}
          options={getStringOptions(statusOptions.cvStatus)}
        />
        <FormSelectGroup
          name="cocStatus"
          value={cocStatus}
          onChange={handleSelectChange}
          options={getStringOptions(statusOptions.cocStatus)}
        />
        <FormSelectGroup
          name="musanedStatus"
          value={musanedStatus}
          onChange={handleSelectChange}
          options={getStringOptions(statusOptions.musanedStatus)}
        />
        <FormSelectGroup
          name="availabilityStatus"
          value={availabilityStatus}
          onChange={handleSelectChange}
          options={getStringOptions(statusOptions.availabilityStatus)}
        />
        <FormSelectGroup
          name="cvSentTo"
          value={cvSentTo}
          onChange={handleSelectChange}
          options={getStringOptions(statusOptions.cvSentTo)}
        />
        <FormSelectGroup
          name="sort"
          value={sort}
          onChange={handleSelectChange}
          options={Object.values(JOB_SORT_BY)}
        />

        <div className="mt-5 flex justify-center">
          <Button type="primary" onClick={handleReset}>
            <Link to="/dashboard">Reset</Link>
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SearchContainer2;
