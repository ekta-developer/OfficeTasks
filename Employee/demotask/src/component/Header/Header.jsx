import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { SlLogout } from "react-icons/sl";
import useLogout from "../../utils";
import logo from "../../assets/Images/logoQuaere.png";

const Header = () => {
  return (
    <>
      <div className="header-fixed">
        <nav className="navbar navbar-expand-lg custom-navbar">
          <div className="container-fluid">
            {/* Logo */}
            <a className="navbar-brand text-light fw-bold" href="#">
              <img src={logo} width={"70%"} height={"60px"} alt="logo" />
              <span className="brand-text">-Attendance</span>
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
                <li className="nav-item">
                  <a className="nav-link text-light" href="#">
                    Our Company
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link text-light" href="#">
                    About Us
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link text-light" href="#">
                    Contact{" "}
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link text-light" href="#">
                    <SlLogout size={25} onClick={useLogout()} />
                  </a>
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
