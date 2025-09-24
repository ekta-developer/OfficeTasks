import React, { useEffect } from "react";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";

import { MdOutlineFileDownload } from "react-icons/md";
import { downloadFileFromUrl } from "../../utils/helperFunction";
import { BASE_URL_IMG } from "../../constants/Constant";
function ViewImgAndPdf({
  isOpen,
  toggleModal,
  titleName,
  images,
  currentImageIndex,
  fileType,
  reviewTable,
}) {
  const currentImage = images?.[currentImageIndex] || images;
  const isPdf = ["pdf", "application/pdf"].includes(fileType);

  // ✅ Detect if the URL is already a blob URL or a server path
  const isBlobUrl =
    typeof currentImage === "string" && currentImage.startsWith("blob:");
  const documentPreview =
    isBlobUrl || reviewTable ? currentImage : BASE_URL_IMG + currentImage;

  return (
    <Modal isOpen={isOpen} toggle={toggleModal} size="lg">
      <ModalHeader toggle={toggleModal}>
        {titleName}{" "}
        {
          <Button
            color="primary"
            size="sm"
            onClick={() =>
              downloadFileFromUrl(
                documentPreview, // Correct file path
                `${"Document"}` // Proper title (Label + filename)
              )
            }
            className="ms-2"
          >
            <MdOutlineFileDownload style={{ fontSize: "1.2rem" }} />
          </Button>
        }
      </ModalHeader>
      <ModalBody>
        {currentImage && (
          <div style={{ textAlign: "center" }}>
            {isPdf ? (
              <iframe
                className="img-thumbnail"
                src={reviewTable ? currentImage : documentPreview}
                type="application/pdf"
                style={{ height: "600px", width: "800px", objectFit: "cover" }}
                title="PDF Preview"
              />
            ) : (
              <img
                className="img-thumbnail"
                src={documentPreview}
                alt="Selected"
                style={{
                  height: "auto",
                  maxHeight: "600px",
                  width: "650px",
                  objectFit: "cover",
                }}
              />
            )}
          </div>
        )}
      </ModalBody>
    </Modal>
  );
}

export default ViewImgAndPdf;
