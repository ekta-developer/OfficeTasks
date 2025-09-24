import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { SlLogout } from "react-icons/sl";
import useLogout from "../../utils";
import logo from "../../assets/Images/logoQuaere.png";
import { Button } from "@mui/material";

const Header = () => {
  return (
    <div className="sticky-top border-bottom mb-5">
      <nav className="navbar navbar-expand-lg bg-light">
        <div className="container">
          {/* Logo */}
          <a className="navbar-brand fw-bold text-dark" href="#">
            <img src={logo} height="50" alt="logo" />
          </a>

          {/* Toggler for mobile */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Links */}
          <div
            className="collapse navbar-collapse justify-content-end"
            id="navbarNav"
          >
            <ul className="navbar-nav">
              <li className="nav-item mx-2">
                <a className="nav-link" href="#">
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
                  Contact
                </a>
              </li>
              <li className="nav-item mx-2">
                <Button
                  variant="text"
                  size="medium"
                  sx={{ textTransform: "none" }}
                  onClick={useLogout()}
                  className="btn-logout"
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
  );
};

export default Header;
