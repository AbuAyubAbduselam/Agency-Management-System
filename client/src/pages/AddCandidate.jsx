import { Form, Input, Select, Button, Upload, DatePicker } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import Wrapper from "../assets/wrappers/DashboardFormPage";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import customFetch from "../utils/customFetch";
import { statusOptions } from "../utils/constants";
import dayjs from "dayjs";

const { Option } = Select;

const AddCandidate = ({ closeModal }) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    console.log("Submitting form...");

    const formData = new FormData();

    // Handle image uploads
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

const serializeDate = (date) => (date ? dayjs(date).format("YYYY-MM-DD HH:mm") : "");

    Object.entries(values).forEach(([key, value]) => {
      if (["avatar", "fullSizePhoto", "passportScan"].includes(key)) return;

      if (dayjs.isDayjs(value)) {
        formData.append(key, serializeDate(value));
      } else if (Array.isArray(value)) {
        value.forEach((v) => formData.append(key, v));
      } else {
        formData.append(key, value ?? "");
      }
    });

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
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        scrollToFirstError
        className="[&_.ant-form-item-label>label]:font-semibold [&_.ant-form-item-label>label]:text-gray-950"
      >
        <Button onClick={() => navigate(-1)} style={{ marginBottom: "1rem" }}>
                  ← Back
                </Button>
        <h4 className="form-title">Add Candidate</h4>

        <div className="form-center">

         <Form.Item
  label="Photo"
  name="avatar"
  valuePropName="fileList"
  getValueFromEvent={(e) => e?.fileList}
  rules={[]}
>
  <Upload name="avatar" listType="picture" maxCount={1} accept="image/*" beforeUpload={() => false}>
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
  <Upload name="fullSizePhoto" listType="picture" maxCount={1} accept="image/*" beforeUpload={() => false}>
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
  <Upload name="passportScan" listType="picture" maxCount={1} accept="image/*,application/pdf" beforeUpload={() => false}>
    <Button icon={<UploadOutlined />}>Upload Passport Scan</Button>
  </Upload>
