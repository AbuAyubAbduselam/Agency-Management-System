import { useState } from "react";
import { Button, Drawer, Space } from "antd";
import { MenuOutlined, CloseOutlined } from "@ant-design/icons"; // Menu and Close icons from Ant Design
import NavLinks from "./NavLinks";
import { useDashboardContext } from "../pages/DashboardLayout";
import Logo from "./Logo";

const Toggle = () => {
  const [open, setOpen] = useState(false);
  const [placement, setPlacement] = useState("left");

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const { showSidebar, toggleSidebar } = useDashboardContext();

  return (
    <>
      <Space>
        <Button
          icon={<MenuOutlined />}
          onClick={showDrawer}
          className="!bg-[#059669] text-cyan-50"
        >
          Menu
        </Button>
      </Space>
      <Drawer
        placement={placement}
        closable={false}
        onClose={onClose}
        open={open}
        key={placement}
        width={256}
        bodyStyle={{ padding: 0 }}
      >
        <div className="w-[100px]  m-10">
          <Logo />
        </div>

        <NavLinks onLinkClick={onClose} />
      </Drawer>
    </>
  );
};

export default Toggle;
