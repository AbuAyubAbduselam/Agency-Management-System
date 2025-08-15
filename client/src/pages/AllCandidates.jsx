import { toast } from "react-toastify";
import { CandidatesContainer, SearchContainer, Loading } from "../components";
import customFetch from "../utils/customFetch";
import { useLoaderData, useNavigation } from "react-router-dom";
import { useContext, createContext, useState, useEffect } from "react";

export const loader = async ({ request }) => {
  const params = Object.fromEntries([
    ...new URL(request.url).searchParams.entries(),
  ]);

  try {
    const { data } = await customFetch.get("/candidates", { params });
    return { data, selectedParams: { ...params } };
  } catch (error) {
    toast.error(error?.response?.data?.msg);
    return error;
  }
};

const AllCandidatesContext = createContext();

const AllCandidates = () => {
  const { data, selectedParams: initialParams } = useLoaderData();
  const [selectedParams, setSelectedParams] = useState(initialParams || {});

  // ✅ Use sessionStorage for persistence until tab is closed
  const [selectedIds, setSelectedIds] = useState(() => {
    return new Set(
      JSON.parse(sessionStorage.getItem("selectedCandidateIds") || "[]")
    );
  });

  const [selectAllGlobal, setSelectAllGlobal] = useState(() => {
    return JSON.parse(sessionStorage.getItem("selectAllGlobal") || "false");
  });

  const navigation = useNavigation();
  const isLoading = navigation.state === "loading";

  // Save to sessionStorage on changes
  useEffect(() => {
    sessionStorage.setItem(
      "selectedCandidateIds",
      JSON.stringify(Array.from(selectedIds))
    );
    sessionStorage.setItem(
      "selectAllGlobal",
      JSON.stringify(selectAllGlobal)
    );
  }, [selectedIds, selectAllGlobal]);

  useEffect(() => {
    setSelectedParams(initialParams || {});
  }, [initialParams]);

  return (
    <AllCandidatesContext.Provider
      value={{
        data,
        selectedParams,
        setSelectedParams,
        selectedIds,
        setSelectedIds,
        selectAllGlobal,
        setSelectAllGlobal,
      }}
    >
      <SearchContainer />
      {isLoading && (
        <div className="my-4">
          <Loading />
        </div>
      )}
      <CandidatesContainer />
    </AllCandidatesContext.Provider>
  );
};

export const useAllCandidatesContext = () => useContext(AllCandidatesContext);

export default AllCandidates;
