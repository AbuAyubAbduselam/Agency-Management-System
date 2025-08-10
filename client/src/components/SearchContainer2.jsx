import { useSubmit, Link } from "react-router-dom";
import { JOB_SORT_BY } from "../../../utils/constant";
import { UseAllCandidatesAttendanceContext } from "../pages/CandidateAttendance";
import FormSelectGroup from "./FormSelectGroup";
import { Button } from "antd";

const SearchContainer2 = () => {
  const { selectedParams, setSelectedParams } =
    UseAllCandidatesAttendanceContext();
  const { search, sort, gender,visaStatus,ticket,wokala,selectedBy,medicalStatus,tasheer,cocStatus,lmis } = selectedParams;

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
      classes: "all",
      sort: "newest",
    };
    setSelectedParams(resetParams);
    submit();
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-md">
      <h5 className="text-lg font-bold mb-4">Search Form</h5>
      <form className="grid
            grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
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
          label="Medical Status"
          name="medicalStatus"
          value={medicalStatus}
          options={["Medical Status", "fit", "unfit", "waiting", "booked"]}
          onChange={(e) => submit(e.currentTarget.form)}
        />
        <FormSelectGroup
          label="CoC Status"
          name="cocStatus"
          value={cocStatus}
          options={["CoC Status", "done", "waiting", "booked"]}
          onChange={(e) => submit(e.currentTarget.form)}
        />
        <FormSelectGroup
          label="Visa Status"
          name="visaStatus"
          value={visaStatus}
          options={[
            "Visa Status",
            "ready for embassy",
            "sent to embassy",
            "visa issued",
            "visa canceled",
            "arrived ksa",
          ]}
          onChange={(e) => submit(e.currentTarget.form)}  
        />
        <FormSelectGroup
          label="Ticket"
          name="ticket"
          value={ticket}
          options={["Ticket", "waiting", "booked", "done"]}
          onChange={(e) => submit(e.currentTarget.form)}
        />
        <FormSelectGroup   
          label="Wokala"
          name="wokala"
          value={wokala}
          options={["Wokala", "waiting tasdeeq", "waiting", "done"]}
          onChange={(e) => submit(e.currentTarget.form)}  
        />
        <FormSelectGroup
          label="Selected By"
          name="selectedBy"
          value={selectedBy}
          options={["Selected By", "A", "B", "C"]}
          onChange={(e) => submit(e.currentTarget.form)}
        />
        <FormSelectGroup
          label="Tasheer"
          name="tasheer"
          value={tasheer}
          options={["Tasheer", "waiting", "booked", "done"]}
          onChange={(e) => submit(e.currentTarget.form)}
        />
        <FormSelectGroup
          label="LMIS"
          name="lmis"
          value={lmis}
          options={["LMIS", "draft", "pending", "issued", "rejected"]}
          onChange={(e) => submit(e.currentTarget.form)}
        />

          <FormSelectGroup
                  name="sort"
                  value={sort}
                  onChange={(e) => submit(e.currentTarget.form)}
                  options={Object.values(JOB_SORT_BY)}
                />
      
            
      </form>

      <div className="mt-5 flex justify-center">
        <Button type="primary">
          <Link to="/dashboard/candidate-attendance" onClick={handleReset}>
            Reset
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default SearchContainer2;
