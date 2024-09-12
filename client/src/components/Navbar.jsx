import Wrapper from "../assets/wrappers/Navbar";
import { MenuUnfoldOutlined } from "@ant-design/icons";
import Logo from "./Logo";
import { useDashboardContext } from "../pages/DashboardLayout";
import LogoutContainer from "./LogoutContainer";
import ThemeToggle from "./ThemeToggle";
import Toggle from "./Drawer";

const Navbar = () => {
  const { toggleSidebar } = useDashboardContext();
  return (
    <Wrapper>
      <div className="nav-center z-1000">
        <div className="lg:hidden">
          <Toggle />
        </div>

        <div>
          <h4 className="logo-text">dashboard</h4>
        </div>
        <div className="btn-container">
          <LogoutContainer />
        </div>
      </div>
    </Wrapper>
  );
};
export default Navbar;
