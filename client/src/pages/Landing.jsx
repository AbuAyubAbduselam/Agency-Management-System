import Wrapper from "../assets/wrappers/LandingPage";
import { Humberger, Logo } from "../components";
import agency from "../assets/images/agency.jpeg";
import wave from "../assets/images/wave.svg";
import { Link } from "react-router-dom";

const Landing = () => {
  const links = [
    { href: "/admin-login", text: "Admin" },
    { href: "/about", text: "About" },
    { href: "/contact", text: "Contact" },
  ];

  return (
    <Wrapper>
      <nav>
        <Logo />
        <div className="humster">
          <Humberger links={links} />
        </div>
        <Link to="#" className="btn contact">
          contact us
        </Link>
        <Link to="#" className="btn about">
          about
        </Link>
        <Link to="#" className="btn admin">
          Admin
        </Link>
      </nav>
      <div>
        <div className="container page">
          <div className="info">
            <img src={agency} alt="flight" className="img main-img2" />

            <h1>MUBAREK FOREIGN EMPLOYMENT AGENCY </h1>
            <div className="two-login">
              <Link to="/login" className="btn">
                User Login
              </Link>
            </div>
          </div>
          <img src={agency} alt="flight" className="img main-img" />
        </div>

        <img src={wave} alt="wave" className="wave" />
      </div>
    </Wrapper>
  );
};

export default Landing;
