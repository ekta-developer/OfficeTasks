import React, { useCallback, useEffect, useRef, useState } from "react";
import { Col, Input, Label, Row } from "reactstrap";
import { RegisterEmployeeAPI } from "../../API";
import Select from "react-select";
import { toast } from "react-toastify";
import { Controller, useForm } from "react-hook-form";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import {
  ClickAwayListener,
  Grid,
  List,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import Webcam from "react-webcam";
const RegisterCard = ({ employeeData }) => {
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
  const [showOptions, setShowOptions] = useState(false);
  const [uploadMethod, setUploadMethod] = useState("");
  const [preview, setPreview] = useState(null); // 👈 stores preview image
  const webcamRef = useRef(null);

  // Modified capture with preview
  const capture = useCallback(async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) {
      // Convert base64 → Blob → File
      const response = await fetch(imageSrc);
      const blob = await response.blob();
      const file = new File([blob], "captureFace.jpg", { type: "image/jpeg" });

      // Store file in form
      setValue("file", [file], { shouldValidate: true });
      clearErrors("file");

      // Store preview
      setPreview(imageSrc);
    }
  }, [webcamRef, setValue, clearErrors]);

  // Reset back to initial fake input
  const handleBack = () => {
    setUploadMethod("");
    setShowOptions(false);
    setPreview(null); // reset preview also
    setValue("file", null, { shouldValidate: true }); // reset file field
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
        console.log(status, "JJJJJJstatus from api");

        if (status === "Registered") {
          toast.success("Face Uploaded Successfully!");
        } else if (status === false) {
          toast.error(`${res.data.message} - No face found in uploaded image`);
        } else if (status === "expired") {
          toast.error("Session expired");
        }
      })
      .catch((err) => {
        toast.error("Error: No face found in uploaded image");
      });
  };

  return (
    <>
      <Card sx={{ minWidth: 275 }}>
        <CardContent>
          <Typography variant="h5" component="div">
            Upload Face
          </Typography>
          <Typography
            sx={{ color: "text.secondary", mb: 1.5, fontSize: "14px" }}
          >
            All fields are required.
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent>
              <Grid container spacing={3}>
                {/* Employee Select */}
                <Grid size={{ xs: 12, md: 5, lg: 5 }}>
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
                          options={employeeData}
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
                <Grid item size={{ xs: 12, md: 5, lg: 5 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Upload Document
                  </Typography>

                  {/* Fake input to trigger options */}
                  {!showOptions && !uploadMethod && (
                    <Input
                      readOnly
                      placeholder="Click to upload"
                      onClick={() => setShowOptions(true)}
                      fullWidth
                      {...register("file", {
                        required: "Please upload or capture an image",
                      })}
                      value={preview ? "Image selected" : ""}
                    />
                  )}

                  {/* Show error */}
                  {errors.file && (
                    <Typography color="error" variant="body2">
                      {errors.file.message}
                    </Typography>
                  )}

                  {/* Raw list of options */}
                  {showOptions && !uploadMethod && (
                    <ClickAwayListener
                      onClickAway={() => setShowOptions(false)}
                    >
                      <List
                        sx={{
                          border: "1px solid #ccc",
                          borderRadius: 1,
                          mt: 1,
                          width: "200px",
                          backgroundColor: "#fff",
                          position: "absolute",
                          zIndex: 10,
                        }}
                      >
                        <ListItemButton
                          onClick={() => {
                            setUploadMethod("device");
                            setShowOptions(false);
                          }}
                        >
                          <ListItemText primary="Upload from Device" />
                        </ListItemButton>

                        <ListItemButton
                          onClick={() => {
                            setUploadMethod("camera");
                            setShowOptions(false);
                          }}
                        >
                          <ListItemText primary="Use Camera" />
                        </ListItemButton>
                      </List>
                    </ClickAwayListener>
                  )}

                  {/* Device upload */}
                  {uploadMethod === "device" && (
                    <>
                      <Input
                        type="file"
                        accept="image/jpeg,image/jpg"
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
                            setPreview(URL.createObjectURL(file));
                          }
                        }}
                        fullWidth
                      />
                      {preview && (
                        <img
                          src={preview}
                          alt="Preview"
                          style={{
                            marginTop: "10px",
                            maxWidth: "100%",
                            borderRadius: "8px",
                          }}
                        />
                      )}
                      <Button
                        variant="outlined"
                        onClick={handleBack}
                        sx={{ mt: 1 }}
                      >
                        Back
                      </Button>
                    </>
                  )}

                  {/* Camera capture */}
                  {uploadMethod === "camera" && (
                    <>
                      {!preview ? (
                        <>
                          <Webcam
                            audio={false}
                            ref={webcamRef}
                            screenshotFormat="image/jpeg"
                            width="100%"
                          />
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={capture}
                            sx={{ mt: 1, mr: 1 }}
                          >
                            Capture
                          </Button>
                          <Button
                            variant="outlined"
                            onClick={handleBack}
                            sx={{ mt: 1 }}
                          >
                            Back
                          </Button>
                        </>
                      ) : (
                        <>
                          <img
                            src={preview}
                            alt="Captured Preview"
                            style={{
                              marginTop: "10px",
                              maxWidth: "100%",
                              borderRadius: "8px",
                            }}
                          />
                          <Button
                            variant="outlined"
                            onClick={() => setPreview(null)}
                            sx={{ mt: 1, mr: 1 }}
                          >
                            Retake
                          </Button>
                          <Button
                            variant="outlined"
                            onClick={handleBack}
                            sx={{ mt: 1 }}
                          >
                            Back
                          </Button>
                        </>
                      )}
                    </>
                  )}
                </Grid>
                {/* Submit */}
                <Grid size="grow">
                  <Typography className="mt-4 p-1"></Typography>
                  <Button type="submit" variant="contained" color="primary">
                    Upload
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </form>
        </CardContent>
      </Card>
    </>
  );
};

export default RegisterCard;
