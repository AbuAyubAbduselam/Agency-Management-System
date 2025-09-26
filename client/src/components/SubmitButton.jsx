import { Button } from "antd";
import { useState } from "react";

/**
 * Reusable Submit Button
 *
 * @param {string} text - Button text (default: "Submit")
 * @param {function} onSubmit - Async function triggered on click
 * @param {boolean} fullWidth - If true, button spans full width
 */
const SubmitButton = ({ text = "Submit", onSubmit, fullWidth = false }) => {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (!onSubmit) return;
    try {
      setLoading(true);
      await onSubmit();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "1rem" }}>
      <Button
        type="primary"
        htmlType="submit"
        loading={loading}
        style={{ width: fullWidth ? "100%" : "auto" }}
        onClick={handleClick}
      >
        {loading ? "Submitting..." : text}
      </Button>
    </div>
  );
};

export default SubmitButton;
