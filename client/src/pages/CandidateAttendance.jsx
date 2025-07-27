import { toast } from "react-toastify";
import { CandidateAttendanceContainer } from "../components";
import customFetch from "../utils/customFetch";
import { useLoaderData } from "react-router-dom";
import { useContext, createContext } from "react";
import SearchContainer2 from "../components/SearchContainer2";

export const loader = async ({ request }) => {
  const params = Object.fromEntries([
    ...new URL(request.url).searchParams.entries(),
  ]);

  try {
    const { data } = await customFetch.get("/attendance/selected", {
      params,
    });


    return { data, selectedParams: { ...params } };
  } catch (error) {
    toast.error(error?.response?.data?.msg);
    return error;
  }
};

const AllCandidatesAttendanceContext = createContext();

const CandidateAttendance = () => {
  const { data, selectedParams } = useLoaderData();


  return (
    <AllCandidatesAttendanceContext.Provider value={{ data, selectedParams }}>
      <SearchContainer2 />
      <CandidateAttendanceContainer />
    </AllCandidatesAttendanceContext.Provider>
  );
};

export const UseAllCandidatesAttendanceContext = () =>
  useContext(AllCandidatesAttendanceContext);

export default CandidateAttendance;
