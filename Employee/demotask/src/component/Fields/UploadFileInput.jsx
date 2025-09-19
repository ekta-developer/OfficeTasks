import React, { useState } from "react";
import { Button, Col, Input } from "reactstrap";
import { useTranslation } from "react-i18next";
import { FaFilePdf } from "react-icons/fa";
import { MdOutlineFileDownload } from "react-icons/md";
import { BASE_URL_IMG } from "../../constants/Constant";
import { ValidateImgPdf } from "../../utils";
import Required from "../Required/Required";
import ViewImgAndPdf from "../Modals/ViewImgAdPdf";
import { downloadFileFromUrl } from "../../utils/helperFunction";

const UploadFileInput = ({
  watch,
  register,
  profile,
  handleImageChange,
  errors,
  setValue,
  setError,
  clearErrors,
  label,
  image,
  image_url,
  design = true,
  required,
  validateDoc,
  validateFunc,
  disable = false,
  resizeImage = false,
  resizeConfig,
  download = false, // NEW PROP
  status,
  fields,
  name,
}) => {
  const { t } = useTranslation();
  const [modalImages, setModalImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [titleName, setTitleName] = useState("");
  const [fileTypePreview, setFileTypePreview] = useState("");

  const ColProps = design ? { md: 3, sm: 3, xxl: 3 } : {};
  const fileType = watch(`${image}_type`);
  const file = watch(image);
  const fileUrl = watch(image_url);

  const fileName =
    file instanceof File
      ? file.name
      : typeof fileUrl === "string"
      ? fileUrl.split("/").pop()
      : "";
  const isPdfFile =
    fileType === "application/pdf" || fileName?.toLowerCase().endsWith(".pdf");

  const handleRemoveImage = () => {
    setValue(image, "");
    setValue(image_url, null);
    setValue(`${image}_type`, "");
    const input = document.getElementById(image);
    if (input) input.value = null;
  };

  const handleFileValidation = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Run custom validation
    ValidateImgPdf(file, async (isValid) => {
      if (!isValid) {
        // Show error if invalid format or signature
        setError(image, {
          type: "manual",
          message: t("Only PNG, JPEG or PDF files are allowed"),
        });
        e.target.value = null;
        setValue(image, "");
        return;
      }

      clearErrors(image);

      try {
        let processedFile = file;

        // If image and resize is enabled → compress
        if (file.type.startsWith("image/") && resizeImage) {
          processedFile = await resizeAndCompressImage(
            file,
            resizeConfig?.width || 132, // default width
            resizeConfig?.height || 170, // default height
            resizeConfig?.maxSizeKB || 100 // default max size in KB
          );
        }

        // Save processed file and preview
        setValue(`${image}_type`, processedFile.type);
        setValue(image, processedFile);
        setValue(image_url, URL.createObjectURL(processedFile));
        handleImageChange(e, image, image_url, processedFile);
      } catch (err) {
        setError(image, {
          type: "manual",
          message: t(err.message || "Image processing failed"),
        });
      }
    });
  };

  const handleImageClick = (index, imageUrlOrFile, inputName) => {
    setCurrentImageIndex(index);

    const displayTitle = /^document_\d+_img$/.test(inputName)
      ? `Document ${parseInt(inputName.match(/\d+/)?.[0] || "0", 10) + 1}`
      : inputName;

    setTitleName(displayTitle);

    let detectedType = "";

    if (imageUrlOrFile instanceof File || imageUrlOrFile instanceof Blob) {
      detectedType = imageUrlOrFile.type;
      const url = URL.createObjectURL(imageUrlOrFile);
      setModalImages([url]);
    } else if (typeof imageUrlOrFile === "string") {
      const lower = imageUrlOrFile.toLowerCase();
      if (lower.endsWith(".pdf")) {
        detectedType = "application/pdf";
      } else if (lower.endsWith(".png")) {
        detectedType = "image/png";
      } else if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) {
        detectedType = "image/jpeg";
      } else {
        detectedType = "unknown";
      }
      setModalImages([imageUrlOrFile]);
    }

    setFileTypePreview(detectedType);
    toggleModal();
  };

  const toggleModal = () => {
    setModalOpen((prev) => !prev);
  };

  return (
    <>
      <Col {...ColProps}>
        <div className="form-group">
          {label && (
            <label className="form-label" htmlFor={image}>
              {t(label)} {required && <Required />}
            </label>
          )}

          {(!watch(image_url) || errors?.[image]) && (
            <input
              type="file"
              accept="image/*,application/pdf"
              id={image}
              className="form-control w-0"
              {...register(image, {
                required: required
                  ? {
                      value: true,
                      message: t(
                        label ? `${label} is required` : "Image is required"
                      ),
                    }
                  : false,
                validate: validateFunc || undefined,
              })}
              onChange={handleFileValidation}
              placeholder={t("Upload")}
              disabled={disable}
            />

            //  <input className="form-control" type="file" id="formFile"></input>
          )}

          {errors?.[image] && (
            <span className="invalid">{t(errors[image]?.message)}</span>
          )}
        </div>

        <div className="col-md-3">
          {watch(image_url) && !profile && (
            <div className="d-flex align-items-center justify-content-between w-100">
              <div className="d-flex align-items-center">
                {!disable && (
                  <span
                    className="mx-2 text-danger fw-bold"
                    onClick={
                      !fields?.includes(name) && status
                        ? null
                        : handleRemoveImage
                    }
                    style={{ cursor: "pointer" }}
                  >
                    ✕
                  </span>
                )}
                {isPdfFile ? (
                  <Button
                    outline
                    color="danger"
                    onClick={() => handleImageClick(0, file, label || image)}
                    size="sm"
                    title={t("View PDF")}
                  >
                    <FaFilePdf style={{ width: "1rem", height: "1rem" }} />
                  </Button>
                ) : (
                  <img
                    src={watch(image_url)}
                    alt={image}
                    className="ms-2"
                    style={{
                      maxWidth: "80px",
                      maxHeight: "80px",
                      objectFit: "cover",
                      cursor: "pointer",
                      border:
                        fields?.includes(name) && status
                          ? "1px solid red"
                          : "none",
                    }}
                    onClick={() => handleImageClick(0, file, label || image)}
                  />
                )}
              </div>
              {download && (
                <Button
                  color="primary"
                  size="sm"
                  onClick={() =>
                    downloadFileFromUrl(
                      BASE_URL_IMG + fileName, // Correct file path
                      `${label || "Document"}_${fileName}` // Proper title (Label + filename)
                    )
                  }
                  className="ms-2"
                >
                  <MdOutlineFileDownload style={{ fontSize: "1.2rem" }} />
                </Button>
              )}
            </div>
          )}
        </div>
      </Col>

      <ViewImgAndPdf
        fileType={fileTypePreview}
        titleName={titleName}
        isOpen={modalOpen}
        toggleModal={() => setModalOpen((prev) => !prev)}
        images={modalImages}
        currentImageIndex={currentImageIndex}
        setCurrentImageIndex={setCurrentImageIndex}
        docUploadView={true}
      />
    </>
  );
};

export default UploadFileInput;
