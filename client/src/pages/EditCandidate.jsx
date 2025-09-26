import {
  useLoaderData,
  redirect,
  useNavigate,
} from "react-router-dom";
import { useEffect } from "react";
import { toast } from "react-toastify";
import customFetch from "../utils/customFetch";
import Wrapper from "../assets/wrappers/DashboardFormPage";
import { UploadOutlined, PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
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

  const serializeDate = (date) =>
    date ? dayjs(date).toISOString() : "";

  const onFinish = async (values) => {
  const formData = new FormData();

  // Upload files
  const avatarFileList = form.getFieldValue("avatar") || [];
  const fullPhotoFileList = form.getFieldValue("fullSizePhoto") || [];
  const passportScanFileList = form.getFieldValue("passportScan") || [];

  const avatarFile = avatarFileList[0]?.originFileObj;
  const fullPhotoFile = fullPhotoFileList[0]?.originFileObj;
  const passportScanFile = passportScanFileList[0]?.originFileObj;

  // === Validate sizes ===
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

  // === Handle upload OR remove ===
  if (avatarFile) {
    formData.append("avatar", avatarFile);
  } else if ((form.getFieldValue("avatar") || []).length === 0) {
    formData.append("removeAvatar", "true");
  }

  if (fullPhotoFile) {
    formData.append("fullSizePhoto", fullPhotoFile);
  } else if ((form.getFieldValue("fullSizePhoto") || []).length === 0) {
    formData.append("removeFullSizePhoto", "true");
  }

  if (passportScanFile) {
    formData.append("passportScan", passportScanFile);
  } else if ((form.getFieldValue("passportScan") || []).length === 0) {
    formData.append("removePassportScan", "true");
  }

  // === Append other values ===
  Object.entries(values).forEach(([key, value]) => {
    if (["avatar", "fullSizePhoto", "passportScan"].includes(key)) return;
    else if (key === "skills") {
      formData.append("skills", JSON.stringify(value));
    } else if (key === "experiences") {
      formData.append("experiences", JSON.stringify(value || []));
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


  // ✅ Ensure form values refresh when candidate changes
  useEffect(() => {
    if (candidate) {
      const defaultSkills = {
        cleaning: "",
        washing: "",
        ironing: "",
        cooking: "",
        arabicCooking: "",
        childrenCare: "",
        driving: "",
        sewing: "",
      };

      form.setFieldsValue({
        ...candidate,
        dateOfBirth: candidate.dateOfBirth ? dayjs(candidate.dateOfBirth) : null,
        contractDate: candidate.contractDate ? dayjs(candidate.contractDate) : null,
        passportIssueDate: candidate.passportIssueDate ? dayjs(candidate.passportIssueDate) : null,
        passportExpiryDate: candidate.passportExpiryDate ? dayjs(candidate.passportExpiryDate) : null,
        medicalDate: candidate.medicalDate ? dayjs(candidate.medicalDate) : null,
        tasheerDate: candidate.tasheerDate ? dayjs(candidate.tasheerDate) : null,
        ticketDate: candidate.ticketDate ? dayjs(candidate.ticketDate) : null,
        avatar: candidate.avatar
          ? [{ uid: "-1", name: "Current Image", status: "done", url: candidate.avatar }]
          : [],
        fullSizePhoto: candidate.fullSizePhoto
          ? [{ uid: "-2", name: "Current Full Size Photo", status: "done", url: candidate.fullSizePhoto }]
          : [],
        passportScan: candidate.passportScan
          ? [{ uid: "-3", name: "Current Passport Scan", status: "done", url: candidate.passportScan }]
          : [],
        skills: { ...defaultSkills, ...(candidate.skills || {}) },
      });
    }
  }, [candidate, form]);

  return (
    <Wrapper>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        scrollToFirstError
        className="[&_.ant-form-item-label>label]:font-semibold [&_.ant-form-item-label>label]:text-gray-950 [&_.ant-form-item]:max-w-[200px] [&_.ant-input]:w-full [&_.ant-select]:w-full"
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
          >
            <Upload name="passportScan" listType="picture" maxCount={1} accept="image/*,application/pdf" beforeUpload={() => false}>
              <Button icon={<UploadOutlined />}>Upload Passport Scan</Button>
            </Upload>
          </Form.Item>

          {/* === Basic Info === */}
          <Form.Item label="Code" name="code"><Input type="number" /></Form.Item>
          <Form.Item label="First Name" name="firstName"><Input /></Form.Item>
          <Form.Item label="Middle Name" name="middleName"><Input /></Form.Item>
          <Form.Item label="Last Name" name="lastName"><Input /></Form.Item>
          <Form.Item label="Gender" name="gender"><Select options={statusOptions.gender} /></Form.Item>
          <Form.Item label="Date of Birth" name="dateOfBirth"><DatePicker format="DD/MM/YYYY" style={{ width: "100%" }} /></Form.Item>
            <Form.Item label="Passport No" name="passportNo"><Input /></Form.Item>
         <Form.Item label="Labour ID" name="labourId"><Input /></Form.Item>
          <Form.Item label="Date of Issue" name="passportIssueDate"><DatePicker format="DD/MM/YYYY" style={{ width: "100%" }} /></Form.Item>
          <Form.Item label="Date of Expiry" name="passportExpiryDate"><DatePicker format="DD/MM/YYYY" style={{ width: "100%" }} /></Form.Item>
          <Form.Item label="Place of Issue" name="passportIssuePlace"><Input /></Form.Item>
          <Form.Item label="Religion" name="religion"><Select options={statusOptions.religion} /></Form.Item>

          <Form.Item label="Place of Birth" name="placeOfBirth"><Input /></Form.Item>
          <Form.Item label="Living Town" name="livingTown"><Input /></Form.Item>
          <Form.Item label="Education" name="educationStatus">
                      <Select options={statusOptions.educationStatus}/>  
                    </Form.Item>
          <Form.Item label="Marital Status" name="maritalStatus"><Select options={statusOptions.maritalStatus} /></Form.Item>

         
          <Form.Item label="Occupation" name="position"><Select options={statusOptions.position} /></Form.Item>
          <Form.Item label="Salary" name="salary"><Input /></Form.Item>
          <Form.Item label="Phone No." name="phoneNo"><Input /></Form.Item>
          <Form.Item label="Narrative" name="narrative"><Input /></Form.Item>
          <Form.Item label="Narrative Phone No." name="narrativePhoneNo"><Input /></Form.Item>

          {/* Experience & Language */}
          <Form.Item label="Spoken Languages" name="spokenLanguages"><Input /></Form.Item>
          <Form.Item label="Language - English" name="languageEnglish"><Select options={statusOptions.language} /></Form.Item>
          <Form.Item label="Language - Arabic" name="languageArabic"><Select options={statusOptions.language} /></Form.Item>

          {/* Experience Abroad */}
          <Form.Item label="Have Experience?" name="haveExperience" rules={[{ required: true, message: "Please select" }]}>
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

          {/* Health & Physical */}
          <Form.Item label="Weight (kg)" name="weight"><Input /></Form.Item>
          <Form.Item label="Height (cm)" name="height"><Input /></Form.Item>
          <Form.Item label="Children" name="children"><Input type="number" /></Form.Item>
          <Form.Item label="Musaned Status" name="musanedStatus"><Select options={statusOptions.musanedStatus} /></Form.Item>
          <Form.Item label="COC Status" name="cocStatus"><Select options={statusOptions.cocStatus} /></Form.Item>
          <Form.Item label="Medical Status" name="medicalStatus"><Select options={statusOptions.medicalStatus} /></Form.Item>
          <Form.Item label="Medical Date" name="medicalDate"><DatePicker format="DD/MM/YYYY" style={{ width: "100%" }} /></Form.Item>
          <Form.Item label="Passport Status" name="passportStatus"><Select options={statusOptions.passportStatus} /></Form.Item>
          <Form.Item label="Availability Status" name="availabilityStatus"><Select options={statusOptions.availabilityStatus} /></Form.Item>
           <Form.Item label="Skills" className="!mb-0">
            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
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
                  className="mb-0"
                >
                  <Select>
                    <Option value=""></Option>
                    <Option value="yes">Yes</Option>
                    <Option value="no">No</Option>
                  </Select>
                </Form.Item>
              ))}
            </div>
          </Form.Item>

          <Form.Item label="Remark" name="remark"><Input.TextArea rows={2} /></Form.Item>
          {/* Submit */}
          <Form.Item>
            <Button type="primary" htmlType="submit">Submit</Button>
          </Form.Item>
        </div>
      </Form>
    </Wrapper>
  );
};

export default EditCandidate;
