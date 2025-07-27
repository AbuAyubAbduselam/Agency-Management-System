import { toast } from "react-toastify";
import {CandidateAttendanceContainer } from "../components";
import customFetch from "../utils/customFetch";
import { useLoaderData } from "react-router-dom";
import { useContext, createContext } from "react";
import TeachersAttendanceContainer from "../components/TeacherAttendanceContainer";

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

const TeacherAttendanceContext = createContext();

const TeacherAttendance = () => {
  const { data, selectedParams } = useLoaderData();

  return (
    <TeacherAttendanceContext.Provider value={{ data, selectedParams }}>
      <TeachersAttendanceContainer />
    </TeacherAttendanceContext.Provider>
  );
};

export const useTeacherAttendanceContext = () =>
  useContext(TeacherAttendanceContext);

export default TeacherAttendance;
