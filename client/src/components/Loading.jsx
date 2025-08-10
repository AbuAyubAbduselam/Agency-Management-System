import { Spin } from "antd";

const Loading = ({ tip = "Loading..." }) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100px",
      }}
    >
      <Spin size="large" tip={tip} />
    </div>
  );
};

export default Loading;
