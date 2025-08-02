import { Form, Input, Select, Button, Upload, DatePicker } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import Wrapper from "../assets/wrappers/DashboardFormPage";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import customFetch from "../utils/customFetch";
import dayjs from "dayjs";
const { Option } = Select;

const statusOptions = {
  cocStatus: [
    { label: "Done", value: "done" },
    { label: "Waiting", value: "waiting" },
    { label: "Booked", value: "booked" },
  ],
  cvStatus: [
    { label: "Done", value: "done" },
    { label: "Waiting", value: "waiting" },
  ],
  medicalStatus: [
    { label: "Fit", value: "fit" },
    { label: "Booked", value: "booked" },
    { label: "Unfit", value: "unfit" },
    { label: "Waiting", value: "waiting" },
  ],
  musanedStatus: [
    { label: "Done", value: "done" },
    { label: "Waiting", value: "waiting" },
    { label: "Pending release", value: "pending-release" },
  ],
  availabilityStatus: [
    { label: "Available", value: "available" },
    { label: "Selected", value: "selected" },
    { label: "Unavailable", value: "unavailable" },
  ],
  tasheer: [
    { label: "Waiting", value: "waiting" },
    { label: "Booked", value: "booked" },
    { label: "Done", value: "done" },
  ],
  wokala: [
    { label: "Waiting", value: "waiting" },
    { label: "Waiting Tasdeeq", value: "waiting tasdeeq" },
    { label: "Done", value: "done" },
  ],
  lmis: [
    { label: "Draft", value: "draft" },
    { label: "Pending", value: "pending" },
    { label: "Issued", value: "issued" },
    { label: "Rejected", value: "rejected" },
  ],
  ticket: [
    { label: "Waiting", value: "waiting" },
    { label: "Booked", value: "booked" },
    { label: "Done", value: "done" },
  ],
  visaStatus: [
    { label: " ", value: " " },
    { label: "Ready for embassy", value: "ready for embassy" },
    { label: "Sent to embassy", value: "sent to embassy" },
    { label: "Visa issued", value: "visa issued" },
    { label: "Visa canceled", value: "visa canceled" },
    { label: "Arrived KSA", value: "arrived ksa" },
  ],
};

