import { toast } from "react-toastify";
import customFetch from "../utils/customFetch";
import { useLoaderData } from "react-router-dom";
import { useContext, createContext } from "react";
import { TeachersContainer } from "../components";

export const loader = async ({ request }) => {
  const params = Object.fromEntries([
    ...new URL(request.url).searchParams.entries(),
  ]);

  try {
    const { data } = await customFetch.get("/teachers", {
      params,
    });

    return { data, selectedParams: { ...params } };
  } catch (error) {
    toast.error(error?.response?.data?.msg);
    return error;
  }
};

const TeachersContext = createContext();

const Teachers = () => {
  const { data, selectedParams } = useLoaderData();
  console.log(data);

  return (
    <TeachersContext.Provider value={{ data, selectedParams }}>
      <TeachersContainer />
    </TeachersContext.Provider>
  );
};

export const useTeachersContext = () => useContext(TeachersContext);

export default Teachers;
