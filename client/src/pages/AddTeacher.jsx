import { Form, Input, Select, Button } from "antd";
import Wrapper from "../assets/wrappers/DashboardFormPage";
import { useOutletContext, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import customFetch from "../utils/customFetch";

const AddTeacher = ({ closeModal }) => {
  const { user } = useOutletContext();
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (key === "avatar" && value && value[0]) {
        formData.append(key, value[0].originFileObj);
      } else {
        formData.append(key, value);
      }
    });

    try {
      await customFetch.post("/teachers", formData);
      toast.success("Teacher added successfully");
      navigate("/dashboard/teachers");
    } catch (error) {
      toast.error(error?.response?.data?.msg || "Failed to add teacher");
    }
  };

  return (
    <Wrapper>
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <h4 className="form-title">Add Teacher</h4>

        <Form.Item
          label="First Name"
          name="firstName"
          rules={[{ required: true, message: "Please input the first name!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Last Name"
          name="lastName"
          rules={[{ required: true, message: "Please input the last name!" }]}
        >
          <Input />
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
          label="Email"
          name="email"
          rules={[
            {
              required: true,
              message: "Please input the email address!",
              type: "email",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Phone Number"
          name="phoneNumber"
          rules={[
            { required: true, message: "Please input the phone number!" },
          ]}
        >
          <Input />
        </Form.Item>

        {/* Address */}
        <Form.Item
          label="Address"
          name="address"
          rules={[{ required: true, message: "Please input the address!" }]}
        >
          <Input />
        </Form.Item>

        {/* Class Assigned (Multi-option select) */}
        <Form.Item
          label="Class Assigned"
          name="classAssigned"
          rules={[{ required: true, message: "Please select the class(es)!" }]}
        >
          <Select mode="multiple" placeholder="Select class(es)">
            <Select.Option value="Class 1">Class 1</Select.Option>
            <Select.Option value="Class 2">Class 2</Select.Option>
            <Select.Option value="Class 3">Class 3</Select.Option>
            <Select.Option value="Class 4">Class 4</Select.Option>
          </Select>
        </Form.Item>

        {/* Submit Button */}
        <Form.Item>
          <Button className="bg-[#059669] text-white" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Wrapper>
  );
};

export default AddTeacher;
