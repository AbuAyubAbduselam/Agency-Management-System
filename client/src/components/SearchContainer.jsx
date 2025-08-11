import { useSubmit, Link } from "react-router-dom";
import { JOB_SORT_BY } from "../../../utils/constant";
import { useAllCandidatesContext } from "../pages/AllCandidates";
import FormSelectGroup from "../components/FormSelectGroup"; // Adjust path if needed
import { Button } from "antd";
import { statusOptions } from "../utils/constants";

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

  return (
    <div className="p-6 bg-white shadow-md rounded-md">
      <h5 className="text-lg font-bold mb-4">Search Form</h5>
      <form className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Search Input */}
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

        {/* Selects from statusOptions */}
        <FormSelectGroup
          name="gender"
          value={gender}
          onChange={handleSelectChange}
          options={statusOptions.gender}
        />
        <FormSelectGroup
          name="medicalStatus"
          value={medicalStatus}
          onChange={handleSelectChange}
          options={statusOptions.medicalStatus}
        />
        <FormSelectGroup
          name="religion"
          value={religion}
          onChange={handleSelectChange}
          options={statusOptions.religion}
        />
        <FormSelectGroup
          name="cvStatus"
          value={cvStatus}
          onChange={handleSelectChange}
          options={statusOptions.cvStatus}
        />
        <FormSelectGroup
          name="cocStatus"
          value={cocStatus}
          onChange={handleSelectChange}
          options={statusOptions.cocStatus}
        />
        <FormSelectGroup
          name="musanedStatus"
          value={musanedStatus}
          onChange={handleSelectChange}
          options={statusOptions.musanedStatus}
        />
        <FormSelectGroup
          name="availabilityStatus"
          value={availabilityStatus}
          onChange={handleSelectChange}
          options={statusOptions.availabilityStatus}
        />
        <FormSelectGroup
          name="cvSentTo"
          value={cvSentTo}
          onChange={handleSelectChange}
          options={statusOptions.cvSentTo}
        />
        <FormSelectGroup
          name="sort"
          value={sort}
          onChange={handleSelectChange}
          options={Object.values(JOB_SORT_BY).map((item) => ({
            label: item,
            value: item,
          }))}
        />

        {/* Reset Button */}
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
