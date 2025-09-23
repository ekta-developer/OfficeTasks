import React, { useEffect, useState } from "react";
import DetailCards from "../../component/Cards/DetailCards";
import { ddEmployeeAPI, TodayAttendanceAPI } from "../../API";
import { toast } from "react-toastify";
import RegisterCard from "../../component/Cards/RegisterCard";
import AttendanceTable from "../../component/Tables/AttendanceTable";

const UserDashboard = () => {
  const [data, setData] = useState();
  const [totalAttendance, setTotalAttendance] = useState();
  const [totalEmployee, setTotalEmployee] = useState();
  useEffect(() => {
    classListDD();
    TodayAttendance();
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

  const TodayAttendance = () => {
    TodayAttendanceAPI().then((res) => {
      if (res.data?.status === true) {
        console.log(res.data, "TTTTTTTTTTTTTTTTTTTTTTTTTT");
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
          <DetailCards
            totalEmployee={totalEmployee}
            totalAttendance={totalAttendance}
          />
          <div className="p-3">
            <RegisterCard employeeData={data} />
          </div>
          <div className="p-3">
            <AttendanceTable />
          </div>
        </div>
      </div>
    </>
  );
};

export default UserDashboard;
