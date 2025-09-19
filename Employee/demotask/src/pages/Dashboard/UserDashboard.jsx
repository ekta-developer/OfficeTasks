import React, { useEffect, useState } from "react";
import DetailCards from "../../component/Dashboard/DetailCards";
import { Col, Row } from "reactstrap";
import { dashboardDataAPI, ddEmployeeAPI } from "../../API";
import Select from "react-select";
import { toast } from "react-toastify";

const UserDashboard = () => {
  const [data, setData] = useState();
  const [totalPresent, setTotalPresent] = useState();
  const [totalEmployee, setTotalEmployee] = useState();
  useEffect(() => {
    classListDD();
    Dashboard();
  }, []);
  const classListDD = () => {
    ddEmployeeAPI()
      .then((res) => {
        if (res.data.status === true) {
          setData(res.data.data); // Directly set the array
          setTotalEmployee(res.data.data.length); // ✅ update state
          // toast.success(res.data.message);
        } else if (res.data.status === false) {
          toast.error(res.data.message);
        } else if (res.data.status === "expired") {
          toast.error(res.data.message);
          logout(null, "student");
        }
      })
      .catch((err) => {
        console.log("catch", err);
      });
  };

  const Dashboard = () => {
    dashboardDataAPI().then((res) => {
      if (res.data?.status === true) {
        setData(res.data?.data);
        setTotalPresent();
      } else if (res.data?.status === false) {
        toast.error(res.data.message);
      } else if (res.data.status === "expired") {
        toast.error(res.data.message);
      }
    });
  };
  return (
    <>
      <div className="container-sm">
        <div className="section">
          <DetailCards totalEmployee={totalEmployee} />
          <Row>
            <Col md={4}>
              {" "}
              <div className="mt-4">
                <Select options={data}></Select>
              </div>
            </Col>
            <Col md={4}></Col>
            <Col md={4}></Col>
          </Row>
        </div>
      </div>
    </>
  );
};

export default UserDashboard;
