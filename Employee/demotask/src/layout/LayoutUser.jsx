import React from "react";
import Header from "../component/Header/Header";
import { Outlet } from "react-router-dom";
import Footer from "../component/Footer/Footer";

const LayoutUser = () => {
  return (
    <div style={{ backgroundColor: "#f9fafc" }}>
      <Header />
      <Outlet />
    </div>
  );
};

export default LayoutUser;
