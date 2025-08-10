import styled from "styled-components";

const Wrapper = styled.div`
  position: relative;

  .logout-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0 0.5rem;
  }
  .img {
    width: 25px;
    height: 25px;
    border-radius: 50%;
  }
  .dropdown {
    position: absolute;
    top: 3rem;
    left: 0;
    width: 100%;
    text-align: center;
    visibility: hidden;
  }
  .show-dropdown {
    visibility: visible;
  }

`;

export default Wrapper;
