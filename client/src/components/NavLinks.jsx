import { useState } from "react";
import { Menu } from "antd";
import { NavLink } from "react-router-dom";
import { useDashboardContext } from "../pages/DashboardLayout";
import links from "../utils/Links";

const { SubMenu } = Menu;

const NavLinks = ({ isBigSidebar, onLinkClick }) => {
  const { toggleSidebar, user } = useDashboardContext();
  const [openKeys, setOpenKeys] = useState([]);

  const handleOpenChange = (keys) => {
    setOpenKeys(keys);
  };

  const handleLinkClick = () => {
    if (!isBigSidebar) {
      toggleSidebar();
    }
    if (onLinkClick) {
      onLinkClick(); // Close the Drawer
    }
  };

  return (
    <Menu
      mode="inline"
      openKeys={openKeys}
      onOpenChange={handleOpenChange}
      style={{ width: 250 }}
      className="flex flex-col gap-4"
    >
      {links.map((link) => {
        const { text, path, icon, subLinks } = link;
        const { role } = user;
        if (path === "admin" && role !== "admin") return null;

        if (subLinks) {
          return (
            <SubMenu key={text} icon={icon} title={text}>
              {subLinks.map((subLink) => (
                <Menu.Item key={subLink.text}>
                  <NavLink to={subLink.path} onClick={handleLinkClick}>
                    {subLink.text}
                  </NavLink>
                </Menu.Item>
              ))}
            </SubMenu>
          );
        }

        return (
          <Menu.Item key={text} icon={icon}>
            <NavLink
              to={path}
              onClick={handleLinkClick} // Call both toggleSidebar and onLinkClick
            >
              {text}
            </NavLink>
          </Menu.Item>
        );
      })}
    </Menu>
  );
};

export default NavLinks;
