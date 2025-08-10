  import {
  useLoaderData,
  redirect,
  useNavigate,
} from "react-router-dom";
import { toast } from "react-toastify";
import customFetch from "../utils/customFetch";
import Wrapper from "../assets/wrappers/DashboardFormPage";
import { UploadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { Form, Input, Select, Button, Upload, DatePicker } from "antd";
import { statusOptions } from "../utils/constants";

const { Option } = Select;

export const loader = async ({ params }) => {
  try {
    const { data } = await customFetch.get(`/candidates/${params.id}`);
    return data;
  } catch (error) {
    toast.error(error.response?.data?.msg || "Error loading candidate");
    return redirect("/dashboard");
  }
};

export const action = async ({ request, params }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  try {
    await customFetch.patch(`/candidates/${params.id}`, data);
    toast.success("Candidate edited successfully");
    return redirect("/dashboard");
  } catch (error) {
    toast.error(error.response?.data?.msg || "Update failed");
    return error;
  }
};

const EditCandidate = () => {
  const { candidate } = useLoaderData();
  const navigate = useNavigate();
  const [form] = Form.useForm();

const serializeDate = (date) => (date ? dayjs(date).format("YYYY-MM-DD HH:mm") : "");

  const onFinish = async (values) => {
    const formData = new FormData();

    // Upload files
    const avatarFileList = form.getFieldValue("avatar") || [];
    const fullPhotoFileList = form.getFieldValue("fullSizePhoto") || [];
    const passportScanFileList = form.getFieldValue("passportScan") || [];

    const avatarFile = avatarFileList[0]?.originFileObj;
    const fullPhotoFile = fullPhotoFileList[0]?.originFileObj;
    const passportScanFile = passportScanFileList[0]?.originFileObj;

    if (avatarFile && avatarFile.size > 500000) {
      toast.error("Avatar image size too large (max 500KB)");
      return;
    }
    if (fullPhotoFile && fullPhotoFile.size > 2000000) {
      toast.error("Full-size photo is too large (max 2MB)");
      return;
    }
    if (passportScanFile && passportScanFile.size > 3000000) {
      toast.error("Passport scan is too large (max 3MB)");
      return;
    }

    if (avatarFile) formData.append("avatar", avatarFile);
    if (fullPhotoFile) formData.append("fullSizePhoto", fullPhotoFile);
    if (passportScanFile) formData.append("passportScan", passportScanFile);

   Object.entries(values).forEach(([key, value]) => {
  if (["avatar", "fullSizePhoto", "passportScan"].includes(key)) return;

  if (key === "skills" && typeof value === "object" && !Array.isArray(value)) {
    // Flatten skills map into individual keys
    Object.entries(value).forEach(([skillKey, skillVal]) => {
      formData.append(`skills[${skillKey}]`, skillVal);
    });
  } else if (dayjs.isDayjs(value)) {
    formData.append(key, serializeDate(value));
  } else {
    formData.append(key, value ?? "");
  }
});

  

    try {
      await customFetch.patch(`/candidates/${candidate._id}`, formData);
      toast.success("Candidate edited successfully");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error?.response?.data?.msg || "Edit failed");
    }
  };

  return (
    <Wrapper>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        scrollToFirstError
        initialValues={{
          ...candidate,
          dateOfBirth: candidate.dateOfBirth ? dayjs(candidate.dateOfBirth) : null,
          contractCreationDate: candidate.contractCreationDate ? dayjs(candidate.contractCreationDate) : null,
          passportIssueDate: candidate.passportIssueDate ? dayjs(candidate.passportIssueDate) : null,
          passportExpiryDate: candidate.passportExpiryDate ? dayjs(candidate.passportExpiryDate) : null,
          medicalDate: candidate.medicalDate ? dayjs(candidate.medicalDate) : null,
          tasheerDate: candidate.tasheerDate ? dayjs(candidate.tasheerDate) : null,
          ticketDate: candidate.ticketDate ? dayjs(candidate.ticketDate) : null,
          avatar: candidate.avatar
            ? [
                {
                  uid: "-1",
                  name: "Current Image",
                  status: "done",
                  url: candidate.avatar,
                },
              ]
            : [],
          fullSizePhoto: candidate.fullSizePhoto
            ? [
                {
                  uid: "-2",
                  name: "Current Full Size Photo",
                  status: "done",
                  url: candidate.fullSizePhoto,
                },
              ]
            : [],
          passportScan: candidate.passportScan
            ? [
                {
                  uid: "-3",
                  name: "Current Passport Scan",
                  status: "done",
                  url: candidate.passportScan,
                },
              ]
            : [],
        }}
        className="[&_.ant-form-item-label>label]:font-semibold [&_.ant-form-item-label>label]:text-gray-950"
      >
        <Button onClick={() => navigate(-1)} style={{ marginBottom: "1rem" }}>
          ← Back
        </Button>
        <h4 className="form-title">Edit Candidate</h4>

        <div className="form-center">
          {/* === Upload Fields === */}
          <Form.Item
            label="Photo"
            name="avatar"
            valuePropName="fileList"
            getValueFromEvent={(e) => e?.fileList}
            rules={[]}
          >
            <Upload
              name="avatar"
              listType="picture"
              maxCount={1}
              accept="image/*"
              beforeUpload={() => false}
            >
              <Button icon={<UploadOutlined />}>Upload Avatar</Button>
            </Upload>
          </Form.Item>

          <Form.Item
            label="Full Size Photo"
            name="fullSizePhoto"
            valuePropName="fileList"
            getValueFromEvent={(e) => e?.fileList}
            rules={[]}
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
            label="Passport Scan"
            name="passportScan"
            valuePropName="fileList"
            getValueFromEvent={(e) => e?.fileList}
            rules={[]}
          >
            <Upload
              name="passportScan"
              listType="picture"
              maxCount={1}
              accept="image/*,application/pdf"
              beforeUpload={() => false}
            >
              <Button icon={<UploadOutlined />}>Upload Passport Scan</Button>
            </Upload>
          </Form.Item>



            <Form.Item label="First Name" name="firstName">
              <Input />
            </Form.Item>

            <Form.Item label="Middle Name" name="middleName">
              <Input />
            </Form.Item>

            <Form.Item label="Last Name" name="lastName">
              <Input />
            </Form.Item>

            <Form.Item label="Gender" name="gender" >
            <Select><Option value="male">Male</Option><Option value="female">Female</Option></Select>
            </Form.Item>
            <Form.Item label="Date of Birth" name="dateOfBirth"><DatePicker format="DD/MM/YYYY" style={{ width: "100%" }} /></Form.Item>
            <Form.Item label="Place of Birth" name="placeOfBirth"><Input /></Form.Item>


            {/* Contact Info */}

            {/* Passport Info */}
            <Form.Item label="Passport No" name="passportNo"><Input /></Form.Item>
            <Form.Item label="Date of Issue" name="passportIssueDate"><DatePicker format="DD/MM/YYYY" style={{ width: "100%" }} /></Form.Item>
            <Form.Item label="Date of Expiry" name="passportExpiryDate"><DatePicker format="DD/MM/YYYY" style={{ width: "100%" }} /></Form.Item>
            <Form.Item label="Place of Issue" name="passportIssuePlace"><Input /></Form.Item>



            <Form.Item label="Phone No." name="phoneNo"><Input /></Form.Item>
            <Form.Item label="Narrative" name="narrative"><Input /></Form.Item>
            <Form.Item label="Narrative Phone No." name="narrativePhoneNo"><Input /></Form.Item>

            {/* Health & Physical */}
            <Form.Item label="Medical Date" name="medicalDate"><DatePicker format="DD/MM/YYYY" style={{ width: "100%" }} /></Form.Item>

            {/* Status Selects */}
            <Form.Item label="Medical Status" name="medicalStatus"><Select options={statusOptions.medicalStatus} /></Form.Item>
            <Form.Item label="COC Status" name="cocStatus"><Select options={statusOptions.cocStatus} /></Form.Item>
            <Form.Item label="Availability Status" name="availabilityStatus"><Select options={statusOptions.availabilityStatus} /></Form.Item>
            <Form.Item label="Selected By" name="selectedBy"><Select options={[{ label: "A", value: "A" }, { label: "B", value: "B" }, { label: "C", value: "C" }]} /></Form.Item>
             <Form.Item label="Contract Date" name="contractCreationDate"><DatePicker format="DD/MM/YYYY" style={{ width: "100%" }} /></Form.Item>
            
            <Form.Item label="Tasheer" name="tasheer"><Select options={statusOptions.tasheer} /></Form.Item>
            <Form.Item label="Wokala" name="wokala"><Select options={statusOptions.wokala} /></Form.Item>
            <Form.Item label="Visa Status" name="visaStatus"><Select options={statusOptions.visaStatus} /></Form.Item>
            <Form.Item label="LMIS" name="lmis"><Select options={statusOptions.lmis} /></Form.Item>
            <Form.Item label="Ticket" name="ticket"><Select options={statusOptions.ticket} /></Form.Item>
             <Form.Item label="Tasheer Date & Time" name="tasheerDate">
                          <DatePicker
                            showTime
                            format="DD/MM/YYYY HH:mm"
                            style={{ width: "100%" }}
                          />
                        </Form.Item>
                        
                        <Form.Item label="Ticket Date & Time" name="ticketDate">
                          <DatePicker
                            showTime
                            format="DD/MM/YYYY HH:mm"
                            style={{ width: "100%" }}
                          />
                        </Form.Item>



            {/* Submit */}
            <Form.Item>
              <Button type="primary" htmlType="submit" >
                Submit
              </Button>
            </Form.Item>
          </div>
        </Form>
      </Wrapper>
    );
  };

  export default EditCandidate;
