import React, { useEffect, useState } from "react";
import DetailCards from "../../component/Dashboard/DetailCards";
import { Col, Row } from "reactstrap";
import { dashboardDataAPI, ddEmployeeAPI, TodayAttendanceAPI } from "../../API";
import Select from "react-select";
import { toast } from "react-toastify";
import UploadFileInput from "../../component/Fields/UploadFileInput";
import { useForm } from "react-hook-form";

const UserDashboard = () => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    setError,
    trigger,
    clearErrors,
    formState: { errors },
  } = useForm({
    defaultValues: {
      document_1_img: "",
      document_1_Img_url: null, // ✅ must be null
    },
  });
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

  const handleImageChange = (e, image, image_url) => {
    const file = e.target.files[0];
    if (file) {
      setValue(image, file); // 👈 Set the actual file to the form
      setValue(image_url, URL.createObjectURL(file));
      clearErrors(image);
    }
  };
  const handleImageOpenPreview = (fieldName, row) => {
    setImageOpen((prev) => !prev); // toggle preview modal or state
    setValue(fieldName, row); // dynamically set field value
    trigger(fieldName); // trigger validation
  };
  return (
    <>
      <div className="container-sm">
        <div className="section">
          <DetailCards
            totalEmployee={totalEmployee}
            totalAttendance={totalAttendance}
          />
          <Row>
            <Col md={4}>
              {" "}
              <div className="mt-4">
                <Select options={data}></Select>
              </div>
            </Col>
            <Col>
              <div className="mt-4">
                {/* <UploadFileInput
                  handleImageChange={handleImageChange}
                  watch={watch}
                  register={register}
                  errors={errors}
                  setValue={setValue}
                  setError={setError}
                  clearErrors={clearErrors}
                  handleImageOpenPreview={handleImageOpenPreview}
                  // label=""
                  image="document_1_img"
                  image_url="document_1_Img_url"
                  validate={true} // Enable validation
                  design={true}
                  required={true}
                  validateDoc={true} // ✅ only validate for doc/image/pdf
                  name="document_1"
                /> */}
                <input class="form-control" type="file" id="formFile"></input>
              </div>
            </Col>
            <Col md={4}></Col>
          </Row>
        </div>
      </div>
    </>
  );
};

export default UserDashboard;
