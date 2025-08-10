import { toast } from "react-toastify";
import { CandidatesContainer, SearchContainer } from "../components";
import customFetch from "../utils/customFetch";
import { useLoaderData } from "react-router-dom";
import { useContext, createContext, useState, useEffect } from "react";

export const loader = async ({ request }) => {
  const params = Object.fromEntries([
    ...new URL(request.url).searchParams.entries(),
  ]);

  try {
    const { data } = await customFetch.get("/candidates", {
      params,
    });

    return { data, selectedParams: { ...params } };
  } catch (error) {
    toast.error(error?.response?.data?.msg);
    return error;
  }
};

const AllCandidatesContext = createContext();

const AllCandidates = () => {
  // load data + params from loader (initial values)
  const { data, selectedParams: initialParams } = useLoaderData();

  // Make selectedParams reactive state so we can update it inside SearchContainer
  const [selectedParams, setSelectedParams] = useState(initialParams || {});

  // Optional: if loader params change, sync state (rare case)
  useEffect(() => {
    setSelectedParams(initialParams || {});
  }, [initialParams]);

  return (
    <AllCandidatesContext.Provider
      value={{
        data,
        selectedParams,
        setSelectedParams, // <-- expose setter here!
      }}
    >
      <SearchContainer />
      <CandidatesContainer />
    </AllCandidatesContext.Provider>
  );
};

export const useAllCandidatesContext = () => useContext(AllCandidatesContext);

export default AllCandidates;