</Form.Item>


          {/* --- Personal Info --- */}
          <Form.Item label="Code" name="code"><Input /></Form.Item>
          <Form.Item label="First Name" name="firstName"><Input /></Form.Item>
          <Form.Item label="Middle Name" name="middleName"><Input /></Form.Item>
          <Form.Item label="Last Name" name="lastName"><Input /></Form.Item>
          <Form.Item label="Gender" name="gender">
            <Select><Option value="male">Male</Option><Option value="female">Female</Option></Select>
          </Form.Item>
          <Form.Item label="Date of Birth" name="dateOfBirth"><DatePicker format="DD/MM/YYYY" style={{ width: "100%" }} /></Form.Item>
          <Form.Item label="Place of Birth" name="placeOfBirth"><Input /></Form.Item>
          <Form.Item label="Living Town" name="livingTown"><Input /></Form.Item>
          <Form.Item label="Marital Status" name="maritalStatus">
            <Select options={statusOptions.maritalStatus}/>  
          </Form.Item>
          <Form.Item label="Religion" name="religion">
            <Select options={statusOptions.gender}/>
          </Form.Item>

          {/* --- Passport Info --- */}
          <Form.Item label="Passport No" name="passportNo"><Input /></Form.Item>
          <Form.Item label="Labour ID" name="labourId"><Input /></Form.Item>
          <Form.Item label="Date of Issue" name="passportIssueDate"><DatePicker format="DD/MM/YYYY" style={{ width: "100%" }} /></Form.Item>
          <Form.Item label="Date of Expiry" name="passportExpiryDate"><DatePicker format="DD/MM/YYYY" style={{ width: "100%" }} /></Form.Item>
          <Form.Item label="Place of Issue" name="passportIssuePlace"><Input /></Form.Item>

          {/* --- Work Info --- */}
           <Form.Item label="Occupation" name="position"><Select options={statusOptions.position} /></Form.Item>

          <Form.Item label="Salary" name="salary"><Input /></Form.Item>

          {/* --- Contact Info --- */}
          <Form.Item label="Phone No." name="phoneNo"><Input /></Form.Item>
          <Form.Item label="Narrative" name="narative"><Input /></Form.Item>
          <Form.Item label="Narrative Phone No." name="narrativePhoneNo"><Input /></Form.Item>

          {/* --- Experience & Language --- */}
          <Form.Item label="Spoken Languages" name="spokenLanguages"><Input /></Form.Item>
          <Form.Item label="Language - English" name="languageEnglish">
            <Select  options={statusOptions.language}/>
              
          </Form.Item>
          <Form.Item label="Language - Arabic" name="languageArabic">
            <Select>
              <Option value="veryGood">VERY GOOD</Option>
              <Option value="good">GOOD</Option>
              <Option value="poor">POOR</Option>
            </Select>
          </Form.Item>
          <Form.Item label="Experience Country" name="experienceCountry"><Input /></Form.Item>
          <Form.Item label="Experience Period" name="experiencePeriod"><Input /></Form.Item>

          {/* --- Health & Physical Info --- */}
          <Form.Item label="Weight (kg)" name="weight"><Input /></Form.Item>
          <Form.Item label="Height (cm)" name="height"><Input /></Form.Item>
          <Form.Item label="Children" name="children"><Input type="number" /></Form.Item>
         

          {/* --- Status Selects --- */}
          <Form.Item label="Passport Status" name="passportStatus"><Select options={statusOptions.passportStatus} /></Form.Item>
          <Form.Item label="CV Status" name="cvStatus"><Select options={statusOptions.cvStatus} /></Form.Item>
          <Form.Item label="Medical Status" name="medicalStatus"><Select options={statusOptions.medicalStatus} /></Form.Item>
          <Form.Item label="COC Status" name="cocStatus"><Select options={statusOptions.cocStatus} /></Form.Item>
          <Form.Item label="Musaned Status" name="musanedStatus"><Select options={statusOptions.musanedStatus} /></Form.Item>
          <Form.Item label="CV Sent To" name="cvSentTo"><Select options={statusOptions.cvSentTo} /></Form.Item>
          <Form.Item label="Availability Status" name="availabilityStatus"><Select options={statusOptions.availabilityStatus} /></Form.Item>
          <Form.Item label="Contract Date" name="contractDate"><DatePicker format="DD/MM/YYYY" style={{ width: "100%" }} /></Form.Item>
          <Form.Item label="Selected By" name="selectedBy"><Select options={statusOptions.selectedBy} /></Form.Item>
          <Form.Item label="Office Inside" name="insideOffice"><Select options={statusOptions.insideOffice} /></Form.Item>
          <Form.Item label="Tasheer" name="tasheer"><Select options={statusOptions.tasheer} /></Form.Item>
          <Form.Item label="Wokala" name="wokala"><Select options={statusOptions.wokala} /></Form.Item>
          <Form.Item label="Visa Status" name="visaStatus"><Select options={statusOptions.visaStatus} /></Form.Item>
          <Form.Item label="LMIS" name="lmis"><Select options={statusOptions.lmis} /></Form.Item>
          <Form.Item label="QR code" name="QrCode"><Select options={statusOptions.qrCode} /></Form.Item>
          <Form.Item label="Ticket" name="ticket"><Select options={statusOptions.ticket} /></Form.Item>
           <Form.Item label="Medical Date" name="medicalDate"><DatePicker format="DD/MM/YYYY" style={{ width: "100%" }} /></Form.Item>
         <Form.Item label="Tasheer Date & Time" name="tasheerDate">
  <DatePicker
    showTime
    format="DD/MM/YYYY HH:mm A"
    style={{ width: "100%" }}
  />
</Form.Item>

<Form.Item label="Ticket Date & Time" name="ticketDate">
  <DatePicker
    showTime
    format="DD/MM/YYYY HH:mm A"
    style={{ width: "100%" }}
  />
</Form.Item>
          <Form.Item label="Arival City" name="arrivalCity"><Input type="text" /></Form.Item>


          {/* --- Skills --- */}
        <Form.Item label="Skills">
  <div className="grid grid-cols-2 gap-4">
    {[
      "babySitting",
      "childrenCare",
      "cleaning",
      "washing",
      "ironing",
      "cooking",
      "arabicCooking",
      "tutoring",
      "disableCare",
      "driving",
      "sewing",
    ].map((skill) => (
      <Form.Item
        key={skill}
        name={["skills", skill]}
        label={skill.replace(/([A-Z])/g, " $1")}
        rules={[{ type: "string", enum: ["", "yes", "no"] }]}
      >
        <Select>
          <Option value="">None</Option>
          <Option value="yes">Yes</Option>
          <Option value="no">No</Option>
        </Select>
      </Form.Item>
    ))}
  </div>
</Form.Item>


          {/* --- Remark --- */}
          <Form.Item label="Remark" name="remark"><Input.TextArea rows={2} /></Form.Item>

          {/* --- Submit Button --- */}
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

export default AddCandidate;
