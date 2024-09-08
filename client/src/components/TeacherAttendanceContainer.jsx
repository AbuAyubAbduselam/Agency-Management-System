import { useRef, useState } from "react";
import Student from "./Student";
import Wrapper from "../assets/wrappers/StudentsContainer";
import { AddStudent, AddTeacher } from "../pages";
import { PlusOutlined, CloseOutlined } from "@ant-design/icons";
import { Button } from "antd";
import PageBtnContainerTeachers from "./PageBtnContainerTeachers";
import Teacher from "./Teacher";
import TeacherAttendance, {
  useTeacherAttendanceContext,
} from "../pages/TeacherAttendance";
import TeacherAttend from "./TeacherAttend";

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
        <h2>No teachers to display...</h2>
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

      <div className="students">
        {teachers.map((teacher) => (
          <TeacherAttend key={teacher._id} {...teacher} />
        ))}
      </div>
      {numOfPages > 1 && <PageBtnContainerTeachers />}
    </Wrapper>
  );
};

export default TeachersAttendanceContainer;
