import { useState } from "react";
import { Layout, Button, Input, Select } from "antd";
import customFetch from "../utils/customFetch";
import { CLASSES } from "../../../utils/constant";
import Wrapper from "../assets/wrappers/DashboardFormPage";
import { useMediaQuery } from "react-responsive";

const { Header, Content } = Layout;
const { Option } = Select;

const AttendanceDetail = () => {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

  const fetchAttendance = async () => {
    try {
      const url = `/attendance/candidates?date=${selectedDate}&classes=${selectedClass}`;
      console.log("Fetching attendance with URL:", url);
      const response = await customFetch.get(url);
      setAttendanceRecords(response.data);
    } catch (error) {
      console.error("Error fetching attendance records", error);
    }
  };

  return (
    <Wrapper>
      <Layout className="min-h-screen bg-white">
        <Header className="bg-white">
          <div className="text-2xl font-bold">Attendance Detail</div>
        </Header>
        <Content className="p-4">
          <div className="flex justify-center space-x-4 mb-6 flex-col md:flex-row gap-4 rounded-md">
            <div className="flex flex-col md:flex-row gap-5 w-full">
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-4 py-2 border rounded-md w-full bg-slate-200 hover:bg-slate-300 cursor-pointer"
                placeholder="Select Date"
                style={{ paddingRight: "2rem" }} // Ensure the icon is visible
              />
              <Select
                value={selectedClass}
                onChange={(value) => setSelectedClass(value)}
                placeholder="Select Class"
                className="w-full md:w-1/3 h-[44px] border-none"
              >
                {["all", ...Object.values(CLASSES)].map((clas) => (
                  <Option key={clas} value={clas}>
                    {clas}
                  </Option>
                ))}
              </Select>
            </div>
            <div>
              <Button
                type="primary"
                onClick={fetchAttendance}
                className=" bg-[#059669] hover:bg-green-600 text-white px-4 py-2 rounded-md h-[35px]"
              >
                View Attendance
              </Button>
            </div>
          </div>

          {attendanceRecords.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>First Name</th>
                    <th>Middle Name</th>
                    <th>ID Number</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceRecords.map((record) => (
                    <tr key={record._id}>
                      <td>{record.firstName}</td>
                      <td>{record.middleName}</td>
                      <td>{record.idNumber}</td>
                      <td>
                        <span
                          className={`badge ${
                            record.status === "Present"
                              ? "badge-success"
                              : record.status === "Late"
                              ? "badge-warning"
                              : "badge-error"
                          }`}
                        >
                          {record.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center text-gray-500">
              No attendance records for this date and class.
            </p>
          )}
        </Content>
      </Layout>
    </Wrapper>
  );
};

export default AttendanceDetail;
