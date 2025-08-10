import { useNavigation } from "react-router-dom";
import { Button } from "antd";

const SubmitBtn = ({ formBtn }) => {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <Button
      type="primary"
      htmlType="submit"
      block
      className="mt-5"
      loading={isSubmitting}
      disabled={isSubmitting}
    >
      {isSubmitting ? "" : "Login"}
    </Button>
  );
};

export default SubmitBtn;
