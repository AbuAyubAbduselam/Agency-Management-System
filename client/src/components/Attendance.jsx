import { Link, Form } from "react-router-dom";
import day from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import { Button } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { renderStatus } from "../utils/colorStatus";
import { UserOutlined } from "@ant-design/icons";

day.extend(advancedFormat);

const Attendance = ({
  _id,
  avatar,
  ticketDate,
  tasheerDate,
  firstName,
  middleName,
  contractCreationDate,
  laborId,
  passportNo,
  selectedBy,
  tasheer,
  visaStatus,
  cocStatus,
  medicalStatus,
  lmis,
  wokala,
  ticket,
  isSelected,
  onCheckboxChange,
    qrCode,
  arrivalCity,
  medicalDate
}) => {

  const contractDate = contractCreationDate? day(contractCreationDate).format("DD MMMM YYYY"): "-----";
  const medicalDay = medicalDate? day(medicalDate).format("DD MMMM YYYY"): "-----";
  const formattedTicketDate = ticketDate? day(ticketDate).format("DD MMMM YYYY hh:mm: A"): "-----";
const formattedTasheerDate = tasheerDate? day(tasheerDate).format("DD MMMM YYYY hh:mm: A"):"-----";



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
               {avatar ? (
  <img src={avatar} alt="Photo" />
) : (
  <div className="flex items-center justify-center bg-gray-200 w-full h-full">
    <span className="text-xl text-gray-500">
      <UserOutlined />
    </span>
  </div>
)}

              </div>
            </div>
          </div>
        </td>
        <td>
          <div>
            <div className="font-bold">
              {firstName} <span className="font-bold">{middleName}</span>
            </div>
          </div>
        </td>
        <td>{passportNo}</td>
        <td>{laborId}</td>
        <td>{contractDate}</td>
        <td>{renderStatus("medicalStatus", medicalStatus)}</td>
        <td>{medicalDay}</td>
        <td>{renderStatus("selectedBy", selectedBy)}</td>
        <td>{renderStatus("tasheer", tasheer)}</td>
          <td>{formattedTasheerDate}</td>
        <td>{renderStatus("wokala", wokala)}</td>
        <td>{renderStatus("visaStatus", visaStatus)}</td>
        <td>{renderStatus("cocStatus", cocStatus)}</td>
        <td>{renderStatus("lmis", lmis)}</td>
        <td>{qrCode}</td>
        <td>{arrivalCity}</td>
        <td>{renderStatus("ticket", ticket)}</td>
          <td>{formattedTicketDate}</td>
        <td>
          <Link to={`../edit-candidate/${_id}`}>
            <Button
              icon={<EditOutlined />}
              type="primary"
              
            />
          </Link>
        </td>
       
      </tr>
    </tbody>
  );
};

export default Attendance;
