import { Form, Input, Select, Button, Upload, DatePicker } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import Wrapper from "../assets/wrappers/DashboardFormPage";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import customFetch from "../utils/customFetch";
import { statusOptions } from "../utils/constants";
import dayjs from "dayjs";
   import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";

const { Option } = Select;

const AddCandidate = ({ closeModal }) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

 const handleSubmit = async (values) => {

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

  // --- Ensure dates are serialized properly ---
  const dateKeys = [
    "dateOfBirth", 
    "passportIssueDate",
    "passportExpiryDate",
    "medicalDate",
    "ticketDate",
    "tasheerDate",
    "contractCreationDate",
  ];

  Object.entries(values).forEach(([key, value]) => {
  if (["avatar", "fullSizePhoto", "passportScan"].includes(key)) return;

  // ✅ Dates: convert dayjs → ISO string (NO JSON.stringify)
  if (dateKeys.includes(key)) {
    if (value) {
      formData.append(key, dayjs(value).toISOString());
    }
    return;
  }

  // ✅ Experiences: stringify array
  if (key === "experiences") {
    formData.append("experiences", JSON.stringify(value || []));
    return;
  }

  // ✅ Skills: stringify object
  if (key === "skills") {
    formData.append("skills", JSON.stringify(value || {}));
    return;
  }

  // ✅ Arrays of primitives
  if (Array.isArray(value)) {
    value.forEach((v) => formData.append(key, v));
    return;
  }

  // ✅ Objects (non-date, non-null)
  if (typeof value === "object" && value !== null) {
    formData.append(key, JSON.stringify(value));
    return;
  }

  // ✅ Primitives
  formData.append(key, value ?? "");
});

  // --- File size validation ---
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

  // --- Submit ---
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
        className="[&_.ant-form-item-label>label]:font-semibold [&_.ant-form-item-label>label]:text-gray-950 [&_.ant-form-item]:max-w-[200px] [&_.ant-input]:w-full [&_.ant-select]:w-full"
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
          <Form.Item label="Code" name="code" ><Input type="number"/></Form.Item>
          <Form.Item label="First Name" name="firstName"  rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item label="Middle Name" name="middleName" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item label="Last Name" name="lastName" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item label="Gender" name="gender" rules={[{ required: true }]}>
            <Select options={statusOptions.gender}/>
          </Form.Item>
          <Form.Item label="Date of Birth" name="dateOfBirth" rules={[{ required: true }]}><DatePicker format="DD/MM/YYYY" style={{ width: "100%" }} /></Form.Item>
           <Form.Item label="Passport No" name="passportNo" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item label="Labour ID" name="labourId"><Input /></Form.Item>
          <Form.Item label="Date of Issue" name="passportIssueDate" rules={[{ required: true }]}><DatePicker format="DD/MM/YYYY" style={{ width: "100%" }} /></Form.Item>
          <Form.Item label="Date of Expiry" name="passportExpiryDate" rules={[{ required: true }]}><DatePicker format="DD/MM/YYYY" style={{ width: "100%" }} /></Form.Item>
          <Form.Item label="Place of Issue" name="passportIssuePlace"><Input /></Form.Item>
           <Form.Item label="Religion" name="religion">
            <Select options={statusOptions.religion}/>
          </Form.Item>

           <Form.Item label="Phone No." name="phoneNo"><Input /></Form.Item>
          <Form.Item label="Narrative" name="narrative" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item label="Narrative Phone No." name="narrativePhoneNo"><Input /></Form.Item>
          

          <Form.Item label="Place of Birth" name="placeOfBirth"><Input /></Form.Item>
          <Form.Item label="Living Town" name="livingTown"><Input /></Form.Item>
          <Form.Item label="Living Town" name="livingTown"><Input /></Form.Item>
          <Form.Item label="Marital Status" name="maritalStatus">
            <Select options={statusOptions.maritalStatus}/>  
          </Form.Item>
          <Form.Item label="Education" name="educationStatus">
            <Select options={statusOptions.educationStatus}/>  
          </Form.Item>
          <Form.Item label="Occupation" name="position"><Select options={statusOptions.position} /></Form.Item>
          <Form.Item label="Salary" name="salary"><Input /></Form.Item>    
          <Form.Item label="Spoken Languages" name="spokenLanguages"><Input /></Form.Item>
          <Form.Item label="Language - English" name="languageEnglish">
            <Select  options={statusOptions.language}/>
              </Form.Item>
          <Form.Item label="Language - Arabic" name="languageArabic">
            <Select  options={statusOptions.language}/>
          </Form.Item>
      

                      <Form.Item 
              label="Have Experience?" 
              name="haveExperience" 
              rules={[{ required: true, message: "Please select" }]}
            >
              <Select>
                <Option value="yes">Yes</Option>
                <Option value="no">No</Option>
              </Select>
            </Form.Item>

            <Form.Item noStyle shouldUpdate={(prev, curr) => prev.haveExperience !== curr.haveExperience}>
              {({ getFieldValue }) =>
                getFieldValue("haveExperience") === "yes" ? (
                  <Form.List name="experiences">
                    {(fields, { add, remove }) => (
                      <>
                        {fields.map(({ key, name, ...restField }) => (
                          <div key={key} className="flex gap-4 items-end">
                            <Form.Item
                              {...restField}
                              label="Experience Country"
                              name={[name, "country"]}
                              rules={[{ required: true, message: "Enter country" }]}
                              className="flex-1"
                            >
                              <Input />
                            </Form.Item>
                            <Form.Item
                              {...restField}
                              label="Experience Period"
                              name={[name, "period"]}
                              rules={[{ required: true, message: "Enter period" }]}
                              className="flex-1"
                            >
                              <Input />
                            </Form.Item>
                            <MinusCircleOutlined onClick={() => remove(name)} />
                          </div>
                        ))}
                        <Form.Item>
                          <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />}>
                            Add Experience
                          </Button>
                        </Form.Item>
                      </>
                    )}
                  </Form.List>
                ) : null
              }
            </Form.Item>


          {/* --- Health & Physical Info --- */}
          <Form.Item label="Weight (kg)" name="weight"><Input /></Form.Item>
          <Form.Item label="Height (cm)" name="height"><Input /></Form.Item>
          <Form.Item label="Children" name="children"><Input type="number" /></Form.Item>

            <Form.Item label="Passport Status" name="passportStatus" rules={[{ required: true }]}><Select options={statusOptions.passportStatus} /></Form.Item>
          <Form.Item label="Medical Status" name="medicalStatus"><Select options={statusOptions.medicalStatus} /></Form.Item>
           <Form.Item label="Medical Date" name="medicalDate"><DatePicker format="DD/MM/YYYY" style={{ width: "100%" }} /></Form.Item>
          <Form.Item label="COC Status" name="cocStatus"><Select options={statusOptions.cocStatus} /></Form.Item>
          <Form.Item label="Musaned Status" name="musanedStatus"><Select options={statusOptions.musanedStatus} /></Form.Item>
          <Form.Item label="Availability Status" name="availabilityStatus"><Select options={statusOptions.availabilityStatus} /></Form.Item>
          {/* Skills Checkboxes */}
                      <Form.Item label="Skills">
              <div className="grid grid-cols-2 gap-4">
                {[
                  "cleaning",
                  "washing",
                  "ironing",
                  "cooking",
                  "arabicCooking",
                  "childrenCare",
                  "sewing",
                  "elderCare",
                  "specialNeed",
                  "helpInCooking",
                ].map((skill) => (
                  <Form.Item
                    key={skill}
                    name={["skills", skill]}
                     label={skill.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase())}
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
        

       <Form.Item label="Remark" name="remark"><Input.TextArea rows={2} /></Form.Item>
       <Form.Item label="Note" name="note"><Input.TextArea rows={2} /></Form.Item>
       
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
