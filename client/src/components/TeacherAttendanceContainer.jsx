import { useRef, useState } from "react";
import Wrapper from "../assets/wrappers/CandidatesContainer"; 
import { PlusOutlined, CloseOutlined } from "@ant-design/icons";
import { Button } from "antd";
import PageBtnContainerTeachers from "./PageBtnContainerTeachers";
import TeacherAttend from "./TeacherAttend";
import { useTeacherAttendanceContext } from "../pages/TeacherAttendance";

const TeachersAttendanceContainer = () => {
  const { data } = useTeacherAttendanceContext();
  const { teachers, totalTeachers, numOfPages } = data;
  console.log(data);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const modalRef = useRef(null);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  if (teachers.length === 0) {
    return (
      <Wrapper>
        <h2>No cvs to display...</h2>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <div className="flex justify-between mb-10">
        <h5 className="font-bold">
          {totalTeachers} {totalTeachers > 1 ? "teachers" : "teacher"} found
        </h5>
      </div>

      <div className="teachers">
        {teachers.map((teacher) => (
          <TeacherAttend key={teacher._id} {...teacher} />
        ))}
      </div>

      {numOfPages > 1 && <PageBtnContainerTeachers />}
    </Wrapper>
  );
};

export default TeachersAttendanceContainer;
