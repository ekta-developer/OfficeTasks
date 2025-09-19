import React, { useEffect, useState } from "react";
import Select from "react-select";
import { ddEmployeeAPI } from "../../API";
const UserDashboard = () => {
  const [data, setData] = useState();
  useEffect(() => {
    classListDD();
  }, []);

  const classListDD = () => {
    ddEmployeeAPI()
      .then((res) => {
        if (res.data.status === true) {
          setData(res.data.data); // Directly set the array
          // toast.success(res.data.message);
        } else if (res.data.status === false) {
          // toast.error(res.data.message);
        } else if (res.data.status === "expired") {
          toast.error(res.data.message);
          logout(null, "student");
        }
      })
      .catch((err) => {
        console.log("catch", err);
      });
  };
  return (
    <div className="container">
      <div className="section">
        <Select options={data}></Select>
      </div>
    </div>
  );
};

export default UserDashboard;
