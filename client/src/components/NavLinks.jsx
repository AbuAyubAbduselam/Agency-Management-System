import { useState } from "react";
import { Menu } from "antd";
import { NavLink } from "react-router-dom";
import { useDashboardContext } from "../pages/DashboardLayout";
import links from "../utils/Links";
import { useLocation } from "react-router-dom";


const { SubMenu } = Menu;

const NavLinks = ({ isBigSidebar, onLinkClick }) => {
  const { toggleSidebar, user } = useDashboardContext();
  const [openKeys, setOpenKeys] = useState([]);
const location = useLocation();
const selectedKey = location.pathname.split("/").pop() || "dashboard";




  const handleOpenChange = (keys) => {
    setOpenKeys(keys);
  };

  const handleLinkClick = () => {
    if (!isBigSidebar) {
      toggleSidebar();
    }
    if (onLinkClick) {
      onLinkClick(); 
    }
  };

  return (
  <Menu
  mode="inline"
  openKeys={openKeys}
  onOpenChange={handleOpenChange}
  selectedKeys={[selectedKey]} // ← this line activates the correct menu item
  style={{ width: 250 }}
  className="flex flex-col gap-4"
>


      {links.map((link) => {
  const { text, path, icon, subLinks } = link;
  const { role } = user;
  if (path === "admin" && role !== "admin") return null;

  if (subLinks) {
    return (
      <SubMenu key={path} icon={icon} title={text}>
        {subLinks.map((subLink) => (
          <Menu.Item key={subLink.path}>
            <NavLink to={subLink.path} onClick={handleLinkClick}>
              {subLink.text}
            </NavLink>
          </Menu.Item>
        ))}
      </SubMenu>
    );
  }

  return (
    <Menu.Item key={path} icon={icon}>
      <NavLink to={path} onClick={handleLinkClick}>
        {text}
      </NavLink>
    </Menu.Item>
  );
})}

    </Menu>
  );
};

export default NavLinks;