const AddCandidate = ({ closeModal }) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

 const handleSubmit = async (values) => {
  console.log("Submitting form...");

  const formData = new FormData();

  // Handle image fields safely
  const avatarFileList = form.getFieldValue("avatar") || [];
  const fullPhotoFileList = form.getFieldValue("fullSizePhoto") || [];
  const passportScanFileList = form.getFieldValue("passportScan") || [];

  if (avatarFileList.length > 0) {
    formData.append("avatar", avatarFileList[0].originFileObj);
  }

  if (fullPhotoFileList.length > 0) {
    formData.append("fullSizePhoto", fullPhotoFileList[0].originFileObj);
  }

  if (passportScanFileList.length > 0) {
    formData.append("passportScan", passportScanFileList[0].originFileObj);
  }

  // Convert all other fields
  const serializeDate = (date) => (date ? dayjs(date).format("YYYY-MM-DD") : "");

  Object.entries(values).forEach(([key, value]) => {
    if (["avatar", "fullSizePhoto", "passportScan"].includes(key)) return; // already handled

    if (dayjs.isDayjs(value)) {
      formData.append(key, serializeDate(value));
    } else if (Array.isArray(value)) {
      value.forEach((v) => formData.append(key, v));
    } else {
      formData.append(key, value ?? "");
    }
  });

  // Log all keys (for debugging)
  for (let [key, val] of formData.entries()) {
    console.log(key, val);
  }

  // Validate file sizes
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

  // Submit form
  try {
    await customFetch.post("/candidates", formData);
    toast.success("Candidate added successfully");
    form.resetFields();
    navigate("/dashboard");
  } catch (error) {
    console.error("Submit Error:", error);
    toast.error(error?.response?.data?.msg || "Error submitting form");
  }
};




  return (
    <Wrapper>
      <Form form={form} layout="vertical" onFinish={handleSubmit} scrollToFirstError>
        <h4 className="form-title">Add Candidate</h4>
        <div className="form-center">
          {/* Upload Fields */}
          <Form.Item label="Photo" name="avatar" valuePropName="fileList" getValueFromEvent={(e) => e?.fileList}>
            <Upload name="avatar" listType="picture" maxCount={1} accept="image/*" beforeUpload={() => false}>
              <Button icon={<UploadOutlined />}>Upload Avatar</Button>
            </Upload>
          </Form.Item>
          <Form.Item label="Full Size Photo" name="fullSizePhoto" valuePropName="fileList" getValueFromEvent={(e) => e?.fileList}>
            <Upload name="fullSizePhoto" listType="picture" maxCount={1} accept="image/*" beforeUpload={() => false}>
              <Button icon={<UploadOutlined />}>Upload Full Size</Button>
            </Upload>
          </Form.Item>
          <Form.Item
  label="Passport Scan"
  name="passportScan"
  valuePropName="fileList"
  getValueFromEvent={(e) => e?.fileList}
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


          {/* Personal Info */}
                <div style={{ display: "flex", gap: "1rem" }}>
          <Form.Item label="First Name" name="firstName" style={{ flex: 1 }}><Input /></Form.Item>
          <Form.Item label="Middle Name" name="middleName" style={{ flex: 1 }}><Input /></Form.Item>
          <Form.Item label="Last Name" name="lastName" style={{ flex: 1 }}><Input /></Form.Item>
        </div>

          <Form.Item label="Gender" name="gender" >
            <Select><Option value="male">Male</Option><Option value="female">Female</Option></Select>
          </Form.Item>
          <Form.Item label="Date of Birth" name="dateOfBirth"><DatePicker format="DD/MM/YYYY" style={{ width: "100%" }} /></Form.Item>
          <Form.Item label="Age" name="age"><Input type="number" /></Form.Item>
          <Form.Item label="Place of Birth" name="placeOfBirth"><Input /></Form.Item>
          <Form.Item label="Living Town" name="livingTown"><Input /></Form.Item>
          <Form.Item label="Marital Status" name="maritalStatus">
            <Select>
              <Option value="single">Single</Option>
              <Option value="married">Married</Option>
              <Option value="divorced">Divorced</Option>
              <Option value="widowed">Widowed</Option>
            </Select>
          </Form.Item>
          <Form.Item label="Nationality" name="nationality"><Input /></Form.Item>

          {/* Contact Info */}
          <Form.Item label="Phone No." name="phoneNo"><Input /></Form.Item>
          <Form.Item label="Narrative Phone No." name="narrativePhoneNo"><Input /></Form.Item>
          <Form.Item label="Next of Kin" name="nextOfKin"><Input /></Form.Item>
          <Form.Item label="Kin Phone" name="kinPhone"><Input /></Form.Item>

          {/* Passport Info */}
          <Form.Item label="Passport No" name="passportNo"><Input /></Form.Item>
          <Form.Item label="Date of Issue" name="passportIssueDate"><DatePicker format="DD/MM/YYYY" style={{ width: "100%" }} /></Form.Item>
          <Form.Item label="Date of Expiry" name="passportExpiryDate"><DatePicker format="DD/MM/YYYY" style={{ width: "100%" }} /></Form.Item>
          <Form.Item label="Place of Issue" name="passportIssuePlace"><Input /></Form.Item>

          {/* Work Info */}
          <Form.Item label="Contract Period" name="contractPeriod"><Input /></Form.Item>
          <Form.Item label="Position" name="position"><Input /></Form.Item>
          <Form.Item label="Salary" name="salary"><Input /></Form.Item>

          {/* Experience & Language */}
          <Form.Item label="Spoken Languages" name="spokenLanguages"><Input /></Form.Item>
          <Form.Item label="Language - English" name="languageEnglish">
            <Select><Option value="yes">Yes</Option><Option value="no">No</Option></Select>
          </Form.Item>
          <Form.Item label="Language - Arabic" name="languageArabic">
            <Select><Option value="yes">Yes</Option><Option value="no">No</Option></Select>
          </Form.Item>
          <Form.Item label="Experience Country" name="experienceCountry"><Input /></Form.Item>
          <Form.Item label="Experience Period" name="experiencePeriod"><Input /></Form.Item>
          <Form.Item label="Experience Outside" name="experienceOutside"><Input /></Form.Item>

          {/* Health & Physical */}
          <Form.Item label="Weight (kg)" name="weight"><Input /></Form.Item>
          <Form.Item label="Height (cm)" name="height"><Input /></Form.Item>
          <Form.Item label="Children" name="children"><Input type="number" /></Form.Item>
          <Form.Item label="Medical Date" name="medicalDate"><Input type="date" /></Form.Item>

          {/* Status Selects */}
          <Form.Item label="Religion" name="religion"><Select><Option value="muslim">Muslim</Option><Option value="non-muslim">Non Muslim</Option></Select></Form.Item>
          <Form.Item label="CV Status" name="cvStatus"><Select options={statusOptions.cvStatus} /></Form.Item>
          <Form.Item label="COC Status" name="cocStatus"><Select options={statusOptions.cocStatus} /></Form.Item>
          <Form.Item label="Musaned Status" name="musanedStatus"><Select options={statusOptions.musanedStatus} /></Form.Item>
          <Form.Item label="Medical Status" name="medicalStatus"><Select options={statusOptions.medicalStatus} /></Form.Item>
          <Form.Item label="Availability Status" name="availabilityStatus"><Select options={statusOptions.availabilityStatus} /></Form.Item>
          <Form.Item label="Tasheer" name="tasheer"><Select options={statusOptions.tasheer} /></Form.Item>
          <Form.Item label="Wokala" name="wokala"><Select options={statusOptions.wokala} /></Form.Item>
          <Form.Item label="LMIS" name="lmis"><Select options={statusOptions.lmis} /></Form.Item>
          <Form.Item label="Ticket" name="ticket"><Select options={statusOptions.ticket} /></Form.Item>
          <Form.Item label="Visa Status" name="visaStatus"><Select options={statusOptions.visaStatus} /></Form.Item>
          <Form.Item label="CV Sent To" name="cvSentTo"><Select options={[{ label: "A", value: "A" }, { label: "B", value: "B" }, { label: "C", value: "C" }]} /></Form.Item>
          <Form.Item label="Selected By" name="selectedBy"><Select options={[{ label: "A", value: "A" }, { label: "B", value: "B" }, { label: "C", value: "C" }]} /></Form.Item>

          {/* Skills */}
          <Form.Item label="Skills" name="skills">
            <Select mode="multiple">
              <Option value="babySitting">Baby Sitting</Option>
              <Option value="childrenCare">Children Care</Option>
              <Option value="cleaning">Cleaning</Option>
              <Option value="washing">Washing</Option>
              <Option value="ironing">Ironing</Option>
              <Option value="arabicCooking">Arabic Cooking</Option>
              <Option value="tutoring">Tutoring</Option>
              <Option value="disableCare">Disable Care</Option>
              <Option value="driving">Driving</Option>
              <Option value="sewing">Sewing</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Remark" name="remark"><Input.TextArea rows={2} /></Form.Item>

          {/* Submit */}
          <Form.Item>
            <Button type="primary" htmlType="submit" className="bg-[#059669] text-white">
              Submit
            </Button>
          </Form.Item>
        </div>
      </Form>
    </Wrapper>
  );
};

export default AddCandidate;
