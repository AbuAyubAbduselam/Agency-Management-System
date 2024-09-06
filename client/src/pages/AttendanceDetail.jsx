import { useState } from "react";
import { toast } from "react-toastify";
import customFetch from "../utils/customFetch";
import { useLoaderData } from "react-router-dom";
import { Layout, Card, Input, Button } from "antd";

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
    <Layout style={{ minHeight: "100vh", padding: "24px" }}>
      <Card
        title="Enter Date!"
        style={{ width: 300, margin: "0 auto", marginTop: "100px" }}
      >
        <Input
          type="date"
          value={date}
          onChange={handleDateChange}
          placeholder="Select date"
          style={{ marginBottom: "16px" }}
        />
        <Button type="primary" onClick={handleViewAttendance} block>
          View Attendance
        </Button>
      </Card>
    </Layout>
  );
};

export default AttendanceDetail;
