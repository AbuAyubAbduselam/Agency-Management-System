import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, Button, Form, notification } from "antd";
import day from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import customFetch from "../utils/customFetch";

day.extend(advancedFormat);

const TeacherAttend = ({
  _id,
  teacherID,
  firstName,
  lastName,
  gender,
  dateOfBirth,
  email,
  phoneNumber,
  address,
  classAssigned,
}) => {
  const date = day(dateOfBirth).format("MMM Do, YYYY");
  const age = day().diff(day(dateOfBirth), "year");

  const [clickedButton, setClickedButton] = useState("");

  useEffect(() => {
    const storedButton = localStorage.getItem(`${teacherID}_attendance`);
    const storedExpiration = localStorage.getItem(`${teacherID}_expiration`);

    const now = day();
    const today6am = day().hour(6).minute(0).second(0);

    if (storedExpiration && now.isAfter(day(storedExpiration))) {
      localStorage.removeItem(`${teacherID}_attendance`);
      localStorage.removeItem(`${teacherID}_expiration`);
    } else if (storedButton) {
      setClickedButton(storedButton);
    }

    if (!storedExpiration || now.isAfter(day(storedExpiration))) {
      localStorage.setItem(
        `${teacherID}_expiration`,
        today6am.add(1, "day").toISOString()
      );
    }
  }, [teacherID]);

  useEffect(() => {
    if (clickedButton) {
      localStorage.setItem(`${teacherID}_attendance`, clickedButton);
    }
  }, [clickedButton, teacherID]);

  const handleSubmit = async (buttonType) => {
    const attendanceData = {
      firstName,
      lastName,
      teacherID,
      status: buttonType,
    };
    console.log(attendanceData);

    setClickedButton(buttonType);

    try {
      await customFetch.post("/attendance/teachers", attendanceData);
      notification.success({ message: `${buttonType} recorded successfully!` });
    } catch (error) {
      console.log(error);
      notification.error({ message: "Failed to record attendance" });
    }
  };

  return (
    <div className="flex justify-center py-5">
      <Card
        title={
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold">
              {firstName} {lastName}
            </span>
          </div>
        }
        bordered={true}
        className="shadow-lg w-full md:w-3/5 rounded-lg"
        hoverable
      >
        <div className="flex flex-col gap-4">
          {/* Teacher ID */}
          <p className="font-semibold">
            Teacher ID: <span className="font-normal">{teacherID}</span>
          </p>

          {/* Gender */}
          <p className="font-semibold">
            Gender: <span className="font-normal capitalize">{gender}</span>
          </p>

          {/* Age */}
          <p className="font-semibold">
            Age: <span className="font-normal">{age} years</span>
          </p>

          {/* Date of Birth */}
          <p className="font-semibold">
            Date of Birth: <span className="font-normal">{date}</span>
          </p>

          {/* Email */}
          <p className="font-semibold">
            Email: <span className="font-normal">{email}</span>
          </p>

          {/* Phone Number */}
          <p className="font-semibold">
            Phone: <span className="font-normal">{phoneNumber}</span>
          </p>

          {/* Address */}
          <p className="font-semibold">
            Address: <span className="font-normal">{address}</span>
          </p>

          {/* Class Assigned */}
          <p className="font-semibold">
            Class Assigned:{" "}
            <span className="font-normal">{classAssigned.join(", ")}</span>
          </p>

          {/* Attendance Buttons */}
          <div className="flex justify-center gap-10 pt-5">
            <Button
              icon={<CheckCircleOutlined />}
              type={clickedButton === "Present" ? "success" : "primary"}
              onClick={() => handleSubmit("Present")}
              disabled={clickedButton === "Present"}
            />
            <Button
              icon={<CloseCircleOutlined />}
              type={clickedButton === "Absent" ? "danger" : "primary"}
              danger
              onClick={() => handleSubmit("Absent")}
              disabled={clickedButton === "Absent"}
            />
            <Button
              icon={<ClockCircleOutlined />}
              type={clickedButton === "Late" ? "warning" : "primary"}
              onClick={() => handleSubmit("Late")}
              disabled={clickedButton === "Late"}
            />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default TeacherAttend;
