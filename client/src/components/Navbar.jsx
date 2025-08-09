import Wrapper from "../assets/wrappers/Navbar";
import LogoutContainer from "./LogoutContainer";
import Toggle from "./Drawer";

const Navbar = () => {
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
