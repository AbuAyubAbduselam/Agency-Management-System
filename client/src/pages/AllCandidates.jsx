import { toast } from "react-toastify";
import { CandidatesContainer, SearchContainer } from "../components";
import customFetch from "../utils/customFetch";
import { useLoaderData } from "react-router-dom";
import { useContext, createContext } from "react";

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
  const { data, selectedParams } = useLoaderData();

  return (
    <AllCandidatesContext.Provider value={{ data, selectedParams }}>
      <SearchContainer />
      <CandidatesContainer />
    </AllCandidatesContext.Provider>
  );
};

export const useAllCandidatesContext = () => useContext(AllCandidatesContext);

export default AllCandidates;
