import { useState } from "react";
import { toast } from "react-toastify";
import customFetch from "../utils/customFetch";
import { Link, useLoaderData } from "react-router-dom";
import { Layout, Card, Input, Button } from "antd";

const AttendanceDetail = () => {
  const [date, setDate] = useState("");

  const handleDateChange = (e) => {
    setDate(e.target.value);
  };

  const handleViewAttendance = async () => {};

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
        <Link to="../attendance-detail">
          <Button type="primary" block>
            View Attendance
          </Button>
        </Link>
      </Card>
    </Layout>
  );
};

export default AttendanceDetail;
