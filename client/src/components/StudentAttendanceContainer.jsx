import { useRef, useState } from "react";
import Wrapper from "../assets/wrappers/StudentsContainer";

import { UseAllStudentsAttendanceContext } from "../pages/StudentAttendance";
import Attendance from "./Attendance";
import PageBtnContainer2 from "./PageBtnContainer2";
import { Link } from "react-router-dom";

const StudentAttendanceContainer = () => {
  const { data } = UseAllStudentsAttendanceContext();
  const { students, totalStudents, numOfPages } = data;

  if (students.length === 0) {
    return (
      <Wrapper>
        <h2>No students to display...</h2>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <div className="flex justify-between mb-10">
        <h5 className="font-bold">
          {totalStudents} {totalStudents > 1 ? "students" : "student"} found
        </h5>
        <Link
          className="btn flex"
          to="/attendance-detail" // Update this path according to your routing
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="ml-3">Attendance Detail</span>
        </Link>
      </div>

      <div className="students">
        {students.map((student) => (
          <Attendance key={student._id} {...student} />
        ))}
      </div>
      {numOfPages > 1 && <PageBtnContainer2 />}
    </Wrapper>
  );
};

export default StudentAttendanceContainer;
