import { useState, useEffect } from "react";
import { Menu } from "antd";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useDashboardContext } from "../pages/DashboardLayout";
import links from "../utils/Links";

const { SubMenu } = Menu;

const NavLinks = ({ isBigSidebar, onLinkClick }) => {
  const { toggleSidebar, user } = useDashboardContext();
  const [openKeys, setOpenKeys] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  const defaultKey = links[0].text;
  const defaultPath = links[0].path;

  const [selectedKey, setSelectedKey] = useState(
    localStorage.getItem("selectedMenuKey") || defaultKey
  );

  // On first login → go to All Candidates
  useEffect(() => {
    const storedKey = localStorage.getItem("selectedMenuKey");
    const storedPath = localStorage.getItem("selectedMenuPath");

    if (!storedKey || !storedPath) {
      setSelectedKey(defaultKey);
      localStorage.setItem("selectedMenuKey", defaultKey);
      localStorage.setItem("selectedMenuPath", defaultPath);
      if (location.pathname === "/" || location.pathname === "") {
        navigate(defaultPath);
      }
    }
  }, [defaultKey, defaultPath, navigate, location.pathname]);

  // Update key when route changes
  useEffect(() => {
    const currentLink =
      links
        .flatMap((link) => link.subLinks || [link])
        .find((l) => l.path === location.pathname || (l.path === "." && location.pathname === "/"));

    if (currentLink) {
      setSelectedKey(currentLink.text);
      localStorage.setItem("selectedMenuKey", currentLink.text);
      localStorage.setItem("selectedMenuPath", currentLink.path);
    }
  }, [location.pathname]);

  const handleOpenChange = (keys) => {
    setOpenKeys(keys);
  };

  const handleLinkClick = (key, path) => {
    setSelectedKey(key);
    localStorage.setItem("selectedMenuKey", key);
    localStorage.setItem("selectedMenuPath", path);

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
      style={{ width: 250 }}
      selectedKeys={[selectedKey]}
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
                <Menu.Item
                  key={subLink.text}
                  onClick={() => handleLinkClick(subLink.text, subLink.path)}
                >
                  <NavLink to={subLink.path}>{subLink.text}</NavLink>
                </Menu.Item>
              ))}
            </SubMenu>
          );
        }

        return (
          <Menu.Item
            key={text}
            icon={icon}
            onClick={() => handleLinkClick(text, path)}
          >
            <NavLink to={path}>{text}</NavLink>
          </Menu.Item>
        );
      })}
    </Menu>
  );
};

export default NavLinks;
