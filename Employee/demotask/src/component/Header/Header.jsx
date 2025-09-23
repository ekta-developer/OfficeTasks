import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { SlLogout } from "react-icons/sl";
import useLogout from "../../utils";
import logo from "../../assets/Images/logoQuaere.png";
import { Button } from "@mui/material";

const Header = () => {
  return (
    <>
      <div className="sticky-top border-bottom mb-5">
        <nav className="navbar navbar-expand-lg bg-light">
          <div className="container">
            {/* Logo */}
            <a className="navbar-brand text-light fw-bold" href="#">
              <img src={logo} width={"auto"} height={"50px"} alt="logo" />
              {/* <span className="brand-text" style={{color:"#ddd"}}>-Attendance</span> */}
            </a>

            {/* Toggler for mobile */}
            <button
              className="navbar-toggler bg-light"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon">-</span>
            </button>

            {/* Links */}
            <div
              className="collapse navbar-collapse justify-content-end"
              id="navbarNav"
            >
              <ul className="navbar-nav">
                <li className="nav-item mx-2">
                  <a className="nav-link " href="#">
                    Our Company
                  </a>
                </li>
                <li className="nav-item mx-2">
                  <a className="nav-link" href="#">
                    About Us
                  </a>
                </li>
                <li className="nav-item mx-2">
                  <a className="nav-link" href="#">
                    Contact{" "}
                  </a>
                </li>
                <li className="nav-item mx-2">
                  <Button
                    variant="text"
                    size="medium"
                    className="btn-logout"
                    sx={{ textTransform: "none" }} // keep both upper & lower case
                    onClick={useLogout()}
                  >
                    <SlLogout size={15} />
                    &nbsp; Logout
                  </Button>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
};

export default Header;
