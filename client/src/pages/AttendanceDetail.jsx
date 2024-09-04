import { useState } from "react";
import { toast } from "react-toastify";
import customFetch from "../utils/customFetch";
import { useLoaderData } from "react-router-dom";

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

const AttendanceDetail = () => {
  const [date, setDate] = useState("");
  const { studentAttendance } = useLoaderData();

  const handleDateChange = (e) => {
    setDate(e.target.value);
  };

  const handleViewAttendance = async () => {
    try {
      const { data } = await customFetch.get(
        `/attendance/students?date=${date}`
      );
      console.log(data);
    } catch (error) {
      toast.error(error?.response?.data?.msg);
    }
  };

  return (
    <div className="container mx-auto px-4">
      <div className="h-lvh">
        <div className="card w-96 shadow-xl bg-white h-[200px] m-10 mx-auto">
          <div className="card-body">
            <h2 className="card-title">Enter Date!</h2>
            <input
              type="date"
              value={date}
              onChange={handleDateChange}
              placeholder="Type here"
              className="input input-bordered bg-slate-400 w-full max-w-xs mb-4"
            />
            <div className="card-actions justify-end">
              <button
                className="btn btn-primary"
                onClick={handleViewAttendance}
              >
                View Attendance
              </button>
            </div>
          </div>
        </div>

        {/* Render the attendance table here */}
        <div className="overflow-x-auto">
          <table className="table mx-auto">
            <thead>
              <tr>
                <th>
                  <label>
                    <input type="checkbox" className="checkbox" />
                  </label>
                </th>
                <th>Name</th>
                <th>ID Number</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {studentAttendance.map((student) => (
                <tr key={student.id}>
                  <th>
                    <label>
                      <input type="checkbox" className="checkbox" />
                    </label>
                  </th>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="avatar"></div>
                      <div>
                        <div className="font-bold">{student.firstName}</div>
                        <div className="text-sm opacity-50">
                          {student.middleName}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>{student.idNumber}</td>
                  <td>{student.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AttendanceDetail;
