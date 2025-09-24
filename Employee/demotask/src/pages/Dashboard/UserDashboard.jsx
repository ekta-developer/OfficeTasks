import React, { useEffect, useState } from "react";
import DetailCards from "../../component/Cards/DetailCards";
import { ddEmployeeAPI, TodayAttendanceAPI } from "../../API";
import { toast } from "react-toastify";
import RegisterCard from "../../component/Cards/RegisterCard";
import AttendanceTable from "../../component/Tables/AttendanceTable";

const UserDashboard = () => {
  const [employeeData, setEmployeeData] = useState();
  const [attendanceData, setAttendanceData] = useState();
  useEffect(() => {
    classListDD();
    todayAttendanceData();
  }, []);
  const classListDD = () => {
    ddEmployeeAPI()
      .then((res) => {
        if (res.data.status === true) {
          setEmployeeData(res.data.data); // Directly set the array

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

  const todayAttendanceData = () => {
    TodayAttendanceAPI()
      .then((res) => {
        console.log(res.data, "RESPONSE");

        if (res.data.status === true) {
          setAttendanceData(res.data.data); // Directly set the array
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

  console.log(attendanceData, "TODAy attendfance");

  return (
    <>
      <div className="container-sm">
        <div className="section">
          <DetailCards data={attendanceData?.cardData} />
          <div className="p-3">
            <RegisterCard employeeData={employeeData} />
          </div>
          <div className="p-3">
            <AttendanceTable data={attendanceData?.TableData} />
          </div>
        </div>
      </div>
    </>
  );
};

export default UserDashboard;
