import { Form, Input, Select, Button, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import Wrapper from "../assets/wrappers/DashboardFormPage";
import { useOutletContext, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import customFetch from "../utils/customFetch";
import dayjs from 'dayjs';

const cocStatusOptions = [
  { label: "Done", value: "done" },
  { label: "Waiting", value: "waiting" },
  { label: "Booked", value: "booked" },
];
const cvStatusOptions = [
  { label: "Done", value: "done" },
  { label: "Waiting", value: "waiting" },
];
const medicalStatusOptions = [
  { label: "Fit", value: "fit" },
  { label: "Booked", value: "booked" },
  { label: "Unfit", value: "unfit" },
  { label: "Waiting", value: "waiting" },
];
const musanedStatusOptions = [
  { label: "Done", value: "done" },
  { label: "Waiting", value: "waiting" },
  { label: "Pending release", value: "pending-release" },
];
const avialablityStatusOptions = [
  { label: "Available", value: "available" },
  { label: "Selected", value: "selected" },
  { label: "Unavailable", value: "unavailable" },
];

const AddCandidate = ({ closeModal }) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if ((key === "avatar" || key === "fullSizePhoto") && value && value[0]) {
        formData.append(key, value[0].originFileObj);
      } else {
        formData.append(key, value);
      }
    });
  
    const avatarFile = formData.get("avatar");
    const fullPhotoFile = formData.get("fullSizePhoto");
  
    if (avatarFile && avatarFile.size > 500000) {
      toast.error("Avatar image size too large");
      return;
    }
  
    if (fullPhotoFile && fullPhotoFile.size > 2000000) {
      toast.error("Full-size photo is too large (max 2MB)");
      return;
    }
  
    try {
      await customFetch.post("/candidates", formData);
      toast.success("Candidate added successfully");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error?.response?.data?.msg || "Error submitting form");
    }
  };
  

  return (
    <Wrapper>
      <Form form={form} layout="vertical" onFinish={handleSubmit} initialValues={{
          firstName: 'Ahmed',
          middleName: 'Ali',
          lastName: 'Hassan',
          gender: 'male',
          dateOfBirth: dayjs('2000-01-01'),
          passportNo: 'P1234567',
          phoneNo: '0912345678',
          narrativePhoneNo: '0987654321',
          religion: 'muslim',
          laborId: 'EF10237789',
          cvStatus: 'waiting',
          cocStatus: 'done',
          musanedStatus: 'done',
          medicalStatus: 'waiting',
          experienceOutside: '2 years in Dubai',
          availabilityStatus: 'available',
          cvSentTo: ' ',
        }}>
        <h4 className="form-title">Add Candidate</h4>
        <div className="form-center ">
          <Form.Item
            label="Photo"
            name="avatar"
            valuePropName="fileList"
            getValueFromEvent={(e) => e?.fileList}
          >
            <Upload
              name="avatar"
              listType="picture"
              maxCount={1}
              accept="image/*"
              beforeUpload={() => false}
            >
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
          </Form.Item>

          <Form.Item
  label="Full Size Photo"
  name="fullSizePhoto"
  valuePropName="fileList"
  getValueFromEvent={(e) => e?.fileList}
>
  <Upload
    name="fullSizePhoto"
    listType="picture"
    maxCount={1}
    accept="image/*"
    beforeUpload={() => false}
  >
    <Button icon={<UploadOutlined />}>Upload Full Size</Button>
  </Upload>
</Form.Item>

          <Form.Item
            label="First Name"
            name="firstName"
            rules={[{ required: true, message: "Please input the first name!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Middle Name"
            name="middleName"
            rules={[{ required: true, message: "Please input the middle name!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Last Name" name="lastName">
            <Input />
          </Form.Item>
          <Form.Item label="Passport No." name="passportNo">
            <Input />
          </Form.Item>

          <Form.Item label="Labor ID" name="laborId">
            <Input />
          </Form.Item>

          <Form.Item
            label="Religion"
            name="religion"
            rules={[{ required: true, message: "Please select the religion!" }]}
          >
            <Select>
              <Select.Option value="muslim">Muslim</Select.Option>
              <Select.Option value="non-muslim">Non Muslim</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Gender"
            name="gender"
            rules={[{ required: true, message: "Please select the gender!" }]}
          >
            <Select>
              <Select.Option value="male">Male</Select.Option>
              <Select.Option value="female">Female</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Birth Date"
            name="dateOfBirth"
            rules={[{ required: true, message: "Please select the birth date!" }]}
          >
            <Input type="date" />
          </Form.Item>


          <Form.Item label="Phone No." name="phoneNo">
            <Input />
          </Form.Item>

          <Form.Item label="Narrative Phone No." name="narrativePhoneNo">
            <Input />
          </Form.Item>

          <Form.Item label="CV Status" name="cvStatus">
            <Select options={cvStatusOptions} />
          </Form.Item>

          <Form.Item label="COC Status" name="cocStatus">
            <Select options={cocStatusOptions} />
          </Form.Item>

          <Form.Item label="Musaned Status" name="musanedStatus">
            <Select options={musanedStatusOptions} />
          </Form.Item>

          <Form.Item label="Medical Status" name="medicalStatus">
            <Select options={medicalStatusOptions} />
          </Form.Item>

          <Form.Item label="Availablity Status" name="availabilityStatus">
            <Select options={avialablityStatusOptions} />
          </Form.Item>

          <Form.Item label="Experience Outside Country" name="experienceOutside">
            <Input />
          </Form.Item>

          <Form.Item label="Medical Date" name="medicalDate">
  <Input type="date" />
      </Form.Item>
      <Form.Item
        label="Cv Sent To"
        name="cvSentTo"
      >
        <Select
          options={[
            { label: "A", value: "A" },
            { label: "B", value: "B" },
            { label: "C", value: "C" },      
          ]}
        />
      </Form.Item>
                <Form.Item>
                  <button className="bg-[#059669] btn text-cyan-50" type="submit">
                    Submit
                  </button>
                </Form.Item>
              </div>
            </Form>
          </Wrapper>
        );
      };

      export default AddCandidate;
