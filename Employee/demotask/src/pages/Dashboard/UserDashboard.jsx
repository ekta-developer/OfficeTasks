import React, { useEffect, useState } from "react";
import DetailCards from "../../component/Dashboard/DetailCards";
import { Col, Input, Label, Row } from "reactstrap";
import {
  dashboardDataAPI,
  ddEmployeeAPI,
  RegisterEmployeeAPI,
  TodayAttendanceAPI,
} from "../../API";
import Select from "react-select";
import { toast } from "react-toastify";
import UploadFileInput from "../../component/Fields/UploadFileInput";
import { Controller, useForm } from "react-hook-form";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Grid, TextField } from "@mui/material";

const UserDashboard = () => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    setError,
    control,
    trigger,
    clearErrors,
    formState: { errors },
  } = useForm({
    defaultValues: {
      employeeId: null,
      file: null,
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
  const onSubmit = (data) => {
    console.log(data, "Form Data");

    // Create FormData instance
    const formData = new FormData();
    formData.append("employeeId", data?.employeeId?.value);
    formData.append("name", data?.employeeId?.label);
    if (data.file) {
      formData.append("file", data.file[0]); // send binary file
    }

    RegisterEmployeeAPI(formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then((res) => {
        const status = res.data.status;
        if (status === true) {
          toast.success(res.data.message);
        } else if (status === false) {
          toast.error(res.data.message);
        } else if (status === "expired") {
          toast.error("Session expired");
        }
      })
      .catch((err) => {
        toast.error("Error: " + err.message);
      });
  };

  const handleFieldChange = (fieldName, selected) => {
    setValue(fieldName, selected, { shouldValidate: true });
    trigger(fieldName);
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
            <Card sx={{ minWidth: 275 }}>
              <CardContent>
                <Typography variant="h4" component="div">
                  Upload Face
                </Typography>
                <Typography sx={{ color: "text.secondary", mb: 1.5 }}>
                  All fields are required.
                </Typography>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <CardContent>
                    <Grid container spacing={3}>
                      {/* Employee Select */}
                      <Grid size={5}>
                        <Typography variant="subtitle1" gutterBottom>
                          Select Employee
                        </Typography>
                        <Controller
                          name="employeeId"
                          control={control}
                          rules={{ required: "This field is required" }}
                          render={({ field }) => (
                            <>
                              <Select
                                {...field}
                                options={data}
                                value={field.value}
                                onChange={(selected) => {
                                  field.onChange(selected);
                                  clearErrors("employeeId"); // clear error after selecting
                                }}
                                placeholder="Select Employee"
                                menuPortalTarget={document.body} // <-- render menu outside the card
                                styles={{
                                  menuPortal: (base) => ({
                                    ...base,
                                    zIndex: 9999,
                                  }), // ensure it's above everything
                                }}
                              />
                              {errors.employeeId && (
                                <Typography color="error" variant="body2">
                                  {errors.employeeId.message}
                                </Typography>
                              )}
                            </>
                          )}
                        />
                      </Grid>

                      {/* File Upload */}
                      <Grid size={5}>
                        <Typography variant="subtitle1" gutterBottom>
                          Upload Document
                        </Typography>
                        <Input
                          type="file"
                          accept="image/*,.pdf"
                          {...register("file", {
                            required: "This field is required",
                            validate: (fileList) => {
                              if (!fileList || fileList.length === 0)
                                return "File is required";
                              const file = fileList[0];
                              const validTypes = ["image/jpeg", "image/jpg"];
                              return (
                                validTypes.includes(file.type) ||
                                "Only JPG/JPEG files are allowed"
                              );
                            },
                          })}
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              setValue("file", e.target.files, {
                                shouldValidate: true,
                              });
                              clearErrors("file");
                            }
                          }}
                        />
                        {errors.file && (
                          <Typography color="error" variant="body2">
                            {errors.file.message}
                          </Typography>
                        )}
                      </Grid>

                      {/* Submit */}
                      <Grid
                        size="grow
                      "
                      >
                        <Typography className="mt-4 p-1"></Typography>
                        <Button
                          type="submit"
                          variant="contained"
                          color="primary"
                        >
                          Upload
                        </Button>
                      </Grid>
                    </Grid>
                  </CardContent>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserDashboard;
