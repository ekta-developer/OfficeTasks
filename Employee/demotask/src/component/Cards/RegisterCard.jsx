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
  CircularProgress,
  ClickAwayListener,
  Grid,
  List,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import Webcam from "react-webcam";
import ReactCrop, { centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

// function to crop the image
function centerAspectCrop(mediaWidth, mediaHeight, aspect) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: "%",
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  );
}
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
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      employeeId: null,
      file: null,
    },
  });
  const [showOptions, setShowOptions] = useState(false);
  const [uploadMethod, setUploadMethod] = useState("");
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null); // 👈 stores preview image
  const [refreshKey, setRefreshKey] = useState(0); // 👈 used to refresh the upload field
  const webcamRef = useRef(null);
  const imgRef = useRef(null);
  const [showCropper, setShowCropper] = useState(false);
  const [croppedImage, setCroppedImage] = useState(null);
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState(null);
  const [aspect, setAspect] = useState(undefined); // free crop (no fixed aspect)

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
      // store cropped image
      setShowCropper(true);
    }
  }, [webcamRef, setValue, clearErrors]);

  // Reset back to initial fake input

  // reset to initial input
  const handleBack = () => {
    setUploadMethod("");
    setShowOptions(false);
    setPreview(null);
    setValue("file", null, { shouldValidate: true });
    setShowCropper(false);
    setCroppedImage(null);
  };
  const onSubmit = async (data) => {
    setLoading(true);

    try {
      // Prepare FormData
      const formData = new FormData();
      formData.append("employeeId", data?.employeeId?.value);
      formData.append("name", data?.employeeId?.label);
      if (data.file) {
        formData.append("file", data.file[0]);
      }

      const res = await RegisterEmployeeAPI(formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const status = res.data.status;

      // ✅ Handle success/failure cases
      if (status === "Registered") {
        toast.success("Face Uploaded Successfully!");
      } else if (status === false) {
        toast.error(`${res.data.message} - No face found in uploaded image`);
      } else if (status === "expired") {
        toast.error("Session expired");
      } else {
        toast.error("Unexpected response from server");
      }
    } catch (err) {
      console.log(err, "OPOPOOPPOPOPO");

      toast.error("Error: No face found in uploaded image");
    } finally {
      // ✅ Always reset UI after API call — success OR error
      reset();
      setPreview(null);
      setUploadMethod(null);
      setShowOptions(false);
      setRefreshKey((prev) => prev + 1);
      setLoading(false);
      setShowCropper(false);
      setCroppedImage(null);
      setCrop(null);
      setCompletedCrop(null);
    }
  };
  // when image selected from device
  const onSelectFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));
    setShowCropper(true);
  };

  const onImageLoad = (e) => {
    const { width, height } = e.currentTarget;
    setCrop(centerAspectCrop(width, height, aspect || 16 / 9));
  };

  const getCroppedImg = useCallback(async () => {
    if (!imgRef.current || !completedCrop) return;

    const canvas = document.createElement("canvas");
    const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
    const scaleY = imgRef.current.naturalHeight / imgRef.current.height;
    canvas.width = completedCrop.width;
    canvas.height = completedCrop.height;
    const ctx = canvas.getContext("2d");

    ctx.drawImage(
      imgRef.current,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      completedCrop.width,
      completedCrop.height
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (!blob) return;
        const croppedUrl = URL.createObjectURL(blob);
        setCroppedImage(croppedUrl);

        const file = new File([blob], "cropped.jpg", { type: "image/jpeg" });
        setValue("file", [file], { shouldValidate: true });
        clearErrors("file");

        setShowCropper(false);
        setPreview(null);
        resolve();
      }, "image/jpeg");
    });
  }, [completedCrop, clearErrors, setValue]);

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
                <Grid item size={{ xs: 12, md: 5, lg: 5 }} key={refreshKey}>
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

                  {/* Error */}
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
                  {/* Upload from Device */}
                  {uploadMethod === "device" &&
                    !showCropper &&
                    !croppedImage && (
                      <Input
                        type="file"
                        accept="image/jpeg,image/jpg,image/png"
                        onChange={onSelectFile}
                        fullWidth
                      />
                    )}

                  {/* Cropper Section */}
                  {showCropper && preview && (
                    <div
                      style={{
                        position: "relative",
                        width: "100%",
                        height: 400,
                      }}
                    >
                      <ReactCrop
                        crop={crop}
                        onChange={(_, percentCrop) => setCrop(percentCrop)}
                        onComplete={(c) => setCompletedCrop(c)}
                        aspect={aspect} // undefined = free crop
                      >
                        <img
                          ref={imgRef}
                          src={preview}
                          alt="Crop"
                          onLoad={onImageLoad}
                          style={{
                            maxWidth: "100%",
                            maxHeight: "400px",
                            objectFit: "contain",
                          }}
                        />
                      </ReactCrop>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          marginTop: "0px",
                          gap: "10px",
                        }}
                      >
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={getCroppedImg}
                          disabled={
                            !completedCrop?.width || !completedCrop?.height
                          }
                        >
                          Crop & Save
                        </Button>
                        <Button variant="outlined" onClick={handleBack}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Cropped Image (Optional Preview) */}
                  {croppedImage && (
                    <div
                      style={{
                        textAlign: "center",
                        marginTop: "10px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      <img
                        src={croppedImage}
                        alt="Cropped"
                        style={{
                          width: "40%",
                          borderRadius: "8px",
                          marginBottom: "10px",
                        }}
                      />
                      <Button variant="outlined" onClick={handleBack}>
                        Back
                      </Button>
                    </div>
                  )}

                  {/* Camera capture */}
                  {uploadMethod === "camera" && (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      {!preview ? (
                        <>
                          <Webcam
                            audio={false}
                            ref={webcamRef}
                            screenshotFormat="image/jpeg"
                            width="40%"
                            style={{
                              borderRadius: "8px",
                              marginBottom: "10px",
                            }}
                          />
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              gap: "10px",
                            }}
                          >
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={capture}
                            >
                              Capture
                            </Button>
                            <Button variant="outlined" onClick={handleBack}>
                              Back
                            </Button>
                          </div>
                        </>
                      ) : (
                        <>
                          <img
                            src={preview}
                            alt="Captured Preview"
                            style={{
                              marginTop: "10px",
                              width: "40%",
                              maxWidth: "100%",
                              borderRadius: "8px",
                              marginBottom: "10px",
                            }}
                          />
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              gap: "10px",
                            }}
                          >
                            <Button
                              variant="outlined"
                              onClick={() => setPreview(null)}
                            >
                              Retake
                            </Button>
                            <Button variant="outlined" onClick={handleBack}>
                              Back
                            </Button>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </Grid>
                {/* Submit */}
                <Grid size="grow">
                  <Typography className="mt-4 p-1"></Typography>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={loading}
                    startIcon={
                      loading ? (
                        <CircularProgress size={20} color="inherit" />
                      ) : null
                    }
                  >
                    {loading ? "Uploading..." : "Upload"}
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
