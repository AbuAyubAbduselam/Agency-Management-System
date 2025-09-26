// Candidate.jsx
import { Link, useSubmit } from "react-router-dom";
import day from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import { Button, Modal, Popover } from "antd";
import { EditOutlined, DeleteOutlined, FileTextOutlined } from "@ant-design/icons";
import { renderStatus } from "../utils/colorStatus";

day.extend(advancedFormat);

const Candidate = ({
  _id,
  avatar,
  firstName,
  lastName,
  middleName,
  gender,
  dateOfBirth,
  passportNo,
  phoneNo,
  narrativePhoneNo,
  religion,
  laborId,
  cvStatus,
  cocStatus,
  musanedStatus,
  medicalStatus,
  haveExperience,
  availabilityStatus,
  cvSentTo,
  medicalDate,
  isSelected,
  onCheckboxChange,
  narrative,
  note,
  code,
}) => {
  const age = dateOfBirth ? day().diff(day(dateOfBirth), "year") : "-";
  const medicalDays = medicalDate ? day().diff(day(medicalDate), "day") : "--";
  const submit = useSubmit();

  const showDeleteConfirm = () => {
    Modal.confirm({
      title: "Are you sure you want to delete this candidate?",
      content: "This action cannot be undone.",
      okText: "Continue",
      cancelText: "Cancel",
      okType: "danger",
      onOk() {
        submit(null, { method: "post", action: `../dashboard/delete-candidate/${_id}` });
      }
    });
  };

  return (
    <tbody>
      <tr>
        <th>
          <input
            type="checkbox"
            className="checkbox"
            checked={isSelected}
            onChange={() => onCheckboxChange(_id)}
          />
        </th>
        <td>
          <div className="flex items-center gap-3">
            <div className="avatar">
              <div className="mask mask-squircle h-12 w-12">
                <img src={avatar} alt="Photo" />
              </div>
            </div>
          </div>
        </td>
        <td>{[firstName, middleName, lastName].filter(Boolean).join(" ")}</td>
        <td>{code}</td>
        <td>{gender}</td>
        <td>{age}</td>
        <td>{passportNo}</td>
        <td>{laborId}</td>
        <td>{phoneNo}</td>
        <td>{narrative}</td>
        <td>{religion}</td>
        <td>{renderStatus("cvStatus", cvStatus)}</td>
        <td>{renderStatus("cvSentTo", cvSentTo)}</td>
        <td>{renderStatus("cocStatus", cocStatus)}</td>
        <td>{renderStatus("musanedStatus", musanedStatus)}</td>
        <td>{renderStatus("medicalStatus", medicalStatus)}</td>
        <td>{medicalDays} days ago</td>
        <td>{haveExperience}</td>
        <td> {note ? (
    <Popover content={note} title="Note">
      <Button size="small" icon={<FileTextOutlined />}>View</Button>
    </Popover>
  ) : (
    <span style={{ color: "#999" }}>--</span>
  )}</td>
        <td>{renderStatus("availabilityStatus", availabilityStatus)}</td>
        <td>
          <Link to={`../dashboard/edit-candidate/${_id}`}>
            <Button icon={<EditOutlined />} type="primary" />
          </Link>
        </td>
        <td>
          <Button
            icon={<DeleteOutlined />}
            type="primary"
            danger
            onClick={showDeleteConfirm}
          />
        </td>
      </tr>
    </tbody>
  );
};

export default Candidate;
