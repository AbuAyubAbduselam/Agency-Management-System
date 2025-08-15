import { toast } from "react-toastify";
import { CandidateAttendanceContainer, Loading } from "../components";
import customFetch from "../utils/customFetch";
import { useLoaderData, useNavigation } from "react-router-dom";
import { useContext, createContext, useState, useEffect } from "react";
import SearchContainer2 from "../components/SearchContainer2";

export const loader = async ({ request }) => {
  const params = Object.fromEntries([
    ...new URL(request.url).searchParams.entries(),
  ]);

  try {
    const { data } = await customFetch.get("/attendance/selected", { params });
    return { data, selectedParams: { ...params } };
  } catch (error) {
    toast.error(error?.response?.data?.msg);
    return error;
  }
};

const AllCandidatesAttendanceContext = createContext();

const CandidateAttendance = () => {
  const { data, selectedParams: initialParams } = useLoaderData();
  const [selectedParams, setSelectedParams] = useState(initialParams || {});

  // ✅ Load from sessionStorage (only persists until tab close)
  const [selectedCandidateIds, setSelectedCandidateIds] = useState(() => {
    const stored = sessionStorage.getItem("selectedCandidateIds_attendance");
    return stored ? JSON.parse(stored) : [];
  });

  const navigation = useNavigation();
  const isLoading = navigation.state === "loading";

  // ✅ Save to sessionStorage whenever it changes
  useEffect(() => {
    sessionStorage.setItem(
      "selectedCandidateIds_attendance",
      JSON.stringify(selectedCandidateIds)
    );
  }, [selectedCandidateIds]);

  useEffect(() => {
    setSelectedParams(initialParams || {});
  }, [initialParams]);

  return (
    <AllCandidatesAttendanceContext.Provider
      value={{
        data,
        selectedParams,
        setSelectedParams,
        selectedCandidateIds,
        setSelectedCandidateIds,
      }}
    >
      <SearchContainer2 />
      {isLoading && (
        <div className="my-4">
          <Loading />
        </div>
      )}
      <CandidateAttendanceContainer />
    </AllCandidatesAttendanceContext.Provider>
  );
};

export const UseAllCandidatesAttendanceContext = () =>
  useContext(AllCandidatesAttendanceContext);

export default CandidateAttendance;
