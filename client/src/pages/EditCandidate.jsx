import {
  useLoaderData,
  redirect,
  useNavigate,
} from "react-router-dom";
import { toast } from "react-toastify";
import customFetch from "../utils/customFetch";
import Wrapper from "../assets/wrappers/DashboardFormPage";
import { Button, Input, Select, Upload, Form } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const statusOptions = [
  { label: "Done", value: "done" },
  { label: "Waiting", value: "waiting" },
];

const availabilityOptions = [
  { label: "Available", value: "available" },
  { label: "Selected", value: "selected" },
  { label: "Unavailable", value: "unavailable" },
];

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

  const onFinish = async (values) => {
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (key !== "avatar" && key !== "fullSizePhoto") {
        formData.append(key, value);
      }
    });
  
    if (values.avatar && values.avatar.file) {
      formData.append("avatar", values.avatar.file.originFileObj);
    }
  
    if (values.fullSizePhoto && values.fullSizePhoto.file) {
      formData.append("fullSizePhoto", values.fullSizePhoto.file.originFileObj);
    }
  
    const avatarFile = formData.get("avatar");
    if (avatarFile && avatarFile.size > 500000) {
      toast.error("Avatar image size too large");
      return;
    }
  
    const fullPhotoFile = formData.get("fullSizePhoto");
    if (fullPhotoFile && fullPhotoFile.size > 2000000) {
      toast.error("Full-size photo is too large (max 2MB)");
      return;
    }
  
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
        initialValues={{
          firstName: candidate.firstName,
          middleName: candidate.middleName,
          lastName: candidate.lastName,
          gender: candidate.gender,
          dateOfBirth: dayjs(candidate.dateOfBirth).format("YYYY-MM-DD"),
          passportNo: candidate.passportNo,
          phoneNo: candidate.phoneNo,
          narrativePhoneNo: candidate.narrativePhoneNo,
          religion: candidate.religion,
          laborId: candidate.laborId,
          cvStatus: candidate.cvStatus,
          cocStatus: candidate.cocStatus,
          musanedStatus: candidate.musanedStatus,
          medicalStatus: candidate.medicalStatus,
          experienceOutside: candidate.experienceOutside,
          availabilityStatus: candidate.availabilityStatus,
        }}
        onFinish={onFinish}
      >
        <h4 className="form-title">Edit Candidate</h4>
        <Button onClick={() => navigate(-1)} style={{ marginBottom: "1rem" }}>
          ← Back
        </Button>

        <div className="form-center">
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
              defaultFileList={
                candidate.avatar
                  ? [
                      {
                        uid: "-1",
                        name: "Current Image",
                        status: "done",
                        url: candidate.avatar,
                      },
                    ]
                  : []
              }
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
    defaultFileList={
      candidate.fullSizePhoto
        ? [
            {
              uid: "-2",
              name: "Current Full Size Photo",
              status: "done",
              url: candidate.fullSizePhoto,
            },
          ]
        : []
    }
  >
    <Button icon={<UploadOutlined />}>Upload Full Size</Button>
  </Upload>
</Form.Item>


          <Form.Item label="First Name" name="firstName" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item label="Middle Name" name="middleName" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item label="Last Name" name="lastName">
            <Input />
          </Form.Item>

          <Form.Item label="Gender" name="gender" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="male">Male</Select.Option>
              <Select.Option value="female">Female</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label="Birth Date" name="dateOfBirth" rules={[{ required: true }]}>
            <Input type="date" />
          </Form.Item>

          <Form.Item label="Passport No." name="passportNo">
            <Input />
          </Form.Item>

          <Form.Item label="Phone No." name="phoneNo">
            <Input />
          </Form.Item>

          <Form.Item label="Narrative Phone No." name="narrativePhoneNo">
            <Input />
          </Form.Item>

          <Form.Item label="Religion" name="religion">
            <Input />
          </Form.Item>

          <Form.Item label="Labor ID" name="laborId">
            <Input />
          </Form.Item>

          <Form.Item label="CV Status" name="cvStatus">
            <Select options={statusOptions} />
          </Form.Item>

          <Form.Item label="COC Status" name="cocStatus">
            <Select options={statusOptions} />
          </Form.Item>

          <Form.Item label="Musaned Status" name="musanedStatus">
            <Select options={statusOptions} />
          </Form.Item>

          <Form.Item label="Medical Status" name="medicalStatus">
            <Select options={statusOptions} />
          </Form.Item>

          <Form.Item label="Experience Outside Country" name="experienceOutside">
            <Input />
          </Form.Item>

          <Form.Item label="Availability Status" name="availabilityStatus">
            <Select options={availabilityOptions} />
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

export default EditCandidate;
