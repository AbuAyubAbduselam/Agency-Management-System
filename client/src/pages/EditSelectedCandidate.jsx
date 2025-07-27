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

const cocStatusOptions = [
    { label: "Done", value: "done" },
    { label: "Waiting", value: "waiting" },
    { label: "Booked", value: "booked" },
  ];

  const medicalStatusOptions = [
    { label: "Fit", value: "fit" },
    { label: "Booked", value: "booked" },
    { label: "Unfit", value: "unfit" },
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

const EditSelectedCandidate = () => {
  const { candidate } = useLoaderData();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (key === "avatar" && value && value[0]) {
        formData.append(key, value[0].originFileObj);
      } else {
        formData.append(key, value);
      }
    });

    const file = formData.get("avatar");
    if (file && file.size > 500000) {
      toast.error("Image size too large");
      return;
    }

    try {
      await customFetch.patch(`/candidates/${candidate._id}`, formData);
      toast.success("Candidate edited successfully");
      navigate("/dashboard/candidate-attendance");
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
          passportNo: candidate.passportNo,
          laborId: candidate.laborId,
          cocStatus: candidate.cocStatus,
          medicalStatus: candidate.medicalStatus, 
          medicalDate: candidate.medicalDate ? dayjs(candidate.medicalDate).format("YYYY-MM-DD") : undefined,
          tasheer: candidate.tasheer,
          wokala: candidate.wokala,
          lmis: candidate.lmis,
          ticket: candidate.ticket,
          selectedBy: candidate.selectedBy,
          visaStatus: candidate.visaStatus,

        }}
        onFinish={onFinish}
      >
        <Button onClick={() => navigate(-1)} style={{ marginBottom: "1rem" }}>
          ← Back
        </Button>
        <h4 className="form-title">Edit Candidate</h4>
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

          <Form.Item label="First Name" name="firstName" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item label="Middle Name" name="middleName" rules={[{ required: true }]}>
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


          <Form.Item label="COC Status" name="cocStatus">
            <Select options={cocStatusOptions} />
          </Form.Item>

          <Form.Item label="Medical Status" name="medicalStatus">
            <Select options={medicalStatusOptions} />
          </Form.Item>

          
          <Form.Item label="Medical Date" name="medicalDate">
  <Input type="date" />
</Form.Item>

<Form.Item
  label="Tasheer"
  name="tasheer"
  rules={[{ required: true, message: "Please select the tasheer status!" }]}
>
  <Select
    options={[
      { label: "Waiting", value: "waiting" },
      { label: "Booked", value: "booked" },
      { label: "Done", value: "done" },
    ]}
  />
</Form.Item>

<Form.Item label="Wokala" name="wokala">
  <Select
    options={[
      { label: "Waiting", value: "waiting" },
      { label: "Waiting Tasdeeq", value: "waiting tasdeeq" },
      { label: "Done", value: "done" },
    ]}
  />
</Form.Item>

<Form.Item
  label="LMIS"
  name="lmis"
  rules={[{ required: true, message: "Please select the LMIS status!" }]}
>
  <Select
    options={[
      { label: "Draft", value: "draft" },
      { label: "Pending", value: "pending" },
      { label: "Issued", value: "issued" },
      { label: "Rejected", value: "rejected" },
    ]}
  />
</Form.Item>
<Form.Item
  label="TICKET"
  name="ticket"
  rules={[{ required: true, message: "Please select the TICKET status!" }]}
>
  <Select
    options={[
      { label: "Waiting", value: "waiting" },
      { label: "Booked", value: "booked" },
      { label: "Done", value: "done" },      
    ]}
  />
</Form.Item>

<Form.Item
  label="Selected By"
  name="selectedBy"
  rules={[{ required: true, message: "Please select the status!" }]}
>
  <Select
    options={[
      { label: "A", value: "A" },
      { label: "B", value: "B" },
      { label: "C", value: "C" },      
    ]}
  />
</Form.Item>

<Form.Item
  label="Visa Status"
  name="visaStatus"
  rules={[{ required: true, message: "Please select the visa status!" }]}
>
  <Select
    options={[
      { label: "Created", value: "created" },
      { label: "Ready for Embassy", value: "ready for embassy" },
      { label: "Sent to Embassy", value: "sent to embassy" },
      { label: "Visa Issued", value: "visa issued" },
      { label: "Visa Canceled", value: "visa canceled" },
      { label: "Arrived KSA", value: "arrived ksa" },
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

export default EditSelectedCandidate;
