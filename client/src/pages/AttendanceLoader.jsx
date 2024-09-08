import { toast } from "react-toastify";
import customFetch from "../utils/customFetch";

export const loader = async ({ request }) => {
  const url = new URL(request.url);
  const date = url.searchParams.get("date");

  try {
    const { data } = await customFetch.get(
      `/attendance/students${date ? `?date=${date}` : ""}`
    );
    return data;
  } catch (error) {
    toast.error(error?.response?.data?.msg);
    return error;
  }
};

const AttendanceLoader = () => {
  return <div>AttendanceLoader</div>;
};
export default AttendanceLoader;
