import { Link } from "react-router-dom";
import { Card, Button, Form } from "antd";
import day from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

day.extend(advancedFormat);

const Teacher = ({
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

          {/* Buttons: Edit and Delete */}
          <div className="flex justify-center gap-10 pt-5">
            <Link to={`../edit-teacher/${_id}`}>
              <Button
                icon={<EditOutlined />}
                type="primary"
                className="edit-btn !bg-[#059669]"
              />
            </Link>
            <Form method="post" action={`../delete-teacher/${_id}`}>
              <Button
                icon={<DeleteOutlined />}
                type="primary"
                danger
                htmlType="submit"
                className="delete-btn"
              />
            </Form>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Teacher;
