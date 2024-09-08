import { useRef, useState } from "react";
import Student from "./Student";
import Wrapper from "../assets/wrappers/StudentsContainer";
import { AddStudent, AddTeacher } from "../pages";
import { PlusOutlined, CloseOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useTeachersContext } from "../pages/Teachers";
import PageBtnContainerTeachers from "./PageBtnContainerTeachers";
import Teacher from "./Teacher";

const TeachersContainer = () => {
  const { data } = useTeachersContext();
  const { teachers, totalTeachers, numOfPages } = data;

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
        <div className="flex justify-between mb-10">
          <Button
            className="btn flex"
            onClick={showModal}
            icon={<PlusOutlined />}
          >
            <span className="ml-3">Add Teacher</span>
          </Button>
          {isModalVisible && (
            <div className="modal modal-open">
              <div
                ref={modalRef}
                className="modal-box bg-white max-w-7xl relative"
              >
                <button
                  className="fixed top-2 right-4 bg-transparent border-0 text-gray-500 text-lg"
                  onClick={closeModal}
                >
                  <CloseOutlined />
                </button>
                <AddTeacher closeModal={closeModal} />
              </div>
            </div>
          )}
        </div>
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
        <Button
          className="btn flex"
          onClick={showModal}
          icon={<PlusOutlined />}
        >
          <span className="ml-3">Add Teacher</span>
        </Button>
        {isModalVisible && (
          <div className="modal modal-open">
            <div
              ref={modalRef}
              className="modal-box bg-white max-w-7xl relative"
            >
              <button
                className="fixed top-2 right-4 bg-transparent border-0 text-gray-500 text-lg"
                onClick={closeModal}
              >
                <CloseOutlined />
              </button>
              <AddTeacher closeModal={closeModal} />
            </div>
          </div>
        )}
      </div>

      <div className="students">
        {teachers.map((teacher) => (
          <Teacher key={teacher._id} {...teacher} />
        ))}
      </div>
      {numOfPages > 1 && <PageBtnContainerTeachers />}
    </Wrapper>
  );
};

export default TeachersContainer;
